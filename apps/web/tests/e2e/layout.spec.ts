// P2 版型與元件：在元件展示頁（/dev/zh-Hant、/dev/en）驗證導覽、手機選單、回到頂部、Tabs、無障礙
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const SHOWCASE = '/dev/zh-Hant';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

async function scrollTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
}

test.describe('版面', () => {
  for (const path of [SHOWCASE, '/dev/en', '/', '/en']) {
    test(`${path} 沒有水平捲動`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });
  }

  test('英文頁 html lang 為 en', async ({ page }) => {
    await page.goto('/dev/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('往下捲動時導覽列仍固定在頂部', async ({ page }) => {
    await page.goto(SHOWCASE);
    await scrollTo(page, 2000);
    const header = page.locator('[data-site-header]');
    await expect(header).toBeInViewport();
    const box = await header.boundingBox();
    expect(box?.y).toBe(0);
    expect(box?.height).toBe(72);
  });

  test('「跳到主要內容」連結可用鍵盤叫出', async ({ page }) => {
    await page.goto(SHOWCASE);
    await page.keyboard.press('Tab');
    const skip = page.locator('[data-skip-link]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });
});

test.describe('回到頂部按鈕', () => {
  test('超過 300px 才出現，點擊後回到頂部', async ({ page }) => {
    await page.goto(SHOWCASE);
    const button = page.locator('[data-back-to-top]');
    await expect(button).toBeHidden();

    await scrollTo(page, 200);
    await expect(button).toBeHidden();

    await scrollTo(page, 1200);
    await expect(button).toBeVisible();

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('可用鍵盤操作', async ({ page }) => {
    await page.goto(SHOWCASE);
    await scrollTo(page, 1200);
    const button = page.locator('[data-back-to-top]');
    await expect(button).toBeVisible();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe('桌機導覽列', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, '只在桌機寬度執行');

  test('10 個頁面連結、語言切換與預約 Demo 都在', async ({ page }) => {
    await page.goto(SHOWCASE);
    const nav = page.getByRole('navigation', { name: '主選單' });
    await expect(nav.locator('ul a')).toHaveCount(10);
    await expect(nav.getByRole('link', { name: '預約 Demo' })).toBeVisible();
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
  });

  test('語言切換來回', async ({ page }) => {
    await page.goto(SHOWCASE);
    await page
      .getByRole('navigation', { name: '主選單' })
      .getByRole('link', { name: 'EN', exact: true })
      .click();
    await expect(page).toHaveURL(/\/dev\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: '中文' })
      .click();
    await expect(page).toHaveURL(/\/dev\/zh-Hant$/);
  });

  test('首頁語言切換：/ ↔ /en', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: '主選單' })
      .getByRole('link', { name: 'EN', exact: true })
      .click();
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe('手機漢堡選單', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, '只在手機寬度執行');

  test('展開後所有連結與 CTA 都看得到、可捲動、不被導覽列遮住', async ({ page }) => {
    await page.goto(SHOWCASE);
    const toggle = page.locator('[data-menu-toggle]');
    const panel = page.locator('#site-menu');

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();

    // 面板從導覽列下緣開始，不被遮住
    const box = await panel.boundingBox();
    expect(box?.y).toBe(72);

    // 背景鎖住捲動
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

    // 10 個連結＋中文／EN＋預約 Demo，捲到每一個都看得到
    const items = panel.locator('a');
    await expect(items).toHaveCount(13);
    for (const item of await items.all()) {
      await item.scrollIntoViewIfNeeded();
      await expect(item).toBeInViewport();
      const h = (await item.boundingBox())?.height ?? 0;
      expect(h).toBeGreaterThanOrEqual(44);
    }
  });

  test('可用鍵盤開關：Enter 開啟、焦點留在選單內、Esc 關閉並回到按鈕', async ({ page }) => {
    await page.goto(SHOWCASE);
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#site-menu')).toBeVisible();
    await expect(page.locator('#site-menu a').first()).toBeFocused();

    // Shift+Tab 從第一個連結回到開關按鈕（焦點不跑出選單）
    await page.keyboard.press('Shift+Tab');
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#site-menu').getByRole('link', { name: '預約 Demo' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('#site-menu')).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });

  test('點選單內連結後自動關閉', async ({ page }) => {
    await page.goto(SHOWCASE);
    await page.locator('[data-menu-toggle]').click();
    await page.locator('#site-menu').getByRole('link', { name: 'EN' }).click();
    await expect(page).toHaveURL(/\/dev\/en$/);
    await expect(page.locator('#site-menu')).toBeHidden();
  });
});

test.describe('Tabs 鍵盤操作', () => {
  test('方向鍵、Home、End 切換分頁', async ({ page }) => {
    await page.goto(SHOWCASE);
    const tablist = page.getByRole('tablist', { name: '選擇場域' });
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(3);

    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: '[MOCK] B' })).toBeVisible();
    await expect(page.getByText('[MOCK] Panel A')).toBeHidden();

    await page.keyboard.press('End');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toBeFocused();
  });
});

test.describe('無障礙（axe，WCAG 2.1 A/AA）', () => {
  for (const path of [SHOWCASE, '/dev/en']) {
    test(`${path} 沒有嚴重問題`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        serious.map(
          (v) =>
            `${v.id}: ${v.help} (${v.nodes.length})\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
        ),
      ).toEqual([]);
    });
  }

  test('手機選單展開時也沒有嚴重問題', async ({ page }) => {
    test.skip(!isMobile(page), '只在手機寬度執行');
    await page.goto(SHOWCASE);
    await page.locator('[data-menu-toggle]').click();
    const results = await new AxeBuilder({ page })
      .include('#site-menu')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(
      results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
    ).toEqual([]);
  });
});

test('截圖：元件展示頁（供人工檢查）', async ({ page }, testInfo) => {
  await page.goto(SHOWCASE);
  // 先捲到底，讓延遲載入（lazy）的圖片都載入
  for (let y = 0; y < 12000; y += 600) await scrollTo(page, y);
  await page.waitForLoadState('networkidle');
  await scrollTo(page, 0);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath(`showcase-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
