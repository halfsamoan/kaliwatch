# KALIWATCH v5 "Celestial Vault" — material proposal v2 (3D / chiaroscuro lens)

Author lens: 3D material artist. v1 built the right instrument and exposed it wrong: every plane that was supposed to carry material lived between 0.15 % and 1.3 % relative luminance, so on a 40 mm OLED it would have collapsed into "stars plus a ring". v2 keeps the skeleton the three critics agreed is strong (true polar sky under the colon, one key light, stacked flanges with the minute groove at r208, the wake order, the AOD plan) and fixes the five fatal findings: exposure, the covered hero plane, two suns, the dragon relief, and the burn-in walk that moved HH:MM. It also replaces every WFF construction that does not exist (`<Expressions>` on Scene, `TimeText format="HH"`, `PartText` inside `DigitalClock`, ALPHA_8 memory accounting, the hand-stated "no blur available") with verified ones.

Everything numeric below was recomputed, not carried over: luminance in `scratchpad/debate/tools/exposure_v2.py` (sRGB -> linear, Rec. 709), ephemeris in `scratchpad/debate/tools/ephem_v2.py` using the exact expressions of section 6, dragon ink box from `scratchpad/debate/dragon-bbox.cjs`. WFF facts were re-read on developer.android.com on 2026-10-25: `Font` children are `Shadow`, `Outline`, `OutGlow`, `Underline`, `StrikeThrough`, `InlineImage`, `Template`, `Upper`, `Lower`, `Transform`, `Reference`; `Shadow` has `color offsetX offsetY radius` (Wear OS 4); `Outline` has `color width` (Wear OS 4); `Font color` is transformable from v4; `Reference` (`name`, `source`, `defaultValue`, consumed as `[REFERENCE.name]`, placeable under any scene object that supports Transform) is Wear OS 6 = WFF v4.

Design space 450 x 450, centre C = (225,225), R = 225. Clock angles: 0 deg = 12 o'clock, positive = clockwise (WFF `angle`). Device scale 480/450 = 1.0667; every bitmap is baked at device resolution (480 space) and every coordinate in the generated XML is multiplied by 1.0667. Plane heights are a fiction the shading sells: lacquer floor -3, dome rim -1 rising to 0 at the pole, inner flange +1, bevel, outer flange +2, dragon +2, glass print +3. One key light from 10:30 (315 deg), elevation 35 deg, obeyed by every bake.

---

## 0. The one-sentence idea

A real moon, shaded as a sphere, rides the real northern sky that turns behind the time once a sidereal day inside a lit enamel dome, while a gold sun pointer circles the rim once a day.

One hero (the moon), one pointer (the sun), one emblem (the official dragon), one information block (the glass print). Everything else is material. Seven time scales still exist, but only four are meant to be read: seconds (bead), minutes (arc), civil time (digits), 24 h solar (sun pointer, 12 = solar noon, 6 = solar midnight). Sidereal day (sky), month (sun pointer against the ecliptic ring) and lunar (moon position + phase) are there to be noticed over hours and weeks, not read.

---

## 1. Layer stack (back to front)

| z | Layer | Shows | Time scale | Geometry (450 space) | Material / bake | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | `void` | Scene background | none | full disc | `#000000` | on | on |
| 1 | `sky_disc` | Grisaille star map, N-polar azimuthal-equidistant, pole at C, s = 1.633 px/deg, edge dec -30 at r196; RA 0h at 12, RA increases clockwise (looking-up chart: S 12, E 3, W 9, N 6). The lacquer floor of the trench (r194-205) is painted into the same bitmap. | sidereal: angle = (360 - LST) mod 360, i.e. anticlockwise 0.250684 deg/min, one turn per 23h56m04s | disc r205 (410 x 410 design, 437 x 437 device), pivot C | section 1.1 | rotates, alpha 1, Group scale 1.0 | `sky_ambient.png` 392 x 392, white dots m <= 3.0 (~128), tint `#8FA3B2`, alpha 128, same rotation, Group scale .965 |
| 2 | `moon` | The hero: a 26 px sphere at the moon's real chart position, real phase, lit limb facing the sun pointer, fading under the horizon | lunar (hour angle 0.2415 deg/min anticlockwise, +13.2 deg/day along the ecliptic, phase from `[MOON_PHASE_TYPE]`) | r = 1.633 (90 - decMoon) = 100..194 px, clock angle thMoon | section 1.3; 5 baked sprites 34 x 34 | sprite, alpha = altitude gate | `moon_ambient.png` 1 px ring `#8FA3B2` alpha .45, same gate |
| 3 | `sun_pointer` | The Galaxia sun pointer: one gold object in the trench, 24 h apparent solar time; its radial points at the sign the sun is in on the ecliptic ring of z1 | 24 h solar: angle = thSun = RAsun - LST (anticlockwise 0.25 deg/min); month: pointer vs ecliptic ring | 16 px sprite centred at r199.5 (in the trench r196-203), pivot C | disc r4.5 `#F0CB8A`, edge `#D9A85C`, 6 baked ray ticks 2 px, inward ray 3 px longer (the pointer), halo r8 alpha .35 | alpha 1 | alpha 128 |
| 4 | `dome_light` | The static lighting that makes the dome a dome: glaze, hot-spot, terminator, Fresnel rim, trench AO, horizon haze + hairline, and the phosphor glow the dragon throws onto the dome | none (observer-fixed, Seoul 37.57 N) | 410 x 410 design centred C, never rotates | section 1.2 | alpha 1 | alpha 0 (hairline is duplicated into `flange_ambient`) |
| 5 | `flange` | Two stepped brushed-gunmetal rings, 60 engraved ticks, 24 trench dots + 4 solar marks, bevel, 12 applied indices | none | inner flange r203-214 (+1), bevel r214-217, outer flange r217-225 (+2), indices r213-219 | section 1.4 | `flange_active.png` alpha 1, angle -6 -> 0 on wake | `flange_ambient.png`: glint arc, indices 40 %, 4 marks 40 %, horizon hairline |
| 6 | `minute_arc`, `seconds` | Phosphor arc 0 -> minute angle in the tick groove; seconds bead + 3 ghost beads | minutes / seconds | r208, arc 1.6 px; bead r3.3; ghosts at -6/-12/-18 deg | vector `#A6F46A`; arc alpha .8; ghosts .50/.28/.12. Must sit exactly on the engraved tick radius | on | off |
| 7 | `dragon` | Official Kali dragon, flat phosphor, mounted over the rim like the Dragon-edition engravings: it crosses the trench and the flange at the top | none | frame x135 y24 w180 h123 (v4 placement; official viewBox 5 22 126 94, path unchanged, scale 1.3085); ink box x143-306, y23-144 | section 1.5; PNG 190 x 133 at (130,19) | `dragon_active.png` alpha .96 | `dragon_mask.png` tint `#5E7A52` alpha 255 (dim fill, v4 look) |
| 8 | `digits` | HH:MM printed on the glass, with its own blurred shadow and a 1 px ink edge | civil time | hour centre x166, colon x225 (baseline 248), minute centre x284, baseline 252; glyph box x119-331, y195-252 | Roboto Mono SemiBold 78, `#EFF8EC`; `Shadow #99000000 offset (2,3) radius 4`; `Outline #80000000 width 1.0`; colon `#A6F46A` | filled | twin DigitalClocks: fill `#11200F`, `Outline #91AD80 width 1.4`; colon `#6E8862` |
| 9 | `text` | date, values, gauges, divider, prompt | day; live sensors | section 2 | Roboto Mono; `#9BAB9C` quiet, `#EFF8EC` values, `#A6F46A` gauges, `#F3C479` warning; `Shadow #80000000 (1,2) radius 3` on every text | on | date, `BAT 78%`, `INFINITY` in `#6E8862` |

z2 and z3 are drawn under z4 on purpose: the moon takes the same glaze, terminator and haze as the stars (it stays on the sky plane instead of becoming a sticker), and the sun pointer's halo is shaded by the trench walls on both sides (it sits down in the channel; the flange clips the outer rim of the halo on top of that).

