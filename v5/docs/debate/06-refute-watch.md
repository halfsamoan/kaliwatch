# 06: Refutation of the final spec (05), from the Watch6 Classic owner's bench

**Verdict: refuted, severity major.** The spec is unusually well engineered. Its geometry, its WFF schema facts and most of its numbers hold up when recomputed. The failures are where it meets the main reference and the real AOD life of the watch. I found 5 major issues and 17 minor ones.

1. The smoked plate swallows the meridian band where every named constellation and both planets culminate.
2. The bright-sky gate is only sampled at the two moments where it can pass.
3. The wake Variants force a rotation direction, so one direction of every transition can whirl 346° or 357°.
4. The AOD burn-in case rests on a wrong statement and a test that does not exist.
5. The eccentric structure, the photo's strongest cue, is the weakest stroke on the face.

## Evidence

**Read:** `brief.md`, `main-reference.md`, the v4 `face.js`, `celestial.js`, `tokens.js` and `DESIGN-SYSTEM.md`, both v4 previews, the on-watch `watchface.xml` and `watch_face_info.xml` (`Editable false`, font `roboto_mono.ttf`), the v4 XSDs in `scratchpad\wfref\xsd`, and `AmbientMemoryFootprintCalculator.java` / `VariantConfigValue.java` in `scratchpad\wfref\mem`.

**Recomputed with new scripts** in `scratchpad\calc\refute06\`:
- `check.cjs`: open-sky mask, name and figure visibility, luna limb error, crescent geometry, text fits, Draco against the dragon.
- `mw.cjs`: Milky Way share of the open sky by LST.
- `names2.cjs`: open-sky hours for all 33 figures.
- `pl.cjs`: planets behind the plate.
- `explen.cjs`: length of the inlined expressions.

The scripts use the studio's `astro.js`, `stars.js` and `dragon-data.js`, and the same dragon raster as `calc\final\check.cjs`.

**"Open sky"** means exactly G1's definition: r < 180 about C, inside the horizon circle, and not covered by the plate (x 113 to 337, y 168 to 268), the registers (r 44), the luna globe (r 46 at (62,206)) or the dragon bed (ink dilated by 3 px). Of the 101,780 aperture px, **54,714 (53.8 %) are open sky, which is 34.4 % of the dial**. The rest is covered by:

| Cover | px |
|---|---|
| plate | 22,400 |
| registers | 12,184 |
| north crescent | 6,476 |
| luna globe | 4,610 |
| dragon bed | 1,396 |

---

## MAJOR

### M1. The plate hides the band where the named constellations and the planets culminate (sections 3.2, 4.3, 4.8; main-reference cue "readable constellation figures and names")

**What.** On the meridian, the plate (y 168 to 268) covers chart radii 54 to 154 px from P, which is **δ +44.3° to −10.5°**. Section 4.3 restricts names to figures with mean δ ≤ +25°. Seven of the eight chosen names (ORION, TAURUS, GEMINI, LEO, VIRGO, AQUILA, PEGASUS) therefore culminate behind 85 % black glass, which lets 15 % through. SCORPIUS culminates between and under the registers, and low on the lip.

**Measured.** Hours per sidereal day with the label centre in open sky and at least 60 % of the figure's stars in open sky:

| Name | Hours |
|---|---|
| ORION | 3.5 |
| TAURUS | 5.7 |
| GEMINI | 6.2 |
| LEO | 5.1 |
| VIRGO | 1.9 |
| AQUILA | 4.0 |
| PEGASUS | 7.0 |
| SCORPIUS | 1.9 |

That is **1.5 readable names at a random moment**. At the named moments:

| Moment | Readable names | Which |
|---|---|---|
| M1 | 1 | TAU; AQL and PEG are behind the glass |
| M2 | 1 | GEM |
| M3 | 1 | LEO |
| M4 | 2 | ORI 58 %, TAU |
| M5 | 2 | LEO, PEG |
| M6 | 2 | ORI, TAU |

Only 7 to 14 of the 33 figures have at least 60 % of their stars in open sky at M1 to M6.

**The planets fare the same.**

| Planet | Open sky | Behind the plate |
|---|---|---|
| Jupiter | 5.9 h/day | 7.6 h/day |
| Saturn | 3.7 h/day | 8.4 h/day |

Saturn is behind the glass for 69 % of its above-horizon visible time. Of the ten planet placements in the section 4.9 table, only two are in open sky: Saturn at M3 and at M5. Section 8.3 says "Jupiter rising on the left" at M3, but its position (146,176) is inside the plate.

Section 10.1 rejects a big Jupiter for being visible only 5.9 h/day. The chosen names average 4.4 h.

**Why it fails.** The photo's sky is a dense field of labelled figures. The face shows about 1.5 labels, and never at a figure's best (highest) moment. No gate measures this.

**Fix.**
- Choose names by measured open hours, not by declination. The top candidates by open hours (centroid and at least 60 % of stars in open sky) are PER 13.8 h, CYG 12.7, AUR 12.0, LYR 10.6, AND 8.1, HER 7.9, PEG 7.0, BOO 6.7, CRB 6.7, ARI 6.6 and GEM 6.2.
- Use 3-letter IAU abbreviations (PER, CYG, AUR, LYR, AND, HER, BOO) at 11 px, about 22 px wide. That clears the "name smaller than the figure" rule at 1.25 to 1.35 px/deg, and it is better terminal DNA.
- Ten to twelve names gives about 3.3 or more readable at any moment. Keep ORI and TAU.
- Add gate **G7**: at every 1 h LST sample, at least 3 names and at least 10 figures in open sky.
- Correct the M3 description, and say in the docs that the planets are mostly read through the glass.

### M2. "Bright grisaille" is time-of-day dependent, and G1 is sampled only at M1 and M2 (sections 4.3 and 8.4 G1; main-reference cue "BRIGHT high-contrast grisaille")

**What.** The spec's own coverage, "clouds 18 to 22 % of chart area", corresponds to |b| < 12° to 14° in this projection (measured: 18.9 % at 12°, 22.1 % at 14°). The share of open sky inside that band:

| Sample | Share of open sky inside \|b\| < 12° to 14° |
|---|---|
| M1 | **14.4 to 16.9 %** |
| M2 | 22.9 to 27.6 % |
| Minimum over LST | **4.9 to 6.7 %**, at LST ≈ 3.3 h |

That minimum comes before the Great-Rift cut-back and the 40 % SE fall-off. G1 requires at least 15 % of pixels at L\* ≥ 45, so:
- at the canonical M1 the gate is a coin flip;
- at LST 2.5 to 5.5 h it fails by 2 to 3x.

LST 2.5 to 5.5 h is 19:00 to 21:30 KST in January, 13:00 to 15:30 in April, 07:00 to 09:30 in July and 01:00 to 03:30 in October: a daily window of about 3 h when the bright Milky Way sits under the dragon, the plate and the horizon. M3 (LST 6.25 h, 9.5 % with \|b\| < 8°) and M5 are never brightness-gated.

**Fix.**
- Run G1 at 24 LST samples and gate on the **minimum**, for example at least 8 % at L\* ≥ 45 at the worst LST and at least 15 % at the median.
- Give the sky a time-invariant brightness floor from non-galactic content:
  - figure lines at 1.6 px `#9AA8AE`, fully opaque (they are below 45 L\* at 70 %);
  - mag 3.0 to 4.5 stars at `#9AA8AE` with a 1 px bloom;
  - optionally a faint field of mag 4.5 to 5.5 stars (about 600 more) as painted dust.
