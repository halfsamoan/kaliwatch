# KALIWATCH v5 "Celestial Vault" — proposal 01 (legibility / AOD / burn-in lens)

Reviewer stance: the face is designed from the constraints outward. HH:MM must be read in under one second on a 40 mm disc, every text box stays inside the safe radius, the AOD keeps the depth idea on a lit budget well under 15 percent, and nothing bright sits still. Only then is Galaxia richness layered in, as *physical levels that each carry a different real time-scale* — which is exactly what makes the JLC dial feel high-dimensional, and what v4 lacked (one black disc, one ring, one decorative planet, no time information outside the digits).

Design space 450 x 450, centre C = (225, 225), dial radius 225, target Galaxy Watch6 Classic 480 x 480 (scale 1.0667). All coordinates below are in the 450 space; angles are clockwise from 12 o'clock unless stated.

---

## 0. The one idea that fixes "one-dimensional"

v4 is a print: everything sits on the same plane and only the seconds move. v5 is a **stack of four physical levels with mutual occlusion and one consistent light** (upper-left, 10:30, 35 deg elevation), and **every level is driven by a different real clock**:

| Level (height) | What it is | Clock that drives it |
|---|---|---|
| -1 deep well | Black floor with white inscriptions (battery, steps, prompt), seen through a window cut in the sky plane | none (telemetry) |
| 0 sky plane | Real Seoul night sky, polar-stereographic planisphere whose horizon is the dial edge; rotates about the north celestial pole | sidereal day, 23 h 56 m 04 s |
| +1 bridge | Raised dark-enamel bridge across the sky carrying the date and the fixed HH:MM, casting a shadow on the sky | civil hour:minute, calendar day |
| +2 flange ring | Chamfered ring with 60 ticks, the phosphor seconds trail, and on its outer lip a gold sun and a grey moon | seconds; 24 h solar; lunar phase |
| +2 dragon | Official Kali dragon embossed over the pole; circumpolar stars wheel *through* its coils | none (identity) |

The north celestial pole of the sky lands at (225, 47): under the dragon. That is not an accident of the projection — it is the concept: **the dragon sits on the pole and the sky turns around it**, like the JLC Dragon edition wrapped around the Cosmotourbillon.

---

## 1. Layer stack, back to front

z-order is paint order (0 = first). "Bounds" are in the 450 space.

### z0 — Void
- Shows: pure black `#000000` disc. Scene background.
- Time-scale: none. Active = AOD.

### z1 — Vault (rotating sky)
- Shows: the real northern sky as seen from Seoul 37.57 N / 126.98 E, Yale-BSC stars to mag 2.5 (plus mag 2.5–3.3 members of the 12 asterisms below), constellation lines, a faint Milky Way band and a dashed ecliptic with 12 zodiac ticks, all baked into one PNG.
- Projection: polar stereographic, scale `r(dec) = 137.2 * tan((90 - dec)/2)` px from the pole. This makes the horizon a circle, and with the Seoul latitude that horizon circle has radius 225 and centre 178.3 px south of the pole — i.e. **the dial edge is the horizon** and the pole is at P = (225, 47). Zenith at (225, 115). Celestial equator = circle r 137 about P (its meridian point (225, 184) is under the bridge). Ecliptic = circle radius 150 centred 60 px from P toward RA 18 h.
- Bounds: PNG 588 x 588 (chart radius 294 px = declination -40, the altitude < 12 deg band below that is swallowed by the haze anyway), placed at x -69, y -247 so its centre is P. Rotation pivot P.
- Driver: local sidereal time. Screen angle (clockwise) = `-LST`. The chart is drawn with RA increasing clockwise from the downward (meridian) direction, so the star with RA = LST is on the meridian below the pole and stars move counter-clockwise (rise on the left/east, culminate at the bottom/south, set on the right/west). One turn per 23 h 56 m 04 s = 0.2507 deg/min.
- Material: base `#000000`; stars mag <= 1: 2.4 px core `#FFFFFF` with 5 px halo `#8CA6B5` 30 percent; mag 1–2: 1.6 px `#C9D6DA`; mag 2–2.5: 1.1 px `#8CA6B5` 80 percent; fainter asterism members 0.8 px 50 percent. Constellation lines 0.8 px `#8CA6B5` 22 percent. Milky Way 40 px-blurred band `#1C2A26` 25 percent. Ecliptic 0.7 px dashed `#E0B35A` 18 percent, zodiac ticks 3 px.
- Active: full PNG, alpha 255; alpha 150 while the sun is above the horizon (daytime), so daylight quietens the sky.
- AOD: separate sparse PNG, 24 brightest stars only, 1.2 px `#6E8187`, no lines, no band; same rotation (re-evaluated once per minute).

### z2 — Haze (grisaille vignette, fixed)
- Shows: the chiaroscuro of the enamel. A fixed PNG 450 x 450: a soft teal glow centred on the zenith (225, 115) (`#14262B` at 40 percent fading to 0 by altitude 55 deg) and an extinction darkening toward the horizon (`#000000` 0 percent at altitude 25 deg rising to 70 percent at the dial edge). Because it is tied to altitude, not to the stars, it stays fixed while the vault turns beneath it — the physically correct behaviour and the cheapest possible one.
- Time-scale: none. Active only; AOD alpha 0.

