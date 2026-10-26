# KALIWATCH v5 "Celestial Vault" — motion & depth proposal, v2

Lens: motion designer (Apple Watch Astronomy, One UI Watch transitions). Design space 450x450, centre C=(225,225), r=225; target SM-R965N 480x480 (x1.0667, 1 design px = 0.083 mm). Angles are WFF convention: degrees clockwise from 12 o'clock. One key light for every baked material: 11 o'clock, 35 deg elevation (highlights on upper-left edges, shadows fall toward lower-right). Every luminance figure below is computed (sRGB -> CIE L*), not eyeballed; the script is `debate/tools/v2_motion_check.py`.

## 0. What changed in one breath

v1 had the right skeleton and dead skin: every shadow fell on a surface darker than 1 % luminance, three dots and three hairlines fought for 29 px of rim, and the composition was v4's print with a stack inserted around it. v2 keeps the well, the ground, the sidereal vault, the solar sun, the escapement second and the back-to-front wake, and fixes the four things the critics proved: (1) the receivers are now mid-tone grisaille so the occlusion chain is visible (every edge >= 10 L*, measured); (2) there is one hero, the gold sun on the lip, with the moon trailing it and the second alone on the flange — two tracks, not four; (3) the dragon really wraps the flange (17 px) and the digits sit on a smoked-glass plate that is an object, not a feathered hole; (4) the WFF mapping is corrected to what the v4 schema actually allows (PartText outline digits, one Variant per node, Part-level rotations, symmetric transition, fixed expressions).

Five physically separated planes, six real time-scales — three legible at a glance (second, civil HH:MM, 24-h sun), three ambient (sidereal vault, lunar age, zodiac) — and the honest statement that the only perceptible motions are the wake and the second.

## 1. Value bands (the fix for "flat on the wrist")

Depth on a dial is value contrast between levels. v2 is graded into four bands and gated on the baked PNGs:

| Band | Surfaces | sRGB | L* |
|---|---|---|---|
| 0 — lacquer & shadow cores | ground, well-shadow core at the lip, glass interior | #000000, #020403, #070C0A | 0 – 5 |
| 1 — grisaille vault (the receiver) | vault base #1C2D26; Milky Way paint #2F5146 @70 % -> #29453C; constellation lines 1.2 px #4D7560 | | 17 / 27 / 46 |
| 2 — alloy flange | #3B4F43 (upper-left) -> #161F1A (lower-right); rim light #8FAF8C; ticks #6F8C73 / #A3BDA4 | | 32 -> 11 / 68 / 55–74 |
| 3 — bodies & inscriptions | sun #E9B869, stars #C9D8E4, phosphor #A6F46A, paper #EFF8EC | | 78 / 86 / 89 / 97 |

