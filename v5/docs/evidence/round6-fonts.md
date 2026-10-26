# Round 6: Martian Mono provenance and measured T0 fit

## Source and licence

The original font is the official Google Fonts distribution of Evil Martians'
Martian Mono, pinned to the last font-directory commit inspected for this build:

- Repository: <https://github.com/google/fonts/tree/c8bba5c4a69195e4fabc69d75136814c65fe0cf5/ofl/martianmono>
- Variable TTF: <https://raw.githubusercontent.com/google/fonts/c8bba5c4a69195e4fabc69d75136814c65fe0cf5/ofl/martianmono/MartianMono%5Bwdth,wght%5D.ttf>
- Original licence: <https://raw.githubusercontent.com/google/fonts/c8bba5c4a69195e4fabc69d75136814c65fe0cf5/ofl/martianmono/OFL.txt>
- Upstream authors: <https://github.com/evilmartians/mono>

`fonts/MartianMono-VF.ttf` is the unmodified 148,460-byte source; its SHA-256 is
`c3467843ec1c2574b05fbcfd7147c7bfbcf63ddca8fc2bcb9d117f1bfb1b22e7`.
Its actual `fvar` axes are `wght` 100–800 (default 400), and `wdth` 75–112.5
(default 112.5). Both required axes exist, so the IBM fallback is unnecessary.

`fonts/MartianMono-OFL.txt` is the original SIL Open Font License 1.1, copyright
2021 The Martian Mono Project Authors, stored beside the font. Its SHA-256 is
`ddafd2c3f37ef1d83ef284ca63e159befd3820850c5e9eded14ca52eee92c256`.
The pre-existing `fonts/OFL.txt` belongs to Roboto Mono and is preserved.

## Static assets and reproducibility

The four deliverable instances are fully pinned: none retains an `fvar` table.
The first retains the requested filename while the measured width replaces the
initial 112.5 coordinate, as permitted by the handoff's decrement procedure.

| File | CSS family | Weight | Actual wdth | Bytes | SHA-256 |
|---|---|---:|---:|---:|---|
| MartianMono-Wide-SemiBold.ttf | OrbitWide | 600 | 92.5 | 49,316 | `39537650ba15369337ddfbafd7b6088f3bca5e10225e222eff3a81a04fb29404` |
| MartianMono-Std-Medium.ttf | OrbitStd | 500 | 100 | 49,328 | `5389939ea3986263d4ca86c4574013113974d7b771137a434c8398a4e3fc155e` |
| MartianMono-Std-Regular.ttf | OrbitStd | 400 | 100 | 49,308 | `d8d918f72ec30982742bab94f47acac9e86254e2e418e2e4e706273ade88685a` |
| MartianMono-Cond-Regular.ttf | OrbitCond | 400 | 75 | 49,100 | `d3f815ba357ac40382af2df8bf3b8723d63394c58a79fbe04b2d47e69f7c8879` |

From `v5/`, run:

```sh
python3 -I tools/build-fonts.py
python3 -I tools/build-fonts.py --measure
```

The recorded environment is Python 3 with FontTools 4.61.1 and Google Chrome
156.0.8078.47 at `/usr/bin/google-chrome`. The script uses
`fontTools.varLib.instancer.instantiateVariableFont`, preserves font timestamps,
checks the source checksum and axes, and reloads the saved static font before
measuring it. Reloading matters: fractional interpolation coordinates become
integer TTF outlines when saved. A second rebuild produced identical bytes for
all four static TTFs and `orbit-fonts.js`.

## Chrome measurement method

The measurement waits for `document.fonts.ready`, then measures both SVG text
and exact glyph outlines with Chrome `getBBox()`. The outlines are reconstructed
from each **saved TTF** with FontTools' `SVGPathPen`, laid out using that font's
actual advances, and transformed by the SVG text anchor and font size. This
separates actual ink from font line metrics without relying on screenshot
thresholds or a guessed monospace advance.

SVG text `getBBox()` is not an ink bound. For example, final-width `08` has a
Chrome text box 88.953125 × 79 px at size 66.38755980861244, while its actual
digit ink is at most 84.245809 × 55.499997 px. The 79 px text height includes
font ascent/descent metrics. Applying the 55.5 px ink requirement directly to
the text box would shrink the design incorrectly.

Each candidate is measured over all 24 × 60 = 1,440 HH:MM combinations. Pairs
remain centered at x 166 and 284; the colon remains centered at x 225.

## Final T0 geometry and the handoff contradictions

