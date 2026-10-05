import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const directory='ai_reference/implementacion/PT12';await mkdir(directory,{recursive:true});
const output=spawnSync('npm',['audit','--json'],{encoding:'utf8'});
let audit;try{audit=JSON.parse(output.stdout);}catch{throw new Error('No audit data available; dependency verification is pending');}
assert.ok(!audit.error && audit.metadata?.vulnerabilities,'Audit service unavailable; not a clean audit');
await writeFile(`${directory}/audit.json`,JSON.stringify({checkedAt:new Date().toISOString(),registry:'https://registry.npmjs.org',metadata:audit.metadata,vulnerabilities:audit.vulnerabilities},null,2)+'\n');
assert.equal(audit.metadata.vulnerabilities.total,0,'Review dependency advisories before accepting candidate');
const listed=spawnSync('git',['ls-files','--cached','--others','--exclude-standard','-z','--','src','public','scripts','package.json','package-lock.json','netlify.toml','astro.config.mjs'],{encoding:'utf8'});
assert.equal(listed.status,0,'Could not enumerate candidate sources');
let sourceFiles=0;
for(const file of new Set(listed.stdout.split('\0').filter(name=>/\.(?:astro|js|mjs|ts|json|css|scss|svg|toml|md|txt)$/.test(name)))){
 let content;try{content=await readFile(file,'utf8');}catch(error){if(error.code==='ENOENT')continue;throw error;}
 assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b/.test(content),`Credential-like value in ${file}; content omitted`);
 sourceFiles++;
}
const headers=await readFile('dist/_headers','utf8');
for(const directive of ["default-src 'self'","script-src-attr 'none'","frame-ancestors 'none'","object-src 'none'","base-uri 'none'","form-action 'self'",'X-Frame-Options: DENY'])assert.ok(headers.includes(directive),directive);
assert.ok(!/script-src [^;]*(?:'unsafe-inline'|'unsafe-eval')/.test(headers));
for(const name of await readdir('dist',{recursive:true})){
 assert.ok(!/(^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|\.ai_cache|ai_reference|tests|test-results|playwright-report|node_modules)/.test(name),`Private file in artifact: ${name}`);
}
console.log(`Sources inspected: ${sourceFiles}`);
console.log('SEG01/02/07: no known dependency advisories; private paths excluded; browser policy present. Remote headers remain unverified.');
