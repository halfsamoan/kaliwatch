# 06: the builder's refutation of the final spec (05)

**Verdict: refuted. Severity: major.**

I would have to build this in the browser studio this week and port it to WFF v4 later. As written, the spec cannot pass its own build, for three reasons:

- One gate fails by construction (G5).
- One gate measures a quantity the spec never pins down (G1 and the Milky Way).
- The HH:MM boxes use a text-placement model that the user's own watch contradicts by about 7 px.

Several port-critical behaviours also have no device test: ambient minute updates, variable-font weights, and how AOD bitmap glyphs line up with the vector digits.

The astronomy itself (E1 to E17, the projection, the horizon circle and the month table) checks out. I recomputed E2, E5, E6, E8 and E9 at M1 by hand.

**Evidence I produced** (all in `scratchpad\calc\refute\`):

| Script | What it computes |
|---|---|
| `g5.py` | F1 and F2 raster means for gate G5 |
| `mw_cov.py`, `mw_px.py` | Milky Way share of the open sky over the sidereal day |
| `inline.cjs` | Size of each WFF expression once fully inlined |

I also measured the on-device screenshot `KALIWATCH\device-kaliwatch-final-stable.png` (SM-R965N, 480 px). The other inputs were the v4 XSDs and `wfref\mem\AmbientMemoryFootprintCalculator.java`.

---

## A. Blocking issues (major)

### A1. The text baseline model is wrong by about 7 px, according to the device

**Where:** sections 3.1 and 8.2, and T18.

**What the spec does:** it implies baseline = box top + 66. HH is set as box y 186, h 86, baseline 252, and the colon as y 182 → 248.

**What the device shows:**
- The production Kali face places a TimeText with box top 105, h 86 and size 78. The layout is the same in the worktree `watchface.xml`, lines 33 to 41.
- On the SM-R965N screenshot, the ink of the "1" glyph spans device rows 128 to 189. In 450 space that is y 120.0 to 178.1, so the baseline sits at **box top + 73.1**.
- A centred line box predicts this to within 0.2 px: y + h/2 + (ascender − |descender|)/2 · size. The font's hhea values are 2146 and −555 at UPM 2048, which gives 105 + 43 + 30.3 = 178.3.

**Why it fails:**
- With the spec's boxes, HH:MM lands at a baseline of about 259.3, with ink from y 203.8 to 259.3.
- The plate margin below the digits shrinks from 16 to 8.7 px, and the gap above the date grows to 17.8 px.
- The studio's `wffBox()` would then draw a composition the watch never shows.
- The AOD `kw_outline` BitmapFont (glyphs 47 x 86) follows its own, unmeasured placement rule. If it disagrees with the vector Font, the digits jump on every wake. That breaks the hard rule that HH:MM never moves, and no test (T2 or T18) compares the two modes.

**Fix:**
- Encode the measured model in `wffBox()`.
- Set HH and MM to DigitalClock y **179** (baseline 252.3).
- Set the colon PartText to y **175**, assuming PartText follows the same model; verify that.
- Derive the date box from the same model; the spec gives only baseline 186. For example, y 170 and h 20.
- Bake the `kwo_*` glyphs so their baseline matches.
- Add a test, T18b: film AOD → Active and overlay the two glyph sets. It passes at ≤ 0.5 px.

### A2. Gate G5 cannot pass as specified

**Where:** section 8.4, G5, which requires "F2 : F1 mean ratio ≥ 8". The build fails on any miss.

**What I measured:** `g5.py` builds an sRGB-composited raster of the F1 and F2 contents as the spec lists them.

| Band | Mean Y |
|---|---|
| F1 (two circular rules at 50 %, 12 month rules at 60 %, 60 ticks, 12 names at 85 %) | **3.92 %** |
| F2 (opaline sweep, chamfer, numerals) | **13.2 %** |
| F1 without its two circular rules | 2.62 % |

**Why it fails:** the ratio is **3.4**. Even without the circular rules it is only 5.0. A 150 px box downscale preserves means, so the thumbnail does not change this.

**Fix:** define G5 on base surfaces only (for example the median of F1 at r 195 to 199 between inscriptions, against F2), or set the ratio to ≥ 3. Alternatively, drop the F1 circular rules to 25 %.

### A3. The Milky Way is unanchored, and gate G1 is not tied to it

**Where:** sections 4.3, 4.6 and 8.4 (G1).

**Problem 1: the wrong denominator.** "Clouds cover about 18 to 22 % of the chart area" is measured against the 586 px chart. Most of that area is the far southern rim, which is never visible.

**Problem 2: the open sky is small.** After the plate, the registers, the globe and the crescent are removed, the open sky is 56,110 px. That is 55 % of the aperture and **35 % of the dial**.

**Problem 3: a realistic band fails G1 at M1.** `mw_cov.py` measures a band of galactic latitude |b| < 8° (16° wide):

| Moment | Share of open sky |
|---|---|
| M1 (LST 21.9 h) | **10.8 %** |
| M2 | 16.4 % |
| Over a sidereal day (min to max) | 5.4 % (LST 4 h) to 22.0 % |

G1 asks for ≥ 15 % of open-sky pixels at L\* ≥ 45, and only clouds and cores reach L\* 45. So a real-width Milky Way fails G1 at the canonical moment M1, and the sky dims about fourfold at some sidereal hours that G1 never samples.

**Problem 4: a band wide enough to meet the chart rule swallows the pole.** `mw_px.py` finds that meeting 20 % of the chart needs a constant **83 px** stroke. That is about 74° wide near the pole. The galactic equator passes 30.9 px from P, so the cloud would permanently cover Polaris, the reticle and most of Draco (19 to 45 px from P). That contradicts "Draco is the only colour on the grisaille".

**Problem 5: the existing code cannot be reused as is.** `sky.js` `paintedMilkyWay` scales its stroke by `o.scale/1.633`. At the stereographic k 128 that gives a 2,822 px stroke, so it must be re-parameterised.

**Fix:**
- Specify the band in galactic latitude, with a brightness profile by galactic longitude.
- Sweep G1 hourly over 24 LST values.
- Set the thresholds from that sweep, for example a minimum of 8 % and a median of 15 % at L\* ≥ 45.
- Name a design remedy (cloud tone, secondary clouds) for a failing hour, instead of "build fails".

### A4. The smoked-glass numbers assume linear-light blending, but both renderers blend in sRGB

**Where:** section 3.2. The contrast table (18.7 / 9.0 / 5.5 : 1) and the line "the sky continues underneath at 15 % transmission … reads as glass, not as a card".

**Why it fails:**
- The 9.0 : 1 and 5.5 : 1 figures only hold if 15 % of the linear Y passes through. Chrome (the studio) and Skia (the watch) composite alpha in sRGB space.
- In sRGB, black at 85 % passes about 0.15^2.2 ≈ 1.5 % of the luminance:

| Under the glass | Result |
|---|---|
| Cloud `#9AA8AE` | becomes `#17191A` (Y ≈ 0.9 %) |
| Mid tone and wisp | fall below the 0.4 % OLED floor |

- G2 passes easily, but the plate reads as an opaque card with a few cores showing through. That is the effect the spec says it rejects.

**Fix:**
- State the compositing space.
- If you want a glass effect, use about 60 to 65 % black in sRGB, which passes roughly 11 to 13 % linear.
- Recompute the table and re-run G2.

### A5. Time-driven AOD layers may freeze, and the memory tool may count them as clocks

**Where:** sections 7.1, 7.3 and 9.1, and T11.

**What the official tool assumes:** `AmbientMemoryFootprintCalculator` treats everything in ambient except DigitalClock, AnalogClock and ComplicationSlot as static layers. Its offloadable time list does not include `MINUTES_SINCE_EPOCH`. Nothing tests whether `sky_aod`, `sun_aod`, `cage_aod` and `luna_aod` actually advance each minute in AOD on Samsung's runtime.

**Why it matters:**
- If they freeze, the "shared angle, no jump" wake breaks, and the burn-in argument that these elements move with real time fails.
- The memory note says screencap returns black in AOD on this watch, so the test needs a camera.

**A second trap:** the "old-style analog clock" detector flags any `Part*` whose angle Transform contains the substring `MINUTE`, and `MINUTES_SINCE_EPOCH` matches. So a PartDraw with its own E8 rotation counts as an extra clock and an extra layer. The 9.2 skeleton's sibling `luna_aod` would be one, and T11's "1 clock" would fail.

**Fix:**
- Keep every time-rotated AOD part inside a rotated Group.
- Add T19: film AOD for 60 minutes and check that the sun dot and cage advance about 15°. If they do not, drop the moving AOD twins and keep static ticks.

### A6. Font weights rely on a variable font with no test

**Where:** section 5.2 and the `kwo_*` bake.

**The problem:** `fonts/RobotoMono.ttf` and `res/font/roboto_mono.ttf` are variable fonts (fvar wght 100 to 700, default 400, with gvar). The spec asks WFF for `SEMI_BOLD` and `MEDIUM` weights. Nothing shows whether Samsung's runtime sets the wght axis or applies fake bold.

**Why it matters:** if it fakes bold, the Active digits differ from the studio, and from the AOD outline glyphs baked from a true 600 weight. The crossfade would then show two different glyph shapes.

**Fix:**
- Ship static instances (Regular, Medium, SemiBold, made with fontTools instancer) as separate families.
- Bake the AOD glyphs from the same file.
- Add a device test.

---

## B. Underspecified or contradictory items (minor; resolve before Monday)

**B1. The prompt and INFINITY are defined three different ways.**
- Section 3.1 and T10 say the prompt is a live TextCircular at r 218.5. Section 5.1 bakes it into `flange_f2.png`. Neither z13 nor 9.2 contains a TextCircular node.
- "r" is undefined: is it the baseline or the centreline? At 11 px that choice moves glyphs about 4 px, which is enough to hit the chamfer at r 211 to 212.5.
- AOD INFINITY (r 204, centred at 180°) collides with the AOD tick at 180° (r 200 to 208). The v2 mock quietly dropped that tick, but the spec still says 12 ticks.
- INFINITY changes radius (204 → 218.5) and centre angle (180° → about 168°) between modes.
- **Fix:** bake the prompt; define TextCircular r as the glyph centreline; drop the 180° AOD tick; consider putting AOD INFINITY on the same arc as the Active one.

**B2. The `luna_aod` tree is contradictory, and the AOD moon is see-through.**
- z3 puts `luna_aod` inside the `luna` Group. But `luna` carries the AMBIENT alpha-0 Variant (section 6.1), which would hide it in AOD.
- Section 9.2 makes it a sibling instead, which runs into A5.
- In AOD, the 73 stars also show through the moon, because there is no black disc behind it.
- **Fix:** `luna_mount` (angle E8) > `luna_active` (alpha Variant, Condition S9) plus `luna_aod` (Condition S9 ≠ 0 > a black Ø92 disc and the limb Arc).

**B3. The wake lets the bright sky leak under the digits.**
- The plate (0 → 255) and `plate_mask_aod` with its register discs (255 → 0) cross-fade over the same 80 to 320 ms window. Meanwhile `sky_active` is already full by 200 ms.
- At the midpoint, the two layers together cover only 1 − 0.5 · 0.5 = 75 %, so about 25 % of the sky flashes under the digits and registers.
- **Fix:** keep the black register footprints in both modes (the register floor is opaque anyway), and fade the plate mask out only at 320 to 360 ms.

**B4. Inlining the expressions is required but not specified.**
- WFF lets only Condition and Compare reference named Expressions, yet E5 through E17 are written in terms of each other. `inline.cjs` expands them fully:

| Expression | Inlined size |
|---|---|
| Jupiter x | **7,045 chars**, with 74 `[MINUTES_SINCE_EPOCH]` references and 82 trig calls |
| Four planet Transforms | ≈ 28 KB, or ≈ 85 KB across the three motion subtrees |
| E8 | 937 chars |
| E13 | 657 chars, repeated inside all 9 luna booleans |

- **Fix:** specify a macro expander in `wff-expr.js`, shared by the studio evaluator and `gen-wff.cjs`. Simplify planets, for example to per-year linear segments, and drive luna from `[MOON_PHASE_POSITION]`. Test a parser length limit on the device.

**B5. Precision and the `%` operator.**
- `[MINUTES_SINCE_EPOCH]` ≈ 29.45 M, which is above 2^24. If the runtime holds sources as float32, the value has 2-minute resolution now and 4-minute resolution after November 2033, not "until about 2040". T3 (≤ 1° at three times) cannot detect this.
- **Fix:** use E1 = `([HOURS_SINCE_EPOCH] - 490896)/24 + [MINUTE]/1440`, which is exact for KST. Write W(x) as `x - 360*floor(x/360)` so it does not depend on how `%` handles floats. Add a check that the sky moves on odd minutes too.

**B6. The Gyro wrappers swallow the AOD twins.**
- `sky_aod`, `rings_aod`, `cage_aod`, `sun_aod`, `infinity_aod` and `dragon_aod` all sit inside `par_*` wrappers.
- WFF has no ambient-state source to zero the Gyro, so a frozen offset displaces the AOD picture against the camera-locked digits. That contradicts "the AOD picture is never displaced".
- If Groups clip to their bounds, a 450² wrapper shifted 1.5 px also clips the dial edge, and the r 228 bake does not help.
- **Fix:** move the AOD twins out of the wrappers, and make the wrappers 470² at (−10, −10).

**B7. Two wrong claims about `sky_settle`.**
- "COUNTER_CLOCKWISE … against its own sense" is wrong: counter-clockwise *is* the sky's sense, since E3 decreases.
- "Shared angle, no jump" is also false. `sky_aod` sits outside `sky_settle`, so for 200 ms the stars are doubled with up to a 5 px offset at r 100 from P.

**B8. Some text boxes are too tight, and the AOD date alignment is unset.**
- The date box `25 OCT / SUN / ` is exactly 135 px for 135 px of text (144.0 device px for 144.0), so any rounding wraps or ellipsises it.
- The colon box is 20 px wide for a glyph with a 46.8 px advance.
- AOD date alignment is not given. With START alignment it sits 27 px off-centre; with CENTER it jumps 27 px on wake.
- **Fix:** give the boxes slack, and specify the alignment.

**B9. The token lint fails on the spec's own colours.** "No hex outside the token list" rejects `#8CCB5A`, `#1F3315`, `#6FA947`, `#0E1215` and `#5A6264`. The F1 rule alpha is also given as 50 % in one place and 60 % in another.

**B10. Some geometry figures are wrong.**
- The crescent is "27.5 px at 12 o'clock" and meets the lip at "67°". Both are measured against r 182; the true values at the r 180 aperture are **25.5 px and 64.5°**.
- The scale near the pole is 1.12 to 1.22 px/deg, not 0.99.

**B11. The test list has gaps and broken references.**
- Section 7.3 says "T8 overnight check", but T8 is the 40 % wrist check.
- T6 is missing.
- There are no tests for: TextCircular radius semantics, `round()` returning a float inside the steps Template (which could print "12.0.3.0k"), or STEP_GOAL = 0 (a division by zero).

**B12. Several main-reference cues are only partly delivered.**
- The open sky is 35 % of the dial; the reference's sky "occupies most of the dial".
- The eccentric ring is a 1.2 px hairline (`#5E8F40`, Y 22 %) on a crescent `#0B0E10` next to ground `#141C24`. Both sit near the OLED floor at 40 % brightness, and no gate checks that the edge is visible.
- The Milky Way is mostly grey: only 4 % of the open sky must reach L\* ≥ 70.
- There is only one large sphere, and at new moon it is a dark disc for about 2 days.
- **Fix:** add a G5 check for the horizon edge (≥ 2 px at Y ≥ 30 % in the 150 px thumbnail), widen the edge to 2 px phosphor metal, and add earthshine to the moon.

**B13. Assorted sprite and drawing details conflict.**
- The 6 px luna halo does not fit the 4 px margin of the 100² sprite.
- The F2 guilloche pitch of 0.5° (≈ 1.9 px) aliases at 480 px and during the −14° wake rotation, and ±6 % amplitude is invisible at 40 % brightness. Use 1° and ±10 %.
- Around the 16th of each month, the sun (r 192.5 to 205 with glow) sits on its own month name (r 199.5 to 207.5).
- The uniform 3 px horizon shadow ignores the 315° key light.

**B14. Some astronomy shortcuts are not stated.**
- The planet sprites never rotate, so Saturn's ring position angle is wrong against the turning sky.
- The ring opening (7/26, which is 15.6°) is far wider than the few degrees it really has in 2026 to 2027.
- The catalogue is J2000 while LST is of date, which gives about a 0.36° offset.
- **Fix:** say so in the spec, or precess the catalogue to 2026.

**B15. The headset-battery complication is dropped without a decision.** The production Kali face binds the Console headset-battery ComplicationSlot, and v5 has no slot for it. Adding one later changes the AOD layering (a complication ends a layer and is not offloaded under V1) and needs a safe area.

**B16. The week plan has no cut line, and two tools are missing.**
- SVG has no SweepGradient, and the studio has no emulation for one; it is needed for the lip, the step and the cage ring.
- No Node image library is installed, so `bake.cjs`'s "2x then downsample" must go through PIL or a Chrome canvas.
- **Fix:** define the minimum for the round-4 sheet: composite M1 and M2, AOD M1 and M6, and the wake strip. Defer the planets, Gyro, the `calm`/`still` options and the G6 lint.
