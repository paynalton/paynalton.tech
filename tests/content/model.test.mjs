import { referenceSource } from '../../src/lib/site/reference-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, writeFile, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { readSource, createRepository, defaultRoot } from '../../src/lib/site/repository.mjs';
import { createTranslator } from '../../src/lib/site/i18n.mjs';
import { siteContentLoader } from '../../src/lib/site/loader.mjs';

const source = referenceSource(await readSource());
const fresh = () => structuredClone(source);
function bilingual() {
  const s = fresh();
  s.settings.locales.find(l => l.code === 'en').enabled = true;
  s.ui.en = Object.fromEntries(Object.entries(s.ui.es).map(([k, v]) => [k, typeof v === 'string' ? `[Expanded translation] ${v}` : Object.fromEntries(Object.entries(v).map(([form, text]) => [form, `[Expanded translation] ${text}`]))]));
  s.editorial.en = {};
  for (const [id, variant] of Object.entries(s.editorial.es)) {
    const v = structuredClone(variant);
    v.title = `[Translated] ${v.title}`;
    v.slug = `translated-${v.slug}`;
    for (const item of [v, ...(v.chapters ?? [])]) {
      const old = item.bodyRef;
      item.bodyRef = old.replace('es/', 'en/');
      s.bodies[item.bodyRef] = `[Translated] ${s.bodies[old]}`;
    }
    s.editorial.en[id] = v;
  }
  return s;
}

