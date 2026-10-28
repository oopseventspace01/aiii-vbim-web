// Lighthouse 手機版評分（SPEC 8）：先 npm run build，再 npm run lighthouse -w apps/web
// 用建置好的靜態檔（dist/client）在本機開一個伺服器測，不需要網路上的正式網站。
// 報告存在 apps/web/.lighthouse/（不進 git）。
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const ROOT = new URL('../dist/client/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const PORT = 4322;
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/platform', '/solutions', '/contact', '/news', '/en'];
const TARGET = { performance: 90, accessibility: 95, 'best-practices': 90, seo: 95 };
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

if (!existsSync(ROOT)) {
  console.error('找不到 dist/client，請先執行 npm run build');
  process.exit(1);
}

// 簡易靜態伺服器：/about → about/index.html；文字檔 gzip 壓縮＋快取標頭，模擬 Vercel 正式環境
const server = createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(ROOT, url);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  else if (!extname(file)) file = `${file}/index.html`;
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  const immutable = url.startsWith('/_astro/');
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const compress =
    /text|javascript|xml|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '');
  const body = readFileSync(file);
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=0',
    ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
  });
  res.end(compress ? gzipSync(body) : body);
});
await new Promise((r) => server.listen(PORT, r));

const chrome = await chromeLauncher.launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox'],
});
const outDir = new URL('../.lighthouse/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
mkdirSync(outDir, { recursive: true });

let failed = false;
const rows = [];
for (const page of PAGES) {
  const result = await lighthouse(`http://localhost:${PORT}${page}`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: Object.keys(TARGET),
  });
  const lhr = result.lhr;
  const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const lcp = lhr.audits['largest-contentful-paint']?.numericValue ?? 0;
  const row = {
    page,
    ...Object.fromEntries(Object.keys(TARGET).map((k) => [k, score(k)])),
    lcp: (lcp / 1000).toFixed(2) + 's',
  };
  rows.push(row);
  for (const [k, min] of Object.entries(TARGET)) if (row[k] < min) failed = true;
  if (page === '/' && lcp >= 2500) failed = true;
  writeFileSync(join(outDir, `${page.replace(/\W+/g, '_') || 'home'}.json`), result.report);
}
chrome.kill();
server.close();

console.table(rows);
console.log(
  `目標：效能 ≥ ${TARGET.performance}、無障礙 ≥ ${TARGET.accessibility}、SEO ≥ ${TARGET.seo}、首頁 LCP < 2.5s`,
);
process.exit(failed ? 1 : 0);
