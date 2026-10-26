# KALIWATCH v5 "Celestial Vault" — proposal from the WFF-feasibility lens

Author lens: Watch Face Format v4 engineer. Everything below is either a verified WFF v4 capability (reference pages fetched 2026-10-25, listed at the end) or is explicitly marked as an assumption to validate with `wff-validator.jar` / `memory-footprint.jar` and the emulator.

Design space 450x450, centre (225,225), dial radius 225. Target Galaxy Watch6 Classic (SM-R965N), 480x480 round, Wear OS 6 (WFF v4). Angles are WFF convention: degrees clockwise, 0 = 12 o'clock.

---

## 0. The one-sentence concept

**The time sits at the celestial pole; the real Seoul sky wheels around it once per sidereal day, under a dome whose rim, hour plate and dragon are separate planes that occlude it.**

v4 is flat because it is a vertical list (dragon, label, date, time, SEC, telemetry, prompt) printed on black, with one decorative planet clipped at the edge. Nothing in v4 is *behind* anything else, nothing is *driven by* a different clock than the digits, and the only motion is the seconds trail. Galaxia reads as deep because it is a stack of physical levels and each level carries a different time scale. v5 copies that logic, not the look.

What v5 keeps unchanged from v4 because the user liked it: official Kali dragon path, phosphor `#A6F46A`, the word INFINITY, big fixed HH:MM at the same coordinates (hour x166 / minute x284 / baseline y252 / 78 px Roboto Mono), terminal prompt, a 360 ms wake signature with the orbit aligning, quiet AOD with outline digits.

---

## 1. Layer stack (back to front)

Z-order = XML document order. Radii are from (225,225). "Active/AOD" states are built with the documented pattern of paired elements (`<Variant mode="AMBIENT" target="alpha" .../>` on each).

| z | Layer | What it shows | Time scale that drives it | Geometry (450 space) | Material treatment | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | **Vault floor** | the dark enamel floor visible only under the flange rings | none | full dial; RadialGradient `#0B1512` at r186 -> `#000000` at r225 | lacquer over opaline: a gradient, no texture | on | black only |
| 1 | **Sidereal sky disc** | real Northern sky from Seoul (37.57 N): stars to mag 4.5, constellation lines, Milky Way haze, RA ring (24 h ticks) with the 12 zodiac names at the sun's RA for each sign | **sidereal day** 23h56m04s, counter-clockwise, 1 turn | bitmap 384x384 (r192) at x33 y33, pivot (0.5,0.5); pole at the centre; scale 1.72 px per degree; aperture shows rho <= 108 deg (dec >= -18) | grisaille: base `#050B0F`, Milky Way as 3 soft bands `#0E2A33` at 30/45/60 %, stars `#C3D3DA` with 6 px halos for mag <= 1, lines `#2E4A3A` 0.8 px at 60 %, baked rim vignette (-25 % at r>170) | full bitmap | separate bitmap `sky_aod`: stars mag <= 3.5 as 1-2 px `#3F4F55` dots, RA ticks `#2C3A33`, no lines, no haze. Still rotates (0.25 deg/min drift) |
| 2 | **Probe** (Cosmotourbillon analogue) | a phosphor node fixed to the sky frame at RA 0h on the celestial equator (the vernal-equinox point, the origin of the sky), orbiting with the stars; its 60-tick "cage" spins once per minute = the seconds | **sidereal day** for the orbit, **seconds** for the cage | inside the sidereal group at (225, 70.2) i.e. r154.8 at RA 0; core r2.5, glow r7, cage 26x26 | core `#A6F46A`, glow RadialGradient `#A6F46A` -> transparent, cage 12 ticks `#34543C` + one bright tick `#A6F46A` | core + glow + spinning cage | core only `#5E7A55`, no cage |
| 3 | **Moon marker** | moon on the RA ring at its real approximate RA with the real phase glyph | **lunar** (synodic, via `[MOON_PHASE_POSITION]`) | inside the sidereal group; 20x20 glyph at (225,45) i.e. r180, rotated by RA_sun + 12.19 x phase-days | grisaille white `#C3D3DA` lit side, `#1A2328` dark side, 8 phase PNGs | on | on, `#6B7A80` |
| 4 | **Dayglow** | the daytime sky: a soft teal haze around the sun's direction that washes the stars out where the sun actually is | **solar day** 24 h, counter-clockwise | bitmap 450x450 RGBA in the sun group; glow ellipse centred (225,70), radii 190x150, peak alpha 55 % at the centre, warm core `#3A2E14` r40 | enamel haze `#0E2A33`, `blendMode="SCREEN"` (blendMode on PartImage, Wear OS 5.1+) | on | off |
| 5 | **Ground + horizon** | Seoul's north horizon: everything below it is hidden (stars rise at the right edge, set at the left edge, the sun and moon disappear below it at night/day) | none (geometry fixed by latitude) | region outside the circle centre (225,71.8) r217.8: bulges up to y289.6 at the centre, meets the aperture at (42,190) and (408,190) | matte black lacquer `#000000`; horizon hairline 1 px `#34543C`; 10 px extinction band `#0E2A33` at 35 % just above the line | on | on, hairline `#2C3A33` |
| 6 | **Dome rim** | the step from the flange floor down into the vault | none | bevel ring r186-196; inner lip shadow r181-186; outer lip highlight r196-197 | chiaroscuro by SweepGradient: lit NW `#2E4A44`, shade SE `#0B1512`; lip shadow `#000` 60 % | on | one 1 px hairline r186 `#2C3A33` |
| 7 | **24 h solar flange** | 24-hour ring with the **gold sun pointer** that travels once per solar day and points at the sun's RA on the zodiac ring (= Galaxia's sun pointer: solar time + zodiac month in one object) | **24 h solar**, counter-clockwise (north-facing convention: 06 at right/east, 12 top, 18 left/west, 00 bottom) | ring r196-210: 24 ticks 1x4 px at r203; sun pointer: disc r5 + 1.5 px stem r198-208, at angle 188 - 15 x hour | ticks `#17291D`; noon/midnight marks `#D9A441` 60 %; sun RadialGradient `#FFE2A0` -> `#D9A441` -> transparent | on | ticks + sun pointer `#8A6A2C` (dim gold), no glow |
| 8 | **Minute flange** | 60 minute ticks, 12 hour ticks, thin phosphor arc that grows from 12 o'clock to the current minute (the "minute hand") | **minutes** (+ seconds for the arc tip in Active) | ring r212-224; ticks on r218; arc r218, 1.6 px | ticks `#17291D` / `#34543C`; arc `#A6F46A` 72 % | on; the whole group is rotated -14 deg in AOD and aligns to 0 deg on wake (v4 signature) | 12 ticks `#4D633F` + arc `#4D633F` stepped per minute |
| 9 | **Hour plate** | dark glass plate under the digits = Galaxia's sunken hour ring: it guarantees contrast and is the plane that visibly floats above the sky | none | soft ellipse rx128 ry50 centred (225,222); PNG 280x124 at x85 y160 | black 80 % at the centre -> 0 at the edge +12 px; 1 px top-edge highlight `#3A5247` 45 %; baked drop shadow (0,+5, blur 12, 55 %) onto the sky | on; scale 0.975 -> 1.0 on wake | off (digits sit on black) |
| 10 | **HH:MM** | the time | **civil hours/minutes** | hour box x119 y186 w94 h86, minute box x237 y186 w94 h86 (centre x166 / x284, baseline tuned to y252), colon x215 y182 w20 | Roboto Mono 78 SemiBold `#EFF8EC`, `<Shadow color="#A6000000" offsetX="0" offsetY="3" radius="6"/>` so the digits visibly sit above the plate; colon `#A6F46A` | on | AOD clock: fill `#0C160B`, `<Outline color="#91AD80" width="1.4"/>` |
| 11 | **Date** | `25 OCT / SUN` | day | centre x225, baseline y282, 15 px | `#9BAB9C` on the plate's lower skirt | on | `#7F9472` |
| 12 | **Telemetry on the ground** | BATTERY 78 % / STEPS 6,240 with 72 px gauges; prompt `kali@vault:~$ INFINITY` | battery/steps | labels y312 (x133 / x315), values y343 (27 px), gauges y357 (x97-169, x279-351), prompt y389 | as v4; gauge fill `#A6F46A`, warning `#F3C479` at <= 15 % | on | `BAT 78%` y329 `#7F9472`, `INFINITY` y375 11 px letter-spacing 2 |
| 13 | **Dragon relief** | the official Kali dragon as a raised engraved object on the front plane (JLC "Dragon" edition bridge) | none | art bbox 148x110 at x151 y30 (0.9x of v4); PNG with shadow margin 170x134 at x140 y20 | path unchanged, rasterised with: vertical fill `#B9FF7A` -> `#7FBF4E`, 1 px NW rim light `#D6FFA8`, baked drop shadow (0,+5, blur 10, 60 %) onto the sky and the rim | on; scale 0.97 -> 1.0 on wake | `dragon_aod.png`: 1.2 px engraved outline `#5E7A55`, fill `#0A120A` |

