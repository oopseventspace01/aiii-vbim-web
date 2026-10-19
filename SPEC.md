# Aiii VBIM OS 2.0 官網｜開發規格書 SPEC

> 版本：v1.0（2026-10-19）
> 用途：交給 Claude Code 逐階段執行。每個階段結束都要停下來回報，等確認後才進入下一階段。
> 標示 `[TBD]` 的項目是待業主提供的資料。**不可自行編造**，請用明顯的佔位文字代替。

---

## 0. 專案摘要

| 項目 | 內容 |
|---|---|
| 網站 | Aiii VBIM 官方網站 2.0 改版（現有網域 aiiivbim.com） |
| 定位 | 從「智慧建築系統」升級為「建築、設備、能源與 AI 的共同作業系統（OS）」 |
| 主標語 | One OS. Every Building. Every System. |
| 中文副標 | 建築、設備、能源與 AI 的共同作業系統 |
| 頁尾標語 | The Operating System for Intelligent Infrastructure |
| 三種訪客 | ① 業主／企業（買方） ② 設備商、SI、技術夥伴（生態夥伴） ③ 想取得認證的人才 |
| 網站目標 | 讓三種訪客各自找到入口並留下聯絡資料；讓業主團隊每週自行更新內容 |
| 語言 | 繁體中文（預設，`/`）＋英文（`/en`）。架構第一天就做雙語；英文內容分批補 |
| 內容維護者 | 業主團隊 3～5 人，非工程師，每週維護，經常發布消息與活動 |

### 成功指標（上線後追蹤）
- 每月表單名單數（依身分分類）
- 首頁 → 表單的轉換率
- 業主團隊可在不找工程師的情況下，獨立完成發文與修改

### 不做的事（Non-goals）
- 會員登入、線上付款、線上課程播放
- 把 VBIM 平台本身的功能嵌入官網
- 第一版不做完整英文內容（只做架構與 3 個核心頁面）

---

## 1. 技術架構

| 層 | 選用 | 說明 |
|---|---|---|
| 前端框架 | **Astro**（最新穩定版）+ TypeScript | 靜態網站為主，速度快、SEO 好 |
| 樣式 | Tailwind CSS（最新穩定版）＋ CSS 變數 design tokens | tokens 見第 4 節 |
| 內容後台 | **Sanity**（Studio 部署在 Sanity 官方託管） | 3～5 位非工程師編輯；文件層級雙語 |
| 雙語 | Astro i18n routing ＋ `@sanity/document-internationalization` | `zh-Hant` 預設不加前綴；`en` 走 `/en` |
| 部署 | **Vercel**（使用 Astro Vercel adapter，`output: 'static'`，表單 API 路由為 server function） | — |
| 內容更新 | Sanity 發布 → Webhook → Vercel Deploy Hook → 自動重建（約 1–2 分鐘） | — |
| 表單 | Astro API route `/api/lead` → 驗證 → 轉送 n8n Webhook | n8n 網址不可暴露在前端 |
| 防垃圾 | Cloudflare Turnstile ＋ honeypot 欄位 | — |
| 名單資料庫 | Supabase（Postgres） | 由 n8n 寫入 |
| 通知 | n8n → LINE OA（社群節點 `@aotoki/n8n-nodes-line-messaging`）＋ Email | **禁止使用 LINE Notify**（已停用） |
| 分析 | Google Analytics 4（以環境變數控制，未設定時不載入） | — |
| 測試 | Vitest（單元）＋ Playwright（E2E） | 見第 9 節 |

### 帳號與權限（重要）
| 服務 | Owner／最高權限 | 業主團隊權限 |
|---|---|---|
| GitHub repo | 專案負責人帳號 [TBD] | 不需要 |
| Vercel | 專案負責人帳號 [TBD] | 不需要 |
| Sanity 專案 | 專案負責人帳號 [TBD] | Editor／Reviewer |
| 網域 DNS | [TBD：確認目前由誰管理] | — |
| Supabase | 專案負責人帳號 [TBD] | 唯讀（之後若需要） |
| n8n | 專案負責人自架實例 | 不需要 |

