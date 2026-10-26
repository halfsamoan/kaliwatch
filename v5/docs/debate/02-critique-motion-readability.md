# Critique 02 — v5 "Celestial Vault" (motion proposal), lens: readability / AOD / burn-in / battery

Reviewer stance: adversarial Wear OS reviewer. Design space 450x450, C=(225,225). Target SM-R965N, 480x480 on a 37.3 mm panel: 12.06 device px per mm, so **1 design px = 0.083 mm**; 9 px text = 0.75 mm, 11 px = 0.91 mm, 13 px = 1.08 mm, a 10 px moon = 0.83 mm, a 1 px ring = 0.08 mm. Luminance below = mean(R,G,B)/255, which is exactly the WO-P7 metric.

**Score: 5 / 10.** The architecture (well / flange / rim pointers / plate) and the astronomy engine are the best this project has produced and must be kept. But the proposal specifies its depth in tones an OLED cannot show, pins the only recognisable sky under the digits, sells sub-acuity glyphs as time-scales, and mis-states how WFF Variants behave in AOD. Built as written, at arm's length it is v4 with a thin dark ring, two more phosphor arcs and two dots: the user will say "still flat".

---

## Answers to the mandatory questions

### 1. Can HH:MM be read in under one second at 40 mm with that sky behind it?

**Yes, legibility survives; the proposal's own protection claim does not.**

- 78 px Roboto Mono 600 in #EFF8EC (lum 0.945) is read by glyph mass. Behind the digit box (x120–330, y190–262, 15,120 px² of the well) there are at any instant about **41 stars** (density 330 stars / 120,692 px² of well), ~11 of them with cores of 1.2–2.6 px, plus the 0.8 px ecliptic and a Milky Way wash at effective (17,36,32). None of that breaks a 78 px glyph; a 2.6 px star touching a stroke deforms the edge by ~3 % of cap height. Recognition in <1 s holds.
- The claim "attenuated to 42 % by the plate" is false for most of the box. The plate is a radial fade (0.58 at (225,215) → 0 at the ellipse rx150/ry75). Computed alpha: (225,225) 0.50; (166,252) 0.21; (140,252) 0.14; **(120,252) 0.08; (330,252) 0.08**; (120,197) 0.15. The outer "1" and "8" sit over 85–92 % sky. A V0 star (lum 0.843) under the "1" reaches ~0.76 against a 0.945 stroke: not a readability failure, but a visibly dirty glyph edge, and the 6 px halos (16 of them) and the four red giants in #E9B869 at 80 % — the same hue the proposal assigns to the low-battery warning — are not excluded from the box.
- Required: a uniform ≥70 % plate over the whole digit box with a soft edge (see Fix 4), halos and gold stars kept out of the box, and the digit shadow done with WFF's native text `Shadow` rather than a second TimeText.

### 2. Is any text under ~11 px treated as information?

**Yes, twice, and the moon phase is a third case.**

- The 9 px flange numerals "00 / 06 / 18" are the scale the sun pointer is read against; the proposal counts "24-h solar" as one of its seven time-scales. 9 px = 0.75 mm: decoration by the brief's own rule, so the 24-h scale is not readable.
- The 11 px zodiac glyphs on the vault are the scale for "zodiac month … exact by construction". 11 px = 0.91 mm, drawn in #3C5C46 (lum 0.29) on a rotating bitmap, half of them under the plate or the ground at any time: unreadable. The zodiac exists only in the 13 px readout.
- The moon is r 5 (10 px = 0.83 mm) with eight 12x12 phase bitmaps: the phase cannot be read; only the position can.
- Net: of the "seven real time-scales", four are readable at arm's length (second dot, minute arc, HH:MM, the sun's coarse 24-h position). Sidereal, zodiac and lunar phase are ambience. The brief allows ambience; it does not allow counting it as information.
- 13 px readout (`LST 11:50  SUN SCO  MOON 15D`, 28 chars = 218 px, the widest text on the face) is above the floor and is correctly non-essential.

### 3. AOD under 15 % lit with no per-second motion?

**Yes, with large margin — but the proposal's arithmetic is fiction and must be replaced by a measurement.**

