# Layouts, zonas y descripción de uso — Paynalton

## Propósito

Este documento define la estructura de páginas para el rediseño de paynalton.tech, con la dirección visual **Taller nocturno: obsidiana y cobre**, adornos prehispánicos discretos y una experiencia que reúne desarrollo fullstack, IA aplicada, arquitectura, liderazgo y creación literaria.

La propuesta comprende **ocho layouts de página y un layout base compartido**. Es una especificación de diseño para implementar en Astro sobre el sitio estático alojado en Netlify; no describe código ya implementado. Las rutas indicadas son ejemplos conceptuales, sujetos a la convención final de idiomas y navegación.

Un layout determina la composición y el orden de las zonas. Los widgets son componentes reutilizables dentro de esas zonas. Idiomas, categorías y variantes de contenido no requieren duplicar layouts.

## 1. Inventario

| ID | Layout | Uso principal | Composición |
| --- | --- | --- | --- |
| L0 | Base compartido | Todas las páginas | Cabecera, utilidades, área principal y pie. |
| L1 | Portada | Inicio | Presentación, escena WebGL y selección editorial. |
| L2 | Catálogo | Proyectos, Obra y pensamiento, Explorar y resultados de búsqueda | Introducción, búsqueda, filtros y listado. |
| L3 | Caso de estudio | Detalle de proyecto | Problema, participación, decisiones, solución y evidencias. |
| L4 | Trayectoria | Experiencia profesional | Resumen, cronología y competencias demostradas. |
| L5 | Publicación y lectura | Ensayos, filosofía, literatura y capítulos | Cabecera editorial, lectura, notas y continuidad. |
| L6 | Tema taxonómico | Tecnologías, competencias, temas, sectores y géneros | Definición, relaciones y contenidos asociados. |
| L7 | Perfil personal | Sobre mí | Identidad, biografía, enfoque e intereses. |
| L8 | Contacto | Contacto y colaboración | Intención de contacto, canales y recursos. |

En las tablas siguientes, **obligatoria** significa que la zona forma parte del layout; **condicional** significa que aparece cuando existen datos o una función aplicable; **opcional** significa que depende de una decisión editorial. Las zonas sin contenido se omiten sin dejar espacios vacíos.

## 2. L0 — Base compartido

**Uso:** envolver todos los layouts y resolver la estructura común del sitio. Las páginas auxiliares pueden utilizarlo directamente con un cuerpo sencillo.

| Zona | Presencia | Contenido y comportamiento |
| --- | --- | --- |
| Acceso directo al contenido | Obligatoria | Enlace visible al recibir foco que permite saltar la navegación. |
| Cabecera de identidad | Obligatoria | Marca Paynalton enlazada al inicio y navegación principal. Indica la sección activa. |
| Navegación principal | Obligatoria | Proyectos, Trayectoria, Obra y pensamiento, Sobre mí y Contacto. Se transforma en un menú desplegable en móvil. |
| Utilidades globales | Obligatoria | Selector de idiomas y acceso al buscador. Las preferencias visuales pueden ubicarse aquí o en el pie. |
| Contexto de navegación | Condicional | Migas de pan en páginas interiores. Expresan jerarquía; las etiquetas temáticas se muestran en su propia zona. |
| Área principal | Obligatoria | Recibe la composición del layout de página. Mantiene un único contenido principal y un título principal visible. |
| Pie de página | Obligatoria | Enlaces sociales identificados, contacto, navegación secundaria y preferencias de movimiento. RSS y páginas informativas cuando existan. |
| Superficies auxiliares | Condicional | Panel de búsqueda, menú móvil o visor de imágenes. Se abren mediante controles explícitos y gestionan correctamente el foco. |

### Selector de idiomas

- Mostrar el idioma actual y los disponibles mediante sus nombres propios, sin banderas.
- Enlazar a la traducción equivalente de la página cuando exista, conservando el contexto del contenido.
- Si no existe traducción, indicarlo y ofrecer el inicio del idioma elegido; evitar un salto silencioso a otra página.
- Utilizar URLs propias por idioma y mantener enlaces utilizables sin JavaScript.
- Recordar la preferencia localmente como mejora opcional, respetando siempre el idioma de la URL abierta.
- Publicar únicamente idiomas y traducciones realmente disponibles. La lista definitiva de idiomas queda pendiente del inventario de contenido.

