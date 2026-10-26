# Critique 02 — Proposal 01 "Celestial Vault" (horologist lens), reviewed as the WFF v4 engineer who has to ship it

**Score: 5 / 10. Verdict: the architecture is right and most of it is buildable in WFF v4 as written, but the material values it specifies sit below an OLED's black floor, so on the wrist it would still read as a print; the AOD mapping breaks the 15 % rule as written; the "flying cage" is 1.7 mm wide and transparent, so the one bright orbiting object the brief asks for does not exist; and the dragon's wing tip crosses the dome rim into the ring stack, contradicting the proposal's own depth logic. Four spec errors in the WFF table are small but would fail the validator or print wrong text. Fix those and it is an 8.**

Device facts used below: SM-R965N = Galaxy Watch6 Classic 47 mm, 1.5" 480 x 480, on Wear OS 6 / One UI 8 Watch (stable rollout Nov 2025; the existing KALIWATCH faces already ship as WFF v4 and are checked with `memory-footprint.jar --schema-version 4`). 1 design px = 480/450 device px = 0.0847 mm.

---

## 1. What I verified, and against what

| Claim in the proposal | Source checked | Result |
|---|---|---|
| `tintColor` is transformable in v4 | PartImage, Group reference pages: "From version 4, this attribute is transformable" | **True.** Variant `target` is defined as "must be a transformable attribute", so a Variant on `tintColor` is legal by the spec; still untested on Samsung's runtime. The two-image alpha cross-fade fallback is the right insurance. |
| `Transform target="endAngle"` on `Arc` | Arc reference: startAngle, endAngle, centerX/Y, width/height "transformable" | **True.** |
| `Variant duration` / `startOffset` are fractions, `interpolation="CUBIC_BEZIER" controls="..."` | Variant reference | **True.** `duration` 0.0–1.0 ("1.0 is the full extent allowed by the device"), `startOffset` 0.0–1.0 (ignored if the sum exceeds 1.0), interpolation includes `CUBIC_BEZIER` with a 4-component `controls` vector, plus `angleDirection`. The proposal's bezier (.22,1,.36,1) is expressible. |
| `Reference` to share the SKY angle | Reference page: "Introduced in Wear OS 6", `[REFERENCE.name]`, `defaultValue` used "when it is not visible" | **True** for this device. Caveat: if the vault Group is ever alpha 0 the cage falls back to `defaultValue`; keep the vault Group visible in AMBIENT (it is, because `sky_aod` lives inside it). |
| `floor`, `%` on floats, `clamp`, `fract` | Arithmetic-expression page | **True**: `%` "If at least one operand is a floating-point number, the result is a floating-point equivalent". `floor`, `ceil`, `fract`, `clamp`, `round` exist. **But `floor()` returns Float and `round()` returns Integer**; see fix F-5. |
| "pad with `numberFormat`" | Same page: pattern "can contain the following characters: `#`, `,`, `.`" | **False.** No zero-padding pattern. See F-5. |
| `[HOUR_0_23_MINUTE]`, `[YEAR]`, `[DAY_OF_YEAR]`, `[TIMEZONE_OFFSET_MINUTES_DST]`, `[MOON_PHASE_POSITION]`, `[STEP_GOAL]`, `[BATTERY_PERCENT]`, `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]` | Source-type page | **All exist.** `HOUR_0_23_MINUTE` Float 0–23.98; `YEAR` Integer clamped 1902–2100; `TIMEZONE_OFFSET_MINUTES_DST` Integer (v3); `MOON_PHASE_POSITION` Integer 0–28 "days since the most recent new moon" (so 29 frames is exactly right); `STEP_GOAL` "never less than 1000". `MONTH_S` yields `Oct`, not `OCT`; use the `Upper` text child or a `Condition` table. |
| BitmapFont for AOD outline digits inside `DigitalClock` | TimeText reference: inner elements `Variant`, `BitmapFont`, `Font` | **True.** `Character name/resource/width/height` PNGs. |
| `Stroke cap="ROUND"` | Stroke reference | **True** (`BUTT`, `ROUND`, `SQUARE`); `join` is v5 only, do not use. `Stroke color` is transformable from v4, so the low-battery warning colour can be one `Transform` instead of a duplicated `Condition` branch. |
| `Font letterSpacing` | Font reference | Exists, **in EM units**, not px. "letter-spacing 2" at 11 px is `letterSpacing="0.18"`. |
| `blendMode` avoided | Features page: blend mode on Group is a **version 5** feature | **Correct call** for a v4 device. The alpha-only black `dome_shade` is arithmetically a multiply against black, as the proposal says. |
| Memory "≈ 3.3 MB" | memory-usage page: 4 B/px RGBA8888, 2 B/px RGB565, 1 B/px ALPHA_8; limits **100 MB interactive, 10 MB ambient**; evaluator may resize "to better fit the screen" | **Undercounted.** Declared set = 4.22 MB at design px (bed 2 x 0.81, sky/sky_aod/dome 3 x 0.64, dragon 0.35, 29 moons 0.19, 11 glyphs 0.13, sun/porthole 0.02); 4.81 MB if the evaluator resizes to 480. Ambient-visible subset 2.13 MB. **Not a problem either way**; `dome_shade` as ALPHA_8 and `bed` as RGB565 would halve it. |
| "Per-second redraw limited to a 20 x 20 group" | Not documented anywhere | **Unverifiable; assume false.** The runtime's invalidation granularity is not published. Budget for a full-scene redraw once per second in interactive, same as v4's seconds trail. |
| Astronomy: `D`, `LST`, `SKY`, `SUN` | Recomputed | `D` = 9793.547 ✓ (the formula's missing year-2000 leap day and the 1-based `DAY_OF_YEAR` cancel; valid 2001–2099, which `YEAR`'s clamp covers). `LST` = 177.34° = 11h49.4m (proposal says 177.4 / 11h50m, fine). `SUN` = 36.0° ✓. Vault orientation is self-consistent: the sky bitmap must be baked with **RA increasing clockwise**, RA 0h at 12 o'clock, then rotated by `SKY = (360 − LST) % 360`; checked against Cassiopeia-high / Big-Dipper-low on an October evening and Taurus rising on the right. **One sign error:** at fixed LST the sun moves 1°/day **clockwise** on the band, not anticlockwise (36.02° today, 37.00° tomorrow at the same LST). |
| float32 precision of `360.98564736629 * D` | Computed | Error 0.096° at D ≈ 9794 — tolerable, but unnecessary. Use `(280.46061837 + 360*fract(D) + 0.98564736629*D + 126.98) % 360`; identical result (177.344°), largest intermediate ≈ 9,650 instead of 3.5 x 10^6. |
| Galaxia facts (sidereal cage orbit, sun pointer at the edge for month + 24 h) | JLC press / Watchonista / Watchtime | Consistent with the brief. The 46th-parallel figure is the Vallée de Joux latitude, not stated by JLC. |

