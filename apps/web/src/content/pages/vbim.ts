// /vbim 固定文案：逐字取自 design/pages/VBIM.dc.html、en-VBIM.dc.html（清單資料見 ../design/VBIM.json）
import type { Locale } from '../../lib/i18n';

export const VBIM_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    storeLabel: { appStore: string; googlePlay: string };
    demo: string;
    heroAlt: string;
    values: { eyebrow: string; title: string };
    stages: { eyebrow: string; title: string; lead: string };
    edge: { eyebrow: string; title: string; oldTitle: string; newTitle: string };
    family: {
      eyebrow: string;
      title: string;
      co: { label: string; title: string; text: string };
      starlight: { label: string; title: string; text: string };
    };
    field: {
      eyebrow: string;
      title: string;
      lead: string;
      demoAlt: string;
      screensAlt: string;
    };
    media: { title: string; viewAll: string };
    downUpLabel: { down: string; up: string };
  }
> = {
  'zh-Hant': {
    metaTitle: '第六代智慧建築 Aiii VBIM',
    eyebrow: 'ARTIFICIAL INTELLIGENCE INTEGRATED VIRTUAL BIM',
    title: '第六代智慧建築\nAiii VBIM',
    subtitle: '讓台灣的資金、技術與管理經驗跨越國界，掌握全球資產，打造超級戰情室。',
    body: '星宴國際開發集結建築工程、BIM 技術、AI 人工智慧、影像辨識、物聯網、雲端平台及大數據分析等領域專家，歷時多年投入研發，打造新世代數位孿生管理平台。從設計、施工、驗收、交付到營運，讓建築成為具有感知、分析與管理能力的智慧資產。',
    storeLabel: { appStore: '下載', googlePlay: '下載' },
    demo: '預約 Demo →',
    heroAlt: '以建築為核心的智慧城市示意',
    values: { eyebrow: 'SIX CORE VALUES', title: '六大核心價值' },
    stages: {
      eyebrow: 'FROM DESIGN TO OPERATIONS',
      title: '從設計到營運，每一筆資料都接得下去',
      lead: '原有建築流程把設計、圖說、施工、影像、設備與營運拆成不同系統。Aiii VBIM 把這些資訊重新整合，讓每一個階段都能被追蹤、被理解、被延續，最後形成完整的建築數位資產。',
    },
    edge: {
      eyebrow: 'COMPETITIVE EDGE',
      title: '傳統 BIM 管模型，Aiii VBIM 管整個真實世界',
      oldTitle: '傳統 BIM／傳統工程管理',
      newTitle: 'Aiii VBIM 綜合智慧平台',
    },
    family: {
      eyebrow: 'PRODUCT FAMILY & TEAM',
      title: '產品家族與研發團隊',
      co: {
        label: '共同開發',
        title: '星宴國際開發 × 星創科技 × 星賀建設',
        text: '集結建築工程、BIM、AI、影像辨識、物聯網、雲端與大數據專家團隊。',
      },
      starlight: {
        label: '繁星計劃',
        title: '開放合作，共創智慧城市',
        text: '匯聚建築、醫療、能源、科技與再生產業夥伴，一曜再生已加入 Aiii VBIM 國際戰略合作夥伴生態系。',
      },
    },
    field: {
      eyebrow: 'IN THE FIELD',
      title: '真實畫面，真實場域',
      lead: '不是示意圖——以下是 Aiii VBIM 實際運作的現場照片與系統畫面。',
      demoAlt: 'Aiii VBIM 系統實機展示',
      screensAlt: '系統實際畫面：CCTV 影像對位 2D 平面圖',
    },
    media: { title: '媒體報導', viewAll: '看全部報導 →' },
    downUpLabel: { down: '降低', up: '提升' },
  },
  en: {
    metaTitle: '6th-Generation Smart Building · Aiii VBIM',
    eyebrow: 'ARTIFICIAL INTELLIGENCE INTEGRATED VIRTUAL BIM',
    title: '6th-Generation Smart Building\nAiii VBIM',
    subtitle:
      'Taking Taiwan’s capital, technology and management know-how across borders — to manage global assets from one super command center.',
    body: 'Xingyan International Development brought together experts in construction engineering, BIM, AI, video recognition, IoT, cloud and big data, investing years of R&D into a new-generation digital twin management platform. From design, construction and commissioning to handover and operations, it turns buildings into smart assets that sense, analyze and manage.',
    storeLabel: { appStore: 'Download on the', googlePlay: 'Get it on' },
    demo: 'Book a Demo →',
    heroAlt: 'A smart city with the building at its core',
    values: { eyebrow: 'SIX CORE VALUES', title: 'Six core values' },
    stages: {
      eyebrow: 'FROM DESIGN TO OPERATIONS',
      title: 'From design to operations, every piece of data carries forward',
      lead: 'Traditional building workflows split design, drawings, construction, video, equipment and operations into separate systems. Aiii VBIM reintegrates them so every stage can be tracked, understood and carried forward — building a complete digital asset.',
    },
    edge: {
      eyebrow: 'COMPETITIVE EDGE',
      title: 'Traditional BIM manages models. Aiii VBIM manages the real world.',
      oldTitle: 'Traditional BIM / project management',
      newTitle: 'The Aiii VBIM integrated platform',
    },
    family: {
      eyebrow: 'PRODUCT FAMILY & TEAM',
      title: 'Product family and development team',
      co: {
        label: 'Co-developed by',
        title: 'Xingyan International × Xingchuang Technology × YIHHUII Construction',
        text: 'A team of experts in construction engineering, BIM, AI, video recognition, IoT, cloud and big data.',
      },
      starlight: {
        label: 'The Starlight Program',
        title: 'Open collaboration for smarter cities',
        text: 'Bringing together partners from construction, healthcare, energy, technology and regenerative medicine — Yi-Yao Regenerative has joined the Aiii VBIM international strategic partner ecosystem.',
      },
    },
    field: {
      eyebrow: 'IN THE FIELD',
      title: 'Real screens, real sites',
      lead: 'Not renderings — these are photos and screenshots of Aiii VBIM in use.',
      demoAlt: 'Aiii VBIM live system demo',
      screensAlt: 'Actual system view: CCTV feeds mapped onto 2D floor plans',
    },
    media: { title: 'In the media', viewAll: 'All coverage →' },
    downUpLabel: { down: 'Reduce', up: 'Increase' },
  },
};
