import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const files=await readdir('.effects-off-dist/_astro');
assert.ok(!files.some(name=>/^(three-engine|workshop|optional|decorations|particles)\./.test(name)),'Optional modules in static build');
const normal=JSON.parse(await readFile('dist/pagefind/search-manifest.json','utf8'));
const plain=JSON.parse(await readFile('.effects-off-dist/pagefind/search-manifest.json','utf8'));
assert.deepEqual(plain,normal);
let count=0;
async function walk(dir=''){
 for(const item of await readdir('dist/'+dir,{withFileTypes:true})){
  const path=dir+item.name;if(item.isDirectory())await walk(path+'/');else if(path.endsWith('.html')){
   const active=await readFile('dist/'+path,'utf8'),staticHtml=await readFile('.effects-off-dist/'+path,'utf8');
   const content=html=>(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
   assert.equal(content(staticHtml),content(active),'Content differs: '+path);count++;
  }
 }
}
await walk();console.log(`Sin efectos: ${count} páginas con el mismo contenido principal; mismo índice; sin módulos opcionales.`);
