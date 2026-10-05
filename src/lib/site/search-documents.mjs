import {createTranslator} from './i18n.mjs';
import {sectionUrl} from './navigation.mjs';
/** This allowlist is shared by HTML, indexing and fallback navigation.
 * @returns {Array<{url:string,locale:string,type:string,title:string,summary:string,topics:string[]}>}
 */
export function searchDocuments(repository,locale,prefix=''){
 const entries=repository.publicEntries(locale).filter(e=>!e.example),terms=new Set(entries.filter(e=>e.type==='term').map(e=>e.entityId));
 const {t}=createTranslator(locale,repository.getCatalogs(),repository.getSettings());
 const topicsFor=e=>[...new Set([...(e.type==='term'?[e.entityId]:[]),...e.relations.filter(r=>terms.has(r.target)).map(r=>r.target)])];
 const documents=entries.filter(e=>['project','work','term'].includes(e.type)).flatMap(e=>[
  {url:e.url,locale,type:e.type,title:e.title,summary:e.summary,topics:topicsFor(e)},
  ...e.chapters.map(c=>({url:c.url,locale,type:'chapter',title:c.title,summary:e.summary,topics:topicsFor(e)})),
 ]);
 const extras=[['about','profile',['resolucion-de-problemas','memoria-y-contexto-de-agentes','inteligencia-y-humanidad','creacion-editorial']],['contact','channel',[]]];
 if(repository.select('experience',locale).length)extras.push(['experience','experience',[...new Set(entries.filter(e=>e.type==='experience').flatMap(topicsFor))]]);
 for(const [page,type,topics] of extras)documents.push({url:sectionUrl(locale,page,prefix),locale,type,title:t(`page.${page}Title`),summary:t(`page.${page}Intro`),topics:topics.filter(id=>terms.has(id))});
 return documents;
}
