// ⚠️ MOCK：元件展示頁（/dev/zh-Hant、/dev/en）專用的假資料，只在開發時使用。
// 不可匯入正式頁面、不可寫進 Sanity。凡是之後由後台提供的內容（消息、夥伴）一律標示 [MOCK]。
// 固定文案（Hero、流程、路徑等）取自 design/pages，與正式文案相同。
import type { Locale } from '../lib/i18n';

export const MOCK_NEWS = (locale: Locale) => [
  {
    title: locale === 'en' ? '[MOCK] Sample news with a cover image' : '[MOCK] 有封面的範例消息',
    category: 'news',
    dateLabel: '2026.10.20',
    slug: 'mock-with-cover',
    hasCover: true,
  },
  {
    title:
      locale === 'en'
        ? '[MOCK] Sample media item without a cover'
        : '[MOCK] 沒有封面的範例媒體報導',
    category: 'media',
    source: 'Mock Media',
    dateLabel: '2026.06',
    externalUrl: 'https://example.com/',
    hasCover: false,
  },
  {
    title: locale === 'en' ? '[MOCK] Sample event without a cover' : '[MOCK] 沒有封面的範例活動',
    category: 'event',
    dateLabel: '2026',
    slug: 'mock-event',
    hasCover: false,
  },
];

export const MOCK_PARTNERS = [
  { name: '[MOCK] Partner A' },
  { name: '[MOCK] Partner B' },
  { name: '[MOCK] Partner C' },
];

// 以下為設計稿固定文案（design/pages/Main.dc.html、en-Main.dc.html）
export const HERO_COPY = {
  'zh-Hant': {
    eyebrow: 'AIII VBIM 2.0 · AI-POWERED PHYSICAL WORLD OS',
    titleLines: ['One OS.', 'Every Building.', 'Every System.'],
    subtitle: '從 BIM／PMIS 升級為企業實體世界營運 OS',
    body: '以建築為核心，串聯設計、施工、設備、能源、空調、影像與地端 AI，延伸醫院、商場、工廠、辦公與能源五大領域。讓管理者看得到、看得懂、可預測、可控制、可優化。',
    pills: ['遠距', '多點', '數據智控', '360° 上帝視角', '超級戰情室', 'AI 可信'],
    entries: [
      {
        label: '我是業主／企業',
        title: '預約導入 Demo →',
        path: '/contact?role=owner',
        primary: true,
      },
      { label: '我是設備商／SI／技術夥伴', title: '加入生態系 →', path: '/partners' },
    ],
    heroAlt: 'Aiii VBIM 建築數位孿生示意：建築本體、數位孿生、營運管理、AI 智慧決策四層',
    verbs: ['看得到', '看得懂', '可預測', '可控制', '可優化'],
    path: [
      { en: 'Global', zh: '全球' },
      { en: 'Site', zh: '據點' },
      { en: 'Building', zh: '建築' },
      { en: 'Floor', zh: '樓層' },
      { en: 'Space', zh: '空間' },
      { en: 'Asset', zh: '資產' },
      { en: 'Sensor', zh: '感測器' },
    ],
  },
  en: {
    eyebrow: 'AIII VBIM 2.0 · AI-POWERED PHYSICAL WORLD OS',
    titleLines: ['One OS.', 'Every Building.', 'Every System.'],
    subtitle: 'From BIM / PMIS to the operating system for your physical world',
    body: 'With the building at its core, Aiii VBIM connects design, construction, equipment, energy, HVAC, video and Edge AI — extending into hospitals, retail, factories, offices and energy. So you can see it, understand it, predict it, control it and optimize it.',
    pills: [
      'Remote',
      'Multi-site',
      'Data Intelligence',
      '360° God’s-Eye View',
      'Super Command Center',
      'Trustworthy AI',
    ],
    entries: [
      {
        label: 'For owners & enterprises',
        title: 'Book a Demo →',
        path: '/contact?role=owner',
        primary: true,
      },
      {
        label: 'For vendors, SIs & tech partners',
        title: 'Join the Ecosystem →',
        path: '/partners',
      },
    ],
    heroAlt: 'Aiii VBIM digital twin: building, twin, operations and AI decision layers',
    verbs: ['See', 'Understand', 'Predict', 'Control', 'Optimize'],
    path: [
      { en: 'Global' },
      { en: 'Site' },
      { en: 'Building' },
      { en: 'Floor' },
      { en: 'Space' },
      { en: 'Asset' },
      { en: 'Sensor' },
    ],
  },
} as const;

/** [MOCK] 內文範例：測試段落、標題、清單、連結、YouTube、按鈕的呈現 */
export const MOCK_RICH_TEXT = [
  {
    _type: 'block',
    _key: 'b1',
    style: 'h2',
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text: '[MOCK] 內文大標題', marks: [] }],
  },
  {
    _type: 'block',
    _key: 'b2',
    style: 'normal',
    markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com/' }],
    children: [
      { _type: 'span', _key: 's2', text: '[MOCK] 段落文字，含 ', marks: [] },
      { _type: 'span', _key: 's3', text: '粗體', marks: ['strong'] },
      { _type: 'span', _key: 's4', text: ' 與 ', marks: [] },
      { _type: 'span', _key: 's5', text: '外部連結', marks: ['l1'] },
    ],
  },
  {
    _type: 'block',
    _key: 'b3',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: 's6', text: '[MOCK] 清單項目一', marks: [] }],
  },
  {
    _type: 'block',
    _key: 'b4',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: 's7', text: '[MOCK] 清單項目二', marks: [] }],
  },
  { _type: 'youtube', _key: 'y1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { _type: 'ctaButton', _key: 'c1', label: '[MOCK] 內文按鈕', url: '/contact' },
];
