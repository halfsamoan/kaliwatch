# Critique 02 — "Celestial Vault" material proposal vs the real Galaxia

Reviewer lens: design director, adversarial. Everything below was checked against the brief, the v4 source (face.js / celestial.js / tokens.js), the two v4 preview PNGs, the on-watch watchface.xml, the WFF reference pages (source-type, arithmetic-expression, memory-usage, variant, transform, group, arc, part-image, scene, digital-clock, time-text) and the JLC press material for the Calibre 945 Galaxia.

**Score: 5 / 10. Verdict: do not ship as specified. Right skeleton, wrong exposure, wrong hero.**

---

## 1. Direct answers

**Is this STILL one-dimensional?**
On paper, no. On the panel, yes. The proposal builds five fictional planes and lights them with one key, but then exposes every "material" plane in the bottom 2 % of the tonal range. Measured relative luminance (sRGB -> linear, Rec.709 weights) of what it actually specifies:

| Element as specified | Y (relative luminance) |
|---|---|
| Flange body `#1A1F22` ("brushed gunmetal") | 1.3 % |
| Trench floor: bed `#0B1117` under AO .30 | 0.37 % |
| Trench wall: bed under AO .72 | 0.15 % |
| Dome ground `#0A1016` / `#121A22` / `#0C1218` | 0.5 / 1.0 / 0.6 % |
| Terminator (.46 black over mid ground) | 0.53 % |
| Under the digits after the central well | 0.30 % |
| Digit shadow (.6 black) on top of that | 0.12 %: **a 0.44-nit difference at 250 nits** |
| Dragon cast shadow .55 over the glaze peak | 11.9 % -> 5.3 %, and that is the one spot where it is visible at all |
| Glaze peak (.11 white) / Fresnel NW (.16 white) | 11.9 % / 16.5 % |
| Bevel highlight `#8C9A98` at .5, 2 px wide | 16.1 % |

So the "two stepped brushed-gunmetal flanges with a trench between them" is a 1.3 % ring next to a 0.2 % ring next to a 0.5 % disc: three blacks. The only ring-structure the eye will receive is a 2 px 16 % arc (bevel, lit side only) and an 8 px 16 % Fresnel crescent. The flange, the trench, the occlusion of the sun halo "in the channel", the digit shadow and the dragon shadow are below threshold on a 40 mm panel in anything but a dark room. The user will see: black dial, stars in the wings, v4 text column, thin ring. That is the sentence the brief says must not happen.

**Three separated depth planes, each with its own real time scale, with material shading?**
Structurally yes, and this is the proposal's real achievement: sky (sidereal, 0.2507 deg/min CCW), trench bead (24 h solar), flange groove (minutes / seconds), glass (civil). All four are real, all are WFF-expressible (verified below). But "with material shading" is only true for the dome glaze and the Fresnel rim; the flange and the trench are specified as shading that cannot be seen. Count it as 1.5 shaded planes out of the 3 required.

**Decoration glued onto the same flat v4 face?**
Partly, and measurably. The composition column is v4 verbatim: dragon on top, date, HH:MM at baseline 252 with the identical x166 / x225 / x284 layout, two-column telemetry, prompt at the bottom. What changed is the background. Then the proposal hides its own hero layer under that column. Rasterised over the r196 sky disc (120,645 px):

| Overlay | share of the sky disc |
|---|---|
| dragon box + shadow (x153-300, y30-142) | 13 % |
| text column boxes (date, digits, labels/values/gauges, prompt) | 24 % |
| central well core (alpha > ~.2) | 16 % |
| below-horizon haze (true curve region) | 42 % |
| **clear sky, none of the above** | **28 % of the disc = 21 % of the face** |
| ...of which under the r<130 star-alpha cap (.6) | 38 % |

Twenty-one percent of the face, in two lateral lunes, is the only place the grisaille sky exists at full strength. "Leo high at the top" at the preview instant is under the dragon (Regulus lands at (171,110), inside the dragon box). The Milky Way at 10:08 KST runs Cas-Cep-Cyg through (210,272)-(278,275), i.e. under the digits and the labels row, then out to the right rim. In the evening, the Summer Triangle is at the zenith (225,139), under the dragon's belly. The sky's showpiece is structurally always covered because the zenith is at y139 and the digits are centred at y223: the whole strip x150-300, y30-252 is spoken for.

