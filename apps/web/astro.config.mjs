// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
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
