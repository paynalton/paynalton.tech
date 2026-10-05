# PT08 — Biblioteca, lector y Sobre mí

Implementación local con ejemplos aislados para revisar la lectura. Sin despliegue. El cierre editorial PT08-C —incorporar originales completos seleccionados— mantiene su lugar al finalizar la implementación del sitio. Siguiente frente: PT09, búsqueda, filtros y temas.

## Qué revisar

La [galería](index.html) reúne biblioteca, libro, Sobre mí y lector en escritorio y móvil. El lector también tiene captura a 320 px.

Sitio normal:

```sh
nvm use
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

- `/es/obra/`: biblioteca a partir de la selección configurada.
- `/es/books/cuando-la-tostadora-te-responde/`: ficha del libro en su dirección existente, presentación, partes, autoría, año, licencia, ilustración local y seis descargas.
- `/es/sobre-mi/`: biografía, seis apartados de forma de trabajar, intereses, cuatro reflexiones sobre lecturas y enlace voluntario a Spotify.

Lector de revisión:

```sh
npm run build:design
npm run preview:design -- --host 127.0.0.1 --port 4322 --ignore-lock
```

Abrir `/design-review/reading/es/obra/`, elegir la muestra y comenzar la lectura. El recorrido incluye ficha, índice de capítulos, índice de secciones, notas con retorno de foco, anterior/siguiente, regreso a la ficha y biblioteca. Textos con párrafos, listas, cita tipográfica y versos identificados como material de prueba.

Las preferencias permiten tres tamaños de texto y superficie clara u oscura. Se guardan localmente cuando el navegador lo permite; un bloqueo de almacenamiento conserva su funcionamiento durante la página actual. El contenido y toda la navegación de lectura funcionan sin JavaScript.

La variante sintética inglesa usa textos expandidos, dirección RTL y un slug distinto. Solo tiene el primer capítulo traducido: el selector enlaza equivalencias por ID y desaparece en el capítulo sin equivalente. No representa una traducción lista para publicación.

## Configurar obras sin modificar plantillas

1. Registrar una entidad `work` en `src/data/site/entities.json`, con ID estable, visibilidad, formato, autor y relaciones. Año, licencia, URL de licencia, ilustración local y ediciones descargables son opcionales.
2. Añadir su variante en `src/data/site/editorial/es.json`: título, resumen, slug, metadatos, referencia al cuerpo Markdown y capítulos ordenados. Cada capítulo tiene un ID estable, slug, título y referencia a su propio cuerpo.
3. Guardar los textos en `src/data/site/bodies/es/`. Usar encabezados para el índice de secciones y enlaces de nota con identificadores y retorno al punto de lectura. Los enlaces relativos entre capítulos deben revisarse cuando se cambian sus slugs.
4. Agregar y ordenar los IDs en `works` y `featuredWorks` dentro de `selection.json`. La selección controla presencia y orden del catálogo/Inicio; la visibilidad y el estado editorial controlan la publicación de las rutas. Quitar una obra de la selección no la despublica: para eso se cambia a borrador.
5. Ejecutar la validación. Los capítulos se generan desde los datos y su orden determina la navegación anterior/siguiente. No se edita el componente del lector para incorporar una obra.

La dirección histórica de *Cuando la tostadora te responde* es una excepción de compatibilidad centralizada. Las demás obras usan `/es/obra/{slug}/` y sus capítulos `/es/obra/{slug}/{capitulo}/`.

El ejemplo existente sigue con visibilidad `example` y sin autor. Solo el build de revisión lo expone mediante una fuente acotada, siempre con aviso y `noindex`. El build normal limpia las colecciones sintéticas y rechaza sus marcadores. Alma y Blanco, Negro y Gris no se incorporan al nuevo catálogo.

## Libro existente y diccionarios

La ficha española usa el modelo nuevo y conserva su URL; las páginas inglesa y náhuatl conservan su plantilla. El manifiesto reconoce esas dos páginas existentes como alternativas reales y evita generarlas por duplicado. No se habilitan EN/NAH en el modelo general.

Las seis descargas PDF/EPUB proceden de una única configuración compartida. El selector modifica el archivo sin cambiar el idioma de la página. La lista HTML permite descargar cualquier edición sin JavaScript. No se anuncian capítulos ni lectura en línea del libro hasta incorporar el original al lector en PT08-C.

Los textos nuevos están en `ui/es.json` y cuerpos/editorial por idioma. Los textos de las páginas históricas del libro se extrajeron a `src/data/books/toaster-copy.json`, conservando sus traducciones. Se corrigieron sus recuentos tras revisar los archivos con `pdfinfo`: español 229 páginas, inglés 220 y náhuatl 223. Los EPUB no reciben paginación fija.

Las reflexiones de Sobre mí se presentan como interpretaciones personales de libros ajenos, separadas de las obras del autor. Goodreads y Spotify son enlaces voluntarios; no hay embeds ni importaciones automáticas de actividad.

## Componentes y validación

- `WorkContent.astro`: ficha y lector compartidos entre producción y revisión.
- `AboutContent.astro`: biografía, método e intereses desde diccionario.
- `BookDownloads.astro`: descargas compartidas por las tres páginas del libro.
- `siteChapters`, `readingContent`, `readingChapters`: cuerpos renderizados por Astro y colecciones de revisión aisladas.
- `reading-preferences.mjs` y `reader.js`: valores permitidos y mejora opcional del lector.

```sh
nvm use
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

Las pruebas cubren configuración del catálogo y capítulos, selección/publicación independiente, equivalencias por idioma, preferencias inválidas y almacenamiento bloqueado, rutas de descarga seguras, notas, teclado, zoom, accesibilidad automatizada, ausencia de cargas remotas, funcionamiento sin JS y conservación de archivos. La revisión automatizada no certifica por sí sola conformidad WCAG completa.

Resultados locales:

- `astro check`: cero errores y cero advertencias; cuatro sugerencias heredadas.
- 58 pruebas de contenido/modelo aprobadas.
- 67 pruebas E2E aprobadas y una omisión prevista para un caso exclusivo de móvil.
- 48 comprobaciones de revisión aprobadas: 36 de regresión visual/idiomas y 12 específicas del lector. Tras corregir la separación HTML/Markdown de una nota, se repitieron las 12 del lector, incluyendo retorno de foco y texto ampliado en RTL a 320 px.
- Build normal: 48 páginas HTML, 24 exportaciones de proyectos y 84 archivos textuales revisados sin ejemplos ni marcadores internos.
- Build de revisión: 99 páginas HTML; al finalizar se reconstruyó producción y se comprobó de nuevo la exclusión de fixtures y la concordancia de exportaciones.
- Las seis descargas mantienen sus contenidos: las pruebas comparan los hashes del recurso servido con los archivos locales.

El aviso histórico de colección `blog` vacía al generar RSS pertenece al contenido heredado. No se añaden dependencias ni servicios.
