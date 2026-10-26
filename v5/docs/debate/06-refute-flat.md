# 06: Owner's refutation of the final spec (05): "it will still look flat and generic"

**Verdict: refuted. Severity: major.**

I named the Galaxia photo as the main reference. Section 1 of the spec claims every cue. But the claims live in the *height* column of a table, not in pixels. When I compute what sections 2 to 5 actually put on the 450 disc, I get the v4 face with a grey rim:

- a black rounded card in the middle;
- two mirrored fitness rings under it;
- a dark sky doughnut around them;
- depth cues that are black shadows on black surfaces.

The gates in section 8.4 would pass that face.

**Evidence.** The scripts are in `scratchpad\calc\refute\` (`area.py`, `g1.py`, `dragon.py`, `fix.py`, `lum.cjs`, `luna.cjs`, `names.cjs`, `planets.cjs`). They use:

- the spec's own geometry and the E1 to E17 strings;
- the v4-frame dragon raster `calc\wffv2\dragon_mask_v4frame.bin`;
- **sRGB-space alpha blending**, which is how Android composites.

I also compared against the spec's base mock `calc\wffv2\mock_active_2008.png` and against the studio's current Galaxia sheet `refs-r3\r3-galaxia-day.png`.

## The numbers the spec does not show

| Measure (450 space, dial = 159,068 px) | Value | What the photo asks for |
|---|---|---|
| Open, unobstructed sky (r < 180, above the horizon, minus the plate, registers, globe and dragon bed) | 54,990 px = **34.6 % of the dial** (54 % of the aperture) | "It occupies most of the dial" |
| Plate share of the central r < 110 disc | **55.6 %** (open sky 35.6 %) | A calm zone "only where the digits sit" |
| Milky Way clouds at the spec's "20 % of chart area" (that is, \|b\| < 12.7°), in open sky | Median **6.7 % of the dial**. Below 15 % of open sky for 11 % of the sidereal day. | "Bright white brush-painted Milky Way clouds sweeping diagonally" |
| Structural mask that is mirror-symmetric about x = 225 | **92.6 %** of dial pixels (98.4 % without the globe) | "Layered and ASYMMETRIC" |
| Under the 85 % plate (sRGB blend): ground / cloud / core | L\* 1.1 / **7.1** / 13.8 | "Reads as glass, not as a card" |
| Register inner shadow (black 80 % on a `#000` floor) | **ΔL\* = 0** | A sunken sub-disc |
| Dragon ink over surfaces of L\* ≤ 3.8 (crescent, F1, trench, groove) | **59 %**. Another 7 % is over the phosphor lip and step (green on green). 34 % is over the sky ground (L\* 9.8). | "Dragon in phosphor metal, with relief and shadow" |
| Dragon cast shadow (+1,+2) | 2.24 px long, which is **inside its own 3 px engraving bed** | Relief |
| F2 guilloche, ±6 % at 0.5° pitch | ΔL\* ±1.3 at a 1.9 px pitch | "Fine RADIAL line texture" |
| Luna globe: visible part < 25 % lit, or the full sprite with no terminator | **41.7 % of the year** | "Painted spheres with terminators" |
| Luna terminator lit more than 90° away from the 315° key light | **43.8 % of the year** | One light |
| Constellation names whose centre is in open sky | 0 or 1 names for **49 %** of the day; never more than 4; only TAURUS at M1 | "Readable constellation figures and names" |
| Jupiter / Saturn in open sky | **23.2 % / 19.4 %** of the year. Under the plate 32.3 % / 33.6 %. At M1 and M2, no planet is visible. | Painted planets |
| Cage bright area | About 150 px² = **0.1 % of the dial**. Back-disc L\* 4.0 on a trench of L\* 1.1. | "The one bright mechanical object" |

---

## Issues (most severe first)

### 1. The composition is a mirror-symmetric dashboard: a card over two twin rings (major)

