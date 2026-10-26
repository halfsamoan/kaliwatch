# 04 - Owner's judgement on the seven v2 proposals (main-reference round)

Judge: the owner. I am a Korean penetration tester and radar engineer, I run Kali, and I rejected v4 as "too one-dimensional". My test is simple: would I wear this every day, and does it carry the Galaxia product photo I named as the main reference (`main-reference.md`)? Where that photo and the older brief disagree, the photo wins. The fixed big digital HH:MM, the official dragon, the INFINITY prompt and the AOD rules still hold.

What I looked at:
- the brief and the main-reference notes;
- the v4 source (`face.js`, `celestial.js`, `tokens.js`, `DESIGN-SYSTEM.md`) and both v4 previews;
- the on-watch `watchface.xml`;
- all seven v2 texts;
- the wff raster mocks `calc/wffv2/mock_active_2008.png` and `mock_aod_2008.png`;
- the current studio sheet `refs-r3/r3-galaxia-night.png`, which shows the cues in practice.

The wff revision is present (`03-revised-wff.md`). It is the only v2 that was written after the main reference and checks itself against it.

## Verdict in one line

Build v3 on **wff v2**. Graft one element from each of the other six proposals into it. Then close five main-reference gaps that no proposal fills: 24 h numerals and month names on the flanges, readable constellation names, one large painted sphere, a sentinel big enough to be the bright object, and telemetry at 22 px or more.

## Cue checklist (what the photo asks for)

Legend: **yes** = meets the cue, **part** = partly meets it, **no** = misses it. The bracket after each mark gives the evidence.

