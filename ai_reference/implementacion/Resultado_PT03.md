# Resultado de PT03

**Revisión posterior:** se corrigieron tres fallos adicionales y la suite creció a 36 pruebas. La evidencia vigente está en [Validación de PT03](Validacion_PT03.md); los resultados de 31 pruebas que siguen corresponden a la entrega inicial.

Estado: implementado y validado localmente; listo para revisión del desarrollador. No desplegado. La guía de uso está en [Modelo de contenido y diccionarios](Modelo_contenido_y_diccionarios_PT03.md).

## Entrega

- Esquemas estrictos de perfil, canal, proyecto, experiencia, obra y término.
- Registro de idiomas y diccionario español semántico; traducciones, parámetros, plurales y formatos separados del contenido compartido.
- Variantes editoriales con ID conceptual estable, idioma y slug independientes; cuerpos Markdown locales referenciados.
- Selección, orden y destacados configurables; política única de publicación, exclusión de borradores/obras aplazadas/ejemplos y filtrado de relaciones.
- Muestra: Pipila, SoDigital, Integración de sistemas y obra de ejemplo con dos capítulos/notas. La colección pública recibe tres entradas; el ejemplo solo existe en la consulta explícita de preview.
- Colección Astro `siteContent` con validación durante sincronización/build; sin migrar todavía páginas existentes.
- Comandos `check:content`, `test:content`, `check:content-artifact` e integración con `verify`. Sin dependencias nuevas.

## Evidencia de validación

Entorno: Node 24.21.0, npm 12.0.2 y Astro 7.3.4. La validación final integrada se ejecutó con `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify`; código de salida 0. El navegador y su servidor local se ejecutaron fuera del aislamiento autorizado, como requería el entorno.

| Control | Resultado |
| --- | --- |
| Modelo y diccionarios | 31 pruebas aprobadas; traducción sintética, selección, exclusión, referencias, rutas, fechas, capítulos, interpolación, plurales, fallback, symlink y URLs de canal. |
| Astro check | 0 errores, 0 advertencias y 7 sugerencias heredadas. |
| Build | 22 páginas; salida estática. Sin nuevas rutas de presentación. |
| Artefacto | 33 archivos textuales inspeccionados, sin marcadores conocidos de pruebas ni notas internas de PT03. |
| Navegador | 25 aprobadas; una omisión intencional del menú móvil en el proyecto de escritorio. |
| Descargas | Seis PDF/EPUB conservan SHA-256 de la matriz PT02 en el build final. |
| Diff | `git diff --check` sin errores. |

El runner Node puede resumir la ejecución por archivo; la ejecución directa `node tests/content/model.test.mjs` muestra las 31 pruebas individuales. Las pruebas sintéticas no se guardan en el directorio público.

Persisten los avisos heredados de colección blog vacía y configuración personal npm `always-auth`. No se ha ejecutado una auditoría completa de accesibilidad o de seguridad, ni se ha validado productivo. La revisión de marcadores no constituye un escáner general de secretos.

## Decisiones de integración

El nuevo sistema convive con `src/locales` y el traductor anterior hasta migrar sus consumidores. La capacidad multilingüe está en la capa de datos y lógica; su conexión a las plantillas, selector, SEO y búsqueda se cierra en los paquetes siguientes. No se presenta una traducción sintética como idioma publicado.

Los datos están preparados para consultas en build y renderizado estático. Los mensajes del traductor son texto y deben insertarse como texto, nunca como HTML arbitrario. Los cuerpos Markdown son contenido local revisado. La obra de ejemplo no se atribuye al autor.

## Siguiente paso

PT04: trasladar la paleta corregida, tipografía, primitivas y recursos base a componentes del sitio que consuman los diccionarios. Revisar con el desarrollador el modelo y sus muestras antes de integrar el siguiente frente de implementación.
