# 上線檢查清單與回滾方式（SPEC 7）

> 這份文件只寫步驟，**不會自動執行**。改 DNS、部署到正式環境前，Claude 會先問業主（CLAUDE.md 第 8 條）。

## 0. 目前的 DNS（2026-10-28 查詢，回滾時照這裡改回去）

網域 `aiiivbim.com` 的 DNS 由 **Namecheap** 管理（`dns1/dns2.registrar-servers.com`）。

| 類型  | 主機  | 值                                                   | 用途                                   |
| ----- | ----- | ---------------------------------------------------- | -------------------------------------- |
| A     | `@`   | `3.136.232.26`                                       | 舊網站（Gamma）                        |
| A     | `@`   | `3.137.108.170`                                      | 舊網站（Gamma）                        |
| CNAME | `www` | `sites.gamma.app`                                    | 舊網站（Gamma）                        |
| MX    | `@`   | `10 mx1.privateemail.com`、`10 mx2.privateemail.com` | **公司信箱，切換時不要動**             |
| TXT   | `@`   | `v=spf1 include:spf.privateemail.com ~all`           | 信箱防偽，**不要動**                   |
| TXT   | `@`   | `google-site-verification=…`                         | Google Search Console 驗證，**不要動** |

## 1. 上線前（網站還在 Vercel 預覽網址時）

- [ ] **切換前一天**：Namecheap 把 `A @` 與 `CNAME www` 的 TTL 調成 5 分鐘（300 秒），萬一要回滾能很快生效（見 `rollback-plan.md` 第 3 節）
- [ ] 後台已發布到 https://aiii-vbim.sanity.studio，業主與 Andy 都能登入
- [ ] 用 GitHub Actions「更新截圖基準」產生 375px 截圖基準圖
- [ ] `npm run build` 後執行 `npm run check:content -w apps/web`：沒有禁用名稱、沒有 `[TBD]` 等佔位文字

- [ ] Vercel 方案已確認（商業網站需 Pro，費用由業主決定）
- [ ] Vercel 專案的環境變數都已填好（Production 與 Preview 都要）：
  - Sanity：`PUBLIC_SANITY_PROJECT_ID`、`PUBLIC_SANITY_DATASET`、`SANITY_API_READ_TOKEN`
  - 表單：`N8N_LEAD_WEBHOOK_URL`、`N8N_LEAD_SECRET`
  - Turnstile：`PUBLIC_TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY`（**正式金鑰**，不可用測試金鑰）
  - 需求表：`CHECKLIST_FORM_*`、`CHECKLIST_PDF_*`
  - GA4（選填）：`PUBLIC_GA_ID`
- [ ] Turnstile Widget 的主機名稱加上 `aiiivbim.com` 與 `www.aiiivbim.com`
- [x] Sanity Webhook 指向 Vercel Deploy Hook（後台發布後自動重建）— 2026-10-29 已設定並實測，約 20～40 秒完成重建。換成正式網域不用重設。
- [ ] 在 Vercel 預覽網址跑一次：表單三種身分各送一筆、檢查確認信與試算表
- [ ] 用 [PageSpeed Insights](https://pagespeed.web.dev/) 測預覽網址：手機效能 ≥ 90、無障礙 ≥ 95、SEO ≥ 95（SPEC 8）
- [ ] 隱私權政策已在後台發布（目前顯示「制定中」且不收錄）

## 2. 上線當天：切換網域（由業主確認時間後執行）

建議在流量低的時段（例如平日晚上）進行。

1. Vercel 專案 → Settings → Domains：新增 `aiiivbim.com` 與 `www.aiiivbim.com`（`www` 設為轉址到 `aiiivbim.com`）。
2. Vercel 會顯示要設定的 DNS 值（以 Vercel 畫面為準，通常是 `A @ 76.76.21.21` 與 `CNAME www cname.vercel-dns.com`）。
3. Namecheap → Domain List → `aiiivbim.com` → Advanced DNS：
   - 刪除舊的兩筆 `A @`（Gamma），新增 Vercel 給的 `A @`
   - 把 `CNAME www` 從 `sites.gamma.app` 改成 Vercel 給的值
   - **MX、TXT 都不要動**
4. 等 DNS 生效（通常幾分鐘到 1 小時，最長 48 小時），Vercel Domains 頁面顯示「Valid Configuration」、自動發 HTTPS 憑證。

## 3. 上線當天：切換後檢查

- [ ] `https://aiiivbim.com` 與 `https://www.aiiivbim.com` 都開得到新網站，`www` 會轉到不帶 `www` 的網址
- [ ] 舊網址轉址正常：`https://aiiivbim.com/aiiivbim-en` → `/en`（對照表在 `apps/web/redirects.mjs`）
- [ ] `https://aiiivbim.com/sitemap-index.xml`、`https://aiiivbim.com/robots.txt` 打得開
- [ ] 正式網址送一筆表單測試，確認試算表與確認信
- [ ] 公司信箱收發正常（確認 MX 沒被動到）
- [ ] Google Search Console：提交 `sitemap-index.xml`
- [ ] 分享測試：把首頁網址貼到 LINE，確認出現標題、描述與分享圖

## 4. 回滾（新網站有問題、要先換回舊網站時）

1. Namecheap → Advanced DNS：
   - 刪除 Vercel 的 `A @`，加回 `A @ 3.136.232.26` 與 `A @ 3.137.108.170`
   - `CNAME www` 改回 `sites.gamma.app`
2. 等 DNS 生效後，`aiiivbim.com` 會回到舊網站（Gamma 上的舊網站在切換期間請**不要刪除**）。
3. Vercel 上的新網站不受影響，可以繼續用預覽網址修正後再切換一次。

> 只是某次部署有問題（DNS 不用動）：Vercel → Deployments → 找到上一個正常的版本 → **Promote to Production**，幾秒內就會換回去。

## 5. 上線後 7 天

- [ ] **第 1 天**：三種身分各送一筆正式表單，確認試算表、確認信、內部通知信（LINE 推播設定好的話也確認）
- [ ] **第 1 天**：業主或 Andy 依 `SOP-後台操作手冊.md` 實際發一則消息，計時「發布 → 網站出現」，把時間記在手冊 1-2
- [ ] **第 1–3 天**：每天看 n8n Executions 有沒有失敗、Vercel 有沒有部署失敗
- [ ] **第 2 天**：PageSpeed Insights 測正式網址（首頁、平台、最新消息），未達 SPEC 8 標準就調整
- [ ] **第 3 天**：Google Search Console 確認 sitemap 已讀取、沒有大量錯誤；舊網址 `/aiiivbim-en` 轉址正常
- [ ] **第 3 天**：用真的 iPhone（Safari）與 Android 手機各開一次主要頁面與表單
- [ ] **第 7 天**：網站穩定的話，Namecheap 的 TTL 調回原本的值（約 30 分鐘）；Gamma 舊網站可以考慮停用（先確認沒有其他頁面還在使用）
- [ ] **第 7 天**：回顧名單試算表，確認每筆都有人處理
