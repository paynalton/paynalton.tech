const q=(s,r=document)=>r.querySelector(s);const qa=(s,r=document)=>[...r.querySelectorAll(s)];
q('[data-zones]')?.addEventListener('change',e=>document.body.classList.toggle('show-zones',e.target.checked));
const toggle=q('.mobile-toggle'),menu=q('#site-menu');
toggle?.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}});
const query=q('[data-query]'),topic=q('[data-topic]'),items=qa('.catalog-items > article');
function filter(){let count=0;items.forEach(i=>{i.hidden=!(i.dataset.title.includes((query?.value||'').toLowerCase())&&(!topic?.value||i.dataset.topic===topic.value));if(!i.hidden)count++});if(q('[data-count]'))q('[data-count]').textContent=count+' '+(count===1?'contenido':'contenidos');if(q('.empty-state'))q('.empty-state').hidden=count!==0}
query?.addEventListener('input',filter);topic?.addEventListener('change',filter);q('[data-reset]')?.addEventListener('click',()=>{query.value='';topic.value='';filter()});filter();
qa('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);q('.copy-status').textContent='Dirección copiada.'}catch{q('.copy-status').textContent='Selecciona la dirección y cópiala manualmente.'}}));
q('[data-motion]')?.addEventListener('change',e=>document.documentElement.style.scrollBehavior=e.target.checked?'auto':'smooth');
q('[data-static]')?.addEventListener('change',e=>{qa('.hero-art .scene').forEach(s=>s.style.opacity=e.target.checked?'1':'.65');let n=q('.scene-preview-note');if(!n){n=document.createElement('p');n.className='scene-preview-note small';q('.site-footer').append(n)}n.textContent='La propuesta usa una composición estática. WebGL se implementará posteriormente.'});
