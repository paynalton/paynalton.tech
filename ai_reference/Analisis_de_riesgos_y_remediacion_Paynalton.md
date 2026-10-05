# Análisis de riesgos y plan de remediación — Paynalton

**Fecha:** 22 de septiembre de 2026  
**Estado:** evaluación preventiva del diseño propuesto; controles pendientes de implementar o verificar.  
**Ámbito:** rediseño de paynalton.tech con Astro estático, Netlify, Taller nocturno, WebGL, contenidos profesionales y literarios, idiomas, taxonomías, redes y formatos para agentes.

## 1. Conclusión de la evaluación

Los riesgos prioritarios son el crecimiento del alcance, la claridad del posicionamiento, la migración de URLs, el rendimiento de WebGL, la accesibilidad y la calidad de las relaciones entre contenidos. La exposición de información no publicable y de credenciales merece tratamiento inmediato aunque su probabilidad estimada sea menor.

La estrategia propuesta es publicar un núcleo profesional y editorial completo, mantener una alternativa estática para los efectos y habilitar las integraciones gradualmente. El primer hito debe facilitar entender el perfil, comprobar su experiencia, leer su obra y contactar.

Esta evaluación se apoya en los documentos de stack tecnológico, layouts y widgets. **No es una auditoría del repositorio, de la cuenta de Netlify ni de la seguridad del sitio en producción.** No se han medido rendimiento, tráfico, incidentes o vulnerabilidades actuales. Las probabilidades, prioridades, plazos y riesgos residuales son estimaciones de planificación, que deberán revisarse con evidencia de implementación.

## 2. Método y responsables

| Valor | Probabilidad durante el rediseño y la operación inicial | Impacto |
| --- | --- | --- |
| 1 | Baja: requiere condiciones poco habituales. | Menor: defecto localizado con alternativa clara. |
| 2 | Media: escenario plausible que necesita control explícito. | Moderado: afecta una función o exige retrabajo significativo. |
| 3 | Alta: probable sin prevención, dada la complejidad propuesta. | Mayor: afecta tareas esenciales, reputación, información o disponibilidad. |

**Puntaje = probabilidad × impacto.** Bajo: 1–2; Medio: 3–4; Alto: 6–9. No expresa una probabilidad estadística. El impacto prevalece ante exposición de secretos, información no publicable o bloqueo de tareas esenciales. “Residual objetivo” es el nivel esperado tras demostrar los controles, no una reducción ya conseguida.

| Rol propuesto | Responsabilidad |
| --- | --- |
| Producto | Carlos/Paynalton: alcance, objetivos, prioridades y aceptación documentada del riesgo residual. |
| Editorial | Carlos/Paynalton, con revisión lingüística cuando proceda: afirmaciones, evidencias, traducciones y material publicable. |
| Diseño | Responsable por asignar: identidad, legibilidad y patrones de interacción. |
| Desarrollo | Responsable por asignar: implementación, validaciones y correcciones. |
| Operación | Responsable por asignar: publicación, dominio, accesos, respaldos y recuperación. |

Una misma persona puede cubrir varios roles. Antes de implementar, asignar una persona concreta a cada riesgo; los roles de esta propuesta no presuponen un equipo contratado.

## 3. Registro priorizado

Los IDs L0–L8 y W01–W40 corresponden al documento de layouts y al inventario de widgets. Se conservan para convertir este análisis en tareas trazables.

