// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import '../../scripts/load-root-env.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://aiiivbim.com',
  output: 'static',
  adapter: vercel(),
  i18n: {
    locales: ['zh-Hant', 'en'],
    defaultLocale: 'zh-Hant',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
