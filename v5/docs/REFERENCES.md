# References and reference rounds

## Main reference (user-designated)

The user picked a Galaxia product photo as **the** main reference: JLC Master Hybris Artistica Calibre 945 Galaxia, pink-gold case, black strap. The photo is not stored in this repository (it is JLC's image). This is what it shows and how each element is translated.

| Galaxia (outside → in) | KALIWATCH translation |
|---|---|
| Wide matte-grey 24 h ring with fine radial texture, white even numerals, applied pink-gold batons | `flange`: radial guilloché (720 alternating lines), white 00–22, anodised-phosphor batons at odd hours, plus the real night sector for Seoul today |
| Black calendar ring with white month names, day ticks, and a tiny gold star as the sun pointer | `calendar` + `sun-star`: same anatomy; the star marks today's date |
| Grisaille sky: bright white brush-painted Milky Way, dense white star map with stick figures and tiny capital names | `sky`: the *real* Seoul sky at the current sidereal time, painted Milky Way (noise-masked clouds, Great Rift), upright names |
| Large grisaille planet spheres with full chiaroscuro, one cut by the edge | `dome`: banded grisaille gas giant cut by the plate edge, the Moon at its real phase |
| A pink-gold ring that is *not* concentric with the dial | `frame`: the eccentric anodised edge of the sky plate (offset 7 px) |
| Off-centre flying tourbillon in its own black sunray sub-dial, ringed in gold | `sentinel` + `cage`: sunken sub-dial at 8 o'clock that crosses the plate edge; the cage turns once a minute with a radar sweep |
| Long gold Dauphine hands | replaced by the fixed digital HH:MM (a hard constraint), set on a calm field |
| Monochrome dial plus one warm metal | grisaille plus one metal (anodised phosphor); gold only for the Sun |

Not copied: the JLC wordmark, the actual sky painting, the tourbillon drawing, the case.

## Rounds

Each round is rendered with `node tools/render-refs.cjs <dir> <label>` (headless Chrome, the same engine as the studio). Each sheet shows active day 10:08, active night 21:42 and always-on; the wake strips show 0–360 ms.

### Round 1: three compositions from the debate proposals (`refs/round-1/`)
A Vault (pole under the colon, trench sun, two flanges), B Pole bridge (stereographic, raised bridge, sunken well), C Planisphere window (aperture, smoked plate).
Verdict against the main reference: still flat. The sky was too dim to read as enamel, there were no painted spheres, no guilloché, no month ring, and everything was concentric. All three were superseded.

### Round 2: rebuilt on the photo's anatomy (`refs/round-2/`)
New composition `galaxia.js`: eccentric plate, bright grisaille sky, painted planet and Moon, sentinel sub-dial, black month ring with sun-star, guilloché 24 h flange. Two arrangements: G1 (planet behind the dragon) and G2 (mirrored, the photo's own layout).
Problems found: constellation and zodiac names turned upside down with the sky; the Moon and sentinel crowded the telemetry row; the phosphor frame and bezel read as neon tubes, not metal; the planet's bands read as stripes; the always-on Moon was a large lit disc.

### Round 3: corrections (`refs/round-3/`)
- Names stay upright: anchors rotate with the sky, text is set in the dial frame and quietened under the time.
- Sentinel moved to r 145 (radius 32) and Moon to r 140 (radius 21), clearing the telemetry row by 15–23 px.
- Anodised gradient re-cut to mostly shade with two narrow specular bands; plate edge from 3.6 to 2.6 px; bezel gets an inner groove.
- Planet bands softened (lower contrast, painterly blur); Moon maria and craters subtler; radar sweep halved.
- Always-on Moon dimmed to `#2E3833`; calm field widened over the date line.
- Always-on lit share: 9.2% (2×) / 11.2% (1×).

### Round 4: the debate's composition, G3 (`refs/round-4/`)
The seven-lens debate ([debate/](debate/README.md)) converged on a composition different from G1/G2. `vault5.js` builds it from [07-final-spec-v2.md](debate/07-final-spec-v2.md), and the sheets show it at the spec's named moments:
- M1, 2027-04-16 20:08: the canonical moment. The rotor is in the sub-disc and the winter Milky Way passes under the time.
- M2, 2026-10-25 10:08.
- M3, 2026-11-20 02:00: Jupiter and Saturn in open sky.
- AOD at M1 and M6.
- `r4-compare-M1/M2.png`: G3, G1 and G2 side by side.

**Anatomy:**
- The sky is a north-polar stereographic projection about Polaris at (225,114), under the dragon's arch.
- The horizon is a circle, so the part of the sky plate beyond it becomes a grey guilloche crescent with a polished phosphor bead. This is the eccentric layer.
- A Moon globe sits at 3 o'clock and a sunken sub-disc at 7 (steps and battery). The lip cuts both.
- A bright rotor orbits once per sidereal day and pulls the seconds trail.
- The black F1 calendar ring turns in the RA frame, so the sun's place among the months is the date.
- The grey F2 carries the 24 h numerals, tonight's night sector and the prompt.
- HH:MM sits on an arched 75 % smoked-glass plate.

**Checked:**
- `npm run verify` checks G3 against the spec's validation table: sun angle, night sector, zodiac sign, Moon sprite, and Jupiter/Saturn to 1.5 px.
- `npm run gates` measures the spec's gates on real renders. All pass:

| Gate | Result | Target |
|---|---|---|
| G8 open sky | 36.2 % | |
| G8 mirror difference | 20.2 % | |
| G1 L\* ≥ 45, minimum / median | 10.1 / 15.2 % | ≥ 8 / ≥ 15 |
| G1 L\* ≥ 70, median | 4.4 % | ≥ 4 |
| G1 open-sky median L\* | ≤ 13.4 | ≤ 14 |
| G2 under the glass, median / 99th percentile L\* | 0.8 / 5.1 | ≤ 8 / ≤ 30 |
| G3 AOD lit share | 7.5–7.9 % | ≤ 9.5 % |
| G3 lit pixels beyond r 220 | 0 | 0 |
| G9 names | min 3, mean 6.9 | |

**Tuned against the spec** (all to pass G1 and to read closer to the photo's white Milky Way):
- G1 remedies 1 to 3 as listed in the spec: every w(l) segment below 1.0 raised by 0.15, dust tone `#7C888E`, figure lines 1.8 px.
- Tone-map thresholds 0.10 / 0.20 / 0.37 / 0.72, where the spec has 0.05 / 0.20 / 0.45 / 0.80.
- The dome glaze peak lowered from 12 % to 4 %: at 12 % the open-sky median read L\* 20.
- A fractal-noise brush texture on each Milky Way tone, so the band reads as painted enamel, not contour bands.

**Studio choices:**
- Sleep plays the wake table mirrored inside the existing 180 ms budget. The spec plays it at the full window.
- The AOD sky is clipped to the aperture and the horizon. The spec's occluder and ground footprints come *before* `sky_aod` in its document order, which would let AOD stars show beyond the lip, so on the watch they must follow it.

**Not built yet:**
- The BSC5 faint-star file. The dust is a seeded stand-in in the same tone.
- `wff-expr.js` and the Reference carriers. The studio evaluates the same formulas directly.
- The bakes and `gen-wff.cjs`.
- Gates G5 to G7.
- Gyro and the calm/still motion options.

**Seen on the renders:**
- The left flank bundles the lip, the seconds trail and the horizon bead into parallel phosphor arcs that compete with the dragon's tail.
- The plate still reads partly as a card.
- During wake, the AOD footprints of the globe and the sub-disc show as black discs for about 100 ms before their instruments fill in.

### Round 5: G3 chosen, left flank, glass and the first instrument pass (`refs/round-5/`, current)
On 2026-10-26 the owner chose G3 and asked for two fixes first: the parallel green arcs on the left flank and the card feel of the plate. They also asked for a far more engineered, computing-scientific face in which type, sizes and placement are never one-dimensional.

**Left flank:**
- Phosphor now marks only what is alive: the dragon, colon, rotor, trail tip, gauges, graticule, Draco and INFINITY.
- The lip, the step, the F2 chamfer, the sub-disc lip, the batons and the horizon bead are steel (`STEEL_WALL`).
- The lip is lit as the aperture's inner chamfer (at 135°), so it is dark beside the dragon's wings.
- The bead tapers into both horns, so it no longer forks into the lip at 10 o'clock.
- The seconds trail is a dark-phosphor track with a 5° bright head and a tip dot.

**Glass:**
- The plate is now the band of a smoked-sapphire disc concentric with the dial (ends r 115 about C, the old arch on top, straight bottom at y 264).
- It has no uniform outline. A 1.3 px facet takes its colour from its normal against the 315° key, with an internal reflection inside the SE edges and a 5 % NW sheen.
- The shadow is (+2.2,+2.2), blur 2, 50 %. `plate-aod` uses the same path.

**Instrument pass (first step of [CODEX-HANDOFF.md](CODEX-HANDOFF.md)):**
- The horizon azimuth scale from the real alt/az → dial mapping, with E, W, `126.98E` and `37.57N`.
- A live telemetry line, `LST hh:mm  JD nnnnnnn.nn`, on r 171 at the bottom of the vault.
- Sub-disc scales and arc labels about Q; values in two sizes.
- The date line in three values with the sun's degree in its sign.
- A blinking `_` cursor after INFINITY.
- Wake no longer shows black footprint discs (`globe-aod`, `subdisc-aod` fade out over [0, 160]).

**Gates** (all pass):

| Gate | Result | Target |
|---|---|---|
| G8 open sky | 36.0 % | ≥ 35.5 % |
| G8 mirror difference | 20.2 % | ≥ 15 % |
| G1 L\* ≥ 45, minimum / median | 10.5 / 15.7 % | ≥ 8 / ≥ 15 |
| G1 L\* ≥ 70, median | 4.3 % | ≥ 4 |
| G1 open-sky median L\* | ≤ 13.4 | ≤ 14 |
| G2 under the glass, median / 99th percentile L\* | 1.3 / 10.7 | ≤ 8 / ≤ 30 |
| G3 AOD lit share | 7.3–7.7 % | ≤ 9.5 % |
| G3 lit pixels beyond r 220 | 0 | 0 |
| G9 names | min 3, mean 6.9 | |

`lit_pixels.py` on `r5-vault5-aod-M1.png` gives 6.44 %.

**Not done yet** (all specified in CODEX-HANDOFF.md):
- The type family is still Roboto Mono. The tiers differ only by size, weight and colour until Martian Mono's width axis is cut into static instances.
- The `data-tier`/`data-frame` tags and the G10–G12 gates.
- DEC in the telemetry.
- BSC5, the WFF expressions, the bakes, gates G5–G7, Gyro.
