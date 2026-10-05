import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,mkdir} from 'node:fs/promises';
const manifest=JSON.parse(await readFile('ai_reference/implementacion/PT08-C/importacion.json','utf8'));
const work=(id:string)=>manifest.works.find((w:{material:string})=>w.material===id);
test('every imported reader and download is available with inert editorial HTML',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/es/obra/');
 const issues=await page.evaluate(async(works:{url:string}[])=>{
  const errors:string[]=[];
  for(const work of works){
   const response=await fetch(work.url),html=await response.text(),doc=new DOMParser().parseFromString(html,'text/html'),body=doc.querySelector('[data-reading-body]');
   if(response.status!==200||!body||doc.querySelectorAll('h1').length!==1)errors.push(work.url+' reader');
   if(body?.querySelector('script,style,iframe,object,embed,img,svg,form,video,audio'))errors.push(work.url+' active content');
   for(const el of body?.querySelectorAll('*')??[])for(const attr of el.attributes){if(/^on/i.test(attr.name)||(attr.name==='style' && !(el.closest('pre.astro-code') && /^(?:(?:background-color|color):\s*#[a-f0-9]+;\s*|overflow-x:\s*auto;\s*)+$/i.test(attr.value))))errors.push(work.url+' unsafe attribute');}
   const json=await fetch(work.url+'index.json'),md=await fetch(work.url+'index.md');
   if(json.status!==200||md.status!==200)errors.push(work.url+' downloads');
  }
  return errors;
 },manifest.works);
 expect(issues).toEqual([]);
});
test('standalone readers, technical tables and coauthorship fit small screens and pass accessibility checks',async({page},info)=>{
 test.setTimeout(90000);
 for(const id of ['M134','M001','M071','M030','M109']){
  await page.goto(work(id).url);
  await expect(page.locator('[data-reader]')).toHaveCount(1);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations,id).toEqual([]);
  await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);
  const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('main *')].filter(el=>el.getBoundingClientRect().right>innerWidth && !el.closest('table')).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent?.slice(0,70),right:el.getBoundingClientRect().right}))}));
  expect(overflow.scroll,JSON.stringify({id,...overflow})).toBeLessThanOrEqual(overflow.width);
 }
 await page.goto(work('M030').url);await expect(page.locator('main')).toContainText('Paynalton y Paoz');
 await page.goto(work('M109').url);await expect(page.locator('.reading-notice')).toContainText('manuscrito parcial');
 await page.goto(work('M134').url);await page.locator('[data-reader-preferences] summary').click();
 await page.locator('#reading-size').selectOption('large');await page.locator('#reading-surface').selectOption('dark');await page.reload();
 await expect(page.locator('#reading-size')).toHaveValue('large');await expect(page.locator('#reading-surface')).toHaveValue('dark');
 const dir=`ai_reference/implementacion/PT08-C/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});await page.locator('[data-reading-body]').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/lector.png`,fullPage:false});
});
test('new full texts are searchable by body and tags',async({page})=>{
 await page.goto('/es/explorar/?q=estatuilla&type=work&topic=lectura-ciencia-ficcion');
 await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');
 await expect(page.locator(`[data-search-results] a[href="${work('M134').url}"]`)).toBeVisible();
});
test('published story and downloads remain usable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const page=await context.newPage();await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}`+work('M134').url);await expect(page.locator('[data-reading-body]')).toContainText('estatuilla');await expect(page.locator('[data-reader-preferences]')).toBeHidden();await expect(page.getByRole('link',{name:'Descargar Markdown'})).toBeVisible();expect((await page.request.get(new URL('index.md',page.url()).href)).status()).toBe(200);}finally{await context.close();}
});
