# PT05 — Marco compartido y navegación

**Continuidad:** [PT06](../PT06/README.md) completa el recorrido y añade exportaciones. Sus recuentos de pruebas y siguiente paso sustituyen los resultados históricos de esta entrega PT05.


Implementado y validado localmente. Sin despliegue. El marco nuevo se integra en el build normal; PT04 conserva su compilación separada de revisión. Siguiente unidad: PT06, recorrido completo y exportaciones coherentes.

## Revisar

```sh
nvm use
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

Abrir `http://127.0.0.1:4321/es/`. La [galería](index.html) conserva capturas de Inicio en escritorio y móvil. Para revisar estados reales, abrir el menú móvil, Buscar y Preferencias visuales en el pie. Escape cierra menú/panel y devuelve el foco; sin JavaScript la navegación queda visible y Buscar conduce al listado HTML.

## Entrega

| Componente | Comportamiento implementado |
| --- | --- |
| L0 / W01 | Documento común, metadatos, idioma/dirección, foco y salto al contenido |
| W02 / W03 | Marca con destino al inicio del idioma, navegación de cinco secciones, sección activa y menú móvil |
| W04 | Enlaces a versiones equivalentes presentes en el manifiesto de rutas; oculto cuando solo existe una. Capacidad probada con dos destinos sintéticos excluidos de producción |
| W05 | Acceso HTML a Explorar, panel con formulario accesible y búsqueda básica local por título/resumen; consulta en URL, historial, limpieza y estado vacío |
| W06 | Migas jerárquicas: Inicio → sección → contenido; página actual sin enlace redundante |
| W07 | Automático, Suave, Completo, Sin efectos y Desactivar 3D; guardado local, restablecimiento y sincronización entre pestañas |
| W08 | Enlaces confirmados a LinkedIn, GitHub, Reddit y TikTok, con nombres resueltos por diccionario |
| Error | 404 estática con inicio y acceso a Explorar; sin reflejar rutas o consultas del visitante como HTML |

Los mensajes nuevos están en `src/data/site/ui/es.json`; correo/perfiles en `channels.json`, con validación de correo y URLs HTTPS sin credenciales ni esquemas ejecutables. Los textos de entrada proceden del documento editorial aprobado. El marco usa CSS propio y fuentes locales; no importa Bootstrap, motores de animación, WebGL ni recursos remotos.

## Rutas y migración local

`src/pages/[locale]/[...path].astro` genera las rutas desde un manifiesto y las colecciones públicas. Las plantillas reciben idioma y diccionario; los idiomas nuevos solo se habilitan cuando disponen de sus catálogos. Los slugs de entidades siguen separados de sus IDs conceptuales.

| Ruta | Contenido inicial disponible |
| --- | --- |
| `/es/` | Presentación, selección configurada, accesos a trayectoria, capacidades, forma de trabajar, obra y contacto |
| `/es/proyectos/` | Introducción y selección pública actual: Pipila |
| `/es/trayectoria/` | Introducción y etapa SoDigital con ancla estable |
| `/es/obra/` | Introducción y enlace a Cuando la tostadora te responde |
| `/es/sobre-mi/` | Presentación y forma de trabajar |
| `/es/contacto/` | Invitación, correo y LinkedIn |
| `/es/explorar/` | Listado HTML y búsqueda básica entre tres entradas públicas PT03 y el libro vigente |
| `/es/temas/` | Término de integración de sistemas |
| `/es/proyectos/pipila/` | Cuerpo público PT03 y relaciones disponibles |
| `/es/temas/integracion-de-sistemas/` | Definición pública PT03 |

La raíz `/` conduce ahora a `/es/` mediante HTML, también con navegador configurado en inglés y sin JavaScript. Se modificó intencionalmente la expectativa anterior que enviaba a `/en/`. La nueva portada conserva destinos útiles para `#profile`, `#experience`, `#skills` y `#softskills`.

Las páginas históricas ES/EN/NAH siguen disponibles, al igual que las seis descargas PDF/EPUB. No se aplicaron redirecciones de las antiguas secciones: la migración definitiva corresponde a PT11. Tampoco se eliminaron dependencias que siguen teniendo consumidores en esas páginas.

El build normal pasa de 22 a 32 páginas: sustituye Inicio ES, añade nueve destinos de contenido y una 404. Se revisan 44 archivos textuales para impedir filtración de ejemplos y rutas de revisión. Las nuevas rutas existen en el artefacto local; esto no demuestra que estén publicadas en el alojamiento.

## Controlador opcional de efectos

Implementado en `src/lib/site/effects.mjs`, conectado por `src/scripts/shell.js`. La apariencia base y las funciones del sitio no dependen de sus adaptadores.

