// KALIWATCH v5 "Celestial Vault" face renderer.
// render(input) -> self-contained SVG string (450 design space). Deterministic for a given input.
// Every layer is emitted twice where it differs between modes: `<id>` (interactive) and `<id>-aod`
// (ambient), exactly the paired-element pattern the Watch Face Format port will use. The wake/sleep
// choreography is data (TIMELINES) so the studio, the reference renders and the WFF Variants agree.
(function (root) {
  'use strict';
  const req = n => (typeof require !== 'undefined' ? require(n) : null);
  const T = root.VaultTokens || req('./tokens.js');
  const A = root.KaliAstro || req('./astro.js');
  const K = root.KaliSky || req('./sky.js');
  const DR = root.KaliDragon || req('./dragon-data.js');
  const OrbitFonts = root.OrbitFonts || req('./orbit-fonts.js');
  const Expressions = root.WffExpr || req('./wff-expr.js');
  const C = T.color, D2R = Math.PI / 180;
  const f = n => Number((+n).toFixed(2));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  const pt = (r, a, cx = 225, cy = 225) => [cx + r * Math.sin(a * D2R), cy - r * Math.cos(a * D2R)];
  const P = ([x, y]) => `${f(x)} ${f(y)}`;
  function arc(r, a0, a1, cx = 225, cy = 225) {
    const sweep = a1 - a0; if (Math.abs(sweep) < 0.01) return '';
    if (Math.abs(sweep) >= 359.99) return `M${P(pt(r, 0, cx, cy))}A${r} ${r} 0 1 1 ${P(pt(r, 180, cx, cy))}A${r} ${r} 0 1 1 ${P(pt(r, 360, cx, cy))}`;
    return `M${P(pt(r, a0, cx, cy))}A${r} ${r} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${P(pt(r, a1, cx, cy))}`;
  }
  function ring(r0, r1, cx = 225, cy = 225) { // annulus path for evenodd fill
    return `M${cx - r1} ${cy}a${r1} ${r1} 0 1 0 ${2 * r1} 0a${r1} ${r1} 0 1 0 ${-2 * r1} 0ZM${cx - r0} ${cy}a${r0} ${r0} 0 1 0 ${2 * r0} 0a${r0} ${r0} 0 1 0 ${-2 * r0} 0Z`;
  }
  function ticks(n, r0, r1, opt = {}) {
    let d = ''; const skip = opt.skip || (() => false);
    for (let i = 0; i < n; i++) { if (skip(i)) continue; const a = i * 360 / n + (opt.offset || 0); d += `M${P(pt(r0, a, opt.cx, opt.cy))}L${P(pt(r1, a, opt.cx, opt.cy))}`; }
    return d;
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function bezier(p1x, p1y, p2x, p2y) { // CSS cubic-bezier as y(x)
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx, cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const e = X(t) - x, d = dX(t); if (Math.abs(e) < 1e-6 || !d) break; t -= e / d; } return Y(Math.max(0, Math.min(1, t))); };
  }
  const ease = bezier(...T.motion.ease);

  // ---------- input ----------
  function normalize(input = {}) {
    let date = input.date instanceof Date ? input.date : new Date(input.date || T.sample.iso);
    if (Number.isNaN(date.getTime())) date = new Date(T.sample.iso);
    const clampNum = (v, lo, hi, d) => v === null ? null : Math.max(lo, Math.min(hi, Number.isFinite(+v) ? Math.round(+v) : d));
    return {
      preset: PRESETS[input.preset] ? input.preset : 'vault', mode: input.mode === 'ambient' ? 'ambient' : 'active', date,
      battery: input.battery === null ? null : clampNum(input.battery, 0, 100, T.sample.battery),
      steps: input.steps === null ? null : clampNum(input.steps, 0, 99999, T.sample.steps), stepGoal: Math.max(1, clampNum(input.stepGoal, 1, 1000000, input.preset === 'vault5' ? 8000 : T.sample.stepGoal)),
      uid: (input.uid || 'kv').replace(/[^a-z0-9-]/gi, ''), guides: !!input.guides, fontData: input.fontData || '',
      hide: Array.isArray(input.hide) ? input.hide : [],
      frame: input.frame || null, // {fromMode, toMode, ms}: render one frame of a transition
      motion: ['full', 'calm', 'still'].includes(input.motion) ? input.motion : 'calm',
      reducedMotion: !!input.reducedMotion, windowMs: Math.max(300, Math.min(800, +input.windowMs || 360)),
      tilt: { x: Math.max(-90, Math.min(90, +input.tilt?.x || 0)), y: Math.max(-90, Math.min(90, +input.tilt?.y || 0)) },
      dayDim: input.dayDim !== false, labels: input.labels !== false, highlightDraco: input.highlightDraco !== false
    };
  }
  // Wall-clock fields in the watch's zone (Asia/Seoul) regardless of the host machine's zone.
  function localFields(date) {
    const t = new Date(date.getTime() + T.site.utcOffsetMin * 60000);
    return { h: t.getUTCHours(), m: t.getUTCMinutes(), s: t.getUTCSeconds(), day: t.getUTCDate(), mon: t.getUTCMonth(), wd: t.getUTCDay(), y: t.getUTCFullYear() };
  }
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const WD = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const ZOD = ['ARI', 'TAU', 'GEM', 'CNC', 'LEO', 'VIR', 'LIB', 'SCO', 'SGR', 'CAP', 'AQR', 'PSC'];

  // ---------- shared parts ----------
  const DRAGON_INK = { x: 5.5576, y: 21.5022, w: 124.3547, h: 92.4661 };
  function dragonPath() { return DR.body.replace(/fill="currentColor"/g, ''); }
  function dragonAt(x, y, s) { return `translate(${f(x)} ${f(y)}) scale(${s}) translate(${-DRAGON_INK.x} ${-DRAGON_INK.y})`; }
  function dragonRelief(u, x, y, s) {
    const tr = dragonAt(x, y, s), p = dragonPath(), k = 1 / s;
    return {
      shadow: `<g transform="translate(3 5)" filter="url(#${u}-blur5)" opacity="0.62"><g transform="${tr}" fill="#000">${p}</g></g>`,
      body: `<g transform="${tr}"><g transform="translate(${f(0.9 * k)} ${f(1.1 * k)})" fill="${C.phosphorShade}">${p}</g>` +
        `<g transform="translate(${f(-0.75 * k)} ${f(-0.75 * k)})" fill="${C.phosphorLight}" opacity="0.9">${p}</g>` +
        `<g fill="url(#${u}-dragon-body)">${p}</g></g>` +
        `<g transform="${tr}" fill="${C.phosphor}" filter="url(#${u}-glow)" opacity="0.28">${p}</g>`,
      aod: `<g transform="${tr}" fill="#0A130A" stroke="${C.aodDragon}" stroke-width="${f(1.15 * k)}" stroke-linejoin="round">${p}</g>`
    };
  }
  function moonGlyph(cx, cy, r, moon, sunAngleDeg, lit, dark, limb) {
    // Lit limb faces the sun; terminator is an ellipse of half-width r*|cos(elongation)|.
    const E = moon.elongation > 180 ? 360 - moon.elongation : moon.elongation, rx = Math.abs(Math.cos(E * D2R)) * r;
    const sweep = E > 90 ? 1 : 0, rot = sunAngleDeg - 90; // local +x points toward the sun
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)})"><circle r="${r}" fill="${dark}"/>` +
      `<path d="M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${f(rx)} ${r} 0 0 ${sweep} 0 ${-r}Z" fill="${lit}"/>` +
      (limb ? `<circle r="${f(r - 0.3)}" fill="none" stroke="${limb}" stroke-width="0.6" opacity="0.7"/>` : '') + `</g>`;
  }
  function sunGlyph(u, cx, cy, r, glow) {
    return (glow ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 2.6)}" fill="url(#${u}-sun-glow)"/>` : '') +
      `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="url(#${u}-sun-body)"/>` +
      `<circle cx="${f(cx - r * 0.3)}" cy="${f(cy - r * 0.3)}" r="${f(r * 0.38)}" fill="${C.goldLight}" opacity="0.7"/>`;
  }
  function digits(ctx, g, mode) {
    const { h, m } = ctx.local, hh = String(h).padStart(2, '0'), mm = String(m).padStart(2, '0');
    const base = `font-size="${T.type.time}" font-weight="${T.type.timeWeight}" text-anchor="middle"`;
    if (mode === 'shadow') return `<g ${base} fill="#000" opacity="0.62" transform="translate(2 3)"><text x="${g.hx}" y="${g.base}">${hh}</text><text x="${g.cx}" y="${g.base - 4}">:</text><text x="${g.mx}" y="${g.base}">${mm}</text></g>`;
    if (mode === 'aod') return `<g ${base} fill="${C.aodDigitFill}" stroke="${C.aodDigitStroke}" stroke-width="1.4" paint-order="stroke"><text x="${g.hx}" y="${g.base}">${hh}</text><text x="${g.cx}" y="${g.base - 4}" stroke="${C.aodDragon}">:</text><text x="${g.mx}" y="${g.base}">${mm}</text></g>`;
    return `<g ${base} fill="${C.paper}" aria-label="${hh}:${mm}"><text x="${g.hx}" y="${g.base}">${hh}</text><text x="${g.cx}" y="${g.base - 4}" fill="${C.phosphor}">:</text><text x="${g.mx}" y="${g.base}">${mm}</text></g>`;
  }
  function dateText(ctx) { const l = ctx.local; return `${String(l.day).padStart(2, '0')} ${MON[l.mon]} / ${WD[l.wd]}`; }
  function lstText(ctx) { const h = ctx.sky.lst / 15, hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; }
  function gauge(x, y, w, frac, color) {
    return `<path d="M${f(x)} ${y}h${w}" stroke="${C.track}" stroke-width="2"/>` + (frac > 0 ? `<path d="M${f(x)} ${y}h${f(w * Math.min(1, frac))}" stroke="${color}" stroke-width="2"/>` : '');
  }
  function telemetryValues(ctx) {
    const s = ctx.s, low = s.battery !== null && s.battery <= 15;
    return { bat: s.battery === null ? '—' : `${s.battery}%`, steps: s.steps === null ? '—' : s.steps.toLocaleString('en-US'), low,
      batFrac: s.battery === null ? 0 : s.battery / 100, stepFrac: s.steps === null ? 0 : s.steps / s.stepGoal };
  }
  function prompt(x, y, size, host) {
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${C.quiet}">kali@${host}:~$ <tspan fill="${C.phosphor}">INFINITY</tspan></text>`;
  }
  function skyDisc(ctx, cfg, variant) {
    const key = cfg.cacheKey + ':' + variant;
    if (!SKY_CACHE[key]) SKY_CACHE[key] = variant === 'aod' ? K.renderAmbient({ ...cfg.sky, ambientColor: C.aodStar }).svg : K.render({ ...cfg.sky, highlightCon: ctx.s.highlightDraco ? 'Dra' : null }).svg;
    return SKY_CACHE[key];
  }
  const SKY_CACHE = {};
  function skyBody(ctx, cfg, ra, dec) { // dial-frame position of a body at the current LST
    const p = A.polar(ra, dec, ctx.sky.lst, cfg.sky.scale, cfg.sky.meridianDeg, cfg.sky.projection);
    return { x: cfg.sky.center[0] + p.x, y: cfg.sky.center[1] + p.y, angle: p.angle };
  }
  function seedFlecks(u, r0, r1, n, seed, color) {
    const rand = K.rng(seed); let d = '';
    for (let i = 0; i < n; i++) {
      const a = rand() * 360, r = r0 + rand() * (r1 - r0), [x, y] = pt(r, a), big = rand() < 0.06;
      d += `<circle cx="${f(x)}" cy="${f(y)}" r="${big ? 0.9 : 0.5}" opacity="${f(big ? 0.55 : 0.15 + rand() * 0.3)}"/>`;
    }
    return `<g fill="${color}">${d}</g>`;
  }

  function defs(u, extra = '') {
    return `<defs>
<filter id="${u}-blur5" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4.2"/></filter>
<filter id="${u}-blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="${u}-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="${u}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="${u}-dragon-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C6FF8E"/><stop offset=".45" stop-color="${C.phosphor}"/><stop offset="1" stop-color="#78B84C"/></linearGradient>
<radialGradient id="${u}-sun-body" cx=".38" cy=".36" r=".7"><stop offset="0" stop-color="${C.goldLight}"/><stop offset=".55" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/></radialGradient>
<radialGradient id="${u}-sun-glow"><stop offset="0" stop-color="${C.gold}" stop-opacity=".42"/><stop offset=".45" stop-color="${C.gold}" stop-opacity=".12"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-daylight"><stop offset="0" stop-color="#C9B07A" stop-opacity=".20"/><stop offset=".4" stop-color="#4A6A68" stop-opacity=".10"/><stop offset="1" stop-color="#0E2A2E" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26302B"/><stop offset=".5" stop-color="${C.metal}"/><stop offset="1" stop-color="#090C0A"/></linearGradient>
<linearGradient id="${u}-bevel-hi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.metalHigh}" stop-opacity=".75"/><stop offset=".42" stop-color="${C.metalHigh}" stop-opacity=".12"/><stop offset=".6" stop-color="#000" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity=".0"/></linearGradient>
<linearGradient id="${u}-bevel-lo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></linearGradient>
<linearGradient id="${u}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.grisaille}" stop-opacity=".55"/><stop offset=".5" stop-color="${C.grisaille}" stop-opacity=".08"/><stop offset="1" stop-color="${C.grisaille}" stop-opacity=".03"/></linearGradient>
<linearGradient id="${u}-rim-dark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.grisaille}" stop-opacity=".03"/><stop offset=".5" stop-color="${C.grisaille}" stop-opacity=".1"/><stop offset="1" stop-color="${C.grisaille}" stop-opacity=".5"/></linearGradient>
${extra}</defs>`;
  }

  // ---------- presets ----------
  const PRESETS = {};

  // A. VAULT: Polaris under the colon; the whole sky turns around the time inside a domed vault with a
  // trench (gold sun), a 24-hour solar ring, a minute flange and a sidereal sentinel. North-facing view.
  PRESETS.vault = {
    label: 'A · Vault', note: 'Pole under the colon, domed vault, trench sun, two flanges, sidereal sentinel',
    sky: { projection: 'equidistant', scale: 1.633, meridianDeg: 0, decLimit: -30, center: [225, 225], magLimit: 4.6, innerCalm: { cx: 0, cy: 0, radius: 108, factor: 0.55 } },
    cacheKey: 'vault', host: 'vault',
    dragon: { x: 147, y: 38, s: 1.25 },
    digits: { hx: 166, cx: 225, mx: 284, base: 252 },
    build(ctx) {
      const u = ctx.u, L = [], cfg = this, sky = ctx.sky, tv = telemetryValues(ctx);
      const R = 196, C0 = 225, hz = K.horizonPath(T.site.lat, cfg.sky);
      const sunB = skyBody(ctx, cfg, sky.sun.ra, sky.sun.dec), moonB = skyBody(ctx, cfg, sky.moon.ra, sky.moon.dec);
      const day = sky.sun.alt > -6, dayK = ctx.s.dayDim ? (sky.sun.alt > 0 ? 0.72 : sky.sun.alt > -12 ? 0.86 : 1) : 1;
      const disc = A.discAngle(sky.lst);
      const extra = `<clipPath id="${u}-vault"><circle cx="225" cy="225" r="${R}"/></clipPath>
<radialGradient id="${u}-enamel" cx="225" cy="225" r="${R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0B1719"/><stop offset=".62" stop-color="#081214"/><stop offset="1" stop-color="#04090A"/></radialGradient>
<radialGradient id="${u}-glaze" cx="170" cy="150" r="170" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#DDE8E2" stop-opacity=".085"/><stop offset=".55" stop-color="#DDE8E2" stop-opacity=".025"/><stop offset="1" stop-color="#DDE8E2" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-terminator" cx="196" cy="196" r="246" gradientUnits="userSpaceOnUse"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
<radialGradient id="${u}-well" cx="225" cy="226" r="150" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 135.6) scale(1 .4)"><stop offset="0" stop-color="#000" stop-opacity=".62"/><stop offset=".7" stop-color="#000" stop-opacity=".34"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-trench" cx="225" cy="225" r="203" gradientUnits="userSpaceOnUse"><stop offset=".9655" stop-color="#000" stop-opacity=".92"/><stop offset=".983" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient>`;
      ctx.defs = defs(u, extra);

      // z1 trench floor: aventurine lacquer visible at the bottom of the trench.
      L.push({ id: 'bed', svg: `<path d="${ring(195.5, 203.5)}" fill="#05080A" fill-rule="evenodd"/>${seedFlecks(u, 196.5, 202.5, 340, 945, C.gold)}` });
      // z2 sky (rotating) and its ambient twin.
      L.push({ id: 'sky', svg: `<g clip-path="url(#${u}-vault)"><circle cx="225" cy="225" r="${R}" fill="url(#${u}-enamel)"/><g transform="translate(225 225) rotate(${f(disc)})" opacity="${dayK}">${skyDisc(ctx, cfg, 'active')}</g>` +
        (sky.sun.alt > -8 ? `<circle cx="${f(sunB.x)}" cy="${f(sunB.y)}" r="96" fill="url(#${u}-daylight)"/>` : '') +
        (sky.sun.alt > -1 ? sunGlyph(u, sunB.x, sunB.y, 5.2, true) : '') +
        moonGlyph(moonB.x, moonB.y, 4.6, sky.moon, Math.atan2(sunB.x - moonB.x, -(sunB.y - moonB.y)) / D2R, C.grisaille, '#121A18', null) + `</g>` });
      L.push({ id: 'sky-aod', svg: `<g clip-path="url(#${u}-vault)"><g transform="translate(225 225) rotate(${f(disc)})">${skyDisc(ctx, cfg, 'aod')}</g></g>` });
      // z3 ground: the sky below Seoul's horizon falls into the earth; telemetry is inscribed on it.
      L.push({ id: 'ground', svg: `<g clip-path="url(#${u}-vault)"><path d="M0 0H450V450H0Z${hz.d.replace(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g, (m, a, _, b) => `${f(+a + C0)} ${f(+b + C0)}`)}" fill="#000" fill-rule="evenodd" opacity="0.74" filter="url(#${u}-feather)"/>` +
        `<path d="${hz.d.replace(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g, (m, a, _, b) => `${f(+a + C0)} ${f(+b + C0)}`)}" fill="none" stroke="${C.grisaille}" stroke-width="0.7" opacity="0.22"/></g>` });
      // z4 dome light: glaze, terminator, central well, Fresnel rim (static, never rotates).
      L.push({ id: 'dome', svg: `<circle cx="225" cy="225" r="${R}" fill="url(#${u}-glaze)"/><circle cx="225" cy="225" r="${R}" fill="url(#${u}-terminator)"/>` +
        `<ellipse cx="225" cy="226" rx="150" ry="60" fill="url(#${u}-well)"/>` +
        `<circle cx="225" cy="225" r="193.2" fill="none" stroke="url(#${u}-rim)" stroke-width="5"/><circle cx="225" cy="225" r="195.6" fill="none" stroke="url(#${u}-rim)" stroke-width="0.8"/>` });
      // z5 trench AO + gold sun bead at true solar hour angle (radially aligned with the real sun on the sky).
      const sunA = sunB.angle, [sx, sy] = pt(199.5, sunA);
      L.push({ id: 'trench', svg: `<path d="${ring(195.5, 203.5)}" fill="url(#${u}-trench)" fill-rule="evenodd"/>${sunGlyph(u, sx, sy, 3.6, true)}` });
      L.push({ id: 'trench-aod', svg: `<circle cx="${f(sx)}" cy="${f(sy)}" r="3.2" fill="none" stroke="${C.aodGold}" stroke-width="1"/>` });
      // z6 flanges: inner 24 h solar ring (r203-214), bevel, outer minute ring (r217-225).
      const solarLabels = [[0, '12'], [90, '06'], [180, '00'], [270, '18']].map(([a, t]) => { const [x, y] = pt(208.6, a); return `<text x="${f(x)}" y="${f(y + 2.6)}" text-anchor="middle" transform="rotate(${a === 180 ? 0 : a === 90 ? 90 : a === 270 ? -90 : 0} ${f(x)} ${f(y)})">${t}</text>`; }).join('');
      L.push({ id: 'flange', svg: `<path d="${ring(203.5, 214)}" fill="url(#${u}-metal)" fill-rule="evenodd"/>` +
        `<path d="${ticks(24, 205.5, 211.5, { skip: i => i % 6 === 0 })}" stroke="#6F8076" stroke-width="0.8" opacity="0.8"/>` +
        `<g font-size="7.2" fill="#93A39A" font-weight="500" letter-spacing="0.4">${solarLabels}</g>` +
        `<circle cx="225" cy="225" r="203.8" fill="none" stroke="url(#${u}-rim-dark)" stroke-width="0.9"/>` +
        `<path d="${ring(214, 217)}" fill="#0B0F0D" fill-rule="evenodd"/><circle cx="225" cy="225" r="215.5" fill="none" stroke="url(#${u}-bevel-hi)" stroke-width="3"/><circle cx="225" cy="225" r="215.5" fill="none" stroke="url(#${u}-bevel-lo)" stroke-width="3"/>` +
        `<path d="${ring(217, 225)}" fill="url(#${u}-metal)" fill-rule="evenodd"/>` +
        `<path d="${ticks(60, 219, 222.5, { skip: i => i % 5 === 0 })}" stroke="#4F5F56" stroke-width="0.8"/>` +
        `<path d="${ticks(12, 218.2, 224.4)}" stroke="#B9C4C0" stroke-width="2.2"/><path d="${ticks(12, 218.2, 224.4, { offset: -0.5 })}" stroke="#F0F5F2" stroke-width="0.5" opacity="0.6"/>` +
        `<circle cx="225" cy="225" r="217.4" fill="none" stroke="url(#${u}-rim)" stroke-width="0.8"/>` });
      L.push({ id: 'flange-aod', svg: `<path d="${ticks(12, 218.5, 224)}" stroke="#46584C" stroke-width="1.6"/><path d="${ticks(4, 205, 212)}" stroke="#3A4A40" stroke-width="1"/>` });
      // z7 minute arc in the outer flange (civil minutes, clockwise) — carries the v4 alignment signature.
      const minA = ctx.local.m * 6 + ctx.local.s * 0.1;
      L.push({ id: 'minutes', svg: `<path d="${arc(221, 0, Math.max(0.2, minA))}" fill="none" stroke="${C.phosphor}" stroke-width="1.8" stroke-linecap="round" opacity="0.88"/><circle cx="${f(pt(221, minA)[0])}" cy="${f(pt(221, minA)[1])}" r="2.4" fill="${C.phosphor}"/>` });
      L.push({ id: 'minutes-aod', svg: `<path d="${arc(221, 0, Math.max(0.2, ctx.local.m * 6))}" fill="none" stroke="#3E5236" stroke-width="1.4"/>` });
      // z8 sentinel: Cosmotourbillon analogue locked to the vernal point (RA 0h), orbits once per sidereal day;
      // its hand turns once per minute (seconds).
      const vA = A.norm(disc + cfg.sky.meridianDeg), [vx, vy] = pt(209, vA), secA = ctx.local.s * 6;
      L.push({ id: 'sentinel', svg: `<g transform="translate(${f(vx)} ${f(vy)})"><circle r="9.6" fill="#000" opacity="0.55" transform="translate(1.2 1.6)"/><circle r="8.6" fill="#050806" stroke="${C.phosphor}" stroke-width="1.3"/>` +
        `<path d="${[0, 120, 240].map(a => `M${P(pt(3.2, a, 0, 0))}L${P(pt(7.6, a, 0, 0))}`).join('')}" stroke="#5B7A5E" stroke-width="0.9"/>` +
        `<g transform="rotate(${secA})"><path d="M0 1.6V-7" stroke="${C.phosphor}" stroke-width="1.2" stroke-linecap="round"/></g><circle r="1.5" fill="${C.phosphor}"/></g>` });
      L.push({ id: 'sentinel-aod', svg: `<circle cx="${f(vx)}" cy="${f(vy)}" r="8" fill="none" stroke="#3E5236" stroke-width="1"/>` });
      // z9 dragon relief + cast shadow on the sky.
      const dg = dragonRelief(u, cfg.dragon.x, cfg.dragon.y, cfg.dragon.s);
      L.push({ id: 'dragon-shadow', svg: dg.shadow }, { id: 'dragon', svg: dg.body }, { id: 'dragon-aod', svg: dg.aod });
      // z10 moon porthole sunk into the ground (lunation), between the two readings.
      const mx = 225, my = 321, sunDir = sky.moon.waxing ? 90 : 270;
      L.push({ id: 'porthole', svg: `<circle cx="${mx}" cy="${my}" r="19.5" fill="url(#${u}-metal)"/><circle cx="${mx}" cy="${my}" r="18.6" fill="none" stroke="url(#${u}-rim-dark)" stroke-width="1"/><circle cx="${mx}" cy="${my}" r="15.6" fill="#000"/>` +
        moonGlyph(mx, my, 12.2, sky.moon, sunDir, C.grisaille, '#0E1514', null) + `<circle cx="${mx}" cy="${my}" r="15.6" fill="none" stroke="#000" stroke-width="3" opacity="0.65"/><circle cx="${mx}" cy="${my}" r="15.8" fill="none" stroke="url(#${u}-rim)" stroke-width="0.7"/>` });
      L.push({ id: 'porthole-aod', svg: `<circle cx="${mx}" cy="${my}" r="15.6" fill="none" stroke="#2C3A31" stroke-width="1"/>` + moonGlyph(mx, my, 12.2, sky.moon, sunDir, '#4A5852', '#000', null) });
      // z11 text plane: date, astro line, digits (+shadow), telemetry, prompt.
      L.push({ id: 'date', svg: `<text x="225" y="180" font-size="${T.type.date}" text-anchor="middle" fill="${C.quiet}" letter-spacing="1">${dateText(ctx)}</text>` });
      L.push({ id: 'date-aod', svg: `<text x="225" y="180" font-size="${T.type.date}" text-anchor="middle" fill="${C.aodQuiet}" letter-spacing="1">${dateText(ctx)}</text>` });
      L.push({ id: 'astro', svg: `<text x="225" y="276" font-size="10" text-anchor="middle" fill="${C.muted}" letter-spacing="1.6">LST ${lstText(ctx)}   SUN IN ${ZOD[sky.sun.zodiac.index]}</text>` });
      L.push({ id: 'digits-shadow', svg: digits(ctx, cfg.digits, 'shadow') }, { id: 'digits', svg: digits(ctx, cfg.digits, 'active') }, { id: 'digits-aod', svg: digits(ctx, cfg.digits, 'aod') });
      L.push({ id: 'telemetry', svg: `<g font-size="${T.type.label}" letter-spacing="${T.type.labelTracking}" fill="${C.quiet}" text-anchor="middle"><text x="140" y="306">BATTERY</text><text x="310" y="306">STEPS</text></g>` +
        `<g font-size="${T.type.value}" text-anchor="middle" fill="${C.paper}"><text x="140" y="333" fill="${tv.low ? C.warning : C.paper}">${tv.bat}</text><text x="310" y="333">${tv.steps}</text></g>` +
        gauge(112, 344, 56, tv.batFrac, tv.low ? C.warning : C.phosphor) + gauge(282, 344, 56, tv.stepFrac, C.phosphor) + prompt(225, 379, T.type.prompt, cfg.host) });
      L.push({ id: 'telemetry-aod', svg: `<text x="140" y="333" font-size="17" text-anchor="middle" fill="${C.aodQuiet}">${tv.bat}</text><text x="225" y="379" font-size="10.5" letter-spacing="2.4" text-anchor="middle" fill="${C.aodQuiet}">INFINITY</text>` });
      return L;
    }
  };

  // B. POLE: the north celestial pole sits under the dragon at the top; the dial edge is Seoul's horizon,
  // a raised bridge carries the time across the sky, telemetry is read through a well cut in the sky plane.
  PRESETS.pole = {
    label: 'B · Pole bridge', note: 'Pole under the dragon, whole dial is the visible sky, raised bridge, sunken well, solar lip',
    sky: { projection: 'stereographic', scale: 137.2, meridianDeg: 180, decLimit: -56, center: [225, 47], magLimit: 4.6 },
    cacheKey: 'pole', host: 'orbit',
    dragon: { x: 158, y: 18, s: 1.08 },
    digits: { hx: 166, cx: 225, mx: 284, base: 252 },
    build(ctx) {
      const u = ctx.u, L = [], cfg = this, sky = ctx.sky, tv = telemetryValues(ctx), AP = 176;
      const sunB = skyBody(ctx, cfg, sky.sun.ra, sky.sun.dec), moonB = skyBody(ctx, cfg, sky.moon.ra, sky.moon.dec);
      const dayK = ctx.s.dayDim ? (sky.sun.alt > 0 ? 0.72 : sky.sun.alt > -12 ? 0.86 : 1) : 1, disc = A.discAngle(sky.lst);
      const well = `M${P(pt(AP, 120))}A${AP} ${AP} 0 0 1 ${P(pt(AP, 240))}L${f(pt(AP, 240)[0])} 296H${f(pt(AP, 120)[0])}Z`;
      ctx.defs = defs(u, `<clipPath id="${u}-ap"><circle cx="225" cy="225" r="${AP}"/></clipPath>
<radialGradient id="${u}-haze" cx="225" cy="114" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#14262B" stop-opacity=".5"/><stop offset=".55" stop-color="#0B171A" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
<linearGradient id="${u}-bridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B110E"/><stop offset="1" stop-color="#050806"/></linearGradient>
<radialGradient id="${u}-ringbody" cx="225" cy="225" r="211" gradientUnits="userSpaceOnUse"><stop offset=".834" stop-color="#101C14"/><stop offset="1" stop-color="#07100B"/></radialGradient>`);
      L.push({ id: 'sky', svg: `<g clip-path="url(#${u}-ap)"><circle cx="225" cy="225" r="${AP}" fill="#050A0B"/><g transform="translate(225 47) rotate(${f(disc)})" opacity="${dayK}">${skyDisc(ctx, cfg, 'active')}</g>` +
        (sky.sun.alt > -8 ? `<circle cx="${f(sunB.x)}" cy="${f(sunB.y)}" r="110" fill="url(#${u}-daylight)"/>` : '') + (sky.sun.alt > -1 ? sunGlyph(u, sunB.x, sunB.y, 5, true) : '') +
        (sky.moon && moonB ? moonGlyph(moonB.x, moonB.y, 4.6, sky.moon, Math.atan2(sunB.x - moonB.x, -(sunB.y - moonB.y)) / D2R, C.grisaille, '#121A18', null) : '') +
        `<circle cx="225" cy="225" r="${AP}" fill="url(#${u}-haze)"/></g>` });
      L.push({ id: 'sky-aod', svg: `<g clip-path="url(#${u}-ap)"><g transform="translate(225 47) rotate(${f(disc)})">${skyDisc(ctx, cfg, 'aod')}</g></g>` });
      L.push({ id: 'well', svg: `<path d="${well}" fill="#000"/><path d="M${f(pt(AP, 240)[0])} 296H${f(pt(AP, 120)[0])}" stroke="#22343A" stroke-width="1" opacity="0.7"/>` });
      L.push({ id: 'well-aod', svg: `<path d="${well}" fill="#000"/>` });
      L.push({ id: 'telemetry', svg: `<g font-size="${T.type.label}" letter-spacing="${T.type.labelTracking}" fill="${C.quiet}" text-anchor="middle"><text x="145" y="318">BATTERY</text><text x="305" y="318">STEPS</text></g>` +
        `<g font-size="25" text-anchor="middle"><text x="145" y="347" fill="${tv.low ? C.warning : C.paper}">${tv.bat}</text><text x="305" y="347" fill="${C.paper}">${tv.steps}</text></g>` +
        `<path d="M225 310v44" stroke="${C.phosphorDeep}"/>` + gauge(119, 359, 52, tv.batFrac, tv.low ? C.warning : C.phosphor) + gauge(279, 359, 52, tv.stepFrac, C.phosphor) + prompt(225, 380, 11, cfg.host) });
      L.push({ id: 'telemetry-aod', svg: `<text x="225" y="337" font-size="17" text-anchor="middle" fill="${C.aodQuiet}">BAT ${tv.bat}</text><text x="225" y="374" font-size="10.5" letter-spacing="2.4" text-anchor="middle" fill="${C.aodQuiet}">INFINITY</text>` });
      L.push({ id: 'bridge', svg: `<g filter="url(#${u}-blur5)" opacity="0.7"><rect x="46" y="176" width="358" height="106" rx="6" fill="#000"/></g><rect x="44" y="172" width="362" height="106" rx="6" fill="url(#${u}-bridge)" opacity="0.96"/>` +
        `<path d="M50 172.6H400" stroke="#3A5A34" stroke-width="1" opacity="0.8"/><path d="M50 277.5H400" stroke="#000"/>` });
      L.push({ id: 'bridge-aod', svg: `<rect x="44" y="172" width="362" height="106" rx="6" fill="#000" stroke="#16231A" stroke-width="1"/>` });
      L.push({ id: 'date', svg: `<text x="225" y="193" font-size="14" letter-spacing="1.5" text-anchor="middle" fill="${C.quiet}">${dateText(ctx)}</text><text x="225" y="273" font-size="11" letter-spacing="1.6" text-anchor="middle" fill="#5E7D52">SEC ${String(ctx.local.s).padStart(2, '0')}   LST ${lstText(ctx)}</text>` });
      L.push({ id: 'date-aod', svg: `<text x="225" y="193" font-size="14" letter-spacing="1.5" text-anchor="middle" fill="${C.aodQuiet}">${dateText(ctx)}</text>` });
      L.push({ id: 'digits-shadow', svg: digits(ctx, cfg.digits, 'shadow') }, { id: 'digits', svg: digits(ctx, cfg.digits, 'active') }, { id: 'digits-aod', svg: digits(ctx, cfg.digits, 'aod') });
      // ring r176-211 (seconds) and solar lip r211-225 (sun, day arc, moon).
      const H = ((sky.lst - sky.sun.ra) % 360 + 540) % 360 - 180, solarH = (H / 15 + 12 + 24) % 24, sunA = A.norm(15 * solarH + 180);
      const H0 = Math.acos(Math.max(-1, Math.min(1, -Math.tan(T.site.lat * D2R) * Math.tan(sky.sun.dec * D2R)))) / D2R;
      const dayStart = A.norm(15 * (12 - H0 / 15) + 180), daySpan = 2 * H0, [sx, sy] = pt(218, sunA);
      const moonA = A.norm(sunA + sky.moon.elongation), [mx, my] = pt(217.5, moonA);
      L.push({ id: 'flange', svg: `<path d="${ring(AP, 211)}" fill="url(#${u}-ringbody)" fill-rule="evenodd"/><circle cx="225" cy="225" r="176.6" fill="none" stroke="url(#${u}-rim)" stroke-width="1.1"/>` +
        `<circle cx="225" cy="225" r="192" fill="none" stroke="${C.track}"/><path d="${ticks(60, 203, 209, { skip: i => i % 5 === 0 })}" stroke="${C.phosphorDeep}"/><path d="${ticks(12, 200, 210)}" stroke="#526650" stroke-width="1.6"/>` +
        `<path d="${ring(211, 225)}" fill="#030504" fill-rule="evenodd"/><path d="${ticks(24, 213.5, 216)}" stroke="#34543C" stroke-width="0.9"/>` +
        `<path d="${arc(219.5, dayStart, dayStart + daySpan)}" fill="none" stroke="${C.gold}" stroke-width="2.6" opacity="0.32"/>` });
      L.push({ id: 'flange-aod', svg: `<g fill="none" stroke="#4D633F" stroke-width="1.25">${[12, 102, 192, 282].map(a => `<path d="${arc(192, a, a + 48)}"/>`).join('')}</g><path d="${ticks(12, 203, 211)}" stroke="${C.aodQuiet}" stroke-width="1"/>` });
      const secA = ctx.local.s * 6;
      L.push({ id: 'minutes', svg: `<path d="${arc(192, 0, Math.max(0.2, secA))}" fill="none" stroke="${C.phosphor}" stroke-width="1.7" opacity="0.72"/><g transform="rotate(${secA} 225 225)"><circle cx="225" cy="33" r="3.3" fill="${C.phosphor}"/><path d="M225 23v-5" stroke="${C.phosphor}" stroke-width="1.5"/></g>` });
      L.push({ id: 'trench', svg: sunGlyph(u, sx, sy, 4.4, true) + moonGlyph(mx, my, 6.2, sky.moon, ((sunA - moonA + 360) % 360 < 180 ? moonA + 90 : moonA - 90), '#9FB0B6', '#141C1E', '#4A5A5E') });
      L.push({ id: 'trench-aod', svg: `<circle cx="${f(sx)}" cy="${f(sy)}" r="3.4" fill="none" stroke="${C.aodGold}" stroke-width="1"/>` });
      const dg = dragonRelief(u, cfg.dragon.x, cfg.dragon.y, cfg.dragon.s);
      L.push({ id: 'dragon-shadow', svg: dg.shadow }, { id: 'dragon', svg: dg.body }, { id: 'dragon-aod', svg: dg.aod });
      return L;
    }
  };

  // C. WINDOW: a planisphere window (r150) in a machined dome; pole above the time, zenith under the
  // smoked plate; 24 h solar ring with day arc and gold sun, v4 seconds orbit on the outer track.
  PRESETS.window = {
    label: 'C · Planisphere window', note: 'Sky seen through a bevelled aperture, smoked plate on the zenith, solar ring and seconds orbit outside',
    sky: { projection: 'equidistant', scale: 2.0, meridianDeg: 180, decLimit: -40, center: [225, 138], magLimit: 4.6 },
    cacheKey: 'window', host: 'orbit',
    dragon: { x: 148, y: 30, s: 1.24 },
    digits: { hx: 166, cx: 225, mx: 284, base: 252 },
    build(ctx) {
      const u = ctx.u, L = [], cfg = this, sky = ctx.sky, tv = telemetryValues(ctx), AP = 150;
      const sunB = skyBody(ctx, cfg, sky.sun.ra, sky.sun.dec), moonB = skyBody(ctx, cfg, sky.moon.ra, sky.moon.dec);
      const dayK = ctx.s.dayDim ? (sky.sun.alt > 0 ? 0.72 : sky.sun.alt > -12 ? 0.86 : 1) : 1, disc = A.discAngle(sky.lst);
      const hz = K.horizonPath(T.site.lat, cfg.sky), hzd = hz.d.replace(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g, (m, a, _, b) => `${f(+a + 225)} ${f(+b + 138)}`);
      ctx.defs = defs(u, `<clipPath id="${u}-ap"><circle cx="225" cy="225" r="${AP}"/></clipPath>
<radialGradient id="${u}-field" cx="160" cy="150" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#131A16"/><stop offset=".6" stop-color="#0A0E0C"/><stop offset="1" stop-color="#040605"/></radialGradient>
<radialGradient id="${u}-inner" cx="225" cy="225" r="${AP}" gradientUnits="userSpaceOnUse"><stop offset=".86" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>`);
      L.push({ id: 'sky', svg: `<g clip-path="url(#${u}-ap)"><circle cx="225" cy="225" r="${AP}" fill="#04080A"/><g transform="translate(225 138) rotate(${f(disc)})" opacity="${dayK}">${skyDisc(ctx, cfg, 'active')}</g>` +
        (sky.sun.alt > -8 ? `<circle cx="${f(sunB.x)}" cy="${f(sunB.y)}" r="100" fill="url(#${u}-daylight)"/>` : '') + (sky.sun.alt > -1 ? sunGlyph(u, sunB.x, sunB.y, 5.4, true) : '') +
        moonGlyph(moonB.x, moonB.y, 5, sky.moon, Math.atan2(sunB.x - moonB.x, -(sunB.y - moonB.y)) / D2R, C.grisaille, '#121A18', null) +
        `<path d="M0 0H450V450H0Z${hzd}" fill="#000" fill-rule="evenodd" opacity="0.8" filter="url(#${u}-feather)"/><circle cx="225" cy="225" r="${AP}" fill="url(#${u}-inner)"/></g>` });
      L.push({ id: 'sky-aod', svg: `<g clip-path="url(#${u}-ap)"><g transform="translate(225 138) rotate(${f(disc)})">${skyDisc(ctx, cfg, 'aod')}</g><path d="M0 0H450V450H0Z${hzd}" fill="#000" fill-rule="evenodd"/></g>` });
      const H = ((sky.lst - sky.sun.ra) % 360 + 540) % 360 - 180, sunA = A.norm(180 - H);
      const H0 = Math.acos(Math.max(-1, Math.min(1, -Math.tan(T.site.lat * D2R) * Math.tan(sky.sun.dec * D2R)))) / D2R;
      const [sx, sy] = pt(177, sunA);
      const nums = [[90, '18'], [180, '12'], [270, '06']].map(([a, t]) => { const [x, y] = pt(183.5, a); return `<text x="${f(x)}" y="${f(y + 3.4)}" text-anchor="middle">${t}</text>`; }).join('');
      L.push({ id: 'flange', svg: `<path d="${ring(AP, 225)}" fill="url(#${u}-field)" fill-rule="evenodd"/>` +
        `<circle cx="225" cy="225" r="152" fill="none" stroke="url(#${u}-rim-dark)" stroke-width="4"/><circle cx="225" cy="225" r="150.4" fill="none" stroke="#000" stroke-width="1"/>` +
        `<path d="${ring(166, 186)}" fill="#151C18" fill-rule="evenodd"/><circle cx="225" cy="225" r="167" fill="none" stroke="url(#${u}-rim)" stroke-width="1.4"/>` +
        `<path d="${ticks(24, 168, 174)}" stroke="#34543C"/><g font-size="9.5" fill="#5A6A5E">${nums}</g>` +
        `<path d="${arc(177, A.norm(180 - H0), A.norm(180 - H0) + 2 * H0)}" fill="none" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>` +
        `<path d="${ring(186, 190)}" fill="#020302" fill-rule="evenodd"/>` +
        `<circle cx="225" cy="225" r="192" fill="none" stroke="${C.track}"/><path d="${ticks(60, 202, 207, { skip: i => i % 5 === 0 })}" stroke="${C.phosphorDeep}"/><path d="${ticks(12, 202, 211)}" stroke="#526650" stroke-width="1.6"/>` +
        `<circle cx="225" cy="225" r="223.5" fill="none" stroke="url(#${u}-rim)" stroke-width="1"/>` +
        `<path d="M225 76V168" stroke="#2A3530" stroke-width="0.8"/>` });
      L.push({ id: 'flange-aod', svg: `<circle cx="225" cy="225" r="150" fill="none" stroke="#3A4A3F"/><path d="${ticks(12, 202, 211)}" stroke="${C.aodQuiet}"/>` });
      L.push({ id: 'trench', svg: sunGlyph(u, sx, sy, 4.6, true) });
      L.push({ id: 'trench-aod', svg: `<circle cx="${f(sx)}" cy="${f(sy)}" r="3.4" fill="none" stroke="${C.aodGold}"/>` });
      const secA = ctx.local.s * 6;
      L.push({ id: 'minutes', svg: `<path d="${arc(192, 0, Math.max(0.2, secA))}" fill="none" stroke="${C.phosphor}" stroke-width="1.7" opacity="0.72"/><g transform="rotate(${secA} 225 225)"><circle cx="225" cy="33" r="3.3" fill="${C.phosphor}"/><path d="M225 23v-5" stroke="${C.phosphor}" stroke-width="1.5"/></g>` });
      L.push({ id: 'minutes-aod', svg: `<g fill="none" stroke="#4D633F" stroke-width="1.25">${[12, 102, 192, 282].map(a => `<path d="${arc(192, a, a + 48)}"/>`).join('')}</g>` });
      L.push({ id: 'bridge', svg: `<g filter="url(#${u}-blur5)" opacity="0.6"><rect x="97" y="174" width="262" height="124" rx="10" fill="#000"/></g><rect x="94" y="170" width="262" height="124" rx="10" fill="#000" opacity="0.72"/>` +
        `<path d="M104 170.6H346" stroke="#3C4A41" stroke-width="1" opacity="0.6"/>` });
      L.push({ id: 'date', svg: `<text x="225" y="190" font-size="14" letter-spacing="1.4" text-anchor="middle" fill="${C.quiet}">${dateText(ctx)}</text>` });
      L.push({ id: 'date-aod', svg: `<text x="225" y="190" font-size="14" letter-spacing="1.4" text-anchor="middle" fill="${C.aodQuiet}">${dateText(ctx)}</text>` });
      L.push({ id: 'digits-shadow', svg: digits(ctx, cfg.digits, 'shadow') }, { id: 'digits', svg: digits(ctx, cfg.digits, 'active') }, { id: 'digits-aod', svg: digits(ctx, cfg.digits, 'aod') });
      L.push({ id: 'telemetry', svg: `<text x="225" y="283" font-size="12.5" text-anchor="middle" fill="${C.quiet}" letter-spacing="0.6">SEC <tspan fill="${C.paper}">${String(ctx.local.s).padStart(2, '0')}</tspan>   BAT <tspan fill="${tv.low ? C.warning : C.paper}">${tv.bat}</tspan>   STP <tspan fill="${C.paper}">${tv.steps}</tspan></text>` +
        prompt(225, 336, 12, cfg.host) + `<text x="225" y="356" font-size="8.5" letter-spacing="2" text-anchor="middle" fill="#3E4C44">SIDEREAL ${lstText(ctx)}   37.57N</text>` });
      L.push({ id: 'telemetry-aod', svg: `<text x="225" y="283" font-size="14" text-anchor="middle" fill="${C.aodQuiet}">BAT ${tv.bat}</text><text x="225" y="336" font-size="10.5" letter-spacing="2.4" text-anchor="middle" fill="${C.aodQuiet}">INFINITY</text>` });
      const dg = dragonRelief(u, cfg.dragon.x, cfg.dragon.y, cfg.dragon.s);
      L.push({ id: 'dragon-shadow', svg: dg.shadow }, { id: 'dragon', svg: dg.body }, { id: 'dragon-aod', svg: dg.aod });
      return L;
    }
  };

  // ---------- choreography ----------
  // Values per group in each mode. `a` = interactive, `d` = ambient (dormant). Window [start, end] ms.
  // Wake (AOD -> Active) lights the stack back to front; sleep is front to back in 180 ms.
  const TIMELINE = {
    'bed': { wake: [20, 200], sleep: [60, 180] },
    'sky': { a: { rot: 0 }, d: { rot: -3 }, wake: [0, 170], sleep: [80, 180] },
    'sky-aod': { wake: [0, 150], sleep: [60, 180] },
    'ground': { wake: [20, 200], sleep: [40, 180] },
    'well': { wake: [20, 200], sleep: [60, 180] },
    'well-aod': { wake: [0, 160], sleep: [60, 180] },
    'dome': { wake: [30, 210], sleep: [0, 100] },
    'trench': { wake: [80, 300], sleep: [20, 140] },
    'trench-aod': { wake: [60, 200], sleep: [80, 180] },
    'flange': { a: { scale: 1 }, d: { scale: 0.992 }, wake: [40, 250], sleep: [40, 180] },
    'flange-aod': { wake: [40, 180], sleep: [80, 180] },
    'minutes': { a: { rot: 0 }, d: { rot: -14 }, wake: [0, 360], sleep: [0, 120] },
    'minutes-aod': { wake: [0, 200], sleep: [80, 180] },
    'sentinel': { wake: [90, 300], sleep: [0, 100] },
    'sentinel-aod': { wake: [60, 200], sleep: [80, 180] },
    'porthole': { wake: [60, 260], sleep: [20, 160] },
    'porthole-aod': { wake: [40, 200], sleep: [80, 180] },
    'bridge': { a: { dy: 0 }, d: { dy: 3 }, wake: [60, 280], sleep: [20, 160] },
    'bridge-aod': { wake: [40, 200], sleep: [60, 180] },
    'dragon-shadow': { a: { dx: 0, dy: 0 }, d: { dx: -2, dy: -3 }, wake: [180, 350], sleep: [0, 90] },
    'dragon': { wake: [100, 320], sleep: [0, 140] },
    'dragon-aod': { wake: [100, 280], sleep: [40, 180] },
    'date': { wake: [120, 300], sleep: [0, 120] },
    'date-aod': { wake: [100, 260], sleep: [60, 180] },
    'astro': { wake: [220, 360], sleep: [0, 90] },
    'digits-shadow': { wake: [200, 350], sleep: [0, 80] },
    'digits': { wake: [120, 320], sleep: [0, 180] },
    'digits-aod': { wake: [100, 260], sleep: [0, 180] },
    'telemetry': { wake: [200, 360], sleep: [0, 90] },
    'telemetry-aod': { wake: [0, 120], sleep: [90, 180] }
  };
  // `tl` is a preset's own timeline (falls back to TIMELINE); `c` is the rotation/scale centre of a group.
  function spec(id, tl) {
    const t = (tl && tl[id]) || TIMELINE[id] || {}, aod = /-aod$/.test(id), [cx, cy] = t.c || [225, 225];
    return { a: { opacity: aod ? 0 : 1, rot: 0, scale: 1, dx: 0, dy: 0, cx, cy, ...(t.a || {}) }, d: { opacity: aod ? 1 : 0, rot: 0, scale: 1, dx: 0, dy: 0, cx, cy, ...(t.d || {}) }, wake: t.wake || [0, 360], sleep: t.sleep || [0, 180] };
  }
  // Values of a group `ms` into a transition toward `toMode` (from the other mode). ms = Infinity: settled.
  function valuesAt(id, toMode, ms, tl) {
    const s = spec(id, tl), from = toMode === 'active' ? s.d : s.a, to = toMode === 'active' ? s.a : s.d, [t0, t1] = toMode === 'active' ? s.wake : s.sleep;
    const k = ms === Infinity ? 1 : ease(Math.max(0, Math.min(1, (ms - t0) / Math.max(1, t1 - t0))));
    const o = {}; for (const key of Object.keys(to)) o[key] = lerp(from[key], to[key], k); return o;
  }
  function attrs(v) {
    const tr = [];
    if (v.dx || v.dy) tr.push(`translate(${f(v.dx)} ${f(v.dy)})`);
    const cx = v.cx == null ? 225 : v.cx, cy = v.cy == null ? 225 : v.cy;
    if (v.rot) tr.push(`rotate(${f(v.rot)} ${f(cx)} ${f(cy)})`);
    if (v.scale !== 1) tr.push(`translate(${f(cx)} ${f(cy)}) scale(${Number(v.scale.toFixed(4))}) translate(${f(-cx)} ${f(-cy)})`);
    return `opacity="${Number(v.opacity.toFixed(3))}"${tr.length ? ` transform="${tr.join(' ')}"` : ''}${v.opacity < 0.002 ? ' visibility="hidden"' : ''}`;
  }
  function parallax(id, motion, tilt) {
    if (motion !== 'full' || /-aod$/.test(id)) return [0, 0];
    const group = ['sky', 'skymarks', 'globe', 'dome'].includes(id) ? [0.07, 3]
      : ['crescent', 'instrument', 'rings', 'calendar', 'gloss', 'sun', 'trail', 'rotor', 'f2'].includes(id) ? [0.035, 1.5]
      : ['dragon', 'dragon-shadow'].includes(id) ? [-0.02, 1] : [0, 0];
    return ['x', 'y'].map(k => Math.max(-group[1], Math.min(group[1], group[0] * tilt[k])));
  }

  // ---------- render ----------
  function render(input = {}) {
    const s = normalize(input), preset = PRESETS[s.preset], u = s.uid;
    const ctx = { s, u, local: localFields(s.date), sky: A.sky(s.date, T.site), defs: '' };
    if (s.preset === 'vault5') {
      ctx.expressions = Expressions.at(s.date, { moonAge: ctx.sky.moon.age, battery: s.battery, steps: s.steps, stepGoal: s.stepGoal });
      ctx.sky.lst = ctx.expressions.lst;
      ctx.sky.lstHours = ctx.expressions.lst / 15;
    }
    const layers = preset.build(ctx).filter(l => !s.hide.includes(l.id));
    const toMode = s.frame ? s.frame.toMode : s.mode, ms = s.frame && s.motion !== 'still' && !s.reducedMotion ? s.frame.ms * 360 / s.windowMs : Infinity;
    const body = layers.map(l => {
      const [dx, dy] = parallax(l.id, s.reducedMotion ? 'still' : s.motion, s.tilt);
      return `<g data-parallax="${l.id}" transform="translate(${f(dx)} ${f(dy)})"><g id="${u}-${l.id}" data-layer="${l.id}" ${attrs(valuesAt(l.id, toMode, ms, preset.timeline))}>${l.svg}</g></g>`;
    }).join('\n');
    const font = (s.preset === 'vault5' ? OrbitFonts.css : '') + (s.fontData ? `@font-face{font-family:OrbitMono;src:url(data:font/ttf;base64,${s.fontData})}` : '');
    const guides = s.guides ? `<g fill="none" stroke="#E9A5FF" stroke-width=".8" stroke-dasharray="3 5" opacity=".7"><circle cx="225" cy="225" r="171"/><circle cx="225" cy="225" r="196"/><path d="M0 225h450M225 0v450"/></g>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 450 450" role="img" aria-label="KALIWATCH ${esc(preset.label)} ${toMode}">` +
      `<title>${esc(T.name)} / ${esc(preset.label)} / ${toMode}</title>${ctx.defs}<style>${font}svg{font-family:${T.type.family}}text{font-variant-numeric:tabular-nums}</style>` +
      `<clipPath id="${u}-dial"><circle cx="225" cy="225" r="225"/></clipPath><g clip-path="url(#${u}-dial)"><rect width="450" height="450" fill="#000"/>${body}${guides}</g></svg>`;
  }
  function layerIds(presetKey) { return PRESETS[presetKey].build({ s: normalize({ preset: presetKey }), u: 'x', local: localFields(new Date(T.sample.iso)), sky: A.sky(new Date(T.sample.iso), T.site), defs: '' }).map(l => l.id); }

  // Shared drawing parts for compositions defined in other modules (galaxia.js).
  const parts = { f, esc, pt, P, arc, ring, ticks, lerp, dragonRelief, dragonAt, dragonPath, moonGlyph, sunGlyph, digits, dateText, lstText, gauge, telemetryValues, prompt, defs, seedFlecks, MON, WD, ZOD, DRAGON_INK };
  root.VaultFace = { render, normalize, PRESETS, TIMELINE, valuesAt, attrs, parallax, layerIds, localFields, ease, arc, pt, parts };
  if (typeof module !== 'undefined') module.exports = root.VaultFace;
})(typeof globalThis !== 'undefined' ? globalThis : this);
