# Round 6 WFF parity: studio G3 against `wff/main`

Scope: handoff Task C4, specification 07 §9. The studio reference is `vault5.js` as of 2026-10-26, including the round-6 instrument layer (`instrument()`, `TELE_REG`). The generator is `tools/gen-wff.cjs`, and the bakes come from `bake-sources.js` through `tools/bake.cjs`. No WFF renderer was available and the SM-R965N was not connected, so "matched" means the same geometry, colour and expression as the studio source. It does not mean that a device render was compared.

Commands (from `v5/`, all exit 0): `node tools/bake.cjs`, `node tools/gen-wff.cjs`, `node tools/check-wff.cjs` (`check-wff: ok`; one warning: 6.90 MB of bitmaps and fonts, above the 07 §9.1 estimate of 5.7 MB), `node tools/test-wff-expr.cjs`, and the minidom parse of both `watchface.xml` files.

## Packaging

| Item | WFF | Status |
|---|---|---|
| Publisher | `com.google.wear.watchface.format.publisher` = `kaliwatch-gen-wff-0.6.0` in both manifests | matched |
| Preview | `<Preview value="@drawable/preview"/>`. `preview.png` (480², a bake of `VaultFace.render({preset:'vault5', date: M1})`, the complete Active face) is in both modules. | matched |
| `f1_calendar.png` | Still baked, but no longer shipped. The calendar ring stays vector (Lines and 12 TextCircular in the `calendar` Group turned by E4), as the 07 §9.2 skeleton specifies. The bitmap is only the T13 fallback. `drawable-nodpi` is now regenerated from scratch, and only the resources referenced by the XML are copied. | resolved |
| Memory | 6.71 MB of bitmaps (the preview is not counted) and 0.19 MB of fonts. The 07 table leaves out `rings` and `f1_gloss` at 480² (0.88 MB each) and the new `instrument` (0.46 MB). | over the estimate; under the 100 MB budget |

## Active elements

