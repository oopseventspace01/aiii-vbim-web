import { describe, expect, it } from 'vitest';
import {
  clampNewsCount,
  splitHeroTitle,
  toFooterInfo,
  toHomeData,
  toImage,
  toNewsCard,
  type RawHome,
  type RawNews,
} from '../../src/lib/home-data';
import { FOOTER_FALLBACK } from '../../src/data/site-fallback';

const img = (alt?: string) => ({
  alt,
  asset: {
    _id: 'image-abc-800x500-jpg',
    url: 'https://cdn.sanity.io/x.jpg',
    metadata: { dimensions: { width: 800, height: 500 } },
  },
});

const news = (over: Partial<RawNews> = {}): RawNews => ({
  title: '標題',
  slug: 's',
  category: 'media',
  source: 'Yahoo News',
  externalUrl: 'https://a.com/',
  publishedAt: '2026-06-01T00:00:00Z',
  displayDate: '2026.06',
  cover: img('封面'),
  ...over,
});

describe('splitHeroTitle（首頁標語斷行）', () => {
  it('英文句點斷成三行', () =>
    expect(splitHeroTitle('One OS. Every Building. Every System.')).toEqual([
      'One OS.',
      'Every Building.',
      'Every System.',
    ]));
  it('中文沒有句點維持一行', () =>
    expect(splitHeroTitle('一個平台管理所有建築')).toEqual(['一個平台管理所有建築']));
});

describe('clampNewsCount（首頁消息則數 3～5）', () => {
  it.each([
    [3, 3],
    [5, 5],
    [2, 3],
    [6, 3],
    [null, 3],
    [4.5, 3],
  ])('%s → %s', (input, out) => expect(clampNewsCount(input as number | null)).toBe(out));
});

describe('toImage', () => {
  it('沒有上傳 → undefined', () => expect(toImage({ alt: 'x' })).toBeUndefined());
  it('alt 空白時用備用文字', () => expect(toImage(img('  '), '備用')?.alt).toBe('備用'));
  it('帶出尺寸', () => expect(toImage(img('a'))).toMatchObject({ width: 800, height: 500 }));
});

describe('toNewsCard', () => {
  it('媒體報導：外部連結、顯示日期、封面', () =>
    expect(toNewsCard(news(), 'zh-Hant')).toMatchObject({
      href: 'https://a.com/',
      external: true,
      dateLabel: '2026.06',
      source: 'Yahoo News',
      cover: { alt: '封面' },
    }));
  it('產品發表：連到站內頁面（英文加 /en）', () =>
    expect(
      toNewsCard(
        news({ category: 'product', internalPath: '/edge-ai', externalUrl: null, source: null }),
        'en',
      ),
    ).toMatchObject({ href: '/en/edge-ai', external: false }));
  it('沒有標題的資料略過', () =>
    expect(toNewsCard(news({ title: ' ' }), 'zh-Hant')).toBeUndefined());
  it('沒有封面 → cover 為 undefined（卡片會顯示預設圖）', () =>
    expect(toNewsCard(news({ cover: null }), 'zh-Hant')?.cover).toBeUndefined());
});

describe('toHomeData', () => {
  const raw = (over: Partial<RawHome> = {}): RawHome => ({
    settings: {
      heroTitle: 'One OS. Every Building. Every System.',
      heroSubtitle: '副標',
      heroBody: '內文',
      proofItems: [
        { label: 'A', value: '1' },
        { label: 'B', value: '2' },
        { label: '', value: '略過' },
        { label: 'C', value: '3' },
        { label: 'D', value: '4' },
        { label: 'E', value: '5' },
      ],
      homeNewsCount: 4,
    },
    product: Array.from({ length: 5 }, (_, i) =>
      news({ title: `P${i}`, category: 'product', internalPath: '/vbim' }),
    ),
    media: Array.from({ length: 5 }, (_, i) => news({ title: `M${i}` })),
    ...over,
  });

  it('依全站設定的則數截取（4 則）', () => {
    const d = toHomeData(raw(), 'zh-Hant');
    expect(d.product).toHaveLength(4);
    expect(d.media).toHaveLength(4);
  });

  it('背書條略過空白項目、最多 4 筆', () =>
    expect(toHomeData(raw(), 'zh-Hant').proofItems.map((p) => p.label)).toEqual([
      'A',
      'B',
      'C',
      'D',
    ]));

  it('沒有影片網址 → heroVideoUrl 為 undefined（顯示插圖）', () =>
    expect(toHomeData(raw(), 'zh-Hant').heroVideoUrl).toBeUndefined());

  it('後台改了標語 → 首頁標語跟著改', () => {
    const r = raw();
    r.settings!.heroTitle = 'New Title. Second Line.';
    expect(toHomeData(r, 'zh-Hant').heroTitleLines).toEqual(['New Title.', 'Second Line.']);
  });

  it('找不到全站設定 → 建置失敗並說明原因（不默默產生錯誤頁面）', () =>
    expect(() => toHomeData({ settings: null }, 'en')).toThrow(/全站設定/));
});

describe('toFooterInfo', () => {
  it('後台有值用後台', () =>
    expect(
      toFooterInfo({ companyName: '新公司', email: 'a@b.com' }, FOOTER_FALLBACK['zh-Hant']),
    ).toMatchObject({
      companyName: '新公司',
      email: 'a@b.com',
      address: FOOTER_FALLBACK['zh-Hant'].address,
    }));
  it('社群連結略過不完整的項目', () =>
    expect(
      toFooterInfo(
        {
          socialLinks: [
            { platform: 'LINE', url: 'https://lin.ee/x' },
            { platform: 'YouTube', url: '' },
          ],
        },
        FOOTER_FALLBACK.en,
      ).socialLinks,
    ).toEqual([{ platform: 'LINE', url: 'https://lin.ee/x' }]));
});
