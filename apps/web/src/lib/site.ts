// 全站共用資料（頁尾公司資訊）：同一次建置只向 Sanity 查一次
import { sanityClient } from './sanity';
import { SETTINGS_QUERY } from './queries';
import { toFooterInfo, type RawSettings } from './home-data';
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
