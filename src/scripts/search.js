import {searchState,searchUrl,safeResultUrl} from '../lib/site/search-state.mjs';
const page=document.querySelector('[data-search-page]');
if(page && page.dataset.sample!=='true'){
 const form=page.querySelector('form'),input=form.querySelector('input'),type=page.querySelector('#search-type'),topic=page.querySelector('#search-topic');
 const results=page.querySelector('[data-search-results]'),fallback=page.querySelector('[data-search-fallback]'),status=page.querySelector('[data-search-status]'),warning=page.querySelector('[data-search-warning]'),retry=page.querySelector('[data-search-retry]');
 const types=[...type.options].map(o=>o.value),topics=[...topic.options].map(o=>o.value);
 const summaries=new Map([...fallback.querySelectorAll('li')].map(li=>[li.querySelector('a').getAttribute('href'),li.querySelector('p').textContent]));
 const allowed=new Set(summaries.keys());
 const counts=count=>(count===0?page.dataset.empty:count===1?page.dataset.one:page.dataset.other).replaceAll('{count}',String(count));
 let engine,sequence=0;
 const load=()=>engine??=(async()=>{const api=await import(/* @vite-ignore */ page.dataset.bundle);await api.options({excerptLength:35,baseUrl:'/'});return api;})();
 async function update(){
  const turn=++sequence,state=searchState(new URL(location.href).searchParams,types,topics);
  input.value=state.q;type.value=state.type;topic.value=state.topic;
  warning.textContent=state.invalid?page.dataset.invalid:'';
  results.hidden=true;results.replaceChildren();fallback.hidden=false;retry.hidden=true;
  page.setAttribute('aria-busy','true');status.textContent=page.dataset.loading;
  try{
   const api=await load(),filters={};if(state.type)filters.type=state.type;if(state.topic)filters.topic=state.topic;
   const found=await api.search(state.q||null,{filters});
   const data=await Promise.all(found.results.map(result=>result.data()));
   if(turn!==sequence)return;
   const fragment=document.createDocumentFragment();
   for(const entry of data){
    const href=safeResultUrl(entry.url,location.origin,page.dataset.root);
    if(!href || !allowed.has(href))throw new Error('Unexpected search destination');
    const li=document.createElement('li'),heading=document.createElement('h2'),a=document.createElement('a'),excerpt=document.createElement('p');
    li.dataset.searchItem='';a.href=href;a.textContent=entry.meta.title;heading.append(a);
    // Decode entities as inert text. No search result or query becomes HTML.
    const decoder=document.createElement('textarea');decoder.innerHTML=(entry.plain_excerpt??'').replaceAll('<','&lt;').replaceAll('>','&gt;');excerpt.textContent=state.q?decoder.value:summaries.get(href);
    li.append(heading,excerpt);fragment.append(li);
   }
   results.replaceChildren(fragment);fallback.hidden=true;results.hidden=false;status.textContent=counts(data.length);
  }catch{if(turn!==sequence)return;engine=undefined;results.hidden=true;fallback.hidden=false;retry.hidden=false;status.textContent=page.dataset.error;}
  finally{if(turn===sequence)page.setAttribute('aria-busy','false');}
 }
 const navigate=()=>{const params=new URLSearchParams({q:input.value,type:type.value,topic:topic.value});const state=searchState(params,types,topics);history.pushState(null,'',searchUrl(location.href,state));update();};
 form.addEventListener('submit',event=>{event.preventDefault();navigate();});
 type.addEventListener('change',navigate);topic.addEventListener('change',navigate);
 const clear=page.querySelector('[data-search-clear]');clear.hidden=false;clear.addEventListener('click',()=>{input.value='';type.value='';topic.value='';navigate();input.focus();});
 // A full reload also resets any failed module/WASM fetch cached by the browser runtime.
 retry.addEventListener('click',()=>location.reload());
 page.querySelector('[data-search-filters]').hidden=false;
 addEventListener('popstate',update);update();
}
