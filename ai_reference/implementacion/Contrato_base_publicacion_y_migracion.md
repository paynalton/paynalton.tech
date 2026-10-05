# Base operativa PT01/PT02 — Contrato previo al modelo

Estado: preparación local; las rutas de migración aún no se aplican. No se requiere información adicional del propietario para comenzar PT03.

## Política de publicación

- Trabajar en español y mantener el legado EN/NAH hasta una migración expresa. Implementar desde ahora la capacidad multilingüe mediante diccionarios y plantillas compartidas según el [contrato de internacionalización](Contrato_internacionalizacion.md). Traducir después del proyecto; implementar el selector condicionado a versiones publicadas equivalentes, sin habilitar destinos incompletos. Esta conservación no exime al legado de retirar recursos externos incompatibles.
- Una sola selección publicable alimenta páginas, relaciones, índices y exportaciones. Separar estado editorial de estado operativo de proyectos. Los datos internos del documento maestro no se importan como cuerpo público.
- Los ejemplos de obra solo habilitan desarrollo y pruebas identificados; no se incluyen como obras del autor en el conjunto de publicación final. Alma y Blanco, Negro y Gris permanecen excluidos, incluidos fragmentos y relaciones públicas que revelen sus textos.
- Incorporar las obras completas seleccionadas en PT08-C. Reservar CV y generarlo en POST01; no enlazar archivos inexistentes.
- Los datos confirmados de los doce proyectos y once etapas son suficientes. No exigir confirmar el lanzamiento de K4Y/Holstein ni el estado actual de Winner. Aplicar las aclaraciones de Delta/Delta Commerce. Reckitt y Mead Johnson pueden nombrarse.

## Migración operativa

La [matriz JSON](Matriz_migracion_PT02.json) contiene todas las páginas HTML del build base, RSS, ambos archivos de sitemap y las seis descargas con sus hashes. Las URLs corresponden al dominio https://paynalton.tech; se verificó el artefacto local, no el despliegue.

| Origen | Destino | Tratamiento |
| --- | --- | --- |
| `/en/about/` | `/en/about/` | conservar-legado-sin-nuevas-traducciones |
| `/en/books/cuando-la-tostadora-te-responde/` | `/en/books/cuando-la-tostadora-te-responde/` | conservar-legado-sin-nuevas-traducciones |
| `/en/contact/` | `/en/contact/` | conservar-legado-sin-nuevas-traducciones |
| `/en/ideas/` | `/en/ideas/` | conservar-legado-sin-nuevas-traducciones |
| `/en/` | `/en/` | conservar-legado-sin-nuevas-traducciones |
| `/en/jobs/` | `/en/jobs/` | conservar-legado-sin-nuevas-traducciones |
| `/en/projects/` | `/en/projects/` | conservar-legado-sin-nuevas-traducciones |
| `/es/about/` | `/es/sobre-mi/` | redireccion-al-publicar-destino |
| `/es/books/cuando-la-tostadora-te-responde/` | `/es/books/cuando-la-tostadora-te-responde/` | conservar-y-adaptar |
| `/es/contact/` | `/es/contacto/` | redireccion-al-publicar-destino |
| `/es/ideas/` | `/es/obra/` | redireccion-al-publicar-destino |
| `/es/` | `/es/` | conservar-y-adaptar |
| `/es/jobs/` | `/es/sobre-mi/#forma-de-trabajar` | redireccion-al-publicar-destino |
| `/es/projects/` | `/es/proyectos/` | redireccion-al-publicar-destino |
| `/` | `/es/` | entrada-espanol |
| `/nah/about/` | `/nah/about/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/books/cuando-la-tostadora-te-responde/` | `/nah/books/cuando-la-tostadora-te-responde/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/contact/` | `/nah/contact/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/ideas/` | `/nah/ideas/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/` | `/nah/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/jobs/` | `/nah/jobs/` | conservar-legado-sin-nuevas-traducciones |
| `/nah/projects/` | `/nah/projects/` | conservar-legado-sin-nuevas-traducciones |
| `/rss.xml` | `/rss.xml` | conservar-url-regenerar-conjunto-publico |
| `/sitemap-index.xml` | `/sitemap-index.xml` | conservar-url-regenerar-conjunto-publico |
| `/sitemap-0.xml` | `/sitemap-0.xml` | conservar-url-regenerar-conjunto-publico |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-en.epub` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-en.epub` | conservar-descarga |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-en.pdf` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-en.pdf` | conservar-descarga |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-es.epub` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-es.epub` | conservar-descarga |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-es.pdf` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-es.pdf` | conservar-descarga |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-nah.epub` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-nah.epub` | conservar-descarga |
| `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-nah.pdf` | `/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-nah.pdf` | conservar-descarga |

Conservar #profile, #experience, #skills y #softskills en el nuevo Inicio mediante bloques útiles. Los fragmentos no llegan al servidor: no resolverlos mediante reglas HTTP basadas en el hash. `/es/jobs/` conduce al contenido de forma de trabajar, no a la cronología.

La raíz actualmente decide entre inglés y español con JavaScript; el contrato nuevo la dirige a `/es/`. Es un cambio intencional para PT05/PT11 y exige actualizar esa expectativa en las pruebas al implementarlo, no antes. No se encontraron reglas `_redirects`, `_headers` ni `netlify.toml` en el repositorio inspeccionado; las reglas remotas siguen sin comprobarse. No hace falta acceso al alojamiento para comenzar PT03.

## Recursos externos detectados en HTML generado

| Tipo | Host | Páginas | Tratamiento de implementación |
| --- | --- | --- | --- |
| iframe | open.spotify.com | 3 | Sustituir iframe por enlace publico |
| img | picsum.photos | 3 | Sustituir por recursos propios o enlace explicito, segun contexto |
| link | fonts.googleapis.com | 18 | Sustituir por fuentes o iconos locales |
| script | kit.fontawesome.com | 18 | Sustituir por fuentes o iconos locales |
| script | www.googletagmanager.com | 21 | Retirar Analytics |

Inventario de referencias de carga declaradas en HTML. No es una traza de red ni cubre solicitudes transitivas de JavaScript/CSS. Los enlaces voluntarios a perfiles no equivalen a recursos cargados automáticamente. Los scripts locales de la plantilla se retirarán solo cuando no tengan consumidores, incluido el legado.

## Contrato de la primera muestra PT03

| Entidad | Muestra | Qué debe demostrar |
| --- | --- | --- |
| Proyecto | Pipila | Ficha pública, cuerpo, rol, estado operativo y exportación consistente. |
| Etapa | SoDigital | Cronología y relación con Pipila solo según respaldo editorial; no inferir relaciones por coincidencias. |
| Término | Integración de sistemas | Identidad, definición y relación útil con el caso. |
| Obra | Ejemplo identificado, sin atribución de autoría real | Orden configurable, capítulos, notas, destacados y exclusión del conjunto público final. |

La implementación de los esquemas y sus pruebas pertenece a PT03 y aún no se ha realizado en este documento. Se usarán IDs conceptuales estables, idioma y slug independientes, diccionarios de interfaz/editoriales y selección explícita; agregar, retirar, ordenar o destacar no requerirá editar plantillas.

## Estado y pendientes

Esta unidad fija contratos y reconoce la base; no cierra todas las suites futuras de PT01 ni las redirecciones de PT11. Los resultados de ejecución se registran en `Verificacion_base_PT01.md`. No se modifican fuentes del sitio, dependencias ni archivos de descarga. Se preservan los cambios de trabajo previos.
