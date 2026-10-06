import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
async function ready(page:Page){await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');await expect(page.locator('[data-search-retry]')).toBeHidden();}
const results='[data-search-results]';
test('full body search, type and topic filters, shareable URL, history and clear',async({page},info)=>{
 await page.goto('/es/explorar/?q=DBASE');await ready(page);
 await expect(page.locator(`${results} a[href="/es/proyectos/onix/"]`)).toBeVisible();
 await page.locator('#page-query').fill('');await page.locator('#search-type').selectOption('project');await ready(page);
 await page.locator('#search-topic').selectOption('memoria-y-contexto-de-agentes');await ready(page);
 await expect(page.locator(`${results} li`)).toHaveCount(2);
 await expect(page.locator(`${results} a[href="/es/proyectos/loro/"]`)).toBeVisible();await expect(page.locator(`${results} a[href="/es/proyectos/perico/"]`)).toBeVisible();
 expect(new URL(page.url()).searchParams.get('topic')).toBe('memoria-y-contexto-de-agentes');
 await page.reload();await ready(page);await expect(page.locator('#search-type')).toHaveValue('project');await expect(page.locator(`${results} li`)).toHaveCount(2);
 const dir=`ai_reference/implementacion/PT09/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${dir}/filtros.png`,fullPage:true});
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.locator('[data-search-clear]').click();await ready(page);await expect(page.locator(`${results} li`)).toHaveCount(335);await expect(page.locator('#page-query')).toBeFocused();
 await page.goBack();await ready(page);await expect(page.locator('#search-topic')).toHaveValue('memoria-y-contexto-de-agentes');await expect(page.locator(`${results} li`)).toHaveCount(2);
 await page.goto('/es/explorar/?q=Francisco');await ready(page);await expect(page.locator(`${results} a[href="/es/sobre-mi/"]`)).toBeVisible();
});
test('zero results, unknown filters, hostile query and keyboard access',async({page})=>{
 await page.goto('/es/explorar/?q=zzzxqvnonexistentword');await ready(page);await expect(page.locator('[data-search-status]')).toHaveText('No se encontraron resultados.');await expect(page.locator(`${results} li`)).toHaveCount(0);
 await page.goto('/es/explorar/?type=__proto__&topic=javascript%3Aalert(1)');await ready(page);await expect(page.locator('[data-search-warning]')).toContainText('no son válidos');await expect(page.locator('#search-topic')).toHaveValue('');
 await page.locator('#page-query').fill('<img src=x onerror="window.bad=true">');await page.locator('#page-query').press('Enter');await ready(page);
 expect(await page.evaluate(()=>Object.hasOwn(window,'bad'))).toBe(false);await expect(page.locator('[data-search-page] img')).toHaveCount(0);
 await page.locator('[data-search-clear]').focus();await page.keyboard.press('Enter');await ready(page);await expect(page.locator('#page-query')).toBeFocused();
 await page.locator('#page-query').fill('Pipila');await page.keyboard.press('Enter');await ready(page);await page.locator(`${results} a[href="/es/proyectos/pipila/"]`).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/es\/proyectos\/pipila\/$/);
});
test('failed index keeps HTML links and retry recovers with filters intact',async({page})=>{
 await page.route('**/pagefind/**',route=>route.abort());
 await page.goto('/es/explorar/?q=DBASE&type=project');
 await expect(page.locator('[data-search-retry]')).toBeVisible();await expect(page.locator('[data-search-fallback]')).toBeVisible();await expect(page.locator(`${results}`)).toBeHidden();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.unroute('**/pagefind/**');await page.locator('[data-search-retry]').click();await ready(page);await expect(page.locator('#search-type')).toHaveValue('project');await expect(page.locator(`${results} a[href="/es/proyectos/onix/"]`)).toBeVisible();
});
test('late searches cannot replace a newer query or filters',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);
 await page.route('**/pagefind/**',async route=>{await gate;await route.continue();});
 await page.goto('/es/explorar/?q=DBASE');await expect(page.locator('[data-search-status]')).toHaveText('Buscando…');
 await page.locator('#page-query').fill('zzzxqvnonexistentword');await page.locator('#page-query').press('Enter');release();await ready(page);await expect(page.locator('[data-search-status]')).toHaveText('No se encontraron resultados.');
});
test('index loads only when searching, requests stay local, and 320px zoom fits',async({page})=>{
 const external:string[]=[],indexed:string[]=[];page.on('request',request=>{const u=new URL(request.url());if(u.hostname!=='127.0.0.1')external.push(u.href);if(u.pathname.includes('/pagefind/'))indexed.push(u.pathname);});
 await page.goto('/es/');await page.locator('[data-search-open]').click();await expect(page.locator('#search-panel')).toBeVisible();expect(indexed).toEqual([]);
 await page.locator('#global-query').fill('DBASE');await page.locator('#global-query').press('Enter');await ready(page);expect(indexed.some(path=>path.includes('wasm'))).toBe(true);expect(external).toEqual([]);
 await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('editorial topics connect to content and filtered exploration',async({page},info)=>{
 const topics=['resolucion-de-problemas','memoria-y-contexto-de-agentes','creacion-editorial','inteligencia-y-humanidad'];
 for(const topic of topics){
  await page.goto(`/es/temas/${topic}/`);
  const explore=page.locator(`main a[href="/es/explorar/?topic=${topic}"]`);
  await expect(explore).toBeVisible();await explore.click();await ready(page);
  await expect(page.locator('#search-topic')).toHaveValue(topic);
  expect(await page.locator(`${results} li`).count()).toBeGreaterThan(1);
 }
 await page.goto('/es/temas/');await page.evaluate(()=>document.fonts.ready);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 const dir=`ai_reference/implementacion/PT09/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/temas.png`,fullPage:true});
});
