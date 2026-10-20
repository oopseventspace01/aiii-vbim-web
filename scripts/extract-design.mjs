// 從設計稿（design/pages/*.dc.html）取出 renderVals() 的資料，存成 JSON 給網站使用。
// 用途：卡片、表格列等清單文案「逐字」來自設計稿，不靠手動複製。
//
// 執行：node scripts/extract-design.mjs
// 產出：apps/web/src/content/design/<頁面>.json（請勿手動修改，改設計稿後重新執行）
// 單元測試會重新執行一次並比對，確保 JSON 與設計稿一致。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const PAGES_DIR = `${root}design/pages`;
const OUT_DIR = `${root}apps/web/src/content/design`;

export const PAGES = ['VBIM', 'Platform', 'Solutions', 'Energy', 'EdgeAI', 'About'];

/** 執行一個設計稿的 renderVals()，state 可指定（例如分頁索引） */
function render(html, state) {
  const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error('找不到設計稿腳本');
  class DCLogic {
    constructor(props) {
      this.props = props ?? {};
      this.state = {};
    }
    setState() {}
  }
  const Component = new Function('DCLogic', `${script}\nreturn Component;`)(DCLogic);
  const c = new Component({});
  if (state) c.state = { ...c.state, ...state };
  // JSON 轉換會移除函式（點擊事件），只留下文字資料
  return JSON.parse(JSON.stringify(c.renderVals()));
}

export function extract(file) {
  const html = readFileSync(`${PAGES_DIR}/${file}.dc.html`, 'utf-8');
  const vals = render(html);
  // 有分頁切換（tabs + cur）的頁面：把每個分頁的內容都取出
  if (Array.isArray(vals.tabs) && vals.cur) {
    vals.allTabs = vals.tabs.map((_, i) => render(html, { i }).cur);
    delete vals.cur;
  }
  if (Array.isArray(vals.tabs)) vals.tabs = vals.tabs.map((t) => ({ label: t.label }));
  return vals;
}

export function extractAll() {
  const data = {};
  for (const page of PAGES) {
    data[page] = { 'zh-Hant': extract(page), en: extract(`en-${page}`) };
  }
  return data;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [page, value] of Object.entries(extractAll())) {
    writeFileSync(`${OUT_DIR}/${page}.json`, `${JSON.stringify(value, null, 2)}\n`);
  }
  console.log(`已輸出 ${PAGES.length} 頁的設計稿資料到 apps/web/src/content/design/`);
}
