// 內容檢查（SPEC 8「內容」、CLAUDE.md 禁用名稱）：掃描建置好的網站（dist/client）
// - 禁用名稱：一出現就失敗（exit 1）
// - [TBD]、lorem、MOCK 等佔位內容：列成「上線前要補的清單」，不會失敗（加 --strict 時才會失敗）
// 用法：npm run build 之後執行 npm run check:content -w apps/web
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../dist/client/', import.meta.url));

/** CLAUDE.md：網站任何地方都不可出現 */
export const BANNED = [
  'WSP',
  '群聯',
  'Phison',
  'aiDAPTIV',
  'Pascari',
  '長庚醫院',
  '台塑集團',
  '台泥',
  '三菱重工',
  '大金',
  'Panasonic',
  '東元',
];

/** 上線前不應該留下的佔位內容 */
export const PLACEHOLDERS = [/\[TBD[^\]]*\]/gi, /lorem ipsum/gi, /\[MOCK\]/g, /\bTODO\b/g];

/** 頁面看得到的文字＋圖片 alt、連結網址（禁用名稱也不能出現在網址或 alt 裡） */
export function visibleText(html) {
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|content|href)="([^"]*)"/g)].map(
    (m) => m[1],
  );
  const text = html
    .replace(
      /<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,
      ' ',
    )
    .replace(/<[^>]+>/g, ' ');
  return `${text}\n${attrs.join('\n')}`;
}

export function scan(pages) {
  const banned = [];
  const placeholders = [];
  for (const { path, html } of pages) {
    const text = visibleText(html);
    for (const word of BANNED) {
      // 英文名稱比對整個單字，避免誤判（例如 WSP 不比對到別的英文字中間）
      const re = /^[A-Za-z]+$/.test(word) ? new RegExp(`\\b${word}\\b`, 'i') : new RegExp(word);
      if (re.test(text)) banned.push({ path, word });
    }
    for (const re of PLACEHOLDERS) {
      for (const m of text.matchAll(re)) placeholders.push({ path, text: m[0] });
    }
  }
  return { banned, placeholders };
}

function htmlPages(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((d) => d.isFile() && d.name.endsWith('.html'))
    .map((d) => join(d.parentPath, d.name))
    .filter((f) => !/^dev[\\/]/.test(relative(dir, f)))
    .map((f) => ({
      path: '/' + relative(dir, f).replaceAll('\\', '/'),
      html: readFileSync(f, 'utf-8'),
    }));
}

// 直接執行時才掃描（被測試 import 時不執行）
if (process.argv[1]?.endsWith('check-content.mjs')) {
  if (!existsSync(ROOT)) {
    console.error('找不到 dist/client，請先執行 npm run build');
    process.exit(1);
  }
  const pages = htmlPages(ROOT);
  const { banned, placeholders } = scan(pages);
  console.log(`掃描 ${pages.length} 個頁面`);
  if (placeholders.length) {
    console.log(`\n上線前要補的佔位內容（${placeholders.length} 處）：`);
    for (const p of placeholders) console.log(`  ${p.path}：${p.text}`);
  } else {
    console.log('沒有佔位內容');
  }
  if (banned.length) {
    console.error(`\n❌ 出現禁用名稱（${banned.length} 處）：`);
    for (const b of banned) console.error(`  ${b.path}：${b.word}`);
  } else {
    console.log('✅ 沒有禁用名稱');
  }
  const strict = process.argv.includes('--strict');
  process.exit(banned.length || (strict && placeholders.length) ? 1 : 0);
}
