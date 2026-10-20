// /academy 固定文案：逐字取自 design/pages/Academy.dc.html、en-Academy.dc.html（清單資料見 ../design/Academy.json）
// 「認證標準制定中」依 SPEC 3.7；課程梯次的介面文字為程式另外加的
import type { Locale } from '../../lib/i18n';

export const ACADEMY_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    flow: string;
    lead: string;
    register: string;
    steps: { title: string };
    mods: { eyebrow: string; title: string; lead: string };
    tracks: { title: string; focusLabel: string };
    form: { title: string; lead: string };
    ui: {
      metaTitle: string;
      coursesTitle: string;
      standardsTitle: string;
      standardsPending: string;
      sessionStatus: Record<string, string>;
      seats: string;
      registerExternal: string;
      levels: Record<string, string>;
    };
  }
> = {
  'zh-Hant': {
    eyebrow: 'VBIM ACADEMY',
    title: 'VBIM 認證學院',
    flow: '培訓 → 考核 → 認證 → 媒合',
    lead: 'AI-Ready Building 需要懂建築、懂設備、也懂 AI 的人。VBIM 認證學院培育能把 BIM、能源、空調、影像、AIoT 與地端 AI 落地到真實場域的工程師與夥伴。',
    register: '登記首期招生 →',
    steps: { title: '四步取得認證' },
    mods: {
      eyebrow: 'CURRICULUM',
      title: '六大課程模組',
      lead: '對應 Aiii VBIM 2.0 的完整能力，從建築資料一路學到地端 AI。',
    },
    tracks: { title: '誰適合加入', focusLabel: '重點模組：' },
    form: {
      title: '登記首期招生',
      lead: '首期課程開放報名時，我們會第一時間通知你。企業或單位團體報名，也請在此登記。',
    },
    ui: {
      metaTitle: '認證學院',
      coursesTitle: '課程與梯次',
      standardsTitle: '認證標準',
      standardsPending: '認證標準制定中，歡迎先登記',
      sessionStatus: { open: '開放報名', full: '額滿', upcoming: '即將開課', closed: '已結束' },
      seats: '名額',
      registerExternal: '前往報名',
      levels: { basic: '基礎', advanced: '進階', expert: '專家' },
    },
  },
  en: {
    eyebrow: 'VBIM ACADEMY',
    title: 'VBIM Certification Academy',
    flow: 'Train → Assess → Certify → Match',
    lead: 'AI-Ready Buildings need people who understand buildings, equipment and AI. VBIM Academy develops engineers and partners who can bring BIM, energy, HVAC, video, AIoT and Edge AI to life on real sites.',
    register: 'Register interest →',
    steps: { title: 'Four steps to certification' },
    mods: {
      eyebrow: 'CURRICULUM',
      title: 'Six course modules',
      lead: 'Mapped to the full Aiii VBIM 2.0 capability set — from building data all the way to Edge AI.',
    },
    tracks: { title: 'Who it’s for', focusLabel: 'Key modules: ' },
    form: {
      title: 'Register for the first cohort',
      lead: 'We’ll notify you as soon as enrollment opens. Companies and organizations registering as a group can sign up here too.',
    },
    ui: {
      metaTitle: 'Academy',
      coursesTitle: 'Courses & sessions',
      standardsTitle: 'Certification standards',
      standardsPending: 'Certification standards are being finalized — register your interest now.',
      sessionStatus: { open: 'Open', full: 'Full', upcoming: 'Coming soon', closed: 'Closed' },
      seats: 'Seats',
      registerExternal: 'Register',
      levels: { basic: 'Basic', advanced: 'Advanced', expert: 'Expert' },
    },
  },
};
