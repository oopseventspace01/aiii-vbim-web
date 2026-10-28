// SEO 工具：網址、標題、hreflang、結構化資料（SPEC 7）
import { HTML_LANG, LOCALES, localizePath, type Locale } from './i18n';
import type { FooterInfo } from '../data/site-fallback';

export const SITE_URL = 'https://aiiivbim.com';
export const SITE_NAME = 'Aiii VBIM';
export const DEFAULT_OG_IMAGE = '/og-default.png';

/** 絕對網址；路徑統一不帶結尾斜線（根目錄除外） */
export function absoluteUrl(path: string, site = SITE_URL): string {
  if (/^https?:\/\//.test(path)) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return `${site}${p}`;
}

/** 搜尋結果與分頁標題：「頁面名稱｜Aiii VBIM」；已含品牌名稱就不重複加 */
export function pageTitle(title: string, locale: Locale): string {
  const t = title.trim();
  if (!t) return SITE_NAME;
  if (t.includes(SITE_NAME)) return t;
  return locale === 'en' ? `${t} | ${SITE_NAME}` : `${t}｜${SITE_NAME}`;
}

/** hreflang：中文、英文各一，x-default 指向中文版 */
export function alternateLinks(alternates: Record<Locale, string>, site = SITE_URL) {
  const links = LOCALES.map((l) => ({
    hreflang: HTML_LANG[l],
    href: absoluteUrl(alternates[l], site),
  }));
  links.push({ hreflang: 'x-default', href: absoluteUrl(alternates['zh-Hant'], site) });
  return links;
}

/** 某個「不分語言」的路徑在兩種語言的網址（給 sitemap 用） */
export function localeAlternates(path: string): Record<Locale, string> {
  return { 'zh-Hant': localizePath(path, 'zh-Hant'), en: localizePath(path, 'en') };
}

export const OG_LOCALE: Record<Locale, string> = { 'zh-Hant': 'zh_TW', en: 'en_US' };

/** 全站：公司（Organization） */
export function organizationJsonLd(info: FooterInfo, locale: Locale, site = SITE_URL) {
  const sameAs = (info.socialLinks ?? []).map((s) => s.url).filter(Boolean);
  if (info.lineOfficialUrl) sameAs.push(info.lineOfficialUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: info.companyName,
    url: absoluteUrl(localizePath('/', locale), site),
    logo: absoluteUrl('/icon-512.png', site),
    address: info.address,
    telephone: info.phone,
    ...(info.email ? { email: info.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

interface ArticleInput {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: string | null;
  language: string;
}

/** 最新消息內頁：文章（Article） */
export function articleJsonLd(a: ArticleInput, site = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title.slice(0, 110),
    ...(a.description ? { description: a.description } : {}),
    url: absoluteUrl(a.url, site),
    mainEntityOfPage: absoluteUrl(a.url, site),
    image: [absoluteUrl(a.image ?? DEFAULT_OG_IMAGE, site)],
    ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
    inLanguage: a.language,
    author: { '@type': 'Organization', name: SITE_NAME, url: site },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png', site) },
    },
  };
}

/** 活動類消息：活動（Event）。Google 規定要有日期與地點，缺一就不輸出 */
export function eventJsonLd(
  e: ArticleInput & {
    startDate?: string | null;
    location?: string | null;
    registerUrl?: string | null;
  },
  site = SITE_URL,
) {
  if (!e.startDate || !e.location) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    ...(e.description ? { description: e.description } : {}),
    startDate: e.startDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: e.location, address: e.location },
    image: [absoluteUrl(e.image ?? DEFAULT_OG_IMAGE, site)],
    url: absoluteUrl(e.url, site),
    organizer: { '@type': 'Organization', name: SITE_NAME, url: site },
    ...(e.registerUrl ? { offers: { '@type': 'Offer', url: e.registerUrl } } : {}),
  };
}

/** JSON-LD 放進 <script> 前，避免內容裡的 </script> 提早結束標籤 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
