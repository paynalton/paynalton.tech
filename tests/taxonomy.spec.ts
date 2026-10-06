import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['es','en'])test(`${locale} professional evidence works without JavaScript`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 const section=locale==='es'?'proyectos':'projects',terms=locale==='es'?'temas':'topics';
 await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/${locale}/${section}/onix/`);
 await page.locator('[data-fact="technologies"]').getByRole('link',{name:'AWS',exact:true}).click();
 await expect(page).toHaveURL(new RegExp(`/${locale}/${terms}/tecnologia-aws/`));
 await expect(page.locator('h1')).toHaveText('AWS');
 await page.getByRole('link',{name:'Onix',exact:true}).click();
 await expect(page).toHaveURL(new RegExp(`/${locale}/${section}/onix/`));
 const graph=await page.locator('script[type="application/ld+json"]').textContent();
 expect(graph).toContain('https://paynalton.tech/#person');
 await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/${locale}/${terms}/`);
 await expect(page.getByRole('heading',{name:locale==='es'?'Dominios':'Domains',exact:true})).toBeVisible();
 await context.close();
});
test('professional taxonomy remains accessible',async({page})=>{
 await page.goto('/en/topics/tecnologia-aws/');
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});
