# Widgets y mapa de ubicación — Paynalton

## 1. Alcance y convenciones

Inventario propuesto de **40 widgets y componentes funcionales**, con su ubicación en los ocho layouts de página y el base compartido. Complementa `Layouts_zonas_y_uso_Paynalton.md` y conserva sus nombres de zonas. Es una especificación para diseño e implementación; no implica que los componentes ya existan.

La identidad visual es **Taller nocturno: obsidiana y cobre**, con ornamentación prehispánica discreta. El sitio continúa como HTML estático generado con Astro y alojado en Netlify.

En este documento, “widget” incluye bloques reutilizables de presentación y navegación, además de controles interactivos. Los textos narrativos y los encabezados simples siguen siendo contenido de la página, sin necesitar un widget propio. Se han consolidado las tarjetas de proyectos y publicaciones en una familia, y las rutas por interés y recorridos editoriales en otra. Se añaden componentes de apoyo como paginación, estado de resultados y salto al contenido para completar el mapa.

**Prioridad:** Alta = primera versión propuesta; Media = ampliación posterior; Opcional = decisión pendiente. **Presencia por ubicación:** O = obligatoria; C = condicional a datos o contexto; P = opcional. La prioridad de desarrollo y la presencia en una página son decisiones diferentes. Una zona obligatoria puede contener widgets condicionales y contenido HTML que la mantiene útil sin ellos.

Los widgets de **L0 se heredan en L1–L8**, sin duplicar instancias por layout. En particular, el selector de idiomas está disponible en todas las páginas, incluido el lector. Las superficies auxiliares de L0 alojan paneles y visores; sus activadores permanecen en las zonas de origen.

## 2. Inventario y mapa por widget

La última columna indica todas las ubicaciones propuestas. Las variantes de una familia comparten implementación cuando corresponda, sin forzar idéntica composición visual.

### Navegación y utilidades globales

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W01 | Salto al contenido | Alta | Permite saltar la cabecera con teclado; se hace visible al recibir foco. | L0 → Acceso directo al contenido (O) |
| W02 | Marca y acceso al inicio | Alta | Enlace de identidad al inicio del idioma actual, con nombre accesible. | L0 → Cabecera de identidad (O) |
| W03 | Navegación principal y menú móvil | Alta | Marca la sección activa. En móvil despliega las opciones; permite cerrar con Escape y devuelve el foco al botón. | L0 → Navegación principal (O); L0 → Superficies auxiliares (C) |
| W04 | Selector de idiomas | Alta | Muestra nombres propios de idiomas, sin banderas. Enlaza a la traducción equivalente; si falta, lo indica y ofrece el inicio del idioma elegido. Respeta el idioma de la URL y publica solo traducciones disponibles. | L0 → Utilidades globales (O) |
| W05 | Buscador | Alta | Comparte motor y lógica entre panel global y catálogo. Busca por texto, muestra fragmentos y expresa el alcance e idioma de la consulta. Permite abrir una página completa de resultados. | L0 → Utilidades globales (O); L0 → Superficies auxiliares (C); L2 → Búsqueda (C) |
| W06 | Migas de pan | Alta | Enlaces jerárquicos a niveles superiores; identifica la página actual. Las relaciones temáticas se presentan aparte. | L0 → Contexto de navegación (C) |
| W07 | Preferencias visuales | Alta | Respeta movimiento reducido del sistema y permite desactivar 3D. Guarda la elección localmente si es posible; sigue funcionando durante la sesión si no puede persistirla. | L0 → Pie de página (O) |
| W08 | Perfiles sociales | Alta | Enlaces con nombre y contexto a LinkedIn, GitHub, Reddit y TikTok. En Contacto prioriza LinkedIn; omite perfiles no confirmados. | L0 → Pie de página (O); L4 → Contacto (O); L7 → Perfiles y comunidad (C); L8 → Contacto profesional (O); L8 → Otros espacios (C) |

