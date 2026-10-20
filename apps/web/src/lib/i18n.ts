// 雙語網址工具：中文（預設）不加前綴，英文走 /en（SPEC 第 1、2 節）
export const LOCALES = ['zh-Hant', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh-Hant';

const EN_PREFIX = '/en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** 從網址路徑判斷語言：/en 或 /en/... 為英文，其餘為中文。 */
export function getLocaleFromPath(pathname: string): Locale {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : DEFAULT_LOCALE;
}

/** 去掉語言前綴，得到「不分語言」的路徑：/en/platform → /platform、/en → / */
export function stripLocale(pathname: string): string {
  if (getLocaleFromPath(pathname) !== 'en') return normalize(pathname);
  return normalize(pathname.slice(EN_PREFIX.length));
}

/** 把「不分語言」的路徑轉成指定語言的網址：('/platform','en') → /en/platform */
export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? EN_PREFIX : `${EN_PREFIX}${clean}`;
}

/** 語言切換：目前網址換成另一個語言的同一頁 */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(stripLocale(pathname), target);
}

/** 統一路徑格式：一定以 / 開頭、不以 / 結尾（根目錄除外），保留 ?query 與 #hash */
function normalize(path: string): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  let base = match?.[1] ?? '';
  const rest = match?.[2] ?? '';
  if (!base.startsWith('/')) base = `/${base}`;
  if (base.length > 1) base = base.replace(/\/+$/, '');
  return (base || '/') + rest;
}

/** <html lang> 與 hreflang 用的語言代碼 */
export const HTML_LANG: Record<Locale, string> = { 'zh-Hant': 'zh-Hant', en: 'en' };