| ID | Riesgo | P | I | Puntaje | Nivel inicial | Responsable | Residual objetivo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R01 | Crecimiento del alcance | 3 | 3 | 9 | Alto | Producto | Medio |
| R02 | Posicionamiento profesional difuso o sin evidencia | 3 | 3 | 9 | Alto | Editorial | Medio |
| R03 | Contenido insuficiente o desactualizado | 3 | 2 | 6 | Alto | Editorial | Bajo |
| R04 | Divulgación de información no publicable | 2 | 3 | 6 | Alto | Editorial + Operación | Medio |
| R05 | Pérdida de tráfico por cambio de rutas | 3 | 3 | 9 | Alto | Desarrollo | Medio |
| R06 | Traducciones incorrectas o selector engañoso | 3 | 2 | 6 | Alto | Editorial + Desarrollo | Medio |
| R07 | WebGL lento o inestable | 3 | 3 | 9 | Alto | Desarrollo | Medio |
| R08 | Peso excesivo del resto de la interfaz | 3 | 2 | 6 | Alto | Desarrollo | Bajo |
| R09 | Barreras de accesibilidad | 3 | 3 | 9 | Alto | Diseño + Desarrollo | Medio |
| R10 | Identidad visual recargada o culturalmente imprecisa | 2 | 2 | 4 | Medio | Diseño + Editorial | Bajo |
| R11 | Taxonomía inconsistente o relaciones engañosas | 3 | 3 | 9 | Alto | Editorial + Desarrollo | Medio |
| R12 | Divergencia entre HTML y formatos para agentes | 2 | 3 | 6 | Alto | Desarrollo + Editorial | Bajo |
| R13 | Expectativas de GEO no verificables | 3 | 2 | 6 | Alto | Producto + Editorial | Medio |
| R14 | Dependencia de WebMCP o funciones experimentales | 2 | 2 | 4 | Medio | Desarrollo | Bajo |
| R15 | Búsqueda incompleta o mezcla de idiomas | 3 | 2 | 6 | Alto | Desarrollo | Bajo |
| R16 | Integraciones sociales indisponibles | 3 | 2 | 6 | Alto | Desarrollo + Editorial | Medio |
| R17 | Secretos o scripts no confiables en el sitio | 2 | 3 | 6 | Alto | Desarrollo + Operación | Medio |
| R18 | Rastreo externo o uso innecesario de datos | 2 | 2 | 4 | Medio | Producto + Desarrollo | Bajo |
| R19 | Contacto o descarga de CV inoperantes | 2 | 3 | 6 | Alto | Desarrollo + Editorial | Bajo |
| R20 | Compilación o despliegue defectuoso | 2 | 3 | 6 | Alto | Operación + Desarrollo | Bajo |
| R21 | Pérdida de contenido o imposibilidad de recuperación | 2 | 3 | 6 | Alto | Operación | Medio |
| R22 | Caducidad de dominio, accesos o cuotas | 2 | 3 | 6 | Alto | Operación | Medio |
| R23 | Dependencias y automatizaciones difíciles de mantener | 3 | 2 | 6 | Alto | Desarrollo | Medio |
| R24 | Recursos sin procedencia o permisos claros | 2 | 2 | 4 | Medio | Editorial + Diseño | Bajo |

## 4. Prevención, respuesta y cierre por riesgo

El cierre se refiere a completar y verificar el tratamiento. Los riesgos operativos recurrentes continúan en seguimiento después de cerrar sus tareas iniciales.

### R01 — Crecimiento del alcance

**Ámbito:** L0–L8; 40 widgets. **Responsable:** Producto.

Implementar todas las variantes a la vez puede retrasar la publicación y desviar esfuerzo del contenido profesional.

- **Señal de alerta:** Aumentan tareas pendientes mientras la versión mínima sigue sin estar publicable.
- **Prevención:** Cerrar un alcance de primera entrega: navegación, idiomas publicados, casos reales, lectura, contacto y alternativa estática del taller. Mantener WebGL como mejora progresiva y separar ampliaciones.
- **Remediación:** Retirar temporalmente grafo, preferencias avanzadas, feeds y formulario del hito; publicar el núcleo completo y replanear las ampliaciones.
- **Evidencia de cierre:** Cada función del hito tiene contenido, responsable y criterio de aceptación; los aplazamientos están documentados.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R02 — Posicionamiento profesional difuso o sin evidencia

**Ámbito:** L1, L3, L4 y L7; W09, W17, W20. **Responsable:** Editorial.

Acumular títulos como arquitecto, líder y experto en IA sin contexto puede reducir credibilidad y dificultar que un reclutador identifique el perfil.

- **Señal de alerta:** La portada enumera capacidades, pero no conduce a casos que las demuestren.
- **Prevención:** Definir una propuesta central y asociar cada capacidad destacada a responsabilidades, decisiones y resultados verificables. Distinguir IA asistida de IA incorporada a productos.
- **Remediación:** Reescribir la presentación; retirar o matizar afirmaciones no sustentadas y completar casos prioritarios.
- **Evidencia de cierre:** Una revisión editorial puede rastrear cada afirmación destacada hasta evidencia publicable.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R03 — Contenido insuficiente o desactualizado

**Ámbito:** L3–L7; W11, W21–W23. **Responsable:** Editorial.

Una arquitectura amplia con pocos contenidos completos produce secciones vacías, fechas contradictorias y apariencia de abandono.

- **Señal de alerta:** Hay tarjetas sin destino, textos de ejemplo o discrepancias entre web y CV.
- **Prevención:** Inventariar piezas y fechas antes de diseñar cada catálogo; usar una fuente común de datos profesionales y asignar fecha de revisión.
- **Remediación:** Ocultar secciones vacías, corregir datos y regenerar CV, HTML y exportaciones afectadas.
- **Evidencia de cierre:** No quedan textos de muestra ni descargas inexistentes; fechas y responsabilidades coinciden en los formatos publicados.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R04 — Divulgación de información no publicable

