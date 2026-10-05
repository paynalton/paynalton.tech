import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
const samples=['home','project','reading','components','expanded-home','expanded-project','expanded-reading','expanded-components','rtl-home'];
for(const sample of samples) test(`${sample}: layout, accessibility, local assets and links`,async({page},info)=>{
 const external:string[]=[],errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname!=='127.0.0.1'){external.push(url.hostname);return route.abort();}return route.continue();});
 const response=await page.goto(`/design-review/${sample}/`);expect(response?.status()).toBe(200);
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.fonts.check('400 16px Manrope','Español áéíóú ñ ¿¡') && document.fonts.check('500 24px Fraunces','Español áéíóú ñ ¿¡'))).toBe(true);
 await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('main')).toHaveCount(1);
 const overflow=await page.evaluate(()=>[...document.querySelectorAll<HTMLElement>('.tn-frame *')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.right>innerWidth+1 || r.left < -1);}).map(el=>el.tagName+'.'+el.className));
 expect(overflow).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);
 const links=await page.locator('a[href]').evaluateAll(elements=>elements.map(e=>e.getAttribute('href')!));
 for(const href of new Set(links)){
  if(href.startsWith('#')){expect(await page.locator(`[id="${href.slice(1)}"]`).count(),href).toBe(1);}
  else if(href.startsWith('/'))expect((await page.request.get(href)).status(),href).toBe(200);
 }
 await page.keyboard.press('Tab');await expect(page.locator('.tn-skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 expect(external).toEqual([]);expect(errors).toEqual([]);
 if(!sample.startsWith('expanded') && sample!=='rtl-home' && info.project.name!=='small'){
  const dir=`ai_reference/implementacion/PT04/capturas/${info.project.name}`;await mkdir(dir,{recursive:true});
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();scrollTo(0,0);});
  await page.screenshot({path:`${dir}/${sample}.png`,fullPage:true});
 }
});

test('control states, focus on both surfaces, text enlargement and no JavaScript',async({page,browser})=>{
 await page.goto('/design-review/components/');
 await expect(page.locator('#disabled-example')).toBeDisabled();
 await expect(page.locator('#error-example')).toHaveAttribute('aria-invalid','true');
 const input=page.locator('#search-example');await input.fill('Integración');await expect(input).toHaveValue('Integración');
 await expect(input).toHaveAccessibleName('Título de la búsqueda');
 await expect(page.locator('#error-example')).toHaveAccessibleDescription('Revisa el término antes de continuar.');
 for(const selector of ['.tn-action--primary','.tn-light .tn-action--primary']){
  const action=page.locator(selector).first();await action.focus();
  expect(await action.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');
  expect(await action.evaluate(e=>getComputedStyle(e).outlineWidth)).toBe('2px');
  for(const state of ['hover','active'] as const){
   await action.hover();if(state==='active')await page.mouse.down();
   try{const result=await new AxeBuilder({page}).include(selector).withTags(['wcag2aa']).analyze();expect(result.violations).toEqual([]);}finally{if(state==='active')await page.mouse.up();}
  }
 }
 await page.addStyleTag({content:'html{font-size:200%}'});
 const enlargedOverflow=await page.evaluate(()=>[...document.querySelectorAll<HTMLElement>('.tn-frame *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,text:e.textContent?.slice(0,60)})));
 expect(enlargedOverflow).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
 try {const plain=await context.newPage();await plain.goto('http://127.0.0.1:4322/design-review/reading/');await expect(plain.locator('main h1')).toBeVisible();await plain.locator('.tn-reader-index a').first().click();expect(new URL(plain.url()).hash).not.toBe('');}finally{await context.close();}
});

test('locale capability links equivalent pages and omits a singleton', async ({page}) => {
 await page.goto('/design-review/locales/es/');
 await expect(page.locator('[data-equivalent] a')).toHaveCount(2);
 await expect(page.locator('[data-no-equivalent] a')).toHaveCount(0);
 await expect(page.locator('[aria-current=page]')).toHaveText('Español');
 await page.getByRole('link',{name:'English',exact:true}).click();
 await expect(page).toHaveURL(/\/design-review\/locales\/en\/$/);
 await expect(page.locator('[aria-current=page]')).toHaveText('English');
 await page.getByRole('link',{name:'Español',exact:true}).click();
 await expect(page).toHaveURL(/\/design-review\/locales\/es\/$/);
});

test('PT06 shared-template journey with expanded dictionary, RTL and missing equivalents',async({page})=>{
 const prefix='/design-review/journey';
 await page.goto(prefix+'/es/');
 await page.locator(`main a[href="${prefix}/es/proyectos/pipila/"]`).click();
 await expect(page.locator('.shell-locales a')).toHaveCount(2);
 await page.locator('.shell-locales a[lang=en]').click();
 await expect(page).toHaveURL(new RegExp(prefix+'/en/proyectos/translated-project/$'));
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('h1')).toContainText('PT06-SYNTHETIC');
 await expect(page.locator('[data-entry-body]')).toContainText('PT06-SYNTHETIC');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await expect(page.locator('main a[href*="integracion-de-sistemas"]')).toHaveCount(0);
 await page.locator('[data-journey-contact] a').click();
 await expect(page.locator('main a[href^="mailto:"]')).toBeVisible();
 await page.goto(prefix+'/es/temas/integracion-de-sistemas/');
 await expect(page.locator('.shell-locales')).toHaveCount(0);
 await page.locator('[data-journey-contact] a').click();await expect(page).toHaveURL(new RegExp(prefix+'/es/contacto/$'));
 await page.goto(prefix+'/en/explorar/?q=pipila');
 await expect(page.locator('[data-search-status]')).not.toContainText('{count}');
 await expect(page.locator('[data-search-item]:visible')).toHaveCount(1);
});


test('PT09 index isolates languages and handles expanded RTL search controls',async({page})=>{
 const prefix='/design-review/journey';
 const indexed:string[]=[];page.on('request',r=>{const path=new URL(r.url()).pathname;if(path.includes('/pagefind/'))indexed.push(path);});
 await page.goto(prefix+'/en/explorar/?q=pipila');
 await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('[data-search-retry]')).toBeHidden();
 await expect(page.locator('[data-search-results] li')).toHaveCount(1);
 await expect(page.locator('[data-search-results] a')).toHaveAttribute('href',prefix+'/en/proyectos/translated-project/');
 await page.locator('[data-search-clear]').click();
 await expect(page.locator('[data-search-results] li')).toHaveCount(3);
 expect(await page.locator('[data-search-results] a').evaluateAll(links=>links.every(a=>a.getAttribute('href')?.includes('/en/')))).toBe(true);
 expect(indexed.length).toBeGreaterThan(0);expect(indexed.every(path=>path.startsWith(prefix+'/pagefind/'))).toBe(true);
 await page.addStyleTag({content:'html{font-size:200%}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.goto(prefix+'/es/explorar/');
 await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('[data-search-results] li')).toHaveCount(5);
 expect(await page.locator('[data-search-results] a').evaluateAll(links=>links.every(a=>a.getAttribute('href')?.includes('/es/')))).toBe(true);
});
