import {test,expect} from '@playwright/test';
import {readdir,readFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {parse,walkSync} from 'ultrahtml';
import {isExternalLink} from '../src/lib/site/external-links.mjs';
test.use({reducedMotion:'no-preference'});

test('all static HTML outbound links have an icon, new tab and safe rel',async()=>{
 const problems:string[]=[];let count=0;
 async function visit(dir:string){for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=join(dir,entry.name);if(entry.isDirectory()){await visit(file);continue;}if(!file.endsWith('.html'))continue;
  walkSync(parse(await readFile(file,'utf8')),node=>{
   if(node.name!=='a'||!node.attributes.href||!isExternalLink(node.attributes.href,'https://paynalton.tech'))return;
   count++;if(node.attributes.target!=='_blank'||!['noopener','noreferrer'].every(rel=>node.attributes.rel?.split(' ').includes(rel))||!node.attributes['aria-description']||!node.children.some((n:any)=>n.attributes?.class==='external-link-icon'))problems.push(file+': '+node.attributes.href);
  });
 }}
 await visit('dist');expect(count).toBeGreaterThan(100);expect(problems).toEqual([]);
});

test('search exits smoothly by button, Escape and outside; focus returns',async({page})=>{
 await page.goto('/es/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const open=page.locator('[data-search-open]'),dialog=page.locator('#search-panel');
 for(const method of ['button','escape','outside']){
  await open.click();await expect(dialog).toBeVisible();
  if(method==='button')await page.locator('[data-dialog-close]').click();
  if(method==='escape')await page.keyboard.press('Escape');
  if(method==='outside')await page.mouse.click(2,2);
  await expect(dialog).toHaveAttribute('data-closing','true');
  const duration=await dialog.evaluate(el=>Math.max(...el.getAnimations().map(a=>Number(a.effect?.getTiming().duration))));expect(duration).toBe(805);
  await expect(dialog).toBeHidden();await expect(open).toBeFocused();
 }
 // Changing the motion preference during closing also releases the modal.
 await open.click();await page.keyboard.press('Escape');await page.emulateMedia({reducedMotion:'reduce'});
 await expect(dialog).toBeHidden();await expect(open).toBeFocused();
 await open.click();await page.keyboard.press('Escape');await expect(dialog).toBeHidden();
 expect(await dialog.evaluate(el=>el.getAnimations().length)).toBe(0);
});

test('brand draws on initial load and external links work without JavaScript',async({page,browser},info)=>{
 await page.goto('/es/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const brand=page.locator('.shell-header .tn-brand');
 expect(await brand.locator('path').evaluate(el=>el.getAnimations().some(a=>Number(a.effect?.getTiming().duration)===72000))).toBe(true);
 expect(await brand.locator('svg').evaluate(el=>el.getAnimations().some(a=>Number(a.effect?.getTiming().duration)===57000))).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 const reducedBrand=page.locator('.shell-header .tn-brand');expect(await reducedBrand.locator('path').evaluate(el=>el.getAnimations().length)).toBe(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();
 await page.locator('.shell-footer-mark').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.shell-footer-mark .tn-ornament--rule path').evaluate(el=>el.getAnimations().some(a=>Number(a.effect?.getTiming().duration)===140000))).toBe(true);
 const dir=`ai_reference/implementacion/PT12/afinacion-home/enlaces/${info.project.name}`;await mkdir(dir,{recursive:true});
 await page.screenshot({path:`${dir}/cabecera.png`});await page.locator('.shell-footer').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/footer.png`});
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  await context.route('https://github.com/**',route=>route.fulfill({body:'External destination fixture',contentType:'text/html'}));
  const tab=await context.newPage();await tab.goto(page.url());
  const link=tab.locator('.shell-profiles a[href*="github.com"]');await expect(link.locator('.external-link-icon')).toBeVisible();
  const popupPromise=context.waitForEvent('page');await link.click();const popup=await popupPromise;await popup.waitForLoadState();
  expect(popup.url()).toContain('github.com');expect(await popup.evaluate(()=>window.opener===null)).toBe(true);expect(tab.url()).toContain('/es/');
 }finally{await context.close();}
});