**Ámbito:** Capturas, CV, repositorios, previews, JSON y Markdown. **Responsable:** Editorial + Operación.

Capturas o exportaciones pueden incluir datos de clientes, credenciales, información personal o borradores. El daño persiste aunque se retire la página visible.

- **Señal de alerta:** Aparecen identificadores internos o campos privados en archivos generados o capturas.
- **Prevención:** Revisar evidencias; exportar una lista explícita de campos públicos; excluir borradores de todas las salidas y revisar el directorio final. No tratar noindex como control de acceso.
- **Remediación:** Retirar todas las copias bajo control del proyecto, corregir el generador y volver a publicar. Si hubo credenciales, revocarlas; revisar historial y accesos. Evaluar el alcance de la exposición y acciones de comunicación pertinentes.
- **Evidencia de cierre:** La revisión del artefacto y de URLs conocidas no encuentra información restringida; credenciales afectadas están revocadas. Registrar copias externas que no puedan retirarse.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R05 — Pérdida de tráfico por cambio de rutas

**Ámbito:** Migración; L0, L2, L3, L5 y L6. **Responsable:** Desarrollo.

Cambios de slugs o prefijos de idioma pueden romper enlaces entrantes, canonicals, sitemap y marcadores.

- **Señal de alerta:** URLs antiguas producen 404, cadenas de redirección o llevan todas al inicio.
- **Prevención:** Inventariar URLs actuales y sus equivalentes; preservar rutas útiles y definir redirecciones por contenido. Revisar sitemap, canonical y metadatos por idioma.
- **Remediación:** Corregir redirecciones específicas, restaurar páginas omitidas y regenerar sitemap; solicitar revisión de URLs importantes cuando se disponga de herramientas de indexación.
- **Evidencia de cierre:** Todas las URLs del inventario tienen destino válido o retirada intencional documentada; no hay bucles ni canonicals a previews.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R06 — Traducciones incorrectas o selector engañoso

**Ámbito:** L0 Utilidades globales; W04; todas las páginas. **Responsable:** Editorial + Desarrollo.

Confundir códigos o variantes lingüísticas, mezclar diccionarios y contenido o enlazar traducciones inexistentes rompe navegación y confianza.

- **Señal de alerta:** El selector cambia de tema, aparecen textos mezclados o la fuente carece de glifos.
- **Prevención:** Verificar idiomas y variantes antes de migrar, incluidos los códigos pendientes; IDs conceptuales estables, traducciones revisadas y mapa de equivalencias.
- **Remediación:** Retirar la opción no validada de la página, informar ausencia de traducción y corregir contenido, enlaces y metadatos.
- **Evidencia de cierre:** Cambiar de idioma conserva la entidad cuando existe traducción; las ausencias son explícitas y todos los enlaces publicados resuelven.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R07 — WebGL lento o inestable

**Ámbito:** L1 Escena del taller; W10. **Responsable:** Desarrollo.

Modelos, texturas o resolución excesivos pueden bloquear interacción, consumir batería o fallar en dispositivos modestos.

- **Señal de alerta:** La portada tarda en responder, se pierde el contexto gráfico o el render sigue activo fuera de vista.
- **Prevención:** Imagen inicial, carga diferida, resolución limitada, pausa fuera de vista y liberación de recursos. Probar un dispositivo móvil representativo y movimiento reducido.
- **Remediación:** Desactivar la escena mediante configuración, conservar la imagen y reducir recursos o calidad antes de reactivarla.
- **Evidencia de cierre:** El sitio sigue usable sin WebGL; prueba de navegación repetida sin acumulación continua de escenas; pausa y alternativa verificadas.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R08 — Peso excesivo del resto de la interfaz

**Ámbito:** L0–L8; fuentes, imágenes, W05 y W38. **Responsable:** Desarrollo.

Hidratar componentes innecesarios o cargar multimedia al inicio aumenta descargas y retrasa lectura.

- **Señal de alerta:** El peso inicial supera el presupuesto acordado o se descargan reproductores sin interacción.
- **Prevención:** JavaScript localizado, dimensiones de imágenes, fuentes limitadas, módulos diferidos y presupuestos medidos por plantilla.
- **Remediación:** Eliminar dependencias prescindibles, comprimir recursos y sustituir integraciones pesadas por enlaces o portadas.
- **Evidencia de cierre:** Los presupuestos de la sección de validación se cumplen en las páginas representativas o existe una excepción justificada.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R09 — Barreras de accesibilidad

**Ámbito:** L0–L8; W03–W07, W18, W24–W28 y W33. **Responsable:** Diseño + Desarrollo.

Bajo contraste, trampas de foco, controles sin nombre y movimiento persistente pueden impedir leer, navegar o contactar.

