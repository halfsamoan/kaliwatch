# KALIWATCH v5 "Celestial Vault" — proposal 01 (KALI brand lens)

Author lens: brand guardian of the KALI terminal identity + the pentester who will wear it.
Design space 450x450, centre (225,225), r 225. Target Galaxy Watch6 Classic 480x480 round (scale 1.0667).
Seoul 37.5665 N, 126.9780 E, UTC+9.

## 0. The one-sentence thesis

v4 is flat because everything in it lives on one plane and tells one time. v5 is a **physical stack of six planes**, each carrying a different real clock (second, minute, apparent-solar day, sidereal day, lunar month, zodiac month), with the sky itself turning under a fixed Seoul horizon, the official dragon floating over that sky, and the terminal readout sitting on a smoked-glass channel cut across the vault. Nothing the user already loved moves: same dragon path, same phosphor, same HH:MM at the same baseline, same INFINITY, same 360 ms wake, same quiet AOD.

What must never be touched: the official dragon path (treatment only), phosphor #A6F46A as the only "live" colour, HH:MM at x166/x284 baseline y252 (never scaled, never moved), the word INFINITY on both faces, monospace numerals, the prompt line, a black void (no coloured backgrounds), no decorative loops.

## 1. Layer stack (back to front)

Clock-scale legend: SEC seconds, MIN minutes, SOLAR apparent-solar 24 h day, SID sidereal day (86164.09 s), LUN lunar phase, ZOD zodiac month, NONE static.

