/* Sustainability Mission — lógica de la página de alumnos */
const API = window.MisionAPI;
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const lsDel = k => { try { localStorage.removeItem(k); } catch {} };
const hora = iso => { try { return iso ? new Date(iso).toLocaleString(IDIOMA === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : ''; } catch { return ''; } };
const ERRS = ['offline', 'group_not_found', 'team_not_found', 'wrong_pin', 'bad_pin', 'too_large'];
const msgErr = r => { const e = (r && r.error) || 'error'; return ERRS.includes(e) ? t(e) : t('genericErr', { e }); };
const palabras = s => (String(s || '').trim().match(/\S+/g) || []).length;

let S = lsGet('sustainMission.sesion', null); // {codigo, equipo, pin}
let D = null, G = null, vista = 'inicio';
const P = () => practica(D ? D.practica : PRACTICAS[(S && S.equipo || 1) - 1].id);
const draftKey = () => 'sustainMission.borrador.' + S.codigo + '.' + S.equipo;
function aviso(x) { const a = $('#aviso'); a.textContent = x || ''; a.hidden = !x; }
function setMsg(el, x, tipo) { el.textContent = x; el.className = 'msg' + (tipo ? ' ' + tipo : ''); el.hidden = !x; }

/* ===================== IDIOMA Y LECTURA ===================== */
let LV = document.documentElement.classList.contains('lv');
function cambiarIdioma(lang) {
  IDIOMA = lang === 'es' ? 'es' : 'en';
  try { localStorage.setItem('sustainMission.lang', IDIOMA); } catch {}
  aplicarTextos();
  $('#btnEn').setAttribute('aria-pressed', IDIOMA === 'en'); $('#btnEs').setAttribute('aria-pressed', IDIOMA === 'es');
  const nota = t('lsmNote'); $('#lsmNote').textContent = nota; $('#lsmNote').hidden = !nota;
  $('#demo').hidden = !API.DEMO;
  temaTexto(); repintar();
}
function cambiarLV(on) {
  LV = !!on; document.documentElement.classList.toggle('lv', LV);
  try { localStorage.setItem('sustainMission.lv', LV ? '1' : '0'); } catch {}
  $('#btnLv').setAttribute('aria-pressed', LV); $('#btnLv').querySelector('[data-t]').dataset.t = LV ? 'btnLvOff' : 'btnLv';
  aplicarTextos(); temaTexto();
}
let lvFs = parseInt((() => { try { return localStorage.getItem('sustainMission.fs'); } catch { return null; } })() || '22', 10);
function aplicarFs() { document.documentElement.style.setProperty('--lv-fs', lvFs + 'px'); try { localStorage.setItem('sustainMission.fs', String(lvFs)); } catch {} }
function temaTexto() { $('#lvTema').textContent = t(document.documentElement.classList.contains('lv-claro') ? 'toBlack' : 'toWhite'); }
$('#btnEn').addEventListener('click', () => cambiarIdioma('en'));
$('#btnEs').addEventListener('click', () => cambiarIdioma('es'));
$('#btnLv').addEventListener('click', () => cambiarLV(!LV));
$('#lvMas').addEventListener('click', () => { lvFs = Math.min(lvFs + 4, 40); aplicarFs(); });
$('#lvMenos').addEventListener('click', () => { lvFs = Math.max(lvFs - 4, 16); aplicarFs(); });
$('#lvTema').addEventListener('click', () => {
  const c = !document.documentElement.classList.contains('lv-claro');
  document.documentElement.classList.toggle('lv-claro', c);
  try { localStorage.setItem('sustainMission.lvClaro', c ? '1' : '0'); } catch {}
  temaTexto();
});
function repintar() {
  pintarInicio(); if (G && G.equiposRegistrados) pintarListaEquipos(); ajustarAyuda();
  const m = $('#mapa'); if (m) m.remove();
  if (D) { pintarComun(); if (vista === 'f1') { pintarF1(); if (D.ubicado) enfocar(D.practica, false); } if (vista === 'f2') pintarF2(); if (vista === 'f3') pintarF3(); if (vista === 'f4') pintarF4(); cargarMuro(); }
  mostrar(vista, true);
}

/* ===================== VISTAS ===================== */
const fase1Lista = () => D && D.ubicado && D.tieneFoto;
function mostrar(v, sinScroll) {
  vista = v;
  ['inicio', 'f1', 'f2', 'f3', 'f4'].forEach(n => { $(n === 'inicio' ? '#vInicio' : '#v' + n.toUpperCase()).hidden = n !== v; });
  $('#vMuro').hidden = !(D && v === 'f1');
  $('#btnSalir').hidden = v === 'inicio'; $('#confSalir').hidden = true;
  const ok = fase1Lista();
  [['#st1', 'f1', !D], ['#st2', 'f2', !ok], ['#st3', 'f3', !ok], ['#st4', 'f4', !ok]].forEach(([s, n, dis]) => {
    const b = $(s); b.disabled = dis; b.classList.toggle('on', v === n); b.toggleAttribute('aria-current', v === n);
  });
  $('#st1').classList.toggle('done', !!ok);
  if (!sinScroll) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}
async function ir(v) {
  if (Object.keys(pend).length) await vaciar();
  const f = $('#flash');
  const run = () => { if (v === 'f1') { pintarF1(); } if (v === 'f2') pintarF2(); if (v === 'f3') pintarF3(); if (v === 'f4') pintarF4(); mostrar(v); if (v === 'f1' && D.ubicado) enfocar(D.practica, false); };
  if (reduce || LV) { run(); return; }
  f.classList.add('on'); await new Promise(r => setTimeout(r, 300)); run(); await new Promise(r => setTimeout(r, 50)); f.classList.remove('on');
}
$('#st1').addEventListener('click', () => ir('f1'));
$('#st2').addEventListener('click', () => ir('f2'));
$('#st3').addEventListener('click', () => ir('f3'));
$('#st4').addEventListener('click', () => ir('f4'));
$('#btnF2').addEventListener('click', () => ir('f2'));
$('#btnF3').addEventListener('click', () => ir('f3'));
$('#btnF4').addEventListener('click', () => ir('f4'));

/* ===================== INICIO ===================== */
function pintarInicio() {
  $('#listaPracticas').innerHTML = PRACTICAS.map(p => `<div class="pr"><div class="n" style="background:${p.color}">${p.n}</div><b>${esc(txtP(p, 'nombre'))}</b><span>${esc(t('teamN'))}${p.n}</span></div>`).join('');
}
function pintarListaEquipos() {
  const sel = $('#inEquipo'); const prev = sel.value; const usados = new Set(G.equiposRegistrados || []);
  sel.innerHTML = `<option value="">${esc(t('chooseTeam'))}</option>` + PRACTICAS.map(p => `<option value="${p.n}">${esc(t('teamN'))}${p.n} · ${esc(txtP(p, 'nombre'))}${usados.has(p.n) ? ' ' + esc(t('registered')) : ''}</option>`).join('');
  sel.value = prev || (S && S.codigo === G.codigo ? S.equipo : '');
}
let ultimoCodigo = '';
async function revisarCodigo() {
  const codigo = $('#inCodigo').value.trim().toUpperCase();
  if (!codigo || codigo === ultimoCodigo) return;
  ultimoCodigo = codigo; $('#errInicio').hidden = true; $('#grupoOk').hidden = true; $('#pasoEquipo').hidden = true;
  const r = await API.llamar({ a: 'grupo', codigo });
  if (!r.ok) { setMsg($('#errInicio'), msgErr(r), 'bad'); ultimoCodigo = ''; return; }
  G = r; $('#grupoOk').textContent = '✓ ' + r.nombre; $('#grupoOk').hidden = false;
  pintarListaEquipos(); $('#pasoEquipo').hidden = false; ajustarAyuda();
}
function ajustarAyuda() {
  const n = +$('#inEquipo').value; const reg = G && (G.equiposRegistrados || []).includes(n);
  $('#ayudaPin').textContent = t(reg ? 'pinOld' : 'pinNew'); $('#campoIntegrantes').hidden = !!reg;
  $('#ayudaEquipo').textContent = n ? t('practiceOf') + txtP(PRACTICAS[n - 1], 'nombre') : '';
}
$('#inCodigo').addEventListener('change', revisarCodigo);
$('#inCodigo').addEventListener('blur', revisarCodigo);
$('#inCodigo').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); revisarCodigo(); } });
$('#inEquipo').addEventListener('change', ajustarAyuda);
$('#fInicio').addEventListener('submit', async ev => {
  ev.preventDefault();
  const err = $('#errInicio');
  if (!G) { await revisarCodigo(); if (!G) return; }
  const equipo = +$('#inEquipo').value, pin = $('#inPin').value.trim(), integrantes = $('#inIntegrantes').value.trim();
  if (!equipo) { setMsg(err, t('chooseTeamErr'), 'bad'); return; }
  if (!/^\d{4}$/.test(pin)) { setMsg(err, t('bad_pin'), 'bad'); return; }
  if (!(G.equiposRegistrados || []).includes(equipo) && !integrantes) { setMsg(err, t('membersErr'), 'bad'); return; }
  const btn = $('#btnEntrarEquipo'); btn.disabled = true; btn.textContent = t('entering');
  const r = await API.llamar({ a: 'entrar', codigo: G.codigo, equipo, pin, integrantes });
  btn.disabled = false; btn.textContent = t('cont');
  if (!r.ok) { setMsg(err, msgErr(r), 'bad'); return; }
  err.hidden = true; S = { codigo: G.codigo, equipo, pin }; lsSet('sustainMission.sesion', S);
  abrir(r.team);
});
/* Salir */
$('#btnSalir').addEventListener('click', () => { $('#confSalir').hidden = false; });
$('#salirNo').addEventListener('click', () => { $('#confSalir').hidden = true; });
$('#salirSi').addEventListener('click', async () => {
  if (Object.keys(pend).length) await vaciar();
  lsDel('sustainMission.sesion'); S = null; D = null; G = null; ultimoCodigo = ''; clearInterval(tMuro);
  ['#inPin', '#inIntegrantes', '#inCodigo'].forEach(s => { $(s).value = ''; });
  $('#pasoEquipo').hidden = true; $('#grupoOk').hidden = true; const m = $('#mapa'); if (m) m.remove();
  mostrar('inicio');
});

