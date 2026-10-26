# Codex handoff: G3 round 6, the engineered instrument pass

> **요약 (사용자용):** G3(토론 결론)를 메인으로 확정했습니다. 라운드 5에서는 왼쪽 초록 호 겹침과 유리판의 카드 느낌을 고쳤고, 계기판 레이어의 첫 단계(지평선 방위 눈금, LST·JD 텔레메트리, 서브디스크 눈금, 날짜 줄 위계, 프롬프트 커서)도 Roboto Mono로 넣었습니다(아래 §2, 구현·렌더 완료). 이 문서는 남은 작업을 Codex가 그대로 구현할 수 있도록 좌표, 크기, 색, 수식, 합격 기준까지 적은 사양입니다. 남은 작업은 공학적·계산과학적인 계기판 레이어, 1차원적이지 않은 서체·크기·배치 체계, 그리고 나머지 빌드입니다.

This document is the complete brief for the next round. Read it top to bottom before writing code. Everything here is a decision, not a suggestion. Where something is left to you, it says so.

## 0. Where things are

- Studio: `KALIWATCH/studio/`. It is plain browser JS, IIFE modules that set both `root.X` and `module.exports`. `studio/package.json` must stay `"type": "commonjs"`, because the parent `KALIWATCH/package.json` is `"type": "module"`.
- Composition: `vault5.js` (G3). `galaxia.js` (G1/G2) is kept for comparison only. Do not edit it.
- Spec of record: `docs/debate/07-final-spec-v2.md` (G3). Round-4 and round-5 deviations are in `docs/REFERENCES.md`. This file adds round 6.
- Commands (run from `studio/`):

```bash
npm run verify
```

That checks 72 renders against the spec's validation table and must print `all studio checks passed`.

```bash
npm run gates
```

That renders G3 with headless Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`) and measures G1, G2, G3, G8 and G9 with `python -I tools/gates.py`. It exits 1 on any FAIL.

```bash
PRESETS=vault5,galaxia STATES=M1,M2,M3,aod:M1,aod:M6 node tools/render-refs.cjs refs/round-6 r6
```

That renders a reference round with the named moments, plus the wake strip and the comparison sheets.

- Studio UI: `npm start`, then open http://127.0.0.1:4179 and pick "G3 Debate vault".
- Environment gotcha: Bash commands longer than about 8 KB are silently truncated. Write big patches as files.

## 1. Non-negotiables (from the user)

1. The official Kali dragon: path unchanged, never flipped, frame `G.dragon = [143.29, 23.35, 1.3085]`.
2. Phosphor green identity. **INFINITY**, never READY.
3. A big, fixed HH:MM. The digit ink box stays x 123–327, y 196.8–252.3 (gate G2 measures it).
4. Terminal DNA: the prompt `kali@vault:~$ INFINITY` on F2.
5. A quiet, cool AOD (lit share ≤ 9.5 %, nothing lit beyond r 220) and a stylish AOD → Active wake.
6. The user's round-6 words: the design must be **much more engineered and computing-scientific, with the cosmic feel, and the type, the sizes and the placement must never be one-dimensional**.
7. Main reference: the JLC Master Hybris Artistica Calibre 945 Galaxia product photo. Judge every render against its anatomy: eccentric plate, bright grisaille sky, painted spheres, guilloche 24 h ring, black month ring with a sun-star, one accent metal.

## 2. Already done in round 5 (do not redo)

All of this is in `vault5.js`, rendered in `refs/round-5/`, and logged in `REFERENCES.md`.

- **Material rule: phosphor marks what is alive.** The lip, the step, the F2 chamfer, the sub-disc lip, the F2 batons and the horizon bead are now steel (`STEEL_WALL`, tokens `steelHi #D5DCDF`, `steel #9AA6AB`, `steelMid #6B777C`, `steelLo #3A4448`, `steelFoot #161B1F`). Phosphor is used only on the dragon, the colon, the rotor, the seconds-trail tip, the gauges, the graticule, Draco and INFINITY.
- **Lip** = the aperture's inner chamfer, lit at 135°, so it is dark on the dragon's NW flank and catches light at the SE.
- **Horizon bead** = polished steel. It tapers in width and brightness over the last 16° (about H) into each horn, so it no longer forks into the lip.
- **Seconds trail** = a 1.2 px `deep #3C6328` track from the rotor plus a 5° bright `#A6F46A` head and a 1.3 px `hi` tip dot at E3 + 3.7 + 6·s.
- **Instrument layer, first pass** (Roboto Mono, so the tiers differ by size, weight and colour only until Task A swaps the family):
  - `instrument` layer (Active only, wake [40, 240]). It draws the horizon azimuth scale from `horizonPt(A)` (§4.1, exported on `VaultV5`), the labels `E`, `W`, `126.98E` and `37.57N`, and the telemetry `LST hh:mm  JD nnnnnnn.nn` on r 171 about C from 200° to 144°. DEC was dropped: the full line does not fit clear of the sub-disc at 7.5 px.
  - The date line is `16 APR` (paper) + `FRI` (transfer) + `ARI` (steel) + the sun's degree in the sign raised at 8 px, at 15 px on a field grid.
  - The sub-disc has battery and steps ticks, `STEPS` and `BAT` arc labels about Q, steps 20 px, the goal `/10,000` 7.5 px, and the battery 15 px with a small raised `%`. AOD uses the same battery position.
  - The prompt has a phosphor `_` cursor that shows on even seconds (it is held invisible in AOD so the line stays centred the same).
  - The wake artefact (§5.1) is fixed: `globe-aod` and `subdisc-aod` now fade out over [0, 160].
