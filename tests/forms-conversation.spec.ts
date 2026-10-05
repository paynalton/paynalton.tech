import {test,expect} from '@playwright/test';
test.use({reducedMotion:'no-preference'});
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode:'soft'})));
 await page.goto('/es/sobre-mi/');
});
test('twenty clicks, refusal and persistent exit follow the requested sequence',async({page})=>{
 const trigger=page.locator('[data-workshop] [data-vortex-trigger]'),bubble=page.locator('#scene-speech');
 const messages=new Map([[5,'Lo siento, no soy interactivo, deja de hacer click por favor'],[8,'¡Basta!'],[9,'¡Déja de hacer eso!'],[10,'😠'],[11,'😠 😤 😡 🤯 😫 😤 😠'],[16,'¿Si te doy algo me dejas de molestar?'],[19,'¡Ya me hartaste!']]);
 const before=Date.now();
 for(let count=1;count<=20;count++){
  await trigger.click();
  expect(await page.evaluate(()=>(window as any).formsController.getState().FormsConvertationCounter)).toBe(count);
  if(messages.has(count)){
   await expect(bubble).toBeVisible();await expect(bubble.locator('p')).toHaveText(messages.get(count)!);
  }else await expect(bubble).toBeHidden();
  if(count===16){
   await bubble.getByRole('button',{name:'No',exact:true}).click();
   expect(await page.evaluate(()=>(window as any).formsController.getState().FormsConvertationWorkflow)).toBe(1);
   expect(await page.evaluate(()=>(window as any).formsController.getState().FormsConvertationCounter)).toBe(16);
  }
  if(count<20)await expect(page.locator('[data-vortex=running]')).toHaveCount(0);
 }
 await expect.poll(()=>page.evaluate(()=>(window as any).formsController.getState().HideForms)).toBe(true);
 const state=await page.evaluate(()=>(window as any).formsController.getState());
 expect(state.FormsConvertationTimeout).toBeGreaterThanOrEqual(before);expect(state.FormsConvertationTimeout).toBeLessThanOrEqual(Date.now());
 await expect(page.locator('[data-workshop]')).toBeHidden();await page.reload();await expect(page.locator('[data-workshop]')).toBeHidden();
 expect(await page.evaluate(()=>(window as any).formsController.getState())).toEqual(state);
 await page.evaluate(()=>(window as any).resetForms());await expect(page.locator('[data-workshop]')).toBeVisible();
 expect(await page.evaluate(()=>(window as any).formsController.getState().FormsConvertationTimeout)).toBe(0);
});
test('accepting the offer launches fireworks without counting the answer as a figure click',async({page})=>{
 await page.evaluate(()=>(window as any).formsController.setState({FormsConvertationCounter:15}));
 await page.locator('[data-workshop] [data-vortex-trigger]').click();
 const bubble=page.locator('#scene-speech');await bubble.getByRole('button',{name:'Sí',exact:true}).click();
 await expect(page.locator('[data-fireworks]')).toHaveCount(1);await expect(bubble).toBeHidden();
 expect(await page.evaluate(()=>(window as any).formsController.getState())).toEqual({HideForms:false,FormsConvertationCounter:16,FormsConvertationWorkflow:0,FormsConvertationTimeout:0});
 await page.keyboard.press('Escape');await expect(page.locator('[data-fireworks]')).toHaveCount(0);
});
