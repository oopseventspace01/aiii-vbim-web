// 最新消息：語言備援、分類、分頁、路由（純函式，方便單元測試）
import type { Locale } from './i18n';
import type { RawImage, RawNews } from './home-data';

export const NEWS_PAGE_SIZE = 12;
export const NEWS_CATEGORIES = [
  'news',
  'event',
  'hackathon',
  'product',
  'media',
  'insight',
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** 這些網址代稱被列表網址使用，消息不可用 */
export const RESERVED_SLUGS = new Set(['page', 'category']);

export interface RawNewsFull extends RawNews {
  _id: string;
  language?: string | null;
  featured?: boolean | null;
  eventDate?: string | null;
  eventLocation?: string | null;
  registerUrl?: string | null;
  body?: unknown[] | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    noIndex?: boolean | null;
    ogImage?: RawImage | null;
  } | null;
  /** 中英文版本共用的 translation.metadata 編號 */
  group?: string | null;
}

export interface NewsEntry extends RawNewsFull {
  /** 這個語言沒有翻譯，顯示的是另一個語言的版本 */
  fallback: boolean;
  /** 這則消息實際有哪些語言版本（判斷另一語言頁要不要標 hreflang） */
  languages: string[];
}

/**
 * 每則消息挑出指定語言的版本；沒有該語言時用另一個語言的版本並標記 fallback
 * （SPEC 第 2 節：英文頁尚無內容時顯示中文版並提示 coming soon，不可出現空白頁）。
 */
export function pickForLocale(items: RawNewsFull[], locale: Locale): NewsEntry[] {
  const groups = new Map<string, RawNewsFull[]>();
  for (const item of items) {
    const key = item.group ?? item._id;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const picked: NewsEntry[] = [];
  for (const versions of groups.values()) {
    const own = versions.find((v) => v.language === locale);
    const chosen = own ?? versions[0];
    const languages = [
      ...new Set(versions.map((v) => v.language).filter((l): l is string => Boolean(l))),
    ];
    if (chosen) picked.push({ ...chosen, fallback: !own, languages });
  }
  return picked.sort((a, b) => Date.parse(b.publishedAt ?? '') - Date.parse(a.publishedAt ?? ''));
}

/** 需要站內內頁的消息：媒體報導連外部、產品發表有站內連結的都不需要 */
export function needsDetailPage(item: RawNews): boolean {
  if (!item.slug || RESERVED_SLUGS.has(item.slug)) return false;
  if (item.category === 'media') return !item.externalUrl;
  if (item.category === 'product' && item.internalPath) return false;
  return true;
}

export function totalPages(count: number, size = NEWS_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / size));
}

export function pageSlice<T>(items: T[], page: number, size = NEWS_PAGE_SIZE): T[] {
  return items.slice((page - 1) * size, page * size);
}

/** 置頂精選：勾選「置頂精選」的最新一則 */
export function pickFeatured(items: NewsEntry[]): NewsEntry | undefined {
  return items.find((n) => n.featured);
}

/** 有內容的分類（照固定順序） */
export function availableCategories(items: RawNews[]): NewsCategory[] {
  return NEWS_CATEGORIES.filter((c) => items.some((n) => n.category === c));
}

export type NewsRoute =
  | { kind: 'list'; path: string | undefined; category: NewsCategory | null; page: number }
  | { kind: 'detail'; path: string; slug: string };

/** /news 底下所有要產生的網址（不含語言前綴）：列表、分頁、分類、內頁 */
export function newsRoutes(items: NewsEntry[]): NewsRoute[] {
  const routes: NewsRoute[] = [];
  const listing = (category: NewsCategory | null, count: number) => {
    const pages = totalPages(count);
    for (let page = 1; page <= pages; page++) {
      const parts = [category ? `category/${category}` : '', page > 1 ? `page/${page}` : ''].filter(
        Boolean,
      );
      routes.push({ kind: 'list', path: parts.join('/') || undefined, category, page });
    }
  };
  const featured = pickFeatured(items);
  listing(null, items.filter((n) => n !== featured).length);
  for (const category of availableCategories(items)) {
    listing(category, items.filter((n) => n.category === category).length);
  }
  for (const item of items) {
    if (needsDetailPage(item)) routes.push({ kind: 'detail', path: item.slug!, slug: item.slug! });
  }
  return routes;
}

/** 列表網址（不含語言前綴） */
export function newsListPath(category: NewsCategory | null, page = 1): string {
  return ['/news', category ? `category/${category}` : '', page > 1 ? `page/${page}` : '']
    .filter(Boolean)
    .join('/');
}

/** 同一則消息的其他推薦（同分類優先，最多 3 則，不含自己） */
export function relatedNews(items: NewsEntry[], current: NewsEntry, count = 3): NewsEntry[] {
  const others = items.filter((n) => n._id !== current._id);
  const same = others.filter((n) => n.category === current.category);
  const rest = others.filter((n) => n.category !== current.category);
  return [...same, ...rest].slice(0, count);
}

/**
 * 分類頁、第 2 頁以後的搜尋結果描述（SEO）：用「分類／頁碼＋這一頁實際的消息標題」組成，
 * 每頁都不一樣，也不需要另外撰寫文案。只採用這個語言真正的版本（不用還沒翻譯的備援標題）；
 * 一則都沒有時，改用「分類／頁碼＋列表導言」。
 */
export function newsListDescription(opts: {
  locale: Locale;
  label: string;
  items: NewsEntry[];
  lead: string;
}): string {
  const { locale, label, items, lead } = opts;
  const en = locale === 'en';
  const max = en ? 160 : 100;
  const sep = en ? ' · ' : '、';
  const head = en ? `${label}: ` : `${label}｜`;
  const titles = items
    .filter((n) => !n.fallback && n.title?.trim())
    .map((n) => n.title!.trim().replace(/\s+/g, ' '));
  let text = '';
  for (const t of titles) {
    const next = text ? `${text}${sep}${t}` : t;
    if ([...(head + next)].length > max) break;
    text = next;
  }
  if (text) return head + text;
  const fallback = head + lead;
  return [...fallback].length > max ? [...fallback].slice(0, max - 1).join('') + '…' : fallback;
}
