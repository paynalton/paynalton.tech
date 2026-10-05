# PT09 — Búsqueda, filtros y temas

Implementación local de Explorar con Pagefind 1.5.2, fijado en dependencias de desarrollo. Búsqueda sobre el texto completo del HTML publicado, sin backend ni servicio de pago. Sin despliegue. Siguiente unidad: PT10, escena, alternativas y efectos.

## Revisar la entrega

La [galería](index.html) muestra búsqueda filtrada y temas en escritorio y móvil.

```sh
nvm use
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

Recorridos de referencia:

- `/es/explorar/?q=DBASE`: encuentra Onix por contenido de su cuerpo.
- `/es/explorar/?type=project&topic=memoria-y-contexto-de-agentes`: LORO y PERICO.
- `/es/explorar/?q=Francisco`: permite encontrar Sobre mí.
- `/es/explorar/?q=zzzxqvnonexistentword`: estado sin resultados.
- `/es/temas/`: diez temas con definición, contenido relacionado y acceso a la búsqueda filtrada.

El índice se genera automáticamente después del HTML, en cada build de Astro. Para probar búsqueda se utiliza el build y su preview: `npm run dev` no genera Pagefind y ofrece el listado HTML cuando el índice no está disponible. Editar un texto requiere reconstruir el sitio para actualizar el índice.

## Publicación e índice

| Contenido indexado | Documentos |
| --- | ---: |
| Proyectos: casos y fichas | 12 |
| Temas: seis capacidades y cuatro temas editoriales | 10 |
| Ficha del libro publicado | 1 |
| Trayectoria completa, Sobre mí y contacto | 3 |
| Total actual en español | 26 |

Las once etapas profesionales forman parte del texto de Trayectoria; no producen once resultados duplicados. El modelo incorpora automáticamente capítulos cuando existan obras y capítulos publicables. No se extrae texto de PDF/EPUB: se indexa su ficha HTML.

La misma lista de URLs permitidas alimenta metadatos, indexación y navegación alternativa. Quedan fuera los listados repetidos, portada, Explorar, exportaciones, páginas históricas, ejemplos, borradores y obras aplazadas. Menús, pie, preferencias, botones y controles de descarga no se incorporan al texto buscable. Las páginas y descargas históricas permanecen disponibles.

Pagefind separa los índices por el idioma del HTML. Producción solo incorpora el contenido nuevo en español; sus mensajes están en diccionarios. La revisión aislada prueba dos idiomas, con EN sintético, textos expandidos y RTL, sin publicar una traducción ni mezclarla con el índice normal.

## Experiencia y taxonomía

Consulta `q`, tipo `type` y tema `topic` quedan en la URL. Los filtros se combinan; se restauran al recargar o volver en el historial. Limpiar devuelve el catálogo completo y el foco al campo de búsqueda. Sin consulta se muestran resúmenes editoriales; con consulta, fragmentos del texto encontrado.

Carga, error y cero resultados tienen mensajes diferenciados. Un fallo conserva los enlaces HTML y permite reintentar recargando la página con su consulta y filtros. Sin JavaScript, el listado y los accesos a catálogos siguen disponibles. No se incorpora paginación W16: el volumen actual no la justifica.

Se completan los cuatro temas aprobados: resolución de problemas, memoria y contexto de agentes, creación editorial, inteligencia y humanidad. Las seis capacidades conservan su función profesional. Las relaciones distinguen evidencia de capacidad, desarrollo de un tema y asistencia de IA durante el desarrollo. Yayauhqui no se presenta como una herramienta con IA por haber sido construido con su ayuda.

## Implementación y protección

- `search-documents.mjs` centraliza los documentos y sus filtros; `build-search.mjs` usa la API de Pagefind después del build.
- `SearchContent.astro` conserva la alternativa HTML. `search.js` carga el motor al entrar a Explorar; abrir el panel del encabezado no descarga el índice.
- `search-state.mjs` limita la consulta, valida filtros y restringe las URLs al origen e idioma actuales. El cliente exige además que cada destino pertenezca a la lista publicada.
- Consultas y resultados se insertan como texto, sin convertirlos en HTML activo. Las respuestas antiguas no sustituyen una consulta más reciente.
- `check:search` descomprime los fragmentos reales del artefacto y comprueba URLs, idioma, títulos, filtros y exclusión de marcadores internos. El manifiesto auxiliar solo contiene metadatos públicos.
- Recursos de búsqueda alojados con el sitio, sin consultas a servicios externos ni analítica. Pagefind utiliza su API y WASM locales; no se carga su interfaz prefabricada.

La revisión detectó y corrigió un prefijo duplicado en las URLs del índice aislado: la base de los resultados se configura explícitamente porque el índice ya contiene las rutas completas.

## Validación

```sh
nvm use
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

Las pruebas cubren búsquedas en cuerpos, filtros combinados, URLs compartibles, historial, teclado, cero resultados, filtros inválidos, consultas hostiles, carga retrasada y recuperación tras un fallo. También comprueban navegación sin JS, aislamiento por idioma, ausencia de cargas remotas, zoom al 200 %, ancho de 320 px y accesibilidad automatizada. La automatización no certifica por sí sola conformidad WCAG completa.

Resultados locales finales:

- Astro check: cero errores y cero advertencias; cuatro sugerencias heredadas.
- 62 pruebas de contenido/modelo aprobadas.
- 79 pruebas E2E aprobadas y una omisión prevista para un caso exclusivo de móvil.
- 51 pruebas de revisión visual e idiomas aprobadas en escritorio, móvil y 320 px.
- Build normal: 52 HTML y 24 exportaciones de proyectos; 97 archivos textuales revisados y 26 fragmentos del índice descomprimidos y validados.
- Build de revisión: 103 HTML; índice sintético de ocho documentos (cinco ES y tres EN) separado del índice normal. Tras la revisión se reconstruyó producción y se validó la exclusión de ejemplos.
- Navegación histórica y seis descargas preservadas, comprobadas mediante las pruebas existentes de rutas y hashes.
- `git diff --check` sin errores de espacios. La instalación de Pagefind informó cero vulnerabilidades entre las 312 dependencias auditadas.

La auditoría de dependencias describe ese resultado, no una garantía de seguridad absoluta. Continúa el aviso histórico de colección `blog` vacía al generar RSS. No se publicó el sitio ni se crearon commits.

Fuentes de integración: [API Node de Pagefind](https://pagefind.app/docs/node-api/), [API del navegador](https://pagefind.app/docs/api/), [filtros](https://pagefind.app/docs/filtering/) e [índices por idioma](https://pagefind.app/docs/multilingual/).