| z | Layer | Shows | Clock | Geometry (450 space) | Material (baked into PNG unless noted) | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | VOID | pure black disc | NONE | full disc | `#000000` | on | on |
| 1 | VAULT (sidereal sky) | Seoul night sky: 118 stars to mag 4.0 with dec >= -32, 18 constellation line-sets, Milky Way wash, painted Saturn + Jupiter (2026 epoch), zodiac sign band, Polaris marker at centre | SID, one clockwise turn per 23h56m04s (0.2507 deg/min) | 450x450 bitmap, content baked inside r<=186, pivot (0.5,0.5), north celestial pole at (225,225); star r = (90 - dec) x 1.875 px; baked frame has RA 0h at 12 o'clock, RA increasing counter-clockwise | Grisaille: fired dark base radial `#06100C` centre -> `#0B1A14` at r186; stars are dots 1.2-4.7 px of GRISAILLE `#B8C4BE` at alpha 0.35-0.80 by magnitude; lines 0.9 px at 22%; Milky Way wash <= 8%; planets: Saturn 11 px body + 26x7 tilted ring (ABYSS `#163A3C` rim, grisaille lit limb), Jupiter 7 px with 2 bands; zodiac band r170-182, twelve 9 px glyphs at RA 0,2,...,22 h, grisaille 35% | full bitmap, alpha 255 | `vault_aod.png`: only the 16 brightest stars as 2 px dots `#5E7A6A` at 70%, no lines/planets; still rotates sidereally (slow drift = burn-in protection) |
| 2 | HORIZON (observer chiaroscuro) | Seoul's horizon fixed to the dial: sky above is luminous, earth below falls into darkness; the chart's east is at 9 o'clock, zenith direction at 12 o'clock, north horizon 70 px below centre | NONE (fixed to observer) | 450x450 alpha bitmap; horizon curve passes (225,295) at the bottom, (56,225) and (394,225) at the equator crossing, (32,184)/(418,184) at r197, leaves the disc at (23,125)/(427,125) | Below horizon: black at 78% alpha, 16 px feather; horizon hairline 1.2 px grisaille 30% with 6 px bloom 8%; 20 px "atmosphere" band above the line at grisaille 10% | hairline + atmosphere + darkening | `horizon_aod.png`: darkening only (0 lit px); composition stays identical |
| 3 | OBJECTS | Moon phase disc (left) and current zodiac sign glyph (right), floating over the vault with cast shadows | LUN (moon), ZOD (glyph) | Moon centre (96,168) d 28; glyph centre (354,168) 24 px box; both outside the dragon bbox and the date line | Moon: lit limb grisaille `#B8C4BE`, dark side `#1A231C` with 1 px rim light, 8 phase frames; glyph: 1.2 px phosphor stroke; both carry a baked drop shadow (dx 2, dy 3, blur 4, black 40%) onto the vault | on | hidden |
| 4 | SENTINEL (Cosmotourbillon analogue) | A phosphor tracking reticle pinned to RA 0h (the vernal point, "origin 0x0000" of the sky). It orbits once per sidereal day with the vault and, like a tourbillon cage, spins once per minute | SID (orbit) + SEC (cage spin) | Orbit radius 178, 16x16 glyph; at LST 0h it sits at (225,47) (behind the dragon); at the sample time (LST 11h50) it sits near (233,403) under the prompt | Ring r 6.5 stroke 1.3 phosphor, centre dot 2.4 px, three radial ticks 2.5 px at 0/120/240 deg, 5 px phosphor glow 25% | spinning reticle | `sentinel_aod.png`: ring only, 1 px `#4F6B45`, no spin, still orbits |
| 5 | TIME CHANNEL (smoked glass) | A recessed slot cut across the vault in which the digits sit; it is the "sunken dial" of the stack | NONE | 450x88 bitmap at (0,186): slot x52-398, y190-262, rounded ends r36 | Black 55%; top wall inner shadow 6 px black 70% -> 0 (light from 10 o'clock, so the top wall of a recess is in shadow); bottom edge 1 px grisaille 18% highlight | on | `channel_aod.png`: darkening only, no highlight |
| 6 | HOUR RING (sunken 24 h solar ring) | 24 indexes, 00 at 6 o'clock (midnight, under the horizon), 06 at 9 o'clock (east, sunrise), 12 at 12 o'clock (noon), 18 at 3 o'clock (west). The ring is lower than the flange and higher than the vault | reads SOLAR via the sun pointer | annulus r190-206 | Floor radial ABYSS `#163A3C` at r190 -> `#0A1C1D` at r206; indexes 1 px grisaille 45%, majors 00/06/12/18 2 px 70% with 9 px numerals; inner occlusion shadow onto the vault r182-190 (black 65% -> 0); outer bevel 1.5 px grisaille 30% top-left fading to a 1.5 px black line bottom-right | on | `hour_ring_aod.png`: 24 indexes at `#3F5A43` + the inner shadow only |
| 7 | SUN POINTER | Golden sun at the true solar hour angle of Seoul: at the top at apparent noon (about 12:16 KST in late October), at the bottom at true midnight, lit above the horizon, an ember below it | SOLAR (apparent; includes the 32 min Seoul longitude offset and the equation of time) | rides r198; 18x18 glyph; Group pivot (0.5,0.5) rotated by HA | Lit: SUN GOLD `#E0B36A` disc 7 px, 8 rays 1.2 px to r8.5, 12 px glow 30%, cast shadow on the ring floor (dx 1.5, dy 2.5, black 55%). Ember: 5 px `#5E4B2A` disc + 1 px `#8A6E3E` rim | lit/ember by condition | ember only (~40 lit px) |
| 8 | OUTER FLANGE (minute / seconds ring) | 60 minute ticks, phosphor seconds trail + marker; the highest ring, with the wake signature rotation | SEC, MIN | annulus r206-225; trail at r216 (Arc 432x432), marker centre r216 | Steel-green `#0E1A12` -> `#050A06`, top-left bevel highlight `#2C4A33` 1.5 px at r207, bottom-right shadow; ticks 1 px `#34543C` r214-220, 5-min ticks 1.6 px `#6B8F6A` r212-221; trail 1.7 px phosphor 72%; marker 6.6 px dot + 5 px stub | on, angle -14 -> 0 on wake | `flange_aod.png`: 12 ticks `#2E4A33` 1 px; no trail |
| 9 | DRAGON (official Kali logomark) | The press-pack path, unchanged, floating above ring and vault | NONE | frame x135 y28 w180 h123 (bottom y151); apex r197 overlaps the ring's inner edge (object in front of the ring = depth cue) | Active `dragon_engraved.png`: fill `#A6F46A`, 1 px top-left inner highlight `#D9FFB0`, 1 px bottom-right inner shade `#5E9A3C`, 6 px outer glow phosphor 22%, cast shadow (dx 2, dy 4, blur 5, black 60%) onto the sky and ring. AOD `dragon_outline.png`: the same path stroked 1.2 px `#6E8F5E`, no fill | engraved | hairline outline (about 0.9% of pixels instead of v4's filled 2.2%) |
| 10 | INSTRUMENT TEXT (terminal readout) | date + zodiac, HH:MM, SEC + LST, BATTERY/STEPS with gauges, prompt `kali@vault:~$ INFINITY` | MIN (date, LST), SEC | see composition table | Roboto Mono, tabular; vector text, no shading | all | date, outline HH:MM, `BAT 78%`, `INFINITY` |

