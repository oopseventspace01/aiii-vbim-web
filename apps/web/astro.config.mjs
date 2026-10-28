// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { REDIRECTS } from './redirects.mjs';
import siteFont from './integrations/site-font.mjs';
import '../../scripts/load-root-env.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://aiiivbim.com',
  output: 'static',
  // 後台（Sanity）上傳的圖片：建置時下載並最佳化
  image: { domains: ['cdn.sanity.io'] },
  // 開發工具列會蓋住畫面、影響截圖檢查，關閉
  devToolbar: { enabled: false },
  adapter: vercel(),
  // 舊網址 301 轉址（對照表在 redirects.mjs）。用 Astro 設定而不是 vercel.json：
  // Vercel 轉接器會把它寫進部署設定，本機開發也能測試
  redirects: Object.fromEntries(
    Object.entries(REDIRECTS).map(([from, to]) => [from, { status: 301, destination: to }]),
  ),
  // 網站地圖（SPEC 7）：中英文互相標示對應頁；開發展示頁、404 不列入
  integrations: [
    // 中文字型瘦身：建置後只取網站用到的字（見 integrations/site-font.mjs）
    siteFont(),
    sitemap({
      filter: (page) => !/\/(dev|404)(\/|$)/.test(new URL(page).pathname),
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/+$/, '') || '/';
        const bare = path === '/en' ? '/' : path.replace(/^\/en(?=\/)/, '');
        const zh = bare;
        const en = bare === '/' ? '/en' : `/en${bare}`;
        const abs = (/** @type {string} */ p) => (p === '/' ? url.origin + '/' : url.origin + p);
        return {
          ...item,
          url: abs(path),
          links: [
            { lang: 'zh-Hant', url: abs(zh) },
            { lang: 'en', url: abs(en) },
            { lang: 'x-default', url: abs(zh) },
          ],
        };
      },
    }),
  ],
  // 表單（P5）：執行時才讀取的環境變數，值放在 .env／Vercel，絕不寫進程式碼
  env: {
    schema: {
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      N8N_LEAD_WEBHOOK_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      N8N_LEAD_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      CHECKLIST_FORM_BUILDING: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_FORM_MANUFACTURING: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_FORM_MEDICAL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_FORM_RETAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_PDF_BUILDING: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_PDF_MANUFACTURING: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_PDF_MEDICAL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHECKLIST_PDF_RETAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  i18n: {
    locales: ['zh-Hant', 'en'],
    defaultLocale: 'zh-Hant',
    routing: { prefixDefaultLocale: false },
  },
  // 英文標題字型自行託管（建置時下載），不依賴 Google Fonts；SPEC 第 4 節
  // 中文 Noto Sans TC 改用 @fontsource-variable/noto-sans-tc（見 global.css），
  // 因為 Astro 的 subsets 選不到中文的 108 個分段檔
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
