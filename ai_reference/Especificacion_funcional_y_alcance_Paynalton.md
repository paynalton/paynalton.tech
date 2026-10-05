# Especificación funcional y alcance — Paynalton

**Proyecto:** rediseño de paynalton.tech  
**Versión:** 1.0  
**Fecha:** 22 de septiembre de 2026  
**Estado:** propuesta de alcance para revisión; no representa una implementación terminada ni una aprobación de publicación.

## 1. Propósito

Transformar la Web CV en un sitio personal que presente un perfil fullstack con experiencia demostrable en IA aplicada, arquitectura de soluciones, liderazgo de equipos y planeación y control de proyectos, junto con su obra literaria, filosofía y ensayos.

El sitio debe permitir comprender el perfil, comprobar sus capacidades, leer su obra y establecer contacto. La dirección visual será **Taller nocturno**, con obsidiana, cobre y ornamentación prehispánica discreta. WebGL enriquecerá la portada y tendrá una alternativa estática completa.

Este documento convierte las propuestas de navegación, stack, layouts, widgets y riesgos en requisitos verificables. Establece una **primera entrega propuesta (E1)** y ampliaciones posteriores (E2). La división es una recomendación de planificación; las decisiones pendientes se identifican explícitamente.

## 2. Objetivos y resultados esperados

| ID | Objetivo | Resultado observable |
| --- | --- | --- |
| O01 | Comunicar el posicionamiento profesional | Una persona puede explicar el enfoque profesional después de revisar la portada y encuentra enlaces a evidencia. |
| O02 | Demostrar experiencia | Los casos distinguen responsabilidad personal, contexto del equipo, decisiones y resultados. |
| O03 | Facilitar oportunidades profesionales | El visitante puede localizar contacto, LinkedIn y CV sin depender de efectos gráficos. |
| O04 | Dar presencia propia a la obra | Literatura, filosofía y ensayos tienen catálogo, páginas legibles y categorías reconocibles. |
| O05 | Conectar las facetas del perfil | Temas y relaciones enlazan contenidos de diferentes categorías sin confundir reflexión con experiencia profesional. |
| O06 | Facilitar acceso humano y automatizado | El contenido esencial es HTML accesible; los formatos para agentes mantienen identidad, idioma, autoría y origen coherentes. |
| O07 | Mantener una operación sostenible | El sitio puede reconstruirse, actualizarse y recuperarse sin un servidor de aplicación permanente. |

La contratación, el tráfico y las citas por agentes son resultados externos que no se garantizan mediante la implementación. La aceptación técnica se evalúa por los comportamientos descritos aquí.

## 3. Públicos y necesidades

| Público | Necesidad principal | Contenidos de entrada |
| --- | --- | --- |
| Reclutamiento y selección | Entender el perfil, su trayectoria y cómo contactar | Inicio, Trayectoria, CV y Contacto. |
| Líderes técnicos y posibles colaboradores | Evaluar decisiones, arquitectura, experiencia y forma de trabajar | Casos de estudio, competencias y Sobre mí. |
| Lectores | Descubrir y recorrer literatura, filosofía y ensayos | Obra y pensamiento, publicaciones y temas. |
| Comunidad técnica y social | Encontrar proyectos y contribuciones públicas | Proyectos, perfiles y publicaciones seleccionadas. |
| Buscadores y agentes | Recuperar información pública con contexto y atribución | HTML, enlaces, metadatos y exportaciones estáticas. |
| Propietario/editor | Publicar, corregir y relacionar contenido de manera consistente | Archivos editoriales, validación y despliegue. |

El sitio público no requiere cuentas de visitantes. La edición inicial se realiza mediante archivos versionados; un panel de administración no forma parte del alcance inicial.

## 4. Decisiones de base y restricciones

- Conservar Astro y alojamiento en Netlify con salida estática.
- Mantener cinco entradas principales: Proyectos, Trayectoria, Obra y pensamiento, Sobre mí y Contacto. La marca enlaza al inicio; búsqueda e idiomas son utilidades globales.
- Usar ocho layouts de página y un base compartido. Los idiomas y categorías reutilizan layouts.
- Mantener categorías editoriales separadas y relaciones transversales mediante términos e identificadores estables.
- Incluir selector de idiomas. El conjunto exacto de idiomas y traducciones publicables requiere inventario y validación.
- Integrar LinkedIn, GitHub, Reddit y TikTok mediante los perfiles y contenidos públicos confirmados.
- Preservar lectura y navegación cuando fallen JavaScript, WebGL o proveedores externos.
- No incluir credenciales ni material restringido en HTML, índices, medios o exportaciones.
- Las versiones de paquetes, configuración de despliegue y compatibilidad se concretarán al revisar el repositorio existente.

