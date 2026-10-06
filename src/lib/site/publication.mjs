import {routeManifest} from './navigation.mjs';
import {createTranslator} from './i18n.mjs';
import {canonicalUrl,exportPaths,projectDocument,projectMarkdown,workDocument,workMarkdown} from './exports.mjs';
export const origin='https://paynalton.tech';
export const socialImage='/taller/publication/social-es.png';
export const migrations=[
 {from:'/',to:'/es/'},
 {from:'/es/projects/',to:'/es/proyectos/'},
 {from:'/es/jobs/',to:'/es/sobre-mi/#forma-de-trabajar'},
 {from:'/es/about/',to:'/es/sobre-mi/'},
 {from:'/es/ideas/',to:'/es/obra/'},
 {from:'/es/contact/',to:'/es/contacto/'},
 {from:'/en/jobs/',to:'/en/about/#forma-de-trabajar'},
 {from:'/en/ideas/',to:'/en/works/'},
];
export const legacyPaths=['nah'].flatMap(locale=>['','about','jobs','projects','ideas','contact'].map(segment=>`/${locale}/${segment?segment+'/':''}`));
export const stableSort=rows=>[...rows].sort((a,b)=>a.url<b.url?-1:a.url>b.url?1:0);
export function canonicalPages(repo){const current=routeManifest(repo),known=new Set(current.map(p=>p.url));return stableSort([...current,...legacyPaths.filter(url=>!known.has(url)).map(url=>({url,locale:url.split('/')[1],legacy:true}))]);}
export function entryExportPaths(entry){return entry.url.includes('#') ? {json:entry.url.split('#')[0]+entry.entityId+'.json',markdown:entry.url.split('#')[0]+entry.entityId+'.md'} : exportPaths(entry.url);}
export const escapeMarkdown=value=>String(value).replace(/([\\`*_[\]<>#])/g,'\\$1').replace(/[\r\n]+/g,' ');
export function publicDocuments(repo){
 return repo.getSettings().locales.filter(l=>l.enabled).flatMap(l=>{
  const {t}=createTranslator(l.code,repo.getCatalogs(),repo.getSettings());
  return stableSort(repo.publicEntries(l.code).filter(e=>!e.example)).flatMap(e=>{
   let document,markdown;
   if(e.type==='project'){document=projectDocument(repo,e.entityId,l.code,origin);markdown=projectMarkdown(document,t);}
   else if(e.type==='work' && e.facts.fullText){document=workDocument(repo,e.entityId,l.code,origin);markdown=workMarkdown(document,t);}
   else {
    document={schemaVersion:1,id:e.entityId,language:e.locale,type:e.type,canonical:canonicalUrl(e.url,origin),title:e.title,summary:e.summary,facts:e.facts,body:e.body,relations:e.relations.map(r=>({kind:r.kind,id:r.target,url:canonicalUrl(r.url,origin)}))};
    markdown=[`# ${escapeMarkdown(e.title)}`,'',`${t('export.canonical')}: <${document.canonical}>`,`${t('export.language')}: ${e.locale}`,'',escapeMarkdown(e.summary),'',...('author' in e.facts && e.facts.author?[`${t('work.author')}: ${escapeMarkdown(e.facts.author)}`,'']:[]),e.body.trim(),'',...('editions' in e.facts?e.facts.editions.map(d=>`- [${escapeMarkdown(d.label)} · ${d.format.toUpperCase()}](${new URL(d.url,origin).href})`):[])].join('\n');
   }
   return [{id:e.entityId,language:l.code,type:e.type,title:e.title,url:e.url,paths:entryExportPaths(e),document,markdown},...e.chapters.map(c=>({id:e.entityId+':'+c.id,language:l.code,type:'chapter',title:c.title,url:c.url,paths:exportPaths(c.url),document:{schemaVersion:1,id:e.entityId+':'+c.id,workId:e.entityId,language:l.code,canonical:canonicalUrl(c.url,origin),title:c.title,author:e.facts.author,body:c.body},markdown:[`# ${escapeMarkdown(c.title)}`,'',`${t('work.author')}: ${escapeMarkdown(e.facts.author)}`,`${t('export.canonical')}: <${canonicalUrl(c.url,origin)}>`,`${t('export.language')}: ${l.code}`,'',c.body.trim(),''].join('\n')}))];
  });
 });
}
export function llmsText(repo,documents){
 const {t}=createTranslator(repo.getSettings().baseLocale,repo.getCatalogs(),repo.getSettings());
 return [`# ${t('brand.name')}`,'',`> ${t('publication.description')}`,'',t('publication.indexHelp'),'','[JSON](https://paynalton.tech/catalog.json) · [RSS](https://paynalton.tech/rss.xml)','',...repo.getSettings().locales.filter(l=>l.enabled).flatMap(l=>[`## ${l.label}`,'',...documents.filter(d=>d.language===l.code).map(d=>`- [${escapeMarkdown(d.title)}](${new URL(d.paths.markdown,origin).href}): ${d.type}; ${new URL(d.url,origin).href}`),''])].join('\n');
}
export function redirectText(){return '# Generated from src/lib/site/publication.mjs\n'+migrations.flatMap(r=>[r.from,...(r.from==='/'?[]:[r.from.slice(0,-1)])].map(from=>`${from} ${r.to} 301!`)).join('\n')+'\n';}
export function robotsText(review=false){return review?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /design-review/\nSitemap: ${origin}/sitemap-index.xml\n`;}
