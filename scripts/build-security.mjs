import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

export async function securityHeaders(directory){
 const hashes=new Set();
 for(const name of await readdir(directory,{recursive:true})){
  if(!name.endsWith('.html'))continue;
  const html=await readFile(path.join(directory,name),'utf8');
  for(const [,attributes,body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
   // JSON-LD is inert data. Only executable inline modules require permission.
   if(/\bsrc\s*=|application\/ld\+json/i.test(attributes))continue;
   hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
 }
 const policy=["default-src 'self'",`script-src 'self' 'wasm-unsafe-eval' ${[...hashes].sort().join(' ')}`,"script-src-attr 'none'","style-src 'self' 'unsafe-inline'","img-src 'self' data:","font-src 'self' data:","connect-src 'self'","worker-src 'self' blob:","object-src 'none'","base-uri 'none'","frame-ancestors 'none'","form-action 'self'"].join('; ');
 const base=await readFile('public/_headers','utf8');
 return base.replace('/*\n',`/*\n  Content-Security-Policy: ${policy}\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
}
export async function buildSecurity(directory){
 await writeFile(path.join(directory,'_headers'),await securityHeaders(directory));
}
