# Plan de trabajo — Implementación de Taller nocturno

## 1. Propósito y reglas de ejecución

Plan operativo consolidado a partir de la propuesta gráfica formal, el contenido editorial y las decisiones posteriores del propietario. Sustituye la versión anterior de este mismo documento y conserva los identificadores **PT01–PT15**, para no perder la trazabilidad. No contiene costos, duraciones ni fechas de entrega.

El equipo consta exclusivamente de **un desarrollador y un agente**. Ambos cubren implementación, preparación de materiales, documentación, pruebas y revisión. No se requieren diseñadores, redactores, modeladores 3D, especialistas de QA, personal de seguridad ni agentes adicionales. Los trabajos de esas disciplinas se incorporan a los paquetes siguientes, sin convertirlos en dependencias de contratación.

El resultado será un sitio Astro de salida estática: HTML, CSS, JavaScript en navegador y archivos generados durante el build. No se incorporan servicios externos de pago, backend propio o delegado, funciones serverless ni procesamiento remoto funcional. Se conservan las exclusiones IMP01–IMP12 del [registro de limitaciones](Registro_de_deuda_y_limitaciones_Paynalton.md). La información faltante, las actualizaciones y el volumen de trabajo son tareas, no causas de imposibilidad.

## 2. Alcance vigente

| Grupo | Resultado comprometido y límites |
| --- | --- |
| Primera entrega del sitio, E1 | L0 y L1–L8, incluidas las variantes de catálogo de obra y búsqueda: once composiciones de referencia. Navegación, doce proyectos, once etapas profesionales, Sobre mí, contacto, biblioteca configurable, lectura, búsqueda local, filtros y términos. |
| Idioma de trabajo | Arquitectura multilingüe basada en diccionarios desde E1; contenido nuevo completo primero en español. Las traducciones se realizan después del proyecto; el selector y la generación de rutas se implementan ahora, con visibilidad condicionada a destinos realmente publicados. Inventariar y conservar o tratar expresamente las URLs y archivos de otros idiomas existentes; no eliminarlos por omisión. |
| Área profesional | Cuatro casos completos: Pipila, Onix, GUACAMAYA y Winner. Ocho fichas breves: Yayauhqui, SpellChecker, LORO, PERICO, Delta, Delta Commerce, K4Y y Holstein. Destacados: Pipila, Onix y GUACAMAYA, en ese orden. |
| Contenido suficiente | Describir aportación y alcance conocidos. Aplicar las aclaraciones sobre Delta, Delta Commerce, K4Y y Holstein sin investigar lanzamientos desconocidos ni exigir métricas, repositorios o clientes para todas las fichas. Reckitt y Mead Johnson pueden nombrarse; no confundir clientes con empleadores. |
| Obra y pensamiento | Desarrollar con ejemplos claramente identificados y configurables. Incorporar las obras completas seleccionadas al cierre de la implementación, antes de cerrar la revisión editorial de publicación. No importar todo el archivo personal. Conservar materiales y descargas vigentes. |
| Obras aplazadas | Alma y Blanco, Negro y Gris quedan fuera de páginas, destacados, búsqueda, relaciones, sitemap y exportaciones. Se conservan sus originales sin publicarlos. |
| CV | Reservar la ubicación y ocultar accesos a archivos inexistentes. Actualizar y generar el CV después de terminar el sitio, en POST01; no bloquear E1 por ese archivo. |
| Identidad y efectos | Taller nocturno, 42 colores semánticos y reglas de contraste corregidas, fuentes locales, ornamentos moderados, WebGL con alternativa estática y efectos separables. FX01–FX10 y FX13 pertenecen a la familia inicial. |
| Publicación y calidad | SEO, JSON/Markdown/llms.txt públicos, RSS existente, migración de URLs, pruebas automatizadas, accesibilidad, seguridad, rendimiento y recuperación. Son parte de E1. |
| Ampliaciones posteriores, E2 | Grafo y recorridos, visores, preferencias/progreso de lectura local, series y citas avanzadas, ampliaciones RSS/sociales y WebMCP local de consulta. Su detalle aparece al final; no se convierten en requisitos de E1. |
| Excluido | W40 como formulario receptor, servicios de pago y demás modalidades IMP01–IMP12. Contacto mediante correo visible, copia, mailto y perfiles. |

WebGL y su alternativa se entregan juntos: una portada estática por sí sola no cierra PT10. Índices, notas y navegación básica entre capítulos son E1 aunque sus ampliaciones sean E2. Markdown/JSON son E1 aunque el widget avanzado W29 sea posterior.

El [contrato de internacionalización](implementacion/Contrato_internacionalizacion.md) es obligatorio para E1: diccionarios de interfaz y contenido, claves semánticas, plantillas compartidas y pruebas multilingües. Se difiere la traducción, no la capacidad de idiomas.

## 3. Punto de partida: reutilizar lo realizado

| Área | Evidencia disponible | Lo que falta para implementación |
| --- | --- | --- |
| PT01 técnico | `.nvmrc` fija Node 24.21.0; `package.json` fija npm 12.0.2 y Astro 7.3.4. Existen check, build, test:e2e y verify. El [resultado PT01](Resultado_actualizacion_PT01.md) registra pruebas locales previas. | Activar el runtime del proyecto al ejecutar. Ampliar controles según los cambios; no repetir una migración ya hecha ni asumir que la auditoría anterior prueba el estado futuro. |
| PT02 editorial | Inventario, contenido, mapas y pendientes depurados preparados. | Pasar las decisiones a datos publicables, comprobar destinos de migración y cerrar solo dudas que afecten a textos realmente publicados. |
| PT04 de diseño | Dossier formal, once layouts, 40 estudios de widgets, inventario de recursos, efectos y paleta corregida. | Trasladarlos a componentes del sitio, producir recursos finales y comprobar los estados reales. Diseñado no significa implementado. |
| Contraste | 84 pares autorizados pasan en la validación de la paleta; ocho usos restringidos. | Aplicar los tokens y verificar texto, controles y foco sobre sus fondos efectivos en cada estado. Las capturas anteriores no contienen todos los ajustes. |
| Sitio y publicación | Código y configuración disponibles; la actualización técnica no publicó el rediseño. | Implementar, integrar, generar candidato, comprobar despliegue y recuperación. Las cifras históricas de build no describen el futuro rediseño. |

Esta planificación revisa los materiales y los scripts actuales; no vuelve a ejecutar el build del sitio ni acredita nuevas pruebas funcionales de producción.

