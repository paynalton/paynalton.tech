"""Retranslate legacy hard-wrapped paragraphs as coherent sentences, preserving BR counts."""
import pathlib,json,re,hashlib,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1];DATA=ROOT/'src/data/site/bodies'
OUT=ROOT/'ai_reference/traduccion-en/wrapped-review.json'
records=json.loads(OUT.read_text()) if OUT.exists() else {}
separator=r'(<br>(?:\s*<br>)+)'
for source in sorted((DATA/'es/obras').glob('*.md')):
    original=source.read_text()
    if len(re.findall(r'(?<!<br>)<br>(?!<br>)',original))<=15:continue
    target=DATA/'en/obras'/source.name
    sources=re.split(separator,original);targets=target.read_text()
    def replace_part(text,n,value):
        before=len(re.findall('<br>',''.join(sources[:n])))
        inside=len(re.findall('<br>',sources[n]))
        breaks=list(re.finditer('<br>',text))
        assert len(breaks)==len(re.findall('<br>',original)),source
        start=breaks[before-1].end() if before else 0
        end=breaks[before+inside].start() if before+inside<len(breaks) else len(text)
        return text[:start]+value+text[end:]
    for n,part in enumerate(sources):
        if n%2 or '<br>' not in part or '```' in part or re.search(r'<(?!br>)[^>]*>',part):continue
        segments=part.split('<br>');plain=re.sub(r'\s*<br>\s*',' ',part).strip()
        if not plain or len(plain)>6000:continue
        digest=hashlib.sha256(part.encode()).hexdigest();key=f'en/obras/{source.name}:{n}'
        if key in records and records[key]['source_sha256']==digest:
            targets=replace_part(targets,n,records[key]['translation']);continue
        req=urllib.request.Request('http://127.0.0.1:8081/v1/translate',data=json.dumps({'text':plain,'context':'literario'}).encode(),headers={'Content-Type':'application/json'})
        with urllib.request.urlopen(req,timeout=135) as response:result=json.load(response)
        text=result['translation'].strip()
        urls=lambda s:sorted(re.findall(r'https?://[^\s<>\)\]]+',s))
        assert urls(text)==urls(plain),(key,'URL changed')
        assert '<br>' not in text and not re.search(r'<think>|</think>',text),key
        # Use whitespace outside Markdown links/code as safe wrapping boundaries.
        protected=[m.span() for m in re.finditer(r'\[[^\]]*\]\([^\n]*?\)|`[^`]+`',text)]
        boundaries=[0]+[m.start() for m in re.finditer(r'\s+',text) if not any(a<=m.start()<b for a,b in protected)]+[len(text)]
        weights=[len(s.strip()) for s in segments];total=sum(weights);points=[];cumulative=0;previous=0
        for w in weights[:-1]:
            cumulative+=w;ideal=round(len(text)*cumulative/total)
            point=min((p for p in boundaries if p>=previous),key=lambda p:abs(p-ideal));points.append(point);previous=point
        translated=[];start=0
        for end in points+[len(text)]:translated.append(text[start:end].strip());start=end
        leading=part[:len(part)-len(part.lstrip())];trailing=part[len(part.rstrip()):]
        value=leading+'<br>'.join(translated)+trailing
        targets=replace_part(targets,n,value)
        records[key]={'source_sha256':digest,'translation':value,'request_id':result['request_id'],'model':result['model']}
        OUT.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
        print(f'Reviewed {source.name} paragraph {n//2+1}',flush=True)
    target.write_text(targets)
print(f'Complete: {len(records)} coherent wrapped paragraphs.',flush=True)
