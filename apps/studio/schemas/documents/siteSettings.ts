import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, languageField, needsReviewField } from '../lib/fields';

// SPEC 5.1 全站設定（每個語言一份，固定 ID）
export const siteSettings = defineType({
  name: 'siteSettings',
  title: '全站設定',
  type: 'document',
  groups: [
    { name: 'hero', title: '首頁主視覺', default: true },
    { name: 'proof', title: '背書條' },
    { name: 'company', title: '公司資訊' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'heroTitle',
      title: '首頁主標語',
      description: '預設：One OS. Every Building. Every System.',
      type: 'string',
      group: 'hero',
      initialValue: 'One OS. Every Building. Every System.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: '首頁副標',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroBody',
      title: '首頁內文',
      type: 'text',
      rows: 4,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroVideoUrl',
      title: '60 秒影片網址',
      description: '影片完成前請留空，網站會顯示封面圖與「影片製作中」。影片不會自動播放聲音。',
      type: 'url',
      group: 'hero',
    }),
    { ...imageField('heroPoster', '影片封面圖', { required: true }), group: 'hero' },
    defineField({
      name: 'proofItems',
      title: '背書項目',
      description: '首頁 Hero 下方的 4 格背書條，最多 4 筆。',
      type: 'array',
      group: 'proof',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'proofItem',
          fields: [
            defineField({
              name: 'label',
              title: '標題',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'value',
              title: '說明',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    {
      ...imageField('commandCenterImage', '戰情室截圖', {
        description: '未上傳前，網站會顯示示意框並標示「示意畫面」。',
      }),
      group: 'hero',
    },
    defineField({
      name: 'companyName',
      title: '公司名稱',
      type: 'string',
      group: 'company',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: '地址',
      type: 'string',
      group: 'company',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: '電話',
      type: 'string',
      group: 'company',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'company',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appStoreUrl',
      title: 'App Store 下載連結',
      type: 'url',
      group: 'company',
    }),
    defineField({
      name: 'googlePlayUrl',
      title: 'Google Play 下載連結',
      type: 'url',
      group: 'company',
    }),
    defineField({
      name: 'socialLinks',
      title: '社群連結',
      type: 'array',
      group: 'company',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: '平台',
              type: 'string',
              options: {
                list: ['Facebook', 'LinkedIn', 'YouTube', 'Instagram', 'LINE', 'X'],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: '網址',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'footerTagline',
      title: '頁尾標語',
      type: 'string',
      group: 'company',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: '全站預設 SEO',
      type: 'seo',
      group: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: `全站設定（${language === 'en' ? 'English' : '繁體中文'}）`,
    }),
  },
});
