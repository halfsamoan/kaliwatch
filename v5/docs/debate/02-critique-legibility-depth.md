# Critique 02 — proposal 01 "Celestial Vault" (legibility / AOD / burn-in lens)

Reviewer: adversarial design director, judging against the real Galaxia dial and the brief's definition of "not one-dimensional" (three separated depth planes, each carrying a different real time-scale, with material shading the eye can read).

**Score: 5 / 10. Verdict: right skeleton, wrong exposure. As specified it will render as v4 minus the planet, plus a faint starfield and a gold dot.**

The architecture is the best direction anyone has put on the table: a real Seoul planisphere, a plate carrying the civil time, a sunken telemetry well, a sun/moon lip. The astronomy is correct (I re-derived every number below). But the proposal designs depth in prose and in the bake script, then renders every depth cue at 0.3–1 percent luminance on a 0 percent background, hides the headline layer behind four opaque occluders, and puts its one memorable idea under the opaque dragon where no one can see it. The user's complaint ("너무 1차원적") would come back unchanged.

---

## 1. Answers to the mandatory questions

**Is it still one-dimensional?** In architecture, no. In rendering, yes. Every material cue listed as the difference between the five levels is below the threshold a human sees on a wrist OLED in a lit room:

| Cue the proposal relies on | Colour / alpha | Effective relative luminance |
|---|---|---|
| Ring chamfer body, lit side -> shadow side | `#101C14` -> `#07100B` | 1.0 % -> 0.4 % |
| Bridge glass fill | `#070B09` 94 % | 0.3 % |
| Bridge drop shadow | black 65 % on a `#000000` sky | 0 % on 0 % (no surface to darken) |
| Well bevel | `#22343A` 55 % | ~1 % |
| Haze at the zenith | `#14262B` 40 % | 0.3 % |
| Milky Way band | `#1C2A26` 25 % | 0.2 % |
| "Fired enamel" base | `#0E1A1F` | 2 %, described in the proposal itself as "free on OLED" |
| Ring inner rim (the single visible cue) | 1 px `#4A6A45` -> `#16241A` | 12 % -> 3 %, one pixel wide |
| Bridge top highlight | 1 px `#2F4A2A` | 6 %, one pixel wide |

The whole "chiaroscuro" vocabulary is two one-pixel lines. Everything else sits in the 0–2 percent band, which is black in daylight and a faint smudge in the dark. The Galaxia reads as deep because its materials span 10–90 percent reflectance (white enamel, gold, opaline) with hard lit edges; this proposal has no mid-tones at all — it is bright text and phosphor on black, which is exactly the v4 tonal structure. Chiaroscuro without the chiaro.

**Three separated planes, each with a real time-scale, with material shading?** The time-scales are there and are the proposal's genuine achievement: seconds (ring), civil hour/minute (bridge), 24 h solar and lunar month (lip), sidereal day (vault). Five scales versus v4's two. The separation is not: the planes are distinguished only by the sub-threshold cues above, and the plane that gives depth — the sky — is nearly gone (section 2).

**Decoration glued onto the flat v4 face?** Half of it is v4 verbatim: HH:MM at the same coordinates, the same orbit radius 192 with the same 60 ticks and the same seconds trail/marker, the dragon in nearly the same frame, BATTERY/STEPS columns in the same place, the same prompt and the same AOD. What is new and visible: a star PNG behind the old layout, an invisible plate under the digits, and a 9 px gold dot on the rim. That is decoration behind the v4 face, not a stack.

**Does it still read as KALI?** Yes, and this is the strongest aspect. Official dragon, phosphor hierarchy, monospace digits, prompt, INFINITY all survive; the gold is contained by a sensible rule (never on text or UI). It is not a JLC pastiche. If anything it is too timid about being a pastiche: the JLC devices it borrows are the ones that would show on screen (lit metal edges, white inscriptions on a visibly different surface) and the proposal borrows only the invisible ones.

**One memorable thing or seven?** The proposal names the right one — "the dragon sits on the pole and the sky turns around it" — and then makes it unseeable (section 3). Seven elements are listed; after rendering, only the digits, the dragon and the sun dot rise above the perceptual floor, and two of those are v4. Nothing new carries the face.

---

## 2. The vault is 84–88 percent occluded (geometry, recomputed)

Dial area pi * 225^2 = 159 043 px^2. Occluders as specified:

- Ring + lip annulus r 176–225: 61 730 px^2 (39 %). A 49 px band = 4.4 mm of a 40 mm dial, drawn inside the Watch6 Classic's physical rotating bezel. Bezel on bezel.
- Bridge x 44..406, y 172..278: 38 372 px^2 (24 %), opaque or 94 percent.
- Well (segment y >= 296 inside r 176, within the +/- 60 degree sector): ~23 800 px^2 (15 %).
- Dragon frame inside the sky cap: ~10 000 px^2 (6 %).

