// Sanity 讀取（只在建置時執行；訪客瀏覽時不會呼叫 Sanity API）
// 只讀「已發布」內容，不需要 token。
import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const API_VERSION = '2025-02-19';

let cached: SanityClient | undefined;

export function sanityClient(): SanityClient {
  if (cached) return cached;
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
  if (!projectId) {
    throw new Error('缺少 PUBLIC_SANITY_PROJECT_ID：請確認根目錄 .env（或 CI 的環境變數）');
  }
  cached = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: true,
    perspective: 'published',
  });
  return cached;
}

/** Sanity 圖片網址：自動輸出 WebP／AVIF 並依需要裁切尺寸 */
export function imageUrl(source: { asset?: { _id?: string; url?: string } | null }, width: number) {
  return createImageUrlBuilder(sanityClient())
    .image(source)
    .width(width)
    .auto('format')
    .fit('max')
    .url();
}
