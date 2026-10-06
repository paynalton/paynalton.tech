# Paynalton

Sitio personal estático generado con Astro. Rediseño completo en español e inglés, rutas históricas en náhuatl y descargas de «Cuando la tostadora te responde».

## Entorno

- Node 24.21.0 (`.nvmrc`).
- npm 12.0.2 (`packageManager` y `engines`).
- Astro 7.3.4; salida en `dist/`.

Con NVM:

```sh
nvm install
nvm use
npm install -g npm@12.0.2
npm ci
```

La instalación global de npm se hace una vez para ese runtime. `.npmrc` rechaza instalaciones con versiones incompatibles; no modifica el runtime predeterminado de otros proyectos. Al abrir una terminal nueva, ejecutar `nvm use` en este directorio.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run dev` | Desarrollo local |
| `npm run check` | Comprobación Astro/TypeScript del código y tests propios |
| `npm run build` | HTML, formatos públicos, sitemap, RSS, reglas Netlify e índice Pagefind |
| `npm run preview` | Servir el build localmente |
| `npm run test:e2e` | Regresión en navegador sobre un build existente |
| `npm run verify` | Tipos, modelo, build, exclusión de fixtures, exportaciones y regresión en navegador |
| `npm run check:publication` | Formatos, SEO, enlaces, RSS, migración y recursos sociales |
| `npm run render:publication` | Regenerar imagen social e iconos con Chrome local |
| `npm audit` | Consultar avisos de dependencias; requiere acceso al registro |

Instalar el navegador de Playwright antes de las pruebas:

```sh
npx playwright install chromium
npm run verify
```

También se puede reutilizar un Chrome local:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

Playwright inicia y detiene su preview en `127.0.0.1:4321`. Usa `--ignore-lock` para mantener Astro en primer plano, incluso cuando lo inicia un agente. Ese puerto debe estar disponible; `E2E_PORT=4331` permite conservar un servidor de desarrollo en 4321. Las pruebas bloquean recursos externos en los recorridos principales; no verifican disponibilidad de servicios de terceros.

Se prueban rutas en los tres idiomas, navegación, menú móvil, selectores del libro, archivos descargables y sus hashes, RSS/sitemap, 404 y descarga inicial sin JavaScript. El menú móvil se omite intencionadamente en escritorio. Capturas, trazas y reporte quedan en `test-results/` y `playwright-report/`, ambos ignorados y fuera de `dist`.

## Alcance actual

El rediseño está disponible en español e inglés: 343 entidades públicas por idioma, incluidas 111 obras, y 670 documentos de búsqueda entre ambos idiomas. El build genera 696 HTML, 1.372 exportaciones, catálogo JSON, llms.txt, RSS de obras y un sitemap con 687 URLs canónicas. Se conservan el libro y sus descargas, las páginas históricas NAH y las anclas existentes; las rutas antiguas ES y las rutas inglesas reemplazadas tienen destinos de migración.

Inglés utiliza las mismas plantillas y escenas, con diccionarios y cuerpos propios. El selector cambia a la página equivalente mediante enlaces HTML. Babilonia se utiliza solo para preparar traducciones localmente: el build y el sitio publicado no dependen de ese servicio. [Proceso de traducción y revisión](ai_reference/traduccion-en/README.md). Los resultados históricos de los apartados siguientes describen cada etapa, no los recuentos actuales.

[Entrega PT11](ai_reference/implementacion/PT11/README.md). Dominio `paynalton.tech`, Netlify y DNS Cloudflare. `netlify.toml` configura la compilación; `dist/_headers` y `dist/_redirects` incluyen las reglas de alojamiento en el artefacto estático. No se ha desplegado ni modificado la configuración remota. PT12 tiene validación automatizada aprobada; queda la revisión humana antes de PT13. Las comprobaciones de publicación y fidelidad usan Python 3.11+ además del entorno Node indicado; no es una dependencia de ejecución del sitio.

Las cifras de los apartados siguientes son históricas. El plan está en `ai_reference/` y la continuidad local en `.ai_cache/`. Ninguna de esas carpetas se publica en `dist`.

## Revisar el sistema visual PT04

Entrega y capturas: [PT04](ai_reference/implementacion/PT04/README.md), [galería](ai_reference/implementacion/PT04/index.html).

```sh
npm run build:design
npm run preview:design -- --host 127.0.0.1 --port 4322 --ignore-lock
```

Abrir `http://127.0.0.1:4322/design-review/home/`. `npm run verify:design` ejecuta las pruebas de accesibilidad, estados y adaptación de estas muestras; acepta la misma variable de Chrome indicada arriba. No ejecutar a la vez que `verify`: ambas compilaciones usan el almacén de contenido de Astro. La revisión se genera en `.design-dist/`; producción sigue usando exclusivamente `dist/` y no incluye ejemplos ni rutas de revisión.


## Marco y navegación PT05

[Entrega PT05 y capturas](ai_reference/implementacion/PT05/README.md). El build normal contiene 32 páginas; `/` conduce a `/es/`, que usa el marco nuevo. Navegación móvil, búsqueda local básica en `/es/explorar/`, preferencias y 404 funcionan con alternativas HTML. El buscador completo se integra en PT09 y WebGL en PT10.

`npm run verify` comprueba 45 pruebas de contenido y 43 E2E (una omisión prevista). `npm run test:e2e -- tests/shell.spec.ts` ejecuta las 18 del marco. La revisión separada tiene ahora 33 pruebas, incluidos destinos sintéticos para comprobar equivalencias de idiomas. Se conservan las rutas históricas y las seis descargas; no se ha desplegado.


## Recorrido y exportaciones PT06

