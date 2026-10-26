# Critique 02 — proposal 01 "Celestial Vault" (KALI lens), WFF v4 feasibility

Reviewer lens: the engineer who has to ship this on a Galaxy Watch6 Classic (SM-R965N, 480x480) as Watch Face Format v4 XML with no JavaScript. Adversarial by assignment.

**Score: 5 / 10.** Right skeleton, wrong tonal values. The layer stack is the only proposal element on the table that answers "not one-dimensional" with information instead of decoration, and the astronomy survives as WFF expressions. But as specified it will render on the OLED as hairlines, stars and text on black — i.e. still flat — with a mirror-image sky and a third seconds indicator that is a decorative loop. Every fatal item is fixable without changing the concept; none is fixable after the PNGs are baked.

What I verified myself (not taken from the proposal): WFF reference pages for ArithmeticExpression, source-type, Variant, Transform, PartImage, Group, Arc, TimeText, DigitalClock, Font, Outline, and the memory-usage page; the LST epoch, sample LST, EoT/hour-angle, H0 linearisation and the horizon curve with an independent script (`scratchpad/calc/kali_critique_check.py`); the Wear OS 6 / One UI 8 Watch rollout to the Watch6 Classic (Korea, 2025-11-19).

---

## 1. FATAL

### F1. Every depth cue lands on a surface the OLED cannot show darkening on
The proposal's depth is occlusion: the hour ring's 65 % black inner shadow onto the vault, the dragon's 60 % cast shadow onto the sky, the smoked-glass slot at 55 % black with a 70 % top-wall shadow. All of those fall on the vault base, which is specified as `#06100C` -> `#0B1A14`. Relative luminance: `#06100C` = 0.4 %, `#0B1A14` = 0.9 %. A 65 % shadow takes 0.9 % to 0.3 %; a 55 % glass takes it to 0.4 %. Those steps are below what an OLED at any brightness resolves (black crush starts around 1-2 %). Result on the wrist: the ring reads as a 1 px grisaille circle, the slot reads as one 1 px highlight line under the digits (a divider, the flattest possible cue), the dragon's shadow does not exist. The one surface with visible tone is the ring floor (`#163A3C` = 3.5 %), which is why the ring will look like a thin coloured band and nothing else will look sunken. This is exactly the failure the user already rejected in v4, reproduced with more layers. The proposal's own Risk 9 half-admits it ("at low brightness the ring shadow can vanish") — it vanishes at every brightness, because the thing it shadows is already black.

### F2. The material layer is sub-pixel after the 450 -> 480 resample, and "bake at 2x" is undone by the platform
The "enamel" is 1-1.5 px bevels, a 0.9 px constellation stroke at 22 % alpha, 1 px indexes at 45 %, 9 px numerals, 9 px zodiac glyphs at 35 %. The XML is authored at 450 and the device is 480, so every bitmap is resampled by 1.0667 and every 1 px line becomes a 2 px smear at half intensity. Risk 3 proposes baking at 2x; the memory-usage page says the system first applies "Resizing to better fit the screen" before budgeting, i.e. oversize assets are downsampled to the screen anyway, so 2x authoring buys nothing on device. A 0.9 px line at 22 % of `#B8C4BE` over black is ~0.5 % luminance after resampling: invisible. The brief's own rule ("anything thinner than ~1 px at 450 or smaller than ~11 px is decoration only") is violated by the zodiac band, the 24 numerals and the constellation lines — which together are most of the vault's content.

### F3. The sky is mirrored (and the sun and hour ring with it)
Specified: RA 0h at 12 o'clock, RA increasing counter-clockwise, vault turning clockwise, east at 9 o'clock. That is the view from outside the celestial sphere (a globe), not the sky over Seoul. Check with real stars at the sample moment (LST 11h50): Vega (RA 18.6h) is 6.8 h east of the meridian, so from Seoul it is on the observer's right when facing Polaris; the proposal puts it on the left. Circumpolar stars turn counter-clockwise about Polaris from the northern hemisphere, which is why the Galaxia's Cosmotourbillon orbits anticlockwise (brief, item 4). In the proposal the vault, the sentinel and the sun all run the wrong way, and the hour ring's 06 (sunrise) sits at 9 o'clock where west is. Risk 2 flags "if my handedness is wrong"; it is wrong, and it is a bake-time decision, not a device-test one.

