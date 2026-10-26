// Sanity checks for stars.js: run with `node check.js`
'use strict';
const K = require('../stars.js');
let fail = 0;
const bad = (m) => { fail++; console.log('FAIL', m); };

const ids = new Set();
for (const s of K.stars) {
  if (ids.has(s.id)) bad('duplicate id ' + s.id);
  ids.add(s.id);
  if (!(s.ra >= 0 && s.ra < 24)) bad('RA out of range ' + s.id + ' ' + s.ra);
  if (!(s.dec >= -90 && s.dec <= 90)) bad('Dec out of range ' + s.id + ' ' + s.dec);
  if (typeof s.mag !== 'number' || isNaN(s.mag)) bad('mag missing ' + s.id);
  if (!/^[A-Z][A-Za-z]{2}$/.test(s.con)) bad('bad con ' + s.id + ' ' + s.con);
  if (!s.bayer) bad('no bayer ' + s.id);
}
// duplicate positions (same star entered twice under different ids)
const pos = new Map();
for (const s of K.stars) {
  const k = s.ra.toFixed(2) + '/' + s.dec.toFixed(1);
  if (pos.has(k)) bad('same position: ' + s.id + ' and ' + pos.get(k));
  pos.set(k, s.id);
}

let nFig = 0, nSeg = 0;
for (const con of Object.keys(K.figures)) {
  nFig++;
  if (!K.names[con]) bad('no Latin name for ' + con);
  for (const line of K.figures[con]) {
    if (line.length < 2) bad('polyline too short in ' + con);
    nSeg += line.length - 1;
    for (const id of line) if (!ids.has(id)) bad('figure ' + con + ' references unknown id ' + id);
  }
}
for (const con of new Set(K.stars.map(s => s.con))) if (!K.names[con]) bad('no Latin name for star constellation ' + con);

const bright = K.stars.filter(s => s.mag <= 3.0 && s.dec > -45);
const first = K.stars.filter(s => s.mag <= 1.5);
const southBright = K.stars.filter(s => s.mag <= 3.0 && s.dec <= -45);
if (bright.length < 120 || bright.length > 180) bad('implausible count of mag<=3.0 dec>-45 stars: ' + bright.length);
if (southBright.length) bad('stars below dec -45 with mag<=3 present (should be excluded): ' + southBright.map(s => s.id));

// figure stars fainter than 4.5 (allowed only for Mira and a few deliberate exceptions)
const faintFig = [];
for (const con of Object.keys(K.figures)) for (const line of K.figures[con]) for (const id of line) {
  const s = K.stars.find(x => x.id === id); if (s && s.mag > 4.5 && !faintFig.includes(id)) faintFig.push(id);
}

// milky way: 40 points, closed path, each point within sky and adjacent points not too far apart
const mw = K.milkyWay;
if (mw.length < 36 || mw.length > 48) bad('milkyWay point count ' + mw.length);
for (let i = 0; i < mw.length; i++) {
  const [ra, dec] = mw[i];
  if (!(ra >= 0 && ra < 24) || !(dec >= -90 && dec <= 90)) bad('milkyWay point out of range ' + i);
  const [ra2, dec2] = mw[(i + 1) % mw.length];
  const dRa = Math.min(Math.abs(ra - ra2), 24 - Math.abs(ra - ra2)) * 15 * Math.cos(((dec + dec2) / 2) * Math.PI / 180);
  const sep = Math.hypot(dRa, dec - dec2);
  if (sep > 14) bad('milkyWay gap too large between ' + i + ' and ' + (i + 1) + ': ' + sep.toFixed(1) + ' deg');
}
// galactic centre check: point 0 should be near 17.76h, -28.94
if (Math.abs(mw[0][0] - 17.76) > 0.02 || Math.abs(mw[0][1] + 28.94) > 0.1) bad('milkyWay[0] is not the galactic centre: ' + mw[0]);
// the band must pass near Deneb (20.69h,+45.3) and near Sirius/Orion gap (~6.5h,-15..-25) roughly: check min distance to Deneb < 6 deg
const near = (ra, dec) => Math.min(...mw.map(([r, d]) => Math.hypot(Math.min(Math.abs(r - ra), 24 - Math.abs(r - ra)) * 15 * Math.cos(dec * Math.PI / 180), d - dec)));
if (near(20.69, 45.28) > 8) bad('milkyWay does not pass near Deneb');
if (near(0.945, 60.72) > 8) bad('milkyWay does not pass near gamma Cas');

console.log('--- KaliStars check ---');
console.log('stars total            :', K.stars.length);
console.log('mag<=3.0 & dec>-45     :', bright.length);
console.log('mag<=1.5 (first-mag)   :', first.length, first.map(s => s.id).join(','));
console.log('figure-only (mag>3.0)  :', K.stars.length - K.stars.filter(s => s.mag <= 3.0).length);
console.log('figure stars mag>4.5   :', faintFig.join(',') || 'none');
console.log('constellations w/ stars:', new Set(K.stars.map(s => s.con)).size);
console.log('figures                :', nFig, 'constellations,', nSeg, 'segments');
console.log('milkyWay points        :', mw.length, ' first=', JSON.stringify(mw[0]), ' NGP side sample=', JSON.stringify(mw[10]));
console.log('meta                   :', JSON.stringify({ epoch: K.meta.epoch, count: K.meta.count, brightCount: K.meta.brightCount, magLimit: K.meta.magLimit, verified: K.meta.verifiedSample.length }));
console.log(fail ? ('RESULT: ' + fail + ' problem(s)') : 'RESULT: all checks passed');
process.exit(fail ? 1 : 0);