- Then state honestly in the studio which hours show the bare winter sky.

### M3. Forced `angleDirection` on single Variants: one direction of every wake can whirl 346° or 357° (sections 6.1 and 9.3)

**What.** `f2` is set to angle −14° → 0 with `angleDirection="CLOCKWISE"`, and `sky_settle` to +3° → 0 with `COUNTER_CLOCKWISE`. One Variant serves both directions. The WFF reference defines CLOCKWISE as "Animate in the clockwise direction", and that is a modular direction, as used for hands at 359 → 0. Forcing it has three possible outcomes:
- the runtime goes clockwise both ways: sleep runs 0 → 346 (F2 spins 346°) and the sky spins −357°, while `sky_active` is still at up to 100 % alpha in the first half of the window;
- the runtime reverses the direction on the way back: then the wake is the long way;
- the direction is ignored.

In every case the studio, which interpolates numerically, will not show what the watch does. Section 10.2 explicitly rejects "Studio-only timings presented as watch behaviour". T1 tests only W and ordering.

**Note.** "The sky settles against its own sense" (section 6.1) is wrong: +3 → 0 is counter-clockwise, which is the same sense as the sky's motion.

**Fix.**
- Use `angleDirection="NONE"` (numeric interpolation). The shortest path already gives a clockwise wake for F2 and a counter-clockwise wake for the sky, in both directions.
- Add **T1c**: film both transitions at 240 fps with NONE and with CLOCKWISE.
- If NONE snaps (the docs say "No angular rotation"), keep the swing only if the film shows the device reverses a forced direction on return. Otherwise drop the angle Variants and keep alpha and scale.
- Fix the wording in section 6.1.

