import type { SchemaTypeDefinition } from 'sanity';
import { caseStudy } from './documents/caseStudy';
import { course } from './documents/course';
import { news } from './documents/news';
import { page } from './documents/page';
import { partner } from './documents/partner';
import { siteSettings } from './documents/siteSettings';
import { solution } from './documents/solution';
import { blockContent, ctaButton, youtube } from './objects/blockContent';
import { seo } from './objects/seo';

// SPEC 第 5 節全部內容類型
export const schemaTypes: SchemaTypeDefinition[] = [
  // 文件
  siteSettings,
  news,
  caseStudy,
  course,
  partner,
  solution,
  page,
  // 物件
  seo,
  blockContent,
  youtube,
  ctaButton,
];
