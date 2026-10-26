# Critique 02 — "Celestial Vault" material proposal, WFF v4 feasibility lens

Reviewer stance: the engineer who has to ship this on a Galaxy Watch6 Classic (SM-R965N, 480x480) as Watch Face Format XML with no JavaScript. Every WFF claim below was checked against developer.android.com/reference/wear-os/wff, the WFF v4 XSD in github.com/google/watchface (`third_party/wff/specification/documents/4`), and the memory-footprint evaluator source (`play-validations/memory-footprint`). Where I could not verify something I say so.

**Score: 6 / 10.** Right architecture, wrong XML in four places, and the centre of the dial re-flattens as specified. The fix list is short and concrete; approve the direction, not the spec.

---

## 1. FATAL (build-breaking, constraint-breaking, or "still flat")

### F1. Scene-level `<Expressions>` does not exist. The XML as written will not validate.
The proposal declares `D`, `LST`, `lam`, `thSun`, `thMoon` "once as `<Expressions>` on the Scene" and references them from Transforms. In the v4 XSD, `sceneElement.xsd` allows under `Scene` only: Group, PartText, PartImage, PartAnimatedImage, PartDraw, Condition, ListConfiguration, BooleanConfiguration, Variant, Transform, Reference, ComplicationSlot, AnalogClock, DigitalClock. `Expressions` is a child of `Condition` only, and `Compare` is the only consumer of an expression name (reference page: "must match the `name` of an `Expression` element used elsewhere in the `Condition`"). A Transform `value` cannot name an expression.
Two legal mechanisms:
- **Inline duplication.** `arithmeticExpressionType` is a union type with no `maxLength` or pattern, so a 600-character LST expression in each Transform is legal. LST is needed in 6 places (sky angle, sun x/y, bead angle, moon x/y) — acceptable.
- **`Reference` (v4, "introduced in Wear OS 6").** Place a hidden compute element: `<Group name="eph" x="0" y="0" width="1" height="1" alpha="255"><Transform target="angle" value="(280.46061837 + 0.98564736629*D + 360*fract(D) + 126.98 + 720) % 360"/><Reference name="lst" source="angle" defaultValue="0"/></Group>` and consume `[REFERENCE.lst]` elsewhere. Caveat from the doc: `defaultValue` is used "while the parent element is not available such as when it is not visible" — keep the compute group at alpha 255 and empty (it draws nothing). Whether an empty group counts as "available" is undocumented; verify on device, fall back to inline.

### F2. The centre of the dial goes black again — the v4 silhouette with better edges.
Under the digits the proposal stacks: sky ground `#0A1016`->`#121A22` (0.3-0.9 % luminance), Milky Way x0.5 inside r110, star alpha x0.6 inside r130, terminator black up to 0.15 at r70-110, **central well black 0.40**, then the digit shadow. Net under HH:MM: about `#07090C`, i.e. black with a few dim stars. The lit, shaded dome survives only in the NW quadrant (x<225, y<225) — directly behind the dragon box (153-297, 30-137) and the glaze centre (168,150). The flange+trench is a 29 px ring (2.6 mm at 40 mm). At arm's length the composition reads: black field, decorated ring, dragon top-left, stars. That is exactly what the user rejected. The "five depth cues" exist in the bake but three of them are below the visibility floor where the eye lands. Fix is in section 2 (R1-R3); it is a numbers change, not a redesign.

### F3. `TimeText format="HH"` fails validation.
`timeText.xsd` pattern: `h{2}_(10|1)|m{2}_(10|1)|s{2}_(10|1)|((h{1,2}):m{1,2}:s{1,2}|(h{1,2}):m{1,2})|(h{1,2})|m{1,2}|s{1,2}`. Uppercase `HH` is not in it. Use `format="hh" hourFormat="24"` (the shipped `watchface.xml` already does this). `format="hh"` and `format="mm"` alone are legal.

### F4. "ALPHA_8 bitmaps count 1 byte/px" is not what the evaluator does; the ambient memory table is wrong (though still safe).
`DrawableResourceDetails.java`: `biggestFrameMemoryFootprint = maxWidth * maxHeight * 4`, halved only when `canUseRGB565` (quantisation error of fully opaque pixels < 0.5). There is **no ALPHA_8 detection anywhere** in the evaluator, and nothing in WFF XML lets you request an ALPHA_8 decode. `sky_ambient` is 418x418x4 = 699 KB, not 175 KB; `flange_ambient` is 922 KB, not 230 KB. Corrected totals are in section 4 — still far under 10 MB / 100 MB, so this is fatal to the *claim*, not to the face.

