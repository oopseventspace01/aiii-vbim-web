/**
 * 把 docs/privacy-policy-draft.md 匯入後台「一般頁」（中英各一份，網址代稱 privacy）。
 *
 * 執行（在專案根目錄）：npm run import:privacy
 *   - 存成「草稿」＋勾選「待審稿」，網站在業主發布前仍顯示「制定中」。
 *   - 後台已有這兩份（草稿或已發布）就跳過，不會覆蓋業主改過的內容。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import { markdownToBlocks } from './article-markdown';

const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw' });
const raw = readFileSync(
  fileURLToPath(new URL('../docs/privacy-policy-draft.md', import.meta.url)),
  'utf8',
);

/** 取出某個「## 標題」到下一個「---」之間的內容；頁面內的 ### 升為 ## */
function section(heading: string): string {
  const start = raw.indexOf(`## ${heading}`);
  if (start < 0) throw new Error(`找不到段落：${heading}`);
  const body = raw.slice(start + heading.length + 3);
  const end = body.search(/^---\s*$/m);
  return (end < 0 ? body : body.slice(0, end)).replace(/^### /gm, '## ');
}

const DOCS = [
  { language: 'zh-Hant', title: '隱私權政策', md: section('中文版') },
  { language: 'en', title: 'Privacy Policy', md: section('English version') },
] as const;

for (const d of DOCS) {
  const id = `page-privacy-${d.language}`;
  const existing = await client.fetch<string[]>('*[_id in $ids]._id', {
    ids: [id, `drafts.${id}`],
  });
  if (existing.length) {
    console.log(`略過（後台已有）：${d.title}`);
    continue;
  }
  await client.createOrReplace({
    _id: `drafts.${id}`,
    _type: 'page',
    language: d.language,
    needsReview: true,
    title: d.title,
    slug: { _type: 'slug', current: 'privacy' },
    body: markdownToBlocks(d.md),
  });
  console.log(`已匯入草稿：${d.title}`);
}
