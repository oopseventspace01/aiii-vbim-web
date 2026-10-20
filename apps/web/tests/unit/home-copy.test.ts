// 首頁固定文案必須和設計稿逐字一致（CLAUDE.md：文案逐字保留）
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOME } from '../../src/content/home';

const design = (file: string) =>
  readFileSync(new URL(`../../../../design/pages/${file}`, import.meta.url), 'utf-8')
    .replaceAll('&amp;', '&')
    .replaceAll('<br>', '\n');

const pages = { 'zh-Hant': design('Main.dc.html'), en: design('en-Main.dc.html') };

// 程式為了無障礙另外加的標籤（設計稿沒有），不需比對
const A11Y_ONLY = new Set([
  'verbsLabel',
  'pathLabel',
  'proofLabel',
  'empty',
  'path',
  'product',
  'media',
]);

function collectStrings(value: unknown, key = ''): string[] {
  if (A11Y_ONLY.has(key)) return [];
  if (typeof value === 'string')
    return key === 'path' || key === 'image' || key === 'key' ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((v) => collectStrings(v));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => collectStrings(v, k));
  }
  return [];
}

describe.each(Object.keys(pages) as (keyof typeof pages)[])('首頁文案（%s）', (locale) => {
  const strings = collectStrings(HOME[locale]).filter((s) => !s.startsWith('/'));

  it('至少有 60 段文字被比對', () => expect(strings.length).toBeGreaterThan(60));

  it.each(strings.map((s) => [s.slice(0, 30), s]))('「%s」出現在設計稿', (_, s) => {
    // 標題換行（\n）在設計稿是 <br>；比對時也接受換行前後的空白差異
    const page = pages[locale];
    const found = page.includes(s) || page.replace(/\n\s*/g, '\n').includes(s);
    expect(found, s).toBe(true);
  });
});
