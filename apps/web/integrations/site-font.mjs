// 中文字型瘦身（P6 效能；2026-11-12 業主指示改成圓體）：建置完成後，只取網站實際用到的字做成子集字型
// - 字型：源泉圓體 GenSen Rounded 2 TW（SIL OFL 1.1，可商用），底稿在 fonts-src/（產生方式見 scripts/make-font-base.mjs）
// - 掃描建置好的 HTML，收集所有用到的字，依使用頻率分批切成小檔，存到 /fonts/site/，網站自行託管
// - 產生 /fonts/site-font.css（字型名稱 'Aiii Rounded'），BaseLayout 在正式環境載入
// 後台每次發布都會重新建置，新文章的字也會一起收進子集；底稿沒有的罕用字改用系統中文字型顯示。
// 產生失敗時只會寫一個空的 CSS，網站改用系統中文字型（PingFang TC／微軟正黑體），照常可讀。
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const FAMILY = 'Aiii Rounded';
// 三個字重：400 用於內文與 500／600，700 用於粗體與 800，900 用於最粗標題
const WEIGHTS = [
  { file: 'gensen-400.woff2', range: '400 600' },
  { file: 'gensen-700.woff2', range: '700 800' },
  { file: 'gensen-900.woff2', range: '900' },
];
const SRC = new URL('../fonts-src/', import.meta.url);
// 每批字數：太少會變成很多檔案（每載入一個字型就重新排版一次），太多則每頁都要下載用不到的字
const BATCH = 320;
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function htmlFiles(dir) {
  return (
    readdirSync(dir, { withFileTypes: true, recursive: true })
      .filter((d) => d.isFile() && d.name.endsWith('.html'))
      .map((d) => join(d.parentPath ?? d.path, d.name))
      // 用建置資料夾底下的相對路徑判斷（專案本身就放在 C:\dev 底下，不能用完整路徑）
      .filter((f) => !/^dev[\\/]/.test(relative(dir, f)))
  );
}

/**
 * 頁面上看得到的文字用到的所有字元，依「出現在幾個頁面」由多到少排序：
 * 最常用的字分在第一批（每頁都會用到），少用的字分在後面幾批，只有用到的頁面才會下載
 */
export function collectText(htmls) {
  const pagesUsing = new Map();
  for (const html of htmls) {
    const text = html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&(?:#(\d+)|#x([0-9a-f]+)|(amp|lt|gt|quot|apos|nbsp));/gi, (_m, d, h, name) =>
        d
          ? String.fromCodePoint(+d)
          : h
            ? String.fromCodePoint(parseInt(h, 16))
            : ENTITIES[name.toLowerCase()],
      );
    for (const c of new Set(text)) if (c.trim()) pagesUsing.set(c, (pagesUsing.get(c) ?? 0) + 1);
  }
  // 空白也要收進子集
  pagesUsing.set(' ', Infinity);
  pagesUsing.set(' ', Infinity);
  return [...pagesUsing.entries()]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .map(([c]) => c)
    .join('');
}

const unicodeRange = (chars) =>
  chars.map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(',');

export default function siteFont() {
  return {
    name: 'aiii-site-font',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const targets = [out, join(out, '..', '..', '.vercel', 'output', 'static')].filter(
          existsSync,
        );
        const write = (rel, data) => {
          for (const t of targets) {
            mkdirSync(join(t, rel, '..'), { recursive: true });
            writeFileSync(join(t, rel), data);
          }
        };
        try {
          const pages = htmlFiles(out);
          const chars = [...collectText(pages.map((f) => readFileSync(f, 'utf-8')))];
          const rules = [];
          let n = 0;
          let bytes = 0;
          for (const w of WEIGHTS) {
            const base = readFileSync(new URL(w.file, SRC));
            for (let i = 0; i < chars.length; i += BATCH) {
              const batch = chars.slice(i, i + BATCH);
              const font = await subsetFont(base, batch.join(''), { targetFormat: 'woff2' });
              const file = `fonts/site/${n++}.woff2`;
              write(file, font);
              bytes += font.length;
              rules.push(
                `@font-face{font-family:'${FAMILY}';font-style:normal;font-weight:${w.range};font-display:swap;src:url(/${file}) format('woff2');unicode-range:${unicodeRange(batch)};}`,
              );
            }
          }
          write('fonts/site-font.css', rules.join('\n') + '\n');
          logger.info(
            `${chars.length} 個字 × ${WEIGHTS.length} 個字重 → ${n} 個子集字型檔，共 ${Math.round(bytes / 1024)} KB`,
          );
        } catch (err) {
          write('fonts/site-font.css', '/* 子集字型產生失敗，改用系統中文字型 */\n');
          logger.warn(`子集字型產生失敗（網站會改用系統中文字型）：${err.message}`);
        }
      },
    },
  };
}
