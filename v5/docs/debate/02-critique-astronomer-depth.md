# Critique 02 — "Seoul Planisphere" (astronomer seat) vs. the real Galaxia

Reviewer stance: design director, adversarial. Design space 450 x 450, centre (225,225), r 225. Every number below was recomputed, not taken from the proposal.

## Score: 5 / 10 — right skeleton, wrong skin. Do not build as written.

The proposal is the first one that understands *why* the Galaxia is deep: a stack of instruments, each on its own level, each carrying a real time-scale. Its astronomy is correct (I re-derived GMST, both sample moments, the leap formula, the window geometry). Its WFF mapping is mostly real. But as specified it would render as v4 with more hairlines, because every "material" it names lies between 0.2 % and 1.1 % relative luminance, both of its shadows fall onto black, its glass plate hides 46 % of the sky window (and the zenith, permanently), its dragon does not sit where the text says it sits, and it puts two suns on the dial, one of which parks behind the prompt every winter noon. The user would look at it and say "still flat" — not because the idea is flat, but because the values are.

## Answers to the four mandatory questions

**1. Is it still one-dimensional?** Structurally no; visually, as specified, yes. The stack is real on paper (vault / dome / F1 / F2 / plate / digits / dragon) but the only things that separate the levels on screen are 1–4 px lines at 3–7 % luminance. A line is not a level.

**2. Three separated depth planes, each with a different real time-scale, with material shading?** Planes + time-scales: yes, four — vault (sidereal day + annual drift), F1 (apparent solar day + seasonal arc), F2 (second, with a sidereal origin), plate/digits (civil minute). Material shading: **no**. See the luminance table under F1 below: the "fired enamel", "machined dome", "opaline" and "bezel" are #04070A, #0C110E, #151C18 and #0A0D0B — four names for one OLED black. The chiaroscuro the brief demands exists only in the Milky Way at 3 % luminance.

**3. Decoration glued onto the flat v4 face?** Half. The digits, the colon, the F2 ring with 60 ticks and the 3.3 px marker, the prompt line and the dragon are v4 at v4 coordinates. The new depth (vault, dome, plate, sun, moon, F1) is genuinely new and genuinely time-bearing — but it is specified at values that would make it invisible, so the user would perceive v4 with a few more lines and a gold dot.

**4. KALI or JLC pastiche?** The centre and top are KALI: official dragon, phosphor colon / trail / Draco / INFINITY, Roboto Mono, prompt. The flange is the Galaxia's wardrobe item by item — the press release lists "inner 24-hour ring (opaline), middle hour ring enamel over hand-guilloché, outer minute ring (opaline), golden sun-shaped pointer at the dial edge, white transferred inscriptions", and the proposal reproduces each: F1 opaline with 24-h numerals, F2 guilloché minute track, gold sun pointer, TextCircular inscriptions, transferred constellation names, zodiac glyphs. Kali's visual language is sparse, monospace, black and phosphor; opaline + guilloché + zodiac glyphs + engraved coordinates is Vallée de Joux. Cut the furniture and the edges become Kali again.

**5. One memorable thing or seven?** Seven: (1) dragon over the pole with Draco beneath, (2) the turning real sky, (3) a gold sun with haze inside the window, (4) a gold sun pointer with day arc on F1, (5) a seconds cage that drifts round the dial, (6) a floating glass plate with a shadow, (7) a moon with phases — plus etched inscriptions. (3) duplicates (4). (6) is invisible as specified. The one thing must be **(1)+(2): the Kali dragon coiled over the celestial pole, Draco in phosphor under it, the real Seoul sky turning beneath both.** Everything else is support or goes.

## What I verified and how

