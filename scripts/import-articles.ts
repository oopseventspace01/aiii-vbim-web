/**
 * 把 docs/articles/*.md 的知識專欄文章匯入後台（存成「草稿」＋勾選「待審稿」）。
 *
 * 執行（在專案根目錄）：npm run import:articles
 *   - 使用 `npx sanity login` 的帳號權限。
 *   - 只存草稿：網站只讀「已發布」的文件，業主在後台修改、取消「待審稿」並按「發布」後才會出現在網站。
 *   - 預設跳過後台已經有的文章（草稿或已發布都算），不會覆蓋業主改過的內容；
 *     要重新匯入覆蓋草稿時加 `-- --force`（不會動到已發布的版本）。
 *   - 後台內文編輯器沒有表格，Markdown 表格會轉成條列。
 */
import { createReadStream, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import { parseArticle } from './article-markdown';

const FORCE = process.argv.includes('--force');
// raw：查詢時也要看得到草稿，才能判斷是否已匯入
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw' });
const dir = fileURLToPath(new URL('../docs/articles/', import.meta.url));

async function main() {
  const files = readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f));
  for (const file of files) {
    const a = parseArticle(readFileSync(dir + file, 'utf8'));
    const id = `insight-${a.slug}`;
    const existing = await client.fetch<string[]>('*[_id in $ids]._id', {
      ids: [id, `drafts.${id}`],
    });
    if (existing.includes(id)) {
      console.log(`略過（已發布）：${a.title}`);
      continue;
    }
    if (existing.length && !FORCE) {
      console.log(`略過（後台已有草稿）：${a.title}`);
      continue;
    }
    for (const [label, value, max] of [
      ['標題', a.title, 70],
      ['摘要', a.excerpt, 120],
      ['搜尋結果標題', a.metaTitle, 60],
      ['搜尋結果描述', a.metaDescription, 160],
    ] as const) {
      if (!value || value.length > max) throw new Error(`${file} 的${label}空白或超過 ${max} 字`);
    }
    const asset = await client.assets.upload('image', createReadStream(dir + a.cover), {
      filename: a.cover.split('/').pop(),
    });
    await client.createOrReplace({
      _id: `drafts.${id}`,
      _type: 'news',
      language: 'zh-Hant',
      needsReview: true,
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      category: 'insight',
      featured: false,
      publishedAt: new Date().toISOString(),
      cover: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: a.coverAlt,
      },
      excerpt: a.excerpt,
      body: a.body,
      seo: { _type: 'seo', metaTitle: a.metaTitle, metaDescription: a.metaDescription },
    });
    console.log(`已匯入草稿：${a.title}（${a.body.length} 段）`);
  }
}

await main();