## 4. Materiales de entrada y prioridad

| Material | Uso en el trabajo | Paquetes |
| --- | --- | --- |
| [Propuesta gráfica formal](propuesta_grafica_formal/index.html) y [documento editable](propuesta_grafica_formal/Propuesta_grafica_formal_Paynalton.md) | Dirección, jerarquía, alcance de widgets y atlas de páginas. | PT04–PT10 |
| [Guía Taller nocturno](Taller_nocturno_guia_visual.png) | Material, iluminación, grecas y composición de referencia; no copiar textos ni botones desactualizados. | PT04/PT10 |
| [Contenido editorial](Contenidos_editoriales_Paynalton_ES.md) y [pendientes depurados](Pendientes_editoriales_priorizados_Paynalton.md) | Textos, aclaraciones y límites de publicación; no reabrir la recopilación exhaustiva descartada. | PT02/PT03/PT07/PT08 |
| [Navegación](Mapa_navegacion_Paynalton.md) y [rutas y contenidos](Propuesta_mapa_rutas_y_contenidos_Paynalton.md) | Destinos propuestos, anclas, relaciones y preservación de URLs. | PT02/PT05/PT09/PT11 |
| [Widgets](propuesta_grafica_widgets/index.html), [ubicaciones](Widgets_y_mapa_de_ubicacion_Paynalton.md) y [layouts](propuesta_grafica_layouts/index.html) | Estudios reutilizables y comportamiento esperado; no copiar demos como producto terminado. | PT04–PT09 |
| [Paleta RGBA](propuesta_grafica_layouts/Propuesta_esquema_colores_RGBA.md), [CSS](propuesta_grafica_layouts/paleta-colores.css) y [validación](propuesta_grafica_layouts/Validacion_WCAG_paleta.md) | Fuente vigente de color y combinaciones permitidas. | PT04/PT12 |
| [Inventario gráfico](propuesta_grafica_layouts/Inventario_de_imagenes_y_recursos_graficos.md) | Tamaños, variantes y dependencias de las 13 familias de recursos. | PT04/PT08/PT10/PT11 |
| [Efectos](propuesta_grafica_layouts/Propuesta_de_efectos_visuales.md) | FX01–FX14, capas, modos, carga y degradación. | PT05/PT10/PT12 |
| [Limitaciones](Registro_de_deuda_y_limitaciones_Paynalton.md), código, lockfile y pruebas existentes | Restricciones, realidad técnica y protección de comportamiento vigente. | Todos |

Ante contradicciones, prevalecen las instrucciones posteriores del propietario. Los pendientes depurados prevalecen sobre antiguas solicitudes editoriales, y la paleta corregida sobre colores presentes en capturas anteriores. Una galería, una lámina o un informe histórico no acreditan una función publicada.

## 5. Organización para una persona desarrolladora y un agente

| Responsabilidad | Agente | Desarrollador |
| --- | --- | --- |
| Preparar una unidad de trabajo | Leer estado y dependencias; proponer cambio acotado con criterios verificables. | Resolver decisiones de producto o interpretación que cambien el resultado; las decisiones ya tomadas no se solicitan de nuevo. |
| Implementar | Escribir y ajustar código, datos, SVG, geometría, scripts y documentación; preservar trabajo existente. | Revisar cambios e integrar; implementar directamente cuando lo prefiera, comunicando qué archivos ocupa. |
| Preparar materiales | Extraer textos aprobados, componer muestras, generar recursos locales y optimizar derivados. | Revisar fidelidad visual, exactitud editorial, selección y permisos de los materiales utilizados. |
| Comprobar | Preparar y ejecutar suites, analizar fallos y aportar capturas, resultados y reproducciones. | Revisar el resultado, probar manualmente recorridos, teclado, lectura y dispositivos disponibles con el guion preparado. |
| Publicar y mantener | Preparar candidato, instrucciones de despliegue y reversión; ejecutar acciones cubiertas por autorización vigente. | Revisar el candidato y controlar publicación, credenciales y recuperación. |

**Un solo frente de implementación activo.** Se puede preparar información independiente mientras se revisa un cambio, pero no se planifican varios equipos ni trabajo simultáneo sobre los mismos archivos. No se crean subagentes. El agente no sustituye la revisión humana de su propia entrega; tampoco se presupone un segundo revisor humano.

Ciclo de cada unidad: seleccionar una tarea lista → implementar y comprobar → presentar diff y resultado visible → revisar e integrar → registrar evidencia y siguiente tarea. No iniciar otra migración importante sobre una base todavía sin integrar. Las decisiones técnicas rutinarias y reversibles se resuelven dentro del alcance, sin convertir cada edición en una solicitud de permiso.

## 6. Orden de ejecución y dependencias

| Orden | Paquete | Dependencia / condición de entrada | Situación |
| --- | --- | --- | --- |
| 1 | PT01/PT02 — Reconocer la base y cerrar contratos pendientes | Material existente y estado del repositorio | Parcialmente realizados; cierre acotado |
| 2 | PT03 — Modelo y selección publicable | Decisiones PT02 | Implementado y validado localmente; listo para revisión |
| 3 | PT04 — Sistema visual y recursos base | Modelo representativo PT03 y dossier | Implementado y validado localmente; revisión visual disponible |
| 4 | PT05 — Marco y navegación | PT03/PT04 | Implementado y validado localmente; revisión disponible |
| 5 | PT06 — Recorrido completo de referencia | PT05 | Implementado y validado localmente; revisión disponible |
| 6 | PT07 — Área profesional y contacto | PT06 | Implementado y validado localmente; revisión disponible |
| 7 | PT08 — Biblioteca, lector y Sobre mí | PT06/PT07 integrados | Implementado; corpus PT08-C incorporado y validado |
| 8 | PT09 — Búsqueda, filtros y temas | Modelo y páginas PT07/PT08 | Implementado localmente; ver entrega PT09 |
| 9 | PT10 — Escena y efectos | PT04/PT05 y portada integrada | Implementado localmente; escena, renders y capa separable en entrega PT10 |
| 10 | PT08-C — Incorporación editorial de cierre | Plantillas y funciones del sitio terminadas | Implementado y validado: 110 textos nuevos; exclusiones y variantes aplicadas |
| 11 | PT11 — SEO, exportaciones y migración final | PT07–PT10 y PT08-C | Implementado y validado: formatos, SEO y migración Netlify preparada |
| 12 | PT12 — Candidato verificado | PT11 | Correcciones y conjunto completo de controles |
| 13 | PT13 — Preparar publicación y recuperación | PT12 | Candidato y procedimiento concretos |
| 14 | PT14 — Publicar y comprobar | PT13 y autorización vigente para publicar | No implícita por aprobar este plan |
| 15 | PT15 — Cierre y continuidad | PT14 para cierre publicado | Documentación se prepara desde antes |
| Después del sitio | POST01 — Actualización y generación del CV | Sitio terminado y contenido consolidado | Diferido expresamente; no condiciona PT12 |

