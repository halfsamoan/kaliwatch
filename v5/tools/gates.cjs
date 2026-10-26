// Measurement gates for G3 (docs/debate/07-final-spec-v2.md section 8.4) on real renders:
//   G1 sky brightness over a 24 h LST sweep, G2 calm under the digits, G3 always-on lit share,
//   G8 composition (open sky, mirror difference), G9 names readable at every LST.
// Renders with headless Chrome (same engine as the studio), measures with tools/gates.py.
// Usage: node tools/gates.cjs [workDir]
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { execFileSync } = require('node:child_process');
const studio = path.resolve(__dirname, '..');
for (const m of ['tokens.js', 'astro.js', 'stars.js', 'sky.js', 'dragon-data.js', 'face.js', 'galaxia.js', 'vault5.js']) require(path.join(studio, m));
const F = globalThis.VaultFace, V5 = globalThis.VaultV5;
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const work = path.resolve(process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'kw-gates-')));
fs.mkdirSync(work, { recursive: true });
const fontUrl = 'file:///' + path.join(studio, 'fonts', 'RobotoMono.ttf').split(path.sep).join('/').split('/').map((s, i) => i === 0 ? s : encodeURIComponent(s)).join('/');
function shoot(svg, name, scale = 1) {
  const html = path.join(work, name + '.html'), png = path.join(work, name + '.png');
  fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:OrbitMono;src:url('${fontUrl}')}html,body{margin:0;background:#000}svg{display:block}</style></head><body>${svg}</body></html>`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--force-device-scale-factor=${scale}`, '--window-size=450,450', `--screenshot=${png}`, 'file:///' + html.split(path.sep).join('/')], { stdio: 'pipe', timeout: 60000 });
  fs.unlinkSync(html); return png;
}
const M = V5.MOMENTS, job = { open: shoot(V5.maskSvg('open'), 'mask-open'), g1: [], g2: [], g3: [], names: [] };
// G1: 24 hourly samples (LST sweeps the full circle) plus M1 to M3.
for (let h = 0; h < 24; h++) job.g1.push(shoot(F.render({ preset: 'vault5', uid: 's' + h, date: new Date(Date.UTC(2026, 9, 24, 15 + h, 0, 0)) }), `g1-h${h}`));
for (const k of ['M1', 'M2', 'M3']) job.g1.push(shoot(F.render({ preset: 'vault5', uid: 'g' + k, date: M[k] }), `g1-${k}`));
// G2: what passes under the glass, digits and date hidden, M1 to M8.
for (const k of Object.keys(M)) job.g2.push(shoot(F.render({ preset: 'vault5', uid: 'c' + k, date: M[k], hide: ['digits', 'date'] }), `g2-${k}`));
// G3: always-on at device scale 3, box-downsampled to 450 in gates.py.
for (const k of ['M1', 'M2', 'M6', 'M7']) job.g3.push(shoot(F.render({ preset: 'vault5', uid: 'a' + k, date: M[k], mode: 'ambient' }), `g3-${k}`, 3));
// G9: name label boxes and figure stars in the sky frame (origin P, LST 0); gates.py turns them with LST.
for (const a of V5.ANCHORS) {
  const p = V5.dial(a.ra, a.dec, 0).map((v, i) => v - V5.G.P[i]);
  job.names.push({ name: a.name, anchor: p, stars: a.ids.map(id => V5.PSTAR[id]).filter(Boolean).map(s => V5.dial(s.raD, s.decP, 0).map((v, i) => v - V5.G.P[i])) });
}
job.P = V5.G.P;
const spec = path.join(work, 'gates.json'); fs.writeFileSync(spec, JSON.stringify(job));
const out = execFileSync(process.env.PYTHON || 'python', ['-I', path.join(__dirname, 'gates.py'), spec], { encoding: 'utf8' });
process.stdout.write(out);
process.exit(/FAIL/.test(out) ? 1 : 0);
