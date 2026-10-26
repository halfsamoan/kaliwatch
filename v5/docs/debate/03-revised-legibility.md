# KALIWATCH v5 "Celestial Vault" — proposal v2 (legibility / AOD / burn-in lens)

Reviewer stance, unchanged: the face is designed from the constraints outward. HH:MM reads in under one second on a 40 mm disc, every information string stays inside the safe radius, the AOD keeps the depth idea on a lit budget far under 15 percent, nothing bright sits still. v2 keeps the v1 skeleton — a real Seoul planisphere, a plate carrying civil time, a sunken telemetry well, a sun/moon lip, one clock per level — because no critic refuted it; all three called it the right reading of the Galaxia. What v2 changes is everything the critics proved was *invisible or wrong as rendered*: the materials now live in a 2–18 percent luminance band instead of 0.3–2; the sky is 28 percent of the dial instead of 16; the pole sits inside the visible disc so the circumpolar sky really wheels under the dragon; the chart formula is un-mirrored; the sun lip and the vault share one orientation; the drift, the sleeping ring, the Variant/Transform conflicts and the step-count overflow are fixed; and the motion spec is written the way WFF can actually play it.

Design space 450 x 450, centre C = (225, 225), dial radius 225, target Galaxy Watch6 Classic 480 x 480 (scale 1.0667). All coordinates are in the 450 space; angles are clockwise from 12 o'clock unless stated. Relative luminance values are WCAG, computed.

---

## 0. The idea, sharpened

Five physical levels, one consistent light (10:30, 35 deg elevation; every cast shadow is (+1, +1) per unit of height), and **a different real clock on every level that carries information**:

| Level | What it is | Clock |
|---|---|---|
| -1 well | Black floor with white inscriptions (battery, steps, prompt) seen through a cut in the sky plane | telemetry |
| 0 sky | Real Seoul night sky, polar-stereographic, grisaille Milky Way, rotating about the north celestial pole | sidereal day 23 h 56 m 04 s |
| +1 plate | Floating dark plate with sky on all four sides, carrying date and the fixed HH:MM, casting a shadow on the sky | civil hour, minute, calendar day |
| +2 flange | Lit, chamfered ring: 60 ticks, seconds trail; outer lip with gold sun, grey moon, 24 h marks | seconds; 24 h solar; lunar month |
| +3 dragon | Official Kali dragon embossed over the pole, wings resting on the flange | identity |

Two geometric decisions replace v1's:

1. **The pole is inside the disc.** P = (225, 85), 140 px above the centre, with stereographic scale k = 107.7. The horizon circle then has radius 176.6 centred on C — i.e. **the flange's inner edge is the horizon**: the sky disc disappears under the ring exactly as the Galaxia's celestial disc disappears under its flange. The whole circumpolar circle (Alkaid 40 px, Dubhe 27 px, Schedar 32 px, Kochab 15 px from P) now lies at y 45–125, inside the visible disc and inside the dragon's frame; one of the Dipper / Cassiopeia is always in the dragon's window.
2. **Midnight is at 12 o'clock on the lip and the sun runs counter-clockwise**, like the vault: it rises on the left (east), culminates at the bottom (south) at solar noon, sets on the right. Lip and vault agree; at midnight the sun is behind the dragon's wings — below the horizon, nothing to hide.

---

## 1. Layer stack, back to front

z-order is paint order. The ambient stack (section 5) is painted first; the active stack follows. Each stack carries its own black occluders so the two can crossfade.

### z0 — Void
- `#000000` disc, both modes.

### z1 — Vault (rotating sky, active)
- Shows: the northern sky from Seoul 37.57 N / 126.98 E — Yale-BSC stars to mag 2.5 plus asterism members (Appendix A), constellation lines, the Milky Way as a grisaille band, a faint ecliptic, Jupiter and Saturn at their current-year positions, all baked into one PNG.
- Projection: `r(dec) = 107.7 * tan((90 - dec)/2)` from P = (225, 85). Horizon = circle r 176.6 about C. Zenith (225, 138). Celestial equator = circle r 107.7 about P (meridian point (225, 193), under the plate). Ecliptic = circle r 117.4 centred 46.7 px from P toward RA 18 h.
- Chart placement before rotation: `x = 225 - r sin(RA * 15 deg)`, `y = 85 + r cos(RA * 15 deg)` (RA increases clockwise from straight down; east is on the left). Handedness test baked into the studio: at Orion's culmination Betelgeuse.x < Bellatrix.x and Rigel.x > Saiph.x.
- Bounds: PNG 632 x 632 (chart radius 316 = everything within 316 px of P = declination -52; the farthest visible point of the inner disc is 140 + 176 = 316 px from P), placed at (-91, -231) so its centre is P. Rotation pivot P.
- Driver: local sidereal time; screen angle = `360 - LST` (counter-clockwise by LST; stars rise on the left, culminate at the bottom, set on the right). 0.2507 deg/min = 0.8 px/min at r 176.
- Material (bake sizes chosen for a 1.0667x bilinear resample after sub-degree rotation): base `#05090B` (0.2 %); nebulosity patches `#1E2E33` (2.5 %), three or four soft blobs 60–90 px; Milky Way band 44 px wide, 30 px blur, peak `#34484C` (5.9 %) along the galactic equator (through Cassiopeia, Cygnus, Aquila, Sagittarius / Auriga, Gemini, Canis Major); stars mag <= 1: 3.0 px core `#FFFFFF` + 6 px halo `#8CA6B5` 35 %; mag 1–2: 2.4 px `#D5E0E3`; mag 2–2.5: 2.0 px `#AFC2C9`; fainter asterism members 1.6 px `#8CA6B5` 70 %; constellation lines 1.4 px `#8CA6B5` 35 %; ecliptic 1.4 px dashed 6/6 `#E0B35A` 22 % (texture, not information; no zodiac ticks); Jupiter 7 px shaded disc `#D9C9A8` with dark limb, Saturn 6 px `#CFC2A0` with a 12 x 4 px ring at 26 deg — baked at their ecliptic positions for the bake year (2026: Jupiter in Cancer, RA ~9.0 h, dec ~+18; Saturn in Pisces, RA ~0.9 h, dec ~+3; the studio computes both from a low-precision ephemeris and the bake is regenerated yearly together with nothing else — the LST expression is year-free).
- No daytime dimming. Day and night are read from the lip (sun on the lit arc / on the dark lip).
- Active only. Ambient twin: z1a below.

### z2 — Haze (fixed extinction + rim shadow, active)
- Fixed PNG 450 x 450, inside r 176 only: horizon extinction, black 0 % at r 120 rising to 65 % at r 176 (the sky darkens toward the horizon wall), and the flange's cast shadow on the sky: 5 px inner shadow black 55 % along r 171–176 on the 4:30 half (45–225 deg). Nothing at the zenith (a 1–2 percent glow is invisible; dropped).
- Active only; ambient alpha 0.

### z3 — Well (level -1, both modes)
- Shape: the circular segment y >= 292 inside r 176 — a plain segment, no sector limit, no slivers. Chord x 61.4..388.6.
- Built as vectors, zero bitmap: black `Rectangle` x 49..401, y 292..401 (its corners fall under the opaque flange, which paints later, so the visible shape is the segment); cut-lip highlight: `Line` y 291.5, x 56..394, 2 px `#4A6A45` (12.2 %) — the top corner of the sky plane catching the light along the cut. An inner shadow on the floor is moot on a `#000000` floor and is not drawn.
- Active: rect + highlight. Ambient: rect only (highlight alpha 0).

