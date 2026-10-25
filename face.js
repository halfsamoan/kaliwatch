(function (root) {
  'use strict';
  const T=root.OrbitTokens||(typeof require!=='undefined'&&require('./tokens.js'));
  const dragon=root.KaliDragon||(typeof require!=='undefined'&&require('./dragon-data.js'));
  const Sky=root.OrbitCelestial||(typeof require!=='undefined'&&require('./celestial.js'));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const point=(r,angle)=>[225+r*Math.sin(angle*Math.PI/180),225-r*Math.cos(angle*Math.PI/180)];
  const p=a=>a.map(v=>v.toFixed(3)).join(' ');
  function arc(r,start,end){return end<=start?'':`M ${p(point(r,start))} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${p(point(r,end))}`;}
  function normalize(input={}){
    const time=/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(input.time||'')?input.time:T.sample.time;
    const date=/^\d{4}-\d{2}-\d{2}$/.test(input.date||'')?new Date(input.date+'T12:00:00Z'):new Date(T.sample.date+'T12:00:00Z');
    return {mode:input.mode==='ambient'?'ambient':'active',time:time.length===5?time+':00':time,date:Number.isNaN(date.getTime())?new Date(T.sample.date+'T12:00:00Z'):date,
      battery:input.battery===null?null:Math.max(0,Math.min(100,Number.isFinite(input.battery)?Math.round(input.battery):78)),steps:input.steps===null?null:Math.max(0,Math.min(99999,Number.isFinite(input.steps)?Math.round(input.steps):6240)),
      monochrome:!!input.monochrome,guides:!!input.guides,fontData:input.fontData||'',backgroundOnly:!!input.backgroundOnly};
  }
  function render(input={}){
    const s=normalize(input),c=T.color,ambient=s.mode==='ambient',a=s.monochrome?'#DCE5DA':c.phosphor;
    const h=s.time.slice(0,2),m=s.time.slice(3,5),second=Number(s.time.slice(6));
    const date=`${String(s.date.getUTCDate()).padStart(2,'0')} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][s.date.getUTCMonth()]} / ${['SUN','MON','TUE','WED','THU','FRI','SAT'][s.date.getUTCDay()]}`;
    const battery=s.battery===null?'—':String(s.battery),steps=s.steps===null?'—':s.steps.toLocaleString('en-US');
    const font=s.fontData?`@font-face{font-family:OrbitMono;src:url(data:font/ttf;base64,${s.fontData})}`:'';
    const on=ambient?0:1,off=ambient?1:0;
    const cosmos=Sky.render({mode:s.mode,monochrome:s.monochrome,variant:'observatory'});
    let ticks='',sleepTicks='';
    for(let i=0;i<60;i++)ticks+=`<path d="M ${p(point(i%5===0?202:207,i*6))} L ${p(point(211,i*6))}" stroke="${i%5===0?'#526650':c.dim}" stroke-width="${i%5===0?1.6:1}"/>`;
    for(let i=0;i<12;i++)sleepTicks+=`<path d="M ${p(point(i%3===0?202:207,i*30))} L ${p(point(211,i*30))}"/>`;
    const crest=`<g id="dragon" color="${ambient?(s.monochrome?'#879281':c.ambientDragon):a}" opacity="${ambient?.85:.96}"><svg x="135" y="24" width="180" height="123" viewBox="5 22 126 94" overflow="visible" aria-label="Official Kali Linux dragon">${dragon.body}</svg></g>`;
    const time=`<g id="time" fill="${ambient?c.ambient:c.white}" stroke="${c.ambientStroke}" stroke-width="1.4" stroke-opacity="${off}" font-size="78" font-weight="600" text-anchor="middle" aria-label="${h}:${m}"><text x="166" y="252">${h}</text><text id="time-colon" x="225" y="248" fill="${ambient?c.ambient:a}">:</text><text x="284" y="252">${m}</text></g>`;
    const activeOrbit=`<g id="orbit-active" opacity="${on}" visibility="${ambient?'hidden':'visible'}" style="transform-box:view-box;transform-origin:225px 225px">${ticks}<circle cx="225" cy="225" r="192" fill="none" stroke="${c.track}" stroke-width="1"/><path id="second-trail" d="${arc(192,0,Math.max(.01,second*6))}" fill="none" stroke="${a}" stroke-width="1.7" opacity=".72"/><g id="second-marker" transform="rotate(${second*6} 225 225)"><circle cx="225" cy="33" r="3.3" fill="${a}"/><path d="M225 23v-5" stroke="${a}" stroke-width="1.5"/></g></g>`;
    const sleepingOrbit=`<g id="orbit-ambient" opacity="${off}" visibility="${ambient?'visible':'hidden'}" fill="none" stroke="#4D633F" stroke-width="1.25">${[12,102,192,282].map(start=>`<path d="${arc(192,start,start+48)}"/>`).join('')}<g stroke="${c.ambientSecondary}">${sleepTicks}</g></g>`;
    const brand=`<g id="brand-label" opacity="${ambient?.65:1}"><text x="225" y="153" text-anchor="middle" font-size="12" letter-spacing="3" fill="${ambient?c.ambientSecondary:a}">KALI / ORBIT</text></g>`;
    const dateLayer=`<g id="date-layer" fill="${ambient?c.ambientSecondary:c.secondary}"><text x="225" y="181" text-anchor="middle" font-size="17">${date}</text></g>`;
    const telemetry=`<g id="telemetry" opacity="${on}" visibility="${ambient?'hidden':'visible'}" text-anchor="middle"><text id="seconds" x="225" y="282" fill="${c.secondary}" font-size="15">SEC ${String(second).padStart(2,'0')}</text><text x="133" y="312" font-size="15" fill="${c.secondary}">BATTERY</text><text id="battery-value" x="133" y="343" font-size="27" fill="${s.battery!==null&&s.battery<=15?c.warning:c.white}">${battery}${s.battery===null?'':'%'}</text><text x="315" y="312" font-size="15" fill="${c.secondary}">STEPS</text><text id="steps-value" x="315" y="343" font-size="27" fill="${c.white}">${steps}</text><path d="M225 305v43" stroke="${c.dim}" stroke-width="1"/><path d="M97 357h72 M279 357h72" stroke="${c.track}" stroke-width="2"/><path id="battery-gauge" d="M97 357h${s.battery===null?0:72*s.battery/100}" stroke="${s.battery!==null&&s.battery<=15?c.warning:a}" stroke-width="2"/><path d="M279 357h${s.steps===null?0:72*Math.min(1,s.steps/10000)}" stroke="${a}" stroke-width="2"/><text x="225" y="389" font-size="13" fill="${c.secondary}">kali@orbit:~$ <tspan fill="${a}">INFINITY</tspan></text></g>`;
    const ambientDetail=`<g id="ambient-detail" opacity="${off}" visibility="${ambient?'visible':'hidden'}" fill="${c.ambientSecondary}" text-anchor="middle"><text x="225" y="329" font-size="17">BAT ${battery}${s.battery===null?'':'%'}</text><path d="M150 323h18 M282 323h18" fill="none" stroke="${c.ambientSecondary}" stroke-width="1"/><text id="ambient-signature" x="225" y="375" font-size="11" letter-spacing="2" fill="${c.ambientSecondary}">INFINITY</text></g>`;
    let body=cosmos+sleepingOrbit+activeOrbit+crest+brand+dateLayer+time+telemetry+ambientDetail;
    if(s.backgroundOnly)body=cosmos+sleepingOrbit.replace('opacity="0"','opacity="1"').replace('visibility="hidden"','visibility="visible"')+crest+brand;
    if(s.guides)body+=`<g id="guides" fill="none" stroke="#E9A5FF" stroke-width=".8" stroke-dasharray="3 5" opacity=".65"><circle cx="225" cy="225" r="171"/><path d="M0 225h450 M225 0v450"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 450 450" role="img" aria-label="${esc(ambient?'KALI Orbit ambient watch face':'KALI Orbit watch face')}"><title>${esc(T.name)} / ${s.mode}</title><defs><clipPath id="dial-clip"><circle cx="225" cy="225" r="225"/></clipPath><style>${font}text{font-family:OrbitMono,'Roboto Mono',Consolas,monospace;font-variant-numeric:tabular-nums}</style></defs><g clip-path="url(#dial-clip)"><rect width="450" height="450" fill="#000000"/>${body}</g></svg>`;
  }
  root.OrbitFace={render,normalize,arc,point};if(typeof module!=='undefined')module.exports=root.OrbitFace;
})(typeof globalThis!=='undefined'?globalThis:this);