> Claude Code 不得把任何 token、金鑰寫進程式碼或 commit；一律放在 `.env`（已列入 `.gitignore`）與 Vercel 環境變數。

---

## 2. 網站地圖

| # | 頁面 | 中文網址 | 英文網址 | 主要訪客 | 第一版英文 |
|---|---|---|---|---|---|
| 1 | 首頁 | `/` | `/en` | 全部 | ✅ |
| 2 | 平台 OS | `/platform` | `/en/platform` | 業主、夥伴 | ✅ |
| 3 | 解決方案總覽 | `/solutions` | `/en/solutions` | 業主 | — |
| 3a | 場域頁（5 頁） | `/solutions/[slug]` | `/en/solutions/[slug]` | 業主 | — |
| 4 | 地端 AI | `/edge-ai` | `/en/edge-ai` | 業主 | — |
| 5 | 案例列表／內頁 | `/cases`、`/cases/[slug]` | 同上加 `/en` | 業主 | — |
| 6 | 生態夥伴 | `/partners` | `/en/partners` | 夥伴 | ✅ |
| 7 | 認證學院 | `/academy` | `/en/academy` | 人才 | — |
| 8 | 最新消息與活動 | `/news`、`/news/[slug]` | 同上加 `/en` | 全部 | — |
| 9 | 關於我們 | `/about` | `/en/about` | 全部 | — |
| 10 | 聯絡我們 | `/contact` | `/en/contact` | 全部 | — |
| — | 隱私權政策 | `/privacy` | `/en/privacy` | — | — |
| — | 404 | — | — | — | ✅ |

**場域 slug**：`hospital`、`factory`、`commercial`、`office`、`energy-datacenter`

**英文頁尚無內容時**：顯示中文版，並在頁首提示「English version coming soon」。不可出現空白頁。

---

## 3. 頁面規格

### 3.1 首頁 `/`
依序 11 個區塊（已有可互動原型可參考版面）：

1. **導覽列**（sticky）：Logo、OS 架構、應用場域、戰情室、地端 AI、可信任、生態夥伴、認證學院、語言切換、「預約 Demo」按鈕。手機版收合為選單按鈕。
2. **Hero**
   - Eyebrow：`AIII VBIM OS 2.0`
   - H1：`One OS. / Every Building. / Every System.`
   - 副標：建築、設備、能源與 AI 的共同作業系統
   - 內文：從設計施工、設備儀器、重電能源、空調節能、地端 AI 到資安與營運，把分散的系統與數據，整合進同一個智慧營運平台。
   - 4 個標籤：Remote 遠距｜Multi-site 多點｜Data Intelligence 數據｜AI Control 智控
   - **雙入口卡片**：「我是業主／企業 → 預約導入 Demo」（連 `/contact?role=owner`）、「我是設備商／SI／技術夥伴 → 加入生態系」（連 `/partners`）
   - 右側：60 秒影片區。影片未完成前顯示封面圖＋「影片製作中」，**不可自動播放有聲影片**；完成後改用 `<video muted playsinline>`＋封面圖＋字幕檔。影片網址由後台「全站設定」控制。
   - 影片下方：5 段分鏡時間軸（00–12s 建築拆解／12–20s 設備接入／20–30s 單棟到多點／30–40s 戰情室／40–60s 夥伴插入 OS）