### Portada y catálogos

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W09 | Presentación profesional | Alta | Expone nombre, síntesis y enfoque; variante amplia en portada y compacta en trayectoria. El texto permanece legible sin animaciones. | L1 → Presentación principal (O); L4 → Resumen profesional (O) |
| W10 | Escena del taller WebGL | Alta | Escena con iluminación y respuesta suave al puntero; carga diferida, pausa fuera de pantalla y liberación de recursos al salir. Imagen equivalente cuando no se active 3D o falle. Ninguna navegación depende del lienzo. | L1 → Escena del taller (O) |
| W11 | Colección de tarjetas de contenido | Alta | Componente compartido para proyectos, publicaciones y resultados mixtos. Muestra título, resumen y metadatos pertinentes; variantes destacada, catálogo y compacta. Incluye el tipo en listados mixtos. | L1 → Proyectos destacados (O); L1 → Obra y publicaciones (C); L2 → Introducción editorial (P); L2 → Listado principal (O); L6 → Contenidos asociados (O) |
| W12 | Rutas por interés y recorridos editoriales | Media | Agrupa enlaces en recorridos definidos editorialmente. Explica propósito y orden cuando haya secuencia; no implica personalización automática. | L1 → Rutas por interés (P); L2 → Introducción editorial (P); L6 → Alcance y contexto (P); L7 → Puentes entre facetas (P) |
| W13 | Invitación y enlaces de continuación | Alta | Acciones contextuales para contactar, explorar o volver a una colección. Emplea enlaces descriptivos y evita repetir varias llamadas principales en una misma zona. | L1 → Presentación principal (O); L1 → Invitación a conversar (O); L3 → Siguiente paso (O); L4 → Contacto (O); L7 → Continuación (O); L8 → Invitación (O) |
| W14 | Filtros de contenido | Alta | Filtra por campos pertinentes al catálogo: categoría, tipo, tema, tecnología, competencia, sector, género o idioma. Conserva estado en URL y respeta volver/avanzar del navegador. | L2 → Filtros (C) |
| W15 | Resumen de resultados y estado vacío | Alta | Muestra cantidad, filtros activos y acción para limpiarlos. Sin coincidencias ofrece ampliar criterios. Distingue ausencia de resultados de un error de carga del índice. | L2 → Estado de resultados (O); L2 → Estado vacío (C) |
| W16 | Paginación | Media | Divide listados grandes mediante controles explícitos. Conserva filtros y consulta; ofrece páginas estáticas enlazadas en los archivos editoriales. | L2 → Continuación del listado (C) |

### Proyectos y trayectoria

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W17 | Ficha de participación en proyecto | Alta | Resume rol, periodo, alcance y responsabilidades. Forma parte del caso de estudio; no repite todo su contenido narrativo. | L3 → Ficha de participación (O) |
| W18 | Galería y visor de evidencias | Media | Miniaturas enlazadas a recursos ampliables con pie y descripción. El visor permite teclado, cierre y retorno de foco. Sin visor, los recursos siguen siendo accesibles mediante enlaces. | L3 → Evidencias (C); L0 → Superficies auxiliares (C) |
| W19 | Visor de arquitectura | Media | Presenta diagramas con ampliación y anotaciones opcionales; incluye explicación textual y enlace al recurso completo. Reutiliza el visor de evidencias para ampliar. | L3 → Arquitectura y proceso (C) |
| W20 | Competencias con evidencia | Alta | Enlaza cada competencia a proyectos o experiencia que la sustentan. No usa porcentajes arbitrarios ni interpreta una reflexión temática como experiencia de implementación. | L3 → Tecnologías y competencias (O); L4 → Competencias transversales (C); L6 → Evidencia profesional (C); L7 → Forma de trabajar (P) |
| W21 | Línea de tiempo y etapas | Alta | Cronología vertical con fechas y puestos visibles. Los detalles se pueden desplegar y enlazar directamente. La impresión incluye los detalles relevantes aunque estén contraídos. | L4 → Cronología (O); L4 → Detalle de cada etapa (O) |
| W22 | Descarga de CV | Alta | Ofrece los PDF disponibles indicando idioma y fecha de actualización. No muestra botones para archivos inexistentes. | L4 → Acceso al CV (O); L8 → Recursos profesionales (C) |

