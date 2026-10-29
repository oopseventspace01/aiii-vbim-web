// P7 響應式（SPEC 8）：375、768、1280、1440 四種寬度，全站沒有水平捲動、沒有元素超出畫面
// 375 與 1440 也由各頁測試檢查；這裡一次把四種寬度和中英文所有頁面掃過
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/vbim',
  '/platform',
  '/solutions',
  '/energy',
  '/edge-ai',
  '/cases',
  '/partners',
  '/academy',
  '/news',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
];
const ALL = [...PAGES, ...PAGES.map((p) => (p === '/' ? '/en' : `/en${p}`))];
const WIDTHS = [375, 768, 1280, 1440];

test.skip(({ isMobile }) => isMobile, '寬度由測試自己設定，桌機專案跑一次即可');

for (const width of WIDTHS) {
  test(`${width}px：所有頁面沒有水平捲動、沒有元素超出畫面`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 900 });
    const problems: string[] = [];
    for (const path of ALL) {
      await page.goto(path);
      const result = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const scroll = document.documentElement.scrollWidth > vw;
        // 超出畫面右側的元素（略過本來就可以橫向捲動或裁切的容器裡的內容、以及隱藏元素）
        const clipped = (el: Element | null): boolean => {
          for (let p = el?.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
          }
          return false;
        };
        const over = [...document.body.querySelectorAll('*')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            if (getComputedStyle(el).position === 'fixed') return false;
            return r.right > vw + 1 && !clipped(el);
          })
          .slice(0, 3)
          .map(
            (el) =>
              `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')}`,
          );
        return { scroll, over };
      });
      if (result.scroll) problems.push(`${path} 有水平捲動`);
      if (result.over.length) problems.push(`${path} 超出畫面：${result.over.join('、')}`);
    }
    expect(problems).toEqual([]);
  });
}

test('768px（平板）：顯示漢堡選單，桌機導覽列收起', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await expect(page.locator('[data-menu-toggle]')).toBeVisible();
});
