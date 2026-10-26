# KALIWATCH v5 "Celestial Vault": final design specification, v2 (07)

Status: **build spec**. Date 2026-10-26. It supersedes 05. It answers the three refutations in 06 (flat, watch, builder): every valid major and minor issue is fixed in sections 1 to 10, and every rejection is argued in "Refutation responses" at the end.

**What changed from 05, in one paragraph.** The two mirrored registers become one eccentric sunken sub-disc that the lip cuts. The globe moves to 3 o'clock and is lit by the key light. The horizon edge becomes a 5 px polished phosphor bead on a grey guilloche crescent. The glass becomes 75 % black, composited in sRGB, with an arched top. F2 widens to 20 px with visible guilloche and a night sector. The cage becomes a bright metal rotor. 24 upright constellation names replace the 8 baked ones. The Milky Way is defined in galactic latitude and gated over the whole sidereal day. The sky settle is dropped, and the scale pops become shadow lifts. AOD gains flange and horizon cues and loses its rings. The text boxes follow the measured device baseline model. Expressions run through WFF 4 `Reference` carriers. Static font instances replace the variable font.

**Conventions**
- Design space 450 x 450, centre C = (225,225), dial radius 225.
- Device: SM-R965N, 480 x 480 round. Scale x1.0667; 1 design px is about 0.085 mm.
- Angles are degrees clockwise from 12 o'clock, as in WFF.
- `r` is the distance from C unless the text says "about P", "about Q" or "about H".
- Fixed points:
  - P = (225,114), the pole;
  - H = (225,280.4), the horizon centre;
  - Q = (149,333), the sub-disc centre;
  - G = (390,206), the globe centre.
- One key light for every bake: from 315° (upper left), elevation 35°.
- **Shadow rule:** offset = 1.25 px per height unit along 135°, blur = 0.3 x offset, black 60 % unless stated.
- `@n%` is alpha. **All alpha is composited in sRGB space**, as Chrome and Skia do. No SVG filter may use linearRGB; the studio sets `color-interpolation-filters="sRGB"` on every filter.
- Y is relative luminance (Rec. 709, linear). L\* is CIE.
- `PREVIEW_TIME` = 20:08:24. The canonical reference moment is **M1 = 2027-04-16 20:08:24 KST** (section 8.3).
- Values marked *(measured)* were computed for this document by the scripts in `scratchpad\calc\v51\`: `layout.cjs`, `moments.cjs`, `m2.cjs`, `m3.cjs`, `names3.cjs`, `names4.cjs`, `mwlst.cjs`, `mwm.cjs`, `table.cjs` and `color.cjs`.

---

## 1. Concept

KALIWATCH v5 is a physical instrument seen from above and lit from 10:30. From the outside in:

- **F2:** a 20 px matte-grey, radial-guilloche 24-hour flange with white even-hour numerals and a darkened night sector.
- **F1:** below it, a black lacquer calendar ring with a gloss streak. White month names turn with the stars, and a tiny gold sun star rides among them.
- **Lip and trench:** a phosphor-metal lip and a black trench. A bright phosphor-metal rotor (the Cosmotourbillon analogue) flies over them once per sidereal day and pulls the phosphor seconds trail.
- **North crescent:** a grey guilloche plate, engraved concentric with the horizon centre H. It is edged by a polished 5 px phosphor bead, and it is the eccentric outer section of the dome.
- **Vault:** the real Seoul sky in bright grisaille, turning once per sidereal day about Polaris at P (225,114), under the arch of the official Kali dragon. It shows:
  - a painted Milky Way;
  - 33 bright stick figures;
  - 24 upright constellation names;
  - Draco in phosphor;
  - Jupiter and Saturn at their real positions.
- **Moon globe:** a large painted globe at 3 o'clock, which the lip cuts. It shows tonight's phase, lit by the key light.
- **Sub-disc:** one sunken, off-centre sub-disc at 7 o'clock that the lip cuts. Its grey sunray floor carries battery and steps. Once per sidereal day the rotor crosses it.
- **Digits:** the big fixed HH:MM floats on an arched smoked-glass plate placed over the Seoul zenith. The Milky Way visibly passes beneath it.

Everything structural is one accent metal: phosphor, treated as anodised metal. Gold is only the 8 px sun.

**The one memorable thing:** the official Kali dragon arches over Polaris and breaks the flange with its wing, while the real sky wheels beneath it and Draco is drawn in phosphor dots.

| Main-reference cue | Where it lives in v5 |
|---|---|
| Eccentric layering and an off-centre sunken sub-disc | Eccentric layering: the sky turns about P. The crescent's guilloche and its bright bead are concentric with H. The sunken sub-disc at Q, r 60, is cut by the lip and crossed by the rotor. The globe sits at G. Structural pixels that differ from their mirror image: **20.1 %** of the dial *(measured; it was 7.4 %)*. |
| A bright, high-contrast grisaille sky that occupies most of the dial | Open sky is **36.2 %** of the dial *(measured)*. The Milky Way is painted in galactic latitude: cores `#E4ECEE`, clouds `#9AA8AE`. There are 366 + about 590 stars, 1.6 px figure lines at L\* 68, and 24 names. At M1 the bright band is **8.0 %** of the dial *(measured)*. Gates G1, G8 and G9 enforce this. |
| Large painted sphere with a terminator, cut by a ring edge | The globe, Ø92 at G, is cut by the lip and keeps 66.4 % of its area *(measured)*. It is lit from 315°, and the unlit side shows earthshine. Jupiter and Saturn are small painted spheres. |
| Two flange levels | F2: a grey radial-guilloche 24 h ring, r 205 to 225, with 13 px numerals and the night sector. F1: a black calendar ring, r 188 to 202.5, with month names, day ticks, a gloss streak and the gold sun star. |
| One accent metal | Phosphor metal `#D2FFA4` / `#A6F46A` / `#4E7F34` is used on: lip, step, F2 chamfer, batons, horizon bead, sub-disc lip, rotor, dragon, colon and gauges. Gold is only on the Ø8 sun. |
| One bright moving object | The rotor: a Ø24 filled metal bridge with a rotating carriage on r 182. It orbits counter-clockwise once per sidereal day and marks RA 12h. At M1 it sits inside the sub-disc rim. |
| Hard rules | HH:MM is fixed in both modes, and the AOD glyph baseline matches the Active one (T4). The official dragon keeps its v4 frame, uncut and on top. INFINITY sits on F2 and at the same place in AOD. AOD lit share is about 8.0 %. Nothing hand-made moves HH:MM. |

---

## 2. Layer stack

### 2.1 Radial structure and heights

| r from C | Band | Surface | Height | Edge treatment |
|---|---|---|---|---|
| 0 to 180 | vault aperture | grisaille enamel sky | −1 | Lip: a 1.25 px cast shadow plus ambient occlusion over r 172 to 180, both on the NW half (section 4.6) |
| inside r 180, outside circle H r 209.9 | north crescent: 25.5 px thick at 12 o'clock; meets the lip at ±64.5° about C (±50.7° about H) | grey guilloche plate `#4A555B` → `#2E363A`, engraved concentric with H | 0 | Horizon bead 5 px, r 209.9 to 214.9 about H, polished phosphor metal; it casts a (+0.9,+0.9) to (+1.3,+1.3) shadow onto the sky |
| 180 to 182.5 | lip | phosphor metal, lit NW | 0 | SweepGradient (section 5.1) |
| 182.5 to 186.5 | trench | black lacquer `#030405` | −3 | carries the seconds trail at r 184.5 |
| 186.5 to 188 | step | phosphor metal, inner wall lit SE | wall | SweepGradient, peak at 135° |
| 188 to 202.5 | **F1 calendar ring** | black lacquer `#08090A` with a gloss streak | +1 | inner rule r 188.5, 1 px `#B9C5CA` @35%; no outer rule |
| 202.5 to 203.5 | groove | `#050607` | +0.5 | F2's cast shadow (NW) |
| 203.5 to 205 | F2 chamfer | phosphor metal, lit SE | wall | baked into `flange_f2.png` |
| 205 to 225 (baked to 228) | **F2 24 h flange** | grey radial guilloche | +2 | 20 px face; baked to r 228 so that Gyro never exposes black |
| sub-disc at Q, r 60 | sunken sub-disc | grey sunray floor `#2A3338` | −3 | Phosphor lip lit at 135°. Wall shadow 2.5 px on the NW. The lip and rings cover it beyond r 180 about C. |

Objects above the rings:
- the glass plate (+3);
- the rotor (+3; it flies over the lip, the trench, the step and the edge of the sky);
- the dragon (+4; its wing tip lies over F1 and 7.5 px into F2: 42 ink px at r ≥ 203.5, 284 over F1 *(measured)*).

**Cast shadows by the shadow rule:**

| Caster → receiver | Δh | Offset | Where |
|---|---|---|---|
| plate → sky | 4 | (+3.5,+3.5) | `plate_shadow.png` |
| dragon → sky | 5 | (+4.4,+4.4) | `dragon_shadow.png`, baked against a height map (section 5.1) |
| dragon → crescent or lip | 4 | (+3.5,+3.5) | same file |
| dragon → F1 | 3 | (+2.7,+2.7) | same file |
| dragon → F2 | 2 | (+1.8,+1.8) | same file |
| rotor → lip or sky (it straddles h 0 and −1) | 3 to 4 | (+3,+3), tolerance ±30 % | `cage_shadow.png` |
| horizon bead (+0.5) → sky | 1.5 | (+1.3,+1.3), only where 135° points into the sky (the left flank and the top) | `crescent.png` |
| lip → sky | 1 | (+0.9,+0.9) hard, plus 8 px ambient occlusion | `dome_light.png` |
| sub-disc wall → floor | 2 | 2.5 px hard x max(0, cos(θ − 315°)), plus a 4 px feather | `subdisc.png` |
| F2 → groove and F1 | 1 | 1.25 px hard plus 1 px feather, NW half | `flange_f2.png` |

```
 eye
  |   +4  DRAGON (v4 frame, uncut; wing breaks F2 by 7.5 px; shadow 3.5-4.4 px)
  |   +3  GLASS 75%  ===[ 16 APR / FRI / ARI   20:08 ]===    ROTOR o (r182, flies over lip/trench/sky edge)
  |   +2  F2 grey guilloche 24h  | 00 . 02 . 04 ... kali@vault:~$ INFINITY ... 22 |  night sector    r205-225
  |   +1  F1 black calendar + gloss | APR ' ' ' ' MAY ' ' ' '   * sun |                                r188-202.5
  |    0  LIP (phosphor) ---- CRESCENT grey guilloche about H, 5 px phosphor BEAD (eccentric) ----     r180-182.5
  |   -1  VAULT grisaille sky about P(225,114), 24 upright names     GLOBE G(390,206) cut by the lip
  |   -3  SUB-DISC Q(149,333) r60, grey sunray floor, cut by the lip   |   TRENCH r182.5-186.5 + trail
```

### 2.2 Stack table (document order = paint order, back to front)

All coordinates are dial coordinates; `gen-wff.cjs` converts them to parent-local ones.

The Gyro wrappers `par_sky`, `par_rings` and `par_dragon` are Groups 470 x 470 at (−10,−10). They carry `<Gyro>` only in the `full` motion option (section 6.6), and they contain **Active-only nodes only**. Every AOD node lies outside them.

