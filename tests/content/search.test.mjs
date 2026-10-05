import test from 'node:test';
import assert from 'node:assert/strict';
import {readSource,createRepository} from '../../src/lib/site/repository.mjs';
import {searchDocuments} from '../../src/lib/site/search-documents.mjs';
import {searchState,searchUrl,safeResultUrl} from '../../src/lib/site/search-state.mjs';
const raw=await readSource();
test('index allowlist excludes private works, old pages, duplicate listings and exports',()=>{
 const repo=createRepository(raw),docs=searchDocuments(repo,'es');assert.equal(docs.length,311);
 assert.equal(new Set(docs.map(d=>d.url)).size,docs.length);
 assert.ok(docs.some(d=>d.url==='/es/sobre-mi/'));assert.ok(docs.some(d=>d.url==='/es/trayectoria/'));
 for(const d of docs)assert.doesNotMatch(d.url,/ejemplo|design-review|alma|\.json|\.md|\/explorar\/|\/projects\//);
 const changed=structuredClone(raw);changed.entities.find(e=>e.id==='onix').visibility='draft';
 assert.ok(!searchDocuments(createRepository(changed),'es').some(d=>d.url.includes('/onix/')));
});
test('all topic filters have published definitions, with declared relationships only',()=>{
 const repo=createRepository(raw),entries=repo.publicEntries('es'),topics=entries.filter(e=>e.type==='term');assert.equal(topics.length,185);
 for(const doc of searchDocuments(repo,'es'))for(const id of doc.topics)assert.ok(topics.some(t=>t.entityId===id));
 const yay=entries.find(e=>e.entityId==='yayauhqui');assert.ok(yay.relations.some(r=>r.kind==='assistedBy'));
 assert.ok(!yay.relations.some(r=>r.target==='trabajo-con-inteligencia-artificial' && r.kind==='demonstrates'));
});
test('query and filters round-trip safely, rejecting unknown filters and limiting input',()=>{
 const params=new URLSearchParams({q:'<img src=x onerror=alert(1)>',type:'project',topic:'integracion-de-sistemas'});
 const state=searchState(params,['project'],['integracion-de-sistemas']);const url=searchUrl('https://paynalton.tech/es/explorar/',state);
 assert.deepEqual(searchState(url.searchParams,['project'],['integracion-de-sistemas']),state);assert.equal(url.origin,'https://paynalton.tech');
 const invalid=searchState(new URLSearchParams({q:'x'.repeat(300),type:'javascript:alert(1)',topic:'__proto__'}),['project'],['integration']);assert.equal(invalid.q.length,200);assert.equal(invalid.type,'');assert.equal(invalid.topic,'');assert.equal(invalid.invalid,true);
});
test('search destinations stay within same origin and language',()=>{
 const origin='https://paynalton.tech';
 for(const value of ['javascript:alert(1)','//evil.test/es/','/en/proyectos/','/es/../private/','https://name:pass@paynalton.tech/es/','/es/proyectos/?private=true'])assert.equal(safeResultUrl(value,origin,'/es/'),null);
 assert.equal(safeResultUrl('/es/proyectos/onix/#modernizacion-actual',origin,'/es/'),'/es/proyectos/onix/#modernizacion-actual');
});
