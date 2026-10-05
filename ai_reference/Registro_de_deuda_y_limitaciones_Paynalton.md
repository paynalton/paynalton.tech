# Registro de funciones imposibles bajo las restricciones del proyecto

Fecha: 21 de septiembre de 2026. Revisión 3. Sustituye las revisiones anteriores de este registro.

## Restricciones expresas del propietario

1. Se considera **imposible para este proyecto** toda función que requiera pagar servicios externos al sitio.
2. Se considera **imposible para este proyecto** toda función que no pueda realizarse con un sitio HTML estático.
3. La información disponible, las actualizaciones y el volumen de trabajo no son limitantes.

“Imposible” significa incompatible con estas restricciones, aunque la función pudiera construirse en otra arquitectura. Un proveedor gratuito no vuelve aceptable una función que requiera procesamiento de servidor.

Interpretación operativa de sitio estático: HTML, CSS, JavaScript ejecutado en el navegador y archivos públicos generados durante la compilación. Incluye WebGL, búsqueda local y generación de páginas e índices antes de publicar. Excluye backend propio o delegado, funciones serverless y servicios remotos que procesen operaciones funcionales del sitio. Esta interpretación conserva la arquitectura estática prevista en las referencias; no significa HTML sin JavaScript.

## Funciones clasificadas como imposibles

| ID | Función o modalidad excluida | Restricción que incumple | Alternativa compatible |
| --- | --- | --- | --- |
| IMP01 | Formulario que reciba, almacene o envíe mensajes mediante backend, Netlify Forms, funciones serverless o un procesador externo, aunque disponga de modalidad gratuita | Necesita procesamiento fuera de los archivos estáticos | Correo visible y copiable, enlace `mailto:` y perfiles de contacto. No mostrar confirmación de entrega de mensajes |
| IMP02 | Chatbot, RAG o generación de respuestas dependientes de una API de IA, un servidor de inferencia o un servicio de pago | Procesamiento remoto o pago externo | Búsqueda textual local y contenido editorial. Una posible inferencia enteramente local en navegador es otra modalidad, no comprometida ni descartada por esta entrada |
| IMP03 | Cuentas de visitantes, autenticación gestionada por el sitio, sesiones de servidor, permisos privados y recuperación de contraseña | Requieren un sistema de identidad y control de acceso fuera del sitio estático | Acceso público. Las preferencias locales no se presentan como cuentas ni como protección de información |
| IMP04 | Comentarios públicos persistentes, mensajería, favoritos compartidos o progreso de lectura sincronizado entre dispositivos | Requieren escritura y persistencia compartida en un servicio | Preferencias y progreso locales; discusión mediante enlaces externos, fuera del sitio |
| IMP05 | Cobros, pedidos, suscripciones de pago o comercio electrónico procesados desde el sitio | Requieren procesamiento transaccional externo a la arquitectura estática, con independencia de sus tarifas | Catálogo informativo y descargas públicas. Un enlace externo no constituye un sistema de compra implementado en el sitio |
| IMP06 | Publicación automática en redes o sincronización permanente que necesite un backend, custodia de credenciales o un servicio de automatización de pago | Procesamiento remoto o pago externo | Selección editorial de enlaces y metadatos incorporada al build; publicación manual en las plataformas |
| IMP07 | Buscador alojado, búsqueda vectorial remota o grafo consultado mediante un servicio de servidor | Depende de procesamiento remoto; el pago, si existe, añade otra incompatibilidad | Pagefind o índice local; taxonomía y relaciones calculadas en build; grafo visual en navegador |
| IMP08 | Servidor MCP remoto o herramientas para agentes que escriban datos compartidos, consulten información privada de servidor o ejecuten operaciones de backend | Necesitan un servicio de ejecución ajeno al HTML estático | Markdown, JSON y llms.txt públicos; WebMCP de solo lectura en navegador, cuando sea compatible y no dependa de servicios de pago |
| IMP09 | Analítica centralizada propia, seguimiento remoto de visitantes o paneles que necesiten recopilar y procesar eventos mediante un servicio | Requieren procesamiento remoto; se excluyen también modalidades gratuitas | Validación local de calidad y rendimiento. No se promete medición centralizada de visitas |
| IMP10 | Generación de páginas por solicitud, SSR, ISR dependiente de servidor, middleware de aplicación y endpoints que reciban escrituras | Exigen ejecución de servidor durante el uso del sitio | Generación completa en build y publicación de archivos; rutas y errores estáticos |
| IMP11 | Newsletter con alta de suscriptores, almacenamiento de correos y envío automático | Requiere recepción, persistencia y envío mediante servicios | Feed RSS estático y enlaces para suscripción en lectores elegidos por el visitante |
| IMP12 | Cualquier otra integración, widget, API o automatización cuyo funcionamiento obligatorio requiera contratar un servicio externo | Pago externo, incluso si la interfaz se inserta en una página estática | Implementación local o durante el build, alternativa sin servicio de pago, o eliminación de la función |