### z3 — Well cut-out (deep level -1)
- Shows: the window in the sky plane. Shape = circular segment y >= 296 inside r 176, further limited to the sector within +/- 60 deg of 6 o'clock. Fill `#000000`. Its cut edge carries a 1 px bevel `#22343A` 55 percent (the thickness of the sky plane catching the light) along the chord and the two radial edges.
- Bounds: chord x 61..389 at y 296, radial edges reach the ring at (73, 313) and (377, 313).
- Time-scale: none. Active: fill + bevel. AOD: fill only (bevel alpha 0).

### z4 — Well inscriptions (telemetry)
- Shows: BATTERY / STEPS labels, values, gauge bars, divider, prompt. White on black, the JLC "transferred inscriptions on the deepest level".
- Positions: labels 15 px `#9BAB9C` baseline y 318 centred x 140 and x 310; values 26 px `#EFF8EC` baseline y 349 at the same centres (battery turns `#F3C479` at <= 15 percent); gauge tracks y 363, left x 120..172 and right x 278..330, 2 px `#17291D`, fill `#A6F46A` (battery, and steps capped at 10 000); divider x 225, y 311..355, 1 px `#34543C`; prompt `kali@orbit:~$ INFINITY` 11 px baseline y 378 (INFINITY in phosphor). Everything inside r 171 except the gauge ends (r 173, instrument not text).
- Time-scale: none. Active only. AOD replacement: `BAT 78%` 17 px `#7F9472` baseline y 335 with the two 18 px side dashes, and `INFINITY` 11 px letter-spaced at y 372.

### z5 — Bridge (level +1)
- Shows: a raised plate across the dial. Rect x 44..406, y 172..278 (h 106), ends run under the flange ring (which starts at r 176), so the bridge visibly *goes under* the ring: an occlusion cue in both directions (bridge over sky, ring over bridge).
- Material: fill fired-enamel glass `#070B09` at 94 percent over the sky in the margins and 100 percent opaque in the digit core x 110..340 (no star noise behind numerals); 1 px top highlight `#2F4A2A`; 1 px bottom edge `#000000`; drop shadow baked into the PNG: offset (+2, +4), 10 px blur, black 65 percent, falling on the 18 px sky strip (y 278..296) and the two lower sky flanks. PNG 362 x 128 at (44, 166).
- Time-scale: none itself (it carries z6).
- Active: full PNG. AOD: swap to a PNG with `#000000` fill, rim `#1F2E1C`, no shadow.

### z6 — Bridge inscriptions (date + HH:MM + seconds readout)
- Date `25 OCT / SUN` 15 px `#9BAB9C` letter-spacing 1.5, centred x 225, baseline y 191 (engraved on the bridge above the digits).
- HH:MM unchanged from v4: Roboto Mono 78 px weight 600, `#EFF8EC`, hour centred x 166, minute x 284, baseline y 252; colon `#A6F46A` at x 225 baseline y 248. Digit box x 119..331, y 196..252; farthest corner r 110. Contrast 17:1 on the opaque core.
- `SEC 24` 13 px `#5E7D52` centred x 225 baseline y 272. Active only.
- Time-scale: civil hour, minute, second; calendar day.
- AOD: date `#7F9472`; digits as outline glyphs (fill `#11200F`, stroke 1.4 `#91AD80`) at identical positions; SEC hidden.

### z7 — Flange ring (level +2)
- Shows: annulus r 176..211, chamfered: body gradient `#101C14` at r 176 to `#07100B` at r 211; inner rim 1 px at r 176.5 whose brightness follows the light (`#4A6A45` at 10:30, `#16241A` at 4:30); orbit track r 192 1 px `#17291D`; 60 ticks r 202/207..211 (quarter-hour ticks 1.6 px `#526650`, others 1 px `#34543C`); 24 solar marks r 216..219 every 15 deg, 1 px `#34543C` 55 percent. All baked in one PNG 450 x 450 with transparent centre.
- Time-scale: none (scale for z8/z9).
- Active: full PNG; the whole ring group carries the signature wake rotation (-14 deg to 0).
- AOD: swap to the v4 sleeping ring: 4 segmented arcs r 192 (48 deg each from 12, 102, 192, 282 deg) 1.25 px `#4D633F` and 12 ticks `#7F9472`.

### z8 — Seconds probe
- Shows: phosphor trail arc r 192, width 1.7, `#A6F46A` 72 percent from 12 o'clock to 6 * second; marker dot radius 3.3 at r 192 plus a 5 px radial tick to r 202.
- Time-scale: seconds, stepped at 1 Hz (no smooth sweep: battery).
- Active only; AOD alpha 0.