- **Señal de alerta:** Una tarea esencial no se completa con teclado, zoom o lector de pantalla.
- **Prevención:** Revisar contraste y estados; HTML semántico, foco visible, alternativa a gráficos, movimiento reducido y recorridos manuales además de comprobación automática.
- **Remediación:** Sustituir temporalmente el control problemático por enlaces o contenido expandido; corregir foco, semántica, contraste y orden.
- **Evidencia de cierre:** Recorridos esenciales completados con teclado y lector de pantalla; sin defectos bloqueantes en la muestra revisada. Esto no equivale por sí solo a certificar todo el sitio.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R10 — Identidad visual recargada o culturalmente imprecisa

**Ámbito:** Taller nocturno; L1, L5 y ornamentos globales. **Responsable:** Diseño + Editorial.

Adornos excesivos pueden competir con el texto; atribuir significado histórico sin sustento puede producir una representación poco rigurosa.

- **Señal de alerta:** La decoración dificulta reconocer controles o mezcla símbolos con explicaciones no verificadas.
- **Prevención:** Limitar ornamentos a marcos y separadores; documentar referentes y distinguir inspiración gráfica de reproducción histórica. Probar lectura y jerarquía.
- **Remediación:** Simplificar patrones, retirar afirmaciones culturales no verificadas y reemplazar adornos que afecten comprensión.
- **Evidencia de cierre:** Controles reconocibles y lectura fluida en móvil; referencias culturales revisadas o descritas solo como inspiración.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R11 — Taxonomía inconsistente o relaciones engañosas

**Ámbito:** L6; W20, W30–W33; grafo JSON. **Responsable:** Editorial + Desarrollo.

Sinónimos duplicados, ciclos jerárquicos o relaciones inferidas incorrectamente pueden desorganizar el sitio y exagerar experiencia ante agentes.

- **Señal de alerta:** Términos equivalentes separados, destinos inexistentes o una publicación filosófica aparece como evidencia de implementación.
- **Prevención:** IDs estables, vocabulario de relaciones, distinción de jerarquía/asociación y validación de referencias y ciclos. Revisar evidencia de competencias manualmente.
- **Remediación:** Fusionar términos mediante alias, reparar enlaces y retirar relaciones sin sustento; regenerar páginas e índices.
- **Evidencia de cierre:** Cero referencias rotas o ciclos jerárquicos; una muestra de relaciones explica correctamente su motivo y evidencia.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R12 — Divergencia entre HTML y formatos para agentes

**Ámbito:** JSON-LD, Markdown, JSON, RSS y llms.txt. **Responsable:** Desarrollo + Editorial.

Generadores independientes o reglas diferentes de publicación pueden entregar datos contradictorios, antiguos o privados.

- **Señal de alerta:** El JSON anuncia una competencia o una traducción que no existe en HTML; un borrador aparece en el índice.
- **Prevención:** Una fuente editorial validada, selección común de campos públicos y estado de publicación; exportaciones versionadas y generadas en el mismo build.
- **Remediación:** Desactivar la salida defectuosa, corregir el generador y regenerar todas las representaciones y el índice de búsqueda.
- **Evidencia de cierre:** Comprobación de entidades, idioma, URL y estado de publicación entre formatos; ausencia de borradores y campos internos.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R13 — Expectativas de GEO no verificables

**Ámbito:** Descubrimiento por agentes y buscadores. **Responsable:** Producto + Editorial.

Invertir mucho en archivos especiales esperando citas o contratación garantizadas puede desplazar trabajo con mayor utilidad.

- **Señal de alerta:** Se evalúa el éxito solo por respuestas aisladas de un chatbot o por la presencia de llms.txt.
- **Prevención:** Priorizar contenido claro, evidencia, enlaces y metadatos coherentes; limitar tiempo de experimentación y definir resultados observables.
- **Remediación:** Reducir experimentos sin señal útil y concentrarse en contenido, indexación y calidad de contactos recibidos.
- **Evidencia de cierre:** Se reportan indicadores con sus límites; no se afirma que la presencia de archivos produzca citas garantizadas.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R14 — Dependencia de WebMCP o funciones experimentales

**Ámbito:** Módulo opcional para agentes. **Responsable:** Desarrollo.

Una API cambiante o ausente puede romper la página si se vuelve dependencia del flujo principal.

- **Señal de alerta:** Excepciones en navegadores sin soporte o una consulta exige datos no públicos.
- **Prevención:** Módulo aislado, detección de soporte, bandera desactivable, consultas de solo lectura, validación de entradas y límites de resultados.
- **Remediación:** Desactivar el módulo y conservar navegación, búsqueda y exportaciones estáticas; adaptar la integración en una rama de prueba.
- **Evidencia de cierre:** Todas las tareas esenciales funcionan con el módulo apagado; las consultas habilitadas solo devuelven contenido público y acotado.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R15 — Búsqueda incompleta o mezcla de idiomas