La condición se aplica a la modalidad descrita. Por ejemplo, IMP07 excluye la búsqueda remota, no la búsqueda; IMP08 excluye el servidor MCP, no los archivos para agentes. Las pruebas gratuitas o cuotas iniciales gratuitas no justifican una dependencia que requiera contratación para el funcionamiento previsto.

## Funciones que sí permanecen realizables

| Función | Implementación compatible |
| --- | --- |
| Ocho layouts, navegación, idiomas y lectura | HTML generado, CSS y componentes Astro |
| WebGL Taller nocturno | Código y recursos servidos por el sitio, ejecución en navegador e imagen alternativa |
| Búsqueda y filtros | Índice estático generado en build y consulta en navegador |
| Taxonomía y grafo interactivo | Relaciones generadas en build y representación local |
| Preferencias y progreso de lectura | Almacenamiento local del navegador, sin sincronización remota |
| CV y libros | Archivos públicos PDF/EPUB y páginas HTML |
| SEO y formatos para agentes | Metadatos, JSON-LD, sitemap, Markdown, JSON y llms.txt generados |
| Copiar y compartir | Portapapeles, compartir del sistema y enlaces, con alternativas seleccionables |
| RSS | Archivo generado junto con el contenido |
| Contacto | Correo y enlaces externos; no recepción de formularios |
| Perfiles y publicaciones sociales | Enlaces y resúmenes editoriales locales |
| Datos públicos externos durante preparación/build | Descarga sin pago obligatorio, sin backend en tiempo de visita y con snapshot local; si la fuente exige pago, esa integración queda excluida |
| WebMCP de consulta local | Interfaz en navegador compatible sobre datos estáticos; no se exige contratar un agente externo para usar la web |

Los embeds remotos no se presumen compatibles: inicialmente se utilizarán enlaces y resúmenes locales. Un embed solo podrá considerarse si respeta ambas restricciones; no se introducirá un servicio de procesamiento como excepción implícita.

## Efecto sobre el alcance y el sitio existente

- **W40, formulario de contacto:** pasa de opcional a imposible bajo estas restricciones. Se conserva W34 con correo visible, copiable y `mailto:`.
- **WebMCP:** se limita a consulta local en navegador. Se excluye un servidor MCP remoto.
- **Integraciones sociales:** se priorizan enlaces, selección editorial y snapshots preparados sin servicios de pago. Se excluyen backend de sincronización y publicación automática.
- **Analítica:** Google Analytics está presente en el código actual. Bajo la restricción de no depender de procesamiento remoto funcional, queda señalada su retirada durante la implementación; este documento no modifica todavía el código ni la cuenta del proveedor.
- **RSS y lectura avanzada:** siguen siendo viables en sus modalidades estáticas/locales. Su ubicación en E2 es planificación, no imposibilidad.
- **WebGL, búsqueda, contenidos, traducciones y actualizaciones:** permanecen dentro del trabajo realizable. Su complejidad no permite reclasificarlos como imposibles.
- **Despliegue:** la distribución de archivos es necesaria para publicar el sitio. No se presupone autorización para contratar planes ni activar cargos adicionales. No se ha verificado el plan actual; este registro no afirma que el alojamiento vigente sea gratuito ni cambia el proveedor.

## Seguimiento

Antes de añadir una dependencia se comprobará si necesita un servicio de pago o procesamiento de servidor. Si cualquiera es obligatorio, se marcará como imposible y se elegirá una alternativa estática que cumpla ambas reglas.

No se resolverán estas exclusiones añadiendo un plan gratuito de backend, ocultando procesamiento en un tercero ni trasladando credenciales al navegador. Cambiar una de las restricciones requeriría una instrucción expresa posterior del propietario.

Este registro prevalece sobre propuestas anteriores de backend, formulario o servicios de pago. Las antiguas entradas DE01–DE24 y LT01–LT06 quedan sustituidas. La información faltante y las tareas pendientes vuelven al plan ordinario de ejecución.
