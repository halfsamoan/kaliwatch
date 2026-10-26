// Sanity checks for astro.js against published ephemeris events. Run: node tools/test-astro.cjs
const A = require('../astro.js');
let fails = 0;
function near(label, value, expect, tol) {
  let diff = Math.abs(value - expect); if (diff > 180 && tol < 180) diff = Math.abs(diff - 360);
  const ok = diff <= tol; if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${value.toFixed(4)} (expect ${expect} ± ${tol})`);
}
near('GMST at J2000.0 (deg)', A.gmstDeg(2451545.0), 280.46062, 0.001);
near('Sun longitude, March equinox 2026-03-20 14:46Z', A.sun(A.toJD(new Date('2026-03-20T14:46:00Z'))).lon, 0, 0.05);
near('Sun longitude, June solstice 2026-06-21 08:24Z', A.sun(A.toJD(new Date('2026-06-21T08:24:00Z'))).lon, 90, 0.05);
near('Sun longitude, December solstice 2025-12-21 15:03Z', A.sun(A.toJD(new Date('2025-12-21T15:03:00Z'))).lon, 270, 0.05);
near('Moon elongation, full moon 2026-10-26 04:12Z', A.moon(A.toJD(new Date('2026-10-26T04:12:00Z'))).elongation, 180, 0.5);
near('Moon elongation, new moon 2026-10-10 15:50Z', A.moon(A.toJD(new Date('2026-10-10T15:50:00Z'))).elongation, 0, 0.5);
near('Moon elongation, first quarter 2026-10-18 16:13Z', A.moon(A.toJD(new Date('2026-10-18T16:13:00Z'))).elongation, 90, 0.6);
const sirius = A.altAz(6.7525 * 15, -16.7161, A.toJD(new Date('2026-01-15T00:00:00+09:00')), A.SEOUL.lat, A.SEOUL.lon);
near('Sirius altitude from Seoul, 2026-01-15 00:00 KST', sirius.alt, 35.6, 1.0);
near('Sirius azimuth from Seoul, 2026-01-15 00:00 KST', sirius.az, 185.6, 2.0);
const hq = A.horizon(A.SEOUL.lat, 1.633, 0, 'equidistant', 72);
near('Equidistant horizon: north point below the pole (px, scale 1.633)', hq.northPoint.y, 61.35, 0.05);
near('Equidistant horizon: zenith above the pole (px)', hq.zenith.y, -85.62, 0.05);
near('Equidistant horizon: east point to the right (px)', hq.points[18].x, 146.97, 0.05);
const hs = A.horizon(A.SEOUL.lat, 137.2, 180, 'stereographic', 72), ys = hs.points.map(p => p.y);
near('Stereographic horizon is a circle of radius 225 (R0 137.2)', (Math.max(...ys) - Math.min(...ys)) / 2, 225.0, 0.2);
near('Stereographic horizon centre 178.3 px south of the pole', (Math.max(...ys) + Math.min(...ys)) / 2, 178.3, 0.2);
near('Zodiac of 2026-10-25 (Scorpio starts ~Oct 23)', A.zodiac(A.sun(A.toJD(new Date('2026-10-25T04:08:00Z'))).lon).index, 7, 0);
const rsJun = A.riseSet(new Date('2026-06-21T12:00:00+09:00')), rsOct = A.riseSet(new Date('2026-10-25T10:08:24+09:00'));
near('Seoul sunrise 2026-06-21 (KASI 05:11)', rsJun.rise, 5 + 11 / 60, 0.05);
near('Seoul sunset 2026-06-21 (KASI 19:57)', rsJun.set, 19 + 57 / 60, 0.05);
near('Seoul sunrise 2026-10-25 (~06:52)', rsOct.rise, 6 + 52 / 60, 0.08);
near('Seoul sunset 2026-10-25 (~17:42)', rsOct.set, 17 + 42 / 60, 0.08);
console.log(fails ? `\n${fails} check(s) failed` : '\nall astronomy checks passed');
process.exit(fails ? 1 : 0);
