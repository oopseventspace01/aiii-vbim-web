// /vbim#pmis PMIS 工程管理區塊（2026-11-03 業主指示新增）
// 中文逐字取自舊官網（docs/reference/old-site-home.html）的施工管理段落，只調整全形標點與空白；
// 舊站「國內唯一整合」屬最高級宣稱，未經業主確認前不使用。英文為 Claude 翻譯，待業主確認。
import type { Locale } from '../../lib/i18n';

type PmisCopy = {
  eyebrow: string;
  title: string;
  flow: string[];
  lead: string;
  stagesTitle: string;
  stages: { t: string; d: string }[];
  stepsTitle: string;
  steps: string[];
  servicesTitle: string;
  services: string[];
  figures: { machineRoom: string; integrated: string; ceiling: string };
  cta: string;
};

export const PMIS_COPY: Record<Locale, PmisCopy> = {
  'zh-Hant': {
    eyebrow: 'PMIS 工程管理',
    title: 'Aiii VBIM 雲端管理平台（施工管理）PMIS',
    flow: ['設計', '施工（PMIS）', '竣工（點交）', 'Aiii VBIM 建築維護'],
    lead: '透過全流程數位化、AI 與上鏈技術，讓建築專案創造非凡價值：加速交付、提升品質、贏得市場信任；同時節流降本：減少錯誤、縮短工期、降低人工作業與溝通成本。',
    stagesTitle: '雲端管理平台',
    stages: [
      { t: '設計規劃管理', d: '使用機能、面積、數量、環境分析管理。' },
      { t: '設計發包管理', d: '優化與檢討各專業衝突及空間設計問題，協助正確設計發包檔的產出。' },
      { t: '施工階段管理', d: '施工工序監控、各階段進度與品質管制。' },
      { t: '竣工階段管理', d: '完工後查驗點交確保數量交付管理。' },
    ],
    stepsTitle: 'Aiii VBIM 整合工作｜提供衝突改善建議，配合修正圖說',
    steps: [
      '建置繪圖準則規範',
      '樣板／清圖',
      '結構／建築套繪',
      '施工衝突整理',
      '提供解決方案',
      '機電套繪',
      '施工衝突整理',
    ],
    servicesTitle: 'Aiii VBIM 施工管理服務',
    services: [
      '施工前機電系統模型規劃及建置，配合現場施工成果、竣工模型修正、竣工報告',
      '土建及機電各專業整合模型',
      '複雜空間細部配管 3D 剖圖',
      'LOD 400 消防機房、LOD 400 發電機房',
      '施工階段機電系統模型建置',
      '管件 Aiii VBIM 裝配建模與預製',
      'Aiii VBIM 施工圖 2D、3D 出圖',
      'Aiii VBIM 特定管線套圖',
    ],
    figures: {
      machineRoom: '所有管線配置／閥件／接頭／機房設備等空間配置',
      integrated: '土建及機電各專業整合模型',
      ceiling: '成果範例：走道上端施工前密布管線，檢討天花板上配管空間',
    },
    cta: '預約 PMIS 導入諮詢',
  },
  en: {
    eyebrow: 'PMIS',
    title: 'Aiii VBIM Cloud Platform for Construction Management (PMIS)',
    flow: ['Design', 'Construction (PMIS)', 'Completion (handover)', 'Aiii VBIM building O&M'],
    lead: 'With end-to-end digitalization, AI and blockchain records, building projects deliver faster, with higher quality and greater market trust, while cutting cost: fewer errors, shorter schedules, and less manual work and coordination.',
    stagesTitle: 'Cloud management platform',
    stages: [
      {
        t: 'Design planning',
        d: 'Manage functions, floor areas, quantities and environmental analysis.',
      },
      {
        t: 'Design & tender',
        d: 'Review and resolve cross-discipline clashes and spatial design issues so tender documents are produced correctly.',
      },
      {
        t: 'Construction',
        d: 'Monitor work sequences, and control progress and quality at every stage.',
      },
      {
        t: 'Completion',
        d: 'Inspection and handover after completion to verify delivered quantities.',
      },
    ],
    stepsTitle: 'Aiii VBIM coordination | clash-resolution advice and drawing revisions',
    steps: [
      'Set drafting standards',
      'Templates / drawing cleanup',
      'Structural / architectural overlay',
      'Clash review',
      'Propose solutions',
      'MEP overlay',
      'Clash review',
    ],
    servicesTitle: 'Aiii VBIM construction management services',
    services: [
      'Pre-construction MEP model planning and build, updated with site results, as-built model revisions and completion reports',
      'Integrated civil and MEP models across disciplines',
      'Detailed 3D piping sections for complex spaces',
      'LOD 400 fire-protection and generator rooms',
      'MEP modeling during construction',
      'Aiii VBIM fitting assembly modeling and prefabrication',
      'Aiii VBIM 2D and 3D construction drawings',
      'Aiii VBIM coordination drawings for specific piping',
    ],
    figures: {
      machineRoom: 'Spatial layout of all piping, valves, fittings and plant-room equipment',
      integrated: 'Integrated civil and MEP model across disciplines',
      ceiling:
        'Example: dense piping above a corridor, reviewed for ceiling space before construction',
    },
    cta: 'Book a PMIS consultation',
  },
};
