// YouTube 影片（點擊才載入）：在元件展示頁用測試 ID 驗證；正式頁在影片 ID 空白時不顯示
import { expect, test } from '@playwright/test';
import { VIDEOS } from '../../src/content/videos';

for (const [path, label] of [
  ['/dev/zh-Hant', '播放影片：[MOCK] YouTube'],
  ['/dev/en', 'Play video: [MOCK] YouTube'],
] as const) {
  test(`${path}：點擊前只有封面與播放鍵，點擊後才載入播放器`, async ({ page }) => {
    // 不真的連到 YouTube：封面回一張空圖，播放器回空白頁
    await page.route('https://i.ytimg.com/**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg"/>',
      }),
    );
    await page.route('https://www.youtube-nocookie.com/**', (r) =>
      r.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>video</body></html>' }),
    );
    await page.goto(path);
    const box = page.locator('[data-dev-youtube] [data-youtube]');
    await box.scrollIntoViewIfNeeded();
    await expect(box.locator('iframe')).toHaveCount(0);
    await expect(box.locator('img')).toHaveAttribute(
      'src',
      'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    );
    const play = box.getByRole('button', { name: label });
    await expect(play).toBeVisible();

    // 16:9
    const size = (await box.boundingBox())!;
    expect(Math.abs(size.width / size.height - 16 / 9)).toBeLessThan(0.02);

    await play.click();
    const iframe = box.locator('iframe');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE?autoplay=1&rel=0',
    );
    await expect(iframe).toHaveAttribute('title', '[MOCK] YouTube');
    await expect(box.locator('[data-youtube-play]')).toHaveCount(0);
  });
}

test('375px：影片區塊沒有橫向捲動', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/dev/zh-Hant');
  const box = page.locator('[data-dev-youtube] [data-youtube]');
  await box.scrollIntoViewIfNeeded();
  expect((await box.boundingBox())!.width).toBeLessThanOrEqual(375);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

for (const [path, selector, key] of [
  ['/', '[data-home-video]', 'home'],
  ['/en', '[data-home-video]', 'home'],
  ['/partners', '[data-academy-video]', 'academy'],
  ['/en/partners', '[data-academy-video]', 'academy'],
] as const) {
  test(`${path}：影片 ID ${VIDEOS[key].id ? '已設定：點擊播放後載入播放器' : '空白時不顯示'}`, async ({
    page,
  }) => {
    await page.goto(path);
    if (VIDEOS[key].id) {
      await page.route('https://www.youtube-nocookie.com/**', (r) =>
        r.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>video</body></html>',
        }),
      );
      const id = VIDEOS[key].id;
      const title = VIDEOS[key].title[path.startsWith('/en') ? 'en' : 'zh-Hant'];
      const block = page.locator(selector);
      await block.scrollIntoViewIfNeeded();
      await expect(block).toBeVisible();
      await expect(block.locator('iframe')).toHaveCount(0);
      await expect(block.locator('img')).toHaveAttribute(
        'src',
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      );
      const label = path.startsWith('/en') ? `Play video: ${title}` : `播放影片：${title}`;
      await block.getByRole('button', { name: label }).click();
      await expect(block.locator('iframe')).toHaveAttribute(
        'src',
        `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      );
      await expect(block.locator('iframe')).toHaveAttribute('title', title);
    } else {
      await expect(page.locator(selector)).toHaveCount(0);
    }
  });
}
