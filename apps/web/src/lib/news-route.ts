// /news 與 /en/news 共用的 getStaticPaths
import type { Locale } from './i18n';
import { getAllNews } from './site';
import { newsRoutes, pickForLocale, type NewsEntry, type NewsRoute } from './news-data';

export async function newsStaticPaths(locale: Locale) {
  const entries = pickForLocale(await getAllNews(), locale);
  return newsRoutes(entries).map((route) => ({
    params: { path: route.path },
    props: { route, entries },
  }));
}

export type NewsPageProps = { route: NewsRoute; entries: NewsEntry[] };
