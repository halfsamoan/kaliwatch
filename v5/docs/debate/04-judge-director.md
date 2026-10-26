# KALIWATCH v5: how the seven v2 proposals rank (design director)

I judged against the main reference (`main-reference.md`) first and the brief second. My lens: one memorable idea, everything else disciplined. I penalise pastiche, clutter, HUD tropes and anything that competes with reading HH:MM.

## 0. Verdict

**The winner is the WFF proposal, with six grafts and five conditions.** Its skeleton matches the main reference better than any other:
- It has the only sky that is actually bright grisaille.
- It has the only pair of flange levels that read as two levels: a grey radial-hairline ring over a black lacquer ring.
- Its structure uses the exact anodised-phosphor triplet.
- The pole sits under the dragon's arch.
- It is the only XML that survives the v4 schema.

Its picture is the weak part. In `calc/wffv2/mock_active_2008.png` a rounded card, two mirrored widget rings and a blank grey bezel read as a stock Wear OS layout. The grafts and conditions below fix that without touching the skeleton.

**The merged face's one memorable idea:** the official Kali dragon arches over Polaris while the real Draco turns beneath it, once per sidereal day. Everything else is instrument.

## 1. Scorecard against the main reference

| Rank | Proposal | Eccentric layering | Bright grisaille | Two flange levels | One accent metal | Restraint | Valid v4 XML |
|---|---|---|---|---|---|---|---|
| 1 | wff | partial: pole under the dragon arch; registers off-centre but raised and mirrored | yes: Milky Way core Y 37.9 %, 33 figures; no names, no spheres | yes: grey F2 over black F1; no numerals, no months | yes: phosphor-metal triplet; the gold `SCO` text is a slip | partial: card, two widget rings, minute pointer, day veil | yes |
| 2 | material | no (only the lighting is off-centre) | partial: dome L* 3–51, Milky Way 3–22 %, shaded moon; no names | yes: two stepped gunmetal flanges plus a bevel; no numerals | no: gunmetal structure; gold ecliptic dots and copper flecks | yes: one hero, at least 68 % open sky, no plate | no: Shadow/Outline inside TimeText |
| 3 | horologist | partial: horizon curve plus a Ø30 sunken porthole | partial: ground L* 29 → 10, Milky Way ≤ 25 %, 6 names; no spheres | no: 7 px strips at L* 15 and 20 | partial: phosphor indexes; gold zodiac ticks | no: six objects in r 171–216; Gyro | yes (BitmapFont AOD; shadow from a second TimeText) |
| 4 | astronomer | partial: off-centre pole only | no: base 0.71 %, Milky Way ≤ 5.4 %, no names | partial: F1 24 h ring with 06/12/18, plus F2 and F3 | partial: gold ecliptic | partial: plate covers 46.6 % of the window; daylight tint | no: Outline on the ambient DigitalClock |
| 5 | legibility | partial: pole inside the disc; chord well | no: base 0.2 %, Milky Way 5.9 % | no: one flange plus a lip | yes | partial: rectangular plate plus well; AOD drift | no: Outline inside TimeText |
| 6 | motion | partial: horizon circle | no: teal Milky Way `#2F5146` | no: one alloy flange | no: gold hero glow; gold battery value | no: `SUN SCO MOON 15D` readout | yes (PartText outline) |
| 7 | kali | partial: horizon figure/ground | no: slate 1–5 %, grisaille dropped on purpose | no | no: ABYSS TEAL | no: `SEC · LST` line; AOD walk on by default | no: Outline inside TimeText (primary route) |

## 2. Ranking

1. **wff.** It hits four of the five reference cues, and it is the only buildable one: AOD measured at 8.1–8.7 %, memory about 3.8 / 1.3 MB. The cues it hits:
   - bright grisaille (Milky Way `#9AA8AE`, Y 37.9 %);
   - two flange levels;
   - the `#D2FFA4` / `#A6F46A` / `#4E7F34` metal on all structure;
   - the circumpolar sky turning through the official mark.

   It is also the only one that read the TimeText schema correctly, so its BitmapFont AOD digits are the one valid outline route. It loses points on picture (section 3 fixes that).

