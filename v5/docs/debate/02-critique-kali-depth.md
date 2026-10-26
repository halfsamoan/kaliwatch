# Critique 02 — "Celestial Vault" proposal 01 (KALI lens) against the real Galaxia

Reviewer: adversarial design director. Reference: JLC Master Hybris Artistica Calibre 945 Galaxia (press release re-read today), v4 source (`face.js`, `celestial.js`, `tokens.js`, both preview PNGs), the on-watch `watchface.xml`, WFF reference pages (arithmetic-expression, source-type, variant, decoration/outline, memory-usage).
Everything numeric below was recomputed in `debate/verify02.py`; nothing is taken from the proposal on trust.

## Score: 4 / 10 — do not build as written

**Verdict in one line:** the proposal is an excellent *astronomy engine* wrapped in a *visual spec that will still read as flat on an OLED wrist*, with a mirrored sky, one hard-constraint breach, trig that is wrong as written, and no hero. The architecture is right; the values are timid; the furniture is borrowed.

## The five questions

**1. Is it STILL one-dimensional?** On paper, no. On the wrist, mostly yes. The "deepest plane" is a radial from `#06100C` to `#0B1A14`: relative luminance 0.004 to 0.009. On a 480 px OLED at 20-100 nits that is black. Every depth cue the proposal relies on is then black painted on black: the hour ring's "inner occlusion shadow r182-190 (black 65% -> 0)" has nothing to fall on; the Milky Way wash at <= 8% is invisible; the slot's 6 px inner shadow is 55% black over 0.9% luminance. The bevels that are supposed to sell the metal are 1-1.5 px, which the brief itself defines as "decoration only". What survives at viewing distance is: a ring with ticks, a dark pill, 78 px digits, the dragon, and faint grey dots. That is v4 with a different ring. The user will say "still flat".

**2. Three separated depth planes, each a different real time-scale, with material shading?** Yes on the spec sheet: flange (sec/min), hour ring + sun (apparent solar day), vault (sidereal day), objects (lunar/zodiac). That is the Galaxia principle, correctly understood, and the reading order edge -> centre is the best idea in the document. But "material shading" is asserted at values no eye can resolve (see 1), and two of the planes are nested annuli at the rim that never pass under anything, so there is no overlap to read as a stack except the dragon's 7 px apex.

**3. Decoration glued onto the flat v4 face?** The composition table is v4's table verbatim (dragon x135, date y179, HH/MM y252, status y281, battery/steps y312/343/357, prompt y389) with three things glued on: a 346x72 pill, a moon badge at (96,168) and a zodiac badge at (354,168), both with Material-style drop shadows (dx2 dy3 blur4). Two symmetric icons with drop shadows flanking a logo is a 2015 Android watch face, not a Galaxia. The pill is the "lock-screen notification over wallpaper" look the user is rejecting. The sky and hour ring are genuinely new; the badges and the pill are glue.

**4. KALI or JLC pastiche?** The furniture is JLC's one-to-one: sunken 24 h ring with applied indexes, grisaille enamel, gold sun at the edge, "Cosmotourbillon analogue" (the proposal's own words). KALI is reduced to the dragon, the green, and one prompt string. A KALI-skinned Galaxia is still a Galaxia. The owner is a radar signal-processing engineer; the proposal never uses that. The seconds trail is already a PPI sweep; the horizon is literally a radar horizon; the stars are returns. The sky should be phosphor-native (CRT persistence, not 16th-century French enamel). Nobody will mistake it for JLC then.

**5. One memorable thing or seven?** Seven, and the proposal counts them for you in section 8. The only warm object (the sun) is a 7 px disc (0.6 mm on the wrist) and it hides behind the dragon at the one moment that defines it (noon). The "Cosmotourbillon" is a 16 px reticle. There is no hero. The idea that *should* be the hero is in there and under-sold: a fixed Seoul horizon splitting the face into lit sky and dark earth, with the sky sliding under it and the sun crossing it. Make that the whole picture.

## FATAL

