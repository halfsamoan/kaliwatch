// Reference-sheet renderer: writes face SVGs into HTML pages and screenshots them with headless Chrome
// (same engine as the studio, so fonts/filters match). Usage:
//   node tools/render-refs.cjs <outDir> [round-label]
// Produces per-variant PNGs (active day/night, AOD, wake frames) and contact sheets.
// STATES=M1,M2,aod:M6 picks named moments (VaultV5.MOMENTS) or ISO dates instead of the default three; with
// more than one preset a comparison sheet of the first two states is added.
const fs = require('node:fs'), path = require('node:path');
const { Browser, page } = require('./browser.cjs');
(async () => {
const studio = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(studio, 'orbit-fonts.js'))) require(path.join(studio, 'orbit-fonts.js'));
for (const m of ['tokens.js', 'astro.js', 'stars.js', 'sky.js', 'dragon-data.js', 'face.js', 'galaxia.js', 'vault5.js']) require(path.join(studio, m));
const F = globalThis.VaultFace;
const outDir = path.resolve(process.argv[2] || path.join(studio, 'refs')), label = process.argv[3] || 'round';
const presets = (process.env.PRESETS || Object.keys(F.PRESETS).join(',')).split(',');
fs.mkdirSync(outDir, { recursive: true });
const browser = await Browser.open();
const shoot = (...args) => browser.shoot(...args);
try {
const MOMENTS = (globalThis.VaultV5 || {}).MOMENTS || {};
const STATES = process.env.STATES ? process.env.STATES.split(',').map(tok => {
  const aod = tok.startsWith('aod:'), id = aod ? tok.slice(4) : tok, date = MOMENTS[id] || id;
  return { key: (aod ? 'aod-' : '') + id.replace(/[^A-Za-z0-9-]/g, ''), title: `${aod ? 'AOD' : 'Active'} ${MOMENTS[id] ? id + ' ' : ''}${date.slice(0, 16).replace('T', ' ')}`, input: { date, mode: aod ? 'ambient' : 'active' } };
}) : [
  { key: 'day', title: 'Active 10:08 (day)', input: { date: '2026-10-25T10:08:24+09:00' } },
  { key: 'night', title: 'Active 21:42 (night)', input: { date: '2026-10-25T21:42:37+09:00' } },
  { key: 'aod', title: 'AOD 21:42', input: { date: '2026-10-25T21:42:37+09:00', mode: 'ambient' } }
];
const wakeDate = STATES.find(st => st.input.mode !== 'ambient')?.input.date || STATES[0].input.date;
const FRAMES = [0, 60, 100, 120, 180, 240, 300, 360];
const made = [];
for (const p of presets) {
  const faces = [];
  for (const st of STATES) {
    const svg = F.render({ preset: p, uid: `${p}-${st.key}`, ...st.input });
    const png = path.join(outDir, `${label}-${p}-${st.key}.png`);
    await shoot(page(svg), png, 450, 450, 2); made.push(png); faces.push({ svg, title: st.title });
  }
  // Wake strip: AOD -> Active at 0..360 ms.
  const strip = FRAMES.map(ms => `<div style="display:inline-block;margin:0 6px;text-align:center;color:#9BAB9C;font:12px OrbitMono">${F.render({ preset: p, uid: `${p}-w${ms}`, date: wakeDate, frame: { toMode: 'active', ms } }).replace('width="450" height="450"', 'width="220" height="220"')}<div style="margin-top:6px">${ms} ms</div></div>`).join('');
  const wpng = path.join(outDir, `${label}-${p}-wake.png`);
  await shoot(page(`<div style="padding:14px;white-space:nowrap">${strip}</div>`), wpng, FRAMES.length * 232 + 28, 270, 1.5); made.push(wpng);
  // Contact sheet: 3 states side by side with labels.
  const sheet = faces.map(fc => `<div style="display:inline-block;margin:0 10px;text-align:center;color:#C9D6D2;font:14px OrbitMono">${fc.svg.replace('width="450" height="450"', 'width="400" height="400"')}<div style="margin-top:8px">${fc.title}</div></div>`).join('');
  const spng = path.join(outDir, `${label}-${p}-sheet.png`);
  await shoot(page(`<div style="padding:16px;white-space:nowrap"><div style="color:#A6F46A;font:16px OrbitMono;margin:0 10px 12px">${F.PRESETS[p].label}  ·  ${F.PRESETS[p].note}</div>${sheet}</div>`), spng, STATES.length * 420 + 32, 480, 1.25); made.push(spng);
}
if (presets.length > 1) for (const st of STATES.slice(0, 2)) {
  const row = presets.map(p => `<div style="display:inline-block;margin:0 10px;text-align:center;color:#C9D6D2;font:14px OrbitMono">${F.render({ preset: p, uid: `cmp-${p}-${st.key}`, ...st.input }).replace('width="450" height="450"', 'width="400" height="400"')}<div style="margin-top:8px">${F.PRESETS[p].label}</div></div>`).join('');
  const cpng = path.join(outDir, `${label}-compare-${st.key}.png`);
  await shoot(page(`<div style="padding:16px;white-space:nowrap"><div style="color:#A6F46A;font:16px OrbitMono;margin:0 10px 12px">${st.title}</div>${row}</div>`), cpng, presets.length * 420 + 32, 480, 1.25); made.push(cpng);
}
console.log(made.join('\n'));

} finally { await browser.close(); }
})().catch(e => { console.error(e.stack || e); process.exit(1); });
