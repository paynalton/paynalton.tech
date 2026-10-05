# Validación y correcciones de PT03

Resultado: revisión local completada, tres fallos reproducidos y corregidos, validación integrada aprobada. No se inició PT04 ni se desplegaron cambios.

## Hallazgos corregidos

| Hallazgo | Reproducción / impacto | Corrección y regresión |
| --- | --- | --- |
| La colección no recargaba al editar contenido | `defaultRoot` conservaba una barra final y el filtro del watcher añadía otra. Una ruta normal nunca coincidía con ese prefijo, por lo que la colección podía quedar desactualizada en desarrollo. | Normalizar la ruta raíz y devolver la promesa de recarga. Prueba del evento `change`: confirma una segunda publicación de la colección y descarta eventos de una carpeta vecina. |
| Comparación incorrecta de fechas de distinta precisión | Inicio `2025-03` y fin `2025` se rechazaban como periodo invertido pese a ser compatibles. | Comparar límites de los intervalos representados, conservando la precisión original. La regresión acepta el caso compatible y sigue rechazando fin `2025-02`. |
| El formato regional alteraba las reglas gramaticales | Un catálogo inglés con formato de números francés requería categorías plurales francesas; podía usar singular para cero. | Separar formato regional y pluralización: `formatTag` solo para números/fechas; gramática desde `tag` o `pluralTag` explícito. Pruebas con inglés/francés, fallback español e idioma sin soporte nativo. |

Las tres pruebas principales fallaron antes de las correcciones. Se añadieron además dos comprobaciones para impedir fallback gramatical silencioso. La suite pasó de 31 a 36 pruebas.

Los idiomas registrados pero no habilitados siguen sin publicarse. Si el runtime no soporta las reglas plurales de un idioma, habilitarlo exige resolver esa regla explícitamente: no se deduce del formato regional. `pluralTag` solo sirve cuando existe una equivalencia lingüística revisada; una regla sin equivalencia necesitará una implementación específica antes de publicar mensajes plurales. Las traducciones reales siguen fuera de esta etapa.

## Controles ejecutados sobre la versión corregida

Entorno: Node 24.21.0, npm 12.0.2, Astro 7.3.4 y Chrome local. `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify` finalizó con código 0. Se ejecutó fuera del aislamiento autorizado por las necesidades del servidor de pruebas y navegador.

| Control | Resultado |
| --- | --- |
| Esquemas, publicación, diccionarios y regresiones | 36 pruebas aprobadas, ninguna fallida. |
| Tipos Astro | 0 errores, 0 advertencias y 7 sugerencias heredadas. |
| Fuente pública | Tres entradas españolas elegibles; ejemplo de lectura excluido de `siteContent`. |
| Build | 22 páginas estáticas, con las mismas rutas HTML inventariadas en PT02. |
| Inspección del artefacto | 33 archivos textuales sin los marcadores conocidos de pruebas/notas internas comprobados por el script. |
| Navegador | 25 pruebas aprobadas y una omisión prevista para menú móvil en el proyecto de escritorio. |
| Descargas | SHA-256 de seis PDF/EPUB sin cambios tanto en fuente como en build respecto a la base PT02. |
| Formato del diff | `git diff --check` sin errores. |

La revisión incluyó la exclusión de borradores y ejemplos, relaciones hacia entradas no publicadas, duplicados, periodos y rutas, capítulos, traducciones ausentes, claves/parámetros, selección configurable, referencias a archivos y límites del directorio de cuerpos. Los cambios previos ajenos a PT03 se conservaron.

## Límites y siguiente paso

Esta validación cubre la capa de datos/traducción de PT03 y la regresión del sitio existente. La recarga se prueba a través del contrato del watcher del loader; no es una sesión manual de edición en el navegador. La prueba de artefacto es un control de marcadores conocidos, no una auditoría exhaustiva de secretos o de seguridad.

Los componentes nuevos, selector visual, rutas del rediseño, búsqueda, exportaciones y traducciones reales todavía no están conectados. Tampoco se afirma conformidad WCAG completa ni validación remota de productivo. Persisten los avisos conocidos de blog vacío y configuración personal npm `always-auth`.

PT03 queda listo para continuar con PT04. Véase la [guía actualizada del modelo](Modelo_contenido_y_diccionarios_PT03.md).