- The governing metric is WO-P7 (Wear app quality guidelines): "illuminates no more than 15 % of pixels … calculated as the average value across the watch face, with a fully-opaque white pixel having a value of 100 % and a black pixel 0 %. RGB colors are interpolated linearly", checked every ~10 min across a day. Samsung's WFS OPR warning is also 15 %. The brief's "lit pixels" is a stricter proxy.
- I measured v4's own ambient export (`assets/kali-orbit-ambient-900.png`, 900 px, direct, no resampling): **non-zero RGB 7.18 % of the dial; WO-P7-style mean 1.77 %.** (The QA's 11.3 % came from 900→450 resampling, which fattens every anti-aliased edge.) Digit region: 6,094 px² lit (450-space), mean lum 0.217. Dragon frame region: 2,022 px² lit including stars/rings in the frame; the dragon colour bucket is ~1,026 px². **The dragon silhouette is ~1,000–2,000 px², not the 8,100 px² the proposal books** (the official logomark is line art: ~7 % ink in its 22,140 px² frame). The digits are under-counted (5,500 vs ~6,100 measured).
- v5 AOD inventory vs v4: +24 stars (54) +ticks/meridian (216) +two rings (60) +steps value (~400) +prompt prefix (~350) −four arc segments (−1,258 measured) −BAT line (~280) ≈ net −450 px². Expect **≈7 % non-zero, ≈1.8 % WO-P7**. Passes either way.
- Per-second motion in AOD: none (seconds, trail, minute rim all alpha 0; vault/sun/moon are expression rotations evaluated at the once-per-minute ambient update, 0.25°/min). Correct.
- Required: replace §5's hand sums with a raster measurement of the baked assets using WO-P7's formula, sampled across a day (readout, date, ring positions change).

### 4. Burn-in from static bright rings?

**The rings are not the risk; the static text and the edge ticks are.**

- Sun ring #8C6E3F and moon ring #6B7A70 are 1 px (0.08 mm), lum 0.35–0.45, and migrate ~0.8 px/min. Harmless.
- Static in AOD, every day: dragon outline #4F6E48 (0.34), prompt line `kali@vault:~$ INFINITY` #3E5A46/#6E8E63 (0.32/0.46) at fixed pixels 24/7, date #7F9472 (0.51) for 24 h, outline digits #91AD80 (0.58) with the hour-tens digit static for 10 h/day. The digit scheme is inherited from v4 and the user approved it; the prompt prefix and the steps value are **new static ink the AOD did not have in v4**.
- The AOD flange ticks and meridian sit at r 209–221, i.e. **4–16 px from the dial edge**. Samsung's AOD periodically shifts the image to counter retention (Samsung support: "intended operation to prevent screen burn-in"; developer-forum reports of the AOD shifting "in a random direction") and Google's old burn-in guidance is ≥10 px edge clearance. Ticks at r 221 will be clipped by the shift.
- No white, nothing above 0.58, nothing large and filled: the proposal's burn-in reasoning is otherwise sound. Required: Fix 9.

### 5. Anything that loops or twinkles?

- Intentional loops: none. Minute rim and seconds trail reset (60 min / 60 s); the colon does not blink; no cursor. The 180 ms eased seconds step is a per-second animation, allowed in Active, off in AOD. Good.
- **Unintended twinkle: the AOD stars.** 1.5 px cores on a 400 px bitmap rotated by an arbitrary angle are bilinear-resampled; a sub-2 px dot's peak varies by tens of percent as it crosses pixel centres. In Active that is a smooth crawl; in AOD it is a **once-per-minute re-sample of 24 stars**, i.e. a slow sparkle. R2 names it; the mitigation (1.2 px core) does not remove it. Required: Fix 9.

---

## FATAL (would make the user say "still flat", breaks a constraint, or breaks the build)

**F1. The depth is specified in tones an OLED cannot display.** Every occlusion cue in §1 lands on a near-black receiver:
- Well shadow: 75 % black over the vault base #0A1512 → (2,5,4); over the Milky Way wash (effective (17,36,32)) → (4,9,8). In display-linear terms (gamma 2.2) 36/255 is 1.3 % of peak, 10/255 is 0.08 %, 5/255 is 0.02 %: all below what a watch panel shows in daylight. The "well" is black-on-black.
- Dragon drop shadow (black 60 %, +2,+4) falls on #050A08: invisible. Digit shadow on a black plate: invisible.
- Flange "top-lit brushed alloy" #1B2A20 → #070B09 is lum 0.13 → 0.035: a dark band; the raised-ring reading hangs on a single 1 px (0.08 mm) rim light at 0.34.
- Dragon "cast alloy" gradient + rim light + shadow on line art 2–4 px wide (measured ~7 % ink): a 3-tone gradient across a 3 px line is not perceivable.
The brief's hard requirement is "material shading (chiaroscuro, rim light, occlusion) so the eye reads a stack". Galaxia reads as deep because its receiving surfaces (opaline, gold, grey enamel) are mid-tone; a shadow is a darkening of something visible. R1 admits the risk and proposes "verify on device" — that is not a mitigation for arithmetic. Built as written, the result is a black print with a thin green rim.

