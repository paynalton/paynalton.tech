import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
const pages = ['/es/','/es/proyectos/','/es/trayectoria/','/es/obra/','/es/sobre-mi/','/es/contacto/','/es/explorar/','/es/temas/','/es/proyectos/pipila/','/es/temas/integracion-de-sistemas/'];

test('new routes: accessible shell, real links, local assets and no overflow', async ({ page }, info) => {
  const external: string[] = [], errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => { if (new URL(route.request().url()).hostname !== '127.0.0.1') { external.push(route.request().url()); return route.abort(); } return route.continue(); });
  for (const path of pages) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.language-picker')).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://paynalton.tech${path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(axe.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})), path).toEqual([]);
    const links = await page.locator('.site-shell a[href]').evaluateAll(nodes => nodes.map(n=>n.getAttribute('href')!));
    for (const href of new Set(links.filter(h=>h.startsWith('/')))) {
      const response = await page.request.get(href);
      expect(response.status(), href).toBe(200);
      if (href.includes('#')) expect(await response.text()).toContain(`id="${href.split('#')[1]}"`);
    }
  }
  expect(external).toEqual([]); expect(errors).toEqual([]);
  await page.goto('/es/'); await page.evaluate(()=>document.fonts.ready);
  const dir = `ai_reference/implementacion/PT05/capturas/${info.project.name}`; await mkdir(dir,{recursive:true});
  await page.screenshot({path:`${dir}/inicio.png`,fullPage:true});
});

test('skip, mobile menu, dialog Escape and focus return', async ({ page, isMobile }) => {
  await page.goto('/es/');
  await page.keyboard.press('Tab'); await expect(page.locator('.tn-skip')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#main')).toBeFocused();
  if (isMobile) {
    const button = page.locator('[data-menu-toggle]');
    await button.focus(); await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Tab'); await expect(page.locator('#site-navigation a').first()).toBeFocused();
    await page.keyboard.press('Escape'); await expect(button).toBeFocused();
    await expect(page.locator('#site-navigation')).toBeHidden();
    await button.click(); await page.locator('#site-navigation a').first().click();
    await expect(page).toHaveURL(/\/es\/proyectos\/$/);
  }
  const open = page.locator('[data-search-open]'); await open.click();
  await expect(page.locator('#search-panel')).toBeVisible();
  await expect(page.locator('#global-query')).toBeFocused();
  await page.keyboard.press('Escape'); await expect(open).toBeFocused();
  await open.click();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.locator('[data-dialog-close]').click(); await expect(open).toBeFocused();
});

test('global search, query history and literal malicious input', async ({ page }) => {
  await page.goto('/es/'); await page.locator('[data-search-open]').click();
  await page.locator('#global-query').fill('integracion'); await page.locator('#global-query').press('Enter');
  await expect(page).toHaveURL(/\/es\/explorar\/\?q=integracion$/);
  await expect(page.locator('[data-search-item]:visible a[href="/es/proyectos/pipila/"]')).toBeVisible();
  await expect(page.locator('[data-search-item]:visible a[href="/es/temas/integracion-de-sistemas/"]')).toBeVisible();
  await page.locator('#page-query').fill('<img src=x onerror="window.bad=true">'); await page.locator('#page-query').press('Enter');
  await expect(page).toHaveURL(/q=%3Cimg/);
  await expect(page.locator('[data-search-page]')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('[data-search-retry]')).toBeHidden();
  expect(await page.evaluate(() => Object.hasOwn(window,'bad'))).toBe(false);
  await expect(page.locator('[data-search-page] img')).toHaveCount(0);
  await page.goBack(); await expect(page.locator('#page-query')).toHaveValue('integracion');
  await expect(page.locator('[data-search-item]:visible a[href="/es/proyectos/pipila/"]')).toBeVisible();
  await expect(page.locator('[data-search-item]:visible a[href="/es/temas/integracion-de-sistemas/"]')).toBeVisible();
  await page.locator('[data-search-clear]').click(); await expect(page.locator('[data-search-item]:visible')).toHaveCount(311);
});

test('preferences persist, honor reduced motion and pass accessibility', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/es/'); await page.locator('.shell-preferences summary').click();
  await page.locator('#effects-mode').selectOption('off');
  await expect(page.locator('html')).toHaveAttribute('data-effects','off');
  await page.reload(); await page.locator('.shell-preferences summary').click();
  await expect(page.locator('#effects-mode')).toHaveValue('off');
  await page.locator('#effects-mode').selectOption('full');
  await page.locator('[name=disable-3d]').check();
  await expect(page.locator('html')).toHaveAttribute('data-scene-allowed','false');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('html')).toHaveAttribute('data-effects','off');
  await expect(page.locator('[data-reduced-motion]')).toBeVisible();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.locator('[data-effects-reset]').click(); await expect(page.locator('#effects-mode')).toHaveValue('auto');
});

test('blocked storage keeps controls usable without script errors', async ({ page }) => {
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(() => Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
  await page.goto('/es/'); await page.locator('.shell-preferences summary').click();
  await page.locator('#effects-mode').selectOption('off');
  await expect(page.locator('html')).toHaveAttribute('data-effects','off');
  await expect(page.locator('[data-preferences-status]')).toContainText('No se pudieron guardar');
  await page.locator('[data-search-open]').click(); await expect(page.locator('#search-panel')).toBeVisible();
  expect(errors).toEqual([]);
});

test('without JavaScript: navigation, search alternatives, root and 404', async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/`); await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('#site-navigation')).toBeVisible();
    await page.locator('#site-navigation a').first().click(); await expect(page).toHaveURL(/\/es\/proyectos\/$/);
    await page.locator('[data-search-open]').click(); await expect(page).toHaveURL(/\/es\/explorar\/$/);
    await expect(page.locator('[data-search-item]')).toHaveCount(311);
    await page.locator('.shell-preferences summary').click(); await expect(page.locator('#effects-mode')).toBeDisabled();
    const response = await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/nonexistent-test/`); expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Página no encontrada');
    await page.locator('main a').first().click(); await expect(page).toHaveURL(/\/es\/$/);
  } finally { await context.close(); }
});

test('320px and enlarged text preserve menu, preferences and dialog', async ({ page }) => {
  await page.setViewportSize({width:320,height:800}); await page.goto('/es/');
  await page.addStyleTag({content:'html{font-size:200%}'});
  await page.locator('[data-menu-toggle]').click(); await page.locator('.shell-preferences summary').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('[data-search-open]').click();
  expect(await page.locator('#search-panel').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
});

test('expanded labels and RTL keep the shared frame usable', async ({page}) => {
  await page.setViewportSize({width:320,height:800}); await page.goto('/es/');
  await page.locator('[data-menu-toggle]').click();
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
    document.querySelectorAll('.shell-navigation a,.shell-profiles a').forEach(el => { el.textContent = `${el.textContent} — ${el.textContent}`; });
  });
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('#site-navigation a').first().focus(); await page.keyboard.press('Escape');
  await expect(page.locator('[data-menu-toggle]')).toBeFocused();
  await page.locator('[data-search-open]').click(); await expect(page.locator('#global-query')).toBeFocused();
});

test('preference changes synchronize with another tab', async ({page,context}) => {
  await page.goto('/es/'); await page.locator('.shell-preferences summary').click();
  const other = await context.newPage();
  try {
    await other.goto('/es/contacto/'); await other.locator('.shell-preferences summary').click();
    await other.locator('#effects-mode').selectOption('off');
    await expect(page.locator('#effects-mode')).toHaveValue('off');
    await expect(page.locator('html')).toHaveAttribute('data-effects','off');
  } finally { await other.close(); }
});
