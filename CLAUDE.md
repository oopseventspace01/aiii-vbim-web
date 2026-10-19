# CLAUDE.md — Aiii VBIM OS 2.0 官網

## 你在做什麼
依照 `SPEC.md` 建置 Aiii VBIM 官網 2.0（Astro + Sanity + Vercel，雙語）。SPEC.md 是唯一的需求來源，與它衝突的想法要先提出來，不要直接改。

## 和我溝通的方式
- 一律用**繁體中文**回覆。
- 我是程式新手：每完成一步，用白話說明「做了什麼、為什麼、我要怎麼確認」，指令要能直接複製貼上。
- 不要一次貼超過 50 行程式碼到對話裡；程式碼寫進檔案。

## 工作規則
1. **一次只做一個階段**（SPEC.md 第 12 節 P0～P8）。每個階段開始前先列出計畫，完成後停下來回報：做了什麼、怎麼測試、下一步是什麼。等我說「繼續」才往下。
2. 每個階段都要跑兩層測試：單步檢查（該功能本身）＋ E2E（整體流程）。
3. **不可編造內容**：數字、客戶名稱、案例、夥伴、認證標準一律用 `[TBD: 說明]` 佔位。
4. **機密**：任何 token、金鑰、Webhook 網址都放 `.env`，絕不寫進程式碼或 commit。發現自己要 commit 機密時立刻停下。
5. 不要使用 LINE Notify（已停用）；LINE 一律走 LINE OA Messaging API。
6. 不要假設任何 API 額度；用到第三方服務時先說明額度限制。
7. 依賴套件用最新穩定版，安裝前先說明要裝什麼、為什麼。
8. 任何會影響正式環境的動作（部署到 production、改 DNS、改 Sanity production dataset 結構）都要先問我，並附上 rollback 方法。

## 遇到以下情況要停下來重新規劃
- 範圍變更（SPEC.md 沒寫的需求）
- 資安疑慮
- 同一個問題連續兩次測試失敗
- 需要付費方案或費用可能超出預期
- 第三方 API 額度不足

## 常用指令（在專案根目錄 `C:\dev\aiii-vbim-web` 執行）
- 安裝依賴：`npm install`
- 開發網站：`npm run dev` → http://localhost:4321
- 開發 Studio：`npm run studio` → http://localhost:3333
- 單元測試：`npm test`
- E2E 測試：`npm run test:e2e`
- 全部檢查（同 CI）：`npm run check`
- 環境變數：只有根目錄一個 `.env`（從 `.env.example` 複製），網站與 Studio 共用
- Node 版本：24 LTS（`.nvmrc`；本機用 nvm 管理）

## 完成定義
SPEC.md 第 8 節驗收標準全部通過，第 13 節交接文件齊全。
