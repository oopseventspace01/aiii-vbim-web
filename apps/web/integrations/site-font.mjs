// 中文字型瘦身（P6 效能）：建置完成後，只取網站實際用到的字做成 Noto Sans TC 子集字型
// - 掃描建置好的 HTML，收集所有用到的字
// - 分批向 Google Fonts 取得「只含這些字」的 woff2（text= 參數），存到 /fonts/site/，網站自行託管
// - 產生 /fonts/site-font.css（字型名稱 'Noto Sans TC Site'），BaseLayout 在正式環境載入
// 後台每次發布都會重新建置，新文章的字也會一起收進子集；萬一還是有沒涵蓋的字，改用系統中文字型顯示。
// 下載失敗時只會寫一個空的 CSS，網站改用系統中文字型（PingFang TC／微軟正黑體），照常可讀。
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const FAMILY = 'Noto Sans TC Site';
const API = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400..900&text=';
// 用新版 Chrome 的 User-Agent，Google 才會回傳 woff2
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
// 每批字數：太少會變成很多檔案（每載入一個字型就重新排版一次），太多會超過網址長度上限
const BATCH = 320;
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

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

async function get(url, as) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url.slice(0, 80)}`);
  return as === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
}

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
          const text = collectText(pages.map((f) => readFileSync(f, 'utf-8')));
          const chars = [...text];
          const rules = [];
          let n = 0;
          let bytes = 0;
          for (let i = 0; i < chars.length; i += BATCH) {
            const css = await get(
              API + encodeURIComponent(chars.slice(i, i + BATCH).join('')),
              'text',
            );
            for (const block of css.match(/@font-face\s*{[^}]+}/g) ?? []) {
              const src = block.match(/url\((https:[^)]+)\)/)?.[1];
              const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
              if (!src || !range) continue;
              const font = await get(src);
              const file = `fonts/site/${n++}.woff2`;
              write(file, font);
              bytes += font.length;
              rules.push(
                `@font-face{font-family:'${FAMILY}';font-style:normal;font-weight:400 900;font-display:swap;src:url(/${file}) format('woff2');unicode-range:${range};}`,
              );
            }
          }
          write('fonts/site-font.css', rules.join('\n') + '\n');
          logger.info(
            `${chars.length} 個字 → ${n} 個子集字型檔，共 ${Math.round(bytes / 1024)} KB`,
          );
        } catch (err) {
          write('fonts/site-font.css', '/* 子集字型產生失敗，改用系統中文字型 */\n');
          logger.warn(`子集字型產生失敗（網站會改用系統中文字型）：${err.message}`);
        }
      },
    },
  };
}
