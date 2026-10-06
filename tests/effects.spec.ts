import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
test.use({reducedMotion:'no-preference',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--enable-unsafe-swiftshader']}});
test.beforeEach(async({page})=>{
 const csp=(await readFile('dist/_headers','utf8')).match(/Content-Security-Policy: (.+)/)![1];
 await page.route('**/*',async route=>{
  if(!route.request().isNavigationRequest())return route.continue();
  const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});
 });
});
async function choice(page:Page,mode:string,disable3D=false){await page.addInitScript(({mode,disable3D})=>localStorage.setItem('paynalton.visual.v1',JSON.stringify({mode,disable3D})),{mode,disable3D});}
async function scene(page:Page){await page.goto('/es/');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-scene','ready');await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-pointer-settled','true');}
for(const mode of ['off','soft','disabled3d','reduced'])test(`preference ${mode} prevents Three.js requests and preserves content`,async({page})=>{
 const requested:string[]=[];page.on('request',r=>requested.push(r.url()));
 await choice(page,mode==='disabled3d'?'full':mode==='reduced'?'full':mode,mode==='disabled3d');
 if(mode==='reduced')await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/es/');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();await expect(page.locator('#effects-mode')).toBeEnabled();
 await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);
 expect(requested.filter(url=>/three-engine|workshop\./.test(url))).toEqual([]);
 if(mode==='off'||mode==='reduced')expect(requested.filter(url=>/optional\.|decorations\./.test(url))).toEqual([]);
 await expect(page.locator('h1')).toBeVisible();
});
test('real WebGL, bounded ambient rendering, pause, cleanup and reactivation',async({page},info)=>{
 await choice(page,'full');await scene(page);const host=page.locator('[data-workshop="hero"]');
 if(info.project.name==='desktop'){const initial=Number(await host.getAttribute('data-frames')),area=(await host.boundingBox())!;await page.mouse.move(area.x+area.width*.9,area.y+area.height*.6);await expect.poll(async()=>Number(await host.getAttribute('data-frames'))).toBeGreaterThan(initial);await expect(host).toHaveAttribute('data-pointer-settled','true');await page.mouse.move(0,0);await expect.poll(async()=>Number(await host.getAttribute('data-frames'))).toBeGreaterThan(initial+1);await expect(host).toHaveAttribute('data-pointer-settled','true');}
 const metrics=await host.evaluate(el=>({...((el as HTMLElement).dataset)}));
 expect(Number(metrics.triangles)).toBeLessThanOrEqual(60000);expect(Number(metrics.calls)).toBeLessThanOrEqual(30);expect(Number(metrics.dpr)).toBeLessThanOrEqual(1.5);
 const rendered=await host.getAttribute('data-frames');
 const context=await host.locator('canvas').evaluateHandle(canvas=>(canvas as HTMLCanvasElement).getContext('webgl2')!);
 const box=await host.boundingBox();
 // Ambient motion continues after pointer settling, at a bounded render rate.
 await page.evaluate(()=>new Promise<void>(resolve=>{let n=0;function step(){if(++n===12)resolve();else requestAnimationFrame(step);}requestAnimationFrame(step);}));
 expect(Number(await host.getAttribute('data-frames'))).toBeGreaterThan(Number(rendered));
 const dir=`ai_reference/implementacion/PT10/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/escena.png`,fullPage:false});await writeFile(`${dir}/metricas.json`,JSON.stringify(metrics,null,2));
 await page.locator('.shell-preferences').scrollIntoViewIfNeeded();await expect(host).toHaveAttribute('data-paused','true');await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('off');
 await expect(host.locator('canvas')).toHaveCount(0);await expect(host).toHaveAttribute('data-geometries','0');await expect(host.locator('img')).toBeVisible();
 await expect.poll(()=>context.evaluate(gl=>gl.isContextLost())).toBe(true);await context.dispose();
 const staticBox=await host.boundingBox();expect(staticBox!.width).toBe(box!.width);expect(staticBox!.height).toBe(box!.height);
 await page.locator('#effects-mode').selectOption('full');await host.scrollIntoViewIfNeeded();await expect(host).toHaveAttribute('data-scene','ready');await expect(host.locator('canvas')).toHaveCount(1);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
});
test('lost WebGL context falls back without retrying on preference changes',async({page})=>{
 await choice(page,'full');await scene(page);
 await page.locator('[data-workshop="hero"] canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
 await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();await expect(page.locator('html')).toHaveAttribute('data-scene-allowed','false');
 await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('off');await page.locator('#effects-mode').selectOption('full');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);
});
test('failed motor import preserves the static scene and navigation',async({page})=>{
 await choice(page,'full');await page.route('**/*three-engine*',r=>r.abort());await page.goto('/es/');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();
 await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-scene','failed');await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);
 await page.locator('main a[href="/es/proyectos/"]').first().click();await expect(page.locator('h1')).toBeVisible();
});
test('other pages load decoration only; filters and keyboard remain functional',async({page})=>{
 await choice(page,'full');const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/es/explorar/?q=DBASE');await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');await expect(page.locator('[data-search-results] a[href="/es/proyectos/onix/"]')).toBeVisible();
 await page.locator('[data-search-clear]').click();await expect(page.locator('#page-query')).toBeFocused();await expect(page.locator('[data-search-results] li')).toHaveCount(335);
 expect(requests.filter(url=>/three-engine|workshop\./.test(url))).toEqual([]);await expect(page.locator('canvas')).toHaveCount(0);
});
test('static image stays present without JavaScript',async({browser},info)=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.name==='mobile'?{width:390,height:844}:{width:1280,height:900}});
 try{const page=await context.newPage();await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/es/`);const host=page.locator('[data-workshop="hero"]');await host.scrollIntoViewIfNeeded();await expect(host.locator('img')).toBeVisible();expect(await host.locator('img').evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);await expect(host.locator('canvas')).toHaveCount(0);
 const dir=`ai_reference/implementacion/PT10/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/sin-efectos.png`,fullPage:false});
 }finally{await context.close();}
});


test('unavailable WebGL retains the image without throwing into page behavior',async({page})=>{
 await choice(page,'full');await page.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,kind:string,...args:unknown[]){if(kind.startsWith('webgl'))return null;return Reflect.apply(original,this,[kind,...args]);} as typeof original;
 });
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/es/');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();
 await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-scene','failed');await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();expect(errors).toEqual([]);
});
test('late motor import cannot mount after effects have been disabled',async({page})=>{
 await choice(page,'full');let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);let requested=false;
 await page.route('**/*three-engine*',async route=>{requested=true;await gate;await route.continue();});
 await page.goto('/es/');await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();await expect.poll(()=>requested).toBe(true);
 await page.locator('.shell-preferences summary').click();await page.locator('#effects-mode').selectOption('off');release();
 await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();
});

test('movement reduction takes priority during an active scene',async({page})=>{
 await choice(page,'full');await scene(page);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(0);await expect(page.locator('html')).toHaveAttribute('data-effects','off');
 await expect(page.locator('[data-workshop="hero"] img')).toBeVisible();
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-scene','ready');await expect(page.locator('[data-workshop="hero"] canvas')).toHaveCount(1);
});

test('mobile scene below the fold defers the motor until sufficiently visible',async({page},info)=>{
 test.skip(info.project.name!=='mobile','Mobile initial viewport contract');
 await page.setViewportSize({width:390,height:700});
 await choice(page,'full');const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/es/');await page.waitForLoadState('networkidle');
 expect(requests.filter(url=>/three-engine|workshop\./.test(url))).toEqual([]);
 await page.locator('[data-workshop="hero"]').scrollIntoViewIfNeeded();
 await expect(page.locator('[data-workshop="hero"]')).toHaveAttribute('data-scene','ready');
});
