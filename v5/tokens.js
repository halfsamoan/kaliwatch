// KALIWATCH v5 "Celestial Vault" design tokens. Single source for the studio renderer, the reference
// renders and the later WFF port (design-tokens.json is generated from this file).
(function (root) {
  'use strict';
  const tokens = {
    name: 'KALIWATCH — Celestial Vault', version: '5.0.0-ref1', canvas: 450,
    site: { name: 'Seoul', lat: 37.5665, lon: 126.978, tz: 'Asia/Seoul', utcOffsetMin: 540 },
    color: {
      black: '#000000',
      // identity
      phosphor: '#A6F46A', phosphorLight: '#D2FFA4', phosphorShade: '#4E7F34', phosphorDeep: '#34543C', track: '#17291D',
      paper: '#EFF8EC', quiet: '#9BAB9C', muted: '#6E8279', warning: '#F3C479',
      // controlled additions (each has one job)
      grisaille: '#C9D6D2',       // stars, moon face, rim light: "white enamel painted on dark"
      enamel: '#06100F',          // fired dark enamel: the vault's surface, not a hole
      enamelTeal: '#0E2A2E',      // Milky Way base, dome mid-tones
      gold: '#E2B15A', goldLight: '#F6D79A', goldDeep: '#7A5A22',   // the sun and nothing else
      metal: '#141B17', metalLight: '#3C4A42', metalHigh: '#8C9A92', metalDark: '#070A08',
      // ambient
      aodDigitFill: '#0B160B', aodDigitStroke: '#91AD80', aodDragon: '#5E7A52', aodQuiet: '#7F9472', aodStar: '#56685F', aodGold: '#6E5730', aodLine: '#2C3A31'
    },
    type: { family: "OrbitMono, 'Roboto Mono', monospace", time: 78, timeWeight: 600, value: 24, label: 10.5, labelTracking: 2.2, date: 16, prompt: 12.5 },
    light: { azimuthDeg: 315, elevationDeg: 35, note: 'one key light from 10:30 for every bake' },
    motion: {
      ease: [0.22, 1, 0.36, 1], wakeMs: 360, sleepMs: 180,
      rule: 'Wake lights the stack back-to-front; HH:MM never moves or scales; no decorative loops; reduced motion = instant.'
    },
    sample: { iso: '2026-10-25T10:08:24+09:00', battery: 78, steps: 6240, stepGoal: 10000 }
  };
  root.VaultTokens = tokens;
  if (typeof module !== 'undefined') module.exports = tokens;
})(typeof globalThis !== 'undefined' ? globalThis : this);
