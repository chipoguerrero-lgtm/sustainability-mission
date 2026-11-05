/* Sustainability Mission — conexión con el servidor (Google Apps Script).
   Si config.js no tiene URL, funciona en MODO DE PRUEBA: todo se guarda solo en este navegador. */
(function () {
  const URL_API = (window.MISION_CONFIG && window.MISION_CONFIG.API_URL || '').trim();
  const DEMO = !URL_API;

  async function llamar(datos) {
    if (DEMO) return demo(datos);
    let res;
    try {
      res = await fetch(URL_API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(datos), redirect: 'follow' });
    } catch (e) { return { ok: false, error: 'offline' }; }
    if (!res.ok) return { ok: false, error: 'http_' + res.status };
    try { return await res.json(); } catch (e) { return { ok: false, error: 'bad_response' }; }
  }

  /* ---------- servidor de prueba (mismo contrato que Code.gs) ---------- */
  const K = 'sustainMission.demo.v1';
  const PRACTICA_EQUIPO = { 1: 'vivero', 2: 'rotonda', 3: 'jardines', 4: 'planta', 5: 'lombricomposta', 6: 'bebederos', 7: 'huerto', 8: 'humedal', 9: 'captura' };
  const PIN_DOCENTE_DEMO = '0000';
  function cargar() {
    try { const v = JSON.parse(localStorage.getItem(K)); if (v && v.grupos) return v; } catch (e) {}
    return { grupos: { 'DEMO-A1B2': { codigo: 'DEMO-A1B2', nombre: 'Demo group', creado: new Date().toISOString() } }, equipos: {} };
  }
  function grabar(s) { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} }
  const norm = c => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
  const pub = t => { const o = Object.assign({}, t); delete o.pin; o.tieneFoto = !!t.mini; o.campos = Object.assign({}, t.campos); return o; };
  function demo(q) {
    const s = cargar(); const now = new Date().toISOString();
    const g = q.codigo ? s.grupos[norm(q.codigo)] : null;
    const clave = g ? g.codigo + '|' + Number(q.equipo) : '';
    const t = clave ? s.equipos[clave] : null;
    const auth = () => !g ? 'group_not_found' : !t ? 'team_not_found' : t.pin !== String(q.pin) ? 'wrong_pin' : null;
    let r;
    switch (q.a) {
      case 'grupo':
        r = g ? { ok: true, codigo: g.codigo, nombre: g.nombre, equiposRegistrados: Object.values(s.equipos).filter(x => x.codigo === g.codigo).map(x => x.equipo) } : { ok: false, error: 'group_not_found' }; break;
      case 'entrar': {
        if (!g) { r = { ok: false, error: 'group_not_found' }; break; }
        if (!/^\d{4}$/.test(String(q.pin || ''))) { r = { ok: false, error: 'bad_pin' }; break; }
        if (!t) {
          const n = Number(q.equipo);
          s.equipos[clave] = { codigo: g.codigo, grupo: g.nombre, equipo: n, practica: PRACTICA_EQUIPO[n], integrantes: q.integrantes || '', pin: String(q.pin), ubicado: false, intentos: 0, ubicadoEn: '', fotoEn: '', fotoOculta: false, mini: '', campos: {}, actualizado: now };
          grabar(s); r = { ok: true, nuevo: true, team: pub(s.equipos[clave]) }; break;
        }
        if (t.pin !== String(q.pin)) { r = { ok: false, error: 'wrong_pin' }; break; }
        r = { ok: true, nuevo: false, team: pub(t) }; break;
      }
      case 'guardar': {
        const e = auth(); if (e) { r = { ok: false, error: e }; break; }
        const d = q.datos || {};
        if (d.intentos !== undefined) t.intentos = Math.max(t.intentos || 0, d.intentos);
        if (d.ubicado && !t.ubicado) { t.ubicado = true; t.ubicadoEn = now; }
        if (d.campos) Object.assign(t.campos, d.campos);
        t.actualizado = now; grabar(s); r = { ok: true, team: pub(t) }; break;
      }
      case 'foto': {
        const e = auth(); if (e) { r = { ok: false, error: e }; break; }
        t.mini = q.mini || ''; t.fotoEn = now; t.fotoOculta = false; t.actualizado = now; grabar(s); r = { ok: true, team: pub(t) }; break;
      }
      case 'muro':
        r = g ? { ok: true, fotos: Object.values(s.equipos).filter(x => x.codigo === g.codigo && x.mini && !x.fotoOculta).map(x => ({ equipo: x.equipo, practica: x.practica, fotoEn: x.fotoEn, mini: x.mini })) } : { ok: false, error: 'group_not_found' }; break;
      case 'docente': {
        if (String(q.pinDocente) !== PIN_DOCENTE_DEMO) { r = { ok: false, error: 'wrong_teacher_pin' }; break; }
        const gg = q.codigo ? s.grupos[norm(q.codigo)] : null;
        const tt = gg ? s.equipos[gg.codigo + '|' + Number(q.equipo)] : null;
        if (q.op === 'grupos') r = { ok: true, hoja: '', carpeta: '', grupos: Object.values(s.grupos).map(x => Object.assign({}, x, { equipos: Object.values(s.equipos).filter(e => e.codigo === x.codigo).length })) };
        else if (q.op === 'crearGrupo') {
          const base = String(q.nombre || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GRUPO';
          const codigo = base + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
          s.grupos[codigo] = { codigo, nombre: q.nombre, creado: now }; grabar(s); r = { ok: true, codigo, nombre: q.nombre };
        } else if (q.op === 'equipos') r = gg ? { ok: true, grupo: gg, equipos: Object.values(s.equipos).filter(e => e.codigo === gg.codigo).map(e => Object.assign(pub(e), { fotoUrl: '' })) } : { ok: false, error: 'group_not_found' };
        else if (q.op === 'ocultarFoto') { if (tt) { tt.fotoOculta = !!q.oculta; grabar(s); r = { ok: true, fotoOculta: !!q.oculta }; } else r = { ok: false, error: 'team_not_found' }; }
        else if (q.op === 'reiniciarPin') { if (tt) { tt.pin = String(q.pin); grabar(s); r = { ok: true }; } else r = { ok: false, error: 'team_not_found' }; }
        else if (q.op === 'eliminarEquipo') { if (tt) { delete s.equipos[gg.codigo + '|' + Number(q.equipo)]; grabar(s); r = { ok: true }; } else r = { ok: false, error: 'team_not_found' }; }
        else if (q.op === 'eliminarGrupo') { if (!gg) r = { ok: false, error: 'group_not_found' }; else if (norm(q.confirmar) !== gg.codigo) r = { ok: false, error: 'confirm_mismatch' }; else { let n = 0; Object.keys(s.equipos).forEach(k => { if (s.equipos[k].codigo === gg.codigo) { delete s.equipos[k]; n++; } }); delete s.grupos[gg.codigo]; grabar(s); r = { ok: true, equiposArchivados: n }; } }
        else r = { ok: false, error: 'unknown_op' };
        break;
      }
      default: r = { ok: false, error: 'unknown_action' };
    }
    return new Promise(res => setTimeout(() => res(JSON.parse(JSON.stringify(r))), 120));
  }
  window.MisionAPI = { llamar, DEMO };
})();