## 5. Alcance por entrega

| Área | E1 — primera entrega propuesta | E2 — ampliaciones |
| --- | --- | --- |
| Identidad | Taller nocturno completo, tipografía y componentes coherentes | Refinamiento de recursos y composiciones secundarias. |
| WebGL | Una escena de portada, carga diferida, pausa, desactivación e imagen alternativa | Interacciones y modelado más elaborados, si aportan valor. |
| Perfil profesional | Portada, trayectoria, casos, Sobre mí, CV y contacto | Nuevos casos, evidencias y recorridos editoriales. |
| Obra | Catálogo y lectura de piezas disponibles, con notas e índice cuando correspondan | Preferencias, progreso local y funciones avanzadas para series. |
| Idiomas | Infraestructura y selector; publicar solo versiones revisadas | Ampliar cobertura por pieza e idioma. |
| Exploración | Búsqueda textual, filtros básicos, términos y relaciones enlazadas | Grafo interactivo, recorridos y filtros adicionales. |
| Redes | Enlaces identificados a perfiles confirmados, compartir enlace y selección editorial simple | Snapshots de GitHub, embeds, videos bajo demanda y más curaduría. |
| Agentes | Metadatos, JSON-LD pertinente, Markdown y JSON públicos; índice llms.txt complementario | WebMCP de solo lectura, sujeto a evaluación de compatibilidad. |
| Contacto | Correo visible y copiable, LinkedIn y descarga de CV | Formulario solo al definir receptor y tratamiento de datos. |
| Operación | Build reproducible, validación, redirecciones y recuperación documentada | Automatizaciones adicionales y medición más detallada. |

**E1 mantiene WebGL como parte de la entrega prevista.** La alternativa estática es un requisito de funcionamiento; posponer por completo la escena sería un cambio de alcance que debe registrarse, no una consecuencia automática de un fallo técnico.

### Fuera del alcance inicial

Chatbot generativo, cuentas de lectores, comentarios propios, base de datos operativa, comercio electrónico, publicación automática en redes, feeds sociales en tiempo real, búsqueda vectorial, traducción automática presentada como revisada y migración a otro proveedor de alojamiento.

No se exige completar traducciones inexistentes ni crear una cantidad arbitraria de publicaciones para llenar el diseño. La selección editorial mínima se concreta antes de cerrar E1.

## 6. Recorridos de usuario

| ID | Recorrido | Secuencia | Resultado y alternativa |
| --- | --- | --- | --- |
| U01 | Evaluar el perfil | Inicio → proyecto → trayectoria → contacto | Identifica capacidades y evidencia; CV y contacto son accesibles sin 3D. |
| U02 | Revisar una solución | Proyectos → filtro → caso → arquitectura/evidencias | Comprende problema, rol y decisiones; puede abrir recursos sin visor interactivo. |
| U03 | Leer una publicación | Obra y pensamiento → categoría → publicación → notas/relacionados | Lee el texto y puede continuar por enlaces; no depende de preferencias guardadas. |
| U04 | Explorar un tema | Etiqueta → término → contenidos de varias categorías | Distingue qué pieza usa, demuestra o analiza el concepto. |
| U05 | Cambiar de idioma | Página → selector → traducción equivalente | Conserva entidad; si falta traducción, recibe explicación y destino alternativo explícito. |
| U06 | Encontrar contenido | Buscar → resultados → filtro → detalle → volver | Recupera consulta y filtros; sin búsqueda interactiva puede recorrer categorías y términos. |
| U07 | Contactar desde una red | Enlace compartido → contenido → contacto/perfil | El enlace profundo funciona y mantiene contexto; el correo se puede seleccionar si copiar falla. |
| U08 | Consultar mediante un agente | Índice público → pieza → relaciones → fuente canónica | Accede solo a contenido publicado, con idioma, autoría y origen. |
| U09 | Publicar una actualización | Editar → validar → preview → revisar → desplegar | Se actualizan página, búsqueda y exportaciones en una misma entrega verificable. |

## 7. Requisitos funcionales de E1

