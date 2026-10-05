export const formsStorageKey='paynalton.forms.v1';
export const formsExpirationMs=24*60*60*1000;
export const initialFormsState=Object.freeze({
 HideForms:false,
 FormsConvertationCounter:0,
 FormsConvertationWorkflow:0,
 FormsConvertationTimeout:0,
});

const valid=(key,value)=>key==='HideForms'?typeof value==='boolean':Number.isSafeInteger(value)&&value>=0;
function normalize(value){
 const result={...initialFormsState};
 if(value&&typeof value==='object'&&!Array.isArray(value)){
  for(const key of Object.keys(result))if(valid(key,value[key]))result[key]=value[key];
 }
 return Object.freeze(result);
}

export function createFormsController(storage,now=Date.now){
 const listeners=new Set();
 const read=()=>{
  try{return normalize(JSON.parse(storage?.getItem(formsStorageKey)??'null'));}
  catch{return initialFormsState;}
 };
 const expired=value=>value.FormsConvertationTimeout>0&&now()-value.FormsConvertationTimeout>=formsExpirationMs;
 let state=read();
 if(expired(state))state=initialFormsState;
 const persist=()=>{try{storage?.setItem(formsStorageKey,JSON.stringify(state));}catch{/* Keep a working session when storage is unavailable. */}};
 const publish=()=>{for(const listener of listeners)listener(state);return state;};
 persist();
 return Object.freeze({
  getState:()=>state,
  setState(patch){
   if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('Expected a forms state object');
   for(const [key,value] of Object.entries(patch)){
    if(!Object.hasOwn(initialFormsState,key)||!valid(key,value))throw new TypeError(`Invalid forms state field: ${key}`);
   }
   state=Object.freeze({...state,...patch});if(expired(state))state=initialFormsState;persist();return publish();
  },
  reset(){state=initialFormsState;persist();return publish();},
  reload(){state=read();if(expired(state)){state=initialFormsState;persist();}return publish();},
  checkExpiration(){if(expired(state)){state=initialFormsState;persist();return publish();}return state;},
  subscribe(listener){listeners.add(listener);listener(state);return()=>listeners.delete(listener);},
 });
}