- **Where:** section 1 (cue table, row 1); section 3.1 (registers at (146,320) and (304,320)); section 3.3; section 10.1 (row "one sub-disc vs two registers").
- **Why it fails:**
  - The structural mask (plate, registers, dragon bed, crescent, rings) is 98.4 % mirror-symmetric, and 92.6 % with the globe.
  - Section 10.1 names four carriers of asymmetry. Two of them are on the axis of symmetry: P (225,114) and the horizon circle centre (225,280.4).
  - The cage is off-axis only at some times. At M2 (E4 = 2.58°) it is at 12 o'clock under the dragon.
  - That leaves one carrier, the globe, and two thirds of it is visible.
  - The director's verdict ("a rounded card, two mirrored widget rings ... read as a stock Wear OS layout") was answered with shading, not with geometry.
  - In the photo, the off-centre sub-disc houses the tourbillon and overlaps the dome edge. The spec's registers touch no ring: their outer edge is at r 167.6, 12 px inside the lip. They have no occlusion relationship with the ring stack, so they read as stickers on the sky.
- **Fix:** two values, one instrument.
  - Replace the twin registers with **one eccentric sunken sub-disc**: centre (150,338), r 56. It sits 135.6 px from C, with its outer edge at r 191.6, so the lip cuts it and the cage flies over it.
  - BAT on an outer gauge at r 52; STP on an inner gauge at r 47.
  - The 22 px values are stacked, with the 5-character steps value on top (baseline about 331) and battery below (about 357). G4 must confirm r ≤ 171; the worst corner is about r 166.
  - Mirror the luna globe to (388,206). The layout then becomes dragon at 12, globe at 3, sub-disc at 7:30, which is the photo's triangle. The lower-right sky stays open.
  - Measured with `fix.py`: open sky goes from 34.6 % to **36.7 %**, and structural pixels that differ from their mirror image go from 7.4 % to **19.0 %** of the dial.
  - Add gate **G8**: at least 15 % of structural pixels differ from their mirror image.

### 2. Every depth cue is a black shadow on a black surface (major)

- **Where:** section 2.1 (crescent `#0B0E10`, F1 `#08090A`, trench `#030405`, groove `#050607`); section 3.3 (register floor `#000`, inner-wall shadow, hairlines `#0E1215`); section 5.1 (dragon bed and shadow); section 2.2, z12 (cage shadow).
- **Why it fails:**
  - Those four "heights" have L\* 3.8, 2.4, 1.1 and 1.6. An OLED at 40 % brightness shows one black.
  - The register inner shadow is ΔL\* 0 by construction (black on black).
  - The dragon's (+1,+2) shadow lies entirely inside its own 3 px engraving bed. Where it does land, on the crescent, it goes from L\* 3.8 to 0.6.
  - The cage shadow lands on L\* 1.1.
  - The only depth signal left is 1.5 to 3 px phosphor lines: lip, step, chamfer and register lips. That is a set of concentric hairlines, which is exactly the v4 look.
- **Fix:** shading needs mid-tone surfaces to land on.
  - (a) Sub-disc floor: baked black sunray guilloche, `#1A2024` to `#2A3338` (L\* 11 to 21), so the 80 % inner-wall crescent reads.
  - (b) North crescent face: F2's grey opaline, with a guilloche concentric about the *horizon* centre (225,280.4), at L\* 25 to 40. This gives an eccentric texture, and gives the dragon's bed and shadow something to land on.
  - (c) F1: keep the black, but add a static `f1_gloss.png`: a lacquer highlight streak, white 18 %, 40° long, centred at 315°. Black then reads as gloss, not as void.
  - (d) Re-derive the shadows per issue 10.

### 3. The gates cannot tell a flat face from a deep one (major)

- **Where:** section 8.4, G1 to G6.
- **Why it fails:**
  - The gates measure brightness, presence, string fit, AOD share and the *sign* of shadow offsets.
  - None measures edge contrast, shadow visibility, asymmetry, the share of the dial that is open sky, or whether the shading reads.
  - So the brief's "at least three clearly separated depth planes ... with material shading" is unverifiable. The dragon's 2.2 px shadow passes G6.
