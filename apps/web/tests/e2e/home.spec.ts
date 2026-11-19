// P3 首頁：13 個區塊、後台內容正確顯示、雙語、無障礙
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import '../../../../scripts/load-root-env.mjs';
import newsDesign from '../../src/content/design/News.json' with { type: 'json' };

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
    '最新消息',
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
    'Latest News',
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
      // 後台已發布的則數比設定少時，就全部顯示
      const available = await sanity<{ product: number; media: number }>(
        `{"product": count(*[_type == "news" && category == "product" && language == $lang && publishedAt <= now()]),
          "media": count(*[_type == "news" && category == "media" && language == $lang && publishedAt <= now()])}`,
        { lang: locale },
      );
      await expect(product).toHaveCount(Math.min(count, available.product));
      await expect(media).toHaveCount(Math.min(count, available.media));

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

    test('Hero 主視覺：平面圖 → 線框 → 建築，四個層次標題讀得到，播完會停留再重播', async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await page.goto(path);
      test.skip((await page.locator('[data-hero-video]').count()) > 0, '後台設定了 Hero 影片');
      const hero = page.locator('[data-hero-building]');
      await expect(hero.locator('img')).toHaveAttribute('alt', /\S/);
      await expect(hero.locator('svg.hb-wire')).toHaveAttribute('aria-hidden', 'true');
      // 由上往下的順序和畫面一致；中英文頁都同時顯示英文大字與中文小字
      const labels = (await hero.locator('li').allInnerTexts()).map((t) => t.replace(/\s+/g, ' '));
      expect(labels).toEqual([
        'AI 智慧決策',
        'OPERATIONS 營運管理',
        'TWIN 數位孿生',
        'BUILDING 建築本體',
      ]);
      // 捲到主視覺 → 開始播放（約 8 秒），播完停在最終畫面
      await hero.scrollIntoViewIfNeeded();
      await expect(hero).toHaveAttribute('data-anim', 'play');
      await page.waitForFunction(() =>
        document
          .querySelector('[data-hero-building]')!
          .getAnimations({ subtree: true })
          .every((a) => a.playState === 'finished'),
      );
      expect(await hero.locator('img').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      await expect(hero).not.toHaveAttribute('data-anim');
      expect(await hero.locator('img').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      expect(
        await hero
          .locator('svg')
          .first()
          .evaluate((e) => getComputedStyle(e).opacity),
      ).toBe('0');
      for (const li of await hero.locator('li').all()) await expect(li).toBeVisible();
      // 停留約 8 秒後淡出、重播
      await expect(hero).toHaveAttribute('data-anim', 'out', { timeout: 12_000 });
      await expect(hero).toHaveAttribute('data-anim', 'play', { timeout: 3_000 });
    });

    test('Hero 主視覺：暫停鈕可暫停／繼續，捲出畫面時自動暫停', async ({ page }) => {
      await page.goto(path);
      test.skip((await page.locator('[data-hero-video]').count()) > 0, '後台設定了 Hero 影片');
      const hero = page.locator('[data-hero-building]');
      const pauseName = locale === 'en' ? 'Pause animation' : '暫停動畫';
      const playName = locale === 'en' ? 'Play animation' : '播放動畫';
      await hero.scrollIntoViewIfNeeded();
      await expect(hero).toHaveAttribute('data-anim', 'play');
      const states = () =>
        hero.evaluate((e) => [
          ...new Set(e.getAnimations({ subtree: true }).map((a) => a.playState)),
        ]);

      await hero.getByRole('button', { name: pauseName }).click();
      await expect(hero).toHaveAttribute('data-paused', '');
      await expect.poll(states).toEqual(['paused']);
      await hero.getByRole('button', { name: playName }).click();
      await expect(hero).not.toHaveAttribute('data-paused');
      await expect.poll(states).not.toContain('paused');

      // 捲到頁尾 → 自動暫停；捲回來 → 繼續
      await page.locator('footer').scrollIntoViewIfNeeded();
      await expect(hero).toHaveAttribute('data-paused', '');
      await hero.scrollIntoViewIfNeeded();
      await expect(hero).not.toHaveAttribute('data-paused');
    });

    test('Hero 主視覺：「減少動態效果」時直接顯示最終畫面', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      test.skip((await page.locator('[data-hero-video]').count()) > 0, '後台設定了 Hero 影片');
      const hero = page.locator('[data-hero-building]');
      await hero.scrollIntoViewIfNeeded();
      expect(await hero.getAttribute('data-anim')).toBeNull();
      expect(await hero.evaluate((e) => e.getAnimations({ subtree: true }).length)).toBe(0);
      expect(await hero.locator('img').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      expect(
        await hero
          .locator('svg')
          .first()
          .evaluate((e) => getComputedStyle(e).opacity),
      ).toBe('0');
      for (const li of await hero.locator('li').all()) await expect(li).toBeVisible();
      await expect(hero.getByRole('button')).toBeHidden();
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

    test('Hero 正下方的最新消息大卡片：原文、照片、外部連結（新分頁）與看全部連結', async ({
      page,
    }) => {
      await page.goto(path);
      const block = page.locator('[data-home-latest-news]');
      await expect(block).toBeVisible();
      // 緊接在 Hero 後面
      const prevIsHero = await block.evaluate(
        (el) => !!el.previousElementSibling?.querySelector('h1'),
      );
      expect(prevIsHero).toBe(true);
      await expect(block.locator('h2')).toHaveText(locale === 'en' ? 'Latest News' : '最新消息');
      // 文字和設計稿 News.json 的媒體報導原文一致
      const item = (
        newsDesign[locale] as unknown as {
          shown: { src: string; date: string; t: string; d: string; href?: string }[];
        }
      ).shown.find((m) => m.href?.includes('abri.gov.tw'))!;
      await expect(block.locator('[data-latest-meta]')).toHaveText(`${item.src} · ${item.date}`);
      const link = block.locator('[data-latest-link]');
      await expect(link).toContainText(item.t);
      await expect(block).toContainText(item.d);
      await expect(link).toHaveAttribute('href', item.href!);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link.locator('svg')).toHaveCount(1);
      const img = block.locator('img');
      await expect(img).toHaveCount(1);
      expect(await img.getAttribute('alt')).toBeTruthy();
      // 照片是重點：桌機佔卡片 6 成以上寬度，手機在最上面且滿寬；不裁切（維持原比例）
      await img.evaluate((el: HTMLImageElement) => el.decode());
      const card = (await block.locator('[data-latest-card]').boundingBox())!;
      const photo = (await img.boundingBox())!;
      const wide = (page.viewportSize()?.width ?? 0) >= 768;
      expect(photo.width / card.width).toBeGreaterThan(wide ? 0.6 : 0.95);
      if (!wide) expect(photo.y - card.y).toBeLessThan(4);
      const ratio = await img.evaluate((el: HTMLImageElement) => ({
        shown: el.clientWidth / el.clientHeight,
        natural: el.naturalWidth / el.naturalHeight,
      }));
      expect(Math.abs(ratio.shown - ratio.natural)).toBeLessThan(0.05);
      await expect(block.locator('[data-latest-all]')).toHaveAttribute(
        'href',
        locale === 'en' ? '/en/news' : '/news',
      );
    });

    test('戰情室七個管理層級可以點選切換，內容取自網站原文', async ({ page }) => {
      await page.goto(path);
      const root = page.locator('[data-command-layers]');
      const tabs = root.getByRole('tab');
      await expect(tabs).toHaveCount(7);
      await expect(root.getByRole('tabpanel')).toHaveCount(1);
      await tabs.nth(3).click();
      await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
      const panel = root.getByRole('tabpanel');
      await expect(panel).toHaveCount(1);
      await expect(panel).toContainText(
        locale === 'en' ? 'Building spaces, floors' : '建築空間、樓層、上方設備',
      );
      await expect(panel.locator('img')).toBeVisible();
      // 鍵盤左右鍵切換
      await page.keyboard.press('ArrowRight');
      await expect(tabs.nth(4)).toBeFocused();
      await expect(root.getByRole('tabpanel')).toContainText(
        locale === 'en' ? 'Power, plumbing, fire' : '電力、給排水、消防',
      );
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
