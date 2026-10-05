import {chromium} from '@playwright/test';
import {access,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const url=pathToFileURL(path.join(root,'index.html')).href;
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const result={scope:'Dossier formal; no audita sitio ni prototipos enlazados',viewports:[],errors:[],missingFiles:[],missingAnchors:[]};
try {
 const page=await browser.newPage();
 page.on('pageerror',e=>result.errors.push(String(e)));
 await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 await page.pdf({path:path.join(root,'Propuesta_grafica_formal_Paynalton.pdf'),format:'A4',tagged:true,outline:true,printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;color:#414b43;width:100%;text-align:center">Paynalton · Taller nocturno · Propuesta gráfica / <span class="pageNumber"></span> de <span class="totalPages"></span></div>'});
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  result.viewports.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length})));
 }
 const refs=await page.evaluate(()=>[...document.querySelectorAll('[href],[src]')].map(e=>e.getAttribute('href')||e.getAttribute('src')));
 for(const ref of new Set(refs)){
  if(ref.startsWith('#')){if(!await page.evaluate(id=>!!document.getElementById(id),ref.slice(1)))result.missingAnchors.push(ref);continue;}
  const u=new URL(ref,url);if(u.protocol==='file:')try{await access(fileURLToPath(u));}catch{result.missingFiles.push(ref);}
 }
 await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:path.join(root,'vista_escritorio.png')});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'vista_movil.png')});
 result.ok=!result.errors.length&&!result.missingFiles.length&&!result.missingAnchors.length&&result.viewports.every(x=>x.scrollWidth===x.width&&!x.brokenImages.length&&x.main===1&&x.h1===1);
 await writeFile(path.join(root,'verificacion.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
}finally{await browser.close();}
