# Critique 02 — Proposal 01 "Celestial Vault" (horologist lens)
Reviewer: adversarial Wear OS reviewer (readability, AOD lit pixels, burn-in, battery)
Target: Galaxy Watch6 Classic SM-R965N, 480 x 480 round, 1.5 in (37.3 mm) => 1 design px = 1.067 device px = 0.083 mm (the proposal's 0.089 mm assumes a 40 mm dial; use 0.083).

## Score: 5 / 10 — do not build as written

The architecture is right and almost everything in section 8 is buildable (I verified every WFF element and data source named). What fails is what the user will actually *see*: the tones that are supposed to carry the "section you could cut with a saw" are all below 1.2 % luminance, so on an OLED they are black. As specified, the face renders as v4 plus a star chart. Second, the AOD spec contradicts itself and, read literally, breaks the 15 % lit-pixel cap. Both are fixable without touching the architecture; with the fixes below this is an 8–9.

---

## Answers to the five mandatory questions

**1. Can HH:MM be read in under one second at 40 mm with that sky behind it?**
Yes, but only because the glyphs are big. Computed contrast of #EFF8EC digits: 19.3:1 on black, 15.7:1 on fired enamel #0B1E26, 5.6:1 on the worst case (14 % L Milky Way band passing under a glyph). Glyph stroke at 78 px Roboto Mono 600 is ~9 px; the largest star is 2.6 px; a star cannot break a stroke. So the time is readable. What is *not* delivered is "terminal cleanliness": ~130 stars, 20 stick figures and a Milky Way band rotate under the digits, and the digits' cast shadow is black on a 0.3 % L base, so it is invisible except where it happens to land on a star. Required: make the proposal's own fallback (25 % black soft ellipse (225,228) rx 150 ry 52 on the shade layer) mandatory, and cap stars inside r < 120 at mag <= 2.0 or 60 % alpha.

**2. Any text under ~11 px treated as information?**
No hard violation, two borderline items and one regression:
- `MOON 15` (11 px) is the only readout of the lunar age — information at the threshold. Drop the number (the phase image already says it) or raise to 13 px.
- `LST 11:50 · SUN IN SCO` (11 px) carries real data but is declared decoration and hidden in AOD — acceptable.
- Zodiac names 9 px at 40 % under a 0.45 -> 0.15 shade ≈ 9 % L smudges; constellation names have *no size given*. Both must be declared decoration; the zodiac names should go (see fixes).
- Battery and steps values drop from 27 px (v4) to 19 px. Not a violation (> 11 px) but these are *the* information per the brief; 19 px at 0.083 mm/px is a 1.6 mm em. Restore >= 23 px.

**3. AOD under 15 % lit with no per-second motion?**
No per-second motion: yes (cage interior alpha 0; ambient renders at most once per minute anyway — docs: "updates may be as infrequent as once per minute").
Under 15 %: **not as written.** Row z0 keeps the opaque, textured `bed.png` at alpha 0.55 in AOD ("textures vanish" is false: 0.55 x #141C17 = rgb(11,15,13), non-zero). The flange + hour ring + moat annulus r 200–225 is 33,379 px² = **21.0 % of the disc** by the v4 non-zero-RGB method before a single star is drawn. Row z3 contradicts z0 by mentioning a `bed_aod`. `sky.png` has an opaque #050B0E base over 79 % of the disc; `sky_aod` is "40 stars at 30 %" with the base unstated. The 9.5–10.5 % estimate is only true if both AOD bitmaps have a true #000000/transparent base, which the spec never says. Also the minute arc is under-counted: a 1.5 px stroke at r 223.5 anti-aliases to ~3 px of non-zero rows -> 4.2 k px² at :59, not 1.4 k. Corrected worst case with black-based AOD bitmaps ≈ 18–19 k px² ≈ 11.5–12 % at :59, ≈ 9.5 % at :00. Passes only after fix F2.

**4. Burn-in from static bright rings?**
AOD: the static elements are the outline digits (1.4 px #91AD80, Y 37 %), the dragon (#718D61 x 0.85 ≈ Y 20 %), 12 indexes + 24 ticks (<= 20 % L) — same class as v4, which the user accepted. New risk: the **minute arc at r 223.5**. Its first 6° is lit 59/60 of every hour at 40 % phosphor (≈ Y 30 %): a fixed bright crescent at 12 o'clock, 0.75 px from the clip edge, exactly where the OS pixel-shift clips it. The proposal's own claim "nothing pinned to the bezel edge, 5 px margin at r 220" is contradicted by the arc (r 222.75–224.25), the ticks (r 219–222) and the flange (r 218–225). Remove the arc from AOD or replace it with a 3 px minute dot (moves 6°/min = drift). Active-mode rings at full L are fine (wrist-up is seconds long).

**5. Anything that loops or twinkles?**
No twinkle, no colon blink, no breathing glow, wake flourish is one-shot. The only continuous motion is real-time: cage interior 6°/s (the seconds hand — allowed), vault 0.25°/min, sun 0.25°/min, arc 6°/min. One warning: the existing on-watch XML has a `[SECOND] % 2` blinking cursor — it must not be carried into the port.

---

## FATAL flaws

**F1. The material is below the display's threshold — the user will still say "flat".**
Measured relative luminance (sRGB -> Y, L*) of every surface that is supposed to build the section:
- flange "opaline satin" #141C17 -> #0E1410: Y 1.04 % -> 0.63 % (L* 9 -> 6)
- hour-ring floor #070B08: Y 0.30 % (L* 3); soleil lines #0A110C / #121B14: Y 0.49 / 0.96 % (L* 4 / 9) — a 5 L* flicker between 1 px lines
- vault base #050B0E: Y 0.30 % (L* 3); fired enamel #0B1E26: Y 1.14 % (L* 10)
- recess shadow: 2 px #000 on an L* 3 floor; lip highlight 1 px #2A3A2D (L* 23) is the only ring edge that will show
- index highlight 0.5 px #FFF 40 %: sub-pixel (1 design px = 1.07 device px) -> anti-aliased away
The dome shade (L 1.00 -> 0.15) *multiplies* a Y 0.3 % surface. 0.3 % x 0.15 = 0.05 %. A gradient on black is black. What survives on the watch: a black disc, stars that fade toward the rim, a 1.5 px rim arc, 12 grey indexes, the sun, the cage, the digits. That is v4 with a star map — exactly the "print" section 0 criticises. The Galaxia's grisaille is a *visible mid-grey* with white painted on top; the brief demands "chiaroscuro material rather than flat vector", and chiaroscuro needs a mid-tone to work on.
Fix: lift every structural surface into the visible range and separate the three rings by >= 5 L*: dome apex base ≈ #1C2F36 (L* ≈ 18) falling to ≈ #06090B at the limb (the 1.0 -> 0.15 curve then reads); hour-ring floor >= L* 15 (#17291D is already in the palette); flange satin L* 14 -> 9; recess shadow 3 px, lip 1.5 px at >= L* 23. Digit contrast on a Y 3–5 % dome stays ≈ 10:1, and the digit shadow becomes visible for the first time. Verify at 1:1 on a 480 px render with the screen at 50 % brightness, and delete every 0.5 px / 1 px alternating-line detail — it cannot exist at 1.07 device px per design px.

**F2. The AOD spec is self-contradictory and, read literally, breaks the 15 % cap** (see Q3). z0 says the textured opaque bed stays at alpha 0.55 (-> 21 % of the disc lit before anything else); z3 says a `bed_aod` exists; `sky_aod`'s base is unstated. Fix: mandatory true-black `bed_aod.png` containing only the 24 ticks and 12 indexes at <= 20 % L, a transparent-base `sky_aod.png`, swap both by alpha Variants (one Variant per PartImage — the doc allows at most one), and re-measure with the v4 900 -> 450 sampling. Budget the arc at 4.2 k px² or remove it from AOD (F-adjacent, see fix 3).

---

## Required fixes (beyond F1/F2)

1. **Pull the ring stack inside r 218.** The Classic's bezel sits over the outermost pixels and the AOD pixel-shift moves content by a few px; v4 kept everything <= r 211 for this reason. Suggested: vault r 190, moat 190–193, hour ring 194–206 (indexes 196–204), flange 207–216 (arc r 214, ticks 210–213), 9 px of true margin. Dragon frame then moves to y >= 35 so its crown (r 195 today) stays inside the dome, not on the hour ring. State the margin truthfully in section 7.
2. **Specify the handedness of `sky.png`.** It must be the *inside* view: RA increasing **clockwise**, 0h at 12 o'clock, so that `SKY = 360 − LST` brings RA = LST to the top and the disc turns anticlockwise. Copying a printed atlas polar chart (RA anticlockwise) gives a mirrored sky that any amateur astronomer spots instantly. Add an acceptance test: at LST 22.7h (≈ 21:00 KST on 25 Oct) Cassiopeia must sit just right (east) of the top, Deneb left (west) of the top, the Big Dipper at the bottom.
3. **Minute arc out of AOD** (burn-in crescent + edge clipping, Q4). Keep it in Active. If a minute cue is wanted in AOD, a single 3 px dot at 6·[MINUTE] degrees drifts and is safe.
4. **Steps value overflows its gauge at >= 10,000** (a normal day): 5 digits at 19 px Roboto Mono = 57 px > the 50 px bore ("6240 fits" only holds for four digits). Format as `10.0k` / `12.3k`, or restore 23–27 px values beside r 18 gauges as the proposal's risk 11 already suggests — do the latter; battery/steps are information.
5. **Vault −2.5° settle cannot be a Variant on the same `angle` that a Transform drives.** Nest two Groups: outer `Group` with `<Transform target="angle" value="SKY"/>`, inner `Group` with `<Variant mode="AMBIENT" target="angle" value="-2.5"/>` (angle is transformable, so it is a legal Variant target). Same pattern for the cage.
6. **Document that the sun pointer is a *mean* sun.** Verified at the sample instant: proposal pointer 35.9° cw, true sun hour angle gives 31.95° — 4° (16 min) off because the equation of time is ignored (true sun RA 13h58m, pointer 14h14m; both SCO, so the sign readout is unaffected). Either say so in the docs or add the cheap correction in degrees: `EOT = -(7.66*sin(rad(0.9856*(D-3))) + 9.87*sin(rad(1.9713*(D-81)))) / 4` and subtract it from SUN (`sin()`/`rad()` exist in WFF expressions). Also generalise the 0.5347 h constant to `tz − 126.98/15` so the mean-time correction survives a time-zone change (the longitude still will not — fine for a personal face).
7. **Float-safe LST.** `360.98564736629*D` is ~3.5 x 10^6; I simulated float32 and got 0.20° error (the proposal says 0.25° — fine), but the algebraically identical `LST = (280.46061837 + 0.98564736629*D + 360*fract(D) + 126.98) % 360` keeps every term < 10^4 and gives the same 177.525°. Use it; `fract()` is a documented function.
8. **Remove the zodiac names from the vault rim** (9 px x 40 % x shade 0.3 is a smudge that costs clutter at the one radius where the eye expects clean index marks). Keep the 12 sector ticks; if names are wanted, transfer them to the hour-ring floor in grisaille at >= 11 px, decoration-class.
9. **Sun–cage conjunction.** Sun (r 204.5, Ø13) and cage (r 212, Ø20) overlap radially; for ~26 days around 21 March (sun RA within ±13° of 0h) the cage spokes spin across the sun all day. Decide the look (cage over sun is correct per z-order; kill the sun glow under the cage) and show it in the studio as a named test date.
10. **Wake vs sleep timing is one Variant.** A WFF `Variant` has one `duration`/`startOffset`, applied to the mode transition in both directions; section 6.3's "all layers simultaneous in 180 ms" cannot be specified separately from 6.1's stagger. Either accept the mirrored stagger on Active -> AOD or drop 6.3's claim. (Verified: `duration` 0–1 of the device allowance, `startOffset` 0–1, ignored if the sum > 1 — all of the proposal's fractions sum to <= 1.0, good.)
11. **Horizon mask (strongly recommended, not blocking).** On the proposal's own projection (1.667 px/deg), Seoul's horizon on the lower meridian is at dec +52.4° -> 62.6 px below centre (dial y ≈ 288); everything the vault shows below that on the lower meridian is under the ground, so "the vault you see behind 10:08 is the Seoul sky at that instant" is only true for the upper half. A static alpha-only PNG that blacks out below the horizon curve costs one 400 px bitmap, gives a *real* occlusion event (stars rising at the east limb, setting at the west) every night, and clears the sub-dial row of stars for free. The zenith is fixed at (225,138) — under the inscription; worth a 1 px mark.
12. **Strip sub-pixel detail**: 0.5 px highlights, 1 px alternating soleil lines, 0.8 px constellation lines at 22 % (Y ≈ 13 % x 0.22 x AA ≈ invisible). Anything < 1.5 design px is AA noise at 1.07 device px.

---

## KEEP — genuinely strong, verified

- **The Galaxia mapping is faithful to the official press description**: "three concentric rings carry the indices for solar time" (inner 24-hour ring and outer minute ring in opaline, hour ring between them with applied indexes), the Cosmotourbillon "makes a complete, anti-clockwise circuit of the dial in one sidereal day", the golden sun pointer "indicates the month of the zodiacal calendar" and 24-hour solar time, Dauphine hands for civil time on the flange. Section 1 is not a vibe; it is the part list. (One unsupported claim: on the real watch the tourbillon travels inside the dome's outer section, so "exactly as the real cage cuts the Galaxia's rings" is not supported by the press text — the crossing is a design choice, fine, just do not cite the reference for it.)
- **The time-scale ladder** (seconds -> minutes -> civil -> 24 h -> sidereal -> year -> lunation, nearer = faster) is the correct translation of "every level carries a different clock" and is the single idea that makes this not a print. Keep it as the organising rule for z-order.
- **The astronomy is right.** Independent recomputation: D = 9793.5475, GMST 50.545°, LST 177.525° (proposal 177.4°, rounding), 11h50m; the D formula is exact for 2001–2099 (the "leap-day error < 0.75°" is overcautious — there is none); `SKY = 360 − LST` is correct for an inside-view chart; mean-sun angle 35.92° reproduces; zodiac day ranges check out (SCO 296–325 = 23 Oct–21 Nov); 25 Oct 2026 is a Sunday; Leo on the meridian under the dragon is right.
- **Every WFF feature named exists** (official reference pages): `[HOUR_0_23_MINUTE]` (float, v1), `[TIMEZONE_OFFSET_MINUTES_DST]` (v3), `[DAY_OF_YEAR]` 1–366, `[MOON_PHASE_POSITION]` 0–28 = 29 frames as specified, `[STEP_GOAL]` >= 1000, `[STEP_COUNT]`, `[BATTERY_PERCENT]`; `floor/fract/clamp/sin/cos/rad/numberFormat` and `%`; `Arc` `startAngle`/`endAngle` transformable with 0° at 12 o'clock; `Group` `angle` (clockwise) with `pivotX/Y`, `alpha`, `tintColor` transformable from v4 — so a Variant on `tintColor` is formally legal (Variant targets "must be a transformable attribute"), which retires risk 10's first half; `Variant` `duration`/`startOffset` 0–1, `CUBIC_BEZIER` with a 4-component `controls`; `BitmapFonts > BitmapFont > Character(name, resource, width, height)` and `TimeText > BitmapFont`; `Font weight="SEMI_BOLD"` = 600; `Reference` (Wear OS 6 / WFF v4); `DigitalClock` takes `Variant` and `alpha` (so a second clock as the shadow is fine). Memory limits confirmed: 10 MB ambient / 100 MB interactive; ambient is budgeted as up to three full-screen layers, so ≈ 2.4 MB + ≈ 2 MB of ambient bitmaps is comfortably inside.
- **Composition discipline**: HH:MM metrics byte-identical to v4; nothing textual outside r 171 except label corners (`BAT`/`STEPS` corners reach r ≈ 179, still 50 px inside the glass); AOD elements all <= 37 % L; no twinkle, no blink, one-shot wake; reduced motion = instant. Polaris under the colon is a lovely, free detail.
- **Honesty**: planets omitted because WFF cannot do ephemerides; the moon as a 29-frame mechanical disc; a 1 px gold ring as the sun at night. Keep all three.
- **The dragon treatment** (official path untouched, engraving shadow, crown kept inside the dome) and the depth-ordered wake (far plane first, numerals filling then casting a shadow last) are the right calls; after F1 they will actually be visible.

---

## Verification log
- Luminance/contrast: sRGB -> linear -> Y and L* for all 21 palette hexes; WCAG ratios for digit/background pairs.
- Geometry: disc 159,043 px²; annulus r 200–225 = 33,379 px² (21.0 %); arc circumference 1,404 px (x1.5 = 2.1 k, x3 with AA = 4.2 k); moon Ø40 = 1,257 px²; Roboto Mono 0.6 em advances (5 digits @ 19 px = 57 px vs 50 px bore; prompt 172 px vs 308 px chord at y 389).
- Astronomy: Date.UTC-based J2000 day count vs the proposal's expression (identical to 4 decimals); float32 simulation of the naive product (0.20° error); true-sun RA/dec via mean longitude + equation of centre (RA 209.47°, dec −12.0°); horizon radii for φ = 37.57° on the 1.667 px/deg projection; cage rim speed 0.928 px/min (an index crossing takes 21.6 min, one every 120 min).
- WFF docs read: Variant, Transform, Arc, Group, PartImage, DigitalClock/TimeText, Font, BitmapFont(s), Reference, source-type (data sources), memory-usage, always-on. JLC press release for the Galaxia dial anatomy.
- Not verified (cannot be from here): real-watch brightness/black crush, actual WFF transition allowance in ms on One UI Watch, validator output for rotated 400 px bitmaps, whether the Classic's bezel lip occludes r > 218.