### F4. The sentinel cage spin is a decorative loop and a third seconds display
The face already shows seconds twice (flange trail + marker, `SEC nn`). The sentinel "spins once per minute" at 6 deg per second on a 3-fold-symmetric reticle: a perceptible infinite loop that carries no information the eye does not already have, which the brief forbids ("no infinite decorative loops at perceptible speed"). The JLC cage is justified by a real escapement; here there is nothing to show. It also adds a per-second rotated PartImage nested in a rotated Group to the per-frame work.

---

## 2. WFF v4 feasibility — what can and cannot be expressed

Verdict: 95 % of the proposal maps onto documented WFF constructs. The exceptions are below.

| Claim in proposal | Verified status | Consequence |
|---|---|---|
| `[SECONDS_SINCE_EPOCH]` | Exists, Integer, **version 3**. `[MINUTES_SINCE_EPOCH]` also v3 | OK; face must declare version >= 3 (it needs 4 anyway) |
| `[TIMEZONE_OFFSET_MINUTES_DST]`, `[HOUR_0_23_MINUTE]` (float), `[DAY_OF_YEAR]` 1-366, `[MOON_PHASE_TYPE]` 0-7, `[BATTERY_PERCENT]`, `[STEP_COUNT]`, `[DAY_Z]`, `[MONTH_S]`, `[DAY_OF_WEEK_S]` | All documented | OK. `MONTH_S` gives `Oct`; wrap in `<Upper>` for `OCT` |
| `sin/cos` in degrees | **Not documented as degrees.** The reference links `sin()` to `java.lang.Math.sin` (radians) and provides `deg()` / `rad()` precisely for conversion | The EoT, SUN_DEC and H0 expressions are wrong by a factor of 57 unless written `sin(rad(2*B))`, `cos(rad(B))`, `sin(rad(B))`. The vault does not use trig, so it is unaffected |
| `%` modulo with large ints; float modulo | Documented: int % int = remainder; float operand -> float remainder | OK. `(([SECONDS_SINCE_EPOCH] - 1764586194) % 86164.0905) * 360 / 86164.0905` is legal and drift-free (literal 1764586194 fits a 32-bit int) |
| `floor`, `clamp`, `&&`, `||`, ternary, string literals | Documented | OK; 12-way zodiac text as nested ternaries needs parentheses per branch |
| `Variant` with `duration`, `startOffset`, `interpolation=CUBIC_BEZIER`, `controls`, `angleDirection` | All documented (format v4). `controls` default is written `<0.5, 0.5, 0.5, 0.5>`; the exact string syntax (space vs comma) is not shown | Wake sequencing is portable. Validate `controls` syntax with the validator; EASE_OUT is the safe fallback |
| Variant targets `alpha`, `angle`, `scaleX/Y` on Group and PartImage | All listed as transformable on both pages | OK |
| `Transform target="angle"` on PartImage, clockwise degrees about pivot | Documented | OK; the handedness fix is `value="360 - LST_DEG"` |
| `Arc` with `Transform target="endAngle"`, 0 deg at 12 o'clock | Documented; Arc takes `Stroke`, not `Fill` | OK as written |
| `DigitalClock` with `TimeText format="hh"` and `format="mm"` | **Not documented.** Documented patterns: `hh:mm:ss`, `h:mm`, `hh_10`, `hh_1`, `m`, `mm_10`, `mm_1`, `ss`, `ss_10`, `ss_1` | Use four TimeTexts `hh_10`, `hh_1`, `mm_10`, `mm_1` (see fix R5); this also reproduces the v4 colon kerning exactly |
| `Font > Outline` for the AOD digits | `Outline` exists (color required, `width` default 2.0 = distance outside the glyph edge); `Font` lists it as a child; `TimeText` lists `Font` as a child. The chain TimeText>Font>Outline is not shown end-to-end | Plausible; run the validator. Fallback BitmapFont of 11 glyphs at 47x78 px = 161 KB, trivial |
| `Condition / Expressions / Compare / Default` | Same construction as the existing `watchface.xml` | OK |
| 8 moon frames + 12 zodiac PartImages under Condition | Fine; 53 KB total | OK |
| "In WFF the same Variants play in reverse at the system's duration" (Active -> AOD) | Docs say only "transitions when entering and exiting ambient mode" are animated; reverse ordering of `startOffset` is not specified | Treat as unverified; test on device |
| Trig units in validator "verify" (Risk 4) | Resolved above: write `rad()` | — |
| Device supports v4 | One UI 8 Watch (Wear OS 6) reached the Watch6 Classic in Korea on 2025-11-19 | OK **if** the owner's SM-R965N is updated; check `adb shell getprop ro.build.version.release`. On Wear OS 5.x the Variant timing attributes do not exist and the 360 ms signature degrades to the system crossfade |

