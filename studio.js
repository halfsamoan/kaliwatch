(function () {
  'use strict';
  const $ = id => document.getElementById(id), T = OrbitTokens;
  const state = {mode:'active',time:T.sample.time,date:T.sample.date,battery:78,steps:6240,monochrome:false,guides:false,live:false,reduced:false,slow:false};
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let timer = null, replayTimer = null, visible = true;
  const animations = new Set();
  const reduced = () => state.reduced || media.matches;
  const duration = ms => state.slow ? ms*10 : ms;
  function stopReplay() {clearTimeout(replayTimer);replayTimer=null;}
  function cancelMotion() {stopReplay();for (const a of animations) a.cancel(); animations.clear(); }
  function play(el,keyframes,ms,options={}) {
    if(!el || reduced() || document.hidden || !visible) return null;
    const a=el.animate(keyframes,{duration:duration(ms),easing:T.motion.ease,fill:'none',...options});
    animations.add(a); a.onfinish=()=>animations.delete(a); a.oncancel=()=>animations.delete(a); return a;
  }
  function caption() {
    $('state-caption').textContent=`${state.mode==='ambient'?'ALWAYS ON':'INTERACTIVE'} / ${state.monochrome?'MONO':'PHOSPHOR'}`;
    $('wake').disabled=reduced();
    $('motion-status').textContent=reduced()?'저감 모션 적용 · 모든 전환을 즉시 표시합니다.':state.mode==='ambient'?'정지된 드래곤과 윤곽 시각 · Active를 누르면 깨어납니다.':`AOD 윤곽에서 드래곤·궤도 점등 · ${state.slow?'10% 속도 검토':'360 ms'}`;
    $('seconds-output').value=state.time.slice(6);
    $('seconds-range').value=Number(state.time.slice(6));
    $('time-input').value=state.time.slice(0,5);
    $('time-input').disabled=state.live; $('seconds-range').disabled=state.live;
  }
  const tracks=[
    ['celestial-active',['opacity','visibility']],['celestial-ambient',['opacity','visibility']],['celestial-front-light',['opacity']],
    ['dragon',['color','opacity']],['time',['fill','strokeOpacity']],['time-colon',['fill']],
    ['orbit-active',['opacity','transform','visibility']],['orbit-ambient',['opacity','visibility']],
    ['brand-label',['opacity']],['date-layer',['fill']],['telemetry',['opacity','visibility']],['ambient-detail',['opacity','visibility']]
  ];
  function snapshot(){
    return Object.fromEntries(tracks.map(([id,props])=>{
      const el=$('face').querySelector('#'+id),style=el&&getComputedStyle(el);
      return [id,style?Object.fromEntries(props.map(prop=>[prop,style[prop]])):null];
    }));
  }
  function patch(current,target){
    if(current.nodeType!==target.nodeType||current.nodeName!==target.nodeName){current.replaceWith(target.cloneNode(true));return;}
    if(current.nodeType===Node.TEXT_NODE){if(current.data!==target.data)current.data=target.data;return;}
    if(current.nodeType!==Node.ELEMENT_NODE)return;
    for(const attr of [...current.attributes])if(!target.hasAttribute(attr.name))current.removeAttribute(attr.name);
    for(const attr of target.attributes)if(current.getAttribute(attr.name)!==attr.value)current.setAttribute(attr.name,attr.value);
    if(current.childNodes.length!==target.childNodes.length){current.replaceChildren(...[...target.childNodes].map(n=>n.cloneNode(true)));return;}
    [...target.childNodes].forEach((child,i)=>patch(current.childNodes[i],child));
  }
  function render(transition=false,keepMotion=false) {
    // Capture interrupted styles before cancelling, then reuse the same SVG nodes.
    const before=transition?snapshot():null;
    if(!keepMotion)cancelMotion();
    const template=document.createElement('template');template.innerHTML=OrbitFace.render(state);
    const current=$('face').firstElementChild,target=template.content.firstElementChild;
    if(current)patch(current,target);else $('face').append(target);
    caption();
    if(transition&&!reduced()){
      const after=snapshot(),enter=state.mode==='active';
      for(const [id]of tracks){
        if(!before[id]||!after[id])continue;
        const from={...before[id]},to={...after[id]};
        let ms=enter?T.motion.settleMs:T.motion.ambientEnterMs,delay=0;
        if(id==='dragon')ms=enter?280:180;
        if(id==='orbit-active'){
          ms=enter?T.motion.ambientExitMs:180;
          if(enter&&Number(from.opacity)<.01)from.transform='rotate(-14deg)';
          to.transform='rotate(0deg)';
        }
        if(id==='telemetry'&&enter){ms=T.motion.telemetryMs;delay=T.motion.telemetryDelayMs;}
        if(id==='ambient-detail')ms=enter?120:180;
        if(id==='celestial-active')ms=enter?220:180;
        if(id==='celestial-ambient')ms=enter?180:180;
        if(id==='celestial-front-light'){ms=enter?180:120;delay=enter?40:0;}
        // Hidden layers stay paintable during the fade, then become explicitly hidden.
        if('visibility'in to){from.visibility='visible';to.visibility='visible';}
        if(Object.keys(to).every(prop=>from[prop]===to[prop]))continue;
        play($('face').querySelector('#'+id),[from,to],ms,{delay:duration(delay),fill:'backwards'});
      }
    }
  }
  function syncClock() {
    const d=new Date();
    state.time=[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
    state.date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function schedule() {
    clearTimeout(timer); timer=null;
    if(!state.live || document.hidden || !visible) return;
    const cadence=state.mode==='ambient'?T.motion.ambientCadenceMs:T.motion.secondsCadenceMs;
    timer=setTimeout(()=>{syncClock();render(false,true);schedule();},cadence-(Date.now()%cadence)+8);
  }
  function setMode(mode,transition=true) {
    stopReplay();
    if(state.mode===mode) return;
    state.mode=mode; if(state.live)syncClock();
    $('active').setAttribute('aria-pressed',String(mode==='active'));
    $('ambient').setAttribute('aria-pressed',String(mode==='ambient'));
    render(transition);schedule();
  }
  $('active').onclick=()=>setMode('active');$('ambient').onclick=()=>setMode('ambient');
  function palette(monochrome) {
    state.monochrome=monochrome;
    $('mono').setAttribute('aria-pressed',String(monochrome));$('green').setAttribute('aria-pressed',String(!monochrome));render();
  }
  $('green').onclick=()=>palette(false);$('mono').onclick=()=>palette(true);
  $('motion').onchange=e=>{state.reduced=e.target.checked;cancelMotion();caption();};
  media.addEventListener('change',()=>{cancelMotion();caption();});
  $('slow').onchange=e=>{state.slow=e.target.checked;cancelMotion();caption();};
  $('wake').onclick=()=>{
    if(reduced())return;
    cancelMotion();setMode('ambient',false);
    replayTimer=setTimeout(()=>{replayTimer=null;setMode('active',true);},140);
  };
  $('time-input').oninput=e=>{if(e.target.value){state.time=e.target.value+':'+state.time.slice(6);render();}};
  $('seconds-range').oninput=e=>{state.time=state.time.slice(0,6)+String(e.target.value).padStart(2,'0');render();};
  $('data-state').onchange=e=>{
    const values={normal:[78,6240],low:[12,6240],missing:[null,null],long:[100,99999]}[e.target.value];
    [state.battery,state.steps]=values;render();
  };
  $('face-size').onchange=e=>{
    const size=Number(e.target.value);
    $('face').style.maxWidth=size+'px';
    $('face').style.margin='auto';
    $('size-caption').textContent=`${size} px MAX / FIT TO VIEW`;
  };
  $('guides').onchange=e=>{state.guides=e.target.checked;render();};
  $('live').onchange=e=>{state.live=e.target.checked;if(state.live)syncClock();else{state.time=T.sample.time;state.date=T.sample.date;}render();schedule();};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelMotion();else if(state.live){syncClock();render();}schedule();});
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible)cancelMotion();else if(state.live){syncClock();render();}
    schedule();
  },{threshold:.05}).observe($('face'));
  function svgForExport() {return OrbitFace.render({...state,guides:false,fontData:window.OrbitFontData});}
  function download(blob,name) {
    const url=URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('export-svg').onclick=()=>{
    download(new Blob([svgForExport()],{type:'image/svg+xml'}),`kali-orbit-${state.mode}.svg`);
    $('export-status').textContent='현재 화면의 SVG를 저장했습니다. 가이드는 제외됩니다.';
  };
  $('export-png').onclick=async()=>{
    const url=URL.createObjectURL(new Blob([svgForExport()],{type:'image/svg+xml'}));
    try{
      const img=new Image();img.src=url;await img.decode();
      const canvas=document.createElement('canvas');canvas.width=canvas.height=900;
      canvas.getContext('2d').drawImage(img,0,0,900,900);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob)throw new Error('PNG 생성 실패');download(blob,`kali-orbit-${state.mode}-900.png`);
      $('export-status').textContent='현재 화면의 900 × 900 PNG를 저장했습니다.';
    }catch(error){$('export-status').textContent='PNG 저장 실패 · SVG 저장을 이용해 주세요.';console.error(error);}
    finally{URL.revokeObjectURL(url);}
  };
  render();
  $('active-mini').innerHTML=OrbitFace.render();
  $('ambient-mini').innerHTML=OrbitFace.render({mode:'ambient'});
  $('reduced-mini').innerHTML=OrbitFace.render();
  // The test surface exposes design state only; it never connects to hardware.
  window.OrbitStudio={state,setMode,render,reduced,cancelMotion,svgForExport,
    diagnostics:()=>({mode:state.mode,reduced:reduced(),animations:animations.size,replayPending:replayTimer!==null,timerScheduled:timer!==null,visible,hidden:document.hidden})};
})();
