# Aiii VBIM OS 2.0 官網

Astro + Sanity + Vercel，雙語（繁中／英文）。需求以 [SPEC.md](SPEC.md) 為準。

- 官網：https://aiiivbim.com（上線前為舊網站）
- 後台：https://aiiivbim.com/admin → https://aiii-vbim.sanity.studio

## 文件目錄

| 給誰看       | 文件                                                                                   | 內容                                                |
| ------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 業主、編輯   | [後台操作手冊](docs/SOP-後台操作手冊.md)                                               | 發消息、上傳案例、加夥伴 Logo、改首頁標語、審稿流程 |
| 業主、工程師 | [設定說明](docs/設定說明.md)                                                           | 所有帳號與服務、環境變數對照（不含密碼）            |
| 業主、工程師 | [維運手冊](docs/維運手冊.md)                                                           | 每週／每月檢查、看名單、常見問題、備份              |
| 工程師       | [回滾計畫](docs/rollback-plan.md)                                                      | 程式、內容、網域、表單出問題時怎麼回復              |
| 工程師       | [上線檢查清單](docs/launch-checklist.md)                                               | 上線前、上線當天、上線後 7 天                       |
| 工程師       | [驗收報告](docs/acceptance-report.md)                                                  | SPEC 第 8 節逐項狀態                                |
| 工程師       | [n8n 名單工作流](docs/n8n-lead-workflow.md)                                            | 表單 → n8n → 試算表、確認信                         |
| 業主         | [需求表分析](docs/form-analysis.md)、[文案精簡決定](docs/copy-decisions-2026-10-20.md) | 歷次業主決定的紀錄                                  |

## 專案結構

```
apps/web/      Astro 網站（src/pages、src/components、src/styles/tokens.css、tests/）
apps/studio/   Sanity Studio 後台（schemas/）
docs/          交接文件；docs/reference/ 放舊站參考資料
scripts/       共用小工具（讀取根目錄 .env）
```

## 第一次使用

1. 安裝 Node 24 LTS（見 `.nvmrc`）
2. `npm install`
3. 複製 `.env.example` 為 `.env`，填入實際值（`.env` 不會被 commit）

## 常用指令

| 指令                                | 用途                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `npm run dev`                       | 啟動網站開發伺服器（http://localhost:4321）          |
| `npm run studio`                    | 啟動 Sanity Studio（http://localhost:3333）          |
| `npm test`                          | 單元測試（Vitest）                                   |
| `npm run test:e2e`                  | E2E 測試（Playwright）                               |
| `npm run seed`                      | 匯入種子資料到 Sanity（需先 `npx sanity login`）     |
| `npm run lint`                      | 程式碼檢查                                           |
| `npm run format`                    | 自動排版                                             |
| `npm run check`                     | 全部檢查（與 CI 相同，E2E 除外）                     |
| `npm run studio:deploy`             | 發布後台到 https://aiii-vbim.sanity.studio           |
| `npm run check:content -w apps/web` | 內容檢查：禁用名稱、`[TBD]` 等佔位文字（需先 build） |
| `npm run lighthouse -w apps/web`    | 本機 Lighthouse 手機版評分（需先 build）             |
