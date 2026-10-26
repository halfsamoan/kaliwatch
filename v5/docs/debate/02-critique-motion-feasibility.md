# Critique 02 — "Celestial Vault" motion proposal, WFF v4 feasibility lens

Reviewer stance: Watch Face Format v4 engineer who has to ship this on an SM-R965N (480x480) with no JavaScript. Adversarial by instruction. Every technical claim below was checked against the v4 XSD in google/watchface (`third_party/wff/specification/documents/4`), the developer.android.com WFF reference pages, and the memory-footprint evaluator source (`play-validations/memory-footprint`).

**Score: 5 / 10.** Verdict: the architecture (well, flange, horizon ground, seven time-scales on one meridian index) is the right translation of Galaxia and the astronomy survives as WFF expressions. But as specified the stack is not perceivable on the panel (every shadow lands on near-black), the orbiting bodies collide with the telemetry and vanish behind the dragon at noon, the approved AOD outline digits cannot be built on a DigitalClock, and several expression/schema details are wrong. Fix before anyone bakes a PNG. Do not ship.

---

## 1. Direct answers to the four questions

### 1.1 What cannot be expressed as PartImage / PartDraw / PartText + Transform + Variant?

| Item in the proposal | Expressible? | Evidence |
|---|---|---|
| Outline-stroke digits on the DigitalClock (z10 AOD) | **No.** TimeText's Font accepts only family/size/color/slant/width/weight (clock/timeText.xsd). `Outline`, `Shadow`, `OutGlow` exist, but only inside a PartText `Font` (decorationGroup.xsd via textComponentGroup). The proposal's statement "WFF Font has no stroke" is wrong in both directions. | v4 XSD |
| Numeric font weight `600` | No. Weight is an enum: THIN … SEMI_BOLD, BOLD … EXTRA_BLACK. Use `SEMI_BOLD`. | timeText.xsd, fontElement.xsd |
| `[TIMEZONE_OFFSET_MINUTES_DST]` | Does not exist. `TIMEZONE_OFFSET_DST` exists and is a **String in hours**. Arithmetic on it is unverified. | source-type reference |
| `subText("ARITAU…", floor(L/30)*3, 3)` | Wrong call. `subText(string, start, end)` with end exclusive (doc example `subText("abc def",2,5)` = `c d`). Must be `start, start+3`. | arithmetic-expression reference |
| `numberFormat("00", x)` zero-padding | Unverified. Documented pattern characters are `#`, `,`, `.` only. Zero padding via `0` is not documented. | arithmetic-expression reference |
| OS-level reduced motion | No data source. The BooleanConfiguration + duplicated scene tree is the only route; `duration` on Variant is a literal, not an expression. | variantElements.xsd |
| 360 ms wake / 180 ms sleep asymmetry | No. Variant `duration` is "normalized … dependent on each vendor's ambient transition time". The watch decides the absolute time and plays the same table both ways. | variantElements.xsd documentation |
| Mid-flight retargeting policy (4.5) | Not specifiable; renderer-owned. Correctly acknowledged. | — |
| `clipShape` on `Scene` | Wrong element; it is an attribute of `<WatchFace>` (see the existing KALIWATCH watchface.xml). | existing XML |
| Gaussian halos, blurred Milky Way, drop shadows, brushed alloy | Yes, but only as baked PNG. Fill/Stroke do accept Linear/Radial/SweepGradient, so the time plate can be a `PartDraw > Ellipse > Fill > RadialGradient` instead of a 180 KB PNG. | fillElement.xsd, radial-gradient reference |
| 180 ms per-second escapement tick | Yes: `Transform target="angle"` + child `Animation duration="0.18" interpolation="EASE_OUT" angleDirection="CLOCKWISE"`. **But `fps` defaults to 15**, so 180 ms = 2–3 frames = a visible two-step jump, not an ease. Set `fps="30"` or `"60"`. | animationElement.xsd |
| Variant on `angle`, `scaleX/Y`, `tintColor` | Yes. All are transformable on Group/PartImage; `angleDirection` on Variant "is affected only when the target is an angle". | groupElement.xsd, variantElements.xsd |
| Moon phase bitmaps by `Condition` on `[MOON_PHASE_TYPE]` (0–7) inside a rotated Group | Yes. Condition may contain Group/Part*/DigitalClock. | conditionElement.xsd |

