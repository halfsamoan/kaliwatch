# Critique 02 — proposal 01 "Celestial Vault" (legibility lens) reviewed for WFF v4 feasibility

Reviewer: Watch Face Format v4 engineer who has to ship this on a Galaxy Watch6 Classic (SM-R965N, 480 x 480, WFF scale 450 -> 480 = 1.0667) with no JavaScript.
Stance: adversarial. Every claim below that says "verified" was checked against developer.android.com/reference/wear-os/wff or the google/watchface XSD on GitHub during this review; everything else is marked as an assumption.

**Score: 6 / 10.** The architecture is the right one and most of it maps cleanly onto PartImage / PartDraw / PartText + Transform + Variant. It is not shippable as written: the star-chart placement formula is mirror-imaged (a real-astronomy constraint violation), the 24 h sun lip and the planisphere disagree by 180 degrees about where noon is, the sleep choreography and the "ring does not rotate on sleep" rule cannot be expressed in WFF, two XML details are schema-invalid or undefined (`controls` format, Transform + Variant on the same `alpha`), and the material palette is so dark that the four-level stack risks reading as "black disc with lines" on the wrist — which is exactly the complaint v5 exists to answer.

---

## 0. What was verified (sources)

| Claim in the proposal | Verified? | Where |
|---|---|---|
| Arithmetic operators `+ - * / %`, ternary `? :`, comparisons, logical ops | yes | reference/wear-os/wff/common/attributes/arithmetic-expression |
| Functions `sin cos tan asin acos atan rad deg clamp round floor ceil abs numberFormat`, all Version 1 | yes; trig is radians (java.lang.Math); `round()` returns Integer, the rest Float | same page |
| Float vs double evaluation | **not documented** — the page is silent; treat precision as float32 until measured | same page |
| `[DAY_OF_YEAR]` 1–366, `[HOUR_0_23_MINUTE]` float 0.0–23 59/60, `[MINUTE]`, `[SECOND]`, `[SECOND_Z]`, `[UTC_TIMESTAMP]` ms int, `[SECONDS_SINCE_EPOCH]` (Version 3), `[DAY_Z]`, `[MONTH]`, `[MONTH_S]`, `[DAY_OF_WEEK]` (1 = Sunday), `[DAY_OF_WEEK_S]`, `[YEAR]` (clamped 1902–2100), `[BATTERY_PERCENT]`, `[STEP_COUNT]`, `[STEP_GOAL]` | yes | reference/wear-os/wff/common/attributes/source-type |
| `[MOON_PHASE_POSITION]` | yes — **integer** "number of days that have started since the most recent new moon", 0–28 inclusive | same |
| `[MOON_PHASE_TYPE]` 0–7 (0 new, 2 first quarter, 4 full, 6 last quarter) | yes | same |
| `[TIMEZONE_OFFSET]` | exists but is a **String** (-12..+14); not safe in arithmetic without testing | same |
| any "is ambient", sunrise/sunset or location source | **none exist** | same |
| Variant: `mode="AMBIENT"`, `target`, `value`, `duration` 0–1, `startOffset` 0–1 (ignored if sum > 1), `interpolation` LINEAR / EASE_IN / EASE_OUT / EASE_IN_OUT / OVERSHOOT / CUBIC_BEZIER, `controls`, `angleDirection` NONE / CLOCKWISE / COUNTER_CLOCKWISE | yes | reference/wear-os/wff/common/variant/variant and documents/4/common/variant/variantElements.xsd |
| `controls="0.22,1,0.36,1"` | **schema-invalid**: `controls` is `vector4fType` = `xs:list` of 4 floats, whitespace separated (`"0.22 1 0.36 1"`) | documents/1/common/attributes/primitiveListTypes.xsd, v4 variantElements.xsd default `"0.5 0.5 0.5 0.5"` |
| Transform: `target`, `value` (expression), `mode` TO / BY; per-element transformable sets | yes | reference/wear-os/wff/common/transform/transform |
| Group / PartImage / PartText transformable: x, y, width, height, pivotX, pivotY, angle, alpha, scaleX, scaleY, tintColor (v4) | yes | element pages |
| Negative `x` / `y` on a Group or PartImage | **schema-valid**: `dimensionType` is `xs:integer` with no facets. Runtime clipping to the 450 circle is implied by `clipShape="CIRCLE"`, not documented — must be seen on device | documents/1/common/attributes/dimensionType.xsd |
| `angle="-14"` and Arc angles < 0 or > 360 | **schema-valid**: `angleType` is a union of (0,180,360) and unbounded `xs:float`. Runtime sweep semantics for `endAngle > 360` are **undocumented** | angleType.xsd, documents/4/.../arcElement.xsd + angleAttributes.xsd |
| Arc children: Stroke or WeightedStroke, Transform (unbounded), Reference; `startAngle` / `endAngle` / centre / size transformable | yes | reference arc page + arcElement.xsd |
| DigitalClock children | Localization (0–1), **Variant (0–n)**, TimeText (1–n). **No Transform child** | documents/1/clock/digitalClock.xsd |
| TimeText: `format="hh"` / `"mm"`, `hourFormat="24"`, `align`, child `Font` **or** `BitmapFont`, child `Variant` | yes | reference/wear-os/wff/clock/time-text |
| Font: `letterSpacing` (em units), `weight` SEMI_BOLD = 600, children `Outline` (color required, width float default 2.0), `Upper`, `Lower`, `Shadow`, `OutGlow`, `Template`; color transformable from v4 | yes | reference font page + decoration/outline |
| Memory: ambient 10 MB, interactive 100 MB; cost = 4 x w x h RGBA (2 x for RGB565, 1 x ALPHA_8) after decompress / crop-transparent / resize; evaluator sums "all images that are active" per mode and "only takes into account user settings and variants" | yes | training/wearables/wff/memory-usage + play-validations README |
| Ambient re-render cadence | platform guidance only: ambient updates "as infrequent as once per minute"; no WFF-specific statement found. Design to one update per minute | training/wearables/always-on |
| Galaxy Watch6 Classic 47 mm = 480 x 480 | prior knowledge, not re-verified | — |

