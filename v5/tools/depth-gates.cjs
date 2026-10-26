// Additional final-spec section 8.4 gates: G5 thumbnail, G6 one light, G7 depth.
// Evidence is preserved. Missing source metadata is NOTMEASURED and exits 1.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), { spawnSync } = require('node:child_process');
const { Browser, page } = require('./browser.cjs');
(async () => {
const studio = path.resolve(__dirname, '..');
for (const m of ['orbit-fonts', 'tokens', 'astro', 'stars', 'sky', 'dragon-data', 'face', 'galaxia', 'vault5']) require(path.join(studio, m + '.js'));
const F = globalThis.VaultFace, V = globalThis.VaultV5, A = globalThis.KaliAstro;
const work = path.resolve(process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'kw-depth-'))); fs.mkdirSync(work, { recursive: true });
const browser = await Browser.open(), job = { thumbnail: [], depth: [], geometry: V.G, horizonHalfAngle: V.HCUT, light: null };
const svgAt = (moment, size, extra = {}) => F.render({ preset: 'vault5', uid: 'depth', date: V.MOMENTS[moment], ...extra }).replace('width="450" height="450"', `width="${size}" height="${size}"`);
const capture = async (svg, name, size, selector, mode) => {
  const png = path.join(work, name + '.png'), file = path.join(work, 'capture.html');
  await browser.load(page(svg), file, size, size, 1);
  if (selector) {
    const found = await browser.evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`);
    if (!found) return null;
    await browser.evaluate(`(()=>{const targets=Array.from(document.querySelectorAll(${JSON.stringify(selector)}));const selected=el=>targets.some(t=>t===el||t.contains(el));for(const el of document.querySelectorAll('svg path,svg circle,svg rect,svg ellipse,svg line,svg polyline,svg polygon,svg image,svg text,svg tspan,svg textPath,svg use')){if(el.closest('defs,clipPath,mask,filter,marker,pattern'))continue;const own=selected(el),s=getComputedStyle(el);if(${JSON.stringify(mode)}==='without'){if(own)el.style.setProperty('visibility','hidden','important');continue}if(${JSON.stringify(mode)}==='only'){if(!own)el.style.setProperty('visibility','hidden','important');continue}if(s.fill!=='none')el.style.setProperty('fill',own?'#fff':'#000','important');if(s.stroke!=='none')el.style.setProperty('stroke',own?'#fff':'#000','important')}return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))})()`);
  }
  return browser.capture(png);
};
function circlePoints(cx, cy, radius, from = 0, to = 360) {
  const out = [], n = Math.ceil(Math.abs(to - from) * radius * Math.PI / 180);
  for (let i = 0; i < n; i++) { const a = (from + (to - from) * (i + 0.5) / n) * Math.PI / 180; out.push([cx + radius * Math.sin(a), cy - radius * Math.cos(a), Math.sin(a), -Math.cos(a)]); } return out;
}
try {
  job.open = await capture(V.maskSvg('open').replace('width="450" height="450"', 'width="150" height="150"'), 'open-150', 150);
  const d = F.parts;
  job.dragon = await capture(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 450 450"><g transform="${d.dragonAt(...V.G.dragon)}" fill="#fff">${d.dragonPath()}</g></svg>`, 'dragon-150', 150);
  for (const moment of ['M1', 'M7', 'M8']) {
    const svg = svgAt(moment, 150), date = new Date(V.MOMENTS[moment]), sk = A.sky(date, globalThis.VaultTokens.site), sol = V.solar(date, sk.lst), phase = V.moonSprite(sk.moon.age);
    const full = await capture(svg, moment + '-150', 150);
    const thumb = { moment, full, phase, milky: await capture(svg, moment + '-milky-150', 150, '[data-layer="milky-way"]', 'only'), rotor: F.pt(V.G.rotorR, sol.E3), withoutGlobe: await capture(svgAt(moment, 150, { hide: ['globe'] }), moment + '-150-without-globe', 150) };
    if (moment === 'M1') {
      thumb.f1 = await capture(svg, 'surface-f1-150', 150, '[data-gate-surface="f1"]', 'only');
      thumb.f2 = await capture(svg, 'surface-f2-150', 150, '[data-gate-surface="f2"]', 'only');
    }
    // This is the exact phase silhouette used by VaultV5.source.globe, clipped by the aperture.
    const radius = V.G.LR, E = phase * 22.5, rx = Math.abs(Math.cos(E * Math.PI / 180)) * radius;
    const lit = `M0 ${-radius}A${radius} ${radius} 0 0 1 0 ${radius}A${rx} ${radius} 0 0 ${E > 90 ? 1 : 0} 0 ${-radius}Z`;
    thumb.litMask = await capture(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 450 450"><defs><clipPath id="ap"><circle cx="225" cy="225" r="180"/></clipPath></defs><g clip-path="url(#ap)"><g transform="translate(${V.G.L.join(' ')}) rotate(225)"><path d="${lit}" fill="${phase ? '#fff' : '#000'}"/></g></g></svg>`, moment + '-lit-mask', 150);
    job.thumbnail.push(thumb);
  }
  const edges = ['lip', 'step', 'chamfer', 'bead', 'plate-bevel', 'subdisc-lip', 'dragon-bevel'];
  const shadows = ['dragon-crescent', 'subdisc-floor', 'rotor-lip', 'plate-sky'];
  for (const moment of ['M1', 'M2', 'M3']) {
    const svg = svgAt(moment, 480), entry = { moment, full: await capture(svg, moment + '-480', 480), edges: [], shadows: [], clouds: await capture(svg, moment + '-clouds-480', 480, '[data-layer="milky-way"]', 'only') };
    for (const name of edges) {
      const selector = `[data-gate-edge="${name}"]`, mask = await capture(svg, `${moment}-edge-${name}`, 480, selector, 'contribution');
      let points;
      if (['lip', 'step', 'chamfer'].includes(name)) { const ring = V.G[name]; points = circlePoints(225, 225, (ring[0] + ring[1]) / 2); }
      else if (name === 'subdisc-lip') points = circlePoints(...V.G.Q, 59.25);
      else if (name === 'bead') points = circlePoints(...V.G.H, V.G.HR + 2.5, -V.HCUT, V.HCUT);
      else if (mask) points = await browser.evaluate(`(()=>{const out=[];for(const p of document.querySelectorAll(${JSON.stringify(selector + ' path')})){if(!p.getTotalLength)continue;const n=p.getTotalLength(),m=p.getCTM(),k=450/480;for(let t=.5;t<n;t+=1){const q=p.getPointAtLength(t),a=p.getPointAtLength(Math.max(0,t-.25)),b=p.getPointAtLength(Math.min(n,t+.25)),Q=new DOMPoint(q.x,q.y).matrixTransform(m),U=new DOMPoint(a.x,a.y).matrixTransform(m),W=new DOMPoint(b.x,b.y).matrixTransform(m),dx=W.x-U.x,dy=W.y-U.y,l=Math.hypot(dx,dy);if(l>0)out.push([Q.x*k,Q.y*k,-dy/l,dx/l])}}return out})()`);
      entry.edges.push({ name, mask, points: points || [] });
    }
    for (const name of shadows) {
      const selector = `[data-gate-shadow="${name}"]`;
      entry.shadows.push({ name, mask: await capture(svg, `${moment}-shadow-${name}`, 480, selector, 'contribution'), without: await capture(svg, `${moment}-without-${name}`, 480, selector, 'without') });
    }
    job.depth.push(entry);
  }
  const source = path.join(studio, 'bake-sources.js');
  if (fs.existsSync(source)) {
    const bakes = require(source); job.light = bakes.lightAudit || globalThis.VaultBakes?.lightAudit || null;
    if (job.light) {
      await browser.load(page(svgAt('M3', 480)), path.join(work, 'capture.html'), 480, 480, 1);
      const selectors = [...(job.light.shadows || []), ...(job.light.highlights || [])];
      job.light = JSON.parse(JSON.stringify(job.light));
      for (let i = 0; i < selectors.length; i++) {
        const item = selectors[i], list = i < (job.light.shadows || []).length ? job.light.shadows : job.light.highlights;
        const index = i < (job.light.shadows || []).length ? i : i - job.light.shadows.length;
        list[index].selectorMatches = item.selector ? await browser.evaluate(`document.querySelectorAll(${JSON.stringify(item.selector)}).length`) : 0;
        if (i < (job.light.shadows || []).length && item.selector) list[index].actualOffset = await browser.evaluate(`(()=>{const s=document.querySelector(${JSON.stringify(item.selector)});if(!s)return null;if(s.transform?.baseVal.numberOfItems){const m=s.transform.baseVal.consolidate().matrix;return [m.e,m.f]}const id=${JSON.stringify(item.id)};if(id==='rotor-lip'){const b=document.querySelector('[data-bake="cage_body"] circle');return [s.cx.baseVal.value-b.cx.baseVal.value,s.cy.baseVal.value-b.cy.baseVal.value]}if(id==='subdisc-floor'){const b=s.parentElement.querySelector('circle');return [s.cx.baseVal.value-b.cx.baseVal.value,s.cy.baseVal.value-b.cy.baseVal.value]}if(id==='plate-sky'){const b=document.querySelector('[data-layer="plate"] path'),a=s.getPointAtLength(0),q=b.getPointAtLength(0);return [a.x-q.x,a.y-q.y]}return null})()`);
      }
    }
  }
} finally { await browser.close(); fs.rmSync(path.join(work, 'capture.html'), { force: true }); }
const spec = path.join(work, 'depth-gates.json'); fs.writeFileSync(spec, JSON.stringify(job));
const py = spawnSync(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'), ['-I', path.join(__dirname, 'depth-gates.py'), spec], { encoding: 'utf8' });
if (py.stdout) process.stdout.write(py.stdout); if (py.stderr) process.stderr.write(py.stderr); if (py.error) throw py.error;
console.log('Depth gate evidence: ' + work); process.exit(py.status || 0);
})().catch(e => { console.error(e.stack || e); process.exit(1); });