3. **背書條**：4 格，內容由後台「全站設定 → 背書項目」控制（預設：通過 WSP 科進集團認證／[TBD 真實案場數]／[TBD 可公開案例]／設計 → 施工 → 驗收 → 營運）
4. **The OS 流程**：Physical World → Data → Aiii VBIM OS → Intelligence → Action（5 格，第 3 格強調色）
5. **六大核心層**：Building／Equipment／Energy／Environment／AI／Security & Data（內容見 3.2）
6. **五大場域**：分頁切換（Tabs，需支援鍵盤操作），每個場域顯示：名稱、痛點、第一個可導入模組、整合範圍 4–5 點、「看完整方案 →」連到場域頁。資料來自後台「場域」。
7. **Command Center**：導覽路徑 Global › Country › Site › Building › Floor › Space › Asset › Sensor/Event；戰情室截圖（後台上傳，未上傳前顯示示意框並標「示意畫面」）；See／Understand／Predict／Control 四欄。
8. **Edge AI**：標題「AI Runs Where Your Data Lives.」＋「資料不離場，AI 照樣聰明」；4 種產品型態；6 張能力卡（內容見 3.4）
9. **Trust Layer**：資料可信（上鏈留痕）／人才可信（認證）／AI 行為可信（AI 代理授權通行證）
10. **生態夥伴預覽**：6 種夥伴類型卡＋夥伴 Logo 牆（後台「夥伴」中 `showOnHome = true` 者）＋ 5 種加入方式＋認證學院強調區塊
11. **最新消息**：最新 3 則（後台「消息」）
12. **聯絡 CTA**：嵌入共用表單元件（見第 6 節）
13. **頁尾**：Logo、頁尾標語、主要連結、公司資訊（後台「全站設定」）、隱私權政策、語言切換

### 3.2 平台 OS `/platform`
- 開場：「不是再多一套系統，而是讓所有系統接得起來」
- OS 流程圖（同首頁，可展開說明）
- 六大核心層詳細版：

| 層 | 中文 | 內容 |
|---|---|---|
| Building Layer | 建築層 | BIM、2D/3D、PMIS、數位孿生 |
| Equipment Layer | 設備層 | 儀器、機電、重電、泵浦、電梯、消防、特殊設備 |
| Energy Layer | 能源層 | 電力、太陽能、風電、儲能、EMS、需量、ESG |
| Environment Layer | 環境層 | 中央空調、潔淨室、溫濕度、空氣品質 |
| AI Layer | AI 層 | Edge AI、LLM／VLM、AI Agent、影像辨識 |
| Security & Data Layer | 資安與資料層 | 資安、權限、資料治理、上鏈追溯、API |

- 全生命週期：設計 → 施工 → 驗收 → 營運 → 資產
- 6 層技術架構 L1 Physical → L6 Command Center
- 與傳統做法比較表（BIM/CDE、BMS/EMS、VMS、MES/ERP、DCIM 的限制 vs VBIM 差異）
- CTA：預約 Demo

### 3.3 場域頁 `/solutions/[slug]`（共用模板，內容全部來自後台）
區塊：Hero（場域名稱＋一句話價值）→ 痛點 → 整合範圍 → 第一個可導入模組 → 可量化 KPI → 相關案例（自動帶出同場域、已公開的案例）→ CTA

### 3.4 地端 AI `/edge-ai`
- 產品型態：Edge AI Box（單棟）／Edge AI Server（大型場域）／GPU Cluster（算力中心）／Hybrid（地端＋雲端）
- 能力卡：

| 能力 | 用途 | 價值 |
|---|---|---|
| Local AI Vision | 安全帽、火煙、跌倒、入侵、人流 | 低延遲，減少雲端頻寬 |
| Local LLM / RAG | 工程文件、SOP、設備手冊問答 | 企業資料不必離場 |
| AI Agent | 能源、設施、工程、資安 Agent | 跨系統查詢與自動流程 |
| Edge Analytics | 影像、感測、PLC 即時分析 | 斷網仍可運作 |
| Model Management | 模型版本、部署、更新與監控 | 可營運、可維護、可擴充 |
| OT / IT Integration | 現場設備與企業系統打通 | 一份資料，多方使用 |

### 3.5 案例 `/cases`
- 列表：可依場域篩選；只顯示 `isPublic = true`
- 內頁：案名、場域、客戶（可匿名顯示，如「北部某醫學中心」）、痛點、導入模組、成果數字、照片集

### 3.6 生態夥伴 `/partners`
- 「Build on Aiii VBIM」開場
- 6 種夥伴類型（類型｜帶進來什麼｜合作模式）：

| 類型 | 帶進來 | 合作模式 |
|---|---|---|
| 設備製造商 | 盤體、UPS、HVAC、儀器、攝影機 | 共同標案／產品包 |
| 工程技術商 | 機電、消防、空調、重電施工 | 指定平台／專案合作 |
| AI / Software | AI 模型、Agent、應用軟體 | 模組上架／分潤 |
| 能源公司 | 太陽能、風電、儲能、ESCO | 能源平台整合／績效分潤 |
| Cybersecurity | Zero Trust、IAM、SOC | 企業治理方案 |
| SI / Consultants | 系統整合、顧問、建築師 | 授權代理／共同導入 |

