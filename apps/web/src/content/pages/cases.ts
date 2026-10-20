// /cases 固定文案：逐字取自 design/pages/Cases.dc.html、en-Cases.dc.html（清單資料見 ../design/Cases.json）
import type { Locale } from '../../lib/i18n';

export const CASES_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    approach: { label: string; title: string; text: string };
    app: { label: string; title: string; text: string };
    demos: { eyebrow: string; title: string; lead: string; cta: string };
    kpi: { title: string; lead: string; columns: [string, string] };
    ui: {
      metaTitle: string;
      cmsTitle: string;
      client: string;
      sector: string;
      modules: string;
      results: string;
      gallery: string;
      back: string;
    };
  }
> = {
  'zh-Hant': {
    eyebrow: 'CASES & EXPERIENCE',
    title: '實績與示範場景',
    lead: '從智慧醫院、跨國設廠到淨零建築，Aiii VBIM 已在多個產業場域與公開活動中展示成果。',
    approach: {
      label: '導入方法',
      title: 'Land & Expand',
      text: '先從能源、影像、PMIS 或空調一個明確痛點切入，驗證成效後再擴展到 Aiii VBIM 全平台。',
    },
    app: {
      label: '隨身管理',
      title: 'Aiii VBIM App',
      text: 'iOS 與 Android 皆可下載，現場與總部即時同步。',
    },
    demos: {
      eyebrow: 'STANDARD SCENARIOS',
      title: '六個標準示範場景',
      lead: '以真實系統操作示範，看 Aiii VBIM 如何處理這些情境。',
      cta: '預約實機示範 →',
    },
    kpi: {
      title: '我們如何衡量成效',
      lead: '價值不在好看的 Dashboard，而在可衡量的成果。每個案場導入前建立基準值，導入後持續追蹤。',
      columns: ['價值面', '可量化 KPI'],
    },
    ui: {
      metaTitle: '案例',
      cmsTitle: '導入案例',
      client: '客戶',
      sector: '場域',
      modules: '導入模組',
      results: '成果',
      gallery: '照片',
      back: '← 回到案例',
    },
  },
  en: {
    eyebrow: 'CASES & EXPERIENCE',
    title: 'Track record and demo scenarios',
    lead: 'From smart hospitals and global plant build-outs to net-zero buildings, Aiii VBIM has shown results across industries and public events.',
    approach: {
      label: 'How we deploy',
      title: 'Land & Expand',
      text: 'Start with one clear pain point — energy, video, PMIS or HVAC — prove the value, then expand to the full Aiii VBIM platform.',
    },
    app: {
      label: 'On the go',
      title: 'Aiii VBIM App',
      text: 'Available on iOS and Android — field and HQ in sync.',
    },
    demos: {
      eyebrow: 'STANDARD SCENARIOS',
      title: 'Six standard demo scenarios',
      lead: 'See how Aiii VBIM handles these situations in a live system walkthrough.',
      cta: 'Book a live demo →',
    },
    kpi: {
      title: 'How we measure results',
      lead: 'The value isn’t a nice dashboard — it’s measurable outcomes. We set a baseline before deployment and track it continuously afterward.',
      columns: ['Area', 'Measurable KPIs'],
    },
    ui: {
      metaTitle: 'Cases',
      cmsTitle: 'Customer cases',
      client: 'Client',
      sector: 'Sector',
      modules: 'Modules deployed',
      results: 'Results',
      gallery: 'Photos',
      back: '← Back to Cases',
    },
  },
};
