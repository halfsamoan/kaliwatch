# KALIWATCH v5 "Celestial Vault" — material proposal (3D / chiaroscuro lens)

Author lens: 3D material artist. Everything below is written to be baked into layered PNG + a few vector parts for a 480 px round OLED, portable to Watch Face Format v4 with no JavaScript on the watch.
Design space 450 x 450, centre C = (225,225), R = 225. Angles are clock angles: 0 deg = 12 o'clock, positive = clockwise (WFF `angle` convention). Device scale = 480/450 = 1.0667.

Verified before writing: WFF data sources (`YEAR`, `DAY_OF_YEAR`, `SECONDS_IN_DAY`, `TIMEZONE_OFFSET_MINUTES_DST`, `MOON_PHASE_POSITION` 0-28 d, `MOON_PHASE_TYPE` 0-7, `SECOND`, `MINUTE`, `BATTERY_PERCENT`, `STEP_COUNT`), expression functions (`sin cos asin floor fract clamp`, `%` for modulo, `rad()/deg()`, no `fmod`), Transform targets (`x y width height pivotX pivotY angle alpha scaleX scaleY`), Variant (`mode="AMBIENT"`, `startOffset`/`duration` are 0..1 fractions of the device transition, interpolation `CUBIC_BEZIER` with `controls`), memory budget (ambient 10 MB, interactive 100 MB; ALPHA_8 bitmaps count 1 byte/px), and the Galaxia construction (black lacquer base with transferred inscriptions, gold dome sections around a grisaille-enamel celestial disc, opaline minute and 24-hour flanges around a sunken guilloche hour ring, a gold sun pointer, anticlockwise sidereal Cosmotourbillon, 46th-parallel sky).

---

## 0. The one-sentence idea

Polaris sits exactly under the colon. The whole northern sky, painted in grisaille, turns anticlockwise around the digits once per sidereal day inside a domed, side-lit vault; a gold sun circles the vault's trench once per solar day and crosses the zodiac painted on the sky; the real moon rides the ecliptic with its real phase; two brushed gunmetal flanges step up around the vault; the official dragon floats above the zenith as a lit phosphor relief casting a shadow onto the stars; the time is printed on the glass above all of it.

Seven real time scales in five physical planes: seconds (bead), minutes (arc), civil hour (digits), 24 h solar (sun bead), sidereal day (sky disc), month / zodiac (true sun against the ecliptic ring), lunar (moon sprite + phase).

---

## 1. Layer stack (back to front)

Plane heights are the fiction the shading sells: bed -3, dome rim -1 rising to 0 at the pole, inner flange +1, bevel, outer flange +2, dragon relief +2, glass print +3. Key light comes from 10:30 (315 deg), elevation ~35 deg; every baked highlight and occlusion obeys that one light.

