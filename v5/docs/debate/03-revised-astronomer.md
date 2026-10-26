# KALIWATCH v5 "Seoul Planisphere" — proposal v2 (astronomer / planetarium-engineer seat)

Design space 450 x 450, centre (225,225), radius 225. Target Galaxy Watch6 Classic 480 x 480 round (declared sizes stay in 450 space; every bitmap is baked at 480/450 = 1.0667x with 2x supersampling so the renderer scales 1:1).

## 0. Thesis, revised in one paragraph

v1 had the right skeleton and the wrong skin: the critics proved with luminance arithmetic that every "material" I named sat between 0.2 % and 1.1 % and that both shadows fell onto black, that my dragon bbox was guessed wrong by 34 px, that the in-window sun duplicated the sun pointer and parked behind the prompt every winter noon, and that the Active -> AOD timing I wrote cannot be authored in WFF. All of that is accepted and fixed below. What stays is the thing none of them refuted: a real Seoul sky as one rigid disc turning about one pixel once per sidereal day, under a machined dome, under a smoked-glass time plate, under the official Kali dragon. v2 changes four things of substance. (1) The sky is rescaled to 1.8 px/deg with the pole at (225,120) so the aperture's south edge *is* the Seoul horizon (altitude 0.8 deg): the moon now rises and sets behind the dome wall for real. (2) The sun leaves the window: it is the gold pointer on the flange, as on the Galaxia, and daylight is one tinted ellipse driven by solar altitude. (3) Every level gets a value and an edge that survive a 40 mm OLED: wall highlight 36 %, rim lights 23 % at 2 px, a 2.8 % horizon glow and a 5.4 % Milky Way for shadows to fall on, a 55 % glass plate with a phosphor sheen. (4) Depth is made visible at a human rate without adding a loop: the dragon now casts a baked shadow across the flange rings, so the seconds marker goes lit -> shadowed -> hidden -> shadowed -> lit every minute, and the moon is the slow bright object that slides behind the glass, the wall and the dragon's coil over an evening. Six time-scales, three materials, three occlusion chains, nothing decorative that moves.

## 1. The sky: projection, orientation, window

- **Projection:** north-polar azimuthal equidistant, r = s * (90 - dec). Unchanged: it is the only projection in which the whole sky is a rigid rotation about one pixel, i.e. one `Transform target="angle"` on one bitmap.
- **Scale s = 1.8 px/deg** (was 2.0). Big Dipper (Dubhe-Alkaid 25.7 deg) 46 px, Cassiopeia's W 23 px, Orion 33 px tall, Vega-Altair 61 px. Legible at 40 mm; the 10 % loss buys the whole southern sky.
- **Pole P = (225,120)** (was (225,138)). Polaris (dec 89.26) is 1.3 px from P. Zenith for 37.57 N is 52.43 deg * 1.8 = 94 px below P = **(225,214)**: under the glass plate, between the date and the hour digits. The time sits on the zenith.
- **Orientation:** planisphere convention, north horizon up, east on the LEFT, west on the RIGHT, disc turning **counter-clockwise** 360 deg per 23 h 56 m 04.09 s (0.25068 deg/min; 0.66 px/min at r 150). Image convention at A_v = 0: RA 0 h at 6 o'clock from P (toward the zenith), RA increasing clockwise, RA 6 h at 9 o'clock.
- **Window (aperture):** circle centre (225,225), r 150, concentric with the dial (unchanged). Recomputed window-edge altitudes by azimuth (my script, `calc/v2astro/sky_v2.py`):

  | azimuth | N | NE | E | SE | **S** | SW | W | NW |
  |---|---|---|---|---|---|---|---|---|
  | edge altitude, v1 (s 2.0, P 138) | 6.1 | 11.8 | 22.8 | 27.2 | 24.0 | 27.2 | 22.8 | 11.8 |
  | edge altitude, **v2 (s 1.8, P 120)** | 12.6 | 15.7 | 20.1 | 16.3 | **0.8** | 16.3 | 20.1 | 15.7 |

  The south edge is the horizon to within 0.8 deg; nothing below the horizon is ever inside the window, so no ground band needs baking. Hours per day a body is inside the window: dec -25 (winter full moon, Antares, Fomalhaut) **5.8 h** (v1: 2.5 h), dec 0 8.6 h (7.5), dec +25 11.3 h (11.4). The north edge at 12.6 deg sits under the dragon anyway.
- **Star disc bitmap:** 528 x 528 px (r 264) centred on P, placed at x = -39, y = -144 in 450 space (baked 563 px). The farthest window point from P is the window bottom at 255 px, so the disc has 9 px of margin under the wall.

Sidereal time for Seoul (UTC+9 hardcoded; the face already hardcodes 37.57 N / 126.98 E):

```
dL  = ([YEAR]-2026)*365 + floor(([YEAR]-2025)/4) + ([DAY_OF_YEAR]-1) + [HOUR_0_23_MINUTE]/24   // local days since 2026-01-01 00:00 KST
dU  = dL - 0.375                                                                            // UT days
LST = (227.640859 + 360.98564736629*dU) % 360        // 100.660859 (GMST 2026-01-01 00:00 UT, verified exact vs full IAU82) + 126.98
A_v = ((360 - LST) % 360 + 360) % 360                // vault angle, WFF clockwise degrees; double-wrapped because WFF float % keeps the dividend's sign and dU < 0 before 2026
```
Precision, restated honestly: `HOUR_0_23_MINUTE` carries no seconds, so LST is exact to the minute (<= 0.25 deg = 0.65 px at r 150); float32 adds <= 0.03 deg through 2027 (largest operand 2.6e5). Checks: 2026-10-25 10:08:24 KST -> LST 177.42 (true 177.52), A_v 182.58; 19:31:08 KST -> LST 318.56 (true 318.59), A_v 41.44; 2026-12-21 22:00 -> 52.09 (true 52.09); 2026-06-21 23:00 -> 246.76 (true 246.76).

## 2. Layer stack, back to front

