// KALIWATCH v5 sky-disc renderer: a polar planisphere (north celestial pole at the disc origin) drawn
// from KaliStars. The disc is drawn once at LST = 0 in its own frame and rotated as a whole by
// KaliAstro.discAngle(lst) — exactly what the WFF port does with a baked PNG + Transform angle.
// Pure string output (SVG fragments), deterministic, no DOM.
(function (root) {
  'use strict';
  const S = root.KaliStars || (typeof require !== 'undefined' && require('./stars.js'));
  const A = root.KaliAstro || (typeof require !== 'undefined' && require('./astro.js'));
  const D2R = Math.PI / 180;
  const f = n => Number(n.toFixed(2));

  const DEFAULTS = {
    projection: 'equidistant', scale: 1.633, decLimit: -30, meridianDeg: 0,
    magLimit: 4.6, sizeK: 1, alphaK: 1,
    starColor: '#C9D6D2', starBright: '#F2F5EE', warmStar: '#E9C9A0',
    lineColor: '#7E9488', lineWidth: 0.6, lineAlpha: 0.42,
    milkyWay: '#9FB2AC', milkyAlpha: 1, ecliptic: '#C9A15A', eclipticAlpha: 0.55,
    showLines: true, showMilkyWay: true, showEcliptic: true, showZodiac: true, showNames: false, showEquator: false,
    highlightCon: null, highlightColor: '#A6F46A', highlightAlpha: 0.55,
    labelColor: '#6E8279', labelSize: 6.4, zodiacColor: '#B79857',
    milkyStyle: 'soft',  // 'soft' (three faint strokes) | 'painted' (grisaille brushwork: noise-masked clouds + dust rift)
    uid: 'kv', grainCount: 420, grainAlpha: 1, fieldStars: 0, zodiacAlpha: 0.62,
    showConNames: false, conNameColor: '#C9D6D2', conNameAlpha: 0.5, conNameSize: 5.6,
    innerCalm: null      // {radius, factor}: dims stars inside this disc radius (legibility under digits)
  };
  // Cool-red giants get a faint warm tint (grisaille is still the rule, this is only a hint of colour).
  const WARM = new Set(['aOri', 'aSco', 'aBoo', 'aTau', 'bUMi', 'aUMa', 'bPeg', 'aHer', 'gCru', 'bAnd', 'aCet', 'gDra']);

  function radiusOf(dec, o) { return o.projection === 'stereographic' ? o.scale * Math.tan((90 - dec) / 2 * D2R) : o.scale * (90 - dec); }
  function discRadius(o) { return radiusOf(o.decLimit, { ...DEFAULTS, ...o }); }
  function starRadius(mag, k) { return Math.max(0.45, 2.5 * Math.pow(0.63, mag + 1.46)) * (k || 1); }
  function alphaFor(mag, o) { return Math.max(0.3, Math.min(1, 1.04 - (mag + 1.5) * 0.105)) * o.alphaK; }
  function proj(raDeg, dec, o) { return A.polar(raDeg, dec, 0, o.scale, o.meridianDeg, o.projection); }

  function eclipticPoint(lonDeg) {
    const eps = 23.4393 * D2R, lr = lonDeg * D2R;
    return { ra: Math.atan2(Math.cos(eps) * Math.sin(lr), Math.cos(lr)) / D2R, dec: Math.asin(Math.sin(eps) * Math.sin(lr)) / D2R };
  }
  function smoothClosed(pts) {
    const n = pts.length; let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
    }
    return d + 'Z';
  }

  // Seeded PRNG so baked textures are reproducible.
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // Grisaille Milky Way: the same galactic-equator band, laid as a soft glow plus white clouds masked by
  // fractal noise (painted enamel, not a stroke), with the dark Great Rift from Sagittarius to Cygnus.
  function paintedMilkyWay(d, k, o) {
    const id = o.uid + '-mw';
    const rift = S.milkyWay.filter(([ra, dec]) => ra >= 17.6 && ra <= 21.2 && dec > -32).sort((a, b) => a[0] - b[0])
      .map(([ra, dec]) => { const p = proj(ra * 15, dec, o); return `${f(p.x)} ${f(p.y)}`; });
    return `<defs><filter id="${id}-cloud" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="945" result="n"/>` +
      `<feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.4 0 0 0 -0.78" result="m"/>` +
      `<feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="b"/><feComposite in="b" in2="m" operator="in"/></filter>` +
      `<filter id="${id}-soft" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="10"/></filter>` +
      `<filter id="${id}-rift" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="17"/>` +
      `<feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1.1"/></filter></defs>` +
      `<g data-layer="milky-way" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${o.milkyAlpha}">` +
      `<path d="${d}" stroke="${o.milkyWay}" stroke-width="${f(58 * k)}" opacity="0.16" filter="url(#${id}-soft)"/>` +
      `<g filter="url(#${id}-cloud)"><path d="${d}" stroke="${o.milkyWay}" stroke-width="${f(36 * k)}" opacity="0.7"/><path d="${d}" stroke="#FFFFFF" stroke-width="${f(15 * k)}" opacity="0.85"/></g>` +
      (rift.length > 2 ? `<path d="M${rift.join('L')}" stroke="#000" stroke-width="${f(6 * k)}" opacity="0.6" filter="url(#${id}-rift)"/>` : '') + `</g>`;
  }

  function render(opts = {}) {
    const o = { ...DEFAULTS, ...opts }, R = discRadius(o);
    const byId = S.byId || Object.fromEntries(S.stars.map(s => [s.id, s]));
    const calm = (x, y) => { if (!o.innerCalm) return 1; return Math.hypot(x - (o.innerCalm.cx || 0), y - (o.innerCalm.cy || 0)) < o.innerCalm.radius ? o.innerCalm.factor : 1; };
    let out = '';

    if (o.showMilkyWay) {
      // Galactic equator, smoothed; three soft strokes = grisaille enamel laid thicker where the sky is brighter.
      const pts = S.milkyWay.map(([ra, dec]) => { const p = proj(ra * 15, Math.max(dec, o.decLimit - 25), o); return { x: p.x, y: p.y }; });
      const d = smoothClosed(pts), k = o.scale / 1.633;
      if (o.milkyStyle === 'painted') out += paintedMilkyWay(d, k, o);
      else out += `<g data-layer="milky-way" fill="none" stroke="${o.milkyWay}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.milkyAlpha}">` +
        `<path d="${d}" stroke-width="${f(44 * k)}" opacity="0.05"/><path d="${d}" stroke-width="${f(26 * k)}" opacity="0.06"/><path d="${d}" stroke-width="${f(11 * k)}" opacity="0.075"/></g>`;
      // Dust: deterministic faint grains concentrated along the band (a few hundred, rotation-invariant cost).
      const rand = rng(945), grains = [];
      for (let i = 0; i < o.grainCount; i++) {
        const j = Math.floor(rand() * S.milkyWay.length), [ra, dec] = S.milkyWay[j], [ra2, dec2] = S.milkyWay[(j + 1) % S.milkyWay.length];
        const t = rand(), raI = ra + ((((ra2 - ra) % 24) + 36) % 24 - 12) * t; // shortest signed RA step
        const spread = (rand() - 0.5) * 16 * (rand() + 0.4);
        const p = proj(((raI % 24) * 15) + spread * 0.6, dec + (dec2 - dec) * t + spread, o);
        if (p.r > R) continue;
        grains.push(`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(0.35 + rand() * 0.45)}" opacity="${f(Math.min(1, (0.10 + rand() * 0.22) * o.grainAlpha) * calm(p.x, p.y))}"/>`);
      }
      out += `<g data-layer="dust" fill="${o.starColor}">${grains.join('')}</g>`;
    }

    if (o.showEquator) {
      const r = radiusOf(0, o);
      out += `<circle r="${f(r)}" fill="none" stroke="${o.lineColor}" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.35"/>`;
    }

    if (o.showEcliptic) {
      const pts = []; for (let lon = 0; lon < 360; lon += 4) { const e = eclipticPoint(lon), p = proj(e.ra, e.dec, o); pts.push({ x: p.x, y: p.y }); }
      out += `<path data-layer="ecliptic" d="${smoothClosed(pts)}" fill="none" stroke="${o.ecliptic}" stroke-width="0.6" stroke-dasharray="2.4 2.8" opacity="${o.eclipticAlpha}"/>`;
      if (o.showZodiac) {
        let z = '';
        for (let i = 0; i < 12; i++) {
          const a = eclipticPoint(i * 30), p = proj(a.ra, a.dec, o);
          const b = eclipticPoint(i * 30 + 1), q = proj(b.ra, b.dec, o);
          const nx = -(q.y - p.y), ny = q.x - p.x, nl = Math.hypot(nx, ny) || 1;
          z += `<path d="M${f(p.x - nx / nl * 2.6)} ${f(p.y - ny / nl * 2.6)}L${f(p.x + nx / nl * 2.6)} ${f(p.y + ny / nl * 2.6)}"/>`;
          const c = eclipticPoint(i * 30 + 15), m = proj(c.ra, c.dec, o), out2 = Math.hypot(m.x, m.y) || 1;
          if (o.zodiacLabels !== false) z += `<text x="${f(m.x + m.x / out2 * 8)}" y="${f(m.y + m.y / out2 * 8 + 2.4)}" stroke="none" fill="${o.zodiacColor}" font-size="${f(6.6 * Math.min(1.2, o.scale / 1.633))}" text-anchor="middle" opacity="${o.zodiacAlpha}">${['ARI', 'TAU', 'GEM', 'CNC', 'LEO', 'VIR', 'LIB', 'SCO', 'SGR', 'CAP', 'AQR', 'PSC'][i]}</text>`;
        }
        out += `<g data-layer="zodiac" stroke="${o.ecliptic}" stroke-width="0.7" opacity="0.8" font-family="OrbitMono,'Roboto Mono',monospace" letter-spacing="0.6">${z}</g>`;
      }
    }

    if (o.showLines) {
      const plain = [], hi = [];
      for (const con of Object.keys(S.figures)) for (const line of S.figures[con]) {
        for (let i = 0; i + 1 < line.length; i++) {
          const a = byId[line[i]], b = byId[line[i + 1]]; if (!a || !b) continue;
          const pa = proj(a.ra * 15, a.dec, o), pb = proj(b.ra * 15, b.dec, o);
          if (pa.r > R + 2 || pb.r > R + 2) continue;
          (con === o.highlightCon ? hi : plain).push(`M${f(pa.x)} ${f(pa.y)}L${f(pb.x)} ${f(pb.y)}`);
        }
      }
      out += `<path data-layer="constellations" d="${plain.join('')}" fill="none" stroke="${o.lineColor}" stroke-width="${o.lineWidth}" stroke-linecap="round" opacity="${o.lineAlpha}"/>`;
      if (hi.length) out += `<path data-layer="constellation-highlight" d="${hi.join('')}" fill="none" stroke="${o.highlightColor}" stroke-width="${o.lineWidth * 1.35}" stroke-linecap="round" opacity="${o.highlightAlpha}"/>`;
    }

    if (o.fieldStars) {
      // Painted star dust (decorative, seeded, not catalogue stars): what makes an enamel sky read as dense.
      const rand = rng(7), dust = [];
      for (let i = 0; i < o.fieldStars; i++) {
        const r = R * Math.sqrt(rand()), a = rand() * 2 * Math.PI, x = r * Math.sin(a), y = -r * Math.cos(a), big = rand() < 0.08;
        dust.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(big ? 0.62 : 0.3 + rand() * 0.22)}" opacity="${f((big ? 0.7 : 0.25 + rand() * 0.35) * calm(x, y))}"/>`);
      }
      out += `<g data-layer="field-stars" fill="${o.starColor}">${dust.join('')}</g>`;
    }
    if (o.showConNames) {
      const lab = labels(o).filter(l => l.kind === 'con').map(l => `<text x="${f(l.x)}" y="${f(l.y + 9)}" text-anchor="middle">${l.text}</text>`);
      out += `<g data-layer="constellation-names" font-family="OrbitMono,'Roboto Mono',monospace" font-size="${o.conNameSize}" fill="${o.conNameColor}" letter-spacing="1" opacity="${o.conNameAlpha}">${lab.join('')}</g>`;
    }
    const dots = [], halos = [], labels = [];
    for (const s of S.stars) {
      if (s.mag > o.magLimit) continue;
      const p = proj(s.ra * 15, s.dec, o); if (p.r > R) continue;
      const r = starRadius(s.mag, o.sizeK), c = calm(p.x, p.y), warm = WARM.has(s.id);
      const fill = s.mag < 1.6 ? (warm ? o.warmStar : o.starBright) : (warm ? o.warmStar : o.starColor);
      if (s.mag < 1.6) halos.push(`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(r * 2.8)}" fill="${fill}" opacity="${f(0.11 * c)}"/>`);
      dots.push(`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(r)}" fill="${fill}" opacity="${f(alphaFor(s.mag, o) * c)}"/>`);
      if (o.showNames && s.name && s.mag < 1.3) labels.push(`<text x="${f(p.x + r + 1.6)}" y="${f(p.y - 1.4)}">${s.name.toUpperCase()}</text>`);
    }
    out += `<g data-layer="halos">${halos.join('')}</g><g data-layer="stars">${dots.join('')}</g>`;
    if (labels.length) out += `<g data-layer="star-names" font-family="OrbitMono,'Roboto Mono',monospace" font-size="${o.labelSize}" fill="${o.labelColor}" letter-spacing="0.8" opacity="0.7">${labels.join('')}</g>`;
    return { svg: out, radius: R, count: dots.length };
  }

  // Label anchors in the disc frame (LST = 0): constellation figure centroids and zodiac sign midpoints.
  // Compositions that keep names upright rotate these points themselves and draw the text in the dial frame.
  function labels(opts = {}) {
    const o = { ...DEFAULTS, ...opts }, R = discRadius(o), byId = S.byId || Object.fromEntries(S.stars.map(s => [s.id, s])), out = [];
    for (const con of Object.keys(S.figures)) {
      const members = [...new Set(S.figures[con].flat())].map(id => byId[id]).filter(Boolean);
      if (!members.length) continue;
      let sx = 0, sy = 0; for (const s of members) { const p = proj(s.ra * 15, s.dec, o); sx += p.x; sy += p.y; }
      const x = sx / members.length, y = sy / members.length; if (Math.hypot(x, y) > R - 12) continue;
      out.push({ kind: 'con', id: con, text: (S.names[con] || con).toUpperCase(), x, y });
    }
    const Z = ['ARI', 'TAU', 'GEM', 'CNC', 'LEO', 'VIR', 'LIB', 'SCO', 'SGR', 'CAP', 'AQR', 'PSC'];
    for (let i = 0; i < 12; i++) {
      const c = eclipticPoint(i * 30 + 15), m = proj(c.ra, c.dec, o), l = Math.hypot(m.x, m.y) || 1;
      out.push({ kind: 'zodiac', id: Z[i], text: Z[i], x: m.x + m.x / l * 8, y: m.y + m.y / l * 8 });
    }
    return out;
  }

  // AOD sky: only the brightest stars as small dim dots, same frame/rotation as the active disc.
  function renderAmbient(opts = {}) {
    const o = { ...DEFAULTS, ...opts }, R = discRadius(o), lim = opts.ambientMag == null ? 2.2 : opts.ambientMag;
    const dots = [];
    for (const s of S.stars) {
      if (s.mag > lim) continue;
      const p = proj(s.ra * 15, s.dec, o); if (p.r > R) continue;
      dots.push(`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(s.mag < 0.5 ? 1.25 : 0.95)}"/>`);
    }
    return { svg: `<g data-layer="ambient-stars" fill="${opts.ambientColor || '#62756C'}">${dots.join('')}</g>`, count: dots.length, radius: R };
  }

  // Disc-frame position of an RA/Dec body (sun, moon, planets); place it inside the rotating disc group.
  function bodyPosition(raDeg, decDeg, opts = {}) {
    const o = { ...DEFAULTS, ...opts }, p = proj(raDeg, decDeg, o);
    return { x: p.x, y: p.y, r: p.r, inside: p.r <= discRadius(o) };
  }

  // Horizon in the DIAL frame (it does not rotate). Returns a closed path string and key points.
  function horizonPath(latDeg, opts = {}) {
    const o = { ...DEFAULTS, ...opts }, h = A.horizon(latDeg, o.scale, o.meridianDeg, o.projection, 96);
    const pts = h.points.slice(0, -1).map(p => ({ x: p.x, y: p.y }));
    return { d: smoothClosed(pts), zenith: h.zenith, north: h.northPoint, south: h.southPoint, points: pts };
  }

  root.KaliSky = { DEFAULTS, render, renderAmbient, labels, discRadius, starRadius, bodyPosition, horizonPath, eclipticPoint, rng, radiusOf: (dec, o) => radiusOf(dec, { ...DEFAULTS, ...o }) };
  if (typeof module !== 'undefined') module.exports = root.KaliSky;
})(typeof globalThis !== 'undefined' ? globalThis : this);
