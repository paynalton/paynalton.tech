import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));const manifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'));
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const results=[],errors=[];const local=(id)=>pathToFileURL(path.join(root,'layouts',id+'.html')).href;
for(const [name,width] of [['escritorio',1440],['movil',390]]){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(String(e)));
 for(const p of manifest){await page.goto(local(p.id));await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,h1:document.querySelectorAll('main h1').length,overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.right>innerWidth+1||r.left< -1)}).map(e=>e.className).slice(0,8)}));
 results.push({id:p.id,viewport:name,...metrics});await page.screenshot({path:path.join(root,'capturas',name,p.id+'.png'),fullPage:true});
 }
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(local('L1'));await page.locator('.mobile-toggle').click();const menuOpen=await page.locator('#site-menu').isVisible();await page.screenshot({path:path.join(root,'capturas/movil/L1-menu.png'),fullPage:true});await page.keyboard.press('Escape');const menuClose=await page.locator('#site-menu').isHidden();
await page.goto(local('L2'));await page.locator('[data-query]').fill('pipila');const filter=await page.locator('.catalog-items>article:visible').count()===1;await page.locator('[data-query]').fill('zzzzzz');const empty=await page.locator('.empty-state').isVisible();await page.locator('[data-reset]').click();const reset=await page.locator('.catalog-items>article:visible').count()===6;
await page.setViewportSize({width:1440,height:900});await page.goto(local('L1'));await page.locator('[data-zones]').check();await page.screenshot({path:path.join(root,'capturas/escritorio/L1-zonas.png'),fullPage:true});
const broken=[];
for(const p of manifest){await page.goto(local(p.id));const links=await page.locator('a[href]').evaluateAll(a=>a.map(e=>e.getAttribute('href')));for(const href of links){if(/^(https?:|mailto:)/.test(href))continue;const [file,hash]=href.split('#');const target=file?new URL(file,page.url()):new URL(page.url());try{const content=await readFile(fileURLToPath(target),'utf8');if(hash&&!content.includes('id="'+hash+'"'))broken.push({page:p.id,href,reason:'ancla'});}catch{broken.push({page:p.id,href,reason:'archivo'});}}}
const report={pages:manifest.length,captures:22,errors,overflow:results.filter(r=>r.scrollWidth>r.width||r.overflow.length),semantics:results.filter(r=>r.h1!==1||r.main!==1),links:broken,interactions:{menuOpen,menuClose,filter,empty,reset},checks:results,scope:'Comprobaciones locales de propuesta; no acreditan accesibilidad completa ni producción.'};await writeFile(path.join(root,'verificacion.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,checks:undefined}));await browser.close();
