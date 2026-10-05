# PT10 — Escena, alternativas y efectos

Escena WebGL real integrada en Inicio, con Three.js 0.186.1 y recursos locales. Las imágenes estáticas proceden del mismo modelo. La capa opcional respeta preferencias y movimiento reducido; el sitio también puede compilarse sin sus módulos. Implementación local, sin despliegue ni commits. La secuencia del plan sitúa ahora PT08-C antes del cierre de PT11; el CV continúa en POST01.

[Galería de escritorio y móvil](index.html) · [Métricas de renders](render-metrics.json) · [Pesos del build](transfer-metrics.json)

## Revisar

```sh
nvm use
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

Abrir `/es/`. El modo Automático parte de la imagen estática y permite la escena cuando las señales disponibles lo aconsejan. En Preferencias visuales, al pie, comparar Completo, Suave y Sin efectos; también se puede desactivar solo el 3D. Una preferencia de movimiento reducido del sistema tiene prioridad sobre Completo.

La escena entra una vez al montarse y responde suavemente al puntero sobre su propia zona. No sigue el cursor por toda la pantalla. En dispositivos táctiles conserva la composición sin obligar a arrastrar. El titular y las acciones se leen desde el HTML y nunca esperan al motor.

El desarrollador puede revisar ahora el acabado, la intensidad y los dispositivos físicos disponibles. Las capturas y pruebas locales no sustituyen esa valoración visual ni prueban todas las GPU reales.

## Materiales y correspondencia gráfica

- **3D-01:** seis planos con pivotes, grecas en relieve, esfera, disco, base y órbitas. Geometría procedural compartida por escena y renders.
- **MAT-01:** obsidiana y cobre, con acento jade, iluminación cálida y contraluz. Una sombra direccional acotada; sin bloom ni posprocesado.
- **TEX-01:** relieve y variación mineral generados localmente en un lienzo de 256 × 256. La comparación inicial mostró superficies demasiado uniformes; el detalle aporta lectura sin descargar mapas externos.
- **ENV-01:** entorno de reflejos generado localmente con RoomEnvironment/PMREM. Se comparte en la escena; no necesita HDR descargado.
- **IMG-01:** maestro transparente de 1600 × 1200 y WebP de 640, 960 y 1280 px.
- **IMG-02:** maestro transparente de 1000 × 1000 y WebP de 400, 640 y 800 px. Cámara adaptada al encuadre cuadrado, sin recortar automáticamente el render de escritorio.

Maestros en `masters/`; derivados públicos en `public/taller/workshop/`. WebP con alfa conserva la transparencia y cumple holgadamente los objetivos de peso; no se agrega una segunda familia de AVIF sin necesidad. Los encuadres reservan su proporción en HTML/CSS y permanecen iguales al activar o desactivar WebGL.

Para regenerarlos desde el modelo:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run render:workshop
```

El comando inicia un servidor local temporal, renderiza con Chrome y cierra sus recursos. Sharp, ya presente a través de Astro, produce los derivados. El render usa el mismo `workshop-model.js` que la visita. No se usa un servicio de imágenes ni recursos comprados.

## Efectos entregados

| Efectos | Implementación |
| --- | --- |
| FX01–FX03 | Ensamble de 850 ms, giro acotado de hasta ±3° horizontal y reflejos del cobre en un único renderer. |
| FX04 | Entrada discreta de grupos en Inicio, catálogos y Sobre mí. No anima letras, párrafos del lector ni el titular inicial. |
| FX05 | Trazo breve de grecas decorativas del pie; su versión HTML permanece completa fuera de la capa. |
| FX06 | Respuesta breve de tarjetas y botones. Elevación máxima de 2 px en Completo; Suave conserva respuestas sin desplazar tarjetas. |
| FX07 | Respuesta de subrayado y controles de selección; estado activo y foco siguen siendo funcionales sin animación. |
| FX08 | Apertura discreta de menú y buscador. El cierre es inmediato para devolver el foco sin mantener controles en transición. |
| FX09 | Desvanecimiento de un acento decorativo al actualizar resultados, conservando el texto opaco. Las consultas nuevas cancelan decoraciones anteriores sobre la lista. |
| FX10 | Acento de etapas de Trayectoria según la zona visible de lectura; no desplaza su contenido. |
| FX13 | Énfasis breve de la confirmación textual de copia o compartir. No condiciona el éxito de esas funciones. |

Los fundidos sobre bloques de texto se sustituyeron por acentos decorativos y desplazamientos breves: la regresión detectó pérdida transitoria de contraste al animar su opacidad. Las letras permanecen opacas durante todas las transiciones.

CSS, SVG, IntersectionObserver y Web Animations API cubren esta familia; no hizo falta Motion. FX11, grafo/FX12 y visores/FX14 no se amplían en PT10, conforme a la secuencia del plan.

## Separación, pausa y fallos

El código funcional no importa Three.js. `shell.js` consulta la política existente antes de cargar `optional.js`; ese coordinador registra adaptadores de decoración y escena. El motor se solicita solo en Inicio y cerca de la zona visible. El resto de páginas puede usar microinteracciones sin descargar 3D.

Sin efectos, Suave, Desactivar 3D, ahorro de datos, señales de equipo limitado o movimiento reducido evitan el motor según la política. Al desactivar se cancelan fotogramas y animaciones, se desconectan observadores/eventos y se liberan geometrías, materiales, texturas, renderer y contexto. Una importación tardía no puede montar una escena ya desactivada.