---

## 2. REQUIRED FIXES

**R1. Lift the dome body one stop so the terminator has something to modulate.** Ground: pole `#141C25`, r150 `#1C2630`, edge `#121A22` (3-4 % luminance). Glaze white 0.16 (not 0.11), centre (160,140) so it sits in open sky left of the date, not under the dragon. Terminator unchanged (0.46 at r196). Milky Way inside r110 x0.8, not x0.5.

**R2. Delete the central well, or cap it at 0.18 and make it a band (y190-258, x110-340, feather 24), not an rx126/ry86 ellipse that also darkens the date and telemetry.** Legibility is already guaranteed by 9 px glyph strokes of `#EFF8EC` over a <=4 % ground plus the star cap plus a real soft shadow (R4). Contrast stays above 15:1.

**R3. Make the flange read as metal.** +/-4 % brushing on `#1A1F22` is +/-1 level of 255 — invisible. Use circular (ring-direction) streaks `#141A1D`..`#2E373B` with 1-2 px period, a second specular lobe at 135 deg at 35 % of the main lobe (brushed metal always shows two opposing lobes), and make tick lit-edges a full 1 px `#3E474B` instead of 0.6 px `#4A555A` (0.64 px on device = anti-aliased grey smear).

**R4. Use the native text decorations instead of a second DigitalClock and a BitmapFont.** All three are "Introduced in Wear OS 4" (= WFF v1) and are children of `Font`, which the "Work with text" guide applies inside `TimeText`:
- Active digits: `<Font family="roboto_mono_semibold" size="78" weight="SEMI_BOLD" color="#ffEFF8EC"><Shadow color="#99000000" offsetX="2" offsetY="3" radius="4"/></Font>` — a real blurred shadow. The proposal's "no blur available; 2-3 px hard offset" is false and the hard offset would look like 1990s WordArt.
- AOD digits: `<Font ... color="#ff11200F"><Outline color="#ff91AD80" width="1.4"/></Font>` — the v4 outline look with zero glyph PNGs. Drop `mono_outline` (11 bitmaps, 144 KB, and "large bitmap fonts often use the most memory in ambient mode").
- Colon: `OutGlow color radius` if a phosphor bloom is wanted. Decoration `color` is transformable from v4.
Note: `Shadow`/`Outline` have no `Variant` child, so the shadow fades with the clock's alpha, not 80 ms later. The "digits lift off last" beat is lost unless a second DigitalClock with `Font color="#00000000"` + `Shadow` renders shadow-only — undocumented; test it, otherwise accept.

**R5. Fix the moon longitude expression; it does not produce the preview's 17 deg.** Evaluating the proposal's own `lamMoon = lam + 12.1907*age + 6.29*sin(...)` at D = 9793.5475 gives ~12 deg (lam 211.6 + 166.7 - 6.0). The true value is ~16.6 deg; the 17 deg in the preview comes from the studio's real ephemeris, not from the WFF formula. Replace with the mean longitude: `lamMoon = (218.316 + 13.176396*D + 6.289*sin(rad(134.963 + 13.064993*D)) + 720) % 360` -> 15.9 deg (error 0.7 deg), fewer terms, no `age` needed for position. Keep `[MOON_PHASE_TYPE]` for the sprite. And make the studio render the moon from the **same** formula as the XML (section 5).

**R6. Set `angleDirection` explicitly on every rotating Variant.** `variantElements.xsd`: `angleDirection` default `NONE`, documented as "No angular rotation". For flange `-6 -> 0` and the minute-arc group `-14 -> 0` write `angleDirection="CLOCKWISE"`, or the settle may snap.

**R7. `controls` syntax confirmed; keep it.** `controls` is `vector4fType` = `xs:list` of 4 floats, default `"0.5 0.5 0.5 0.5"`, so `controls="0.22 1 0.36 1"` is exactly right. `duration`/`startOffset` are normalised 0..1 and the doc says "if duration + startOffset > 1.0, startOffset is ignored" — every row of the wake table sums to <= 1.0 (shadow .61+.39, telemetry .67+.33); keep it that way after any retiming.

