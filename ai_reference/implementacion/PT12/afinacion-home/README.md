# Afinación del Home — primera revisión visual

Aplicación de los comentarios del propietario después de PT12. Disponible en la vista previa local `http://127.0.0.1:4331/es/`. No se ha publicado ni realizado push.

| Comentario | Cambio revisable |
| --- | --- |
| Menú demasiado rápido y aparentemente lineal | Entrada de 560 ms con curva Bézier de desaceleración marcada. Los enlaces tienen transición de color y subrayado; tarjetas y botones usan 420 ms. Movimiento reducido y efectos desactivados siguen teniendo prioridad. |
| Fondo con textura suave, todavía en discusión | Grano mineral tenue en SVG local, sin animación ni imágenes externas. La variable CSS `--surface-grain: none` permite retirarlo del marco/fondo; la textura es parte visual y no depende de WebGL. |
| Figura de cabecera apenas se mueve | Seguimiento del mouse en toda la sección, giro horizontal hasta ±24° y vertical hasta ±11,5°, con amortiguación y pivote centrado. Antes el máximo era aproximadamente ±3°/±1,5° y solo respondía sobre la imagen. |
| Tarjetas de proyectos y obras muy rápidas | Elevación de 5 px, borde y sombra con transición de 420 ms y curva no lineal. |
| Toda la tarjeta clickeable | Un enlace HTML real cubre la tarjeta completa mediante un pseudo-elemento: un solo foco de teclado, sin manejador JS de clic ni enlaces anidados. |
| Falta hover en enlaces | Cambio de color y subrayado más marcado, también con foco de teclado y adaptado al fondo claro de lectura. |
| Imágenes dinámicas para experiencia, capacidades y método | Tres esculturas distintas: niveles ascendentes, órbitas conectadas y puente modular. Comparten el motor y los materiales del taller. |
| CTA poco relevante | Franja con borde cobre, titular editorial de mayor tamaño, más espacio y botón «Hablemos» destacado. |
| Greca del footer desaprovechada | Franja propia a todo el ancho, hasta 52 rem; se conserva el dibujo y se prolonga su trazado a 1,4 s. |

## Escenas y recursos

Las escenas solo se montan cuando al menos el 25 % de su contenedor está visible. Al salir de esa zona se liberan canvas, listeners y recursos gráficos; las importaciones tardías no pueden montar una escena retirada. La imagen estática sigue presente para fallos, movimiento reducido, ausencia de JS o efectos desactivados.