Everything else in section 6 (Arc endAngle transform, Stroke cap on the Stroke element, PartImage alpha/angle, two cross-faded DigitalClocks, PartText Templates with Parameters, Rectangle width transform for gauges) is valid v4.

### 1.2 Memory budget

Proposal says 3.2 MB. Actual ARGB_8888 decode of the named bitmaps:

| Bitmap | px | bytes |
|---|---|---|
| vault_active, vault_ambient | 2 × 400×400 | 1,280,000 |
| ground_shadow | 450×450 | 810,000 |
| time_plate | 300×150 | 180,000 |
| flange_active, flange_ambient | 2 × 450×450 | 1,620,000 |
| dragon_active, dragon_ambient | 2 × 190×133 | 202,160 |
| sun, sun_ring, moon_0..7, moon_ring | 2×576 + 9×144 | ~9,800 |
| **Total** | | **≈ 4.10 MB** |

Not 3.2 MB. It still passes with a huge margin, but the comparison the proposal makes ("3.2 MB under 10 MB ambient") is the wrong comparison. The evaluator (`WatchFaceLayoutEvaluator` → `ActiveMemoryFootprintCalculator` / `AmbientMemoryFootprintCalculator`) computes:

- **Active**: sum of resources of nodes not hidden in interactive (`VariantConfigValue.isNodeSkipped` skips nodes whose effective alpha is `"0"`; the ambient-only images carry `alpha="0"`, so active ≈ 2.5 MB). Limit 100 MB.
- **Ambient**: `450*450*numLayers*4` (810 KB per full-screen layer, up to 3 layers) **plus** resources of dynamic nodes only. Static PartImages are composited into layers and not counted individually. Expect ≈ 2.4–3.3 MB. Limit 10 MB.
- Configurations (the reduced-motion duplicate tree) are evaluated per option and the **max** is taken, so duplication does not double the footprint. Duplicate resources are deduplicated by SHA-1 in ambient.

Note the evaluator always evaluates at 450×450, and it "resizes to better fit the screen" — so supplying 2× PNGs (section 3, fix 7) costs nothing extra in the reported footprint.

### 1.3 Does the sidereal / sun / moon maths survive as expressions?

Yes, after four corrections. Verified by hand against the proposal's own sample state (2026-10-25 10:08:24 KST):