**KALI or JLC pastiche?**
At one glance it reads KALI: dragon, phosphor colon and arc, Roboto Mono, INFINITY. At the second glance it is the Galaxia inventory in dark mode: aventurine lacquer bed, grisaille disc, transferred constellation names, zodiac glyphs on an ecliptic ring, gold sun, stepped flanges with applied indices, a "Cosmotourbillon analogue", and the prompt renamed `kali@vault`. The only Kali-native material idea is the phosphor relief on the dragon, and that one damages the logomark (F4 below). The three most JLC-specific textures (zodiac glyphs 9 px, constellation names 7 px, aventurine flecks 1 px) are also the three the brief classifies as "decoration only" at 40 mm, so they cost identity and buy nothing.

**One memorable thing, or seven competing ones?**
Seven. The proposal's "one-sentence idea" is 90 words. The Galaxia's memorable thing is the Cosmotourbillon: a bright mechanical object you watch travel. Its analogue here is a 9 px gold disc in a 7 px trench at r199.5, half the bead's own halo clipped by design, at the very edge of a display whose rim the proposal itself suspects is under the Classic's bezel. And it has a twin: the "true sun" sprite sits at (313.8, 83.9) while the bead sits at (331.3, 56.2), on the same radial, 32.8 px apart. Two gold suns at once on a face whose entire pitch is "the sky is real" is a visible logic bug, not a detail.

---

## 2. FATAL flaws

1. **Exposure.** Every plane that is supposed to carry material lives between 0.15 % and 1.3 % luminance (table above). The flange, the trench, the digit shadow (0.44 nits) and the dragon cast shadow are invisible under normal viewing. The stack collapses to "stars plus a ring". This alone makes the user say "still flat".
2. **The hero layer is 72-79 % covered.** Clear sky = 21 % of the face, in two side lunes, 38 % of that alpha-capped. The composition is the v4 column with a starfield behind it. The dome's two visible cues (glaze NW, terminator SE) coincide with the dragon zone and the horizon haze respectively, so they read as a generic top-left-lit vignette, not a dome.
3. **Two suns.** True sun (313.8, 83.9) and sun bead (331.3, 56.2), 32.8 px apart on one radial, both gold, both moving at the same rate. Merge or delete one.
4. **Dragon relief destroys the official logomark.** The Kali dragon is line-art; in the v4 preview its strokes are ~2 px at 180 px wide, so ~1.6 px at the proposed 144 px. The relief is built from `path minus path(+1,+1)` and `path minus path(-1,-1)`: on a 1.6 px stroke those two edge masks consume the whole stroke, leaving a three-tone scribble (`#EEFFD6` / `#A6F46A` / `#2E4D24`) with no body. The cast shadow of a 1.6 px line blurred by 6 px peaks at roughly 5 % alpha: invisible. The user accepted the official dragon on the condition that it is "not weird"; this makes it weird, and 20 % smaller.
5. **Burn-in walk breaks a hard constraint.** `x = (([MINUTE]*7) % 5) - 2` on "the whole AOD group" moves HH:MM by +/-2 px every minute. The brief: HH:MM "never scaled or moved". Wear OS already applies its own ambient burn-in offset; the walk is redundant as well as forbidden.

Nothing is unbuildable. The WFF mapping errors (section 4) are all one-line fixes.

---

## 3. Required FIXES