- 5 種加入方式：Technology／Solution／SI／Certified／POC Partner
- 夥伴 Logo 牆（後台）
- 夥伴申請表（共用表單，預選 role = partner）

### 3.7 認證學院 `/academy`
- 流程：培訓 → 考核 → 認證 → 媒合
- 課程與梯次列表（後台「認證課程」），顯示報名狀態（開放報名／額滿／即將開課）
- 認證標準頁面區塊：內容 [TBD]，未提供前顯示「認證標準制定中，歡迎先登記」
- 登記表單（共用表單，預選 role = talent）

### 3.8 最新消息 `/news`
- 列表：分類篩選（新聞／活動／黑客松）、分頁（每頁 12 則）
- 內頁：標題、日期、封面、內文（Portable Text，可插圖、影片、按鈕）、相關消息 3 則
- 活動類可加欄位：活動日期、地點、報名連結

### 3.9 關於、聯絡、隱私權
- 關於：品牌故事、團隊（可選）、認證與背書
- 聯絡：共用表單＋公司資訊
- 隱私權政策：說明表單蒐集的資料與用途（個資法），內容由後台維護，初稿 [TBD]

---

## 4. 視覺規範（Design Tokens）

延用現有官網色系：

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#06101a` | 主背景 |
| `--bg-2` | `#0a1724` | 區塊交替背景 |
| `--panel` | `#0d1d2b` | 卡片 |
| `--panel-2` | `#102334` | 次級卡片、標籤 |
| `--text` | `#f7fbff` | 主文字 |
| `--text-2` | `#c9d6e3` | 次文字 |
| `--muted` | `#9fb0c3` | 說明文字 |
| `--line` | `rgba(255,255,255,.1)` | 邊框 |
| `--cyan` | `#51d7ff` | 主強調色、主要按鈕底色（按鈕文字用 `--bg`） |
| `--blue` | `#438eff` | 圖表、Logo 色 |
| `--green` | `#68f0ad` | 正常狀態 |
| `--amber` | `#ffb454` | 警示狀態 |
| `--radius` | `24px`（大卡）／`18px`（中卡）／`999px`（按鈕） | — |
| `--max` | `1240px` | 內容最大寬度 |

- 字型：英文標題 **Space Grotesk**（500/600/700）；中文與內文 **Noto Sans TC**（400/500/700）
- 區塊上下間距：桌機 104px／手機 64px
- 不使用 emoji、漸層大色塊、過度動畫；動畫需尊重 `prefers-reduced-motion`
- Logo：沿用現有 Aiii VBIM Logo（業主提供向量檔 [TBD]）

---

## 5. Sanity 內容模型（Schema）

所有「文件型」內容都用 `@sanity/document-internationalization`，語言：`zh-Hant`、`en`。

### 5.1 `siteSettings`（全站設定，單一文件）
| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| heroTitle | string | ✅ | 預設 `One OS. Every Building. Every System.` |
| heroSubtitle | string | ✅ | — |
| heroBody | text | ✅ | — |
| heroVideoUrl | url | — | 空值時顯示封面＋「影片製作中」 |
| heroPoster | image (alt 必填) | ✅ | — |
| proofItems | array of {label, value} | ✅ | 最多 4 筆 |
| commandCenterImage | image | — | 空值時顯示示意框 |
| companyName / address / phone / email | string | ✅ | — |
| socialLinks | array of {platform, url} | — | — |
| footerTagline | string | ✅ | — |
| seo | seo object | ✅ | 見 5.8 |

### 5.2 `news`（最新消息與活動）
| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| title | string | ✅ | ≤ 60 字 |
| slug | slug | ✅ | 由 title 產生，可手改 |
| category | string（news／event／hackathon） | ✅ | — |
| publishedAt | datetime | ✅ | 未來時間 → 到時間才顯示（重建時判斷） |
| cover | image (alt 必填) | ✅ | — |
| excerpt | text | ✅ | ≤ 120 字，列表與 SEO 用 |
| body | Portable Text（段落、H2/H3、圖片、YouTube、按鈕） | ✅ | — |
| eventDate / eventLocation / registerUrl | datetime / string / url | category=event 時顯示 | — |
| seo | seo object | — | — |

