import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
test.use({reducedMotion:'no-preference',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--enable-unsafe-swiftshader']}});
test('visible scenes keep bounded ambient motion and stop offscreen',async({page})=>{
 await page.goto('/es/');const host=page.locator('[data-workshop="hero"]');await host.scrollIntoViewIfNeeded();
 await expect(host).toHaveAttribute('data-scene','ready');await expect(host).toHaveAttribute('data-pointer-settled','true');
 const first=await host.evaluate(el=>({time:performance.now(),frames:Number((el as HTMLElement).dataset.frames),ambient:Number((el as HTMLElement).dataset.ambientSeconds)}));
 await expect.poll(async()=>Number(await host.getAttribute('data-ambient-seconds'))).toBeGreaterThan(first.ambient+1);
 const last=await host.evaluate(el=>({time:performance.now(),frames:Number((el as HTMLElement).dataset.frames)}));
 expect((last.frames-first.frames)/(last.time-first.time)*1000).toBeLessThan(34);
 await page.locator('.shell-footer').scrollIntoViewIfNeeded();await expect(host.locator('canvas')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await host.scrollIntoViewIfNeeded();await expect(host.locator('canvas')).toHaveCount(0);
});
test('gold particles are bounded to one hovered project, preserve links and clean up',async({page,isMobile},info)=>{
 await page.goto('/es/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 const cards=page.locator('main .tn-card');await cards.first().scrollIntoViewIfNeeded();
 if(isMobile){await cards.first().dispatchEvent('pointerenter');await expect(page.locator('.project-particles')).toHaveCount(0);return;}
 await cards.first().hover();await expect(page.locator('.project-particles i')).toHaveCount(24);
 await cards.nth(1).hover();await expect(page.locator('.project-particles')).toHaveCount(1);await expect(cards.first().locator('.project-particles')).toHaveCount(0);
 const dir=`ai_reference/implementacion/PT12/afinacion-home/ambiente/${info.project.name}`;await mkdir(dir,{recursive:true});
 const metrics=await page.evaluate(()=>({particles:document.querySelectorAll('.project-particles i').length,animations:document.querySelector('.project-particles')?.getAnimations({subtree:true}).length,canvas:document.querySelectorAll('canvas').length}));
 await writeFile(`${dir}/particulas.json`,JSON.stringify(metrics,null,2));await page.screenshot({path:`${dir}/particulas.png`});
 await page.mouse.move(0,0);await expect(page.locator('.project-particles')).toHaveCount(0);
 await cards.first().hover();await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.project-particles')).toHaveCount(0);
 const href=await cards.first().locator('a').getAttribute('href');await cards.first().click({position:{x:10,y:10}});await expect(page).toHaveURL(new RegExp(href+'$'));
});
test('footer star particles follow the effects control',async({page})=>{
 await page.goto('/es/');await expect(page.locator('html')).toHaveClass(/fx-decorations/);
 await page.locator('.shell-footer').scrollIntoViewIfNeeded();
 await expect(page.locator('.footer-particles i')).toHaveCount(36);
 await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('off');
 await expect(page.locator('.footer-particles i')).toHaveCount(0);
 await page.locator('#effects-mode').selectOption('full');await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.footer-particles i')).toHaveCount(0);
});

test('shared cards receive particles across home, projects, library and topics',async({page,isMobile})=>{
 for(const [url,selector] of [
  ['/es/','main .tn-cards'],
  ['/es/proyectos/','main .tn-cards'],
  ['/es/obra/','main .tn-cards'],
  ['/es/temas/','main .tn-cards'],
 ]){
  await page.goto(url);await expect(page.locator('html')).toHaveClass(/fx-decorations/);
  const groups=page.locator(selector);
  for(let index=0;index<await groups.count();index++){
   const card=groups.nth(index).locator('.tn-card').first();await card.scrollIntoViewIfNeeded();
   if(isMobile){await card.dispatchEvent('pointerenter');await expect(page.locator('.project-particles')).toHaveCount(0);continue;}
   await card.hover();await expect(card.locator('.project-particles i')).toHaveCount(24);
   await expect(page.locator('.project-particles')).toHaveCount(1);
   expect(await card.locator('.project-particles').evaluate(el=>getComputedStyle(el).pointerEvents)).toBe('none');
   await page.mouse.move(0,0);await expect(page.locator('.project-particles')).toHaveCount(0);
  }
 }
 if(!isMobile){
  await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('off');
  await page.locator('main .tn-card').first().hover();await expect(page.locator('.project-particles')).toHaveCount(0);
 }
});