Final font size is **66.38755980861244 px** (`55.5 / 0.836`), final `wdth` is
**92.5**, and weight is 600. Tracking is zero. The digits' semantic baseline
remains 252.3; the renderer must apply **translate(0, −1.1949760765550237)** to
the T0 group to compensate for the font's 18-unit lower overshoot. This is
exported as `OrbitFonts.timeInkShiftY`.

The handoff contains two incompatible constraints requiring documented
interpretation:

1. Martian Mono has `sCapHeight=800` in a 1000-unit em. Literal capital height
   55.5 requires size 69.375, but the saved digits have ink y −18…818, making
   their actual height **57.9975 px**. The non-negotiable G2 digit box takes
   precedence: retain actual digit height 55.5; the resulting capital height
   is **53.1100478469 px**, rather than falsely claiming both equal 55.5.
2. HH ink ≤94 and both colon clearances ≥6 first pass at wdth 102.5, but the
   resulting full time ink reaches x121.719499…329.077150 and violates G2's
   x123…327 box. Continue the same 2.5-unit decrement until the full fixed
   geometry also fits. The first width satisfying all constraints is 92.5.

| wdth | Max HH ink | Max MM ink | Min left gap | Min right gap | Whole time x min | Whole time x max | Result |
|---:|---:|---:|---:|---:|---:|---:|---|
| 112.5 | 94.469493 | 94.535880 | 3.300841 | 4.097490 | 119.196772 | 331.666264 | FAIL |
| 110 | 93.141742 | 93.208129 | 4.031104 | 4.827753 | 119.860647 | 331.002389 | FAIL |
| 107.5 | 91.880378 | 91.946766 | 4.827754 | 5.558016 | 120.458135 | 330.338513 | FAIL |
| 105 | 90.619015 | 90.685402 | 5.491630 | 6.288280 | 121.122011 | 329.741025 | FAIL |
| 102.5 | 89.357651 | 89.357651 | 6.221893 | 7.018543 | 121.719499 | 329.077150 | FAIL G2 width |
| 100 | 88.029900 | 88.029900 | 7.018544 | 7.815193 | 122.383374 | 328.413274 | FAIL G2 width |
| 97.5 | 86.768536 | 86.768536 | 7.748807 | 8.479069 | 122.980862 | 327.749399 | FAIL G2 width |
| 95 | 85.507173 | 85.507173 | 8.412682 | 9.209332 | 123.644738 | 327.151911 | FAIL G2 width |
| **92.5** | **84.245809** | **84.245809** | **9.209333** | **9.939595** | **124.242226** | **326.488035** | **PASS** |

Final compensated digit ink y is 196.8…252.3, to Chrome's floating-point
precision (measurement tolerance 0.00001 design px). The lower overshoot is
not clipped or removed from the font. Colon vertical placement is the
handoff's baseline minus 4 px, with the same common compensation.

The source glyph outlines and the screenshot specimen have been rendered in
Chrome and inspected visually. This font-only result does not establish
integrated watch gate acceptance or device typography fidelity; the main
round-6 verification and SM-R965N T6 remain responsible for those checks.

## Browser/CommonJS embedding API

`orbit-fonts.js` is generated and exposes the same API as `root.OrbitFonts`
and `module.exports`:

- `css`: four complete embedded `@font-face` rules with `data:font/ttf;base64`
  sources, normal style, and exact weights. Insert into the emitted SVG's
  `<style>` block; the result remains offline and self-contained.
- `faces`: objects with `file`, `family`, `weight`, `width`, and base64 `data`.
- `timeSize`, `timeWidth`, `timeInkShiftY`, `capRatio`.
- `metrics`: `unitsPerEm:1000`, `capRatio:0.8`, `stdAdvanceRatio:0.7`,
  `condAdvanceRatio:0.6`, `digitInkYMin:-18`, `digitInkYMax:818`,
  `digitInkHeight:55.5`.

`OrbitStd` at 15 px advances 10.5 px per cell before tracking; `OrbitCond`
at 7.5 px advances 4.5 px, and at 15 px advances 9 px. Every text consumer
must retain `font-variant-numeric:tabular-nums`; it is not baked into a font
resource declaration. Existing Roboto embeds may remain for comparison
presets, while G3 uses the exact static fonts above.

The T1 formula also warrants integration measurement: 16 Std cells in
`16 APR  FRI  ARI` at 15 px with +0.06 em tracking consume about 182.4 px
before the raised degree field, exceeding the handoff's 170 px field.
This arithmetic identifies an inconsistent specification; it does not
authorize silently shrinking the specified T1 family, size, or tracking.
