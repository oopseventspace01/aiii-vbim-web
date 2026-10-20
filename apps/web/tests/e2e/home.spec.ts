// P3 首頁：13 個區塊、後台內容正確顯示、雙語、無障礙
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import '../../../../scripts/load-root-env.mjs';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

/** 直接向 Sanity 公開 API 查目前的內容，確認網站顯示的和後台一致 */
async function sanity<T>(query: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set('query', query);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  return ((await (await fetch(url)).json()) as { result: T }).result;
}

const SECTIONS = {
  'zh-Hant': [
    '核心定位',
    '三大能力模組',
    '五大應用場域',
    '天・地・腦・中樞',
    '遠距多點數據智控',
    '平台生態系',
    'VBIM 認證學院',
    '最新消息',
    'From Data to a Better Physical World.',
  ],
  en: [
    'Not another system',
    'Three capability modules',
    'five sectors in reach',
    'Eyes, Nerves, Brain, Hub',
    'Remote, multi-site, data-driven control',
    'The platform ecosystem',
    'VBIM Certification Academy',
    'Latest News',
    'From Data to a Better Physical World.',
  ],
} as const;

for (const [locale, path] of [
  ['zh-Hant', '/'],
  ['en', '/en'],
] as const) {
  test.describe(`首頁 ${path}`, () => {
    test('區塊依設計稿順序出現', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText('One OS.');
      const h2 = await page.locator('main h2').allTextContents();
      const expected = SECTIONS[locale];
      expect(h2).toHaveLength(expected.length);
      expected.forEach((text, i) => expect(h2[i]).toContain(text));
      // 背書條（無標題區塊）
      await expect(page.locator('main section[aria-label] dl > div')).toHaveCount(4);
    });

    test('Hero 標語、背書條與後台內容一致', async ({ page }) => {
      test.skip(!projectId, '需要 .env 的 PUBLIC_SANITY_PROJECT_ID');
      const settings = await sanity<{ heroTitle: string; heroSubtitle: string; proof: string[] }>(
        `*[_type == "siteSettings" && language == $lang][0]{ heroTitle, heroSubtitle, "proof": proofItems[].value }`,
        { lang: locale },
      );
      await page.goto(path);
      const h1 = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim();
      expect(h1).toBe(settings.heroTitle);
      await expect(page.getByText(settings.heroSubtitle, { exact: true })).toBeVisible();
      for (const value of settings.proof)
        await expect(page.locator('dd', { hasText: value })).toBeVisible();
    });

    test('最新消息：產品發表與媒體報導各顯示「全站設定」指定的則數', async ({ page }) => {
      test.skip(!projectId, '需要 .env 的 PUBLIC_SANITY_PROJECT_ID');
      const count =
        (await sanity<number | null>(
          `*[_type == "siteSettings" && language == $lang][0].homeNewsCount`,
          {
            lang: locale,
          },
        )) ?? 3;
      await page.goto(path);
      const product = page.locator('[data-news-group="home-news-product"] article');
      const media = page.locator('[data-news-group="home-news-media"] article');
      await expect(product).toHaveCount(count);
      await expect(media).toHaveCount(count);

      // 產品發表連到站內頁面；媒體報導開新分頁到原始報導
      for (const link of await product.locator('h3 a').all()) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(locale === 'en' ? /^\/en\// : /^\/[a-z]/);
        expect(await link.getAttribute('target')).toBeNull();
      }
      for (const link of await media.locator('h3 a').all()) {
        expect(await link.getAttribute('href')).toMatch(/^https:\/\//);
        expect(await link.getAttribute('target')).toBe('_blank');
        expect(await link.getAttribute('rel')).toContain('noopener');
      }
    });

    test('雙入口卡片與 CTA 連到正確頁面', async ({ page }) => {
      await page.goto(path);
      const prefix = locale === 'en' ? '/en' : '';
      await expect(page.locator(`main a[href="${prefix}/contact?role=owner"]`)).toHaveCount(1);
      await expect(page.locator(`main a[href="${prefix}/partners"]`).first()).toBeVisible();
      await expect(page.locator(`main a[href="${prefix}/contact"]`)).toHaveCount(1);
    });

    test('沒有水平捲動、圖片都有 alt', async ({ page }) => {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
      ).toBe(false);
      const missingAlt = await page.locator('img:not([alt])').count();
      expect(missingAlt).toBe(0);
    });

    test('戰情室未上傳截圖時標示「示意畫面」', async ({ page }) => {
      test.skip(!projectId, '需要 .env 的 PUBLIC_SANITY_PROJECT_ID');
      const hasImage = await sanity<boolean>(
        `defined(*[_type == "siteSettings" && language == $lang][0].commandCenterImage.asset)`,
        { lang: locale },
      );
      await page.goto(path);
      const label = page.locator('[data-command-image] figure span');
      if (hasImage) await expect(label).toHaveCount(0);
      else await expect(label).toHaveText(locale === 'en' ? 'Illustrative mockup' : '示意畫面');
    });

    test('無障礙：沒有嚴重問題', async ({ page }) => {
      await page.goto(path);
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

test('截圖：首頁（供人工檢查）', async ({ page }, testInfo) => {
  await page.goto('/');
  for (let y = 0; y < 12000; y += 600) await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath(`home-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
