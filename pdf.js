/* Sustainability Mission — PDF con todo lo que llenó el equipo (jsPDF + AutoTable) */
function limpiaPDF(s) {
  return String(s || '').replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/…/g, '...')
    .replace(/ /g, ' ').replace(/[^\x09\x0a\x0d\x20-\x7e¡-ÿ]/g, '');
}
async function crearPDF(D, p) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 48, ANCHO = W - 2 * M;
  const C = { montana: [42, 58, 52], pino: [58, 78, 70], olivo: [112, 136, 114], salvia: [157, 177, 158], niebla: [193, 205, 196], cielo: [225, 232, 230], tarjeta: [236, 236, 236] };
  const c = D.campos || {};
  let y = 0;
  const nuevaPagina = () => { doc.addPage(); y = M; };
  const espacio = h => { if (y + h > H - M - 20) nuevaPagina(); };
  const titulo = txt => {
    espacio(46); y += 10;
    doc.setFillColor(...C.salvia); doc.rect(M, y, 4, 18, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(...C.montana);
    doc.text(limpiaPDF(txt), M + 12, y + 14); y += 30;
  };
  const parrafo = (txt, opt = {}) => {
    const size = opt.size || 10.5; doc.setFont('helvetica', opt.bold ? 'bold' : 'normal'); doc.setFontSize(size);
    doc.setTextColor(...(opt.color || C.montana));
    const vacio = !String(txt || '').trim();
    const lineas = doc.splitTextToSize(limpiaPDF(vacio ? t('pdfEmpty') : txt), ANCHO - (opt.indent || 0));
    if (vacio) doc.setTextColor(...C.olivo);
    lineas.forEach(l => { espacio(size * 1.45); doc.text(l, M + (opt.indent || 0), y + size); y += size * 1.45; });
    y += opt.after !== undefined ? opt.after : 6;
  };

  /* Portada: franja con montañas */
  doc.setFillColor(...C.cielo); doc.rect(0, 0, W, 170, 'F');
  const capa = (col, pts) => { doc.setFillColor(...col); doc.lines(pts.slice(1).map((q, i) => [q[0] - pts[i][0], q[1] - pts[i][1]]), pts[0][0], pts[0][1], [1, 1], 'F', true); };
  capa(C.niebla, [[0, 120], [90, 88], [180, 110], [270, 80], [380, 112], [470, 76], [W, 104], [W, 170], [0, 170]]);
  capa(C.salvia, [[0, 140], [150, 122], [300, 136], [450, 118], [W, 134], [W, 170], [0, 170]]);
  capa(C.olivo, [[0, 156], [200, 146], [400, 156], [W, 148], [W, 170], [0, 170]]);
  doc.setFillColor(...C.montana); doc.rect(0, 164, W, 6, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.pino);
  doc.text(limpiaPDF(t('pdfTitle')).toUpperCase(), M, 40);
  doc.setFontSize(22); doc.setTextColor(...C.montana);
  const nom = doc.splitTextToSize(limpiaPDF(txtP(p, 'nombre')), ANCHO - 150);
  doc.text(nom, M, 68);
  y = 196;
  // Datos del equipo + foto
  const fotoW = 150, fotoH = 112;
  if (D.mini) { try { doc.addImage(D.mini, 'JPEG', W - M - fotoW, y, fotoW, fotoH, undefined, 'FAST'); doc.setDrawColor(...C.niebla); doc.rect(W - M - fotoW, y, fotoW, fotoH); } catch (e) {} }
  const datos = [[t('pdfTeam'), String(D.equipo)], [t('pdfGroup'), D.grupo], [t('pdfMembers'), (D.integrantes || '').split(/\n+/).filter(Boolean).join(', ')], [t('pdfProblem'), txtP(p, 'problema')]];
  const yIni = y;
  datos.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.olivo); doc.text(limpiaPDF(k).toUpperCase(), M, y + 9); y += 13;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...C.montana);
    doc.splitTextToSize(limpiaPDF(v || '-'), ANCHO - fotoW - 20).forEach(l => { doc.text(l, M, y + 10); y += 14; }); y += 6;
  });
  y = Math.max(y, yIni + fotoH + 10);

  /* Artículos */
  titulo(t('pdfArticles'));
  const filas = ARTICULOS.map(i => [String(i), ...COL_ART.map(k => limpiaPDF(c[`a${i}_${k}`] || ''))]);
  doc.autoTable({
    startY: y, margin: { left: M, right: M },
    head: [['#', t('aTitulo'), t('aAutor'), t('aAnio'), t('aLugar'), 'DOI'].map(limpiaPDF)], body: filas,
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, textColor: C.montana, lineColor: C.niebla, lineWidth: .5, overflow: 'linebreak' },
    headStyles: { fillColor: C.pino, textColor: 255, fontStyle: 'bold' }, alternateRowStyles: { fillColor: C.tarjeta },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 140 }, 2: { cellWidth: 95 }, 3: { cellWidth: 36 }, 4: { cellWidth: 90 } }
  });
  y = doc.lastAutoTable.finalY + 10;

  /* Contexto */
  titulo(t('pdfContext'));
  (CONTEXTO[IDIOMA] || CONTEXTO.en).forEach(([k, tag, q]) => { parrafo(q, { bold: true, size: 10, after: 2 }); parrafo(c[k], { after: 10 }); });

  /* Referencias */
  titulo(t('pdfRefs'));
  const refs = String(c.apa || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
  if (!refs.length) parrafo('');
  refs.forEach(r => parrafo(r, { after: 6 }));

  /* Introducción */
  titulo(t('pdfIntro'));
  const pars = String(c.intro || '').split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean);
  if (!pars.length) parrafo('');
  pars.forEach(s => parrafo(s, { after: 8 }));

  /* Entrevista */
  titulo(t('pdfInterview'));
  parrafo(`${t('who')}: ${c.ent_nombre || '-'}   ·   ${t('role')}: ${c.ent_cargo || '-'}   ·   ${t('date')}: ${c.ent_fecha || '-'}`, { size: 9.5, color: C.pino, after: 10 });
  (ENTREVISTA[IDIOMA] || ENTREVISTA.en).forEach(([k, q], i) => { parrafo(`${i + 1}. ${q}`, { bold: true, size: 10, after: 2 }); parrafo(c[k], { after: 10 }); });
  PROPIAS.forEach(n => { parrafo(`${n}. ${c['p' + n] || t('yourQuestion') + n}`, { bold: true, size: 10, after: 2 }); parrafo(c['r' + n], { after: 10 }); });

  /* Pie en cada página */
  const total = doc.getNumberOfPages();
  const fecha = new Date().toLocaleDateString(IDIOMA === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  for (let i = 1; i <= total; i++) {
    doc.setPage(i); doc.setDrawColor(...C.niebla); doc.line(M, H - 34, W - M, H - 34);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...C.olivo);
    doc.text(limpiaPDF(`UPSRJ · ${t('pdfDate')}${fecha} · ${t('made')}`), M, H - 20);
    doc.text(`${i} / ${total}`, W - M, H - 20, { align: 'right' });
  }
  const archivo = ('sustainability-mission-' + D.grupo + '-team-' + D.equipo + '-' + p.id).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-') + '.pdf';
  doc.save(archivo);
}
