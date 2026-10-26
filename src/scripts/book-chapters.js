for (const scroller of document.querySelectorAll('[data-chapter-scroll]')) {
 const root=scroller.closest('.book-editorial');
 const panel=scroller.closest('.book-chapter-panel');
 const toggle=document.createElement('button');
 toggle.type='button';toggle.className='book-chapter-toggle';toggle.hidden=true;
 panel.insertBefore(toggle,scroller);
 const desktop=matchMedia('(min-width:1025px)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let paused=false,hover=false,focused=false,visible=false,frame=0,last=0,position=scroller.scrollTop,direction=1,holdUntil=0;
 function eligible(){return desktop.matches&&!reduced.matches&&!paused&&!hover&&!focused&&visible&&!document.hidden;}
 function tick(now){
  frame=0;if(!eligible())return;
  const elapsed=last?Math.min(now-last,64):0;last=now;
  const max=scroller.scrollHeight-scroller.clientHeight;
  if(max>0&&now>=holdUntil){
   position=Math.max(0,Math.min(max,position+direction*elapsed*.01));
   scroller.scrollTop=position;
   if((direction>0&&position>=max)||(direction<0&&position<=0)){direction*=-1;holdUntil=now+2500;}
  }
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  cancelAnimationFrame(frame);frame=0;last=0;position=scroller.scrollTop;
  toggle.hidden=!desktop.matches||reduced.matches;
  scroller.tabIndex=desktop.matches?0:-1;
  if(!desktop.matches){scroller.scrollTop=0;position=0;}
  toggle.textContent=paused?root.dataset.chapterResume:root.dataset.chapterPause;
  if(eligible())frame=requestAnimationFrame(tick);
 }
 toggle.addEventListener('click',()=>{paused=!paused;sync();});
 panel.addEventListener('pointerenter',()=>{hover=true;sync();});
 panel.addEventListener('pointerleave',()=>{hover=false;sync();});
 scroller.addEventListener('focus',()=>{focused=true;sync();});
 scroller.addEventListener('blur',()=>{focused=false;sync();});
 for(const event of ['wheel','touchstart','keydown'])scroller.addEventListener(event,()=>{paused=true;sync();},{passive:true});
 document.addEventListener('visibilitychange',sync);
 desktop.addEventListener('change',sync);reduced.addEventListener('change',sync);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(scroller);
 sync();
}
