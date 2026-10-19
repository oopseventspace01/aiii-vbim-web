import { expect, test } from '@playwright/test';

test('首頁可載入，標題與色系正確', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  await expect(page).toHaveTitle(/Aiii VBIM/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('One OS.');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');

  // tokens + Tailwind 有生效：背景為 --bg (#ffffff)、文字為 --navy (#0c1a33)
  const bg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
  const color = await page.locator('body').evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe('rgb(12, 26, 51)');
});

test('沒有水平捲動', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