Reading order of the time scales from the edge inward: seconds and minutes (flange) -> solar day (hour ring + sun) -> sidereal day (vault + sentinel) -> lunar and zodiac (objects) -> civil HH:MM on the glass. That is the Galaxia principle: every height is a different clock.

Star catalogue baked into the vault (baked frame, LST = 0; x,y in 450 space; dot px = 3.4 - 0.9 mag, min 1.0):

| Star | RA | dec | mag | r | x | y | dot |
|---|---|---|---|---|---|---|---|
| Polaris | 2h31.8m | +89.26 | 2.00 | 1.4 | 224.1 | 223.9 | 3 px ring marker |
| Vega | 18h36.9m | +38.78 | 0.03 | 96.0 | 319.8 | 209.6 | 3.4 |
| Deneb | 20h41.4m | +45.28 | 1.25 | 83.8 | 288.9 | 170.7 | 2.3 |
| Altair | 19h50.8m | +8.87 | 0.77 | 152.1 | 359.7 | 154.3 | 2.7 |
| Arcturus | 14h15.7m | +19.18 | -0.05 | 132.8 | 299.1 | 335.2 | 3.4 |
| Capella | 5h16.7m | +45.99 | 0.08 | 82.5 | 143.9 | 209.5 | 3.3 |
| Rigel | 5h14.5m | -8.20 | 0.13 | 184.1 | 44.5 | 188.7 | 3.3 |
| Betelgeuse | 5h55.2m | +7.41 | 0.50 | 154.9 | 70.2 | 221.8 | 2.9 |
| Sirius | 6h45.1m | -16.72 | -1.46 | 200.1 | 28.8 | 264.1 | 4.7 (outside r186: baked at 70% as a rim star, visible only through the ring shadow gap) |
| Procyon | 7h39.3m | +5.22 | 0.34 | 159.0 | 80.7 | 291.7 | 3.1 |
| Pollux / Castor | 7h45m / 7h35m | +28.0 / +31.9 | 1.14 / 1.58 | 116.2 / 109.0 | 120.9 / 125.2 | 276.5 / 268.7 | 2.4 / 2.0 |
| Aldebaran | 4h35.9m | +16.51 | 0.85 | 137.8 | 96.4 | 175.6 | 2.6 |
| Regulus | 10h08.4m | +11.97 | 1.35 | 146.3 | 156.5 | 354.3 | 2.2 |
| Spica | 13h25.2m | -11.16 | 0.97 | 189.7 | 293.9 | 401.7 | 2.5 (rim) |
| Dubhe / Alioth / Alkaid (Plough) | 11h04m / 12h54m / 13h47m | +61.8 / +56.0 / +49.3 | 1.8 / 1.8 / 1.9 | 53.0 / 63.8 / 76.3 | 212.1 / 239.9 / 259.5 | 276.4 / 287.1 / 293.1 | 1.8 / 1.8 / 1.7 |
| Mirfak, Algol (Perseus) | 3h24m / 3h08m | +49.9 / +41.0 | 1.8 / 2.1 | 75.3 / 92.0 | 166.4 / 157.7 | 177.7 / 162.3 | 1.8 / 1.5 |
| Alpheratz, Scheat, Markab (Square) | 0h08m / 23h04m / 23h05m | +29.1 / +28.1 / +15.2 | 2.1 / 2.4 / 2.5 | 114.2 / 116.1 / 140.2 | 220.8 / 253.2 / 258.4 | 110.9 / 112.4 / 88.8 | 1.5 / 1.2 / 1.2 |
| Kochab | 14h50.7m | +74.16 | 2.07 | 29.7 | 245.1 | 246.8 | 1.5 |
| Saturn (2026 epoch) | 1h35m | +6.5 | 0.8 | 156.6 | 161.9 | 81.7 | 11 px body + ring |
| Jupiter (2026 epoch) | 9h20m | +16.5 | -2.2 | 137.8 | 136.4 | 330.6 | 7 px body |

