# KALIWATCH v5 "Celestial Vault": proposal v2 (WFF-feasibility lens)

Author lens: Watch Face Format v4 engineer. Date 2026-10-26. Design space 450 x 450, centre C = (225,225), dial radius 225. Target Galaxy Watch6 Classic SM-R965N, 480 x 480 round, Wear OS 6, `format.version=4`. Angles follow WFF: degrees clockwise, 0 = 12 o'clock.

How the claims were checked:
- **Schema facts** come from the v4 XSDs in `google/watchface/third_party/wff/specification/documents/4`. A local copy is in `scratchpad\wfref\xsd`, and `watchface.xsd` was fetched on 2026-10-26.
- **Memory facts** come from the `memory-footprint` sources in `scratchpad\wfref\mem`.
- **Numbers** were recomputed by scripts in `C:\Users\k\AppData\Local\Temp\claude\C--Users-k-Documents-ChatGPT-------KALIWATCH--claude-worktrees-aod-dragon-watchface-personalization-000e96\5441be5b-8cd1-47aa-a6c9-28637c7aeb8f\scratchpad\calc\wffv2\`:
  - `geom.py` and `geom2.py`: sky area and occlusion.
  - `astro_check.cjs`: the WFF expressions compared with the studio's Meeus engine `studio/astro.js`.
  - `moon_vis.cjs`: moon visibility.
  - `lum2.py`: luminance.
  - `mock.py`: a raster mock that produced `mock_active_2008.png`, `mock_active_1008.png` and `mock_aod_*.png`, and the AOD lit-pixel figures.

Anything not settled by a schema or a script is marked **ASSUMPTION** and has a device test in section 12.

---

## 0. What v1 got wrong, and the v2 concept

The three critics agreed that v1's architecture was right: separate planes, each driven by a different clock. They also agreed its skin was wrong. They were right about five things:

1. Every surface that was meant to catch a shadow sat between 0 and 2 % luminance, so no occlusion cue could be seen.
2. Only about 23 % of the dial was sky, in slivers, and the circumpolar cap was under the plate.
3. The "ground" was v4's black bottom under a new name, and it hid 38 % of the aperture.
4. The bright orbiting object was below the horizon for about 16 h a day.
5. The XML had three schema errors: decorations inside `TimeText`, `Compare value=`, and `Variant` on shapes.

While re-reading the XSDs I found three more mistakes in v1:

- Fractional `x`/`y` on Parts. They are `xs:integer`.
- Reduced motion written as a `Condition` instead of a Scene `BooleanConfiguration`.
- A sidereal clock tied to local time, which breaks across leap years, DST and travel.

All eight are fixed below.

**Concept v2.** The real Seoul sky turns about a pole that sits under the arch of the official Kali dragon. The time floats on smoked glass directly under the Seoul zenith. A lit two-step flange frames the sky, and the edge of that frame is the real horizon. In the black lacquer trench between them, a phosphor probe pulls the seconds trail around the dial while the gold sun moves around the 24-hour ring.

The one memorable thing is the sky turning under the dragon, with the probe pulling the seconds. Everything else is either information (time, date, battery, steps) or a Galaxia-style ring that carries its own clock.

---

## 1. The chart: one geometric decision that fixes the sky, the ground and the pole

| Item | Value | Source |
|---|---|---|
| Projection | north-polar **stereographic**, r(δ) = 128 · tan((90° − δ)/2) px from the pole | design |
| Pole P | **(225,114)**. Polaris is 0.8 px from P. | `geom2.py` |
| Orientation | Looking-up planisphere: north up, east LEFT, west RIGHT, south at the bottom. The chart turns counter-clockwise about P once per 23 h 56 m 04 s. A star at RA α is painted at clock angle 180° + α about P when LST = 0. | design |
| Seoul horizon (37.5665 N) | Stereographic projection maps the horizon circle to an **exact circle**: centre (225, 114 + 1.2999k) = **(225,280.4)**, radius 1.640k = **209.9**. Checked against true altitude: **0 sign mismatches** in 8,760 hourly moon positions in 2026. | `moon_vis.cjs` |
| Sky aperture | r < 182 about C. The aperture lies inside the horizon circle everywhere except a **4.6 % crescent** at the top: y 43 to 70.5 on the centre line, tapering to zero at (57.5,153.9) and (392.5,153.9). **The dome lip is the horizon** along the lower three quarters of the window. | `geom2.py` |
| North point / zenith | North point (225,70.5), under the dragon's wings. Zenith **(225,177)**, under the date line, so the time sits on the zenith. | |
| Circumpolar cap | r 43.5 px, y 70.5 to 157.5. **0 px under the plate**, and 89.6 % of it is clear of the dragon's engraving bed (615 of 5,924 px are under it). | `geom.py` |
| Southern reach | At culmination the bottom edge of the aperture shows δ −42.8. Antares (r 206.6) and Fomalhaut (r 220) both pass inside the window. | |
| Scale | 0.99 px/deg at the pole (Dubhe to Alkaid is 31 px), 2.23 px/deg at δ 0 (Betelgeuse to Rigel is 42 px), 6.3 px/deg at δ −40. This is the normal planisphere look. | |
| Sky bitmap | Must cover radius 293 px, from P to the far edge of the aperture. That is **586 x 586** at x −68, y −179, pivot 0.5/0.5. | |

**Sky area, measured.** These are fractions of the 159,068 px dial, from `geom2.py`. Open sky is inside r 182 and above the horizon, and not under the plate, its feather, the registers or the dragon bed.

- **37.3 % unobstructed**: 38.2 % if the dragon's openwork counts as sky, 40.8 % with the registers' 40 % transmission, and 43.2 % with the plate's 15 % transmission.
- v1 actually had about 23 %, which is critic 1's figure. My v1 claim of 36 % was measured before anything occluded it.
- The rest of the dial is the lit frame (34.6 %, deliberately), the glass instruments (20 %) and the north ground (4.6 %).

---

## 2. Layer stack (back to front; XML document order)

The depth is a fiction carried by the shading. There is one key light from 315° (upper left) at 35° elevation, and every bake obeys it. Plane heights:

| Height | Planes |
|---|---|
| −3 | trench floor |
| −2 | north ground |
| −1 | vault (rising to the dome lip) |
| +1 | F1, the 24 h ring |
| +2 | F2, the minute flange |
| +3 | glass: plate and registers |
| +4 | dragon |

These form three groups that read as separate: **vault** (−3 to −1), **flange** (+1, +2), and **glass + dragon** (+3, +4).

| z | Layer (WFF element) | Shows | Clock | Geometry (450 space) | Material / values | Active | AOD |
|---|---|---|---|---|---|---|---|
| 0 | Scene background | black | none | full | `#000000` | on | on |
| 1 | **sky** `Group` 586 box, pivot at P; `PartImage sky_active` | Real Seoul sky: stars to mag 4.5 (366-star studio catalogue), 33 constellation figures, Milky Way brushwork | **sidereal**: angle = (360 − LST) mod 360 | x −68, y −179, 586 x 586 | Grisaille on `#141C24` ground. Milky Way core `#9AA8AE` up to 85 % (Y 37.9 %), mid `#56646C`, wisps `#2E3A42`. Stars: mag ≤ 1.0 `#E4ECEE` with 1 px bloom at 40 %; ≤ 3.0 `#B9C5CA` r 1.2; ≤ 4.5 `#7C888E` r 0.9. Lines 1.2 px `#5A6A72` at 70 %. | fades in first on wake | `PartDraw sky_aod` in the same group: about 70 vector dots, mag ≤ 2.5, 1.6 px, `#5A6870`. **0 bitmap bytes.** |
| 2 | **moon** `Group` 22 x 22 with x/y Transforms; `Condition` of 8 phase sprites | Moon at its computed chart position and phase | **lunar** (section 8, E11 to E16) | 22 px | Grisaille sphere sprite with a painted terminator, `#D8DFE2` lit, `#1A2328` dark | on | 1 px ring r 5, `#6B7A80` (same Group) |
| 3 | **dome light** `PartImage` 364 x 364 at (43,43) | The fixed light on the vault: NW glaze, SE fall-off, and the phosphor **pole reticle** (a 7 px, 1 px-wide cross at P, the terminal cursor on Polaris) | none (observer-fixed) | inside r 182 | White 12 % peak at (150,150), σ 95, giving `#2B3742` (Y 3.6 %) at the peak. Black up to 55 % beyond r 130 on the SE half. Reticle `#A6F46A` at 80 %. | on | off |
| 4 | **day key** `Group` (ambient Variant) > `PartDraw veil` | Daylight: the whole vault turns from black enamel to blue-grey enamel as the real sun rises | **solar altitude**: alpha = clamp((h + 12)/18, 0, 1) · 107 | Ellipse r 182 | `#2E4A5A`, SRC_OVER, at most 42 %. Sky mean goes from Y 1.1 % to 2.6 %, Milky Way core from 37.9 % to 20.8 %, bright star from 82.7 % to 37.8 %. | on | off |
| 5 | **north ground** `PartDraw` | Below the northern horizon. Stars dip under it at lower culmination. | none | stroked Ellipse, centre (225,280.4), covers r 209.9 to 240 | `#050607` opaque, plus a 1.2 px horizon hairline `#8FA3AA` at 35 % (separate PartDraw, Active only) | on | on (black, 0 lit px) |
| 6 | **dome lip** `PartDraw` | The raised rim of the vault, which is also the horizon | none | r 182 to 185 | SweepGradient NW `#A9B8BE` (Y 46 %) to SE `#1C252A` (1.7 %) | on | 1 px r 183.5, `#2C3A33` |
| 7 | **trench** `PartDraw` + **probe** `Group` (450, pivot C) | Black lacquer floor. Twelve zodiac-boundary ticks. The **probe** marks the First Point of Aries (RA 0h). | **sidereal** about C: angle = (180 − LST) mod 360 | floor r 185 to 196. Ticks r 187 to 193, 1 px, at RA offsets 0, 27.91, 57.82, 90, 122.18, 152.09, 180, 207.91, 237.82, 270, 302.18, 332.09°. Probe at r 190.5. | Floor `#030405`. Ticks `#3A464C`. Probe core r 2.5 `#E2FFC4` / `#A6F46A`, glow RadialGradient r 6 at 75 % to 0. | on | core r 2, `#5E7A55` (same Group) |
| 8 | **F1 24 h ring** `PartDraw` + **sun** `Group` (450, pivot C) | Apparent solar time: the 00 tick at the top, 12 at the bottom, sunrise on the left, sunset on the right. The sun pointer sits between the zodiac ticks, so it reads the sign as the Galaxia's does. | **apparent solar day** (true-sun RA, so the equation of time is included) | step r 196 to 198. Ring r 198 to 209. Sun at r 203.5. | Step: SweepGradient lit SE `#8E9AA0` (31 %), dark NW `#0B0E10`. Ring: black lacquer `#08090A` with 24 transferred ticks `#C8D1D5`, 1 x 4 px (2 x 7 px at 00/06/12/18). Sun disc r 4.5 `#E8B65A` with a `#FFE2A0` highlight and a glow (σ 4) at 60 %. | on | sun dot r 3, `#8A6A2C` (same Group); 12 ticks r 200 to 208, 1.25 px, `#4D633F` |
| 9 | **F2 minute flange** `Group f2` (wake rotation) | Brushed opaline ring with 60 engraved ticks, 11 applied phosphor-metal indices, the inscription `kali@vault:~$ INFINITY` along the bottom, and the minute pointer | **minutes** | step r 209 to 211. Ring r 211 to 225 (`flange_f2.png`, 450). Inscription on a 38.1° arc centred at 180° (r ≈ 218.5, 11 px). Pointer r 212.5 to 221. | Step: lit SE `#B5C0C5` (52 %), dark NW `#0E1215`. Face: radial hairline texture, sweep NW `#7E8B91` (Y 25 %) to SE `#2E363A` (3.5 %). Ticks engraved `#1A2024`. Indices: phosphor metal `#D2FFA4` / `#A6F46A` / `#4E7F34`, 2.4 x 8 px. Prompt `#B9C5CA`, INFINITY `#A6F46A`. Pointer: phosphor-metal triangle 7 x 8.5 px. | on; group at −14° in AOD, aligns to 0° on wake | `INFINITY` TextCircular at r 204, 11 px, `#7F9472`, letter spacing 0.18 |
| 10 | **plate** `PartImage` | Smoked-glass slab for the civil time | none | RoundRectangle **x 113 to 337, y 168 to 268, corner 18** (224 x 100). PNG 240 x 116 includes the shadow margin. | 85 % black core. 1.5 px bevel `#95A3A9` at 85 %, lit NW and fading to 0 on the SE. 1 px black bottom/right lip. Shadow (+3,+4), blur 3, 75 %. | on; scale 0.975 to 1.0 on wake | black RoundRect footprint (hides AOD stars) |
| 11 | **date line** `PartText` x2 | `25 OCT / SUN / SCO`: civil date plus the sun's zodiac sign | day / tropical year | 15 px monospace, 9 px advance, x 144 to 306, baseline 186 | Date `#9BAB9C`. Sign `#D9A441` at 80 % (the only gold text: it belongs to the sun). | on | `25 OCT / SUN` in `#7F9472` |
| 12 | **registers** `Group` x2 (one PNG used twice) | BAT and STP sub-dials: eccentric glass lenses floating over the moving sky | battery / steps | discs r 40 at **(146,320)** and **(304,320)**. Outer extent r 163.6 from C. Gap to the plate 12 px. | 60 % black glass. Rim r 38.5 to 40, lit NW `#95A3A9`, SE black. Shadow (+3,+4), blur 3, 70 %. Gauge track r 34.5, 1.8 px, `#17291D`. Arc `#A6F46A` (`#F3C479` at ≤ 15 %). Label 11 px `#9BAB9C` at baseline 313. Value 19 px `#EFF8EC` at baseline 333. | on; scale 0.97 to 1.0 | left: rim 1 px `#2C3A33` plus `78%` 17 px `#7F9472`. Right: hidden. Black footprints. |
| 13 | **dragon** `PartImage` | Official Kali dragon, path unchanged, mounted over the rim like the JLC Dragon-edition engraving. Its arch spans the pole. | none | v4 frame x 135, y 24, 180 x 123. Ink box x 147 to 305, y 23 to 139 (1,586 px). Lowest ink in the pole column y 92, which is 22 px above P. | Engraving bed: path dilated 3 px, black 85 %, 1 px feather. Tight shadow (+1,+2), blur 1.5, 85 %. Ink gradient `#C4FF8A` (y 23) to `#86C855` (y 140). 1 px NW rim light `#DFFFC0`. | on; scale 0.97 to 1.0 | `dragon_mask.png` with tintColor `#4E6644` (Y 11.5 %) |
| 14 | **Active digits** `DigitalClock` + colon `PartText` + **live** `Group` | HH:MM. The **seconds trail**: an Arc that starts at the probe and runs clockwise SECOND x 6° round the trench, resetting to the probe each minute. | civil h:m; **seconds** | hour box x 119 w 94, minute box x 237 w 94, y 186 h 86 (centres x 166 / x 284, baseline 252). Colon x 215 w 20. Trail r 190.5, 1.6 px. | Roboto Mono SemiBold 78, `#EFF8EC`. Colon `#A6F46A`. Trail `#A6F46A` at 80 %. **No text Shadow** (section 9). | on | off |
| 15 | **AOD digits** `DigitalClock` (BitmapFont) + AOD colon `PartText` with `Outline` | HH:MM asleep | civil h:m | same boxes, **last in document order** | Ten baked outline glyphs `kwo_0..9`: 1.4 px `#91AD80` outline, `#0C160B` fill | off | on |

