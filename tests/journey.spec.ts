import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
const project='/es/proyectos/pipila/';
async function keyboardActivate(page:Page, selector:string) {
 const target=page.locator(selector); await target.focus(); await expect(target).toBeFocused();
 await page.keyboard.press('Enter');
}

test('complete reference journey by keyboard, with accessible steps and captures',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const dir=`ai_reference/implementacion/PT06/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
 await page.goto('/es/');
 await keyboardActivate(page,`main a[href="${project}"]`);
 await expect(page.locator('h1')).toHaveText('Pipila');
 await expect(page.locator('[data-fact=role]')).toContainText('único desarrollador');
 for(const [name,path] of [['caso',project],['termino','/es/temas/integracion-de-sistemas/'],['contacto','/es/contacto/']]) {
  await expect(page).toHaveURL(new RegExp(path+'$'));
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});
  if(name==='caso')await keyboardActivate(page,'main a[href="/es/temas/integracion-de-sistemas/"]');
  if(name==='termino')await keyboardActivate(page,'[data-journey-contact] a');
 }
 await expect(page.locator('main a[href="mailto:cxescalona@gmail.com"]')).toBeVisible();
 expect(errors).toEqual([]);
});

test('built HTML, JSON and Markdown describe identical public facts and body',async({page,request})=>{
 await page.goto(project);
 const jsonResponse=await request.get(project+'index.json');expect(jsonResponse.status()).toBe(200);
 const doc=await jsonResponse.json();
 const mdResponse=await request.get(project+'index.md');expect(mdResponse.status()).toBe(200);
 const md=await mdResponse.text();
 await expect(page.locator('h1')).toHaveText(doc.title);
 await expect(page.locator('[data-entry-summary]')).toHaveText(doc.summary);
 for(const key of ['role','operationalStatus','startLabel'])await expect(page.locator(`[data-fact=${key}]`)).toHaveText(doc[key]);
 await expect(page.locator('[data-fact=technologies]')).toHaveText(doc.technologies.join(', '));
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',doc.canonical);
 for(const paragraph of doc.body.split(/\n\s*\n/))expect(md).toContain(paragraph.trim());
 const rendered=await page.locator('[data-entry-body]').innerText();
 const normalize=(value:string)=>value.replace(/^##\s+/gm,'').replace(/\s+/g,' ').trim();
 expect(normalize(rendered)).toBe(normalize(doc.body));
 for(const key of ['title','summary','role','operationalStatus','startLabel','canonical'])expect(md).toContain(doc[key]);
 for(const relation of doc.relations){const url=new URL(relation.url);await expect(page.locator(`main a[href="${url.pathname+url.hash}"]`)).toHaveText(relation.title);expect(md).toContain(relation.url);}
 for(const format of ['json','md'])await expect(page.locator(`a[href="${project}index.${format}"]`)).toHaveAttribute('download','');
 expect(Object.keys(doc).sort()).toEqual(['schemaVersion','id','language','canonical','title','summary','role','operationalStatus','startLabel','technologies','body','relations'].sort());
});

test('journey and downloads remain available without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
 try{const page=await context.newPage();await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/es/`);
 await page.locator(`main a[href="${project}"]`).click();
 await expect(page.locator(`a[href="${project}index.md"]`)).toBeVisible();
 await page.locator('main a[href="/es/temas/integracion-de-sistemas/"]').click();
 await page.locator('[data-journey-contact] a').click();
 await expect(page.locator('main a[href^="mailto:"]')).toHaveText('cxescalona@gmail.com');
 }finally{await context.close();}
});

test('hostile URLs never alter canonical, exports or execute HTML',async({page,request})=>{
 const malicious='<img src=x onerror="window.compromised=true">';
 await page.goto(`${project}?next=${encodeURIComponent('https://evil.example/')}&q=${encodeURIComponent(malicious)}`);
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paynalton.tech'+project);
 expect(await page.evaluate(()=>Object.hasOwn(window,'compromised'))).toBe(false);
 // The project header now includes a legitimate static scene image.
 await expect(page.locator('main img[src="x"], main [onerror]')).toHaveCount(0);
 for(const path of ['/es/proyectos/no-publicado/index.json','/es/obra/ejemplo-lectura/index.md','/design-review/journey/en/'])expect((await request.get(path)).status()).toBe(404);
 expect(await (await request.get(project+'index.json?origin=https://evil.example')).json()).toHaveProperty('canonical','https://paynalton.tech'+project);
});