- **Fix:**
  - **G7 depth.** Test at 1:1 480 px and 40 % brightness:
    - For each declared edge (lip, step, chamfer, horizon edge, plate bevel, sub-disc lip, dragon bed): ΔL\* ≥ 12 across the edge on at least 60 % of its length.
    - For each cast shadow: ΔL\* ≥ 8 against the receiving surface, over at least 50 % of the part beyond the caster.
    - Shadow length = 1.25 px per height unit, ±15 % (see issue 10).
  - **G8 composition.** At M1 to M3:
    - open sky ≥ 36 % of the dial;
    - the Milky Way visible under the glass (cloud L\* ≥ 12 under the plate);
    - mirror difference ≥ 15 %;
    - pixels at L\* ≥ 45 in the Milky Way ≥ 6 % of the *whole dial*.

### 4. The plate is a black card, and its "glass" rationale is computed in linear light (major)

- **Where:** section 3.2 (the transmission sentence and the contrast table); section 2.2, z15; G2.
- **Why it fails:**
  - Android blends alpha in sRGB space. At 85 % black, the ground becomes L\* 1.1, a Milky Way cloud L\* 7.1, and a core L\* 13.8. The contrasts are 18.8, 16.7 and 14.4 : 1, not 18.7, 9.0 and 5.5 : 1.
  - The spec's 5.5 : 1 assumes 15 % of linear Y (12.4 %). The watch delivers 1.69 %, about 7 times darker.
  - So the sky does **not** "continue underneath". What remains is a 224 x 100 black rounded rectangle, the most generic smartwatch element there is.
  - It covers 13.9 % of the dial and 55.6 % of the central r < 110 disc.
  - It also covers the zenith (225,177), where the season's main constellations transit. At M1, Pegasus (205,201), Aquila (288,213) and 34 % of the in-aperture Milky Way band are under it.
- **Fix:**
  - **Core 75 %** (sRGB). This still passes the spec's own G2: median L\* 1.8, cloud 14.3, core 24.7 (≤ 30), and digit contrast at 40 % of 8.2, 7.3 and 6.2 (all ≥ 4.5). The Milky Way then visibly passes under the time.
  - Optionally grade the alpha: 85 % behind the digit band (y 192 to 256), 60 % at the top edge.
  - Arch the top edge (circle centre (225,956), r 788): y 168 at x 225, 172.2 at x 144, 176 at x 113. The date's cap top at 175.3 stays inside. After this, nothing on the dial is a UI rectangle.
  - Restate every number in section 3.2 in sRGB blending, and make the studio composite in sRGB.

### 5. Open sky is a third of the dial, and the Milky Way about 7 % of it (major)

- **Where:** section 1 (cue table, row 2); section 4.3 (Milky Way); G1; section 4.9 (M3 caption).
- **Why it fails:**
  - Open sky is 34.6 % of the dial, against "occupies most of the dial". G1 is normalised to *open sky*, so it cannot see this.
  - The cloud band is a median 6.7 % of the dial. It falls to 8.6 % of open sky at LST 45° to 60°, and stays below 15 % for 11 % of the day.
  - The planets are in open sky only 23.2 % (Jupiter) and 19.4 % (Saturn) of the year, and under the plate about 33 % each.
  - At M1 and M2 **no planet is visible at all**.
  - The M3 caption "Jupiter rising on the left" is wrong: (146,176) is inside the plate.
- **Fix:**
  - Issues 1 and 4: open sky goes to 36.7 %, and the 13.9 % under the plate becomes visible smoked sky.
  - Widen the clouds to \|b\| < 15° (about 24 % of the chart), with cores along Cygnus–Aquila–Sagittarius and Perseus–Auriga.
  - Add an absolute G1 floor: bright clouds ≥ 6 % of the dial at every named moment.
  - Correct the M3 caption.
  - Add one named moment with Jupiter in open sky (for example, find one with `planets.cjs`).

### 6. The photo's bright eccentric metal ring is a dark crescent with a dim hairline behind the logo (major)

- **Where:** section 2.1 (row 2); section 2.2, z6; section 1 (cue table, row 1).
- **Why it fails:**
  - In the photo, the eccentric element is the *bright* rose-gold edge of the dome's outer section.
  - The spec paints it `#0B0E10` (L\* 3.8), with a 1.2 px edge in `phosphor.edge #5E8F40`, the dimmest metal token, with no gradient.
  - 41.8 % of the arc runs inside the dragon's bounding box (x 147 to 305, y 70 to 86).
  - The other eccentric circles, the graticule (L\* 19 on 9.8), are first in line to be cut.
  - What reads is concentric about C. Lip, trench edge, step, two F1 rules, day arc and chamfer make seven concentric lines in 32 px.