### M4. The AOD burn-in case is unverified and partly wrong (sections 7.1, 7.3, 9.5)

**What.**
- Section 7.3 says the brightest AOD pixels (`#91AD80` outlines) "change every minute". They do not:
  - the **colon outline never changes**;
  - the HH tens digit is static for up to **10 h** ("0" from 00:00 to 09:59, "1" from 10:00 to 19:59);
  - the HH units digit is static for 1 h.
- Also static all day: INFINITY and the date `#7F9472`, the dragon (1,586 px), the 12 ticks, the full-circle lip hairline and the BAT rim. On a round OLED, rings are the classic ghost.
- The spec rejects drift and says Samsung's AOD frame shift "is assumed but not relied on (T8 overnight check)". **T8 is the 40 % brightness wrist check; no overnight or frame-shift test exists.** Samsung developer-forum posts report that pixel shift was omitted on Galaxy Watch4 and later for third-party faces. Those posts are unverified, which is exactly why a test is needed.
- The "moving elements" argument (sky dots, Draco, cage, sun and luna in AOD turning 0.25°/min) needs the AOD Group Transforms to re-evaluate. All four rotate on **Groups** from `[MINUTES_SINCE_EPOCH]`. Google's evaluator recognises an ambient-dynamic element only on a **Part** with an angle Transform, and caps dynamic elements at 2 under V1 offload. If the SM-R965N offloads AOD, all four hold their pose until wake. The round-2 critiques (astronomer F4, motion F5) raised this, and T11 only counts layers.
- On this watch `screencap` is black in doze, so none of this can be verified without a camera.

**Fix.**
- AOD colon: two Ø5 dots, 1 px outline `#5E7A55`, or fill-only `#2C3A33`, so it is dimmer than the digits.
- Drop the full-circle lip hairline and the BAT rim in AOD; the 12 ticks and the black footprints are enough.
- Correct section 7.3.
- Add **T19 AOD soak**: macro photos at t0, +1, +15 and +60 min of AOD. It checks:
  - (a) any global frame shift;
  - (b) the rotation of `sky_aod`, sun, cage and luna (expected about 15°/h);
  - (c) the BAT and date updates.
- Fallback if there is no system shift: a ±1 px x/y walk on the **non-digit** AOD layers only (`sky_aod`, `dragon_aod`, ticks, INFINITY, date), for example `x = round(sin(rad([MINUTE]*6)))` and `y = round(cos(rad([HOUR_0_23]*15 + [MINUTE]*0.25)))`. This does not move HH:MM, so it does not break the hard rule that section 10.2 uses to reject drift.
- If T19 shows the AOD groups freeze, say so in section 7.3 and stop citing movement as a burn-in mitigation.

### M5. The eccentric structure, the photo's strongest cue, is the faintest stroke on the face (sections 2.1 z6 and 5.1; main-reference cue 4 / translation rule "ECCENTRIC layering")

**What.** The only non-concentric metal is the horizon edge: a 1.2 px Arc in `phosphor.edge #5E8F40` (Y 22.4 %, L\* about 54), the dimmest metal token. It sits on a near-black crescent `#0B0E10`, 0 to 27.5 px thick and tapering to nothing at 67° and 293°.
- Against the bright grisaille sky near the horizon (clouds at L\* about 60), the edge is lower in contrast than the sky behind it.
- At G5's 150 px thumbnail it becomes about 0.4 px and disappears.
- Every strong edge is concentric with C: the lip (3 px, `#D2FFA4` peak), the step, the F1 rules and F2 (14 px grey).
- The registers are a mirror-symmetric pair, and the graticule circles about P are at 8 to 10 % alpha.
- In a still frame (the photo is a still) the face reads as concentric rings plus a centred plate. In the photo, the off-centre gold arc is a bold polished band "a big part of why it reads as deep".

Only 4.7 % of the horizon arc lies under the dragon bed, so the arc is visible; it is just drawn too weakly.

