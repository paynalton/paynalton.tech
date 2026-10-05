# Propuesta gráfica formal — Paynalton

Abrir `index.html` para revisar el dossier y navegar a los estudios completos. `Propuesta_grafica_formal_Paynalton.pdf` es la presentación portátil de 24 páginas; `Propuesta_grafica_formal_Paynalton.md` contiene la edición textual.

Incluye dirección artística, tipografía y composición, 42 colores semánticos, arquitectura de contenidos, 40 widgets con su alcance, 14 efectos, 13 familias de recursos, criterios de aceptación y un atlas de 11 layouts en escritorio y móvil.

Los enlaces del HTML requieren conservar las carpetas hermanas dentro de `ai_reference`. El PDF incorpora las láminas, pero sus enlaces a prototipos requieren el paquete local. Las capturas de layouts son estudios anteriores a la validación RGBA: no representan una aplicación de los ajustes de contraste, las fuentes definitivas ni WebGL.

## Regeneración

Desde la raíz del proyecto:

```sh
python3 ai_reference/propuesta_grafica_layouts/validar_paleta_wcag.py
python3 ai_reference/propuesta_grafica_formal/generar.py
node ai_reference/propuesta_grafica_formal/verificar.mjs
```

El último comando requiere Playwright instalado en el proyecto y Chrome local; genera el PDF, las vistas de portada y `verificacion.json`. No cambia el sitio.

## Verificación realizada

- Sin errores de página, imágenes ausentes, enlaces locales rotos ni anclas inexistentes en el dossier.
- Sin desbordamiento horizontal a 1440, 390 y 320 px.
- Un elemento principal y un H1 en la presentación.
- PDF A4 de 24 páginas con etiquetas estructurales; inspección de paginación y de una lámina del atlas. El etiquetado no acredita conformidad PDF/UA.
- Paleta: 84/84 combinaciones autorizadas pasan; ocho restricciones de uso documentadas.

Los informes de los prototipos enlazados son evidencia previa y no se han vuelto a ejecutar con este dossier. No se declara una auditoría WCAG completa del sitio ni publicación en productivo.
