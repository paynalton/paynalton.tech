import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const files=[];
for(const path of (await readdir('dist',{recursive:true})).sort()){
 try{const bytes=await readFile('dist/'+path);files.push({path,bytes:bytes.length,sha256:sha(bytes)});}catch(error){if(error.code!=='EISDIR')throw error;}
}
const configuration={};
for(const path of ['package.json','package-lock.json','.nvmrc','netlify.toml','astro.config.mjs','public/_headers','scripts/build-security.mjs'])configuration[path]=sha(await readFile(path));
const candidate={generatedAt:new Date().toISOString(),artifactSha256:sha(JSON.stringify(files)),gitHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTreeDirty:!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),node:process.version,npm:execFileSync('npm',['--version'],{encoding:'utf8'}).trim(),configuration,files};
await mkdir('ai_reference/implementacion/PT12',{recursive:true});
await writeFile('ai_reference/implementacion/PT12/candidato.json',JSON.stringify(candidate,null,2)+'\n');
console.log(`Candidato local: ${candidate.artifactSha256}; ${files.length} archivos. No es una aprobación de publicación.`);
