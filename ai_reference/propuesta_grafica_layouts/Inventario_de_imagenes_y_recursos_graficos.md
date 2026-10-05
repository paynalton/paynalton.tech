# Imágenes y recursos gráficos para la propuesta de layouts

**Estado implementado PT10:** 3D-01, MAT-01, IMG-01/IMG-02 y sus seis derivados están disponibles en la [entrega PT10](../implementacion/PT10/README.md). TEX-01 se genera localmente a 256 px y ENV-01 mediante RoomEnvironment/PMREM; no hay descargas de texturas ni HDR. Maestros de escritorio/móvil producidos desde la misma escena. Las especificaciones y observaciones siguientes documentan la propuesta original; los resultados medidos vigentes están en PT10.

Inventario correspondiente a la propuesta Taller nocturno. Actualizado el 29 de septiembre de 2026 mediante comparación con los efectos FX01–FX14. Las medidas son especificaciones de producción propuestas; los tamaños en KB son objetivos de optimización, sujetos a comprobar la calidad del resultado.

La propuesta utiliza fondos, bordes, grecas y tipografía como base visual. No necesita una ilustración por tarjeta, una fotografía por empleo ni un retrato para completar Sobre mí. El recurso de mayor peso visual es la escena del taller en Inicio.

## 1. Lista de recursos necesarios

| ID | Recurso | Uso | Cantidad | Especificación principal | Momento |
| --- | --- | --- | --- | --- | --- |
| IMG-01 | Composición estática del taller, escritorio | Inicio; alternativa a la escena WebGL | 1 composición | Maestro 1600 × 1200 px, proporción 4:3; exportaciones 640 × 480, 960 × 720 y 1280 × 960 px | Durante el desarrollo gráfico |
| IMG-02 | Composición estática del taller, móvil | Inicio; encuadre compacto | 1 variante del mismo recurso | Maestro 1000 × 1000 px; exportaciones 400 × 400, 640 × 640 y 800 × 800 px | Durante el desarrollo gráfico |
| VEC-01 | Símbolo de marca con greca escalonada | Cabecera, pie y usos de identidad | 1 SVG maestro con variantes de color | Área vectorial cuadrada; probar a 24, 32, 40 y 64 px | Ya existe una propuesta vectorial; refinar |
| VEC-02 | Ornamentos y emblema editorial | Esquinas, separadores, biblioteca y perfil | 3 variantes reutilizables | Esquina escalonada, remate lineal y emblema; SVG o CSS | Durante el desarrollo gráfico |
| VEC-03 | Iconos funcionales | Buscar, menú, cerrar, copiar, compartir, descargar y navegación | Familia de unos 12 símbolos | SVG con retícula 24 × 24; trazo coherente y color adaptable | Durante la implementación |
| VEC-04 | Composiciones para obras de ejemplo | Biblioteca y selección de Inicio | 3 variantes configurables de una misma familia | SVG adaptable al panel estrecho; no requieren ilustraciones originales | Durante el desarrollo del catálogo |
| IMG-03 | Portadas reales de las obras seleccionadas | Biblioteca y fichas de obra | Una por obra que disponga de portada; ninguna cantidad fija | Maestro de al menos 1200 px de ancho si existe, proporción original; derivados de 320, 640 y 960 px de ancho | Al incorporar las obras completas |
| PUB-01 | Imagen para compartir el sitio | Vista previa de enlaces externos | 1 composición general inicial | 1200 × 630 px; JPEG o PNG, objetivo de hasta 250 KB | Antes de publicar |
| 3D-01 | Modelo modular del taller | FX01–FX03, escena de Inicio | 1 escena con piezas independientes | Geometría procedural o GLB; pivotes, estado final y encuadres definidos; objetivo máximo inicial de 60 000 triángulos y 30 llamadas de dibujo | Al prototipar la escena |
| MAT-01 | Materiales de obsidiana y cobre | FX03 y acabado de 3D-01 | 2 materiales principales compartidos | Parámetros de color, rugosidad y metalicidad; mapas solo si aportan detalle visible | Al preparar el modelo |
| TEX-01 | Texturas de superficie, condicionales | Detalle de MAT-01 | Hasta 2 conjuntos reutilizables; no obligatorios | Maestro inicial 1024 × 1024 px; variante ligera 512 × 512 px; mapas diferenciados de color y datos | Tras probar los materiales simples |
| ENV-01 | Entorno de reflejos, condicional | Reflejos del cobre en FX03 | 1 entorno compartido si resulta necesario | Entorno sencillo generado localmente o imagen equirectangular 1024 × 512 px, con derivado 512 × 256 px | Solo si mejora el acabado dentro del presupuesto |
| PUB-02 | Icono del sitio | Pestañas y accesos guardados | Derivados de VEC-01 | SVG; ICO con 16 y 32 px; PNG de 180 × 180 px | Antes de publicar |

