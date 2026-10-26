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

### Round 5: G3 chosen, left flank, glass and the first instrument pass (`refs/round-5/`)
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

### Round 6: the engineered instrument pass (`refs/round-6/`, current)
Built from [CODEX-HANDOFF.md](CODEX-HANDOFF.md). Codex did most of Tasks A–C on 2026-10-26; Claude finished the gates, the telemetry register, the WFF port checks and this record on the same day. Rendered with `PRESETS=vault5,galaxia STATES=M1,M2,M3,aod:M1,aod:M6 node tools/render-refs.cjs refs/round-6 r6`.

**Type (Task A).** One family, Martian Mono (OFL, `fonts/MartianMono-OFL.txt`), is cut into four static instances by `tools/build-fonts.py`. The cuts are embedded in `orbit-fonts.js` for headless renders and copied into `wff/*/res/font/`. The tiers and frames are those of the handoff tables:

| Tier | Face | Size | Tracking | Frame |
|---|---|---|---|---|
| T0 HH:MM | OrbitWide 600, **wdth 92.5** | 66.39 px | 0 | screen |
| T1 date line | OrbitStd 500 | 15 | 0.06 em | screen |
| T2 ring / steps / battery | OrbitStd 500 | 13 / 20 / 15 | 0 | C, Q |
| T3 names, months | OrbitCond 400 | 10.5 | 0.12 em | P, C |
| T4 engraving, telemetry | OrbitCond 400 | 7.5 | 0.08 em | H, C, Q (+ raised spans) |
| T5 prompt | OrbitStd 400 | 11.5 | 0.02 em | C |

Every `<text>` carries `data-tier` and `data-frame`. The Active face uses all six tiers on all five frames: screen, C, P, H and Q. The measured T0 fit is in [round6-fonts.md](evidence/round6-fonts.md).

**Instrument layer (Task B).** Every value is computed live; `verify.cjs` now recomputes them for M1–M8 independently:
- The horizon azimuth scale and its E, W, `126.98E` and `37.57N` engravings (frame H). `horizonPt` hits the three check points to within 0.2 px.
- The telemetry `LST hh:mm  JD nnnnnnn.nn` (frame C). LST is the WFF E1 carrier and JD is the UTC timestamp / 86400 + 2440587.5.
- The sub-disc ticks, the `STEPS` and `BAT` arc labels, the steps value over `/8,000`, and the battery with a raised `%` (frame Q).
- The sun's degree in its sign, raised after the sign on the date line.
- The 5 × 9 phosphor block cursor, shown on even seconds and absent in AOD.

**New in this round (Claude):**
- **Telemetry register.** The telemetry now reads through a two-cell register: the plate's smoked sapphire (black 75 %) as an annular segment r 164.5–180, clock 146°–194.5°, that runs under the lip.
  - Its inner facet is lit by its normal against the 315° key, like the plate's facet. A steel hairline at 173.6° divides the LST cell from the JD cell.
  - The text baseline moved from r 171 to r 175.5, so the glyphs sit centred in the register.
  - The register replaces the round-5 blurred "engraving bed", which read as a smudge on the Milky Way. It also keeps T4 legible wherever the Milky Way turns under it (G11).
- **Horizon engravings.** `126.98E` and `37.57N` stand 8.6° and 8.2° from E and W (was 7.2° and 6.8°), so the line no longer reads "126.98E E".
- **Depth (G5–G7).**
  - The polished bead's body never drops below a lit steel (`BEAD_FLOOR`), and its foot runs from `steelLo` to `steel`.
  - The sub-disc lip is 3 px (r 57–60). Its wall shadow is one hard 2.5 px crescent at 90 %, without the grey feather.
  - The plate's facet bottoms out at `steelMid` at 50 %. It is still graded by its normal; there is no uniform outline.
  - The plate's shadow follows the height model: (+3.5, +3.5), blur 1.3, 85 %.
  - The dragon's shadow on the crescent is blur 0.4 at 100 %. The rotor's shadow on the lip is blur 0.5 at 100 %.

**Gates** (`npm run verify` prints `all studio checks passed`; `npm run gates` exits 0):

| Gate | Result | Target |
|---|---|---|
| G8 open sky / mirror difference | 36.0 % / 20.2 % | ≥ 35.5 / ≥ 15 % |
| G1 L\* ≥ 45, minimum / median | 11.8 / 16.6 % | ≥ 8 / ≥ 15 |
| G1 L\* ≥ 70, median | 4.1 % | ≥ 4 |
| G1 open-sky median L\* | ≤ 13.8 | ≤ 14 |
| G2 under the glass, median / 99th percentile L\* | 0.3 / 2.2 | ≤ 8 / ≤ 30 |
| G3 AOD lit share / beyond r 220 | 8.04–8.26 % / 0 | ≤ 9.5 % / 0 |
| G9 names | min 3; ≥ 4 for 98.3 % of LST; mean 6.88 | 3; 98 %; 6.5 |
| G10 type inventory | 1044 texts over 12 builds; all tiers and frames | all tagged and matching |
| G11 micro legibility | minimum ΔL\* 32.6 over 22 T4 texts | ≥ 25 |
| G12 phosphor budget | 50.5 % on the dragon | ≥ 45 % |
| Wake at 100 ms | 0 pixels inside the aperture; footprint darkening ≤ 1.12 L\* | 0; ≤ 10 |
| G5 F2/F1, Milky Way, rotor, globe | 29.2×; 1358 px; 17 px; 49.1 % / 24.9 / 49.9 % | ≥ 8×; > 0; ≥ 12; ≥ 40 % / ≥ 8 / ≥ 40 % |
| G5 bead / sub-disc lip | 63.3 % / ΔL\* 12.03 | ≥ 60 % / ≥ 12 |
| G6 shadows and highlights | every offset at 135°, length error ≤ 13.1 %; every highlight at 315° (raised) or 135° (inner wall) | ±5°, ≤ 15 % (30 % rotor) |
| G7 edges, M1–M3 | ≥ 77.6 % of samples, all edges | ≥ 60 % |
| G7 shadows, M1–M3 | 58.4–100 % of receiver pixels | ≥ 50 % |

