# KALIWATCH v5 "Celestial Vault": design system (reference round 5)

v4 "Orbital Observatory" was rejected as one-dimensional: one flat dark plane with thin rings drawn on it. v5 rebuilds the face as a stack of physical levels, each carrying its own real time-scale, after the user's main reference: the Jaeger-LeCoultre Master Hybris Artistica Calibre 945 **Galaxia** (analysis in [REFERENCES.md](REFERENCES.md)).

What stays from KALI, untouched: the official dragon (press-pack path, sha256 `7f1dffb8…`, never redrawn or flipped), phosphor `#A6F46A` as the identity, the word INFINITY in the terminal prompt, a big fixed HH:MM in Roboto Mono, and a quiet always-on mode with a stylish wake.

## Three compositions

| Key | Name | Source | Status |
|---|---|---|---|
| `vault5` | G3 Debate vault | [debate/07-final-spec-v2.md](debate/07-final-spec-v2.md), the result of the seven-lens debate | **chosen by the owner (2026-10-26)**; round 5; all measured gates pass. Next round: [CODEX-HANDOFF.md](CODEX-HANDOFF.md) |
| `galaxia` | G1 Galaxia | this document | round 3 |
| `galaxia-mirror` | G2 Galaxia mirrored | this document | round 3 |

G3's full specification (layer stack, tokens, motion, AOD, gates, WFF port) is 07 itself. Its round-4 tuning and gaps are in [REFERENCES.md](REFERENCES.md). The rest of this document describes G1 and G2. The rules both share are:
- one accent metal (anodised phosphor), gold only for the Sun;
- grisaille for everything else;
- the official dragon unchanged;
- HH:MM fixed;
- an AOD lit share well under 15 %.

G3 differs from G1/G2 in these ways:
- The pole sits under the dragon's arch and the sky uses a stereographic projection, so the horizon is a circle and the eccentric layer is the grey crescent beyond it.
- A Moon globe replaces the gas giant. The real Jupiter and Saturn are drawn small.
- One sunken sub-disc carries steps and battery.
- The Cosmotourbillon analogue is a rotor that orbits the dial once per sidereal day.

## The one idea

Galaxia uses one warm metal for every structural part. KALIWATCH uses **anodised phosphor** the same way: the eccentric sky-plate edge, the sentinel bezel and cage, the 24 h batons and the hour pointer are all one green metal. Everything else is grisaille (white, greys and black). Gold is spent on the Sun alone: the sun-star, the true Sun on the ecliptic, and the sunrise/sunset ticks.

## Layer stack (back to front)

| z | Layer | Shows | Time-scale | Geometry (450 design px) | Active | Always-on |
|---|---|---|---|---|---|---|
| 1 | bed | lacquer with aventurine flecks, seen in the crescent between plate and rings | static | disc r ≤ 181 | on | off |
| 2 | sky | the real Seoul sky: 366 catalogue stars to mag 5.2, 33 constellation figures (Draco traced in phosphor), painted Milky Way with the Great Rift, ecliptic, the true Sun | sidereal day (rotates about the pole, angle = −LST) | equidistant planisphere, 1.4 px/deg, pole at S = (229, 231), clipped to r 168 | on | stars brighter than mag 2.2 only, 1 px dim dots |
| 2b | sky names | constellation and zodiac names, kept upright | anchors turn with the sky | 5.4–5.8 px, quietened inside the calm field | on | off |
| 3 | dome | fixed glass above the sky: glaze, painted grisaille gas giant cut by the plate edge, the Moon at its real phase, dome vignette | lunation (Moon) | planet c (344.8, 131.4) r 50; Moon c (348.6, 290.7) r 21 | on | planet limb arc, dim Moon phase |
| 4 | frame | the eccentric anodised-phosphor edge of the sky plate, with cast shadow and inner occlusion | static (depth) | circle S r 168, 2.6 px; offset 7 px from the dial centre, so the crescent gap runs 5–19 px | on | 1 px dim ring (keeps the eccentric idea) |
| 5 | sentinel | sunken sub-dial through the plate: phosphor bezel, black sunray floor, 60-tick seconds track | seconds | c (99.4, 297.5) r 32, crosses the plate edge | on | bezel outline + jewel dot |
| 5b | cage | three tapered phosphor arms, balance ring, jewel, radar sweep trailing the lead arm | once a minute | rotates about the sentinel centre | on | off |
| 6 | calendar | black month ring, white month names, day ticks (10th/20th long), white rules | year | annulus r 180–201 | on | two hairline rules |
| 6b | sun-star | gold 8-point star and needle on today's date | year | on the inner rule, angle = day-of-year / days × 360 | on | gold outline |
| 7 | flange | 24 h ring: radial guilloché, tonight's real night sector, phosphor batons at odd hours, white even hours, gold sunrise/sunset ticks | civil 24 h, noon at 12 | annulus r 201.6–225 | on | even-hour numerals, dim |
| 7b | hour | anodised triangular pointer on the inner edge of the flange | civil 24 h | tip r 211, base r 202.2 | on | outline |
| 8 | dragon | official mark in phosphor relief (shade, light, body, glow) and its cast shadow | static | x 147, y 38, scale 1.25 | on | 1.15 px outline |
| 9 | text | date, HH:MM (+ shadow), BAT / STP, `kali@vault:~$ INFINITY` | minute | see below | on | outline digits, date, battery, INFINITY |

