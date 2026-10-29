// /llms.txt（GEO：給 ChatGPT、Claude、Perplexity 等 AI 讀的網站簡介，https://llmstxt.org 格式）
// 內容全部取自網站已核准的文案與後台「全站設定」，不另外撰寫新說法；頁面文案更新後會自動跟著變
import type { APIRoute } from 'astro';
import { ABOUT_COPY } from '../content/pages/about';
import { ACADEMY_COPY } from '../content/pages/academy';
import { CASES_COPY } from '../content/pages/cases';
import { CONTACT_COPY } from '../content/pages/contact';
import { EDGE_COPY } from '../content/pages/edge-ai';
import { ENERGY_COPY } from '../content/pages/energy';
import { NEWS_COPY } from '../content/pages/news';
import { PARTNERS_COPY } from '../content/pages/partners';
import { PLATFORM_COPY } from '../content/pages/platform';
import { SOLUTIONS_COPY } from '../content/pages/solutions';
import { VBIM_COPY } from '../content/pages/vbim';
import { NAV_ITEMS } from '../i18n/ui';
import { localizePath, type Locale } from '../lib/i18n';
import { SITE_URL } from '../lib/seo';
import { getFooterInfo } from '../lib/site';

/** 各頁的描述：和該頁 <meta name="description"> 相同 */
function descriptions(l: Locale): Record<string, string> {
  return {
    vbim: VBIM_COPY[l].subtitle,
    platform: PLATFORM_COPY[l].subtitle,
    solutions: SOLUTIONS_COPY[l].lead,
    energy: ENERGY_COPY[l].subtitle,
    edge: EDGE_COPY[l].subtitle,
    cases: CASES_COPY[l].lead,
    partners: PARTNERS_COPY[l].subtitle,
    academy: ACADEMY_COPY[l].lead,
    news: NEWS_COPY[l].lead,
    about: ABOUT_COPY[l].lead,
  };
}

const oneLine = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? SITE_URL;
  const zh = await getFooterInfo('zh-Hant');
  const url = (path: string, l: Locale) => origin + localizePath(path, l).replace(/^\/$/, '/');

  const pages = (l: Locale) => {
    const desc = descriptions(l);
    return NAV_ITEMS.map(
      (n) => `- [${n.label[l]}](${url(n.path, l)}): ${oneLine(desc[n.key] ?? '')}`,
    ).concat(
      `- [${l === 'en' ? 'Contact' : '聯絡我們'}](${url('/contact', l)}): ${oneLine(CONTACT_COPY[l].lead)}`,
    );
  };

  const apps = [
    zh.appStoreUrl && `- App Store：${zh.appStoreUrl}`,
    zh.googlePlayUrl && `- Google Play：${zh.googlePlayUrl}`,
  ].filter(Boolean);

  const body = [
    '# Aiii VBIM',
    '',
    `> ${oneLine(zh.footerTagline)}`,
    '',
    oneLine(ABOUT_COPY['zh-Hant'].lead),
    '',
    oneLine(PLATFORM_COPY['zh-Hant'].body),
    '',
    '## 主要頁面（繁體中文）',
    '',
    ...pages('zh-Hant'),
    '',
    '## Main pages (English)',
    '',
    ...pages('en'),
    '',
    ...(apps.length ? ['## App', '', ...apps, ''] : []),
    '## 公司資訊',
    '',
    `- 公司：${zh.companyName}`,
    `- 地址：${zh.address}`,
    `- 電話：${zh.phone}`,
    ...(zh.email ? [`- Email：${zh.email}`] : []),
    ...(zh.lineOfficialUrl ? [`- LINE 官方帳號：${zh.lineOfficialUrl}`] : []),
    '',
    '## Optional',
    '',
    `- [網站地圖](${origin}/sitemap-index.xml)`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
