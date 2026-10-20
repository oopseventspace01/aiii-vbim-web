# n8n 名單工作流規格（SPEC 6.2、6.4；P5 決定 2026-10-20）

網站表單送出後，`/api/lead` 會把資料 POST 給 n8n。n8n 負責：存進 Supabase、通知業務、寄確認信給填表人。
本文件是節點規格與測試資料；n8n 本身的設定不在這個 repo 裡。

> **機密不寫在這裡**：Webhook 網址、`X-Lead-Secret`、Supabase service role key、LINE Channel access token、通知收件人（含副本）一律放在 n8n 的 Credentials／環境變數。

---

## 1. 流程總覽

```
Webhook（POST）
  → 檢查 X-Lead-Secret
  → 寫入 Supabase leads
  → 回應 200 給網站（寫入失敗就回 500，網站會顯示「目前無法送出」）
  → 以下平行執行，失敗不影響使用者：
       ├─ LINE OA 推播摘要給負責人群組（依身分分流）
       ├─ 寄確認信給填表人（三種身分都寄）
       └─ 寄內部通知信給業務
每週一 09:00（另一個工作流）→ 寄上週名單摘要
```

## 2. 節點規格

| #   | 節點                           | 設定                                                                                                                                                                                |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Webhook**                    | Method `POST`；Path 自訂（例如 `aiii-lead`）；Respond：`Using 'Respond to Webhook' node`。產生的 Production URL 填到網站的 `N8N_LEAD_WEBHOOK_URL`（Vercel 環境變數與本機 `.env`）。 |
| 2   | **IF：檢查密鑰**               | `{{ $json.headers['x-lead-secret'] }}` 等於 n8n 環境變數 `LEAD_SECRET`（與網站 `N8N_LEAD_SECRET` 相同）。不相等 → **Respond 401** 並結束。                                          |
| 3   | **Supabase：Insert row**       | Table `leads`；欄位對應見第 3 節。Credentials 用 service role key。                                                                                                                 |
| 4   | **Respond to Webhook**         | 成功 → `200 {"ok":true}`。第 3 步失敗（Error output）→ `500 {"ok":false}`。                                                                                                         |
| 5   | **Switch：依 role 分流**       | `owner` → 業主群組；`partner` → 夥伴群組；`talent` → 學院群組（群組 ID 放 n8n 環境變數）。                                                                                          |
| 6   | **HTTP Request：LINE OA 推播** | `POST https://api.line.me/v2/bot/message/push`；Header `Authorization: Bearer {LINE Channel access token}`；Body 見第 4 節。**不要用 LINE Notify（已停用）。**                      |
| 7   | **Send Email：確認信給填表人** | 收件人 `{{ $json.body.email }}`；依 `locale` 選中文或英文範本（第 5 節）。業主且有 `checklist` 時加上需求表段落。                                                                   |
| 8   | **Send Email：內部通知**       | 收件人、副本放 n8n 環境變數（例如 `LEAD_NOTIFY_TO`、`LEAD_NOTIFY_CC`）；內容為完整填答（第 6 節）。                                                                                 |

## 3. Supabase 欄位對應

資料表結構：`supabase/migrations/20261020000000_create_leads.sql`。

| leads 欄位                           | 來源（webhook body）                               |
| ------------------------------------ | -------------------------------------------------- |
| lead_code                            | `leadCode`                                         |
| role                                 | `role`                                             |
| company, name, email, phone, message | 同名欄位（空字串存成 null）                        |
| partner_type                         | `role = partner` 時的 `needType`                   |
| interested_course                    | `details.module` 或 `details.modules` 用逗號串起來 |
| need_type                            | `needType`                                         |
| details                              | `details`（整個物件）                              |
| form_version                         | `formVersion`                                      |
| checklist                            | `checklist.key`（沒有就 null）                     |
| locale, source_page                  | `locale`、`sourcePage`                             |
| utm_source, utm_medium, utm_campaign | `utmSource`、`utmMedium`、`utmCampaign`            |

## 4. LINE OA 推播摘要

只放摘要，完整內容在 Supabase（SPEC 6.4）：

```json
{
  "to": "{負責人群組 ID}",
  "messages": [
    {
      "type": "text",
      "text": "【官網新名單】{{leadCode}}\n身分：{{roleLabel}}｜{{needTypeLabel}}\n{{company}} {{name}}\n{{message 前 60 字}}"
    }
  ]
}
```

`roleLabel`：owner＝業主／企業、partner＝設備商／SI／技術夥伴、talent＝想取得認證的人才。

## 5. 確認信範本

> 以下文字可由業主修改；`[TBD]` 處請業主提供。英文版為 Claude 翻譯，[EN 待確認]。

**主旨**：`[Aiii VBIM] 已收到你的{{表單名稱}}（預約編號 {{leadCode}}）`
表單名稱：contact＝預約／聯絡、partner＝夥伴申請、academy＝認證學院登記。

**內文（中文）**