function abrir(team) {
  D = team; aplicarBorrador(); pintarComun(); iniciarMuro();
  if (fase1Lista()) { const c = D.campos; const ent = ['g1', 'g2', 'g3', 'g4'].some(k => c[k]); ir(ent ? 'f3' : 'f2'); }
  else ir('f1');
}
async function reanudar() {
  if (!S) return;
  aviso(t('opening'));
  const r = await API.llamar({ a: 'entrar', codigo: S.codigo, equipo: S.equipo, pin: S.pin });
  aviso('');
  if (r.ok) { G = { codigo: S.codigo }; abrir(r.team); }
  else if (r.error === 'offline') aviso(t('offline'));
  else { lsDel('sustainMission.sesion'); S = null; }
}
function pintarComun() {
  const p = P();
  document.querySelectorAll('[data-badge]').forEach(b => { b.textContent = p.n; b.style.background = p.color; });
  document.querySelectorAll('[data-nombre]').forEach(b => { b.textContent = txtP(p, 'nombre'); });
}

/* ===================== GUARDADO ===================== */
let cola = Promise.resolve();
function guardar(datos) {
  cola = cola.then(async () => {
    const r = await API.llamar({ a: 'guardar', codigo: S.codigo, equipo: S.equipo, pin: S.pin, datos });
    if (r.ok) { D = Object.assign(D, r.team); return true; }
    return r;
  });
  return cola;
}
let pend = {}, tGuardar = null;
function aplicarBorrador() { const b = lsGet(draftKey(), null); if (b && Object.keys(b).length) { pend = Object.assign({}, b); Object.assign(D.campos, pend); setTimeout(vaciar, 400); } }
function estado(x) { ['#save2', '#save3'].forEach(s => { $(s).textContent = x; }); }
function onCampo(el) {
  pend[el.dataset.c] = el.value; D.campos[el.dataset.c] = el.value; lsSet(draftKey(), pend);
  estado(t('typing')); clearTimeout(tGuardar); tGuardar = setTimeout(vaciar, 1500); progreso();
  if (el.dataset.c === 'intro') contar();
}
async function vaciar() {
  clearTimeout(tGuardar);
  const p = pend; if (!Object.keys(p).length) return;
  pend = {}; estado(t('saving')); $('#btnReint2').hidden = true;
  const r = await guardar({ campos: p });
  if (r === true) { lsSet(draftKey(), pend); estado((API.DEMO ? t('savedLocal') : t('saved')) + hora(D.actualizado)); }
  else { pend = Object.assign(p, pend); lsSet(draftKey(), pend); estado(msgErr(r) + t('keptPhone')); $('#btnReint2').hidden = false; }
}
$('#btnReint2').addEventListener('click', vaciar);
function conectarCampos(raiz) {
  raiz.querySelectorAll('[data-c]').forEach(el => {
    el.value = D.campos[el.dataset.c] || '';
    if (el.dataset.ok) return; el.dataset.ok = '1';
    el.addEventListener('input', () => onCampo(el));
    el.addEventListener('blur', () => { if (Object.keys(pend).length) vaciar(); });
  });
}
const lleno = k => (D.campos[k] || '').trim().length >= 3;
function progreso() {
  if (!D) return;
  const k2 = []; ARTICULOS.forEach(i => COL_ART.forEach(c => k2.push(`a${i}_${c}`))); k2.push('ctx1', 'ctx2', 'ctx3', 'ctx4', 'apa', 'intro');
  const k3 = ['ent_nombre', 'g1', 'g2', 'g3', 'g4']; PROPIAS.forEach(n => k3.push('p' + n, 'r' + n));
  const pct = ks => ks.filter(k => k === 'a1_anio' || k.endsWith('_anio') ? (D.campos[k] || '').trim().length >= 4 : lleno(k)).length / ks.length * 100;
  $('#prog2').style.width = pct(k2) + '%'; $('#prog3').style.width = pct(k3) + '%';
}