Los números conservan su significado histórico. PT08-C es la incorporación final de contenidos dentro de PT08, no un paquete paralelo. El plan no exige terminar todas las pruebas al final: cada paquete incorpora las suyas y PT12 integra los resultados.

## 7. Paquetes de trabajo

### PT01 — Confirmar la base y preparar los controles restantes

- Activar el entorno fijado, revisar Git e instrucciones locales y preservar cambios existentes. Confirmar scripts y salida estática; no actualizar versiones por el mero inicio de esta fase.
- Reutilizar las pruebas de `tests/site.spec.ts`; registrar sus límites. Instalar o modificar herramientas únicamente al incorporarlas al trabajo.
- Inventariar recursos externos y consumidores del legado; planear retirada de analítica y sustitución de fuentes/iconos remotos.
- Preparar reportes locales fuera de `public` y un flujo único de validación; CI solo si existe un runner compatible sin contratación necesaria.

**Entrega del agente:** base de ejecución documentada, inventario de dependencias externas y lista acotada de controles faltantes. **Revisión del desarrollador:** flujo reproducible y preservación de trabajo existente. **Cierre:** comandos y baseline vigentes identificados; sin repetir PT01 técnico ya realizado. RF24; RNF08.

### PT02 — Cerrar el contrato de contenido y migración

- Aplicar las decisiones ya tomadas sobre proyectos, clientes, obra y CV. No pedir otra vez datos resueltos ni crear requisitos editoriales descartados.
- Convertir el mapa de rutas en una lista comprobable de origen, destino y tratamiento, incluyendo raíz, RSS, anclas, landing del libro y seis descargas existentes.
- Registrar el tratamiento de URLs anteriores en otros idiomas sin producir nuevas traducciones. Revisar `/jobs/` según su contenido real, no por el nombre.
- Delimitar campos internos, ejemplos, originales aplazados y conjunto público. Anotar solo dudas que afecten a contenido efectivamente seleccionado.

**Entrega del agente:** matriz operativa de publicación/migración y datos de muestra listos para esquemas. **Revisión del desarrollador:** exactitud de cambios editoriales y conservación de destinos. **Cierre:** ningún tratamiento de URL o ejemplo queda implícito; documentación existente reutilizada. RF03/RF06–RF12/RF22.

### PT03 — Implementar contenido, diccionarios, taxonomía y selección configurable

**Ejecución:** [resultado PT03](implementacion/Resultado_PT03.md), con modelo, diccionarios y pruebas implementados. PT04–PT10 implementados; PT08-C y PT11 implementados y validados; PT12 con validación automatizada aprobada y revisión humana pendiente antes de PT13.

- Definir esquemas de perfil, proyectos, experiencia, obras, términos y enlaces; cuerpos en Markdown y configuración estructurada donde corresponda.
- Centralizar idiomas y diccionarios con español base, claves semánticas estables, parámetros/plurales y estados de habilitación. Separar textos de interfaz, entradas editoriales y cuerpos Markdown por idioma; ningún texto traducible queda incrustado en las plantillas.
- Separar ID conceptual, idioma y slug; resolver equivalencias reales y ausencias. Validar cobertura de claves y parámetros, con fallback explícito que no oculte una traducción incompleta.
- Usar IDs estables, slugs, orden, destacados y estados de publicación. Identificar ejemplos y permitir retirarlos de la publicación sin borrar fixtures de prueba.
- Aplicar una única política de publicación a HTML, relaciones, búsqueda, sitemap y exportaciones. Excluir originales aplazados y campos internos de todas las salidas.
- Implementar relaciones útiles, alias y referencias; validar IDs, rutas, referencias inexistentes y ciclos que el modelo no permita.
- Incorporar Pipila, una etapa, un término y una obra de ejemplo con capítulos/notas como datos representativos. No exigir un término por cada tecnología histórica.

**Entrega del agente:** esquemas, consultas comunes, configuración de selección y pruebas de contratos. **Revisión del desarrollador:** modelo entendible y mantenimiento sin editar plantillas. **Cierre:** agregar, ordenar, destacar o retirar una obra solo modifica contenido/configuración; registros inválidos fallan y borradores no se publican; un catálogo sintético permite probar otro idioma sin cambiar componentes. RF15–RF16/RF19–RF21; RNF05–RNF06.

### PT04 — Implementar el sistema visual y producir los recursos base

**Ejecución:** [entrega y validación PT04](implementacion/PT04/README.md), con [galería de capturas](implementacion/PT04/index.html). Implementación local terminada; revisión visual del desarrollador disponible. 30 pruebas de diseño, 38 de contenido y 25 E2E aprobadas. Sin despliegue.

- Trasladar los 42 tokens RGBA y sus restricciones; definir espaciado, anchos, tipografía y foco. Usar las variantes de selección y tintes corregidas.
- Preparar Manrope/Fraunces locales con pesos necesarios, glifos españoles, alternativas y avisos de licencia. Atkinson/Georgia siguen siendo referencias de prototipo hasta la sustitución comprobada.
- Construir primitivas de enlaces, botones, campos, avisos, tarjetas y etiquetas con textos y nombres accesibles resueltos por diccionario, espacio para traducciones más largas y dirección de escritura configurable. Probar normal, hover, pulsación, foco, selección, vacío y error cuando correspondan.
- Producir VEC-01–VEC-04: marca, grecas, iconos y composiciones editoriales de ejemplo. Crear geometría/materiales iniciales de la escena para orientar su acabado; los renders definitivos se cierran en PT10.
- Materializar muestras de portada, caso y lectura en componentes del sitio, no copiando las galerías completas a producción. Revisar móvil y escritorio.

**Entrega del agente:** tokens, componentes, recursos locales y muestras implementadas. **Revisión del desarrollador:** identidad, jerarquía, tipografía y lectura. **Cierre:** muestras legibles y accesibles, contraste real comprobado y fuentes sin carga remota. L0–L8; RNF01/RNF04.

