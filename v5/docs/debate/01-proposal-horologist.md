# KALIWATCH v5 — "Celestial Vault"
### Proposal 01 — the horologist's lens (Galaxia anatomy translated to a 450 px round face)

Design space 450 x 450, centre (225,225), R = 225. Target Galaxy Watch6 Classic 480 x 480 (1 design px = 1.067 device px, ~0.089 mm). Light source for every baked highlight and shadow: 10:30 o'clock, elevation 35 deg. Nothing below is a shader; everything is a static PNG, a rotated PNG, an arc, or text.

---

## 0. Why v4 reads as one-dimensional

v4 is a *print*: one black plane, a dragon, digits, a tick ring and a planet drawn on it. It has one time scale (seconds on the ring), one rotation sense, no occlusion, no cast shadow, no object that moves slowly enough to be "mechanical", and its one 3-D object (the planet) is cropped so hard that it reads as wallpaper. The Galaxia reads as deep because every physical height on its dial is also a *different clock*: minutes on the outer flange, civil hours on the sunken guilloche ring, 24-hour solar time on the inner flange, the sidereal day on the rotating vault, the zodiac year in the sun's creep across that vault, and a bright flying cage that visits the whole dial once a day. v5 rebuilds KALI as that section, not that print.

## 1. Galaxia part -> v5 part

| Galaxia (physical) | v5 (digital) | Time scale it carries |
|---|---|---|
| Black lacquer base disc with transferred inscriptions | **Lacquer bed** — static bitmap, deepest level, carries the moat shadow and tiny inscriptions | none |
| Outer minute flange (opaline) | **Minute flange** r 218–225, 60 ticks, phosphor minute arc | minutes (6 deg/min) |
| Sunken hour ring, enamel over guilloche, applied indexes | **Sunken hour ring** r 207–217, recessed soleil texture, 12 applied rhodium indexes | civil hour frame (indexes double as 5-min marks for the arc) |
| Inner 24-hour flange (opaline) + golden sun pointer | **Solar ring** hairline r 204.5 with 24 ticks; **Sun** gold disc riding it | 24 h local mean solar time (15 deg/h, anticlockwise) |
| Domed celestial disc, grisaille enamel, star map, constellation names | **Vault** — rotating sky bitmap r 200 (Seoul 37.57 N), static chiaroscuro dome shade on top | sidereal day 23h 56m 04.09s (360.9856 deg/day, anticlockwise) |
| Sun pointer vs. zodiac month | **Zodiac band** baked on the vault at r 186–196; the sun's angle against it is the sun's RA, i.e. the month | tropical year (sun creeps 0.9856 deg/day across the band) |
| Cosmotourbillon (orbits once per sidereal day, cage turns once a minute) | **Cage** 20 px phosphor ring at r 212, locked to RA 0h of the vault; its interior spokes + hand turn 6 deg/s | sidereal day (orbit) + seconds (interior) |
| Grisaille planets | *not reproduced* (planets need ephemerides; WFF cannot) — honesty over decoration | — |
| Hand-engraved 3-D dragons (2024 Dragon edition) | **Official Kali dragon** engraved on the dome apex, phosphor fill with engraving shadow | none |
| Dauphine hands on flange rings | **HH:MM** 78 px Roboto Mono, applied, with cast shadow — the only thing the eye must read | civil time (digital) |
| (no equivalent) | **Moon porthole** 40 px sunken aperture, 29 phase images | lunation 29.53 d |
| (no equivalent) | **Battery / Steps** 240-deg sector gauges flanking the moon | none (telemetry) |

Two senses of rotation on purpose: civil instruments (minute arc, indexes, digits) run clockwise; the celestial level (vault, sun, cage) runs anticlockwise, exactly as a northern sky turns about Polaris and exactly as the Galaxia's cage does. Polaris sits at (225,225) — under the colon.

## 2. Layer stack, back to front

z = draw order (0 first). "Scale" = the real time scale that drives the layer.

