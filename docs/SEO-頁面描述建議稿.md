# 頁面描述（meta description）建議稿 — 待業主確認

> **狀態：2026-11-16 已照建議稿套用（尚待業主最後確認）。**
> 首頁的兩段已寫入後台「全站設定 → SEO 描述」，其他頁面在 `apps/web/src/content/seo-descriptions.ts`。業主若要改字，告訴工程端或直接在後台改首頁那兩段即可。
> 套用前的首頁描述（還原用）：中文「建築、設備、能源與 AI 的共同作業系統」；英文「From BIM / PMIS to the operating system for your physical world」。
> 撰寫：SEO session，2026-11-16。

## 這是什麼

meta description 是 Google 搜尋結果中，標題下面那兩行灰色的說明文字。它**不會出現在網頁畫面上**，只影響搜尋結果的呈現，以及別人點不點進來。

目前每頁的描述直接沿用頁面上的副標題或導言。有些太短，像中文首頁只有 20 字，Google 可能改抓頁面上其他文字來顯示；有些太長，像英文五大領域頁有 280 字元，超過約 155 字元的部分會被截斷成「…」。

**撰寫原則：**

- 每一句都取自網站上已經核准的文案，只做縮短或合併。
- 沒有新增任何數字、客戶或功能說法。
- 頁面上看得到的文案完全不變。

建議長度：中文 60～90 字；英文 120～160 字元。

---

## 一、中文：目前太短

| 頁面        | 目前（字數）                                                               | 建議稿（字數）                                                                                                                                               | 文字來源             |
| ----------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| 首頁 `/`    | 建築、設備、能源與 AI 的共同作業系統（20）                                 | Aiii VBIM 是建築、設備、能源與 AI 的共同作業系統。以 BIM／數位孿生與 PMIS 為空間主索引，把每一筆資料放回哪一棟、哪一層、哪一個空間、哪一台設備。（84）       | 首頁「核心定位」段落 |
| `/vbim`     | 讓台灣的資金、技術與管理經驗跨越國界，掌握全球資產，打造超級戰情室。（34） | 讓台灣的資金、技術與管理經驗跨越國界，掌握全球資產，打造超級戰情室。從設計、施工、驗收、交付到營運，讓建築成為具有感知、分析與管理能力的智慧資產。（73）     | 副標＋第一段最後一句 |
| `/platform` | 把建築資料、設備與 AI 基礎建設，整合為可營運的建築作業系統。（32）         | 把建築資料、設備與 AI 基礎建設，整合為可營運的建築作業系統。圖說、BIM、工程文件、設備台帳、影像、感測、能源、維修與 AI，都落在同一個空間與資產架構中。（80） | 副標＋第一段         |
| `/energy`   | 風力、太陽能、儲能與算力中心的整合智控（19）                               | 風力、太陽能、儲能與算力中心的整合智控。不只是電表 Dashboard，而是建立完整能源拓樸，從供電到用電，建立全域能源可視化與智慧優化。（69）                       | 副標＋第一段         |
| `/edge-ai`  | 讓 AI 不只看見資料，更能理解場域並協助決策。（24）                         | 讓 AI 不只看見資料，更能理解場域並協助決策。Aiii Edge AI 把推論、文件問答與 AI Agent 部署在企業現場，直接結合 VBIM 的空間、設備、影像與能源資料。（89）      | 副標＋第一段         |
| `/partners` | 你的設備、技術與服務，都可以接進 Aiii VBIM（26）                           | 你的設備、技術與服務，都可以接進 Aiii VBIM。任何能源設備、空調系統、AI Edge、攝影機與感測器，都能透過標準介面納入 Aiii VBIM。（76）                          | 副標＋第一段         |

## 二、英文：太短

| 頁面           | 目前（字元）                                                               | 建議稿（字元）                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/en`          | From BIM / PMIS to the operating system for your physical world（63）      | BMS runs equipment, EMS runs energy, VMS runs video. Aiii VBIM uses BIM, the digital twin and PMIS as the spatial index that connects them all.（143）             |
| `/en/energy`   | Integrated control of wind, solar, storage and compute centers（62）       | Integrated control of wind, solar, storage and compute centers — a complete energy topology with full visibility and optimization from supply to demand.（152）    |
| `/en/partners` | Your equipment, technology and services can all connect to Aiii VBIM（68） | Your equipment, technology and services can all connect to Aiii VBIM. Energy, HVAC, AI edge hardware, cameras and sensors join through standard interfaces.（155） |

## 三、英文：太長（會被截斷）

| 頁面               | 目前字元數 | 建議稿（字元）                                                                                                                                                            |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/en/solutions`    | 280        | Building at the core, extended into hospitals, retail, factories, offices and energy. Each sector starts with one clear pain point, then expands platform-wide.（約 157） |
| `/en/about`        | 238        | With buildings and space at its core, Aiii VBIM integrates engineering, equipment, energy, video and Edge AI into a cross-border, multi-site operating platform.（160）   |
| `/en/academy`      | 199        | VBIM Academy develops engineers and partners who can bring BIM, energy, HVAC, video, AIoT and Edge AI to life on real sites.（124）                                       |
| `/en/products/rms` | 291        | Aiii RMS builds consumer behavior analysis, store layout, traffic flow and product display into a digital twin, combining AI image recognition with POS data.（157）      |
| `/en/products/mms` | 214        | Aiii MMS builds a hospital digital twin from the planning stage and integrates hospital information systems, with AI image recognition to streamline care.（約 154）      |

---

## 請業主確認

- 每一列請回覆「同意」或直接修改文字。
- 首頁的描述放在後台「全站設定 → SEO 描述」，業主可以自己在後台貼上，不需要改程式。
- 其他頁面確認後由工程端套用。只改搜尋結果用的描述，頁面畫面不變。
