import {readingKey,readingPreferences} from '../lib/site/reading-preferences.mjs';
const reader=document.querySelector('[data-reader]');
if(reader){
 const controls=reader.querySelector('[data-reader-preferences]'),size=controls.querySelector('#reading-size'),surface=controls.querySelector('#reading-surface'),status=controls.querySelector('[data-reader-status]');
 let storage;try{storage=localStorage;}catch{storage=null;}
 const read=()=>{try{return readingPreferences(JSON.parse(storage?.getItem(readingKey)??'null'));}catch{return readingPreferences(null);}};
 const apply=value=>{size.value=value.size;surface.value=value.surface;reader.dataset.readingSize=value.size;reader.classList.toggle('tn-light',value.surface==='paper');};
 apply(read());controls.hidden=false;
 const save=value=>{apply(value);try{storage.setItem(readingKey,JSON.stringify(value));status.textContent=controls.dataset.saved;}catch{status.textContent=controls.dataset.session;}};
 controls.addEventListener('change',()=>save(readingPreferences({size:size.value,surface:surface.value})));
 controls.querySelector('[data-reader-reset]').addEventListener('click',()=>save(readingPreferences(null)));
 addEventListener('storage',event=>{if(event.key===readingKey || event.key===null){apply(read());status.textContent='';}});
}