[Entrega y galería](ai_reference/implementacion/PT06/README.md). Inicio → Pipila → Integración de sistemas → Contacto ya tiene pruebas de teclado, móvil y funcionamiento sin JavaScript. Pipila ofrece `index.json` e `index.md` desde su propia URL, con los mismos hechos públicos del HTML.

`verify` incluye `check:exports`: 50 pruebas de contenido y 51 E2E aprobadas (una omisión prevista). `test:e2e -- tests/journey.spec.ts` repite las ocho específicas del recorrido. `verify:design` comprueba 36 pruebas, incluido un recorrido de diccionarios sintéticos compartiendo las plantillas reales y excluido de producción. Build normal: 32 HTML y dos exportaciones; build aislado: 62 HTML. Estos son los recuentos históricos de PT06; la sección siguiente recoge el estado vigente.


## Área profesional y contacto PT07

[Entrega y validación](ai_reference/implementacion/PT07/README.md) · [Galería](ai_reference/implementacion/PT07/index.html).

Doce proyectos (cuatro casos y ocho fichas), once etapas profesionales y seis capacidades con evidencia. Destacados configurables, contacto con copia y alternativas, compartir URL canónica e impresión de trayectoria. Textos basados en diccionarios. Se retiraron recursos remotos automáticos también de páginas históricas, conservando los recursos locales utilizados.

Estado vigente: 53 pruebas de contenido, 63 E2E aprobadas/una omisión prevista y 36 de revisión visual. Build normal: 48 HTML y 24 exportaciones; revisión: 78 HTML. Sin despliegue. Siguiente PT08: biblioteca, lector y Sobre mí. CV y obras completas mantienen la secuencia acordada.


## Biblioteca, lector y Sobre mí PT08

[Entrega y configuración](ai_reference/implementacion/PT08/README.md) · [Galería](ai_reference/implementacion/PT08/index.html).

Biblioteca y destacados configurables, fichas y capítulos desde el modelo, lector con índice/notas/preferencias opcionales, y perfil personal completo. El libro conserva su URL, páginas por idioma y seis descargas. Los ejemplos de lectura solo aparecen en el build de revisión: `/design-review/reading/es/obra/`. Incorporar originales completos sigue previsto en PT08-C.

Recuentos vigentes: 58 pruebas de contenido, 67 E2E aprobadas/una omisión prevista y 48 comprobaciones de revisión (36 generales y 12 del lector). Build normal: 48 HTML y 24 exportaciones; revisión: 99 HTML. Sin despliegue. Siguiente: PT09, búsqueda, filtros y temas.


## Búsqueda, filtros y temas PT09

[Entrega y validación](ai_reference/implementacion/PT09/README.md) · [Galería](ai_reference/implementacion/PT09/index.html).

Explorar busca en el texto completo de 26 documentos públicos con Pagefind 1.5.2 y permite filtrar por tipo y tema. Consulta y filtros se conservan en la URL. Diez temas con contenido relacionado; alternativa HTML sin JS y recuperación de fallos. Índice local generado después del HTML, separado por idioma; ejemplos y borradores excluidos. Para probarlo usar build + preview: `dev` no genera el índice.

`verify` incluye `check:search`, que descomprime y valida los fragmentos del índice. Validación: 62 pruebas de contenido, 79 E2E aprobadas/una omisión prevista y 51 de revisión visual/idiomas. Build normal: 52 HTML, 24 exportaciones y 26 documentos indexados. Recuentos de secciones anteriores históricos. Sin despliegue. Siguiente: PT10, escena, alternativas y efectos.


## Escena y efectos PT10

[Entrega y validación](ai_reference/implementacion/PT10/README.md) · [Galería](ai_reference/implementacion/PT10/index.html).

Inicio incorpora una escena WebGL con Three.js 0.186.1, materiales locales y alternativa estática generada desde el mismo modelo. Microinteracciones independientes, preferencias, movimiento reducido, carga diferida, pausa, liberación de recursos y recuperación ante fallos. El texto conserva su contraste durante las animaciones.

`npm run render:workshop` regenera maestros y WebP mediante Chrome local. `check:effects` comprueba pesos y presupuestos y forma parte de `verify`. `npm run verify:static` construye y prueba la variante sin la capa opcional, en `.effects-off-dist/`; para servirla usar `VITE_DISABLE_EFFECTS=1 npm run preview`. Los builds deben ejecutarse secuencialmente.

Validación local: 65 pruebas de contenido, 103 E2E aprobadas/una omisión prevista, 51 de revisión y 30 de la compilación sin efectos. La regresión completa final se ejecutó con `npm run test:e2e -- --workers=1` tras un cierre aislado de Chromium en paralelo. La entrega PT10 conserva las métricas y límites de las mediciones con SwiftShader. Sin despliegue. Según el plan, sigue el cierre editorial PT08-C antes de cerrar SEO y migración en PT11; CV en POST01. Recuentos anteriores históricos.

## Validación integral del candidato (PT12)

`E2E_PORT=4331 PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:candidate` reúne las suites, la auditoría de dependencias, la galería de idiomas, la variante sin efectos, Lighthouse y el manifiesto del artefacto. Requiere Python 3.11+, Chrome y acceso al registro npm; no publica. [Matriz de aceptación y revisión manual](ai_reference/implementacion/PT12/README.md).

La CSP se genera durante el build, con hashes de los scripts embebidos, y se distribuye en `dist/_headers`. Las pruebas de navegador simulan esas cabeceras para verificar compatibilidad; no acreditan todavía su aplicación en Netlify.

## Cierre de entrega

Entrega cerrada por solicitud del propietario el 5 de octubre de 2026. [Estado y validaciones finales](ai_reference/implementacion/Cierre_proyecto.md). El botón de trayectoria descarga el CV público en español o inglés desde `public/cv/`, según `src/data/site/downloads.json`.
