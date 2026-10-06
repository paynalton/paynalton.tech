import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import config from '../astro.config.mjs';
import { loadRepository } from '../src/lib/site/repository.mjs';
import { createTranslator } from '../src/lib/site/i18n.mjs';
import { projectDocument, projectMarkdown, exportPaths } from '../src/lib/site/exports.mjs';
const repository = await loadRepository(), expected = new Set();
for (const locale of repository.getSettings().locales.filter(l=>l.enabled)) {
 const {t} = createTranslator(locale.code,repository.getCatalogs(),repository.getSettings());
 for (const entry of repository.publicEntries(locale.code).filter(e=>e.type==='project')) {
  const document=projectDocument(repository,entry.entityId,locale.code,config.site);
  const paths=exportPaths(entry.url);
  assert.deepEqual(JSON.parse(await readFile(`dist${paths.json}`,'utf8')),document);
  assert.equal(await readFile(`dist${paths.markdown}`,'utf8'),projectMarkdown(document,t));
  expected.add(`dist${paths.json}`);expected.add(`dist${paths.markdown}`);
 }
}
const found = new Set();
async function walk(dir) {
 for (const item of await readdir(dir,{withFileTypes:true})) {
  const file=`${dir}/${item.name}`;
  if(item.isDirectory()) await walk(file);
  else if(/\/(?:proyectos|projects)\/[^/]+\/index\.(json|md)$/.test(file)) found.add(file);
 }
}
await walk('dist'); assert.deepEqual(found,expected);
console.log(`Exportaciones: ${expected.size} archivos coinciden con la proyección pública; sin proyectos extra.`);
