# PT12 — Verificación del candidato

Estado: **validación automatizada aprobada; revisión humana pendiente**. Este documento distingue las comprobaciones locales automatizadas de la aceptación manual y la verificación del alojamiento. No se ha publicado ni realizado push a `master`.

## Alcance y correcciones

- CSP generada después del HTML, con hashes SHA-256 de los scripts ejecutables embebidos. Mantiene scripts y conexiones del mismo origen; permite WebAssembly para Pagefind, estilos embebidos y fuentes `data:` del legado. Bloquea scripts inyectados, atributos de eventos, objetos, marcos y envío de formularios a otros orígenes; permite el GET local de búsqueda. No incorpora funciones ni servicios externos. La restricción de estilos es menos estricta que la de scripts por los estilos de código y presentación existentes.
- Protección contra inclusión en marcos y permisos de cámara, micrófono y ubicación deshabilitados. Las reglas viajan en `dist/_headers`; `public/_headers` es la base, no la salida completa. Una comprobación recalcula la salida esperada.
- Se encontró incompatibilidad de la CSP inicial con fuentes embebidas de páginas históricas; se ajustó `font-src` conservando el bloqueo de orígenes externos.
- Se detectó movimiento del contenido al activar el menú móvil. Su pequeño inicializador se ejecuta al terminar el encabezado, antes de esperar al módulo general. Sin JavaScript sigue visible la navegación HTML.
- Se precargan las dos fuentes latinas críticas del marco para reducir cambios de geometría al sustituir la tipografía de respaldo.
- La escena empezaba a cargar cuando apenas se aproximaba al viewport móvil. Ahora espera que al menos el 25 % del contenedor sea visible. No se cambian velocidades ni intensidad de las animaciones.
- Ocho capturas de referencia (inicio, proyecto, catálogo y lectura, escritorio/móvil) con fuentes listas y movimiento reducido; inspeccionadas por el agente y comparadas automáticamente. Son una base inicial, no evidencia de comparación contra una versión anterior ni aprobación estética del propietario.
- Presupuestos automatizados de HTML/CSS/JS inicial (200 KB gzip, sin imágenes/fuentes), recursos móviles y escena diferida (1,5 MB). Lighthouse queda fijado como dependencia de desarrollo; sus mediciones son diagnósticos locales, no datos de visitantes reales.
- Escaneo del artefacto ampliado a CSS, SVG y reglas HTTP. Reportes, materiales, fixtures y configuración privada quedan fuera de `dist`.

Las primeras pruebas nuevas detectaron además dos supuestos incorrectos del propio test: una pantalla móvil alta puede mostrar más del 25 % de la escena, y el formulario nativo conserva parámetros vacíos `type`/`topic`. Se fijó un viewport donde la escena está fuera de vista y se comprueba el parámetro `q` sin prohibir los otros campos. No se silenciaron fallos ni se añadieron reintentos.

## Matriz de aceptación

