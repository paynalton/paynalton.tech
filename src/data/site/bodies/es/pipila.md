## Contexto y problema
Un sitio necesitaba migrar desde una plataforma obsoleta, pero conservaba una fuerte dependencia de un servicio que recibía formularios y enviaba los datos a un concentrador. Cambiar formularios o modificar el flujo exigía mucho trabajo. Además, las caídas del concentrador se propagaban a los sitios: los usuarios recibían errores y podían perderse los registros.

La intervención debía atender una emergencia y, en principio, ser temporal. Por experiencia sabía que una solución provisional podía permanecer durante años. Por eso preparé una base capaz de crecer mientras resolvía la necesidad inmediata.

## Mi participación

Creé prácticamente toda la solución inicial, utilizando SailsJS para la API y Node.js para el resto de los componentes. Cuando se extendió a nuevos mercados y funciones, otros desarrolladores aportaron cambios. Actualmente soy el único desarrollador que mantiene el sistema, apoyándome en IA para el trabajo de desarrollo.

## Solución y decisiones

Organicé Pipila como un sistema modular. Separé el procesamiento asíncrono en workers para facilitar los cambios de flujo y trasladé la configuración adecuada a variables de entorno, de modo que la solución pudiera adaptarse a nuevos entornos sin reconstruirse desde cero.

La decisión principal fue desacoplar la recepción de registros de la disponibilidad del concentrador. Cuando este falla, Pipila conserva los registros como pendientes y realiza reintentos periódicos hasta que se recupera. Una caché interna ayuda a mantener la atención al cliente durante esas interrupciones. La interfaz deja así de depender directamente de cada respuesta del servicio externo.

Con el tiempo se incorporaron dos nuevos concentradores, control de sesiones y flujos de inicio de sesión mediante OpenID Connect (OIDC). Esa evolución conserva el propósito original: facilitar cambios e integraciones sobre una base que pueda adaptarse.

## Resultados

La solución facilitó la salida gradual de la plataforma anterior y dio mayor flexibilidad al desarrollo de experiencias de usuario. Observé una disminución del esfuerzo y costo de desarrollo y una reducción importante de las caídas de servicio. Son resultados cualitativos de la operación; no dispongo aquí de una medición publicada que permita expresarlos como porcentajes.

## Aprendizaje

Resolver una urgencia también exige pensar en lo que ocurrirá después. La modularidad, la configuración y la separación del procesamiento permitieron que una intervención temporal evolucionara sin perder su propósito inicial.
