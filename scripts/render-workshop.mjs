import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from '@playwright/test';
import sharp from 'sharp';
const root=process.cwd();
const html=`<!doctype html><meta charset="utf-8"><style>html,body{margin:0}canvas{display:block}</style><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script><script type="module">
import {WebGLRenderer,ACESFilmicToneMapping,SRGBColorSpace} from 'three';
import {createWorkshop} from '/src/scripts/effects/workshop-model.js';
const renderer=new WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;document.body.append(renderer.domElement);
let model=createWorkshop(renderer),activeVariant='hero';
window.renderWorkshop=(width,height,variant='hero')=>{if(activeVariant!==variant){model.dispose();model=createWorkshop(renderer,variant);activeVariant=variant;}renderer.setPixelRatio(1);renderer.setSize(width,height);model.frame(width,height);model.pose(1);renderer.render(model.scene,model.camera);return {png:renderer.domElement.toDataURL('image/png'),geometryBytes:model.geometryBytes,triangles:renderer.info.render.triangles,calls:renderer.info.render.calls,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures};};
</script>`;
const server=createServer(async(req,res)=>{
 try{const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/'){res.setHeader('Content-Type','text/html');res.end(html);return;}
  if(!path.startsWith('/node_modules/three/')&&path!=='/src/scripts/effects/workshop-model.js'){res.writeHead(404).end();return;}
  const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw new Error('Invalid path');
  res.setHeader('Content-Type',extname(file)==='.js'?'text/javascript':'application/octet-stream');res.end(await readFile(file));
 }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1600,height:1200}});await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>typeof window.renderWorkshop==='function');
 const book=process.argv.includes('--book'),headers=process.argv.includes('--headers'),sections=book||headers||process.argv.includes('--sections');
 const reviewRoot=book?'ai_reference/implementacion/PT12/libro-3d':headers?'ai_reference/implementacion/PT12/escenas-secciones':'ai_reference/implementacion/PT12/afinacion-home';
 const masters=sections?`${reviewRoot}/masters`:'ai_reference/implementacion/PT10/masters',output='public/taller/workshop';await mkdir(masters,{recursive:true});await mkdir(output,{recursive:true});const report=[];
 for(const [name,width,height,sizes] of (sections?(book?['book']:headers?['projects','career','works','about','contact']:['experience','skills','method']).map(name=>[name,1000,1000,[400,640,800]]):[['escritorio',1600,1200,[640,960,1280]],['movil',1000,1000,[400,640,800]]])){
  const result=await page.evaluate(([w,h,variant])=>window.renderWorkshop(w,h,variant),[width,height,sections?name:'hero']);const png=Buffer.from(result.png.split(',')[1],'base64');await writeFile(`${masters}/${name}.png`,png);
  const resources=[];for(const size of sizes){const file=`${output}/${name}-${size}.webp`;const bytes=await sharp(png).resize(size).webp({quality:86,alphaQuality:95}).toBuffer();await writeFile(file,bytes);resources.push({file,width:size,bytes:bytes.length});}
  const {png:_,...metrics}=result;report.push({name,width,height,...metrics,resources});
 }
 await writeFile(sections?`${reviewRoot}/render-metrics.json`:'ai_reference/implementacion/PT10/render-metrics.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