---

## 1. Which parts cannot be expressed in WFF v4 (PartImage / PartDraw / PartText + Transform + Variant)

Expressible, no change needed: the rotating vault (PartImage + angle Transform, pivot 0.5/0.5), haze, well fill and bevel bitmaps, bridge bitmaps with alpha Variants, date via `Template`, HH:MM as two `TimeText`s + a PartText colon, `SEC %s` from `[SECOND_Z]`, the stepped seconds Arc (`Transform target="endAngle" value="6*[SECOND]"`), the marker Group with `angle = 6*[SECOND]`, the sun / moon Groups rotating about the centre, moon sprite selection with `Condition` on `[MOON_PHASE_TYPE]` (the existing watchface.xml already uses the `Condition / Expressions / Compare / Default` pattern), gauges as `Rectangle` + `Transform target="width"`, the battery warning colour via `Condition`, the drift Group with `round(2*cos(rad(6*[MINUTE])))`, the wake stagger via per-element `startOffset` / `duration`, CUBIC_BEZIER easing with `controls`.

Not expressible, or expressed wrongly:

1. **Asymmetric sleep choreography (sec. 4 "Sleep, Active -> AOD, 180 ms, top layer first").** One Variant per attribute describes both directions. The doc's only timing example is phrased for ambient-to-interactive; the interactive-to-ambient order is undocumented and not separately controllable. The total duration is "the full extent allowed by the device", not 360 ms or 180 ms. Conclusion: the sleep sequence will be whatever the runtime makes of the same Variants, almost certainly the wake curve reversed. The spec must say so instead of promising a different order.
2. **"Ring crossfades to the segmented arcs, no rotation" on sleep.** Impossible: a `Variant target="angle" value="-14"` rotates the ring Group on sleep as well as on wake.
3. **Sleeping ring inside the rotating ring Group.** In ambient the Group sits at -14 degrees permanently, so `ring_ambient.png` (4 arcs from 12 / 102 / 192 / 282 degrees, 12 ticks) is drawn 14 degrees off 12 o'clock for the whole night. The studio v4 never rotates the sleeping orbit. Move the ambient ring outside the rotating Group (and make it PartDraw arcs + lines, cost 0 bytes, as in face.js).
4. **`Transform target="alpha"` (daylight dimming) and `Variant mode="AMBIENT" target="alpha" value="0"` on the same `vault_active` PartImage.** Two writers for one attribute; resolution order is undocumented. Put the Variant on a wrapper Group and the Transform on the PartImage.
5. **`controls="0.22,1,0.36,1"`** fails XSD validation (whitespace list). Write `controls="0.22 1 0.36 1"`.
6. **Date colour tween `#7F9472 -> #9BAB9C`.** `Font color` is transformable in v4 but `Variant` is not a child of `Font`; the colour change is only possible as a crossfade of two PartTexts (fine, say so).
7. **Reduced-motion = instant.** Wear OS exposes no reduce-motion flag to a watch face. Drop the clause from the WFF spec; keep it in the studio.
8. **Ambient BitmapFont "11 glyph PNGs 94 x 60".** Unnecessary and mis-sized. Roboto Mono at 78 px has a 0.6 em advance = ~47 px per digit; 94 is the two-digit box. More important: `Font` supports `<Outline color="#ff91AD80" width="1.4"/>`, so the ambient clock is a second `DigitalClock` with `Font color="#ff11200F"` + Outline — no bitmap font, no glyph-metric matching, no 136 KB.
9. **Uppercase month / weekday via 12 + 7 `Condition` blocks.** Unnecessary: `<Font><Upper><Template>…</Template></Upper></Font>` with `[MONTH_S]` and `[DAY_OF_WEEK_S]` yields `25 OCT / SUN`.
10. **`SEC 24`, trail and marker driven by `[SECOND]`** — correct and deliberate; any Transform referencing `[SECOND_MILLISECOND]` anywhere in the file would raise the interactive frame rate for the whole face. Keep the audit rule "no millisecond sources".
11. **Transform on the clock itself** is not allowed (`DigitalClock` has no Transform child). The proposal only transforms the enclosing drift Group, which is fine, but any future "shift the digits" idea must go through a Group.

