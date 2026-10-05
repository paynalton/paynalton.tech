import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {loadRepository} from '../src/lib/site/repository.mjs';
import {securityHeaders} from './build-security.mjs';
import {publicDocuments,canonicalPages,llmsText,redirectText,robotsText,origin,migrations} from '../src/lib/site/publication.mjs';
const repo=await loadRepository(),docs=publicDocuments(repo),catalog=JSON.parse(await readFile('dist/catalog.json','utf8'));
assert.equal(catalog.documents.length,docs.length);
for(const [i,d] of docs.entries()){
 assert.equal(catalog.documents[i].id,d.id);assert.equal(catalog.documents[i].canonical,origin+d.url);
 assert.deepEqual(JSON.parse(await readFile('dist'+d.paths.json,'utf8')),d.document,d.url);
 assert.equal(await readFile('dist'+d.paths.markdown,'utf8'),d.markdown,d.url);
}
assert.equal(await readFile('dist/llms.txt','utf8'),llmsText(repo,docs));
assert.equal(await readFile('dist/_redirects','utf8'),redirectText());
assert.equal(await readFile('dist/_headers','utf8'),await securityHeaders('dist'));
assert.equal(await readFile('dist/robots.txt','utf8'),robotsText());
const xml=await readFile('dist/sitemap-0.xml','utf8'),urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(new Set(urls),new Set(canonicalPages(repo).map(p=>origin+p.url)));
assert.equal(new Set(urls).size,urls.length);
for(const m of migrations){
 const [pathname,anchor]=m.to.split('#'),html=await readFile('dist'+pathname+'index.html','utf8');
 if(anchor)assert.ok(html.includes(`id="${anchor}"`),m.to);
}
for(const anchor of ['profile','experience','skills','softskills'])assert.ok((await readFile('dist/es/index.html','utf8')).includes(`id="${anchor}"`),anchor);
const social=await readFile('public/taller/publication/social-es.png');assert.equal(social.readUInt32BE(16),1200);assert.equal(social.readUInt32BE(20),630);assert.ok(social.length<=250000);
const touch=await readFile('public/apple-touch-icon.png');assert.equal(touch.readUInt32BE(16),180);assert.equal(touch.readUInt32BE(20),180);
const ico=await readFile('public/favicon.ico');assert.equal(ico.readUInt16LE(4),2);assert.equal(ico[6],16);assert.equal(ico[22],32);
for(const p of ['favicon.svg','favicon.ico','apple-touch-icon.png','taller/publication/social-es.png'])assert.ok((await stat('dist/'+p)).size>0);
console.log(`PT11: ${docs.length*2} formatos, ${urls.length} URLs canónicas, ${migrations.length} migraciones y recursos PUB-01/02 verificados.`);
