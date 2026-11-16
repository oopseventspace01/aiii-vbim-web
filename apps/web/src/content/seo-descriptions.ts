// 搜尋結果專用描述（<meta name="description">）：只影響 Google 搜尋結果，不會顯示在頁面上。
// 來源：docs/SEO-頁面描述建議稿.md，2026-11-16 確認照建議稿套用。
// 每句都取自網站已核准的文案，只做縮短或合併。
// 沒列在這裡的頁面（或語言），沿用頁面上的副標或導言當描述。
// 首頁的描述在後台「全站設定 → SEO 描述」，不在這裡。
import type { Locale } from '../lib/i18n';

export type SeoPageKey =
  | 'vbim'
  | 'platform'
  | 'energy'
  | 'edge'
  | 'partners'
  | 'solutions'
  | 'about'
  | 'academy'
  | 'rms'
  | 'mms';

export const SEO_DESCRIPTIONS: Partial<Record<SeoPageKey, Partial<Record<Locale, string>>>> = {
  vbim: {
    'zh-Hant':
      '讓台灣的資金、技術與管理經驗跨越國界，掌握全球資產，打造超級戰情室。從設計、施工、驗收、交付到營運，讓建築成為具有感知、分析與管理能力的智慧資產。',
  },
  platform: {
    'zh-Hant':
      '把建築資料、設備與 AI 基礎建設，整合為可營運的建築作業系統。圖說、BIM、工程文件、設備台帳、影像、感測、能源、維修與 AI，都落在同一個空間與資產架構中。',
  },
  energy: {
    'zh-Hant':
      '風力、太陽能、儲能與算力中心的整合智控。不只是電表 Dashboard，而是建立完整能源拓樸，從供電到用電，建立全域能源可視化與智慧優化。',
    en: 'Integrated control of wind, solar, storage and compute centers — a complete energy topology with full visibility and optimization from supply to demand.',
  },
  edge: {
    'zh-Hant':
      '讓 AI 不只看見資料，更能理解場域並協助決策。Aiii Edge AI 把推論、文件問答與 AI Agent 部署在企業現場，直接結合 VBIM 的空間、設備、影像與能源資料。',
  },
  partners: {
    'zh-Hant':
      '你的設備、技術與服務，都可以接進 Aiii VBIM。任何能源設備、空調系統、AI Edge、攝影機與感測器，都能透過標準介面納入 Aiii VBIM。',
    en: 'Your equipment, technology and services can all connect to Aiii VBIM. Energy, HVAC, AI edge hardware, cameras and sensors join through standard interfaces.',
  },
  solutions: {
    en: 'Building at the core, extended into hospitals, retail, factories, offices and energy. Each sector starts with one clear pain point, then expands platform-wide.',
  },
  about: {
    en: 'With buildings and space at its core, Aiii VBIM integrates engineering, equipment, energy, video and Edge AI into a cross-border, multi-site operating platform.',
  },
  academy: {
    en: 'VBIM Academy develops engineers and partners who can bring BIM, energy, HVAC, video, AIoT and Edge AI to life on real sites.',
  },
  rms: {
    en: 'Aiii RMS builds consumer behavior analysis, store layout, traffic flow and product display into a digital twin, combining AI image recognition with POS data.',
  },
  mms: {
    en: 'Aiii MMS builds a hospital digital twin from the planning stage and integrates hospital information systems, with AI image recognition to streamline care.',
  },
};

/** 搜尋結果描述：有專用描述就用，沒有就用頁面上的文字（fallback） */
export function seoDescription(key: SeoPageKey, locale: Locale, fallback: string): string {
  return SEO_DESCRIPTIONS[key]?.[locale] ?? fallback;
}
