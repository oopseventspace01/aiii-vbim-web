import { defineField, defineType } from 'sanity';
import { languageField, needsReviewField, slugField } from '../lib/fields';

// SPEC 5.7 一般頁（關於、隱私權等）
export const page = defineType({
  name: 'page',
  title: '一般頁',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'title',
      title: '頁面標題',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    {
      ...slugField('title'),
      description: '例如 about、privacy。',
    },
    defineField({ name: 'body', title: '內文', type: 'blockContent' }),
    defineField({ name: 'seo', title: 'SEO 設定', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
