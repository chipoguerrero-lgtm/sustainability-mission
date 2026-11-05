/* Sustainability Mission — textos de la interfaz: inglés y español sencillo (frases cortas, una idea por frase). */
var IDIOMA = 'en';
const I18N = {
  en: {
    skip: 'Skip to content', access: 'Reading options', btnLv: 'Low vision', btnLvOff: 'Standard view',
    lvBar: 'Reading options', bigger: 'Text A+', smaller: 'Text A−', toWhite: 'White background', toBlack: 'Black background',
    eyebrow: 'UPSRJ · Sustainability Department', tagline: 'Good practices', phasesNav: 'Phases',
    st1: '1 · Find & photo', st2: '2 · Research', st3: '3 · Interview', st4: 'PDF', exit: 'Exit',
    demo: 'Demo mode: nothing is sent to your teacher. Everything stays in this browser.', lsmNote: '',
    beforeStart: 'Before you start', enterTeam: 'Enter your team',
    introLogin: 'Your teacher gives your group a code. Each team creates a 4-digit PIN the first time. With the same code, team and PIN you can come back any day, from any phone.',
    groupCode: 'Group code', askTeacher: 'Ask your teacher for it.', team: 'Team', chooseTeam: 'Choose your team…', registered: '(registered)',
    pinLabel: 'Team PIN (4 digits)', pinNew: 'First time: create a 4-digit PIN and share it only with your team.', pinOld: 'This team is registered. Enter the PIN your team created.',
    members: 'Team members', membersPh: 'One full name per line', cont: 'Continue', entering: 'Entering…',
    practiceOf: 'Good practice: ', assignments: 'The 9 good practices', teamsPlaces: '9 teams, 9 good practices on campus',
    attempts: 'Attempts: ', group: 'Group ', teamN: 'Team ', yourPractice: 'Your good practice', problemFocus: 'Problem to research: ',
    t1h: 'Find it on the map', t1p: 'Tap the round point where you think your good practice is. Names are hidden. Use the buildings to orient yourself.',
    listOpen: 'Can’t tap the map? Choose from a list', t1list: 'Each button describes one point on the map.',
    t2h: 'Go there and take a photo', t2p: 'Walk to the place. The photo must show the whole team at the good practice.',
    upload: 'Upload team photo', fromCam: 'From your camera or gallery', goF2: 'Continue to Phase 2',
    p1lock: 'Find your good practice and post your team photo to unlock Phases 2 and 3.',
    // fase 2
    f2eyebrow: 'Phase 2 · Research', f2h: 'Research the problem',
    f2p: 'Find out what problem your good practice tries to solve. Use academic sources, write in your own words and cite with APA 7.',
    artH: 'A. Three research articles', artP: 'Find 3 research articles about the problem. Fill in one card per article.',
    whereSearch: 'Where to search: ', searchTerms: 'Search terms you can try: ',
    article: 'Article ', aTitulo: 'Title of the article', aAutor: 'Author(s)', aAnio: 'Year', aLugar: 'Journal or place of publication', aDoi: 'DOI',
    doiHelp: 'Example: 10.1016/j.jenvman.2020.110203', doiBad: 'This does not look like a DOI. It usually starts with 10.',
    ctxH: 'B. Context of the problem', ctxP: 'Answer the guiding questions. Support your ideas with your articles.',
    apaH: 'C. APA references', apaP: 'Write at least one reference in APA 7 format. One per line.',
    apaEx: 'Example: Pérez, L., & Gómez, R. (2021). Rainwater harvesting in semi-arid cities. Journal of Water Studies, 12(3), 45–60. https://doi.org/10.xxxx/xxxxx',
    introH: 'D. Introduction and contextualization', introP: 'Write the introduction of your infographic: present the problem, why it matters in Querétaro and how this good practice responds to it. Include at least one in-text APA citation, for example (Pérez & Gómez, 2021).',
    words: 'words', wordsGoal: 'Goal: 150–300 words', goF3: 'Continue to Phase 3',
    // fase 3
    f3eyebrow: 'Phase 3 · Interview', f3h: 'Interview the Sustainability Department',
    f3p: 'Book a short interview with the Sustainability Department about your good practice. Use the 4 guiding questions and write 4 questions of your own.',
    who: 'Person interviewed', role: 'Position', date: 'Date of the interview',
    guided: 'Guiding questions', own: 'Your own questions', answer: 'Answer', yourQuestion: 'Your question ',
    goPdf: 'Go to the PDF',
    // final
    f4eyebrow: 'Final · Your information', f4h: 'Download your work as a PDF',
    f4p: 'The PDF includes everything your team wrote. Use it to design your infographic.',
    checkPhoto: 'Team photo', checkArt: 'Three articles', checkCtx: 'Context questions', checkApa: 'APA reference', checkIntro: 'Introduction (150+ words)', checkEnt: 'Interview (8 answers)',
    download: 'Download PDF', making: 'Creating the PDF…', pdfReady: 'Your PDF is downloading.', pdfFail: 'Could not create the PDF. Try again or use another browser.',
    missing: 'Some parts are still empty. You can download the PDF anyway.',
    wall: 'Arrivals wall', wallEmpty: 'No team has arrived yet. The first photo will show up here.', arrived: 'Arrived ',
    exitConfirm: 'Your work is saved. Exit this team on this phone?', exitYes: 'Yes, exit', cancel: 'Cancel',
    // estados
    offline: 'No connection. Check your internet and try again.', group_not_found: 'That group code does not exist. Check it with your teacher.',
    team_not_found: 'That team is not registered yet.', wrong_pin: 'Wrong PIN for this team. If you forgot it, ask your teacher to reset it.',
    bad_pin: 'The PIN must be exactly 4 digits.', too_large: 'The photo is too large. Try another one.', genericErr: 'Something went wrong ({e}). Try again.',
    chooseTeamErr: 'Choose your team.', membersErr: 'Write the names of the team members.', opening: 'Opening your team…',
    found: 'Found in {n} {w}. Now go there.', attempt: 'attempt', attemptsW: 'attempts', savedLater: ' Your answer will be saved when you are back online.',
    notYours: 'That is another good practice, not yours. ', hint: 'Hint: ',
    posting: 'Posting photo…', badImage: 'That file is not a supported image. Use a JPG or PNG photo.', posted: 'Photo posted on your group wall.',
    typing: 'Typing…', saving: 'Saving…', saved: 'Saved ', savedLocal: 'Saved in this browser ', keptPhone: ' Your text is kept on this phone.', noChanges: 'No changes', tryAgain: 'Try again',
    spot: 'Point', mapAria: 'Map of the UPSRJ campus with the good practices',
    // PDF
    pdfTitle: 'Sustainability Mission UPSRJ · Good practices', pdfTeam: 'Team', pdfGroup: 'Group', pdfMembers: 'Members', pdfProblem: 'Problem',
    pdfArticles: 'Research articles', pdfContext: 'Context of the problem', pdfRefs: 'References (APA 7)', pdfIntro: 'Introduction and contextualization',
    pdfInterview: 'Interview with the Sustainability Department', pdfEmpty: '(empty)', pdfDate: 'Created on ', made: 'Designed and built by Chipo'
  },
  es: {
    skip: 'Saltar al contenido', access: 'Opciones de lectura', btnLv: 'Baja visión', btnLvOff: 'Vista normal',
    lvBar: 'Opciones de lectura', bigger: 'Letra A+', smaller: 'Letra A−', toWhite: 'Fondo blanco', toBlack: 'Fondo negro',
    eyebrow: 'UPSRJ · Departamento de Sustentabilidad', tagline: 'Buenas prácticas', phasesNav: 'Fases',
    st1: '1 · Encuentra y foto', st2: '2 · Investiga', st3: '3 · Entrevista', st4: 'PDF', exit: 'Salir',
    demo: 'Modo de prueba. Nada llega a tu profesor. Todo se guarda solo en este navegador.', lsmNote: 'Si necesitas intérprete de LSM, avisa a tu profesor.',
    beforeStart: 'Antes de empezar', enterTeam: 'Entra con tu equipo',
    introLogin: 'Tu profesor te da un código de grupo. La primera vez, tu equipo crea un PIN de 4 números. Con el código, el equipo y el PIN puedes volver cualquier día. Puedes usar cualquier celular.',
    groupCode: 'Código de grupo', askTeacher: 'Pídelo a tu profesor.', team: 'Equipo', chooseTeam: 'Elige tu equipo…', registered: '(ya registrado)',
    pinLabel: 'PIN del equipo (4 números)', pinNew: 'Primera vez: crea un PIN de 4 números. Compártelo solo con tu equipo.', pinOld: 'Este equipo ya está registrado. Escribe el PIN de tu equipo.',
    members: 'Integrantes del equipo', membersPh: 'Un nombre completo en cada línea', cont: 'Continuar', entering: 'Entrando…',
    practiceOf: 'Buena práctica: ', assignments: 'Las 9 buenas prácticas', teamsPlaces: '9 equipos, 9 buenas prácticas en el campus',
    attempts: 'Intentos: ', group: 'Grupo ', teamN: 'Equipo ', yourPractice: 'Tu buena práctica', problemFocus: 'Problema para investigar: ',
    t1h: 'Encuéntrala en el mapa', t1p: 'Toca el punto redondo donde crees que está tu buena práctica. Los nombres no aparecen. Usa los edificios para ubicarte.',
    listOpen: '¿No puedes tocar el mapa? Elige en una lista', t1list: 'Cada botón describe un punto del mapa.',
    t2h: 'Ve al lugar y tómate una foto', t2p: 'Camina al lugar. En la foto debe estar todo el equipo en la buena práctica.',
    upload: 'Subir la foto del equipo', fromCam: 'Desde la cámara o la galería', goF2: 'Continuar a la fase 2',
    p1lock: 'Encuentra tu buena práctica y sube la foto del equipo. Así se abren las fases 2 y 3.',
    f2eyebrow: 'Fase 2 · Investigación', f2h: 'Investiga el problema',
    f2p: 'Investiga qué problema quiere resolver tu buena práctica. Usa fuentes académicas. Escribe con tus palabras. Cita en APA 7.',
    artH: 'A. Tres artículos de investigación', artP: 'Busca 3 artículos de investigación sobre el problema. Llena una tarjeta por artículo.',
    whereSearch: 'Dónde buscar: ', searchTerms: 'Palabras que puedes buscar: ',
    article: 'Artículo ', aTitulo: 'Nombre del artículo', aAutor: 'Autor o autores', aAnio: 'Año', aLugar: 'Revista o lugar de publicación', aDoi: 'DOI',
    doiHelp: 'Ejemplo: 10.1016/j.jenvman.2020.110203', doiBad: 'Esto no parece un DOI. Casi siempre empieza con 10.',
    ctxH: 'B. Contexto del problema', ctxP: 'Responde las preguntas guía. Apoya tus ideas en tus artículos.',
    apaH: 'C. Referencias APA', apaP: 'Escribe al menos una referencia en formato APA 7. Una en cada línea.',
    apaEx: 'Ejemplo: Pérez, L., y Gómez, R. (2021). Captación de agua de lluvia en ciudades semiáridas. Revista de Estudios del Agua, 12(3), 45–60. https://doi.org/10.xxxx/xxxxx',
    introH: 'D. Introducción y contextualización', introP: 'Escribe la introducción de tu infografía. Presenta el problema. Explica por qué importa en Querétaro. Explica cómo responde esta buena práctica. Incluye al menos una cita APA en el texto, por ejemplo (Pérez y Gómez, 2021).',
    words: 'palabras', wordsGoal: 'Meta: 150–300 palabras', goF3: 'Continuar a la fase 3',
    f3eyebrow: 'Fase 3 · Entrevista', f3h: 'Entrevista al Departamento de Sustentabilidad',
    f3p: 'Pide una entrevista corta al Departamento de Sustentabilidad sobre tu buena práctica. Usa las 4 preguntas guía. Escribe 4 preguntas propias.',
    who: 'Persona entrevistada', role: 'Puesto', date: 'Fecha de la entrevista',
    guided: 'Preguntas guía', own: 'Sus preguntas', answer: 'Respuesta', yourQuestion: 'Su pregunta ',
    goPdf: 'Ir al PDF',
    f4eyebrow: 'Final · Tu información', f4h: 'Descarga tu trabajo en PDF',
    f4p: 'El PDF tiene todo lo que escribió tu equipo. Úsalo para hacer tu infografía.',
    checkPhoto: 'Foto del equipo', checkArt: 'Tres artículos', checkCtx: 'Preguntas de contexto', checkApa: 'Referencia APA', checkIntro: 'Introducción (150 palabras o más)', checkEnt: 'Entrevista (8 respuestas)',
    download: 'Descargar PDF', making: 'Creando el PDF…', pdfReady: 'Tu PDF se está descargando.', pdfFail: 'No se pudo crear el PDF. Intenta otra vez o usa otro navegador.',
    missing: 'Todavía faltan partes. Puedes descargar el PDF de todos modos.',
    wall: 'Muro de llegadas', wallEmpty: 'Todavía no llega ningún equipo. Aquí aparecerá la primera foto.', arrived: 'Llegó ',
    exitConfirm: 'Tu trabajo está guardado. ¿Salir de este equipo en este celular?', exitYes: 'Sí, salir', cancel: 'Cancelar',
    offline: 'No hay internet. Revisa tu conexión e intenta otra vez.', group_not_found: 'Ese código de grupo no existe. Revísalo con tu profesor.',
    team_not_found: 'Ese equipo todavía no está registrado.', wrong_pin: 'El PIN no es correcto. Si lo olvidaste, pide a tu profesor que lo cambie.',
    bad_pin: 'El PIN debe tener 4 números.', too_large: 'La foto pesa mucho. Prueba con otra.', genericErr: 'Algo salió mal ({e}). Intenta otra vez.',
    chooseTeamErr: 'Elige tu equipo.', membersErr: 'Escribe los nombres de los integrantes.', opening: 'Abriendo tu equipo…',
    found: '¡La encontraron! {n} {w}. Ahora vayan al lugar.', attempt: 'intento', attemptsW: 'intentos', savedLater: ' Se guardará cuando vuelva el internet.',
    notYours: 'Esa es otra buena práctica. No es la suya. ', hint: 'Pista: ',
    posting: 'Subiendo la foto…', badImage: 'Ese archivo no es una foto válida. Usa una foto JPG o PNG.', posted: 'La foto ya está en el muro de tu grupo.',
    typing: 'Escribiendo…', saving: 'Guardando…', saved: 'Guardado ', savedLocal: 'Guardado en este navegador ', keptPhone: ' Tu texto se queda en este celular.', noChanges: 'Sin cambios', tryAgain: 'Intentar otra vez',
    spot: 'Punto', mapAria: 'Mapa del campus de la UPSRJ con las buenas prácticas',
    pdfTitle: 'Sustainability Mission UPSRJ · Buenas prácticas', pdfTeam: 'Equipo', pdfGroup: 'Grupo', pdfMembers: 'Integrantes', pdfProblem: 'Problema',
    pdfArticles: 'Artículos de investigación', pdfContext: 'Contexto del problema', pdfRefs: 'Referencias (APA 7)', pdfIntro: 'Introducción y contextualización',
    pdfInterview: 'Entrevista al Departamento de Sustentabilidad', pdfEmpty: '(vacío)', pdfDate: 'Creado el ', made: 'Diseñado y construido por Chipo'
  }
};
function t(k, vars) {
  const d = I18N[IDIOMA] || I18N.en;
  let s = d[k] !== undefined ? d[k] : (I18N.en[k] !== undefined ? I18N.en[k] : k);
  if (vars) Object.keys(vars).forEach(v => { s = s.replace('{' + v + '}', vars[v]); });
  return s;
}
function aplicarTextos() {
  document.documentElement.lang = IDIOMA;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-t-ph]').forEach(el => { el.placeholder = t(el.dataset.tPh); });
  document.querySelectorAll('[data-t-alt]').forEach(el => { el.alt = t(el.dataset.tAlt); });
  document.querySelectorAll('[data-t-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.tAria)); });
}