---

## 2. Memory budget

Design-scale RGBA, 4 bytes per pixel, as the evaluator counts (it crops transparent margins and may resize, so these are upper bounds):

| Bitmap | px | MB |
|---|---|---|
| vault_active 588 x 588 | 345 744 | 1.38 |
| vault_ambient 588 x 588 (24 stars spread over the disc, so cropping does not help) | 345 744 | 1.38 (0.35 if ALPHA_8 + tintColor) |
| haze 450 x 450 (needs alpha, so RGBA) | 202 500 | 0.81 |
| well_fill + well_bevel, bbox 328 x 106 each | 2 x 34 768 | 0.28 |
| bridge_active + bridge_ambient 362 x 128 | 2 x 46 336 | 0.37 |
| ring_active 450 x 450 | 202 500 | 0.81 |
| ring_ambient 450 x 450 | 202 500 | 0.81 (0 if PartDraw) |
| dragon_active + dragon_ambient 150 x 112 | 2 x 16 800 | 0.13 |
| sun 16 x 16, moon 8 x 18 x 18 | 2 848 | 0.01 |
| Roboto Mono TTF (regular + bold, "unprocessed size") | — | ~0.2 |
| BitmapFont 11 x 50 x 62 (if kept) | 34 100 | 0.14 |
| **Interactive total** | | **~6.3 MB** (7.2 MB if the evaluator rescales to 480) — far under 100 MB |

Ambient. The README rule is "sum of all images that are active" with Variants applied: vault_ambient 1.38 + well_fill 0.14 + bridge_ambient 0.19 + ring_ambient 0.81 + dragon_ambient 0.07 + sprites 0.01 + fonts 0.2 = **~2.8 MB**. The training page's model adds up to three full-screen layers (3 x 0.81 = 2.4 MB) and, if the tool charges a rotating image on its rotation bounding box (832 x 832 = 2.77 MB), the worst case is **~6.8 MB**. Under 10 MB in every model, but the margin is 3 MB, not 6.5 MB as the proposal implies, and the proposal's own arithmetic ("ambient set ~3.5 MB") is a sum of ambient-visible bitmaps, which is not how the tool works. Run `memory-footprint.jar --schema-version 4 --ambient-limit-mb 10 --active-limit-mb 100` on the real APK before any number is quoted.

Cheap wins that also fix bugs: ambient ring as PartDraw (-0.81 MB), ambient vault as 24 `PartDraw` Ellipses inside a rotating 588 x 588 Group (-1.38 MB, and the stars can be 2 px instead of 1.2 px), BitmapFont dropped (-0.14 MB). That takes ambient to ~1.1 MB and makes the whole ambient set vector except the bridge, well, dragon and sprites.

Not a memory issue but a power issue: in Active the 588 px rotated bitmap is re-composited every second because `[SECOND]` is in the file. Bilinear resampling of a 1.4 MB bitmap at 1 Hz on an Exynos W930 is fine; at 60 Hz (if anyone adds a millisecond source) it is not.

