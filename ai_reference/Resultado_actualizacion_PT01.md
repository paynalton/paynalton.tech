# Actualización de runtime y dependencias — resultado parcial de PT01

Se aplicaron Node 24.21.0, npm 12.0.2, Astro 7.3.4, TypeScript 6.0.3, check 0.9.10, RSS 4.0.19, sitemap 3.7.4 y Sass embedded 1.105.0. Se añadió Playwright 1.63.0 para regresión. `.nvmrc`, engines y `.npmrc` fijan el entorno; el usuario debe ejecutar `nvm use` en una terminal nueva. No se cambió el alias global de Node para otros proyectos.

Se retiraron MDX, Vue, plugin Vue directo, `fs` y `localizationjs`, sin consumidores activos identificados. Se adaptó Zod y Sass. Se corrigieron defectos previos que detectan las nuevas herramientas: cierre `h3` sobrante, `!mportant` inválido, tipado DOM y atributos del iframe. El snippet existente de Analytics se dejó inline, coherente con su uso global; su retirada sigue pendiente del paquete correspondiente del rediseño.

Las pruebas detectaron que el botón inicial del libro apuntaba a `#` sin JavaScript. Ahora el HTML enlaza al PDF del idioma de la página; los selectores siguen funcionando con JavaScript.

## Verificación realizada

- Build anterior guardado en `/tmp/paynalton-baseline-dist` como referencia temporal.
- Node 24 ejecutó correctamente el build previo a instalar Astro 7.
- La primera instalación sobre node_modules existentes falló con una aserción nativa de Node/npm. Se conservó ese directorio en `/tmp/paynalton-node_modules-before-upgrade` y se repitió desde vacío con éxito. No se utilizaron `--force` ni `--legacy-peer-deps`.
- `npm ci --offline --cache /tmp/paynalton-npm-cache` terminó correctamente desde el lockfile generado. Comprobación de instalación limpia con caché precargada; no prueba un entorno remoto.
- `npm run verify`, con Chrome local y el runtime indicado: éxito. Check: 0 errores, 0 advertencias y 7 sugerencias. Build: 22 páginas. Navegador: 25 pruebas aprobadas y una omisión intencional (menú móvil en escritorio).
- Recorridos en Chrome de escritorio y emulación móvil: ES/EN/NAH, cambio de idioma preservando sección, selectores de edición/formato, menú, redirección inglesa, HTML del libro sin JavaScript, feed, sitemap, 404 y descargas.
- Comparación de los 22 HTML con el baseline: sin rutas añadidas/eliminadas ni diferencias de contenido textual ignorando espacios o metadatos revisados. Enlaces conservados salvo la corrección deliberada del botón inicial del libro. No es una comparación píxel a píxel.
- Los seis PDF/EPUB conservan SHA-256 respecto al build anterior; las pruebas también comparan los bytes recibidos por HTTP con los archivos fuente.
- Capturas de portada y libro generadas en escritorio/móvil; landing del libro inspeccionada visualmente en ambos tamaños. Recursos externos bloqueados en los recorridos principales.
- La auditoría inicial encontró `mdast-util-to-hast` vulnerable. Se actualizó a la versión compatible resuelta por npm. La auditoría durante la actualización terminó con 0 vulnerabilidades conocidas; no equivale a los controles SEG01–SEG09 completos.
- `git diff --check`: sin errores.

## Observaciones pendientes

El blog sigue vacío y produce avisos existentes. Persisten sugerencias de variables no utilizadas y advertencia de configuración global `always-auth`, ajena al repositorio; no se editó la configuración personal de npm. npm 12 bloqueó scripts de instalación de esbuild y parcel/watcher; el build y las pruebas funcionan con los binarios disponibles, sin aprobar scripts indiscriminadamente.

`npm ls` etiqueta algunos peers opcionales Sass/parcel como extraneous incluso después de `npm ci` y `npm prune`; `npm explain sass` los vincula al peer opcional de Vite. No hay peers inválidos entre las dependencias directas comprobadas. El comportamiento de instalación en otros sistemas debe verificarse allí.

Astro detecta ejecución por agente y puede iniciar preview en segundo plano. Se ajustó Playwright para usar `--ignore-lock` y gestionar el proceso en primer plano. Se detuvo el preview auxiliar iniciado durante el diagnóstico.

No se desplegó, no se cambió Netlify y no se crearon commits. No se ejecutaron Firefox/WebKit, dispositivos físicos, auditoría de accesibilidad completa, regresión visual de todo el sitio ni todas las suites futuras del plan. PT01 avanza con runtime, build, check y regresión; no se declara terminado todo el plan de pruebas ni el rediseño.