Todos los requisitos RF de esta sección pertenecen a E1. Una condición como “si existe” determina la presencia del contenido, no autoriza a sustituirlo por datos de ejemplo.

| ID | Requisito y regla de funcionamiento | Criterio de aceptación | Trazabilidad |
| --- | --- | --- | --- |
| RF01 | Navegación global consistente, marca al inicio y sección activa. | Las cinco secciones se alcanzan desde cualquier página; menú móvil operable por teclado y cierre con retorno del foco. | L0; W01–W03; U01–U07. |
| RF02 | Selector global de idiomas con equivalencias por entidad. | Ningún enlace apunta a traducciones inexistentes; se informa la ausencia antes de ofrecer otro destino. Disponible también en lectura. | L0; W04; U05. |
| RF03 | Portada con presentación profesional y enlaces a evidencia y contacto. | El mensaje describe el enfoque sin títulos o métricas no sustentados; cada acción lleva a contenido real. | L1; W09, W11, W13; U01. |
| RF04 | Escena WebGL aislada del contenido esencial. | Imagen inicial, carga diferida, pausa fuera de vista, desactivación y recuperación ante fallo gráfico; texto y enlaces siempre utilizables. | L1; W07, W10; U01. |
| RF05 | Catálogo de proyectos con resumen, participación y filtros pertinentes. | Cada tarjeta tiene destino; filtros muestran estado, permiten limpiarlo y se conservan en URL. | L2; W11, W14, W15; U02. |
| RF06 | Caso de estudio con problema, rol, decisiones, solución, resultados y aprendizajes. | La evidencia publicada corresponde a afirmaciones concretas; resultados cualitativos son válidos si no hay métricas verificables. | L3; W17, W20; U02. |
| RF07 | Trayectoria cronológica con fechas, puestos y responsabilidades. | Datos coherentes con el CV; etapas enlazables y detalles relevantes disponibles al imprimir. | L4; W09, W21; U01. |
| RF08 | Descarga de CV por cada archivo efectivamente disponible. | Idioma y actualización visibles; archivo abre correctamente y no revela datos que se haya decidido excluir. | L4, L8; W22; U01. |
| RF09 | Catálogo de literatura, filosofía y ensayos con categorías diferenciadas. | Una pieza puede relacionarse con varios temas sin duplicarse como entidades independientes; secciones vacías no presentan falsos resultados. | L2; W11, W14, W15; U03. |
| RF10 | Publicación con autoría, idioma, fechas pertinentes y cuerpo legible. | Respeta estructura, versos y notas; los textos extensos tienen índice por encabezados cuando aplique. | L5; W23, W24, W27; U03. |
| RF11 | Sobre mí conecta biografía, enfoque de trabajo e intereses. | Enlaces profundizan en trayectoria y obra; no sustituye evidencia con afirmaciones genéricas. | L7; W13, W32; U01, U03. |
| RF12 | Página de contacto con correo, LinkedIn y perfiles confirmados. | Correo visible, seleccionable y copiable con confirmación accesible; todos los destinos pertenecen a los perfiles confirmados. | L8; W08, W13, W34; U07. |
| RF13 | Búsqueda textual en contenido publicado. | Consultas de referencia encuentran piezas por título y contenido; se diferencian carga, error y ausencia de resultados. | L0, L2; W05, W15; U06. |
| RF14 | Filtros iniciales por tipo/categoría, tema e idioma donde sean pertinentes. | Volver desde detalle restaura la consulta; estado vacío permite limpiar criterios. Las categorías permanecen navegables mediante HTML. | L2; W14, W15; U06. |
| RF15 | Página por término con definición, familia y relaciones. | Jerarquías sin ciclos, destinos existentes y distinción entre superior/subordinado y relacionado. | L6; W30, W31; U04. |
| RF16 | Relaciones explícitas entre proyectos, experiencia y obra. | Cada relación presenta un motivo válido; analizar un tema no se etiqueta automáticamente como experiencia implementándolo. | L3–L7; W20, W32; U04, U08. |
| RF17 | Compartir mediante URL canónica y perfiles sociales contextualizados. | Copiar enlace funciona o muestra texto seleccionable; compartir del sistema solo aparece donde esté disponible. | L0, L3, L5, L7, L8; W08, W35; U07. |
| RF18 | Metadatos por página e idioma, sitemap y navegación indexable. | Títulos y canonicals correctos, alternativas lingüísticas reales, errores con 404 y borradores fuera de salidas públicas. | L0; U08. |
| RF19 | Exportaciones públicas Markdown y JSON coherentes con HTML. | Misma entidad, idioma y estado de publicación; URLs de origen utilizables y esquema de JSON identificado. Sin campos internos. | Generación estática; U08. |
| RF20 | Datos estructurados pertinentes e índice complementario para agentes. | JSON-LD representa contenido visible; llms.txt enlaza contenido publicado. Ninguno introduce afirmaciones distintas a la fuente editorial. | Generación estática; U08. |
| RF21 | Modelo editorial validado antes de publicar. | Rechaza IDs duplicados, referencias inexistentes y jerarquías cíclicas; borradores no aparecen en HTML, índices, feeds o exportaciones. | Colecciones y build; U09. |
| RF22 | Migración de rutas con inventario y destinos específicos. | Cada URL inventariada se conserva, redirige a equivalente o tiene retirada justificada; sin redirección general de errores al inicio. | Todas las rutas; U01–U08. |
| RF23 | Preferencias visuales y navegación alternativa a funciones interactivas. | Movimiento reducido usa la alternativa estática; fallo de almacenamiento local no bloquea la página. | L0–L8; W06, W07; U01–U07. |
| RF24 | Publicación conjunta de páginas, búsqueda y formatos públicos. | Preview revisable, build reproducible y registro de versión; recuperación de una versión sana ensayada antes de producción. | Operación; U09. |

