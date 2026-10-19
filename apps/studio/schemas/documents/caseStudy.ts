import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageMember, languageField, needsReviewField, slugField } from '../lib/fields';

// SPEC 5.3 案例
export const caseStudy = defineType({
  name: 'caseStudy',
  title: '案例',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'isPublic',
      title: '公開顯示',
      description: '預設不公開。取得客戶同意後才勾選；未勾選時網站完全不會顯示這個案例。',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: '案名',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField('title'),
    defineField({
      name: 'solution',
      title: '所屬場域',
      type: 'reference',
      to: [{ type: 'solution' }],
      options: {
        // 只列出相同語言的場域
        filter: ({ document }) => ({
          filter: 'language == $language',
          params: { language: (document as { language?: string }).language },
        }),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientDisplayName',
      title: '客戶顯示名稱',
      description: '可匿名，例如「北部某醫學中心」。',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pain',
      title: '痛點',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      title: '導入模組',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'results',
      title: '成果數字',
      description: '只放客戶同意公開的數字。',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'result',
          fields: [
            defineField({
              name: 'metric',
              title: '指標',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'value',
              title: '數值',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'note', title: '備註', type: 'string' }),
          ],
          preview: { select: { title: 'metric', subtitle: 'value' } },
        }),
      ],
    }),
    defineField({ name: 'gallery', title: '照片集', type: 'array', of: [imageMember('照片')] }),
    defineField({ name: 'body', title: '內文', type: 'blockContent' }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'clientDisplayName',
      isPublic: 'isPublic',
      media: 'gallery.0',
    },
    prepare: ({ title, client, isPublic, media }) => ({
      title,
      subtitle: `${isPublic ? '公開' : '未公開'}・${client ?? ''}`,
      media,
    }),
  },
});