---

## 2. FATAL (the user would still say "flat", a hard constraint breaks, or it cannot be built as written)

**FATAL-1 — The chiaroscuro is specified below the OLED black floor, so the dome does not exist on the watch.**
The vault base is `#050B0E` (≈ 2 % relative luminance), the Milky Way "≤ 14 % L", the dome shade multiplies that by 1.00 → 0.15 toward the limb, the hour-ring soleil alternates `#0A110C`/`#121B14` (≈ 3–5 % L), the flange satin is `#141C17 → #0E1410` (≈ 7 → 4 % L), the sheen is 5 % of `#C2CFCB`. On an AMOLED at outdoor brightness anything under roughly 5–6 % L collapses to black. What survives is: stars, the 1.5 px rim light, ticks, indexes. That is v4 again: dots and lines on black. The digit cast shadow (`#000` 65 % at +2,+2) has no receiver because the receiver is already black. The proposal's own Risk 2 names this and then does nothing about it. A desktop LCD studio preview will hide this completely.
*Fix:* lift every "surface" into the visible band — vault apex `#16262C` (≈ 9 % L) falling to `#070C0F` at r 200, Milky Way peak 24 % L, hour-ring floor `#121B16` with soleil lines at ± 6 % L, flange `#1C261F → #121A14`, sheen 9 %. Then verify on an OLED phone at 1:1 (480 px on a 2x phone = 240 dp) under daylight, not on a monitor, and add a studio toggle that clamps L < 6 % to black so the designer sees what the watch will show.

