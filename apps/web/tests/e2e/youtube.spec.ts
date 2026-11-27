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
  ['/partners', 'header [data-academy-video]', 'academy'],
  ['/en/partners', 'header [data-academy-video]', 'academy'],
] as const) {
  test(`${path}：影片 ID ${VIDEOS[key].id ? '已設定：不自動播放，點擊後才載入播放器' : '空白時不顯示'}`, async ({
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
      // 夥伴頁不自動播放：在畫面上停一下仍然沒有播放器
      await page.waitForTimeout(800);
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

for (const path of ['/partners', '/en/partners']) {
  test(`${path}：教育認證影片在頁首右側取代圓環圖，整頁只出現一次`, async ({ page }) => {
    test.skip(!VIDEOS.academy.id, '影片 ID 空白時頁首顯示圓環圖');
    await page.goto(path);
    const hero = page.locator('main header').first();
    await expect(hero.locator('[data-academy-video] [data-youtube]')).toBeVisible();
    await expect(hero.locator('figure img')).toHaveCount(0);
    await expect(page.locator('[data-youtube]')).toHaveCount(1);
    // 桌機：影片在文字右側；手機：在文字下方且滿寬
    const h1 = (await hero.locator('h1').boundingBox())!;
    const video = (await hero.locator('[data-youtube]').boundingBox())!;
    const width = page.viewportSize()!.width;
    if (width >= 1024) expect(video.x).toBeGreaterThan(h1.x + h1.width / 2);
    else {
      expect(video.y).toBeGreaterThan(h1.y + h1.height);
      expect(video.width).toBeGreaterThan(width - 64);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

// 首頁影片：捲到約一半進入畫面時自動靜音播放（只有首頁）
const fakePlayer = (page: import('@playwright/test').Page) =>
  page.route('https://www.youtube-nocookie.com/**', (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>video</body></html>' }),
  );

for (const path of ['/', '/en']) {
  const locale = path === '/en' ? 'en' : 'zh-Hant';
  const id = VIDEOS.home.id;

  test(`${path}：首頁影片捲到畫面中才自動靜音播放，只建立一次`, async ({ page }) => {
    test.skip(!id, '首頁影片 ID 空白');
    await fakePlayer(page);
    await page.goto(path);
    const block = page.locator('[data-home-video] [data-youtube]');
    // 一進頁面（影片還在畫面外）不載入
    await page.waitForTimeout(500);
    await expect(block.locator('iframe')).toHaveCount(0);

    await block.scrollIntoViewIfNeeded();
    const iframe = block.locator('iframe');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`,
    );
    await expect(iframe).toHaveAttribute('title', VIDEOS.home.title[locale]);
    await expect(iframe).toHaveAttribute('allow', /autoplay/);

    // 捲走再捲回來：不重複建立
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-home-video] iframe')).toHaveCount(1);
  });

  test(`${path}：開啟「減少動態效果」時不自動播放，點擊才播（有聲）`, async ({ page }) => {
    test.skip(!id, '首頁影片 ID 空白');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await fakePlayer(page);
    await page.goto(path);
    const block = page.locator('[data-home-video] [data-youtube]');
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(block.locator('iframe')).toHaveCount(0);

    const title = VIDEOS.home.title[locale];
    const label = locale === 'en' ? `Play video: ${title}` : `播放影片：${title}`;
    await block.getByRole('button', { name: label }).click();
    await expect(block.locator('iframe')).toHaveAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    );
  });
}
