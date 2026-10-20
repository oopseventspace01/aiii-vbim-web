// 全站共用資料（頁尾公司資訊）：同一次建置只向 Sanity 查一次
import { sanityClient } from './sanity';
import { LATEST_MEDIA_QUERY, SETTINGS_QUERY } from './queries';
import {
  toFooterInfo,
  toNewsCard,
  type NewsCardData,
  type RawNews,
  type RawSettings,
} from './home-data';
import { FOOTER_FALLBACK, type FooterInfo } from '../data/site-fallback';
import type { Locale } from './i18n';

const cache = new Map<Locale, Promise<FooterInfo>>();

export function getFooterInfo(locale: Locale): Promise<FooterInfo> {
  let pending = cache.get(locale);
  if (!pending) {
    pending = sanityClient()
      .fetch<RawSettings | null>(SETTINGS_QUERY, { lang: locale })
      .then((raw) => toFooterInfo(raw, FOOTER_FALLBACK[locale]));
    cache.set(locale, pending);
  }
  return pending;
}

/** 最新媒體報導 n 則（已轉成卡片資料） */
export async function getLatestMedia(locale: Locale, count: number): Promise<NewsCardData[]> {
  const raw = await sanityClient().fetch<RawNews[]>(LATEST_MEDIA_QUERY, { lang: locale });
  return raw
    .map((n) => toNewsCard(n, locale))
    .filter((n): n is NewsCardData => Boolean(n))
    .slice(0, count);
}