The full 118-star list (mag <= 4.0, dec >= -32) and the 18 constellation line-sets are generated by the studio from a bright-star table with the same projection; the table above is the spot check.

## 2. Composition

Exact positions (unchanged from v4 wherever the user already approved them):

| Element | Position | Size / colour |
|---|---|---|
| Official dragon | frame x135 y28 w180 h123 (viewBox 5 22 126 94 preserved) | engraved phosphor; AOD outline `#6E8F5E` |
| Date + zodiac | x225 baseline y179, anchor middle | 17 px `#9BAB9C`; text `25 OCT / SUN / SCO`; AOD `#7F9472` |
| HH | x166 baseline y252 | 78 px 600, `#EFF8EC`; AOD fill `#11200F` stroke `#91AD80` 1.4 |
| colon | x225 baseline y248 | phosphor; AOD `#3F5A43` (dim, it is the only pixel group lit at one spot all night) |
| MM | x284 baseline y252 | as HH |
| Status line | x225 baseline y281 | 15 px `#9BAB9C`: `SEC 24 · LST 11:50` |
| BATTERY label / value / gauge | x133 y312 / y343 / y357 (x97-169) | 15 px / 27 px `#EFF8EC` (warning `#F3C479` <= 15%) / 2 px phosphor |
| STEPS label / value / gauge | x315 y312 / y343 / y357 (x279-351) | same; gauge = min(steps/10000, 1) x 72 |
| Prompt | x225 baseline y389 | 13 px `kali@vault:~$ ` `#9BAB9C` + `INFINITY` phosphor |
| Moon | centre (96,168) | d 28 |
| Zodiac glyph | centre (354,168) | 24 px |
| AOD BAT / INFINITY | x225 y329 / y375 | 17 px / 11 px tracking 2, `#7F9472` |

