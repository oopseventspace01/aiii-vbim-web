// 介面固定文字（導覽、頁尾、按鈕）。文案逐字取自 design/pages/Nav.dc.html、Footer.dc.html。
// 公司名稱、地址等會由 Sanity「全站設定」提供（P3 串接）。
import type { Locale } from '../lib/i18n';

// 2026-11-03 業主指示：「VBIM」改名「Aiii VBIM」、最新消息往前放
export const NAV_ITEMS = [
  { key: 'news', path: '/news', label: { 'zh-Hant': '最新消息', en: 'News' } },
  { key: 'vbim', path: '/vbim', label: { 'zh-Hant': 'Aiii VBIM', en: 'Aiii VBIM' } },
  { key: 'platform', path: '/platform', label: { 'zh-Hant': '平台 OS', en: 'Platform' } },
  { key: 'energy', path: '/energy', label: { 'zh-Hant': '能源 × 空調', en: 'Energy & HVAC' } },
  { key: 'edge', path: '/edge-ai', label: { 'zh-Hant': '地端 AI', en: 'Edge AI' } },
  { key: 'solutions', path: '/solutions', label: { 'zh-Hant': '五大領域', en: 'Sectors' } },
  { key: 'cases', path: '/cases', label: { 'zh-Hant': '案例', en: 'Cases' } },
  { key: 'partners', path: '/partners', label: { 'zh-Hant': '生態夥伴', en: 'Partners' } },
  { key: 'academy', path: '/academy', label: { 'zh-Hant': '認證學院', en: 'Academy' } },
  { key: 'about', path: '/about', label: { 'zh-Hant': '關於我們', en: 'About' } },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['key'] | 'home' | 'contact';

type Label = Record<Locale, string>;
export type MenuLink = { key?: NavKey; path: string; label: Label; sub?: boolean };

/** 手機漢堡選單的分組（2026-11-03 業主指示；桌機導覽列不分組） */
export const MENU_GROUPS: { title: Label; links: MenuLink[] }[] = (() => {
  const nav = (key: NavKey): MenuLink => {
    const item = NAV_ITEMS.find((n) => n.key === key)!;
    return { key, path: item.path, label: item.label };
  };
  return [
    { title: { 'zh-Hant': '最新動態', en: 'Updates' }, links: [nav('news')] },
    {
      title: { 'zh-Hant': '產品與平台', en: 'Products & Platform' },
      links: [
        nav('vbim'),
        {
          path: '/vbim#pmis',
          label: { 'zh-Hant': 'PMIS 工程管理', en: 'PMIS' },
          sub: true,
        },
        nav('platform'),
        nav('energy'),
        nav('edge'),
      ],
    },
    {
      title: { 'zh-Hant': '應用與案例', en: 'Sectors & Cases' },
      links: [nav('solutions'), nav('cases')],
    },
    {
      title: { 'zh-Hant': '生態與學院', en: 'Ecosystem & Academy' },
      links: [nav('partners'), nav('academy')],
    },
    {
      title: { 'zh-Hant': '關於', en: 'About' },
      links: [nav('about'), { path: '/faq', label: { 'zh-Hant': '常見問題', en: 'FAQ' } }],
    },
  ];
})();

export const CONTACT_PATH = '/contact';

type Dict = {
  navLabel: string;
  langLabel: string;
  cta: string;
  openMenu: string;
  closeMenu: string;
  backToTop: string;
  skipToContent: string;
  footerSystem: string;
  footerMotto: string;
  footerCopyright: string;
  footerColumns: { heading: string; links: { label: string; path: string }[] }[];
  comingSoon: string;
  videoInProduction: string;
  mockupLabel: string;
  readMore: string;
};

export const UI: Record<Locale, Dict> = {
  'zh-Hant': {
    navLabel: '主選單',
    langLabel: '語言',
    cta: '預約 Demo',
    openMenu: '開啟選單',
    closeMenu: '關閉選單',
    backToTop: '回到頂部',
    skipToContent: '跳到主要內容',
    footerSystem: 'AI-Powered Physical World Operating System',
    footerMotto: '遠距 × 多點 × 數據智控 × 地端 AI',
    footerCopyright: '© 2026 星宴國際開發股份有限公司／星賀建設股份有限公司 · aiiivbim.com',
    footerColumns: [
      {
        heading: '平台',
        links: [
          { label: 'Aiii VBIM', path: '/vbim' },
          { label: '平台 OS', path: '/platform' },
          { label: '能源 × 空調', path: '/energy' },
          { label: '地端 AI', path: '/edge-ai' },
        ],
      },
      {
        heading: '五大領域',
        links: [
          { label: '醫院・商場', path: '/solutions' },
          { label: '工廠・辦公', path: '/solutions' },
          { label: '能源・算力中心', path: '/solutions' },
        ],
      },
      {
        heading: '生態系',
        links: [
          { label: '成為夥伴', path: '/partners' },
          { label: '認證學院', path: '/academy' },
          { label: '案例', path: '/cases' },
        ],
      },
      {
        heading: '公司',
        links: [
          { label: '關於我們', path: '/about' },
          { label: '最新消息', path: '/news' },
          { label: '常見問題', path: '/faq' },
          { label: '聯絡我們', path: '/contact' },
          { label: '隱私權政策', path: '/privacy' },
        ],
      },
    ],
    comingSoon: 'English version coming soon',
    videoInProduction: '影片製作中',
    mockupLabel: '示意畫面',
    readMore: '看全部 →',
  },
  en: {
    navLabel: 'Main navigation',
    langLabel: 'Language',
    cta: 'Book a Demo',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    backToTop: 'Back to top',
    skipToContent: 'Skip to main content',
    footerSystem: 'AI-Powered Physical World Operating System',
    footerMotto: 'Remote × Multi-site × Data Intelligence × Edge AI',
    footerCopyright:
      '© 2026 Xingyan International Development Co., Ltd. / YIHHUII Co., Ltd. · aiiivbim.com',
    footerColumns: [
      {
        heading: 'Platform',
        links: [
          { label: 'Aiii VBIM', path: '/vbim' },
          { label: 'Platform OS', path: '/platform' },
          { label: 'Energy & HVAC', path: '/energy' },
          { label: 'Edge AI', path: '/edge-ai' },
        ],
      },
      {
        heading: 'Sectors',
        links: [
          { label: 'Hospitals · Retail', path: '/solutions' },
          { label: 'Factories · Offices', path: '/solutions' },
          { label: 'Energy · Data Centers', path: '/solutions' },
        ],
      },
      {
        heading: 'Ecosystem',
        links: [
          { label: 'Become a Partner', path: '/partners' },
          { label: 'VBIM Academy', path: '/academy' },
          { label: 'Cases', path: '/cases' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', path: '/about' },
          { label: 'News', path: '/news' },
          { label: 'FAQ', path: '/faq' },
          { label: 'Contact', path: '/contact' },
          { label: 'Privacy Policy', path: '/privacy' },
        ],
      },
    ],
    comingSoon: 'English version coming soon',
    videoInProduction: 'Video in production',
    mockupLabel: 'Illustrative mockup',
    readMore: 'View all →',
  },
};
