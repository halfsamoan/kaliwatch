// Shared Chrome renderer. CDP waits for font promises and two paint frames before capture.
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
function chromePath() {
  const candidates = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const hit = candidates.find(p => fs.existsSync(p));
  if (!hit) throw new Error('Chrome not found; set CHROME to the browser executable.');
  return hit;
}
const studio = path.resolve(__dirname, '..');
function fontCSS() {
  const font = (family, file, weight = 400) => `@font-face{font-family:${family};font-weight:${weight};src:url('${pathToFileURL(path.join(studio, 'fonts', file)).href}')} `;
  let css = font('OrbitMono', 'RobotoMono.ttf');
  for (const [family, file, weight] of [['OrbitWide', 'MartianMono-Wide-SemiBold.ttf', 600], ['OrbitStd', 'MartianMono-Std-Medium.ttf', 500], ['OrbitStd', 'MartianMono-Std-Regular.ttf', 400], ['OrbitCond', 'MartianMono-Cond-Regular.ttf', 400]]) {
    if (fs.existsSync(path.join(studio, 'fonts', file))) css += font(family, file, weight);
  }
  return css + 'html,body{margin:0;background:#000}svg{display:block}';
}
const page = body => `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS()}</style></head><body>${body}</body></html>`;
class Browser {
  static async open() { const b = new Browser(); await b.start(); return b; }
  async start() {
    this.pending = new Map(); this.seq = 0; this.buffer = ''; this.stderr = '';
    this.profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kw-chrome-'));
    const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${this.profile}`];
    if (process.getuid?.() === 0) args.push('--no-sandbox');
    this.proc = spawn(chromePath(), args, { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
    this.proc.stderr.on('data', d => { this.stderr = (this.stderr + d).slice(-6000); });
    this.proc.stdio[4].on('data', d => {
      this.buffer += d; let i;
      while ((i = this.buffer.indexOf('\0')) >= 0) {
        const s = this.buffer.slice(0, i); this.buffer = this.buffer.slice(i + 1); if (!s) continue;
        const m = JSON.parse(s), p = this.pending.get(m.id);
        if (p) { this.pending.delete(m.id); clearTimeout(p.timer); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); }
      }
    });
    this.proc.on('error', e => this.rejectPending(e));
    this.proc.on('exit', (code, signal) => this.rejectPending(new Error(`Chrome exited (${code}, ${signal}): ${this.stderr}`)));
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    this.session = (await this.send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
    await this.send('Page.enable'); await this.send('Runtime.enable');
  }
  rejectPending(e) { for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(e); } this.pending.clear(); }
  send(method, params = {}) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`Chrome CDP timeout: ${method}\n${this.stderr}`)); }, 60000);
      this.pending.set(id, { resolve, reject, timer });
      this.proc.stdio[3].write(JSON.stringify({ id, method, params, ...(this.session ? { sessionId: this.session } : {}) }) + '\0');
    });
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ': ' + (r.exceptionDetails.exception?.description || ''));
    return r.result.value;
  }
  async load(html, file, width = 450, height = 450, scale = 1) {
    fs.writeFileSync(file, html);
    await this.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });
    const nav = await this.send('Page.navigate', { url: pathToFileURL(file).href });
    if (nav.errorText) throw new Error(nav.errorText);
    // A navigation reply can precede document commit; never inspect the previous page's fonts.
    if (nav.loaderId) {
      const deadline = Date.now() + 60000;
      while ((await this.send('Page.getFrameTree')).frameTree.frame.loaderId !== nav.loaderId) {
        if (Date.now() > deadline) throw new Error('Chrome navigation did not commit');
        await new Promise(r => setTimeout(r, 10));
      }
    }
    await this.evaluate(`(async()=>{while(document.readyState!=='complete')await new Promise(r=>setTimeout(r,10));await document.fonts.ready;await Promise.all(Array.from(document.fonts,f=>f.load()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return true})()`);
    const fonts = await this.evaluate(`Array.from(document.fonts,f=>({family:f.family,status:f.status})).filter(f=>f.status!=='loaded')`);
    if (fonts.length) throw new Error('Fonts failed to load: ' + JSON.stringify(fonts));
  }
  async capture(png) { const { data } = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }); fs.writeFileSync(png, Buffer.from(data, 'base64')); return png; }
  async shoot(html, png, width = 450, height = 450, scale = 1) {
    const file = path.join(this.profile, `capture-${this.seq}.html`);
    try { await this.load(html, file, width, height, scale); return await this.capture(png); }
    finally { fs.rmSync(file, { force: true }); }
  }
  async close() {
    if (this.proc && this.proc.exitCode === null) { try { await this.send('Browser.close'); } catch {} }
    if (this.proc && this.proc.exitCode === null) await new Promise(r => { const t = setTimeout(() => { this.proc.kill(); r(); }, 3000); this.proc.once('exit', () => { clearTimeout(t); r(); }); });
    fs.rmSync(this.profile, { recursive: true, force: true });
  }
}
module.exports = { Browser, chromePath, fontCSS, page, pathToFileURL };