IMG-01 e IMG-02 comparten dirección artística: no son dos escenas distintas. Los tamaños derivados tampoco cuentan como nuevas ilustraciones. PUB-01 y PUB-02 complementan la publicación; no ocupan zonas nuevas en los layouts.

## 2. Escena del taller

### Dirección artística

- Composición abstracta de planos de obsidiana y cobre, con grecas escalonadas integradas y ornamentación moderada.
- Sensación de objeto construido y de piezas relacionadas: código, pensamiento y creación. Evitar convertirla en una fachada, un templo o una representación literal de arquitectura física.
- Iluminación cálida y localizada; sombras profundas con detalle suficiente para distinguir planos.
- Jade como acento secundario, no como color dominante.
- Sin nombres, eslóganes, botones, etiquetas ni textos incorporados a la imagen. La presentación y las acciones permanecen como contenido legible independiente.
- Las composiciones estática y WebGL deben mantener silueta, encuadre y posición semejantes para que el cambio entre ambas no desplace la página.

### IMG-01 — Escritorio

La zona de la propuesta mide aproximadamente 480–520 px de ancho por 365 px de alto en una pantalla amplia. La exportación conserva proporción 4:3 y se ajusta dentro de esa zona sin deformarse.

**Composición:** objeto principal centrado en la mitad derecha de la cabecera; no añadir una gran zona vacía para el titular, porque texto y escena ya ocupan columnas separadas. Mantener un margen seguro aproximado del 10 % alrededor del objeto. La base puede acercarse al borde inferior, sin cortar elementos importantes.

**Formato:** WebP como opción inicial; AVIF adicional si la comparación visual y de peso lo justifica. Si se usa transparencia, conservarla en un PNG maestro y generar una versión WebP con alfa. JPEG solo como alternativa opaca, con el fondo exacto del sitio.

**Objetivo de peso:** 120–220 KB para la variante de 960 px; hasta 300 KB para la de 1280 px. Si la textura necesita más detalle, comprobar el resultado antes de fijar el límite final.

**Nombre de entrega sugerido:** `taller-nocturno-escritorio`, seguido del ancho y la extensión correspondiente.

### IMG-02 — Móvil

La zona actual ocupa aproximadamente 300–320 px de ancho y 320 px de alto. Usar un encuadre cuadrado que reúna las piezas y conserve su lectura en ese espacio.

**Composición:** reducir separación entre los planos y simplificar detalles pequeños. Conservar la esfera o acento de cobre y la base. No obtener esta variante mediante un recorte automático que elimine las partes laterales.

**Formato:** mismos criterios que IMG-01. Objetivo de 70–140 KB para la variante de 640 px y hasta 180 KB para la de 800 px.

**Nombre de entrega sugerido:** `taller-nocturno-movil`, seguido del ancho y la extensión.

### Relación con WebGL

La escena interactiva necesita geometría, materiales e iluminación, además de estas composiciones estáticas. Las dos imágenes no sustituyen esa implementación. La propuesta actual representa la escena mediante CSS y SVG y todavía no tiene un modelo WebGL final.

