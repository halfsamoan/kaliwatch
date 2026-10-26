# Critique 02 — WFF v4 feasibility lens on "Celestial Vault" (v5 proposal)

Reviewer stance: adversarial WFF v4 engineer who has to ship this on SM-R965N (Galaxy Watch6 Classic, 480x480, Wear OS 6 / One UI 8 Watch, declared `com.google.wear.watchface.format.version=4`, minSdk 36) without JavaScript. Every technical claim below was checked against the developer.android.com WFF reference pages, the v4 XSD schemas in `google/watchface` (`third_party/wff/specification/documents/4/`, 97 files), and the source of `memory-footprint` (`play-validations/memory-footprint/src/main/`, 16 Java files), all fetched 2026-10-25. Design space 450x450, centre (225,225).

**Score: 5 / 10.** Verdict: **do not build as written.** The astronomy, the layer logic and roughly 90 % of the WFF mapping are correct and verifiable, which is rare. But the proposal fails its own thesis on the panel (the stack's shadows fall on black and the sky it is so proud of is three-quarters hidden), and the typography it keeps from v4 cannot be expressed with `DigitalClock` in WFF v4. All of it is fixable without changing the concept; none of it is optional.

---

## 1. FATAL

### F1. The depth stack has nothing to receive its shadows: on the panel it collapses back into v4 plus a gold dot

The proposal's depth claims rest on four occlusion cues: the dragon's baked drop shadow (0,+5, blur 10, 60 %), the plate's drop shadow (0,+5, blur 12, 55 %), the rim's inner lip shadow (`#000` 60 %, r181-186) and the digits' `Shadow` (`#A6000000`, 65 %) on the plate. Every one of them falls on a surface the proposal paints at or below `#0B1512` / `#050B0F` (sky base) or `#000` (ground, plate core at 80 % black over near-black). A 55-65 % black shadow on a surface whose brightest channel is 15/255 produces a step of at most ~6/255. On an AMOLED at 40 mm that is invisible; on Samsung's panel with its black crush it is literally zero. The digits' shadow on an 80 %-black plate over a `#050B0F` sky is black on black.

What survives on the real screen: the rim bevel SweepGradient (`#2E4A44` to `#0B1512`, this will read), the dragon's own fill gradient and 1 px rim light (material, not depth), a few star dots at the sides, the minute flange, one gold dot. That is the v4 face with a bevelled ring and a gold dot. The user will say "still flat", and he will be right. The proposal names this failure mode itself in Risk 3 but misdiagnoses it as "shadows baked too soft"; the problem is luminance of the receiving surfaces, not shadow opacity.

Required fix (numbers, not adjectives): the visible sky annulus must be a lit grisaille, not black. Bake into `sky_active.png` a vault sheen driven by the same NW light as the rim: base `#121E24` (upper-left) falling to `#0A1216` (lower-right), Milky Way bands up to `#2A4048`, stars `#C3D3DA`. Then a 60 % shadow drops `#121E24` to about `#080E11`, a step the eye reads as "something is above this". Give the plate a material instead of a hole: core `#0B1512` at 90 % (not `#000` 80 %), 1.5 px top bevel `#3A5247` at 70 %, 2 px bottom lip `#000` at 80 %, and let the plate shadow fall on the sheen. Digits keep contrast: `#EFF8EC` on `#0B1512` is > 15:1. AOD stays black; nothing of this costs AOD pixels.

### F2. The "real Seoul sky" is ~75 % occluded; the recognisable sky is permanently under the plate and the dragon

Geometry, from the proposal's own numbers. Sky lens = inside aperture r186 and above the horizon circle (225,71.8) r217.8: 67,100 px (42 % of the 159,043 px dial), not "roughly 36 %" (that figure is before subtracting anything). Subtract the plate's soft ellipse (rx140 ry62, essentially all above the horizon): ~24,000 px. Subtract the dragon's 170x134 occupancy at the top centre: ~12,000 px perceptually (the bbox reads as occupied even where the path is open). Remaining sky: ~31,000 px, 19 % of the dial, in two side crescents ~45 px wide (x39-85 and x365-411, y160-284) plus a 24 px band y140-172 at the top, minus the dragon's irregular bottom edge.

The pole is at (225,225), under the digits. Everything within rho <= 50 deg (86 px) of the pole is under the plate or the dragon forever: Polaris, Ursa Minor, Cassiopeia (dec 56-60, rho 52-57 px), Cepheus, Ursa Major's bowl (Dubhe dec 61.8, rho 48 px). Those are the only northern asterisms a non-astronomer recognises. The side crescents show stars with rho 81-108 deg, i.e. dec -18 to +9: equatorial stars drifting through a 45 px slot at 0.84 px/min. At mag 4.5 density that is 5-10 dots per crescent at any instant. The user will not perceive "a sky wheeling around the pole"; he will perceive random dots.

Also broken by the same geometry: the zodiac reading. The RA ring (r174-186) at 12 o'clock is y39-51, inside the dragon's bbox (y20-154, x140-310). Around noon, when the sun pointer sits at the top, the sign name it points at is behind the dragon. The moon marker at r180 passes behind the dragon for ~50 deg of arc, i.e. the ~3.3 hours around its transit, its most visible time. And the RA ring itself (r174-186) lies under the rim's inner lip shadow (r181-186, 60 % black), so the 8 px labels are half-shaded even where visible.

Required fix: give the sky back. (a) Plate: tighten to a rounded rectangle 224x72 (x113-337, y188-260, radius 24, soft edge +8 px) instead of the rx140 ry62 ellipse; it still covers the full digit extents (x119-331, y197-252) and returns ~11,000 px. (b) Dragon: 0.8x (art 131x98 at x160 y34, bottom y132); the brief allows size/placement changes. That opens a 56 px band y132-188 above the plate where rho 35-95 px (20-55 deg) passes: Cassiopeia and Cepheus in autumn evenings, Ursa Major's bowl in spring, visibly turning. (c) Zodiac: stop baking the names on the ring under the dragon. Put the current sign on the pointer itself, WFF-native: inside the `sun_pointer` group, a `Condition` on `[DAY_OF_YEAR]` ranges with 12 `Compare` branches, each a `PartText` "LIB" 11 px `#D9A441` 60 % at (225,36) next to the gold disc. That is readable (11 px, brief threshold) and is the one place on the face where Galaxia's "sun reads the zodiac" idea actually lands. Keep the RA ring as 24 h ticks only, moved inward to r166-176 so it clears the lip shadow.

### F3. `DigitalClock`/`TimeText` cannot carry `Shadow` or `Outline` in WFF v4: the Active digits and the AOD outline-digit signature as written do not validate

Verified in `clock__timeText.xsd` (v4): the `Font` inside `TimeText` is a locally defined `xs:complexType mixed="true"` with attributes only (`family size color slant width weight`), no child elements. The general `Font` (`group__part__text__fontElement.xsd`) is the one that accepts `TextComponentGroup` = `Shadow | Outline | OutGlow | Underline | StrikeThrough | InlineImage | Template | Upper | Lower`. So section 7's

```xml
<TimeText format="hh" ...><Font ...><Shadow .../></Font></TimeText>
<TimeText format="hh" ...><Font ...><Outline .../></Font></TimeText>
```

is rejected by `wff-validator.jar`. This kills two things the user explicitly kept: the digit drop shadow (the digits-above-plate cue) and the AOD outline digits (fill `#0C160B`, outline `#91AD80`) that have been the AOD identity since v2.

Required fix: render the digits as `PartText` with a time template, which is where decorations live:

```xml
<PartText name="hh_active" x="119" y="186" width="94" height="86">
  <Text align="CENTER">
    <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffeff8ec">
      <Shadow color="#a6000000" offsetX="0" offsetY="3" radius="6">
        <Template>%s<Parameter expression="[HOUR_0_23_Z]"/></Template>
      </Shadow>
    </Font>
  </Text>
  <ScreenReader stringId="sr_hour"><Parameter expression="[HOUR_0_23]"/></ScreenReader>
</PartText>
<!-- AOD twin: Font color="#ff0c160b" with <Outline color="#ff91ad80" width="1.4"><Template>...</Template></Outline> -->
```

`[HOUR_0_23_Z]`, `[MINUTE_Z]` are v1 string sources (zero-padded); the brief wants fixed 24 h anyway. Costs to state honestly: (1) the face then has no `DigitalClock`; `Metadata CLOCK_TYPE=DIGITAL` is still allowed (the Scene XSD requires no clock element), but `memory-footprint` only recognises a `PartText` as a clock with its `supportOldStyleAnalogOrDigitalClock` setting, and in the "V1 offload" ambient model the tool assumes "only AnalogClock, DigitalClock and ComplicationSlot are drawn dynamically and everything else is static". If Samsung's runtime offloads ambient the same way, PartText digits could freeze in AOD. This must be the first thing tested on the watch. (2) Fallback if they do freeze: `DigitalClock` with a plain `Font` and the AOD identity becomes dim filled digits `#5E7A55` instead of outlines; lit pixels rise by ~4,000 px (2.5 %), still inside the 8 % target.

### F4. "One signature wake transition <= 400 ms" is not expressible, and the Samsung runtime's transition is unverified

`Variant` `duration` and `startOffset` are fractions (0-1) of "the full extent allowed by the device" (reference page, verified). There is no attribute for absolute milliseconds and none that distinguishes AOD-entry from AOD-exit timing. The 360 ms / 180 ms numbers in the studio are therefore design intent only; on the device the window is whatever `com.samsung.wear.watchface.runtime` grants, and nothing in the user's notes says a Variant animation has ever been observed on this watch (the existing face uses `duration="0.35"` but nobody measured it). If the window is, say, 700 ms, every fraction in section 4.1 doubles and the brief's hard limit is broken. Required: measure the window with a high-speed phone video of the existing face first; if it exceeds 400 ms, cap all `duration + startOffset` at 400/window so the visible motion still ends inside the brief's limit, and accept that the AOD entry is symmetric (the proposal already concedes this).

---

## 2. Answers to the four questions

### Q1. Which parts cannot be expressed as PartImage/PartDraw/PartText + Transform + Variant?

Cannot, as written:
- `Shadow`/`Outline` inside `TimeText` (F3). PartText templates can.
- A `Compare` with a `value` attribute: `Compare` has exactly one attribute, `expression` (`common__conditionElement.xsd`; the user's own `watchface.xml` uses it correctly). The moon selector must be 8 named boolean expressions (`[MOON_PHASE_TYPE] == 4`), not `value="4"`.
- Direction-specific or millisecond transition timing (F4).
- An ambient-only, time-varying transform. There is no ambient data source (`STATE.IS_AMBIENT` exists only inside the memory tool's Honeyface compatibility code; the WFF source-type page has nothing of the kind). So the AOD drift `Transform` on `aod_root` runs identically in interactive, which is harmless only because `aod_root` is alpha 0 there. The real damage: the AOD digits sit up to 3 px off the Active digits during the cross-fade, so the "same glyphs, same coordinates, reads as the digits filling" claim is false for 19 of every 20 minutes. (The v4 XSD types `Variant value` as `arithmeticExpressionType`, so an expression inside a Variant may be schema-legal, but it is undocumented and unverified at runtime; do not build on it.) Fix: drop the custom drift. The sky and arc already move, the digits change every minute, the outline is 68 % channel at most.
- SVG masks, blur filters, soft ellipses, gradient-masked rings: bake. The proposal already says so; the studio must then composite the baked PNGs, not live SVG filters (see Q4).
- `blendMode="SCREEN"` on the dayglow: allowed on `PartImage` (verified: PartText/PartImage/PartAnimatedImage/PartDraw, Wear OS 5.1+). Samsung-untested, fallback `SRC_OVER` at 45 % is right.
- Integer division: `clamp([STEP_COUNT] / [STEP_GOAL], 0, 1)` with two integer sources is at risk of truncating to 0 until the goal is met (the expression page distinguishes int and float results for `%` and says nothing reassuring about `/`). Write `clamp([STEP_COUNT] * 1.0 / [STEP_GOAL], 0, 1)`.
- XML well-formedness: `[BATTERY_PERCENT] <= 15` and `[MINUTE] % 20 < 10` inside attribute values must be `&lt;=` / `&lt;`. The snippet as pasted is not well-formed.

Can, verified (keep):
- `Group`/`PartImage`/`PartDraw`: `x y width height pivotX pivotY angle alpha scaleX scaleY` transformable; `tintColor` transformable from v4; `scaleX/scaleY` are in `abstractPartType` in the v4 XSD.
- `Variant`: `mode=AMBIENT`, `duration`, `startOffset`, `interpolation` incl. `CUBIC_BEZIER` with `controls` (vector4f, space separated), `angleDirection`.
- `Transform` + `Animation duration(s) interpolation=EASE_OUT fps repeat`.
- `Arc` `startAngle/endAngle` transformable, 0 = 12 o'clock, exactly one `Stroke`; `Ellipse`/`Rectangle` `x y` are `xs:float` (negative allowed, the ground ellipse at x=-73.9 validates; drop the 430 KB PNG fallback), `width/height` positiveFloatType; `Stroke` `color` transformable from v4, `dashIntervals` floatListType, `dashPhase`, `cap`; `Fill`/`Stroke` accept `LinearGradient | RadialGradient | SweepGradient` children.
- Dash arithmetic checks out: 24 ticks on r203, circumference 1275.5, "1 52.15" sums to 53.15 = 1275.5/24; 60 ticks on r218, 1369.7/60 = 22.83 = "1.5 21.33"; 12 ticks "2 112.14" = 114.14. Android's `addOval` starts the path at 3 o'clock, which is a tick for all three rings, and `dashPhase=0.5` centres the 1 px dash there. Verify in the emulator that the runtime uses the same start point; if not, adjust `dashPhase` once.
- `format="hh"` / `"mm"` on `TimeText`: valid (XSD pattern `(h{1,2})|m{1,2}|s{1,2}`), relevant only for the fallback in F3.
- Expression functions: `sin cos` (Java `Math`, radians) with `rad()`, `clamp`, `floor`, `abs`, float `%`, ternary, `colorRgb()` (v4). Re-evaluation follows the data sources used; ambient renders once per minute.
- Data sources: `[HOUR_0_23_MINUTE]` float, `[DAY_OF_YEAR]` 1-366, `[YEAR]`, `[MOON_PHASE_POSITION]` 0-28, `[MOON_PHASE_TYPE]` 0-7, `[STEP_GOAL]` >= 1000, `[TIMEZONE_OFFSET_MINUTES_DST]` v3 integer, `[DAY_Z] [MONTH_S] [DAY_OF_WEEK_S]`; `Upper` is a Font formatter (v1).

### Q2. Memory budget for the named bitmaps

Rules verified on the memory-usage page and in `AmbientMemoryFootprintCalculator.java`: bitmaps are counted after resize, transparent-pixel crop and RGB565 downsample where lossless, 4 B/px RGBA; rotated images are not inflated (no rotation handling exists in the tool); nodes whose effective ambient alpha is 0 are skipped (`VariantConfigValue.isNodeSkipped`); ambient total = `screenW * screenH * numLayers * 4 + maxResourceUsage`, where a layer is a run of `Part*` nodes and `DigitalClock`/`AnalogClock`/`ComplicationSlot` end a layer; `--apply-v1-offload-limitations` (the user's own pipeline flag) caps layers at 2 and clocks at 2.

At 480 px (x1.138 area):

| resource | px after crop | bytes |
|---|---|---|
| sky_active 384x384 -> 410x410 | 168,100 | 672 KB |
| sky_aod 410x410 (or one alpha PNG + `tintColor`, 1 B/px: 168 KB) | 168,100 | 672 KB |
| dayglow ~427x320 after crop | 136,600 | 546 KB |
| hour_plate 299x132 | 39,500 | 158 KB |
| dragon_relief + dragon_engraved 181x143 x2 | 51,800 | 207 KB |
| probe_cage, moon glyphs (if 20x20) | ~4,600 | 18 KB |
| roboto_mono.ttf | | ~110-170 KB |
| **interactive** | | **~2.4 MB of 100 MB** |
| **ambient**: 2 layers x 921,600 + sky_aod + dragon_engraved + moon + font | | **~2.9 MB of 10 MB** |

Memory is not a constraint; the proposal's own 2.1 / 2.9 MB figures are right within rounding. Two things to change anyway: (1) the eight 450x450 moon PNGs: the tool crops them to 20x20 for the count, but the runtime still decodes 450x450x4 = 810 KB per phase; wrap a 20x20 glyph in a 450x450 `Group pivotX=0.5 pivotY=0.5` with the angle Transform instead (nested rotations compose). (2) `sky_aod` as a white-on-alpha PNG tinted via `tintColor="#3F4F55"` saves 500 KB and lets the AOD star colour be tuned in XML.

### Q3. Does the sidereal / sun / moon maths survive as expressions?

Yes, and I re-derived it rather than trusting it. GMST at 2026-01-01 00:00 UT: d = JD 2461041.5 - 2451545.0 = 9496.5; 280.46062 + 360.98565 x 9496.5 mod 360 = 100.66 deg (matches). UT = KST - 9 h, longitude +126.98: constant = 100.66 - 9 x 15.04107 + 126.98 = 92.27 (matches); the 360 x day term drops under mod 360, leaving 0.98565 deg/day (matches). Sample 2026-10-25 10:08 KST: DAY_OF_YEAR 298, LST = 92.27 + 292.74 + 152.42 = 537.43 -> 177.4 deg; independent GMST route gives 177.4 (matches). Chirality: facing north with east on the right, the star at RA = LST is on the upper meridian (top), RA = LST + 6 h is at the east point (right), so RA increases clockwise on the chart and the chart turns counter-clockwise with time; `theta = (360 - LST) mod 360` is correct. Horizon: a circle through (225,289.6), (70.2,225), (379.8,225) approximates the true altitude-0 curve of the equidistant projection to within 1.8 px at azimuth 45-70 deg; good enough. Sun pointer: `188 - 15 x t` puts mean noon (12:32 KST) at the top; its dial-frame angle equals -(hour angle of the sun), which is exactly where `RA_sun` lands on the sidereal ring after the group rotation, so pointer and ring agree to the equation of time (<= 4 deg). `RA_sun` from `lam`: equinox D=79 gives lam 359.9 (correct, equinox 2026-03-20 14:46 UT); the sign boundaries 27.9 / 57.8 / 122.2 ... are the correct RA of ecliptic longitudes 30, 60, 120 deg. Moon: `RA_sun + 12.19 x position` inside the sidereal group, full moon opposite the sun, +-10 deg; honest. `[YEAR] x 365.25` costs <= 0.25 deg; fine.

What to change in the expressions themselves: (a) the moon Transform repeats the 120-character `RA_sun` term twice inside each of 8 branches; nest instead: `sidereal` group (angle theta_sid) > `sun_ra` group (angle RA_sun, one expression) > `moon` group (angle 12.19 x [MOON_PHASE_POSITION]) > glyph. Three short expressions, same result, and the `Reference` element (v4) can single-source the sun expression for the zodiac text. (b) Escape `<`. (c) Float-force the step ratio. (d) `[HOUR_0_23_MINUTE]` is in the tool's `OFFLOADABLE_TIME_RELATED_DATA_SOURCES` list, meaning the tool treats the sky as a per-minute dynamic node; good for the memory estimate, but the real question is whether Samsung's ambient path re-evaluates a Group angle each minute. If it does not, the AOD sky simply holds its last pose until the next wake (0.25 deg/min is invisible anyway), so the design degrades gracefully. State that in `docs/ASTRONOMY.md`.

### Q4. Does the studio renderer over-promise?

Today's studio (`face.js`, `celestial.js`) is live SVG with gradients, masks, clip paths and WAAPI. The v5 studio will over-promise in these specific ways unless it is rebuilt around the baked assets:
1. Soft shadows and the soft plate edge via SVG `filter`/gradient masks render differently from the PNG the watch will show. The studio must composite `sky_active.png`, `hour_plate.png`, `dragon_relief.png` etc. (the same files that go into `res/drawable`) and only draw the vector parts (rings, arcs, text) live. Otherwise the user approves a picture the watch cannot reproduce.
2. 360 ms wake / 180 ms return / 80 ms telemetry delay: not portable (F4). The studio should expose the transition window as a slider (300-800 ms) and the Variant fractions, so the user sees what a 600 ms device window does to the choreography.
3. `prefers-reduced-motion` has no WFF equivalent; the `BooleanConfiguration` toggle is the only path, and it needs a duplicate Variant-free tree (the proposal says this; it doubles the XML, not the bitmaps, which is fine).
4. Sub-pixel decoration: constellation lines 0.8 px at 60 % on a 384 px bitmap become ~0.85 px after 480 scaling and then anti-aliased by the rotation; they will be mush. Either 1.2 px at 45 % in the bitmap or drop them (the brief already calls < 1 px decoration).
5. Text metrics: SVG baseline `y=252` versus WFF box `y=186 h=86 align=CENTER`; expect 1-3 px vertical disagreement between studio and watch for the digits and 1-2 px for the 15 px labels. The studio should use box-based placement for text to match.
6. The dayglow `SCREEN` blend in a browser is sRGB-correct; on the Samsung runtime it is unverified. Studio toggle: SCREEN vs SRC_OVER 45 %, so both variants are approved up front.
7. The studio cannot show Samsung's own AOD pixel shift, PWM dimming or black level. Lit-pixel analysis must come from the existing `design/render_aod_preview.py` + `wff/analyze_aod.py` path, at 480 px.

One more over-promise to name: the proposal's lit-pixel table counts an outlined 78 px glyph as ~380 px. The outline traces the outer and inner contours (300-400 px of path) at 1.4 px plus anti-aliasing, roughly a 2.2 px lit band: ~800 px per glyph, ~3,200 for four, double the estimate. Corrected total ~9,000 px = 5.7 %, still inside the 8 % target, so the budget holds; the number was wrong, the conclusion was not.

---

## 3. Required FIXES (in priority order)

1. **Lift the receiving surfaces** (F1): sky sheen `#121E24` -> `#0A1216` NW-SE with Milky Way to `#2A4048`; plate core `#0B1512` at 90 % with 1.5 px bevel `#3A5247` 70 % and 2 px lip `#000` 80 %; keep all shadows at 55-60 %. Verify on the device that the plate and dragon shadows are visible at 40 % screen brightness; if not, the design is still flat.
2. **Give the sky back** (F2): plate 224x72 rounded rectangle; dragon 0.8x at x160 y34; RA ring inward to r166-176, ticks only; zodiac as a `Condition`-selected 11 px label on the sun pointer; moon glyph kept but the dragon no longer sits on its transit.
3. **Digits as `PartText` templates** with `Shadow` (Active) and `Outline` (AOD) (F3); add `ScreenReader`; test AOD minute updates on the watch on day one; fallback documented.
4. **Measure the device transition window** before tuning any Variant fraction (F4); cap fractions so visible motion ends <= 400 ms.
5. Remove the AOD drift Transform (coordinates must match at wake); rely on per-minute change and dim colours.
6. Fix the XML: `Compare expression="ph4"` with boolean expressions, `&lt;=` escapes, `* 1.0 /` for the step ratio.
7. Moon glyph 20x20 in a pivot Group, nested `sun_ra`/`moon` groups, `Reference` for the shared sun expression.
8. `sky_aod` as alpha PNG + `tintColor`.
9. Constellation lines >= 1.2 px or removed; RA/zodiac micro-text removed from the bitmap.
10. Studio rebuilt to composite the baked PNGs and expose the transition window; text placed by box, not baseline.
11. Build the catalogue pipeline (HYG/BSC5 to mag 4.5, dec >= -18, J2000) as a deterministic generator (`design/build_sky_assets.py` next to `build_motion_assets.py`, Inkscape already in the chain) so `sky_active.png` is reproducible.

## 4. KEEP (genuinely strong)

- The thesis: separate planes, each driven by a different clock (seconds on the cage, minutes on the flange, civil time in the digits, solar day on the gold pointer, sidereal day on the sky, month in the pointer-vs-ring reading, lunar month on the moon). This is the correct reading of why Galaxia feels deep, and it is the only version of this project so far that is not decoration.
- The astronomy. Every constant checks; the chirality is right; the horizon circle is within 2 px; the sun pointer and the sidereal ring are mutually consistent. Keep `docs/ASTRONOMY.md` and its honesty about +-4 deg / +-10 deg.
- Nested rotating `Group`s with expression angles, `PartDraw` for everything that is a ring/arc/tick/dot, bitmaps only for the sky, plate, dragon and glow. Memory 2.4 / 2.9 MB; the ordering (static first, clocks, then dynamic Part*) matches the tool's layer model.
- The paired Active/AOD element pattern with `Variant alpha` and staggered `startOffset`s; the `-14 deg -> 0` flange alignment carried over from v4; the parallax scale 0.975/0.97 (keep it at >= 2.5 %, it is the only motion-based depth cue that survives a dark panel).
- One warm colour, `#D9A441`, used only for the sun. Correct discipline.
- The AOD discipline: no per-second sources in ambient-visible elements, 15 %-rule headroom, outline digits (once moved to PartText).
- Counter-clockwise 24 h ring as physically consistent with facing north, plus the `BooleanConfiguration` mirror for people who hate it.
- The dragon stays the official path, rasterised once; only size/placement change.

## 5. Residual risks that only the watch can answer

- Does `com.samsung.wear.watchface.runtime` animate `Variant`s at all, and over what window (F4)?
- Do `PartText` time templates and `Group` angle Transforms update per minute in Samsung's AOD, or only clocks (F3, Q3d)?
- `SweepGradient` zero-angle origin and sweep direction (the rim bevel's lit side must be NW; one emulator screenshot settles it).
- `SCREEN` blend fidelity on the Samsung runtime.
- Visibility of 55-60 % shadows on the real panel at typical brightness (F1 acceptance test).
- Night-time battery with the per-minute ambient re-render of a 410 px rotated bitmap (screencap is black in doze on this device, so measure drain overnight, as the user's notes already say).

## 6. Sources checked (2026-10-25)

developer.android.com/reference/wear-os/wff: `common/variant/variant`, `common/transform/animation`, `group/group`, `group/part/image/part-image`, `group/part/draw/part-draw`, `group/part/draw/shape/arc`, `.../ellipse`, `.../rectangle`, `group/part/draw/style/stroke`, `.../fill`, `group/part/draw/gradient/sweep-gradient`, `group/part/text/part-text`, `group/part/text/decoration/outline`, `.../shadow`, `clock/time-text`, `common/condition`, `common/attributes/blend-mode`, `common/attributes/arithmetic-expression`, `common/attributes/source-type`; developer.android.com/training/wearables/wff: `expressions`, `memory-usage`, `ambient`, `release-notes`. github.com/google/watchface: `third_party/wff/specification/documents/4/*.xsd` (clock__timeText.xsd, group__part__text__fontElement.xsd, decorationGroup.xsd, formatterGroup.xsd, common__variant__variantElements.xsd, common__conditionElement.xsd, shape XSDs, sceneElement.xsd), `play-validations/memory-footprint/src/main/*.java` (AmbientMemoryFootprintCalculator, VariantConfigValue, DrawableNodeConfigTable). Device/OS: project memory note (SM-R965N, Wear OS 6, `format.version=4`, minSdk 36) and the One UI 8 Watch stable rollout reports (androidauthority, 9to5google, Dec 2025).
