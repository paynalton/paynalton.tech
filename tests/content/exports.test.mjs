import test from 'node:test';
import assert from 'node:assert/strict';
import { readSource, createRepository } from '../../src/lib/site/repository.mjs';
import { createTranslator } from '../../src/lib/site/i18n.mjs';
import { projectDocument, projectMarkdown, canonicalUrl } from '../../src/lib/site/exports.mjs';
import { siteContentLoader } from '../../src/lib/site/loader.mjs';
const origin = 'https://paynalton.tech';

test('project export allows only public facts and preserves source precision', async () => {
 const repository = createRepository(await readSource());
 const entry = repository.publicEntries('es').find(e=>e.entityId==='pipila');
 const doc = projectDocument(repository,'pipila','es',origin);
 assert.deepEqual(Object.keys(doc).sort(), ['schemaVersion','id','language','canonical','title','summary','role','operationalStatus','startLabel','technologies','body','relations'].sort());
 for (const key of ['title','summary','role','operationalStatus','startLabel','body']) assert.equal(doc[key],entry[key]);
 assert.equal(doc.canonical,'https://paynalton.tech/es/proyectos/pipila/');
 assert.deepEqual(doc.technologies,entry.facts.technologies);
 assert.equal(doc.relations.length,entry.relations.length);
 const {t} = createTranslator('es',repository.getCatalogs(),repository.getSettings());
 const markdown = projectMarkdown(doc,t);
 assert.ok(markdown.includes(entry.body.trim()));
 assert.ok(markdown.includes('Aproximadamente 2023.'));
 assert.ok(markdown.includes(doc.canonical));
 assert.doesNotMatch(JSON.stringify(doc),/bodyRef|visibility|example|seo|PRIVATE/);
});

test('drafts, examples, unavailable translations and private relations cannot export', async () => {
 const raw = await readSource();
 raw.entities.find(e=>e.id==='sodigital').visibility = 'draft';
 let repository = createRepository(raw);
 assert.ok(projectDocument(repository,'pipila','es',origin).relations.every(r=>!JSON.stringify(r).includes('sodigital')));
 for (const [id,locale] of [['pipila','nah'],['ejemplo-lectura','es'],['../pipila','es'],['alma','es']]) assert.throws(()=>projectDocument(repository,id,locale,origin));
 raw.entities.find(e=>e.id==='pipila').visibility='draft'; repository=createRepository(raw);
 assert.throws(()=>projectDocument(repository,'pipila','es',origin));
});

test('canonical URLs cannot escape the configured origin or execute code', () => {
 for(const url of ['//evil.example/x/','/es/../private/','/es/a/?redirect=https://evil.example','javascript:alert(1)','/es/%2e%2e/private/','/es/\n']) assert.throws(()=>canonicalUrl(url,origin));
 for(const host of ['javascript:alert(1)','https://user:secret@example.org','https://example.org/elsewhere','https://example.org/?x=1']) assert.throws(()=>canonicalUrl('/es/',host));
 assert.equal(canonicalUrl('/es/trayectoria/#sodigital',origin), origin+'/es/trayectoria/#sodigital');
});

test('metadata cannot introduce links, HTML or headings into Markdown', () => {
 const text=projectMarkdown({title:'<img src=x onerror=alert(1)>',summary:'[click](javascript:alert(1))\n# Fake',language:'es',canonical:origin+'/es/',technologies:[],body:'Reviewed body.',relations:[]},key=>key);
 assert.ok(text.startsWith('# \\<img'));
 assert.ok(text.includes('\\[click\\]'));
 assert.doesNotMatch(text,/\n# Fake|(?<!\\)<img/);
});

test('synthetic journey collection is emptied when returning to a normal build', async () => {
 const previous=process.env.DESIGN_REVIEW, stored=new Map();
 const context={store:{clear:()=>stored.clear(),set:e=>stored.set(e.id,e)},parseData:async({data})=>data,renderMarkdown:async()=>({html:'',metadata:{}}),generateDigest:()=> 'test'};
 try {
  process.env.DESIGN_REVIEW='1'; await siteContentLoader({journey:true}).load(context);
  assert.equal(stored.size,4);
  assert.ok([...stored.values()].some(e=>e.body.includes('PT06-SYNTHETIC')));
  assert.ok([...stored.values()].every(e=>!e.data.example));
  delete process.env.DESIGN_REVIEW; await siteContentLoader({journey:true}).load(context);
  assert.equal(stored.size,0);
 } finally { if(previous===undefined)delete process.env.DESIGN_REVIEW;else process.env.DESIGN_REVIEW=previous; }
});