| z | Node(s) | Shows | Clock and period | Geometry (450 space) | Material | Active | AOD | Build |
|---|---|---|---|---|---|---|---|---|
| 0 | `Scene backgroundColor` | void | none | full disc | `#000000` | on | on | Scene attribute |
| 0b | `ref_lst`, `ref_lsun`, `ref_asun`, `ref_dsun`, `ref_lj`, `ref_ls` | expression carriers (section 4.9) | minute | Each is a Group 1 x 1 at (0,0), **outside the round clip**, holding a 1 x 1 black PartDraw | none visible | on | on | Group + `Transform angle` + `Reference` |
| 1 | `par_sky` > `sky` (Group x −68, y −179, 586 x 586, pivot 0.5/0.5 = P, angle E3) > `sky_active` (PartImage 586²) | Real Seoul sky. Bake order: Milky Way, graticule, figures, about 956 stars, Draco dots. | **Sidereal day**: counter-clockwise 0.25068°/min | Chart r = 128·tan((90° − δ)/2) about P, down to δ −42.8° | bake, section 4.6 | 255 | 0 | bitmap + Transform |
| 1b | inside `sky`: `names` (24 Groups 28 x 36, pivot on the anchor, angle −E3) > PartText | 24 upright 3-letter names | sidereal, counter-rotated, so net 0° | anchor = figure centroid; label box centred 10 px below it | 11 px `#B9C5CA` @80% | 255 | 0 | PartText in counter-rotated Groups |
| 1c | inside `sky`: `jupiter` (Group 20²), `saturn` (Group 30 x 16), angle −E3 | the real planets | ephemeris E13 to E16 | position by E16 in the sky frame (no LST) | grisaille spheres, world-lit from 315° | 255 | 0 | PartImage |
| 1d | `par_sky` > `luna` (Group x 338, y 154, 104 x 104) > Condition S9 > `luna_0..8` | Moon phase globe, lit from 315° | **synodic month**: 9 sprites from `[MOON_PHASE_POSITION]` | centre G (390,206), Ø92, spanning r 120.1 to 212.1. The lip hides everything beyond r 180 (a visible width of 59.9 px). | grisaille sphere with earthshine (section 5.1) | 255 | 0 | PartImage sprites |
| 1e | `par_sky` > `dome_light` (PartImage 364² at (43,43)) | the fixed light on the vault | none | disc r 182 | Glaze, SE fall-off, lip occlusion and pole reticle (section 4.6) | 255 | 0 | bitmap |
| 2a | `occluder_aod`; `ground_aod` | Black: beyond the lip, and below the horizon inside it | none | Occluder: Ellipse about C, r 211, stroke 58 (covers r 182 to 240). Ground: stroked Ellipse about H covering r 209.9 to 240 from H. | `#000` | 0 | 255 | PartDraw |
| 2b | `sky_aod_mount` (Group −68, −179, 586², pivot P, angle E3) > `sky_aod` | 72 stars of mag ≤ 2.5 plus Draco's 14 stars | sidereal (if T19 shows the AOD groups re-evaluate) | dots Ø1.6 | Stars `#5A6870`; Draco `#4D633F` | 0 | 255 | PartDraw Ellipses |
| 2c | `luna_aod` (Group 338, 154, 104²) | the AOD moon | phase | A black Ellipse Ø92 (footprint). Condition S9 ≠ 0 > Arc r 45 about G, from 225° to 363.6°. | 1.2 px `#6B7A80` | 0 | 255 | PartDraw |
| 2d | `aod_marks`: `ticks_aod`, `horizon_aod`, `f2_aod`, `infinity_aod` | the same-face cues | none | ticks: 11 at r 195 to 202, every 30° except 180°. horizon: Arcs about H, r 209.9, from −50.7° to −25° and from +25° to +50.7°. f2_aod: `00`, `06`, `18` at r 215. INFINITY: section 3.1. | Ticks 1.25 px `#4D633F`. Horizon 1 px `#2C3A33`. Numerals 13 px `#4D633F`. INFINITY `#7F9472`. | 0 | 255 | PartDraw / PartText / PartImage `infinity_aod.png` |
| 2e | `aod_live`: `sun_aod_mount` (Group 450², angle E8) > `sun_aod`; `cage_aod_mount` (Group 450², angle E3) > `cage_aod` | sun and rotor asleep | solar / sidereal | sun dot Ø5 at (225,34); rotor ring Ø24 at (225,43) | `#8A6A2C`; 1.2 px `#5E7A55` | 0 | 255 | PartDraw in rotated Groups |
| 2f | `subdisc_aod` | the sub-disc asleep | battery | Black Ellipse r 60 at Q. Lit-wall Arc r 59.25 about Q, 45° to 171°. `bat_aod` in the same box as `bat_value`. | Arc 1 px `#2C3A33`. Value 22 px `#7F9472` (≤ 15 %: `#8A6A2C`). | 0 | 255 | PartDraw + PartText |
| 3 | `subdisc` (camera-locked) | Battery and steps instrument | live sensors | `subdisc.png` 124² at (87,271). Gauges: BAT Arc r 44 about Q, STP Arc r 39.5. Text in section 3.3. | section 3.3 | 255 | 0 | bitmap + PartDraw + PartText |
| 4 | `par_rings` > `crescent` (PartImage 330 x 108 at (60,43)) | the eccentric outer dome plate, the horizon bead and its shadow | none | inside r 180, outside circle H | section 5.1 | 255 | 0 | bitmap |
| 4b | `par_rings` > `rings` | lip, trench, step, F1 base, F1 inner rule, groove | none | radial table 2.1 | Lip Sweep lit at 315°; step Sweep lit at 135° | 255 | 0 | PartDraw Ellipses |
| 4c | `par_rings` > `calendar` (Group 450², pivot C, angle E4) | Month names and day ticks; the sun's place among them is the date | **RA frame** (sidereal); read against the sun it gives the **tropical year** | Month rules r 189 to 202. Ticks r 189 to 191.5 (5th, 15th, 25th) and r 189 to 194 (10th, 20th). Names: TextCircular on the r 198.7 centreline, glyph tops toward C. | Names `#C8D1D5` @85%. Ticks `#8A979C` / `#C8D1D5`. Rules `#B9C5CA` @60%. | 255 | 0 | PartDraw Lines + 12 TextCircular |
| 4d | `par_rings` > `f1_gloss` | the lacquer reflection | none | Arc about C, r 195.25, stroke 14.5, 290° to 340° | SweepGradient of white: 0 % at 290°, 16 % at 315°, 0 % at 340° | 255 | 0 | PartDraw Arc |
| 4e | `par_rings` > `sun` (Group 450², angle E8) > `sun_active` (PartImage 16² at (217,26)) | The true sun. Against F2: apparent solar time. Against F1: the date. | **apparent solar day**; against F1, the **tropical year** | centre on r 191 (spans 187 to 195) | Gold star8 Ø8 `#E8B65A`, centre `#FFE2A0`, glow ≤ 1 px | 255 | 0 | PartImage |
| 4f | `par_rings` > `live` > `trail` | seconds | **second** | Arc about C, r 184.5. `startAngle` = E3 + 3.7, `endAngle` = E3 + 3.7 + 6·`[SECOND]`. | 1.6 px `#A6F46A` @80%, BUTT cap | 255 | 0 | PartDraw Arc |
| 4g | `par_rings` > `cage_orbit` (Group 450², angle E3) > `cage_frame` (Group x 205, y 23, 40², pivot 0.5/0.5, angle −E3) > `cage_shadow` (32² at (7,7)), `cage_body` (32² at (4,4)), `carriage` (PartDraw 24² at (8,8), angle 6·`[SECOND]`) | The Cosmotourbillon analogue; it marks **RA 12h**, the autumnal point | Orbit: **sidereal**, counter-clockwise. Carriage: **60 s**, stepped. | Ø24 centred on r 182; lane r 170 to 194 | section 5.1 (bright rotor) | 255 | 0 | bitmap + PartDraw in nested Groups |
| 4h | `par_rings` > `f2` (Group x −3, y −3, 456², pivot 0.5/0.5) > `flange_f2` (PartImage 456²), `night_sector` | the 24 h solar scale, the prompt, day/night | static scale; **day length** | Flange r 203.5 to 228 baked. Night sector: Arc about C, r 215, stroke 20, `startAngle` 180 + E9, `endAngle` 540 − E9. | section 5.1; night: black @35% | 255 | 0 | bitmap + PartDraw Arc |
| 5 | `plate_mask_aod` | keeps AOD stars off the digits | none | RoundRectangle x 115 to 335, y 164 to 264, corner 16 | `#000` | 0 | 255 | PartDraw |
| 6 | `plate_shadow` (PartImage at (114,163)), `plate` (PartImage 226 x 106 at (112,161)) | arched smoked glass | none | section 3.2 | 75 % black core, bevel; shadow black @70% | 255 | 0 | bitmap |
| 7 | `date`, `sign` (12-branch Condition) / `date_aod`, `sign_aod` | civil date and the sun's sign | civil day; sign from E11 | boxes in section 3.1, baseline 185.6 | 17 px `#B9C5CA` / AOD `#7F9472` | 255 / 0 | 0 / 255 | PartText |
| 8 | `par_dragon` > `dragon_shadow` (PartImage at (130,19)), `dragon_relief` (PartImage 190 x 140 at (130,19)); `dragon_aod` (outside the wrapper) | Official Kali dragon, path unchanged | none | Frame (135,24) 180 x 123. Ink x 147 to 305, y 23 to 139, 1,586 px. Max r 211.0 at (162,23) *(measured)*. | Phosphor metal with a per-stroke bevel (section 5.1) | 255 | `dragon_mask` tinted `#4E6644` | bitmap |
| 9 | `clock_active` + `colon` | HH:MM | civil minute | section 3.1 | Roboto Mono SemiBold 78 `#EFF8EC`; colon `#A6F46A` | 255 | 0 | DigitalClock + PartText |
| 10 | `colon_aod` + `clock_aod` (**last in document order**) | HH:MM asleep | civil minute | same boxes as z9 | BitmapFont `kw_outline`: 1.4 px `#91AD80` on `#0C160B`. Colon: fill `#0C160B`, Outline 1 px `#5E7A55`. | 0 | 255 | DigitalClock with BitmapFont + PartText |

**Order rules, which fix the crossfade leaks:**
- `subdisc_aod` (2f) lies under `subdisc` (3), and `plate_mask_aod` (5) lies under `plate` (6). An AOD footprint therefore never hides its Active counterpart while that fades in.
- The footprints are drawn above `sky_aod` (2b), so AOD stars never cross the digits or the sub-disc.

**Time scales on the face (nine):**

| Time scale | Where it shows |
|---|---|
| second | trail and carriage |
| civil minute and hour | HH:MM |
| apparent solar day | sun against the F2 numerals |
| day length | night sector on F2 |
| sidereal day | sky about P; rotor about C; calendar about C |
| tropical year | sun among the month names, and the sign in the date line |
| synodic month | globe |
| planetary motion | Jupiter, Saturn |

---

## 3. Composition

### 3.1 Coordinates

Every text box below is placed with the **measured baseline model**: baseline = box y + h/2 + 0.3884·size. This is Roboto Mono hhea (ascender 2146, descender −555, UPM 2048). On the SM-R965N it matches the production face's 78 px TimeText to within 0.2 px. `wffBox()` in the studio and in `gen-wff.cjs` derives every box from it; T5 verifies it for PartText.

| Element | Position | Size / colour | Notes |
|---|---|---|---|
| HH | `DigitalClock` x 113, y 179, w 224, h 86. `TimeText format="hh" hourFormat="24" align="CENTER"` at x 3, w 100. Centre x 166, baseline **252.3**. | Roboto Mono SemiBold 78 (static instance), `#EFF8EC` | Never moves or scales. 3.2 px of slack on each side of the 93.6 px advance. |
| colon | PartText x 201, y 175, w 48, h 86, align CENTER. x 225, baseline 248.3. | `#A6F46A`; AOD fill `#0C160B` + Outline 1 px `#5E7A55` | No blink. The box is wider than the 46.8 px advance. |
| MM | `TimeText format="mm"` at x 121, w 100; centre x 284 | as HH | |
| digit ink box | x 123 to 327, y 196.8 to 252.3 | | Plate margins: 8 px at the sides, 11.7 px below |
| plate | x 115 to 335, bottom y 264 | section 3.2 | Arched top: y 164 at x 225, 167.5 at x 133, 169.0 at x 115 (circle (225,1376.5), r 1212.5). Bottom corners r 16; top corners r 10. |
| date | PartText `25 OCT / SUN / ` (15 characters, 153 px) at x 133, y 167, w 160, h 24, align START. `sign` PartText at x 286, y 167, w 40, h 24, align START. Baseline 185.6. | 17 px Regular `#B9C5CA`, 10.2 px advance | Ink x 133.2 to 316.8, centred on 225. Cap top 173.5, 6 px under the arch. Always 18 characters. AOD uses the same boxes. |
| dragon | Frame (135,24) 180 x 123. PNGs 190 x 140 at (130,19). | phosphor metal | P is 24 px below the lowest pole-column ink |
| pole P / Polaris | (225,114) | 7 px reticle | |
| zenith | (225,177) | | under the date line |
| globe | centre G (390,206), Ø92; sprite 104² at (338,154) | | 9 px clear of the plate edge. Its top is 12.6 px from the crescent's right tip (387.5,147.5). |
| sub-disc | centre Q (149,333), r 60; `subdisc.png` 124² at (87,271) | section 3.3 | Q is 132.06 px from C at 215.1°. The outer edge at r 192.1 lies under the lip, the trench and the step, hidden over ±44.2° about its axis. |
| STP label | PartText x 129, y 302, w 40, h 16, align CENTER; baseline 314.3 | 11 px Medium `#9BAB9C`, 0.08 em | |
| steps value | PartText x 109, y 311, w 80, h 31, align CENTER; baseline 335.1 | 22 px Medium `#EFF8EC` | `6,240`, `12.3k`, at most `99.9k`: 5 characters, 66 px |
| battery value | PartText x 109, y 334, w 80, h 31, align CENTER; baseline 358.1 | 22 px Medium `#EFF8EC` (≤ 15 %: `#F3C479`) | `100%`: 4 characters. AOD uses the same box and size. |
| gauges | BAT: Arc r 44 about Q (outer stroke edge 177.06 from C). STP: Arc r 39.5 (inner edge 38.5 about Q). | 2 px | |
| rotor | orbit r 182, Ø24, lane r 170 to 194 | | 2.1 px clear of the sub-disc text (r ≤ 167.9) and 0.8 px clear of the month names (r ≥ 194.8) |
| seconds trail | r 184.5, from the rotor's clockwise rim | | 3.7° = asin(12/184.5) |
| sun | r 191, Ø8 (spans r 187 to 195, over the day ticks) | | It touches its own month name (caps from r 194.8) around the 16th: an overlap of ≤ 0.2 px of body, or ≤ 1.2 px with the glow. Stated, not avoided. |
| month names | centreline r 198.7 (caps r 194.8 to 202.6) | 11 px | Glyph tops toward C, so they read upright at 6 o'clock, where the current month spends the day |
| F2 numerals | centreline r 215 (caps r 210.4 to 219.6) | 13 px Medium | `00 02 04 06 08 10 14 16 18 20 22` at (360 − 15h) mod 360. Numerals strictly between 90° and 270° are flipped. |
| prompt | baked on F2: r 215 centreline, 199.35° → 160.65° reading left to right, upright at 6 o'clock | 11 px, tracking 0: `kali@vault:~$ ` in `#B9C5CA`, `INFINITY` in `#A6F46A` | The text is 145.2 px = 38.7°. INFINITY spans 174.72° → 160.65°. It is 8.5° clear of numeral 14 (150° ± 2.1°). |
| AOD INFINITY | `infinity_aod.png` 61 x 25 at (240,420), the same glyph raster as the Active INFINITY | `#7F9472` | It does not move between modes |
| AOD BAT | the same box as `bat_value` | 22 px `#7F9472` | |

- **Safe radius:** information text stays within **r 171**. The largest corner in use is 167.9, for the battery value *(measured)*.
- The instrument band is r 170 to 225.
- In AOD nothing is lit beyond **r 220**: INFINITY and the numerals reach 219.6, and the dragon reaches 211.

**Worst-case strings, all checked to pass:**

| Field | Worst case | Fit |
|---|---|---|
| steps | `99.9k`, `9,999` | 66 px; corner 36.36 px from Q, 2.1 px inside the STP gauge *(measured)* |
| battery | `100%` | 52.8 px |
| time | `23:58`, `08:08` | tabular |
| date | always 18 characters | |

### 3.2 How the digits are protected: the arched smoked-glass plate

- **Core:** black at **75 %**, composited in sRGB, over the whole shape. The sky continues beneath at 25 % sRGB value (about 4 % of the linear luminance of a core). At M1 the Milky Way covers 17 % of the plate area *(measured)* and visibly passes under the time.
- **Shape:** an arched top, straight sides, and a flat bottom with r 16 corners (section 3.1). No edge of the dial is a UI rectangle.
- **Bevel:** 1.5 px `#B9C5CA` @60% along the arch and the left edge, fading to 0 by the bottom-right corner. No black lip on the bottom or right.
- **Shadow:** a separate `plate_shadow.png`: the plate silhouette at (+3.5,+3.5), blur 1.5, black 70 %. On wake it lifts out from under the plate (section 6.1).
- **Contrast** of the digits `#EFF8EC` and the date `#B9C5CA` against what passes under the glass *(measured, sRGB blend)*:

