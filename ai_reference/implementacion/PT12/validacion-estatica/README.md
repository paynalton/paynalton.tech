# Validación local del HTML estático — 5 de octubre de 2026

El build de Astro genera correctamente el sitio estático. Se comprobó el resultado publicado en `dist`, servido mediante Astro Preview, con Chrome en escritorio y móvil. No se desplegó ni se ejecutó el pipeline remoto.

## Resultados

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | 148 archivos, 0 errores, 0 advertencias, 4 sugerencias |
| `npm run check:ui` | 618 referencias de diccionario y 25 plantillas |
| `npm run build` | 337 páginas HTML |
| Artefacto de contenido | 1.033 archivos de texto sin patrones internos o de credenciales conocidos |
| Exportaciones | 24 archivos de proyectos y 220 de obras coinciden con el contenido público |
| Pagefind | 311 fragmentos, filtros y exclusiones correctos |
| Publicación | 638 formatos, 330 URLs canónicas, 6 migraciones, enlaces/anclas locales y 111 entradas RSS correctos |
| Efectos | Presupuesto aprobado: motor 144.909 bytes gzip; escena/coordinación/decoraciones 12.876 |
| Build sin efectos | 337 páginas con el mismo contenido principal e índice; sin módulos opcionales |
| Navegador, build normal | 197 casos distintos aprobados tras repetir los afectados; 3 omisiones previstas por perfil |
| Navegador, build sin efectos | 34 pruebas aprobadas |

La cobertura incluye navegación, búsqueda, selector de idioma, descargas, lector, accesibilidad automatizada, ausencia de desbordamientos, efectos WebGL y alternativas estáticas, preferencias y persistencia de la conversación de figuras. Se probaron recorridos esenciales sin JavaScript. Las pruebas CSP aplican localmente las cabeceras generadas para Netlify y comprueban que no bloquean el sitio y sí bloquean scripts inyectados.

## Correcciones e incidencias

- El selector de idioma de la página 404 apuntaba a `/404/`, que no es el archivo que genera Astro. Se corrigió a `/404.html` y se repitieron build y validación de enlaces satisfactoriamente.
- Una prueba de entrada maliciosa esperaba cero imágenes en una ficha de proyecto. Esa expectativa precedía a las escenas de cabecera. Ahora comprueba específicamente que no se inserte la imagen atacante ni el atributo `onerror`, conservando la comprobación de que el código no se ejecuta y de que canonical/exportaciones no cambian.
- La primera ejecución de 200 casos terminó con 193 aprobados, 3 omitidos y 4 fallos: dos por esa expectativa antigua y dos por colisión entre archivos temporales de ejecuciones simultáneas de Playwright. La repetición aislada de los tres archivos afectados aprobó sus 20 casos, incluidos los cuatro fallidos. Los registros iniciales se conservan; no se presenta aquella primera ejecución como aprobada.

## Revisión visual y límites

Capturas actuales en `desktop/` y `mobile/`: inicio, proyecto, obra y lector. Se revisaron textura de papel, composición, controles de idioma y escenas; la escena de método se comprobó después de desplazarla al área visible. Las capturas de página completa pueden mostrar recursos perezosos aún sin cargar fuera del área visible; `desktop/metodo.png` documenta su carga real al desplazarse.

Las ocho comparaciones con capturas de referencia históricas (`visual baseline`) se excluyeron por los cambios visuales intencionales recientes; no se regeneraron ni se declara aprobada una comparación píxel a píxel. La revisión visual es una muestra, complementada con las comprobaciones automáticas de rutas y componentes. WebGL se probó con SwiftShader: esto verifica funcionamiento, no rendimiento de una GPU física.

`netlify.toml` conserva `npm run build` y publicación de `dist`; el artefacto lleva `_headers` y `_redirects`. Astro Preview no reproduce toda la infraestructura de Netlify/Cloudflare. Las cabeceras, redirecciones y ejecución del pipeline reales requieren comprobación tras desplegar. No se repitió auditoría de dependencias ni se cierra el aviso previo de seguridad con esta validación.

El sitio estático normal permanece disponible en http://localhost:4331/es/.

## Registros

Los archivos `static-validation-*.log` conservan check, diccionarios, build, comprobaciones del artefacto, build sin efectos y las tres ejecuciones de navegador. `capturas.json` registra ocho vistas sin errores JS, desbordamiento horizontal ni imágenes inmediatas sin cargar.