1. **Re-expose the materials into the visible range, Active only (leave AOD as specified).** Targets: flange body 3-5 % Y (`#2B3236` base, brushed radial gradient to `#3E474C` on the 240->30 deg arc), bevel highlight 25-30 %, trench floor 1.5-2.5 % (bed ground `#141A20`, flecks at .35-.6), dome ground `#141C26` at the pole -> `#1C2733` at r150 -> `#121A24` at r196 so the terminator has something to take away, glaze to .16, Fresnel to .06 + .18 cos. Rule: every plane boundary must be at least a 3x luminance step from its neighbour. Verify on the panel at 250 nits in daylight, not in the studio.
2. **One sun.** Keep one gold object. Preferred: the true sun on the sky plane at r = s(90 - dec) carrying both readings (its clock angle is already 24 h apparent solar time; its position on the ecliptic is already the month), and delete the trench bead. If the trench bead is kept instead, delete the true-sun sprite and move the zodiac reading to the trench.
3. **One hero, and it must be a sphere.** A shaded sphere reads as 3D at any brightness; nothing else on this face does. Make the moon the hero: 28-32 px sprite, baked spherical shading from the 10:30 key, real phase (8 sprites via `[MOON_PHASE_TYPE]`), 1 px limb, soft 6 px halo on the lit side. The sun becomes the secondary accent. Rewrite the one-sentence idea as one sentence: "A real moon rides a real sky that turns once a sidereal day behind the time."
4. **Dragon: flat phosphor, no edge masks.** Return to the v4 size (180 x 123 at x135 y24) or at most 160 wide; fill `#A6F46A` at .96 as in v4; keep the AOD 1.2 px contour. If a depth cue is wanted, use a wide soft glow under it (phosphor at .10, blur 14) rather than a shadow nobody can see.
5. **Delete the digit shadow.** If a "glass vs sunk" cue is wanted, do it the Galaxia way: a *sunken* hour slab (rounded rect x119-331, y190-258, fill black .35, 1 px top shade `#000` .5, 1 px bottom light `#8FA3B2` .18) so the digits sit in a recess, and remove the central well in exchange.
6. **Give the sky back at least 35 % of the face.** Remove the BATTERY / STEPS word labels (values + 2 px gauges already identify themselves; v4 AOD proves `BAT 78%` suffices), pull values to baseline y300 and gauges to y310, shrink the well to rx110 ry60 alpha .25 or delete it per fix 5, raise the r<130 star cap from .6 to .8, cap the haze at .35. Re-run the coverage count; target clear sky >= 35 %.
7. **Make the 24 h plane readable.** The trench has 24 x 1 px dots at 5.4 % Y: no scale. Add four 2 px marks at 0 / 6 / 12 / 18 h with 11 px numerals `00 06 12 18` in `#9BAB9C`, or admit the sun carries no readable scale and stop counting it as a time plane.
8. **Remove the [MINUTE] walk.** Rely on the system ambient offset.
9. **Clip bodies below the horizon.** `alpha = clamp(255 * 6 * (sin(rad(37.57)) * sin(rad(dec)) + cos(rad(37.57)) * cos(rad(dec)) * cos(rad(th))), 0, 255)` on the sun and moon sprites, so a nearly full moon at ten in the morning fades under the Earth instead of sitting as a grey smudge behind `6,240`.
10. **Move the indices in from r219-224 to r212-216.** They are the brightest ring element (53.6 % Y); if the Classic's bezel does hide the outer 2-3 % the ring loses its one bright cue. (The bezel claim itself is unverified either way; treat it as a device test item.)
11. **Spend the freed texture budget on one Kali-native material.** Drop zodiac glyphs, constellation names and aventurine flecks (all sub-threshold, all JLC-only). Add a celestial graticule instead: declination rings every 30 deg (r49, 98, 147, 196) and RA lines every 2 h, 0.8 px phosphor `#A6F46A` at .12, rotating with the disc. It is astronomically correct, it is a PPI scope to a radar engineer, and it is the one thing on the face a JLC would never do.

---

## 4. Technical verification

Correct as claimed (checked):
- Star anchors: Polaris r1.21 @ 37.95 deg, Dubhe r46.1 @ 165.9, Capella r71.9 @ 79.2, Vega r83.6 @ 279.2, Sirius r174.3 @ 101.3, Antares r190.1 @ 247.4 — all match s = 1.633 px/deg, edge dec -30 = r196.
- Zenith (225,139.4), N-point (225,286.4), E/W (372/78, 225), ecliptic r108.7-185.3: match for Seoul 37.57 N.
- D for 2026-10-25 10:08:24 KST = 9793.5475 from the `365*(Y-2000)+floor((Y-1)/4)-499+DOY-1.5+...` form (7 leap days 2000-2024 counted correctly; breaks at 2100, acceptable). LST = 177.3 deg, lambda 211.6, RAsun 209.4, dec -12.0, thSun +32.2, true sun (313.8, 83.9). The split LST keeps intermediates under 1.1e4.
- Projection convention is self-consistent: looking-up chart, S at 12, E at 3, RA increasing clockwise, disc angle = 360 - LST, CCW diurnal motion. Pole sits between the colon dots.
- WFF: `fract`, `floor`, `clamp`, `sin/cos/asin`, `rad`, `deg`, `%` all exist; trig links to Java `Math` (radians), so wrapping every argument in `rad()` is right. `[TIMEZONE_OFFSET_MINUTES_DST]` exists verbatim (data-source version 3, integer minutes). `[SECONDS_IN_DAY]` 0-86399, `[DAY_OF_YEAR]` 1-366, `[YEAR]` clamped 1902-2100, `[MOON_PHASE_POSITION]` 0-28, `[MOON_PHASE_TYPE]` 0-7 as listed. Arc `startAngle`/`endAngle` transformable; Group and PartImage `x y width height pivotX pivotY angle alpha scaleX scaleY` transformable, `tintColor` from v4; Variant `startOffset`/`duration` are 0..1 fractions with `interpolation="CUBIC_BEZIER"` + `controls`; ambient 10 MB / interactive 100 MB; memory counts ALPHA_8 at 1 B/px and RGB565 at 2 B/px by decoded configuration; source order lets the ambient calculation drop a layer.

