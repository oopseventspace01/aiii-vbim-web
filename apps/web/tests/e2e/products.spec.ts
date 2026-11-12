// 2026-11-12 新增：Aiii RMS、Aiii MMS 產品頁
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { url: '/products/rms', lang: 'zh-Hant', h1: 'Aiii RMS 智慧零售' },
  { url: '/en/products/rms', lang: 'en', h1: 'Aiii RMS Smart Retail' },
  { url: '/products/mms', lang: 'zh-Hant', h1: '智慧醫療影像辨識' },
  { url: '/en/products/mms', lang: 'en', h1: 'Smart Medical Image Recognition' },
] as const;

for (const p of PAGES) {
  test(`${p.url} 可開啟、一個 H1、沒有水平捲動、無嚴重無障礙問題`, async ({ page }) => {
    const res = await page.goto(p.url);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(p.h1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(
      results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => v.id),
    ).toEqual([]);
  });
}

test('五大領域：零售、醫院分頁連到產品頁', async ({ page }) => {
  await page.goto('/solutions');
  await expect(page.locator('[data-sector-panel=retail] [data-sector-product] a')).toHaveAttribute(
    'href',
    '/products/rms',
  );
  await expect(
    page.locator('[data-sector-panel=hospital] [data-sector-product] a'),
  ).toHaveAttribute('href', '/products/mms');
});

test('首頁最上方有 APP 下載鈕', async ({ page }) => {
  await page.goto('/');
  const buttons = page.locator('header [data-store-buttons] a');
  await expect(buttons.first()).toBeVisible();
});
