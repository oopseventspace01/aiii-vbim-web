import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageMember } from '../lib/fields';

// 內文編輯器（Portable Text）：段落、H2/H3、圖片、YouTube、按鈕（SPEC 5.2）
export const blockContent = defineType({
  name: 'blockContent',
  title: '內文',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '內文', value: 'normal' },
        { title: '大標題（H2）', value: 'h2' },
        { title: '小標題（H3）', value: 'h3' },
        { title: '引言', value: 'blockquote' },
      ],
      lists: [
        { title: '項目符號', value: 'bullet' },
        { title: '編號', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: '粗體', value: 'strong' },
          { title: '斜體', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: '連結',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: '網址',
                type: 'url',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    imageMember('圖片'),
    defineArrayMember({ type: 'youtube' }),
    defineArrayMember({ type: 'ctaButton' }),
  ],
});

export const youtube = defineType({
  name: 'youtube',
  title: 'YouTube 影片',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube 網址',
      description: '貼上影片網址，例如 https://www.youtube.com/watch?v=xxxx',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .custom((url) =>
            typeof url === 'string' && !/(youtube\.com|youtu\.be)\//.test(url)
              ? '請貼上 YouTube 影片網址'
              : true,
          ),
    }),
  ],
  preview: {
    select: { title: 'url' },
    prepare: ({ title }) => ({ title: `YouTube：${title ?? ''}` }),
  },
});

export const ctaButton = defineType({
  name: 'ctaButton',
  title: '按鈕',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: '按鈕文字',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: '連結網址',
      description: '站內頁面可填 /contact 這種寫法；外部網站請填完整網址。',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'], allowRelative: true }),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
});