2. **material.** The most restrained composition and the best material:
   - one shaded sphere as the hero;
   - a dome exposed from L* 3 to 51 under one directional light;
   - at least 68 % open sky, and no plate.

   Against it: nothing is eccentric, the structure is gunmetal rather than phosphor metal, and the 24 h scale has no numerals. Its legibility depends on Font decorations that the v4 TimeText does not accept.

3. **horologist.** The most rigorous proposal. It is the only one with a sunken off-centre sub-disc, and it has real constellation names. Its Seoul horizon, which turns the lower third into black lacquer, is a strong organising idea. Against it:
   - The two flanges are 7 px strips five L* apart, which will not read as two levels at 40 mm.
   - The sky is mid-grey with weak brushwork and no spheres.
   - The band from r 171 to 216 stacks a cage, a carriage, the sun, a zodiac band, a minute arc, a moat and a rim light. That is too much in the narrowest real estate.
   - The Gyro parallax is a gimmick.

4. **astronomer.** It has the best single idea on the panel: Draco in phosphor turning under the official dragon. It also has a real 24 h ring with numerals and a gold sun in its own groove. Against it:
   - The sky is a dim r 150 window.
   - A 242 × 136 plate covers 46.6 % of that window.
   - It adds a blue daylight tint.
   - The prompt is pushed onto the bezel.
   - Its ambient Outline digits are invalid.

5. **legibility.** It has the safest information layout and a good verification plan, and its pole sits inside the disc. Against it:
   - It is the dimmest sky on the panel.
   - It has one flange.
   - Its geometry is rectilinear: a rectangular plate and a chord-cut well.
   - Its 2 px AOD drift moves the digits.
   - Its TimeText Outline is invalid.

6. **motion.** It has the best-specified wake and a valid PartText outline route. Against it:
   - It makes gold the hero (a 64 px glow, plus a gold battery value), against the one-metal rule.
   - It tints the Milky Way teal.
   - It has one flange.
   - It adds a readout line that competes with the time.

7. **kali.** Good brand instincts, but the furthest from the reference:
   - It drops grisaille on purpose and adds a teal hue.
   - Its sky stays at 1–5 % slate.
   - It clips the official dragon at r 190.
   - It adds a `SEC · LST` status line.
   - It turns on, by default, a 1 px AOD walk that moves HH:MM. That breaks a hard constraint.

## 3. Grafts into WFF (one per non-winning proposal)

1. **Material §1.3, the moon as the one painted sphere** (into WFF z2).
   - Five baked phase sprites shaded as a ball: lit limb `#F4F1E6`, body `#E6E1D2` falling to `#CFC9B8` at the terminator.
   - Dark side `#1E232A` at 92 %, so it hides stars behind it.
   - A 6 px halo on the lit side only, at 25 %.
   - Drawn **under** `dome_light`, so it takes the glaze like the stars.
   - Enlarged from 22 px to a Ø40 disc (44 px sprite). The dome lip then visibly cuts it when it rises or sets, and the plate edge cuts it as it transits: this is the reference's "sphere cut by a ring edge", done honestly.
   - The lit-limb angle comes from the moon-to-sun direction in WFF's chart (the E8/E15 chain), not from Material's tangential constant.

2. **Horologist §2 z11, the sunken porthole construction** (into WFF z12). Construction: a 2–3 px `#000` recess shadow on the upper-left inner wall and a 1.5 px lit lip on the lower-right, from the same 10:30 light.
   - Use it for **one** off-centre sunken sub-disc. It replaces WFF's two mirrored raised registers.
   - Position: centre (168,326), r 50. Its outer edge is at r 166 from C, and it sits 8 px below the plate.
   - Floor: black with radial hairlines. Rim: 1.5 px phosphor metal.
   - Gauges: battery arc at r 46 and steps arc at r 43, both 1.8 px `#A6F46A` on `#17291D`.
   - Values: 18 px `#EFF8EC`, centred on x 168, at baselines 318 (`78%`) and 344 (`6,240`). No labels.
   - The lower-right sky stays open.

   This gives the reference its eccentric sunken sub-disc and breaks the dual-complication symmetry.

