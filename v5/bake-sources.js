// Pure SVG bake sources reuse the G3 source renderer; no independent redraws.
(function (root) {
  'use strict';
  const req = name => typeof require !== 'undefined' ? require(name) : null;
  const ratio = 480 / 450, U = 'bake';
  const asset = (id, x, y, width, height, extra = {}) => ({
    id, resource: id, x, y, width, height, designWidth: width, designHeight: height, frame: 'screen', file: `assets/${id}.png`,
    deviceWidth: Math.round(width * ratio), deviceHeight: Math.round(height * ratio), rgba: true, ...extra
  });
  const assets = [
    asset('sky_active', -293, -293, 586, 586, { frame: 'P', deviceWidth: 625, deviceHeight: 625 }),
    asset('dome_light', 43, 43, 364, 364, { deviceWidth: 388, deviceHeight: 388 }),
    asset('crescent', 60, 43, 330, 108, { deviceWidth: 352, deviceHeight: 115 }),
    asset('flange_f2', -3, -3, 456, 456, { deviceWidth: 487, deviceHeight: 487 }),
    asset('plate', 108, 161, 234, 106), asset('plate_shadow', 106, 157, 242, 116),
    asset('subdisc', 87, 271, 124, 124, { deviceWidth: 132, deviceHeight: 132 }),
    asset('dragon_relief', 130, 15, 190, 140), asset('dragon_shadow', 128, 15, 200, 150),
    asset('dragon_mask', 140, 22, 168, 124),
    ...Array.from({ length: 9 }, (_, k) => asset(`luna_${k}`, 338, 154, 104, 104, { deviceWidth: 111, deviceHeight: 111 })),
    asset('cage_body', -16, -16, 32, 32, { frame: 'rotor' }),
    asset('cage_shadow', -13, -13, 32, 32, { frame: 'rotor' }),
    asset('jupiter', -10, -10, 20, 20, { frame: 'planet' }),
    asset('saturn', -16, -10, 32, 20, { frame: 'planet' }),
    asset('sun_star', -6, -6, 12, 12, { frame: 'sun' }),
    asset('infinity_aod', 240, 408, 90, 40),
    ...Array.from({ length: 10 }, (_, n) => asset(`kwo_${n}`, 0, 0, 47, 86, {
      frame: 'glyph', deviceWidth: 50, deviceHeight: 92,
      advance: 44.47966507177034, designWidth: 47, designHeight: 86, baseline: 73.3,
      inkShiftY: -1.1949760765550237, fontSize: 66.38755980861244
    })),
    asset('f1_calendar', 0, 0, 450, 450),
    asset('rings', 0, 0, 450, 450), asset('f1_gloss', 0, 0, 450, 450),
    asset('plate_mask_aod', 108, 161, 234, 106),
    asset('instrument', 54, 96, 340, 312), // round 6 horizon scale, site labels and telemetry register; the telemetry text stays live
    asset('preview', 0, 0, 450, 450) // watch_face_info preview: the whole studio face, Active, M1
  ];
  const byId = Object.fromEntries(assets.map(a => [a.id, a]));
  let cache;
  function source() {
    if (cache) return cache;
    const V = root.VaultV5 || req('./vault5.js'), F = root.VaultFace || req('./face.js');
    const A = root.KaliAstro || req('./astro.js'), T = root.VaultTokens || req('./tokens.js');
    const Fonts = root.OrbitFonts || req('./orbit-fonts.js');
    const s = F.normalize({ preset: 'vault5', date: V.MOMENTS.M1, mode: 'active', uid: U });
    const ctx = { s, u: U, local: F.localFields(s.date), sky: A.sky(s.date, T.site), defs: '' };
    const layers = V.source.build(ctx);
    cache = { V, F, Fonts, ctx, layers: Object.fromEntries(layers.map(l => [l.id, l.svg])) };
    return cache;
  }
  function group(svg, attribute, value) {
    const start = svg.indexOf(`<g ${attribute}="${value}"`);
    if (start < 0) throw new Error(`Missing bake source group ${attribute}=${value}`);
    let depth = 0;
    const tags = /<g\b[^>]*>|<\/g>/g; tags.lastIndex = start;
    for (let token; (token = tags.exec(svg));) {
      depth += token[0].startsWith('</') ? -1 : 1;
      if (!depth) return svg.slice(start, tags.lastIndex);
    }
    throw new Error(`Unclosed bake source group ${value}`);
  }
  const stripCursor = svg => svg.replace(/<rect\b[^>]*data-cursor="block"[^>]*\/>/g, '');
  function markup(id) {
    const { V, F, Fonts, layers } = source(), S = V.source;
    if (id === 'sky_active') return S.sky(U);
    if (id === 'dome_light') return layers.dome;
    if (id === 'flange_f2') return stripCursor(group(layers.f2, 'data-bake', 'flange_f2'));
    if (id === 'subdisc') return group(layers.subdisc, 'data-bake', 'subdisc');
    if (id === 'dragon_relief') return layers.dragon;
    if (id === 'dragon_shadow') return layers['dragon-shadow'];
    if (id === 'dragon_mask') return `<g transform="${F.parts.dragonAt(...V.G.dragon)}" fill="#fff">${F.parts.dragonPath()}</g>`;
    if (id === 'plate_shadow') return layers['plate-shadow'];
    if (id === 'plate_mask_aod') return layers['plate-aod'];
    if (id === 'f1_gloss') return layers.gloss;
    if (/^luna_[0-8]$/.test(id)) return S.globe(U, Number(id.slice(-1)));
    if (id === 'cage_body' || id === 'cage_shadow') return group(S.rotor(U, [0, 0], 0), 'data-bake', id);
    if (id === 'jupiter' || id === 'saturn') return S.planet(U, id, 0, 0);
    if (id === 'sun_star') {
      const d = S.star8(0, 0, 4, 2.4, 1.3);
      return `<path d="${d}" fill="${V.V.sun}" filter="url(#${U}-b05)" opacity="0.8"/><path d="${d}" fill="url(#${U}-sun5)"/>`;
    }
    if (id === 'infinity_aod') return [...layers['marks-aod'].matchAll(/<text\b[\s\S]*?<\/text>/g)].at(-1)[0];
    if (/^kwo_[0-9]$/.test(id)) return `<g transform="translate(0 ${Fonts.timeInkShiftY})"><text data-tier="T0" data-frame="screen" font-family="OrbitWide" font-size="${Fonts.timeSize}" font-weight="600" letter-spacing="0" text-anchor="middle" x="23.5" y="73.3" fill="${V.V.aFill}" stroke="${V.V.aOutline}" stroke-width="1.4" paint-order="stroke">${id.slice(-1)}</text></g>`;
    if (id === 'instrument') return layers.instrument.replace(/<text id="[^"]*-tele-label-\d"[\s\S]*?<\/text>/g, '');
    if (id === 'preview') return F.render({ preset: 'vault5', date: V.MOMENTS.M1 });
    if (id === 'f1_calendar') return layers.calendar.replace(/transform="rotate\([^\"]+\)"/, 'transform="rotate(0 225 225)"');
    if (layers[id]) return layers[id];
    throw new Error(`Unknown bake source ${id}`);
  }
  function render(id) {
    const a = byId[id]; if (!a) throw new Error(`Unknown bake asset ${id}`);
    const { Fonts, ctx } = source();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.deviceWidth}" height="${a.deviceHeight}" viewBox="${a.x} ${a.y} ${a.width} ${a.height}">${ctx.defs}<style>${Fonts.css}text{font-variant-numeric:tabular-nums}svg{isolation:isolate}</style>${markup(id)}</svg>`;
  }
  const lightAudit = {
    shadows: [
      { id: 'dragon-sky', selector: '[data-layer="dragon-shadow"] > g:nth-child(1) > g', dx: 4.4, dy: 4.4, deltaHeight: 5 },
      { id: 'dragon-crescent', selector: '[data-gate-shadow="dragon-crescent"] > g > g', dx: 3.5, dy: 3.5, deltaHeight: 4 },
      { id: 'dragon-f1', selector: '[data-layer="dragon-shadow"] > g:nth-child(3) > g', dx: 2.7, dy: 2.7, deltaHeight: 3 },
      { id: 'dragon-f2', selector: '[data-layer="dragon-shadow"] > g:nth-child(4) > g', dx: 1.8, dy: 1.8, deltaHeight: 2 },
      { id: 'rotor-lip', selector: '[data-bake="cage_shadow"] circle', dx: 3, dy: 3, deltaHeight: 3, rotor: true },
      { id: 'plate-sky', selector: '[data-gate-shadow="plate-sky"] path', dx: 3.5, dy: 3.5, deltaHeight: 4 },
      { id: 'subdisc-floor', selector: 'mask[id$="-wall"] circle:nth-child(2)', dx: 1.77, dy: 1.77, deltaHeight: 2 }
    ],
    highlights: [
      { id: 'dragon-bevel', selector: '[data-gate-edge="dragon-bevel"]', kind: 'raised', angle: 315 },
      { id: 'rotor-rim', selector: '[data-bake="cage_body"]', kind: 'raised', angle: 315 },
      { id: 'plate-bevel', selector: '[data-gate-edge="plate-bevel"]', kind: 'raised', angle: 315 },
      { id: 'horizon-bead', selector: '[data-gate-edge="bead"]', kind: 'raised', angle: 315 },
      { id: 'lip', selector: '[data-gate-edge="lip"]', kind: 'inner', angle: 135 },
      { id: 'step', selector: '[data-gate-edge="step"]', kind: 'inner', angle: 135 },
      { id: 'chamfer', selector: '[data-gate-edge="chamfer"]', kind: 'inner', angle: 135 },
      { id: 'subdisc-lip', selector: '[data-gate-edge="subdisc-lip"]', kind: 'inner', angle: 135 }
    ]
  };
  const api = { assets, render, markup, group, stripCursor, lightAudit, ratio };
  root.BakeSources = root.VaultBakes = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