**Ámbito:** L2 y L0; W05, W14–W16. **Responsable:** Desarrollo.

Indexar antes de generar HTML o incluir bloques repetidos puede ocultar resultados útiles y filtrar mal idiomas.

- **Señal de alerta:** Una pieza publicada no aparece por su título o predominan cabeceras y pies en los resultados.
- **Prevención:** Indexar después del build, delimitar cuerpo útil, verificar filtros y excluir borradores. Mantener un conjunto pequeño de consultas representativas por idioma publicado.
- **Remediación:** Regenerar el índice del mismo despliegue, corregir ámbitos y ofrecer categorías HTML mientras se resuelve.
- **Evidencia de cierre:** Consultas de referencia encuentran destinos correctos; filtros, volver/avanzar y estado vacío funcionan.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R16 — Integraciones sociales indisponibles

**Ámbito:** W08, W35–W38. **Responsable:** Desarrollo + Editorial.

Publicaciones eliminadas, límites de API o fallos del reproductor pueden dejar tarjetas vacías o bloquear compilaciones.

- **Señal de alerta:** Una actualización falla, el enlace muere o la página espera indefinidamente a un tercero.
- **Prevención:** Selección editorial, tiempos límite, instantánea persistente de GitHub, enlaces alternativos y carga bajo demanda.
- **Remediación:** Reutilizar última instantánea válida con fecha; retirar embed fallido o cambiarlo por enlace y resumen. Omitir métricas si no hay copia válida.
- **Evidencia de cierre:** Un fallo simulado del proveedor no impide compilar ni leer; no hay estados de carga infinitos.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R17 — Secretos o scripts no confiables en el sitio

**Ámbito:** Build, W36, Markdown importado y scripts externos. **Responsable:** Desarrollo + Operación.

Credenciales incorporadas al bundle o contenido ejecutable no revisado pueden comprometer cuentas o visitantes, incluso en un sitio estático.

- **Señal de alerta:** Token en dist o mapas de fuentes, HTML inesperado o dependencia que añade solicitudes no previstas.
- **Prevención:** Credenciales solo en entornos de build apropiados; permisos mínimos; escapar datos externos y evitar HTML/MDX no confiable. Revisar dependencias, scripts de instalación y artefactos.
- **Remediación:** Revocar credenciales afectadas, desactivar scripts o integración, reconstruir desde fuentes confiables y revisar historial y accesos. No basta con borrar el archivo visible.
- **Evidencia de cierre:** Escaneo y revisión dirigidos no encuentran el secreto ni código imprevisto; accesos afectados revocados y cambio causante identificado.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R18 — Rastreo externo o uso innecesario de datos

**Ámbito:** W38, W40 y analítica eventual. **Responsable:** Producto + Desarrollo.

Embeds, formularios o analítica pueden enviar información a terceros de forma poco clara y añadir carga innecesaria.

- **Señal de alerta:** Hay solicitudes externas antes de reproducir un video o campos de contacto sin utilidad definida.
- **Prevención:** Inventariar terceros y datos; minimizar campos; cargar embeds por interacción y definir tratamiento antes de incorporar analítica o formulario.
- **Remediación:** Retirar la integración mientras se ajusta; revisar datos bajo control del proyecto y actualizar la información al visitante según lo realmente implementado.
- **Evidencia de cierre:** La inspección de red coincide con el comportamiento declarado; solo se solicitan datos necesarios.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R19 — Contacto o descarga de CV inoperantes

**Ámbito:** L4 y L8; W22, W34 y W40. **Responsable:** Desarrollo + Editorial.

Una dirección incorrecta, PDF ausente o formulario que simula éxito puede hacer perder oportunidades sin señal visible.

- **Señal de alerta:** La descarga devuelve 404, copiar falla sin alternativa o un envío de prueba no llega.
- **Prevención:** Verificar destinatario y archivos; mostrar correo seleccionable; no publicar formulario sin receptor real y prueba integral.
- **Remediación:** Desactivar formulario defectuoso, publicar correo y LinkedIn válidos, restaurar PDF y corregir la recepción.
- **Evidencia de cierre:** Copiar, abrir correo y descargar funcionan; si hay formulario, un envío de prueba llega y un fallo se comunica sin perder el texto.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R20 — Compilación o despliegue defectuoso

**Ámbito:** Astro, índices, Netlify y configuración. **Responsable:** Operación + Desarrollo.

