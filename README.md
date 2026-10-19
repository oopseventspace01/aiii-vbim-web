# Aiii VBIM OS 2.0 官網

Astro + Sanity + Vercel，雙語（繁中／英文）。需求以 [SPEC.md](SPEC.md) 為準。

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

| 指令               | 用途                                             |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | 啟動網站開發伺服器（http://localhost:4321）      |
| `npm run studio`   | 啟動 Sanity Studio（http://localhost:3333）      |
| `npm test`         | 單元測試（Vitest）                               |
| `npm run test:e2e` | E2E 測試（Playwright）                           |
| `npm run seed`     | 匯入種子資料到 Sanity（需先 `npx sanity login`） |
| `npm run lint`     | 程式碼檢查                                       |
| `npm run format`   | 自動排版                                         |
| `npm run check`    | 全部檢查（與 CI 相同，E2E 除外）                 |
