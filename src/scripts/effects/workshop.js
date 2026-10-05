import {WebGLRenderer,ACESFilmicToneMapping,SRGBColorSpace} from 'three';
import {createWorkshop} from './workshop-model.js';
import {createQualityMonitor} from '../../lib/site/scene-quality.mjs';

export function mountWorkshop(host,onFailure){
 if(typeof ResizeObserver!=='function'||typeof IntersectionObserver!=='function')throw new Error('Scene observation unavailable');
 let renderer,model,frame=0,disposed=false,visible=true,previous=0,start=0,settled=false;
 const intervals=[],mountStart=performance.now();let draws=0,ambientTime=0;
 let x=0,y=0,targetX=0,targetY=0,dpr=Math.min(devicePixelRatio||1,1.5);
 const monitor=createQualityMonitor(),precise=matchMedia('(hover: hover) and (pointer: fine)');
 const listeners=new AbortController();
 function fail(){if(!disposed){destroy();host.dataset.scene='failed';onFailure();}}
 try{
  renderer=new WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  model=createWorkshop(renderer,host.dataset.workshop||'hero');renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.tabIndex=-1;
  host.append(renderer.domElement);
 }catch{model?.dispose();renderer?.dispose();renderer?.forceContextLoss();throw new Error('Scene unavailable');}
 const canvas=renderer.domElement;
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fail();},{signal:listeners.signal});
 function request(){if(!disposed&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);}
 function draw(now){
  frame=0;if(disposed||!visible||document.hidden)return;
  if(previous&&now-previous<1000/30-1){request();return;}
  try{
   if(!start)start=now;const dt=previous?Math.min(now-previous,100):16;
   // Shader/environment startup is not evidence of sustained poor frame rate.
   if(previous&&draws>1){intervals.push(now-previous);if(intervals.length>120)intervals.shift();const decision=monitor.sample(now,now-previous);if(decision==='stop'){fail();return;}if(decision==='reduce'){dpr=1;renderer.setPixelRatio(dpr);host.dataset.quality='reduced';}}
   ambientTime+=previous?(now-previous)/1000:0;previous=now;
   const progress=Math.min((now-start)/1100,1),ease=1-Math.pow(1-progress,3),blend=1-Math.exp(-dt/140);
   x+=(targetX-x)*blend;y+=(targetY-y)*blend;
   model.animate(ambientTime);host.dataset.ambientSeconds=String(ambientTime);
   model.pose(ease,x,y);host.dataset.yaw=String(x);host.dataset.pitch=String(y);renderer.render(model.scene,model.camera);
   draws++;host.dataset.scene='ready';host.dataset.frames=String(draws);
   if(draws===1){host.dataset.startupMs=String(Math.round(performance.now()-mountStart));host.dataset.frameMedianMs='not-sampled';}
   host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.calls=String(renderer.info.render.calls);
   host.dataset.geometryBytes=String(model.geometryBytes);host.dataset.geometries=String(renderer.info.memory.geometries);host.dataset.textures=String(renderer.info.memory.textures);host.dataset.dpr=String(dpr);
   settled=progress===1&&Math.abs(targetX-x)<.0001&&Math.abs(targetY-y)<.0001;
   host.dataset.pointerSettled=String(settled);host.dataset.active='true';
   if(settled&&intervals.length)host.dataset.frameMedianMs=String(Number(intervals.toSorted((a,b)=>a-b)[Math.floor(intervals.length/2)].toFixed(2)));
   request();
  }catch{fail();}
 }
 function resize(){if(disposed)return;const box=host.getBoundingClientRect();if(box.width<1||box.height<1)return;renderer.setPixelRatio(dpr);renderer.setSize(box.width,box.height,false);model.frame(box.width,box.height);request();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 const observer=new IntersectionObserver(([entry])=>{if(disposed)return;visible=entry.isIntersecting;host.dataset.paused=String(!visible);if(!visible){cancelAnimationFrame(frame);frame=0;previous=0;monitor.reset();}else request();});observer.observe(host);
 const pointerSurface=host.closest('section')||host;
 pointerSurface.addEventListener('pointermove',event=>{if(!precise.matches)return;const box=pointerSurface.getBoundingClientRect();const nx=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1)),ny=Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1));targetX=Math.sign(nx)*Math.pow(Math.abs(nx),.8)*.42;targetY=Math.sign(ny)*Math.pow(Math.abs(ny),.8)*.2;request();},{signal:listeners.signal});
 pointerSurface.addEventListener('pointerleave',()=>{targetX=targetY=0;request();},{signal:listeners.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;previous=0;monitor.reset();}else request();},{signal:listeners.signal});
 function destroy(){
  if(disposed)return;disposed=true;cancelAnimationFrame(frame);listeners.abort();resizeObserver.disconnect();observer.disconnect();
  model.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();host.dataset.scene='static';host.dataset.active='false';host.dataset.geometries='0';host.dataset.textures='0';
 }
 resize();return destroy;
}
