# PT03 — Modelo de contenido y diccionarios

## Resultado implementado

El proyecto dispone de una fuente nueva de contenido validado, una política de publicación, diccionarios semánticos y una colección Astro `siteContent`. Las páginas actuales siguen usando sus componentes y traductor anteriores: se migrarán en PT04–PT09. Esta entrega no crea rutas públicas nuevas ni muestra el rediseño.

Los esquemas abarcan perfiles, canales, proyectos, etapas profesionales, obras y términos. La muestra real contiene Pipila, SoDigital e Integración de sistemas; la lectura de ejemplo tiene dos capítulos y notas, autor nulo y estado `example`. Se extrajeron únicamente los bloques publicables del documento editorial; no se copió su anexo ni las notas internas.

## Organización

| Ubicación | Contenido |
| --- | --- |
| `src/data/site/locales.json` | Registro central, idioma base, etiquetas, dirección, habilitación y IDs de obras aplazadas. |
| `src/data/site/entities.json` | IDs conceptuales, tipos, hechos compartidos, relaciones y visibilidad. |
| `src/data/site/selection.json` | Orden de catálogos y selecciones destacadas. |
| `src/data/site/ui/es.json` | Mensajes de interfaz con claves semánticas y plurales. |
| `src/data/site/editorial/es.json` | Títulos, slugs, resúmenes, roles, estados operativos, metadatos y referencias a cuerpos por entidad. |
| `src/data/site/bodies/es/` | Cuerpos Markdown, capítulos y notas. |
| `src/lib/site/schemas.mjs` | Esquemas estrictos; fechas, referencias, datos públicos y tipos. |
| `src/lib/site/repository.mjs` | Lectura en build, validación cruzada, publicación, selección y equivalencias. |
| `src/lib/site/i18n.mjs` | Traducción de texto, interpolación, plurales, formatos y diagnóstico de fallback. |
| `src/lib/site/loader.mjs` | Colección Astro basada exclusivamente en la proyección pública. |

Estos archivos permanecen fuera de `public`. Las fuentes y módulos de repositorio son de build; no importarlos en scripts de navegador. El módulo de traducción es independiente del lector de archivos y puede recibir solo el catálogo necesario cuando una interacción futura lo requiera.

## Modelo y estados

La identidad conceptual, por ejemplo `pipila`, no depende del idioma ni del slug. Una entrada resuelta tiene ID `es:pipila`, `entityId`, `locale`, URL prevista, hechos, textos y cuerpo. La URL representa el destino del rediseño: no significa que ese destino ya se haya publicado.

La entidad declara una visibilidad:

- `public`: elegible, siempre que su variante esté publicada y el idioma habilitado.
- `draft`: fuera del conjunto público y de las selecciones públicas.
- `deferred`: aplazada y excluida.
- `example`: disponible únicamente mediante la API explícita de vista previa; nunca en `siteContent`.

Cada variante editorial usa `draft` o `published`. El estado operativo del proyecto es otro texto, como «En operación y evolución»; no controla por sí mismo la publicación. La lista `excludedIds` impide marcar las obras aplazadas como públicas. Cambiar esa restricción requiere una decisión editorial posterior.

Las relaciones `during` apuntan de proyectos a etapas; `demonstrates` a términos; `parent` construye jerarquías entre términos; `related` permite vínculos generales. Se rechazan referencias inexistentes, autorrelaciones, duplicados y ciclos jerárquicos. Las relaciones ordinarias pueden ser recíprocas. Al excluir un destino del conjunto publicado de un idioma, también se retiran sus vínculos entrantes de esa proyección.

Los esquemas rechazan campos desconocidos en entidades y variantes. Las notas privadas se mantienen en los documentos de trabajo, no en campos adicionales que luego haya que ocultar.

## Uso en componentes y generación

Para consumir la colección pública de Astro:

```ts
import { getCollection } from 'astro:content';
const entries = await getCollection('siteContent');
const spanish = entries.filter(entry => entry.data.locale === 'es');
```

El loader valida todas las fuentes, conserva solo las versiones publicables y prepara su cuerpo para `render()` de Astro. La colección no almacena la obra de ejemplo. El renderizado de capítulos y las plantillas finales pertenecen a PT08.

Para consultas y selecciones durante el build:

```js
import { loadRepository } from './src/lib/site/repository.mjs';
const repository = await loadRepository();
const projects = repository.select('projects', 'es');
const featured = repository.select('featuredProjects', 'es');
const equivalent = repository.resolve('pipila', 'en'); // null si falta una versión pública
const languages = repository.alternatives('pipila');
```

Las selecciones disponibles son `profiles`, `channels`, `projects`, `experience`, `works`, `terms`, `featuredProjects` y `featuredWorks`. Las dos primeras pueden omitirse y equivalen a listas vacías. El orden es el del JSON; no se impone orden alfabético. Los destacados deben pertenecer a su catálogo y las referencias deben tener el tipo correcto.