Las evidencias visuales de RF06 pueden ser imágenes y enlaces HTML en E1. El visor ampliable es una mejora posterior. Si una obra inicial requiere capítulos, E1 incluirá enlaces ordinarios anterior/siguiente e índice; el widget avanzado de series permanece en E2.

## 8. Distribución del inventario de widgets

La prioridad del inventario anterior se convierte aquí en una propuesta de entrega. Esta tabla cubre los 40 IDs sin exigir que todos se construyan en E1.

| Entrega | Widgets | Alcance |
| --- | --- | --- |
| E1 | W01–W11, W13–W15, W17, W20–W24, W27, W30–W32, W34–W35 | Navegación, idiomas, portada, escena, tarjetas, búsqueda, trayectoria, lectura básica, taxonomía, contacto y compartir. Presencia según datos y layout. |
| E1 si el volumen lo requiere | W16 | Paginación para evitar listados inabarcables. Su necesidad se decide con el inventario real. |
| E2 | W12, W18–W19, W25–W26, W28–W29, W33, W36–W39 | Recorridos, visores, lectura avanzada, series enriquecidas, citas/formatos en interfaz, grafo, repositorios, contenido social, video y RSS. |
| Opcional, fuera de E1 | W40 | Formulario, sujeto a recepción real, tratamiento de datos y prueba integral. |

W29 en E2 se refiere al control de cita y descarga dentro de la interfaz. La representación Markdown requerida por RF19 sí se genera en E1. LinkedIn, GitHub, Reddit y TikTok están presentes en E1 mediante W08 para las cuentas confirmadas, aunque sus integraciones avanzadas se pospongan.

## 9. Contenido mínimo y reglas editoriales

| Contenido | Condición para E1 |
| --- | --- |
| Presentación | Texto principal revisado y título profesional definitivo; no usar el texto de una imagen de referencia como afirmación aprobada. |
| Casos profesionales | Selección real suficiente para sustentar las capacidades destacadas. La cantidad y los casos se cierran en el inventario; si falta evidencia, se ajusta la afirmación. |
| Trayectoria y CV | Fechas, cargos, responsabilidades y datos públicos conciliados. |
| Obra | Selección inicial publicable. Si se enlaza una categoría, debe tener contenido o una explicación editorial válida, sin prometer piezas inexistentes. |
| Sobre mí | Biografía y enfoque revisados por el propietario. |
| Idiomas | Inventario por pieza y revisión de códigos, variantes, textos y caracteres. Si solo hay un idioma revisado, no simular traducciones para llenar el selector. |
| Taxonomía | Términos usados por la selección inicial, definidos y con relaciones revisadas. |
| Contacto y redes | Correo y cuentas confirmados; archivos y enlaces operativos. |
| Evidencias y recursos | Información publicable y procedencia registrada para imágenes, capturas, fuentes y modelos. |