**FATAL-2 — AOD as mapped breaks the 15 % illuminated-pixel constraint.**
The z0 row maps AOD as `Variant mode="AMBIENT" target="alpha" value="140"` on the *same* textured `bed.png` while claiming "textures vanish". They do not: `#141C17` at 55 % is `#0B0F0D`, non-zero. The textured annulus r 203–225 alone is π(225² − 203²) = 29,580 px² = **18.6 %** of the 159,043 px² disc, before the hour-ring floor (r 207–217 is inside that annulus but the soleil floor fills it), before digits, dragon and stars. By the v4 measurement method (non-zero RGB after 900 → 450 sampling, 11.3 % in v4) this exceeds the cap on its own.
*Fix:* `bed_aod.png` must be pure `#000000` everywhere except the 12 indexes, 60 minute ticks and 24 solar ticks at ≤ 20 % L (the z3 row already hints at this file; make it the rule, and swap images by alpha Variant, never dim the textured bed). Then the proposal's ≈ 10 % estimate is believable.

**FATAL-3 — The cage is not an object.** Ø 20 px at r 212 is 1.69 mm wide with a 0.68 mm seconds hand; it is a 1.5 px open ring with three 1 px spokes, drawn in the busiest 1.9 mm of the dial (ticks, indexes, hairline). It cannot occlude an index because it is transparent inside, so "the cage covering an index as it passes" is false as specified; and at that size it is not readable as a mechanism. The brief's take-away "one bright object that orbits slowly" is the Galaxia's hero and the proposal's weakest part.
*Fix (numbers):* cage Ø 36 (3.0 mm) with an **opaque** back-disc `#0B1E26` + 1 px `#2A3A2D` lip on the 10:30 side + 1.5 px phosphor ring 90 %, hub Ø 4, seconds hand 1.5 x 14 px, orbit r 192 (annulus 174–210). It then genuinely cuts through the hour ring and indexes as it passes (real occlusion, 21.6 min per self-width at 0.2507°/min) and passes over the dragon's wing tips twice a day. Keep everything that must never be occluded inside r 172 (digits are at r ≤ 110; see F-2 for the sub-dial row and prompt).

**FATAL-4 — The dragon leaves the dome.** With the official path in a 180 x 123 frame at (135,30) (viewBox 5 22 126 94, `meet`, scale 1.3085, content x 142.6–307.4, y 30–153), the upper-left wing tip is at (150.4, 30.3) = **r 208.5**, 339° cw; 11 sampled outline points lie beyond r 203. It crosses the dome limb (200), the moat (200–203), the solar hairline (204.5) and sits inside the hour ring (207–217). The proposal's "top of silhouette ≈ r 194; 9 px moat to the solar hairline" is wrong (that is only the top-centre). An element "engraved on the dome apex" that pokes into the sunken ring stack destroys the section the whole design rests on, and the Ø 13 sun disc (r 198–211) collides with that wing tip every day around 14:00 KST (SUN ≈ 339°). At v4's y 24 the reach was r 214.1, so this was already true and nobody measured it.
*Fix:* frame 150 x 102.5 at (150, 40): wing tip lands at ≈ (163, 40), r ≈ 195, inside the limb with 5 px to spare; bottom edge y 142.5, which also opens a 54 px window to the digits (see F-3). The path is untouched; the dragon goes from 40 % to 33 % of the dial width.

---

## 3. REQUIRED FIXES (buildable, but wrong or missing as written)

**F-1 — Use the accelerometer. It is the only real-time depth cue WFF can give, and the proposal ignores it.** WFF has had `Gyro` since Wear OS 4 (`x`, `y`, `scaleX`, `scaleY`, `angle`, `alpha` as expressions on a Group or Part), fed by `ACCELEROMETER_ANGLE_X/Y` (Float, −90..90°, v1). Motion parallax on wrist tilt is what makes the Galaxia's stack read as a stack; it is not a loop, it is not decorative, and it costs nothing in AOD if it lives inside the interactive-only groups. Spec: vault Group `<Gyro x="[ACCELEROMETER_ANGLE_X]*0.07" y="[ACCELEROMETER_ANGLE_Y]*0.07"/>` (far plane, ≈ ±2 px at a ±30° tilt), bed/rings none (reference plane), digit-shadow `DigitalClock` `x="-[ACCELEROMETER_ANGLE_X]*0.03" y="-[ACCELEROMETER_ANGLE_Y]*0.03"` (near plane, opposite sense), cage `+0.05`. The unit mapping of Gyro `x` is undocumented, so the multipliers are tuned on the device; cap with `clamp(...,-3,3)`. Reduced-motion: omit the `Gyro` elements via a `BooleanConfiguration`. This single element does more against "flat" than the entire baked ring stack.

