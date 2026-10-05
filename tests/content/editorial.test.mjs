import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadRepository} from '../../src/lib/site/repository.mjs';
import {workDocument,workMarkdown} from '../../src/lib/site/exports.mjs';
import {createTranslator} from '../../src/lib/site/i18n.mjs';
import {routeManifest} from '../../src/lib/site/navigation.mjs';
import {searchDocuments} from '../../src/lib/site/search-documents.mjs';
const repo=await loadRepository(),entries=repo.publicEntries(),manifest=JSON.parse(await readFile('ai_reference/implementacion/PT08-C/importacion.json','utf8'));
const works=entries.filter(e=>e.type==='work' && e.facts.fullText),{t}=createTranslator('es',repo.getCatalogs(),repo.getSettings());
test('approved corpus is complete, consolidated, selectable and discoverable',()=>{
 assert.equal(works.length,110);assert.equal(repo.select('works').length,111);
 const routes=new Set(routeManifest(repo).map(r=>r.url)),search=new Set(searchDocuments(repo,'es').map(r=>r.url));
 for(const w of manifest.works){assert.ok(routes.has(w.url),w.url);assert.ok(search.has(w.url),w.url);}
 assert.equal(new Set(manifest.works.flatMap(w=>w.variants)).size,17);
 for(const e of works)assert.ok(e.relations.some(r=>r.kind==='discusses' && r.target==='lectura-categoria-'+e.facts.category));
});
test('withheld works and supporting files cannot enter the public corpus',()=>{
 assert.deepEqual(manifest.excluded_materials,['M017','M018','M019','M020','M031','M032']);
 for(const id of [...manifest.excluded_materials,'M034','M039','M040','M069','M077','M121'])assert.ok(!manifest.works.some(w=>w.material===id));
 for(const e of entries)assert.ok(!['alma','blanco-negro-y-gris','ejemplo-lectura'].includes(e.entityId));
 for(const id of ['alma','blanco-negro-y-gris','ejemplo-lectura','pipila','cuando-la-tostadora-te-responde'])assert.throws(()=>workDocument(repo,id,'es','https://paynalton.tech'));
});
test('coauthorship, partial manuscripts, series and safe public downloads retain their meaning',()=>{
 const byMaterial=id=>entries.find(e=>e.entityId===manifest.works.find(w=>w.material===id).entity);
 assert.equal(byMaterial('M030').facts.author,'Paynalton y Paoz');
 assert.deepEqual(works.filter(e=>e.facts.partial).map(e=>e.entityId).sort(),['texto-capitalismo-vs-dinerismo','texto-el-dios-en-que-yo-creo']);
 assert.ok(byMaterial('M132').relations.some(r=>r.kind==='related' && r.target===byMaterial('M123').entityId));
 for(const work of works){
  const doc=workDocument(repo,work.entityId,'es','https://paynalton.tech');
  assert.ok(doc.topics.every(t=>typeof t.title==='string' && t.title.length>0));
  assert.equal(doc.body,work.body);assert.equal(doc.author,work.facts.author);
  assert.doesNotMatch(JSON.stringify(doc),/bodyRef|source_sha256|ai_reference|editorial_version_group/);
  assert.ok(workMarkdown(doc,t).includes(work.body.trim()));
 }
});