- GMST at 2026-01-01 00:00 UT from the IAU form: 280.46061837 + 360.98564736629 x 9496.5 mod 360 = **100.6608** (proposal: 100.660859). Correct.
- LST 2026-10-25 10:08:24 KST = 177.52 deg (11h50m), A_v 182.48; 19:31:08 KST = 318.59 deg (21h14m), A_v 41.41. Both match. Leap formula floor(([YEAR]-2025)/4) counts 2028 from 2029 on: correct through 2099.
- Window altitude limits: 6.1 deg due north, 23.9 deg due south, 25.6 deg at the east/west edge. Correct.
- Sun positions by season with the proposal's own formulas (table under F4).
- Dragon: parsed the untouched official path, mapped through the inner-SVG viewBox ("5 22 126 94" into 180x123, xMidYMid meet, scale 1.3085) and rasterised with a nonzero-winding test at 1 px. Results under F3.
- Luminance: WCAG relative luminance of every hex in the proposal (table under F1). Alpha compositing assumed in sRGB, which is what both the browser and the WFF renderer do.
- WFF: Variant target must be a transformable attribute; PartImage and Group list x, y, width, height, pivotX, pivotY, angle, alpha, scaleX, scaleY (and tintColor from v4) as transformable; Arc startAngle/endAngle are transformable; `Reference` is "Introduced in Wear OS 6" and exports one transformable attribute of its parent, consumed as `[REFERENCE.name]`; `HOUR_0_23_MINUTE` is a v1 float, `TIMEZONE_OFFSET_MINUTES_DST` a v3 integer in minutes, `MOON_PHASE_TYPE` 0–7, `STEP_GOAL` >= 1000, `YEAR` clamped 1902–2100; expression functions sin/cos/tan/asin/acos/atan/rad/deg/clamp/floor/numberFormat and the ternary exist; `%` on floats returns a float remainder (sign follows the dividend); numeric precision is not documented. Memory limits: 100 MB interactive, 10 MB ambient, bitmaps counted decompressed and cropped.
- Galaxia (JLC press release): dome in two sections, inner celestial disc in grisaille enamel, Northern sky from the 46th parallel in real time, Cosmotourbillon one anticlockwise circuit per sidereal day (23h56m4.1s), gold sun-shaped pointer at the dial edge for zodiac month + 24-h solar time, three concentric rings (24-h opaline / hour ring enamel over guilloché / minute ring opaline), dauphine hands, white transferred month names. The proposal's reading of the reference is accurate.

## FATAL flaws

### F1. Value-flat materials: the depth is specified below the visibility threshold

| surface (proposal) | hex | relative luminance |
|---|---|---|
| vault base ("fired enamel night") | #04070A | 0.2 % |
| dome field ("machined", lit upper-left) | #0C110E -> #05070A | 0.5 % -> 0.2 % |
| F3 bezel | #0A0D0B | 0.4 % |
| F1 "opaline" | #151C18 | 1.1 % |
| Milky Way core (brightest band) | #263238 | 3.0 % |
| F1 highlight arc, 1.5 px | #2A352E | 3.2 % |
| bezel rim light, 1 px | #2A352D | 3.2 % |
| wall highlight, 4 px, lower-right arc | #3E4F45 | 7.0 % |
| plate: #000 @72 % over the vault | — | ~0.06 % |

Everything the proposal calls a *material* sits between 0.2 % and 1.1 % luminance. On a Galaxy Watch OLED (black = 0 nit, panel crushes below roughly 2–3 %) these are one black; the "dome" is not a surface, it is a 7 %-luminance half-arc 4 px wide, and the "F1 opaline" is a 1.5 px line at 3 %. The Galaxia's levels differ by hue *and* by an order of magnitude in value: gold ~45 %, white enamel ~80 %, black lacquer ~2 %. The proposal's rule "no gradients that are not light falling on a surface" is right; the problem is that it then specifies no surfaces bright enough for light to fall on.

Consequence for the two occlusion chains the thesis rests on:
- Plate shadow: #000 @60 %, offset (+3,+4), blur 8, cast onto a 0.2 % vault -> a 0.12 % step. Invisible. The plate does not float; it is a slightly-darker-than-black rectangle with a 1 px #3C4A41 edge.
- Dome inner shadow (12 px) onto the same vault: invisible for the same reason. The 1.03 -> 1.00 "settle" animates an edge nobody can see.

The proposal's own Risk 2 and Risk 11 admit this ("if the wall highlight is under 35 % luminance the dome collapses"; "do not start subtle") and then specify the highlight at 7 % and the plate shadow at 0.12 %. That is the definition of still flat.

### F2. The plate is opaque in practice and hides the best sky permanently

