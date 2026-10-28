// P7 瀏覽器相容（SPEC 8）：Firefox、Safari 核心（WebKit，含 iPhone）跑主要流程
// Chrome 與 Edge 同核心，由其他測試檔涵蓋
import { expect, test } from '@playwright/test';

test('首頁：Hero、導覽、頁尾都正常，沒有水平捲動', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('header').first()).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  // 用頁面本身的寬度比較：Windows 版 WebKit 模擬 iPhone 時仍會畫出佔寬度的捲軸，clientWidth 會變小
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      Math.ceil(document.documentElement.getBoundingClientRect().width) + 1,
  );
  expect(overflow).toBe(false);
});

test('導覽：桌機連結或手機選單都能到平台頁', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.locator('[data-menu-toggle]').click();
    await page.locator('[data-menu-panel] a[href="/platform"]').click();
  } else {
    await page.locator('header nav a[href="/platform"]').first().click();
  }
  await expect(page).toHaveURL(/\/platform$/);
});

test('語言切換：中文 → 英文 → 中文', async ({ page, isMobile }) => {
  await page.goto('/platform');
  if (isMobile) await page.locator('[data-menu-toggle]').click();
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/platform$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  if (isMobile) await page.locator('[data-menu-toggle]').click();
  await page.locator('a[hreflang="zh-Hant"]:visible').first().click();
  await expect(page).toHaveURL(/\/platform$/);
});

test('五大領域分頁可以切換', async ({ page }) => {
  await page.goto('/solutions');
  const tabs = page.getByRole('tab');
  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('捲動後導覽列固定在頂部，回到頂部按鈕可用', async ({ page }) => {
  await page.goto('/platform');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.locator('header').first()).toBeInViewport();
  const back = page.locator('[data-back-to-top]');
  await expect(back).toHaveAttribute('data-visible', 'true');
  await back.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
});

test('表單可以填寫送出（本機模擬送出）', async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/**', (route) => route.abort());
  await page.goto('/partners');
  const form = page.locator('form[data-lead-form]');
  await form.locator('[name="company"]').fill('瀏覽器測試');
  await form.locator('[name="partnerType"]').selectOption('si');
  await form.locator('[name="name"]').fill('測試');
  await form.locator('[name="email"]').fill('browser@example.com');
  await form.locator('[name="message"]').fill('相容性測試');
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-success] [role="status"]')).toBeVisible();
  await expect(form.locator('[data-lead-code]')).toHaveText(/^L-\d{6}-/);
});
