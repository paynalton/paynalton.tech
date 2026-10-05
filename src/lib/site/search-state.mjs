export function searchState(params,types,topics){
 const q=(params.get('q')??'').slice(0,200).trim();
 const type=params.get('type')??'',topic=params.get('topic')??'';
 return {q,type:types.includes(type)?type:'',topic:topics.includes(topic)?topic:'',invalid:!!((type&&!types.includes(type))||(topic&&!topics.includes(topic)))};
}
export function searchUrl(current,state){
 const url=new URL(current);for(const key of ['q','type','topic']){url.searchParams.delete(key);if(state[key])url.searchParams.set(key,state[key]);}url.hash='';return url;
}
/** Result URLs must stay within the current locale and publication root. */
export function safeResultUrl(value,origin,root){
 try{const url=new URL(value,origin);return url.origin===origin && url.pathname.startsWith(root) && !url.pathname.includes('/design-review/',root.length) && !url.username && !url.password && !url.search ? url.pathname+url.hash:null;}catch{return null;}
}
