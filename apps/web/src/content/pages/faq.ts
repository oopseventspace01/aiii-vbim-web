// /faq 常見問題（SEO／AEO／GEO 計畫 A-1；2026-10-29 業主確認 docs/faq-draft.md 15 題）
// 中文答案只取自網站已核准文案（出處見 docs/faq-draft.md）；英文由 Claude 翻譯 [EN 待確認]
// 設計稿沒有這一頁，版面沿用內頁共用元件
import type { Locale } from '../../lib/i18n';

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  /** 延伸閱讀：站內頁面 */
  link?: { path: string; label: string };
}

export const FAQ_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    groups: { title: string; items: FaqItem[] }[];
    more: string;
    ctaTitle: string;
    ctaButton: string;
  }
> = {
  'zh-Hant': {
    metaTitle: '常見問題',
    eyebrow: 'FAQ',
    title: '常見問題',
    lead: 'Aiii VBIM 是什麼、跟 BIM 與 BMS 有什麼不同、怎麼導入，一次看懂。',
    more: '延伸閱讀：',
    ctaTitle: '還有其他問題？',
    ctaButton: '聯絡我們',
    groups: [
      {
        title: '關於 Aiii VBIM',
        items: [
          {
            id: 'what-is-aiii-vbim',
            q: 'Aiii VBIM 是什麼？',
            a: 'Aiii VBIM 是以建築與空間為核心的營運平台，整合工程、設備、能源、影像與地端 AI，讓圖說、BIM、工程文件、設備台帳、影像、感測、能源、維修與 AI 都落在同一個空間與資產架構中。它不只管理建築，而是建築、設備、能源與 AI 的共同作業系統，從一棟建築、一座工廠，到跨國多點的企業都能使用。',
            link: { path: '/platform', label: '平台 OS' },
          },
          {
            id: 'vs-bim',
            q: 'Aiii VBIM 跟傳統 BIM 有什麼不同？',
            a: '傳統 BIM 管模型，Aiii VBIM 管整個真實世界。BIM 的強項是設計與工程資料，但模型常在完工後封存，營運數據與控制不足；Aiii VBIM 的模型不在完工後封存，而是持續進入驗收、交付、物業與設備管理，把工程資料延伸到營運，成為長期可用的數位資產。',
            link: { path: '/vbim', label: 'VBIM' },
          },
          {
            id: 'vs-bms',
            q: 'Aiii VBIM 跟 BMS／EMS（建築與能源管理系統）有什麼不同？',
            a: 'BMS／EMS 的強項是設備與能源監控，但缺少 3D 空間與工程生命週期的資訊。Aiii VBIM 把 BIM、資產與能源結合在一起：異常發生時，可以從空間直接追到對應的設備、感測器與維修紀錄。',
            link: { path: '/energy', label: '能源 × 空調' },
          },
          {
            id: 'vs-vms',
            q: 'Aiii VBIM 跟 AI 影像辨識平台（VMS／AI Vision）有什麼不同？',
            a: 'AI 影像平台擅長偵測影像事件，但缺少設備、能源與工程的脈絡。Aiii VBIM 把影像事件落到 BIM 空間與工單，讓事件可以被定位、指派與追蹤。',
            link: { path: '/platform', label: '平台 OS' },
          },
          {
            id: 'digital-twin',
            q: 'Aiii VBIM 跟數位孿生是什麼關係？',
            a: 'Aiii VBIM 是新世代數位孿生管理平台。從設計、施工、驗收、交付到營運，讓建築成為具有感知、分析與管理能力的智慧資產；當人、物、空間、設備、管線、工程清單與進度全部數位化，系統不只告訴你現在發生什麼，更能提前看見接下來會發生什麼。',
            link: { path: '/vbim', label: 'VBIM' },
          },
        ],
      },
      {
        title: '導入',
        items: [
          {
            id: 'sectors',
            q: 'Aiii VBIM 適用哪些場域？',
            a: '先以智慧建築建立 BIM、PMIS、影像、AIoT、設備與能源的完整數位底座，再延伸到醫院、商場、工廠、辦公與能源（資料中心）等場域。',
            link: { path: '/solutions', label: '五大領域' },
          },
          {
            id: 'start-small',
            q: '一定要一次導入整個平台嗎？',
            a: '不用。建議先從能源、影像、PMIS 或空調其中一個明確痛點切入，驗證成效後再擴展到 Aiii VBIM 全平台。每個案場導入前建立基準值，導入後持續追蹤成效。',
            link: { path: '/cases', label: '案例' },
          },
          {
            id: 'multi-site',
            q: '跨國、多據點的企業可以用嗎？',
            a: '可以。同一套企業標準可以複製到不同國家的據點，總部看的是同一套 KPI、資料結構與權限模型。',
            link: { path: '/solutions', label: '五大領域' },
          },
          {
            id: 'app',
            q: 'Aiii VBIM 有手機 App 嗎？',
            a: '有，iOS 與 Android 都可以下載，現場與總部即時同步。',
            link: { path: '/cases', label: '案例' },
          },
        ],
      },
      {
        title: '技術',
        items: [
          {
            id: 'edge-ai',
            q: '什麼是地端 AI？為什麼建築需要地端 AI？',
            a: '地端 AI 是把推論、文件問答與 AI Agent 部署在企業現場，而不是放在雲端。好處是企業資料不必離開現場，符合資安與法規要求；推論在現場完成，反應即時、斷網也能運作；影像不必整批傳上雲端，大幅節省頻寬。醫療、製造、關鍵基礎設施與大型企業特別需要。',
            link: { path: '/edge-ai', label: '地端 AI' },
          },
          {
            id: 'ai-ready-building',
            q: '什麼是 AI-Ready Building？',
            a: 'AI-Ready Building 是在設計階段就把 AI 規劃進建築，而不是完工後再加裝：在規劃初期就把 AI 運算、記憶體、儲存、網路、散熱、UPS、機房與維護需求寫進圖面與規範。建築師是 AI-Ready Building 的第一入口。',
            link: { path: '/edge-ai', label: '地端 AI' },
          },
          {
            id: 'energy',
            q: 'Aiii VBIM 的能源管理能做到什麼？',
            a: '不只是電表 Dashboard，而是建立完整能源拓樸：從台電、變電、配電、UPS／發電機、太陽能／風電／儲能，到空調、產線、資料中心等負載。能源 Agent 把能源資料與氣象、生產排程、人流、租戶與設備狀態交叉分析，回答「為什麼增加、可以怎麼降、降了多少、是否影響生產與舒適」，產生可執行的節能策略。',
            link: { path: '/energy', label: '能源 × 空調' },
          },
          {
            id: 'partners',
            q: '設備商或系統整合商可以把產品接進 Aiii VBIM 嗎？',
            a: '可以。Aiii VBIM 掌握平台、資料模型與解決方案；能源設備、空調系統、AI Edge、攝影機與感測器等，都能透過標準介面（Partner Integration API）納入，出現在每一個導入的場域。可在生態夥伴頁申請加入。',
            link: { path: '/partners', label: '生態夥伴' },
          },
        ],
      },
      {
        title: '其他',
        items: [
          {
            id: 'academy',
            q: 'VBIM 認證學院是什麼？',
            a: 'AI-Ready Building 需要懂建築、懂設備、也懂 AI 的人。VBIM 認證學院培育能把 BIM、能源、空調、影像、AIoT 與地端 AI 落地到真實場域的工程師與夥伴，流程是培訓、考核、認證、媒合。首期課程開放前可先登記。',
            link: { path: '/academy', label: '認證學院' },
          },
          {
            id: 'demo',
            q: '怎麼預約 Demo 或導入評估？',
            a: '在官網「聯絡我們」填寫表單，選擇身分與場域類型，就會由對應的團隊與你聯繫，並收到含預約編號的確認信；也可以加入 LINE 官方帳號詢問。',
            link: { path: '/contact', label: '聯絡我們' },
          },
        ],
      },
    ],
  },
  en: {
    metaTitle: 'FAQ',
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    lead: 'What Aiii VBIM is, how it differs from BIM and BMS, and how to get started.',
    more: 'Learn more: ',
    ctaTitle: 'Have another question?',
    ctaButton: 'Contact us',
    groups: [
      {
        title: 'About Aiii VBIM',
        items: [
          {
            id: 'what-is-aiii-vbim',
            q: 'What is Aiii VBIM?',
            a: 'Aiii VBIM is an operations platform built around buildings and spaces. It brings engineering, equipment, energy, video and Edge AI together so that drawings, BIM, engineering documents, asset registers, video, sensors, energy, maintenance and AI all sit in one spatial and asset structure. It goes beyond building management — it is the shared operating system for buildings, equipment, energy and AI, from a single building or factory to multi-site global enterprises.',
            link: { path: '/platform', label: 'Platform' },
          },
          {
            id: 'vs-bim',
            q: 'How is Aiii VBIM different from traditional BIM?',
            a: 'Traditional BIM manages the model; Aiii VBIM manages the whole real world. BIM is strong on design and engineering data, but the model is often archived after handover, with little operational data or control. In Aiii VBIM the model is not archived — it carries on into commissioning, handover, facility and equipment management, extending engineering data into operations as a long-lived digital asset.',
            link: { path: '/vbim', label: 'VBIM' },
          },
          {
            id: 'vs-bms',
            q: 'How is Aiii VBIM different from a BMS or EMS?',
            a: 'A BMS or EMS is strong at monitoring equipment and energy, but lacks 3D space and the project lifecycle. Aiii VBIM combines BIM, assets and energy: when something goes wrong, you can trace it from the space straight to the equipment, sensors and maintenance records involved.',
            link: { path: '/energy', label: 'Energy & HVAC' },
          },
          {
            id: 'vs-vms',
            q: 'How is Aiii VBIM different from a video analytics (VMS / AI Vision) platform?',
            a: 'Video analytics platforms are good at detecting events, but lack equipment, energy and project context. Aiii VBIM places video events in BIM space and work orders, so every event can be located, assigned and tracked.',
            link: { path: '/platform', label: 'Platform' },
          },
          {
            id: 'digital-twin',
            q: 'How does Aiii VBIM relate to digital twins?',
            a: 'Aiii VBIM is a next-generation digital twin management platform. From design, construction and commissioning through handover and operations, it turns buildings into intelligent assets that can sense, analyze and be managed. Once people, things, spaces, equipment, piping, BOQs and schedules are digitized, the system tells you not only what is happening now, but what is likely to happen next.',
            link: { path: '/vbim', label: 'VBIM' },
          },
        ],
      },
      {
        title: 'Getting started',
        items: [
          {
            id: 'sectors',
            q: 'Which sectors is Aiii VBIM for?',
            a: 'We first build a complete digital foundation for the building — BIM, PMIS, video, AIoT, equipment and energy — then extend it into hospitals, retail, factories, offices and energy (including data centers).',
            link: { path: '/solutions', label: 'Sectors' },
          },
          {
            id: 'start-small',
            q: 'Do we need to roll out the whole platform at once?',
            a: 'No. We recommend starting with one clear pain point — energy, video, PMIS or HVAC — proving the value, then expanding to the full Aiii VBIM platform. Every site sets a baseline before rollout and tracks results afterwards.',
            link: { path: '/cases', label: 'Cases' },
          },
          {
            id: 'multi-site',
            q: 'Does it work for multi-site and global companies?',
            a: 'Yes. One enterprise standard can be replicated across sites in different countries, and headquarters sees the same KPIs, data structure and permission model everywhere.',
            link: { path: '/solutions', label: 'Sectors' },
          },
          {
            id: 'app',
            q: 'Is there a mobile app?',
            a: 'Yes. It is available on iOS and Android, keeping the field and headquarters in sync in real time.',
            link: { path: '/cases', label: 'Cases' },
          },
        ],
      },
      {
        title: 'Technology',
        items: [
          {
            id: 'edge-ai',
            q: 'What is Edge AI, and why do buildings need it?',
            a: 'Edge AI runs inference, document Q&A and AI agents on the company’s own site instead of in the cloud. Enterprise data never has to leave the site, keeping you compliant with security and regulatory requirements; inference runs on-site, so responses are instant and keep working offline; and video doesn’t have to be streamed to the cloud, saving significant bandwidth. Healthcare, manufacturing, critical infrastructure and large enterprises need it most.',
            link: { path: '/edge-ai', label: 'Edge AI' },
          },
          {
            id: 'ai-ready-building',
            q: 'What is an AI-Ready Building?',
            a: 'An AI-Ready Building has AI planned in from the design stage instead of bolted on after handover: AI compute, memory, storage, networking, cooling, UPS, server rooms and maintenance needs are written into the drawings and specifications from the start. Architects are the first gateway to AI-Ready Buildings.',
            link: { path: '/edge-ai', label: 'Edge AI' },
          },
          {
            id: 'energy',
            q: 'What can Aiii VBIM’s energy management do?',
            a: 'More than a meter dashboard, it builds a complete energy topology — from the utility, substations and distribution, UPS and generators, and solar, wind and storage, to HVAC, production lines and data center loads. The energy agent cross-analyzes energy data with weather, production schedules, occupancy, tenants and equipment status to answer why usage rose, how to cut it, how much was saved and whether production or comfort is affected — producing actionable savings strategies.',
            link: { path: '/energy', label: 'Energy & HVAC' },
          },
          {
            id: 'partners',
            q: 'Can equipment vendors and system integrators connect their products?',
            a: 'Yes. Aiii VBIM owns the platform, data model and solutions; energy equipment, HVAC systems, AI edge devices, cameras and sensors connect through standard interfaces (the Partner Integration API) and appear at every site that deploys the platform. You can apply on the Partners page.',
            link: { path: '/partners', label: 'Partners' },
          },
        ],
      },
      {
        title: 'Other',
        items: [
          {
            id: 'academy',
            q: 'What is VBIM Academy?',
            a: 'AI-Ready Buildings need people who understand buildings, equipment and AI. VBIM Academy develops engineers and partners who can bring BIM, energy, HVAC, video, AIoT and Edge AI to life on real sites, through training, assessment, certification and matching. You can register your interest before the first cohort opens.',
            link: { path: '/academy', label: 'Academy' },
          },
          {
            id: 'demo',
            q: 'How do I book a demo or an assessment?',
            a: 'Fill in the form on the Contact page and choose your role and site type. The right team will get in touch, and you’ll receive a confirmation email with a reference number. You can also reach us on our LINE Official Account.',
            link: { path: '/contact', label: 'Contact' },
          },
        ],
      },
    ],
  },
};
