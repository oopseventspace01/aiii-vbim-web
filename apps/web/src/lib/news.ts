// 消息卡片顯示用的小工具（純函式，方便單元測試）
import { localizePath, type Locale } from './i18n';

/**
 * 日期文字：有「顯示日期」（例如 2026、2026.06）就照原文顯示；
 * 否則用發布時間格式化為 2026.06.01（台北時區）。
 */
export function newsDateLabel(
  displayDate: string | null | undefined,
  publishedAt?: string | null,
): string {
  if (displayDate && displayDate.trim()) return displayDate.trim();
  if (!publishedAt) return '';
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  return parts.replaceAll('-', '.');
}

export const NEWS_CATEGORY_LABEL: Record<string, Record<Locale, string>> = {
  news: { 'zh-Hant': '新聞', en: 'News' },
  event: { 'zh-Hant': '活動', en: 'Event' },
  hackathon: { 'zh-Hant': '黑客松', en: 'Hackathon' },
  media: { 'zh-Hant': '媒體報導', en: 'Media' },
  product: { 'zh-Hant': '產品發表', en: 'Product' },
  insight: { 'zh-Hant': '知識專欄', en: 'Insights' },
};

export function categoryLabel(category: string | undefined, locale: Locale): string {
  return (category && NEWS_CATEGORY_LABEL[category]?.[locale]) || '';
}

/** 沒有封面時的預設圖文字：媒體名稱 → 分類 → 品牌名（SPEC 5.2：不可出現破圖） */
export function coverFallbackText(
  source: string | undefined,
  category: string | undefined,
  locale: Locale,
): string {
  return source?.trim() || categoryLabel(category, locale) || 'Aiii VBIM';
}

/**
 * 消息連結：
 *  媒體報導 → 外部原文（開新分頁）
 *  產品發表且有站內連結 → 站內頁面（例如 /edge-ai）
 *  其他 → 消息內頁 /news/{slug}
 */
export function newsLink(
  item: { category?: string; externalUrl?: string; internalPath?: string; slug?: string },
  locale: Locale,
) {
  if (item.category === 'media' && item.externalUrl) {
    return { href: item.externalUrl, external: true };
  }
  if (
    item.category === 'product' &&
    item.internalPath?.startsWith('/') &&
    !item.internalPath.startsWith('//')
  ) {
    return { href: localizePath(item.internalPath, locale), external: false };
  }
  return { href: localizePath(`/news/${item.slug ?? ''}`, locale), external: false };
}
