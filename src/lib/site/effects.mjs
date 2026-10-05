export const preferenceKey = 'paynalton.visual.v1';
export const modes = ['auto', 'soft', 'full', 'off'];
export function preferences(value) {
  return { mode: modes.includes(value?.mode) ? value.mode : 'auto', disable3D: value?.disable3D === true };
}
export function readPreferences(storage) {
  try { return preferences(JSON.parse(storage.getItem(preferenceKey))); }
  catch { return preferences(null); }
}
export function effectPolicy(choice, signals = {}, failed = false) {
  const p = preferences(choice);
  const stopped = p.mode === 'off' || signals.reducedMotion || signals.hidden;
  const constrained = signals.saveData || signals.lowPower || failed;
  return Object.freeze({
    mode: p.mode,
    motion: !stopped,
    level: stopped ? 'off' : p.mode === 'soft' || constrained ? 'soft' : 'full',
    allow3D: !stopped && !p.disable3D && p.mode !== 'soft' && !constrained,
    reducedMotion: !!signals.reducedMotion,
    sceneFailed: failed,
  });
}
/** Optional visual layer. Adapters mount synchronously and return a cleanup function.
 * Async engine imports belong to the adapter and must obey its cleanup signal.
 * No adapter is needed for content, navigation, or forms to work.
 */
export function createEffectsController(initial, initialSignals = {}) {
  let choice = preferences(initial), signals = { ...initialSignals }, failed = false;
  const listeners = new Set(), adapters = new Map();
  const state = () => effectPolicy(choice, signals, failed);
  function sync() {
    const current = state();
    for (const adapter of adapters.values()) {
      const enabled = adapter.kind === 'scene' ? current.allow3D : current.motion;
      if ((!enabled || adapter.level !== current.level) && adapter.cleanup) {
        try { adapter.cleanup(); } catch { /* A decoration cannot break navigation. */ }
        adapter.cleanup = null;
      }
      if (enabled && !adapter.cleanup && !adapter.failed) {
        adapter.level = current.level;
        try { adapter.cleanup = adapter.mount(current) ?? (() => {}); }
        catch {
          adapter.failed = true;
          if (adapter.kind === 'scene') { failed = true; sync(); return; }
        }
      }
    }
    for (const listener of listeners) listener(state());
  }
  return {
    getState: state,
    getPreferences: () => ({ ...choice }),
    setPreferences(value) { choice = preferences(value); sync(); },
    setSignals(value) { signals = { ...signals, ...value }; sync(); },
    failScene() { failed = true; sync(); },
    subscribe(listener) { listeners.add(listener); listener(state()); return () => listeners.delete(listener); },
    register(id, kind, mount) {
      if (adapters.has(id) || !['scene','decoration'].includes(kind)) throw new Error('Invalid effect adapter');
      const adapter = { kind, mount, cleanup: null, level: null, failed: false };
      adapters.set(id, adapter); sync();
      return () => { try { adapter.cleanup?.(); } finally { adapters.delete(id); } };
    },
    destroy() {
      for (const adapter of adapters.values()) { try { adapter.cleanup?.(); } catch { /* continue cleanup */ } }
      adapters.clear(); listeners.clear();
    },
  };
}