What is left of the sky: the top cap inside r 176 above y 172 minus the dragon (~20 000 px^2), the 18 px strip y 278–296 (~5 900 px^2, most of it under the baked shadow), and the two "lower flanks". The flanks are triangles with vertices (348, 296), (386, 296), (377, 313) and their mirror — roughly 300 px^2 each, 6 degrees of arc at r 176. The claim that Orion "is seen rising in the SE flank and setting in the SW flank" is false: Orion's belt is 3 stars 1.6 px wide and the flank is 17 px tall. Also, the chart PNG (radius 294 from P) does not even cover those flanks (at y 313 the chart spans x 100..350, the flank is at x 377); the proposal's excuse that the haze swallows that band is wrong — the haze is 70 percent at the edge, not 100, and the band is swallowed by the ring and the well, not the haze.

Net visible sky: ~13–17 percent of the dial, dominated by one letterbox 46 px tall (y 126–172, about 4 mm on the wrist) and two shoulders beside the dragon. The headline feature of a "celestial vault" is a 4 mm slot. The bridge alone, as a wall-to-wall 106 px bar at 24 percent of the dial, is the single biggest reason the face will still read as a flat layout with a star wallpaper.

The "dial edge = horizon" concept is correct mathematically (k = 225 sin 37.57 = 137.2; horizon radius 225, centre offset 178.3; checks) and is invisible in practice: the ring hides every pixel within 49 px of the horizon, so the wearer never sees a horizon. Sell it as geometry, not as a visual.

---

## 3. The memorable idea is under the dragon

P = (225, 47). Circumpolar radii from P: Polaris 0.9 px, Kochab 38 px, Dubhe 35 px, Alkaid 50 px, Cassiopeia 39–45 px. The Dipper and Cassiopeia wheel inside a circle of radius ~45 px around P, i.e. x 180..270, y 2..92. The dragon frame is x 150..300, y 14..126 at 96 percent opacity with a 6 px phosphor glow, and the ring/lip covers y < 49 at the centre line. The entire circumpolar sky is therefore under the dragon or under the ring. Polaris itself sits 2 px outside the ring's inner edge (P is 178 px from centre; the ring starts at 176), on the rim line, under the dragon's body.

"Stars wheel through the dragon's coils" will render as two or three grey 1.6 px dots in the negative space of a phosphor silhouette, moving 1 mm per hour. No one will ever see the Dipper as a shape, and so no one can perceive that the sky rotates around the dragon. The one idea that justifies the whole stack is unverifiable by the wearer.

Note the reference: in the 2024 Hybris Artistica Calibre 945 "Dragon" the sculpted dragons clamber around the *edge* of the raised sky-chart disc; they frame the sky, they do not cover it. The proposal inverts the reference.

Also wrong: "8 px clear of the dial edge at its top corners". Corners (150, 14) and (300, 14) are at r = sqrt(75^2 + 211^2) = 223.9 — one pixel from the edge — and the frame overlaps the flange ring (r 176–211) and the solar lip (r 211–225) from y 14 to y 49. Consequence not mentioned anywhere: the gold sun (r 217.5, angle 0 at noon) is inside the dragon frame from 10:40 to 13:20 and, with z10 above z9, disappears behind the dragon at noon — the brightest slow object vanishes at the one moment a 24 h sun dial is supposed to be legible. Either make that an intentional, named occlusion event or move one of them.

---

## 4. Hard-constraint breaches (the legibility lens proper)

**4a. The STEPS value leaves the safe radius and is clipped by the ring.** Roboto Mono advance is ~0.6 em. At 26 px, "6,240" is 5 glyphs = 78 px, centred at x 310 -> x 271..349 on baseline y 349. The far corner (349, 349) is at r 175.4, not inside r 171 as the proposal states. Any 6-glyph value ("12,480", or "10,000" the moment the goal is hit) spans x 263..357 -> r 181, which is under the z7 flange ring (starts r 176, painted above z4). The last digit of the user's step count will be clipped by the ring on the day they hit their goal. The battery value "100%" (62 px) squeaks in at r 170. Fix is trivial (columns at x 150/300, or 22 px, or "6.2k"), but as written the proposal breaks its own stated rule and the brief's "information is the point".

**4b. The HH:MM moves in Active, and WFF cannot gate the drift to AOD.** z11 translates the bridge + digits by `round(2 cos(6 deg * MINUTE))`, `round(2 sin(...))`. I checked the WFF source-type reference: there is no ambient-state data source (nothing named AMBIENT, no watch-state source), and `Variant` can only set a static value in AMBIENT, not switch an expression on. So the drift runs in Active too: the 78 px white digits step one pixel once a minute, forever, on a face whose brief says HH:MM "never moves". Either accept and document that exception explicitly (amplitude 1 px, not 2), or drop the drift and rely on the 37 percent luminance ceiling plus the platform's own burn-in offset (verify whether the Samsung WFF runtime applies one; the proposal only says "if").

