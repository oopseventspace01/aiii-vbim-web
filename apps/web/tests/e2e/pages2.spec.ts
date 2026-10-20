// P4 第二批：最新消息、案例、生態夥伴、認證學院、聯絡我們、隱私權
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  { path: '/news', h1: { 'zh-Hant': '最新消息與媒體報導', en: 'News & Media Coverage' } },
  { path: '/news/page/2', h1: { 'zh-Hant': '最新消息與媒體報導', en: 'News & Media Coverage' } },
  {
    path: '/news/category/media',
    h1: { 'zh-Hant': '最新消息與媒體報導', en: 'News & Media Coverage' },
  },
  { path: '/cases', h1: { 'zh-Hant': '實績與示範場景', en: 'Track record and demo scenarios' } },
  { path: '/partners', h1: { 'zh-Hant': 'Build on Aiii VBIM', en: 'Build on Aiii VBIM' } },
  { path: '/academy', h1: { 'zh-Hant': 'VBIM 認證學院', en: 'VBIM Certification Academy' } },
  { path: '/contact', h1: { 'zh-Hant': '告訴我們你是誰', en: 'Tell us who you are' } },
  { path: '/privacy', h1: { 'zh-Hant': '隱私權政策', en: 'Privacy Policy' } },
] as const;

async function noHorizontalScroll(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );
}

for (const p of PAGES) {
  for (const [locale, prefix] of [
    ['zh-Hant', ''],
    ['en', '/en'],
  ] as const) {
    const url = `${prefix}${p.path}`;
    test(`${url}：開啟、標題、無水平捲動、alt、無障礙`, async ({ page }) => {
      test.setTimeout(60_000);
      const res = await page.goto(url);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toContainText(p.h1[locale]);
      expect(await noHorizontalScroll(page)).toBe(true);
      expect(await page.locator('img:not([alt])').count()).toBe(0);
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
  }
}

test.describe('最新消息', () => {
  test('置頂精選顯示在第一頁最上方，連到平台頁', async ({ page }) => {
    await page.goto('/news');
    const featured = page.locator('[data-news-featured]');
    await expect(featured).toContainText('Aiii VBIM 2.0');
    await expect(featured.getByRole('link', { name: /了解更多/ })).toHaveAttribute(
      'href',
      '/platform',
    );
    await page.goto('/news/page/2');
    await expect(page.locator('[data-news-featured]')).toHaveCount(0);
  });

  test('每頁最多 12 則，上一頁／下一頁可用', async ({ page }) => {
    await page.goto('/news');
    // 列表（不含上方置頂精選大卡）
    await expect(page.locator('ul[aria-labelledby="news-list"] article')).toHaveCount(12);
    await page
      .getByRole('navigation', { name: '分頁' })
      .getByRole('link', { name: /下一頁/ })
      .click();
    await expect(page).toHaveURL(/\/news\/page\/2$/);
    await page
      .getByRole('navigation', { name: '分頁' })
      .getByRole('link', { name: /上一頁/ })
      .click();
    await expect(page).toHaveURL(/\/news$/);
  });

  test('分類篩選：切到媒體報導，只顯示外部連結的報導並標示目前分類', async ({ page }) => {
    await page.goto('/news');
    const filters = page.getByRole('navigation', { name: '依分類篩選' });
    await expect(filters.getByRole('link', { name: '全部' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await filters.getByRole('link', { name: '媒體報導' }).click();
    await expect(page).toHaveURL(/\/news\/category\/media$/);
    await expect(filters.getByRole('link', { name: '媒體報導' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    for (const link of await page.locator('main article h3 a').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('英文版：媒體報導區提示原文為中文', async ({ page }) => {
    await page.goto('/en/news');
    await expect(page.getByText('Original articles are in Chinese.')).toBeVisible();
  });
});

test.describe('其他頁面', () => {
  test('案例：設計稿的 3 個實績、6 個示範場景；沒有公開案例時不顯示「導入案例」', async ({
    page,
  }) => {
    await page.goto('/cases');
    await expect(page.locator('main h2').filter({ hasText: '2025 台灣醫療科技展' })).toHaveCount(1);
    await expect(
      page.locator('section', { has: page.locator('#cases-demos') }).locator('li'),
    ).toHaveCount(6);
    await expect(page.locator('[data-cms-cases]')).toHaveCount(0);
  });

  test('夥伴：中文頁有招募海報，英文頁沒有（圖內文字為中文）', async ({ page }) => {
    await page.goto('/partners');
    await expect(page.locator('[data-partner-posters] img')).toHaveCount(2);
    await page.goto('/en/partners');
    await expect(page.locator('[data-partner-posters]')).toHaveCount(0);
  });

  test('學院：認證標準顯示「制定中」，沒有課程時不顯示梯次區塊', async ({ page }) => {
    await page.goto('/academy');
    await expect(page.locator('[data-standards]')).toContainText('認證標準制定中，歡迎先登記');
    await expect(page.locator('[data-courses]')).toHaveCount(0);
  });

  test('聯絡：公司資訊來自後台，LINE 官方帳號按鈕連到 lin.ee', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('[data-company-info]')).toContainText('敦化北路');
    await expect(page.locator('[data-line-oa] a')).toHaveAttribute('href', /^https:\/\/lin\.ee\//);
  });

  test('表單預留區：聯絡、夥伴、學院都有（P5 會換成正式表單）', async ({ page }) => {
    for (const path of ['/contact', '/partners', '/academy']) {
      await page.goto(path);
      await expect(page.locator('[data-form-pending]')).toBeVisible();
    }
  });

  test('隱私權：後台尚未發布時顯示「制定中」且不讓搜尋引擎收錄', async ({ page }) => {
    await page.goto('/privacy');
    const pending = page.locator('[data-privacy-pending]');
    if (await pending.count()) {
      await expect(pending).toContainText('制定中');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
  });
});

test('內文元件（元件展示頁 MOCK）：標題、清單、外部連結、YouTube、按鈕', async ({ page }) => {
  await page.goto('/dev/zh-Hant');
  const rich = page.locator('[data-rich-demo] .rich-text');
  await expect(rich.locator('h2')).toHaveText('[MOCK] 內文大標題');
  await expect(rich.locator('ul li')).toHaveCount(2);
  await expect(rich.getByRole('link', { name: '外部連結' })).toHaveAttribute('target', '_blank');
  await expect(rich.locator('iframe')).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/,
  );
  await expect(rich.getByRole('link', { name: '[MOCK] 內文按鈕' })).toHaveAttribute(
    'href',
    '/contact',
  );
});

test('截圖：第二批頁面（供人工檢查）', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  for (const path of ['/news', '/cases', '/partners', '/academy', '/contact']) {
    await page.goto(path);
    for (let y = 0; y < 12000; y += 700) await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`${path.slice(1)}-${testInfo.project.name}.png`),
      fullPage: true,
    });
  }
});
