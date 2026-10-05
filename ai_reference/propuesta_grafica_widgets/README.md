# Propuesta gráfica de widgets — Taller nocturno

Abrir **index.html** en un navegador. No requiere instalar dependencias ni conectarse a servicios externos.

- **40 láminas individuales** en `widgets/`, una por identificador W01–W40.
- **80 capturas PNG**: escritorio (1440 px) y móvil (390 px), en `capturas/`.
- **Resumen visual** en `resumen.png`.
- Cada lámina identifica prioridad, criterio de diseño y acceso a sus dos capturas.
- Referencia: la guía visual Taller nocturno proporcionada por el propietario.

## Dirección aplicada

Fondos de obsidiana, texto pergamino, cobre para acciones y jade secundario; esquinas escalonadas, separadores finos, tipografía editorial y composiciones con espacio. Los proyectos usan una voz visual técnica; la lectura introduce superficies claras y serifas.

Se utilizan Atkinson local y Georgia como sustitutos disponibles para esta propuesta, sin descargas de fuentes. La referencia final plantea Manrope y Fraunces. No se presentan estos sustitutos como las fuentes originales de la guía.

## Alcance

Los controles de menú, filtro de la galería, búsqueda de muestra, tamaño del texto y copia permiten explorar estados. Las demás acciones de demostración indican que pertenecen a la propuesta. No son funciones terminadas del sitio.

W10 es un estudio de composición CSS/SVG; la escena WebGL se implementará después. W28 incluye navegación básica para construir el lector con ejemplos. W22 reserva el diseño del CV para cuando se genere después del sitio. W04 muestra únicamente la reserva del control, fuera de esta etapa. W40 documenta la sustitución del formulario excluido por correo; no propone recepción de mensajes.

Los ejemplos de obras no utilizan Alma, Blanco, Negro ni Gris. No hay métricas de proyectos ni citas literarias inventadas. Los ejemplos gráficos y de lectura se identifican como tales. Los enlaces de contacto son públicos; no se hace ninguna operación externa al abrir la galería.

## Revisión

Revisar jerarquía, contraste, espaciado, densidad, grecas, adaptación móvil y la diferencia entre contenido profesional y literario. Las capturas representan el estado inicial de cada lámina; las interacciones se consultan en HTML.

El generador `generar.py` reconstruye las láminas y los estilos. `capturar.mjs` genera las capturas con el navegador local. El resultado de la comprobación se conserva en `verificacion.json`.
