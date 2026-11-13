// 最新消息自動翻譯（2026-11-13 業主指示）：從中文文件挑出「要翻譯的文字」，翻好後放回同樣位置
// 只翻人看得到的文字；網址、日期、分類、圖片、連結等原樣保留。

/** 要翻譯的欄位名稱（出現在任何層級都算），以及英文的建議字數上限 */
const FIELDS: Record<string, number | undefined> = {
  title: 70,
  excerpt: 120,
  metaTitle: 60,
  metaDescription: 160,
  eventLocation: undefined,
  alt: undefined,
  caption: undefined,
  label: undefined, // 內文的按鈕文字
};

/** 只在這些欄位底下找文字（避免翻到 slug、category 之類的值） */
const SKIP = new Set(['_id', '_type', '_rev', '_key', 'slug', 'category', 'language', 'source']);

export type TextItem = { path: (string | number)[]; text: string; max?: number };

const hasCjkOrLetters = (s: string) => /[\p{L}]/u.test(s);

/** 收集文件中所有要翻譯的文字（深度優先，順序固定） */
export function collectTexts(doc: Record<string, unknown>): TextItem[] {
  const out: TextItem[] = [];
  const walk = (node: unknown, path: (string | number)[]) => {
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, [...path, i]));
      return;
    }
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (SKIP.has(key)) continue;
      const here = [...path, key];
      // Portable Text 的文字片段：{ _type: 'span', text }
      const isSpanText = key === 'text' && obj._type === 'span';
      if (typeof value === 'string' && (isSpanText || key in FIELDS)) {
        if (value.trim() && hasCjkOrLetters(value)) {
          out.push({ path: here, text: value, max: isSpanText ? undefined : FIELDS[key] });
        }
      } else if (typeof value === 'object') {
        walk(value, here);
      }
    }
  };
  walk(doc, []);
  return out;
}

/** 把翻好的文字放回文件的副本（不改動原文件） */
export function applyTexts<T extends Record<string, unknown>>(
  doc: T,
  items: TextItem[],
  translated: string[],
): T {
  if (items.length !== translated.length) {
    throw new Error(`翻譯數量不符：需要 ${items.length} 段，收到 ${translated.length} 段`);
  }
  const copy = structuredClone(doc);
  items.forEach((item, i) => {
    let target: Record<string | number, unknown> = copy as Record<string | number, unknown>;
    for (const key of item.path.slice(0, -1)) {
      target = target[key] as Record<string | number, unknown>;
    }
    target[item.path[item.path.length - 1]!] = translated[i];
  });
  return copy;
}
