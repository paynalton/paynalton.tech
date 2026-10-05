import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {once} from 'node:events';
import assert from 'node:assert/strict';
const directory='ai_reference/implementacion/PT12/performance';
await mkdir(directory,{recursive:true});
const port=4333,origin=`http://127.0.0.1:${port}`;
// The owned preview never deploys or reuses another server.
const server=spawn(process.execPath,['node_modules/astro/bin/astro.mjs','preview','--host','127.0.0.1','--port',String(port),'--ignore-lock'],{stdio:['ignore','pipe','pipe']});
const serverDone=once(server,'exit');
let serverLog='';server.stdout.on('data',b=>serverLog+=b);server.stderr.on('data',b=>serverLog+=b);
try{
 let ready=false;
 for(let n=0;n<100;n++){
  if(server.exitCode!==null)throw new Error('Preview exited: '+serverLog);
  if(serverLog.includes(`:${port}/`)){ready=true;break;}
  await new Promise(r=>setTimeout(r,100));
 }
 assert.ok(ready,'Owned preview did not start on requested port');
 const summaries=[];
 for(const [name,url] of [['inicio','/es/'],['proyecto','/es/proyectos/pipila/'],['catalogo','/es/obra/'],['lectura','/es/obra/el-estupor-mexicano/']]){
  const file=`${directory}/lighthouse-${name}.json`;
  const child=spawn(process.execPath,['node_modules/lighthouse/cli/index.js',origin+url,'--only-categories=performance,accessibility,best-practices,seo','--output=json',`--output-path=${file}`,'--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--quiet'],{stdio:'inherit',env:{...process.env,CHROME_PATH:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome'}});
  const [code]=await once(child,'exit');assert.equal(code,0,'Lighthouse failed '+url);
  const report=JSON.parse(await readFile(file,'utf8'));assert.ok(!report.runtimeError,JSON.stringify(report.runtimeError));
  summaries.push({url,version:report.lighthouseVersion,fetchTime:report.fetchTime,environment:report.environment,settings:report.configSettings,scores:Object.fromEntries(Object.entries(report.categories).map(([k,v])=>[k,v.score])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(id=>[id,report.audits[id].numericValue]))});
  console.log('Lighthouse diagnostic complete: '+url);
 }
 await writeFile(`${directory}/lighthouse-summary.json`,JSON.stringify(summaries,null,2)+'\n');
}finally{server.kill('SIGTERM');await serverDone;}
