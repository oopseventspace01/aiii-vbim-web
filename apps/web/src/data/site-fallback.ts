// 頁尾公司資訊的預設值：取自 design/pages/Footer.dc.html 與 SPEC 第 15 節。
// P3 起由 Sanity「全站設定」提供；後台某欄位空白時才用這裡的值。
import type { Locale } from '../lib/i18n';

export interface FooterInfo {
  companyName: string;
  address: string;
  phone: string;
  email?: string;
  footerTagline: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  lineOfficialUrl?: string;
  socialLinks?: { platform: string; url: string }[];
}

export const FOOTER_FALLBACK: Record<Locale, FooterInfo> = {
  'zh-Hant': {
    companyName: '星宴國際開發股份有限公司／星賀建設股份有限公司',
    address: '台北市松山區敦化北路 100 號 15 樓',
    phone: '+886-2-2712-3339',
    footerTagline: '以數據驅動建築，創造更高效、更永續的實體世界。',
    appStoreUrl: 'https://apps.apple.com/tw/app/aiii-vbim/id6781813710',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=ai.aiii.vbim',
  },
  en: {
    companyName: 'Xingyan International Development Co., Ltd. / YIHHUII Co., Ltd.',
    address: '15F, No. 100, Dunhua N. Rd., Songshan Dist., Taipei City',
    phone: '+886-2-2712-3339',
    footerTagline: 'Data-driven buildings for a more efficient, more sustainable physical world.',
    appStoreUrl: 'https://apps.apple.com/tw/app/aiii-vbim/id6781813710',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=ai.aiii.vbim',
  },
};
