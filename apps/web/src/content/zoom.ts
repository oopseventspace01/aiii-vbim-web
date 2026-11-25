// 全站「點圖放大」（lightbox）的介面文字與小工具
// 2026-11-25 業主同意加放大：只有標了 zoom 的內容圖片可以放大（opt-in），
// Logo、圖示、背景裝飾、影片封面、夥伴 Logo 牆、整張是連結的卡片照片都不做。
import type { Locale } from '../lib/i18n';

export const ZOOM_COPY: Record<Locale, { open: string; close: string; dialog: string }> = {
  'zh-Hant': { open: '放大圖片', close: '關閉', dialog: '放大的圖片' },
  en: { open: 'Enlarge image', close: 'Close', dialog: 'Enlarged image' },
};

/** 從網址判斷語言（英文頁都在 /en 底下） */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh-Hant';
}

/** 放大用的寬度：用原圖寬度，但最多 2400px（太大的原圖不必整張下載） */
export const ZOOM_MAX_WIDTH = 2400;
export function zoomWidth(originalWidth: number | undefined): number {
  return originalWidth && originalWidth > 0
    ? Math.min(originalWidth, ZOOM_MAX_WIDTH)
    : ZOOM_MAX_WIDTH;
}