**F-2 — Drop the three-sub-dial row; keep only the moon porthole.** Three r 28 gauges at y 326 are a generic chronograph layout, the least KALI thing in the proposal, and they sit exactly where the cage must fly (extents to r 168) and over the vault's lower half. Battery and steps go back to terminal readouts in the free band under the digits: `BAT 78%` and `STEPS 6240` as 17 px `#EFF8EC` text at baseline 282, x 150 and x 300, with 2 px bars at y 290 (72 px wide) — the v4 pattern the user already accepted. Moon porthole stays, Ø 40 hole / 48 bezel, centred (225, 330), label `MOON 15` 11 px at y 358. Prompt moves to baseline 378 at 12 px so its corners stay at r ≤ 170 (at 13 px / baseline 389 the line ends reach r 175, inside the cage's lane).

**F-3 — Open the apex.** The dome's lit apex (190,185) and the sheen ellipse (175,170) rx 60 ry 40 are under `LST 11:50 · SUN IN SCO`, `25 OCT / SUN` and the `10` glyphs — the single place where the chiaroscuro would be visible is covered by three rows of text, and the dragon's bottom (y 150.3) is 1.7 px from the inscription's cap height (y ≈ 152). Delete the z8 inscription (the sun on the zodiac band already says it; `LST` is horologist vanity nobody will read at 11 px), move the date to baseline 275 in the digits-to-moon band, and with FATAL-4's dragon at y 40–142.5 the apex region y 143–195 becomes open vault between crest and time. Vertical rhythm becomes: dragon 40–142, open vault 143–195, time 196–252, date 275, BAT/STEPS 282–290, moon 310–350, label 358, prompt 378, limb 425.

**F-4 — Give the vault a horizon.** The polar projection to dec −30° shows stars that are below Seoul's horizon on the east and west sides (at azimuth 90° the horizon is at dec 0 = r 150; along the meridian it is at r 237). Bake a static horizon curve into `dome_shade.png`: 1 px `#C2CFCB` 25 %, with the below-horizon region darkened a further 35 %. A fixed window over a rotating texture is the strongest cheap depth cue available, it is honest astronomy, and it is exactly what JLC does on its sky-chart dials.

**F-5 — WFF table corrections (each would fail validation or print wrong text).**
- `PartImage x="211" y="6.5"`: `x`/`y`/`width`/`height` are integers. Use `y="7"` (sun centre r 204).
- Template `LST %s:%s`: `floor()` returns Float and prints as such; `numberFormat` cannot zero-pad. Use four integer parameters: `round(floor(LST/15))`, then `round(floor(((LST/15)%1)*60/10))` and `round(floor(((LST/15)%1)*60))%10` as `%s%s` for the minutes. (Moot if F-3 deletes the row; still applies to anything else padded.)
- `letterSpacing` is in em (0.18, not 2).
- The −2.5° wake settle cannot be a Variant on the vault Group that carries `Transform target="angle" value="SKY"`, because Variant values are absolute and have no `BY` mode. Nest: outer Group `Transform angle = SKY` + `Reference name="sky" source="angle"`; inner Group 400 x 400 pivot 0.5/0.5 `angle="0"` with `<Variant mode="AMBIENT" target="angle" value="-2.5" duration="0.4" interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1" angleDirection="CLOCKWISE"/>`. In AOD the sky sits 2.5° (10 sidereal minutes) off, invisible.
- `MONTH_S` is mixed case; wrap the date `Text` in `<Upper/>` or use a 12-branch `Condition` on `[MONTH]`.
- The "sun dims in the dome's rim shadow" is not achieved by z-order (the sun is drawn above the baked shadow). If wanted, it is one line: `<Transform target="alpha" value="(SUN > 90 && SUN < 200) ? 170 : 255"/>` on the sun image, or a `tintColor` ramp via `extractColorFromColors` (v4).
- `bed_aod.png` as in FATAL-2; `Variant` swaps images, never dims the textured one.
- Flag only: `TimeText format="hh"` alone is implied by the documented `hh:mm:ss`/`hh_10`/`hh_1` forms, not listed as such; if it misbehaves use `PartText` with `[HOUR_0_23_Z]`.