**Fix.**
- Make the horizon edge a 4 px raised bevel in the one metal: a SweepGradient centred at (225,280.4), with 1.5 px `#D2FFA4` on the NW-facing span fading to `#4E7F34` at SE. Add a 3 px cast shadow on the sky (already specified) and a 1 px `#1F3315` foot on the crescent side.
- Give the crescent a brushed plate tone, `#1A2024` → `#2E363A` along 315°, so it reads as a raised eccentric plate distinct from the `#030405` trench.
- Add to G5: horizon band ≥ 1.3 px at L\* ≥ 60 on the 150 px thumbnail, over at least 120° of its visible arc.
- Optional, cheap asymmetry: give the BAT register (the one that survives in AOD) the brighter, full-circle metal lip, and keep STP at a 60 % half-lip.

---

## MINOR (each actionable)

1. **`luna_aod` placement is contradictory** (section 2.2 z3 vs section 9.2).
   - z3 puts `luna_aod` "in the same rotated Group" as `luna`, and section 6.1 gives `luna` an AMBIENT alpha of 0, which hides its children and makes the evaluator skip the subtree. The AOD moon would never show.
   - Section 9.2 lists it as a sibling.
   - Fix: `luna` (angle E8, no alpha Variant) > `luna_img` (alpha Variant 0) > Condition S9, plus `luna_aod` (alpha 0 → 255) > Condition S9 ≠ 0.

2. **The lit limb does not face the sun star** (sections 4.7 and 2.2 z3).
   - Rotating the globe by E8, the sun's angle about **C**, is wrong from the globe at (62,206). Measured error: 3° at E8 90, 37° at 180, 49° at 210, **56° at 243**, 55° at 300, 53° at 330.
   - That is more than 30° from about 01:20 to 10:40 solar time, when the sun star is right next to the globe.
   - Fix: angle = `deg(atan((sx-62)/(206-sy))) + ((206-sy) < 0 ? 180 : 0)`, with `sx = 225+197*sin(rad(E8))` and `sy = 225-197*cos(rad(E8))`.

3. **The AOD INFINITY is cut by a tick.** The 12 AOD ticks every 30° include 180°, at r 200 to 208. INFINITY at r 204 spans 170.6° to 189.4° (66.7 px), so the tick splits it as "INFI|NITY". Fix: 11 ticks (omit 180°), matching Active, where the prompt replaces numeral 12.

4. **The AOD date is 27 px off-axis.** `25 OCT / SUN` is 12 characters starting at x 144, so its centre is x 198 while the digits are centred on 225. Centring it instead would move it on wake. The AOD BAT value also changes from baseline 329 to 326 and from 22 px to 17 px. Fix: keep all 18 characters (with the sign) in AOD, at a cost of about 60 lit px, or centre-align both modes. Keep the BAT value baseline identical across modes.

5. **The prompt does not fit its arc.** `kali@vault:~$ INFINITY` at 11 px with 0.02 em tracking is 149.8 px, which is **39.3°** at r 218.5 (38.6° at the baseline r 222.4). Sections 3.1 and 5.1 give 161° to 199° (38°). The spec also says both "baked into `flange_f2.png`" (section 5.1) and "TextCircular" / "all text live" (sections 3.1 and 8.2). One TextCircular has one Font and so one colour. Fix: 160° to 200° (8.3° clear of numeral 14), baked in the PNG; or two TextCircular nodes with split angles.

6. **Crescent numbers use r 182, while the table says "inside r 180".** At r 180 the crescent is 25.5 px at 12 o'clock and meets the lip at **64.5°** and ±50.7° about (225,280.4). The stated 27.5 px, 67° and ±52.9° are for r 182. Fix: state r 182 (the occluder and dome-light radius) once and use it everywhere.

7. **The information got smaller than v4.**

   | Text | v4 | v5 | Cap height in v5 | Visual angle at 30 cm |
   |---|---|---|---|---|
   | Date | 17 px | 15 px | 0.93 mm | about 10.7′ |
   | Register values | 27 px | 22 px | 1.36 mm | |

   About 10.7′ is below the roughly 16′ glance threshold. Both larger sizes fit:
   - a 17 px date is 183.6 px wide (x 133 to 317), with its cap top at 173.6 inside the plate;
   - a 24 px value leaves a 2.0 px margin to the r 39.1 gauge edge, which passes G4's 1.5 px.

   Fix: date 17 px in `#B9C5CA`, values 24 px.

8. **Month-name orientation is unspecified** (section 4.5, risk 7). On 25 Oct the sun, and with it the current month's name, is in the lower half of F1 for **75 % of 06:00 to 22:00 KST**. Fix: set `direction` so that names read upright at 6 o'clock, with glyph tops toward C.

