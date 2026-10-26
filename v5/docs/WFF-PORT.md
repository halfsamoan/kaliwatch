# Watch Face Format v4 port plan (not built yet)

This plan covers G1/G2. For G3 (`vault5.js`), the port plan is section 9 of [debate/07-final-spec-v2.md](debate/07-final-spec-v2.md): assets, document skeleton, Reference carriers and device tests T1 to T24. Two corrections were found while building G3 in the studio:
- `occluder_aod` and `ground_aod` must come *after* `sky_aod` in document order, or AOD stars show beyond the lip.
- The sleep order is vendor-owned (T1).

Target: Galaxy Watch6 Classic (SM-R965N), 480 × 480. Every studio layer is already split the way WFF needs it: an interactive group `<id>` and an ambient twin `<id>-aod`. The wake/sleep windows in `galaxia.js` map to `Variant mode="AMBIENT"` with `duration` / `startOffset` as fractions of the system transition and `interpolation="CUBIC_BEZIER"` with controls `.22 1 .36 1`.

Capabilities below are from the v4 reference pages (see the data-source and expression notes at the end). Items marked *verify* still need checking against a real build.

## Assets (baked from the studio at 480 px, ARGB)

| Asset | Size | Decoded | Moves by |
|---|---|---|---|
| sky disc (stars, figures, Milky Way, ecliptic) | 360 × 360 | 0.5 MB | `angle` = −LST |
| dome (glaze, planet, vignette) | 360 × 360 | 0.5 MB | static |
| Moon phases | 28 × 46 × 46 | 0.24 MB | image chosen by `[MOON_PHASE_POSITION]` |
| rings (bed, frame, calendar, flange) | 480 × 480 | 0.9 MB | static |
| sentinel floor + bezel | 72 × 72 | 0.02 MB | static |
| cage | 72 × 72 | 0.02 MB | `angle` = `[SECOND] * 6` |
| sun-star, hour pointer | 16 × 16 each | small | `angle` about the dial centre |
| dragon relief + shadow | 170 × 130 × 2 | 0.18 MB | static |
| always-on: rings, sky dots, dragon outline | ≤ 480 × 480 | ≤ 1.5 MB | as above |

Total interactive is about 3 MB (limit 100 MB); ambient about 1.5 MB (limit 10 MB). Digits, date, telemetry and prompt stay `PartText` with the bundled Roboto Mono.

## Expressions

- Local sidereal time (deg), from `[SECONDS_SINCE_EPOCH]` (v3+):
  `LST = (280.46061837 + 360.98564736629 * ([SECONDS_SINCE_EPOCH] / 86400 - 10957.5) + 126.978) % 360`.
  Sky disc `angle = 360 - LST`. *Verify* float precision. If it is single precision, split the day count into integer days plus a fraction, giving 0.986 × days + 360.986 × fraction of day.
- Hour pointer: `angle = ([HOUR_0_23_MINUTE] - 12) * 15`.
- Sun-star: `angle = ([DAY_OF_YEAR] - 1 + [HOUR_0_23_MINUTE] / 24) / 365.25 * 360`. Leap years are off by under 1°. *Verify* whether a days-in-year source exists.
- Cage: `angle = [SECOND] * 6` (active only; there is no per-second motion in ambient).
- True Sun on the ecliptic: ecliptic longitude ≈ `280.46 + 0.9856474 * days` (+ 1.915 sin M) → RA/Dec with `sin`, `cos`, `atan`, `asin` (all available), then `x`/`y` on a small `PartImage`.
- Upright constellation names: one `PartText` per name, `x = Sx + r * sin(rad(a0 - LST))`, `y = Sy - r * cos(rad(a0 - LST))`, where r and a0 come from `KaliSky.labels()`. That is 45 texts; if it is too heavy, keep the 12 zodiac names live and bake the rest into the disc.
- Night sector: there is no sunrise/sunset source. Fit Seoul's sunrise/sunset as `h ≈ c0 + c1 cos(2π(doy + φ)/365)` (±4 min) and drive two `PartDraw Arc` angles. *Verify* that Arc start/end angles are transformable; otherwise use 12 monthly baked overlays.

## Ambient rules

- Ambient twins only: hairline rings, numerals, outlines, dim phase Moon, bright-star dots. No `[SECOND]` bindings.
- Lit-pixel budget is checked on the studio's always-on render before every bake: 9.2% / 11.2% today against a 15% limit.

## Known gaps

1. The painted Milky Way and planet use SVG turbulence filters. On the watch they exist only as baked pixels, which is fine because they never change.
2. The calm field must be baked *between* the sky disc and the dome, so the sky disc PNG cannot include it.
3. The studio renders at 450 design px; bake at 480 px with the same geometry scaled by 480/450.

## Data sources and functions used (WFF reference)

`SECONDS_SINCE_EPOCH` (v3), `HOUR_0_23_MINUTE`, `SECOND`, `DAY_OF_YEAR`, `MOON_PHASE_POSITION`, `BATTERY_PERCENT`, `STEP_COUNT`, `STEP_GOAL`; functions `sin cos asin atan rad deg round floor fract clamp`.