**F-6 — Bake at the device grid, not the design grid.** 1 px brush lines, 180 one-px soleil lines in a 10 px ring, 0.8 px constellation strokes and 1.1 px stars resampled 450 → 480 (16:15) alias into moiré, and the rotating sky resamples bilinearly every minute. Bake `bed`/`bed_aod` at 480 x 480 and `sky`/`sky_aod`/`dome_shade` at 800 x 800 (2x), keep the XML in 450 coordinates. Memory stays under 10 MB in ambient (sky_aod 2.56 MB + bed_aod 0.92 + dragon 0.35 + moons + glyphs ≈ 4.2 MB). Constellation stick figures at 0.8 px / 22 % are below the brief's own "decoration only" threshold; either make them 1.2 px / 30 % or accept that nobody will see them.

**F-7 — The studio must render the baked PNGs, or it over-promises again.** v4's DESIGN-SYSTEM.md already admits its SVG gradients and masks were "browser material, not WFF". The proposal names eight bitmap assets and gives no pipeline. Required: `build-assets` step (Inkscape is already at the known path per the project notes; or resvg/sharp) that rasterises `bed.svg`, `sky.svg` (from the HYG/BSC star list), `dome_shade.svg` into the PNGs, and the studio draws them with `<image href>` plus the same `SKY`/`SUN` expressions — no live gradients, no CSS filters, no blur. Add the black-floor toggle from FATAL-1 and an "OLED 1:1" preset. The studio's 360 ms number and its gauge draw-in are studio-only; say so in the studio UI, not just in the doc.

**F-8 — Edge safety.** The minute arc at r 223.5 (outer edge r 224.25) and ticks to r 222 contradict the proposal's own "5 px margin at r 220" burn-in note, and the Watch6 Classic's rotating bezel sits over the display edge. Keep the arc at r ≤ 221 (width 442) until checked at 1:1 on the device.

**F-9 — Ambient offload check.** The existing pipeline runs `memory-footprint.jar --apply-v1-offload-limitations`. A 400 px (or 800 px) bitmap rotated by an expression once a minute in AOD is not a pattern Samsung's offload path is known to handle; run the evaluator with that flag, then measure 24 h AOD drain against v4. Fallback that keeps the design: static `sky_aod` (no rotation) and rely on the OS pixel shift; the stars are at 30 %, so burn-in risk is already low.

