// G3: the studio and XML generator consume these same expanded WFF strings.
(function (root) {
  'use strict';
  const A = root.KaliAstro || (typeof require !== 'undefined' ? require('./astro.js') : null);
  const raw = Object.freeze({
    E1: '([HOURS_SINCE_EPOCH] - 490896) / 24 + [MINUTE] / 1440',
    E2: 'W(227.64 + 360*fract(E1) + 0.98564737*E1)',
    E3: 'W(360 - [REFERENCE.lst])', E4: 'W(180 - [REFERENCE.lst])',
    E5: 'W(280.667 + 0.98564736*E1 + 1.9146*sin(rad(357.282 + 0.98560028*E1)) + 0.02*sin(rad(2*(357.282 + 0.98560028*E1))))',
    E6: 'W([REFERENCE.lsun] - 2.4657*sin(rad(2*[REFERENCE.lsun])) + 0.0529*sin(rad(4*[REFERENCE.lsun])))',
    E7: 'deg(asin(0.39777*sin(rad([REFERENCE.lsun]))))',
    E8: 'W(180 + [REFERENCE.asun] - [REFERENCE.lst])',
    E9: '90 + deg(asin(clamp(0.76920*tan(rad([REFERENCE.dsun])), -1, 1)))',
    E10start: '180 + E9', E10end: '540 - E9', E11: 'floor([REFERENCE.lsun] / 30)',
    E12: 'round(min([MOON_PHASE_POSITION], 29.53 - [MOON_PHASE_POSITION]) * 0.5417)',
    E17: '0 - E3', S9: 'E12', carriage: '[SECOND] * 6',
    trailStart: 'E3 + 3.7', trailEnd: 'E3 + 3.7 + [SECOND]*6',
    battery: '360 * [BATTERY_PERCENT] / 100',
    batteryColor: '[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(166,244,106)',
    steps: '360 * clamp([STEP_COUNT] / clamp([STEP_GOAL], 1, 1000000), 0, 1)',
    stepsLarge: 'numberFormat("0.0", floor(clamp([STEP_COUNT], 0, 99999) / 100) / 10)',
    stepsSmall: 'numberFormat("#,##0", [STEP_COUNT])',
    jd: '[UTC_TIMESTAMP] / 86400000 + 2440587.5',
    lstHour: 'floor([REFERENCE.lst] / 15)', lstMinute: 'floor(fract([REFERENCE.lst] / 15) * 60)',
    degreeInSign: 'floor([REFERENCE.lsun] - 30*floor([REFERENCE.lsun] / 30))',
    cursor: '[SECOND] % 2 == 0'
  });
  const carrierIds = Object.freeze({ lst: 'E2', lsun: 'E5', asun: 'E6', dsun: 'E7', lj: 'E13', ls: 'E14' });
  const wrap = x => `((${x}) - 360*floor((${x})/360))`;
  function planetLongitude(L0, n, peri, centre, radius, e) {
    const L = `(${L0} + ${n}*E1)`, M = `(${L} - ${peri})`, l = `(${L} + ${centre}*sin(rad(${M})))`;
    const r = `(${radius}*(1 - ${e}*cos(rad(${M}))))`;
    const x = `(${r}*cos(rad(${l})) + cos(rad([REFERENCE.lsun])))`;
    const y = `(${r}*sin(rad(${l})) + sin(rad([REFERENCE.lsun])))`;
    return `W(deg(atan(${y}/${x})) + ((${x} < 0) ? 180 : 0))`;
  }
  const definitions = { ...raw, E13: planetLongitude('103.430', '0.08308677', '14.73', '5.546', '5.2029', '0.0484'),
    E14: planetLongitude('7.807', '0.03347054', '92.60', '6.172', '9.5367', '0.0539') };
  // W and min are authoring macros, not undocumented WFF runtime functions.
  function expandCalls(text, name, replacement) {
    const re = new RegExp(`\\b${name}\\(`); let match;
    while ((match = re.exec(text))) {
      let depth = 1, end = match.index + match[0].length, split = [], start = end;
      for (; end < text.length && depth; end++) {
        if (text[end] === '(') depth++;
        if (text[end] === ')') depth--;
        if ((text[end] === ',' && depth === 1) || depth === 0) { split.push(text.slice(start, end)); start = end + 1; }
      }
      if (depth) throw new SyntaxError(`Unclosed ${name} macro`);
      text = text.slice(0, match.index) + replacement(split) + text.slice(end);
    }
    return text;
  }
  function expand(text, inlineReferences = false, visiting = []) {
    text = text.replace(/\bE\d+(?:start|end)?\b/g, id => {
      if (!definitions[id]) throw new Error(`Unknown expression ${id}`);
      return `(${expand(definitions[id], inlineReferences, visiting)})`;
    });
    if (inlineReferences) text = text.replace(/\[REFERENCE\.(\w+)\]/g, (_, name) => {
      if (!carrierIds[name] || visiting.includes(name)) throw new Error(`Unknown or cyclic reference ${name}`);
      return `(${expand(definitions[carrierIds[name]], true, [...visiting, name])})`;
    });
    text = expandCalls(text, 'min', ([a, b]) => `((${a}) < (${b}) ? (${a}) : (${b}))`);
    return expandCalls(text, 'W', ([x]) => wrap(x));
  }
  const expressions = Object.freeze(Object.fromEntries(Object.entries(definitions).map(([id, value]) => [id, expand(value)])));
  const inlineExpressions = Object.freeze(Object.fromEntries(Object.entries(expressions).map(([id, value]) => [id, expand(value, true)])));
  function expression(id, options = {}) {
    if (!(id in expressions)) throw new Error(`Unknown expression ${id}`);
    return options.inlineReferences ? inlineExpressions[id] : expressions[id];
  }
  const bodyCache = new Map();
  function bodyExpressions(name, width = 0, height = 0, options = {}) {
    if (!['jupiter', 'saturn'].includes(name) || !Number.isFinite(width) || !Number.isFinite(height)) throw new Error('Invalid planet or dimensions');
    const key = [name, width, height, !!options.inlineReferences].join(':');
    if (bodyCache.has(key)) return bodyCache.get(key);
    const l = `[REFERENCE.${name === 'jupiter' ? 'lj' : 'ls'}]`;
    const ra = expand(`W(${l} - 2.4657*sin(rad(2*${l})) + 0.0529*sin(rad(4*${l})))`, !!options.inlineReferences);
    const dec = expand(`deg(asin(0.39777*sin(rad(${l}))))`, !!options.inlineReferences);
    const radius = `128*tan(rad((90 - (${dec}))/2))`;
    const body = Object.freeze({ ra, dec, radius, x: `293 + (${radius})*sin(rad(180 + (${ra}))) - ${width}/2`,
      y: `293 - (${radius})*cos(rad(180 + (${ra}))) - ${height}/2` });
    bodyCache.set(key, body); return body;
  }
  function numberFormat(pattern, value) {
    if (!/^(?:0+|#,##0)(?:\.[0#]+)?$/.test(pattern)) throw new Error(`Unsupported DecimalFormat pattern ${pattern}`);
    const [whole, fractional = ''] = pattern.split('.'), minimum = (fractional.match(/0/g) || []).length;
    const scale = 10 ** fractional.length, n = Math.abs(value) * scale, floor = Math.floor(n);
    const rounded = Math.abs(n - floor - 0.5) < 1e-9 ? floor + floor % 2 : Math.round(n);
    let [integer, fraction = ''] = (rounded / scale).toFixed(fractional.length).split('.');
    integer = integer.padStart((whole.match(/0/g) || []).length, '0');
    if (whole.includes(',')) integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    while (fraction.length > minimum && fraction.endsWith('0')) fraction = fraction.slice(0, -1);
    return (value < 0 ? '-' : '') + integer + (fraction ? '.' + fraction : '');
  }
  const functions = { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, atan: Math.atan,
    rad: x => x * Math.PI / 180, deg: x => x * 180 / Math.PI, floor: Math.floor, fract: x => x - Math.floor(x),
    clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)), round: Math.round, abs: Math.abs, min: Math.min,
    numberFormat, colorRgb: (r, g, b) => '#ff' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('') };
  const arity = { sin: 1, cos: 1, tan: 1, asin: 1, atan: 1, rad: 1, deg: 1, floor: 1, fract: 1,
    clamp: 3, round: 1, abs: 1, min: 2, numberFormat: 2, colorRgb: 3 };
  const precedence = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '<=': 4, '>': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };
  const cache = new Map();
  function compile(source) {
    if (cache.has(source)) return cache.get(source);
    const tokens = []; let at = 0;
    while (at < source.length) {
      const match = /^(\s+|\[(?:REFERENCE\.)?[A-Za-z_][A-Za-z0-9_]*\]|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|"(?:[^"\\]|\\.)*"|[A-Za-z_]\w*|<=|>=|==|!=|&&|\|\||[+*/%?:(),!<>-])/.exec(source.slice(at));
      if (!match) throw new SyntaxError(`Unsupported WFF token at ${at}: ${source.slice(at, at + 20)}`);
      if (!/^\s+$/.test(match[0])) tokens.push(match[0]); at += match[0].length;
    }
    let pos = 0;
    const consume = token => { if (tokens[pos++] !== token) throw new SyntaxError(`Expected ${token} in ${source}`); };
    function parse(minimum = 0) {
      let token = tokens[pos++], node;
      if (token === undefined) throw new SyntaxError('Unexpected end of WFF expression');
      if (['+', '-', '!'].includes(token)) node = ['unary', token, parse(7)];
      else if (token === '(') { node = parse(); consume(')'); }
      else if (token[0] === '[') node = ['source', token.slice(1, -1)];
      else if (token[0] === '"') node = ['literal', JSON.parse(token)];
      else if (/^[\d.]/.test(token)) node = ['literal', Number(token)];
      else if (['true', 'false'].includes(token)) node = ['literal', token === 'true'];
      else {
        if (!(token in functions)) throw new SyntaxError(`Unsupported WFF function ${token}`);
        consume('('); const args = [];
        if (tokens[pos] !== ')') { do { args.push(parse()); } while (tokens[pos] === ',' && ++pos); }
        consume(')'); if (args.length !== arity[token]) throw new SyntaxError(`Wrong arity for ${token}`);
        node = ['call', token, args];
      }
      while (precedence[tokens[pos]] >= minimum) {
        const op = tokens[pos++]; node = ['binary', op, node, parse(precedence[op] + 1)];
      }
      if (minimum === 0 && tokens[pos] === '?') { pos++; const yes = parse(); consume(':'); node = ['conditional', node, yes, parse()]; }
      return node;
    }
    const tree = parse();
    if (pos !== tokens.length) throw new SyntaxError(`Unexpected WFF token ${tokens[pos]}`);
    cache.set(source, tree); return tree;
  }
  function evaluate(source, sources = {}, references = {}, options = {}) {
    const numeric = value => options.float32 && typeof value === 'number' ? Math.fround(value) : value;
    function run(node) {
      const [kind, value, a, b] = node;
      if (kind === 'literal') return numeric(value);
      if (kind === 'source') {
        const map = value.startsWith('REFERENCE.') ? references : sources, key = value.replace(/^REFERENCE\./, '');
        if (!Object.hasOwn(map, key)) throw new Error(`Missing WFF source [${value}]`);
        return numeric(map[key]);
      }
      if (kind === 'call') return numeric(functions[value](...a.map(run)));
      if (kind === 'conditional') return run(run(value) ? a : b);
      if (kind === 'unary') { const x = run(a); return numeric(value === '+' ? +x : value === '-' ? -x : !x); }
      const x = run(a);
      if (value === '&&') return x && run(b);
      if (value === '||') return x || run(b);
      const y = run(b);
      switch (value) {
        case '+': return numeric(x + y); case '-': return numeric(x - y); case '*': return numeric(x * y);
        case '/': return numeric(y === 0 ? 0 : x / y); case '%': return numeric(x % y);
        case '<': return x < y; case '<=': return x <= y; case '>': return x > y; case '>=': return x >= y;
        case '==': return x === y; case '!=': return x !== y;
        default: throw new Error(`Unknown operator ${value}`);
      }
    }
    return run(compile(source));
  }
  const carriers = Object.freeze(Object.entries(carrierIds).map(([name, id]) => Object.freeze({
    id: 'ref_' + name, name, source: 'angle', defaultValue: 0, expression: expressions[id],
    dependencies: Object.freeze([...expressions[id].matchAll(/\[REFERENCE\.(\w+)\]/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i))
  })));
  function evaluateCarriers(sources, options = {}) {
    const references = {};
    for (const carrier of carriers) references[carrier.name] = evaluate(expression(carrierIds[carrier.name], options), sources, references, options);
    return references;
  }
  function sourcesAt(date, options = {}) {
    const ms = date.getTime(); if (!Number.isFinite(ms)) throw new RangeError('Invalid date');
    const offset = options.timezoneOffsetMinutes ?? 540;
    if (!Number.isInteger(offset) || offset % 60 !== 0) throw new RangeError('Spec E1 requires a whole-hour timezone (Seoul defaults to UTC+9)');
    const local = new Date(ms + offset * 60000), jd = ms / 86400000 + 2440587.5;
    const age = options.moonAge ?? A.moon(jd).age;
    return { UTC_TIMESTAMP: ms, HOURS_SINCE_EPOCH: Math.floor(ms / 3600000), MINUTES_SINCE_EPOCH: Math.floor(ms / 60000),
      SECONDS_SINCE_EPOCH: Math.floor(ms / 1000), MINUTE: local.getUTCMinutes(), SECOND: local.getUTCSeconds(),
      MOON_PHASE_POSITION: Math.max(0, Math.min(28, Math.floor(age))), BATTERY_PERCENT: options.battery ?? 78,
      STEP_COUNT: options.steps ?? 6240, STEP_GOAL: options.stepGoal ?? 8000 };
  }
  function at(date, options = {}) {
    const sources = sourcesAt(date, options), references = evaluateCarriers(sources, options);
    const get = id => evaluate(expression(id, options), sources, references, options), planets = {};
    for (const name of ['jupiter', 'saturn']) {
      const body = bodyExpressions(name, 0, 0, options);
      planets[name] = { ra: evaluate(body.ra, sources, references, options), dec: evaluate(body.dec, sources, references, options) };
    }
    return { d: get('E1'), ...references, H0: get('E9'), E3: get('E3'), E4: get('E4'), E8: get('E8'),
      sign: get('E11'), moonSprite: get('E12'), jd: get('jd'), references, sources, planets };
  }
  function solar(date, lstOverride) {
    const values = at(date);
    if (lstOverride !== undefined) {
      values.lst = lstOverride;
      values.references = { ...values.references, lst: lstOverride };
      for (const id of ['E3', 'E4', 'E8']) values[id] = evaluate(expressions[id], values.sources, values.references);
    }
    return values;
  }
  const escapeXml = value => value.replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[x]));
  function carrierXml(options = {}) {
    return carriers.map(c => `<Group name="${c.id}" x="0" y="0" width="1" height="1"><Transform target="angle" value="${escapeXml(expression(carrierIds[c.name], options))}"/><Reference name="${c.name}" source="${c.source}" defaultValue="0"/><PartDraw x="0" y="0" width="1" height="1"><Rectangle x="0" y="0" width="1" height="1"><Fill color="#ff000000"/></Rectangle></PartDraw></Group>`).join('\n');
  }
  const api = { raw: Object.freeze(definitions), expressions, carriers, expression, expand, bodyExpressions, compile, evaluate,
    sourcesAt, evaluateCarriers, at, solar, planetsAt: date => at(date).planets,
    moonSprite: age => evaluate(expressions.E12, { MOON_PHASE_POSITION: Math.max(0, Math.min(28, Math.floor(age))) }), carrierXml };
  root.WffExpr = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
