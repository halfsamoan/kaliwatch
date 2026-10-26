'use strict';
const assert = require('node:assert/strict');
const W = require('../wff-expr.js'), A = require('../astro.js');
const wrap = x => x - 360 * Math.floor(x / 360), delta = (a, b) => Math.abs(wrap(a - b + 180) - 180);
const near = (a, b, epsilon = 1e-9) => assert(Math.abs(a - b) <= epsilon, `${a} != ${b} (tolerance ${epsilon})`);
const start = Date.UTC(2026, 0, 1), end = Date.UTC(2031, 0, 1);
// Independent reference uses atan2, direct UTC arithmetic and no expression evaluator.
function oracle(date) {
  const d = (Math.floor(date.getTime() / 60000) * 60000 - start) / 86400000, rad = Math.PI / 180;
  const lsun = wrap(280.667 + 0.98564736*d + 1.9146*Math.sin((357.282 + 0.98560028*d)*rad) + 0.02*Math.sin(2*(357.282 + 0.98560028*d)*rad));
  const lst = wrap(227.64 + 360*(d - Math.floor(d)) + 0.98564737*d);
  const equatorial = lon => ({ ra: wrap(lon - 2.4657*Math.sin(2*lon*rad) + 0.0529*Math.sin(4*lon*rad)), dec: Math.asin(0.39777*Math.sin(lon*rad))/rad });
  function planet(L0, n, peri, centre, radius, eccentricity) {
    const L = L0 + n*d, M = (L - peri)*rad, l = (L + centre*Math.sin(M))*rad;
    const r = radius*(1 - eccentricity*Math.cos(M));
    return equatorial(wrap(Math.atan2(r*Math.sin(l) + Math.sin(lsun*rad), r*Math.cos(l) + Math.cos(lsun*rad))/rad));
  }
  return { d, lst, lsun, ...equatorial(lsun), jupiter: planet(103.430, 0.08308677, 14.73, 5.546, 5.2029, 0.0484),
    saturn: planet(7.807, 0.03347054, 92.60, 6.172, 9.5367, 0.0539) };
}
assert.deepEqual(W.carriers.map(c => c.id), ['ref_lst', 'ref_lsun', 'ref_asun', 'ref_dsun', 'ref_lj', 'ref_ls']);
const published = new Set();
for (const c of W.carriers) {
  c.dependencies.forEach(name => assert(published.has(name), `Forward reference ${name}`)); published.add(c.name);
  assert.equal(c.source, 'angle'); assert.equal(c.defaultValue, 0);
  assert(W.carrierXml().includes(`value="${c.expression.replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[x]))}"`));
}
for (const [id, value] of Object.entries(W.expressions)) {
  assert(!/\b(?:E\d+|W|min)\(/.test(value), `${id} has an unexpanded macro`); W.compile(value);
  assert(!/\[REFERENCE\./.test(W.expression(id, { inlineReferences: true })));
}
near(W.evaluate('1 + 2 * 3'), 7); near(W.evaluate('(1 + 2) * 3'), 9);
near(W.evaluate('5 / 0'), 0); near(W.evaluate('5.5 % 2'), 1.5);
near(W.evaluate('false ? [UNAVAILABLE] : 8'), 8);
near(W.evaluate('3 > 2 && 0 == 0 ? -7 : 9'), -7);
near(W.evaluate('rad(180)'), Math.PI); near(W.evaluate('deg(asin(1))'), 90);
assert.equal(W.evaluate('numberFormat("0.0", 12.3)'), '12.3');
assert.equal(W.evaluate('numberFormat("#,##0", 6240)'), '6,240');
assert.equal(W.evaluate('numberFormat("00", 4)'), '04');
assert.equal(W.evaluate('numberFormat("0.0", 1.25)'), '1.2');
assert.equal(W.evaluate('numberFormat("0.0", 1.35)'), '1.4');
assert.throws(() => W.evaluate('eval("anything")'), /Unsupported WFF function/);
assert.throws(() => W.evaluate('[MISSING]'), /Missing WFF source/);
assert.throws(() => W.evaluate('sin(1,2)'), /arity/);
assert.throws(() => W.evaluate('1; 2'), /Unsupported WFF token/);
assert.throws(() => W.sourcesAt(new Date(NaN)), /Invalid date/);
assert.throws(() => W.sourcesAt(new Date(start), { timezoneOffsetMinutes: 330 }), /whole-hour timezone/);
assert.throws(() => W.expand('[REFERENCE.missing]', true), /Unknown or cyclic/);
for (let age = 0; age < 30; age += 0.25) {
  const p = Math.min(28, Math.floor(age)); assert.equal(W.moonSprite(age), Math.round(Math.min(p, 29.53 - p)*0.5417));
}
const samples = [
  ['M1', '2027-04-16T20:08:24+09:00', 138.35, 221.65, 41.65, 65.99, 97.9, 0, 5, [223, 211], [321, 56]],
  ['M2', '2026-10-25T10:08:24+09:00', 177.42, 182.58, 2.58, 212.06, 80.6, 7, 7, [278, 199], [248, -4]],
  ['M3', '2026-11-20T02:00:00+09:00', 80.72, 279.28, 99.28, 334.38, 74.1, 7, 5, [131, 153], [341, 149]],
  ['M4', '2026-09-23T12:00:00+09:00', 173.96, 186.04, 6.04, 186.15, 90.0, 6, 6, [279, 195], [260, 1]],
  ['M5', '2026-06-21T12:00:00+09:00', 81.31, 278.69, 98.69, 188.46, 109.5, 2, 3, [170, 183], [334, 156]],
  ['M6', '2026-10-25T08:08:00+09:00', 147.34, 212.66, 32.66, 242.06, 80.6, 7, 7, [228, 214], [304, 24]],
  ['M7', '2026-11-09T20:08:00+09:00', 342.62, 17.38, 197.38, 61.98, 76.5, 7, 0, [198, 16], [174, 223]],
  ['M8', '2026-11-17T20:08:00+09:00', 350.50, 9.50, 189.50, 62.26, 74.6, 7, 4, [186, 20], [190, 230]]
];
function dial(planet, lst) { const p = A.polar(planet.ra, planet.dec, lst, 128, 180, 'stereographic'); return [225 + p.x, 114 + p.y]; }
for (const [id, iso, lst, E3, E4, E8, H0, sign, moon, j, s] of samples) {
  const v = W.at(new Date(iso));
  for (const [a, b] of [[v.lst, lst], [v.E3, E3], [v.E4, E4], [v.E8, E8]]) near(a, b, 0.006);
  near(v.H0, H0, 0.055); assert.equal(v.sign, sign, id); assert.equal(v.moonSprite, moon, id);
  for (const [name, xy] of [['jupiter', j], ['saturn', s]]) {
    const p = dial(v.planets[name], v.lst); p.forEach((x, i) => near(x, xy[i], 0.6));
    const body = W.bodyExpressions(name, 20, 20);
    const x = W.evaluate(body.x, v.sources, v.references) + 10 - 293;
    const y = W.evaluate(body.y, v.sources, v.references) + 10 - 293;
    const angle = v.E3 * Math.PI / 180;
    near(225 + x*Math.cos(angle) - y*Math.sin(angle), p[0]); near(114 + x*Math.sin(angle) + y*Math.cos(angle), p[1]);
  }
}
const now = new Date(), live = W.at(now), liveMinute = Math.floor(now.getTime()/60000)*60000;
near(live.d, (liveMinute - start)/86400000);
near(live.jd, A.toJD(now)); assert.equal(live.sources.MINUTE, now.getUTCMinutes());
const oddA = W.at(new Date('2026-10-26T11:00:00Z')), oddB = W.at(new Date('2026-10-26T11:01:00Z'));
near(wrap(oddB.lst - oddA.lst), 360.98564737/1440, 1e-10);
near(W.at(new Date('2026-10-26T11:01:59Z')).lst, oddB.lst);
for (let hour = 0; hour < 24; hour++) {
  const boundary = Date.UTC(2026, 9, 26, hour);
  const a = W.at(new Date(boundary - 60000)), b = W.at(new Date(boundary));
  near(wrap(b.lst - a.lst), 360.98564737/1440, 1e-9);
}
const capella = { ra: 5.2782*15, dec: 45.998 }, m1 = new Date(samples[0][1]), v1 = W.at(m1);
const aa = A.altAz(capella.ra, capella.dec, A.toJD(m1), A.SEOUL.lat, A.SEOUL.lon);
assert.equal(Math.sign(dial(capella, v1.lst)[0] - 225), Math.sign(-Math.sin(aa.az*Math.PI/180)));
let count = 0, maxOracle = 0, maxReferenceDifference = 0, maxLstOracle = 0, maxFloat32Lst = 0;
for (let ms = start; ms < end; ms += 1800000) {
  const date = new Date(ms), v = W.at(date), o = oracle(date), full = W.at(date, { inlineReferences: true });
  near(v.d, o.d, 5e-13); maxLstOracle = Math.max(maxLstOracle, delta(v.lst, A.sky(date).lst));
  const errors = [delta(v.lst, o.lst), delta(v.lsun, o.lsun), delta(v.asun, o.ra), Math.abs(v.dsun - o.dec)];
  for (const name of ['jupiter', 'saturn']) errors.push(delta(v.planets[name].ra, o[name].ra), Math.abs(v.planets[name].dec - o[name].dec));
  maxOracle = Math.max(maxOracle, ...errors);
  for (const name of Object.keys(v.references)) {
    const a = v.references[name], b = full.references[name];
    maxReferenceDifference = Math.max(maxReferenceDifference, Math.abs(a - b));
    assert(Number.isFinite(a), name); if (name !== 'dsun') assert(a >= 0 && a < 360, name);
  }
  assert(v.H0 > 70 && v.H0 < 110); assert(v.moonSprite >= 0 && v.moonSprite <= 8);
  // Float32 is a sensitivity model, not a claim about the device interpreter.
  if (count % 48 === 0) {
    const oddMinute = new Date(ms + (13*60 + 37)*60000);
    maxFloat32Lst = Math.max(maxFloat32Lst, delta(W.at(oddMinute).lst, W.at(oddMinute, { float32: true }).lst));
  }
  count++;
}
assert(maxOracle < 1e-9, `Independent oracle mismatch ${maxOracle}`);
assert(maxReferenceDifference < 1e-10, `Reference/inline drift ${maxReferenceDifference}`);
assert(maxLstOracle < 0.002, `GMST comparison ${maxLstOracle}`);
console.log(JSON.stringify({ result: 'all WFF expression checks passed', period: '2026-01-01 through 2030-12-31 UTC', halfHourlySamples: count,
  maxIndependentOracleDegrees: maxOracle, maxReferenceInlineDifference: maxReferenceDifference, maxMinuteLstVsMeeusDegrees: maxLstOracle,
  float32DailySensitivityDegrees: maxFloat32Lst, liveUtc: now.toISOString(), liveLst: live.lst, liveJD: live.jd,
  carrierLengths: Object.fromEntries(W.carriers.map(c => [c.name, c.expression.length])),
  device: 'T7/T9/T10/T21 unverified; no connected SM-R965N' }, null, 2));
