import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
test.use({reducedMotion:'reduce'});
// The speech interaction is reserved; enable it explicitly in these regression tests.
test.beforeEach(async({page})=>{await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.dispatchEvent(new Event('site:enable-scene-speech'))));});
test('speech closes after five seconds with delayed fading and cancels old timers on reopening',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'soft'})));
 await page.goto('/es/sobre-mi/');await expect(page.locator('html')).toHaveAttribute('data-effects','soft');
 const bubble=page.locator('#scene-speech'),trigger=page.locator('[data-workshop] .scene-speech-trigger');
 await trigger.click();await expect(bubble).toBeVisible();
 await expect(bubble).toHaveAttribute('data-closing','true',{timeout:6000});
 const timing=await bubble.evaluate(el=>el.getAnimations().find(a=>a.effect?.getTiming().delay===250)?.effect?.getTiming());
 expect(timing?.duration).toBe(700);await expect(bubble).toBeHidden();
 await trigger.click();await page.keyboard.press('Escape');await expect(bubble).toHaveAttribute('data-closing','true');
 await trigger.click();await expect(bubble).not.toHaveAttribute('data-closing');
 await page.waitForTimeout(1200);await expect(bubble).toBeVisible();
 await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('Escape');await expect(bubble).toBeHidden();
 await trigger.click();await expect(bubble).toBeHidden({timeout:6000});
});
test('scenes and ornaments speak near the click without blocking navigation',async({page,isMobile},info)=>{
 await page.goto('/es/sobre-mi/');
 const bubble=page.locator('#scene-speech');
 const targets=['[data-workshop]','.shell-footer-mark'];if(!isMobile)targets.push('[data-reading-ornament]');
 for(const target of targets){
  const button=page.locator(`${target} .scene-speech-trigger`);await button.scrollIntoViewIfNeeded();
  const box=(await button.boundingBox())!;
  await button.click({position:{x:Math.min(box.width-10,30),y:Math.min(box.height-10,80)}});
  await expect(bubble).toBeVisible();await expect(bubble).toContainText('hola mundo');
  const bounds=(await bubble.boundingBox())!,viewport=page.viewportSize()!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(viewport.width);expect(bounds.y+bounds.height).toBeLessThanOrEqual(viewport.height);
  const dir=`ai_reference/implementacion/PT12/dialogo-figuras/${info.project.name}`;await mkdir(dir,{recursive:true});
  await page.screenshot({path:`${dir}/${target.includes('workshop')?'escena':target.includes('footer')?'footer':'vertical'}.png`});
  await bubble.locator('button').click();await expect(bubble).toBeHidden();
  await button.focus();await page.keyboard.press('Enter');await expect(bubble).toBeVisible();await expect(bubble.locator('button')).toBeFocused();
  await page.keyboard.press('Escape');await expect(bubble).toBeHidden();await expect(button).toBeFocused();
 }
 await page.setViewportSize({width:320,height:800});
 await page.locator('[data-workshop] .scene-speech-trigger').click();await expect(bubble).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.evaluate(()=>scrollBy(0,100));await expect(bubble).toBeHidden();
});
test('the book scene speaks while its card link remains usable',async({page})=>{
 await page.goto('/es/obra/');
 const card=page.locator('.tn-card--book');await card.locator('.scene-speech-trigger').click();
 await expect(page.locator('#scene-speech')).toBeVisible();await expect(page).toHaveURL(/\/es\/obra\/$/);
 await page.keyboard.press('Escape');await card.locator('a.tn-card-link').click();await expect(page).toHaveURL(/cuando-la-tostadora/);
});
