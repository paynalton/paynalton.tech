import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const book='/es/books/cuando-la-tostadora-te-responde/';
test('public library, book and personal profile are accessible and contain only selected content',async({page},info)=>{
 const dir=`ai_reference/implementacion/PT08/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
 for(const [path,name] of [['/es/obra/','biblioteca'],[book,'libro'],['/es/sobre-mi/','sobre-mi']]){
  expect((await page.goto(path))?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paynalton.tech'+path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await expect(page.locator('main')).not.toContainText('Ejemplo de desarrollo');
  await expect(page.locator('main')).not.toContainText('Nota editorial');
  await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});
 }
 await page.goto('/es/obra/');await expect(page.locator('[data-work-catalog] .tn-card')).toHaveCount(111);await page.locator(`[data-work-catalog] a[href="${book}"]`).click();await expect(page).toHaveURL(new RegExp(book+'$'));
 await expect(page.getByRole('link',{name:'Comenzar lectura'})).toHaveCount(0);
 await expect(page.locator('.shell-locales a')).toHaveCount(2);
 for(const locale of ['en','nah'])expect((await page.request.get(`/${locale}/books/cuando-la-tostadora-te-responde/`)).status()).toBe(200);
 await expect(page.locator('main a[href="/es/proyectos/guacamaya/"]')).toBeVisible();
 await page.goto('/es/sobre-mi/');await expect(page.locator('.method-list li')).toHaveCount(6);await expect(page.locator('#lecturas article')).toHaveCount(4);
 await expect(page.locator('iframe')).toHaveCount(0);
});
test('book ficha reserves the right column for its WebGL scene',async({page})=>{
 await page.goto(book);const scene=page.locator('.work-book-header [data-workshop="book"]');await expect(scene).toHaveCount(1);
 await expect.poll(async()=>await scene.locator('canvas').count()+await scene.locator('img:visible').count()).toBeGreaterThan(0);
 await expect(page.locator('.work-book-header')).toHaveCSS('display','grid');
});
test('book library card reserves the right column for the same scene',async({page})=>{
 await page.goto('/es/obra/');const card=page.locator('#biblioteca-libros>div>article').first();
 await expect(card).toHaveClass(/tn-card--book/);await expect(card.locator('[data-workshop="book"]')).toHaveCount(1);
 await expect(card.locator('[data-workshop="book"] canvas, [data-workshop="book"] img')).toHaveCount(1);
});
test('all book editions remain reachable without scripts and with enlarged text',async({browser,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const p=await context.newPage();await p.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}`+book);await p.locator('.all-downloads summary').click();await expect(p.locator('.all-downloads a')).toHaveCount(6);for(const a of await p.locator('.all-downloads a').all()){await expect(a).toBeVisible();expect((await p.request.head((await a.getAttribute('href'))!)).status()).toBe(200);}await expect(p.locator('[data-enhanced-downloads]')).toBeHidden();}finally{await context.close();}
 await page.setViewportSize({width:320,height:800});
 for(const path of ['/es/obra/',book,'/es/sobre-mi/']){await page.goto(path);await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}
});
