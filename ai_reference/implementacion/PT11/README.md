# PT11 — Publicación de contenido, SEO y migración

## Entrega local

Se completa la capa de publicación para `https://paynalton.tech`, con alojamiento Netlify y DNS Cloudflare confirmados por el propietario. No se modifican cuentas, DNS ni configuración remota, y no se despliega el sitio.

El HTML sigue siendo estático. Las redirecciones y cabeceras se preparan como configuración declarativa del alojamiento existente; no se incorporan funciones, backend ni servicios adicionales.

## Contenido y formatos públicos

- `publication.mjs` reúne el origen canónico, las rutas históricas conservadas, la matriz de migración y la proyección de formatos. El sitemap se filtra con las rutas publicables; los índices y exportaciones usan la misma selección de entidades.
- 319 entidades públicas generan **638 archivos Markdown/JSON**. Se conservan los 244 formatos anteriores y se completan 394: 185 términos, once etapas y la ficha del libro, dos formatos por entidad. Las etapas conservan su canonical con ancla en Trayectoria y exportan bajo `/es/trayectoria/{id}.md` o `.json`.
- `/catalog.json` identifica entidad, idioma, tipo, título, canonical y formatos disponibles, en orden estable. `/llms.txt` enlaza los Markdown públicos y conserva las agrupaciones por idioma; es un índice complementario, sin prometer tratamiento especial por buscadores o agentes.
- `/rss.xml` mantiene su dirección e incluye las 111 obras publicadas. Usa títulos, autoría, resúmenes y enlaces actuales. No inventa fechas completas a partir de años ni convierte la fecha del build en fecha editorial.
- La ficha del libro exporta su presentación y los enlaces a sus seis ediciones PDF/EPUB; no pretende contener el manuscrito completo. Los originales, las exclusiones y las decisiones de PT08-C se mantienen.
- Las páginas basadas en el modelo anuncian sus formatos con enlaces `rel="alternate"` cuando existen. Los capítulos futuros usan identidad de obra/capítulo y su propia URL de exportación.

## Metadatos y descubrimiento

- Títulos y descripciones específicos para las páginas del modelo, con interfaz y textos SEO en el diccionario. Canonical y URLs sociales se construyen desde la ruta publicada y el dominio configurado, sin parámetros del visitante.
- Open Graph y tarjeta social con imagen general local. JSON-LD describe WebSite, WebPage, ProfilePage, ContactPage, CollectionPage, Book, CreativeWork, DefinedTerm y BreadcrumbList según el contenido visible. La coautoría se representa como dos autores; no se inventan fechas, evaluaciones ni credenciales profesionales.
- JSON-LD se serializa escapando `<` y separadores Unicode para impedir que un texto cierre su elemento `script`.
- **330 URLs canónicas** en el sitemap. Se excluyen la entrada de transición, las cinco rutas antiguas españolas, 404, formatos de datos y vistas de revisión.
- `hreflang` solo relaciona versiones existentes. El libro conserva las tres versiones reales ES/EN/NAH y equivalencias recíprocas. Las páginas históricas EN/NAH se conservan como HTML en sus URLs; no se presentan como traducciones del contenido nuevo ni se inventan exportaciones para ellas.
- Se corrige el título duplicado del encabezado antiguo, se distinguen sus secciones y se usan URLs canónicas para sus metadatos sociales.
- `robots.txt` publica el sitemap y excluye la zona de revisión. La compilación de revisión usa `Disallow: /`. Esto controla rastreo, no constituye un mecanismo de acceso privado.

## Flujo de publicación existente

El propietario confirma un pipeline vinculado a GitHub: al subir cambios a `master`, compila HTML estático y publica automáticamente en Netlify. No se encontró `.github/` en este checkout. PT13 revisará sus comandos, runtime, validaciones y artefacto enviado; debe comprobarse cómo se aplican `_redirects` y las cabeceras preparadas, sin asumir que `netlify.toml` gobierna una compilación externa. Push o integración en `master` constituye el disparador de publicación de PT14. No se ha ejecutado esa acción.

## Migración

| Origen | Destino final | Regla preparada |
| --- | --- | --- |
| `/` | `/es/` | 301 forzada |
| `/es/projects/` | `/es/proyectos/` | 301 forzada |
| `/es/jobs/` | `/es/sobre-mi/#forma-de-trabajar` | 301 forzada |
| `/es/about/` | `/es/sobre-mi/` | 301 forzada |
| `/es/ideas/` | `/es/obra/` | 301 forzada |
| `/es/contact/` | `/es/contacto/` | 301 forzada |

El build genera `dist/_redirects` con las seis migraciones y variantes sin barra final para las cinco rutas españolas. `301!` evita que el HTML antiguo o las páginas de transición oculten la regla en Netlify. No hay cadenas, bucles ni una reescritura general a Inicio.

Las páginas de transición tienen enlace explícito y meta refresh para la vista previa estática, canonical al destino y `noindex`. Este comportamiento de vista previa no se confunde con una respuesta HTTP 301. Se conservan las anclas `profile`, `experience`, `skills` y `softskills` de Inicio; los fragmentos no se envían al servidor y se mantienen en el HTML.

EN/NAH, la URL histórica del libro, sus seis descargas, el RSS y las direcciones del sitemap se mantienen. Netlify podrá usar `404.html` para destinos inexistentes; no se añade un fallback de aplicación que los convierta en respuestas 200.