Occlusion edges, computed on the specified composites (gate: dL* >= 10 and d(mean RGB) >= 20/255 — both critics' gates):

| Edge | dL* | dRGB |
|---|---|---|
| glass plate (72 % black) vs open vault | 12.5 | 25 |
| glass cast shadow (55 %) vs vault | 10.3 | 19 (just under; blur 6 px makes it a gradient, accepted) |
| dragon shadow (65 %) on flange upper-left | 22.2 | 44 |
| dragon shadow on vault | 11.6 | 22 |
| Milky Way band vs vault base | 11.4 | 22 |
| lip shadow core (r 198) vs open vault (r 176) | ~15 | ~30 |
| ground (#000) vs vault base | 16.8 | 37 |
| rim light vs shadowed vault | 67 | 150 |
| digits vs glass | 94 | 231 |

The one v1 cue that stays sub-threshold is the dragon's own material gradient (3-tone across a 3 px line) — conceded and deleted; the dragon is flat phosphor again, with a glow and a shadow that *are* visible (table above).

Studio acceptance test: the exporter samples each edge pair on the baked active PNG and fails the build below dL* 10; the active-frame luminance histogram must show at least three separated peaks besides black and the text.

## 2. Layer stack v2, back to front

| z | Layer | Shows / time-scale | Geometry (450 space) | Material (baked unless noted) | Active | AOD |
|---|---|---|---|---|---|---|
| z0 | VOID | — | disc | #000000 | on | on |
| z1 | VAULT | real northern sky, azimuthal-equidistant on the NCP, 1.6333 px/deg, dec +90 -> -30 at r 196; RA increases clockwise, RA 0h up; **sidereal day 23h56m04s, CCW** | PartImage 400x400 at (25,25), pivot 0.5/0.5 = C; bitmap authored at 800x800 (2x); alpha ends at r 200 | base #1C2D26; Milky Way #2F5146 @70 %, blur sigma 14; 12 stick figures (Ori, Tau, Gem, Leo, Boo, Cyg, Lyr, Aql, Peg, And, Per, Aur) 1.2 px #4D7560 @80 %; ecliptic 1 px #3F5E4C dash 4/4; ~90 selected stars V<=3 cores 4.0 (V0) -> 2.0 px (V3) #C9D8E4; ~240 V3–4 dust 1.4 px @55 %; 16 halos 10 px @30 % only in the port band (dec -30..+55); 4 red giants #D9A070 @70 %; no zodiac glyphs | vault_active | **vector**: one PartDraw 450x450 with 24 Ellipses 2.2 px #3A5044 (V<=2.0), same Transform — no bitmap resample, no twinkle |
| z2 | GROUND + WELL SHADOW + HORIZON | Seoul ground (below the horizon) = black lacquer, the terminal's level; the well's inner shadow; the horizon hairline | horizon circle centre (225,79.7) R 206.7 through (78,225) (225,286) (372,225); meets the well at (38,167)/(412,167); shadow annulus r 176 -> 200 | ground #000 with a 6 px lacquer edge #0A110D -> #000 under the line; shadow 85 % at r 200 -> 55 % at 194 -> 25 % at 188 -> 0 at 176 (ease-out); horizon = vector Arc on the horizon circle, startAngle 115, endAngle 245, 1.2 px #3A5446 | ground_shadow.png (alpha-only) + Arc | same PNG; Arc alpha 100 |
| z3 | GLASS | smoked inscription plate under HH:MM — an object with edges, a rim light and a cast shadow, not a feathered hole | rounded rect x112–338, y188–268, radius 6; cast shadow black 55 % offset (+2,+5) blur 6 | body black 72 % uniform; top edge 1 px #3C5444 @80 % (key light); bottom edge 1 px #000 @90 % | glass.png 240x96 at (105,180) alpha 255 | alpha 110 (still there, still masks the horizon under the digits) |
| z4 | POLARIS | the one fixed star above the glass, under the colon | PartDraw Ellipse 2.4 px at (225,225) #C9D8E4 | vector | on | on (#3A5044) |
| z5 | FLANGE | raised alloy ring: second/minute scale (60 ticks), 24-h quadrant bars, meridian index | annulus r 200–225; inner bevel 1.5 px #0B110D r 200–201.5; rim light 2 px #8FAF8C r 201.5–203.5 over the upper-left 180 deg fading to 25 % lower-right; 60 ticks 1.5 px #6F8C73 r 203–209, hour ticks 2 px #A3BDA4 r 202–210; quadrant bars 2x8 px #A3BDA4 at 90/180/270 (06 / 00 / 18 h) r 203–211; meridian index 2.5x10 px #A6F46A r 203–213; outer bevel r 223–225 #0A0E0C | brushed #3B4F43 -> #161F1A | flange_active.png | flange_ambient.png: 12 hour ticks #2E4436 r 203–209, meridian #4F6E48 r 203–213, lip arc 2 px #3A5044 upper-left 180 deg — everything <= r 213 (Samsung AOD shift clearance) |
| z6 | DRAGON | official Kali press-pack path, unchanged; mounted across the rim | frame (125,8) 200x137 (ink x 133–317, y 8–145; wing tips r ~217 = 17 px over the flange's inner edge, inside the outer bevel at 223); bitmap canvas 214x152 at (119,2) | flat #A6F46A (v4) + baked glow #A6F46A @30 % 5 px onto the sky + drop shadow black 65 % (+3,+5) blur 3 falling on flange, lip and vault — no gradient, no rim light | dragon_active.png | dragon_ambient.png: same path flat #4F6E48, no glow/shadow |
| z7 | MOON | phased moon trailing the sun by its age — **lunar month** | same lip track as the sun, radius 196; disc r 6.5; 8 phase PNGs 16x16 by [MOON_PHASE_TYPE] | lit #C9D8E4, dark #141C18, 1 px limb #6B7A70; terminator baked | moon_0..7 | hidden (keeps AOD at two rotating parts) |
| z8 | SUN — the hero | gold sun on the lip: **24-h solar day, CCW**, culminates at Seoul's true noon under the meridian index; its radial line crosses the ecliptic on z1 at the sun's sign = **zodiac** by construction | track radius 196 (disc r 7 -> 189–203: it sits *on* the lip, 3 px over the flange edge); glow 64x64 bitmap, 30 % at the disc edge -> 0 at 24 px, drawn above the dragon | #E9B869 core, 2 px #FFE2A8 upper-left highlight, 1 px #8C6E3F lower-right limb; glow lights the alloy (#66694C where it lands) and the vault edge | sun_glow.png 64x64 | vector ring: PartDraw Ellipse 14 px, Stroke #6E5A36 1 px, same angle — still orbiting |
| z9 | SECONDS | phosphor marker + trail on the flange, **one turn per 60 s**, escapement tick | dot r 2.6 at radius 215 (PartDraw Ellipse at (222.4,7.4)); trail Arc r 215, 1.6 px, 0 -> [SECOND]*6 | #A6F46A; trail @60 %; glow ellipse 8 px @35 % | on | off |
| z10 | INSCRIPTIONS | HH:MM, brand, date, readout, BATTERY / STEPS + gauges, prompt — **civil time and live data** | section 3 | Roboto Mono; active digits #EFF8EC with a second TimeText 2 px lower in #99000000 as shadow (TimeText's Font has no Shadow child) | on | PartText outline digits, dim date / values / INFINITY only |

Occlusion chain, now visible: flange -> shadow onto the vault's edge; dragon -> shadow onto flange + lip + vault; glass -> shadow onto the vault; sun glow -> onto flange and vault edge; dragon glow -> onto the vault. Each plane leaves a measurable mark on the plane beneath it.

Dropped from v1: the minute rim arc (duplicated the seconds trail in form, 10 px away), the 9 px 24-h numerals, the 11 px zodiac glyphs, the 58 % radial plate, the dragon gradient/rim light, the LST readout, the moon ring in AOD.

## 3. Composition

| Element | Position | Size / colour | Notes |
|---|---|---|---|
| Dragon | frame (125,8) 200x137 | material above | wraps the flange by 17 px; the sun passes **over** it at noon |
| Brand `KALI / VAULT` | centre 225, baseline 161 | 12 px, letterSpacing 0.25 em, #A6F46A | decoration; Active only; hostname can revert to ORBIT if the user prefers |
| Date `25 OCT / SUN` | centre 225, baseline 181 | 17 px #9BAB9C | AOD #6A8860 |
| Glass | x112–338, y188–268 | see z3 | 8 px above the cap line, 6 px below the baseline, 7 px beside the outer glyphs |
| HH / colon / MM | x166 / x225 / x284, baseline 252 / 248 / 252 | Roboto Mono 78 SEMI_BOLD #EFF8EC, colon #A6F46A | **never moves or scales**; colon does not blink |
| Polaris | (225,225) | 2.4 px #C9D8E4 | between the colon dots (y ~211 and ~239), 13 px from each |
| Readout `SUN SCO  MOON 15D` | centre 225, baseline 300 | 15 px #9BAB9C, 17 chars = 153 px (x 148–302) | on the ground (horizon at x 148 is y 271; readout top is y 289); replaces `SEC 24`; Active only |
| BATTERY / STEPS labels | x133 / x315, baseline 322 | 15 px #9BAB9C | Active only |
| Values | x133 / x315, baseline 352 | 27 px #EFF8EC; battery <= 15 % -> #E9B869 | AOD #5E7A5A, same place |
| Gauges | y 363, 56 px: x 105–161 / 289–345, 2 px | track #17291D, fill #A6F46A | ends at r <= 184; divider x225 y 315–358 #34543C; Active only |
| Prompt | centre 225, baseline 380 | 13 px `kali@vault:~$ ` #9BAB9C + `INFINITY` #A6F46A; x 139–311 | corners r 177 (inside the safe radius 181, outside the shadow annulus); AOD shows only `INFINITY` in place, #6A8860 |

Collision checks (computed): the sun/moon discs never enter r < 189; the farthest information pixels are the gauge ends (r 184) and the prompt corners (r 177); the value boxes reach r 178; the readout r 108. The sun's glow at the steps-gauge end around 21:00 and 03:00 is ~12 % of #E9B869 — a warm tint on 4 px of track, not an occlusion. The digits' box (r <= 112) is reached by nothing that moves except the vault's stars at 28 % through the glass. The horizon hairline passes under the glass (y 253 at x 112, y 258 at x 120) and is attenuated there to 28 %, so no bright curve slices under the numerals.

The ports: the unobstructed sky is the east port (x 338–421) and the west port (x 29–112) between y 150 and 268, plus the crescents beside the dragon's shoulders — about 24 % of the well. Facing north from Seoul, east is on the right, so the east port shows what is rising (Orion on a winter evening, Leo in spring, Cygnus/Aquila in summer, Pegasus in autumn) and the west port what is setting. The circumpolar cap (Dipper, Cassiopeia) lies under the dragon and the glass at every hour; the stick figures and halos are therefore spent on the equatorial band (dec -30..+55), where they are seen. This is what the face shows; the proposal no longer claims the Dipper is visible around the colon.

## 4. Palette

Identity stays **phosphor #A6F46A**: seconds, meridian index, colon, INFINITY, gauges, dragon, brand. Three controlled hues, as in v1:

| Hue | Hex | Role |
|---|---|---|
| Starlight | #C9D8E4 | stars, Polaris, moon lit side, constellation lines at low alpha |
| Sun gold | #E9B869 | the sun and its glow; the low-battery value (replaces #F3C479) |
| Vault teal | #2F5146 | the Milky Way paint (and its base tints #1C2D26, #29453C) |

Red giants #D9A070 @70 % so the battery gold stays unique. Alloy #3B4F43 -> #161F1A, rim light #8FAF8C, ticks #6F8C73 / #A3BDA4, glass rim #3C5444, horizon #3A5446, structure #34543C, track #17291D, quiet #9BAB9C, paper #EFF8EC. AOD: digit fill #11200F / outline #91AD80 (v4), dragon #4F6E48, values #5E7A5A, date and INFINITY #6A8860, stars and lip #3A5044, ticks #2E4436, sun ring #6E5A36. Brightest AOD pixel #91AD80 (mean RGB 58 %); all AOD text <= 0.45.

## 5. Motion

Curve everywhere: cubic-bezier(.22,1,.36,1) = WFF `interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"`. No loops. Perceptible motion: the wake and the second — nothing else. The sidereal drift is 0.85 px/min at the rim: the vault is "a different sky in the morning and the evening", not motion, and the proposal says so.

### 5.1 Signature wake, AOD -> Active, back to front with counter-rotation parallax

The planes separate in order: sky, well, flange, lights, dragon, digits, terminal. The deepest moving plane arrives CCW (the sky's own sense), the front-most CW (the second's). All spatial Variants live on **active-only copies**; the ambient copies never move, so AOD is the true sky at the true angle and nothing is displaced between modes.

| Fraction (studio ms of 360) | Node | Property | WFF |
|---|---|---|---|
| 0 – 1.00 (0–360) | VAULT active Group | angle +3 -> 0 CCW | `Variant target="angle" value="3" angleDirection="COUNTER_CLOCKWISE" duration="1.0"` on the Group; the PartImage inside carries `Variant alpha 0` and the live `Transform angle` |
| 0 – 0.60 (0–216) | VAULT ambient PartDraw | alpha 255 -> 0 | element `alpha="0"`, `Variant alpha 255` |
| 0 – 0.85 (0–306) | GROUND shadow PartImage | alpha 150 -> 255 (the well deepens) | `Variant alpha 150` |
| 0.10 – 0.90 (36–324) | GLASS | alpha 110 -> 255 | `Variant alpha 110 startOffset 0.1 duration 0.8` |
| 0.17 – 0.83 (60–300) | FLANGE active / ambient | alpha 0 -> 255 / 255 -> 0 | two PartImages, one Variant each |
| 0.22 – 0.89 (80–320) | SUN body+glow / ring, MOON | alpha 0 -> 255 / 255 -> 0 | per-node alpha Variants |
| 0.28 – 1.00 (100–360) | SECONDS Group | angle -14 -> 0 CW; dot + trail alpha 0 -> 255 | Group `Variant angle -14 angleDirection="CLOCKWISE"`; PartDraws `Variant alpha 0` |
| 0.33 – 0.95 (120–342) | DRAGON active | scaleX, scaleY 0.96 -> 1.00 (pivot 0.5/0.5), alpha 0 -> 255; ambient copy alpha 255 -> 0, no scale | Group[scaleX] > Group[scaleY] > PartImage[alpha] — one Variant per node |
| 0.33 – 0.95 | DIGITS | active DigitalClock Group alpha 0 -> 255; ambient PartText Group alpha 255 -> 0 | outline digits already in place at t=0: legible throughout |
| 0.45 – 1.00 (162–360) | brand, readout, labels, gauges, prompt prefix | alpha 0 -> 255; date / values / INFINITY cross-fade active-colour and ambient-colour PartTexts (Font colour cannot carry a Variant) | per-node alpha Variants |

Every `startOffset + duration <= 1.0`. The digits are readable from t=0 because the outline copy sits at the final position and size.

### 5.2 Slow real-time rotations (both modes, re-evaluated once a minute)

| Object | Direction | Period | Expression (deg clockwise) |
|---|---|---|---|
| Vault | CCW | 23h 56m 04s | `VAULT_ANGLE` (section 7) |
| Sun | CCW | 24 h mean solar, Seoul longitude, equation of time | `SUN_ANGLE` |
| Moon | CCW, trailing the sun | synodic (one lap relative to the sun in 29.53 d) | `MOON_ANGLE` |

The second is dropped from the astronomical expressions: the change per second (0.004 deg = 0.013 px at r 196) is invisible and this stops the rotated bitmap being re-rasterised 60 times a minute. Physical checks: at noon the sun sits under the meridian index on the dragon's back; at first quarter the moon is 90 deg clockwise (east) of the sun and culminates at 18:00; at full moon it is opposite. At midnight the sun is at (225,421) on the black ground below the prompt — "under the earth".

### 5.3 Every second

1. Seconds dot and trail step 6 deg with a 180 ms ease-out: `Transform target="angle"` + `Animation duration="0.18" interpolation="EASE_OUT" angleDirection="CLOCKWISE" fps="60"` (the default 15 fps would make the tick a two-frame jump).
2. Nothing else. No blinking colon, no cursor, no readout change until the minute.

### 5.4 Active -> AOD

"It goes dark, it does not go away." The watch plays the same Variant table in reverse at the vendor's transition time — which automatically produces front-to-back ordering (the terminal and digits leave first, the sky last). The studio keeps the approved 180 ms asymmetric sleep and gains a "watch timing" toggle that plays the symmetric table so the user sees what the device will do (R6 conceded).

### 5.5 Interruption, reversal, reduced motion

Studio: retarget from computed values (v4 policy). Watch: renderer-owned. Reduced motion: studio `prefers-reduced-motion` or manual toggle = instant; watch `BooleanConfiguration id="wake_motion"` selecting a scene copy whose Variants carry `duration="0"` (evaluator takes the max across configurations, so the copy costs no budget). The astronomical rotations are not motion in this sense and stay on.

## 6. AOD

Same face, dimmed, nothing displaced: 24 vector stars rotating sidereally; horizon arc at alpha 100; glass at alpha 110; Polaris; flange ambient (12 ticks, meridian, lip arc, all <= r 213); dragon flat #4F6E48; outline digits (PartText, fill #11200F, Outline #91AD80 1.4 px — v4's approved look reproduced natively); date #6A8860; battery and steps values #5E7A5A in place; `INFINITY` in place #6A8860; sun ring orbiting. Hidden: seconds, trail, labels, gauges, prompt prefix, readout, moon, Milky Way, lines.

Lit estimate, non-zero pixels in the 450 disc (159,043 px²), using the critics' measured v4 components (digits ~6,100, dragon ~1,800): date ~700, values ~840, INFINITY ~300, horizon arc ~480, lip arc ~630, ticks + meridian ~200, stars ~100, sun ring ~40, glass rim ~230, Polaris 5 -> **~11,400 px² = 7.2 % direct**; by the 900 -> 450 resampled method the critics used for v4 (11.3 %) expect **11–12 %**. WO-P7 mean-luminance: ~2 %. Both under 15 %; the method must be the raster measurement, not this table. Kill switches, in order: lip arc (-630), horizon arc (-480), steps value (-420).

Burn-in: no AOD pixel above 58 %; the only filled area is the dragon's line art at 34 %; static strokes <= 2 px; stars and sun ring drift 0.85 px/min; nothing within 12 px of the dial edge; one update per minute.

## 7. WFF v4 mapping (corrected)

`<WatchFace width="450" height="450" clipShape="CIRCLE">`, `<Scene backgroundColor="#ff000000">`. Fonts: roboto_mono (bundled). Rules used throughout: a time-driven `Transform target="angle"` sits on the **Part** (PartImage/PartDraw) whose `pivotX/Y` is the dial centre, so the evaluator's clock detector and any ambient offload see a rotating Part; wake `Variant`s sit on parent Groups; **one Variant per node** (PartImage allows at most one), hence nested Groups per animated property; spatial Variants only on active-only nodes.

Expressions (small-number formulation; every term < 10^4; double-mod idiom so negative operands are safe):

```
TZ    = [TIMEZONE_OFFSET_MINUTES_DST] / 60          // Integer, v3 — exists; 9 in Seoul
DINT  = 365*([YEAR]-2000) + floor(([YEAR]-1997)/4) + [DAY_OF_YEAR] - 1      // valid 2000–2099
DFRAC = ([HOUR_0_23_MINUTE] - TZ)/24 - 0.5                                   // no [SECOND]
GMST  = ((280.46061837 + 0.98564736629*DINT + 360.98564736629*DFRAC) % 360 + 360) % 360
LST   = (GMST + 126.978) % 360
VAULT_ANGLE = (720 - LST) % 360
B     = rad((360/365)*([DAY_OF_YEAR]-81))
EOT   = 9.87*sin(2*B) - 7.53*cos(B) - 1.5*sin(B)                             // minutes
SUN_ANGLE  = (((12.535 - EOT/60 - [HOUR_0_23_MINUTE])*15) % 360 + 360) % 360
MOON_ANGLE = (SUN_ANGLE + clamp([MOON_PHASE_POSITION],0,28)*12.19) % 360
LAMBDA = ((([DAY_OF_YEAR]-80)*0.9856 + 1.915*sin(rad(([DAY_OF_YEAR]-3)*0.9856))) % 360 + 360) % 360
SIGNIDX = floor(LAMBDA/30)
SIGN  = subText("ARITAUGEMCANLEOVIRLIBSCOSAGCAPAQUPIS", SIGNIDX*3, SIGNIDX*3+3)   // end is exclusive
```

Sample 2026-10-25 10:08 KST, recomputed: DINT 9794, DFRAC -0.4525, GMST 50.5, LST 177.5 (11h50m), VAULT_ANGLE 182.5, EOT +16.2 min (solar noon 12:16 KST), SUN_ANGLE 31.9 (upper right, east of the meridian), MOON_ANGLE 214.7 (age 15 d, opposite the sun, on the ground side), SIGN SCO. Cassiopeia (RA ~1h) has hour angle 162.5 deg: low in the **NNW**, approaching lower culmination — v1 said NE; corrected. The studio must render the catalogue against these expressions for the sample instant and diff it against Stellarium before any PNG is baked.

| z | Element | Construction |
|---|---|---|
| z1 | VAULT active | `Group` 450x450 pivot 0.5/0.5 [`Variant angle 3 angleDirection COUNTER_CLOCKWISE duration 1.0 CUBIC_BEZIER`] > `PartImage` 400x400 at (25,25) pivot 0.5/0.5 [`Transform angle = VAULT_ANGLE`; `Variant alpha 0`]; vault_active.png authored 800x800 |
| z1 | VAULT ambient | `PartDraw` 450x450 pivot 0.5/0.5 `alpha="0"` [`Transform angle = VAULT_ANGLE`; `Variant alpha 255 duration 0.6`] with 24 `Ellipse` 2.2 px `Fill #3A5044` at catalogue positions (RA 0h up) |
| z2 | GROUND/SHADOW | static `PartImage` 450x450 alpha-only PNG [`Variant alpha 150`]; HORIZON = `PartDraw` > `Arc centerX 225 centerY 79.7 width 413.4 height 413.4 startAngle 115 endAngle 245` `Stroke #3A5446 1.2` [`Variant alpha 100`] |
| z3 | GLASS | `PartImage` 240x96 at (105,180) [`Variant alpha 110 startOffset 0.1 duration 0.8`]; vector fallback `PartDraw RoundRectangle` + `Fill #B8000000` if the validator prefers |
| z4 | POLARIS | `PartDraw` > `Ellipse` 2.4 px at (223.8,223.8) `Fill #C9D8E4`; ambient copy #3A5044 via two nodes |
| z5 | FLANGE | two static `PartImage` 450x450, alpha Variants; 2x authored |
| z6 | DRAGON | `Group` 214x152 at (119,2) pivot 0.5/0.5 [`Variant scaleX 0.96 startOffset 0.33 duration 0.62`] > `Group` [`Variant scaleY 0.96` same timing] > `PartImage` dragon_active [`Variant alpha 0`]; sibling `PartImage` dragon_ambient `alpha 0` [`Variant alpha 255`], no scale |
| z7 | MOON | `Group` 450x450 pivot centre [`Transform angle = MOON_ANGLE`] > `Condition` on `[MOON_PHASE_TYPE]` 0..7 > `PartImage` 16x16 at (217,21) [`Variant alpha 0`] |
| z8 | SUN active | `Group` 450x450 pivot centre [`Transform angle = SUN_ANGLE`] > `PartImage` sun_glow 64x64 at (193,-3) [`Variant alpha 0`] |
| z8 | SUN ambient | `PartDraw` 450x450 pivot centre `alpha 0` [`Transform angle = SUN_ANGLE`; `Variant alpha 255`] > `Ellipse` 14x14 at (218,22) `Stroke #6E5A36 1` — a rotating **Part** for AOD |
| z9 | SECONDS | `Group` 450x450 pivot centre [`Variant angle -14 angleDirection CLOCKWISE startOffset 0.28 duration 0.72`] > `PartDraw` pivot centre [`Transform angle = [SECOND]*6` + `Animation 0.18 EASE_OUT CLOCKWISE fps 60`; `Variant alpha 0`] > `Ellipse` dot 5.2 px at (222.4,7.4) + glow ellipse 8 px @35 %; trail `PartDraw` > `Arc 225 225 430 430 start 0 end 0` [`Transform endAngle = [SECOND]*6` + same Animation; `Variant alpha 0`] `Stroke #99A6F46A 1.6 cap ROUND` |
| z10 | HH:MM active | `Group` [`Variant alpha 0`] > `DigitalClock` with two `TimeText`s, `format="hh"` at x 120 and `format="mm"` at x 238 (each 92 wide, `align="CENTER"`, `hourFormat="24"`), `Font roboto_mono size 78 weight SEMI_BOLD color #ffEFF8EC`; each preceded by an identical TimeText 2 px lower in `#99000000` (shadow); the phosphor colon is a `PartText ":"` 78 px `#ffA6F46A` centred at x 225 — three text nodes, as in the SVG |
| z10 | HH:MM ambient | `Group` `alpha 0` [`Variant alpha 255`] > `PartText` > `Text` > `Font roboto_mono size 78 weight SEMI_BOLD color #ff11200F` > `Outline color #ff91AD80 width 1.4` + `Template "%s:%s"` with `[HOUR_0_23_Z]`, `[MINUTE_Z]` — the only WFF route to outline digits (TimeText's Font has no Outline child in the v4 XSD). Device test: AOD must update every minute for >= 2 h. Fallback kept in the file behind a `BooleanConfiguration`: DigitalClock SEMI_BOLD fill #4F6E48, no outline |
| z10 | texts | `PartText` + `Template`/`Parameter`: date `[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]`, `[BATTERY_PERCENT]`, `numberFormat("#,###",[STEP_COUNT])`; low battery via `Condition [BATTERY_PERCENT] <= 15`; readout `SUN %s  MOON %sD` with `SIGN`, `[MOON_PHASE_POSITION]`; AOD colours via paired PartTexts cross-faded by alpha Variants; gauges `PartDraw Rectangle` width `Transform` `56*[BATTERY_PERCENT]/100`, `56*clamp([STEP_COUNT]/10000,0,1)` |
| — | reduced motion | `BooleanConfiguration id="wake_motion"` + `Condition` around two scene copies (animated / `duration="0"`) |

Assets: vault_active 800x800 (into 400x400), ground_shadow 450x450 (alpha), glass 240x96, flange_active / flange_ambient 900x900 (into 450x450), dragon_active / dragon_ambient 214x152, sun_glow 64x64, moon_0..7 16x16. Raw ARGB at authored size ~6.1 MB; the footprint evaluator resizes to the screen and crops transparent pixels, so expect ~3 MB active and ~2.5–3.3 MB ambient (<= 3 full-screen layers at 810 KB + dynamic vector parts). Limits 100 MB / 10 MB. Numbers to be taken from the evaluator, run with and without `--apply-v1-offload-limitations`, before they are quoted anywhere.

## 8. Risks

- R1 Flatness: now gated numerically (section 1). Residual risk is panel gamma and Samsung's tone curve; verify on the 480 px panel at arm's length; all materials are PNG swaps.
- R2 Star shimmer: 2x authoring and >= 2 px cores in Active; vector stars in AOD. Verify with a macro photo (R14).
- R3 Expression precision unspecified; small-number form keeps every term < 10^4. Validate `sin`/`rad`/`subText`/ternary with the official validator (R15).
- R4 Angle Variant on a Group whose child Part carries an angle Transform — different nodes, so composable by the spec; a validator may still object; fallback: drop the +3 / -14 parallax, keep alpha/scale.
- R5 Resolved as design: outline digits are a PartText; the per-minute AOD update of a PartText clock is the thing to test (R12). Fallback DigitalClock fill is in the file.
- R6 Transition timing is vendor-defined and symmetric; studio 360/180 is a preview preference.
- R7 Moon jumps 12.19 deg once a day at the phase-day change; accepted for a 13 px moon.
- R8 Seoul-only horizon and longitude; later a `ListConfiguration` with three cities (three ground PNGs, three longitude constants).
- R9 Zodiac boundaries +-1 day from the mean-sun approximation.
- R10 AOD lit % and memory are measured, not estimated; kill switches listed in section 6.
- R11 Trademark: Kali dragon is OffSec's mark; personal face, provenance kept.
- R12 AOD compositor on SM-R965N for Part-level expression rotations and the PartText clock: photograph at AOD entry and after 2 h.
- R13 Vendor transition time may compress the nine-stage stagger; fallback table with three stages (sky+well -> lights -> digits+terminal).
- R14 Two resampling passes on rotated bitmaps (rotation + 450 -> 480): 2x authoring mitigates; verify.
- R15 Validator: `subText`, ternary, `clamp`, float `%` and the `controls` separator must pass the official validator before the readout and the curves are committed.
- R16 Samsung AOD brightness boost on the dragon #4F6E48 and the #91AD80 outline: keep a darker pair (#3E5739 / #7A9470) ready.
- R17 Polaris between the colon dots may read as a stray pixel on some eyes: it is one PartDraw with a kill switch.
- R18 The sun's glow tints the steps-gauge end (~12 %) around 21:00 and 03:00; if it reads as a defect, shorten the gauges to 52 px.
- R19 The brand/hostname rename (ORBIT -> VAULT) is the user's call; both strings are one token.

## 9. Why it is not flat (v2)

Because every plane now has something lit to cast its shadow on. The sky is a mid-grey grisaille, not black, so the flange's shadow darkens its rim by fifteen L* steps, the glass plate floats over it with its own edge light and a shadow that you can measure, and the dragon's wing tips cross the alloy ring with a shadow doubled under them. The ground below Seoul's horizon is the only true black, which is why the terminal's inscriptions read as written on the deepest level — Galaxia's black lacquer. One bright object travels the face: a gold sun on the lip, lighting the alloy beside it, riding over the dragon's back at noon and lying under the earth at midnight, with the moon following at its age. The second ticks around the outside on its own ring. Wake it and the planes separate in order with the sky settling one way and the second the other. And it is still KALI: official dragon, phosphor on everything that moves, `kali@vault:~$ INFINITY` on the ground.

## 10. ASCII layer diagram

```
                      12 o'clock = meridian index (phosphor, r 203–213)           r
    ┌────────────────────────────────────────────────────────────────────┐
    │ z9  SECONDS   ●──▶ phosphor dot + trail on the flange               │ 215
    │ z5  FLANGE    ▓▓▓▓ alloy L* 32→11, rim light, 60 ticks, 06/00/18   │ 200–225
    │ z8  SUN ☼ gold, on the lip, above the dragon (noon = on its back)   │ 196
    │ z7  MOON ☾ same track, trailing by age × 12.19°                     │ 196
    │        ╭──────────── lip: shadow core L* 1 ────────────╮            │ 200
    │ z6     │     ╔═══ DRAGON, flat phosphor + glow + shadow ═╗  (tips r 217 over the flange)
    │        │     ║   KALI / VAULT      25 OCT / SUN          ║ │          │ y 161 / 181
    │ z3/z10 │ west║ ┌──── GLASS 72 %, rim-lit, cast shadow ──┐ ║ east     │ y 188–268
    │        │ port║ │     1 0 : 0 8   · Polaris above glass  │ ║ port     │ baseline 252
    │        │     ║ └──────────────────────────────────────┘ ║ │          │
    │ z1     │ VAULT grisaille L* 17–27, stars 2–4 px, lines 1.2 px, CCW  │ 0–200
    │ z2     │ ~~~~~~~~~~ horizon arc (Seoul 37.57 N) ~~~~~~~~~~~~~~~~~    │ y 286 @ x225
    │        │   GROUND #000:  SUN SCO  MOON 15D                           │ y 300
    │        │   BATTERY 78%                STEPS 6,240                    │ y 322/352/363
    │        │   kali@vault:~$ INFINITY                                     │ y 380
    │        ╰──────────────────────────────────────────────────╯          │
    │ z0  VOID                                                              │
    └────────────────────────────────────────────────────────────────────┘
    height : z0 < z1 < z2 < z3 < z4 < z5 < z6 < z7 < z8 < z9 < z10
    shadows: flange→vault rim (ΔL* 15), glass→vault (10), dragon→flange (22) / vault (12)
    light  : sun glow→flange + vault edge, dragon glow→vault
```

## 11. Change log vs v1

1. Re-graded every receiver into four value bands; vault base #050A08–#0A1512 -> #1C2D26 (L* 2–6 -> 17), Milky Way -> #2F5146 @70 %, lines 0.8 -> 1.2 px, flange #1B2A20/#070B09 -> #3B4F43/#161F1A, rim light 1 -> 2 px #8FAF8C, well shadow annulus 186–200 -> 176–200 with an ease-out profile. Added a measured occlusion-edge gate (dL* >= 10) to the studio exporter.
2. One hero: the sun moved from r 190 inside the well to the lip at r 196, disc r 4.5 -> 7, glow 20 -> 64 px, drawn **above** the dragon (noon is no longer hidden). Moon moved onto the same track (r 178 -> 196), r 5 -> 6.5, 12 -> 16 px phase bitmaps. Seconds moved to the flange (r 207 -> 215). Minute rim arc deleted. Four tracks (178/190/197.5/207) -> two (196/215).
3. Dragon frame (135,24) 180x123 -> (125,8) 200x137: wing tips at r 217, 17 px over the flange (was 1 px). Material: gradient + rim light deleted; flat phosphor + baked glow + a shadow that lands on lit alloy.
4. The 58 % radial plate (0.08 alpha at the outer digits) -> a uniform 72 % smoked-glass plate x112–338 y188–268 with rim light and cast shadow; it stays at 43 % in AOD. Halos and red giants kept out of the digit box.
5. Polaris promoted from a conceit to a visible 2.4 px PartDraw above the glass.
6. Honest sky: 18 stick figures -> 12, spent on the equatorial band seen in the east/west ports; zodiac glyphs and 24-h numerals deleted; "Dipper around the colon" claim withdrawn; Appendix sample corrected (Cassiopeia NNW, not NE).
7. Readout `LST 11:50  SUN SCO  MOON 15D` (13 px, 28 chars) -> `SUN SCO  MOON 15D` (15 px, 17 chars).
8. Telemetry: gauges 72 -> 56 px (ends r 190 -> 184); prompt baseline 388 -> 380 (corners r 184 -> 177); brand baseline 153 -> 161 under the larger dragon.
9. AOD: vault bitmap -> 24 vector stars (no resample twinkle); flange ambient and meridian confined to r <= 213; moon ring removed; prompt prefix and readout removed; values kept in place; lit estimate recomputed from measured v4 components (7.2 % direct / 11–12 % resampled) with kill switches.
10. Spatial wake Variants (+3 deg vault, 0.96 dragon scale, -14 deg seconds) moved to active-only nodes, so AOD is undisplaced and Active -> AOD replays no spatial motion; vault parallax 4 -> 3 deg; explicit `angleDirection` on both angle Variants.
11. Active -> AOD declared symmetric on the watch (vendor time); studio gets a "watch timing" preview toggle.
12. WFF: outline digits as PartText + `Outline` (TimeText's Font cannot), with a device test and a DigitalClock-fill fallback; the "10 outline glyph PNGs" fallback deleted; active digit shadow stays a second TimeText; HH and MM as two TimeTexts with a PartText colon; weight `SEMI_BOLD` not 600; `clipShape` on `WatchFace`; `fps="60"` on the seconds Animation; `subText(start, end)` fixed; `[SECOND]` dropped from DFRAC; double-mod guard on every `%`; `clamp` on the moon age; `numberFormat("00")` no longer needed; time-driven rotations moved to Part level, wake Variants to Groups, one Variant per node.
13. Memory restated (6.1 MB raw at authored 2x; evaluator figures to be measured) and vault/flange authored at 2x.
14. Motion claims rewritten: the only perceptible motions are the wake and the second.

## 12. Rebuttals

| # | Critic claim | Verdict | Reason |
|---|---|---|---|
| 1 | (C1, C2, C3) Shadows and rim lights land on surfaces at 0.1–2 % luminance; the stack is specified but not perceivable. | **Accepted** | Computed: v1's well shadow took #0A1512 to #020504 (dL* ~4). v2 receivers are L* 17–32 and every occlusion edge is >= 10 L* (section 1). |
| 2 | (C1) No hero; three dots and three rings in 29 px of rim; the seconds dot overtakes the sun every minute. | **Accepted** | Sun on the lip at r 7 with a 64 px glow, seconds alone on the flange, minute rim deleted: two tracks 19 px apart. |
| 3 | (C1) Composition is v4's; the dragon "straddles" by 1 px; the shadow falls on the dark vault. | **Accepted** | Frame moved to (125,8) 200x137, tips r 217 (17 px over the flange), shadow on alloy dL* 22. Text baselines were kept on purpose: HH:MM is a hard constraint and the telemetry grid is the approved terminal; what changed is what the brief allows to change. |
| 4 | (C1) Delete the plate; use `Font` `Outline`/`Shadow` on the TimeText instead. | **Rejected in part** | The v4 XSD (`clock/timeText.xsd`) gives TimeText's Font attributes only — no Outline/Shadow children; that decoration exists on PartText's Font. So a Shadow on the active DigitalClock is not available and the second-TimeText shadow stays. The plate stays too, but as an object (uniform, rim-lit, cast shadow) — C1's real objection was the feathered 58 % hole, which is gone. |
| 5 | (C2) Plate over the full digit box at >= 70 %, exclude halos/giants from the box. | **Accepted** | 72 % uniform, x112–338 y188–268; halos and giants baked only outside the box. |
| 6 | (C1) Merge the rim hairlines into one lit lip overdrawn by the **minute** arc; drop the seconds trail. (C2) Keep the **seconds** trail as the only phosphor arc; drop the minute rim. | **C2 accepted, C1 rejected** | The seconds trail is the v4 signature the user approved; the minute is already in HH:MM. One phosphor arc remains: the seconds on the flange. The lip is lit once (2 px rim light), not three times. |
| 7 | (C1, C2) 9 px numerals and 11 px zodiac glyphs are decoration sold as time-scales; a 10 px moon has no readable phase. | **Accepted** | Numerals and glyphs deleted; quadrant bars + meridian give the 24-h orientation; moon 13 px with 8 phases, described as ambient; the proposal now counts three legible and three ambient scales. |
| 8 | (C2) Polaris under the colon puts the circumpolar cap under the digits; "the Dipper shifts around the colon" cannot be seen; unobstructed sky is two keyholes. | **Accepted (option a)** | Pole stays at C; the ports are designed as east/west observation windows and the figures are spent on the equatorial band. The claim is withdrawn, not the architecture. |
| 9 | (C2) Variant value *is* the ambient state: +4 deg vault and 0.96 dragon would be the AOD rest state and Active -> AOD would replay spatial motion. | **Accepted** | Spatial Variants moved to active-only copies (alpha 0 in AOD); ambient copies carry no angle/scale Variant. |
| 10 | (C2, C3) `subText` takes an exclusive end index. | **Accepted** | `subText(S, i*3, i*3+3)`; verified against the reference examples. |
| 11 | (C3) `[TIMEZONE_OFFSET_MINUTES_DST]` does not exist; only the String `TIMEZONE_OFFSET_DST`. | **Rejected** | The source-type reference lists `TIMEZONE_OFFSET_MINUTES_DST` as Integer, Version 3 (minutes, DST-corrected). Kept; it keeps UT right when travelling even though the Seoul longitude term does not. |
| 12 | (C3) TimeText weight must be an enum; `clipShape` belongs on `WatchFace`. | **Accepted** | `SEMI_BOLD`; `clipShape` on `WatchFace` as in the existing XML. |
| 13 | (C3) `Animation` defaults to 15 fps; the 180 ms tick would be 2–3 frames. | **Accepted** | `fps="60"` on dot and trail. |
| 14 | (C3) 360/180 asymmetry cannot exist on the watch. | **Accepted** | Symmetric vendor transition documented; studio keeps 180 ms as a preview preference and adds a watch-timing toggle. |
| 15 | (C3) Outline digits cannot be built on a DigitalClock; decide now. | **Accepted** | PartText `%s:%s` + Outline is the design; per-minute AOD update is a named device test; DigitalClock-fill fallback kept behind a configuration. |
| 16 | (C3) Put time rotations on Parts, not Groups, for the ambient clock detector; keep <= 2 rotating Parts in AOD. | **Accepted** | Transform on PartImage/PartDraw with pivot at C; AOD rotates exactly two Parts (vector stars, sun ring); wake Variants on Groups. |
| 17 | (C3) Sun and moon orbit through the telemetry at night; the sun hides behind the dragon at noon. | **Accepted** | Bodies on the lip (inner edge r 189) above the dragon; gauges shortened to r 184; prompt raised to r 177; residual glow tint on the gauge end measured at ~12 % and listed as R18. |
| 18 | (C1) AOD estimate cannot be lower than v4's 11.3 %; (C2) v4 measured 7.18 % direct, the 11.3 % was resampling. | **C2 accepted, C1 partly** | Both methods are now quoted (7.2 % direct, 11–12 % resampled), with the rule that only a raster measurement counts. |
| 19 | (C2) AOD text set should revert to v4's (no prompt prefix, no steps). | **Accepted for the prefix and readout, rejected for the steps value** | The step count changes through the day (not static ink) and keeping it in place is what makes AOD "the same face"; it is the third kill switch if the measured lit % needs it. |
| 20 | (C2) AOD ticks within 4–16 px of the edge will be clipped by Samsung's AOD shift. | **Accepted** | All AOD flange elements <= r 213. |
| 21 | (C2) 1.5 px AOD stars resample into a once-a-minute sparkle. | **Accepted** | AOD stars are vector Ellipses on a rotating PartDraw. |
| 22 | (C3) Memory was mis-summed (4.1 MB, not 3.2). | **Accepted** | Restated at authored size (6.1 MB with 2x assets) and deferred to the evaluator. |
| 23 | (C3) Appendix had east and west swapped for Cassiopeia. | **Accepted** | NNW at hour angle 162.5 deg; the studio must render the catalogue against the expressions before baking. |
| 24 | (C1) Rename KALI / VAULT is for no reason. | **Noted, user's call** | The hostname names the concept; both strings are one token (R19). |
| 25 | (C1) "+4 deg rotation of a 0.6 % disc is a parallax of nothing." | **Accepted as stated, moot after fix 1** | At L* 17–27 with 2–4 px stars the settle is visible; reduced to 3 deg so the active/ambient cross-fade reads as the sky coming into focus, not a smear. |
| 26 | (C1, C2, C3) Keep the well, the ground terminal, the astronomy, the nested-Group rule, the wake order, the escapement tick, the palette discipline, Polaris. | **Kept** | All present in v2; Polaris is now drawn. |