**Adaptación:** cabecera horizontal en pantallas amplias; menú desplegable en pantallas pequeñas. Los controles deben mantener etiquetas comprensibles y áreas de interacción cómodas. La cabecera no debe ocultar títulos o destinos de enlaces internos.

## 3. L1 — Portada

**Uso:** presentar la propuesta profesional y personal, y dirigir a distintas rutas de exploración. Corresponde al inicio de cada idioma.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Presentación principal | Obligatoria | Nombre, síntesis del perfil y accesos a proyectos y contacto. El texto comunica experiencia y enfoque con afirmaciones sustentables. |
| 2 | Escena del taller | Obligatoria como zona visual | Escultura o composición WebGL con iluminación y ornamentación discreta. Incluye una imagen alternativa que ocupa la misma zona. |
| 3 | Proyectos destacados | Obligatoria | Selección de casos representativos, con problema, aportación y resultado resumidos. |
| 4 | Rutas por interés | Opcional | Entradas a Desarrollo e IA, Arquitectura y liderazgo, y Literatura y pensamiento. |
| 5 | Obra y publicaciones | Condicional | Selección editorial o publicaciones recientes con categoría, fecha e idioma. |
| 6 | Síntesis personal | Opcional | Introducción breve a la faceta humana y enlace a Sobre mí. |
| 7 | Invitación a conversar | Obligatoria | Cierre breve con enlace a Contacto y contexto de colaboración. |

**Composición:** la presentación y la escena pueden compartir la primera franja en dos columnas. En móvil, el mensaje y las acciones preceden a la escena. Los proyectos se presentan como una selección legible, sin carrusel automático.

**Comportamiento:** la escena se carga después del contenido esencial, se pausa fuera de pantalla y respeta movimiento reducido y la preferencia de desactivar 3D. Ninguna acción necesaria depende de interactuar con WebGL.

## 4. L2 — Catálogo

**Uso:** reunir y localizar contenidos. Se reutiliza para Proyectos, Obra y pensamiento, Explorar y búsqueda, variando filtros y tipos de tarjeta.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Encabezado de colección | Obligatoria | Título y explicación breve del contenido disponible. |
| 2 | Introducción editorial | Opcional | Selección o texto destacado propio de la sección. Se omite en resultados de búsqueda cuando distraiga de la consulta. |
| 3 | Búsqueda | Condicional | Consulta de texto global o limitada a la colección, indicando claramente su alcance. |
| 4 | Filtros | Condicional | Categoría, tema, tecnología, competencia, sector, género o idioma según el catálogo. |
| 5 | Estado de resultados | Obligatoria | Número de resultados, filtros activos y acción para limpiar la selección. Ordenación cuando aporte valor. |
| 6 | Listado principal | Obligatoria | Tarjetas o filas con título, resumen, tipo y metadatos relevantes. |
| 7 | Continuación del listado | Condicional | Paginación o navegación de archivo cuando el volumen lo requiera. |
| 8 | Estado vacío | Condicional | Explicación cuando no hay coincidencias y opciones para ampliar la búsqueda o limpiar filtros. |

### Variantes

| Catálogo | Contenido de las tarjetas | Filtros principales |
| --- | --- | --- |
| Proyectos | Problema, rol, aportación, tecnologías y resultado resumido. | Competencia, tecnología, sector y participación. |
| Obra y pensamiento | Título, sinopsis, categoría, género, fecha e idioma. | Categoría editorial, tema, género e idioma. |
| Explorar | Tipo de contenido claramente identificado y motivo de relevancia. | Tipo, tema, competencia y tecnología. |
| Búsqueda | Título, fragmento coincidente y tipo de contenido. | Idioma, tipo y tema cuando estén disponibles. |

**Adaptación:** filtros laterales o en una franja superior en escritorio; panel desplegable en móvil. Mantener visibles el resumen de filtros y la cantidad de resultados.

**Comportamiento:** representar consulta y filtros en la URL para compartir la vista y recuperar el estado al volver desde un detalle. Ofrecer enlaces a categorías y listados estáticos como alternativa cuando la búsqueda interactiva no esté disponible.

## 5. L3 — Caso de estudio

