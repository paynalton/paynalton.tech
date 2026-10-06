"""Prepare English catalogs with the local Babilonia gateway; never used by builds.
Resume from the source-keyed cache. Does not enable a locale or publish the site.
"""
import hashlib,json,pathlib,re,urllib.request,urllib.error,time
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'src/data/site'
CACHE=ROOT/'.ai_cache/babilonia'
CACHE.mkdir(parents=True,exist_ok=True)
cachefile=CACHE/'translations.json'
cache=json.loads(cachefile.read_text()) if cachefile.exists() else {}
units={}
failed={}
def key(text,context):return hashlib.sha256((context+'\n'+text).encode()).hexdigest()
def register(text,context='general'):
    if not re.search(r'[A-Za-zÁÉÍÓÚáéíóúñÑ]',re.sub(r'<[^>]+>', '', text)):return ('literal',text)
    k=key(text,context);units[k]=(text,context);return ('unit',k)
def result(ref):return ref[1] if ref[0]=='literal' else cache[ref[1]]['translation']
# Keep data identities, slugs, paths, URLs and edition files unchanged.
entities={e['id']:e for e in json.loads((DATA/'entities.json').read_text())}
base=json.loads((DATA/'editorial/es.json').read_text())
ui=json.loads((DATA/'ui/es.json').read_text())
ui_refs={k:({p:register(s) for p,s in v.items()} if isinstance(v,dict) else register(v)) for k,v in ui.items()}
editorial=json.loads(json.dumps(base));fieldrefs=[];bodyrefs={}
public={i for i,e in entities.items() if e['visibility']=='public'}
editorial={i:v for i,v in editorial.items() if i in public}
for i,v in editorial.items():
    context='literario' if entities[i]['type']=='work' else 'general'
    for field in ['title','summary','role','operationalStatus','startLabel']:
        if field in v:
            preserve=field=='title' and (entities[i]['type'] in ['project','experience','profile','channel'] or entities[i].get('facts',{}).get('family')=='technology')
            fieldrefs.append((v,field,('literal',v[field]) if preserve else register(v[field],context)))
    for field in ['title','description']:fieldrefs.append((v['seo'],field,register(v['seo'][field],context)))
    for entry in [v,*v.get('chapters',[])]:
        if entry is not v:fieldrefs.append((entry,'title',register(entry['title'],context)))
        old=entry['bodyRef'];entry['bodyRef']='en/'+old[3:]
        text=(DATA/'bodies'/old).read_text()
        for original_block in re.split(r'(\n\s*\n)',text):
            legacy=[]
            while len(original_block)>2200:
                candidates=list(re.finditer(r'(?<=[.!?])\s+|\n',original_block[:2200]))
                cut=candidates[-1].end() if candidates else original_block.rfind(' ',0,2200)+1
                if cut<=0:cut=2200
                legacy.append(original_block[:cut].rstrip());original_block=original_block[cut:]
            legacy.append(original_block)
            for old_text in legacy:
                prior=cache.get(key(old_text,context))
                if not prior:continue
                tag=r'(</?[A-Za-z][^>]*>)'
                source_parts=re.split(tag,old_text);target_parts=re.split(tag,prior['translation'])
                if len(source_parts)!=len(target_parts) or source_parts[1::2]!=target_parts[1::2]:continue
                for original,translation in zip(source_parts[::2],target_parts[::2]):
                    if original.strip() and translation.strip():cache.setdefault(key(original,context),{**prior,'translation':translation})
        parts=[]
        # Paragraph boundaries are preserved; long paragraphs use sentence boundaries.
        blocks=[]
        for section in re.split(r'(```[\s\S]*?```)',text):
            if section.startswith('```'):blocks.append(section)
            else:
                for piece in re.split(r'(</?[A-Za-z][^>]*>)',section):
                    blocks.extend([piece] if re.fullmatch(r'</?[A-Za-z][^>]*>',piece) else re.split(r'(\n\s*\n)',piece))
        for block in blocks:
            if not block.strip():parts.append(('literal',block));continue
            if block.lstrip().startswith('```'):parts.append(('literal',block));continue
            while len(block)>2200:
                candidates=list(re.finditer(r'(?<=[.!?])\s+|\n',block[:2200]))
                cut=candidates[-1].end() if candidates else block.rfind(' ',0,2200)+1
                if cut<=0:cut=2200
                chunk=block[:cut];space=chunk[len(chunk.rstrip()):];parts.extend([register(chunk.rstrip(),context),('literal',space)]);block=block[cut:]
            if block:parts.append(register(block,context))
        bodyrefs[entry['bodyRef']]=parts

def save():
    temp=cachefile.with_suffix('.tmp');temp.write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n');temp.replace(cachefile)
