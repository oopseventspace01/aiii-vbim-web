// P6 SEO：網址、標題、hreflang、結構化資料、子集字型取字、舊網址轉址
import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  alternateLinks,
  articleJsonLd,
  breadcrumbJsonLd,
  softwareJsonLd,
  eventJsonLd,
  jsonLdString,
  localeAlternates,
  organizationJsonLd,
  pageTitle,
} from '../../src/lib/seo';
import { FOOTER_FALLBACK } from '../../src/data/site-fallback';
import { collectText } from '../../integrations/site-font.mjs';
import { REDIRECTS, SHORTCUTS, STUDIO_URL } from '../../redirects.mjs';

describe('網址與標題', () => {
  it('絕對網址：去掉結尾斜線，根目錄保留 /', () => {
    expect(absoluteUrl('/')).toBe('https://aiiivbim.com/');
    expect(absoluteUrl('/platform/')).toBe('https://aiiivbim.com/platform');
    expect(absoluteUrl('en/news')).toBe('https://aiiivbim.com/en/news');
    expect(absoluteUrl('https://cdn.sanity.io/x.jpg')).toBe('https://cdn.sanity.io/x.jpg');
  });

  it('標題加上品牌名稱，已含品牌就不重複', () => {
    expect(pageTitle('平台 OS', 'zh-Hant')).toBe('平台 OS｜Aiii VBIM');
    expect(pageTitle('Platform', 'en')).toBe('Platform | Aiii VBIM');
    expect(pageTitle('Aiii VBIM OS 2.0', 'zh-Hant')).toBe('Aiii VBIM OS 2.0');
    expect(pageTitle('  ', 'en')).toBe('Aiii VBIM');
  });

  it('hreflang：中文、英文、x-default（指向中文）', () => {
    expect(alternateLinks(localeAlternates('/platform'))).toEqual([
      { hreflang: 'zh-Hant', href: 'https://aiiivbim.com/platform' },
      { hreflang: 'en', href: 'https://aiiivbim.com/en/platform' },
      { hreflang: 'x-default', href: 'https://aiiivbim.com/platform' },
    ]);
    expect(localeAlternates('/en')).toEqual({ 'zh-Hant': '/', en: '/en' });
  });
});

describe('結構化資料', () => {
  it('公司資料來自全站設定', () => {
    const org = organizationJsonLd(
      { ...FOOTER_FALLBACK['zh-Hant'], lineOfficialUrl: 'https://lin.ee/x' },
      'zh-Hant',
    );
    expect(org).toMatchObject({
      '@type': 'Organization',
      name: 'Aiii VBIM',
      legalName: FOOTER_FALLBACK['zh-Hant'].companyName,
      url: 'https://aiiivbim.com/',
      logo: 'https://aiiivbim.com/icon-512.png',
      sameAs: ['https://lin.ee/x'],
    });
  });

  const base = {
    title: '測試消息',
    url: '/news/test',
    publishedAt: '2026-10-01T00:00:00Z',
    language: 'zh-Hant',
  };

  it('文章：沒有封面就用預設分享圖', () => {
    const a = articleJsonLd(base);
    expect(a).toMatchObject({
      '@type': 'Article',
      headline: '測試消息',
      datePublished: base.publishedAt,
    });
    expect(a.image).toEqual(['https://aiiivbim.com/og-default.png']);
  });

  it('活動：缺日期或地點就不輸出（Google 規定）', () => {
    expect(eventJsonLd({ ...base, startDate: null, location: '台北' })).toBeNull();
    expect(eventJsonLd({ ...base, startDate: '2026-11-01T09:00:00Z', location: '' })).toBeNull();
    expect(
      eventJsonLd({ ...base, startDate: '2026-11-01T09:00:00Z', location: '台北' }),
    ).toMatchObject({
      '@type': 'Event',
      startDate: '2026-11-01T09:00:00Z',
      location: { name: '台北' },
    });
  });

  it('JSON-LD 字串不會被內容裡的 </script> 截斷', () => {
    expect(jsonLdString({ t: '</script><b>' })).not.toContain('</script>');
  });
});

describe('子集字型取字', () => {
  it('只取看得到的文字，依出現頁數排序，並包含空白', () => {
    const text = collectText([
      '<html><head><style>.a{}</style><script>var 程式 = 1</script></head><body><p>平台&amp;AI</p></body></html>',
      '<p>平台</p>',
    ]);
    expect(text.startsWith(' ')).toBe(true);
    expect(text.indexOf('平')).toBeLessThan(text.indexOf('A'));
    expect(text).toContain('&');
    expect(text).not.toContain('程');
    expect(text).not.toContain('<');
  });
});

describe('舊網址轉址', () => {
  it('舊網站的英文頁轉到 /en；其餘舊網址新網站本來就有', () => {
    expect(REDIRECTS).toEqual({ '/aiiivbim-en': '/en' });
    for (const [from, to] of Object.entries(REDIRECTS)) {
      expect(from.startsWith('/')).toBe(true);
      expect(to.startsWith('/')).toBe(true);
    }
  });

  it('/admin 捷徑轉到後台（Sanity 官方主機）', () => {
    expect(SHORTCUTS).toEqual({ '/admin': STUDIO_URL });
    expect(STUDIO_URL).toMatch(/^https:\/\/[a-z0-9-]+\.sanity\.studio$/);
  });
});

describe('AEO／GEO 結構化資料', () => {
  it('軟體產品：下載連結來自全站設定，不放評分', () => {
    const app = softwareJsonLd(FOOTER_FALLBACK['zh-Hant'], '說明');
    expect(app).toMatchObject({ '@type': 'SoftwareApplication', name: 'Aiii VBIM' });
    expect(app.downloadUrl).toEqual([
      FOOTER_FALLBACK['zh-Hant'].appStoreUrl,
      FOOTER_FALLBACK['zh-Hant'].googlePlayUrl,
    ]);
    expect(app).not.toHaveProperty('aggregateRating');
  });

  it('麵包屑：首頁沒有，內頁依序列出', () => {
    expect(breadcrumbJsonLd([{ name: 'Aiii VBIM', path: '/' }])).toBeNull();
    const b = breadcrumbJsonLd([
      { name: 'Aiii VBIM', path: '/' },
      { name: '平台 OS', path: '/platform' },
    ]);
    expect(b?.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, 'https://aiiivbim.com/'],
      [2, 'https://aiiivbim.com/platform'],
    ]);
  });
});