3. **Astronomer §5, Draco in phosphor under the dragon** (into the WFF z1 sky bake).
   - The 14-star figure as 1.2 px `#A6F46A` lines at 55 %.
   - Eltanin and Rastaban as 2.6 px phosphor points. No label.
   - In WFF's stereographic chart Draco lies within about r 50 of the pole P (225,114), so it winds through the circumpolar cap and the dragon's openwork.
   - It is the face's memorable idea, and the only colour allowed on the grisaille.

4. **Motion §5.1, the counter-rotating wake** (into WFF §6.1).
   - Wrap the active sky in its own Group carrying `Variant mode=AMBIENT target=angle value=3 angleDirection=COUNTER_CLOCKWISE`, so it settles from +3° to 0 against the sky's own sense.
   - At the same time F2 settles from −14° to 0 clockwise.
   - Every spatial Variant (angle or scale) lives only on Active-only nodes. `sky_aod` moves to a sibling Group that carries the same LST Transform and no angle Variant, so the AOD sky is never displaced.

5. **Legibility Appendix C, items 3 and 4, as merge acceptance gates.**
   - (a) Downscale the Active render to 150 px (40 mm). Its luminance histogram must show one separate mode per plane, and every lit edge must be at least 12 %.
   - (b) Check every information string at worst case: 99,999 steps, 100 %, 23:58 and the widest date. Far corners must stay within r 171 of C and at least 1.5 px inside the r 43 steps arc of the new sub-disc.
   - Nothing ships on demo values.

6. **KALI §1.2, Saturn and Jupiter as small painted spheres** (into the WFF z1 bake, regenerated yearly).
   - Saturn at its 2026 position (RA 1h35m, dec +6.5): 11 px body plus a 26 × 7 ring.
   - Jupiter at RA 9h20m, dec +16.5: 7 px with two bands.
   - Central highlight only, with no directional shading, because they rotate.
   - These are the reference's painted planets, placed truthfully and kept small so the moon stays the one large sphere.

## 4. What must not survive

1. **Any hand-made movement of the digits.** This covers KALI's 1 px walk every 10 minutes in AOD and Legibility's 2 px hourly drift circle. HH:MM never moves. Burn-in protection comes from the OS pixel shift and the sky's own drift.
2. **Font decorations inside TimeText.** This covers Material's Active Shadow + Outline, and the ambient Outline digits in Material, KALI, Legibility and Astronomer.
   - The local v4 `clock__timeText.xsd` gives TimeText's `Font` attributes only, with no children.
   - Valid routes are WFF's BitmapFont for the AOD outline, and a second offset TimeText or a baked BitmapFont for any Active shadow.
3. **WFF's two mirrored raised registers** at (146,320) and (304,320). They read as stock complications. Graft 2 replaces them.
4. **WFF's F2 minute pointer.** It duplicates HH:MM, runs over the inscription for six minutes in every hour, and is HUD furniture on a flange.
5. **WFF's day-key veil** (`#2E4A5A`, up to 42 %) **and Astronomer's daylight ellipse** (`#6C8294`).
   - Both add a blue cast that the monochrome reference does not allow.
   - The veil drops the Milky Way from 37.9 % to 20.8 % Y in daylight, which is when the face is read most.
   - Day and night are the sun's job.
6. **Gold anywhere except the sun.** That removes:
   - WFF's gold `SCO` (the date returns to `25 OCT / SUN` in `#9BAB9C`);
   - Horologist's gold zodiac ticks;
   - Material's gold ecliptic dots and copper flecks;
   - Astronomer's gold ecliptic and day arc;
   - Motion's 64 px sun glow and gold battery value.

   Gold means the Ø9 sun disc and a glow of at most 6 px. The amber `#F3C479` low-battery warning stays as a state colour.
