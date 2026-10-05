---
editorial:
  id: M002
  category: documentacion
  tags:
  - documentacion
  - inventario
---
# Archivo local de blogs

Se descargaron las **99 entradas públicas** de los cinco blogs enumerados en `../blogs.md`. Se comprobaron sus identificadores únicos. Tras la revisión de autoría se conservan **94 entradas**; se retiraron cinco textos de terceros, traducciones o reproducciones. Se mantienen las coautorías declaradas.

| Blog | Entradas |
| --- | ---: |
| [Cuentos de Sangre y Muerte](cuentosdesangreymuerte/INDICE.md) | 6 |
| [Drizz del Vapor - Vida y obra de un goblin](drizzdlvapor/INDICE.md) | 2 |
| [Mis otros relatos](misotrosrelatos/INDICE.md) | 30 |
| [La Montaña Plateada](montanaplateada/INDICE.md) | 12 |
| [Paynalton](paynalton/INDICE.md) | 44 |
| **Total** | **94** |

Descarga de fuentes: 2026-09-30T00:31:36Z a 2026-09-30T00:31:37Z.

## Contenido

- Un Markdown por entrada, dentro de la carpeta de su blog. Los nombres incluyen fecha, slug e identificador original para evitar colisiones.
- Cabecera con título, publicación, última actualización, URL original, autores, etiquetas e ID de Blogger.
- `fuente-blogger.json` en cada blog: copia del feed con el HTML de las entradas conservadas. Todas las fuentes se depuraron para retirar imágenes; las de Mis otros relatos y Paynalton también se depuraron por autoría; `local_filter` registra el cambio y los recuentos originales.
- `entradas.json`: inventario de las 94 entradas conservadas, rutas locales, procedencia y hashes SHA-256; el campo `images` queda vacío.


## Fidelidad y límites

Se comparó el texto visible del HTML con la conversión y con una segunda lectura del Markdown: **99 entradas verificadas originalmente, cero discrepancias de texto**, normalizando únicamente espacios y Unicode para la comparación. No se corrigieron redacción ni ortografía. Se conservan `<br>` y, en casos puntuales, etiquetas de énfasis compatibles con Markdown para representar saltos y formatos antiguos sin perder signos o texto de código.

Se mantienen las versiones publicadas de cada blog aunque existan textos repetidos en otros blogs o materiales. Los títulos originales, incluidos los que aparecen como «Untitled», se conservan.

Se retiraron las 83 imágenes locales y las referencias a imágenes externas de los Markdown y feeds. Los ejemplos de código conservan sus cadenas literales, que no cargan recursos visuales. No se descargaron los videos incrustados: se conservaron sus enlaces y el marcado original está en las fuentes JSON. Los comentarios y los destinos de enlaces externos no forman parte de las entradas archivadas.

Estos archivos son materiales de referencia. Su descarga no los incorpora a la selección publicable del sitio.