| z | layer | what it shows | time-scale | geometry (450 space) | material / value (WCAG relative luminance) | Active | AOD |
|---|---|---|---|---|---|---|---|
| Z0 | base | black lacquer | none | r 225 | #000000 | on | on |
| Z1 | **vault** (star disc) | real Seoul sky: ~800 stars to V 4.5 (dec >= -52.5), Milky Way grisaille, 23 constellation figures, Draco in phosphor, ecliptic with 12 zodiac ticks | **sidereal day**, rotates about P | 528 px PNG at (-39,-144), pivot .5/.5 | fired enamel: base #0E151B (0.71 %); Milky Way #1A252D / #243239 / #324450 (1.7 / 3.0 / 5.4 %); stars #C9D6D2 (65 %) | full | `vault_aod.png`: 72 stars <= V 2.5 as 1.5 px #5E6E68 dots + Draco lines 1.2 px #4D633F; same rotation (the one dynamic AOD layer) |
| Z2 | **moon** | lunar disc at its real position, 8 phase frames, dark limb, 6 px glow; the slow bright object | **lunar day** (position) + **synodic month** (phase) | 26 x 26 PNG x8, centre (225 + dM sin HM, 120 + dM cos HM) | lit #D9E2DE (75 %), limb #1A2024, glow #D9E2DE @30 % | on | hidden |
| Z3 | **daylight** | the window greys by day, black by night | **apparent solar day** (altitude) | PartDraw Ellipse centre (225,225) r 150 | fill #6C8294, alpha 0..64 by solar altitude; full day over the vault = #263039 (2.8 %) | on | hidden |
| Z4 | **dome** (horizon glow + wall + shoulder + flange rings) | the fixed instrument body with one directional light from 315 deg | none | 450 PNG; aperture r 150; wall 150-154; shoulder 154-164; F1 164-182; solar groove 182-192; F2 192-212; F3 212-225 | see section 3.2 for every value; wall lit arc #8EA998 (36 %), rim lights #6F8979 (23 %) | full | vectors: 1 px rim #3A4A3F at r 150 + 12 ticks #7F9472 r 204-210 |
| Z5 | **F1 solar instruments** | gold sun pointer in its own groove + seasonal day arc | **apparent solar day** (pointer, CCW); **annual** (arc length, pointer vs zodiac ticks) | pointer 9 px disc + 8 rays to r 8 + 2 px #000 ring + 4 px glow, at r 187; arc r 187, 1.5 px | #E2B15A (48 %), arc @70 % | on | hidden |
| Z6 | **F2 orbit** | seconds trail + marker, origin fixed at 12, read against 60 ticks; the v4 signature | **second** | track r 198; trail 1.7 px; marker 3.3 px + 5 px tick to r 206.5 | #A6F46A @72 % on #17291D | on | 4 static arcs 48 deg at 12/102/192/282 deg, r 198, #4D633F 1.25 px |
| Z7 | **plate shadow** | the plate's height over the sky and over the lit wall | none (lifts on wake) | 258 x 152 PNG at (99,170): offset (+3,+4), blur 8 | #000 @80 %; on the horizon glow 2.8 % -> 0.29 % (9.6x step) | on | hidden |
| Z8 | **plate** (smoked sapphire) | the information slab; tier A/B stars show through at 11 % | none | 242 x 136 PNG at (104,166), corner 12 | #000 @55 %; phosphor sheen #A6F46A 6 % -> 0 diagonal from the top-left over 140 px; top/left edge 1.5 px #6F8979; bottom/right 1 px #000 | on | hidden |
| Z9 | **text** | date, HH:MM, colon, BAT/STP values + labels, gauges | **civil minute**; battery; steps | section 4 | Roboto Mono; digits #EFF8EC (92 %), colon #A6F46A | on | `Outline` digits #11200F fill / #91AD80 0.7 px; date + BAT #7F9472 |
| Z10 | **crystal etch** | pole reticle (the terminal cursor on the celestial pole), `37.57N 126.98E`, `SOLAR`, the prompt on the bezel | none | reticle 5 px cross at (225,120) 1 px; inscription r 159; SOLAR r 176.5; prompt r 218 | #A6F46A reticle; #3E4C44 inscription; #5A6A5E SOLAR; prompt #9BAB9C + INFINITY #A6F46A | on | reticle #4D633F; INFINITY #7F9472 only |
| Z10b | **dragon shadow** | the dragon's cast shadow on the flange rings and the sky; the seconds marker and the sun pointer pass under it | none | 200 x 143 PNG at (131,22): offset (+4,+6), blur 6 | #000 @55 % | on | hidden |
| Z11 | **dragon** (nearest) | official Kali logomark, path unchanged, body arching over the pole, tail hanging beside it | none | frame (135,18) 180 x 123; **measured ink x 147-305, y 17-133** | #A6F46A @96 %, 1 px rim light #D8FFB0, 6 px glow @25 % | on | #718D61 @85 %, no glow |

Six time-scales (second, civil minute, apparent solar day, sidereal day, lunar day + synodic month, annual). Three materials (fired enamel, machined metal, smoked glass; the dragon is emissive phosphor). Three occlusion chains, each now visible: dragon > dragon shadow > marker/pointer/sky; plate > plate shadow > moon/vault/lit wall; wall > inner shadow > vault, with the moon rising and setting behind the wall.

### ASCII layer diagram (side view, light from upper-left 315 deg)

```
 viewer
   |
   v
 Z11  dragon crest ~~~~~ over the pole, 486 px of ink inside the aperture ~~~~~      phosphor, emissive
 Z10b dragon shadow  ::::::: on F1/F2/F3 and the sky, +4,+6 blur 6 ::::::            marker crosses it each minute
 Z10  crystal etch   + reticle on the pole   37.57N 126.98E   SOLAR   kali@orbit:~$ INFINITY (bezel)
 Z9   text           25 OCT / SUN    10:08    BAT 78%   STP 6,240                     paper / phosphor
 Z8   plate   [=========== smoked glass 55 %, phosphor sheen, lit top-left edge ===========]
 Z7   shadow      ::::::::::::: +3,+4 blur 8, onto the horizon glow and the lit wall ::::::
 Z6   F2 ring  ( seconds cage, origin 12, 60 ticks )                                   phosphor on black metal
 Z5   F1 ring  ( gold sun pointer in its groove, day arc, 24-h scale, SOLAR )          gold on dark metal, 23 % highlight edge
 Z4   dome  ######|  wall: lit lower-right 36 %, dark upper-left; inner shadow 12 px |######  domed, lit from 315
 Z3   daylight       (  #6C8294 alpha 0..64 by sun altitude  )
 Z2   moon                  O  26 px, 8 phases, slides behind plate / wall / coil        grisaille white
 Z1   vault   . * .  ' . Milky Way 5 % . DRACO . horizon glow 2.8 % at the south .  (CCW 1/sidereal day, about P)
 Z0   base    ______________________ black lacquer ______________________

 top view (450 space):
      dragon ink y17-133 (x147-305)        P (225,120) = Polaris + reticle; 34 px clear under the body
   aperture r150 ------------------------+------------------ zenith (225,214) under the plate
      plate 242x136  x104-346 y166-302    date 186 / HH:MM 252 / BAT STP 290 / gauges 296
      southern band y 310-375 open (horizon at the bottom edge)
      wall 150-154 | shoulder 154-164 (coords) | F1 164-182 (ticks, 06 12 18, SOLAR) | groove 182-192 (sun) | F2 192-212 (seconds) | F3 212-225 (prompt, rim light)
```

## 3. Materials: the value structure (the fix for FATAL 1 of all three critics)

### 3.1 Rules (adopted from critic 1, verified against every hex below)
1. Adjacent depth levels differ by >= 4x in relative luminance, or are separated by a rim-light edge >= 20 % luminance and >= 2 px wide.
2. Every shadow falls on a surface of >= 2 % luminance.
3. Every "material" has a lit side and a dark side from the same light (315 deg).
4. The glass plate is the *lighter* object where it meets the sky (it reflects).
5. Build at these values first, then reduce on the device; never start subtle.

### 3.2 The values

