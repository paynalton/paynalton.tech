import test from 'node:test';
import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';
import {readSource,createRepository,loadRepository} from '../../src/lib/site/repository.mjs';
import {routeManifest,pageAlternatives} from '../../src/lib/site/navigation.mjs';
import {loadReading} from '../../src/lib/site/reading-fixture.mjs';
import {siteContentLoader} from '../../src/lib/site/loader.mjs';
import {readingPreferences} from '../../src/lib/site/reading-preferences.mjs';
const source=await readSource();
test('published book retains URL and six local downloads; examples remain private',async()=>{
 const repo=await loadRepository();const works=repo.select('works');assert.equal(works.length,111);
 const book=works.find(e=>e.entityId==='cuando-la-tostadora-te-responde');assert.equal(book.url,'/es/books/cuando-la-tostadora-te-responde/');assert.equal(book.facts.editions.length,6);assert.equal(book.chapters.length,0);
 for(const edition of book.facts.editions){assert.ok((await stat('public'+edition.url)).size>0);}
 assert.equal(routeManifest(repo).some(r=>r.chapterId),false);
});
test('selection and chapter order generate library and reader routes without template changes',()=>{
 const raw=structuredClone(source);raw.entities.find(e=>e.id==='ejemplo-lectura').visibility='public';
 raw.selection.works=['ejemplo-lectura'];raw.selection.featuredWorks=['ejemplo-lectura'];
 raw.editorial.es['ejemplo-lectura'].chapters.reverse();
 const repo=createRepository(raw),work=repo.select('works')[0];assert.equal(work.entityId,'ejemplo-lectura');
 assert.equal(work.chapters[0].id,'capitulo-dos');
 const routes=routeManifest(repo).filter(r=>r.chapterId);assert.equal(routes.length,2);assert.equal(routes[0].chapterId,'capitulo-dos');
 assert.equal(routes[0].parentUrl,work.url);
 raw.entities.find(e=>e.id==='ejemplo-lectura').visibility='draft';assert.equal(routeManifest(createRepository(raw)).some(r=>r.chapterId),false);
});
test('download schema rejects unsafe paths, duplicates and mismatched formats',()=>{
 for(const mutate of [e=>e.url='https://third-party.test/book.pdf',e=>e.url='/books/book/../secret.pdf',e=>e.url='/books/book/book.epub']){
  const raw=structuredClone(source);mutate(raw.entities.find(e=>e.type==='work'&&e.visibility==='public').facts.editions[0]);assert.throws(()=>createRepository(raw));
 }
 const raw=structuredClone(source),facts=raw.entities.find(e=>e.type==='work'&&e.visibility==='public').facts;facts.editions.push(facts.editions[0]);assert.throws(()=>createRepository(raw));
});
test('reader preferences accept only known values',()=>{
 assert.deepEqual(readingPreferences({size:'larger',surface:'dark'}),{size:'larger',surface:'dark'});
 for(const value of [null,{},'<script>',{size:'2000px',surface:'url(remote)'}])assert.deepEqual(readingPreferences(value),{size:'normal',surface:'paper'});
});
test('review uses chapter identity for translations and clears cached fixtures in production',async()=>{
 const old=process.env.DESIGN_REVIEW;
 try{
  process.env.DESIGN_REVIEW='1';const repo=await loadReading(),routes=routeManifest(repo,'/design-review/reading');
  const first=routes.find(r=>r.chapterId==='capitulo-uno'&&r.locale==='es'),last=routes.find(r=>r.chapterId==='capitulo-dos');
  assert.equal(pageAlternatives(routes,first,repo.getSettings()).length,2);assert.equal(pageAlternatives(routes,last,repo.getSettings()).length,1);
  const stored=new Map();const context={store:{clear:()=>stored.clear(),set:e=>stored.set(e.id,e)},parseData:async({data})=>data,renderMarkdown:async body=>({html:body}),generateDigest:()=>''};
  for(const chapters of [false,true]){
   process.env.DESIGN_REVIEW='1';const loader=siteContentLoader({reading:true,chapters});await loader.load(context);assert.equal(stored.size,chapters?3:2);
   delete process.env.DESIGN_REVIEW;await loader.load(context);assert.equal(stored.size,0);
  }
 }finally{if(old===undefined)delete process.env.DESIGN_REVIEW;else process.env.DESIGN_REVIEW=old;}
});
