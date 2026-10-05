# PT07 — Área profesional y contacto

Implementación local del área profesional, con textos procedentes del documento editorial y de las aclaraciones del propietario. Sin despliegue. Siguiente: PT08, biblioteca, lector y Sobre mí.

## Revisión

Con `nvm use`, ejecutar `npm run build` y `npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock`. Revisar `/es/`, `/es/proyectos/`, `/es/trayectoria/` y `/es/contacto/`.

La [galería](index.html) muestra catálogo, trayectoria, contacto y Delta Commerce en escritorio y móvil.

## Entregado

- Cuatro casos completos: Pipila, Onix, GUACAMAYA y Winner.
- Ocho fichas: Yayauhqui, SpellChecker, LORO, PERICO, Delta, Delta Commerce, K4Y y Holstein.
- Once etapas profesionales, formación autodidacta, antecedentes y contribuciones. Seis capacidades enlazadas con proyectos o etapas que las sustentan.
- Inicio con Pipila, Onix y GUACAMAYA como destacados. Selecciones configurables en `src/data/site/selection.json`; clasificación de caso/ficha en los hechos compartidos.
- Correo visible, mailto, copia, perfiles, apoyo secundario y compartir casos mediante el dispositivo o copia de URL canónica. Los fallos de permisos dejan el texto seleccionable y mensajes accesibles.
- Trayectoria imprimible: los detalles cerrados se abren para imprimir y se restauran después. No se genera ni anuncia un CV.
- Textos y mensajes en diccionarios y cuerpos por idioma. Se conserva la infraestructura de traducción sin activar idiomas nuevos.
- JSON y Markdown para los doce proyectos, a partir de la misma proyección pública del HTML.

Las fichas distinguen la primera implementación de Delta de su mantenimiento delegado; Delta Commerce presenta arquitectura y consultoría, sin atribuir desarrollo. K4Y y Holstein mantienen la incertidumbre sobre producción. Yayauhqui distingue desarrollo con asistencia de IA de funcionamiento mediante heurísticas. Reckitt y Mead Johnson se mencionan donde el material lo autoriza. No se publican Alma ni Blanco, negro y gris.

La invitación a conversar y las rutas de continuación reutilizan el marco existente. No hay formulario receptor, promesa de respuesta ni servicios contratados.

## Recursos externos y seguridad

Se retiraron Google Analytics, Google Fonts y el kit remoto de Font Awesome. Las páginas históricas conservan fuentes e iconos locales; los iconos incompatibles usan equivalentes locales. La imagen remota de contacto se sustituyó por un recurso existente. Spotify queda como enlace voluntario. Se retiró el bloque antiguo de contadores sin respaldo editorial y se simplificaron los datos estructurados históricos que afirmaban un empleo actual desactualizado.

Bootstrap, jQuery y demás recursos locales conservan consumidores históricos; su retirada corresponde a la migración final. Los enlaces externos se abren solo por acción del visitante. PayPal y Amazon reutilizan los destinos existentes; su disponibilidad remota no se certificó. El enlace histórico de Discord no se incorpora al contacto nuevo porque no contiene un identificador de usuario válido.

Se prueban solicitudes automáticas de todas las páginas HTML, entradas maliciosas en búsqueda/URLs, exclusión de contenido privado, exportaciones, permisos denegados, almacenamiento bloqueado y funcionamiento sin JavaScript. Compartir nunca propaga consultas de la visita. Estas comprobaciones no sustituyen la revisión de cabeceras del alojamiento y dependencias prevista en los pasos posteriores.

## Validación

```sh
nvm use
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify:design
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm run verify
```

- `astro check`: cero errores y cero advertencias; cuatro sugerencias informativas. El build mantiene el aviso histórico de colección `blog` vacía al generar RSS.
- 53 pruebas de contenido/modelo, incluyendo composición del catálogo, capacidades con evidencia y precisión de roles/estados.
- 63 pruebas E2E aprobadas y una omisión prevista para un caso exclusivo de móvil.
- 36 pruebas de revisión visual, texto ampliado, diccionarios expandidos y RTL.
- Build normal: 48 HTML y 24 exportaciones de proyectos. Escaneo de 84 archivos textuales y concordancia de exportaciones.
- Build de revisión: 78 HTML, con fixtures aislados. La muestra de referencia se acota explícitamente para que las pruebas de traducción no dependan del crecimiento del catálogo.

Se corrigió un desbordamiento de enlaces de tarjetas a 320 px con texto al 200 %. Las pruebas de accesibilidad automatizadas incluyen los doce proyectos, el catálogo, la trayectoria y el contacto. La revisión automática no constituye una certificación WCAG completa.

La revisión humana puede centrarse en precisión editorial y comodidad al recorrer la trayectoria. PT08 implementará biblioteca, lector y perfil personal; PT09 el buscador completo; PT10 los efectos; PT11 la migración y configuración pública final. CV y obras completas mantienen su secuencia acordada.
