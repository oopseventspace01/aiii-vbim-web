// 舊網址轉址對照表（SPEC 7）：舊網址 → 新網址，一律 301 永久轉址
// 舊網站（Gamma）上線前只有 /、/aiiivbim-en、/contact、/news 四個網址（2026-10-28 抓取）；
// /、/contact、/news 新網站有同樣的網址，不需要轉址。之後要加對照，直接在下面新增一行。
export const REDIRECTS = {
  '/aiiivbim-en': '/en',
};

/** 後台（Sanity Studio，放在 Sanity 官方主機）的網址 */
export const STUDIO_URL = 'https://aiii-vbim.sanity.studio';

// 好記的捷徑：302 暫時轉址（目的地日後可能更換，不讓瀏覽器永久記住）
export const SHORTCUTS = {
  '/admin': STUDIO_URL,
};
