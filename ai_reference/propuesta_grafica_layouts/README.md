# Propuesta gráfica de layouts — Taller nocturno

Abrir **index.html** en un navegador. Galería de once composiciones: L0 compartido, L1–L8 y dos variantes adicionales de L2. Incluye capturas completas de escritorio y móvil.

## Cómo revisar

- Abrir Inicio y recorrer las páginas mediante la navegación real de la propuesta.
- Activar **Mostrar zonas** para ver los nombres de las zonas y los widgets que las componen.
- Revisar las capturas o cambiar el ancho del navegador.
- Probar el menú móvil, los filtros, la búsqueda de muestra, los detalles de lectura y los enlaces de índice.

## Decisiones aplicadas

La propuesta reutiliza el lenguaje y los componentes de la galería de widgets. El contenido está compuesto en páginas completas; no son capturas de widgets apiladas. Conserva las once etapas profesionales, los tres destacados y la distinción entre proyectos, obra y voz personal.

El CV no aparece como descarga disponible. La biblioteca utiliza ejemplos identificados y sustituibles. Las obras aplazadas no aparecen. No hay formulario de envío, servicios remotos obligatorios ni repositorios privados. La escena es un estudio CSS/SVG inmóvil, no la implementación WebGL final.

L0 demuestra el marco común sobre una página auxiliar. L2 muestra seis proyectos para evaluar el catálogo; solo Pipila tiene caso detallado en esta propuesta. L2-obra y L2-explorar muestran los otros usos del mismo layout. L5 prueba composición editorial y continuidad con texto de muestra, sin atribuirlo a una obra real.

Los visores, el grafo y las preferencias avanzadas posteriores se omiten. Los bloques condicionales no se rellenan con datos inventados. Las relaciones disponibles se presentan como enlaces explicados. Tipografías de muestra locales: Atkinson y Georgia, sustitutas provisionales de Manrope y Fraunces.

## Zonas y componentes

Cabecera común: W01, W02, W03 y W05. Contexto: W06. Pie: W07 y W08. Las demás zonas se detallan a continuación.

| Layout | Propuesta | Zonas y widgets |
| --- | --- | --- |
| L0 | Base compartida | Contexto (W06); Contenido de una página auxiliar (Contenido editorial) |
| L1 | Inicio | Presentación y escena del taller (W09 · W10 · W13); Proyectos destacados (W11); Selección configurable de obras (W11 · W23); Síntesis personal (Contenido editorial · W13); Invitación a conversar (W13) |
| L2 | Catálogo de proyectos | Contexto (W06); Encabezado de colección (Contenido editorial); Selección y listado (W05 · W11 · W14 · W15 · W30); Búsqueda y filtros (W05 · W14); Estado de resultados (W15); Invitación a conversar (W13) |
| L2-obra | Catálogo de obras | Contexto (W06); Encabezado editorial (Contenido editorial); Selección editorial (W11 · W23); Catálogo configurable (W05 · W11 · W14 · W15); Búsqueda y filtros (W05 · W14); Estado de resultados (W15) |
| L2-explorar | Explorar y buscar | Contexto (W06); Consulta global (W05); Filtros y resultados (W05 · W14 · W15 · W11); Búsqueda y filtros (W05 · W14); Estado de resultados (W15) |
| L3 | Caso de proyecto | Contexto (W06); Encabezado del proyecto (Contenido editorial); Ficha de participación (W17); Contexto, decisiones y resultados (Contenido editorial); Capacidades y relaciones (W20 · W30 · W32); Compartir y continuar (W13 · W35) |
| L4 | Trayectoria profesional | Contexto (W06); Resumen profesional (W09); Cronología y detalle (W21); Capacidades transversales (W20 · W32); Formación y comunidad (Contenido editorial · W08); Invitación a conversar (W13) |
| L5 | Publicación y lectura | Contexto (W06); Ficha y presentación de obra (W23); Índice y lectura (W24 · W27); Índice y continuidad (W28); Temas y lecturas relacionadas (W30 · W32) |
| L6 | Tema y relaciones | Contexto (W06); Identidad del término (W31); Contexto y relaciones (W31 · W32); Proyectos asociados (W11 · W20 · W30); Experiencia vinculada (W20 · W32); Continuación (W13) |
| L7 | Sobre mí | Contexto (W06); Identidad (Contenido editorial); Biografía e intereses (Contenido editorial); Forma de trabajar (Contenido editorial · W20); Lecturas y pensamiento (Contenido editorial · W32); Perfiles y continuación (W08 · W13); Invitación a conversar (W13) |
| L8 | Contacto | Contexto (W06); Invitación y canal principal (W13 · W34); Contacto profesional y otros espacios (W08); Recursos profesionales (W13) |

## Archivos de revisión

`capturas/escritorio/` y `capturas/movil/` contienen las láminas completas. `resumen.png` reúne las once composiciones. `manifest.json` registra las zonas. `verificacion.json` recoge comprobaciones locales de desbordamiento, enlaces e interacción; no acredita conformidad completa de accesibilidad ni despliegue.

`generar.py` reconstruye las propuestas. `capturar.mjs` produce las capturas con Chrome local y comprueba los recorridos. El sitio existente y los widgets originales no se modifican.
