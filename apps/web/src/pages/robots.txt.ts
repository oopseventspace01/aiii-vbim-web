// robots.txt（SPEC 7）：允許收錄，開發展示頁與 API 不收錄，並指向網站地圖
import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? SITE_URL;
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dev/',
    'Disallow: /api/',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