def request(batch):
    protected={};texts=[]
    for n,(k,(text,context)) in enumerate(batch):
        def protect(m):
            token=f'ZXQ{len(protected):05d}QXZ';protected[token]=m.group(0);return token
        text=re.sub(r'https?://[^\s<>\)\]]+|\{[A-Za-z][\w]*\}|`[^`\n]+`',protect,text)
        texts.append((f'[T{n:04d}] ' if len(batch)>1 else '')+text)
    payload=json.dumps({'text':'\n\n'.join(texts),'context':batch[0][1][1]}).encode()
    req=urllib.request.Request('http://127.0.0.1:8081/v1/translate',data=payload,headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=135) as response:data=json.load(response)
    output=data['translation']
    if len(batch)==1:output='[T0000] '+re.sub(r'^\[(?:T)?0000\]\s*','',output)
    matches=[m for m in re.finditer(r'\[(?:T)?(\d{4})\]\s*',output) if m.group(0).startswith('[T') or int(m.group(1))<len(batch)]
    if [int(m.group(1)) for m in matches]!=list(range(len(batch))):
        (CACHE/f"invalid-{data['request_id']}.json").write_text(json.dumps({'source':texts,'response':data},ensure_ascii=False,indent=2))
        raise ValueError('Translation markers changed')
    translated=[]
    for n,m in enumerate(matches):
        value=output[m.end():matches[n+1].start() if n+1<len(matches) else len(output)].strip()
        expected_tokens=re.findall(r'ZXQ\d+QXZ',texts[n])
        if sorted(re.findall(r'ZXQ\d+QXZ',value))!=sorted(expected_tokens):raise ValueError('Protected token changed')
        for token,original in protected.items():value=value.replace(token,original)
        original=batch[n][1][0]
        if re.findall(r'</?[A-Za-z][^>]*>',original)!=re.findall(r'</?[A-Za-z][^>]*>',value):raise ValueError('HTML structure changed')
        if not value or re.search(r'ZXQ\d|<think>|</think>',value):raise ValueError('Incomplete translation')
        for pattern in [r'\{[A-Za-z][\w]*\}',r'https?://[^\s<>\)\]]+']:
            if sorted(re.findall(pattern,original))!=sorted(re.findall(pattern,value)):raise ValueError('Protected content changed')
        translated.append(value)
    for (k,_),value in zip(batch,translated):cache[k]={'translation':value,'request_id':data['request_id'],'model':data['model'],'review_status':'machine-translated'}
    save()
def translate(batch):
    try:request(batch)
    except (ValueError,urllib.error.HTTPError) as e:
        print('Batch needs subdivision:',str(e),flush=True)
        if len(batch)==1:
            k,(text,context)=batch[0];failed[k]={'text':text,'context':context,'error':str(e)}
            (CACHE/'pending-review.json').write_text(json.dumps(failed,ensure_ascii=False,indent=2))
            return
        half=len(batch)//2;translate(batch[:half]);translate(batch[half:])

# Revalidate older cache entries after strengthening markup protection.
for k,(text,_) in units.items():
    if k in cache and re.findall(r'</?[A-Za-z][^>]*>',text)!=re.findall(r'</?[A-Za-z][^>]*>',cache[k]['translation']):del cache[k]
pending=[item for item in units.items() if item[0] not in cache]
print(f'{len(units)} unique units, {len(pending)} pending, {sum(len(v[0]) for _,v in pending)} characters',flush=True)
batch=[];size=0
for item in pending:
    length=len(item[1][0])+12
    if batch and (size+length>3000 or item[1][1]!=batch[0][1][1]):
        translate(batch);print(f'{sum(k in cache for k in units)}/{len(units)} translated',flush=True);batch=[];size=0
    batch.append(item);size+=length
if batch:translate(batch)
if failed:
    print(f'{len(failed)} fragments need review; complete catalogs were not written.',flush=True)
    raise SystemExit(2)
for obj,field,ref in fieldrefs:obj[field]=result(ref)
def body_result(ref):
    value=result(ref)
    if ref[0]=='literal':return value
    original=units[ref[1]][0]
    leading=original[:len(original)-len(original.lstrip())]
    trailing=original[len(original.rstrip()):]
    value=value.strip()
    marker=re.match(r'^(?:#{1,6}|>|[-*+])\s+',original.lstrip())
    if marker and not value.startswith(marker.group(0)):
        value=re.sub(r'^(?:#{1,6}|>|[-*+])\s+','',value)
        value=marker.group(0)+value
    return leading+value+trailing
for ref,parts in bodyrefs.items():
    path=DATA/'bodies'/ref;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(''.join(body_result(p) for p in parts))
translated_ui={k:({p:result(ref) for p,ref in refs.items()} if isinstance(refs,dict) else result(refs)) for k,refs in ui_refs.items()}
(DATA/'ui/en.json').write_text(json.dumps(translated_ui,ensure_ascii=False,indent=2)+'\n')
(DATA/'editorial/en.json').write_text(json.dumps(editorial,ensure_ascii=False,indent=2)+'\n')
(CACHE/'pending-review.json').write_text('{}\n')
print(f'COMPLETE: {len(editorial)} entries, {len(bodyrefs)} bodies, {len(translated_ui)} UI keys. Locale not enabled yet.',flush=True)
