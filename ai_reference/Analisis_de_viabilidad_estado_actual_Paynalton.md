# Análisis de viabilidad frente al estado actual

Fecha de revisión: 21 de septiembre de 2026. Base local: rama `master`, commit `ad94491`. Los documentos de referencia tienen fecha declarada del 22 de septiembre de 2026; se consideran la propuesta aportada por el propietario, sin atribuirles implementación previa.

**El rediseño es técnicamente viable sobre el repositorio existente. La base Astro se puede conservar, pero el alcance requiere una renovación importante del modelo editorial, las plantillas y las interacciones. La mayor dependencia para terminar E1 es disponer de contenido profesional y literario revisado; la mayor incertidumbre técnica y visual es la escena WebGL.**

La viabilidad de arquitectura es alta. La preparación editorial es parcial. El cumplimiento de rendimiento, accesibilidad y publicación sigue condicionado a implementación y pruebas. No existe evidencia suficiente para comprometer duración, coste o fecha de entrega.

## Evidencia y límites de esta revisión

- Lectura de los ocho documentos originales de `ai_reference`, su imagen visual, `.ai_cache` y el código del sitio.
- Ejecución de `npm run build` con Astro 5.7.0 y Node 20.18.2: éxito; 22 páginas HTML, RSS y sitemap. Astro informó 1,51 segundos de build en este entorno con dependencias ya instaladas. No es una medición de instalación limpia ni del build remoto.
- Avisos existentes: directorio de blog ausente, colección vacía y uso obsoleto de `@import` en Sass.
- Inspección de los enlaces HTML con destinos locales absolutos: no se encontraron archivos o páginas de destino ausentes. No comprueba anclas, enlaces externos, enlaces relativos ni redirecciones HTTP de producción.
- Revisión de catálogos, recursos y dependencias; inspección de HTML generado en portada y landing del libro.
- Consulta de la [portada pública](https://paynalton.tech/es/): el contenido recuperado mantiene la organización anterior. La herramienta informó una captura del mes anterior; no acredita el commit desplegado ni sustituye una inspección visual en navegador.
- No se accedió a la cuenta Netlify, configuración remota, métricas de tráfico, CV externo ni cuerpos de obras alojados en otros servicios. No se ejecutaron Lighthouse, pruebas móviles, lector de pantalla ni pruebas de GPU.

El build regeneró `dist` y archivos auxiliares ignorados. No se modificaron fuentes, dependencias ni configuración. Este informe es el único archivo añadido por este análisis; `ai_reference/` ya estaba sin seguimiento en Git.

## Comparación por área

| Área | Estado comprobado | Brecha para E1 | Valoración |
| --- | --- | --- | --- |
| Arquitectura | Astro 5.7.0, salida estática, npm y lockfile; MDX, sitemap y Vue configurados | Fijar runtime mantenido, validar versiones y reproducibilidad; extender pipeline | Alta viabilidad; base reutilizable |
| Contenido | Texto incrustado en páginas/componentes y cuatro catálogos JSON; colección blog vacía | Colecciones de proyectos, experiencia, obras, términos y perfil; IDs, estados y referencias | Trabajo alto; dependencia central |
| Navegación | Seis páginas por idioma, tres landings del libro y raíz de redirección | Cinco entradas principales, Explorar, términos, detalles y migración de URLs | Alta viabilidad; esfuerzo medio |
| Diseño | Plantilla Bootstrap/Bootsnav y estilos globales; layout editorial del libro separado | Base L0 y ocho composiciones L1–L8; tokens, tipografía, SVG y móvil | Trabajo alto; reutilización visual limitada |
| Proyectos | Siete resúmenes con imagen | Casos con participación, decisiones, resultados y evidencia; filtros | Técnica viable; cierre condicionado a información editorial |
| Trayectoria y CV | Diez etapas laborales en portada; SoDigital figura 2020–2025 | Conciliar fechas, responsabilidades y documentos; crear página y descarga verificable | No se encontró CV PDF en `public`; falta entrada editorial |
| Obra y lectura | Ideas reúne fichas y enlaces externos; una landing con seis descargas | Entidades editoriales, catálogo, lectura, notas y relaciones | Alta viabilidad; textos completos no están incorporados |
| Idiomas | ES, EN y NAH tienen rutas duplicadas; YUA solo catálogo | Resolver traducciones por entidad y revisar calidad/cobertura | Migración necesaria; igualdad de claves no prueba calidad |
| Búsqueda y taxonomía | No implementadas | Pagefind, filtros en URL, términos, relaciones y validación | Alta viabilidad; construir desde cero |
| WebGL | Sin escena ni dependencia Three.js | Escena, recursos, alternativa estática, desactivación y ciclo de vida | Viable con prototipo; fidelidad y presupuesto no demostrados |
| SEO y agentes | Canonical, sitemap, Person y metadatos generales; hreflang en landing del libro | Metadatos por pieza, traducciones reales, JSON/Markdown y llms.txt | Alta viabilidad tras estabilizar el modelo |
| Contacto y redes | Correo y enlaces existentes; sin formulario | Confirmar perfiles, copiar correo, compartir, CV y estados accesibles | Esfuerzo bajo/medio; datos por confirmar |
| Calidad y operación | Build funcional; sin scripts de test/check; sin configuración Netlify/CI encontrada | Tipos, recorridos, accesibilidad, presupuestos, redirecciones y recuperación | Viable; operación remota no verificada |

Fuentes locales principales: `package.json`, `astro.config.mjs`, `src/content.config.ts`, `src/layouts/Default.astro`, `src/components/BaseHead.astro`, `src/components/Header.astro`, `src/components/index/jobs.astro`, `src/pages/es/projects.astro`, `src/pages/es/ideas.astro` y `src/components/books/ToasterBookLanding.astro`.

## Lo que conviene conservar y transformar

Conservar Astro, el gestor npm, el lockfile, el repositorio y la generación estática. La arquitectura no necesita backend permanente para E1. Astro admite despliegue estático en Netlify sin adaptador de servidor; la configuración real de la cuenta aún debe verificarse. [Documentación oficial](https://docs.astro.build/en/guides/deploy/netlify/).

Conservar los recursos publicables, las seis descargas del libro y sus URLs o equivalencias explícitas. La separación de layout y componente compartido de la landing es un patrón aprovechable. Su estilo puede revisarse dentro de la nueva identidad, sin dar por supuesto que deba perder su identidad editorial propia.

Transformar el contenido incrustado en registros independientes de la presentación. Sustituir progresivamente la estructura de páginas duplicadas y los estilos de plantilla por componentes y layouts compartidos. No conviene extender el rediseño copiando cada nueva plantilla tres veces.

No trasladar automáticamente contadores, porcentajes de habilidades, cargos o frases publicitarias como hechos revisados. Las siete fichas de proyectos y las diez etapas laborales ofrecen material inicial, pero no contienen todo lo necesario para los casos solicitados. Tampoco puede deducirse experiencia implementando IA de una lista de herramientas o un ensayo sobre IA.

`jobs` describe hábitos de trabajo, mientras la experiencia laboral está en la portada. Por ello `/jobs/` no debe redirigirse mecánicamente a Trayectoria: necesita equivalencia editorial, posiblemente con una sección de Sobre mí. La landing y las descargas del libro requieren tratamiento explícito en el inventario de migración.

## Condiciones técnicas específicas

### Runtime y dependencias

El build funciona con Node 20.18.2, pero Node 20 figura como EOL en la [tabla oficial de versiones](https://nodejs.org/en/about/previous-releases). Antes de fijar la base de E1 hay que probar una versión mantenida compatible con el conjunto elegido. No es necesario convertir esta tarea en una actualización indiscriminada de todos los paquetes.

No están instalados Three.js, Pagefind, `@astrojs/check`, `@playwright/test` ni `@axe-core/playwright`. TypeScript 5.8.3 aparece en las dependencias instaladas, pero no está declarado como herramienta directa ni existe script de comprobación de tipos. Un build exitoso no acredita ese control.

La caché indicaba que Node no estaba en PATH: en esta sesión sí lo está. Los comandos históricos no deben convertirse en restricciones del nuevo flujo.

### Idiomas y búsqueda

Los cuatro catálogos contienen 213 claves coincidentes. Los 213 valores de `yua` son idénticos a inglés; 17 valores de `nah` y 5 de español coinciden con inglés. Estos últimos recuentos son indicadores mecánicos, no una auditoría lingüística: algunos nombres pueden coincidir legítimamente. YUA no aporta actualmente una traducción diferenciada.

La selección de idioma actual sustituye segmentos de URL con una expresión regular y necesita JavaScript; no consulta equivalencias de contenido. El nuevo modelo debe separar entidad, idioma y slug y tratar explícitamente la ausencia de traducción.

Pagefind separa índices por `html lang`. Admite lenguas sin soporte especializado, pero sin reconocimiento de raíces y con interfaz inglesa si no se localiza. Su tabla no enumera `nah` ni `yua`: habrá que probar consultas reales, variantes y textos de interfaz, sin prometer equivalencia de calidad con español o inglés. Un filtro entre idiomas también requiere decidir cómo seleccionar el índice correspondiente. [Pagefind: búsqueda multilingüe](https://pagefind.app/docs/multilingual/).

### WebGL y fidelidad a la imagen

La imagen aportada fija una dirección visual útil, pero es una composición plana: no proporciona geometría, materiales, iluminación, estados interactivos ni diseño móvil. Alcanzar su riqueza de superficies y relieves requiere producción visual adicional.

Una escena procedural de planos y grecas permite comprobar pronto composición, iluminación y movimiento. La reproducción de todos los relieves y rocas podría exigir texturas o modelos optimizados. El presupuesto de 1,5 MB para biblioteca y recursos completos es una hipótesis de diseño que debe validarse con el prototipo, no una garantía derivada de elegir Three.js.

El renderer actual de Three.js utiliza WebGL 2; no admite WebGL 1 desde r163. El criterio de disponibilidad debe comprobar creación real del contexto y conservar la imagen alternativa. [Three.js: WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).

La especificación y el plan mantienen WebGL en E1. Los fallos técnicos pueden activar la alternativa estática mientras se corrigen, pero no justifican declarar completada E1 sin la escena. Conviene adelantar una prueba técnica mínima de PT10 durante PT04/PT05 para descubrir límites antes de producir todo el arte final.

### Peso y distribución de recursos

`public` contiene aproximadamente 167,73 MiB; el directorio del libro ocupa 147,92 MiB y las imágenes generales 15,91 MiB. `dist` recién construido ocupa 170,09 MiB. Estos tamaños son del artefacto completo, no de lo que descarga un visitante al abrir la portada.

Varias imágenes generales pesan entre 1,3 y 1,8 MiB; la ilustración del libro ronda 1,56 MiB. Se necesitan variantes responsivas y optimización. Las descargas editoriales pueden conservarse como archivos independientes sin precargarlas.

La suma gzip del HTML y CSS/JS locales enlazados directamente es aproximadamente 51,4 KiB en `/es/` y 13,0 KiB en la landing española. Es una inspección parcial del artefacto: excluye recursos externos, fuentes, imágenes y dependencias transitivas. No demuestra cumplimiento del presupuesto inicial ni Core Web Vitals. Sí muestra que el tamaño total del repositorio no equivale al coste de la interfaz.

Como escala de consumo, mil descargas de un archivo de unos 25 MB representan alrededor de 25 GB transferidos. La viabilidad económica depende del tráfico, plan y condiciones reales de Netlify; no se consultaron cuotas ni facturación de la cuenta.

### Calidad, SEO y operación

La portada generada contiene dos elementos `title`, y el layout común repite metadatos generales en páginas distintas. La landing ya resuelve alternativas lingüísticas, pero falta extender una solución coherente por entidad al conjunto.

El menú actual alterna una clase CSS; no implementa en ese código el contrato de Escape, estado expandido y retorno de foco pedido por E1. La búsqueda, los filtros y los estados de error deben diseñarse con sus alternativas desde el principio. No se ha medido conformidad de accesibilidad.

No se encontró configuración local de Netlify o CI. Esto no demuestra que no exista despliegue automático: puede estar configurado en la plataforma. Hay que conocer el mecanismo antes de modificar comandos, publicar una rama o ensayar recuperación.

Las instrucciones de recuperación deben separar fuentes editoriales, medios, configuración y artefacto publicado. La existencia de Git y un build local no demuestra que una restauración remota sea posible.

## Ajustes y ambigüedades del alcance

- Aplicar el reparto explícito E1/E2 de la especificación frente a prioridades genéricas del inventario. Por ejemplo, W16 solo procede si el volumen exige paginación; W29 como control de interfaz es E2, mientras la exportación Markdown sí es E1.
- El mapa incluye una página de detalle de experiencia, pero los layouts y RF07 permiten etapas dentro de la cronología. Resolver si cada experiencia necesita página propia o ancla antes de generar rutas.
- El mapa muestra segmentos españoles para todos los idiomas. Es posible implementarlo así, pero conviene decidir entre segmentos comunes y localizados y documentar la equivalencia; no inferir la respuesta del idioma del texto.
- Mantener el cambio de idioma basado en traducciones disponibles, sin confundir una traducción del menú con la traducción del cuerpo de una obra.
- La imagen visual omite elementos exigidos por los documentos, como algunas utilidades y Sobre mí. La composición final debe integrar esos destinos sin copiar literalmente la maqueta.
- El sitio ya incluye Google Analytics. La propuesta deja la analítica pendiente y no la exige en E1: registrar si se conserva, cambia o retira, sin añadir un segundo servicio por defecto.
- RF19 pide formatos por contenido. Para obras con texto completo únicamente en PDF/EPUB o servicios externos, precisar si la ficha exporta sinopsis y enlaces o si se incorpora el cuerpo revisado. No asumir que una descarga binaria ya satisface el lector HTML.

## Dependencias editoriales y viabilidad operativa

Se puede empezar el inventario, modelo, diseño y prototipos con el material actual. Para cerrar las páginas habrá que conciliar el titular profesional y la cronología, seleccionar casos con participación y resultados verificables, localizar el CV publicable y reunir los textos de las obras elegidas.

También hacen falta perfiles sociales confirmados y revisión lingüística de las versiones que se publiquen. Los documentos mencionan un CV adjunto en una conversación anterior; ese archivo no aparece entre las referencias recibidas ni entre los PDF públicos del repositorio revisado.

El alcance inicial no exige comprar servicios de IA, operar una base de datos o crear un CMS. La edición por archivos es compatible con el proyecto, aunque incorpora disciplina nueva: validar contenido y regenerar páginas, búsqueda y exportaciones juntos. La mayor carga de mantenimiento será editorial, de traducción y de recursos, además de las actualizaciones técnicas.

No es responsable asignar días o presupuesto sin cerrar volumen de piezas, idiomas revisados, fidelidad del 3D, disponibilidad editorial y operación remota. En complejidad relativa, contenido/migración, diseño y WebGL son altos; búsqueda, relaciones y exportaciones son medios una vez estable el modelo; contacto básico es bajo/medio.

## Secuencia recomendada y criterios para continuar

1. **Completar PT01/PT02:** guardar el inventario de rutas y recursos, conciliar fuentes editoriales y verificar configuración de publicación. Resultado: mapa de migración y lista concreta de información faltante. Esta revisión aporta el diagnóstico inicial, pero no cierra ambos paquetes.
2. **PT03 y PT04 con muestra real:** estructurar un proyecto, una experiencia, una obra y un término; preparar portada, caso y lectura en escritorio/móvil. Validar un prototipo temprano de escena y búsqueda en los idiomas previstos.
3. **PT05/PT06:** construir una ruta completa desde portada hasta caso, término y contacto; generar HTML, JSON y Markdown desde la misma fuente. Rechazar referencias inválidas y excluir borradores de todas las salidas.
4. **PT07–PT11:** ampliar solo patrones ya comprobados, completar contenido e idiomas disponibles, integrar escena, búsqueda y redirecciones. Preservar descargas y equivalencias del libro.
5. **PT12–PT14:** comprobar recorridos, accesibilidad, peso y fallos; verificar recuperación y candidato de publicación. La viabilidad técnica de este informe no equivale a aceptación ni autorización de despliegue.

**Recomendación:** avanzar con el alcance E1 propuesto mediante entregas verificables. Conservar la plataforma y renovar de forma progresiva el modelo y la presentación. Antes de extender plantillas, reducir las dos incertidumbres principales con un caso editorial completo y una prueba móvil del Taller nocturno. La implementación puede comenzar con el material existente; su cierre requiere los datos y verificaciones señalados.