### Obra y lectura

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W23 | Ficha editorial de obra | Alta | Presenta título, autoría, fechas, idioma, género y sinopsis. Variante breve para ensayo y ampliada para portada de obra extensa. | L5 → Cabecera editorial (O); L5 → Presentación de la obra (C) |
| W24 | Índice del texto | Alta | Enlaces a encabezados con anclas estables; resalta la sección visible como mejora progresiva. En móvil puede plegarse. Se reserva a textos con estructura suficiente. | L5 → Índice (C) |
| W25 | Preferencias de lectura | Media | Ajusta tamaño de letra, ancho y tema del lector. Conserva preferencias localmente y permite restablecerlas; no cambia el tema del resto del sitio. | L5 → Utilidades de lectura (P) |
| W26 | Progreso y continuación de lectura | Media | Indica avance y ofrece retomar posición guardada en este navegador por obra, capítulo e idioma. Permite reiniciar; no promete sincronización entre dispositivos. | L5 → Utilidades de lectura (P) |
| W27 | Notas y referencias | Alta | Enlaces de ida y vuelta entre llamadas y notas. Puede ampliar notas en el margen o en un panel; la referencia completa sigue disponible en el documento. | L5 → Notas y referencias (C) |
| W28 | Serie y capítulos | Media | Índice de capítulos y controles anterior/siguiente con títulos. Señala capítulo actual y distingue entregas publicadas de pendientes; estas últimas no se enlazan como si existieran. | L5 → Índice (C); L5 → Continuidad (C) |
| W29 | Cita y formatos alternativos | Media | Permite copiar referencia con autor, título, fecha y URL canónica, y descargar formatos publicados como Markdown o PDF. Confirma copia y ofrece texto seleccionable si falla. | L5 → Cita, descarga y difusión (C) |

### Taxonomía y exploración

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W30 | Etiquetas temáticas | Alta | Enlaces a páginas de términos. Diferencia tecnologías, competencias, temas, sectores y géneros mediante etiquetas comprensibles, además del color. | L2 → Listado principal (C); L3 → Tecnologías y competencias (O); L5 → Temas y lecturas relacionadas (C); L6 → Contenidos asociados (C) |
| W31 | Ficha de término y jerarquía | Alta | Muestra definición, tipo, alcance, sinónimos y términos superiores/subordinados cuando existan. Conserva enlaces HTML explícitos. | L6 → Identidad del término (O); L6 → Alcance y contexto (C); L6 → Jerarquía (C) |
| W32 | Contenidos y términos relacionados | Alta | Presenta enlaces con razón explícita: usa, demuestra, analiza, documenta o amplía. Separa relación jerárquica de asociación temática; respeta categorías y páginas canónicas. | L3 → Recursos y relaciones (C); L4 → Evidencias vinculadas (C); L5 → Temas y lecturas relacionadas (C); L6 → Relaciones semánticas (C); L7 → Literatura y pensamiento (C); L7 → Puentes entre facetas (P) |
| W33 | Explorador de conexiones | Media | Lista navegable de relaciones y grafo opcional. Seleccionar nodo muestra descripción y enlaces. Teclado y lista ofrecen una alternativa completa al arrastre o zoom. | L2 → Introducción editorial (P); L6 → Exploración de conexiones (P) |

### Contacto y redes