Fuera de pantalla se pausa el renderizado y, en reposo, no queda un bucle ornamental. Al ocultar la pestaña, el controlador conservador desmonta la capa y libera recursos; puede montarla de nuevo al regresar si la preferencia lo permite. La restauración desde el historial reconecta la capa sin recargar la página.

Importación fallida, WebGL no disponible y pérdida de contexto mantienen la imagen y los enlaces. Un fallo de escena queda deshabilitado durante esa visita, evitando reintentos continuos. No se registra actividad del visitante ni se envían métricas.

La calidad limita DPR a 1,5. Dos ventanas activas consecutivas de dos segundos con mediana de intervalos superior a 40 ms reducen DPR a 1; si persiste en otras dos ventanas, se vuelve a la alternativa estática. Arranque de shaders, reposo y pausa no aportan muestras de lentitud. Esta señal estima fluidez de la página, no diagnostica la GPU.

## Compilación sin la capa opcional

```sh
npm run build:static
VITE_DISABLE_EFFECTS=1 npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

La salida queda en `.effects-off-dist/`, separada de `dist/` y `.design-dist/`. La bandera se sustituye explícitamente durante el build; elimina coordinador, decoraciones, escena y motor del artefacto. Se conserva la imagen y la hoja de estilos base; las reglas opcionales no se activan. La prueba compara el contenido principal de las 52 páginas y el manifiesto del índice con el build normal.

## Rendimiento y memoria

Valores locales, separados por naturaleza:

| Medida | Resultado |
| --- | --- |
| Triángulos con pase de sombras | 5.608; objetivo máximo 60.000 |
| Llamadas de dibujo con sombras | 29; objetivo máximo 30 |
| Buffers de geometría del modelo | 192.472 bytes en arrays; no es una medida de VRAM total |
| Recursos registrados por Three.js | 18 geometrías y 6 texturas en el render final |
| Resolución | DPR máximo 1,5; reducción a 1 ante lentitud sostenida |
| Motor Three.js | Aproximadamente 144 KB gzip, separado del código propio |
| Escena, coordinación y decoraciones | Aproximadamente 5,5 KB gzip; objetivo de coordinación hasta 35 KB |
| Imágenes WebP | Aproximadamente 20–65 KB cada una |

Los mapas y el entorno se generan en memoria, por lo que no añaden archivos de textura a la transferencia. El código del modelo sí cuenta en el peso de escena. Los archivos JSON enlazados conservan los valores exactos y nombres del build validado. Gzip se calcula localmente; la compresión HTTP del alojamiento se comprueba al publicar.

Las pruebas de WebGL y los renders emplean Chrome con SwiftShader. `capturas/*/metricas.json` registra el arranque por separado, intervalos activos posteriores y recursos del renderer por viewport; `not-sampled` indica que no hubo suficientes intervalos posteriores al arranque. esos intervalos no son una promesa de FPS en dispositivos físicos. Las pruebas verifican que el contador de renderizado permanece estable en reposo y que el contexto GL queda perdido al liberar la escena. No se afirma haber medido VRAM total del dispositivo.

## Validación

```sh
nvm use
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:static
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

Ejecutar secuencialmente: los builds comparten el almacén de contenido de Astro. Terminar con el build normal y sus comprobaciones. `verify` incorpora `check:effects` para controlar pesos y presupuestos, además de las verificaciones del contenido, exportaciones e índice.

La validación cubre motor real, preferencias, movimiento reducido inicial y sobre una escena activa, pausa, limpieza, reactivación, importación tardía, fallo de motor, WebGL no disponible, pérdida de contexto, teclado, historial, búsqueda, ausencia de cargas externas y alternativa sin JavaScript. Accesibilidad automatizada con axe y regresión visual a 320 px, texto ampliado y RTL; no equivale a certificación WCAG completa.

Resultados locales finales:

- Astro check: cero errores y cero advertencias; cuatro sugerencias heredadas.
- 65 pruebas de contenido/modelo aprobadas, incluidas ventanas de degradación y exclusión de periodos inactivos.
- 103 E2E aprobadas y una omisión prevista. Incluyen 24 pruebas de efectos; esas 24 también se ejecutaron por separado después de ajustar las mediciones de arranque.
- 51 pruebas de revisión visual/idiomas aprobadas; 30 de navegación y búsqueda aprobadas sobre la compilación sin efectos.
- Build normal: 52 HTML, 24 exportaciones y 26 documentos de búsqueda. 103 archivos textuales revisados; fragmentos Pagefind descomprimidos y concordantes. Build de revisión: 103 HTML.
- Presupuestos de recursos aprobados, imágenes regeneradas y `git diff --check` sin errores.
- Navegación histórica, descargas del libro, contacto, lectura y búsqueda conservan las comprobaciones existentes.

Durante la regresión se corrigió una pérdida transitoria de contraste causada por opacidad. Después hubo un cierre inesperado de Chromium (`Target crashed`) en una prueba móvil de la ejecución paralela; el conjunto completo se repitió con `npm run test:e2e -- --workers=1` y aprobó. La causa de ese cierre aislado no se atribuye al sitio ni al hardware sin más evidencia. Al finalizar, `dist/` contiene el build normal y las verificaciones de artefactos están aprobadas.

Three.js 0.186.1 es la única dependencia añadida; licencia MIT conservada en `/licenses/three.txt`. La instalación auditó 313 paquetes e informó cero vulnerabilidades. Continúa el aviso histórico de colección `blog` vacía. No hay servicios nuevos ni publicación remota.

Referencias técnicas: [renderer WebGL](https://threejs.org/docs/pages/WebGLRenderer.html), [renderizado bajo demanda](https://threejs.org/manual/pages/rendering-on-demand.html) y [liberación de recursos](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).
