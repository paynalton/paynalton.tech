# PT04 — Sistema visual implementado

**Continuidad:** esta entrega describe la validación original de PT04. [PT05](../PT05/README.md) integra el marco en rutas reales, eleva el build normal a 32 páginas y añade dos fixtures de idiomas a la revisión (43 páginas y 33 pruebas). Los recuentos y el siguiente paso indicados abajo son históricos.


Estado: implementación y validación local terminadas; disponible para revisión visual del desarrollador. Sin despliegue. El siguiente frente es PT05, marco compartido y navegación.

## Revisar la entrega

Abrir la [galería de capturas](index.html). Contiene portada, caso Pipila, lectura y componentes en escritorio y móvil. Son capturas del HTML generado con los componentes nuevos, no los estudios anteriores.

Para revisar los controles y variantes en navegador, desde la raíz del proyecto:

```sh
nvm use
npm run build:design
npm run preview:design -- --host 127.0.0.1 --port 4322 --ignore-lock
```

Abrir `http://127.0.0.1:4322/design-review/home/`. La barra superior cambia entre las cuatro muestras, texto expandido y dirección RTL. La muestra RTL conserva texto español y solo comprueba composición; no representa una traducción. El texto expandido duplica mensajes para detectar cortes y desbordamientos.

La compilación de revisión genera `.design-dist/` con las 22 páginas existentes y nueve muestras. `npm run build` genera únicamente las 22 páginas existentes en `dist/`: las muestras, capítulos de ejemplo y catálogos de revisión no se publican. El escaneo de artefactos rechaza una ruta `design-review` en producción.

## Material entregado

| Elemento | Implementación |
| --- | --- |
| Paleta | 42 tokens RGBA aprobados, sin modificaciones; selección sin apilar transparencias y foco según superficie |
| Tipografía | Manrope variable 400–700 y Fraunces variable 400–600, WOFF2 latin/latin-ext locales; licencias OFL y procedencia incluidas |
| Composición | Espaciado, anchos editoriales, jerarquía, superficies oscura/lectura y adaptación móvil |
| Primitivas | Action, Field, Notice, Card y Tag; etiquetas, ayuda y error asociados; texto recibido del diccionario |
| VEC-01–03 | Marca geométrica, greca de esquina/regla y doce iconos SVG decorativos |
| VEC-04 | Tres composiciones de cubierta abstractas, explícitamente de ejemplo |
| Escena | Estudio SVG geométrico con definición inicial de piezas, pivotes, cobre y obsidiana; rugosidad y metalicidad de referencia en JSON |
| Muestras | Portada, Pipila y lectura consumen datos/diccionarios PT03; lámina adicional de controles y estados |

Fuentes de implementación: `src/styles/taller`, `src/components/taller`, `src/layouts/taller`, `src/assets/taller`, `src/pages/design-review` y claves de `src/data/site/ui/es.json`. `designContent` es una colección de ejemplos habilitada solo con `DESIGN_REVIEW=1`; al volver a producción vacía su caché. No modifica la colección pública.

Las cubiertas no representan obras terminadas. Alma y Blanco negro y gris no se incorporan. El CV sigue aplazado. Los enlaces del caso aún no migrado apuntan dentro de la revisión. El correo usa el dato editorial confirmado. La portada muestra los resúmenes aprobados de Onix y GUACAMAYA sin inventar fichas ni destinos todavía no implementados.

## Validación realizada

- `DESIGN_REVIEW=1 npm run check`: 0 errores, 0 advertencias y 7 sugerencias heredadas.
- `npm run test:design`: 30 pruebas aprobadas en Chrome local; anchos 1440, 390 y 320 px.
- axe con reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA: sin infracciones detectadas en las nueve muestras, incluidos textos expandidos y RTL.
- Controles: foco de 2 px sobre ambas superficies, hover/pulsación de acciones principales, etiquetas y descripción de error, edición, deshabilitado y salto al contenido por teclado.
- Reflujo y texto al 200 % en la lámina de controles, navegación del índice sin JavaScript, enlaces/anclas válidos y ausencia de solicitudes externas o errores de JavaScript en las muestras.
- 38 pruebas de contenido aprobadas: las 36 de PT03 más conservación de paleta y aislamiento/limpieza de ejemplos entre compilaciones.
- `npm run verify`: 22 páginas, 33 archivos textuales inspeccionados, 25 pruebas E2E aprobadas y una omisión prevista del menú móvil en escritorio. Se conservan las seis descargas y sus hashes.
- Capturas revisadas visualmente; ocho imágenes constituyen la evidencia inicial para comparar los próximos cambios. Todavía no existe una comparación automática de píxeles contra una línea base aprobada.

Los resultados del navegador quedan en `test-results/design-report.json`; `test-results` es temporal. Las capturas conservadas están en esta carpeta. La suite de revisión se ejecuta aparte de la regresión del sitio:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

Las pruebas de navegador necesitaron ejecución fuera del aislamiento para abrir Chrome y el servidor local. Durante la validación se corrigieron la ruta de revisión inicialmente omitida por Astro, la resolución del directorio de datos durante prerender y el desbordamiento de marca/avisos con texto ampliado.

## Límites y continuidad

La comprobación automática no certifica conformidad WCAG de todo el sitio. Quedan las pruebas integrales de accesibilidad y seguridad de los siguientes pasos, junto con validaciones manuales de lectores de pantalla. Los recursos externos heredados no se han retirado en PT04; las muestras nuevas funcionan sin ellos.

La escena entregada es un estudio geométrico estático: PT10 implementará WebGL, acabado material, efectos y degradación por rendimiento. PT05 integrará el marco, navegación y controles compartidos sobre esta base; PT06 validará un recorrido completo antes de extenderlo a todas las páginas.

Para la revisión visual del desarrollador: identidad y greca, equilibrio entre cobre/obsidiana, jerarquía de portada, legibilidad del caso y comodidad de lectura. No falta contenido adicional para continuar.