| ID | Widget | Prioridad | Comportamiento | Layout → zona (presencia) |
| --- | --- | --- | --- | --- |
| W34 | Panel de contacto | Alta | Muestra correo, acción para copiar y enlace al cliente de correo. Confirma copia de forma accesible; mantiene el texto seleccionable si el permiso de portapapeles falla. | L8 → Canal principal (O) |
| W35 | Compartir contenido | Alta | Permite copiar URL canónica y usar compartir del sistema si está disponible. Enlaces externos compatibles se añaden tras validar la integración. Si falla, muestra el enlace seleccionable. | L3 → Recursos y relaciones (C); L5 → Cita, descarga y difusión (C) |
| W36 | Repositorios destacados | Media | Tarjetas de repositorios seleccionados con enlace y fecha de actualización. Datos capturados en compilación; conserva una copia válida ante fallos de actualización. Nunca incluye credenciales en cliente. | L3 → Recursos y relaciones (C); L7 → Perfiles y comunidad (C) |
| W37 | Publicaciones sociales seleccionadas | Media | Tarjetas editoriales de LinkedIn, Reddit o TikTok con descripción y enlace original. Permiten descubrir publicaciones sin depender de un feed en vivo. | L3 → Recursos y relaciones (C); L5 → Temas y lecturas relacionadas (C); L7 → Perfiles y comunidad (C) |
| W38 | Video bajo demanda | Media | Portada y botón de reproducción; carga el reproductor externo tras interacción. Incluye resumen o transcripción y enlace al original si el reproductor falla. | L3 → Evidencias (C); L5 → Cuerpo principal (C) |
| W39 | Suscripción RSS | Media | Enlace al feed y acción para copiar su dirección; puede ofrecer feeds por idioma o categoría cuando existan. No implica una suscripción por correo. | L0 → Pie de página (C); L5 → Cita, descarga y difusión (C) |
| W40 | Formulario de contacto | Opcional | Se habilita solo con receptor configurado. Etiquetas y validación por campo, estados de envío, éxito y error; conserva datos tras fallar y ofrece el correo como alternativa. | L8 → Formulario (P) |

## 3. Mapa inverso: layouts, zonas y widgets

Las tablas siguen el orden de zonas del documento de layouts. **Contenido editorial** indica que esa zona no necesita un widget específico. Los IDs permiten localizar el comportamiento en el inventario anterior.

### L0 — Base compartido

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Acceso directo al contenido | W01 Salto al contenido (O) | Según contenido y variante de página. |
| Cabecera de identidad | W02 Marca y acceso al inicio (O) | Según contenido y variante de página. |
| Navegación principal | W03 Navegación principal y menú móvil (O) | Según contenido y variante de página. |
| Utilidades globales | W04 Selector de idiomas (O); W05 Buscador (O) | Selector de idiomas y activador del buscador; en móvil permanecen accesibles dentro de la cabecera o su menú. |
| Contexto de navegación | W06 Migas de pan (C) | Según contenido y variante de página. |
| Área principal | Contenido editorial | Aloja L1–L8 o el cuerpo sencillo de páginas auxiliares; no es una instancia de widget. |
| Pie de página | W07 Preferencias visuales (O); W08 Perfiles sociales (O); W39 Suscripción RSS (C) | Según contenido y variante de página. |
| Superficies auxiliares | W03 Navegación principal y menú móvil (C); W05 Buscador (C); W18 Galería y visor de evidencias (C) | Solo se monta el panel o visor requerido por una interacción; no es una segunda navegación ni una segunda galería. |

### L1 — Portada

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Presentación principal | W09 Presentación profesional (O); W13 Invitación y enlaces de continuación (O) | Según contenido y variante de página. |
| Escena del taller | W10 Escena del taller WebGL (O) | La zona visual existe siempre; la ejecución de WebGL es condicional y tiene alternativa estática. |
| Proyectos destacados | W11 Colección de tarjetas de contenido (O) | Según contenido y variante de página. |
| Rutas por interés | W12 Rutas por interés y recorridos editoriales (P) | Según contenido y variante de página. |
| Obra y publicaciones | W11 Colección de tarjetas de contenido (C) | W11 en variante de publicaciones recientes o selección editorial. |
| Síntesis personal | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Invitación a conversar | W13 Invitación y enlaces de continuación (O) | Según contenido y variante de página. |

