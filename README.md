# Sustainability Mission UPSRJ · Good practices

Actividad por equipos sobre las **buenas prácticas de sustentabilidad** del campus de la UPSRJ.

- **Página de alumnos:** `index.html`, en inglés, con botón de **español sencillo** y modo de **baja visión**. No necesitan cuenta.
- **Panel docente:** `docente.html`, protegido con tu PIN.
- **Datos:** se guardan en el Google Drive de **cguerrero@upsrj.edu.mx**, a través de Google Apps Script (`apps-script/Code.gs`), en una hoja de cálculo y una carpeta de fotos.

## Fases

| Fase | Qué hacen los equipos |
|---|---|
| **Entrada** | Escriben el código de grupo, eligen su equipo y crean un PIN de 4 dígitos. Pueden volver cualquier día, desde cualquier celular. |
| **1 · Encuentra y foto** | Ubican su buena práctica en el mapa (los nombres están ocultos), van al lugar y publican la foto del equipo. Esto abre las fases 2 y 3. |
| **2 · Investiga** | Registran 3 artículos (título, autor, año, revista o lugar de publicación, DOI), responden 4 preguntas guía sobre el problema, escriben al menos una referencia APA 7 y redactan su introducción y contextualización. |
| **3 · Entrevista** | Entrevistan al Departamento de Sustentabilidad con 4 preguntas guía y 4 preguntas propias. |
| **PDF** | Descargan todo lo que llenaron en un PDF para hacer su infografía. |

## Las 9 buenas prácticas (un equipo por práctica)

1. Vivero de especies nativas
2. Rotonda emblemática
3. Jardines polinizadores
4. Planta tratadora de aguas residuales
5. Cama de lombricomposta
6. Bebederos para la fauna periurbana
7. Huerto universitario
8. Humedal artificial
9. Captura de agua de lluvia

## Instalación (una sola vez, unos 15 minutos)

### 1. Servidor en Google Apps Script (cuenta institucional)

1. Entra a <https://script.google.com> con **cguerrero@upsrj.edu.mx** y crea un **Proyecto nuevo** llamado *Sustainability Mission*.
2. Borra lo que trae `Código.gs` y pega todo el contenido de [`apps-script/Code.gs`](apps-script/Code.gs).
3. En la línea `const PIN_DOCENTE = 'CAMBIA-ESTE-PIN';` pon un PIN que solo tú conozcas, entre las comillas. Guarda.
4. Elige la función **instalar** y pulsa **Ejecutar**. Acepta los permisos; si aparece "Google no ha verificado esta aplicación", entra en *Configuración avanzada › Ir a Sustainability Mission*.
5. **Implementar › Nueva implementación › Aplicación web**, con *Ejecutar como: Yo* y *Quién tiene acceso: Cualquier usuario*. Copia la URL que termina en `/exec`.

### 2. Conectar y publicar

1. Pega la URL en `config.js`: `API_URL: 'https://script.google.com/macros/s/…/exec'`.
2. En el repositorio ve a **Settings › Pages**, elige *Deploy from a branch*, rama **main**, carpeta **/ (root)**, y pulsa **Save**.
   - Alumnos: `https://chipoguerrero-lgtm.github.io/sustainability-mission/`
   - Tú: la misma liga con `docente.html` al final.

## En el panel docente

- Crea cada grupo y comparte su código.
- Revisa el avance, la investigación y la entrevista de cada equipo.
- **Ocultar del muro:** quita una foto del muro de llegadas del grupo; el equipo conserva su avance y la foto sigue en tu Drive. Puedes volver a mostrarla.
- Reinicia PINs y elimina equipos o grupos; sus datos pasan a las pestañas «Eliminados» y «Grupos eliminados».

## Modo de prueba

Mientras `config.js` no tenga URL, todo se guarda solo en ese navegador. Grupo de prueba: `DEMO-A1B2` · PIN docente de prueba: `0000`.

## Cambiar preguntas, pistas o lugares

Todo está en `data.js`: `PRACTICAS` (nombres, pistas, problema, palabras de búsqueda y posición en el mapa), `CONTEXTO` (preguntas de la fase 2) y `ENTREVISTA` (preguntas guía de la fase 3). Si cambias qué práctica tiene cada equipo, cámbialo también en `PRACTICA_EQUIPO` de `apps-script/Code.gs`.
