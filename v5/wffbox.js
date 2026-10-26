(function (root) {
  'use strict';
  // Martian Mono hhea: UPM 1000, ascent 1000, descent -200. Device T5 remains required.
  function wffBox(size, baseline, height = Math.ceil(size * 1.3), coefficient = 0.4) {
    if (![size, baseline, height, coefficient].every(Number.isFinite) || size <= 0 || height <= 0) throw new RangeError('Invalid WFF text geometry');
    height = Math.ceil(height);
    const y = Math.round(baseline - height / 2 - coefficient * size);
    return { y, height, expectedBaseline: y + height / 2 + coefficient * size, baselineError: y + height / 2 + coefficient * size - baseline };
  }
  root.WffBox = { wffBox };
  if (typeof module !== 'undefined') module.exports = root.WffBox;
})(typeof globalThis !== 'undefined' ? globalThis : this);
