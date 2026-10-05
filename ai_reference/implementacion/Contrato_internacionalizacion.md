# Contrato de internacionalización — diccionarios desde la primera entrega

## Decisión de alcance

El sitio se construye multilingüe desde ahora y se completa primero en español. Preparar la arquitectura, los diccionarios, las rutas y las pruebas pertenece a E1; redactar y revisar las traducciones se realiza después de completar este proyecto. No hace falta duplicar páginas o modificar componentes para incorporar una traducción.

Este contrato complementa el plan y prevalece sobre cualquier interpretación anterior que aplazara la capacidad multilingüe junto con los textos traducidos. No implica traducir ahora ni activar páginas incompletas.

## Base actual inspeccionada

- Existen `src/locales/es.json`, `en.json`, `nah.json` y `yua.json`, un cargador de JSON en build y la clase `Translator`.
- Las claves actuales son frases en inglés. Las páginas se repiten en carpetas por idioma y la configuración no está centralizada.
- El método `_t(key, options)` puede fallar ante un marcador si falta `options`; usa comprobaciones de verdad que no preservan correctamente valores como cero. La ausencia de claves puede terminar mostrando el identificador fuente.
- La landing del libro contiene sus textos en un objeto `copy` dentro del componente, fuera de los diccionarios globales. El idioma de la página y el de la edición descargable son independientes y deben seguir siéndolo.

Estos son hallazgos del código, no cambios aplicados. Se migrarán de forma progresiva sin romper las páginas y descargas existentes.

## Organización propuesta

| Capa | Responsabilidad |
| --- | --- |
| Registro central de idiomas | Español como idioma base. Código, etiqueta propia, dirección de escritura, formato regional y estado de habilitación de cada idioma. Distinguir registro, disponibilidad de diccionario y publicación efectiva. |
| Diccionarios de interfaz por idioma | Navegación, botones, campos, estados, errores, avisos, preferencias, accesibilidad, etiquetas de búsqueda y lectura. Dividir por módulos cuando facilite mantenimiento. |
| Diccionarios editoriales por idioma | Titulares, descripciones, resúmenes, biografía, fichas, términos, textos alternativos informativos y metadatos SEO, vinculados a IDs conceptuales estables. |
| Cuerpos extensos por idioma | Markdown referenciado desde la entrada editorial del idioma. Conservar estructura, capítulos, notas y formato sin introducir un libro completo como cadena escapada en JSON. Ninguna prosa extensa queda incrustada en una plantilla. |
| Datos compartidos | IDs, relaciones conceptuales, selección, orden, fechas y datos que no cambian al traducir. Evitar copiar hechos independientes del idioma en cada catálogo. |
| Rutas y publicación | Resolver entidad + idioma a una ruta publicada, con slug propio o compartido según convención. Mantener separados ID conceptual, idioma y slug. |

Los nombres de directorios definitivos se concretan en PT03. Lo obligatorio es el contrato: toda cadena traducible procede de un catálogo o cuerpo editorial asociado al idioma, nunca de texto fijo dentro del componente. Marcas y nombres propios pueden conservar su forma original sin ser traducciones ausentes.

### Ejemplo conceptual de diccionario de interfaz

```json
{
  "nav.projects": "Proyectos",
  "contact.copyEmail": "Copiar correo",
  "contact.emailCopied": "Correo copiado",
  "search.results": {
    "one": "{count} resultado",
    "other": "{count} resultados"
  }
}
```

Las claves describen el significado, no reproducen una frase del español o del inglés. Se permiten cambios de redacción sin cambiar la clave. No construir frases traducibles concatenando fragmentos; usar mensajes completos con parámetros y formas plurales según idioma.

### Ejemplo conceptual de entrada editorial

```json
{
  "project.pipila": {
    "title": "Pipila",
    "summary": "Texto público revisado del proyecto.",
    "bodyRef": "projects/pipila/es.md"
  }
}
```

El ejemplo muestra el contrato y no es contenido aprobado de Pipila ni una ruta pública. Las versiones futuras comparten el ID conceptual y tienen sus propios textos y referencias de cuerpo.

## Reglas de traducción y publicación

