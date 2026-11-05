/* Sustainability Mission — buenas prácticas, mapa, preguntas.
   Para cambiar una pregunta o una pista, edita este archivo (inglés y español sencillo). */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Las 9 buenas prácticas (un equipo por práctica) ----------
   x, y = punto en el mapa (coordenadas del mapa satelital, 676 × 1180). */
const PRACTICAS = [
  { n: 1, id: 'vivero', x: 527, y: 360, color: '#3A4E46',
    en: { nombre: 'Native species nursery', pista: 'It is on the east side, next to the Sustainability Cabin, on the path toward the café.',
          problema: 'Loss of native vegetation and biodiversity in a semi-arid region.', buscar: 'native plant nursery, ecological restoration, semi-arid, Mexico' },
    es: { nombre: 'Vivero de especies nativas', pista: 'Está al oriente, junto a la cabaña de Sustentabilidad, en el camino hacia la cafetería.',
          problema: 'Pérdida de vegetación nativa y de biodiversidad en una región semiárida.', buscar: 'vivero de plantas nativas, restauración ecológica, semiárido, México' } },
  { n: 2, id: 'rotonda', x: 132, y: 358, color: '#708872',
    en: { nombre: 'Emblematic roundabout', pista: 'It is the roundabout at the main entrance, next to the highway.',
          problema: 'Green areas with exotic plants that need a lot of water and give little to local wildlife.', buscar: 'xeriscaping, native landscaping, urban green spaces, water saving' },
    es: { nombre: 'Rotonda emblemática', pista: 'Es la glorieta de la entrada principal, junto a la carretera.',
          problema: 'Áreas verdes con plantas exóticas que gastan mucha agua y ayudan poco a la fauna local.', buscar: 'xerojardinería, paisajismo con plantas nativas, áreas verdes urbanas' } },
  { n: 3, id: 'jardines', x: 452, y: 300, color: '#3A4E46',
    en: { nombre: 'Pollinator gardens', pista: 'They are north-east of Building 1, before the white-roofed halls.',
          problema: 'Decline of bees, butterflies and other pollinators.', buscar: 'pollinator garden, pollinator decline, urban biodiversity, monarch butterfly' },
    es: { nombre: 'Jardines polinizadores', pista: 'Están al noreste del Edificio 1, antes de las naves de techo blanco.',
          problema: 'Disminución de abejas, mariposas y otros polinizadores.', buscar: 'jardín para polinizadores, declive de polinizadores, mariposa monarca' } },
  { n: 4, id: 'planta', x: 476, y: 552, color: '#708872',
    en: { nombre: 'Wastewater treatment plant', pista: 'It is south-east of the Learning Center, next to the east fence.',
          problema: 'Wastewater that pollutes soil and water, and the waste of water that could be reused.', buscar: 'wastewater treatment, water reuse, decentralized treatment, university campus' },
    es: { nombre: 'Planta tratadora de aguas residuales', pista: 'Está al sureste del Learning Center, junto a la cerca del oriente.',
          problema: 'Aguas residuales que contaminan suelo y agua, y agua que se desperdicia en vez de reutilizarse.', buscar: 'tratamiento de aguas residuales, reúso de agua, campus universitario' } },
  { n: 5, id: 'lombricomposta', x: 598, y: 318, color: '#3A4E46',
    en: { nombre: 'Vermicompost bed', pista: 'It is on the east edge of campus, past the Sustainability Cabin.',
          problema: 'Organic waste that ends up in landfills and soils that lose fertility.', buscar: 'vermicomposting, organic waste management, soil fertility, earthworms' },
    es: { nombre: 'Cama de lombricomposta', pista: 'Está en la orilla oriente del campus, después de la cabaña de Sustentabilidad.',
          problema: 'Residuos orgánicos que terminan en rellenos sanitarios y suelos que pierden fertilidad.', buscar: 'lombricomposta, manejo de residuos orgánicos, fertilidad del suelo' } },
  { n: 6, id: 'bebederos', x: 16, y: 466, color: '#708872',
    en: { nombre: 'Water stations for peri-urban wildlife', pista: 'They are on the far west edge of campus, in the tree line beside the lower parking lot.',
          problema: 'Wildlife near cities that loses access to water because of drought and urban growth.', buscar: 'wildlife water sources, peri-urban wildlife, drought, urban ecology' },
    es: { nombre: 'Bebederos para la fauna periurbana', pista: 'Están en la orilla poniente del campus, entre los árboles junto al estacionamiento de abajo.',
          problema: 'Fauna cercana a las ciudades que se queda sin agua por la sequía y el crecimiento urbano.', buscar: 'bebederos para fauna, fauna periurbana, sequía, ecología urbana' } },
  { n: 7, id: 'huerto', x: 414, y: 344, color: '#3A4E46',
    en: { nombre: 'University vegetable garden', pista: 'It is right next to Building 1, on its east side, facing the artificial wetland.',
          problema: 'Dependence on food produced far away, and little contact with how food is grown.', buscar: 'university garden, urban agriculture, food security, campus garden education' },
    es: { nombre: 'Huerto universitario', pista: 'Está junto al Edificio 1, del lado derecho, frente al humedal artificial.',
          problema: 'Dependencia de alimentos que vienen de lejos y poco contacto con cómo se cultivan.', buscar: 'huerto universitario, agricultura urbana, seguridad alimentaria' } },
  { n: 8, id: 'humedal', x: 430, y: 386, color: '#708872',
    en: { nombre: 'Artificial wetland', pista: 'It is south-east of Building 1, at the start of the path toward the Learning Center, facing the vegetable garden.',
          problema: 'Polluted water that needs natural, low-energy treatment.', buscar: 'constructed wetland, natural wastewater treatment, phytoremediation' },
    es: { nombre: 'Humedal artificial', pista: 'Está al sureste del Edificio 1, al inicio del camino hacia el Learning Center, frente al huerto.',
          problema: 'Agua contaminada que necesita un tratamiento natural y con poca energía.', buscar: 'humedal artificial, tratamiento natural de aguas, fitorremediación' } },
  { n: 9, id: 'captura', x: 566, y: 140, color: '#3A4E46',
    en: { nombre: 'Rainwater harvesting', pista: 'It is at the large white-roofed hall in the north, next to the dirt parking lot.',
          problema: 'Water scarcity in Querétaro and over-exploitation of aquifers.', buscar: 'rainwater harvesting, water scarcity, aquifer, Querétaro' },
    es: { nombre: 'Captura de agua de lluvia', pista: 'Está en la nave grande de techo blanco del norte, junto al estacionamiento de tierra.',
          problema: 'Escasez de agua en Querétaro y sobreexplotación de los acuíferos.', buscar: 'captación de agua de lluvia, escasez de agua, acuífero, Querétaro' } }
];
const practica = id => PRACTICAS.find(p => p.id === id);
const txtP = (p, k) => (p[typeof IDIOMA !== 'undefined' ? IDIOMA : 'en'] || p.en)[k];

