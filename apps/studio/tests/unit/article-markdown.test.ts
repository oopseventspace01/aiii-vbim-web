import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { markdownToBlocks, parseArticle, parseInline } from '../../../../scripts/article-markdown';

const dir = fileURLToPath(new URL('../../../../docs/articles/', import.meta.url));
const files = readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f));

describe('知識專欄 Markdown 轉換', () => {
  it('行內粗體、連結、反引號', () => {
    const { children, markDefs } = parseInline('看 **重點** 與 [平台](/platform) 和 `[TBD: x]`');
    expect(children.map((c) => c.text).join('')).toBe('看 重點 與 平台 和 [TBD: x]');
    expect(children[1].marks).toEqual(['strong']);
    expect(markDefs[0].href).toBe('/platform');
  });

  it('標題、條列、表格轉條列', () => {
    const blocks = markdownToBlocks(
      ['## 大標', '- 甲', '1. 乙', '', '| 類型 | 強項 |', '| --- | --- |', '| BIM | 設計 |'].join(
        '\n',
      ),
    );
    expect(blocks.map((b) => [b.style, b.listItem ?? ''])).toEqual([
      ['h2', ''],
      ['normal', 'bullet'],
      ['normal', 'number'],
      ['normal', 'bullet'],
    ]);
    expect(blocks[3].children.map((c) => c.text).join('')).toBe('BIM　強項：設計');
  });

  it.each(files)('%s 欄位完整且在字數限制內', (file) => {
    const a = parseArticle(readFileSync(dir + file, 'utf8'));
    expect(a.slug).toMatch(/^[a-z0-9-]+$/);
    expect(a.title.length).toBeGreaterThan(0);
    expect(a.title.length).toBeLessThanOrEqual(70);
    expect(a.excerpt.length).toBeGreaterThan(0);
    expect(a.excerpt.length).toBeLessThanOrEqual(120);
    expect(a.metaTitle.length).toBeLessThanOrEqual(60);
    expect(a.metaDescription.length).toBeLessThanOrEqual(160);
    expect(a.cover).toMatch(/^covers\/.+\.jpg$/);
    expect(a.body.some((b) => b.style === 'h2')).toBe(true);
    // 表格語法不能殘留在內文
    expect(a.body.every((b) => !b.children.some((c) => c.text.includes('|')))).toBe(true);
  });
});
