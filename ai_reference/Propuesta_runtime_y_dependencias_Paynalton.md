# Propuesta de runtime y dependencias — PT01

Consulta realizada el 22 de septiembre de 2026 sobre `master`, commit `ad94491`. Estado: propuesta documentada; no aplicada. Versiones obtenidas del registro npm y documentación oficial, no inferidas de la caché.

## Recomendación

Adoptar **Node 24.21.0 LTS**, **Astro 7.3.4**, **npm 12.0.2** y **TypeScript 6.0.3**, con instalación limpia y validación antes de declarar aprobada la combinación. Mantener Astro estático y npm con un único lockfile.

Node 24.21.0 es una publicación LTS confirmada. Node 20 figura EOL y Node 26 todavía Current; Node 22 sigue siendo una alternativa LTS, pero se propone 24 como base del nuevo trabajo. [Versiones de Node](https://nodejs.org/en/about/previous-releases), [publicación 24.21.0](https://nodejs.org/en/blog/release/v24.21.0).

La elección de npm 12.0.2 es una propuesta explícita y separada: no se afirma que sea la versión incluida en la distribución de Node 24.21.0. Su requisito publicado, `^22.22.2 || ^24.15.0 || >=26.0.0`, admite el Node propuesto. Astro exige npm >=9.6.5. Se fijará la versión realmente utilizada en instalación y CI. [Metadatos npm](https://registry.npmjs.org/npm/12.0.2).

## Compatibilidad comprobada por contratos publicados

| Combinación | Requisito | Resultado |
| --- | --- | --- |
| Node 24.21.0 + Astro 5.7.0 actual | Astro instalado declara `^18.17.1 || ^20.3.0 || >=22.0.0` | Admitida por engines; permite probar primero el cambio de runtime |
| Node 24.21.0 + Astro 7.3.4 | Astro publicado declara Node `>=22.12.0` | Admitida por engines |
| Astro 7.3.4 + integraciones MDX/Vue actuales | MDX 4.2.4 y Vue integration 5.0.10 exigen Astro `^5.0.0` | Incompatible por peers; retirarlas o actualizar coordinadamente |
| Astro 7.3.4 + plugin Vue directo actual | Astro incorpora Vite `^8.0.13`; plugin Vue 5.2.3 admite Vite 5/6 | No conservar el plugin actual en la combinación nueva |
| TypeScript 6.0.3 + check 0.9.10 | Check admite TypeScript `^5.0.0 || ^6.0.0` | Admitida por peers |
| TypeScript 7.0.2 + check 0.9.10 | La versión latest de TypeScript queda fuera de ese rango | No proponer instalación indiscriminada de latest |

Fuente de los contratos actuales: `package-lock.json` y manifiestos instalados; fuente de objetivos: `npm view <paquete> version engines peerDependencies --json` y consultas fijadas por versión. [Astro 7.3.4](https://registry.npmjs.org/astro/7.3.4), [check 0.9.10](https://registry.npmjs.org/@astrojs/check/0.9.10).

Estos resultados prueban compatibilidad declarada, no compatibilidad integral del árbol transitivo ni funcionamiento del sitio. No se instaló Node nuevo ni se ejecutó build con Astro 7 durante esta recopilación.

## Actualizar, añadir o retirar

| Elemento | Actual declarado/resuelto | Propuesta | Motivo |
| --- | --- | --- | --- |
| Node | 20.18.2 instalado, sin archivo de versión | 24.21.0 | Base LTS mantenida |
| npm | 10.8.2 instalado | 12.0.2 | Versión compatible y fijada para el nuevo flujo |
| Astro | `^5.7.0` / 5.7.0 | 7.3.4 | Base publicada actual para el rediseño |
| RSS | `^4.0.11` / 4.0.11 | 4.0.19 | Conservar y actualizar el feed |
| Sitemap | `^3.3.0` / 3.3.0 | 3.7.4 | Mantener generación estática |
| Sass embedded | `^1.86.3` / 1.86.3 | 1.105.0 mientras exista SCSS | Engines >=20.19.0, compatible con Node propuesto |
| TypeScript | 5.8.3 transitivo, sin declaración directa | 6.0.3 como devDependency | Fijar herramienta compatible con check |
| Astro check | Ausente | 0.9.10 como devDependency | Añadir comprobación de tipos independiente del build |
| `fs` | 0.0.1-security | Retirar | El código usa `node:fs/promises`, módulo incorporado de Node |
| `localizationjs` | 2.0.20 | Retirar | No se encontraron imports; se usa Translator propio |
| `@vitejs/plugin-vue` | 5.2.3 | Retirar | No se usa directamente en configuración; además su peer de Vite no corresponde al objetivo |
| `@astrojs/vue` y `vue` | 5.0.10 / 3.5.13 | Retirar del núcleo propuesto | Sin componentes `.vue` ni consumidores identificados; el plan utiliza Astro y módulos de navegador |
| `@astrojs/mdx` | 4.2.4 | Retirar hasta necesitar MDX | Sin archivos MDX actuales; Markdown convencional cubre la base editorial |

RSS, sitemap y Sass objetivo se consultaron individualmente en npm. La retirada de MDX/Vue requiere también eliminar sus imports e integraciones de `astro.config.mjs` y comprobar el resultado; no basta con borrar dependencias.

Si aparece una necesidad concreta de Vue, las versiones consultadas son `@astrojs/vue` 7.0.3 y Vue 3.5.43; la integración declara Astro `^7.0.0` y Vue `^3.5.24`. Si se decide mantener MDX, la versión 8.0.2 exige Astro `^7.2.10` y `@astrojs/markdown-satteri ^0.4.0`; `@astrojs/markdown-remark ^7.3.0` figura como peer opcional. Ese conjunto necesita resolución y validación conjunta. [Vue integration](https://registry.npmjs.org/@astrojs/vue/7.0.3), [MDX](https://registry.npmjs.org/@astrojs/mdx/8.0.2).

No añadir Vite o Zod como dependencias directas únicamente para forzar versiones. Astro 7.3.4 declara Vite `^8.0.13` y Zod `^4.5.4`; dejar resolver el árbol coordinado y fijarlo mediante lockfile.

## Adaptaciones de código y configuración

- Revisar las migraciones 5→6 y 6→7, con puntos de validación separados aunque el destino sea 7.3.4. El paso por 6 no se propone como plataforma final.
- En `src/content.config.ts`, separar `defineCollection` de la importación de `z` y usar `astro/zod`. Revisar semántica de esquemas con Zod 4. El proyecto ya usa `glob` de Content Layer; no se observó una colección legacy que requiera rediseño solo por la actualización. [Migración a Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/).
- Revisar salida HTML y espacios entre elementos, compilador y procesamiento Markdown al pasar a Astro 7. La guía documenta cambios de compilador, Markdown y tratamiento de whitespace; comprobar páginas en los tres idiomas y futuras muestras editoriales. No se encontraron `@astrojs/db`, `src/fetch.ts` o usos de internals de transiciones en la revisión. [Migración a Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/).
- Sustituir el `@import 'colors.scss'` de `src/styles/global.scss` por el sistema de módulos Sass, adaptando el acceso a variables. No retirar SCSS hasta migrar sus consumidores.
- Al añadir `astro check`, revisar scripts DOM y tipado: aparecen `navigator.userLanguage`, acceso a `this.value` y `window.dataLayer`. Son puntos de inspección, no errores de check ya reproducidos. La analítica se retirará conforme al alcance aceptado.
- Resolver el aviso de colección blog ausente con su tratamiento editorial/RSS, sin crear publicaciones ficticias para ocultar el aviso.
- Crear `.nvmrc` con `24.21.0`, declarar la familia admitida en `engines.node` y registrar npm exacto. Añadir comprobación efectiva de versiones; `engines` por sí solo puede limitarse a advertir.
- Alinear desarrollo, CI y build de alojamiento. Netlify documenta configuración de Node mediante archivos y variables; revisar posibles overrides antes de asumir que `.nvmrc` rige el entorno remoto. No añadir adaptador SSR. [Dependencias de build en Netlify](https://docs.netlify.com/build/configure-builds/manage-dependencies/).

## Herramientas nuevas del plan

Estas incorporaciones son distintas de actualizar el sitio existente. Se añaden cuando haya suite o funcionalidad que las utilice.

| Paquete | Versión publicada consultada | Incorporación |
| --- | --- | --- |
| `@playwright/test` | 1.63.0; Node >=20 | Automatización de navegador en PT01/PT06; instalar navegadores y verificar requisitos del sistema |
| `@axe-core/playwright` | 4.13.0; peer playwright-core >=1.0.0 | Accesibilidad en estados representativos |
| `pagefind` | 1.5.2 | Índice estático post-build en PT09 |
| `three` | 0.186.0 | Prototipo/escena PT04/PT10; revisar tipados y capacidades al integrarlo |

Auditoría de dependencias, escaneo de secretos y controles SEG01–SEG09 siguen dentro del trabajo. No se ha ejecutado aún una auditoría de vulnerabilidades ni se afirma que una versión sea segura por ser latest. Las herramientas se ejecutarán localmente o en CI compatible sin servicios de pago.

## Orden de aplicación propuesto

1. Registrar baseline y preparar un entorno aislado para instalación, conservando el checkout y los cambios existentes.
2. Instalar/fijar Node 24.21.0 y npm elegido; ejecutar instalación desde el lockfile actual y build para aislar el efecto del runtime.
3. Retirar paquetes sin consumidores y actualizar Astro e integraciones conservadas. Revisar las dos guías de migración y regenerar el lockfile con npm fijado.
4. Incorporar TypeScript/check y adaptar imports, Sass y scripts afectados; resolver peers sin `--force` ni `--legacy-peer-deps` como atajos.
5. Repetir instalación limpia desde el nuevo lockfile; ejecutar tipos, build, auditoría y recorridos esenciales, conservando las 22 rutas y seis descargas como baseline.
6. Revisar salida visual, metadatos, RSS/sitemap y navegación de idiomas; documentar resultados antes de actualizar configuración de publicación.

Cierre de esta propuesta: inventario y compatibilidad declarada recopilados. Cierre futuro de PT01: instalación y build realmente ejecutados con la combinación final, controles incorporados y resultados registrados. No confundir ambos estados.