Las texturas se producirán solo si los materiales las necesitan: un conjunto reutilizable para obsidiana y otro para cobre puede ser suficiente. Empezar con texturas cuadradas de 1024 × 1024 px; ampliar únicamente si la inspección demuestra una mejora visible. Los ornamentos pueden resolverse como geometría o mapas, evitando texto rasterizado. El número definitivo de mapas depende del modelo y no se convierte en un requisito previo de ilustración. Las especificaciones de 3D-01, MAT-01, TEX-01 y ENV-01 se detallan en la sección 10.

## 3. Identidad y ornamentos vectoriales

### VEC-01 — Marca

Conservar la greca como símbolo independiente y el nombre Paynalton como texto. Preparar versiones cobre sobre fondo oscuro y oscura sobre pergamino. El símbolo debe mantener su forma a tamaño pequeño, con pocos trazos y sin sombras indispensables para reconocerlo.

El SVG tendrá área de dibujo definida, sin márgenes accidentales, referencias remotas ni tipografías incrustadas. Objetivo: menos de 5 KB para el símbolo sencillo. El favicon utilizará una simplificación si la marca pierde claridad a 16 px; no una reducción ilegible del nombre completo.

### VEC-02 — Ornamentos

Preparar tres elementos de una misma familia:

1. **Esquina:** greca de 24–48 px para bordes y marcos.
2. **Separador:** remate discreto que acompaña una línea flexible, sin estirar la greca.
3. **Emblema editorial:** composición de 80–160 px para la biblioteca o el margen del perfil.

Los bordes simples y fondos se construyen con CSS. No exportar como PNG una línea, un rectángulo ni una sombra que pueda representarse directamente. Los ornamentos son decorativos y no deben competir con controles o títulos. Para FX05, entregar además sus trazados editables, separados y ordenados según el recorrido de dibujo. La versión estática debe mostrar la greca completa; el efecto actúa sobre una capa adicional o un estado opcional, sin hacer depender su visibilidad de JavaScript.

### VEC-03 — Iconos

Familia mínima: buscar, menú, cerrar, flecha atrás, flecha adelante, enlace externo, desplegar, copiar, compartir, descargar, documento y RSS. Añadir una marca de confirmación para FX13 y, si se utilizan, los símbolos de preferencias y escena 3D. No producir un archivo por modo: las variantes se resuelven con color y estado. Utilizar trazos de aproximadamente 1,5–2 px sobre retícula de 24 px, con terminaciones consistentes.

La silueta visual puede medir 20–24 px, pero la superficie interactiva debe ofrecer espacio suficiente, con objetivo de al menos 44 × 44 px. Los controles conservarán nombres accesibles y no dependerán de interpretar un símbolo aislado. Los estados activo, foco y deshabilitado se resuelven con estilos, no con archivos diferentes.

## 4. Biblioteca configurable

### VEC-04 — Ejemplos durante el desarrollo

La propuesta utiliza una franja editorial estrecha junto al resumen, de aproximadamente 82–140 px de ancho y 240–260 px de alto. Esa franja es decorativa: no representa una portada completa.

Preparar tres variantes SVG sencillas con pergamino, greca y numeración. Variar orientación del ornamento o distribución del color para probar la selección y el orden, sin crear identidades editoriales definitivas. Mantener el título, la autoría y el resumen fuera de la composición. Los textos de demostración deben identificarse como ejemplos.

Estas variantes pueden generarse con la misma plantilla; no requieren tres imágenes producidas manualmente. No utilizar Alma, Blanco, Negro ni Gris como contenido de muestra.

### IMG-03 — Portadas al incorporar las obras

- Mantener la proporción original, sin cortar título, firma o elementos significativos.
- Utilizar ajuste completo dentro de un contenedor, con espacio lateral si hace falta. No introducir una portada convencional mediante recorte dentro de la franja decorativa estrecha.
- Si se incorpora portada real, la tarjeta puede ampliar el contenedor y ajustar su composición. La configuración debe distinguir portada de franja ornamental.
- Mantener autoría y créditos fuera de la imagen cuando deban leerse o consultarse.
- No exigir portada a ensayos, cuentos o textos que no la tengan. La variante tipográfica cumple la propuesta.
- Objetivo por miniatura: 30–80 KB; por versión de ficha: 80–180 KB, según detalle y resolución.