1. El catálogo español constituye la referencia de claves y parámetros. Los idiomas posteriores declaran su estado de traducción y revisión; registrar un JSON no habilita automáticamente páginas ni selector.
2. Cada componente recibe el contexto de idioma; no crea su propio fallback ni presupone español en su código. Fechas, números y plurales se formatean mediante el contexto regional.
3. Los idiomas habilitados deben cubrir las claves funcionales obligatorias de sus páginas. Una clave faltante o un marcador incompatible falla la validación del candidato; no se publica un identificador como texto visible. El fallback español es una recuperación explícita y diagnosticable, no una forma de declarar completa una traducción.
4. Una obra o ficha sin traducción no genera una copia española etiquetada como otro idioma. Puede ofrecerse un enlace identificado a la versión española, con el idioma del destino claro. No duplicar páginas para llenar el selector o sitemap.
5. El selector se implementa como capacidad reutilizable en PT05 y se prueba desde E1. Solo se muestra cuando existen alternativas publicadas pertinentes; no se activan versiones nuevas incompletas. El legado EN/NAH sigue disponible según la matriz de migración, sin declararlo automáticamente traducción del contenido nuevo.
6. HTML `lang` y `dir`, canonical, hreflang, metadatos, búsqueda y exportaciones se derivan de versiones realmente publicadas. El cambio de idioma usa equivalencias de entidad, no reemplazo ciego del prefijo de la URL.
7. Las consultas y los índices de búsqueda se separan por idioma. Las exportaciones incluyen idioma e ID conceptual. Mantener la misma política de publicación y confidencialidad en todas las representaciones.
8. Las descargas del libro conservan sus URLs y la independencia entre idioma de página y edición. No reemplazar una edición existente por una traducción de interfaz.
9. Los diccionarios se resuelven durante el build y el navegador recibe únicamente lo necesario para sus interacciones. No incorporar un servicio remoto de traducción ni cargar todos los libros y catálogos en cada página.
10. Escapar los valores y parámetros como texto; no insertar HTML arbitrario procedente de un diccionario. El contenido enriquecido utiliza estructura editorial y renderizado controlados. Los mensajes de estado y nombres accesibles forman parte de la traducción, no solo el texto visible.

## Trabajo que se incorpora al plan

| Paquete | Entrega obligatoria ahora |
| --- | --- |
| PT03 | Registro de idiomas, contrato de diccionarios, IDs semánticos, variantes editoriales, resolución de traducciones, parámetros/plurales y validadores. |
| PT04 | Componentes sin textos incrustados; espacio para textos más largos, caracteres y dirección de escritura configurables. |
| PT05 | Plantillas compartidas, generación de rutas por idioma y selector condicionado a destinos publicados. |
| PT06 | Recorrido de referencia probado con español y un catálogo sintético de pruebas, sin publicar ese catálogo. |
| PT07/PT08 | Extraer los textos de fichas, cronología, contacto, obra y lectura; migrar la excepción del libro sin alterar las descargas. |
| PT09 | Búsqueda preparada para índices y mensajes por idioma, implementada inicialmente sobre el contenido español. |
| PT11 | Exportaciones y SEO con identidad/idioma separados y enlaces a versiones reales. |
| PT12/PT15 | Pruebas multilingües, revisión de desbordamientos y guía de cómo añadir y habilitar una traducción. |

## Pruebas y criterio de cierre de E1

- Claves obligatorias, tipos, parámetros, referencias de cuerpo y rutas válidos; IDs conceptuales estables entre versiones.
- Interpolación con cero, valores ausentes y caracteres especiales; pluralización y formatos regionales; errores diagnosticables sin revelar contenido interno.
- Catálogo sintético fuera de `public` y del conjunto publicable, con textos expandidos y caracteres de prueba. Usarlo para detectar textos incrustados, anchos rígidos y dependencias del español. No constituye una traducción para publicar.
- Ruta equivalente disponible, traducción ausente y selector oculto con una sola versión. Sin enlaces rotos ni cambio a una ficha diferente.
- Estado de idioma coherente en HTML, búsqueda, exportaciones, canonical y hreflang; ninguna página/fixture de prueba filtrada al artefacto de publicación.
- Pruebas del libro que mantengan independientes idioma de página y edición/formato descargado.

**Terminado:** una segunda versión de prueba se incorpora mediante diccionarios, cuerpos editoriales y configuración, sin duplicar plantillas ni modificar componentes. El español queda completo; la redacción de traducciones reales sigue diferida. La arquitectura multilingüe debe estar implementada y probada para cerrar E1.

## Flujo posterior de traducción

Crear el catálogo del idioma a partir del esquema español → traducir interfaz y contenido seleccionado → registrar cuerpos y equivalencias → revisar redacción y metadatos → ejecutar validadores y pruebas → habilitar únicamente las versiones revisadas → regenerar y publicar archivos estáticos. La selección de un nuevo idioma será una decisión de contenido/configuración, no un rediseño del sitio.
