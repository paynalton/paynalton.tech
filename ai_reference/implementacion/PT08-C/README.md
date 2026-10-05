# PT08-C — Incorporación editorial

## Resultado

El corpus confirmado se incorpora al sitio estático en español. La biblioteca contiene 111 obras: el libro existente y 110 textos nuevos con lector, categorías, temas, procedencia y descargas Markdown/JSON. Las fichas y los cuerpos siguen separados por idioma; los nuevos mensajes de interfaz están en el diccionario español.

El contenido completo del libro existente no se ha reconstruido desde sus descargas: conserva su ficha histórica y sus seis PDF/EPUB. Los textos recibidos se publican tal como están, identificando los dos manuscritos parciales.

| Categoría | Textos nuevos |
| --- | ---: |
| Cuentos | 43 |
| Poesía y prosa poética | 19 |
| Críticas | 17 |
| Reflexiones filosóficas | 12 |
| Textos técnicos | 8 |
| Crónicas y notas personales | 6 |
| Presentaciones editoriales | 3 |
| Texto académico | 1 |
| Humor y sátira | 1 |
| **Total** | **110** |

De 125 archivos de contenido, seis permanecen excluidos y nueve variantes se consolidan en ocho publicaciones. Los 15 auxiliares no generan obras. Los originales de `materiales` permanecen intactos; [importacion.json](importacion.json) registra fuente, ID editorial, variantes, URL y hashes de cada texto incorporado.

## Decisiones aplicadas

- Alma y Blanco, Negro y Gris continúan fuera. No se incorporan M017–M020, M031 ni M032, conforme al [corpus confirmado](../PT08/Corpus_PT08-C.md). Los dos últimos se mantienen fuera por su pertenencia probable; no se presentan como cuentos independientes.
- No se recuperan los materiales retirados por autoría ajena ni las imágenes de los blogs.
- «Mi querido Árbol» conserva la coautoría **Paynalton y Paoz**, también en sus descargas.
- «Capitalismo vs Dinerismo» y «El dios en que Yo Creo» muestran el aviso de manuscrito parcial. Las presentaciones de blogs se distinguen como presentaciones de archivo.
- Se conservan relaciones entre las entregas de Drizz del Vapor, Hada y caballero, Montaña Plateada y LATAM. No se inventan capítulos ni se fusionan sus cuerpos.
- Dos entradas sin título reciben títulos descriptivos: «Paquetes y dependencias en GNU/Linux» y «Usuarios y permisos en GNU/Linux». El título de M138 se normaliza como «Se solicita ingeniero FTL humano»; el cuerpo no se reescribe.
- Los resúmenes de catálogo son texto editorial separado del original. Los destacados iniciales son el libro existente, «Legado» y «Susurros en la Oscuridad»; son configurables.

| Grupo de versiones | Publicación elegida | Material |
| --- | --- | --- |
| V01 | Mamá, entrada del blog | M007 |
| V02 | La Bestia de Metal, publicación original en Paynalton | M070 |
| V03 | Hojas Secas, entrada del blog | M023 |
| V04 | 11 de Junio, entrada del blog | M041 |
| V05 | El Estupor Mexicano, entrada del blog | M061 |
| V06 | HOWTO Novia, entrada del blog | M062 |
| V07 | El Jardín, entrada del blog | M066 |
| V08 | Horda LATAM, versión ampliada publicada en Reddit | M132 |

## Implementación

- Biblioteca con índice y agrupación por categorías, lector para textos independientes, preferencias de tamaño y superficie, y alternativa funcional sin JavaScript.
- 175 términos nuevos para las categorías y etiquetas existentes; 185 términos totales. Cada término permite navegar a sus textos y filtrar la búsqueda.
- 220 descargas nuevas bajo `/es/obra/{slug}/index.md` e `index.json`. La proyección contiene únicamente datos públicos y el cuerpo publicado; conserva autoría, procedencia y condición parcial.
- HTML editorial reducido a elementos de texto, tablas y enlaces seguros. Se retiran atributos de presentación heredados y contenido activo; los ejemplos de código y HTML escapado permanecen literales. Las tablas permiten desplazamiento horizontal dentro del lector.
- Los ejemplos siguen disponibles únicamente en la compilación de revisión; se retiraron de las selecciones de producción. Las pruebas fijan explícitamente su propia selección para no depender del catálogo real.
- El importador usa la biblioteca estándar de Python; no añade servicios ni dependencias al sitio. `python3 scripts/import-editorial.py` regenera los datos de este corpus aprobado. Si cambia la selección editorial, hay que revisar primero sus decisiones de versiones/exclusión y el manifiesto de materiales. Reejecutarlo sustituye los datos generados, incluidos sus resúmenes y destacados iniciales.

## Verificación

- `astro check`: cero errores y advertencias; cuatro sugerencias heredadas.
- Modelo: **68 pruebas aprobadas**. Importación: **3 pruebas aprobadas**, con hashes de los 140 archivos y conservación de palabras en los 110 textos incorporados.
- Navegador: **111 aprobadas y una omisión prevista** (menú móvil en escritorio); escritorio y móvil, con Chrome y un worker. Incluye revisión de los 110 lectores y 220 descargas.
- Revisión visual, lectura, traducciones sintéticas y RTL: **51 aprobadas** en tres tamaños.
- Build normal: **337 HTML**, **244 exportaciones** (24 de proyectos y 220 de obras) y **311 documentos Pagefind**. Se verificaron 608 archivos textuales públicos y los 311 fragmentos descomprimidos del índice.
- Variante sin efectos: las **337 páginas** conservan el mismo contenido principal y el mismo índice, sin módulos opcionales. Se mantienen los límites comprobados de recursos PT10.
- Instalación reproducible con Node 24.21.0/npm 12.0.2; la auditoría de `npm ci` informó cero vulnerabilidades.

Las comprobaciones son locales y automatizadas; no sustituyen la revisión editorial del propietario, las pruebas físicas de rendimiento ni la validación del alojamiento en PT11–PT14.

Comprobaciones añadidas: conservación de las palabras y hashes de los 110 originales; código literal y HTML seguro; consolidación y exclusiones; coautoría, parciales y series; igualdad entre cuerpo publicado y descargas; disponibilidad de todos los lectores y archivos; búsqueda por texto completo y etiquetas; preferencias persistentes, lectura sin JavaScript, accesibilidad y ancho a 320 px con texto al 200 %.

Las pruebas de seguridad del HTML distinguen los estilos editoriales retirados de los colores y desplazamiento que Astro añade a los bloques de código. Se corrigió el ajuste de etiquetas largas en los enlaces relacionados del lector.

## Revisión local y continuación

Biblioteca: `/es/obra/`. Ejemplos: `/es/obra/legado/`, `/es/obra/mi-querido-arbol/`, `/es/obra/aritmetica-con-numeros-indeterminados/` y `/es/obra/capitalismo-vs-dinerismo/`.

La selección se configura en `src/data/site/selection.json`; títulos, resúmenes y rutas en `editorial/es.json`; textos en `bodies/es/obras`. Los originales e informes de incorporación no se copian al artefacto público.

Sigue **PT11: SEO, exportaciones y migración final**. La intensidad y velocidad de efectos permanecen para el afinado previo a publicación; el CV sigue en POST01. Esta entrega es local, sin despliegue ni commit.
