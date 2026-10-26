// Structural checks for every composition: renders across modes and awkward dates, determinism, balanced
// markup, the AOD pairing rule, the timeline rules (HH:MM never moves; windows fit the wake/sleep budgets),
// then the astronomy and star-catalogue suites. Usage: npm run verify
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { execFileSync } = require('node:child_process');
const { Browser, page } = require('./browser.cjs');
(async () => {
const studio = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(studio, 'orbit-fonts.js'))) require(path.join(studio, 'orbit-fonts.js'));
for (const m of ['tokens.js', 'astro.js', 'stars.js', 'sky.js', 'dragon-data.js', 'face.js', 'galaxia.js', 'vault5.js']) require(path.join(studio, m));
const F = globalThis.VaultFace, T = globalThis.VaultTokens;
let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL  ' + msg); } };

const DATES = ['2026-10-25T10:08:24+09:00', '2026-10-25T21:42:37+09:00', '2026-06-21T04:59:59+09:00', '2027-01-01T00:00:00+09:00', '2028-02-29T12:30:05+09:00', '2026-12-31T23:59:59+09:00'];
const count = (s, re) => (s.match(re) || []).length;
let renders = 0;
for (const key of Object.keys(F.PRESETS)) {
  const tl = F.PRESETS[key].timeline;
  for (const date of DATES) for (const mode of ['active', 'ambient']) {
    const a = F.render({ preset: key, mode, date, uid: 'v' }), b = F.render({ preset: key, mode, date, uid: 'v' }); renders++;
    const where = `${key} ${mode} ${date}`;
    check(a === b, `${where}: render is not deterministic`);
    // Embedded binary fonts may coincidentally encode the letters NaN; inspect markup, not base64 payloads.
    check(!/NaN|undefined|Infinity/.test(a.replace(/data:[^,\s"')]+;base64,[A-Za-z0-9+/=]+/g, 'data:omitted')), `${where}: NaN/undefined/Infinity in markup`);
    check(count(a, /<g[\s>]/g) === count(a, /<\/g>/g), `${where}: unbalanced <g>`);
    check(count(a, /<text[\s>]/g) === count(a, /<\/text>/g), `${where}: unbalanced <text>`);
  }
  const ids = F.layerIds(key);
  check(new Set(ids).size === ids.length, `${key}: duplicate layer ids`);
  for (const id of ids) {
    const amb = F.valuesAt(id, 'ambient', Infinity, tl), act = F.valuesAt(id, 'active', Infinity, tl);
    // AOD pairing: when settled in ambient only *-aod groups show; in active none of them do.
    check(/-aod$/.test(id) ? amb.opacity === 1 && act.opacity === 0 : amb.opacity === 0 && act.opacity === 1, `${key}/${id}: breaks the active/ambient pairing`);
    const t = (tl && tl[id]) || F.TIMELINE[id];
    check(!!t, `${key}/${id}: no timeline entry (falls back to the default window)`);
    if (t && t.wake) check(t.wake[0] >= 0 && t.wake[1] <= T.motion.wakeMs, `${key}/${id}: wake window outside ${T.motion.wakeMs} ms`);
    if (t && t.sleep) check(t.sleep[0] >= 0 && t.sleep[1] <= T.motion.sleepMs, `${key}/${id}: sleep window outside ${T.motion.sleepMs} ms`);
  }
  // The time never moves or scales, in either direction, at any frame.
  for (const id of ['digits', 'digits-aod', 'digits-shadow']) for (const to of ['active', 'ambient']) for (let ms = 0; ms <= 360; ms += 20) {
    const v = F.valuesAt(id, to, ms, tl);
    check(v.rot === 0 && v.scale === 1 && v.dx === 0 && v.dy === 0, `${key}/${id}: moves during ${to} at ${ms} ms`);
  }
}
console.log(`${renders} renders across ${Object.keys(F.PRESETS).length} compositions checked`);
// G3 against the validation table of docs/debate/07-final-spec-v2.md section 4.9 (the spec truncates to the
// minute, so angles may differ by about 0.1 deg; planets are checked to 1.5 px).
const V5 = globalThis.VaultV5, Ast = globalThis.KaliAstro;
const TABLE = { M1: { E8: 65.99, H0: 97.9, sign: 0, S9: 5, J: [223, 211], S: [321, 56] }, M3: { E8: 334.38, H0: 74.1, sign: 7, S9: 5, J: [131, 153], S: [341, 149] },
  M5: { E8: 188.46, H0: 109.5, sign: 2, S9: 3, J: [170, 183], S: [334, 156] }, M7: { E8: 61.98, H0: 76.5, sign: 7, S9: 0, J: [198, 16], S: [174, 223] } };
for (const [m, w] of Object.entries(TABLE)) {
  const d = new Date(V5.MOMENTS[m]), sk = Ast.sky(d, T.site), so = V5.solar(d, sk.lst), pl = V5.planetsAt(d);
  const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) <= 1.5;
  check(Math.abs(((so.E8 - w.E8 + 540) % 360) - 180) <= 0.2 && Math.abs(so.H0 - w.H0) <= 0.1 && so.sign === w.sign && V5.moonSprite(sk.moon.age) === w.S9, `vault5 ${m}: sun angle, night sector, sign or moon sprite off the spec table`);
  check(near(V5.dial(pl.jupiter.ra, pl.jupiter.dec, sk.lst), w.J) && near(V5.dial(pl.saturn.ra, pl.saturn.dec, sk.lst), w.S), `vault5 ${m}: planet positions off the spec table`);
}
// G10 applies to G3; Galaxia remains an unchanged comparison composition.
const expected = {
  T0: ['OrbitWide', [globalThis.OrbitFonts?.timeSize], 0, 600],
  T1: ['OrbitStd', [15], 0.9, 500], T2: ['OrbitStd', [13, 20, 15], 0, 500],
  T3: ['OrbitCond', [10.5], 1.26, 400], T4: ['OrbitCond', [7.5], 0.6, 400],
  T5: ['OrbitStd', [11.5], 0.23, 400]
};
const tierFrames = { T0: ['screen'], T1: ['screen'], T2: ['C', 'Q'], T3: ['P', 'C'], T4: ['screen', 'H', 'C', 'Q'], T5: ['C'] };
const frames = ['screen', 'C', 'P', 'H', 'Q'], browser = await Browser.open();
const inventoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kw-inventory-'));
let inventoryCount = 0;
try {
  for (const date of DATES) for (const mode of ['active', 'ambient']) {
    await browser.load(page(F.render({ preset: 'vault5', mode, date, uid: 'inv' })), path.join(inventoryDir, 'inventory.html'));
    const inventory = await browser.evaluate(`Array.from(document.querySelectorAll('svg text,svg tspan[data-tier]'),el=>{const c=getComputedStyle(el);let visible=true;for(let p=el;p&&p instanceof SVGElement;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||Number(s.opacity)===0)visible=false}return {tag:el.tagName,text:el.textContent,tier:el.getAttribute('data-tier'),frame:el.getAttribute('data-frame'),family:c.fontFamily,size:parseFloat(c.fontSize),tracking:c.letterSpacing==='normal'?0:parseFloat(c.letterSpacing),weight:Number(c.fontWeight),numeric:c.fontVariantNumeric,visible}})`);
    const where = `vault5 ${mode} ${date}`; inventoryCount += inventory.length;
    for (const t of inventory) {
      const at = `${where} ${t.tag} ${JSON.stringify(t.text)}`, e = expected[t.tier];
      check(!!e && frames.includes(t.frame), `G10 ${at}: missing/invalid tier or frame (${t.tier}/${t.frame})`);
      if (!e) continue;
      check(tierFrames[t.tier].includes(t.frame) && (t.tier !== 'T4' || t.frame !== 'screen' || t.tag === 'tspan'), `G10 ${at}: tier in an invalid geometric frame`);
      if (t.tier === 'T2') check(Math.abs(t.size - (t.frame === 'C' ? 13 : t.text.includes('%') ? 15 : 20)) < 0.01, `G10 ${at}: T2 numeral size does not match ring/steps/battery role`);
      check(t.family.split(',')[0].replace(/["']/g, '').trim() === e[0] && e[1].some(n => Number.isFinite(n) && Math.abs(n - t.size) < 0.01) && Math.abs(t.tracking - e[2]) < 0.01 && t.weight === e[3] && t.numeric.includes('tabular-nums'),
        `G10 ${at}: expected ${e[0]} size=${e[1].join('/')} tracking=${e[2]} weight=${e[3]} tabular-nums; got ${t.family} size=${t.size} tracking=${t.tracking} weight=${t.weight} ${t.numeric}`);
    }
    if (mode === 'active') {
      const visible = inventory.filter(t => t.visible);
      check(Object.keys(expected).every(t => visible.some(v => v.tier === t)), `G10 ${where}: Active is missing a visible tier`);
      check(frames.every(f => visible.some(v => v.frame === f)), `G10 ${where}: Active is missing a visible frame`);
    }
  }
} finally { await browser.close(); fs.rmSync(inventoryDir, { recursive: true, force: true }); }
console.log(`G10 type inventory: ${inventoryCount} text/tiered-tspan instances across 12 G3 builds checked`);
for (const [azimuth, point] of [[0, [225, 70.5]], [90, [97, 114]], [270, [353, 114]]]) {
  const p = V5.horizonPt(azimuth), onCircle = Math.abs(Math.hypot(p[0] - V5.G.H[0], p[1] - V5.G.H[1]) - V5.G.HR);
  check(Math.hypot(p[0] - point[0], p[1] - point[1]) <= 0.2 && onCircle <= 0.2, `horizonPt(${azimuth}): ${p.join(', ')}; circle error ${onCircle}`);
}
// Round 6 instrument values: the face shows what independent arithmetic gives for every named moment.
const WX = require(path.join(studio, 'wff-expr.js'));
for (const [m, iso] of Object.entries(V5.MOMENTS)) {
  const d = new Date(iso), svg = F.render({ preset: 'vault5', date: d, uid: 'iv' }), x = WX.at(d), pad = n => String(n).padStart(2, '0');
  const tele = [...svg.matchAll(/href="#iv-tele"[^>]*>([^<]+)</g)].map(r => r[1]), lst = ((x.lst % 360) + 360) % 360 / 15;
  const want = [`LST ${pad(Math.floor(lst))}:${pad(Math.floor((lst % 1) * 60))}`, `JD ${(d.getTime() / 864e5 + 2440587.5).toFixed(2)}`];
  check(JSON.stringify(tele) === JSON.stringify(want), `vault5 ${m}: telemetry ${JSON.stringify(tele)}, expected ${JSON.stringify(want)}`);
  check(svg.includes(`>${pad(Math.floor(((x.lsun % 30) + 30) % 30))}°</tspan>`), `vault5 ${m}: date line sign degree is not floor(lsun mod 30)`);
  check(['>E<', '>W<', '>126.98E<', '>37.57N<', '>STEPS<', '>BAT<', `>/${(8000).toLocaleString('en-US')}<`].every(s => svg.includes(s)), `vault5 ${m}: horizon or sub-disc engraving missing`);
}
for (const suite of ['test-astro.cjs', 'check-stars.cjs', 'test-wff-expr.cjs']) {
  try { const out = execFileSync(process.execPath, [path.join(__dirname, suite)], { encoding: 'utf8' }); console.log(`${suite}: ${(out.match(/"result": "([^"]+)"/) || [])[1] || out.trim().split('\n').pop()}`); }
  catch (e) { fails++; console.log(`FAIL  ${suite}\n${(e.stdout || '') + (e.stderr || '')}`); }
}
console.log(fails ? `\n${fails} check(s) failed` : '\nall studio checks passed');
process.exit(fails ? 1 : 0);

})().catch(e => { console.error(e.stack || e); process.exit(1); });
