# Publicación de La tostadora en Amazon

## Decisiones del propietario — 25 de octubre de 2026

ASIN suministrados mediante captura KDP; el propietario confirmó que el primer grupo corresponde al inglés.

| Edición | Kindle | Tapa blanda | Tapa dura |
| --- | --- | --- | --- |
| Español | B0HP2JQ1PZ | B0HP25FVYG | B0HP29YHJ6 |
| Inglés | B0HP33J62S | B0HP3HSF82 | B0HP5N61D4 |

Retirar descargas públicas PDF/EPUB en español e inglés; conservar náhuatl. La captura muestra KDP Select en español. No inferir del recorte la inscripción del inglés: su retirada fue solicitada explícitamente.

## Implementación

- Catálogo en `src/data/site/amazon-book.json`; países por formato, ASIN por idioma.
- Ficha editorial ES/EN con portada real, presentación e índice en dos columnas, selección visual de idioma/formato, tarjetas enlazadas por tienda y botón de compra. Se inicia con el idioma de página. Kindle, tapa blanda y tapa dura con enlaces de compra públicos `https://www.amazon.<dominio>/dp/<ASIN>`, no enlaces del panel KDP.
- Kindle español enlaza inicialmente a México; resto de botones iniciales a Estados Unidos. Cada combinación de idioma/formato tiene su panel prerenderizado con todas sus tiendas; JavaScript solo filtra su visibilidad. En móvil, un combobox permite cambiar el destino del CTA. Las tarjetas de país son enlaces directos. Sin JavaScript se muestran las seis combinaciones completas. Idioma del libro y país de la tienda son selecciones independientes.
- No se publican precios ni se garantiza stock/envío por país; consultar Amazon. No se verificó cada ficha pública remotamente: los ASIN y la publicación proceden del propietario.
- Enlaces externos con nueva pestaña, rel seguro e indicador visual del sitio. Textos y países en diccionarios ES/EN.
- JSON-LD del libro incluye las seis ediciones, formato, idioma e identificador ASIN; no inventa ISBN, precio ni disponibilidad.
- Cuatro PDF/EPUB ES/EN retirados de public y del catálogo de descargas; no basta con ocultar enlaces. Netlify recibe cuatro reglas 301 hacia la ficha del idioma correspondiente. En preview Astro las antiguas URLs responden 404, porque no ejecuta reglas Netlify.
- Náhuatl conserva sus dos archivos y su página histórica. En la ficha ES el título y el botón indican «Descarga Gratis» (PDF/EPUB); en EN, «Download for Free». Exportaciones JSON/Markdown del libro contienen la presentación, no el texto completo de los PDF/EPUB retirados. El historial Git y archivos ajenos al artefacto público no se reescriben.

## Fuentes consultadas