**Uso:** demostrar capacidades mediante un proyecto concreto. Ruta conceptual: `/proyectos/{slug}/`.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Encabezado del proyecto | Obligatoria | Título, resumen y representación visual si existe. |
| 2 | Ficha de participación | Obligatoria | Rol, periodo, alcance, responsabilidades y contexto del equipo con datos publicables. |
| 3 | Contexto y problema | Obligatoria | Necesidad que originó el proyecto y restricciones relevantes. |
| 4 | Decisiones y solución | Obligatoria | Alternativas, decisiones técnicas y organizativas, y explicación de la solución. |
| 5 | Arquitectura y proceso | Condicional | Diagramas, flujos, planeación y coordinación que ayuden a entender el trabajo. |
| 6 | Evidencias | Condicional | Capturas, demostraciones, documentación o repositorios disponibles. |
| 7 | Resultados y aprendizajes | Obligatoria | Resultados verificables y lecciones. Usar descripciones cualitativas cuando no existan métricas publicables. |
| 8 | Tecnologías y competencias | Obligatoria | Etiquetas enlazadas a sus páginas taxonómicas y asociadas a evidencias del caso. |
| 9 | Recursos y relaciones | Condicional | Enlaces externos, experiencia laboral vinculada, artículos relacionados y acción de compartir. |
| 10 | Siguiente paso | Obligatoria | Volver a proyectos, explorar un caso relacionado o contactar. |

**Composición:** lectura principal con ficha o índice lateral en escritorio. En móvil, colocar la ficha antes del cuerpo y plegar el índice si es extenso.

**Comportamiento:** ampliar evidencias sin perder el contexto; ofrecer explicación textual de diagramas. Distinguir IA utilizada como ayuda de desarrollo de IA incorporada en la solución entregada. Omitir datos confidenciales y evitar métricas inventadas.

## 6. L4 — Trayectoria

**Uso:** exponer la evolución profesional, el alcance de las responsabilidades y la relación entre experiencia y proyectos.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Resumen profesional | Obligatoria | Síntesis de experiencia, enfoque actual y ámbitos de responsabilidad. |
| 2 | Acceso al CV | Obligatoria | Descarga del documento disponible, indicando idioma y fecha de actualización. |
| 3 | Cronología | Obligatoria | Etapas ordenadas por fecha, con organización, puesto y periodo visibles. |
| 4 | Detalle de cada etapa | Obligatoria | Responsabilidades, alcance, logros y contexto del equipo. Puede desplegarse por etapa. |
| 5 | Evidencias vinculadas | Condicional | Proyectos y publicaciones que documentan la experiencia descrita. |
| 6 | Competencias transversales | Condicional | Arquitectura, liderazgo, planeación, control de proyectos y desarrollo, enlazados a evidencias. |
| 7 | Formación | Condicional | Estudios, formación complementaria y certificaciones que puedan documentarse. |
| 8 | Contacto | Obligatoria | Acceso a conversación profesional y al perfil de LinkedIn. |

**Composición:** cronología preferentemente vertical. En móvil se mantiene una sola columna, evitando alternar bloques a izquierda y derecha.

**Comportamiento:** los títulos y las fechas permanecen visibles aunque se contraigan detalles. Permitir enlaces directos a cada etapa. La versión impresa debe incluir la información profesional relevante sin depender de abrir controles manualmente.

## 7. L5 — Publicación y lectura

**Uso:** publicar ensayos, reflexiones filosóficas, literatura y capítulos. Puede servir como ficha de una obra extensa con sinopsis e índice, o como lector de su texto completo.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Cabecera editorial | Obligatoria | Título, autoría, categoría, idioma y fechas pertinentes. |
| 2 | Presentación de la obra | Condicional | Sinopsis, epígrafe, portada o contexto de publicación. |
| 3 | Utilidades de lectura | Opcional | Tamaño de letra, ancho de columna, tema de lectura y progreso. |
| 4 | Índice | Condicional | Encabezados del texto o capítulos publicados de una obra. |
| 5 | Cuerpo principal | Obligatoria | Texto completo, capítulo o sinopsis con acceso a las partes, según la variante. |
| 6 | Notas y referencias | Condicional | Notas al pie, bibliografía y fuentes, con enlaces de ida y vuelta. |
| 7 | Continuidad | Condicional | Capítulo anterior y siguiente, posición dentro de la serie y acceso al índice general. |
| 8 | Cita, descarga y difusión | Condicional | Referencia copiable, formatos disponibles, compartir y suscripción RSS. |
| 9 | Temas y lecturas relacionadas | Condicional | Etiquetas y relaciones editoriales explicadas. |

### Variantes de lectura

