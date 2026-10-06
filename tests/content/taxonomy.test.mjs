import test from 'node:test';
import assert from 'node:assert/strict';
import {loadRepository} from '../../src/lib/site/repository.mjs';
import {routeManifest} from '../../src/lib/site/navigation.mjs';
import {pageSeo} from '../../src/lib/site/seo.mjs';
const repo=await loadRepository();
test('published technologies have bilingual evidence and unique branded titles',()=>{
 for(const locale of ['es','en']){
  const entries=repo.publicEntries(locale);
  for(const project of entries.filter(e=>e.type==='project'))for(const name of project.facts.technologies){
   const term=entries.find(e=>e.type==='term' && e.facts.family==='technology' && e.title===name);
   assert.ok(term,name);assert.ok(project.relations.some(r=>r.target===term.entityId));
  }
  for(const page of routeManifest(repo).filter(p=>p.locale===locale)){
   const seo=pageSeo(repo,page);assert.doesNotMatch(seo.title,/Paynalton \| Paynalton/);
   const graph=JSON.parse(seo.jsonLd)['@graph'];
   assert.equal(graph.filter(n=>n['@id']==='https://paynalton.tech/#person').length,1);
   assert.ok(graph.find(n=>n['@type']==='Person').sameAs.includes('https://github.com/paynalton'));
  }
 }
});