### L2 — Catálogo

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Encabezado de colección | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Introducción editorial | W11 Colección de tarjetas de contenido (P); W12 Rutas por interés y recorridos editoriales (P); W33 Explorador de conexiones (P) | En Explorar puede alojar recorridos o el explorador de conexiones; no es necesario mostrar las tres opciones a la vez. |
| Búsqueda | W05 Buscador (C) | Según contenido y variante de página. |
| Filtros | W14 Filtros de contenido (C) | Según contenido y variante de página. |
| Estado de resultados | W15 Resumen de resultados y estado vacío (O) | Según contenido y variante de página. |
| Listado principal | W11 Colección de tarjetas de contenido (O); W30 Etiquetas temáticas (C) | W30 se integra dentro de las tarjetas de W11; no crea un listado paralelo. |
| Continuación del listado | W16 Paginación (C) | Según contenido y variante de página. |
| Estado vacío | W15 Resumen de resultados y estado vacío (C) | Según contenido y variante de página. |

### L3 — Caso de estudio

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Encabezado del proyecto | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Ficha de participación | W17 Ficha de participación en proyecto (O) | Según contenido y variante de página. |
| Contexto y problema | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Decisiones y solución | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Arquitectura y proceso | W19 Visor de arquitectura (C) | Según contenido y variante de página. |
| Evidencias | W18 Galería y visor de evidencias (C); W38 Video bajo demanda (C) | Según contenido y variante de página. |
| Resultados y aprendizajes | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Tecnologías y competencias | W20 Competencias con evidencia (O); W30 Etiquetas temáticas (O) | W20 presenta evidencias; W30 enlaza términos. Evitar duplicar las mismas etiquetas. |
| Recursos y relaciones | W32 Contenidos y términos relacionados (C); W35 Compartir contenido (C); W36 Repositorios destacados (C); W37 Publicaciones sociales seleccionadas (C) | Según contenido y variante de página. |
| Siguiente paso | W13 Invitación y enlaces de continuación (O) | Según contenido y variante de página. |

### L4 — Trayectoria

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Resumen profesional | W09 Presentación profesional (O) | Según contenido y variante de página. |
| Acceso al CV | W22 Descarga de CV (O) | Según contenido y variante de página. |
| Cronología | W21 Línea de tiempo y etapas (O) | Según contenido y variante de página. |
| Detalle de cada etapa | W21 Línea de tiempo y etapas (O) | Subzona repetida de W21 para cada puesto o periodo, no una segunda línea de tiempo. |
| Evidencias vinculadas | W32 Contenidos y términos relacionados (C) | Según contenido y variante de página. |
| Competencias transversales | W20 Competencias con evidencia (C) | Según contenido y variante de página. |
| Formación | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Contacto | W08 Perfiles sociales (O); W13 Invitación y enlaces de continuación (O) | Según contenido y variante de página. |

### L5 — Publicación y lectura

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Cabecera editorial | W23 Ficha editorial de obra (O) | Según contenido y variante de página. |
| Presentación de la obra | W23 Ficha editorial de obra (C) | Según contenido y variante de página. |
| Utilidades de lectura | W25 Preferencias de lectura (P); W26 Progreso y continuación de lectura (P) | Según contenido y variante de página. |
| Índice | W24 Índice del texto (C); W28 Serie y capítulos (C) | W24 para encabezados y W28 para capítulos; si conviven, identificarlos como dos niveles distintos. |
| Cuerpo principal | W38 Video bajo demanda (C) | El texto editorial es la base; W38 solo se inserta cuando exista un video pertinente. |
| Notas y referencias | W27 Notas y referencias (C) | Según contenido y variante de página. |
| Continuidad | W28 Serie y capítulos (C) | Según contenido y variante de página. |
| Cita, descarga y difusión | W29 Cita y formatos alternativos (C); W35 Compartir contenido (C); W39 Suscripción RSS (C) | Según contenido y variante de página. |
| Temas y lecturas relacionadas | W30 Etiquetas temáticas (C); W32 Contenidos y términos relacionados (C); W37 Publicaciones sociales seleccionadas (C) | Según contenido y variante de página. |

