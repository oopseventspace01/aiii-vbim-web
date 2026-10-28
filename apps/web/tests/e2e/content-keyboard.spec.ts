// P7：內容檢查（禁用名稱、佔位內容）與全站鍵盤操作（SPEC 8）
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { BANNED, scan } from '../../scripts/check-content.mjs';

test.describe('內容檢查（建置後）', () => {
  test.skip(({ isMobile }) => isMobile, '只跑一次');

  test('全站沒有禁用名稱；佔位內容列出供上線前處理', async () => {
    const root = fileURLToPath(new URL('../../dist/client/', import.meta.url));
    test.skip(!existsSync(root), '尚未建置');
    const pages = readdirSync(root, { withFileTypes: true, recursive: true })
      .filter((d) => d.isFile() && d.name.endsWith('.html'))
      .map((d) => join(d.parentPath, d.name))
      .filter((f) => !/^dev[\\/]/.test(relative(root, f)))
      .map((f) => ({ path: relative(root, f), html: readFileSync(f, 'utf-8') }));
    expect(pages.length).toBeGreaterThan(20);
    const { banned, placeholders } = scan(pages);
    expect(banned).toEqual([]);
    if (placeholders.length) console.log('上線前要補的佔位內容：', placeholders);
  });

  test('掃描器本身：抓得到禁用名稱，英文名稱比對整個單字', () => {
    expect(BANNED).toContain('WSP');
    const r = scan([
      { path: 'a', html: '<p>與群聯合作</p><img alt="Panasonic">' },
      { path: 'b', html: '<p>NEWSPAPER</p><p>[TBD: 數字]</p>' },
    ]);
    expect(r.banned.map((b) => b.word)).toEqual(['群聯', 'Panasonic']);
    expect(r.placeholders.map((p) => p.text)).toEqual(['[TBD: 數字]']);
  });
});

/** 一直按 Tab，記錄每個拿到焦點的元素 */
async function tabThrough(page: Page, max = 250) {
  const seen: { key: string; visible: boolean; ring: boolean; inFooter: boolean }[] = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    // 網站有平滑捲動：等焦點元素捲進畫面（最多 1.5 秒），沒捲進來才算「看不到」
    await page
      .waitForFunction(
        () => {
          const el = document.activeElement;
          if (!el || el === document.body) return true;
          const r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < innerHeight;
        },
        undefined,
        { timeout: 1500 },
      )
      .catch(() => {});
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const ring =
        (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      // 用元素在頁面中的順序當識別（固定導覽列的座標會跟著捲動變）
      const index = [...document.querySelectorAll('*')].indexOf(el);
      return {
        key: `${index}|${el.tagName}|${el.getAttribute('href') ?? el.getAttribute('name') ?? el.textContent?.trim().slice(0, 20)}`,
        visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
        ring,
        inFooter: Boolean(el.closest('footer')),
      };
    });
    if (!info) continue;
    if (seen.some((s) => s.key === info.key)) break; // 回到已經走過的元素，表示走完一圈
    seen.push(info);
  }
  return seen;
}

test.describe('鍵盤操作', () => {
  test.skip(({ isMobile }) => isMobile, '桌機鍵盤操作');

  for (const path of ['/', '/solutions', '/contact', '/en/platform']) {
    test(`${path}：只用 Tab 就能走到頁尾，焦點都看得到、有焦點外框、不會卡住`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.route('https://challenges.cloudflare.com/**', (route) => route.abort());
      await page.goto(path);
      const seen = await tabThrough(page);
      expect(seen.length, '可以拿到焦點的元素').toBeGreaterThan(10);
      expect(
        seen.some((s) => s.inFooter),
        '能走到頁尾',
      ).toBe(true);
      const hidden = seen.filter((s) => !s.visible).map((s) => s.key);
      expect(hidden, '拿到焦點時不在畫面上').toEqual([]);
      const noRing = seen.filter((s) => !s.ring).map((s) => s.key);
      expect(noRing, '沒有焦點外框').toEqual([]);
    });
  }
});
