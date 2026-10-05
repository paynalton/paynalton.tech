import {test,expect} from '@playwright/test';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const pages=[['inicio','/es/'],['proyecto','/es/proyectos/pipila/'],['catalogo','/es/obra/'],['lectura','/es/obra/el-estupor-mexicano/']];

test('CSP permits published pages and Pagefind while blocking injected scripts',async({page})=>{
 test.setTimeout(120000);
 const headers=await readFile('dist/_headers','utf8');
 const csp=headers.match(/Content-Security-Policy: (.+)/)![1];
 const violations:string[]=[];
 await page.exposeFunction('reportCsp',(value:string)=>violations.push(value));
 await page.addInitScript(()=>document.addEventListener('securitypolicyviolation',e=>(window as any).reportCsp(e.effectiveDirective+': '+e.blockedURI)));
 await page.route('**/*',async route=>{
  if(!route.request().isNavigationRequest())return route.continue();
  const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp,'x-frame-options':'DENY'}});
 });
 for(const file of (await readdir('dist',{recursive:true})).filter(f=>f.endsWith('.html') && f!=='index.html')){
  await page.goto('/'+file.replace(/index\.html$/,''));
 }
 await page.goto('/es/explorar/?q=DBASE');
 await expect(page.locator('[data-search-results] a[href="/es/proyectos/onix/"]')).toBeVisible();
 expect(violations).toEqual([]);
 await page.evaluate(()=>{const script=document.createElement('script');script.textContent='window.CSP_INJECTION_EXECUTED = true';document.head.append(script);});
 expect(await page.evaluate(()=>Object.hasOwn(window,'CSP_INJECTION_EXECUTED'))).toBe(false);
 await expect.poll(()=>violations.length).toBeGreaterThan(0);
});

for(const [name,url] of pages)test(`candidate ${name}: initial transfer budget and visual baseline`,async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const resources=new Set<string>();
 page.on('request',r=>{if(['document','script','stylesheet'].includes(r.resourceType()))resources.add(new URL(r.url()).pathname);});
 await page.goto(url);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
 const rows=[];
 for(const pathname of resources){
  const file='dist'+(pathname.endsWith('/')?pathname+'index.html':pathname);
  const bytes=gzipSync(await readFile(file)).length;rows.push({path:pathname,gzip:bytes});
 }
 const total=rows.reduce((sum,r)=>sum+r.gzip,0);
 const directory='ai_reference/implementacion/PT12/performance';await mkdir(directory,{recursive:true});
 await writeFile(`${directory}/${name}-${info.project.name}.json`,JSON.stringify({url,profile:info.project.name,compression:'local gzip estimate, fonts/images excluded, reduced motion',bytes:total,limit:200000,resources:rows},null,2)+'\n');
 expect(total).toBeLessThanOrEqual(200000);
 await expect(page).toHaveScreenshot(`${name}.png`,{animations:'disabled',maxDiffPixelRatio:0.002});
});

test('CSP retains the native local search form without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const csp=(await readFile('dist/_headers','utf8')).match(/Content-Security-Policy: (.+)/)![1];
 try{
  await context.route('**/*',async route=>{
   if(!route.request().isNavigationRequest())return route.continue();
   const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});
  });
  const page=await context.newPage();await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/es/explorar/`);
  await page.locator('#page-query').fill('Pipila');await page.locator('#page-query').press('Enter');
  await expect(page).toHaveURL(url=>url.pathname==='/es/explorar/' && url.searchParams.get('q')==='Pipila');
  await expect(page.locator('main a[href="/es/proyectos/pipila/"]').first()).toBeVisible();
 }finally{await context.close();}
});
