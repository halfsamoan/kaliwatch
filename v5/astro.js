// KALIWATCH v5 astronomy engine. Low-precision Meeus formulas, good to ~0.01 deg for the Sun,
// ~0.3 deg for the Moon, sub-second for sidereal time. Pure functions, no dependencies.
// Browser: window.KaliAstro.  Node: require('./astro.js').
(function (root) {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const SEOUL = { lat: 37.5665, lon: 126.978, tz: 'Asia/Seoul', name: 'Seoul' };
  const SYNODIC = 29.530588853;
  const norm = d => ((d % 360) + 360) % 360;

  // Julian Day from a JS Date (UTC instant).
  function toJD(date) { return date.getTime() / 86400000 + 2440587.5; }
  function fromJD(jd) { return new Date((jd - 2440587.5) * 86400000); }

  // Greenwich mean sidereal time in degrees (Meeus 12.4).
  function gmstDeg(jd) {
    const T = (jd - 2451545.0) / 36525;
    return norm(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000);
  }
  function lstDeg(jd, lonDeg) { return norm(gmstDeg(jd) + lonDeg); }

  // Mean obliquity of the ecliptic (deg).
  function obliquity(jd) { const T = (jd - 2451545.0) / 36525; return 23.439291 - 0.0130042 * T; }

  // Sun: apparent ecliptic longitude (deg), RA (deg), Dec (deg).  Meeus ch. 25.
  function sun(jd) {
    const T = (jd - 2451545.0) / 36525;
    const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const Mr = M * D2R;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr);
    const trueLon = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    const lambda = norm(trueLon - 0.00569 - 0.00478 * Math.sin(omega * D2R));
    const eps = obliquity(jd) * D2R, lr = lambda * D2R;
    const ra = norm(Math.atan2(Math.cos(eps) * Math.sin(lr), Math.cos(lr)) * R2D);
    const dec = Math.asin(Math.sin(eps) * Math.sin(lr)) * R2D;
    return { lon: lambda, ra, dec, meanAnomaly: M };
  }

  const ZODIAC = [
    ['Aries', '♈'], ['Taurus', '♉'], ['Gemini', '♊'], ['Cancer', '♋'], ['Leo', '♌'], ['Virgo', '♍'],
    ['Libra', '♎'], ['Scorpio', '♏'], ['Sagittarius', '♐'], ['Capricorn', '♑'], ['Aquarius', '♒'], ['Pisces', '♓']
  ];
  // Tropical zodiac sign from ecliptic longitude.
  function zodiac(lonDeg) {
    const i = Math.floor(norm(lonDeg) / 30) % 12;
    return { index: i, name: ZODIAC[i][0], symbol: ZODIAC[i][1], degreeInSign: norm(lonDeg) - i * 30 };
  }

  // Moon: ecliptic longitude/latitude (deg), RA/Dec, phase. Truncated Meeus ch. 47 (main terms).
  function moon(jd) {
    const T = (jd - 2451545.0) / 36525;
    const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) * D2R;
    const M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) * D2R;
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) * D2R;
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) * D2R;
    const s = Math.sin;
    const dL = 6.288774 * s(Mp) + 1.274027 * s(2 * D - Mp) + 0.658314 * s(2 * D) + 0.213618 * s(2 * Mp) - 0.185116 * s(M)
      - 0.114332 * s(2 * F) + 0.058793 * s(2 * D - 2 * Mp) + 0.057066 * s(2 * D - M - Mp) + 0.053322 * s(2 * D + Mp)
      + 0.045758 * s(2 * D - M) - 0.040923 * s(M - Mp) - 0.034720 * s(D) - 0.030383 * s(M + Mp) + 0.015327 * s(2 * D - 2 * F)
      - 0.012528 * s(Mp + 2 * F) + 0.010980 * s(Mp - 2 * F) + 0.010675 * s(4 * D - Mp) + 0.010034 * s(3 * Mp) + 0.008548 * s(4 * D - 2 * Mp);
    const beta = 5.128122 * s(F) + 0.280602 * s(Mp + F) + 0.277693 * s(Mp - F) + 0.173237 * s(2 * D - F)
      + 0.055413 * s(2 * D - Mp + F) + 0.046271 * s(2 * D - Mp - F) + 0.032573 * s(2 * D + F) + 0.017198 * s(2 * Mp + F);
    const lon = norm(Lp + dL);
    const sunLon = sun(jd).lon;
    const elong = norm(lon - sunLon);           // 0 new, 90 first quarter, 180 full, 270 last quarter
    const phase = elong / 360;                   // 0..1
    const age = phase * SYNODIC;                 // days since new moon
    const illuminated = (1 - Math.cos(elong * D2R)) / 2;
    const eps = obliquity(jd) * D2R, lr = lon * D2R, br = beta * D2R;
    const ra = norm(Math.atan2(Math.sin(lr) * Math.cos(eps) - Math.tan(br) * Math.sin(eps), Math.cos(lr)) * R2D);
    const dec = Math.asin(Math.sin(br) * Math.cos(eps) + Math.cos(br) * Math.sin(eps) * Math.sin(lr)) * R2D;
    const names = ['New', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
    const type = Math.round(elong / 45) % 8;
    return { lon, lat: beta, ra, dec, elongation: elong, phase, age, illuminated, waxing: elong < 180, type, typeName: names[type] };
  }

  // Mean heliocentric longitudes of the classical planets (deg) for an orrery. Circular, mean motion only.
  const PLANETS = [
    { id: 'mercury', name: 'Mercury', L0: 252.25084, n: 4.09233445, a: 0.387 },
    { id: 'venus', name: 'Venus', L0: 181.97973, n: 1.60213034, a: 0.723 },
    { id: 'earth', name: 'Earth', L0: 100.46435, n: 0.98560912, a: 1.0 },
    { id: 'mars', name: 'Mars', L0: 355.45332, n: 0.52402068, a: 1.524 },
    { id: 'jupiter', name: 'Jupiter', L0: 34.40438, n: 0.08308529, a: 5.203 },
    { id: 'saturn', name: 'Saturn', L0: 49.94432, n: 0.03344414, a: 9.537 }
  ];
  function planets(jd) {
    const d = jd - 2451545.0;
    return PLANETS.map(p => ({ id: p.id, name: p.name, a: p.a, lon: norm(p.L0 + p.n * d) }));
  }

  // Altitude/azimuth of an equatorial position for an observer. az from north through east.
  function altAz(raDeg, decDeg, jd, lat, lon) {
    const H = norm(lstDeg(jd, lon) - raDeg) * D2R, phi = lat * D2R, dr = decDeg * D2R;
    const sinAlt = Math.sin(phi) * Math.sin(dr) + Math.cos(phi) * Math.cos(dr) * Math.cos(H);
    const alt = Math.asin(sinAlt);
    const az = Math.atan2(-Math.sin(H), Math.tan(dr) * Math.cos(phi) - Math.sin(phi) * Math.cos(H));
    return { alt: alt * R2D, az: norm(az * R2D) };
  }

  // Polar planisphere: north celestial pole at the origin. Two projections:
  //   'equidistant'   r = scale * (90 - dec)                (px per degree; planisphere / Galaxia disc)
  //   'stereographic' r = scale * tan((90 - dec) / 2)       (horizon becomes a circle)
  // Dial angle (clockwise from 12 o'clock) = meridianDeg - hourAngle, so the sky turns COUNTER-clockwise
  // with sidereal time; discAngle() is the clockwise rotation to apply to a disc baked at LST = 0.
  function polarRadius(decDeg, scale, projection) {
    return projection === 'stereographic' ? scale * Math.tan((90 - decDeg) / 2 * D2R) : scale * (90 - decDeg);
  }
  function polar(raDeg, decDeg, lstDegNow, scale, meridianDeg, projection) {
    const H = norm(lstDegNow - raDeg);
    const r = polarRadius(decDeg, scale, projection || 'equidistant');
    const a = (meridianDeg - H) * D2R;
    return { x: r * Math.sin(a), y: -r * Math.cos(a), r, angle: norm(meridianDeg - H) };
  }
  function discAngle(lstDegNow) { return norm(-lstDegNow); }
  // Horizon of latitude lat in the dial frame (pole at origin, meridian toward meridianDeg): sampled as
  // points of altitude 0 for azimuth 0..360, in dial coordinates. Also returns the zenith point.
  function horizon(latDeg, scale, meridianDeg, projection, steps) {
    const phi = latDeg * D2R, pts = [], n = steps || 72, md = (meridianDeg == null ? 180 : meridianDeg);
    for (let i = 0; i <= n; i++) {
      const az = (i / n) * 360 * D2R;                       // from north through east
      // altitude 0: sin(dec) = cos(phi) cos(az); sin H = -sin(az)/cos(dec); cos H = -sin(phi) sin(dec)/(cos(phi) cos(dec))
      const dec = Math.asin(Math.cos(az) * Math.cos(phi));
      const H = Math.atan2(-Math.sin(az), -Math.sin(phi) * Math.sin(dec) / Math.cos(phi));
      const r = polarRadius(dec * R2D, scale, projection || 'equidistant');
      const a = (md * D2R - H);
      pts.push({ x: r * Math.sin(a), y: -r * Math.cos(a), az: az * R2D });
    }
    const zr = polarRadius(latDeg, scale, projection || 'equidistant'), za = md * D2R;
    return { points: pts, zenith: { x: zr * Math.sin(za), y: -zr * Math.cos(za) }, northPoint: pts[0], southPoint: pts[n / 2 | 0] };
  }

  // Sunrise / sunset (h0 = -0.833 deg: upper limb + standard refraction) for the local civil date of `date`,
  // by a 5-minute altitude scan with linear interpolation. Returns local fractional hours (or null).
  function riseSet(date, site, utcOffsetMin) {
    const s = site || SEOUL, off = (utcOffsetMin == null ? 540 : utcOffsetMin) * 60000, t = new Date(date.getTime() + off);
    const mid = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) - off;
    const h = ms => { const jd = toJD(new Date(ms)), su = sun(jd); return altAz(su.ra, su.dec, jd, s.lat, s.lon).alt + 0.833; };
    let rise = null, set = null, prev = h(mid);
    for (let i = 1; i <= 288; i++) {
      const cur = h(mid + i * 300000), at = (i - 1 + prev / (prev - cur)) * 5 / 60;
      if (prev < 0 && cur >= 0 && rise === null) rise = at;
      if (prev >= 0 && cur < 0 && set === null) set = at;
      prev = cur;
    }
    return { rise, set };
  }

  // Everything the face needs for one instant.
  function sky(date, site) {
    const s = site || SEOUL, jd = toJD(date);
    const su = sun(jd), mo = moon(jd), lst = lstDeg(jd, s.lon);
    const sunAA = altAz(su.ra, su.dec, jd, s.lat, s.lon);
    return {
      jd, lst, lstHours: lst / 15, gmst: gmstDeg(jd), sun: { ...su, ...sunAA, zodiac: zodiac(su.lon) },
      moon: mo, planets: planets(jd), site: s,
      dayFraction: ((jd - 0.5) % 1 + 1) % 1, // UTC day fraction
      localDayFraction: (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400
    };
  }

  root.KaliAstro = { SEOUL, SYNODIC, ZODIAC, PLANETS, toJD, fromJD, gmstDeg, lstDeg, obliquity, sun, moon, zodiac, planets, altAz, polar, discAngle, horizon, riseSet, sky, norm };
  if (typeof module !== 'undefined') module.exports = root.KaliAstro;
})(typeof globalThis !== 'undefined' ? globalThis : this);