**4c. Daytime vault dimming makes the demo state worse.** Alpha 150 (59 percent) whenever the sun is up — which is the proposal's own preview time (10:08 KST) and every moment the user looks at the watch outdoors. The already-faint stars drop to 59 percent exactly when the "too simple" judgement is made. Cut it, or cap at 20 percent.

**4d. Smaller type than v4 across the board.** Date 17 -> 15 px, values 27 -> 26, gauges 72 -> 52 px, prompt 13 -> 11 px (the floor the brief sets for decoration), INFINITY — the signature word — down to 11 px. The well forces the shrink. Nothing is illegible, but the proposal trades information size for a level that is itself invisible.

---

## 5. Technical claims — verified / corrected

Verified against the WFF reference (developer.android.com/reference/wear-os/wff):
- `[DAY_OF_YEAR]` 1–366, `[HOUR_0_23_MINUTE]` float 0.0–23.98, `[UTC_TIMESTAMP]` ms, `[SECONDS_SINCE_EPOCH]` (v3), `[MOON_PHASE_POSITION]` integer 0–28, `[MOON_PHASE_TYPE]` 0–7, `[STEP_COUNT]`, `[STEP_GOAL]`, `[BATTERY_PERCENT]`, `[DAY_Z]`, `[MONTH]`, `[DAY_OF_WEEK]` (1 = Sunday), `[SECOND_Z]` — all exist as used.
- Functions `sin cos tan asin acos atan deg rad clamp round floor numberFormat` exist; ternary `? :` is supported (`>` must be `&gt;` in attributes).
- `Variant`: `duration`/`startOffset` are 0–1 fractions of the device transition, `CUBIC_BEZIER` + `controls`, `angleDirection` exist; "if duration + startOffset > 1.0, startOffset is ignored" — the ring's 0.28 + 0.72 = 1.0 is at the limit, every other row must be checked the same way.
- `Arc`: 0 degrees at 12 o'clock, `startAngle`/`endAngle` transformable, `direction` attribute; no documented range — the proposal's risk 6 stands.
- `Group`/`PartImage`: `pivotX/Y` in [0, 1], `angle` transformable; nothing in the reference forbids negative x/y, nothing promises it either — risk 1 stands and must be validator-tested before the 588 px vault is committed.
- Memory: 10 MB ambient / 100 MB interactive; "the system assumes ambient mode uses up to three full-screen layers, two of which are static"; whether alpha-0 ambient images are excluded is not documented. The proposal's ~3.5 MB ambient figure is an assumption until the footprint evaluator runs.
- Ambient refresh is about once per minute (platform design guidance) — the once-per-minute vault/sun/moon updates are safe.

Corrected:
- "Moon: 14.49 deg/h clockwise" is false as mapped. `[MOON_PHASE_POSITION]` is an integer (days started), so the moon moves at 15 deg/h with the sun and jumps 12.19 degrees backwards (46 px of arc at r 215) once a day. Fine for a dial, wrong in the spec.
- Solar noon fixed at 12:32 KST ignores the equation of time (+/- 16 min = +/- 4 degrees of lip). Acceptable, but say so.
- Shadow offset (+2, +4) implies a light from ~11:00, not 10:30 (that would be (+3, +3)). Trivial, but the proposal's own rule is "one light".

Astronomy, all re-derived and correct: k = 137.2; horizon = dial edge; P (225, 47); zenith (225, 115); equator r 137; ecliptic r 150 offset 60 toward RA 18 h; chart r 294 = dec −40; GMST 2026-01-01 0h UT = 100.66 degrees so the constant 227.64 is right; per-day 0.985647 and per-hour 15.041069 are right and the KST-to-UT offset works across midnight; the half-day formula gives 14 h 46 m / 9 h 34 m / 10 h 42 m within 5 minutes of Seoul's real values; sun angle 15 h + 180 and moon angle sun − 12.19 d are the right conventions; the appendix-B sanity check (LST 177.4 degrees at 10:08 KST on 25 Oct) is consistent.

---

## 6. AOD and burn-in (the part that is actually good)

- Lit-pixel estimate 6.9 percent strict, 8–9 percent with AA: credible, below v4's 11.3 percent and well inside the 15 percent limit. The dragon is the largest item (5 900 px^2) and the proposal names it as the first thing to cut — right priority.
- Luminance ceiling: `#91AD80` digit stroke is 37.5 percent relative luminance (the proposal says 42; it is lower, which is fine). Rims at `#1F2E1C` ~2 percent. Nothing bright is static. Good.
- No seconds, no gauges, no haze, no shadow in AOD. Good.
- The 24-star sparse vault at `#6E8187` 1.2 px will not be visible at Samsung's dimmed AOD brightness. Harmless, costs nothing, but do not describe the AOD as "still showing the sky".
- Drift: see 4b. The one real problem is that it leaks into Active.