Three clearly separated depth planes, each with its own clock: **(A) the sky** (sidereal + lunar + solar dayglow) is the deepest; **(B) the dome/ground/flanges** (solar 24 h, minutes) is the middle; **(C) plate + digits + dragon** (civil time) is the front. Every plane is occluded by the one in front of it with a shadow or a lip, and on wake they move by different amounts.

### ASCII layer diagram

Cross-section (viewer at the top):

```
 viewer
   |
 z13  dragon relief           ~~~~~<KALI>~~~~~  (front plane, casts shadow down onto z1/z6)
 z10  HH:MM + Shadow                1 0 : 0 8    (fixed, never moves or scales)
 z9   hour plate (glass)       ___/==========\___   scale .975 -> 1.0 on wake
 z8   minute flange   |  |                                                  |  |
 z7   24 h flange     |  |  ☼ sun pointer, 1 turn / 24 h, counter-clockwise |  |
 z6   dome rim        |   \_   SweepGradient bevel r186-196             _/   |
 z5   ground          |     \______________ horizon y289.6 ___________/      |
 z4   dayglow         |    ~~~~~~~~~ teal haze on the sun side ~~~~~~~~      |
 z1   sky disc        |  ·  ✦   ·    ✦  ·  ✦   ·   ·  ✦  ·   ✦  ·   ·  ✦    |   1 turn / 23h56m04s, ccw
 z0   vault floor     |_____________________________________________________|
```

Plan view at the sample time 10:08, 25 Oct 2026 (sun pointer 36 deg right of noon, sky rotated 182.6 deg):

```
                    ╭──────────── minute flange r212-224: 60 ticks, arc 12 -> :08 ─────────────╮
               ╭────┤ 24 h flange r196-210:  ☼ sun pointer at 36 deg (10:08 KST)              ├────╮
            ╭──┤    ╰──────────── dome rim r186-196: lit NW, dark SE ─────────────────────────╯    ├──╮
           │   │   ╭────────────────────── aperture r186 ──────────────────────╮                   │   │
           │   │   │  RA ring r174-186 on the sky:  LEO  ·  VIR  ·  LIB (sun)  │                   │   │
           │   │   │      ✦           ~~~ dayglow ~~~    ✦      ·              │                   │   │
           │   │   │   ·        ████ DRAGON (relief, z13) ████       ✦         │                   │   │
           │   │   │ ✦    ·  ╭──────────────────────────────╮   ·     ✦        │                   │   │
           │   │   │     ·   │   1 0 : 0 8   (z10 on z9)    │      ·           │                   │   │
           │   │   │  ✦      ╰──────────────────────────────╯  ✦   ·    ✦      │                   │   │
           │   │   │   ·           25 OCT / SUN        ·                       │                   │   │
           │   │   │ ───────────────── horizon (y 289.6 at centre) ─────────── │  ☾ moon + ● probe  │   │
           │   │   │   BATTERY            │            STEPS                   │  are below the     │   │
           │   │   │   78%   ▂▂▂▂▂▂       │            6,240  ▂▂▂▂            │  ground right now  │   │
           │   │   │           kali@vault:~$ INFINITY                          │                   │   │
```

---

## 2. Composition

