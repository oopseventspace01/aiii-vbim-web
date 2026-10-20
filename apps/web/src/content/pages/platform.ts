// /platform 固定文案：逐字取自 design/pages/Platform.dc.html、en-Platform.dc.html（清單資料見 ../design/Platform.json）
import type { Locale } from '../../lib/i18n';

export const PLATFORM_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    heroAlt: string;
    caps: { title: string };
    layers: { eyebrow: string; title: string; lead: string; flow: string };
    life: { eyebrow: string; title: string; lead: string };
    pmis: { eyebrow: string; title: string; lead: string; motto: string };
    four: { title: string; lead: string };
    dims: { eyebrow: string; title: string; lead: string; axesEnd: string };
    personas: { title: string };
    cmp: { caption: string; columns: [string, string, string, string] };
    cta: { title: string; text: string; button: string };
  }
> = {
  'zh-Hant': {
    metaTitle: 'Aiii VBIM 平台 OS',
    eyebrow: 'PLATFORM · PHYSICAL WORLD OS',
    title: 'Aiii VBIM 平台 OS',
    subtitle: '把建築資料、設備與 AI 基礎建設，整合為可營運的建築作業系統。',
    body: '企業數位轉型最難的不是沒有資料，而是資料分散在不同系統、不同承包商、不同場域與不同時間階段。Aiii VBIM 建立實體世界共同資料層，讓圖說、BIM、工程文件、設備台帳、影像、感測、能源、維修與 AI，都落在同一個空間與資產架構中。',
    heroAlt: '以建築為核心的城市示意',
    caps: { title: '五個核心能力' },
    layers: {
      eyebrow: 'ARCHITECTURE',
      title: '五層整合架構',
      lead: '不是單一軟體，而是把建築資料、感知、設備、AI 運算與管理整合為一個可營運的系統。',
      flow: '2D → 3D BIM → PMIS → Digital Twin → Private AI',
    },
    life: {
      eyebrow: 'LIFECYCLE',
      title: '從設計開始，一路管理到營運',
      lead: '這是 Aiii VBIM 與傳統 BIM 最大的差異：模型不在完工後封存，而是持續進入驗收、交付、物業與設備管理，成為長期可用的數位資產。',
    },
    pmis: {
      eyebrow: 'FULL-CYCLE PMIS',
      title: '不只管理施工，\n而是管理整個工程生命週期',
      lead: '把分散在業主、建築師、工程顧問、營造、監造驗收與物業端的資訊，拉回同一個平台。',
      motto: 'One Project · One Platform · One Version of Truth',
    },
    four: {
      title: '四大智慧核心能力',
      lead: '整合影像、文件、數位孿生與上鏈，從現場到資料追溯都可視、可追蹤、可延續。',
    },
    dims: {
      eyebrow: 'AIOT × DIGITAL TWIN',
      title: '人、物、天、地、線：\n工程與營運的全域數位座標',
      lead: 'Aiii VBIM 不只管理空間，更管理時間。當人、物、空間、設備、管線、工程清單與進度全部數位化，系統不只告訴你「現在發生什麼」，更能提前看見「接下來會發生什麼」。',
      axesEnd: 'TIME → PREDICT → NEXT ACTION',
    },
    personas: { title: '不同角色，看到的是同一個真實專案' },
    cmp: { caption: '與傳統做法比較', columns: ['類型', '強項', '常見限制', 'Aiii VBIM 的差異'] },
    cta: {
      title: '看看 Aiii VBIM 在你的場域怎麼運作',
      text: '用你的場域情境，實際操作一次。',
      button: '預約 Demo →',
    },
  },
  en: {
    metaTitle: 'The Aiii VBIM Platform OS',
    eyebrow: 'PLATFORM · PHYSICAL WORLD OS',
    title: 'The Aiii VBIM Platform OS',
    subtitle:
      'Building data, equipment and AI infrastructure — integrated into one operable building OS.',
    body: 'The hardest part of digital transformation isn’t a lack of data — it’s data scattered across systems, contractors, sites and project phases. Aiii VBIM creates a shared data layer for the physical world, placing drawings, BIM, engineering documents, asset registers, video, sensors, energy, maintenance and AI into one spatial and asset structure.',
    heroAlt: 'A city with the building at its core',
    caps: { title: 'Five core capabilities' },
    layers: {
      eyebrow: 'ARCHITECTURE',
      title: 'A five-layer integrated architecture',
      lead: 'Not a single piece of software, but building data, sensing, equipment, AI compute and management combined into one operable system.',
      flow: '2D → 3D BIM → PMIS → Digital Twin → Private AI',
    },
    life: {
      eyebrow: 'LIFECYCLE',
      title: 'From design all the way to operations',
      lead: 'This is the biggest difference from traditional BIM: the model isn’t archived at handover. It carries on into commissioning, facility and asset management as a long-lived digital asset.',
    },
    pmis: {
      eyebrow: 'FULL-CYCLE PMIS',
      title: 'Manage the entire project lifecycle, not just construction',
      lead: 'Information scattered across owners, architects, consultants, contractors, inspectors and facility teams — brought back onto one platform.',
      motto: 'One Project · One Platform · One Version of Truth',
    },
    four: {
      title: 'Four intelligent core capabilities',
      lead: 'Video, documents, the digital twin and blockchain — traceable from the field to the record.',
    },
    dims: {
      eyebrow: 'AIOT × DIGITAL TWIN',
      title: 'People, Assets, Space, Ground, MEP:\na full digital coordinate system',
      lead: 'Aiii VBIM manages not only space, but time. Once people, assets, spaces, equipment, piping, bills of quantities and schedules are digitized, the system tells you not just what is happening now — but what will happen next.',
      axesEnd: 'TIME → PREDICT → NEXT ACTION',
    },
    personas: { title: 'Different roles, one true project' },
    cmp: {
      caption: 'Compared with traditional approaches',
      columns: ['Category', 'Strength', 'Typical limitation', 'How Aiii VBIM differs'],
    },
    cta: {
      title: 'See how Aiii VBIM works on your site',
      text: 'Walk through it with your own scenario.',
      button: 'Book a Demo →',
    },
  },
};
