// 案例、夥伴、課程、一般頁的 Sanity 讀取與整理
import type { Locale } from './i18n';
import { sanityClient } from './sanity';
import { APPROVED_PARTNERS_QUERY, COURSES_QUERY, PAGE_QUERY, PUBLIC_CASES_QUERY } from './queries';
import type { RawImage } from './home-data';
import { RESERVED_SLUGS } from './news-data';

export interface RawCase {
  _id: string;
  language?: string | null;
  title?: string | null;
  slug?: string | null;
  clientDisplayName?: string | null;
  pain?: string | null;
  modules?: string[] | null;
  results?: { metric?: string | null; value?: string | null; note?: string | null }[] | null;
  gallery?: RawImage[] | null;
  body?: unknown[] | null;
  solution?: { name?: string | null; slug?: string | null } | null;
  group?: string | null;
}

export interface CaseEntry extends RawCase {
  fallback: boolean;
}

/** 依語言挑版本（沒有該語言 → 另一語言並標記 fallback），只留有網址代稱的案例 */
export function pickCases(items: RawCase[], locale: Locale): CaseEntry[] {
  const groups = new Map<string, RawCase[]>();
  for (const item of items) {
    const key = item.group ?? item._id;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const out: CaseEntry[] = [];
  for (const versions of groups.values()) {
    const own = versions.find((v) => v.language === locale);
    const chosen = own ?? versions[0];
    if (chosen?.slug && !RESERVED_SLUGS.has(chosen.slug)) out.push({ ...chosen, fallback: !own });
  }
  return out.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
}

let cases: Promise<RawCase[]> | undefined;
export function getPublicCases(): Promise<RawCase[]> {
  cases ??= sanityClient().fetch<RawCase[]>(PUBLIC_CASES_QUERY);
  return cases;
}

export interface PartnerLogo {
  name: string;
  type?: string;
  tier?: string;
  website?: string;
  showOnHome?: boolean;
  logo?: RawImage | null;
}
export function getApprovedPartners(locale: Locale): Promise<PartnerLogo[]> {
  return sanityClient().fetch<PartnerLogo[]>(APPROVED_PARTNERS_QUERY, { lang: locale });
}

export interface Course {
  title: string;
  slug?: string;
  level?: string;
  summary?: string;
  registerMode?: string;
  externalUrl?: string;
  sessions?: {
    startDate?: string;
    endDate?: string;
    location?: string;
    seats?: number;
    price?: string;
    status?: string;
  }[];
}
export function getCourses(locale: Locale): Promise<Course[]> {
  return sanityClient().fetch<Course[]>(COURSES_QUERY, { lang: locale });
}

export interface CmsPage {
  _id: string;
  language?: string;
  title?: string;
  body?: unknown[];
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
  fallback: boolean;
}
/** 一般頁：優先該語言版本，沒有就用中文版（標記 fallback）；都沒有回傳 undefined */
export async function getCmsPage(slug: string, locale: Locale): Promise<CmsPage | undefined> {
  const list = await sanityClient().fetch<Omit<CmsPage, 'fallback'>[]>(PAGE_QUERY, {
    slug,
    lang: locale,
  });
  const own = list.find((p) => p.language === locale);
  const chosen = own ?? list[0];
  return chosen ? { ...chosen, fallback: !own } : undefined;
}
