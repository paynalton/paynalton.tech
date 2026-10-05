import {test,expect} from '@playwright/test';
const defaults={HideForms:false,FormsConvertationCounter:0,FormsConvertationWorkflow:0,FormsConvertationTimeout:0};
test('an open page restores figures at exactly 24 hours and persists all defaults',async({page})=>{
 await page.clock.install({time:new Date('2026-10-05T12:00:00Z')});
 await page.clock.pauseAt(new Date('2026-10-05T12:00:01Z'));
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'off'})));
 await page.goto('/es/sobre-mi/');
 await page.evaluate(()=>(window as any).formsController.setState({HideForms:true,FormsConvertationCounter:20,FormsConvertationWorkflow:1,FormsConvertationTimeout:Date.now()-86400000+1000}));
 await expect(page.locator('[data-workshop]')).toBeHidden();
 await page.clock.runFor(999);expect(await page.evaluate(()=>(window as any).formsController.getState().HideForms)).toBe(true);
 await page.clock.runFor(1);
 await expect(page.locator('[data-workshop]')).toBeVisible();
 expect(await page.evaluate(()=>(window as any).formsController.getState())).toEqual(defaults);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('paynalton.forms.v1')!))).toEqual(defaults);
});
test('returning to the site or a suspended tab expires old state',async({page})=>{
 await page.clock.install({time:new Date('2026-10-05T12:00:00Z')});
 await page.addInitScript(()=>{
  localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'off'}));
  localStorage.setItem('paynalton.forms.v1',JSON.stringify({HideForms:true,FormsConvertationCounter:20,FormsConvertationWorkflow:1,FormsConvertationTimeout:Date.now()-86400000}));
 });
 await page.goto('/es/sobre-mi/');
 await expect(page.locator('[data-workshop]')).toBeVisible();
 expect(await page.evaluate(()=>(window as any).formsController.getState())).toEqual(defaults);
 await page.evaluate(()=>(window as any).formsController.setState({HideForms:true,FormsConvertationCounter:20,FormsConvertationTimeout:Date.now()}));
 await page.clock.setSystemTime(new Date('2026-10-06T12:01:00Z'));
 await page.evaluate(()=>dispatchEvent(new Event('focus')));
 await expect(page.locator('[data-workshop]')).toBeVisible();
 expect(await page.evaluate(()=>(window as any).formsController.getState())).toEqual(defaults);
});
