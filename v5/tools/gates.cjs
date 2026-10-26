// Measurement gates for G3 on Chrome renders. Retains failing renders and per-glyph evidence.
// Usage: node tools/gates.cjs [workDir]
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { spawnSync } = require('node:child_process');
const { Browser, page } = require('./browser.cjs');
(async () => {
const studio = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(studio, 'orbit-fonts.js'))) require(path.join(studio, 'orbit-fonts.js'));
for (const m of ['tokens.js', 'astro.js', 'stars.js', 'sky.js', 'dragon-data.js', 'face.js', 'galaxia.js', 'vault5.js']) require(path.join(studio, m));
const F = globalThis.VaultFace, V5 = globalThis.VaultV5, M = V5.MOMENTS;
const work = path.resolve(process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'kw-gates-')));
fs.mkdirSync(work, { recursive: true });
const browser = await Browser.open();
const shoot = (svg, name, scale = 1) => browser.shoot(page(svg), path.join(work, name + '.png'), 450, 450, scale);
const job = { g1: [], g2: [], g3: [], names: [], micro: [], wake: [], footprint: { globe: [...V5.G.L, V5.G.LR], subdisc: [...V5.G.Q, V5.G.QR] }, P: V5.G.P };
try {
  job.open = await shoot(V5.maskSvg('open'), 'mask-open');
  for (let h = 0; h < 24; h++) job.g1.push(await shoot(F.render({ preset: 'vault5', uid: 's' + h, date: new Date(Date.UTC(2026, 9, 24, 15 + h, 0, 0)) }), `g1-h${h}`));
  for (const k of ['M1', 'M2', 'M3']) job.g1.push(await shoot(F.render({ preset: 'vault5', uid: 'g' + k, date: M[k] }), `g1-${k}`));
  for (const k of Object.keys(M)) job.g2.push(await shoot(F.render({ preset: 'vault5', uid: 'c' + k, date: M[k], hide: ['digits', 'date'] }), `g2-${k}`));
  for (const k of ['M1', 'M2', 'M6', 'M7']) job.g3.push(await shoot(F.render({ preset: 'vault5', uid: 'a' + k, date: M[k], mode: 'ambient' }), `g3-${k}`, 3));
  for (const a of V5.ANCHORS) {
    const p = V5.dial(a.ra, a.dec, 0).map((v, i) => v - V5.G.P[i]);
    job.names.push({ name: a.name, anchor: p, stars: a.ids.map(id => V5.PSTAR[id]).filter(Boolean).map(s => V5.dial(s.raD, s.decP, 0).map((v, i) => v - V5.G.P[i])) });
  }
  // G11: include raised T4 tspans inside the T1 date and T2 battery.
  // A white isolated fill mask excludes the telemetry halo but preserves clipping/transforms.
  for (const moment of ['M1', 'M2']) {
    const full = await shoot(F.render({ preset: 'vault5', uid: 'micro', date: M[moment] }), `g11-${moment}`);
    const glyphs = await browser.evaluate(`(()=>{const all=Array.from(document.querySelectorAll('text[data-tier="T4"],tspan[data-tier="T4"]'));window.gateGlyphs=all;return all.map((el,index)=>{let visible=true;for(let p=el;p&&p instanceof SVGElement;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||Number(s.opacity)===0)visible=false}const b=el.getBBox(),m=el.getCTM();const p=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(q=>new DOMPoint(...q).matrixTransform(m));const cells=[];for(let i=0;i<el.getNumberOfChars();i++){const c=el.getExtentOfChar(i);const q=[[c.x,c.y],[c.x+c.width,c.y],[c.x,c.y+c.height],[c.x+c.width,c.y+c.height]].map(v=>new DOMPoint(...v).matrixTransform(m));cells.push([Math.min(...q.map(v=>v.x)),Math.min(...q.map(v=>v.y)),Math.max(...q.map(v=>v.x)),Math.max(...q.map(v=>v.y))])}return {index,text:el.textContent,frame:el.getAttribute('data-frame'),visible,cells,bbox:[Math.min(...p.map(q=>q.x)),Math.min(...p.map(q=>q.y)),Math.max(...p.map(q=>q.x)),Math.max(...p.map(q=>q.y))]}}).filter(e=>e.visible)})()`);
    await browser.evaluate(`(()=>{document.querySelectorAll('svg use').forEach(el=>el.remove());document.querySelectorAll('svg path,svg circle,svg rect,svg ellipse,svg line,svg polyline,svg polygon,svg image,svg text,svg use').forEach(el=>{if(!el.closest('defs,clipPath,mask,filter,marker,pattern'))el.setAttribute('data-gate-hide','')});const s=document.createElement('style');s.textContent='[data-gate-hide]{visibility:hidden !important}[data-gate-glyph],[data-gate-glyph] *{visibility:visible !important;fill:#fff !important;fill-opacity:1 !important;opacity:1 !important;stroke:none !important;filter:none !important}';document.head.append(s);return true})()`);
    for (const glyph of glyphs) {
      await browser.evaluate(`(()=>{document.querySelector('[data-gate-glyph]')?.removeAttribute('data-gate-glyph');window.gateGlyphs[${glyph.index}].setAttribute('data-gate-glyph','');return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))})()`);
      const mask = await browser.capture(path.join(work, `g11-${moment}-${glyph.index}-mask.png`));
      job.micro.push({ moment, full, mask, ...glyph });
    }
  }
  // G12: the official path at the fixed frame, before 3 px Euclidean dilation in Python.
  const dg = F.parts;
  job.dragon = await shoot(`<svg xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 450 450"><g fill="#fff" transform="${dg.dragonAt(...V5.G.dragon)}">${dg.dragonPath()}</g></svg>`, 'mask-dragon');
  job.phosphor = job.micro.find(m => m.moment === 'M1')?.full || await shoot(F.render({ preset: 'vault5', date: M.M1 }), 'g12-M1');
  for (const moment of ['M1', 'M2']) {
    const input = { preset: 'vault5', uid: 'wake', date: M[moment], frame: { toMode: 'active', ms: 100 } };
    job.wake.push({ moment, file: await shoot(F.render(input), `wake-${moment}-100`), withoutFootprints: await shoot(F.render({ ...input, hide: ['globe-aod', 'subdisc-aod'] }), `wake-${moment}-100-without-footprints`) });
  }
} finally { await browser.close(); }
const spec = path.join(work, 'gates.json'); fs.writeFileSync(spec, JSON.stringify(job, null, 2));
const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, ['-I', path.join(__dirname, 'gates.py'), spec], { encoding: 'utf8' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
console.log(`Gate evidence: ${work}`);
const depth = spawnSync(process.execPath, [path.join(__dirname, 'depth-gates.cjs'), path.join(work, 'depth')], { encoding: 'utf8' });
if (depth.stdout) process.stdout.write(depth.stdout);
if (depth.stderr) process.stderr.write(depth.stderr);
if (depth.error) throw depth.error;
process.exit(result.status || depth.status || (/FAIL|NOTMEASURED/.test(result.stdout + depth.stdout) ? 1 : 0));
})().catch(e => { console.error(e.stack || e); process.exit(1); });