**F2. The only sky a Seoul user recognises is permanently under the digits.** Pinning Polaris behind the colon puts the whole circumpolar cap (dec > +50°: Big Dipper r 46–65 px, Cassiopeia r 44–56, Cepheus, Draco's head) inside the digit/plate radius (r ≤ 115) at every hour of every night. Computed from the proposal's geometry: ground lens 42.0 % of the well, dragon frame 16.5 %, plate >30 % 6.8 %, digit box 12.5 %, well-shadow annulus — **unobstructed sky = 25.8 % of the well (31,118 px²)**, of which ~9,600 px² each in the two side sectors (45–90°, 270–315°) and ~3,600 px² each in the two top sectors; the bottom four sectors have ~1,000–1,300 px² each. "Over ten minutes the Big Dipper visibly shifts 2.5° around the colon" cannot happen: it is under the plate at 50–92 % attenuation. The sidereal vault is texture seen through two keyholes, not a map. That is acceptable only if the proposal stops claiming otherwise and designs the two windows deliberately (and note the irony: v4's cut-off planet was already a "keyhole").

**F3. WFF Variant semantics break "nothing moves between modes".** A `Variant` value *is* the ambient rest state; the wake animates from it to the interactive value, and the sleep animates back with the same `duration`/`startOffset`. So as specified: the AOD sky sits at VAULT_ANGLE + 4° (16 sidereal minutes wrong, while the sun/moon rings are at the true angle, so the "exact by construction" alignment is broken in AOD); the AOD dragon rests at 0.96×; and Active→AOD replays the +4° / 0.96 / −14° spatial motion that §4.4 promises not to have. Buildable, but not "the same face dimmed". Spatial Variants must live only on active-only copies (Fix 3).

**F4 (build).** `subText("ARITAU…", floor(LAMBDA/30)*3, 3)` is wrong: WFF `subText(text, start, end)` takes an **exclusive end index**, not a length (docs: `subText("abc def", 2, 5)` → `c d`). For every sign after TAU the range is inverted; the SIGN readout is empty or garbage.

---

## REQUIRED FIXES (concrete)

1. **Re-tone every receiver into the visible band (sRGB 25–150, lum 0.10–0.55) and re-bake.** Vault floor #0E1A17 → #142623 (0.08–0.12) outside r 120, Milky Way #24423C @70 % (≈0.20). Flange: top-lit #3A4F42 → #16211B (0.27 → 0.12), 2 px rim light #8FAF8C (0.55) on the upper-left 180°, 3 px inner bevel #0B110D at r 200–203. Well shadow 85 % → 0 over r 186–200 now falls on a 0.10–0.20 receiver (delta ≥ 20/255: visible). Plate: a real glass plate, rounded rect x110–340 y185–268, black 75 % uniform, 16 px feather, 1 px top rim light #3C5444. Dragon: flat phosphor as in v4 plus a baked 4 px glow #A6F46A @35 % onto the sky; drop gradient, rim light and drop shadow (invisible on 3 px lines). Studio gate: for every shadow/receiver pair assert ≥ 20/255 difference in the baked PNG.

2. **Decide the pole honestly.** Option (a) keep the pole at C, delete the Dipper/Polaris claims, and design the two side windows (x 29–110 and 340–421, y 150–260) as the observation ports: 2–3 px star cores and the 6 px halos only there, seasonal constellations (Ori, Tau, Gem, Leo, Cyg, Aql, Peg, And, Per, Aur) are the content, 18 stick figures reduced to those 10. Option (b) move the pole to ~(225,150) with an oversized vault (r 271, 542 px bitmap, 1.17 MB) so the circumpolar cap shows through the dragon's lines — but then the north-horizon point moves to (225,211), inside the digit box, and the ground lens dies; the terminal would need a plate of its own instead of a horizon. (a) is the smaller change; (b) is the better picture. Pick one; do not keep the current text.

3. **Spatial Variants on active-only nodes.** vault_active and its +4° Variant in their own Group; vault_ambient in a sibling Group with no angle Variant; same for dragon (scale on dragon_active only). Set `angleDirection="COUNTER_CLOCKWISE"` on the vault Variant and `CLOCKWISE` on the seconds Variant explicitly (the attribute exists on Variant; default direction is not guaranteed). Accept that sleep mirrors the wake timing (R6) and document it; or drop the ±4°/0.96 and keep alpha/colour reveal + the −14° seconds (hidden in AOD anyway).

4. **Plate over the full digit box at ≥70 %**, not a radial fade that is 0.08 at the "1" and "8"; exclude the 16 halos and the gold giants from x110–340 y185–268 by baking halos as a separate PNG with that region cleared. Change the red giants to #D9A070 @60 % so the low-battery gold is unique, or drop them.

5. **One phosphor arc, not two.** The minute rim (r 197.5) and the seconds trail (r 207) are identical in form (both grow clockwise from 12), 10 px apart. Make the minute a different material: starlight #C9D8E4 @30 %, 1 px, on the lip — or a single travelling 3 px tick like the sun pointer — and keep the seconds trail as the only phosphor arc (the v4 signature the user approved).

6. **Text floors.** 24-h numerals at ≥13 px on the flange (the ring is 25 px wide; JLC's 24-h ring is legible) or drop them and the "24-h scale" claim. Remove the 11 px zodiac glyphs from the bitmap (keep the ecliptic hairline) and let the readout carry the sign. Moon r 7 with 5 phase bitmaps (new / crescent / quarter / gibbous / full) or position only. State that LST is ambience.

7. **Expressions.** `subText(S, floor(LAMBDA/30)*3, floor(LAMBDA/30)*3+3)`. Add `+360` before every `% 360` whose operand can be negative (GMST for 2000–2001, the LST readout: `%` keeps the sign on floats). Drop `[SECOND]` from DFRAC so vault/sun/moon change once a minute (0.004°/s = 0.013 px/s at r 196; nothing is lost, and three full-screen rotated bitmaps stop re-rasterising every second). `numberFormat("00", …)`: the docs list only `#`, `,`, `.` and defer to DecimalFormat — validate on device or derive tens/units with `floor` and `%`. Hard-code UTC+9 (the face is Seoul-only anyway); `[TIMEZONE_OFFSET_MINUTES_DST]` exists (v3) but travelling breaks the longitude term regardless.

8. **Outline digits are native: delete R5.** WFF `Font` has `<Outline color width>` (Wear OS 4): `<Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff11200F"><Outline color="#ff91AD80" width="1.4"/></Font>` on the ambient TimeText reproduces v4's stroke exactly. No PNG glyphs, no Light-weight fallback. Use `<Shadow>` for the active digit shadow instead of a second TimeText.

9. **AOD hygiene.** Move AOD ticks/meridian to r ≤ 213 (≥ 12 px from the edge; Samsung's AOD shift will otherwise clip them). Revert AOD text to v4's set (date, BAT, INFINITY): no prompt prefix, no steps value; cap AOD static text at lum ≤ 0.45. AOD stars: cores ≥ 2.0 px with a 0.75 px soft edge, or draw the 24 stars as `PartDraw` ellipses on the rotating Group (vector, no resample twinkle). Keep the ring-only sun/moon.

10. **Bitmaps at device-native or 2×.** Baking 1 px ticks into a 450 px PNG that the renderer up-samples 1.067× smears every tick across two device pixels. Author at 960 (the memory evaluator resizes to the screen and crops transparent pixels before counting, so 2× costs no budget) or author at 480 and set `WatchFace width="480"`. Memory as listed is ≈4.1 MB RGBA at 450 (the proposal says 3.2 MB; its own list does not sum to that) — irrelevant, both far under WO-P8's 10 MB ambient / 100 MB interactive; ambient is modelled as ≤3 full-screen layers (~2.8 MB at 480) plus fonts.

11. **Verify the projection before baking.** Appendix A has Cassiopeia "low NE" at LST 11h50m; at hour angle 10.8 h it is 1.2 h *before* lower culmination, i.e. low **NW**. The numbers reproduce (DINT 9794, GMST 50.5°, LST 177.5°, solar noon 12:16 KST, Orion set) but the prose has east and west swapped — check the baked vault against Stellarium for the sample instant. Star counts: Hipparcos has ≈128 stars V ≤ 3 and ≈380 V ≤ 4 at dec ≥ −30; say "selected", not "V ≤ 3".

12. **Prompt line geometry.** At y388 the well half-chord is 109 px and the 172 px prompt spans 79 % of it, ending at r 184 inside the well shadow. Shorten to `~$ INFINITY` or raise to y376.

---

## KEEP (genuinely strong)

- **The plane architecture.** Well (sidereal) / flange (second + minute) / rim-mounted sun and moon (solar day, lunar month) / glass plate + digits on top / terminal on the "ground" below the horizon. First proposal in this project where every plane carries a real scale and the z-order and occlusion logic are right. Only the tones are wrong.
- **The astronomy engine.** DINT/DFRAC small-number GMST (valid to `[YEAR]`'s clamp at 2100), Seoul LST, `VAULT_ANGLE = (720 − LST) % 360` with RA increasing clockwise and CCW rotation (correct for a north-facing polar view), EOT and the 12.535 h longitude term (solar noon 12:16 KST on the sample day — correct), moon at SUN + age × 12.19° clockwise = east (correct: first quarter culminates at 18:00). The sun pointer radially outside the ecliptic point is exact by construction. Data sources all exist as used (`HOUR_0_23_MINUTE` float, `MOON_PHASE_POSITION` 0–28, `MOON_PHASE_TYPE` 0–7, `*_TENS_DIGIT` v2, `TIMEZONE_OFFSET_MINUTES_DST` v3).
- **The wake.** Back-to-front reveal with the digits legible at t = 0 because the outline copy is already in place; counter-rotation (deep CCW, front CW) is the one motion idea that reads as parallax; 360 ms; cubic-bezier(.22,1,.36,1) is expressible (`interpolation="CUBIC_BEZIER" controls=…`, 4-component vector); every `startOffset + duration ≤ 1.0` as required by the Variant spec; the escapement-style seconds is buildable exactly as written (`<Transform><Animation duration="0.18" interpolation="EASE_OUT" angleDirection="CLOCKWISE"/></Transform>`, default 15 fps ≈ 3 frames per tick — cheap).
- **AOD discipline.** Nothing per second, rotations at 1/min, no white, brightest 0.58, phosphor only on moving things, seconds and rim off; passes WO-P7 with 8× margin.
- **Palette discipline.** Phosphor + exactly three controlled hues; the sun gold as the single warm accent; everything else a tint of the phosphor hue. Still reads KALI.
- **Terminal on the deepest level** as Galaxia's white transfers; the dragon over the rim as the JLC Dragon-edition bridge (push it to actually straddle, top at r ≈ 215, once the flange is bright enough to show the occlusion).
- **Engineering hygiene.** Nested-Group rule so a Variant and a live Transform never share an attribute; `Arc endAngle` Transform for the minute rim (transformable per spec); `RadialGradient` (centerX/Y/radius transformable) as the vector plate fallback; reduced motion via `BooleanConfiguration`; provenance of the official dragon path.

---

## What I verified and how

- Read: brief, v4 `face.js` / `celestial.js` / `tokens.js` / `docs/DESIGN-SYSTEM.md`, both v4 previews, the on-watch `watchface.xml`.
- Measured (Python/PIL/numpy on `ghrepo/kw/assets/kali-orbit-ambient-900.png` and `-active-900.png`): dial non-zero and WO-P7-style means, per-colour pixel buckets, digit and dragon region areas.
- Computed (numpy, 450 grid): well/ground/dragon/plate/digit-box coverage, unobstructed-sky sectors, plate alpha at the digit extremes, star counts under the digits, shadow results on each receiver, luminance of every proposed colour, horizon circle through (78,225) (225,286) (372,225), well–horizon intersections at (38,167)/(412,167).
- WFF reference (developer.android.com/reference/wear-os/wff/…): `Variant` (targets = transformable attributes; `duration`, `startOffset` as fractions, `startOffset` ignored if the sum exceeds 1.0; `interpolation` incl. `CUBIC_BEZIER` + `controls`; `angleDirection`), `Transform` + child `Animation` (`duration` seconds, `interpolation`, `controls`, `angleDirection`, `repeat`, `fps` default 15), `Group` (`pivotX/Y`, `angle` clockwise, `alpha`, `scaleX/Y`, `tintColor` transformable from v4), text `Outline` (`color`, `width`, Wear OS 4), `Arc` (`startAngle`/`endAngle` transformable), `RadialGradient`, data-source table, arithmetic-expression page (`%` on floats, `subText(start, end)`, `numberFormat` formats `# , .`, `rad()`/`sin()` radians, precision unspecified).
- Quality guidelines: WO-P7 (15 %, luminance-interpolated, sampled every ~10 min), WO-P8 (10 MB ambient / 100 MB interactive); memory-usage page (decode → resize to screen → crop transparent → RGB565 if lossless; ambient modelled as ≤3 full-screen layers).
- Samsung: WFS OPR warning at 15 %; support page confirming periodic AOD image shift for burn-in; developer-forum reports of AOD shifting direction.
- Not verified (and the proposal must not claim them): expression precision (float32 vs double), `numberFormat("00")`, the `controls` separator format, bilinear shimmer magnitude on the real renderer, Samsung's AOD brightness scaling of dim fills.