| level | element | hex | lum | relation to its neighbour |
|---|---|---|---|---|
| vault | base | #0E151B | 0.71 % | the darkest surface; still 3.5x the v1 base (0.20 %) |
| vault | Milky Way outer / band / core | #1A252D / #243239 / #324450 | 1.7 / 3.0 / 5.4 % | core 7.6x the base; soft edges 8-14 px |
| vault | stars (A/B/C) | #C9D6D2 | 65 % | through the 55 % plate: #5A605E, 11.3 % (visible) |
| dome | horizon glow, radial from (225,375) over 90 px, clipped to the aperture | #243039 -> 0 | 2.8 % | the surface the plate shadow falls on (2.8 % -> 0.29 %) |
| dome | inner shadow, 12 px, centred 315 deg, cosine to 0 at 45/225 | #000 70 % -> 0 | - | falls on the glow / Milky Way, not on black |
| dome | wall r 150-154, lit arc centred 135 deg, cosine over 45-225 | #8EA998 peak -> #4C5F54 at the ends | 36 % -> 10 % | 51x the vault base; the upper-left wall is #000 |
| dome | shoulder r 154-164, directional | #2E3B35 at 315 -> #0E1411 at 135 | 4.0 -> 0.63 % | separated from F1 by the F1 highlight edge |
| dome | F1 ring r 164-182 | #212B25 | 2.2 % | highlight 2 px #6F8979 (23 %) at r 164.5 |
| dome | solar groove r 182-192 | #000 | 0 | the gold pointer and arc live here |
| dome | F2 ring r 192-212 (sunken, flat tone, no guilloche) | #141B17 | 1.0 % | ticks #34543C 7.4 %, majors #526650 12 % |
| dome | F3 bezel r 212-225 | #263029 | 2.8 % | 1 px #000 line at r 212; rim light 1.5 px #6F8979 (23 %) at r 224 |
| dome | all dome tones | modulated x1.35 at 315 deg, x0.65 at 135 deg, cosine | | one light, one domed body |
| glass | plate | #000 @55 % | sky x0.45 | sheen #A6F46A 6 % -> 0 from the top-left; edge 1.5 px #6F8979 top/left; 1 px #000 bottom/right |
| glass | plate shadow | #000 @80 %, +3,+4, blur 8 | | reaches r 151 at 135 deg: crosses the lit wall |
| dragon | body / rim light / glow | #A6F46A / #D8FFB0 / #A6F46A 25 % | 74 % | nearest; its shadow #000 55 % on the rings |
| daylight | ellipse fill | #6C8294 | 21 % | alpha <= 64: window = #263039 (2.8 %) at full day |

Digit contrast worst case: digits #EFF8EC (92 %) on the plate over a full-day window (0.45 x 2.8 % = 1.3 %) = 15:1; over the Milky Way core through the plate (1.3 %) = 15:1; over a tier A star through the plate (11.3 % on a 3 px spot) = 5.6:1. Readable in < 1 s in every state.

Proof required before any reduction: render the Active PNG, downsample to 150 px (the 40 mm equivalent), and confirm the bevel, the plate shadow, the plate edge and the dragon shadow are each identifiable in the thumbnail.

## 4. Composition: exact positions

Unchanged and non-negotiable: HH:MM hours centred x 166, minutes x 284, baseline y 252, Roboto Mono 78 / 600; colon x 225 baseline 248 phosphor. Never moves, never scales. Nothing is ever in front of the digits (dragon ink ends at y 133; plate begins at y 166).