### z4 — Well inscriptions (telemetry, active)
- Labels `BATTERY` / `STEPS` 14 px `#9BAB9C` baseline y 317, centred x 146 / x 304.
- Values 24 px `#EFF8EC` baseline y 343, same centres (battery `#F3C479` at <= 15 %). `99,999` spans x 260.8..347.2, far corner r 169.9; `100%` corner r 128. Both inside r 171 (checked for the six-glyph case, not the demo case).
- Gauges y 357: tracks x 120..172 and x 278..330, 2 px `#17291D`, fill `#A6F46A` (battery; steps capped at 10 000). Gauge end (330, 357) r 168.7.
- Divider x 225, y 309..351, 1 px `#34543C`.
- Prompt `kali@orbit:~$ INFINITY` 12 px baseline y 374, x 145.8..304.2, corner r 168.7; INFINITY in phosphor.
- Label cap-top y 307 sits 15 px below the cut-lip highlight.
- Active only. Ambient replacement (inside the ambient stack): `BAT 78%` 17 px `#7F9472` baseline y 333 with two 18 px side dashes; `INFINITY` 11 px letter-spaced baseline y 370.

### z5 — Plate (level +1, active)
- Shows: a floating plate, sky visible on all four sides. Rounded rect x 92..358, y 166..266 (266 x 100, corner r 18). Corners at r 145.5 / 139.2 — 30 px inside the flange.
- Material, 100 % opaque everywhere (no star ever touches a numeral): top-face gradient `#324A38` (5.9 %) at the upper-left to `#1A2A1F` (2.0 %) at the lower-right; 2.5 px bevel highlight `#5A7A55` (16.7 %) along the top and left edges fading to `#2A3D2E` along the bottom and right, with a 1 px `#000000` edge below/right; cast shadow offset (+3, +3), 8 px blur, black 70 %, falling on the grisaille sky to the right and below (visible on the strip y 266–292 and the right-hand sky column). PNG 290 x 124 at (80, 158), 0.14 MB.
- Active only. Ambient twin: black `Rectangle` 262 x 96 at (94, 172) + four corner brackets (two 18 px legs each, 1.5 px `#2A3D27`, 4 %) at the plate's corners — the plate's footprint, asleep, consistent with the segmented ring.