- **Fix:**
  - Bake the horizon edge as a 3 px polished phosphor bevel in a static PNG: an inner 1.2 px `#D2FFA4` on the flanks that face 315°, and an outer 1.8 px `#4E7F34`. Give the crescent face the eccentric grey guilloche from issue 2(b).
  - And/or make the dome lip itself eccentric, as the studio's r3 sheet already does (sky plate centre (229,231), r 168). For example, lip centre (220,230), r 177: the trench then varies from about 7 px at 7:30 to 21 px at 1:30, and the cage visibly crosses the lip near 7:30, where the sub-disc is.

### 7. The "one bright moving object" is a dark 24 px dot (major)

- **Where:** section 2.2, z12; section 1 (row "one bright moving object"); G5.
- **Why it fails:**
  - Ø24 is 5.3 % of the dial diameter.
  - The bright area is about 150 px² (ring 106, arms 38, hub 10), which is 0.1 % of the dial.
  - The "opaque" body `#0A0F11` (L\* 4.0) sits on a trench of L\* 1.1, so it is invisible. Its (+2,+2) shadow is invisible too.
  - At the 150 px thumbnail it is an 8 px ring with a 0.5 px stroke.
  - It is the v4 seconds marker scaled up 4.5 times, not a Cosmotourbillon, and it never sits in a sub-disc.
- **Fix:**
  - Use a Ø32 baked `cage.png` (36²), kept world-lit by the existing counter-rotation:
    - a filled phosphor-metal bridge disc (radial gradient from `#D2FFA4` at NW to `#4E7F34` at SE);
    - three paper-white arms (`#EFF8EC` with a `#9BAB9C` shade);
    - a 4 px `phosphor.hi` jewel;
    - the carriage sprite at 6·`[SECOND]`;
    - a shadow at (+5.3,+5.3), blur 2, at 60 %, landing on F1 and F2, where it shows.
  - Lane r 171 to 203. It clears the plate and deliberately flies over the sub-disc rim (issue 1).
  - G5: the cage covers at least 12 thumbnail pixels at Y ≥ 40 %.

### 8. The large painted sphere is dark, flat or wrongly lit about 40 % of the time (major)