Nothing in the proposal is impossible in WFF v4. What is impossible is what the *studio* shows and the proposal silently assumes, see section 4.

### Memory budget (memory-usage page: ambient 10 MB, interactive 100 MB; bitmaps counted at 4 B/px after resize-to-screen and transparent-crop)
- Full-disc RGBA at 480: 921.6 KB each. The proposal names 8 full-disc assets (vault x2, horizon x2, hour ring x2, flange x2) = 7.37 MB, plus channel x2 (0.32 MB), dragon x2 (0.18 MB), moons, zodiac, outline glyphs, sun, sentinel (~0.3 MB). **Interactive total ~8.2 MB**, not "about 6 MB", but under 100 MB by a mile.
- Ambient: the evaluator models "up to three full-screen layers, two of which are static"; ambient set ~3 x 0.92 MB + fonts = ~3-4 MB. Under 10 MB.
- Annulus PNGs (ring, flange) get no transparent-crop benefit: bounding box is the full disc.
- So memory is not the risk. **Compositing is**: eight full-screen bitmaps, two of them rotated by expression, redrawn every second because `[SECOND]` is in the scene. v4 has two. Battery effect is unmeasured; halve it by merging (fix R7).

### Does the sidereal / sun / moon maths survive as expressions? Yes, with one correction (radians)
Independently recomputed:
- E0 = 2025-12-01 10:49:54 UTC: Seoul LST = 0.004 deg (proposal says 0h). Correct. Unix 1764586194 correct.
- Sample 2026-10-25 10:08:24 KST: true LST 177.52 deg = 11h50.1m; integer-modulo expression gives 177.64 deg. Correct; drift 0.14 deg/yr with 86164, zero with float 86164.0905.
- EoT on DOY 298 = +16.2 min; SUN_HA = -31.86 deg; apparent noon 12:16 KST. Correct.
- H0 linearisation `90 + 0.83*dec` vs `acos(-tan dec tan 37.57)`: worst error over the year 0.56 deg. Correct claim (<1 deg).
- Horizon curve: (56,225) alt -0.08 deg, (32,184) alt -0.07 deg, (23,125) alt -0.17 deg, north horizon 70.4 px below centre. Correct; the zenith lands at (225,127), inside the dragon frame — fine.
- Star projection r = (90-dec) x 1.875: Vega (96.0; 319.8, 209.6), Capella (82.5; 143.9, 209.5), Sirius r 200.1 (outside r186, as stated). Correct — but see F3: these are the mirrored coordinates.
- Moon via `[MOON_PHASE_TYPE]` 0-7 is coarser than `[MOON_PHASE_POSITION]` 0-28; the 8-frame choice is deliberate and fine. The phase-type numbering (0 new, 1 evening crescent, 2 first quarter, ... 7 morning crescent) must drive the frame mapping, not an assumed 0 = full.
- Zodiac by DOY ranges: DOY 298 = Scorpio (296-325). Correct.

---

## 3. Hard-constraint audit
| Constraint | Status |
|---|---|
| HH:MM big, fixed, never scaled | Kept (x166/x284, baseline 252, 78 px) |
| Official dragon path | Kept; treatment changes only. But see R9: the "engraved" 1 px bevels on 2-4 px strokes will turn the logomark into mush after resampling |
| Phosphor identity, controlled secondary hues | Kept; three added hues each with one job — good |
| AOD same face, quiet, <15 % lit, no per-second motion, no loops | 7.2 % claimed; plausible (I did not recount pixel by pixel). Sidereal drift in AOD is allowed slow drift |
| No perceptible decorative loops | **Violated** by the sentinel cage spin (F4) |
| One wake transition <= 400 ms, depth revealed in order | Kept, 360 ms, deepest-first, documented Variant syntax |
| Portable to WFF v4 | Yes with fixes R3, R5, R6 |
| Real astronomy, Seoul | Maths correct, **handedness wrong** (F3) |
| Terminal DNA | Kept and improved (`SEC nn · LST hh:mm`, `kali@vault:~$ INFINITY`) |
| >= 3 depth planes with different time scales + material shading | Planes and time scales: yes. Material shading: specified but **not visible on device** (F1, F2) |

