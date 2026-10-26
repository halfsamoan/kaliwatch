// KALIWATCH v5 "Galaxia" composition (reference round 2), built on the user's main reference, the JLC Master
// Hybris Artistica Calibre 945 Galaxia, translated into KALI: one accent metal (anodised phosphor), a bright
// grisaille sky and eccentric levels. Back to front, every level keeps its own time-scale:
//   bed       dark lacquer, seen in the crescent between the plates                         (static)
//   sky       the real Seoul sky, turning about the pole with local sidereal time           (sidereal day)
//   dome      fixed glass above it: painted grisaille planet, the Moon at its true phase    (lunation)
//   frame     eccentric phosphor-metal edge of the sky plate                                (depth)
//   sentinel  sunken off-centre sub-dial, its cage turns once a minute (Cosmotourbillon)    (seconds)
//   calendar  black month ring with day ticks; the gold sun-star marks today               (year)
//   flange    radial-guilloche 24 h ring, night sector, phosphor batons, hour pointer       (civil 24 h)
// The official dragon flies in front in phosphor relief; HH:MM is fixed on a smoked calm field.
(function (root) {
  'use strict';
  const req = n => (typeof require !== 'undefined' ? require(n) : null);
  const T = root.VaultTokens || req('./tokens.js'), A = root.KaliAstro || req('./astro.js'), K = root.KaliSky || req('./sky.js');
  const F = root.VaultFace || req('./face.js'), X = F.parts, C = T.color, D2R = Math.PI / 180;
  const { f, pt, P, ring, ticks, dragonRelief, moonGlyph, digits, dateText, telemetryValues, defs, MON } = X;

  const seg = (r0, r1, a, cx, cy) => `M${P(pt(r0, a, cx, cy))}L${P(pt(r1, a, cx, cy))}`;
  const hourAngle = h => (h - 12) * 15; // 24 h dial: noon at 12 o'clock, midnight at 6
  function sector(r0, r1, a0, a1) { // annular sector, clockwise from a0 to a1
    const sw = ((a1 - a0) % 360 + 360) % 360, e = a0 + sw, lg = sw > 180 ? 1 : 0;
    return `M${P(pt(r1, a0))}A${r1} ${r1} 0 ${lg} 1 ${P(pt(r1, e))}L${P(pt(r0, e))}A${r0} ${r0} 0 ${lg} 0 ${P(pt(r0, a0))}Z`;
  }
  // Text laid along a ring, kept upright in the lower half (the way enamel transfers are set).
  function ringText(txt, r, a, extra = '') {
    const [x, y] = pt(r, a), n = ((a % 360) + 360) % 360, rot = n > 90 && n < 270 ? n - 180 : n;
    return `<text x="${f(x)}" y="${f(y)}" dy="0.36em" text-anchor="middle" transform="rotate(${f(rot)} ${f(x)} ${f(y)})"${extra}>${txt}</text>`;
  }
  function star8(cx, cy, r1, r2, r3) { // 4 long rays, 4 short rays, waist r3
    let d = ''; for (let i = 0; i < 16; i++) d += (i ? 'L' : 'M') + P(pt(i % 4 === 0 ? r1 : i % 2 === 0 ? r2 : r3, i * 22.5, cx, cy)); return d + 'Z';
  }
  function yearFrame(local) {
    const start = Date.UTC(local.y, 0, 1), days = (Date.UTC(local.y + 1, 0, 1) - start) / 864e5;
    const doy = (Date.UTC(local.y, local.mon, local.day) - start) / 864e5 + (local.h + local.m / 60) / 24;
    return { start, days, angle: doy / days * 360 };
  }

  // Geometry. `mirror` swaps the asymmetric objects left/right (the dragon itself is never flipped).
  function layout(mirror) {
    const at = (a, d) => pt(d, mirror ? 360 - a : a);
    return {
      S: mirror ? [221, 231] : [229, 231], RS: 168, cal: [180, 201], fl: [201.6, 225],
      planet: { c: at(52, 152), r: 50 }, moon: { c: at(118, 140), r: 21 }, sen: { c: at(240, 145), r: 32 }
    };
  }
  const SKY_STYLE = {
    projection: 'equidistant', scale: 1.4, meridianDeg: 0, decLimit: -32, magLimit: 5.2, sizeK: 1.12, alphaK: 1.2,
    starColor: '#E2EAE6', starBright: '#FFFFFF', warmStar: '#F0DDC0', lineColor: '#C9D6D2', lineWidth: 0.55, lineAlpha: 0.5,
    milkyWay: '#D8E2DE', milkyStyle: 'painted', uid: 'gsky', grainCount: 1600, grainAlpha: 1.9, fieldStars: 900,
    ecliptic: '#C9D6D2', eclipticAlpha: 0.34, zodiacLabels: false, showConNames: false, highlightColor: C.phosphor, highlightAlpha: 0.7
  };
  const SKY_CACHE = {};
  // Names stay upright: anchors turn with the sky, the text is set in the dial frame (the WFF port uses
  // PartText with x/y expressions). Names under the time are quietened, like the stars under the calm field.
  let LABELS = null;
  function skyLabels(cfg, disc) {
    LABELS = LABELS || K.labels(cfg.sky);
    const [sx, sy] = cfg.G.S, th = disc * D2R, cs = Math.cos(th), sn = Math.sin(th);
    let con = '', zod = '';
    for (const l of LABELS) {
      const x = sx + l.x * cs - l.y * sn, y = sy + l.x * sn + l.y * cs + (l.kind === 'con' ? 9 : 2);
      const e = ((x - 225) / 176) ** 2 + ((y - 234) / 94) ** 2, k = e < 0.55 ? 0.25 : e < 1 ? 0.6 : 1;
      const t = `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" opacity="${f(k)}">${l.text}</text>`;
      if (l.kind === 'con') con += t; else zod += t;
    }
    return `<g font-size="5.4" fill="#DCE5E1" letter-spacing="1" opacity="0.6">${con}</g><g font-size="5.8" fill="${C.grisaille}" letter-spacing="0.8" opacity="0.5">${zod}</g>`;
  }
  function skySvg(ctx, cfg, variant) {
    const key = variant + (ctx.s.highlightDraco ? ':dra' : '');
    if (!SKY_CACHE[key]) SKY_CACHE[key] = variant === 'aod' ? K.renderAmbient({ ...cfg.sky, ambientColor: C.aodStar }).svg
      : K.render({ ...cfg.sky, highlightCon: ctx.s.highlightDraco ? 'Dra' : null }).svg;
    return SKY_CACHE[key];
  }

  // Anodised phosphor: the single structural metal (frame, sentinel bezel, cage, batons, hour pointer).
  // Mostly shade with two narrow specular bands, so it reads as polished metal rather than a lit tube.
  const PM = '<stop offset="0" stop-color="#DFFFC0"/><stop offset=".12" stop-color="#8FD45A"/><stop offset=".34" stop-color="#3C6428"/><stop offset=".55" stop-color="#1F3516"/><stop offset=".74" stop-color="#5E9A3C"/><stop offset=".84" stop-color="#9EE06A"/><stop offset="1" stop-color="#2A4520"/>';
  function galaxiaDefs(u, G) {
    const [sx, sy] = G.S, R = G.RS;
    return `<clipPath id="${u}-skyclip"><circle cx="${sx}" cy="${sy}" r="${R}"/></clipPath>
<filter id="${u}-blur1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.9"/></filter>
<filter id="${u}-paint" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.2" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="0.8"/></filter>
<radialGradient id="${u}-enamel" cx="${sx}" cy="${sy}" r="${R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0C1716"/><stop offset=".7" stop-color="#070E0E"/><stop offset="1" stop-color="#030707"/></radialGradient>
<radialGradient id="${u}-vignette" cx="${sx}" cy="${sy}" r="${R}" gradientUnits="userSpaceOnUse"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset=".93" stop-color="#000" stop-opacity=".36"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>
<radialGradient id="${u}-glaze" cx="${sx - 62}" cy="${sy - 74}" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#E8F0EC" stop-opacity=".075"/><stop offset="1" stop-color="#E8F0EC" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-calm"><stop offset="0" stop-color="#000" stop-opacity=".8"/><stop offset=".55" stop-color="#000" stop-opacity=".62"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-pmetal" gradientUnits="userSpaceOnUse" x1="${sx - R}" y1="${sy - R}" x2="${sx + R}" y2="${sy + R}">${PM}</linearGradient>
<linearGradient id="${u}-pmetal-bb" x1="0" y1="0" x2="1" y2="1">${PM}</linearGradient>
<radialGradient id="${u}-jewel" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#F0FFE0"/><stop offset=".45" stop-color="${C.phosphor}"/><stop offset="1" stop-color="#2A5218"/></radialGradient>
<linearGradient id="${u}-sen-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".07"/><stop offset=".5" stop-color="#FFF" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
<radialGradient id="${u}-planet" cx=".36" cy=".32" r=".78"><stop offset="0" stop-color="#F4F7F2"/><stop offset=".28" stop-color="#C6D0CC"/><stop offset=".58" stop-color="#7A8884"/><stop offset=".84" stop-color="#2C3633"/><stop offset="1" stop-color="#0B100F"/></radialGradient>
<linearGradient id="${u}-shade" x1=".15" y1=".1" x2=".9" y2=".95"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".45" stop-color="#000" stop-opacity=".08"/><stop offset=".72" stop-color="#000" stop-opacity=".62"/><stop offset="1" stop-color="#000" stop-opacity=".95"/></linearGradient>
<radialGradient id="${u}-moon" cx=".42" cy=".4" r=".65"><stop offset="0" stop-color="#F7FAF8"/><stop offset=".6" stop-color="#C3CDC9"/><stop offset="1" stop-color="#7E8A86"/></radialGradient>
<radialGradient id="${u}-moonlimb"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
<radialGradient id="${u}-earthshine"><stop offset="0" stop-color="${C.grisaille}" stop-opacity=".07"/><stop offset="1" stop-color="${C.grisaille}" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-flange-sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="450" y2="450"><stop offset="0" stop-color="#FFF" stop-opacity=".16"/><stop offset=".35" stop-color="#FFF" stop-opacity=".04"/><stop offset=".62" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>`;
  }

  // Painted grisaille gas giant: lit from 10:30 like every bake, banded, cut by the frame edge.
  const BANDS = [[-0.8, 0.12, 1, 0.08], [-0.56, 0.12, 0, 0.15], [-0.33, 0.09, 1, 0.13], [-0.12, 0.17, 0, 0.19], [0.1, 0.1, 1, 0.16], [0.3, 0.14, 0, 0.15], [0.52, 0.09, 1, 0.1], [0.72, 0.13, 0, 0.13]];
  function planet(u, [cx, cy], r) {
    const bands = BANDS.map(([yc, h, light, o]) => `<rect x="${f(-r * 1.3)}" y="${f((yc - h / 2) * r)}" width="${f(r * 2.6)}" height="${f(h * r)}" fill="${light ? '#F2F6F3' : '#05090A'}" opacity="${o}"/>`).join('');
    return `<g transform="translate(${f(cx)} ${f(cy)})"><clipPath id="${u}-pl"><circle r="${r}"/></clipPath>` +
      `<circle r="${f(r + 2.5)}" fill="none" stroke="${C.grisaille}" stroke-width="5" opacity="0.08" filter="url(#${u}-blur2)"/>` +
      `<g clip-path="url(#${u}-pl)"><circle r="${r}" fill="url(#${u}-planet)"/><g transform="rotate(-18)" filter="url(#${u}-paint)">${bands}` +
      `<ellipse cx="${f(r * 0.3)}" cy="${f(r * 0.3)}" rx="${f(r * 0.17)}" ry="${f(r * 0.085)}" fill="#05090A" opacity="0.32"/>` +
      `<ellipse cx="${f(r * 0.3 - 0.6)}" cy="${f(r * 0.3 - 0.6)}" rx="${f(r * 0.17)}" ry="${f(r * 0.085)}" fill="none" stroke="#F2F6F3" stroke-width="0.7" opacity="0.3"/></g>` +
      `<circle r="${r}" fill="url(#${u}-shade)"/></g>` +
      `<path d="${X.arc(r - 0.8, 255, 385, 0, 0)}" fill="none" stroke="#F4F8F5" stroke-width="1" stroke-linecap="round" opacity="0.5"/></g>`;
  }
  // The Moon at its real phase: lit limb to the right while waxing (as seen from Seoul), maria, craters.
  function moonSphere(u, [cx, cy], r, moon) {
    const E = moon.elongation > 180 ? 360 - moon.elongation : moon.elongation, rx = Math.abs(Math.cos(E * D2R)) * r;
    const lit = `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${f(rx)} ${r} 0 0 ${E > 90 ? 1 : 0} 0 ${-r}Z`, rot = moon.waxing ? 0 : 180;
    const rand = K.rng(29); let craters = '';
    for (let i = 0; i < 16; i++) {
      const a = rand() * 2 * Math.PI, d = r * 0.88 * Math.sqrt(rand()), x = d * Math.sin(a), y = -d * Math.cos(a), cr = r * (0.04 + rand() * 0.11);
      craters += `<circle cx="${f(x - 0.5)}" cy="${f(y - 0.5)}" r="${f(cr)}" fill="#F8FBF9" opacity="0.18"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(cr)}" fill="#3A4542" opacity="0.22"/>`;
    }
    const maria = [[-0.28, -0.22, 0.3, 0.2], [0.18, -0.34, 0.22, 0.15], [0.05, 0.12, 0.26, 0.18], [-0.32, 0.3, 0.18, 0.12]]
      .map(([x, y, a, b]) => `<ellipse cx="${f(x * r)}" cy="${f(y * r)}" rx="${f(a * r)}" ry="${f(b * r)}" fill="#2A3432" opacity="0.22"/>`).join('');
    return `<g transform="translate(${f(cx)} ${f(cy)})"><clipPath id="${u}-ml"><path d="${lit}" transform="rotate(${rot})"/></clipPath>` +
      `<circle r="${r + 2}" fill="none" stroke="${C.grisaille}" stroke-width="3" opacity="0.05" filter="url(#${u}-blur2)"/>` +
      `<circle r="${r}" fill="#0B1110"/><circle r="${r}" fill="url(#${u}-earthshine)"/>` +
      `<g clip-path="url(#${u}-ml)"><circle r="${r}" fill="url(#${u}-moon)"/><g filter="url(#${u}-paint)">${maria}</g>${craters}<circle r="${r}" fill="url(#${u}-moonlimb)"/></g>` +
      `<circle r="${f(r - 0.3)}" fill="none" stroke="${C.grisaille}" stroke-width="0.6" opacity="0.16"/></g>`;
  }
  // Sentinel: a recess through the sky plate. Phosphor bezel, black sunray floor, seconds track.
  function sentinel(u, [x, y], r) {
    const fl = r - 4; let rays = '';
    for (let i = 0; i < 144; i++) rays += seg(3, fl, i * 2.5, x, y);
    return `<clipPath id="${u}-senfloor"><circle cx="${f(x)}" cy="${f(y)}" r="${fl}"/></clipPath>` +
      `<circle cx="${f(x + 1.4)}" cy="${f(y + 2.2)}" r="${f(r + 1)}" fill="#000" opacity="0.7" filter="url(#${u}-blur2)"/>` +
      `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${u}-pmetal-bb)"/>` +
      `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r - 0.6)}" fill="none" stroke="#F2FFE4" stroke-width="0.5" opacity="0.3"/>` +
      `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r - 1.9)}" fill="none" stroke="#000" stroke-width="0.8" opacity="0.6"/>` +
      `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r - 3.2)}" fill="#0A0F0D"/><circle cx="${f(x)}" cy="${f(y)}" r="${fl}" fill="#060908"/>` +
      `<path d="${rays}" stroke="#25302C" stroke-width="0.7"/><circle cx="${f(x)}" cy="${f(y)}" r="${fl}" fill="url(#${u}-sen-sheen)"/>` +
      `<path d="${ticks(60, fl - 4.6, fl - 1.8, { cx: x, cy: y, skip: i => i % 5 === 0 })}" stroke="${C.grisaille}" stroke-width="0.45" opacity="0.55"/>` +
      `<path d="${ticks(12, fl - 6, fl - 1.4, { cx: x, cy: y })}" stroke="${C.paper}" stroke-width="0.9" opacity="0.85"/>` +
      `<g clip-path="url(#${u}-senfloor)"><circle cx="${f(x + 1.6)}" cy="${f(y + 2.2)}" r="${f(fl + 2.2)}" fill="none" stroke="#000" stroke-width="4" opacity="0.75" filter="url(#${u}-blur2)"/></g>`;
  }
  // The cage: three tapered phosphor arms, balance ring and jewel, with a radar sweep trailing the lead arm.
  function cage(u, [x, y], r, secA) {
    const armR = r - 12, arm = `M-1.7 -3.2L-0.6 ${-armR}L0.6 ${-armR}L1.7 -3.2Z`;
    const arms = [0, 120, 240].map(a => `<path d="${arm}" transform="rotate(${a})"/>`).join('');
    let sweep = '';
    for (let i = 0; i < 18; i++) { const a0 = -64 + i * 3.6, a1 = a0 + 3.8; sweep += `<path d="M0 0L${P(pt(r - 7, a0, 0, 0))}A${r - 7} ${r - 7} 0 0 1 ${P(pt(r - 7, a1, 0, 0))}Z" opacity="${f(0.008 + i * 0.01)}"/>`; }
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(secA)})"><g fill="${C.phosphor}">${sweep}</g>` +
      `<g fill="#000" opacity="0.55" transform="translate(1.1 1.6)" filter="url(#${u}-blur1)">${arms}<circle r="12" fill="none" stroke="#000" stroke-width="1.6"/></g>` +
      `<g fill="url(#${u}-pmetal-bb)">${arms}</g><circle r="12" fill="none" stroke="url(#${u}-pmetal-bb)" stroke-width="1.5"/>` +
      `<circle r="7.2" fill="none" stroke="${C.grisaille}" stroke-width="0.5" opacity="0.6"/>` +
      `<path d="M0 -12V${-(r - 7.5)}" stroke="${C.phosphorLight}" stroke-width="0.9" stroke-linecap="round"/>` +
      `<circle r="2.8" fill="url(#${u}-jewel)"/><circle cx="-0.8" cy="-0.9" r="0.8" fill="#FFF" opacity="0.85"/></g>`;
  }

  function build(ctx) {
    const u = ctx.u, cfg = this, G = cfg.G, sky = ctx.sky, local = ctx.local, tv = telemetryValues(ctx), L = [];
    const [sx, sy] = G.S, R = G.RS, disc = A.discAngle(sky.lst);
    ctx.defs = defs(u, galaxiaDefs(u, G));
    const yf = yearFrame(local), rs = A.riseSet(ctx.s.date, T.site, T.site.utcOffsetMin);
    const body = (ra, dec) => { const p = A.polar(ra, dec, sky.lst, cfg.sky.scale, cfg.sky.meridianDeg, cfg.sky.projection); return { x: sx + p.x, y: sy + p.y, r: p.r }; };

    // bed: lacquer with aventurine, visible only in the crescent between the eccentric plate and the rings.
    L.push({ id: 'bed', svg: `<circle cx="225" cy="225" r="${G.cal[0] + 1}" fill="#050807"/>${X.seedFlecks(u, 150, 181, 520, 945, C.grisaille)}` });
    // sky: the real sky (rotates with LST about the pole), the Sun on the ecliptic, the calm field under the digits.
    const sunB = body(sky.sun.ra, sky.sun.dec);
    L.push({ id: 'sky', svg: `<g clip-path="url(#${u}-skyclip)"><circle cx="${sx}" cy="${sy}" r="${R}" fill="url(#${u}-enamel)"/>` +
      `<g transform="translate(${sx} ${sy}) rotate(${f(disc)})">${skySvg(ctx, cfg, 'active')}</g>${skyLabels(cfg, disc)}` +
      (sunB.r < R - 3 ? X.sunGlyph(u, sunB.x, sunB.y, 2.6, true) : '') +
      `<ellipse cx="225" cy="234" rx="176" ry="94" fill="url(#${u}-calm)"/></g>` });
    L.push({ id: 'sky-aod', svg: `<g clip-path="url(#${u}-skyclip)"><g transform="translate(${sx} ${sy}) rotate(${f(disc)})">${skySvg(ctx, cfg, 'aod')}</g></g>` });
    // dome: fixed painted glass above the turning sky.
    L.push({ id: 'dome', svg: `<g clip-path="url(#${u}-skyclip)"><circle cx="${sx}" cy="${sy}" r="${R}" fill="url(#${u}-glaze)"/>` +
      planet(u, G.planet.c, G.planet.r) + moonSphere(u, G.moon.c, G.moon.r, sky.moon) + `<circle cx="${sx}" cy="${sy}" r="${R}" fill="url(#${u}-vignette)"/></g>` });
    const [px, py] = G.planet.c, [mx, my] = G.moon.c;
    L.push({ id: 'dome-aod', svg: `<g clip-path="url(#${u}-skyclip)"><path d="${X.arc(G.planet.r - 0.8, 255, 385, px, py)}" fill="none" stroke="#2C3A31" stroke-width="1"/>` +
      moonGlyph(mx, my, G.moon.r, sky.moon, sky.moon.waxing ? 90 : 270, '#2E3833', '#000', null) + `</g>` });
    // frame: the eccentric metal edge; casts onto the lacquer outside, occludes the sky inside.
    L.push({ id: 'frame', svg: `<circle cx="${f(sx + 1)}" cy="${f(sy + 1.6)}" r="${R + 1.6}" fill="none" stroke="#000" stroke-width="3.2" opacity="0.7" filter="url(#${u}-blur2)"/>` +
      `<g clip-path="url(#${u}-skyclip)"><circle cx="${sx}" cy="${sy}" r="${R - 1.2}" fill="none" stroke="#000" stroke-width="4.5" opacity="0.65" filter="url(#${u}-blur2)"/></g>` +
      `<circle cx="${sx}" cy="${sy}" r="${R}" fill="none" stroke="url(#${u}-pmetal)" stroke-width="2.6"/>` +
      `<circle cx="${sx}" cy="${sy}" r="${f(R - 1)}" fill="none" stroke="#F2FFE6" stroke-width="0.4" opacity="0.35"/>` +
      `<circle cx="${sx}" cy="${sy}" r="${f(R + 1.4)}" fill="none" stroke="#071006" stroke-width="0.6"/>` });
    L.push({ id: 'frame-aod', svg: `<circle cx="${sx}" cy="${sy}" r="${R}" fill="none" stroke="#2F4A2A" stroke-width="1"/>` });
    // sentinel + cage (seconds).
    const [ex, ey] = G.sen.c, secA = local.s * 6;
    L.push({ id: 'sentinel', svg: sentinel(u, G.sen.c, G.sen.r) });
    L.push({ id: 'cage', svg: cage(u, G.sen.c, G.sen.r, secA) });
    L.push({ id: 'sentinel-aod', svg: `<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(G.sen.r - 1.5)}" fill="none" stroke="#3E5236" stroke-width="1"/><circle cx="${f(ex)}" cy="${f(ey)}" r="1.6" fill="#3E5236"/>` });
    // calendar ring (year): day ticks, 10th/20th long, month names; casts a shadow inward.
    const [c0, c1] = G.cal; let dT = '', tT = '', mT = '';
    for (let d = 0; d < yf.days; d++) {
      const dom = new Date(yf.start + d * 864e5).getUTCDate(), a = d / yf.days * 360;
      if (dom === 1) mT += seg(c0 + 0.6, c1 - 0.4, a); else if (dom % 10 === 0) tT += seg(c1 - 5.8, c1 - 0.4, a); else dT += seg(c1 - 3, c1 - 0.4, a);
    }
    const months = MON.map((m, i) => { const d0 = (Date.UTC(local.y, i, 1) - yf.start) / 864e5, d1 = (Date.UTC(local.y, i + 1, 1) - yf.start) / 864e5; return ringText(m, 189.2, (d0 + d1) / 2 / yf.days * 360); }).join('');
    L.push({ id: 'calendar', svg: `<circle cx="225" cy="225" r="${c0 - 1.2}" fill="none" stroke="#000" stroke-width="5" opacity="0.8" filter="url(#${u}-blur2)"/>` +
      `<path d="${ring(c0, c1)}" fill="#020404" fill-rule="evenodd"/>` +
      `<path d="${dT}" stroke="${C.grisaille}" stroke-width="0.45" opacity="0.42"/><path d="${tT}" stroke="${C.paper}" stroke-width="0.6" opacity="0.85"/><path d="${mT}" stroke="${C.grisaille}" stroke-width="0.6" opacity="0.5"/>` +
      `<circle cx="225" cy="225" r="${c0 + 0.5}" fill="none" stroke="${C.grisaille}" stroke-width="0.6" opacity="0.6"/><circle cx="225" cy="225" r="${c1 - 0.4}" fill="none" stroke="${C.grisaille}" stroke-width="0.6" opacity="0.6"/>` +
      `<g font-size="7.4" font-weight="500" letter-spacing="1.6" fill="${C.paper}" opacity="0.92">${months}</g>` });
    L.push({ id: 'calendar-aod', svg: `<circle cx="225" cy="225" r="${c0 + 0.5}" fill="none" stroke="#1C2620" stroke-width="0.8"/><circle cx="225" cy="225" r="${c1 - 0.4}" fill="none" stroke="#1C2620" stroke-width="0.8"/>` });
    // 24 h flange: radial guilloche, the real night sector for Seoul today, phosphor batons, white even hours.
    const [f0, f1] = G.fl; let ga = '', gb = '', bat = '';
    for (let i = 0; i < 720; i++) { const s = seg(f0 + 0.8, f1, i * 0.5); if (i % 2) gb += s; else ga += s; }
    for (let h = 1; h < 24; h += 2) bat += seg(207, 219.6, hourAngle(h));
    const night = rs.rise != null && rs.set != null ? `<path d="${sector(f0, f1, hourAngle(rs.set), hourAngle(rs.rise))}" fill="#000" opacity="0.4"/>` : '';
    const nums = Array.from({ length: 12 }, (_, i) => ringText(String(i * 2).padStart(2, '0'), 213.6, hourAngle(i * 2))).join('');
    const sunTicks = [rs.rise, rs.set].filter(v => v != null).map(h => seg(f0 + 0.6, f0 + 5.5, hourAngle(h))).join('');
    L.push({ id: 'flange', svg: `<path d="${ring(f0, f1)}" fill="#1B2220" fill-rule="evenodd"/>` +
      `<path d="${ga}" stroke="#36403C" stroke-width="0.6"/><path d="${gb}" stroke="#101513" stroke-width="0.6"/>${night}` +
      `<path d="${ring(f0, f1)}" fill="url(#${u}-flange-sheen)" fill-rule="evenodd"/>` +
      `<path d="${bat}" stroke="#000" stroke-width="2.8" opacity="0.7" transform="translate(0.6 0.9)" filter="url(#${u}-blur1)"/>` +
      `<path d="${bat}" stroke="${C.phosphor}" stroke-width="2.4"/><path d="${bat}" stroke="${C.phosphorLight}" stroke-width="0.8" transform="translate(-0.55 -0.55)"/><path d="${bat}" stroke="${C.phosphorShade}" stroke-width="0.8" transform="translate(0.6 0.6)"/>` +
      `<g font-size="10" font-weight="600" fill="${C.paper}" letter-spacing="0.6">${nums}</g>` +
      (sunTicks ? `<path d="${sunTicks}" stroke="${C.gold}" stroke-width="0.9" opacity="0.9"/>` : '') +
      `<circle cx="225" cy="225" r="${f0 + 0.4}" fill="none" stroke="url(#${u}-rim)" stroke-width="1.2"/><circle cx="225" cy="225" r="${f1 - 0.5}" fill="none" stroke="#000" stroke-width="1"/>` });
    L.push({ id: 'flange-aod', svg: `<g font-size="10" font-weight="600" fill="#45554B" letter-spacing="0.6">${nums}</g>` });
    // sun-star (today on the calendar) and the hour pointer (civil time on the 24 h ring).
    const [stx, sty] = pt(c0 + 0.5, yf.angle), star = star8(stx, sty, 6.6, 3.4, 1.6);
    L.push({ id: 'sunstar', svg: `<path d="${seg(c0 + 6, c1 - 0.4, yf.angle)}" stroke="${C.gold}" stroke-width="0.8"/><circle cx="${f(stx)}" cy="${f(sty)}" r="10" fill="url(#${u}-sun-glow)"/>` +
      `<path d="${star}" fill="#000" opacity="0.6" transform="translate(0.7 1)" filter="url(#${u}-blur1)"/><path d="${star}" fill="url(#${u}-sun-body)" stroke="${C.goldDeep}" stroke-width="0.4"/>` });
    L.push({ id: 'sunstar-aod', svg: `<path d="${star}" fill="none" stroke="${C.aodGold}" stroke-width="0.8"/>` });
    const hA = hourAngle(local.h + local.m / 60 + local.s / 3600), tri = `M${P(pt(211, hA))}L${P(pt(202.2, hA - 2.2))}L${P(pt(202.2, hA + 2.2))}Z`;
    L.push({ id: 'hour', svg: `<path d="${tri}" fill="#000" opacity="0.6" transform="translate(0.7 1)" filter="url(#${u}-blur1)"/><path d="${tri}" fill="url(#${u}-pmetal-bb)" stroke="${C.phosphorLight}" stroke-width="0.4"/>` });
    L.push({ id: 'hour-aod', svg: `<path d="${tri}" fill="none" stroke="#3E5236" stroke-width="0.9"/>` });
    // dragon relief, then the text plane.
    const dg = dragonRelief(u, cfg.dragon.x, cfg.dragon.y, cfg.dragon.s);
    L.push({ id: 'dragon-shadow', svg: dg.shadow }, { id: 'dragon', svg: dg.body }, { id: 'dragon-aod', svg: dg.aod });
    L.push({ id: 'date', svg: `<text x="225" y="180" font-size="${T.type.date}" text-anchor="middle" fill="${C.quiet}" letter-spacing="1">${dateText(ctx)}</text>` });
    L.push({ id: 'date-aod', svg: `<text x="225" y="180" font-size="${T.type.date}" text-anchor="middle" fill="${C.aodQuiet}" letter-spacing="1">${dateText(ctx)}</text>` });
    L.push({ id: 'digits-shadow', svg: digits(ctx, cfg.digits, 'shadow') }, { id: 'digits', svg: digits(ctx, cfg.digits, 'active') }, { id: 'digits-aod', svg: digits(ctx, cfg.digits, 'aod') });
    L.push({ id: 'telemetry', svg: `<text x="225" y="284" font-size="11.5" text-anchor="middle" letter-spacing="1.2"><tspan fill="${C.muted}">BAT</tspan><tspan dx="6" fill="${tv.low ? C.warning : C.paper}">${tv.bat}</tspan>` +
      `<tspan dx="16" fill="${C.muted}">STP</tspan><tspan dx="6" fill="${C.paper}">${tv.steps}</tspan></text>` + X.prompt(225, 306, 11.5, cfg.host) });
    L.push({ id: 'telemetry-aod', svg: `<text x="225" y="284" font-size="11.5" text-anchor="middle" fill="${C.aodQuiet}" letter-spacing="1.2">BAT ${tv.bat}</text>` +
      `<text x="225" y="306" font-size="10.5" letter-spacing="2.4" text-anchor="middle" fill="${C.aodQuiet}">INFINITY</text>` });
    return L;
  }

  // Wake lights the stack back to front (lacquer, sky, dome, plate, sentinel, rings, pointers, dragon, text).
  function timeline(G) {
    return {
      'bed': { wake: [0, 160], sleep: [60, 180] },
      'sky': { a: { rot: 0 }, d: { rot: -4 }, c: G.S, wake: [0, 240], sleep: [60, 180] },
      'sky-aod': { wake: [0, 120], sleep: [80, 180] },
      'dome': { a: { scale: 1 }, d: { scale: 0.985 }, c: G.S, wake: [40, 260], sleep: [40, 180] },
      'dome-aod': { wake: [0, 140], sleep: [80, 180] },
      'frame': { wake: [60, 240], sleep: [40, 160] },
      'frame-aod': { wake: [0, 160], sleep: [60, 180] },
      'sentinel': { wake: [80, 260], sleep: [20, 160] },
      'cage': { a: { rot: 0 }, d: { rot: -150 }, c: G.sen.c, wake: [100, 360], sleep: [0, 120] },
      'sentinel-aod': { wake: [0, 160], sleep: [80, 180] },
      'calendar': { a: { rot: 0 }, d: { rot: -8 }, wake: [40, 320], sleep: [20, 170] },
      'calendar-aod': { wake: [0, 160], sleep: [60, 180] },
      'flange': { a: { scale: 1 }, d: { scale: 0.994 }, wake: [100, 300], sleep: [20, 160] },
      'flange-aod': { wake: [60, 220], sleep: [60, 180] },
      'sunstar': { wake: [240, 360], sleep: [0, 100] },
      'sunstar-aod': { wake: [100, 240], sleep: [60, 180] },
      'hour': { wake: [220, 360], sleep: [0, 100] },
      'hour-aod': { wake: [100, 240], sleep: [60, 180] }
    };
  }
  function preset(label, note, mirror) {
    const G = layout(mirror);
    return { label, note, host: 'vault', G, dragon: { x: 147, y: 38, s: 1.25 }, digits: { hx: 166, cx: 225, mx: 284, base: 252 },
      sky: { ...SKY_STYLE, center: G.S }, timeline: timeline(G), build };
  }
  F.PRESETS.galaxia = preset('G1 Galaxia', 'Eccentric sky plate, grisaille planet behind the dragon, sentinel at 8, moon at 4, month ring and 24 h guilloche', false);
  F.PRESETS['galaxia-mirror'] = preset('G2 Galaxia mirrored', "The photo's arrangement: planet at 10 under the wings, sentinel at 4, moon at 8", true);
  root.VaultGalaxia = { layout, SKY_STYLE, yearFrame, hourAngle };
  if (typeof module !== 'undefined') module.exports = root.VaultGalaxia;
})(typeof globalThis !== 'undefined' ? globalThis : this);
