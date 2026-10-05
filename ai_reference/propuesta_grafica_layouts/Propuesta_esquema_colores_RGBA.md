# Propuesta de esquema de colores RGBA — Taller nocturno

Los nombres describen la función del color. La identidad conserva obsidiana, pergamino, cobre y jade; se añaden variantes de contraste para lectura, controles y estados.

En `rgba(R, G, B, A)`, los tres primeros valores van de 0 a 255 y la opacidad de 0 a 1. Los colores translúcidos siempre se evalúan sobre el fondo indicado; no tienen un contraste independiente.

## Fondos y superficies

| Nombre por uso | RGBA | Aplicación |
| --- | --- | --- |
| `fondo-pagina` | `rgba(16, 24, 25, 1)` | Fondo exterior y espacios entre composiciones. |
| `fondo-principal` | `rgba(29, 36, 37, 1)` | Obsidiana: base de páginas, cabecera y pie. |
| `fondo-superficie` | `rgba(38, 50, 52, 1)` | Tarjetas, paneles y zonas con elevación visual. |
| `fondo-lectura` | `rgba(243, 238, 227, 1)` | Pergamino: cuerpo de lectura y tarjetas editoriales claras. |
| `fondo-campo` | `rgba(16, 24, 25, 1)` | Buscador, filtros y campos sobre superficies oscuras. |
| `fondo-seleccion` | `rgba(115, 153, 141, 0.16)` | Acento jade decorativo sobre fondo-principal o fondo-superficie; no es el único indicador de selección. |
| `velo-modal` | `rgba(7, 12, 13, 0.76)` | Oscurecer la página detrás de un panel; el panel mantiene fondo opaco. |

## Textos y enlaces

| Nombre por uso | RGBA | Aplicación |
| --- | --- | --- |
| `texto-principal` | `rgba(243, 238, 227, 1)` | Títulos y cuerpo en superficies oscuras. |
| `texto-secundario` | `rgba(184, 194, 186, 1)` | Descripciones y ayudas en superficies oscuras. |
| `texto-discreto` | `rgba(152, 167, 157, 1)` | Metadatos y etiquetas secundarias; conserva legibilidad. |
| `texto-lectura` | `rgba(65, 75, 67, 1)` | Párrafos sobre pergamino. |
| `titulo-lectura` | `rgba(29, 36, 37, 1)` | Títulos en superficies claras. |
| `enlace-oscuro` | `rgba(199, 141, 101, 1)` | Enlaces sobre fondos oscuros; acompañar con subrayado o señal equivalente. |
| `enlace-claro` | `rgba(128, 82, 52, 1)` | Enlaces sobre pergamino; cobre más oscuro que el acento decorativo. |
| `texto-sobre-seleccion` | `rgba(184, 194, 186, 1)` | Sustituye texto-discreto en fondos seleccionados. |
| `enlace-sobre-tinte` | `rgba(217, 164, 126, 1)` | Enlace subrayado sobre selección o tinte de acción secundaria. |
| `texto-sobre-accion` | `rgba(16, 24, 25, 1)` | Texto e iconos de botones rellenos de cobre. |

## Acciones y foco

| Nombre por uso | RGBA | Aplicación |
| --- | --- | --- |
| `accion-principal` | `rgba(199, 141, 101, 1)` | Relleno del botón principal. |
| `accion-principal-hover` | `rgba(217, 164, 126, 1)` | Relleno al pasar el puntero. |
| `accion-principal-presionada` | `rgba(184, 121, 81, 1)` | Relleno durante pulsación; conservar texto oscuro. |
| `accion-secundaria-fondo` | `rgba(199, 141, 101, 0.08)` | Tinte de botón secundario sobre fondo oscuro; texto principal y borde de control. |
| `foco-sobre-oscuro` | `rgba(243, 238, 227, 1)` | Contorno de foco sobre el área oscura, separado del control por un margen. |
| `foco-sobre-claro` | `rgba(29, 36, 37, 1)` | Contorno de foco sobre pergamino, separado del control por un margen. |
| `control-deshabilitado-fondo` | `rgba(57, 68, 66, 1)` | Control no disponible; sin interacción. |
| `control-deshabilitado-texto` | `rgba(157, 170, 160, 1)` | Texto de control deshabilitado. Usar estado semántico y explicación cuando haga falta. |

