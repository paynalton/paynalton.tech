import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import config from '../astro.config.mjs';
import {loadRepository} from '../src/lib/site/repository.mjs';
import {createTranslator} from '../src/lib/site/i18n.mjs';
import {workDocument,workMarkdown,exportPaths} from '../src/lib/site/exports.mjs';
const repo=await loadRepository(),expected=new Set();
for(const locale of repo.getSettings().locales.filter(l=>l.enabled)){
 const {t}=createTranslator(locale.code,repo.getCatalogs(),repo.getSettings());
 for(const entry of repo.publicEntries(locale.code).filter(e=>e.type==='work' && e.facts.fullText)){
  const doc=workDocument(repo,entry.entityId,locale.code,config.site),paths=exportPaths(entry.url);
  assert.deepEqual(JSON.parse(await readFile('dist'+paths.json,'utf8')),doc);
  assert.equal(await readFile('dist'+paths.markdown,'utf8'),workMarkdown(doc,t));
  expected.add('dist'+paths.json);expected.add('dist'+paths.markdown);
 }
}
const found=new Set();
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+item.name;if(item.isDirectory())await walk(p);else if(/\/obra\/[^/]+\/index\.(json|md)$/.test(p))found.add(p);}}
await walk('dist');assert.deepEqual(found,expected);
console.log(`Obras: ${expected.size} exportaciones coinciden con los textos públicos.`);