### 1.1 Grisaille build of `sky_disc` (bake order, all static, all rotation-invariant where it touches legibility)

Grisaille = dark fired ground, white enamel painted on top, thicker = lighter. Translated into value passes; saturation stays under 15 % so the only hues on the face are phosphor, gold, cold enamel and (warning only) amber. The disc rotates, so everything that protects the digits is a function of radius only.

1. Ground, radial: `#222B36` (pole, Y 2.3 %, L* 17) -> `#1D2631` (r120, Y 1.9 %) -> `#151C24` (r196, Y 1.1 %, L* 10). 2 % monochrome grain plus blue-noise dither (1 LSB) baked in, so the 8-bit ramp does not band on the panel. This is one stop above v1 (v1 pole was Y 0.5 %); the terminator in z4 now has something to take away.
2. Milky Way: galactic equator (node RA 18h51m, inclination 62.9 deg; brightest toward Sagittarius at the SE edge, dark Cygnus-Aquila rift). Three brush passes 46 / 28 / 14 px wide, white .05 / .07 / .09, multiplied by a cloud-noise mask, values 3-22 %; tint 60 % `#8FA3B2` + 40 % white. Inside r110 multiply by .8 (v1: .5).
3. Graticule (Kali-native, replaces the transferred names and the disc flecks of v1): declination rings every 30 deg at r49, 98, 147, 196 and RA spokes every 2 h (12), 0.8 px phosphor `#A6F46A` at alpha .10 (rings) / .08 (spokes); spokes start at r60 (PPI-scope centre blank). Astronomically exact, rotates with the sky, and it is the one thing on the face a JLC would never do. Because it turns against the static flange ticks it is also the only hour-scale evidence that the disc moves (1 px/min at the rim).
4. Constellation lines: 0.8 px `#3D4C56` alpha .5 for 18 figures (UMa, UMi, Cas, Cep, Dra, Cyg, Lyr, Aql, Boo, Leo, Gem, Ori, Tau, Aur, Per, And, Peg, CMa). Texture at 40 mm, declared as such. No constellation names anywhere (v1 had 7 px names; dropped).
5. Ecliptic: the exact curve r = 1.633 (90 - dec(lambda)), angle = RA(lambda) (dec = asin(0.39777 sin lambda), RA = lambda - 2.4657 sin 2lambda + 0.053 sin 4lambda), not the off-centre circle of v1 (5.3 px off at the equinoxes). 1 px dashed 3/3 `#7A6A48` alpha .5; 12 gold dots 2 px `#D9A85C` alpha .6 at the sign boundaries (lambda = 0, 30, ... 330). Check points: lambda 0 -> (RA 0, dec 0, r147.0); 90 -> (90, +23.4, r108.7); 180 -> (180, 0, r147.0); 270 -> (270, -23.4, r185.2). No zodiac glyphs (9 px glyphs were texture pretending to be a reading).
6. Stars: Yale BSC to m 3.5, dec > -30 (~220 stars; whole sky 171 to m 3.0 and 513 to m 4.0, x 0.75 for dec > -30). m <= 0.5: core r2.2 + halo r5 at .25; m <= 1.5: r1.8 + halo r4 at .18; m <= 2.5: r1.4; m <= 3.5: r1.0 alpha .75. Spectral tint, desaturated: O/B `#DCE8F2`, A/F `#F2F4F0`, G/K `#F0E4D0`, M `#E8CFB8`. Inside r120 multiply alpha by .75 (v1 .6) and cap cores at 1.8 px; minimum core 1.4 px everywhere so rotation resampling does not erase a star.
7. Trench floor (r194-205, the lacquer bed, plane -3): ground `#1C2229`, copper flecks 2 px `#F0CB8A` alpha .6-.9, one per 3 deg, randomly placed in radius. It rotates with the disc at 0.25 deg/min; random flecks are rotation-invariant to the eye. Only the bottom of the U-shaped AO (z4) shows it, at 30 %.

Anchor stars (r from C, clock angle before rotation = RA in degrees): Polaris r1.2 @ 37.9; Dubhe r46.1 @ 165.9; Alkaid r66.4 @ 206.9; Capella r71.9 @ 79.2; Deneb r73.0 @ 310.4; Vega r83.6 @ 279.2; Pollux r101.2 @ 116.3; Arcturus r115.6 @ 213.9; Aldebaran r120.0 @ 69.0; Regulus r127.4 @ 152.1; Altair r132.5 @ 297.7; Betelgeuse r134.9 @ 88.8; Procyon r138.4 @ 114.8; Rigel r160.4 @ 78.6; Spica r165.2 @ 201.3; Sirius r174.3 @ 101.3; Antares r190.1 @ 247.4.

### 1.2 `dome_light` (the layer that makes it not flat), re-exposed

One static PNG with alpha, 410 x 410 design, drawn above the sky, the moon and the sun pointer. Every pass is a number the device test can turn, and the v1 terminator bug is fixed: a radial gradient centred SE of C darkens the NW rim most, which is a vignette, not a terminator. v2 uses a directional (linear) term.

