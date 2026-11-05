/**
 * Sustainability Mission UPSRJ · Good practices — servidor en Google Apps Script
 * Universidad Politécnica de Santa Rosa Jáuregui
 *
 * Guarda todo en el Drive de la cuenta que publique este script
 * (cguerrero@upsrj.edu.mx): una hoja de cálculo con grupos y equipos,
 * y una carpeta con las fotos de cada equipo.
 *
 * INSTALACIÓN (una sola vez)
 *  1. Cambia PIN_DOCENTE abajo por un PIN que solo tú conozcas.
 *  2. En el menú de funciones elige "instalar" y pulsa Ejecutar. Acepta los permisos.
 *     Se crea la carpeta "Sustainability Mission (datos)" en tu Drive.
 *  3. Implementar > Nueva implementación > Tipo: Aplicación web
 *       Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
 *     Copia la URL que termina en /exec y pégala en config.js de la página.
 */

const PIN_DOCENTE = 'CAMBIA-ESTE-PIN';

// Buena práctica de cada equipo (debe coincidir con data.js)
const PRACTICA_EQUIPO = {1:'vivero',2:'rotonda',3:'jardines',4:'planta',5:'lombricomposta',6:'bebederos',7:'huerto',8:'humedal',9:'captura'};

// Campos que guardan los equipos, con su encabezado en la hoja
const CAMPOS = [
  ['a1_titulo','Art. 1 · Título'],['a1_autor','Art. 1 · Autor(es)'],['a1_anio','Art. 1 · Año'],['a1_lugar','Art. 1 · Revista / lugar'],['a1_doi','Art. 1 · DOI'],
  ['a2_titulo','Art. 2 · Título'],['a2_autor','Art. 2 · Autor(es)'],['a2_anio','Art. 2 · Año'],['a2_lugar','Art. 2 · Revista / lugar'],['a2_doi','Art. 2 · DOI'],
  ['a3_titulo','Art. 3 · Título'],['a3_autor','Art. 3 · Autor(es)'],['a3_anio','Art. 3 · Año'],['a3_lugar','Art. 3 · Revista / lugar'],['a3_doi','Art. 3 · DOI'],
  ['ctx1','Contexto · Problema'],['ctx2','Contexto · Importancia local'],['ctx3','Contexto · Causas y afectados'],['ctx4','Contexto · Qué dicen los artículos'],
  ['apa','Referencias APA'],['intro','Introducción y contextualización'],
  ['ent_nombre','Entrevista · Persona'],['ent_cargo','Entrevista · Cargo'],['ent_fecha','Entrevista · Fecha'],
  ['g1','Entrevista · Respuesta 1'],['g2','Entrevista · Respuesta 2'],['g3','Entrevista · Respuesta 3'],['g4','Entrevista · Respuesta 4'],
  ['p5','Pregunta propia 5'],['r5','Respuesta 5'],['p6','Pregunta propia 6'],['r6','Respuesta 6'],
  ['p7','Pregunta propia 7'],['r7','Respuesta 7'],['p8','Pregunta propia 8'],['r8','Respuesta 8']
];
const CLAVES = CAMPOS.map(function(c){ return c[0]; });

const COLS = ['clave','codigo','grupo','equipo','practica','integrantes','pinHash','ubicado','intentos','ubicadoEn',
  'fotoId','fotoEn','fotoOculta'].concat(CLAVES).concat(['creado','actualizado']);
const LEGIBLES = {
  clave:'Clave', codigo:'Código de grupo', grupo:'Grupo', equipo:'Equipo', practica:'Buena práctica', integrantes:'Integrantes',
  pinHash:'(PIN cifrado)', ubicado:'¿Ubicó el lugar?', intentos:'Intentos en el mapa', ubicadoEn:'Ubicado en',
  fotoId:'Foto (Drive)', fotoEn:'Foto en', fotoOculta:'Foto oculta del muro', creado:'Creado', actualizado:'Última modificación'
};
CAMPOS.forEach(function(c){ LEGIBLES[c[0]] = c[1]; });

