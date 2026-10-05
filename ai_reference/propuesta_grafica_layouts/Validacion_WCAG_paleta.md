# Validación de contraste — paleta Taller nocturno

Objetivo: WCAG 2.2 AA, limitado a los pares de color declarados. Resultado: 84/84 combinaciones autorizadas pasan. Se documentan además 8 usos no autorizados.

## Método y alcance

Luminancia relativa sRGB (umbral 0,04045), contraste `(Lmayor + 0,05) / (Lmenor + 0,05)` y composición alfa sobre el fondo indicado antes del cálculo. Los resultados se comparan sin redondear; la tabla muestra tres decimales. No se simulan luces WebGL, fotografías ni fondos apilados no especificados.

Se exige 4,5:1 para todo texto, aunque el texto grande admite 3:1 (24 px o aproximadamente 18,67 px en negrita). Límites de controles e información gráfica necesaria: 3:1 con el fondo adyacente. La decoración pura y los controles inactivos están exentos. Estas excepciones no cubren ayudas ni metadatos.

## Correcciones y restricciones

- El enlace cobre original cae a 3,700:1 sobre selección y a 4,154:1 sobre tinte secundario en fondo-superficie. Usar `enlace-sobre-tinte` y subrayado permanente.
- El texto discreto cae a 4,160:1 sobre selección en fondo-superficie. Usar `texto-sobre-seleccion`.
- El jade original no sirve para texto normal sobre fondo-superficie; usar `texto-jade`. Puede servir como gráfico significativo en los fondos oscuros comprobados.
- Sobre pergamino usar la tinta y el enlace oscuro de lectura. Si se necesita silueta visible del botón cobre, añadir borde `enlace-claro`: el relleno no alcanza 3:1 frente al pergamino.
- No sumar tintes ni colocar texto sobre brillo, imágenes o WebGL sin fondo opaco validado.
- Estados y selección: etiquetas o símbolos comprensibles además del color. Los enlaces en párrafos permanecen subrayados.
- Foco: contorno opaco de 2 px, separado 4 px, según superficie exterior. El muestrario aplica foco explícito a enlaces y botones, incluido pergamino.

## Resultado por combinación