| Under the glass | Seen as | L\* | Digits, 100 % / 40 % brightness | Date, 100 % / 40 % |
|---|---|---|---|---|
| ground `#141C24` | `#050709` | 1.8 | 18.6 / 8.2 : 1 | 11.4 / 5.3 : 1 |
| mid `#56646C` | `#16191B` | 8.5 | 16.3 / 7.7 | 10.0 / 5.0 |
| cloud `#9AA8AE` @85% | `#212526` | 14.3 | 14.2 / 7.3 | 8.8 / 4.7 |
| core `#E4ECEE` | `#393B3C` | 24.7 | 10.4 / 6.2 | 6.4 / 4.0 |

- **Gate G2 (section 8.4):** in the digit box, median L\* ≤ 8 and 99th percentile ≤ 30, at M1 to M8.
- 75 % is the lightest glass that still passes the 99th-percentile limit. At 65 %, a core reads L\* 35.3.
- Nothing is drawn above the plate core except the digits, the colon and the date.

### 3.3 The sub-disc (one eccentric sunken instrument)

`subdisc.png` (124 x 124, centre Q) contains:

- **Floor**, r < 58.5: `#2A3338` (L\* 20.6) with sunray hairlines every 3°, alternating `#323C42` and `#232B2F`, from r 6 to r 56, and a centre boss of r 4 in `#1A2024`.
- **Inner-wall shadow:** black 70 %, with a hard width of 2.5 px x max(0, cos(θ − 315°)) from the lip inward, then a 4 px feather. It runs L\* 20.6 → 4.3, or 11.0 → 1.7 at 40 % brightness *(measured)*.
- **Lip**, r 58.5 to 60: the phosphor-metal inner wall. SweepGradient about Q: 135° `#D2FFA4`; 90° and 180° `#8CCB5A`; 45° and 225° `#4E7F34`; 315° `#1F3315`.
- **No outward shadow.** Beyond r 180 about C, the ring stack covers it.

Vectors drawn on top:

| Element | Spec |
|---|---|
| Gauge tracks | Arc r 44 and r 39.5 about Q, 2 px `#0B0E10`, full circle |
| BAT value arc | Arc r 44, 2 px `#A6F46A`, ROUND cap, from 0° to 360·`[BATTERY_PERCENT]`/100. It turns `#F3C479` at ≤ 15 %. |
| STP value arc | Arc r 39.5, 2 px `#C8D1D5`, ROUND cap |
| Text | STP label, steps value and battery value, in the boxes in section 3.1 |

Values are on the floor at 11.9 : 1, or 6.6 : 1 at 40 % brightness *(measured)*.

At M1 the rotor centre is at (104,361), 53 px from Q: it flies over the sub-disc rim and the BAT gauge, which is the photo's tourbillon-in-its-sub-dial moment.

The sub-disc is camera-locked, like the plate, so that its values never misregister against their gauges.

---

## 4. Astronomy model

### 4.1 Site and time base

| Item | Value |
|---|---|
| Site | Seoul, 37.5665 N, 126.978 E. Hard-coded as a personal face. |
| Clock source | E1 = `([HOURS_SINCE_EPOCH] - 490896)/24 + [MINUTE]/1440`. HOURS_SINCE_EPOCH (about 4.9e5) is exact in float32. `[MINUTE]` is local, and equals the UTC minute in whole-hour zones such as KST. |
| Epoch | 2026-01-01 00:00 UT = hour 490,896 = JD 2461041.5 |
| Precision | E1 resolves about 0.16 min at d ≈ 1,800 even in float32. The older `[MINUTES_SINCE_EPOCH]` form (about 2.95e7, above 2^24) would step every 2 minutes in float32 now and every 4 minutes after 2033. It is kept only as the fallback if T7 sees a glitch at the hour boundary. |
| Studio oracle | `astro.js` (Meeus: sun, moon, LST), plus the new `planets.js` (JPL approximate Keplerian elements, 1800 to 2050) |
| Catalogue epoch | `stars.js` is J2000. The generator precesses it to J2026.5 (IAU 1976), which removes the 0.36° offset against LST of date. |

### 4.2 Projection and orientation

- North-polar **stereographic**: r(δ) = 128·tan((90° − δ)/2) px about P (225,114).
- Looking-up planisphere: north up, **east left, west right**, south at the bottom.
- A star at RA α is painted at clock angle 180° + α about the bitmap centre at LST 0. The `sky` Group turns by E3 = 360 − LST, so the stars move counter-clockwise, rising on the left and setting on the right.

| Feature | Position |
|---|---|
| Zenith | (225,177) |
| North point | (225,70.5) |
| Horizon | exact circle about H (225,280.4), r 209.9 |
| Crescent | 25.5 px at 12 o'clock; meets r 180 at ±64.5° about C |

- **Aperture:** r < 180 about C. Everything visible lies above the horizon. At the bottom edge, the lip is at about +9.6° altitude in the south.
- **Southern reach:** δ −42.8° at culmination.

**Scale** *(measured)*:

| Where | px/deg | Example |
|---|---|---|
| δ 90° to 60° | 1.12 to 1.19 | Dubhe to Alkaid 31 px |
| δ 0° | 2.23 | Betelgeuse to Rigel 42 px |
| δ −40° | 6.25 | |

### 4.3 Catalogue, figures, names, Milky Way

**Stars:** `stars.js` (366 stars) plus the new generated `stars-faint.js`. The faint file holds the Yale BSC5 stars (VizieR V/50, text) with 4.5 < V ≤ 5.0 and δ ≥ −43°, about 590 rows, as real-sky "dust".

| Magnitude | Core | Colour |
|---|---|---|
| ≤ 1.0 | Ø3.2 + 1 px bloom @40% | `#E4ECEE` |
| 1.0 to 3.0 | Ø2.4 | `#B9C5CA` |
| 3.0 to 4.5 | Ø1.8 + 1 px bloom @30% | `#9AA8AE` |
| 4.5 to 5.0, and figure members fainter than 4.5 | Ø1.4 | `#6E7B81` (L\* 50.8) |

No core is below 1.4 px. The bakes are 2x supersampled.

**Figures:** all 33, as lines 1.6 px `#9AA8AE` at 100 % (L\* 68). This is the time-invariant brightness floor.

**Draco:** 14 stars, drawn as a **dotted** line:
- 1.4 px `#D2FFA4` @35% (L\* 43.1 over the ground), 1.4 px on and 2.8 px off;
- Eltanin and Rastaban as Ø2.6 `#A6F46A` dots.

Draco lies 19.4 to 44.7 px from P. It is the only colour on the grisaille. The dotted texture and the 20-point ΔL\* to the dragon's darkest body tone (`#6FA947`, L\* 63.5) keep it from merging with the logo.

**Names:** 24 upright PartText labels in 11 px Regular `#B9C5CA` @80% (L\* 66.4 over the ground), tracking 0.08 em, as uppercase 3-letter IAU abbreviations:

**CAS CEP UMA PER CYG AUR LYR AND HER BOO CRV CMA CNC TAU LEO PEG LIB ARI CRB GEM ORI SCO AQL DRA**

- They were chosen by hours in open sky, with the new masks. The label box must be open, and at least 60 % of the figure's stars must be open.
- UMI is left out because its anchor is 17 px from DRA's, so the upright labels would overlap at many rotation angles. Polaris carries the reticle instead.
- Anchor pairs closer than 23.4 px are not used. The closest pairs, CAS–CEP, CYG–LYR and BOO–CRB, are at 23 px, which overlaps by at most 0.4 px over 1.5° of rotation.
- Result *(measured)*:
  - ≥ 3 names readable at every degree of LST;
  - ≥ 4 for 99.2 % of the day;
  - **mean 7.0**, where 05 had 1.5.
- At M1: DRA PER AUR BOO CRV CMA TAU CRB.
- Under the glass, names show at 25 % automatically. Behind the dragon they are occluded by its openwork, like the stars.

**Figures in open sky:** at least 8 of the 33 have ≥ 60 % of their stars in open sky at every LST hour *(measured)*.

**Milky Way:** painted in galactic coordinates. The generator converts each chart pixel to (l, b) at J2026.5. This replaces `sky.js` `paintedMilkyWay`, whose stroke scaled with `o.scale/1.633`.

- Envelope: |b| ≤ 14°. Nothing is painted outside it.
- Longitude weight w(l):

| l | w | Region |
|---|---|---|
| 330° to 40° | 1.00 | Sco–Sgr–Sct–Aql |
| 40° to 65° | 0.90 | Vul–Sge |
| 65° to 90° | 1.00 | Cyg |
| 90° to 140° | 0.75 | Cep–Cas |
| 140° to 220° | 0.65 | Per–Aur–Gem–Mon |
| 220° to 270° | 0.80 | CMa–Pup |
| 270° to 330° | 1.00 | Vel–Car–Cen, mostly below the horizon |

- Tone value: t = w(l)·(1 − |b|/14°) + 0.18·n(l,b), where n is seeded 3-octave value noise with a 6° base scale. This is the brushwork.
- Tone map:

| t | Tone |
|---|---|
| ≥ 0.80 | core `#E4ECEE` |
| 0.45 to 0.80 | cloud `#9AA8AE` @85% |
| 0.20 to 0.45 | mid `#56646C` |
| 0.05 to 0.20 | wisp `#2E3A42` |
| below 0.05 | ground |

- Clouds reach |b| ≈ 7.7° where w = 1 and 4.3° in the anticentre. Cores reach |b| ≈ 2.8°.
- **Great Rift:** for l 20° to 80° and b −1° to +4°, t is multiplied by 0.35.
- **Measured share of open sky inside |b| < 8°:** min 4.9 %, median 11.9 %, max 22.8 % over the sidereal day. At M1: 22.2 % of open sky, which is 8.0 % of the dial.
- The galactic equator passes 30.9 px from P, on the Cassiopeia side, opposite Draco (RA 9.5h to 19.5h). With this envelope the cloud tone (t ≥ 0.45, w 0.75 there) stays about 24 px or more from P, and the faintest wisps stay 14.7 px or more, so Polaris and the reticle stay clear.

### 4.4 PPI graticule (radar DNA, Active only, first to cut)

Baked into `sky_active`, so it rotates with the sky against the static F2.

| Element | Spec |
|---|---|
| Declination circles about P | +60 / +30 / 0 / −30° at r 34.3 / 73.9 / 128.0 / 221.7: 1.0 px `#A6F46A` @10% |
| RA spokes | every 30° (2 h), r 40 to 293: 1.0 px `#A6F46A` @8% |

It is the first element cut if the G5 thumbnail check or the director's eye reads clutter.

### 4.5 Sun, zodiac, calendar, rotor, night sector

**Sun:** the true sun. Its dial angle is E8 = 180 + α☉ − LST.
- Solar noon is at 180°, midnight at 0°, sunrise on the left and sunset on the right.
- Hour h sits at (360 − 15h) mod 360.
- At M1 the sun is at 66.0°, which is 19:36 apparent solar time, just after sunset *(measured)*.

**Calendar (F1):** the ring is fixed in the RA frame (Group angle E4 = 180 − LST). A mark at local angle α appears at 180 + α − LST.

Month rules sit at the sun's RA on the 1st; names are centred at the sun's RA on the 16th at 12:00 KST. Values for 2026, unchanged from 05:

| Month | 1st | Name | Month | 1st | Name | Month | 1st | Name |
|---|---|---|---|---|---|---|---|---|
| JAN | 281.1 | 298.0 | MAY | 37.9 | 52.9 | SEP | 159.9 | 173.8 |
| FEB | 314.2 | 329.6 | JUN | 68.6 | 84.6 | OCT | 186.9 | 201.1 |
| MAR | 341.6 | 355.9 | JUL | 99.6 | 115.5 | NOV | 215.8 | 231.4 |
| APR | 10.0 | 24.3 | AUG | 130.9 | 145.6 | DEC | 246.7 | 263.6 |

- Day ticks on the 5th, 10th, 15th, 20th and 25th are placed at the sun's RA on those dates.
- The ring drifts by less than 0.25° a year.

**Rotor:** it marks **RA 12h** (local angle 180° on the calendar ring, between the end of SEP at 176.9° and the OCT 1st rule at 186.9°). Its dial angle is therefore E3.
- RA 12h was chosen so that the rotor sits in the sub-disc (dial 205° to 225°) at LST 135° to 155°, which is exactly when the bright winter Milky Way is in open sky (22 % of open sky).
- With RA 0h, the rotor would reach the sub-disc only at LST about 22h, when the band is under the glass (5 to 10 %).

**Equinox eclipse:** the rotor covers the sun fully from 21 to 25 Sep and partly from 18 to 28 Sep (M4: rotor 186.0°, sun 186.2° *(measured)*). This is intended, and the opaque rotor needs no special handling.

**Zodiac sign:** E11 = floor(λ☉/30), giving ARI TAU GEM CNC LEO VIR LIB SCO SGR CAP AQR PSC. It appears in the date line in `#B9C5CA`, not gold.

**Night sector on F2:** black @35% over F2, from 180 + H0 (sunrise, left) clockwise through 0° to 540 − H0 (sunset, right).
- H0 = 90 + deg(asin(clamp(0.76920·tan δ☉, −1, 1))), ranging 70.5° to 109.5°.
- At M1 H0 = 97.9°, so the night sector spans 164°.
- It replaces 05's day-arc hairline. F2 numerals in the night sector drop to 3.0 : 1 at the lit 315° worst case.

### 4.6 Bakes for the vault

**`sky_active.png`** (586 design, 625 device), bake order:
1. ground `#141C24` (L\* 9.8);
2. Milky Way (4.3);
3. graticule;
4. figure lines (Draco last, dotted);
5. stars and dust;
6. Eltanin and Rastaban.

The names are live text (z1b), not baked.

**`dome_light.png`** (364² at (43,43), the r 182 disc):
- **Glaze:** white, radial at (150,150), σ 95, 12 % peak.
- **SE fall-off:** black alpha = 0.40·smoothstep(130, 180, r)·max(0, cos(θ − 135°)).
- **Lip occlusion and cast shadow:** black 50 % at r 180 fading to 0 at r 172, plus a 0.9 px hard edge, both weighted by max(0, cos(θ − 315°)).
- **Pole reticle:** a 7 px cross of two 1 px lines with a 2 px centre gap at P, `#A6F46A` @80%. This is the terminal cursor on Polaris.

### 4.7 Moon phase (the globe)

