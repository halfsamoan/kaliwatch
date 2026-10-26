# KALIWATCH v5 "Celestial Vault" — proposal v2 (KALI brand lens, after three critiques)

Author lens: brand guardian of the KALI terminal identity + the pentester who will wear it.
Design space 450x450, centre (225,225), r 225. WFF is authored at 480x480 (every number below x 1.0667 at build time; PNGs baked at 480, never at 450 or 2x). Target Galaxy Watch6 Classic SM-R965N.
Seoul 37.5665 N, 126.9780 E, UTC+9. Sample moment: 2026-10-25 10:08:24 KST (LST 11h50.1m = 177.52 deg).

Every number in this document was recomputed in `scratchpad/calc_kali/verify_v2.py` (luminance, horizon curve, dragon path extents, text boxes, LST/EoT/moon). Nothing from v1 or from the critics is carried on trust.

## 0. Thesis (what changed in one paragraph)

v1 had the right skeleton (a stack of planes, each a different real clock) and the wrong pixels: a sky at 0.4-0.9 % luminance that no OLED can shade, a mirrored sky, a spinning reticle, trig in the wrong units, a dragon that hid the sun, and three zodiac displays. v2 keeps the skeleton and fixes the pixels. The hero is now one picture: **Seoul's horizon cuts the dial into a lit slate sky that turns, and a black terminal ground that does not.** The official dragon floats over the sky and tucks its wing under the rim. The real Moon travels the sky and sets behind the ground. The Sun rides the rim. The time sits in a round well sunk into the dome. Everything the user approved is untouched: official dragon path, phosphor as the only live colour, HH:MM at x166/x284 baseline y252 (78 px Roboto Mono 600), INFINITY on both faces, 360 ms wake, quiet AOD.