Hay un recurso cuadrado de *Cuando la tostadora te responde*, de **1024 × 1024 px**. Debe revisarse su función y correspondencia con la edición antes de tratarlo como portada definitiva. No debe estirarse para simular una portada vertical ni ampliarse artificialmente para cumplir un tamaño maestro orientativo.

La presentación pública existente del libro es https://paynalton.tech/es/books/cuando-la-tostadora-te-responde/. Se conservan sus descargas; la selección de obras completas se realiza al finalizar el proyecto.

## 5. Recursos de publicación

### PUB-01 — Vista previa al compartir

Composición general con marca, nombre y descriptor profesional acordado. Utilizar obsidiana y cobre, con un elemento de la escena o una greca discreta. Mantener unos 70 px de margen seguro alrededor del texto y comprobar la legibilidad de la miniatura.

El texto visible principal debería ocupar pocas líneas. La vista previa puede contener texto rasterizado porque es una representación externa; los títulos y descripciones del sitio permanecen independientes y accesibles.

No se necesitan imágenes sociales originales para las doce fichas antes de implementar. Posteriormente se podrán generar variantes por página desde la misma plantilla, utilizando títulos y datos públicos revisados.

### PUB-02 — Icono

Derivar de la marca, comprobar en fondo claro y oscuro y simplificar los escalones cuando sea necesario. Entregar un icono vectorial adaptable, un ICO para tamaños pequeños y un PNG cuadrado de 180 px para acceso guardado. No utilizar el titular de Inicio como favicon.

## 6. Recursos que no hacen falta para cumplir las composiciones

| Elemento | Decisión |
| --- | --- |
| Ilustración por proyecto | No requerida. Las tarjetas actuales utilizan nombre, resumen, categoría y borde ornamental. |
| Capturas de todos los sistemas | No requeridas para construir los layouts. Se incorporan como evidencia solo cuando aporten valor y sean publicables. |
| Logotipo por empresa | No requerido. La cronología se apoya en nombres, puestos y períodos. |
| Retrato personal | Opcional; Sobre mí ya tiene una composición completa sin fotografía. |
| Fondo fotográfico o textura de página completa | No requerido. El fondo oscuro y los matices se construyen con CSS. |
| Imagen por tema o capacidad | No requerida. Definición, etiquetas y relaciones aportan la información. |
| Ilustraciones para estados vacíos y errores | No requeridas. Texto claro y acciones son suficientes. |
| Portadas de obras excluidas o de todo el archivo personal | Fuera del trabajo actual. Solo se incorporan los recursos de las obras seleccionadas. |
| Imagen del CV o simulación de documento terminado | No requerida. El CV se generará después de terminar el sitio. |

## 7. Especificaciones para recursos opcionales

Estas medidas orientan una incorporación futura, pero no generan una tarea obligatoria ahora.

| Recurso opcional | Especificación |
| --- | --- |
| Captura documental de un proyecto | Conservar el original; ancho recomendado de 1600–2400 px si la fuente lo permite. PNG para interfaces de detalle fino o WebP sin pérdida cuando resulte útil. Versión reducida para la página y acceso al detalle si es necesario. El texto debe seguir siendo legible. |
| Diagrama de arquitectura | SVG preferente, tipografía legible y explicación textual independiente. No reemplazar evidencia real por un diagrama decorativo atribuido al sistema. |
| Retrato | Maestro de 1200 × 1200 px o mayor, si existe; derivados de 320 y 640 px, WebP. Encuadre natural y luz coherente con el fondo, sin transformar rasgos personales. |
| Vista previa de video | Proporción 16:9; maestro 1280 × 720 px. Botón de reproducción separado de la imagen y transcripción disponible cuando se incorpore el contenido. |

## 8. Criterios comunes de entrega y revisión

