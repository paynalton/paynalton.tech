import { createEffectsController, preferenceKey, preferences, readPreferences } from '../lib/site/effects.mjs';
import './forms-state.js';

const dialog = document.querySelector('#search-panel');
const searchLink = document.querySelector('[data-search-open]');
if (dialog && searchLink && typeof dialog.showModal === 'function') {
  searchLink.addEventListener('click', event => {
    event.preventDefault(); document.querySelector('[data-menu-toggle][aria-expanded="true"]')?.click(); dialog.showModal();
    dialog.querySelector('input')?.focus();
  });
  let closing = false;
  const requestClose = () => {
    if (!dialog.open || closing) return;
    closing = true;
    const finish = () => { clearTimeout(fallback); dialog.close(); closing = false; delete dialog.dataset.closing; };
    // Optional effects can defer closing; the functional dialog always has a fallback.
    const fallback = setTimeout(finish, 1400);
    const event = new CustomEvent('site:dialog-close', { cancelable: true, detail: { finish } });
    if (dialog.dispatchEvent(event)) finish();
  };
  dialog.querySelector('[data-dialog-close]')?.addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  dialog.addEventListener('close', () => searchLink.focus());
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) requestClose();
  } });
}

// Independent optional-effects controller. No animation or WebGL dependency is imported.
let storage;
try { storage = localStorage; } catch { storage = null; }
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
export const effects = createEffectsController(readPreferences(storage), {
  reducedMotion: reduced.matches, hidden: document.hidden,
  saveData: connection?.saveData === true,
  lowPower: (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2),
});
const controls = document.querySelector('[data-effects-controls]');
if (controls) {
  const select = controls.querySelector('select');
  const three = controls.querySelector('input[type=checkbox]');
  const status = controls.querySelector('[data-preferences-status]');
  const reduction = controls.querySelector('[data-reduced-motion]');
  controls.querySelector('fieldset').disabled = false;
  function reflect() { const choice = effects.getPreferences(); select.value = choice.mode; three.checked = choice.disable3D; }
  effects.subscribe(state => {
    document.documentElement.dataset.effects = state.level;
    document.documentElement.dataset.sceneAllowed = String(state.allow3D);
    reduction.hidden = !state.reducedMotion;
  });
  reflect();
  const save = value => {
    effects.setPreferences(value); reflect();
    try { storage.setItem(preferenceKey, JSON.stringify(effects.getPreferences())); status.textContent = controls.dataset.saved; }
    catch { status.textContent = controls.dataset.session; }
  };
  controls.addEventListener('change', () => save({ mode: select.value, disable3D: three.checked }));
  controls.querySelector('[data-effects-reset]').addEventListener('click', () => save(preferences(null)));
  addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) { effects.setPreferences(readPreferences(storage)); reflect(); status.textContent = ''; }
  });
}
reduced.addEventListener('change', () => effects.setSignals({ reducedMotion: reduced.matches }));
document.addEventListener('visibilitychange', () => effects.setSignals({ hidden: document.hidden }));
connection?.addEventListener('change', () => effects.setSignals({ saveData: connection.saveData === true }));

for (const group of document.querySelectorAll('[data-contact-actions]')) {
  const value=group.dataset.value, status=group.querySelector('[data-contact-status]');
  const copy=group.querySelector('[data-copy]'), share=group.querySelector('[data-share]');
  copy.hidden=false;
  const selectVisible=()=>{const selection=getSelection(),range=document.createRange();range.selectNodeContents(group.querySelector('.selectable-contact'));selection?.removeAllRanges();selection?.addRange(range);};
  copy.addEventListener('click',async()=>{
    copy.disabled=true;
    try { if(!navigator.clipboard?.writeText)throw new Error('Unavailable');await navigator.clipboard.writeText(value);status.textContent=group.dataset.copied; }
    catch { status.textContent=group.dataset.failed;selectVisible(); }
    finally { copy.disabled=false;copy.focus(); }
  });
  if(share && typeof navigator.share==='function') {
    share.hidden=false;
    share.addEventListener('click',async()=>{
      share.disabled=true;
      try{await navigator.share({title:group.dataset.title,url:value});status.textContent=group.dataset.shared;}
      catch(error){status.textContent=error?.name==='AbortError'?group.dataset.cancelled:group.dataset.shareFailed;}
      finally{share.disabled=false;share.focus();}
    });
  }
}
let closedForPrint=[];
addEventListener('beforeprint',()=>{closedForPrint=[...document.querySelectorAll('.professional-trajectory details:not([open])')];closedForPrint.forEach(el=>el.open=true);});
addEventListener('afterprint',()=>{closedForPrint.forEach(el=>el.open=false);closedForPrint=[];});

// This branch is removed by Vite when building a site without the optional layer.
if(import.meta.env.VITE_DISABLE_EFFECTS!=='1'){
 let loading=false,cleanup,generation=0;
 const connect=()=>{
  if(!effects.getState().motion||loading)return;loading=true;const turn=++generation;
  import('./effects/optional.js').then(module=>{if(turn===generation)cleanup=module.connectEffects(effects);}).catch(()=>{});
 };
 effects.subscribe(connect);
 addEventListener('pagehide',()=>{generation++;cleanup?.();cleanup=undefined;loading=false;});
 addEventListener('pageshow',event=>{if(event.persisted)connect();});
}
