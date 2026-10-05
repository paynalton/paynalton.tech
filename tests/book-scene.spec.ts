import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
test.use({reducedMotion:'no-preference',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--enable-unsafe-swiftshader']}});
const locations=[['/es/obra/','#biblioteca-libros .tn-card','tarjeta'],['/es/books/cuando-la-tostadora-te-responde/','.work-book-header','ficha']];
test('recognizable book renders in card and ficha and retains its fallback',async({page},info)=>{
 const dir=`ai_reference/implementacion/PT12/libro-3d/${info.project.name}`;await mkdir(dir,{recursive:true});
 for(const [url,selector,name] of locations){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(url);const host=page.locator(`${selector} [data-workshop=book]`);
  await host.scrollIntoViewIfNeeded();await expect(host).toHaveAttribute('data-scene','ready');await expect(host).toHaveAttribute('data-pointer-settled','true');
  expect(Number(await host.getAttribute('data-calls'))).toBeLessThanOrEqual(30);
  await page.locator(selector).screenshot({path:`${dir}/${name}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await expect(host.locator('canvas')).toHaveCount(0);
  await expect(host.locator('img')).toHaveAttribute('src','/taller/workshop/book-640.webp');await expect(host.locator('img')).toBeVisible();
 }
});
test('book picture survives without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const page=await context.newPage();for(const [url,selector] of locations){
  await page.goto(`${baseURL}${url}`);const image=page.locator(`${selector} [data-workshop=book] img`);await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('src','/taller/workshop/book-640.webp');await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }}finally{await context.close();}
});