- Source: `[MOON_PHASE_POSITION]`, integer days since new moon, 0 to 28.
- S9 = round(min(p, 29.53 − p)·0.5417), giving 0 (new) … 8 (full).
- In the studio it is checked against `astro.js` elongation: equal at M1 to M4 and M6 to M8; one step lower at M5 *(measured)*.
- The fallback, if T21 fails, is the 05 elongation expression (λ☾ − λ☉).
- **Sprites** `luna_0..8` (104², globe Ø92):

| Element | Spec |
|---|---|
| Lighting | always from **315°** (the key light) |
| Sprite k | the illuminated fraction for elongation k·22.5°; the terminator ellipse is perpendicular to the 315° axis |
| Lit side | `#F2F4F1` limb highlight → `#E4E8E6` body → `#C3C9C8` near the terminator. Limb darkening is ≥ 25 L\* on the full sprite. |
| Maria | `#9AA3A3` @25%, fixed |
| Unlit side | earthshine `#3A4448` → `#1E232A`, with a 1 px `#4A555B` rim. The new moon (S9 = 0) still reads as a sphere. |
| Halo | 6 px `#E4E8E6` @25% on the lit side, inside the 6 px sprite margin |

- The globe does not rotate. The lip hides its eastern (shadow) side, the part from 3.6° to 163.2° about G.
- It is a **phase instrument mounted in the dome**: it shows the illuminated fraction, not waxing versus waning, and not the moon's sky position. There is no second moon on the chart.

### 4.8 Planets

- Geocentric positions from a circular Earth plus a planet orbit with an equation of centre (β = 0), as in 05, published through References (section 4.9).
- Errors against JPL approximate elements, 2026 to 2030: Jupiter ≤ 0.74° in RA and 1.42° in dec; Saturn ≤ 1.03° and 2.63° (05, unchanged).
- Over a year *(measured)*:

| Planet | Open sky | Behind the glass | Outside the aperture | Under the crescent |
|---|---|---|---|---|
| Jupiter | 22.7 % | 32.7 % | 36.3 % | 8.2 % |
| Saturn | 19.0 % | 34.1 % | 40.5 % | 6.4 % |

  The planets are often read through the glass; the docs say so.
- M3 shows both planets in open sky: Jupiter (131,153), Saturn (341,149).
- Sprites:
  - Jupiter Ø16 with 2 bands.
  - Saturn Ø11 with a 26 x 5 ring at a fixed screen tilt of −20°. The true position angle is not modelled, and the opening (under 10° in 2026 to 2027) is exaggerated to about 11° so that the ring reads.
  - Both are counter-rotated, so their light stays world-fixed at 315°.

### 4.9 Expressions (WFF form; the studio evaluates the same strings, section 8.2)

**Helpers:**
- `W(x)` stands for `((x) - 360*floor((x)/360))`, which does not depend on how `%` handles floats.
- `[REFERENCE.n]` reads carrier n. Each carrier is a Group (not a Part, so the memory tool never counts it as an analog clock) with `<Transform target="angle" value="…"/>` and `<Reference name="n" source="angle" defaultValue="0"/>`.
- Carriers come first in the document, in the order of the table, and only publish values in [0, 360) except `dsun`.
- If T9 fails, `wff-expr.js` inlines every reference with its macro expander. If T10 then fails on size, the planets are dropped first.

| # | Name | Expression | Carrier |
|---|---|---|---|
| E1 | d, days since epoch | `([HOURS_SINCE_EPOCH] - 490896) / 24 + [MINUTE] / 1440` | inlined into the carriers only |
| E2 | LST | `W(227.64 + 360*fract(E1) + 0.98564737*E1)` | `lst` |
| E3 | sky angle; also `cage_orbit`, `sky_aod_mount`, `cage_aod_mount` | `W(360 - [REFERENCE.lst])` | |
| E4 | calendar angle | `W(180 - [REFERENCE.lst])` | |
| E5 | λ☉ | `W(280.667 + 0.98564736*E1 + 1.9146*sin(rad(357.282 + 0.98560028*E1)) + 0.02*sin(rad(2*(357.282 + 0.98560028*E1))))` | `lsun` |
| E6 | α☉ | `W(L - 2.4657*sin(rad(2*L)) + 0.0529*sin(rad(4*L)))`, with L = `[REFERENCE.lsun]` | `asun` |
| E7 | δ☉ | `deg(asin(0.39777*sin(rad([REFERENCE.lsun]))))` | `dsun` |
| E8 | sun angle (`sun`, `sun_aod_mount`) | `W(180 + [REFERENCE.asun] - [REFERENCE.lst])` | |
| E9 | H0 | `90 + deg(asin(clamp(0.76920*tan(rad([REFERENCE.dsun])), -1, 1)))` | |
| E10 | night sector | `startAngle = 180 + E9`, `endAngle = 540 - E9` | |
| E11 | sign index | `floor([REFERENCE.lsun] / 30)`; 12 named booleans | |
| E12 | moon sprite | `round(min([MOON_PHASE_POSITION], 29.53 - [MOON_PHASE_POSITION]) * 0.5417)`; booleans `s0` … `s8` | |
| E13 | Jupiter λ | `LJ = 103.430 + 0.08308677*E1`; `MJ = LJ - 14.73`; `lJ = LJ + 5.546*sin(rad(MJ))`; `rJ = 5.2029*(1 - 0.0484*cos(rad(MJ)))`; `XJ = rJ*cos(rad(lJ)) + cos(rad([REFERENCE.lsun]))`; `YJ = rJ*sin(rad(lJ)) + sin(rad([REFERENCE.lsun]))`; `W(deg(atan(YJ/XJ)) + ((XJ < 0) ? 180 : 0))` (about 0.9 KB inlined) | `lj` |
| E14 | Saturn λ | the same form with `LS = 7.807 + 0.03347054*E1`, `MS = LS - 92.60`, centre term `6.172`, `rS = 9.5367*(1 - 0.0539*cos(rad(MS)))` | `ls` |
| E15 | planet α, δ from λ | `δ = deg(asin(0.39777*sin(rad(λ))))`; `α = W(λ - 2.4657*sin(rad(2*λ)) + 0.0529*sin(rad(4*λ)))` | |
| E16 | body position inside the `sky` Group (586 frame, P = (293,293)); no LST | `R = 128*tan(rad((90 - δ)/2))`; `x = 293 + R*sin(rad(180 + α)) - w/2`; `y = 293 - R*cos(rad(180 + α)) - h/2` | |
| E17 | counter-rotation (names, planets, `cage_frame`) | `0 - E3` | |
| — | carriage | `[SECOND] * 6` | |
| — | trail | `startAngle = E3 + 3.7`, `endAngle = E3 + 3.7 + [SECOND]*6` | |
| — | battery arc | `endAngle = 360 * [BATTERY_PERCENT] / 100`. Colour Transform: `[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(166,244,106)`. | |
| — | steps arc | `endAngle = 360 * clamp([STEP_COUNT] / clamp([STEP_GOAL], 1, 1000000), 0, 1)` | |
| — | steps text | `Condition [STEP_COUNT] >= 10000`: Template `%sk` with `numberFormat("0.0", floor(clamp([STEP_COUNT], 0, 99999) / 100) / 10)`. Otherwise `numberFormat("#,##0", [STEP_COUNT])`. `floor` prevents `100.0k`, and `numberFormat` prevents float output such as `12.0.3.0k` (T8). | |

**Validation samples** (`table.cjs`; the E1 forms agree to < 0.001 min):

| Id | KST | LST (E2) | E3 = rotor | E4 | E8 (sun) | H0 | sign | S9 | Jupiter (dial) | Saturn (dial) |
|---|---|---|---|---|---|---|---|---|---|---|
| M1 | 2027-04-16 20:08 | 138.35 | 221.65 | 41.65 | 65.99 | 97.9 | ARI | 5 | (223,211) behind the glass | (321,56) outside the aperture |
| M2 | 2026-10-25 10:08 | 177.42 | 182.58 | 2.58 | 212.06 | 80.6 | SCO | 7 | (278,199) glass | (248,−4) outside |
| M3 | 2026-11-20 02:00 | 80.72 | 279.28 | 99.28 | 334.38 | 74.1 | SCO | 5 | (131,153) **open** | (341,149) **open** |
| M4 | 2026-09-23 12:00 | 173.96 | 186.04 | 6.04 | 186.15 | 90.0 | LIB | 6 | (279,195) glass | (260,1) outside |
| M5 | 2026-06-21 12:00 | 81.31 | 278.69 | 98.69 | 188.46 | 109.5 | GEM | 3 | (170,183) glass | (334,156) open |
| M6 | 2026-10-25 08:08 | 147.34 | 212.66 | 32.66 | 242.06 | 80.6 | SCO | 7 | (228,214) glass | (304,24) outside |
| M7 | 2026-11-09 20:08 | 342.62 | 17.38 | 197.38 | 61.98 | 76.5 | SCO | 0 | (198,16) outside | (174,223) glass |
| M8 | 2026-11-17 20:08 | 350.50 | 9.50 | 189.50 | 62.26 | 74.6 | SCO | 4 | (186,20) outside | (190,230) glass |

LST error against `astro.js` is ≤ 0.10° (from minute truncation).

---

## 5. Palette, typography, strokes

### 5.1 Tokens (the lint's complete list; any other hex fails `verify.cjs`)

| Token | Hex | L\* | Role |
|---|---|---|---|
| `phosphor.spec` | `#EFFFD8` | 98.0 | 0.6 px dragon bevel highlight |
| `phosphor.hi` | `#D2FFA4` | 95.1 | Metal highlight: NW edges, gradient peaks, bead, Draco (@35%) |
| `phosphor` | `#A6F46A` | 88.9 | Identity: colon, trail, BAT gauge, Eltanin and Rastaban, reticle, INFINITY, graticule (@8–10%) |
| `phosphor.mid` | `#8CCB5A` | 75.5 | Gradient stop |
| `phosphor.low` | `#6FA947` | 63.5 | Dragon SE body |
| `phosphor.shade` | `#4E7F34` | 48.3 | Metal shade |
| `phosphor.deep` | `#3C6328` | 37.9 | 0.6 px dragon bevel shade |
| `phosphor.foot` | `#1F3315` | 18.9 | Darkest metal stop |
| `paper` | `#EFF8EC` | 96.6 | Digits, values, F2 numerals, rotor jewel |
| `quiet` | `#9BAB9C` | 68.4 | Sub-disc label |
| `transfer` | `#B9C5CA` | 78.8 | Date, prompt, names, rules, plate bevel, star.2 |
| `transfer.month` | `#C8D1D5` | 83.3 | Month names (@85%), long ticks, STP gauge |
| `tick.day` | `#8A979C` | | short day ticks |
| `sky.ground` / `sky.wisp` / `sky.mid` / `sky.cloud` / `sky.core` | `#141C24` / `#2E3A42` / `#56646C` / `#9AA8AE` / `#E4ECEE` | 9.8 / 23.7 / 41.5 / 68.0 / 92.9 | Grisaille Milky Way; `sky.cloud` is also the figure-line colour and star.3 |
| `star.faint` | `#6E7B81` | 50.8 | dust and faint figure stars (shared with `opaline.hi`) |
| `star.faint.hi` | `#7C888E` | | G1 remedy 2 only (the dust tone raised) |
| `opaline.hi` / `opaline.mid` / `opaline.lo` | `#6E7B81` / `#4A555B` / `#2E363A` | 50.8 / 35.4 / 22.0 | F2 sweep (315° / 45° and 225° / 135°). The crescent uses mid → lo. Earthshine rim. |
| `earth.hi` / `earth.lo` | `#3A4448` / `#1E232A` | 28.1 / 13.5 | globe's unlit side |
| `floor` / `floor.hi` / `floor.lo` | `#2A3338` / `#323C42` / `#232B2F` | 20.6 | sub-disc sunray floor |
| `engrave` | `#1A2024` | 11.8 | F2 ticks, numeral shadow, sub-disc boss |
| `hairline.dark` | `#0E1215` | | sunray hairline base |
| `track` | `#0B0E10` | 3.8 | gauge tracks |
| `lacquer.trench` / `lacquer.f1` / `groove` | `#030405` / `#08090A` / `#050607` | 1.1 / 2.4 | black levels |
| `cage.slot` | `#0A0F11` | | rotor arms |
| `luna.limb` / `luna.body` / `luna.term` / `luna.maria` | `#F2F4F1` / `#E4E8E6` / `#C3C9C8` / `#9AA3A3` | | globe lit side |
| `planet.body` / `planet.band` / `planet.ring` / `planet.limb` | `#D6D9D4` / `#A3AAA8` / `#B9C1BF` / `#5A6264` | | Jupiter, Saturn |
| `sun` / `sun.hi` | `#E8B65A` / `#FFE2A0` | 76.9 | **The only gold**: star8 Ø8, glow ≤ 1 px |
| `warning` | `#F3C479` | 81.8 | battery ≤ 15 % only: a state colour |
| `glass` | `#000000` @75% | | plate core |
| AOD set | `#91AD80` outline, `#0C160B` fill, `#5E7A55` colon and rotor, `#7F9472` text, `#4E6644` dragon, `#5A6870` stars, `#4D633F` ticks, numerals and Draco, `#2C3A33` hairlines, `#6B7A80` moon limb, `#8A6A2C` sun and battery warning | | AOD only |

**Gradients (one light):**

| Element | Gradient |
|---|---|
| Lip (SweepGradient on the r 181.25 stroke, 2.5 px) | 0° `#8CCB5A`, 45° `#4E7F34`, 135° `#1F3315`, 225° `#4E7F34`, 315° `#D2FFA4`, 360° `#8CCB5A` |
| Step, F2 chamfer, sub-disc lip (inner walls, lit at SE) | 135° `#D2FFA4`; 90° and 180° `#8CCB5A`; 45° and 225° `#4E7F34`; 315° `#1F3315` |
| Rotor rim | as the lip, world-fixed by the counter-rotation |
| Horizon bead (baked; φ = clock angle about H; w = max(0, cos(φ − 315°))) | Outer 2.5 px (crescent side): mix(`#4E7F34`, `#D2FFA4`, w). Inner 2.5 px (sky side): mix(`#1F3315`, `#4E7F34`, w). It is brightest on the left flank (w ≈ 1.0), 0.71 at the top, and shade on the right flank. |
| Dragon fill (linear 315° → 135°) | `#D2FFA4` → `#A6F46A` → `#6FA947` |