| Requisitos | Evidencia local | Límite / revisión restante |
| --- | --- | --- |
| RF01, RF03, RF11, RF12, RF17 | `shell`, `journey`, `professional`: navegación, teclado, contacto, compartir y fallos de permisos | Revisión visual/editorial del propietario |
| RF02 | Modelo y galería: equivalencias, ausencia de traducción, diccionario expandido, RTL, parámetros y plurales | Solo español del modelo nuevo se publica; páginas históricas conservadas |
| RF04, RF23, RNF02, RNF07 | `effects`, `shell`, `search`, `reading`: sin JS, WebGL ausente/perdido, preferencias, almacenamiento, portapapeles e índice fallidos; variante sin efectos | Afinado visual acordado antes de publicar |
| RF05–RF07, RF09–RF10, RF14–RF16 | Modelo, recorridos, catálogo, lectores, relaciones, impresión y temas | Fidelidad factual/editorial corresponde a revisión humana |
| RF08 | Se conserva el tratamiento vigente de CV; no se inventa un archivo nuevo | Nuevo CV aplazado expresamente a POST01 |
| RF13 | Índice y búsqueda de cuerpo/títulos, filtros, historial, reintento y consultas hostiles | No se usa búsqueda remota |
| RF18–RF22, RNF06 | `check:publication`, `check:exports`, `check:search`, importación: canonicals, sitemap, RSS, JSON-LD, autoría, exclusiones y formatos | HTTP 301/404 y cabeceras efectivas de Netlify: PT13/PT14 |
| RF24, RNF08 | Build y manifiesto SHA-256 del artefacto con runtime/configuración | Pipeline remoto y ensayo de recuperación: PT13; publicación: PT14 |
| RNF01, RNF04 | axe, teclado/foco, zoom/texto 200 %, 320 px, movimiento reducido, capturas y diagnósticos Lighthouse | Recorrido con lector de pantalla real y aceptación manual pendientes; no se declara conformidad WCAG global |
| RNF03 | Presupuestos gzip y Lighthouse móvil en cuatro páginas | Compresión, caché y rendimiento del alojamiento aún sin medir |
| RNF05 | Política de publicación, escaneo de artefacto, exclusión de directorios privados | No equivale a auditoría exhaustiva de todos los metadatos binarios históricos |
| A01–A07 | Recorridos profesionales/editoriales, idiomas sintéticos, búsqueda, degradación, accesibilidad y formatos cubiertos por suites | Validación humana y CV según decisiones anteriores |
| A08 | Preparación de artefacto y configuración | Publicación y recuperación reservadas a PT13/PT14 |

## Seguridad

| Control | Evidencia |
| --- | --- |
| SEG01 | `test:security` consulta npm audit, conserva fecha, fuente y avisos; falla si no obtiene respuesta válida o hay vulnerabilidades conocidas |
| SEG02/05 | Escaneo ampliado, rutas privadas excluidas, fuentes editoriales y proyección pública verificadas; fixtures hostiles y borradores no publicables |
| SEG03/04 | Pruebas de saneamiento y URLs, consulta hostil en navegador y bloqueo de script inyectado bajo CSP |
| SEG06 | Navegación de todas las páginas publicadas con interceptación de solicitudes externas; presupuesto sin servicios adicionales |
| SEG07 | CSP aplicada mediante cabeceras de respuesta simuladas en Playwright, recorrido de todas las páginas y Pagefind; pruebas de WebGL bajo CSP. No se presenta como una prueba de Netlify |
| SEG08 | Reportes fuera de `dist`; pruebas locales sin credenciales de publicación. No hay `.github/` disponible: permisos reales del pipeline pendientes de PT13 |
| SEG09 | No aplica a E1; WebMCP pertenece a E2 |

## Reproducción

```sh
nvm use
npm ci
E2E_PORT=4331 PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:candidate
```

Requiere Python 3.11+, Chrome disponible y acceso a npm para la auditoría. El comando agrupa verificación principal, seguridad, galería/diccionarios, variante sin efectos, Lighthouse y registro final del candidato. Usa los puertos locales 4331, 4322 y 4333; no reutiliza servidores ajenos ni despliega. El comando falla ante una prueba obligatoria fallida. Lighthouse conserva puntuaciones diagnósticas; los presupuestos de transferencia sí son umbrales obligatorios.

`test:visual` compara capturas existentes; no las actualiza automáticamente. Revisar las diferencias antes de usar `--update-snapshots`. El entorno base es Chrome en Linux, con escritorio y emulación Pixel 7; la galería añade 390/320 px. WebGL se prueba con SwiftShader. No se han probado Safari, Firefox ni dispositivos físicos en esta ejecución; diferencias de motor/plataforma requieren revisar una base propia.

## Revisión humana concreta

1. Recorrer Inicio → Pipila → Trayectoria → Contacto y comprobar claridad del mensaje y aportaciones.
2. Abrir una obra desde su categoría, leerla, cambiar preferencias y seguir un tema relacionado.
3. Revisar móvil y escritorio; verificar comodidad de lectura y jerarquía visual.
4. Recorrer menú, búsqueda y lector con un lector de pantalla real. Las aserciones de nombres y foco no sustituyen esta prueba.
5. Ajustar intensidad/velocidad de los efectos antes de publicar, según lo ya acordado.

