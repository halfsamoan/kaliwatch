# Round 6 measurement gates

This note describes the measurement implementation. The numeric acceptance limits in the handoff and final spec are unchanged.

## Chrome and fonts

`tools/browser.cjs` uses Chrome DevTools Protocol over a private pipe, without a Node package dependency. `CHROME` can override automatic executable discovery; both the existing Windows locations and Linux Chrome/Chromium locations are supported. File URLs use Node's `pathToFileURL`, including Unicode and spaces. Each capture waits for the document, `document.fonts.ready`, every registered font face's `load()` promise, and two animation frames. A font failure aborts capture. The renderer sets the actual viewport and device scale with CDP before capture.

Gates and comparison sheets share this renderer. `render-refs.cjs` adds the requested 100 ms wake frame. `rasterize.cjs` retains Inkscape output behavior and discovers Linux Inkscape as well as the existing Windows installation.

## G10: type inventory and horizon geometry

`verify.cjs` checks all G3 `<text>` elements, including settled-mode hidden layers, plus explicitly tiered spans such as the raised solar degree and battery percentage. Galaxia remains a comparison composition and does not acquire G3 typography requirements. Twelve G3 builds cover six awkward dates and both modes, alongside the existing deterministic render checks across every composition.

Every text must declare a valid `data-tier` and `data-frame`. Browser computed font family, size, weight, letter spacing and `tabular-nums` must match the round-6 tier table. T2 distinguishes C-frame ring numerals (13 px), Q-frame steps (20 px) and Q-frame battery (15 px). T0 uses the static font fit recorded in `OrbitFonts.timeSize`, rather than a duplicated constant. Active visibility must cover every tier and frame.

The raised T1 solar degree is a T4 span in the screen frame; this is the necessary screen-frame exception to the main T4 H/C/Q list. The battery's raised percentage is T4/Q. The font fit's cap/ink discrepancy and selected width are documented in `round6-fonts.md`.

The three independent `horizonPt(0/90/270)` assertions verify both the handoff coordinates and distance from H at radius 209.9, to 0.2 px.

## G11: micro legibility

For every visible T4 text and explicitly tiered T4 span in M1 and M2:

1. Save the complete Active render at 450 px.
2. Get the text's SVG `getBBox()` and transform all four corners to dial coordinates with `getCTM()`.
3. Hide other painted elements and render just the selected glyph fill in white. Definitions, masks, clip paths and ancestor transforms remain effective. Stroke/halo is excluded from the glyph mask.
4. Include every nonzero isolated glyph pixel, including antialiasing pixels. No brightness cutoff selects only the most favorable glyph interiors.
5. Compare median CIE L* on those pixels in the complete render with median CIE L* on the 2 px rectangular ring outside the transformed bounding box. Pixel centres define the ring membership.

Each element must have a nonempty glyph mask and ring, and a difference of at least 25 L*. No element averaging can hide a failure. Individual results and pixel counts are saved in `gates-measurements.json`; the isolated mask PNGs remain beside the source renders. Text occlusion in the complete render remains visible to this measurement.

## G12: phosphor allocation

The phosphor selection uses HSV hue 75 through 110 degrees, inclusive, with RGB chroma `max(R,G,B) - min(R,G,B) > 25` in 8-bit channel units. This explicitly defines the handoff's otherwise unspecified chroma scale. The selection operates on the complete M1 image inside the dial.

The official dragon path is rendered at the unchanged frame. Every nonzero mask pixel participates in a 3 px Euclidean dilation (integer offsets with `dx² + dy² <= 9`); a 7 by 7 square dilation is not used. At least 45% of selected phosphor pixels must be inside that dilated mask. An empty phosphor selection fails.

## Wake at 100 ms

M1 and M2 are measured separately. For each image, the open-sky mask defines the median L*. Every dial pixel inside the full globe or sub-disc footprint is checked against `open-sky median - 10`. Any darker pixel fails; both footprints receive separate results.

This is the literal requested condition. When the open-sky median is at most 10, black pixels cannot violate it because L* is nonnegative; the gate is less discriminating for those frames. M1 is therefore retained as well as M2, and the measured median and darkest footprint pixel are always reported.