**F-10 — Doc the mean-sun and Seoul constants** (the proposal's Risk 6/7 are right): the sun pointer is the mean sun (equation of time up to ±16 min = ±4° on the solar ring in late October/February), the zodiac band is in RA while signs are ecliptic longitude (≤ 2.5° apart, so the sun-on-band read and the `DAY_OF_YEAR` text table can disagree by a day or two at sign boundaries). Prefer deriving the sign text from the same angle as the band: `floor(((SUN + LST) % 360)/30)` into a 12-branch `Condition`, so the text never contradicts the picture.

---

## 4. KEEP (genuinely strong; do not let later lenses dilute these)

- **The part-for-part Galaxia mapping and the time-scale ladder** ("the deeper the layer, the slower its clock"): seconds (cage) → minutes (flange arc) → civil (digits) → 24 h (sun) → sidereal (vault + cage orbit) → month (sun vs zodiac band) → lunation (porthole). This is the first proposal where depth is *information*, which is what the brief means by "not one-dimensional".
- **Correct, buildable astronomy**: the `D`/`LST`/`SKY`/`SUN` expressions are right, use only `floor`/`fract`/`%`, re-evaluate once per minute, and the clockwise-RA bake + anticlockwise rotation is self-consistent with the real northern sky (checked). Keep `Reference` for single-sourcing `SKY`.
- **Two senses of rotation** (civil clockwise, celestial anticlockwise about Polaris under the colon) — correct and quietly impressive once the user knows.
- **Honesty about planets** (no fake ephemerides) and the moon as a 29-frame mechanical disc.
- **The WFF construction choices**: alpha-only black `dome_shade` instead of `blendMode` (v5-only); Variant alpha swaps between image pairs; the `BitmapFont` outline digits for AOD; `Arc endAngle` for the minute hand; per-second work confined to one small group; v4 `tintColor` with the cross-fade fallback. All verified against the reference.
- **The wake choreography** far-plane-first with `startOffset`/`duration` fractions and `CUBIC_BEZIER` controls — the WFF spec supports exactly this, and the "nothing translates except the deepest layer" rule is the right taste.
- **AOD discipline**: no per-second motion, slow drift on the only moving things, green-dominant low-luminance statics, the solar hairline removed from AOD on purpose.
- **Three controlled new hues with one job each** (`#C2CFCB` grisaille, `#E3B35E` aurum only for the solar system of time, `#0B1E26` fired enamel) and the retirement of v4's teal.
- **The sample moment** (2026-10-25 10:08:24 KST: LST 11h49m, Leo on the meridian, sun at 36° on SCO, moon day 15) as a studio fixture — keep it as a regression test for the port.

---

## 5. Direct answers to the mandatory questions

**Which parts cannot be expressed as PartImage/PartDraw/PartText + Transform + Variant?** None of the layers is inexpressible. The specific places where the proposal's wording does not map 1:1: zero-padding (no `numberFormat` pattern for it; use integer digit parameters), relative Variant animation (no `BY` mode; nest groups), non-integer `PartImage` coordinates, `letterSpacing` units, sun dimming by z-order (needs an explicit alpha/tint `Transform`), and the studio-only gauge draw-in. `blendMode` is v5 and correctly avoided. Everything else — rotated bitmaps, `Arc` sweep, `BitmapFont` time, `Reference`, `tintColor` Variants, `CUBIC_BEZIER` transitions, `Gyro` — is in the v4 reference.

**Memory budget?** 4.22 MB declared (not 3.3), 4.81 MB if the evaluator resizes to 480, ≈ 2.1 MB ambient-visible; with the 2x sky bake from F-6 ≈ 9 MB interactive / 4.2 MB ambient. Limits are 100 MB / 10 MB. Not a constraint; the per-minute rotation cost and ambient offload compatibility (F-9) are the real unknowns, not bytes.

**Does the sidereal/sun/moon maths survive as expressions?** Yes. `D` is exact for 2001–2099, `LST` reproduces 177.34° at the sample moment, `SUN` 36.0°, the moon frame index is a native integer 0–28. Use the reduced `LST` form to keep intermediates under 10^4. Expression evaluation cadence is per minute because the inputs change per minute. The one astronomical sign error (sun creeps clockwise on the band) is in the prose, not in the formulas.

**Does the studio renderer over-promise?** As the proposal stands, yes, twice: (1) a desktop LCD will show 2–5 % L surfaces that the AMOLED will not; (2) there is no asset pipeline, so the studio would again draw live SVG material that the watch cannot. Both are fixed by F-7 (bake, draw PNGs, black-floor toggle, OLED 1:1 preview). The 360 ms is studio-only; on the watch only the ordering is guaranteed, as the proposal correctly says.

---

## 6. Numbers (reproducible: `scratchpad/debate/_geom_check.cjs` against `ghrepo/kw/dragon-data.js`)

```
dragon frame (135,30) 180x123, viewBox 5 22 126 94, meet: scale 1.3085, content x 142.6..307.4 y 30.0..153.0
  max radius 208.5 at (150.4,30.3), 339.0 deg cw; 11 of 517 outline samples beyond r 203; v4 (y 24) max radius 214.1
bitmaps RGBA8888: 4.22 MB at design px; 4.81 MB at 480; ambient-visible 2.13 MB (limits 100 / 10 MB)
1 design px = 0.0847 mm; ring stack 203..225 = 1.86 mm; cage O20 = 1.69 mm; 8 px hand = 0.68 mm; 19 px cap height ~1.1 mm; 9 px names ~0.5 mm
cage self-width transit at r 212: 21.6 min
AOD textured annulus 203..225 = 29,580 px^2 = 18.6 % of 159,043 px^2
LST at 2026-10-25 01:08 UT, lon 126.98: 177.344 deg (big-number form) = 177.344 (reduced form); float32 error of the 3.5e6 product 0.096 deg
SUN cw: 36.02 today, 37.00 tomorrow at the same LST -> clockwise on the band
```

Sources: developer.android.com WFF reference pages for Transform, Variant, PartImage, Group, Arc, Stroke, Font, TimeText, Reference, Gyro, Animation, arithmetic-expression, source-type, memory-usage and features; 9to5google / SamMobile (Nov 2025) for the Galaxy Watch6 Wear OS 6 rollout; JLC press, Watchonista and Watchtime for the Galaxia; project memory for the SM-R965N / WFF v4 / memory-footprint flags.
