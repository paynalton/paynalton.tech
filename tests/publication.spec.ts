import {test,expect} from '@playwright/test';
import {migrations} from '../src/lib/site/publication.mjs';
test('historical Spanish URLs reach their final content and anchors in static preview',async({page})=>{
 for(const {from,to} of migrations){await page.goto(from);await expect(page).toHaveURL(new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'));await expect(page.locator('h1')).toBeVisible();}
 for(const anchor of ['profile','experience','skills','softskills']){await page.goto('/es/#'+anchor);await expect(page.locator('#'+anchor)).toBeAttached();}
});
test('canonical and social data ignore query input; linked formats are usable',async({page,request})=>{
 await page.goto('/es/obra/mi-querido-arbol/?q=%3Cscript%3Ebad%3C%2Fscript%3E#test');
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paynalton.tech/es/obra/mi-querido-arbol/');
 await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content','https://paynalton.tech/es/obra/mi-querido-arbol/');
 const data=JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
 expect(data['@graph'].find((x:{'@type':string})=>x['@type']==='CreativeWork').author).toEqual([{'@type':'Person',name:'Paynalton'},{'@type':'Person',name:'Paoz'}]);
 for(const link of await page.locator('link[rel=alternate][type]').all())expect((await request.get((await link.getAttribute('href'))!)).status()).toBe(200);
 for(const path of ['/catalog.json','/llms.txt','/robots.txt','/favicon.svg','/favicon.ico','/apple-touch-icon.png','/taller/publication/social-es.png'])expect((await request.get(path)).status()).toBe(200);
});
test('translated book alternatives are reciprocal and legacy pages remain accessible',async({page})=>{
 for(const locale of ['es','en','nah']){
  await page.goto(`/${locale}/books/cuando-la-tostadora-te-responde/`);
  for(const other of ['es','en','nah'])await expect(page.locator(`link[hreflang="${other}"]`)).toHaveAttribute('href',`https://paynalton.tech/${other}/books/cuando-la-tostadora-te-responde/`);
 }
 await page.goto('/nah/about/');await expect(page.locator('html')).toHaveAttribute('lang','nah');
 const response=await page.goto('/missing-pt11-page/');expect(response?.status()).toBe(404);await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex,follow');await expect(page.locator('link[rel=canonical]')).toHaveCount(0);
});
