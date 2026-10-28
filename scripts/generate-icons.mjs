// 產生網站圖示與預設分享圖（SPEC 7）：node scripts/generate-icons.mjs
// 來源：design/assets/logo.png（左側方塊圖形當圖示；整個 logo 放在分享圖）
// 輸出到 apps/web/public/，之後有設計好的正式檔案可以直接覆蓋同名檔案
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const src = new URL('design/assets/logo.png', root).pathname.replace(/^\/([A-Z]:)/, '$1');
const out = (name) =>
  new URL(`apps/web/public/${name}`, root).pathname.replace(/^\/([A-Z]:)/, '$1');
mkdirSync(out(''), { recursive: true });

// logo 左側的方塊圖形（549×159 原圖中，x 0–150）
const mark = await sharp(src).extract({ left: 0, top: 0, width: 150, height: 159 }).toBuffer();

async function icon(
  size,
  name,
  { background = { r: 0, g: 0, b: 0, alpha: 0 }, padding = 0.08 } = {},
) {
  const inner = Math.round(size * (1 - padding * 2));
  const resized = await sharp(mark)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(out(name));
}

await icon(48, 'favicon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');
// iPhone 主畫面圖示不支援透明，用白底
await icon(180, 'apple-touch-icon.png', { background: '#ffffff', padding: 0.14 });

// 預設分享圖 1200×630：淺色背景＋完整 logo＋英文標語（頁尾既有文字）
const logo = await sharp(src).resize({ width: 760 }).toBuffer();
const tagline = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f3f7fc"/>
    <rect x="0" y="600" width="1200" height="30" fill="#2160e8"/>
    <text x="600" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#0c1a33">AI-Powered Physical World Operating System</text>
  </svg>`,
);
await sharp(tagline)
  .composite([{ input: logo, top: 150, left: 220 }])
  .png()
  .toFile(out('og-default.png'));

console.log('icons written to apps/web/public/');
