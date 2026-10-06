import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { mkdir, readdir } from 'node:fs/promises';

test('complete catalog, chronology, printable details and review captures',async({page},info)=>{
 await page.goto('/es/proyectos/');
 await expect(page.locator('[data-presentation=case] .tn-card')).toHaveCount(4);
 await expect(page.locator('[data-presentation=brief] .tn-card')).toHaveCount(8);
 const dir=`ai_reference/implementacion/PT07/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
 for(const [path,name] of [['/es/proyectos/','proyectos'],['/es/trayectoria/','trayectoria'],['/es/contacto/','contacto'],['/es/proyectos/delta-commerce/','delta-commerce']]){
  expect((await page.goto(path))?.status()).toBe(200);
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});
 }
 await page.goto('/es/trayectoria/');
 await expect(page.locator('.tn-page-hero [data-download-trajectory]')).toBeVisible();
 await expect(page.locator('[data-download-trajectory]')).toHaveCount(1);
 await expect(page.locator('.tn-page-hero [data-workshop=career]')).toHaveCount(1);
 await expect(page.locator('[data-experience]')).toHaveCount(11);
 await page.locator('[data-experience] details').first().evaluate(e=>e.removeAttribute('open'));
 await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
 await expect(page.locator('[data-experience] details[open]')).toHaveCount(11);
 await page.emulateMedia({media:'print'});
 await expect(page.locator('[data-download-trajectory]')).toBeHidden();
 await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
 await expect(page.locator('[data-experience] details[open]')).toHaveCount(10);
});

test('copy succeeds and permission denial leaves selectable email',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(value:string)=>{document.documentElement.dataset.copied=value;}}}));
 await page.goto('/es/contacto/');
 await expect(page.locator('.tn-page-hero [data-contact-actions]')).toHaveCount(1);
 await expect(page.locator('[data-contact-actions]')).toHaveCount(1);
 await expect(page.locator('.tn-page-hero a[href*=linkedin]')).toHaveAttribute('target','_blank');
 await expect(page.locator('.tn-page-hero [data-workshop=contact]')).toHaveCount(1);
 await page.locator('[data-copy]').click();
 await expect(page.locator('html')).toHaveAttribute('data-copied','cxescalona@gmail.com');
 await expect(page.locator('[data-contact-status]')).toContainText('copiado');
 await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{value:async()=>{throw new DOMException('Denied','NotAllowedError');}}));
 await page.locator('[data-copy]').click();
 await expect(page.locator('[data-contact-status]')).toContainText('No');
 expect(await page.evaluate(()=>getSelection()?.toString())).toBe('cxescalona@gmail.com');
 await expect(page.locator('main a[href="mailto:cxescalona@gmail.com"]')).toBeVisible();
});

test('native sharing sends canonical URL and handles cancellation and denial',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async(data:ShareData)=>{document.documentElement.dataset.shared=data.url;}}));
 await page.goto('/es/proyectos/pipila/?private=secret');await page.locator('[data-share]').click();
 await expect(page.locator('html')).toHaveAttribute('data-shared','https://paynalton.tech/es/proyectos/pipila/');
 for(const name of ['AbortError','NotAllowedError']){
  await page.evaluate(name=>Object.defineProperty(navigator,'share',{value:async()=>{throw new DOMException('Denied',name);}}),name);
  await page.locator('[data-share]').click();
  await expect(page.locator('[data-contact-status]')).toContainText(name==='AbortError'?'cancel':'No');
  await expect(page.locator('[data-copy]')).toBeEnabled();
 }
});

test('unsupported APIs and no JavaScript retain contact and sharing links',async({page,browser})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{value:undefined});Object.defineProperty(navigator,'clipboard',{value:undefined});});
 await page.goto('/es/proyectos/pipila/');await expect(page.locator('[data-share]')).toBeHidden();
 await page.locator('[data-copy]').click();await expect(page.locator('[data-contact-status]')).toContainText('No');
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const other=await context.newPage();await other.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/es/contacto/`);await expect(other.locator('main a[href^="mailto:"]')).toBeVisible();await expect(other.locator('[data-copy]')).toBeHidden();}finally{await context.close();}
});

test('all built pages load without automatic third-party requests',async({page})=>{
 test.setTimeout(90000);
 const external:string[]=[];
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname!=='127.0.0.1'){external.push(url.href);return route.abort();}return route.continue();});
 const files=await readdir('dist',{recursive:true});
 for(const file of files.filter(f=>f.endsWith('.html') && f!=='404.html')){
  const path='/'+file.replace(/index\.html$/,'');
  expect((await page.goto(path))?.status(),path).toBe(200);
 }
 expect(external).toEqual([]);
});


test('all professional cases expose accessible facts and static downloads',async({page})=>{
 for(const slug of ['pipila','onix','guacamaya','winner','yayauhqui','spellchecker','loro','perico','delta','delta-commerce','k4y','holstein']){
  await page.goto(`/es/proyectos/${slug}/`);
  await expect(page.locator('[data-fact=role]')).not.toBeEmpty();
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),slug).toEqual([]);
  for(const format of ['json','md']) expect((await page.request.get(`/es/proyectos/${slug}/index.${format}`)).status()).toBe(200);
 }
});