---

## 7. What would make it not flat (required fixes, concrete)

1. **Mid-tone budget.** Put at least two broad Active surfaces in the 6–14 percent luminance band with lit edges >= 2 px at 15–20 percent. Example numbers: ring chamfer `#3A5240` (7 %) at 10:30 to `#121B14` (1 %) at 4:30 with a 2 px inner rim `#5C7A55` (17 %); bridge top face as smoked glass with a 3 px bevel `#4F6E4A` (12 %) and a 12 px inner gradient; well rim 2 px at 12 percent plus an 8 px inner shadow so it reads sunken. These are Active-only, so the AOD budget is untouched; OLED power at 7 percent luminance over a quarter of the dial is negligible.
2. **Give the shadow a surface.** The sky plane needs a real grisaille in the visible windows: a painted nebulosity/Milky Way at 5–8 percent effective luminance (not 0.2) so the bridge's shadow and the dragon's emboss have something to fall on. This is the single element that most resembles the JLC grisaille disc.
3. **Shrink the bridge to a plate.** x 92..358 (digit box plus 27 px), y 182..266, rounded ends, floating with the sky visible on both sides and above/below. Make it 65–70 percent smoked glass; stars behind 78 px bold digits with 17:1 contrast are no legibility threat (a 1.6 px dot at 40 percent inside a 10 px stroke is below any Weber threshold). The continuous sky seen *through* the plate is the strongest depth cue available on a static screen.
4. **Dragon as engraving, not silhouette.** Keep the official path; render it as a 1.2–1.5 px phosphor stroke with 30–35 percent fill plus the emboss shadow, so Cassiopeia and the Dipper read through it. That is the only way "the sky turns around the dragon" becomes visible, and it is closer to the JLC Dragon edition (engraved, framing the sky) than a flat fill. Alternatively move the dragon off the pole and stop claiming the coils effect.
5. **Delete the sliver flanks.** Make the well a plain segment (drop the sector limit) and move its chord to the bridge's bottom edge, or accept that the sky is a northern cap and compose for that honestly.
6. **Fix the telemetry overflow.** Columns at x 150 / 300 or values at 22 px; verify the 6-glyph case ("10,000") against r 171 and the ring at r 176.
7. **Drift.** Decide: either 1 px amplitude documented as the one exception to "never moves", or no drift and confirm the runtime's own burn-in shift.
8. **No daytime dimming** (or 20 percent max).
9. **Sun and lip.** Sun radius 6 with a 4 px glow, day arc at 50 percent of `#E0B35A` (35 percent is 5.5 percent luminance — invisible), and resolve the noon collision with the dragon on purpose.
10. **Prove the 588 px off-canvas vault on the validator before anything else** — it is the foundation of the whole stack and the fallback (810 px image with P centred) roughly doubles vault memory.
11. Optional but cheap and faithful to the reference: paint Jupiter and Saturn at their real 2026 ecliptic longitudes as 6–8 px shaded sprites inside the vault PNG. It restores a shaded body (v4's only one) as real astronomy instead of a decorative planet.

---

## 8. Keep (genuinely strong)

- The planisphere mathematics and the LST / sun / moon expressions — correct to the degree, WFF-expressible, year-independent in the `[UTC_TIMESTAMP]` form.
- Five real time-scales on five levels. This is the right reading of why the Galaxia is deep.
- Opaque core under the digits, fixed HH:MM, 17:1 contrast; the proposal's legibility discipline on the digits is better than v4's open black.
- The sun/moon lip: cheapest real information on the face, warm colour reserved for it, day/night read at a glance.
- The palette rule: gold never on text/UI, grisaille never on text, phosphor never on sky.
- The AOD plan: ~7–9 percent lit, luminance ceiling, no bevel/shadow/haze/seconds in AOD, dragon as first cut.
- Wake order deepest-first with Variant fractions; the v4 360 ms ring rotation as the signature.
- The WFF mapping is competent and the risk list is honest; most risks are real.
- It is still KALI.

---

## Sources checked

JLC press release for the Master Hybris Artistica Calibre 945 (multi-level dial, deepest level with white transferred inscriptions, grisaille star map, Cosmotourbillon one circuit per sidereal day); Wristreview / Watchonista coverage of Galaxia and of the 2024 "Dragon" edition (sculpted dragons around the edge of the domed sky-chart disc); Android Watch Face Format reference pages for source types, arithmetic expressions, Variant, Arc, Group, PartImage, and the memory-usage guide (10 MB ambient / 100 MB interactive, three-layer ambient model).