- **HH:MM**: unchanged. Hour digits centred x166, minute digits centred x284, baseline y252, 78 px Roboto Mono SemiBold `#EFF8EC`; colon x225 baseline y248 `#A6F46A`. Never scaled, never moved in Active. The digits are *not* inside the plate group, so the plate's wake scale does not touch them.
- **Hour plate** (behind the digits): ellipse rx128 ry50 centred (225,222), soft edge to rx140 ry62. Its opaque core covers the full digit extents (x119-331, y196-252) with >= 65 % black, so the stars under the time are never visible at more than ~12 % of their brightness: contrast stays the v4 contrast.
- **Dragon**: official path, art bbox 148x110 at x151 y30 (bottom at y140). 0.9x of v4 to give the sky 24 px of breathing room between the dragon and the plate (y140-172). If the user vetoes the size, 1.0x at x143 y26 (164x122) still works; the sky band shrinks to 10 px.
- **Date**: `25 OCT / SUN`, 15 px, centred x225, baseline y282 (replaces v4's `SEC 24` slot; the label `KALI / ORBIT` and the date above the time are removed: that is 2 of the 7 list items gone, and the top sky band y140-172 becomes visible).
- **Ground zone** (below the horizon, y >= 290 at the centre, fanning to y190 at x42/x408): BATTERY/STEPS labels y312 at x133/x315, values y343, gauges y357, prompt y389: identical to v4 so the user's muscle memory holds. All of it sits on matte black, never on stars.
- **Safe radius for text**: 171 as before for anything that must be read; the prompt at y389 is 22 characters x 7.8 px = 172 px wide (x139-311) inside the dial chord at that height (x79-371). Telemetry values at y343 are inside the chord x35-415.
- **Depth planes relative to the digits**: sky (z1-4) is >= 2 planes behind the digits and darkened by the plate; the rim/flanges (z6-8) sit outside r186 so they never touch the digits (digit extents reach r = sqrt(106^2 + 29^2) = 110 at most); the dragon (z13) is in front of everything but its shadow margin ends at y147, 39 px above the digits' cap height.
- **Sky visible area**: the annulus between the plate and the aperture, minus the dragon and the ground: roughly 36 % of the dial. Stars rise at (380,225) and set at (70,225) — the two points where the horizon meets the equator — which is exactly what happens when you face north in Seoul.

---

## 3. Palette

Identity stays `#A6F46A` phosphor (dragon, probe, minute arc, gauges, colon, INFINITY). Existing greys stay (`#EFF8EC` paper, `#9BAB9C` quiet, `#34543C` structure, `#17291D` track, `#F3C479` warning, AOD `#91AD80` / `#7F9472` / `#4D633F`).

Three added controlled hues, each with one job:

| Hex | Name | Role | Where it is allowed |
|---|---|---|---|
| `#D9A441` | **solar gold** (tints `#FFE2A0` highlight, `#8A6A2C` AOD) | the Sun: solar/civil-day time | sun pointer, noon/midnight marks, dayglow warm core. Nowhere else. It is the only warm pixel on the face, so the eye finds "where is the sun" instantly. |
| `#C3D3DA` | **starlight** (replaces `#8CA6B5` as the white point; `#8CA6B5` becomes its 60 % tint) | celestial objects | stars, moon lit side, probe-cage halo fringe |
| `#0E2A33` | **enamel teal** (highlight `#2E4A44`, shade `#0B1512`) | grisaille material: the fired dark enamel layers | Milky Way haze, dayglow, dome rim bevel, horizon extinction band |

Everything else is black or a phosphor/grey tint. The face still reads as KALI (green dragon + green terminal) with a teal-black enamel sky and one gold point.

---

## 4. Motion

### 4.1 Wake (AOD -> Active), 360 ms design time, reveal from the deepest plane outward

| t (ms) | layer | property | from -> to | ease |
|---|---|---|---|---|
| 0-200 | sky disc (Active bitmap) | alpha | 0 -> 255 | cubic-bezier(.22,1,.36,1) |
| 0-200 | sky disc (AOD bitmap) | alpha | 255 -> 0 | same |
| 0-360 | minute flange (Active group) | angle, alpha | -14 deg -> 0 deg, 0 -> 255 (the v4 "orbit aligns" signature) | same, clockwise |
| 60-300 | dayglow | alpha | 0 -> 255 | same |
| 80-320 | dome rim bevel | alpha | 0 -> 255 (AOD hairline 255 -> 0) | same |
| 80-320 | hour plate | alpha, scaleX/Y | 0 -> 255, 0.975 -> 1.0 | same |
| 120-360 | dragon relief | alpha, scaleX/Y | 0 -> 255, 0.97 -> 1.0 (AOD outline 255 -> 0) | same |
| 120-340 | digits | fill/outline | AOD outline clock alpha 255 -> 0, Active clock alpha 0 -> 255 (same glyphs, same coordinates, so it reads as the digits "filling") | same |
| 160-360 | telemetry, gauges, prompt, date colour | alpha | 0 -> 255 | same |
| 200-360 | sun pointer glow, probe glow + cage | alpha | 0 -> 255 | same |

The parallax is the depth cue: the sky does not scale, the plate scales 2.5 %, the dragon 3 %. At the dragon's edges that is 4-5 px of travel in 240 ms, enough to read as "the front plane comes toward you", not enough to read as a zoom.

### 4.2 Real-time rotations (slow, allowed in both modes)

| object | period | direction | deg per minute | px per minute at its radius |
|---|---|---|---|---|
| sky disc + RA ring + probe orbit + moon | sidereal day 23h56m04s | counter-clockwise | 0.2507 | 0.84 at r192 |
| sun pointer + dayglow | solar day 24 h | counter-clockwise | 0.25 | 0.89 at r203 |
| zodiac reading (sun pointer vs RA ring) | tropical year | sun drifts clockwise along the ring | 0.00068 (0.986 deg/day) | 3.2 px per day |
| moon marker along the RA ring | synodic month 29.53 d | clockwise relative to the stars | 0.0085 (12.19 deg/day) | 38 px per day |
| minute arc | hour | clockwise | 6 | 22.8 at r218 |

### 4.3 Every second (Active only)

- probe cage: `angle = [SECOND] * 6`, with `<Animation duration="0.25" interpolation="EASE_OUT"/>` so each tick settles mechanically (the tourbillon beat).
- minute arc tip: `endAngle = [MINUTE] * 6 + [SECOND] * 0.1`.
- nothing else. No colon blink, no twinkle, no scan line, no loop.

### 4.4 Active -> AOD

Same Variants in reverse. WFF v4 Variant animation is symmetric (one `duration`/`startOffset` per Variant for both directions, no per-direction value documented), so the 180 ms "shorter return" of v4 cannot be expressed; the AOD entry will take the same fraction of the device's transition as the wake. The studio keeps 180 ms as the design intent and the WFF port accepts symmetric timing. The scale Variants return the plate/dragon to 0.975/0.97 as they fade, which looks like the planes "sinking back" into the dome.

### 4.5 Reduced motion

WFF has no reduced-motion data source. Provide `BooleanConfiguration id="reduce_motion"` (editor toggle); a `Condition` on `[CONFIGURATION.reduce_motion] == "TRUE"` selects a duplicate of the Variant-bearing groups with `duration="0"`, no angle/scale Variants, no probe-cage `Animation`. Bitmaps are shared (same `resource` names), so memory does not double. The studio additionally honours `prefers-reduced-motion` and goes instant.

---

## 5. AOD

What remains (all on black): AOD sky bitmap (dim star dots + RA ticks, still rotating), probe core, moon marker (dim), ground horizon hairline, dome hairline r186, 24 h ticks + dim gold sun pointer, 12 minute ticks + stepped minute arc (group at -14 deg), outline digits, date, `BAT 78%` y329, `INFINITY` y375, engraved dragon outline. No plate, no dayglow, no glow, no cage, no gauges, no prompt.

Lit-pixel estimate (dial area pi x 225^2 = 159,043 px; a pixel counts as lit when max(R,G,B) > 24, which is why the AOD digit fill moves from v4's `#11200F` to `#0C160B`):

| element | lit px | % |
|---|---|---|
| outline digits 4 glyphs x ~380 px + colon 53 | ~1,570 | 1.0 |
| dragon engraved outline 1.2 px x ~1,600 px path | ~1,900 | 1.2 |
| AOD stars (~90 visible above the horizon) + 24 RA ticks | ~300 | 0.2 |
| 12 minute ticks + minute arc (average half-hour) | ~950 | 0.6 (1.1 max) |
| 24 h ticks + dim sun pointer | ~160 | 0.1 |
| dome hairline r186 + horizon hairline (114 deg of r217.8) | ~1,600 | 1.0 |
| date, BAT, INFINITY | ~770 | 0.5 |
| moon + probe core | ~45 | 0.03 |
| **total** | **~7,300** | **~4.6 %** (~7 % if the dragon is dim-filled `#3E5438` instead of outlined) |

Budget: target <= 8 %, hard limit 15 % (Wear OS quality guideline). Headroom is deliberate; AOD must look like the same instrument asleep, not a second design.

Burn-in strategy:
1. No AOD pixel above ~45 % luminance except the digit outline `#91AD80`, and the digits change every minute.
2. The whole AOD content group drifts: `Transform target="x" value="([MINUTE] % 20 < 10 ? [MINUTE] % 10 : 10 - [MINUTE] % 10) * 0.3"` and `target="y"` on `[HOUR_0_23] % 2` + minute, giving a +-3 px triangular wander over 20 min / 2 h with one re-evaluation per minute. This is the only situation where HH:MM moves, it is <= 3 px, and the brief allows slow drift in AOD. Samsung's own AOD pixel shift stacks on top.
3. The sky and the minute arc are inherently non-static. The dragon outline and the hairlines are the static risk; they are the dimmest elements (`#5E7A55`, `#2C3A33`).
4. No per-second data source in any AOD-visible element.

---

## 6. Astronomy, as WFF expressions (Seoul 37.57 N, 126.98 E, KST = UTC+9)

Scale: 1.72 px/deg, pole at the bitmap centre, RA 0h at the bitmap's 12 o'clock, RA increasing clockwise (that is the correct chirality for a chart viewed from inside the sphere, facing north). The sky then rotates counter-clockwise with time, as the real sky does around Polaris. Star (RA a, dec d) is painted at `(225 + 1.72(90-d) sin a, 225 - 1.72(90-d) cos a)` in the bitmap's own 450 frame.

**Local sidereal time** (GMST at 2026-01-01 00:00 UT = 100.66 deg; GMST rate 360.98565 deg/day; + 126.98 deg longitude; - 9 h zone):

```
LST_deg = 92.27 + 0.98565 * (([YEAR]-2026) * 365.25 + [DAY_OF_YEAR] - 1) + 15.04107 * [HOUR_0_23_MINUTE]
```

Check at the sample 2026-10-25 10:08 KST: DAY_OF_YEAR 298 -> LST = 92.27 + 292.74 + 152.42 = 537.43 -> 177.4 deg = 11h50m. Independent check: GMST at 01:08 UT on Oct 25 is about 3h24m = 51 deg, + 127 deg = 178 deg. Agrees.

**Sky disc angle** (WFF, clockwise): `theta_sid = (360 - LST mod 360) mod 360` = 182.6 deg at the sample. RA 0h (probe) is then at the bottom under the ground; it transits at ~22:20, which is correct for late October (Pegasus high at 22 h).

**Sun pointer** (mean sun, longitude-corrected: mean noon at 12:32 KST): `theta_sun = 188.0 - 15 * [HOUR_0_23_MINUTE]` (mod 360). 06:00 -> 98 deg (right, east), 12:32 -> 0 (top), 18:00 -> 278 deg (left, west), 00:00 -> 188 (bottom, under the ground). At the sample: 36 deg.

**Sun's RA** (for the zodiac ring layout and the moon), once per day:

```
lam    = 281.16 + 0.98565*([DAY_OF_YEAR]-1) + 1.915*sin(rad(357.73 + 0.9856*([DAY_OF_YEAR]-1)))
RA_sun = lam - 2.466*sin(rad(2*lam))
```

Checks: equinox 2026-03-20 (DAY 79) -> lam = 359.9. Sample Oct 25 -> lam 211.8, RA_sun 209.5 deg; in the sky frame that is 209.5 - 177.4 = +32 deg clockwise of the top, 4 deg from the mean-sun pointer at 36 deg (that 4 deg is the equation of time, +16 min on Oct 25; the design accepts it).

**Zodiac names on the RA ring** at the sun's RA entering each sign: ARI 0, TAU 27.9, GEM 57.8, CNC 90, LEO 122.2, VIR 152.1, LIB 180, SCO 207.9, SGR 237.8, CAP 270, AQR 302.2, PSC 332.1 deg. Because the ring is fixed to the stars and the pointer is the sun, the pointer reads the current sign at every moment, exactly as on the Galaxia.

**Moon marker angle inside the sidereal group**: `theta_moon = RA_sun + 12.19 * [MOON_PHASE_POSITION]` (mod 360). Full moon (position 14-15) lands 180 deg from the sun: on the meridian at midnight. Accuracy +-10 deg (integer days + declination ignored), fine for a 20 px marker.

Timezone-general variant (if the user travels): replace `15.04107 * [HOUR_0_23_MINUTE]` with `15.04107 * ([HOUR_0_23_MINUTE] - [TIMEZONE_OFFSET_MINUTES_DST] / 60)` and the constant 92.27 with 227.64; the longitude stays Seoul's (the chart is Seoul's horizon anyway).

Catalogue for the studio JS: HYG / Yale BSC5 to mag 4.5 (about 900 stars, ~520 inside dec >= -18), constellation lines from the Stellarium "modern" sky-culture set, J2000 coordinates (precession to 2026 is 0.36 deg, ignorable at 1.72 px/deg).

---

## 7. WFF v4 mapping, layer by layer

Verified element/attribute facts used: `PartImage`/`PartDraw`/`Group` have transformable `x y width height pivotX pivotY angle alpha scaleX scaleY`, `tintColor` from v4; `Transform target value mode(TO|BY)` with optional `<Animation duration interpolation controls angleDirection repeat fps>`; `Variant mode="AMBIENT" target value duration(0-1) startOffset interpolation controls angleDirection`; `Arc centerX centerY width height startAngle endAngle direction` with `startAngle/endAngle` transformable and exactly one `Stroke`; `Ellipse` with one `Stroke` or `Fill`; `Stroke color thickness dashIntervals dashPhase cap join`, `color` transformable from v4; `Fill`/`Stroke` accept `LinearGradient`/`RadialGradient`/`SweepGradient` (`SweepGradient centerX centerY startAngle endAngle colors positions direction`, `RadialGradient centerX centerY radius colors positions`); `Font` accepts `Shadow(color offsetX offsetY radius)`, `Outline(color width)`, `OutGlow`, `Upper`; `blendMode` on `PartText/PartImage/PartAnimatedImage/PartDraw` from Wear OS 5.1; data sources `[SECOND] [MINUTE] [HOUR_0_23_MINUTE] [DAY_OF_YEAR] [YEAR] [MOON_PHASE_POSITION](0-28 days) [MOON_PHASE_TYPE](0-7) [BATTERY_PERCENT] [STEP_COUNT] [STEP_GOAL] [TIMEZONE_OFFSET_MINUTES_DST](v3)`; functions `sin cos rad deg clamp floor abs %`.

```xml
<WatchFace width="450" height="450" clipShape="CIRCLE">
<Scene backgroundColor="#ff000000">

<!-- z0 vault floor: no bitmap -->
<PartDraw name="floor" x="0" y="0" width="450" height="450">
  <Ellipse x="0" y="0" width="450" height="450">
    <Fill color="#ff000000">
      <RadialGradient centerX="225" centerY="225" radius="225"
        colors="#ff0b1512 #ff0b1512 #ff000000" positions="0 0.83 1"/>
    </Fill>
  </Ellipse>
</PartDraw>

<!-- z1-3 sidereal frame: one Group rotated by theta_sid -->
<Group name="sidereal" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
  <Transform target="angle" value="((360 - ((92.27 + 0.98565 * (([YEAR] - 2026) * 365.25 + [DAY_OF_YEAR] - 1) + 15.04107 * [HOUR_0_23_MINUTE]) % 360)) % 360 + 360) % 360"/>
  <PartImage name="sky_active" x="33" y="33" width="384" height="384">
    <Variant mode="AMBIENT" target="alpha" value="0" duration="0.55" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
    <Image resource="sky_active"/>
  </PartImage>
  <PartImage name="sky_aod" x="33" y="33" width="384" height="384" alpha="0">
    <Variant mode="AMBIENT" target="alpha" value="255" duration="0.55"/>
    <Image resource="sky_aod"/>
  </PartImage>
  <!-- z2 probe at RA 0h, equator: (225, 70.2) -->
  <Group name="probe" x="0" y="0" width="450" height="450">
    <PartDraw name="probe_glow" x="218" y="63" width="14" height="14">
      <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.55" duration="0.45"/>
      <Ellipse x="0" y="0" width="14" height="14">
        <Fill color="#ffa6f46a"><RadialGradient centerX="7" centerY="7" radius="7" colors="#c0a6f46a #00a6f46a" positions="0 1"/></Fill>
      </Ellipse>
    </PartDraw>
    <PartDraw name="probe_core" x="222.5" y="67.7" width="5" height="5">
      <Ellipse x="0" y="0" width="5" height="5"><Fill color="#ffa6f46a"/></Ellipse>
      <!-- AOD: tint the core down; Fill color is transformable from v4, but keep it simple: pair with an AOD twin at #5E7A55 -->
    </PartDraw>
    <PartImage name="probe_cage" x="212" y="57" width="26" height="26" pivotX="0.5" pivotY="0.5">
      <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.55" duration="0.45"/>
      <Transform target="angle" value="[SECOND] * 6"><Animation duration="0.25" interpolation="EASE_OUT"/></Transform>
      <Image resource="probe_cage"/>
    </PartImage>
  </Group>
  <!-- z3 moon: a 450-wide mostly transparent glyph image rotated about the dial centre (memory is counted after transparent-pixel cropping) -->
  <Condition>
    <Expressions><Expression name="ph"><![CDATA[[MOON_PHASE_TYPE]]]></Expression></Expressions>
    <!-- 8 Compare blocks, one per phase; each: -->
    <Compare expression="ph" value="4">
      <PartImage name="moon_full" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
        <Transform target="angle" value="(((281.16 + 0.98565 * ([DAY_OF_YEAR] - 1) + 1.915 * sin(rad(357.73 + 0.9856 * ([DAY_OF_YEAR] - 1)))) - 2.466 * sin(rad(2 * (281.16 + 0.98565 * ([DAY_OF_YEAR] - 1) + 1.915 * sin(rad(357.73 + 0.9856 * ([DAY_OF_YEAR] - 1)))))) + 12.19 * [MOON_PHASE_POSITION]) % 360 + 360) % 360"/>
        <Image resource="moon_4"/>  <!-- glyph painted at (225,45) in the 450 frame -->
      </PartImage>
    </Compare>
    <!-- ... -->
  </Condition>
</Group>

<!-- z4 + z7 solar frame: one Group rotated by theta_sun -->
<Group name="solar" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
  <Transform target="angle" value="((188.0 - 15 * [HOUR_0_23_MINUTE]) % 360 + 360) % 360"/>
  <PartImage name="dayglow" x="0" y="0" width="450" height="450" blendMode="SCREEN">
    <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.15" duration="0.65" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
    <Image resource="dayglow"/>   <!-- glow centred (225,70), transparent elsewhere -->
  </PartImage>
  <!-- the sun pointer is drawn later (z7) but must rotate with this group: put the whole flange-level sun in a second Group with the same Transform, after the ground and rim (see z7) -->
</Group>

<!-- z5 ground: everything outside the circle centre (225,71.8) r217.8, painted as a thick black stroke; the dial clip removes the rest -->
<PartDraw name="ground" x="0" y="0" width="450" height="450">
  <Ellipse x="-73.9" y="-227.1" width="597.8" height="597.8">
    <Stroke color="#ff000000" thickness="162.2"/>   <!-- covers radii 217.8 .. 380 -->
  </Ellipse>
  <Arc centerX="225" centerY="71.8" width="435.6" height="435.6" startAngle="123" endAngle="237">
    <Stroke color="#ff34543c" thickness="1"/>        <!-- horizon hairline, AOD twin #2C3A33 -->
  </Arc>
  <Arc centerX="225" centerY="71.8" width="425.6" height="425.6" startAngle="123" endAngle="237">
    <Stroke color="#590e2a33" thickness="10"/>       <!-- extinction band just above the horizon, Active only -->
  </Arc>
</PartDraw>
<!-- If the validator rejects negative shape coordinates, fallback: ground.png 450x240 RGBA at y210 (~430 KB). -->

<!-- z6 dome rim, bitmap-free chiaroscuro -->
<PartDraw name="rim" x="0" y="0" width="450" height="450">
  <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.2" duration="0.7"/>
  <Ellipse x="41.5" y="41.5" width="367" height="367"><Stroke color="#99000000" thickness="5"/></Ellipse>   <!-- inner lip shadow r181-186 -->
  <Ellipse x="34" y="34" width="382" height="382">
    <Stroke color="#ff16231f" thickness="10">       <!-- bevel r186-196 -->
      <SweepGradient centerX="225" centerY="225" startAngle="0" endAngle="360"
        colors="#ff2e4a44 #ff0b1512 #ff16231f #ff0b1512 #ff2e4a44" positions="0 0.35 0.6 0.85 1"/>
      <!-- tune startAngle so the bright stop sits at the upper-left (315 deg); the sweep origin convention must be checked in the emulator -->
    </Stroke>
  </Ellipse>
  <Ellipse x="28.5" y="28.5" width="393" height="393"><Stroke color="#ff2a3a35" thickness="1"/></Ellipse>   <!-- outer lip highlight r196.5 -->
</PartDraw>
<PartDraw name="rim_aod" x="0" y="0" width="450" height="450" alpha="0">
  <Variant mode="AMBIENT" target="alpha" value="255" duration="0.5"/>
  <Ellipse x="39" y="39" width="372" height="372"><Stroke color="#ff2c3a33" thickness="1"/></Ellipse>
</PartDraw>

<!-- z7 24 h flange: ticks by dashIntervals on a circle, gold sun pointer in a solar-rotated group -->
<PartDraw name="flange24" x="0" y="0" width="450" height="450">
  <Ellipse x="22" y="22" width="406" height="406">
    <Stroke color="#ff17291d" thickness="4" dashIntervals="1 52.15" dashPhase="0.5"/>   <!-- 24 ticks on r203, circumference 1275.5 -->
  </Ellipse>
</PartDraw>
<Group name="sun_pointer" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
  <Transform target="angle" value="((188.0 - 15 * [HOUR_0_23_MINUTE]) % 360 + 360) % 360"/>
  <PartDraw name="sun" x="213" y="10" width="24" height="24">
    <Ellipse x="0" y="0" width="24" height="24">
      <Fill color="#ffd9a441"><RadialGradient centerX="12" centerY="12" radius="12" colors="#ffffe2a0 #ffd9a441 #00d9a441" positions="0 0.4 1"/></Fill>
    </Ellipse>
    <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.55" duration="0.45"/>
  </PartDraw>
  <PartDraw name="sun_aod" x="220" y="17" width="10" height="10" alpha="0">
    <Variant mode="AMBIENT" target="alpha" value="255" duration="0.5"/>
    <Ellipse x="0" y="0" width="10" height="10"><Fill color="#ff8a6a2c"/></Ellipse>
  </PartDraw>
</Group>

<!-- z8 minute flange: Active group rotated -14 in AOD, aligning to 0 on wake -->
<Group name="flange60" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
  <Variant mode="AMBIENT" target="angle" value="-14" duration="1.0" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1" angleDirection="CLOCKWISE"/>
  <Variant mode="AMBIENT" target="alpha" value="0" duration="1.0"/>
  <PartDraw name="ticks60" x="0" y="0" width="450" height="450">
    <Ellipse x="7" y="7" width="436" height="436"><Stroke color="#ff17291d" thickness="6" dashIntervals="1.5 21.33"/></Ellipse>    <!-- 60 ticks, circumference 1369.7 -->
    <Ellipse x="7" y="7" width="436" height="436"><Stroke color="#ff34543c" thickness="9" dashIntervals="2 112.14"/></Ellipse>    <!-- 12 ticks -->
    <Arc centerX="225" centerY="225" width="436" height="436" startAngle="0" endAngle="0">
      <Transform target="endAngle" value="[MINUTE] * 6 + [SECOND] * 0.1"/>
      <Stroke color="#b8a6f46a" thickness="1.6" cap="BUTT"/>
    </Arc>
  </PartDraw>
</Group>
<PartDraw name="flange60_aod" x="0" y="0" width="450" height="450" alpha="0">
  <Variant mode="AMBIENT" target="alpha" value="255" duration="0.6"/>
  <Ellipse x="7" y="7" width="436" height="436"><Stroke color="#ff4d633f" thickness="6" dashIntervals="1.25 112.9"/></Ellipse>
  <Arc centerX="225" centerY="225" width="436" height="436" startAngle="0" endAngle="0">
    <Transform target="endAngle" value="[MINUTE] * 6"/>
    <Stroke color="#ff4d633f" thickness="1.25"/>
  </Arc>
</PartDraw>

<!-- z9 hour plate -->
<PartImage name="plate" x="85" y="160" width="280" height="124" pivotX="0.5" pivotY="0.5">
  <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.2" duration="0.7" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
  <Variant mode="AMBIENT" target="scaleX" value="0.975" startOffset="0.2" duration="0.7"/>
  <Variant mode="AMBIENT" target="scaleY" value="0.975" startOffset="0.2" duration="0.7"/>
  <Image resource="hour_plate"/>
</PartImage>

<!-- z10 digits: Active clock with Shadow, AOD clock with Outline, same boxes -->
<Group name="clock_active" x="0" y="0" width="450" height="450">
  <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.3" duration="0.6"/>
  <DigitalClock x="119" y="186" width="212" height="86">
    <TimeText format="hh" hourFormat="24" align="CENTER" x="0" y="0" width="94" height="86">
      <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffeff8ec"><Shadow color="#a6000000" offsetX="0" offsetY="3" radius="6"/></Font>
    </TimeText>
    <TimeText format="mm" align="CENTER" x="118" y="0" width="94" height="86">
      <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffeff8ec"><Shadow color="#a6000000" offsetX="0" offsetY="3" radius="6"/></Font>
    </TimeText>
  </DigitalClock>
  <PartText name="colon" x="215" y="182" width="20" height="86"><Text align="CENTER"><Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffa6f46a"><![CDATA[:]]></Font></Text></PartText>
</Group>
<Group name="clock_aod" x="0" y="0" width="450" height="450" alpha="0">
  <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0.3" duration="0.6"/>
  <DigitalClock x="119" y="186" width="212" height="86">
    <TimeText format="hh" hourFormat="24" align="CENTER" x="0" y="0" width="94" height="86">
      <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff0c160b"><Outline color="#ff91ad80" width="1.4"/></Font>
    </TimeText>
    <TimeText format="mm" align="CENTER" x="118" y="0" width="94" height="86">
      <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff0c160b"><Outline color="#ff91ad80" width="1.4"/></Font>
    </TimeText>
  </DigitalClock>
</Group>

<!-- z11 date -->
<PartText name="date" x="125" y="268" width="200" height="20">
  <Localization calendar="GREGORIAN" timeZone="SYNC_TO_DEVICE"/>
  <Text align="CENTER"><Font family="roboto_mono" size="15" color="#ff9bab9c">
    <Upper><Template><![CDATA[%s %s / %s]]><Parameter expression="[DAY_Z]"/><Parameter expression="[MONTH_S]"/><Parameter expression="[DAY_OF_WEEK_S]"/></Template></Upper>
  </Font></Text>
</PartText>

<!-- z12 telemetry on the ground (Active) and the AOD pair -->
<Group name="telemetry" x="0" y="0" width="450" height="450">
  <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.45" duration="0.55"/>
  <!-- BATTERY / STEPS PartTexts at the v4 coordinates; gauges: -->
  <PartDraw name="bat_gauge" x="97" y="356" width="72" height="2">
    <Rectangle x="0" y="0" width="72" height="2"><Fill color="#ff17291d"/></Rectangle>
    <Rectangle x="0" y="0" width="0" height="2">
      <Transform target="width" value="72 * [BATTERY_PERCENT] / 100"/>
      <Fill color="#ffa6f46a"><Transform target="color" value="[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(166,244,106)"/></Fill>
    </Rectangle>
  </PartDraw>
  <PartDraw name="step_gauge" x="279" y="356" width="72" height="2">
    <Rectangle x="0" y="0" width="72" height="2"><Fill color="#ff17291d"/></Rectangle>
    <Rectangle x="0" y="0" width="0" height="2"><Transform target="width" value="72 * clamp([STEP_COUNT] / [STEP_GOAL], 0, 1)"/><Fill color="#ffa6f46a"/></Rectangle>
  </PartDraw>
  <!-- prompt: two PartTexts, "kali@vault:~$ " #9BAB9C and "INFINITY" #A6F46A, baseline y389 -->
</Group>
<Group name="telemetry_aod" x="0" y="0" width="450" height="450" alpha="0">
  <Variant mode="AMBIENT" target="alpha" value="255" duration="0.5"/>
  <!-- "BAT %s%%" y329 #7F9472 17 px; "INFINITY" y375 11 px letterSpacing 0.18 -->
</Group>

<!-- z13 dragon relief, last so it occludes everything -->
<PartImage name="dragon_active" x="140" y="20" width="170" height="134" pivotX="0.5" pivotY="0.5">
  <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.3" duration="0.7" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
  <Variant mode="AMBIENT" target="scaleX" value="0.97" startOffset="0.3" duration="0.7"/>
  <Variant mode="AMBIENT" target="scaleY" value="0.97" startOffset="0.3" duration="0.7"/>
  <Image resource="dragon_relief"/>
</PartImage>
<PartImage name="dragon_aod" x="140" y="20" width="170" height="134" alpha="0">
  <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0.3" duration="0.7"/>
  <Image resource="dragon_engraved"/>
</PartImage>

</Scene>
</WatchFace>
```

Notes on the mapping:
- The AOD drift (section 5) wraps every `*_aod` element plus `clock_aod` in one `Group name="aod_root"` with the two `Transform`s on `x`/`y`; Active elements stay outside it.
- `Upper` on the date is a documented `Font` inner element; `MONTH_S`/`DAY_OF_WEEK_S` are localized, so the studio's fixed English abbreviations become the device locale's. If the user wants English only, use `Localization` with a fixed locale or `icuText`.
- The dragon is rasterised once from the unchanged official SVG (Inkscape, already in the build pipeline: `design/build_motion_assets.py`), with the relief filters baked. The path itself is never edited.
- Element order is also the ambient memory order: static background first, the moving sky in the middle, dynamic digits/flanges last, as the memory guide recommends.

### Memory budget (450-space pixels; multiply by 1.138 for the 480 px device)

| resource | size | bytes |
|---|---|---|
| sky_active.png 384x384 RGBA8888 | 147,456 px | 590 KB |
| sky_aod.png 384x384 RGBA8888 (or a white-on-alpha PNG tinted with `tintColor`) | 147,456 px | 590 KB |
| dayglow.png 450x450 RGBA, ~400x300 after transparent-crop | 120,000 px | 480 KB |
| hour_plate.png 280x124 RGBA | 34,720 px | 139 KB |
| dragon_relief.png + dragon_engraved.png 170x134 RGBA | 2 x 22,780 px | 182 KB |
| probe_cage.png 26x26, moon_0..7 20x20 | ~4,000 px | 16 KB |
| roboto_mono.ttf (unprocessed size counted) | | ~110 KB |
| **interactive total** | | **~2.1 MB (~2.4 MB at 480)** of 100 MB |
| **ambient**: 3 assumed full-screen layers (3 x 450x450x4 = 2.4 MB; 2.8 MB at 480) + font | | **~2.9 MB** of 10 MB |

Everything else (floor, ground, rim, both flanges, sun, probe core/glow, gauges) is `PartDraw` and costs no bitmap memory.

---

## 8. Risks

1. **Shape coordinates outside the PartDraw box / negative values** (ground ellipse at x=-73.9). Not documented either way. Fallback is a 450x240 ground PNG (~430 KB), no design change.
2. **SweepGradient start convention and `%` on floats / `sin()` in radians** are not spelled out in the reference. All angles are normalised with `(... % 360 + 360) % 360`; if `sin` turns out to take degrees, drop `rad()`. Verify with the validator and one emulator screenshot per quadrant before baking the zodiac labels.
3. **The flat-again failure mode**: if the three occlusion shadows (dragon drop shadow, plate drop shadow, rim lip shadow) are baked too soft (< 40 % opacity) or the parallax scale is reduced below 2 %, the stack collapses back into a print. The shadows and the 0.975/0.97 scales are load-bearing, not polish.
4. **Daytime look**: the dayglow sits over the upper sky most of the hours the user actually looks at the watch. If the teal haze reads as "dirty" at 55 % on the real AMOLED, cap it at 40 % and keep the warm core; never remove it, because it is the layer that makes the face change across the day.
5. **Variant symmetry**: WFF v4 Variants animate both directions with one `duration`, so v4's shorter 180 ms return cannot be ported. Accept the symmetric transition or, if the runtime visibly lags on AOD entry, shorten all Variant durations to 0.75.
6. **Expression re-evaluation**: `[HOUR_0_23_MINUTE]` re-evaluates every minute (sky, sun, dayglow, moon and probe groups redraw once a minute: fine). `[SECOND]` is confined to `flange60` and `probe_cage`, both alpha 0 in AOD; confirm with the device that no per-second ambient work happens (screencap is black in doze on this watch, so use battery drain over a night as the measure).
7. **Legibility of 8 px zodiac labels and 1 px ticks**: decoration only by the brief's own threshold; nothing the user needs is below 11 px.
8. **Counter-clockwise 24 h ring** may surprise people who expect a 24 h dial to run clockwise. It is physically consistent with the sky (east = right when facing north). Offer a `BooleanConfiguration` "conventional 24 h" that mirrors the sun group (`scaleX="-1"`) if the user dislikes it.
9. **Samsung runtime quirks**: `com.samsung.wear.watchface.runtime` hosts WFF; `blendMode="SCREEN"` and `SweepGradient` must be checked on the device, not just the emulator. If `SCREEN` is unsupported, the dayglow works with `SRC_OVER` at 45 % alpha.
10. **Accuracy honesty**: the sidereal expression is good to ~1 deg over 4 years, the sun pointer ignores the equation of time (<= 4 deg), the moon marker is +-10 deg. The face should say so in `docs/ASTRONOMY.md`; it is an instrument, not an almanac.

---

## 9. Why it is not flat

v4 was one surface: a list printed on black with a planet pasted at the edge. v5 is a stack you can see *through*. At the back, the real Seoul sky rotates once per sidereal day around the pole that sits under the digits; a star that rises at the right edge of the dome at 22:00 will set at the left edge before dawn, and the moon sits on the ring at its real place and phase. In front of that sky, the dome rim is lit from the upper left and throws a shadow down onto the stars, the ground hides everything below the horizon, and the gold sun walks the flange once a day while the daylight haze follows it across the vault. In front of the dome float the hour plate and the dragon, each throwing its own shadow onto the sky, and the digits throw theirs onto the plate. When the watch wakes, the sky lights first, then the rim and plate push forward by 2.5 %, then the dragon by 3 %: three planes moving three different amounts is the same parallax your eye uses to judge depth in the real world. Every ring is driven by a different clock: seconds on the probe's cage, minutes on the outer flange, civil time in the digits, the solar day on the gold pointer, the sidereal day on the sky, the month on the zodiac under the sun, the lunar month on the moon. That is the Galaxia's logic, built from WFF bitmaps rotated by expressions, arcs, gradients and text shadows, and it is still unmistakably Kali: the phosphor dragon on top, the terminal prompt on the ground, INFINITY at the bottom.

---

## 10. Sources verified for the WFF claims (fetched 2026-10-25)

- Transform: developer.android.com/reference/wear-os/wff/common/transform/transform (target/value/mode; Animation child)
- Animation: .../reference/wear-os/wff/common/transform/animation (duration, interpolation, controls, angleDirection, repeat, fps)
- Variant: .../reference/wear-os/wff/common/variant/variant (AMBIENT only; duration/startOffset 0-1; interpolation incl. CUBIC_BEZIER; angleDirection)
- Group / PartImage / PartDraw / PartAnimatedImage attribute pages (transformable x,y,width,height,pivotX,pivotY,angle,alpha,scaleX,scaleY; tintColor v4)
- Arc, Ellipse, Stroke, Fill, SweepGradient, RadialGradient pages (gradients as Fill/Stroke children; dashIntervals/dashPhase/cap/join)
- Font, Outline, Shadow pages (Outline color+width; Shadow color/offsetX/offsetY/radius)
- Blend modes: .../reference/wear-os/wff/common/attributes/blend-mode (Part* only, Wear OS 5.1+)
- Data sources: .../training/wearables/wff/common/attributes/source-type (time, DAY_OF_YEAR 1-366, MOON_PHASE_POSITION 0-28 days, MOON_PHASE_TYPE 0-7, STEP_GOAL, TIMEZONE_OFFSET_MINUTES_DST v3)
- Expressions: .../training/wearables/wff/expressions and .../common/attributes/arithmetic-expression (functions incl. sin/cos/rad/deg/clamp, `%`; re-evaluation frequency follows the data sources used)
- Memory: .../training/wearables/wff/memory-usage (10 MB ambient / 100 MB interactive; RGBA 4 bytes per px after crop/resize; three assumed ambient layers; order hands/complications last; arcs instead of frame sequences)
- Ambient: .../training/wearables/wff/ambient (15 % lit pixels; paired elements with Variant)
- Release notes: .../training/wearables/wff/release-notes (v4: ambient transitions, color transforms, Reference; v5: blendMode on Group, Stroke join)
- Galaxia: press.jaeger-lecoultre.com "Master Hybris Artistica Calibre 945" (levels, grisaille, 46th parallel, sidereal cosmotourbillon, sun pointer, 24 h / hour / minute rings)