| Element | Studio source | WFF element / expression | Status |
|---|---|---|---|
| Sky: stars, Milky Way, figures | layer `sky`, `skyMarkup` | `sky_active.png` in Group `sky_active` (586² at −68,−179), angle `E3` | matched (T7, T11) |
| 24 names | `skymarks`, `ANCHORS` | 1×1 Groups with `E17` counter-rotation; T3 `#ccb9c5ca` | matched (T5, T14) |
| Jupiter, Saturn | `skymarks`, `planetsAt` | x/y from `bodyExpressions` (E15/E16), `E17` | matched. The studio drops a planet beyond r 192. In WFF, the opaque rings and F2 cover the same pixels. |
| Moon globe | `globe(k9)` | Condition `E12` → `luna_0..8` | matched (T21) |
| Dome light, Polaris mark | `dome` | `dome_light.png` | matched |
| Sub-disc floor, wall, lip, tracks | `subdisc` `data-bake` | `subdisc.png` plus track Arcs | matched |
| Battery arc r 44 | `batA`, `low ? warning : ph` | Arc endAngle `battery`, Stroke colour `batteryColor` | matched. At 0 % WFF may draw a round-cap dot where the studio draws nothing. |
| Steps arc r 39.5 | `stpA`, `month` | Arc endAngle `steps` | matched (same dot caveat) |
| Battery and steps ticks | `subScale` | Lines. The 50 % ticks are now 70 %, and the duplicate tick at 360° is removed. | matched |
| STEPS / BAT labels | `subScale` qS/qB, r 51.5 | TextCircular CLOCKWISE about Q, centred on 0° and 90° | matched (T13) |
| Steps value | `stepsText` | Condition `[STEP_COUNT] >= 10000` → `stepsLarge` (`12.3k`), else `stepsSmall` (`6,240`); T2 20 | matched (T8) |
| `/goal` | `s.stepGoal` | `numberFormat("#,##0", [STEP_GOAL])` | approximated. The studio clamps the goal to ≥ 1; WFF shows the raw source (T8, `STEP_GOAL` 0). |
| Battery value with raised % | `bat` tspan `dy -6`, centred at Q, `low ? warning : paper` | Two PartTexts. x Transform `149 − (n·10.5 + 5.1)/2` from the digit count, % at baseline 354. Font colour Transform switches to warning at ≤ 15 %. | approximated. The x position uses Martian's fixed 0.7 em / 0.6 em advances and SVG letter-spacing (T5). Font `color` and PartText `x` Transforms are not covered by a 9.5 test; add them to the probe. |
| Crescent and bead | `crescent` | `crescent.png` | matched |
| Horizon azimuth ticks, E / W / 126.98E / 37.57N, smoked-sapphire register (r 164.5–180, 146°–194.5°, lit facet, divider 173.6°) | `instrument()`, `TELE_REG` | `instrument.png` (design 54,96 340×312; device 363×333), drawn between crescent and rings, Active-only, wake [40,240] | matched (baked from the live layer with the telemetry text stripped). Parallax differs: the studio `parallax()` gives `instrument` [0,0], while WFF rides it in `par_rings` (≤ 1.5 px, `full` only) so the ticks stay on the bead. Adding `instrument` to the 0.035 list in `face.js` would align them. |
| Telemetry `LST hh:mm` | `fields[0]`, 30.8 % of the r 175.5 path 200°→144° (182.75°) | TextCircular `telemetry_lst` r 175.5, 191.75°→173.75° CCW, T4 `#b3b9c5ca`, `numberFormat("00", lstHour)`:`numberFormat("00", lstMinute)` on `[REFERENCE.lst]` | matched by expression. M1 gives `LST 09:13`, as in `preview.png` (T9, T13). |
| Telemetry `JD n.nn` | `fields[1]`, 69.5 % (161.08°), `A.toJD(date).toFixed(2)` | TextCircular `telemetry_jd` 173.08°→149.08°, `numberFormat("0.00", [UTC_TIMESTAMP] / 86400000 + 2440587.5)` | approximated. numberFormat rounds half-even where toFixed does not, and a float32 runtime prints `2461512.00` (T7, T8). |
| Lip, trench, step, F1, groove | `rings` | `rings.png` | matched |
| Calendar rules, ticks, months | `calendar`, `MONTHS`, `mn` paths r 202.6 | Group `calendar` angle `E4`. Rules use transfer @60 %, the 5/15/25 ticks tickDay, the 10/20 ticks month at 1.2; 12 TextCircular at r 202.6, T3 month @85 %. | matched. Fixed this round: every line was tickDay, and the month baseline was r 198.7 (T13). |
| F1 gloss | `gloss` | `f1_gloss.png` | matched |
| Sun | `sun` | `sun_star.png` at r 191, Group angle `E8` | matched |
| Trail | `trail` | Arc deep 1.2 `trailStart`→`trailEnd`; Arc ph 1.6 over the last 5°; tip bead r 1.3 `hi` with alpha `[SECOND] > 0`; butt caps | matched. The head and bead were added this round (T17). |
| Rotor body, shadow | `rotor` `data-bake` | `cage_*` in `cage_frame` (orbit `E3`, counter-rotation `E17`) | matched (T14) |
| Carriage | `rotor` `data-live` | Group angle `[SECOND] * 6`: three slot spokes r 2.5–9 with round caps, foot ring r 6.5, paper arbor r 1.75 | matched. Previously this was a phosphor arc. |
| F2 guilloche, batons, numerals, prompt text | `f2` `data-bake="flange_f2"` | `flange_f2.png` (the cursor is stripped) | matched (T2, T23) |
| Night sector | `arc(215, 180+H0, 540−H0)` | Arc `E10start`/`E10end`, 20 px `#59000000` | matched |
| Prompt cursor | `promptLine`: 5×9 ph, 2 px after INFINITY at r 218.9 (155.67°), turned −24.33° | Group `cursor` with pivot (315.20, 424.45), angle −24.33, a Rectangle, alpha `([SECOND] % 2 == 0) ? 255 : 0` | matched. Previously it sat unrotated at (306,402), about 13 px off. |
| Plate shadow, plate | `plate-shadow`, `plate` | images; the shadow has Variants x/y −3 | matched |
| Date line `16 APR FRI ARI 26°` | `dateLine(false)`, centred at 225 | PartTexts at x 141 / 217 / 258 / 294 (from the advances); sign is a 12-way Condition on `E11`; the degree is T4 at baseline −6 | approximated. The positions use fixed advances and SVG trailing letter-spacing, while Android distributes the spacing differently (T5, T22). Previously x 143/219/260/297. |
| Digits, colon | `clock(active)` | TimeText hh/mm T0; colon PartText ph | matched (T5, T6) |