La información proporcionada en CV, archivos de traducción o documentos anteriores se considera material de entrada que requiere conciliación editorial. Este documento no convierte automáticamente todo su contenido en información pública vigente.

## 10. Requisitos de calidad

| ID | Requisito | Verificación prevista |
| --- | --- | --- |
| RNF01 | Accesibilidad como objetivo de diseño, con referencia WCAG 2.2 AA. | Teclado, foco, nombres, contraste, zoom, lector de pantalla y movimiento reducido en recorridos representativos; herramientas automáticas como apoyo. No afirmar conformidad global por un escaneo. |
| RNF02 | HTML esencial independiente de efectos. | Desactivar JavaScript y verificar lectura, navegación, categorías y contacto; búsqueda y ajustes pueden perder interactividad. |
| RNF03 | Rendimiento con presupuestos iniciales del stack. | Objetivos: HTML/CSS/JS inicial ≤200 KB comprimidos, excluyendo fuentes e imágenes; imagen principal móvil ≤250 KB; escena diferida total ≤1.5 MB. Medir en páginas reales. |
| RNF04 | Adaptación móvil y ampliación de texto. | Sin controles recortados ni desplazamiento horizontal de la página; diagramas y tablas pueden tener desplazamiento local identificable. |
| RNF05 | Protección de información y de credenciales. | Inspección de artefactos, medios y exportaciones; campos públicos explícitos; secretos fuera de cliente y contenido. |
| RNF06 | Coherencia entre representaciones. | Comparar entidades, idioma, fechas, enlaces y estados entre HTML, búsqueda, JSON y Markdown. |
| RNF07 | Fallos externos aislados. | Simular recursos externos bloqueados, pérdida de WebGL y portapapeles/almacenamiento no disponibles. El contenido útil permanece. |
| RNF08 | Reconstrucción y recuperación. | Versiones y configuración registradas, medios respaldados y ensayo de recuperación documentado. |

Son requisitos y objetivos de la propuesta, no resultados medidos. La matriz final de navegadores y dispositivos se fijará antes de implementar las interacciones; debe incluir escritorio y móvil, y el funcionamiento básico sin WebGL.

## 11. Criterios de aceptación de la entrega

| ID | Escenario de aceptación | Evidencia |
| --- | --- | --- |
| A01 | Una persona recorre inicio → caso → trayectoria → contacto y encuentra evidencias y CV. | Registro de recorrido y revisión editorial; RF01, RF03, RF06–RF08, RF12. |
| A02 | Un lector encuentra una pieza por categoría, lee notas y sigue un tema relacionado. | Recorrido por catálogo, publicación y término; RF09–RF10, RF15–RF16. |
| A03 | Cambiar idioma conserva la pieza; la traducción ausente tiene tratamiento explícito. | Casos de traducción existente y ausente; RF02. |
| A04 | Una consulta devuelve contenido esperado y conserva filtros al volver. | Consultas acordadas por idioma publicado y estados de error/vacío; RF13–RF14. |
| A05 | La portada conserva utilidad sin 3D, con movimiento reducido y tras un fallo gráfico. | Capturas o registro en dispositivo representativo; RF04, RF23. |
| A06 | Un conjunto de relaciones puede rastrearse a contenido y evidencia pública. | Revisión de casos y grafo exportado; RF15–RF16, RF19–RF21. |
| A07 | Las URLs actuales inventariadas tienen tratamiento y las nuevas páginas metadatos correctos. | Reporte de rutas y metadatos; RF18, RF22. |
| A08 | El despliegue puede reconstruirse y recuperarse sin publicar material restringido. | Build, revisión de artefactos y ensayo de recuperación; RF21, RF24, RNF05–RNF08. |

La entrega se considera terminada cuando los RF de E1, los RNF aplicables y A01–A08 cuentan con evidencia; el contenido inicial está revisado; las decisiones bloqueantes están resueltas; y las excepciones residuales quedan documentadas. No debe haber fallos conocidos que bloqueen navegación, lectura o contacto ni exposición conocida de secretos o material restringido.

La aceptación se registra con el propietario. Crear esta especificación no autoriza por sí mismo publicar cambios en producción.

## 12. Medición del resultado

