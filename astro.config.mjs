// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {fileURLToPath} from 'node:url';
import {buildSearch} from './scripts/build-search.mjs';
import {buildPublication} from './scripts/build-publication.mjs';
import {buildSecurity} from './scripts/build-security.mjs';
import {loadRepository} from './src/lib/site/repository.mjs';
import {canonicalPages,origin} from './src/lib/site/publication.mjs';
import {pageAlternatives,routeManifest} from './src/lib/site/navigation.mjs';
const repository=await loadRepository(),manifest=routeManifest(repository),allowed=new Set(canonicalPages(repository).map(p=>p.url));

// https://astro.build/config
export default defineConfig({
    site: origin,
    outDir: process.env.VITE_DISABLE_EFFECTS === '1' ? './.effects-off-dist' : process.env.DESIGN_REVIEW === '1' ? './.design-dist' : './dist',
    vite:{define:{'import.meta.env.VITE_DISABLE_EFFECTS':JSON.stringify(process.env.VITE_DISABLE_EFFECTS??'0')},build:{rollupOptions:{output:{manualChunks(id){if(id.includes('/node_modules/three/'))return 'three-engine';}}}}},
    integrations: [sitemap({filter:url=>allowed.has(new URL(url).pathname),serialize:item=>{const page=manifest.find(p=>new URL(item.url).pathname===p.url);if(page){const alternatives=pageAlternatives(manifest,page,repository.getSettings());if(alternatives.length>1)item.links=alternatives.map(a=>({lang:a.locale,url:new URL(a.url,origin).href}));}return item;}}),{name:'paynalton-search',hooks:{'astro:build:done':async({dir})=>{await buildPublication(fileURLToPath(dir));await buildSearch(fileURLToPath(dir));await buildSecurity(fileURLToPath(dir));}}}],
});
