import { readdir, readFile } from 'node:fs/promises';
import { loadRepository } from '../src/lib/site/repository.mjs';

const forbidden = ['PT08-SYNTHETIC', 'PT06-SYNTHETIC', 'ejemplo-lectura', 'ejemplo-capitulo-uno', '[Expanded translation]', '[Translated]', 'Nota editorial — no publicar', 'PT11-PRIVATE-FIXTURE', 'ai_reference/materiales', 'source_sha256'];
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (['ai_reference', '.ai_cache', 'tests', 'design-review'].includes(entry.name)) throw new Error(`Directorio interno en build: ${file}`);
      await walk(file);
    } else if ((/\.(html|json|js|mjs|xml|txt|md|map|css|svg)$/.test(file) || ['_headers','_redirects'].includes(entry.name))) files.push(file);
  }
}
await walk('dist');
for (const file of files) {
  const content = await readFile(file, 'utf8');
  if (forbidden.some(marker => content.includes(marker)) || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b/.test(content)) throw new Error(`Contenido interno o de prueba en ${file}`);
}
const repository = await loadRepository();
if (repository.publicEntries().some(entry => entry.example)) throw new Error('Ejemplo en colección pública');
console.log(`Artefacto: ${files.length} archivos de texto revisados; sin marcadores internos/de prueba ni patrones de credenciales conocidos.`);