### PT05 — Construir el marco compartido y la navegación

**Ejecución:** [entrega PT05](implementacion/PT05/README.md) y [capturas](implementacion/PT05/index.html). Marco integrado en diez rutas de contenido, 404 estática, raíz ES, preferencias y controlador opcional; búsqueda básica, con índice completo reservado a PT09. 45 pruebas de contenido, 43 E2E y 33 de revisión visual/idiomas aprobadas. Sin despliegue.

- Implementar L0, W01–W03, W05–W08: salto al contenido, marca, navegación, buscador, migas, preferencias y perfiles. W04 se implementa y prueba como capacidad; solo se muestra cuando hay versiones publicadas equivalentes. Su lámina anterior queda superada en este punto.
- Generar rutas mediante plantillas compartidas por idioma, con español completo primero y 404 estática; asegurar alternativas de navegación útiles sin JavaScript.
- Implementar menú móvil, teclado, cierre y retorno del foco. Aislar el CSS nuevo y retirar legado solo al migrar sus consumidores.
- Implementar preferencias Automático, Suave, Completo y Sin efectos, más control de 3D. Separar capa visual, funciones y controlador opcional; tolerar almacenamiento bloqueado.

**Entrega del agente:** marco navegable y contrato del controlador de efectos. **Revisión del desarrollador:** orientación y recorridos de teclado/móvil. **Cierre:** el marco funciona sin WebGL, sin motor de animación y con alternativas HTML; no hay selector sin destino ni enlaces rotos. RF01/RF18/RF23; W01–W08.

### PT06 — Validar un recorrido completo antes de escalar

**Ejecución:** [entrega PT06](implementacion/PT06/README.md) y [galería](implementacion/PT06/index.html). Recorrido, ficha de participación, relaciones y descargas JSON/Markdown del caso implementados. HTML y exportaciones concordantes; fixtures comparten plantilla y quedan fuera de publicación. 50 pruebas de contenido, 51 E2E y 36 de revisión visual/idiomas aprobadas. Sin despliegue.

- Conectar Inicio → Pipila → término relacionado → contacto usando el modelo y componentes reales.
- Generar JSON y Markdown del mismo caso con origen canónico y campos públicos.
- Probar el recorrido también con un diccionario sintético, equivalencias presentes/ausentes y textos expandidos fuera de publicación.
- Comprobar consistencia de datos, enlaces, anclas y exclusión de borradores; incorporar casos de consulta/URL maliciosa sin ejecución de código.
- Crear pruebas de integración y navegador del recorrido, con capturas y teclado. Ajustar contratos antes de multiplicar las fichas.

**Entrega del agente:** recorrido revisable, exportaciones y pruebas reproducibles. **Revisión del desarrollador:** comprensión de la aportación, coherencia visual y contacto accesible. **Cierre:** el recorrido completo pasa y las tres representaciones cuentan los mismos hechos. RF03/RF05/RF12/RF15–RF16/RF19; A01/A06.

### PT07 — Completar proyectos, trayectoria y contacto

**Ejecución:** [entrega PT07](implementacion/PT07/README.md) y [galería](implementacion/PT07/index.html). Doce proyectos, once etapas, seis capacidades con evidencia, contacto y compartir con alternativas, impresión y retirada de recursos remotos automáticos. 53 pruebas de contenido, 63 E2E y 36 de revisión visual aprobadas. Sin despliegue.

- Completar L1, catálogo profesional L2, casos L3, cronología L4 y contacto L8.
- Extraer los textos profesionales y de contacto a diccionarios editoriales y cuerpos por idioma, preservando datos compartidos.
- Incorporar cuatro casos y ocho fichas según su extensión acordada; once etapas y capacidades con evidencia. No convertir desconocimientos de lanzamiento en afirmaciones ni investigaciones obligatorias.
- Mantener destacados configurables, roles precisos y referencias públicas seleccionadas. Preparar impresión de trayectoria si se conserva en el alcance, sin sustituirla por un CV aún no generado.
- Implementar W13, correo visible/copiable/mailto, perfiles y compartir con alternativas. Retirar analítica remota y dependencias externas incompatibles.

**Entrega del agente:** área profesional completa con redacción aplicada y recursos pertinentes. **Revisión del desarrollador:** hechos, nombres autorizados, legibilidad y utilidad del contacto. **Cierre:** se explica la experiencia sin datos inventados; enlaces utilizables; sin CV ficticio ni formulario receptor. RF03/RF05–RF08/RF12/RF17.

### PT08 — Construir biblioteca, lectura y perfil personal

**Ejecución:** [entrega PT08](implementacion/PT08/README.md) y [galería](implementacion/PT08/index.html). Biblioteca configurable, ficha del libro, capítulos/lector con ejemplos aislados y Sobre mí implementados. 58 pruebas de contenido, 67 E2E y 48 de revisión aprobadas. URL del libro, páginas existentes por idioma y seis descargas conservadas. Sin despliegue; incorporación de originales en PT08-C.

- Implementar L2-obra, L5 y L7 con biblioteca configurable, fichas, índice, capítulos, notas y relaciones pertinentes.
- Migrar los textos de lectura y del libro a catálogos por idioma; mantener independiente el idioma de página del de la edición descargable.
- Utilizar ejemplos identificados y sustituibles; mantener los fixtures fuera del conjunto público final. Conservar la obra vigente y sus descargas, sin atribuir ejemplos al autor.
- Implementar biografía, forma de trabajar e intereses con el material existente. Las lecturas personales recomendadas no son obras del autor.
- Comprobar tipografía, textos largos, párrafos, listas, versos y notas con contenido representativo; lectura móvil y zoom sin depender de funciones avanzadas.

**Entrega del agente:** catálogo, lector y Sobre mí funcionales con ejemplos. **Revisión del desarrollador:** experiencia de lectura y configuración de selección. **Cierre técnico:** cambiar ejemplos por obras no exige modificar páginas; navegación y archivos existentes se conservan. RF09–RF11/RF16; W23/W24/W27/W28/W32.

**Selección confirmada para PT08-C:** el propietario aprueba el corpus depurado de materiales, conservando coautorías y excluyendo los fragmentos de Blanco, Negro y Gris. La incorporación está implementada y validada localmente: 110 textos nuevos, con exclusiones, variantes y coautorías resueltas. Ver [entrega PT08-C](implementacion/PT08-C/README.md). Ver [corpus y reglas de incorporación](implementacion/PT08/Corpus_PT08-C.md).