7. **Extra hues:** KALI's ABYSS TEAL `#163A3C` and Motion's teal vault and Milky Way.
8. **Readout lines that compete with the time:** KALI's `SEC 24 · LST 11:50`, Motion's `SUN SCO  MOON 15D`, and v4's `SEC 24`.
9. **HUD and gimmick layers:**
   - Material's phosphor RA/dec graticule with radar-scope spokes;
   - Horologist's Gyro tilt parallax (undocumented units, a power cost, and a wallpaper effect);
   - Horologist's three-arm carriage turning 6° a second, which would be a second bright moving object beside the probe.
10. **Edits to the dragon:** KALI's pre-clip at r 190, which cuts the official silhouette, and Horologist's shrink to 140 × 104. The dragon stays at the v4 frame, (135,24) 180 × 123, on top of everything, on WFF's engraving bed.

## 5. Conditions for the merge (gaps no proposal closed)

1. **F2 becomes the reference's grey 24 h flange.**
   - Keep WFF's radial-hairline opaline F2 (r 211–225).
   - Bake into `flange_f2.png` the even-hour numerals `02 04 06 08 10 14 16 18 20 22`, 11 px, transferred white `#B9C5CA`, centred on r 218.
   - Leave out `00` (under the dragon's wings) and `12` (where `kali@vault:~$ INFINITY` sits at 6 o'clock).
   - Put 12 phosphor-metal batons, 2.4 × 8 px, at the odd hours.
   - The 60 minute ticks and 11 indices leave F2, because the digits own the minutes.
   - The orientation stays WFF's: 00 at the top, 06 left, 12 bottom, 18 right.
2. **F1 and the trench merge into one black-lacquer calendar ring (r 185–209)** on the sidereally rotating probe Group.
   - The 12 zodiac ticks become 12 three-letter month names (9–10 px, `#B9C5CA`, decoration class) centred on r 195. Each sits at the sun's RA on the 1st of its month, with a 1 px rule between months.
   - The Ø9 gold sun star rides at r 204, and its place among the names is the month. This is the Galaxia mechanism, and it retires the separate zodiac text.
   - The probe stays the one bright moving object. It sits on the inner edge at r 188, in the gap between MAR and APR (the vernal point), and still pulls the seconds trail along r 188, clear of the names.
3. **The grisaille has to be as bright as WFF wrote it.**
   - The Milky Way core must read as white brushwork in the 150 px thumbnail. The current mock under-delivers it.
   - Add six transferred constellation names (URSA MAJOR, CASSIOPEIA, CYGNUS, ORION, LEO, LYRA), 11 px `#B9C5CA` at 55 %. When they turn under the glass, that is occlusion, not a fault.
4. **The plate stays, and must read as glass rather than a card.**
   - It is the calm zone the reference permits; keep its 85 % core.
   - Delete the 1 px black bottom and right lip.
   - Keep the top-left bevel and the (+3,+4) shadow, which now lands on the sub-disc rim.
   - Nothing else on the face is a rounded rectangle.
5. **Bezel.** Measure the SM-R965N's visible radius before committing the F2 numerals and the inscription (r 211–225). If the bezel lip covers r > 216, scale the F2 group to 0.975 about C; do not thin the numerals.

AOD for the merge follows WFF §7. Changes: the sub-disc keeps a 1 px rim plus `78%` at 17 px `#7F9472`; the month names, numerals, planets and Draco are hidden. Re-measure the lit share on the raster.

## 6. Evidence checked for this judgement

- Read: `brief.md`, `main-reference.md`, and v4 `face.js`, `celestial.js`, `tokens.js` and `DESIGN-SYSTEM.md`.
- Viewed: `preview-active.png`, `preview-ambient.png`, the on-watch `watchface.xml`, WFF's `mock_active_2008.png`, `mock_active_1008.png` and `mock_aod_2008.png`, and the earlier `refs-r3/r3-galaxia-night.png` translation of the main reference.
- Schema (local v4 XSDs in `scratchpad/wfref/xsd`):
  - `clock__timeText.xsd`: TimeText's `Font` has attributes only and no decoration children; `BitmapFont` is allowed.
  - The `timeFormatType` pattern accepts `hh`, `mm` and the `hh_10` / `hh_1` cells.
  - `common__transform__gyroElements.xsd`: Gyro exists in v4. It is legal; it is rejected here on taste and power.
