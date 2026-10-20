// P4 第一批：VBIM、平台、五大領域、能源、地端 AI、關於我們、404
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  {
    path: '/vbim',
    nav: 'VBIM',
    h1: { 'zh-Hant': '第六代智慧建築', en: '6th-Generation Smart Building' },
  },
  {
    path: '/platform',
    nav: { 'zh-Hant': '平台 OS', en: 'Platform' },
    h1: { 'zh-Hant': 'Aiii VBIM 平台 OS', en: 'The Aiii VBIM Platform OS' },
  },
  {
    path: '/solutions',
    nav: { 'zh-Hant': '五大領域', en: 'Sectors' },
    h1: { 'zh-Hant': '五大應用場域', en: 'five sectors in reach' },
  },
  {
    path: '/energy',
    nav: { 'zh-Hant': '能源 × 空調', en: 'Energy & HVAC' },
    h1: { 'zh-Hant': '智慧能源管理', en: 'Smart Energy Management' },
  },
  {
    path: '/edge-ai',
    nav: { 'zh-Hant': '地端 AI', en: 'Edge AI' },
    h1: { 'zh-Hant': '地端 AI 完整解決方案', en: 'A complete Edge AI solution' },
  },
  {
    path: '/about',
    nav: { 'zh-Hant': '關於我們', en: 'About' },
    h1: { 'zh-Hant': '讓每一個空間', en: 'Making every space' },
  },
] as const;

const LOCALES = [
  { locale: 'zh-Hant', prefix: '', navName: '主選單' },
  { locale: 'en', prefix: '/en', navName: 'Main navigation' },
] as const;

for (const p of PAGES) {
  for (const { locale, prefix, navName } of LOCALES) {
    const url = `${prefix}${p.path}`;
    test.describe(url, () => {
      test('頁面可開啟、標題正確、導覽標示目前頁', async ({ page }) => {
        const res = await page.goto(url);
        expect(res?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.locator('h1')).toContainText(p.h1[locale]);
        await expect(page.locator('h1')).toHaveCount(1);
        const label = typeof p.nav === 'string' ? p.nav : p.nav[locale];
        if ((page.viewportSize()?.width ?? 0) >= 1024) {
          const current = page
            .getByRole('navigation', { name: navName })
            .locator('a[aria-current="page"]');
          await expect(current).toHaveText(label);
        }
      });

      test('沒有水平捲動、圖片都有 alt', async ({ page }) => {
        await page.goto(url);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
          ),
        ).toBe(false);
        expect(await page.locator('img:not([alt])').count()).toBe(0);
      });

      test('無障礙：沒有嚴重問題', async ({ page }) => {
        await page.goto(url);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const serious = results.violations.filter(
          (v) => v.impact === 'serious' || v.impact === 'critical',
        );
        expect(
          serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
        ).toEqual([]);
      });
    });
  }
}

test.describe('五大領域分頁', () => {
  test('方向鍵切換分頁，醫院與工廠分頁的儀表板標示「示意畫面」', async ({ page }) => {
    await page.goto('/solutions');
    const tabs = page.getByRole('tablist', { name: '選擇場域' }).getByRole('tab');
    await expect(tabs).toHaveCount(5);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    const hospital = page.locator('[data-sector-panel="hospital"]');
    await expect(hospital).toBeVisible();
    await expect(hospital.locator('figure span')).toHaveText('示意畫面');

    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    const factory = page.locator('[data-sector-panel="factory"]');
    await expect(factory).toBeVisible();
    await expect(factory.locator('figure span')).toHaveText('示意畫面');
    await expect(hospital).toBeHidden();

    // 沒有儀表板的分頁不會出現示意畫面
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-sector-panel="office"] figure')).toHaveCount(0);
  });

  test('英文版也有 5 個分頁與示意標示', async ({ page }) => {
    await page.goto('/en/solutions');
    await expect(
      page.getByRole('tablist', { name: 'Choose a sector' }).getByRole('tab'),
    ).toHaveCount(5);
    await expect(page.locator('[data-sector-panel="hospital"] figure span')).toHaveText(
      'Illustrative mockup',
    );
  });
});

test('VBIM「真實畫面」區塊只放實拍與系統畫面，不出現示意標示', async ({ page }) => {
  await page.goto('/vbim');
  const field = page.locator('section', { has: page.locator('#vbim-field') });
  await expect(field.locator('figure')).toHaveCount(2);
  await expect(field.getByText('示意畫面')).toHaveCount(0);
});

test('VBIM 媒體報導從後台讀取最新 3 則，開新分頁到原始報導', async ({ page }) => {
  await page.goto('/vbim');
  const links = page
    .locator('section', { has: page.locator('#vbim-media') })
    .locator('article h3 a');
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
  }
});

test('找不到的網址顯示中英文 404 頁', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('找不到這個頁面');
  await expect(page.locator('h1')).toContainText('We can’t find that page.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('截圖：第一批頁面（供人工檢查）', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  for (const p of PAGES) {
    await page.goto(p.path);
    for (let y = 0; y < 14000; y += 700) await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`${p.path.slice(1)}-${testInfo.project.name}.png`),
      fullPage: true,
    });
  }
});
