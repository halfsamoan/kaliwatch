# KALIWATCH v5 "Celestial Vault": final design specification (05)

Status: **build spec**. Date 2026-10-26. It supersedes documents 01 to 04. The base is **wff v2**, which all three judges ranked first. This spec grafts one element from each other proposal, closes the five main-reference gaps, and makes the corrections listed in section 10. Where the judges disagreed, the decision and its reason are stated once, in section 10.1.

**Conventions**
- Design space 450 x 450, centre C = (225,225), dial radius 225.
- Device: SM-R965N, 480 x 480 round. Scale x1.0667; 1 design px is about 0.085 mm.
- Angles are degrees clockwise from 12 o'clock, as in WFF.
- `r` is the distance from C unless the text says "from P".
- One key light for every bake: from 315° (upper left), elevation 35°.
- `@n%` is alpha. Y is relative luminance (Rec. 709, linear). L\* is CIE.
- Default sample (studio and WFF `PREVIEW_TIME`): **2026-10-25 20:08:24 KST**.
- Values marked *(measured)* were recomputed for this spec by `scratchpad\calc\final\check.cjs` and `scratchpad\calc\final\expr.cjs`.

---

## 1. Concept

KALIWATCH v5 is a physical instrument seen from above and lit from 10:30. From the outside in:

- **F2:** a matte-grey, radial-guilloche 24-hour flange with white even-hour numerals.
- **F1:** below it, a black lacquer calendar ring. White month names turn with the stars, and a tiny gold sun star rides among them.
- **Dome lip and trench:** a phosphor-metal lip and a black trench, in which a small opaque cage (the Cosmotourbillon analogue) orbits once per sidereal day and pulls the phosphor seconds trail.
- **Vault:** inside the lip, the real Seoul sky in bright grisaille. It turns once per sidereal day about Polaris, which sits off-centre at P (225,114), under the arch of the official Kali dragon.
- The eccentric Seoul horizon arc closes the top of the sky like the edge of the dome's outer section.
- A large painted moon globe at 9 o'clock is cut by the dome lip. It shows tonight's phase and turns its lit face toward the sun.
- Two sunken off-centre registers carry battery and steps.
- The big fixed HH:MM floats on a smoked-glass plate placed over the Seoul zenith.

Everything structural is one accent metal: phosphor, treated as anodised metal. Gold is only the 9 px sun.

**The one memorable thing:** the official Kali dragon arches over Polaris while the real sky wheels beneath it, with the constellation Draco drawn in phosphor, once per sidereal day.

| Main-reference cue | Where it lives in v5 |
|---|---|
| Eccentric layering and an off-centre sunken sub-disc | The sky rotates about P (225,114), not C. Graticule circles are centred on P. The phosphor-edged horizon arc (circle centre (225,280.4), r 209.9) frames the top of the sky. Two sunken registers sit at (146,320) and (304,320), r 44. The luna globe sits at (62,206). |
| Bright, high-contrast grisaille | Milky Way cores `#E4ECEE`, clouds `#9AA8AE` at 85 %, 366 stars, 33 figures and 8 names, all enforced by L\* gates (section 8.4) |
| Large painted sphere cut by a ring edge | Luna globe Ø92 at (62,206). The dome lip at r 180 hides its outer third. Jupiter and Saturn are small painted spheres at their real positions. |
| Two flange levels | F2: grey radial-guilloche 24 h ring, r 211 to 225, with numerals. F1: black calendar ring, r 193 to 209, with month names, day ticks and the gold sun star. |
| One accent metal | Phosphor metal `#D2FFA4` / `#A6F46A` / `#4E7F34` on the lip, the steps, the F2 chamfer, the batons, the register lips, the cage, the horizon edge, the dragon and the colon. Gold is only on the Ø9 sun. |
| One bright moving object | Opaque cage Ø24 on r 187. It orbits counter-clockwise once per sidereal day, and its carriage turns once a minute. |
| Hard rules | HH:MM is fixed at the v4 coordinates in both modes. The official dragon keeps its v4 frame, uncut and on top. INFINITY appears on F2 and in AOD. AOD lit share is about 9.1 %. No hand-made drift. |

---

## 2. Layer stack

### 2.1 Radial structure (heights are the fiction the shading sells)

