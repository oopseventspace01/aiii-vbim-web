/** 知識專欄 Markdown（docs/articles）→ 後台 Portable Text。給 import-articles.ts 與單元測試使用。 */

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type MarkDef = { _type: 'link'; _key: string; href: string };
type Block = {
  _type: 'block';
  _key: string;
  style: string;
  children: Span[];
  markDefs: MarkDef[];
  listItem?: 'bullet' | 'number';
  level?: number;
};

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

/** 行內語法：**粗體**、[連結](網址)、`程式碼`（去掉反引號） */
export function parseInline(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|`(.+?)`/g;
  let last = 0;
  const push = (t: string, marks: string[] = []) => {
    if (t) children.push({ _type: 'span', _key: key(), text: t, marks });
  };
  for (const m of text.matchAll(re)) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) push(m[1], ['strong']);
    else if (m[2] !== undefined) {
      const def: MarkDef = { _type: 'link', _key: key(), href: m[3] };
      markDefs.push(def);
      push(m[2], [def._key]);
    } else push(m[4]);
    last = (m.index ?? 0) + m[0].length;
  }
  push(text.slice(last));
  if (!children.length) push(' ');
  return { children, markDefs };
}

const block = (text: string, style = 'normal', listItem?: 'bullet' | 'number'): Block => ({
  _type: 'block',
  _key: key(),
  style,
  ...parseInline(text),
  ...(listItem ? { listItem, level: 1 } : {}),
});

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

/** Markdown 內文 → Portable Text */
export function markdownToBlocks(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const out: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push(block(para.join('')));
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flush();
      continue;
    }
    const single = line.startsWith('### ')
      ? block(line.slice(4), 'h3')
      : line.startsWith('## ')
        ? block(line.slice(3), 'h2')
        : /^[-*] /.test(line)
          ? block(line.slice(2), 'normal', 'bullet')
          : /^\d+\. /.test(line)
            ? block(line.replace(/^\d+\. /, ''), 'normal', 'number')
            : null;
    if (single) {
      flush();
      out.push(single);
    } else if (line.startsWith('|')) {
      flush();
      const header = cells(line);
      i++; // 分隔線 |---|
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
        i++;
        const row = cells(lines[i]);
        const rest = header
          .slice(1)
          .map((h, j) => `${h}：${row[j + 1] ?? ''}`)
          .join('；');
        out.push(block(`**${row[0]}**\u3000${rest}`, 'normal', 'bullet'));
      }
    } else para.push(line);
  }
  flush();
  return out;
}

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: Block[];
  cover: string;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
};

export function parseArticle(raw: string): Article {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) throw new Error('缺少檔頭');
  const meta = Object.fromEntries(
    fm[1].split(/\r?\n/).map((l) => {
      const at = l.indexOf(':');
      return [l.slice(0, at).trim(), l.slice(at + 1).trim()];
    }),
  );
  let body = fm[2];
  const title = body.match(/^# (.+)$/m)?.[1].trim() ?? '';
  body = body.replace(/^# .+$/m, '');
  const excerpt = body.match(/^\*\*摘要\*\*：(.+)$/m)?.[1].trim() ?? '';
  body = body.replace(/^\*\*摘要\*\*：.+$/m, '');
  return {
    slug: meta['網址代稱'],
    title,
    excerpt,
    body: markdownToBlocks(body),
    cover: meta['封面'].split('（')[0].trim(),
    coverAlt: meta['封面說明'],
    metaTitle: meta['搜尋結果標題'],
    metaDescription: meta['搜尋結果描述'],
  };
}