**Handedness convention (one line, so nobody "corrects" it back):** inside view, facing north: zenith at 12 o'clock, east at 3 o'clock, west at 9; stars, Moon and Sun all move **counter-clockwise** about Polaris; RA is baked **clockwise** from 12 o'clock (`x = 225 + r sin RA`, `y = 225 - r cos RA`); the sky plate rotates by `360 - LST_DEG`; the Sun's dial angle is `-HA` (06 index at 3 o'clock, 12 at 12, 18 at 9, 00 at 6). Verification at first device build: at the sample time Vega must sit at (319, 245), lower right.

## 1. Layer stack (back to front)

Clock legend: SEC seconds, MIN minutes, SOLAR apparent-solar day, SID sidereal day (86164.09 s), LUN lunar month + the Moon's own daily arc, ZOD zodiac month, CIVIL HH:MM/date, NONE static.

| z | Layer | Shows | Clock | Geometry (450 space) | Material (baked unless noted) | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | VOID | black disc | NONE | full disc | `#000000` | on | on |
| 1 | SKY (rotating plate) | Seoul's sky as a lit slate dome: about 100 stars (V <= 3.0, dec >= -9.2 deg), 12 asterism line-sets, Milky Way wash, Saturn and Jupiter (2026 epoch), Polaris at centre | SID: one counter-clockwise turn per 23h56m04s (0.2507 deg/min); updates once a minute | 450x450 PNG, content inside r 186, pivot (0.5,0.5); star r = (90 - dec) x 1.875; bake frame RA 0h at 12 o'clock, RA increasing clockwise | Dome ramp (convex, lit from 10 o'clock): SLATE-HI `#33443B` (5.2 %) at the highlight point (119,119), SLATE-MID `#243229` (2.8 %) at centre, SLATE-LO `#141C18` (1.05 %) at the 4 o'clock rim; a 5:1 tonal range the OLED can show. Stars = PAPER `#EFF8EC` dots, diameter max(2.0, 3.6 - 0.9 V) px with a 0.6 px soft edge (never below 2 px, so rotation does not shimmer), alpha clamp(1.1 - 0.22 V, 0.45, 1.0); lines 1.4 px PAPER 35 %; Milky Way PAPER <= 10 %; Saturn 11 px body + 26x7 ring (ABYSS `#163A3C` rim, central highlight, no directional shading); Jupiter 7 px with two bands; Polaris 2 px dot 60 % at (225.9,223.9) | `sky.png` alpha 255 | `sky_aod.png`: the 24 brightest stars (V <= 2.0) as 2.5 px soft dots `#5E7A6A` (17 % lum) + Polaris; still rotates (slow drift = burn-in protection); no lines, no planets, no dome |
| 2 | MOON (rotating object) | The real Moon at its real place, with tonight's phase; it rises at 3 o'clock, climbs, passes behind the dragon near transit, sets at 9 o'clock behind the black ground | LUN (phase: 8 frames) + its hour angle (updates once a minute) | Group pivot (0.5,0.5), angle = `MOON_ANGLE` (= -HA_moon); PartImage 24x24 at x 213, y = 213 - `MOON_R`, `MOON_R` = clamp((90 - dec_moon) x 1.875, 116, 174) so the disc never leaves the plate (r + 12 <= 186) | Lit limb PAPER 85 %, dark side `#1A231C` with a 1 px PAPER 20 % rim; no cast shadow (it rotates; a baked shadow would swing against the fixed light). Waxing frames lit on the bake's left (toward decreasing RA = toward the Sun), waning on the right; terminator orientation is the tangent approximation, exact in the studio | 8 frames via `[MOON_PHASE_TYPE]` | `moon_aod.png`: 1 px ring `#5E7A6A`, same transform (about 90 lit px when up, 0 when set) |
| 3 | SUPERSTRUCTURE (static) | Everything fixed to the dial that has height: the black ground below Seoul's horizon, the well the time sits in, the sunken 24 h solar ring, the outer flange body | NONE (the solar ring is the scale the Sun is read against) | one 450x450 PNG `super.png`; details in section 1.1 | see 1.1 | on | `super_aod.png`: ground darkening (0 lit px) + 24 ring indexes `#3F5A43` + the ring's inner shadow + 12 flange ticks `#2E4A33` |
| 4 | DRAGON (official Kali logomark) | The press-pack path, unchanged, floating over the sky, in front of the Moon, under the rim: its wing tip and apex tuck under the solar ring's lip | NONE | frame x135 y32 w180 h123 (viewBox 5 22 126 94, uniform scale 1.3085; content x143.3-306.0, y31.4-152.3); outermost point (150.4,32.3) at r 206.6; 23 of 559 outline samples (4.1 %) lie beyond r 190 (under the ring), 43 beyond r 186 (in the shadow band); apex at (225,38.6) r 186.4; bottom y152.3 is 14 px above the date's cap line (166.6) | `dragon.png`: flat PHOSPHOR fill (no 1 px bevels: a 2-4 px stroke cannot carry them), 6 px outer glow phosphor 22 %, cast shadow dx 2 dy 4 blur 5 black 60 % onto the sky; the PNG is **pre-clipped at r 190** and **pre-darkened in the band r 182-190** (black 65 % at r 190 -> 0 at r 182, strongest on the 8-12 o'clock arc), so the wing visibly dives under the rim without a separate ring layer | engraved/flat phosphor | `dragon_aod.png`: same path stroked 1.2 px `#6E8F5E`, no fill, pre-clipped (about 2,000 lit px) |
| 5 | SUN (rotating pointer) | Gold Sun at Seoul's true solar hour angle on the solar ring: top at apparent noon (12:16 KST in late October), bottom at true midnight; lit above its own horizon, an ember below. Never occluded by anything | SOLAR (apparent: longitude offset + equation of time), updates once a minute | Group pivot (0.5,0.5), angle = `SUN_ANGLE` = (360 - SUN_HA) % 360; glyph box 24x24 at (213,174) (centre r 198) | Lit: SUN GOLD `#E0B36A` disc 12 px, 8 rays 1.2 px from r 7 to r 11, 14 px glow 30 %; **no baked shadow** (it rotates). Ember: 7 px `#5E4B2A` disc + 1 px `#8A6E3E` rim. Sample: angle 31.96 deg cw, centre (329.8,57.0), lit | lit / ember by `SUN_UP` | ember only (about 40 lit px) |
| 6 | SWEEP (rotating on wake only) | 60 minute ticks, phosphor seconds trail + marker: the highest plane and the wake signature | SEC, MIN | PartDraw on the full disc; ticks r 214-220 1 px `#34543C`, five-minute ticks r 212-221 1.6 px `#6B8F6A`; trail Arc centre (225,225) 432x432 at r 216, 1.7 px phosphor 72 %, endAngle = SECOND x 6; marker 6.6 px dot at r 216 + 5 px stub, angle = SECOND x 6 | vector; the flange **body and bevel stay in `super.png` and do not rotate** (world-fixed light) | angle -14 -> 0 on wake | 12 ticks only (in `super_aod.png`); no trail, no marker |
| 7 | READOUT (terminal text) | date + zodiac, HH:MM, SEC + LST, BATTERY / STEPS with gauges, prompt `kali@vault:~$ INFINITY` | CIVIL, ZOD, SEC | section 2 | Roboto Mono tabular, vector, no shading | all | date, outline HH:MM, `BAT nn%`, `INFINITY` |

Reading order of the clocks, edge to centre: seconds/minutes (sweep) -> apparent solar day (Sun on the sunken ring) -> sidereal day (sky plate) -> lunar month and the Moon's own arc (Moon on the plate) -> civil time and zodiac month (text in the well). Every height is a different clock; that is the Galaxia principle, and nothing here duplicates another display (the reticle, the moon badge and the zodiac band of v1 are gone).

### 1.1 `super.png` — the static superstructure, one PNG, four features

All shading obeys one light at 10 o'clock. A stepped bowl (flange > ring > sky > well) therefore has its **shadows on the upper-left inner walls and its lit lips on the lower-right** at every step.

| Feature | Geometry | Material | AOD |
|---|---|---|---|
| GROUND (earth) | 100 % black below Seoul's horizon; horizon curve (altitude 0, lat 37.5665): north point (225,295.4), east/west points (393.8,225)/(56.2,225), crosses r 186 at (410,201)/(40,201), leaves the disc at (426.5,124)/(23.5,124); y at x = 119/133/145/160: 272.6/278.6/282.9/287.3 (mirror on the right) | `#000000` with a 12 px feather; the black edge against a 3-5 % slate sky **is** the horizon line (no hairline); a 20 px "atmosphere" band PAPER 8 % -> 0 above the edge, interrupted inside the well (r < 124) | same darkening, 0 lit px |
| WELL (the time sits in a recess cut into the dome) | floor r <= 116; wall r 116-124; the well is concentric with the rings (no rounded-rectangle card) | floor black 60 % over the sky; wall: inner shadow crescent on the 240-60 deg arc (cw from 12): black 82 % at r 117 -> 60 % at r 110 (inward) -> 0 at r 124 (outward); lit lip 1.5 px PAPER 22 % at r 122.5-124 on the 70-113 deg arc only (below 113 deg the lip would be in the ground; the well edge crosses the horizon at about (113,273)/(337,273), and below that line both floor and ground are black, so no line crosses the telemetry) | darkening only |
| SOLAR RING (sunken 24 h ring) | annulus r 190-206; inner occlusion shadow on the sky r 182-190; 24 indexes: 20 minors r 195-201 1 px PAPER 35 %, 4 majors (00/06/12/18 at 6/3/12/9 o'clock) r 192-204 2 px PAPER 55 %; **no numerals** (9 px is below the 11 px floor; the Sun is read against the 12/3/6/9 positions) | floor ABYSS `#163A3C` (3.5 %) at r 190 -> `#0A1C1D` (1.0 %) at r 206; inner shadow black 65 % -> 0 over r 190 -> 182, strongest on the 8-12 o'clock arc, 0 by 4 o'clock, with a 1.5 px PAPER 20 % lit lip at r 189-190.5 on the 2-6 o'clock arc; outer shadow (cast by the flange wall) r 198-206 black 45 % -> 0 on the 8-12 o'clock arc | 24 indexes `#3F5A43` (8.8 %) + inner shadow |
| FLANGE (outer, highest) | annulus r 206-225 | steel-green `#0E1A12` (0.9 %) -> `#050A06`; 3 px lip highlight PAPER 14 % at r 207-210 on the 8-12 o'clock arc, 1.5 px black line at r 206-207.5 on the 2-6 o'clock arc; static | 12 ticks `#2E4A33` (5.7 %) 1 px at r 214-220 |

Luminance ladder (relative, Rec. 709): ground 0 % -> well floor 1.1-2.1 % -> flange 0.3-0.9 % -> sky 1.05-5.2 % -> ring floor 1.0-3.5 % -> lips 14-25 % -> text 38-92 %. The ring's inner shadow is now a 5.2 % -> 1.8 % step at 10 o'clock; the dragon's 60 % shadow lands on 3-5 % slate; the well's wall is an 82 % crescent on 4 % slate. These are visible at 20 % brightness; at 0.4-0.9 % (v1) none of them were.

### 1.2 Star catalogue (bake frame, LST = 0; RA clockwise from 12; x = 225 + r sin RA, y = 225 - r cos RA; dot = max(2.0, 3.6 - 0.9 V))

| Star | RA | dec | V | r | x | y | dot | dial position at the sample (LST 177.52) |
|---|---|---|---|---|---|---|---|---|
| Polaris | 2h31.8m | +89.26 | 2.00 | 1.4 | 225.9 | 223.9 | 2.0 | (224.1,226.1), between the colon's dots |
| Vega | 18h36.9m | +38.78 | 0.03 | 96.0 | 130.2 | 209.6 | 3.6 | (319.0,244.5) up |
| Deneb | 20h41.4m | +45.28 | 1.25 | 83.8 | 161.1 | 170.7 | 2.5 | (286.5,282.0) up |
| Altair | 19h50.8m | +8.87 | 0.77 | 152.1 | 90.3 | 154.3 | 2.9 | (356.5,301.5) below the horizon (hidden by the ground) |
| Arcturus | 14h15.7m | +19.18 | -0.05 | 132.8 | 150.9 | 335.2 | 3.6 | (303.8,118.1) up |
| Capella | 5h16.7m | +45.99 | 0.08 | 82.5 | 306.1 | 209.5 | 3.5 | (143.4,237.0) up |
| Rigel | 5h14.5m | -8.20 | 0.13 | 184.1 | 405.5 | 188.7 | 3.5 | (43.1,253.5), in the shadow band, set |
| Betelgeuse | 5h55.2m | +7.41 | 0.50 | 154.9 | 379.8 | 221.8 | 3.1 | (70.2,221.5) up |
| Procyon | 7h39.3m | +5.22 | 0.34 | 159.0 | 369.3 | 291.7 | 3.3 | (83.7,152.1) up |
| Pollux | 7h45.3m | +28.03 | 1.14 | 116.2 | 329.3 | 276.4 | 2.6 | (123.1,169.1) up |
| Aldebaran | 4h35.9m | +16.51 | 0.85 | 137.8 | 353.6 | 175.6 | 2.8 | (94.4,268.8) set |
| Regulus | 10h08.4m | +11.97 | 1.35 | 146.3 | 293.5 | 354.3 | 2.4 | (162.2,92.9) up |
| Dubhe / Alkaid (Plough ends) | 11h04m / 13h47m | +61.8 / +49.3 | 1.8 / 1.9 | 52.9 / 76.3 | 237.8 / 190.7 | 276.3 / 293.1 | 2.0 | (214.4,173.2) / (262.3,158.4) up |
| Kochab | 14h50.7m | +74.16 | 2.07 | 29.7 | 204.9 | 246.8 | 2.0 | (246.1,204.1) up |
| Saturn (2026) | 1h35m | +6.5 | 0.8 | 156.6 | 288.1 | 81.7 | 11 px + ring | (155.8,365.4) set |
| Jupiter (2026) | 9h20m | +16.5 | -2.2 | 137.8 | 313.6 | 330.6 | 5.6 | (141.1,115.7) up |

Not baked: Sirius (r 200.1), Spica (r 189.7), Antares, Fomalhaut: they lie under the opaque ring; there is no gap. The plate holds everything with V <= 3.0 and dec >= -9.2 deg (r <= 186): about 100 stars (the studio build script prints the exact count from its Yale BSC subset; 58 % of the sky times roughly 170 stars brighter than 3.0). The 12 line-sets: Plough, Cassiopeia, Cepheus, Summer Triangle, Cygnus, Lyra, Great Square, Perseus, Auriga, Gemini, Leo sickle, Bootes, Orion (shoulders and belt; Rigel in the band). The Milky Way wash runs Cygnus-Cassiopeia-Perseus-Auriga and is a rotating layer, so it does pass under the well (v1's "never under the slot" claim is withdrawn; the well's 60 % handles it).

## 2. Composition

Positions unchanged from v4 wherever the user already approved them. Text boxes use 0.6 em advance, 0.73 em ascent, 0.22 em descent.

| Element | Position | Size / colour | Max r of box |
|---|---|---|---|
| Official dragon | frame x135 y32 w180 h123 | flat phosphor, glow, cast shadow; AOD outline `#6E8F5E` | outline to r 206.6, pre-clipped at 190 |
| Date + zodiac | x225 baseline y179, middle | 17 px `#9BAB9C`; `25 OCT / SUN / SCO`; AOD `#7F9472` | 108.8 (inside the well floor r 116) |
| HH | x166 baseline y252 | 78 px 600 `#EFF8EC`; AOD fill `#11200F` + Outline `#91AD80` | 114.6 |
| colon | x225 baseline y248 | phosphor; AOD `#3F5A43` | — |
| MM | x284 baseline y252 | as HH | 114.6 |
| Status line | x225 baseline y281 | 15 px `#9BAB9C` `SEC 24 · LST 11:50` | 100.4 |
| BATTERY label / value / gauge | x145 y312 / y343 / y357 (x109-181) | 15 px / 27 px `#EFF8EC` (`#F3C479` <= 15 %) / 2 px phosphor on `#17291D` | 167.3 (`100%`) |
| STEPS label / value / gauge | x305 y312 / y343 / y357 (x269-341) | same; gauge = min(steps/10000,1) x 72 | 178.6 (`12,480`), 172.9 (`6,240`) |
| Divider | x225 y305-348 | 1 px `#34543C` | — |
| Prompt | x225 baseline y383 | 13 px `kali@vault:~$ ` `#9BAB9C` + `INFINITY` phosphor | 182.3 (decoration; allowed to 186) |
| Moon | r 116-174 on the plate, 24 px | see z2 | — |
| Sun | r 198 on the ring, 24 px box | see z5 | — |
| AOD BAT / INFINITY | x225 y329 / y375 | 17 px / 11 px tracking 2, `#7F9472` | 113.5 / 154.7 |

Safe radii: information text (date, HH:MM, status, battery, steps values) stays inside r 179 (date, time and status are inside the well, r <= 114.6; telemetry values <= 178.6 on the black ground, 3 px clear of the ring's shadow band at 182). Decorative text (prompt) may reach r 186. Nothing with ink crosses r 190 except the dragon's wing, which is deliberately under the rim.

Where things sit relative to the horizon: the whole telemetry block (y 301-392) is on the ground (horizon y >= 272 for x in 119-331); the date, the digits and the status line are in the well, whose floor and the ground meet invisibly (1.1 % against 0 %); the dragon is in the brightest sky (the dome highlight (119,119) is just left of its wing); the Moon crosses behind it; the Sun rides outside it. The removed `KALI / ORBIT` label (v4, y153): removed on purpose, because the dragon now occupies y32-152 and the prompt carries the name; say so to the user.

Depth under the digits, back to front: black -> slate well floor (sky at 40 %: 1.1-2.1 %, stars capped at 64 % x 0.40 = 26 %) -> paper digits 91.5 %. Contrast 12.5:1 against the floor, and a star pixel under a 13 px stem cannot cost a read. The shadow crescent and the lip are at r >= 110, outside every glyph box except the digits' outer corners (r 114.6), which touch the floor's edge, not the wall.

## 3. Palette

Identity, unchanged: PHOSPHOR `#A6F46A` (dragon, trail, marker, colon, INFINITY, gauges); PAPER `#EFF8EC` (digits, values; and now the stars and every lip at reduced alpha); QUIET `#9BAB9C`; STRUCTURE `#34543C`; TRACK `#17291D`; WARNING `#F3C479`; black. AOD set unchanged: `#11200F`, `#91AD80`, `#7F9472`, `#6E8F5E`, `#3F5A43`, `#2E4A33`, `#5E7A6A`.

Three controlled additions, one job each:

1. SLATE (the dome): `#33443B` (5.2 %) -> `#243229` (2.8 %) -> `#141C18` (1.05 %). It exists only on the sky plate, only above the horizon, only in Active. It is the surface every shadow falls on; without it the stack is black on black.
2. ABYSS TEAL `#163A3C` (3.5 %): the solar ring floor and Saturn's ring rim. Carries forward the teal the user liked in v3/v4; the not-quite-black that makes black read as depth.
3. SUN GOLD `#E0B36A` (49 %): the Sun only; ember `#5E4B2A` + rim `#8A6E3E`. WARNING `#F3C479` is its lighter sibling (same hue), so low battery and the Sun are one family.

Dropped: GRISAILLE `#B8C4BE` (stars and lips are PAPER at alpha, one fewer hue, more KALI); the blue-grey starlight `#8CA6B5` of v3/v4. Stars stay white, not green: a green dot field reads as a radar screen (a flat picture of a scope), a white field on slate reads as a sky behind glass. The black is not lost: it lives where the information lives (ground, well) and in every AOD.

## 4. Motion

Wake (AOD -> Active), 360 ms, ease cubic-bezier(.22,1,.36,1), deepest plane first, text last. WFF Variant fractions in brackets (360 ms = 1.0).

| t (ms) | Layer | Property |
|---|---|---|
| 0-120 [0 / .33] | SKY + MOON | `sky.png` alpha 0 -> 255 while `sky_aod.png` 255 -> 0 (same pivot, same angle: the 24 AOD stars do not jump, the dome and the other 76 stars develop around them); moon frame alpha 0 -> 255 over its AOD ring |
| 40-200 [.11 / .44] | SUPERSTRUCTURE | `super.png` alpha 0 -> 255 over `super_aod.png` (ground is already there; the well, ring floor, lips appear) |
| 60-240 [.17 / .50] | SUN | lit glyph alpha 0 -> 255 over the ember (when `SUN_UP`) |
| 0-360 [0 / 1.0] | SWEEP | Group angle -14 -> 0 deg (CUBIC_BEZIER .22 1 .36 1) and alpha 0 -> 255: the existing orbital-alignment signature; the flange body under it does not move |
| 120-300 [.33 / .50] | DRAGON | outline 255 -> 0, flat phosphor 0 -> 255 in place (as v2-v4) |
| 140-360 [.39 / .61] | READOUT time | active clock alpha 0 -> 255 over the outline clock 255 -> 0 (studio: fill `#11200F` -> `#EFF8EC`, stroke-opacity 1 -> 0) |
| 80-300 [.22 / .61] | READOUT telemetry | status, battery, steps, gauges, prompt alpha 0 -> 255 (the existing 80 ms delay) |

Removed from v1: the 0.985 -> 1.0 ring "lift" (3 px in 180 ms, invisible, and it fought the merged bitmap).

Always-on real-time motion (Active and AOD, once a minute, no trig for the sky):
- Sky plate: 0.2507 deg/min counter-clockwise (a star at r 160 moves 0.70 px/min; a 2 px star stays on one pixel < 90 s).
- Moon: its hour angle, about 0.243 deg/min counter-clockwise, plus 12.2 deg/day eastward drift; phase frame steps at the `[MOON_PHASE_TYPE]` boundaries.
- Sun: 0.25 deg/min counter-clockwise, with the equation-of-time wobble (+-16 min over the year).

Each second (Active only): trail endAngle = SECOND x 6; marker angle = SECOND x 6; `SEC nn`. Nothing else moves at a perceptible rate. No twinkle, no pulse, no blink, **no spinning reticle** (gone).

Active -> AOD, 180 ms (studio): all layers to their AOD state, front planes first (telemetry 0-80, digits 0-180, dragon 40-180, super/sun/sky 60-180). In WFF the Variants play at the system's duration; the 180/360 asymmetry and the reverse ordering are studio refinements, to be observed on device, not promised.

Reduced motion (OS or manual): every transition instant; the sky, Moon and Sun still track time because they are clocks.

## 5. AOD

What remains: outline HH:MM, date line, `BAT nn%`, `INFINITY`, dragon as a 1.2 px hairline (pre-clipped under the rim), 24 brightest stars + Polaris drifting sidereally, the Moon as a 1 px ring when it is up, 24 ring indexes with the ring's inner shadow, 12 flange ticks, Sun ember, ground and well darkening (0 lit px). Same silhouette, same rings, same well edge; the dome is switched off.

Lit pixels (disc 159,043 px; non-zero RGB): digit outline 1.8 px ~3,000 + digit fill `#11200F` ~3,600 (1.2 % lum) + colon 70 + dragon hairline ~2,000 (perimeter ~1,190 px x 1.2 + AA; v1's 3,000 was high) + date ~1,000 + BAT ~630 + INFINITY ~360 + stars ~170 + Polaris 30 + ring indexes 170 + flange ticks 70 + ember 40 + moon ring 90 = ~11,200 px = **7.0 %** (v4: 11.3 %). Luminance-weighted about 2.5 %.

Burn-in: (1) nothing static exceeds luminance 0.375 (`#91AD80`), and every static element is a hairline <= 1.8 px; (2) all sky-plane elements and the ember drift; (3) the colon, the only permanent fixed group, is `#3F5A43` (0.09); (4) **default, not optional:** the AOD readout group walks 1 px every 10 minutes on a 3x3 grid: `Transform target="x" value="(floor([MINUTE]/10) % 3) - 1"`, `target="y" value="(floor(([MINUTE]+5)/10) % 3) - 1"`; this is the one exception to "HH:MM never moves", it is AOD-only, +-1 px, and a build flag `AOD_WALK=0` removes it; (5) no claim about a system pixel shift until it is observed on the SM-R965N.

AOD digit stroke: `Font > Outline` width 1.7 (450 units; Outline width is the distance outside the glyph edge, so the visible stroke is 1.7 -> 1.8 px at 480), fill `#11200F`. That is +~1,000 px over v1's 1.4 and turns the night read from "possible" into "instant".

## 6. WFF v4 mapping

Device prerequisite: Wear OS 6 / One UI 8 Watch (rolled out to the Watch6 Classic in Korea 2025-11-19); check `adb shell getprop ro.build.version.release` before relying on Variant `duration`/`startOffset` (v4) and `[MINUTES_SINCE_EPOCH]` (v3). `<WatchFace width="480" height="480" clipShape="CIRCLE">`; all coordinates below are 450-space and are multiplied by 1.0667 at build.

Shared expressions (WFF trig is Java `Math`: **radians**, so every argument is wrapped in `rad()`; `[MINUTES_SINCE_EPOCH]`, `[TIMEZONE_OFFSET_MINUTES_DST]` are version 3; `[MOON_PHASE_POSITION]` 0-28, `[MOON_PHASE_TYPE]` 0-7, `[DAY_OF_YEAR]` 1-366, `[HOUR_0_23_MINUTE]` float, all verified against the source-type reference today):

```
// sidereal, no trig, no overflow (minutes, not seconds), one update per minute
LST_DEG    = (([MINUTES_SINCE_EPOCH] - 29409769.9) % 1436.068175) * 0.2506845
             // E0 = 2025-12-01 10:49:54 UTC = 1764586194 s = 29409769.9 min, Seoul LST 0.0036 deg there (recomputed)
             // 1436.068175 min = 86164.0905 s; drift-free. Sample: 177.42 deg (true 177.52; the 0.1 deg is the minute truncation)
SKY_ANGLE  = 360 - LST_DEG                                         // counter-clockwise turn

// apparent sun
B          = 0.98630 * ([DAY_OF_YEAR] - 81)
EOT_MIN    = 9.87*sin(rad(2*B)) - 7.53*cos(rad(B)) - 1.5*sin(rad(B))          // 16.23 min on DOY 298
SUN_DEC    = 23.44 * sin(rad(B))                                               // -13.12 deg on DOY 298
SUN_HA     = 15 * ([HOUR_0_23_MINUTE] - [TIMEZONE_OFFSET_MINUTES_DST]/60 + 8.4652 - 12 + EOT_MIN/60)   // -31.96 deg at the sample
SUN_ANGLE  = (720 - SUN_HA) % 360                                              // 31.96 deg cw = east of noon
H0         = 90 + 0.83 * SUN_DEC                                               // 79.1 deg; linearised, < 1 deg off all year
SUN_UP     = (SUN_HA > 0 - H0) && (SUN_HA < H0)

// moon, primary: truncated Meeus from minutes since epoch (error < 1 deg)
DJ         = [MINUTES_SINCE_EPOCH] / 1440 - 10957.5                            // days since J2000.0
LP         = (218.3165 + 13.176396 * DJ) % 360
DD         = (297.8502 + 12.190749 * DJ) % 360
MS         = (357.5291 + 0.98560028 * DJ) % 360
MP         = (134.9634 + 13.064993 * DJ) % 360
FF         = (93.2721 + 13.229350 * DJ) % 360
LAM        = LP + 6.289*sin(rad(MP)) + 1.274*sin(rad(2*DD - MP)) + 0.658*sin(rad(2*DD)) + 0.214*sin(rad(2*MP)) - 0.186*sin(rad(MS))
BET        = 5.128 * sin(rad(FF))
RA_M       = deg(atan((sin(rad(LAM))*0.91748 - tan(rad(BET))*0.39777) / cos(rad(LAM)))) + ((cos(rad(LAM)) < 0) ? 180 : 0)
DEC_M      = deg(asin(sin(rad(BET))*0.91748 + cos(rad(BET))*0.39777*sin(rad(LAM))))
HA_M       = LST_DEG - RA_M
MOON_ANGLE = (1080 - HA_M) % 360
MOON_R     = clamp((90 - DEC_M) * 1.875, 116, 174)
// moon, fallback if float precision on 129,000-degree arguments proves poor on device:
//   LAM_SUN = 0.98565*([DAY_OF_YEAR]-80) + 1.915*sin(rad(0.9856*([DAY_OF_YEAR]-3.5)))
//   LAM     = LAM_SUN + 12.1907*([MOON_PHASE_POSITION] + 0.5); RA_M = LAM - 2.467*sin(rad(2*LAM)); DEC_M = 23.44*sin(rad(LAM))
//   (checked over all of 2026: RA error max 12.6 deg, mean 4.8; dec error max 7.9 deg; i.e. within one or two disc diameters)

LST_TEXT   = floor(LST_DEG/15) : ((floor((LST_DEG % 15)*4) < 10) ? "0" : "") + floor((LST_DEG % 15)*4)
```

| z | WFF construction |
|---|---|
| 0 | `<Scene backgroundColor="#ff000000">` |
| 1 | `<PartImage name="sky" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Image resource="sky"/><Transform target="angle" value="SKY_ANGLE"/><Variant mode="AMBIENT" target="alpha" value="0" duration="0.33"/></PartImage>` + sibling `sky_aod` with the same Transform, `alpha="0"`, `Variant AMBIENT alpha 255` |
| 2 | `<Group name="moon_orbit" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Transform target="angle" value="MOON_ANGLE"/><Condition><Expressions><Expression name="mp0">[MOON_PHASE_TYPE] == 0</Expression> ... <Expression name="mp7">[MOON_PHASE_TYPE] == 7</Expression></Expressions><Compare expression="mp0"><PartImage x="213" y="0" width="24" height="24"><Image resource="moon_0"/><Transform target="y" value="213 - MOON_R"/><Variant mode="AMBIENT" target="alpha" value="0" duration="0.33"/></PartImage></Compare> ... </Condition><PartImage name="moon_aod" ... alpha="0"><Transform target="y" value="213 - MOON_R"/><Variant mode="AMBIENT" target="alpha" value="255"/></PartImage></Group>` (named boolean Expressions, as the existing `cursor_on`; `mp` numbering per the reference: 0 new, 1 evening crescent, 2 first quarter, 3 waxing gibbous, 4 full, 5 waning gibbous, 6 last quarter, 7 morning crescent) |
| 3 | `PartImage super` 450x450 `Variant AMBIENT alpha 0 startOffset 0.11 duration 0.44`; sibling `super_aod` alpha 0 -> AMBIENT 255 |
| 4 | `PartImage dragon` 180x123 at (135,32) `Variant AMBIENT alpha 0 startOffset 0.33 duration 0.5`; `PartImage dragon_aod` alpha 0 -> AMBIENT 255. Both rasterised from the unchanged press-pack path (SHA in `brand/PROVENANCE.md`), then clipped at r 190 and shaded in r 182-190 by the build script |
| 5 | `<Group name="sun" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Transform target="angle" value="SUN_ANGLE"/><Condition><Expressions><Expression name="sun_up">SUN_UP</Expression></Expressions><Compare expression="sun_up"><PartImage x="213" y="15" width="24" height="24"><Image resource="sun_lit"/><Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.17" duration="0.5"/></PartImage></Compare><Default><PartImage x="213" y="15" width="24" height="24"><Image resource="sun_ember"/></PartImage></Default></Condition></Group>` (the ember is also the ambient glyph; when the Sun is up, add an ember sibling with alpha 0 -> AMBIENT 255 so ambient always shows the ember) |
| 6 | Outer `<Group name="sweep_alpha" ...><Variant mode="AMBIENT" target="alpha" value="0" duration="1.0"/>` wrapping inner `<Group name="sweep_angle" pivotX="0.5" pivotY="0.5" angle="0"><Variant mode="AMBIENT" target="angle" value="-14" duration="1.0" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1" angleDirection="CLOCKWISE"/>` (two groups because one Variant per element is the safe assumption) containing `<PartDraw x="0" y="0" width="450" height="450">` with 60 `<Line>` ticks, the `<Arc centerX="225" centerY="225" width="432" height="432" startAngle="0" endAngle="0"><Stroke color="#b8a6f46a" thickness="1.7" cap="ROUND"/><Transform target="endAngle" value="[SECOND]*6"/></Arc>`, and a marker Group with `<Transform target="angle" value="[SECOND]*6"/>` holding `<Ellipse x="221.7" y="5.7" width="6.6" height="6.6"><Fill color="#ffa6f46a"/></Ellipse><Line startX="225" startY="2" endX="225" endY="7"><Stroke color="#ffa6f46a" thickness="1.5"/></Line>`. Validate the `controls` string syntax; EASE_OUT is the fallback. The 12 ambient ticks live in `super_aod.png` |
| 7 | Time: `DigitalClock` with four `TimeText` digit cells (documented formats): `hh_10` x119 w47, `hh_1` x166 w47, `mm_10` x237 w47, `mm_1` x284 w47, each `Font roboto_mono 78 BOLD #ffeff8ec align CENTER`; colon `PartText` at x216 w18 baseline-equivalent y248; this reproduces v4's HH centre 166 / MM centre 284 with the tightened colon exactly. AOD clock: a second DigitalClock, same cells, `Font color #ff11200f` with `<Outline color="#ff91ad80" width="1.7"/>`, alpha 0 -> AMBIENT 255, inside a Group carrying the two burn-in Transforms of section 5; if the validator rejects `TimeText > Font > Outline` (Font lists Outline as a child; TimeText lists Font; the chain itself is not shown end to end), fall back to a `BitmapFont` of 11 outline glyphs (47x78, ~160 KB). Date: `PartText` Template `%s %s / %s / %s` with `[DAY_Z]`, a month ternary (`([MONTH]==1)?"JAN":([MONTH]==2)?"FEB":...`), a weekday ternary on `[DAY_OF_WEEK]`, and a zodiac ternary on `[DAY_OF_YEAR]` (Aries 80-109, Taurus 110-140, Gemini 141-171, Cancer 172-203, Leo 204-234, Virgo 235-265, Libra 266-295, Scorpio 296-325, Sagittarius 326-355, Capricorn 356-19, Aquarius 20-49, Pisces 50-79; one-day leap-year drift accepted). `[MONTH_S]`/`[DAY_OF_WEEK_S]` are not used (ko-KR would render 10월 / 일). Status: `SEC ` PartText + DigitalClock `ss` TimeText + ` · LST ` + `LST_TEXT`. Battery/steps as in the existing XML; gauges `Rectangle` with `Transform target="width" value="[BATTERY_PERCENT]*0.72"` and `clamp([STEP_COUNT],0,10000)*0.0072`; low-battery colour via a named Condition `[BATTERY_PERCENT] <= 15`; prompt as two PartTexts |

Assets (480 px): `sky`, `sky_aod`, `super`, `super_aod` (full disc, 921.6 KB each RGBA), `dragon`, `dragon_aod` (192x131), `sun_lit`, `sun_ember`, `moon_0..7`, `moon_aod`. Interactive ~2.9 MB, ambient ~2.9 MB (3 full-screen layers counted): both far inside 100 MB / 10 MB. Per-second work: the Arc, the marker and the `ss` text; per-minute: one rotated full-disc bitmap (sky) and two small rotated groups (Moon, Sun).

## 7. Risks

1. **Handedness, now a verification step not a guess**: the convention is written above; first device build, compare with Stellarium at wake (Vega lower right at the sample). The fix, if ever needed, is one mirrored bake plus two sign flips.
2. **Slate dome in bright rooms**: a 5 % grey-green dome may look "grey" in sunlight. Mitigation: the studio ships two sky bakes (highlight 5.2 % and 3.5 %) switchable without touching anything else; the AOD is unaffected.
3. **Sun vs painted horizon at the rim**: the ground is the dec -9.2 horizon where it meets the ring; the Sun lights/embers by its own H0 (+-19.5 deg over the year), so near the solstices the Sun flips state up to ~20 deg of hour angle before/after it passes the ground's edge. Documented instrument behaviour; the Sun's state is the truth.
4. **Moon behind the dragon**: near transit the Moon passes behind the dragon's frame for 2-3 hours of every pass (seen through the gaps of the line drawing). That is the occlusion cue the stack is built on, not a defect; if the user wants the Moon always visible, the only honest fix is a smaller dragon (140x96 at (155,50), max r 184), not a Moon in front of the logo.
5. **Float precision for the primary Moon**: the Meeus arguments reach 1.3e5 degrees; if WFF floats are 32-bit the resolution is ~0.01 deg (fine); if `%` loses precision on device, switch to the `[MOON_PHASE_POSITION]` fallback (within two disc diameters).
6. **`TimeText > Font > Outline`**: plausible, not shown end to end; BitmapFont fallback ready.
7. **One Variant per element**: assumed; the sweep uses two nested Groups. If the validator allows several, flatten.
8. **Rotated-bitmap filtering**: if the renderer does not filter the once-a-minute 0.25 deg steps, 2 px stars may still flicker slightly; bake the sky at 480 with 0.6 px soft edges and confirm on device.
9. **AOD retention**: outline digits are the only fixed lit group; the 10-minute walk is on by default; if retention appears, drop the outline to `#7E9A70`.
10. **Epoch planets**: Saturn and Jupiter are baked for 2026; the studio regenerates `sky.png` yearly.
11. **Wear OS version**: Variant timing needs v4 (Wear OS 6). On Wear OS 5 the wake degrades to the system crossfade; everything else works.
12. **The 1 px AOD walk** technically moves HH:MM; it is +-1 px, AOD-only, and switchable. Tell the user.

## 8. Why it is not flat

Hold it up facing north. The black ground at the bottom is Seoul's roofline; above it a slate dome that is visibly lighter at ten o'clock than at four, and that is turning, slowly, the wrong way for a clock and the right way for a sky. A white Moon with tonight's terminator climbs out of the right-hand edge, slides behind the dragon and comes out the other side. The dragon itself is engraved in phosphor on top of that sky and throws a shadow on it, and its wing dives under the rim of a sunken ring whose inner wall darkens the stars beneath it. On that ring a gold Sun creeps counter-clockwise, lit by day, an ember by night, never hidden. Above everything, on the highest flange, the phosphor sweep counts seconds clockwise, so the eye sees two planes moving in opposite senses and cannot read them as one print. The time is paper-white at the bottom of a round well cut into the dome, its upper wall in shadow, Polaris between the dots of the colon. Count the clocks without reading a digit: seconds and minutes, the solar day, the sidereal day, the Moon's day and month, and the civil time in the well. Every one is at a different height, and every height throws a shadow on the one beneath. And it is still KALI: black where the data lives, phosphor on everything alive, the official dragon untouched, a prompt that ends in INFINITY.

## 9. ASCII layer diagram

```
   eye
    |
 z7  READOUT      25 OCT / SUN / SCO   [10]:[08]   SEC 24 · LST 11:50   BATTERY 78%  STEPS 6,240   kali@vault:~$ INFINITY
 z6  SWEEP        |##### r206-225 ticks + phosphor trail, clockwise (SEC/MIN); wake -14 -> 0 #####|
 z5  SUN                 o  r198, counter-clockwise, apparent solar hour angle (SOLAR), lit/ember, never hidden
 z4  DRAGON       ===== official path, flat phosphor, shadow onto the sky, wing tip under the rim =====
 z3  SUPER        ground (black below Seoul's horizon) | well r116/124 | solar ring r190-206 + shadow 182-190 | flange body
 z2  MOON                 ( )  real RA/dec, 24 px, r116-174, counter-clockwise, 8 phases (LUN); sets behind the ground
 z1  SKY          . * .  slate dome 5.2 -> 1.05 %, ~100 stars, 12 asterisms, Saturn, Jupiter, Polaris (SID, ccw 1 turn / 23h56m04s)
 z0  VOID         ###########################  #000000  ###########################

 Radial section (centre -> edge): well floor r<=116 | wall 116-124 | dome 124-182 | shadow 182-190 | ring 190-206 | flange 206-225
 Vertical section (bottom -> top of the dial): black ground (telemetry) | horizon | lit dome (dragon, Moon) | rim (Sun)
```

## 10. Change log vs v1

| # | v1 | v2 | Why |
|---|---|---|---|
| 1 | RA baked counter-clockwise, vault turning clockwise, east at 9 o'clock | RA baked clockwise, sky turning counter-clockwise (`360 - LST_DEG`), east at 3 o'clock, Sun counter-clockwise, ring 06 at 3 o'clock | v1 was the celestial-globe (outside) view; all three critics and my own re-derivation agree |
| 2 | Vault base `#06100C` -> `#0B1A14` (0.4-0.9 %) | Slate dome `#33443B` -> `#243229` -> `#141C18` (5.2 -> 1.05 %), lit from 10 o'clock | shadows need a surface above black crush |
| 3 | Earth 78 % black | Ground 100 % black, 12 px feather, no hairline | the edge is the horizon; the telemetry sits on true black |
| 4 | Smoked-glass pill 346x72 (y190-262) | Round well r116/124 with wall shadow and lip, concentric | the pill read as a UI card; the well is a sunken sub-dial and holds date + time + status |
| 5 | Sentinel reticle: sidereal orbit + 1 rpm cage spin | Deleted | decorative loop at perceptible speed, third seconds display, sat on the zodiac band |
| 6 | Moon badge fixed at (96,168) + zodiac glyph at (354,168), both with drop shadows | Real Moon on the sky plate at its computed RA/dec, 8 phases, rises and sets; no glyph, no badges, no drop shadows | the honest "bright object travelling the sky"; two flanking badges were 2015 Android |
| 7 | Zodiac band r170-182, 9 px glyphs 35 %; `SCO` in the date line; 24 px glyph | One zodiac display: `SCO` in the date line | 9 px at 35 % is invisible; three displays of one fact |
| 8 | Hour ring 9 px numerals | Indexes only, majors 2 px at 00/06/12/18 | below the 11 px floor |
| 9 | Dragon frame y28, above the rings (z9), "apex r197" | Frame y32, **below the rim**, pre-clipped at r 190 and shaded in r 182-190; measured max r 206.6, 4.1 % of the outline under the ring | the path actually reached r 210; above the rings it hid the Sun for ~2 h/day and the marker for 4 s/min |
| 10 | Sun 7 px disc, 18 px box, behind the dragon at noon | Sun 12 px disc, 24 px box, z above the dragon, never occluded | the one warm object must be visible at noon |
| 11 | Trig in degrees | Every trig argument wrapped in `rad()` | WFF trig is Java Math (radians); verified on the reference page |
| 12 | `[SECONDS_SINCE_EPOCH]` with integer modulo, quantised by floor | `[MINUTES_SINCE_EPOCH]` with float modulo 1436.068175 | one update per minute, drift-free, no 2038 overflow |
| 13 | `TimeText format="hh"/"mm"` | four digit cells `hh_10`/`hh_1`/`mm_10`/`mm_1` | the documented formats; reproduces v4's kerning |
| 14 | `[MONTH_S]`, `[DAY_OF_WEEK_S]` | ternaries on `[MONTH]`, `[DAY_OF_WEEK]` | locale strings would be Korean on this watch |
| 15 | AOD digits: BitmapFont primary, stroke 1.4 | `Font > Outline` width 1.7 primary, BitmapFont fallback | documented since Wear OS 4; instant night read |
| 16 | AOD burn-in jitter as risk 10 | 1 px / 10 min walk on by default, flag to disable | static outline digits are the only fixed lit mass |
| 17 | Eight full-disc PNGs (vault, horizon, channel, ring, flange x2) | Four (`sky`, `sky_aod`, `super`, `super_aod`); dragon pre-clipped so no ring layer is needed above it | half the compositing; the ring/dragon occlusion is baked exactly because both are static |
| 18 | Flange bitmap (with bevel) rotated -14 -> 0 | Only ticks/trail/marker rotate; flange body static | the bevel highlight must not swing with the wake |
| 19 | Baked cast shadows on the sun glyph and Saturn's lit limb | No directional shading on anything that rotates; central highlight only | one scene light |
| 20 | Uniform ring inner shadow + top-left highlight | Shadows on the upper-left inner walls, lips on the lower-right, at every step | v1 read as a convex ring |
| 21 | 118 stars to V 4.0 "dec >= -32", Sirius "through the ring gap", 0.9 px lines 22 %, 1.0 px dots | ~100 stars V <= 3.0 and dec >= -9.2; Sirius/Spica not baked; lines 1.4 px 35 %; dots >= 2.0 px soft | geometry (r <= 186 means dec >= -9.2); legibility; no shimmer |
| 22 | Author at 450, bake at 2x | Author and bake at 480 natively | the platform resizes to screen; 2x buys nothing, 450 blurs 1 px lines |
| 23 | Values at x133/x315, prompt y389 | Values at x145/x305, prompt y383 | `12,480` reached r 185.9 and the prompt r 187.6 |
| 24 | GRISAILLE hue | Stars and lips are PAPER at alpha | one fewer hue; vocabulary de-JLC'd (no "grisaille", "enamel", "Cosmotourbillon") |
| 25 | Ring scale "lift" 0.985 -> 1.0 on wake | Removed | invisible, conflicted with the merged bitmap |
| 26 | `KALI / ORBIT` label silently dropped | Dropped and declared | the dragon occupies the band |

## 11. Rebuttals (critic claim -> verdict)

**Critic 1 (depth, 4/10)**
- Sky mirrored -> **accepted**; re-derived (facing north, east right, stars CCW; RA = LST - H so RA increases clockwise); fixed before any asset is painted.
- Vault imperceptible on OLED, stack collapses -> **accepted**; slate dome 5.2 -> 1.05 %, ground 100 % black.
- Sentinel is a decorative loop, sits on the Aries glyph -> **accepted**; deleted outright (not merely frozen).
- Trig wrong as written -> **accepted**; `rad()` everywhere; the sky expression was already trig-free.
- "No hero, seven competitors" -> **accepted in part**. The horizon figure/ground with the dragon in the sky is the hero and the Moon is the travelling object. **Rejected** the implication that the clocks must be reduced to one or two: the Galaxia principle the brief names is many clocks at different heights; v2 removes the duplicates (reticle, badges, band), not the clocks.
- Kill the pill, radial vignette r 0-110 baked into the vault -> **accepted the kill, rejected the bake**: a vignette baked into a rotating plate would wobble around the fixed digits; the well lives in the static `super.png`, with a wall, so it reads as a recess rather than a dark smudge.
- Moon at its real place -> **accepted and extended**: primary expression from `[MINUTES_SINCE_EPOCH]` (< 1 deg), the `[MOON_PHASE_POSITION]` form kept as fallback (its error, measured over 2026, is 4.8 deg mean / 12.6 deg max, worse than the "<= ~6 deg" claimed).
- Delete the zodiac badge and `SCO` -> **badge accepted, `SCO` rejected**: with band and badge gone, the date line is the only zodiac display, and the brief lists the zodiac month as a time scale.
- Band at true tropical boundaries -> **rejected**: the band is gone (illegible at 9 px and hidden under the ground half the day); the astrolabe reading is not worth an invisible ring.
- Sun 12 px / 24 px box, never occluded -> **accepted**.
- Catalogue honesty (dec >= -9.2, no Sirius) -> **accepted**; V <= 3.0, ~100 stars.
- Column/prompt collisions -> **accepted**: x145/x305, prompt y383 (hostname kept; 22 chars reach r 182.3, decorative).
- 9 px numerals -> **accepted**: none.
- World-fixed light on the flange -> **accepted**: body static, sweep rotates.
- LST quantisation form -> **accepted in spirit**, implemented in minutes with float modulo.
- `Font > Outline`, drop the BitmapFont, horizon_aod as PartDraw -> **Outline accepted**, BitmapFont kept only as a fallback; **PartDraw horizon rejected**: the ground is a transcendental curve, not an arc; it stays a 0-lit-px bitmap, merged into `super_aod.png`.
- Rename the vocabulary; sky dots in cooled phosphor; "CRT scope not a dial" -> **vocabulary accepted** (no JLC words remain); **green stars rejected**: real stars are white, and a green dot field is the flat screen picture the user already rejected. KALI identity is carried by the black ground, the phosphor on what is alive, the official dragon and the prompt, not by tinting astronomy.
- Digit contrast 4:1 at a star pixel, not 12:1 -> **accepted as a pixel fact**; the floor contrast is 12.5:1 and a 2-4 px dot under a 13 px stem does not affect the read; stars under the well are capped at 26 %.

**Critic 2 (readability, 4/10)**
- F1 mirror -> **accepted** (same fix; the Vega check (319,245) is adopted as the device test).
- F2 luminance ladder (sky 6.2 % -> 1.0 %, earth 100 % black, flange lip, digit contrast 12.5:1) -> **accepted with values trimmed** (5.2 % highlight; the 3.5 % variant kept for bright rooms).
- F3 sentinel loop -> **accepted**, deleted.
- F4 dragon extents (max r 212.9, 38 samples, Sun hidden 10:04-12:08) -> **accepted in substance**; my own flattening of the unchanged path gives max r 210.3 at frame y28 and 206.6 at y32, 23-43 samples beyond r 190, apex y 34.6/38.6: same conclusion. Option (a) taken: dragon under the rim, frame y32.
- F5 WFF details (radians, v3 sources, locale strings, named Compare expressions, zero padding) -> **all accepted**.
- F6 vernal point at r 168.75, Milky Way claim, sentinel below the horizon, baked shadows on rotating glyphs -> **accepted**; sentinel gone, claim withdrawn, no shading on rotating glyphs.
- F7 shadows that cancel -> **accepted**; every step now shadows upper-left, lips lower-right.
- F8 Outline width 1.8-2.0 -> **accepted** (1.7 in 450 units = 1.8 px at 480).
- F9 sub-11 px text -> **accepted**; no numerals, no band, no glyph.
- F10 burn-in walk default -> **accepted**, with the stated exception to "never moves".
- F11 dot minimum 2 px, soft edge, bake at 2x -> **dots accepted**; **2x rejected** in favour of baking at 480 natively (Critic 3's point that the platform resizes to screen).
- F12 merge static layers, drop the lift -> **accepted**; four full-disc PNGs via dragon pre-clipping.
- F13 extend the glass slot to y160-290 -> **superseded**: the well (r 124) holds date, time and status at <= r 114.6.
- F14 label removal, leap-year drift -> **accepted**, both declared.
- The Moon "could later" be placed at its true RA/dec -> **done now**.

**Critic 3 (feasibility, 5/10)**
- F1/F2 black-on-black, sub-pixel after resample -> **accepted**; slate ladder, 480 native, lines 1.4 px, dots >= 2 px, no 1 px bevels on the dragon.
- F3 mirror -> **accepted**.
- F4 sentinel -> **accepted**; R10's "static reticle with a one-shot wake spin" **rejected**: a reticle with no information is still furniture; the Moon is the orbiting object.
- `hh`/`mm` undocumented -> **accepted**; verified today that `hh_10`, `hh_1`, `mm_10`, `mm_1` are the documented cell formats.
- Memory ~8.2 MB not 6 -> **accepted**, and now ~2.9 MB.
- Float modulo 86164.0905 -> **accepted**, in minute form.
- `controls` syntax unverified -> **accepted**; EASE_OUT fallback stated.
- Reverse-order ambient entry unverified -> **accepted**; stated as a studio refinement.
- R2 sky 3.7 -> 2.5 % -> **accepted as the bright-room variant**; the default is 5.2 -> 1.05 % because a convex dome needs a tonal range, not a flat lift.
- R7 merge into two superstructure PNGs -> **accepted and bettered**: one `super.png` per mode, the dragon pre-clipped and pre-shaded.
- R8 cap at V 3.0 "about 50 stars" -> **threshold accepted, count corrected**: dec >= -9.2 covers 58 % of the sky; ~100 stars.
- R9 dragon: flat fill, glow, shadow, "keep the apex at r197 overlapping the lip" -> **treatment accepted**; **z-order rejected**: the apex over the lip hides the Sun; the wing under the lip is the stronger cue and costs nothing.
- R11 Sun above the dragon -> **accepted** (and moot, since the dragon is under the rim).
- R12 `[MINUTES_SINCE_EPOCH]`, `ss` TimeText, ternary zero-pad -> **accepted**.
- R13 interrupt the horizon hairline under the status line -> **superseded**: no hairline; the status line is inside the well where ground and floor meet invisibly.
- R14 device checks (OS version, bezel lip at r > 215) -> **accepted**; the trail stays at r 216 until the lip is measured, then moves to r 212 if needed.
- Studio over-promises (tone, bevels, 180 ms, spin smoothness) -> **accepted**; the spin is gone, the rest is declared.

**Kept against all three where no evidence was offered**: the stack of real clocks; the fixed Seoul horizon geometry (every spot point re-verified); the sidereal epoch (E0 LST 0.0036 deg); the apparent-Sun maths (EoT 16.23 min, HA -31.96 deg at the sample); the 360 ms deepest-first wake with the -14 -> 0 signature; the hairline AOD dragon; the 7 % AOD; the untouched HH:MM, dragon path, INFINITY, prompt; the three-hue discipline (one job each).

## 12. Verification log (recomputed for v2)

| Claim | Result |
|---|---|
| Handedness | facing north: east right, stars CCW; RA = LST - H => RA clockwise in the bake; sky angle 360 - LST |
| LST sample 2026-10-25 10:08:24 KST | 177.52 deg (Meeus GMST + 126.978); minute-form expression 177.42 |
| E0 2025-12-01 10:49:54 UTC | Seoul LST 0.0036 deg; 1764586194 s = 29409769.9 min |
| EoT / dec / H0 / HA on DOY 298 | 16.23 min / -13.12 deg / 79.11 / -31.96 deg; Sun at (329.8,57.0), lit |
| Horizon | north point (225,295.4); east/west (393.8,225)/(56.2,225); r186 at (410,201)/(40,201); disc exit (426.5,124)/(23.5,124); zenith (225,126.7) |
| Dragon, frame (135,32,180,123), 559 samples | content x143.3-306.0 y31.4-152.3; max r 206.6 at (150.4,32.3); 23 > r190 (4.1 %), 43 > r186; apex (225,38.6) r186.4 |
| Dragon, frame (135,28) as in v1 | max r 210.3; 43 > r190 (7.7 %); apex y 34.6 — Critic 2's finding confirmed |
| Text boxes | steps `12,480` @x305 r178.6; `100%` @x145 r167.3; prompt 22 ch @y383 r182.3; status r100.4; date r108.8; HH/MM r114.6 |
| Luminance (Rec. 709) | `#33443B` 5.15 %, `#243229` 2.82 %, `#141C18` 1.05 %, `#163A3C` 3.52 %, `#5E7A6A` 17.3 %, `#91AD80` 37.5 %, `#EFF8EC` 91.5 % |
| Moon at the sample | RA 0.92 h, dec +10.0, age 13.8 d, HA 10.9 h: below the horizon (hidden). At 22:00 KST: RA 1.35 h, dec +13.0, HA -1.62 h, r 144.4, dial (284.5,93.4) = behind the dragon's right wing; at 20:00 KST it is at about (343,142), clear of the frame |
| Fallback Moon (phase position) over 2026 | RA error mean 4.8 deg, max 12.6; dec error max 7.9 |
| WFF references read today | source-type (MOON_PHASE_POSITION 0-28, MOON_PHASE_TYPE 0-7 with numbering, MINUTES/SECONDS_SINCE_EPOCH v3, TIMEZONE_OFFSET_MINUTES_DST v3, HOUR_0_23_MINUTE float, DAY_OF_YEAR 1-366); arithmetic-expression (trig = java.lang.Math, `rad()`/`deg()`, `clamp`, `floor`, ternary); TimeText (`hh_10`, `hh_1`, `mm_10`, `mm_1`, `ss` documented; children Variant, BitmapFont, Font); Font (children include Outline, Shadow, OutGlow); Outline (color required, width = distance outside the edge, default 2.0, Wear OS 4); WatchFace width/height/clipShape |
| Not verified (must not be claimed) | on-device filtering of rotated PartImages; system AOD pixel shift for WFF; `controls` string syntax; `TimeText > Font > Outline` end to end; one-vs-many Variant per element; the firmware version on the user's SM-R965N |
