import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const pairs=[['/es/','/en/'],['/es/proyectos/','/en/projects/'],['/es/trayectoria/','/en/experience/'],['/es/obra/','/en/works/'],['/es/sobre-mi/','/en/about/'],['/es/contacto/','/en/contact/'],['/es/explorar/','/en/explore/'],['/es/temas/','/en/topics/'],['/es/proyectos/pipila/','/en/projects/pipila/'],['/es/obra/guia-1/','/en/works/guia-1/']];
test('English pages preserve the shared design, accessibility and equivalent Spanish routes',async({page},info)=>{
 test.setTimeout(90000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [es,en] of pairs){
  expect((await page.goto(en))?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paynalton.tech'+en);
  await expect(page.locator('link[hreflang=es]')).toHaveAttribute('href','https://paynalton.tech'+es);
  await page.locator('.language-picker summary').click();
  await expect(page.locator('.language-picker a[hreflang=es]')).toHaveAttribute('href',es);
  await expect(page.locator('.language-picker a[hreflang=en]')).toHaveAttribute('aria-current','page');
  await page.locator('.language-picker summary').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations,en).toEqual([]);
 }
 const dir=`ai_reference/traduccion-en/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
 await page.goto('/en/');await expect(page.locator('h1')).toHaveText('I develop software, connect ideas and solve problems.');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${dir}/home.png`,fullPage:true});
 await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html{font-size:200%}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('English Pagefind searches translated bodies and returns only English destinations',async({page})=>{
 await page.goto('/en/explore/?q=DBASE');
 await expect(page.locator('[data-search-results] a[href="/en/projects/onix/"]')).toBeVisible();
 expect(await page.locator('[data-search-results] a').evaluateAll(nodes=>nodes.every(n=>n.getAttribute('href')?.startsWith('/en/')))).toBe(true);
 await page.locator('[data-search-clear]').click();await expect(page.locator('[data-search-results] li')).toHaveCount(311);
 await page.locator('[data-search-open]').click();await expect(page.locator('#global-query')).toBeFocused();
});
test('language switching, translated reading and downloads work without JavaScript',async({browser,baseURL,request})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const page=await context.newPage();
  for(const [es,en] of [pairs[0],pairs[8],pairs[9]]){
   await page.goto(baseURL+es);await page.locator('.language-picker summary').click();await page.locator('.language-picker a[hreflang=en]').click();await expect(page).toHaveURL(baseURL+en);
   await page.locator('.language-picker summary').click();await page.locator('.language-picker a[hreflang=es]').click();await expect(page).toHaveURL(baseURL+es);
  }
  for(const path of ['/en/proyectos/pipila/index.json','/en/obra/guia-1/index.md'])expect((await request.get(path)).status()).toBe(404);
  const doc=await (await request.get('/en/works/guia-1/index.json')).json();expect(doc.language).toBe('en');expect(doc.body).toContain('GNU');
  await page.goto(baseURL+'/en/works/guia-1/');await expect(page.locator('[data-reading-body]')).toContainText('GNU');await expect(page.locator('[data-reading-body]')).not.toContainText('Bueno, comencemos');
  const response=await request.get('/en/works/guia-1/index.md');expect(response.status()).toBe(200);expect(await response.text()).toContain('Language: en');
 }finally{await context.close();}
});
