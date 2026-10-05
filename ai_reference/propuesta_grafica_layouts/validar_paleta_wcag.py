"""Verifica contratos de contraste de la propuesta, no conformidad del sitio."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
COLORS = {name: tuple(map(float, value.split(','))) for name, value in re.findall(
    r'--([\w-]+): rgba\(([^)]+)\)', (ROOT / 'paleta-colores.css').read_text())}


def composite(front, back):
    return tuple(front[i] * front[3] + back[i] * (1 - front[3]) for i in range(3)) + (1,)


def luminance(color):
    channels = [v / 255 for v in color[:3]]
    return sum(w * (v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4)
               for w, v in zip((.2126, .7152, .0722), channels))


def ratio(front, back):
    low, high = sorted((luminance(composite(front, back)), luminance(back)))
    return (high + .05) / (low + .05)


assert abs(ratio((255,255,255,1), (0,0,0,1)) - 21) < 1e-10
assert ratio((0,0,0,0), (255,255,255,1)) == 1
rows = []


def check(front, back, minimum, tint=None, allowed=True):
    background = COLORS[back]
    if tint:
        background = composite(COLORS[tint], background)
    result = ratio(COLORS[front], background)
    rows.append((front, f'{tint} sobre {back}' if tint else back, result, minimum, allowed))


for bg in ('fondo-pagina', 'fondo-principal', 'fondo-superficie', 'fondo-campo'):
    for fg in ('texto-principal', 'texto-secundario', 'texto-discreto', 'enlace-oscuro', 'texto-jade'):
        check(fg, bg, 4.5)
    for fg in ('borde-control', 'foco-sobre-oscuro', 'acento-jade'):
        check(fg, bg, 3)
    for button in ('accion-principal', 'accion-principal-hover', 'accion-principal-presionada'):
        check(button, bg, 3)
for bg in ('fondo-principal', 'fondo-superficie'):
    for tint in ('fondo-seleccion', 'accion-secundaria-fondo'):
        for fg in ('texto-principal', 'texto-secundario', 'texto-sobre-seleccion', 'texto-jade', 'enlace-sobre-tinte'):
            check(fg, bg, 4.5, tint)
        for fg in ('borde-control', 'foco-sobre-oscuro'):
            check(fg, bg, 3, tint)
for button in ('accion-principal', 'accion-principal-hover', 'accion-principal-presionada'):
    check('texto-sobre-accion', button, 4.5)
for fg in ('texto-lectura', 'titulo-lectura', 'enlace-claro'):
    check(fg, 'fondo-lectura', 4.5)
for fg in ('enlace-claro', 'foco-sobre-claro'):
    check(fg, 'fondo-lectura', 3)
for state in ('exito', 'advertencia', 'error', 'informacion'):
    check(f'estado-{state}', 'fondo-superficie', 4.5, f'estado-{state}-fondo')
# Contraejemplos: se documentan, no se autorizan para los usos indicados.
check('texto-discreto', 'fondo-superficie', 4.5, 'fondo-seleccion', False)
check('enlace-oscuro', 'fondo-superficie', 4.5, 'fondo-seleccion', False)
check('enlace-oscuro', 'fondo-superficie', 4.5, 'accion-secundaria-fondo', False)
check('acento-jade', 'fondo-superficie', 4.5, allowed=False)
check('enlace-oscuro', 'fondo-lectura', 4.5, allowed=False)
for button in ('accion-principal', 'accion-principal-hover', 'accion-principal-presionada'):
    check(button, 'fondo-lectura', 3, allowed=False)
failures = [row for row in rows if row[4] and row[2] < row[3]]
count = sum(row[4] for row in rows)
report = f'''# Validación de contraste — paleta Taller nocturno

Objetivo: WCAG 2.2 AA, limitado a los pares de color declarados. Resultado: {count - len(failures)}/{count} combinaciones autorizadas pasan. Se documentan además {len(rows)-count} usos no autorizados.

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
'''
for fg, bg, value, minimum, allowed in rows:
    status = ('Pasa' if value >= minimum else 'FALLA') if allowed else 'No autorizar para este umbral'
    report += f'| `{fg}` | `{bg}` | {value:.3f}:1 | {minimum}:1 | {status} |\n'
report += '''
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
'''
(ROOT / 'Validacion_WCAG_paleta.md').write_text(report)
print(f'{count - len(failures)}/{count} combinaciones autorizadas pasan; {len(rows)-count} restricciones documentadas.')
for failure in failures:
    print('FALLA', failure)
raise SystemExit(bool(failures))
