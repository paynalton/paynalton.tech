import {readdir,readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {loadRepository} from '../src/lib/site/repository.mjs';
import {searchDocuments} from '../src/lib/site/search-documents.mjs';
const repo=await loadRepository(),expected=repo.getSettings().locales.filter(l=>l.enabled).flatMap(l=>searchDocuments(repo,l.code));
const manifest=JSON.parse(await readFile('dist/pagefind/search-manifest.json','utf8'));
assert.deepEqual(manifest.documents,expected);
const records=[];
for(const name of await readdir('dist/pagefind/fragment')){
 const raw=gunzipSync(await readFile('dist/pagefind/fragment/'+name)).toString();
 assert.ok(raw.startsWith('pagefind_dcd'));
 const record=JSON.parse(raw.slice('pagefind_dcd'.length));records.push(record);
 const doc=expected.find(d=>d.url===record.url);assert.ok(doc,'Unexpected indexed URL: '+record.url);
 assert.ok(name.startsWith(doc.locale+'_'),'Wrong index language');
 assert.equal(record.meta.title,doc.title);assert.deepEqual(record.filters.type,[doc.type]);
 assert.deepEqual([...(record.filters.topic??[])].sort(),[...doc.topics].sort());
 assert.ok(record.word_count>0);
 assert.doesNotMatch(record.content,/PT0[368]-SYNTHETIC|ejemplo-lectura|PRIVATE|Nota editorial|Preferencias visuales|Copiar enlace/);
}
assert.deepEqual(records.map(r=>r.url).sort(),expected.map(d=>d.url).sort());
console.log(`Índice: ${records.length} fragmentos descomprimidos; URLs, idioma, filtros y exclusiones coinciden con publicación.`);
