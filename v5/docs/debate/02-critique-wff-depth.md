# Critique 02 — v5 "Celestial Vault" (WFF lens) vs the real Galaxia

Reviewer role: adversarial design director. Reference frame: JLC Master Hybris Artistica Calibre 945 "Galaxia" press text (press.jaeger-lecoultre.com), the v4 studio source (`face.js`, `celestial.js`, `tokens.js`, previews) and the WFF v4 reference + the official XSDs in google/watchface. Numbers below were recomputed, not copied.

## Score: 4 / 10

**Verdict.** On paper this is a stack. On the glass it is v4 with a dark ring around it. The XML builds (almost everything claimed is verified), the astronomy is right, the choreography is right, but every plane except the digits and the dragon lives between 0.3 % and 7 % luminance, so the shadows, lips and bevels that are supposed to separate the planes land on black and vanish. The deepest plane survives as 23 % of the dial in slivers, the one bright orbiting object is underground 16 hours a day, and the layout grid is v4's grid to the pixel. The user will look at it and say "same thing, with a ring".

---

## 1. Is it still one-dimensional?

**Yes, as perceived. No, as specified.** The proposal passes the brief's checklist (three planes, three clocks, baked shading) and fails the brief's intent ("the eye reads a stack, not a flat print"). Five reasons, each measured.

### 1.1 There is no light for the shadows to fall on

Relative luminance (sRGB -> linear, WCAG formula) of the proposed surfaces:

| surface | hex | Y |
|---|---|---|
| sky base | `#050B0F` | 0.3 % |
| vault floor | `#0B1512` | 0.7 % |
| enamel teal (Milky Way, dayglow, extinction) | `#0E2A33` | 2.0 % |
| tick track | `#17291D` | 1.9 % |
| rim bevel highlight (the brightest point of the "chiaroscuro") | `#2E4A44` | 5.9 % |
| rim bevel shade | `#0B1512` | 0.7 % |
| plate top-edge highlight at 45 % | `#3A5247` x 0.45 | ~2.5 % effective |
| hour plate | black 80 % | ~0 % |
| ground | `#000000` | 0 % |
| starlight | `#C3D3DA` | 63 % |
| phosphor | `#A6F46A` | 74 % |
| digits | `#EFF8EC` | 92 % |
| solar gold | `#D9A441` | 42 % |

Everything that is supposed to *receive* an occlusion shadow (sky, floor, plate, ground) is at 0-2 % Y. A 55-60 % black shadow cast onto 0.3-2 % Y produces a luminance delta of 0.2-1.2 %. On an AMOLED at 40 mm that is not a shadow, it is black on black. Concretely:

- The digit `Shadow` (`#A6000000`, offset 3, radius 6) falls on an 80 % black plate: invisible. The one cue that the digits "float above the plate" does not exist.
- The plate's baked drop shadow (0,+5, blur 12, 55 %) falls on `#050B0F` sky: invisible except where it crosses a 1-2 px star.
- The rim's inner lip shadow (`#99000000`, 5 px) falls on the `#050B0F` sky edge: invisible.
- The bevel runs from 5.9 % to 0.7 % Y over 10 px (0.9 mm on the wrist). That is a faint dark ring, not a step.

The proposal itself names this failure mode in Risk 3 ("if the shadows are baked too soft the stack collapses") and then specifies surfaces on which no shadow can ever be visible. The Galaxia works for the opposite reason: the dome (gold outer section, grey grisaille disc) and the opaline 24 h / minute rings are the *bright* objects, and the black lacquer floor is "visible around the dome's edge and beneath the tourbillon" only. Bright stacked on dark reads as depth. Dark stacked on dark reads as a print. Chiaroscuro means light *and* dark; v5 brought only the dark half.

### 1.2 The deepest plane is mostly hidden

Grid count over the 450 dial (159,068 px):

| region | px | share |
|---|---|---|
| aperture r186 | 108,720 | 68 % of dial |
| sky above the horizon inside the aperture | 67,098 | 42 % of dial |
| ground inside the aperture | 41,622 | **38 % of the aperture** |
| sky left after the plate (core 100 %, skirt 50 %) | 43,416 | 27 % |
| sky left after plate + dragon | **~37,000** | **23 % of dial** (proposal claims 36 %) |

Where that 23 % actually is: a 20-32 px band between the dragon's bottom (y140) and the plate's skirt (y160-172); two side wedges 46-58 px wide at y222 (aperture x39 to plate x85/97); the area around the dragon. Below the plate there is **5 px** of sky between the plate skirt (y284) and the horizon (y289.6) at the centre. The sky is gap filler.

