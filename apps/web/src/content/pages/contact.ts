// /contact 固定文案：逐字取自 design/pages/Contact.dc.html、en-Contact.dc.html
// 公司名稱、地址、電話、Email、LINE 由後台「全站設定」提供
import type { Locale } from '../../lib/i18n';

export const CONTACT_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { t: string; d: string }[];
    ui: {
      metaTitle: string;
      formTitle: string;
      lineTitle: string;
      lineQrAlt: string;
      lineButton: string;
    };
  }
> = {
  'zh-Hant': {
    eyebrow: 'CONTACT',
    title: '告訴我們你是誰、\n想解決什麼',
    lead: '不論是導入評估、場域 Demo、夥伴合作或認證課程，我們都會由對應的團隊與你聯繫。',
    cards: [
      { t: '導入評估與 Demo', d: '醫院、商場、工廠、辦公、能源與資料中心' },
      { t: '生態夥伴合作', d: '重電、空調、能源、AI 硬體、資安、SI 與工程顧問' },
      { t: 'VBIM 認證學院', d: '個人報名與企業團體培訓' },
    ],
    ui: {
      metaTitle: '聯絡我們',
      formTitle: '預約 Demo／聯絡表單',
      lineTitle: 'LINE 官方帳號',
      lineQrAlt: 'Aiii VBIM LINE 官方帳號 QR Code',
      lineButton: '加入 LINE 好友',
    },
  },
  en: {
    eyebrow: 'CONTACT',
    title: 'Tell us who you are\nand what you need',
    lead: 'Whether it’s an assessment, a site demo, a partnership or the certification program, the right team will get back to you.',
    cards: [
      {
        t: 'Assessments & demos',
        d: 'Hospitals, retail, factories, offices, energy and data centers',
      },
      {
        t: 'Ecosystem partnerships',
        d: 'Power, HVAC, energy, AI hardware, security, SI and consultants',
      },
      { t: 'VBIM Academy', d: 'Individual enrollment and corporate training' },
    ],
    ui: {
      metaTitle: 'Contact',
      formTitle: 'Book a demo / contact form',
      lineTitle: 'LINE Official Account',
      lineQrAlt: 'Aiii VBIM LINE Official Account QR code',
      lineButton: 'Add us on LINE',
    },
  },
};