| Proposal | Eccentric layering + off-centre sunken sub-disc | Bright high-contrast grisaille (Milky Way, figures + names, large painted spheres, one cut by a ring) | Two flange levels (grey radial 24 h ring with numerals; black month ring with a sun star) | One accent metal (phosphor as anodised metal; gold only for a tiny sun) | Hard rules (HH:MM fixed, dragon at v4 size, INFINITY, AOD) |
|---|---|---|---|---|---|
| **wff** | part (off-centre pole P(225,114); two r40 sub-discs at (146,320)/(304,320), but they float rather than sink and have grey rims) | part-strong (Milky Way core #9AA8AE Y 37.9 %, 366 stars, 33 figures; **no names**; moon 22 px; no large sphere) | part-strong (grey radial-hairline F2 r211-225 over black lacquer F1 r198-209 carrying the sun; **no numerals, no months**) | yes (#D2FFA4 / #A6F46A / #4E7F34 on indices, pointer and dragon; gold sun, but a gold `SCO` text) | yes (v4 dragon frame; AOD measured 8.1-8.7 %; drift deleted) |
| horologist | part (zenith-centred shade; Seoul horizon; **D30 sunken moon porthole** at (225,330)) | part (ground #35484F, L* 29 at the zenith falling to 10; 6 names at 11 px; figures at 30 %; Milky Way <= 25 %; no planets) | no (trench r199-208 and flange r209-216 are 7-9 px dark-green bands with no numerals and no months) | yes (gold zodiac ticks are extra gold) | part (dragon cut to 140 x 104, 22 % smaller; AOD 6.4 %) |
| material | no | part (dome L* 3 to L* 51 with a real terminator; Milky Way 3-22 %; no names; moon 26 px) | part (two brushed gunmetal steps; circular, not radial, brushing; no numerals or months) | no (silver applied indices #C9D3D0) | part (digit protection relies on `Shadow`/`Outline` inside TimeText's Font, which the v4 XSD does not allow) |
| astronomer | part (pole (225,120), but the aperture is concentric) | no (base #0E151B 0.71 %; Milky Way <= 5.4 %; aperture only r150 and 46.6 % of it under the plate) | part (F1 24 h ring with 06/12/18 numerals and SOLAR; no months) | yes | yes |
| legibility | part (pole (225,85); sunken telemetry well) | no (base #05090B 0.2 %; Milky Way 5.9 %; Jupiter and Saturn 6-7 px) | part (lit chamfer flange plus enamel lip; no numerals or months) | part (gold day arc and ecliptic) | part (dragon 150 x 112; a 2 px AOD drift moves the digits) |
| motion | no (horizon arc only) | part (vault L* 17-27 but teal; pole under the colon, so only about 24 % of the well shows; no names) | no (one alloy flange) | no (teal, starlight blue, red giants; gold sun as the hero with a 64 px glow) | yes |
| kali | no | no (slate 1.05-5.2 %; Saturn 11 px) | no (teal solar ring and dark flange; no numerals) | no (adds ABYSS TEAL #163A3C) | part (dragon pre-clipped at r190; the AOD walk moves HH:MM) |

(D30 = 30 px diameter.)

## Ranking

1. **wff v2.** It is the only proposal that answers the photo, and the only one with pixels to show for it. The mock shows a grey radial-textured F2 (Y 3.5-25 %, 34.6 % of the dial) over a black lacquer F1 that carries the gold sun, which is the photo's two-flange look. All structure is in anodised phosphor metal. The Milky Way core is the brightest of the seven (Y 37.9 %). There are two off-centre round sub-discs. The pole sits under the dragon's arch, so the circumpolar sky turns through the openwork. The dragon keeps its v4 frame with an engraving bed and rim light. HH:MM sits on 85 % smoked glass. AOD is measured at 8.1-8.7 % with no drift, and the XML is XSD-checked. Its weaknesses are the gaps listed below.
2. **horologist v2.** A close second, and the most physical. It has the brightest sky ground (#35484F, L* 29 at the zenith), readable constellation names, the only true tourbillon analogue (a 32 px opaque cage at r187 that occludes the band, the lip, the sun and the indexes), a sunken off-centre moon porthole, a true sun that fades from disc to ring at civil dusk, and Gyro tilt parallax. It loses on the photo: the flanges are thin dark-green bands with no numerals and no month ring, the dragon is cut to 140 x 104, and there are no planets.
3. **material v2.** It has the best chiaroscuro on the dome: a directional terminator, a Fresnel rim and a hot-spot spanning L* 3-51. It has two stepped gunmetal flanges, a shaded moon whose lit limb faces the sun pointer, and a phosphor PPI graticule that speaks to my radar background. But it has no eccentric layering at all and no names, its silver indices break the one-metal rule, and its digits rely on a TimeText Shadow/Outline that v4 does not support, with no plate behind them.
4. **astronomer v2.** It has the best astronomy and the best Kali-to-Dragon-edition idea: Draco drawn in phosphor, wheeling under the official dragon. The dragon's cast shadow is crossed by the seconds marker every minute, and there is a 24 h F1 ring with numerals. But the sky is near-black (0.71 % base, Milky Way <= 5.4 %) inside an r150 aperture with 75 px of rings around it, and a 55 % plate covers 46.6 % of it. The hero I came for is small and dim. Its 11 Reference carriers also add Wear OS 6 risk.
5. **legibility v2.** It is the most readable and the safest in AOD. The geometry is elegant: a stereographic pole at (225,85), the horizon on the flange edge at r176.6, and a sunken telemetry well that matches the Galaxia's deepest level. But the sky is near-black (0.2 % base, Milky Way 5.9 %), the dragon is cut to 150 x 112, and the 2 px ambient drift moves HH:MM. It has one lit flange instead of the two-level grey/black pair.
6. **motion v2.** The motion craft is good: a counter-rotating wake, spatial Variants only on active-only nodes, and a 60 fps escapement tick. But the pole sits under the colon, so the circumpolar sky hides behind the dragon and the glass and only two side ports show. Teal, blue and red-giant hues break the palette. It has one flange, and the gold sun becomes the hero with a 64 px glow when it should be tiny.
7. **kali v2.** It works against the main reference. It explicitly "de-JLCs" the design, keeps a dark slate sky (1.05-5.2 %), adds an ABYSS TEAL hue, has dark flanges with no numerals or months, pre-clips the official dragon at r190, and walks HH:MM in AOD. Its useful parts are the real planets, the LST readout and the handedness test.

## Grafts into the winner (one per non-winning proposal)

1. **[horologist] Gyro tilt parallax.** The depth must move when I turn my wrist.
   - Use `<Gyro>` on three groups, driven by `[ACCELEROMETER_ANGLE_X]` and `_Y`:
     - sky group (sky, moon, dome light, north ground, horizon line): x/y = `clamp(0.07*a, -3, 3)`;
     - ring group (lip, trench, F1, F2, sun, probe, `live` trail): `clamp(0.035*a, -1.5, 1.5)`;
     - dragon: `clamp(-0.02*a, -1, 1)`.
   - The plate, digits, date and registers are camera-locked.
   - Active only. Turning on reduced motion removes it: the `reduce_motion` TRUE subtree simply has no Gyro.
   - Bake F2 out to r228 so the shift never exposes black at the dial edge.
   - The multipliers are placeholders until they are tuned on the SM-R965N; cap the result at 3 px and check battery drain.
2. **[astronomer] Draco in phosphor under the Kali dragon.**
   - Bake the 14-star Draco figure into `sky_active` as 1.2 px #A6F46A lines at 55 %, with Eltanin and Rastaban as 2.6 px phosphor dots. Every other figure stays white grisaille.
   - On the wff chart, Draco lies 22-45 px from P(225,114), inside the circumpolar cap, so it wheels through the dragon's openwork all day.
   - In AOD, keep the Draco lines as dim vectors (#4D633F, 1.2 px) in `sky_aod`.
3. **[material] Phosphor PPI graticule.**
   - Bake into `sky_active` declination rings about P at +60 / +30 / 0 / -30 deg (stereographic r 34.3 / 73.9 / 128 / 221.7) and RA spokes every 2 h, starting at r40 (blank centre).
   - Draw them 1.0 px #A6F46A at 10 % (rings) and 8 % (spokes).
   - It rotates with the sky against the static F2, so the sidereal motion can be read within an hour. It is radar DNA.
   - Active only. It is the first thing to cut if the 150 px thumbnail reads busy.
4. **[legibility] Level -1 well treatment on the two registers.** This makes them sunken off-centre sub-discs, as the photo asks, instead of floating glass.
   - Floor: #000.
   - Upper-left inner wall: an inner-shadow crescent, black 80 % at r40 fading to 0 at r32, centred at 315 deg.
   - Lip: 1.5 px at r39-40.5, in the phosphor-metal gradient (#D2FFA4 to #A6F46A to #4E7F34) at about 60 % on the lit 45-225 deg arc, and #0E1215 on the other arc.
   - No outward drop shadow, because a sunken disc casts none.
   - Inscriptions are white (#EFF8EC / #9BAB9C) on the black floor.
5. **[motion] Counter-rotating wake.**
   - Wrap `sky_active` alone in a 586 px Group with pivot 0.5/0.5 and give it `Variant mode=AMBIENT target=angle value=3 angleDirection=COUNTER_CLOCKWISE duration=1.0 CUBIC_BEZIER 0.22 1 0.36 1`.
   - `sky_aod` stays at the true LST angle, so AOD is never displaced.
   - On wake the sky settles 3 deg anticlockwise while F2 settles -14 deg to 0 clockwise. The two planes visibly separate in opposite senses.
6. **[kali] Real planets on the sky plate.**
   - Bake Jupiter (banded, central highlight and limb darkening) and Saturn (with its ring) at their real 2026 RA/dec, and regenerate the bake every year.
   - Jupiter becomes the "large painted sphere" (see gap 3). It sits 95.6 px from P, so twice a day it crosses under the dome lip near the north point, and the ring edge cuts it.

## Main-reference gaps that no proposal fills (required in wff v3)

1. **The flanges need their numerals and months.**
   - **F2, the grey radial ring.** Make it the 24 h scale:
     - even numerals 00-22 at 11 px #EFF8EC, r about 218, with 00 at 12 o'clock (the current F1 convention);
     - phosphor-metal batons at the odd hours;
     - the 60 engraved ticks stay as fine texture;
     - the `kali@vault:~$ INFINITY` inscription stays at 6 o'clock as the "wordmark on the ring".
   - **The minute pointer** is removed: minutes are on HH:MM and seconds on the trail.
   - **F1, the black ring.** Make it the calendar ring:
     - 12 month names at 9 px #B9C5CA plus day ticks with 10 / 20 markers;
     - the ring rotates with the probe group (angle E4 = 180 - LST), so the sun's position against it is the month, which is the Galaxia mechanism;
     - month names are placed at the sun's RA on the 1st of each month;
     - they are decoration (the date line is the information).
   - **The sun** becomes a 6-ray gold star of 11 px diameter or less riding on F1, read radially against the F2 numerals.
   - **Bezel check:** confirm on the device that r218 numerals are visible under the Classic's bezel.
2. **Constellation names.**
   - Bake 6-8 names at 11 px #B9C5CA, at 60 % or more, along their figures: URSA MAJOR, CASSIOPEIA, CYGNUS, ORION, LEO, LYRA, PEGASUS, and DRACO in phosphor.
   - They rotate with the sky like a planisphere and dim to 15 % under the plate.
3. **One large painted sphere cut by a ring edge.**
   - Draw Jupiter (graft 6) at a stylised 48-56 px, declared as decoration scale.
   - Make it a grisaille sphere with a terminator and limb darkening, kept out of the AOD.
4. **A bright object worth the name.**
   - The probe (r2.5 core) is too small to be the Cosmotourbillon. Grow it into a 22 px sentinel cage centred on r190.5, so its lane is r179.5-201.5. Model it on the horologist's cage:
     - opaque back-disc #0B1E26;
     - phosphor-metal ring 1.5 px, lit at NW;
     - cast shadow (+2,+2) at 50 %;
     - a three-arm carriage turning `[SECOND]*6`, i.e. once a minute like the real cage.
   - The lane overlaps the dome lip and F1's inner edge, so the cage is the one object that crosses ring edges. It clears the registers (r <= 163.6) and the plate (r <= 132), and passes under the dragon's wing roots.
   - The seconds trail starts at the cage rim.
   - In AOD only the ring remains, at 35 % (#5E7A55).
5. **Telemetry at a daily-wear size.**
   - Register values at 22 px with at most 5 characters (`6,240`; at 10,000 and above, show `12.3k`).
   - Keep `numberFormat("#,###")`. The text says "no separator" but the mock shows one; make them consistent.

## Must NOT survive

1. **Any movement of HH:MM**, in either mode: kali's 1 px / 10 min AOD walk and legibility's 2 px `drift` group. Samsung already shifts the AOD frame. (wff has already deleted its drift; keep it deleted.)
2. **Shrinking or clipping the official dragon**: horologist's 140 x 104 at (155,46), legibility's 150 x 112 at (150,26), and kali's PNG pre-clipped at r190 and pre-darkened over r182-190. It stays at the v4 frame (135,24) 180 x 123, uncut.
3. **Gold anywhere but the tiny sun**:
   - wff's gold `SCO` text (#D9A441), which should become #9BAB9C;
   - horologist's gold zodiac ticks;
   - astronomer's and legibility's gold ecliptic and day arcs;
   - motion's 64 px sun glow;
   - material's copper trench flecks and gold boundary dots.
4. **Extra hues and non-phosphor structure**:
   - kali's ABYSS TEAL #163A3C;
   - motion's vault teal #2F5146, its blue starlight and its #D9A070 red giants;
   - material's silver applied indices #C9D3D0;
   - **wff's daytime veil**: #2E4A5A at up to 42 %. It tints the sky blue and drops the Milky Way from Y 37.9 % to 20.8 % in daylight, which is exactly when I look at the watch most. Delete it; the sun on F1 already says day or night.
5. **Near-black sky value plans**: astronomer's #0E151B with the Milky Way at 5.4 % or less, legibility's #05090B with the Milky Way at 5.9 %, and kali's slate #141C18 to #33443B. The photo's sky is white-on-black and high-contrast.
6. **Digit protection that relies on TimeText `Font > Shadow / Outline`** (material). It is not in the v4 TimeText schema. Keep wff's smoked plate.
7. **A pole at the dial centre under the colon** (motion, horologist). It puts the circumpolar sky under the digits.
8. **Astronomer's 55 % plate over 46.6 % of an r150 aperture**, and its 11 Reference carriers.

## Acceptance checks for the next reference sheet

- **150 px thumbnail (about 40 mm):** the grey F2, the black F1 with its month names, the two sunken registers, the Milky Way, Jupiter and the cage must each be identifiable.
- **1:1 at 480 px and 40 % brightness:** HH:MM reads in under 1 s at 20:08 and at 10:08. The Draco, graticule and names layer does not touch the plate's 85 % core.
- **AOD:** re-measure the non-zero share by the v4 rule after the grafts. The target is 9.5 % or less (the limit is 15 %). Draco and the cage ring add about 0.3 %; the graticule, names, Jupiter and month names are Active only.
- **Gyro:** shift is 3 px or less, the digits stay locked, reduced motion removes it, and battery drain is checked under T7.
- **Wake order:** the sky settles CCW, F2 settles CW, then the glass and the dragon come forward. All `startOffset + duration` values are 1.0 or less.