| Dimensión | Método inicial | Límite de interpretación |
| --- | --- | --- |
| Comprensión del perfil | Pedir a revisores que describan enfoque y evidencia después del recorrido. | Muestra cualitativa; no representa todo el mercado laboral. |
| Facilidad de uso | Observar completar A01–A04 y registrar bloqueos. | Un clic en contacto no demuestra que llegó un mensaje. |
| Calidad técnica | Resultados de validaciones, errores de rutas y peso por layout. | Una puntuación aislada no prueba accesibilidad o calidad total. |
| Descubrimiento | Revisar indexación y visitas si existe una herramienta de medición configurada. | No garantiza atribución completa de consultas de agentes. |
| Oportunidades | Registrar manualmente contactos pertinentes y su origen cuando se conozca. | Evitar atribuir causalidad al rediseño sin evidencia. |

No se requiere incorporar analítica de terceros en E1. Antes de fijar metas numéricas de tráfico o conversión, establecer una línea base y decidir cómo medirlas.

## 13. Dependencias y decisiones pendientes

| ID | Decisión | Responsable propuesto | Momento límite |
| --- | --- | --- | --- |
| D01 | Redacción definitiva del posicionamiento y título profesional | Propietario/editorial | Antes de cerrar portada y casos. |
| D02 | Casos, obras y evidencias de la selección inicial | Propietario/editorial | Antes de cerrar el alcance de contenido de E1. |
| D03 | Idiomas, variantes y cobertura revisada | Editorial | Antes de crear rutas y selector finales. |
| D04 | Inventario de URLs, código y configuración existentes | Desarrollo | Antes de migración y cambios de build. |
| D05 | Recursos visuales definitivos y complejidad de la escena | Diseño/desarrollo | Antes de producir recursos finales. |
| D06 | Correo, perfiles públicos y versión descargable del CV | Propietario | Antes de validar contacto y difusión. |
| D07 | Navegadores, dispositivos y excepciones de rendimiento | Desarrollo/producto | Antes de cerrar pruebas de interacción. |
| D08 | Personas responsables, capacidad y fechas | Propietario | Antes de comprometer el calendario. |
| D09 | Analítica, formulario y WebMCP | Producto/desarrollo | Solo antes de incorporar esas ampliaciones; no bloquean E1. |

Las decisiones pendientes no impiden construir la base común. Sí impiden considerar cerradas las páginas o integraciones que dependen de ellas. No se asignan fechas, presupuestos o volúmenes de contenido sin evidencia.

## 14. Entregables y gestión de cambios

**Entregables de E1:** código y contenido versionados; sitio estático con los layouts aplicables; escena y alternativa visual; índice de búsqueda; exportaciones públicas; redirecciones; configuración de compilación; evidencias de aceptación; y guía breve para actualizar contenido y recuperar una publicación.

Toda tarea de implementación debe identificar requisitos RF/RNF, layouts y widgets afectados, dependencias y evidencia de aceptación. Las tareas para agentes deben incluir datos de entrada y límites de publicación; no deben inferir experiencia, resultados profesionales o traducciones faltantes.

Los cambios de alcance registrarán descripción, motivo, requisitos afectados, esfuerzo estimado cuando pueda conocerse, riesgos, decisión y entrega prevista. La aparición de una idea en un documento visual o en el inventario no la convierte automáticamente en compromiso de E1.

## 15. Relación con los documentos del proyecto

| Documento | Función |
| --- | --- |
| Referencia del rediseño | Visión, contexto y dirección de identidad. |
| Mapa de navegación | Destinos, jerarquía y recorridos entre secciones. |
| Stack tecnológico | Implementación técnica propuesta y límites de la arquitectura. |
| Layouts, zonas y descripción de uso | Composición de páginas. |
| Widgets y mapa de ubicación | Inventario funcional reutilizable y ubicación. |
| Análisis de riesgos y remediación | Prevención, respuesta y seguimiento de riesgos R01–R24. |
| Esta especificación | Qué debe hacer el producto, qué se propone entregar primero y cómo se acepta. |

El reparto E1/E2 de este documento concreta una propuesta de entrega y no modifica automáticamente los archivos anteriores. Al aceptar el alcance, sincronizar prioridades y registrar cualquier divergencia. Las instrucciones explícitas posteriores del propietario se incorporarán a los documentos afectados.

Los siguientes documentos a desarrollar son el **modelo de contenido y taxonomía**, el **inventario y plan de migración**, el **sistema de diseño** y el **plan de implementación**. Deben detallar esta especificación conservando los identificadores para mantener trazabilidad.
