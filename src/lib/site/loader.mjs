import path from 'node:path';
import { loadReading } from './reading-fixture.mjs';
import { loadJourney } from './journey-fixture.mjs';
import { defaultRoot, loadRepository } from './repository.mjs';

/** One validated publication source for future HTML, search and exports. */
export function siteContentLoader({ preview = false, journey = false, reading = false, chapters = false } = {}) {
  return {
    name: chapters ? (reading ? 'reading-chapters':'public-chapters') : reading ? 'reading-fixtures' : journey ? 'paynalton-journey-content' : preview ? 'paynalton-design-content' : 'paynalton-public-content',
    async load(context) {
      async function refresh() {
        if ((preview || journey || reading) && process.env.DESIGN_REVIEW !== '1') { context.store.clear(); return; }
        const repository = reading ? await loadReading() : journey ? await loadJourney() : await loadRepository();
        let entries = repository.getSettings().locales.filter(l => l.enabled)
          .flatMap(l => preview ? repository.previewEntries(l.code).filter(e => e.example).map(e => ({ ...e, body: [e.body, ...e.chapters.map(c => `## ${c.title}\n\n${c.body}`)].join('\n\n') })) : repository.publicEntries(l.code));
        if(chapters) entries=entries.flatMap(e=>e.chapters.map(c=>({id:`${e.locale}:${e.entityId}:${c.id}`,entityId:e.entityId,locale:e.locale,chapterId:c.id,url:c.url,title:c.title,body:c.body})));
        const prepared = await Promise.all(entries.map(async entry => ({
          id: entry.id,
          data: await context.parseData({ id: entry.id, data: chapters ? Object.fromEntries(Object.entries(entry).filter(([key])=>key!=='id')) : entry }),
          body: entry.body,
          rendered: await context.renderMarkdown(entry.body),
          digest: context.generateDigest(entry),
        })));
        context.store.clear();
        for (const entry of prepared) context.store.set(entry);
      }
      await refresh();
      if (context.watcher) {
        let queue = Promise.resolve();
        context.watcher.add(defaultRoot);
        context.watcher.on('all', (event, file) => {
          if (!['add', 'change', 'unlink'].includes(event) || !path.resolve(file).startsWith(defaultRoot + path.sep)) return;
          queue = queue.then(refresh).catch(error => context.logger.error(error.message));
          return queue;
        });
      }
    },
  };
}
