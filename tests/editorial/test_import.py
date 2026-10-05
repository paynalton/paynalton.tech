"""Security and fidelity of the source-to-publication boundary."""
import unittest, importlib.util, json, re, html, hashlib
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('editorial_import',ROOT/'scripts/import-editorial.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class PlainText(HTMLParser):
 def __init__(self):super().__init__();self.out=[]
 def handle_data(self,s):self.out.append(s)
 def handle_starttag(self,t,a):
  if t in ('br','p','div','li','tr'):self.out.append(' ')
def tokens(s):
 # Keep code examples verbatim: they are data, not HTML elements.
 parts=re.split(r'(^```[^\n]*\n.*?^```[^\n]*(?:\n|$)|`[^`\n]+`)',s,flags=re.M|re.S)
 for i in range(0,len(parts),2):
  p=PlainText();p.feed(parts[i].replace('\\<','&lt;'));p.close();parts[i]=''.join(p.out)
 return re.findall(r'\w+',html.unescape(''.join(parts)))
class EditorialImport(unittest.TestCase):
 def test_no_active_html_or_unsafe_links(self):
  body=module.clean('# T\n\n<h1>Heading</h1><p onclick="evil()">Keep</p><script>evil()</script><iframe src="https://bad.test">bad</iframe><img src="https://bad.test"><a href="javascript:evil()">Link</a>', 'T')
  self.assertEqual(body,'<h2>Heading</h2><p>Keep</p><a>Link</a>\n')
  for s in ['[link](javascript:evil())','![image](https://bad.test/a.png)','[link](data:text/html,test)']:
   with self.assertRaises(ValueError):module.clean(s,'T')
 def test_code_examples_and_escaped_html_survive(self):
  code='```html\n<img src="literal.png" onerror="example()">\n```\n\n`<script>example()</script>`\n'
  self.assertEqual(module.clean(code,'T'),code)
  self.assertIn('&lt;div',module.clean('\\<div style="example"\\>','T'))
 def test_all_sources_unchanged_and_110_texts_preserved(self):
  manifest=json.loads((ROOT/'ai_reference/implementacion/PT08-C/importacion.json').read_text())
  entries={e['id']:e for e in json.loads((ROOT/'ai_reference/materiales/clasificacion_textos.json').read_text())['entries']}
  self.assertEqual(len(manifest['works']),110)
  self.assertEqual(len(entries),140)
  for e in entries.values():
   self.assertEqual(hashlib.sha256((ROOT/'ai_reference/materiales'/e['path']).read_bytes()).hexdigest(),e['sha256'],e['id'])
  for w in manifest['works']:
   with self.subTest(material=w['material']):
    source=(ROOT/'ai_reference/materiales'/w['source']).read_text()
    self.assertEqual(hashlib.sha256(source.encode()).hexdigest(),w['source_sha256'])
    body=(ROOT/'src/data/site/bodies'/w['bodyRef']).read_text()
    self.assertEqual(hashlib.sha256(body.encode()).hexdigest(),w['body_sha256'])
    source=re.sub(r'\A---\n.*?\n---\n','',source,flags=re.S).lstrip('\n')
    source=re.sub(r'^# '+re.escape(entries[w['material']]['title'])+r'\s*\n','',source,count=1)
    source=re.sub(r'^#Cuentos\n','',source)
    self.assertEqual(tokens(source),tokens(body))
