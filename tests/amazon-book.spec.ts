import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['es','en'])test(`${locale} Amazon editions and Nahuatl downloads work without scripts`,async({browser,isMobile,page:accessiblePage},info)=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:isMobile?390:1280,height:900}});const page=await context.newPage();
 try{
  await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/${locale}/books/cuando-la-tostadora-te-responde/`);
  await expect(page.locator('[data-amazon-edition]').first()).toHaveAttribute('data-amazon-edition',locale);
  await expect(page.locator('[data-amazon-format]')).toHaveCount(6);
  const panel=page.locator('[data-amazon-edition]').first();
  const mx=panel.locator('[data-amazon-format="kindle"] li a[href*="amazon.com.mx"]');
  await expect(mx).toBeVisible();await expect(mx).toHaveAttribute('target','_blank');await expect(mx.locator('.external-link-icon')).toHaveCount(1);
  await page.locator('.all-downloads summary').click();await expect(page.locator('.all-downloads a')).toHaveCount(2);
  for(const link of await page.locator('.all-downloads a').all()){expect(await link.getAttribute('href')).toContain('-nah.');expect((await page.request.get((await link.getAttribute('href'))!)).status()).toBe(200);}
  for(const language of ['es','en'])for(const format of ['pdf','epub'])expect((await page.request.get(`/books/cuando-la-tostadora-te-responde/cuando-la-tostadora-te-responde-${language}.${format}`)).status()).toBe(404);
  await page.screenshot({path:`/tmp/amazon-book-${locale}-${info.project.name}.png`,fullPage:true});
  await page.setViewportSize({width:320,height:800});await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  await page.evaluate(()=>document.fonts.ready);
  const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.trim().slice(0,70),right:e.getBoundingClientRect().right})));
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{message:JSON.stringify(overflow)}).toBe(true);
 }finally{await context.close();}
 await accessiblePage.goto(`/${locale}/books/cuando-la-tostadora-te-responde/`);
 await expect(accessiblePage.locator('[data-amazon-controls]')).toBeVisible();
 await accessiblePage.locator('[name="amazon-language"][value="es"]').check({force:true});
 await accessiblePage.locator('[name="amazon-format"][value="kindle"]').check({force:true});
 const active=accessiblePage.locator('[data-amazon-format]:visible');
 await expect(active.locator('[data-amazon-buy]')).toHaveAttribute('href','https://www.amazon.com.mx/dp/B0HP2JQ1PZ');
 await accessiblePage.locator('[name="amazon-format"][value="hardcover"]').check({force:true});
 await expect(active.locator('[data-store="MX"], [data-store="JP"]')).toHaveCount(0);
 await expect(active.locator('[data-amazon-buy]')).toHaveAttribute('href','https://www.amazon.com/dp/B0HP29YHJ6');
 await accessiblePage.locator('[name="amazon-language"][value="en"]').check({force:true});
 await expect(active.locator('[data-store="UK"]')).toHaveAttribute('href','https://www.amazon.co.uk/dp/B0HP5N61D4');
 if(isMobile){await active.locator('[data-amazon-country]').selectOption('UK');await expect(active.locator('[data-amazon-buy]')).toHaveAttribute('href','https://www.amazon.co.uk/dp/B0HP5N61D4');}
 await accessiblePage.locator('.book-free').scrollIntoViewIfNeeded();
 await expect.poll(()=>accessiblePage.locator('.book-free>img').evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await accessiblePage.screenshot({path:`/tmp/book-editorial-${locale}-${info.project.name}.png`,fullPage:true});
 const html=await (await accessiblePage.request.get(`/${locale}/books/cuando-la-tostadora-te-responde/`)).text();
 const urls=new Set([...html.matchAll(/href="(https:\/\/www\.amazon\.[^"]+\/dp\/B0[^"]+)"/g)].map(m=>m[1]));
 expect(urls.size).toBe(78);
 await expect(accessiblePage.locator('[data-download-button]')).toContainText(locale==='es'?'Descarga Gratis':'Download for Free');
 await accessiblePage.locator('[data-format-select]').selectOption('epub');
 await expect(accessiblePage.locator('[data-download-button]')).toContainText(locale==='es'?'Descarga Gratis EPUB':'Download for Free EPUB');
 await expect(accessiblePage.locator('[data-download-button]')).toHaveAttribute('href',/nah\.epub$/);
 await accessiblePage.setViewportSize({width:320,height:800});
 await accessiblePage.evaluate(()=>{document.documentElement.style.fontSize='200%';});
 await accessiblePage.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>accessiblePage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page:accessiblePage}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});