- Plate 262 x 124 = 32,488 px^2 = **46 % of the aperture** (pi x 150^2 = 70,686). With the dragon across the top, the visible sky is two crescents: y 75–170 minus the dragon ink, and y 294–375 minus the prompt.
- "Stars show through at 28 %": 0.28 x #C9D6D2 composited over black = **#383C3B** (4 % luminance). Tier A (2.8 px) becomes a dim grey speck under the digits; tiers B–D at 0.9–2.0 px of #383C3B are below the panel's visibility at 40 mm. The glass passes roughly 17 of ~720 stars, as noise. "You read the time and the universe behind it in the same glance" is not true as specified.
- The zenith (225,243) is under the glass by construction, so everything that culminates near dec +37 for Seoul transits behind the digits: Ursa Major on spring evenings, Lyra/Cygnus in summer, Perseus/Andromeda in autumn, Auriga in winter. The proposal's own two sample moments put the Big Dipper and the Summer Triangle behind the plate. The sky the user will actually look at is the strip y 294–375.

### F3. The dragon is not where the proposal says it is, and the "crest over the pole" does not exist on screen

Measured from the untouched official path at the proposed frame (135,14) 180 x 123:

| claim | measured |
|---|---|
| ink bbox x 166–285, y 47–126 | **x 147–305, y 13–129** (44 px wider, 34 px taller) |
| "Polaris 12 px below the lowest ink" | lowest ink is the tail tip at **(298,129)**, 73 px right of the pole; in the pole column x 225–226 the ink ends at **y 77**, i.e. Polaris sits in **60 px of empty black** under the body |
| "lower coil occludes the aperture rim (proves it is above the dome)" | 1,586 ink px: **462 inside the aperture (29 %)**, 464 on F1, 387 on F2, 53 on the bezel, 37 on the 4 px rim wall. 71 % of the dragon lies on the flange rings, not over the sky. The rim overlap is a few touches, not an occlusion |
| "nudge the frame y, never the pole" | impossible: ink top is y 13 = the bezel's inner edge (r 212). The frame cannot go up |

