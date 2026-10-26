# KALIWATCH v5 "Seoul Planisphere" — proposal from the astronomer / planetarium-engineer seat

Design space 450 x 450, centre (225,225), radius 225. Target Galaxy Watch6 Classic 480 x 480 round (WFF scales 450 -> 480 itself; export bitmaps at 480/450 = 1.0667x so the renderer's scaling is 1:1).

## 0. Thesis in one paragraph

v4 is flat because every element lives on the same plane and nothing on it is *true*: one decorative planet, 20 random dots, one ring. The Galaxia feels deep because its stack is a stack of **instruments**: a real sky turning once per sidereal day under a dome, a sun pointer turning once per solar day on a flange, hands turning once per hour/minute on top, every level finished in a different material. v5 rebuilds KALIWATCH as the oldest sky instrument there is, a **planisphere** (star disc turning under a fixed horizon window), set for Seoul 37.57 N / 126.98 E, and stacks the KALI signature on top of it: the official dragon crest guarding the celestial pole, the phosphor HH:MM on a smoked-glass plate floating over the zenith, the terminal prompt etched on the crystal. Eleven layers, six real time-scales (second, minute, civil hour, apparent-solar day, sidereal day, synodic month + annual), three materials (fired enamel vault, machined dome/flange, smoked sapphire plate), one wake transition that lights the stack back-to-front in 360 ms. Nothing decorative loops; everything that moves is the sky.

## 1. The sky: projection, orientation, window

- **Projection:** north-polar azimuthal equidistant (r = s * (90 - dec)). This is the only projection in which the whole sky turns as a *rigid disc* around one pixel, so it is the only projection WFF can animate (one `Transform target="angle"` on one bitmap). It is also exactly what a planisphere and the Galaxia celestial disc use.
- **Scale s = 2.0 px per degree.** The Big Dipper (Dubhe-Alkaid 25.7 deg) is 51 px long, Cassiopeia's W 26 px, Orion 37 px tall, Vega-Altair 68 px: all legible at 40 mm.
- **Pole P = (225,138).** Polaris (dec 89.26) sits 1.5 px from P. The zenith for 37.57 N is 52.43 deg from the pole = 105 px straight below P = **(225,243)**: the centre of the HH:MM plate. The time literally sits on the zenith.
- **Orientation (planisphere convention, "lying with your head to the north"):** north horizon up, south meridian down, **east on the LEFT, west on the RIGHT**. The disc turns **counter-clockwise** 360 deg per 23 h 56 m 04.09 s (0.25068 deg/min). Every slow mover on the face (vault, sun pointer, AOD arcs) goes counter-clockwise, like the Galaxia Cosmotourbillon; only the seconds cage spins clockwise.
- **Window (aperture):** circle centre (225,225), r = 150, concentric with the dial. In sky terms it shows altitude >= 6 deg due north (behind the dragon), >= 24 deg due south, >= 26 deg east/west: the sky above the Seoul skyline haze. The true horizon is never drawn; what you see through the hole is up.
- **Star disc bitmap:** 512 x 512 px centred on P (placed at x = -31, y = -118), drawn to r = 256 = dec -38, enough to fill the window bottom (farthest window point from P is 237 px = dec -28.5).

Sidereal time for Seoul, verified against a full GMST routine (error < 0.01 deg):

```
dL  = ([YEAR]-2026)*365 + floor(([YEAR]-2025)/4) + ([DAY_OF_YEAR]-1) + [HOUR_0_23_MINUTE]/24   // local days since 2026-01-01 00:00
dU  = dL - [TIMEZONE_OFFSET_MINUTES_DST]/1440                                                // UT days
LST = (100.660859 + 126.98 + 360.98564736629*dU) % 360                                       // 100.660859 = GMST at 2026-01-01 00:00 UT
A_v = (360 - LST) % 360                                                                      // vault angle, WFF clockwise degrees
```
Check: 2026-10-25 10:08:24 KST -> LST 177.52 deg (11 h 50 m), A_v = 182.5. Image convention at A_v = 0: RA 0 h at 6 o'clock (toward the zenith), RA increasing clockwise, RA 6 h at 9 o'clock.

## 2. Layer stack, back to front

| z | layer | what it shows | time-scale driving it | geometry (450 space) | material / treatment | Active | AOD |
|---|---|---|---|---|---|---|---|
| Z0 | base | black lacquer disc | none | r 225 | #000000 | on | on |
| Z1 | **vault** (star disc) | real Seoul sky: ~720 stars to mag 4.5, Milky Way grisaille, 23 constellation figures, Draco in phosphor, equator + ecliptic with 12 zodiac ticks | **sidereal day** (23h56m04s), rotates about P | 512x512 PNG, centre (225,138), pivot .5/.5 | fired-enamel night #04070A, grisaille Milky Way in 3 tones, silver stars #C9D6D2, lines #3F4F4B @60 % | full | `vault_aod.png`: 72 stars <= mag 2.5 as 1.5 px #5E6E68 dots + Draco lines #4D633F; same rotation |
| Z2 | **sun** (true sun on the vault) | sun disc + corona + daylight haze at its real hour angle and declination | **apparent solar day** (equation of time) + **annual** (declination) | 192x192 PNG, centre = (225 + d sinH, 138 + d cosH), d = 2(90 - dec) = 133..227 px | core #F0C878 6 px, corona #E2B15A -> 0 over 28 px, haze #AEBFC8 18 % -> 0 over 96 px | on | hidden |
| Z3 | **moon** | lunar disc at its real position, phase from 8 frames | **synodic month** (age) + sidereal/annual position | 22x22 PNG x8, centre like the sun | lit #D9E2DE, limb #1A2024 | on | alpha 110 (dim dot) |
| Z4 | **dome** (horizon field + aperture wall + flange) | the fixed instrument body: field outside the window, 4 px bevelled wall, 12 px inner shadow onto the vault, meridian hairline, F1 24-h solar scale, F2 60-tick minute track, F3 bezel, engraved inscriptions | none (static) | 450x450 PNG; aperture r 150; wall 150-154; shoulder 154-166; F1 166-186; groove 186-190; F2 190-212; F3 212-225 | field #0C110E -> #05070A (lit upper-left); wall bright lower-right arc #3E4F45, dark upper-left #020302; shoulder flat; F1 "opaline" #151C18 with 1.5 px highlight arc #2A352E at r 167; F2 radial guilloche 0.5 px #121A15/#0A0F0C; F3 #0A0D0B, rim light #2A352D at r 223.5 | full | `dome_aod.png`: rim circle 1 px #3A4A3F at r 150 + 12 ticks #7F9472 (r 202-211); everything else black |
| Z5 | **F1 solar instruments** | day arc (sunrise -> sunset) and gold sun pointer on the 24-h ring | **apparent solar day**, pointer CCW once per day; arc length **annual** | arc r 177, 1.5 px, from 180 - H0 to 180 + H0 clockwise; pointer 9 px gold disc at r 177 | #E2B15A, arc @70 % | on | hidden |
| Z6 | **F2 orbit instruments** | seconds trail + marker; the trail's *origin* is the sidereal pointer (where RA 0 h sits), so the cage drifts CCW once per sidereal day while sweeping clockwise once per minute | **second** (trail/marker), **sidereal** (origin) | r 192, trail 1.7 px, marker 3.3 px + 5 px tick (v4 geometry) | #A6F46A @72 % on track #17291D | on | 4 segmented arcs 48 deg at A_v+12, +102, +192, +282, #4D633F 1.25 px (v4 arcs, now drifting) |
| Z7 | **plate shadow** | drop shadow of the glass plate onto the vault = the height cue | none; wake transition only | 290x152 PNG, offset (+3,+4), blur 8 | #000 @60 % | on | hidden |
| Z8 | **plate** (smoked sapphire) | the information slab; stars show through at 28 % | none | round-rect x 94-356, y 170-294 (262x124), corner 10 | #000 @72 %, top/left 1 px #3C4A41 @60 %, bottom/right 1 px #000 @80 %, 1 % diagonal sheen | on | hidden (digits stand on the sky) |
| Z9 | **text** | date, HH:MM, colon, telemetry row, gauges | **civil minute**, second (SEC), battery/steps | see section 4 | Roboto Mono; digits #EFF8EC, colon #A6F46A | on | outline digits (#11200F fill / #91AD80 stroke 1.4), date + BAT #7F9472 |
| Z10 | **crystal etch** | prompt `kali@orbit:~$ INFINITY`, "37.57N 126.98E", "SIDEREAL hh:mm" | sidereal (text) | prompt baseline y 364 centred; inscriptions on shoulder r 160 lower-left / lower-right (TextCircular) | #9BAB9C, INFINITY #A6F46A; inscriptions #3E4C44 10 px | on | INFINITY only, 11 px #7F9472 |
| Z11 | **dragon** (nearest) | official Kali logomark, unchanged path, crest over the celestial pole; its lower coil occludes the aperture rim (proves it is above the dome) | none | frame 180x123 at (135,14); ink approx x 166-285, y 47-126; Polaris 12 px below the lowest ink | body #A6F46A @96 %, 1 px rim light #D8FFB0 on upper-left edges, 6 px glow #A6F46A @25 % (phosphor is emissive, so it glows) | on | #718D61 @85 %, no glow |

Six time-scales, three materials, three occlusion chains (dragon > rim > sky; plate > shadow > sky; dome wall > inner shadow > sky).

### ASCII layer diagram (side view, light from upper-left)

```
 viewer
   |
   v
 Z11  dragon crest  ~~~~~~~~~~~~~~~ (over pole, overlaps rim)            phosphor, emissive
 Z10  crystal etch   ...prompt.......INFINITY....                         etched grey
 Z9   text           25 OCT / SUN   10:08   SEC BAT STP                   paper / phosphor
 Z8   plate   [==============  smoked sapphire 72 %  ==============]      floats over zenith
 Z7   shadow      ::::::::::::::::::::::::::::::::::::::::::             +3,+4 px, blur 8
 Z6   F2 ring  (  seconds cage, origin drifts with the sky  )            phosphor on guilloche
 Z5   F1 ring  (  gold sun pointer, day arc, 24-h solar scale  )         gold on opaline
 Z4   dome  ######|  bevel wall 4 px, inner shadow 12 px  |######         machined, lit top-left
 Z3   moon                 o  (8 phase frames)                             grisaille white
 Z2   sun            (  ) corona + daylight haze                           warm gold
 Z1   vault   . * .  ' . * Milky Way . DRACO . * . ' . *  .  (rotates CCW 1/sidereal day, about P)
 Z0   base    ______________________ black lacquer ______________________

 top view (450 space):            y
      dragon crest  y14-137        |   P (225,138) pole, Polaris
   aperture r150 ------------------+------------------ meridian hairline x=225
      plate 262x124  y170-294  -> centre (225,232), zenith (225,243)
      prompt y364 ; aperture bottom y375 ; F1 r166-186 ; F2 r190-212 ; F3 r212-225
```

## 3. What is on the vault (catalogue depth, figures, lines)

- **Catalogue:** Yale BSC / Hipparcos subset, V <= 4.5, dec >= -40 deg. About 720 stars. Tiers (sizes are at 450 px; 1 px = 0.089 mm at 40 mm):
  - A: V <= 1.5, 17 stars: 2.8 px disc + 6 px halo @30 %
  - B: 1.5 < V <= 2.5, ~55 stars: 2.0 px
  - C: 2.5 < V <= 3.5, ~165 stars: 1.4 px
  - D: 3.5 < V <= 4.5, ~480 stars: 0.9 px @55 %: texture only (brief: < 1 px is decoration), it is what makes the Milky Way look populated.
  - Nothing fainter. At s = 2 px/deg, V 5 stars would be sub-pixel noise.
- **Constellation figures (lines 0.8 px #3F4F4B @60 %):** Ursa Major (7), Ursa Minor (7), **Draco (14, phosphor #A6F46A @55 %, 1.0 px; Eltanin + Rastaban drawn 2.4 px phosphor)**, Cassiopeia (5), Cepheus (5), Perseus (6), Auriga (5), Lyra (5), Cygnus (6), Aquila (3), Bootes (6), Corona Borealis (7), Hercules keystone (4), Leo (9), Gemini (8), Orion (8 + belt), Taurus (6 + Pleiades cluster as a 3 px smudge), Canis Major (5), Scorpius (11, tail clipped at dec -37), Sagittarius teapot (8), Pegasus square + Andromeda (7), Virgo (5), Canis Minor (2). 23 figures, ~150 segments. Draco is the only figure in colour: the Kali dragon on top, Draco winding around the pole beneath it, is the conceptual bridge to the JLC "Dragon" edition without copying anything.
- **Labels:** IAU 3-letter abbreviations, 10 px, #3A4743 @35 %, placed along each figure. They rotate with the disc (as the Galaxia's transferred names do); they are texture, not information, and the document says so.
- **Milky Way:** baked grisaille in three fired tones over the base: #0E1519 (outer glow), #19232A (band), #263238 (Cygnus-Scutum-Sagittarius core, Perseus arm), with the Great Rift as a lane of the base tone. Soft edges 8-14 px. Max band luminance ~18 %: a presence, not a texture fight with the digits.
- **Celestial equator:** dotted 0.8 px #3A4440 @35 %. **Ecliptic:** dashed 0.8 px #7A6A3E @45 % (the gold at 45 %), with 12 zodiac ticks (3 px) at longitudes 0, 30, ... 330 and 8 px sign glyphs: the zodiacal calendar. The sun sits on this line; where it sits is the month. The moon stays within 5 deg of it.
- **Sun (Z2):** apparent position, not civil. `dec = -23.44*cos(rad(0.98630*(N+10)))`, equation of time `9.87*sin(2B) - 7.53*cos(B) - 1.5*sin(B)` with `B = rad(0.98901*(N-81))` minutes, `hs = h - 0.53467 + EoT/60` (Seoul is 32.1 min west of the KST meridian), `H = 15*(hs-12)`. The daylight haze (96 px radius, 18 %) fades the stars around the sun: physically honest daylight.
- **Moon (Z3):** age from `(D - 5.1) % 29.530588853` with D = days since J2000 (`dU + 9496.5`); longitude `lam_sun + 12.1907*age + 6.289*sin(M)`; RA/dec through obliquity 23.44 deg; position like the sun; phase frame from `[MOON_PHASE_TYPE]`. Error <= 2 deg in longitude (4 px). If the moon is on the watch, it is in the sky over Seoul.
- **Planets:** studio only (VSOP-lite in JS). On the watch v5.1 could add Jupiter and Saturn from mean elements (2-term expressions, error < 3 deg); Venus and Mars need a heliocentric solution and are out of scope for a declarative face.

Verified sample moments (positions in the 450 space):
- 2026-10-25 10:08:24 KST (studio sample): LST 11h50m, vault angle 182.5. Polaris (226,137). Draco's head Eltanin (148,136) / Rastaban (150,144) visible left of the pole. Kochab (203,160), Vega (125,117), Capella (312,125), Caph (230,77) visible. Big Dipper at upper culmination (y 193-211) is behind the plate at 28 %. Morning sun at (116,313), alt 35 deg, lower-left of the window with its haze. Moon (age 13.8 d) set, hidden under the dome.
- 2026-10-25 19:31:08 KST (on-watch PREVIEW_TIME): LST 21h14m, vault angle 41.4. Dipper low in the north at y 78-108 (Dubhe (251,88) under the dragon's coil). Draco's head at (284,188)/(287,180), Vega (290,217), Deneb (238,227) behind the plate. Mirfak (145,135) left. Near-full moon rising at (83,222), alt 29 deg, at the left rim: correct for the 26 Oct full moon. Sun below the horizon, hidden.

## 4. Composition: exact positions

Unchanged from v4 and non-negotiable: HH:MM hours centred x 166, minutes x 284, baseline y 252, Roboto Mono 78 / 600; colon x 225 baseline 248 phosphor. Never moves, never scales.

| element | position | size / colour |
|---|---|---|
| dial clip | centre (225,225) r 225 | |
| vault pole P | (225,138) | bitmap 512 at (-31,-118) |
| zenith | (225,243) | under the plate |
| aperture | centre (225,225) r 150; wall 150-154 | |
| dragon frame | (135,14) 180x123 (ink ~ x166-285, y47-126) | official path, phosphor |
| meridian hairline | x 225, y 76-168 and y 296-374, 0.8 px #2A3530 | on the dome layer |
| plate | x 94-356, y 170-294, corner 10 | #000 @72 % |
| date | centre x 225, baseline 186, 17 px #9BAB9C | `25 OCT / SUN` |
| HH:MM | 166 / 284, baseline 252, 78 px #EFF8EC | |
| telemetry row | centre x 225, baseline 284, 14 px | `SEC 24  BAT 78%  STP 6,240`, labels #9BAB9C, values #EFF8EC, BAT <= 15 -> #F3C479 |
| gauges | y 290, 2 px, 60 px under BAT and under STP | #A6F46A on #17291D |
| prompt | centre x 225, baseline 364, 13 px | `kali@orbit:~$ INFINITY`, INFINITY #A6F46A |
| inscriptions | TextCircular r 160, lower-left 200-235 deg `37.57N 126.98E`; lower-right 125-160 deg `SIDEREAL 11:50` | 10 px #3E4C44 |
| F1 24-h scale | 24 ticks r 168-174 #34543C; numerals `06` at 9 o'clock, `12` at 6, `18` at 3, r 180, 11 px #5A6A5E; `00` omitted (dragon zone) | apparent solar, 00 top, CCW |
| day arc / sun pointer | r 177 | gold |
| F2 track | circle r 192 #17291D; 60 ticks r 202-211 (#34543C, majors #526650 1.6 px) | v4 geometry |
| F3 bezel | r 212-225, rim light r 223.5 | |

**Safe radius for text:** every glyph box inside r <= 150 of the dial centre (plate corners are at r 142-148; prompt corners at r 168 but it is decoration). Dome inscriptions ride r 160 on the shoulder by design.

**Depth planes relative to the digits:** the digits are on Z9 over the Z8 plate at 72 % black. Anything behind the plate (vault, sun, moon) reaches the eye at <= 28 % of its brightness; tier A stars at 2.8 px x 28 % are faint sparks, never a contrast problem against #EFF8EC. The sun's corona through the plate is an 11 % warm bloom: visible as depth, invisible as noise. Nothing in front of the digits ever: the dragon frame ends at y 137, the plate starts at y 170.

Dropped from v4: the `KALI / ORBIT` label (the dragon brands; the plate needs the space), the 27 px telemetry values (now one 14 px row so the southern sky band y 296-374 stays open: that is where the sun travels and where Orion/Scorpius culminate). If the user wants the 27 px values back, they go at baseline 343 and the southern band shrinks to 30 px; I recommend against it.

## 5. Palette

Identity stays: phosphor **#A6F46A** (dragon, colon, seconds, gauges, Draco, INFINITY). Paper #EFF8EC, quiet #9BAB9C, structure #34543C, track #17291D, warning #F3C479 and the AOD greens stay as in v4.

Three new controlled hues, each with one job:

1. **Sun gold #E2B15A**: the only warm colour. Sun core/corona, sun pointer, day arc, and at 45 % the ecliptic (#7A6A3E). It is the Galaxia's gold sun pointer and nothing else is allowed to be warm, so the eye finds the sun in one glance.
2. **Grisaille silver #C9D6D2**: stars, moon lit side, rim lights (wall highlight #3E4F45 and bezel rim #2A352D are this hue over black), replacing v4's blue starlight #8CA6B5. One cool neutral keeps the vault reading as fired white enamel on dark enamel, not as a "space wallpaper".
3. **Enamel night #04070A**: vault base, inner shadows, plate glass. The Milky Way tones #0E1519 / #19232A / #263238 are this hue lifted by the silver at 8 / 16 / 26 %.

Everything else on the face is one of these over black at a stated alpha. No blue, no purple, no gradients that are not light falling on a surface.

## 6. Motion

**Real-time rotations (never stop, never perceptible as motion):**
- Vault, sun-on-vault, moon, seconds origin, AOD arcs: 360 deg / 86164.09 s = 0.25068 deg/min counter-clockwise; at r 150 that is 0.66 px per minute. A star returns 3 m 56 s earlier each day; over a month the sky visibly precesses against the sun pointer. Updated once per minute (expression depends on `[HOUR_0_23_MINUTE]`).
- Sun pointer (F1): 0.25 deg/min counter-clockwise, apparent solar time.
- Day arc: changes length once per day (seasonal, +-80 deg half-arc at Seoul: 9.6 h in December to 14.8 h in June).
- Sun declination / moon: once per minute with the same expressions.

**Each second (Active only):** the seconds trail endAngle steps 6 deg, the marker steps 6 deg, `SEC nn` text. Nothing else repaints.

**Wake, AOD -> Active, 360 ms, ease cubic-bezier(.22,1,.36,1), back-to-front so the stack is *built* in front of the eye:**

| t (ms) | layer | property |
|---|---|---|
| 0-140 | Z1 vault | `vault_aod` alpha 1 -> 0 while `vault_active` alpha 0 -> 1 (crossfade; no rotation jump, both share A_v). The Milky Way "fires". |
| 40-220 | Z4 dome | `dome_active` alpha 0 -> 1; scale 1.03 -> 1.00 about the centre (the dome settles down onto the vault: a 4.5 px edge displacement reads as height). `dome_aod` alpha 1 -> 0 over 0-120. |
| 60-240 | Z2/Z3 | sun + haze alpha 0 -> 1; moon alpha 110 -> 255 |
| 80-300 | Z7/Z8 plate | plate alpha 0 -> 1 (80-260); shadow alpha 0 -> 0.6 and y offset 0 -> +4 (100-300): the plate lifts off the sky while the digits stay put |
| 80-300 | Z9 digits | same nodes, same coordinates: fill #11200F -> #EFF8EC, stroke-opacity 1 -> 0 (220 ms from 80); telemetry row alpha 0 -> 1 with the v4 80 ms delay |
| 0-360 | Z6 orbit | the v4 signature: active orbit group rotate -14 deg -> 0 and alpha 0 -> 1 over the full 360; AOD arcs alpha 1 -> 0 over 0-220 |
| 160-360 | Z5 flange | sun pointer + day arc alpha 0 -> 1 |
| 200-360 | Z11 dragon | colour #718D61 -> #A6F46A (160 ms), glow + rim-light sprite alpha 0 -> 1 (200-360). The nearest layer lights last. |

**Active -> AOD, 180 ms:** reverse order compressed: dragon dims 0-120, plate + shadow drop 0-140 (shadow offset +4 -> 0 first, then alpha), sun/pointer/arc out 0-120, dome/vault crossfade 40-180, AOD arcs and ticks in 60-180, digits to outline 0-180.

**Reduced motion (manual or OS):** every state is applied instantly; the sidereal/solar rotations are not animation and keep running (they are the time).

No loops. No twinkle. The only things that move by themselves are the sky and the sun, and they move at the speed of the sky and the sun.

## 7. AOD

Remains: vault_aod (72 stars <= mag 2.5, Draco dim), dome_aod (1 px rim at r 150, 12 ticks), 4 drifting arcs at r 192, outline HH:MM, date, `BAT 78%` row, INFINITY, dim dragon, moon as a dim dot if above the horizon. Gone: plate, shadow, sun, pointer, day arc, trail, Milky Way, labels, inscriptions, meridian hairline.

**Lit-pixel estimate:** v4 measured 11.3 % with the same digits, dragon, arcs, date, BAT, INFINITY. v5 removes `KALI / ORBIT` (-0.3 %), adds the rim circle (2 pi x 150 x 1 px = 942 px^2 = 0.6 % of 159,043 px^2) and 72 dots (~250 px^2 = 0.15 %). Estimate **~11.8 %**, under the 15 % limit; still to be measured on the raster.

**Burn-in:** outline digits (low fill) at the fixed position as in v4; everything else that is brighter than #4D633F either drifts (arcs, stars: a full lap per day, 0.66 px/min, so no pixel holds a lit edge for more than ~3 minutes) or is dim (dragon #718D61 @85 % ~ 25 % luminance; rim #3A4A3F ~ 7 %). The system's AOD pixel shift handles the digits; the design adds no static full-intensity element.

## 8. WFF v4 mapping, layer by layer

Shared expressions (declare once via `Reference`/named Expressions; all small-number arithmetic, float32-safe):

```
dL   = ([YEAR]-2026)*365 + floor(([YEAR]-2025)/4) + ([DAY_OF_YEAR]-1) + [HOUR_0_23_MINUTE]/24
dU   = dL - [TIMEZONE_OFFSET_MINUTES_DST]/1440
LST  = (227.640859 + 360.98564736629*dU) % 360          // 100.660859 + 126.98
A_v  = (360 - LST) % 360
N    = [DAY_OF_YEAR] ; h = [HOUR_0_23_MINUTE]
decS = -23.44*cos(rad(0.98630*(N+10)))
B    = rad(0.98901*(N-81)) ; EoT = 9.87*sin(2*B) - 7.53*cos(B) - 1.5*sin(B)
hs   = h - 0.53467 + EoT/60 ; HS = 15*(hs-12) ; dS = 2*(90-decS)
H0   = deg(acos(clamp(-tan(rad(37.57))*tan(rad(decS)),-1,1)))
D    = dU + 9496.5
age  = (D - 5.1) % 29.530588853
lamS = 280.460 + 0.9856474*D + 1.915*sin(rad(357.528 + 0.9856003*D))
lamM = lamS + 12.1907*age + 6.289*sin(rad(134.963 + 13.064993*D))
raM  = deg(atan(0.91748*tan(rad(lamM)))) + (cos(rad(lamM)) < 0 ? 180 : 0)
decM = deg(asin(0.39777*sin(rad(lamM)))) ; HM = LST - raM ; dM = 2*(90-decM)
```

| layer | WFF v4 construction |
|---|---|
| Z0 | `<Scene backgroundColor="#ff000000">` |
| Z1 vault | `PartImage x=-31 y=-118 width=512 height=512 pivotX=.5 pivotY=.5` + `<Image resource="vault_active"/>` + `<Transform target="angle" value="A_v"/>` + `<Variant mode="AMBIENT" target="alpha" value="0" duration="0.4"/>`. Second `PartImage` with `vault_aod`, `alpha="0"`, `Variant AMBIENT alpha 255 duration 0.4`, same Transform (shared through `Reference`). Rotation is pure bitmap rotation; nothing is re-projected on the watch. |
| Z2 sun | `PartImage width=192 height=192` with `<Transform target="x" value="225 + dS*sin(rad(HS)) - 96"/>` and `target="y" value="138 + dS*cos(rad(HS)) - 96"/>`; `Variant AMBIENT alpha 0`. Sits under Z4, so below the horizon it is covered by the dome bitmap automatically. |
| Z3 moon | `<Condition>` on `[MOON_PHASE_TYPE]` with 8 `<Compare>` branches, each a 22x22 `PartImage moon_0..7` with `x = 225 + dM*sin(rad(HM)) - 11`, `y = 138 + dM*cos(rad(HM)) - 11`; `Variant AMBIENT alpha 110`. |
| Z4 dome | two static 450x450 `PartImage`s (`dome_active`, `dome_aod`) crossfaded by `Variant AMBIENT alpha` (duration 0.5, startOffset 0.1); `dome_active` also `Variant AMBIENT target="scaleX"/"scaleY" value="1.03"` so the return to interactive plays 1.03 -> 1.00. Bevel, inner shadow, guilloche, numerals, ticks, hairline are all baked. |
| Z5 day arc | `PartDraw` > `Arc centerX=225 centerY=225 width=354 height=354 direction=CLOCKWISE` + `Stroke color="#b3E2B15A" thickness="1.5" cap="ROUND"` + `Transform target="startAngle" value="180 - H0"` + `Transform target="endAngle" value="180 + H0"`; `Variant AMBIENT alpha 0`. Sun pointer: 354x354 carrier `PartImage` with the 9 px gold dot at the top, pivot .5/.5, `Transform angle = ((360 - 15*hs) % 360 + 360) % 360`. |
| Z6 trail | `Arc` r 192 (384x384): `startAngle = A_v`, `endAngle = A_v + 6*[SECOND]`, `Stroke #b8A6F46A 1.7`; marker: 384x384 carrier `PartImage`, `angle = A_v + 6*[SECOND]`; both `Variant AMBIENT alpha 0`. AOD arcs: four `Arc`s `startAngle = A_v + 12 + k*90`, `endAngle = start + 48`, `Stroke #ff4D633F 1.25`, `alpha 0` -> `Variant AMBIENT 255`. |
| Z7 shadow | `PartImage plate_shadow 290x152 at (80,168)`; `Variant AMBIENT alpha 0 duration 0.4` and `Variant AMBIENT target="y" value="164"` (the +4 px lift plays on return). |
| Z8 plate | `PartDraw` > `RoundRectangle x=94 y=170 width=262 height=124 cornerRadius=10` + `Fill color="#b8000000"`; edge lines as two 1 px `Line`s; `Variant AMBIENT alpha 0`. |
| Z9 digits | Two `DigitalClock` groups at identical coordinates, exactly as the existing `watchface.xml` does: interactive = three `TimeText` (hh centred in a box at 166, mm at 284, `:` as `PartText` at 225, Roboto Mono 78 BOLD #EFF8EC / colon #A6F46A); ambient = same boxes, Roboto Mono **LIGHT** #91AD80 (WFF text has no stroke; a light weight is the outline's pixel-count equivalent). Groups crossfade with `Variant AMBIENT alpha`. Date: `PartText` Template `[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]`. Telemetry row: one `PartText` Template `SEC %s  BAT %s%%  STP %s` with `[SECOND_Z]`, `[BATTERY_PERCENT]`, `numberFormat("#,###",[STEP_COUNT])`; gauges: two `Rectangle`s with `Transform target="width" value="60*[BATTERY_PERCENT]/100"` and `60*clamp([STEP_COUNT]/[STEP_GOAL],0,1)`; low-battery colour via `Condition [BATTERY_PERCENT] <= 15`. |
| Z10 etch | `PartText` prompt (two Font runs); `TextCircular` for the two shoulder inscriptions; SIDEREAL text = `numberFormat("00", floor(LST/15)) + ":" + numberFormat("00", floor((LST/15 - floor(LST/15))*60))`. `Variant AMBIENT alpha 0` except INFINITY. |
| Z11 dragon | `PartImage dragon_active 180x123 at (135,14)` (rendered from the untouched official path: body + rim light + glow baked) `Variant AMBIENT alpha 0`; `PartImage dragon_aod` (#718D61) `alpha 0` -> `Variant AMBIENT 217`. |

Resource budget: vault 512^2 x2, dome 450^2 x2, sun 192^2, moon 8 x 22^2, shadow 290x152, dragon 180x123 x2, carriers 354^2 + 384^2 x2 (mostly transparent, still allocated) ~ 3.9 MB raw RGBA; export carriers as 8-bit alpha PNGs and run the WFF memory-footprint validator (ambient budget is the tight one; the ambient set is vault_aod + dome_aod + dragon_aod + text only).

Studio side: `celestial.js` is replaced by `sky.js` (catalogue JSON ~720 rows, constellation line list, Milky Way polygons, sun/moon/LST routines identical to the expressions above) rendering a rotating SVG group in the browser; `build-assets.cjs` bakes the same scene to the PNG layers listed here for the WFF port, so the browser and the watch cannot disagree.

## 9. Risks

1. **Sub-pixel stars on the real OLED.** Tier C at 1.4 px and tier D at 0.9 px may vanish on the PenTile panel at 40 mm; the look then rests on tiers A/B (72 stars) plus the Milky Way. Mitigation: bake at 1.0667x, test on device, bump C to 1.6 px if needed; never add fainter stars to compensate.
2. **The bevel reads as a vignette.** If the wall highlight is thinner than 2 px or under 35 % luminance the dome collapses into a flat ring and the whole depth claim fails. The lit lower-right arc must be a visible object.
3. **Expression precision.** `[UTC_TIMESTAMP]` (1.8e12) through a float32 path would put 0.5 deg of error on LST; the `DAY_OF_YEAR` + `HOUR_0_23_MINUTE` form above keeps every operand < 1e5 and is exact to 0.01 deg. Verify the engine's numeric type before shipping either.
4. **Moon from mean elements:** <= 2 deg longitude error and 8 phase frames only; honest for a watch, not an ephemeris.
5. **Dragon over the pole.** The official path's ink bbox is estimated (x 166-285, y 47-126 in the moved frame) from the v4 render; Polaris must stay >= 10 px below the lowest ink pixel. Measure the real path and nudge the frame y, never the pole.
6. **The plate hides the zenith.** At the studio sample the Big Dipper is behind the glass at 28 %; at the watch preview the Summer Triangle is. That is physics (the zenith is where the time lives) but a user may feel the best sky is "under" the clock. Mitigation: 72 % not 80 % glass; the southern band y 296-374 is kept open for the ecliptic.
7. **Apparent vs civil solar time.** The sun pointer reads up to 49 min off the digits (equation of time + 32 min longitude). Intended (sundial time); it must be labelled `SOLAR` on the F1 ring or the owner will file it as a bug.
8. **Ambient transition timing is the system's.** The 360 ms back-to-front choreography maps to `Variant startOffset/duration` fractions; the device decides the absolute length, so the ordering survives but the millisecond values do not.
9. **Outline digits do not exist in WFF text.** Roboto Mono Light #91AD80 is the substitute; the AOD lit % must be re-measured with it.
10. **Memory / validator.** Two 512 px and two 450 px bitmaps plus three carriers is more than any previous KALIWATCH face; the memory-footprint check and a 24 h battery run on the SM-R965N are mandatory before calling it done.
11. **It could still look flat if the materials are timid.** Every depth cue here is a contrast: wall highlight vs wall shadow, shadow under the plate vs no shadow, dragon glow vs flat dome. Build them at the stated values first, then reduce; do not start subtle.

## 10. Why it is not flat

v4 was a print: one plane, one ring, one picture of a planet that never moved. v5 is a stack you can see *into*. The deepest level is a real sky for Seoul turning once per sidereal day: in a week you will notice Draco has crept around the pole under the dragon, in a season you will see Orion arrive at the bottom of the window where Scorpius was. Over it sits a machined dome with a bevelled hole; the lit edge of that hole on one side and its shadow falling onto the stars on the other side are what make the sky sit *below* the metal. On the dome's flange a gold sun pointer makes its own slow counter-clockwise lap each day while the day-arc beside it stretches and shrinks with the season, and the real sun, with its own daylight haze, crosses the lower window at noon and slips behind the glass. Above all of that floats a smoked-sapphire plate with its shadow cast on the stars, carrying the phosphor HH:MM; stars still show through it at a quarter brightness, so you read the time and the universe behind it in the same glance. On top, nearest to you, the Kali dragon crest overlaps the dome's rim and glows like the phosphor it is. Six time-scales, three materials, three occlusion chains, and nothing decorative: every motion on the face is something real happening above Seoul, which is exactly what makes a Galaxia a Galaxia and not a star-print wallpaper.

## References used

- JLC press release and coverage of the Master Hybris Artistica Calibre 945 Galaxia / Atomium (dial levels, 46th-parallel sky, anticlockwise sidereal Cosmotourbillon, gold sun pointer with 24 h + zodiac, three flange rings): press.jaeger-lecoultre.com, watchonista.com, timeandwatches.com.
- WFF references: `Variant` (duration/startOffset fractions, interpolation, angleDirection; v4 transitions), `PartImage` (transformable x/y/angle/alpha/scale/tintColor), `Arc` (transformable startAngle/endAngle), source types (`UTC_TIMESTAMP`, `DAY_OF_YEAR`, `HOUR_0_23_MINUTE`, `TIMEZONE_OFFSET_MINUTES_DST` v3, `MOON_PHASE_POSITION`/`MOON_PHASE_TYPE`, `STEP_GOAL`), expression functions (sin/cos/tan/asin/acos/atan/rad/deg/clamp/floor, ternary).
- Astronomy: GMST = 280.46061837 + 360.98564736629 D (IAU 1982 form), sidereal day 86164.0905 s, Seoul 37.57 N 126.98 E UTC+9, Yale Bright Star Catalogue magnitudes, low-precision sun/moon formulae (Meeus-class, errors < 0.5 deg sun, < 2 deg moon).
