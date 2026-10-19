// 各內容類型共用的欄位
import { defineArrayMember, defineField } from 'sanity';
import { altRequired, isUniqueOtherThanLanguage, reviewGate } from './rules';

const altSubField = defineField({
  name: 'alt',
  title: '圖片說明（替代文字）',
  description: '用一句話描述圖片內容，給看不到圖片的人與搜尋引擎使用。',
  type: 'string',
});

/** 語言欄位：由雙語外掛自動寫入，編輯者不需要改。 */
export const languageField = defineField({
  name: 'language',
  title: '語言',
  type: 'string',
  readOnly: true,
  hidden: true,
});

/** 待審稿（免費方案沒有「只能存草稿」的角色，用這個欄位擋住未審稿的發布）。 */
export const needsReviewField = defineField({
  name: 'needsReview',
  title: '待審稿',
  description:
    '新文件預設為「待審稿」，此時無法發布。審稿者確認以下事項後取消勾選，再按「發布」：' +
    '① 文字無錯字 ② 數字與客戶名稱已取得公開同意 ③ 圖片有說明文字 ④ 中英文版本一致',
  type: 'boolean',
  initialValue: true,
  validation: (rule) => rule.custom(reviewGate),
});

/** 網址代稱：由標題產生，中英文版可相同。 */
export function slugField(source = 'title') {
  return defineField({
    name: 'slug',
    title: '網址代稱',
    description: '網址的最後一段（英文小寫與連字號），按「Generate」可由標題自動產生。',
    type: 'slug',
    options: { source, maxLength: 96, isUnique: isUniqueOtherThanLanguage },
    validation: (rule) => rule.required(),
  });
}

/** 圖片欄位：上傳後必須填寫替代文字（alt）。 */
export function imageField(
  name: string,
  title: string,
  opts: { required?: boolean; description?: string } = {},
) {
  return defineField({
    name,
    title,
    description: opts.description,
    type: 'image',
    options: { hotspot: true },
    fields: [altSubField],
    validation: (rule) => {
      const withAlt = rule.custom(altRequired);
      return opts.required ? withAlt.required() : withAlt;
    },
  });
}

/** 陣列中的圖片（照片集、內文插圖）：同樣必須填寫替代文字。 */
export function imageMember(title = '圖片') {
  return defineArrayMember({
    type: 'image',
    title,
    options: { hotspot: true },
    fields: [altSubField],
    validation: (rule) => rule.custom(altRequired),
  });
}