### L6 — Tema taxonómico

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Identidad del término | W31 Ficha de término y jerarquía (O) | Según contenido y variante de página. |
| Alcance y contexto | W12 Rutas por interés y recorridos editoriales (P); W31 Ficha de término y jerarquía (C) | Según contenido y variante de página. |
| Jerarquía | W31 Ficha de término y jerarquía (C) | Según contenido y variante de página. |
| Relaciones semánticas | W32 Contenidos y términos relacionados (C) | Según contenido y variante de página. |
| Contenidos asociados | W11 Colección de tarjetas de contenido (O); W30 Etiquetas temáticas (C) | W11 agrupa por tipo de contenido; W30 puede aparecer dentro de cada tarjeta. |
| Evidencia profesional | W20 Competencias con evidencia (C) | Según contenido y variante de página. |
| Exploración de conexiones | W33 Explorador de conexiones (P) | Según contenido y variante de página. |

### L7 — Perfil personal

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Identidad | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Biografía | Contenido editorial | Texto, encabezados o recursos propios de la página, publicados como HTML. |
| Forma de trabajar | W20 Competencias con evidencia (P) | El texto es obligatorio; W20 es un refuerzo opcional con evidencias enlazadas. |
| Literatura y pensamiento | W32 Contenidos y términos relacionados (C) | Según contenido y variante de página. |
| Puentes entre facetas | W12 Rutas por interés y recorridos editoriales (P); W32 Contenidos y términos relacionados (P) | Según contenido y variante de página. |
| Perfiles y comunidad | W08 Perfiles sociales (C); W36 Repositorios destacados (C); W37 Publicaciones sociales seleccionadas (C) | Según contenido y variante de página. |
| Continuación | W13 Invitación y enlaces de continuación (O) | Según contenido y variante de página. |

### L8 — Contacto

Incluye además todos los elementos globales aplicables de L0.

| Zona | Widgets y presencia | Uso en esta ubicación |
| --- | --- | --- |
| Invitación | W13 Invitación y enlaces de continuación (O) | Mensaje de colaboración y acciones breves; el correo detallado se concentra en Canal principal. |
| Canal principal | W34 Panel de contacto (O) | Según contenido y variante de página. |
| Contacto profesional | W08 Perfiles sociales (O) | Según contenido y variante de página. |
| Otros espacios | W08 Perfiles sociales (C) | Según contenido y variante de página. |
| Recursos profesionales | W22 Descarga de CV (C) | Según contenido y variante de página. |
| Formulario | W40 Formulario de contacto (P) | No se publica un formulario funcional hasta definir y configurar la recepción. |

## 4. Reglas de integración y estados