/* ---------------- instalación ---------------- */
function instalar() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('SHEET_ID')) { Logger.log('Ya estaba instalado: ' + SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl()); return; }
  const carpeta = DriveApp.createFolder('Sustainability Mission (datos)');
  const fotos = carpeta.createFolder('Fotos');
  const ss = SpreadsheetApp.create('Sustainability Mission – Respuestas');
  DriveApp.getFileById(ss.getId()).moveTo(carpeta);
  const g = ss.getSheets()[0]; g.setName('Grupos');
  g.appendRow(['Código', 'Nombre del grupo', 'Creado']); g.setFrozenRows(1);
  const e = ss.insertSheet('Equipos');
  e.appendRow(COLS.map(function(c){ return LEGIBLES[c] || c; })); e.setFrozenRows(1);
  e.hideColumns(COLS.indexOf('pinHash') + 1);
  const m = ss.insertSheet('Miniaturas'); m.appendRow(['Clave', 'Miniatura']); m.hideSheet();
  props.setProperties({ SHEET_ID: ss.getId(), FOTOS_ID: fotos.getId(), CARPETA_ID: carpeta.getId() });
  Logger.log('Listo. Hoja: ' + ss.getUrl());
}

/* ---------------- entrada web ---------------- */
function doGet() { return json_({ ok: true, app: 'Sustainability Mission', version: 1 }); }
function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); return json_(enrutar_(req)); }
  catch (err) { return json_({ ok: false, error: 'server', detail: String(err && err.message || err) }); }
  finally { try { lock.releaseLock(); } catch (x) {} }
}
function enrutar_(q) {
  switch (q.a) {
    case 'grupo': return grupoInfo_(q);
    case 'entrar': return entrar_(q);
    case 'guardar': return guardar_(q);
    case 'foto': return foto_(q);
    case 'muro': return muro_(q);
    case 'docente': return docente_(q);
  }
  return { ok: false, error: 'unknown_action' };
}

/* ---------------- utilidades ---------------- */
function ss_() { return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')); }
function hoja_(n) { return ss_().getSheetByName(n); }
function norm_(c) { return String(c || '').trim().toUpperCase().replace(/\s+/g, ''); }
function ahora_() { return new Date().toISOString(); }
function verdad_(v) { return v === true || v === 'TRUE'; }
function hash_(codigo, equipo, pin) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, codigo + '|' + equipo + '|' + String(pin) + '|sustain');
  return b.map(function(x){ return ('0' + (x & 255).toString(16)).slice(-2); }).join('');
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function grupos_() {
  const v = hoja_('Grupos').getDataRange().getValues(); const out = [];
  for (let i = 1; i < v.length; i++) if (v[i][0]) out.push({ fila: i + 1, codigo: String(v[i][0]), nombre: String(v[i][1]), creado: v[i][2] });
  return out;
}
function grupo_(codigo) { const c = norm_(codigo); return grupos_().filter(function(g){ return g.codigo === c; })[0] || null; }
function equipos_() {
  const v = hoja_('Equipos').getDataRange().getValues(); const out = [];
  for (let i = 1; i < v.length; i++) {
    if (!v[i][0]) continue;
    const o = { _fila: i + 1 }; COLS.forEach(function(c, j){ o[c] = v[i][j]; }); out.push(o);
  }
  return out;
}
function equipo_(codigo, n) { const k = norm_(codigo) + '|' + Number(n); return equipos_().filter(function(t){ return t.clave === k; })[0] || null; }
function escribir_(t) {
  const fila = COLS.map(function(c){ return t[c] === undefined ? '' : t[c]; });
  const sh = hoja_('Equipos');
  if (t._fila) sh.getRange(t._fila, 1, 1, fila.length).setValues([fila]);
  else { sh.appendRow(fila); t._fila = sh.getLastRow(); }
}
function mini_(clave) {
  const v = hoja_('Miniaturas').getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (v[i][0] === clave) return { fila: i + 1, url: String(v[i][1]) };
  return null;
}
function publico_(t) {
  const c = {}; CLAVES.forEach(function(k){ c[k] = t[k] === undefined || t[k] === null ? '' : String(t[k]); });
  const m = t.fotoId ? mini_(t.clave) : null;
  return {
    codigo: t.codigo, grupo: t.grupo, equipo: Number(t.equipo), practica: t.practica, integrantes: String(t.integrantes || ''),
    ubicado: verdad_(t.ubicado), intentos: Number(t.intentos || 0), ubicadoEn: String(t.ubicadoEn || ''),
    tieneFoto: !!t.fotoId, fotoEn: String(t.fotoEn || ''), fotoOculta: verdad_(t.fotoOculta), mini: m ? m.url : '',
    campos: c, actualizado: String(t.actualizado || '')
  };
}
function auth_(q) {
  const g = grupo_(q.codigo); if (!g) return { error: 'group_not_found' };
  const t = equipo_(g.codigo, q.equipo); if (!t) return { error: 'team_not_found' };
  if (t.pinHash !== hash_(g.codigo, Number(q.equipo), q.pin)) return { error: 'wrong_pin' };
  return { g: g, t: t };
}