**R8. Fold `bed_aventurine` into `flange_active`.** The bed never moves (the proposal says so), the trench floor is 7 px wide, and after 0.30-0.72 black AO the flecks are 1 px dots at 4-14 % luminance. A separate 922 KB full-screen bitmap buys nothing you can see; paint the trench floor into the flange PNG and get the flecks up to 2 px `#F0CB8A` alpha .6-.9 if you want the sparkle.

**R9. Consider vectorising `dome_light`.** `Fill` and `Stroke` accept `LinearGradient`/`RadialGradient`/`SweepGradient` with transformable centre/radius. Glaze = circle with RadialGradient `#29ffffff -> #00ffffff`; terminator = circle at (262,262) RadialGradient `#00000000 -> #75000000`; Fresnel rim = stroked circle r192 thickness 8 with a SweepGradient peaking at 315 deg; trench AO = stroked circle r199.5 thickness 7 with RadialGradient positions tuned at 196/199.5/203; horizon haze = circle centre (225,78), stroke thickness 140 centred at r278, drawn under the flange so everything outside r208 inside the dome is hazed; hairline = stroked circle r208 thickness 1.2 `#478FA3B2`. Zero bitmap memory, and Risk 1 ("lighting too timid") becomes a number edit instead of a 1.3x re-bake. Trade-off: gradients on OLED are not dithered; the 0->0.16 white ramp over 150 px has ~40 levels, acceptable; if banding shows, bake only the glaze.

**R10. Exit choreography is not authorable.** One `Variant` per attribute per element; the doc only states "the transition between interactive and ambient states is animated" and gives the ambient->interactive direction in its example. The proposal's separate 180 ms Active->AOD order (light off first, then crossfades) cannot be expressed. Author the studio exit as the same `startOffset`/`duration` fractions played against the device's exit time, and say so in the design system.

**R11. Reduced motion: decide, don't hand-wave.** `Variant duration` is a fixed float; the only on-watch switch is a `BooleanConfiguration` wrapping two copies of every animated subtree (`BooleanOption id="TRUE"/"FALSE"`). That doubles the XML. Either ship it (memory is fine: the evaluator dedups resources by SHA-1 in ambient and sums across configurations in interactive) or drop it and state that reduced motion is studio-only. Do not describe it as free.

**R12. Precision verification plan (the proposal only names the risk).** Precision is undocumented; the function doc says the math functions wrap `java.lang.Math` (double parameters) but does not say the engine stores doubles. Even at float32, D ~ 9794 has an ulp of 2^-10 day = 84 s, so LST error <= 0.35 deg — invisible. Verify once: a debug `PartText` with `numberFormat("#.###", <LST expression>)` on device at three dates vs. the studio; also confirm `%` on negative floats keeps the dividend sign (Java remainder) so the `+720` guards are enough. Never use `[UTC_TIMESTAMP]` (1.7e12 ms) in float arithmetic.

**R13. Expression duplication for the moon: put the x/y Transforms on a parent Group and the 8 `Condition` branches inside it**, each `PartImage` at (0,0). One copy of the maths, not eight. Same for the true sun (one Group, one sprite).

**R14. Font file.** `weight="SEMI_BOLD"` (600) is a valid enum, but the runtime resolves `family` to `res/font/<name>`; bundle `roboto_mono_semibold.ttf` as the family rather than relying on weight synthesis from a regular file.

**R15. Battery colour without a duplicated subtree.** `Font color` is transformable in v4: `<Transform target="color" value="[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(239,248,236)"/>`. Same for the gauge `Fill`.