**Time scales on the face (seven):**

| Time scale | Where it shows |
|---|---|
| second | trail from the probe |
| minute | digits and the F2 pointer |
| civil hour | digits |
| apparent solar day | gold sun, plus the day key from solar altitude |
| sidereal day | sky about P; probe and zodiac ticks about C |
| tropical year (zodiac month and day length) | sun between the zodiac ticks, `SCO` on the date line, length of the day key |
| synodic month | moon position and phase |

ASCII plan view at 20:08, 25 Oct 2026 (LST 327.8°, moon nearly full in the east):

```
                     F2 r211-225 lit grey flange: engraved ticks, phosphor indices, ▲ minute pointer (48°)
                F1 r198-209 black 24 h ring (00 top, 12 bottom) ─ ☼ sun at 62° (after sunset, heading for midnight)
           trench r185-196: zodiac ticks, ● probe at 212° dragging the seconds trail clockwise
       ┌─── dome lip r182-185 (lit NW) ─── north ground crescent y43-70 under the wings ───┐
       │            ~~~~~~~ official dragon (v4 frame), arch over the pole ~~~~~~~        │
       │   Cas  ·  ·     + P (225,114) Polaris, cap r43.5     · UMa  ·                    │
       │ E ·  rising          ≈≈≈ Milky Way brushwork (Cyg-Cas-Per) ≈≈≈        setting · W│
       │  ☾ moon (143,175) ╭──────── smoked glass x113-337 y168-268 ─────────╮            │
       │   slipping under  │          25 OCT / SUN / SCO   (zenith y177)    │            │
       │   the glass       │               2 0 : 0 8                        │            │
       │                   ╰────────────────────────────────────────────────╯            │
       │        ( BAT  78% )  r40 (146,320)            ( STP 6240 )  r40 (304,320)       │
       │              southern sky: ecliptic, Aquarius-Pisces culminating                │
       └──────────── dome lip = Seoul horizon ─── "kali@vault:~$ INFINITY" on F2 ────────┘
```

---

## 3. Depth budget: why this reads as a stack on an AMOLED

**Rule adopted.** This accepts critic 1's substance and sharpens the metric. Every plane boundary must have both of the following:

- (a) a lit edge of at least **15 % Y** on its light-facing side;
- (b) somewhere along it, a step of at least **3:1 luminance ratio, or at least 12 ΔL\***, between the two planes.

Shadows count only where they land on a lit surface: the Milky Way, the glaze, or F2. On black they count for nothing; v1's mistake was to rely on them there.

| Boundary | Upper side | Lower side | Lit edge | Passes |
|---|---|---|---|---|
| F2 to F1 | F2 face Y 3.5 to 25 % | F1 lacquer 0.27 % | step SE 51.6 % | ratio 13 to 92x |
| F1 to trench | F1 0.27 % | floor 0.12 % | step SE 31.4 % | edge 31 %, ratio 260x across the edge |
| trench to vault | floor 0.12 % | glaze 3.6 % to SE rim 0.46 % | dome lip NW 46.4 % | ratio 4 to 30x |
| plate over vault | glass core 0.12 % (over ground) to 1.67 % (over a bright star) | sky 1.1 % / Milky Way 37.9 % | bevel 18.8 % | over the Milky Way, 0.95 % vs 37.9 % = 40x |
| plate shadow | on Milky Way 37.9 % → 2.25 % (ΔL\* 51); on glaze 3.64 % → 0.42 % (ΔL\* 18.6) | | | yes |
| registers over vault | glass 5.5 % over the Milky Way core | 37.9 % | rim 18.8 % | 6.9x |
| dragon over everything | ink 74 % on bed 0.95 % | | rim light `#DFFFC0` | 78x; its shadow on F2 NW takes 25 % to 0.73 % |

**Occlusion chains.** Moving things pass behind front planes, which is the strongest depth cue and works at any panel brightness:

1. The **probe** and its trail pass under the dragon's wing root. The probe is more than half covered for 8.9° of its orbit, about 36 min per sidereal day, and touched for 20.6° (82 min). Critic 1 measured 16 h for v1.
2. The **sun** passes under the wing tips for 10.7° around solar midnight, about 43 min: the sun sleeps under the wing.
3. Stars and the **moon** rise out of the lit lip on the left, set into it on the right, and slide behind the glass. Of the moon's up-time it is 52.7 % open, 39.3 % behind the plate glass (seen at 15 %), 4.4 % behind a register and 3.6 % at the lip edge.
4. The circumpolar asterisms (Ursa Major, Cassiopeia, Cepheus) turn through the dragon's openwork.

