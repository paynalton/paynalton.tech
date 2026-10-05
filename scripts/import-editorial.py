"""Importa el corpus aprobado usando solo la biblioteca estándar de Python.
No escribe en las fuentes. Decisiones y hashes: ai_reference/implementacion/PT08-C/importacion.json.
"""
import json,re,hashlib,unicodedata,html
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1];M=ROOT/'ai_reference/materiales';D=ROOT/'src/data/site';OUT=ROOT/'ai_reference/implementacion/PT08-C'
def read(p):return json.loads(p.read_text())
def write(p,data):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def slug(s):return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
class SafeHTML(HTMLParser):
 allowed=set('p div span br strong em b i u s del sup sub blockquote ul ol li table thead tbody tr th td hr h2 h3 h4 h5 h6 pre code a'.split())
 blocked=set('script style iframe object embed video audio picture svg form button input textarea select'.split())
 def __init__(self):super().__init__(convert_charrefs=False);self.out=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in self.blocked:self.skip+=1;return
  if self.skip:return
  tag='h2' if tag=='h1' else tag
  if tag not in self.allowed:return
  attrs=dict(attrs);safe={}
  if tag=='a' and 'href' in attrs:
   u=attrs['href'];scheme=urlsplit(u).scheme.lower()
   if scheme in ('http','https','mailto') or (not scheme and u.startswith('#')):safe['href']=u
  if tag in ('th','td'):
   for k in ('colspan','rowspan'):
    if attrs.get(k,'').isdigit():safe[k]=attrs[k]
  if tag=='th' and attrs.get('scope') in ('row','col'):safe['scope']=attrs['scope']
  self.out.append('<'+tag+''.join(' '+k+'="'+html.escape(v,quote=True)+'"' for k,v in safe.items())+'>')
 def handle_endtag(self,tag):
  if tag in self.blocked:self.skip=max(0,self.skip-1);return
  tag='h2' if tag=='h1' else tag
  if not self.skip and tag in self.allowed and tag not in ('br','hr'):self.out.append('</'+tag+'>')
 def handle_data(self,s):
  if not self.skip:self.out.append(s)
 def handle_entityref(self,s):
  if not self.skip:self.out.append('&'+s+';')
 def handle_charref(self,s):
  if not self.skip:self.out.append('&#'+s+';')
 def handle_comment(self,s):pass

def clean(text,title):
 text=re.sub(r'\A---\n.*?\n---\n','',text,flags=re.S).lstrip('\n')
 # El título ya se presenta en la cabecera del lector.
 text=re.sub(r'^# '+re.escape(title)+r'\s*\n','',text,count=1)
 if text.startswith('#Cuentos\n'):text=text[len('#Cuentos\n'):]
 parts=re.split(r'(^```[^\n]*\n.*?^```[^\n]*(?:\n|$)|`[^`\n]+`)',text,flags=re.M|re.S)
 for i in range(0,len(parts),2):
  chunk=parts[i].replace('\\<', '&lt;')
  # Markdown hace inertes los ejemplos de código; el HTML editorial usa una lista positiva.
  parser=SafeHTML();parser.feed(chunk);parser.close();chunk=''.join(parser.out)
  chunk=re.sub(r'^# ', '## ',chunk,flags=re.M)
  parts[i]=chunk
 result=''.join(parts).strip()+'\n'
 # No se admiten enlaces Markdown ejecutables ni recursos visuales en las obras importadas.
 active=re.sub(r'^```[^\n]*\n.*?^```[^\n]*(?:\n|$)|`[^`\n]+`','',result,flags=re.S|re.M)
 if re.search(r'\]\(\s*(?:javascript|data|vbscript):|!\[[^\]]*\]\(',active,re.I):raise ValueError('Enlace inseguro o imagen')
 return result

