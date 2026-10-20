import { describe, expect, it } from 'vitest';
import {
  availableCategories,
  needsDetailPage,
  newsListPath,
  newsRoutes,
  pageSlice,
  pickFeatured,
  pickForLocale,
  relatedNews,
  totalPages,
  type RawNewsFull,
} from '../../src/lib/news-data';
import { pickCases } from '../../src/lib/cms-pages';
import { dimensionsFromRef, isExternalUrl, youtubeId } from '../../src/lib/rich-text';

const n = (over: Partial<RawNewsFull>): RawNewsFull => ({
  _id: Math.random().toString(36).slice(2),
  language: 'zh-Hant',
  title: '標題',
  slug: 's',
  category: 'news',
  publishedAt: '2026-01-01T00:00:00Z',
  ...over,
});

describe('pickForLocale（語言備援）', () => {
  const items = [
    n({
      _id: 'a-zh',
      group: 'A',
      language: 'zh-Hant',
      title: 'A 中文',
      publishedAt: '2026-03-01T00:00:00Z',
    }),
    n({
      _id: 'a-en',
      group: 'A',
      language: 'en',
      title: 'A English',
      publishedAt: '2026-03-01T00:00:00Z',
    }),
    n({
      _id: 'b-zh',
      group: 'B',
      language: 'zh-Hant',
      title: 'B 只有中文',
      publishedAt: '2026-05-01T00:00:00Z',
    }),
  ];

  it('英文：有英文版用英文版，沒有就用中文版並標記 fallback', () => {
    const en = pickForLocale(items, 'en');
    expect(en.map((x) => [x.title, x.fallback])).toEqual([
      ['B 只有中文', true],
      ['A English', false],
    ]);
  });

  it('中文：一律用中文版', () => {
    expect(pickForLocale(items, 'zh-Hant').every((x) => !x.fallback)).toBe(true);
  });

  it('沒有翻譯連結資料的文件各自獨立', () => {
    expect(pickForLocale([n({ _id: 'x' }), n({ _id: 'y' })], 'zh-Hant')).toHaveLength(2);
  });
});

describe('needsDetailPage', () => {
  it('一般新聞需要內頁', () => expect(needsDetailPage(n({ category: 'news' }))).toBe(true));
  it('媒體報導連外部，不需要', () =>
    expect(needsDetailPage(n({ category: 'media', externalUrl: 'https://a.com' }))).toBe(false));
  it('產品發表有站內連結，不需要', () =>
    expect(needsDetailPage(n({ category: 'product', internalPath: '/vbim' }))).toBe(false));
  it('產品發表沒有站內連結，需要', () =>
    expect(needsDetailPage(n({ category: 'product' }))).toBe(true));
  it('保留字代稱（page／category）不產生內頁', () =>
    expect(needsDetailPage(n({ slug: 'page' }))).toBe(false));
});

describe('分頁', () => {
  it('每頁 12 則', () => {
    expect(totalPages(0)).toBe(1);
    expect(totalPages(12)).toBe(1);
    expect(totalPages(13)).toBe(2);
    expect(pageSlice([...Array(13).keys()], 2)).toEqual([12]);
  });
  it('列表網址', () => {
    expect(newsListPath(null)).toBe('/news');
    expect(newsListPath(null, 2)).toBe('/news/page/2');
    expect(newsListPath('media')).toBe('/news/category/media');
    expect(newsListPath('media', 3)).toBe('/news/category/media/page/3');
  });
});

describe('newsRoutes（要產生的網址）', () => {
  const entries = pickForLocale(
    [
      ...Array.from({ length: 13 }, (_, i) =>
        n({ _id: `m${i}`, slug: `m${i}`, category: 'media', externalUrl: 'https://a.com' }),
      ),
      n({ _id: 'p', slug: 'p', category: 'product', internalPath: '/vbim', featured: true }),
      n({ _id: 'e', slug: 'event-1', category: 'event' }),
    ],
    'zh-Hant',
  );
  const paths = newsRoutes(entries).map((r) => r.path ?? '');

  it('全部（不含置頂精選）14 則 → 2 頁', () =>
    expect(paths).toEqual(expect.arrayContaining(['', 'page/2'])));
  it('有內容的分類才產生', () => {
    expect(paths).toEqual(
      expect.arrayContaining(['category/media', 'category/media/page/2', 'category/event']),
    );
    expect(paths).not.toContain('category/hackathon');
  });
  it('只有需要內頁的消息產生內頁', () => {
    expect(paths).toContain('event-1');
    expect(paths).not.toContain('m0');
    expect(paths).not.toContain('p');
  });
  it('置頂精選與分類順序', () => {
    expect(pickFeatured(entries)?._id).toBe('p');
    expect(availableCategories(entries)).toEqual(['event', 'product', 'media']);
  });
  it('相關消息最多 3 則、同分類優先、不含自己', () => {
    const related = relatedNews(
      entries,
      entries.find((x) => x._id === 'm0')!,
    );
    expect(related).toHaveLength(3);
    expect(related.every((x) => x.category === 'media' && x._id !== 'm0')).toBe(true);
  });
});

describe('pickCases', () => {
  it('依語言挑版本，沒有網址代稱的略過', () => {
    const list = pickCases(
      [
        { _id: '1', group: 'G', language: 'zh-Hant', title: '案例', slug: 'case-a' },
        { _id: '2', group: 'G', language: 'en', title: 'Case', slug: 'case-a' },
        { _id: '3', language: 'zh-Hant', title: '沒有代稱' },
      ],
      'en',
    );
    expect(list.map((c) => [c.title, c.fallback])).toEqual([['Case', false]]);
  });
});

describe('內文工具', () => {
  it('從圖片編號取尺寸', () => {
    expect(dimensionsFromRef('image-abc123-1600x900-jpg')).toEqual({ width: 1600, height: 900 });
    expect(dimensionsFromRef('bad')).toBeUndefined();
  });
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://example.com/watch?v=dQw4w9WgXcQ', undefined],
    ['not a url', undefined],
  ])('YouTube ID：%s', (url, id) => expect(youtubeId(url)).toBe(id));
  it('外部連結判斷', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
    expect(isExternalUrl('https://aiiivbim.com/news')).toBe(false);
    expect(isExternalUrl('/contact')).toBe(false);
  });
});