- **Paleta:** obsidiana `#1D2425`, pergamino `#F3EEE3`, cobre `#C78D65` y jade `#73998D`, con variaciones de luz y sombra coherentes.
- **Color:** imágenes de presentación y mapas de color en sRGB, sin ampliación artificial de originales pequeños. Los mapas de datos de materiales —normal, rugosidad, metalicidad u oclusión— se identifican y procesan como datos, sin aplicarles la conversión de una imagen de color.
- **Adaptación:** probar escritorio y móvil a tamaño real. Conservar proporción, punto focal y zona segura; no usar el mismo recorte cuando destruya la composición.
- **Carga:** declarar dimensiones para reservar espacio y elegir la variante adecuada al tamaño de presentación. Evitar descargar el maestro de producción para una miniatura.
- **Accesibilidad:** imágenes decorativas sin descripción redundante; imágenes informativas con texto alternativo según su función. Capturas y diagramas complejos requieren explicación textual. Ninguna acción esencial depende de una imagen.
- **Procedencia:** registrar autoría, permiso de uso y pieza asociada. Retirar datos privados de capturas antes de publicarlas.
- **Revisión de textura:** evitar ruido fino, grecas diminutas y brillos que pierdan definición al reducirse.
- **Consistencia:** no mezclar iconos de estilos distintos ni convertir las tarjetas profesionales en carteles ilustrados.

## 9. Orden de preparación

1. Refinar marca, grecas e iconos como familia vectorial.
2. Resolver el modelo modular, materiales y dos encuadres; producir las composiciones estáticas desde su estado final. Incorporar texturas o entorno de reflejos solo si hacen falta.
3. Preparar las tres variantes configurables de obra de ejemplo.
4. Aplicar los recursos a Inicio, biblioteca y lectura; comprobar las composiciones a tamaño real.
5. Derivar favicon y vista previa social antes de publicar.
6. Al incorporar las obras completas, añadir sus portadas cuando existan y sustituir las muestras.

La prioridad inmediata es la escena y su alternativa estática. El resto de la propuesta puede construirse con tipografía, CSS y una familia pequeña de SVG reutilizables.

## 10. Recursos añadidos para la capa de efectos

### 3D-01 — Modelo modular del taller

**Entrega:** una escena reutilizable, construida con geometría procedural o un modelo GLB. Elegir una modalidad principal; no exigir ambos entregables si uno resuelve la composición.

- Separar los planos de obsidiana, las piezas de cobre, los ornamentos que necesiten relieve, la esfera y la base. Son piezas de una sola escena, no modelos independientes para cada efecto.
- Definir nombres estables, pivotes y transformaciones finales para animar el ensamble sin deformar superficies ni alterar la distribución de la página.
- Documentar el encuadre de escritorio y el móvil: cámara, punto de atención, escala y posición del conjunto. Reutilizar geometría y materiales entre ambos; no descargar dos escenas completas para responder al ancho.
- Permitir el giro suave de FX02 sin mostrar caras vacías ni recortar bordes. Conservar margen seguro durante todo el recorrido, no solo en reposo.
- Dejar las secuencias de FX01 y el movimiento del puntero en la capa opcional de efectos. El modelo describe la forma y su estado final; no obliga a reproducir animaciones en bucle.
- Presupuesto inicial del conjunto visible: hasta 60 000 triángulos y 30 llamadas de dibujo. No se exige una versión geométrica adicional de menor detalle desde el inicio: primero simplificar la escena y ajustar resolución; si no basta, usar la alternativa estática.

**Revisión:** la silueta debe seguir funcionando con materiales sencillos. No compensar una composición débil con más textura o posprocesado.

### MAT-01 y TEX-01 — Materiales y detalle de superficie

La primera prueba usa dos materiales principales y parámetros constantes. El cobre necesita responder a la iluminación; no se debe pintar un destello fijo en su mapa de color como sustituto de FX03.

Si se necesitan texturas, preparar únicamente los mapas que aporten al resultado:

| Mapa | Propósito y especificación |
| --- | --- |
| Color base | Variación de superficie sin reflejos especulares ni sombras direccionales pintadas. Maestro 1024 × 1024 px; sRGB. |
| Normal | Relieve fino sin aumentar geometría. Maestro 1024 × 1024 px; declarar la convención de ejes usada para evitar relieve invertido. Tratar como datos. |
| Rugosidad | Variar la dispersión del reflejo; puede sustituirse por un valor constante si la diferencia no es visible. Tratar como datos. |
| Metalicidad | Preferir valor constante por material para cobre y obsidiana; mapa solo si una misma superficie lo necesita. Tratar como datos. |
| Oclusión | Opcional para contactos y recovecos; no sustituye sombras dinámicas. Añadir únicamente con correspondencia de coordenadas documentada. |

No producir automáticamente cinco mapas por material. Compartir texturas, mantener densidad de detalle coherente y evitar costuras visibles. Si se empaquetan canales, registrar su significado explícitamente; la disposición deberá corresponder al material utilizado.

**Derivados:** 512 × 512 px como opción ligera. Usar 1024 px solo cuando mejore la presentación a tamaño real. Si se adopta un formato comprimido para GPU, incluir su cargador y decodificador en la medición de descargas; no introducirlo solo por el nombre del formato.

### ENV-01 — Luz y reflejos

Primera opción: luces y un entorno sencillo generado localmente. Si el cobre requiere un entorno basado en imagen, utilizar un solo recurso compartido, sin necesidad de mostrarlo como fondo.

**Especificación inicial:** equirectangular de 1024 × 512 px como máximo para el prototipo y variante de 512 × 256 px. Conservar un maestro HDR únicamente si ese rango aporta una mejora comprobable. El formato de entrega se elegirá con el cargador real y se medirá dentro del presupuesto, sin incorporar panoramas fotográficos de gran tamaño.

El entorno no debe añadir objetos reconocibles ni alterar la dirección Taller nocturno. Sin capturas de reflexión de toda la escena en cada fotograma. La iluminación de la versión estática se obtiene del mismo planteamiento.

### Actualización de IMG-01 e IMG-02

Las composiciones estáticas deben derivarse preferentemente del **estado final de 3D-01**, con MAT-01 y el encuadre correspondiente. Una ilustración conceptual puede servir para dirigir el modelado, pero no se considera automáticamente una alternativa equivalente al resultado interactivo.

Registrar por variante la cámara, el punto focal, el fondo, la exposición y el encuadre. Comparar el cambio estático → WebGL con el objeto en reposo: conservar tamaño aparente, línea de base, luz y márgenes. El movimiento completo también debe permanecer dentro de la zona reservada.

La imagen permanece visible mientras se carga el motor. El cambio se realiza solo cuando el primer fotograma correcto está listo. Si falla la carga, se conserva la imagen. No producir GIF, video en bucle ni secuencias de PNG para simular estos efectos.

## 11. Correspondencia entre efectos y recursos

| Efecto | Recursos implicados | Complemento necesario |
| --- | --- | --- |
| FX01 — Ensamble | 3D-01, MAT-01, IMG-01 e IMG-02 | Piezas con pivotes y posición final; secuencia por código. Sin imágenes por fotograma. |
| FX02 — Profundidad al puntero | Los mismos de FX01 | Caras y encuadre válidos durante el giro; no añade imágenes. |
| FX03 — Reflejo de cobre | MAT-01; TEX-01 y ENV-01 si se justifican | Material e iluminación coherentes. No hace falta una textura animada de brillo. |
| FX04 — Entrada editorial | Texto y componentes existentes | Ninguna imagen adicional. |
| FX05 — Greca trazada | VEC-02 | Trazados separados, editables y con orden de recorrido; versión completa estática. |
| FX06 — Respuesta de tarjeta | VEC-03 y estilos existentes | Reutilizar flecha; elevación, borde y opacidad por CSS. |
| FX07 — Selección continua | Elementos de navegación existentes | Subrayado por CSS; sin una imagen por opción. |
| FX08 — Paneles suaves | VEC-03 y paneles existentes | Reutilizar menú/cerrar; movimiento por código. |
| FX09 — Cambio de resultados | Tarjetas, IMG-03 o VEC-04 cuando correspondan | Reutilizar el contenido de las tarjetas, sin versiones animadas de portadas. |
| FX10 — Hilo de trayectoria | Línea, nodos y texto existentes | Construir segmentos con CSS o SVG; sin imagen de la cronología completa. |
| FX11 — Transición entre páginas | Contenido y recursos de las páginas | No entregar capturas preparadas para cada transición. Las instantáneas, si la API las usa, se producen en el navegador. |
| FX12 — Relación destacada | Enlaces y conectores SVG generados desde las relaciones | No requiere una ilustración por relación ni un grafo rasterizado. El grafo sigue siendo posterior. |
| FX13 — Confirmación de copia | VEC-03 | Añadir símbolo de confirmación; mensaje textual independiente. |
| FX14 — Apertura de evidencia | Captura o diagrama opcional ya inventariado | Reutilizar el original y su miniatura; sin nuevas imágenes por estado del visor. |