---

## 3. Does the sidereal / sun / moon maths survive as expressions?

Yes, with two corrections.

**Sidereal constant.** 227.64 is right for 2026 (GMST 100.66 at 2026-01-01 00:00 UT + 126.98). The `[UTC_TIMESTAMP]` form multiplies a ~1.8 x 10^12 ms value; if the evaluator is float32 (undocumented), the ulp at that magnitude is ~131 s, i.e. ~0.5 degrees of jitter that changes every minute — visible as a 2 px shiver at r 230. Neither form is needed. Use `[YEAR]` and keep every intermediate small (verified numerically: gives 177.42 degrees at 2026-10-25 10:08 KST, matching Appendix B):

```
-((280.46062
   + 0.98564737*(365*([YEAR]-2000) + floor(([YEAR]-1)/4) - 499 + [DAY_OF_YEAR] - 1)
   + 360.98564737*(([HOUR_0_23_MINUTE]-9)/24 - 0.5)
   + 126.98) % 360)
```

Largest intermediate ~9.9 x 10^3, float32 ulp 0.001 degrees; valid 2001–2099 (floor((Y-1)/4) - 499 counts leap days since 2000); `%` on a positive float is Java remainder, fine. The hard-coded 9 is KST; `[TIMEZONE_OFFSET]` is a String and must not be relied on without a device test.

**Sun pointer and day arc.** `15*[HOUR_0_23_MINUTE]+180` and `15*(6.08 + 1.30*cos(rad(([DAY_OF_YEAR]-172)*0.9856)))` are correct (14 h 46 m on 21 Jun, 9 h 34 m on 21 Dec for Seoul). The start/end angles 257 / 479 validate (angleType is unbounded) but `endAngle > 360` sweep behaviour is undocumented; keep the fallback (start in range, sweep = end - start) and test both.

**Daylight dimming as a 30-minute lerp instead of a step** (all Version 1 functions):

```
d    = abs(((15*[HOUR_0_23_MINUTE]+180 - 7.95 + 540) % 360) - 180)      // degrees from solar noon
half = 15*(6.08 + 1.30*cos(rad(([DAY_OF_YEAR]-172)*0.9856)))
alpha = round(150 + 105*clamp((d-half)/7.5, 0, 1))                       // 7.5 deg = 30 min
```

**Moon.** `[MOON_PHASE_POSITION]` is an integer day count 0–28, so `12.19*[MOON_PHASE_POSITION]` steps 12 degrees once a day — acceptable, but write it down; it is not a smooth lunar hand.

**z1b sun on the ecliptic.** `asin(sin(rad(23.44))*sin(L))`, `atan(tan(L)*cos(rad(23.44)))` + quadrant ternary are expressible; placing it as a Group inside the rotating vault Group with its own `x`/`y` Transforms is expressible. Horizon visibility needs the altitude sign: `sin(alt) = sin(phi) sin(dec) + cos(phi) cos(dec) cos(HA)`, with `HA = LST - RA` — all available. Fine for stage 2.

**The star chart itself is mirror-imaged (Appendix A).** With the pole at (225,47), the dial bottom is the south horizon, the top is the north horizon, i.e. the sky seen from below lying head-north: east is on the LEFT. A star with RA = LST + 1 h (east of the meridian, culminating in an hour) must sit left of straight-down. Appendix A's `x = 225 + r sin(RA*15)` puts RA = 1 h at x > 225, on the right. The prose two lines later ("RA increasing clockwise from the downward direction") is correct; the formula contradicts it. As written the Dipper, Cassiopeia and Orion are all drawn as their mirror images and the counter-clockwise rotation then moves stars from west to east. Fix: `x = 225 - r sin(RA*15 deg)`, `y = 47 + r cos(RA*15 deg)`, and add a studio assertion: at Orion's culmination Betelgeuse.x < Bellatrix.x and Rigel.x > Saiph.x.

**Lip and vault disagree about where noon is.** The lip puts noon at 12 o'clock (top) and midnight at 6 o'clock; the vault puts the south meridian — where the sun is at noon — at the bottom, and the north horizon under the dragon. So at noon the gold sun rides over the dragon while the real sun's place in the sky is at the bottom of the dial; the sunrise point on the lip is at upper-left at 282 degrees while the vault's east horizon is lower-left. The moment z1b is added there are two suns on opposite sides of the dial. Decide once: put midnight at 12 o'clock (`angle = 15*[HOUR_0_23_MINUTE]`, day arc centred at 187.95), so lip and vault share east = left, south = bottom. This costs nothing and makes the sun pass through the well's sector at midday on the lip (r 217, outside the well, still visible).

