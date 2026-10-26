// Structural checks for every composition: renders across modes and awkward dates, determinism, balanced
// markup, the AOD pairing rule, the timeline rules (HH:MM never moves; windows fit the wake/sleep budgets),
// then the astronomy and star-catalogue suites. Usage: npm run verify
const path = require('node:path'), { execFileSync } = require('node:child_process');
const studio = path.resolve(__dirname, '..');
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
    check(!/NaN|undefined|Infinity/.test(a), `${where}: NaN/undefined/Infinity in markup`);
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
for (const suite of ['test-astro.cjs', 'check-stars.cjs']) {
  try { const out = execFileSync(process.execPath, [path.join(__dirname, suite)], { encoding: 'utf8' }); console.log(`${suite}: ${out.trim().split('\n').pop()}`); }
  catch (e) { fails++; console.log(`FAIL  ${suite}\n${(e.stdout || '') + (e.stderr || '')}`); }
}
console.log(fails ? `\n${fails} check(s) failed` : '\nall studio checks passed');
process.exit(fails ? 1 : 0);
