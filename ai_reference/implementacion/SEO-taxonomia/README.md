# Revisión SEO y taxonomía profesional

Aplicación bilingüe de las recomendaciones revisadas el 5 de octubre de 2026.

- Se conservan rutas ES/EN y el identificador canónico `https://paynalton.tech/#person`.
- Se elimina la repetición de marca en títulos.
- Se completa Person con nombre, alias y perfiles oficiales existentes. Las autorías propias enlazan esa identidad; las coautorías se mantienen. Los proyectos declaran participación mediante contributor, sin atribuir desarrollo original a todos.
- Tecnologías ya documentadas se convierten en términos navegables con evidencia inversa. Se añaden capacidades de modernización y procesamiento asíncrono y dominios ERP, comercio electrónico, sistemas financieros y herramientas editoriales, apoyados en fichas existentes.
- El catálogo agrupa tecnologías/estándares, competencias, dominios, temas y géneros. Se conserva la clasificación editorial de los escritos.
- LORO y Yayauhqui amplían su explicación sin incorporar tecnologías no confirmadas. PERICO conserva su descripción como extensión VS Code.

No se incorporan automáticamente los inventarios técnicos nuevos del documento externo, la caracterización de LORO como extensión, métricas, atribuciones open source adicionales, ni fichas nuevas de GWP/Club EnfaBebé. Requieren conciliación con la información del autor. No se modifica la publicación aplazada de obras.

Se mantienen sitemap, hreflang, redirecciones, llms.txt, catálogo y exportaciones existentes. No se añade llms-full ni se promete posicionamiento por archivos para agentes. Todo se genera durante el build estático, sin servicios de pago.

## Validación local

- Astro check: 0 errores, 0 advertencias, 4 hints existentes.
- Auditoría de diccionarios aprobada; 14 archivos de pruebas de contenido aprobados.
- `npm run build`: 696 páginas, 687 URLs canónicas, 686 registros públicos bilingües, 1.372 exportaciones y 670 documentos Pagefind.
- Artefacto público, exportaciones, enlaces/anclas, búsqueda y publicación aprobados.
- Playwright en Chrome: 24 pruebas aprobadas en perfiles escritorio/móvil, incluyendo búsqueda ES/EN, equivalencia entre idiomas, accesibilidad y navegación proyecto→tecnología→proyecto sin JavaScript.
- Se actualizan las expectativas de cantidad de resultados a 335 por idioma al incorporar 24 términos nuevos por idioma.

Validación realizada localmente antes de la publicación. El despliegue se activa al subir los cambios a master; estas pruebas no certifican por sí solas el estado de producción.