---

## 4. Does the studio renderer over-promise?

Yes, in five specific ways.

1. **Sub-pixel vector detail.** 0.8 px constellation lines at 22 percent, 0.7 px dashed ecliptic at 18 percent, 1.1 px mag-2.5 stars at 80 percent, 1 px ticks `#34543C` on `#0E1A1F`. The SVG draws these crisp at every rotation angle. On the watch they are bitmap pixels, bilinearly resampled at a sub-degree rotation (the vault angle is never a multiple of 90) and then upscaled 1.0667: a 1.1 px star becomes a 2 x 2 blob at ~35 percent of its intensity; a 0.8 px 22 percent line disappears. Minimum bakeable sizes: star cores 2.0 px, lines 1.4 px at >= 35 percent, ticks 1.4 px with 3x the chroma contrast, or they do not exist.
2. **Minute-by-minute shimmer.** Rotating a bitmap of 2 px dots by 0.25 degrees per minute makes each dot's brightness oscillate as it crosses pixel boundaries — a slow "twinkle" the brief forbids. It is invisible at 2 px+ cores and ugly at 1.1 px. Same fix.
3. **Timing.** 360 ms / 180 ms, per-layer millisecond windows, asymmetric order — none of that exists in WFF; only fractions of a device-chosen transition, symmetric by default. The studio must show the fractional model (and the reversed sleep) or it is lying about the watch.
4. **Colour and shadow transitions.** The studio animates `color`, `fill-opacity`, `stroke-opacity`; WFF animates `alpha` of whole elements. "Shadow rises with the bridge" is a crossfade between two PNGs, not a growing shadow. Same result at 360 ms, but the studio should implement it as a crossfade so the preview is honest.
5. **Masks and clips.** The well's segment-plus-sector cut-out, the bridge's 94-percent glass margins and the dragon's negative space are SVG masks in the studio and must be exported as PNG alpha. Fine, but the studio needs an export path that rasterises each z-layer separately at 450 (and 588 for the vault) so the WFF port uses the same pixels the user approved.

---

## 5. FATAL (would make the user say "still flat", breaks a hard constraint, or cannot be built as written)

1. **Value range of the material layers is 2–5 percent luminance.** Bridge `#070B09`, enamel `#0E1A1F`, ring body `#101C14 -> #07100B`, haze glow `#14262B` at 40 percent. On an OLED at wrist brightness, the eye cannot separate 2 percent from 4 percent; the stack will be carried entirely by four 1 px rims and one baked shadow. JLC's dial reads deep because its levels differ by whole stops (gold / opaline / black / white). As specified, v5 risks collapsing into "black disc + green lines + a few grey dots" — the v4 complaint. Required: give each level a distinct value band (void 0 percent, sky base 2 percent with Milky Way to 8 percent, bridge glass 6–7 percent with a 14 percent top highlight, ring chamfer 10 -> 3 percent, well floor 0 percent) and prove it with a luminance histogram of the studio render downscaled to 40 mm before any WFF work starts.
2. **Mirror-imaged sky (Appendix A sign error).** Violates "real astronomy" if built as written; one-character fix plus a handedness test (section 3).
3. **Lip / vault orientation conflict.** Two incompatible frames for the same sun on one dial; must be resolved before the lip is drawn (section 3).
4. **Sleep choreography and "no rotation on sleep" are unbuildable.** Not a visual disaster, but the motion spec promises something the watch will not do; the spec must be rewritten as symmetric fractions (section 1).

---

## 6. Required FIXES (concrete)

