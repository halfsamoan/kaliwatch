'use strict';
// Structural lint of wff/{probe,main} (07 §9, rules checked against the v4 XSDs). Not an XSD validation; device tests T1-T24 decide behaviour.
// usage: node tools/check-wff.cjs [probe] [main]
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '../wff'), MB = 1 << 20;
const BUDGET = 100*MB, ESTIMATE = 5.7*MB; // 07 §9.1: interactive 100 MB, estimate 4.8 MB (5.7 MB with f1_calendar)
const SPATIAL = { f2: ['angle'], probe_f2: ['angle'], plate_shadow: ['x', 'y'], dragon_shadow: ['x', 'y'] }; // 07 §9.3
const NODE = /^(Group|Part\w+|DigitalClock|AnalogClock)$/, VARIANT = /^(Group|Part\w+|DigitalClock|AnalogClock|TimeText|HourHand|MinuteHand|SecondHand|ComplicationSlot)$/; // v4 XSD Variant parents
const decode = s => s.replace(/&(lt|gt|quot|apos|amp);/g, (_, e) => ({ lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' }[e]));
const token = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([\w:.-]+)((?:\s+[\w:.-]+="[^"]*")*)\s*(\/?)>|([^<]+)/y;
let failed = 0;
function check(module) {
  const res = path.join(root, module, 'res'), errors = new Set(), warnings = new Set(), fail = m => errors.add(m), warn = m => warnings.add(m);
  const list = d => fs.existsSync(path.join(res, d)) ? fs.readdirSync(path.join(res, d)) : [];
  const xml = fs.readFileSync(path.join(res, 'raw/watchface.xml'), 'utf8');
  const drawables = new Map(list('drawable-nodpi').filter(f => f.endsWith('.png')).map(f => [f.slice(0, -4), path.join(res, 'drawable-nodpi', f)]));
  const fonts = new Set(list('font').map(f => f.replace(/\.(ttf|otf)$/, ''))), bitmaps = new Set([...xml.matchAll(/<BitmapFont name="([^"]+)"/g)].map(m => m[1]));
  const strings = new Set([...fs.readFileSync(path.join(res, 'values/strings.xml'), 'utf8').matchAll(/<string name="([^"]+)"/g)].map(m => m[1]));
  const refs = new Set(), used = new Set(), options = new Set(), stack = [], published = new Set([...xml.matchAll(/<Reference name="([^"]+)"/g)].map(m => m[1]));
  const where = () => stack.map(e => e.attrs.name || e.tag).slice(-4).join('>'), up = tag => stack.findLast(e => e.tag === tag);
  const useRefs = s => { for (const [, n] of s.matchAll(/\[REFERENCE\.(\w+)\]/g)) if (!published.has(n)) fail(`[REFERENCE.${n}] has no <Reference name="${n}">`);
    else if (!refs.has(n)) warn(`[REFERENCE.${n}] used before its Reference (07 §9.2 puts the carriers first; T9)`); };
  const close = e => { if (e.box && !e.spin && !stack.some(a => a.spin) && (e.box[0] >= 450 || e.box[1] >= 450 || e.box[2] <= 0 || e.box[3] <= 0)) fail(`${e.tag} ${e.attrs.name || ''} outside the 450 scene: ${e.box.map(Math.round)}`); };
  let m, count = 0; token.lastIndex = 0;
  while (token.lastIndex < xml.length) {
    const at = token.lastIndex;
    if (!(m = token.exec(xml))) { fail(`malformed markup at ${at}: ${JSON.stringify(xml.slice(at, at + 40))}`); break; }
    const [, cdata, slash, tag, raw, self, text] = m;
    if (cdata !== undefined || text !== undefined) { useRefs(cdata ?? text); continue; }
    if (!tag) continue;
    if (slash) { const e = stack.pop(); if (e?.tag !== tag) { fail(`</${tag}> closes <${e?.tag}> at ${where()}`); break; } close(e); continue; }
    const attrs = Object.fromEntries([...raw.matchAll(/([\w:.-]+)="([^"]*)"/g)].map(([, k, v]) => [k, decode(v)]));
    const parent = stack.at(-1), e = { tag, attrs, ox: parent?.ox || 0, oy: parent?.oy || 0 }; count++;
    Object.values(attrs).forEach(useRefs);
    if (tag === 'Reference') { if (refs.has(attrs.name)) fail(`two References named ${attrs.name}`); refs.add(attrs.name); }
    if (attrs.resource !== undefined) { used.add(attrs.resource); if (!drawables.has(attrs.resource)) fail(`resource "${attrs.resource}" has no res/drawable-nodpi/${attrs.resource}.png`); }
    if (attrs.family !== undefined && !fonts.has(attrs.family) && !bitmaps.has(attrs.family)) fail(`family "${attrs.family}" is neither res/font/${attrs.family}.ttf nor a BitmapFont`);
    if (attrs.displayName !== undefined && !strings.has(attrs.displayName)) fail(`displayName "${attrs.displayName}" missing from values/strings.xml`);
    if (tag === 'ListOption') up('UserConfigurations') ? options.add(attrs.id) : options.has(attrs.id) || fail(`ListOption ${attrs.id} not declared in UserConfigurations`);
    if (tag === 'Condition') e.names = new Set();
    if (tag === 'Expression') up('Condition')?.names.add(attrs.name);
    if (tag === 'Compare' && !up('Condition')?.names.has(attrs.expression)) fail(`Compare ${attrs.expression} has no Expression in its Condition`);
    if ((tag === 'Transform' && /^(angle|x|y)$/.test(attrs.target)) || tag === 'Gyro') parent.spin = true;
    if (tag === 'Variant') {
      if (attrs.mode !== 'AMBIENT') fail(`Variant mode ${attrs.mode} at ${where()} (v4 has AMBIENT only)`);
      if (+(attrs.startOffset || 0) + +(attrs.duration ?? 1) > 1 + 1e-6) fail(`Variant ${attrs.target} on ${parent.attrs.name || parent.tag}: startOffset + duration > 1, so startOffset is ignored`);
      if (!VARIANT.test(parent.tag)) fail(`Variant under <${parent.tag}> at ${where()}`);
      else if (attrs.target !== 'alpha' && !SPATIAL[parent.attrs.name]?.includes(attrs.target)) fail(`Variant target ${attrs.target} on ${parent.attrs.name || parent.tag} (07 §9.3: alpha; angle only on f2, x/y only on plate_shadow, dragon_shadow)`);
      if ((parent.variants ||= new Set()).has(attrs.target)) fail(`two Variants for ${attrs.target} on ${parent.attrs.name || parent.tag}`); parent.variants.add(attrs.target);
    }
    if (NODE.test(tag) || tag === 'TimeText') {
      const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(k => attrs[k] === undefined || attrs[k] === '' ? NaN : +attrs[k]);
      if (![x, y, w, h].every(Number.isFinite)) fail(`${tag} ${attrs.name || ''} lacks numeric x,y,width,height at ${where()}`);
      else { if (![x, y].every(Number.isInteger) || !(Number.isInteger(w) && w > 0 && Number.isInteger(h) && h > 0)) fail(`${tag} ${attrs.name || ''} x,y,width,height ${x},${y},${w},${h} (XSD: integer x,y; positive integer width,height)`);
        e.ox += x; e.oy += y; e.box = [e.ox, e.oy, e.ox + w, e.oy + h]; }
    }
    self ? close(e) : stack.push(e);
  }
  if (stack.length) fail(`unclosed: ${where()}`);
  const manifest = fs.readFileSync(path.join(root, module, 'manifest/AndroidManifest.xml'), 'utf8'), info = fs.readFileSync(path.join(res, 'xml/watch_face_info.xml'), 'utf8');
  for (const [re, what] of [[/android:hasCode="false"/, 'android:hasCode="false"'], [/watchface\.format\.version" android:value="4"/, 'property com.google.wear.watchface.format.version = 4'],
    [/<uses-feature android:name="android\.hardware\.type\.watch"/, 'uses-feature android.hardware.type.watch']])
    if (!re.test(manifest)) fail(`AndroidManifest.xml lacks ${what}`);
  if (!/watchface\.format\.publisher" android:value="[^"]+"/.test(manifest)) warn('AndroidManifest.xml has no (optional) com.google.wear.watchface.format.publisher property');
  if (+(/minSdkVersion="(\d+)"/.exec(manifest)?.[1] || 0) < 36) fail('minSdkVersion < 36 (WFF v4 Reference needs Wear OS 6, API 36)');
  const preview = /<Preview value="@drawable\/(\w+)"/.exec(info)?.[1];
  if (!preview || !drawables.has(preview)) fail(`watch_face_info.xml needs <Preview value="@drawable/..."/> naming an existing drawable (${preview || 'none'})`);
  let pixels = 0;
  for (const [id, file] of drawables) {
    if (!used.has(id)) { if (id !== preview) warn(`${id}.png is not referenced (${(fs.statSync(file).size/1024).toFixed(0)} KB in the APK)`); continue; }
    const b = fs.readFileSync(file);
    if (b.readUInt32BE(0) !== 0x89504e47 || b.toString('ascii', 12, 16) !== 'IHDR') { fail(`${id}.png is not a PNG`); continue; }
    if (b[24] !== 8 || b[25] !== 6) fail(`${id}.png is not RGBA8888 (depth ${b[24]}, colour type ${b[25]})`);
    pixels += b.readUInt32BE(16)*b.readUInt32BE(20)*4;
  }
  const fontBytes = list('font').reduce((s, f) => s + fs.statSync(path.join(res, 'font', f)).size, 0), total = pixels + fontBytes;
  if (total > BUDGET) fail(`memory ${(total/MB).toFixed(2)} MB over the 100 MB budget`);
  if (total > ESTIMATE) warn(`memory ${(total/MB).toFixed(2)} MB above the 07 §9.1 estimate of 5.7 MB`);
  console.log(`${module}: ${count} elements, ${refs.size} references, ${drawables.size} drawables, bitmaps ${(pixels/MB).toFixed(2)} MB + fonts ${(fontBytes/MB).toFixed(2)} MB = ${(total/MB).toFixed(2)} MB of 100 MB, xml ${(xml.length/1024).toFixed(0)} KB`);
  for (const w of warnings) console.log(`  warn ${w}`);
  for (const x of [...errors].slice(0, 40)) console.log(`  FAIL ${x}`);
  if (errors.size > 40) console.log(`  ... ${errors.size - 40} more`);
  failed += errors.size;
}
for (const module of process.argv.length > 2 ? process.argv.slice(2) : ['probe', 'main']) check(module);
console.log(failed ? `check-wff: ${failed} failures` : 'check-wff: ok');
process.exitCode = failed ? 1 : 0;