| z | Layer | Shows | Time scale | Geometry (450 space) | Material / bake | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | `void` | Scene background | none | full disc | `#000000` | on | on |
| 1 | `bed_aventurine` | Lacquer floor seen only at the bottom of the trench | none | annulus r194-205 (bake as 450x450, RGB565 OK) | ground `#05080C` -> `#0B1117`, copper flecks `#D9A85C` 1 px, alpha .15-.45, ~3 per degree, 6 % of them 2 px `#F0CB8A` alpha .55. No animation ever. | alpha 1 | alpha 0 |
| 2 | `sky_disc` | Grisaille star map, N-polar azimuthal-equidistant, pole at C, scale s = 1.633 px/deg, edge = dec -30 deg (r196). RA 0h at 12 o'clock, RA increases clockwise (looking-up chart: S at 12, E at 3, W at 9, N at 6). | sidereal day: angle = 360 - LST, i.e. CCW 0.250684 deg/min, 360 deg per 23h56m04s | disc r196, pivot C | see section 1.1 (grisaille build). Active: RGBA 392x392 (418 px on device, 0.7 MB; 1.5x = 1.6 MB optional). | rotates, alpha 1, scale 1.0 | `sky_ambient` ALPHA_8 + tint `#8FA3B2`, stars m<=3.0 only, alpha .5, same rotation, scale .965 |
| 3 | `true_sun`, `moon` | Live bodies painted on the sky plane: the sun at its real ecliptic position (zodiac reading), the moon at its approx. position with its real phase | sun: 24 h solar + month/zodiac; moon: lunar (synodic 29.53 d) | sun sprite 12 px at r = s*(90-decSun) (109-185 px), moon sprite 18 px at r = s*(90-decMoon) | sun: `#F0CB8A` core r3, gold halo `#D9A85C` 0.45 -> 0 over r6. Moon: 8 phase sprites, bone `#E6E1D2` lit side, dark side `#1A1F24` alpha .85, 1 px limb shade on the SE edge, baked spherical shading (lit from 10:30 regardless of phase: enamel painting convention). | on | sun bead only (see z5); moon = 1 px outline `#8FA3B2` alpha .45 |
| 4 | `dome_light` | The static lighting that makes the dome a dome: glaze, terminator, Fresnel rim, central well, horizon haze, trench AO | none (observer-fixed; encodes Seoul 37.57 N horizon) | 450x450 RGBA, static, never rotates | see section 1.2 | alpha 1 | alpha 0 except the horizon hairline, which is duplicated into `flange_ambient` |
| 5 | `sun_bead` | Gold sun travelling the trench: the Cosmotourbillon analogue, one bright slow object | 24 h apparent solar time: angle = thetaSun = RAsun - LST (CCW 0.25 deg/min; 12 = solar noon, 3 = sunrise side, 9 = sunset side) | 16 px sprite centred at r199.5 (inside the trench r196-203), pivot C | disc r4.5 `#F0CB8A` with `#D9A85C` edge, 6 baked ray ticks 2 px, halo r8 alpha .35. Drawn under the flange so the halo is clipped by the flange edge = "sits in the channel". | alpha 1 | alpha .5 |
| 6 | `flange` | Two stepped brushed-gunmetal rings with 60 engraved ticks, 24 trench dots, bevel, 12 applied indices | none | inner flange r203-214 (+1), bevel r214-217, outer flange r217-225 (+2), trench dots r199.5 every 15 deg 1 px `#3B4347` | base `#1A1F22`, circular brushing noise +/-4 %, 60 ticks r206-211 (1 px groove `#0A0D0F` + 0.6 px lit edge `#4A555A`, lit edge on the NW side only), 5-minute ticks r205-212 1.6 px; bevel: 2 px highlight `#8C9A98` alpha .5 on arc 240->30 deg, 2 px shade `#000` alpha .6 on arc 60->210 deg, both feathered 1 px; step AO: 1 px `#000` alpha .5 at r213-214 on the shade arc; indices 12 x (2.5 x 5 px) `#B9C4C0` at r219-224 with 0.5 px top highlight `#E4ECE9`. | `flange_active` alpha 1, angle -6 -> 0 on wake | `flange_ambient` ALPHA_8 + tint `#55605E`: bevel glint arc 240->30 only (2 px), 12 indices at 40 %, horizon hairline |
| 7 | `minute_arc`, `seconds_bead` | Phosphor arc 0 -> minute angle in the tick groove; seconds bead + 3 ghost beads | minutes / seconds | arc r208 thickness 1.6; bead r3.3 at r208; ghosts at -6/-12/-18 deg | vector, `#A6F46A`; arc alpha .8; ghosts alpha .50/.28/.12. Reads as a lit groove because it sits exactly on the engraved tick radius. | on | off |
| 8 | `dragon_relief` | Official Kali dragon as a lit phosphor relief with its own cast shadow on the dome | none | box x153 y30 w144 h107.4 (official viewBox 5 22 126 94 scaled 1.143; path unchanged); zenith (225,139.4) sits under its belly | 5 bake passes, section 1.3; PNG 160x124 incl. shadow margin | `dragon_relief` alpha .96 | `dragon_line`: 1.2 px contour stroke of the same path, `#5E7A52`, ALPHA_8 + tint |
| 9 | `digit_shadow` | Drop shadow of HH:MM on the dome | civil time | same glyphs offset (+2,+3) | DigitalClock copy, `#000000` alpha .6 (no blur available; the 2-3 px hard offset reads as a 4 px air gap at this size) | on, arrives last in wake | off |
| 10 | `digits` | HH:MM, Roboto Mono 78 semibold | civil hour/minute | hour centre x166, colon x225 (baseline 248), minute centre x284, baseline 252; glyph box ~y195-252, x119-331 | `#EFF8EC`; colon `#A6F46A` | filled | BitmapFont outline glyphs 48x60: fill `#11200F`, stroke 1.4 px `#91AD80` (v4 look kept) |
| 11 | `text` | date, BATTERY / STEPS labels, values, gauges, divider, prompt | day; live sensors | section 2 | Roboto Mono; `#9BAB9C` quiet, `#EFF8EC` values, gauges `#A6F46A`, warning `#F3C479` | on | date `#7F9472`, `BAT 78%` at value row, `INFINITY` |