Cambiar runtime o publicar el directorio equivocado puede omitir páginas, índices o recursos y sustituir una versión funcional.

- **Señal de alerta:** Preview diferente a producción, build no reproducible o errores tras publicar.
- **Prevención:** Fijar runtime y lockfile, pipeline completo, revisión de preview y registro del último despliegue sano. Documentar y ensayar recuperación con las capacidades reales de la cuenta.
- **Remediación:** Detener despliegues automáticos relacionados y restaurar el último artefacto conocido como sano si está disponible; si no, recompilar su commit y configuración.
- **Evidencia de cierre:** URLs críticas verificadas después de recuperar; causa corregida en preview antes de reactivar automatización.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

### R21 — Pérdida de contenido o imposibilidad de recuperación

**Ámbito:** Repositorio, medios, snapshots y configuración. **Responsable:** Operación.

Conservar solo una copia o depender de la caché de compilación impide reconstruir el sitio tras pérdida o eliminación.

- **Señal de alerta:** Un recurso no está versionado ni respaldado; no se conoce cómo reconstruir una versión anterior.
- **Prevención:** Respaldar contenido, medios y configuración necesaria; proteger accesos y verificar una restauración desde copia independiente del despliegue activo.
- **Remediación:** Recuperar último respaldo íntegro, identificar cambios faltantes y reconstruir el sitio; priorizar páginas profesionales y contacto.
- **Evidencia de cierre:** Restauración ensayada con inventario de recursos completo y registro de la pérdida máxima potencial.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R22 — Caducidad de dominio, accesos o cuotas

**Ámbito:** Dominio, DNS, TLS, alojamiento y builds. **Responsable:** Operación.

Un problema de renovación, cuenta o consumo puede dejar el sitio inaccesible aunque el código esté correcto.

- **Señal de alerta:** Avisos de renovación, certificados fallidos, denegación de acceso o consumo inusual de builds/tráfico.
- **Prevención:** Verificar titularidad, recuperación de cuenta, renovación y límites reales del plan. Alertas de disponibilidad y consumo; evitar hooks y builds duplicados.
- **Remediación:** Corregir renovación o configuración, recuperar acceso por el canal del proveedor y detener automatizaciones que disparen consumo. Restaurar DNS solo con valores verificados.
- **Evidencia de cierre:** Dominio y HTTPS responden; acceso recuperable y alertas configuradas. Documentar límites sin asumir un plan gratuito ilimitado.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R23 — Dependencias y automatizaciones difíciles de mantener

**Ámbito:** Astro, Three.js, Pagefind, CI y contenido generado con IA. **Responsable:** Desarrollo.

Actualizar sin revisar compatibilidad o aceptar código generado sin validarlo puede introducir regresiones y elevar mantenimiento.

- **Señal de alerta:** Varios lockfiles, paquetes redundantes, actualizaciones acumuladas o diferencias no explicadas en un PR.
- **Prevención:** Reducir dependencias, fijar versiones y revisar cambios en lotes pequeños. Validar código y contenido generado con IA igual que cualquier contribución.
- **Remediación:** Revertir actualización causante o aislar el componente; corregir con un caso de prueba que reproduzca el fallo concreto.
- **Evidencia de cierre:** Build reproducible y recorridos afectados verificados; cada dependencia tiene una función necesaria.
- **Residual objetivo:** Medio; sujeto a comprobar los controles.

### R24 — Recursos sin procedencia o permisos claros

**Ámbito:** Fuentes, modelos 3D, imágenes, textos y evidencias. **Responsable:** Editorial + Diseño.

Publicar materiales sin registro de origen o autorización puede obligar a retirarlos y rehacer parte del diseño.

- **Señal de alerta:** Un recurso carece de autor, licencia, procedencia o permiso de publicación verificable.
- **Prevención:** Mantener inventario de recursos y condiciones de uso; preferir materiales propios y obtener confirmación sobre evidencias de terceros antes de publicarlas.
- **Remediación:** Retirar o sustituir el recurso y revisar otras páginas y exportaciones donde aparezca. Resolver permisos antes de reintroducirlo.
- **Evidencia de cierre:** Cada recurso publicado tiene procedencia y condiciones registradas; los sustitutos mantienen accesibilidad y composición.
- **Residual objetivo:** Bajo; sujeto a comprobar los controles.

## 5. Plan de ejecución y puntos de control

Los hitos son relativos al proyecto; no se asignan fechas sin conocer su calendario y capacidad. Los controles de seguridad y de información aplican antes de cualquier publicación, incluidos previews compartidos.