Safe radii: information text (HH:MM, date, battery, steps values) stays inside r 178 (12 px clear of the ring's inner shadow at r182). Spot checks: `10` glyph box corner (119,196) r110; steps value `6,240` corner (356,343) r176; date corner (133,165) r110. Decorative lines (status, prompt, gauges) may reach r 186. Nothing with ink crosses r 190 except the dragon apex, which is deliberately in front of the ring.

Depth planes relative to the digits: the digits (z10) sit on the smoked glass (z5), which sits on the vault (z1) and the horizon darkening (z2). So under the digits the stack is black -> dim star field (<= 60% grisaille luminance, further cut 55% by the glass) -> paper-white 78 px digits. Contrast ratio digits-to-worst-case background stays above 12:1. The two rings (z6, z8) sit at r >= 190 and never pass under a digit; the dragon (z9) sits above the rings but below the text plane and never overlaps text.

Horizon placement is the chiaroscuro that organises the whole face: the telemetry block (y300-392) lies in the "earth" (below the horizon, darkened 78%), the dragon lies in the brightest sky, and the horizon hairline passes just under the glass channel.

## 3. Palette

Identity, unchanged: PHOSPHOR `#A6F46A` (dragon, seconds trail and marker, sentinel, colon, INFINITY, gauges, zodiac glyph) with its existing dark ramp `#6FB04A` / `#34543C` / `#17291D`; PAPER `#EFF8EC` for digits and values; `#9BAB9C` secondary; black `#000000`.

Three added controlled hues, each with one job:

1. GRISAILLE `#B8C4BE` (cool bone white, the enamel): stars, constellation lines, moon lit limb, ring indexes, bevel highlights. Always applied at <= 70% alpha over dark, never as text, never as a fill. This is what makes the sky read as painted enamel rather than as vector dots.
2. SUN GOLD `#E0B36A`: the sun pointer only (ember state = same hue at 40%, `#5E4B2A` on black). The existing warning `#F3C479` is its lighter sibling (same hue angle, ~39 deg) and stays for low battery; together they are one hue family.
3. ABYSS TEAL `#163A3C` (fired dark enamel): hour-ring floor, Saturn's rings, deepest vault wash. It is the "not-quite-black" that makes black read as depth, and it carries forward the teal the user liked in v3/v4.

Everything else is one of these hues at a different alpha. No blue-white star glints, no magenta, no gradients in text.

## 4. Motion

Wake (AOD -> Active), 360 ms total, ease cubic-bezier(.22,1,.36,1). The order is the order of the planes: the deepest plane appears first, the text plane last, so the eye watches depth assemble. WFF Variant fractions in brackets (360 ms = 1.0).

| t (ms) | Layer | Property |
|---|---|---|
| 0-120 [start 0, dur .33] | VAULT | active bitmap alpha 0->255 while `vault_aod` alpha 255->0 (same pivot, same angle: stars do not jump, lines and planets "develop" around them) |
| 40-200 [.11/.44] | HORIZON | hairline + atmosphere alpha 0->255 (darkening already present in AOD) |
| 60-240 [.17/.50] | HOUR RING + SUN | floor/bevel alpha 0->255; ring Group scale 0.985->1.0 about (0.5,0.5) (a 3 px "lift" towards the eye); sun lit glyph alpha 0->255 over the ember |
| 0-360 [0/1.0] | FLANGE | angle -14 -> 0 deg and alpha 0->255 (the existing orbital-alignment signature, kept); trail and marker ride with it |
| 80-300 [.22/.61] | OBJECTS + SENTINEL | moon, zodiac glyph, spinning sentinel alpha 0->255 (static AOD sentinel 255->0) |
| 120-300 [.33/.50] | DRAGON | outline alpha 255->0, engraved alpha 0->255 (the dragon "fills" in place, exactly as v2-v4) |
| 140-360 [.39/.61] | TIME + GLASS | glass highlight alpha 0->255; digit fill `#11200F`->`#EFF8EC`, stroke-opacity 1->0 (studio); in WFF the outline clock alpha 255->0 and the active clock 0->255 |
| 80-300 [.22/.61] | TELEMETRY | SEC/LST, battery, steps, gauges, prompt alpha 0->255 (the existing 80 ms delay + 220 ms) |

Slow real-time rotations (always on, Active and AOD):
- Vault + sentinel orbit: 360 deg per 86164.09 s, clockwise, 0.2507 deg/min. A star at r160 moves 0.70 px/min.
- Sun pointer: 360 deg per 86400 s (plus the slow equation-of-time wobble, +-16 min over the year), clockwise, 0.25 deg/min.
- Moon frame: steps every ~3.7 days; zodiac glyph: steps monthly; painted planets: epoch asset, refreshed yearly.

Each second (Active only): seconds trail endAngle = SECOND x 6; marker angle = SECOND x 6; sentinel cage angle = SECOND x 6; `SEC nn` text. Nothing else moves at a perceptible rate. No twinkle, no pulse, no blink.

Active -> AOD, 180 ms: all layers go to their AOD state together, front planes first (telemetry 0-80, digits 0-180, dragon 40-180, rings/horizon/vault 60-180). In WFF the same Variants play in reverse at the system's duration; the 180/360 asymmetry is a studio refinement, not a WFF guarantee.

Reduced motion (OS or manual): every transition instant; the vault, sun and sentinel still track time because they are clocks, not decoration.

## 5. AOD

What remains: outline HH:MM, date line, `BAT nn%`, `INFINITY`, dragon as a 1.2 px hairline, 16 brightest stars drifting sidereally, Polaris ring, 24 hour-ring indexes with the ring's inner shadow, 12 flange ticks, sun ember, static sentinel ring, horizon and glass darkening (0 lit pixels). The face is unmistakably the same object: same silhouette, same slot, same ring edges, with the enamel "switched off".

Estimated lit pixels (disc area 159,043 px, non-zero RGB): digit strokes ~2,400 + digit inner fill `#11200F` ~3,600 + colon ~70 + dragon hairline ~3,000 + date ~1,000 + BAT ~630 + INFINITY ~360 + stars ~110 + ring indexes ~170 + flange ticks ~70 + sun ember ~40 + sentinel ~45 = ~11,500 px = about 7.2% (v4: 11.3%, because its dragon was filled). Luminance-weighted (what OLED power actually follows: digit fill at 2%, strokes at ~38%, text at ~30%) about 2.6%. Comfortably under the 15% ceiling with room for the user to brighten the digit stroke if the watch is dim.

Burn-in strategy: (1) nothing static exceeds relative luminance 0.38 (`#91AD80` digit stroke) and every static element is a hairline <= 1.4 px, so no pixel block is held at intensity; (2) all sky-plane elements (stars, sentinel) and the sun ember drift continuously, a 2 px star stays on one pixel <= 90 s; (3) the minute digit changes every minute, the hour digit every hour; the colon, the only permanent fixed group, is held at `#3F5A43` (luminance 0.09); (4) the system's periodic AOD pixel shift applies on top; (5) the dragon hairline replaces v4's filled dragon, removing the largest static lit mass.

## 6. WFF v4 mapping (one line per layer, in the style of the existing `watchface.xml`)

Shared expressions (define once, reuse; verify sin/cos units in the validator, the formulas below are in degrees):

```
LST_DEG  = ((([SECONDS_SINCE_EPOCH] - 1764586194) % 86164) * 360 / 86164)
           // E0 = 2025-12-01 10:49:54 UTC, when Seoul LST = 0h. Integer modulo keeps the number < 86164
           // (no float-precision loss). Verified: 2026-10-25 10:08:24 KST true LST 177.52 deg, expression 177.64 deg;
           // drift ~0.18 deg/yr. Quantise to minutes for the vault: use (floor([SECONDS_SINCE_EPOCH]/60)*60).
B        = 0.98630 * ([DAY_OF_YEAR] - 81)
EOT_MIN  = 9.87*sin(2*B) - 7.53*cos(B) - 1.5*sin(B)
SUN_HA   = 15 * ([HOUR_0_23_MINUTE] - [TIMEZONE_OFFSET_MINUTES_DST]/60 + 8.4652 - 12 + EOT_MIN/60)
           // 8.4652 h = 126.978 deg / 15 (Seoul longitude). Sample: -31.86 deg (sun at the 10:50 position).
SUN_DEC  = 23.44 * sin(B);   H0 = 90 + 0.83 * SUN_DEC        // linearised acos(-tan dec tan 37.57), error < 1 deg
SUN_UP   = (SUN_HA > 0 - H0) && (SUN_HA < H0)
LST_TEXT = floor(LST_DEG/15) : floor((LST_DEG % 15) * 4)
```

| z | WFF construction |
|---|---|
| 0 | `<Scene backgroundColor="#ff000000">` |
| 1 | `<PartImage name="vault" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Image resource="vault_2026"/><Transform target="angle" value="LST_DEG"/><Variant mode="AMBIENT" target="alpha" value="0" duration="0.33"/></PartImage>` plus a sibling `vault_aod` PartImage with the same Transform, `alpha="0"` and `Variant AMBIENT alpha 255` |
| 2 | `PartImage horizon_seoul` (static) with `Variant AMBIENT alpha 0`; sibling `horizon_aod` (darkening only) alpha 0 -> AMBIENT 255 |
| 3 | Moon: `<Condition><Expressions><Expression name="mp">[MOON_PHASE_TYPE]</Expression></Expressions>` with 8 `<Compare expression="mp == n">` branches each holding a `PartImage moon_n` 28x28 at (82,154); Condition on `[DAY_OF_YEAR]` ranges (Aries 80-109, Taurus 110-140, Gemini 141-171, Cancer 172-203, Leo 204-234, Virgo 235-265, Libra 266-295, Scorpio 296-325, Sagittarius 326-355, Capricorn 356-19, Aquarius 20-49, Pisces 50-79) selecting `PartImage zodiac_xx` 24x24 at (342,156); both groups `Variant AMBIENT alpha 0` |
| 4 | `<Group name="sentinel_orbit" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Transform target="angle" value="LST_DEG"/><PartImage x="217" y="39" width="16" height="16" pivotX="0.5" pivotY="0.5"><Image resource="sentinel"/><Transform target="angle" value="[SECOND]*6"/><Variant mode="AMBIENT" target="alpha" value="0"/></PartImage><PartImage ... sentinel_aod alpha 0 -> AMBIENT 255/></Group>` |
| 5 | `PartImage channel_glass` 450x88 at (0,186), `Variant AMBIENT alpha 0`; sibling `channel_aod` alpha 0 -> 255 |
| 6 | `<Group name="hour_ring" pivotX="0.5" pivotY="0.5"><PartImage hour_ring 450x450/><Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.17" duration="0.5"/><Variant mode="AMBIENT" target="scaleX" value="0.985" .../><Variant ... scaleY .../></Group>` plus `hour_ring_aod` sibling |
| 7 | `<Group name="sun" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5"><Transform target="angle" value="SUN_HA"/><Condition><Expressions><Expression name="up">SUN_UP</Expression></Expressions><Compare expression="up"><PartImage x="216" y="18" width="18" height="18"><Image resource="sun_lit"/><Variant mode="AMBIENT" target="alpha" value="0"/></PartImage></Compare><Default><PartImage ... sun_ember/></Default></Condition></Group>` (the ember is also the AMBIENT-visible glyph) |
| 8 | `<Group name="flange" pivotX="0.5" pivotY="0.5" angle="0"><Variant mode="AMBIENT" target="angle" value="-14" duration="1.0" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1" angleDirection="CLOCKWISE"/><Variant mode="AMBIENT" target="alpha" value="0"/><PartImage flange/><PartDraw x="0" y="0" width="450" height="450"><Arc centerX="225" centerY="225" width="432" height="432" startAngle="0" endAngle="0"><Stroke color="#b8a6f46a" thickness="1.7" cap="ROUND"/><Transform target="endAngle" value="[SECOND]*6"/></Arc></PartDraw><Group name="marker" pivotX="0.5" pivotY="0.5"><Transform target="angle" value="[SECOND]*6"/><PartDraw ...><Ellipse x="221.7" y="5.7" width="6.6" height="6.6"><Fill color="#ffa6f46a"/></Ellipse><Line startX="225" startY="2" endX="225" endY="7"><Stroke color="#ffa6f46a" thickness="1.5"/></Line></PartDraw></Group></Group>` + `flange_aod` PartImage alpha 0 -> AMBIENT 255 |
| 9 | `PartImage dragon_engraved` 180x123 at (135,28) `Variant AMBIENT alpha 0 startOffset 0.33 duration 0.5`; `PartImage dragon_outline` alpha 0 -> AMBIENT 255. Both PNGs are rasterised from the unchanged press-pack path (provenance SHA kept in `brand/PROVENANCE.md`) |
| 10 | `DigitalClock` with three `TimeText` (hh at x127 w78, mm at x245 w78, colon as PartText at x216) `Font roboto_mono 78 BOLD #ffeff8ec`; a second DigitalClock for AOD using a `BitmapFont` of outline glyphs (10 digits + colon, stroke 1.4 `#91AD80`, fill `#11200F`) with alpha 0 -> AMBIENT 255 (if the validator accepts `Font > Outline`, use that instead of the bitmap font); date `PartText` Template `%s %s / %s / %s` with `[DAY_Z] [MONTH_S] [DAY_OF_WEEK_S]` + zodiac text from the same DAY_OF_YEAR Condition; status Template `SEC %s · LST %s:%s` with `[SECOND]` and LST_TEXT; battery/steps as in v4 XML; gauges `Rectangle width` via `Transform target="width" value="[BATTERY_PERCENT]*0.72"` and `clamp([STEP_COUNT],0,10000)*0.0072`; low-battery colour via Condition `[BATTERY_PERCENT] <= 15`; prompt as two PartTexts |

Assets (author at 480 px, 2x for the bevels, PNG-8 where flat): vault_2026, vault_aod, horizon_seoul, horizon_aod, channel_glass, channel_aod, hour_ring, hour_ring_aod, flange, flange_aod, dragon_engraved, dragon_outline, sun_lit, sun_ember, sentinel, sentinel_aod, moon_0..7, zodiac_ari..pis, 11 outline glyphs. Raw RGBA total about 6 MB; well inside the WFF memory evaluator limits (check ambient budget separately).

## 7. Risks

1. **Readability**: a star field under the digits can cost the < 1 s read. Mitigation is structural: grisaille capped at 60% luminance, the 55% glass, and the Milky Way wash never under the slot. Verify on device at 100 nits outdoors.
2. **Mirror error**: if my handedness is wrong (east at 9 o'clock, clockwise sidereal turn), the sky rotates backwards. First device build: compare with Stellarium at wake; the fix is one sign flip plus a mirrored bake.
3. **Bevels going soft**: 1-1.5 px highlights authored at 450 and scaled to 480 blur into nothing; bake at 480 directly or at 2x.
4. **Trig units**: if WFF `sin/cos` expect radians, the EoT and sun-up conditions are wrong by far. Validate with a fixed [DAY_OF_YEAR] before shipping; the vault does not depend on trig at all.
5. **Per-second re-render of a full-disc bitmap**: `[SECONDS_SINCE_EPOCH]` changes every second; quantise LST_DEG to minutes so the vault transform updates once a minute, keeping the per-second work to the Arc, marker and sentinel cage.
6. **Noon eclipse**: at apparent solar noon the sun pointer passes behind the dragon's apex for about 40 minutes. I consider it a feature; if the user does not, lower the dragon to y36 or move the pointer to r200 above the dragon (z-swap).
7. **Horizon vs sun**: the painted horizon is the star horizon (declination-dependent), while the sun lights/embers by its own H0; near solstices the sun crosses the painted line up to 20 min before/after it changes state. Acceptable for an instrument, documented.
8. **Epoch assets**: Saturn and Jupiter positions are baked for 2026; by 2028 they are wrong unless `vault_2027.png` is regenerated by the studio script.
9. **Still looking flat on-watch**: depth here comes from occlusion shadows and bevels; at low brightness the ring shadow (65% black) can vanish. Keep the sunken ring's inner shadow at >= 8 px and test at 20% brightness.
10. **AOD retention**: the outline digits and colon are the only fixed lit groups; if retention appears, drop the stroke to `#7E9A70` and add a 1 px per-10-minute x-jitter via Variant (allowed slow drift).

## 8. Why it is not flat

Look at the face and count the clocks you can see without reading a digit: the trail sweeping the outer flange (seconds), the gold sun creeping along a channel that is visibly lower than that flange (your solar day), a reticle and a whole painted sky turning under a horizon that does not move (the sidereal day, four minutes faster), a moon whose terminator is tonight's, a glyph that names this month's sign, and the digits themselves lying in a slot of smoked glass cut across all of it. Each plane throws a shadow on the one beneath it: the flange's bevel catches light from ten o'clock, the hour ring's lip darkens the stars under it, the dragon's shadow falls across both ring and sky, the slot's top wall is in shade. Nothing is a print; everything is an object at a height, and the wake sequence assembles those heights in order, deepest first. The sky is not wallpaper either: Vega, Deneb and Altair are where they are over Seoul right now, Polaris sits under the colon, and the stars you see lit are the ones above the roofline tonight. And it is still KALI: black void, phosphor on everything that is alive, the official dragon engraved rather than redrawn, a prompt line that ends in INFINITY.

## 9. ASCII layer diagram

```
   eye
    |
 z10  INSTRUMENT TEXT    25 OCT / SUN / SCO   [10]:[08]   SEC 24 · LST 11:50   BATTERY 78%  STEPS 6,240   kali@vault:~$ INFINITY
 z9   DRAGON             ======== official path, engraved phosphor, casts shadow down ========
 z8   OUTER FLANGE       |##### r206-225  60 ticks, phosphor trail  (SEC/MIN)  wake: -14 deg -> 0 #####|
 z7   SUN POINTER                 o  rides r198 at apparent solar hour angle (SOLAR)
 z6   HOUR RING           [___ r190-206 sunken 24 h ring, bevel up, 8 px shadow cast inward ___]
 z5   TIME CHANNEL                 ( smoked glass slot y190-262, top wall in shade )
 z4   SENTINEL                      (+) reticle at r178, orbits with the sky (SID), cage spins 1/min (SEC)
 z3   OBJECTS                 (moon d28 @ 96,168)                     (zodiac glyph @ 354,168)
 z2   HORIZON              ~~~~~ fixed Seoul horizon: sky above luminous, earth below 78% dark ~~~~~
 z1   VAULT                . * .  118 stars, 18 constellations, Saturn, Jupiter, Polaris at centre  . * .
                           turns clockwise once per 23h56m04s about (225,225)
 z0   VOID                 ##################################  #000000  ##################################

 Radial section (centre -> edge):   glass | vault r<=182 | shadow 182-190 | hour ring 190-206 | flange 206-225
```