/* ===================== FASE 1 ===================== */
function pintarF1() {
  const p = P();
  if (!$('#mapa')) { $('#mapaBox').innerHTML = mapaSVG(); conectarMapa(); }
  $('#mBadge').textContent = p.n; $('#mBadge').style.background = p.color;
  $('#mGrupo').textContent = t('group') + D.grupo + ' · ' + t('teamN') + p.n;
  $('#mTitulo').textContent = txtP(p, 'nombre'); $('#mProblema').textContent = txtP(p, 'problema');
  $('#chipIntentos').textContent = t('attempts') + (D.intentos || 0);
  $('#t1').className = 'task ' + (D.ubicado ? 'ok' : 'on');
  pintarListaMapa();
  if (D.ubicado) { setMsg($('#t1msg'), t('found', { n: D.intentos || 1, w: t(D.intentos === 1 ? 'attempt' : 'attemptsW') }), 'good'); document.querySelectorAll('.pin').forEach(g => g.classList.toggle('si', g.dataset.id === p.id)); }
  $('#t2').className = 'task ' + (!D.ubicado ? 'locked' : (D.tieneFoto ? 'ok' : 'on'));
  $('#inFoto').disabled = !D.ubicado;
  const im = $('#fotoPrev'); im.alt = t('t2h');
  if (D.mini && !im.dataset.local) { im.src = D.mini; im.hidden = false; }
  $('#btnF2').disabled = !fase1Lista();
}
function descripcion(p) {
  // Descripción sin nombre: se usa la pista de cada práctica
  return txtP(p, 'pista');
}
function pintarListaMapa() {
  const orden = PRACTICAS.slice().sort((a, b) => descripcion(a).localeCompare(descripcion(b)));
  document.querySelectorAll('[data-lista]').forEach(box => {
    box.innerHTML = orden.map(p => `<button type="button" class="lugar-btn${D.ubicado && p.id === D.practica ? ' si' : ''}" data-id="${p.id}">${esc(descripcion(p))}</button>`).join('');
    box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => elegir(b.dataset.id)));
  });
}
async function elegir(id) {
  const p = P(); const g = document.querySelector(`.pin[data-id="${id}"]`);
  const sacudir = () => { if (g) { g.classList.remove('no'); void g.getBBox(); g.classList.add('no'); } };
  if (D.ubicado) { if (id !== p.id) sacudir(); return; }
  const intentos = (D.intentos || 0) + 1; D.intentos = intentos; $('#chipIntentos').textContent = t('attempts') + intentos;
  if (id === p.id) {
    D.ubicado = true; enfocar(id, true); pintarF1(); mostrar('f1', true);
    const r = await guardar({ intentos, ubicado: true });
    if (r !== true) setMsg($('#t1msg'), msgErr(r) + t('savedLater'), 'bad');
  } else {
    sacudir(); setMsg($('#t1msg'), t('notYours') + t('hint') + txtP(p, 'pista'), 'bad');
    guardar({ intentos });
  }
}
function conectarMapa() {
  const svg = $('#mapa');
  svg.addEventListener('click', e => { const g = e.target.closest('.pin'); if (g) elegir(g.dataset.id); });
  svg.addEventListener('keydown', e => { const g = e.target.closest('.pin'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); elegir(g.dataset.id); } });
}
async function aJpeg(file, max, q) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}
$('#inFoto').addEventListener('change', async ev => {
  const file = ev.target.files && ev.target.files[0]; if (!file) return;
  const m = $('#t2msg'), im = $('#fotoPrev');
  im.src = URL.createObjectURL(file); im.dataset.local = '1'; im.hidden = false;
  setMsg(m, t('posting'));
  let grande, mini;
  try { grande = await aJpeg(file, 1600, .82); mini = await aJpeg(file, 480, .65); } catch { setMsg(m, t('badImage'), 'bad'); return; }
  const r = await API.llamar({ a: 'foto', codigo: S.codigo, equipo: S.equipo, pin: S.pin, foto: grande.split(',')[1], mini });
  if (r.ok) { D = Object.assign(D, r.team); setMsg(m, t('posted'), 'good'); pintarF1(); mostrar('f1', true); cargarMuro(); }
  else setMsg(m, msgErr(r), 'bad');
});

