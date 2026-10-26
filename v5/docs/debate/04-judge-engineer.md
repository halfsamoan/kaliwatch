# KALIWATCH v5: judgement 04, engineer's seat

I judged as the engineer who builds the browser studio this week and does the WFF v4 port later. Date 2026-10-26. Design space 450 x 450, centre (225,225), R 225. Target SM-R965N 480 x 480.

I judged against the user's main reference (`main-reference.md`). It overrides the brief where the two differ. Its cues are:
- eccentric layering with an off-centre sunken sub-disc;
- a bright, high-contrast grisaille sky;
- two flange levels: a grey radial-guilloche 24 h ring with numerals, and a black calendar ring with a small sun star;
- one accent metal for all structure, which here means phosphor treated as anodised metal;

The fixed HH:MM, the official dragon, INFINITY, the prompt and the AOD rules still hold.

## 0. What I read and what I checked myself

**Read:**
- `brief.md` and `main-reference.md`.
- The v4 `face.js`, `celestial.js`, `tokens.js`, `DESIGN-SYSTEM.md`, `preview-active.png` and `preview-ambient.png`.
- The on-watch `watchface.xml`. It confirms the integer Part coordinates, Variant fractions, `Localization` and the named-`Expression` `Compare` pattern.
- The existing v5 studio in `KALIWATCH/studio`: `astro.js`, `stars.js`, `sky.js` (it already supports stereographic projection) and `galaxia.js`, which already has ring-text, 8-point-star, calendar-ring and guilloche helpers.
- The seven v2 proposals. The wff revision exists (`03-revised-wff.md`) and was judged as written.

**Re-checked against the v4 XSDs** (`scratchpad\wfref\xsd`). These facts decide several rankings:
1. **`clock__timeText.xsd`.** A `TimeText` takes `Variant` plus one `BitmapFont` *or* one `Font`, and that `Font` has attributes only. So `Shadow`, `Outline` or `OutGlow` inside a `TimeText` is invalid. This breaks four specs:
   - material's Active digits (`Shadow` and `Outline`) and its AOD digits (`Outline`);
   - the kali AOD clock;
   - the legibility AOD clock;
   - the astronomer AOD clock.

   The valid routes are horologist's and wff's `BitmapFont`, or motion's `PartText` with `Outline`.
2. **`group__part__abstractPartType.xsd` and `group__groupElement.xsd`.** `Variant` is `maxOccurs="unbounded"` on Parts and Groups. Motion's "one Variant per PartImage" assumption is false; its nested-Group chains are unnecessary but harmless. `Gyro` is allowed once per Group or Part.
3. **`common__simpleTypes__arithmeticExpressionType.xsd`.** Gyro expressions are typed on `sensorSourceType`. Horologist's `[CONFIGURATION.parallax]` term inside a `Gyro` expression only passes the XSD through the `xs:string` escape. Runtime acceptance is unknown.
4. **`common__attributes__geometricAttributes.xsd`.** Group and Part `x`/`y` are `xs:integer`, so these are invalid as written:
   - material's `sun_pointer` at y 17.5;
   - legibility's star `PartDraw` at fractional x/y.

   Horologist, wff and astronomer are clean.
5. **`common__localizationElement.xsd`.** With `locales="en_US"` on a ko-KR system, no locale matches, so the first listed (en_US) is used. That confirms wff's one-line English date.
6. **Sky brightness in wff's own mock.** I measured `scratchpad\calc\wffv2\mock_active_2008.png`. The 20:08 sample is the night state, so the day veil is off and this is as bright as the face gets. Over the open sky (r < 182, excluding the plate, registers and dragon):
   - 55,452 px;
   - median L* 6.0, mean L* 9.8;
   - only 0.89 % of pixels above L* 40 and 0.51 % above L* 50.

   The spec says "Milky Way core Y 37.9 %", but the rendered sky is still dark. The winner is the right architecture, but it does not yet look like the reference. Section 5.1 sets the acceptance target.

## 1. Verdict

