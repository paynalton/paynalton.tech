# Versión inglesa del sitio

Implementado y validado localmente. No desplegado.

La versión inglesa reutiliza las plantillas, estilos, escenas y comportamientos de la versión española. Se genera durante `npm run build` en `dist`, sin consultar Babilonia desde el navegador o desde Netlify.

Las secciones usan `/en/`, `/en/projects/`, `/en/experience/`, `/en/works/`, `/en/about/`, `/en/contact/`, `/en/explore/` y `/en/topics/`. Los identificadores y slugs de las publicaciones se conservan para mantener su identidad; el selector enlaza equivalentes por identificador, no por sustitución de textos. La ficha del libro conserva su URL histórica. `/en/jobs/` y `/en/ideas/` migran a sus destinos actuales.

## Traducción y revisión

`scripts/translate-babilonia.py` utiliza la pasarela local de Babilonia (`es-MX` → `en-US`, `qwen3-8b`). Traduce únicamente las entidades públicas; los ejemplos y obras excluidas no se incorporan. Conserva identidad, autoría, hechos, archivos de edición y relaciones. Divide los cuerpos largos, valida marcadores, enlaces y HTML, y conserva bloques de código. La caché por contenido y los identificadores de solicitud se guardan en `.ai_cache/babilonia/`, fuera del artefacto publicado y de Git.

Los archivos traducidos se escriben en `src/data/site/ui/en.json`, `src/data/site/editorial/en.json` y `src/data/site/bodies/en/`. No se escriben catálogos completos mientras existan fragmentos fallidos. La traducción por lotes no habilita el idioma automáticamente.

`scripts/review-english.py` aplica `ui-review.json`: ajustes de navegación, redacción de portada, terminología, lectura y títulos establecidos. Conserva el título de la edición inglesa existente del libro. Para referencias de terceros se verificaron los títulos [Atlas Shrugged](https://www.penguinrandomhouse.com/books/296832/atlas-shrugged-centennial-ed-hc-by-ayn-rand/9780525948926/) y [Embers / El último encuentro](https://www.penguinrandomhouse.com/books/779329/el-ultimo-encuentro--embers-by-sandor-marai/) en el catálogo de su editorial.

La traducción automática conserva una revisión editorial pendiente de los textos literarios completos. Las comprobaciones estructurales no equivalen a una lectura lingüística exhaustiva.

## Reproducción local

Con Babilonia iniciado según su `README.ai`:

```sh
python3 scripts/translate-babilonia.py
python3 scripts/review-wrapped-english.py
python3 scripts/review-english.py
python3 scripts/check-english-text.py
npm run check
npm run check:content
npm run test:content
npm run build
npm run check:publication
npm run check:search
```

La traducción se ejecuta solo al preparar contenidos. Un build habitual usa exclusivamente los archivos ya guardados en este repositorio. Las ediciones PDF/EPUB existentes del libro no se regeneran.

## Resultado y comprobaciones

- Babilonia iniciado con Docker Compose; disponibilidad e inferencia comprobadas. La pasarela permanece en `http://127.0.0.1:8081`.
- 319 entradas y 319 cuerpos ingleses; 349 claves de interfaz. 515.326 caracteres originales en los cuerpos. Ejemplos y obras aplazadas excluidos.
- 3.632 unidades de traducción inicial, sin pendientes técnicos. Identificadores de solicitudes en `translation-run.json`; los registros completos permanecen en Babilonia y en la caché local.
- Revisión contextual adicional de 45 párrafos de seis textos antiguos: sus saltos HTML dividían frases. `review-wrapped-english.py` traduce el párrafo completo y distribuye los saltos sin cambiar su cantidad; `wrapped-review.json` permite reaplicar esos resultados con verificación del original. `body-review.json` conserva correcciones puntuales de terminología, nombres propios y ejemplos técnicos.
- `check`, `check:ui`, `check:content` y los 13 archivos de pruebas de contenido aprobados. Verificación de estructura, enlaces, bloques de código y restos del modelo aprobada; `text-check.json` sin alertas de longitud o comentarios del modelo.
- Build estático aprobado: 648 páginas, 639 URLs canónicas, 622 documentos Pagefind, 1.276 exportaciones y 222 entradas RSS. Ocho reglas de migración. Comprobaciones de publicación, búsqueda, exportaciones y artefacto aprobadas.
- Navegador: 53 pruebas aprobadas y una omisión prevista por dispositivo en idiomas, rutas heredadas, búsqueda y publicación. Bloque adicional de inglés/CSP: 10 aprobadas, incluido recorrido de todas las páginas con las cabeceras generadas. Tras la revisión contextual se repiten las seis pruebas inglesas.
- Accesibilidad automatizada y composición en escritorio/móvil, 320 px y texto ampliado. Capturas en `capturas/`. No se regeneraron las referencias visuales históricas ni se afirma una comparación píxel a píxel.

Se corrigió la generación de descargas, que aún tenía segmentos españoles fijados en las rutas de Astro. Ahora usa la ruta de cada entidad localizada y se comprueba que no queden exportaciones adicionales bajo `/en/proyectos/` o `/en/obra/`. Las comprobaciones de pruebas que asumían inglés deshabilitado se adaptaron al catálogo bilingüe; las muestras sintéticas siguen aisladas del contenido real.

Preview: http://localhost:4331/en/. `npm run build` conserva la salida `dist`. No hay referencias al endpoint del traductor en los HTML, JS o JSON publicados. La CSP se comprueba localmente; esto no acredita despliegue ni cabeceras remotas de Netlify/Cloudflare. La revisión literaria completa sigue pendiente y esta entrega no sustituye esa lectura editorial.
