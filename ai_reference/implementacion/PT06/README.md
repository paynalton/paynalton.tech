# PT06 — Recorrido completo y exportaciones

Implementado y validado localmente. Disponible para revisión del desarrollador; sin despliegue. Siguiente: PT07, completar proyectos, trayectoria y contacto.

## Revisar el recorrido

```sh
nvm use
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock
```

Abrir `http://127.0.0.1:4321/es/` y seguir:

1. **Leer el caso de Pipila**, desde la tarjeta de Inicio.
2. Revisar la participación, estado, inicio aproximado, tecnologías y relato del caso.
3. Abrir **Integración de sistemas**, identificada como capacidad aplicada.
4. Usar **Ir a contacto** para llegar al correo y LinkedIn.

El caso también ofrece acceso directo a Contacto. La relación con SoDigital se identifica como etapa de desarrollo. Se eliminó la repetición de la definición cuando el cuerpo del término coincide exactamente con su resumen.

La [galería](index.html) contiene seis capturas del caso, término y contacto en escritorio y móvil. La revisión visual se centra en la comprensión de la aportación, la continuidad entre páginas y la facilidad para contactar.

## Exportaciones del caso

Archivos generados estáticamente, sin servidor de aplicación:

- `/es/proyectos/pipila/index.json` — [artefacto local JSON](../../../dist/es/proyectos/pipila/index.json).
- `/es/proyectos/pipila/index.md` — [artefacto local Markdown](../../../dist/es/proyectos/pipila/index.md).

Los enlaces de descarga están en la propia ficha. La URL canónica del caso es `https://paynalton.tech/es/proyectos/pipila/`; identifica su origen previsto y no implica que ya esté desplegado.

`projectDocument()` en `src/lib/site/exports.mjs` obtiene el caso desde `publicEntries()` y construye una lista explícita de campos. No serializa objetos internos ni admite ejemplos, borradores o traducciones ausentes. Las relaciones solo incluyen destinos públicos del mismo idioma.

| Campo JSON | Contrato de la versión 1 |
| --- | --- |
| `schemaVersion` | Versión del formato: 1 |
| `id`, `language` | Identidad conceptual e idioma de la variante |
| `canonical` | URL absoluta, HTTPS, derivada del origen configurado para Astro |
| `title`, `summary` | Título y resumen públicos |
| `role` | Participación confirmada, si existe |
| `operationalStatus` | Estado operativo, independiente del estado editorial |
| `startLabel` | Fecha o descripción temporal con su precisión original |
| `technologies` | Lista de tecnologías declaradas |
| `body` | Cuerpo editorial en Markdown, conservado desde la fuente |
| `relations` | Tipo, ID, título y URL canónica de cada destino público |

Markdown contiene los mismos hechos, etiquetas resueltas por diccionario, URL canónica y cuerpo editorial. Conserva «Aproximadamente 2023»; no inventa fechas precisas ni métricas. Los metadatos se escapan para evitar que introduzcan enlaces, etiquetas HTML o encabezados. El cuerpo procede del Markdown local revisado, no de consultas del visitante; esta exportación no pretende sanear contenido arbitrario de terceros.

El origen no procede de parámetros HTTP. Las rutas canónicas rechazan esquemas ejecutables, rutas relativas de escape, cambios de host y consultas. La comprobación del artefacto compara archivos y proyección pública y detecta exportaciones extra de proyectos.

Las respuestas de compilación declaran los tipos JSON/Markdown; las cabeceras efectivas del alojamiento estático se comprobarán al configurar/publicar en PT11. Los atributos HTML de descarga funcionan como enlaces a archivos estáticos.

## Plantillas compartidas y pruebas de idiomas

`src/components/site/ContentPage.astro` contiene la implementación compartida por las rutas normales y el recorrido sintético. El marco conserva los componentes de PT05; no se copiaron páginas para simular otra interfaz.

La revisión aislada incorpora `/design-review/journey/es/` y `/design-review/journey/en/`. El segundo idioma usa mensajes marcados `PT06-SYNTHETIC`, textos duplicados, dirección RTL y un slug distinto para Pipila. Son pruebas de estructura, no traducciones para publicar.

Solo el proyecto tiene variante sintética; el término no. Las pruebas comprueban que el selector enlaza al mismo proyecto y desaparece donde no hay equivalencia. También comprueban el acceso a Contacto y la interpolación de contadores con marcadores repetidos. Esta última comprobación motivó sustituir la primera ocurrencia por todas las ocurrencias de `{count}` en el mensaje de resultados.

La colección `journeyContent` solo se carga con `DESIGN_REVIEW=1` y se vacía al volver al build normal. La revisión genera 62 páginas HTML: las 32 normales, las once muestras anteriores y diecinueve páginas del recorrido sintético. No ofrece descargas ficticias. La publicación normal conserva 32 páginas HTML y añade únicamente los dos archivos de exportación del proyecto.

## Validación ejecutada

| Comprobación | Resultado |
| --- | --- |
| Astro/TypeScript | 0 errores, 0 advertencias, 7 sugerencias heredadas |
| Contenido, navegación, efectos y exportaciones | 50 pruebas aprobadas |
| Navegador del sitio | 51 aprobadas y una omisión prevista del menú móvil en escritorio |
| Revisión visual e idiomas | 36 aprobadas en 1440, 390 y 320 px |
| Exportaciones | Dos archivos idénticos a la proyección pública; sin proyectos extra |
| Exclusión de material interno | 46 archivos textuales del build revisados, sin rutas ni marcadores de prueba |
| Último ajuste de la definición repetida | Ocho pruebas del recorrido normal y tres del recorrido sintético repetidas y aprobadas; capturas regeneradas |

El recorrido tiene pruebas de integración reales: activar enlaces mediante teclado, comprobar cada destino, revisar axe en caso/término/contacto, comparar el texto renderizado con el cuerpo exportado y confirmar los datos de la ficha. Incluye recorrido sin JavaScript y enlaces de descarga HTML.

Se comprueban consultas y URLs maliciosas sin ejecución, estabilidad de la URL canónica ante parámetros, 404 para exportaciones inexistentes y ausencia de fixtures en producción. Las pruebas de modelo excluyen borradores, ejemplos, obras aplazadas y variantes no publicadas; una relación hacia una etapa retirada deja de exportarse. El conjunto anterior sigue comprobando enlaces/anclas, preferencias, recursos locales, rutas históricas y seis descargas PDF/EPUB con sus hashes.

El alcance de axe no equivale a certificación integral WCAG ni a auditoría completa de seguridad. No se validó el alojamiento remoto. Las capturas son evidencia para revisión humana, sin comparación automática de píxeles contra una línea base aprobada.

## Comandos y continuidad

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
```

`verify` incluye ahora `npm run check:exports`, después del build y antes de E2E. Para repetir solo el recorrido: `npm run test:e2e -- tests/journey.spec.ts` sobre un build normal existente. Las pruebas de navegador necesitaron Chrome y servidor local fuera del aislamiento del entorno. No ejecutar las dos compilaciones simultáneamente; comparten el almacén de contenido de Astro.

No se añadieron dependencias. Se preservaron los cambios anteriores y las descargas; no se hicieron commits ni despliegues. La ampliación de casos/etapas/contacto sigue en PT07, biblioteca/Sobre mí en PT08, buscador completo en PT09 y WebGL en PT10. CV continúa reservado para después del sitio y las obras aplazadas permanecen excluidas. No falta información para comenzar PT07.