**PT08-C — Cierre editorial después de implementar el sitio:** incorporar originales completos seleccionados, revisar autoría/versiones/portadas y reemplazar ejemplos publicables. El agente transforma, relaciona y verifica; el desarrollador valida selección y fidelidad. Se cierra cuando no quedan ejemplos presentados como obras reales ni referencias a obras aplazadas. Si los originales aún no se incorporan, el sitio puede estar técnicamente listo pero este cierre sigue pendiente; no se sustituye silenciosamente por publicación de ejemplos.

### PT09 — Integrar búsqueda, filtros y temas

- Implementar Explorar y L6 con índice local generado después del HTML; concretar Pagefind según el contrato de búsqueda y fijar su versión al incorporarlo.
- Preparar índices y mensajes de búsqueda por idioma; indexar el contenido nuevo útil publicado en español en esta entrega; metadatos de tipo y términos. Excluir navegación repetida, borradores y ejemplos retirados.
- Mantener consulta/filtros en URL y restaurarlos al volver; distinguir carga, fallo y cero resultados; permitir limpiar.
- Mantener listados HTML accesibles. W16 solo se incorpora si el volumen real justifica paginación; no crear páginas vacías para completar una muestra.

**Entrega del agente:** índice, búsqueda, filtros y taxonomía con pruebas de consultas de referencia. **Revisión del desarrollador:** relevancia y comprensión de las relaciones. **Cierre:** resultados correctos y estados recuperables, sin backend ni pérdida de navegación histórica. RF13–RF16/RF21; A04/A06.

**Ejecución:** [entrega PT09](implementacion/PT09/README.md) y [capturas](implementacion/PT09/index.html). Pagefind 1.5.2: 26 documentos, texto completo, filtros tipo/tema y URL recuperable; diez temas relacionados. Índice español separado de las pruebas sintéticas de idiomas, controles de exclusión y alternativa HTML. Sin despliegue.

### PT10 — Completar escena, alternativas y efectos

- Producir 3D-01 y MAT-01 desde el prototipo; TEX-01/ENV-01 solo si aportan detalle visible. Usar geometría procedural y recursos locales para evitar dependencias de personal o compra de materiales.
- Generar IMG-01/IMG-02 a partir del estado final de la escena con encuadres de escritorio/móvil coherentes. Optimizar derivados según inventario y reservar su espacio en HTML.
- Integrar FX01–FX03 con un solo motor y FX04–FX10/FX13 mediante CSS/SVG o la librería abierta propuesta cuando sea necesaria. No instalar una librería por efecto.
- Conectar preferencias y movimiento reducido; cargar escena solo al habilitarla. Pausar fuera de vista/pestaña oculta, liberar recursos al desactivar y volver a la alternativa ante pérdida de contexto.
- Medir transferencia, memoria y renderizado por separado. Objetivos iniciales: escena hasta 1 MB de geometría/texturas/entorno, 60 000 triángulos, 30 llamadas de dibujo y DPR máximo 1,5; aplicar los demás límites del documento de efectos.

**Entrega del agente:** escena, renders estáticos, derivados y efectos separables con pruebas de degradación. **Revisión del desarrollador:** acabado visual, intensidad y dispositivos disponibles. **Cierre:** WebGL real integrado; Sin efectos conserva funciones/diseño y no carga recursos 3D; fallos y desactivación no rompen la portada. RF04/RF23; RNF03/RNF07; A05.

**Ejecución:** [entrega PT10](implementacion/PT10/README.md) y [galería](implementacion/PT10/index.html). Three.js 0.186.1, geometría y materiales locales, maestros y seis derivados WebP. FX01–FX10/FX13 con carga opcional, limpieza y alternativa estática; compilación sin módulos de efectos comprobada. 29 llamadas/5.608 triángulos con sombras; presupuestos y validación en la entrega. Los textos permanecen opacos durante las transiciones para conservar contraste. Revisión humana de acabado y dispositivos disponible; sin despliegue.

### PT11 — Completar publicación de contenido, SEO y migración

**Ejecución:** [entrega PT11](implementacion/PT11/README.md). SEO y metadatos, PUB-01/PUB-02, 638 formatos, catálogo/llms/RSS, sitemap de 330 URLs y migración Netlify preparados y verificados localmente. Sin despliegue; el comportamiento remoto se comprobará en PT13/PT14.

**Entorno confirmado por el propietario:** dominio `paynalton.tech`, alojamiento en Netlify y DNS en Cloudflare. Preparar la migración para este destino; la configuración remota y su comportamiento se verificarán en las etapas de publicación.

- Incorporar PUB-01/PUB-02: imagen social general e iconos de sitio derivados de la identidad local.
- Generar canonical, metadatos, JSON-LD, sitemap y robots desde contenido visible. Derivar HTML lang/dir, canonical y hreflang de versiones publicadas, nunca de traducciones inexistentes; exportaciones con idioma e ID conceptual.
- Completar Markdown/JSON/llms.txt con política pública única y orden estable. Mantener RSS y descargas vigentes.
- Aplicar mapa de URLs y anclas con redirecciones declarativas; comprobar destinos existentes, cadenas, recursos y 404 reales. Mantener el tratamiento explícito del legado en otros idiomas.
- Escanear `dist`: fuera documentación interna, materiales de referencia, secretos, fixtures y originales no publicados. Regenerar índice/exportaciones tras PT08-C.

**Entrega del agente:** candidato con formatos públicos y matriz de migración comprobada. **Revisión del desarrollador:** URLs, vista previa social y coherencia de contenido. **Cierre:** HTML, búsqueda, sitemap y exportaciones reflejan la selección final correcta; sin filtración de material interno. RF18–RF22; RNF05–RNF06; A06/A07.

### PT12 — Verificar el candidato y corregir defectos

- Ejecutar el pipeline obligatorio sobre el candidato identificado; ampliar suites según los contratos siguientes.
- Comprobar la arquitectura multilingüe con diccionarios sintéticos, parámetros, plurales, traducciones ausentes y ausencia de fixtures en el artefacto público.
- Revisar layouts y estados en escritorio/móvil, 320 px, zoom, teclado, lector de pantalla, movimiento reducido y condiciones sin WebGL/almacenamiento/portapapeles/índice.
- Comprobar que los recursos gráficos y las fuentes finales sustituyen los provisionales; actualizar capturas base solo después de revisar diferencias intencionales.
- Revisar seguridad, contraste, rendimiento, red y ausencia de servicios excluidos. Corregir fallos y repetir pruebas afectadas; al cambiar el candidato, conservar evidencia del nuevo artefacto.

