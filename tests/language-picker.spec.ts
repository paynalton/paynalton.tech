import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
test('language picker exposes only Spanish and English with honest availability',async({page},info)=>{
 await page.goto('/es/');const picker=page.locator('.language-picker');
 await picker.locator('summary').click();await expect(picker.locator('a[hreflang=es]')).toHaveAttribute('aria-current','page');
 await expect(picker.locator('[aria-disabled=true]')).toContainText('English');
 await expect(picker.locator('[aria-disabled=true]')).toContainText('Traducción pendiente');
 await expect(picker.locator('a[hreflang=en]')).toHaveCount(0);
 expect((await new AxeBuilder({page}).include('.language-picker').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 const dir=`ai_reference/implementacion/PT12/selector-idioma/${info.project.name}`;await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/selector.png`});
 await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await picker.locator('summary').focus();await page.keyboard.press('Enter');await expect(picker).not.toHaveAttribute('open');
});
test('the actual translated book supports round-trip navigation without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const page=await context.newPage();await page.goto(`${baseURL}/es/books/cuando-la-tostadora-te-responde/`);
  await page.locator('.language-picker summary').click();await page.locator('.language-picker a[hreflang=en]').click();
  await expect(page).toHaveURL(/\/en\/books\/cuando-la-tostadora-te-responde\/$/);await expect(page.locator('html')).toHaveAttribute('lang','en');
  await page.locator('.language-picker summary').click();await expect(page.locator('.language-picker a')).toHaveCount(2);
  await page.locator('.language-picker a[hreflang=es]').click();await expect(page).toHaveURL(/\/es\/books\/cuando-la-tostadora-te-responde\/$/);
 }finally{await context.close();}
});