1. Appendix A: `x = 225 - r sin(RA*15)`; add the Orion handedness assertion to the studio tests.
2. Lip: midnight at 12 o'clock, `angle = 15*[HOUR_0_23_MINUTE]`, day arc centred at 187.95; moon `15*[HOUR_0_23_MINUTE] - 12.19*[MOON_PHASE_POSITION]`.
3. Sidereal expression: the `[YEAR]`-based form above; delete the `227.64` and `[UTC_TIMESTAMP]` forms.
4. `controls="0.22 1 0.36 1"` (whitespace list) everywhere.
5. Vault: `Group vault_wrap` carries `Variant AMBIENT alpha 0`; the inner PartImage carries the angle Transform and the daylight-alpha Transform (lerp form above).
6. Ambient ring: PartDraw arcs (4 x 48 degrees at r 192, 1.25 px `#4D633F`) + 12 Lines, placed outside the rotating ring Group, with `alpha 0` + `Variant AMBIENT alpha 255`. Ambient vault: 24 PartDraw Ellipses r 1.0 (2 px) `#8CA6B5` in a rotating Group, no bitmap.
7. Ambient digits: second `DigitalClock` with `Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff11200F"` + `<Outline color="#ff91AD80" width="1.4"/>`, crossfaded with the active clock by Variants on the two DigitalClocks. Delete the BitmapFont.
8. Date: `<Upper><Template>%s %s / %s</Template></Upper>` with `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]`; `letterSpacing="0.1"` (em) for the 1.5 px tracking at 15 px.
9. Motion spec: replace the ms tables with fractions (`startOffset` / `duration`) and state that sleep is the reversed wake; drop "reduced motion" from the WFF section.
10. Drift Group: the full-bleed ring PNG inside it exposes a 2 px black crescent at the dial edge in Active (the proposal's "invisible in Active" is false for anything that touches r 225). Either keep z7 / z9 out of the drift Group or give ring_active.png a 3 px bleed beyond r 225.
11. Bridge crowding: date baseline 191 is 5 px above the digit tops at 196; SEC at 272 is 6 px above the bridge edge. Delete the `SEC 24` line (the probe already shows seconds), move the date to baseline 184, keep digits at 252. Legibility of HH:MM is otherwise excellent (78 px, opaque core, 17:1).
12. Bake sizes: star cores >= 2.0 px, lines >= 1.4 px at >= 35 percent, Milky Way at >= 8 percent peak; otherwise they vanish at 1.0667x after rotation resampling.
13. Light consistency: the dragon shadow offset (0, 2) does not match the bridge's (+2, +4) 10:30 light; use (+2, +3). The proposal itself says one wrong gradient collapses the stack — enforce it in the bake script.
14. Dragon over the ring: the frame top (y 14) sits inside the ring band (r 176–211 at the top), so the 12 o'clock ticks, the trail start and the seconds marker (r 192) pass behind the dragon's wings for ~8 s each minute. Decide explicitly: keep it as an occlusion cue (recommended) but make sure the 5 px marker tick is drawn fully behind, not half-clipped by the dragon's glow PNG.
15. Lip radius vs. the Watch6 Classic bezel: the sun at r 217.5 and moon at r 215 are 7–10 px from the glass edge; the rotating bezel's inner lip may hide them. Verify on the device; fallback radius 205 for both.
16. Run the WFF validator (`documents/4`) and the memory-footprint tool on the real APK; quote their numbers, not the estimates above.

---

## 7. KEEP (genuinely strong)

- The four-level model with one clock per level (seconds on the ring, civil time on the bridge, solar day and lunar month on the lip, sidereal day in the vault). This is the correct reading of why the Galaxia reads deep, and it is the first proposal that gives the sky an actual job.
- Pole under the dragon at (225, 47), horizon = dial edge, stereographic scale 137.2 so that the horizon circle is exactly r 225 about (225, 225): the geometry checks out (zenith at y 115, equator r 137, chart radius 294 = dec -40, ecliptic circle r 150 offset 60 toward RA 18 h — all recomputed and correct).
- HH:MM unchanged on an opaque bridge core: the only proposal where no star can ever touch a numeral; 17:1 contrast, nothing in the digit box moves.
- The 18 px sky strip (y 278–296) between the bridge shadow and the well bevel: the single best depth cue in the design, and cheap.
- Seconds stepped at 1 Hz via `[SECOND]`, no millisecond sources anywhere.
- Ambient: minute-or-slower sources only; 2 px drift circle once an hour; nothing above 42 percent luminance static; lit estimate ~7–9 percent — all consistent with the brief's 15 percent and burn-in rules.
- Palette discipline: gold only on the slow bright object, grisaille only on sky, phosphor never on sky material.
- The sidereal / solar / lunar maths is correct in substance (Appendix B re-derived: LST 177.4 degrees at 2026-10-25 10:08 KST agrees with an independent sun-RA check within 2 minutes).
- Risk list in section 7 of the proposal is honest; most of my fixes are sharpenings of risks it already names.
