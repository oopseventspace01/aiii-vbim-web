// 網站地圖瘦身（SEO）：建置完成後，把「不收錄」（noindex）的頁面從網站地圖拿掉，
// 也拿掉其他頁面指向它們的 hreflang 對應。
// 例如：英文消息還沒翻譯時，/en/news/xxx 顯示中文內容並設 noindex，就不該出現在網站地圖。
// 另外，伺服器端轉址的舊網址（例如 /aiiivbim-en、/cases，prerender = false）沒有靜態 HTML，
// @astrojs/sitemap 仍會列入，這裡也一併拿掉：網站地圖只該列真正的頁面，不列轉址。
// 判斷依據是建置出來的 HTML 本身（<meta name="robots" content="noindex…">），
// 頁面設定改了，網站地圖自動跟著變，不需要另外維護清單。
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;

/** 網址 → 建置出來的 HTML 檔（/ → index.html；/about → about/index.html 或 about.html） */
export function htmlFileFor(outDir, loc) {
  const path = decodeURIComponent(new URL(loc).pathname).replace(/\/+$/, '');
  const candidates = path
    ? [join(outDir, path, 'index.html'), join(outDir, `${path}.html`)]
    : [join(outDir, 'index.html')];
  return candidates.find((f) => existsSync(f));
}

/**
 * 純函式：移除 noindex 的 <url>，以及其他 <url> 裡指向它們的 xhtml:link。
 * 某頁拿掉後只剩指向自己的對應（沒有另一語言），就整組 hreflang 都拿掉。
 */
export function pruneSitemap(xml, isNoindex) {
  const removed = new Set();
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (loc && isNoindex(loc)) removed.add(loc);
  }
  if (!removed.size) return { xml, removed: [] };
  const out = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const loc = block.match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (loc && removed.has(loc)) return '';
    let next = block.replace(/<xhtml:link\b[^>]*\/>/g, (link) => {
      const href = link.match(/href="([^"]*)"/)?.[1];
      return href && removed.has(href) ? '' : link;
    });
    const hrefs = [...next.matchAll(/<xhtml:link\b[^>]*href="([^"]*)"[^>]*\/>/g)].map((m) => m[1]);
    if (hrefs.length && hrefs.every((h) => h === loc)) {
      next = next.replace(/<xhtml:link\b[^>]*\/>/g, '');
    }
    return next;
  });
  return { xml: out, removed: [...removed] };
}

export default function sitemapNoindex() {
  return {
    name: 'aiii-sitemap-noindex',
    hooks: {
      // 必須排在 @astrojs/sitemap 後面（astro.config.mjs 的 integrations 順序）
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const targets = [out, join(out, '..', '..', '.vercel', 'output', 'static')].filter(
          existsSync,
        );
        const cache = new Map();
        const isNoindex = (loc) => {
          if (!cache.has(loc)) {
            const file = htmlFileFor(out, loc);
            // 沒有靜態頁面（伺服器端轉址）或設了 noindex，都不放進網站地圖
            cache.set(loc, !file || NOINDEX.test(readFileSync(file, 'utf-8')));
          }
          return cache.get(loc);
        };
        for (const target of targets) {
          for (const name of readdirSync(target).filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
            const file = join(target, name);
            const { xml, removed } = pruneSitemap(readFileSync(file, 'utf-8'), isNoindex);
            if (removed.length) {
              writeFileSync(file, xml);
              if (target === out) {
                logger.info(
                  `網站地圖移除 ${removed.length} 個不收錄或轉址的網址：${removed.join('、')}`,
                );
              }
            }
          }
        }
      },
    },
  };
}
