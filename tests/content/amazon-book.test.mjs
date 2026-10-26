import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {amazonEditions,withdrawnBookDownloads} from '../../src/lib/site/amazon-book.mjs';
import {loadRepository} from '../../src/lib/site/repository.mjs';
import {redirectText} from '../../src/lib/site/publication.mjs';
const expected={es:['B0HP2JQ1PZ','B0HP25FVYG','B0HP29YHJ6'],en:['B0HP33J62S','B0HP3HSF82','B0HP5N61D4']};
test('Amazon editions preserve author-supplied ASINs and format-specific stores',()=>{
 for(const lang of ['es','en']){
  const editions=amazonEditions(lang);assert.equal(editions[0].locale,lang);
  for(const edition of editions){assert.deepEqual(edition.formats.map(f=>f.asin),expected[edition.locale]);
   for(const item of edition.formats){
    assert.equal(item.stores.length,{kindle:13,paperback:14,hardcover:12}[item.format]);
    for(const store of item.stores){assert.ok(store.url.startsWith('https://www.amazon.'));assert.ok(store.url.endsWith('/dp/'+item.asin));assert.ok(!store.url.includes('kdp.amazon'));}
    if(item.format==='hardcover')assert.ok(!item.stores.some(s=>['JP','AU','MX','BR','IN'].includes(s.code)));
   }
  }
 }
});
test('only Nahuatl binaries remain public and retired download URLs redirect to the book',async()=>{
 const repo=await loadRepository();
 for(const lang of ['es','en']){
  const book=repo.publicEntries(lang).find(e=>e.entityId==='cuando-la-tostadora-te-responde');
  assert.deepEqual(book.facts.editions.map(e=>[e.locale,e.format]),[['nah','pdf'],['nah','epub']]);
  for(const edition of book.facts.editions)await access('public'+edition.url);
 }
 for(const item of withdrawnBookDownloads){await assert.rejects(access('public'+item.from));assert.ok(redirectText().includes(`${item.from} ${item.to} 301!`));}
});