**Ejecución:** [entrega PT12](implementacion/PT12/README.md): controles integrados, CSP compatible, regresión visual, auditoría y diagnóstico de rendimiento. La aprobación visual/editorial, el lector de pantalla real y el afinado acordado se mantienen como revisión humana; no se confunden con las comprobaciones automatizadas.

**Entrega del agente:** matriz de aceptación, resultados automatizados y defectos corregidos. **Revisión del desarrollador:** pruebas manuales y comprobación del resultado visual/editorial. **Cierre:** requisitos E1 verificados en el entorno disponible; pendientes remotos expresamente reservados a PT13/PT14. No exige CV nuevo ni E2. RF/RNF aplicables a E1; A01–A08 según entorno.

### PT13 — Preparar publicación y recuperación

**Flujo confirmado:** cambios en `master` disparan el pipeline vinculado a GitHub que compila HTML estático y sube a Netlify. Revisar este flujo existente y la aplicación de redirecciones/cabeceras antes de publicar; su configuración no está disponible en `.github/` de este checkout. Push o integración en `master` se trata como publicación de PT14.

- Revisar alojamiento y configuración estática existentes sin habilitar backend ni cargos; preparar preview cuando el entorno lo permita.
- Vincular commit o identificación equivalente, artefacto, configuración y reportes. Si se reconstruye, repetir controles pertinentes y comparar el resultado.
- Preparar y ensayar recuperación de una versión sana en entorno controlado; no depender de copias temporales antiguas de `/tmp`.
- Preparar la revisión concreta del candidato y los pasos de publicación; resolver autorización solo si no está cubierta por instrucciones vigentes.

**Entrega del agente:** candidato revisable, guía y evidencia de reversión. **Revisión del desarrollador:** configuración, resultado y control de publicación. **Cierre:** se puede publicar y restaurar sin improvisar; no se declara publicado. RF24; RNF08; A08.

### PT14 — Publicar y comprobar el entorno real

- Ejecutar la publicación autorizada con el candidato verificado.
- Comprobar HTTPS, dominio, nuevas rutas, legado, anclas, recursos, descargas, búsqueda y escena/alternativa en el destino real.
- Verificar cabeceras HTTP y redirecciones realmente servidas, además de canonical y formatos públicos. Las pruebas remotas son de humo y solo lectura.
- Corregir incidencias o aplicar reversión conforme al procedimiento.

**Entrega del agente:** resultados de comprobación remota y registro del artefacto publicado. **Revisión del desarrollador:** publicación y recorrido real. **Cierre:** versión identificada y recorridos esenciales operativos en productivo; sin confundir pruebas locales con remotas. RF18/RF22/RF24; A01/A03–A08.

### PT15 — Cerrar y dejar continuidad

- Documentar cómo editar fichas, añadir/retirar/ordenar/destacar obras, publicar originales, relacionar términos y regenerar índices/formatos.
- Documentar cómo añadir diccionarios, traducir cuerpos, revisar y habilitar versiones sin duplicar plantillas.
- Documentar fuentes de imágenes, derivados, efectos, actualización de dependencias, pruebas y recuperación.
- Registrar tareas completadas, límites de validación y ampliaciones pendientes; actualizar `.ai_cache` al cerrar unidades de implementación. La caché histórica no sustituye el estado comprobado.
- Dejar POST01 explícito como siguiente trabajo diferido del CV, separado de defectos de E1.

**Entrega del agente:** guía operativa y continuidad. **Revisión del desarrollador:** ejecutar una actualización de contenido con esa guía. **Cierre:** el mismo equipo puede mantener el sitio sin reconstruir la conversación ni necesitar personal adicional. RF24; RNF08.

### POST01 — Actualizar y generar el CV después del sitio

El agente prepara el CV desde la información ya consolidada y sus archivos finales; el desarrollador revisa contenido y presentación. Después se habilita W22 y cualquier acceso reservado, se verifican descarga, enlaces y ausencia de datos internos, y se publica el cambio con el mismo procedimiento. No reabrir el enfoque profesional ni los destacados ya decididos. Nuevas variantes para oportunidades concretas son ampliaciones, no requisito automático.

## 8. Producción de materiales dentro del equipo

| Material | Responsable de preparación | Revisión del desarrollador | Cierre |
| --- | --- | --- | --- |
| VEC-01–VEC-03 | Agente: SVG y derivados; refinar sistema coherente. | Marca, legibilidad e iconos a tamaño real. | PT04; iconos adicionales al implementar sus controles. |
| VEC-04 | Agente: tres composiciones editoriales de ejemplo configurables. | Identificación clara como ejemplos. | PT04/PT08; retiradas de selección pública en PT08-C si corresponde. |
| 3D-01/MAT-01 | Agente: geometría, pivotes, materiales, iluminación y código. | Fidelidad al taller y calidad perceptual. | PT10. |
| TEX-01/ENV-01 | Agente: producir localmente solo si la prueba visual lo justifica. | Mejora visible frente a peso y complejidad. | PT10; omisión justificada si materiales simples bastan. |
| IMG-01/IMG-02 | Agente: renderizar estado final y exportar tamaños del inventario. | Misma escena, encuadre adaptado y nitidez. | PT10. |
| IMG-03 | Originales seleccionados disponibles; agente prepara derivados sin inventar portadas ni deformarlas. | Selección, derechos y correspondencia con cada obra. | PT08-C. |
| PUB-01/PUB-02 | Agente: componer imagen social y derivar favicons de identidad. | Lectura de vista previa y reconocimiento de marca. | PT11. |
| Textos y datos | Agente aplica documento y respuestas existentes. | Exactitud, voz y publicabilidad de la selección. | PT07/PT08-C; CV en POST01. |

Una captura o diagrama de proyecto solo se produce si ayuda a explicar la aportación. No se contrata personal para completar materiales opcionales ni se condiciona cada ficha a tener una imagen. Todos los recursos mantienen procedencia, fuente editable y ruta de regeneración cuando aplique.

## 9. Automatización del testing y pruebas de seguridad


Se reutilizan las pruebas existentes y la automatización crece con cada comportamiento implementado. Es parte de E1, no una ampliación opcional. Las herramientas se ejecutan en desarrollo o durante el build y no añaden backend al sitio. Se utilizarán herramientas locales sin servicios de pago obligatorios; el mismo pipeline podrá ejecutarse en un runner existente que cumpla esa condición. No se presupone un proveedor de CI ni se contratan servicios.

