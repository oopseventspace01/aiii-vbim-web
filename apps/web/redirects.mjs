// 舊網址轉址對照表（SPEC 7）：舊網址 → 新網址，一律 301 永久轉址
// 舊網站（Gamma）上線前只有 /、/aiiivbim-en、/contact、/news 四個網址（2026-10-28 抓取）；
// /、/contact、/news 新網站有同樣的網址，不需要轉址。之後要加對照，直接在下面新增一行。
export const REDIRECTS = {
  '/aiiivbim-en': '/en',
};
