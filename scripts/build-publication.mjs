import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {loadRepository} from '../src/lib/site/repository.mjs';
import {publicDocuments,llmsText,redirectText,robotsText,origin} from '../src/lib/site/publication.mjs';
export async function buildPublication(directory){
 const repo=await loadRepository(),docs=publicDocuments(repo);
 for(const d of docs)for(const [format,url] of Object.entries(d.paths)){
  const file=path.join(directory,url);await mkdir(path.dirname(file),{recursive:true});
  await writeFile(file,format==='json'?JSON.stringify(d.document,null,2)+'\n':d.markdown);
 }
 await writeFile(path.join(directory,'catalog.json'),JSON.stringify({schemaVersion:1,documents:docs.map(d=>({id:d.id,language:d.language,type:d.type,title:d.title,canonical:new URL(d.url,origin).href,formats:{markdown:new URL(d.paths.markdown,origin).href,json:new URL(d.paths.json,origin).href}}))},null,2)+'\n');
 await writeFile(path.join(directory,'llms.txt'),llmsText(repo,docs));
 await writeFile(path.join(directory,'robots.txt'),robotsText(process.env.DESIGN_REVIEW==='1'));
 await writeFile(path.join(directory,'_redirects'),redirectText());
 console.log(`Publicación: ${docs.length} contenidos, ${docs.length*2} exportaciones, catálogo, llms.txt, robots y migración Netlify.`);
}
