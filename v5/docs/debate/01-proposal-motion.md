# KALIWATCH v5 "Celestial Vault" — motion & depth proposal

Lens: motion designer (Apple Watch Astronomy, One UI Watch transitions). Design space 450x450, centre C=(225,225), r=225. Target SM-R965N 480x480 (x1.0667). All angles are WFF convention: degrees clockwise from 12 o'clock. Light rule for every baked material: one key light from 11 o'clock, 35 deg elevation (highlights on upper-left edges, shadows fall +2,+3 px to lower-right).

## 0. Concept in one breath

v4 is a black print with a planet pasted at the edge. v5 is a **well**: a sunken circular vault (r<196) in which the real Seoul sky turns once per sidereal day, with the official dragon mounted over its rim, a gold sun and a phased moon circling the rim once per solar day, and a raised brushed flange (r 200–225) carrying the minute scale and the seconds marker. The terminal lives on the **ground**: the part of the vault that is below Seoul's horizon (a lens at the bottom of the well) is black lacquer, and BATTERY / STEPS / prompt are its "white transferred inscriptions", exactly like Galaxia's deepest level. Polaris sits behind the colon of HH:MM — the one fixed point of the sky is the one fixed element of the face.

Seven real time-scales on five physically separated planes: second (flange), minute (rim light), civil hour (digits), 24-h solar (sun pointer), sidereal day (vault), zodiac month (sun pointer against the ecliptic drawn on the vault), lunar month (moon's elongation from the sun + phase).

## 1. Layer stack, back to front

| z | Layer | Shows | Time-scale | Geometry (450 space) | Material (baked) | Active | AOD |
|---|---|---|---|---|---|---|---|
| z0 | VOID | black | none | full disc | #000000 | on | on |
| z1 | VAULT (sidereal sky disc) | Real northern sky, azimuthal-equidistant projection centred on the north celestial pole, scale 1.6333 px/deg, disc covers dec +90 to -30 (r 196). ~90 stars V<=3.0 (2.6 px at V0 down to 1.2 px at V3), ~240 stars V3–4 as 0.7 px dust, 18 constellation stick figures (UMa, UMi, Cas, Cep, Dra, Cyg, Lyr, Aql, Peg, And, Per, Aur, Tau, Ori, Gem, CMa/CMi, Leo, Boo), 16 brightest stars with 6 px gaussian halo, Milky Way wash, dashed ecliptic hairline, 12 zodiac glyphs at mid-sign (r 110–184). RA increases clockwise, RA 0h at 12 o'clock. | **sidereal day 23h56m04.1s** (one CCW turn) | bitmap 400x400 at (25,25), pivot C; visible only inside r 196 | Grisaille: base #050A08→#0A1512, Milky Way band #16302C @55% blurred sigma 14 px ("enamel laid thicker where the sky is brighter"), lines 0.8 px #2C4A3C @70%, stars #C9D8E4 (4 red giants #E9B869 @80%), glyphs 11 px #3C5C46, ecliptic 0.8 px #2A4232 dash 3/4 | vault_active.png alpha 255 | vault_ambient.png: 24 stars V<=2.0 only, 1.5 px #3A5044, still rotating |
| z2 | GROUND + WELL SHADOW | (a) below-horizon lens = terminal ground; (b) inner shadow cast by the flange into the well; (c) horizon hairline | none (fixed to Seoul 37.57 N) | horizon = circle centre (225,79.7) R 206.7 (passes (78,225),(225,286),(372,225)); ground = inside well, outside that circle; shadow annulus r 186→200 | ground: black @85% with 6 px feather, horizon line 1 px #1A2A1F @60%; shadow: black 75%→0 from r 200 inward to r 186 (occlusion: the sky is *under* the flange) | on | on (alpha-only black, free) |
| z3 | TIME PLATE | depth-of-field darkening behind the digits | none | ellipse centre (225,215) rx 150 ry 75, radial alpha 58% at centre → 0 at edge | black radial | alpha 255 | alpha 0 (digits are outlines; nothing to protect) |
| z4 | MINUTE RIM | an arc of rim light growing around the well's lip from 12 o'clock, resets each hour | **hour** (one turn per 60 min) | Arc r 197.5, 1.5 px, start 0, end = MINUTE*6 + SECOND*0.1 | #A6F46A @50% | on | off |
| z5 | FLANGE | raised brushed-alloy annulus with 60 minute ticks, 12 hour indexes, 24-h quadrant numerals 00 / 06 / 18 etched, meridian index at 12 (the only fixed reference: the vault turns under it, the sun crosses it at noon, the rim resets at it) | none (scale for z4/z8) | annulus r 200→225; minute ticks r 213→219 1 px; hour ticks r 211→221 1.6 px; meridian bar 2x12 px r 209→221; numerals 9 px at 6 o'clock "00", 3 o'clock "06", 9 o'clock "18" | top-lit brushed alloy #1B2A20 (top) → #070B09 (bottom), 1 px rim light #4C6A50 @70% on the upper-left half of r 200.5 fading to 20% lower-right; ticks #2F4A37, hour #5F7F62, numerals #3E5A46, meridian #A6F46A | flange_active.png | flange_ambient.png: 12 hour ticks #2E4436 + meridian #4F6E48 only |
| z6 | MOON | phased moon at its true elongation from the sun (east of the sun by phase angle; opposite at full) | **lunar month** (angle) + phase | disc r 5 at radius 178 from C, 8 phase bitmaps 12x12 | lit side #C9D8E4, dark side #141C18, 1 px limb #6B7A70; terminator baked | moon_0..7.png | 1 px ring #6B7A70 (same position, hollow) |
| z7 | SUN | gold sun pointer, culminates at true local mean noon (12:32 KST, equation of time optional) | **24-h solar day** (one CCW turn); its radial direction crosses the ecliptic on z1 at the sun's sign = **zodiac month** | disc r 4.5 at radius 190 from C; glow r 10 @25%; glow spills onto the flange rim = light from a higher plane onto a lower one | #E9B869 core, #FFE2A8 1 px upper-left highlight, glow #E9B869 | sun.png 24x24 | 1 px ring #8C6E3F (hollow), still moving |
| z8 | SECONDS | phosphor marker + trail orbiting the flange | **second** (one turn per 60 s) | dot r 3.2 at radius 207, 2 px glow; trail Arc r 207, 1.4 px, 0 → SECOND*6 | #A6F46A, trail @55% | on | off |
| z9 | DRAGON | official Kali press-pack path, unchanged, rendered as cast phosphor alloy with its own drop shadow onto the vault | none | frame (135,24) 180x123 as v4; bitmap canvas 190x133 at (131,21) to hold the shadow; it straddles the well rim (top of wings at r 201) like the engraved dragons of the JLC Dragon edition wrap over the dial levels | fill gradient #C8FF9A (top edges) → #A6F46A (mid) → #5C8F44 (underside), 1 px #D9FFB0 rim light upper-left, shadow black @60% offset (+2,+4) blur 3 | dragon_active.png | dragon_ambient.png: 1.2 px stroke #4F6E48 + 18% fill #1A2A1D, no shadow |
| z10 | INSCRIPTIONS | HH:MM, brand, date, astro readout, BATTERY/STEPS + gauges, prompt | civil hour / minute, day, live data | see section 2 | Roboto Mono; digits #EFF8EC with 1 px black @60% shadow offset (0,2) baked by a second TimeText beneath | on | outline digits, dim date/values/prompt |

Occlusion chain (what hides what): flange hides the vault's rim; well shadow darkens the vault's edge; the dragon's shadow falls on vault + plate + flange; the sun's glow falls on the flange; the digits' shadow falls on the plate. Every plane leaves a mark on the plane beneath it — that is what the eye reads as a stack.

## 2. Composition

| Element | Position (450 space) | Size / colour | Notes |
|---|---|---|---|
| Dragon | frame x135 y24 w180 h123 (unchanged) | alloy material above | top plane with the digits |
| Brand "KALI / VAULT" | centre x225, baseline y153 | 12 px, letter-spacing 3, #A6F46A | decoration; hidden in AOD |
| Date "25 OCT / SUN" | centre x225, baseline y181 | 17 px #9BAB9C | AOD #7F9472 |
| HH | x166 baseline y252 | Roboto Mono 78 / 600, #EFF8EC | **never moves or scales** |
| colon | x225 baseline y248 | #A6F46A | Polaris is behind it; it does not blink |
| MM | x284 baseline y252 | as HH | |
| Astro readout | centre x225, baseline y300 | 13 px #9BAB9C, e.g. `LST 11:50  SUN SCO  MOON 15D` | sits just below the horizon (y 286) — on the ground; replaces "SEC 24" |
| BATTERY / STEPS labels | x133 / x315, baseline y322 | 15 px #9BAB9C | Active only |
| values | x133 / x315, baseline y352 | 27 px #EFF8EC (battery <=15% → #E9B869) | AOD: same place, #6E8E63 |
| gauges | y366, x97–169 and x279–351, 2 px | track #17291D, fill #A6F46A | Active only; divider x225 y315–360 #34543C |
| Prompt | centre x225, baseline y388 | 13 px: `kali@vault:~$` #9BAB9C + `INFINITY` #A6F46A | AOD: same text, same place, #3E5A46 / #6E8E63 — nothing jumps on wake |

Safe radius for text: **r <= 176** (well lip at 196 minus 20 px breathing room). Checks: prompt at y388 → well half-chord 109 px, text 172 px wide fits (x139–311); readout at y300 → half-chord 181, text 218 px fits; BATTERY label at (133,322) is r 134.

Depth planes relative to the digits: the digits' box is x120–330, y190–262 (r <= 115). The flange (r >= 200), minute rim (197.5), sun (190), moon (178) and seconds (207) can never cross it. Only the vault's stars and the ecliptic hairline pass behind the digits, attenuated to 42% by the plate and further by the digit shadow. The horizon arc passes y258 at x120 — below the baseline — so the ground never touches the numerals. Readability in <1 s is preserved because the only thing under the digits is dim, slow, and darkened.

## 3. Palette

Identity stays **phosphor #A6F46A**: seconds, meridian index, minute rim, colon, INFINITY, gauges, dragon body, brand.

Three added controlled hues, nothing else:

| Hue | Hex | Role |
|---|---|---|
| Starlight | #C9D8E4 | every star, moon lit side, constellation lines (at low alpha) |
| Sun gold | #E9B869 | the sun pointer and its glow only; also the low-battery warning (replaces #F3C479); the four red giants Betelgeuse / Antares / Arcturus / Aldebaran at 80% |
| Vault teal | #16302C | the Milky Way / grisaille wash on the vault (and its darker tints #0A1512, #050A08) |

Everything else is a low-saturation tint of the phosphor hue carried from v4: paper #EFF8EC, quiet #9BAB9C, structure #34543C, track #17291D, alloy #1B2A20→#070B09, etched #2F4A37 / #3E5A46 / #5F7F62, AOD #11200F / #91AD80 / #4F6E48 / #7F9472 / #6E8E63 / #3A5044. Hue count in the saturated sense: phosphor + 3.

## 4. Motion

Curve everywhere: cubic-bezier(.22,1,.36,1) (WFF: `interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"`). No loops. Nothing at perceptible speed except the wake, the seconds step, and the hourly rim.

### 4.1 Signature wake, AOD → Active, 360 ms, back to front with counter-rotation parallax

The stack is "collapsed" in AOD: no shadows, no plate, outlines. On wake the light enters and the planes separate. The deepest plane settles counter-clockwise (the sky's own sense of motion); the front-most moving plane settles clockwise (the seconds' own sense). Opposite rotations at different depths = parallax, and the shadows being born = separation.

| t (ms) | Layer | Property | WFF Variant (fractions of the device window) |
|---|---|---|---|
| 0–360 | z1 VAULT | angle offset +4 → 0 deg (CCW arrival); vault_ambient alpha 255→0, vault_active 0→255 | inner Group `angle` Variant value 4, startOffset 0, duration 1.0; two PartImage alpha Variants |
| 0–300 | z2 GROUND/SHADOW | alpha 150 → 255 (the well deepens: "the flange rises") | alpha Variant value 150, duration 0.85 |
| 40–320 | z3 PLATE | alpha 0 → 255 | startOffset 0.1, duration 0.8 |
| 60–300 | z4 MINUTE RIM | alpha 0 → 255 (arc already at its live angle, no sweep) | startOffset 0.17, duration 0.66 |
| 80–320 | z6/z7 MOON, SUN | ring → body cross-fade, glow alpha 0 → 255 | startOffset 0.22, duration 0.67 |
| 100–360 | z8 SECONDS | angle offset -14 → 0 deg (CW arrival, the v4 signature), alpha 0 → 255 | inner Group angle Variant value -14, startOffset 0.28, duration 0.72 |
| 120–340 | z9 DRAGON | scaleX/Y 0.96 → 1.00 about its centre (pivot 0.5,0.5), ambient outline alpha 255→0, alloy+shadow 0→255 (the dragon lifts off the vault) | scaleX/scaleY Variant value 0.96, startOffset 0.33, duration 0.62 |
| 120–340 | z10 HH:MM | fill #11200F → #EFF8EC, stroke-opacity 1 → 0 | two DigitalClock groups alpha cross-fade, startOffset 0.33, duration 0.62 |
| 160–360 | z10 brand / readout / labels / gauges / prompt prefix | alpha 0 → 255; date & values tintColor shift | startOffset 0.45, duration 0.55 |

Reading order for the eye: the sky appears first (deep), then the well edge darkens, then the lights (sun, moon, seconds) ignite, then the dragon and the digits lift to the top, then the terminal types itself in. 360 ms total; the digits are legible from t=0 because the outline digits are already at their final position and size.

### 4.2 Slow real-time rotations (always on, both modes)

| Object | Direction | Period | Rate | Expression (WFF, degrees clockwise) |
|---|---|---|---|---|
| Vault disc | CCW | 23h 56m 04.1s | -15.041 deg/h (-0.2507 deg/min) | `(720 - LST) % 360`, LST per section 6 |
| Sun pointer | CCW | 24 h (mean solar, Seoul longitude corrected +0.535 h, optional equation of time) | -15 deg/h | `((12.535 - EOT/60 - [HOUR_0_23_MINUTE]) * 15 + 720) % 360` |
| Moon pointer | CCW, lagging the sun | synodic 29.53 d for one lap relative to the sun | sun + 12.19 deg per day of age | `(SUN_ANGLE + [MOON_PHASE_POSITION] * 12.19) % 360` |
| Minute rim | CW growth | 60 min | 6 deg/min | Arc endAngle `[MINUTE]*6 + [SECOND]*0.1` |

Physical check: at noon the sun pointer is at the meridian index and the vault shows RA = LST = RA_sun at 12 o'clock, so the pointer sits radially outside the ecliptic point of the real sun — the zodiac reading is exact by construction, not by a second ring. At first quarter the moon is 90 deg clockwise (east) of the sun and culminates at 18:00; at full moon it is opposite. Over ten minutes the Big Dipper visibly shifts 2.5 deg around the colon.

### 4.3 Every second

1. Seconds dot and trail step 6 deg with a 180 ms ease-out (WFF `Animation duration="0.18" interpolation="EASE_OUT" angleDirection="CLOCKWISE"`): an escapement tick, not a sweep, saving frames and matching the terminal's discrete character.
2. Minute rim end angle advances 0.1 deg (invisible per step, continuous over the hour).
3. Vault, sun and moon angles are re-evaluated (0.004 deg, 0.004 deg, 0 — invisible).
4. Nothing else: the colon is Polaris and does not blink; there is no cursor loop; the readout changes once a minute.

### 4.4 Active → AOD, 180 ms, front to back, no spatial motion

"It goes dark, it does not go away." 0–90 ms telemetry/labels/gauges/prefix out; 0–120 seconds + minute rim out; 40–140 sun/moon glow out, bodies → rings; 0–160 dragon alloy → outline (scale stays 1.00); 0–180 digits fill → outline, plate out; 60–180 vault_active → vault_ambient (no angle offset). WFF plays the same Variants in reverse with the same fractions; the studio uses the shorter asymmetric timing (risk R6).

### 4.5 Interruption and reversal

Studio: on any mode change mid-flight read computed opacity/angle/scale/colour of each node, cancel its running effect, retarget from the current value (v4 policy kept). A second-boundary never cancels a running wake; the seconds Transform simply takes over at the end. Watch: the WFF renderer owns reversal; nothing to specify beyond keeping every animated property on its own nested Group so a Variant and a live Transform never target the same attribute (section 6).

### 4.6 Reduced motion

Studio: OS `prefers-reduced-motion` OR manual toggle → instant final state, no offsets, no delays. Watch: `BooleanConfiguration id="wake_motion"` (default true); a `Condition` selects a mirror of the scene whose Variants carry `duration="0"`. The real-time rotations are not "motion" in this sense and stay on.

## 5. AOD

What remains (same face, dimmed, nothing moves between modes): vault_ambient (24 stars, rotating sidereally), horizon-free ground (black on black), flange_ambient (12 hour ticks + meridian), sun ring and moon ring (still orbiting daily), dragon outline + 18% fill, outline digits (#11200F / #91AD80 1.4 px, v4 style), date #7F9472, battery and steps values #6E8E63 in place, prompt line in place at #3E5A46 / #6E8E63.

Lit estimate (450 disc = 159,043 px): outline digits incl. dark fill ≈ 5,500 px²; dragon fill+stroke ≈ 8,100; date/values/prompt ink ≈ 1,900; ticks + meridian ≈ 220; stars 54; sun/moon rings 60. Non-zero pixels ≈ 15,800 → **9.9%** (v4 method). Luminance-weighted per WO-P7 (mean RGB/255): digits 0.084 fill / 0.58 stroke, dragon 0.14 / 0.34, text 0.38–0.51, stars 0.26 → **≈ 2.6%**. Both under 15% with margin for Samsung's AOD brightness boost; the brightest AOD pixel is #91AD80 (58%) — no white, no phosphor at full.

Burn-in: no static element above 58% luminance; the only large filled area (dragon) sits at 14%; static strokes <= 1.5 px; the 24 stars drift 0.25 deg/min and the two rings 0.25 deg/min so every lit pixel outside the text migrates continuously; the system's periodic AOD pixel shift (if the device applies it) is additive, not relied upon. One update per minute in AOD (rotations are sub-pixel per minute, so no visible stepping).

## 6. WFF v4 mapping

Scene `backgroundColor="#ff000000"`, `clipShape="CIRCLE"`, width/height 450. Fonts: roboto_mono (already bundled). All bitmaps ARGB PNG: vault_active 400x400 (640 KB), vault_ambient 400x400, ground_shadow 450x450, time_plate 300x150, flange_active 450x450, flange_ambient 450x450, dragon_active 190x133, dragon_ambient 190x133, sun 24x24, sun_ring 24x24, moon_0..7 12x12, moon_ring 12x12. Total ≈ 3.2 MB, under WO-P8 (10 MB ambient / 100 MB interactive).

Shared expressions (small-number formulation; avoids float32 loss on UTC_TIMESTAMP):

```
DINT  = 365*([YEAR]-2000) + floor(([YEAR]-1997)/4) + [DAY_OF_YEAR] - 1
DFRAC = ([HOUR_0_23_MINUTE] + [SECOND]/3600 - [TIMEZONE_OFFSET_MINUTES_DST]/60)/24 - 0.5
GMST  = (280.46061837 + 0.98564736629*DINT + 360.98564736629*DFRAC) % 360
LST   = (GMST + 126.978) % 360                       // Seoul
VAULT_ANGLE = (720 - LST) % 360                      // RA = LST at 12 o'clock, CCW with time
B     = rad((360/365)*([DAY_OF_YEAR]-81))
EOT   = 9.87*sin(2*B) - 7.53*cos(B) - 1.5*sin(B)     // minutes, optional
SUN_ANGLE  = ((12.535 - EOT/60 - [HOUR_0_23_MINUTE])*15 + 720) % 360
MOON_ANGLE = (SUN_ANGLE + [MOON_PHASE_POSITION]*12.19) % 360
LAMBDA = (([DAY_OF_YEAR]-80)*0.9856 + 1.915*sin(rad(([DAY_OF_YEAR]-3)*0.9856)) + 720) % 360
SIGN   = subText("ARITAUGEMCANLEOVIRLIBSCOSAGCAPAQUPIS", floor(LAMBDA/30)*3, 3)
```

| z | Element | WFF construction |
|---|---|---|
| z1 | VAULT | `Group` (pivot 0.5,0.5) with `Transform target="angle" value="VAULT_ANGLE"` → inner `Group` with `Variant mode="AMBIENT" target="angle" value="4" duration="1.0" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"` → two `PartImage` 400x400 at (25,25): vault_active (`Variant alpha 0`), vault_ambient (`alpha="0"`, `Variant alpha 255`). Rotation and wake offset compose because they sit on different Groups. |
| z2 | GROUND/SHADOW | one static `PartImage` 450x450 (alpha-only PNG); `Variant target="alpha" value="150"`. |
| z3 | PLATE | `PartImage` 300x150 at (75,140), `Variant alpha 0 startOffset 0.1 duration 0.8`; alternative `PartDraw Ellipse` with `Fill` + `RadialGradient` if the validator accepts it. |
| z4 | MINUTE RIM | `PartDraw` 450x450 → `Arc centerX=225 centerY=225 width=395 height=395 startAngle=0 endAngle=0` with `Transform target="endAngle" value="[MINUTE]*6+[SECOND]*0.1"`, `Stroke color="#80A6F46A" thickness="1.5" cap="ROUND"`; `Variant alpha 0`. |
| z5 | FLANGE | two static `PartImage` 450x450 (active/ambient) cross-faded by alpha Variants. Ticks, numerals and meridian are baked (no 60 PartDraw lines). |
| z6 | MOON | `Group` 450x450 pivot centre, `Transform angle = MOON_ANGLE` → `Condition` on `[MOON_PHASE_TYPE]` (0..7) → `PartImage` 12x12 at (219,42) per phase (`Variant alpha 0`) + moon_ring `PartImage` (`alpha 0`, `Variant alpha 255`). |
| z7 | SUN | `Group` pivot centre, `Transform angle = SUN_ANGLE` → sun `PartImage` 24x24 at (213,23) with glow baked (`Variant alpha 0`), sun_ring (`Variant alpha 255`). |
| z8 | SECONDS | outer `Group` `Transform angle="[SECOND]*6"` + `Animation duration="0.18" interpolation="EASE_OUT" angleDirection="CLOCKWISE"` → inner `Group` `Variant angle -14 startOffset 0.28 duration 0.72` → `PartDraw` dot (`Ellipse` 6.4 px at (221.8,14.8) + glow ellipse @40%). Trail: `PartDraw Arc r207 width=414 height=414` `Transform endAngle="[SECOND]*6"` with the same Animation, `Stroke #8CA6F46A 1.4`. Both `Variant alpha 0`. |
| z9 | DRAGON | `Group` 190x133 at (131,21) pivot 0.5,0.5 with `Variant scaleX 0.96`, `Variant scaleY 0.96` (startOffset 0.33, duration 0.62) → `PartImage` dragon_active (`Variant alpha 0`) + dragon_ambient (`alpha 0`, `Variant alpha 255`). Official path rasterised unchanged; provenance file kept. |
| z10 | HH:MM | interactive `Group`: `DigitalClock` with `TimeText format="hh:mm" hourFormat="24"` size 78 weight 600 `#ffEFF8EC` (and a second TimeText 2 px lower in `#99000000` for the shadow); `Variant alpha 0`. Ambient `Group` (`alpha 0`, `Variant alpha 255`): outline digits — WFF Font has no stroke, so either Roboto Mono Light 300 in `#ff91AD80`, or 10 pre-rendered outline glyph PNGs selected by `Condition` on `[HOUR_TENS_DIGIT]`, `[HOUR_UNITS_DIGIT]`, `[MINUTE_TENS_DIGIT]`, `[MINUTE_UNITS_DIGIT]` (fidelity option). |
| z10 | date / brand / labels / values / prompt | `PartText` with `Template` + `Parameter` (`[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]`, `[BATTERY_PERCENT]`, `[STEP_COUNT]` via `numberFormat("#,###", …)`); low battery colour via `Condition [BATTERY_PERCENT] <= 15`. Dim AOD colours via `Variant target="tintColor"` (v4) on the Group. Gauges: `PartDraw Rectangle` width `Transform` `72*[BATTERY_PERCENT]/100`, `72*clamp([STEP_COUNT]/10000,0,1)`. |
| z10 | astro readout | `PartText` Template `LST %s:%s  SUN %s  MOON %sD` with `numberFormat("00", floor(LST/15))`, `numberFormat("00", floor((LST % 15)*4))`, `SIGN`, `[MOON_PHASE_POSITION]`. |
| — | reduced motion | `BooleanConfiguration id="wake_motion"` + `Condition` wrapping two copies of the scene tree (animated / `duration="0"`); or a `ListConfiguration` later. |

## 7. Risks

- R1 Flatness at 40 mm: if the well shadow (75% at the rim), the dragon shadow (+2,+4) and the plate are tuned too subtle, the stack collapses back to a print. Mitigation: verify on the 480 px panel at arm's length; shadows are baked, so retuning is a PNG swap.
- R2 Rotating 1 px stars shimmer under bilinear rotation of a 400 px bitmap. Mitigation: no star under 1.2 px core with a 0.5 px soft edge; test aliasing on device; fallback: 16 brightest stars as separate `PartDraw` ellipses on the rotating Group.
- R3 Expression engine: float precision and `%` semantics on floats unverified; the DINT/DFRAC split keeps every term < 10^4. Verify `sin`/`rad`/`subText`/`numberFormat` with the official validator before committing to the readout.
- R4 Variant vs live Transform on the same attribute is undefined — hence the nested-Group rule; a validator may still reject `angle` Variants on a Group that also carries a Transform in a parent; fallback is to drop the ±4/-14 deg parallax and keep the alpha/scale reveal.
- R5 Outline digits: no text stroke in WFF; the Light-weight fallback changes the stroke feel the user approved in v4.
- R6 Transition duration is device-defined (fractions, not ms); the 360/180 asymmetry cannot be guaranteed and Active→AOD will mirror the wake timing on the watch.
- R7 `[MOON_PHASE_POSITION]` is an integer day: the moon pointer jumps 12 deg once per day at the phase-day change; the phase bitmap also steps. Acceptable for a 10 px moon; documented.
- R8 Seoul-only horizon and longitude; travelling breaks the ground lens and solar noon. Later: `ListConfiguration` with 3 cities (3 ground PNGs, 3 longitude constants).
- R9 Zodiac boundary dates ±1 day from the mean-sun approximation; equation of time ±16 min handled, apparent-vs-mean sidereal (nutation, <1 s) ignored.
- R10 AOD luminance and memory must be measured with the WFF tooling, not estimated; Samsung AOD brightness scaling may push the dragon fill; keep a one-line kill switch (dragon_ambient without fill).
- R11 Trademark: Kali dragon is OffSec's mark; this remains a personal face, provenance note kept.

## 8. Why it is not flat

v4 was one plane with a picture on it; nothing in it was *under* anything else, and nothing moved except the seconds. v5 is built the way Galaxia is built: as a well. The sky is physically the deepest thing on the face, and you can tell because the flange casts a shadow onto it, the dragon casts a shadow onto it, and the digits float over a dark plate above it. It is also *alive* at every time-scale a watch can carry: the sky turns 15 degrees an hour around Polaris (which is behind the colon), a gold sun circles the rim once a day and crosses the meridian mark at Seoul's real noon, a phased moon trails it by exactly its age, a rim of light grows around the well every hour, and a phosphor second ticks around the outside. When you wake it, the planes separate in order — sky, well, lights, dragon, digits, terminal — with the deepest plane settling counter-clockwise and the front one clockwise, so for 360 ms you see parallax, and then the shadows stay to remind you of the depth. And it is still KALI: the official dragon mounted over the rim, phosphor on everything that moves, and a terminal prompt written on the black ground below the horizon.

## 9. ASCII layer diagram

```
                 12 o'clock = meridian index (fixed)            r
  ┌──────────────────────────────────────────────────────────┐
  │ z8  SECONDS  ●──▶  phosphor dot + trail on the flange    │ 207
  │ z5  FLANGE   ▓▓▓▓  brushed alloy, 60 ticks, 00/06/18      │ 200–225
  │ z4  MINUTE RIM ───  phosphor arc on the well lip          │ 197.5
  │       ╭────────────────── well edge ──────────────────╮   │ 196
  │ z7    │ SUN ☼ (gold, 24 h, CCW)                       │   │ 190
  │ z6    │ MOON ☾ (phase, sun + age*12.19°)              │   │ 178
  │ z9    │        ╔═══════ DRAGON (alloy + shadow) ═════╗ │   │ 24–147 (y)
  │       │        ║  KALI / VAULT   25 OCT / SUN        ║ │   │
  │ z10   │        ║        1 0 : 0 8   ◀ Polaris behind ║ │   │ y252 base
  │ z3    │        ║  [plate: dark radial 58% → 0]       ║ │   │ rx150 ry75
  │       │        ╚═════════════════════════════════════╝ │   │
  │ z1    │   VAULT  ·  ✦  ·  ·  ✧ ·   sidereal, CCW,     │   │ 0–196
  │       │   stars, lines, Milky Way, ecliptic + zodiac   │   │
  │ z2    │ ~~~~~~~~~~ horizon (Seoul 37.57 N) ~~~~~~~~~~  │   │ y286 @ x225
  │       │   GROUND: LST 11:50  SUN SCO  MOON 15D         │   │ y300
  │       │   BATTERY 78%            STEPS 6,240           │   │ y322/352/366
  │       │   kali@vault:~$ INFINITY                        │   │ y388
  │       ╰───────────────────────────────────────────────╯   │
  │ z0  VOID                                                   │
  └──────────────────────────────────────────────────────────┘
  height ↑ : z0 < z1 < z2 < z3 < z4 < z5 < z6 < z7 < z8 < z9 < z10
  shadows ↓ : flange→vault, dragon→vault/plate/flange, digits→plate, sun glow→flange
```

## Appendix A — sample state, 2026-10-25 10:08:24 KST (Seoul)

DINT 9794, DFRAC -0.4528 → GMST 50.4°, LST 177.4° (11h50m) → VAULT_ANGLE 182.6° (Cassiopeia low NE, Dipper high NW at this hour of a late-October morning; Orion already set in the west). EOT +16 min → solar noon 12:16 KST → SUN_ANGLE ≈ 32° (sun east of the meridian, upper right). Moon age ≈ 15 d → MOON_ANGLE ≈ 215° (opposite the sun, below the horizon: ring shown on the ground side). Sign: SCO. Minute rim: 48.4°. Seconds: 144°.

## Appendix B — assets to bake (studio exports)

vault_active.png, vault_ambient.png (400x400, pivot C, RA 0h up, 1.6333 px/deg, Hipparcos V<=4.0 dec>=-30, J2000); ground_shadow.png; time_plate.png; flange_active.png; flange_ambient.png; dragon_active.png, dragon_ambient.png (official path, PROVENANCE.md kept); sun.png, sun_ring.png; moon_0..7.png, moon_ring.png. Plus `design-tokens.json` v5 with the palette and the expressions above as strings for the port.