**Dragon:**
- Baked at 4x with a per-stroke bevel: 0.6 px `#EFFFD8` where an ink pixel's NW neighbour is empty, and 0.6 px `#3C6328` on SE edges.
- Contact bed: the path dilated 1.5 px, black 85 %, 1 px feather (05 used 3 px).
- `dragon_shadow.png`: black 60 %. Each receiving pixel is offset by 1.25·(4 − h) along 135°, where h is read from a static height map (sky −1, crescent and lip 0, F1 +1, F2 +2), and blurred by 0.3 x the offset. The receivers are listed in 2.1.

**`crescent.png`** (330 x 108 at (60,43)):
- Face: a linear gradient along 315° → 135° from `#4A555B` to `#2E363A`.
- Eccentric guilloche: circles about H every 2.5 px, ±12 % luminance.
- The bead, r 209.9 to 214.9 about H.
- The bead's directional shadow on the sky (2.1).
- Clipped to r < 180 about C.

**`flange_f2.png`** (456², Group at (−3,−3)):
- Chamfer r 203.5 to 205.
- Face r 205 to 228: the opaline sweep plus a radial-hairline guilloche of 360 lines at a 1° pitch (3.75 px at r 215), ±20 % luminance, with every 5th line +35 %.
- 96 engraved quarter-hour ticks, r 205 to 207.5, 1 px `#1A2024`, left out under the numerals, batons and inscription.
- Even numerals, 13 px Medium `#EFF8EC`, with a 1 px `#1A2024` engraved shadow at (+0.75,+0.75).
- Odd batons (all except 11 and 13): 2 x 9 px at r 210.5 to 219.5, `#D2FFA4` on the NW edge and `#4E7F34` on the SE edge.
- The inscription (3.1).
- F2's cast shadow on the groove and F1 (2.1), so the PNG starts at r 201.

**Rotor:**
- `cage_body.png` (32², Ø24):
  - Bridge disc r ≤ 10.5: radial gradient centred (−4,−4) from the rotor centre, `#D2FFA4` → `#A6F46A` at r 6 → `#4E7F34` at r 10.5.
  - Rim r 10.5 to 12: 1.5 px, lip gradient.
- `carriage` (vectors, at 6·`[SECOND]`):
  - three `#0A0F11` slots, 1.4 px wide, from r 2.5 to 9 at 0°, 120° and 240°;
  - a balance ring r 6.5, 1 px `#1F3315`;
  - a jewel Ø3.5 `#EFF8EC` with a 0.8 px `#1F3315` ring.
- `cage_shadow.png`: the silhouette at (+3,+3), blur 1.3, black 60 %.
- About 290 px² of the rotor is at Y ≥ 40 %; 05's dark cage had about 150 px².

**Contrast checks** *(measured)*:

| Text | Background | Contrast |
|---|---|---|
| F2 numeral | `#6E7B81` (lit, worst) | 4.0 : 1 (3.0 : 1 under the night sector) |
| F2 numeral | `#4A555B` / `#2E363A` | 7.0 / 11.3 : 1 |
| month names @85% | F1 | 9.4 : 1 |
| names @80% | sky ground | 6.7 : 1 |
| values | sub-disc floor | 11.9 : 1 |

### 5.2 Typography

Roboto Mono, shipped as **static instances** made with `fontTools.varLib.instancer` from the variable `RobotoMono.ttf` (wght 400 / 500 / 600):
- `roboto_mono_regular.ttf`, `roboto_mono_medium.ttf`, `roboto_mono_semibold.ttf`;
- WFF uses `family="roboto_mono_semibold" weight="NORMAL"` and so on, so the runtime never synthesises bold (T6);
- the studio and every bake (including `kwo_*`) use the same three files.

| Use | Size | Instance | Tracking | Colour |
|---|---|---|---|---|
| HH:MM | 78 | SemiBold | 0 | `#EFF8EC`, colon `#A6F46A` |
| Date line | 17 | Regular | 0 (10.2 px advance) | `#B9C5CA` |
| Sub-disc values | 22 | Medium | 0 | `#EFF8EC` |
| Sub-disc label | 11 | Medium | 0.08 em | `#9BAB9C` |
| F2 numerals | 13 | Medium | 0 | `#EFF8EC` |
| Month names | 11 | Regular | 0.06 em | `#C8D1D5` @85% |
| Constellation names | 11 | Regular | 0.08 em | `#B9C5CA` @80% |
| Prompt on F2 | 11 | Regular | 0 | `#B9C5CA` + `#A6F46A` |
| AOD numerals | 13 | Medium | 0 | `#4D633F` |
| AOD BAT value | 22 | Medium | 0 | `#7F9472` |

Text under 11 px does not exist. Everything at 11 px except the sub-disc label is decoration.

### 5.3 Strokes

| Element | Weight |
|---|---|
| Lip | 2.5 px |
| Trench | 4 px fill |
| Step, F2 chamfer | 1.5 px |
| Groove | 1 px |
| F1 inner rule | 1 px |
| Ticks | 1.0 / 1.2 px |
| Trail | 1.6 px |
| Gauges | 2.0 px |
| Rotor rim, carriage slots | 1.5 / 1.4 px |
| Horizon bead | 5 px |
| Figure lines | 1.6 px |
| Draco | 1.4 px dotted |
| Graticule | 1.0 px |
| AOD outline | 1.4 px |
| AOD hairlines | 1.0 to 1.25 px |

Nothing is thinner than 1.0 px at 450, except the dragon's 0.6 px bevels, which are shading inside a stroke, not lines.

---

## 6. Motion

### 6.1 Wake (AOD → Active)

The reference window is W = 360 ms. WFF `startOffset` and `duration` are fractions of the device window. Interpolation everywhere is `CUBIC_BEZIER`, `controls="0.22 1 0.36 1"` (fallback `EASE_OUT`, T3). `angleDirection` is left at its default, `NONE`, so the angle takes the short numeric path in both directions (T2).

| ms at W = 360 | startOffset / duration | Active nodes (AMBIENT value → Active value) | AOD nodes (255 → 0) |
|---|---|---|---|
| 0 to 200 | 0 / 0.556 | `sky_active` alpha 0 → 255 | `sky_aod_mount` (same angle, so no doubling) |
| 0 to 360 | 0 / 1.0 | `f2` angle −14° → 0 (clockwise, the v4 signature) and alpha 0 → 255. The night sector rides inside it. | |
| 40 to 240 | 0.111 / 0.556 | `crescent`, `rings`, `calendar`, `f1_gloss`, `luna`, `names`, `jupiter`, `saturn`, `dome_light` | `occluder_aod`, `ground_aod`, `luna_aod`, `aod_marks` |
| 80 to 320 | 0.222 / 0.667 | `subdisc`, `plate` (alpha only) | `subdisc_aod` (it lies under `subdisc`) |
| 320 to 360 | 0.889 / 0.111 | | `plate_mask_aod` (it lies under `plate`, so the sky cannot leak under the digits) |
| 120 to 340 | 0.333 / 0.611 | `clock_active`, `colon`, `date`, `sign`. Same boxes: **the digits fill in place**. | `clock_aod`, `colon_aod`, `date_aod`, `sign_aod` |
| 120 to 360 | 0.333 / 0.667 | `dragon_relief` alpha; **shadow lifts**: `dragon_shadow` and `plate_shadow` alpha 0 → 255 with x/y from base − (3,3) → base | `dragon_aod` |
| 200 to 360 | 0.556 / 0.444 | `live` (trail), `cage_frame`, `sun_active` | `aod_live` |

Every startOffset + duration is ≤ 1.0.

**Read order:** the sky lights while F2 swings 14° clockwise into place against it. The crescent, the rings and the globe arrive. The sub-disc and the glass appear. The digits fill. The dragon and the glass rise off the dial as their shadows slide out to full length. Then the rotor starts and the seconds trail appears.

**Spatial Variants** exist only on `f2` (angle), `dragon_shadow` and `plate_shadow` (x, y). All three are Active-only, so the AOD picture is never displaced. There are no scale Variants.

**Mapping fractions to a real window:**
- If T1 measures W > 360 ms, the generator multiplies every fraction by 360/W, so visible motion still ends at 360 ms.
- If W < 360 ms, the fractions are kept and the order compresses.

### 6.2 Slow real-time rotations (both modes; re-evaluated each minute)

| Object | Pivot | Sense | Rate | Period |
|---|---|---|---|---|
| Sky with names, planets and Draco (`sky`, `sky_aod_mount`) | P | counter-clockwise | 0.25068°/min (0.88 px/min at r 200 about P) | 23 h 56 m 04.09 s |
| Rotor (`cage_orbit`, `cage_aod_mount`) | C | counter-clockwise | 0.25068°/min (0.80 px/min at r 182) | sidereal day |
| Calendar ring | C | counter-clockwise | 0.25068°/min | sidereal day |
| Sun | C | counter-clockwise | about 0.25°/min ± equation of time | apparent solar day |
| Sun against the calendar | | clockwise | 0.9856°/day | 365.24 d |
| Globe | | none (fixed key light) | sprite changes about every 1.85 d | 29.53 d |
| Night sector ends | | | per day | tropical year |
| Jupiter / Saturn | inside `sky` | with the sky, plus their own motion | | 11.86 / 29.46 yr |

### 6.3 Per second (Active only)

- The `carriage` steps to 6·`[SECOND]`, with no `Animation`.
- The `trail` endAngle advances by 6° (about 19.3 px/s at r 184.5) and resets to the rotor's rim each minute.
- Nothing else moves per second: no blinking colon, no twinkle, no scan line.
- Every `[SECOND]` reference sits inside the Active-only `live` and `cage_frame` groups.

### 6.4 Active → AOD and interruption

- **Watch:** one Variant serves both directions.
  - **ASSUMPTION** (T1): the device plays the table in reverse, so the rotor and trail fade first and the sky last; the shadows retract under their casters.
  - With `angleDirection="NONE"`, F2 returns 0 → −14° counter-clockwise, the short way (T2).
  - If the reversed stagger looks wrong on the SM-R965N, set every startOffset to 0 and keep the order through `duration` alone.
- **Studio:** plays the mirrored table at W_sleep = W by default and labels it "watch timing". A toggle shows the old v4 180 ms exit for comparison only.
- **Interruption (studio):** read the current computed values, cancel, and run the other direction from those values over the elapsed time.
- **Interruption (watch):** owned by the renderer.

### 6.5 Reduced motion

- **Watch:** a Scene-level `ListConfiguration id="motion"` with three `ListOption` subtrees. Bitmaps are shared resources, so memory does not change. `watch_face_info.xml` must set `<Editable value="true"/>`.

  | Option | Contents |
  |---|---|
  | `full` | the tree in this spec, including Gyro |
  | `calm` | the same tree without Gyro; **the default until T15 passes** |
  | `still` | alpha Variants only, all `duration="0"` and `startOffset="0"`; no angle or shadow-lift Variants; no Gyro |

- **Studio:** `prefers-reduced-motion` OR the manual toggle makes every transition instant. A manual "off" cannot override the OS preference.
- **In all options**, the sidereal and solar rotations and the per-second carriage and trail keep running, because they are time, not animation.

### 6.6 Tilt parallax (Gyro; `full` option only)

`<Gyro>` is legal once per Group, per the v4 XSD. Inputs are `a_x = [ACCELEROMETER_ANGLE_X]` and `a_y = [ACCELEROMETER_ANGLE_Y]`. Each wrapper is a Group 470² at (−10,−10), so a shift never clips the dial edge.

| Wrapper | Contains | x / y |
|---|---|---|
| `par_sky` | sky (with names and planets), globe, dome light | `clamp(0.07*a, -3, 3)` |
| `par_rings` | crescent, rings, calendar, gloss, sun, trail, rotor, F2 | `clamp(0.035*a, -1.5, 1.5)` |
| `par_dragon` | dragon shadow and relief | `clamp(-0.02*a, -1, 1)` |
| camera-locked | sub-disc, plate, date, digits, **every AOD node** | none |

- Multipliers and signs are placeholders, to be tuned on the device.
- F2 is baked to r 228, so a 1.5 px shift never exposes black.
- `full` becomes the default only if T15 shows ≤ +3 % 24-hour drain against `calm` and no visible stutter.
- T15 is the first test on the probe face at the start of the port (section 9.5).

---

## 7. AOD

### 7.1 Contents (same positions as Active; everything on black)

| Element | Spec |
|---|---|
| Digits | Outline BitmapFont `kw_outline` (1.4 px `#91AD80` on `#0C160B`). Glyph baseline matched to the Active TimeText (T4). |
| Colon | PartText fill `#0C160B`, Outline 1 px `#5E7A55` (Y 17 %, dimmer than the digits) |
| Date | all 18 characters, `25 OCT / SUN / SCO`, `#7F9472`, in the Active boxes, so there is no jump |
| Sky | 72 stars (mag ≤ 2.5, Ø1.6, `#5A6870`) and Draco's 14 stars as dots (Ø1.6 `#4D633F`), in `sky_aod_mount` |
| Globe | black Ø92 footprint; lit-limb Arc r 45 from 225° to 363.6° (the visible part), 1.2 px `#6B7A80`; hidden at S9 = 0 |
| Flange cue | `00`, `06`, `18` at r 215, 13 px `#4D633F`; INFINITY at its Active position, `#7F9472` |
| Calendar cue | 11 ticks, r 195 to 202, 1.25 px `#4D633F`, every 30° except 180° |
| Eccentric cue | horizon flanks: Arcs about H, r 209.9, −50.7° to −25° and +25° to +50.7°, 1 px `#2C3A33` |
| Sun | dot Ø5 `#8A6A2C` at r 191 |
| Rotor | ring Ø24, 1.2 px `#5E7A55`, at r 182 |
| Sub-disc | black r 60 footprint; lit-wall Arc r 59.25 about Q, 45° to 171°, 1 px `#2C3A33`; `78%` 22 px `#7F9472` in the Active box |
| Dragon | `dragon_mask` tinted `#4E6644` (Y 11.5 %) |
| Black footprints | plate mask, sub-disc, globe, occluder r 182 to 240, ground below the horizon |

**Hidden in AOD:**
- F2 and F1 surfaces, names, the night sector, the glass;
- glow, trail, carriage, steps, labels, gauges;
- planets, graticule, Milky Way;
- the prompt text other than INFINITY;
- the lip hairline and full rings (dropped as burn-in ghosts).