So the dragon is a flange ornament lying across the 24-h scale and the minute track (`00` zone and minute ticks ~57–03 are under it), and the pole it is supposed to guard floats 60 px below its belly in the dark. The one memorable image of the proposal is not in the proposal. (The seconds marker is hidden for only 3 deg = 0.5 s per minute; the 12 o'clock AOD tick loses 3 of 9 px. Those are fine.)

### F4. The in-window sun contradicts the instrument, duplicates the pointer, and collides with the prompt

Positions from the proposal's own expressions (sun centre, 450 space; "in window" = within r 150 of the dial centre):

| date | 09:00 | 10:00 | 11:00 | 12:30 | 14:00 | 15:00 |
|---|---|---|---|---|---|---|
| Dec 21 | (44,275) hidden | (86,317) hidden | (137,347) edge | **(224,365)** r 140 | (311,348) edge | (362,319) hidden |
| Mar 21 | (77,242) edge | (109,277) | (149,302) | (217,319) | (287,308) | (329,286) |
| Jun 21 | (118,217) | (142,242) **behind plate** | (172,260) behind plate | (223,271) behind plate | (274,262) behind plate | (304,245) |
| Oct 25 | (70,273) hidden | (110,309) | (158,333) | (238,344) | (315,323) | (360,293) hidden |

- **Dec 21, 12:30: the sun's 6 px core is at (224,365); the prompt `kali@orbit:~$ INFINITY` has its baseline at y 364, centred x 225.** The core and the 28 px corona sit directly behind "~$ INF" every winter noon, and the 96 px haze washes the whole southern band. The prompt is Z10, the sun Z2, so the gold shows around and between the letters.
- In December the sun is visible in the window only ~11:00–14:00. At 09:00 it is behind the dome, *and so is its haze sprite*, so the face shows a full star field at nine in the morning. "Physically honest daylight" is honest for three hours a day.
- In June the sun spends 10:00–15:00 at r 46–84 from the centre: behind the plate. Its haze through 72 % glass is 5 %: invisible. Honest daylight is invisible five hours a day.
- Neither a planisphere nor the Galaxia's celestial disc contains the sun. The Galaxia's sun **is** the pointer at the dial edge. Putting a second gold sun 60 px inside the first one breaks the proposal's own rule "nothing decorative; every motion is something real", because the same real thing is shown twice.

## Required fixes

1. **Rebuild the value structure before anything else.** Rules: adjacent levels differ by >= 4x in luminance; every rim light >= 20 % luminance and >= 2 px; every shadow falls on a surface of >= 2 % luminance; the plate is the *lighter* object where it overlaps the sky (smoked glass reflects). Example values that satisfy the rules while staying Kali-green: vault base #070B0F (0.3 %); horizon glow at the window bottom, radial from (225,375), #22303A (2.6 %) -> 0 over 70 px (this is what the plate shadow and the inner shadow will fall on); Milky Way outer #1C2830, core #30404A (5 %); dome field radial #30403A (4.6 %) at upper-left -> #0F1512 (0.6 %) lower-right; wall lit arc #8CA897 (37 %) 4 px over 150–330 deg CW, wall dark arc #000; inner shadow 12 px #000 70 % -> 0; F1 #1F2823 with a 2 px highlight #566A5C (12 %); groove #000; F2 #161D19 with brushed radial texture at >= 1.2 px pitch; F3 #1A211D with a 2 px rim light #6E8878 (22 %) at r 223; plate #000 @55 % plus a diagonal phosphor sheen #A6F46A 6 % -> 0 and a 1.5 px #5A6E60 top/left edge. Build these first, then reduce, as the proposal itself says.
2. **Put the pole under the dragon for real.** Scale the official path to 0.9x: frame (144,16) 162 x 111 -> ink x 155–297, y 15–121 (measured). Move the pole to **P = (225,118)**: the ink in the pole column ends at y 73 (45 px clear), the tail tip (291,121) curls to the pole's right and 3 px below it, so the dragon now encloses the pole from above and the right. Zenith moves to (225,223) (under the hour digits, inside the plate). Aperture unchanged -> altitude limits become 16 deg north, 11 deg south: Scorpius' tail, the Sagittarius teapot and Fomalhaut enter the southern band. Vault bitmap r >= 257 -> 544 px centred on (225,118), placed at (-47,-154). All expressions keep their form; only the constant 138 -> 118 changes. Mark the pole with a 5 px phosphor cross-hair (the terminal cursor) with Polaris at its centre: the single bright static point of the sky, the thing the dragon guards. Stop claiming a dragon > rim > sky occlusion chain; the dragon sits across the flange at 12 (omit the `00` numeral and minute ticks 57–03 under it) and that is fine.
3. **Make the plate a window, not a lid.** 55 % black (not 72), the sheen above, and bake tier A/B stars at 1.25x so they survive the glass (0.45 x #C9D6D2 = #5A6060, 11 % luminance, visible). Keep x 94–356 but extend to y 170–300 so the information fits (fix 5). If after the value rebuild the plate still reads as a slab, drop it and bake a 6 px dark halo PNG behind the digits instead.
4. **Delete Z2 (sun + corona + haze in the window).** The sun is the F1 pointer, as on the Galaxia. Make it the one bright orbiting object: 11 px gold disc #E2B15A, 8 rays 1.5 px to r 9, a 2 px #000 occlusion ring, 4 px glow @35 %, at r 177, CCW once per apparent solar day; keep the day arc. Daylight becomes one element: a PartDraw Ellipse centre (225,225) r 150, fill #AEBFC8, `Transform alpha = clamp(220 * (sin(rad(37.57))*sin(rad(decS)) + cos(rad(37.57))*cos(rad(decS))*cos(rad(HS))), 0, 150)`, z between the moon and the dome. The window greys out by day and is black by night, all day, every season, with no sprite behind the prompt.
5. **Restore the information to information size.** BAT and STP values at 22 px #EFF8EC, baseline 290, centred x 166 and x 284; labels `BAT` / `STP` 12 px #9BAB9C at baseline 270; 2 px gauges at y 295; plate bottom 300. Drop the `SEC nn` text (the ring marker is the seconds). 14 px for battery and steps (1.25 mm on the wrist) in order to free a decoration band inverts the brief's priority.
6. **Cut the JLC furniture.** Remove: IAU labels (10 px at 35 % of #3A4743 = 0.9 % luminance: invisible, and upside down half the time if ever visible), zodiac glyphs (8 px), the 0.5 px guilloché (sub-pixel -> moiré at 1.0667x), the celestial equator (two faint great circles crossing at 23 deg inside a 300 px hole is clutter), and one of the two TextCircular inscriptions. Keep: F1 24 ticks + `06/12/18` + an 11 px `SOLAR` label (the proposal's Risk 7, now mandatory), the ecliptic as a 1.0 px dashed gold line (the sun pointer's line, read against the sky), one 11 px etch `37.57N 126.98E`.
7. **Decide what the F2 ring is.** Either (a) keep the drifting origin and make the cage a visible object — 7 px phosphor disc, 2 px #000 occlusion ring, 24 deg comet trail 1.7 -> 0 px — and delete the 60 ticks (a minute scale whose zero drifts round the dial once a day is unreadable, so it is decoration); or (b) keep the 60 ticks and fix the trail origin at 12. Not both. (a) is the Cosmotourbillon and the only thing that makes F2 belong to the stack; I recommend (a).
8. **Minimum line weights.** Constellation lines 1.0 px (not 0.8), Draco 1.2 px, ecliptic 1.0 px, tier D stars 1.0 px @45 % or dropped; bake at 1.0667x with 2x supersampling; the on-device tier C/D test stays.
9. **Wake transition.** Keep the back-to-front order. The dome settle (1.03 -> 1.00) is kept only if the wall highlight is >= 20 % luminance after fix 1; otherwise cut it, it moves an invisible edge. Keep the v4 orbit rotate and the digit fill-up as the signature.
10. **WFF mapping corrections.** (a) `Reference` is Wear OS 6 = WFF v4; confirm the SM-R965N is on One UI 8 Watch before relying on it or on `Variant duration/startOffset`; without it, duplicate the expressions per element (about 12 copies) and accept an instant mode switch. (b) "Named Expressions" exist only inside `Condition`; shared scalars need one hidden carrier element per value (LST, HS, dS, H0, hs-angle, age, lamM, raM, decM, HM, dM = 11 carriers), each a `Transform` on a transformable attribute plus a `Reference`. (c) Wrap `((360 - LST) % 360 + 360) % 360`: WFF float `%` keeps the dividend's sign and dU is negative before 2026-01-01 UT. (d) `endAngle = A_v + 6*[SECOND]` exceeds 360 for most of the day; verify Arc accepts it or split with a Condition. (e) Verify the validator accepts PartImage at negative x/y (-47,-154). (f) The memory risk is overstated: ~4 MB interactive vs 100 MB, ~2 MB ambient vs 10 MB; drop Risk 10 and spend the attention on the 24 h battery run.

## Keep — genuinely strong

- The north-polar azimuthal equidistant projection with one rigid disc rotated by one angle expression: the only sky WFF can animate, and exactly what a planisphere and the Galaxia disc are. The sidereal math is correct (GMST 100.6608, both samples, leap handling), and the `DAY_OF_YEAR + HOUR_0_23_MINUTE` form keeps every operand under 1e5 — a real, verified precision safeguard.
- Six real time-scales on four planes, nothing looping, nothing twinkling: the right answer to "not one-dimensional". The seasonal day arc and the CCW sun pointer are the brief's take-aways done properly.
- Draco in phosphor under the Kali dragon: the only conceptual bridge to the JLC Dragon edition that copies nothing. Keep Eltanin/Rastaban at 2.4 px.
- One warm hue, one cool neutral, one night tone, each with one job. The rule is right; only the values are wrong.
- Information discipline: date, HH:MM, battery, steps all on one plate; nothing ever in front of the digits; HH:MM at 166/284 baseline 252 untouched; `KALI / ORBIT` dropped because the dragon brands.
- The back-to-front wake order mapped to `Variant startOffset` fractions, with the honest note that the device owns the absolute duration.
- The AOD plan: 72 drifting stars + drifting arcs, nothing new that is bright and static, ~11.8 % lit-pixel estimate (the 0.59 % rim figure is correct), outline/Light-weight digits, re-measure after the font substitution.
- The risk list is unusually honest (sub-pixel stars, apparent vs civil time, numeric type, estimated dragon bbox); the failure is that the spec did not act on its own risks.

## Sources
- WFF reference: Variant (developer.android.com/reference/wear-os/wff/common/variant/variant), Reference (…/common/reference, "Introduced in Wear OS 6"), PartImage (…/group/part/image/part-image), Group (…/group/group), Arc (…/group/part/draw/shape/arc), arithmetic expressions (…/common/attributes/arithmetic-expression), source types (…/common/attributes/source-type), memory usage (developer.android.com/training/wearables/wff/memory-usage).
- JLC press release, "Jaeger-LeCoultre presents the Master Hybris Artistica Calibre 945" (press.jaeger-lecoultre.com).
- Official Kali dragon path: `ghrepo/kw/dragon-data.js` (unchanged press-pack logomark); rasterisation scripts `debate/dragon-bbox.cjs`, `debate/dragon-raster2.cjs` in the same scratchpad.