---

## 4. Where the studio renderer over-promises
1. **Tone.** The browser shows the 65 % / 60 % / 55 % darkenings on a calibrated monitor with a lit room; on the watch the same values on 0.4-0.9 % surfaces are black on black (F1).
2. **Sub-pixel bevels.** SVG anti-aliasing at 450 CSS px on a desktop renders 0.9-1.5 px lines crisply; the device resamples to 480 (F2).
3. **Colour interpolation of digit fill** `#11200F -> #EFF8EC` (studio) vs alpha cross-fade of two clocks (WFF). Admitted; fine.
4. **180 ms vs 360 ms asymmetry** and front-planes-first sleep ordering: WFF only guarantees "animated"; reverse ordering unverified. Admitted.
5. **Sentinel spin smoothness.** Studio animates at 60 fps; the watch steps 6 deg once per second, like the marker.
6. **"Bake at 2x"** does not survive the platform's resize-to-screen.
7. **Status line over the horizon hairline.** The hairline passes y ~282 at x = 225 +/- 81, exactly through the `SEC 24 · LST 11:50` band (y 267-281). On the studio canvas it looks like intentional layering; at 40 mm it is a line through text.

---

## 5. Required FIXES (in build order)
- **R1. Author at 480, natively.** `<WatchFace width="480" height="480">`; export every token x 1.0667 at build time; bake all PNGs at 480; never author at 450 or 2x. Keeps 1 px lines at 1 px.
- **R2. Lift the sky-side vault base** to relative luminance 3.5-4 % (ramp about `#2A3A33` at centre -> `#203029` at r186; L 3.7 % -> 2.5 %); keep the earth side at <= 1 % via the 78 % horizon darkening; keep the slot floor at ~1.5 % (55 % glass over the lifted vault). Then the ring's inner shadow is a 3.7 % -> 1.3 % step, the dragon's shadow and the slot's top wall exist, and the digits still sit at >= 14:1 contrast on the glass. The KALI "black" lives in the earth half, the slot and the void outside the sky; it is not lost. Keep ABYSS `#163A3C` (3.5 %) for the ring floor.
- **R3. Fix handedness before baking.** Bake RA increasing **clockwise** from 12 o'clock, east at 3 o'clock; vault/sentinel `Transform target="angle" value="360 - LST_DEG"`; sun `value="0 - SUN_HA"`; hour ring 06 at 3 o'clock, 12 at 12, 18 at 9, 00 at 6; horizon bitmap is symmetric so it is unchanged. Spot-check after the first device build: at LST 11h50 Vega must be on the right side of the disc. Accept that the 24 h ring now runs counter-clockwise like the sky — that is the astronomically honest reading, and the Galaxia's anticlockwise orbit is the precedent.
- **R4. Trig in radians.** `EOT_MIN = 9.87*sin(rad(2*B)) - 7.53*cos(rad(B)) - 1.5*sin(rad(B))`, `SUN_DEC = 23.44*sin(rad(B))`. Validate once with a fixed DOY.
- **R5. Digit clocks with documented formats.** Four TimeTexts: `hh_10` x119 w47, `hh_1` x166 w47, `mm_10` x237 w47, `mm_1` x284 w47 (Roboto Mono 78, 0.6 em advance = 46.8 px), colon as PartText x216 w18 in phosphor. Reproduces v4's HH centre 166 / MM centre 284 exactly, including the tightened colon.
- **R6. AOD digits.** Try `TimeText > Font(color #11200F) > Outline(color #91AD80, width 0.7)` (Outline width is measured outside the edge, so 0.7 ~ a 1.4 px centred stroke); if the validator rejects the chain, BitmapFont with 11 glyphs (47x78, 161 KB).
- **R7. Merge static full-disc layers.** Everything static that lies above the vault and below the dragon (horizon darkening + hairline, channel glass, hour ring, flange ticks and bevels) becomes two PNGs: `superstructure_active.png` and `superstructure_aod.png`. Moon, zodiac glyph and sentinel do not overlap the slot or the ring (moon r141, glyph r141, sentinel orbit r178 + 8 px just grazes the r182 shadow), so z-order among them is free. Result: 4 full-disc bitmaps instead of 8, half the per-second composite, and the wake still reads deepest-first (vault -> superstructure -> objects -> dragon -> text). Drop the 0.985 -> 1.0 ring scale "lift" (3 px over 180 ms is imperceptible and conflicts with merging).
- **R8. Cut the sub-legible layers.** Remove the zodiac band r170-182 (the zodiac is already the glyph at (354,168) and the `SCO` in the date line). Remove the 24 nine-pixel numerals; keep 24 indexes plus 00/06/12/18 at 11 px. Constellation lines: 1.3 px at >= 35 % or drop them; cap the catalogue at mag <= 3.0 (about 50 stars) so the vault reads as a sky, not noise. Milky Way wash: keep, it is the one mid-tone element.
- **R9. Dragon treatment.** No 1 px inner bevels on 2-4 px strokes; keep the flat phosphor fill, the 6 px glow and a cast shadow (dx 2, dy 4, blur 5, black 60 %) that now has a 3.7 % surface to fall on. The real depth cue is the apex at r197 overlapping the ring's lip; keep it.
- **R10. Sentinel.** No cage spin. Static reticle orbiting at `360 - LST_DEG`; during wake only, a one-shot `Variant mode="AMBIENT" target="angle" value="-360" duration="1.0"` on the reticle (plays 360 deg over the 360 ms wake, then sits). Seconds stay on the flange and the `SEC` text only.
- **R11. Sun above the dragon** (z-swap: sun Group after the dragon PartImage) so the only warm, moving object does not disappear for 40 minutes at its own culmination. Sun glyph becomes a small occluder over the apex, which is itself a depth cue.
- **R12. Expressions.** Vault angle from `[MINUTES_SINCE_EPOCH]*60` (v3, one update per minute, no floor()); float modulo `% 86164.0905`. `SEC nn` via a DigitalClock `ss` TimeText next to a `SEC ` PartText (numberFormat's documented pattern characters are `#`, `,`, `.` — no zero padding). LST minutes via `(m < 10) ? "0" : ""` ternary prefix.
- **R13. Horizon hairline** interrupted between x 140-310 so it does not pass through the status line; the atmosphere band may stay.
- **R14. Device checks before committing assets:** OS version (Wear OS 6 required for v4), `controls` syntax, reverse-order ambient entry, and whether the Classic's bezel lip hides anything at r > 215 (the existing face's `outer_ring` at r216 is the probe). If the lip hides 2-3 px, move the seconds trail to r212 and the minute ticks to r208-216.

