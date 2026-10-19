// 雙語設定：Studio 外掛、側欄、種子腳本共用同一份清單
export const LANGUAGES = [
  { id: 'zh-Hant', title: '繁體中文' },
  { id: 'en', title: 'English' },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]['id'];

// 使用文件層級雙語的內容類型（SPEC 第 5 節：所有文件型內容）
export const I18N_TYPES = [
  'siteSettings',
  'news',
  'caseStudy',
  'course',
  'partner',
  'solution',
  'page',
] as const;

// 全站設定是單一文件：每個語言固定一個 ID
export const SITE_SETTINGS_ID_PREFIX = 'siteSettings';
export const siteSettingsId = (lang: LanguageId) => `${SITE_SETTINGS_ID_PREFIX}-${lang}`;
