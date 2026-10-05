# Verificación de la base antes de PT03

Comprobación local realizada al iniciar el plan consolidado. No acredita despliegue ni las suites futuras de accesibilidad y seguridad.

## Entorno y ejecución

Se activó `.nvmrc` mediante `nvm use`: Node 24.21.0 y npm 12.0.2. Astro 7.3.4 según el manifiesto del proyecto.

`npm run verify` ejecutó correctamente check y build. La fase de navegador no pudo iniciar su servidor dentro del aislamiento; se ejecutó después `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run test:e2e` fuera del aislamiento autorizado, sobre el mismo build.

| Comprobación | Resultado |
| --- | --- |
| Astro check | 0 errores, 0 advertencias y 7 sugerencias. |
| Build | Salida static; 22 páginas, RSS y sitemap generados. |
| Playwright | 25 pruebas aprobadas y una omitida intencionalmente: menú móvil en el proyecto de escritorio. |
| Descargas | Seis PDF/EPUB del libro: bytes fuente y build coinciden; SHA-256 registrado en la matriz. |
| Inventario de migración | 31 entradas únicas: 22 páginas, RSS, dos archivos de sitemap y seis descargas. |

Persisten avisos conocidos de colección blog vacía, configuración personal npm `always-auth` y sugerencias de variables/atributos del legado. No impidieron la comprobación. No se modificó configuración personal ni se reinstalaron dependencias.

## Alcance

La regresión existente comprueba páginas/recursos locales, navegación de idiomas del legado, ediciones y formatos del libro, menú móvil, raíz según idioma del navegador, HTML esencial sin JavaScript, feeds, descargas y rutas ausentes. No se ejecutaron Firefox/WebKit, dispositivos físicos, auditoría de dependencias actualizada, pentest ni evaluación WCAG completa.

Las expectativas sobre la raíz y el selector se adaptarán cuando se implemente el nuevo contrato español, conservando pruebas del legado que permanezca. Los reportes y trazas están fuera de `public`.

Se preservaron los cambios previos del repositorio. Este paso añadió documentación y matriz operativa; no cambió fuentes del sitio, dependencias, rutas productivas ni archivos de descarga.

## Siguiente unidad

PT03: implementar los esquemas y la selección publicable con Pipila, una etapa profesional, un término y una obra de ejemplo identificada. Usar el [contrato de publicación y migración](Contrato_base_publicacion_y_migracion.md) y la [matriz de rutas](Matriz_migracion_PT02.json). No se requiere una nueva recopilación del propietario para esta unidad.
