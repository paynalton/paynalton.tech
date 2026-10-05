import { loadRepository } from '../../src/lib/site/repository.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { siteContentLoader } from '../../src/lib/site/loader.mjs';

test('implemented colors preserve the 42 approved RGBA tokens', async () => {
  const tokens = text => Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*(rgba\([^)]*\))/g)].map(m => [m[1], m[2]]));
  const approved = tokens(await readFile('ai_reference/propuesta_grafica_layouts/paleta-colores.css', 'utf8'));
  assert.equal(Object.keys(approved).length, 42);
  assert.deepEqual(tokens(await readFile('src/styles/taller/tokens.css', 'utf8')), approved);
});

test('review content is opt-in and clears cached examples when returning to production', async () => {
  const previous = process.env.DESIGN_REVIEW;
  const stored = new Map();
  const context = {
    store: { clear: () => stored.clear(), set: entry => stored.set(entry.id, entry) },
    parseData: async ({ data }) => data,
    renderMarkdown: async () => ({ html: '', metadata: {} }),
    generateDigest: () => 'test',
  };
  try {
    process.env.DESIGN_REVIEW = '1';
    await siteContentLoader({ preview: true }).load(context);
    assert.ok(stored.size > 0);
    for (const entry of stored.values()) {
      assert.equal(entry.data.example, true);
      assert.match(entry.body, /## /);
    }
    delete process.env.DESIGN_REVIEW;
    await siteContentLoader({ preview: true }).load(context);
    assert.equal(stored.size, 0);
    await siteContentLoader().load(context);
    assert.equal(stored.size, (await loadRepository()).publicEntries().length);
    assert.ok([...stored.values()].every(entry => !entry.data.example));
  } finally {
    if (previous === undefined) delete process.env.DESIGN_REVIEW;
    else process.env.DESIGN_REVIEW = previous;
  }
});