Retirar un ID de una selección elimina su ubicación en esa selección, no su página conceptual. Para retirar completamente una pieza del conjunto público, cambiar su visibilidad o el estado de su variante. Esto evita confundir «quitar de destacados» con «despublicar».

`previewEntries('es')` y `select('works', 'es', { preview: true })` incluyen ejemplos de forma explícita para desarrollar el lector. **No utilizarlos para rutas, índices, sitemap o exportaciones de producción.** Las salidas públicas deben usar `siteContent` o `publicEntries()`. PT06/PT09/PT11 conectarán esas salidas; todavía no se generan nuevos índices ni archivos públicos con este modelo.

## Diccionarios e incorporación posterior de idiomas

`es` está habilitado para el modelo nuevo. `en`, `nah` y `yua` están registrados pero deshabilitados; esto no deshabilita las páginas del legado. Registrar un idioma no lo presenta como una traducción completa.

`tag` identifica el idioma y sus reglas plurales. `formatTag`, cuando se indica, define exclusivamente el formato regional de números y fechas; no cambia la gramática. Para náhuatl y maya se conserva `es-MX` como formato regional inicial revisable, sin atribuirles reglas gramaticales españolas. Si el entorno no soporta plurales del idioma, la habilitación falla con un diagnóstico. `pluralTag` permite una equivalencia explícita solo tras revisión lingüística; no se infiere a partir del formato regional. Una lengua que no tenga equivalencia adecuada necesitará una regla plural específica antes de habilitar mensajes plurales.

1. Crear `ui/{idioma}.json` con las claves del diccionario base y los mismos parámetros por mensaje. Las formas plurales deben cubrir las categorías del formato configurado; pueden variar entre idiomas.
2. Crear `editorial/{idioma}.json` con las entidades efectivamente traducidas y cuerpos dentro de `bodies/{idioma}/`. Conservar IDs conceptuales y de capítulos; los slugs pueden diferir.
3. Revisar textos y estados. Una variante faltante no genera una copia española bajo una URL de otro idioma. El selector futuro consumirá `alternatives()` y solo aparecerá con alternativas pertinentes.
4. Habilitar el idioma cuando su interfaz esté completa. Las variantes editoriales ausentes permanecen fuera de publicación, aunque otras del mismo idioma estén listas.
5. Ejecutar los controles; no duplicar plantillas. La prueba sintética en inglés vive exclusivamente en la suite y demuestra esta incorporación sin publicar una traducción ficticia.

Ejemplo de traducción:

```js
import { createTranslator } from './src/lib/site/i18n.mjs';
const translator = createTranslator('es', repository.getCatalogs(), repository.getSettings());
translator.t('search.results', { count: 0 }); // «0 resultados»
translator.t('nav.projects'); // «Proyectos»
```

Las claves ausentes y los parámetros requeridos faltantes producen errores. Cero y cadena vacía son valores válidos de interpolación. `fallback: 'base'` permite recuperación explícita con `onDiagnostic`; no satisface la cobertura necesaria para publicar un idioma incompleto. No habilitarlo silenciosamente para esconder errores de diccionario.

El traductor devuelve **texto**, no HTML seguro. Renderizar mediante expresiones de texto de Astro o `textContent`; nunca usar `set:html`/`innerHTML` con mensajes o parámetros. Los cuerpos Markdown son fuentes editoriales locales revisadas, no una entrada de visitantes ni MDX remoto. Una incorporación futura de contenido no confiable requeriría saneamiento específico.

## Validación y automatización

```sh
nvm use
npm run check:content
npm run test:content
npm run check
npm run build
npm run check:content-artifact
```

`npm run verify` integra check → validación de contenido → pruebas del modelo → build → comprobación del artefacto → regresión de navegador. No se instalaron dependencias nuevas. Playwright omite la carpeta de pruebas Node para no ejecutarlas con el runner equivocado.

El build de Astro también carga y valida la colección; una fuente inválida detiene la construcción. En desarrollo, el loader observa cambios en `src/data/site`; informa errores de validación y no reemplaza la colección con datos parcialmente válidos.

Las comprobaciones cubren claves/parametrización/plurales, tipos y fechas, duplicados, referencias, jerarquías, selección, variantes, rutas, cuerpos y escapes de directorio mediante symlink. La lectura se resuelve desde el módulo, no desde el directorio de trabajo. `check:content-artifact` busca marcadores conocidos de pruebas y documentos internos en archivos textuales de `dist`; es una regresión acotada, no un escáner general de secretos ni una auditoría de seguridad completa.

## Frontera de esta entrega

PT03 entrega el modelo y sus pruebas. PT04 implementará los componentes visuales sobre diccionarios; PT05 generará las rutas y selector; PT06 completará el primer recorrido y exportación; PT07/PT08 migrarán todo el contenido seleccionado; PT09/PT11 integrarán búsqueda y formatos. El traductor y las páginas del legado se mantienen hasta migrar sus consumidores. No se modificaron las ediciones descargables, no se incorporaron obras aplazadas y no se publicó el sitio.
