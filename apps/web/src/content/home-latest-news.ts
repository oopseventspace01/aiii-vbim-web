// 首頁 Hero 正下方的「最新消息」大卡片（2026-11-19 業主要求放在最顯眼的位置）
//
// 資料來源：後台（Sanity）的消息文件，不在程式裡寫死標題／說明／照片。
// 目前指定顯示「內政部建築研究所 · 2025.09」那則（slug：abri-net-zero-showcase），
// 文字與照片和 design/pages/News.dc.html、content/design/News.json 的原文一致（單元測試會比對）。
//
// 之後要換成別則消息：把 HOME_LATEST_NEWS_SLUG 改成那則消息在後台的「網址代稱（slug）」即可；
// 如果指定的消息被刪掉或找不到，會自動改顯示後台「最新的一則媒體報導」，首頁不會空白。
import type { Locale } from '../lib/i18n';
import { toNewsCard, type NewsCardData, type RawNews } from '../lib/home-data';

export const HOME_LATEST_NEWS_SLUG = 'abri-net-zero-showcase';

const IMAGE = `{ alt, asset->{ _id, url, metadata { dimensions { width, height } } } }`;
const FIELDS = `language, title, "slug": slug.current, category, source, externalUrl, internalPath,
  publishedAt, displayDate, excerpt, cover ${IMAGE}`;

/** 指定的那則（兩種語言）＋最新幾則媒體報導（備援用） */
export const HOME_LATEST_NEWS_QUERY = `{
  "pinned": *[_type == "news" && slug.current == $slug]{ ${FIELDS} },
  "recent": *[_type == "news" && category == "media" && defined(publishedAt)]
    | order(publishedAt desc)[0...6]{ ${FIELDS} }
}`;

export interface RawLatestNews extends RawNews {
  language?: string | null;
}

export interface LatestNewsResult {
  pinned?: RawLatestNews[] | null;
  recent?: RawLatestNews[] | null;
}

export interface LatestNews {
  card: NewsCardData;
  /** 這個語言沒有翻譯，顯示的是另一個語言的版本 */
  fallback: boolean;
}

/** 先挑同語言版本；沒有就用另一個語言版本（SPEC 第 2 節 fallback 規則） */
function pickLocale(items: RawLatestNews[], locale: Locale) {
  const own = items.find((i) => i.language === locale);
  return own ? { raw: own, fallback: false } : items[0] && { raw: items[0], fallback: true };
}

export function pickLatestNews(
  result: LatestNewsResult | null | undefined,
  locale: Locale,
): LatestNews | undefined {
  const pinned = pickLocale(result?.pinned ?? [], locale);
  const chosen =
    pinned ??
    // 備援：最新一則媒體報導（同一則的中英文版 slug 相同，先找同語言）
    (() => {
      const recent = result?.recent ?? [];
      const first = recent[0];
      if (!first) return undefined;
      return pickLocale(
        recent.filter((r) => r.slug === first.slug),
        locale,
      );
    })();
  if (!chosen) return undefined;
  const card = toNewsCard(chosen.raw, locale);
  return card ? { card, fallback: chosen.fallback } : undefined;
}

export const HOME_LATEST_NEWS_COPY: Record<
  Locale,
  { title: string; viewAll: string; newTab: string }
> = {
  'zh-Hant': { title: '最新消息', viewAll: '看全部消息 →', newTab: '（另開新視窗）' },
  en: { title: 'Latest News', viewAll: 'View all news →', newTab: '(opens in a new tab)' },
};