**wff v2 wins.** It is the only proposal whose WFF tree I could type into Android Studio tomorrow:
- every construct is XSD-checked;
- the expressions are cross-checked against Meeus;
- AOD is measured on a raster (8.1 to 8.7 %, non-zero rule);
- memory is computed with the evaluator's V1 offload model (3.8 MB interactive, 1.3 MB ambient).

It is also structurally the closest to the photo:
- the sky turns about an **eccentric pole** at (225,114) under the dragon's arch;
- two **off-centre sub-discs**;
- an outer **brushed-grey flange** over an inner **black lacquer ring carrying the gold sun**;
- **phosphor-metal** indices in exactly the reference's three tones (#D2FFA4, #A6F46A, #4E7F34).

It is not finished:
- the sky renders dark (section 0, point 6);
- the hero is a 5 px dot;
- the registers float instead of sinking;
- there is no large sphere and no month ring;
- it has no 24 h numerals;
- a daytime veil dims the sky;
- gold leaks into the date text.

Six grafts, one from each other proposal, and six conditions fix all of that without leaving the wff tree.

## 2. Ranking

| Rank | Proposal | Main-reference fit | Buildability | AOD |
|---|---|---|---|---|
| 1 | wff | eccentric pole + 2 sub-discs, grey F2 / black F1 + gold sun, phosphor metal | XSD-verified, measured | 8.1–8.7 % measured |
| 2 | horologist | sunken moon porthole, opaque flying cage; concentric sky, green flanges | strong; Gyro and tintColor risks | 6.4 % est. |
| 3 | material | best chiaroscuro and painted moon sphere; concentric | digits invalid (TimeText Font) | 7.5 % est. |
| 4 | motion | concentric, teal mid-tone sky, one alloy flange | valid (PartText Outline), over-nested | 7.2 % est. |
| 5 | legibility | eccentric pole; dark sky | AOD clock invalid; drift moves HH:MM | 5.6 % est. |
| 6 | astronomer | eccentric pole, 3 dark rings; dark sky | 11 Reference carriers; AOD clock invalid | 8.5 % est. |
| 7 | kali | concentric, dark slate, extra teal hue | AOD clock invalid; string ternaries; AOD walk | 7.0 % est. |

**1. wff.** It is the most buildable: every construct is checked against the v4 XSD, the expressions are validated against Meeus (moon within 6.5 px), AOD is measured at 8.1 to 8.7 %, and memory is 3.8 / 1.3 MB.

On the reference:
- the stereographic chart makes the dome lip the real Seoul horizon;
- the pole sits under the dragon's arch;
- the grey F2 sits over a black F1 that carries a gold sun;
- the phosphor-metal indices use the reference's three tones.

Its weaknesses are all fixable inside its own tree: the rendered sky is dark (0.9 % of open sky above L* 40), the hero is a 5 px probe dot, the registers float rather than sink, and it lacks a large sphere, month ring and 24 h numerals. The daytime veil and the gold SCO text must go.

**2. horologist.** It has the best depth engineering after wff:
- a measured value ladder (L* 29 to 10);
- one 10:30 light everywhere;
- the only real tourbillon object, an opaque Ø32 flying cage with a carriage turning 6°/s;
- the only sunken off-centre sub-disc, the moon porthole;
- a valid WFF tree (BitmapFont AOD digits, hh_10/hh_1/mm_10/mm_1 cells, integer coordinates) and 6.4 % AOD.