- **Plate** = a slice of a smoked-sapphire disc concentric with the dial: ends are arcs of r 115 about C, the top is the old arch (circle (225,1376.5) r 1212.5), and the bottom is straight at y 264. Corners (125.0,168.1), (325.0,168.1), (333.2,264), (116.8,264). There is no uniform outline. The edge is a 1.3 px facet coloured by its outward normal against the 315° key, with an internal reflection 2.2 px inside the SE edges and a 5 % sheen across the NW corner. The shadow is (+2.2,+2.2), blur 2, black 50 %. `plate-aod` uses the same path.

## 3. Task A: the type system (five tiers, five frames)

The round-5 face uses one family (Roboto Mono) at 11, 13, 17, 22 and 78 px, all horizontal or on circles about C. That is the "one-dimensional" type the user rejected. Replace it with the system below.

### 3.1 Family

- Primary: **Martian Mono** (Evil Martians, SIL OFL 1.1, Google Fonts). It is a variable font with axes `wdth` 75–112.5 and `wght` 100–800. Before using it, download it from Google Fonts or the upstream GitHub repo, keep `OFL.txt` next to it in `studio/fonts/`, and confirm both axes exist. If either is missing, stop and use IBM Plex Mono (OFL) with its Condensed sibling IBM Plex Sans Condensed for T4, and note the substitution.
- WFF needs static instances (spec 07 §5.2). Cut four static TTFs with `fonttools varLib.instancer` (Python, `python -I`), named exactly:

| File | wdth | wght | Used by |
|---|---|---|---|
| `MartianMono-Wide-SemiBold.ttf` | 112.5 | 600 | T0 |
| `MartianMono-Std-Medium.ttf` | 100 | 500 | T1, T2 |
| `MartianMono-Std-Regular.ttf` | 100 | 400 | T5 |
| `MartianMono-Cond-Regular.ttf` | 75 | 400 | T3, T4 |

- In the studio, load them as four `@font-face` rules (`OrbitWide`, `OrbitStd` 400/500, `OrbitCond`) in `studio.css`, and embed them in `face.js` the same way `fontData` is embedded today, so the headless renders use them. Keep `font-variant-numeric: tabular-nums` everywhere.

### 3.2 Tiers

Every `<text>` the build emits must carry `data-tier` and `data-frame` attributes (see the gate in §6).

| Tier | Role | Face | Size (design px) | Tracking | Colour | Frame |
|---|---|---|---|---|---|---|
| T0 | HH:MM | Wide-SemiBold | fit (below) | 0 | `paper #EFF8EC`, colon `ph #A6F46A` | screen |
| T1 | date and sign line | Std-Medium | 15 | +0.06 em | fields below | screen |
| T2 | instrument numerals: 24 h ring, sub-disc values | Std-Medium | 13 (ring), 20 (steps), 15 (battery) | 0 | `paper` | C, Q |
| T3 | names and months | Cond-Regular | 10.5 | +0.12 em | `transfer #B9C5CA` @80 % (names), `month #C8D1D5` @85 % (months) | P (sky), C (F1) |
| T4 | engraving and telemetry | Cond-Regular | 7.5 | +0.08 em | `steel #9AA6AB` @75 %, or `transfer` @70 % for telemetry | H, C, Q |
| T5 | prompt | Std-Regular | 11.5 | +0.02 em | `transfer`, INFINITY in `ph` | C (F2) |

**T0 fit.** Keep the centres `G.digits` (hx 166, cx 225, mx 284, baseline 252.3). Choose the font size so that the cap height is exactly 55.5 px, which fills the G2 box height. Then measure the HH ink width with `getBBox()` in Chrome. If HH is wider than 94 px, step `wdth` down in 2.5 steps (112.5 → 110 → 107.5 …) and re-cut the instance until HH ≤ 94 px and the colon clears both pairs by ≥ 6 px. Record the final wdth and size in `REFERENCES.md`.

