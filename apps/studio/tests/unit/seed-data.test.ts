import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  APP_LINKS,
  HERO_POSTER_FILE,
  MEDIA_NEWS,
  PRODUCT_NEWS,
  SITE_SETTINGS,
  sortableDates,
} from '../../../../scripts/seed-data';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const assetPath = (file: string) => `${root}design/assets/${file}`;

// CLAUDE.md：網站任何地方都不可出現這些名稱
const BANNED = [
  'WSP',
  '群聯',
  'Phison',
  'aiDAPTIV',
  'Pascari',
  '長庚',
  '台塑',
  '台泥',
  '三菱重工',
  '大金',
  'Panasonic',
  '東元',
];

describe('媒體報導種子資料', () => {
  it('共 13 則（SPEC 第 15 節）', () => expect(MEDIA_NEWS).toHaveLength(13));

  it('代稱不重複', () => {
    expect(new Set(MEDIA_NEWS.map((n) => n.key)).size).toBe(MEDIA_NEWS.length);
  });

  it.each(MEDIA_NEWS.map((n) => [n.key, n] as const))(
    '%s：中英文欄位齊全、連結與封面有效',
    (_, n) => {
      for (const lang of [n.zh, n.en]) {
        expect(lang.title.trim()).not.toBe('');
        expect(lang.source.trim()).not.toBe('');
        expect(lang.excerpt.trim()).not.toBe('');
      }
      expect(n.url).toMatch(/^https:\/\//);
      expect(n.date).toMatch(/^\d{4}(\.\d{2})?$/);
      expect(existsSync(assetPath(n.cover)), `封面檔案不存在：${n.cover}`).toBe(true);
    },
  );

  it('中文摘要都在 120 字內', () => {
    for (const n of MEDIA_NEWS) expect([...n.zh.excerpt].length, n.key).toBeLessThanOrEqual(120);
  });

  it('文案與設計稿一致（逐字轉出）', () => {
    const zhPage = readFileSync(`${root}design/pages/News.dc.html`, 'utf-8');
    const enPage = readFileSync(`${root}design/pages/en-News.dc.html`, 'utf-8');
    for (const n of MEDIA_NEWS) {
      expect(zhPage).toContain(n.zh.title);
      expect(enPage).toContain(n.en.title);
    }
  });
});

describe('排序用日期（sortableDates）', () => {
  const dates = sortableDates(MEDIA_NEWS.map((n) => n.date));

  it('照設計稿順序由新到舊、不重複', () => {
    for (let i = 1; i < dates.length; i++) {
      expect(Date.parse(dates[i]!)).toBeLessThan(Date.parse(dates[i - 1]!));
    }
  });

  it('有月份時落在該月或更早', () => {
    expect(sortableDates(['2026.10'], Date.UTC(2026, 9, 20))[0]).toBe('2026-10-01T00:00:00.000Z');
  });

  it('只有年份時不會超過現在時間（避免變成預約發布）', () => {
    const now = Date.UTC(2026, 9, 20);
    expect(Date.parse(sortableDates(['2026'], now)[0]!)).toBeLessThanOrEqual(now);
  });
});

describe('全站設定種子資料', () => {
  it.each(['zh', 'en'] as const)('%s：背書條 1～4 筆、必填欄位都有值', (key) => {
    const s = SITE_SETTINGS[key];
    expect(s.proofItems.length).toBeGreaterThanOrEqual(1);
    expect(s.proofItems.length).toBeLessThanOrEqual(4);
    for (const field of [
      'heroTitle',
      'heroSubtitle',
      'heroBody',
      'companyName',
      'address',
      'phone',
      'email',
      'footerTagline',
    ] as const) {
      expect(s[field].trim(), field).not.toBe('');
    }
    expect([...s.metaTitle].length).toBeLessThanOrEqual(60);
    expect([...s.metaDescription].length).toBeLessThanOrEqual(160);
  });

  it('公司 Email 為有效格式，中英文版一致', () => {
    expect(SITE_SETTINGS.zh.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(SITE_SETTINGS.en.email).toBe(SITE_SETTINGS.zh.email);
  });

  it('App 下載連結與 SPEC 第 15 節一致', () => {
    expect(APP_LINKS.appStoreUrl).toBe('https://apps.apple.com/tw/app/aiii-vbim/id6781813710');
    expect(APP_LINKS.googlePlayUrl).toBe(
      'https://play.google.com/store/apps/details?id=ai.aiii.vbim',
    );
  });

  it('封面圖檔存在', () => expect(existsSync(assetPath(HERO_POSTER_FILE))).toBe(true));
});

describe('禁用名稱檢查', () => {
  it('種子資料不含業主指示不可出現的名稱', () => {
    const text = JSON.stringify({ MEDIA_NEWS, SITE_SETTINGS });
    for (const word of BANNED) expect(text, word).not.toContain(word);
  });
});

describe('產品發表種子資料（v1.4）', () => {
  it('共 3 則，站內連結與封面有效', () => {
    expect(PRODUCT_NEWS).toHaveLength(3);
    for (const n of PRODUCT_NEWS) {
      expect(n.internalPath).toMatch(/^\/[a-z-]+$/);
      expect(existsSync(assetPath(n.cover)), n.cover).toBe(true);
      for (const lang of [n.zh, n.en]) {
        expect(lang.title.trim()).not.toBe('');
        expect(lang.alt.trim()).not.toBe('');
      }
    }
  });

  it('文案與設計稿一致', () => {
    const zhPage = readFileSync(`${root}design/pages/News.dc.html`, 'utf-8');
    const enPage = readFileSync(`${root}design/pages/en-News.dc.html`, 'utf-8');
    for (const n of PRODUCT_NEWS) {
      expect(zhPage).toContain(n.zh.title);
      expect(enPage).toContain(n.en.title);
    }
  });

  it('不含禁用名稱', () => {
    const text = JSON.stringify(PRODUCT_NEWS);
    for (const word of BANNED) expect(text, word).not.toContain(word);
  });
});