| Familia | Regla de implementación y alternativa |
| --- | --- |
| Idiomas | Enlaces HTML a traducciones publicadas. La ausencia de traducción se comunica antes de ofrecer otro destino. No usar traducción automática como si fuera contenido editorial aprobado. |
| Búsqueda y filtros | El panel global y la página de resultados comparten lógica. La URL guarda consulta y filtros; las categorías y archivos enlazados siguen disponibles sin JavaScript. |
| Listados | W11 es el contenedor reutilizable de tarjetas; W15 informa el estado y W16 gestiona la continuación. Evitar mostrar un resultado vacío mientras aún carga la búsqueda. |
| Lectura | W25 y W26 comparten un panel discreto. La posición se guarda localmente por contenido e idioma; el almacenamiento es opcional y no bloquea la lectura. |
| Visores | W18 y W19 pueden compartir superficie de ampliación. Gestionar foco, Escape, cierre y retorno al activador. Mantener enlace al archivo y descripción textual. |
| Redes | W08 enlaza perfiles; W37 enlaza publicaciones seleccionadas; W35 comparte contenido del sitio. Son funciones distintas. TikTok se integra por enlaces y, cuando proceda, W38. |
| Datos de GitHub | Actualización durante compilación y fecha visible. Mantener una copia válida si falla la actualización; omitir métricas no disponibles. |
| Multimedia | Portada y descripción desde HTML; reproductor externo bajo demanda. Evitar carga simultánea de feeds y videos al entrar a una página. |
| Taxonomía | W30 enlaza términos, W31 los define, W32 muestra relaciones explícitas y W33 permite recorrerlas. Todos parten de los mismos datos editoriales. |
| Contacto | Copiar correo y abrir el cliente de correo funcionan sin backend propio. El formulario requiere recepción configurada y manejo real de errores. |
| Copiar y compartir | Confirmación accesible; enlace o texto seleccionable cuando la función del navegador no esté disponible. |
| Contenido ausente | Omitir componentes condicionales sin huecos; evitar botones deshabilitados para recursos inexistentes. Explicar las ausencias relevantes, como traducciones o errores de búsqueda. |

## 5. Adaptación visual y accesibilidad

- Usar controles reconocibles y etiquetas claras. Reservar las grecas, relieves y adornos para bordes, separadores y acentos; no sustituir texto funcional por símbolos ambiguos.
- En móvil, apilar zonas según el orden de lectura, plegar filtros e índices extensos y mantener a mano el selector de idiomas. Evitar paneles anidados.
- Garantizar teclado, foco visible y nombres accesibles. No depender solo del color, del puntero o de arrastrar un grafo.
- Respetar movimiento reducido. La imagen alternativa de W10 debe conservar la composición sin impedir leer la presentación.
- Los widgets globales se instancian una vez. Las variantes móviles y de escritorio evitan IDs duplicados y controles ocultos que sigan recibiendo foco.
- El contenido principal, las categorías y las relaciones se publican como HTML legible. Los datos estructurados y las exportaciones para agentes acompañan ese contenido, pero no son widgets visuales ni necesitan una zona de pantalla.
- No incluir un chatbot, un feed social en tiempo real ni un sistema de cuentas como requisito de estos widgets.

## 6. Secuencia propuesta de implementación

1. **Estructura común:** navegación, selector de idiomas, migas de pan, preferencias visuales y accesos sociales.
2. **Contenido y navegación entre páginas:** tarjetas, fichas profesionales y editoriales, cronología, etiquetas, relaciones y descarga de CV.
3. **Localización de contenidos:** buscador, filtros, estado de resultados y paginación cuando el volumen la justifique.
4. **Identidad visual:** composición estática del taller y escena WebGL con sus alternativas y límites de movimiento.
5. **Ampliaciones de lectura y exploración:** preferencias, progreso, visores, grafo, formatos alternativos, RSS y contenido social seleccionado.
6. **Formulario, si se incorpora:** configurar recepción antes de publicar sus controles.

## 7. Comprobaciones de aceptación

- Cada widget tiene una ubicación concreta y cada zona del mapa aparece en el documento de layouts.
- El selector de idiomas está presente por herencia en L1–L8 y tiene un estado definido para traducciones ausentes.
- Los widgets reutilizados mantienen comportamiento consistente y datos comunes, aunque cambie su presentación.
- Navegación, lectura y enlaces esenciales siguen siendo utilizables sin cargar WebGL, reproductores o paneles interactivos.
- Los listados diferencian carga, error y cero resultados; copiar, compartir y contactar tienen alternativas explícitas.
- Las relaciones distinguen experiencia demostrada, uso de tecnologías y reflexión sobre un tema.
