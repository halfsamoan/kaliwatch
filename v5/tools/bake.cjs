// Transparent Chrome 2x captures -> exact PIL box reduction -> reproducible manifest.
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { createHash } = require('node:crypto'), { execFileSync } = require('node:child_process');
const { Browser } = require('./browser.cjs'), B = require('../bake-sources.js');
const root = path.resolve(__dirname, '..'), hash = data => createHash('sha256').update(data).digest('hex');
async function bake() {
  const output = path.join(root, 'assets'); fs.mkdirSync(output, { recursive: true });
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'kw-bake-')), browser = await Browser.open();
  const selected = process.argv.slice(2), assets = [];
  try {
    await browser.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    for (const a of B.assets.filter(a => !selected.length || selected.includes(a.id))) {
      const svg = B.render(a.id), page = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>${svg}</body></html>`;
      const large = path.join(temp, a.id + '.png'), html = path.join(temp, a.id + '.html'), file = path.join(root, a.file);
      await browser.load(page, html, a.deviceWidth, a.deviceHeight, 2); await browser.capture(large);
      const metadata = JSON.parse(execFileSync(process.env.PYTHON || 'python3', ['-I', path.join(__dirname, 'reduce.py'), large, file], { encoding: 'utf8' }));
      if (metadata.width !== a.deviceWidth || metadata.height !== a.deviceHeight) throw new Error(`Unexpected PNG size for ${a.id}`);
      const data = fs.readFileSync(file);
      assets.push({ ...metadata, ...a, pngWidth: metadata.width, pngHeight: metadata.height,
        bytes: data.length, decodedBytes: a.deviceWidth * a.deviceHeight * 4, sha256: hash(data), sourceSHA256: hash(svg) });
      console.log(`${a.id}: ${a.deviceWidth}x${a.deviceHeight} RGBA ${data.length} bytes`);
    }
    const previous = selected.length && fs.existsSync(path.join(output, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(output, 'manifest.json'), 'utf8')).assets : [];
    const merged = B.assets.map(a => assets.find(n => n.id === a.id) || previous.find(n => n.id === a.id)).filter(Boolean);
    const fonts = require('../orbit-fonts.js').faces.map(({ file, family, weight, width }) => ({ file: `fonts/${file}`, family, weight, width, sha256: hash(fs.readFileSync(path.join(root, 'fonts', file))) }));
    const manifest = { version: 1, designScale: B.ratio, supersample: 2, pixelFormat: 'RGBA8888', colorSpace: 'sRGB', assets: merged, fonts };
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  } finally { await browser.close(); fs.rmSync(temp, { recursive: true, force: true }); }
}
bake().catch(e => { console.error(e.stack); process.exitCode = 1; });