- **Where:** section 2.2, z3; section 4.7; section 5.1 (luna tokens); section 10.1 (row 1); G5.
- **Why it fails** (`luna.cjs`, 2026-10-26 to 2027-10-26, 20-minute steps, the spec's E8, E13 and S9):
  - The visible part is less than 25 % lit **35.3 %** of the year. The lit limb turns with E8 and spends hours pointing into the hidden outer third under the rings.
  - The full-disc sprite, with no terminator, is shown 6.4 % of the time.
  - **43.8 %** of the year, the terminator is lit from more than 90° away from the 315° key light. The biggest painted object breaks section 1's "one key light for every bake".
  - M1, which is also `PREVIEW_TIME` and therefore the face-picker thumbnail, and M3 are both S9 = 8: the canonical render has no terminator.
  - Rotating the whole sprite also spins the maria once a day.
  - Section 10.1 rejected Jupiter for being absent; the globe is effectively absent for a comparable share of the time.
- **Fix:**
  - Mirror the globe to (388,206). The lip then hides its eastern (shadow) side.
  - Bake it lit from 315°, with fixed maria.
  - Show the phase as a static terminator per S9, with the lit limb fixed toward 315°, as every moon-phase complication does. Drop the E8 rotation.
  - Paint the unlit part as earthshine `#3E474D` with limb darkening, so the sphere still reads at new moon.
  - Keep at least 25 L\* of limb darkening on the full sprite.
  - Run G5's globe check over a whole synodic month, not only at M1.

### 9. There are two flange levels, but F2 is a narrow strip and its guilloche is invisible (medium)

- **Where:** section 2.1 (rows for F2, F1 and the trench); section 5.1 (`flange_f2.png`).
- **Why it fails:**
  - The F2 face is 12.5 px wide (5.6 % of the radius), and the 11 px numerals fill it. At the 150 px thumbnail it is about 4 px. The r3 sheet's flange was 23.4 px.
  - ±6 % at a 1.9 px pitch is below what a 40 mm watch can show, so F2 reads as a smooth grey gradient, not as radial guilloche.
  - Meanwhile 26 of the 45 px between r 180 and r 225 are black: trench 8, F1 16, groove 2.
- **Fix:** re-budget the radii.

  | Band | Radii | Notes |
  |---|---|---|
  | lip | 180 to 183 | |
  | trench | 183 to 187 | |
  | step | 187 to 188.5 | |
  | F1 | 188.5 to 201.5 | Names of 10 to 11 px centred on r 195. The sun rides the same track and covers a name for a few days, as in the photo. |
  | groove | 201.5 to 202.5 | |
  | chamfer | 202.5 to 204 | |
  | F2 | 204 to 225 (21 px face, baked to 228) | Numerals 13 px on r 214.5; batons r 208 to 221 |

  - Guilloche: 1.0° pitch (3.7 px), ±20 %, with every fifth line +35 %.
  - F2 area grows from 17,181 px to 28,303 px (+7 % of the dial), all textured grey.
  - Re-check the cage lane and G4.

### 10. Shadow lengths contradict the stated heights (medium)

- **Where:** section 2.1 (heights); section 3.2 (plate shadow (+3,+4)); section 5.1 (dragon shadow (+1,+2)); section 2.2, z12 (cage shadow (+2,+2)); G6.
- **Why it fails:**
  - The plate (+3 over the sky at −1, Δh 4) casts a 5 px shadow. That sets the scale at 1.25 px per height unit.
  - At that scale, the dragon (+4 over −1) should cast about 6.3 px, and the cage (+3 over the trench at −3) about 7.5 px.
  - Instead the highest object, the dragon, casts the shortest shadow (2.2 px), and that shadow is hidden in its own bed. The dragon reads as printed flat on the dial, not as "coming forward last".
- **Fix:**
  - Use one rule: offset = 1.25·Δh px along 135°, blur = 0.3·offset.
    - dragon over the sky: (+4.4,+4.4) at 60 %;
    - dragon over the crescent: (+3.5,+3.5);
    - cage: (+5.3,+5.3);
    - plate: unchanged;
    - sub-disc: none.
  - Bake `dragon_shadow.png` as a separate file (see issue 13).
  - G6 checks the magnitude to ±15 %, not only the sign.

### 11. The dragon has no relief, and Draco merges into it (medium)

- **Where:** section 5.1 (one linear dragon gradient, "no rim-light masks"); section 4.3 (Draco).
- **Why it fails:**
  - One gradient across a 180 px logo lights a sticker; it does not model 2 to 3 px strokes. v4 already had a flat green dragon.
  - Draco is drawn 1.2 px at 55 % (L\* 56), in the same hue as the dragon's SE shade `#6FA947` (L\* 63.5).
  - 80 % of Draco's annulus (19.4 to 44.7 px from P) lies inside the dragon's bounding box. "Draco under the dragon" will read as extra green scribbles inside the logo.
- **Fix:**
  - Bake the dragon at 4x with a per-stroke bevel: a 0.6 px `#EFFFD8` highlight where an ink pixel's NW neighbour is empty, and a 0.6 px `#3C6328` shade on SE edges. Add the separate shadow from issue 10.
  - Draco: `#D2FFA4` at 35 % (L\* about 43), with a 1 px `#141C24` casing wherever it runs within 4 px of ink, or drawn dotted (1.2 on, 2.4 off), so it separates from the solid logo by texture.
  - Require ΔL\* ≥ 15 between Draco and the nearest dragon stroke.

### 12. The AOD is the v4 face with stars added (medium)

- **Where:** section 7.1.
- **Why it fails:**
  - The AOD hides F2, F1, the crescent, the horizon edge and any sub-disc structure.
  - What remains is v4's AOD (`preview-ambient.png`): outline digits, a dim dragon, BAT, INFINITY, 12 ticks and one hairline.
  - The watch spends most of the day in AOD, so most glances show the old one-dimensional face. The brief requires the AOD to "look like the same face".
- **Fix:**
  - Add F2's 00, 06 and 18 numerals at 11 px `#4D633F` (about +180 px, +0.11 %).
  - Add the two visible horizon flanks as a 1 px `#2C3A33` hairline (about 440 px with AA, +0.28 %).
  - Keep the sub-disc rim.
  - The estimate becomes 9.1 + 0.39 ≈ 9.5 %, still on target and far below 15 %.

### 13. Depth motion is off by default, and the wake sells "pop", not depth (medium)

- **Where:** section 6.5 (`calm` is the default); section 6.6; section 6.1 (scale rows 0.97 and 0.975).
- **Why it fails:**
  - My own first graft ("the depth must move when I turn my wrist") ships disabled until T15, and T15 is scheduled after the build.
  - The amplitudes are 3, 1.5 and 1 px, that is 0.26, 0.13 and 0.09 mm.
  - Without Gyro, the wake's depth signal is three identical scale pops (0.97 → 1.0), which reads as a UI zoom, plus F2's 14° swing.
- **Fix:**
  - Run T15 in week 1, because it decides the default.
  - Replace the scale Variants on `dragon_relief` and `plate` with a *shadow lift*: `dragon_shadow` and `plate_shadow` become separate Active-only PartImages whose x/y Variants run from 0 to the issue-10 offsets over 120 to 360 ms. The layers then visibly rise off the dial, in order.

### 14. Constellation names are too few, often upside down, and resampled soft (medium)

- **Where:** section 4.3 (names); section 10.2 ("labels in the circumpolar cap").
- **Why it fails:**
  - There are 8 names, restricted to δ ≤ +25°.
  - Over the sidereal day, the number whose centre is in open sky is 0 for 10 % of the day, 1 for 39 %, 2 for 35 %, 3 for 14 % and 4 for 1 %. At M1 only TAURUS is visible.
  - The names are baked horizontal into a 625² bitmap that turns 360° a day, so they are upside down for half of it, and they are resampled at a new angle every minute. 11 px glyphs with stems of about 1 px go soft.
  - My own list (URSA MAJOR, CASSIOPEIA, CYGNUS, LYRA) was dropped.
- **Fix:**
  - Draw 16 to 20 names as upright `PartText` (11 px, `#B9C5CA` at 75 %) inside Groups positioned by E17, like the planets: a fixed RA/dec anchor per name. They stay crisp and upright, as in the r3 studio labels.
  - Allow the circumpolar names. Passing behind the dragon's openwork is occlusion, not clutter.
  - Dim the names to 25 % under the glass.
  - Gate: at least 4 names in open sky at every 5° of LST.

### 15. The day arc adds another concentric hairline instead of an area (minor)

- **Where:** section 2.2, z9; section 4.5 (day arc).
- **Why it fails:** the 1.5 px arc sits in the 2 px groove between F1's 1 px rule (r 208.5) and the 1.5 px chamfer (r 211 to 212.5). Three lines within 4 px merge into one at 40 mm.
- **Fix:** draw a night sector on F2 instead: an Arc on r 214.5 with the stroke as wide as the F2 face, black at 40 %, from 180 + H0 to 540 − H0. Day and night then become a large readable area on the grey flange, as on the r3 sheet. It is chiaroscuro that carries data.

### 16. The build order validates the look last (minor)

- **Where:** section 8.1 (build order).
- **Why it fails:** the first composite render is due Thursday or Friday, after three days of expression and bake engineering. The only pixels behind this spec are the wff v2 mock, which the director judged a "stock Wear OS layout".
- **Fix:** on Monday, render a source-mode mock of the revised composition (issues 1, 2, 4, 6 and 9) and run G7 and G8 on it before `wff-expr.js`.

---

## What would make me accept it

- Issues 1 to 8 are fixed, and gates G7 and G8 are in `gates.py`.
- A round-4 sheet shows the following at M1 to M3, at 1:1 480 px and 40 % brightness:
  - an asymmetric triangle of dragon, globe and sub-disc;
  - a Milky Way that visibly passes under smoked glass;
  - a grey flange at least 20 px wide, with visible radial texture;
  - a bright cage;
  - a dragon whose shadow you can see.
- The AOD shows at least one flange cue and the eccentric horizon line.