It loses on the reference: everything is concentric about a pole under the colon, the sky is a lifted flat grey (#35484F) with faint stars instead of white brushwork on black, the lower third is crushed to ×0.20, and the flanges are green satin rather than grey guilloche plus a black calendar ring.

It also carries engineering risks:
- Gyro parallax with undocumented units, a config term inside the gyro expression, and sensor-rate redraws over an 800² rotating bitmap;
- an untested `tintColor` Variant;
- a cage shadow offset that rotates with its group, so the light is not world-fixed;
- 8.4 MB of 2x bakes.

**3. material.** It has the strongest chiaroscuro:
- a `dome_light` bake (glaze .20, hot-spot .22, directional terminator .62, Fresnel rim) giving L* 3 to 51;
- the only properly painted sphere, a moon with terminator, opaque dark side, lit limb turned toward the sun, and altitude gate;
- honest memory figures (4.5 / 0.93 MB).

It is not buildable as written. Its legibility rests on `Shadow` and `Outline` inside the `TimeText` Font, which `clock__timeText.xsd` forbids. With the well deleted, there is no calm-zone fallback over a sky up to L* 31. It is also concentric, has no sub-disc, has two gunmetal flanges without numerals or calendar, drops reduced motion on the watch, and has a fractional Part y.

**4. motion.**
- **Engineering, good:** it reads the schema correctly (PartText with Outline for AOD digits). It proposes an exporter gate that fails the build below ΔL* 10 at each occlusion edge, a counter-rotating wake (sky +3° anticlockwise, seconds −14° clockwise) on active-only nodes, and a real smoked plate.
- **Engineering, weak:** it over-nests Groups because of the false one-Variant-per-node belief, and the per-minute update of a PartText AOD clock is untested.
- **Reference fit, weak:** the composition is concentric. The grisaille is teal-tinted mid-tone (L* 17 to 27) rather than white on black. There is one alloy flange, the sun and moon share one lip, and there is no eccentric or sunken sub-disc.

**5. legibility.**
- **Strengths:** clean geometry (pole (225,85), horizon equal to the flange inner edge at r 176.6, an opaque floating plate, a black well for telemetry), the lowest AOD (5.6 %), and good acceptance tests (worst-case strings `99,999` and `100%`, and a luminance histogram).
- **Reference fit:** the sky is near-black (base 0.2 %, Milky Way peak 5.9 %), the opposite of bright grisaille.
- **Engineering:** the AOD digits use `Outline` inside a `TimeText` Font (invalid). The ambient drift group moves HH:MM by ±2 px and forces a reconcile jump at wake. It duplicates the whole ambient stack, needs a 632 px off-canvas pivot, and puts fractional x on PartDraws.

**6. astronomer.** It is the best astronomy: a window-edge altitude table, the moon with five longitude and one latitude term verified, the moon rising behind the dome wall, a dragon shadow that the seconds marker crosses every minute, and a seasonal day arc.

It loses on three counts:
- **Reference fit:** the sky is dark (base 0.71 %, Milky Way 5.4 %).
- **Composition:** the plate covers 46.6 % of the aperture, including the whole zenith band, and its three flange rings all sit at 1 to 3 % Y.
- **Engineering:** every shared value passes through 11 `Reference` carriers on 1 x 1 PartDraws (Wear OS 6 only, and they serve `defaultValue` while hidden), so the whole face hangs on one unverified mechanism. Its AOD clock also uses an invalid `TimeText` Font `Outline`.

**7. kali.**
- **Strengths:** a clever bake (the dragon pre-clipped and pre-shaded under the rim) and an explicit handedness test (Vega at (319,245)).
- **Hard constraint:** the default AOD walk moves HH:MM.
- **Reference fit:** it adds a second hue (abyss teal #163A3C), against one accent metal. The slate dome is dark (5.2 to 1.05 %). There is no flange pair and no sub-disc.
- **Engineering:** the month, weekday and zodiac text are 12-deep string ternaries and `LST_TEXT` is string concatenation, both unverified as WFF expressions. The primary AOD clock uses an invalid `TimeText` Font `Outline`.

## 3. Grafts into wff v2 (one per non-winner)

| From | Element | How it goes into the wff tree (450 space) |
|---|---|---|
| **horologist** | **The opaque flying cage** replaces the 5 px probe as the hero. | `Group cage_orbit` 450², pivot 0.5/0.5, angle `{E4}` (sidereal, RA 0h). Inside it, `Group cage_frame` x 207, y 20, 36 x 36, pivot 0.5/0.5, `Transform angle = 0 - ({E4})`. The counter-rotation keeps the baked light world-fixed; the horologist spec let its (+2,+2) shadow and 10:30 lip rotate with the orbit. The cage centre is (225,38), r 187, **Ø24** (Ø32 does not fit the wff ring stack). Contents: shadow ring 2 px #000 at 50 % offset (+2,+2); back-disc #0B1E26; lip Arc 200°→20° in #4E7F34; ring stroke 1.5 px as a phosphor-metal SweepGradient lit at 315°. Nested `Group carriage` 24², `Transform angle = [SECOND]*6`, holds three arms (one #A6F46A 1.5 x 9 px, two #4E7F34 1.5 x 8) and a hub Ø3.5 #EFF8EC. Lane r 175 to 199: it crosses the vault edge, the dome lip (the horizon), the trench and the inner F1, and covers the sun for ±4 days around the March equinox. It stays 11.4 px clear of the registers (outer r 163.6). AOD: ring only, alpha 90; back-disc, shadow and carriage alpha 0. |
| **material** | **The shaded-sphere bake recipe**, used twice. | (a) **Moon** goes from 22 to **26 px**. Lit limb #F4F1E6, body #E6E1D2 falling to #CFC9B8 at the terminator, dark side #1E232A at .92 (it occludes stars), halo 6 px on the lit side only. Each phase branch rotates the sprite so the lit limb faces the sun: `angle = (180 + {α☾} - {E2}) - 90` for buckets 1 to 3, `+ 90` for 5 to 7, `0` for 0 and 4. The E15 offset changes from −11 to −13. No altitude gate is needed: below the horizon the moon is already under the opaque rings or the north ground. (b) **A large painted planet cut by a ring edge**, the cue no proposal supplied. Static `dome_planet.png` r 46 centred (62,206), drawn above the moon and below `dome_light`. It is lit from 315° with the terminator crescent at the lower right: lit #D8DFE2, body #8E9C98, terminator #3A4448, opaque night #0B1013, faint bands at 6 %. Its centre is r 164 from C, so the dome lip at r 180 hides the outer 30 px of its 92 px diameter. Clearances: 5 px to the plate (x 113), 141.6 px centre-to-centre from the BAT sub-dial. Active only; AOD shows a 1 px limb arc #2C3A33, 240°→30°. Declared as dome-glass decoration, not astronomy. |
| **motion** | **Counter-rotating wake parallax on active-only nodes.** | Insert `Group sky_settle` 586², pivot 0.5/0.5, between `Group sky` (Transform `{E3}`) and `PartImage sky_active`, with `Variant mode=AMBIENT target=angle value=3 angleDirection=COUNTER_CLOCKWISE startOffset=0 duration=0.556 CUBIC_BEZIER 0.22 1 0.36 1`. `sky_aod` stays outside `sky_settle`, so AOD stars never sit 3° off. F2 keeps its −14° clockwise settle. Result: the deepest plane arrives anticlockwise (the sky's own sense) while the frame arrives clockwise, the cue that separates the planes at wake. |
| **legibility** | **AOD plate footprint brackets.** | In `plate_mask_aod`, add eight `Line`s: 18 px legs at the four plate corners (113,168), (337,168), (113,268), (337,268), stroke 1.5 px #2A3D27 (Y 4 %). Without them the glass level disappears in AOD. Cost about 430 px² (+0.27 %). Static, but below 5 % Y, so burn-in safe. |
| **astronomer** | **Seasonal day arc**, replacing the wff day-key veil as the daylight signal. | Static `PartDraw` Arc centre (225,225), 420 x 420 (r 210, on the F1/F2 step), stroke 1.5 px #DCE3E6 at 60 %, cap BUTT. `startAngle = 180 - H0`, `endAngle = 180 + H0`, where `H0 = deg(acos(clamp(-0.76920*tan(rad({E7})), -1, 1)))`. H0 is always between 70.5° and 109.5° at 37.57 N, so the arc never wraps; on 25 Oct H0 = 80.4°, giving sunrise at 260.4° and sunset at 99.6°. It is recoloured from the astronomer's gold, because gold is reserved for the sun. Active only (Variant alpha 0, startOffset 0.111, duration 0.556). It makes day length (the tropical year) readable without dimming the sky. |
| **kali** | **Dragon tucked under the outer flange.** | Move `dragon_relief` from z13 to directly below F2 (above the sun, cage and F1). Bake F2's cast shadow into the dragon PNG: black 65 % at r 211 fading to 0 at r 203, strongest on the 8 to 12 o'clock arc. The wing tips now dive under the grey flange instead of covering its batons and numerals, and the dragon sits between the two flange levels: in front of the sky, lip, trench, F1 and sun, behind F2. Its engraving bed and tight shadow onto the sky stay. The AOD mask moves with it. |

## 4. Engineering corrections to wff v2 itself

1. **The seconds trail is in the wrong z.** wff puts the `live` group at z14, above the dragon (z13), while its text says the trail "passes under the dragon's wing root". Move the trail into the cage layer. It starts at the cage's leading edge and stays below the dragon:
   - `startAngle = {E4} + 3.7`
   - `endAngle = {E4} + 3.7 + [SECOND]*6`
   - radius r 187 (width/height 374).
2. **The minute pointer and the 60 F2 minute ticks go** (see 5.2). F2 becomes the 24 h scale, and minutes are carried by the digits.
3. **Zodiac boundary ticks in the trench go.** F1's month ring replaces them, the sign stays as text, and the trench narrows to r 183 to 191.
4. **`geom2.py` and `mock.py` must be re-run** for the new radii (aperture r 180). Expect the open sky to drop from 37.3 % to about 36 %.

## 5. Conditions on the winner (main-reference cues no proposal closes)

### 5.1 Sky brightness

The target is the photo: white on black, not faint dots.

**Acceptance targets**, measured on the studio's Active render at 450 over the open sky (r < 180, excluding the plate, sub-dials, dragon and planet), at both 10:08 and 20:08:

| Metric | Target | wff mock (20:08) |
|---|---|---|
| Pixels at L* ≥ 45 (Milky Way brushwork plus star cores) | ≥ 15 % | 0.5 % above L* 50 |
| Pixels at L* ≥ 70 (brush cores, bright stars) | ≥ 4 % | 0.2 % |
| Median ground | ≤ L* 12 | 6.0 |

Under the digits, the plate's 85 % black core keeps the glyph box at ≤ L* 8 (plate core over a bright star is Y 1.67 %, L* about 13).

**How to get there:** use the studio's existing `milkyStyle: 'painted'` brushwork path at full opacity:
- cores #E4ECEE;
- clouds #9AA8AE at 85 % covering the Cyg–Cas–Per and Aql–Sgr bands, about 18 to 22 % of the chart area;
- the dust rift as ground.

Add this check to `tools/verify.cjs` and fail the build below target.

### 5.2 Two flange levels, as in the photo

**F2, the outer grey ring (r 211 to 225), becomes the 24 h scale.**
- Keep wff's brushed radial-hairline face (#7E8B91 at NW to #2E363A at SE).
- Even-hour numerals 00 to 22, 11 px #F2F6F4, centred r 218, with a 1 px #1A2024 engraved shadow below-right. Hour h sits at clock angle `(360 - 15h) % 360`: 00 at the top, 12 at the bottom, 06 at 9 o'clock, 18 at 3 o'clock.
- Twelve odd-hour phosphor-metal batons, 2 x 7 px at r 214 to 221.
- The inscription `kali@vault:~$ INFINITY` (TextCircular r 218, 11 px, 281° to 319°) moves to **10 o'clock**, where the photo carries its wordmark. It replaces numeral 04 and batons 03 and 05.
- The AOD `INFINITY` moves to the same angle at r 204.

**F1, the inner black lacquer ring (r 193 to 209), becomes the calendar ring** and turns with the cage group (angle `{E4}`):
- 12 month names as `TextCircular` (vector: no resampling shimmer, 0 bytes), 11 px #C8D1D5 at 85 %, centred r 199.5. Each name is centred at the sun's RA on the 15th at 12:00 KST, 2026, from `astro.js`:

  | Month | RA | Month | RA | Month | RA |
  |---|---|---|---|---|---|
  | JAN | 296.9° | MAY | 52.0° | SEP | 172.9° |
  | FEB | 328.7° | JUN | 83.5° | OCT | 200.1° |
  | MAR | 355.0° | JUL | 114.5° | NOV | 230.4° |
  | APR | 23.3° | AUG | 144.7° | DEC | 262.5° |

  The offset is applied clockwise from the cage.
- 73 five-day ticks (1 x 3 px, r 205 to 208, as `Line`s at each date's noon RA) and 12 month-boundary ticks (1 x 6 px).

**The sun becomes an 8-point star** (the studio's `star8` helper), Ø10, #E8B65A with a #FFE2A0 highlight and a σ3 glow, riding r 205 on the tick band.

**Readings:**
- The sun against F2's numerals is 24 h apparent solar time.
- The sun against F1's months is today's date, because sun angle minus ring angle = α☉. At 20:08 on 25 Oct, OCT sits at 52.3°, NOV at 82.6° and the sun at 62.0°, about a third of the way: the 25th.

This is the Galaxia mechanism, built with no new expression. Names on the lower half read upside down as the ring turns, like any engraved rotating ring; accepted.

**Revised radii**

| Element | r |
|---|---|
| vault | < 180 |
| dome lip (= horizon) | 180–183 |
| trench | 183–191 |
| step | 191–193 |
| F1 calendar | 193–209 |
| step + day arc | 209–211 |
| F2 24 h | 211–225 |

### 5.3 Sunken off-centre sub-discs

The BAT and STP registers keep their centres ((146,320) and (304,320), r 40) and their gauges, labels and values. Their material changes from 60 % glass to **sunken sub-dials**:
- opaque floor in black sunray guilloche, #08090A to #14191C, radial hairlines;
- inner-wall shadow 3 px black 70 % on the upper-left quadrant;
- lit lip on the lower-right;
- **phosphor-metal bezel ring** at r 38.5 to 40 (#D2FFA4 at 315°, #A6F46A, #4E7F34 at 135°).

The bake stays in `register.png` (static, so the light stays fixed). The 0.97 scale-up on wake stays as the sub-dials settling.

### 5.4 One accent metal

Every polished edge is recoloured to the phosphor-metal SweepGradient (#D2FFA4, #A6F46A, #4E7F34): the dome lip, both steps, the sub-dial bezels, the plate bevel and the cage ring. This replaces wff's greys (#A9B8BE, #B5C0C5, #8E9AA0, #95A3A9).

F2's face stays grey and F1 stays black. Gold appears only on the sun star. The `SCO` sign text becomes #9BAB9C.

### 5.5 Readable constellation figures and names

Bake 6 to 8 names into `sky_active` at 11 px #C8D1D5 70 %, letter spacing 0.15 em: ORION, TAURUS, GEMINI, LEO, BOOTES, CYGNUS, PEGASUS, SCORPIUS. Place them only where the stereographic scale is at least 1.6 px/deg (δ ≤ +30°). There are none in the circumpolar cap under the dragon. They are decoration-class.

Raise the figure lines from 1.2 px #5A6A72 at 70 % to 1.4 px #8A9AA2 at 70 %, so they read against the brighter brushwork.

## 6. Elements that must NOT survive

1. **wff's day-key veil** (#2E4A5A up to 42 % over the whole vault). It halves the Milky Way (Y 37.9 → 20.8 %) and the bright stars (82.7 → 37.8 %) in daytime, when the watch is read most, and reads as a flat film. The day arc (graft) replaces it.
2. **Any `Shadow`, `Outline` or `OutGlow` inside a `TimeText` Font**: material's Active and AOD clocks, and the kali, legibility and astronomer AOD clocks. It is invalid per `clock__timeText.xsd`. The AOD route is wff's `BitmapFont` (fallback: `PartText` with `Outline`).
3. **Anything that moves HH:MM in AOD**: kali's 1 px / 10 min walk, legibility's ±2 px drift group. It breaks the fixed-time constraint and the fill-in-place wake, and duplicates Samsung's own AOD pixel shift.
4. **Horologist's Gyro tilt parallax.** Units are undocumented; it forces sensor-rate redraws over full-screen rotated bitmaps in Active; and `[CONFIGURATION.*]` inside a gyro expression is outside `sensorSourceType`. Revisit only after the v5 port ships.
5. **Baked or offset shadows on any rotating group without counter-rotation**: horologist's cage shadow and lip; any rotating sprite with directional shading. One world-fixed light, or none.
6. **Astronomer's 11 `Reference` carriers as the only path for shared values.** Inline expressions are the default; `Reference` is optional after device test T6.
7. **Kali's abyss teal (#163A3C)**, its string-ternary month, weekday and zodiac text, and its `SEC 24 · LST 11:50` status line.
8. **wff's F2 minute pointer**, 60 minute ticks and gold `SCO` text. F2 becomes the 24 h scale; gold is for the sun only.
9. **Studio-only timings sold as watch behaviour**, such as the 180 ms asymmetric sleep. The watch plays the mirrored Variant table, so the studio shows that by default.
10. **Dropping reduced motion on the watch** (material). wff's Scene `BooleanConfiguration` stays.

## 7. Merged stack (wff v2 + grafts + conditions), back to front

| z | Layer | Clock | Source |
|---|---|---|---|
| 0 | black background | — | wff |
| 1 | `sky` Group 586² at (−68,−179), pivot = P (225,114) > `sky_settle` (+3° anticlockwise wake) > `sky_active` (bright brushwork, names); `sky_aod` 70 vector dots outside `sky_settle` | sidereal | wff + motion + 5.1/5.5 |
| 2 | moon Ø26, phase-rotated lit limb | lunar | wff + material |
| 2b | `dome_planet` r 46 at (62,206), cut by the lip | static | material (5.5 gap) |
| 3 | `dome_light` | static | wff |
| 5 | north ground crescent + horizon hairline | static | wff |
| 6 | dome lip r 180–183, phosphor metal | static | wff + 5.4 |
| 7 | trench r 183–191; step r 191–193 | static | wff, narrowed |
| 7b | F1 calendar r 193–209: black base (static) + month names and day ticks (Group angle `{E4}`) | sidereal / year | 5.2 |
| 8 | sun 8-point star Ø10 at r 205 (Group angle `{E8}`) | apparent solar | wff + 5.2 |
| 8a | day arc r 210 | day length | astronomer |
| 8b | cage Ø24 at r 187 + seconds trail r 187 (Active `[SECOND]`) | sidereal + seconds | horologist + §4.1 |
| 8c | dragon (bed, tight shadow, F2 shadow baked) | — | wff + kali |
| 9 | F2 grey guilloche: 24 h numerals, phosphor batons, inscription at 10 o'clock; −14° wake | 24 h scale | wff + 5.2 |
| 10 | plate (phosphor-metal bevel) + AOD footprint + brackets | — | wff + legibility |
| 11 | date `25 OCT / SUN / SCO` (sign #9BAB9C) | day / year | wff |
| 12 | BAT / STP sunken sub-dials | telemetry | wff + 5.3 |
| 14 | Active DigitalClock + colon | civil | wff |
| 15 | AOD BitmapFont DigitalClock (last in document order) | civil | wff |

**Wake fractions** (the device owns the window; the studio uses 360 ms):

| startOffset / duration | Layers |
|---|---|
| 0 / 0.556 | sky, plus the +3° settle |
| 0.111 / 0.556 | rings, calendar, day arc, dome light, planet |
| 0 / 1.0 | F2 (−14° → 0) |
| 0.222 / 0.667 | plate and sub-dials |
| 0.333 / 0.611 | digits cross-fade in place |
| 0.333 / 0.667 | dragon |
| 0.556 / 0.444 | sun glow, cage carriage, trail |

Every startOffset + duration is ≤ 1.0. Reduced motion uses wff's `BooleanConfiguration` copy with `duration="0"`.

## 8. Budgets after the merge

**AOD lit share.** Starting from wff's raster at 08:08 (8.66 % non-zero, the worst sample):

| Change | Effect |
|---|---|
| plate brackets | +0.27 % |
| cage ring (75 px x 1.5 px x 2 AA) | +0.14 % |
| planet limb arc | +0.08 % |
| probe dot removed | −0.01 % |
| **Total** | **≈ 9.1 %** (limit 15 %) |

Mean linear Y stays about 0.6 %.

**Burn-in:** the cage ring and stars drift sidereally; the brackets and limb arc are below 5 % Y; nothing lit beyond r 212.

**Memory** (480 device, RGBA8888):

| Item | Size |
|---|---|
| wff baseline, interactive | 3.8 MB |
| `dome_planet` (105² device) | +0.04 MB |
| moon sprites 8 x 28² | +0.03 MB |
| month names, day ticks, cage, day arc | 0 (vector) |
| **Interactive total** | **≈ 3.9 MB** (limit 100) |
| **Ambient** | **≈ 1.3 MB** (limit 10) |

New Active-only nodes carry AMBIENT alpha 0, so `isNodeSkipped` excludes them from ambient memory.

**Per-tick work:**

| Cadence | Work |
|---|---|
| per second (Active only) | the trail's `endAngle` and the carriage angle |
| per minute | sky, calendar and cage group angles; sun; moon x, y and angle |
| per day | day-arc start and end; moon phase |

Assume a full composite each second in Active. That means four full-disc layers (sky 625² rotated, `dome_light`, F2, dragon) plus small parts, which is ordinary for a WFF face with seconds. Device test T7 measures the drain.

**Expressions:**
- New: H0, the moon sprite angle, and three repeated uses of `{E4}`.
- Every argument is under 1e4 except `MINUTES_SINCE_EPOCH` (±1 min in float32, ±0.25°).
- No Reference is needed.

## 9. Build order this week (studio) and added device tests

**Studio:**
1. A `wff-expr.js` module emitting E1 to E16 and H0 as both JS functions and XML strings. `astro.js` stays the oracle, and `tools/test-astro.cjs` diffs them.
2. Sky bake: the stereographic `sky.js` path with P (225,114), k 128, and painted brushwork at full opacity. Rasterise with `tools/rasterize.cjs` and gate on 5.1.
3. Rings as vector: lip, trench, steps, F1 names and ticks, F2 numerals and batons, using `galaxia.js`'s `ringText` and `star8`.
4. Static bakes: `register.png` (sunken), `dome_planet.png`, `dome_light.png`, the dragon with its F2 shadow, plus a 1:1 480 preview and an OLED-floor toggle.
5. The wake timeline in fractions, with a transition-window slider.
6. The AOD raster check with `tools/lit_pixels.py`.

**Device tests added to wff's T1 to T11:**
- **T12:** `TextCircular` inside a rotating Group renders and rotates (fallback: a baked 480² month-ring PNG, +0.92 MB).
- **T13:** Bezel overlap of F2 numerals at r 218 ± 4 on the SM-R965N (fallback: scale the outer group 0.975).
- **T14:** The cage's counter-rotated frame keeps its shadow at (+2,+2) at four sidereal angles.

---

Files: this judgement is at `C:\Users\k\AppData\Local\Temp\claude\C--Users-k-Documents-ChatGPT-------KALIWATCH--claude-worktrees-aod-dragon-watchface-personalization-000e96\5441be5b-8cd1-47aa-a6c9-28637c7aeb8f\scratchpad\debate\04-judge-engineer.md`. The XSDs I checked are in `...\scratchpad\wfref\xsd\` (`clock__timeText.xsd`, `group__part__abstractPartType.xsd`, `common__simpleTypes__arithmeticExpressionType.xsd`, `common__attributes__geometricAttributes.xsd`, `common__localizationElement.xsd`). The mock I measured is `...\scratchpad\calc\wffv2\mock_active_2008.png`.
