import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, languageField, needsReviewField, slugField } from '../lib/fields';

// SPEC 5.4 場域（slug：hospital、factory、commercial、office、energy-datacenter）
export const solution = defineType({
  name: 'solution',
  title: '場域',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'name',
      title: '場域名稱',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    {
      ...slugField('name'),
      description: '請使用固定代稱：hospital、factory、commercial、office、energy-datacenter。',
    },
    defineField({
      name: 'tagline',
      title: '一句話價值',
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
      name: 'firstModule',
      title: '第一個可導入模組',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'integrationPoints',
      title: '整合範圍',
      description: '4～6 點。',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(4).max(6),
    }),
    defineField({
      name: 'kpis',
      title: '可量化 KPI',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    imageField('heroImage', '主視覺圖'),
    defineField({
      name: 'order',
      title: '排序',
      description: '數字越小越前面。',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [{ title: '排序', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'tagline', media: 'heroImage' } },
});