/* ---------------- alumnos ---------------- */
function grupoInfo_(q) {
  const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
  const usados = equipos_().filter(function(t){ return t.codigo === g.codigo; }).map(function(t){ return Number(t.equipo); });
  return { ok: true, codigo: g.codigo, nombre: g.nombre, equiposRegistrados: usados };
}
function entrar_(q) {
  const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
  const n = Number(q.equipo); if (!(n >= 1 && n <= 9)) return { ok: false, error: 'bad_team' };
  if (!/^\d{4}$/.test(String(q.pin || ''))) return { ok: false, error: 'bad_pin' };
  let t = equipo_(g.codigo, n);
  if (!t) {
    t = { clave: g.codigo + '|' + n, codigo: g.codigo, grupo: g.nombre, equipo: n, practica: PRACTICA_EQUIPO[n],
          integrantes: String(q.integrantes || '').slice(0, 600), pinHash: hash_(g.codigo, n, q.pin),
          ubicado: false, intentos: 0, fotoOculta: false, creado: ahora_(), actualizado: ahora_() };
    escribir_(t);
    return { ok: true, nuevo: true, team: publico_(t) };
  }
  if (t.pinHash !== hash_(g.codigo, n, q.pin)) return { ok: false, error: 'wrong_pin' };
  if (q.integrantes && String(q.integrantes).trim() && String(q.integrantes) !== String(t.integrantes)) {
    t.integrantes = String(q.integrantes).slice(0, 600); t.actualizado = ahora_(); escribir_(t);
  }
  return { ok: true, nuevo: false, team: publico_(t) };
}
function guardar_(q) {
  const a = auth_(q); if (a.error) return { ok: false, error: a.error };
  const t = a.t, d = q.datos || {};
  if (d.intentos !== undefined) t.intentos = Math.max(Number(t.intentos || 0), Number(d.intentos) || 0);
  if (d.ubicado === true && !verdad_(t.ubicado)) { t.ubicado = true; t.ubicadoEn = ahora_(); }
  if (d.campos) CLAVES.forEach(function(k){ if (d.campos[k] !== undefined) t[k] = String(d.campos[k]).slice(0, k === 'intro' ? 12000 : 4000); });
  t.actualizado = ahora_();
  escribir_(t);
  return { ok: true, team: publico_(t) };
}
function foto_(q) {
  const a = auth_(q); if (a.error) return { ok: false, error: a.error };
  const t = a.t;
  if (!q.foto) return { ok: false, error: 'no_photo' };
  const bytes = Utilities.base64Decode(String(q.foto));
  if (bytes.length > 8 * 1024 * 1024) return { ok: false, error: 'too_large' };
  const raiz = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('FOTOS_ID'));
  const it = raiz.getFoldersByName(t.grupo);
  const sub = it.hasNext() ? it.next() : raiz.createFolder(t.grupo);
  const nombre = t.grupo + ' – Equipo ' + t.equipo + '.jpg';
  const viejos = sub.getFilesByName(nombre); while (viejos.hasNext()) viejos.next().setTrashed(true);
  const f = sub.createFile(Utilities.newBlob(bytes, 'image/jpeg', nombre));
  t.fotoId = f.getId(); t.fotoEn = ahora_(); t.fotoOculta = false; t.actualizado = ahora_();
  escribir_(t);
  const mini = String(q.mini || '');
  if (mini.indexOf('data:image/') === 0 && mini.length < 48000) {
    const m = mini_(t.clave); const sh = hoja_('Miniaturas');
    if (m) sh.getRange(m.fila, 2).setValue(mini); else sh.appendRow([t.clave, mini]);
  }
  return { ok: true, team: publico_(t) };
}
function muro_(q) {
  const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
  const lista = equipos_().filter(function(t){ return t.codigo === g.codigo && t.fotoId && !verdad_(t.fotoOculta); }).map(function(t){
    const m = mini_(t.clave); return { equipo: Number(t.equipo), practica: t.practica, fotoEn: String(t.fotoEn), mini: m ? m.url : '' };
  });
  return { ok: true, fotos: lista };
}