G2 ("mirrored") swaps planet, Moon, sentinel and sky-plate offset left to right (the photo's own arrangement: big sphere at 10 under the dragon's wings). The dragon is never flipped.

## Composition

- HH:MM: Roboto Mono 600, 78 px, digits at x 166 / 225 / 284, baseline 252 (colon 4 px higher, phosphor). Fixed. It never moves or scales in any transition; `npm run verify` checks this.
- Date: 16 px at y 180. Telemetry: 11.5 px at y 284 (labels muted, values paper). Prompt: 11.5 px at y 306.
- Legibility device: a feathered calm field (ellipse c (225, 234), rx 176, ry 94, black 0.8 → 0.62 → 0) sits over the stars but under the painted planet and Moon. Star names inside it drop to 25% opacity.
- Safe text radius: all information text sits inside r 150; the rings carry only ring-native type (hour numerals 10 px, month names 7.4 px).

## Tokens

| Token | Hex | Role |
|---|---|---|
| phosphor | `#A6F46A` | identity, colon, prompt word, metal body |
| phosphorLight / phosphorShade | `#D2FFA4` / `#4E7F34` | metal highlights and shade |
| anodised gradient | `#DFFFC0 → #8FD45A → #3C6428 → #1F3516 → #5E9A3C → #9EE06A → #2A4520` | every structural edge: mostly shade with two specular bands |
| paper | `#EFF8EC` | digits, ring numerals, month names |
| grisaille | `#C9D6D2` | stars, lines, rules, painted bodies |
| quiet / muted | `#9BAB9C` / `#6E8279` | date, labels |
| gold | `#E2B15A` (light `#F6D79A`, deep `#7A5A22`) | the Sun and nothing else |
| enamel | `#0C1716 → #030707` | sky ground |
| AOD | digits stroke `#91AD80`, dragon `#5E7A52`, quiet `#7F9472`, stars `#56685F`, lines `#2C3A31` | always-on palette |

Type: Roboto Mono (OFL, bundled) for everything on the dial. One key light from 10:30 (azimuth 315°, elevation 35°) for every bake: highlights up-left, shadows down-right.

## Motion

Wake (always-on → active) lasts 360 ms and lights the stack back to front. Sleep lasts 180 ms and runs front to back. Easing everywhere is cubic-bezier(.22, 1, .36, 1). With reduced motion on, both switch instantly.

| Layer | Wake window (ms) | Property |
|---|---|---|
| bed | 0–160 | opacity |
| sky | 0–240 | opacity, rotation −4° → 0 about the pole |
| dome | 40–260 | opacity, scale 0.985 → 1 about S |
| frame | 60–240 | opacity |
| sentinel | 80–260 | opacity |
| cage | 100–360 | opacity, spins up −150° → true seconds angle |
| calendar | 40–320 | opacity, rotation −8° → 0 |
| flange | 100–300 | opacity, scale 0.994 → 1 |
| hour / sun-star | 220–360 / 240–360 | opacity |
| dragon / shadow | 100–320 / 180–350 | opacity; the shadow slides (−2, −3) → 0 as if the mark lifts off the dial |
| digits | 120–320 | opacity only (always-on outline digits fade out 100–260) |
| telemetry | 200–360 | opacity |

Continuous motion in active mode: the sky turns with sidereal time (0.25°/min), the cage turns once a minute, the hour pointer once a day, and the sun-star once a year. Nothing loops or twinkles. Always-on has no per-second motion.

## Always-on budget

Measured lit share inside the dial (pixel channel > 8 / 255): **9.2%** from a 2× Chrome render (`tools/lit_pixels.py`) and **11.2%** at 1× in the studio's canvas meter, where antialiasing spreads thin lines over more pixels. Both are under the 15% limit. The near-full Moon (25 Oct) is the largest single lit area, so it is drawn at `#2E3833`. Burn-in: the AOD contains no filled bright areas larger than the Moon, and the flange numerals and rings are hairline and dim.

## Real vs decorative (what the user is told)

| Real, computed for Seoul (37.5665 N, 126.978 E) | Decorative (painted enamel) |
|---|---|
| star positions, constellation figures, Milky Way path, ecliptic, the Sun's position, local sidereal time | the gas giant, 900 star-dust specks, Milky Way cloud texture |
| Moon phase and age; sunrise/sunset (night sector); day of year (sun-star); civil 24 h (pointer) | the Moon's position on the dome (a phase display, like Galaxia's painted Moon) |

The astronomy is verified by `tools/test-astro.cjs` (21 checks, including KASI sunrise/sunset). The star catalogue is verified by `tools/check-stars.cjs`; evidence is in `docs/evidence/`.

## Open decisions

1. G3 (the debate's composition), G1 (planet behind the dragon's head) or G2 (the photo's arrangement, planet under the wings).
2. Whether the sentinel should orbit the dial once per sidereal day, like the real Cosmotourbillon. It is fixed in round 3 because an orbit crosses the digits twice a day.