**T1 fields.** The line keeps baseline 185.6 and is laid out on a monospace grid, not with ` / ` separators:
- `16 APR` in `paper`;
- two-character gap, then `FRI` in `transfer`;
- two-character gap, then `ARI` in `steel`, followed by the sun's ecliptic longitude within the sign as `26°`. That is `floor(λ☉ mod 30)`, zero-padded to two digits and set in T4 size, raised so that its cap top aligns with the T1 cap top.
- The whole line is centred at x 225 and must fit between x 140 and x 310.

**T2 sub-disc.**
- Steps: the value is 20 px `paper` at (149, 333.5). Under it is `/8,000` (the goal) in T4 `steel` at baseline 344.
- Battery: the value is 15 px `paper` at baseline 360, followed by `%` in T4 raised. When battery ≤ 15, the number turns `warning #F3C479`.
- Remove the `STP` label. The arc labels in §4.3 replace it.

### 3.3 Frames (why it is not one-dimensional)

Each tier lives in its own geometric frame, so the eye reads layered instruments rather than a flat UI:

| Frame | Centre | What sits on it |
|---|---|---|
| screen | none (horizontal) | T0, T1 |
| C | dial centre (225,225) | the 24 h numerals (T2), months on F1 (T3), the prompt (T5), the telemetry (T4) |
| P | the pole (225,114), rotating by −LST | constellation names (T3, upright) |
| H | the horizon centre (225,280.4) | horizon engraving and azimuth scale (T4) |
| Q | the sub-disc centre (149,333) | sub-disc arc labels (T4), values (T2) |

Text on circles is set on paths (`textPath` in the studio, `TextCircular` in WFF). Text on the bottom half of a circle runs counter-clockwise, so the glyph tops face the centre. Text on the top half runs clockwise.

## 4. Task B: the engineered instrument layer

Sections 4.1 to 4.4 are built in round 5 (see §2). Your job here is to tag them for G10, move them to the Task A faces, add the `verify.cjs` assertions named below, and pass G11. Change a coordinate only if a gate or the render demands it, and log the change.

Every number below is computed live from the existing astronomy (`astro.js`, `solar()`, `ctx.sky.lst`). Nothing is decorative fake data.

### 4.1 Horizon azimuth scale (frame H)

The horizon is fixed on the dial. A point at altitude 0 and azimuth A (from north, through east) maps to the dial as follows, with φ = 37.5665° (Seoul):

```
sin δ = cos φ · cos A
HA    = atan2(−sin A, −sin φ · cos A)            // hour angle, degrees
r     = 128 · tan((90 − δ) / 2)
θ     = 180 − HA                                  // clock angle about P
x     = 225 + r · sin θ,   y = 114 − r · cos θ
```

Check values: A = 0 gives (225, 70.5), the top of the horizon circle. A = 90 (E) gives (97.0, 114.0). A = 270 (W) gives (353.0, 114.0). Each must lie within 0.2 px of the circle about H of r 209.9. Add these three as `verify.cjs` assertions.

Draw, for every A in steps of 5° whose point is inside r 179 about C and not under the dragon mask:
- a tick pointing into the sky along the inward normal toward H: 2 px long (every 5°), 3.5 px (every 10°), 5 px (every 30°);
- 0.8 px, `steel` @60 %.

Labels, all T4 `steel` @75 % on a circle about H at r 201.5 (sky side), centred on their azimuth:
- `E` at A 90 and `W` at A 270.
- The site, set between E and the left horn: `126.98E`.
- The latitude, set between W and the right horn: `37.57N`.

These marks are camera-locked (the horizon does not rotate). In AOD they are hidden (they are Active-only detail).

### 4.2 Telemetry line (frame C, sky side of the lip)

- Path: a circle about C at r 171, from clock 200° to 144° (as built), counter-clockwise (glyph tops toward C). It must stay clear of the sub-disc, which covers 197.7°–232.5° at that radius.
- Content, re-evaluated each minute, monospace, exactly this form:

```
LST 08:42  JD 2461512.46
```

  Add `DEC+10.2` back only if, after the Task A condensed face, the whole line fits between 146° and 196°.

  - LST is local sidereal time in hours and minutes from `ctx.sky.lst / 15`.
  - JD is the Julian date to two decimals, from `A.toJD(date)`.
  - DEC, if it fits, is the sun's declination with sign, one decimal (`solar().dsun`).
- Style: T4, `transfer` @70 %, with a halo (`paint-order: stroke`, stroke `#0B0E10` @60 %, 1.6 px) so it stays readable where the Milky Way core passes under it.
- WFF: `TextCircular` about (225,225), with `startAngle` 194 and `endAngle` 146, direction `COUNTER_CLOCKWISE`. JD comes from `[UTC_TIMESTAMP]`, or from `SECONDS_SINCE_EPOCH / 86400 + 2440587.5`. LST comes from the existing `ref_lst` carrier. Hidden in AOD.