/* ---------------- panel docente ---------------- */
function docente_(q) {
  if (String(q.pinDocente || '') !== PIN_DOCENTE || PIN_DOCENTE === 'CAMBIA-ESTE-PIN') return { ok: false, error: 'wrong_teacher_pin' };
  const props = PropertiesService.getScriptProperties();
  if (q.op === 'grupos') {
    const eqs = equipos_();
    return { ok: true, hoja: ss_().getUrl(), carpeta: DriveApp.getFolderById(props.getProperty('CARPETA_ID')).getUrl(),
      grupos: grupos_().map(function(g){ return { codigo: g.codigo, nombre: g.nombre, creado: String(g.creado),
        equipos: eqs.filter(function(t){ return t.codigo === g.codigo; }).length }; }) };
  }
  if (q.op === 'crearGrupo') {
    const nombre = String(q.nombre || '').trim().slice(0, 60); if (!nombre) return { ok: false, error: 'no_name' };
    const base = nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GRUPO';
    const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let codigo;
    do { let s = ''; for (let i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)]; codigo = base + '-' + s; } while (grupo_(codigo));
    hoja_('Grupos').appendRow([codigo, nombre, ahora_()]);
    return { ok: true, codigo: codigo, nombre: nombre };
  }
  if (q.op === 'equipos') {
    const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
    const lista = equipos_().filter(function(t){ return t.codigo === g.codigo; }).map(function(t){
      const p = publico_(t); p.fotoUrl = t.fotoId ? 'https://drive.google.com/file/d/' + t.fotoId + '/view' : ''; return p; });
    return { ok: true, grupo: g, equipos: lista };
  }
  if (q.op === 'ocultarFoto') {
    const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
    const t = equipo_(g.codigo, q.equipo); if (!t) return { ok: false, error: 'team_not_found' };
    t.fotoOculta = !!q.oculta; t.actualizado = ahora_(); escribir_(t);
    return { ok: true, fotoOculta: !!q.oculta };
  }
  if (q.op === 'reiniciarPin') {
    const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
    const t = equipo_(g.codigo, q.equipo); if (!t) return { ok: false, error: 'team_not_found' };
    if (!/^\d{4}$/.test(String(q.pin || ''))) return { ok: false, error: 'bad_pin' };
    t.pinHash = hash_(g.codigo, Number(q.equipo), q.pin); t.actualizado = ahora_(); escribir_(t);
    return { ok: true };
  }
  if (q.op === 'eliminarEquipo') {
    const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
    const t = equipo_(g.codigo, q.equipo); if (!t) return { ok: false, error: 'team_not_found' };
    archivar_([t], 'Equipo eliminado');
    return { ok: true };
  }
  if (q.op === 'eliminarGrupo') {
    const g = grupo_(q.codigo); if (!g) return { ok: false, error: 'group_not_found' };
    if (norm_(q.confirmar) !== g.codigo) return { ok: false, error: 'confirm_mismatch' };
    const eqs = equipos_().filter(function(t){ return t.codigo === g.codigo; });
    archivar_(eqs, 'Grupo eliminado');
    archivo_('Grupos eliminados', ['Eliminado en', 'Código', 'Nombre del grupo', 'Creado']).appendRow([ahora_(), g.codigo, g.nombre, g.creado]);
    hoja_('Grupos').deleteRow(g.fila);
    const raiz = DriveApp.getFolderById(props.getProperty('FOTOS_ID'));
    const it = raiz.getFoldersByName(g.nombre);
    if (it.hasNext() && !grupos_().some(function(x){ return x.nombre === g.nombre; })) it.next().setName(g.nombre + ' (eliminado ' + ahora_().slice(0, 10) + ')');
    return { ok: true, equiposArchivados: eqs.length };
  }
  return { ok: false, error: 'unknown_op' };
}

/* Eliminar sin perder datos: las filas pasan a pestañas de archivo y las fotos se renombran. */
function archivo_(nombre, encabezados) {
  const ss = ss_(); let sh = ss.getSheetByName(nombre);
  if (!sh) { sh = ss.insertSheet(nombre); sh.appendRow(encabezados); sh.setFrozenRows(1); }
  return sh;
}
function archivar_(lista, motivo) {
  if (!lista.length) return;
  const arch = archivo_('Eliminados', ['Eliminado en', 'Motivo'].concat(COLS.map(function(c){ return LEGIBLES[c] || c; })));
  const sh = hoja_('Equipos');
  lista.slice().sort(function(a, b){ return b._fila - a._fila; }).forEach(function(t) {
    arch.appendRow([ahora_(), motivo].concat(COLS.map(function(c){ return c === 'pinHash' ? '' : (t[c] === undefined ? '' : t[c]); })));
    if (t.fotoId) { try { const f = DriveApp.getFileById(String(t.fotoId)); f.setName(f.getName().replace(/\.jpg$/i, '') + ' (eliminado).jpg'); } catch (e) {} }
    const m = mini_(t.clave); if (m) hoja_('Miniaturas').deleteRow(m.fila);
    sh.deleteRow(t._fila);
  });
}
