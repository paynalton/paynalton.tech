// Reserved activation hook: document.dispatchEvent(new Event('site:fireworks')).
// The optional controller still enforces motion preferences and cleanup.
export function mountFireworks(policy){
 const listeners=new AbortController();
 let canvas,context,frame=0,timer=0,start=0,last=0,next=0,width=0,height=0,particles=[];
 const soft=policy.level==='soft';
 const duration=30000;
 const colors=['#ffe1a0','#c78d65','#eabf80','#8fbeb3'];
 function stop(){
  cancelAnimationFrame(frame);clearTimeout(timer);frame=0;timer=0;
  canvas?.remove();canvas=undefined;context=undefined;particles=[];
 }
 function resize(){
  if(!canvas)return;
  width=innerWidth;height=innerHeight;
  const ratio=Math.min(devicePixelRatio||1,soft?1:1.5);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  context.setTransform(ratio,0,0,ratio,0,0);
 }
 function launch(time){
  const x=width*(.15+Math.random()*.7),y=height*(.18+Math.random()*.42);
  const count=soft?30:64,color=colors[Math.floor(Math.random()*colors.length)];
  const radius=Math.min(width,height)*(.17+Math.random()*.08);
  for(let i=0;i<count;i++){
   const angle=Math.PI*2*i/count,speed=radius*(.6+Math.random()*.4);
   particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,born:time,life:1500+Math.random()*450,color});
  }
 }
 function draw(now){
  if(now-start>=duration){stop();return;}
  frame=requestAnimationFrame(draw);
  if(now-last<1000/30)return;
  last=now;
  const time=now-start;
  if(time>=next&&time<duration-2000){launch(time);next=time+(soft?750:500);}
  context.clearRect(0,0,width,height);
  particles=particles.filter(p=>time-p.born<p.life);
  for(const p of particles){
   const age=time-p.born,t=age/1000,progress=age/p.life;
   const travel=(1-Math.exp(-1.25*t))/1.25;
   const x=p.x+p.vx*travel,y=p.y+p.vy*travel+32*t*t;
   context.globalAlpha=Math.min(1,age/100)*Math.pow(1-progress,1.3);
   context.strokeStyle=p.color;context.lineWidth=1.5;
   context.beginPath();context.moveTo(x-p.vx*.035,y-p.vy*.035-2*t);context.lineTo(x,y);context.stroke();
   context.fillStyle=p.color;context.beginPath();context.arc(x,y,soft?1.5:2,0,Math.PI*2);context.fill();
  }
  context.globalAlpha=1;
 }
 document.addEventListener('site:fireworks',()=>{
  if(canvas)return;
  canvas=document.createElement('canvas');canvas.className='fireworks-overlay';canvas.dataset.fireworks='';canvas.setAttribute('aria-hidden','true');
  context=canvas.getContext('2d');if(!context){stop();return;}
  document.body.append(canvas);resize();
  start=performance.now();last=0;next=0;frame=requestAnimationFrame(draw);timer=setTimeout(stop,duration);
 },{signal:listeners.signal});
 addEventListener('resize',resize,{signal:listeners.signal,passive:true});
 addEventListener('keydown',event=>{if(event.key==='Escape')stop();},{signal:listeners.signal});
 addEventListener('pagehide',stop,{signal:listeners.signal});
 return()=>{stop();listeners.abort();};
}