A second diagnostic render removes only `globe-aod` and `subdisc-aod`. With the current ring geometry, all 1,235 M1 globe violations occur outside the r 180 sky aperture and persist after the AOD footprints are removed; maximum darkening attributable to the actual footprint is 1.12 L*. The sub-disc has 190 violations, all outside the aperture, of which 189 persist without the AOD footprints; actual footprint darkening is at most 0.81 L*. Thus the literal condition also counts the intended black trench/F1 ring and can fail even after the named AOD artefact has disappeared. The gate preserves that failure and reports baseline violations and actual footprint darkening alongside it.

## Existing gates and evidence

G1, G2, G3, G8 and G9 retain their existing thresholds. G3 additionally reports the requested share above 24/255 and mean linear luminance Y, alongside its previous >8/255 diagnostic. The Python process exits nonzero on any failed gate. JavaScript preserves and prints both stdout and stderr and the evidence directory, including on a measurement failure.

The first integrated run exposed real G11 and wake failures and 22 AOD pixels beyond r 220 after the font swap. These failures were reported for correction; their thresholds were not changed. Provisional evidence was saved under `/tmp/kaliwatch-round6-gates-provisional2`. Final acceptance results belong in the round-6 REFERENCES section after the implementation stabilizes.

## G5, G6 and G7

`gates.cjs` also runs `depth-gates.cjs` / `depth-gates.py` after the original gate measurement, even when the original set fails, so one failure does not conceal the other measurements. All failed or unmeasured requirements preserve a nonzero exit. The standalone depth command can target its own evidence directory.

G5 renders the complete face at an actual 150 px viewport for M1, M7 and M8. Source-linked F1 and F2 surface groups are rendered separately to exclude inscriptions, gloss and the night-sector overlay from the base-surface ratio; F1 samples r 189–194 outside clock 290–340°. The Milky Way has its own source layer, so stars and figure lines cannot create a false positive for the required L* 60 cloud pixels. Globe phase masks use the same clipped phase path and fixed 225° local rotation as the source. The unlit-side comparison removes the globe to expose the sky directly underneath. Rotor pixels are counted in its actual M1 location. Bead brightness samples its radial profile at each visible horizon location, excluding actual dragon ink, and requires a whole 150 px output pixel at linear Y 30%. The sub-disc lip compares its L* with the adjacent floor, with the r 180 aperture excluding occluded arc portions.

G6 reads `bake-sources.js`'s `lightAudit`. It checks the physical offset angle, Euclidean offset length and height difference, with the exact angular and length tolerances from the spec. Highlight normals follow the declared raised/inner-wall class. Every entry must have a selector that exists in the rendered source. Absent metadata or an empty inventory is `NOTMEASURED`, never a guessed pass. Audit metadata must remain linked to the actual rendering parameters; it does not substitute for device-light acceptance.

G7 renders M1–M3 at an actual 480 px viewport. OLED 40% brightness is applied to linear luminance Y before converting to L*, preserving the physical brightness interpretation. Multiplying sRGB channel values by 0.4 would produce a different and much darker result.

For each edge, its semantic source group supplies a contribution mask: its paint is white, other paint is black, and all original geometry, clipping, alpha, filters and stacking remain. Circle and horizon edges are sampled uniformly by arc length; the plate facet and dragon path use their actual SVG contours and transformed local normals. Profiles traverse ±4 design px in 0.5 px steps. A sample compares visible bevel pixels with the adjacent faces 1 design px beyond its edges. The fraction reaching ΔL* 12 must be at least 60% for each named edge, at each moment.

For each shadow, the complete image is compared with a second render hiding only that source shadow. Its contribution mask removes opaque caster occlusion and preserves partial visibility through translucent surfaces. Receiver geometry selects crescent, sub-disc floor, lip, or actual Milky Way cloud pixels under the plate. At least 50% of each visible receiver area must reach ΔL* 8. No per-shadow threshold is tuned to the current source. Blur support and partially transparent pixels remain in the measured area; they are not discarded to improve a failure.

The first additional-gate run found G5 bead brightness and sub-disc lip failures, a G7 M2 plate-bevel failure, and G7 shadow failures. G6 was unmeasured until the source audit module became available. These are evidence for further design work, not permission to change the acceptance thresholds.