## Bordes e identidad

| Nombre por uso | RGBA | Aplicación |
| --- | --- | --- |
| `borde-decorativo` | `rgba(199, 141, 101, 0.3)` | Marcos y separadores ornamentales sobre fondos oscuros; no define controles por sí solo. |
| `borde-control` | `rgba(126, 145, 133, 1)` | Límite visible de campos, selectores y botones secundarios oscuros. |
| `borde-lectura` | `rgba(186, 172, 151, 1)` | Separadores decorativos sobre pergamino; no usar como único límite de un control. |
| `acento-greca` | `rgba(199, 141, 101, 1)` | Greca, remates y acentos de cobre. |
| `acento-jade` | `rgba(115, 153, 141, 1)` | Detalle secundario, nodos y líneas; no usar como texto pequeño sobre fondo-superficie. |
| `texto-jade` | `rgba(166, 201, 175, 1)` | Texto de estados o etiquetas verdes sobre superficies oscuras. |
| `sombra-superficie` | `rgba(0, 0, 0, 0.24)` | Elevación discreta; nunca necesaria para identificar un control. |
| `sombra-escena` | `rgba(0, 0, 0, 0.42)` | Apoyo de la composición del taller. |
| `brillo-cobre` | `rgba(217, 164, 126, 0.22)` | Resplandor opcional de la capa de efectos; no detrás de párrafos. |

## Estados sobre fondo oscuro

| Nombre por uso | RGBA | Aplicación |
| --- | --- | --- |
| `estado-exito` | `rgba(166, 201, 175, 1)` | Texto e icono de confirmación. |
| `estado-exito-fondo` | `rgba(115, 153, 141, 0.12)` | Fondo de confirmación sobre fondo-superficie. |
| `estado-advertencia` | `rgba(224, 188, 118, 1)` | Texto e icono de advertencia relevante. |
| `estado-advertencia-fondo` | `rgba(224, 188, 118, 0.1)` | Fondo de advertencia sobre fondo-superficie. |
| `estado-error` | `rgba(237, 170, 163, 1)` | Texto e icono de error recuperable. |
| `estado-error-fondo` | `rgba(237, 170, 163, 0.1)` | Fondo de error sobre fondo-superficie. |
| `estado-informacion` | `rgba(169, 201, 218, 1)` | Texto e icono de información funcional. |
| `estado-informacion-fondo` | `rgba(169, 201, 218, 0.1)` | Fondo informativo sobre fondo-superficie. |

## Combinaciones comprobadas

Cálculo de contraste sobre los valores propuestos. Como criterio de esta paleta se busca al menos **4,5:1 para texto normal** y **3:1 para límites de controles** frente al fondo adyacente. Esto no constituye una auditoría completa de accesibilidad del sitio.

| Primer plano | Fondo | Contraste aproximado |
| --- | --- | --- |
| `texto-principal` | `fondo-principal` | 13.63:1 |
| `texto-secundario` | `fondo-superficie` | 7.22:1 |
| `texto-discreto` | `fondo-superficie` | 5.26:1 |
| `enlace-oscuro` | `fondo-superficie` | 4.68:1 |
| `texto-sobre-accion` | `accion-principal` | 6.37:1 |
| `texto-sobre-accion` | `accion-principal-hover` | 8.20:1 |
| `texto-sobre-accion` | `accion-principal-presionada` | 5.05:1 |
| `texto-lectura` | `fondo-lectura` | 7.85:1 |
| `titulo-lectura` | `fondo-lectura` | 13.63:1 |
| `enlace-claro` | `fondo-lectura` | 5.72:1 |
| `borde-control` | `fondo-superficie` | 3.95:1 |
| `acento-jade` | `fondo-superficie` | 4.20:1 |
| `estado-exito` | `estado-exito-fondo sobre fondo-superficie` | 6.14:1 |
| `estado-advertencia` | `estado-advertencia-fondo sobre fondo-superficie` | 5.92:1 |
| `estado-error` | `estado-error-fondo sobre fondo-superficie` | 5.61:1 |
| `estado-informacion` | `estado-informacion-fondo sobre fondo-superficie` | 6.07:1 |