Nothing is lit beyond **r 220**. No minute indicator other than the digits exists, so a frozen element can never show a wrong minute.

### 7.2 Lit share (v4 rule: non-zero RGB, 3x supersampled, box-downsampled to 450, over the 159,068 px disc)

Base: the wff v2 measured raster at its worst sample (08:08), 13,775 px (8.66 %). It counts the digit fill and AA, the dragon, 70 stars, the 12-character date, INFINITY, 12 ticks, the r 181.5 lip hairline, the r 40 BAT rim and value, the sun dot, the probe and the moon ring.

| Change for v5 v2 | Arithmetic | px |
|---|---|---|
| + rotor ring | 75.4 x 1.2 x 2 (AA) | +181 |
| − probe dot | Ø4 | −13 |
| − sky-moon ring | 31 x 1 x 2 | −63 |
| + globe limb | 108.9 x 1.2 x 2 | +261 |
| + Draco dots and the extra stars (86 dots against 70) | 16 x 4 | +64 |
| − lip hairline | 1,140 x 1 x 2 | −2,281 |
| − BAT rim r 40 | 251 x 1 x 2 | −503 |
| ticks 12 x 8 px → 11 x 7 px | (77 − 96) x 1.25 x 2 | −48 |
| BAT value 17 → 22 px | x (22/17)² | +115 |
| date 12 chars at 15 px → 18 chars at 17 px | x 1.5 x 1.28 | +278 |
| + `00` `06` `18` | 3 x 100 | +300 |
| + horizon flanks | 188 x 1 x 2 | +377 |
| + sub-disc lit-wall arc | 130 x 1 x 2 | +261 |
| **Total** | **12,700 px** | **≈ 8.0 %** |

- The target is ≤ 9.5 % and the limit is 15 %; v4 was 11.3 %.
- This is an estimate. Gate G3 re-measures it on the raster and fails the build above 9.5 %.
- **Cut order** if the raster disagrees: horizon flanks → globe limb → `06`/`18`. The digit outline is never thinned.

### 7.3 Burn-in

- **Brightest AOD pixels:** the digit outlines `#91AD80` (Y 37.5 %).
  - The HH tens digit stays the same for up to 10 h (0 from 00:00 to 09:59, 1 from 10:00 to 19:59).
  - The HH units digit is static for 1 h; the minutes change every minute.
- **The colon** is static all day, so it is dimmed to `#5E7A55` (Y 17 %).
- **Static all day:** the date and INFINITY `#7F9472` (Y 26.9 %), the dragon `#4E6644` (Y 11.5 %, 1,586 px), the F2 numerals and ticks `#4D633F` (Y 10.9 %), and the hairlines `#2C3A33` (Y 3.8 %).
- No full ring is lit, because rings are the classic round-OLED ghost.
- **Moving elements** (sky dots, rotor ring, sun dot) are **not** cited as a mitigation. Under V1 offload the AOD may be a static layer that holds its pose until wake, and the memory tool treats it so. T19 decides.
- **Frame shift:** Samsung's AOD pixel shift for third-party faces is unverified; forum reports say Galaxy Watch4 and later omit it. T19 photographs it.
- **Fallback if T19 shows no system shift:** a ±1 px walk on the **non-digit** AOD layers only (`sky_aod_mount`, `aod_marks`, `dragon_aod`, `date_aod`, `sign_aod`, `subdisc_aod`):
  - `x = round(sin(rad([MINUTE]*6)))`;
  - `y = round(cos(rad([HOUR_0_23]*15 + [MINUTE]*0.25)))`.

  HH:MM never moves, so the hard rule holds. If AOD layers freeze, the walk still changes at every AOD entry.

---

## 8. Studio implementation plan (this week)

### 8.1 Modules (in `KALIWATCH/studio/`; IIFE modules that set both `root.X` and `module.exports`; `studio/package.json` stays `"type": "commonjs"`)

| File | Status | Responsibility |
|---|---|---|
| `tokens.js` | rewrite to v5.1.0 | Section 5 tokens (the lint list), geometry constants (P, H, Q, G, radii), motion fractions, moments M1 to M8 |
| `astro.js` | keep | Oracle: Meeus sun, moon, LST, alt/az |
| `planets.js` | new | Oracle: JPL approximate Keplerian elements → geocentric RA/dec |
| `stars.js` | keep | 366 stars, 33 figures, galactic pole constants |
| `stars-faint.js` | new, generated | BSC5 stars with 4.5 < V ≤ 5.0 and δ ≥ −43° (about 590), from the VizieR V/50 text table; J2000 |
| `wff-expr.js` | new | **Single source of the expressions.** E1 to E17 as WFF strings; the Reference model; a **macro expander** that inlines references for the fallback; an evaluator (`+ - * / %`, `?:`, comparisons, `sin cos tan asin atan rad deg floor fract clamp round abs min numberFormat`, `[SOURCE]` and `[REFERENCE.x]` tokens). The studio renders from the *evaluated WFF strings*. |
| `sky.js` | extend | `bakeSky({projection:'stereographic', k:128, decLimit:-42.8, epoch:2026.5, milky:{envelope:14, weights, rift, seed}, graticule, draco:'dotted', faint:true})` → SVG at LST 0. The Milky Way is a per-pixel galactic raster (4.3), not a stroke. Also `aodStars()`. |
| `bake-sources.js` | new | Pure SVG and canvas generators for every baked asset, one function each, with the one-light and shadow rules. Includes the height-map dragon shadow and a `sweepRing()` emulation. |
| `vault5.js` | new; default preset | **The layer table** in section 2.2 as data: id, z, WFF node path, mode, build, asset, Transforms (by expression name), Variants (fractions), wrapper. It emits SVG for source and composite modes. |
| `wffbox.js` | new | `wffBox(size, baseline, h)` from the hhea model; shared with `gen-wff.cjs` |
| `face.js` | extend | Timeline engine: `valuesAt(id, toMode, t, W)`; the "digits never move" check |
| `studio.js`, `index.html`, `studio.css` | extend | Controls: Active/AOD, time scrubber and moments, live clock, W slider (300 to 800 ms), motion option, Gyro simulator, OLED-floor toggle (Y < 0.4 % → black), 40 % brightness view, 1:1 480 px view, 150 px thumbnail, per-layer solo/hide, gates panel |
| `fonts/roboto_mono_{regular,medium,semibold}.ttf` | new | `python -I -m fontTools.varLib.instancer RobotoMono.ttf wght=400` (and 500, 600). Install `fonttools` if it is missing. |
| `tools/bake.cjs` | new | Renders each bake source in headless Chrome at 2 x 480/450 with a transparent background, then box-downsamples 2x through `tools/reduce.py` (PIL `Image.reduce(2)`, run with `python -I`). Writes `assets/*.png` + `assets/manifest.json` (name, design and device size, bytes, SHA-256). |
| `tools/gates.cjs` + `tools/gates.py` | new | Render the moments and the 24-hour LST sweep in composite mode, then measure G1 to G9. Exit non-zero on failure. |
| `tools/test-expr.cjs` | new | Evaluate `wff-expr.js`, with and without references, against `astro.js` and `planets.js`, half-hourly over 2026 to 2030 |
| `tools/verify.cjs` | extend | Layer-table lint (below), `test-expr.cjs`, `gates.cjs` |
| `tools/render-refs.cjs` | extend | Round-4 sheet: M1 to M8 Active; AOD M1, M6, M7; wake strip 0 to 360 ms; 150 px thumbnails; 1:1 480 crops at 100 % and 40 % brightness |
| `tools/gen-wff.cjs` | later (port) | Generates `watchface.xml` from `vault5.js`, the `wff-expr.js` strings and `assets/manifest.json` |

**Layer-table lint (in `verify.cjs`):**
- Part and Group x/y/w/h are integers.
- Every startOffset + duration ≤ 1.
- Variants only on Group or Part nodes; spatial Variants only on Active-only nodes.
- No AOD node inside a `par_*` wrapper.
- Every time-driven angle Transform sits on a Group, never on a Part.
- Every Active node has an alpha-0 AMBIENT Variant, or is a both-mode node.
- No gold hex outside `sun*` and the AOD warning; no hex outside the token list.
- Every text box corner is within its safe radius; every text box has ≥ 3 px of horizontal slack.

**Week plan with a cut line:**

| Day | Work |
|---|---|
| Mon | **Look first.** `wffbox.js`, font instances, then a source-mode mock of the new composition at M1 to M3: rings, crescent and bead, sub-disc, arched glass, globe sprites, dragon bevel and shadow, the existing sky with the galactic Milky Way, names. Run G7, G8, G9 and the G1 sweep on it. |
| Tue | `wff-expr.js` (Reference model, macro expander, W(), numberFormat) + `test-expr.cjs`; `planets.js`; `stars-faint.js`; precession |
| Wed | `bake.cjs` + `reduce.py`; bakes of `sky_active`, `crescent`, `flange_f2`, `dome_light` |
| Thu | `vault5.js` vectors; bakes of `plate`, `plate_shadow`, `subdisc`, `dragon_relief`, `dragon_shadow`, `luna_0..8`, rotor, planets, `kwo_0..9`; composite mode |
| Fri | Timeline (fractions, W slider, shadow lifts), AOD and G3, gates panel, round-4 sheet |

- **Cut line**, the round-4 minimum: composite M1 to M3 Active; AOD M1 and M6; the wake strip; gates G1, G2, G3, G7, G8, G9.
- **Below the line**, deferred to week 2 if needed: WFF planet expressions (the studio shows the planets from the oracle), the Gyro simulator, the `calm`/`still` options, the G6 lint, `gen-wff.cjs`.

### 8.2 Render pipeline

1. **Source mode** (for designing): every layer is live SVG or canvas.
   - SweepGradients are emulated by `sweepRing()`: 360 one-degree arc segments with interpolated stops.
   - Canvas bakes use `createConicGradient`.
2. **Composite mode** (default for references, gates and the preview):
   - Baked PNGs are drawn as `<image>` with the same x/y/w/h as the WFF Part, inside `<g transform="rotate(E3 225 114)">` and similar.
   - Vector layers are drawn as the WFF primitives they will become.
   - Text is placed by `wffBox()`.
   - Everything is composited in sRGB.

**Pre-baked vs live:**

| Pre-baked PNG | Live vector or text, in the studio and on the watch |
|---|---|
| `sky_active`, `dome_light`, `crescent`, `flange_f2`, `plate`, `plate_shadow`, `subdisc`, `dragon_relief`, `dragon_shadow`, `dragon_mask`, `luna_0..8`, `cage_body`, `cage_shadow`, `jupiter`, `saturn`, `sun_star`, `infinity_aod`, `kwo_0..9` (fallback: `f1_calendar`) | rings, calendar ticks and names, gloss, night sector, trail, carriage, gauges, all text including the 24 names, `sky_aod`, `luna_aod`, AOD marks, AOD footprints, `sun_aod`, `cage_aod` |

### 8.3 Named moments

| Id | Time (KST) | What it shows |
|---|---|---|
| M1 | 2027-04-16 20:08:24 | **Canonical:** the rotor inside the sub-disc rim (221.6°), waxing gibbous globe (S9 5), sun just set at 66°, the winter Milky Way arcing down the right half (22.2 % of open sky), 8 names |
| M2 | 2026-10-25 10:08:24 | Day; the classic 10:08. Rotor at 6 o'clock (182.6°), sun at 212° over the sub-disc side. |
| M3 | 2026-11-20 02:00 | Jupiter (131,153) and Saturn (341,149) both in open sky |
| M4 | 2026-09-23 12:00 | Equinox eclipse: the sun under the rotor |
| M5 | 2026-06-21 12:00 | Longest day: the night sector is narrowest (H0 109.5) |
| M6 | 2026-10-25 08:08 | Worst AOD outline (`08:08`); rotor in the sub-disc |
| M7 | 2026-11-09 20:08 | New moon: earthshine globe; AOD limb hidden |
| M8 | 2026-11-17 20:08 | First quarter: terminator through the centre |

**Handedness test:** at M1, Auriga must sit west (right) of the meridian. `test-expr.cjs` asserts that the sign of x − 225 equals the sign of −sin(azimuth), against `astro.js` alt/az.

### 8.4 Gates (`gates.py`; the build fails on any miss; measured values are for the mask in section 3)

| Gate | Measurement | Pass |
|---|---|---|
| G1 sky brightness | Active, **24 LST samples** (hourly) plus M1 to M3. Open sky = r < 180, inside the horizon, outside the plate, sub-disc, globe and dragon bed. | Pixels at L\* ≥ 45: min ≥ 8 % and median ≥ 15 % of open sky. Pixels at L\* ≥ 70: median ≥ 4 %. Open-sky median L\* ≤ 14. On a fail, remedy in this order, never widening the envelope past 14°: (1) raise w(l) of the failing segment by 0.15, to at most 1.0; (2) dust tone `#6E7B81` → `#7C888E`; (3) figure lines 1.6 → 1.8 px. |
| G2 digit calm | digit box under the plate, M1 to M8 | median L\* ≤ 8; 99th percentile ≤ 30; digit-edge contrast ≥ 4.5 : 1 at the 1st percentile at 40 % brightness; date ≥ 3 : 1 at 40 % (measured worst 4.0) |
| G3 AOD lit share | AOD M1, M2, M6 and M7 at device scale 3, box-downsampled to 450 | non-zero RGB ≤ 9.5 %; zero lit pixels beyond r 220; report max > 24 and mean linear Y |
| G4 strings | worst-case strings | Information corners ≤ r 171 (measured 167.9). Sub-disc values ≥ 1.5 px inside r 38.5 about Q (measured 2.1). Every box ≥ 3 px of slack. |
| G5 thumbnail | Active at 150 px: M1, plus M7 and M8 for the globe | F2 **base** median Y ≥ 8 x F1 **base** median Y, where F1 is sampled at r 189 to 194 with inscriptions and the 290° to 340° gloss sector excluded (expected ≈ 30x). Milky Way pixels at L\* ≥ 60 present. Globe: lit area mean Y ≥ 40 % when S9 ≥ 2, and the unlit side ΔL\* ≥ 8 against the sky when S9 ≤ 1. Rotor ≥ 12 px at Y ≥ 40 %. Horizon bead ≥ 1 px at Y ≥ 30 % along ≥ 60 % of its visible length. Sub-disc lip ΔL\* ≥ 12 against the floor. |
| G6 one light | lint over `bake-sources.js` | Every shadow offset lies along 135° ± 5°, with length 1.25·Δh ± 15 % (rotor ± 30 %). Every highlight sits at 315° (raised) or 135° (inner wall). |
| G7 depth | 1:1 480 px at **40 % brightness**, M1 to M3 | **Edges** ΔL\* ≥ 12 across the edge on ≥ 60 % of their length: lip, step, chamfer, bead, plate bevel, sub-disc lip, dragon bevel. **Shadows** ΔL\* ≥ 8 over ≥ 50 % of their visible area: dragon → crescent (measured 16.3 at `#4A555B`, 9.3 at `#2E363A`), sub-disc wall → floor (9.3), rotor → lip, plate → sky (on cloud pixels only). |
| G8 composition | M1 to M3 | Open sky ≥ 35.5 % of the dial (measured 36.2). Mirror difference ≥ 15 % (20.1). Milky Way at L\* ≥ 45 ≥ 6 % of the dial at M1 (measured 8.0). Clouds under the glass at L\* ≥ 12 (measured 14.3). |
| G9 names and figures | 360 LST samples | ≥ 3 names readable at every sample, ≥ 4 for ≥ 98 % of samples, mean ≥ 6.5 (measured 3 / 99.2 % / 7.0). At least 7 figures with ≥ 60 % of their stars in open sky at every hour (measured 8). |