### 5.3 `caseStudy`（案例）
| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| title | string | ✅ | — |
| slug | slug | ✅ | — |
| solution | reference → solution | ✅ | — |
| clientDisplayName | string | ✅ | 可匿名，如「北部某醫學中心」 |
| isPublic | boolean | ✅ | 預設 **false**；false 時前台完全不顯示 |
| pain | text | ✅ | — |
| modules | array of string | ✅ | 導入模組 |
| results | array of {metric, value, note} | — | 只放客戶同意公開的數字 |
| gallery | array of image (alt 必填) | — | — |
| body | Portable Text | — | — |

### 5.4 `solution`（場域，5 筆）
| 欄位 | 型別 | 必填 |
|---|---|---|
| name / slug / tagline | string / slug / string | ✅ |
| pain | text | ✅ |
| firstModule | string | ✅ |
| integrationPoints | array of string（4–6） | ✅ |
| kpis | array of string | — |
| heroImage | image | — |
| order | number | ✅ |

### 5.5 `partner`（夥伴）
| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| name | string | ✅ | — |
| logo | image（建議 SVG／透明 PNG） | ✅ | — |
| type | string（equipment／engineering／ai-software／energy／security／si-consultant） | ✅ | — |
| tier | string（technology／solution／si／certified／poc） | ✅ | — |
| website | url | — | — |
| showOnHome | boolean | ✅ | 預設 false |
| logoApproved | boolean | ✅ | 預設 **false**；false 時不顯示（授權確認） |

### 5.6 `course`（認證課程）
| 欄位 | 型別 | 必填 |
|---|---|---|
| title / slug / level（基礎／進階／專家） | string / slug / string | ✅ |
| summary / body | text / Portable Text | ✅ |
| sessions | array of {startDate, endDate, location, seats, price, status（open／full／upcoming／closed）} | ✅ |
| registerMode | string（form／external） | ✅ |
| externalUrl | url | registerMode=external 時必填 |

### 5.7 `page`（一般頁：關於、隱私權等）
title、slug、body（Portable Text）、seo

### 5.8 `seo`（物件）
metaTitle（≤ 60）、metaDescription（≤ 160）、ogImage、noIndex（boolean）

### 5.9 Studio 設定
- 側欄順序：全站設定 → 最新消息 → 案例 → 認證課程 → 夥伴 → 場域 → 一般頁
- 中文欄位標題與說明文字（讓非工程師看得懂）
- 每個 image 欄位強制填 alt
- **審稿流程**：若方案支援自訂角色 → 編輯只能存草稿、審稿者可發布；若不支援 → 建立「待審稿」布林欄位＋發布前檢查清單，並在交接文件寫明規則
- 預覽：Studio 內提供「開啟網站預覽」按鈕（第一版可連到 Vercel Preview）

---

## 6. 表單與名單流程

### 6.1 共用表單元件 `<LeadForm role="owner|partner|talent">`
| 欄位 | 必填 | 備註 |
|---|---|---|
| role（業主／夥伴／人才） | ✅ | 依頁面預選，可切換 |
| company | 業主、夥伴必填 | — |
| name | ✅ | — |
| email | ✅ | 格式驗證 |
| phone | — | — |
| message | ✅ | 想解決的問題／想接入的技術 |
| partnerType | role=partner 時顯示 | 對應 5.5 type |
| interestedCourse | role=talent 時顯示 | 對應 course |
| consent | ✅ | 同意隱私權政策（連 `/privacy`） |
| honeypot | 隱藏 | 有值則丟棄 |
| turnstileToken | ✅ | Cloudflare Turnstile |

