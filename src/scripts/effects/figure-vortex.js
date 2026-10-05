import {formsController} from '../forms-state.js';
import {showSceneSpeech,closeSceneSpeech} from '../scene-speech.js';
export function mountFigureVortex(){
 if(document.documentElement.dataset.figuresGone==='true'||document.documentElement.dataset.sceneSpeechEnabled==='true')return()=>{};
 const hosts=[...document.querySelectorAll('[data-workshop], [data-reading-ornament], .shell-footer-mark')];
 const logo=document.querySelector('.tn-brand .tn-ornament');
 const figures=logo?[...hosts,logo]:hosts;
 const listeners=new AbortController(),buttons=[],animations=[];
 const original=new Map(figures.map(host=>[host,{aria:host.getAttribute('aria-hidden'),inert:host.inert}]));
 let running=false,finished=false,timer=0;
 function finish(){
  clearTimeout(timer);finished=true;
  document.documentElement.dataset.figuresGone='true';
  figures.forEach(host=>{host.dataset.vortex='gone';host.inert=true;host.setAttribute('aria-hidden','true');host.getAnimations({subtree:true}).forEach(animation=>animation.cancel());});
  animations.forEach(animation=>animation.cancel());animations.length=0;
  document.dispatchEvent(new Event('site:figures-hidden'));
  formsController.setState({HideForms:true,FormsConvertationTimeout:Date.now()});
 }
 function start(){
  if(running||finished||formsController.getState().HideForms)return;
  running=true;
  buttons.forEach(button=>button.disabled=true);
  if(buttons.includes(document.activeElement))document.querySelector('#main')?.focus({preventScroll:true});
  figures.forEach((host,index)=>{
   host.dataset.vortex='running';
   const direction=index%2?-1:1;
   const frames=Array.from({length:25},(_,i)=>{
    const p=i/24,angle=p*p*Math.PI*12*direction,radius=24*Math.sin(Math.PI*p)*(1-p);
    return {offset:p,rotate:`${angle}rad`,scale:String(Math.pow(1-p,1.35)),translate:`${Math.cos(angle)*radius}px ${Math.sin(angle)*radius}px`,opacity:p<.8?1:(1-p)/.2};
   });
   animations.push(host.animate(frames,{duration:1500,easing:'linear',fill:'forwards'}));
  });
  timer=setTimeout(finish,1500);
 }
 const bubble=document.querySelector('#scene-speech');
 const messages=JSON.parse(bubble.dataset.conversation);
 function converse(event){
  if(running||finished||formsController.getState().HideForms)return;
  closeSceneSpeech();
  const state=formsController.getState(),counter=Math.min(Number.MAX_SAFE_INTEGER,state.FormsConvertationCounter+1);
  formsController.setState({FormsConvertationCounter:counter});
  // Workflow 1 continues the shared final escalation after declining the offer.
  if(state.FormsConvertationWorkflow!==0&&state.FormsConvertationWorkflow!==1)return;
  if(counter>=20){start();return;}
  if(state.FormsConvertationWorkflow===1&&counter<17)return;
  if(!messages[counter])return;
  const choices=counter===16?[
   {label:bubble.dataset.yes,run:()=>document.dispatchEvent(new Event('site:fireworks'))},
   {label:bubble.dataset.no,run:()=>formsController.setState({FormsConvertationWorkflow:1})},
  ]:[];
  showSceneSpeech({button:event.currentTarget,event,message:messages[counter],choices});
 }
 hosts.forEach(host=>{
  host.removeAttribute('aria-hidden');host.classList.add('scene-speaker');
  const button=document.createElement('button');button.type='button';button.className='scene-speech-trigger';
  button.setAttribute('aria-label',document.body.dataset.vortexLabel);button.dataset.vortexTrigger='';
  button.setAttribute('aria-controls','scene-speech');button.setAttribute('aria-expanded','false');
  host.append(button);buttons.push(button);button.addEventListener('click',converse,{signal:listeners.signal});
 });
 function cleanup(){
  clearTimeout(timer);listeners.abort();animations.forEach(animation=>animation.cancel());buttons.forEach(button=>button.remove());
  if(!finished)figures.forEach(host=>{
   delete host.dataset.vortex;const before=original.get(host);host.inert=before.inert;
   if(before.aria===null)host.removeAttribute('aria-hidden');else host.setAttribute('aria-hidden',before.aria);
  });
 }
 document.addEventListener('site:enable-scene-speech',cleanup,{signal:listeners.signal});
 return cleanup;
}
