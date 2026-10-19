import { defineArrayMember, defineField, defineType } from 'sanity';
import { languageField, needsReviewField, slugField } from '../lib/fields';
import { requiredForExternal } from '../lib/rules';

export const COURSE_LEVELS = [
  { title: '基礎', value: 'basic' },
  { title: '進階', value: 'advanced' },
  { title: '專家', value: 'expert' },
];

export const SESSION_STATUSES = [
  { title: '開放報名', value: 'open' },
  { title: '額滿', value: 'full' },
  { title: '即將開課', value: 'upcoming' },
  { title: '已結束', value: 'closed' },
];

type CourseDoc = { registerMode?: string } | undefined;

// SPEC 5.6 認證課程
export const course = defineType({
  name: 'course',
  title: '認證課程',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'title',
      title: '課程名稱',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField('title'),
    defineField({
      name: 'level',
      title: '級別',
      type: 'string',
      options: { list: COURSE_LEVELS, layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: '課程簡介',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: '課程內容',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sessions',
      title: '梯次',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'session',
          fields: [
            defineField({
              name: 'startDate',
              title: '開始日期',
              type: 'date',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'endDate', title: '結束日期', type: 'date' }),
            defineField({ name: 'location', title: '地點', type: 'string' }),
            defineField({
              name: 'seats',
              title: '名額',
              type: 'number',
              validation: (r) => r.integer().min(0),
            }),
            defineField({
              name: 'price',
              title: '費用',
              description: '例如「NT$ 12,000」或「免費」。',
              type: 'string',
            }),
            defineField({
              name: 'status',
              title: '報名狀態',
              type: 'string',
              options: { list: SESSION_STATUSES },
              initialValue: 'upcoming',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'startDate', subtitle: 'status', location: 'location' },
            prepare: ({ title, subtitle, location }) => ({
              title: `${title ?? ''} ${location ?? ''}`,
              subtitle: SESSION_STATUSES.find((s) => s.value === subtitle)?.title,
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'registerMode',
      title: '報名方式',
      type: 'string',
      options: {
        list: [
          { title: '網站表單', value: 'form' },
          { title: '外部連結', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: '外部報名網址',
      type: 'url',
      hidden: ({ document }) => (document as CourseDoc)?.registerMode !== 'external',
      validation: (rule) =>
        rule.custom((value, context) =>
          requiredForExternal((context.document as CourseDoc)?.registerMode, value),
        ),
    }),
  ],
  preview: {
    select: { title: 'title', level: 'level' },
    prepare: ({ title, level }) => ({
      title,
      subtitle: COURSE_LEVELS.find((l) => l.value === level)?.title,
    }),
  },
});
