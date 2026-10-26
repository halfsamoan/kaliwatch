# Round 6 WFF expression evidence

Scope: handoff Task C3, specification 07 §4.9 and §9. The implementation is `v5/wff-expr.js`; the independent numerical and grammar check is `node tools/test-wff-expr.cjs` from `v5/`. Studio and generator integration are owned by the main agent.

## Shared strings and API

`raw` retains authoring forms; `expressions` contains WFF-ready strings. `expression(id, {inlineReferences:true})` supplies the specified T9 fallback. Both the interpreter and `carrierXml()` consume the exact expanded strings; XML attributes escape reserved characters without changing the decoded expression. No JavaScript `eval` or `Function` construction is used. The parser rejects unknown tokens, missing sources and wrong function arity.

| API | Result |
|---|---|
| `sourcesAt(date, options)` | UTC epoch hours, local minute/second, UTC timestamp in milliseconds, moon/sensor source map |
| `evaluate(source, sources, references, options)` | Supported WFF expression result |
| `evaluateCarriers(sources, options)` | Chained `{lst,lsun,asun,dsun,lj,ls}` |
| `at(date, options)` | All carriers; d, E3/E4/E8, H0, sign, moonSprite, JD, sources, and equatorial planet coordinates |
| `solar(date, optionalLstOverride)` | Same evaluated quantities, with the optional caller LST applied to E3/E4/E8 |
| `planetsAt(date)`, `moonSprite(age)` | Evaluated E13–E15 and E12 |
| `bodyExpressions(name,w,h,options)` | E15 `ra`,`dec` and E16 `radius`,`x`,`y` inside the 586 px sky frame |
| `carrierXml(options)` | Six invisible-on-black 1×1 carriers, before the rounded face clip |

E10 is exposed as `E10start` and `E10end`, because it assigns two attributes. E15 and E16 are parameterized by planet and image dimensions; call `bodyExpressions('jupiter',20,20)` or `bodyExpressions('saturn',30,16)`. The resulting strings are evaluated unchanged and are also suitable for Transform values.

Carrier order is `ref_lst → ref_lsun → ref_asun → ref_dsun → ref_lj → ref_ls`; each publishes `source="angle"`, `defaultValue="0"`. The groups remain opaque and contain a 1×1 black PartDraw. Setting `alpha=0` could make the carrier unavailable and return its default, which the official Reference documentation allows. Its visual effect is outside the round face. The studio model intentionally preserves a negative `dsun`; actual angle normalization by a device must be tested under T9.

## Primary documentation checked 2026-10-26

