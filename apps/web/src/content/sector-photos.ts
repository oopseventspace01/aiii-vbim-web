// 首頁五大場域卡片的真實照片（SPEC v1.4）：業主提供後放進 src/assets/sectors/ 並在這裡登記。
// 沒有照片的卡片維持設計稿的純文字樣式，不使用假照片。
import type { ImageMetadata } from 'astro';

export const SECTOR_PHOTOS: Partial<
  Record<
    'hospital' | 'retail' | 'factory' | 'office' | 'energy',
    { src: ImageMetadata; alt: Record<'zh-Hant' | 'en', string> }
  >
> = {};
