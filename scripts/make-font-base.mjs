// 產生網站圓體的「底稿字型」（只需在換字型時跑一次，結果 commit 進 apps/web/fonts-src/）
// 字型：源泉圓體 GenSen Rounded 2 TW（SIL Open Font License 1.1，可商用、可嵌入網站）
//   下載：https://github.com/ButTaiwan/gensen-font/releases（GenSenRounded2TW-otf.zip）
// 用法：node scripts/make-font-base.mjs <放 OTF 的資料夾> <字表 chars.txt>
//   字表＝Big5 全部中文＋常用標點／英數；原始 OTF 每個 15MB，縮成約 1/3 再放進專案。
// 建置時 apps/web/integrations/site-font.mjs 會再從這裡只取網站實際用到的字。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import subsetFont from 'subset-font';

const [dir, charsFile] = process.argv.slice(2);
if (!dir || !charsFile)
  throw new Error('用法：node scripts/make-font-base.mjs <OTF 資料夾> <chars.txt>');
const text = readFileSync(charsFile, 'utf8');
const out = new URL('../apps/web/fonts-src/', import.meta.url);
mkdirSync(out, { recursive: true });

for (const [w, file] of [
  [400, 'GenSenRounded2TW-R.otf'],
  [700, 'GenSenRounded2TW-B.otf'],
  [900, 'GenSenRounded2TW-H.otf'],
]) {
  const buf = await subsetFont(readFileSync(join(dir, file)), text, { targetFormat: 'woff2' });
  writeFileSync(new URL(`gensen-${w}.woff2`, out), buf);
  console.log(`gensen-${w}.woff2 ${Math.round(buf.length / 1024)} KB`);
}