### 6.2 流程
```
瀏覽器 → POST /api/lead（Astro server route）
   ├─ 驗證欄位、Turnstile、honeypot、簡易 rate limit
   ├─ 補上 locale、sourcePage、UTM、timestamp
   └─ POST → N8N_LEAD_WEBHOOK_URL（header 帶 X-Lead-Secret）
n8n
   ├─ 驗證 secret
   ├─ 寫入 Supabase `leads`
   ├─ 依 role 分流 → LINE OA 推播給對應負責人群組（注意每月推播額度）
   ├─ 寄送確認信給填表人
   └─ 每週一 09:00 寄送名單摘要 Email
```
- 前端顯示：送出中 → 成功（「已收到，我們會在 [TBD] 個工作天內聯繫」）→ 失敗（提示稍後再試並顯示公司 Email）
- n8n 失敗時：`/api/lead` 回傳錯誤，**不可**讓使用者以為已送出

### 6.3 Supabase `leads` 資料表
| 欄位 | 型別 |
|---|---|
| id | uuid, pk, default gen_random_uuid() |
| created_at | timestamptz, default now() |
| role | text（owner／partner／talent） |
| company, name, email, phone, message | text |
| partner_type, interested_course | text, nullable |
| locale, source_page, utm_source, utm_medium, utm_campaign | text, nullable |
| status | text, default 'new'（new／contacted／qualified／closed） |
| owner_note | text, nullable |

- 啟用 RLS；只允許 service role 寫入；前端不直接連 Supabase

> n8n 工作流本身不在 Claude Code 執行範圍內，但需在 `docs/n8n-lead-workflow.md` 寫出節點規格與測試用 payload 範例。

---

## 7. SEO 與上線

- 每頁：title、description、canonical、OG/Twitter 卡片、`hreflang`（zh-Hant／en／x-default）
- `sitemap.xml`（含雙語）、`robots.txt`
- 結構化資料：Organization（全站）、Article（消息）、Event（活動類消息）
- **舊網址轉址**：上線前抓取現有 aiiivbim.com 所有網址，建立 `redirects` 對照表（`vercel.json` 301）。清單 [TBD]
- Favicon、Apple touch icon、OG 預設圖
- 網域切換步驟與回滾方式寫在 `docs/launch-checklist.md`

---

## 8. 驗收標準

| 項目 | 標準 |
|---|---|
| 效能 | Lighthouse 手機版 Performance ≥ 90；首頁 LCP < 2.5s |
| 無障礙 | Lighthouse Accessibility ≥ 95；文字對比 ≥ 4.5:1；全站可用鍵盤操作；所有圖片有 alt |
| SEO | Lighthouse SEO ≥ 95；每頁 title／description 不重複 |
| 響應式 | 375px、768px、1280px、1440px 無水平捲動、無版面破損 |
| 瀏覽器 | Chrome、Safari（含 iOS）、Edge、Firefox 最新版 |
| 後台 | 業主團隊成員在無工程師協助下，完成：新增消息、上傳案例、新增夥伴 Logo、修改首頁標語，並在 3 分鐘內於網站看到更新 |
| 表單 | 三種身分各送出 1 筆：Supabase 有資料、LINE OA 在 10 秒內收到通知、填表人收到確認信 |
| 雙語 | `/en` 3 個核心頁有英文；其餘英文頁顯示「coming soon」提示，無空白頁、無 404 |
| 內容 | 全站搜尋不到 `[TBD]`、lorem、假數字（上線前檢查） |

---

## 9. 測試（兩層）

1. **單元測試（Vitest）**：表單驗證函式、`/api/lead` 處理邏輯（mock n8n）、i18n 路徑工具、Sanity 查詢結果轉換
2. **E2E（Playwright）**：
   - 首頁載入、導覽連結全部可達
   - 場域 Tabs 鍵盤操作
   - 語言切換來回
   - 三種身分表單送出（測試環境指向 mock webhook）
   - 375px 手機版截圖比對（主要頁面）
3. CI：GitHub Actions 在 PR 時跑 lint、type check、Vitest、Playwright

---

## 10. 環境變數