/* ===================== MURO ===================== */
let tMuro = null;
function iniciarMuro() { clearInterval(tMuro); cargarMuro(); tMuro = setInterval(() => { if (!document.hidden && vista === 'f1') cargarMuro(); }, 45000); }
async function cargarMuro() {
  if (!S) return;
  $('#muroGrupo').textContent = t('group') + (D && D.grupo || '');
  const r = await API.llamar({ a: 'muro', codigo: S.codigo }); if (!r.ok) return;
  const fotos = r.fotos.sort((a, b) => String(a.fotoEn).localeCompare(String(b.fotoEn)));
  $('#muro').innerHTML = fotos.length ? fotos.map(d => { const p = practica(d.practica); const nom = p ? txtP(p, 'nombre') : ''; return `<figure class="polaroid"><img src="${esc(d.mini)}" alt="${esc(t('teamN'))}${d.equipo} · ${esc(nom)}" loading="lazy"><b>${esc(t('teamN'))}${d.equipo} · ${esc(nom)}</b><span>${esc(t('arrived'))}${hora(d.fotoEn)}</span></figure>`; }).join('') : `<p class="empty">${esc(t('wallEmpty'))}</p>`;
}

/* ===================== FASE 2 ===================== */
function pintarF2() {
  const p = P();
  $('#buscar').textContent = txtP(p, 'buscar');
  const lab = { titulo: 'aTitulo', autor: 'aAutor', anio: 'aAnio', lugar: 'aLugar', doi: 'aDoi' };
  $('#articulos').innerHTML = ARTICULOS.map(i => `<fieldset class="art"><legend class="num-art">${esc(t('article'))}${i}</legend>${COL_ART.map(c => {
    const id = `f-a${i}_${c}`;
    const extra = c === 'anio' ? ' inputmode="numeric" maxlength="4"' : '';
    const ayuda = c === 'doi' ? `<span class="help">${esc(t('doiHelp'))}</span><span class="doi-bad" id="${id}-bad" hidden>${esc(t('doiBad'))}</span>` : '';
    return `<div class="field f-${c}"><label for="${id}">${esc(t(lab[c]))}</label><input type="text" id="${id}" data-c="a${i}_${c}"${extra}>${ayuda}</div>`;
  }).join('')}</fieldset>`).join('');
  $('#contexto').innerHTML = (CONTEXTO[IDIOMA] || CONTEXTO.en).map(([k, tag, q]) => `<div class="q"><span class="tag">${esc(tag)}</span><label for="f-${k}">${esc(q)}</label><textarea id="f-${k}" data-c="${k}" rows="4"></textarea></div>`).join('');
  conectarCampos($('#vF2'));
  ARTICULOS.forEach(i => { const el = $(`#f-a${i}_doi`); const val = () => { const v = el.value.trim(); $(`#f-a${i}_doi-bad`).hidden = !v || DOI_RE.test(v); }; el.addEventListener('input', val); val(); });
  contar(); progreso();
  estado(D.actualizado ? t('saved') + hora(D.actualizado) : t('noChanges'));
}
function contar() {
  const n = palabras(D.campos.intro); const c = $('#cuenta');
  c.textContent = `${n} ${t('words')} · ${t('wordsGoal')}`; c.classList.toggle('ok', n >= 150);
}