### z6 — Plate inscriptions (date + HH:MM)
- Date `25 OCT / SUN` 15 px `#9BAB9C` letter-spacing 1.5, centred x 225, baseline y 188 (cap top 177.3: 8.8 px under the plate's top edge; 8.5 px above the digit tops).
- HH:MM unchanged from v4: Roboto Mono 78 px weight 600 `#EFF8EC`, hour centred x 166, minute x 284, baseline y 252; colon `#A6F46A` x 225 baseline y 248. Digit box x 119..331, y 196.5..252; 14 px to the plate's bottom edge. Contrast 8.9:1 on the lit corner, 13.8:1 on the shadow side, 18:1 where the gradient meets `#070B09`-class darkness; never below 8.9:1.
- `SEC` readout removed: the seconds live on the flange (trail + marker), and seconds are not in the brief's information set.
- Active: filled digits. Ambient twin: same font, same boxes, `Font color #11200F` + `Outline #91AD80 width 1.4` — identical metrics, no bitmap font; date `#7F9472` as a second PartText.

### z7 — Flange ring (level +2, active)
- Annulus r 176..209, chamfered and *lit*: body gradient by angle, `#36503B` (6.8 %) at 10:30 to `#111A13` (0.9 %) at 4:30; inner rim 2 px r 176..178, `#5E7F58` (18.3 %) at 10:30 to `#26392A` (3.5 %) at 4:30; outer step 1 px `#000000` at r 209.
- Lip r 209..225: base `#0B1418` (0.6 %) grading to `#172A31` (2.1 %) at the edge — the dark fired-enamel band the gold sun rides; 24 solar marks r 209.5..212.5 every 15 deg, 1.4 px `#34543C` 70 %.
- Ticks: 60 at r 202..209 1 px `#34543C`, every fifth r 199..209 1.6 px `#526650`; seconds track r 192 1 px `#17291D`.
- One PNG 450 x 450, transparent inside r 176, 0.81 MB. The ring group carries the signature wake rotation (-14 deg -> 0). The seconds probe (z8) sits inside the rotating group, as in v4.
- Active only. Ambient twin (outside any rotating group, vector): black annulus (`Ellipse` r 200.5, stroke 49 px `#000000`) that hides every star beyond the horizon, then the v4 sleeping ring: 4 arcs r 192, 48 deg each from 12 / 102 / 192 / 282 deg, 1.25 px `#4D633F`, and 12 ticks `#7F9472`.

### z8 — Seconds probe (active)
- Trail arc r 192, 1.7 px `#A6F46A` 72 %, from 12 o'clock to 6 * second; marker dot r 3.3 at r 192 plus a 5 px radial tick to r 202. Stepped at 1 Hz via `[SECOND]`; no sweep.
- Passes behind the dragon's wings for ~8 s per minute near 12 o'clock: intended occlusion (the dragon is the top level). The dragon PNG's glow is 2.5 px at 15 % so the marker is hidden by ink, not smeared by glow.
- Active only.

### z9 — Solar lip (24 h sun + moon)
- Sun: gold disc r 5 `#E0B35A` with a 2.5 px glow 20 %, riding r 215 (disc r 210..220, glow to 222.5); angle = `360 - 15 * HOUR_0_23_MINUTE` (midnight 12 o'clock, 06:00 at 9 o'clock, noon 6 o'clock, 18:00 at 3 o'clock; counter-clockwise, like the sky).
- Day arc r 215, 3 px `#E0B35A` 50 %, centre `172.0 + 0.25 * EoT` deg, half-span `15 * (6.08 + 1.30 * cos((DOY - 172) * 0.9856 deg))`, `EoT = 9.87 sin 2B - 7.53 cos B - 1.5 sin B`, `B = 0.9863 * (DOY - 81) deg` (minutes). Start = centre - half (sunset point, right), end = centre + half (sunrise, left); both always within 57..287 deg, so no arc-wrap case exists. 25 Oct: 06:55 / 17:37 (real Seoul 06:52 / 17:41); 21 Jun 14 h 46 m; 21 Dec 9 h 34 m.
- Moon: 14 px phase sprite at r 214 (r 207..221), lit side `#8CA6B5`, dark `#1A2326`, rim 0.8 px `#4A5A5E`; angle = `sun angle + 12.19 * MOON_PHASE_POSITION` (full moon opposite the sun; first quarter culminates at sunset). It moves with the sun at 15 deg/h and steps 12.19 deg once a day when the integer day count ticks; the phase at 1.3 mm is texture — the moon is a *position* marker.
- Active: all. Ambient: day arc hidden; sun `#7A6336` (13 %), moon sprite 60 %.

### z10 — Dragon (level +3, identity)
- Official Kali dragon path, unchanged, rasterised with a baked emboss: 1.5 px shadow `#000000` 70 % offset (+3, +3) (same light as the plate), 2.5 px phosphor glow 15 %. Frame 150 x 112 at (150, 26); top corners at r 212.7 — the wing tips rest on the flange's outer edge; the sun passes behind the wings around midnight +/- 70 min (named occlusion: the sun sleeps under the wing).
- P = (225, 85) sits 3 px below the frame centre, under the spiral of the body. The official mark is ~9 % ink inside its frame (measured on the v4 ambient preview), so the Dipper and Cassiopeia (2.4–3.0 px cores, lines 1.4 px at 35 %) show through the 91 % negative space; what hid them in v1 was the 6 px glow, now gone.
- Active: phosphor PNG 96 %, 160 x 122 with margins. Ambient: flat `#3E5A38` (8.6 %) PNG at 85 %, no glow.

### z1a / z11 — Ambient stack and drift (ambient only)
- One group `ambient_stack`, alpha 0, `Variant AMBIENT alpha 255`; inside it `drift` translated by `x = round(2 cos(6 deg * MINUTE))`, `y = round(2 sin(6 deg * MINUTE))` — a 2 px circle walked once an hour, 1 px per step. Contents: 24 vector stars (the brightest, 2 px `#8CA6B5`, in a 632 x 632 group pivoting on P with the same LST transform — zero bitmap), black annulus + sleeping ring, black plate rect + brackets, outline clock + ambient date, BAT / INFINITY, dim sun and moon, ambient dragon.
- The active stack never drifts. The only place the two positions meet is the wake crossfade, where the outline glyphs (drifted <= 2 px) fade out while the filled glyphs fade in at the fixed position: a <= 2 device px reconcile hidden inside a 300+ ms crossfade.

### Optional z1b — Sun on the ecliptic (stage 2)
A 10 px gold sprite nested in the rotating vault group at the sun's ecliptic longitude `L = (DOY - 80) * 0.9856 deg` (dec `asin(sin 23.44 sin L)`, RA `atan(tan L cos 23.44)` with the quadrant fixed by `cos L < 0`). Consistent with the lip now (both frames put east on the left). Held back until the base stack is validated on the watch.

---

## 2. Composition

```
        y=0  ______________ dial edge ______________
   lip 209-225 /  24h marks . sun(midnight) . moon      \      sun rides r215 counter-clockwise:
 flange 176-209|  lit chamfer 6.8% -> 0.9%, 60 ticks     |     06:00 left, noon bottom, 18:00 right
               |   ___ official dragon 150x112 ___       |
               |  /  frame (150,26)-(300,138)      \     |     P (225,85) under the spiral;
    NE sky     | |   P(225,85)  Dipper / Cassiopeia |    | NW sky   circumpolar circle r<=40 wheels
   (shoulder)  |  \__ zenith (225,138) ____________/     | (shoulder) through the 91% negative space
               |      sky band y138-166  .  *  .   *     |
    y=166  ----|-------- plate (92,166)-(358,266) --------|----  floats: sky left x49-92, right x358-401
               |  .  |  25 OCT / SUN    15px  y188  |  . |
               |  *  |  [1][0] : [0][8]  78px  y252 |  * |      digit box x119-331
    y=266  ----|------------- shadow (+3,+3) -------------|----
               |   .   sky strip y266-292  .   *   .     |      26 px, plate shadow on its top third
    y=292  ----|=========== cut lip 2px 12% ==============|----  well chord x61-389
               |   BATTERY 14px   |   STEPS              |
               |   78%   24px y343|   6,240              |      well (-1), plain segment
               |   =====  y357    |   =====              |
               |   kali@orbit:~$ INFINITY  12px y374     |
                \__________ flange r176-209 ____________/
                 \_______ lip: day arc, sun, moon ______/
```

Section (what the eye reads):

```
 light 10:30 ->      dragon (+3)
                   ===/\\\===            flange (+2) lit side bright, 4:30 side dark
          plate (+1) ============  ->shadow on sky
   sky (0) . * . * . ( Milky Way 6% ) . * . * .    horizon wall = flange inner edge
   well (-1)              |__ white inscriptions __|
```

- Fixed-information positions (never move, never scale): HH:MM as above; date y 188; battery/steps columns x 146 / 304; prompt y 374. All text inside **safe text radius 171** (checked with `99,999` and `100%`); the flange zone r 176–225 holds instruments only.
- Depth cues, all above the perceptual floor: plate over sky (shadow on a 2.5–6 % sky, 17 % bevel); flange over sky (18 % rim, 5 px cast shadow on the sky at 4:30); dragon over flange (wings on the ring, seconds marker and midnight sun pass behind); well below sky (12 % cut lip, white on true black).
- Sky windows (pixel census, Appendix C): open sky 44 500 px^2 = **28 % of the dial, 46 % of the inner disc** (v1: 16 %). The cap around and through the dragon (29 600 - ink), the band y 138–166 (full width), two side columns 35–43 px wide x 100 px tall beside the plate (east column: rising stars; west column: setting stars — true now, with columns of ~4 000 px^2 each, not 300 px^2 slivers), the strip y 266–292.
- Value bands by level (luminance): well floor 0 %; sky base 0.2 % with grisaille 2.5–5.9 %; plate 2.0–5.9 % face, 16.7 % bevel; flange 0.9–6.8 % body, 18.3 % rim; lip 0.6–2.1 % with a 49 % sun; dragon 74 % phosphor; information 91 % paper. Every adjacent pair differs by at least a factor 2.5.
- Device mapping: x 1.0667 for 480 px; smallest baked element 1.4 px (lines), smallest star 1.6 px; nothing under 1.2 px anywhere.

---

## 3. Palette

Identity and existing tokens stay: phosphor `#A6F46A` (colon, seconds, gauges, dragon, INFINITY), paper `#EFF8EC` (digits, values), secondary `#9BAB9C`, structure `#34543C`, track `#17291D`, warning `#F3C479`, AOD set `#11200F / #91AD80 / #718D61 / #7F9472`.

Controlled additions:

| Hue | Hex | Luminance | Role |
|---|---|---|---|
| Sun gold | `#E0B35A` | 49 % | the 24 h sun, its day arc (50 % alpha), the ecliptic dashes at 22 % (texture) |
| Grisaille | `#8CA6B5` (existing starlight token) | 36 % | stars, constellation lines, moon lit side |
| Milky Way silver | `#34484C` | 5.9 % | the grisaille band; nebulosity `#1E2E33` 2.5 % |
| Lit flange | `#36503B` / rim `#5E7F58` | 6.8 % / 18.3 % | chamfer lit side and inner rim at 10:30; shadow side `#111A13` / `#26392A` |
| Plate face | `#324A38` -> `#1A2A1F`, bevel `#5A7A55` | 5.9 -> 2.0 %, 16.7 % | the raised plate |
| Cut lip | `#4A6A45` | 12.2 % | the well's edge |
| Fired enamel | `#0B1418` -> `#172A31` | 0.6 -> 2.1 % | the outer lip base |

Rules unchanged: gold never on text or UI; grisaille never on text; phosphor never on sky material. Mid-tone rule (new): any surface that is supposed to read as a level must have a lit edge >= 2 px at >= 12 % and a body >= 2 %; this is enforced by a luminance histogram of the studio render downscaled to 40 mm (Appendix C).

---

## 4. Motion

Easing `cubic-bezier(0.22, 1, 0.36, 1)` (WFF: `controls="0.22 1 0.36 1"`). No loops, no twinkle, no per-second animation except the 1 Hz step of the seconds probe.

### Wake, AOD -> Active, deepest layer first

WFF plays one device-defined transition; the design is specified as fractions of it (designed at 360 ms, which the studio uses). `startOffset + duration <= 1.0` on every row.

| Layer | startOffset | duration | Property |
|---|---|---|---|
| ambient_stack (all ambient twins, incl. drifting outline digits) | 0 | 0.5 | alpha 255 -> 0 |
| z1 vault | 0 | 0.4 | alpha 0 -> 255 |
| z2 haze | 0 | 0.45 | alpha 0 -> 255 |
| z5 plate | 0.17 | 0.55 | alpha 0 -> 255 (shadow arrives with it — a crossfade, not a growing shadow) |
| z3 cut lip + z4 telemetry | 0.22 | 0.6 | alpha 0 -> 255 (v4's 80 ms delay) |
| z6 filled clock + active date | 0.22 | 0.6 | alpha 0 -> 255 in place |
| z7 ring (wrapper alpha / inner angle) | 0.28 | 0.72 | alpha 0 -> 255; angle -14 deg -> 0, CLOCKWISE (the v4 signature) |
| z8 seconds (inside the ring group) | 0.5 | 0.5 | alpha 0 -> 255 |
| z9 lip | 0.33 | 0.57 | day arc alpha 0 -> 255; dim sprites -> bright sprites crossfade |
| z10 dragon | 0.4 | 0.6 | ambient PNG -> embossed PNG crossfade |

Reads as: the sky appears, the plate lifts and its shadow lands, the well lights, the ring locks into place, the dragon ignites last. Nothing in the digit box moves or scales; the only displacement anywhere is the <= 2 px reconcile between the drifted outline glyphs and the fixed filled glyphs, inside the crossfade.

### Sleep, Active -> AOD
On the watch: the same Variants played in reverse — WFF has no separate sleep choreography, and the ring rotates back to -14 deg on sleep (it is invisible while it does, since the ring wrapper's alpha is 0 by then... at the end; during the reverse the user sees the ring un-rotate while it fades — acceptable, and the honest spec). The studio keeps a 180 ms top-first reverse as a design preference, labelled "studio only — the watch plays the symmetric reverse", and offers a toggle to preview the symmetric model.

### Continuous real-time motion (state, not animation)
- Vault: 0.2507 deg/min counter-clockwise about P.
- Sun: 15 deg/h counter-clockwise on the lip. Moon: 15 deg/h with the sun, plus a 12.19 deg step once a day.
- Day arc: once a day.
- Drift (ambient only): 1 px per minute.
- Each second (active only): trail endAngle += 6 deg, marker angle += 6 deg.
- Each minute: digits, sun, moon, vault angle, drift.

### Reduced motion
Studio: wake and sleep instant. WFF: no reduce-motion signal exists for a watch face; the clause is a studio feature only.

---

## 5. AOD

What remains (same face, quiet):
- 24 brightest stars, 2 px `#8CA6B5`, rotating once per minute (vector).
- Dragon flat `#3E5A38` 85 %, no glow.
- Plate footprint: four corner brackets `#2A3D27`; black body.
- Date `#7F9472`; outline digits (fill `#11200F`, stroke 1.4 `#91AD80`) at identical positions.
- Sleeping ring: black annulus + 4 segmented arcs + 12 ticks.
- Sun `#7A6336`, moon sprite 60 %.
- Well: black, `BAT 78%` y 333, `INFINITY` y 370.

Lit-pixel estimate (dial 159 043 px^2; every non-black pixel counted, anti-aliasing modelled x2 on strokes <= 1.5 px and x1.15 on fills — the method that reproduces v4's measured 11.3 %):

| Element | px^2 |
|---|---|
| Outline digits 4 x 300 x 1.4 x 2 + colon | 3 510 |
| Dragon 150 x 112 at 8.6 % ink x 1.15 | 1 660 |
| Sleeping ring 4 x 48 deg x r 192 x 1.25 x 2 | 1 610 |
| Date 12 glyphs | 520 |
| Plate brackets 4 x 36 x 1.5 x 2 | 430 |
| BAT + dashes | 330 |
| Sun + moon | 270 |
| 12 ticks | 220 |
| INFINITY | 200 |
| 24 stars | 150 |
| **Total** | **~8 900 = 5.6 %** |

Expect ~7 % measured at 480 px the way Samsung measures (OPR = pixels with any non-zero channel); v1 estimated 6.9 / 8–9, v4 measured 11.3. The largest contributor is the outline digits, not the dragon; cut order if the on-device meter disagrees: brackets -> ambient stars -> dragon alpha 85 -> 70 %. The digit outline is never thinned.

Burn-in:
1. Nothing above 37.5 % luminance is static in AOD (the digit stroke `#91AD80` is the ceiling; ticks 27 %, sun 13 %, arcs 11 %, dragon 8.6 % at 85 %, brackets 4 %).
2. The drift group walks a 2 px circle once an hour (a 1.4 px stroke sweeps a 5.4 px band); the stars, sun and moon add their own real motion. The ambient stars are inside the drift group, so Polaris (0.7 px from P) moves too.
3. No seconds, gauges, haze, shadow, bevel or cut lip in AOD; no thin full-length rims at all (the plate's AOD rim is four brackets).
4. No OS-level ambient shift is assumed.

---

## 6. WFF v4 mapping

Verified against the reference and XSD during the round: `[DAY_OF_YEAR]` 1–366, `[HOUR_0_23_MINUTE]` float, `[MINUTE]`, `[SECOND]`, `[YEAR]`, `[MOON_PHASE_POSITION]` integer 0–28, `[MOON_PHASE_TYPE]` 0–7, `[BATTERY_PERCENT]`, `[STEP_COUNT]`, `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]`; functions `sin cos tan asin atan rad deg clamp round floor abs numberFormat`, ternary; `Variant` (`duration` / `startOffset` 0–1 fractions, `CUBIC_BEZIER` with `controls` as a whitespace list, `angleDirection`); negative Group x/y schema-legal (`xs:integer`); angles unbounded floats; `Font` children `Outline`, `Upper`, `Template`; `DigitalClock` has no Transform child (translate via a parent Group); one Variant per PartImage, Transforms unbounded. Ambient re-renders once per minute: every ambient-visible expression uses minute-or-slower sources. No millisecond source anywhere in the file.

Tree (abridged; exact where it matters):

```xml
<WatchFace width="450" height="450" clipShape="CIRCLE">
 <Scene backgroundColor="#ff000000">

  <!-- AMBIENT STACK, painted first; its own black occluders -->
  <Group name="ambient_stack" x="0" y="0" width="450" height="450" alpha="0">
   <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0" duration="0.5"
            interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
   <Group name="drift" x="0" y="0" width="450" height="450">
    <Transform target="x" value="round(2*cos(rad(6*[MINUTE])))"/>
    <Transform target="y" value="round(2*sin(rad(6*[MINUTE])))"/>
    <Group name="stars_ambient" x="-91" y="-231" width="632" height="632" pivotX="0.5" pivotY="0.5">
     <Transform target="angle" value="360 - ((280.46062
        + 0.98564737*(365*([YEAR]-2000) + floor(([YEAR]-1)/4) - 499 + [DAY_OF_YEAR] - 1)
        + 360.98564737*(([HOUR_0_23_MINUTE]-9)/24 - 0.5) + 126.98) % 360)"/>
     <!-- 24 x PartDraw 3x3 at (316 - r sin(RA*15) - 1.5, 316 + r cos(RA*15) - 1.5): Ellipse 3x3 Fill #ff8CA6B5 -->
    </Group>
    <PartDraw name="annulus_ambient" x="0" y="0" width="450" height="450">
     <Ellipse x="24.5" y="24.5" width="401" height="401"><Stroke color="#ff000000" thickness="49"/></Ellipse>
    </PartDraw>
    <PartDraw name="well_ambient" x="49" y="292" width="352" height="109"><Rectangle .../><Fill color="#ff000000"/></PartDraw>
    <PartDraw name="plate_ambient" x="94" y="172" width="262" height="96"> black Rectangle </PartDraw>
    <!-- 8 Lines: corner brackets, Stroke #ff2A3D27 thickness 1.5 -->
    <!-- sleeping ring: 4 Arc r192 (center 225,225 size 384) startAngle 12/102/192/282 endAngle +48, Stroke #ff4D633F 1.25; 12 Lines r202..211 #ff7F9472 -->
    <DigitalClock x="0" y="0" width="450" height="450">
     <TimeText format="hh" hourFormat="24" align="CENTER" x="119" y="186" width="94" height="72">
      <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff11200F"><Outline color="#ff91AD80" width="1.4"/></Font>
     </TimeText>
     <TimeText format="mm" align="CENTER" x="237" y="186" width="94" height="72"> same Font </TimeText>
    </DigitalClock>
    <PartText colon ":" at 225/248 Font color #ff11200F + Outline #ff91AD80/>
    <PartText date_ambient 15px #ff7F9472 y 188> <Font ...><Upper><Template>%s %s / %s  [DAY_Z] [MONTH_S] [DAY_OF_WEEK_S]</Template></Upper></Font>
    <PartText bat_ambient 17px #ff7F9472 y 333: Template "BAT %s%%" [BATTERY_PERCENT]/> + 2 Lines
    <PartText infinity_ambient 11px letterSpacing 0.18 y 370/>
    <Group sun_ambient pivot centre><Transform target="angle" value="360 - 15*[HOUR_0_23_MINUTE]"/><PartImage sun_dim 12x12 at (219,4)/></Group>
    <Group moon_ambient pivot centre><Transform target="angle" value="360 - 15*[HOUR_0_23_MINUTE] + 12.19*[MOON_PHASE_POSITION]"/>
      <Condition on [MOON_PHASE_TYPE] 0..7 -> moon_dim_0..7 14x14 at (218,4)/></Group>
    <PartImage dragon_ambient 150x112 at (150,26) alpha 217/>
   </Group>
  </Group>

  <!-- ACTIVE STACK -->
  <Group name="vault_wrap" x="0" y="0" width="450" height="450">
   <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0" duration="0.4" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
   <Group name="vault" x="-91" y="-231" width="632" height="632" pivotX="0.5" pivotY="0.5">
    <Transform target="angle" value="(same LST expression)"/>
    <PartImage x="0" y="0" width="632" height="632"><Image resource="vault_active"/></PartImage>
   </Group>
  </Group>
  <PartImage name="haze" 450x450><Variant mode="AMBIENT" target="alpha" value="0" duration="0.45"/></PartImage>
  <PartDraw name="well_fill" x="49" y="292" width="352" height="109"> black Rectangle (both modes) </PartDraw>
  <Group name="well_detail"> <Variant AMBIENT alpha 0 startOffset 0.22 duration 0.6/>
   <PartDraw cut_lip: Line (56,291.5)-(394,291.5) Stroke #ff4A6A45 2/>
   <PartText labels 14px; values 24px Template [BATTERY_PERCENT] / numberFormat("#,###",[STEP_COUNT]);
    Condition [BATTERY_PERCENT] <= 15 -> colour #ffF3C479;
    gauges: Rectangle width Transform "52*[BATTERY_PERCENT]/100" and "52*clamp([STEP_COUNT],0,10000)/10000";
    divider Line; prompt 12px/>
  </Group>
  <PartImage name="plate" 290x124 at (80,158)><Variant AMBIENT alpha 0 startOffset 0.17 duration 0.55/></PartImage>
  <Group name="clock_active"> <Variant AMBIENT alpha 0 startOffset 0.22 duration 0.6/>
   <DigitalClock> TimeText hh / mm, Font roboto_mono 78 SEMI_BOLD #ffEFF8EC, boxes as above </DigitalClock>
   <PartText colon #ffA6F46A/> <PartText date_active 15px #ff9BAB9C letterSpacing 0.1 Upper/Template/>
  </Group>
  <Group name="ring_wrap"> <Variant AMBIENT alpha 0 startOffset 0.28 duration 0.72/>
   <Group name="ring" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
    <Variant mode="AMBIENT" target="angle" value="-14" startOffset="0.28" duration="0.72"
             interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1" angleDirection="CLOCKWISE"/>
    <PartImage ring_active 450x450/>
    <Group name="seconds"> <Variant AMBIENT alpha 0 startOffset 0.5 duration 0.5/>
     <PartDraw><Arc centerX="225" centerY="225" width="384" height="384" startAngle="0" endAngle="0">
       <Stroke color="#b8A6F46A" thickness="1.7"/><Transform target="endAngle" value="6*[SECOND]"/></Arc></PartDraw>
     <Group marker pivot centre><Transform target="angle" value="6*[SECOND]"/> Ellipse r3.3 at (225,33); Line 225,23 -> 225,18 </Group>
    </Group>
   </Group>
  </Group>
  <Group name="lip"> <Variant AMBIENT alpha 0 startOffset 0.33 duration 0.57/>
   <PartDraw day_arc><Arc centerX="225" centerY="225" width="430" height="430" startAngle="96" endAngle="256">
     <Stroke color="#80E0B35A" thickness="3"/>
     <Transform target="startAngle" value="172 + 0.25*(9.87*sin(2*rad(0.9863*([DAY_OF_YEAR]-81))) - 7.53*cos(rad(0.9863*([DAY_OF_YEAR]-81))) - 1.5*sin(rad(0.9863*([DAY_OF_YEAR]-81)))) - 15*(6.08 + 1.30*cos(rad(([DAY_OF_YEAR]-172)*0.9856)))"/>
     <Transform target="endAngle"   value="172 + 0.25*(...same EoT...) + 15*(6.08 + 1.30*cos(rad(([DAY_OF_YEAR]-172)*0.9856)))"/>
   </Arc></PartDraw>
   <Group sun pivot centre><Transform target="angle" value="360 - 15*[HOUR_0_23_MINUTE]"/><PartImage sun 16x16 at (217,2)/></Group>
   <Group moon pivot centre><Transform target="angle" value="360 - 15*[HOUR_0_23_MINUTE] + 12.19*[MOON_PHASE_POSITION]"/>
     <Condition [MOON_PHASE_TYPE] -> moon_0..7 14x14 at (218,4)/></Group>
  </Group>
  <PartImage name="dragon" 160x122 at (145,21)><Variant AMBIENT alpha 0 startOffset 0.4 duration 0.6/></PartImage>
 </Scene>
</WatchFace>
```

Notes:
- **LST expression** (year-free, float32-safe; largest intermediate ~10^4, ulp 0.001 deg; valid 2001–2099): verified 177.42 deg at 2026-10-25 10:08 KST against an independent JD computation. The `- 9` is KST and 126.98 is Seoul: the face is hard-wired to its owner's sky; `[TIMEZONE_OFFSET]` is a string and is not used.
- **Variant / Transform separation**: every element that needs both an ambient alpha and an expression-driven attribute is split into a wrapper Group (Variant) and an inner node (Transform): vault, ring, sun, moon. No node carries a Variant and a Transform on the same attribute.
- **Sleeping ring** lives in the ambient stack, outside any rotating group: in ambient it is drawn at 0 deg, always.
- **Ambient digits** use the same font with `Outline`; no BitmapFont, no metric matching.
- **Date** via `Upper` + `Template` with `[DAY_Z] [MONTH_S] [DAY_OF_WEEK_S]`; `letterSpacing="0.1"` em.
- **Occluders in both stacks**: the well rectangle exists in the active stack (unconditioned, both modes) and in the ambient stack; the black annulus exists in the ambient stack (the active ring PNG is its own occluder).
- **Memory** (RGBA at design scale; x1.14 if the evaluator rescales to 480): vault 632^2 = 1.60 MB, ring 0.81, haze 0.81, plate 0.14, dragon 0.08 + 0.07, sprites 0.03, fonts ~0.2 — **interactive ~3.7 MB (v1: 6.5)**. Ambient-visible bitmaps: dragon_ambient, 17 sprites, fonts — **~0.3 MB**; if the evaluator charges alpha-0 images or three full-screen layers, worst case ~3.7 MB. All under 10 MB in every model; run `memory-footprint.jar --schema-version 4` on the APK before quoting.
- **Bake script rules**: one light vector (+1, +1) per level for every shadow; star cores >= 2.0 px, lines >= 1.4 px at >= 35 %, Milky Way peak >= 5.9 %; each z-layer rasterised separately at 450 (632 for the vault) so the port uses the pixels the user approved.

---

## 7. Risks

1. **Off-canvas pivot.** A 632 px Group at (-91, -231) pivoting on P is schema-legal but untested on the Samsung runtime. Step 0 of the build is a two-image validator/device test. Fallbacks in order: (a) `PartImage 450x450 pivotX 0.5 pivotY 0.189` whose child image overflows the bounds; (b) pole at the dial centre with k = 103 (the sky still turns sidereally, but stops being horizon-true; the ring is then no longer the horizon).
2. **Transition semantics.** `duration` / `startOffset` are fractions of a device-chosen transition; if Samsung's transition is much longer than 360 ms the staggered wake will feel slow, if shorter the stagger collapses. Tune the fractions on the device; the stagger order is the design, not the milliseconds.
3. **Flatness through inconsistent light.** One wrong gradient collapses the stack. The bake script computes every shadow from the one light vector; the luminance histogram check (Appendix C) must show the five value bands as five separate modes.
4. **Lip clutter.** Sun (r 215, gold), moon (r 214, grey), seconds marker (r 192, phosphor) share the band; different radii and hues separate them. The ambient moon is the first thing to drop if a new-moon sprite next to the sun reads as a smudge.
5. **Physical bezel.** The Watch6 Classic's rotating bezel may hide the outermost pixels; the sun's glow reaches r 222.5. Verify the visible radius on the device; fallback: `scaleX/scaleY 0.975` on the lip group about the centre (sun to r 209.6).
6. **Memory and OPR are estimates** until the memory-footprint tool and a 480 px non-zero-pixel count are run.
7. **Sky recognisability.** With 1.4 px lines at 35 % and 2–3 px stars the main asterisms should read; if the Dipper does not read through the dragon's ink, move the frame 10 px left (the body's spiral has a ~20 px clear gap) before touching the sky.
8. **AOD brightness clamp.** Samsung dims AOD; `#91AD80` outlines may lose contrast. Keep 1.4 px; lift to `#A3BF92` if needed; never thinner.
9. **Wake reconcile.** The <= 2 px jump between drifted outline glyphs and fixed filled glyphs is inside the crossfade; if it is visible on the device, drop the drift radius to 1 px (not the drift itself).
10. **Seconds at 1 Hz** is deliberate; a sweep would cost more than everything else combined and is refused.
11. **Planets** are baked per year; a stale bake puts Jupiter a few degrees off — texture-level error, but regenerate yearly.
12. **Symmetric sleep.** The ring un-rotating on sleep is honest WFF behaviour; the studio's 180 ms reverse must not be sold as the watch's.
13. **Stars shown by day.** No daytime dimming: the face shows the sky above Seoul regardless of daylight (so does the Galaxia). The sun on the lit arc is the day signal; stage 2's sun-on-ecliptic makes it explicit.

---

## 8. Why it is not flat

v4 was a drawing of space; v5 is an instrument made of five levels, and v2 makes the levels *visible*. The sky is a real planisphere of Seoul in grisaille — a silver Milky Way at six percent over a near-black base, with white stars and faint lines — turning once per sidereal day around a pole that sits under the dragon's spiral, inside the visible disc, so the Dipper and Cassiopeia really do wheel through the gaps in the official mark; the ring you see around it is the horizon, and the sky goes under it the way the Galaxia's celestial disc goes under its flange. Above the sky floats a dark plate with a lit bevel, carrying the date and the big fixed digits and throwing a soft shadow onto the stars below and to its right; sky shows on all four sides of it, rising stars in the left column, setting stars in the right. The flange is lit from 10:30 and dark at 4:30, with an 18 percent rim that casts its own shadow onto the sky; the seconds step round it; on its outer lip a gold sun rides counter-clockwise once a day — on the lit arc by day, on the dark enamel by night, hidden under the dragon's wing at midnight — and the moon follows by its phase. Below the sky, through a plain cut whose lip glints, battery and steps stand in white on the black floor. Five levels, four clocks, one light. And it stays KALI: official dragon on top, phosphor hierarchy, monospace digits that never move, a terminal prompt, INFINITY.

---

## 9. How much Galaxia survives

| Galaxia element | v2 | Notes |
|---|---|---|
| Deepest level with white inscriptions | yes | the well |
| Grisaille celestial disc under a flange | yes | Milky Way / nebulosity at 2.5–5.9 %, horizon = flange inner edge |
| Real sidereal vault from a fixed latitude | yes | Seoul 37.57 N; pole inside the disc |
| Bright object orbiting slowly | partial | gold sun (24 h) + seconds probe (1 min); sidereal-orbit sun only as stage 2 |
| Lit flange rings | yes (one, lit) | chamfer 6.8 -> 0.9 %, rim 18 % |
| Sun pointer with 24 h solar time | yes | counter-clockwise, EoT-corrected day arc |
| Zodiac month | no | ecliptic kept as texture; zodiac ticks removed (unreadable at 40 mm, not information) |
| Planets painted on the disc | yes | Jupiter, Saturn, shaded, real positions per year |
| Dauphine hands | no | fixed digits (hard constraint) |
| Dragon edition | yes | official Kali dragon on top of the stack, wings on the flange |

Seven of ten ideas survive; legibility is strictly better than v4 (digits on an opaque plate at >= 8.9:1, six-digit steps inside the safe radius, AOD ~5.6 % strict / ~7 % measured vs 11.3 %).

---

## 10. Change log vs v1

Geometry
- Pole moved from (225, 47) to (225, 85); k 137.2 -> 107.7; horizon now the flange inner edge (r 176.6) instead of the dial edge; chart radius 294 -> 316 (PNG 588 -> 632).
- Chart placement formula corrected: `x = 225 - r sin(RA)` (was `+`; mirror image). Handedness assertion added.
- Bridge (x 44..406, y 172..278, under the ring) -> floating plate x 92..358, y 166..266, corner r 18, sky on four sides.
- Well: sector-limited segment with slivers -> plain segment y >= 292; now vector (rect + line), zero bitmap.
- Dragon frame (150, 14) -> (150, 26); the "8 px clear of the edge" claim withdrawn; wings-on-flange is a named occlusion.
- Zenith cross-hair dropped.

Orientation and astronomy
- Lip: noon at 12 o'clock, clockwise -> midnight at 12 o'clock, counter-clockwise (`360 - 15 * HOUR`), consistent with the vault; day arc centre 7.95 deg -> `172.0 + 0.25 * EoT`; arc now always within 57–287 deg (wrap risk gone); noon-behind-dragon collision replaced by midnight-behind-dragon.
- Equation of time added. Moon motion restated (15 deg/h + 12.19 deg daily step).
- Sidereal expression: `[YEAR]`-based year-free form replaces both the 2026 constant and the `[UTC_TIMESTAMP]` form.
- Daytime vault dimming removed entirely.
- Jupiter and Saturn added to the vault bake. Zodiac ticks removed; ecliptic labelled texture.

Material
- Mid-tone budget: flange 6.8 -> 0.9 % with an 18.3 % rim (was 1.0 -> 0.4 %, 1 px rim); plate 5.9 -> 2.0 % with a 16.7 % bevel (was 0.3 %); Milky Way 5.9 % peak (was 0.2 %); nebulosity 2.5 %; cut lip 12.2 % (was ~1 %); flange cast shadow on the sky added; zenith glow dropped.
- One light enforced numerically: shadows (+3, +3) for plate and dragon (was (+2, +4) and (0, 2)).
- Bake minima: stars >= 2.0 px cores, lines 1.4 px at 35 % (was 0.8 px at 22 %), ecliptic 1.4 px (was 0.7).
- Dragon glow 6 px 25 % -> 2.5 px 15 %.

Information
- Steps/battery values 26 -> 24 px, columns x 140/310 -> 146/304, baseline 349 -> 343: `99,999` corner r 169.9 (v1: `6,240` already at r 175.4, clipped by the ring).
- Date 15 px baseline 191 -> 188 (8.5 px clear of the digit tops instead of 5.5). `SEC` readout removed. Prompt 11 -> 12 px.
- Sun disc r 4.5 at r 217.5 -> r 5 at r 215 (glow to 222.5); moon 18 px at r 215 -> 14 px at r 214; day arc 35 % -> 50 %.

AOD and WFF
- Drift group now wraps only the ambient twins (active stack never moves); radius 2 px kept.
- Sleeping ring moved out of the rotating group; vector; black annulus occluder added.
- Ambient stars: vector Ellipses inside the drift group (was a 588 px bitmap outside it).
- Ambient plate: black rect + corner brackets (was a full PNG with a 940 px^2 rim).
- Ambient digits: `Font` + `Outline` (was BitmapFont).
- Variant/Transform conflicts removed by wrapper groups; `controls` as a whitespace list; `Upper` + `Template` date; the sleep sequence rewritten as the symmetric reverse; reduced motion confined to the studio.
- AOD estimate 6.9 % -> 5.6 % strict; cut order corrected (brackets/stars first, dragon last).
- Memory: interactive 6.5 -> 3.7 MB; ambient-visible 3.5 -> 0.3 MB.

---

## 11. Rebuttals

Format: critic claim -> accepted / rejected, with the reason and where v2 answers it.

### Critic 1 (depth)
| Claim | Verdict | Reason / where |
|---|---|---|
| Every material cue is at 0.3–2 % luminance; chiaroscuro without the chiaro | **Accepted** | Correct and the most important critique. Section 2 value bands, section 3 mid-tone rule; flange 6.8/18.3 %, plate 5.9/16.7 %, Milky Way 5.9 %, cut lip 12.2 %. |
| Vault 84–88 % occluded; the SE/SW flanks are ~300 px^2 slivers; "Orion rises in the flank" is false | **Accepted** | Floating plate + plain segment: open sky 28 % of the dial, side columns ~4 000 px^2 each. The Orion-in-the-flank sentence is withdrawn. |
| "Dial edge = horizon" is invisible in practice | **Accepted** | The horizon is now the flange's inner edge (r 176.6) — visible as the construction, not as a line. |
| The memorable idea is under the dragon; circumpolar sky under the ring or the ink | **Accepted in substance** | Pole moved inside the disc: circumpolar circle r <= 40 at y 45–125, inside the frame. Glow cut to 2.5 px / 15 %. Stars 2.4–3.0 px with 35 % lines. |
| The dragon is an opaque 96 % silhouette | **Rejected** | The official mark is ~9 % ink in its frame (Critic 2's measurement on the v4 ambient preview); 91 % of the frame is open. The glow was the occluder, not the fill. |
| Render the dragon as a stroke, not a fill | **Rejected** | A stroke-only Kali dragon is a different mark; the brief keeps the official path and the fill *is* the mark. The ink gaps already let the sky through. |
| "8 px clear of the dial edge" is wrong; corners at r 223.9; sun vanishes behind the dragon at noon | **Accepted** | Arithmetic error conceded. Frame now (150, 26), corners r 212.7, wings-on-flange named as an occlusion; the orientation flip puts the sun behind the dragon at *midnight*, below the horizon. |
| Half of it is v4 verbatim | **Partly rejected** | HH:MM, dragon, phosphor, INFINITY, 360 ms wake are hard constraints and prior decisions, not laziness. Accepted that what is new must be visible, hence the mid-tones. |
| 49 px ring is "bezel on bezel" | **Rejected as a width, accepted as a rendering** | The Galaxia gives ~25 % of its dial to flanges and a sunken hour ring; the flange carries three clocks here. It needed to be lit, and now is. |
| STEPS leaves the safe radius, clipped at five digits | **Accepted** | 24 px, x 146/304, baseline 343; `99,999` corner r 169.9. |
| Drift leaks into Active; no ambient source to gate it | **Accepted** | Drift group wraps the ambient twins only. |
| Daytime dimming hurts the demo and the outdoor state | **Accepted** | Removed. |
| Type shrink across the board | **Partly accepted** | Date back to 15 px; prompt 12 px; values 24 px are required by the r 171 rule for six-digit counts — the information is the point, so the overflow fix wins. |
| Moon 14.49 deg/h is wrong as mapped | **Accepted** | 15 deg/h with a daily 12.19 deg step. |
| Solar noon ignores the equation of time | **Accepted** | EoT term added. |
| Shadow (+2, +4) is not a 10:30 light | **Accepted** | (+3, +3) per level. |
| Fix 3: 65–70 % smoked glass with stars visible through the digit plate | **Rejected** | The legibility lens keeps the plate 100 % opaque under the digits (Critic 2 concurs: "keep the 100 % core exactly"). The through-the-plate cue is replaced by sky on four sides, a lit bevel and a shadow on a visible sky. |
| Fix 9: sun r 6 with 4 px glow, day arc 50 % | **Partly accepted** | Day arc 50 %; sun r 5 with 2.5 px glow because of the bezel clearance (Critic 2 fix 8). |
| Fix 10: prove the off-canvas vault first | **Accepted** | Step 0 of the build; fallbacks listed in risk 1. |
| Fix 11: Jupiter and Saturn as shaded sprites | **Accepted** | Baked per year. |
| Dragon is the largest AOD contributor; cut it first | **Accepted as corrected by Critic 2** | Outline digits are the largest; cut order rewritten. |

### Critic 2 (readability)
| Claim | Verdict | Reason / where |
|---|---|---|
| F1 STEPS clipped by the flange | **Accepted** | As above; checked with `99,999` and `100%`. |
| F2 HH:MM moves in Active | **Accepted** | Ambient-only drift group (fix 2 adopted as the structure). |
| F3 sleeping ring drawn 14 deg off in AOD | **Accepted** | Ambient ring in the ambient stack, outside the rotating group, as vectors. |
| F4 Transform-alpha and Variant-alpha on one PartImage | **Accepted** | Dimming removed; wrapper-group pattern used wherever a Variant and a Transform meet. |
| The sky is one window, not three; flanks 652 px^2 | **Accepted** | Recomposed; census in Appendix C. |
| The plate is crowded (5.5 px date-to-digit) | **Accepted** | Plate y 166–266, date baseline 188 (8.5 px), SEC removed. |
| Fix 6: AOD ring body opaque black | **Accepted** | Black annulus PartDraw in the ambient stack. |
| Fix 7: TimeText vs BitmapFont baseline risk | **Accepted, resolved differently** | Same font with `Outline` (Critic 3's suggestion): identical metrics by construction. |
| Fix 8: lip clearance | **Accepted** | Sun disc max r 220 (glow 222.5), moon 14 px max r 221; device check in risk 5. |
| Fix 9: EoT | **Accepted** | Formula adopted; 25 Oct gives 06:55 / 17:37. |
| Fix 10: remove "zodiac: partial" | **Accepted** | Zodiac ticks removed; ecliptic is texture; section 9 says "no". |
| Fix 11: ambient vault in the drift group or dropped | **Accepted** | 24 vector stars inside the drift group, zero memory. |
| Fix 12: measure OPR at 480 the Samsung way | **Accepted** | Appendix C. |
| Fix 13: document the KST / Seoul constants | **Accepted** | Section 6 note. |
| Moon phase unreadable at 18 px | **Accepted** | Moon is a position marker; phase is texture; 14 px. |
| Dragon ink is 8.6 %, digits and rim are the largest AOD items | **Accepted** | Budget table rebuilt; the plate rim is gone from AOD (brackets instead). |
| Drift radius 3 px | **Rejected** | 2 px kept: the wake reconcile jump equals the drift radius, and 2 design px is ~2 device px, inside the crossfade. |
| Keep the 100 % opaque core | **Accepted** | Whole plate opaque. |

### Critic 3 (feasibility)
| Claim | Verdict | Reason / where |
|---|---|---|
| Asymmetric sleep choreography and "no rotation on sleep" are unbuildable | **Accepted** | Section 4: the watch plays the symmetric reverse; studio reverse labelled studio-only. |
| Sleeping ring inside the rotating group | **Accepted** | Moved out, vector. |
| Transform + Variant on the same attribute | **Accepted** | Wrapper groups everywhere. |
| `controls` must be a whitespace list | **Accepted** | `controls="0.22 1 0.36 1"`. |
| Date colour tween impossible on `Font` | **Accepted** | Two PartTexts crossfade. |
| Reduced motion does not exist in WFF | **Accepted** | Studio only. |
| BitmapFont unnecessary and mis-sized; use `Outline` | **Accepted** | Done. |
| `Upper` + `Template` for the date | **Accepted** | Done. |
| Star chart mirror-imaged (Appendix A sign) | **Accepted** | `x = 225 - r sin(RA)`; handedness assertion added. |
| Lip and vault disagree about noon; put midnight at 12 o'clock | **Accepted in principle, sign rejected** | Midnight at 12 o'clock, yes. But `15 * HOUR` runs clockwise and puts 06:00 on the right — the vault's west. The sun must run counter-clockwise: `360 - 15 * HOUR` (06:00 left, noon bottom, 18:00 right), moon `+ 12.19 * MOON_PHASE_POSITION`. |
| `[YEAR]`-based LST expression | **Accepted** | Verified 177.42 deg at the preview time; replaces both v1 forms. |
| Daylight dimming as a 30-min lerp | **Moot** | Dimming removed. |
| Bake sizes: 2 px cores, 1.4 px lines at 35 %, Milky Way >= 8 % | **Accepted (5.9 % for the band)** | 5.9 % peak keeps the band below the plate face so the plate still reads as the higher level; the nebulosity adds a second grisaille tone. |
| Minute-by-minute shimmer of sub-2 px dots | **Accepted** | Fixed by the bake minima. |
| Studio over-promises (ms timing, colour tweens, masks) | **Accepted** | Fractions model, crossfades, per-layer PNG export. |
| Memory arithmetic was not how the tool counts | **Accepted** | Recounted both ways; v2 interactive ~3.7 MB, ambient-visible ~0.3 MB, worst case ~3.7 MB. |
| Drift group exposes a black crescent at the dial edge in Active | **Moot** | The active stack is outside the drift group; the ambient ring is arcs at r 192. |
| Delete SEC; date baseline 184 | **Accepted (SEC); adjusted (date)** | Date baseline 188 with the plate top at 166. |
| Dragon shadow (0, 2) breaks the one-light rule | **Accepted** | (+3, +3). |
| Dragon over the ring: keep as an occlusion cue, marker fully behind | **Accepted** | Glow reduced so ink, not glow, hides the marker. |
| Lip radius vs the Classic bezel | **Accepted** | Device check; scale fallback. |
| Value range of the materials is 2–5 % — fatal | **Accepted** | Same as Critic 1's first point; fixed. |
| Run validator + memory tool on the real APK | **Accepted** | Appendix C. |

---

## Appendix A — Star catalogue (J2000, mag <= 2.5, dec >= -40, plus asterism members; unchanged data, corrected placement)

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

Line sets: Orion (Betelgeuse–Bellatrix–Mintaka–Alnilam–Alnitak–Saiph–Rigel), Big Dipper (Dubhe–Merak–Phecda–Megrez–Alioth–Mizar–Alkaid), Cassiopeia (Caph–Schedar–Gamma Cas–Ruchbah), Northern Cross (Deneb–Sadr–Albireo, Sadr wings), Summer Triangle (Vega–Deneb–Altair, dotted), Leo sickle (Regulus–Algieba–Denebola), Scorpius (Dschubba–Antares–Shaula), Pegasus square (Markab–Scheat–Alpheratz–Algenib), Gemini (Castor–Pollux–Alhena), Taurus (Aldebaran–Elnath), Perseus (Mirfak–Algol), Bootes (Arcturus–Alphecca hint).

Placement in the 632 chart (origin = P at (316, 316)): `x = 316 - r sin(RA * 15 deg)`, `y = 316 + r cos(RA * 15 deg)`, `r = 107.7 tan((90 - dec)/2)`. Ambient subset (24): the 24 brightest of the table.

## Appendix B — Sanity check at the preview time

2026-10-25 10:08 KST, day 298. LST (year-free expression) = 177.42 deg; vault angle 182.58 deg (= -177.42). Meridian RA 11 h 50 m: Denebola culminating at the bottom under the plate, Leo setting into the right column; the Dipper (RA ~12.5 h) at upper culmination between P and the zenith, y 112–125, through the dragon's body; Cassiopeia at lower culmination at y ~55, inside the disc, in the dragon's head/wing; Arcturus at (179, 147) rising in the band left of centre; Jupiter at (274, 148) right of centre. Sun lip angle 208.0 deg (lower-left, on the day arc 95.8–256.3: morning); day arc gives sunrise 06:55 / sunset 17:37. Moon day 15 (nearly full): 208 + 182.9 = 30.9 deg, upper right on the dark lip — set about three hours earlier, as a full moon should have. Everything on the lip is where the real sky puts it, and the lip and the vault now agree on which side is east.

## Appendix C — Verification plan (before any WFF work is trusted)

1. Validator + device test of the 632 px off-canvas pivot group (two images: a grid with P marked; the real vault). Fallbacks in risk 1.
2. Handedness assertion in the studio tests (Orion at culmination; Dipper handle trailing the bowl counter-clockwise).
3. Luminance histogram of the Active studio render downscaled to 40 mm: five separate modes (0 %, 0.2–6 % sky, 2–6 % plate, 1–7 % flange, 74 % phosphor / 91 % paper) and every lit edge >= 12 %.
4. Pixel census of open sky (target >= 27 % of the dial) and of every information string's far corner (<= r 171) with `99,999` / `100%` / `12:38`.
5. AOD frame baked at 480 px, non-zero-pixel count (Samsung OPR); target <= 8 %, limit 15 %.
6. `memory-footprint.jar --schema-version 4 --ambient-limit-mb 10 --active-limit-mb 100` on the APK.
7. Wake on the device: stagger order visible, ring rotation present, reconcile jump invisible; sleep acceptable as the symmetric reverse.
8. Bezel: photograph the lip at 12 / 3 / 6 / 9 with the sun forced to each; apply the 0.975 scale fallback if any pixel is hidden.

Sources: JLC press material for the Master Hybris Artistica Calibre 945 (multi-level dial, deepest level with white transferred inscriptions, grisaille star map, Cosmotourbillon once per sidereal day); Watchonista / Wristreview coverage of Galaxia and the 2024 Dragon edition; Android Watch Face Format references (source types, arithmetic expressions, Variant, Transform, Arc, Group, PartImage, DigitalClock/TimeText, Font/Outline, memory-usage guide) and the google/watchface XSDs; Samsung Watch Face Studio always-on guidance (15 % OPR).
