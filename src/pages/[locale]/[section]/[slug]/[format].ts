import type { APIRoute } from 'astro';
import { loadSite } from '../../../../lib/site/build.mjs';
import { projectDocument, projectMarkdown, workDocument, workMarkdown } from '../../../../lib/site/exports.mjs';
import { createTranslator } from '../../../../lib/site/i18n.mjs';
import type { PublicEntry } from '../../../../lib/site/types';
export const prerender = true;
export async function getStaticPaths() {
  const repository = await loadSite();
  return repository.getSettings().locales.filter((l: {enabled:boolean}) => l.enabled).flatMap((l: {code:string}) =>
    (repository.publicEntries(l.code) as PublicEntry[])
      .filter(e => !e.example && (e.type === 'project' || (e.type === 'work' && 'fullText' in e.facts && e.facts.fullText)))
      .flatMap(entry => ['index.json','index.md'].map(format => ({
        params:{locale:entry.locale, section:entry.url.split('/').at(-3), slug:entry.url.split('/').at(-2), format},
        props:{entityId:entry.entityId, entityType:entry.type},
      }))));
}
export const GET: APIRoute = async ({params, props, site}) => {
  const repository = await loadSite();
  const {t} = createTranslator(params.locale, repository.getCatalogs(), repository.getSettings());
  const project = props.entityType === 'project';
  const document = (project ? projectDocument : workDocument)(repository, props.entityId, params.locale, site!.origin);
  const json = params.format === 'index.json';
  return new Response(json ? JSON.stringify(document, null, 2) + '\n' : (project ? projectMarkdown : workMarkdown)(document,t), {
    headers:{'Content-Type':json ? 'application/json; charset=utf-8' : 'text/markdown; charset=utf-8', 'X-Content-Type-Options':'nosniff'},
  });
};