### Suites y alcance

| Suite | Comprobaciones automatizadas | Incorporación |
| --- | --- | --- |
| Tipos y contenido | Tipos Astro/TypeScript; esquemas; IDs y rutas duplicados; referencias inexistentes; ciclos; fechas, estados de publicación, claves y parámetros de diccionarios, variantes por idioma; exclusión de borradores | PT01/PT03 |
| Lógica | Resolución de idiomas y traducciones, interpolación/plurales, relaciones, URLs, filtros y estado local; valores vacíos, entradas inválidas y recuperación de errores | PT03/PT05/PT09 |
| Integración del build | Igualdad de entidades publicadas entre HTML, JSON, Markdown, sitemap e índice; ausencia de campos internos; recursos y enlaces internos, incluidas anclas aplicables | PT06/PT11 |
| Navegador | Playwright para menú, teclado, búsqueda, filtros, historial, notas, descargas, contacto y preferencias; escritorio y móvil en una matriz definida | PT06–PT12 |
| Accesibilidad | axe en páginas y estados representativos, más aserciones de foco, nombres y navegación por teclado | PT05–PT12 |
| Regresión visual | Capturas de portada, caso, catálogo y lectura con fuentes locales y entorno fijado; comparación de estados estables y revisión de cambios intencionales | PT04–PT12 |
| Rendimiento | Pesos comprimidos de recursos iniciales, imagen móvil y escena completa; comprobación de carga diferida y pausa; diagnóstico Lighthouse bajo condiciones registradas | PT09/PT10/PT12 |
| Resiliencia | Sin JavaScript, contexto gráfico ausente o perdido, índice no disponible, almacenamiento y portapapeles denegados; alternativas funcionales | PT05–PT12 |
| Seguridad | Dependencias, secretos, contenido no confiable, URLs, scripts, solicitudes y artefactos públicos según la matriz siguiente | PT01/PT03/PT06/PT11–PT14 |

Las pruebas verificarán contratos y resultados relevantes, no la estructura interna de cada componente. Se usarán fixtures pequeños para casos inválidos y borradores. Los fixtures permanecerán fuera de las colecciones publicables y de `public`; una comprobación verificará que sus marcadores no aparecen en `dist`.

### Matriz de seguridad

| ID | Riesgo | Prueba y resultado esperado |
| --- | --- | --- |
| SEG01 | Dependencias vulnerables o cambios inesperados en instalación | Revisar manifiesto y lockfile, auditar dependencias con datos de avisos disponibles y evaluar impacto tanto en build como en navegador. Documentar procedencia del aviso y resolución; no ejecutar correcciones automáticas incompatibles sin validarlas |
| SEG02 | Secretos o material interno expuesto | Escanear cambios y artefacto final, incluidos HTML, JSON, Markdown, mapas de fuentes y archivos copiados. Verificar que `.env`, `.ai_cache`, `ai_reference`, fixtures y campos privados no se distribuyen. Usar valores sintéticos; redactar hallazgos en logs |
| SEG03 | XSS por contenido, consultas o datos externos | Probar títulos, resúmenes, parámetros y snapshots con etiquetas, atributos de eventos y caracteres especiales. Verificar escape o saneamiento según el contrato y ausencia de ejecución. No compilar MDX de origen no confiable como si fuera texto inerte |
| SEG04 | URLs peligrosas o navegación inesperada | Probar protocolos no admitidos, URLs malformadas y valores usados para construir destinos. Mantener protocolos permitidos por contexto, como HTTPS para recursos externos y `mailto:` para correo. Verificar que consultas y filtros no se convierten en redirecciones arbitrarias |
| SEG05 | Publicación accidental de borradores o campos privados | Introducir registros sintéticos y comprobar su ausencia en todas las representaciones, índice de búsqueda y archivos generados; fallar ante una diferencia de política de publicación |
| SEG06 | Scripts y servicios incompatibles | Interceptar solicitudes del navegador y contrastarlas con una lista explícita de recursos permitidos. Fallar ante analítica remota, envío de formularios, APIs de backend o scripts externos no autorizados por el alcance. Los enlaces que el visitante abre voluntariamente se verifican aparte |
| SEG07 | Política de navegador insuficiente o incompatible | Definir y probar cabeceras declarativas, incluida una política CSP ajustada a scripts, estilos, workers y WebGL realmente usados, protección frente a inclusión en marcos y política de referencias. Verificar las cabeceras HTTP en preview/producción: su presencia en un archivo local no acredita aplicación |
| SEG08 | Automatización con permisos excesivos o reportes expuestos | Ejecutar cambios no confiables sin credenciales de publicación; separar validación y despliegue, limitar permisos y fijar herramientas. Mantener trazas, capturas y reportes fuera del sitio publicado y revisar su contenido antes de compartirlos |
| SEG09 | Entradas abusivas en herramientas de consulta local | Cuando se implemente WebMCP en E2, validar parámetros, tamaños y límites de resultados; rechazar herramientas de escritura y comprobar que solo consulta el conjunto público |

Las comprobaciones activas se dirigen al sitio local o al entorno de prueba controlado. No se escanean redes sociales, enlaces de terceros ni servicios ajenos. El pipeline no envía mensajes, formularios ni operaciones transaccionales reales.

### Comandos y pipeline previstos

Estado comprobado en `package.json`: ya existen `check`, `build`, `test:e2e` y `verify`. El `verify` actual ejecuta check → build → test:e2e. Los comandos adicionales siguientes son una propuesta que se incorporará conforme exista su suite; no se presentan como implementados:

- `check`: ya ejecuta `astro check`; ampliar la validación de contenido según los esquemas nuevos.
- `test:unit`: lógica y casos límite.
- `test:integration`: contratos entre fuentes y salidas del build.
- `test:e2e`: suite existente de Playwright; ampliar los recorridos del rediseño y sus estados de error.
- `test:a11y`, `test:visual` y `test:performance`: controles específicos y reportes.
- `test:security`: controles de seguridad del código, dependencias y artefacto.
- `verify`: ampliar el comando existente para ejecutar el conjunto obligatorio, con fallo propagado al proceso que lo invoca.