## AOD

| Element | Studio source | WFF | Status |
|---|---|---|---|
| Sky asleep | `sky-aod`: mag ≤ 2.5 in aStar, Draco figure stars in aMark, clipped to the aperture and horizon | Ellipses r 0.8 in `sky_aod_mount` (`E3`). The black `occluder_aod`/`ground_aod` PartDraws stand in for the clip paths. | matched. The Draco stars were added this round (T19). |
| Moon footprint | `globe-aod` | `luna_aod`: black r 46, plus an arc r 45 225°→363.6° in aMoon when `E12 != 0` | matched |
| Ticks, horizon flanks, 00/06/18, INFINITY | `marks-aod` | `aod_marks`. The numeral baseline is now r 214.25 (`ringNumeral` −0.75). | matched |
| Sun, rotor asleep | `live-aod`: sun r 2.5 aSun; rotor ring r 12 aColon 1.2 | `aod_live`, rotated by `E8` / `E3` | matched. Previously the sun was r 3 and the rotor was a partial arc in aText. |
| Sub-disc asleep | `subdisc-aod`: black r 60, arc r 59.25 45°→171° aLine, battery with raised % in aText (aSun when ≤ 15 %) | `subdisc_aod`, using the same `battery(true)` pair | matched (the ≤ 15 % colour was added) |
| Plate mask | `plate-aod` | `plate_mask_aod.png` | matched |
| Date | `dateLine(true)`, all aText | `date_aod` | approximated (same positions as Active) |
| Dragon | `dragon-aod` | `dragon_mask.png`, tint `#ff4e6644` | matched |
| Digits | `clock(aod)` | BitmapFont `kw_outline` (`kwo_0..9`) and the outlined `colon_aod` | matched (T4) |
| Hidden in AOD | instrument, telemetry, sub-disc gauges, trail, rotor, carriage, cursor | AMBIENT alpha 0 on their Groups | matched (T17, T20) |

## Only the device can confirm (07 §9.5)

- **T1, T3:** the wake window and its order, including the instrument's [40,240] fade and the cubic-bezier controls.
- **T2, T23:** the F2 angle Variant. The cursor turns with F2 and sits at r 218.9–228, at the bezel edge.
- **T4, T5, T6:** the BitmapFont AOD clock, `wffBox` baselines and the font weights. T5 also covers the date-line and battery x positions, which depend on how Android applies `letterSpacing`.
- **T7, T8:** sky angle and minute steps; the precision of `[UTC_TIMESTAMP]` JD; numberFormat output for `00`, `0.00`, `#,##0` and `0.0` (`12.3k`); `STEP_GOAL` 0. Font `color` and PartText `x` Transforms are not in the 9.5 list and should go on the probe.
- **T9:** the `[REFERENCE.lst]` and `[REFERENCE.lsun]` chain behind the LST telemetry, the sign Condition and the sign degree.
- **T10:** the `--inline-references` fallback.
- **T11, T14:** the off-canvas sky Group, and the counter-rotated names, planets and rotor, including the new 20×20 carriage Group.
- **T13:** whether the TextCircular radius is the baseline, how CCW glyphs are oriented, and whether CENTER uses the span midpoint. This covers the telemetry, the months, STEPS/BAT and the AOD numerals. The fallbacks are `--circular-shift` or `f1_calendar.png`.
- **T15:** gyro feel, and the instrument parallax difference in `full`.
- **T17:** the cost of `[SECOND]` in the trail, tip bead, carriage and cursor.
- **T18:** wrist legibility of the 7.5 px telemetry on the register.
- **T19, T20:** AOD soak and ambient memory footprint.
- **T21:** `MOON_PHASE_POSITION`.
- **T22:** the date on a Korean locale.
