let openSpeech=()=>{},hideSpeech=()=>{};
export const showSceneSpeech=options=>openSpeech(options);
export const closeSceneSpeech=()=>hideSpeech();
const bubble=document.querySelector('#scene-speech');
if(bubble && typeof bubble.showPopover==='function'){
 let trigger,openedX=0,openedY=0,openedWidth=0,openedHeight=0;
 let autoClose=0,closeFallback=0,closingAnimation;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finishClose=()=>{
  clearTimeout(autoClose);clearTimeout(closeFallback);
  const previous=closingAnimation;closingAnimation=undefined;previous?.cancel();
  if(bubble.contains(document.activeElement))trigger?.focus({preventScroll:true});
  bubble.hidePopover();trigger?.setAttribute('aria-expanded','false');trigger=undefined;
  delete bubble.dataset.closing;
 };
 const close=()=>{
  if(!trigger||closingAnimation)return;
  clearTimeout(autoClose);
  if(reduced.matches||document.documentElement.dataset.effects==='off'){finishClose();return;}
  bubble.dataset.closing='true';
  const animation=bubble.animate([{opacity:getComputedStyle(bubble).opacity},{opacity:0}],{
   delay:250,duration:700,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'
  });
  closingAnimation=animation;
  animation.finished.then(()=>{if(closingAnimation===animation)finishClose();},()=>{});
  closeFallback=setTimeout(finishClose,1100);
 };
 hideSpeech=finishClose;
 openSpeech=({button,event,message,choices=[]})=>{
   finishClose();trigger=button;button.setAttribute('aria-expanded','true');
   bubble.querySelector('p').textContent=message;
   const actions=bubble.querySelector('.scene-speech-choices');actions.replaceChildren();actions.hidden=!choices.length;
   for(const choice of choices){
    const action=document.createElement('button');action.type='button';action.textContent=choice.label;
    action.addEventListener('click',()=>{finishClose();choice.run();},{once:true});actions.append(action);
   }
   bubble.showPopover();
   if(!choices.length)autoClose=setTimeout(close,5000);
   openedX=scrollX;openedY=scrollY;openedWidth=innerWidth;openedHeight=innerHeight;
   const box=button.getBoundingClientRect();
   const x=event.detail?event.clientX:box.x+box.width/2;
   const y=event.detail?event.clientY:Math.max(20,box.y+Math.min(box.height/2,100));
   const bounds={width:bubble.offsetWidth,height:bubble.offsetHeight},gap=18,margin=12;
   const left=Math.max(margin,Math.min(x-bounds.width/2,innerWidth-bounds.width-margin));
   const above=y-bounds.height-gap>=margin;
   const top=Math.max(margin,Math.min(above?y-bounds.height-gap:y+gap,innerHeight-bounds.height-margin));
   bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;
   bubble.style.setProperty('--speech-tip',`${Math.max(18,Math.min(x-left,bounds.width-18))}px`);
   bubble.dataset.side=above?'above':'below';
   if(!event.detail)bubble.querySelector(choices.length?'.scene-speech-choices button':'[data-speech-close]').focus({preventScroll:true});
 };
 // Reserved hello-world preview, kept for isolated visual regression checks.
 document.addEventListener('site:enable-scene-speech',()=>{
  document.documentElement.dataset.sceneSpeechEnabled='true';
  const message=bubble.querySelector('p').textContent;
  document.querySelectorAll('[data-workshop], [data-reading-ornament], .shell-footer-mark').forEach(host=>{
   host.removeAttribute('aria-hidden');host.classList.add('scene-speaker');
   const button=document.createElement('button');button.type='button';button.className='scene-speech-trigger';
   button.setAttribute('aria-label',bubble.dataset.triggerLabel);button.setAttribute('aria-controls',bubble.id);button.setAttribute('aria-expanded','false');
   host.append(button);button.addEventListener('click',event=>openSpeech({button,event,message}));
  });
 },{once:true});
 bubble.querySelector('[data-speech-close]').addEventListener('click',close);
 document.addEventListener('click',event=>{if(!bubble.contains(event.target)&&!event.target.closest('.scene-speech-trigger'))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
 // Ignore queued events from the scroll/focus that brought the figure into view.
 addEventListener('scroll',()=>{if(scrollX!==openedX||scrollY!==openedY)close();},{passive:true});
 addEventListener('resize',()=>{if(innerWidth!==openedWidth||innerHeight!==openedHeight)close();},{passive:true});
 reduced.addEventListener('change',()=>{if(reduced.matches&&closingAnimation)finishClose();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finishClose();});
 document.addEventListener('site:forms-visibility-changing',finishClose);
 addEventListener('pagehide',finishClose);
}