- [KDP Select: exclusividad digital](https://kdp.amazon.com/en_US/select): incluye la distribución desde el sitio propio.
- [Distribución de tapa blanda y tapa dura](https://kdp.amazon.com/en_US/help/topic/G201834280): tapa dura no incluye Japón ni Australia; Canadá depende de su disponibilidad en Estados Unidos. México, Brasil e India no son tiendas KDP de impresión.

Los dominios y países se configuran por formato; no se aplica la lista de tapa blanda a tapa dura. Disponibilidad comercial efectiva y entregas deben comprobarse en Amazon.

## Validación local

- Astro check: 0 errores y 0 advertencias (4 hints existentes); diccionarios aprobados.
- 15 archivos de pruebas de contenido aprobados.
- Build final: 696 páginas; publicación, enlaces/anclas y metadatos aprobados.
- Verificación directa del artefacto: seis ediciones en JSON-LD por idioma, cuatro binarios ES/EN ausentes y archivos náhuatl idénticos a los originales.
- Navegador: ocho casos de lectura aprobados y cuatro casos de Amazon aprobados en la repetición final, ES/EN en escritorio/móvil, navegación sin JavaScript, enlaces externos, descargas náhuatl, accesibilidad y ancho 320 px con texto al 200 %.
- Corregido desbordamiento del nombre Netherlands con texto ampliado. La auditoría axe se ejecuta con JavaScript habilitado, separada de la comprobación de navegación sin scripts; la ampliación de texto sin scripts utiliza el protocolo del navegador sin esperar eventos de carga de estilos deshabilitados.

Los binarios retirados y las redirecciones cambian en producción cuando Netlify despliega esta versión. No se afirma disponibilidad o stock real en todas las tiendas de Amazon.

### Ajuste de selectores

Build y publicación aprobados tras compactar el panel. Cuatro casos ES/EN en escritorio/móvil aprobados: cambio de ASIN por idioma/formato, exclusión de México/Japón en tapa dura, selección de tienda, botón gratuito PDF/EPUB, alternativa sin scripts y accesibilidad a 320 px/200 %.

### Rediseño editorial a partir de referencias

Se reemplazó la escena WebGL de la ficha por una portada con volumen mediante CSS; la escena del catálogo se conserva. Las portadas ES/EN/Náhuatl son renders de la primera página de los PDF originales del autor, sin cambios en el texto de la imagen. El bloque gratuito conserva únicamente PDF/EPUB en náhuatl. La ficha incluye anclas a compra y presentación, índice numerado y enlaces relacionados en tarjetas.

SEO: las 78 URLs únicas de Amazon se emiten como enlaces `a href` en cada HTML ES/EN; ninguna depende de una petición, un evento de clic o generación en JavaScript. Los enlaces permanecen accesibles sin scripts y cada tienda abre directamente su ficha. No se garantiza la indexación por buscadores.

Validación del rediseño: build estático de 696 páginas, comprobación de publicación y 15 pruebas de contenido aprobadas. Pruebas Amazon comprueban 78 destinos únicos directamente en la respuesta HTML de ES/EN, navegación sin scripts, seis paneles de edición/formato, ASIN correctos, selector móvil, descarga gratuita y ausencia de desbordamiento a 320 px con texto al 200 %.

Resultado final: 12/12 casos de navegador aprobados (escritorio y móvil), incluida auditoría automatizada de accesibilidad. La comprobación corresponde al artefacto local.

### Índice editorial corregido

Se cotejó `tostadora/src/es/index.md` y su equivalente `src/en-us/index.md`: contienen 14 capítulos agrupados en cinco partes, además de apertura y cierre. La ficha ES/EN ahora muestra los 14 títulos de capítulo en su orden original bajo «Los 14 capítulos del libro» / «The 14 chapters of the book». La presentación aclara la agrupación en cinco partes. No se publica el cuerpo de los capítulos.

### Lista de capítulos con desplazamiento

La lista permanece completa en el HTML, dentro de un contenedor con scroll manual. En escritorio tiene una altura máxima de 20 rem y movimiento automático de 10 px/s, con inversión de dirección y pausa de 2,5 segundos en los extremos. Se pausa al pasar el cursor, enfocar la lista o interactuar manualmente. Un botón permite pausar/reanudar. No se anima fuera de pantalla, con la pestaña oculta o con movimiento reducido. En móvil se muestra completa. Controles traducidos en ES/EN. Verificación local en Chrome de movimiento, pausa/reanudación, movimiento reducido y móvil aprobada en ambos idiomas.

Ajuste responsive: hasta 1024 px, cabecera y presentación en una sola columna; la portada ocupa una fila debajo del texto. Los capítulos se muestran completos, sin límite de altura ni scroll interno. La animación y su botón solo se habilitan desde 1025 px. Comprobación local ES/EN a 390, 768, 1024 y 1280 px, con y sin JavaScript.

### Preparación de publicación en master

Se incluyen los CV editoriales nuevos del propietario (ES corregido y EN), conservando sus URLs existentes. Ambos archivos de `dist/cv` coinciden byte a byte con `public/cv`. Controles de descarga náhuatl alineados horizontalmente en escritorio. Validación final: Astro check y diccionarios, 15 pruebas de contenido, build de 696 páginas, publicación/enlaces y 12 pruebas de navegador aprobados. Capturas del libro actualizadas. El despliegue remoto queda a cargo del pipeline de master; estas pruebas no acreditan su finalización.