---

## 6. KEEP (genuinely strong)
- **The stack of real clocks**: flange = seconds/minutes, hour ring = apparent solar day (with EoT and the 32 min Seoul offset), vault = sidereal day, objects = lunar month and zodiac month, glass = civil HH:MM. This is the Galaxia principle translated honestly, and it is the first proposal where "depth" means *information at different time scales*, not shading.
- **The fixed Seoul horizon** as the chiaroscuro that organises the dial: telemetry in the earth, dragon in the sky, stars switch off below the roofline. Geometry verified to 0.2 deg.
- **The astronomy** is correct and cheap: one epoch constant, no trig for the vault; EoT/H0 within 1 deg; all sources documented (v3) and the Variant timing documented (v4).
- **The invariants** the user approved are untouched: HH:MM geometry, official dragon path, phosphor as the only "live" colour, INFINITY, 360 ms wake, quiet AOD (~7 %, hairline dragon instead of v4's filled one — a real burn-in improvement).
- **Deepest-first wake** via `startOffset`/`duration` fractions is exactly how WFF v4 wants it written.
- **Three added hues with one job each** (grisaille, sun gold sharing the hue of the existing warning colour, abyss teal) — disciplined, and the only route to "painted enamel" on an OLED.
- **Terminal readout** `SEC nn · LST hh:mm` and `kali@vault:~$ INFINITY`: LST on a terminal line is the one place where the instrument and the KALI identity are the same object.
- **The epoch-asset strategy** for the painted planets and the honest Risk 8 about regenerating them yearly.

---

## 7. One-paragraph verdict
Build this concept, not this spec. Re-author at 480, lift the sky to a visible grisaille so the shadows have something to fall on, flip the handedness, write the trig in radians, replace the undocumented `hh`/`mm` clocks with digit-cell clocks, merge the static layers, and cut the sentinel spin and the sub-pixel band. After those, the same proposal is an 8: the layered clocks are real, the maths is already right, and nothing in it is outside documented WFF v4.
