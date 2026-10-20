// /about 固定文案：逐字取自 design/pages/About.dc.html、en-About.dc.html（清單資料見 ../design/About.json）
import type { Locale } from '../../lib/i18n';

export const ABOUT_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    heroAlt: string;
    problem: { title: string; paragraphs: string[] };
    biz: { eyebrow: string; title: string };
    goals: { eyebrow: string; title: string };
    market: { eyebrow: string; title: string; note: string };
    miles: { title: string };
    cta: { title: string; contact: string; partner: string };
  }
> = {
  'zh-Hant': {
    metaTitle: '關於我們',
    eyebrow: 'ABOUT · CREATE VALUE, CUT COST',
    title: '讓每一個空間、設備、能源與事件，都能被 AI 理解、管理、預測與控制',
    lead: '從一棟建築，到一座工廠，再到全球企業。Aiii VBIM 以建築與空間為核心，整合工程、設備、能源、影像與地端 AI，打造跨國、遠距、多點、數據智控的企業營運平台。',
    heroAlt: 'Aiii VBIM 建築數位孿生示意',
    problem: {
      title: '我們看見的問題',
      paragraphs: [
        '企業數位轉型真正困難的地方，不是沒有資料，而是資料分散在不同系統、不同承包商、不同場域與不同時間階段。',
        '多數系統只管理一個專業：BMS 管設備、EMS 管能源、VMS 管影像、DCIM 管資料中心、MES 管產線、HIS 管醫療資訊。',
        'Aiii VBIM 的任務，是建立一個實體世界共同資料層，把所有資料放回真實世界的建築、樓層、空間與設備之中。',
      ],
    },
    biz: { eyebrow: 'SCALABLE BUSINESS MODEL', title: '從單次建置，走向長期維運與訂閱' },
    goals: { eyebrow: 'PLAN OBJECTIVES', title: '聚焦標竿場域、產品整合與市場擴張' },
    market: {
      eyebrow: 'MARKET OPPORTUNITY',
      title: '從建築管理平台，走向企業實體世界 OS',
      note: 'Aiii VBIM 2.0 可從新建案延伸到既有場域升級，形成長期維運與訂閱型收入。',
    },
    miles: { title: '里程碑' },
    cta: {
      title: '想知道 Aiii VBIM 怎麼用在你的場域？',
      contact: '聯絡我們',
      partner: '成為夥伴',
    },
  },
  en: {
    metaTitle: 'About',
    eyebrow: 'ABOUT · CREATE VALUE, CUT COST',
    title:
      'Making every space, asset, energy flow and event understandable, manageable, predictable and controllable by AI',
    lead: 'From one building to one factory to a global enterprise. With buildings and space at its core, Aiii VBIM integrates engineering, equipment, energy, video and Edge AI into a cross-border, remote, multi-site, data-driven operating platform.',
    heroAlt: 'Aiii VBIM digital twin building',
    problem: {
      title: 'The problem we see',
      paragraphs: [
        'The hard part of digital transformation isn’t a lack of data — it’s data scattered across systems, contractors, sites and project phases.',
        'Most systems manage a single discipline: BMS for equipment, EMS for energy, VMS for video, DCIM for data centers, MES for production, HIS for hospital information.',
        'Aiii VBIM’s mission is to build a shared data layer for the physical world — putting every piece of data back into the real buildings, floors, spaces and assets it belongs to.',
      ],
    },
    biz: {
      eyebrow: 'SCALABLE BUSINESS MODEL',
      title: 'From one-off builds to long-term operations and subscriptions',
    },
    goals: {
      eyebrow: 'PLAN OBJECTIVES',
      title: 'Flagship sites, integrated products, market expansion',
    },
    market: {
      eyebrow: 'MARKET OPPORTUNITY',
      title: 'From building platforms to an enterprise physical world OS',
      note: 'Aiii VBIM 2.0 extends from new builds to upgrades of existing sites, creating long-term operations and subscription revenue.',
    },
    miles: { title: 'Milestones' },
    cta: {
      title: 'Want to see how Aiii VBIM fits your site?',
      contact: 'Contact us',
      partner: 'Become a partner',
    },
  },
};
