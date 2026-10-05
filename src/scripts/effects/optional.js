import {mountFireworks} from './fireworks.js';
import {mountFigureVortex} from './figure-vortex.js';
export function connectEffects(effects){
 let cleanup=mountEffects(effects);
 const stop=()=>{cleanup?.();cleanup=undefined;};
 const restart=()=>{stop();cleanup=mountEffects(effects);};
 document.addEventListener('site:forms-visibility-changing',stop);
 document.addEventListener('site:forms-visibility-changed',restart);
 return()=>{stop();document.removeEventListener('site:forms-visibility-changing',stop);document.removeEventListener('site:forms-visibility-changed',restart);};
}
function mountEffects(effects){
 const removers=[];
 removers.push(effects.register('fireworks','decoration',mountFireworks));
 removers.push(effects.register('figure-vortex','decoration',mountFigureVortex));
 removers.push(effects.register('particles','decoration',policy=>{
  if(policy.level!=='full')return ()=>{};
    let stopped=false,cleanup,footerCleanup,readingCleanup;
    import('./particles.js').then(module=>{if(!stopped){cleanup=module.mountParticles();if(document.documentElement.dataset.figuresGone!=='true'){footerCleanup=module.mountFooterParticles();readingCleanup=module.mountReadingParticles();}}}).catch(()=>{});
    const hideFigures=()=>{footerCleanup?.();readingCleanup?.();footerCleanup=undefined;readingCleanup=undefined;};
    const stop=()=>{stopped=true;cleanup?.();footerCleanup?.();readingCleanup?.();};
    document.addEventListener('site:figures-hidden',hideFigures);
    return()=>{stop();document.removeEventListener('site:figures-hidden',hideFigures);};
 }));
 removers.push(effects.register('decorations','decoration',policy=>{
  let stopped=false,cleanup;
  import('./decorations.js').then(module=>{if(!stopped)cleanup=module.mountDecorations(policy);}).catch(()=>{});
  return ()=>{stopped=true;cleanup?.();};
 }));
 document.querySelectorAll('[data-workshop]').forEach((host,index)=>{
  removers.push(effects.register(`workshop-${index}`,'scene',()=>{
   if(document.documentElement.dataset.figuresGone==='true')return()=>{};
   let stopped=false,cleanup,generation=0,loading=false;
   const observer=new IntersectionObserver(entries=>{
    const entry=entries[0],visible=entry.isIntersecting&&entry.intersectionRatio>=.25;
    if(!visible){generation++;loading=false;cleanup?.();cleanup=undefined;host.dataset.paused='true';return;}
    host.dataset.paused='false';if(cleanup||loading)return;
    loading=true;const turn=++generation;
    import('./workshop.js').then(module=>{
     if(stopped||turn!==generation)return;
     try{cleanup=module.mountWorkshop(host,()=>effects.failScene());}
     catch{effects.failScene();host.dataset.scene='failed';}
    }).catch(()=>{if(!stopped&&turn===generation){effects.failScene();host.dataset.scene='failed';}});
   },{threshold:[0,.25]});observer.observe(host);
   const stop=()=>{stopped=true;generation++;observer.disconnect();cleanup?.();};
   document.addEventListener('site:figures-hidden',stop);
   return ()=>{stop();document.removeEventListener('site:figures-hidden',stop);};
  }));
 });
 return ()=>removers.forEach(remove=>remove());
}