### z9 — Solar lip (24 h sun + moon)
- Sun: gold disc radius 4.5 with baked 3 px glow, riding r 217.5; angle = `15 * HOUR_0_23_MINUTE + 180` (midnight at 6, noon at 12). Day arc on the same radius, 3 px `#E0B35A` 35 percent, from sunrise to sunset: centre angle 7.95 deg (Seoul solar noon 12:32 KST), half-span `15 * (6.08 + 1.30 * cos((DOY - 172) * 0.9856 deg))` deg — gives 14 h 46 m on 21 Jun, 9 h 34 m on 21 Dec, 10 h 42 m on 25 Oct. The sun on the lit arc = day; on the dark lip = night. This is the Galaxia sun pointer with the 24 h ring it rides.
- Moon: 18 x 18 phase sprite at r 215, angle = sun angle `- 12.19 * MOON_PHASE_POSITION` (full moon opposite the sun, first quarter culminating at sunset). Lit side `#8CA6B5`, dark side `#1A2326`, rim 0.8 px `#4A5A5E`.
- Time-scale: 24 h solar (one turn a day) and lunar (29.53 d).
- Active: all. AOD: day arc and marks hidden; sun dimmed to `#7A6336`, moon ambient sprite at 60 percent. Both move once per minute, which is the AOD's own slow drift.

### z10 — Dragon (level +2, identity)
- Shows: the official Kali dragon path, unchanged, rasterised with a baked emboss: 1.5 px shadow `#000000` 70 percent offset (0, 2) and 6 px phosphor glow 25 percent. Frame 150 x 112 at (150, 14) — centre (225, 70), 8 px clear of the dial edge at its top corners. The pole (225, 47) is inside the frame, so Cassiopeia, the Dipper and Polaris wheel behind the coils and show through the dragon's negative space.
- Time-scale: none. Active: phosphor PNG 96 percent. AOD: flat `#3E5A38` PNG at 85 percent, no glow.

### z11 — Drift (burn-in carrier, wraps z3..z10)
- A group translated by `x = round(2 cos(6 deg * MINUTE))`, `y = round(2 sin(6 deg * MINUTE))`: a 2 px circle walked once an hour, never more than 1 px per step. Invisible in Active, keeps every static AOD line moving.

### Optional z1b — Sun on the ecliptic (stage 2, only after the vault is proven on the watch)
A 10 px gold sprite nested inside the rotating vault group at the sun's real ecliptic longitude `L = (DOY - 80) * 0.9856 deg`: declination `asin(sin 23.44 deg * sin L)`, right ascension `atan(tan L * cos 23.44 deg)` with the quadrant fixed by `cos L < 0`. It is visible only while above the horizon, i.e. only by day, and disappears below the dial edge at sunset. Real, cheap in pixels, but adds a moving object behind the bridge; held back for legibility until the base stack is verified.

---

## 2. Composition

```
                 y=0 ________ dial edge = horizon ________
           ring r211 /  NW sky        .  *  .      NE sky  \
                    |     . ___________ P(225,47)_________  |   P = north celestial pole,
                    |    * |  official dragon 150x112     | *|       under the dragon's coils
                    |      |  frame (150,14)-(300,126)    |  |
                    |   .  |__________________*___________|  |
            zenith  |  *   zenith (225,115)  . sky band y126-172 . * |
      y=172  ______ |________________________________________________|___ bridge top (+1)
                    |  25 OCT / SUN          15px  y191                  |
                    |  [1][0] : [0][8]        78px  baseline y252         |  digits x119..331
                    |            SEC 24       13px  y272                  |
      y=278  ______ |________________________________________________|___ bridge bottom + shadow
                    |   SW sky . sky strip y278-296 . bevel y296 . SE sky |
                    |     .   __________________________________   .      |
                    |        /  BATTERY 15px   |   STEPS         \        |  well (-1), sector +/-60 deg
                    |       |   78%  26px y349 |   6,240          |       |
                    |       |   =====   y363   |   =====          |       |
                    |        \   kali@orbit:~$ INFINITY 11px y378 /       |
                    |         \______________________________________/    |
                     \   flange ring r176-211: 60 ticks, seconds trail  /
                      \  solar lip r211-225: 24 marks, day arc, sun, moon/
                       ------------------------------------------------
```

Section through the stack (the eye reads this, not the plan):

```
 light 10:30 ->     dragon(+2)          ring(+2)
                  ====/\\====      ================
   bridge (+1)   ===================================  <- shadow falls on sky
   sky (0)   . * . * . . * . . * . * . . * . * . . *   <- rotates about P
   well (-1)              |___ inscriptions ___|     <- hole in the sky plane
```

