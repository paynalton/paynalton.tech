import { loadRepository } from '../src/lib/site/repository.mjs';
const repository = await loadRepository();
const settings = repository.getSettings();
for (const locale of settings.locales.filter(l => l.enabled)) {
  const entries = repository.publicEntries(locale.code);
  if (entries.some(e => e.example)) throw new Error('Ejemplo filtrado a publicación');
  console.log(`${locale.code}: ${entries.length} entradas públicas; diccionario y relaciones válidos.`);
}
