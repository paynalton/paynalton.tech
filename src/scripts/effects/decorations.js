import {mountReadingOrnament} from './reading-ornament.js';
// Effects only: functional modules and readable HTML never depend on these observers.
export function mountDecorations(policy){
 const removeReadingOrnament=mountReadingOrnament();
 const animations=new Set(),seen=new WeakSet(),listeners=new AbortController();
 const accent=[{boxShadow:'0 1px 0 rgba(199,141,101,.55)'},{boxShadow:'0 1px 0 rgba(199,141,101,0)'}];
 const play=(element,keyframes,duration,easing='cubic-bezier(.16, 1, .3, 1)')=>{
  if(!element || typeof element.animate!=='function')return;
  // Replace previous decoration on this element, never cancel functional browser behavior.
  for(const item of animations)if(item.effect?.target===element){item.cancel();animations.delete(item);}
  const animation=element.animate(keyframes,{duration,easing});animations.add(animation);animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));return animation;
 };
 const brand=document.querySelector('.shell-header .tn-brand');
 const drawBrand=()=>{
  const path=brand?.querySelector('.tn-ornament--mark path');if(!path)return;
  const length=path.getTotalLength();
    play(path,[{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],72000);
    if(policy.level==='full')play(brand.querySelector('svg'),[{transform:'rotate(-10deg) scale(.94)'},{transform:'rotate(0deg) scale(1)'}],57000);
 };
 drawBrand();
 const dialog=document.querySelector('#search-panel');
 const closeDialog=event=>{
  if(typeof dialog?.animate!=='function')return;
  event.preventDefault();dialog.dataset.closing='true';
  const animation=play(dialog,policy.level==='full'?
   [{opacity:1,transform:getComputedStyle(dialog).transform},{opacity:0,transform:'translateY(-10px) scale(.985)'}]:
   [{opacity:1},{opacity:0}],805,'cubic-bezier(.4, 0, .2, 1)');
  // Canceling effects (including a live reduced-motion change) must also release the modal.
  animation.finished.then(event.detail.finish,event.detail.finish);
 };
 dialog?.addEventListener('site:dialog-close',closeDialog,{signal:listeners.signal});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&!seen.has(entry.target)){
  seen.add(entry.target);observer.unobserve(entry.target);
  play(entry.target,policy.level==='full'?[{transform:'translateY(8px)'},{transform:'none'}]:accent,650);
 }},{threshold:.12});
 // Never animate the initial headline, the reading body, notes or each paragraph.
 for(const group of document.querySelectorAll('.tn-hero ~ .tn-section, .professional-projects, .about-content > section'))observer.observe(group);
 const rules=document.querySelectorAll('.tn-ornament--rule path');
 const grecas=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){
  grecas.unobserve(entry.target);const length=entry.target.getTotalLength();
  play(entry.target,[{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],140000);
 }});rules.forEach(rule=>grecas.observe(rule));
 const timeline=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('fx-current',entry.isIntersecting);},{rootMargin:'-20% 0px -55% 0px'});
 document.querySelectorAll('[data-experience]').forEach(stage=>timeline.observe(stage));
 const changes=new MutationObserver(records=>{for(const record of records){
  const target=record.target;
  if(target.matches?.('#search-panel[open],#site-navigation:not([hidden])'))play(target,policy.level==='full'?[{transform:'translateY(-14px)'},{transform:'none'}]:accent,560);
  if(target.matches?.('[data-search-results]')&&!target.hidden)play(target,accent,420);
  if(target.matches?.('[data-contact-status]')&&target.textContent)play(target,accent,320);
 }});
 for(const element of document.querySelectorAll('#search-panel,#site-navigation,[data-search-results],[data-contact-status]'))changes.observe(element,{attributes:true,attributeFilter:['open','hidden'],childList:true});
 const selection=event=>{if(event.target.matches('#search-type,#search-topic'))play(event.target,[{outlineOffset:'0px'},{outlineOffset:'4px'}],150);};
 document.addEventListener('change',selection,{signal:listeners.signal});
 document.documentElement.classList.add('fx-decorations');
 return ()=>{removeReadingOrnament();listeners.abort();observer.disconnect();grecas.disconnect();timeline.disconnect();changes.disconnect();animations.forEach(a=>a.cancel());animations.clear();document.documentElement.classList.remove('fx-decorations');document.querySelectorAll('.fx-current').forEach(el=>el.classList.remove('fx-current'));};
}
