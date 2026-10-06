import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRepository } from '../../src/lib/site/repository.mjs';
const repo=await loadRepository();
const entries=repo.publicEntries('es');
test('professional selection contains four cases, eight briefs and eleven stages',()=>{
 const projects=repo.select('projects','es');
 assert.equal(projects.length,12);
 assert.equal(projects.filter(e=>e.facts.presentation==='case').length,4);
 assert.equal(projects.filter(e=>e.facts.presentation==='brief').length,8);
 assert.equal(repo.select('experience','es').length,11);
 assert.deepEqual(repo.select('featuredProjects','es').map(e=>e.entityId),['pipila','onix','guacamaya']);
 assert.ok(entries.length>=319);
});
test('every capability has a public source of evidence; deferred works remain private',()=>{
 const terms=repo.select('terms','es').filter(e=>e.facts.family==='capability');assert.equal(terms.length,8);
 for(const term of terms) assert.ok(entries.some(e=>e.relations.some(r=>r.target===term.entityId && r.kind==='demonstrates')),term.entityId);
 assert.ok(!entries.some(e=>['alma','blanco-negro-y-gris','ejemplo-lectura'].includes(e.entityId)));
});
test('publication preserves limited participation and uncertain launches',()=>{
 const body=id=>entries.find(e=>e.entityId===id).body;
 assert.match(body('delta'),/primera versión/);assert.match(body('delta'),/delegué/);assert.match(body('delta'),/ya no se usa/);
 assert.match(body('delta-commerce'),/arquitecto y consultor/);assert.match(body('delta-commerce'),/No desarrollé/);
 assert.match(body('k4y'),/no tengo confirmación/);
 assert.match(body('holstein'),/70 %/);assert.match(body('holstein'),/Desconozco si llegó a producción/);
 assert.match(body('yayauhqui'),/heurísticos/);
 for(const entry of entries) assert.doesNotMatch(entry.body??'',/Nota editorial|Pendiente de confirmar|\*Alma\*/);
});