def main():
 source=read(M/'clasificacion_textos.json');entries=source['entries'];byid={e['id']:e for e in entries}
 exclude={'M017','M018','M019','M020','M031','M032'}
 # Preferir versiones publicadas frente a borradores locales; La Bestia conserva la publicación original.
 choices={'V01':'M007','V02':'M070','V03':'M023','V04':'M041','V05':'M061','V06':'M062','V07':'M066','V08':'M132'}
 selected=[e for e in entries if e['category']!='documentacion' and e['id'] not in exclude and (not e['version_group'] or choices[e['version_group']]==e['id'])]
 assert len(selected)==110
 entities=read(D/'entities.json');editorial=read(D/'editorial/es.json');selection=read(D/'selection.json');ui=read(D/'ui/es.json')
 # La importación se puede repetir: sustituye solo lo generado por este script.
 old=read(OUT/'importacion.json') if (OUT/'importacion.json').exists() else {'generated_entities':[]}
 oldids=set(old['generated_entities']);entities=[e for e in entities if e['id'] not in oldids]
 for key in oldids:editorial.pop(key,None)
 for group in selection:selection[group]=[key for key in selection[group] if key not in oldids and key!='ejemplo-lectura']
 categories={c['id']:c['label'] for c in source['categories']};vocab={v['id']:v['label'] for v in source['tagging']['vocabulary']}
 formats={'cuentos':'fiction','reflexiones-filosoficas':'essay','criticas':'critique','academicos':'essay','poesia':'poetry','tecnicos':'technical','humor':'humor','personales':'personal','editoriales':'editorial'}
 # Resúmenes editoriales independientes del cuerpo y de las notas privadas de clasificación.
 summaries={
 'M003':'La llegada de una nueva conductora altera la rutina del metro.',
 'M008':'Una advertencia acompaña a quienes se adentran en la bruma de San Jacinto.',
 'M066':'Un jardín guarda la memoria de una vida compartida.',
 'M001':'Una propuesta exploratoria sobre números indeterminados y sus operaciones.',
 'M004':'Presentación del espacio dedicado a los cuentos de sangre y muerte.',
 'M014':'Presentación de un espacio para reunir relatos diversos.',
 'M060':'El comienzo de un blog sobre tecnología, inteligencia artificial y cuentos.',
 'M109':'Una reflexión sobre la diferencia entre acumular dinero y construir capital.',
 'M112':'Una búsqueda personal sobre la fe, el conocimiento y la existencia.',
 'M114':'Una cosmogonía humanista presentada como un mensaje dirigido a la humanidad.',
 'M062':'Una parodia que describe las relaciones de pareja como si fueran un sistema informático.',
 'M064':'Paquetes, dependencias y actualizaciones en GNU/Linux.',
 'M065':'Una explicación de los usuarios, los permisos y las convenciones de la consola.',
 'M138':'Un capitán recuerda por qué no quiere contratar a otro ingeniero LATAM.',
 'M139':'La historia de una fuerza humana a la que nadie pudo detener.',
 }
 renames={'M064':'Paquetes y dependencias en GNU/Linux','M065':'Usuarios y permisos en GNU/Linux','M138':'Se solicita ingeniero FTL humano'}
 seen=set();records=[];generated=[];terms={}
 def term(key,title,genre=False):
  ident='lectura-'+key
  if ident in terms:return ident
  terms[ident]=title
  entities.append({'id':ident,'type':'term','visibility':'public','relations':[],'facts':{'family':'genre' if genre else 'topic'}})
  summary=f'Textos de la biblioteca relacionados con «{title.lower()}».'
  ref='es/temas-literarios/'+key+'.md';p=D/'bodies'/ref;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(summary+'\n')
  editorial[ident]={'status':'published','slug':ident,'title':title,'summary':summary,'seo':{'title':title,'description':summary},'bodyRef':ref}
  selection['terms'].append(ident);generated.append(ident);return ident
 for e in selected:
  raw=(M/e['path']).read_text();assert sha(raw)==e['sha256'],e['path']
  title=renames.get(e['id'],e['title']);base=slug(title)
  if not base[0].isalpha():base='texto-'+base
  if base in seen:base+='-'+slug(Path(e['path']).parent.name)+'-'+e['id'].lower()
  seen.add(base);ident='texto-'+base
  body=clean(raw,e['title'])
  # Resumen por defecto: descripción temática, sin las notas de procedencia del catálogo interno.
  note=e['rationale'].split(';')[0].split('. ')[0].strip().rstrip('.')
  if any(word in note.lower() for word in ['versión','version local','título','metadatos','archivo','declara','publicad','coautor','forma narrativa','estructura','predomina']):
   note=e['subtype'].split(' / ')[0]+' sobre '+', '.join(vocab[t].lower() for t in e['editorial']['tags'][2:])
  summary=summaries.get(e['id'],note+'.')
  ref='es/obras/'+base+'.md';p=D/'bodies'/ref;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(body)
  group=term('categoria-'+e['category'],categories[e['category']],True)
  relations=[{'target':group,'kind':'discusses'}]
  for tag in e['editorial']['tags']:
   relations.append({'target':term(tag,vocab[tag]),'kind':'discusses'})
  facts={'format':formats[e['category']],'author':'Paynalton y Paoz' if e['id']=='M030' else 'Paynalton','editions':[],'fullText':True,'category':e['category']}
  if e['source_url']:facts['sourceUrl']=e['source_url']
  date=re.search(r'^(?:date|published_at): "(\d{4})',raw,re.M)
  if date:facts['year']=int(date[1])
  if e['id'] in {'M109','M112'}:facts['partial']=True
  if e['editorial'].get('series'):facts['series']=e['editorial']['series']
  entities.append({'id':ident,'type':'work','visibility':'public','relations':relations,'facts':facts})
  editorial[ident]={'status':'published','slug':base,'title':title,'summary':summary,'seo':{'title':title,'description':summary[:170]},'bodyRef':ref}
  selection['works'].append(ident);generated.append(ident)
  variants=[x['id'] for x in entries if x['version_group'] and x['version_group']==e['version_group']]
  records.append({'material':e['id'],'entity':ident,'url':'/es/obra/'+base+'/','source':e['path'],'source_sha256':sha(raw),'bodyRef':ref,'body_sha256':sha(body),'variants':variants,'summary':summary})
 # Relaciones de serie: enlaces entre entregas sin inventar capítulos ni unir textos.
 for rec in records:
  ent=next(e for e in entities if e['id']==rec['entity']);series=ent['facts'].get('series')
  if series:
   ent['relations'] += [{'target':other['entity'],'kind':'related'} for other in records if other!=rec and byid[other['material']]['editorial'].get('series')==series]
 selection['featuredWorks']=['cuando-la-tostadora-te-responde']+[next(x['entity'] for x in records if x['material']==m) for m in ['M134','M118']]
 for key,label in categories.items():
  if key!='documentacion':ui['work.category.'+key.replace('-','')]=label
 ui.update({'work.format.critique':'Crítica y opinión','work.format.poetry':'Poesía','work.format.technical':'Texto técnico','work.format.humor':'Humor','work.format.personal':'Nota personal','work.format.editorial':'Presentación de archivo','work.partial':'Manuscrito parcial','work.partialHelp':'Este texto se conserva como manuscrito parcial.','work.source':'Publicación original','work.filterCategory':'Tipo de lectura','work.allCategories':'Todas las lecturas','work.libraryIndex':'Índice de la biblioteca','work.readText':'Leer texto','work.downloadText':'Descargar texto','work.exportJson':'Descargar ficha JSON','work.exportMarkdown':'Descargar Markdown','work.catalogCount':'{count} obras en la biblioteca','work.noResults':'No hay obras de este tipo.','work.originalText':'Texto original','work.formats':'Formatos de descarga'})
 write(D/'entities.json',entities);write(D/'editorial/es.json',editorial);write(D/'selection.json',selection);write(D/'ui/es.json',ui)
 write(OUT/'importacion.json',{'scope':'PT08-C','source_files':140,'content_files':125,'imported_works':len(records),'excluded_materials':sorted(exclude),'version_choices':choices,'transforms':['Se retira la cabecera editorial privada.','El título H1 se presenta en la ficha y los subtítulos se normalizan a H2.','HTML limitado a texto, tablas y enlaces seguros; sin estilos heredados, imágenes ni contenido activo.','Código literal preservado dentro de bloques y spans Markdown.'],'generated_entities':generated,'works':records})
 print(f'{len(records)} obras y {len(terms)} términos incorporados. Fuentes sin modificar.')

if __name__=='__main__':main()
