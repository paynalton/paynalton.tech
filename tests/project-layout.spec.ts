import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

test.use({reducedMotion:'no-preference',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--enable-unsafe-swiftshader']}});

test('project template combines its scene with a separate reading rail',async({page,isMobile},info)=>{
 await page.goto('/es/proyectos/pipila/');
 await expect(page.locator('h1')).toHaveCount(1);
 const scene=page.locator('.project-hero [data-workshop="projects"]');
 await expect(scene).toBeVisible();
 await expect(scene).toHaveAttribute('data-scene','ready');
 const dir=`ai_reference/implementacion/PT12/fichas-proyectos/${info.project.name}`;
 await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/cabecera.png`});
 const rail=page.locator('[data-reading-ornament]');
 if(isMobile){await expect(rail).toBeHidden();}
 else{
  await rail.scrollIntoViewIfNeeded();await expect(rail).toHaveAttribute('data-progress',/\d/);
  await expect(rail.locator('[data-reading-particles] > g')).toHaveCount(24);
  const text=(await page.locator('.project-reading-content').boundingBox())!,box=(await rail.boundingBox())!;
  expect(text.x+text.width).toBeLessThan(box.x);
  await page.screenshot({path:`${dir}/lectura.png`});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(scene.locator('canvas')).toHaveCount(0);
 await expect(rail.locator('[data-reading-particles]')).toHaveCount(0);
 await page.setViewportSize({width:320,height:800});
 await page.addStyleTag({content:'html{font-size:200%}'});await page.evaluate(()=>document.fonts.ready);
 await expect(rail).toBeHidden();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await expect(page.locator('[data-entry-body]')).toContainText(/\S/);
});

test('project scene and reading content have a static fallback',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});
 try{
  const page=await context.newPage();await page.goto(`${baseURL}/es/proyectos/pipila/`);
  const image=page.locator('.project-hero [data-workshop="projects"] img');
  await expect(image).toBeVisible();await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('[data-entry-body]')).toContainText(/\S/);
  await expect(page.locator('a[download]')).toHaveCount(2);
  await expect(page.locator('[data-reading-ornament]')).toBeVisible();
 }finally{await context.close();}
});
