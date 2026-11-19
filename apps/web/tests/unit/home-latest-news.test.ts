import { describe, expect, it } from 'vitest';
import {
  HOME_LATEST_NEWS_COPY,
  HOME_LATEST_NEWS_QUERY,
  HOME_LATEST_NEWS_SLUG,
  pickLatestNews,
  type RawLatestNews,
} from '../../src/content/home-latest-news';

const img = { alt: 'photo', asset: { url: 'https://cdn.sanity.io/x.jpg' } };
const abri = (language: string, title: string): RawLatestNews => ({
  language,
  title,
  slug: HOME_LATEST_NEWS_SLUG,
  category: 'media',
  source: language === 'en' ? 'ABRI' : '內政部建築研究所',
  externalUrl: 'https://www.abri.gov.tw/News_Content.aspx?n=752&sms=9451&s=331397',
  displayDate: '2025.09',
  excerpt: '說明',
  cover: img,
});

describe('首頁最新消息大卡片', () => {
  it('標題文字：中文「最新消息」、英文「Latest News」，看全部連結有文字', () => {
    expect(HOME_LATEST_NEWS_COPY['zh-Hant'].title).toBe('最新消息');
    expect(HOME_LATEST_NEWS_COPY.en.title).toBe('Latest News');
    expect(HOME_LATEST_NEWS_COPY['zh-Hant'].viewAll).toBe('看全部消息 →');
  });

  it('查詢用指定的 slug，並抓媒體報導當備援', () => {
    expect(HOME_LATEST_NEWS_SLUG).toBe('abri-net-zero-showcase');
    expect(HOME_LATEST_NEWS_QUERY).toContain('slug.current == $slug');
    expect(HOME_LATEST_NEWS_QUERY).toContain('category == "media"');
  });

  it('指定的那則：挑同語言版本，外部連結、來源與日期都帶出來', () => {
    const pinned = [abri('en', 'EN title'), abri('zh-Hant', '中文標題')];
    const zh = pickLatestNews({ pinned }, 'zh-Hant')!;
    expect(zh.fallback).toBe(false);
    expect(zh.card.title).toBe('中文標題');
    expect(zh.card.external).toBe(true);
    expect(zh.card.href).toContain('abri.gov.tw');
    expect(zh.card.source).toBe('內政部建築研究所');
    expect(zh.card.dateLabel).toBe('2025.09');
    expect(zh.card.cover?.alt).toBe('photo');
    expect(pickLatestNews({ pinned }, 'en')!.card.title).toBe('EN title');
  });

  it('沒有英文版時用中文版並標記 fallback', () => {
    const r = pickLatestNews({ pinned: [abri('zh-Hant', '中文標題')] }, 'en')!;
    expect(r.card.title).toBe('中文標題');
    expect(r.fallback).toBe(true);
  });

  it('指定的那則找不到時，改用最新一則媒體報導（同語言優先）', () => {
    const recent: RawLatestNews[] = [
      { ...abri('zh-Hant', '最新中文'), slug: 'newest' },
      { ...abri('en', 'Newest EN'), slug: 'newest' },
      { ...abri('en', 'Older EN'), slug: 'older' },
    ];
    expect(pickLatestNews({ pinned: [], recent }, 'en')!.card.title).toBe('Newest EN');
    expect(pickLatestNews({ pinned: [], recent }, 'zh-Hant')!.card.title).toBe('最新中文');
  });

  it('後台完全沒有資料時不顯示（回傳 undefined）', () => {
    expect(pickLatestNews({ pinned: [], recent: [] }, 'zh-Hant')).toBeUndefined();
    expect(pickLatestNews(null, 'en')).toBeUndefined();
  });
});