## Referencias técnicas

- [Cabeceras de Netlify](https://docs.netlify.com/manage/routing/headers/).
- [CSP en Netlify](https://docs.netlify.com/manage/security/content-security-policy/).
- [MDN: scripts, hashes y WebAssembly en CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src).
- [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse/blob/main/readme.md).

## Resultados de rendimiento y revisión de recursos

La primera medición señaló dos defectos de inicialización: Inicio obtuvo 71/100 con 1.980 ms de bloqueo; Pipila presentó CLS 0,203 y el lector 0,164. Se conservan las métricas anteriores en `performance/lighthouse-before.json`. Tras ajustar la activación del menú, la precarga de fuentes y el umbral de visibilidad de la escena, la medición de comprobación obtuvo 99/100 y CLS 0 en las cuatro páginas. Las cifras definitivas del comando integral se conservan en `performance/lighthouse-summary.json`, junto con versión, perfil móvil, throttling y entorno de ejecución.

Los recursos iniciales HTML/CSS/JS medidos suman aproximadamente 14–20 KB gzip por página en el perfil sin movimiento; fuentes e imágenes se contabilizan aparte. La escena procedural completa distribuye aproximadamente 150 KB gzip de módulos y genera sus geometrías/texturas localmente; no descarga modelos ni texturas de terceros. La imagen móvil mayor pesa 49.022 bytes. Los límites son controles de transferencia y no garantizan fluidez en todos los dispositivos.

Se revisaron las ocho capturas base del viewport: tipografía, contraste visual, jerarquía, ajuste de tarjetas, navegación y lectura. Las fuentes son locales y las imágenes de escena son renders generados del modelo; el favicon conserva la identidad existente y el libro conserva su cubierta/descargas. No se añaden imágenes de blogs ni ejemplos publicables. La aprobación visual definitiva y el afinado de efectos siguen siendo tareas de revisión.

En PT13 se comprobará también que las optimizaciones del alojamiento, si existen, no reescriban el contenido de los scripts cubiertos por hashes CSP. Cloudflare está confirmado como DNS; no se presupone que actúe como proxy.

## Resultado consolidado

`verify:candidate` terminó con código 0 después de una instalación limpia desde el lockfile.

- Tipos: 0 errores, 0 advertencias y 3 sugerencias heredadas.
- 73 pruebas de modelo/contenido y 3 de importación aprobadas.
- 130 pruebas de navegador aprobadas, 2 omisiones previstas por perfil; 51 de galería/diccionarios y 30 de variante sin efectos aprobadas.
- 8 comparaciones de capturas aprobadas; 337 páginas e índice equivalentes sin efectos.
- 509 archivos fuente y 1029 archivos textuales del artefacto escaneados; sin los patrones de credenciales comprobados. Auditoría npm: 0 vulnerabilidades conocidas.
- 337 HTML, 638 exportaciones, 330 URLs canónicas, 111 entradas RSS y 311 documentos Pagefind verificados.

| Página | Rendimiento | Accesibilidad automática | Buenas prácticas | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| /es/ | 99 | 100 | 100 | 100 | 0 |
| /es/proyectos/pipila/ | 99 | 100 | 100 | 100 | 0 |
| /es/obra/ | 99 | 100 | 100 | 100 | 0 |
| /es/obra/el-estupor-mexicano/ | 99 | 100 | 100 | 100 | 0 |

Candidato: `0710076011618451d69f7c294d6a72fac5d3c80167fcaa4db18c48e9b38ff963`, 1467 archivos. El manifiesto registra SHA-256 por archivo, runtime, configuración y HEAD de referencia; el árbol de trabajo conserva cambios sin commit. Evidencia: [validación](validacion.json), [log integral](verificacion.log), [manifiesto](candidato.json) y [auditoría](audit.json). No hay aprobación de publicación, push ni despliegue.
