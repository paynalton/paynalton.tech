import {readFile,readdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const names=await readdir('dist/_astro'),rows=[];
for(const name of names.filter(n=>/^(three-engine|workshop|optional|decorations|particles)\..*\.js$/.test(n))){const data=await readFile('dist/_astro/'+name);rows.push({file:name,bytes:data.length,gzip:gzipSync(data).length});}
assert.equal(rows.length,5,'Expected separate motor, scene, coordinator, decorations and particles');
const motor=rows.find(row=>row.file.startsWith('three-engine'));
const optional=rows.filter(row=>row!==motor).reduce((sum,row)=>sum+row.gzip,0);assert.ok(optional<=35000,'Optional coordination budget exceeded');
const totalSceneGzip=rows.reduce((sum,row)=>sum+row.gzip,0);
assert.ok(totalSceneGzip<=1500000,'Deferred procedural scene exceeds 1.5 MB compressed');
const scene=rows.find(row=>row.file.startsWith('workshop'));assert.ok(scene.gzip<=1000000);
const renders=[...JSON.parse(await readFile('ai_reference/implementacion/PT10/render-metrics.json','utf8')),...JSON.parse(await readFile('ai_reference/implementacion/PT12/afinacion-home/render-metrics.json','utf8')),...JSON.parse(await readFile('ai_reference/implementacion/PT12/escenas-secciones/render-metrics.json','utf8')),...JSON.parse(await readFile('ai_reference/implementacion/PT12/libro-3d/render-metrics.json','utf8'))];
for(const render of renders){assert.ok(render.triangles<=60000);assert.ok(render.calls<=30);for(const resource of render.resources){const data=await readFile(resource.file);assert.equal(data.length,resource.bytes);assert.ok(data.length<=(render.name==='movil'?180000:300000));}}
await writeFile('ai_reference/implementacion/PT10/transfer-metrics.json',JSON.stringify({units:'bytes',compression:'gzip calculated locally, actual hosting compression pending',resources:rows,optionalGzip:optional},null,2)+'\n');
console.log(`Efectos: motor ${motor.gzip} bytes gzip; escena/coordinación/decoraciones ${optional}; renders y límites comprobados.`);