| Primer plano | Fondo efectivo | Contraste | Umbral | Resultado / uso |
| --- | --- | --- | --- | --- |
| `texto-principal` | `fondo-pagina` | 15.556:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-pagina` | 9.826:1 | 4.5:1 | Pasa |
| `texto-discreto` | `fondo-pagina` | 7.156:1 | 4.5:1 | Pasa |
| `enlace-oscuro` | `fondo-pagina` | 6.365:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-pagina` | 9.938:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-pagina` | 5.379:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-pagina` | 15.556:1 | 3:1 | Pasa |
| `acento-jade` | `fondo-pagina` | 5.717:1 | 3:1 | Pasa |
| `accion-principal` | `fondo-pagina` | 6.365:1 | 3:1 | Pasa |
| `accion-principal-hover` | `fondo-pagina` | 8.195:1 | 3:1 | Pasa |
| `accion-principal-presionada` | `fondo-pagina` | 5.050:1 | 3:1 | Pasa |
| `texto-principal` | `fondo-principal` | 13.633:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-principal` | 8.611:1 | 4.5:1 | Pasa |
| `texto-discreto` | `fondo-principal` | 6.272:1 | 4.5:1 | Pasa |
| `enlace-oscuro` | `fondo-principal` | 5.578:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-principal` | 8.710:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-principal` | 4.714:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-principal` | 13.633:1 | 3:1 | Pasa |
| `acento-jade` | `fondo-principal` | 5.010:1 | 3:1 | Pasa |
| `accion-principal` | `fondo-principal` | 5.578:1 | 3:1 | Pasa |
| `accion-principal-hover` | `fondo-principal` | 7.182:1 | 3:1 | Pasa |
| `accion-principal-presionada` | `fondo-principal` | 4.426:1 | 3:1 | Pasa |
| `texto-principal` | `fondo-superficie` | 11.428:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-superficie` | 7.218:1 | 4.5:1 | Pasa |
| `texto-discreto` | `fondo-superficie` | 5.257:1 | 4.5:1 | Pasa |
| `enlace-oscuro` | `fondo-superficie` | 4.676:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-superficie` | 7.301:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-superficie` | 3.952:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-superficie` | 11.428:1 | 3:1 | Pasa |
| `acento-jade` | `fondo-superficie` | 4.200:1 | 3:1 | Pasa |
| `accion-principal` | `fondo-superficie` | 4.676:1 | 3:1 | Pasa |
| `accion-principal-hover` | `fondo-superficie` | 6.020:1 | 3:1 | Pasa |
| `accion-principal-presionada` | `fondo-superficie` | 3.710:1 | 3:1 | Pasa |
| `texto-principal` | `fondo-campo` | 15.556:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-campo` | 9.826:1 | 4.5:1 | Pasa |
| `texto-discreto` | `fondo-campo` | 7.156:1 | 4.5:1 | Pasa |
| `enlace-oscuro` | `fondo-campo` | 6.365:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-campo` | 9.938:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-campo` | 5.379:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-campo` | 15.556:1 | 3:1 | Pasa |
| `acento-jade` | `fondo-campo` | 5.717:1 | 3:1 | Pasa |
| `accion-principal` | `fondo-campo` | 6.365:1 | 3:1 | Pasa |
| `accion-principal-hover` | `fondo-campo` | 8.195:1 | 3:1 | Pasa |
| `accion-principal-presionada` | `fondo-campo` | 5.050:1 | 3:1 | Pasa |
| `texto-principal` | `fondo-seleccion sobre fondo-principal` | 10.705:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-seleccion sobre fondo-principal` | 6.762:1 | 4.5:1 | Pasa |
| `texto-sobre-seleccion` | `fondo-seleccion sobre fondo-principal` | 6.762:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-seleccion sobre fondo-principal` | 6.839:1 | 4.5:1 | Pasa |
| `enlace-sobre-tinte` | `fondo-seleccion sobre fondo-principal` | 5.640:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-seleccion sobre fondo-principal` | 3.702:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-seleccion sobre fondo-principal` | 10.705:1 | 3:1 | Pasa |
| `texto-principal` | `accion-secundaria-fondo sobre fondo-principal` | 12.093:1 | 4.5:1 | Pasa |
| `texto-secundario` | `accion-secundaria-fondo sobre fondo-principal` | 7.638:1 | 4.5:1 | Pasa |
| `texto-sobre-seleccion` | `accion-secundaria-fondo sobre fondo-principal` | 7.638:1 | 4.5:1 | Pasa |
| `texto-jade` | `accion-secundaria-fondo sobre fondo-principal` | 7.726:1 | 4.5:1 | Pasa |
| `enlace-sobre-tinte` | `accion-secundaria-fondo sobre fondo-principal` | 6.371:1 | 4.5:1 | Pasa |
| `borde-control` | `accion-secundaria-fondo sobre fondo-principal` | 4.182:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `accion-secundaria-fondo sobre fondo-principal` | 12.093:1 | 3:1 | Pasa |
| `texto-principal` | `fondo-seleccion sobre fondo-superficie` | 9.043:1 | 4.5:1 | Pasa |
| `texto-secundario` | `fondo-seleccion sobre fondo-superficie` | 5.712:1 | 4.5:1 | Pasa |
| `texto-sobre-seleccion` | `fondo-seleccion sobre fondo-superficie` | 5.712:1 | 4.5:1 | Pasa |
| `texto-jade` | `fondo-seleccion sobre fondo-superficie` | 5.777:1 | 4.5:1 | Pasa |
| `enlace-sobre-tinte` | `fondo-seleccion sobre fondo-superficie` | 4.764:1 | 4.5:1 | Pasa |
| `borde-control` | `fondo-seleccion sobre fondo-superficie` | 3.127:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `fondo-seleccion sobre fondo-superficie` | 9.043:1 | 3:1 | Pasa |
| `texto-principal` | `accion-secundaria-fondo sobre fondo-superficie` | 10.152:1 | 4.5:1 | Pasa |
| `texto-secundario` | `accion-secundaria-fondo sobre fondo-superficie` | 6.412:1 | 4.5:1 | Pasa |
| `texto-sobre-seleccion` | `accion-secundaria-fondo sobre fondo-superficie` | 6.412:1 | 4.5:1 | Pasa |
| `texto-jade` | `accion-secundaria-fondo sobre fondo-superficie` | 6.485:1 | 4.5:1 | Pasa |
| `enlace-sobre-tinte` | `accion-secundaria-fondo sobre fondo-superficie` | 5.348:1 | 4.5:1 | Pasa |
| `borde-control` | `accion-secundaria-fondo sobre fondo-superficie` | 3.510:1 | 3:1 | Pasa |
| `foco-sobre-oscuro` | `accion-secundaria-fondo sobre fondo-superficie` | 10.152:1 | 3:1 | Pasa |
| `texto-sobre-accion` | `accion-principal` | 6.365:1 | 4.5:1 | Pasa |
| `texto-sobre-accion` | `accion-principal-hover` | 8.195:1 | 4.5:1 | Pasa |
| `texto-sobre-accion` | `accion-principal-presionada` | 5.050:1 | 4.5:1 | Pasa |
| `texto-lectura` | `fondo-lectura` | 7.850:1 | 4.5:1 | Pasa |
| `titulo-lectura` | `fondo-lectura` | 13.633:1 | 4.5:1 | Pasa |
| `enlace-claro` | `fondo-lectura` | 5.718:1 | 4.5:1 | Pasa |
| `enlace-claro` | `fondo-lectura` | 5.718:1 | 3:1 | Pasa |
| `foco-sobre-claro` | `fondo-lectura` | 13.633:1 | 3:1 | Pasa |
| `estado-exito` | `estado-exito-fondo sobre fondo-superficie` | 6.135:1 | 4.5:1 | Pasa |
| `estado-advertencia` | `estado-advertencia-fondo sobre fondo-superficie` | 5.922:1 | 4.5:1 | Pasa |
| `estado-error` | `estado-error-fondo sobre fondo-superficie` | 5.607:1 | 4.5:1 | Pasa |
| `estado-informacion` | `estado-informacion-fondo sobre fondo-superficie` | 6.074:1 | 4.5:1 | Pasa |
| `texto-discreto` | `fondo-seleccion sobre fondo-superficie` | 4.160:1 | 4.5:1 | No autorizar para este umbral |
| `enlace-oscuro` | `fondo-seleccion sobre fondo-superficie` | 3.700:1 | 4.5:1 | No autorizar para este umbral |
| `enlace-oscuro` | `accion-secundaria-fondo sobre fondo-superficie` | 4.154:1 | 4.5:1 | No autorizar para este umbral |
| `acento-jade` | `fondo-superficie` | 4.200:1 | 4.5:1 | No autorizar para este umbral |
| `enlace-oscuro` | `fondo-lectura` | 2.444:1 | 4.5:1 | No autorizar para este umbral |
| `accion-principal` | `fondo-lectura` | 2.444:1 | 3:1 | No autorizar para este umbral |
| `accion-principal-hover` | `fondo-lectura` | 1.898:1 | 3:1 | No autorizar para este umbral |
| `accion-principal-presionada` | `fondo-lectura` | 3.081:1 | 3:1 | No autorizar para este umbral |