- `DINT = 365*(Y-2000) + floor((Y-1997)/4) + DOY - 1` → 365·26 + 7 + 297 = **9794** (correct: 2000, 2004 … 2024 leap days = 7). Breaks only at 2100.
- `DFRAC = (10.14 − 9)/24 − 0.5 = −0.4525` (proposal wrote −0.4528; irrelevant).
- `GMST = 280.46061837 + 0.98564736629·9794 + 360.98564736629·(−0.4525) = 9770.54 mod 360 = 50.5°`; `LST = 50.5 + 126.978 = 177.5° = 11h50m`. ✔ (late-October 10 AM, LST ≈ RA_sun − 2h ≈ 12h.)
- Dropping `360·DINT` from GMST is exact modulo 360; every term stays below 10^4, so even a float32 engine keeps ≈0.001° precision. The small-number formulation is genuinely good — keep it.
- EOT on day 298: B = 214.0°, EOT = 9.15 + 6.24 + 0.84 = **+16.2 min** ✔; solar noon 12:16 KST ✔ (Seoul mean-solar noon 12:32 from 135°E − 126.978°E = 32.1 min ✔).
- Sun longitude: L = 214.9°, M = 290.8°, λ ≈ 213.1° → index 7 → **SCO** ✔.
- Orientation is internally consistent: top = upper meridian (south), bottom = north horizon/ground, east on the right; RA increases clockwise on a sky-up chart, so `VAULT_ANGLE = (720 − LST) % 360` puts RA = LST at 12 o'clock and the sky turns CCW, the sun pointer `(noon − hour)·15` turns CCW and sits radially outside the sun's true ecliptic point (its hour-angle direction equals the sun's RA direction on the rotated vault). First-quarter moon at sun + 90° clockwise rises at noon ✔.
- The horizon circle (centre (225,79.7), R 206.7) matches the true Seoul horizon in the equidistant projection: east/west points (78,225)/(372,225) exact (dec 0 = 147 px), north point (225,286) exact (37.57° = 61.4 px), NE azimuth-45 point off by 1.3 px. ✔
- `%` on floats is documented ("19.0 % 7 is 5.0"); `sin` is Java `Math.sin` (radians) and the proposal already wraps with `rad()`. ✔

Required corrections: (1) replace the non-existent minutes TZ source with a hard-coded `− 9` (Korea has no DST; longitude and latitude are already hard-coded, so this is consistent) or verify arithmetic on the String `TIMEZONE_OFFSET_DST`; (2) `subText(s, i*3, i*3+3)`; (3) zero-padding of LST hours/minutes needs a ternary parameter (`floor(LST/15) < 10 ? "0" : ""`) or show LST in degrees — `numberFormat("00", …)` is undocumented; (4) `[MOON_PHASE_POSITION]` is 0–28, so clamp the elongation (`clamp(...,0,28)*12.19`) and accept the once-a-day 12° jump (R7 is honest).

### 1.4 Does the studio (SVG) over-promise what the watch can do?

Yes, in five concrete places:

1. **Timing**: the studio plays 360 ms wake / 180 ms sleep with WAAPI at 60 fps and retargets mid-flight. The watch plays one vendor-defined transition in both directions from the same Variant table; absolute duration unknown, reversal behaviour undocumented.
2. **Outline digits**: SVG `stroke` on text has no DigitalClock equivalent (1.1). The studio AOD will look different from the watch AOD unless the design is changed to what WFF can draw.
3. **Sub-pixel sky**: 0.7 px dust, 0.8 px constellation lines and 1.2 px star cores render crisply in SVG. On the watch the 400 px bitmap is resampled twice (rotation by an arbitrary angle, then 450→480 scaling). Expect 1.2 px cores to become 2 px smudges at ~50 % intensity and dashed hairlines to shimmer as the vault turns.
4. **Per-second tick**: SVG eases at 60 fps; the WFF `Animation` defaults to 15 fps.
5. **Perceived motion**: "Over ten minutes the Big Dipper visibly shifts 2.5 deg" is 2.2 px at the Dipper's radius (~55 px) — invisible. The vault is alive on the scale of hours, not minutes. Sell it as "a different sky in the morning and the evening", not as motion.

---

## 2. FATAL flaws (the user says "still flat", a hard constraint breaks, or it cannot be built)

**F1 — Chiaroscuro painted on near-black is invisible; the stack is specified but not perceivable.**
The vault base is #050A08 → #0A1512 (relative luminance 0.3 % → 0.6 %, L* ≈ 2 → 6). The three occlusion cues the proposal relies on — well shadow (75 % black), dragon shadow (60 % black), time plate (58 % black) — all land on that surface. A 75 % shadow takes L* 6 to L* 2: ΔL* ≈ 4, about one just-noticeable step, on a 40 mm panel in daylight effectively nothing. Only across the Milky Way band (#16302C @55 % → L* ≈ 13) does a shadow reach ΔL* ≈ 8 and become visible — a thin diagonal ribbon. The 1 px flange rim light (#4C6A50 @70 %) is 0.08 mm on the 480 px panel. Net result: a black disc with a star texture, a grey ring, and the same dragon — v4 with wallpaper. This is exactly the failure the brief forbids. Galaxia's grisaille works because the vault is grey enamel with white laid on top; shadows need a mid-tone to fall on.

**F2 — The sun and moon orbit through the information.**
Proposal's own sample state: `MOON_ANGLE ≈ 215°` at radius 178 → (122.9, 370.8), which is on the battery gauge (y 366, x 97–169) and under the battery value. The sun at radius 190 (glow to 200) sweeps the lower half every night: at 135° it is at (359, 359), inside the STEPS value box; at 150° its glow touches the prompt. The proposal's "safe radius r ≤ 176" check only tested text chords; the gauges reach r = 190.4 at (97,366), the prompt corners r = 184. The brief says time/date/battery/steps are the information; moving decoration may not cross them.

**F3 — The hero moment is hidden behind the dragon.**
z7 SUN is drawn under z9 DRAGON. The dragon frame spans x 135–315; at radius 190 that is ±28.3°, so the sun pointer is behind the dragon's neck/wings for ≈3.8 h around solar noon — precisely when "the sun crosses the meridian index" is supposed to be read. The minute rim at r 197.5 likewise starts its hour under the dragon (0–27° ≈ the first 4.5 min, and that segment stays hidden all hour). The proposal's "straddles the rim" claim is 1 px (top of wings y 24 → r 201 vs lip r 200): it will not read as mounted on the flange.

**F4 — The approved AOD outline digits cannot be built as specified.**
TimeText's Font has no `Outline`/`Shadow` children in the v4 XSD. The alternatives both change the design or carry an unverified AOD-update path: (a) PartText `%s:%s` with `[HOUR_0_23_Z]`/`[MINUTE_Z]` + `Font > Outline` — the ambient tooling treats only AnalogClock/DigitalClock/ComplicationSlot (and PartText with a *minute-level* expression, `isNodeOldStyleDigitalClock`) as dynamic; a PartText with `[MINUTE_Z]` only passes that detector because of the `MINUTE` substring, and whether the AOD compositor on the Watch6 actually re-renders it each minute is unknown; (b) the Light-weight DigitalClock fallback changes glyph shapes between AOD and Active, i.e. the digits visibly morph on wake, against "never moves or scales". R5 is listed as a risk; it is a decision that must be made now because it changes the AOD look the user signed off on.

**F5 — AOD rotation of the vault/sun/moon is asserted, not verified, and the proposal's nesting is the wrong way round for the tooling.**
`AmbientMemoryFootprintCalculator` encodes the platform's ambient model: "in ambient we only render once per minute and things with hours are treated as static and baked into a layer"; the offloadable minute-level sources are `MINUTE, MINUTE_SECOND, MINUTE_Z, HOUR_*_MINUTE, UTC_TIMESTAMP`; a rotating element is recognised as a clock only when a **Part\*** node carries a `Transform target="angle"` whose value contains one of those sources (`isNodeOldStyleAnalogClock`). The proposal puts every rotation on a **Group**. If the device offloads AOD rendering (the evaluator even has `--apply-v1-offload-limitations`: max 2 layers, 2 clocks), a Group-driven sky may freeze at the entry angle for hours. Not fatal to the look (0.25°/min is invisible) but fatal to the "real sky, still rotating in AOD" claim and to the burn-in argument that depends on it.

---

## 3. Required FIXES (concrete)

1. **Lift the vault to grisaille mid-tones.** Base #101C17 → #1C2C25 (L* ≈ 9 → 17), Milky Way #2E4A40 @70 % (L* ≈ 28 in the band), lines #3C5A4C. Well shadow 85 % → 0 over r 200 → 176 (24 px, not 14). Dragon shadow 70 % offset (+3,+6) blur 5. Keep the plate (it now does real work). Acceptance test in the studio export: ΔL* ≥ 10 across every occlusion edge (lip, dragon, plate) measured on the exported PNG, not eyeballed. Re-check digit contrast: #EFF8EC on L* 17 behind a 58 % plate is still > 12:1.
2. **Make the lip read at 480 px.** Flange inner rim light 2 px #6C8A6E with a 6 px falloff; a 1.5 px dark line at r 199 (the lip's own inner shadow); minute ticks 1.5 px. Nothing structural below 1.5 px in the 450 space.
3. **Mount the dragon on the flange for real.** Dragon frame y 10 (or flange inner radius 188) so the wing tips overlap the raised ring by ≥ 12 px, with the baked shadow crossing the lip. That is the single strongest occlusion cue the composition has.
4. **Take the orbiting bodies out of the well.** Sun on the flange groove at r 212 (disc r 4.5, glow r 8) and moon on the lip at r 198, both drawn **above** the dragon (new z-order: … z5 flange, z9 dragon, then sun, moon, seconds, inscriptions). Then the dragon can never cover the pointer at noon, and telemetry stays legal as long as it stays inside r ≤ 190: gauges end at r 190.4 today — shorten them to 64 px (x 101–165 / 285–349, y 364 → r ≤ 187) and keep the prompt at y 388 (r 184). If the sun must stay inside the well, then the dragon has to move down and the gauges/prompt have to come inside r ≤ 172 — pick one, both is not allowed.
5. **Decide the AOD digits now.** Safest: DigitalClock, same SEMI_BOLD glyphs, fill #4F6E48 (no outline, no weight change, nothing morphs on wake) — honest and burn-in cheap. If the outline look is non-negotiable: PartText `%s:%s` + `Outline color="#91AD80" width="1.4"` and a **device test that AOD updates each minute for ≥ 2 h** before committing; the 10-PNG `Condition` glyph route has the same test requirement.
6. **Flip the Variant/Transform nesting.** Time-based `Transform target="angle"` goes on the **PartImage/PartDraw** (matches the tooling's clock detector); the wake parallax `Variant target="angle"` goes on the **parent Group**. Keep at most two such rotating Parts visible in AOD (vault + sun ring; drop the moon ring in AOD) so the face stays inside the V1 offload budget if it is enforced. Then run the evaluator twice, with and without `--apply-v1-offload-limitations`, and verify AOD rotation on the watch.
7. **Bake the vault at 2×** (800×800 PNG into the 400×400 box) with star cores ≥ 2 px and lines ≥ 1.2 px, so the renderer downsamples instead of upsampling through two resampling passes. Footprint is unchanged (evaluator resizes to screen).
8. **Expression hygiene**: hard-code `− 9` for Seoul (or prove String arithmetic on `TIMEZONE_OFFSET_DST`); `subText(s, i*3, i*3+3)`; zero-pad with a ternary or show LST in degrees; `weight="SEMI_BOLD"`; `clipShape` on `<WatchFace>`; `Animation fps="30"` on the seconds Transform and the trail Arc; `clamp([MOON_PHASE_POSITION],0,28)`.
9. **State the memory honestly**: 4.1 MB raw / ≈2.5 MB active / ≈3 MB ambient by the evaluator; cite the tool's numbers, not an estimate.
10. **Decide the AOD +4° offset.** `Variant angle 4` means the AOD sky is permanently 4° (16 sidereal minutes) wrong. Either document it as a flourish or drop the vault parallax and keep the seconds' −14° (alpha 0 in AOD, so free) and the dragon's 0.96 scale as the parallax pair.
11. **Rewrite the motion claims**: sidereal drift = 0.85 px/min at the rim; the only perceptible motions are the wake and the escapement tick. That is what the brief wants; say so.

---

## 4. KEEP (genuinely strong, verified)

- **The well / flange / horizon-ground architecture.** The horizon maths is right to ~1 px, the ground lens falls exactly where the terminal inscriptions belong, and "white transferred inscriptions on the deepest black level" is the correct reading of Galaxia.
- **One fixed meridian index carrying seven time-scales** (second, minute rim, civil digits, 24-h sun, sidereal vault, zodiac via the pointer crossing the ecliptic, lunar age via elongation). The pointer-crosses-the-ecliptic-at-the-sign construction is exact by geometry, not a second ring — that is clever and cheap.
- **The small-number GMST/LST formulation** (DINT/DFRAC): verified numerically, float32-safe, and the EOT and sun-longitude approximations give the right noon and the right sign for the sample date.
- **Polaris behind the colon, colon does not blink.** The one fixed point of the sky under the one fixed element of the face is the best idea in the proposal.
- **The wake choreography** (deep → front, counter-rotating parallax, shadows born on wake) and the Variant fraction table: every `startOffset + duration ≤ 1.0`, `CUBIC_BEZIER` with `controls` exists, `angleDirection` exists. Schema-valid as written.
- **The nested-Group rule** (Variant and live Transform never on the same attribute) — right principle; only the direction of nesting needs flipping (fix 6).
- **Escapement tick via Transform + Animation** with `angleDirection="CLOCKWISE"` (handles 59 → 0 correctly); just set fps.
- **Telemetry stays in place between AOD and Active**; AOD luminance budgeting method; terminal DNA and INFINITY preserved; official dragon path unchanged with provenance.
- **Baked materials as PNG swaps** (R1 mitigation) and the gradient-based plate alternative — both correct for WFF.

---

## 5. Risk register additions (beyond R1–R11)

- **R12** AOD compositor behaviour on SM-R965N for expression-driven rotations outside AnalogClock/DigitalClock is undocumented; test ≥ 2 h in AOD with a photo at entry and exit.
- **R13** Vendor ambient-transition time is unknown; the nine-stage stagger may compress into < 250 ms. Test with the stagger collapsed to three stages (sky/well → lights → digits+terminal) as the fallback table.
- **R14** Two resampling passes on the vault bitmap (rotation + 450→480 scale) — fix 7 mitigates; verify with a macro photo.
- **R15** `numberFormat` zero-padding and String arithmetic on `TIMEZONE_OFFSET_DST` must be run through the official validator before the readout is committed.
- **R16** Samsung AOD brightness boost on the dragon's 18 % fill and the #91AD80 outline — keep the dragon_ambient-without-fill kill switch (R10) and a fill-only digit variant.