- Specular glaze: radial, centre (152,152), radius 160, white alpha .20 at centre -> 0, ease-out (alpha = .20 (1 - (d/160)^1.6)). The convex glossy enamel catching the key light. Centre sits in open sky left of the date and above the hour digits, not under the dragon.
- Hot-spot: radial, centre (150,150), radius 24, white alpha .22 -> 0 (Gaussian). The one highlight that says "glossy"; its 24 px radius keeps it clear of the date (y >= 162) and the hour digits (y >= 195).
- Terminator: linear along the 315 -> 135 deg axis. With u = ((x-225) + (y-225)) / (196 sqrt 2) (-1 at the NW rim, +1 at the SE rim), black alpha = .62 smoothstep(.05, 1, u). Zero on the lit half, .62 at the SE rim: the far side of the dome falls away.
- Fresnel rim: annulus r186-196 feathered 10 px inward, white alpha = .05 + .17 max(0, cos(theta - 315 deg)). Bright on the lit side, barely there on the dark side: curvature.
- Trench ambient occlusion: r196-203, black alpha .78 at r196 -> .30 at r199.5 -> .78 at r203 (U profile). The lacquer floor is visible only at the bottom of the U.
- Horizon haze (Seoul 37.57 N), exact curve: cos(HA) = -tan(37.57 deg) tan(dec), i.e. the locus runs through W (78,225), the north point (225,286.4) and E (372,225) and meets the rim (dec -30) at clock angle +/-63.6 deg, at (400.6,137.9) and (49.4,137.9). The "circle centred (225,78) r208" of v1 is deleted: it is 21 px off at the rim. Below the curve: `#06090D` alpha .32 (v1 .45), feather 6 px; plus a 1.2 px hairline `#8FA3B2` alpha .30 (the Earth's rim). Stars rise over it in the east lune and set under it in the west lune in real time; the moon sinks into it (section 1.3).
- Dragon underglow: phosphor `#A6F46A`, soft ellipse centre (225,88) rx 110 ry 70, alpha .12 at centre -> 0, Gaussian. The dragon is a phosphor lamp hovering ~4 px above the dome; it lights the dome and the top of the flange under it. Positive light instead of v1's invisible cast shadow.
- No central well. Legibility is carried by the radial star cap, the glyph `Outline` and the glyph `Shadow` (section 1.6).

Measured composites (Active, before stars):

| Point | Build | Hex | Y | L* |
|---|---|---|---|---|
| Pole ground, lit side, under the hour digits (glaze .14) | `#222B36` + white .14 | `#414952` | 6.7 % | 31 |
| Glaze peak (152,152) | ground r105 + white .20 | `#4B525B` | 8.5 % | 35 |
| Hot-spot (150,150) | glaze + white .22 | `#73787F` | 19 % | 51 |
| Under the minute digits (284,223) | ground + glaze .02 + terminator .03 | `#232C37` | 2.4 % | 17 |
| NW rim (86,86), Fresnel .22 | `#151C24` + white .22 | `#484E54` | 7.5 % | 33 |
| SE rim (364,364), terminator .62 | `#151C24` + black .62 | `#080B0E` | 0.3 % | 3 |
| Trench floor (bottom of U) | `#1C2229` + black .30 | `#14181D` | 0.9 % | 8 |
| Trench wall | `#1C2229` + black .78 | `#060709` | 0.2 % | 2 |

The dome now spans L* 3 (far rim) to L* 51 (hot-spot): a 48-step range instead of v1's 8. The asymmetry is the lighting: the hour digits sit on a lighter ground (L* 31) than the minute digits (L* 17). Contrast of `#EFF8EC` is 8.2:1 on the lighter side and 13:1 on the darker side.

### 1.3 `moon` (the hero: a shaded sphere that is really there)

Sprites: 5 baked PNGs 34 x 34 (26 px disc + 4 px halo margin), referenced from the 8 `[MOON_PHASE_TYPE]` branches: `moon_new` (0), `moon_crescent` (1, 7), `moon_quarter` (2, 6), `moon_gibbous` (3, 5), `moon_full` (4). Every sprite is baked with the lit limb toward local "up" and the terminator symmetric about the vertical axis, so waxing and waning differ only by rotation.

- Lit side: limb `#F4F1E6` (Y 88 %), body `#E6E1D2` (Y 75 %), falling to `#CFC9B8` at the terminator; 1 px limb darkening on the lit edge; maria hinted at 6 % contrast.
- Dark side: `#1E232A` alpha .92 (it occludes stars; it is not glass).
- Halo: 6 px `#E6E1D2` alpha .25 -> 0 on the lit side only.
- The moon is exempt from the key light: its phase is its lighting. It still receives z4 (glaze, haze, terminator), which keeps it inside the painted disc rather than on top of it.

Placement (one copy of the maths, no x/y float problem): outer `Group` pivot C with `Transform angle = thMoon`; inner `Group` with `Transform y = 225 - 1.633 (90 - decMoon) - 17` (the sprite sits at 12 o'clock at radius r before the rotation); the sprite's own `angle` is a constant per branch: -90 for waxing (1, 2, 3), +90 for waning (5, 6, 7), 0 for new and full. Reason: RA increases clockwise on the chart, so a waxing moon has the sun anticlockwise of it; after the outer rotation the sprite's "up" is radial-outward, and -90 turns the lit limb toward the anticlockwise tangent, i.e. toward the sun pointer. The error of this tangential approximation is under 30 deg, invisible on a 26 px sprite, and the viewer sees the moon's bright side agree with the gold pointer on the rim.

Altitude gate: `alpha = clamp(255 * 6 * (0.6097 sin(decMoon) + 0.7927 cos(decMoon) cos(thMoon)), 0, 255)` (sin / cos of 37.57 deg). The moon fades out across the first 9.6 deg above the horizon and is gone below it, instead of sitting as a grey smudge behind the telemetry. The sun pointer is not gated: it is a mechanical pointer, visible at night at the bottom of the dial.

Collision policy: the moon passes under everything. Under the digits the `Outline` and `Shadow` keep the glyph edges; under the dragon a phosphor dragon over a bone moon drops to ~1.2:1 for a few minutes on high-declination days, which is accepted as the rare "dragon against the moon" event and is why the dragon carries a 1.2 px contact edge (section 1.5).

### 1.4 `flange` and trench (metal you can see)

- Inner flange r203-214 (+1): base `#262D31` on the dark arc (Y 2.5 %, L* 18) brushed to `#3A4449` on the lit arc (Y 5.5 %, L* 28). Circular brushing streaks `#141A1D`..`#2E373B`, period 1-2 px, plus a second specular lobe at 135 deg at 35 % of the main lobe (brushed metal shows two opposing lobes).
- 60 engraved ticks r206-211: 1 px groove `#0B0E10` + 1 px lit edge `#5A676C` (Y 13 %) on the NW side only; 5-minute ticks r205-212, 1.6 px.
- Bevel r214-217: 2 px highlight `#AEBBB9` at .70 on the arc 240 -> 30 deg (composite `#8B9797`, Y 30 %, L* 61), 2 px shade black .65 on the arc 60 -> 210 deg (composite `#0D1011`, Y 0.5 %), both feathered 1 px; step AO 1 px black .5 at r213-214 on the shade arc.
- Outer flange r217-225 (+2): `#2B3338` dark arc -> `#454F55` lit arc (Y 3.2 -> 7.5 %), same brushing.
- 12 applied indices 2.5 x 5 px `#C9D3D0` (Y 64 %) at r213-219 with a 0.5 px top highlight `#E4ECE9` (moved in from r219-224 so the brightest ring element cannot hide under the Classic's bezel if the bezel does overlap; every depth-critical cue sits at r <= 217).
- Trench marks on the inner flange's inner edge r203-206: 24 dots 1 px `#3B4347` every 15 deg (texture) and 4 marks 2 px `#8A7A52` at 12 / 3 / 6 / 9 = solar 12 h / 06 h / 00 h / 18 h. The sun pointer therefore reads like an unlabelled 24 h hand: top = noon, bottom = midnight, right = dawn, left = dusk.
- Plane-boundary rule: every boundary is at least a 3x luminance step. Measured: Fresnel rim vs trench wall 37x; floor vs wall 4.2x; inner flange (dark arc) vs wall 12x; bevel highlight vs inner flange lit 5.4x; outer flange dark vs bevel shade 6.4x; NW rim vs SE rim 25x; glaze peak vs pole ground 3.7x. (The hot-spot vs glaze is 2.2x; that is a highlight within one plane, not a boundary.)

### 1.5 `dragon` (official path only, flat, mounted over the rim)

- v4 placement and size kept: frame x135 y24 180 x 123, official viewBox `5 22 126 94`, path bytes unchanged (SHA-256 in `brand/PROVENANCE.md`). Ink box x143-306, y23-144 (computed from the path), so the top of the dragon crosses the trench (r196-203) and the flanges: the engraved dragon is mounted over the rings, as on the JLC Dragon edition. The zenith (225,139.4) sits under its belly; the open line-work lets most of the sky through.
- Active: fill `#A6F46A` alpha .96 (v4 look), plus a 1.2 px contact edge: the path stroked outward 1.2 px in `#000000` alpha .45, under the fill. It is the ambient occlusion where a relief meets the glass and it keeps the dragon legible over the moon, the hot-spot and bright stars. No gradient, no rim-light masks: the official strokes are ~2 px wide at this size, and path-minus-translated-path masks (v1) consume the whole stroke.
- The dragon's depth cue is the underglow in z4 (positive light on the dome and the flange), not a shadow nobody could see.
- AOD: the same path as `dragon_mask.png` (white on transparent) tinted `#5E7A52` (Y 16.9 %), alpha 255: the v4 dim-fill look. Lit pixels ~1,500 (stroke length ~610 px x 2.5 px), the same count as a 1.2 px contour of the same path, with one asset fewer and no double-line artefact.

### 1.6 `digits` and text on the glass

- Active: two `DigitalClock`s (hours box x119 w94, minutes box x237 w94, `align CENTER`, baseline 252) and a sibling `PartText` colon at x225 baseline 248; `Font family="roboto_mono_semibold" size="78" weight="SEMI_BOLD" color="#ffEFF8EC"` with `<Shadow color="#99000000" offsetX="2" offsetY="3" radius="4"/>` and `<Outline color="#80000000" width="1.0"/>`. The blurred shadow falls on a ground of L* 17-31, where a 4 px blur at .6 is a visible 10-12 L* step (on v1's L* 5 ground it was a 0.44-nit nothing). The 1 px half-black outline is the ink thickness of a print on glass and the edge protection against the rotating star field.
- AOD: twin `DigitalClock`s with `Font color="#ff11200F"` and `<Outline color="#ff91AD80" width="1.4"/>`; colon `#6E8862`. No `BitmapFont`, no glyph PNGs, no crossfade misregistration (same TimeText geometry in both states).
- All other text uses `Shadow #80000000 (1,2) radius 3`.

```
                 GLASS PRINT (+3)  HH:MM (Shadow 2,3 r4 + 1 px ink edge), date, values, prompt   [never moves]
      DRAGON (+2)  official path, flat phosphor, 1.2 px contact edge, underglow on the dome below it
 =======  OUTER FLANGE r217-225 (+2)  brushed, 12 indices at r213-219
   \__    BEVEL r214-217  highlight 240->30 (Y 30 %), shade 60->210 (Y 0.5 %)
      ====  INNER FLANGE r203-214 (+1)  Y 2.5-5.5 %, 60 ticks; minute arc + seconds bead in the groove r208
          \_/  TRENCH r196-203  AO walls (Y 0.2 %), lacquer floor at the bottom (Y 0.9 %), SUN POINTER rides here
             .---------------- CELESTIAL DOME r0-196 ----------------------------------------.
             |  grisaille disc (Y 1.1-2.3 %), rotates anticlockwise 0.2507 deg/min about C    |
             |  MOON (26 px sphere) on the sky; static light above: glaze NW (Y 8.5 %),        |
             |  hot-spot (Y 19 %), terminator SE (Y 0.3 %), Fresnel rim, horizon haze .32       |
 ~~~~~~~~~~~~~~~~~~  LACQUER FLOOR (-3), painted into the sky bitmap at r194-205  ~~~~~~~~~~~~~~
                       key light 10:30 (315 deg), elevation 35 deg, one light for every bake
```

---

## 2. Composition

| Element | Position (450 space) | Size / colour |
|---|---|---|
| Official dragon | frame x135 y24 180 x 123 (ink 143-306 x 23-144) | flat phosphor `#A6F46A` .96 + contact edge |
| Date `25 OCT / SUN` | centre x225, baseline y174 | 16 px `#9BAB9C` |
| HH | centre x166, baseline y252 | 78 px SemiBold `#EFF8EC` |
| colon | x225, baseline y248 | 78 px `#A6F46A` |
| MM | centre x284, baseline y252 | 78 px SemiBold `#EFF8EC` |
| values `78%` / `6,240` | centres x158 / x292, baseline y304 | 22 px `#EFF8EC`; battery <= 15 % -> `#F3C479` |
| gauges | y314, x126-190 and x260-324, 2 px; track `#17291D` | `#A6F46A` |
| divider | x225, y288-318, 1 px | `#34543C` |
| prompt `kali@vault:~$ INFINITY` | centre x225, baseline y364 | 13 px `#9BAB9C`, INFINITY `#A6F46A` |
| seconds bead / minute arc | r208 | phosphor |
| sun pointer | r199.5 | gold |
| indices | r213-219 | gunmetal highlight |
| moon | sky plane, r100-194 | bone sphere |

Removed vs v1: the BATTERY / STEPS word labels (the values and their gauges identify themselves; v4's AOD already proved `BAT 78%` suffices), the central well, the digit-shadow DigitalClock. Vertical rhythm: dragon 23-144, gap 18, date 162-174, gap 21, digits 195-252, gap 36, values 288-304, gauges 314, prompt 354-364. The telemetry still sits inside the below-horizon band (y > 286 on the centre line): the dark band is the Earth, not a vignette.

Safe text radius r178: the prompt is the limiting case, 139 px below C with half-width 86 px, corner distance 163 px.

Sky coverage, counted the way critic 1 counted (bounding boxes over the r196 disc, 120,645 px): dragon ink box 19,723 px (16 %, of which ~65 % is open line-work), date 2,000, digits 12,084, values 1,760, gauges 256, divider 30, prompt 2,210; total 38,063 px = 31.6 % boxed, so >= 68 % of the disc is uncovered sky and ~79 % is visible sky once the dragon's open strokes are counted. v1 was 28 % clear by the same method because the well (16 %), the labels and the dragon shadow margin were covers; the haze (42 % of the disc) is now a .32 dimming that leaves every star at 68 %, not a cover. The two lateral lunes are the feature, not the leftover: they are where stars, the moon and the Milky Way rise and set at a rate you can see across an hour.

Preview states (computed with the section 6 expressions, minute-quantised):

- Day, canonical: 2026-11-02 10:08:24 KST ("02 NOV / MON", 10:08). LST 185.31 deg, sky angle 174.69; sun lambda 219.6 deg (Scorpio), RAsun 217.2, decSun -14.7, thSun +31.9 -> pointer at (330,56) (2 h 08 m before solar noon); moon lambda 130.7, RA 133.2, dec +17.5, thMoon 307.9, r118.3 -> moon at (132,152), altitude +40 deg, elongation 271 deg = last quarter, lit limb facing the pointer at upper right; Polaris (224,226) under the colon; Dubhe (210,182), Vega (308,231), Arcturus (280,123), Sirius (52,207). The moon sits in the west lune, 8 px below the dragon's ink box and 30 px left of the date.
- Night, canonical: 2026-10-25 20:08:24 KST ("25 OCT / SUN", 20:08). LST 327.83, sky angle 32.17; thSun 242.0 -> pointer at (49,319) (8 o'clock, 4 h before solar midnight); moon lambda 21.7, dec +8.5, thMoon 52.2, r133.2 -> moon at (330,143), altitude +35 deg, elongation 170 deg (waxing gibbous / full per the device bucket), in the east lune 11 px right of the dragon's ink box and 6 px above the date; Summer Triangle at upper left: Vega (162,170), Deneb (203,155), Altair (158,110); Sirius (352,345) under the horizon haze, which is right for October at 20:00.
- Honest case kept in the studio switcher: 2026-10-25 10:08:24 KST, moon at (184,356), altitude -43 deg, alpha 0: a nearly full moon is below the horizon at ten in the morning, and the face shows no moon.

---

## 3. Palette

Identity: phosphor `#A6F46A` (seconds bead, minute arc, gauges, dragon, colon, INFINITY, graticule at .10/.08). In-family tints: `#5E7A52` AOD dragon, `#91AD80` AOD digit outline, `#6E8862` AOD static text (colon, date, BAT, INFINITY; Y 21.8 %, under the 22 % static cap), `#11200F` AOD digit fill.

Three controlled hues, no more:
1. Solar gold `#D9A85C` (light `#F0CB8A`): sun pointer, ecliptic boundary dots, trench flecks; `#8A7A52` for the 4 solar marks and the ecliptic dash. The one warm object, like JLC's gold sun pointer.
2. Cold enamel `#8FA3B2`: star and Milky Way tint, horizon hairline, AOD stars and moon outline; `#3D4C56` constellation lines (same hue at 20 % value). The grisaille.
3. Amber `#F3C479`: warning only (battery <= 15 %). Never decorative.

Neutrals: void `#000000`, paper `#EFF8EC`, quiet `#9BAB9C`, structure `#34543C`, track `#17291D`; grisaille ground `#222B36` / `#1D2631` / `#151C24`; lacquer floor `#1C2229`; gunmetal `#262D31` / `#3A4449` / `#2B3338` / `#454F55` / `#5A676C` / `#AEBBB9`, index `#C9D3D0`; moon bone `#E6E1D2` / limb `#F4F1E6` / dark side `#1E232A`.

---

## 4. Motion

Ease: cubic-bezier(.22,1,.36,1) = WFF `interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"`. Studio wake 360 ms; WFF `startOffset` / `duration` are fractions (ms/360) of a device-owned transition, every pair summing to <= 1.0 (otherwise startOffset is ignored). Rotating Variants carry `angleDirection="CLOCKWISE"`.

Wake, AOD -> Active (depth revealed back to front):

| ms (fraction) | layer | property |
|---|---|---|
| 0-140 (.00 + .39) | z1 sky | ambient disc alpha 1 -> 0; active disc alpha 0 -> 1; Group scaleX/scaleY .965 -> 1.0 about C (the dome rises toward you) |
| 40-200 (.11 + .44) | z4 dome_light | alpha 0 -> 1: glaze, terminator, trench AO, haze and the dragon glow switch on together; this is the frame where the stack becomes three-dimensional |
| 60-260 (.17 + .56) | z5 flange | active alpha 0 -> 1 with angle -6 -> 0 (CLOCKWISE); ambient flange alpha 1 -> 0 over 60-180 |
| 60-240 (.17 + .50) | z2 moon, z3 sun pointer | pointer alpha .5 -> 1; moon outline -> shaded sprite crossfade |
| 120-320 (.33 + .56) | z7 dragon | mask alpha 1 -> 0 (120-260); active alpha 0 -> 1 |
| 140-320 (.39 + .50) | z8 digits | ambient clocks alpha 1 -> 0 (140-300); active clocks 0 -> 1; their Shadow and Outline ride with them |
| 200-360 (.56 + .44) | z6 minute arc + seconds | alpha 0 -> 1; arc Group angle -14 -> 0 (CLOCKWISE): the v4 orbit-alignment signature |
| 240-360 (.67 + .33) | z9 telemetry, prompt | alpha 0 -> 1 (80 ms after the digits, as in v4); AOD-only BAT / INFINITY alpha 1 -> 0 over 0-120 |

Only three things move during wake: the sky scales 3.5 %, the flange turns 6 deg, the minute arc turns 14 deg. HH:MM never moves or scales, in either state. The v1 "digit shadow arrives last" beat is dropped: `Shadow` has no Variant, so it fades with its clock, and that is accepted.

Active -> AOD: not separately authorable in WFF (one Variant per attribute serves both directions), so the exit plays the same fractions against the device's exit transition, and the studio mirrors exactly that (180 ms, same order reversed). The v1 "light off first" exit choreography is deleted from the design system.

Real-time rotations (never perceptible, always running): sky disc 0.250684 deg/min anticlockwise; sun pointer 0.25 deg/min anticlockwise, drifting +0.9856 deg/day against the ecliptic ring (one sign per month); moon hour angle 0.2415 deg/min anticlockwise, +13.2 deg/day along the ecliptic, phase sprite swapped by the device's `[MOON_PHASE_TYPE]`; flanges, dragon, lighting never rotate. All astronomical expressions are quantised to the minute (`floor([SECONDS_IN_DAY]/60)*60`) so the 437 px sky blit and the sprites do not re-evaluate every second; only the seconds beads and the arc end take the per-second tick.

Each second (Active): seconds bead steps to `[SECOND]*6`, no sub-second animation; three ghost beads at fixed -6 / -12 / -18 deg; minute arc end = `[MINUTE]*6 + [SECOND]*0.1`. No blinking cursor, no twinkle, no loops.

Reduced motion: the studio honours `prefers-reduced-motion` (every duration 0). On the watch there is no OS signal and a `BooleanConfiguration` toggle would require duplicating every animated subtree; decision: not shipped. The design system states that reduced motion is studio-only and that the on-watch wake is a single sub-400 ms transition whose absolute length the device owns.

---

## 5. AOD

What remains, same positions, same silhouettes: ambient sky (stars m <= 3.0, ~128, 2 px dots without halos, `#8FA3B2` at alpha 128 = Y 8 %, still rotating 0.25 deg/min, Group scale .965), horizon hairline 1.2 px at .25, flange glint arc 240 -> 30 deg 2 px `#55605E` (Y 11 %) + 12 indices at 40 % + 4 solar marks at 40 %, sun pointer at 50 %, moon 1 px outline (altitude-gated), dragon dim fill `#5E7A52` (Y 16.9 %), digits `#11200F` fill + `#91AD80` 1.4 px outline (the minute glyphs change every minute, the hour glyphs every hour), colon `#6E8862`, date `#6E8862` at y174, `BAT 78%` 17 px `#6E8862` at baseline y304 (the value row), `INFINITY` 11 px tracking 2 `#6E8862` at y364. Hidden: dome_light (and with it the glow and the haze), flange body, dragon fill, seconds, minute arc, steps, gauges, prompt, digit shadow and ink edge.

Lit-pixel estimate (non-black over the 159,068 px disc), built on critic 2's raster of the v1 spec (13,705 px) and adjusted for v2: - 2,741 star halos + 650 star dots, - 1,170 dragon contour + 1,500 dragon dim fill, digit fill 5,117 and digit stroke 593 unchanged, horizon 737, glint + indices + marks ~1,750, date / BAT / INFINITY 1,303, pointer + moon ~310: about 11,960 px = 7.5 % (5.4 % without the `#11200F` fill, which is kept because it hides star cores inside the counters). Mean linear luminance ~1.4 % of full white. Under the 15 % limit; v4 was ~11 %.

Burn-in: nothing static above 22 % Y (colon, date, BAT, INFINITY at 21.8 %; dragon 16.9 %; glint 11 %; stars 8 %); the brightest items are the ones that change (digits) or move (stars, pointer, moon); the thin outline digits are 1.4 px. The v1 `[MINUTE]` pseudo-random walk is deleted: it moved HH:MM (a hard-constraint violation), it only visited five positions, and Wear OS applies its own ambient burn-in offset.

---

## 6. WFF v4 mapping

Target: `com.google.wear.watchface.format.version = 4` (Wear OS 6; the Galaxy Watch6 Classic has One UI 8 Watch). `<WatchFace width="480" height="480" clipShape="CIRCLE">`; the studio's XML generator multiplies every 450-space coordinate by 1.0667 and the bake pipeline renders every bitmap at 480 space, so no 1 px groove is resampled into a 2 px smear.

Shared expressions. WFF has no scene-level expression store (`Expressions` lives only inside `Condition`, consumed only by `Compare`), so the chain is written once in the studio's JS and emitted two ways: (a) v4 `Reference`: four invisible compute Groups (1 x 1, alpha 255, empty) each carrying one value in `angle` with a `<Reference name="..." source="angle" defaultValue="0"/>`, consumed as `[REFERENCE.lst]`, `[REFERENCE.thSun]`, `[REFERENCE.thMoon]`, `[REFERENCE.decMoon]`; (b) a fully inlined fallback (every Transform carries the whole chain, ~11 kB) if the on-device test shows an empty Group is "not available" and returns `defaultValue`. Both outputs are generated, never hand-edited, and run through the official validator and `memory-footprint`.

```
Dint   = 365*([YEAR]-2000) + floor(([YEAR]-1)/4) - 499 + [DAY_OF_YEAR] - 1
f      = (floor([SECONDS_IN_DAY]/60)*60 - 60*[TIMEZONE_OFFSET_MINUTES_DST])/86400 - 0.5
LST    = (280.46061837 + 0.98564736629*Dint + 360.98564736629*f + 126.978 + 36720) % 360
g      = (357.528 + 0.9856003*(Dint + f)) % 360
lam    = (280.460 + 0.9856474*(Dint + f) + 1.915*sin(rad(g)) + 0.020*sin(rad(2*g))) % 360
RAsun  = lam - 2.4657*sin(rad(2*lam)) + 0.0530*sin(rad(4*lam))
thSun  = (RAsun - LST + 720) % 360
lamM   = (218.316 + 13.176396*Dint + 13.176396*f
          + 6.289*sin(rad(134.963 + 13.064993*Dint + 13.064993*f)) + 720) % 360
RAm    = lamM - 2.4657*sin(rad(2*lamM)) + 0.0530*sin(rad(4*lamM))
decM   = deg(asin(0.39777*sin(rad(lamM))))
thM    = (RAm - LST + 720) % 360
rM     = 1.633*(90 - decM)
altM   = 0.6097*sin(rad(decM)) + 0.7927*cos(rad(decM))*cos(rad(thM))     // sin(altitude), Seoul
```

Why this form: `Dint` and `f` are kept apart so that in float32 the day fraction keeps 1 s resolution instead of 84 s (LST steps of 0.35 deg); every product stays under 1.3e5 (float32 ulp <= 0.008 deg); `%` is Java remainder (sign of the dividend), so the dividends are kept positive with `+36720` / `+720` for every year the device can report (1902-2100); trig takes radians (`rad()` wraps every argument); `[TIMEZONE_OFFSET_MINUTES_DST]` is WFF v3+. The moon is the mean longitude plus the equation of centre, which is what v1's `age`-based formula was not: at the preview instant it gives lambda 15.98 deg against a true 16.5 deg (v1's formula gave 12.2). Never use `[UTC_TIMESTAMP]` in float arithmetic.

Check (2026-10-25 01:08 UTC = 10:08 KST): Dint 9794, f -0.45278, LST 177.42, lam 211.63, RAsun 209.47, decSun -12.04, thSun 32.05 (pointer at (331,56); solar noon 12:16 KST), lamM 15.98, decM 6.29, thM 197.30, moon at (184,356), altM -0.686 (below the horizon, alpha 0). Negative-f case 2026-01-01 00:30 KST: Dint 9497, f -0.854, LST 99.79: correct across the local year boundary.

| Layer | WFF construction |
|---|---|
| z0 void | `<Scene backgroundColor="#ff000000">` |
| compute | 4 `Group`s 1x1 alpha 255, each `<Transform target="angle" value="<LST | thSun | thM | decM>"/>` + `<Reference name=".." source="angle" defaultValue="0"/>` |
| z1 sky | `Group x=20 y=20 w=410 h=410 pivotX=.5 pivotY=.5` with `<Transform target="angle" value="(360 - [REFERENCE.lst] + 720) % 360"/>`; inside `PartImage sky_active.png` (`Variant AMBIENT alpha 0`, startOffset 0, duration .39) and `PartImage sky_ambient.png` 392 x 392 centred, `tintColor="#8FA3B2"`, `alpha 0` + `Variant AMBIENT alpha 128`; `Variant AMBIENT scaleX/scaleY .965` on the Group |
| z2 moon | `Group` 450 x 450 pivot .5/.5, `Transform angle = [REFERENCE.thMoon]`; inner `Group x=208 y=0 w=34 h=34` with `Transform y = 225 - 1.633*(90 - [REFERENCE.decMoon]) - 17` and `Transform alpha = clamp(255*6*(0.6097*sin(rad(decM)) + 0.7927*cos(rad(decM))*cos(rad(thM))), 0, 255)`; inside, one `Condition` on `[MOON_PHASE_TYPE]` with 8 `Compare` branches each holding one `PartImage` 34 x 34 at (0,0) with constant `angle` (-90 waxing, +90 waning, 0 new/full) and a `Variant AMBIENT alpha 0`; `moon_ambient.png` beside it with `alpha 0` + `Variant AMBIENT alpha 255`. If Group `y` rejects a float expression on device, the fallback is `pivotY` on the inner Group (same single-copy maths) |
| z3 sun pointer | `Group` 450 x 450 pivot .5/.5, `Transform angle = [REFERENCE.thSun]`; `PartImage sun_pointer.png` 16 x 16 at (217,17.5); `Variant AMBIENT alpha 128` |
| z4 dome_light | `PartImage dome_light.png` 410 x 410 at (20,20), `Variant AMBIENT alpha 0` (startOffset .11, duration .44) |
| z5 flange | `PartImage flange_active.png` 450 x 450 with `Variant AMBIENT alpha 0` and `Variant AMBIENT angle -6 angleDirection CLOCKWISE`; `PartImage flange_ambient.png` (RGBA, hairline and glint baked in their own colours) `alpha 0` + `Variant AMBIENT alpha 255` |
| z6 minute arc | `Group` pivot .5/.5 with `Variant AMBIENT angle -14 angleDirection CLOCKWISE` and `Variant AMBIENT alpha 0` > `PartDraw` > `Arc centerX=225 centerY=225 width=416 height=416 startAngle=0 endAngle=0` + `<Transform target="endAngle" value="[MINUTE]*6 + [SECOND]*0.1"/>`, `Stroke #ccA6F46A thickness 1.6 cap BUTT` |
| z6 seconds | 4 `Group`s pivot .5/.5, `Transform angle = [SECOND]*6 - k*6` (k = 0..3), each an `Ellipse` 6.6 px at (221.7,13.7); alphas 255/128/72/31; `Variant AMBIENT alpha 0` |
| z7 dragon | `PartImage dragon_active.png` 190 x 133 at (130,19), `Variant AMBIENT alpha 0` (startOffset .33, duration .56); `PartImage dragon_mask.png` same box, `tintColor="#5E7A52"`, `alpha 0` + `Variant AMBIENT alpha 255` |
| z8 digits | Active `Group` (`Variant AMBIENT alpha 0`, startOffset .39, duration .50): `DigitalClock x=119 w=94` > `TimeText format="hh" hourFormat="24" align="CENTER"` > `Font family="roboto_mono_semibold" size="78" weight="SEMI_BOLD" color="#ffEFF8EC"` > `Shadow #99000000 offsetX 2 offsetY 3 radius 4` + `Outline #80000000 width 1.0`; `DigitalClock x=237 w=94` > `TimeText format="mm"`; sibling `PartText` colon at x225 `#ffA6F46A`. Ambient `Group` (`alpha 0` + `Variant AMBIENT alpha 255`): the same two clocks with `Font color="#ff11200F"` > `Outline #ff91AD80 width 1.4`, colon `#ff6E8862` |
| z9 text | `PartText` + `Template` for date (`[DAY_Z] [MONTH_S] / [DAY_OF_WEEK_S]` uppercased in string resources), values (`[BATTERY_PERCENT]%`, `numberFormat("#,###", [STEP_COUNT])`); gauges `PartDraw Rectangle` with `Transform width = 64*[BATTERY_PERCENT]/100` and `64*clamp([STEP_COUNT],0,10000)/10000`; battery colour `<Transform target="color" value="[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(239,248,236)"/>` on the Font and the gauge Fill (Font/Fill colour transformable from v4); AOD `BAT %` and `INFINITY` as separate `PartText`s with `alpha 0` + `Variant AMBIENT alpha 255` |

Order for the ambient memory evaluator: only `DigitalClock`, `AnalogClock` and `ComplicationSlot` split layers, so every static element (the rotating sky included) is declared before the two ambient clocks and nothing after them: one 480 x 480 x 4 layer = 0.92 MB.

Memory with the evaluator's actual rules (4 B/px after crop-and-resize, halved only if the image quantises losslessly to RGB565; there is no ALPHA_8 path, so v1's 1 B/px claims are withdrawn):

| Asset | Device px | Bytes |
|---|---|---|
| sky_active (disc + trench floor) | 437 x 437 RGBA | 764 KB |
| sky_ambient | 418 x 418 RGBA | 699 KB |
| dome_light (incl. trench AO, haze, glow) | 437 x 437 RGBA | 764 KB |
| flange_active / flange_ambient | 480 x 480 each (annulus bbox is the full disc) | 922 KB + 922 KB |
| dragon_active / dragon_mask | 203 x 142 each | 115 KB + 115 KB |
| moon x5 + moon_ambient | 36 x 36 | 31 KB |
| sun_pointer | 17 x 17 | 1 KB |
| roboto_mono_semibold.ttf (bundled static weight) | | ~0.1-0.3 MB |
| **Interactive total** | | **~4.5 MB** (limit 100 MB) |
| **Ambient** = 0.92 MB x 1 layer + largest dynamic sprite | | **~0.93 MB** (limit 10 MB) |

Bake list: static PNG = `sky_active`, `sky_ambient`, `dome_light`, `flange_active`, `flange_ambient`, `dragon_active`, `dragon_mask`, `sun_pointer`, `moon_new/crescent/quarter/gibbous/full`, `moon_ambient`. Vector = minute arc, seconds beads, gauges, divider, all text, digits. Blend: source-over only (blendMode is version-gated and unnecessary).

Build rules for the design system: (1) the studio renders from the bake outputs, not from live SVG filters, so the preview is the same image as the watch; (2) one astronomy module emits the preview numbers and the XML expression strings; (3) sign-off preview at exactly 480 px with no DPR upscale; (4) a debug `PartText` with `numberFormat("#.###", <LST>)` is compiled into a test build and compared with the studio at three dates (error must stay < 0.5 deg), together with a check that `%` on a negative float keeps the dividend's sign; (5) the glyph weight of Roboto Mono SemiBold is signed off on the device, not in the browser.

---

## 7. Risks

1. Exposure on the real panel is still the project's deciding test. The dome now spans L* 3-51 with every plane boundary >= 3x in luminance, but AMOLED black crush, panel gamma and daylight reflection (~30 nits of glare on a 500-nit panel) are not in the model. Verify at 3 brightness levels in daylight before any other polish; keep a second `dome_light` bake at 1.3x alpha behind a `ListConfiguration` "Lighting: soft / strong" only if the test demands it.
2. Rotation resampling: a bilinear-rotated 437 px bitmap smears 1 px stars; mitigated by 1.4 px minimum cores and 2 px AOD dots; an optional 1.5x source (656 px, counted at <= screen size by the evaluator) is a device test because the runtime's sampling is undocumented.
3. Expression precision is undocumented (float vs double). The split `Dint` / `f` form keeps the worst case at 0.008 deg; verified by the debug PartText plan above.
4. `Reference` on an empty compute Group: the doc says `defaultValue` is used while the parent is "not available"; whether a 1 x 1 empty Group at alpha 255 counts as available is undocumented, hence the generated inline fallback.
5. Group `x` / `y` are integer-typed; the moon's radius transform may be truncated to whole pixels (harmless) or rejected (then use `pivotY`); verify once.
6. The Watch6 Classic bezel may cover the outer 2-3 % of the panel: unverified either way. Depth-critical cues sit at r <= 217 and the indices at r213-219.
7. Readability worst case: the autumn-evening Cygnus / Cassiopeia region under the digits (night preview puts Deneb at (203,155), 40 px above the glyphs). The `Outline` + `Shadow` and the r120 cap are the defence; check on device with that sky.
8. Latitude: horizon haze and altitude gates assume Seoul; another latitude needs a re-baked `dome_light` and new constants (ship three latitude-band overlays if the face is ever shared).
9. Moon: ~1 deg longitude error from the mean-longitude formula, ecliptic latitude (+/- 5.1 deg = +/- 8 px) ignored, phase orientation a tangential approximation (<= 30 deg), 8-step phase sprites. Fine for 26 px; stated honestly in the docs.
10. Variant timing is a fraction of a device-owned transition; the wake keeps its order and proportions, not its absolute 360 ms; the exit is the mirrored wake.
11. Dragon over moon: for a few minutes on high-declination days the phosphor dragon sits on the bone moon at ~1.2:1; the 1.2 px contact edge keeps the silhouette; accepted.
12. The minute arc and seconds bead must sit exactly on the engraved tick radius r208; 2 px off and they float as flat vector over textured metal, which is the one place v4's flatness could creep back.
13. Sub-threshold texture (constellation lines 0.8 px, trench dots, 2 px flecks, 1 px ecliptic dash) is texture by design and must not be described as information anywhere in the design system.

---

## 8. Why it is not flat (with the numbers this time)

v4 was one black plane with a seconds ring, a planet sticker and the dragon, lit by nothing. v1 of this proposal described five planes and then exposed them between Y 0.15 % and 1.3 %, which is three blacks. v2 is a physical instrument lit by one light at visible exposure: the dome runs from L* 51 at the hot-spot to L* 3 on the far rim, the trench walls at Y 0.2 % flank a floor at 0.9 % and a flange at 2.5-5.5 %, the bevel catches the key light at Y 30 % on the 10:30 side and drops to 0.5 % on the 4:30 side, and every one of those boundaries is at least a 3x luminance step, so the eye receives five depth cues that agree: occlusion (the sun pointer's halo is shaded by both trench walls and clipped by the flange; the moon's dark side occludes stars; the moon and the stars sink under a real horizon), shading (glaze, hot-spot, directional terminator and Fresnel rim on the dome; two opposing lobes on brushed metal; a blurred shadow and an ink edge under the glass-printed digits), a shaded sphere (the moon, which reads as 3D at any brightness and is the only object on the face that is a volume), motion parallax on wake (the sky rises 3.5 % and the flange settles 6 deg while the digits stay nailed to the glass), and differential real motion (sky, pointer and moon each move at their own true rate against rings that never move; the phosphor graticule turning past the static ticks is the proof you can see within an hour). The stack is also true: Polaris is under the colon, the pointer points at solar noon at 12:16 KST, the last-quarter moon of 2 November hangs in the west lune at ten in the morning with its bright side toward the sun, and at 20:08 on 25 October the Summer Triangle is upper left while Sirius is still below the rim. It reads KALI at a glance (official dragon, phosphor, Roboto Mono, INFINITY, a PPI graticule) and Galaxia at the second glance (stacked rings, a real sky, a gold sun pointer, one bright body travelling), and nothing on it is a JLC inventory item that the panel cannot show.

---

## 9. Change log vs v1

1. Exposure re-done from scratch: grisaille ground one stop up (`#222B36` / `#1D2631` / `#151C24`), glaze .11 -> .20 with a new r24 hot-spot at .22, terminator rebuilt as a directional linear term (.62 at the SE rim, 0 on the lit half) instead of a radial gradient that darkened the NW rim, Fresnel .04+.12 -> .05+.17, flange bodies `#1A1F22` -> `#262D31`..`#3A4449` / `#2B3338`..`#454F55` with visible circular brushing and a second lobe, bevel highlight .5 -> .70 of a lighter `#AEBBB9`, tick lit edge 0.6 px -> 1 px, trench AO .72 -> .78, floor flecks 1 px -> 2 px. Measured plane-boundary ratios all >= 3x.
2. Hero changed from "sun bead in the trench" to a 26 px shaded moon on the sky plane with 5 phase sprites, lit limb oriented toward the sun, altitude-gated alpha; the sun bead becomes the Galaxia sun pointer (16 px) and the true-sun sky sprite is deleted (one sun).
3. Dragon: back to the v4 frame (x135 y24 180 x 123), flat phosphor fill, 1.2 px contact edge, underglow in `dome_light`; relief gradient, rim-light / shade masks and cast shadow deleted. AOD dragon is a dim fill (`#5E7A52`) instead of a contour.
4. Central well deleted; digit shadow becomes a native `Shadow` (2,3, radius 4) plus a 1 px `Outline` ink edge on the Active clocks; AOD digits use `Outline`, no `BitmapFont`.
5. Composition: BATTERY / STEPS labels removed, values up to y304, gauges y314, prompt y364; clear sky >= 68 % by box (v1 28 %); haze .45 -> .32; star cap inside r120 .6 -> .75 with 1.8 px core cap; Milky Way inside r110 .5 -> .8; stars to m 3.5 (~220) instead of m 4.0.
6. Sky bake: constellation names, zodiac glyphs and disc aventurine flecks removed; phosphor graticule (dec rings r49/98/147/196, RA spokes every 2 h) added; ecliptic and horizon are the exact curves (v1's circle shortcuts deleted); trench floor painted into the sky bitmap (bed PNG deleted).
7. Trench: 4 solar marks at 12 / 3 / 6 / 9 so the pointer has a scale; indices moved from r219-224 to r213-219.
8. AOD: `[MINUTE]` burn-in walk deleted; colon, date, BAT, INFINITY set to `#6E8862` (21.8 % Y) so the static cap is honest; lit-pixel estimate corrected to ~7.5 % (counting the glyph fill); moon outline altitude-gated.
9. Motion: `angleDirection="CLOCKWISE"` on the two rotating Variants; digit-shadow row removed; exit choreography replaced by the mirrored wake; reduced-motion toggle not shipped (studio-only); astronomy quantised to the minute.
10. WFF: Scene `<Expressions>` replaced by v4 `Reference` compute Groups plus a generated inline fallback; `TimeText format="hh"`; colon as sibling `PartText`; two DigitalClocks; moon and sun maths written once on positioning Groups; split `Dint` / `f` LST; mean-longitude moon; `+36720` guards; `Font`/`Fill` colour Transforms for the battery warning; authored at 480; memory recomputed with the evaluator's rules (~4.5 MB / ~0.93 MB); static layers before the clocks.
11. Preview states: day 2026-11-02 10:08:24 KST (moon up, last quarter, west lune) and night 2026-10-25 20:08:24 KST (moon in the east lune, pointer at 8 o'clock), both computed from the section 6 expressions; the 2026-10-25 10:08:24 state stays as the moon-below-horizon case.

---

## 10. Rebuttals

| Critic claim | Verdict | Reason |
|---|---|---|
| C1/C2/C3: the dome, flange and trench are exposed below the visibility floor (Y 0.15-1.3 %); the face is still "stars plus rings" | Accepted | Their luminance tables are correct. v2 re-exposes every plane (section 1.2 table, section 1.4 ratios) and adopts C1's >= 3x boundary rule as a build rule. |
| C1: hero plane 72-79 % covered, only 21 % clear sky | Accepted in substance, rejected in method | The well, the labels and the shadow margin were real covers and are gone; the haze was counted as a cover but is a .32 dimming. Re-count by the same box method: >= 68 % clear. |
| C1: two suns on one radial is a logic bug | Accepted | One sun. v2 keeps the trench pointer and deletes the sky sprite, which is the reverse of C1's preference, because the Galaxia reading is the edge pointer, a sky-plane sun is under the horizon for half of every day (no solar reading at night), the rim never collides with text, and the trench pointer is the occlusion cue C3 asked to keep. The month reading is identical: the pointer's radial meets the ecliptic ring at the sun's longitude. |
| C1: one hero, and it must be a sphere (the moon) | Accepted | Section 1.3. The sun is demoted to pointer, the one-sentence idea is one sentence. |
| C1: the dragon relief destroys the ~2 px line-art and shrinks the logomark 20 % | Accepted | Flat fill at the v4 size; depth comes from an underglow and a 1.2 px contact edge, which is the only edge treatment a 2 px stroke can carry. |
| C1 fix 5: sunken hour slab (rounded rect recess) behind the digits | Rejected | A rounded rectangle behind the glyphs is the sticker look v4 was rejected for, and it contradicts the glass-print plane. The well is deleted as asked; legibility is carried by `Outline` + `Shadow` on a ground where a shadow is visible. |
| C1 fix 7: the 24 h plane has no scale | Accepted in part | Four 2 px marks at 12 / 3 / 6 / 9 (noon / dawn / midnight / dusk). Numerals do not fit a 7 px trench; the pointer is described as an unlabelled 24 h hand. |
| C1 fix 10: indices under the bezel | Accepted | Moved to r213-219; bezel overlap stays a device test. |
| C1 fix 11: drop zodiac glyphs, names, flecks; add a phosphor graticule | Accepted | Section 1.1 items 3, 5, 7. Trench flecks survive (2 px, in the trench floor only) because they are the only thing that shows the trench has a floor. |
| C1: JLC pastiche inventory | Accepted in part | Names, glyphs, disc flecks and the "Cosmotourbillon analogue" wording are gone; stacked flanges, a real sky, a sun pointer and one travelling body are the instrument the user asked for, not ornament, and stay. |
| C1/C2: burn-in walk moves HH:MM, is a 5-position loop, is redundant with the system offset | Accepted | Deleted. |
| C1/C2/C3: Scene-level `<Expressions>` does not exist | Accepted | v4 `Reference` compute Groups (verified: `name`, `source`, `defaultValue`, `[REFERENCE.name]`) plus a generated inline fallback. |
| C1/C2/C3: `TimeText format="HH"` invalid; `PartText` is not a DigitalClock child | Accepted | `format="hh" hourFormat="24"`, `format="mm"`, colon as sibling PartText, two clocks. |
| C1: horizon circle "within 2 px" is false (21 px at the rim) | Accepted | Sentence deleted; the exact curve (rim crossing at +/-63.6 deg) is specified and baked. C2's ecliptic-circle finding (5.3 px) likewise: exact curve. |
| C1/C3: moon formula gives 12.2 deg, not the 17 deg printed | Accepted | C3's mean-longitude form adopted (15.98 deg at the instant, true 16.5); the studio renders from the same formula. |
| C1/C2/C3: star counts low by ~2x | Accepted | ~385 to m 4.0; Active trimmed to m 3.5 (~220), AOD m 3.0 (~128). |
| C2 F1: raise the ground to L* 22-30 on the lit side, glaze .22, hot-spot .35, terminator .60, well .50, dither | Accepted except the well | Ground + glaze gives L* 31 under the hour digits and L* 35 at the glaze peak; hot-spot .22 (not .35: .35 would put the hot-spot at Y 26 % and drop paper contrast to 3:1 if it ever touched text); dither baked; the well is deleted rather than raised because `Outline` + `Shadow` do its job without covering 16 % of the sky. |
| C2 R1 / C3: bake at device resolution | Accepted | 480-space bakes, XML authored at 480. |
| C2 R3: split the day fraction out of D; quantise to the minute | Accepted | Section 6. |
| C2 R4: static AOD cap honestly applied; count the glyph fill | Accepted | `#6E8862` for colon / date / BAT / INFINITY; estimate restated as 7.5 % / 5.4 %. |
| C2 R5: sun bead under dome_light | Accepted | z3 under z4; the AO shades the halo on both walls. |
| C2 R6: four black TimeText copies at +/-1 px as a surround | Accepted in intent, different mechanism | `Outline width 1.0 #80000000` does the same job natively; `Shadow radius 4` replaces the hard offset. |
| C2 R8: BitmapFont crossfade misalignment | Moot | No BitmapFont; the AOD digits are the same TimeText with an `Outline`. |
| C2 R10 / C3 R6: `angleDirection`, sums <= 1.0 | Accepted | Both rotating Variants carry `angleDirection="CLOCKWISE"`; every pair in section 4 sums to <= 1.0. |
| C2: 9 px zodiac glyphs are not a reading | Accepted | Glyphs removed; the month is read as "the sign under the pointer", which is a noticing, not a reading. |
| C3 F4: ALPHA_8 is not what the evaluator does | Accepted | Memory recomputed at 4 B/px: ~4.5 MB interactive, ~0.93 MB ambient. Tinted PNGs stay (tintColor works regardless). |
| C3 R4: native `Shadow` / `Outline` / `OutGlow`; "no blur available" was false | Accepted | Verified on the reference pages; v1's claim is withdrawn. |
| C3 R8: fold the bed into the flange PNG | Accepted with a different home | The floor must be under the sun pointer and the flange is above it, so the floor is painted into the sky bitmap (r194-205) instead; the bed PNG is deleted either way. |
| C3 R9: vectorise `dome_light` with WFF gradients | Rejected for now | Un-dithered gradients band exactly in the L* 3-20 range where the terminator lives; a dithered bake costs 0.76 MB of a 100 MB budget. The vector set is documented as the fallback if the device test shows the bake's own banding. |
| C3 R10: exit choreography is not authorable | Accepted | Mirrored wake fractions; the v1 exit sequence is deleted. |
| C3 R11: reduced motion is not free | Accepted | Not shipped on the watch; studio-only, stated as such. |
| C3 R13: one copy of the moon / sun maths on positioning Groups | Accepted | Section 1.3 placement; the moon's phase rotation becomes a constant per branch as a bonus. |
| C3 R16: only clocks split ambient layers; put every static element first | Accepted | v1's "sprites at the end" advice is withdrawn. |
| C3 R12 / C2: precision verification plan | Accepted | Debug PartText at three dates, `%` sign check, no `[UTC_TIMESTAMP]`. |
| C3 R14 / R15: bundle the SemiBold TTF; colour Transforms instead of duplicated subtrees | Accepted | Section 6. |
| C3: the sun pointer in the trench, the baked one-light discipline, the wake order, the r208 rule, the AOD plan | Kept | Unchanged in v2 except where the fixes above touch them. |
