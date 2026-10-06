"""Structural translation checks and an editorial review report (not linguistic certification)."""
import json,pathlib,re,collections
root=pathlib.Path(__file__).resolve().parents[1];data=root/'src/data/site'
es=json.loads((data/'editorial/es.json').read_text());en=json.loads((data/'editorial/en.json').read_text())
entities=json.loads((data/'entities.json').read_text());public={e['id'] for e in entities if e['visibility']=='public'}
assert set(en)==public
report={'entries':len(en),'bodies':0,'source_characters':0,'translated_characters':0,'review_flags':[]}
for i,target in en.items():
 source=es[i]
 for a,b in zip([source,*source.get('chapters',[])],[target,*target.get('chapters',[])]):
  s=(data/'bodies'/a['bodyRef']).read_text();t=(data/'bodies'/b['bodyRef']).read_text()
  assert re.findall(r'</?[A-Za-z][^>]*>',s)==re.findall(r'</?[A-Za-z][^>]*>',t),(i,'HTML structure changed')
  assert re.findall(r'```[\s\S]*?```',s)==re.findall(r'```[\s\S]*?```',t),(i,'Code changed')
  assert not re.search(r'ZXQ\d+QXZ|\[T\d{4}\]|<think>|</think>',t),(i,'Model artifacts')
  assert t.strip(),i
  report['bodies']+=1;report['source_characters']+=len(s);report['translated_characters']+=len(t)
  sw=re.findall(r'\w+',re.sub(r'<[^>]*>',' ',s));tw=re.findall(r'\w+',re.sub(r'<[^>]*>',' ',t))
  if len(sw)>50 and not .55<len(tw)/len(sw)<1.6:report['review_flags'].append({'id':i,'reason':'word-count ratio','ratio':round(len(tw)/len(sw),3)})
  if re.search(r'(?im)^(?:here (?:is|are) (?:the|your) translation|I (?:cannot|can.t) (?:translate|assist)|as an AI)',t):report['review_flags'].append({'id':i,'reason':'possible model commentary'})
folder=root/'ai_reference/traduccion-en';folder.mkdir(exist_ok=True)
(folder/'text-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