| Variante | Ajustes |
| --- | --- |
| Ensayo o filosofía | Índice por encabezados, notas, citas y referencias. |
| Narrativa breve | Prioridad al texto continuo; utilidades discretas. |
| Poesía | Respeto de versos, estrofas y espaciado significativo; evitar justificar el texto. |
| Obra extensa | Sinopsis e índice en la entrada de obra; páginas de capítulos con continuidad. |

**Composición:** columna central de lectura y ancho moderado; índice lateral cuando haya espacio. El tema del lector puede aclarar el fondo conservando la identidad del sitio.

**Comportamiento:** guardar preferencias y posición de lectura en el navegador cuando se habiliten. Mantener el texto accesible en HTML. Las notas emergentes, si existen, complementan las notas enlazadas del documento. El selector global de idiomas continúa disponible.

## 8. L6 — Tema taxonómico

**Uso:** explicar un término y reunir contenidos asociados sin alterar sus categorías editoriales. Ruta conceptual: `/temas/{slug}/`.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Identidad del término | Obligatoria | Nombre, tipo de término y definición breve. |
| 2 | Alcance y contexto | Condicional | Explicación de cómo se utiliza el concepto en el sitio y posibles nombres alternativos. |
| 3 | Jerarquía | Condicional | Términos superiores y subordinados, claramente diferenciados. |
| 4 | Relaciones semánticas | Condicional | Términos relacionados y explicación de la relación cuando proceda. |
| 5 | Contenidos asociados | Obligatoria | Proyectos, experiencia y publicaciones agrupados por tipo, con cantidad y enlaces. |
| 6 | Evidencia profesional | Condicional | Selección de casos que demuestran una tecnología o competencia. |
| 7 | Exploración de conexiones | Opcional | Grafo interactivo acompañado de una lista de enlaces equivalente. |

**Composición:** definición y contexto en la parte superior; relaciones en una columna auxiliar y contenidos agrupados en el área principal. En móvil, definición, relaciones y resultados siguen un orden lineal.

**Comportamiento:** diferenciar «usa», «demuestra», «analiza» y otras relaciones pertinentes. Un ensayo que analiza IA no constituye por sí mismo evidencia de experiencia implementándola. Cada contenido conserva una página canónica aunque se relacione con varios términos.

## 9. L7 — Perfil personal

**Uso:** presentar a la persona detrás de la experiencia profesional y conectar su trabajo con literatura, filosofía y otros intereses.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Identidad | Obligatoria | Nombre, alias y presentación breve. Retrato o recurso visual opcional. |
| 2 | Biografía | Obligatoria | Relato personal y profesional con la profundidad adecuada para el sitio público. |
| 3 | Forma de trabajar | Obligatoria | Enfoque de resolución de problemas, colaboración, arquitectura y liderazgo. |
| 4 | Literatura y pensamiento | Condicional | Motivaciones e intereses conectados con obras o ensayos publicados. |
| 5 | Puentes entre facetas | Opcional | Selección de contenidos que relacionan tecnología, creación y reflexión. |
| 6 | Perfiles y comunidad | Condicional | Perfiles sociales y participaciones públicas seleccionadas. |
| 7 | Continuación | Obligatoria | Accesos a Trayectoria, Obra y pensamiento y Contacto. |

**Composición:** alternancia editorial de texto y elementos visuales, con pocos bloques y una jerarquía clara. En móvil, seguir el orden narrativo sin reordenamientos que alteren el sentido.

**Comportamiento:** los vínculos deben conducir a contenidos concretos que profundicen en cada faceta. Reservar el detalle cronológico laboral para Trayectoria y evitar repetir el CV completo.

## 10. L8 — Contacto

**Uso:** facilitar una conversación profesional o creativa mediante canales claros y disponibles.

| Orden | Zona | Presencia | Descripción de uso |
| --- | --- | --- | --- |
| 1 | Invitación | Obligatoria | Mensaje breve sobre los temas y tipos de colaboración de interés. |
| 2 | Canal principal | Obligatoria | Correo con acción para copiar y enlace para abrir el cliente de correo. |
| 3 | Contacto profesional | Obligatoria | Enlace identificado al perfil de LinkedIn. |
| 4 | Otros espacios | Condicional | GitHub, Reddit y TikTok con una descripción breve de qué encontrar en cada uno. |
| 5 | Recursos profesionales | Condicional | Descarga del CV y acceso a proyectos destacados. |
| 6 | Formulario | Opcional, sujeto a integración | Solo se incorpora al definir un servicio de recepción compatible con el alojamiento, validación, privacidad y estados de envío. |

