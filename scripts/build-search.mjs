import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import * as pagefind from 'pagefind';
import {loadRepository} from '../src/lib/site/repository.mjs';
import {loadJourney,journeyPrefix} from '../src/lib/site/journey-fixture.mjs';
import {searchDocuments} from '../src/lib/site/search-documents.mjs';
async function buildIndex(directory,repository,prefix=''){
 const docs=repository.getSettings().locales.filter(l=>l.enabled).flatMap(l=>searchDocuments(repository,l.code,prefix));
 const {index,errors}=await pagefind.createIndex({writePlayground:false,excludeSelectors:['[data-pagefind-ignore]','button','summary']});
 if(errors?.length || !index)throw new Error('Pagefind initialization failed: '+errors?.join(';'));
 try{
  for(const doc of docs){
   const html=await readFile(path.join(directory,doc.url,'index.html'),'utf8');
   if(!html.includes('data-pagefind-body'))throw new Error('Missing indexed body: '+doc.url);
   const result=await index.addHTMLFile({url:doc.url,content:html});
   if(result.errors?.length || !result.file)throw new Error('Pagefind rejected '+doc.url+': '+result.errors?.join(';'));
  }
  const outputPath=path.join(directory,prefix,'pagefind');await mkdir(outputPath,{recursive:true});
  const result=await index.writeFiles({outputPath});if(result.errors?.length)throw new Error(result.errors.join(';'));
  await writeFile(path.join(outputPath,'search-manifest.json'),JSON.stringify({version:1,documents:docs},null,2)+'\n');
  console.log(`Pagefind: ${docs.length} documentos en ${prefix||'/'}; idiomas y filtros desde contenido público.`);
 }finally{await index.deleteIndex();}
}
export async function buildSearch(directory){
 try{
  await buildIndex(directory,await loadRepository(path.resolve('src/data/site')));
  if(process.env.DESIGN_REVIEW==='1')await buildIndex(directory,await loadJourney(path.resolve('src/data/site')),journeyPrefix);
 }finally{await pagefind.close();}
}