## Lo que debe comprobarse en la implementación

Esta tabla valida los contrastes previstos de 1.4.3 y 1.4.11; no es una declaración de conformidad WCAG del sitio. El criterio 1.4.1 depende de señales adicionales al color. Los criterios 2.4.7 (foco visible) y 2.4.11 (foco no totalmente oculto) requieren probar teclado, desplazamiento y superposiciones en las páginas reales. Tamaño/área y cambio de contraste del foco de 2.4.13 pertenecen a AAA y no se declaran certificados aquí.

También quedan fuera de este análisis de paleta: semántica, nombres accesibles, lector de pantalla, zoom, redistribución, objetivos táctiles, movimiento y demás criterios WCAG. Revisar estilos computados de cada estado normal, hover, pulsado, seleccionado y con foco cuando se implemente. No se han auditado las capturas anteriores ni el sitio productivo.

## Fuentes oficiales

- [1.4.3 Contraste mínimo, AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- [1.4.11 Contraste no textual, AA](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- [1.4.1 Uso del color, A](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- [WCAG 2.2: requisitos normativos](https://www.w3.org/TR/WCAG22/).
- [2.4.13 Apariencia del foco, AAA](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).

Repetir: `python3 ai_reference/propuesta_grafica_layouts/validar_paleta_wcag.py`. El comando regenera este informe y falla si alguna combinación autorizada queda por debajo de su umbral.
