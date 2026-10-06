import test from 'node:test';
import assert from 'node:assert/strict';
import {loadRepository} from '../../src/lib/site/repository.mjs';
import {routeManifest,pageAlternatives,sectionUrl} from '../../src/lib/site/navigation.mjs';
const repo=await loadRepository();
test('English covers all public Spanish entities and preserves shared facts and relationships',()=>{
 const es=repo.publicEntries('es'),en=repo.publicEntries('en');
 assert.equal(en.length,319);assert.deepEqual(en.map(e=>e.entityId),es.map(e=>e.entityId));
 for(const source of es){
  const target=en.find(e=>e.entityId===source.entityId);
  assert.deepEqual(target.facts,source.facts,source.entityId);
  assert.deepEqual(target.relations.map(r=>[r.kind,r.target]),source.relations.map(r=>[r.kind,r.target]));
  assert.ok(target.relations.every(r=>r.url.startsWith('/en/')));
  assert.deepEqual(target.chapters.map(c=>c.id),source.chapters.map(c=>c.id));
  assert.doesNotMatch(target.body,/ZXQ\d+QXZ|\[T\d{4}\]|<think>|PT\d+-SYNTHETIC/);
  const urls=text=>[...text.matchAll(/https?:\/\/[^\s<>\)\]]+/g)].map(m=>m[0]).sort();
  assert.deepEqual(urls(target.body),urls(source.body),source.entityId+' links');
  const code=text=>[...text.matchAll(/```[\s\S]*?```/g)].map(m=>m[0]);
  assert.deepEqual(code(target.body),code(source.body),source.entityId+' code blocks');
 }
});
test('every generated English route has a real Spanish equivalent and English section paths',()=>{
 const manifest=routeManifest(repo);
 for(const page of manifest.filter(p=>p.locale==='en')){
  assert.equal(page.legacy,undefined);assert.ok(pageAlternatives(manifest,page,repo.getSettings()).some(p=>p.locale==='es'));
 }
 assert.equal(sectionUrl('en','experience'),'/en/experience/');
 assert.equal(sectionUrl('en','works'),'/en/works/');
 assert.equal(sectionUrl('en','explore'),'/en/explore/');
 assert.equal(repo.resolve('pipila','en'),'/en/projects/pipila/');
 assert.equal(repo.resolve('texto-guia-1','en'),'/en/works/guia-1/');
});
