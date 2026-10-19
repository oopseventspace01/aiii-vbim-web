import { defineField, defineType } from 'sanity';
import { imageField, languageField, needsReviewField } from '../lib/fields';

export const PARTNER_TYPES = [
  { title: '設備製造商', value: 'equipment' },
  { title: '工程技術商', value: 'engineering' },
  { title: 'AI / Software', value: 'ai-software' },
  { title: '能源公司', value: 'energy' },
  { title: 'Cybersecurity', value: 'security' },
  { title: 'SI / Consultants', value: 'si-consultant' },
];

export const PARTNER_TIERS = [
  { title: 'Technology Partner', value: 'technology' },
  { title: 'Solution Partner', value: 'solution' },
  { title: 'SI Partner', value: 'si' },
  { title: 'Certified Partner', value: 'certified' },
  { title: 'POC Partner', value: 'poc' },
];

// SPEC 5.5 夥伴
export const partner = defineType({
  name: 'partner',
  title: '夥伴',
  type: 'document',
  fields: [
    languageField,
    needsReviewField,
    defineField({
      name: 'logoApproved',
      title: 'Logo 已取得授權',
      description: '預設未授權。取得夥伴書面同意使用 Logo 後才勾選；未勾選時網站不會顯示。',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: '夥伴名稱',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    imageField('logo', 'Logo', {
      required: true,
      description: '建議使用 SVG 或透明背景 PNG。',
    }),
    defineField({
      name: 'type',
      title: '夥伴類型',
      type: 'string',
      options: { list: PARTNER_TYPES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tier',
      title: '合作方式',
      type: 'string',
      options: { list: PARTNER_TIERS },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'website', title: '官方網站', type: 'url' }),
    defineField({
      name: 'showOnHome',
      title: '顯示在首頁',
      description: '勾選後出現在首頁的夥伴 Logo 牆（仍須「Logo 已取得授權」）。',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', approved: 'logoApproved', media: 'logo' },
    prepare: ({ title, approved, media }) => ({
      title,
      subtitle: approved ? 'Logo 已授權' : 'Logo 未授權（不顯示）',
      media,
    }),
  },
});
