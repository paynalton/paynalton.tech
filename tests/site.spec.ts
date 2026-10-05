import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const languages = ['es', 'en', 'nah'];
const sections = ['', 'about', 'jobs', 'projects', 'ideas', 'contact'];
const book = 'books/cuando-la-tostadora-te-responde/';

test.beforeEach(async ({ page }) => {
  // Keep regression tests independent of analytics, fonts and third-party uptime.
  await page.route('**/*', route =>
    new URL(route.request().url()).hostname === '127.0.0.1'
      ? route.continue() : route.abort());
});

for (const lang of languages) {
  test(`${lang}: pages and local resources`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(`http://127.0.0.1:${process.env.E2E_PORT??4321}`) && response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    for (const section of [...sections, book]) {
      const response = await page.goto(`/${lang}/${section}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1').first()).toBeVisible();
      expect(await page.title()).not.toBe('');
      if (lang === 'es' && (section === '' || section === book)) {
        await page.screenshot({ path: testInfo.outputPath(section === '' ? 'home.png' : 'book.png'), fullPage: true });
      }
    }
    expect(errors).toEqual([]);
  });

  test(`${lang}: language navigation preserves section`, async ({ page }) => {
    await page.goto(`/${lang}/projects/`);
    if(lang==='es'){
      await expect(page).toHaveURL(/\/es\/proyectos\/$/);
      await expect(page.locator('#language')).toHaveCount(0);
    }else{
      const next=lang==='en'?'nah':'es';
      await page.locator('#language').selectOption(next);
      await expect(page).toHaveURL(new RegExp(next==='es'?'/es/proyectos/$':`/${next}/projects/$`));
      await expect(page.locator('html')).toHaveAttribute('lang',next);
    }
  });

  test(`${lang}: book edition and format stay independent of page language`, async ({ page, request }) => {
    await page.goto(`/${lang}/${book}`);
    await expect(page.locator('[data-edition-select]')).toHaveValue(lang);
    await expect(page.locator('[data-format-select]')).toHaveValue('pdf');
    for (const edition of languages) {
      for (const format of ['pdf', 'epub']) {
        await page.locator('[data-edition-select]').selectOption(edition);
        await page.locator('[data-format-select]').selectOption(format);
        const path = `/${book}cuando-la-tostadora-te-responde-${edition}.${format}`;
        const button = page.locator('[data-download-button]');
        await expect(button).toHaveAttribute('href', path);
        await expect(button).toHaveAttribute('aria-disabled', 'false');
        expect((await request.head(path)).status()).toBe(200);
        await expect(page).toHaveURL(new RegExp(`/${lang}/${book}$`));
      }
    }
  });
}

test('mobile menu opens and navigation works', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile menu is only shown on narrow viewports.');
  await page.goto('/es/');
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('#site-navigation')).toBeVisible();
  await page.locator('#site-navigation a[href="/es/proyectos/"]').click();
  await expect(page).toHaveURL(/\/es\/proyectos\/?$/);
});

test('root keeps the Spanish entry for an English browser', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.abort());
  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await context.close();
});

test('essential HTML works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const lang of languages) {
    await page.goto(`http://127.0.0.1:${process.env.E2E_PORT??4321}/${lang}/${book}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-download-button]')).toHaveAttribute('href', `/${book}cuando-la-tostadora-te-responde-${lang}.pdf`);
  }
  await context.close();
});

test('feeds, downloads and missing routes', async ({ request }) => {
  for (const path of ['/rss.xml', '/sitemap-index.xml', '/sitemap-0.xml']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<?xml');
  }
  expect((await request.get('/this-page-does-not-exist/')).status()).toBe(404);
  const directory = join('public', book);
  for (const file of readdirSync(directory).filter(file => /\.(pdf|epub)$/.test(file))) {
    const response = await request.get(`/${book}${file}`);
    expect(response.status()).toBe(200);
    const digest = (data: Buffer) => createHash('sha256').update(data).digest('hex');
    expect(digest(await response.body())).toBe(digest(readFileSync(join(directory, file))));
  }
});