- [WFF ArithmeticExpression](https://developer.android.com/reference/wear-os/wff/common/attributes/arithmetic-expression): the needed trigonometric functions, `rad`, `deg`, `floor`, `fract`, `clamp`, `round`, `abs`, `numberFormat`, `colorRgb`, comparisons, ternaries, and arithmetic are documented. Division by zero evaluates to 0 and the interpreter follows that rule. `min()` is absent from the listed functions, so the specification's `min(a,b)` is treated as an authoring macro and expanded to a ternary. `W(x)` similarly expands to the specification's floor-based wrap. No undocumented `atan2` is emitted; E13/E14 retain the specified `atan(Y/X)` with quadrant correction. Number formatting covers only the decimal patterns used here and uses the English separators, zero padding and half-even rounding needed by those patterns; it is not a complete ICU implementation.
- [SourceType](https://developer.android.com/reference/wear-os/wff/common/attributes/source-type): `UTC_TIMESTAMP` is milliseconds, `HOURS_SINCE_EPOCH` is integer UTC hours, and `MINUTE` is the local minute field. `MOON_PHASE_POSITION` is an integer in 0–28. Studio age input is floored and clamped to that range before the exact E12 string is evaluated. The astronomical lunar-age estimate is a stand-in for the device source, not proof of T21 equivalence.
- [Reference](https://developer.android.com/reference/wear-os/wff/common/reference/reference) and [Group](https://developer.android.com/reference/wear-os/wff/group/group): Reference may belong to a scene object that supports Transform; Group supports `angle` and lists Reference as a child. Reference requires unique name, source attribute and default value. The default is allowed when its parent is unavailable. These pages do not establish update timing or whether a negative angle is normalized before publication.
- [WFF release notes](https://developer.android.com/training/wearables/wff/release-notes): Reference was added in WFF 4; the Reference page identifies Wear OS 6. The port must confirm the installed device runtime, rather than infer support from the hardware model.

## Differences from the former handwritten studio formulas

E1 is minute based. Previously `solar()` and `planetsAt()` used the full millisecond date, and `ctx.sky.lst` used full-second Meeus GMST. The expression module computes the exact spec E1 from integer epoch hours plus the minute field. At M1, the spec LST is 138.35149476329°, whereas the old full-second value is 138.45062810310°. The 0.099133° difference includes the 24 seconds in the preview time. The source-of-truth change is deliberate; the visual integration uses the same minute based LST for the sky and the live bodies.

M1 evaluates to d 470.463888888889, λ☉ 26.2506223866864°, α☉ 24.3455153269297°, δ☉ 10.1329602734523°, E3 221.648505236710°, E4 41.648505236710°, E8 65.9940205636397°, H0 97.9015863032985°, sign ARI, S9 5. Its actual telemetry is LST `09:13`, JD `2461511.96`. The handoff's `LST 08:42  JD 2461512.46` is a formatting example, not the M1 expected values.

## Verification and limits

The test checks M1–M8 against the table, dial coordinates against the specified rounded positions, the sky-frame-to-dial E16 transformation, Capella's east/west handedness against `astro.js` azimuth, all 24 UTC hour boundaries, odd-minute motion, frozen-within-minute behavior, source parsing and XML expression identity. The 2026–2030 half-hour sweep compares against independent UTC arithmetic, equatorial formulas and an `atan2` planet oracle, and compares Reference and fully inlined modes. It tests finite ranges throughout the period for which the spec states planet error limits; it does not establish those errors against JPL.

The default and supported site is Seoul, UTC+9. Whole-hour timezone offsets preserve E1; fractional-hour offsets are rejected explicitly, since spec E1 would otherwise give a false sky angle. A real `MOON_PHASE_POSITION` value can be supplied through `evaluateCarriers`/`evaluate` or the source map. No location or sensor reading is invented by this module.

Float32 simulation is sensitivity evidence only. At M1, direct timestamp-to-JD arithmetic evaluates to 2461512 under float32, versus 2461511.964166667 in the normal double interpreter. If the actual WFF runtime has that precision, JD telemetry needs split integer/fraction formatting; precision must be established on the probe face before claiming device parity. The hour-based E1 avoids the known two-minute quantization of a raw `MINUTES_SINCE_EPOCH` float32 input.

Expanded planet carrier values are 2184 bytes (Jupiter) and 2148 bytes (Saturn), larger than the spec's approximate 0.9 KB estimate. The strings include the exact repeated E1, W and orbit macros. T10 must validate expression length and evaluation cost; no unsupported expression-length limit has been invented.

Device T7 (timing and precision), T9 (Reference chain), T10 (expression cost), and T21 (lunar source) remain **unverified**: no connected SM-R965N was available. This implementation does not turn interpreter agreement into a device acceptance claim.

Final numeric check completed successfully on 2026-10-26 at 07:41 UTC:

| Check | Result |
|---|---|
| Half-hour samples, 2026-01-01 through 2030-12-31 UTC | 87,648 |
| Largest independent orbit / equatorial oracle difference | 8.230927051045e-11° |
| Largest Reference versus fully inlined difference | 0 |
| Largest minute-based LST versus Meeus GMST difference | 0.001141489169925° |
| Daily 13:37 float32 sensitivity, largest LST difference | 0.036381135813372° |
| M1–M8, 24 boundaries, odd-minute motion, frame and parser assertions | passed |

The float32 sample uses 13:37 rather than an integer UTC day, so it exercises the fractional-day precision relevant to minute movement. The normal studio interpreter uses JavaScript doubles. The live timestamp assertion in this run used `2026-10-26T07:41:08.165Z`, yielding LST 276.928460313869° and JD 2461339.820233391.