| element | position | size / colour |
|---|---|---|
| dial clip | centre (225,225) r 225 | |
| vault pole P | (225,120) | bitmap 528 at (-39,-144); Polaris 1.3 px from P |
| pole reticle | (225,120), 5 px cross, 1 px | #A6F46A; AOD #4D633F |
| zenith | (225,214) | under the plate |
| aperture | centre (225,225) r 150; wall 150-154 | |
| dragon frame | (135,18) 180 x 123, official path 1.0x | ink x 147-305, y 17-133; 1,586 px, 486 inside the aperture; nearest ink to P 31.5 px at (238,91); pole column clear to y 86 (34 px); tail tip (298,133) |
| dragon shadow | PNG 200 x 143 at (131,22) | #000 @55 %, blur 6 |
| plate | x 104-346, y 166-302, corner 12 | 242 x 136; corners at r 134.6 (top) / 143.4 (bottom); 46.6 % of the aperture |
| date | centre x 225, baseline 186, 17 px #9BAB9C | `25 OCT / SUN`; 8 px above the plate top |
| HH:MM | 166 / 284, baseline 252, 78 px #EFF8EC | |
| telemetry row | pairs centred x 166 and x 284, baseline 290 | `BAT` 12 px #9BAB9C + `78%` 22 px #EFF8EC; `STP` 12 px + `6,240` 22 px (`12,345` = 107 px, fits); BAT <= 15 -> #F3C479 |
| gauges | y 296, 2 px, 60 px, centred x 166 / x 284 | #A6F46A on #17291D |
| southern band | y 310-375, open sky to the horizon | |
| inscription | TextCircular r 159 (on the shoulder), 205-235 deg, 10 px #3E4C44 | `37.57N 126.98E` (30 deg of arc) |
| F1 24-h scale | 24 ticks r 167-172 (majors 00/06/12/18 r 166-173, 1.6 px #526650; minors 1 px #34543C); numerals `06` at 9 o'clock, `12` at 6, `18` at 3, 11 px #5A6A5E centred r 176.5; `00` omitted (dragon); `SOLAR` 10 px #5A6A5E TextCircular r 176.5, 150-166 deg | apparent solar, 00 top, CCW |
| solar groove | r 182-192 #000: day arc r 187 1.5 px #E2B15A @70 %, 180-H0 -> 180+H0 CW; pointer 16 px sprite at r 187 on a 392 px carrier | pointer passes under the dragon for 19 deg = 76 min around solar midnight (measured) |
| F2 track | circle r 198 #17291D; trail r 198; marker r 198 + tick to r 206.5; 60 ticks r 203-210 (majors 201-210) | marker under the dragon 21 deg = 3.5 s per minute, under its shadow ~1 s each side (measured) |
| F3 bezel | 1 px #000 at r 212; prompt TextCircular r 218, 10 px, 161-199 deg, `kali@orbit:~$ ` #9BAB9C + `INFINITY` #A6F46A; rim light 1.5 px #6F8979 at r 224 | AOD: `INFINITY` only, #7F9472 |

Safe area: every information glyph box is inside r <= 150 (plate corners r <= 143.4). The dome inscriptions, SOLAR and the prompt ride the rings by design and are decoration (10-11 px).

Dropped from v1: the in-window sun (Z2), `SEC nn`, the 14 px telemetry row, IAU labels, zodiac glyphs, celestial equator, guilloche, `SIDEREAL hh:mm`, the straight prompt at y 364.

## 5. What is on the vault

- **Catalogue:** Yale BSC / Hipparcos subset, V <= 4.5, dec >= -52.5 (the full Seoul horizon): ~800 stars, of which ~250 (tiers A-C) are visible objects and ~550 (tier D) are texture. Tiers at 450 px: A (V <= 1.5, 17 stars) 3.0 px + 7 px halo @30 %; B (<= 2.5, ~55) 2.2 px; C (<= 3.5, ~170) 1.6 px; D (<= 4.5) 1.1 px @45 %. Nothing fainter. Minimum stroke anywhere on the vault: 1.0 px at 480.
- **Figures (1.0 px #3F4F4B @60 %):** Ursa Major, Ursa Minor, **Draco (14 stars, 1.2 px #A6F46A @55 %; Eltanin + Rastaban 2.6 px phosphor)**, Cassiopeia, Cepheus, Perseus, Auriga, Lyra, Cygnus, Aquila, Bootes, Corona Borealis, Hercules keystone, Leo, Gemini, Orion + belt, Taurus + Pleiades smudge, Canis Major, Scorpius (now with its tail: Shaula dec -37 is inside the window), Sagittarius teapot, Pegasus + Andromeda, Virgo, Canis Minor. 23 figures. Draco in phosphor under the Kali dragon is the bridge to the JLC Dragon edition that copies nothing.
- **No labels, no equator** (cut per critics). **Ecliptic:** 1.0 px dashed #7A6A3E (gold at 45 %, 15 % lum) with **12 zodiac ticks** 3 px at longitudes 0, 30, ... 330, no glyphs. The sun pointer's direction from the pole crosses the ecliptic at the sun's longitude: the zodiac month, read exactly as the Galaxia reads it (pointer against the sidereal disc). The moon rides within 5 deg of this line.
- **Milky Way:** three fired tones (3.2), Great Rift as the base tone, Cygnus-Scutum-Sagittarius core and the Perseus arm.
- **Sun (no sprite):** apparent position drives the pointer and the daylight only. `decS = -23.44*cos(rad(0.98630*(N+10)))`; `EoT = 9.87*sin(2B) - 7.53*cos(B) - 1.5*sin(B)`, `B = rad(0.98901*(N-81))` (minutes); `hs = h - 0.53467 + EoT/60` (Seoul is 32.1 min west of the KST meridian); `HS = 15*(hs-12)`; `H0 = deg(acos(clamp(-tan(rad(37.57))*tan(rad(decS)),-1,1)))`; `sinAlt = sin(rad(37.57))*sin(rad(decS)) + cos(rad(37.57))*cos(rad(decS))*cos(rad(HS))`; daylight `alpha = clamp(160*(sinAlt + 0.105), 0, 64)` (0 at civil twilight -6 deg, full at +17.6 deg).
- **Moon:** mean longitude + 4 longitude terms + 1 latitude term (critic 3's fix, plus latitude, verified):
  ```
  D   = dU + 9496.5
  Lp  = 218.316 + 13.176396*D ; Mp = 134.963 + 13.064993*D ; M = 357.529 + 0.98560028*D ; Dm = 297.850 + 12.190749*D ; F = 93.272 + 13.229350*D
  lamM = Lp + 6.289*sin(rad(Mp)) - 1.274*sin(rad(Mp-2*Dm)) + 0.658*sin(rad(2*Dm)) - 0.186*sin(rad(M))
  betaM = 5.128*sin(rad(F))
  num = sin(rad(lamM))*0.91748 - tan(rad(betaM))*0.39777 ; den = cos(rad(lamM))
  raM  = deg(atan(num/den)) + (den < 0 ? 180 : 0)
  decM = deg(asin(sin(rad(betaM))*0.91748 + cos(rad(betaM))*0.39777*sin(rad(lamM))))
  HM   = LST - raM ; dM = 1.8*(90-decM) ; x = 225 + dM*sin(rad(HM)) - 13 ; y = 120 + dM*cos(rad(HM)) - 13
  ```
  Verified: 5-term vs 8-term longitude over 2026-2027 daily, max 0.42 deg (0.8 px); elongation at the 2026-10-26 04:12 UT full moon = 180.1 deg; ignoring latitude would cost up to 4.7 deg of declination, so the one latitude term stays. Phase frame from `[MOON_PHASE_TYPE]` (system); it can disagree with the computed position by up to a day near the quarters, which is accepted and documented.
- **Planets:** studio only. Not on the watch in v5.

Verified sample moments (450 space, s 1.8, P (225,120); `*P` = behind the plate):
- **2026-10-25 10:08:24 KST (studio sample, day):** A_v 182.58. Polaris (226,119) on the reticle; Draco's head Eltanin (156,118) / Rastaban (157,126) left of the pole; Kochab (205,140); Capella (303,109); Dipper at upper culmination behind the glass (Dubhe (235,170)*P, Alkaid (189,184)*P); Arcturus (149,222)*P; Regulus (285,247)*P; Spica (151,287)*P. Sun: dec -13.0, alt 31.2, pointer at 212 deg (lower-left, 09:52 solar), day arc 100-260 deg, daylight alpha 64 (full). Moon (age 13.8 d) at alt -43: set, hidden, sprite off-canvas under the dome.
- **2026-10-25 19:31:08 KST (on-watch PREVIEW_TIME):** A_v 41.44. Kochab (253,117); Alkaid (293,93) under the dragon's tail; Draco's head (278,165)/(281,158); Vega (283,191)*P, Deneb (236,200)*P, Altair (277,256)*P: the Summer Triangle behind the glass at 45 %; Mirfak (153,117); Caph (187,160); Fomalhaut (131,314) low in the south-east band (invisible in v1); near-full moon (elong 170) **rising in the east at (96,188), alt 27, inside the window, outside the plate**: correct for the 26 Oct full moon. Sun pointer at 71 deg (upper-right, 19:15 solar), daylight 0.
- **2026-12-21 22:00 KST:** Dipper low in the north-east under the dragon (Dubhe (178,99)); Orion rising, Betelgeuse (136,239)*P, Rigel (146,278)*P; Sirius (80,246) and Procyon (89,190) in the east; Capella (189,191)*P; the moon (age 11, dec +19) exactly on the meridian at alt 71, **(225,248): behind the glass between the digits**, dimmed to 45 %: the depth cue, on schedule.
- **2026-06-21 23:00 KST:** Antares (223,330) and Shaula (159,339) in the southern band, Sagittarius' teapot (116,315) rising: the Milky Way core across the open band under the plate; Vega (176,198)*P; the moon (age 6.5) setting at alt 17 in the west, (375,175): behind the dome wall.

## 6. Palette

Identity stays: phosphor **#A6F46A** (dragon, colon, seconds, gauges, Draco, reticle, INFINITY, plate sheen). Paper #EFF8EC, quiet #9BAB9C, structure #34543C, track #17291D, warning #F3C479, AOD greens as v4.

Controlled hues, each with one job:
1. **Sun gold #E2B15A** (48 %): the pointer, the day arc, and at 45 % the ecliptic (#7A6A3E). The only warm colour.
2. **Grisaille silver #C9D6D2** (65 %): stars, the moon's lit side; the metal highlights #8EA998 (wall), #6F8979 (rim lights, F1 highlight, plate edge), #D8FFB0 (dragon rim) are this silver tinted toward the phosphor so the dome is black-green metal, not chrome.
3. **Enamel night #0E151B** (0.71 %): vault base; the Milky Way tones are it lifted by the silver; the daylight tint #6C8294 is the same hue at 21 %.

No blue, no purple, no gradient that is not a light falling on a surface.

## 7. Motion

**Real-time (never stop, never perceptible as motion):** vault + vault_aod 0.25068 deg/min CCW (0.66 px/min at r 150; a full lap per sidereal day; a star returns 3 m 56 s earlier each night); sun pointer 0.25 deg/min CCW; day arc length once per day (9.4 h on 21 Dec to 14.6 h on 21 Jun, measured); daylight alpha once per minute; moon 0.5 deg/min (its own lunar day), phase once per day. All driven by `[HOUR_0_23_MINUTE]`, repainted once per minute.

**Each second (Active only):** trail endAngle +6 deg, marker +6 deg. Nothing else repaints. Every minute the marker passes under the dragon's shadow (dims), under the dragon (hidden 3.5 s), out through the shadow (dims), lit: the depth stack is demonstrated 1,440 times a day at a rate the eye can see, without one decorative loop.

**Wake / sleep: one symmetric timeline, in fractions of the system transition (WFF owns the length; the studio visualises it at 360 ms wake / 180 ms sleep but plays the same fractions both ways). Order is back-to-front on wake, mirrored on sleep. Curve cubic-bezier(.22,1,.36,1) via `controls`.**

| startOffset | duration | layer | property |
|---|---|---|---|
| 0.00 | 0.39 | Z1 vault | `vault_aod` alpha 255 -> 0 and `vault_active` 0 -> 255 (both share A_v; no jump). The Milky Way fires. |
| 0.11 | 0.50 | Z4 dome | `dome_active` alpha 0 -> 255; `dome_aod` vectors 255 -> 0. Scale 1.03 -> 1.00 **only if** the on-device test shows the Samsung runtime animates `scaleX/scaleY`; otherwise cut (it would move an edge nobody sees). |
| 0.17 | 0.50 | Z2 / Z3 | moon alpha 0 -> 255; daylight alpha 0 -> computed |
| 0.22 | 0.61 | Z7 / Z8 | plate alpha 0 -> 255; shadow alpha 0 -> 204 and y 170 -> 174: the plate lifts off the sky while the digits stay put |
| 0.22 | 0.61 | Z9 | ambient `DigitalClock` (Outline) alpha 255 -> 0, interactive clock 0 -> 255, same boxes; telemetry row in with the v4 80 ms-equivalent delay (startOffset 0.28) |
| 0.00 | 1.00 | Z6 orbit | the v4 signature: active orbit group angle -14 -> 0 and alpha 0 -> 255; AOD arcs 255 -> 0 over 0.00/0.61 |
| 0.44 | 0.56 | Z5 flange | pointer + day arc alpha 0 -> 255 |
| 0.50 | 0.40 | Z10b | dragon shadow alpha 0 -> 140 |
| 0.56 | 0.44 | Z11 dragon | `dragon_aod` 217 -> 0, `dragon_active` (glow + rim baked) 0 -> 245. The nearest layer lights last. |

startOffset + duration <= 1 everywhere. Sleep is the same table played backwards by the device: dragon dims first, vault last. **Reduced motion (manual or OS):** every state applied instantly; the sidereal, solar and lunar motions keep running (they are the time, not animation). No loops, no twinkle.

## 8. AOD

Remains: `vault_aod` (72 dots + Draco dim) rotating; pole reticle #4D633F; rim circle 1 px #3A4A3F (vector) + 12 ticks #7F9472 (vector); 4 **static** arcs at r 198 (v4 angles); `Outline` HH:MM; date; `BAT 78%` row; `INFINITY` on the bezel; dim dragon. Gone in AOD: moon, daylight, plate, shadows, pointer, arc, trail, Milky Way, inscription, SOLAR, prompt prefix.

**Lit pixels:** critic 2 rasterised v1's AOD at native 450 px with the repo font and the official path: 8.66 % (any non-black), 11.6-11.9 % by the repo's 900 -> 450 method. v2 removes the AOD moon (-0.23 %) and adds the reticle (9 px, +0.01 %) and 3 % longer arcs; estimate **8.5 % native / ~11.8 % repo method**, under 15 % by both. To be re-measured on the raster.

**Burn-in:** static elements above 20 % luminance are the same as v4 (outline strokes 37 %, dim dragon 23 % over 1,586 px, 12 ticks 27 % over ~100 px); the reticle is 11 %. Everything else bright drifts (72 star dots: 0.4-1.1 px/min, no pixel holds a lit dot for more than ~3 min) or is dim. The system's AOD pixel shift covers the digits; the dragon's wing tip at y 17 keeps >= 7 px from the clip so the shift cannot push ink off the disc.

**Offload model:** per critic 3, the evaluator's `--apply-v1-offload-limitations` allows two dynamic elements in ambient; v2 uses exactly two: the rotating `vault_aod` (detected as an angle-driven analog layer) and the `DigitalClock`. Arcs, ticks, reticle, dragon are static. Verify with a 30-minute AOD soak on the SM-R965N (visual; screencap is black in doze).

## 9. WFF v4 mapping, layer by layer

Shared scalars: WFF has no global named expressions (they exist only inside `Condition`). Each shared value is hosted on an always-visible 1 x 1 transparent `PartDraw` carrier via `Transform` on a transformable attribute plus `Reference` (Wear OS 6 / WFF v4; the project already uses `Reference source="pivotX"` for its battery colour), read elsewhere as `[REFERENCE.name]`. Carriers must never be hidden in ambient, because `Reference.defaultValue` is served while the parent is not visible. Eleven carriers: `LST`, `Av`, `HS`, `hsAng` (pointer angle), `H0`, `dayA` (daylight alpha), `lamM`, `betaM`, `raM`, `decM`, `HM` (`dM` derives in place). Expressions as written in sections 1 and 5; every operand < 3e5.

| layer | WFF v4 construction |
|---|---|
| Z0 | `<Scene backgroundColor="#ff000000">` |
| Z1 vault | `PartImage x=-39 y=-144 width=528 height=528 pivotX=.5 pivotY=.5` + `<Image resource="vault_active"/>` + `<Transform target="angle" value="[REFERENCE.Av]"/>` + `<Variant mode="AMBIENT" target="alpha" value="0" startOffset="0" duration="0.39" interpolation="..."/>`. Second `PartImage` `vault_aod`, `alpha="0"`, `Variant AMBIENT alpha 255`, same Transform. Pure bitmap rotation; nothing is re-projected on the watch. Negative x/y are `xs:integer` in `geometricAttributes.xsd` (critic 3); still a validator test item. |
| Z2 moon | `<Condition>` on `[MOON_PHASE_TYPE]` (0-7) with 8 `<Compare>` branches, each a 26 x 26 `PartImage moon_k` with `Transform x = 225 + 1.8*(90-[REFERENCE.decM])*sin(rad([REFERENCE.HM])) - 13`, `y = 120 + ... - 13`; `Variant AMBIENT alpha 0`. Below the horizon it is off-window and covered by Z4 (true for every azimuth now that the window edge is at or above the horizon). |
| Z3 daylight | `PartDraw` > `Ellipse x=75 y=75 width=300 height=300` + `Fill color="#ff6C8294"` + `Transform target="alpha" value="[REFERENCE.dayA]"`; `Variant AMBIENT alpha 0`. |
| Z4 dome | `PartImage dome_active 450x450` (everything in 3.2 baked, including the horizon glow and the inner shadow) crossfaded by `Variant AMBIENT alpha` (0.11/0.50); optional `Variant AMBIENT target="scaleX"/"scaleY" value="1.03"`. **AOD dome as vectors:** `PartDraw` with `Ellipse` stroke #3A4A3F 1 px at r 150 and 12 `Line`s r 204-210, `alpha 0` -> `Variant AMBIENT 255` (no opaque 450^2 bitmap in ambient). |
| Z5 solar | day arc: `PartDraw` > `Arc centerX=225 centerY=225 width=374 height=374 direction=CLOCKWISE` + `Stroke color="#b3E2B15A" thickness="1.5" cap="ROUND"` + `Transform startAngle = 180 - [REFERENCE.H0]`, `endAngle = 180 + [REFERENCE.H0]` (always within 0-360). Pointer: 392 x 392 carrier `PartImage` with the 16 px gold sprite at the top, pivot .5/.5, `Transform angle = [REFERENCE.hsAng]` where `hsAng = ((360 - 15*hs) % 360 + 360) % 360`. `Variant AMBIENT alpha 0`. |
| Z6 orbit | `Group orbit_active` pivot .5/.5 with `Variant AMBIENT target="angle" value="-14"` and `alpha 0`, duration 1.0: inside, `Arc` r 198 (396 x 396) `startAngle 0`, `endAngle = 6*[SECOND]` (never exceeds 360), `Stroke #b8A6F46A 1.7`; marker: 414 x 414 carrier `PartImage`, `angle = 6*[SECOND]`; 60 ticks baked into `dome_active`. AOD arcs: four static `Arc`s at 12/102/192/282 (+48), `Stroke #ff4D633F 1.25`, `alpha 0` -> `Variant AMBIENT 255`. |
| Z7 shadow | `PartImage plate_shadow 258x152 at (99,170)`; `Variant AMBIENT alpha 0` and `Variant AMBIENT target="y" value="166"` (the +4 px lift plays on return). |
| Z8 plate | `PartImage plate_glass 242x136 at (104,166)` (55 % black, sheen and edges baked as RGBA); `Variant AMBIENT alpha 0`. |
| Z9 text | Two `DigitalClock` groups at identical boxes as the existing `watchface.xml` does: interactive = `TimeText` hh (box centred 166), mm (284), `PartText` colon at 225, Roboto Mono 78 BOLD #EFF8EC / #A6F46A; ambient = same boxes, `<Font family="roboto_mono" size="78" weight="BOLD" color="#ff11200F"><Outline color="#ff91AD80" width="0.7"/></Font>` (**`Outline` exists: Font child, Wear OS 4**; no Light-weight substitute). Groups crossfade by `Variant AMBIENT alpha` 0.22/0.61. Date `PartText` Template `[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]`. Telemetry: two `PartText`s with two `Font` runs each (12 px label, 22 px value), `[BATTERY_PERCENT]`, `numberFormat("#,###",[STEP_COUNT])`; gauges `Rectangle` + `Transform width = 60*[BATTERY_PERCENT]/100` and `60*clamp([STEP_COUNT]/[STEP_GOAL],0,1)`; low battery via `Condition [BATTERY_PERCENT] <= 15`. |
| Z10 etch | reticle: `PartDraw` two 5 px `Line`s at (225,120), `Variant AMBIENT` colour via a second dim PartDraw crossfade; `TextCircular` x3 (inscription r 159, SOLAR r 176.5, prompt r 218 with two `Font` runs); prompt prefix `Variant AMBIENT alpha 0`, `INFINITY` stays (dim via crossfade). |
| Z10b | `PartImage dragon_shadow 200x143 at (131,22)`; `Variant AMBIENT alpha 0` (0.50/0.40). |
| Z11 dragon | `PartImage dragon_active 180x123 at (135,18)` (rendered from the untouched official path with rim light + glow baked); `Variant AMBIENT alpha 0` (0.56/0.44); `PartImage dragon_aod` (#718D61) `alpha 0` -> `Variant AMBIENT 217`. |

Resource budget (ARGB8888, baked at 1.0667x): vault 563^2 x2 = 2.4 MB; dome 480^2 = 0.9 MB; plate + shadow 0.3 MB; carriers 418^2 + 422^2 + 442^2 = 2.1 MB (export as 8-bit alpha where the toolchain allows); moon 8 x 28^2, dragon x3 ~0.3 MB. ~6 MB interactive (limit 100 MB); ambient set = vault_aod + dragon_aod + fonts ~ 1.5 MB plus the evaluator's per-layer model ~ 2.7 MB (limit 10 MB). Memory is not a risk; the evaluator still runs in the gate.

Studio side: `celestial.js` is replaced by `sky.js` (catalogue JSON, line list, Milky Way polygons, the sun/moon/LST routines above, byte-identical constants) rendering the rotating SVG group; `build-assets.cjs` bakes the same scene to the PNG layers listed here. **Parity rules (critic 3 fix 12):** the studio renders at 480 with the baked PNG layers, one symmetric fractional timeline, AOD with only the vault and the clock changing, no sub-pixel strokes, no AOD moon.

## 10. Why it is not flat (v2)

v1's stack was real on paper and invisible on glass. v2 is a stack you can see into because each level now has a value and an edge: the vault is a lit enamel surface (0.7 % base, 5 % Milky Way, 2.8 % skyglow at the horizon) with silver stars; the dome's bevelled hole has a 36 % lit lip on the lower-right and a 12 px shadow falling onto that enamel on the upper-left; the flange rings are separated by 23 % rim lights and a black solar groove; the glass plate is lighter than the sky it covers (phosphor sheen, 23 % lit edge) and throws an 80 % shadow onto the skyglow and across the lit lip; the dragon throws its own shadow across three rings. And the stack now proves itself at every rate the eye has: every minute the seconds marker goes into the dragon's shadow, behind the dragon, out again; every evening the moon climbs out from behind the dome wall, slides under the glass at the zenith and dims to half, and sets behind the far wall; every day the gold sun lights the window grey and makes its counter-clockwise lap on the flange while the day arc beside it stretches with the season; every night the real sky above Seoul has turned a degree further under the Kali dragon, Draco creeping around the phosphor cursor that marks the pole. The one memorable image is the dragon arching over the celestial pole with Draco beneath it and the true sky turning under both; everything else is an instrument that serves it. Nothing moves that is not time.

## 11. Risks (revised)

1. **Sub-pixel stars on the PenTile panel.** Tier C 1.6 px and tier D 1.1 px may vanish at 40 mm; the look then rests on ~70 A/B stars + the Milky Way. Mitigation: bake at 1.0667x with 2x supersampling, test on device, raise C to 1.8 px if needed; never add fainter stars.
2. **The values are now loud enough to be ugly.** A 36 % wall arc and 23 % rim lights are visible objects; if they read as chrome, reduce them *after* the 150 px thumbnail test passes, by no more than 30 %.
3. **Expression precision and the minute truncation.** LST exact to <= 0.25 deg (no seconds source), float32 <= 0.03 deg. Verify the engine's numeric type once on device.
4. **Moon:** <= 0.5 deg position error, 8 phase frames, system phase vs computed position may differ by a day near the quarters. An instrument, not an ephemeris.
5. **Dragon over the pole.** Measured, not estimated: 34 px clear in the pole column, tail 73 px to the right. If the user wants more enclosure, scale the official path 0.9x and move P to (225,118) (critic 1's measured option); never move P without re-running the window table.
6. **The plate hides the zenith band.** Dec +27 to +48 (Vega, Deneb, Capella, the Dipper at culmination) always transits under the glass at 45 %. Physics (the time lives on the zenith); mitigated by the sheen and the 11 % stars through the glass. Fallback if the plate still reads as a lid on device: drop it and bake a 6 px dark halo behind the digits.
7. **Apparent vs civil solar time.** The pointer reads up to 49 min off the digits; labelled `SOLAR` on F1 so it is not filed as a bug.
8. **Transition is the system's.** Fractions survive, milliseconds do not; `scaleX` animation on the Samsung runtime is unverified (the dome settle is conditional).
9. **Reference / Wear OS 6.** If the SM-R965N is not on One UI 8 Watch, `Reference` and `Variant duration/startOffset` are unavailable: duplicate the expressions per element (~12 copies) and accept an instant mode switch.
10. **AOD offload.** Only the vault and the clock may update in offloaded ambient; if the evaluator does not classify the rotating vault as a clock, the AOD star field freezes at the entry angle (acceptable: it is 0.66 px/min) and burn-in protection falls back to the system shift.
11. **Daylight tint vs stars.** Stars stay visible by day (the Galaxia does the same); if it reads as wrong, lower the daytime alpha cap from 64 to 40, never remove the tint.

## 12. Change log vs v1

1. Scale 2.0 -> **1.8 px/deg**; pole (225,138) -> **(225,120)**; zenith (225,243) -> (225,214). The window's south edge is now the horizon (0.8 deg); dec -25 objects visible 5.8 h instead of 2.5 h; Scorpius' tail, the teapot and Fomalhaut enter the window. Vault bitmap 512 -> 528 at (-39,-144).
2. **Z2 in-window sun deleted.** The sun is the F1 pointer only; daylight becomes one altitude-driven ellipse (new Z3).
3. **Value structure rebuilt** (section 3): vault base 0.2 % -> 0.71 %, Milky Way to 5.4 %, horizon glow 2.8 %, wall highlight 7 % -> 36 %, rim lights 3 % -> 23 % at 2 px, plate 72 % -> 55 % with sheen and lit edge, plate shadow 60 % -> 80 %, inner shadow 70 %; one directional light on the whole dome.
4. **Dragon shadow layer (Z10b) added**; dragon frame y 14 -> 18; ink bbox corrected to the measured x 147-305, y 17-133; pole reticle (terminal cursor) added at P.
5. **Moon** becomes the slow bright object: 22 -> 26 px with glow; formula gains evection, variation, annual-equation and one latitude term; removed from AOD.
6. **F2:** trail origin fixed at 12 o'clock (no sidereal drift), 60 ticks kept as the seconds scale; track r 192 -> 198; AOD arcs static.
7. **F1:** sun pointer moved into its own groove r 182-192; numerals r 180 -> 176.5, ticks r 167-172; `SOLAR` label added; guilloche dropped.
8. **Furniture cut:** IAU labels, zodiac glyphs, celestial equator, `SIDEREAL hh:mm`, guilloche. Kept: ecliptic 1.0 px + 12 ticks, one inscription.
9. **Text:** `SEC nn` dropped; BAT/STP values 14 px -> 22 px with 12 px labels at baseline 290; plate 262x124 at y 170 -> 242x136 at y 166-302; date margin 3 -> 8 px; prompt moved from y 364 to the bezel (TextCircular r 218), collision with the inscriptions removed.
10. **Motion** rewritten as fractions of one symmetric system transition; the separate 180 ms sleep table is gone; dome settle made conditional.
11. **AOD:** `Outline` digits (real), vector dome, no moon, static arcs, two dynamic elements only.
12. **WFF:** UTC+9 hardcoded; A_v double-wrapped; `endAngle` never > 360; `Reference` carriers (11) on always-visible nodes with `defaultValue`; memory removed from the risk list; precision wording corrected; studio parity rules added.
13. Line weights: figures 0.8 -> 1.0 px, Draco 1.0 -> 1.2, tier D 0.9 -> 1.1 px.

## 13. Rebuttals (critic claim -> verdict and reason)

### Critic 1 (depth, score 5)
- F1 materials below the visibility floor -> **accepted.** Every value re-specified and its luminance tabulated (3.2); the shadows now fall on 2.8-5.4 % surfaces.
- F2 plate hides the best sky, 28 % stars invisible -> **accepted in part.** Plate 55 % (stars through it 11.3 %, visible), sheen and lit edge so it reads as glass; the 46.6 % area fraction stays because it is set by the information rows (date, HH:MM, BAT/STP) the brief calls information; the zenith under the time is by design. The "drop the plate" fallback is kept as risk 6, not adopted.
- F3 dragon bbox wrong, pole 60 px below the belly, no occlusion chain -> **accepted on the numbers, rejected on the conclusion.** Measured (my raster, `calc/v2astro/dragon_v2.cjs`): ink x 147-305, y 17-133 at frame (135,18); 486 of 1,586 ink px lie inside the aperture and the body crosses the rim at x 225-240, so the dragon-over-sky chain is real; with P = (225,120) the pole column is clear for 34 px and the tail tip hangs 73 px beside it. The 0.9x rescale is **rejected** (the user chose this size; 1.0x at y 18 gives 34 px of clearance versus 45 px at 0.9x for a 10 % smaller crest) but kept as the documented alternative. The reticle at the pole is **accepted**. Note: the critic's lit-wall arc "150-330 deg CW" is on the wrong side for a 315 deg light; the lit wall is the far wall, 45-225 deg peaking at 135.
- F4 two suns, prompt collision, three honest hours -> **accepted fully.** Z2 deleted; daylight ellipse adopted (with a twilight-aware alpha law instead of raw sin alt).
- Fix 5 information size -> **accepted** (22 px values, 12 px labels).
- Fix 6 cut the furniture -> **accepted** except the ecliptic and its 12 ticks (3 px, no glyphs): that is the Galaxia's zodiac mechanism (pointer against the sidereal disc), costs nothing legible and is the only annual reading on the vault.
- Fix 7 F2 as a drifting cage without ticks -> **rejected; option (b) taken.** Critic 3 showed the drift claim was 180 deg wrong and a drifting zero makes seconds unreadable; the sidereal motion belongs to the whole vault, and the slow bright object role goes to the moon, which is real. The v4 seconds ring stays legible.
- Fix 8 line weights -> **accepted.** Fix 9 wake order / conditional settle -> **accepted.** Fix 10 (a)-(f) -> **all accepted** (Wear OS 6 dependency named, carriers, double wrap, endAngle bounded by construction, negative-coordinate test, memory risk dropped).

### Critic 2 (readability, score 5)
- AOD moon behind the outline digits -> **accepted; AOD moon removed** (also forced by the offload limit).
- FATAL 1 values -> **accepted** (see above). The suggested vault base #1A2226 "4 %" is **rejected as arithmetic**: it is 1.5 % by WCAG; v2 uses a 0.71 % base with 2.8-5.4 % lit regions, which gives the shadows surfaces without turning the whole window grey (a uniform 4 % window would cost star contrast and plate contrast for nothing).
- FATAL 2 dragon bbox and the two collisions -> **accepted.** Bbox measured; safe-area table rebuilt; the prompt moved to the bezel so nothing overlaps the shoulder inscription; the sun pointer under the dragon for 76 min around solar midnight is intended (the dragon guards the north, where the sun is at midnight).
- FATAL 3 summer sun behind the plate -> **accepted by removal**: neither option (a) nor (b); the sun leaves the window entirely, the tint is uniform, and the plate stays.
- F1 `Outline` -> **accepted** (risk 9 of v1 withdrawn). F2 hardcode UTC+9 -> **accepted.** F3 -> moot. F4 telemetry -> **accepted in spirit**, sized per critic 1 (22 px) rather than 17 px; `SEC` dropped. F5 prompt/date -> **accepted** (bezel; 8 px date margin). F6 F1 collision -> **accepted** (own groove, numerals inside, SOLAR). F7 guilloche -> **accepted** (dropped). F8 memory -> **accepted** (risk removed, figures restated). F9 negative coordinates -> **accepted** as a validator test. F10 -> **accepted** (origin at 12; only the vault drifts). F11 Reference wording -> **accepted.**

### Critic 3 (feasibility, score 6)
- F1 seconds cage into the sky at r 146 -> **rejected as the fix, accepted as the diagnosis.** A bright object crossing the sky once a minute is not the Cosmotourbillon (which orbits once per sidereal day) and would run through the plate corners, the moon and the dragon's coil every minute; the v4 ring is the signature the user kept. The diagnosis (depth must be visible at a human rate, not only in a vendor-owned transition) is answered by the dragon's cast shadow over the rings, which the marker crosses every minute with a lit / shadowed / hidden sequence, by the moon as the slow occluded object, and by the value rebuild.
- F2 the window hides the sun for most of a winter day -> **accepted; Fix A adopted at 1.8 px/deg, not 1.6.** With P = (225,120) the south edge is at 0.8 deg altitude (measured by azimuth), the ground band is unnecessary because no sub-horizon sky is ever in the window, and the Dipper keeps 46 px. The in-window sun is gone regardless, so the only object that rises and sets is the moon, and it now does so behind the wall.
- F3 transition cannot be authored -> **accepted.** Section 7 is one fractional, symmetric timeline; `Font` has no Variant, so the digits crossfade.
- Fix 1 Outline -> **accepted.** Fix 2 moon terms -> **accepted and extended** (one latitude term; errors verified). Fix 3 Reference hosts -> **accepted** (eleven always-visible carriers). Fix 4 AOD two dynamic elements -> **accepted** (static arcs, no AOD moon). Fix 5 trail origin -> **accepted** (fixed at 12). Fix 6 dragon frame y 18 -> **accepted** (and re-measured against the new pole). Fix 7 sub-pixel truth -> **accepted** (~800 catalogued, ~250 visible). Fix 8 vector `dome_aod` -> **accepted.** Fix 9 SOLAR -> **accepted.** Fix 10 plate 62 % -> **exceeded** (55 %). Fix 11 wording -> **accepted.** Fix 12 studio parity -> **accepted.**
- "scaleX animation unverified on the Samsung runtime" -> **accepted**; the settle is conditional on a device test.
- "sun altitude 31.2 not 35" -> **accepted**; moot with Z2 gone.

### Not refuted by anyone, kept
Polar azimuthal-equidistant rigid disc; the `DAY_OF_YEAR + HOUR_0_23_MINUTE` sidereal form with the exact GMST constant; east-left / CCW orientation; the off-centre pole with a concentric aperture; Draco in phosphor under the official dragon; the apparent-solar pointer with the seasonal arc; one warm hue, one cool neutral, one night tone; HH:MM at 166/284 baseline 252 untouched; the back-to-front wake order; drifting AOD stars as burn-in protection; `KALI / ORBIT` dropped because the dragon brands.

## 14. Hard-constraint check
- HH:MM big, fixed, never scaled, < 1 s: yes (15:1 worst-case contrast). Time/date/battery/steps are the information: 17 / 78 / 22 px, all on the plate.
- Official dragon path unchanged: yes (frame moved 4 px, measured).
- Phosphor identity + controlled secondary hues: yes (gold, silver, enamel night, one daylight tint).
- AOD: same face, quiet, ~8.5 % native lit, no per-second motion, no loops, drift-based burn-in safety: yes.
- Motion: no perceptible decorative loops; real astronomical rotations only; one wake transition <= 400 ms in the studio: yes; reduced motion instant: yes.
- WFF v4 portable: every layer mapped (section 9); shading baked; vectors simple.
- Real Seoul astronomy: sidereal, solar, lunar, annual, verified at four moments.
- Terminal DNA: Roboto Mono, the prompt (on the bezel), INFINITY, the cursor on the pole.
- Nothing thinner than 1.0 px or smaller than 10-11 px is information.

## Verification log (this revision)
- `scratchpad/calc/v2astro/dragon_v2.cjs`: nonzero-winding raster of the untouched official path at frames (135,14), (135,18), (135,20) and the 0.9x (144,16); zone counts against the v2 radii; occlusion angles for r 187 / r 198 travellers.
- `scratchpad/calc/v2astro/sky_v2.py`: window-edge altitude by azimuth for six (scale, pole) candidates; four sample moments (LST error, sun pointer, daylight alpha, moon with 5+1 terms, 28 bright stars in/out of window and plate); 5-term vs 8-term moon over 2026-2027; day-arc seasons; WCAG luminance of every hex in section 3 and the key composites.
- Critics' numbers reused where I reproduced them: GMST 100.660859 exact; AOD 8.66 % native (critic 2's raster); Outline / Reference / Variant / Arc / PartImage semantics (all three critics, consistent).

## References used
- JLC press release and coverage of the Master Hybris Artistica Calibre 945 Galaxia (dial levels, 46th-parallel sky, anticlockwise sidereal Cosmotourbillon, gold sun pointer with 24 h + zodiac, three flange rings).
- WFF reference: `Variant` (fractions, interpolation, angleDirection, v4 duration), `Reference` (Wear OS 6; defaultValue while hidden), `PartImage`/`Group` transformables, `Arc`, `TextCircular`, `Font` > `Outline`, source types (`HOUR_0_23_MINUTE` v1 float, `MOON_PHASE_TYPE` 0-7, `STEP_GOAL`, `YEAR`), arithmetic functions, memory-usage page (100 MB / 10 MB, offload limitations).
- Astronomy: IAU 1982 GMST, sidereal day 86164.0905 s, Seoul 37.57 N 126.98 E UTC+9, Yale BSC magnitudes, Astronomical Almanac low-precision sun and moon series.
