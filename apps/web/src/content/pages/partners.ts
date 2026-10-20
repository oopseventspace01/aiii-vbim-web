// /partners 固定文案：逐字取自 design/pages/Partners.dc.html、en-Partners.dc.html（清單資料見 ../design/Partners.json）
// 表單欄位文字於 P5 製作表單時使用
import type { Locale } from '../../lib/i18n';

export const PARTNERS_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    apply: string;
    academy: string;
    heroAlt: string;
    types: { title: string; lead: string; columns: [string, string, string] };
    tiers: { title: string };
    spec: { eyebrow: string; title: string; text: string; revenue: string };
    process: { title: string; steps: { no: string; t: string; d: string }[] };
    form: { eyebrow: string; title: string; lead: string };
    ui: {
      metaTitle: string;
      logosTitle: string;
      postersTitle: string;
      posterAlt: { medical: string; tool: string };
    };
  }
> = {
  'zh-Hant': {
    eyebrow: 'AN OPEN ECOSYSTEM FOR A SMARTER PHYSICAL WORLD',
    title: 'Build on Aiii VBIM',
    subtitle: '你的設備、技術與服務，都可以接進 Aiii VBIM',
    body: 'Aiii VBIM 不必製造所有設備，而是成為設備、系統與服務的共同作業系統。任何能源設備、空調系統、AI Edge、攝影機與感測器，都能透過標準介面納入 Aiii VBIM，出現在每一個導入的場域。',
    apply: '申請成為夥伴 →',
    academy: '了解認證學院',
    heroAlt: 'Aiii VBIM 平台生態系示意',
    types: {
      title: '從專案外包，升級為產品生態系',
      lead: 'Aiii VBIM 掌握平台、資料模型與解決方案；專業硬體與設備由生態系夥伴提供，透過標準介面納入。',
      columns: ['夥伴類型', '可整合內容', '合作模式'],
    },
    tiers: { title: '五種加入方式' },
    spec: {
      eyebrow: 'SPECIFICATION CHANNEL',
      title: '讓你的產品被寫進建築規範',
      text: 'Aiii VBIM 連結建築師、工程顧問、機電顧問、PMC、業主、營造與物業的決策鏈，讓設備與 AI 基礎建設在設計階段就被列入規範與設備表。',
      revenue: '設計收入 ＋ 工程收入 ＋ 硬體收入 ＋ SaaS ＋ 維運收入',
    },
    process: {
      title: '加入流程',
      steps: [
        { no: '01', t: '線上申請', d: '填寫公司與技術資料' },
        { no: '02', t: '技術對接', d: 'Partner Integration API、設備資料標準、協定確認' },
        { no: '03', t: 'POC 驗證', d: '在示範場域共同驗證' },
        { no: '04', t: '共同上市', d: '列入生態系，共同提案與銷售' },
      ],
    },
    form: {
      eyebrow: 'APPLY',
      title: '申請成為生態夥伴',
      lead: '送出後，我們會與你聯繫並安排技術對接會議。',
    },
    ui: {
      metaTitle: '生態夥伴',
      logosTitle: '生態系夥伴',
      postersTitle: '歡迎各類設備商加入',
      posterAlt: {
        medical: '醫療設備商加入 Aiii VBIM OS 生態：數位轉型升級，創造更大價值',
        tool: '工具設備商加入 Aiii VBIM OS 生態：數位轉型升級，創造更大價值',
      },
    },
  },
  en: {
    eyebrow: 'AN OPEN ECOSYSTEM FOR A SMARTER PHYSICAL WORLD',
    title: 'Build on Aiii VBIM',
    subtitle: 'Your equipment, technology and services can all connect to Aiii VBIM',
    body: 'Aiii VBIM doesn’t build every device — it becomes the shared operating system for them. Energy equipment, HVAC systems, AI edge hardware, cameras and sensors connect through standard interfaces and show up in every site that deploys VBIM.',
    apply: 'Apply to partner →',
    academy: 'VBIM Academy',
    heroAlt: 'The Aiii VBIM platform ecosystem',
    types: {
      title: 'From project subcontracting to a product ecosystem',
      lead: 'Aiii VBIM owns the platform, data model and solutions; specialist hardware and equipment come from ecosystem partners through standard interfaces.',
      columns: ['Partner type', 'What integrates', 'How we work together'],
    },
    tiers: { title: 'Five ways to join' },
    spec: {
      eyebrow: 'SPECIFICATION CHANNEL',
      title: 'Get your product written into building specs',
      text: 'Aiii VBIM connects the decision chain — architects, engineering and MEP consultants, PMCs, owners, contractors and facility managers — so equipment and AI infrastructure are specified at the design stage.',
      revenue: 'Design + construction + hardware + SaaS + O&M revenue',
    },
    process: {
      title: 'How to join',
      steps: [
        { no: '01', t: 'Apply online', d: 'Share your company and technology details' },
        {
          no: '02',
          t: 'Technical integration',
          d: 'Partner Integration API, device data standards and protocols',
        },
        { no: '03', t: 'POC validation', d: 'Validate together at a demonstration site' },
        {
          no: '04',
          t: 'Go to market together',
          d: 'Joint proposals and sales across the ecosystem',
        },
      ],
    },
    form: {
      eyebrow: 'APPLY',
      title: 'Apply to become a partner',
      lead: 'We’ll get in touch to set up a technical integration meeting.',
    },
    ui: {
      metaTitle: 'Partners',
      logosTitle: 'Ecosystem partners',
      postersTitle: '',
      posterAlt: { medical: '', tool: '' },
    },
  },
};
