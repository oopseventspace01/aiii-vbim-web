import { defineField, defineType, type StringRule, type TextRule } from 'sanity';
import { imageField, languageField, needsReviewField, slugField } from '../lib/fields';
import {
  bodyRequiredUnlessMedia,
  englishLengthHint,
  maxLengthForLanguage,
  requiredForMedia,
} from '../lib/rules';

export const NEWS_CATEGORIES = [
  { title: '新聞', value: 'news' },
  { title: '活動', value: 'event' },
  { title: '黑客松', value: 'hackathon' },
  { title: '媒體報導', value: 'media' },
];

type NewsParent = { category?: string; language?: string } | undefined;
const categoryOf = (document: unknown) => (document as NewsParent)?.category;
const languageOf = (document: unknown) => (document as NewsParent)?.language;

/** 中文超過上限＝錯誤；英文超過＝提醒 */
const limitFor = (max: number) => (rule: StringRule | TextRule) => [
  rule.required(),
  rule.custom((value, context) => maxLengthForLanguage(languageOf(context.document), value, max)),
  rule
    .custom((value, context) => englishLengthHint(languageOf(context.document), value, max))
    .warning(),
];

// SPEC 5.2 最新消息與活動（v1.2 起含媒體報導）
export const news = defineType({
  name: 'news',
  title: '最新消息',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'title',
      title: '標題',
      description: '60 字以內。',
      type: 'string',
      validation: limitFor(60),
    }),
    slugField('title'),
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      options: { list: NEWS_CATEGORIES, layout: 'radio', direction: 'horizontal' },
      initialValue: 'news',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: '媒體名稱',
      description: '例如「Yahoo News」「經濟日報」。分類為「媒體報導」時必填。',
      type: 'string',
      hidden: ({ document }) => categoryOf(document) !== 'media',
      validation: (rule) =>
        rule.custom((value, context) => requiredForMedia(categoryOf(context.document), value)),
    }),
    defineField({
      name: 'externalUrl',
      title: '原始報導連結',
      description: '點擊後開新分頁到原始報導，媒體報導不需要內頁。',
      type: 'url',
      hidden: ({ document }) => categoryOf(document) !== 'media',
      validation: (rule) =>
        rule.custom((value, context) => requiredForMedia(categoryOf(context.document), value)),
    }),
    defineField({
      name: 'publishedAt',
      title: '發布時間',
      description: '設定未來時間的話，到時間後網站重新建置時才會顯示。',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayDate',
      title: '顯示日期（選填）',
      description:
        '只知道年份或年月時填寫，例如「2026」「2026.06」，網站會顯示這段文字而不是發布時間。',
      type: 'string',
    }),
    imageField('cover', '封面圖', {
      description: '列表卡片的封面（建議 16:10）。未上傳時網站會顯示品牌色底＋媒體名稱的預設圖。',
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      description: '120 字以內，用在列表與搜尋結果。',
      type: 'text',
      rows: 3,
      validation: limitFor(120),
    }),
    defineField({
      name: 'body',
      title: '內文',
      type: 'blockContent',
      hidden: ({ document }) => categoryOf(document) === 'media',
      validation: (rule) =>
        rule.custom((value, context) =>
          bodyRequiredUnlessMedia(categoryOf(context.document), value),
        ),
    }),
    defineField({
      name: 'eventDate',
      title: '活動日期',
      type: 'datetime',
      hidden: ({ document }) => categoryOf(document) !== 'event',
    }),
    defineField({
      name: 'eventLocation',
      title: '活動地點',
      type: 'string',
      hidden: ({ document }) => categoryOf(document) !== 'event',
    }),
    defineField({
      name: 'registerUrl',
      title: '報名連結',
      type: 'url',
      hidden: ({ document }) => categoryOf(document) !== 'event',
    }),
    defineField({ name: 'seo', title: 'SEO 設定', type: 'seo' }),
  ],
  orderings: [
    {
      title: '發布時間（新到舊）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      date: 'publishedAt',
      media: 'cover',
      source: 'source',
    },
    prepare: ({ title, category, date, media, source }) => {
      const label = NEWS_CATEGORIES.find((c) => c.value === category)?.title ?? '';
      const day = typeof date === 'string' ? date.slice(0, 10) : '';
      return { title, subtitle: [label, source, day].filter(Boolean).join('・'), media };
    },
  },
});