9. **The sun sits on the current month's name for about 6 days a month.** The sun spans r 192.5 to 201.5, and its glow reaches 205. The name caps span r 199.5 to 207.5, and names are centred on the 16th. Fix: glow ≤ 2 px and sun at r 196, or accept it and say so.

10. **The inlined expressions are huge and untested.** Fully inlined as specified (with no Reference), one planet coordinate is **about 6.8 KB, with 82 trig calls and 74 reads of `[MINUTES_SINCE_EPOCH]`**.

    | Expression | Size |
    |---|---|
    | Jupiter and Saturn x and y | 27 KB |
    | luna booleans | about 12.5 KB |
    | E8 | 0.9 KB per use |

    Everything is copied into 3 ListOption subtrees, which comes to well over 100 KB of expression text. No test checks validator or runtime limits, or evaluation time. Fix: add T20 (validate, load on the device, time a minute tick). Fallback: `Reference` carriers on an always-visible 1×1 PartDraw for E1, E2, E5, λJ and λS, which section 10.2 rejected without a size argument.

11. **The float32 claim is wrong.** `[MINUTES_SINCE_EPOCH]` is about 2.95e7, which is above 2^24. If the runtime evaluates in float32, the value already has **2-minute** granularity, becoming 4 minutes after Oct 2033. "Until about 2040" (sections 4.1 and 10.3) is wrong. The effect (0.5° steps) is inside T3's tolerance. Fix: state it correctly and add the float check to T17. A precision-safe alternative is `[YEAR]`, `[DAY_OF_YEAR]`, `[HOUR_0_23_MINUTE]` and `[TIMEZONE_OFFSET_MINUTES_DST]`.

12. **The planets slide against the stars during the wake.** `jupiter` and `saturn` are outside `sky_settle`, so for 0 to 200 ms they are offset by up to 3° (about 5 px at r 99 from P). Fix: wrap them in a 586² pivot-P group with the same +3° Variant.

13. **The globe sphere cue fails at the phase extremes, and G5 only tests full moon.** M1 is a full moon (S9 = 8), so the canonical render has no terminator. At new moon the dark side `#1E232A` at 92 % sits on `#141C24`, and the "large painted sphere" vanishes. Fix: earthshine modelling on the dark hemisphere (`#2E363A` → `#1E232A`, 1 px `#4A555B` rim), and G5 also at the new moon of 2026-11-09 and a first-quarter moment.

14. **The BitmapFont `size` is not specified.** The glyphs are 47 × 86. It is undocumented whether `size` scales them, and a mismatch would scale the AOD digits against the Active ones. Fix: specify `size` and make the T2 pass criterion "glyph box 47 × 86 at 1:1 against the Active TimeText, ±0.5 px".

15. **No step-goal guard.** `[STEP_COUNT] * 1.0 / [STEP_GOAL]` divides by zero if the goal is 0. Fix: `clamp([STEP_GOAL], 1, 1000000)`.

16. **There is no AOD globe footprint.** AOD stars draw through the moon disc that is opaque in Active. Fix: a black Ellipse r 46 at (62,206) under `luna_aod`, with 0 lit px.

17. **The dragon's wing tip is tangent to F2.** It reaches r 211.0, F2's inner edge, and its 3 px black bed bites into the F2 chamfer and guilloche. Fix: either overlap deliberately by 4 px or more (the tip breaks the frame, with the bed clipped to r ≥ 211), or keep it at least 4 px clear.

## What holds up

These recompute correctly:
- the horizon circle (225,280.4) r 209.9, the zenith (225,177) and the north point (225,70.5);
- the sky bitmap coverage (291 px needed against 293 px available);
- the text corners in the registers;
- the AOD lit-share arithmetic, 14,520 px or 9.13 % (the cage ring's circumference is 75.4 px, not 70.7: +11 px);
- the schema facts:
  - integer Group x/y;
  - Gyro at most once;
  - ListConfiguration allowed in Scene;
  - `Localization locales`;
  - `Outline` on PartText only;
  - no decorations on TimeText;
  - `startOffset` ignored when the sum exceeds 1.

HH:MM, the dragon frame and the AOD content rules respect the hard constraints.

Sources: [WFF Variant reference](https://developer.android.com/reference/wear-os/wff/common/variant/variant), [WFF bitmap fonts](https://developer.android.com/training/wearables/wff/bitmap-fonts), [Samsung developer forum thread on moving AOD and pixel shift (Galaxy Watch4)](https://forum.developer.samsung.com/t/possible-to-make-a-moving-aod/22770) (unverified forum reports).
