import { describe, expect, it } from 'vitest';
import { categoryLabel, coverFallbackText, newsDateLabel, newsLink } from '../../src/lib/news';

describe('newsDateLabel', () => {
  it('有顯示日期時照原文', () =>
    expect(newsDateLabel('2026.06', '2026-06-01T00:00:00Z')).toBe('2026.06'));
  it('顯示日期空白時用發布時間（台北時區）', () =>
    expect(newsDateLabel('  ', '2026-10-19T20:00:00Z')).toBe('2026.10.20'));
  it('都沒有時回傳空字串', () => expect(newsDateLabel(undefined, undefined)).toBe(''));
  it('無效日期回傳空字串', () => expect(newsDateLabel(null, 'not-a-date')).toBe(''));
});

describe('categoryLabel', () => {
  it('中文', () => expect(categoryLabel('media', 'zh-Hant')).toBe('媒體報導'));
  it('英文', () => expect(categoryLabel('event', 'en')).toBe('Event'));
  it('未知分類', () => expect(categoryLabel('unknown', 'en')).toBe(''));
});

describe('coverFallbackText（沒有封面時的預設圖文字）', () => {
  it('優先用媒體名稱', () =>
    expect(coverFallbackText('Yahoo News', 'media', 'zh-Hant')).toBe('Yahoo News'));
  it('沒有媒體名稱用分類', () =>
    expect(coverFallbackText(undefined, 'event', 'zh-Hant')).toBe('活動'));
  it('都沒有用品牌名', () => expect(coverFallbackText('', undefined, 'en')).toBe('Aiii VBIM'));
});

describe('newsLink', () => {
  it('媒體報導連外部並開新分頁', () =>
    expect(newsLink({ category: 'media', externalUrl: 'https://a.com/x' }, 'zh-Hant')).toEqual({
      href: 'https://a.com/x',
      external: true,
    }));
  it('一般消息連站內內頁（英文加 /en）', () =>
    expect(newsLink({ category: 'news', slug: 'hello' }, 'en')).toEqual({
      href: '/en/news/hello',
      external: false,
    }));
  it('產品發表有站內連結 → 連到該頁', () =>
    expect(newsLink({ category: 'product', internalPath: '/edge-ai', slug: 'x' }, 'en')).toEqual({
      href: '/en/edge-ai',
      external: false,
    }));
  it('產品發表的站內連結不可被當成外部網址', () =>
    expect(
      newsLink({ category: 'product', internalPath: '//evil.com', slug: 'x' }, 'zh-Hant').href,
    ).toBe('/news/x'));
  it('產品發表分類名稱', () => expect(categoryLabel('product', 'zh-Hant')).toBe('產品發表'));
});
