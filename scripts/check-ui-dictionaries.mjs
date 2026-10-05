import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';

const ui=JSON.parse(await readFile('src/data/site/ui/es.json','utf8'));
const legacy=Object.fromEntries(await Promise.all(['es','en','nah','yua'].map(async locale=>[locale,JSON.parse(await readFile(`src/locales/${locale}.json`,'utf8'))])));
const failures=[];let references=0,templates=0;
for(const relative of await readdir('src',{recursive:true})){
 if(!/\.(astro|mjs|js)$/.test(relative))continue;
 const file=`src/${relative}`,source=await readFile(file,'utf8');
 for(const match of source.matchAll(/\bt\(\s*(['"])([a-z][\w]*(?:\.[\w]+)+)\1/g)){
  references++;if(!Object.hasOwn(ui,match[2]))failures.push(`${file}: UI key ${match[2]}`);
 }
 for(const match of source.matchAll(/\._t\(\s*(['"])([^'"\n]+)\1/g)){
  references++;for(const [locale,catalog] of Object.entries(legacy))if(!Object.hasOwn(catalog,match[2]))failures.push(`${file}: ${locale}/${match[2]}`);
 }
 // Production redesign templates: ordinary prose and accessibility labels must
 // be translated or supplied from localized editorial records. This is a
 // focused literal guard, not a substitute for checking dynamic keys at build.
 if(!relative.endsWith('.astro')||! /^(components\/(site|shell|taller)\/|layouts\/site\/|pages\/404\.astro)/.test(relative))continue;
 templates++;
 const markup=source.replace(/^---[\s\S]*?---/,'').replace(/<(script|style)\b[\s\S]*?<\/\1>/g,'').replace(/<!--[\s\S]*?-->/g,'');
 for(const match of markup.matchAll(/(?<!=)>([^<{]*)/g)){
  const value=match[1].trim();
  // A closing JSX tag can be followed by the alternate expression of a ternary.
  if(/^:(?:t\(|entry\.)/.test(value))continue;
  if(/[\p{L}]/u.test(value))failures.push(`${file}: literal text ${value}`);
 }
 for(const match of markup.matchAll(/\b(?:aria-label|aria-description|placeholder|title|alt)="([^"]+)"/g)){
  if(/\p{L}/u.test(match[1]))failures.push(`${file}: literal attribute ${match[1]}`);
 }
}
assert.deepEqual(failures,[],'UI dictionary audit failed');
console.log(`UI: ${references} literal dictionary references checked; ${templates} production templates checked for untranslated prose/labels. Dynamic keys and editorial content are validated by check:content and build.`);
