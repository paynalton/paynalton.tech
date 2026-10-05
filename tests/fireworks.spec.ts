import {test,expect} from '@playwright/test';
test.use({reducedMotion:'no-preference'});
test('reserved fireworks hook covers the viewport, finishes and can replay or cancel',async({page})=>{
 test.setTimeout(45000);
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'soft'})));
 await page.goto('/es/');
 await expect(page.locator('[data-fireworks-test]')).toHaveCount(0);
 await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const fire=()=>page.evaluate(()=>document.dispatchEvent(new Event('site:fireworks'))),canvas=page.locator('[data-fireworks]');
 await fire();await expect(canvas).toHaveCount(1);
 const bounds=await canvas.boundingBox();expect(bounds).toEqual({x:0,y:0,...page.viewportSize()});
 expect(await canvas.evaluate(el=>getComputedStyle(el).pointerEvents)).toBe('none');
 await page.waitForTimeout(700);
 expect(await canvas.evaluate(el=>{
  const c=el as HTMLCanvasElement,data=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;
  return data.some((value,index)=>index%4===3&&value>0);
 })).toBe(true);
 await page.waitForTimeout(5500);await expect(canvas).toHaveCount(1);
 await expect(canvas).toHaveCount(0,{timeout:26000});
 await fire();await expect(canvas).toHaveCount(1);await page.keyboard.press('Escape');await expect(canvas).toHaveCount(0);
 await fire();await page.emulateMedia({reducedMotion:'reduce'});await expect(canvas).toHaveCount(0);
});
test('fireworks have no visible trigger and respect effects off',async({page,browser,baseURL})=>{
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'off'})));
 await page.goto('/es/');await expect(page.locator('[data-fireworks-test]')).toBeHidden();
 await page.evaluate(()=>document.dispatchEvent(new Event('site:fireworks')));await expect(page.locator('[data-fireworks]')).toHaveCount(0);
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const staticPage=await context.newPage();await staticPage.goto(`${baseURL}/es/`);await expect(staticPage.locator('[data-fireworks-test]')).toBeHidden();}finally{await context.close();}
});
