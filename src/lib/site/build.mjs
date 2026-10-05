import path from 'node:path';
import { loadRepository } from './repository.mjs';
// Explicit source root survives Astro's relocation of prerender modules.
export const loadSite = () => loadRepository(path.resolve('src/data/site'));
