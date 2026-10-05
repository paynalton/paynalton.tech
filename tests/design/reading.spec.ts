import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const root='/design-review/reading';
test('library, work, chapter navigation, notes and reader captures',async({page},info)=>{
 await page.goto(root+'/es/obra/');await page.locator('[data-work-catalog] .tn-card-link').click();
 const url=page.url();await expect(page.locator('.reading-notice')).toContainText('No es una obra');
 await expect(page.locator('main')).not.toContainText('Autor: Paynalton');
 await page.getByRole('link',{name:'Comenzar lectura',exact:true}).click();
 await expect(page.locator('[data-reader] h1')).toContainText('Primera parte');
 await expect(page.locator('a[rel=prev]')).toHaveCount(0);
 await page.getByRole('link',{name:'Consultar la nota',exact:true}).click();await expect(page).toHaveURL(/#nota-uno$/);
 await page.getByRole('link',{name:'Volver al texto',exact:true}).click();await expect(page).toHaveURL(/#origen-nota$/);await expect(page.locator('#origen-nota')).toBeFocused();
 const dir=`ai_reference/implementacion/PT08/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
 await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,0);});await page.screenshot({path:`${dir}/lector.png`,fullPage:true});
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.locator('a[rel=next]').click();await expect(page.locator('h1')).toContainText('Segunda parte');
 await expect(page.locator('a[rel=next]')).toHaveCount(0);await expect(page.locator('.shell-locales')).toHaveCount(0);
 await page.locator('a[rel=prev]').click();await page.getByRole('link',{name:'Volver a la ficha',exact:true}).click();await expect(page).toHaveURL(url);
});
test('reader preferences persist, reset, honor blocked storage and keep both surfaces accessible',async({page})=>{
 await page.goto(root+'/es/obra/');await page.locator('[data-work-catalog] .tn-card-link').click();await page.getByRole('link',{name:'Comenzar lectura',exact:true}).click();
 await page.locator('.reader-preferences summary').click();await page.locator('#reading-size').selectOption('larger');await page.locator('#reading-surface').selectOption('dark');
 await expect(page.locator('[data-reader]')).toHaveAttribute('data-reading-size','larger');
 await page.reload();await page.locator('.reader-preferences summary').click();await expect(page.locator('#reading-size')).toHaveValue('larger');await expect(page.locator('#reading-surface')).toHaveValue('dark');
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.locator('[data-reader-reset]').click();await expect(page.locator('#reading-size')).toHaveValue('normal');
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
 await page.reload();await page.locator('.reader-preferences summary').click();await page.locator('#reading-size').selectOption('large');await expect(page.locator('[data-reader-status]')).toContainText('No se pudieron guardar');await expect(page.locator('[data-reader]')).toHaveAttribute('data-reading-size','large');
});
test('chapter translation preserves identity; expanded RTL and 200 percent text fit',async({page})=>{
 await page.goto(root+'/es/obra/');await page.locator('[data-work-catalog] .tn-card-link').click();await page.getByRole('link',{name:'Comenzar lectura',exact:true}).click();
 await page.locator('.shell-locales a[lang=en]').click();await expect(page).toHaveURL(/translated-reading\/translated-chapter\/$/);await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await page.locator('.reader-preferences summary').click();await page.locator('#reading-size').selectOption('larger');
 await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>({fits:document.documentElement.scrollWidth<=innerWidth,overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().left<0 || e.getBoundingClientRect().right>innerWidth).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.slice(0,60)}))}))).toEqual({fits:true,overflow:[]});
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await expect(page.locator('a[rel=next]')).toHaveCount(0);
});
test('reader remains usable without JavaScript and uses only local requests',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const external:string[]=[];
 try{const page=await context.newPage();await page.route('**/*',route=>{if(new URL(route.request().url()).hostname!=='127.0.0.1'){external.push(route.request().url());return route.abort();}return route.continue();});await page.goto('http://127.0.0.1:4322'+root+'/es/obra/');await page.locator('[data-work-catalog] .tn-card-link').click();await page.getByRole('link',{name:'Comenzar lectura',exact:true}).click();await expect(page.locator('[data-reading-body]')).toContainText('Este párrafo es material de prueba');await expect(page.locator('.reader-preferences')).toBeHidden();await page.getByRole('link',{name:'Consultar la nota',exact:true}).click();await expect(page).toHaveURL(/#nota-uno$/);await page.getByRole('link',{name:'Volver al texto',exact:true}).click();await expect(page.locator('#origen-nota')).toBeFocused();await page.locator('a[rel=next]').click();await expect(page.locator('h1')).toContainText('Segunda parte');expect(external).toEqual([]);}finally{await context.close();}
});