/* ===================== FASE 3 ===================== */
function pintarF3() {
  $('#guiadas').innerHTML = (ENTREVISTA[IDIOMA] || ENTREVISTA.en).map(([k, q], i) => `<div class="q-par"><span class="eyebrow">${i + 1}</span><b id="lq-${k}">${esc(q)}</b><label class="help" for="f-${k}">${esc(t('answer'))}</label><textarea id="f-${k}" data-c="${k}" rows="3" aria-describedby="lq-${k}"></textarea></div>`).join('');
  $('#propias').innerHTML = PROPIAS.map(n => `<div class="q-par"><label for="f-p${n}"><span class="eyebrow">${n}</span> ${esc(t('yourQuestion'))}${n}</label><input type="text" id="f-p${n}" data-c="p${n}"><label class="help" for="f-r${n}">${esc(t('answer'))}</label><textarea id="f-r${n}" data-c="r${n}" rows="3"></textarea></div>`).join('');
  conectarCampos($('#vF3')); progreso();
  estado(D.actualizado ? t('saved') + hora(D.actualizado) : t('noChanges'));
}

/* ===================== FINAL / PDF ===================== */
function revision() {
  const c = D.campos;
  const arts = ARTICULOS.every(i => (c[`a${i}_titulo`] || '').trim() && (c[`a${i}_autor`] || '').trim());
  return [
    ['checkPhoto', D.tieneFoto], ['checkArt', arts], ['checkCtx', ['ctx1', 'ctx2', 'ctx3', 'ctx4'].every(lleno)],
    ['checkApa', lleno('apa')], ['checkIntro', palabras(c.intro) >= 150],
    ['checkEnt', ['g1', 'g2', 'g3', 'g4', 'r5', 'r6', 'r7', 'r8'].every(lleno)]
  ];
}
function pintarF4() {
  const r = revision();
  $('#checklist').innerHTML = r.map(([k, ok]) => `<li class="${ok ? 'ok' : ''}"><span class="ic" aria-hidden="true">${ok ? '✓' : ''}</span><span>${esc(t(k))}</span><span class="sr" style="position:absolute;left:-9999px">${ok ? '✓' : '—'}</span></li>`).join('');
  const faltan = r.some(x => !x[1]);
  setMsg($('#pdfMsg'), faltan ? t('missing') : '', faltan ? 'bad' : '');
}
$('#btnPdf').addEventListener('click', async () => {
  if (Object.keys(pend).length) await vaciar();
  const b = $('#btnPdf'); b.disabled = true; setMsg($('#pdfMsg'), t('making'));
  try { await crearPDF(D, P()); setMsg($('#pdfMsg'), t('pdfReady'), 'good'); }
  catch (e) { console.error(e); setMsg($('#pdfMsg'), t('pdfFail'), 'bad'); }
  b.disabled = false;
});

/* ===================== ARRANQUE ===================== */
$('#btnLv').setAttribute('aria-pressed', LV); $('#btnLv').querySelector('[data-t]').dataset.t = LV ? 'btnLvOff' : 'btnLv';
aplicarFs();
cambiarIdioma((() => { try { return localStorage.getItem('sustainMission.lang'); } catch { return null; } })() || 'en');
mostrar('inicio');
reanudar();
