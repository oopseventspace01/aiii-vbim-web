// 網站地圖瘦身：不收錄的頁面與指向它們的 hreflang 要從網站地圖拿掉
import { describe, expect, it } from 'vitest';
import { pruneSitemap } from '../../integrations/sitemap-noindex.mjs';

const S = 'https://aiiivbim.com';
const link = (lang: string, path: string) =>
  `<xhtml:link rel="alternate" hreflang="${lang}" href="${S}${path}"/>`;
const url = (path: string, zh: string, en: string) =>
  `<url><loc>${S}${path}</loc>${link('zh-Hant', zh)}${link('en', en)}${link('x-default', zh)}</url>`;
const xml = `<urlset>${url('/platform', '/platform', '/en/platform')}${url('/en/platform', '/platform', '/en/platform')}${url('/news/a', '/news/a', '/en/news/a')}${url('/en/news/a', '/news/a', '/en/news/a')}</urlset>`;

describe('pruneSitemap', () => {
  const noindex = new Set([`${S}/en/news/a`]);
  const { xml: out, removed } = pruneSitemap(xml, (loc: string) => noindex.has(loc));

  it('拿掉不收錄的頁面', () => {
    expect(removed).toEqual([`${S}/en/news/a`]);
    expect(out).not.toContain(`<loc>${S}/en/news/a</loc>`);
  });

  it('中文頁不再用 hreflang 指向不收錄的英文頁；只剩自己時整組拿掉', () => {
    const block = out.match(/<url><loc>https:\/\/aiiivbim\.com\/news\/a<\/loc>.*?<\/url>/)?.[0];
    expect(block).toBe(`<url><loc>${S}/news/a</loc></url>`);
  });

  it('其他頁面的中英文對應不受影響', () => {
    expect(out).toContain(url('/platform', '/platform', '/en/platform'));
    expect(out).toContain(url('/en/platform', '/platform', '/en/platform'));
  });

  it('沒有不收錄頁面時原封不動', () => {
    expect(pruneSitemap(xml, () => false)).toEqual({ xml, removed: [] });
  });
});