/* Edificios del campus (solo referencia, con nombre) */
const MAPA_W = 676, MAPA_H = 1180;
const EDIFICIOS = [
  { en: 'Building 1', es: 'Edificio 1', parts: [{ x: 232, y: 327, w: 152, h: 35, top: '#a98d7a', panels: true }, { x: 222, y: 331, w: 12, h: 27, top: '#a98d7a' }, { x: 384, y: 333, w: 16, h: 20, top: '#d8dcd9' }] },
  { en: 'Building 2', es: 'Edificio 2', parts: [{ x: 442, y: 130, w: 118, h: 54, top: '#eef0ee' }] },
  { en: '', es: '', parts: [{ x: 440, y: 44, w: 86, h: 30, top: '#e3e6e4' }] },
  { en: '', es: '', tent: true, parts: [{ x: 490, y: 230, w: 56, h: 66, top: '#f4f4f2' }] },
  { en: 'Cabin', es: 'Cabaña', parts: [{ x: 486, y: 320, w: 36, h: 22, top: '#eef0ee' }, { x: 536, y: 321, w: 28, h: 18, top: '#b9927a' }] },
  { en: 'Learning Center', es: 'Learning Center', parts: [{ x: 348, y: 482, w: 102, h: 74, top: '#9aa39e', panels: true }] },
  { en: 'Metra Center', es: 'Metra Center', parts: [{ x: 168, y: 545, w: 88, h: 47, top: '#a98d7a' }, { x: 168, y: 592, w: 88, h: 42, top: '#e4e7e5' }] },
  { en: '', es: '', parts: [{ x: 76, y: 655, w: 62, h: 52, top: '#b9927a' }, { x: 138, y: 662, w: 68, h: 40, top: '#d6d1c8' }] },
  { en: '', es: '', parts: [{ x: 428, y: 448, w: 20, h: 24, top: '#eceff0' }] }
];
/* Vista inicial del mapa: la zona donde están las prácticas */
const VISTA_INICIAL = [0, 70, 676, 560];

/* ---------- Fase 2: investigación ---------- */
const CONTEXTO = {
  en: [
    ['ctx1', 'The problem', 'What environmental problem does this good practice try to solve? Describe it in your own words.'],
    ['ctx2', 'Why it matters here', 'Why is this problem important in Querétaro and at UPSRJ? Give data or examples if you can.'],
    ['ctx3', 'Causes and people affected', 'What causes the problem? Who or what is affected (people, animals, plants, water, soil)?'],
    ['ctx4', 'What research says', 'What do your three articles say about this problem and about solutions like this one?']
  ],
  es: [
    ['ctx1', 'El problema', '¿Qué problema ambiental quiere resolver esta buena práctica? Explícalo con tus palabras.'],
    ['ctx2', 'Por qué importa aquí', '¿Por qué este problema es importante en Querétaro y en la UPSRJ? Da datos o ejemplos si puedes.'],
    ['ctx3', 'Causas y afectados', '¿Qué causa el problema? ¿A quién o a qué afecta? (personas, animales, plantas, agua, suelo)'],
    ['ctx4', 'Qué dice la investigación', '¿Qué dicen tus tres artículos sobre este problema y sobre soluciones como esta?']
  ]
};
/* ---------- Fase 3: entrevista ---------- */
const ENTREVISTA = {
  en: [
    ['g1', 'How did this good practice start at UPSRJ, and who is in charge of it?'],
    ['g2', 'What problem does it solve on campus, and what results have you seen so far?'],
    ['g3', 'What does it need to work (people, water, money, materials), and what are its main challenges?'],
    ['g4', 'How can students take part or help this practice grow?']
  ],
  es: [
    ['g1', '¿Cómo empezó esta buena práctica en la UPSRJ? ¿Quién es responsable?'],
    ['g2', '¿Qué problema resuelve en el campus? ¿Qué resultados han visto?'],
    ['g3', '¿Qué necesita para funcionar? (personas, agua, dinero, materiales) ¿Cuáles son sus retos?'],
    ['g4', '¿Cómo pueden participar los alumnos o ayudar a que crezca?']
  ]
};
const PROPIAS = [5, 6, 7, 8];
const ARTICULOS = [1, 2, 3];
const COL_ART = ['titulo', 'autor', 'anio', 'lugar', 'doi'];
const DOI_RE = /^(https?:\/\/(dx\.)?doi\.org\/)?10\.\d{4,9}\/\S+$/i;
