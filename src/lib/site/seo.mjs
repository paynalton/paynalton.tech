import {breadcrumbs,pageAlternatives,routeManifest} from './navigation.mjs';
import {createTranslator} from './i18n.mjs';
import {origin,socialImage,entryExportPaths} from './publication.mjs';
export function safeJsonLd(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
export function pageSeo(repository,page,description,prefix=''){
 const settings=repository.getSettings(),{t}=createTranslator(page.locale,repository.getCatalogs(),settings);
 const entry=repository.publicEntries(page.locale).find(e=>e.entityId===page.entityId),canonical=new URL(page.url,origin).href;
 const title=(page.chapterId?page.title:entry?.seo.title)??page.title??t(page.label);
 const summary=description??entry?.seo.description??(page.id==='not-found'?t('error.intro'):t(`seo.${page.id}.description`));
 const alternatives=pageAlternatives(routeManifest(repository,prefix),page,settings).map(a=>({language:a.locale,url:new URL(a.url,origin).href}));
 const graph=[{'@type':'WebSite','@id':origin+'/#website',url:origin+'/'+settings.baseLocale+'/',name:t('brand.name')}];
 const node={'@type':page.id==='about'?'ProfilePage':page.id==='contact'?'ContactPage':['projects','works','terms','experience'].includes(page.id)?'CollectionPage':'WebPage','@id':canonical+'#page',url:canonical,name:title,description:summary,inLanguage:page.locale,isPartOf:{'@id':origin+'/#website'}};
 graph.push(node);
 if(entry){
  const creative=entry.type==='work';
  const entity={'@type':creative?(entry.facts.format==='book'?'Book':'CreativeWork'):entry.type==='term'?'DefinedTerm':'CreativeWork','@id':canonical+'#content',name:page.chapterId?page.title:entry.title,description:summary,url:canonical,inLanguage:page.locale};
  if(creative && entry.facts.author)entity.author=entry.facts.author.split(' y ').map(name=>({'@type':'Person',name}));
  if(creative && entry.facts.licenseUrl)entity.license=entry.facts.licenseUrl;
  node.mainEntity={'@id':entity['@id']};graph.push(entity);
 }
 if(page.id==='about'){
  node.mainEntity={'@id':origin+'/#person'};graph.push({'@type':'Person','@id':origin+'/#person',name:t('brand.name'),url:canonical});
 }
 const trail=breadcrumbs(page,t,prefix);
 if(trail.length)graph.push({'@type':'BreadcrumbList',itemListElement:trail.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.title,item:new URL(b.url,origin).href}))});
 return {formats:entry?entryExportPaths(page.chapterId?{...entry,url:page.url}:entry):null,title:`${title} | ${t('brand.name')}`,description:summary,canonical,alternatives,image:new URL(socialImage,origin).href,imageAlt:t('publication.imageAlt'),type:entry?.type==='work'?'article':'website',jsonLd:safeJsonLd({'@context':'https://schema.org','@graph':graph})};
}