- `createEffectsController(preferences, signals)`: preferencias validadas y señales de movimiento reducido, visibilidad, ahorro de datos y hardware limitado.
- `getState()` / `subscribe(listener)`: política efectiva con nivel, movimiento permitido y permiso de 3D.
- `setPreferences()` / `setSignals()`: recalculan la política; los cambios se aplican sin recargar la página.
- `register(id, 'scene' | 'decoration', mount)`: conecta una capa opcional. `mount(state)` devuelve una función de limpieza; al desactivar, ocultar o cambiar nivel se desmonta la capa. La función devuelta por `register` la retira.
- `failScene()`: impide reactivar 3D durante la vida de ese controlador. Los fallos de montaje de la escena activan esa misma protección.
- `destroy()`: libera adaptadores y suscripciones.

`allow3D` expresa autorización de la política, no confirma disponibilidad de GPU ni que se haya cargado una escena. PT05 no importa ningún motor ni crea un contexto WebGL. PT10 conectará la inicialización gráfica, detección de soporte, calidad, observación de rendimiento y recuperación/fallback al controlador. Las importaciones asíncronas de un adaptador deberán respetar su limpieza para no montar una escena después de desactivarla.

La prioridad es: Sin efectos o movimiento reducido → estático; Suave o Desactivar 3D → sin escena; ahorro de datos, hardware limitado o fallo gráfico → sin 3D; pestaña oculta → sin actividad decorativa. Completo no anula estas restricciones. Automático arranca con HTML estático y permite que el adaptador posterior evalúe capacidades.

El almacenamiento guarda exclusivamente `{mode, disable3D}` bajo `paynalton.visual.v1`. Datos inválidos vuelven a valores predeterminados. Si se bloquea, los controles siguen funcionando en memoria mientras la página permanezca abierta; se informa de que la elección no pudo persistirse. Sin JavaScript se muestra la versión estática y los ajustes quedan deshabilitados con una explicación.

## Validación y seguridad

- `npm run verify`: 0 errores y 0 advertencias de Astro/TypeScript; 7 sugerencias heredadas. 45 pruebas de contenido, navegación, política de efectos y seguridad de entradas; todas aprobadas.
- Navegador: 43 aprobadas y una omisión prevista del menú móvil en escritorio. Incluye la regresión anterior y 18 pruebas nuevas sobre el marco.
- `npm run test:design`: 33 aprobadas, conservando las 30 comprobaciones PT04 y añadiendo selector de idiomas con y sin equivalencia en tres tamaños.
- Último ajuste de columnas según selección: suite del marco ejecutada de nuevo; 18 aprobadas, con capturas regeneradas.
- axe sobre las diez rutas nuevas, panel de búsqueda y preferencias: sin infracciones detectadas en las reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA comprobadas.
- Navegación por teclado, foco de retorno, enlaces/anclas, ausencia de solicitudes externas en el marco nuevo, 320 px, texto al 200 %, etiquetas expandidas y dirección RTL comprobados.
- Sin JavaScript: navegación, listado de Explorar, raíz ES, 404 y acceso al libro funcionan. La búsqueda dinámica requiere JavaScript, pero sus enlaces de contenido siguen disponibles.
- Consultas con HTML malicioso se tratan literalmente, sin `innerHTML` ni ejecución. Historial y limpieza funcionan; búsqueda insensible a acentos. URLs de perfiles ejecutables, con credenciales o inválidas se rechazan en build.
- Preferencias con almacenamiento bloqueado, estado inválido, reducción de movimiento, fallo simulado de un adaptador, pausa/reanudación y sincronización entre pestañas verificadas.
- Rutas heredadas y seis descargas conservadas; comparación de hashes aprobada. Sin nuevas dependencias en PT05.

Comandos reproducibles:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
```

No ejecutar ambas compilaciones simultáneamente: comparten el almacén de contenido de Astro. Chrome y los servidores locales requirieron permisos fuera del aislamiento del entorno. Las capturas se revisaron visualmente; no hay todavía comparación automática de píxeles contra una línea base aprobada. Estas comprobaciones no certifican WCAG integral ni sustituyen la auditoría completa de seguridad de los siguientes pasos.

## Lo que continúa en otros pasos

- PT06: validar el recorrido Inicio → Pipila → término → contacto; completar exportaciones JSON/Markdown y concordancia de representaciones.
- PT07/PT08: ampliar casos, trayectoria, biografía, biblioteca y lectura. Las rutas de entrada útiles no significan que esos contenidos estén completos. Actualmente la selección profesional contiene Pipila; Onix y GUACAMAYA se incorporan con la ampliación editorial del modelo.
- PT09: índice de texto completo y filtros. La búsqueda PT05 filtra título/resumen del listado HTML ya disponible y no se presenta como implementación de Pagefind.
- PT10: motor 3D, acabados, efectos y medición de rendimiento. La portada sigue usando el estudio SVG estático.
- PT11: migración definitiva de URLs, metadatos/exportaciones completos y retirada de recursos externos incompatibles que siguen en el legado.
- Mantener excluidas las obras aplazadas y los ejemplos; CV después del sitio. Al activar una traducción futura hay que migrar su página histórica de Inicio, que tiene precedencia como ruta estática, además de completar sus diccionarios. No habilitar EN/NAH solo para mostrar el selector.

Revisión del desarrollador disponible: orientación entre secciones, comportamiento móvil/teclado y comprensión de las preferencias. No falta información para PT06.
