## Antecedente: una plataforma con límites

En 2020 trabajamos en una campaña cuyo recorrido incluía un juego y una experiencia que debía ejecutarse en una plataforma autorizada. Durante la revisión, varias funciones fueron señaladas como incompatibles con sus capacidades.

La plataforma permitía añadir CSS y JavaScript personalizados. Creé una herramienta para copiar el HTML generado y utilizarlo como plantilla de desarrollo local. El equipo construyó la aplicación sobre esa base y preparé el código minificado para incorporarlo mediante los campos disponibles. Así logramos integrar el recorrido previsto utilizando los mecanismos de extensión de la plataforma.

El equipo, de unas cuatro personas en aquel momento, realizó el despliegue con mi orientación remota. Esa entrega fortaleció la relación con el cliente y dio paso a más proyectos.

## La necesidad de Winner

El cliente de estas campañas fue Reckitt.

En 2022, poco antes del lanzamiento de otra campaña, el cliente terminó el contrato con la plataforma y ordenó detener los proyectos relacionados. Para conservar la campaña construimos Winner en una semana.

Reciclé parte de un proyecto anterior desarrollado con Laminas API Tools, añadí un servicio Laravel y alojamos la solución en AWS. Fue mi primera experiencia utilizando ECS. Realicé personalmente el despliegue de esta nueva plataforma.

## Alcance y evolución

La primera versión cubría el recorrido de la campaña: presentación de formularios y juegos, recopilación de datos y métricas. La campaña pudo salir en la fecha prevista.

Como en otras soluciones nacidas de una urgencia, preparé una base que pudiera seguir utilizándose. Winner se empleó en más campañas y posteriormente incorporó un chatbot e integraciones con servicios externos, como plataformas de datos de clientes (CDP).

## Resultados y aprendizaje

La reutilización de componentes y la integración de servicios permitieron responder a la retirada de una dependencia externa sin perder la fecha de lanzamiento. Después, la plataforma sostuvo nuevas campañas hasta que el cliente dejó de invertir en juegos y premios.

El caso reúne dos aprendizajes: examinar las posibilidades reales de una plataforma antes de descartar una experiencia y diseñar una salida viable cuando las condiciones cambian de forma abrupta.