### 4.3 Sub-disc scales (frame Q)

- Battery track (r 44): ticks every 10 % at r 47–49 (0.8 px `steel` @60 %), and every 50 % at r 47–50.5 (1.1 px).
- Steps track (r 39.5): ticks every 10 % of the goal at r 35–36.8 (0.8 px `steel` @45 %).
- Arc labels, T4 `steel` @75 %:
  - `STEPS` on a circle about Q at r 51.5, centred on the sub-disc's top (clock 0° about Q), clockwise.
  - `BAT` on the same circle, centred at clock 90° about Q (the side facing the dial centre), clockwise.
  - Both must stay inside r 179 about C. Check this with the mask.

### 4.4 Prompt cursor (frame C)

After INFINITY, add a block cursor: a 5 × 9 px `ph` rect, 2 px after the last glyph, on the prompt baseline. In Active it blinks at 1 Hz (visible for even `[SECOND]`). It is absent in AOD.

### 4.5 Not to add

Do not add these. They were considered and rejected:
- Scales on the plate: they would break G2 calm under the digits.
- Declination labels on the meridian: they collide with the date and the dragon.
- RA ticks on the lip: the lip is about C but the sky turns about P, so they would lie.

## 5. Task C: the rest of the build (spec 07 references)

Do these after A and B pass, in this order:

1. **Wake artefact (done in round 5; keep the gate).** During wake, the black AOD footprints `globe-aod` and `subdisc-aod` show as black discs for about 100 ms. Give both a wake window that fades them 1 → 0 over [0, 160] (wake ms, mirrored and halved on sleep like the rest of `timeline()`). Gate: in the wake strip at t = 100 ms, no pixel inside either footprint may be more than 10 L* darker than the open-sky median of that frame.
2. **BSC5 faint stars** (07 §4.3). Replace the 590 seeded dust specks with the Yale Bright Star Catalogue, 5th edition, magnitudes 4.5–6.0, precessed with `precess()`, in tone `faintHi #7C888E`. G1 and G9 must still pass. Note the catalogue source and licence in `docs/`.
3. **`wff-expr.js` and Reference carriers** (07 §4.9). Make the studio evaluate the exact WFF expression strings, so the studio and the watch cannot drift.
4. **Bakes and `gen-wff.cjs`** (07 §4.6 and §9). Assets RGBA8888, device scale 1.0667.
5. **Gates G5–G7** (07 §8.4).
6. **Gyro parallax and the calm/still motion options** (07 §6.5–6.6).
7. **Device tests T1–T24** (07 §9.5) on the SM-R965N. See `wff/` and the build notes. T1, T2, T9 and T15 come first, on a small probe face.

## 6. New gates (add to `verify.cjs` and `gates.py`)

- **G10 type inventory (verify).** Every `<text>` in every build has `data-tier` ∈ {T0…T5} and `data-frame` ∈ {screen, C, P, H, Q}. Each tier's font family, size and tracking match §3.2 exactly. The Active build must use all five frames and all six tiers. It fails on any missing attribute.
- **G11 micro legibility (gates).** For each T4 element at M1 and M2, the median L\* of its glyph pixels minus the median L\* of a 2 px ring around its bounding box must be ≥ 25. Render a second pass with `hide` set to everything except that text to get its glyph mask.
- **G12 phosphor budget (gates).** At M1, among pixels with hue 75°–110° and chroma > 25 (phosphor), at least 45 % must lie inside the dragon's mask dilated by 3 px. This keeps the dragon the hero.
- The existing G1, G2, G3, G8 and G9 must still pass with the round-5 thresholds.

## 7. Workflow and acceptance

1. Implement A, then B. After each, run `npm run verify` and `npm run gates`, then render `refs/round-6/` with the command in §0.
2. Look at `r6-vault5-M1.png`, `r6-compare-M1.png` and the wake strip next to the Galaxia photo. Fix anything that reads as a UI card, a HUD panel or a flat label.
3. Append a "Round 6" section to `docs/REFERENCES.md`: what changed, gate table, deviations from this file, and what is still not built.
4. Commit on a branch with a message that says what changed and why. Do not push to `main` without the owner's approval.

**Done means** all of the following:
- verify and every gate (G1, G2, G3, G8, G9, G10, G11, G12) pass;
- round 6 is rendered;
- REFERENCES.md is updated;
- the face shows five text frames and six tiers;
- the horizon scale, the telemetry and the sub-disc scales display real computed values that match `verify.cjs`.