`lit_pixels.py` on `r6-vault5-aod-M1.png` gives 6.82 %.

**Deviations from the handoff, and why:**
1. **T0 fit.** The digit ink is 55.5 px high, so the cap height is 53.1 px, not 55.5. HH ≤ 94 px was first met at wdth 102.5, but the whole time only fits the G2 box (x 123–327) at wdth **92.5**. Details are in [round6-fonts.md](evidence/round6-fonts.md).
2. **T1 spacing.** Two Std cells (21 px) between the fields would push the line past x 140–310. The fields are separated by 7 px instead. The raised sign degree is a T4 span in the screen frame, the one screen-frame T4.
3. **Telemetry.** The radius and the halo changed:
   - It sits on the register at r 175.5 (the handoff gives r 171).
   - It keeps the 0.6 px `transfer` stroke at 70 % instead of the dark 1.6 px halo, because the register is the halo. The dark halo ate the 7.5 px glyphs (G11 fell to −14.7).
   - DEC is still omitted. In the condensed face the full line with DEC needs about 57° of arc, and only 146°–196° is clear.
4. **Wake gate.** It now counts footprint pixels inside the r 180 aperture, and it also requires the darkening against a render without the footprints to be ≤ 10 L\*. Outside the aperture the footprints lie under the trench and F1, which are black in every frame. The literal rule failed there even with the footprints removed: 1,249 globe pixels, all outside the aperture.
5. **G11 ring.** The 2 px ring is taken around the union of the glyph cells (`getExtentOfChar`) instead of one axis-aligned box. For text on a circle, an axis-aligned box takes in sky up to 25 px from the glyphs. Straight text gives the same ring as before. The threshold (25) is unchanged.
6. **G7 receivers.** A receiver pixel is one the shadow contributes at least 10 % to. The contribution-mask renders leave a 1–5 % haze over thousands of pixels that no shadow can darken by 8 L\*, and that haze was what decided the old result.
   - Plate-sky at M2 has no Milky Way cloud under the shadow, so it is reported as "no receiver". The gate still fails if no moment has a receiver.
   - Rotor-lip receivers are small: 12–16 px at 480 px.
7. **Plate shadow.** It is (+3.5, +3.5), blur 1.3, 85 %, instead of round 5's (+2.2, +2.2), blur 2, 50 %. G6 holds every shadow to 1.25 × height, and the plate stands 4 units above the sky.
8. **Tried and dropped: a knockout halo behind the constellation names.** It cleaned up names crossed by figure lines, but it cost G1 (L\* ≥ 70 median 3.4–3.6 %), and WFF has no filter to match it.
9. **Step goal.** The G3 default goal is 8,000, per the handoff (round 5 showed 10,000).

**Port (Task C).**
- **Done:**
  - BSC5 faint stars, magnitudes 4.5–6.0, precessed, in `faintHi`. Source and licence notes are in [bsc5-provenance.md](evidence/bsc5-provenance.md).
  - `wff-expr.js`: the studio evaluates the exact WFF expression strings ([round6-wff-expr.md](evidence/round6-wff-expr.md)).
  - The bakes: RGBA8888 at ×1.0667, now including `instrument` (the horizon scale, the engravings and the register) and `preview`.
  - `gen-wff.cjs`, writing the main face and the T1/T2/T9/T15 probe face.
  - The full/calm/still motion option, and the tilt preview in the studio. The `instrument` layer now takes the same 0.035 px/° parallax as the rings, in the studio and in WFF.
- **Checked on the PC:**
  - `npm run check-wff` reports `check-wff: ok`. It checks nesting, the Reference chain, the Variant rules of the v4 XSD, resources and fonts.
  - Parity, element by element, is in [round6-wff-parity.md](evidence/round6-wff-parity.md).
  - The main face weighs 6.90 MB of bitmaps and fonts. That is above the 07 §9.1 estimate of 5.7 MB, which leaves out `rings`, `f1_gloss` and `instrument`, and far below the 100 MB limit.
- **APK:** `tools/build-apk.sh` builds resource-only APKs without Gradle (aapt2, zipalign, apksigner and a debug key). The owner installs the Android SDK once, by hand. No APK was built, because there is no SDK on this PC.

**Not done yet:**
- Every device test, T1–T24 in [wff/DEVICE-TESTS.md](../wff/DEVICE-TESTS.md): the watch is not connected.
  - The probe face comes first.
  - Open risks to watch for: float32 JD precision (T7: JD could read `…12.00`), how Android applies letter spacing to the date and battery fields (T5, T6), the Gyro parallax feel and drain (T15), the cost of the per-second cursor and trail (T17), and the memory footprint (T20).
- Constellation names still cross figure lines in a few places, and a name can sit half under the plate edge. G9 counts only names whose box is fully open, so they are not counted as readable.
- The BSC5 dataset licence for commercial redistribution is unconfirmed (see the provenance note).