---

## 9. WFF v4 port plan

### 9.1 Assets (RGBA8888; device = design x 1.0667; bytes = w x h x 4)

| Asset | Design | Device | Memory |
|---|---|---|---|
| `sky_active.png` | 586² | 625² | 1.56 MB |
| `dome_light.png` | 364² | 388² | 0.60 MB |
| `flange_f2.png` | 456² | 487² | 0.95 MB |
| `crescent.png` | 330 x 108 | 352 x 115 | 0.16 MB |
| `plate.png`, `plate_shadow.png` | 226 x 106, 228 x 108 | | 0.22 MB |
| `subdisc.png` | 124² | 132² | 0.07 MB |
| `dragon_relief.png`, `dragon_shadow.png`, `dragon_mask.png` | 190 x 140, 200 x 150, 168 x 124 | | 0.35 MB |
| `luna_0..8.png` | 9 x 104² | 111² | 0.44 MB |
| `cage_body.png`, `cage_shadow.png`, `jupiter.png`, `saturn.png`, `sun_star.png`, `infinity_aod.png` | small | | 0.02 MB |
| `kwo_0..9.png` (AOD outline glyphs, SemiBold 78, final colours, baseline at 73.3 px from the glyph top) | 10 x 46.9 x 86.25 | 50 x 92 | 0.18 MB |
| three static Roboto Mono instances | | | ≈ 0.27 MB |
| **Interactive total** | | | **≈ 4.8 MB** of 100 MB (5.7 MB with the `f1_calendar.png` fallback) |
| **Ambient** (V1 offload: 1 static layer 480² x 4 + glyphs + fonts) | | | **≈ 1.4 MB** of 10 MB |

- Active-only nodes carry AMBIENT alpha 0, so the evaluator skips them (`isNodeSkipped`).
- The three motion subtrees share resources.
- All AOD content precedes the AOD clock, so the AOD is one static layer plus one clock.

### 9.2 Document skeleton

```
WatchFace 450x450 CIRCLE
  Metadata CLOCK_TYPE=DIGITAL, PREVIEW_TIME=20:08:24
  UserConfigurations > ListConfiguration id=motion (full | calm | still), default calm
  BitmapFonts > BitmapFont kw_outline (Character 0..9 -> kwo_0..9, width 47, height 86)
  Scene #ff000000 > ListConfiguration id=motion > ListOption {full|calm|still} > Group face
    ref_lst . ref_lsun . ref_asun . ref_dsun . ref_lj . ref_ls          <- carriers first
    [par_sky]  sky{sky_active, names x24, jupiter, saturn} . luna{Condition s0..s8} . dome_light
    occluder_aod . ground_aod . sky_aod_mount{sky_aod} . luna_aod . aod_marks{ticks, horizon, f2_aod, infinity_aod}
      . aod_live{sun_aod_mount, cage_aod_mount} . subdisc_aod
    subdisc{subdisc_png, tracks, arcs, stp_label, Condition(stp_value), bat_value}
    [par_rings] crescent . rings . calendar{Lines, TextCircular x12} . f1_gloss . sun{sun_active}
      . live{trail} . cage_orbit{cage_frame{cage_shadow, cage_body, carriage}} . f2{flange_f2, night_sector}
    plate_mask_aod . plate_shadow . plate . date . Condition(sign x12) . date_aod . Condition(sign_aod x12)
    [par_dragon] dragon_shadow . dragon_relief      dragon_aod
    clock_active . colon . colon_aod . clock_aod   <- last
```

- `[par_*]` wrappers (470² at (−10,−10)) carry `<Gyro>` in `full` only; in `calm` and `still` they are plain Groups.
- Date PartTexts carry `<Localization calendar="GREGORIAN" locales="en_US"/>` and `<Upper>`, so the date stays English on a Korean system.
- `BitmapFont` `size="86"`, which is the glyph height, so the glyphs are drawn 1:1 (T4).

### 9.3 Variants

Section 6.1 gives every Variant. Rules:
- AMBIENT value = the AOD state.
- Spatial Variants appear only on `f2` (angle, `angleDirection` NONE), `plate_shadow` and `dragon_shadow` (x, y).
- One Variant per attribute per node.
- Variants never go on shapes (Arc, Ellipse and RoundRectangle take none in v4). Every vector twin is its own PartDraw.

### 9.4 Schema and tool facts relied on (v4 XSDs and the memory tool in `scratchpad\wfref`)

- `TimeText` takes one `Font` (attributes only) **or** one `BitmapFont`, so digits get no Shadow or Outline decorations. `PartText` Font accepts `Outline`.
- Group and Part x/y are `xs:integer`; shape coordinates are floats.
- `Gyro` is allowed 0 or 1 times per Group or Part. `ListConfiguration` is allowed in Scene and Group. `Compare` references a named `Expression`.
- `Reference` (WFF 4) may sit under any Group, Part or Arc. It publishes a transformable attribute as `[REFERENCE.name]`. Circular references update only once, so the carriers form a chain only.
- Variant `angleDirection` defaults to `NONE` and "does not change the final value".
- `HOURS_SINCE_EPOCH`, `MINUTES_SINCE_EPOCH`, `MOON_PHASE_POSITION`, `STEP_GOAL` and `ACCELEROMETER_ANGLE_X/Y` are in `sourceType`.
- Group has no `blendMode` in v4; none is used.
- `AmbientMemoryFootprintCalculator`:
  - it treats everything except AnalogClock, DigitalClock and ComplicationSlot as static;
  - its old-style-clock detector flags only **Part\*** nodes whose `angle` Transform contains `MINUTE`, so every time rotation and carrier is a Group;
  - V1 caps the AOD at 2 layers and 2 clocks;
  - complications are not offloaded under V1.

### 9.5 Device tests (run in this order; T1, T2, T9 and T15 first, on a small probe face before the full XML)

| # | Test | Pass | Fallback |
|---|---|---|---|
| T1 | Measure the transition window W and check the reverse order on sleep (240 fps film) | W known, order acceptable | Rescale fractions; offsets 0 on sleep |
| T2 | `f2` angle −14 → 0 with `angleDirection` NONE: film both directions | short path both ways | Drop the angle Variant and keep alpha |
| T3 | `controls="0.22 1 0.36 1"` validates and renders | accepted | `EASE_OUT` |
| T4 | BitmapFont AOD clock at `size` 86: glyph box 47 x 86 at 1:1; AOD → Active overlay of both glyph sets; minute updates overnight | ≤ 0.5 px misregistration | Re-bake `kwo_*` offsets; then PartText + `Outline` clock |
| T5 | Baselines of TimeText and PartText follow `wffBox()` | ±1 px | Per-type offsets in `wffBox()` |
| T6 | Static font instances: weights render as baked (overlay against the studio) | match | Bake digits only if synthesised |
| T7 | Sky angle against the studio at 3 times (≤ 1°); the sky moves on odd minutes; no glitch at :59 → :00 (10 boundaries filmed) | all pass | `[MINUTES_SINCE_EPOCH]` form of E1 (2-minute steps) |
| T8 | Functions: `atan` quadrant ternary, `asin`, floor-based W(), `fract`, `min`, `numberFormat` output (`12.3k`, `6,240`), `STEP_GOAL` 0 | match the studio | Precompute with an extra wrap; plain `%s` |
| T9 | Reference carriers publish chained values in Active and AOD, updated each minute | match the studio | Macro-expanded inline expressions |
| T10 | Inline fallback: the largest expression (about 7 KB) validates, loads and evaluates within a minute tick | ok | Drop the planets |
| T11 | Off-canvas sky Group (586² at (−68,−179)) at 0/90/180/270 | no clipping | 450 Group with pivotY 0.2533 and an overflowing child |
| T12 | SweepGradient zero angle and direction | lip lit at NW | Rotate the stop list |
| T13 | TextCircular inside the rotating `calendar` Group | correct and crisp | `f1_calendar.png` 480², +0.92 MB |
| T14 | Counter-rotated names, planets and rotor: crisp text, shadow stays at (+3,+3) at 4 sidereal angles | world-fixed, crisp | Bake the names into the sky; rotor shadow as a separate Arc |
| T15 | Gyro units, sign, feel and 24 h drain (`full` against `calm`) | ≤ 3 px, ≤ +3 % drain | Ship `calm` as default |
| T16 | ListConfiguration subtree switch | no flash, memory unchanged | BooleanConfiguration pair |
| T17 | Battery cost of `[SECOND]` in alpha-0 groups, overnight | within 5 % of the current face | Move trail and carriage into a Condition |
| T18 | Wrist check at 40 % brightness: F2, lip, bead, plate bevel, Milky Way, rotor, sub-disc | stack reads | +15 % Y on F2 and the bead |
| T19 | **AOD soak:** macro photos at t0, +1, +15 and +60 min. Checks: frame shift; `sky_aod`, sun and rotor rotation (about 15°/h); BAT and date updates. | documented | ±1 px walk on non-digit AOD layers (7.3); remove movement claims |
| T20 | `memory-footprint --schema-version 4 --ambient-limit-mb 10 --apply-v1-offload-limitations` | ≤ 2 layers, ≤ 2 clocks, ≤ 10 MB | Reorder AOD nodes |
| T21 | `[MOON_PHASE_POSITION]` against the studio's lunar age over a month (spot checks) | ±1 day | E12 from λ☾ (05 form) |
| T22 | Korean locale date | `25 OCT / SUN / SCO` | 19-branch Condition |
| T23 | Bezel and visible radius for F2 at r 205 to 225 | numerals fully visible | Scale `f2` 0.975 about C; never thin the numerals |
| T24 | v5.1 only: headset ComplicationSlot in the sub-disc label line (10.1) | Active-only, AOD layers unchanged | Keep it on the production faces |

---

## 10. Decisions, rejected ideas, open risks

### 10.1 Decisions

| Question | Decision | Why |
|---|---|---|
| Two registers or one sub-disc | **One sunken sub-disc at Q (149,333), r 60, cut by the lip**, carrying STP and BAT | It is the photo's sub-dial, and it overlaps the ring stack. Mirror difference 7.4 % → 20.1 %. |
| Globe position | **3 o'clock at G (390,206)** | It completes the dragon–globe–sub-disc triangle. Its shadow side is the one the lip hides. |
| What the rotor marks | **RA 12h** | It reaches the sub-disc when the bright band is in open sky (22 % against 5 to 10 % for RA 0h). |
| Globe lighting | **Fixed key light at 315°, no rotation** | One light; a terminator is always visible, and there is earthshine at new moon. The cost is that waxing and waning are not shown. |
| Large sphere | One globe plus small real planets (05 decision kept) | A big real Jupiter is visible too rarely: 22.7 % of the year in open sky. |
| Dragon | **On top, uncut; the wing breaks F2 by 7.5 px** | The new radii make the tangency a deliberate overlap |
| Inscription | 6 o'clock, baked into F2 | It reads upright and keeps the v4 footer place |
| Gyro | Shipped as an option; `calm` is the default until T15 | Tested first on the probe face |
| PPI graticule | Kept at 8 to 10 %; first to cut | Radar DNA |
| Rotor | Ø24 bright filled bridge with carriage | It must clear the names (r ≥ 194.8) and the sub-disc text (r ≤ 167.9) |
| Months | Rules on the 1st, names centred on the 16th, tops toward C | The name spans its month and reads upright by day |
| Sun track | Inner (r 191) over the ticks; names outer | The sun points at the day tick |
| Day length | **Night sector on F2** (replaces the day arc) | An area, not a fourth concentric hairline |
| Names | **24 upright 3-letter names**, counter-rotated in the sky Group | Crisp, upright, about 7 visible |
| Expressions | **References** + `[MOON_PHASE_POSITION]`; macro-expanded inline as the fallback | Inline planets were about 7 KB per coordinate |
| Headset battery complication (production faces) | **Not in v5.0.** v5.1 may put the Console SHORT_TEXT slot in the sub-disc label line (box x 125 to 173, y 300 to 316, 13 px), Active only, replacing `STP` when the text is not `--` (T24). | No fourth information carrier fits without a second register, and a complication would add an AOD layer under V1 |
| AOD plate brackets | Rejected (05) | A HUD trope |

### 10.2 Rejected (do not reintroduce)

