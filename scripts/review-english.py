"""Apply reviewed English terminology after the resumable Babel translation."""
import json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
def read(p):return json.loads((root/p).read_text())
def write(p,v):(root/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
u=read('src/data/site/ui/en.json');patch=read('ai_reference/traduccion-en/ui-review.json')
assert not (patch.keys()-u.keys()),'Unknown reviewed UI keys'
u.update(patch)
u['about.reading1Body']=u['about.reading1Body'].replace('well, no way', "that’s just how it is")
u['about.bio']=u['about.bio'].replace('I introduce myself as Pay and sign as Paynalton.', 'I go by Pay and sign my work as Paynalton.').replace('I understand philosophy as a process that moves.', 'I see philosophy as an ongoing process.')
write('src/data/site/ui/en.json',u)
if '--ui-only' in sys.argv:
 print('Reviewed English UI applied.');raise SystemExit(0)
e=read('src/data/site/editorial/en.json')
book='cuando-la-tostadora-te-responde';title=read('src/data/books/toaster-copy.json')['en']['title']
e[book]['title']=title;e[book]['seo']['title']=title+' | Paynalton'
# Keep brand names consistent across visible headings and metadata.
entities={v['id']:v for v in read('src/data/site/entities.json')}
for k,v in e.items():
 if entities[k]['type'] in ['project','experience','profile','channel'] or entities[k].get('facts',{}).get('family')=='technology':v['seo']['title']=v['title']+' | Paynalton'
write('src/data/site/editorial/en.json',e)
print('English UI terminology and established book title applied.')

for ref,replacements in read('ai_reference/traduccion-en/body-review.json').items():
 path=root/'src/data/site/bodies'/ref;text=path.read_text()
 for original,replacement in replacements.items():
  if original in text:text=text.replace(original,replacement)
  else:assert replacement in text, f'Reviewed passage changed: {ref}'
 path.write_text(text)
# Reapply contextual corrections to legacy paragraphs with hard line breaks.
import hashlib,re
wrapped=root/'ai_reference/traduccion-en/wrapped-review.json'
if wrapped.exists():
 for key,record in json.loads(wrapped.read_text()).items():
  ref,index=key.rsplit(':',1);index=int(index)
  source=(root/'src/data/site/bodies'/('es/'+ref[3:])).read_text()
  source_parts=re.split(r'(<br>(?:\s*<br>)+)',source)
  assert hashlib.sha256(source_parts[index].encode()).hexdigest()==record['source_sha256'],ref
  target=root/'src/data/site/bodies'/ref;text=target.read_text()
  before=len(re.findall('<br>',''.join(source_parts[:index])))
  inside=len(re.findall('<br>',source_parts[index]))
  breaks=list(re.finditer('<br>',text))
  assert len(breaks)==len(re.findall('<br>',source)),ref
  start=breaks[before-1].end() if before else 0
  end=breaks[before+inside].start() if before+inside<len(breaks) else len(text)
  target.write_text(text[:start]+record['translation']+text[end:])