| 名稱 | 用途 |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Sanity 專案 ID |
| `PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | 讀取草稿預覽用（server only） |
| `N8N_LEAD_WEBHOOK_URL` | n8n 名單 Webhook（server only） |
| `N8N_LEAD_SECRET` | 與 n8n 共用的驗證字串（server only） |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | 防垃圾 |
| `PUBLIC_GA_ID` | GA4（可空） |
| `VERCEL_DEPLOY_HOOK_URL` | 只在 Sanity Webhook 設定中使用，不進程式碼 |

提供 `.env.example`（只有名稱、沒有值）。

---

## 11. 專案結構（建議）
```
/
├─ apps/web/            # Astro 網站
│  ├─ src/pages/        # 路由（含 [lang] 處理）
│  ├─ src/components/   # 區塊元件（Hero、LayerGrid、SceneTabs、LeadForm…）
│  ├─ src/lib/          # sanity client、queries、i18n
│  ├─ src/styles/       # tokens.css
│  └─ tests/            # vitest + playwright
├─ apps/studio/         # Sanity Studio
│  └─ schemas/
├─ docs/                # 交接文件
├─ .github/workflows/
├─ SPEC.md
└─ CLAUDE.md
```

---

## 12. 執行階段（每階段完成都要停下來回報）

| 階段 | 內容 | 完成條件 |
|---|---|---|
| **P0 初始化** | 建 repo 結構、Astro＋Tailwind＋tokens、Sanity Studio 骨架、lint/format、`.env.example`、GitHub Actions | `npm run dev` 可跑出空白首頁；CI 綠燈 |
| **P1 內容模型** | 第 5 節全部 schema＋中文標籤＋雙語外掛＋Studio 側欄 | Studio 可新增各類型內容（中英） |
| **P2 版型與元件** | Layout、導覽、頁尾、語言切換、所有區塊元件（先用假資料檔，**不可**寫進正式內容） | 元件在 375／1440 寬度正常 |
| **P3 首頁** | 串 Sanity，完成首頁 13 個區塊 | 首頁可由後台改標語與背書條 |
| **P4 其他頁面** | 平台、場域模板、地端 AI、案例、夥伴、學院、消息、關於、聯絡、隱私、404 | 網站地圖全部頁面可達 |
| **P5 表單** | LeadForm、`/api/lead`、Turnstile、`docs/n8n-lead-workflow.md`、Supabase migration SQL | 對 mock webhook 送出成功；錯誤處理正確 |
| **P6 SEO 與效能** | meta、hreflang、sitemap、結構化資料、圖片最佳化、redirects 框架 | Lighthouse 達標 |
| **P7 測試** | 補齊 Vitest＋Playwright、CI | 全部測試通過 |
| **P8 交接文件** | 見第 13 節 | 文件齊全 |

---

## 13. 交接包（`docs/`）
1. `SOP-後台操作手冊.md`：發消息、上傳案例、加夥伴、改首頁、審稿流程（附截圖位置說明）
2. `設定說明.md`：所有帳號、服務、環境變數、Webhook 對應關係（不含密碼）
3. `維運手冊.md`：每週／每月檢查項目、常見問題、如何查看名單、LINE 推播額度檢查
4. `rollback-plan.md`：
   - 程式：Vercel「Instant Rollback」回到上一個部署；或 git revert 後重新部署
   - 內容：Sanity 文件歷史版本還原
   - 網域：切換失敗時 DNS 指回舊主機的步驟與 TTL 注意事項
   - 表單：n8n 停用時，`/api/lead` 回傳錯誤並顯示公司 Email
5. `launch-checklist.md`：上線前、上線當天、上線後 7 天的檢查清單

---

## 14. 待確認事項 [TBD]
- [ ] 公司正式名稱、地址、電話、Email
- [ ] Logo 向量檔
- [ ] WSP 認證、公部門與企業案例：哪些可公開、可用什麼名稱
- [ ] 真實案場數等背書數字
- [ ] 夥伴名單與 Logo 授權
- [ ] 認證學院：標準、課程、梯次、價格、掛在哪一個公司名下
- [ ] 戰情室真實截圖
- [ ] 60 秒影片完成時間
- [ ] 現有 aiiivbim.com 的主機、DNS 管理者與網址清單
- [ ] 表單回覆承諾天數、各身分的 LINE 通知負責人
- [ ] 隱私權政策初稿
