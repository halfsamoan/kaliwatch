# KALIWATCH v5 — "Celestial Vault", proposal v2 (horologist's lens, revised after three critiques)

Design space 450 x 450, centre (225,225), R 225. Target Galaxy Watch6 Classic 480 x 480 (1 design px = 1.067 device px ≈ 0.085 mm). One light source for every baked highlight, recess and cast shadow: 10:30 o'clock, elevation 35°. Nothing is a shader: every layer is a static PNG, a rotated/shifted PNG, an arc, a shape or text.

The three critics agreed on one thing and they were right: v1 described a five-level section and then painted it in tones between L* 3 and L* 9, which an OLED shows as black. v2 keeps the architecture (part-for-part Galaxia mapping, time-scale ladder, Polaris under the colon, civil clockwise / celestial anticlockwise) and rebuilds the picture on it: a grisaille dome at L* 29 → 10, a baked Seoul horizon that turns the lower third into the black lacquer level, an opaque 32 px flying cage inside the dome, a sun that truly rises and sets, the brand word back, the rings pulled inside r 216, the dragon inside the limb, and tilt parallax from the accelerometer. Every number below was recomputed (see the verification log).

---

## 0. What changed in one paragraph

v1 was a print. v2 is a section with visible value steps: **ground** (black lacquer, L* 0–5, everything below Seoul's horizon: moat, flange margin, telemetry bed) → **rings** (trench L* 15, flange L* 20, lip highlights L* 23–33) → **dome** (grisaille L* 10 at the limb rising to L* 29 at the zenith, white enamel stars on it) → **engraved dragon** → **applied numerals with a shadow that now lands on something** → **flying cage** on top. Three true occlusions happen in real time: the opaque cage covering indexes, the zodiac band, the sun and the dragon's wing-tops as it travels; stars setting into the ground at the western limb and rising at the eastern one every night; the moon sunk in its porthole. The sun pointer is now the true sun (equation of time applied), and its alpha follows its real altitude, so it becomes a gold ring at civil dusk and fills at dawn.

## 1. Galaxia part → v2 part

| Galaxia (physical) | v2 (digital) | Time scale |
|---|---|---|
| Black lacquer base disc, translucent lacquer over opaline, transferred inscriptions | **Ground / bed** — the lower third of the face below the baked Seoul horizon is the dome's chart seen through black lacquer (stars ghost at ×0.2); the telemetry, moon and prompt live on it as the "transferred inscriptions" | none |
| Outer minute flange (opaline) | **Flange** r 209–216, satin #26352A, 60 ticks, phosphor minute arc r 214.5 (a hand over the flange) | minutes |
| Sunken hour ring, enamel over guilloche, applied indexes | **Trench** r 199–208, #17291D floor with recess shadows and lip highlights, 12 applied phosphor indexes r 200–207 | civil hour frame; 5-min marks for the arc; 2-h marks for the sun |
| Inner 24-h flange + golden sun pointer | **Sun** Ø11 gold disc riding the moat at r 196, read against the indexes (noon at 12, 2 h per index); rises and sets | 24 h true solar (anticlockwise) |
| Domed celestial disc in grisaille enamel, star map, names | **Vault** r ≤ 195 rotating sky bitmap (Seoul 37.57 N, inside view) + static **dome shade** (zenith highlight, limb falloff, horizon ground mask, rim light) | sidereal day 23 h 56 m 04.09 s (anticlockwise) |
| Sun pointer vs zodiac month | **Zodiac band** baked on the vault r 176–186, 12 ticks at the RA of each 30° of ecliptic longitude, 3-letter names; the true sun's RA on it is the sign | tropical year |
| Cosmotourbillon (orbits once per sidereal day, cage turns once a minute) | **Cage** Ø32 opaque flying cage at orbit r 187 locked to RA 0h; its three-arm carriage turns 6°/s, one arm is the seconds hand | sidereal day (orbit) + seconds (carriage) |
| Grisaille planets | *not reproduced* (no ephemerides in WFF) | — |
| 2024 Dragon edition engraved dragons | **Official Kali dragon** engraved at the dome's crown, phosphor, engraving shadow | none |
| Dauphine hands on flange rings | **HH:MM** 78 px Roboto Mono applied numerals with a cast shadow onto the dome | civil time |
| (none) | **Moon porthole** Ø30 sunk in the ground between the readouts, 29 frames | lunation |
| (none) | **BATTERY / STEPS** v4 terminal readouts on the ground | telemetry |

Two senses of rotation stay: civil instruments (minute arc, carriage, indexes, digits) clockwise; the celestial level (vault, band, cage orbit, sun) anticlockwise about Polaris at (225,225), under the colon.

## 2. Layer stack, back to front (z = draw order)

All coordinates in the 450 space; all strokes ≥ 1.5 px (nothing sub-pixel survives the 450 → 480 resample). "Scale" is the real clock that drives the layer. Composite colours are what the eye sees after the shade.

| z | Layer | Shows | Scale | Bounds | Material (bakeable) | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | **Bed** `bed.png` 480² opaque (baked at device res), ambient twin `bed_aod.png` | lacquer #000 for r > 216 and the moat r 195–198; **flange** r 209–216 flat satin #26352A (L* 20.5); **trench** r 199–208 floor #17291D (L* 14.7); recess cues from the 10:30 light: 3 px #000 60 % shadow along the trench's *outer* wall over 225°–45° cw and along its *inner* wall over 45°–225°; 2 px lip highlight #34543C 70 % along the inner wall over 225°–45° (this is the dome's foot catching the light) and the outer wall over 45°–225°; the dome's cast shadow onto the trench: 2 px #000 50 % at r 199–201 over 90°–200°; 60 minute ticks 1.5 × 3 px #34543C r 210–213 (cardinals 2 × 4 px); 12 indexes 2.5 × 7 px #A6F46A 60 % at r 200–207 (cardinals 3 × 7 px at 90 %) each with a (+1,+1) #000 70 % shadow — range-ring glyphs, not rhodium batons | none | full disc | matte lacquer, two flat greens, hard-edged recess cues; no soleil, no brush lines | alpha 1 | swapped to `bed_aod.png`: pure #000 except the 12 indexes in #34543C at 70 % (Y ≈ 5 %) |
| 1 | **Vault** `sky.png` 800² RGBA (2x bake), declared 390 × 390 at (30,30), rotating | north-polar equidistant chart, r = (90 − dec) × 1.667 px, cut at the limb (dec −27°); base #35484F flat; ≈ 130 stars mag ≤ 3.0 (HYG) in #C2CFCB sized by magnitude (≤ 0: 2.6 px, 0–1: 2.2, 1–2: 1.8, 2–3: 1.5), stars inside r 120 capped at mag ≤ 2.0 or 60 % alpha; 20 constellation stick figures 1.5 px #C2CFCB 30 %; 6 transferred names 11 px #C2CFCB 45 % (URSA MAJOR, CASSIOPEIA, CYGNUS, ORION, LEO, LYRA), none inside r 120; Milky Way band #C2CFCB ≤ 25 % alpha; **zodiac band** r 176–186: 12 ticks 1.5 × 6 px #E3B35E 45 % at RA 0, 27.9, 57.8, 90, 122.2, 152.1, 180, 207.9, 237.8, 270, 302.2, 332.1° and the 12 names 11 px #C2CFCB baked at 85 % (they read ≈ 45 % after the limb shade), decoration class. **Chirality: RA increases CLOCKWISE in the bake, RA 0h at 12 o'clock at zero rotation** (inside view) | **sidereal day**, anticlockwise 0.25068°/min | disc r ≤ 195 | grisaille: white enamel on a mid-grey fired ground | full | `sky_aod.png` 480²: transparent base, the 40 brightest stars at 30 %, same rotation (drift = burn-in safe); fallback: static if ambient offload rejects the rotation |
| 2 | **Dome shade** `dome_shade.png` 800² alpha-only black + sheen, static, declared 390 × 390 at (30,30) | multiplier on the vault: 1.00 at the **zenith (225,138)** falling to 0.76 at the pole (225,225), 0.50 at the limb at 12 o'clock, 0.38 at the limb at 3/9 o'clock; **ground mask** ×0.20 everywhere below the Seoul horizon (the curve through (225,288), (273,283), (307,273), (352,247), (375,225), (394,195) to the limb at (404,149) and its mirror), 3 px soft edge, plus a 1.5 px #C2CFCB 25 % horizon hairline; **dragon protect** soft ellipse (225,95) rx 72 ry 50 at 20 % black; **digit protect** soft ellipse (225,228) rx 150 ry 52 at 15 % black; enamel sheen ellipse (195,150) rx 55 ry 36 #C2CFCB 5 %; **rim light** 1.5 px #C2CFCB 35 % at r 194 from 235° to 15° cw | none | disc r ≤ 195 | composites: zenith #35484F (Y 6.0 %, L* 29), pole #28373C (L* 22), limb-top #1B242A (L* 14), limb-side #141B1E (L* 10), ground ≈ #0B1114 (L* 4) | alpha 1 | alpha 0 (black dome at night) |
| 3 | **Sun** `sun.png` 24 × 24 (disc Ø11 + 6 px glow) and `sun_ring.png` 24 × 24 (1.5 px ring), in a rotating 450 × 450 Group | gold disc at r 196 on the moat; noon at 12 o'clock; drawn under the cage, above the bed | **24 h true solar**, anticlockwise 0.25°/min | centre at angle `SUN` | baked sphere #F4D08A → #E3B35E → #8A6424 (light from 10:30), glow #E3B35E 18 % | full disc when the sun is up; cross-fades to the ring across civil twilight (`DAY` 1 → 0 between altitude 0° and −6°) | ring only, #E3B35E at 40 %, 1.5 px |
| 4 | **Dragon shadow** `dragon.png` tinted #000 alpha 60 % | engraving shadow of the official path, offset (+2,+2) | none | frame (157,48) 140 × 104 | tinted copy of the same raster | on | off |
| 5 | **Dragon** `dragon.png` 280 × 208 (official press-pack path, white, rasterised 2x) | the crest engraved at the dome's crown | none | frame (155,46) 140 × 104; content x 155.6–293.8, y 45.4–148.1; **max radius 189.6 at (161.7,46.3)**, 5.4 px inside the limb | tint #A6F46A alpha 92 % | on | tint #718D61 alpha 85 % |
| 6 | **Brand** text | `KALI / VAULT` 12 px, letter-spacing 3 (0.25 em), #A6F46A | none | x 225, baseline 163 (cap top 154, 6 px under the dragon) | transferred inscription on the zenith highlight | on | #7F9472 at 65 % |
| 7 | **Digit shadow** | black copy of HH:MM at (+2,+2), alpha 65 % | — | same metrics as z8 | receives on the L* 22–29 pole zone of the dome | on | off |
| 8 | **HH:MM** | 78 px Roboto Mono 600 #EFF8EC, colon #A6F46A | civil | HH centred x 166, MM x 284, colon x 225 y 248, baseline 252 — byte-identical to v4; glyph band y 196–252, x 119–331 | applied numerals | fill | outline glyphs (fill #11200F, 1.4 px #91AD80) via BitmapFont |
| 9 | **Date** | `25 OCT / SUN` 17 px #9BAB9C | civil date | x 225, baseline 275 (13 px above the horizon at centre; its corners (164,275) and (286,275) are above the horizon) | text | on | #7F9472 |
| 10 | **Telemetry** (v4 pattern, on the ground) | `BATTERY` / `STEPS` 15 px #9BAB9C y 312 at x 144 / 306; values 27 px #EFF8EC baseline 343, `78%` at x 144, `6,240` at x 306 (≥ 10,000 shown as `12.3k`, max 5 chars, corner r 169.4); 2 px bars at y 352: left 116–172, right 278–334, track #17291D, fill #A6F46A (warning #F3C479 at ≤ 15 %) | none | all inside r 171 | text + rectangles on the black ground | on | `BAT 78%` 17 px #7F9472 at y 329 only (v4) |
| 11 | **Moon porthole** | bezel `porthole.png` 40 × 40 at (205,310): aperture Ø30, 2 px recess shadow #000 on the upper-left inner wall, 1.5 px lip #34543C on the lower-right; inside, one of 29 `moon_NN.png` 32 × 32 (face #C2CFCB, maria #8E9C98, night side #0B1E26) | **lunation** 29.53 d (integer day frames) | centre (225,330) | sunk below the ground — the one static occlusion | on, no label | off (black hole in the same place) |
| 12 | **Prompt** | `kali@vault:~$ INFINITY` 12 px, INFINITY in #A6F46A | none | x 225, baseline 376 (corners r 170.5) | text | on | `INFINITY` only, 11 px #7F9472, letter-spacing 2 |
| 13 | **Minute arc** PartDraw Arc | r 214.5, 1.5 px #A6F46A 85 %, 0° → 6·minute cw, read against the indexes (5 min each) | **minutes** | flange | vector hand over the flange | on | off (burn-in crescent at 12 o'clock) |
| 14 | **Cage** (top plane) | at orbit r 187: cast shadow ring 2 px #000 50 % offset (+2,+2); opaque back-disc Ø32 #0B1E26; lip 1.5 px #34543C 80 % on the 10:30 edge; ring 1.5 px #A6F46A 90 %; carriage: hub Ø4 #EFF8EC, three arms from the hub at 0/120/240°: one 1.5 × 12 px #A6F46A (the seconds hand), two 1.5 × 10 px #34543C | orbit **sidereal** (locked to RA 0h); carriage **seconds** 6°/s stepped | lane r 171–203: crosses the band (176–186), the limb and rim light (194–195), the moat, the sun (190.5–201.5) and the indexes' inner 3 px; passes over the dragon's wing-tops (the part of the crest beyond r 171) for ≈ 40 min twice a day; never enters r < 171, where all information lives | vector, no bake | all on | ring at 35 %, back-disc alpha 0, carriage alpha 0 (no per-second work) |

Depth planes relative to the digits: ground + rings (z0) far; vault + shade + dragon (z1–5) mid; digits (z7–8) near; cage (z14) nearest. Everything informational (digits, date, battery, steps, bars, brand, prompt) lies inside r 171 = the cage lane's inner edge, so the mechanism never covers information.

## 3. Section (12 o'clock → 6 o'clock), heights toward the viewer

```
 +3 |                 ○ CAGE r187 Ø32  opaque, orbits ↺ once per sidereal day, carriage turns 6°/s      [nearest]
 +2 |         ▐ HH:MM ▌ applied numerals, shadow (+2,+2) onto the dome     ━ minute arc: a hand floating over the flange
 +1 |     ~~~ KALI DRAGON ~~~ engraved at the crown (y 45–148), engraving shadow (+2,+2)   · KALI / VAULT on the zenith highlight
  0 |  ●SUN r196 rides the moat (noon at 12, sets at the left, rises at the right)        Z zenith (225,138) brightest point
 -1 |      ,-----''''''  VAULT r≤195  grisaille dome L*29→10  ''''''-----,   ◠ horizon: below it the chart is seen through black lacquer
 -2 | |_| trench r199–208 #17291D, recess shadows, phosphor indexes r200–207         ◉ moon porthole sunk in the ground at (225,330)
 -3 | ══ flange r209–216 #26352A, ticks r210–213 ══  moat r195–198 #000  ══  black margin r217–225 (under the bezel lip)
    +------------------------------------------------------------------------------------------------> r
     225 216 209 199 195                        0                        195 199 209 216 225
```

Time-scale ladder, now a statement about draw order only: nearer = faster. Cage carriage (s) > minute arc (min) > digits (civil) > sun (24 h) > vault + cage orbit (sidereal) > zodiac band (year) > moon in its porthole (lunation).

## 4. Composition

| Element | Position | Note |
|---|---|---|
| Official dragon | frame (155,46) 140 × 104, path untouched (140 = 31 % of the dial; v4 was 180) | max r 189.6 at the upper-left wing tip; inside the r 195 limb; the sun's noon position (225,29) clears the crown by 16 px; the cage crosses the wing-tops twice a day |
| Brand `KALI / VAULT` | x 225, baseline 163, 12 px, ls 3 | sits on the zenith highlight; decoration class |
| Zenith | (225,138) | brightest point of the dome; visibly peaks ≈ (225,150) because the dragon-protect ellipse ends at y 145 |
| HH / colon / MM | x 166 / 225 / 284, baseline 252, colon y 248 | unchanged from v4 |
| Digit shadow | (+2,+2), #000 65 % | WFF: second set of TimeTexts |
| Date | x 225, baseline 275, 17 px | above the horizon (288 at centre) |
| Horizon | (225,288) at centre, limb at ±66.9° from 12 → (404,149)/(46,149); through (375,225)/(75,225) | baked in the shade PNG |
| BATTERY / STEPS labels | x 144 / 306, y 312, 15 px | ground |
| Values | x 144 / 306, baseline 343, 27 px, ≤ 5 chars | corners r ≤ 169.4 |
| Bars | y 352, 2 px, 116–172 and 278–334 | corner r 168.7 |
| Moon porthole | centre (225,330), aperture Ø30, bezel Ø40 | between the readouts, where v4 had its divider |
| Prompt | x 225, baseline 376, 12 px | corners r 170.5 |
| Sun orbit | r 196, Ø11 | moat |
| Cage orbit | r 187, Ø32 | lane 171–203 |
| Zodiac band | r 176–186 (on the vault) | inside the cage lane |
| Dome limb / moat / trench / flange / margin | 195 / 195–198 / 199–208 / 209–216 / 217–225 | nothing but the black bed beyond r 216 |
| Safe information radius | 171 | = cage lane inner edge |

Vertical rhythm: dragon 45–148, brand 163, open lit dome 149–195 (only the 12 px brand line in it), time 196–252, date 275, horizon 288, labels 312, values 343, bars 352, moon 315–345, prompt 376, limb 420.

## 5. Palette

Identity unchanged: **#A6F46A phosphor** — minute arc, cage ring and hand, colon, dragon, indexes, bar fills, brand, INFINITY. Existing neutrals: #EFF8EC paper (digits, values, hub), #9BAB9C secondary, #34543C structure (ticks, lips, spokes, AOD indexes), #17291D (trench floor and bar tracks), #F3C479 low-battery warning, AOD greens #11200F / #91AD80 / #718D61 / #7F9472.

| Hex | Name | Role (one job each) | L* |
|---|---|---|---|
| **#35484F** | grisaille ground | flat base of the sky bitmap; after the shade it spans L* 29 (zenith) → 10 (limb); never on text or UI | 29 |
| **#C2CFCB** | grisaille white | stars, constellation lines, names, moon face, rim light, horizon hairline, sheen; only through alpha; never on UI text | 82 |
| **#E3B35E** | aurum | the sun, its glow and ring, the zodiac ticks; never on text, never on telemetry | 76 |
| **#0B1E26** | fired enamel | cage back-disc, moon night side | 10 |
| **#26352A** | flange | the raised outer ring | 20.5 |

Retired from v1: #141C17 / #0E1410 / #070B08 / #0A110C / #121B14 (ring textures below the OLED floor), #5B7A5E (solar hairline), #2A3A2D (lips, replaced by #34543C), #1E3A17 (the green "shadow" that was brighter than its receiver). Retired from v4: #8CA6B5, #506E7B, #081419.

Contrast (WCAG, computed): digits on the pole zone 11.2 : 1, on the zenith 8.8 : 1; phosphor on the zenith 7.2 : 1; #9BAB9C on the ground 7.8 : 1; stars on the zenith 6.0 : 1 (white enamel on grey, as on the reference).

## 6. Motion

### 6.1 Wake (AOD → Active), 360 ms in the studio, ease cubic-bezier(.22,1,.36,1), far plane first

| studio ms | WFF fraction | Layer | Property |
|---|---|---|---|
| 0–145 | 0.00–0.40 | z1 vault, z2 shade | `sky_aod` → `sky` cross-fade; inner group angle −2.5° → 0 (the only parallax kick, on the deepest moving layer); shade alpha 0 → 1 (the disc inflates into a dome and the horizon appears) |
| 36–216 | 0.10–0.60 | z0 bed | `bed_aod` → `bed` cross-fade: trench, flange, recess cues, lips arrive |
| 72–306 | 0.20–0.85 | z3 sun, z14 cage | sun ring → full disc (× `DAY`); cage back-disc alpha 0 → 1, carriage alpha 0 → 1 at the current second, ring 35 → 90 % |
| 108–324 | 0.30–0.90 | z4–5 dragon | tint #718D61 → #A6F46A, alpha 0.85 → 0.92; engraving shadow 0 → 0.6 (the crest lifts off the dome) |
| 119–342 | 0.33–0.95 | z7–8 digits | outline glyph alpha 1 → 0 over the first half, filled text 0 → 1, shadow 0 → 0.65 in the last 40 % (light fills the numerals, then they cast a shadow — depth lands last on the near plane) |
| 198–360 | 0.55–1.00 | z6, 9–13 | brand, date tint, telemetry, bars, moon, prompt, minute arc alpha 0 → 1 |

Nothing translates except the −2.5° settle; the time never moves, scales or re-flows. All WFF `startOffset + duration ≤ 1.0`. Reduced motion (manual or OS): every value jumps at 0 ms.

### 6.2 Continuous real-time motion (no decorative loops)

| Layer | Rate | Period | Sense |
|---|---|---|---|
| vault + zodiac band + cage orbit | 0.25068°/min (0.82 px/min at r 187) | 23 h 56 m 04.09 s | anticlockwise |
| sun (true) | 0.25°/min ± equation of time | 24 h | anticlockwise |
| sun vs zodiac band | ≈ 0.9856°/day | 365.24 d | **clockwise** on the band (v1 had the sign wrong) |
| sun fill ↔ ring | across civil twilight (altitude 0° → −6°, ≈ 30 min) | daily | — |
| minute arc | 6°/min | 60 min | clockwise |
| cage carriage | 6°/s stepped | 60 s | clockwise |
| stars at the horizon | set at the western limb, rise at the eastern limb | daily | — |
| moon | one of 29 frames | 29.53 d | — |

Per second (Active only): the carriage steps. Per minute: arc, sun, vault, cage orbit. Per day: moon frame. No colon blink, no twinkle, no breathing.

### 6.3 Tilt parallax (Gyro; Active only)

`Gyro` is a WFF element (Wear OS 4) with `x`/`y` expressions on the parent Group; unit mapping is undocumented, so the multipliers below are tuned on the device and clamped. `a_x = [ACCELEROMETER_ANGLE_X]`, `a_y = [ACCELEROMETER_ANGLE_Y]`, `P = [CONFIGURATION.parallax] ? 1 : 0` (BooleanConfiguration, default on; off = reduced motion).

| Group | Depth | Gyro x / y |
|---|---|---|
| far (bed + rings) | −2.5 | `clamp(P*0.07*a_x, -3, 3)` / same with a_y |
| mid (vault, shade, dragon, dragon shadow, digit shadow, brand) | 0 … +1 | `clamp(P*0.04*a_x, -2, 2)` |
| digits, date, arc, telemetry, moon, prompt | +2 (camera lock) | none |
| near (cage) | +3 | `clamp(-P*0.03*a_x, -1.5, 1.5)` |

Max 3 px of relative motion; the outer 8 px of the bed are black so the edge never shows. The minute hand reading against ticks that shift 3 px under tilt is parallax error — the same thing a real flange shows at an angle.

### 6.4 Active → AOD

A WFF `Variant` carries one `duration`/`startOffset` for both directions, so the device plays the same stagger in reverse (near plane leaves first). The studio keeps its 180 ms uniform fade as a studio-only value. Carriage alpha → 0 at once. Reduced motion: instant.

## 7. AOD

What remains, same positions: outline digits (#11200F / 1.4 px #91AD80), dim dragon (#718D61, 85 %), date #7F9472, `BAT 78%` 17 px at y 329, `INFINITY` 11 px at y 376, 40 brightest stars at 30 % drifting, 12 indexes #34543C 70 %, sun ring #E3B35E 40 %, cage ring #A6F46A 35 %. Hidden: everything else (shade, Milky Way, lines, names, band, brand, shadow, carriage, cage disc, sun disc, minute arc, labels, values, bars, moon, prompt text).

Lit-pixel estimate (v4 method, non-zero RGB after 900 → 450 sampling, AA counted): outline digits 3.8 k px², dragon 3.1 k (140 × 104 frame), date 1.0 k, indexes 0.5 k, stars 0.3 k, sun + cage rings 0.3 k, BAT 0.65 k, INFINITY 0.5 k → **≈ 10.2 k px² of 159 k = ≈ 6.4 %** (v1 claimed 10 %, v4 measured 11.3 %); luminance-weighted ≈ 2 %. Both AOD bitmaps have a true black / transparent base — no dimmed textured bed anywhere.

Burn-in: static AOD elements are the outline digits, dragon, indexes, BAT, INFINITY, all ≤ 37 % L* and green-dominant; the stars, sun ring and cage ring drift. Nothing is lit beyond r 207 in AOD (the arc is gone), 10 px inside the bezel lip; OS pixel-shift stays on.

## 8. WFF v4 mapping

Shared expressions (Seoul 126.98 E; `tz = [TIMEZONE_OFFSET_MINUTES_DST]/60`):

```
D    = 365*([YEAR]-2000) + floor(([YEAR]-2001)/4) + [DAY_OF_YEAR] + ([HOUR_0_23_MINUTE] - tz)/24 - 0.5
LST  = (280.46061837 + 360*fract(D) + 0.98564736629*D + 126.98) % 360      (deg; every term < 1e4, float32-safe)
SKY  = (360 - LST) % 360                                                   (clockwise angle of the vault group)
B    = rad(360*([DAY_OF_YEAR] - 81)/365)
EOT  = 9.87*sin(2*B) - 7.53*cos(B) - 1.5*sin(B)                            (minutes; +16.2 on 25 Oct)
LMT  = [HOUR_0_23_MINUTE] - (tz - 126.98/15) + EOT/60                      (true local solar time, h)
SUN  = (180 - 15*LMT + 720) % 360                                          (cw angle of the sun; 0 = true noon at 12)
LAM  = (280.46061837 + 0.98564736629*D) % 360                              (mean solar longitude)
DEC  = 23.44*sin(rad(LAM))                                                 (sun declination, ±0.4°)
SALT = sin(rad(37.57))*sin(rad(DEC)) + cos(rad(37.57))*cos(rad(DEC))*cos(rad(SUN))
DAY  = clamp((SALT + 0.1045)/0.1045, 0, 1)                                 (1 above the horizon, 0 below −6°)
```

Check at 2026-10-25 10:08:24 KST: D 9793.5475, LST 177.52° (11h50m), SKY 182.48°, EOT +16.2 min, SUN 31.9° (mean would be 35.9°), LAM 213.4°, DEC −12.9°, sun altitude 31° → DAY 1; sunrise when SUN = 80.0° → 06:56 KST, sunset SUN = 280° → 17:36 KST (published 06:54 / 17:41; the rest is refraction). True sun RA = LST + SUN = 209.4° → between the band ticks at 207.9 and 237.8 → SCO. `[MOON_PHASE_POSITION]` = 15.

| z | WFF construction |
|---|---|
| far group | `Group far 450×450` with `<Gyro x="clamp([CONFIGURATION.parallax]*0.07*[ACCELEROMETER_ANGLE_X],-3,3)" y="…"/>` containing z0 and the sun |
| 0 bed | two `PartImage` 450×450: `bed` (alpha 255, `Variant AMBIENT alpha 0`) and `bed_aod` (alpha 0, `Variant AMBIENT alpha 255`); one Variant per element |
| 3 sun | `Group 450×450 pivot 0.5/0.5` with `<Transform target="angle" value="SUN"/>`; inside `PartImage x="213" y="17" width="24" height="24"` `sun` with `<Transform target="alpha" value="round(255*DAY)"/>` and `sun_ring` with `round(255*(1-DAY))`; `Variant AMBIENT`: sun alpha 0, ring alpha 102 |
| mid group | `Group mid` with Gyro ×0.04 (clamp ±2) containing z1, z2, z4, z5, z6, z7 |
| 1 vault | outer `Group x=30 y=30 w=390 h=390 pivot 0.5/0.5` with `<Transform target="angle" value="SKY"/>` and `<Reference name="sky" source="angle"/>` (Wear OS 6; else repeat the expression); inner `Group 390×390 pivot 0.5/0.5 angle="0"` with `<Variant mode="AMBIENT" target="angle" value="-2.5" duration="0.4" interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1"/>` — the settle lives on its own group because Variant values are absolute; inside: `PartImage sky` (alpha 255 → AMBIENT 0) and `sky_aod` (0 → 255). In AOD the chart sits 2.5° (10 sidereal minutes) off; invisible |
| 2 shade | `PartImage dome_shade` 390×390 at (30,30), normal blending (black with alpha = 1 − factor is a multiply against black; `blendMode` is v5-only); `Variant AMBIENT alpha 0` |
| 4–5 dragon | `PartImage x=157 y=48 w=140 h=104 tintColor="#000000" alpha="153"` (AMBIENT 0) and `PartImage x=155 y=46 w=140 h=104 tintColor="#A6F46A" alpha="235"` with `<Variant mode="AMBIENT" target="tintColor" value="#718D61"/>` + alpha 217 — `tintColor` is transformable from v4, so the Variant is legal; the twin-image alpha cross-fade stays as the fallback if the runtime refuses it |
| 6 brand | `PartText` Font size 12 `letterSpacing="0.25"` (em, not px) color #A6F46A; `Variant AMBIENT` color/alpha |
| 7–8 digits | four documented `TimeText` cells of width 47, `hourFormat="24"`, `align="CENTER"`: `hh_10` at x 119, `hh_1` at x 166, `mm_10` at x 237, `mm_1` at x 284 (cells 119.2–166 / 166–212.8 / 237.2–284 / 284–330.8 reproduce v4's HH centre 166 and MM centre 284 for a 46.8 px advance), Roboto Mono 78 SEMI_BOLD #EFF8EC; colon `PartText` #A6F46A at x 225 y 248; shadow = the same four cells at (+2,+2) `#a6000000`, `Variant AMBIENT alpha 0`; AOD: `BitmapFonts > BitmapFont name="outline"` with 11 `Character` PNGs 48×60 used by an ambient DigitalClock cross-faded by alpha |
| 9 date | `PartText` `<Upper><Template>%s %s / %s</Template></Upper>` with `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]` (`MONTH_S` is mixed case; `Upper` exists since Wear OS 4) |
| 10 telemetry | `PartText` values; steps Template with `Condition` on `[STEP_COUNT] >= 10000` → `%s.%sk` from `round(floor([STEP_COUNT]/1000))` and `round(floor(([STEP_COUNT]%1000)/100))` (integers; `floor()` returns Float and `numberFormat` cannot zero-pad), else `numberFormat("#,###", [STEP_COUNT])`; bars: `PartDraw Rectangle` with `<Transform target="width" value="56*[BATTERY_PERCENT]/100"/>` and `56*clamp([STEP_COUNT]/[STEP_GOAL],0,1)`; warning colour by `<Transform target="color">` on the Fill (transformable from v4); AMBIENT: all alpha 0, plus the ambient `BAT %s%%` PartText alpha 0 → 255 |
| 11 moon | `Condition` with 29 `Compare` branches on `[MOON_PHASE_POSITION]` selecting `PartImage moon_NN` 32×32 at (209,314); `PartImage porthole` 40×40 at (205,310) above it; AMBIENT alpha 0 on both |
| 12 prompt | `PartText` 12 px; `Variant AMBIENT alpha 0`; separate `INFINITY` PartText 11 px alpha 0 → AMBIENT 255 |
| 13 arc | `PartDraw` 450×450 `Arc centerX=225 centerY=225 width=429 height=429 startAngle=0` with `<Transform target="endAngle" value="[MINUTE]*6"/>`, `Stroke color="#ffa6f46a" thickness="1.5" cap="ROUND"`; `Variant AMBIENT alpha 0` |
| near group | `Group near` with Gyro ×−0.03 (clamp ±1.5) containing z14 |
| 14 cage | `Group 450×450 pivot 0.5/0.5` with `<Transform target="angle" value="[REFERENCE.sky]"/>` (or `SKY`); inside at (209,22) a `PartDraw` 36×36: shadow `Ellipse` offset (2,2) stroke #000 alpha 128 2 px, back-disc `Ellipse` 32×32 fill #0B1E26, lip `Arc` 1.5 px #34543C from 200° to 20°, ring `Ellipse` stroke #A6F46A 1.5 px; nested `Group 32×32 pivot 0.5/0.5` with `<Transform target="angle" value="[SECOND]*6"/>` holding three `Rectangle` arms (one #A6F46A 1.5×12, two #34543C 1.5×10) and the hub `Ellipse` 4×4 #EFF8EC. AMBIENT: back-disc, shadow, lip and inner group alpha 0; ring alpha 90 |

Wake sequence in WFF: `Variant duration`/`startOffset` are fractions of the device allowance (table in 6.1), `interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1"` (confirm the literal form the validator accepts). Only the order is guaranteed on the watch; 360 ms is a studio value.

Assets and budget (RGBA8888, evaluator may rescale to 480): bed 480² ×2 = 1.84 MB, sky 800² + shade 800² = 5.12 MB, sky_aod 480² = 0.92, dragon 280×208 = 0.23, 29 moons 32² = 0.12, 11 glyphs 48×60 = 0.13, sun ×2 + porthole ≈ 0.01 → **≈ 8.4 MB interactive, ≈ 3.1 MB ambient-visible** (limits 100 / 10 MB; the validator counts ambient as up to three full-screen layers — run it rather than trusting the sum). `dome_shade` as ALPHA_8 and `bed` as RGB565 would halve it. Redraw cadence: assume a full composite once per second in Active (no documented dirty-region rendering), once per minute in AOD.

Studio pipeline (required, not optional): `build-assets.cjs` rasterises `bed.svg`, `bed_aod.svg`, `sky.svg` (from the HYG list, RA clockwise), `sky_aod.svg`, `dome_shade.svg`, `dragon.svg` → PNG with resvg/sharp (or the known Inkscape path); `face.js` draws them with `<image href>` and the same `SKY`/`SUN`/`DAY` expressions — no live gradients, filters or masks. Studio toggles: **OLED floor** (clamp Y < 6 % to black), **1:1 480 px**, **named moments**: sample (below), sunrise 2026-10-25 06:56, sunset 17:36, sun–cage conjunction 2027-03-21 (cage over sun — the opaque disc hides the sun and its glow with no special handling), Cassiopeia test 2026-10-25 21:00 KST (LST ≈ 22.7h: Cassiopeia just right of the top, Deneb upper-left, the Big Dipper grazing the northern horizon at the bottom), Regulus test (sample moment: Regulus at (169.2,107.5), r 130.1, 334.6° cw — behind the dragon's left wing).

## 9. Risks

1. **Bezel overlap is still unverified.** v2 keeps all information inside r 171 and all drawn structure inside r 216 (the existing on-watch XML's outermost ring is r 216–217); the 8 px black margin is the hedge. Check at 1:1 on the device before moving anything outward.
2. **OLED black crush of the ground and the limb.** The ground (L* 4) and limb-side (L* 10) are meant to go black outdoors; the depth then rides on hard edges — recess cues, index shadows, the cage crossing the rings, the horizon hairline, the rim light. Dither the shade PNG. If the limb-side zone also crushes indoors, raise the limb factor from 0.38 to 0.45.
3. **Gyro units and feel are undocumented.** Multipliers are placeholders to tune on the SM-R965N; ship with the configuration switch default on only if the tuned result is ≤ 3 px and silent.
4. **Ambient offload may reject a rotating bitmap.** Fallback: static `sky_aod` (no rotation) with the OS pixel shift; stars at 30 % are already burn-in safe. Run `memory-footprint.jar --apply-v1-offload-limitations` and measure 24 h AOD drain against v4.
5. **Wake timing is device-owned** and the Variant stagger mirrors on sleep; only the order is specified.
6. **Expression precision.** The reduced LST form keeps every intermediate < 1e4; still verify `SKY` for a dozen dates on the emulator (the Regulus and Cassiopeia tests are the acceptance).
7. **Hardcoded Seoul.** Longitude 126.98 and latitude 37.57 are constants in the horizon bake and the expressions; the `tz` term keeps the sidereal angle right across time zones, the longitude and the horizon do not travel. Documented as a personal face.
8. **Mean vs true.** The pointer is the true sun (EOT, ±1 min; declination ±0.4°; no refraction, ≈ 3 min at rise/set). The Galaxia's pointer is a mean sun; ours is better, say so.
9. **Cage over the wing-tops.** The crest's part beyond r 171 is covered by the cage for ≈ 40 min twice a day. If the brand owner objects, shrink the dragon to 130 × 97 at (160,46) (max r 188.2; 95 of 977 outline samples beyond r 171 instead of 89 — it does not solve it) or lift the cage to Ø28 at r 189 (lane 175–203). Decided: keep Ø32; an honest occlusion of a decorative tip is the point of a flying cage.
10. **`tintColor` Variant** and the ambient `BitmapFont` digits are legal per the spec but unexercised on Samsung's runtime; both have alpha-cross-fade fallbacks written in.
11. **Zodiac names are decoration** (11 px, 45 % after shade, visible only in the daytime arc above the horizon) and the sign has no text readout any more; if the owner wants it, a 12-branch `Condition` on `floor(LAM/30)` under the date costs one line.
12. **`[STEP_COUNT]` ≥ 100,000** would break the 5-char rule (`123.4k`); clamp the display at `99.9k`.

## 10. Why it is not flat (rewritten against the critiques)

Depth on a top-down display comes from three cues only — value steps, cast shadows and occlusion — and v1 spent all three on grounds the OLED cannot show. v2 puts them where they can be seen. The value steps are now 20:1 inside the dome alone (L* 29 → 10) and the dome stands on a black moat between two green rings five L* apart, each with a shadowed wall and a lit lip from the same 10:30 light that throws the index shadows, the engraving shadow and the numerals' shadow — one light, no contradictions. The occlusions are real and they move: an opaque 2.7 mm cage travels once a sidereal day across the zodiac band, the rim light, the moat, the sun and the inner ends of the indexes, covering each for 40 minutes; every night the chart's stars set into black lacquer at the western limb and rise out of it at the eastern one along a horizon that is Seoul's; the moon sits in a hole. Tilt the wrist and the bed, the dome and the cage shift by different amounts while the time holds still — motion parallax, the cue the eye trusts above all, delivered by one documented element. And the depth is still information: the nearer the layer, the faster its clock — a seconds carriage on top, minutes on a hand over the flange, civil time applied over the dome, the true sun on the rim rising at 06:56, the Seoul sky underneath turning once in 23 h 56 m with the sign of the month under the sun, and the lunation sunk into the ground. It stays KALI: the official dragon engraved at the crown, phosphor on the indexes, the cage, the arc and the colon, `KALI / VAULT` on the zenith, Roboto Mono numerals that never move, a terminal prompt that ends in INFINITY, and a 360 ms wake that arrives from the back forward.

## 11. Sample moment (studio fixture): 2026-10-25 10:08:24 KST, Seoul

LST 11h50m; vault rotated 182.5° cw (RA 0h — the cage — at the bottom just left of 6 o'clock, over the ground); Leo just past the meridian with Regulus at (169,108) behind the dragon's left wing; true sun at 31.9° cw, (329,59) on the moat, altitude 31°, full gold, over the SCO sector of the band; minute arc 0–48°; carriage hand at 144°; moon day 15, full; battery 78 %, steps 6,240; Big Dipper below the northern horizon in the ground, Cassiopeia rising on the right.

## 12. Change log vs v1

1. **Material lifted above the OLED floor.** Vault base #050B0E (L* 3) → #35484F (L* 29) shaded to L* 10 at the limb; trench #070B08 → #17291D (L* 15); flange #141C17 → #26352A (L* 20.5); recess cues 2–3 px hard edges; all soleil/brush/0.5 px detail deleted; all strokes ≥ 1.5 px.
2. **Zenith and horizon baked.** Shade centred on the Seoul zenith (225,138), ground mask ×0.20 below the real horizon (bottom at y 288), horizon hairline; the lower third becomes the black lacquer level and carries the telemetry.
3. **Ring stack pulled inside r 216.** Vault 200 → 195; moat 195–198; trench 199–208; flange 209–216; black margin 217–225. Solar hairline, 24 ticks and zodiac-name smudge removed; the sun reads against the hour indexes (2 h each).
4. **Cage made an object.** Ø20 open ring at r 212 → Ø32 opaque cage at r 187 inside the dome with a cast shadow, lip, three-arm carriage and a 12 px hand; lane 171–203; information radius 171 enforced.
5. **Dragon inside the limb.** Frame (135,30) 180×123 (max r 208.5) → (155,46) 140×104 (max r 189.6); engraving shadow #1E3A17 60 % → #000 60 % at (+2,+2); dragon-protect ellipse baked.
6. **Sun made true and alive.** Equation of time added; alpha cross-fade disc ↔ ring across civil twilight driven by the real altitude (the v1 "rim-shadow dimming" claim, which had no mechanism, is replaced by a sunset).
7. **Zodiac band ticks at the RA of each 30° of ecliptic longitude** (0, 27.9, 57.8, 90, …) because the pointer is now the true sun; names 9 px → 11 px, decoration class; ecliptic hairline removed.
8. **Three-gauge sub-dial row deleted.** v4's BATTERY / STEPS readouts restored at 27 px (values x 144 / 306, ≤ 5 chars) with 2 px bars; moon porthole Ø30 between them; `MOON 15` label dropped.
9. **Identity restored.** `KALI / VAULT` 12 px phosphor at the zenith; indexes and ticks as phosphor range-ring glyphs with shadows instead of rhodium batons; grisaille only on the sky, gold only on the sun; `kali@vault:~$ INFINITY` at 12 px / baseline 376 inside r 171.
10. **LST inscription deleted**; date moved from y 181 to baseline 275 so the lit crown of the dome (y 149–195) is open except for the brand line.
11. **AOD rebuilt**: pure-black `bed_aod`, transparent `sky_aod`, minute arc and moon and sub-dial outlines out, `BAT 78%` back; estimate 6.4 % (was a self-contradictory 10 %).
12. **Gyro parallax** added on three depth groups with a configuration switch.
13. **WFF corrections**: integer coordinates; four `hh_10/hh_1/mm_10/mm_1` cells for v4-exact metrics; nested settle group; `letterSpacing` in em; `Upper` for the month; integer parameters instead of `numberFormat` zero-padding; `Stroke`/`Fill` colour Transforms for the warning colour; reduced-magnitude LST; bake at device resolution (bed 480², sky/shade 800²); memory restated 8.4 / 3.1 MB; per-second dirty-region claim withdrawn; Active → AOD timing restated as the mirrored stagger.
14. **Studio pipeline specified**: rasterised PNGs drawn by `<image>`, OLED-floor toggle, 1:1 preset, named test moments, chirality acceptance tests.
15. Sun-vs-band creep corrected to clockwise; 0.089 mm/px → 0.085; section diagram and ladder made consistent.

## 13. Rebuttals (critic claim → verdict)

**Critic 1 (depth)**
- F1 no dynamic range → **accepted**; see change 1. The green "engraving shadow" brighter than its receiver was a real error.
- F2 three occlusions were one → **accepted** for v1; v2 has three moving ones (cage, horizon, sunset state) plus the porthole.
- F3 ring stack 2 mm, cage a dot, sun and cage on one rim → **accepted** (cage inside the dome, sun on the moat 9 px out, different radii, different objects). "Cage ≈ a fifth of the dial (90 px) like the reference" → **rejected**: the Galaxia has no 78 px numerals; a 90 px cage would enter the digit band (r ≤ 110) on every orbit. Ø32 is the largest cage whose lane clears r 171.
- F4 identity → **accepted**; change 9.
- Fix 2 zenith shading + horizon → **accepted** (the zenith is at (225,138) as computed; the visible peak is ≈ (225,150) because of the dragon-protect ellipse — stated).
- Fix 3 rim carries one scale, cage at r 178–188 inside the limb → **accepted** at r 187 (your Ø36–40 trimmed to 32 so the lane clears r 171).
- Fix 4 sun rim-shadow via tintColor sector → **superseded**: an altitude-driven alpha ramp is a real sunset instead of a baked sector.
- Fix 5 minute arc at r 199 riding the dome → **rejected**: the Galaxia reads minutes on the outer flange, and the arc is a hand floating over the flange (under Gyro it even shows hand/flange parallax). The ladder is restated as draw order, and §3 was redrawn so it no longer contradicts §10.
- Fix 6 brand word, phosphor indexes, palette discipline → **accepted** (brand at baseline 163, not 160: the dragon's content bottom is y 148).
- Fix 7 dragon-protect ellipse and a black engraving shadow → **accepted** (ellipse (225,95) rx 72 ry 50 to match the new frame).
- Fix 8 values 27 px, gauges r 18, moon Ø30 → **accepted** on values and moon; gauges replaced by v4's 2 px bars rather than shrunk.
- Fix 9 AOD inventory cut, keep the arc → **accepted** except the arc: critic 2's burn-in crescent argument is quantitative and wins.
- Fix 10 chirality + Regulus test → **accepted**; (169.2,107.5) reproduced.
- Fix 11 band ticks at RA(λ) boundaries → **accepted** — and only because v2's pointer is the true sun. With v1's mean-sun pointer (RA = mean longitude by definition) plain 30° RA sectors would have been the self-consistent choice; the critique's premise (a true-sun reading) is now true.
- Fix 12 state the mean-sun error → **accepted and removed**: EOT added (your formula, which checks: +16.2 min on 25 Oct).
- Fix 13a tintColor Variant → **accepted** with the cross-fade kept as fallback; 13b dirty-region claim → **withdrawn**; 13c `format="hh"` → **accepted**, four documented single-digit cells; 13d `controls` literal → flagged; 13e memory → restated and the validator named as the authority.
- "KALI radar lens unused" → **accepted** in the indexes/ticks (range-ring glyphs); a PPI sweep was not added because the brief forbids perceptible loops and the carriage already owns the seconds.

**Critic 2 (readability)**
- F1 material below threshold → **accepted** (your L* figures reproduced to 0.1).
- F2 AOD self-contradiction, 21 % annulus → **accepted**; pure-black `bed_aod`, transparent `sky_aod`, one Variant per image.
- Q1 digit cleanliness: ellipse mandatory, cap stars inside r 120 → **accepted** (ellipse at 15 %, not 25 %, so the shadow still has a receiver).
- Q2 `MOON 15` at 11 px → **accepted**, label dropped; zodiac/constellation names declared decoration at 11 px.
- Q3 arc under-count 4.2 k → **moot**, arc removed from AOD. Q4 burn-in crescent → **accepted**. Q5 `[SECOND] % 2` cursor must not be ported → **accepted**.
- Fix 1 inside r 218 → **accepted** (r 216 and a black margin).
- Fix 2 handedness + Cassiopeia test → **accepted** and added as a named studio moment.
- Fix 3 arc out of AOD → **accepted**; the minute dot was not added (HH:MM is the minute cue in AOD).
- Fix 4 steps overflow → **accepted**: `12.3k` format, 5 chars max, x 306 (corner r 169.4).
- Fix 5 nested settle group → **accepted**.
- Fix 6 document the mean sun, EOT formula, generalise 0.5347 to `tz − 126.98/15` → generalisation **accepted**; the EOT formula as written is **rejected**: it feeds the J2000 day count `D` into a day-of-year sine and evaluates to −0.46° on 2026-10-25 (−1.8 min) where the true value is +16.2 min; critic 1's form with `[DAY_OF_YEAR]` is used instead.
- Fix 7 float-safe LST → **accepted** (177.52° either way).
- Fix 8 zodiac names off the vault rim → **partly rejected**: the names must rotate with the sky, so they cannot live on the static trench; they stay on the band at 11 px, pre-brightened, decoration class.
- Fix 9 sun–cage conjunction → **accepted**; the opaque cage resolves it by itself; test date 2027-03-21.
- Fix 10 one Variant both ways → **accepted**; §6.4 rewritten.
- Fix 11 horizon mask → **accepted** and made the organising idea of the lower third.
- Fix 12 strip sub-pixel detail → **accepted**.
- "0.083 mm/px" → **accepted** as 0.085 (1.5 in / 480 × 1.067).

**Critic 3 (feasibility)**
- FATAL-1 chiaroscuro below the floor, studio must clamp → **accepted** (values, OLED-floor toggle, 1:1 preset).
- FATAL-2 AOD 18.6 % annulus → **accepted**.
- FATAL-3 cage not an object; Ø36 at r 192 → **accepted** in substance; r 192/Ø36 (lane 174–210) **rejected** for Ø32 at r 187 (lane 171–203): your radius put the cage's outer edge on the flange ticks and its inner edge at the safe radius; mine keeps the cage inside the dome and still cuts the moat, sun and indexes.
- FATAL-4 dragon leaves the dome; (150,40) 150×102.5 → **accepted** on the finding (208.5 reproduced); your frame **rejected** because with the limb at 195 its tip at r 194.9 would touch it; (155,46) 140×104 → 189.6.
- F-1 Gyro parallax → **accepted** (element verified: Wear OS 4, six expression attributes, units undocumented); multipliers, clamps and a configuration switch specified.
- F-2 drop the gauge row, restore v4 readouts, moon only, prompt inside r 171 → **accepted** almost verbatim (prompt 12 px at baseline 376, not 378: 378 puts the corners at r 172).
- F-3 open the apex, delete LST, date to 275 → **accepted** (date at 275 checked: above the horizon).
- F-4 horizon → **accepted** (×0.20 "translucent lacquer" rather than full black, so the chart continues faintly under the ground as on the reference's lacquered base).
- F-5 WFF corrections (integers, zero-padding, em, nested settle, Upper, sun alpha transform, bed_aod, `hh` flag) → **all accepted**.
- F-6 bake at device/2x grid → **accepted** (bed 480², sky/shade 800², sky_aod 480²).
- F-7 asset pipeline in the studio → **accepted** as a requirement.
- F-8 arc at r ≤ 221 → **superseded** by r 214.5.
- F-9 ambient offload check with a static fallback → **accepted**.
- F-10 derive the sign from the same angle as the band → **accepted** in spirit: the sign text is deleted; if restored it comes from the pointer's own quantities.
- "SUN creeps clockwise on the band" → **conceded**.
- "memory 4.22 MB, not 3.3" → **conceded**; now 8.4 MB with the 2x bakes.
- "Reference needs Wear OS 6" → **accepted**; duplicate the expression if the validator target is older.

## 14. Verification log

Read: brief.md; v4 face.js, celestial.js, tokens.js, DESIGN-SYSTEM.md, preview-active.png, preview-ambient.png; the on-watch watchface.xml (outer ring r 216, `Variant` fractions, `hh:mm`/`ss` TimeTexts in production, `[SECOND] % 2` cursor). Fetched: WFF arithmetic-expression (function list incl. `asin`, `fract`, `rad`; `%` on floats; `floor` → Float, `round` → Integer), TimeText (documented formats `hh:mm:ss`, `h:mm`, `hh_10`, `hh_1`, `m`, `mm_10`, `mm_1`, `ss`, `ss_10`, `ss_1`; `hh`/`mm` not listed), Gyro (Wear OS 4; `x y scaleX scaleY angle alpha` expressions; units unstated), Upper (Wear OS 4). Computed (`scratchpad/debate/_v2_check.cjs` against `ghrepo/kw/dragon-data.js`, 977 outline samples): dragon reach for nine frames; Y and L* for 33 hexes and five WCAG pairs; Seoul horizon points for a r 195 limb at 1.667 px/deg and the above/below test for 18 layout points; LST/SKY/SUN/LAM/DEC/altitude/sunrise/sunset and the Regulus position at the sample moment; text corner radii for every text element; cage transit times; AOD area; bitmap memory. Not verified: bezel overlap beyond r 216, Gyro feel and units on the SM-R965N, Samsung's handling of `tintColor` Variants and ambient BitmapFonts, offload of a rotating ambient bitmap, validator acceptance of the `controls` literal, real-watch brightness.
