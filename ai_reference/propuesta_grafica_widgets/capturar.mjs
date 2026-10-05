import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'));
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const results=[];const errors=[];
for(const [name,width] of [['escritorio',1440],['movil',390]]){
 const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(String(e)));
 for(const widget of manifest){
  await page.goto(pathToFileURL(path.join(root,'widgets',widget.id+'.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  const check=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('.stage *')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)}).map(x=>x.className).slice(0,10)}));
  results.push({widget:widget.id,viewport:name,...check});
  await page.screenshot({path:path.join(root,'capturas',name,widget.id+'.png'),fullPage:true});
 }
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto(pathToFileURL(path.join(root,'widgets/W03.html')).href);
await page.locator('.menu-toggle').click();
const menuOpens=await page.locator('#mobile-menu').isVisible();
await page.screenshot({path:path.join(root,'capturas/movil/W03-menu-abierto.png'),fullPage:true});
await page.keyboard.press('Escape');
const menuCloses=await page.locator('#mobile-menu').isHidden();
await page.goto(pathToFileURL(path.join(root,'widgets/W05.html')).href);
await page.locator('[data-search]').fill('Pipila');
const searchWorks=await page.locator('.search-items .row:visible').count()===1;
await page.goto(pathToFileURL(path.join(root,'widgets/W25.html')).href);
await page.locator('[data-reader-size]').fill('26');
const sizeWorks=await page.locator('.adjustable').evaluate(el=>getComputedStyle(el).fontSize==='26px');
await page.goto(pathToFileURL(path.join(root,'index.html')).href);
await page.locator('[data-filter="Excluido"]').click();
const galleryWorks=await page.locator('.gallery-card:visible').count()===1;
await page.locator('[data-filter="Todos"]').click();
await page.screenshot({path:path.join(root,'capturas/galeria-movil.png'),fullPage:true});
const failed=results.filter(x=>x.document>x.width||x.overflow.length);
const report={date:new Date().toISOString(),pages:manifest.length,screenshots:80,overflow:failed,errors,interactions:{menuOpens,menuCloses,searchWorks,sizeWorks,galleryWorks},checks:results,scope:'Verificación de maquetas locales; no acredita accesibilidad completa ni funciones de producción.'};
await writeFile(path.join(root,'verificacion.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:manifest.length,overflow:failed,errors,interactions:report.interactions}));
await browser.close();