Worse: the only part of the sky that never sets, the circumpolar cap (dec > 52.4 deg, r < 64.6 px around the pole), sits entirely under the opaque plate core (rx128 ry50). The design hides the one region that would show "the sky wheels around the pole", which is the concept sentence of the whole proposal.

### 1.3 The ground is v4's black bottom with a hairline

The Galaxia has no horizon mask: the celestial disc shows the whole vault and the Cosmotourbillon makes "a complete, anti-clockwise circuit of the dial". The horizon in v5 is the proposal's own invention. It costs 38 % of the aperture, the moon marker and the probe for most of the day, and what it gives back is exactly v4: `#000000` under BATTERY / STEPS / prompt at the same y312 / y343 / y357 / y389. Calling that region "ground" does not change what it is.

### 1.4 The layout is v4's layout

Dragon y30-140 (v4: y24-147), HH:MM baseline y252 at x166 / x284 (identical), date y282 (v4's SEC slot), BATTERY/STEPS y312/343/357 (identical), prompt y389 (identical), AOD BAT y329 / INFINITY y375 (identical). Two of seven list items removed. The user rejected this grid as "1차원적"; giving it back with a ring of 1.9 %-Y ticks and twenty-odd dim dots in the gaps will be read as the same face. "Muscle memory" is not the user's complaint; flatness is.

### 1.5 The hero object is underground

Probe at RA 0h, dec 0 (r154.8). Orbit count: above the horizon and not behind the dragon bbox for **124 of 360 deg = 8.2 h per sidereal day**. Its transit (the moment it is highest) happens at the top of the dial, under the dragon. At the proposal's own sample (10:08, 25 Oct) it is below the ground, and the proposal's plan view annotates this. In Jun-Sep the probe is below the horizon for the entire working day. The Galaxia's Cosmotourbillon is never hidden; it is the memorable thing *because* it is always somewhere on the dial, crawling. v5 built its memorable thing and buried it.

---

## 2. Three separated depth planes, each with a real time-scale, with material shading?

| plane | specified | perceived |
|---|---|---|
| A sky (sidereal / lunar / solar dayglow) | yes | 23 % visible, 0.3-2 % Y; a few dots and a teal smudge |
| B dome + flanges (24 h solar, minutes) | yes | a 38 px annulus (3.4 mm) of 1 px ticks at 1.9-7.4 % Y; the gold dot and the green arc are the only legible members |
| C plate + digits + dragon (civil) | yes | this is v4 |

Three planes in the XML; about one and a half on the glass. The time scales that would be *seen* are: digits (civil), gold dot (solar), green arc (minutes). The sidereal rotation is 0.84 px/min at r192 on dots at the edge of visibility; nobody will notice the sky moved. Material shading: specified, bakeable, invisible (see 1.1), with one exception: the dragon relief (`#B9FF7A` -> `#7FBF4E`, rim light `#D6FFA8`, 60 % shadow) sits on a bright object and will read.

Dayglow note: `SCREEN` of `#0E2A33` at 55 % over `#050B0F` yields RGB (13,33,41). Screen only brightens; it cannot "wash out" a (195,211,218) star. During the day the user gets full-contrast stars plus a dirty teal patch top-right. That is neither a day sky nor a night sky.

---

## 3. KALI or JLC pastiche?

It reads KALI. Dragon on top, phosphor arc, `kali@vault:~$ INFINITY`, outline digits in AOD. No risk of pastiche; the risk is the opposite: the Galaxia vocabulary (ARI/TAU zodiac at 8 px, 24 RA ticks at 1 px, grisaille bands at 2 % Y, moon glyph at 20 px on a ring nobody sees) is present at sizes the brief itself classes as "decoration only". The user asked for Galaxia's *feeling* (high-dimensional) and gets Galaxia's *footnotes*.

---

## 4. One memorable thing or seven?

Seven competing, none surviving: probe cage (seconds), minute arc, digits, sun pointer, sidereal sky, zodiac reading, moon marker, plus the dragon and the terminal. The one candidate for "the thing", the real sky wheeling under the time with a bright body crawling round it, is exactly what the plate, the dragon and the ground remove.

---

## 5. Technical verification (reference pages and XSDs fetched 2026-10-25)

Verified true:
- `Variant`: `mode=AMBIENT`, `target`, `value`, `duration` 0-1, `startOffset` 0-1, `interpolation` incl. `CUBIC_BEZIER` + `controls`, `angleDirection` (reference page).
- Multiple `Variant` per element: `abstractPartType.xsd` and `groupElement.xsd` declare `Variant minOccurs=0 maxOccurs=unbounded`. The prose on the PartImage page says "once"; the schema wins. Three Variants on `plate` / `dragon_active` are buildable.
- Expressions: ternary `? :`, `%` on floats, `sin cos rad deg clamp floor abs`, `colorRgb` (v4). `sin` links to `Math.sin` (radians), so `sin(rad(x))` is correct.
- `Fill`/`Stroke` `color` transformable from v4; `LinearGradient`/`RadialGradient`/`SweepGradient` are children of both. `dashIntervals`/`dashPhase`/`cap` on `Stroke` (join is v5, unused). Dash maths checks: 2*pi*203/24 = 53.15, 2*pi*218/60 = 22.83, /12 = 114.14.
- `Arc` `startAngle`/`endAngle` transformable, 0 deg = 12 o'clock, exactly one `Stroke`.
- `Font` children `Shadow(color, offsetX, offsetY, radius)`, `Outline(color, width default 2.0)`, `Upper`; `TimeText format="hh"` and `"mm"` are valid per `timeText.xsd` pattern `((h{1,2})\:m{1,2}\:s{1,2}|(h{1,2})\:m{1,2})|(h{1,2})|m{1,2}|s{1,2}`.
- `blendMode` on `PartText/PartImage/PartAnimatedImage/PartDraw`, `SCREEN` included, Wear OS 5.1+.
- Data sources: `HOUR_0_23_MINUTE` float, `DAY_OF_YEAR` 1-366, `YEAR` 1902-2100, `MOON_PHASE_POSITION` 0-28, `MOON_PHASE_TYPE` 0-7, `STEP_GOAL` >= 1000, `TIMEZONE_OFFSET_MINUTES_DST` v3.
- Memory: 10 MB ambient / 100 MB interactive; "up to three full-screen layers, two of which are static"; RGBA 4 B/px after crop/resize; hands/complications last. Ambient lit-pixel guideline 15 %.
- Astronomy: GMST at 2026-01-01 00:00 UT recomputed from J2000 (D = 9496.5 d): 280.46062 + 360.98564737 x 9496.5 mod 360 = 100.66 deg; Seoul constant 92.27 and the timezone-general 227.64 follow. Sample LST 177.4 deg checks. Chirality (RA clockwise on the chart, disc rotates counter-clockwise, east on the right when facing north) is correct. The horizon-as-circle fit is good to ~1.5 px (NE horizon point lands at 219.2 px from (225,71.8) vs r217.8). Sun-pointer convention is consistent with the sky.
- Galaxia facts used by the proposal (multi-level dial, two-section dome, gold dome + gold grisaille celestial disc, star map + constellation names transferred, opaline 24 h inner ring and minute outer ring, enamel-over-guilloche hour ring between them, golden sun pointer for the zodiac month, anti-clockwise Cosmotourbillon per sidereal day, black lacquer-over-opaline floor visible around the dome's edge) all match the press text. Nothing in the press text mentions a horizon mask.

Not verified / overstated by the proposal:
- "WFF v4 Variant animation is symmetric": the reference documents one `duration` per Variant and never states per-direction behaviour. This is an assumption; write it as one.
- Negative shape coordinates inside `PartDraw` and the `SweepGradient` zero-angle convention: undocumented (the proposal flags both; fine).
- Moon `Compare expression="ph" value="4"`: the existing `watchface.xml` only shows the boolean form (`<Expression>[X] == 4</Expression>` + `<Compare expression="name">`). Use that form.
- AOD lit-pixel 4.6 % relies on a `max(R,G,B) > 24` threshold that excludes the `#0C160B` digit fill (~3,700 px). Counting it gives ~7 %. Still inside 15 %, but say so instead of tuning a colour to dodge a threshold.
- `[SECOND]` Transform on `probe_cage` lives inside the sidereal Group that is visible in AOD. Ambient re-evaluation is per minute, so this should be harmless, but confirm on the device that an alpha-0 per-second element inside an ambient-visible group does not wake the renderer.

Memory estimate (~2.4 MB interactive, ~2.9 MB ambient at 480 px) is plausible under the documented model.

---

## FATAL

1. **No luminance for depth.** All receiving surfaces are 0-2 % Y; every occlusion shadow, lip and bevel is a <1.2 % delta and will not be seen. The stack collapses by the proposal's own Risk 3 criterion.
2. **The sky is 23 % of the dial, in slivers, with the circumpolar cap under the plate.** The deepest plane cannot be established, so there is nothing to be "in front of".
3. **The ground hides 38 % of the aperture, the probe (16 h/day) and the moon.** It is not on the Galaxia, it adds no information, and it is v4's black bottom renamed.
4. **The composition is v4's grid** (dragon, HH:MM, date, BATTERY/STEPS, prompt at the same coordinates). The user already rejected this arrangement as flat.
5. **The hero object is absent** when the user looks (underground during the working day half the year; transit hidden by the dragon).

## REQUIRED FIXES

1. **Rebuild the tonal plan around a lit middle plane.** Rule: every occlusion edge needs >= 6 % luminance delta across it, or it does not exist. The dome/flange annulus must be the brightest non-text surface, as the Galaxia's opaline rings are: e.g. rim r186-206 as a sweep from `#55646A` (12 % Y) to `#2A3438` (3 %), opaline minute ring ticks `#8A959A`; sky base raised to `#0B1A22` (1 %) with Milky Way `#1C3A45` (4 %) so the sky reads as a *hole* inside a light ring. The plate becomes a visible sunken well: smoked `#101C18` at 90 % with a 2 px lit upper edge `#5F7A6A` and a 4 px dark lower edge, casting its shadow onto the *light* ring, not onto black.
2. **Remove the ground fill.** Keep at most a 1 px great-circle hairline for the horizon. This restores 41,600 px of sky, the full probe orbit and the moon, and matches the reference.
3. **Expose the pole.** Either shrink the plate to a lens (rx 118, ry 42) at 85 % so stars read through its skirt, or offset the pole to (225,150) so the circumpolar cap (r64.6) is visible between the dragon and the digits and the dragon perches on it. The sky must be the dominant field (> 45 % of the dial), not the gap filler.
4. **Make the bright orbiting object always visible.** Simplest: merge the Cosmotourbillon role into the gold sun on the flange (always visible, 24 h, 42 % Y) and give *it* the seconds cage; or move the probe to dec +25 (r112) where it clears the plate skirt for ~70 % of its circuit. Do not keep a hero on the equator under a ground.
5. **Collapse to one memorable thing:** "the real sky wheels under the time; one gold body walks the rim." Cut the zodiac names, the RA tick ring, the extinction band, the probe cage as a separate object. Keep sky + constellation lines, sun pointer, minute arc, digits, dragon, prompt.
6. **Break the v4 grid.** Move BATTERY/STEPS to the flange as two arc gauges (r212-224, lower-left and lower-right quadrants, `#A6F46A` / `#F3C479`), drop their text labels, let the sky run to the bottom, keep the prompt line. That changes ~40 % of the composition and makes the 23 %-sky problem disappear at the same time.
7. **Dayglow:** replace the 55 % `SCREEN` blob with a real day/night state (`Condition` on `[HOUR_0_23]`: 06-18 selects a `sky_day` bitmap with stars at 30 % and a warm gradient toward the sun; 18-06 the night bitmap). Or cut it. A smudge is worse than nothing.
8. **Technical hygiene:** state Variant symmetry as unverified; write moon phases as boolean `Expression`s; report AOD lit pixels with the dim digit fill counted (~7 %); confirm per-second elements inside ambient-visible groups on the device.

## KEEP

- The sidereal / solar / lunar expressions and their derivation (constants recomputed and correct), the Seoul chirality analysis, the circle fit for the horizon (if a hairline is kept).
- The palette discipline: one warm hue (`#D9A441`) with one job; starlight / enamel / phosphor each with one role.
- The wake choreography: deepest plane first, 2.5 % plate / 3 % dragon parallax, 360 ms, digits "filling" in place. The magnitudes are right; only the surfaces they move are wrong.
- The dragon relief treatment (vertical gradient, NW rim light, baked 60 % shadow at 0.9x): the one relief in the proposal that will actually read, and the right conceptual bridge to the JLC Dragon edition.
- Minute flange via `dashIntervals` + a transformable `Arc`; PartDraw for everything untextured; the memory table and the ordering rule.
- The hour-plate *idea* as an explicit contrast guarantee for HH:MM (keep it, but make it a visible well).
- The AOD plan: outline digits, engraved dragon, +-3 px triangular drift, no per-second sources, headroom under 15 %.
- Removing "KALI / ORBIT" and re-slotting the date; the honest Risks and Accuracy sections.