| Hito | Acciones | Riesgos principales | Entregable y condición de salida |
| --- | --- | --- | --- |
| A. Antes del desarrollo principal | Revisar repositorio, runtime, configuración y rutas existentes; definir primera entrega, propuesta profesional, contenido y recursos autorizados. | R01–R06, R10, R24 | Inventario de URLs, backlog acotado, matriz de evidencias y responsables asignados. |
| B. Modelo editorial y estructura | Definir IDs, idiomas, esquemas, permisos de publicación y relaciones; implementar base accesible y validar exportaciones. | R04, R06, R09, R11, R12, R17 | Build que rechaza referencias inválidas y evita publicar borradores; recorridos HTML funcionales. |
| C. Interacción y recursos | Incorporar búsqueda, WebGL, visores y redes con alternativas; probar rendimiento y fallos externos. | R07–R09, R14–R19 | Pruebas dirigidas, presupuesto de recursos y mecanismos para apagar funciones opcionales. |
| D. Antes de producción | Validar rutas, contenido, idiomas, contacto, artefactos, respaldos y recuperación; confirmar dominio y accesos. | R04–R06, R17, R19–R24 | Lista de salida completada, despliegue sano identificado y procedimiento de recuperación ensayado. |
| E. Primeras 48 horas | Revisar disponibilidad, URLs importantes, errores, búsquedas y contacto después de publicar. | R05, R15, R19, R20, R22 | Registro de verificación y corrección de incidencias de publicación. |
| F. Primer mes y operación | Revisar enlaces y consumo semanalmente durante el primer mes; después mensualmente. Revisar contenido y traducciones trimestralmente y cuando cambie la experiencia profesional. | R02, R03, R06, R13, R16, R21–R24 | Registro de mantenimiento, responsables y siguiente revisión. Adaptar frecuencia según incidencias reales. |

## 6. Validación antes de publicar

| Área | Comprobación propuesta | Criterio de salida |
| --- | --- | --- |
| Contenido | Revisión de portada, casos, trayectoria y CV. | Cero textos de muestra y afirmaciones profesionales destacadas con sustento. |
| Migración | Recorrer inventario de URLs antiguas y nuevas. | Sin bucles; destinos equivalentes o retiradas intencionales documentadas. |
| Idiomas | Cambiar idioma en inicio, proyecto, publicación y término; probar traducción ausente. | Sin destinos inexistentes, cambios silenciosos de entidad ni mezcla accidental de idiomas. |
| Accesibilidad | Navegación, búsqueda, lector, visor y contacto con teclado; muestra con lector de pantalla, zoom y movimiento reducido. | Ninguna tarea esencial bloqueada; incidencias restantes registradas y priorizadas. |
| Recursos iniciales | Medir salida comprimida por layout representativo. | Objetivo del stack: HTML/CSS/JS inicial ≤200 KB, excluyendo imágenes y fuentes; imagen principal móvil ≤250 KB. |
| Escena | Medir paquete completo de escena diferida y probar dispositivo móvil representativo. | Objetivo del stack: ≤1.5 MB; imagen alternativa, pausa y desactivación verificadas. El peso por sí solo no acredita fluidez. |
| Búsqueda | Consultas de referencia y filtros por idioma/tipo. | Resultados coherentes, URLs válidas y distinción entre carga, error y vacío. |
| Taxonomía | Validaciones de referencias, IDs y jerarquías; muestra editorial de relaciones. | Sin referencias rotas ni ciclos jerárquicos; predicados coherentes con evidencia. |
| Información pública | Inspeccionar HTML, JSON, Markdown, índices, medios y mapas de fuentes publicados. | Sin secretos, campos restringidos ni borradores. |
| Contacto | Descargar CV, copiar correo y abrir destino; envío integral si existe formulario. | Canal accesible y operativo; ninguna confirmación de envío ficticia. |
| Resiliencia | Simular API social fallida, embed bloqueado, WebGL ausente y almacenamiento local inaccesible. | El núcleo profesional, editorial y de contacto permanece utilizable. |
| Recuperación | Recuperar una versión conocida en entorno de prueba con configuración documentada. | Evidencia de restauración y lista de recursos necesarios. |

Los límites de peso son **objetivos propuestos, no mediciones actuales**. Una excepción exige registrar motivo, efecto observado y alternativa; no se justifica por una puntuación aislada de una herramienta.

La referencia de accesibilidad será WCAG 2.2 nivel AA. Los controles manuales y automáticos apoyan la evaluación, pero la conformidad debe comprobarse contra los criterios aplicables; no se deduce de aprobar un escáner. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 7. Respuesta a incidentes

### Clasificación y tiempos objetivo

Son objetivos operativos desde la detección, sujetos a la disponibilidad real del responsable; no constituyen un SLA ni suponen vigilancia continua.

