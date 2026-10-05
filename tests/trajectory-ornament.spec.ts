import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
test.use({reducedMotion:'no-preference'});
test('vertical ornament follows reading in both directions without covering content',async({page,isMobile},info)=>{
 test.skip(isMobile,'The reading rail is only used when there is room beside the text.');
 await page.goto('/es/trayectoria/');const ornament=page.locator('[data-reading-ornament]');
 const dimensions=await page.locator('.trajectory-layout').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.getBoundingClientRect().height}));
 await page.evaluate(top=>scrollTo(0,top),dimensions.top);
 await expect(ornament).toBeVisible();await expect(ornament).toHaveAttribute('data-progress',/\d/);
 const initial=Number(await ornament.getAttribute('data-progress'));
 await page.evaluate(({top,height})=>scrollTo(0,top+height*.5),dimensions);
 await expect.poll(async()=>Number(await ornament.getAttribute('data-progress'))).toBeGreaterThan(.5);
 const middle=Number(await ornament.getAttribute('data-progress'));
 const rail=(await ornament.boundingBox())!,text=(await page.locator('.professional-trajectory').boundingBox())!;
 expect(rail.y).toBeGreaterThanOrEqual(30);expect(rail.y).toBeLessThan(40);expect(text.x+text.width).toBeLessThan(rail.x);
 const dir=`ai_reference/implementacion/PT12/greca-trayectoria/${info.project.name}`;await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/mitad.png`});
 await page.evaluate(({top,height})=>scrollTo(0,top+height*.85),dimensions);
 await expect.poll(async()=>Number(await ornament.getAttribute('data-progress'))).toBeGreaterThan(.85);
 await page.evaluate(top=>scrollTo(0,top),dimensions.top);
 await expect.poll(async()=>Number(await ornament.getAttribute('data-progress'))).toBeLessThan(middle-.2);
 expect(initial).toBeLessThan(.2);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(ornament).not.toHaveAttribute('data-progress',/\d/);
 expect(await ornament.locator('[data-reading-trace]').evaluate(el=>(el as SVGElement).style.strokeDashoffset)).toBe('');
 await page.emulateMedia({media:'print'});await expect(ornament).toBeHidden();
});
test('narrow reading and disabled effects keep all stages usable',async({page,isMobile})=>{
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'off'})));
 await page.goto('/es/trayectoria/');const ornament=page.locator('[data-reading-ornament]');
 await expect(page.locator('[data-experience]')).toHaveCount(11);await expect(ornament).not.toHaveAttribute('data-progress',/\d/);
 if(!isMobile){await ornament.scrollIntoViewIfNeeded();await expect(ornament).toBeVisible();}
 await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html{font-size:200%}'});
 await expect(ornament).toBeHidden();await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.locator('[data-experience] details').first().locator('summary').click();
 await expect(page.locator('[data-experience] details').first()).not.toHaveAttribute('open','');
});
test('the complete ornament and chronology remain available without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});
 try{const page=await context.newPage();await page.goto(`${baseURL}/es/trayectoria/`);const ornament=page.locator('[data-reading-ornament]');
 await ornament.scrollIntoViewIfNeeded();await expect(ornament).toBeVisible();await expect(ornament).toHaveAttribute('aria-hidden','true');
 await expect(page.locator('[data-experience]')).toHaveCount(11);expect(await ornament.locator('[data-reading-trace]').getAttribute('style')).toBeNull();
 }finally{await context.close();}
});

test('vertical gold particles are bounded and follow visibility and preferences',async({page,isMobile},info)=>{
 await page.goto('/es/trayectoria/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const host=page.locator('[data-reading-ornament]'),motes=host.locator('[data-reading-particles] > g');
 if(isMobile){await expect(motes).toHaveCount(0);return;}
 await host.scrollIntoViewIfNeeded();await expect(motes).toHaveCount(24);
 await expect(host.locator('[data-reading-particles] circle')).toHaveCount(48);
 const dir=`ai_reference/implementacion/PT12/greca-trayectoria/${info.project.name}`;await mkdir(dir,{recursive:true});
 await page.screenshot({path:`${dir}/particulas.png`});
 await page.locator('.shell-footer').scrollIntoViewIfNeeded();await expect(motes).toHaveCount(0);
 await host.scrollIntoViewIfNeeded();await expect(motes).toHaveCount(24);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(motes).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(motes).toHaveCount(24);
 await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('soft');
 await host.scrollIntoViewIfNeeded();await expect(motes).toHaveCount(0);
});