Wrong or unsupported as claimed:
- **Scene-level `<Expressions>` does not exist.** The Scene reference lists Group, Condition, ListConfiguration, BooleanConfiguration, Variant, ComplicationSlot, AnalogClock, DigitalClock, Transform, Reference as its only children. Named expressions are a Condition/Compare mechanism. Every Transform (sky angle, sun x/y, bead angle, 8 moon sprites x/y, horizon alpha) must inline the full LST/sun/moon chain. Buildable, but the XML will be ugly and the per-frame evaluation count must be checked on device.
- **`TimeText format="HH"` is undocumented.** Documented hour tokens are `hh`, `h`, `hh_10`, `hh_1`; use `format="hh" hourFormat="24"`. `mm` alone is also not in the documented examples (only `m`, `mm_10`, `mm_1`): verify against the XSD or use `mm_10` + `mm_1`.
- **`PartText` is not a DigitalClock child** (children: TimeText, Localization, Variant). The colon is a sibling PartText; use two DigitalClocks for hours and minutes.
- **"A circle centred (225,78) r208 is within 2 px of the horizon"** is false near the rim: max deviation inside the disc is 21.2 px. The true horizon meets r196 at clock angle +/-63.6 deg ((400.6,137.9)); the circle meets it at +/-73.1 deg ((412.5,168)). Harmless if the bake really uses the exact curve, but the sentence must go; it is presented as hand-verified.
- **The moon formula as written gives lambda_moon = 12.2 deg at the preview instant, not 17 deg.** Age 13.66 d, M' = 287.4 deg, equation of centre -6.0 deg. The real value (27 h before the 26 Oct full moon) is ~16.5 deg, so the formula's error here is ~5 deg, on top of the ignored ecliptic latitude (+/-5.1 deg = +/-8 px). Fine for a sprite, but state "~6 deg + latitude" and do not print a number the formula does not produce.
- **Star counts are low by ~2x.** Yale BSC to m 4.0 with dec > -30 is ~380 stars, not ~200; to m 3.0 it is ~130, not ~90. Only the AOD lit-pixel estimate depends on it (adds ~150 px; still ~5 %).
- **Float precision is a real risk.** If expressions evaluate in float32, D = 9793.55 has ~0.001 d resolution (1.4 min, 0.35 deg of LST): acceptable, but the whole chain must be checked on device at three dates as the proposal says, because nothing in the docs states the type.

---

## 5. KEEP (genuinely strong)

1. **The astronomical engine.** Polar azimuthal-equidistant chart, pole under the colon, angle = 360 - LST, real Seoul horizon, sun on the ecliptic, moon with phase, all driven from `[YEAR]/[DAY_OF_YEAR]/[SECONDS_IN_DAY]/[TIMEZONE_OFFSET_MINUTES_DST]` with verified WFF functions. This is the first version of this face where the sky is true rather than painted, and it is the direct equivalent of the Galaxia's 46th-parallel vault. Do not let anyone talk it back into "20 random stars".
2. **One key light, obeyed by every bake** (10:30, 35 deg elevation). The discipline is right even though the exposure is wrong.
3. **The wake order** (sky dolly .965 -> 1.0, light on, flange settles -6 -> 0, dragon, digits, arc -14 -> 0, telemetry) and the exit that kills `dome_light` first so the stack visibly flattens. HH:MM never moves. The v4 -14 deg signature survives on the vector arc. Keep every row of the table; only drop the digit-shadow row.
4. **The horizon as a physical object and the Earth band as the home of the telemetry.** Stars rising on the east lune and setting on the west lune are the one part of a sky chart where motion is perceptible on the hour scale; reframe the two lunes as the feature ("the two windows where things rise and set") rather than apologising for them.
5. **Minute arc and seconds bead on the engraved tick radius r208**, and the explicit warning that 2 px off puts v4's flatness back. Correct and worth keeping as a build rule.
6. **Palette discipline**: phosphor identity plus exactly three controlled hues (gold, cold enamel, amber-warning only). Keep the rule; fix the values per fix 1.
7. **AOD plan**: ~5 % lit, same silhouettes, rotating ambient stars at 17.6 % Y, outline digits, nothing static above ~22 %, moving things are the bright things. Keep, minus the [MINUTE] walk.
8. **The pitch in section 8** is the right argument (occlusion, shading, parallax, differential motion, material). It just is not what the numbers in sections 1-3 deliver yet.
