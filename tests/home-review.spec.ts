import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
test.use({reducedMotion:'no-preference',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--enable-unsafe-swiftshader']}});
test('section headers have distinct live scenes and matching static fallbacks',async({page},info)=>{
 const viewport=page.viewportSize()!;
 const sections=[['proyectos','projects'],['trayectoria','career'],['obra','works'],['sobre-mi','about'],['contacto','contact']];
 const directory=`ai_reference/implementacion/PT12/escenas-secciones/${info.project.name}`;await mkdir(directory,{recursive:true});
 for(const [path,variant] of sections){
  await page.setViewportSize(viewport);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`/es/${path}/`);const scene=page.locator('.tn-page-hero [data-workshop]');
  await expect(page.locator('main h1')).toHaveCount(1);
  const intro=await page.locator('.tn-page-hero p.shell-prose').textContent();
  expect(await page.locator('main p').evaluateAll((nodes,text)=>nodes.filter(node=>node.textContent===text).length,intro)).toBe(1);
  await expect(scene).toHaveCount(1);await expect(scene).toHaveAttribute('data-workshop',variant);
  await scene.scrollIntoViewIfNeeded();await expect(scene).toHaveAttribute('data-scene','ready');
  await expect(scene).toHaveAttribute('data-pointer-settled','true');
  expect(Number(await scene.getAttribute('data-calls'))).toBeLessThanOrEqual(30);
  await page.screenshot({path:`${directory}/${variant}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await expect(scene.locator('canvas')).toHaveCount(0);
  await expect(scene.locator('img')).toBeVisible();await expect(scene.locator('img')).toHaveAttribute('src',`/taller/workshop/${variant}-640.webp`);
  expect(await scene.locator('img').evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.setViewportSize({width:320,height:800});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('section header images work without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const page=await context.newPage();for(const slug of ['proyectos','trayectoria','obra','sobre-mi','contacto']){
  await page.goto(`${baseURL}/es/${slug}/`);const image=page.locator('.tn-page-hero img');await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();await expect.poll(()=>image.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('canvas')).toHaveCount(0);
 }}finally{await context.close();}
});
test('all four sculptures load on demand, release offscreen and respect reduced motion',async({page},info)=>{
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'full'})));
 await page.goto('/es/');await expect(page.locator('[data-workshop]')).toHaveCount(4);
 const directory=`ai_reference/implementacion/PT12/afinacion-home/capturas/${info.project.name}`;await mkdir(directory,{recursive:true});
 for(const variant of ['hero','experience','skills','method']){
  const host=page.locator(`[data-workshop="${variant}"]`);await host.scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute('data-scene','ready');await expect(host).toHaveAttribute('data-pointer-settled','true');
  expect(Number(await host.getAttribute('data-calls'))).toBeLessThanOrEqual(30);
  if(info.project.name==='desktop'){
   const box=(await host.locator('..').boundingBox())!;
   await page.mouse.move(box.x+box.width*.96,box.y+box.height*.55);
   await expect.poll(async()=>Number(await host.getAttribute('data-yaw'))).toBeGreaterThan(.3);
   await expect(host).toHaveAttribute('data-pointer-settled','true');
  }
  await page.screenshot({path:`${directory}/${variant}.png`});
 }
 await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('[data-workshop] canvas')).toHaveCount(0);
 for(const variant of ['hero','experience','skills','method'])expect(await page.locator(`[data-workshop="${variant}"] img`).evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await page.locator('.home-contact').scrollIntoViewIfNeeded();await page.screenshot({path:`${directory}/cta.png`});
 await page.locator('.shell-footer').scrollIntoViewIfNeeded();await page.screenshot({path:`${directory}/footer.png`});
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
});
test('project and work card corners follow their real link and retain one tab stop',async({page})=>{
 for(const group of [0,1]){
  await page.goto('/es/');const card=page.locator('main .tn-cards').nth(group).locator('.tn-card').first();
  const href=await card.locator('a').getAttribute('href');await expect(card.locator('a')).toHaveCount(1);
  await card.scrollIntoViewIfNeeded();await card.click({position:{x:10,y:10}});await expect(page).toHaveURL(new RegExp(href+'$'));
 }
});
test('home reflows at 320 pixels and 200 percent text',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:800});await page.goto('/es/');await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.home-contact a')).toBeVisible();
});

test('hover and menu transitions have visible duration and nonlinear easing',async({page,isMobile})=>{
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'full'})));
 await page.goto('/es/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const card=page.locator('main .tn-card').first();
 const style=await card.evaluate(el=>({duration:getComputedStyle(el).transitionDuration,easing:getComputedStyle(el).transitionTimingFunction}));
 expect(parseFloat(style.duration)).toBeGreaterThanOrEqual(.35);expect(style.easing).toContain('cubic-bezier');
 const cardTransitionDurations=async()=>card.evaluate(el=>getComputedStyle(el).transitionDuration.split(', '));
 expect(await cardTransitionDurations()).toEqual(['0.84s','0.84s','0.84s','0.84s']);
 const link=page.locator('.shell-navigation a').first();
 const linkTransitionDurations=async()=>link.evaluate(el=>getComputedStyle(el).transitionDuration.split(', '));
 expect(await linkTransitionDurations()).toEqual(['0.84s','0.84s','0.84s']);
 const action=page.locator('main .tn-action').first();
 const transitionDurations=async()=>action.evaluate(el=>getComputedStyle(el).transitionDuration.split(', '));
 expect(await transitionDurations()).toEqual(['0.84s','0.84s','0.84s','0.84s']);
 if(!isMobile){
  await card.hover();expect(await cardTransitionDurations()).toEqual(['0.42s']);
  await link.hover();expect(await linkTransitionDurations()).toEqual(['0.42s']);
  await action.hover();expect(await transitionDurations()).toEqual(['0.42s']);
 }
 if(isMobile){
  await page.locator('[data-menu-toggle]').click();
  const menu=page.locator('#site-navigation');
  await expect.poll(()=>menu.evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
  const timing=await menu.evaluate(el=>el.getAnimations()[0].effect!.getTiming());
  expect(Number(timing.duration)).toBeGreaterThanOrEqual(400);expect(timing.easing).toContain('cubic-bezier');
 }else{
  const link=page.locator('.shell-navigation a').first();const initial=await link.evaluate(el=>getComputedStyle(el).color);
  await link.hover();await expect.poll(()=>link.evaluate(el=>getComputedStyle(el).color)).not.toBe(initial);
 }
});
