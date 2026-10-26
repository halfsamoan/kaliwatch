# 02 — Critique of proposal 01 "Celestial Vault" — legibility / AOD / burn-in lens

Reviewer stance: adversarial Wear OS reviewer. Every number below was recomputed (script: `debate/tools/verify02_legibility.py`, run against `ghrepo/kw/preview-ambient.png`) or checked against the WFF v4 schema in `google/watchface` and the developer.android.com reference pages. Where I could not verify, I say so.

**Score: 7 / 10.**

**Verdict:** this is the only proposal in the round built from the constraints outward, and on my lens it is strictly better than v4: HH:MM sits on an opaque plate, all information text is >= 13 px, the AOD budget verifies at 7–10 % with nothing per-second, and the sidereal mapping is correct end to end. It is not ship-ready as written. Two hard-constraint breaches (STEPS is clipped by the ring at five digits; HH:MM drifts 1 px every minute in Active) and two WFF mapping errors (the sleeping ring is drawn 14 deg off in AOD; Transform-alpha and Variant-alpha fight over the same PartImage) must be fixed, and the "three sky windows" story is false: open sky is 16 % of the dial and the lower flanks are 652 px².

---

## The five questions

### 1. Can HH:MM be read in under one second at 40 mm with that sky behind it?

**Yes — because there is no sky behind it.** The bridge core is 100 % opaque from x 110 to 340; the digit box is x 119–331 (9 px margin each side). In the 94 % margins a mag-0 star core (#FFFFFF) bleeds through at 6 %, i.e. #0F0F0F — below any perceptual threshold on an OLED. Digits are unchanged from v4: Roboto Mono 78 px weight 600 #EFF8EC on #070B09 = **18.2 : 1** (computed). On the Watch6 Classic (480 px over a 38.1 mm panel, 0.079 mm/px) the 55.5 px cap height is 59 device px = **4.7 mm**. Fixed position, no scaling. This is a pass.

**But the plate is crowded.** Computed stack: bridge top rim y 172 -> date cap-top y 180.3 (8.3 px) -> date baseline 191 -> digit top y 196.5 (**5.5 px**) -> digit baseline 252 -> SEC cap-top 262.8 (10.8 px) -> SEC baseline 272 -> bottom rim 278 (6 px). v4 had 15 px between the date and the digits on open black. Two horizontal rim lines 24 px above and 26 px below the numerals, with text jammed into both gaps, make the plate read as a label rather than a dial. See fix 5.

### 2. Is any text under ~11 px treated as information?

**No text is, but one piece of information is physically clipped.** STEPS: value 26 px, centred x 310, baseline y 349. Roboto Mono advance is 0.6 em, so "6,240" spans x 271.0–349.0 and its bottom-right corner is at **r 175.4** (the proposal claims "everything inside r 171"; false). A five-digit count "12,345" spans x 263.2–356.8, corner **r 181.0**. The flange ring (z7) is an opaque annulus from r 176 and paints after z4, so the last glyph's lower-right corner is painted over on every day the user passes 10,000 steps — exactly the days he looks. This is an information defect, not a decoration one.

Sub-threshold elements, all correctly decoration but one of them mislabelled: constellation lines 0.8 px at 22 %, ecliptic 0.7 px dashed at 18 %, zodiac ticks 3 px at 18 %, moon phase sprite 18 px (= 1.4 mm; crescent vs gibbous is not readable at that size), prompt 11 px (v4 had 13 px; it is at the floor). Section 9 counts "zodiac: partial" as a surviving Galaxia function — it is not readable and must not be listed as information.

### 3. AOD under 15 % lit with no per-second motion?

**Yes, verified two ways.**

Strict recount, counting every non-black pixel (Samsung's on-pixel ratio counts "pixels with RGB values"), anti-aliasing modelled as x2 on strokes <= 1.5 px and x1.15 on fills:

| Element | px² |
|---|---|
| Dragon 150x112 frame at the proposal's 35 % ink x1.15 | 6 762 |
| Outline digits 4 x 300 x 1.4 x 2 + colon | 3 510 |
| Sleeping ring arcs 4 x 48 deg x r192 x 1.25 x 2 | 1 608 |
| Bridge rim 2 x (362 + 106) x 2 | 1 872 |
| 12 ticks, date, BAT, INFINITY, sun+moon, 24 stars | 1 772 |
| **Total** | **15 524 = 9.8 %** |

The proposal's 35 % dragon ink is wrong in the safe direction: measuring the official dragon in the v4 ambient preview gives **8.6 %** of its frame (thin line art), which pulls the total to ~7 %. Re-measuring the v4 ambient preview with the same method gives **11.29 %** (proposal: 11.3 %), so the method is consistent with how v4 was measured. Either way the face lands at 7–10 %, under the 15 % Samsung guideline.

Consequence the proposal gets backwards: **the dragon is not the largest contributor.** The outline digits (~3.5 k) and the bridge rim (~1.9 k) are. "Drop the dragon alpha first" is the wrong mitigation order; thin the bridge rim or drop the ambient stars first.

Per-second motion in AOD: none. Per-minute: vault rotation, drift, sun, moon — all evaluated on minute-or-slower sources (`[MINUTE]`, `[HOUR_0_23_MINUTE]`, `[DAY_OF_YEAR]`, `[MOON_PHASE_POSITION]`), confirmed as the right sources in the SourceType reference.

### 4. Burn-in from static bright rings?

**No bright static ring exists in AOD.** Computed WCAG luminance of every static AOD element: digit outline #91AD80 **37.5 %** (the ceiling, same as v4), ticks #7F9472 26.9 %, moon lit side ~12 %, sun #7A6336 13.3 %, arcs #4D633F 10.9 %, dragon #3E5A38 at 85 % = 6.2 %, bridge rim #1F2E1C 2.3 %. The 2 px drift circle makes a 1.4 px stroke sweep a 5.4 px band, so each pixel is lit roughly a quarter to a third of the hour instead of all of it. Adequate; a 3 px radius would be better and costs nothing. Do not count on an OS-level ambient shift for WFF faces — it is not documented.

One gap: the ambient vault (z1) is outside the drift group, and Polaris sits 0.9 px from the pivot. That is a 1.2 px dot at 21 % luminance that never moves. Negligible, but the fix is one line (fix 11).

### 5. Anything that loops or twinkles?

**Nothing.** Wake is a one-shot 360 ms sequence, sleep 180 ms, seconds step at 1 Hz in Active only via `[SECOND]` (not `[SECOND_MILLISECOND]`), so the interactive frame rate stays at 1 Hz. The ring Variant uses `startOffset 0.28 + duration 0.72 = 1.0`; the Variant reference says startOffset is ignored only when the sum exceeds 1.0, so the signature rotation is honoured. No blinking cursor (the current on-watch XML has one; this proposal correctly does not).

---

## FATAL (as written)

Each has a cheap fix, but as specified these breach the brief or will not build correctly.

**F1 — STEPS clipped by the opaque flange ring at five digits.** Value 26 px at x 310 / y 349: "6,240" corner r 175.4, "12,345" corner r 181.0; ring is opaque from r 176 and paints over z4. Information loss on the user's best days. (Claim "everything inside r 171" is false even for four digits.)

**F2 — HH:MM moves in Active.** z11 drift wraps z3–z10 in both modes ("invisible in Active"). It is a 1 px jump of the plate, the ring and the seconds marker at every minute boundary, synchronized with the minute digit change, against a fixed dial clip and 1 px rim lines. The brief says "fixed position, never moves". There is no ambient-mode data source to gate a Transform, and `Variant` values are constants, not expressions, so the fix is structural (fix 2).

**F3 — WFF mapping draws the sleeping ring 14 deg off in AOD.** z7 places `ring_ambient.png` inside the Group that carries `Variant mode="AMBIENT" target="angle" value="-14"`. In ambient the group sits at -14 deg, so the 12 AOD ticks and 4 arcs are drawn with the 12 o'clock tick at 11:32, all night. v4's SVG keeps the sleeping ring outside the rotating group; the mapping must too.

**F4 — Transform-alpha and Variant-alpha on the same PartImage (vault).** `vault_active.png` carries `Variant AMBIENT alpha 0` and a `Transform target="alpha"` for daytime dimming. Precedence between a Transform and a Variant on the same attribute is undocumented; PartImage allows one Variant. Worst cases: the vault never hides in ambient (lit pixels and 1.6 MB ambient memory) or never dims by day. Must be split (fix 4).

Not fatal from this lens, but the proposal must stop claiming it: **the sky is one window, not three.** Pixel census (Active): dial 159 068 px²; ring 61 740; bridge 36 748; well 23 710; dragon frame 10 732; **open sky 26 138 = 16.4 %**, of which 5 928 (23 %) lies under the 65 % bridge shadow and the "SE/SW flanks" total **652 px² (0.4 %)** — two slivers no taller than 17 px. Orion will never be "seen rising in the SE flank". The real window is the 46 px band y 126–172 plus two 50–70 px patches beside the dragon and the dragon's negative space (20.8 % including it). The stack is still four visible levels with mutual occlusion, which is why I do not call it flat; but the user will look for the stars the text promises.

---

## Required FIXES

1. **Steps column.** Values 24 px, columns x 146 / 304, baseline y 345. "99,999" then spans x 260.8–347.2 with corner r 171.3; "100%" corner r 161. Gauges move to y 359, prompt to y 374. Alternative: format >= 10 000 as "12.3k" (5 glyphs). Either way, test with 99 999 and 100 % in the studio, not 6 240 and 78 %.
2. **Scope the drift to AOD.** Two sibling stacks: active twins (ring_active, bridge_active, TimeText clock, telemetry, dragon_active, sun/moon active sprites) outside; a `Group drift` holding only the ambient twins (ring_ambient, bridge_ambient, ambient BitmapFont clock + ambient date, BAT/INFINITY, dragon_ambient, ambient sun/moon, and vault_ambient). Transform `round(3*cos(rad(6*[MINUTE])))` / `round(3*sin(rad(6*[MINUTE])))` (3 px radius). The active stack never moves.
3. **Ring mapping.** Move `ring_ambient.png` out of the group that carries the -14 deg Variant; only `ring_active.png` and the seconds probe rotate on wake.
4. **Vault alpha.** Wrap the vault PartImage in `Group vault_day` carrying the daytime `Transform target="alpha" value="(... sun above horizon ...) ? 150 : 255"`; leave `Variant AMBIENT alpha 0` on the PartImage. Same pattern for any other element that needs both.
5. **Bridge spacing.** Bridge y 168–280 (h 112); date 14 px baseline 186 (cap top 176: 8 px under the rim, 10.5 px above the digit tops); SEC 12 px baseline 271 (9 px above the bottom rim). Sky band shrinks 46 -> 42 px; accepted. Cheaper alternative: drop SEC from the bridge and keep the date at 15 px / baseline 186.
6. **AOD ring body stays opaque black.** `ring_ambient.png` = black annulus r 176–211 plus the 4 arcs and 12 ticks. Zero lit cost; otherwise the bridge PNG's square corners at r 188 and the horizon stars (haze is off in AOD) are exposed in ambient.
7. **Ambient digits alignment.** BitmapFont `size` scaling is undocumented. Either render both clocks from BitmapFonts (filled set + outline set, ~250 KB, tabular advance for free) or verify on the validator preview that the TimeText and BitmapFont baselines agree within 1 px before trusting the fill/outline crossfade; a 2 px jump at wake would be the most visible defect on the face.
8. **Lip clearance.** Sun r 217.5 +- 4.5 reaches r 222, 3 px from the panel edge under the Classic's bezel; the 18 px moon at r 215 reaches r 224. Pull the sun to r 214 (max r 218.5) and the day arc with it; moon 14 px at r 215 (max r 222) or verify the physically visible radius on the device first. The 14 px lip cannot carry a 9 px sun with glow and an 18 px moon without touching either the ticks (r 202–211) or the edge.
9. **Sunrise accuracy.** The fixed-centre formula gives 07:11 / 17:53 on 25 Oct (real Seoul ~06:50 / 17:40); the appendix's 06:47 / 17:36 does not come from the formula. Add the equation of time: centre_deg = 7.95 - 0.25 * EoT_min, EoT_min = 9.87 sin(2B) - 7.53 cos(B) - 1.5 sin(B), B = rad(0.9863 * ([DAY_OF_YEAR] - 81)). All functions verified available. Without it the sun sits on the dark lip for ~20 minutes after real sunrise in autumn.
10. **Section 9 honesty.** Remove "zodiac: partial" from the surviving functions, and either drop the ecliptic/zodiac ticks (lit pixels, invisible at 40 mm) or label them texture.
11. **Ambient vault.** Either put `vault_ambient` inside the drift group (Polaris) or drop the ambient vault entirely: it is 24 dots at 21 % luminance for a 588 px bitmap that the memory evaluator resizes to ~627 px = 1.57 MB RGBA in ambient, and it is the only ambient use of the off-canvas pivot.
12. **Measure the way Samsung measures.** Bake the ambient frame at 480 px and count every pixel with any non-zero channel (the on-pixel-ratio definition) before quoting 7–10 %; the memory footprint evaluator from `google/watchface` for the 10 MB ambient / 100 MB interactive limits.
13. **Document the hard-coded zone.** `[HOUR_0_23_MINUTE] - 9` and 126.98 E are Seoul constants; outside KST the vault and sun are wrong by the zone difference. Fine for a personal face; say so in the design system.

---

## KEEP (genuinely strong)

- **Opaque bridge core under the digits.** The single best legibility decision of the round: no star can ever touch a numeral, the digits never move or scale, and contrast is 18 : 1. Keep the 100 % core x 110–340 exactly as specified.
- **Information hierarchy with a hard size floor.** Every information string >= 13 px; the three colour families (paper/phosphor = information, green structure = instrument, grey/teal/gold = sky) are what keep a four-level stack readable at a glance. Keep the rule "gold never on text, grisaille never on text, phosphor never on sky".
- **AOD design.** Haze, shadow, gauges, seconds and bevel off; thin rims held at 2.3 % luminance; digit stroke the ceiling at 37.5 %; nothing per-second; 7–10 % lit. Keep the drift idea (scoped to AOD, fix 2).
- **1 Hz stepped seconds**, and the refusal to sweep. Correct for battery and correct for the brief.
- **The sidereal mapping is right.** Verified: horizon circle radius 225.02 centred 178.35 px south of P (dial edge = horizon), P (225, 47), zenith (225, 114.6), equator r 137.2 with its meridian point at y 184 under the bridge, ecliptic r 149.5 offset 59.5, chart edge r 294.2 = dec -40 = altitude 12.4 deg, chart/dial crossing at y 236.6; LST expression gives 177.42 deg at 2026-10-25 10:08 KST against an independent JD-based computation of 177.42 deg; rotation direction correct (east on the left, culmination at the bottom, 0.2507 deg/min = 1.0 px/min at r 230).
- **WFF choices that check out against the schema and references.** `x`/`y` are `xs:integer` (negative legal, so the off-canvas vault group is schema-valid; runtime clipping still to be tested as the proposal says); TimeText `format` regex `(h{1,2})|m{1,2}|s{1,2}` allows `hh` and `mm` alone, `hourFormat="24"` allowed, Variant unbounded inside TimeText; Arc `startAngle`/`endAngle` transformable with 0 at 12 o'clock and angle types unrestricted floats; `%` on floats, ternary, `numberFormat`, `clamp`, `rad`, `round` (returns integer) all documented; `[HOUR_0_23_MINUTE]` is a float 0–23.98, `[MOON_PHASE_POSITION]` an integer 0–28 days since new moon (so the moon steps 12.19 deg once a day — fine for an instrument), `[DAY_OF_YEAR]` 1–366, `[UTC_TIMESTAMP]` ms, `[SECONDS_SINCE_EPOCH]` is v3+; memory limits 10 MB ambient / 100 MB interactive with bitmaps counted decompressed and resized to the screen.
- **Wake order deepest-first and reduced-motion = instant.** Keep.

---

## Verification log

| Claim | Method | Result |
|---|---|---|
| Horizon circle r 225, centre 178.3 south of P | stereographic r = 137.2 tan(pd/2), lat 37.57 | 225.02 / 178.35 — exact |
| Zenith (225,115); equator r 137; ecliptic r 150 offset 60; chart r 294 = dec -40 | same | 114.6 / 137.2 / 149.5, 59.5 / 294.2 — exact |
| LST 177.4 deg at preview time | JD 2461041.5-based GMST + 126.98 | 177.42 — exact |
| Sidereal 0.2507 deg/min, 1 px/min at r 230 | arithmetic | 0.2507 / 1.006 — exact |
| Sunrise 06:47 / sunset 17:36 (appendix) | proposal's own formula, DOY 298 | formula gives 07:11 / 17:53 — inconsistent; needs EoT |
| "Everything inside r 171" (well) | Roboto Mono 0.6 em advance, 0.711 cap | "6,240" r 175.4; "12,345" r 181 — false, clipped by ring |
| Date–digit clearance | glyph metrics | 5.5 px (v4: 15 px) |
| Sky windows: cap + two lower flanks | pixel census 450x450 | open sky 16.4 %; flanks 652 px² — flanks claim false |
| AOD ~6.9 % strict, 8–9 % measured | recount with AA model; dragon ink measured in v4 preview | 9.8 % at 35 % ink; ink is 8.6 % -> ~7 %; under 15 % either way |
| v4 AOD 11.3 % | same counter on preview-ambient.png | 11.29 % — method consistent |
| Luminance ceiling 42 % (#91AD80) | WCAG relative luminance | 37.5 % |
| Contrast 17:1 on the core | WCAG | 18.2 : 1 |
| Negative Group x/y | geometricAttributes.xsd (v4) | `xs:integer` — schema-legal |
| TimeText `format="hh"` / `"mm"` | timeText.xsd regex | allowed |
| Arc angles transformable, 0 = 12 o'clock; negative / > 360 | Arc reference; angleType.xsd | transformable; unrestricted float; runtime wrap untested |
| Variant startOffset/duration semantics | Variant reference | 0–1 fractions; startOffset ignored only if sum > 1 |
| Data sources (HOUR_0_23_MINUTE float, MOON_PHASE_POSITION 0–28, DAY_OF_YEAR, UTC_TIMESTAMP, SECONDS_SINCE_EPOCH v3) | SourceType reference | all as the proposal states |
| Expression functions (% float, ?:, numberFormat, clamp, rad, round) | arithmetic-expression reference | all documented |
| Memory 10 MB ambient / 100 MB interactive | memory-usage guide | confirmed; bitmaps counted decompressed, resized |
| Samsung AOD 15 % guideline | Samsung WFS always-on guide | confirmed; OPR = pixels with any RGB value |
| PartImage Variant count | PartImage reference | one Variant per PartImage; Transform unbounded |
