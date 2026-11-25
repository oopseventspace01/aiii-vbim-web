// 全站點圖放大（lightbox）：打開、關閉（Esc／背景／✕）、焦點回到原處、示意畫面標示、375px 不橫向捲動
import { expect, test, type Page } from '@playwright/test';

const dialog = (page: Page) => page.locator('dialog[data-zoom-lightbox]');

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const [path, label, close] of [
  ['/vbim', '放大圖片', '關閉'],
  ['/en/vbim', 'Enlarge image', 'Close'],
] as const) {
  test(`${path}：內容圖片可以放大，Esc 關閉後焦點回到原本那張圖`, async ({ page }) => {
    await page.goto(path);
    const triggers = page.locator('[data-zoomable]');
    expect(await triggers.count()).toBeGreaterThan(3);
    const first = triggers.nth(1);
    await expect(first).toHaveAttribute('aria-label', label);
    const innerAlt = await first.locator('img').getAttribute('alt');
    await first.scrollIntoViewIfNeeded();
    await first.click();

    const d = dialog(page);
    await expect(d).toBeVisible();
    // 焦點移進對話框（✕ 按鈕），放大的圖沿用原本的 alt、用較大的圖
    await expect(d.locator('[data-zoom-close-btn]')).toBeFocused();
    await expect(d.locator('[data-zoom-close-btn]')).toHaveAttribute('aria-label', close);
    const big = d.locator('[data-zoom-img]');
    await expect(big).toHaveAttribute('alt', innerAlt ?? '');
    await expect
      .poll(() => big.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    await noHorizontalScroll(page);

    await page.keyboard.press('Escape');
    await expect(d).toBeHidden();
    await expect(first).toBeFocused();
  });
}

test('點背景或 ✕ 都能關閉；鍵盤 Enter 也能打開', async ({ page }) => {
  await page.goto('/vbim');
  const t = page.locator('[data-zoomable]').first();
  await t.scrollIntoViewIfNeeded();
  await t.click();
  await expect(dialog(page)).toBeVisible();
  await page.mouse.click(8, 200); // 圖片以外的背景
  await expect(dialog(page)).toBeHidden();

  await t.focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeVisible();
  await dialog(page).locator('[data-zoom-close-btn]').click();
  await expect(dialog(page)).toBeHidden();
  await expect(t).toBeFocused();
});

test('示意畫面放大後仍標示「示意畫面」', async ({ page }) => {
  await page.goto('/');
  const t = page.locator('[data-zoomable][data-zoom-mockup]').first();
  await t.scrollIntoViewIfNeeded();
  await t.click();
  await expect(dialog(page).locator('[data-zoom-mockup-label]')).toBeVisible();
  await expect(dialog(page).locator('[data-zoom-mockup-label]')).toHaveText('示意畫面');
});

test('首頁最新消息：點照片放大，標題仍連到新聞（新分頁）', async ({ page }) => {
  await page.goto('/');
  const block = page.locator('[data-home-latest-news]');
  await block.locator('[data-zoomable]').click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(block.locator('[data-latest-link]')).toHaveAttribute('target', '_blank');
});

test('Logo、夥伴 Logo 牆與整張是連結的消息卡片不能放大', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header [data-zoomable]')).toHaveCount(0);
  await expect(page.locator('footer [data-zoomable]')).toHaveCount(0);
  await expect(page.locator('[data-home-news] [data-zoomable]')).toHaveCount(0);
});

test('375px：放大前後都沒有橫向捲動', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/vbim');
  await noHorizontalScroll(page);
  const t = page.locator('[data-zoomable]').first();
  await t.scrollIntoViewIfNeeded();
  await t.click();
  await expect(dialog(page)).toBeVisible();
  const box = (await dialog(page).locator('[data-zoom-img]').boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(375);
  await noHorizontalScroll(page);
});
