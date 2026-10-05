// One bounded decorative emitter, only for fine-pointer hover in full-effects mode.
export function mountParticles(){
 const pointer=matchMedia('(hover: hover) and (pointer: fine)');
 const listeners=new AbortController();let layer,animations=[],card;
 function stop(){animations.forEach(animation=>animation.cancel());animations=[];layer?.remove();layer=null;card=null;}
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.target===card&&!entry.isIntersecting))stop();});
 function start(target){
  if(!pointer.matches||document.hidden||target===card)return;
  stop();card=target;layer=document.createElement('span');layer.className='project-particles';layer.setAttribute('aria-hidden','true');
  for(let i=0;i<24;i++){
   const mote=document.createElement('i'),side=i%4,t=(Math.floor(i/4)+.5)/6;
   mote.style.left=`${side===0?0:side===1?100:t*100}%`;
   mote.style.top=`${side===2?0:side===3?100:t*100}%`;
   const size=8+(i%3)*3;mote.style.width=mote.style.height=`${size}px`;layer.append(mote);
   const dx=(side===0?-1:side===1?1:Math.sin(i)*.5)*(12+i%5*3),dy=(side===2?-1:side===3?1:-.35)*(14+i%4*4);
   animations.push(mote.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:0},{offset:.3,opacity:.85},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.1)`,opacity:0}],{duration:1800+i%5*180,delay:-(i*173),iterations:Infinity,easing:'ease-out'}));
  }
  target.append(layer);
 }
 for(const target of document.querySelectorAll('.tn-card')){
  target.addEventListener('pointerenter',()=>start(target),{signal:listeners.signal});
  target.addEventListener('pointerleave',()=>{if(card===target)stop();},{signal:listeners.signal});observer.observe(target);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:listeners.signal});
 pointer.addEventListener('change',()=>{if(!pointer.matches)stop();},{signal:listeners.signal});
 return()=>{stop();observer.disconnect();listeners.abort();};
}

export function mountFooterParticles(){
 const target=document.querySelector('[data-footer-particles]');
 if(!target)return()=>{};
 const listeners=new AbortController();let animations=[];
 function stop(){animations.forEach(animation=>animation.cancel());animations=[];target.replaceChildren();}
 function start(){
  stop();
  for(let i=0;i<36;i++){
   const star=document.createElement('i');const angle=(i/36)*Math.PI*2;const distance=140+(i%6)*34;
   const dx=Math.cos(angle)*distance,dy=Math.sin(angle)*distance*.42;
   star.style.setProperty('--star-size',`${1+(i%3)}px`);target.append(star);
   animations.push(star.animate([
    {transform:'translate(-50%,-50%) scale(.2)',opacity:0},
    {transform:'translate(-50%,-50%) scale(1)',opacity:.9,offset:.22},
    {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scaleX(5)`,opacity:0}
   ],{duration:2600+(i%7)*260,delay:-(i*137),iterations:Infinity,easing:'linear'}));
  }
 }
 const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting)start();else stop();},{threshold:.12});
 observer.observe(target);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:listeners.signal});
 return()=>{stop();observer.disconnect();listeners.abort();};
}

// SVG coordinates keep a small, fixed cloud aligned with the vertical motif.
export function mountReadingParticles(){
 const host=document.querySelector('[data-reading-ornament]');
 if(!host)return()=>{};
 const svg=host.querySelector('svg'),path=host.querySelector('[data-reading-trace]');
 const wide=matchMedia('(min-width: 1001px)'),listeners=new AbortController();
 const ns='http://www.w3.org/2000/svg';let visible=false,layer,animations=[];
 function stop(){animations.forEach(animation=>animation.cancel());animations=[];layer?.remove();layer=null;}
 function sync(){
  if(!visible||!wide.matches||document.hidden){stop();return;}
  if(layer)return;
  layer=document.createElementNS(ns,'g');layer.setAttribute('data-reading-particles','');layer.setAttribute('stroke','none');
  const length=path.getTotalLength();
  for(let i=0;i<24;i++){
   const point=path.getPointAtLength(length*(i+.5)/24),mote=document.createElementNS(ns,'g');
   for(const [radius,fill,opacity] of [[5,'#c78d65',.16],[1.8,'#ffe1a0',.95]]){
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',String(point.x+(i%3-1)*8));dot.setAttribute('cy',String(point.y));dot.setAttribute('r',String(radius));dot.setAttribute('fill',String(fill));dot.setAttribute('opacity',String(opacity));mote.append(dot);
   }
   layer.append(mote);
   animations.push(mote.animate([{transform:'translate(0px,10px)',opacity:0},{offset:.35,opacity:.8},{transform:`translate(${(i%2?1:-1)*(10+i%5*3)}px,-32px)`,opacity:0}],{duration:4200+i%6*420,delay:-i*347,iterations:Infinity,easing:'ease-in-out'}));
  }
  svg.append(layer);
 }
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.1;sync();},{threshold:[0,.1]});observer.observe(host);
 wide.addEventListener('change',sync,{signal:listeners.signal});
 document.addEventListener('visibilitychange',sync,{signal:listeners.signal});
 return()=>{stop();observer.disconnect();listeners.abort();};
}