- Fixed-information positions (never move, never scale): HH:MM as above; date y 191; battery/steps columns x 140 / 310; prompt y 378. All text boxes inside **safe text radius 171**; the ring zone r 176–225 holds instruments only.
- Depth planes relative to the digits: the vault and haze are *behind* the opaque bridge core, so no star ever touches a numeral; the shadow, the sky strip and the well bevel are *below* the digits (y 278–296); the ring overlaps the bridge *ends* only (x < 57 and x > 393), far outside the digit box.
- Sky windows: the top cap (around the dragon, NE/NW rising and setting stars, the zenith band y 126–172), and the two lower flanks (SE/SW) between the bridge ends and the well sector. Orion's belt at culmination sits under the bridge; it is seen rising in the SE flank and setting in the SW flank, which is more alive than a static atlas anyway.
- Dragon at (150, 14)–(300, 126): large enough to keep the v4 presence (13 mm on the wrist), small enough that stars pass under its coils and the top corners clear the edge.

Device mapping: multiply all coordinates by 1.0667 for 480 px; 1 px design = 1.07 device px, so every stroke is >= 1.2 px in the design (the 0.8 px constellation lines are decoration and may vanish; accepted).

---

## 3. Palette

Identity and existing tokens stay: phosphor `#A6F46A` (colon, seconds, gauges, dragon, INFINITY), paper `#EFF8EC` (digits, values), secondary `#9BAB9C`, structure `#34543C`, track `#17291D`, warning `#F3C479`, AOD set `#11200F / #91AD80 / #718D61 / #7F9472`.

Three controlled additions, no more:

| Hue | Hex | Role | Pixel budget |
|---|---|---|---|
| Sun gold | `#E0B35A` | the 24 h sun, its day arc, ecliptic dashes and zodiac ticks baked at 18 percent | < 1 percent of the dial; the only warm note, so it reads as *the* bright slow object |
| Grisaille | `#8CA6B5` (existing starlight token, re-scoped) | stars, constellation lines, moon lit side, bevel of the sky plane | star field only |
| Fired enamel | `#0E1A1F` | dark base of the haze, shadow side of the ring chamfer, bridge glass tint | large areas, luminance ~2 percent — free on OLED |

Rule: gold never appears on text or UI; grisaille never on text; phosphor is never used for sky material. That keeps the three hierarchies (information = paper/phosphor, instrument = green structure, sky = grey/teal/gold) separable at a glance.

---

## 4. Motion

Easing everywhere `cubic-bezier(0.22, 1, 0.36, 1)`. No loops, no twinkle, no per-second animation except the 1 Hz step of the seconds probe.

### Wake, AOD -> Active, 360 ms, deepest layer first

