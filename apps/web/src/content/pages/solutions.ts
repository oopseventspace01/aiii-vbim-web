// /solutions 固定文案：逐字取自 design/pages/Solutions.dc.html、en-Solutions.dc.html（分頁內容見 ../design/Solutions.json）
import type { Locale } from '../../lib/i18n';

export const SOLUTIONS_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    tabsLabel: string;
    panel: {
      pain: string;
      points: string;
      kpis: string;
      first: string;
      demo: string;
    };
    dashboardAlt: { hospital: string; factory: string };
    products: { eyebrow: string; title: string };
    architects: {
      eyebrow: string;
      title: string;
      lead: string;
      usualLabel: string;
      usual: string[];
      vbimLabel: string;
      vbim: string[];
      value: string;
    };
    global: { eyebrow: string; title: string; text: string };
    ui: { related: string };
  }
> = {
  'zh-Hant': {
    metaTitle: '五大領域',
    eyebrow: 'FIVE KEY SECTORS',
    title: '以建築為核心，延伸五大應用場域',
    lead: '先以智慧建築建立 BIM、PMIS、影像、AIoT、設備與能源的完整數位底座，再向醫院、商場、工廠、辦公與能源延伸。每個場域都從一個明確痛點切入，驗證成效後再擴展到全平台。',
    tabsLabel: '選擇場域',
    panel: {
      pain: '現場痛點',
      points: '整合範圍',
      kpis: '可量化指標',
      first: '第一個可導入模組',
      demo: '預約這個場域的 Demo →',
    },
    dashboardAlt: {
      hospital: '智慧醫療上帝視角儀表板示意：多院區遠距管理、病房調度、設備稼動率與 ESG 電能',
      factory:
        '智慧製造上帝視角儀表板示意：多點遠距管理、廠房 BIM 結構、設備稼動率 OEE 與 ESG 電能',
    },
    products: { eyebrow: 'PRODUCTIZED SOLUTIONS', title: '三大產品化方案' },
    architects: {
      eyebrow: 'FOR ARCHITECTS · AI-READY BUILDING DESIGN-IN',
      title: '建築師，是 AI-Ready Building 的第一入口',
      lead: '不是完工後再加裝 AI，而是在規劃初期，就把 AI、能源、空調、影像、AIoT、網路、UPS、機房與維護需求寫進圖面與規範。',
      usualLabel: '一般導入',
      usual: ['建築完成', 'IT 進場', '加裝 AI', '整合困難'],
      vbimLabel: 'Aiii VBIM 2.0 導入',
      vbim: [
        'Concept 規劃',
        'SD／DD 設計',
        'CD 施工圖',
        '施工 PMIS',
        '驗收 Commission',
        '營運 AI 智控',
      ],
      value: '對建築師的價值：可畫進圖面、可寫進規範、可納入預算、可協調機電、可交付業主。',
    },
    global: {
      eyebrow: 'HIGH-VALUE SCENARIO',
      title: '跨國設廠：一套標準，複製到每一座廠',
      text: '跨國設廠是設計、施工、供應鏈、設備、驗收、營運與總部治理的長週期問題。同一套企業標準可複製到 Arizona、Texas、Japan、Singapore、Malaysia、Vietnam 或 Europe，總部看的是同一套 KPI、資料結構與權限模型。',
    },
    ui: { related: '延伸閱讀' },
  },
  en: {
    metaTitle: 'Sectors',
    eyebrow: 'FIVE KEY SECTORS',
    title: 'Building at the core, five sectors in reach',
    lead: 'We first build a complete digital foundation for the building — BIM, PMIS, video, AIoT, equipment and energy — then extend it into hospitals, retail, factories, offices and energy. Every sector starts with one clear pain point, proves the value, then expands to the full platform.',
    tabsLabel: 'Choose a sector',
    panel: {
      pain: 'The pain point',
      points: 'What we integrate',
      kpis: 'Measurable KPIs',
      first: 'First module to deploy',
      demo: 'Book a demo for this sector →',
    },
    dashboardAlt: {
      hospital:
        'Illustrative smart healthcare dashboard: multi-campus remote management, ward scheduling, equipment availability and ESG energy',
      factory:
        'Illustrative smart manufacturing dashboard: multi-site management, plant BIM structure, OEE and ESG energy',
    },
    products: { eyebrow: 'PRODUCTIZED SOLUTIONS', title: 'Three productized solutions' },
    architects: {
      eyebrow: 'FOR ARCHITECTS · AI-READY BUILDING DESIGN-IN',
      title: 'Architects are the front door to AI-Ready Buildings',
      lead: 'Don’t bolt AI on after handover. Write AI, energy, HVAC, video, AIoT, network, UPS, server rooms and maintenance needs into drawings and specifications from day one.',
      usualLabel: 'The usual way',
      usual: ['Building done', 'IT moves in', 'AI added', 'Hard to integrate'],
      vbimLabel: 'With Aiii VBIM 2.0',
      vbim: [
        'Concept',
        'SD / DD',
        'CD',
        'Construction · PMIS',
        'Commissioning',
        'Operations · AI control',
      ],
      value:
        'Value for architects: it can be drawn, specified, budgeted, coordinated with MEP and handed over to the owner.',
    },
    global: {
      eyebrow: 'HIGH-VALUE SCENARIO',
      title: 'Global plant build-outs: one standard, every site',
      text: 'Building plants overseas is a long-cycle challenge spanning design, construction, supply chain, equipment, commissioning, operations and HQ governance. One corporate standard can be replicated in Arizona, Texas, Japan, Singapore, Malaysia, Vietnam or Europe — with HQ seeing the same KPIs, data structure and permission model.',
    },
    ui: { related: 'Learn more' },
  },
};

/** 各場域分頁的延伸閱讀（2026-10-20 文案精簡決定：以站內頁面連結取代 Land & Expand 說明） */
export const SECTOR_RELATED: Record<string, ('vbim' | 'platform' | 'energy' | 'edge' | 'cases')[]> =
  {
    hospital: ['energy', 'edge', 'cases'],
    retail: ['energy', 'platform', 'cases'],
    factory: ['platform', 'energy', 'cases'],
    office: ['platform', 'vbim', 'cases'],
    energy: ['energy', 'edge', 'cases'],
  };
