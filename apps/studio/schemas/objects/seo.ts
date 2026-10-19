import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/fields';

// SPEC 5.8
export const seo = defineType({
  name: 'seo',
  title: 'SEO 設定',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: '搜尋結果標題',
      description: '顯示在 Google 搜尋結果與瀏覽器分頁，60 字以內。留空則使用頁面標題。',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: '搜尋結果描述',
      description: '顯示在 Google 搜尋結果標題下方，160 字以內。',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    imageField('ogImage', '分享預覽圖', {
      description: '分享到 LINE、Facebook 時顯示的圖片，建議 1200×630。',
    }),
    defineField({
      name: 'noIndex',
      title: '不讓搜尋引擎收錄',
      description: '勾選後 Google 不會收錄這一頁（一般不需要勾選）。',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
