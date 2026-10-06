# Cierre del proyecto Paynalton

## Cierre de entrega — 5 de octubre de 2026

El propietario solicita cerrar el proyecto y publicar los cambios finales. Esta decisión cierra la etapa de implementación; las observaciones siguientes quedan como mantenimiento y límites de validación, no como tareas que deban reabrir automáticamente el proyecto.

### Estado vigente

- Sitio Astro estático en español e inglés, Node 24.21.0/npm 12.0.2/Astro 7.3.4. `npm run build` produce `dist/`. Master activa el despliegue GitHub→Netlify; dominio paynalton.tech con DNS Cloudflare.
- 343 entidades públicas por idioma, 111 obras por idioma, 696 HTML, 687 URLs canónicas, 1.372 exportaciones, 670 documentos Pagefind y 222 entradas RSS. Taxonomía: 18 tecnologías/estándares, 8 competencias, 4 dominios, 170 temas y 9 géneros.
- UI y contenido bilingües, selector de equivalentes sin JavaScript, SEO/hreflang, búsqueda por idioma, exportaciones JSON/Markdown, llms.txt, sitemap y redirecciones implementados.
- Identidad Person canónica `/#person`, autorías y coautorías preservadas, proyectos como contribuciones y tecnologías enlazadas a evidencia. El nombre completo en datos estructurados pertenece a la ampliación SEO aceptada en octubre; sustituye la decisión histórica de retirarlo de todo el artefacto.
- Botón de trayectoria descarga PDF según el idioma, mediante enlace HTML nativo: `public/cv/CV_publico_Paynalton.pdf` y `public/cv/Public_CV_Paynalton_EN.pdf`. Mapa en `src/data/site/downloads.json`. Sustituye el botón que invocaba window.print; se conserva la impresión normal del navegador. Archivos idénticos a los proporcionados por el autor.
- Alma y Blanco, Negro y Gris siguen fuera de publicación. No reincorporar originales ajenos ni imágenes retiradas de blogs. No atribuir desarrollo original donde hubo arquitectura, consultoría o mantenimiento.
- Efectos opcionales con adaptación al rendimiento; escenas por sección, grecas, partículas, papel de lectura y conversación persistente de figuras implementados. No alterar automáticamente el afinado aprobado durante las revisiones.
- Babilonia se utilizó para preparar traducciones; ni el sitio ni el build dependen del servicio. Los comandos de revisión aplican correcciones después de regenerar traducciones. Su última ejecución conocida quedó activa; no se ha comprobado su estado al cerrar.

### Evidencia y límites

Build final y comprobaciones de Astro/diccionarios/publicación aprobados. En la ampliación SEO pasaron 14 archivos de pruebas de contenido, controles de artefacto/exportaciones/búsqueda y 24 pruebas de navegador en escritorio/móvil. La incorporación del CV se comprobó en el HTML final de ambos idiomas: enlace visible con download y PDF idéntico al original. En el cierre pasaron además 2 pruebas de navegador (escritorio/móvil) de catálogo, trayectoria, botón visible e impresión; capturas PT07 actualizadas.

La revisión editorial exhaustiva del inglés, el aviso anterior de dependencia y los goldens visuales históricos no se certifican como resueltos. CSP se validó localmente en sesiones anteriores; las pruebas locales no certifican configuración efectiva de Netlify/Cloudflare ni indexación de buscadores. Las tecnologías y atribuciones nuevas no confirmadas del documento externo permanecen fuera del catálogo.

Commits publicados antes del cierre: `20722e7` (rediseño), `222e51a` (inglés), `5e0a7bf` (SEO/taxonomía). No asumir que un push equivale a despliegue completado.