Orden del pipeline: instalación desde lockfile → tipos y contenido → pruebas de lógica → build e indexación → integración y escaneo del artefacto → servidor estático temporal local → pruebas de navegador, accesibilidad, visuales y rendimiento → reportes → habilitación del candidato para publicación. La auditoría de dependencias y el escaneo de cambios pueden ejecutarse antes del build; el escaneo del artefacto siempre se realiza después. El servidor temporal sirve archivos para pruebas y no forma parte del despliegue del sitio.

| Evento | Ejecución |
| --- | --- |
| Desarrollo local | Pruebas afectadas por el cambio; `verify` antes de preparar el candidato |
| Cambio propuesto para integrar | Tipos, contenido, lógica, build, integración, seguridad y recorridos esenciales; ampliar suites según archivos y comportamientos afectados |
| Candidato de publicación | Conjunto completo obligatorio sobre el commit y artefacto identificados |
| Actualización de dependencias o configuración | Reproducibilidad, auditoría y suites afectadas; pipeline completo antes de publicar |
| Publicación realizada | Humo de solo lectura y verificación de cabeceras/rutas reales |

La auditoría que necesite descargar avisos públicos se realiza durante validación, sin introducir una dependencia de red para visitantes. Si no puede ejecutarse, se registra como pendiente con la antigüedad de los datos disponibles; no se presenta como un resultado limpio.

### Criterios de bloqueo y evidencia

- Bloquear el candidato ante pruebas obligatorias fallidas, referencias rotas, incoherencia de publicación, exposición confirmada de secretos o datos internos, XSS reproducible o dependencia de servicios excluidos.
- Bloquear vulnerabilidades críticas o altas confirmadas como aplicables al build o al sitio hasta remediarlas. Clasificar los avisos restantes con evidencia; un falso positivo debe justificarse, no silenciarse de forma general.
- Bloquear regresiones que impidan navegación, lectura o contacto, y presupuestos incumplidos sin resolución expresa. Diferencias visuales intencionales requieren revisión antes de actualizar las capturas base.
- No convertir reintentos en aprobación de pruebas inestables. Registrar causa y reparar; si afecta un comportamiento obligatorio, mantener el bloqueo.
- Guardar commit, versiones de herramientas, entorno, comandos y resultados, junto con reportes y trazas de fallos depurados. No publicar esos artefactos dentro de `dist`.
- El desarrollador realiza la revisión manual de calidad lingüística/editorial, percepción visual, lector de pantalla y rendimiento en los dispositivos disponibles, con guiones y evidencias preparados por el agente. No se presupone un equipo de QA ni un laboratorio; las combinaciones no probadas se registran expresamente. La automatización apoya estos controles y no demuestra por sí sola conformidad completa ni ausencia total de vulnerabilidades.


## 10. Trabajo posterior compatible

| Paquete | Alcance | Condición de cierre |
| --- | --- | --- |
| E2-A | W12/W33: recorridos editoriales y grafo local | Relaciones explicadas y lista HTML equivalente; teclado sin depender del arrastre. |
| E2-B | W18/W19 y FX14: visores de evidencias y diagramas | Recursos reales, descripción, cierre, retorno del foco y alternativa directa. |
| E2-C | W25/W26: preferencias y progreso de lectura local | Restauración/reinicio comprobados y alternativa sin almacenamiento; sin sincronización remota. |
| E2-D | Ampliaciones W28/W29/W39: series, citas, formatos y RSS | Archivos y destinos reales. No retrasa capítulos/notas ni exportación básica de E1. |
| E2-E | W36/W37 y W38 compatible: repositorios, publicaciones y medios seleccionados | Preparación local y enlaces públicos; sin métricas inventadas, feeds obligatorios ni embeds incompatibles. |
| E2-F | WebMCP de consulta local | Comprobar soporte al implementarlo, límites de entrada y lectura exclusiva de datos públicos; sitio íntegro sin módulo. |
| Mejora condicional | FX11, transición entre páginas | Solo tras demostrar que no rompe historial, foco ni anclas. No bloquea E1. |
| Alcance de FX12 | Respuesta de relaciones enlazadas; grafo en E2-A | No presupone incluir W33 en la primera entrega. |
| Después de completar el proyecto | Traducciones reales | Crear y revisar diccionarios y cuerpos de otros idiomas. La infraestructura multilingüe y W04 condicionado pertenecen a E1; no se aplazan. |

Cada ampliación se ejecuta con el mismo desarrollador y agente, de una en una, después de priorizarla. Mantiene las mismas restricciones y validaciones; no es una tarea pendiente que impida cerrar E1.

## 11. Seguimiento y definición de terminado

Cada unidad tendrá ID derivado del paquete, resultado esperado, dependencia, responsable activo, materiales, archivos afectados y evidencia. Estados: pendiente → lista → en curso → en revisión → verificada. Si está bloqueada, registrar la causa concreta y el siguiente paso; no usar falta de volumen editorial o complejidad como imposibilidad.

Una unidad verificada cumple su objetivo, pasa las pruebas afectadas, tiene revisión del desarrollador y actualiza el registro de continuidad. Crear archivos o mostrar una captura no basta para cerrar una función. La aprobación de una diferencia visual no permite omitir errores de contraste ni pérdida de funcionalidad.

**Cierre de E1:** sitio estático con arquitectura multilingüe basada en diccionarios y probada, contenido completo primero en español y contenido profesional seleccionado, biblioteca configurada y obras de cierre incorporadas, lectura/contacto/búsqueda/relaciones operativas, WebGL y alternativa, paleta aplicada, migración y formatos coherentes, controles de testing y seguridad, publicación comprobada y recuperación documentada. El CV nuevo y E2 permanecen fuera de este criterio.

**Unidad inicial ya ejecutada:** cierre acotado PT01/PT02 y apertura de PT03 con Pipila, una etapa profesional, un término y una obra de ejemplo. Entregar el contrato de publicación/selección, esquemas, diccionarios y pruebas de exclusión de borradores y de equivalencias por idioma. No repetir la actualización de runtime ni rehacer la propuesta gráfica; después, trasladar la paleta y las primitivas a PT04.

**Siguiente unidad vigente según la secuencia:** completar la revisión humana de PT12 y continuar con PT13. La validación automatizada de PT12 está aprobada; consultar su [entrega y guion de revisión](implementacion/PT12/README.md). Revisar la [entrega PT11](implementacion/PT11/README.md). El afinado de intensidad/velocidad de efectos permanece para antes de publicar y el CV continúa en POST01. La publicación y las comprobaciones HTTP remotas corresponden a PT13/PT14.
