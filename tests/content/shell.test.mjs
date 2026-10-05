import { referenceSource } from '../../src/lib/site/reference-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readSource, createRepository } from '../../src/lib/site/repository.mjs';
import { routeManifest, pageAlternatives, navigation, sectionUrl } from '../../src/lib/site/navigation.mjs';
import { effectPolicy, createEffectsController, readPreferences, preferences } from '../../src/lib/site/effects.mjs';
import { matchesQuery } from '../../src/lib/site/search.mjs';

test('navigation only links generated pages and never invents translated equivalents', async () => {
  const raw = referenceSource(await readSource());
  const repository = createRepository(raw);
  const routes = routeManifest(repository);
  assert.equal(routes.length, 10);
  assert.equal(new Set(routes.map(r => r.url)).size, routes.length);
  assert.ok(routes.every(r => r.locale === 'es' && !r.url.includes('ejemplo')));
  assert.equal(navigation(routes, 'es').length, 5);
  const pipila = routes.find(r => r.entityId === 'pipila');
  assert.equal(pageAlternatives(routes, pipila, repository.getSettings()).length, 1);
  // A future locale has complete UI, but only the project translated and published.
  raw.settings.locales.find(l => l.code === 'en').enabled = true;
  raw.ui.en = structuredClone(raw.ui.es);
  raw.editorial.en = { pipila: { ...raw.editorial.es.pipila, slug:'translated-project', bodyRef:'en/pipila.md' } };
  raw.bodies['en/pipila.md'] = 'Translated project body.';
  const translated = createRepository(raw), manifest = routeManifest(translated);
  const alternatives = pageAlternatives(manifest, pipila, translated.getSettings());
  assert.deepEqual(alternatives.map(a => a.url), ['/es/proyectos/pipila/','/en/proyectos/translated-project/']);
  assert.equal(pageAlternatives(manifest, routes.find(r => r.entityId === 'integracion-de-sistemas'), translated.getSettings()).length, 1);
  assert.throws(() => sectionUrl('../es', 'home'));
});

test('effect choice cannot override motion reduction, economy or a failed scene', () => {
  assert.equal(effectPolicy({mode:'full'}, {reducedMotion:true}).motion, false);
  assert.equal(effectPolicy({mode:'full'}, {saveData:true}).allow3D, false);
  assert.equal(effectPolicy({mode:'auto'}, {lowPower:true}).level, 'soft');
  for (const mode of ['soft','off']) assert.equal(effectPolicy({mode}).allow3D, false);
  assert.equal(effectPolicy({mode:'full',disable3D:true}).allow3D, false);
  assert.equal(effectPolicy({mode:'full'}, {hidden:true}).motion, false);
  assert.equal(effectPolicy({mode:'full'}, {}, true).allow3D, false);
  assert.equal(effectPolicy({mode:'full'}).allow3D, true);
});

test('optional adapters clean up, resume and stay disabled after scene failure', () => {
  const controller = createEffectsController({mode:'full'});
  let mounted = 0, removed = 0;
  controller.register('scene', 'scene', () => { mounted++; return () => removed++; });
  assert.equal(mounted, 1);
  controller.setPreferences({mode:'off'}); assert.equal(removed, 1);
  controller.setPreferences({mode:'full'}); assert.equal(mounted, 2);
  controller.setSignals({hidden:true}); assert.equal(removed, 2);
  controller.setSignals({hidden:false}); assert.equal(mounted, 3);
  controller.failScene(); assert.equal(removed, 3);
  controller.setPreferences({mode:'off'}); controller.setPreferences({mode:'full'});
  assert.equal(mounted, 3);
  controller.destroy();
});

test('a throwing visual adapter cannot break functional subscribers', () => {
  const controller = createEffectsController({mode:'full'});
  let updates = 0;
  controller.subscribe(() => updates++);
  assert.doesNotThrow(() => controller.register('broken', 'scene', () => { throw new Error('No GPU'); }));
  assert.equal(controller.getState().allow3D, false);
  assert.ok(updates >= 2);
  controller.destroy();
});

test('invalid or blocked storage resolves to safe defaults without executing input', () => {
  assert.deepEqual(readPreferences({getItem(){throw new Error('blocked');}}), {mode:'auto',disable3D:false});
  assert.deepEqual(readPreferences({getItem(){return '<script>alert(1)</script>';}}), preferences(null));
  assert.deepEqual(preferences({mode:'unknown',disable3D:'false'}), preferences(null));
  assert.deepEqual(readPreferences({getItem(){return '{"mode":"off","disable3D":true}';}}), {mode:'off',disable3D:true});
});

test('basic search handles accents, long summaries and hostile literal queries', () => {
  assert.equal(matchesQuery('Integración de sistemas', 'integracion SISTEMAS'), true);
  assert.equal(matchesQuery('x'.repeat(300)+' Node.js', 'node.js'), true);
  assert.equal(matchesQuery('Pipila', '<img src=x onerror=alert(1)>'), false);
  assert.equal(matchesQuery('Pipila', '.*'), false);
  assert.equal(matchesQuery('Pipila', ''), true);
});

test('shell profiles reject executable URLs and credential-bearing destinations', async () => {
  const { shellChannelsSchema } = await import('../../src/lib/site/schemas.mjs');
  const profile = url => ({email:'example@example.org',profiles:[{key:'profile.github',url}]});
  assert.ok(shellChannelsSchema.safeParse(profile('https://github.com/paynalton')).success);
  for (const url of ['javascript:alert(1)','data:text/html,test','https://user:secret@example.org/','//example.org','https://example.org/\n']) {
    assert.equal(shellChannelsSchema.safeParse(profile(url)).success, false);
  }
});