**Composición:** página breve con el canal principal destacado. En escritorio puede separar invitación y canales en dos columnas; en móvil se apilan.

**Comportamiento:** confirmar la copia del correo de forma accesible. No simular el envío de un formulario sin un receptor configurado ni mostrar disponibilidad o plazos de respuesta que no estén confirmados.

## 11. Páginas auxiliares y reutilización

| Necesidad | Solución propuesta |
| --- | --- |
| Resultados de búsqueda | Variante de L2, con consulta y fragmentos coincidentes. |
| Archivo por categoría editorial | Variante de L2 con categoría preseleccionada. |
| Página de etiqueta o competencia | L6 con definición y contenidos asociados. |
| Capítulo de una obra | Variante de L5 con navegación de serie. |
| Página de error 404 | L0 con explicación, enlace al inicio y acceso a búsqueda. |
| Privacidad y otras páginas informativas | L0 con cuerpo textual sencillo. |
| Traducciones | Mismo layout y contenido localizado; URLs diferenciadas. |
| Markdown, JSON, RSS y otros recursos para máquinas | Salidas de datos o documentos; no requieren un layout visual. |

## 12. Reglas comunes de composición

- **Identidad visual:** fondos de obsidiana, texto crema, cobre como acento y jade puntual. Grecas escalonadas y relieves discretos en marcos y separadores, sin dificultar la lectura ni sustituir etiquetas funcionales.
- **Jerarquía:** cada página tiene un título principal y encabezados que describen sus zonas. La decoración no determina la jerarquía semántica.
- **Contenido adaptable:** las composiciones pasan a una columna cuando el espacio lo requiere. Tablas, versos y diagramas necesitan tratamientos específicos para evitar recortes.
- **Accesibilidad:** navegación por teclado, foco visible, contraste comprobado y controles con nombres claros. Las superficies modales permiten cerrar y devuelven el foco al control que las abrió.
- **Movimiento:** respetar preferencias del sistema y ofrecer desactivación de efectos. La escena 3D se concentra en la portada; el resto de páginas mantiene la identidad con recursos ligeros.
- **Mejora progresiva:** texto, enlaces, categorías y relaciones esenciales se publican en HTML. Búsqueda, filtros dinámicos, preferencias y WebGL añaden funciones sobre esa base.
- **Contenido relacionado:** indicar la razón de cada relación y enlazar a la página canónica del contenido.
- **Estados:** diseñar ausencia de traducción, búsqueda sin resultados, falta de imágenes y fallo de recursos externos. No dejar controles sin función ni zonas vacías.
- **SEO y comprensión por agentes:** títulos, descripciones, idioma, relaciones y metadatos deben derivarse del contenido de cada página. El grafo visual y WebGL no son la única representación de información significativa.

## 13. Organización conceptual en Astro

Los nombres siguientes son una propuesta de organización; su implementación se ajustará al repositorio existente.

| Archivo propuesto | Responsabilidad |
| --- | --- |
| `BaseLayout.astro` | Documento común, metadatos, cabecera, selector de idiomas, área principal y pie. |
| `HomeLayout.astro` | Zonas de portada. |
| `CatalogLayout.astro` | Búsqueda, filtros y listados con variantes. |
| `ProjectLayout.astro` | Caso de estudio. |
| `CareerLayout.astro` | Trayectoria profesional. |
| `PublicationLayout.astro` | Ficha de obra, lectura y capítulos. |
| `TopicLayout.astro` | Definición taxonómica y relaciones. |
| `ProfileLayout.astro` | Perfil personal. |
| `ContactLayout.astro` | Canales de contacto. |

Cada layout de página utiliza el base una sola vez. Tarjetas, etiquetas, filtros, índices, visores y botones de compartir se resuelven como componentes compartidos. Las zonas opcionales se activan por contenido o configuración editorial; no por duplicación de plantillas.

## 14. Criterios para revisar los diseños

1. Cada página prevista encuentra lugar en uno de los ocho layouts o en el base para auxiliares.
2. Las zonas principales mantienen un orden comprensible en escritorio y móvil.
3. El selector de idiomas está disponible y explica las traducciones ausentes.
4. Los contenidos esenciales pueden leerse y recorrerse sin activar efectos ni abrir visores.
5. Proyectos, experiencia y obra mantienen su identidad editorial y se conectan mediante relaciones explícitas.
6. Las zonas opcionales desaparecen limpiamente cuando no existen datos.
7. Los adornos de Taller nocturno refuerzan la identidad sin competir con texto y controles.
