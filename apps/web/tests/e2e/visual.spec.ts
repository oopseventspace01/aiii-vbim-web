// P7 手機版截圖比對（SPEC 9）：375px 主要頁面整頁截圖，和基準圖比對，版面跑掉就會失敗
// - 基準圖放在 tests/e2e/__screenshots__/linux/，由 GitHub Actions「更新截圖基準」產生（字型算圖依系統而不同）
// - 本機（Windows）沒有對應的基準圖，自動略過
// - 只選內容固定的頁面；頁尾的公司資訊來自後台，比對時遮住
import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const PAGES = ['/platform', '/solutions', '/energy', '/edge-ai', '/about', '/en/platform'];

for (const path of PAGES) {
  const name = `${path.slice(1).replaceAll('/', '-')}-375.png`;
  test(`375px 截圖比對：${path}`, async ({ page }, testInfo) => {
    const updating =
      testInfo.config.updateSnapshots === 'all' || testInfo.config.updateSnapshots === 'changed';
    test.skip(
      !updating && !existsSync(testInfo.snapshotPath(name)),
      '這個系統沒有基準圖（基準圖由 CI 產生）',
    );
    await page.goto(path);
    // 捲到底讓延遲載入的圖片都載入，再回到頂部
    for (let y = 0; y < 15000; y += 800) await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(name, {
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('footer'), page.locator('[data-back-to-top]')],
      maxDiffPixelRatio: 0.01,
    });
  });
}