**Parallax on wake:** sky 0 %, flange rotates 14°, plate 2.5 %, registers 3 %, dragon 3 %.

**Value framing:** a lit frame (F2) surrounds a black trench, which surrounds a recessed, darker sky with bright brushwork. This is critic 1's "the sky reads as a hole inside a light ring".

Measured on the mock, Active average luminance is 7.5 % at 20:08 and 7.7 % at 10:08 with the day key. That costs more panel power than v4; it is the price of depth. The flange is 34.6 % of the dial at a mean of about 10 %.

---

## 4. Composition (fixed coordinates)

- **HH:MM:** unchanged and never moved or scaled. Hour centre x 166, minute centre x 284, baseline 252, Roboto Mono SemiBold 78 `#EFF8EC`. Colon `#A6F46A` at x 225, baseline 248. Digit ink runs x 123 to 327, y 196.5 to 252.
- **Plate:** the 85 % core covers all four digit-ink corners, with margins of 10 px horizontally, 28.5 px at the top and 16 px at the bottom (critic 2's sampling test passes). Plate corners sit at r ≤ 132 from C.
- **Date line:** `25 OCT / SUN / ` as one PartText at x 144, w 135, align START. `SCO` as a second PartText at x 279, w 27, in gold. Baseline 186: cap top 175.3, which is 7.3 px under the plate top and 10.5 px above the digit tops.
- **Registers:** BAT at (146,320) and STP at (304,320), r 40. Label 11 px at baseline 313. Value 19 px at baseline 333.
  - Value ink corners reach r 31.3 inside a gauge at r 34.5, leaving 2.3 px clearance.
  - Steps are shown without a thousands separator ("12345" is 57 px wide), with `isAutoSize="TRUE"` as an overflow guard.
- **Dragon:** the v4 frame and size (rebuttal R3.4). The pole is 22 px under the lowest ink in its column. The north ground crescent sits under the wings, so the dragon stands on the northern horizon.
- **Flanges:** the inscription replaces F2 ticks between 156° and 204° and the 6 o'clock index. The minute pointer is a hand and passes over it at minutes 27 to 33.
- **Safe radius:** information text stays inside r 171. Date corners are at r 64; register text is at r ≤ 155. Text on the flanges is decoration only: the prompt, and INFINITY at 11 px.
- **Changed from v4:**
  - The `KALI / ORBIT` label, `SEC 24`, the label/value/bar rows and the flat prompt line are gone.
  - Telemetry is now round glass registers.
  - The prompt is a flange inscription.
  - The date moved onto the plate.
  - The sky now surrounds every object on all four sides.

---

## 5. Palette

| Hex | Role (one job each) |
|---|---|
| `#A6F46A` phosphor (metal tints `#D2FFA4` / `#4E7F34`, highlight `#E2FFC4`) | KALI identity: dragon, probe, seconds trail, minute pointer, F2 indices, gauges, colon, INFINITY, pole reticle |
| `#EFF8EC` paper | digits and register values |
| `#9BAB9C` quiet / `#B9C5CA` transferred white | date, labels / inscription and flange ticks |
| `#D9A441` solar gold (`#E8B65A` disc, `#FFE2A0` highlight, `#8A6A2C` AOD) | the sun and its sign. Nowhere else. |
| Grisaille greys `#141C24` → `#9AA8AE`, stars `#E4ECEE` / `#B9C5CA` / `#7C888E` | the vault (fired enamel) |
| Opaline greys `#7E8B91` / `#4A555B` / `#2E363A`, bevel `#B5C0C5` / `#A9B8BE` / `#95A3A9` | the lit middle plane (F2, steps, lip, glass edges) |
| `#2E4A5A` day enamel | day key veil only |
| `#F3C479` warning | battery ≤ 15 % only |
| AOD: `#91AD80`, `#7F9472`, `#4E6644`, `#4D633F`, `#5A6870`, `#2C3A33` | AOD only |

The removed hue is v1's enamel teal `#0E2A33`. It was the receiving colour for every invisible shadow.

---

## 6. Motion

### 6.1 Wake (AOD → Active), 360 ms design, revealed from the deepest plane outward

WFF Variant `duration` and `startOffset` are fractions (0 to 1) of the device's transition window W. W is unknown on the Samsung runtime (device test T1). The fractions below assume W = 360 ms:

- If W is greater than 360 ms, multiply every fraction by 360/W so visible motion still ends at 360 ms.
- If W is less than 360 ms, keep the fractions and let the order compress.

Every duration plus startOffset is ≤ 1.0, which is required. Interpolation is `CUBIC_BEZIER` with controls `0.22 1 0.36 1`.

| Design ms | Element | Property | AMBIENT value → Active | startOffset / duration |
|---|---|---|---|---|
| 0 to 200 | `sky_active` / `sky_aod` | alpha | 0 → 255 / 255 → 0 | 0 / 0.556 |
| 0 to 360 | `f2` group | angle, alpha | −14° → 0° (clockwise), 0 → 255 | 0 / 1.0 |
| 40 to 240 | dome lip, trench, F1, dome light, day key, horizon hairline | alpha | 0 → 255; AOD hairline 255 → 0 | 0.111 / 0.556 |
| 80 to 320 | plate; registers | alpha, scaleX/Y | 0 → 255; 0.975 / 0.97 → 1.0 | 0.222 / 0.667 |
| 120 to 340 | Active clock / AOD clock (same boxes) | alpha | 0 → 255 / 255 → 0: the digits fill in place | 0.333 / 0.611 |
| 120 to 360 | dragon relief / AOD mask | alpha, scaleX/Y | 0 → 255, 0.97 → 1.0 / 255 → 0 | 0.333 / 0.667 |
| 200 to 360 | `live` group (trail), probe glow, sun glow, minute pointer, gauges, date sign | alpha | 0 → 255 | 0.556 / 0.444 |

**Active → AOD.** **ASSUMPTION:** the same Variants run in reverse. The reference documents one `duration` and `startOffset` per Variant and nothing about direction. If the device plays `startOffset` on AOD entry, the sky leaves first and the dragon last. That reads as the planes sinking back, which is acceptable. If it looks wrong, set every startOffset to 0 and keep the order through `duration` alone. v4's 180 ms return cannot be expressed.

### 6.2 Real-time motion (slow; allowed in both modes)

| Object | Rate | Visible speed |
|---|---|---|
| sky about P | 0.2507°/min counter-clockwise | 0.88 px/min at r 200 from P |
| probe and zodiac ticks about C | 0.2507°/min counter-clockwise | 0.83 px/min |
| sun on F1 | about 0.25°/min counter-clockwise (apparent) | 0.89 px/min |
| moon in the chart | sidereal rate minus 13.2°/day | |
| day key | alpha follows solar altitude; twilight ramp from −12° to +6° takes about 75 to 110 min in Seoul | |
| minute pointer | 6° step each minute, `Animation duration="0.25" interpolation="EASE_OUT" fps="30"` (fps defaults to 15) | |

### 6.3 Every second (Active only)

The seconds trail is an `Arc` at r 190.5:

- `startAngle` = probe angle.
- `endAngle` = probe angle + `[SECOND]` x 6.
- It advances 19.9 px/s and resets to the probe each minute. This is v4's seconds trail, now anchored to the tourbillon analogue.

Nothing else moves per second: no cage, no blinking colon, no twinkle, no scan line. Every `[SECOND]` reference lives inside the Active-only `live` group.

### 6.4 Reduced motion

The mechanism is a Scene-level `BooleanConfiguration id="reduce_motion"`, declared in `<UserConfigurations>` with `displayName` and `defaultValue="FALSE"`. It has two `BooleanOption` children, each wrapping one Group:

- `FALSE`: the tree above.
- `TRUE`: the same tree with every Variant at `duration="0"` (alpha only), no angle or scale Variants, and no pointer `Animation`.

Bitmaps are shared resources, so memory does not double; the XML does. `watch_face_info.xml` must switch to `<Editable value="true"/>`; the current project has `false`. The studio also honours `prefers-reduced-motion` and goes instant.

---

## 7. AOD

**Contents.** Everything sits on black:

- outline digits (BitmapFont DigitalClock) and an outlined colon;
- the date `25 OCT / SUN`;
- about 70 vector stars (mag ≤ 2.5), still turning with the sky group;
- the moon ring;
- the dome hairline r 183.5;
- 12 ticks at r 200 to 208;
- the sun dot and the probe dot;
- `INFINITY` on r 204;
- the left register rim with `78%`;
- the dragon dim fill `#4E6644`.

Black footprints of the plate and registers stop stars from crossing the digits. There is no plate, no glow, no day key, no trail, no pointer, no prompt and no STP. Nothing sits inside the 10 px edge band (outermost AOD pixel at r 212). There is no minute indicator other than the digits, so a frozen element can never show a wrong minute.

**Measured lit share.** From `mock.py`: rendered at 3x supersampling, box-downsampled to 450, over the 450 disc, everything counted including the digit fill and anti-aliasing.

| Sample | Non-zero RGB (v4 rule) | max(R,G,B) > 24 | Mean linear Y (WO-P7 style) | Mean sRGB |
|---|---|---|---|---|
| 10:08 | 8.13 % | 4.37 % | 0.54 % | 1.47 % |
| 20:08 | 8.47 % | 4.54 % | 0.57 % | 1.55 % |
| 08:08 (most outline) | 8.66 % | 4.60 % | 0.59 % | 1.58 % |

The limit is 15 %; v4 was 11.3 % by the same non-zero rule. Critics 2 and 3 were right that v1's 4.6 % undercounted the outline glyphs.

**Burn-in.**

- The brightest static AOD pixels are the digit outlines `#91AD80` (Y 37 %), and they change every minute.
- The dragon drops from v4's effective Y of about 18 % to 11.5 %.
- Hairlines are 3.8 %.
- The hand-written ±3 px drift is **deleted**: Samsung shifts the AOD frame itself, and the drift made the two clocks disagree during the cross-fade.

**Offload safety.** Under `--apply-v1-offload-limitations` (already in the project's pipeline), the memory tool treats only `DigitalClock`/`AnalogClock` and a Part\* with a minute-driven `angle` Transform as dynamic, caps them at two, and bakes everything else into layers. v2's AOD has exactly **one** dynamic clock: the AOD DigitalClock, last in document order, giving one static layer.

The sky, sun, probe and moon Groups have their Transforms on Groups. If an offloading renderer bakes them, they hold their pose until wake. That is harmless: the error is 0.25°/min, and the Active and AOD twins share one Group angle, so they re-sync together with no double image. If the renderer re-evaluates ambient Transforms each minute, as documented, they advance once a minute.

---

## 8. Astronomy as WFF expressions (Seoul 37.5665 N, 126.978 E; UTC-anchored)

v2 drops v1's `[YEAR]` / `[DAY_OF_YEAR]` / `[HOUR_0_23_MINUTE]` clock. It used local time, which baked in Seoul's time zone and carried a leap-year error. v2 uses **`[MINUTES_SINCE_EPOCH]`** (WFF v3, present in the v4 `sourceType.xsd` enum). It is UTC, so it is correct across travel and years. It is per-minute, so it is AOD-safe. And it contains the substring `MINUTE`, which is how the memory tool classifies time-dynamic nodes. The constants are anchored at 2026-01-01 00:00 UT, which is 29,453,760 minutes after the Unix epoch.

| # | Name | WFF expression (degrees; `rad()`/`deg()` as documented) |
|---|---|---|
| E1 | d (days) | `([MINUTES_SINCE_EPOCH] - 29453760) / 1440` |
| E2 | LST | `(227.64 + 360 * fract(E1) + 0.98564737 * E1) % 360` (GMST 2026.0 = 100.661 + 126.978) |
| E3 | sky angle | `(360 - E2) % 360` on Group `sky`, pivot at P |
| E4 | probe angle | `((180 - E2) % 360 + 360) % 360` |
| E5 | λ☉ | `280.667 + 0.98564736*E1 + 1.9146*sin(rad(357.282 + 0.98560028*E1)) + 0.02*sin(rad(2*(357.282 + 0.98560028*E1)))` |
| E6 | α☉ | `E5 - 2.4657*sin(rad(2*E5)) + 0.0529*sin(rad(4*E5))` |
| E7 | δ☉ | `deg(asin(0.39777*sin(rad(E5))))` |
| E8 | sun angle | `((180 + E6 - E2) % 360 + 360) % 360` (apparent solar time: noon at 180°) |
| E9 | solar altitude h | `deg(asin(0.60942*sin(rad(E7)) + 0.79285*cos(rad(E7))*cos(rad(E2 - E6))))` |
| E10 | day-key alpha | `clamp((E9 + 12) / 18, 0, 1) * 107` |
| E11 | zodiac sign index | `floor((E5 % 360) / 30)`; 0 = ARI … 7 = SCO |
| E12 | λ☾ | `67.966 + 13.17639648*E1 + 6.289*sin(rad(6.669 + 13.06499295*E1)) + 1.274*sin(rad(2*(147.299 + 12.19074912*E1) - (6.669 + 13.06499295*E1))) + 0.658*sin(rad(2*(147.299 + 12.19074912*E1)))` |
| E13 | β☾ | `5.128*sin(rad(85.797 + 13.22935024*E1))` |
| E14 | δ☾ / α☾ | `deg(asin(0.91748*sin(rad(E13)) + 0.39777*cos(rad(E13))*sin(rad(E12))))` / `E12 - 2.4657*sin(rad(2*E12)) + 0.0529*sin(rad(4*E12))` |
| E15 | moon x, y (Group top-left) | `225 + 128*tan(rad((90 - δ☾)/2))*sin(rad(180 + α☾ - E2)) - 11` and `114 - 128*tan(rad((90 - δ☾)/2))*cos(rad(180 + α☾ - E2)) - 11` |
| E16 | phase bucket | `floor(((((E12 - E5) % 360 + 360) % 360 + 22.5) % 360) / 45)`; 0 new, 2 first quarter, 4 full, 6 last quarter |

**Validation.** `astro_check.cjs` compared these expressions with Meeus (`studio/astro.js`), half-hourly over 2026 to 2027. Maximum errors:

| Quantity | Max error |
|---|---|
| LST | < 0.01° |
| sun RA | 0.01° |
| sun altitude | 0.01° |
| moon λ | 0.64° |
| moon δ | 0.82° |
| moon RA | 2.09° (β ignored in RA) |
| moon chart position | ≤ 6.5 px |

v1's moon was ±10°, and its mean sun was ±4°. Zodiac entries computed from E5 for 2026 (UT): ARI on Mar 20 at 15 h, TAU Apr 20, …, SCO Oct 23 at 10 h, SGR Nov 22, CAP Dec 21.

**Samples:**

| Sample (KST) | MINUTES_SINCE_EPOCH | LST | Sun | Moon | Probe |
|---|---|---|---|---|---|
| 2026-10-25 20:08:24 | 29,882,108 | 327.83°, sky angle 32.17° | α 209.88°, δ −12.19°, h −29.5° (day key 0), pointer 62.0° | λ 22.6°, δ 12.9°, elongation 170.5° (bucket 4, full) at (143.6,175.3), slipping under the plate's top-left corner; true altitude +38° | 212.2° |
| 2026-10-25 10:08:24 | | 177.42° | h +32.0° (day key full, 42 %), pointer 212.1° (lower left, south-east) | below the horizon (−39.9°), not drawn | 2.6°, under the wing root |

**Precision.** The worst case is float32 evaluation:

- `MINUTES_SINCE_EPOCH` near 2.95e7 loses ±1 min, which is ±0.25° (under 1 px).
- `fract(E1)` near E1 = 3,650 has a resolution of 21 s, about 0.09°.
- Errors stay within the figures above until about 2040; after that, re-anchor the constants.

**Fallback if `MINUTES_SINCE_EPOCH` misbehaves on Samsung:** v1's local-time form, `LST = 227.64 + 0.98565*(([YEAR]-2026)*365.25 + [DAY_OF_YEAR]-1) + 15.04107*([HOUR_0_23_MINUTE] - [TIMEZONE_OFFSET_MINUTES_DST]/60)`.

**Optional single-sourcing.** `<Reference name="sky_rot" source="angle"/>` on Group `sky` and `<Reference name="sun_rot" source="angle"/>` on Group `sun` (Reference is WFF v4). Then cos(E2 − E6) = −cos(rad(`[REFERENCE.sun_rot]`)) in E9. Inline copies are the safe default until T6 passes.

---

## 9. WFF v4 mapping

### 9.1 Schema facts this design depends on (v4 XSD file in brackets)

- `TimeText` accepts `Variant` plus exactly one `Font` or `BitmapFont`. Its `Font` is attributes-only: no `Shadow` or `Outline` (`clock/timeText.xsd`). Format pattern `h{2}_(10|1)|…|(h{1,2})|m{1,2}|s{1,2}`, so `hh` and `mm` are valid.
- `DigitalClock` children are `Localization`, `Variant` and `TimeText` only (no Transform). It has alpha, scaleX/Y and tintColor (`clock/digitalClock.xsd`).
- `PartText > Text > Font` accepts `Shadow`, `Outline`, `OutGlow`, `Underline`, `StrikeThrough`, `Template`, `Upper`, `Lower`, `InlineImage`, `Transform` and `Reference`. `Shadow` and `Outline` may themselves contain a `Template` (`text/fontElement.xsd`, `decoration/abstractDecorationType.xsd`). `Text` has `isAutoSize` (minimum 12 px).
- `TextCircular` takes centerX/Y, width/height, start/endAngle, direction and align (`text/textCircularElement.xsd`).
- `BitmapFonts > BitmapFont name > Character name resource width height` is a child of `WatchFace`, alongside `Metadata`, `UserConfigurations` and `Scene` (`watchface.xsd`, `bitmapFontsElement.xsd`).
- `Compare` has one attribute, `expression`, which must be a keyref to a named `Expression` (`common/conditionElement.xsd`).
- `Arc`, `Ellipse` and `RoundRectangle` take `Stroke`/`Fill`/`Transform`/`Reference` only, with **no Variant**. Their x/y/centerX/Y are `xs:float` (shape XSDs). `Line` takes startX/Y and endX/Y.
- **Group and Part\* `x`/`y` are `xs:integer` (negative allowed); `width`/`height` are `xs:positiveInteger`** (`attributes/geometricAttributes.xsd`). v1's `x="222.5"` was invalid. Sub-pixel placement goes on shapes.
- `pivotX`/`pivotY` are `xs:float`, normalized (`transform/pivotType.xsd`).
- `Variant`: target, value, mode=AMBIENT, duration and startOffset in [0,1], interpolation including CUBIC_BEZIER plus controls, angleDirection. It is allowed any number of times on Group and Part\* (`variant/variantElements.xsd`, `abstractPartType.xsd`, `groupElement.xsd`).
- `Animation` has `duration` in seconds and `fps` defaulting to 15 (`common/animationElement.xsd`).
- `Stroke` has color, thickness, dashIntervals, dashPhase, cap (no `join` in v4) and gradient children. `RadialGradient`/`SweepGradient` accept up to 3/4 Transforms (style and gradient XSDs).
- `Localization` takes `timeZone`, `calendar` and **`locales`**: "if one of the given locales is matched to the system locale, it uses the matched locale, otherwise, it uses the firstly added locale" (`common/localizationElement.xsd`).
- `Group` has **no `blendMode` in v4** (that is v5). Part\* do (`blendModeType.xsd`). v2 uses no blend modes.
- `UserConfigurations > BooleanConfiguration` needs id, displayName and defaultValue. The Scene-level `BooleanConfiguration > BooleanOption id=TRUE|FALSE` takes one child (`userConfiguration/*.xsd`).
- `MINUTES_SINCE_EPOCH` and `TIMEZONE_OFFSET_MINUTES_DST` are in the v4 source enum (`simpleTypes/sourceType.xsd`).

### 9.2 Three engineering decisions the critics did not raise

1. **A Group rotated about an off-centre pivot gets a box that contains its whole rotated content.** The sky Group is x −68, y −179, 586 x 586, pivot 0.5/0.5, so its centre is P. **ASSUMPTION:** Groups and PartDraws clip to their own box in the local frame. If they do, a 450-wide sky Group pivoted at (225,114) would lose sky that rotates in from above y 0. This box makes the question irrelevant.
2. **Digits.** Active is a plain `DigitalClock`. The v1 digit Shadow fell on an 85 % black plate and was invisible, so the cue is now the plate's lit bevel. AOD is a second `DigitalClock` whose `TimeText` uses **`BitmapFont family="kw_outline"`**: ten glyphs baked from Roboto Mono SemiBold 78 in final colours, 47 x 86 cells.
   - This keeps the one element every ambient model treats as a live clock, and keeps the outline identity.
   - Fallback 1 (critic 3's): `PartText` + `Template` inside `Outline`, valid per the XSD, but it relies on the memory tool's old-style-clock heuristic.
   - Fallback 2: `DigitalClock` with a plain dim fill `#4E6644`.
3. **The date stays English on the Korean device** through `<Localization calendar="GREGORIAN" locales="en_US"/>` with `<Upper>[MONTH_S]</Upper>` and `[DAY_OF_WEEK_S]`. That is one line, documented in the XSD, and replaces critic 2's 19 `Compare` branches.

### 9.3 XML sketch (corrected)

`{E2}` and similar stand for the section 8 expressions, pasted verbatim. Inside attribute values, `<` is written `&lt;`.

```xml
<WatchFace width="450" height="450" clipShape="CIRCLE">
  <Metadata key="CLOCK_TYPE" value="DIGITAL"/>
  <Metadata key="PREVIEW_TIME" value="20:08:24"/>
  <UserConfigurations>
    <BooleanConfiguration id="reduce_motion" displayName="@string/reduce_motion" defaultValue="FALSE"/>
  </UserConfigurations>
  <BitmapFonts>
    <BitmapFont name="kw_outline">
      <Character name="0" resource="kwo_0" width="47" height="86"/>
      <!-- 1..9 identical, kwo_1..kwo_9 -->
    </BitmapFont>
  </BitmapFonts>
  <Scene backgroundColor="#ff000000">
   <BooleanConfiguration id="reduce_motion">
    <BooleanOption id="FALSE">
     <Group name="face" x="0" y="0" width="450" height="450">

      <!-- z1 sky: box centred on the pole P(225,114) -->
      <Group name="sky" x="-68" y="-179" width="586" height="586" pivotX="0.5" pivotY="0.5">
        <Transform target="angle" value="(360 - {E2}) % 360"/>
        <PartImage name="sky_active" x="0" y="0" width="586" height="586">
          <Variant mode="AMBIENT" target="alpha" value="0" duration="0.556" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
          <Image resource="sky_active"/>
        </PartImage>
        <PartDraw name="sky_aod" x="0" y="0" width="586" height="586" alpha="0">
          <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
          <Ellipse x="211.2" y="292.2" width="1.6" height="1.6"><Fill color="#ff5a6870"/></Ellipse>
          <!-- ~70 generated dots, LST=0 chart positions + (68,179) -->
        </PartDraw>
      </Group>

      <!-- z2 moon: one positioned Group, 8 phase branches -->
      <Group name="moon" x="0" y="0" width="22" height="22">
        <Transform target="x" value="{E15x}"/>
        <Transform target="y" value="{E15y}"/>
        <Condition>
          <Expressions>
            <Expression name="ph0"><![CDATA[{E16} == 0]]></Expression>
            <!-- ph1..ph7 -->
          </Expressions>
          <Compare expression="ph0">
            <PartImage name="moon_0" x="0" y="0" width="22" height="22">
              <Variant mode="AMBIENT" target="alpha" value="0" duration="0.556"/>
              <Image resource="moon_0"/>
            </PartImage>
          </Compare>
          <!-- ph1..ph7 -->
        </Condition>
        <PartDraw name="moon_aod" x="0" y="0" width="22" height="22" alpha="0">
          <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
          <Ellipse x="6" y="6" width="10" height="10"><Stroke color="#ff6b7a80" thickness="1"/></Ellipse>
        </PartDraw>
      </Group>

      <!-- z3 fixed light, z4 day key (Variant on the Group, alpha Transform on the child: no conflict) -->
      <PartImage name="dome_light" x="43" y="43" width="364" height="364">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.111" duration="0.556"/>
        <Image resource="dome_light"/>
      </PartImage>
      <Group name="daykey" x="0" y="0" width="450" height="450">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.111" duration="0.556"/>
        <PartDraw name="veil" x="43" y="43" width="364" height="364">
          <Transform target="alpha" value="clamp(({E9} + 12) / 18, 0, 1) * 107"/>
          <Ellipse x="0" y="0" width="364" height="364"><Fill color="#ff2e4a5a"/></Ellipse>
        </PartDraw>
      </Group>

      <!-- z5 north ground: circle (225,280.4) stroked over r209.9..240 -->
      <PartDraw name="north_ground" x="0" y="0" width="450" height="450">
        <Ellipse x="0" y="55.4" width="450" height="450"><Stroke color="#ff050607" thickness="30.1"/></Ellipse>
      </PartDraw>
      <PartDraw name="horizon_line" x="0" y="0" width="450" height="450">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.111" duration="0.556"/>
        <Arc centerX="225" centerY="280.4" width="419.8" height="419.8" startAngle="-52.9" endAngle="52.9">
          <Stroke color="#598fa3aa" thickness="1.2"/>
        </Arc>
      </PartDraw>

      <!-- z6-8 rings (vector), with an AOD twin hairline -->
      <PartDraw name="rings" x="0" y="0" width="450" height="450">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.111" duration="0.556"/>
        <Ellipse x="41.5" y="41.5" width="367" height="367">
          <Stroke color="#ff5a6a72" thickness="3">
            <SweepGradient centerX="225" centerY="225" startAngle="0" endAngle="360"
              colors="#ff5f6d73 #ffa9b8be #ff5f6d73 #ff1c252a #ff5f6d73" positions="0 0.125 0.375 0.625 1"/>
          </Stroke>
        </Ellipse>                                                         <!-- dome lip r182-185, lit at 315° -->
        <Ellipse x="34.5" y="34.5" width="381" height="381"><Stroke color="#ff030405" thickness="11"/></Ellipse>   <!-- trench floor -->
        <!-- F1 step r196-198 (lit 135°), F1 ring r198-209 black + 24 ticks (dashIntervals on r202:
             24 ticks -> period 52.883: "1 51.883"; cardinal ticks as 4 Lines) -->
      </PartDraw>
      <PartDraw name="rings_aod" x="0" y="0" width="450" height="450" alpha="0">
        <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
        <Ellipse x="41.5" y="41.5" width="367" height="367"><Stroke color="#ff2c3a33" thickness="1"/></Ellipse>
        <Ellipse x="21" y="21" width="408" height="408"><Stroke color="#ff4d633f" thickness="8" dashIntervals="1.25 105.56"/></Ellipse>
      </PartDraw>

      <!-- z7 probe group (sidereal about C): zodiac ticks + probe; Active/AOD twins share the angle -->
      <Group name="probe" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
        <Transform target="angle" value="{E4}"/>
        <PartDraw name="zodiac_ticks" x="0" y="0" width="450" height="450">
          <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.111" duration="0.556"/>
          <Line startX="225" startY="32" endX="225" endY="38"><Stroke color="#ff3a464c" thickness="1"/></Line>
          <!-- 11 more Lines at clock offsets 27.91 ... 332.09° -->
        </PartDraw>
        <PartDraw name="probe_active" x="0" y="0" width="450" height="450">
          <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.556" duration="0.444"/>
          <Ellipse x="219" y="28.5" width="12" height="12">
            <Fill color="#ffa6f46a"><RadialGradient centerX="225" centerY="34.5" radius="6" colors="#bfa6f46a #00a6f46a" positions="0 1"/></Fill>
          </Ellipse>
          <Ellipse x="222.5" y="32" width="5" height="5"><Fill color="#ffe2ffc4"/></Ellipse>
        </PartDraw>
        <PartDraw name="probe_aod" x="0" y="0" width="450" height="450" alpha="0">
          <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
          <Ellipse x="223" y="32.5" width="4" height="4"><Fill color="#ff5e7a55"/></Ellipse>
        </PartDraw>
      </Group>

      <!-- z8 sun group (apparent solar about C) -->
      <Group name="sun" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
        <Transform target="angle" value="{E8}"/>
        <PartDraw name="sun_active" x="0" y="0" width="450" height="450">
          <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.556" duration="0.444"/>
          <Ellipse x="216" y="12.5" width="18" height="18">
            <Fill color="#ffd9a441"><RadialGradient centerX="225" centerY="21.5" radius="9" colors="#99d9a441 #00d9a441" positions="0 1"/></Fill>
          </Ellipse>
          <Ellipse x="220.5" y="17" width="9" height="9">
            <Fill color="#ffe8b65a"><RadialGradient centerX="223.5" centerY="19.5" radius="5" colors="#ffffe2a0 #ffe8b65a" positions="0 1"/></Fill>
          </Ellipse>
        </PartDraw>
        <PartDraw name="sun_aod" x="0" y="0" width="450" height="450" alpha="0">
          <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
          <Ellipse x="222" y="18.5" width="6" height="6"><Fill color="#ff8a6a2c"/></Ellipse>
        </PartDraw>
      </Group>

      <!-- z9 F2: baked brushed ring + inscription; pointer child; v4 wake signature -->
      <Group name="f2" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
        <Variant mode="AMBIENT" target="angle" value="-14" duration="1.0" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1" angleDirection="CLOCKWISE"/>
        <Variant mode="AMBIENT" target="alpha" value="0" duration="1.0"/>
        <PartImage name="flange_f2" x="0" y="0" width="450" height="450"><Image resource="flange_f2"/></PartImage>
        <PartDraw name="minute_pointer" x="0" y="0" width="450" height="450" pivotX="0.5" pivotY="0.5">
          <Transform target="angle" value="[MINUTE] * 6"><Animation duration="0.25" interpolation="EASE_OUT" fps="30"/></Transform>
          <!-- triangle as a 3-px RoundRectangle wedge or a 7x8.5 PNG; shown as a stub -->
          <Rectangle x="223.8" y="4" width="2.4" height="8.5"><Fill color="#ffc4ff8a"/></Rectangle>
        </PartDraw>
      </Group>
      <PartText name="infinity_aod" x="0" y="0" width="450" height="450" alpha="0">
        <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
        <TextCircular centerX="225" centerY="225" width="408" height="408" startAngle="162.5" endAngle="197.5" direction="COUNTER_CLOCKWISE" align="CENTER">
          <Font family="roboto_mono" size="11" letterSpacing="0.18" color="#ff7f9472"><![CDATA[INFINITY]]></Font>
        </TextCircular>
      </PartText>

      <!-- z10 plate + AOD footprint -->
      <PartDraw name="plate_mask_aod" x="0" y="0" width="450" height="450" alpha="0">
        <Variant mode="AMBIENT" target="alpha" value="255" duration="0.556"/>
        <RoundRectangle x="113" y="168" width="224" height="100" cornerRadiusX="18" cornerRadiusY="18"><Fill color="#ff000000"/></RoundRectangle>
        <Ellipse x="106" y="280" width="80" height="80"><Fill color="#ff000000"/></Ellipse>
        <Ellipse x="264" y="280" width="80" height="80"><Fill color="#ff000000"/></Ellipse>
      </PartDraw>
      <PartImage name="plate" x="105" y="160" width="240" height="116" pivotX="0.5" pivotY="0.5">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.222" duration="0.667" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
        <Variant mode="AMBIENT" target="scaleX" value="0.975" startOffset="0.222" duration="0.667"/>
        <Variant mode="AMBIENT" target="scaleY" value="0.975" startOffset="0.222" duration="0.667"/>
        <Image resource="hour_plate"/>
      </PartImage>

      <!-- z11 date line: English on any system locale -->
      <PartText name="date" x="144" y="172" width="135" height="18">
        <Localization calendar="GREGORIAN" locales="en_US"/>
        <Variant mode="AMBIENT" target="alpha" value="0" duration="0.556"/>
        <Text align="START"><Font family="roboto_mono" size="15" color="#ff9bab9c">
          <Upper><Template><![CDATA[%s %s / %s / ]]><Parameter expression="[DAY_Z]"/><Parameter expression="[MONTH_S]"/><Parameter expression="[DAY_OF_WEEK_S]"/></Template></Upper>
        </Font></Text>
      </PartText>
      <Condition>
        <Expressions>
          <Expression name="z0"><![CDATA[{E11} == 0]]></Expression>
          <!-- z1..z11 -->
        </Expressions>
        <Compare expression="z0">
          <PartText name="sign_ari" x="279" y="172" width="27" height="18">
            <Variant mode="AMBIENT" target="alpha" value="0" duration="0.556"/>
            <Text align="START"><Font family="roboto_mono" size="15" color="#ccd9a441"><![CDATA[ARI]]></Font></Text>
          </PartText>
        </Compare>
        <!-- TAU GEM CNC LEO VIR LIB SCO SGR CAP AQR PSC -->
      </Condition>
      <!-- AOD date twin: same PartText without the trailing " / ", colour #ff7f9472, alpha 0 -> 255 -->

      <!-- z12 registers (BAT shown; STP identical with x+158, steps arc, no AOD content) -->
      <Group name="reg_bat" x="100" y="274" width="92" height="92" pivotX="0.5" pivotY="0.5">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.222" duration="0.667"/>
        <Variant mode="AMBIENT" target="scaleX" value="0.97" startOffset="0.222" duration="0.667"/>
        <Variant mode="AMBIENT" target="scaleY" value="0.97" startOffset="0.222" duration="0.667"/>
        <PartImage name="reg_glass_l" x="0" y="0" width="92" height="92"><Image resource="register"/></PartImage>
        <PartDraw name="bat_gauge" x="0" y="0" width="92" height="92">
          <Arc centerX="46" centerY="46" width="69" height="69" startAngle="0" endAngle="360"><Stroke color="#ff17291d" thickness="1.8"/></Arc>
          <Arc centerX="46" centerY="46" width="69" height="69" startAngle="0" endAngle="0">
            <Transform target="endAngle" value="360 * [BATTERY_PERCENT] / 100"/>
            <Stroke color="#ffa6f46a" thickness="1.8" cap="ROUND">
              <Transform target="color" value="[BATTERY_PERCENT] &lt;= 15 ? colorRgb(243,196,121) : colorRgb(166,244,106)"/>
            </Stroke>
          </Arc>
        </PartDraw>
        <PartText name="bat_label" x="26" y="29" width="40" height="14"><Text align="CENTER"><Font family="roboto_mono" size="11" color="#ff9bab9c"><![CDATA[BAT]]></Font></Text></PartText>
        <PartText name="bat_value" x="14" y="43" width="64" height="22">
          <Text align="CENTER" isAutoSize="TRUE"><Font family="roboto_mono" size="19" color="#ffeff8ec"><Template><![CDATA[%s%%]]><Parameter expression="[BATTERY_PERCENT]"/></Template></Font></Text>
          <ScreenReader stringId="screen_reader_battery"><Parameter expression="[BATTERY_PERCENT]"/></ScreenReader>
        </PartText>
      </Group>
      <!-- steps arc: endAngle = 360 * clamp([STEP_COUNT] * 1.0 / [STEP_GOAL], 0, 1) -->

      <!-- z13 dragon -->
      <PartImage name="dragon_relief" x="130" y="19" width="190" height="140" pivotX="0.5" pivotY="0.5">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.333" duration="0.667" interpolation="CUBIC_BEZIER" controls="0.22 1 0.36 1"/>
        <Variant mode="AMBIENT" target="scaleX" value="0.97" startOffset="0.333" duration="0.667"/>
        <Variant mode="AMBIENT" target="scaleY" value="0.97" startOffset="0.333" duration="0.667"/>
        <Image resource="dragon_relief"/>
      </PartImage>
      <PartImage name="dragon_aod" x="141" y="21" width="168" height="124" alpha="0" tintColor="#ff4e6644">
        <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0.333" duration="0.667"/>
        <Image resource="dragon_mask"/>
      </PartImage>

      <!-- z14 Active clock + colon + live seconds -->
      <DigitalClock x="119" y="186" width="212" height="86">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.333" duration="0.611"/>
        <TimeText format="hh" hourFormat="24" align="CENTER" x="0" y="0" width="94" height="86">
          <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffeff8ec"/>
        </TimeText>
        <TimeText format="mm" align="CENTER" x="118" y="0" width="94" height="86">
          <Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffeff8ec"/>
        </TimeText>
      </DigitalClock>
      <PartText name="colon" x="215" y="182" width="20" height="86">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.333" duration="0.611"/>
        <Text align="CENTER"><Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ffa6f46a"><![CDATA[:]]></Font></Text>
      </PartText>
      <Group name="live" x="0" y="0" width="450" height="450">
        <Variant mode="AMBIENT" target="alpha" value="0" startOffset="0.556" duration="0.444"/>
        <PartDraw name="seconds_trail" x="0" y="0" width="450" height="450">
          <Arc centerX="225" centerY="225" width="381" height="381" startAngle="0" endAngle="0">
            <Transform target="startAngle" value="{E4}"/>
            <Transform target="endAngle" value="{E4} + [SECOND] * 6"/>
            <Stroke color="#cca6f46a" thickness="1.6" cap="BUTT"/>
          </Arc>
        </PartDraw>
      </Group>

      <!-- z15 AOD clock: LAST in document order (1 static layer + 1 clock in the ambient model) -->
      <PartText name="colon_aod" x="215" y="182" width="20" height="86" alpha="0">
        <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0.333" duration="0.611"/>
        <Text align="CENTER"><Font family="roboto_mono" size="78" weight="SEMI_BOLD" color="#ff0c160b"><Outline color="#ff91ad80" width="1.4"><![CDATA[:]]></Outline></Font></Text>
      </PartText>
      <DigitalClock x="119" y="186" width="212" height="86" alpha="0">
        <Variant mode="AMBIENT" target="alpha" value="255" startOffset="0.333" duration="0.611"/>
        <TimeText format="hh" hourFormat="24" align="CENTER" x="0" y="0" width="94" height="86"><BitmapFont family="kw_outline" size="86"/></TimeText>
        <TimeText format="mm" align="CENTER" x="118" y="0" width="94" height="86"><BitmapFont family="kw_outline" size="86"/></TimeText>
      </DigitalClock>
     </Group>
    </BooleanOption>
    <BooleanOption id="TRUE">
      <Group name="face_static" x="0" y="0" width="450" height="450"><!-- same tree, alpha Variants duration="0", no angle/scale Variants, no Animation --></Group>
    </BooleanOption>
   </BooleanConfiguration>
  </Scene>
</WatchFace>
```

Notes on the sketch:

- Every Part and Group `x`/`y`/`width`/`height` is an integer; fractions appear only on shapes.
- The AOD twin for each Active element is a separate Part with its own Variant. No Variant sits on a shape.
- The memory tool skips a node whose AMBIENT alpha Variant is 0 (`VariantConfigValue.isNodeSkipped`), so Active-only content costs no ambient memory.

---

## 10. Memory budget (480 px device; area x 1.138)

| Resource | Device size | Bytes |
|---|---|---|
| `sky_active.png` | 625 x 625 | 1.56 MB |
| `dome_light.png` (glaze, fall-off, reticle) | 388 x 388 | 0.60 MB |
| `flange_f2.png` (brushed annulus, ticks, indices, inscription) | 480 x 480 | 0.92 MB |
| `hour_plate.png` | 256 x 124 | 0.13 MB |
| `register.png` (one resource, drawn twice) | 98 x 98 | 0.04 MB |
| `dragon_relief.png` / `dragon_mask.png` | 203 x 149 / 179 x 132 | 0.12 / 0.09 MB |
| `moon_0..7.png` | 24 x 24 x 8 | 0.02 MB |
| `kwo_0..9.png` outline glyphs | 50 x 92 x 10 | 0.18 MB |
| `roboto_mono.ttf` (existing variable font, unprocessed size) | | 0.18 MB |
| **Interactive total** | | **about 3.8 MB of 100 MB** |
| **Ambient** (V1 offload model): 1 static layer (480² x 4) + clock glyphs + font | | **about 1.3 MB** (3.1 MB even at 3 layers) **of 10 MB** |

All rings, ticks, the trench, F1, the lip, the north ground, the probe, the sun, the gauges, the AOD stars and the AOD masks are `PartDraw`, which costs no bitmap memory.

---

## 11. Studio contract (so the studio does not promise what the watch cannot show)

1. The studio composites the **same baked PNGs** that ship in `res/drawable-nodpi`: sky, dome light, F2, plate, register, dragon relief and mask, moon sprites and glyphs. They are generated by one deterministic `design/build_sky_assets.py` next to `build_motion_assets.py`, using Inkscape, which is already in the chain. The studio draws live only what WFF also draws as vectors.
2. Text is placed by **WFF boxes** (x, y, w, h, align), not by SVG baselines.
3. A transition-window slider (300 to 800 ms) shows what the Variant fractions do on a device with a different W.
4. Lit-pixel figures come from `design/render_aod_preview.py` + `wff/analyze_aod.py` at 480 px, reporting all three metrics in section 7.
5. Astronomy in the studio calls the **section 8 expressions**, not Meeus, so the studio shows the watch's errors (moon ≤ 6.5 px). Meeus stays as the test oracle.

---

## 12. Risks and the device test plan (in order)

| # | Test | Pass criterion | Fallback |
|---|---|---|---|
| T1 | Film the existing face's `duration="0.35"` Variant at 240 fps to measure the Samsung window W | W known | Scale the fractions (section 6.1). If Variants do not animate at all, the wake is an instant swap, as in reduced motion. |
| T2 | BitmapFont `TimeText` in AOD: renders, scales 1:1 at `size="86"`, keeps baked colours, updates each minute | outline digits correct overnight | PartText + Outline; then dim-fill DigitalClock |
| T3 | `[MINUTES_SINCE_EPOCH]`: sky angle on the watch vs `astro.js` at three times | ≤ 1° | local-time LST (section 8) |
| T4 | Off-centre Group (x −68, y −179, 586) at sky angles 0/90/180/270 | no clipped sky | split the bitmap into a 450 Group with pivotY 0.2533 and test again |
| T5 | SweepGradient zero angle and direction | lip lit at NW | rotate the stop list |
| T6 | `Reference` update order | no one-frame lag visible | inline expressions (default) |
| T7 | Overnight battery drain with the `[SECOND]` trail in an alpha-0 group | within 5 % of the current face | move the trail into a Condition on a 0/1 expression |
| T8 | Wrist check at 40 % brightness: plate bevel, dome lip and F2 lit sweep visible; Milky Way readable | stack reads | raise F2 and the lip by +15 % Y |
| T9 | Korean system locale: date shows `25 OCT / SUN` | English | 19-branch Condition (critic 2) |
| T10 | `TextCircular` direction for INFINITY | upright at 6 o'clock | 1-line PNG |
| T11 | `memory-footprint.jar --schema-version 4 --ambient-limit-mb 10 --apply-v1-offload-limitations` | ≤ 2 layers, 1 clock | reorder AOD nodes |

Other risks:

- **Moon behind the glass:** the moon culminates behind the plate glass 39 % of its up-time. It stays visible at 15 % as a glow under the glass. Accepted as a depth cue.
- **Daytime veil:** it compresses the Milky Way to 21 % Y in daylight; the 42 % cap stays.
- **The Classic's bezel:** the lit grey F2 against its physical black rotating bezel must be judged on the wrist (T8).
- **Stereographic look:** southern constellations look large and the northern ones small.

---

## 13. Change log vs v1

1. **Projection** changed from equidistant about C to **stereographic about P (225,114), k = 128**. The horizon is now an exact circle, (225,280.4) r 209.9, and the dome lip *is* the horizon. The black ground band (38 % of the aperture) became a 4.6 % north crescent under the dragon's wings.
2. **Pole** moved from under the digits to under the dragon's arch. The circumpolar cap is 0 % under the plate and 89.6 % clear of the dragon bed.
3. **Tonal plan rebuilt:**
   - lit opaline F2 (Y 3.5 to 25 %) and lit steps (31 to 52 %);
   - dome lip at 46 %;
   - bright grisaille Milky Way at 38 %, black ground with a 3.6 % NW glaze;
   - plate at 85 % black with an 18.8 % bevel;
   - boundary rule and table in section 3.
4. **Plate:** the ellipse rx 128 ry 50 became a **RoundRectangle 224 x 100, x 113 to 337, y 168 to 268, corner 18**. All digit corners sit in the 85 % core, and the date moved inside it.
5. **Hero:** the probe on the celestial equator, below the ground 16 h a day, became a **probe in the always-visible trench** (r 190.5). It is hidden for at most 36 min per sidereal day.
6. **Seconds:** the probe cage (subtle, and hidden half the day) became the **v4 seconds trail, starting at the probe**.
7. **Minutes:** the minute arc became an applied phosphor **minute pointer** on F2, because the arc would have run across the inscription for half of every hour.
8. **Sun pointer:** the mean sun (±4°) became the **true-sun RA (E6)**, giving apparent solar time. The 24 h ring is now 00 at the top and noon at the bottom, matching the chart.
9. **Zodiac:** removed the RA ring and the 8 px names. Twelve boundary ticks sit on the trench with the probe as ♈, and the sign is printed in gold on the date line.
10. **Dayglow** (SCREEN, a 55 % blob that could not wash out stars) became the **day key veil**: uniform, SRC_OVER, alpha driven by solar altitude, at most 42 %.
11. **Telemetry rows** became **two glass registers r 40**, and the **prompt line** became an **F2 inscription**. `KALI / ORBIT` and `SEC` were already gone.
12. **Moon:** a 450 x 450 PNG per phase (810 KB decoded each) on a ±10° rule became 22 px sprites in one positioned Group, with a Meeus-truncated position (≤ 6.5 px) and a self-consistent phase bucket.
13. **AOD stars:** the 590 KB bitmap became about 70 vector dots (0 B).
14. **AOD drift deleted.** Twelve AOD ticks moved to r 200 to 208, inside the 10 px edge band.
15. **Digits:** removed the invalid `Shadow`/`Outline` inside `TimeText`. Active is a plain DigitalClock; AOD is a **BitmapFont DigitalClock**.
16. **Schema fixes:**
    - `Compare` now references named boolean `Expression`s;
    - no `Variant` on shapes;
    - Part `x`/`y` are integers;
    - `&lt;` escapes;
    - `* 1.0 /` for steps;
    - `fps="30"` on the pointer Animation;
    - Group boxes contain their rotated content.
17. **Clock source:** `[YEAR]`/`[DAY_OF_YEAR]`/`[HOUR_0_23_MINUTE]` became **`[MINUTES_SINCE_EPOCH]`** (UTC), with constants re-derived and validated against Meeus.
18. **Reduced motion:** `Condition` on `[CONFIGURATION.*]` became a Scene `BooleanConfiguration` with `UserConfigurations`, plus `Editable=true`.
19. **Date localization:** `Localization locales="en_US"`.
20. **AOD lit share:** the estimated 4.6 % became a **measured** 8.1 to 8.7 % (non-zero), 4.4 to 4.6 % (> 24) and 0.54 to 0.59 % (mean Y).
21. **Wake timing** is now stated as fractions of a window that will be measured, not as milliseconds.

---

## 14. Rebuttals (critic claim → verdict → reason)

### Critic 1 (depth, 4/10)

| # | Claim | Verdict | Reason |
|---|---|---|---|
| R1.1 | No luminance for depth; shadows on 0 to 2 % Y are invisible (FATAL 1) | **Accepted** | Correct, and the root cause of "still flat". Rebuilt (section 3). |
| R1.2 | The metric: every occlusion edge needs at least 6 % ΔY | **Accepted in substance, rejected as the metric** | Linear ΔY penalises the dark end, where the eye works by ratio. The plate shadow on the glaze is only ΔY 3.2 % but ΔL\* 18.6, and a ratio of 8.7x. v2 requires a ≥ 15 % lit edge **and** a ratio ≥ 3:1 or ΔL\* ≥ 12. Both are listed per boundary. |
| R1.3 | The sky is 23 % in slivers; the circumpolar cap is under the plate (FATAL 2) | **Accepted** | v1's 36 % was measured before occlusion. v2: 37.3 % unobstructed (43.2 % with glass transmission), cap 0 % under the plate. |
| R1.4 | Sky must exceed 45 % of the dial | **Partly rejected** | It conflicts with the same critic's fix 1 (a lit flange annulus as the brightest non-text surface). v2 spends 34.6 % of the dial on that frame deliberately. The sky is still the largest surface and touches every object on all sides. |
| R1.5 | Remove the ground; the Galaxia has no horizon mask (FATAL 3) | **Accepted for the fill, rejected for the horizon** | The black band is gone. The real-Seoul concept needs rising and setting, so the horizon remains, as the lit dome lip itself (an exact stereographic circle) plus a 4.6 % crescent. |
| R1.6 | The composition is v4's grid (FATAL 4) | **Partly accepted** | Every v4 list item changed form or place (section 4). The digit coordinates and the dragon frame stay: the first is a hard constraint, and the dragon now carries the pole. |
| R1.7 | Fix 6: move BATTERY/STEPS to flange arcs and drop the labels | **Rejected in form** | It removes the numbers, which the brief defines as information. The registers keep 19 px values and gauge arcs. |
| R1.8 | The hero is underground (FATAL 5) | **Accepted** | The probe moved to the trench: hidden for at most 36 min per sidereal day. |
| R1.9 | Fix 4: merge the hero into the gold sun | **Rejected** | The phosphor probe keeps the KALI identity on the bright object. The sun keeps its single job. They ride side by side at the zodiac offset. |
| R1.10 | Collapse to one memorable thing; cut zodiac names, RA ring, extinction band and cage | **Accepted** | All cut. The one thing: the sky turns under the dragon, and the probe pulls the seconds. |
| R1.11 | SCREEN dayglow cannot wash out stars | **Accepted** | Correct algebra. Replaced by the SRC_OVER day key. |
| R1.12 | Variant symmetry is an assumption; moon Compare must be boolean; count the digit fill; `[SECOND]` sits inside an ambient-visible group | **Accepted (all)** | Sections 6.1, 9.3, 7 and 6.3. |

### Critic 2 (readability, 5/10)

| # | Claim | Verdict | Reason |
|---|---|---|---|
| R2.1 | The plate does not cover the digit corners | **Accepted** | RoundRectangle with the 85 % core over all four corners (section 4). |
| R2.2 | FATAL-1 values: sky base `#121E26` "about 11 %" | **Direction accepted, number rejected** | `#121E26` is Y 1.2 % (sRGB → linear). At that value it would still be black on the panel. v2 puts the light into the Milky Way (37.9 %), the glaze and the lit frame instead. |
| R2.3 | Dragon needs an engraving bed and a tight shadow (≤ 3 px blur, ≥ 75 %) | **Accepted** | 3 px bed at 85 %; shadow (+1,+2), blur 1.5, 85 %. |
| R2.4 | Delete the AOD drift; it breaks the fill-in-place signature | **Accepted** | Deleted. |
| R2.5 | AOD ticks sit in the 10 px clip band | **Accepted** | Moved to r 200 to 208. |
| R2.6 | Seconds must not vanish | **Accepted** | The trail starts at the always-visible probe. |
| R2.7 | Cap the dayglow at 30 % | **Superseded** | The blob is gone; the uniform veil is at most 42 %, and only in daylight. |
| R2.8 | The date sits on the feather and the extinction band | **Accepted** | Date inside the plate core at baseline 186. |
| R2.9 | `TimeText format="hh"`/`"mm"` are undocumented | **Rejected** | The v4 XSD pattern includes `(h{1,2})` and `m{1,2}`, as critics 1 and 3 confirm. |
| R2.10 | `[MONTH_S]` and `[DAY_OF_WEEK_S]` localise to Korean; use 19 Compare branches | **Problem accepted, method rejected** | `Localization locales="en_US"` falls back to the first listed locale when the system locale does not match (XSD text). One attribute instead of 19 branches; the branches stay as the T9 fallback. |
| R2.11 | Arc and Ellipse take no Variant; split ground and horizon | **Accepted** | Every twin is its own PartDraw. |
| R2.12 | AOD-entry ordering is unverified | **Accepted** | T1 plus the documented fallback (all offsets 0). |
| R2.13 | Report AOD by WO-P7 average brightness | **Accepted** | Three metrics, measured. |
| R2.14 | Keep the ground or horizon exactly as drawn (KEEP) | **Partly rejected** | The occluder is kept, but as the lip and crescent, not a black band (see R1.5). |
| R2.15 | Zodiac names to ticks | **Accepted** | Twelve ticks on the trench. |

### Critic 3 (feasibility, 5/10)

| # | Claim | Verdict | Reason |
|---|---|---|---|
| R3.1 | F1: shadows have nothing to fall on | **Accepted** | Section 3. |
| R3.2 | F2: the sky is about 75 % occluded; give it back | **Accepted** | 37.3 % open, pole and cap exposed. |
| R3.3 | Tighten the plate to 224 x 72 | **Accepted in width, height 100** | The date moved onto the plate, so it is taller. |
| R3.4 | Dragon to 0.8x | **Rejected** | With the pole under its arch, the cap shows through and below the openwork (89.6 % clear). The ink is only 1,586 px (1.0 % of the dial). The official mark at v4 scale stays the brand anchor. |
| R3.5 | Zodiac label riding on the sun pointer | **Modified** | An upright 11 px label on an 11 px ring either spills radially or turns upside-down at noon. The sign goes on the date line, in gold. |
| R3.6 | F3: `TimeText` cannot carry Shadow or Outline | **Accepted** | Verified in `timeText.xsd`. |
| R3.7 | Use PartText templates as the digits | **Rejected as primary** | DigitalClock is the element every ambient and offload model treats as a live clock. The outline survives through a BitmapFont, which `TimeText` does accept. PartText is fallback 1. |
| R3.8 | F4: milliseconds cannot be expressed; measure the window | **Accepted** | Section 6.1 and T1. |
| R3.9 | Ellipse x/y are floats; drop the ground PNG | **Accepted** | Extended: Part x/y are *integers*, and v1 broke that rule itself. |
| R3.10 | Moon PNGs decode at 450 x 450 | **Accepted** | 22 px sprites in a positioned Group. |
| R3.11 | Nest sidereal > sun_ra > moon groups | **Rejected** | The chart is eccentric and the moon's radius depends on its declination, so nesting removes no trigonometry. One positioned Group is shorter. |
| R3.12 | `sky_aod` as an alpha PNG with tint | **Superseded** | Vector dots, 0 B. |
| R3.13 | Escape `<`; force float division | **Accepted** | Done. |
| R3.14 | The studio over-promises | **Accepted** | Section 11. |
| R3.15 | The outline lit-pixel count was wrong | **Accepted** | Measured: 8.1 to 8.7 % non-zero. |
| R3.16 | `[HOUR_0_23_MINUTE]` offloadability | **Moot** | v2 uses `[MINUTES_SINCE_EPOCH]`. The tool's `contains("MINUTE")` test classifies it the same way. |

---

## 15. Why it is not flat

v4 was a list printed on black. v2 is a stack you can see through, lit from one side:

- **Frame:** a brushed grey flange catches the light. Below it, a black lacquer trench carries a phosphor probe that pulls the seconds trail. Inside that, a raised lip marks the real Seoul horizon.
- **Vault:** under the lip, a grisaille sky with a bright Milky Way turns about Polaris once per sidereal day. Polaris sits in the arch of the official Kali dragon. The circumpolar stars turn through the dragon's openwork, the moon rises out of the lip and slides behind the smoked-glass time plate, and the gold sun moves around the 24-hour ring and goes under the dragon's wing at midnight.
- **Glass and dragon:** the plate and the two registers float over the moving stars and cast shadows onto the Milky Way. The dragon sits in front of everything on a black engraving bed.
- **Clocks:** each level runs its own: seconds, minutes, civil hours, the apparent solar day, the sidereal day, the zodiac year and the lunar month.
- **Wake:** the sky lights first, then the flange swings 14° into place, then the glass and the dragon come forward by 2.5 to 3 %.

It is the Galaxia's logic, built only from WFF bitmaps rotated by expressions, vector rings, two DigitalClocks and one BitmapFont. It is still unmistakably KALI: phosphor dragon on top, a terminal cursor on the pole, and `kali@vault:~$ INFINITY` engraved on the flange.

---

## 16. Sources

- **v4 XSDs**, github.com/google/watchface `third_party/wff/specification/documents/4/` (local copy `scratchpad\wfref\xsd`, plus `watchface.xsd` fetched 2026-10-26): clock/timeText, clock/digitalClock, group/part/text/fontElement, decoration/abstractDecorationType, text/textCircularElement, bitmapFontsElement, common/conditionElement, variant/variantElements, attributes/geometricAttributes, transform/pivotType, animationElement, shape and style XSDs, localizationElement, userConfiguration/*, simpleTypes/sourceType and angleType, blendModeType, groupElement.
- **memory-footprint sources**, `play-validations/memory-footprint/src/main/java/.../memory/`: AmbientMemoryFootprintCalculator (`OFFLOADABLE_TIME_RELATED_DATA_SOURCES`, V1 two-clock cap, layer rule) and VariantConfigValue (`isNodeSkipped`).
- **developer.android.com/reference/wear-os/wff:** bitmap-fonts and group/part/text/bitmap-font (size and color semantics undocumented, hence T2); variant; transform/animation; part-image; part-draw; arc; ellipse; stroke; sweep-gradient; font; shadow; outline; blend-mode; source-type; arithmetic-expression; memory-usage; ambient; always-on (platform pixel shift, 10 px edge).
- **Astronomy oracle:** `KALIWATCH/studio/astro.js` (Meeus chapters 12, 25 and 47, truncated) and `KALIWATCH/studio/stars.js` (366 stars, 33 figures, Milky Way centreline).
- **Galaxia:** press.jaeger-lecoultre.com, Master Hybris Artistica Calibre 945, and the user-designated main-reference notes (`scratchpad\main-reference.md`): high-contrast grisaille, eccentric layering, two flange levels, one warm metal.
- **Evidence for this revision:** `C:\Users\k\AppData\Local\Temp\claude\C--Users-k-Documents-ChatGPT-------KALIWATCH--claude-worktrees-aod-dragon-watchface-personalization-000e96\5441be5b-8cd1-47aa-a6c9-28637c7aeb8f\scratchpad\calc\wffv2\` (`geom.py`, `geom2.py`, `astro_check.cjs`, `moon_vis.cjs`, `lum2.py`, `mock.py`, `mock_active_2008.png`, `mock_active_1008.png`, `mock_aod_1008.png`, `mock_aod_2008.png`, `mock_aod_0808.png`).
