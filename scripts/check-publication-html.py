"""Inspect built HTML and all local link/fragment targets, without a browser or network."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,urljoin,unquote
import json,tomllib,xml.etree.ElementTree as ET
ROOT=Path('dist');ORIGIN='https://paynalton.tech'
config=tomllib.loads(Path('netlify.toml').read_text())
assert config['build']['publish']=='dist' and config['build']['command']=='npm run build'
assert config['build']['environment']['NODE_VERSION']==Path('.nvmrc').read_text().strip()
assert config['build']['environment']['NPM_VERSION']==json.loads(Path('package.json').read_text())['engines']['npm']
assert not config.get('headers'), 'Keep header rules in public/_headers so prebuilt uploads include them'
class Document(HTMLParser):
 def __init__(self,s):
  super().__init__();self.ids=set();self.links=[];self.meta={};self.canon=[];self.alternates=[];self.titles=0;self.ld=[];self.script=False;self.buf='';self.feed(s)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='a' and 'name' in a:self.ids.add(a['name'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag=='title':self.titles+=1
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canon.append(a.get('href'))
  if tag=='link' and a.get('hreflang'):self.alternates.append((a['hreflang'],a['href']))
  if tag=='script' and a.get('type')=='application/ld+json':self.script=True;self.buf=''
 def handle_data(self,s):
  if self.script:self.buf+=s
 def handle_endtag(self,t):
  if t=='script' and self.script:self.ld.append(json.loads(self.buf));self.script=False
pages={('/'+str(p.relative_to(ROOT)).removesuffix('index.html')):Document(p.read_text()) for p in ROOT.rglob('*.html')}
sitemap=ET.parse(ROOT/'sitemap-0.xml');canonical=[x.text for x in sitemap.findall('.//{*}loc')];errors=[]
for url in canonical:
 path=urlsplit(url).path;doc=pages.get(path)
 if not doc:errors.append('Missing HTML '+path);continue
 if doc.canon!=[url]:errors.append('Canonical '+path+str(doc.canon))
 if doc.titles!=1 or not doc.meta.get('description'):errors.append('Title/description '+path)
 if doc.meta.get('og:url')!=url or not doc.meta.get('og:image'):errors.append('Social metadata '+path)
 if not doc.ld:errors.append('Structured data '+path)
 for lang,target in doc.alternates:
  other=pages.get(urlsplit(target).path)
  if not other:errors.append('Missing alternate '+target)
  elif lang!='x-default' and not any(back==url for _,back in other.alternates):errors.append('Nonreciprocal alternate '+path)
for path,doc in pages.items():
 for href in doc.links:
  u=urlsplit(urljoin(ORIGIN+path,href))
  if u.scheme not in ('http','https') or u.netloc!='paynalton.tech':continue
  target=unquote(u.path);file=ROOT/target.lstrip('/')
  if not file.exists() and (ROOT/(target.lstrip('/')+'/index.html')).exists():file=ROOT/(target.lstrip('/')+'/index.html')
  if file.is_dir():file=file/'index.html'
  if not file.exists():errors.append('Broken link '+path+' -> '+href);continue
  if u.fragment:
   key=target if target.endswith('/') else target+'/'
   dest=pages.get(key) or pages.get(target)
   if dest and unquote(u.fragment) not in dest.ids:errors.append('Missing anchor '+path+' -> '+href)
rss=ET.parse(ROOT/'rss.xml');items=rss.findall('./channel/item')
catalog=json.loads((ROOT/'catalog.json').read_text())
assert len(items)==sum(d['type']=='work' for d in catalog['documents'])
for item in items:
 assert item.findtext('link') in canonical
assert not errors,'\n'.join(errors)
print(f'HTML: {len(pages)} páginas, {len(canonical)} metadatos canónicos, enlaces/anclas locales y {len(items)} entradas RSS correctos.')
