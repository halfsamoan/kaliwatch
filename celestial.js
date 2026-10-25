(function(root){
  'use strict';
  const presets={
    cassini:{cx:350,cy:108,r:40,tilt:-25,fadeStart:281,fadeEnd:320,material:.88},
    observatory:{cx:458,cy:102,r:126,tilt:-26,fadeStart:345,fadeEnd:372,material:.59},
    eclipse:{cx:354,cy:108,r:44,tilt:-22,fadeStart:282,fadeEnd:312,material:.84}
  };
  const f=n=>Number(n.toFixed(3));
  function render({mode='active',monochrome=false,variant='observatory'}={}){
    const P=presets[variant]||presets.observatory,{cx,cy,r,tilt}=P;
    const ambient=mode==='ambient',on=ambient?0:1,off=ambient?1:0;
    const uid='sky-'+variant+(monochrome?'-mono':''),url=name=>`url(#${uid}-${name})`;
    const hue=monochrome?{light:'#B2B9AE',mid:'#53615B',dark:'#15201C',ring:'#9EA997',edge:'#9BAD96'}:{light:'#A2B7A2',mid:'#43686C',dark:'#10272F',ring:'#A5B49B',edge:'#8DAE9D'};
    const outer=r*1.95,inner=r*1.18,ratio=.205,n=18;
    let rings='',bands='',skeleton='';
    function annulus(k1,k2,opacity){
      const x1=f(r*k1),y1=f(x1*ratio),x2=f(r*k2),y2=f(x2*ratio);
      return `<path d="M ${-x2} 0 A ${x2} ${y2} 0 1 0 ${x2} 0 A ${x2} ${y2} 0 1 0 ${-x2} 0 Z M ${-x1} 0 A ${x1} ${y1} 0 1 1 ${x1} 0 A ${x1} ${y1} 0 1 1 ${-x1} 0 Z" fill="${hue.ring}" fill-rule="evenodd" opacity="${opacity}"/>`;
    }
    rings=annulus(1.18,1.40,.18)+annulus(1.40,1.66,.46)+annulus(1.73,1.91,.35);
    for(let i=0;i<n;i++){
      const u=i/(n-1);if(u>.625&&u<.705)continue;
      const rx=inner+(outer-inner)*u,op=.13+.17*(.5+.5*Math.sin(i*1.73));
      rings+=`<ellipse cx="0" cy="0" rx="${f(rx)}" ry="${f(rx*ratio)}" fill="none" stroke="${hue.ring}" stroke-width="${f((outer-inner)/n*.78)}" opacity="${f(op)}"/>`;
    }
    for(let i=0;i<24;i++){
      const t=-.91+i*.077,y=t*r,w=Math.sqrt(Math.max(0,1-t*t))*r;
      bands+=`<path d="M ${f(-w)} ${f(y)} C ${f(-w*.38)} ${f(y+r*.07)} ${f(w*.38)} ${f(y+r*.07)} ${f(w)} ${f(y)}" fill="none" stroke="${i%3===0?hue.light:'#07171D'}" stroke-width="${f(r*(i%4===0?.022:.011))}" opacity="${i%3===0?.10:.14}"/>`;
    }
    for(const k of [1.2,1.63,1.91])skeleton+=`<ellipse cx="0" cy="0" rx="${f(r*k)}" ry="${f(r*k*ratio)}" fill="none" stroke="${hue.edge}" stroke-width="${f(r*.0065)}" opacity=".43"/>`;
    const defs=`<defs>
      <radialGradient id="${uid}-sphere" gradientUnits="userSpaceOnUse" cx="${f(-r*.34)}" cy="${f(-r*.46)}" r="${f(r*1.48)}"><stop stop-color="${hue.light}"/><stop offset=".34" stop-color="${hue.mid}"/><stop offset=".69" stop-color="${hue.dark}"/><stop offset="1" stop-color="#010506"/></radialGradient>
      <linearGradient id="${uid}-night" x1="0" y1="0" x2="1" y2=".4"><stop offset=".32" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity=".86"/></linearGradient>
      <linearGradient id="${uid}-window" gradientUnits="userSpaceOnUse" x1="${P.fadeStart}" y1="0" x2="${P.fadeEnd}" y2="0"><stop stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="${uid}-space-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><rect width="450" height="450" fill="${url('window')}"/></mask>
      <linearGradient id="${uid}-body-window" gradientUnits="userSpaceOnUse" x1="${variant==='observatory'?320:P.fadeStart}" y1="0" x2="${variant==='observatory'?338:P.fadeEnd}" y2="0"><stop stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="${uid}-body-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="450" height="450"><rect width="450" height="450" fill="${url('body-window')}"/></mask>
      <clipPath id="${uid}-sphere-clip"><circle r="${r}"/></clipPath>
      <clipPath id="${uid}-front"><rect x="${f(-outer-2)}" y="0" width="${f(outer*2+4)}" height="${f(outer+2)}"/></clipPath>
    </defs>`;
    const transform=`translate(${cx} ${cy}) rotate(${tilt})`;
    const sphere=`<circle r="${r}" fill="${url('sphere')}"/><g clip-path="${url('sphere-clip')}">${bands}<ellipse cx="${f(r*.1)}" cy="${f(r*.085)}" rx="${f(r*1.62)}" ry="${f(r*.205)}" fill="none" stroke="#000000" stroke-width="${f(r*.072)}" opacity=".55"/><circle r="${r}" fill="${url('night')}"/></g><path d="M ${f(-r*.86)} ${f(-r*.51)} A ${r} ${r} 0 0 1 ${f(r*.05)} ${f(-r*.999)}" fill="none" stroke="${hue.edge}" stroke-width="${f(r*.009)}" opacity=".72"/>`;
    const eclipse=`<circle r="${r}" fill="#020708" stroke="${hue.dark}" stroke-width=".7"/><path d="M ${f(-r*.92)} ${f(r*.39)} A ${r} ${r} 0 1 1 ${f(r*.82)} ${f(r*.57)}" fill="none" stroke="${hue.light}" stroke-width="${f(r*.055)}" opacity=".72"/><path d="M ${f(-outer)} 0 Q 0 ${f(r*.6)} ${f(outer)} 0 Q 0 ${f(-r*.1)} ${f(-outer)} 0" fill="none" stroke="${hue.edge}" stroke-width="${f(r*.016)}" opacity=".8"/>`;
    const framed=(mask,part,content)=>`<g mask="${url(mask)}"><g data-sky-part="${part}" transform="${transform}">${content}</g></g>`;
    const material=variant==='eclipse'?framed('body-mask','body',eclipse):framed('space-mask','ring-back',rings)+framed('body-mask','body',sphere)+framed('space-mask','ring-front',`<g id="celestial-front-light" opacity="${on}" clip-path="${url('front')}">${rings}</g>`);
    const ambientBody=`<circle r="${r}" fill="#000000" stroke="${hue.edge}" stroke-width="${f(r*.0075)}" stroke-opacity=".45"/><path d="M ${f(-r*.86)} ${f(-r*.51)} A ${r} ${r} 0 0 1 ${f(r*.05)} ${f(-r*.999)}" fill="none" stroke="${hue.edge}" stroke-width="${f(r*.011)}" opacity=".65"/>`;
    const ambientSphere=framed('space-mask','ring-back',skeleton)+framed('body-mask','body',ambientBody)+framed('space-mask','ring-front',`<g clip-path="${url('front')}">${skeleton}</g>`);
    const stars=[[73,139,.6],[93,111,.6],[116,80,.5],[77,194,.5],[54,248,.55],[65,316,.55],[115,371,.45],[171,405,.5],[276,405,.55],[333,380,.5],[371,320,.5],[402,253,.6],[356,281,.5],[389,171,.55],[324,67,.5],[104,160,.45],[128,102,.4],[303,394,.4],[87,342,.4],[386,285,.4]];
    return `<g id="cosmos" aria-hidden="true">${defs}<g id="star-field" fill="${monochrome?'#B0BCAF':'#8CA6B5'}" opacity=".44">${stars.map(([x,y,s])=>`<circle cx="${x}" cy="${y}" r="${s}"/>`).join('')}</g><g id="celestial-active" opacity="${on}" visibility="${ambient?'hidden':'visible'}"><g opacity="${P.material}">${material}</g></g><g id="celestial-ambient" opacity="${off}" visibility="${ambient?'visible':'hidden'}">${ambientSphere}</g></g>`;
  }
  root.OrbitCelestial={render,presets};if(typeof module!=='undefined')module.exports=root.OrbitCelestial;
})(typeof globalThis!=='undefined'?globalThis:this);
