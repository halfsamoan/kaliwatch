'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const W = require('../wff-expr.js'), { wffBox } = require('../wffbox.js');
const V = require('../vault5.js'), A = require('../astro.js'), Fonts = require('../orbit-fonts.js'), Stars = require('../stars.js');
const studio = path.resolve(__dirname, '..');
const esc = value => String(value).replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[x]));
const f = x => Number(x.toFixed(8)), arg = (name, fallback) => { const i = process.argv.indexOf(name); return i < 0 ? fallback : process.argv[i + 1]; };
const attributes = values => Object.entries(values).filter(([, v]) => v !== undefined).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
const tag = (name, attrs, body = '') => `<${name}${attributes(attrs)}>${body}</${name}>`;
const transform = (target, value) => tag('Transform', { target, value });
const group = (name, body, attrs = {}) => tag('Group', { name, x: 0, y: 0, width: 450, height: 450, pivotX: .5, pivotY: .5, ...attrs }, body);
const shape = body => tag('PartDraw', { x: 0, y: 0, width: 450, height: 450 }, body);
const stroke = (color, thickness, body = '', cap = 'BUTT') => tag('Stroke', { color, thickness, cap }, body);
const ellipse = (cx, cy, r, fill, outline = '') => tag('Ellipse', { x: cx-r, y: cy-r, width: r*2, height: r*2 }, fill ? tag('Fill', { color: fill }) + outline : outline);
const arc = (cx, cy, r, startAngle, endAngle, color, thickness, body = '', cap = 'ROUND') => tag('Arc', { centerX: cx, centerY: cy, width: r*2, height: r*2, startAngle, endAngle }, stroke(color, thickness, '', cap) + body);
const template = (text, values) => tag('Template', {}, esc(text) + values.map(expression => tag('Parameter', { expression })).join(''));
const families = { T0: 'martian_mono_wide_semibold', T1: 'martian_mono_std_medium', T2: 'martian_mono_std_medium', T3: 'martian_mono_cond_regular', T4: 'martian_mono_cond_regular', T5: 'martian_mono_std_regular' };
const sizes = { T0: Fonts.timeSize, T1: 15, T2: 13, T3: 10.5, T4: 7.5, T5: 11.5 }, tracking = { T0: 0, T1: .06, T2: 0, T3: .12, T4: .08, T5: .02 };
function text(name, content, x, baseline, width, tier, color, options = {}) {
  const size = options.size || sizes[tier], box = wffBox(size, baseline, options.height || Math.ceil(size*1.4));
  const font = tag('Font', { family: families[tier], size, color, weight: 'NORMAL', letterSpacing: tracking[tier] }, (options.colorExpr ? transform('color', options.colorExpr) : '') + content);
  return tag('PartText', { name, x: Math.round(x), y: box.y, width: Math.ceil(width), height: box.height },
    tag('Localization', { calendar: 'GREGORIAN', locales: 'en_US' }) + (options.transforms || '') + tag('Text', { align: options.align || 'CENTER', maxLines: 1 }, font));
}
function circular(name, content, cx, cy, radius, startAngle, endAngle, tier, color, options = {}) {
  // Radius is the studio textPath baseline; --circular-shift (em, outward for CLOCKWISE) recalibrates if T13 shows the device centres glyphs on the circle.
  radius = f(radius + Number(arg('--circular-shift', 0))*(options.size || sizes[tier])*(options.direction === 'CLOCKWISE' ? 1 : -1));
  return tag('PartText', { name, x: 0, y: 0, width: 450, height: 450 }, tag('TextCircular', {
    centerX: cx, centerY: cy, width: radius*2, height: radius*2, startAngle, endAngle,
    direction: options.direction || 'COUNTER_CLOCKWISE', align: 'CENTER' },
  tag('Font', { family: families[tier], size: options.size || sizes[tier], color, weight: 'NORMAL', letterSpacing: tracking[tier] }, content)));
}
function condition(name, cases, fallback = '') {
  return tag('Condition', {}, tag('Expressions', {}, cases.map((c, i) => tag('Expression', { name: `${name}_${i}` }, `<![CDATA[${c.expression}]]>`)).join('')) +
    cases.map((c, i) => tag('Compare', { expression: `${name}_${i}` }, c.body)).join('') + (fallback ? tag('Default', {}, fallback) : ''));
}
function variant(target, value, range, motion = 'calm') {
  const scale = 360/Math.max(360, Number(arg('--window-ms', 360))), still = motion === 'still';
  return tag('Variant', { mode: 'AMBIENT', target, value, startOffset: still ? 0 : f(range[0]/360*scale),
    duration: still ? 0 : f((range[1] - range[0])/360*scale), interpolation: 'CUBIC_BEZIER', controls: '0.22 1 0.36 1',
    angleDirection: target === 'angle' ? 'NONE' : undefined });
}
function modeGroup(name, body, ambient, range, motion, attrs = {}, extra = '') {
  return group(name, variant('alpha', ambient ? 255 : 0, range, motion) + extra + body, { alpha: ambient ? 0 : 255, ...attrs });
}
function wrapper(name, body, motion, amount, limit) {
  if (motion !== 'full') return group(name, body);
  return group(name, tag('Gyro', { x: `clamp(${amount}*[ACCELEROMETER_ANGLE_X], -${limit}, ${limit})`,
    y: `clamp(${amount}*[ACCELEROMETER_ANGLE_Y], -${limit}, ${limit})` }) + group(name + '_content', body, { x: 10, y: 10 }), { x: -10, y: -10, width: 470, height: 470 });
}
function document(body, bitmap = '') {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + tag('WatchFace', { width: 450, height: 450, clipShape: 'CIRCLE' },
    tag('Metadata', { key: 'CLOCK_TYPE', value: 'DIGITAL' }) + tag('Metadata', { key: 'PREVIEW_TIME', value: '20:08:24' }) +
    tag('UserConfigurations', {}, tag('ListConfiguration', { id: 'motion', displayName: 'motion', defaultValue: 'calm' },
      ['full', 'calm', 'still'].map(id => tag('ListOption', { id, displayName: id })).join(''))) + bitmap +
    tag('Scene', { backgroundColor: '#ff000000' }, W.carrierXml() + tag('ListConfiguration', { id: 'motion' }, body))) + '\n';
}
function probe() {
  const options = ['full', 'calm', 'still'].map(motion => {
    const label = text('probe_title', esc('G3 T1 T2 T9 T15'), 70, 82, 310, 'T1', '#ffeff8ec');
    const values = text('probe_refs', template('LST %s  SUN %s', ['numberFormat("0.00", [REFERENCE.lst])', 'numberFormat("0.00", [REFERENCE.lsun])']), 40, 143, 370, 'T2', '#ffa6f46a') +
      text('probe_chain', template('RA %s  DEC %s', ['numberFormat("0.00", [REFERENCE.asun])', 'numberFormat("0.00", [REFERENCE.dsun])']), 40, 170, 370, 'T2', '#ffb9c5ca') +
      text('probe_jd', template('JD %s', [`numberFormat("0.00", ${W.expression('jd')})`]), 40, 197, 370, 'T2', '#ffb9c5ca'); // T7/T8: float32 shows as JD 2461512.00
    const f2 = modeGroup('probe_f2', shape(arc(225, 225, 170, 0, 330, '#ff9aa6ab', 3)), false, [0,360], motion, {}, motion === 'still' ? '' : variant('angle', -14, [0,360], motion));
    const sky = modeGroup('probe_sky', shape(ellipse(225,105,7,'#ffa6f46a')), false, [0,200], motion, {}, transform('angle', W.expression('E3')));
    const tilt = wrapper('probe_parallax', shape(ellipse(225,330,10,'#ffeff8ec')), motion, .07, 3);
    const aod = modeGroup('probe_aod', text('probe_aod_label', esc('AMBIENT / REFERENCE LIVE'), 40, 290, 370, 'T2', '#ff7f9472'), true, [0,200], motion);
    return tag('ListOption', { id: motion }, group(`probe_${motion}`, label + values + f2 + sky + tilt + aod + clock(false,motion)));
  }).join('');
  return document(options);
}
function clock(ambient, motion) {
  const base = V.G.digits.base + Fonts.timeInkShiftY, box = wffBox(Fonts.timeSize, base, 86);
  let times;
  if (ambient) {
    const advance = 670*Fonts.timeSize/1000;
    times = [['hh_10',166-advance/2],['hh_1',166+advance/2],['mm_10',284-advance/2],['mm_1',284+advance/2]].map(([format,cx]) =>
      tag('TimeText', { x: Math.round(cx-23.5), y: 179, width: 47, height: 86, format, hourFormat: '24', align: 'CENTER' },
        tag('BitmapFont', { family: 'kw_outline', size: 86, color: '#ffffffff' }))).join('');
  } else times = [['hh',166],['mm',284]].map(([format,cx]) => tag('TimeText', { x: cx-50, y: box.y, width: 100, height: 86,
    format, hourFormat: '24', align: 'CENTER' }, tag('Font', { family: families.T0, size: Fonts.timeSize, color: '#ffeff8ec', weight: 'NORMAL' }))).join('');
  return tag('DigitalClock', { x: 0, y: 0, width: 450, height: 450, alpha: ambient ? 0 : 255 },
    variant('alpha', ambient ? 255 : 0, [120,340], motion) + times);
}
function build(manifest, options = {}) {
  const assets = Array.isArray(manifest) ? manifest : manifest.assets;
  if (!Array.isArray(assets)) throw new Error('Asset manifest must provide an assets array');
  const byId = Object.fromEntries(assets.map(a => [a.id.replace(/\.png$/, ''), a]));
  const required = ['sky_active','dome_light','flange_f2','crescent','rings','f1_gloss','plate_mask_aod','plate','plate_shadow','subdisc','dragon_relief','dragon_shadow','dragon_mask','cage_body','cage_shadow','jupiter','saturn','sun_star','infinity_aod','instrument', ...Array.from({length:9},(_,i)=>`luna_${i}`),...Array.from({length:10},(_,i)=>`kwo_${i}`)];
  for (const id of required) if (!byId[id]) throw new Error(`Missing required bake ${id}`);
  const image = (id, override = {}) => {
    const a = byId[id]; if (!a) throw new Error(`Missing bake ${id}`);
    const geom = { x: Math.round(a.x), y: Math.round(a.y), width: Math.round(a.designWidth||a.width), height: Math.round(a.designHeight||a.height), ...override };
    return tag('PartImage', { name:id,...geom }, tag('Image', { resource: a.resource || id }));
  };
  const expr = id => W.expression(id, options), solar = m => modeGroup('sun', group('sun_sprite',image('sun_star'),{x:225,y:34,width:1,height:1,pivotX:0,pivotY:0}), false, [200,360], m, {}, transform('angle', expr('E8')));
  const pt = (r,a,cx=225,cy=225) => [cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];
  const line = (a,r0,r1,cx=225,cy=225,color='#ff8a979c',thickness=1) => { const p=pt(r0,a,cx,cy),q=pt(r1,a,cx,cy);return tag('Line',{startX:f(p[0]),startY:f(p[1]),endX:f(q[0]),endY:f(q[1])},stroke(color,thickness)); };
  const months = Array.from({length:12},(_,m)=>{const ra=d=>V.solar(new Date(Date.UTC(2026,m,d,3)),0).asun;return {name:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][m],rule:ra(1),centre:ra(16),ticks:[5,10,15,20,25].map(d=>[d,ra(d)])};});
  const skyAod = shape(Object.values(V.PSTAR).filter(s=>s.mag<=2.5&&s.p.r<293).map(s=>ellipse(f(293+s.p.x),f(293+s.p.y),.8,'#ff5a6870')).join('')+
    [...new Set(Stars.figures.Dra.flat())].map(id=>V.PSTAR[id]).filter(Boolean).map(s=>ellipse(f(293+s.p.x),f(293+s.p.y),.8,'#ff4d633f')).join(''));
  const calendar = shape(months.map(m=>line(m.rule,189,202,225,225,'#99b9c5ca')+m.ticks.map(([d,a])=>d%10?line(a,189,191.5):line(a,189,194,225,225,'#ffc8d1d5',1.2)).join('')).join('')) +
    months.map(m=>circular('month_'+m.name,esc(m.name),225,225,202.6,m.centre+14,m.centre-14,'T3','#d9c8d1d5')).join('');
  function dates(ambient) {
    const tone=ambient?'#ff7f9472':'#ffeff8ec', base=185.6, t1=15*.7+.9, x=225-(12*t1+15.5+3*(7.5*.6+.6))/2; // vault5 centres the whole line at 225
    const date = text('date',tag('Upper',{},template('%s %s',['[DAY_Z]','[MONTH_S]'])),x,base,69,'T1',tone,{align:'START'});
    const weekday = text('weekday',tag('Upper',{},template('%s',['[DAY_OF_WEEK_S]'])),x+6*t1+7,base,35,'T1',ambient?tone:'#ffb9c5ca',{align:'START'});
    const signs=['ARI','TAU','GEM','CNC','LEO','VIR','LIB','SCO','SGR','CAP','AQR','PSC'];
    const sign = condition('sign',signs.map((s,i)=>({expression:`${expr('E11')} == ${i}`,body:text('sign_'+s,esc(s),x+9*t1+14,base,35,'T1',ambient?tone:'#ff9aa6ab',{align:'START'})})));
    const degree=text('sun_degree',template('%s°',[`numberFormat("00", ${expr('degreeInSign')})`]),x+12*t1+15.5,base-6,20,'T4',ambient?tone:'#ff9aa6ab',{align:'START'});
    return date+weekday+sign+degree;
  }
  function instruments() { // round 6: the camera-locked scale, site labels and register are baked; the telemetry fields stay live on vault5's path
    const field=(name,content,at,span)=>circular(name,content,225,225,175.5,f(200-56*at+span),f(200-56*at-span),'T4','#b3b9c5ca');
    return image('instrument')+field('telemetry_lst',template('LST %s:%s',[`numberFormat("00", ${expr('lstHour')})`,`numberFormat("00", ${expr('lstMinute')})`]),.308,9)+
      field('telemetry_jd',template('JD %s',[`numberFormat("0.00", ${expr('jd')})`]),.695,12);
  }
  function battery(ambient) { // vault5 centres value and raised % as one string at Q
    const n='([BATTERY_PERCENT] >= 100 ? 3 : ([BATTERY_PERCENT] >= 10 ? 2 : 1))',x0=`149 - (${n}*10.5 + 5.1)/2`,id=ambient?'bat_aod':'battery',tone=ambient?'#ff7f9472':'#ffeff8ec';
    const colorExpr=ambient?'[BATTERY_PERCENT] <= 15 ? colorRgb(138,106,44) : colorRgb(127,148,114)':'[BATTERY_PERCENT] <= 15 ? colorRgb(243,196,121) : colorRgb(239,248,236)';
    return text(id,template('%s',['[BATTERY_PERCENT]']),136,360,32,'T2',tone,{size:15,align:'START',colorExpr,transforms:transform('x',x0)})+
      text(id+'_percent',esc('%'),157,354,8,'T4',tone,{align:'START',colorExpr,transforms:transform('x',`${x0} + ${n}*10.5`)});
  }
  function subdisc() {
    const tracks=shape(arc(149,333,44,0,360,'#ff0b0e10',2)+arc(149,333,39.5,0,360,'#ff0b0e10',2));
    const bat=shape(tag('Arc',{centerX:149,centerY:333,width:88,height:88,startAngle:0,endAngle:0},transform('endAngle',expr('battery'))+stroke('#ffa6f46a',2,transform('color',expr('batteryColor')),'ROUND')));
    const steps=shape(arc(149,333,39.5,0,0,'#ffc8d1d5',2,transform('endAngle',expr('steps'))));
    let marks='';for(let p=0;p<100;p+=10)marks+=line(p*3.6,47,p%50?49:50.5,149,333,p%50?'#999aa6ab':'#b39aa6ab',p%50?.8:1.1)+line(p*3.6,35,36.8,149,333,'#739aa6ab',.8);
    const stepValue=condition('step_large',[{expression:'[STEP_COUNT] >= 10000',body:text('steps_k',template('%sk',[expr('stepsLarge')]),109,333.5,80,'T2','#ffeff8ec',{size:20})}],text('steps_int',template('%s',[expr('stepsSmall')]),109,333.5,80,'T2','#ffeff8ec',{size:20}));
    return image('subdisc')+tracks+bat+steps+shape(marks)+stepValue+
      text('step_goal',template('/%s',['numberFormat("#,##0", [STEP_GOAL])']),109,344,80,'T4','#bf9aa6ab')+
      battery(false)+
      circular('steps_label',esc('STEPS'),149,333,51.5,-18,18,'T4','#bf9aa6ab',{direction:'CLOCKWISE'})+circular('battery_label',esc('BAT'),149,333,51.5,80,100,'T4','#bf9aa6ab',{direction:'CLOCKWISE'});
  }
  const cursorAngle=180-((22*11.5*.7+21*.23)/2+2)/218.9*180/Math.PI, cursor=pt(218.9,cursorAngle); // vault5 promptLine: 2 px after INFINITY on the r 218.9 baseline
  function face(motion) {
    const names=V.ANCHORS.map(a=>{const p=A.polar(a.ra,a.dec,0,128,180,'stereographic');
      return group('name_'+a.name,transform('angle',expr('E17'))+text('name_text_'+a.name,esc(a.name),-24,14.2,48,'T3','#ccb9c5ca'),{x:Math.round(293+p.x),y:Math.round(293+p.y),width:1,height:1,pivotX:0,pivotY:0});}).join('');
    const planets=['jupiter','saturn'].map(name=>{const a=byId[name],b=W.bodyExpressions(name,a.width,a.height,options);
      return modeGroup(name,transform('x',b.x)+transform('y',b.y)+transform('angle',expr('E17'))+image(name,{x:0,y:0}),false,[40,240],motion,{width:Math.round(a.width),height:Math.round(a.height)});}).join('');
    const sky=modeGroup('sky_active',image('sky_active',{x:0,y:0})+modeGroup('names',names,false,[40,240],motion)+planets,false,[0,200],motion,{x:-68,y:-179,width:586,height:586,pivotX:.5,pivotY:.5},transform('angle',expr('E3')));
    const luna=modeGroup('luna',condition('moon',Array.from({length:9},(_,i)=>({expression:`${expr('E12')} == ${i}`,body:image('luna_'+i)}))),false,[40,240],motion);
    const skyPlane=wrapper('par_sky',sky+luna+modeGroup('dome_light',image('dome_light'),false,[40,240],motion),motion,.07,3);
    const aodSky=modeGroup('sky_aod_mount',skyAod,true,[0,200],motion,{x:-68,y:-179,width:586,height:586,pivotX:.5,pivotY:.5},transform('angle',expr('E3')));
    const occluder=modeGroup('occluder_aod',shape(ellipse(225,225,211,null,stroke('#ff000000',58))),true,[40,240],motion);
    const ground=modeGroup('ground_aod',shape(ellipse(225,280.4,360,null,stroke('#ff000000',300.2))),true,[40,240],motion);
    const lunaAod=modeGroup('luna_aod',shape(ellipse(390,206,46,'#ff000000'))+condition('moon_limb',[{expression:`${expr('E12')} != 0`,body:shape(arc(390,206,45,225,363.6,'#ff6b7a80',1.2))}]),true,[0,160],motion);
    const marks=shape(Array.from({length:12},(_,i)=>i===6?'':line(i*30,195,202,225,225,'#ff4d633f',1.25)).join('')+arc(225,280.4,209.9,-50.7,-25,'#ff2c3a33',1)+arc(225,280.4,209.9,25,50.7,'#ff2c3a33',1));
    const numerals=[['00',0],['06',270],['18',90]].map(([s,a])=>{const bottom=a>90&&a<270;return circular('aod_f2_'+s,esc(s),225,225,214.25+(bottom?1:-1)*13*.4,a+(bottom?8:-8),a+(bottom?-8:8),'T2','#ff4d633f',{direction:bottom?'COUNTER_CLOCKWISE':'CLOCKWISE'});}).join('');
    const aodMarks=modeGroup('aod_marks',marks+numerals+image('infinity_aod'),true,[40,240],motion);
    const aodLive=modeGroup('aod_live',group('sun_aod_mount',transform('angle',expr('E8'))+shape(ellipse(225,34,2.5,'#ff8a6a2c')))+group('cage_aod_mount',transform('angle',expr('E3'))+shape(ellipse(225,43,12,null,stroke('#ff5e7a55',1.2)))),true,[200,360],motion);
    const subAod=modeGroup('subdisc_aod',shape(ellipse(149,333,60,'#ff000000')+arc(149,333,59.25,45,171,'#ff2c3a33',1))+
      battery(true),true,[0,160],motion);
    const sub=modeGroup('subdisc',subdisc(),false,[80,320],motion);
    const rings=image('rings');
    const ringPlane=wrapper('par_rings',modeGroup('crescent',image('crescent'),false,[40,240],motion)+modeGroup('instrument',instruments(),false,[40,240],motion)+modeGroup('rings',rings,false,[40,240],motion)+
      modeGroup('calendar',calendar,false,[40,240],motion,{},transform('angle',expr('E4')))+modeGroup('f1_gloss',image('f1_gloss'),false,[40,240],motion)+solar(motion)+
      modeGroup('live',shape(arc(225,225,184.5,0,0,'#ff3c6328',1.2,transform('startAngle',expr('trailStart'))+transform('endAngle',expr('trailEnd')),'BUTT')+
        arc(225,225,184.5,0,0,'#ffa6f46a',1.6,transform('startAngle',`(${expr('trailEnd')}) - 6*clamp([SECOND], 0, 5/6)`)+transform('endAngle',expr('trailEnd')),'BUTT'))+
        group('trail_tip',transform('angle',expr('trailEnd'))+transform('alpha','[SECOND] > 0 ? 255 : 0')+shape(ellipse(225,40.5,1.3,'#ffd2ffa4'))),false,[200,360],motion)+
      group('cage_orbit',transform('angle',expr('E3'))+modeGroup('cage_frame',transform('angle',expr('E17'))+image('cage_shadow')+image('cage_body')+
        group('carriage',transform('angle',expr('carriage'))+shape([0,120,240].map(a=>{const p=pt(2.5,a,10,10),q=pt(9,a,10,10);return tag('Line',{startX:f(p[0]),startY:f(p[1]),endX:f(q[0]),endY:f(q[1])},stroke('#ff0a0f11',1.4,'','ROUND'));}).join('')+
          ellipse(10,10,6.5,null,stroke('#ff1f3315',1))+ellipse(10,10,1.75,'#ffeff8ec',stroke('#ff1f3315',.8))),{x:-10,y:-10,width:20,height:20}),false,[200,360],motion,{x:225,y:43,width:1,height:1,pivotX:0,pivotY:0}))+ 
      modeGroup('f2',image('flange_f2')+shape(arc(225,225,215,0,0,'#59000000',20,transform('startAngle',expr('E10start'))+transform('endAngle',expr('E10end'))))+
        group('cursor',transform('alpha',`(${expr('cursor')}) ? 255 : 0`)+shape(tag('Rectangle',{x:f(cursor[0]),y:f(cursor[1]-9),width:5,height:9},tag('Fill',{color:'#ffa6f46a'}))),{pivotX:f(cursor[0]/450),pivotY:f(cursor[1]/450),angle:f(cursorAngle-180)}),false,[0,360],motion,{},motion==='still'?'':variant('angle',-14,[0,360],motion)),motion,.035,1.5);
    const plateMask=modeGroup('plate_mask_aod',image('plate_mask_aod'),true,[320,360],motion);
    const shadow=(id)=>{const a=byId[id];return modeGroup(id,image(id),false,[120,360],motion,{},motion==='still'?'':variant('x',-3,[120,360],motion)+variant('y',-3,[120,360],motion));};
    const plate=shadow('plate_shadow')+modeGroup('plate',image('plate'),false,[80,320],motion);
    const date=modeGroup('date',dates(false),false,[120,340],motion)+modeGroup('date_aod',dates(true),true,[120,340],motion);
    const dragon=wrapper('par_dragon',shadow('dragon_shadow')+modeGroup('dragon_relief',image('dragon_relief'),false,[120,360],motion),motion,-.02,1)+modeGroup('dragon_aod',image('dragon_mask',{tintColor:'#ff4e6644'}),true,[120,360],motion);
    const colon=modeGroup('colon',text('colon_text',esc(':'),201,248.3+Fonts.timeInkShiftY,48,'T0','#ffa6f46a',{height:86}),false,[120,340],motion)+
      modeGroup('colon_aod',text('colon_aod_text',tag('Outline',{color:'#ff5e7a55',thickness:1})+esc(':'),201,248.3+Fonts.timeInkShiftY,48,'T0','#ff0c160b',{height:86}),true,[120,340],motion);
    return skyPlane+aodSky+occluder+ground+lunaAod+aodMarks+aodLive+subAod+sub+ringPlane+plateMask+plate+date+dragon+clock(false,motion)+colon+clock(true,motion);
  }
  const bitmap=tag('BitmapFonts',{},tag('BitmapFont',{name:'kw_outline'},Array.from({length:10},(_,i)=>tag('Character',{name:i,resource:byId['kwo_'+i].resource||'kwo_'+i,width:47,height:86})).join('')));
  return document(['full','calm','still'].map(m=>tag('ListOption',{id:m},group('face_'+m,face(m)))).join(''),bitmap);
}
function generate() {
  const out=path.resolve(arg('--out',path.join(studio,'wff'))),manifestPath=path.resolve(arg('--manifest',path.join(studio,'assets/manifest.json')));
  fs.mkdirSync(out,{recursive:true});
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')),assets=Array.isArray(manifest)?manifest:manifest.assets;
  const mainXml=build(manifest,{inlineReferences:process.argv.includes('--inline-references')});
  const files=[];
  function write(relative,content){const file=path.join(out,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);files.push(relative);}
  for(const module of ['main','probe']){
    fs.rmSync(path.join(out,module,'res/drawable-nodpi'),{recursive:true,force:true}); // generated output; drops stale bakes
    write(`${module}/res/raw/watchface.xml`,module==='main'?mainXml:probe());
    write(`${module}/manifest/AndroidManifest.xml`,`<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="org.kaliwatch.g3${module==='probe'?'.probe':''}"><uses-sdk android:minSdkVersion="36" android:targetSdkVersion="36"/><uses-feature android:name="android.hardware.type.watch"/><application android:hasCode="false" android:label="Kaliwatch G3${module==='probe'?' Probe':''}"><property android:name="com.google.wear.watchface.format.version" android:value="4"/><property android:name="com.google.wear.watchface.format.publisher" android:value="kaliwatch-gen-wff-0.6.0"/></application></manifest>\n`);
    write(`${module}/res/xml/watch_face_info.xml`,'<WatchFaceInfo><Preview value="@drawable/preview"/><Editable value="true"/></WatchFaceInfo>\n');
    write(`${module}/res/values/strings.xml`,'<resources><string name="motion">Motion</string><string name="full">Full (tilt)</string><string name="calm">Calm</string><string name="still">Still</string></resources>\n');
    for(const [source,target]of [['MartianMono-Wide-SemiBold.ttf',families.T0],['MartianMono-Std-Medium.ttf',families.T1],['MartianMono-Std-Regular.ttf',families.T5],['MartianMono-Cond-Regular.ttf',families.T4]])write(`${module}/res/font/${target}.ttf`,fs.readFileSync(path.join(studio,'fonts',source)));
    write(`${module}/build.gradle`, `plugins { id 'com.android.application' }\nandroid { namespace 'org.kaliwatch.g3${module==='probe'?'.probe':''}'; compileSdk 36; defaultConfig { applicationId 'org.kaliwatch.g3${module==='probe'?'.probe':''}'; minSdk 36; targetSdk 36; versionCode 6; versionName '0.6.0' }; sourceSets { main { manifest.srcFile 'manifest/AndroidManifest.xml'; res.srcDirs = ['res'] } } }\n`);
  }
  for(const a of assets){const id=a.resource||a.id.replace(/\.png$/,''),source=path.isAbsolute(a.file)?a.file:path.resolve(studio,a.file); // f1_calendar (T13 fallback) is baked but not shipped
    for(const module of id==='preview'?['main','probe']:mainXml.includes(`resource="${id}"`)?['main']:[])write(`${module}/res/drawable-nodpi/${id}.png`,fs.readFileSync(source));}
  write('settings.gradle',"pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }\ndependencyResolutionManagement { repositories { google(); mavenCentral() } }\nrootProject.name = 'KaliwatchG3'\ninclude ':main', ':probe'\n");
  write('build.gradle',"plugins { id 'com.android.application' version '8.13.0' apply false }\n");
  write('FONT-LICENSE.txt',fs.readFileSync(path.join(studio,'fonts/MartianMono-OFL.txt')));
  write('build-manifest.json',JSON.stringify({formatVersion:4,design:{width:450,height:450},device:{width:480,height:480},defaultMotion:'calm',sourceManifest:manifestPath,inlineReferences:process.argv.includes('--inline-references'),xmlSha256:crypto.createHash('sha256').update(mainXml).digest('hex'),status:'XML/resources generated; APK and device behavior not established',files},null,2)+'\n');
  console.log(`Generated WFF4 main and T1/T2/T9/T15 probe in ${out}`);
}
if(require.main===module)generate();
module.exports={build,probe,clock,variant,wffBox};