Everything from z4 up is drawn after the two live sky sprites, so the sun and moon receive the same haze and the same light as the stars: that is what keeps them on the sky plane instead of looking like stickers.

### 1.1 Grisaille build of `sky_disc` (bake order, all static)

Grisaille = dark fired ground, white enamel painted on top, thicker = lighter. Translate literally into value passes; keep saturation under 15 % so the only hues on the face are phosphor, gold, cold enamel and (rarely) amber.

1. Ground: radial gradient from `#0A1016` (pole) -> `#121A22` (r150) -> `#0C1218` (r196); 2 % monochrome grain.
2. Aventurine flecks on the ground: ~700 1 px points `#D9A85C`, alpha .12-.45 random, density 0 inside r40 ramping to full at r120 (density is a function of radius only, so it is rotation-invariant and can live on the rotating disc). They rotate with the sky at 0.25 deg/min; they never twinkle.
3. Milky Way: galactic equator (node RA 18h51m, inclination 62.9 deg; brightest toward Sagittarius at the SE edge, dark Cygnus-Aquila rift). Three soft brush passes 46 / 28 / 14 px wide, white at .05 / .07 / .09, multiplied by a cloud-noise mask so values land between 3 % and 22 %; tint = 60 % `#8FA3B2` + 40 % white. Inside r110 multiply by .5 (legibility under the digits; still rotation-invariant).
4. Constellation lines: 0.8 px `#3D4C56` alpha .5 for 18 constellations (UMa, UMi, Cas, Cep, Dra, Cyg, Lyr, Aql, Boo, Leo, Gem, Ori, Tau, Aur, Per, And, Peg, CMa). Decoration at 40 mm, exactly like the transferred lines on the enamel.
5. Stars: Yale BSC to mag 4.0, dec > -30 (~200 stars). m<=0.5: core r2.2 + halo r5 at .25; m<=1.5: r1.8 + halo r4 at .18; m<=2.5: r1.4; m<=3.5: r1.0 alpha .75; m<=4.0: r0.8 alpha .55. Spectral tint, desaturated: O/B `#DCE8F2`, A/F `#F2F4F0`, G/K `#F0E4D0`, M `#E8CFB8`. Within r130 of the pole multiply alpha by .6. Minimum core 1.4 px for anything meant to survive rotation resampling.
6. Transferred inscriptions: constellation names 7 px uppercase tracking 1.5 `#4A5964` alpha .6 (texture, not information, same as JLC's month names on the base).
7. Ecliptic: the off-centre circle (dec +23.44 at r108.7 ... -23.44 at r185.3), 1 px dashed 3/3 `#7A6A48` alpha .5; 12 zodiac glyphs 9 px `#8A7A52` alpha .7 at sign centres (lambda = 15, 45, ... 345 deg). The true sun sprite (z3) crosses this ring: that is the month/zodiac reading.

Anchor stars for verification (r from C, clock angle before rotation = RA in degrees): Polaris r1.2 @ 37.9; Dubhe r46.1 @ 165.9; Alkaid r66.4 @ 206.9; Capella r71.9 @ 79.2; Deneb r73.0 @ 310.4; Vega r83.6 @ 279.2; Pollux r101.2 @ 116.3; Arcturus r115.6 @ 213.9; Aldebaran r120.0 @ 69.0; Regulus r127.4 @ 152.1; Altair r132.5 @ 297.7; Betelgeuse r134.9 @ 88.8; Procyon r138.4 @ 114.8; Rigel r160.4 @ 78.6; Spica r165.2 @ 201.3; Sirius r174.3 @ 101.3; Antares r190.1 @ 247.4.

### 1.2 `dome_light` (the layer that makes it not flat)

All static, one PNG with alpha, drawn above the rotating sky and the live sprites:

- Specular glaze: radial, centre (168,150), r150, white alpha .11 -> 0 (ease-out). The convex dome catching the key light.
- Terminator: radial, centre (262,262), black alpha 0 inside r70 -> .46 at r196. The far side of the dome falling away.
- Fresnel rim: annulus r188-196, white alpha = .04 + .12 * max(0, cos(theta - 315 deg)). Bright on the lit side, barely there on the dark side: curvature.
- Trench ambient occlusion: r196-203, black alpha .72 at r196 -> .30 at r199.5 -> .72 at r203 (U profile). The floor (bed flecks) is visible at the bottom of the U at 30 %: depth you can see into.
- Horizon haze (Seoul 37.57 N): the part of the chart below the local horizon. In this projection the horizon runs through W (78,225), N-point (225,286.4) and E (372,225); the bake uses the exact curve, a circle centred (225,78) r208 is within 2 px. Below it: `#05080C` alpha .45, feather 5 px, plus a 1.2 px hairline `#8FA3B2` alpha .28 (the Earth's rim). Stars rise over it on the east and set under it on the west in real time; the moon and the true sun sink into it at night.
- Central well: ellipse centre (225,250) rx126 ry86, black alpha .40 at centre -> 0, feather 36 px. Where the glass print sits; keeps the digits clean without hiding the sky.

### 1.3 `dragon_relief` (official path only, used as a mask)

a. Cast shadow: path filled `#000`, translated (+3,+5), Gaussian blur 6, alpha .55. Falls on the dome: the dragon hovers ~4 px above the stars.
b. Body: path filled with a 315 deg -> 135 deg linear gradient `#C9FF93` -> `#A6F46A` -> `#7CBB4C`, 3 % brushed noise.
c. Rim light: (path minus path translated (+1,+1)) filled `#EEFFD6` alpha .7: the NW-facing edges only.
d. Shade edge: (path minus path translated (-1,-1)) filled `#2E4D24` alpha .8: SE-facing edges.
e. Composite silhouette equals the original path to the pixel; translations only derive edge masks.
AOD version: contour stroke 1.2 px `#5E7A52` of the same path, no fill (engraved line).

```
                 GLASS PRINT  (+3)  HH:MM, date, telemetry, prompt   [never moves, never scales]
                 ..................  digit shadow (+2,+3) falls onto the dome
      DRAGON RELIEF (+2)  phosphor, NW rim light, SE shade, shadow (+3,+5) on the stars
 =======  OUTER FLANGE r217-225 (+2)  12 applied indices
   \__    BEVEL r214-217  highlight 240->30 deg, shade 60->210 deg
      ====  INNER FLANGE r203-214 (+1)  60 engraved ticks; minute arc + seconds bead in the groove r208
          \_/  TRENCH r196-203  AO walls, aventurine floor (-3) visible 30 %, SUN BEAD rides here (24 h)
             .----------------- CELESTIAL DOME r0-196 (-1 rim -> 0 pole) -----------------.
             |  grisaille sky disc, rotates CCW 0.2507 deg/min about (225,225)           |
             |  true sun + moon on the sky; static dome_light above: glaze NW, terminator  |
             |  SE, Fresnel rim, horizon haze below (225,286), central well under digits  |
 ~~~~~~~~~~~~~~~~~~~~~  AVENTURINE LACQUER BED (-3)  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                         key light 10:30 (315 deg), elevation 35 deg, one light for every bake
```

---

## 2. Composition

| Element | Position (450 space) | Size / colour |
|---|---|---|
| Official dragon | box x153 y30 w144 h107.4; shadow +3,+5 | relief, phosphor family |
| Date `25 OCT / SUN` | centre x225, baseline y174 | 16 px `#9BAB9C` |
| HH | centre x166, baseline y252 | 78 px semibold `#EFF8EC` |
| colon | x225, baseline y248 | 78 px `#A6F46A` |
| MM | centre x284, baseline y252 | 78 px `#EFF8EC` |
| digit shadow | same glyphs, +2,+3 | `#000` alpha .6 |
| BATTERY / STEPS labels | centres x150 / x300, baseline y296 | 12 px `#9BAB9C` |
| values `78%` / `6,240` | centres x150 / x300, baseline y322 | 24 px `#EFF8EC`; battery <= 15 % -> `#F3C479` |
| gauges | y334, x118-182 and x268-332, 2 px; track `#17291D` | `#A6F46A` |
| divider | x225, y292-336, 1 px | `#34543C` |
| prompt `kali@vault:~$ INFINITY` | centre x225, baseline y380 | 13 px `#9BAB9C`, INFINITY `#A6F46A` |
| seconds bead / minute arc | r208 | phosphor |
| sun bead | r199.5 | gold |
| indices | r219-224 | gunmetal highlight |

Safe text radius: every text bounding box stays inside r178 (inside the Fresnel rim at r188 and clear of the trench). The prompt is the limiting case: 155 px below C, half-width 86 px, corner distance 177 px.

Depth planes relative to the digits: the digits are the highest plane (printed on the glass). Under them, in order: their shadow, the dragon relief (above the dragon only), the flanges (outside r203, so they never touch the digits), the lit dome, the sky. Readability is guaranteed three ways that are all rotation-safe: the star-alpha cap inside r130 baked into the disc, the central well in `dome_light`, and the digit shadow. Nothing under the digits is brighter than ~18 % luminance except a star core, and the glyph strokes are 9 px wide.

Vertical rhythm: dragon 30-137, gap 25, date 162-174, gap 21, digits 195-252, gap 32, labels 284-296, values 304-322, gauges 334, prompt 368-380. The telemetry rows land inside the below-horizon haze (y > 286 at the centre line), which is physically the Earth: the dark band is justified, not a vignette.

Preview state (2026-10-25 10:08:24 KST, verified by hand): LST 177.3 deg (RA 11h49m on the meridian: Leo high at the top), sun lambda 211.6 deg = Scorpio, RA 13h58m, dec -12.1 deg, thetaSun = +32 deg (bead between 12 and 1 o'clock, solar noon 12:16 KST), true sun at (314,84) above the horizon; moon age 13.6 d (full on the 26th), lambda 17 deg = Aries, at (181,354) below the horizon haze, which is correct for a nearly full moon at ten in the morning.

---

## 3. Palette

Identity: phosphor `#A6F46A` (seconds bead, minute arc, gauges, dragon body, colon, INFINITY). Tints of it stay in-family: `#C9FF93` relief light, `#7CBB4C` relief shade, `#5E7A52` AOD dragon line, `#91AD80` AOD digit outline, `#11200F` AOD digit fill.

Three controlled additional hues, no more:
1. Solar gold `#D9A85C` (light `#F0CB8A`): sun bead, true sun, zodiac glyphs (desaturated to `#8A7A52`), aventurine flecks. The one warm object, like JLC's gold sun pointer.
2. Cold enamel `#8FA3B2`: star and Milky Way tint, horizon hairline, moon outline in AOD, constellation lines (`#3D4C56` is this hue at 20 % value). The grisaille.
3. Amber `#F3C479`: warning only (battery <= 15 %). Never decorative.

Neutrals (not hues): void `#000000`, paper `#EFF8EC`, quiet text `#9BAB9C`, structure `#34543C`, track `#17291D`, grisaille ground `#0A1016` / `#121A22`, gunmetal `#1A1F22` / `#2A3135` / `#55605E` / `#8C9A98`, moon bone `#E6E1D2`.

---

## 4. Motion

Ease everywhere: cubic-bezier(.22,1,.36,1) = WFF `CUBIC_BEZIER controls="0.22 1 0.36 1"`. Wake total 360 ms; WFF fractions are ms/360 (`startOffset`, `duration`).

Wake, AOD -> Active (reveals depth back to front):

| ms | layer | property |
|---|---|---|
| 0-140 | z2 sky | ambient disc alpha 1->0; active disc alpha 0->1; Group scaleX/scaleY .965->1.0 about C (the dome rises toward you) |
| 40-200 | z4 dome_light | alpha 0->1: the light switches on; this is the frame where the stack becomes three-dimensional |
| 60-260 | z6 flange | active alpha 0->1 with angle -6 -> 0 deg; ambient flange alpha 1->0 (60-180) |
| 60-240 | z5 sun bead, z3 sprites | bead alpha .5->1; moon outline -> shaded sprite crossfade |
| 120-320 | z8 dragon | line alpha 1->0 (120-260); relief (shadow baked in) alpha 0->1 |
| 140-320 | z10 digits | outline BitmapFont alpha 1->0 (140-300); filled DigitalClock alpha 0->1 |
| 220-360 | z9 digit shadow | alpha 0->.6, last: the digits lift off the dome at the end |
| 200-360 | z7 minute arc + seconds | alpha 0->1; arc angle -14 -> 0 deg (the v4 orbit-alignment signature, kept on the vector arc) |
| 240-360 | z11 telemetry, prompt | alpha 0->1 (80 ms after the digits, as in v4); AOD-only BAT / INFINITY alpha 1->0 over 0-120 |

Only three things move during wake: the sky scales 3.5 %, the flange turns 6 deg, the minute arc turns 14 deg. HH:MM never moves or scales.

Active -> AOD, 180 ms: dome_light alpha 1->0 first (0-100: the stack visibly flattens into the dark), telemetry / prompt / arc / seconds / digit shadow 1->0 (0-120), then the crossfades sky, flange, dragon, digits (40-180), BAT / INFINITY 0->1 (100-180). WFF note: one Variant per attribute serves both directions, so the exit uses the same startOffset/duration fractions against the device's exit transition.

Real-time rotations (never perceptible, always running):
- Sky disc: 360 deg per 23h56m04.09s = 0.250684 deg/min, anticlockwise (angle = 360 - LST).
- Sun bead and true sun: 0.25 deg/min anticlockwise; the true sun also drifts +0.9856 deg/day along the ecliptic relative to the stars (one zodiac sign per month).
- Moon: hour angle 0.2415 deg/min anticlockwise; +13.2 deg/day along the ecliptic; phase sprite swaps at day boundaries.
- Flanges, dragon, lighting, bed: never rotate.

Each second (Active): seconds bead steps to `[SECOND]*6` (stepped, no sub-second animation); the three ghost beads follow at fixed -6/-12/-18 deg offsets, so the comet tail costs no animation. Minute arc end angle = `[MINUTE]*6 + [SECOND]*0.1`. No blinking cursor, no twinkle, no loops.

Reduced motion: studio honours `prefers-reduced-motion` with every duration 0. WFF cannot read the OS setting, so ship a `BooleanConfiguration` "Wake animation" (default on) that selects, via `Condition`, a parallel Group tree whose Variants have `duration="0"`.

---

## 5. AOD

What remains, same positions, same silhouettes: ambient sky disc (stars m<=3.0, ~90, cold enamel alpha .5, still rotating 0.25 deg/min), horizon hairline 1 px alpha .25, flange glint arc 240->30 deg 2 px `#55605E` + 12 indices at 40 %, sun bead at 50 %, moon 1 px outline, dragon contour line `#5E7A52` 1.2 px, outline digits (`#11200F` fill, `#91AD80` 1.4 px), date `#7F9472`, `BAT 78%` on the value row (y322), `INFINITY` 11 px tracking 2 at y380. Hidden: bed, dome_light, flange body, dragon fill, digit shadow, seconds, minute arc, steps, gauges, prompt.

Lit-pixel estimate (non-black count over 159,043 px): stars 90 x 4 = 360; dragon contour ~2,500 px path x 1.2 = 3,000; digit outlines 4 x ~260 px contour x 1.4 = 1,460 + colon 80; glint arc 1,130; indices 180; horizon hairline ~600; date 430; BAT 250; INFINITY 150; bead + moon 95. Total ~7,700 px = 4.8 %. Upper bound with a 1.5 px dragon stroke: ~6 %. v4 was ~11 %; the limit is 15 %.

Burn-in strategy: nothing static above 22 % luminance (dragon line and glint arc are the brightest static items, both thin); the brightest things in AOD are the ones that move (stars, sun bead, moon drift 0.24-0.25 deg/min; digits change every minute); a +/-2 px pseudo-random walk on the whole AOD group driven by `[MINUTE]` (`x = (([MINUTE]*7) % 5) - 2`, `y = (([MINUTE]*3) % 5) - 2`), on top of the system's own ambient burn-in offset; no element at full intensity in AOD at all.

---

## 6. WFF v4 mapping

Shared expressions (declare once as `<Expressions>` on the Scene, reference in Transforms):

```
D       = 365*([YEAR]-2000) + floor(([YEAR]-1)/4) - 499 + [DAY_OF_YEAR] - 1.5
          + ([SECONDS_IN_DAY] - 60*[TIMEZONE_OFFSET_MINUTES_DST])/86400        // days since J2000.0
LST     = (280.46061837 + 0.98564736629*D + 360*fract(D) + 126.98 + 720) % 360  // split keeps float32 sane
g       = (357.528 + 0.9856003*D) % 360
lam     = (280.460 + 0.9856474*D + 1.915*sin(rad(g)) + 0.020*sin(rad(2*g))) % 360
RAsun   = lam - 2.4657*sin(rad(2*lam)) + 0.0530*sin(rad(4*lam))
decSun  = deg(asin(0.39777*sin(rad(lam))))
thSun   = RAsun - LST                                                             // clock angle of the sun
age     = fract((D - 5.26)/29.530589)*29.530589     // or [MOON_PHASE_POSITION] (1-day steps)
lamMoon = (lam + 12.1907*age + 6.29*sin(rad(134.963 + 13.064993*D)) + 720) % 360
RAmoon  = lamMoon - 2.4657*sin(rad(2*lamMoon)) + 0.053*sin(rad(4*lamMoon))
decMoon = deg(asin(0.39777*sin(rad(lamMoon))))
thMoon  = RAmoon - LST
```
Check (2026-10-25 01:08 UTC): D = 9793.547, LST = 177.3 deg, lam = 211.6 deg, RAsun = 209.5 deg, decSun = -12.1 deg, thSun = +32 deg, age 13.6 d. Trig is in radians (`rad()` wraps every argument); `%` replaces `fmod`; the `+720` guards negative operands.

| Layer | WFF construction |
|---|---|
| z0 void | `<Scene backgroundColor="#ff000000">` |
| z1 bed | `PartImage` 450x450 RGB565 PNG, `Variant AMBIENT alpha 0` |
| z2 sky | `Group x=29 y=29 w=392 h=392 pivotX=.5 pivotY=.5` with `<Transform target="angle" value="(360 - LST + 720) % 360"/>`; inside, `PartImage sky_active.png` (`Variant AMBIENT alpha 0`) and `PartImage sky_ambient.png` ALPHA_8 with `tintColor #8FA3B2`, `alpha 0` + `Variant AMBIENT alpha 128`; optional `Variant AMBIENT scaleX/scaleY .965` on the Group |
| z3 true sun | `PartImage` 12x12, `Transform x = 225 + 1.633*(90-decSun)*sin(rad(thSun)) - 6`, `Transform y = 225 - 1.633*(90-decSun)*cos(rad(thSun)) - 6` |
| z3 moon | `Condition` on `[MOON_PHASE_TYPE]` 0..7 selecting one of 8 `PartImage` 18x18 sprites, each with the same x/y Transforms from thMoon/decMoon; ambient outline sprite via `Variant` |
| z4 dome_light | one static `PartImage` 450x450 RGBA, `Variant AMBIENT alpha 0` (startOffset .11, duration .44) |
| z5 sun bead | `Group` full-size `pivot .5/.5`, `<Transform target="angle" value="(thSun + 720) % 360"/>`, `PartImage` 16x16 at (217,17.5); `Variant AMBIENT alpha 128` |
| z6 flange | `PartImage flange_active.png` with `Variant AMBIENT alpha 0` and `Variant AMBIENT angle -6`; `PartImage flange_ambient.png` ALPHA_8 tint `#55605E` with `alpha 0` + `Variant AMBIENT alpha 255` |
| z7 minute arc | `PartDraw` 450x450 > `Arc centerX=225 centerY=225 width=416 height=416 startAngle=0 endAngle=0` + `<Transform target="endAngle" value="[MINUTE]*6 + [SECOND]*0.1"/>`, `Stroke #ccA6F46A thickness 1.6 cap BUTT`; `Variant AMBIENT alpha 0`, plus `Variant AMBIENT angle -14` on its parent Group |
| z7 seconds | 4 `Group`s pivot .5/.5 with `Transform angle = [SECOND]*6 - k*6` (k = 0..3), each an `Ellipse` 6.6 px at (221.7, 13.7); alphas 255/128/72/31 |
| z8 dragon | `PartImage dragon_relief.png` 160x124 at (145,22) `Variant AMBIENT alpha 0` (startOffset .33, duration .56); `PartImage dragon_line.png` ALPHA_8 tint `#5E7A52` `alpha 0` + `Variant AMBIENT alpha 255` |
| z9/z10 digits | `DigitalClock` x3: `TimeText format="HH" hourFormat="24"` box x119 w94, `PartText ":"` at x225, `TimeText format="mm"` box x237 w94, Roboto Mono 78 semibold `#EFF8EC`; shadow = the same three at (+2,+3) in `#99000000`; both Groups `Variant AMBIENT alpha 0`. Ambient digits = same TimeTexts with `Font family="mono_outline"` where `<BitmapFont name="mono_outline">` holds 11 ALPHA_8 glyphs 48x60 (0-9, colon) pre-rendered as 1.4 px outlines; `alpha 0` + `Variant AMBIENT alpha 255` |
| z11 text | `PartText` with `Template` for date (`[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]` uppercased in the string resources), battery, steps (`numberFormat("#,###", [STEP_COUNT])`); gauges = `PartDraw Rectangle` with `Transform width = 64*[BATTERY_PERCENT]/100` and `64*clamp([STEP_COUNT],0,10000)/10000`; `Condition [BATTERY_PERCENT] <= 15` swaps the value colour to `#F3C479`; AOD `BAT %` and `INFINITY` are separate `PartText`s with `alpha 0` + `Variant AMBIENT alpha 255` |
| burn-in walk | ambient-only `Group` with `Transform x = (([MINUTE]*7) % 5) - 2`, `y = (([MINUTE]*3) % 5) - 2` |
| reduced motion | `BooleanConfiguration id="wakeAnimation"`; `Condition` selects the duplicate tree with every `Variant duration="0"` |

Memory: interactive ~4 MB (sky 0.7 MB, bed 0.46 MB, dome_light 0.9 MB, flange 0.9 MB, dragon 0.1 MB, sprites, outline font 32 KB); ambient ~1.5 MB (ALPHA_8 sky 175 KB, ALPHA_8 flange, ALPHA_8 dragon line, bitmap font). Put the digits, arc, seconds and sprites at the end of the XML so the ambient layer calculation can drop the static layers.

Bake list: static PNG = `bed_aventurine`, `sky_active`, `sky_ambient` (ALPHA_8), `dome_light`, `flange_active`, `flange_ambient` (ALPHA_8), `dragon_relief`, `dragon_line` (ALPHA_8), `sun_bead`, `sun_true`, `moon_0..7`, `moon_ambient`, `mono_outline` glyphs. Vector = minute arc, seconds beads, gauges, divider, all text, digits. Blend: everything source-over with the alphas above; no multiply/screen needed (the v4 doc warns WFF blend support is version-gated, so none is used).

---

## 7. Risks

1. Lighting too timid on the real panel: if the 11 % glaze / 46 % terminator read as a vignette at 250 nits, the stack collapses to "stars plus rings". Mitigation: on-device check and a `ListConfiguration` "Lighting: soft / strong" that swaps `dome_light` for a 1.3x-alpha bake.
2. Rotation resampling: a bilinear-rotated 418 px bitmap smears 1 px stars into 2 px smudges. Mitigation: 1.4 px minimum star cores, optional 1.5x asset (1.6 MB, still fine), verify on device.
3. Expression precision is undocumented (float vs double). The split LST formula keeps every product under 1e4; verify LST against the studio at three dates (error must stay < 0.5 deg).
4. The physical rotating bezel of the Watch6 Classic covers the outermost 2-3 % of the panel: the outer flange r217-225 may be partly hidden. All depth-critical cues (bevel highlight, trench, Fresnel) sit at r <= 217.
5. Anything under 1 px or 11 px text is texture only at 40 mm: constellation lines, names and trench dots are accepted as texture, exactly like transferred inscriptions on the Galaxia base.
6. Readability: a star core at alpha .6 under a digit stroke reaches ~`#9AA0A4`; the stroke is 9 px wide and shadowed, so legibility holds, but it must be checked with the busiest sky (Cygnus/Cassiopeia region near the pole in autumn evenings).
7. Horizon and star-alpha caps assume Seoul; another latitude needs a re-baked `dome_light` (ship 3 latitude-band overlays if the face is ever shared).
8. Moon position error up to ~6 deg (inclination and most perturbations ignored) and 8-step phase sprites: fine for an 18 px sprite, but state it honestly in the docs.
9. Variant timing is a fraction of a device-controlled transition, not 360 ms; the wake choreography keeps its order and proportions but its absolute length is the device's.
10. The minute arc and seconds bead must sit exactly on the engraved tick radius (r208); 2 px off and they float as flat vector lines over a textured ring, which is the one place the v4 flatness could creep back in.

---

## 8. Why it is not flat

v4 was one black plane with a seconds ring, a planet sticker and the dragon, all lit by nothing. v5 is a physical instrument lit by one light. Your eye gets five independent depth cues and they all agree: occlusion (the sun bead's halo is clipped by the flange edge because it sits down in the trench; the dragon and the digits cast shadows onto the stars; the trench floor is visible only at the bottom of its U-shaped shadow), shading (the sky is a dome with a glaze on the 10:30 side and a terminator on the far side; the flange bevel is bright on the same side and dark on the opposite side; the dragon's edges catch the same light), motion parallax on wake (the sky rises and the flange settles while the digits stay nailed to the glass), relative motion over time (the sky, the sun and the moon each move at their own real rate while the rings never move), and material (brushed gunmetal, fired grisaille, copper-flecked lacquer and a gold sun are four different surfaces, not four colours). The stack is also real: Polaris is under the colon, Leo really is overhead at ten in the morning in late October, the sun bead really points at solar noon at 12:16 KST, and the full moon really sits under the horizon line while you read the time. The Galaxia convinces because every level carries its own time; this face does the same with seven scales on five planes, and it still reads KALI at a glance: dragon, phosphor, monospace, INFINITY.
