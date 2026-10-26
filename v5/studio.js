// KALIWATCH v5 studio. Renders the face with the same modules as the reference sheets, replays the
// wake/sleep choreography straight from the timeline data (no re-render per frame: each layer group's
// opacity/transform is set from VaultFace.valuesAt), and measures the always-on lit-pixel share.
(function () {
  'use strict';
  const F = window.VaultFace, A = window.KaliAstro, T = window.VaultTokens;
  const $ = s => document.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const UID = 'st';
  const state = { preset: 'vault5', mode: 'active', live: false, date: new Date(window.VaultV5.MOMENTS.M1), battery: T.sample.battery, steps: T.sample.steps, stepGoal: 8000, draco: true, guides: false, slow: false, motion: 'calm', manualReduce: false, windowMs: 360, tilt: { x: 0, y: 0 } };
  let raf = 0, liveTimer = 0, litToken = 0, transition = null;
  const currentValues = new Map();
  const reduced = () => reduce.matches || state.manualReduce || state.motion === 'still';

  const input = extra => ({ preset: state.preset, mode: state.mode, date: state.date, battery: state.battery, steps: state.steps, stepGoal: state.stepGoal, highlightDraco: state.draco, guides: state.guides, motion: state.motion, reducedMotion: reduced(), windowMs: state.windowMs, tilt: state.tilt, uid: UID, ...extra });
  const seoul = d => { const t = new Date(d.getTime() + T.site.utcOffsetMin * 60000); return t.toISOString().slice(0, 19); };
  const hm = h => h == null ? 'none' : `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`;

  function draw() {
    cancelAnimationFrame(raf); raf = 0; transition = null; currentValues.clear();
    $('#face').innerHTML = F.render(input());
    $('#caption').textContent = `${F.PRESETS[state.preset].note}`;
    readout();
  }

  // One frame of a transition, applied to the live DOM. ms = Infinity settles it.
  function applyFrame(toMode, ms, interruptedFrom, progress) {
    const tl = F.PRESETS[state.preset].timeline, attr = /(\w+)="([^"]*)"/g;
    for (const g of $('#face').querySelectorAll(`[id^="${UID}-"][data-layer]`)) {
      let values = F.valuesAt(g.dataset.layer, toMode, ms, tl);
      if (interruptedFrom) {
        const from = interruptedFrom.get(g.dataset.layer), target = F.valuesAt(g.dataset.layer, toMode, Infinity, tl);
        values = Object.fromEntries(Object.keys(target).map(k => [k, F.parts.lerp(from[k], target[k], F.ease(progress))]));
      }
      currentValues.set(g.dataset.layer, values);
      const s = F.attrs(values), seen = {};
      for (const m of s.matchAll(attr)) seen[m[1]] = m[2];
      g.setAttribute('opacity', seen.opacity);
      seen.transform ? g.setAttribute('transform', seen.transform) : g.removeAttribute('transform');
      seen.visibility ? g.setAttribute('visibility', seen.visibility) : g.removeAttribute('visibility');
    }
  }
  function play(toMode) {
    const previous = transition, fromValues = raf && previous ? new Map(currentValues) : null;
    state.mode = toMode; syncMode();
    if (reduced()) { draw(); return; }
    cancelAnimationFrame(raf);
    const from = toMode === 'active' ? 'ambient' : 'active';
    if (!fromValues) $('#face').innerHTML = F.render(input({ mode: from }));
    const normal = state.windowMs * (toMode === 'active' ? 1 : 0.5), dur = fromValues ? Math.max(1, Math.min(normal, previous.elapsed)) : normal;
    const k = state.slow ? 6 : 1, t0 = performance.now();
    transition = { elapsed: 0 };
    const step = now => {
      const elapsed = (now - t0) / k, ms = elapsed * 360 / state.windowMs;
      transition.elapsed = elapsed;
      applyFrame(toMode, ms, fromValues, Math.min(1, elapsed / dur));
      if (elapsed < dur) raf = requestAnimationFrame(step); else { applyFrame(toMode, Infinity); raf = 0; transition = null; readout(); }
    };
    raf = requestAnimationFrame(step);
  }
  function setMode(mode, animate) { if (mode === state.mode && !animate) return; animate ? play(mode) : (state.mode = mode, syncMode(), draw()); }
  function syncMode() {
    $('#m-active').setAttribute('aria-pressed', String(state.mode === 'active'));
    $('#m-ambient').setAttribute('aria-pressed', String(state.mode === 'ambient'));
  }

  // Always-on budget: rasterise the ambient render (font embedded) and count lit pixels inside the dial.
  async function litPercent() {
    const token = ++litToken;
    const svg = F.render(input({ mode: 'ambient', fontData: window.OrbitFontData || '', uid: 'lit', frame: null }));
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), img = new Image();
    try {
      await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; });
      const c = document.createElement('canvas'); c.width = c.height = 450;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0, 450, 450);
      const d = g.getImageData(0, 0, 450, 450).data; let lit = 0, n = 0;
      for (let y = 0; y < 450; y++) for (let x = 0; x < 450; x++) {
        if ((x - 224.5) ** 2 + (y - 224.5) ** 2 > 225 * 225) continue;
        n++; const i = (y * 450 + x) * 4; if (Math.max(d[i], d[i + 1], d[i + 2]) > 8) lit++;
      }
      return token === litToken ? lit / n * 100 : null;
    } finally { URL.revokeObjectURL(url); }
  }

  function readout() {
    const sky = A.sky(state.date, T.site), rs = A.riseSet(state.date, T.site, T.site.utcOffsetMin), z = sky.sun.zodiac;
    const rows = [
      ['Local sidereal time', hm(sky.lstHours)],
      ['Sun', `${z.name} ${z.degreeInSign.toFixed(1)}°, altitude ${sky.sun.alt.toFixed(1)}°`],
      ['Sunrise and sunset', `${hm(rs.rise)} and ${hm(rs.set)}`],
      ['Moon', `${sky.moon.typeName}, ${(sky.moon.illuminated * 100).toFixed(0)}% lit, day ${sky.moon.age.toFixed(1)}`],
      ['Always-on lit pixels', '<span id="lit">measuring</span>']
    ];
    $('#readout').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    litPercent().then(p => {
      if (p == null || !$('#lit')) return;
      const limit = state.preset === 'vault5' ? 9.5 : 15;
      $('#lit').textContent = `${p.toFixed(1)}% (target ${limit}%)`; $('#lit').className = p <= limit ? 'ok' : 'warn';
    }).catch(() => { if ($('#lit')) $('#lit').textContent = 'could not measure'; });
  }

  function download(name, blob) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function fileStem() { return `kaliwatch-${state.preset}-${state.mode}-${seoul(state.date).replace(/[:T]/g, '').slice(0, 13)}`; }
  function exportSvg() { download(fileStem() + '.svg', new Blob([F.render(input({ fontData: window.OrbitFontData || '', uid: 'x' }))], { type: 'image/svg+xml' })); }
  function exportPng() {
    const url = URL.createObjectURL(new Blob([F.render(input({ fontData: window.OrbitFontData || '', uid: 'x' }))], { type: 'image/svg+xml' })), img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 960; c.getContext('2d').drawImage(img, 0, 0, 960, 960);
      URL.revokeObjectURL(url); c.toBlob(b => download(fileStem() + '.png', b), 'image/png');
    };
    img.src = url;
  }

  function setDate(d) { state.date = d; $('#when').value = seoul(d); draw(); }
  function setLive(on) {
    state.live = on; clearInterval(liveTimer); $('#when').disabled = on;
    if (on) { setDate(new Date()); liveTimer = setInterval(() => { if (!raf) setDate(new Date()); }, 1000); }
  }

  function bind() {
    $('#preset').value = state.preset;
    $('#preset').addEventListener('change', e => { state.preset = e.target.value; draw(); });
    $('#m-active').addEventListener('click', () => setMode('active', state.mode !== 'active'));
    $('#m-ambient').addEventListener('click', () => setMode('ambient', state.mode !== 'ambient'));
    $('#wake').addEventListener('click', () => play('active'));
    $('#sleep').addEventListener('click', () => play('ambient'));
    $('#slow').addEventListener('change', e => { state.slow = e.target.checked; });
    const motionNote = () => {
      $('#motion-note').textContent = reduced() ? 'Reduced motion: transitions switch instantly; time and astronomy keep updating.' : `Wake ${state.windowMs} ms, sleep ${state.windowMs / 2} ms. Information stays fixed.`;
      for (const slider of $('#tilt-controls').querySelectorAll('input')) slider.disabled = state.motion !== 'full' || reduced();
    };
    $('#motion').addEventListener('change', e => { state.motion = e.target.value; motionNote(); draw(); });
    $('#reduce-motion').addEventListener('change', e => { state.manualReduce = e.target.checked; motionNote(); draw(); });
    $('#window').addEventListener('input', e => { state.windowMs = +e.target.value; $('#window-v').textContent = `${state.windowMs} ms`; motionNote(); });
    for (const axis of ['x', 'y']) $(`#tilt-${axis}`).addEventListener('input', e => { state.tilt[axis] = +e.target.value; $(`#tilt-${axis}-v`).textContent = `${e.target.value}°`; draw(); });
    $('#live').addEventListener('change', e => setLive(e.target.checked));
    $('#when').value = seoul(state.date);
    $('#when').addEventListener('change', e => { if (e.target.value) setDate(new Date(e.target.value + (e.target.value.length === 16 ? ':00' : '') + '+09:00')); });
    document.querySelectorAll('[data-at]').forEach(b => b.addEventListener('click', () => { $('#live').checked = false; setLive(false); setDate(new Date(b.dataset.at + '+09:00')); }));
    const bat = $('#bat'), steps = $('#steps');
    bat.value = state.battery; steps.value = state.steps; $('#bat-v').textContent = `${state.battery}%`; $('#steps-v').textContent = state.steps.toLocaleString('en-US');
    bat.addEventListener('input', () => { state.battery = +bat.value; $('#bat-v').textContent = `${bat.value}%`; draw(); });
    steps.addEventListener('input', () => { state.steps = +steps.value; $('#steps-v').textContent = (+steps.value).toLocaleString('en-US'); draw(); });
    $('#step-goal').addEventListener('change', e => { state.stepGoal = Math.max(1, Math.min(1000000, Math.round(+e.target.value || 8000))); e.target.value = state.stepGoal; draw(); });
    $('#draco').addEventListener('change', e => { state.draco = e.target.checked; draw(); });
    $('#guides').addEventListener('change', e => { state.guides = e.target.checked; draw(); });
    $('#dl-svg').addEventListener('click', exportSvg);
    $('#dl-png').addEventListener('click', exportPng);
    reduce.addEventListener('change', () => { motionNote(); draw(); }); motionNote();
  }

  bind(); draw();
  window.VaultStudio = { state, draw, play, applyFrame, litPercent };
})();