test('real sample uses one publication projection and keeps the book example private', () => {
  const repo = createRepository(fresh());
  assert.deepEqual(repo.publicEntries().map(e => e.entityId), ['pipila', 'sodigital', 'integracion-de-sistemas']);
  assert.equal(repo.select('works').length, 0);
  const preview = repo.select('works', 'es', { preview: true })[0];
  assert.equal(preview.example, true);
  assert.equal(preview.facts.author, null);
  assert.equal(preview.chapters.length, 2);
  assert.match(preview.chapters[0].body, /#nota-uno/);
  assert.equal(repo.resolve('ejemplo-lectura', 'es'), null);
  assert.equal(repo.publicEntries().some(e => 'bodyRef' in e || 'visibility' in e), false);
});

test('public copies cannot mutate repository state', () => {
  const repo = createRepository(fresh());
  repo.publicEntries()[0].facts.technologies.push('UNWANTED');
  repo.getSettings().locales[0].enabled = false;
  assert.equal(repo.publicEntries()[0].facts.technologies.includes('UNWANTED'), false);
});

test('drafts and deferred entries are excluded and inbound relations pruned', () => {
  for (const visibility of ['draft', 'deferred', 'example']) {
    const s = fresh(); s.entities[1].visibility = visibility;
    const repo = createRepository(s);
    assert.equal(repo.resolve('sodigital', 'es'), null);
    assert.equal(repo.publicEntries()[0].relations.some(r => r.target === 'sodigital'), false);
  }
  const s = fresh(); s.editorial.es.pipila.status = 'draft';
  assert.equal(createRepository(s).select('featuredProjects').length, 0);
});

test('an explicitly excluded entity cannot be marked public', () => {
  const s = fresh(); s.settings.excludedIds.push('pipila');
  assert.throws(() => createRepository(s), /aplazada/);
});

test('selection changes order and featured placement without touching templates', () => {
  const s = fresh();
  s.entities.push({ ...structuredClone(s.entities[0]), id: 'otro-proyecto' });
  s.editorial.es['otro-proyecto'] = { ...structuredClone(s.editorial.es.pipila), slug: 'otro-proyecto' };
  s.selection.projects = ['otro-proyecto', 'pipila'];
  s.selection.featuredProjects = ['otro-proyecto'];
  const repo = createRepository(s);
  assert.deepEqual(repo.select('projects').map(e => e.entityId), s.selection.projects);
  assert.deepEqual(repo.select('featuredProjects').map(e => e.entityId), ['otro-proyecto']);
  s.selection.featuredProjects = []; s.selection.projects = ['pipila'];
  assert.equal(createRepository(s).select('projects').length, 1);
});

test('synthetic translation changes dictionaries and config, not templates or IDs', () => {
  const repo = createRepository(bilingual());
  assert.equal(repo.publicEntries('en')[0].entityId, 'pipila');
  assert.equal(repo.resolve('pipila', 'en'), '/en/projects/translated-pipila/');
  assert.equal(repo.alternatives('pipila').length, 2);
  assert.equal(repo.publicEntries('en')[0].relations[0].url, '/en/experience/#translated-sodigital');
});

test('missing editorial translation does not fabricate a page or language option', () => {
  const s = bilingual(); delete s.editorial.en.pipila;
  const repo = createRepository(s);
  assert.equal(repo.resolve('pipila', 'en'), null);
  assert.equal(repo.alternatives('pipila').length, 1);
  assert.equal(repo.publicEntries('en').length, 2);
  assert.equal(repo.resolve('pipila', 'yua'), null);
  assert.deepEqual(repo.publicEntries('unknown'), []);
});

test('disabled translation is never published even with complete dictionaries', () => {
  const s = bilingual(); s.settings.locales.find(l => l.code === 'en').enabled = false;
  assert.deepEqual(createRepository(s).publicEntries('en'), []);
});

for (const [name, mutate] of [
  ['duplicate ID', s => s.entities.push(s.entities[0])],
  ['duplicate route', s => { s.entities.push({ ...s.entities[0], id: 'another' }); s.editorial.es.another = s.editorial.es.pipila; }],
  ['missing reference', s => s.entities[0].relations.push({kind:'related',target:'unknown'})],
  ['wrong relationship type', s => s.entities[0].relations.push({kind:'during',target:'integracion-de-sistemas'})],
  ['duplicate selection', s => s.selection.projects.push('pipila')],
  ['wrong selection type', s => s.selection.projects.push('sodigital')],
  ['featured outside catalog', s => {s.selection.projects = [];}],
  ['invalid date', s => {s.entities[1].facts.start='2020-02-31';}],
  ['reverse period', s => {s.entities[1].facts.end='2019';}],
  ['missing body', s => {delete s.bodies['es/pipila.md'];}],
  ['wrong body language', s => {s.editorial.es.pipila.bodyRef='en/pipila.md';}],
  ['path traversal', s => {s.editorial.es.pipila.bodyRef='../outside.md';}],
  ['unknown private fields', s => {s.editorial.es.pipila.internalNotes='PRIVATE';}],
  ['duplicate chapters', s => s.editorial.es['ejemplo-lectura'].chapters.push(s.editorial.es['ejemplo-lectura'].chapters[0])],
  ['unknown locale dictionary', s => {s.ui.zz={};}],
  ['missing mandatory key', s => {delete s.ui.es['nav.projects'];}],
]) {
  test(`rejects ${name}`, () => {
    const s=fresh(); mutate(s);
    assert.throws(()=>createRepository(s));
  });
}

test('hierarchy rejects cycles but ordinary related links may be reciprocal', () => {
  const s = fresh();
  s.entities.push({ id:'another-term',type:'term',visibility:'public',facts:{family:'topic'},relations:[{kind:'parent',target:'integracion-de-sistemas'}] });
  s.editorial.es['another-term']={...s.editorial.es['integracion-de-sistemas'],slug:'another-term'};
  s.entities[2].relations=[{kind:'parent',target:'another-term'}];
  assert.throws(()=>createRepository(s), /Ciclo/);
  s.entities[2].relations[0].kind='related'; s.entities[4].relations[0].kind='related';
  assert.doesNotThrow(()=>createRepository(s));
});

test('translator preserves zero and empty strings, pluralizes and fails missing parameters', () => {
  const s=fresh(); s.ui.es['sample.value']='Valor: {value}';
  const t=createTranslator('es',s.ui,s.settings);
  assert.equal(t.t('sample.value',{value:0}),'Valor: 0');
  assert.equal(t.t('sample.value',{value:''}),'Valor: ');
  assert.equal(t.t('search.results',{count:1}),'1 resultado');
  assert.equal(t.t('search.results',{count:0}),'0 resultados');
  assert.throws(()=>t.t('sample.value'), /Parámetro/);
  assert.throws(()=>t.t('search.results',{count:'1'}), /count/);
  assert.throws(()=>t.t('unknown.key'), /desconocida/);
  assert.equal(t.t('sample.value',{value:'<img onerror=alert(1)>'}),'Valor: <img onerror=alert(1)>'); // plain text contract
  assert.equal(t.date(new Date('2025-01-01'),{year:'numeric'}),'2025');
});

test('fallback is opt-in and emits a diagnostic without authorizing publication', () => {
  const s=fresh(), diagnostics=[];
  assert.throws(()=>createTranslator('en',s.ui,s.settings).t('nav.home'),/ausente/);
  const t=createTranslator('en',s.ui,s.settings,{fallback:'base',onDiagnostic:d=>diagnostics.push(d)});
  assert.equal(t.t('nav.home'),'Inicio');
  assert.equal(diagnostics[0].code,'missing-translation');
  assert.equal(createRepository(s).publicEntries('en').length,0);
});

test('translation parameter and plural mismatches fail before publication', () => {
  const s=bilingual(); s.ui.en['search.results'].one='{total} result';
  assert.throws(()=>createRepository(s),/Parámetro/);
  const x=bilingual(); delete x.ui.en['search.results'].one;
  assert.throws(()=>createRepository(x),/plurales/);
});

test('reader refuses a body symlink escaping its source directory', async () => {
  const temp=await mkdtemp(path.join(os.tmpdir(),'paynalton-content-'));
  try {
    const target=path.join(temp,'site'); await cp(defaultRoot,target,{recursive:true});
    await writeFile(path.join(temp,'outside.md'),'PRIVATE');
    await rm(path.join(target,'bodies/es/pipila.md'));
    await symlink(path.join(temp,'outside.md'),path.join(target,'bodies/es/pipila.md'));
    await assert.rejects(readSource(target),/fuera del directorio/);
  } finally {await rm(temp,{recursive:true,force:true});}
});

test('Astro loader only stores the public projection, without examples or notes', async () => {
  const stored=new Map();
  await siteContentLoader().load({
    store:{clear:()=>stored.clear(),set:e=>stored.set(e.id,e)},
    parseData:async({data})=>data,renderMarkdown:async()=>({html:'',metadata:{}}),generateDigest:()=> 'test',
  });
  const repository=createRepository(await readSource());
  assert.equal(stored.size,repository.getSettings().locales.filter(l=>l.enabled).flatMap(l=>repository.publicEntries(l.code)).length);
  const serialized=JSON.stringify([...stored.values()]);
  assert.doesNotMatch(serialized,/ejemplo-lectura|Nota editorial|no publicar|PRIVATE/);
});


test('profile and channel schemas separate shared facts from localized copy and reject unsafe URLs', () => {
  const s=fresh();
  s.entities.push({id:'perfil',type:'profile',visibility:'public',facts:{name:'Nombre de prueba',alias:'Prueba'},relations:[]});
  s.editorial.es.perfil={...s.editorial.es.sodigital,slug:'perfil'};
  s.entities.push({id:'correo',type:'channel',visibility:'public',facts:{href:'mailto:example@example.org'},relations:[]});
  s.editorial.es.correo={...s.editorial.es.sodigital,slug:'correo'};
  s.selection.profiles=['perfil'];s.selection.channels=['correo'];
  const repo=createRepository(s);
  assert.equal(repo.resolve('perfil','es'),'/es/sobre-mi/');
  assert.equal(repo.select('channels')[0].facts.href,'mailto:example@example.org');
  s.entities.at(-1).facts.href='javascript:alert(1)';
  assert.throws(()=>createRepository(s));
});

test('Astro reloads its collection on a source change during development', async () => {
  let handler, publications = 0;
  await siteContentLoader().load({
    store:{clear:()=>{publications++;},set:()=>{}},
    parseData:async({data})=>data,renderMarkdown:async()=>({html:'',metadata:{}}),generateDigest:()=> 'test',
    watcher:{add:()=>{},on:(event,callback)=>{handler=callback;}},
    logger:{error:message=>assert.fail(message)},
  });
  assert.equal(publications, 1);
  await handler('change', path.join(defaultRoot, 'entities.json'));
  assert.equal(publications, 2);
  await handler('change', path.join(defaultRoot+'-outside', 'entities.json'));
  assert.equal(publications, 2);
});

test('mixed date precision accepts an end year containing the start month', () => {
  const s=fresh(); s.entities[1].facts.start='2025-03'; s.entities[1].facts.end='2025';
  assert.doesNotThrow(()=>createRepository(s));
  s.entities[1].facts.end='2025-02';
  assert.throws(()=>createRepository(s),/Periodo invertido/);
});

test('regional number/date preferences do not change the language plural rules', () => {
  const s=bilingual();
  s.settings.locales.find(l=>l.code==='en').formatTag='fr-FR';
  s.ui.en['search.results']={one:'{count} result',other:'{count} results'};
  const repo=createRepository(s);
  const t=createTranslator('en',repo.getCatalogs(),repo.getSettings());
  assert.equal(t.t('search.results',{count:0}),'0 results');
  assert.equal(t.number(1.5),'1,5');
});

test('an unsupported plural language requires an explicit reviewed override', () => {
  const s=bilingual(), locale=s.settings.locales.find(l=>l.code==='en');
  locale.tag='qaa'; locale.formatTag='es-MX';
  assert.throws(()=>createRepository(s),/Reglas plurales no disponibles/);
  locale.pluralTag='en';
  assert.doesNotThrow(()=>createRepository(s));
});

test('fallback plural grammar follows the base language, not its number formatting', () => {
  const s=fresh();s.settings.locales[0].formatTag='fr-FR';
  const t=createTranslator('en',s.ui,s.settings,{fallback:'base'});
  assert.equal(t.t('search.results',{count:0}),'0 resultados');
});
