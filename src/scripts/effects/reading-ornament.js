// Scroll sets the destination; easing lets the copper trace gently catch up.
export function mountReadingOrnament(){
 const host=document.querySelector('[data-reading-ornament]');
 if(!host)return()=>{};
 const section=host.closest('.trajectory-layout'),path=host.querySelector('[data-reading-trace]');
 const wide=matchMedia('(min-width: 1001px)'),listeners=new AbortController();
 let frame=0,previous=0,current=0,target=0,dirty=true,visible=false,initialized=false;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;previous=0;};
 function request(){if(wide.matches&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);}
 function draw(now){
  frame=0;
  if(!wide.matches||!visible||document.hidden)return;
  if(dirty){const box=section.getBoundingClientRect();target=.08+.92*Math.max(0,Math.min(1,(innerHeight*.3-box.top)/Math.max(1,box.height-innerHeight*.4)));dirty=false;}
  const dt=previous?Math.min(now-previous,64):16;previous=now;
  if(!initialized){current=target;initialized=true;}else current+=(target-current)*(1-Math.exp(-dt/420));
  if(Math.abs(target-current)<.0005)current=target;
  path.style.strokeDashoffset=String(1-current);host.dataset.progress=current.toFixed(4);
  if(current!==target)request();else previous=0;
 }
 function changed(){dirty=true;request();}
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)changed();else reset();});observer.observe(section);
 const resize=new ResizeObserver(changed);resize.observe(section);
 addEventListener('scroll',changed,{passive:true,signal:listeners.signal});
 addEventListener('resize',changed,{passive:true,signal:listeners.signal});
 wide.addEventListener('change',()=>{if(wide.matches)changed();else reset();},{signal:listeners.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();else changed();},{signal:listeners.signal});
 path.style.strokeDasharray='1';
 return()=>{reset();listeners.abort();observer.disconnect();resize.disconnect();path.style.removeProperty('stroke-dasharray');path.style.removeProperty('stroke-dashoffset');delete host.dataset.progress;};
}
