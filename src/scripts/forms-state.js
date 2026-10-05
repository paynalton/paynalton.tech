import {createFormsController,formsStorageKey,formsExpirationMs} from '../lib/site/forms-state.mjs';

let storage;
try{storage=window.localStorage;}catch{/* Storage may be blocked by the browser. */}
export const formsController=createFormsController(storage);
const figures=[...document.querySelectorAll('[data-workshop], [data-reading-ornament], .shell-footer-mark, .tn-brand .tn-ornament')];
const initialVisibility=new Map(figures.map(host=>[host,{aria:host.getAttribute('aria-hidden'),inert:host.inert}]));
let lastHide,expirationTimer=0;
function scheduleExpiration(state){
 clearTimeout(expirationTimer);
 if(!state.FormsConvertationTimeout)return;
 const remaining=state.FormsConvertationTimeout+formsExpirationMs-Date.now();
 expirationTimer=setTimeout(()=>{
  formsController.checkExpiration();scheduleExpiration(formsController.getState());
 },Math.max(1,Math.min(remaining,formsExpirationMs)));
}
function applyVisibility(hide){
 document.dispatchEvent(new Event('site:forms-visibility-changing'));
 document.documentElement.dataset.hideForms=String(hide);
 if(hide)document.documentElement.dataset.figuresGone='true';else delete document.documentElement.dataset.figuresGone;
 figures.forEach(host=>{
  delete host.dataset.vortex;
  const initial=initialVisibility.get(host);host.inert=hide||initial.inert;
  if(hide)host.setAttribute('aria-hidden','true');
  else if(initial.aria===null)host.removeAttribute('aria-hidden');else host.setAttribute('aria-hidden',initial.aria);
 });
 document.dispatchEvent(new Event('site:forms-visibility-changed'));
}
window.formsController=formsController;
window.resetForms=()=>{
 const wasHidden=formsController.getState().HideForms;
 const state=formsController.reset();
 if(!wasHidden)applyVisibility(false);
 return state;
};
formsController.subscribe(state=>{
 scheduleExpiration(state);
 if(lastHide!==state.HideForms){lastHide=state.HideForms;applyVisibility(state.HideForms);}
 document.dispatchEvent(new CustomEvent('site:forms-state-change',{detail:state}));
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)formsController.reload();});
addEventListener('focus',()=>formsController.reload());
addEventListener('pageshow',()=>formsController.reload());
addEventListener('pagehide',()=>clearTimeout(expirationTimer));
addEventListener('storage',event=>{
 if(event.storageArea===storage&&(event.key===formsStorageKey||event.key===null))formsController.reload();
});