`netlify.toml` fija `npm run build`, `dist`, Node 24.21.0 y npm 12.0.2. Astro copia `public/_headers` a `dist/_headers`, que prepara `nosniff`, política de referencia y tipos de contenido para Markdown/JSON; los formatos de datos reciben `X-Robots-Tag: noindex` para priorizar sus páginas HTML. La validación remota de redirecciones, cabeceras, HTTPS y posibles reglas del proxy Cloudflare queda para PT13/PT14. Solo se confirmó Cloudflare como DNS; no se supone activado su proxy.

## PUB-01 y PUB-02

La imagen social de 1200 × 630 combina la marca, el nombre, «Software, ideas y escritura», el dominio y un render local de la escena. Se conserva el margen seguro y el objetivo de menos de 250 KB. [Vista previa](../../../public/taller/publication/social-es.png).

La greca existente genera `favicon.svg`, `favicon.ico` con tamaños 16/32 y `apple-touch-icon.png` de 180 × 180. No se usan imágenes de los blogs. `npm run render:publication` reproduce los archivos con Chrome, fuentes locales y el render del taller; no necesita servicios de generación. `social-preview.html` es el maestro de revisión, fuera del artefacto público.

## Comprobaciones

- `astro check`: cero errores/advertencias y tres sugerencias heredadas.
- 73 pruebas del modelo/contenido y tres de importación aprobadas; fuentes editoriales intactas.
- 117 pruebas E2E aprobadas y una omisión prevista (menú móvil en escritorio).
- 51 pruebas de revisión visual, lector y diccionarios/RTL aprobadas.
- Build: 337 HTML, 638 exportaciones por entidad, catálogo JSON, 330 URLs canónicas, 111 entradas RSS y 311 documentos Pagefind.
- 1005 archivos textuales escaneados; igualdad de todas las exportaciones con el contenido público y de los fragmentos Pagefind con la selección.
- Variante sin efectos: mismas 337 páginas de contenido y mismo índice, sin módulos opcionales. Los presupuestos de recursos PT10 siguen pasando.
- Se revisó visualmente la composición social renderizada. La comprobación de recursos exige 1200 × 630 y menos de 250 KB, ICO 16/32 y PNG de 180 × 180.

Se añade `npm run check:publication` al pipeline: compara todos los formatos contra su proyección, el sitemap contra las rutas canónicas, los metadatos y equivalencias del HTML, destinos de migración, enlaces/anclas locales, RSS, configuración Netlify y dimensiones/peso de los recursos gráficos. El escaneo de publicación también busca marcadores internos y patrones conocidos de credenciales, sin imprimir coincidencias sensibles.

Las pruebas nuevas cubren exclusión de borradores en todas las salidas, identidad/idioma, coautoría, JSON-LD hostil, ausencia de cadenas, rutas antiguas en vista previa, URLs con parámetros, formatos disponibles, equivalencias del libro y 404. Son validaciones locales; no certifican el comportamiento de Netlify/Cloudflare antes de publicar ni garantizan una auditoría integral de seguridad o accesibilidad.

## Continuación

Sigue **PT12: verificar el candidato y corregir defectos**. La revisión del propietario comprende los destinos de migración y la vista previa social. El afinado de efectos permanece para antes de publicación; el CV sigue en POST01. PT13 prepara publicación y reversión; PT14 publica y comprueba el entorno real.

## Referencias técnicas

- [Netlify: opciones de redirección](https://docs.netlify.com/manage/routing/redirects/redirect-options/) y [prioridad frente a archivos existentes](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).
- [Netlify: configuración por archivo](https://docs.netlify.com/build/configure-builds/file-based-configuration/).
- [Astro: filtro y serialización del sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/).

## Revisión del artefacto para el pipeline GitHub → Netlify

La documentación oficial admite subir archivos ya compilados. El pipeline debe publicar **todo el contenido de `dist/`**, incluidos `_headers`, `_redirects`, `404.html`, Pagefind, exportaciones y recursos. Las reglas HTTP viajan con el artefacto; no dependen de que el ejecutor externo lea `netlify.toml`. Se retiraron las cabeceras duplicadas del TOML y `check:publication` comprueba que el build conserve `_headers` íntegro.

`npm run build` ya genera HTML estático, con los efectos opcionales del navegador. `npm run build:static` es la variante adicional sin efectos, no un requisito para Netlify.

Para revisar el resultado localmente:

```sh
nvm use
npm run build
npm run check:publication
npm run preview -- --host 127.0.0.1 --port 4331
```

La vista previa sirve el HTML compilado; no emula la aplicación HTTP de `_headers` y `_redirects` por Netlify. La verificación del alojamiento queda pendiente hasta disponer de un despliegue autorizado.

Referencias: [archivos precompilados y métodos de despliegue](https://docs.netlify.com/deploy/create-deploys/), [cabeceras en la carpeta publicada](https://docs.netlify.com/manage/routing/headers/).

Resultado de esta revisión: build completado en 26,88 s; 337 HTML, 638 exportaciones, 330 URLs canónicas, 111 entradas RSS y 311 documentos del buscador verificados. Comprobaciones de publicación, exportaciones, índice y escaneo aprobadas; seis pruebas de publicación en navegador aprobadas (escritorio y móvil). Sin push ni despliegue.

Actualización PT12: la CSP y las cabeceras adicionales se generan a partir del HTML definitivo y la base `public/_headers`. `dist/_headers` contiene hashes de scripts y no es ya una copia literal de la base. Véase [PT12](../PT12/README.md).
