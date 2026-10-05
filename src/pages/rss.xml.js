import rss from '@astrojs/rss';
import {loadSite} from '../lib/site/build.mjs';
import {createTranslator} from '../lib/site/i18n.mjs';
import {origin,stableSort} from '../lib/site/publication.mjs';
export async function GET(){
 const repo=await loadSite(),settings=repo.getSettings(),{t}=createTranslator(settings.baseLocale,repo.getCatalogs(),settings);
 const entries=settings.locales.filter(l=>l.enabled).flatMap(l=>repo.publicEntries(l.code).filter(e=>e.type==='work' && !e.example));
 return rss({title:t('brand.name'),description:t('publication.description'),site:origin,customData:`<language>${settings.baseLocale}</language>`,items:stableSort(entries).map(e=>({title:e.title,description:`${e.facts.author??''} — ${e.summary}`,link:e.url}))});
}
