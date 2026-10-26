// KALIWATCH v5 G3 "Debate vault" (reference round 4): the composition the seven-lens debate converged on,
// docs/debate/07-final-spec-v2.md. Source mode: every layer the WFF port will bake is drawn live here.
//   sky       the real Seoul sky, north-polar stereographic about Polaris P under the dragon  (sidereal day)
//   globe     painted Moon globe at 3 o'clock, cut by the lip, lit by the key light           (synodic month)
//   sub-disc  sunken instrument at 7 o'clock carrying steps and battery                      (live sensors)
//   crescent  grey guilloche plate beyond the horizon, edged by a polished phosphor bead     (static, eccentric)
//   rings     lip, trench, step; F1 black calendar ring turning in the RA frame              (sidereal, tropical year)
//   rotor     bright Cosmotourbillon analogue orbiting once per sidereal day                 (sidereal, seconds)
//   F2        grey guilloche 24 h flange with tonight's night sector and the prompt          (solar day, day length)
// HH:MM is fixed on an arched smoked-glass plate; the official dragon flies on top, its wing over F2.
(function (root) {
  'use strict';
  const req = n => (typeof require !== 'undefined' ? require(n) : null);
  const T = root.VaultTokens || req('./tokens.js'), A = root.KaliAstro || req('./astro.js');
  const S = root.KaliStars || req('./stars.js'), K = root.KaliSky || req('./sky.js');
  const F = root.VaultFace || req('./face.js'), X = F.parts;
  const { f, pt, P, arc, ring, dragonAt, dragonPath, MON, WD, ZOD } = X;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, W = x => x - 360 * Math.floor(x / 360);
  const smooth = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

  // ---------- geometry (07 sections 2 and 3, design px) ----------
  const G = {
    P: [225, 114], k: 128, decLimit: -42.8, H: [225, 280.4], HR: 209.9, Q: [149, 333], QR: 60, L: [390, 206], LR: 46,
    ap: 180, lip: [180, 182.5], trench: [182.5, 186.5], step: [186.5, 188], f1: [188, 202.5], groove: [202.5, 203.5], chamfer: [203.5, 205], f2: [205, 228],
    rotorR: 182, trailR: 184.5, sunR: 191,
    plate: { yBot: 264, archC: [225, 1376.5], archR: 1212.5, endR: 115 }, // round 5: a slice of a disc concentric with the dial, arched on top
    digits: { hx: 166, cx: 225, mx: 284, base: 252.3 }, dateBase: 185.6,
    dragon: [143.29, 23.35, 1.3085] // the v4 frame (135,24) 180 x 123; path unchanged, never flipped
  };
  // Where the horizon circle meets the aperture (about C) and its half-width (about H).
  const CUT = Math.acos((G.HR ** 2 - G.ap ** 2 - (G.H[1] - 225) ** 2) / (2 * G.ap * (G.H[1] - 225))) * R2D;
  const HCUT = Math.asin(G.ap * Math.sin(CUT * D2R) / G.HR) * R2D;

  // ---------- tokens (07 section 5.1, the complete list) ----------
  const V = {
    spec: '#EFFFD8', hi: '#D2FFA4', ph: '#A6F46A', mid: '#8CCB5A', low: '#6FA947', shade: '#4E7F34', deep: '#3C6328', foot: '#1F3315',
    paper: '#EFF8EC', quiet: '#9BAB9C', transfer: '#B9C5CA', month: '#C8D1D5', tickDay: '#8A979C',
    ground: '#141C24', wisp: '#2E3A42', smid: '#56646C', cloud: '#9AA8AE', core: '#E4ECEE', faint: '#6E7B81', faintHi: '#7C888E',
    opHi: '#6E7B81', opMid: '#4A555B', opLo: '#2E363A', earthHi: '#3A4448', earthLo: '#1E232A',
    floor: '#2A3338', floorHi: '#323C42', floorLo: '#232B2F', engrave: '#1A2024', track: '#0B0E10',
    trench: '#030405', f1: '#08090A', groove: '#050607', slot: '#0A0F11',
    lunaLimb: '#F2F4F1', lunaBody: '#E4E8E6', lunaTerm: '#C3C9C8', maria: '#9AA3A3',
    pBody: '#D6D9D4', pBand: '#A3AAA8', pRing: '#B9C1BF', pLimb: '#5A6264',
    sun: '#E8B65A', sunHi: '#FFE2A0', warning: '#F3C479',
    aOutline: '#91AD80', aFill: '#0C160B', aColon: '#5E7A55', aText: '#7F9472', aDragon: '#4E6644', aStar: '#5A6870',
    aMark: '#4D633F', aLine: '#2C3A33', aMoon: '#6B7A80', aSun: '#8A6A2C',
    steelHi: '#D5DCDF', steel: '#9AA6AB', steelMid: '#6B777C', steelLo: '#3A4448', steelFoot: '#161B1F'
  };
  // One light from 315 deg. Raised edges are lit at 315, inner walls at 135.
  const LIP = [[0, V.mid], [45, V.shade], [135, V.foot], [225, V.shade], [315, V.hi]];
  const WALL = [[45, V.shade], [90, V.mid], [135, V.hi], [180, V.mid], [225, V.shade], [315, V.foot]];
  // Round 5: rings, walls and the bead are steel. Phosphor is kept for the dragon and live readings (colon, rotor, trail tip, gauges, INFINITY).
  const STEEL_WALL = [[45, V.steelMid], [90, V.steel], [135, V.steelHi], [180, V.steel], [225, V.steelMid], [315, V.steelFoot]];
  const OPALINE = [[45, V.opMid], [135, V.opLo], [225, V.opMid], [315, V.opHi]];

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A0 = hex(a), B0 = hex(b); return '#' + A0.map((v, i) => Math.round(v + (B0[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  function sweepAt(stops, a) { // colour at clock angle a from ascending [deg, hex] stops, wrapping at 360
    a = W(a); const s = [...stops, [stops[0][0] + 360, stops[0][1]]];
    for (let i = 0; i < s.length - 1; i++) { const [a0, c0] = s[i], [a1, c1] = s[i + 1], aa = a < a0 ? a + 360 : a; if (aa >= a0 && aa <= a1) return mix(c0, c1, (aa - a0) / (a1 - a0)); }
    return stops[0][1];
  }
  function sector(cx, cy, r0, r1, a0, a1) { // annular sector, clockwise a0 -> a1
    const lg = a1 - a0 > 180 ? 1 : 0;
    return `M${P(pt(r1, a0, cx, cy))}A${r1} ${r1} 0 ${lg} 1 ${P(pt(r1, a1, cx, cy))}L${P(pt(r0, a1, cx, cy))}A${r0} ${r0} 0 ${lg} 0 ${P(pt(r0, a0, cx, cy))}Z`;
  }
  // SweepGradient emulation (07 section 8.2): one sector per `step` degrees, overlapped so no seams show.
  function sweepRing(cx, cy, r0, r1, stops, step = 2, from = 0, to = 360) {
    let out = '';
    for (let a = from; a < to - 1e-6; a += step) { const b = Math.min(to, a + step); out += `<path d="${sector(cx, cy, r0, r1, a, b + 0.35)}" fill="${sweepAt(stops, (a + b) / 2)}"/>`; }
    return out;
  }
  const annulus = (r0, r1, fill, extra = '') => `<path d="${ring(r0, r1)}" fill="${fill}" fill-rule="evenodd"${extra}/>`;
  const circle = (c, r, attrs) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" ${attrs}/>`;
  const line = (a, r0, r1, cx, cy) => `M${P(pt(r0, a, cx, cy))}L${P(pt(r1, a, cx, cy))}`;

  // ---------- astronomy ----------
  // Precession J2000 -> J2026.5 (IAU 1976 angles) so the catalogue matches the LST of date (07 section 4.1).
  function precess(raDeg, dec, Tc = 0.265) {
    const s = D2R / 3600, zeta = (2306.2181 * Tc + 0.30188 * Tc * Tc) * s, z = (2306.2181 * Tc + 1.09468 * Tc * Tc) * s, th = (2004.3109 * Tc - 0.42665 * Tc * Tc) * s;
    const a = raDeg * D2R + zeta, d = dec * D2R;
    const Aa = Math.cos(d) * Math.sin(a), B = Math.cos(th) * Math.cos(d) * Math.cos(a) - Math.sin(th) * Math.sin(d), Cc = Math.sin(th) * Math.cos(d) * Math.cos(a) + Math.cos(th) * Math.sin(d);
    return [W((Math.atan2(Aa, B) + z) * R2D), Math.asin(Math.max(-1, Math.min(1, Cc))) * R2D];
  }
  const GP = { a: 192.85948 * D2R, d: 27.12825 * D2R, l: 122.93192 };
  function galactic(raDeg, dec) { // J2000 equatorial -> galactic (l, b), deg
    const a = raDeg * D2R - GP.a, d = dec * D2R;
    const sb = Math.sin(d) * Math.sin(GP.d) + Math.cos(d) * Math.cos(GP.d) * Math.cos(a);
    const y = Math.cos(d) * Math.sin(a), x = Math.sin(d) * Math.cos(GP.d) - Math.cos(d) * Math.sin(GP.d) * Math.cos(a);
    return [W(GP.l - Math.atan2(y, x) * R2D), Math.asin(Math.max(-1, Math.min(1, sb))) * R2D];
  }
  // Sky frame at LST 0, origin at P: a star at RA a sits at clock angle 180 + a (east left, west right).
  const proj = (raDeg, dec) => A.polar(raDeg, dec, 0, G.k, 180, 'stereographic');
  const decR = d => G.k * Math.tan((90 - d) / 2 * D2R), R_SKY = decR(G.decLimit);
  // Dial position of an RA/Dec at local sidereal time lst.
  function dial(raDeg, dec, lst) { const p = A.polar(raDeg, dec, lst, G.k, 180, 'stereographic'); return [G.P[0] + p.x, G.P[1] + p.y]; }

  // Solar quantities in the WFF expression form (07 section 4.9, E5 to E11), days since 2026-01-01 00:00 UT.
  function solar(date, lst) {
    const d = (date.getTime() - Date.UTC(2026, 0, 1)) / 864e5, M = 357.282 + 0.98560028 * d;
    const lsun = W(280.667 + 0.98564736 * d + 1.9146 * Math.sin(M * D2R) + 0.02 * Math.sin(2 * M * D2R));
    const asun = W(lsun - 2.4657 * Math.sin(2 * lsun * D2R) + 0.0529 * Math.sin(4 * lsun * D2R)), dsun = Math.asin(0.39777 * Math.sin(lsun * D2R)) * R2D;
    const H0 = 90 + Math.asin(Math.max(-1, Math.min(1, 0.76920 * Math.tan(dsun * D2R)))) * R2D;
    return { d, lsun, asun, dsun, H0, E3: W(360 - lst), E4: W(180 - lst), E8: W(180 + asun - lst), sign: Math.floor(lsun / 30) };
  }
  // Jupiter and Saturn (E13 to E16): circular Earth plus an equation of centre, beta = 0.
  function planetsAt(date) {
    const s = solar(date, 0), d = s.d;
    const geo = (L0, n, peri, c, a, e) => {
      const Lp = L0 + n * d, Mp = Lp - peri, lh = Lp + c * Math.sin(Mp * D2R), r = a * (1 - e * Math.cos(Mp * D2R));
      return W(Math.atan2(r * Math.sin(lh * D2R) + Math.sin(s.lsun * D2R), r * Math.cos(lh * D2R) + Math.cos(s.lsun * D2R)) * R2D);
    };
    const eq = lam => ({ ra: W(lam - 2.4657 * Math.sin(2 * lam * D2R) + 0.0529 * Math.sin(4 * lam * D2R)), dec: Math.asin(0.39777 * Math.sin(lam * D2R)) * R2D });
    return { jupiter: eq(geo(103.430, 0.08308677, 14.73, 5.546, 5.2029, 0.0484)), saturn: eq(geo(7.807, 0.03347054, 92.60, 6.172, 9.5367, 0.0539)) };
  }
  // Moon sprite index from [MOON_PHASE_POSITION] (E12): 0 new ... 8 full.
  const moonSprite = age => { const p = Math.max(0, Math.min(28, Math.floor(age))); return Math.round(Math.min(p, 29.53 - p) * 0.5417); };

  // ---------- the sky bake (time-invariant, cached) ----------
  // G1 remedy 1 applied (07 section 8.4): every segment below 1.0 raised by 0.15.
  const WL = [[330, 40, 1.0], [40, 65, 1.0], [65, 90, 1.0], [90, 140, 0.9], [140, 220, 0.8], [220, 270, 0.95], [270, 330, 1.0]];
  function wOf(l) { // segment weights, blended over +-5 deg at each boundary
    const raw = x => { x = W(x); for (const [a, b, w] of WL) if (a < b ? x >= a && x < b : x >= a || x < b) return w; return 1; };
    let s = 0; for (let i = -2; i <= 2; i++) s += raw(l + i * 2.5); return s / 5;
  }
  function hash(i, j, o) { let h = (i * 374761393 + j * 668265263 + o * 1442695041 + 945) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(l, b) { // seeded 3-octave value noise, 6 deg base cell, periodic in l; about -1..1
    let s = 0, amp = 1, norm = 0;
    for (let o = 0; o < 3; o++) {
      const cell = 6 / (1 << o), per = Math.round(360 / cell), x = l / cell, y = (b + 90) / cell;
      const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      const g = (ii, jj) => hash(((ii % per) + per) % per, jj, o) * 2 - 1;
      s += amp * ((g(i, j) * (1 - u) + g(i + 1, j) * u) * (1 - v) + (g(i, j + 1) * (1 - u) + g(i + 1, j + 1) * u) * v);
      norm += amp; amp *= 0.5;
    }
    return s / norm;
  }
  // Milky Way tone in galactic latitude (07 section 4.3): envelope |b| <= 14, weights w(l), brushwork, Great Rift.
  function tone(l, b) {
    const ab = Math.abs(b); if (ab >= 14) return 0;
    const e = 1 - ab / 14;
    let t = wOf(l) * e + 0.18 * vnoise(l, b) * Math.min(1, e * 3);
    const rl = smooth(18.5, 21.5, l) * (1 - smooth(78.5, 81.5, l)), rb = smooth(-2.5, -0.5, b) * (1 - smooth(3.5, 5.5, b));
    return t * (1 - 0.65 * rl * rb);
  }
  // Marching squares: closed rings around the region vals >= lev (fill with evenodd).
  function contourPath(vals, n, x0, st, lev) {
    const at = (i, j) => vals[j * n + i], byKey = new Map(), segs = [];
    const pH = (i, j) => { const a = at(i, j), b = at(i + 1, j); return [x0 + (i + (lev - a) / (b - a)) * st, x0 + j * st]; };
    const pV = (i, j) => { const a = at(i, j), b = at(i, j + 1); return [x0 + i * st, x0 + (j + (lev - a) / (b - a)) * st]; };
    const E = { T: (i, j) => ['h' + i + ',' + j, () => pH(i, j)], B: (i, j) => ['h' + i + ',' + (j + 1), () => pH(i, j + 1)], L: (i, j) => ['v' + i + ',' + j, () => pV(i, j)], R: (i, j) => ['v' + (i + 1) + ',' + j, () => pV(i + 1, j)] };
    const CASES = { 1: ['LB'], 2: ['BR'], 3: ['LR'], 4: ['TR'], 6: ['TB'], 7: ['TL'], 8: ['TL'], 9: ['TB'], 11: ['TR'], 12: ['LR'], 13: ['BR'], 14: ['LB'] };
    for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
      const c = (at(i, j) >= lev) << 3 | (at(i + 1, j) >= lev) << 2 | (at(i + 1, j + 1) >= lev) << 1 | (at(i, j + 1) >= lev);
      if (c === 0 || c === 15) continue;
      let list = CASES[c];
      if (c === 5 || c === 10) { const mid = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4 >= lev; list = (c === 5) === mid ? ['TL', 'BR'] : ['TR', 'LB']; }
      for (const pair of list) {
        const a = E[pair[0]](i, j), b = E[pair[1]](i, j), idx = segs.length; segs.push([a[0], b[0]]);
        for (const e of [a, b]) { if (!byKey.has(e[0])) byKey.set(e[0], [e[1], []]); byKey.get(e[0])[1].push(idx); }
      }
    }
    const used = new Uint8Array(segs.length); let d = '';
    for (let s0 = 0; s0 < segs.length; s0++) {
      if (used[s0]) continue; used[s0] = 1;
      const start = segs[s0][0], keys = [start]; let cur = segs[s0][1];
      while (cur !== start) { keys.push(cur); const nx = byKey.get(cur)[1].find(x => !used[x]); if (nx === undefined) break; used[nx] = 1; cur = segs[nx][0] === cur ? segs[nx][1] : segs[nx][0]; }
      if (keys.length < 3) continue;
      d += 'M' + keys.map(k => { const [x, y] = byKey.get(k)[0](); return `${x.toFixed(1)} ${y.toFixed(1)}`; }).join('L') + 'Z';
    }
    return d;
  }
  function milkyWay(u) {
    const st = 4, half = 296, n = Math.round(2 * half / st) + 1, vals = new Float32Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = -half + i * st, y = -half + j * st, R = Math.hypot(x, y);
      if (!i || !j || i === n - 1 || j === n - 1 || R > R_SKY + 2) { vals[j * n + i] = -1; continue; }
      const dec = 90 - 2 * Math.atan(R / G.k) * R2D, ra = W(Math.atan2(x, -y) * R2D - 180);
      const [ra0, de0] = precess(ra, dec, -0.265), [l, b] = galactic(ra0, de0);
      vals[j * n + i] = tone(l, b);
    }
    const levels = [[0.1, V.wisp, 1, 'mw'], [0.2, V.smid, 1, 'mw'], [0.37, V.cloud, 0.85, 'mw2'], [0.72, V.core, 1, 'mw3']];
    return `<g data-layer="milky-way">` + levels.map(([lev, c, o, fl]) => `<path d="${contourPath(vals, n, -half, st, lev)}" fill="${c}" fill-opacity="${o}" fill-rule="evenodd" filter="url(#${u}-${fl})"/>`).join('') + '</g>';
  }
  const PSTAR = {}; // precessed catalogue
  for (const s of S.stars) { const [ra, dec] = precess(s.ra * 15, s.dec); PSTAR[s.id] = { ...s, raD: ra, decP: dec, p: proj(ra, dec) }; }
  const MEMBERS = new Set(Object.values(S.figures).flat(2));
  function skyBake(u) {
    let out = `<circle r="${f(R_SKY + 4)}" fill="${V.ground}"/>` + milkyWay(u);
    // PPI graticule (radar DNA): declination circles about P and RA spokes every 2 h.
    out += `<g data-layer="graticule" fill="none" stroke="${V.ph}" stroke-width="1">` + [60, 30, 0, -30].map(d => `<circle r="${f(decR(d))}" opacity="0.10"/>`).join('') +
      `<path d="${Array.from({ length: 12 }, (_, i) => line(i * 30, 40, 293, 0, 0)).join('')}" opacity="0.08"/></g>`;
    const plain = [], draco = [];
    for (const con of Object.keys(S.figures)) for (const ln of S.figures[con]) for (let i = 0; i + 1 < ln.length; i++) {
      const a = PSTAR[ln[i]], b = PSTAR[ln[i + 1]]; if (!a || !b || a.p.r > R_SKY + 2 || b.p.r > R_SKY + 2) continue;
      (con === 'Dra' ? draco : plain).push(`M${f(a.p.x)} ${f(a.p.y)}L${f(b.p.x)} ${f(b.p.y)}`);
    }
    out += `<path data-layer="figures" d="${plain.join('')}" fill="none" stroke="${V.cloud}" stroke-width="1.8" stroke-linecap="round"/>`;
    // Decorative dust in the tone of the 4.5 to 5.0 mag stars: a seeded stand-in until the BSC5 table is imported.
    const rand = K.rng(590); let dust = '';
    for (let i = 0; i < 590; i++) { const r = R_SKY * Math.sqrt(rand()), a = rand() * 2 * Math.PI; dust += `<circle cx="${f(r * Math.sin(a))}" cy="${f(-r * Math.cos(a))}" r="0.7"/>`; }
    out += `<g data-layer="dust" fill="${V.faintHi}">${dust}</g>`;
    let blooms = '', dots = '';
    for (const s of Object.values(PSTAR)) {
      if (s.p.r > R_SKY || (s.mag > 5.0 && !MEMBERS.has(s.id))) continue;
      const x = f(s.p.x), y = f(s.p.y);
      if (s.mag <= 1.0) { blooms += `<circle cx="${x}" cy="${y}" r="2.6" fill="${V.core}" opacity="0.4"/>`; dots += `<circle cx="${x}" cy="${y}" r="1.6" fill="${V.core}"/>`; }
      else if (s.mag <= 3.0) dots += `<circle cx="${x}" cy="${y}" r="1.2" fill="${V.transfer}"/>`;
      else if (s.mag <= 4.5) { blooms += `<circle cx="${x}" cy="${y}" r="1.9" fill="${V.cloud}" opacity="0.3"/>`; dots += `<circle cx="${x}" cy="${y}" r="0.9" fill="${V.cloud}"/>`; }
      else dots += `<circle cx="${x}" cy="${y}" r="0.7" fill="${V.faint}"/>`;
    }
    out += `<g data-layer="stars">${blooms}${dots}</g>`;
    // Draco, the only colour on the grisaille: dotted phosphor, Eltanin and Rastaban as phosphor dots.
    out += `<path data-layer="draco" d="${draco.join('')}" fill="none" stroke="${V.hi}" stroke-opacity="0.35" stroke-width="1.4" stroke-dasharray="1.4 2.8"/>` +
      ['gDra', 'bDra'].map(id => PSTAR[id] ? `<circle cx="${f(PSTAR[id].p.x)}" cy="${f(PSTAR[id].p.y)}" r="1.3" fill="${V.ph}"/>` : '').join('');
    return out;
  }
  let SKY_MEMO = null; // the bake is independent of time and uid-free except for the filter reference
  const skyMarkup = u => { if (!SKY_MEMO) SKY_MEMO = skyBake('@U@'); return SKY_MEMO.split('@U@').join(u); };

  // 24 upright names (07 section 4.3): anchors at the spherical centroid of each figure's stars.
  const NAMES = ['CAS', 'CEP', 'UMA', 'PER', 'CYG', 'AUR', 'LYR', 'AND', 'HER', 'BOO', 'CRV', 'CMA', 'CNC', 'TAU', 'LEO', 'PEG', 'LIB', 'ARI', 'CRB', 'GEM', 'ORI', 'SCO', 'AQL', 'DRA'];
  const ANCHORS = NAMES.map(name => {
    const con = Object.keys(S.figures).find(c => c.toUpperCase() === name), ids = [...new Set(S.figures[con].flat())];
    let x = 0, y = 0, z = 0;
    for (const id of ids) { const s = PSTAR[id]; if (!s) continue; const a = s.raD * D2R, d = s.decP * D2R; x += Math.cos(d) * Math.cos(a); y += Math.cos(d) * Math.sin(a); z += Math.sin(d); }
    return { name, con, ra: W(Math.atan2(y, x) * R2D), dec: Math.asin(z / Math.hypot(x, y, z)) * R2D, ids };
  });

  // Round 6 instrument layer: a point at altitude 0, azimuth A (from N through E) on the dial.
  const PHI = 37.5665;
  function horizonPt(A) {
    const dec = Math.asin(Math.cos(PHI * D2R) * Math.cos(A * D2R)) * R2D, HA = Math.atan2(-Math.sin(A * D2R), -Math.sin(PHI * D2R) * Math.cos(A * D2R)) * R2D;
    const r = decR(dec), th = (180 - HA) * D2R; return [G.P[0] + r * Math.sin(th), G.P[1] - r * Math.cos(th)];
  }
  const aboutH = ([x, y]) => Math.atan2(x - G.H[0], G.H[1] - y) * R2D; // clock angle about H
  const hArc = (r, a0, a1) => `M${P(pt(r, a0, G.H[0], G.H[1]))}A${r} ${r} 0 0 1 ${P(pt(r, a1, G.H[0], G.H[1]))}`;
  function instrument(u, ctx, sol) {
    let ticks = ['', '', ''], defs = '', txt = '';
    for (let A = 0; A < 360; A += 5) {
      const q = horizonPt(A), a = aboutH(q);
      if (Math.hypot(q[0] - 225, q[1] - 225) > 178 || (q[0] > 128 && q[0] < 322 && q[1] < 150)) continue;
      const len = A % 30 === 0 ? 5 : A % 10 === 0 ? 3.5 : 2, k = A % 30 === 0 ? 2 : A % 10 === 0 ? 1 : 0;
      ticks[k] += `M${P(pt(G.HR - 0.6, a, G.H[0], G.H[1]))}L${P(pt(G.HR - 0.6 - len, a, G.H[0], G.H[1]))}`;
    }
    const lab = (id, text, a, span) => { defs += `<path id="${u}-${id}" d="${hArc(201.5, a - span, a + span)}"/>`; txt += `<text><textPath href="#${u}-${id}" startOffset="50%">${text}</textPath></text>`; };
    const aE = aboutH(horizonPt(90)), aW = aboutH(horizonPt(270));
    lab('hzE', 'E', aE, 4); lab('hzW', 'W', aW, 4); lab('hzLon', '126.98E', aE - 7.2, 6.5); lab('hzLat', '37.57N', aW + 6.8, 6.5); // site, engraved beyond the E and W points
    const hh = Math.floor(W(ctx.sky.lst) / 15), mm = Math.floor((W(ctx.sky.lst) / 15 - hh) * 60), jd = A.toJD(ctx.s.date);
    const tele = `LST ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}  JD ${jd.toFixed(2)}`;
    defs += `<path id="${u}-tele" d="M${P(pt(171, 200))}A171 171 0 0 0 ${P(pt(171, 144))}"/>`; // centred at 172, clear of the sub-disc (197.7 to 232.5 at r 171)
    return `<defs>${defs}</defs><g stroke="${V.steel}" stroke-opacity="0.6"><path d="${ticks[0]}" stroke-width="0.8"/><path d="${ticks[1]}" stroke-width="0.8"/><path d="${ticks[2]}" stroke-width="1"/></g>` +
      `<g font-size="7.5" letter-spacing="0.6" text-anchor="middle" fill="${V.steel}" fill-opacity="0.85">${txt}</g>` +
      `<text font-size="7.5" letter-spacing="0.6" text-anchor="middle" fill="${V.transfer}" fill-opacity="0.75" stroke="#0B0E10" stroke-opacity="0.6" stroke-width="1.6" paint-order="stroke" xml:space="preserve"><textPath href="#${u}-tele" startOffset="50%">${tele}</textPath></text>`;
  }

  // ---------- regions (shared with tools/gates.cjs) ----------
  const archY = x => G.plate.archC[1] - Math.sqrt(G.plate.archR ** 2 - (x - G.plate.archC[0]) ** 2);
  // The plate is the band of a smoked-sapphire disc (r endR about C) under the arch: its ends are concentric with every ring, so it reads as part of the instrument, not a card.
  const PL = (() => {
    const p = G.plate, R = p.endR, [ax, ay] = p.archC, yT = (p.archR ** 2 - R ** 2 - ay ** 2 + 225 ** 2) / (2 * (225 - ay));
    const xT = Math.sqrt(R * R - (yT - 225) ** 2), xB = Math.sqrt(R * R - (p.yBot - 225) ** 2);
    return { R, yT, xT, xB, aT: Math.atan2(xT, 225 - yT) * R2D, aB: Math.atan2(xB, 225 - p.yBot) * R2D, ax, ay };
  })();
  function platePath(dx = 0, dy = 0) {
    const p = G.plate, { R, yT, xT, xB } = PL, X0 = v => f(225 + v + dx);
    return `M${X0(-xT)} ${f(yT + dy)}A${p.archR} ${p.archR} 0 0 1 ${X0(xT)} ${f(yT + dy)}A${R} ${R} 0 0 1 ${X0(xB)} ${f(p.yBot + dy)}` +
      `L${X0(-xB)} ${f(p.yBot + dy)}A${R} ${R} 0 0 1 ${X0(-xT)} ${f(yT + dy)}Z`;
  }
  // Perimeter samples [x, y, outward normal as a clock angle] for the facet and the internal reflection.
  function plateRim() {
    const { R, yT, xT, aT, aB, ax, ay } = PL, out = [], yb = G.plate.yBot;
    for (let i = 0; i <= 24; i++) { const x = -xT + 2 * xT * i / 24, y = ay - Math.sqrt(G.plate.archR ** 2 - x * x); out.push([225 + x, y, Math.atan2(x, ay - y) * R2D]); }
    for (let i = 1; i <= 10; i++) { const a = aT + (aB - aT) * i / 10, [x, y] = pt(R, a); out.push([x, y, a]); }
    for (let i = 1; i <= 24; i++) { const x = PL.xB - 2 * PL.xB * i / 24; out.push([225 + x, yb, 180]); }
    for (let i = 1; i <= 10; i++) { const a = 360 - aB + (aB - aT) * i / 10, [x, y] = pt(R, a); out.push([x, y, a]); }
    return out;
  }
  const crescentPath = () => `M${P(pt(G.ap, -CUT))}A${G.ap} ${G.ap} 0 0 1 ${P(pt(G.ap, CUT))}A${G.HR} ${G.HR} 0 0 0 ${P(pt(G.ap, -CUT))}Z`;
  // White = open sky (r < 180, above the horizon, not under the plate, the sub-disc, the globe or the dragon bed).
  function maskSvg(kind) {
    const tr = dragonAt(...G.dragon), k = 1 / G.dragon[2];
    const body = kind === 'digits'
      ? `<rect x="123" y="196.8" width="204" height="55.5" fill="#fff"/>`
      : `<clipPath id="m-ap"><circle cx="225" cy="225" r="${G.ap}"/></clipPath><g clip-path="url(#m-ap)"><circle cx="${G.H[0]}" cy="${G.H[1]}" r="${G.HR}" fill="#fff"/></g>` +
        `<path d="${platePath()}" fill="#000"/>${circle(G.Q, G.QR, 'fill="#000"')}${circle(G.L, G.LR, 'fill="#000"')}` +
        `<g transform="${tr}" fill="#000" stroke="#000" stroke-width="${f(4 * k)}" stroke-linejoin="round">${dragonPath()}</g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 450 450"><rect width="450" height="450" fill="#000"/>${body}</svg>`;
  }

  // ---------- parts ----------
  function star8(cx, cy, r1, r2, r3) { let d = ''; for (let i = 0; i < 16; i++) d += (i ? 'L' : 'M') + P(pt(i % 4 === 0 ? r1 : i % 2 === 0 ? r2 : r3, i * 22.5, cx, cy)); return d + 'Z'; }
  function globe(u, k) {
    const r = G.LR, E = k * 22.5, rx = Math.abs(Math.cos(E * D2R)) * r, lit = `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${f(rx)} ${r} 0 0 ${E > 90 ? 1 : 0} 0 ${-r}Z`;
    const maria = [[-14, -8, 10, 7], [6, -16, 7, 5], [-4, 10, 9, 6], [14, 4, 6, 8], [-20, 12, 5, 4]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join('');
    return `<g transform="translate(${G.L[0]} ${G.L[1]})">` +
      (k ? `<path d="${arc(r + 2.4, 230, 400, 0, 0)}" fill="none" stroke="${V.lunaBody}" stroke-opacity="0.25" stroke-width="5" filter="url(#${u}-b15)"/>` : '') +
      `<circle r="${r}" fill="url(#${u}-earth)"/>` +
      (k ? `<g transform="rotate(225)"><path d="${lit}" fill="url(#${u}-luna)"/></g>` +
        `<clipPath id="${u}-litclip"><path d="${lit}" transform="rotate(225)"/></clipPath><g clip-path="url(#${u}-litclip)" fill="${V.maria}" fill-opacity="0.25">${maria}</g>` : '') +
      `<circle r="${r}" fill="url(#${u}-limb)"/><path d="${arc(r - 0.5, 45, 225, 0, 0)}" fill="none" stroke="${V.opMid}" stroke-width="1"/></g>`;
  }
  function planet(u, kind, x, y) {
    if (kind === 'jupiter') return `<g transform="translate(${f(x)} ${f(y)})"><circle r="8" fill="url(#${u}-pl)"/><path d="M-7.6 -2.2h15.2M-7.4 2.6h14.8" stroke="${V.pBand}" stroke-width="1.6" opacity="0.8"/><circle r="8" fill="url(#${u}-limb)"/></g>`;
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(-20)"><ellipse rx="13" ry="2.5" fill="none" stroke="${V.pRing}" stroke-width="1.5"/><circle r="5.5" fill="url(#${u}-pl)"/>` +
      `<path d="M-13 0A13 2.5 0 0 0 13 0" fill="none" stroke="${V.pRing}" stroke-width="1.5"/></g>`;
  }
  function rotor(u, c, sec) {
    const carriage = [0, 120, 240].map(a => line(a + 6 * sec, 2.5, 9, c[0], c[1])).join('');
    return circle([c[0] + 3, c[1] + 3], 12, `fill="#000" opacity="0.6" filter="url(#${u}-b13)"`) +
      circle(c, 11.25, `fill="none" stroke="url(#${u}-rim)" stroke-width="1.5"`) + circle(c, 10.5, `fill="url(#${u}-bridge)"`) +
      `<path d="${carriage}" stroke="${V.slot}" stroke-width="1.4" stroke-linecap="round"/>` + circle(c, 6.5, `fill="none" stroke="${V.foot}" stroke-width="1"`) +
      circle(c, 1.75, `fill="${V.paper}" stroke="${V.foot}" stroke-width="0.8"`);
  }
  function subScale(u, qx, qy) { // battery ticks every 10 % (r 47-49, 50 % to 50.5), steps ticks every 10 % of the goal, arc labels about Q
    let b = '', bb = '', st = '';
    for (let i = 0; i < 10; i++) { const a = 36 * i; (i % 5 ? (b += line(a, 47, 49, qx, qy)) : (bb += line(a, 47, 50.5, qx, qy))); st += line(a, 35, 36.8, qx, qy); }
    const lp = (id, a, span) => `<path id="${u}-${id}" d="M${P(pt(51.5, a - span, qx, qy))}A51.5 51.5 0 0 1 ${P(pt(51.5, a + span, qx, qy))}"/>`;
    return `<defs>${lp('qS', 0, 20)}${lp('qB', 90, 14)}</defs><g stroke="${V.steel}"><path d="${b}" stroke-width="0.8" stroke-opacity="0.6"/><path d="${bb}" stroke-width="1.1" stroke-opacity="0.7"/><path d="${st}" stroke-width="0.8" stroke-opacity="0.45"/></g>` +
      `<g font-size="7.5" letter-spacing="0.6" text-anchor="middle" fill="${V.steel}" fill-opacity="0.85"><text><textPath href="#${u}-qS" startOffset="50%">STEPS</textPath></text><text><textPath href="#${u}-qB" startOffset="50%">BAT</textPath></text></g>`;
  }
  const ROT = a => (W(a) > 90 && W(a) < 270 ? a + 180 : a); // numerals strictly between 90 and 270 are flipped upright
  function ringNumeral(txt, r, a, size, attrs) {
    const [x, y] = pt(r, a); return `<text transform="translate(${f(x)} ${f(y)}) rotate(${f(ROT(a))})" y="${f(0.711 * size / 2)}" text-anchor="middle" ${attrs}>${txt}</text>`;
  }
  const stepsText = n => n === null ? '—' : n >= 10000 ? (Math.floor(Math.min(n, 99999) / 100) / 10).toFixed(1) + 'k' : n.toLocaleString('en-US');
  function clock(ctx, mode) {
    const { h, m } = ctx.local, hh = String(h).padStart(2, '0'), mm = String(m).padStart(2, '0'), g = G.digits, base = `font-size="${T.type.time}" font-weight="${T.type.timeWeight}" text-anchor="middle"`;
    if (mode === 'aod') return `<g ${base} fill="${V.aFill}" stroke="${V.aOutline}" stroke-width="1.4" paint-order="stroke"><text x="${g.hx}" y="${g.base}">${hh}</text><text x="${g.mx}" y="${g.base}">${mm}</text><text x="${g.cx}" y="${f(g.base - 4)}" stroke="${V.aColon}" stroke-width="1">:</text></g>`;
    return `<g ${base} fill="${V.paper}" aria-label="${hh}:${mm}"><text x="${g.hx}" y="${g.base}">${hh}</text><text x="${g.cx}" y="${f(g.base - 4)}" fill="${V.ph}">:</text><text x="${g.mx}" y="${g.base}">${mm}</text></g>`;
  }
  // Month marks in the RA frame for 2026 (the ring drifts < 0.25 deg a year): the sun's RA at 12:00 KST.
  const sunRA = (m, d) => A.sun(A.toJD(new Date(Date.UTC(2026, m, d, 3)))).ra;
  const MONTHS = MON.map((name, m) => ({ name, rule: sunRA(m, 1), centre: sunRA(m, 16), ticks: [5, 10, 15, 20, 25].map(d => [d, sunRA(m, d)]) }));

  function vaultDefs(u) {
    const blur = (id, sd) => `<filter id="${u}-${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
    const monthPaths = MONTHS.map((mo, i) => `<path id="${u}-mn${i}" d="M${P(pt(202.6, mo.centre + 14))}A202.6 202.6 0 0 0 ${P(pt(202.6, mo.centre - 14))}"/>`).join('');
    return blur('b04', 0.4) + blur('b05', 0.5) + blur('b06', 0.55) + blur('b08', 0.8) + blur('b10', 1.05) + blur('b13', 1.3) + blur('b15', 1.5) + blur('b20', 2) +
      `${[['mw', 1.6, 0.9, 0.35], ['mw2', 1, 1.6, 0.3], ['mw3', 0.5, 1.2, 0.45]].map(([id, sd, k, c]) => `<filter id="${u}-${id}" filterUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600" color-interpolation-filters="sRGB">` +
        // Brushwork: fractal noise modulates each tone's alpha (alpha = k * noise + c), so the band reads as painted enamel.
        `<feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="945" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${k} 0 0 0 ${c}" result="m"/>` +
        `<feGaussianBlur in="SourceGraphic" stdDeviation="${sd}" result="b"/><feComposite in="b" in2="m" operator="in"/></filter>`).join('')}` +
      `<clipPath id="${u}-ap"><circle cx="225" cy="225" r="${G.ap + 0.5}"/></clipPath><clipPath id="${u}-hz"><circle cx="${G.H[0]}" cy="${G.H[1]}" r="${G.HR}"/></clipPath>` +
      `<clipPath id="${u}-cres"><path d="${crescentPath()}"/></clipPath>` +
      `<radialGradient id="${u}-glaze" gradientUnits="userSpaceOnUse" cx="150" cy="150" r="285"><stop offset="0" stop-color="#fff" stop-opacity=".04"/><stop offset=".333" stop-color="#fff" stop-opacity=".024"/><stop offset=".667" stop-color="#fff" stop-opacity=".005"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="${u}-sefall" gradientUnits="userSpaceOnUse" cx="225" cy="225" r="182"><stop offset=".714" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".2"/><stop offset=".989" stop-color="#000" stop-opacity=".4"/></radialGradient>` +
      `<radialGradient id="${u}-lipocc" gradientUnits="userSpaceOnUse" cx="225" cy="225" r="182"><stop offset=".945" stop-color="#000" stop-opacity="0"/><stop offset=".989" stop-color="#000" stop-opacity=".5"/></radialGradient>` +
      `<linearGradient id="${u}-toSE" gradientUnits="userSpaceOnUse" x1="225" y1="225" x2="352" y2="352"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<linearGradient id="${u}-toNW" gradientUnits="userSpaceOnUse" x1="225" y1="225" x2="98" y2="98"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="${u}-mSE" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><rect width="450" height="450" fill="url(#${u}-toSE)"/></mask>` +
      `<mask id="${u}-mNW" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><rect width="450" height="450" fill="url(#${u}-toNW)"/></mask>` +
      `<linearGradient id="${u}-crface" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${V.opMid}"/><stop offset="1" stop-color="${V.opLo}"/></linearGradient>` +
      `<radialGradient id="${u}-earth" cx=".36" cy=".36" r=".75"><stop offset="0" stop-color="${V.earthHi}"/><stop offset="1" stop-color="${V.earthLo}"/></radialGradient>` +
      `<radialGradient id="${u}-luna" gradientUnits="userSpaceOnUse" cx="18" cy="0" r="66"><stop offset="0" stop-color="${V.lunaLimb}"/><stop offset=".45" stop-color="${V.lunaBody}"/><stop offset="1" stop-color="${V.lunaTerm}"/></radialGradient>` +
      `<radialGradient id="${u}-limb"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>` +
      `<radialGradient id="${u}-pl" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="${V.pBody}"/><stop offset=".7" stop-color="${V.pBand}"/><stop offset="1" stop-color="${V.pLimb}"/></radialGradient>` +
      `<radialGradient id="${u}-bridge" cx=".33" cy=".33" r=".67"><stop offset="0" stop-color="${V.hi}"/><stop offset=".57" stop-color="${V.ph}"/><stop offset="1" stop-color="${V.shade}"/></radialGradient>` +
      `<linearGradient id="${u}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${V.hi}"/><stop offset=".5" stop-color="${V.shade}"/><stop offset="1" stop-color="${V.foot}"/></linearGradient>` +
      `<linearGradient id="${u}-dragon5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${V.hi}"/><stop offset=".5" stop-color="${V.ph}"/><stop offset="1" stop-color="${V.low}"/></linearGradient>` +
      `<linearGradient id="${u}-bevel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${V.transfer}" stop-opacity=".6"/><stop offset=".5" stop-color="${V.transfer}" stop-opacity=".22"/><stop offset=".78" stop-color="${V.transfer}" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="${u}-sheen" gradientUnits="userSpaceOnUse" x1="110" y1="150" x2="240" y2="280"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff" stop-opacity=".05"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<radialGradient id="${u}-sun5" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="${V.sunHi}"/><stop offset="1" stop-color="${V.sun}"/></radialGradient>` +
      // Dragon shadow receivers by height (07 section 2.1): sky -1, crescent and lip 0, F1 +1, F2 +2.
      `<mask id="${u}-rcv-sky" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><g clip-path="url(#${u}-ap)"><circle cx="${G.H[0]}" cy="${G.H[1]}" r="${G.HR}" fill="#fff"/></g></mask>` +
      `<mask id="${u}-rcv-mid" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><circle cx="225" cy="225" r="188" fill="#fff"/><g clip-path="url(#${u}-ap)"><circle cx="${G.H[0]}" cy="${G.H[1]}" r="${G.HR}" fill="#000"/></g></mask>` +
      `<mask id="${u}-rcv-f1" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450">${annulus(188, 203.5, '#fff')}</mask>` +
      `<mask id="${u}-rcv-f2" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450">${annulus(203.5, 240, '#fff')}</mask>` +
      `<mask id="${u}-wall" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450">${circle(G.Q, 58.5, 'fill="#fff"')}${circle([G.Q[0] + 1.77, G.Q[1] + 1.77], 58.5, 'fill="#000"')}</mask>` +
      `<mask id="${u}-wall2" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450">${circle(G.Q, 58.5, 'fill="#fff"')}${circle([G.Q[0] + 4.6, G.Q[1] + 4.6], 58.5, 'fill="#000"')}</mask>` +
      monthPaths + `<path id="${u}-prompt" d="M${P(pt(218.9, 225))}A218.9 218.9 0 0 0 ${P(pt(218.9, 135))}"/>`;
  }

  // ---------- build ----------
  function build(ctx) {
    const u = ctx.u, L = [], sky = ctx.sky, lst = sky.lst, sec = ctx.local.s, sol = solar(ctx.s.date, lst), s = ctx.s;
    ctx.defs = X.defs(u, vaultDefs(u));
    const skyRot = `translate(${G.P[0]} ${G.P[1]}) rotate(${f(-lst)})`;
    const [qx, qy] = G.Q, low = s.battery !== null && s.battery <= 15, bat = s.battery === null ? '—' : `${s.battery}<tspan font-size="8" dy="-5.5">%</tspan>`;
    const rotorC = pt(G.rotorR, sol.E3), sunC = pt(G.sunR, sol.E8), k9 = moonSprite(sky.moon.age);
    const deg = String(Math.floor(sol.lsun - 30 * sol.sign)).padStart(2, '0') + '°';
    const dateLine = aod => `<text x="225" y="${G.dateBase}" font-size="15" letter-spacing="0.9" text-anchor="middle"><tspan fill="${aod ? V.aText : V.paper}">${String(ctx.local.day).padStart(2, '0')} ${MON[ctx.local.mon]}</tspan>` +
      `<tspan dx="13" fill="${aod ? V.aText : V.transfer}">${WD[ctx.local.wd]}</tspan><tspan dx="13" fill="${aod ? V.aText : V.steel}">${ZOD[sol.sign]}</tspan><tspan dx="1.5" dy="-5.5" font-size="8" fill="${aod ? V.aText : V.steel}">${deg}</tspan></text>`;
    const dg = dragonPath(), dtr = dragonAt(...G.dragon), dk = 1 / G.dragon[2];

    // z1: the vault sky, its names and planets, the Moon globe, the fixed light on the dome.
    L.push({ id: 'sky', svg: `<g clip-path="url(#${u}-ap)"><g transform="${skyRot}">${skyMarkup(u)}</g></g>` });
    const pl = planetsAt(s.date), names = ANCHORS.map(a => { const [x, y] = dial(a.ra, a.dec, lst); return `<text x="${f(x)}" y="${f(y + 10 + 3.9)}">${a.name}</text>`; }).join('');
    const planets = ['saturn', 'jupiter'].map(kn => { const [x, y] = dial(pl[kn].ra, pl[kn].dec, lst); return Math.hypot(x - 225, y - 225) < G.ap + 12 ? planet(u, kn, x, y) : ''; }).join('');
    L.push({ id: 'skymarks', svg: `<g clip-path="url(#${u}-ap)"><g font-size="11" fill="${V.transfer}" fill-opacity="0.8" letter-spacing="0.88" text-anchor="middle">${names}</g>${planets}</g>` });
    L.push({ id: 'globe', svg: `<g clip-path="url(#${u}-ap)">${globe(u, k9)}</g>` });
    const [px, py] = G.P;
    L.push({ id: 'dome', svg: `<g clip-path="url(#${u}-ap)"><circle cx="225" cy="225" r="182" fill="url(#${u}-glaze)"/>` +
      `<circle cx="225" cy="225" r="182" fill="url(#${u}-sefall)" mask="url(#${u}-mSE)"/><g mask="url(#${u}-mNW)"><circle cx="225" cy="225" r="182" fill="url(#${u}-lipocc)"/><circle cx="225" cy="225" r="179.6" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="0.9"/></g></g>` +
      `<path d="M${px - 3.5} ${py}h2.5M${px + 1} ${py}h2.5M${px} ${py - 3.5}v2.5M${px} ${py + 1}v2.5" stroke="${V.ph}" stroke-opacity="0.8" stroke-width="1"/>` });

    // AOD: the sky asleep, footprints, same-face cues, sun and rotor asleep, the sub-disc asleep.
    const aodStars = Object.values(PSTAR).filter(st => st.mag <= 2.5 && st.p.r <= R_SKY).map(st => `<circle cx="${f(st.p.x)}" cy="${f(st.p.y)}" r="0.8"/>`).join('');
    const aodDraco = [...new Set(S.figures.Dra.flat())].map(id => PSTAR[id]).filter(Boolean).map(st => `<circle cx="${f(st.p.x)}" cy="${f(st.p.y)}" r="0.8"/>`).join('');
    L.push({ id: 'sky-aod', svg: `<g clip-path="url(#${u}-ap)"><g clip-path="url(#${u}-hz)"><g transform="${skyRot}"><g fill="${V.aStar}">${aodStars}</g><g fill="${V.aMark}">${aodDraco}</g></g></g></g>` });
    L.push({ id: 'globe-aod', svg: circle(G.L, G.LR, 'fill="#000"') + (k9 ? `<path d="${arc(45, 225, 363.6, G.L[0], G.L[1])}" fill="none" stroke="${V.aMoon}" stroke-width="1.2"/>` : '') });
    const aodTicks = Array.from({ length: 12 }, (_, i) => i * 30).filter(a => a !== 180).map(a => line(a, 195, 202)).join('');
    const flank = `${arc(G.HR, -HCUT, -25, G.H[0], G.H[1])}${arc(G.HR, 25, HCUT, G.H[0], G.H[1])}`;
    L.push({ id: 'marks-aod', svg: `<path d="${aodTicks}" stroke="${V.aMark}" stroke-width="1.25"/><path d="${flank}" fill="none" stroke="${V.aLine}" stroke-width="1"/>` +
      `<g font-size="13" font-weight="500" fill="${V.aMark}">${[0, 6, 18].map(h => ringNumeral(String(h).padStart(2, '0'), 215, W(360 - 15 * h), 13, '')).join('')}</g>` +
      `<text font-size="11" text-anchor="middle"><textPath href="#${u}-prompt" startOffset="50%"><tspan fill-opacity="0">kali@vault:~$ </tspan><tspan fill="${V.aText}">INFINITY</tspan><tspan fill-opacity="0">_</tspan></textPath></text>` });
    L.push({ id: 'live-aod', svg: circle(sunC, 2.5, `fill="${V.aSun}"`) + circle(rotorC, 12, `fill="none" stroke="${V.aColon}" stroke-width="1.2"`) });
    L.push({ id: 'subdisc-aod', svg: circle(G.Q, G.QR, 'fill="#000"') + `<path d="${arc(59.25, 45, 171, qx, qy)}" fill="none" stroke="${V.aLine}" stroke-width="1"/>` +
      `<text x="${qx}" y="365.5" font-size="15" font-weight="500" text-anchor="middle" fill="${low ? V.aSun : V.aText}">${bat}</text>` });

    // z3: the sunken sub-disc (camera-locked): sunray floor, wall shadow, lip, gauges, values.
    let rays = ['', '']; for (let i = 0; i < 120; i++) rays[i % 2] += line(i * 3, 6, 56, qx, qy);
    const batA = s.battery === null ? 0 : 3.6 * s.battery, stpA = s.steps === null ? 0 : 360 * Math.min(1, s.steps / Math.max(1, s.stepGoal));
    L.push({ id: 'subdisc', svg: circle(G.Q, 58.6, `fill="${V.floor}"`) + `<path d="${rays[0]}" stroke="${V.floorHi}" stroke-width="0.9"/><path d="${rays[1]}" stroke="${V.floorLo}" stroke-width="0.9"/>` +
      circle(G.Q, 4, `fill="${V.engrave}"`) + `<rect width="450" height="450" fill="#000" opacity="0.7" mask="url(#${u}-wall)"/><g filter="url(#${u}-b20)"><rect width="450" height="450" fill="#000" opacity="0.3" mask="url(#${u}-wall2)"/></g>` +
      sweepRing(qx, qy, 58.5, 60, STEEL_WALL, 4) + circle(G.Q, 44, `fill="none" stroke="${V.track}" stroke-width="2"`) + circle(G.Q, 39.5, `fill="none" stroke="${V.track}" stroke-width="2"`) +
      (batA > 0.5 ? `<path d="${arc(44, 0, Math.min(359.99, batA), qx, qy)}" fill="none" stroke="${low ? V.warning : V.ph}" stroke-width="2" stroke-linecap="round"/>` : '') +
      (stpA > 0.5 ? `<path d="${arc(39.5, 0, Math.min(359.99, stpA), qx, qy)}" fill="none" stroke="${V.month}" stroke-width="2" stroke-linecap="round"/>` : '') +
      subScale(u, qx, qy) + `<g font-weight="500" text-anchor="middle"><text x="${qx}" y="338" font-size="20" fill="${V.paper}">${stepsText(s.steps)}</text>` +
      `<text x="${qx}" y="348.5" font-size="7.5" letter-spacing="0.6" fill="${V.steel}">/${s.stepGoal.toLocaleString('en-US')}</text><text x="${qx}" y="365.5" font-size="15" fill="${low ? V.warning : V.paper}">${bat}</text></g>` });

    // z4: the eccentric crescent with its guilloche about H and the polished horizon bead.
    let guil = ['', '']; for (let r = 211.25, i = 0; r < 238; r += 1.25, i++) guil[i % 2] += `M${f(G.H[0] - r)} ${G.H[1]}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
    let bead = '';
    for (let a = -HCUT - 1; a < HCUT + 1; a += 1) {
      const w = Math.max(0, Math.cos((a - 315) * D2R)), env = smooth(HCUT + 1, HCUT - 16, Math.abs(a + 0.65)), r1 = G.HR + 0.6 + 4.4 * env;
      bead += `<path d="${sector(G.H[0], G.H[1], G.HR + 2.5 * env, r1, a, a + 1.3)}" fill="${mix(V.opMid, mix(V.steelMid, V.steelHi, w), env)}"/><path d="${sector(G.H[0], G.H[1], G.HR, G.HR + 0.05 + 2.5 * env, a, a + 1.3)}" fill="${mix(V.opLo, mix(V.steelFoot, V.steelMid, w), env)}"/>`;
    }
    L.push({ id: 'crescent', svg: `<g clip-path="url(#${u}-ap)"><g clip-path="url(#${u}-hz)"><circle cx="${f(G.H[0] + 1.3)}" cy="${f(G.H[1] + 1.3)}" r="${G.HR}" fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="2.6" filter="url(#${u}-b04)"/></g>` +
      `<g clip-path="url(#${u}-cres)"><rect x="40" y="30" width="370" height="140" fill="url(#${u}-crface)"/><path d="${guil[0]}" fill="none" stroke="#fff" stroke-opacity="0.06" stroke-width="1.25"/><path d="${guil[1]}" fill="none" stroke="#000" stroke-opacity="0.09" stroke-width="1.25"/></g>${bead}</g>` });

    L.push({ id: 'instrument', svg: `<g clip-path="url(#${u}-ap)">${instrument(u, ctx, sol)}</g>` });
    // z4b: lip, trench, step, F1 base and rule, groove.
    L.push({ id: 'rings', svg: sweepRing(225, 225, G.lip[0], G.lip[1], STEEL_WALL) + annulus(...G.trench, V.trench) + sweepRing(225, 225, G.step[0], G.step[1], STEEL_WALL) +
      annulus(...G.f1, V.f1) + `<circle cx="225" cy="225" r="188.5" fill="none" stroke="${V.transfer}" stroke-opacity="0.35" stroke-width="1"/>` + annulus(...G.groove, V.groove) });
    // z4c: the calendar turns in the RA frame; the sun's place among the months is the date.
    let rules = '', tS = '', tL = '';
    for (const mo of MONTHS) { rules += line(mo.rule, 189, 202); for (const [d, a] of mo.ticks) (d % 10 ? (tS += line(a, 189, 191.5)) : (tL += line(a, 189, 194))); }
    L.push({ id: 'calendar', svg: `<g transform="rotate(${f(sol.E4)} 225 225)"><path d="${rules}" stroke="${V.transfer}" stroke-opacity="0.6" stroke-width="1"/><path d="${tS}" stroke="${V.tickDay}" stroke-width="1"/><path d="${tL}" stroke="${V.month}" stroke-width="1.2"/>` +
      `<g font-size="11" fill="${V.month}" fill-opacity="0.85" letter-spacing="0.66" text-anchor="middle">${MONTHS.map((mo, i) => `<text><textPath href="#${u}-mn${i}" startOffset="50%">${mo.name}</textPath></text>`).join('')}</g></g>` });
    let gloss = ''; for (let a = 290; a < 340; a += 2) gloss += `<path d="${sector(225, 225, 188, 202.5, a, a + 2.2)}" fill="#fff" fill-opacity="${f(0.16 * Math.max(0, 1 - Math.abs(a + 1 - 315) / 25))}"/>`;
    L.push({ id: 'gloss', svg: gloss });
    L.push({ id: 'sun', svg: `<path d="${star8(sunC[0], sunC[1], 4, 2.4, 1.3)}" fill="${V.sun}" filter="url(#${u}-b05)" opacity="0.8"/><path d="${star8(sunC[0], sunC[1], 4, 2.4, 1.3)}" fill="url(#${u}-sun5)"/>` });
    const tip = sol.E3 + 3.7 + 6 * sec;
    L.push({ id: 'trail', svg: sec > 0 ? `<path d="${arc(G.trailR, sol.E3 + 3.7, tip)}" fill="none" stroke="${V.deep}" stroke-width="1.2"/>` +
      `<path d="${arc(G.trailR, Math.max(sol.E3 + 3.7, tip - 5), tip)}" fill="none" stroke="${V.ph}" stroke-width="1.6"/>` + circle(pt(G.trailR, tip), 1.3, `fill="${V.hi}"`) : '' });
    L.push({ id: 'rotor', svg: rotor(u, rotorC, sec) });

    // z4h: F2, the 24 h solar flange: guilloche, ticks, batons, numerals, the prompt, tonight's night sector.
    let gl = ['', '', '']; for (let i = 0; i < 360; i++) gl[i % 5 === 0 ? 2 : i % 2] += line(i + 0.5, G.f2[0], G.f2[1]);
    let qt = ''; for (let i = 0; i < 96; i++) { const a = i * 3.75; if (i % 4 && (a < 158 || a > 202)) qt += line(a, 205, 207.5); }
    let batons = '';
    for (const h of [1, 3, 5, 7, 9, 15, 17, 19, 21, 23]) {
      const a = W(360 - 15 * h), [x, y] = pt(215, a), lit = Math.cos((a - 90 - 315) * D2R) > Math.cos((a + 90 - 315) * D2R);
      batons += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><rect x="-1" y="-4.5" width="1" height="9" fill="${lit ? V.steelHi : V.steelLo}"/><rect x="0" y="-4.5" width="1" height="9" fill="${lit ? V.steelLo : V.steelHi}"/></g>`;
    }
    const nums = [0, 2, 4, 6, 8, 10, 14, 16, 18, 20, 22].map(h => [String(h).padStart(2, '0'), W(360 - 15 * h)]);
    let f2shadow = ''; for (let a = 225; a < 405; a += 10) f2shadow += `<path d="${sector(225, 225, 201.6, 203.5, a, a + 10.4)}" fill="#000" fill-opacity="${f(0.6 * Math.max(0, Math.cos((a + 5 - 315) * D2R)))}"/>`;
    L.push({ id: 'f2', svg: `<g filter="url(#${u}-b06)">${f2shadow}</g>` + sweepRing(225, 225, G.chamfer[0], G.chamfer[1], STEEL_WALL) + sweepRing(225, 225, G.f2[0], G.f2[1], OPALINE) +
      `<path d="${gl[0]}" stroke="#fff" stroke-opacity="0.07" stroke-width="1.1"/><path d="${gl[1]}" stroke="#000" stroke-opacity="0.1" stroke-width="1.1"/><path d="${gl[2]}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.1"/>` +
      `<path d="${qt}" stroke="${V.engrave}" stroke-width="1"/>${batons}` +
      `<g font-size="13" font-weight="500" text-anchor="middle"><g fill="${V.engrave}" transform="translate(0.75 0.75)">${nums.map(([t, a]) => ringNumeral(t, 215, a, 13, '')).join('')}</g><g fill="${V.paper}">${nums.map(([t, a]) => ringNumeral(t, 215, a, 13, '')).join('')}</g></g>` +
      `<text font-size="11" text-anchor="middle"><textPath href="#${u}-prompt" startOffset="50%"><tspan fill="${V.transfer}">kali@vault:~$ </tspan><tspan fill="${V.ph}">INFINITY</tspan><tspan fill="${V.ph}" fill-opacity="${sec % 2 ? 0 : 1}">_</tspan></textPath></text>` +
      `<path d="${arc(215, 180 + sol.H0, 540 - sol.H0)}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="20"/>` });

    // z5-7: the arched smoked-glass plate over the zenith, and the date line on it.
    L.push({ id: 'plate-aod', svg: `<path d="${platePath()}" fill="#000"/>` });
    L.push({ id: 'plate-shadow', svg: `<path d="${platePath(2.2, 2.2)}" fill="#000" fill-opacity="0.5" filter="url(#${u}-b20)"/>` });
    // Glass, not a card: no uniform outline. A polished facet lit by its normal against the 315 deg key, an internal reflection on the far (SE) edges, a faint sheen.
    const rim = plateRim(); let facet = '', refl = '';
    for (let i = 1; i < rim.length; i++) {
      const [x0, y0] = rim[i - 1], [x1, y1, n] = rim[i], w = Math.max(0, Math.cos((n - 315) * D2R)), q = Math.max(0, Math.cos((n - 135) * D2R));
      facet += `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="${mix(V.steelFoot, V.steelHi, w ** 1.4)}" stroke-opacity="${f(0.35 + 0.55 * w)}"/>`;
      if (q > 0.05) { const k = 2.2, ix = a => a - k * Math.sin(n * D2R), iy = b => b + k * Math.cos(n * D2R); refl += `<path d="M${f(ix(x0))} ${f(iy(y0))}L${f(ix(x1))} ${f(iy(y1))}" stroke="${V.steel}" stroke-opacity="${f(0.28 * q)}"/>`; }
    }
    L.push({ id: 'plate', svg: `<path d="${platePath()}" fill="#000" fill-opacity="0.75"/><path d="${platePath()}" fill="url(#${u}-sheen)"/>` +
      `<g fill="none" stroke-width="1" stroke-linecap="round">${refl}</g><g fill="none" stroke-width="1.3" stroke-linecap="round">${facet}</g>` });
    L.push({ id: 'date', svg: dateLine(false) });
    L.push({ id: 'date-aod', svg: dateLine(true) });

    // z8: the official dragon on top: height-mapped cast shadow, contact bed, per-stroke bevel.
    const cast = (o, b, m) => `<g mask="url(#${u}-${m})"><g transform="translate(${o} ${o})" filter="url(#${u}-${b})" opacity="0.6"><g transform="${dtr}" fill="#000">${dg}</g></g></g>`;
    L.push({ id: 'dragon-shadow', svg: cast(4.4, 'b13', 'rcv-sky') + cast(3.5, 'b10', 'rcv-mid') + cast(2.7, 'b08', 'rcv-f1') + cast(1.8, 'b06', 'rcv-f2') });
    L.push({ id: 'dragon', svg: `<g filter="url(#${u}-b05)"><g transform="${dtr}" fill="none" stroke="#000" stroke-opacity="0.85" stroke-width="${f(3 * dk)}" stroke-linejoin="round">${dg}</g></g>` +
      `<g transform="translate(0.6 0.6)"><g transform="${dtr}" fill="${V.deep}">${dg}</g></g><g transform="translate(-0.6 -0.6)"><g transform="${dtr}" fill="${V.spec}">${dg}</g></g>` +
      `<g transform="${dtr}" fill="url(#${u}-dragon5)">${dg}</g>` });
    L.push({ id: 'dragon-aod', svg: `<g transform="${dtr}" fill="${V.aDragon}">${dg}</g>` });
    L.push({ id: 'digits', svg: clock(ctx, 'active') }, { id: 'digits-aod', svg: clock(ctx, 'aod') });
    return L;
  }

  // ---------- wake (07 section 6.1, W = 360 ms); sleep plays the table mirrored in the 180 ms budget ----------
  function timeline() {
    const t = {}, put = (ids, wake, extra = {}) => { for (const id of ids) t[id] = { wake, sleep: [(360 - wake[1]) / 2, (360 - wake[0]) / 2], ...extra }; };
    put(['sky', 'sky-aod'], [0, 200]);
    put(['f2'], [0, 360], { a: { rot: 0 }, d: { rot: -14 } });
    put(['skymarks', 'globe', 'dome', 'crescent', 'instrument', 'rings', 'calendar', 'gloss', 'marks-aod'], [40, 240]);
    put(['subdisc', 'plate'], [80, 320]);
    put(['globe-aod', 'subdisc-aod'], [0, 160]); // round 6: footprints leave with the AOD sky, so no black discs show during wake
    put(['plate-aod'], [320, 360]);
    put(['digits', 'date', 'digits-aod', 'date-aod'], [120, 340]);
    put(['dragon', 'dragon-aod'], [120, 360]);
    put(['dragon-shadow', 'plate-shadow'], [120, 360], { a: { dx: 0, dy: 0 }, d: { dx: -3, dy: -3 } });
    put(['trail', 'rotor', 'sun', 'live-aod'], [200, 360]);
    return t;
  }
  const MOMENTS = {
    M1: '2027-04-16T20:08:24+09:00', M2: '2026-10-25T10:08:24+09:00', M3: '2026-11-20T02:00:00+09:00', M4: '2026-09-23T12:00:00+09:00',
    M5: '2026-06-21T12:00:00+09:00', M6: '2026-10-25T08:08:00+09:00', M7: '2026-11-09T20:08:00+09:00', M8: '2026-11-17T20:08:00+09:00'
  };
  F.PRESETS.vault5 = { label: 'G3 Debate vault', note: 'Pole under the dragon, horizon crescent, Moon globe at 3, sub-disc at 7, sidereal rotor, two flanges', host: 'vault', timeline: timeline(), build };
  root.VaultV5 = { horizonPt, aboutH, G, V, CUT, HCUT, NAMES, ANCHORS, MOMENTS, PSTAR, solar, planetsAt, moonSprite, precess, galactic, tone, dial, platePath, archY, maskSvg };
  if (typeof module !== 'undefined') module.exports = root.VaultV5;
})(typeof globalThis !== 'undefined' ? globalThis : this);