```
{{name}} 你好：

謝謝你與 Aiii VBIM 聯繫，我們已收到你的資料。
預約編號：{{leadCode}}

我們會在 [TBD: 幾個工作天] 內與你聯繫。想詢問進度或補充資料，可以：
・直接回覆這封信
・在 LINE 官方帳號提供預約編號：{{全站設定的 LINE 官方帳號網址}}

（只有業主且有 checklist 時顯示以下段落）
為了讓我們更快了解你的需求，歡迎填寫「{{checklist.name}}」：
・線上填寫：{{checklist.formUrl}}
・下載 PDF：{{checklist.pdfUrl}}
不確定的項目可以先略過。

你填寫的內容：
{{逐項列出：身分、公司、姓名、Email、電話、場域／夥伴類型、想解決的問題…}}

Aiii VBIM 團隊
{{全站設定的公司名稱、電話、Email}}
```

**內文（英文）[EN 待確認]**

```
Hi {{name}},

Thank you for contacting Aiii VBIM — we've received your details.
Reference number: {{leadCode}}

We'll be in touch within [TBD: number of business days]. To check on progress or add details:
- Reply to this email
- Send your reference number to our LINE Official Account: {{LINE URL}}

(Owners with a checklist only)
To help us understand your needs faster, please fill in the "{{checklist.name}}" (in Traditional Chinese):
- Online: {{checklist.formUrl}}
- PDF: {{checklist.pdfUrl}}
Feel free to skip anything you're unsure of.

Your submission:
{{list of fields}}

The Aiii VBIM team
```

## 6. 內部通知信

主旨：`[官網名單] {{leadCode}}｜{{roleLabel}}｜{{company}} {{name}}`
內文：完整 webhook body（易讀格式）＋ Supabase 連結。

## 7. 測試用 payload

用下面的指令可以直接對 n8n 測試（把網址與密鑰換成你的，**不要把真的值貼進 repo**）：

```bash
curl -X POST "$N8N_LEAD_WEBHOOK_URL" -H "Content-Type: application/json" -H "X-Lead-Secret: $N8N_LEAD_SECRET" -d @payload.json
```

**業主（有需求表）**

```json
{
  "leadCode": "L-261020-TEST",
  "formVersion": "2026-10-20.1",
  "submittedAt": "2026-10-20T07:00:00.000Z",
  "variant": "contact",
  "role": "owner",
  "needType": "factory",
  "needTypeLabel": "工廠／科技廠",
  "company": "測試科技股份有限公司",
  "name": "王小明",
  "email": "test@example.com",
  "phone": "02-0000-0000",
  "message": "想了解產線能耗監控",
  "locale": "zh-Hant",
  "sourcePage": "/contact",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": "",
  "details": {},
  "checklist": {
    "key": "manufacturing",
    "name": "智慧製造需求檢查表",
    "formUrl": "https://docs.google.com/forms/d/e/…/viewform?usp=pp_url&entry.…=L-261020-TEST",
    "pdfUrl": "https://drive.google.com/…"
  }
}
```

**夥伴（生態夥伴頁）**

```json
{
  "leadCode": "L-261020-TST2",
  "formVersion": "2026-10-20.1",
  "submittedAt": "2026-10-20T07:05:00.000Z",
  "variant": "partner",
  "role": "partner",
  "needType": "hvac",
  "needTypeLabel": "HVAC／ESCO",
  "company": "測試空調工程",
  "name": "李小華",
  "email": "partner@example.com",
  "phone": "",
  "message": "空調控制器，支援 BACnet",
  "locale": "zh-Hant",
  "sourcePage": "/partners",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": "",
  "details": { "website": "https://example.com" },
  "checklist": null
}
```

**人才（認證學院頁）**

```json
{
  "leadCode": "L-261020-TST3",
  "formVersion": "2026-10-20.1",
  "submittedAt": "2026-10-20T07:10:00.000Z",
  "variant": "academy",
  "role": "talent",
  "needType": "architect",
  "needTypeLabel": "建築師／設計師",
  "company": "",
  "name": "Chen Test",
  "email": "talent@example.com",
  "phone": "",
  "message": "",
  "locale": "en",
  "sourcePage": "/en/academy",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": "",
  "details": {
    "organization": "Test Studio",
    "modules": ["bim", "edge-ai"],
    "jobRole": "architect"
  },
  "checklist": null
}
```

## 8. 第三方額度（上線前請到各官網確認目前方案）

| 服務                  | 注意事項                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase 免費方案     | 有容量上限；**一段時間沒有活動會自動暫停**，暫停時寫入會失敗、網站會顯示「目前無法送出」。上線前決定：升級付費，或用 n8n 排程定期讀取一次保持活動。 |
| LINE OA Messaging API | 免費方案每月推播則數有上限，超過就推不出去（名單仍會存進 Supabase、確認信照寄）。                                                                   |
| 寄信（Gmail／SMTP）   | 每日寄送數量有上限；正式上線建議用公司網域信箱，避免被當成垃圾信。                                                                                  |
| Cloudflare Turnstile  | 免費方案；在 Cloudflare 後台建立 Widget，網域填 `aiiivbim.com`（本機測試另加 `localhost`）。                                                        |

## 9. 驗收（P5 決定版）

- [ ] 三種身分各送一筆：Supabase 有資料、`lead_code` 與網頁顯示的一致
- [ ] 三筆都收到確認信，信裡有預約編號與聯絡方式
- [ ] 業主那筆：確認信與網頁的需求表連結都能打開，Google 表單自動帶入預約編號
- [ ] LINE OA 群組收到摘要
- [ ] 故意關掉 Supabase 憑證再送一次：網頁顯示「目前無法送出」，不會顯示成功
