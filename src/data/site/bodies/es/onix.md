## Contexto y problema

Las empresas llevaban cerca de treinta años trabajando con Crescendo, una solución basada en Clipper. Sus limitaciones para operar en red y los problemas de corrupción e integridad de los archivos DBASE afectaban el trabajo cotidiano. Una persona debía ejecutar procesos de auditoría y corrección de datos cada noche.

Me contrataron en 2013 para desarrollar el sistema que lo sustituiría. El reto era cubrir procesos reales de varias empresas y permitir su evolución, manteniendo una transición viable desde los datos existentes.

## Mi participación

Fui el único desarrollador durante la construcción inicial de Onix. Hacia el final se incorporó personal para mantenerlo. El sistema abarca compras, ventas, finanzas, logística, facturación, garantías y costeo, y continúa dando servicio a las seis empresas del corporativo.

Años después me contactaron para modernizarlo. Realicé la migración completa del código y preparé la infraestructura. Los dos desarrolladores que actualmente mantienen el sistema atienden las incidencias reportadas por los usuarios durante las pruebas.

## Solución y transición

Utilicé MariaDB como base de datos e incorporé un conector DBASE que permitía leer los archivos DBF de Crescendo durante la migración. En la primera empresa ambos sistemas convivieron brevemente. Para las siguientes se optó por una migración directa.

Durante esa integración encontré un error en el conector y colaboré en su corrección. Fue una contribución concreta a una herramienta de la que dependía el proyecto, no una modificación del núcleo de MariaDB.

## Modernización actual

La primera etapa incluyó planeación, dockerización y preparación del entorno de desarrollo. En la segunda migré el código de Zend 1.5 a Laminas y desplegué un entorno de aceptación de usuarios (UAT) en AWS, con escalamiento horizontal automatizado y un proceso de integración y despliegue continuo.

El código migrado está en pruebas: los usuarios envían observaciones y el equipo corrige los problemas encontrados. Todavía falta validar el nuevo sistema de facturación basado en SQS. A través de LORO también se ha incorporado una metodología de trabajo con IA para ampliar la capacidad de los desarrolladores de atender el sistema.

Una tercera etapa contempla una nueva interfaz y agentes de IA para los usuarios. Es una evolución prevista, no una funcionalidad ya entregada.

## Resultados y aprendizaje

Onix permitió trabajar en red, reducir procesos manuales, mejorar la integridad de los datos y añadir nuevos procesos con mayor flexibilidad. Su continuidad demuestra también la importancia de mantener una solución más allá de su entrega inicial.

Volver al proyecto años después permite revisar las decisiones desde otra perspectiva: qué sigue siendo útil, qué necesita cambiar y cómo modernizarlo sin confundir una migración técnica con el final del trabajo de validación.