El jade original se conserva como acento, pero no alcanza el objetivo para texto normal sobre la superficie elevada. Para ese uso se propone `texto-jade`. El cobre claro tampoco debe utilizarse como enlace sobre pergamino: allí corresponde `enlace-claro`.

## Reglas de aplicación

- Fondos oscuros para estructura y contenido profesional; pergamino en lectura y determinadas piezas editoriales. No alternar arbitrariamente el fondo de cada sección.
- El cobre concentra acciones principales, enlaces y acentos. El jade acompaña relaciones o estados; no compite con el botón principal.
- Texto normal opaco. No reducir la opacidad del contenedor completo para crear una variante secundaria: afectaría también a sus hijos y a su contraste.
- Sobre pergamino usar `titulo-lectura`, `texto-lectura` y `enlace-claro`. Los colores claros de estado se reservan a paneles oscuros, también si el panel aparece dentro de una página de lectura.
- Mensajes y selección se identifican además con texto, icono, subrayado o borde. El color no es la única señal.
- Los bordes decorativos no sustituyen `borde-control`. En botones y campos sobre pergamino se puede usar `enlace-claro` como borde visible.
- El foco conserva un contorno opaco y separado del control. El color se elige por el fondo que rodea el control, no por su relleno.
- El velo de un panel no se aplica como opacidad a sus textos. El panel utiliza `fondo-principal` o `fondo-superficie` opacos.
- Al desactivar efectos se mantienen todos los colores, bordes, estados y foco. Solo se retiran el brillo animado y las transiciones; las sombras estáticas discretas pueden permanecer como parte del diseño.
- Los colores de materiales WebGL parten de la misma identidad, pero se ajustarán visualmente bajo la iluminación. No se exige que un píxel iluminado coincida exactamente con el RGBA de un botón.

## Entregables de esta propuesta

- `Paleta_colores_RGBA.html`: muestrario visual con aplicaciones y tabla de contraste.
- `paleta-colores.css`: variables semánticas listas para evaluar en implementación.

Esta propuesta no modifica todavía los colores del sitio ni las capturas de layouts existentes.

## Validación WCAG 2.2 AA

La paleta satisface los umbrales de contraste en las combinaciones autorizadas de `Validacion_WCAG_paleta.md`. Esto no certifica la conformidad WCAG del sitio completo ni implica nivel AAA.

- En selección usar `texto-principal`, `texto-secundario`, `texto-sobre-seleccion` o `texto-jade`; sustituir `texto-discreto` por `texto-sobre-seleccion`.
- En selección y botones secundarios tintados sustituir `enlace-oscuro` por `enlace-sobre-tinte`. Los enlaces dentro de texto llevan subrayado permanente, también sin hover.
- No acumular tintes de selección, acción secundaria o estados: reemplazar el fondo según el estado. Los cálculos no autorizan apilar transparencias arbitrarias.
- En pergamino los botones cobre llevan borde `enlace-claro` si su silueta comunica que son controles; el relleno cobre no alcanza 3:1 frente al pergamino. El borde se contrasta con la superficie exterior; el texto oscuro ya identifica el contenido del botón.
- Los indicadores de selección usan texto explícito o una marca visible con `texto-principal` sobre el fondo seleccionado; el tinte solo no identifica el estado.
- El foco usa contorno de 2 px y separación de 4 px, claro sobre oscuro y oscuro sobre pergamino. Debe quedar visible, sin recorte ni ocultación por cabeceras o paneles. La geometría y visibilidad se verificarán en los componentes.
- Ayudas y placeholders son texto normal y conservan 4,5:1. Solo controles realmente inactivos están exentos; una apariencia atenuada no basta.

La comprobación reproducible se ejecuta con `python3 ai_reference/propuesta_grafica_layouts/validar_paleta_wcag.py`. Lee las variables CSS y regenera el informe, sin dependencias externas.