- **The day-key veil**: it tints the sky blue and halves the Milky Way in daylight.
- **Gold anywhere but the sun**; the battery-warning amber is a state colour.
- **An F2 minute pointer and minute ticks**, which duplicate HH:MM.
- **Any movement of HH:MM**: AOD walks or drift circles on the digits. A ±1 px walk on non-digit AOD layers is allowed only as the T19 fallback.
- **TimeText Font Shadow/Outline**, which is invalid in v4.
- **Pole at the dial centre**.
- **Near-black sky plans**.
- **Extra hues**: teal, blue starlight, red giants, silver indices.
- **Two mirrored registers**; the **85 % glass**; a **linear-light glass rationale**.
- **The sky settle Variant**: it doubled the stars and slid the planets, and its forced direction could whirl.
- **Scale pops** on wake; they are replaced by shadow lifts.
- **An eccentric lip** (flat #6 alternative); a **graded or 60 to 65 % glass**; a **Ø32 rotor**; **24 px sub-disc values**; **per-year linear planet segments**. Each is argued in "Refutation responses".
- **A UMI label** (it collides with DRA).
- **A second moon** on the chart.
- **Day numerals "10"/"20" on F1** (about 7 px text); long ticks are used instead.
- **Studio-only timings presented as watch behaviour.**

### 10.3 Open risks

1. **Panel exposure.** The bright sky, the grey F2, the crescent and the sub-disc floor raise Active mean luminance to about 9 to 10 %. Mitigation: T17/T18, the OLED-floor preview, the G5/G7 brightness views.
2. **A busy sky.** About 956 stars, 33 bright figures, 24 names, the Milky Way and the graticule. Cut order: graticule → dust → names to 16 (keep ≥ 3 at every LST).
3. **Rotation resampling** of 1.4 px stars and dots in the 625² bitmap each minute. Mitigation: 2x bakes and minimum cores; check on the device.
4. **References unproven** (T9), and the inline size fallback (T10).
5. **AOD freeze under offload** (T19): the AOD sky, sun and rotor may hold their pose; nothing depends on them.
6. **E1 hour-boundary glitch** (T7). In non-whole-hour time zones the local `[MINUTE]` shifts the sky by the offset fraction (7.5° in UTC+5:30).
7. **Honesty of the globe:** illuminated fraction only, not a sky position. The studio and docs say so.
8. **The rotor covers the sun on 21 to 25 Sep** and passes under the dragon for about 40° of its orbit (not re-measured at r 182). Both are intended occlusions.
9. **Seoul is hard-coded** (latitude in P, H and H0; longitude in E2).
10. **Month names read upside down** for part of their daily turn, as on a planisphere.
11. **Vendor-owned transition length** (T1), and an unverified reverse order on sleep.

---

## Refutation responses

**Verdict key:**
- **Accepted** means fixed as proposed, or with the stated parameter change.
- **Partly** means the intent was fixed and part of the proposal was rejected, with the reason.
- **Rejected** means the issue is not valid, or the proposed fix would break a measured constraint.

### Flat (owner): "it will still look flat and generic"

| # | Issue | Verdict | Response |
|---|---|---|---|
| 1 | Mirror-symmetric dashboard | **Accepted** (parameters changed) | One eccentric sub-disc and the globe mirrored to 3 o'clock (3.1, 3.3). The centre moved from (150,338) r 56 to (149,333) r 60, so the BAT gauge stays inside the aperture (outer edge 177.06) and two 22 px lines fit inside r 37 about Q. Measured: open sky 36.2 %, mirror difference 20.1 %. G8 added. |
| 2 | Black-on-black shading | **Accepted** | Mid-tone receivers: sub-disc floor `#2A3338`, crescent opaline `#4A555B` → `#2E363A` with guilloche about H, F1 gloss streak. Measured at 40 %: dragon shadow ΔL\* 16.3 / 9.3; sub-disc wall shadow 9.3. |
| 3 | Gates cannot see flatness | **Accepted** | G7 depth and G8 composition are in `gates.py`. The shadow-length check lives in the G6 lint, where it can be computed exactly. |
| 4 | Black card; linear-light maths | **Partly** | Accepted: 75 % in sRGB, an arched top, the table restated in sRGB. Rejected: a graded 60 % top edge, because the date over a core would fall to about 2.8 : 1. The arch radius is 1212.5, not 788, because the 17 px date's corners sit at y 173.5 and would touch an R 788 arch. |
| 5 | Too little open sky; Milky Way ~7 % of the dial | **Partly** | Accepted: the M3 caption is fixed (new M3 has both planets open), the band is defined in galactic latitude, and there is a non-galactic brightness floor. Rejected: "bright clouds ≥ 6 % of the dial at every named moment". The band's share is physics: with any mask, |b| < 8° is only 3.2 to 3.7 % of the dial at M2/M3 *(measured)*. The gate instead holds a sweep minimum (G1) and ≥ 6 % at M1 (measured 8.0 %). |
| 6 | Eccentric ring is a dim hairline; "41.8 % inside the dragon" | **Partly** | Accepted: a 5 px polished bead plus a grey eccentric guilloche crescent (5.1), checked in G5 and G7. Rejected: the 41.8 % figure as an argument. It is the dragon's bounding box; only 4.7 % of the arc lies under actual ink (watch, measured). Rejected: the eccentric lip. It would pinch the trench to about 0 px at 7:30, exactly where the rotor crosses the sub-disc, and it would turn the occluder, trail and rotor lane eccentric for no new information. The horizon is the eccentric edge that carries data. |
| 7 | Rotor is a dark 24 px dot | **Partly** | Accepted: a filled phosphor-metal bridge, dark slots, a jewel and a (+3,+3) shadow; about 290 px² at Y ≥ 40 %, checked in G5. Rejected: Ø32. Its lane would run r 166 to 198 and overlap both the sub-disc text (r ≤ 167.9) and the month-name track (r ≥ 194.8). The rotor is fixed in the RA frame, so it would cover one name permanently. |
| 8 | Globe dark, flat or off-key | **Accepted** | Mirrored, fixed 315° light, earthshine, limb darkening, no E8 spin; G5 runs at M7 and M8 too. The new cost (waxing and waning not shown) is stated in 4.7. |
| 9 | F2 narrow, guilloche invisible | **Accepted** | 20 px face (r 205 to 225), 13 px numerals, 1° pitch at ±20 % with every 5th line +35 %. Radii re-budgeted (2.1); rotor lane and G4 re-checked. |
| 10 | Shadow lengths contradict heights | **Accepted** | One rule, 1.25 px per unit along 135°. The dragon shadow is baked against a height map (2.1). |
| 11 | Dragon has no relief; Draco merges | **Accepted** | 4x per-stroke bevel, 1.5 px bed, a separate shadow. Draco is dotted `#D2FFA4` @35%, with ΔL\* 20 against the dragon's darkest body. |
| 12 | AOD is v4 again | **Accepted** | `00`/`06`/`18`, the horizon flanks and the sub-disc lit-wall arc are added. The lit share is ≈ 8.0 %, because the lip ring was removed (watch M4). |
| 13 | Gyro off by default; scale pops | **Partly** | Accepted: shadow lifts replace every scale Variant. Rejected: running T15 in week 1. The user asked for references to be iterated before anything goes on the watch. T15 is the first probe-face test of the port, and `calm` stays the default until then. |
| 14 | Names too few, upside down, soft | **Accepted** | 24 upright PartText names, counter-rotated inside the sky Group, which is cheaper than per-name E17 positions. Circumpolar names are allowed except UMI. Measured: min 3 (for 3° of LST), ≥ 4 for 99.2 %, mean 7.0. Your literal "≥ 4 at every 5°" can fail by one name at the samples near LST 6.3 h. Of all 9 unused figures, only UMI would fix it, and UMI collides with DRA. G9 therefore requires ≥ 3 always and ≥ 4 for ≥ 98 % of the day. |
| 15 | Day arc is another hairline | **Accepted** | Night sector on F2 |
| 16 | Look validated last | **Accepted** | Monday mock with G7, G8, G9 and the G1 sweep, before `wff-expr.js` |

### Watch (owner's bench)

| # | Issue | Verdict | Response |
|---|---|---|---|
| M1 | Glass hides the culmination band; about 1.5 names | **Partly** | Names chosen by open hours, as 3-letter IAU codes: 24 of them, mean 7.0, G9 added. M3 corrected. Rejected: "≥ 10 figures at every hour". With the plate the hard rules require over the zenith, the measured minimum is 8, so the gate is ≥ 7. |
| M2 | G1 sampled only where it passes | **Accepted** | 24-hour sweep, min/median thresholds, a brightness floor (1.6 px figure lines at L\* 68, brighter mag 3 to 4.5 stars, about 590 BSC dust stars) and named remedies |
| M3 | Forced `angleDirection` | **Accepted** | NONE (the XSD default), T2 film, wording fixed. The sky settle is removed altogether. |
| M4 | Burn-in case wrong and untested | **Accepted** | Colon dimmed to `#5E7A55`; the lip hairline and the BAT full rim dropped; T19 soak; non-digit walk fallback; 7.3 rewritten. The flat skeptic asked to keep a sub-disc rim, so only a 126° lit-wall arc at Y 3.8 % remains. |
| M5 | Eccentric cue is the faintest stroke | **Accepted** | Bead, brushed and guilloched crescent, G5 bead check. The optional brighter BAT lip is moot with one sub-disc. |
| m1 | `luna_aod` inside the hidden group | **Accepted** | `luna_aod` is its own Group (2c) with a black footprint |
| m2 | Lit limb misses the sun by up to 56° | **Superseded** | The globe no longer points at the sun (flat #8), so the bearing error no longer exists |
| m3 | Tick at 180° splits INFINITY | **Accepted** | 11 ticks |
| m4 | AOD date off-axis; BAT jumps | **Accepted** | 18-character AOD date in the Active boxes; BAT in the same box and size |
| m5 | Prompt does not fit; two colours | **Accepted** | Baked; tracking 0; 145.2 px = 38.7° at r 215 (160.65° to 199.35°) |
| m6 | Crescent numbers for r 182 | **Accepted** | 25.5 px, ±64.5° about C, ±50.7° about H |
| m7 | Date and values smaller than v4 | **Partly** | Date 17 px `#B9C5CA`. Rejected for values: at 24 px, `6,240` is 72 px wide, and its corner would sit 38.7 px from Q, inside the 38.5 px STP gauge. Two stacked lines need 22 px in one sub-disc. |
| m8 | Month orientation unspecified | **Accepted** | Tops toward C |
| m9 | Sun covers its month name | **Accepted** (stated) | The sun sits on the inner track. It touches the name by ≤ 0.2 px of body (≤ 1.2 px with glow) around the 16th, as in the photo. |
| m10 | Inlined expressions huge | **Accepted** | References (each carrier under 1 KB), `[MOON_PHASE_POSITION]`, macro-expander fallback, T9/T10 |
| m11 | float32 claim wrong | **Accepted** | Corrected (4.1); E1 from HOURS_SINCE_EPOCH; T7 |
| m12 | Planets slide during the wake | **Accepted** | No settle; the planets are inside the sky Group |
| m13 | Globe fails at phase extremes | **Accepted** | Earthshine; G5 at M7 and M8 |
| m14 | BitmapFont size | **Accepted** | `size` 86, T4 criterion ±0.5 px |
| m15 | `STEP_GOAL` 0 | **Accepted** | `clamp([STEP_GOAL], 1, 1000000)` |
| m16 | No AOD globe footprint | **Accepted** | Black Ø92 |
| m17 | Wing tangent to F2 | **Accepted** | It now overlaps F2 by 7.5 px, deliberately |

### Builder

| # | Issue | Verdict | Response |
|---|---|---|---|
| A1 | Baseline model off by about 7 px | **Accepted** | `wffBox()` uses the hhea model. HH/MM y 179 (baseline 252.3), colon y 175, date y 167 h 24. `kwo_*` baseline matched; T4 overlay. PartText is assumed to follow the same model, and T5 checks it. |
| A2 | G5 ratio fails by construction | **Accepted** | Base-surface medians. F1 outer rule removed, inner rule at 35 %. |
| A3 | Milky Way unanchored | **Accepted** | Galactic-latitude painter with w(l), the rift and noise; the chart-area rule dropped; 24-hour sweep thresholds; remedies |
| A4 | sRGB blending | **Partly** | Compositing space stated and the table recomputed. Rejected: 60 to 65 % glass. At 65 % a core reads L\* 35.3 under the digits and fails G2's 99th percentile (≤ 30), so 75 % is the lightest passing value. |
| A5 | AOD freeze; old-style clock trap | **Accepted** | Every time rotation and carrier is a Group; T19; movement no longer cited for burn-in |
| A6 | Variable font | **Accepted** | Static instances; same files for bakes; T6 |
| B1 | Prompt and INFINITY defined three ways | **Accepted** | Baked; AOD INFINITY is the same raster at the same place; 11 AOD ticks |
| B2 | `luna_aod` contradictory, see-through | **Accepted** | Separate group with a black disc |
| B3 | Sky leaks under the digits during the wake | **Accepted** | Footprints are ordered under their Active counterparts; the plate mask fades out at 320 to 360 ms |
| B4 | Inlining unspecified | **Partly** | Macro expander, References, MOON_PHASE_POSITION, parser test. Rejected: per-year linear planet segments. Jupiter's and Saturn's retrograde loops are not linear within a year (errors of several degrees), and References already solve the size. |
| B5 | Precision and `%` | **Accepted** | Your E1 form, the floor-based W(), odd-minute check (T7) |
| B6 | Gyro wrappers swallow AOD twins | **Accepted** | AOD nodes outside; wrappers 470² at (−10,−10) |
| B7 | `sky_settle` claims wrong | **Accepted** | The settle is removed, and the wording is gone with it |
| B8 | Tight boxes; AOD date alignment | **Accepted** | ≥ 3 px slack, START alignment in both modes, lint rule |
| B9 | Token lint fails on its own colours | **Accepted** | All colours are in the token table; F1 rule alpha unified (rules 60 %, inner rule 35 %) |
| B10 | Wrong geometry figures | **Accepted** | 25.5 px, 64.5°, 1.12 to 1.19 px/deg near the pole |
| B11 | Test-list gaps | **Accepted** | Renumbered T1 to T24 with no gaps; added numberFormat, STEP_GOAL and TextCircular/baseline tests |
| B12 | Cues only partly delivered | **Accepted** | Covered by flat #1 to #9: bead check, earthshine, brighter sky |
| B13 | Sprite and drawing conflicts | **Accepted** | 104² moon sprites; 1° guilloche; the sun–name touch stated; directional horizon shadow |
| B14 | Unstated astronomy shortcuts | **Accepted** | Precession to J2026.5. Saturn's fixed tilt and exaggerated opening are stated (4.8). |
| B15 | Headset complication dropped silently | **Accepted** (decision made) | Not in v5.0; a v5.1 slot reserved with T24 (10.1) |
| B16 | No cut line; missing tools | **Accepted** | Cut line (8.1), `sweepRing()` emulation, PIL `reduce.py` |

*Evidence: `scratchpad\calc\v51\` (this document); `scratchpad\calc\final\` (05: month table, planet error, dragon raster); `scratchpad\calc\refute\` and `scratchpad\calc\refute06\` (the refutations); `scratchpad\wfref\xsd` and `scratchpad\wfref\mem` (schema and memory tool).*