| r from C | Band | Surface | Height | Edge treatment |
|---|---|---|---|---|
| 0 to 180 | vault aperture | grisaille enamel sky | −1 | lip shadow falls inward on the NW half |
| inside r 180, outside circle (225,280.4) r 209.9 | north crescent (27.5 px thick at 12 o'clock, 0 at 67° and 293°) | dark anodised plate `#0B0E10` | 0 | horizon edge 1.2 px phosphor-metal shade `#5E8F40`; 3 px cast shadow on the sky |
| 180 to 183 | dome lip | phosphor metal, lit NW | 0 | SweepGradient (section 5.1) |
| 183 to 191 | trench | black lacquer `#030405` | −3 | carries the cage and the seconds trail |
| 191 to 193 | step | phosphor metal, lit SE (inner wall) | wall | SweepGradient, peak at 135° |
| 193 to 209 | **F1 calendar ring** | black lacquer `#08090A` | +1 | 1 px rules `#B9C5CA` at 50 % on r 193.5 and r 208.5 |
| 209 to 211 | groove | `#050607` | +0.5 | carries the day arc |
| 211 to 212.5 | F2 chamfer | phosphor metal, lit SE | wall | baked into `flange_f2.png` |
| 212.5 to 225 (baked to 228) | **F2 24 h flange** | grey radial guilloche | +2 | baked to r 228 so that Gyro shift never exposes black |

Objects above the rings: the plate (+3), the cage (+3, flying over the lip, the trench and the inner edge of F1), the dragon (+4). The registers are sunken (−1).

```
 eye
  |   +4  DRAGON (v4 frame, uncut)  ~~~~~~~~~~~~~~ wing tip touches F2 at r211 ~~~~~~~~~~
  |   +3  GLASS PLATE 85% ======[ 25 OCT / SUN / SCO   20:08 ]======   CAGE o (r187, flies over lip/trench/F1)
  |   +2  F2 grey guilloche 24h  |02 . 04 . 06 ... kali@vault:~$ INFINITY ... 22|            r211-225
  |   +1  F1 black calendar      | OCT ' ' ' ' NOV ' ' ' ' DEC   * sun        |              r193-209
  |    0  LIP (phosphor) ----- north crescent + horizon arc (eccentric) -----              r180-183
  |   -1  VAULT grisaille sky, turning about P(225,114)   LUNA globe (62,206) cut by the lip
  |   -1  REGISTERS (sunken wells, white on black)  BAT (146,320)   STP (304,320)
  |   -3  TRENCH black lacquer, seconds trail                                               r183-191
```

### 2.2 Stack table (document order = paint order, back to front)

WFF node names are the ids the studio uses. `par_sky`, `par_rings` and `par_dragon` are the Gyro wrappers, and they exist only in the `full` motion option (section 6.6).

| z | Node(s) | Shows | Clock and period | Geometry (450 space) | Material | Active | AOD | Build |
|---|---|---|---|---|---|---|---|---|
| 0 | `Scene backgroundColor` | void | none | full disc | `#000000` | on | on | Scene attribute |
| 1 | `par_sky` > `sky` (Group x −68, y −179, 586 x 586, pivot 0.5/0.5 = P) > `sky_settle` (Group 0, 0, 586 x 586, pivot 0.5/0.5) > `sky_active` (PartImage 586²) | Real Seoul sky: 366 stars, 33 figures (Draco in phosphor), painted Milky Way, PPI graticule, 8 constellation names | **Sidereal day.** Angle E3 = 360 − LST, counter-clockwise 0.25068°/min, period 23 h 56 m 04.09 s | Chart r = 128·tan((90°−δ)/2) from P. Covers δ ≥ −42.8°. Visible through r < 180 and inside the horizon circle. | Bake, section 4.6 | alpha 255 | alpha 0, parked at +3° | bitmap + `Transform angle`; settle Variant |
| 1b | `sky_aod` (PartDraw 586² inside `sky`, **outside** `sky_settle`) | 73 stars of mag ≤ 2.5, plus Draco | sidereal (same angle) | dots Ø1.6; Draco 14 segments, 109 px *(measured)* | dots `#5A6870`; Draco 1.2 px `#4D633F` | alpha 0 | 255 | PartDraw Ellipses + Lines |
| 2 | `jupiter` (Group 20 x 20), `saturn` (Group 30 x 16), with x/y Transforms | The real planets at their geocentric positions | Planet ephemeris (E15, E16) plus sidereal | Jupiter Ø16, r ≈ 99 from P in 2026. Saturn Ø11 plus a 26 x 7 ring. | Grisaille sphere, world-fixed light from 315° (sprites never rotate). Jupiter has 2 bands; Saturn's ring is tilted −20°. | on | hidden | PartImage in positioned Group |
| 3 | `luna` (Group x 12, y 156, 100 x 100, pivot 0.5/0.5, angle E8) > `Condition` S9 = 0..8 > `luna_0..8` | Lunar phase globe. Its lit face turns toward the sun. | **Synodic month** 29.53 d (9 phase steps of 22.5° elongation). Lit-limb bearing follows the sun (24 h). | Centre (62,206), Ø92, spanning r 118 to 210. The lip cuts it at r 180, so about 62 of its 92 px width shows. | Grisaille sphere (section 5.1) | on | `luna_aod`: lit-limb Arc r 45, 180° centred on the sun bearing, 1.2 px `#6B7A80`; hidden when S9 = 0 | PartImage sprites / PartDraw Arc in the same rotated Group |
| 4 | `dome_light` (PartImage 364² at (43,43)) | The fixed light on the vault | none (observer-fixed) | disc r 182 | NW glaze, SE fall-off, lip inner shadow, pole reticle (section 4.6) | on | alpha 0 | bitmap |
| 5 | `par_rings` > `occluder` (PartDraw) | Hides everything beyond the lip in AOD | none | Ellipse centred on C, r 211, stroke 58 (covers r 182 to 240) | `#000000` | on (under the rings) | on | PartDraw, both modes |
| 6 | `north_ground` (both modes) + `crescent_face` (Active) | Seoul's northern horizon, which is also the eccentric outer plate of the dome | none | Stroked Ellipse centred (225,280.4) covering r 209.9 to 240 from that centre. Horizon arc from −52.9° to +52.9° about (225,280.4); it meets the lip at 67° and 293° about C. | Ground `#000`. Face `#0B0E10`. Edge Arc r 209.9 at 1.2 px `#5E8F40`. Shadow Arc r 208.5, 3 px, black 45 %. | face on | ground on (0 lit px); face alpha 0 | PartDraw Ellipse + Arcs |
| 7 | `rings` / `rings_aod` | Lip, trench, step, F1 base, F1 rules, groove | none | radial table 2.1 | Lip SweepGradient lit at 315°; step lit at 135° | on | `rings` alpha 0. `rings_aod`: lip hairline r 181.5, 1 px `#2C3A33`, plus 12 ticks r 200 to 208, 1.25 px `#4D633F`, every 30° | PartDraw Ellipses / Lines |
| 8 | `calendar` (Group 450², pivot 0.5/0.5, angle E4) | Month names and day ticks. The sun's place among them is the date. | **Fixed to the RA frame** (rotates sidereally). Read against the sun it gives the **tropical year**. | F1 band. Month rules r 194 to 208. Ticks r 194.5 to 197 (5th, 15th, 25th) and r 194.5 to 199.5 (10th, 20th). Names centred on r 203.5. | Names `#C8D1D5` at 85 %. Ticks `#8A979C` / `#C8D1D5`. Rules `#B9C5CA` at 60 %. | on | alpha 0 | PartDraw Lines + 12 `TextCircular` (fallback: PNG, section 9.5) |
| 9 | `day_arc` | Hours of daylight on the 24 h scale | Day length; changes daily over the tropical year | Arc centred on C, r 210, from 180 − H0 to 180 + H0 (H0 = 70.5 to 109.5 *(measured)*) | 1.5 px `#DCE3E6` at 60 % | on | alpha 0 | PartDraw Arc with Transforms |
| 10 | `sun` (Group 450², pivot 0.5/0.5, angle E8) > `sun_active` / `sun_aod` | The true sun. Read against F2 it gives apparent solar time; read against F1 it gives the date. | **Apparent solar day**: counter-clockwise about 0.25°/min ± equation of time. Moves clockwise against F1 by 0.9856°/day. | Sprite centre on r 197, i.e. (225,28) before rotation (PartImage 16 x 16 at (217,20); integer x/y) | Gold star8 Ø9 `#E8B65A`, centre `#FFE2A0`, glow ≤ 3.5 px | on | dot Ø6 `#8A6A2C` | PartImage / PartDraw |
| 11 | `live` > `trail` | Seconds | **second**, 60 s | Arc centred on C, r 187, `startAngle` = E4 + 3.7, `endAngle` = E4 + 3.7 + 6·`[SECOND]` | 1.6 px `#A6F46A` at 80 %, BUTT cap | on | alpha 0 | PartDraw Arc |
| 12 | `cage_orbit` (450², angle E4) > `cage_frame` (x 207, y 20, 36 x 36, pivot 0.5/0.5, angle **−E4**) > `carriage` (angle 6·`[SECOND]`) / `cage_aod` | The Cosmotourbillon analogue. It marks RA 0h, the vernal point. | Orbit: **sidereal**, counter-clockwise. Carriage: **60 s**, stepped. | Ø24 on r 187, so its lane is r 175 to 199. Centre (225,38) at angle 0. | Shadow ring (+2,+2) black 50 %. Back-disc Ø21 `#0A0F11`. Ring 1.5 px phosphor metal lit NW (world-fixed by the counter-rotation). Arms: 1 x `#A6F46A` 9 px, 2 x `#4E7F34` 8 px, all 1.5 px. Hub Ø3.5 `#EFF8EC`. | on | ring only, 1.2 px `#5E7A55` | PartDraw in nested Groups |
| 13 | `f2` (Group x −3, y −3, 456 x 456, pivot 0.5/0.5) > `flange_f2` (PartImage 456²) | The 24 h solar scale and the prompt inscription | static scale for the sun | r 211 to 228 baked. Numerals centred on r 218.5. | Section 5.1 | on | alpha 0, parked at −14° | bitmap; wake Variants |
| 14 | `infinity_aod` | INFINITY signature | none | TextCircular r 204, centred at 180°, 11 px | `#7F9472`, letter spacing 0.18 em | alpha 0 | on | TextCircular |
| 15 | `plate_mask_aod` + `plate` | Smoked-glass calm zone under the digits | none | RoundRectangle x 113 to 337, y 168 to 268, corner 18. PNG 240 x 116 at (105,160). | Core black 85 %, bevel, shadow (section 3.2) | plate on | mask on: black plate plus 2 black register discs r 44 | PartDraw / bitmap |
| 16 | `date` + `sign` (12-branch Condition) / `date_aod` | Civil date and the sun's zodiac sign | Civil day; sign from E11 | baseline 186, x 144 to 306 | 15 px `#9BAB9C` | on | `25 OCT / SUN` in `#7F9472` | PartText |
| 17 | `reg_bat`, `reg_stp` / `reg_bat_aod` | Battery and steps | live sensors | discs r 44 at (146,320) and (304,320) | Sunken well (section 3.3) | on | BAT only: rim 1 px `#2C3A33` + `78%` 17 px `#7F9472` | bitmap + PartDraw Arcs + PartText |
| 18 | `par_dragon` > `dragon_relief` / `dragon_aod` | Official Kali dragon, path unchanged | none | Frame (135,24) 180 x 123. Ink x 147 to 305, y 23 to 139, 1,586 px. Max r 211.0 at (162,23) *(measured)*. | Phosphor-metal fill, engraving bed, tight shadow (section 5.1) | on | `dragon_mask` tinted `#4E6644` | bitmap |
| 19 | `clock_active` + `colon` | HH:MM | civil minute | section 3.1 | Roboto Mono SemiBold 78 `#EFF8EC`; colon `#A6F46A` | on | alpha 0 | DigitalClock + PartText |
| 20 | `colon_aod` + `clock_aod` (**last in document order**) | HH:MM asleep | civil minute | same boxes as z19 | BitmapFont `kw_outline`: 1.4 px `#91AD80` outline on `#0C160B` fill | alpha 0 | on | DigitalClock with BitmapFont |

**Time scales on the face (nine):**

| Time scale | Where it shows |
|---|---|
| second | trail and carriage |
| civil minute and hour | HH:MM |
| apparent solar day | sun vs F2 numerals |
| day length | day arc |
| sidereal day | sky about P; cage and calendar about C |
| tropical year | sun among the month names, and the `SCO` sign |
| synodic month | luna globe |
| planetary motion | Jupiter, Saturn |

---

## 3. Composition

### 3.1 Coordinates

| Element | Position | Size / colour | Notes |
|---|---|---|---|
| HH | Hour centre x 166, baseline 252. `DigitalClock` x 119, y 186, w 212, h 86; `TimeText format="hh" hourFormat="24" align="CENTER"` at x 0, w 94, h 86 | Roboto Mono SemiBold 78, `#EFF8EC` | Never moves or scales, in either mode or during any transition |
| colon | x 225, baseline 248. PartText x 215, y 182, w 20, h 86 | `#A6F46A`; AOD `#0C160B` + Outline `#91AD80` 1.4 | No blink |
| MM | Minute centre x 284, baseline 252. `TimeText format="mm"` at x 118, w 94 | as HH | |
| digit ink box | x 123 to 327, y 196.5 to 252 | | Plate margins: 10 px at the sides, 28.5 px above, 16 px below |
| plate | RoundRectangle x 113 to 337, y 168 to 268, corner 18 | section 3.2 | Corners within r 132 of C |
| date | PartText `25 OCT / SUN / ` at x 144, w 135, align START, plus `sign` PartText at x 279, w 27. Baseline 186. | 15 px Regular `#9BAB9C`, 9 px advance | Cap top 175.3 (7.3 px under the plate edge, 10.5 px above the digits). Always 18 characters. |
| dragon | Frame (135,24) 180 x 123 (PNG 190 x 140 at (130,19)) | phosphor metal | Lowest ink in the pole column (x 222 to 228) is at y 90, so P is 24 px clear *(measured)* |
| pole P / Polaris | (225,114) | reticle 7 px | Polaris is 0.8 px from P |
| zenith | (225,177) | | under the date line |
| luna globe | centre (62,206), Ø92 | | 5 px from the plate edge (x 113). 141.6 px from the BAT register centre. |
| cage | r 187, Ø24, lane r 175 to 199 | | 7.4 px clear of the registers (outer edge r 167.6). Never enters r < 175. |
| seconds trail | r 187, from the cage rim, clockwise | | |
| sun | r 197, Ø9 (spans r 192.5 to 201.5, over the day ticks) | | |
| BAT register | Centre (146,320), r 44. Label `BAT` baseline 307. Value baseline 329. Gauge r 40. | label 11 px, value 22 px | Value corner 34.2 px from the register centre, 4.9 px inside the gauge; 148.1 px from C *(measured)* |
| STP register | Centre (304,320), same layout | `6,240`, `12.3k`, at most `99.9k` (5 characters) | Value corner 152.8 px from C *(measured)* |
| prompt | F2 at 6 o'clock: TextCircular r 218.5, 161° to 199°, reading upright | 11 px: `kali@vault:~$ ` in `#B9C5CA`, `INFINITY` in `#A6F46A` | Decoration on the ring. Replaces numeral 12 and batons 11 and 13. |
| AOD BAT | (146,320), value baseline 326 | 17 px `#7F9472` | |
| AOD INFINITY | r 204, centred at 180° | 11 px | |

- **Safe radius:** information text stays within **r 171**; the largest value in use is 152.8 for the STP value corner.
- The instrument band is r 175 to 225.
- In AOD nothing is lit beyond **r 212**, which keeps the 10 px edge band clear.

**Worst-case strings, all checked to pass:**

| Field | Worst case |
|---|---|
| steps | `99.9k`; `9,999` is also 5 characters |
| battery | `100%` |
| time | `23:58` and `08:08`, both tabular |
| date | always 18 characters |

### 3.2 How the digits are protected: the smoked-glass plate

- **Core:** black at 85 % (alpha 217) over the whole RoundRectangle. The sky continues underneath at 15 % transmission, so stars and the Milky Way pass under the time and the plate reads as glass, not as a card.
- **Bevel:** 1.5 px `#B9C5CA` at 60 % along the top and left edges, fading to 0 by the bottom-right corner. There is **no** black lip on the bottom or right.
- **Shadow:** (+3,+4), blur 3, black 75 %, falling outside the rectangle onto the sky.
- **Contrast** of `#EFF8EC` against what passes underneath, through the glass:

| Underneath | Contrast |
|---|---|
| median sky `#141C24` | **18.7 : 1** |
| Milky Way cloud `#9AA8AE` | **9.0 : 1** |
| core or bright-star pixel `#E4ECEE` | **5.5 : 1** (worst case, on a 2 to 3 px spot) |

- **Gate (section 8.4):** the median L\* of the digit box is ≤ 8 and its 99th percentile is ≤ 30, at the named moments M1 to M6.
- Nothing is drawn above the plate core except the digits, the colon and the date.

### 3.3 The registers (sunken off-centre sub-discs)

`register.png` is 96 x 96, one resource drawn twice: at (98,272) for BAT and at (256,272) for STP. Contents:

- **Floor:** `#000` with sunray hairlines `#0E1215` every 3°, from r 6 to r 38.
- **Inner-wall shadow:** a crescent, black 80 % at r 44 fading to 0 at r 34, weighted by max(0, cos(θ − 315°)).
- **Lip** r 42.5 to 44: phosphor metal at 60 % on the lit far wall (the 45° to 225° arc, peak at 135°); `#0E1215` elsewhere.
- **No outward drop shadow**, because a sunken disc casts none.

Vectors drawn on top:

- **Gauge track:** Arc r 40, 1.8 px `#17291D`, full circle.
- **Value arc:** Arc r 40, 1.8 px `#A6F46A`, ROUND cap, from 0° to 360·fraction. The battery arc turns `#F3C479` at ≤ 15 %.
- **Label:** `BAT` / `STP`, 11 px Medium `#9BAB9C`, letter spacing 0.08 em.
- **Value:** 22 px Medium `#EFF8EC`, centred.

---

## 4. Astronomy model

### 4.1 Site and time base

| Item | Value |
|---|---|
| Site | Seoul, 37.5665 N, 126.978 E. Hard-coded as a personal face. |
| Clock source | `[MINUTES_SINCE_EPOCH]` (UTC, WFF v3+, in the v4 enum). Correct across time zones and DST; the sky shown is always Seoul's. |
| Epoch | 2026-01-01 00:00 UT = 29,453,760 min = JD 2461041.5. Re-anchor the constants after 2040 (float32 resolution). |
| Studio oracle | `astro.js` (Meeus: sun, moon, LST), plus the new `planets.js` (JPL approximate Keplerian elements, 1800 to 2050) |

### 4.2 Projection and orientation

- North-polar **stereographic**: r(δ) = 128·tan((90° − δ)/2) px from P (225,114).
- Looking-up planisphere: north up, **east left, west right**, south at the bottom.
- A star at RA α (degrees) is painted at clock angle 180° + α about the bitmap centre when LST = 0. The sky Group turns by E3 = 360 − LST, so stars move counter-clockwise, rising on the left and setting on the right.

| Feature | Position |
|---|---|
| Zenith | (225,177) |
| North point | (225,70.5) |
| Horizon | Exact circle, centre (225,280.4), r 209.9 (`moon_vis.cjs`: 0 sign mismatches in 8,760 samples) |

- **Aperture:** r < 180 about C. It lies inside the horizon circle everywhere except the north crescent, so **everything visible is above the horizon**. At the bottom edge, the lip is at about +9.6° altitude in the south.
- **Southern reach:** δ −42.8° at culmination.

**Scale:**

| Where | Scale | Example |
|---|---|---|
| near the pole | 0.99 px/deg | Dubhe to Alkaid 31 px |
| δ 0 | 2.23 px/deg | Betelgeuse to Rigel 42 px |
| δ −40 | 6.3 px/deg | |

### 4.3 Catalogue, figures, names

- **Stars:** `stars.js`, 366 stars (73 of mag ≤ 2.5, 137 of mag ≤ 3.0). Rendering:

| Magnitude | Core | Colour |
|---|---|---|
| ≤ 1.0 | Ø3.2 + 1 px bloom at 40 % | `#E4ECEE` |
| 1.0 to 3.0 | Ø2.4 | `#B9C5CA` |
| 3.0 to 4.5 | Ø1.8 | `#7C888E` |
| figure members fainter than 4.5 | Ø1.4 at 70 % | `#7C888E` |

  No core is below 1.4 px, so stars survive rotation resampling.
- **Figures:** all 33 in `stars.js`: UMa UMi Cas Cep **Dra** Cyg Lyr Aql Ori Tau Gem CMa CMi Leo Vir Boo Sco Sgr Per And Peg Aur CrB Her Oph Crv Lib Ari Cnc Cet Eri Del Sge.
  - Lines 1.4 px `#8A9AA2` at 70 %.
  - **Draco:** 14 stars, 1.2 px `#A6F46A` at 55 %. Eltanin and Rastaban are Ø2.6 phosphor dots. Draco lies 19.4 to 44.7 px from P *(measured)*, inside the circumpolar cap, so it wheels through the dragon's openwork all day. It is the only colour on the grisaille, and it has **no** label.
- **Names:** 8, at 11 px `#B9C5CA` at 70 %, letter spacing 0.12 em, baked horizontal in the bitmap frame, so they rotate like a planisphere: **ORION, TAURUS, GEMINI, LEO, VIRGO, AQUILA, PEGASUS, SCORPIUS**.
  - Only figures with mean δ ≤ +25° qualify, where the scale is ≥ 1.59 px/deg and an 11 px name is smaller than its figure.
  - The circumpolar cap is under the dragon and stays unlabelled.
- **Milky Way:** `sky.js` `milkyStyle: 'painted'` at full opacity, along the `stars.js` centreline.
  - Tones: wisps `#2E3A42`, mid `#56646C`, clouds `#9AA8AE` at 85 %, cores `#E4ECEE`.
  - The Great Rift (Cygnus to Aquila) is cut back to `#2E3A42`.
  - Clouds cover about 18 to 22 % of the chart area.

### 4.4 PPI graticule (radar DNA, Active only, first to cut)

Baked into `sky_active`, so it rotates with the sky against the static F2.

| Element | Spec |
|---|---|
| Declination circles about P | +60 / +30 / 0 / −30°, at r 34.3 / 73.9 / 128.0 / 221.7: 1.0 px `#A6F46A` at 10 % |
| RA spokes | every 30° (2 h), from r 40 to r 293 (blank centre): 1.0 px `#A6F46A` at 8 % |

It is removed if the 150 px thumbnail gate (section 8.4, G5) reads it as clutter.

### 4.5 Sun, zodiac, calendar, day arc

- **Sun:** true sun (apparent longitude E5, RA E6, declination E7). Its dial angle is E8 = 180 + α☉ − LST.
  - Solar noon is at 180° (bottom), midnight at 0° (top), sunrise on the left and sunset on the right.
  - The sun is read against the F2 numerals: hour h sits at angle (360 − 15h) mod 360. At 20:08 KST on 25 Oct the sun is at 62.0°, which is 19:52 apparent solar time *(measured)*.
- **Calendar (F1):** the ring is fixed in the RA frame (Group angle E4 = 180 − LST). A mark at local angle α appears at 180 + α − LST, so the sun at E8 sits at its own RA on the ring.

  Month rules sit at the sun's RA on the 1st of each month; names are centred at the sun's RA on the 16th at 12:00 KST. Values for 2026 *(measured)*:

  | Month | 1st | Name | Month | 1st | Name | Month | 1st | Name |
  |---|---|---|---|---|---|---|---|---|
  | JAN | 281.1 | 298.0 | MAY | 37.9 | 52.9 | SEP | 159.9 | 173.8 |
  | FEB | 314.2 | 329.6 | JUN | 68.6 | 84.6 | OCT | 186.9 | 201.1 |
  | MAR | 341.6 | 355.9 | JUL | 99.6 | 115.5 | NOV | 215.8 | 231.4 |
  | APR | 10.0 | 24.3 | AUG | 130.9 | 145.6 | DEC | 246.7 | 263.6 |

  - Day ticks on the 5th, 10th, 15th, 20th and 25th are placed at the sun's RA on those dates, computed by the generator from `astro.js`.
  - The ring drifts by less than 0.25° per year, a leap-cycle error of under 1 day.
  - Check: at 20:08 on 25 Oct, the sun's RA is 209.88°, between the 20th and 25th ticks of OCT.
- **Equinox eclipse:** the cage sits at RA 0h, on the inner track between MAR and APR. It covers the sun from about Mar 17 to Mar 24 (for example 2027-03-21 12:00 KST: cage at 189.6°, sun at 189.9° *(measured)*). This is intended: the opaque cage hides the sun's glow without special handling.
- **Zodiac sign** (date line): E11 = floor(λ☉ / 30) gives ARI TAU GEM CNC LEO VIR LIB SCO SGR CAP AQR PSC. It is the only zodiac reading, in `#9BAB9C`, not gold.
- **Day arc:** H0 = 90 + deg(asin(clamp(0.76920·tan(δ☉), −1, 1))). This is acos written through asin, with tan 37.5665° = 0.76920.
  - Range 70.5° to 109.5° *(measured)*; 80.4° on 25 Oct.
  - The arc is never wrapped: it runs from 180 − H0 (sunset, right) clockwise through 180 to 180 + H0 (sunrise, left).

### 4.6 Bakes for the vault

**`sky_active.png`** (586 x 586 design, 625 x 625 device). Bake order:

1. ground `#141C24` (Y 1.1 %, L\* 9.8);
2. Milky Way;
3. graticule;
4. figure lines (Draco last);
5. stars;
6. Eltanin and Rastaban;
7. names.

**`dome_light.png`** (364², at (43,43), the r 182 disc):

- **Glaze:** white, radial at (150,150), σ 95, 12 % peak.
- **SE fall-off:** black alpha = 0.40·smoothstep(130, 180, r)·max(0, cos(θ − 135°)).
- **Lip inner shadow:** black 50 % at r 180 fading to 0 at r 172, weighted by max(0, cos(θ − 315°)).
- **Pole reticle:** a 7 px cross of two 1 px lines with a 2 px gap at the centre, at P, `#A6F46A` at 80 %. This is the terminal cursor on Polaris.

### 4.7 Moon phase (luna globe)

- Moon longitude E12 (Meeus, truncated; ≤ 0.64° error against `astro.js`).
- Elongation E13 = (λ☾ − λ☉) mod 360.
- 16-step bucket B16 = floor(((E13 + 11.25) mod 360) / 22.5). Sprite index S9 = B16 if B16 ≤ 8, else 16 − B16 (0 = new … 8 = full).
- Sprite k is drawn with its lit limb at local "up" and a terminator for elongation k·22.5°. The Group is rotated by E8, so the lit hemisphere always faces the sun pointer.

Samples:

| Time | Elongation | S9 | Globe angle |
|---|---|---|---|
| 20:08 on 25 Oct | 170.5° | 8 (full) | 62° |
| 2026-06-21 12:00 | 80.7° | 4 (quarter) | |

The globe is a **phase instrument mounted in the dome**. It is not a sky position, and there is no second moon on the chart.

### 4.8 Planets

Geocentric positions from a circular Earth plus a planet orbit with an equation of centre (β = 0), as WFF expressions E15 and E16. Checked against JPL approximate elements, 2026 to 2030 *(measured)*:

| Planet | Max RA error | Max dec error | 2026-10-25 |
|---|---|---|---|
| Jupiter | 0.74° | 1.42° | RA 145.7° (9.71 h), δ +14.4° |
| Saturn | 1.03° | 2.63° | RA 9.7°, δ +1.3° |

Both errors are under 3 px on the chart. Planets below the horizon fall outside the aperture or under the north crescent, so no visibility gate is needed.

### 4.9 Expressions (WFF form; the studio evaluates the same strings, section 8.2)

`W(x)` stands for `((x) % 360 + 360) % 360`, written out in the XML. `%` keeps the sign of the dividend.

| # | Name | Expression |
|---|---|---|
| E1 | d, days since epoch | `([MINUTES_SINCE_EPOCH] - 29453760) / 1440` |
| E2 | LST | `W(227.64 + 360*fract(E1) + 0.98564737*E1)` |
| E3 | sky angle (Group `sky`) | `W(360 - E2)` |
| E4 | calendar / cage angle | `W(180 - E2)` |
| E5 | λ☉ | `280.667 + 0.98564736*E1 + 1.9146*sin(rad(357.282 + 0.98560028*E1)) + 0.02*sin(rad(2*(357.282 + 0.98560028*E1)))` |
| E6 | α☉ | `E5 - 2.4657*sin(rad(2*E5)) + 0.0529*sin(rad(4*E5))` |
| E7 | δ☉ | `deg(asin(0.39777*sin(rad(E5))))` |
| E8 | sun angle (also the luna Group angle) | `W(180 + E6 - E2)` |
| E9 | H0 | `90 + deg(asin(clamp(0.76920*tan(rad(E7)), -1, 1)))` |
| E10 | day arc | `startAngle = 180 - E9`, `endAngle = 180 + E9` |
| E11 | sign index | `floor(W(E5) / 30)` |
| E12 | λ☾ | `67.966 + 13.17639648*E1 + 6.289*sin(rad(6.669 + 13.06499295*E1)) + 1.274*sin(rad(2*(147.299 + 12.19074912*E1) - (6.669 + 13.06499295*E1))) + 0.658*sin(rad(2*(147.299 + 12.19074912*E1)))` |
| E13 | elongation | `W(E12 - E5)` |
| E14 | luna sprite | B16 = `floor(((E13 + 11.25) % 360) / 22.5)`; S9 = `(B16 <= 8) ? B16 : 16 - B16`. Nine named boolean `Expression`s, `s0` … `s8`. |
| E15 | Jupiter λ, α, δ | `LJ = 103.430 + 0.08308677*E1`; `MJ = LJ - 14.73`; `lJ = LJ + 5.546*sin(rad(MJ))`; `rJ = 5.2029*(1 - 0.0484*cos(rad(MJ)))`; `XJ = rJ*cos(rad(lJ)) + cos(rad(E5))`; `YJ = rJ*sin(rad(lJ)) + sin(rad(E5))`; `λJ = deg(atan(YJ/XJ)) + ((XJ < 0) ? 180 : 0)`; `δJ = deg(asin(0.39777*sin(rad(λJ))))`; `αJ = λJ - 2.4657*sin(rad(2*λJ)) + 0.0529*sin(rad(4*λJ))` |
| E16 | Saturn | Same form with `LS = 7.807 + 0.03347054*E1`, `MS = LS - 92.60`, centre term `6.172`, `rS = 9.5367*(1 - 0.0539*cos(rad(MS)))` |
| E17 | chart position of a body (α, δ), Group top-left | `R = 128*tan(rad((90 - δ)/2))`; `θ = 180 + α - E2`; `x = 225 + R*sin(rad(θ)) - w/2`; `y = 114 - R*cos(rad(θ)) - h/2` |
| — | cage counter-rotation | `cage_frame angle = 0 - E4` |
| — | carriage | `[SECOND] * 6` |
| — | trail | `startAngle = E4 + 3.7`, `endAngle = E4 + 3.7 + [SECOND]*6` (3.7° = asin(12/187)) |
| — | battery arc | `endAngle = 360 * [BATTERY_PERCENT] / 100`; colour `Transform`: `[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(166,244,106)` |
| — | steps arc | `endAngle = 360 * clamp([STEP_COUNT] * 1.0 / [STEP_GOAL], 0, 1)` |
| — | steps text | `Condition [STEP_COUNT] >= 10000`: Template `%s.%sk` with `round(floor(clamp([STEP_COUNT],0,99999)/1000))` and `round(floor((clamp([STEP_COUNT],0,99999) % 1000)/100))`; otherwise `numberFormat("#,###", [STEP_COUNT])` |

**Validation samples** (`expr.cjs`, minute-truncated):

| KST | LST (E2) | E4 | E8 (sun) | H0 | sign | S9 | Jupiter (x,y) | Saturn (x,y) |
|---|---|---|---|---|---|---|---|---|
| 2026-10-25 20:08 (M1) | 327.83 | 212.17 | 62.04 | 80.4 | SCO | 8 | (221,14): set, under the crescent | (147,205): behind the glass |
| 2026-10-25 10:08 (M2) | 177.42 | 2.58 | 212.06 | 80.6 | SCO | 7 | (278,199) | (248,−4): set |
| 2026-10-26 04:30 (M3) | 93.68 | 86.32 | 296.53 | 80.3 | SCO | 8 | (146,176) | (344,124): open sky |
| 2027-03-21 12:00 (M4) | 350.39 | 189.61 | 189.86 | 90.1 | ARI | 7 | (176,30) | (179,220) |
| 2026-06-21 12:00 (M5) | 81.31 | 98.69 | 188.46 | 109.5 | GEM | 4 | (170,183) | (334,156) |

M6 is 2026-10-25 08:08, the worst case for AOD lit pixels.

---

## 5. Palette, typography, strokes

### 5.1 Tokens

| Token | Hex | Y | Role |
|---|---|---|---|
| `phosphor.hi` | `#D2FFA4` | 87.9 % | Metal highlight: NW edges, peaks of the lip gradient, baton highlights, dragon NW |
| `phosphor` | `#A6F46A` | 73.9 % | Identity: colon, trail, gauge fill, carriage arm, Draco, reticle, INFINITY, graticule (at 8 to 10 %) |
| `phosphor.shade` | `#4E7F34` | 17.1 % | Metal shade: SE edges, minor carriage arms |
| `phosphor.edge` | `#5E8F40` | 22.4 % | Horizon edge of the north crescent |
| `paper` | `#EFF8EC` | 91.5 % | Digits, register values, F2 numerals, cage hub |
| `quiet` | `#9BAB9C` | 38.5 % | Date line, register labels |
| `transfer` | `#B9C5CA` | 54.5 % | Printed inscriptions: prompt, ring rules, constellation names, plate bevel |
| `transfer.month` | `#C8D1D5` | 62.7 % | Month names (at 85 %), 10th / 20th ticks |
| `tick.day` | `#8A979C` | | 5th / 15th / 25th ticks |
| `sky.ground` | `#141C24` | 1.1 % | Vault base |
| `sky.wisp` / `sky.mid` / `sky.cloud` / `sky.core` | `#2E3A42` / `#56646C` / `#9AA8AE` / `#E4ECEE` | | Grisaille Milky Way |
| `star.1` / `star.2` / `star.3` | `#E4ECEE` / `#B9C5CA` / `#7C888E` | | Stars by magnitude |
| `figure` | `#8A9AA2` | | Constellation lines (at 70 %) |
| `opaline.hi` / `opaline.mid` / `opaline.lo` | `#6E7B81` / `#4A555B` / `#2E363A` | 19.0 / ~9 / 3.5 % | F2 sweep: 315° / 45° and 225° / 135° |
| `engrave` | `#1A2024` | | F2 quarter-hour ticks, numeral shadow |
| `lacquer.trench` / `lacquer.f1` / `groove` / `crescent` | `#030405` / `#08090A` / `#050607` / `#0B0E10` | 0.1 to 0.4 % | Black levels |
| `glass` | `#000000` at 85 % | | Plate core |
| `luna.limb` / `luna.body` / `luna.term` / `luna.maria` / `luna.dark` | `#F2F4F1` / `#E4E8E6` / `#C3C9C8` / `#9AA3A3` (at 25 %) / `#1E232A` (at 92 %) | | Moon globe (neutral grisaille). Halo 6 px `#E4E8E6` at 25 % on the lit side only. |
| `planet.body` / `planet.band` / `ring` | `#D6D9D4` / `#A3AAA8` / `#B9C1BF` (at 80 %) | | Jupiter and Saturn. Highlight `#F2F4F1` at NW; limb fades to `#5A6264`. |
| `cage.disc` | `#0A0F11` | 0.45 % | Cage back-disc (neutral; replaces `#0B1E26`) |
| `track` | `#17291D` | | Gauge tracks |
| `dayarc` | `#DCE3E6` (at 60 %) | | Day arc |
| `sun` / `sun.hi` | `#E8B65A` / `#FFE2A0` | 51.4 % | **The only gold**: star8 Ø9 with glow ≤ 3.5 px. AOD `#8A6A2C`. |
| `warning` | `#F3C479` | 59.9 % | Battery ≤ 15 % only: a state colour, not decoration |
| AOD set | `#91AD80` outline, `#0C160B` fill, `#7F9472` text, `#4E6644` dragon, `#5A6870` stars, `#4D633F` ticks and Draco, `#2C3A33` hairlines, `#5E7A55` cage, `#6B7A80` luna limb, `#8A6A2C` sun | | AOD only |

**Gradients (one light):**

| Element | Gradient |
|---|---|
| Lip (SweepGradient on the r 181.5 stroke) | 0° `#8CCB5A`, 45° `#4E7F34`, 135° `#1F3315`, 225° `#4E7F34`, 315° `#D2FFA4`, 360° `#8CCB5A` |
| Step and F2 chamfer (inner walls, lit at SE) | 135° `#D2FFA4`, 90° and 180° `#8CCB5A`, 45° and 225° `#4E7F34`, 315° `#1F3315` |
| Cage ring | same as the lip, but world-fixed |
| Dragon fill (linear, along 315° → 135°) | `#D2FFA4` → `#A6F46A` → `#6FA947` |

**Dragon:**

- engraving bed: the path dilated 3 px, black 85 %, 1 px feather;
- tight shadow (+1,+2), blur 1.5, black 85 %;
- no rim-light masks, because the strokes are 2 to 3 px.

**`flange_f2.png`** (456², Group at (−3,−3)):

- Chamfer r 211 to 212.5.
- Face r 212.5 to 228: the opaline sweep with a radial-hairline guilloche (720 lines, 0.5° pitch, ±6 % luminance).
- 96 engraved quarter-hour ticks, r 212.5 to 215, 1 px `#1A2024`, left out under numerals and the inscription.
- Even numerals `00 02 04 06 08 10 14 16 18 20 22` (no 12), 11 px Medium `#EFF8EC` with a 1 px `#1A2024` engraved shadow at (+0.75,+0.75), centred on r 218.5 at angle (360 − 15h) mod 360. Numerals in the arc 90° to 270° are flipped to read upright.
- Odd batons (all except 11 and 13): phosphor metal, 2 x 7 px at r 214.5 to 221.5, `#D2FFA4` on the NW edge and `#4E7F34` on the SE edge.
- The inscription (section 3.1).

**Contrast checks:**

| Text | Background | Contrast |
|---|---|---|
| F2 numeral | `#6E7B81` (lit, worst) | 4.0 : 1 |
| F2 numeral | `#2E363A` | 11.3 : 1 |
| prompt | its background at 6 o'clock | 5.3 : 1 |
| month names | F1 | 11.1 : 1 |

### 5.2 Typography

Roboto Mono (bundled `fonts/RobotoMono.ttf`, variable weight), tabular figures.

| Use | Size | Weight | Tracking | Colour |
|---|---|---|---|---|
| HH:MM | 78 | 600 SemiBold | 0 | `#EFF8EC`, colon `#A6F46A` |
| Date line | 15 | 400 | 0 (9 px advance) | `#9BAB9C` |
| Register value | 22 | 500 | 0 | `#EFF8EC` |
| Register label | 11 | 500 | 0.08 em | `#9BAB9C` |
| F2 numerals | 11 | 500 | 0 | `#EFF8EC` |
| Month names | 11 | 400 | 0.06 em | `#C8D1D5` at 85 % |
| Constellation names | 11 | 400 | 0.12 em | `#B9C5CA` at 70 % |
| Prompt on F2 | 11 | 400 | 0.02 em | `#B9C5CA` + `#A6F46A` |
| AOD INFINITY | 11 | 400 | 0.18 em | `#7F9472` |
| AOD BAT value | 17 | 400 | 0 | `#7F9472` |

Text under 11 px does not exist. Everything at 11 px except the register labels is decoration.

### 5.3 Strokes

| Element | Weight |
|---|---|
| Lip | 3 px |
| Trench | 8 px fill |
| Step, groove | 2 px |
| F1 rules | 1 px |
| Ticks | 1.0 / 1.2 px |
| Day arc | 1.5 px |
| Trail | 1.6 px |
| Gauges | 1.8 px |
| Cage ring, carriage arms | 1.5 px |
| Horizon edge | 1.2 px |
| Figure lines | 1.4 px |
| Draco | 1.2 px |
| Graticule | 1.0 px |
| AOD outline | 1.4 px |
| AOD hairlines | 1.0 to 1.25 px |

Nothing is thinner than 1.0 px at 450.

---

## 6. Motion

### 6.1 Wake (AOD → Active)

The design reference is a window W = 360 ms. WFF `startOffset` and `duration` are fractions of the device window. Interpolation everywhere is `CUBIC_BEZIER`, `controls="0.22 1 0.36 1"` (fallback `EASE_OUT`, test T1b).

| ms at W = 360 | startOffset / duration | Node(s) | Property: AMBIENT value → Active value |
|---|---|---|---|
| 0 to 200 | 0 / 0.556 | `sky_active` / `sky_aod` | alpha 0 → 255 / 255 → 0 (shared angle, no jump) |
| 0 to 200 | 0 / 0.556 | `sky_settle` | angle +3° → 0, `angleDirection="COUNTER_CLOCKWISE"`: the sky settles against its own sense |
| 0 to 360 | 0 / 1.0 | `f2` | angle −14° → 0, `CLOCKWISE` (the v4 signature), and alpha 0 → 255 |
| 40 to 240 | 0.111 / 0.556 | `dome_light`, `jupiter`, `saturn`, `luna`, `crescent_face`, `rings`, `calendar`, `day_arc` / `rings_aod`, `luna_aod` | alpha 0 → 255 / 255 → 0 |
| 80 to 320 | 0.222 / 0.667 | `plate`, `reg_bat`, `reg_stp` / `plate_mask_aod`, `reg_bat_aod` | alpha 0 → 255, with scaleX/Y 0.975 (plate) and 0.97 (registers) → 1.0 / alpha 255 → 0 |
| 120 to 340 | 0.333 / 0.611 | `clock_active`, `colon`, `date`, `sign` / `clock_aod`, `colon_aod`, `date_aod` | alpha 0 → 255 / 255 → 0. Same boxes: **the digits fill in place.** |
| 120 to 360 | 0.333 / 0.667 | `dragon_relief` / `dragon_aod` | alpha 0 → 255 and scale 0.97 → 1.0 / alpha 255 → 0 |
| 200 to 360 | 0.556 / 0.444 | `live`, cage disc + shadow + carriage, `sun_active` / `cage_aod`, `sun_aod` | alpha 0 → 255 / 255 → 0 |

Every startOffset + duration is ≤ 1.0.

**Read order:** the sky lights and settles anticlockwise; F2 swings 14° clockwise into place, so the two planes separate in opposite senses; the rings and the moon arrive; the glass and the registers rise; the digits fill; the dragon comes forward last; then the cage starts and the seconds trail appears.

Spatial Variants (angle, scale) sit **only** on Active-only nodes. AOD twins carry alpha Variants only, so the AOD picture is never displaced.

**Mapping the fractions to a real window:**
- If the device window W (T1) is longer than 360 ms, the generator multiplies every fraction by 360/W, so visible motion still ends at 360 ms.
- If W is shorter, the fractions are kept and the order compresses.

### 6.2 Slow real-time rotations (both modes; re-evaluated each minute)

| Object | Pivot | Sense | Rate | Period |
|---|---|---|---|---|
| Sky (+ `sky_aod`, Draco, graticule, names) | P | counter-clockwise | 0.25068°/min (0.88 px/min at r 200 from P) | 23 h 56 m 04.09 s |
| Calendar ring + cage orbit | C | counter-clockwise | 0.25068°/min (0.82 px/min at r 187) | sidereal day |
| Sun | C | counter-clockwise | about 0.25°/min ± EoT | apparent solar day |
| Sun against the calendar | | clockwise | 0.9856°/day | 365.24 d |
| Luna globe lit-limb bearing | (62,206) | counter-clockwise (follows the sun) | about 0.25°/min | 24 h |
| Luna phase sprite | | | steps every 22.5° of elongation | about 1.85 d per step; 29.53 d cycle |
| Jupiter / Saturn | positioned by E15 to E17 | with the sky, plus their own motion | | 11.86 / 29.46 yr |
| Day arc ends | | | per day | tropical year |

### 6.3 Per second (Active only)

The `carriage` angle steps to 6·`[SECOND]`, with no `Animation`. The `trail` endAngle advances by 6° (about 19.6 px/s at r 187) and resets to the cage rim each minute.

Nothing else moves per second: no blinking colon, no twinkle, no scan line. Every `[SECOND]` reference sits inside the Active-only `live` and `cage` groups.

### 6.4 Active → AOD and interruption

- **Watch:** one Variant serves both directions. **ASSUMPTION** (T1): the device plays the table in reverse, so the cage and trail fade first and the sky last. If the reversed stagger looks wrong on the SM-R965N, set every startOffset to 0 and keep the order through `duration` alone. v4's asymmetric 180 ms exit cannot be expressed in WFF.
- **Studio:** plays the mirrored table at W_sleep = W by default and labels it "watch timing". A toggle shows the old v4 180 ms exit for comparison only.
- **Interruption (studio):** read the current computed values, cancel, and run the other direction from those values over the elapsed time. A wake reversed at 120 ms takes 120 ms to go back.
- **Interruption (watch):** owned by the renderer.

### 6.5 Reduced motion

- **Watch:** Scene-level `ListConfiguration id="motion"` with three `ListOption` subtrees. Bitmaps are shared resources, so memory does not change.

  | Option | Contents |
  |---|---|
  | `full` | the tree in this spec, including Gyro |
  | `calm` | the same tree without Gyro (**default** until T15 passes) |
  | `still` | alpha Variants only, all `duration="0"` and `startOffset="0"`; no angle or scale Variants; no Gyro |

  `watch_face_info.xml` must set `<Editable value="true"/>`.
- **Studio:** `prefers-reduced-motion` OR the manual toggle makes every transition instant. A manual "off" cannot override the OS preference.
- **In all options:** the sidereal, solar and lunar rotations and the per-second carriage and trail keep running, because they are time, not animation.

### 6.6 Tilt parallax (Gyro; `full` option only)

`<Gyro>` is legal once per Group, per the v4 XSD. Inputs are `a_x = [ACCELEROMETER_ANGLE_X]` and `a_y = [ACCELEROMETER_ANGLE_Y]`.

| Wrapper | Contains | x / y |
|---|---|---|
| `par_sky` | z1 to z4: sky, planets, luna, dome light | `clamp(0.07*a, -3, 3)` |
| `par_rings` | z5 to z14: occluder, crescent, rings, calendar, day arc, sun, trail, cage, F2, INFINITY | `clamp(0.035*a, -1.5, 1.5)` |
| `par_dragon` | z18 | `clamp(-0.02*a, -1, 1)` |
| camera-locked | plate, date, registers, digits | none |

- Multipliers and signs are placeholders, to be tuned on the device.
- The total shift is capped at 3 px.
- F2 is baked to r 228 so a 1.5 px shift never exposes black.
- The `full` option becomes the default only if T15 shows ≤ +3 % 24-hour drain against `calm` and no visible stutter.

---

## 7. AOD

### 7.1 Contents (same positions as Active; everything on black)

| Element | Spec |
|---|---|
| Digits | Outline BitmapFont `kw_outline` (1.4 px `#91AD80` on `#0C160B`) + colon with `Outline` |
| Date | `25 OCT / SUN`, `#7F9472` |
| Sky | 73 vector stars (mag ≤ 2.5, Ø1.6, `#5A6870`) + Draco (1.2 px `#4D633F`), still turning with `sky` |
| Luna | lit-limb arc (1.2 px `#6B7A80`), turning to the sun; hidden at new moon |
| Lip | hairline r 181.5, 1 px `#2C3A33` |
| Ticks | 12 at r 200 to 208, 1.25 px `#4D633F`, every 30° |
| Sun | dot Ø6 `#8A6A2C` |
| Cage | ring Ø24, 1.2 px `#5E7A55` |
| INFINITY | r 204 |
| BAT register | rim r 44, 1 px `#2C3A33`, + `78%` 17 px `#7F9472` |
| Dragon | `dragon_mask` tinted `#4E6644` (Y 11.5 %) |
| Black footprints | plate and both registers; occluder r 182 to 240; north ground. They stop stars crossing the digits or appearing outside the lip. |

**Hidden in AOD:** F2, F1, names, numerals, day arc, plate glass, glow, trail, carriage, STP, labels, gauges, planets, graticule, Milky Way, prompt text.

Nothing is lit beyond **r 212**. No minute indicator other than the digits exists, so a frozen element can never show a wrong minute.

### 7.2 Lit share (v4 rule: non-zero RGB, 3x supersampled, box-downsampled to 450, over the 159,068 px disc)

Base: the wff v2 measured raster at its worst sample (08:08), 8.66 % = 13,775 px. It already counts the digit fill and AA, the dragon, 70 stars, date, INFINITY, ticks, hairline, the BAT rim and value, the sun dot, the probe and the moon ring.

| Change for v5 | Arithmetic | px | Share |
|---|---|---|---|
| + cage ring | 70.7 px circumference x 1.2 x 2 (AA) | +170 | +0.11 % |
| − probe dot | Ø4 | −13 | −0.01 % |
| − sky-moon ring | r 5: 31 x 1 x 2 | −63 | −0.04 % |
| + luna limb arc | at most 141 px visible x 1.2 x 2 | +339 | +0.21 % |
| + Draco | 109 x 1.2 x 2 | +262 | +0.16 % |
| + BAT rim at r 44 instead of r 40 | 25 x 1 x 2 | +50 | +0.03 % |
| **Total** | 14,520 px | | **≈ 9.1 %** |

The target is ≤ 9.5 % and the limit is 15 %; v4 was 11.3 %. Other metrics: max channel > 24 ≈ 4.8 %; mean linear Y ≈ 0.6 %.

This is an estimate; the studio gate re-measures it on the raster (section 8.4, G3) and fails the build above 9.5 %.

**Cut order** if the raster disagrees: luna limb arc → Draco → BAT rim. The digit outline is never thinned.

### 7.3 Burn-in

- **Brightest AOD pixels:** the digit outlines `#91AD80` (Y 37.5 %). They change every minute, and the hour glyphs change every hour.
- **Static elements:** INFINITY and the date `#7F9472` (Y 26.9 %, 11 to 15 px strokes), the dragon `#4E6644` (Y 11.5 %, 1,586 px), ticks and hairlines (Y ≤ 10.9 %).
- **Moving elements:** sky dots, Draco, the cage ring and the sun dot move with real time (about 0.25°/min). The luna arc turns with the sun.
- **No hand-made drift.** The 1 px AOD walk and the 2 px drift are rejected because they move HH:MM. Samsung's own AOD frame shift is assumed but not relied on (T8 overnight check).

---

## 8. Studio implementation plan (this week)

### 8.1 Modules (in `KALIWATCH/studio/`; IIFE modules that set both `root.X` and `module.exports`; `studio/package.json` stays `"type": "commonjs"`)

| File | Status | Responsibility |
|---|---|---|
| `tokens.js` | rewrite to v5.0.0 | Section 5 tokens, geometry constants (P, k, radii), motion fractions, the named moments M1 to M6 |
| `astro.js` | keep | Oracle: Meeus sun, moon, LST, alt/az |
| `planets.js` | new | Oracle: JPL approximate Keplerian elements (Earth, Jupiter, Saturn) → geocentric RA/dec |
| `stars.js` | keep | 366 stars, 33 figures, Milky Way centreline |
| `wff-expr.js` | new | **Single source of the expressions.** E1 to E17 and the helpers as WFF strings, plus a small evaluator (`+ - * / %`, `?:`, comparisons, `sin cos tan asin atan rad deg floor fract clamp round abs`, `[SOURCE]` tokens). The studio renders from the *evaluated WFF strings*, so it shows the watch's errors; the oracles are only for tests. |
| `sky.js` | extend | `bakeSky({projection:'stereographic', k:128, decLimit:-42.8, milkyStyle:'painted', graticule, draco:'phosphor', names})` → SVG at LST 0; `aodStars()` → dot list |
| `bake-sources.js` | new | Pure SVG generators for every baked asset (section 9.1), one function each, with the one-light rules |
| `vault5.js` | new; default preset `vault5` | **The layer table** from section 2.2 as data: id, z, WFF node path, mode (active / aod / both), build (bitmap / vector / text), asset, Transforms (by expression name), Variants (fractions), Gyro wrapper. It emits the SVG for both source mode and composite mode. Reuses `galaxia.js` `ringText`/`star8` and `face.js` `arc`/`ticks`. |
| `face.js` | extend | Timeline engine: `valuesAt(id, toMode, t, W)` from fractions; keeps the "digits never move" check |
| `studio.js`, `index.html`, `studio.css` | extend | Controls: Active/AOD, time scrubber + named moments, live clock, W slider (300 to 800 ms), motion option (full/calm/still), Gyro tilt simulator (pointer drag = ±45°), OLED-floor toggle (Y < 0.4 % → black), 1:1 480 px view, 150 px thumbnail view, per-layer solo/hide, gates panel |
| `tools/bake.cjs` | new | Renders each `bake-sources` SVG in headless Chrome (`--default-background-color=00000000`, device scale 480/450, plus 2x supersampling then downsample) → `assets/*.png` + `assets/manifest.json` (name, design size, device size, bytes, SHA-256). Inkscape is not used for these, because it mangles fonts and filters. |
| `tools/gates.cjs` + `tools/gates.py` | new | Render the named moments in composite mode, then measure (section 8.4). Run with `python -I`; exits non-zero on failure. |
| `tools/test-expr.cjs` | new | Evaluates `wff-expr.js` against `astro.js` and `planets.js`, half-hourly over 2026 to 2030 |
| `tools/verify.cjs` | extend | Adds the layer-table lint (below), `test-expr.cjs` and `gates.cjs` |
| `tools/render-refs.cjs` | extend | Round-4 sheet: M1 to M6 Active, AOD M1 and M6, wake strip 0 to 360 ms, 150 px thumbnails, 1:1 480 crops |
| `tools/gen-wff.cjs` | later (port) | Generates `watchface.xml` from `vault5.js` plus the `wff-expr.js` strings plus `assets/manifest.json`; writes the three motion subtrees |

**Layer-table lint (in `verify.cjs`):**
- Part and Group x/y/w/h are integers.
- Every startOffset + duration ≤ 1.
- Variants only on Group or Part nodes.
- Spatial Variants only on Active-only nodes.
- Every Active node has an alpha-0 AMBIENT Variant or is a "both" node.
- No gold hex outside `sun*`.
- No hex outside the token list.
- Every text box corner is within its safe radius.

**Build order this week:**

| Day | Work |
|---|---|
| Mon | `wff-expr.js` + `test-expr.cjs`; `planets.js` |
| Tue | `sky.js` bake + `bake.cjs`; sky gates G1 |
| Wed | `vault5.js` vectors: rings, calendar, sun, cage, trail, day arc, crescent |
| Thu | Static bakes: F2, plate, register, dragon, luna sprites, planets, glyphs; composite mode |
| Fri | Timeline + W slider + motion options + Gyro simulator; AOD gate G3; round-4 reference sheet |

### 8.2 Render pipeline

1. **Source mode** (for designing): every layer is live SVG from `bake-sources.js` and `vault5.js`.
2. **Composite mode** (default for references, gates and the studio preview): baked PNGs are drawn as `<image>` elements with the same x/y/w/h as the WFF Part, inside `<g transform="rotate(E3 225 114)">` and similar. Vector layers are drawn as the WFF primitives they will become. Text is placed by **WFF boxes**: a shared `wffBox()` derives box y from the TTF metrics so the baseline lands where section 3 says, and the generator uses the same function.

**Pre-baked vs live:**

| Pre-baked PNG | Live vector, in the studio and on the watch |
|---|---|
| `sky_active`, `dome_light`, `flange_f2`, `plate`, `register`, `dragon_relief`, `dragon_mask`, `luna_0..8`, `jupiter`, `saturn`, `sun_star`, `kwo_0..9` (fallback: `f1_calendar`) | rings, occluder, north ground / crescent / horizon edge, calendar ticks and names, day arc, trail, all cage parts, gauges, all text, `sky_aod` dots and Draco, `luna_aod` arc, `rings_aod`, AOD footprints, `sun_aod` |

### 8.3 Named moments

| Id | Time (KST) | What it shows |
|---|---|---|
| M1 | 2026-10-25 20:08:24 | Canonical night: cage at 7 o'clock, full globe, sun at 2 o'clock against 20 |
| M2 | 2026-10-25 10:08:24 | Day: cage under the dragon's wing root, sun lower left |
| M3 | 2026-10-26 04:30 | Saturn in open sky on the right; Jupiter rising on the left |
| M4 | 2027-03-21 12:00 | Equinox eclipse: the sun under the cage |
| M5 | 2026-06-21 12:00 | Longest day arc (H0 109.5); quarter globe |
| M6 | 2026-10-25 08:08 | Worst AOD outline |

**Handedness test:** at M1 the Summer Triangle must sit west (right) of the meridian and Cassiopeia near upper culmination under the dragon. `test-expr.cjs` asserts chart positions against `astro.js` alt/az: the sign of x equals the sign of −sin(azimuth).

### 8.4 Gates (`gates.py`; the build fails on any miss)

| Gate | Measurement | Pass |
|---|---|---|
| G1 sky brightness | Active M1 and M2, open sky (r < 180, inside the horizon, excluding the plate, registers, dragon bed and globe) | ≥ 15 % of pixels at L\* ≥ 45; ≥ 4 % at L\* ≥ 70; median ≤ L\* 12 |
| G2 digit calm | Digit box under the plate, M1 to M6 | median L\* ≤ 8; 99th percentile ≤ 30; digit-edge contrast ≥ 4.5 : 1 at the 1st percentile, with luminance scaled by 0.4 (40 % brightness) at 1:1 480 |
| G3 AOD lit share | AOD M1, M2 and M6 rendered at device scale 3 (1350 px), box-downsampled 3x3 to 450 | non-zero RGB ≤ 9.5 %; also report max > 24 and mean linear Y; zero lit pixels beyond r 212 |
| G4 strings | All text boxes with worst-case strings (`99.9k`, `100%`, `23:58`, any date) | corners ≤ r 171; register values ≥ 1.5 px inside the r 39.1 gauge edge |
| G5 thumbnail | Active M1 downscaled to 150 px | F2 mean Y ≥ 8 % and F2 : F1 mean ratio ≥ 8; Milky Way pixels at L\* ≥ 60 present; globe lit area mean Y ≥ 40 %; cage ring ≥ 6 px at Y ≥ 25 %; each register rim distinct (ΔL\* ≥ 12 against the floor). The graticule is cut first on a fail. |
| G6 one light | Lint over `bake-sources.js` | every shadow offset has sign (+,+); every highlight sits at 315° (raised) or 135° (inner wall) |

---

## 9. WFF v4 port plan

### 9.1 Assets (RGBA8888; device = design x 1.0667; bytes = w x h x 4)

| Asset | Design | Device | Memory |
|---|---|---|---|
| `sky_active.png` | 586² | 625² | 1.56 MB |
| `dome_light.png` | 364² | 388² | 0.60 MB |
| `flange_f2.png` | 456² | 487² | 0.95 MB |
| `plate.png` | 240 x 116 | 256 x 124 | 0.13 MB |
| `register.png` (drawn twice) | 96² | 103² | 0.04 MB |
| `dragon_relief.png` | 190 x 140 | 203 x 149 | 0.12 MB |
| `dragon_mask.png` (at (141,21)) | 168 x 124 | 179 x 132 | 0.09 MB |
| `luna_0..8.png` | 9 x 100² | 107² | 0.41 MB |
| `jupiter.png`, `saturn.png`, `sun_star.png` | 20², 30 x 16, 16² | | 0.01 MB |
| `kwo_0..9.png` (AOD outline glyphs, Roboto Mono SemiBold 78, final colours) | 10 x 47 x 86 | 50 x 92 | 0.18 MB |
| `roboto_mono.ttf` | | | 0.18 MB |
| **Interactive total** | | | **≈ 4.3 MB** of 100 MB (5.2 MB with the `f1_calendar.png` fallback) |
| **Ambient** (V1 offload: 1 static layer 480² x 4 + glyphs + font) | | | **≈ 1.3 MB** of 10 MB |

Active-only nodes carry AMBIENT alpha 0, so the evaluator skips them (`isNodeSkipped`). The three motion subtrees share resources, and the evaluator takes the maximum across configurations.

### 9.2 Document skeleton

```
WatchFace 450x450 CIRCLE
  Metadata CLOCK_TYPE=DIGITAL, PREVIEW_TIME=20:08:24
  UserConfigurations > ListConfiguration id=motion (full | calm | still), default calm
  BitmapFonts > BitmapFont kw_outline (Character 0..9 -> kwo_0..9, 47x86)
  Scene #ff000000 > ListConfiguration id=motion > ListOption {full|calm|still} > Group face
    [par_sky]  sky{sky_settle{sky_active}, sky_aod} . jupiter . saturn . luna{Condition s0..s8} . luna_aod . dome_light
    [par_rings] occluder . north_ground . crescent_face . horizon arcs . rings . rings_aod . calendar{Lines, TextCircular x12}
               . day_arc . sun{sun_active, sun_aod} . live{trail} . cage_orbit{cage_frame{shadow, disc, ring, carriage}, cage_aod}
               . f2{flange_f2} . infinity_aod
    plate_mask_aod . plate . date . Condition(sign x12) . date_aod . reg_bat . reg_stp . reg_bat_aod
    [par_dragon] dragon_relief . dragon_aod
    clock_active . colon . colon_aod . clock_aod   <- last
```

- `[par_*]` wrappers carry `<Gyro>` in `full` only; in `calm` and `still` they are plain Groups.
- Date `PartText`s carry `<Localization calendar="GREGORIAN" locales="en_US"/>` and `<Upper>`, so the date stays English on a Korean system.

### 9.3 Variants

Section 6.1 gives every Variant. Rules:
- AMBIENT value = the AOD state.
- Spatial Variants appear only on `sky_settle`, `f2`, `plate`, `reg_*` and `dragon_relief`.
- One Variant per attribute per node.
- Variants never go on shapes (Arc, Ellipse and RoundRectangle take none in v4). Every vector twin is its own PartDraw.

### 9.4 Schema facts relied on (v4 XSDs in `scratchpad\wfref\xsd`)

- `TimeText` takes one `Font` (attributes only) **or** one `BitmapFont`, so there are no Shadow or Outline decorations on digits.
- `PartText` Font accepts `Outline`, which the AOD colon uses.
- Group and Part x/y are `xs:integer`; shape coordinates are floats.
- `Gyro` is allowed 0 or 1 times per Group or Part.
- `ListConfiguration` is allowed in Scene and Group.
- `Compare` references a named `Expression`.
- `MINUTES_SINCE_EPOCH` and `ACCELEROMETER_ANGLE_X/Y` are in `sourceType`.
- Group has no `blendMode` in v4; none is used.

### 9.5 Known gaps → device tests (in order)

| # | Test | Pass | Fallback |
|---|---|---|---|
| T1 | Measure the transition window W (240 fps film of an existing Variant); also check reverse ordering on sleep | W known, order acceptable | Rescale fractions; offsets 0 on sleep |
| T1b | `controls="0.22 1 0.36 1"` passes the validator | accepted | `EASE_OUT` |
| T2 | BitmapFont `TimeText` in AOD renders 1:1 and updates each minute overnight | correct | PartText + `Outline` Template clock; then a dim-fill DigitalClock |
| T3 | `[MINUTES_SINCE_EPOCH]` sky angle against the studio at 3 times | ≤ 1° | local-time LST form (wff v2 section 8) |
| T4 | Off-canvas sky Group (x −68, y −179, 586²) at angles 0/90/180/270 | no clipping | 450 Group with pivotY 0.2533 and an overflowing child |
| T5 | SweepGradient zero angle and direction | lip lit at NW | rotate the stop list |
| T7 | Battery: `[SECOND]` in alpha-0 groups, overnight | within 5 % of the current face | move trail and carriage into a Condition |
| T8 | Wrist check at 40 % brightness: F2, lip, plate bevel, Milky Way, cage | stack reads | +15 % Y on F2 and the lip |
| T9 | Korean locale date | `25 OCT / SUN` | 19-branch Condition |
| T10 | TextCircular direction (INFINITY, prompt) | upright | 1-line PNG |
| T11 | `memory-footprint --schema-version 4 --ambient-limit-mb 10 --apply-v1-offload-limitations` | ≤ 2 layers, 1 clock | reorder AOD nodes |
| T12 | TextCircular inside the rotating `calendar` Group | correct and crisp | `f1_calendar.png` 480², +0.92 MB |
| T13 | Bezel / visible radius for F2 numerals at r 218.5 ± 4 | fully visible | scale `f2` 0.975 about C; do not thin the numerals |
| T14 | Cage counter-rotation keeps the shadow at (+2,+2) at 4 sidereal angles | world-fixed | bake the shadow as a separate Arc in `cage_orbit` |
| T15 | Gyro units, sign, feel and 24 h drain (`full` vs `calm`) | ≤ 3 px, ≤ +3 % drain | ship `calm` as default |
| T16 | ListConfiguration subtree switch: no flash, memory unchanged | ok | BooleanConfiguration pair |
| T17 | `atan` quadrant ternary, `asin`, `%` sign on negatives, `fract` | matches studio | precompute with an extra wrap |
| T18 | Text baselines (TimeText box y 186, h 86 → baseline 252) | ±1 px | adjust the boxes in `wffBox()` |

---

## 10. Decisions, rejected ideas, open risks

### 10.1 Where the judges disagreed: decisions

| Question | Decision | Why |
|---|---|---|
| Large painted sphere: real Jupiter 48 to 56 px (owner) / moving moon Ø40 (director) / static planet (engineer) | **Static luna phase globe Ø92 at (62,206)**, cut by the lip; Jupiter and Saturn real but small | A real Jupiter at Ø48 is ≥ 50 % visible only **5.9 h per sidereal day** *(measured)*, and invisible at M1, M2 and 23:30, because its upper culmination is behind the plate and its lower culmination is under the crescent. It would fail the owner's own thumbnail gate. A moving moon is absent more than half the time. The globe is always present, matches the photo's sphere at 9 o'clock, and carries real data (the phase, lit toward the sun). |
| Dragon tucked under F2 (engineer) vs on top (owner, director) | **On top, uncut** | The wing tip reaches r 211.0 *(measured)*, exactly F2's inner edge, so tucking gains nothing and would clip the official mark. |
| One sub-disc (director) vs two registers (owner, engineer) | **Two sunken registers**, r 44 | The owner wears it. The photo's asymmetry is carried instead by the globe, the eccentric pole, the horizon arc and the cage at 7 o'clock in M1. |
| Inscription at 10 o'clock (engineer) vs 6 o'clock (owner, director) | **6 o'clock** | It reads upright there and keeps the v4 footer position. |
| Gyro (owner) vs rejected (director, engineer) | **Shipped as an option**; `calm` is the default until T15 passes | Respects the owner's wish without risking battery life. |
| PPI graticule (owner) vs HUD (director) | **Kept at 8 to 10 %**; first cut at gate G5 | Radar DNA, kept quiet. |
| Cage with carriage (owner, engineer) vs probe only (director) | **Cage Ø24 with carriage** | The carriage is inside the one bright object, so it is not a second object. |
| Month names on the 1st vs the 15th | **Rules on the 1st, names centred on the 16th** | The name spans its month, and the rules show the boundaries. |
| Names inner and sun outer (engineer) vs the reverse | **Sun on the inner track (r 197), names on the outer (r 203.5)** | The cage is fixed at RA 0 on the ring. With names inner, it would permanently cover MAR. |
| Zodiac sign | **Kept in the date line, in `#9BAB9C`** | It is the only zodiac reading left; owner and engineer agreed. |
| Day arc (engineer) | **Kept**, 1.5 px white in the groove | Gives day length a place; it replaces the deleted veil's day/night signal. |
| AOD plate brackets (engineer) | **Rejected** | A HUD trope. The black plate footprint already shows the plate. |

### 10.2 Rejected (do not reintroduce)

- **The day-key veil** `#2E4A5A` up to 42 %. It tints the sky blue and drops the Milky Way from Y 37.9 % to 20.8 % in daylight.
- **Gold anywhere but the sun:** the gold `SCO`, zodiac ticks, gold ecliptic and day arcs, a 64 px sun glow, copper flecks.
- **The F2 minute pointer and minute ticks**, which duplicate HH:MM.
- **Any movement of HH:MM:** AOD walks, drift circles.
- **TimeText Font Shadow/Outline**, which is invalid in v4.
- **Pole at the dial centre**, which puts the circumpolar sky under the digits.
- **Near-black sky plans** (base ≤ 0.7 %, Milky Way ≤ 6 %).
- **Extra hues:** abyss teal, vault teal, blue starlight, red giants, silver indices, the `#0B1E26` cage disc.
- **Astronomer's 55 % plate over an r 150 window**, and the 11 Reference carriers.
- **Labels in the circumpolar cap**, and a DRACO label.
- **A second moon** on the chart.
- **Day numerals "10"/"20" on F1** (about 7 px text); long ticks are used instead.
- **Hand-made AOD drift.**
- **Studio-only timings presented as watch behaviour.**

### 10.3 Open risks

1. **Panel exposure.** The bright sky and grey F2 raise Active mean luminance to about 8 %, which costs more power than v4. Black crush can flatten F1 against the trench. Mitigation: gates G1 and G5, the T8 wrist check, the OLED-floor preview.
2. **Rotation resampling** of the 625² sky each minute can shimmer 1.4 px stars. Mitigation: 2x supersampled bakes, minimum cores; check on the device.
3. **Expression precision** (float32): ±0.25° from minute truncation and float resolution until about 2040.
4. **Honesty of the globe.** It is an instrument, not a sky position. The studio and docs must say so.
5. **The cage covers the sun around Mar 17 to 24** each year, and passes under the dragon for about 42° of its orbit (more than 10 % covered for 22°) *(measured)*. Both are intended occlusions.
6. **Seoul is hard-coded** (latitude in P, the horizon and H0; longitude in E2). Travel keeps the time correct, but the sky shown is Seoul's.
7. **Rotating month names** read upside-down on part of their daily turn, as on a planisphere.
8. **Vendor-owned transition length** (T1) and an **unverified reverse order** on sleep.

---

*Evidence: `scratchpad\calc\final\check.cjs` (dragon raster at the v4 frame, cage and sun occlusion, JPL-approx vs WFF planet error, sphere visibility, month table, H0 range, text corners) and `scratchpad\calc\final\expr.cjs` (E-expressions at M1 to M5); wff v2 mocks and measurements in `scratchpad\calc\wffv2\`; v4 XSDs in `scratchpad\wfref\xsd`.*