| Prioridad de incidente | Ejemplos | Respuesta objetivo |
| --- | --- | --- |
| S0 — Exposición o compromiso | Credenciales públicas, información restringida, script malicioso. | Contención inmediata al detectarlo; priorizar revocación y retirada. No fijar cierre hasta conocer alcance. |
| S1 — Función esencial caída | Sitio inaccesible, navegación bloqueada, contacto roto. | Iniciar diagnóstico el mismo día; restaurar una versión útil o alternativa dentro de un día hábil como objetivo. |
| S2 — Función secundaria degradada | Búsqueda, una traducción o un embed falla, con navegación alternativa. | Evaluar en dos días hábiles y corregir o desactivar en el siguiente ciclo de mantenimiento. |
| S3 — Defecto menor | Adorno, espaciado o detalle sin bloqueo. | Incorporar al backlog y resolver en una entrega planificada. |

### Procedimiento de contención y recuperación

1. Registrar fecha, URL, versión publicada, síntoma, alcance conocido y responsable. Evitar copiar secretos en el registro.
2. Contener el componente afectado. Si hay exposición, revocar credenciales y retirar contenido; si hay regresión visual o funcional, apagar la mejora o restaurar una versión sana.
3. Identificar el último despliegue realmente sano. **No restaurar automáticamente una versión que también contiene la exposición o el fallo.**
4. Detener temporalmente el flujo automático que podría volver a publicar el cambio defectuoso. Recuperar mediante las capacidades verificadas de la cuenta o recompilar el commit sano con su configuración.
5. Corregir la causa en una rama y comprobar el caso que falló, junto con los recorridos esenciales afectados. Revisar fuentes, artefactos y copias públicas cuando haya exposición.
6. Publicar la corrección y comprobar inicio, proyecto, lectura, idioma, contacto y recursos afectados. Reactivar automatización solo tras validar.
7. Documentar causa, solución, evidencia, exposición residual y una medida concreta para evitar repetición.

**Objetivos iniciales de recuperación:** ningún cambio editorial aceptado debe quedar solo en un entorno local; los medios deben respaldarse antes de publicar. Para disponibilidad, se propone recuperar el núcleo en un día hábil desde la detección. La capacidad real y la pérdida máxima recuperable deben medirse durante el ensayo, antes de asumir estos objetivos como compromisos.

## 8. Límites de GEO y funciones para agentes

La documentación de Google mantiene las prácticas de SEO como base para sus funciones de IA y no exige archivos especiales para aparecer en ellas. La indexación y la aparición no están garantizadas. Por eso R13 se trata como un riesgo de inversión y expectativas, y llms.txt como complemento. [Google Search: funciones de IA](https://developers.google.com/search/docs/appearance/ai-features)

WebMCP se mantendrá como integración opcional cuyo estado y compatibilidad deben revisarse al implementarla. El plan exige consultas acotadas de solo lectura y permite desactivarla sin afectar la web. [Documentación de WebMCP](https://developer.chrome.com/docs/ai/webmcp)

Los documentos, relaciones y referencias pueden mejorar claridad y trazabilidad, pero no permiten controlar las inferencias de todos los agentes externos. Si un tercero presenta información incorrecta, corregir cualquier ambigüedad propia y documentar el caso; no afirmar que se puede eliminar la interpretación de todas las copias externas.

## 9. Seguimiento y aceptación del riesgo residual

Cada tratamiento debe convertirse en una tarea que conserve el ID de riesgo y los componentes afectados. Plantilla:

| Campo | Valor a completar |
| --- | --- |
| Riesgo y tarea | Rxx; acción concreta. |
| Responsable | Persona asignada. |
| Hito o fecha objetivo | Antes del hito correspondiente o fecha acordada. |
| Estado | Pendiente / en curso / verificado / aceptado / no aplica con justificación. |
| Evidencia | PR, reporte, captura de prueba, registro editorial o ensayo de recuperación. |
| Riesgo residual observado | Nivel recalculado y condiciones que permanecen. |
| Decisión | Cerrar tratamiento, ampliar control, desactivar función o aceptar riesgo documentado. |
| Próxima revisión | Fecha y evento que obliga a reevaluar. |

No se considera aceptado un riesgo solo porque figure como opcional o porque exista una solución escrita. Producto revisa las excepciones con el responsable técnico o editorial correspondiente. La revisión del riesgo se repite al añadir idiomas, formularios, servicios externos, nuevas salidas para agentes o cambios relevantes en publicación.

**Condición de salida propuesta:** no publicar con exposición conocida de secretos o información restringida, navegación/contacto esencial bloqueados o pérdida de contenido sin recuperación. Para fallos de funciones opcionales, desactivarlas y mantener la alternativa útil hasta resolverlos.
