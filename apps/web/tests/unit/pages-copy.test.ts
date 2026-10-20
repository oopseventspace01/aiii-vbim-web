// P4 第一批：各頁文案必須和設計稿逐字一致（CLAUDE.md：文案逐字保留）
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { extractAll, PAGES } from '../../../../scripts/extract-design.mjs';
import { VBIM_COPY } from '../../src/content/pages/vbim';
import { PLATFORM_COPY } from '../../src/content/pages/platform';
import { SOLUTIONS_COPY } from '../../src/content/pages/solutions';
import { ENERGY_COPY } from '../../src/content/pages/energy';
import { EDGE_COPY } from '../../src/content/pages/edge-ai';
import { ABOUT_COPY } from '../../src/content/pages/about';

const designFile = (name: string) =>
  readFileSync(new URL(`../../../../design/pages/${name}.dc.html`, import.meta.url), 'utf-8')
    .replaceAll('&amp;', '&')
    .replace(/<br>\s*/g, '\n');

// 去掉 HTML 標籤（例如標題第二行外的 <span>）後的純文字；圖片 alt 在屬性裡，所以兩種都比對
const textOnly = (html: string) => html.replace(/<[^>]+>/g, '');

// 程式另外加的欄位（頁面標題、無障礙標籤、圖片說明），設計稿沒有對應文字，不比對
const NOT_IN_DESIGN = new Set(['metaTitle', 'caption', 'downUpLabel', 'tabsLabel', 'dashboardAlt']);

function strings(value: unknown, key = ''): string[] {
  if (NOT_IN_DESIGN.has(key)) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, k));
  return [];
}

const PAGE_COPY = {
  VBIM: VBIM_COPY,
  Platform: PLATFORM_COPY,
  Solutions: SOLUTIONS_COPY,
  Energy: ENERGY_COPY,
  EdgeAI: EDGE_COPY,
  About: ABOUT_COPY,
};

describe('設計稿資料（content/design/*.json）與設計稿同步', () => {
  const fresh = extractAll() as Record<string, unknown>;
  it.each(PAGES as string[])('%s', (page) => {
    const saved = JSON.parse(
      readFileSync(new URL(`../../src/content/design/${page}.json`, import.meta.url), 'utf-8'),
    );
    expect(saved, `請執行 node scripts/extract-design.mjs 重新產生 ${page}.json`).toEqual(
      fresh[page],
    );
  });
});

for (const [page, copy] of Object.entries(PAGE_COPY)) {
  describe(`${page} 文案逐字比對`, () => {
    for (const [locale, file] of [
      ['zh-Hant', page],
      ['en', `en-${page}`],
    ] as const) {
      const html = designFile(file);
      const plain = textOnly(html);
      const list = strings(copy[locale]);
      it(`${locale}：${list.length} 段文字都出現在設計稿`, () => {
        const missing = list.filter((s) => !html.includes(s) && !plain.includes(s));
        expect(missing).toEqual([]);
      });
    }
  });
}

describe('禁用名稱', () => {
  const BANNED = [
    'WSP',
    '群聯',
    'Phison',
    'aiDAPTIV',
    'Pascari',
    '長庚',
    '台塑',
    '台泥',
    '三菱重工',
    '大金',
    'Panasonic',
    '東元',
  ];
  it('各頁文案與設計稿資料都不含禁用名稱', () => {
    const text = JSON.stringify({ PAGE_COPY, data: extractAll() });
    for (const word of BANNED) expect(text, word).not.toContain(word);
  });
});