Las portadas, retratos opcionales, evidencias, favicon y vista previa social mantienen sus especificaciones anteriores. Los efectos no los convierten en recursos obligatorios nuevos.

## 12. Separación, carga y presupuestos de recursos

| Grupo | Qué incluye | Cuándo se solicita |
| --- | --- | --- |
| Diseño base | IMG-01/IMG-02, SVG de identidad e interfaz, composiciones editoriales y portadas seleccionadas | Según la página y el tamaño visible. Permanece disponible con efectos apagados. |
| Escena opcional | Geometría de 3D-01, parámetros MAT-01, mapas TEX-01 y ENV-01 cuando existan | Solo después de que el controlador permita activar WebGL en Inicio. |
| Animación de interfaz | Código de efectos sobre SVG, CSS y contenido existente | Cuando el modo elegido permita esas animaciones; no requiere otra colección de imágenes. |

No precargar modelos, texturas o entorno desde el diseño base. Los recursos 3D no deben aparecer como imágenes ocultas ni como fondos CSS que se descarguen aun con la escena desactivada. En modo Sin efectos, la composición estática **sí** pertenece al diseño visible y se conserva.

**Presupuesto conjunto de la escena:** objetivo inicial de hasta 1 MB transferido para geometría, mapas y entorno. Si el entorno es externo al modelo, también cuenta. No sumar una copia incrustada y otra externa del mismo mapa. El código del motor y los decodificadores se miden aparte; las alternativas estáticas conservan sus presupuestos IMG-01/IMG-02. Los tamaños orientan el prototipo y no son resultados ya obtenidos.

Si se elige geometría procedural, registrar el tamaño de su código como parte del coste de la escena para que el presupuesto no oculte una descarga trasladada del modelo al módulo. Además del peso transferido, medir memoria de texturas y buffers: un archivo pequeño no garantiza bajo consumo gráfico.

La selección de variante se decide antes de la descarga. Reducir la calidad después puede ahorrar procesamiento, pero no recupera los bytes ya descargados. En cada cambio de modo se deben liberar los recursos opcionales que ya no se utilicen, manteniendo disponibles los del diseño base.

## 13. Entrega y validación complementarias

Por cada recurso, registrar: ID, capa a la que pertenece, efectos que lo usan, versión, procedencia, dimensiones o complejidad geométrica, formato, peso, variantes, parámetros de color y alternativa estática asociada. Para texturas, añadir uso de cada mapa y canales; para la escena, cámaras y transformaciones finales.

Comprobar al integrar:

1. Correspondencia visual entre el modelo en reposo y sus dos composiciones estáticas.
2. Giro y ensamble sin recortes en escritorio y móvil.
3. Grecas completas sin cargar animaciones; iconos legibles en sus estados normales y de confirmación.
4. Ausencia de descargas 3D al iniciar con Sin efectos, Suave o Desactivar 3D.
5. Alternativa estática visible ante fallo de modelo, textura, entorno o contexto gráfico.
6. Peso total y memoria observados, con deduplicación de materiales y mapas compartidos.
7. Ausencia de bucles de renderizado y liberación de recursos al desactivar la escena.

Esta actualización completa el inventario de producción. No genera todavía el modelo ni las imágenes, y no añade funciones nuevas al alcance de efectos aprobado como propuesta.