1. **The sky is mirrored.** The proposal bakes RA increasing counter-clockwise and turns the vault clockwise, with east at 9 o'clock. Inside view of the north celestial pole (right-handed equatorial frame, observer at origin looking +z, +x to the right): RA 0h sits at 3 o'clock and RA 6h at 6 o'clock, so RA increases **clockwise** and the diurnal motion is **counter-clockwise**, which is what you see facing north in Seoul (east on your right, Dipper handle east of the bowl in spring). JLC's press text: the Cosmotourbillon "makes a complete, anti-clockwise circuit of the dial in one sidereal day" — same answer. Every constellation in the bake will be reversed and the sky will run backwards. Breaks the "real astronomy" constraint. Fix is cheap (mirror the bake, negate LST_DEG and SUN_HA, swap 06/18 on the ring, east at 3 o'clock) but it must be done before any asset is painted.
2. **The vault is not perceptible on OLED, so the stack collapses.** Ground lum 0.004-0.009; stars are 1.2-4.7 px dots of `#B8C4BE` (lum 0.53) at 35-80%; lines 0.9 px at 22%. Black-on-black shadows, sub-pixel bevels. This is the single reason the user would still say "flat".
3. **Hard-constraint breach: the sentinel is a 1 rpm decorative loop at perceptible speed.** "[SECOND]*6" cage spin on a 16 px reticle is not an astronomical rotation; it duplicates the seconds trail; in WFF it steps 6 deg once a second (0.7 px of travel on an r6.5 ring) and will read as flicker, not spin. It is also pinned to RA 0h at r178, i.e. permanently sitting on top of the Aries glyph of the zodiac band (r170-182). Remove it.
4. **Trig is wrong as written.** WFF `sin/cos/tan` map to Java `Math` and take radians (`rad()`/`deg()` exist for conversion). `EOT_MIN`, `SUN_DEC`, `H0`, `SUN_UP` as printed evaluate garbage: the sun would be lit/embered at random and the ring would be a lie. The proposal lists it as a "risk"; it is an error in the deliverable. Wrap every argument in `rad()`. (The sidereal expression is trig-free and correct: `[SECONDS_SINCE_EPOCH]` and `[TIMEZONE_OFFSET_MINUTES_DST]` do exist, Version 3.)
5. **No hero; seven competitors.** See Q5. A Galaxia has two: the tourbillon and the painted sky. This has none.

## FIXES (required before a second round)

- **Handedness:** bake RA clockwise; `Transform angle = 0 - LST_DEG` (or bake with LST increasing CCW); east at 3 o'clock, west at 9; hour ring 06 at 3 o'clock, 18 at 9 o'clock, sun pointer counter-clockwise. State the convention in one line of the spec so nobody "corrects" it back.
- **Make the ground visible, domed, and asymmetric:** vault centre `#1A2E27` (lum ~0.025) -> `#0F1D18` at r186, highlight bias toward 10 o'clock so the disc reads as a dome; mag < 1.5 stars at 100% grisaille, 3-5 px with a 2 px soft halo; constellation lines 1.4 px at 35%. Then the hour ring's 8 px inner shadow has a surface to darken and the dragon's cast shadow has a surface to fall on. Below the horizon: 100% black, not 78%. The face becomes figure/ground: painted sky above, black terminal ground below. That split is the memorable image.
- **Kill the pill.** Replace the 346x72 smoked-glass channel with a radial vignette centred (225,225), r0-110, black 65% -> 0 (bakeable into the vault PNG, zero extra layers). Digits sit *in* the sky, not on a card. The digit/star worst-case contrast is 4.0:1 at a star pixel (not the claimed 12:1); the vignette plus a cap of 60% star alpha inside r110 handles it.
- **Replace the sentinel + the static moon badge with one true sky object: the Moon at its real place.** Group rotated by `HA_moon = LST_DEG - RA_moon`, `RA_moon ~= RA_sun + 12.19 * [MOON_PHASE_POSITION]` (deg), `RA_sun` from the same `B`; error <= ~6 deg, good enough for a 28 px disc. It then rises and sets across the painted horizon, carries its phase (8 `[MOON_PHASE_TYPE]` frames), and is the "one bright object travelling the sky" the brief asks for — honestly, not as a tourbillon costume. Moon disc 28 px at r150 on the vault frame.
- **Delete the zodiac badge and the "SCO" in the date line.** The proposal already contains the astrolabe: a sun pointer at apparent HA over a zodiac band fixed in RA means the glyph radially inside the sun *is* the current sign (RA_x = RA_sun). Say so, and move the band glyphs from "RA 0,2,...,22h" to the true tropical boundaries 0h00, 1h52, 3h51, 6h00, 8h08, 10h08, 12h00, 13h52, 15h51, 18h00, 20h08, 22h08.
- **Sun:** disc 12 px, glyph box 24 px, rays to r11; never occluded: either z above the dragon or dragon frame moved to y36. The one warm object must be visible at noon. The ember state is good; keep it.
- **Star catalogue honesty:** with r = (90 - dec) x 1.875, r <= 186 means dec >= -9.2 deg. Sirius (r200), Spica (r190), Antares (r218), Fomalhaut (r224) are under the opaque hour-ring floor, not "visible through the ring shadow gap" — there is no gap. Either change the scale to 1.525 px/deg (dec -32 -> r186) and accept a tighter pole, or cut the catalogue at dec -9 and say "~90 stars". Do not claim 118.
- **Lower composition collisions** (text box = 0.6 em advance, 0.73/0.22 asc/desc): steps `12,480` at 27 px reaches r185.9 (into the r182 shadow, 4 px from the ring); the 22-char prompt corners reach r187.6 (2 px from the ring edge); the sentinel box bottom (y411) and the "00" index crowd the same 35 px band at 6 o'clock. Move value columns to x145/x305, cap step text at 5 digits + `k` (`12.4k`) or 24 px, prompt baseline y383 and shorten to `~$ INFINITY`, drop the "00" numeral.
- **Ring numerals 9 px** are below the brief's 11 px floor. Either indexes only (Galaxia: applied indexes, no numerals on the 24 h ring) or 11 px at 00/06/12/18.
- **World-fixed light:** the flange bitmap carries a 10 o'clock bevel highlight and then rotates -14 -> 0 deg on wake; the highlight swings with it and tells the eye it is a print. Rotate only the ticks/trail/marker PartDraw group; keep the bevel bitmap static.
- **LST quantisation as written:** `((floor([SECONDS_SINCE_EPOCH]/60)*60 - 1764586194) % 86164) * 360 / 86164`. Epoch verified: LST(Seoul) at 2025-12-01 10:49:54 UTC = 0.0002 h; sample 2026-10-25 10:08:24 KST true 177.52 deg vs expression 177.64.
- **AOD outline digits:** `Font > Outline color width` exists since Wear OS 4 (`color` transformable from V4); make it the primary path and drop the 11-glyph BitmapFont (bitmap fonts are the biggest ambient-memory consumer per the WFF memory page). Ambient budget is 10 MB; five full-disc RGBA layers at 480 px are ~4.6 MB, fine, but `horizon_aod` (darkening only) should be a PartDraw gradient, not a 0.9 MB bitmap.
- **Identity:** rename the vocabulary. "Grisaille", "Cosmotourbillon", "enamel" are JLC's words. Use the owner's: sweep, return, persistence, horizon. Sky dots in a cooled phosphor (`#8FAE93` family), not bone white, and the sky reads as a CRT scope, not a dial.

## KEEP (genuinely strong — do not let round two lose these)

- The sidereal engine: integer epoch 1764586194, modulo 86164, no trig, 0.12 deg error at the sample, ~0.18 deg/yr drift. Ship it.
- The apparent-solar sun: EoT 16.2 min on 25 Oct (true ~16.0), apparent noon 12:16 KST (true ~12:15), H0 linearisation exact at the solstices and 0.6 deg off in late October. Correct and WFF-cheap once wrapped in `rad()`.
- The fixed Seoul horizon: every spot point checks (north point (225,295.4) at dec +52.43; equator crossings (56.25,225)/(393.75,225); r197 at (417.7,184.2); disc exit at (426.6,125.1)). Telemetry in the "earth", dragon in the brightest sky, sun lit/ember by its own H0. This is the hero; promote it.
- The reading order of clocks from edge to centre and the z-logic (flange above ring above vault; dragon apex 7 px in front of the ring with a cast shadow is the one real occlusion cue in the design).
- The implicit astrolabe (sun pointer x rotating zodiac band = month). Keep, make explicit.
- The wake choreography: deepest plane first, text last, 360 ms, flange -14 -> 0 signature, WFF fractions already written (`duration`/`startOffset`/`CUBIC_BEZIER controls` all exist; `duration` is V4).
- AOD plan: ~7.2% lit, dragon as a 1.2 px hairline (removes v4's largest static mass), stars and ember drifting, colon held at lum 0.09, nothing static above lum 0.38.
- Palette discipline: three added hues with one job each, warning gold as the sun's sibling, no gradients in text.
- Everything the user already approved left untouched: dragon path, HH:MM at x166/x284 y252, INFINITY on both faces, monospace, black void.

## Verification log

| Claim | Result |
|---|---|
| LST at sample 10:08:24 KST | 11.8349 h = 177.52 deg (Meeus GMST); expression 177.64 deg |
| Epoch E0 2025-12-01 10:49:54 UTC | LST Seoul = 0.0002 h; Unix 1764586194 |
| Handedness | inside view: RA increases clockwise, sky turns CCW; proposal is the mirror; JLC tourbillon anti-clockwise |
| Vega (18h36.9m, +38.78) | r96.0 at (319.8,209.6) in the proposal's frame (consistent with its own table) |
| Sirius / Spica / Antares / Fomalhaut | r200.1 / 189.7 / 218.3 / 224.3 — all under the hour ring or flange |
| dec limit for r <= 186 | -9.20 deg; dec -32 maps to r228.8 (off disc) |
| Zenith | r98.3, y126.7 — inside the dragon frame (y28-151) |
| EoT / dec / H0 on DOY 298 | 16.23 min / -13.12 deg / 79.1 lin vs 79.7 geo; SUN_HA -31.86 deg; sun at (120.5,56.8) |
| Ground luminance | `#06100C` 0.004, `#0B1A14` 0.009, `#163A3C` 0.035 |
| Digit contrast at a star pixel through 55% glass | 4.0:1 (claimed > 12:1) |
| Steps `6,240` / `12,480` max r | 180.0 / 185.9 |
| Prompt (22 ch, 13 px, y389) max r | 187.6 |
| Sentinel at LST 177.5 | (232.8,402.8), box bottom y411 |
| 40 min of sun travel at r198 | 34.6 px behind the dragon apex |
| WFF | `[SECONDS_SINCE_EPOCH]`, `[TIMEZONE_OFFSET_MINUTES_DST]` V3; `[MOON_PHASE_TYPE]` 0-7; trig radians; `Variant duration` V4, `startOffset`, `CUBIC_BEZIER` + `controls`, `angleDirection`; `Outline color/width` since Wear OS 4; ambient 10 MB / interactive 100 MB, three assumed full-screen ambient layers |
