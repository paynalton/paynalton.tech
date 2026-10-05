"""Compila el dossier desde los inventarios existentes; no modifica el sitio."""
from pathlib import Path
import re, json, html
ROOT = Path(__file__).resolve().parent
REF = ROOT.parent
LAY = REF / 'propuesta_grafica_layouts'
WID = REF / 'propuesta_grafica_widgets'
layouts = json.loads((LAY/'manifest.json').read_text())
widgets = json.loads((WID/'manifest.json').read_text())
colors = re.findall(r'--([\w-]+): (rgba\([^)]+\))', (LAY/'paleta-colores.css').read_text())
parts, md = [], []
def inline(s):
    s=html.escape(s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
    s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    return s

def section(id, title, cls=''):
    if parts: parts.append('</section>')
    parts.append(f'<section id="{id}" class="sheet {cls}"><p class="eyebrow">PAYNALTON · PROPUESTA GRÁFICA</p><h2>{html.escape(title)}</h2>')
    md.append('\n## '+title+'\n')

def p(s):
    parts.append('<p>'+inline(s)+'</p>');md.append(s+'\n')

def table(headers, rows):
    parts.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th scope="col">'+inline(x)+'</th>' for x in headers)+'</tr></thead><tbody>')
    md.append('| '+' | '.join(headers)+' |\n| '+' | '.join('---' for _ in headers)+' |')
    for row in rows:
        parts.append('<tr>'+''.join('<td>'+inline(str(x))+'</td>' for x in row)+'</tr>');md.append('| '+' | '.join(str(x) for x in row)+' |')
    parts.append('</tbody></table></div>');md.append('')

def image(src, alt, caption, cls=''):
    parts.append(f'<figure class="{cls}"><a href="{src}"><img src="{src}" alt="{html.escape(alt)}"></a><figcaption>{inline(caption)}</figcaption></figure>')
    md.append(f'![{alt}]({src})\n\n{caption}\n')

def source_table(file, marker):
    lines=(file).read_text().splitlines(); idx=next(i for i,l in enumerate(lines) if l.startswith(marker))
    rows=[]
    for l in lines[idx+2:]:
        if not l.startswith('|'): break
        rows.append([x.strip().replace('**','') for x in l.strip('|').split('|')])
    return [x.strip() for x in lines[idx].strip('|').split('|')],rows

section('portada','Taller nocturno','cover')
parts.append('<h1>Un espacio para construir.<br>Un espacio para pensar.</h1>')
md.insert(0,'# Propuesta gráfica formal — Paynalton\n\nTaller nocturno · Versión 1.0 · Documento de diseño para revisión.\n')
p('Propuesta gráfica integral para paynalton.tech. Versión 1.0. Documento de diseño para revisión; reúne las decisiones y los estudios existentes, sin convertir las muestras en funcionalidades publicadas.')
image('../Taller_nocturno_guia_visual.png','Guía visual elegida: obsidiana, cobre, grecas y una composición editorial clara','Referencia de dirección artística. Sus textos, botones y orden de proyectos son orientativos; prevalecen las decisiones editoriales y de accesibilidad posteriores.','guide')
p('La experiencia presenta la capacidad de construir software, definir soluciones y conducir equipos, junto con una voz propia en literatura y pensamiento. Una entrada memorable conduce a proyectos, lectura y contacto sin imponer el movimiento como requisito.')
parts.append('<nav aria-label="Índice de la propuesta">'+''.join(f'<a href="#{id}">{title}</a>' for id,title in [('direccion','01 Dirección'),('sistema','02 Sistema visual'),('colores','03 Color'),('arquitectura','04 Páginas'),('componentes','05 Componentes'),('movimiento','06 Movimiento'),('recursos','07 Recursos'),('validacion','08 Validación'),('L1','09 Atlas'),('anexos','10 Anexos')])+'</nav>')

section('direccion','01 · Dirección y objetivos')
table(['Objetivo del sitio','Respuesta del diseño'],[
('Mostrar experiencia técnica y capacidad de conducción','Proyectos destacados antes de listados extensos de herramientas; fichas que distinguen contexto, aportación y decisiones.'),
('Facilitar una conversación profesional','Acción principal reconocible, correo accesible y enlaces públicos con propósito claro.'),
('Dar un lugar propio a obra y pensamiento','Superficies de pergamino, ritmo editorial, índice y lectura sin distracciones.'),
('Relacionar experiencia, capacidades e ideas','Taxonomía común y enlaces explicados; las relaciones no dependen de un grafo.'),
('Transmitir identidad y cuidado','Obsidiana, cobre y grecas moderadas; escena del taller como único protagonista visual animado.')])
p('El taller reúne planos, uniones y materiales como metáfora de construcción. Las grecas aparecen como remates de identidad, con espacio a su alrededor. Los ornamentos no compiten con nombres, titulares ni acciones. Las imágenes de proyectos se incorporan cuando aportan evidencia; no se exige ilustrar cada tarjeta.')
p('El alcance actual trabaja en español, con salida estática de Astro y recursos propios. Las interacciones se resuelven en el navegador o durante la construcción del sitio; no se incorporan servicios externos de pago ni procesamiento de servidor requerido por estas funciones.')
p('Se conservan Pipila, Onix y GUACAMAYA como destacados. Reckitt y Mead Johnson pueden nombrarse; la autorización no se extiende automáticamente a logotipos, capturas privadas ni otros clientes. La biblioteca será configurable y utiliza ejemplos durante el desarrollo. Alma y Blanco, negro y gris permanecen fuera de publicación. El CV se actualizará y generará después de terminar el sitio.')

section('sistema','02 · Sistema visual y composición')
table(['Elemento','Criterio de diseño'],[
('Identidad','Marca tipográfica y greca escalonada. Ornamentos concentrados en cabecera, remates y escena; no en cada párrafo.'),
('Tipografía de interfaz','Manrope como dirección para navegación, títulos profesionales y texto funcional; pesos limitados y fuentes servidas localmente al implementar.'),
('Voz editorial','Fraunces para títulos, fragmentos y acentos literarios. La lectura extensa debe probarse con textos reales antes de cerrar peso y tamaño.'),
('Fuentes de las muestras','Atkinson local y Georgia son sustitutas de prototipado. Las capturas no acreditan la integración de Manrope y Fraunces.'),
('Retícula','Dos zonas en la portada de escritorio: mensaje y escena. Catálogos en columnas; cronología vertical; texto largo en una columna de lectura.'),
('Escala propuesta para implementación','Cuerpo 16–18 px; lectura 18–20 px con interlínea 1,65–1,85; ancho de lectura orientativo 60–75 caracteres. Titulares fluidos, sin truncamiento.'),
('Espaciado propuesto','Ritmo base de 8 px, con pasos de 16, 24, 32, 48 y 64 px. Ajustar por jerarquía y contenido, no por llenar el espacio.'),
('Móvil','Una columna, mensaje antes de escena, controles apilados e índice antes del texto. Tamaños táctiles de diseño de al menos 44 × 44 px; probar también zoom y 320 px de ancho.'),
('Iconografía','Familia SVG sobre retícula de 24 × 24; trazo coherente, etiquetas para acciones ambiguas y nombre accesible para controles solo con icono.')])
p('Las medidas de este apartado son una propuesta de normalización para la implementación. No describen una migración ya aplicada a los prototipos. El criterio es conservar la jerarquía al cambiar contenido, tamaño de pantalla o preferencias de movimiento.')

section('colores','03 · Color por función y accesibilidad')
p('La identidad conserva obsidiana, pergamino, cobre y jade. La especificación vigente contiene 42 nombres semánticos RGBA, incluidas las dos variantes añadidas tras validar fondos tintados. El color se elige por su uso y por el fondo real, no por cercanía visual con una muestra.')
parts.append('<div class="swatches">')
for name,value in colors:
    parts.append(f'<div class="swatch"><span style="background:{value}" aria-hidden="true"></span><strong>{name}</strong><code>{value}</code></div>')
parts.append('</div>')
table(['Regla','Aplicación obligatoria'],[
('Texto sobre oscuro','texto-principal, texto-secundario y texto-discreto en las superficies opacas validadas. No reducir opacidad del contenedor.'),
('Texto sobre pergamino','texto-lectura y titulo-lectura; enlaces con enlace-claro y subrayado permanente.'),
('Selección y tintes','texto-sobre-seleccion reemplaza texto-discreto; enlace-sobre-tinte reemplaza enlace-oscuro. No apilar tintes arbitrariamente.'),
('Botones','Texto oscuro sobre cobre. Sobre pergamino añadir borde enlace-claro cuando la silueta sea necesaria para identificar el control.'),
('Estados','Texto o símbolo comprensible además del color; colores claros de estado solo en sus paneles oscuros comprobados.'),
('Foco','Contorno de 2 px con separación de 4 px, claro sobre oscuro y oscuro sobre pergamino; comprobar que no quede recortado u oculto.'),
('Decoración','Jade original y bordes ornamentales no sustituyen los colores de texto ni los límites funcionales.')])
p('La validación automática registra 84/84 combinaciones autorizadas que alcanzan sus umbrales de contraste y ocho usos no autorizados. Es una comprobación de pares de color conforme a los criterios de contraste WCAG 2.2 AA, no una certificación de accesibilidad del sitio. Las capturas históricas preceden a esta corrección y conservan su aspecto original.')
p('[Paleta completa y usos](../propuesta_grafica_layouts/Propuesta_esquema_colores_RGBA.md) · [Muestrario actualizado](../propuesta_grafica_layouts/Paleta_colores_RGBA.html) · [Informe WCAG](../propuesta_grafica_layouts/Validacion_WCAG_paleta.md).')
# Tabla completa en la versión editorial; en HTML ya figura el muestrario.
md.append('### Valores RGBA\n\n| Uso | Valor |\n| --- | --- |\n'+'\n'.join(f'| `{n}` | `{v}` |' for n,v in colors)+'\n')

section('arquitectura','04 · Arquitectura de la experiencia')
p('La navegación principal agrupa Proyectos, Trayectoria, Obra y pensamiento, Sobre mí y Contacto. La marca vuelve a Inicio; búsqueda y temas ofrecen recorridos transversales. Las rutas siguientes son destinos propuestos de productivo, no confirmación de despliegue.')
routes={'L0':'Marco común; no crea una ruta','L1':'https://paynalton.tech/es/','L2':'https://paynalton.tech/es/proyectos/','L2-obra':'https://paynalton.tech/es/obra/','L2-explorar':'https://paynalton.tech/es/explorar/','L3':'https://paynalton.tech/es/proyectos/{slug}/','L4':'https://paynalton.tech/es/trayectoria/','L5':'Ruta de cada obra; conservar /es/books/cuando-la-tostadora-te-responde/','L6':'https://paynalton.tech/es/temas/{slug}/','L7':'https://paynalton.tech/es/sobre-mi/','L8':'https://paynalton.tech/es/contacto/'}
table(['Layout','Propósito','Destino propuesto'],[(x['id']+' · '+x['title'],x['zones'][0]['name'],routes[x['id']]) for x in layouts])
p('Se proponen tres recorridos principales: Inicio → proyecto → contacto; Inicio → trayectoria → evidencia; Inicio → obra → lectura → contenido relacionado. La obra conserva valor propio y no se reduce a una pieza del CV. Se mantienen las descargas y enlaces públicos existentes que deban preservarse según el mapa de rutas.')
p('[Mapa de navegación](../Mapa_navegacion_Paynalton.md) · [Rutas y contenidos](../Propuesta_mapa_rutas_y_contenidos_Paynalton.md). El atlas de este dossier permite revisar escritorio y móvil de las once composiciones.')

section('componentes','05 · Sistema de componentes')
p('Los 40 estudios de widgets forman un catálogo de diseño, no 40 obligaciones para la primera versión. El estado de cada pieza conserva el alcance acordado. W13 es una invitación o continuación contextual; no es un proceso de envío de datos.')
table(['ID','Componente','Alcance'],[(w['id'],f"[{w['title']}](../propuesta_grafica_widgets/widgets/{w['id']}.html)",w['state']) for w in widgets])
p('Las familias comparten jerarquía, foco, estados y espaciado. Los controles funcionales son independientes de las animaciones. Los ejemplos de obras están identificados y podrán sustituirse sin rediseñar la biblioteca. W40 documenta la alternativa mediante W34 y permanece excluido como formulario.')
p('[Galería completa de widgets](../propuesta_grafica_widgets/index.html). Cada ficha conserva su explicación y capturas de escritorio y móvil.')

section('movimiento','06 · Movimiento, profundidad y rendimiento')
p('Una sola escena dominante en Inicio. Los efectos acompañan la interacción y no bloquean contenido, foco ni navegación. La composición estática mantiene el mismo espacio y sentido visual cuando WebGL no se activa.')
heads,rows=source_table(LAY/'Propuesta_de_efectos_visuales.md','| ID |')
table(['Efecto','Aplicación','Límite visual'],[(r[0]+' · '+r[1],r[2],r[4]) for r in rows])
p('Familia inicial: FX01–FX10 y FX13. FX11 queda condicionado a compatibilidad de navegación; FX12 se limita inicialmente a relaciones enlazadas, con grafo posterior; FX14 acompaña a los visores cuando se incorporen. La escena actual es un estudio CSS/SVG inmóvil, no WebGL instalado.')
table(['Capa','Responsabilidad'],[('Diseño permanente','HTML, tipografía, composición, paleta, grecas, estados y alternativa estática.'),('Funciones','Menús, búsqueda, filtros, lectura, copia y gestión del foco. No esperan a una animación.'),('Efectos opcionales','Controlador separable con inicio, pausa, ajuste de calidad y liberación de recursos. Desactivarlo conserva diseño y funciones.')])
p('Modos previstos: Automático, Suave, Completo y Sin efectos, más desactivación de 3D. Respetar movimiento reducido y preferencias persistidas. Los recursos de la escena se cargan solo cuando se autoriza su activación; se pausa fuera de pantalla o con la pestaña oculta.')
p('La propuesta de efectos selecciona Three.js para la escena y la API JavaScript abierta de Motion solo cuando CSS, SVG o Web Animations API no basten. No propone desplazamiento global intervenido. Versiones y licencias se fijarán al implementar conforme al documento técnico enlazado.')
p('Objetivos iniciales de la escena: hasta 60 000 triángulos, 30 llamadas de dibujo, DPR máximo 1,5 y 1 MB para geometría, texturas y entorno. Código y decodificadores se presupuestan aparte; la memoria GPU se mide por separado. Son límites propuestos, pendientes de verificar con la escena real.')
p('[Especificación completa de efectos, modos y degradación](../propuesta_grafica_layouts/Propuesta_de_efectos_visuales.md).')

section('recursos','07 · Imágenes y recursos gráficos')
p('La producción distingue los recursos permanentes de los que pertenecen a la escena opcional. No se requieren secuencias de imágenes por fotograma ni una portada distinta por cada estado animado.')
heads,rows=source_table(LAY/'Inventario_de_imagenes_y_recursos_graficos.md','| ID |')
table(['ID','Recurso','Especificación','Incorporación'],[(r[0],r[1],r[4],r[5]) for r in rows])
p('La imagen estática de escritorio y su variante móvil deben compartir composición, materiales y encuadre final con la escena. Texturas y entorno se incorporan solo si aportan una mejora visible dentro de los límites. Las portadas reales respetan su proporción original; no se aumenta artificialmente su resolución.')
p('Las capturas de proyectos, retratos, diagramas y video son opcionales, según contenido seleccionado. No se requieren bancos de imágenes ni recursos comerciales. Cada archivo necesita procedencia y permiso de uso adecuados; las imágenes informativas tendrán alternativa textual y las ornamentales quedarán fuera de la lectura asistida.')
p('[Inventario completo y correspondencia recurso–efecto](../propuesta_grafica_layouts/Inventario_de_imagenes_y_recursos_graficos.md).')

section('validacion','08 · Validación y criterios de aceptación')
table(['Estado','Evidencia / trabajo pendiente'],[
('Comprobado en esta compilación','La paleta pasa 84 combinaciones autorizadas. El dossier se verifica en escritorio y móvil, con enlaces locales, recursos y salida PDF.'),
('Evidencia local previa','Los informes existentes de layouts registran 11 páginas y 22 capturas, sin errores, desbordamientos ni enlaces fallidos reportados; menú, filtros y estado vacío probados. Se conservan como evidencia previa, sin presentar una nueva auditoría de esos prototipos.'),
('Diseñado, pendiente de implementar','Escena WebGL, carga y degradación de efectos, fuentes definitivas, traslado de tokens a componentes y rutas finales.'),
('Contenido diferido por decisión','Obras completas al cierre del proyecto; CV después de terminar el sitio. Los ejemplos no se publicarán como obras atribuidas.'),
('Alcance de accesibilidad','Paleta validada; el conjunto del sitio aún necesita evaluación funcional y manual. Las láminas no certifican WCAG.')])
p('Para aceptar la implementación se probarán los recorridos principales con teclado y en móvil, reflujo a 320 px y zoom, nombres accesibles, foco visible y no oculto, contraste en todos los estados, texto alternativo, selección sin depender del color y lectura sin animación ornamental.')
p('La automatización deberá cubrir construcción estática, enlaces y recursos, regresiones de navegación/búsqueda/filtros/lectura, capturas por layout, análisis de accesibilidad y contratos de contraste. Los hallazgos automáticos se complementan con revisión manual y pruebas con lector de pantalla.')
p('Las pruebas de seguridad deberán revisar dependencias, exposición de secretos en archivos y artefactos, tratamiento de consultas y contenido, enlaces externos, cabeceras de seguridad del despliegue y ausencia de cargas remotas no previstas. Las pruebas de rendimiento verificarán que Sin efectos no solicite recursos 3D, que se liberen al desactivar y que el contenido siga disponible sin WebGL.')
p('Este dossier consolida la propuesta para revisión y sirve de referencia de implementación. No registra aprobación de cada función, no cambia el sitio productivo y no añade costos ni compromisos de entrega.')

for item in sorted(layouts,key=lambda x:(x['id']!='L1', layouts.index(x))):
    id=item['id'];section(id,f"Atlas · {id} / {item['title']}",'layout-sheet')
    p(item['note'])
    parts.append('<div class="screens">')
    for mode,label in [('escritorio','Escritorio · 1440 px'),('movil','Móvil · 390 px')]:
        src=f'../propuesta_grafica_layouts/capturas/{mode}/{id}.png'
        image(src, f'{item["title"]}: vista de {mode}',label+' · Recorte de la parte superior; abrir la imagen para ver la página completa.',mode)
    parts.append('</div>')
    p('Zonas: '+'; '.join(z['name']+' ('+z['widgets']+')' for z in item['zones'])+'.')
    p(f'[Abrir composición navegable](../propuesta_grafica_layouts/layouts/{id}.html). Captura de estudio anterior a la paleta corregida; no acredita contraste final, fuentes definitivas ni efectos instalados.')

section('anexos','10 · Anexos y orden de referencia')
p('Ante diferencias entre la imagen original y una decisión posterior, prevalece la decisión posterior del propietario. Para color y contraste, usar la paleta corregida y su informe; para alcance, conservar los estados de los widgets y las decisiones editoriales actualizadas. Las capturas explican composición y no sustituyen las especificaciones.')
table(['Documento','Uso'],[
('[Contenido editorial](../Contenidos_editoriales_Paynalton_ES.md)','Fuente de textos, junto con las decisiones posteriores del propietario.'),
('[Pendientes priorizados](../Pendientes_editoriales_priorizados_Paynalton.md)','Alcance editorial vigente y trabajo diferido.'),
('[Navegación](../Mapa_navegacion_Paynalton.md)','Recorridos del visitante.'),
('[Rutas y contenidos](../Propuesta_mapa_rutas_y_contenidos_Paynalton.md)','Organización de destinos y preservación de enlaces.'),
('[Widgets y ubicaciones](../Widgets_y_mapa_de_ubicacion_Paynalton.md)','Relación funcional entre componentes y páginas.'),
('[Galería de layouts](../propuesta_grafica_layouts/index.html)','Composiciones navegables completas.'),
('[Galería de widgets](../propuesta_grafica_widgets/index.html)','40 estudios individuales con su alcance.'),
('[Paleta RGBA](../propuesta_grafica_layouts/Propuesta_esquema_colores_RGBA.md)','42 nombres por uso y reglas de combinación.'),
('[Validación WCAG](../propuesta_grafica_layouts/Validacion_WCAG_paleta.md)','Resultados, restricciones y fuentes normativas.'),
('[Recursos gráficos](../propuesta_grafica_layouts/Inventario_de_imagenes_y_recursos_graficos.md)','Especificaciones y relación con efectos.'),
('[Efectos visuales](../propuesta_grafica_layouts/Propuesta_de_efectos_visuales.md)','Movimiento, librerías propuestas y modos de calidad.'),
('[Plan de trabajo](../Plan_de_trabajo_recomendado_Paynalton.md)','Ejecución y validación del proyecto.')])
p('El HTML es la edición de revisión con enlaces a las muestras completas; requiere conservar las carpetas hermanas. El PDF es la edición portátil de presentación, con las láminas incorporadas; los prototipos enlazados requieren el paquete local. El Markdown conserva el contenido editable del dossier.')
parts.append('</section>')
css='''@font-face{font-family:Atkinson;src:url('../propuesta_grafica_layouts/assets/atkinson-regular.woff')}@font-face{font-family:Atkinson;src:url('../propuesta_grafica_layouts/assets/atkinson-bold.woff');font-weight:700}
*{box-sizing:border-box}html{scroll-behavior:auto}body{margin:0;background:var(--fondo-pagina);color:var(--texto-principal);font:17px/1.65 Atkinson,system-ui,sans-serif}.sheet{max-width:1180px;margin:32px auto;padding:56px;background:var(--fondo-principal);border:1px solid var(--borde-decorativo)}.eyebrow{font-size:12px;letter-spacing:2px;color:var(--enlace-oscuro)}h1{font:clamp(36px,5vw,65px)/1.1 Georgia,serif;max-width:950px;margin:28px 0}h2{font:36px/1.2 Georgia,serif;margin:16px 0 28px}p{max-width:1000px}a{color:var(--enlace-oscuro);text-underline-offset:4px}a:focus-visible{outline:2px solid var(--foco-sobre-oscuro);outline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:16px 24px;border-top:1px solid var(--borde-decorativo);padding-top:24px;margin-top:32px}img{display:block;max-width:100%;height:auto}figure{margin:24px 0}figcaption{font-size:13px;color:var(--texto-secundario);margin-top:10px}.guide img{width:100%}table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}th{text-align:left;color:var(--texto-principal);background:var(--fondo-superficie)}td,th{padding:12px;border-bottom:1px solid var(--borde-decorativo);vertical-align:top;overflow-wrap:anywhere}td{color:var(--texto-secundario)}.table-wrap{overflow-x:auto}.swatches{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:24px 0}.swatch{background:var(--fondo-superficie);padding:14px;min-width:0;break-inside:avoid}.swatch span{display:block;height:40px;border:1px solid var(--borde-control);margin-bottom:10px}.swatch strong,.swatch code{display:block;font-size:12px;overflow-wrap:anywhere}.swatch code{margin-top:6px}.screens{display:grid;grid-template-columns:3fr 1fr;gap:24px}.screens img{width:100%;height:400px;object-fit:cover;object-position:top;border:1px solid var(--borde-decorativo)}.screens figure{min-width:0}.layout-sheet>p{font-size:15px}code{overflow-wrap:anywhere}.print-tools{max-width:1180px;margin:24px auto;padding:0 20px;font-size:14px}
@media(max-width:760px){.sheet{margin:12px;padding:24px 18px}h2{font-size:29px}.swatches{grid-template-columns:1fr 1fr}.screens{grid-template-columns:1fr}.screens .movil{max-width:300px}td,th{padding:8px;font-size:13px}.screens img{height:330px}nav{gap:14px}.eyebrow{font-size:10px}table{min-width:0}}
@page{size:A4;margin:14mm 13mm 16mm} @media print{body{background:#fff;color:#1d2425;font-size:10pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}.sheet{margin:0;padding:0;border:0;max-width:none;background:white;break-before:page}.sheet:first-of-type{break-before:auto}h1{font-size:32pt}h2{font-size:24pt;break-after:avoid}.eyebrow{color:#805234}p{orphans:3;widows:3}a{color:#805234}td{color:#414b43}th{color:#1d2425;background:#eee9df}td,th{font-size:8pt;padding:6px;border-color:#c7bbaa}tr{break-inside:avoid}thead{display:table-header-group}.table-wrap{overflow:visible}figure{break-inside:avoid;margin:12px 0}figcaption{font-size:8pt;color:#414b43}.screens{grid-template-columns:3fr 1fr;gap:14px}.screens img{height:330px}.layout-sheet>p{font-size:10pt}.guide img{max-height:340px;object-fit:contain}.swatches{grid-template-columns:repeat(3,1fr);gap:6px;margin:16px 0}.swatch{background:#263234;color:#f3eee3;padding:7px}.swatch span{height:20px;margin-bottom:6px}.swatch strong,.swatch code{font-size:8pt}.print-tools,nav{display:none}.layout-sheet{break-inside:avoid}.cover{min-height:0}}
'''
(ROOT/'propuesta.css').write_text(css)
(ROOT/'index.html').write_text('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paynalton — Propuesta gráfica formal / Taller nocturno</title><link rel="stylesheet" href="../propuesta_grafica_layouts/paleta-colores.css"><link rel="stylesheet" href="propuesta.css"></head><body><div class="print-tools"><a href="Propuesta_grafica_formal_Paynalton.pdf">Descargar presentación PDF</a> · <a href="Propuesta_grafica_formal_Paynalton.md">Documento editable</a></div><main>'+''.join(parts)+'</main></body></html>')
(ROOT/'Propuesta_grafica_formal_Paynalton.md').write_text('\n'.join(md))
print(f'Dossier generado: {len(layouts)} layouts, {len(widgets)} widgets, {len(colors)} colores, 14 efectos y 13 familias de recursos.')
