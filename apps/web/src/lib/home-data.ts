// 把 Sanity 查詢結果整理成首頁元件要的格式（純函式，方便單元測試）
import type { Locale } from './i18n';
import { newsDateLabel, newsLink } from './news';
import type { FooterInfo } from '../data/site-fallback';

export interface RawImage {
  alt?: string | null;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
  } | null;
}

export interface RawNews {
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  source?: string | null;
  externalUrl?: string | null;
  internalPath?: string | null;
  publishedAt?: string | null;
  displayDate?: string | null;
  excerpt?: string | null;
  cover?: RawImage | null;
}

export interface RawSettings {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroBody?: string | null;
  heroVideoUrl?: string | null;
  heroPoster?: RawImage | null;
  proofItems?: { label?: string | null; value?: string | null }[] | null;
  commandCenterImage?: RawImage | null;
  companyName?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  appStoreUrl?: string | null;
  googlePlayUrl?: string | null;
  lineOfficialUrl?: string | null;
  lineQrCode?: RawImage | null;
  socialLinks?: { platform?: string | null; url?: string | null }[] | null;
  footerTagline?: string | null;
  homeNewsCount?: number | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
}

export interface RawHome {
  settings?: RawSettings | null;
  product?: RawNews[] | null;
  media?: RawNews[] | null;
}

export interface ImageRef {
  /** 原始資料，交給 imageUrl() 產生尺寸網址 */
  source: RawImage;
  alt: string;
  width: number;
  height: number;
}

export interface NewsCardData {
  title: string;
  href: string;
  external: boolean;
  category: string;
  source?: string;
  dateLabel: string;
  excerpt?: string;
  cover?: ImageRef;
}

const text = (v: string | null | undefined) => (typeof v === 'string' ? v.trim() : '');

/** 圖片有上傳才回傳；替代文字空白時用 fallbackAlt，避免出現沒有 alt 的圖片 */
export function toImage(raw: RawImage | null | undefined, fallbackAlt = ''): ImageRef | undefined {
  if (!raw?.asset?.url) return undefined;
  const dims = raw.asset.metadata?.dimensions;
  return {
    source: raw,
    alt: text(raw.alt) || fallbackAlt,
    width: dims?.width ?? 1600,
    height: dims?.height ?? 1000,
  };
}

export function toNewsCard(raw: RawNews, locale: Locale): NewsCardData | undefined {
  const title = text(raw.title);
  if (!title) return undefined;
  const link = newsLink(
    {
      category: raw.category ?? undefined,
      externalUrl: raw.externalUrl ?? undefined,
      internalPath: raw.internalPath ?? undefined,
      slug: raw.slug ?? undefined,
    },
    locale,
  );
  return {
    title,
    href: link.href,
    external: link.external,
    category: raw.category ?? 'news',
    source: text(raw.source) || undefined,
    dateLabel: newsDateLabel(raw.displayDate, raw.publishedAt),
    excerpt: text(raw.excerpt) || undefined,
    cover: toImage(raw.cover, title),
  };
}

/** 首頁最新消息則數：3～5，其他值一律用 3 */
export function clampNewsCount(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 3 && value <= 5
    ? value
    : 3;
}

/** 頁尾資訊：後台有值用後台，沒值用設計稿的預設值 */
export function toFooterInfo(
  raw: RawSettings | null | undefined,
  fallback: FooterInfo,
): FooterInfo {
  const pick = (v: string | null | undefined, f?: string) => text(v) || f;
  return {
    companyName: pick(raw?.companyName, fallback.companyName)!,
    address: pick(raw?.address, fallback.address)!,
    phone: pick(raw?.phone, fallback.phone)!,
    email: pick(raw?.email, fallback.email),
    footerTagline: pick(raw?.footerTagline, fallback.footerTagline)!,
    appStoreUrl: pick(raw?.appStoreUrl, fallback.appStoreUrl),
    googlePlayUrl: pick(raw?.googlePlayUrl, fallback.googlePlayUrl),
    lineOfficialUrl: pick(raw?.lineOfficialUrl, fallback.lineOfficialUrl),
    lineQrCode: (() => {
      const img = toImage(raw?.lineQrCode, 'LINE QR Code');
      return img?.source.asset?.url
        ? { url: img.source.asset.url, alt: img.alt, width: img.width, height: img.height }
        : undefined;
    })(),
    socialLinks: (raw?.socialLinks ?? [])
      .map((s) => ({ platform: text(s.platform), url: text(s.url) }))
      .filter((s) => s.platform && s.url),
  };
}

export interface HomeData {
  heroTitleLines: string[];
  heroSubtitle: string;
  heroBody: string;
  heroVideoUrl?: string;
  heroPoster?: ImageRef;
  proofItems: { label: string; value: string }[];
  commandCenterImage?: ImageRef;
  product: NewsCardData[];
  media: NewsCardData[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * 首頁標語依句號斷行：「One OS. Every Building. Every System.」→ 三行（設計稿的換行方式）。
 * 中文標語沒有英文句點時維持一行。
 */
export function splitHeroTitle(title: string): string[] {
  const parts =
    title
      .match(/[^.]+\.?/g)
      ?.map((p) => p.trim())
      .filter(Boolean) ?? [];
  return parts.length > 0 ? parts : [title];
}

export function toHomeData(raw: RawHome, locale: Locale): HomeData {
  const s = raw.settings;
  if (!s) throw new Error(`Sanity 找不到「全站設定」（${locale}），請確認後台已發布`);
  const count = clampNewsCount(s.homeNewsCount);
  const cards = (list: RawNews[] | null | undefined) =>
    (list ?? [])
      .map((n) => toNewsCard(n, locale))
      .filter((n): n is NewsCardData => Boolean(n))
      .slice(0, count);

  return {
    heroTitleLines: splitHeroTitle(text(s.heroTitle) || 'One OS. Every Building. Every System.'),
    heroSubtitle: text(s.heroSubtitle),
    heroBody: text(s.heroBody),
    heroVideoUrl: text(s.heroVideoUrl) || undefined,
    heroPoster: toImage(s.heroPoster),
    proofItems: (s.proofItems ?? [])
      .map((p) => ({ label: text(p.label), value: text(p.value) }))
      .filter((p) => p.label && p.value)
      .slice(0, 4),
    commandCenterImage: toImage(s.commandCenterImage),
    product: cards(raw.product),
    media: cards(raw.media),
    metaTitle: text(s.seo?.metaTitle) || undefined,
    metaDescription: text(s.seo?.metaDescription) || undefined,
  };
}
