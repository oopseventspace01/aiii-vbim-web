// /news 文案：開場逐字取自 design/pages/News.dc.html、en-News.dc.html；
// 篩選、分頁、內頁的介面文字為程式需要另外加的（設計稿只有單頁版面）。
import type { Locale } from '../../lib/i18n';

export const NEWS_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    mediaNote?: string;
    ui: {
      metaTitle: string;
      all: string;
      filterLabel: string;
      learnMore: string;
      readStory: string;
      empty: string;
      prev: string;
      next: string;
      pageLabel: (page: number, total: number) => string;
      paginationLabel: string;
      back: string;
      related: string;
      eventDate: string;
      eventLocation: string;
      register: string;
    };
  }
> = {
  'zh-Hant': {
    eyebrow: 'NEWS & MEDIA',
    title: '最新消息與媒體報導',
    lead: '一覽 Aiii VBIM 在各大媒體的報導與重要活動，見證我們如何引領智慧建築產業的創新發展。',
    ui: {
      metaTitle: '最新消息',
      all: '全部',
      filterLabel: '依分類篩選',
      learnMore: '了解更多 →',
      readStory: '閱讀報導 ↗',
      empty: '這個分類目前沒有消息。',
      prev: '← 上一頁',
      next: '下一頁 →',
      pageLabel: (page, total) => `第 ${page} 頁，共 ${total} 頁`,
      paginationLabel: '分頁',
      back: '← 回到最新消息',
      related: '相關消息',
      eventDate: '活動日期',
      eventLocation: '活動地點',
      register: '立即報名',
    },
  },
  en: {
    eyebrow: 'NEWS & MEDIA',
    title: 'News & Media Coverage',
    lead: 'See how Aiii VBIM has been featured in major media and key events — and how we are leading innovation in the smart building industry.',
    mediaNote: 'Original articles are in Chinese.',
    ui: {
      metaTitle: 'News',
      all: 'All',
      filterLabel: 'Filter by category',
      learnMore: 'Learn more →',
      readStory: 'Read ↗',
      empty: 'No news in this category yet.',
      prev: '← Previous',
      next: 'Next →',
      pageLabel: (page, total) => `Page ${page} of ${total}`,
      paginationLabel: 'Pagination',
      back: '← Back to News',
      related: 'Related news',
      eventDate: 'Date',
      eventLocation: 'Location',
      register: 'Register',
    },
  },
};
