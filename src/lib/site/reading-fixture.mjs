import { readSource, createRepository, defaultRoot } from './repository.mjs';
export const readingPrefix='/design-review/reading';
export async function loadReading(root=defaultRoot){
 if(process.env.DESIGN_REVIEW!=='1')throw new Error('Reading fixtures require review build');
 const raw=await readSource(root),id='ejemplo-lectura';
 raw.entities=raw.entities.filter(e=>e.id===id);
 for(const group of Object.keys(raw.selection))raw.selection[group]=raw.selection[group].filter(key=>key===id);
 raw.selection.works=[id];raw.selection.featuredWorks=[id];
 raw.editorial.es={[id]:raw.editorial.es[id]};raw.editorial.en={};raw.editorial.nah={};
 raw.settings.locales.find(l=>l.code==='en').enabled=true;
 raw.settings.locales.find(l=>l.code==='en').dir='rtl';
 const expand=s=>`PT08-SYNTHETIC ⟦${s} — ${s}⟧`;
 raw.ui.en=Object.fromEntries(Object.entries(raw.ui.es).map(([k,v])=>[k,typeof v==='string'?expand(v):Object.fromEntries(Object.entries(v).map(([f,t])=>[f,expand(t)]))]));
 const variant=structuredClone(raw.editorial.es[id]);
 variant.slug='translated-reading';variant.title=expand(variant.title);variant.summary=expand(variant.summary);variant.bodyRef='en/reading.md';
 raw.bodies[variant.bodyRef]=expand(raw.bodies[raw.editorial.es[id].bodyRef]);
 // The second chapter deliberately has no translation: never link a false equivalent.
 variant.chapters=variant.chapters.slice(0,1).map(c=>{const ref='en/'+c.id+'.md';raw.bodies[ref]=raw.bodies[c.bodyRef].replace('[segundo capítulo](../segunda-parte/)','capítulo sin traducción');return {...c,title:expand(c.title),slug:'translated-chapter',bodyRef:ref};});
 raw.editorial.en[id]=variant;
 const repo=createRepository(raw);
 const relocate=e=>({...e,url:readingPrefix+e.url,relations:e.relations.map(r=>({...r,url:readingPrefix+r.url})),chapters:e.chapters.map(c=>({...c,url:readingPrefix+c.url}))});
 return {...repo,publicEntries:locale=>repo.previewEntries(locale).map(relocate),select:(group,locale)=>repo.select(group,locale,{preview:true}).map(relocate)};
}
