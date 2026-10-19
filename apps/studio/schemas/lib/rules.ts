// 欄位驗證規則（純函式，方便單元測試）。回傳 true 代表通過，字串代表錯誤訊息。
import type { SlugValidationContext } from 'sanity';

type Result = true | string;

const isEmpty = (value: unknown) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

/** 「待審稿」勾選時不可發布：審稿者確認內容後取消勾選，才能按發布。 */
export function reviewGate(needsReview: unknown): Result {
  return needsReview === true ? '此文件為「待審稿」。請審稿者確認內容後取消勾選，才能發布。' : true;
}

/** 消息分類為「媒體報導」時必填（媒體名稱、原始報導連結）。 */
export function requiredForMedia(category: unknown, value: unknown): Result {
  return category === 'media' && isEmpty(value) ? '分類為「媒體報導」時必填' : true;
}

/** 消息內文：媒體報導直接連到外部網址，不需要內文；其他分類必填。 */
export function bodyRequiredUnlessMedia(category: unknown, value: unknown): Result {
  if (category === 'media') return true;
  return Array.isArray(value) && value.length > 0 ? true : '內文為必填（媒體報導除外）';
}

/** 課程報名方式為「外部連結」時，外部網址必填。 */
export function requiredForExternal(registerMode: unknown, value: unknown): Result {
  return registerMode === 'external' && isEmpty(value) ? '報名方式為「外部連結」時必填' : true;
}

/** 圖片已上傳時，替代文字（alt）必填。 */
export function altRequired(image: { asset?: unknown; alt?: unknown } | undefined): Result {
  if (!image?.asset) return true;
  return isEmpty(image.alt) ? '請填寫圖片說明（替代文字），給看不到圖片的人與搜尋引擎使用' : true;
}

/**
 * 網址代稱（slug）只要在「同類型＋同語言」內不重複即可，
 * 讓中文版和英文版可以使用相同的網址代稱。
 * 參考：@sanity/document-internationalization 文件 05-allowing-the-same-slug-for-translations
 */
export async function isUniqueOtherThanLanguage(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const { document, getClient } = context;
  if (!document?.language) return true;
  const client = getClient({ apiVersion: '2025-02-19' });
  const id = document._id.replace(/^drafts\./, '');
  const query = `!defined(*[
    !(sanity::versionOf($id)) &&
    _type == $type &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`;
  return client.fetch(query, { id, type: document._type, language: document.language, slug });
}

const lengthOf = (value: unknown) => (typeof value === 'string' ? [...value].length : 0);

/**
 * 字數上限（SPEC：標題 ≤ 60 字、摘要 ≤ 120 字）是以中文訂的：
 * 中文版超過 → 錯誤（不能發布）；英文版超過 → 只提醒，因為英文字元數天生較多。
 */
export function maxLengthForLanguage(language: unknown, value: unknown, max: number): Result {
  const n = lengthOf(value);
  if (language === 'en' || n <= max) return true;
  return `中文請在 ${max} 字以內（目前 ${n} 字）`;
}

export function englishLengthHint(language: unknown, value: unknown, max: number): Result {
  const n = lengthOf(value);
  if (language !== 'en' || n <= max) return true;
  return `English text is recommended within ${max} characters (now ${n}).`;
}
