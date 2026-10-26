// KALIWATCH v5 studio. Renders the face with the same modules as the reference sheets, replays the
// wake/sleep choreography straight from the timeline data (no re-render per frame: each layer group's
// opacity/transform is set from VaultFace.valuesAt), and measures the always-on lit-pixel share.
(function () {
  'use strict';
  const F = window.VaultFace, A = window.KaliAstro, T = window.VaultTokens;
  const $ = s => document.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const UID = 'st';
  const state = { preset: 'galaxia', mode: 'active', live: false, date: new Date(T.sample.iso), battery: T.sample.battery, steps: T.sample.steps, draco: true, guides: false, slow: false };
  let raf = 0, liveTimer = 0, litToken = 0;

  const input = extra => ({ preset: state.preset, mode: state.mode, date: state.date, battery: state.battery, steps: state.steps, highlightDraco: state.draco, guides: state.guides, uid: UID, ...extra });
  const seoul = d => { const t = new Date(d.getTime() + T.site.utcOffsetMin * 60000); return t.toISOString().slice(0, 19); };
  const hm = h => h == null ? 'none' : `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`;

  function draw() {
    cancelAnimationFrame(raf); raf = 0;
    $('#face').innerHTML = F.render(input());
    $('#caption').textContent = `${F.PRESETS[state.preset].note}`;
    readout();
  }

  // One frame of a transition, applied to the live DOM. ms = Infinity settles it.
  function applyFrame(toMode, ms) {
    const tl = F.PRESETS[state.preset].timeline, attr = /(\w+)="([^"]*)"/g;
    for (const g of $('#face').querySelectorAll(`[id^="${UID}-"][data-layer]`)) {
      const s = F.attrs(F.valuesAt(g.dataset.layer, toMode, ms, tl)), seen = {};
      for (const m of s.matchAll(attr)) seen[m[1]] = m[2];
      g.setAttribute('opacity', seen.opacity);
      seen.transform ? g.setAttribute('transform', seen.transform) : g.removeAttribute('transform');
      seen.visibility ? g.setAttribute('visibility', seen.visibility) : g.removeAttribute('visibility');
    }
  }
  function play(toMode) {
    state.mode = toMode; syncMode();
    if (reduce.matches) { draw(); return; }
    cancelAnimationFrame(raf);
    const from = toMode === 'active' ? 'ambient' : 'active';
    $('#face').innerHTML = F.render(input({ mode: from }));
    const dur = toMode === 'active' ? T.motion.wakeMs : T.motion.sleepMs, k = state.slow ? 6 : 1, t0 = performance.now();
    const step = now => {
      const ms = (now - t0) / k;
      applyFrame(toMode, ms);
      if (ms < dur + 16) raf = requestAnimationFrame(step); else { raf = 0; readout(); }
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
      $('#lit').textContent = `${p.toFixed(1)}% (limit 15%)`; $('#lit').className = p <= 15 ? 'ok' : 'warn';
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
    $('#live').addEventListener('change', e => setLive(e.target.checked));
    $('#when').value = seoul(state.date);
    $('#when').addEventListener('change', e => { if (e.target.value) setDate(new Date(e.target.value + (e.target.value.length === 16 ? ':00' : '') + '+09:00')); });
    document.querySelectorAll('[data-at]').forEach(b => b.addEventListener('click', () => { $('#live').checked = false; setLive(false); setDate(new Date(b.dataset.at + '+09:00')); }));
    const bat = $('#bat'), steps = $('#steps');
    bat.value = state.battery; steps.value = state.steps; $('#bat-v').textContent = `${state.battery}%`; $('#steps-v').textContent = state.steps.toLocaleString('en-US');
    bat.addEventListener('input', () => { state.battery = +bat.value; $('#bat-v').textContent = `${bat.value}%`; draw(); });
    steps.addEventListener('input', () => { state.steps = +steps.value; $('#steps-v').textContent = (+steps.value).toLocaleString('en-US'); draw(); });
    $('#draco').addEventListener('change', e => { state.draco = e.target.checked; draw(); });
    $('#guides').addEventListener('change', e => { state.guides = e.target.checked; draw(); });
    $('#dl-svg').addEventListener('click', exportSvg);
    $('#dl-png').addEventListener('click', exportPng);
    const note = () => { $('#motion-note').textContent = reduce.matches ? 'Reduced motion is on: transitions switch instantly.' : `Wake ${T.motion.wakeMs} ms back to front, sleep ${T.motion.sleepMs} ms front to back. The time never moves.`; };
    reduce.addEventListener('change', note); note();
  }

  bind(); draw();
  window.VaultStudio = { state, draw, play, applyFrame, litPercent };
})();