| t (ms) | Layer | Property |
|---|---|---|
| 0–140 | z1 vault | sparse PNG alpha 255->0, full PNG alpha 0->255 (crossfade); daytime dimming applied at the end |
| 0–160 | z2 haze | alpha 0->255 |
| 40–220 | z3 well | bevel alpha 0->255 |
| 80–300 | z4 telemetry | alpha 0->255 (v4's 80 ms delay kept) |
| 60–260 | z5 bridge | PNG crossfade black->glass, shadow rises with it |
| 80–300 | z6 digits | fill-opacity 0->1 and stroke-opacity 1->0 in place; date colour `#7F9472`->`#9BAB9C` |
| 100–360 | z7 ring | group angle -14 deg -> 0 (the v4 signature), sleeping-ring PNG alpha 255->0, full ring 0->255 |
| 180–360 | z8 seconds | trail and marker alpha 0->255 |
| 120–320 | z9 solar lip | day arc 0->255, sun `#7A6336`->`#E0B35A` |
| 140–360 | z10 dragon | ambient PNG -> embossed PNG crossfade |

Reads as: the sky appears, the well lights, the bridge lifts and its shadow lands, the ring locks into place, the dragon ignites last. Nothing in the digit box moves or scales.

### Sleep, Active -> AOD, 180 ms, top layer first
Reverse order: dragon dims (0–120), seconds vanish (0–80), ring crossfades to the segmented arcs (20–180, no rotation), bridge shadow and haze fade (40–180), digits go to outline (40–180), telemetry out (0–100), sparse vault crossfades in (60–180).

### Continuous real-time motion (allowed: all slower than perceptible)
- Vault: 0.2507 deg/min counter-clockwise about P (1 px/min at r 230).
- Sun: 15 deg/h clockwise on the lip. Moon: 14.49 deg/h clockwise.
- Day arc: changes once per day.
- Drift group: 1 px per minute.
- Each second (Active only): trail endAngle += 6 deg, marker angle += 6 deg, SEC text.
- Each minute: digits, sun, moon, vault angle, drift.

### Reduced motion
Wake and sleep are instant (final state, no delays). The astronomical rotations are not animation and stay, because they are state, not motion.

---

## 5. AOD

What remains (same face, quiet):
- Sparse vault (24 stars), still rotating once per minute.
- Dragon flat `#3E5A38` 85 percent, no glow.
- Bridge black with rim `#1F2E1C`; date `#7F9472`; outline digits (fill `#11200F`, stroke 1.4 `#91AD80`).
- Sleeping ring: 4 segmented arcs + 12 ticks.
- Sun `#7A6336`, moon ambient sprite.
- Well: black, `BAT 78%` at y 335, `INFINITY` at y 372.

Lit-pixel estimate (dial area pi * 225^2 = 159 043 px^2; counting every non-black pixel, the strict reading):

| Element | px^2 |
|---|---|
| Dragon 150 x 112 frame, ~35 percent inked | 5 900 |
| Outline digits (4 glyphs, ~300 px perimeter each x 1.4) + colon | 1 700 |
| Sleeping ring arcs + 12 ticks | 950 |
| Bridge rim perimeter 2 x (362 + 106) x 1 px | 940 |
| Date 12 glyphs x 15 x 11 x 0.25 | 500 |
| BAT 78 percent + dashes | 330 |
| INFINITY | 200 |
| Moon sprite + sun disc | 300 |
| Sparse stars 24 x 4 | 100 |
| **Total** | **~10 900 = 6.9 percent** |

Anti-aliasing fringes on the Watch6's 1.07x upscale add roughly a third: expect 8–9 percent measured the way v4 was measured (v4: 11.3 percent). The largest single contributor is the dragon; if the on-device meter disagrees, the dragon alpha drops to 70 percent before anything else is touched.

Burn-in strategy:
1. Nothing above 42 percent luminance is static in AOD (the digit stroke `#91AD80` is the ceiling); thin rims are held at `#1F2E1C` (12 percent).
2. The drift group walks a 2 px circle once per hour, so every static edge moves at least 1 px per minute; the vault, sun and moon add their own real motion.
3. The dragon and digits already change position by the drift; the OS-level ambient shift (if the runtime applies one) stacks on top harmlessly.
4. The AOD never shows the seconds, the gauges, the haze or the shadow: no high-contrast curves sit on one spot for hours.

---

## 6. WFF v4 mapping (per layer)

Format notes verified against the reference: data sources `[DAY_OF_YEAR]` 1–366, `[HOUR_0_23_MINUTE]` float, `[MINUTE]`, `[SECOND]`, `[SECOND_Z]`, `[UTC_TIMESTAMP]` ms, `[SECONDS_SINCE_EPOCH]` (v3), `[MOON_PHASE_POSITION]` 0–28 days, `[MOON_PHASE_TYPE]` 0–7, `[BATTERY_PERCENT]`, `[STEP_COUNT]`, `[DAY_Z]`, `[MONTH]`, `[DAY_OF_WEEK]`; functions `sin cos tan asin atan rad deg clamp round floor numberFormat`; `Variant mode="AMBIENT"` with `duration`/`startOffset` as 0–1 fractions of the device transition, `interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1"`, `angleDirection`. Ambient re-renders once per minute, so every ambient-visible expression must only use minute-or-slower sources.

- **z0** `<Scene backgroundColor="#ff000000">`.
- **z1 vault**: `Group vault x=-69 y=-247 width=588 height=588` containing `PartImage vault_active.png` (588 x 588, indexed PNG ~120 KB, ~1.4 MB RGBA in memory) with pivot 0.5/0.5 and
  `<Transform target="angle" value="-((227.64 + 0.985647*([DAY_OF_YEAR]-1) + 15.041069*([HOUR_0_23_MINUTE]-9)) % 360)"/>`.
  227.64 = GMST at 2026-01-01 00:00 UT (100.66 deg) + 126.98 deg longitude; regenerate the constant per year, or use the year-free form `-((280.46062 + 360.98564737*(([UTC_TIMESTAMP]-946728000000)/86400000) + 126.98) % 360)` (float32 evaluation would still be within 0.5 deg). `Variant mode="AMBIENT" target="alpha" value="0"`. Second `PartImage vault_ambient.png` alpha 0 with `Variant AMBIENT alpha 255`, same Transform. Daytime dimming: `<Transform target="alpha" value="(sun above horizon) ? 150 : 255"/>` using the same half-day formula as z9. Verify with the validator that a child may sit at negative x/y and that pivot resolves to P; fallback is a 900 x 900 image with P at its centre inside a 450 x 450 clip group.
- **z2 haze**: `PartImage haze.png` 450 x 450, `Variant AMBIENT alpha 0`.
- **z3 well**: `PartImage well_fill.png` (both modes) + `PartImage well_bevel.png` with `Variant AMBIENT alpha 0`. The segment-plus-sector shape is not a WFF primitive, hence bitmap.
- **z4 telemetry**: `Group telemetry` with `Variant AMBIENT alpha 0`: `PartText` labels; values via `Template` with `[BATTERY_PERCENT]` and `numberFormat("#,###", [STEP_COUNT])`; a `Condition` on `[BATTERY_PERCENT] <= 15` swaps the value colour to `#F3C479`; gauges as `PartDraw Rectangle` with `<Transform target="width" value="52*[BATTERY_PERCENT]/100"/>` and `52*clamp([STEP_COUNT],0,10000)/10000`; prompt as `PartText`. Ambient group (`alpha 0`, `Variant AMBIENT alpha 255`): `BAT %s%%` template and `INFINITY`.
- **z5 bridge**: `PartImage bridge_active.png` 362 x 128 at (44, 166) with `Variant AMBIENT alpha 0`; `PartImage bridge_ambient.png` alpha 0 -> 255.
- **z6 inscriptions**: date as `PartText` `Template "%s %s / %s"` with `[DAY_Z]`, month and weekday from `Condition` blocks on `[MONTH]` (12) and `[DAY_OF_WEEK]` (7) to keep uppercase terminal style (or `[MONTH_S]`/`[DAY_OF_WEEK_S]` if mixed case is accepted). HH:MM as three nodes like v4: `DigitalClock > TimeText format="hh" hourFormat="24"` box x 119 w 94 CENTER, `PartText ":"` at 225 in phosphor, `TimeText format="mm"` box x 237 w 94, `Font roboto_mono size 78 weight BOLD`. Ambient digits: a second `DigitalClock` using `BitmapFonts > BitmapFont orbit_outline` (11 glyph PNGs 94 x 60 with the baked 1.4 px outline) with alpha Variants crossing the two clocks. `SEC %s` from `[SECOND_Z]`, ambient alpha 0.
- **z7 ring**: `Group ring x=0 y=0 width=450 height=450` pivot centre with `Variant mode="AMBIENT" target="angle" value="-14" startOffset="0.28" duration="0.72" interpolation="CUBIC_BEZIER" controls="0.22,1,0.36,1" angleDirection="CLOCKWISE"`; inside: `PartImage ring_active.png` (Variant alpha 0) and `PartImage ring_ambient.png` (alpha 0 -> 255).
- **z8 seconds**: `PartDraw` with `Arc centerX=225 centerY=225 width=384 height=384 startAngle=0 endAngle=0` `Stroke color #ffA6F46A thickness 1.7` and `<Transform target="endAngle" value="6*[SECOND]"/>`; marker `Group` pivot centre with `<Transform target="angle" value="6*[SECOND]"/>` holding an `Ellipse` r 3.3 at (225, 33) and a `Line` 225,23 -> 225,18. Group `Variant AMBIENT alpha 0`. Using `[SECOND]` (not `[SECOND_MILLISECOND]`) keeps the interactive frame rate at 1 Hz.
- **z9 solar lip**: day arc `PartDraw Arc` r 217.5 stroke 3 `#59E0B35A` with `<Transform target="startAngle" value="367.95 - 15*(6.08 + 1.30*cos(rad(([DAY_OF_YEAR]-172)*0.9856)))"/>` and `endAngle = 367.95 + 15*(...)`; if the Arc rejects angles outside 0–360, express as start in range and sweep via `endAngle = startAngle + 30*(...)`. Sun: `Group` pivot centre `<Transform target="angle" value="15*[HOUR_0_23_MINUTE]+180"/>` holding `PartImage sun.png` 16 x 16 at (217, 0). Moon: `Group` with `<Transform target="angle" value="15*[HOUR_0_23_MINUTE]+180-12.19*[MOON_PHASE_POSITION]"/>` holding eight `Condition`s on `[MOON_PHASE_TYPE]` selecting `moon_0..7.png` 18 x 18 at (216, 1). Ambient: day arc `Variant alpha 0`; sun/moon swap to dim sprites.
- **z10 dragon**: `PartImage dragon_active.png` 150 x 112 at (150, 14), `Variant AMBIENT alpha 0`; `dragon_ambient.png` alpha 0 -> 217.
- **z11 drift**: `Group drift x=0 y=0 width=450 height=450` wrapping z3..z10 with `<Transform target="x" value="round(2*cos(rad(6*[MINUTE])))"/>` and `target="y" value="round(2*sin(rad(6*[MINUTE])))"`.
- Memory: vault 2 x 1.4 MB + ring 2 x 0.8 MB + bridge 0.2 MB + haze 0.8 MB + well 0.3 MB + dragon 2 x 0.07 MB + sprites ~ 6.5 MB RGBA at design scale; stays under the 10 MB ambient guidance only because the ambient set is the sparse vault, ambient ring, ambient bridge, well fill and ambient dragon (~3.5 MB). Run the WFF memory-footprint evaluator before trusting this.

---

## 7. Risks (what could still look flat or fail)

1. **Off-canvas pivot**: a 588 px PartImage at negative coordinates with its pivot above the visible dial is unusual; the validator or the Samsung runtime may clip or ignore it. Fallback described in z1; worst case the vault becomes a 450 px disc with P inside it and the horizon no longer equals the dial edge (the concept survives, the sky area shrinks).
2. **Sidereal constant drift**: the `227.64` constant is 2026-specific (error grows 0.26 deg/yr if not regenerated). The `[UTC_TIMESTAMP]` form fixes it, at the cost of possible float32 precision loss (~0.5 deg, 1 px).
3. **Flatness through inconsistent light**: baked shadows only read as depth if every PNG agrees on the 10:30 light. One wrong gradient (e.g. a symmetric ring chamfer) and the stack collapses back to a print. Enforce one light in the bake script.
4. **Lip clutter**: sun, moon and the seconds marker share a 35 px band. Mitigation already built in — different radii (217 / 215 / 192), different hues (gold / grey / phosphor) — but at 40 mm a new-moon sprite next to the sun may read as a smudge; the ambient moon can be dropped if so.
5. **Memory and ambient budget**: six full-size bitmaps; the Watch6 Classic has headroom, but the ambient 10 MB rule and Samsung's AOD pixel meter must be measured, not assumed.
6. **Arc angle semantics**: negative `startAngle` or `endAngle > 360` on the day arc may wrap; test both forms.
7. **The sky reads as random dots**: with the Dipper and Cassiopeia mostly under the dragon, recognisability depends on the open windows: Orion, Cygnus, Leo, Scorpius and the Pegasus square must carry lines, and the zenith gets a 4 px cross-hair so the user can learn the instrument. If still unreadable, the constellation lines go from 22 to 35 percent.
8. **AOD brightness clamp**: Samsung lowers AOD brightness; `#91AD80` digit outlines may fall below comfortable contrast. Keep the stroke at 1.4 (do not go thinner) and be ready to lift to `#A3BF92`.
9. **Static thin rims in AOD**: the bridge rim and well bevel are the classic burn-in offenders; the drift group and the 12 percent luminance ceiling are the defence, and the bevel is already off in AOD.
10. **Seconds at 1 Hz**: the stepped probe is deliberate; if the user asks for a sweep, say no — it costs more battery than everything else combined.
11. **Daytime vault dimming** uses the same approximate sunrise formula; being 15 minutes wrong at dawn is invisible, but the alpha change is a discrete step — acceptable, or lerp it over 30 minutes with a clamp expression.

---

## 8. Why it is not flat

v4 was a drawing of space; v5 is an instrument made of four physical levels, and you can see the levels because they hide each other and because they each keep a different time. The sky is a real planisphere of Seoul, turning once per sidereal day around a pole that sits under the dragon's coils, so the stars you see between the coils tonight are not the ones you saw last week. Above that sky, a dark bridge carries the date and the big digits and throws a soft shadow onto the stars below it; its two ends disappear under the chamfered ring, and the ring's inner rim catches the same light the dragon's emboss catches. Below the sky, a window is cut out, and through it you read battery and steps as white inscriptions on the black floor, with the sky plane's bevelled edge glinting at the cut. On the outer lip, a gold sun crawls once around the dial every 24 hours, sitting on the lit day arc by day and on the dark lip by night, and the moon trails it by its phase. Nothing is decorative for its own sake: every plane is a clock on a different scale — seconds on the ring, hour and minute on the bridge, the solar day and the lunar month on the lip, the sidereal day in the vault — which is precisely the structure that makes the JLC Galaxia read as deep. And it stays KALI: official dragon, phosphor hierarchy, monospace digits that never move, a terminal prompt, INFINITY.

---

## 9. How much Galaxia survives

| Galaxia element | v5 | Notes |
|---|---|---|
| Deepest level with white inscriptions | yes | the well |
| Domed structure wrapping the centre, grisaille disc | yes (material) | bridge + haze; chiaroscuro baked, not enamel |
| Real sidereal vault from a fixed latitude | yes | Seoul 37.57 N instead of 46 N |
| Cosmotourbillon: bright object orbiting slowly | partial | gold sun (24 h) + seconds probe (1 min); sidereal-orbit object only as optional z1b |
| Sunken hour ring between flanges | yes (one ring) | chamfered flange r 176–211 |
| Sun pointer with zodiac month | sun yes, zodiac partial | ecliptic + zodiac ticks baked in the vault |
| Dauphine hands on two rings | no | replaced by fixed digits (hard constraint) |
| Dragon edition | yes | official Kali dragon on the pole |

About six of eight ideas survive, and legibility is strictly better than v4: the digits now sit on an opaque plate instead of open black with a planet grazing the ring, and the AOD lit budget drops from ~11 to ~8 percent.

---

## Appendix A — Star catalogue for the studio (J2000, mag <= 2.5, dec >= -40, plus asterism members)

| Star | RA h | Dec deg | mag | | Star | RA h | Dec deg | mag |
|---|---|---|---|---|---|---|---|---|
| Sirius | 6.752 | -16.72 | -1.46 | | Alioth | 12.900 | 55.96 | 1.76 |
| Arcturus | 14.261 | 19.18 | -0.05 | | Dubhe | 11.062 | 61.75 | 1.79 |
| Vega | 18.616 | 38.78 | 0.03 | | Alkaid | 13.792 | 49.31 | 1.86 |
| Capella | 5.278 | 46.00 | 0.08 | | Mizar | 13.399 | 54.93 | 2.04 |
| Rigel | 5.242 | -8.20 | 0.13 | | Merak | 11.031 | 56.38 | 2.37 |
| Procyon | 7.655 | 5.22 | 0.34 | | Phecda | 11.897 | 53.69 | 2.44 |
| Betelgeuse | 5.919 | 7.41 | 0.42 | | Megrez | 12.257 | 57.03 | 3.31 |
| Altair | 19.846 | 8.87 | 0.77 | | Polaris | 2.530 | 89.26 | 1.98 |
| Aldebaran | 4.599 | 16.51 | 0.85 | | Kochab | 14.845 | 74.16 | 2.08 |
| Antares | 16.490 | -26.43 | 1.06 | | Schedar | 0.675 | 56.54 | 2.24 |
| Spica | 13.420 | -11.16 | 0.97 | | Caph | 0.153 | 59.15 | 2.27 |
| Pollux | 7.755 | 28.03 | 1.14 | | Gamma Cas | 0.945 | 60.72 | 2.47 |
| Fomalhaut | 22.961 | -29.62 | 1.16 | | Ruchbah | 1.430 | 60.24 | 2.68 |
| Deneb | 20.690 | 45.28 | 1.25 | | Mirfak | 3.405 | 49.86 | 1.79 |
| Regulus | 10.140 | 11.97 | 1.35 | | Algol | 3.136 | 40.96 | 2.12 |
| Castor | 7.577 | 31.89 | 1.58 | | Alpheratz | 0.140 | 29.09 | 2.06 |
| Bellatrix | 5.419 | 6.35 | 1.64 | | Scheat | 23.063 | 28.08 | 2.42 |
| Alnilam | 5.603 | -1.20 | 1.69 | | Markab | 23.079 | 15.21 | 2.49 |
| Alnitak | 5.679 | -1.94 | 1.74 | | Algenib | 0.220 | 15.18 | 2.83 |
| Mintaka | 5.533 | -0.30 | 2.23 | | Enif | 21.736 | 9.88 | 2.39 |
| Saiph | 5.796 | -9.67 | 2.06 | | Hamal | 2.119 | 23.46 | 2.00 |
| Elnath | 5.438 | 28.61 | 1.65 | | Denebola | 11.818 | 14.57 | 2.14 |
| Alhena | 6.629 | 16.40 | 1.93 | | Algieba | 10.333 | 19.84 | 2.28 |
| Adhara | 6.977 | -28.97 | 1.50 | | Alphecca | 15.578 | 26.71 | 2.23 |
| Mirzam | 6.378 | -17.96 | 1.98 | | Rasalhague | 17.582 | 12.56 | 2.08 |
| Wezen | 7.140 | -26.39 | 1.84 | | Albireo | 19.512 | 27.96 | 3.18 |
| Alphard | 9.460 | -8.66 | 1.98 | | Sadr | 20.370 | 40.26 | 2.23 |
| Shaula | 17.560 | -37.10 | 1.62 | | Eltanin | 17.943 | 51.49 | 2.23 |
| Nunki | 18.921 | -26.30 | 2.05 | | Alderamin | 21.310 | 62.59 | 2.45 |
| Kaus Australis | 18.403 | -34.38 | 1.85 | | Diphda | 0.727 | -17.99 | 2.04 |
| Dschubba | 16.005 | -22.62 | 2.29 | | Menkar | 3.038 | 4.09 | 2.53 |

Line sets baked into the vault: Orion (Betelgeuse–Bellatrix–Mintaka–Alnilam–Alnitak–Saiph–Rigel), Big Dipper (Dubhe–Merak–Phecda–Megrez–Alioth–Mizar–Alkaid), Cassiopeia (Caph–Schedar–Gamma Cas–Ruchbah), Northern Cross (Deneb–Sadr–Albireo, Sadr wings), Summer Triangle (Vega–Deneb–Altair, dotted), Leo sickle (Regulus–Algieba–Denebola), Scorpius (Dschubba–Antares–Shaula), Pegasus square (Markab–Scheat–Alpheratz–Algenib), Gemini (Castor–Pollux–Alhena), Taurus (Aldebaran–Elnath), Perseus (Mirfak–Algol), Bootes (Arcturus–Alphecca hint). Placement in the chart: `x = 225 + r sin(RA*15 deg)`, `y = 47 + r cos(RA*15 deg)` with `r = 137.2 tan((90 - dec)/2)` — RA increases clockwise from straight down — before the `-LST` rotation.

## Appendix B — Sanity check at the preview time
2026-10-25 10:08 KST: days since 2026-01-01 00:00 UT = 297.047; LST = 227.64 + 292.74 + 17.05 = 537.43 -> 177.4 deg (11 h 50 m), consistent with the sun (RA ~14 h) sitting 2.3 h east of the meridian at 09:40 solar time. Vault angle -177.4 deg; sun pointer at 332 deg (upper-left, on the day arc, sunrise 06:47 / sunset 17:36 by the formula); moon (day 14 of the cycle) at 332 - 171 = 161 deg, near the bottom, i.e. just set in the west. Everything on the lip is where the real sky puts it.

Sources used: JLC press page for the Master Hybris Artistica Calibre 945 (dial on several levels under a dome, deepest level with transferred inscriptions, first grisaille star map) and the Watchonista / Wristreview coverage (sky chart, celestial vault, zodiacal calendar, Cosmotourbillon orbiting once per sidereal day); Android WFF references for data sources, arithmetic expressions and the Variant element.
