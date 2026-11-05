/* Sustainability Mission — mapa del campus (mismo trazo que Campus Mission) con las 9 buenas prácticas */
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
function dentro(x, y, r) { return r.some(b => x > b.x - 8 && x < b.x + b.w + 8 && y > b.y - 8 && y < b.y + b.h + 8); }
function bboxE(e) { let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9; e.parts.forEach(p => { x1 = Math.min(x1, p.x); y1 = Math.min(y1, p.y); x2 = Math.max(x2, p.x + p.w); y2 = Math.max(y2, p.y + p.h); }); return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }; }

function mapaSVG() {
  const ex = []; EDIFICIOS.forEach(c => c.parts.forEach(p => ex.push(p)));
  PRACTICAS.forEach(p => ex.push({ x: p.x - 14, y: p.y - 14, w: 28, h: 28 }));
  ex.push({ x: 297, y: 775, w: 133, h: 207 }, { x: 200, y: 60, w: 250, h: 225 }, { x: 10, y: 385, w: 100, h: 85 }, { x: 196, y: 418, w: 70, h: 70 }, { x: 290, y: 360, w: 26, h: 820 }, { x: 240, y: 395, w: 240, h: 20 });
  const r = rng(7); let arboles = '';
  for (let i = 0; i < 330; i++) {
    const x = 40 + r() * 620, y = r() * 1170;
    const fueraIzq = x < 52 && y > 300, camino = y < 345 - 0.69 * x + 10 && y > 345 - 0.69 * x - 40;
    const campoE = x > 462 && y > 400 && y < 720, norOeste = y < 345 - 0.69 * x - 40;
    if (fueraIzq || camino || campoE || norOeste || dentro(x, y, ex)) continue;
    const rr = 4 + r() * 4.5;
    arboles += `<circle cx="${x.toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="${rr.toFixed(1)}" fill="rgba(0,0,0,.18)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > .5 ? 'var(--m-tree)' : 'var(--m-tree2)'}"/>`;
  }
  const camino = (pts, w = 8, c = 'var(--m-path)') => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const edif = EDIFICIOS.map(e => {
    const partes = e.parts.map(p => {
      let s = `<rect x="${p.x + 3}" y="${p.y + 4}" width="${p.w}" height="${p.h}" rx="2" fill="rgba(0,0,0,.28)"/><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2" fill="${p.top}"/>`;
      if (e.tent) for (let i = 1; i < 3; i++) s += `<line x1="${p.x}" y1="${p.y + p.h * i / 3}" x2="${p.x + p.w}" y2="${p.y + p.h * i / 3}" stroke="#c9ccc9" stroke-width="2"/>`;
      if (p.panels) for (let yy = p.y + 6; yy < p.y + p.h - 8; yy += 9) for (let xx = p.x + 16; xx < p.x + p.w - 14; xx += 22) s += `<rect x="${xx}" y="${yy}" width="18" height="6" rx="1" fill="#2A3A34"/>`;
      return s;
    }).join('');
    const nom = e[typeof IDIOMA !== 'undefined' ? IDIOMA : 'en'];
    const b = bboxE(e);
    const lbl = nom ? `<text class="ed-lbl" x="${b.x + b.w / 2}" y="${b.y + b.h + 17}" text-anchor="middle">${esc(nom)}</text>` : '';
    return `<g class="edif" aria-hidden="true">${partes}${lbl}</g>`;
  }).join('');
  let k = 0;
  const pines = PRACTICAS.slice().sort((a, b) => a.y - b.y || a.x - b.x).map(p => {
    k++;
    return `<g class="pin" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(typeof t === 'function' ? t('spot') : 'Spot')} ${k}" transform="translate(${p.x} ${p.y})">
      <circle class="hit" r="26" fill="transparent"/>
      <circle r="17" fill="rgba(0,0,0,.3)" cy="3"/>
      <circle class="disc" r="17"/>
      <circle r="6" class="stud"/>
      <g class="lbl"><rect x="-110" y="-52" width="220" height="26" rx="6"/><text y="-34" text-anchor="middle">${esc(txtP(p, 'nombre'))}</text></g>
    </g>`;
  }).join('');
  return `<svg id="mapa" viewBox="${VISTA_INICIAL.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(typeof t === 'function' ? t('mapAria') : 'Campus map')}">
  <defs>
    <pattern id="pStud" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6.6" cy="6.8" r="3.2" fill="rgba(0,0,0,.10)"/><circle cx="6" cy="6" r="3.2" fill="rgba(255,255,255,.12)"/></pattern>
    <pattern id="pSurco" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><rect width="8" height="3" fill="rgba(0,0,0,.07)"/></pattern>
  </defs>
  <rect width="${MAPA_W}" height="${MAPA_H}" fill="var(--m-plate)"/>
  <polygon points="0,0 505,0 0,345" fill="var(--m-field2)"/>
  <polygon points="0,320 50,300 50,${MAPA_H} 0,${MAPA_H}" fill="var(--m-field2)"/>
  <polygon points="462,400 676,330 676,720 462,720" fill="var(--m-field)"/><polygon points="462,400 676,330 676,720 462,720" fill="url(#pSurco)"/>
  <polygon points="205,292 448,58 452,252 398,286" fill="var(--m-gravel)"/>
  <polygon points="12,420 70,384 110,440 50,472" fill="var(--m-gravel)"/>
  ${camino([[-20, 360], [515, -10]], 22, 'var(--m-road)')}
  ${camino([[-20, 360], [515, -10]], 2, '#ECECEC')}
  ${camino([[70, 322], [124, 350], [150, 345], [230, 305]], 13, 'var(--m-road)')}
  <circle cx="132" cy="358" r="19" fill="var(--m-road)"/><circle cx="132" cy="358" r="9" fill="var(--m-tree2)"/>
  ${camino([[303, 370], [303, 1180]])}
  ${camino([[255, 405], [470, 405]])}
  ${camino([[462, 190], [462, 420], [455, 560], [460, 820], [470, 1170]])}
  ${camino([[462, 380], [520, 372], [590, 372], [640, 330]], 6)}
  ${camino([[150, 372], [205, 420], [232, 452], [303, 548]])}
  ${camino([[303, 548], [256, 568]])}
  ${camino([[303, 548], [348, 520]])}
  ${camino([[380, 240], [440, 280], [462, 300]], 6)}
  ${camino([[60, 470], [80, 700], [150, 750], [303, 740], [460, 700]], 6)}
  <rect x="297" y="775" width="133" height="207" fill="var(--m-field)"/><rect x="305" y="783" width="117" height="191" fill="none" stroke="#ECECEC" stroke-width="2"/>
  <polygon points="232,416 256,426 266,452 256,478 232,488 208,478 198,452 208,426" fill="#ECECEC"/>
  <circle cx="303" cy="548" r="16" fill="#ECECEC"/><circle cx="303" cy="548" r="5" fill="var(--m-tree)"/>
  <rect width="${MAPA_W}" height="${MAPA_H}" fill="url(#pStud)" pointer-events="none"/>
  ${arboles}
  ${edif}
  ${pines}
  <g class="norte" transform="translate(640,600)" pointer-events="none"><circle r="16" fill="rgba(42,58,52,.55)"/><path d="M0 -11 L4 3 L0 0 L-4 3 Z" fill="#fff"/><text y="12" text-anchor="middle" font-size="8" fill="#fff">N</text></g>
</svg>`;
}

let vbAnim = null;
function setVB(v) { const m = $('#mapa'); if (m) m.setAttribute('viewBox', v.map(n => n.toFixed(1)).join(' ')); }
function enfocar(id, anim = true) {
  const p = practica(id); if (!p || !$('#mapa')) return;
  const w = 300, h = 250, to = [p.x - w / 2, p.y - h / 2, w, h];
  document.querySelectorAll('.pin').forEach(g => g.classList.toggle('si', g.dataset.id === id));
  const from = $('#mapa').getAttribute('viewBox').split(/\s+/).map(Number);
  if (!anim || reduce) { setVB(to); return; }
  cancelAnimationFrame(vbAnim); const t0 = performance.now(), dur = 1000;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const step = now => { const k = Math.min(1, (now - t0) / dur), e = ease(k); setVB(from.map((f, i) => f + (to[i] - f) * e)); if (k < 1) vbAnim = requestAnimationFrame(step); };
  vbAnim = requestAnimationFrame(step);
}