Las nuevas imágenes se producen desde las mismas geometrías que utiliza WebGL:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run render:workshop -- --sections
```

Se conservan maestros, capturas de escritorio/móvil y `render-metrics.json` en esta carpeta. Son recursos locales, sin servicios de pago. No se cambiaron los textos editoriales ni los diccionarios.

## Verificación

- Build: 337 HTML; publicación, índice, recursos, CSP generada y escaneo del artefacto aprobados.
- Astro: 0 errores, 0 advertencias y 3 sugerencias heredadas; 73 pruebas del modelo aprobadas.
- Primera regresión: 49 pruebas aprobadas y una omisión por perfil, cubriendo escenas, preferencias, menú, navegación, tarjetas y Home a 320 px/200 %.
- Segunda regresión: 20 pruebas aprobadas, incluyendo CSP en las páginas publicadas, búsqueda nativa sin JS, comparaciones de capturas y comprobación de duración/curvas. Estas pasadas tienen pruebas en común; no se suman como casos distintos.
- Comparación visual final sin actualizar referencias: 8 pruebas aprobadas. Se inspeccionaron capturas actuales del Home y sus nuevas secciones; las referencias de viewport conservan la tolerancia visual configurada.
- Variante sin efectos: mismas 337 páginas principales y mismo índice, sin módulos gráficos opcionales.
- Lighthouse móvil sobre la vista previa: rendimiento 99/100, accesibilidad automática 100, buenas prácticas 100 y SEO 100; CLS 0 y TBT 0. Diagnóstico local, no medición de dispositivos reales ni declaración de conformidad WCAG completa.
- Las tres esculturas nuevas tienen entre 9 y 13 llamadas de dibujo y entre 1.248 y 4.560 triángulos. Los módulos opcionales y motor suman aproximadamente 151 KB gzip; sus imágenes de respaldo mayores están entre 24 y 53 KB.

Este ajuste modifica el candidato inicial de PT12. Su manifiesto y ejecución integral anteriores son históricos; antes de publicación se consolidará el candidato con todos los comentarios visuales aceptados y se repetirá la validación integral. La textura y el acabado visual siguen sujetos a revisión del propietario.

Referencia de criterio: [Material Design: easing y duración](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs). Las curvas son un ajuste del sitio, no la incorporación de una dependencia de Material Design.

## Segunda revisión: textura, marca, buscador y enlaces externos

- Textura más perceptible mediante grano oscuro: aporta variación sin aclarar el fondo bajo los textos ni reducir su contraste. Se mantiene como recurso local y separado de los efectos opcionales.
- La marca de la cabecera se traza durante 1,2 s al cargar, al entrar el puntero y al recibir foco; en modo completo acompaña un pequeño giro amortiguado. Sin movimiento con efectos desactivados o preferencia de movimiento reducido.
- Cierre del buscador de 460 ms con desvanecimiento, desplazamiento corto y curva Bézier, incluido el velo. Botón, Escape y clic exterior comparten el cierre; se devuelve el foco al disparador. Desactivar efectos durante la salida también libera el modal.
- Todos los enlaces HTTP(S) hacia otro origen incluyen indicador visual de salida, `target="_blank"`, `rel="noopener noreferrer"` y descripción accesible de nueva pestaña. Se conserva `rel="me"` donde corresponde. Rutas internas, anclas, correo y teléfono mantienen su comportamiento.
- El middleware aplica la regla al HTML durante desarrollo y prerenderizado, incluidos enlaces del contenido editorial y páginas heredadas. No requiere JavaScript en el navegador, ni modifica el texto o las exportaciones originales. El parser `ultrahtml`, ya utilizado por Astro, queda declarado como dependencia directa.
- Aviso accesible en diccionario `src/data/site/external-link-labels.json`; español e inglés disponibles, español como respaldo de los demás idiomas hasta su traducción.

Validación de esta revisión: Astro sin errores ni advertencias; suite de modelo aprobada; 32 pruebas de navegador aprobadas en móvil/escritorio (shell, corpus, enlaces y efectos nuevos). Una segunda pasada de 10 pruebas aprobó CSP, búsqueda nativa y la nueva interacción; comparte seis pruebas con la primera y no se suman como casos únicos. Verificación de todos los enlaces externos de los 337 HTML y apertura real en otra pestaña sin JavaScript, con destino simulado. Variante sin efectos: mismo contenido e índice. Capturas y registros en `enlaces/`.

El Lighthouse y la comparación de referencias visuales de la primera revisión siguen siendo históricos; no se repitieron para estos cambios. Continúa pendiente la aceptación visual del propietario y la validación integral del candidato final.

## Cabeceras con escenas propias — 5 de octubre de 2026

Las cinco cabeceras dejan de repetir la portada. Proyectos usa módulos conectados (`projects`); Trayectoria, una escalera helicoidal (`career`); Obra, hojas desplegadas (`works`); Sobre mí, una brújula (`about`); Contacto, dos interlocutores enlazados (`contact`). Conservan el lenguaje cobre/jade/piedra, la iluminación orbital, flotación y seguimiento del puntero del controlador compartido. La cabecera reserva proporción cuadrada tanto para WebGL como para su respaldo.

Quince WebP locales (400/640/800 px) generados con `npm run render:workshop -- --headers`. Maestros, métricas y capturas en `../escenas-secciones/`. Entre 9 y 18 llamadas de dibujo, 936–3992 triángulos y respaldos de 800 px entre 22 y 43 KB aproximadamente. `check:effects` verifica también estos recursos. No hay dependencias nuevas.

El build normal y la variante sin efectos mantienen 337 páginas y el mismo contenido e índice. Astro check sin errores ni advertencias (tres sugerencias heredadas). Revisión visual del propietario y validación integral del candidato siguen pendientes.

Pruebas de esta revisión: 12 casos de `home-review.spec.ts` aprobados en escritorio/móvil; incluye WebGL real, imágenes sin JS, movimiento reducido, 320 px y regresión del Home. Registros en `../escenas-secciones/`.

## Libro abierto — revisión del 5 de octubre de 2026

La tarjeta de biblioteca y la ficha comparten un modelo de libro abierto con páginas curvadas, cantos, tapas, lomo y separador. Sin pedestal; respaldos propios generados con `npm run render:workshop -- --book`. Evidencias y capturas: `../libro-3d/`. Doce pruebas de libro/lectura aprobadas; builds normal y sin efectos equivalentes. Modelo de 816 triángulos y 10 llamadas de dibujo. Pendiente aceptación visual.

## Greca vertical de Trayectoria — 5 de octubre de 2026

La cronología y los apartados siguientes usan una columna de lectura y una columna decorativa independiente. `ReadingOrnament.astro` adapta el motivo escalonado del footer a un SVG vertical: trazo tenue de fondo y trazo cobre cuyo avance responde al scroll de toda la trayectoria. Permanece visible mediante `position: sticky`, limitado al contenedor para no invadir el footer. La interpolación amortiguada (constante de 420 ms) acompaña cambios de posición; el recorrido completo depende del ritmo de lectura, sin temporizador autónomo.

`reading-ornament.js` forma parte del módulo opcional de decoraciones. Solo solicita fotogramas durante el ajuste; recalcula el objetivo al desplazar, redimensionar o cambiar la altura del contenido. Libera observadores/listeners al desactivar efectos. Sin JS, con efectos apagados o movimiento reducido se muestra la greca completa y estática. En pantallas de hasta 1000 px y al imprimir no reserva columna decorativa. Es SVG local, sin otro contexto WebGL ni dependencias.

La revisión a 320 px y texto al 200 % detectó tamaños mínimos de la cronología y palabras largas en listas; se ajustaron columnas y saltos de palabra sin recortar texto. Capturas y registros de esta revisión en `../greca-trayectoria/`. La aceptación visual y la validación integral del candidato continúan pendientes.
