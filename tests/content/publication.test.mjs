import test from 'node:test';
import assert from 'node:assert/strict';
import {readSource,createRepository,loadRepository} from '../../src/lib/site/repository.mjs';
import {canonicalPages,publicDocuments,llmsText,migrations,redirectText,entryExportPaths} from '../../src/lib/site/publication.mjs';
import {pageSeo,safeJsonLd} from '../../src/lib/site/seo.mjs';
import {routeManifest} from '../../src/lib/site/navigation.mjs';
const repo=await loadRepository();
test('one publication boundary covers every public entity and preserves export identity',()=>{
 const docs=publicDocuments(repo);assert.equal(docs.length,638);assert.equal(new Set(docs.map(d=>d.paths.json)).size,638);
 for(const d of docs){assert.equal(d.document.id,d.id);assert.equal(d.document.language,d.language);assert.equal(d.document.canonical,'https://paynalton.tech'+d.url);assert.doesNotMatch(JSON.stringify(d.document),/bodyRef|visibility|ai_reference/);}
 assert.equal(docs.find(d=>d.id==='cuando-la-tostadora-te-responde').document.facts.editions.length,6);
 assert.match(llmsText(repo,docs),/https:\/\/paynalton.tech\/es\/obra\/legado\/index.md/);
 const pages=canonicalPages(repo);assert.equal(pages.length,639);assert.equal(new Set(pages.map(p=>p.url)).size,639);
 for(const p of pages)assert.ok(!migrations.some(m=>m.from===p.url));
 assert.deepEqual(entryExportPaths({entityId:'example',url:'/es/trayectoria/#example'}),{json:'/es/trayectoria/example.json',markdown:'/es/trayectoria/example.md'});
});
test('drafts and untranslated pieces are absent from formats, llms and canonical pages',async()=>{
 const raw=await readSource();raw.entities.find(e=>e.id==='texto-legado').visibility='draft';
 const changed=createRepository(raw),docs=publicDocuments(changed);
 assert.ok(!docs.some(d=>d.id==='texto-legado'));assert.doesNotMatch(llmsText(changed,docs),/\/obra\/legado\//);
 assert.ok(!canonicalPages(changed).some(p=>p.url==='/es/obra/legado/'));
 assert.ok(docs.some(d=>d.language==='en'));
 assert.ok(!docs.some(d=>d.id==='texto-legado' && d.language==='en'));
 assert.ok(canonicalPages(changed).some(p=>p.url==='/en/about/'));
});
test('SEO describes visible content and real equivalents without invented authors or dates',()=>{
 const manifest=routeManifest(repo);
 const book=pageSeo(repo,manifest.find(p=>p.locale==='es'&&p.entityId==='cuando-la-tostadora-te-responde'));
 assert.deepEqual(book.alternatives.map(a=>a.language),['es','en','nah']);
 const entry=manifest.find(p=>p.entityId==='texto-mi-querido-arbol'),seo=pageSeo(repo,entry),graph=JSON.parse(seo.jsonLd)['@graph'];
 assert.deepEqual(graph.find(n=>n['@type']==='CreativeWork').author.map(a=>a.name),['Paynalton','Paoz']);
 assert.equal(seo.alternatives.length,2);assert.doesNotMatch(seo.jsonLd,/datePublished|dateModified/);
 for(const p of manifest.filter(p=>!p.legacy)){const s=pageSeo(repo,p);assert.ok(s.title && s.description);assert.equal(s.canonical,'https://paynalton.tech'+p.url);}
});
test('JSON-LD cannot terminate its script element and migration has no chains',()=>{
 const hostile={name:'</script><img src=x onerror=alert(1)>\u2028'};
 assert.doesNotMatch(safeJsonLd(hostile),/<|\u2028/);assert.deepEqual(JSON.parse(safeJsonLd(hostile)),hostile);
 const sources=new Set(migrations.map(m=>m.from));
 for(const m of migrations){assert.ok(!sources.has(m.to.split('#')[0]));assert.match(redirectText(),new RegExp(m.from+' '+m.to+' 301!'));}
 assert.ok(!redirectText().includes('/*'));assert.ok(!redirectText().includes(' 200'));
});

test('enabling another dictionary does not duplicate the retained legacy root',async()=>{
 const raw=await readSource();raw.settings.locales.find(l=>l.code==='en').enabled=true;
 raw.ui.en=structuredClone(raw.ui.es);raw.editorial.en={};
 const pages=canonicalPages(createRepository(raw));
 assert.equal(pages.filter(p=>p.url==='/en/').length,1);
 assert.equal(pages.find(p=>p.url==='/en/').legacy,undefined);
 assert.ok(pages.some(p=>p.url==='/en/about/' && !p.legacy));
});
