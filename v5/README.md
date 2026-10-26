# KALIWATCH v5 studio: Celestial Vault

Design and system for the next KALIWATCH face, rebuilt after the JLC Master Hybris Artistica Calibre 945 Galaxia. It is not on the watch yet; this folder holds the renderer, the reference rounds and the port plan.

```bash
npm start
```

That serves the studio at http://127.0.0.1:4179. Opening `index.html` from disk also works.

```bash
npm run verify
```

That renders every composition across modes and awkward dates and checks the markup, the always-on pairing and the timeline rules, then runs the astronomy and star-catalogue suites.

```bash
node tools/render-refs.cjs refs/round-6 r6
```

That renders a new reference round with headless Chrome. Set `PRESETS=vault5,galaxia` to limit the compositions. Set `STATES=M1,M2,aod:M6` to render named moments, which also adds a side-by-side comparison sheet. Measure always-on with `python -I tools/lit_pixels.py <png>`.

```bash
npm run gates
```

That renders G3 across a 24-hour sidereal sweep and the named moments, then measures the spec's gates: sky brightness, calm under the glass, always-on lit share, composition, and readable names.

| File | Role |
|---|---|
| `vault5.js` | G3, the debate's composition (`docs/debate/07-final-spec-v2.md`): layers, geometry, expressions, timeline |
| `galaxia.js` | G1 and G2 (round 3): layers, geometry, wake/sleep timeline |
| `face.js` | shared renderer, round-1 compositions, timeline engine (`valuesAt`, `attrs`) |
| `sky.js` | planisphere renderer: stars, figures, painted Milky Way, ecliptic, label anchors |
| `astro.js` | Sun, Moon, sidereal time, alt/az, horizon, sunrise/sunset (Meeus, low precision) |
| `stars.js` | 366-star catalogue, 33 figures, Milky Way path (J2000, verified) |
| `tokens.js` | colours, type, light, motion constants |
| `index.html`, `studio.js`, `studio.css` | the studio page |
| `tools/gates.cjs`, `tools/gates.py` | G3 measurement gates on headless-Chrome renders |
| `refs/` | reference rounds 1–5, see `docs/REFERENCES.md` |
| `docs/CODEX-HANDOFF.md` | the complete brief for round 6 (type system, instrument layer, remaining build, new gates) |
| `docs/` | design system, references, WFF port plan, evidence, the debate record (`docs/debate/`) |
