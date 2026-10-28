// P6 SEO E2E：每頁的 <head> 設定、標題與描述不重複、robots.txt、舊網址轉址、網站地圖（建置後）
import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/vbim',
  '/platform',
  '/solutions',
  '/energy',
  '/edge-ai',
  '/cases',
  '/partners',
  '/academy',
  '/news',
  '/about',
  '/contact',
];
const ALL = [...PAGES, ...PAGES.map((p) => (p === '/' ? '/en' : `/en${p}`))];

test.describe('每頁的 SEO 設定', () => {
  test.skip(({ isMobile }) => isMobile, '只在桌機跑一次即可');

  test('標題含品牌、描述不重複、canonical／hreflang／分享卡片／結構化資料齊全', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    // 同一種語言內不可重複（中英文首頁都用品牌名稱當標題沒關係，hreflang 已標示兩頁對應）
    const seen = {
      zh: { titles: new Map<string, string>(), descs: new Map<string, string>() },
      en: { titles: new Map<string, string>(), descs: new Map<string, string>() },
    };
    for (const path of ALL) {
      const { titles, descs: descriptions } =
        seen[path === '/en' || path.startsWith('/en/') ? 'en' : 'zh'];
      await page.goto(path);
      const title = await page.title();
      expect(title, path).toContain('Aiii VBIM');
      const desc = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(desc.length, `${path} 描述`).toBeGreaterThan(10);
      expect(titles.has(title), `${path} 標題和 ${titles.get(title)} 重複`).toBe(false);
      expect(descriptions.has(desc), `${path} 描述和 ${descriptions.get(desc)} 重複`).toBe(false);
      titles.set(title, path);
      descriptions.set(desc, path);

      const canonical = `https://aiiivbim.com${path === '/' ? '/' : path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      const zhPath = path === '/en' ? '/' : path.replace(/^\/en(?=\/)/, '');
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `https://aiiivbim.com${zhPath}`,
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https:\/\//,
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);

      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const types = ld.map((t) => JSON.parse(t)['@type']);
      expect(types, path).toContain('Organization');
    }
  });

  test('不收錄的頁面沒有 canonical', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});

test('robots.txt 允許收錄並指向網站地圖', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('Allow: /');
  expect(body).toContain('Disallow: /dev/');
  expect(body).toContain('Sitemap: https://aiiivbim.com/sitemap-index.xml');
});

test('舊網址 /aiiivbim-en 301 轉到 /en', async ({ request }) => {
  const res = await request.get('/aiiivbim-en', { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers()['location']).toMatch(/\/en$/);
});

test('網站地圖（建置後）：中英文頁面互相對應，不含開發頁與 404', async () => {
  const file = new URL('../../dist/client/sitemap-0.xml', import.meta.url);
  test.skip(!existsSync(file), '尚未建置（npm run build 之後才有網站地圖）');
  const xml = readFileSync(file, 'utf-8');
  for (const path of ['/', '/platform', '/en', '/en/platform', '/contact']) {
    expect(xml).toContain(`<loc>https://aiiivbim.com${path}</loc>`);
  }
  expect(xml).toContain('hreflang="en" href="https://aiiivbim.com/en/platform"');
  expect(xml).not.toMatch(/\/dev\/|\/404/);
});