**R16. Layer order for the ambient evaluator (actual algorithm, not the proposal's guess).** `AmbientMemoryFootprintCalculator.java`: only `DigitalClock`, `AnalogClock` and `ComplicationSlot` split layers (a time-driven `Transform angle` on a `Part*` counts only under the legacy `supportOldStyleAnalogOrDigitalClock` flag). Memory = `screenW*screenH*numLayers*4 + max dynamic resources`. Put **every** static element (including the rotating sky, which the tool treats as static) before the DigitalClocks and nothing after them: 1 layer = 0.92 MB. Sprites and arcs do not split layers, so "put the digits, arc, seconds and sprites at the end" is wrong advice — only the clocks need to be last.

**R17. Star count sanity.** "Yale BSC to mag 4.0, dec > -30 => ~200 stars" undercounts. The whole-sky count to V <= 4.0 is about 500; dec > -30 covers (1 + sin 30)/2 = 75 % of the sphere, so expect ~350-400. Memory is unaffected (it is one baked PNG) but the disc will be busier than described, which makes R2's legibility reasoning matter more. Verify against the catalogue when baking.

---

## 3. KEEP (genuinely strong, verified)

- **The astronomy is correct and internally consistent.** I re-derived the preview state by hand: D = 9793.547 from `365*([YEAR]-2000) + floor(([YEAR]-1)/4) - 499 + [DAY_OF_YEAR] - 1.5 + ([SECONDS_IN_DAY] - 60*[TIMEZONE_OFFSET_MINUTES_DST])/86400` (leap-day term checks: 7 leap years 2000-2024; the negative-time case across a local year boundary still yields the right UTC instant). GMST 50.6 deg, LST 177.3-177.5 deg; sun lambda 211.6 (Scorpio), RA 209.5, dec -12.1, hour angle -32 deg => bead 32 deg clockwise of 12 = 2h08m before solar noon at 12:16 KST; moon age 13.7 d. Projection anchors (Polaris r1.2, Dubhe r46.1 at scale 1.633 px/deg) and the horizon circle (centre (225,78), r208 through W (78,225), N-point (225,286.4), E (372,225)) all check. Orientation S-12 / E-3 / W-9 / N-6 with anticlockwise rotation and clock angle = RA - LST is the correct looking-up chart. All data sources exist with the stated semantics: `SECONDS_IN_DAY` (0-86399), `DAY_OF_YEAR` (1-366), `YEAR` (clamped 1902-2100), `TIMEZONE_OFFSET_MINUTES_DST` (Integer, v3), `MOON_PHASE_POSITION` (0-28 d), `MOON_PHASE_TYPE` (0-7), `BATTERY_PERCENT`, `STEP_COUNT`.
- **Every expression function used exists:** `floor fract sin cos asin deg rad clamp numberFormat`, `%` with float operands ("floating-point remainder"), ternary. `rad()` around every trig argument is right (`java.lang.Math`).
- **Every transform target used is transformable:** PartImage/Group `x y width height pivotX pivotY angle alpha scaleX scaleY` (+ `tintColor` from v4); Arc `startAngle endAngle centerX centerY width height`; Rectangle `width`; Stroke `color thickness`; Fill `color`; Font `color`. `Variant` is accepted on Group, PartImage, DigitalClock, TimeText.
- **The one-light rule and the bake-everything-static discipline** are exactly how a WFF face has to be built; the proposal's own "derive edge masks by translating the official path, silhouette unchanged" keeps the brand constraint intact.
- **Plane fiction that an OLED can actually show:** the sun bead (9 px disc) riding in a 7 px trench, overlapping 1 px onto the dome rim and clipped 1 px by the flange, is a real occlusion cue and costs nothing. Keep. The dragon relief with baked shadow: keep.
- **Wake timing maths is valid WFF:** fractions of a device-controlled transition, every row sums <= 1.0, `CUBIC_BEZIER` + `controls="0.22 1 0.36 1"` is the documented syntax, `EASE_*`/`OVERSHOOT` exist. Only three things move (sky scale 3.5 %, flange 6 deg, arc 14 deg); HH:MM never moves — hard constraint met.
- **AOD budget:** stars m <= 3.0 at alpha 128, outline digits, thin dragon contour, one glint arc: ~5-6 % lit pixels against the 15 % App Quality limit; per-minute sidereal/solar stepping is allowed ("slow drift"); nothing static above ~40 % luminance and the bright items are thin. The `[MINUTE]`-driven +/-2 px walk is legal (Group `x`/`y` are integer-typed; the expression is integer).
- **Avoiding `blendMode`** is the right default; it exists from v3 (Wear OS 5.1) on PartImage/PartDraw/PartText and only from v5 on Group, so a MULTIPLY/SCREEN split of the lighting is an optional upgrade, not a dependency.
- **Target version is right.** `Reference`, ambient transitions and colour transforms are v4 = Wear OS 6; the Galaxy Watch6/6 Classic received One UI 8 Watch (Wear OS 6, firmware CYK2) in Korea in November 2025, so `com.google.wear.watchface.format.version = 4` is valid for SM-R965N once updated.

---

## 4. Memory budget, recomputed with the evaluator's actual rules

Rules (from source and doc): decompress, crop fully-transparent rows/columns, resize to fit the screen, 4 B/px, halved to 2 B/px only if RGB565 quantisation of opaque pixels has error < 0.5; no ALPHA_8 path. Device scale 480/450 = 1.0667; assets authored at device resolution.

| Asset | Device px | Bytes (as proposed) | After fixes |
|---|---|---|---|
| sky_active | 418x418 RGBA | 699 KB | 699 KB |
| sky_ambient | 418x418 (tinted, still RGBA) | 699 KB | 699 KB |
| bed_aventurine | 480x480 | 922 KB (461 KB only if it quantises to 565) | 0 (folded into flange, R8) |
| dome_light | 480x480 RGBA | 922 KB | 0 if vectorised (R9) |
| flange_active | 480x480 RGBA (annulus does not crop: bbox is full) | 922 KB | 922 KB |
| flange_ambient | 480x480 RGBA | 922 KB | 922 KB |
| dragon_relief / dragon_line | 171x132 each | 90 KB + 90 KB | same |
| sun_bead, sun_true, moon x8, moon_ambient | <= 19x19 | ~20 KB | same |
| mono_outline glyphs | 11 x 51x64 | 144 KB | 0 (Outline decoration, R4) |
| Roboto Mono TTF (unprocessed) + system-font estimate | | ~0.1-0.5 MB | same |
| **Interactive total** | | **~5.4-5.8 MB** (limit 100 MB) | **~3.4-3.8 MB** |
| **Ambient** = 480x480x4 x layers + dynamic resources | 1-3 layers | **0.9-2.9 MB** (limit 10 MB) | **~0.9 MB** with R16 |

Nothing here is close to a limit. The optional 1.5x sky (627 px source) would be counted at <= screen size by the evaluator; whether the runtime keeps the extra resolution for rotation sampling is undocumented — test before paying for it.

---

## 5. Does the studio (SVG in a browser) over-promise what the watch can do?

Yes, in these specific places; each must be closed in the design system before the WFF port:

1. **Live SVG filters/masks/gradients** (`celestial.js` today) must become either baked PNGs or the WFF vector gradients in R9. The studio must render **from the bake outputs**, not from live SVG, or the preview is a different image from the watch.
2. **Digit shadow.** The studio should use a 4 px blurred shadow at (+2,+3) — WFF `Shadow radius` — not a CSS filter with different falloff, and not the hard offset the proposal specified.
3. **Separate exit choreography** (R10): not expressible. Studio must mirror the wake fractions.
4. **Absolute 360 ms / 180 ms**: device-controlled; the studio's numbers are proportions only.
5. **`prefers-reduced-motion`**: no OS signal in WFF (R11).
6. **Sub-pixel detail**: 0.6-0.8 px strokes, 7-9 px text, 1 px trench dots render crisply in a browser at 2x DPR and as grey smears at 480 px; the studio should preview at exactly 480 px with no DPR upscale for sign-off.
7. **Ephemeris**: the studio computes a real moon; the watch computes the R5 approximation. Implement the XML formulas verbatim in `celestial.js` (same D, LST, lambda, RA, dec, lamMoon) so both agree to the degree.
8. **AOD tint**: a tinted bitmap is one colour; per-star spectral tints cannot survive into AOD (the proposal already restricts this — keep the studio honest about it).
9. **Text rasterisation**: browser vs Android Skia differ in hinting/weight; sign off glyph weight on device.
10. **Rotation resampling**: the browser rotates vectors; the watch rotates a bitmap with an undocumented filter. Keep the 1.4 px minimum star core and check the Cygnus/Cassiopeia region on device.

---

## 6. Answers to the four mandated questions, in one line each

- **Not expressible as PartImage/PartDraw/PartText + Transform + Variant:** shared Scene-level expressions (F1 -> inline or `Reference`); a separately-timed exit animation (R10); OS reduced-motion (R11); a Variant-timed shadow independent of its text (R4); per-pixel blur or lighting at runtime (bake or gradients only). Everything else in the layer table maps 1:1.
- **Memory:** ~5.6 MB interactive / <= 2.9 MB ambient as proposed, ~3.6 / 0.9 MB after fixes; the ALPHA_8 and RGB565 savings claimed are not how the evaluator works (F4).
- **Sidereal/sun/moon maths as expressions:** yes — functions, operators and data sources all exist and the numbers check; the moon formula needs R5; precision is undocumented but worst-case float32 error is 0.35 deg of LST (R12).
- **Studio over-promise:** yes, ten items in section 5; the biggest are live SVG material vs baked assets, the exit choreography, and the ephemeris mismatch.
