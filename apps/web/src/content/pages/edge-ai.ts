// /edge-ai 固定文案：逐字取自 design/pages/EdgeAI.dc.html、en-EdgeAI.dc.html（清單資料見 ../design/EdgeAI.json）
import type { Locale } from '../../lib/i18n';

export const EDGE_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    heroCta: string;
    heroAlt: string;
    design: { eyebrow: string; title: string; text: string; itemsLabel: string };
    caps: { title: string; columns: [string, string, string] };
    forms: { title: string; infraTitle: string };
    cta: { title: string; text: string; button: string };
  }
> = {
  'zh-Hant': {
    metaTitle: '地端 AI 完整解決方案',
    eyebrow: 'EDGE AI APPLIANCE + AI AGENT',
    title: '地端 AI 完整解決方案',
    subtitle: '讓 AI 不只看見資料，更能理解場域並協助決策。',
    body: '醫療、製造、關鍵基礎設施與大型企業，常有低延遲、網路韌性與資料敏感的需求。Aiii Edge AI 把推論、文件問答與 AI Agent 部署在企業現場，直接結合 VBIM 的空間、設備、影像與能源資料。',
    heroCta: '預約地端 AI 評估 →',
    heroAlt: '地端 AI 智慧園區示意：Smart Building、Smart Campus、Sustainable Future',
    design: {
      eyebrow: 'AI-READY BUILDING · DESIGN-IN',
      title: '不是完工後加裝 AI，\n而是在規劃初期就設計進建築',
      text: 'Aiii VBIM 把 AI 帶進建築：在設計階段就把 AI 運算、記憶體、儲存、網路與散熱一起規劃進去，形成可 Design-In 的 AI-Ready Building Solution。',
      itemsLabel: 'Design-In 項目',
    },
    caps: { title: '地端 AI 能做什麼', columns: ['能力', '用途', '價值'] },
    forms: { title: '四種部署型態', infraTitle: '地端 AI 基礎設施' },
    cta: {
      title: '你的資料，適合在哪裡運算？',
      text: '評估資料類型、法規要求與建議的部署型態。',
      button: '預約評估 →',
    },
  },
  en: {
    metaTitle: 'A complete Edge AI solution',
    eyebrow: 'EDGE AI APPLIANCE + AI AGENT',
    title: 'A complete Edge AI solution',
    subtitle: 'AI that doesn’t just see the data — it understands your site and helps you decide.',
    body: 'Healthcare, manufacturing, critical infrastructure and large enterprises often need low latency, network resilience and protection for sensitive data. Aiii Edge AI deploys inference, document Q&A and AI agents on-site, directly connected to VBIM’s spatial, equipment, video and energy data.',
    heroCta: 'Request an Edge AI assessment →',
    heroAlt: 'Edge AI for a smart campus',
    design: {
      eyebrow: 'AI-READY BUILDING · DESIGN-IN',
      title: 'Don’t bolt AI on after handover —\ndesign it in from the start',
      text: 'Aiii VBIM brings AI into the building — planning AI compute, memory, storage, networking and cooling from the design stage, for an AI-Ready Building solution that can be designed in.',
      itemsLabel: 'Design-in items',
    },
    caps: { title: 'What Edge AI can do', columns: ['Capability', 'Use', 'Value'] },
    forms: { title: 'Four deployment options', infraTitle: 'Edge AI infrastructure' },
    cta: {
      title: 'Where should your data be processed?',
      text: 'We assess your data types, compliance needs and the right deployment model.',
      button: 'Request an assessment →',
    },
  },
};