| z | Layer | Shows | Scale | Bounds (450 space) | Material (bakeable) | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | **Lacquer bed** (`bed.png`, 450x450 opaque) | black base; moat r 200–203 with the dome's cast shadow on the lower-right (90–200 deg cw, 0 -> 55 % black); flange ring satin; sunken hour ring floor + recess shadow; 24 ticks; 60 minute ticks; 12 applied indexes | none | full disc | matte lacquer #000; flange "opaline" satin #141C17 -> #0E1410 with 1 px vertical brush lines ±4 % L; hour-ring floor #070B08 with 180 radial soleil lines alternating #0A110C/#121B14; recess: 2 px #000 shadow on the top-left inner wall, 1 px #2A3A2D lip highlight on the bottom-right wall; indexes 2.5x8 px #C2CFCB (double at 12), 0.5 px #FFF 40 % top-left edge, 1 px #000 70 % shadow at (+1,+1) | alpha 1 | alpha 0.55 (textures vanish, ticks/indexes stay ≤ 20 % L) |
| 1 | **Vault** (`sky.png` 400x400 RGBA, rotating) | north-polar equidistant sky, dec ≥ −30 deg (r = (90 − dec) x 1.667 px), ≈130 stars mag ≤ 3.0 (Yale BSC/HYG), 20 constellation stick figures, 6 transferred names (URSA MAJOR, CASSIOPEIA, CYGNUS, ORION, LEO, LYRA), Milky Way band, ecliptic hairline, zodiac band r 186–196 with 12 sector ticks + 3-letter names | **sidereal day** (anticlockwise, 0.2507 deg/min) | disc r ≤ 200 centred (225,225) | base #050B0E; stars #C2CFCB sized by magnitude (≤0: 2.6 px, 0–1: 2.1, 1–2: 1.6, 2–3: 1.1), Polaris at centre; lines 0.8 px #C2CFCB 22 %; Milky Way ≤ 14 % L in #0B1E26/#C2CFCB; ecliptic 1 px #E3B35E 30 % dashed; zodiac ticks 1 px #E3B35E 35 %, names 9 px #C2CFCB 40 % (pre-brightened x2.2 so they survive the limb shade) | full image | `sky_aod.png`: 40 brightest stars only at 30 %, same rotation (slow drift = burn-in safe) |
| 2 | **Dome shade** (`dome_shade.png` 400x400, alpha-only black + sheen) | grisaille chiaroscuro that makes the vault a convex dome; rim light on the lit limb | none | disc r ≤ 200 | radial darkening centred at the apex (190,185): L 1.00 @0, 0.92 @100, 0.70 @160, 0.45 @190, 0.15 @200 (baked as black alpha = 1 − L, dithered); enamel sheen: ellipse (175,170) rx 60 ry 40 #C2CFCB 5 %; rim light 1.5 px #C2CFCB 35 % at r 199.5 from 240 deg to 20 deg cw | alpha 1 | alpha 0 (pure black dome at night) |
| 3 | **Solar ring hairline** (in `bed.png` but listed for clarity) | circle r 204.5, 1 px #5B7A5E 55 %, 24 ticks r 203–206, cardinal ticks 1.5 px r 203–207; the hairline is dimmed 50 % across 90–200 deg cw (in the dome's shadow) | 24 h scale | annulus 203–207 | opaline hairline | on | ticks only, hairline off (lit-pixel budget) |
| 4 | **Sun** (`sun.png` 28x28, in a rotating Group) | gold disc Ø13 at r 204.5, 8 rays 1x3 px, glow Ø28 at 18 % | **24 h local mean solar** (anticlockwise; noon at 12 o'clock, midnight at 6) | centre at angle (180 − 15·(t_civil − 0.5347)) deg cw | baked sphere: #F4D08A top-left -> #E3B35E body -> #8A6424 limb; rays #E3B35E 60 % | full | 1 px #E3B35E 45 % outline, no glow ("the sun is a ring at night") |
| 5 | **Cage** (PartDraw group at r 212, rotating) | Ø20 ring 1.5 px phosphor 90 %; interior: 3 spokes 1 px #5B7A5E at 120 deg, hand 1x8 px phosphor, hub dot Ø3 | orbit: **sidereal** (locked to the vault's RA 0h = the First Point of Aries); interior: **seconds** (6 deg/s) | annulus 202–222; cuts across the solar hairline, hour ring and flange exactly as the real cage cuts the Galaxia's rings | vector, no bake; 1 px #000 50 % shadow ring at (+1,+1) under it | ring 90 %, interior on | ring 35 %, interior alpha 0 (no per-second motion) |
| 6 | **Dragon shadow** (`dragon.png` tinted #1E3A17, alpha 60 %) | engraving shadow of the official path, offset (+1,+1.5) | none | frame (136,31.5) 180x123 | tinted copy of the same raster | on | off |
| 7 | **Dragon** (`dragon.png`, official Kali press-pack path rasterised 2x, white, tinted) | the crest, engraved on the dome apex | none | frame (135,30) 180x123 (6 px lower than v4 to clear the solar ring; drawn top at r ≈ 194) | tint #A6F46A alpha 92 % | on | tint #718D61 alpha 85 % (v4 values) |
| 8 | **Inscription** text | `LST 11:50 · SUN IN SCO` 11 px letter-spacing 2, #9BAB9C | sidereal time readout + zodiac | centred x 225, baseline y 160 | transferred white inscription (Galaxia base-disc idea) | on | off |
| 9 | **Date** | `25 OCT / SUN` 17 px #9BAB9C | civil date | x 225, baseline 181 | text | on | #7F9472 |
| 10 | **Digit shadow** | black copy of HH:MM at (+2,+2), alpha 65 % | — | same metrics as z11 | shadow onto the dome's lit apex (visible exactly where mid-tones or stars sit behind) | on | off |
| 11 | **HH:MM** | 78 px Roboto Mono 600 #EFF8EC, colon #A6F46A | civil time | HH x 166, MM x 284, colon x 225 y 248, baseline 252 — unchanged from v4 | applied numerals | fill | outline glyphs (fill #11200F, stroke 1.4 px #91AD80) via bitmap font |
| 12 | **Sub-dial row** | left: battery gauge + `78%`; centre: moon porthole; right: steps gauge + `6240` | battery/steps: none; moon: **lunation** | centres (128,326) (225,326) (322,326), r 28 | gauges: track 2.5 px #17291D from −120 to +120 deg, fill #A6F46A (warning #F3C479 ≤ 15 %); values 19 px #EFF8EC baseline 333; labels 11 px #9BAB9C y 366 (`BAT`, `MOON 15`, `STEPS`); porthole: 48x48 bezel PNG, recess shadow top-left 2 px, lip light bottom-right 1 px #2A3A2D, hole Ø40 showing one of 29 phase PNGs (#C2CFCB face, maria #8E9C98, night side #0B1E26) | on | outlines 1 px 30 %, battery value #7F9472, moon image at 30 %, steps hidden |
| 13 | **Prompt** | `kali@vault:~$ INFINITY` 13 px, INFINITY in phosphor | none | x 225, baseline 389 | text | on | `INFINITY` only, 11 px #7F9472 |
| 14 | **Minute arc** (PartDraw Arc) | r 223.5, 1.5 px #A6F46A 85 %, from 0 deg to 6·minute cw, read against the applied indexes (5 min each) | **minutes** | outer flange | vector | on | 40 % |

Depth planes relative to the digits: the vault + dome shade (z1–2) are the far plane the digits float over; the rings (z0/3/4/5) are the mid plane that never enters r < 203, so nothing but the dragon's crown ever comes within 30 px of the time; the digits (z10–11) are the near plane and the only elements with a cast shadow *and* a moving backdrop. Everything textual stays inside the safe radius 171 (prompt at y 389 is r 164; sub-dial extremes reach r 168).

## 3. Section diagram (A–A through the 10:30 / 4:30 diameter)

```
 height (toward the viewer)
   +3 |                                  ○ CAGE r212 (flying; orbits anticlockwise 1/sidereal day, turns 6°/s)
   +2 |            ██ HH:MM ██  <- applied numerals, cast shadow (+2,+2) onto the dome
   +1 |         ~~~~ KALI DRAGON ~~~~  <- engraved on the dome apex (apex at 190,185)
    0 |    ●SUN r204.5  ▮ index r208-216   ▮ index   ●SUN (12 h later)
   -1 |  ___,-----'''  VAULT r<=200 (grisaille dome, rotating sky)  '''-----,___
   -2 | |‾| sunken hour ring r207-217 (soleil floor, recess shadow)        |‾|
   -3 | ═══ minute flange r218-225 ═══ moat r200-203 ═══ LACQUER BED ═══ flange ═══
      +---------------------------------------------------------------------------> r
       225  218 207 203 200                 0                 200 203 207 218  225

 plan view (anticlockwise = celestial, clockwise = civil)
                      12 (noon sun)
            minute arc ↻         ↺ sun / vault / cage
        18 ·  [cage rides RA 0h]  ·  6
                       0 (midnight)
```

Time-scale ladder: the deeper the layer, the slower its clock. Seconds (cage interior, top) -> minutes (flange arc) -> civil hour (indexes, digits) -> 24 h solar (sun) -> sidereal day (vault, cage orbit) -> month (sun vs zodiac band) -> lunation (porthole, sunk below the bed).

## 4. Composition

| Element | Position (450 space) | Note |
|---|---|---|
| Official dragon | frame x 135, y 30, 180x123 (path untouched) | top of silhouette ≈ r 194; 9 px moat to the solar hairline; sun glow may kiss the horn tips at noon — that is light, not occlusion |
| LST inscription | x 225, baseline 160, 11 px | decoration-class text, hidden in AOD |
| Date | x 225, baseline 181, 17 px | unchanged |
| HH | x 166, baseline 252, 78 px | unchanged; glyph band y 196–252, x 119–213 |
| colon | x 225, y 248, phosphor | Polaris lives under it |
| MM | x 284, baseline 252 | glyph band x 237–331 |
| Digit shadow | (+2,+2), #000 65 % | WFF: second DigitalClock |
| Battery gauge | centre (128,326), r 28, 240 deg from −120 | `78%` 19 px at baseline 333, `BAT` 11 px y 366 |
| Moon porthole | centre (225,326), hole Ø40, bezel 48 | `MOON 15` 11 px y 366 (days since new moon) |
| Steps gauge | centre (322,326), r 28 | `6240` 19 px (no comma: 45 px wide fits the 50 px bore), `STEPS` y 366 |
| Prompt | x 225, baseline 389, 13 px | `kali@vault:~$ INFINITY` |
| Solar hairline | r 204.5 | sun centre radius |
| Cage orbit | r 212 | Ø20 |
| Hour ring | r 207–217 | indexes r 208–216 |
| Minute flange | r 218–225 | arc at r 223.5, ticks r 219–222 |
| Dome limb | r 200 | moat 200–203 |
| Safe text radius | 171 | all text inside; shapes may reach 168 |

Vertical rhythm: dragon 30–153, inscription 160, date 181, time 196–252, 46 px of dome (the lit apex shows through here), sub-dials 298–354, labels 366, prompt 389, dome limb 425.

## 5. Palette

Identity stays: **#A6F46A phosphor** — minute arc, cage, colon, dragon, gauge fill, INFINITY. Existing neutrals stay: #EFF8EC paper (digits, values), #9BAB9C secondary, #34543C / #17291D structure, #F3C479 low-battery warning, AOD greens #11200F / #91AD80 / #718D61 / #7F9472.

Three new controlled hues, each with one job:

| Hex | Name | Role |
|---|---|---|
| **#C2CFCB** | grisaille | the "white enamel painted on dark": stars, constellation lines, transferred names, applied indexes, moon face, dome sheen, rim light. Always used through alpha; never for UI text |
| **#E3B35E** | aurum | the single warm note, reserved for the solar system of time: the sun disc, its rays/glow, the ecliptic hairline, zodiac sector ticks. Never on text, never on telemetry |
| **#0B1E26** | fired enamel | the dark fired layer under the grisaille: dome mid-tones near the limb, Milky Way base, moon night side, cage shadow ring. Where black must read as a *surface* rather than a hole |

Retired from v4: #8CA6B5 starlight and #506E7B / #081419 celestial rim/shade (replaced by grisaille + fired enamel).

## 6. Motion

### 6.1 Wake (AOD -> Active), 360 ms, ease cubic-bezier(.22,1,.36,1), depth-ordered: far plane first, near plane last

| ms | Layer | Property |
|---|---|---|
| 0–140 | z1 vault | alpha 0.35 -> 1 (AOD stars become the full grisaille sky); rotate −2.5 deg -> 0 (the far plane settles — the only parallax kick, deliberately on the deepest layer) |
| 0–140 | z2 dome shade | alpha 0 -> 1 (the disc inflates into a dome) |
| 40–220 | z0/z3 bed, rings, indexes | alpha 0.55 -> 1; recess shadow + index highlights arrive with it |
| 80–300 | z4 sun | tint #5B7A5E -> #E3B35E, glow alpha 0 -> 1, scale 0.85 -> 1 |
| 80–300 | z5 cage | ring 35 -> 90 %; interior alpha 0 -> 1 *at the current second* (no sweep-in) |
| 100–320 | z7 dragon | tint #718D61 -> #A6F46A, alpha 0.85 -> 0.92; z6 engraving shadow alpha 0 -> 0.6 (the dragon lifts off the dome) |
| 120–340 | z11 digits | outline glyph alpha 1 -> 0 over 0–160; filled text alpha 0 -> 1 over 120–340; z10 shadow 0 -> 0.65 over 200–340 (light fills the numerals, then they cast a shadow — depth lands last on the nearest plane) |
| 200–360 | z12 sub-dials | alpha 0 -> 1; studio-only flourish: gauge arcs draw from 0 to value |
| 240–360 | z8 inscription, z13 prompt | alpha 0 -> 1 |

Nothing translates except the −2.5 deg settle of the vault; the time never moves, scales or re-flows. Reduced motion (manual or OS): every value jumps to its final state at 0 ms.

### 6.2 Continuous real-time rotations (no decorative loops)

| Layer | Rate | Period | Sense |
|---|---|---|---|
| vault + cage orbit | 0.25068 deg/min | 23 h 56 m 04.09 s | anticlockwise |
| sun | 0.25 deg/min | 24 h | anticlockwise |
| sun vs zodiac band | 0.9856 deg/day | 365.24 d | anticlockwise on the band |
| minute arc | 6 deg/min | 60 min | clockwise |
| cage interior | 6 deg/s (stepped) | 60 s | clockwise |
| moon | 12.19 deg/day equivalent (one of 29 frames) | 29.53 d | — |

Each second (Active only): the cage interior steps 6 deg. Nothing else changes per second — no colon blink, no twinkle. Each minute: arc, sun, vault, cage orbit, LST text. Each day: moon frame, zodiac text if the sign changed.

### 6.3 Active -> AOD, 180 ms
Cage interior hidden at 0 ms; all other layers ease to their AOD values simultaneously (dome shade to 0, sky to `sky_aod`, digits fill -> outline, shadow off, sun -> outline, telemetry -> outlines). Same ease. Reduced motion: instant.

## 7. AOD

What remains (same composition, same positions): dim dragon (#718D61, 85 %), outline digits (#11200F fill, 1.4 px #91AD80), date #7F9472, 40 brightest stars at 30 % slowly drifting, 24 solar ticks + 12 indexes at ≤ 20 % L, sun as a 1 px gold ring, cage ring at 35 % (no interior), minute arc at 40 %, three sub-dial outlines at 30 % with `78%` and the moon frame at 30 %, `INFINITY` 11 px. Hidden: dome shade, Milky Way/lines/names, inscription, digit shadow, steps, prompt, gauge fills.

Lit-pixel estimate (v4 method: non-zero RGB after 900 -> 450 sampling, anti-aliased edges count): outline digits ≈ 3.8 k px², dragon ≈ 4.7 k, date ≈ 1.0 k, ticks + indexes ≈ 1.1 k, sub-dial outlines ≈ 1.6 k, moon ≈ 1.3 k, stars ≈ 0.4 k, sun + cage ≈ 0.4 k, arc ≤ 1.4 k (worst case at :59), BAT + INFINITY ≈ 1.1 k. Total ≈ 15–17 k px² of a 159 k px² disc = **≈ 9.5–10.5 % non-zero** (v4 measured 11.3 %); luminance-weighted ≈ 3 %, because nothing in AOD exceeds 35 % of its Active brightness. The solar hairline (3.9 k px² with AA) is removed from AOD specifically to stay clear of the 15 % cap.

Burn-in: the only static, continuous AOD elements are the outline digits, the indexes and the dragon, all ≤ 25 % luminance and all green-channel-dominant (the OLED's longest-lived sub-pixel); the stars, sun, cage, arc and moon frame drift or change on their own time scales; the OS pixel-shift stays enabled (nothing is pinned to the bezel edge, 5 px margin at r 220). No element is both bright and still.

## 8. WFF v4 mapping

Shared expressions (Seoul, longitude 126.98 E; `tz` = `[TIMEZONE_OFFSET_MINUTES_DST]/60`, or the literal 9):

```
D   = 365*([YEAR]-2000) + floor(([YEAR]-2001)/4) + [DAY_OF_YEAR] + ([HOUR_0_23_MINUTE] - tz)/24 - 0.5
LST = (280.46061837 + 360.98564736629*D + 126.98) % 360          (degrees, mean sidereal, Seoul)
SKY = (360 - LST) % 360                                            (WFF angle is clockwise)
SUN = (180 - 15*([HOUR_0_23_MINUTE] - 0.5347) + 720) % 360        (0.5347 h = 9 h - 126.98/15)
```
Check at 2026-10-25 10:08 KST: D = 9793.547, LST = 177.4 deg = 11h50m, SKY = 182.6 deg, SUN = 36.0 deg (upper right, 9:36 local mean solar time), sun RA on the band = SUN + LST = 213.4 deg = 14h14m = SCO. `[MOON_PHASE_POSITION]` = 15 (full moon 26 Oct). Precision: 360.9856 x 9794 ≈ 3.5 x 10^6, so even a float32 evaluator keeps the angle within 0.25 deg; the leap-day approximation error is < 0.75 deg.

| z | WFF construction |
|---|---|
| 0 bed | `Scene backgroundColor="#ff000000"` + `PartImage` 450x450 `bed`; `Variant mode="AMBIENT" target="alpha" value="140"` |
| 1 vault | `Group x="25" y="25" width="400" height="400" pivotX="0.5" pivotY="0.5"` with `<Transform target="angle" value="SKY"/>`; inside two `PartImage` 400x400: `sky` (alpha 255 -> AMBIENT 0) and `sky_aod` (alpha 0 -> AMBIENT 255). Angle depends on `[HOUR_0_23_MINUTE]`, so it re-evaluates once per minute |
| 2 dome shade | `PartImage` 400x400 `dome_shade` at (25,25), normal blending (black with alpha = 1 − L is arithmetically a multiply against black, so `blendMode` is not needed); `Variant AMBIENT alpha 0` |
| 3 solar ring | baked in `bed`; AOD version of the bed omits the hairline (`bed_aod` 450x450 swapped by alpha Variant, or the hairline as its own `PartDraw Ellipse` stroke with `Variant AMBIENT alpha 0`) |
| 4 sun | `Group 450x450 pivot 0.5/0.5` with `Transform target="angle" value="SUN"`, containing `PartImage x="211" y="6.5" width="28" height="28"` `sun` (centre (225,20.5) -> r 204.5); AMBIENT: `sun_ring` image via alpha Variants (two images; `tintColor` is transformable from v4 but a Variant on it is unverified, so swap images) |
| 5 cage | `Group 450x450 pivot 0.5/0.5` with `Transform target="angle" value="SKY"` (reuse via `<Reference>`); inside at (215,3) a `PartDraw` 20x20 `Ellipse` stroke #A6F46A 1.5 (AMBIENT alpha 90), and a nested `Group 20x20 pivot 0.5/0.5` with `Transform target="angle" value="[SECOND]*6"` holding three `Line`/`Rectangle` spokes + the 1x8 hand + hub; `Variant AMBIENT alpha 0` on that inner group kills per-second work in AOD |
| 6–7 dragon | two `PartImage` 180x123 of the same 360x246 white raster of the official SVG: shadow copy at (136,31.5) `tintColor="#1E3A17" alpha="150"` (AMBIENT 0); crest at (135,30) `tintColor="#A6F46A" alpha="235"` plus an ambient twin `tintColor="#718D61" alpha="217"` cross-faded by alpha Variants |
| 8 inscription | `PartText` with `Template` `LST %s:%s · SUN IN %s`: `floor(LST/15)`, `floor(((LST/15) % 1)*60)` (pad with `numberFormat`), sign by `Condition` on `[DAY_OF_YEAR]` (ARI 80–109, TAU 110–140, GEM 141–172, CNC 173–203, LEO 204–234, VIR 235–265, LIB 266–295, SCO 296–325, SGR 326–355, CAP 356–19, AQR 20–49, PSC 50–79); `Variant AMBIENT alpha 0` |
| 9 date | `PartText` Template `%s %s / %s` with `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]` as in the existing XML |
| 10 digit shadow | second `DigitalClock` (`hh` / `mm` TimeTexts, same metrics) offset (+2,+2), font colour `#a6000000`; `Variant AMBIENT alpha 0` |
| 11 digits | `DigitalClock` with `TimeText format="hh" hourFormat="24"` right-aligned to x 213 and `format="mm"` left-aligned from x 237, Roboto Mono 78 BOLD #EFF8EC, plus a `PartText` colon #A6F46A at x 225 (keeps the phosphor colon). AOD outline glyphs: `BitmapFonts` -> `BitmapFont name="outline"` with 11 `Character` PNGs (0–9 and `:`, 48x60, fill #11200F stroke #91AD80) used by an ambient `DigitalClock` cross-faded by alpha; fallback if bitmap fonts misbehave: same text in `#7F9472` with a lighter weight |
| 12 sub-dials | gauges: `PartDraw` `Arc centerX=28 centerY=28 width=56 height=56 startAngle="-120" endAngle="120"` track, and a fill `Arc` with `<Transform target="endAngle" value="-120 + 2.4*[BATTERY_PERCENT]"/>` (steps: `-120 + 240*clamp([STEP_COUNT]/[STEP_GOAL],0,1)`); warning colour via `Condition` on `[BATTERY_PERCENT] <= 15`; values `PartText` Templates; moon: `Condition`/`Compare` on `[MOON_PHASE_POSITION]` selecting one of 29 `PartImage` 40x40 frames under a static 48x48 `porthole` bezel image; AMBIENT alpha Variants per element |
| 13 prompt | `PartText` 13 px; `Variant AMBIENT alpha 0`; separate 11 px `INFINITY` `PartText` alpha 0 -> AMBIENT 255 |
| 14 minute arc | `PartDraw` `Arc centerX=225 centerY=225 width=447 height=447 startAngle="0"` with `<Transform target="endAngle" value="[MINUTE]*6"/>`, `Stroke color="#ffa6f46a" thickness="1.5" cap="ROUND"`; `Variant AMBIENT alpha 102` |

Wake sequence in WFF: `Variant` `duration` and `startOffset` are fractions of the device's transition allowance, not milliseconds, so the 360 ms timeline becomes fractions: vault/dome 0.0–0.4, rings 0.1–0.6, sun/cage 0.2–0.85, dragon 0.3–0.9, digits 0.33–0.95, sub-dials/prompt 0.55–1.0, `interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1"`. The absolute 360 ms is a studio value; on the watch the ordering is what survives.

Assets and budget: bed 450² + bed_aod, sky 400² + sky_aod, dome_shade 400², dragon 360x246, sun 28² x2, porthole 48², 29 moon frames 40², 11 outline glyphs 48x60 ≈ 3.3 MB decoded, far inside the validator's 10 MB ambient / 100 MB interactive footprint. Per-second redraw in Active is limited to a 20x20 group; per-minute to the arc, two rotated groups and three texts.

## 9. Risks

1. **2 mm ring stack.** r 203–225 is 22 design px ≈ 2 mm; the three rings must separate by *value* (hairline, recess, satin), not by hue, or they merge into one grey band. Mitigation: verify at 1:1 on the watch; if they merge, drop the soleil texture and keep only recess shadow + indexes.
2. **OLED black crush.** The dome's mid-tones (#0B1E26 ≈ 4 % L) can vanish outdoors; then the depth must come from the rim light, the index shadows, the cage crossing the rings and the sun crossing the rim shadow — all of which are hard edges, not gradients. Dither the shade PNG to avoid banding.
3. **Vault under the digits.** Stars crossing the glyph band cost a little terminal cleanliness. Caps: stars ≤ 2.6 px, Milky Way ≤ 14 % L, no constellation name within r < 120. If it still bothers, a 25 % black soft ellipse (225,228) rx 150 ry 52 on the dome-shade layer is a one-line fix.
4. **Wake timing is device-owned in WFF.** Only the order of the layer reveal is guaranteed, not 360 ms.
5. **Expression evaluator precision and `%` on large numbers** are undocumented; verify `SKY` against the studio for a dozen dates on the emulator before trusting the zodiac read-out.
6. **Hardcoded Seoul.** Longitude 126.98 and the 0.5347 h mean-time offset are constants; travelling east/west makes the vault and the sun wrong by the longitude difference (the tz term keeps the sidereal angle right across time zones, the longitude does not follow). Acceptable for a personal face; say so in the docs.
7. **`MOON_PHASE_POSITION` is an integer day** (0–28): the frame changes once a day in 12 deg steps, as a mechanical moon does.
8. **Anticlockwise sun** can surprise a wearer for a day. The noon-at-top convention and the LST inscription explain it; add a `12` / `0` 9 px pair on the solar ring only if testing shows confusion.
9. **Memory/CPU on the watch is unverified**: three 400–450 px bitmaps plus a rotated 400 px bitmap every minute; measure with the official validator and the emulator before the port.
10. **Variant on `tintColor` / bitmap-font ambient digits** are the two WFF features assumed from the reference but not yet exercised; both have the alpha-cross-fade fallback written in.
11. **Sub-dial values are smaller than v4's 27 px** (19 px). If battery/steps glanceability matters more than the sub-dial row, move the values back to 27 px beside the gauges and shrink the gauges to r 18.

## 10. Why it is not flat

v4 is a drawing on a black sheet. v5 is a cross-section you could cut with a saw: a sunken ring at the bottom, a lacquer bed above it, a domed vault above that, an engraved dragon on the dome's apex, numerals applied over the dome that throw a shadow onto its lit side, and a flying cage above everything that crosses the rings as it travels. One light from 10:30 governs every highlight and every shadow, so the eye never catches the layers contradicting each other. Three occlusions happen *in real time* — the cage covering an index as it passes, the sun dimming when it enters the dome's rim shadow each evening, the moon sitting below the bed inside its porthole — and occlusion is the depth cue the brain trusts most. Two senses of rotation at two speeds coexist on one dial, exactly as on the Galaxia: the civil instruments turn clockwise, the sky turns anticlockwise. And the depth is not decoration; it is information: the nearer the layer, the faster its clock — seconds on top, sidereal time underneath, the year at the very bottom — so that the vault you see behind 10:08 today is the Seoul sky at that instant, the gold sun is on the sign of the month, and the cage you saw at six o'clock this morning will be at twelve tonight. When the wrist rises, the layers arrive from the back forward in 360 ms, and the face stays unmistakably KALI: the official dragon, phosphor on black, a monospace prompt that ends in INFINITY.

## 11. Sample moment (for the studio preview): 2026-10-25 10:08:24 KST, Seoul
LST 11h50m; vault rotated 182.6 deg cw (RA 0h / cage just left of 6 o'clock; Leo on the meridian under the dragon); sun at 36 deg cw (upper right), on SCO; minute arc 0–48 deg; cage hand at 144 deg; moon day 15, full; battery 78 %, steps 6,240.
