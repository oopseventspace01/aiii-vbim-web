// 種子資料（SPEC 第 15 節）。媒體報導文字由 design/pages/News.dc.html 與 en-News.dc.html 逐字轉出，請勿手改文案。
// 純資料，不連線；由 scripts/seed.ts 寫入 Sanity，並由單元測試檢查。

export interface MediaNewsSeed {
  /** 固定代稱：用來產生文件 ID 與網址代稱，重複執行不會重複新增 */
  key: string;
  /** 設計稿上的日期文字（「2026」或「2026.10」） */
  date: string;
  url: string;
  /** design/assets/ 內的封面檔名 */
  cover: string;
  zh: { source: string; title: string; excerpt: string };
  en: { source: string; title: string; excerpt: string };
}

export const MEDIA_NEWS: MediaNewsSeed[] = [
  {
    key: 'codex-devday',
    date: '2026.10',
    url: 'https://www.premiermedia.com.tw/2026100706-2/',
    cover: 'news-codex.jpg',
    zh: {
      source: '頂尖傳媒',
      title:
        'OpenAI Codex 官方 DevDay 登場 OOPS　白天 Coding、晚上 Networking 打造 AI 人才交流聚落',
      excerpt: '串聯工程師、開發者、AI 人才、創業者與科技產業人士的高密度知識交流場景。',
    },
    en: {
      source: 'Premier Media',
      title: 'OpenAI Codex DevDay comes to OOPS — coding by day, networking by night',
      excerpt:
        'A dense knowledge-exchange scene connecting engineers, developers, AI talent, founders and tech leaders.',
    },
  },
  {
    key: 'archi-ai-lifecycle',
    date: '2026',
    url: 'https://www.archi.net.tw/tw/news/news-detail-790.html',
    cover: 'news-archi.jpg',
    zh: {
      source: '建築新聞',
      title: 'AI 驅動建築全生命週期　智慧人居聚焦建築產業新商機',
      excerpt: '從都市更新、數位孿生、BIM 到智慧綠建築，探討 AI 如何串聯規劃、設計、施工與營運。',
    },
    en: {
      source: 'Archi News',
      title: 'AI across the building lifecycle: new business in smart living',
      excerpt:
        'From urban renewal, digital twins and BIM to smart green buildings — how AI connects planning, design, construction and operations.',
    },
  },
  {
    key: 'yahoo-digital-twin',
    date: '2026.06',
    url: 'https://tw.news.yahoo.com/%E6%95%B8%E4%BD%8D%E5%AD%BF%E7%94%9F%E9%87%8D%E5%A1%91%E5%BB%BA%E7%AF%89%E6%9C%AA%E4%BE%86-aiii-vbim%E5%BC%95%E9%A0%98%E6%96%B0%E6%99%82%E4%BB%A3-031454152.html',
    cover: 'world.jpg',
    zh: {
      source: 'Yahoo News',
      title: '數位孿生重塑建築未來　Aiii VBIM 引領新時代',
      excerpt:
        '未來建築的競爭關鍵，是透過數據持續經營，讓建築成為具有感知、分析與管理能力的智慧資產。',
    },
    en: {
      source: 'Yahoo News',
      title: 'Digital twins reshape the future of buildings — Aiii VBIM leads a new era',
      excerpt:
        'The edge in future construction is running buildings on data, making them smart assets that sense, analyze and manage.',
    },
  },
  {
    key: 'presidential-office',
    date: '2026',
    url: 'https://www.president.gov.tw/NEWS/40132',
    cover: 'news-president.jpg',
    zh: {
      source: '中華民國總統府',
      title: '星宴國際 Aiii VBIM 隨亞太再生醫學會拜會總統府',
      excerpt: '參與再生醫療產業交流，見證臺灣再生醫療邁向制度化與法制化的新時代。',
    },
    en: {
      source: 'Office of the President, R.O.C.',
      title:
        'Aiii VBIM joins the Asia-Pacific regenerative medicine delegation at the Presidential Office',
      excerpt:
        'Part of an industry exchange as Taiwan’s regenerative medicine enters a new regulatory era.',
    },
  },
  {
    key: 'ettoday-yiyao',
    date: '2026.06',
    url: 'https://finance.ettoday.net/news/3178283',
    cover: 'news-ettoday.jpg',
    zh: {
      source: 'ETtoday 財經雲',
      title: '一曜再生打進輝達生態圈　攻人源外泌體市場',
      excerpt:
        'COMPUTEX 期間國際生技創新交流活動，一曜再生正式加入 Aiii VBIM 國際戰略合作夥伴生態系。',
    },
    en: {
      source: 'ETtoday Finance',
      title: 'Yi-Yao Regenerative enters the NVIDIA ecosystem',
      excerpt:
        'At a COMPUTEX biotech innovation event, Yi-Yao Regenerative joined the Aiii VBIM international strategic partner ecosystem.',
    },
  },
  {
    key: 'yahoo-xingyan-platform',
    date: '2026',
    url: 'https://tw.news.yahoo.com/%E6%98%9F%E5%AE%B4%E5%9C%8B%E9%9A%9B%E9%96%8B%E7%99%BC%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E6%89%93%E9%80%A0-aiii-vbim-%E6%95%B8%E4%BD%8D%E5%AD%BF%E7%94%9F%E5%B9%B3%E5%8F%B0-054733615.html',
    cover: 'news-yahoo-star.jpg',
    zh: {
      source: 'Yahoo News',
      title: '星宴國際開發打造 Aiii VBIM 數位孿生平台',
      excerpt: '讓台灣的資金、技術與管理經驗跨越國界，掌握全球資產，打造超級戰情室。',
    },
    en: {
      source: 'Yahoo News',
      title: 'Xingyan International builds the Aiii VBIM digital twin platform',
      excerpt:
        'Taking Taiwan’s capital, technology and management know-how global — with a super command center for worldwide assets.',
    },
  },
  {
    key: 'healthcare-expo-2025',
    date: '2025.12',
    url: 'https://www.premiermedia.com.tw/2025120506-2/',
    cover: 'news-medtech.jpg',
    zh: {
      source: '頂尖傳媒',
      title: 'Aiii VBIM 與 Aiii RMS 亮相 2025 台灣醫療科技展',
      excerpt:
        '星宴國際 × 星創科技 × 星賀建設共同開發，攜手一曜再生醫學、遠傳電信展現智慧醫院完整生態系。',
    },
    en: {
      source: 'Premier Media',
      title: 'Aiii VBIM and Aiii RMS at Healthcare+ Expo Taiwan 2025',
      excerpt:
        'Co-developed by Xingyan International, Xingchuang Technology and YIHHUII Construction, showcasing a complete smart hospital ecosystem.',
    },
  },
  {
    key: 'starlight-program',
    date: '2025.11',
    url: 'https://www.premiermedia.com.tw/2025110303-2/',
    cover: 'news-fanxing.jpg',
    zh: {
      source: '頂尖傳媒',
      title: 'Aiii VBIM 系統說明會暨繁星計劃展示活動圓滿成功',
      excerpt: '匯聚建築、醫療、能源、科技與再生產業領袖，分享繁星計劃的開放合作理念。',
    },
    en: {
      source: 'Premier Media',
      title: 'Aiii VBIM launch event and Starlight Program showcase',
      excerpt:
        'Leaders from construction, healthcare, energy, technology and regenerative medicine gathered to share the program’s open-collaboration vision.',
    },
  },
  {
    key: 'abri-net-zero-showcase',
    date: '2025.09',
    url: 'https://www.abri.gov.tw/News_Content.aspx?n=752&sms=9451&s=331397',
    cover: 'news-abri.jpg',
    zh: {
      source: '內政部建築研究所',
      title: '智慧節能減碳創新技術宣導推廣活動',
      excerpt: '公私協力領航近零碳建築發展，產官學研共同推動淨零轉型。',
    },
    en: {
      source: 'Architecture & Building Research Institute, MOI',
      title: 'Smart energy-saving and carbon-reduction innovation showcase',
      excerpt: 'Public–private partnership leading near-zero-carbon building development.',
    },
  },
  {
    key: 'udn-net-zero',
    date: '2025.09',
    url: 'https://money.udn.com/money/story/5635/8986412',
    cover: 'news-udn-netzero.jpg',
    zh: {
      source: '經濟日報',
      title: '智慧節能減碳推廣活動登場　產官學研齊聚共探淨零建築新未來',
      excerpt: '交流淨零建築最新技術、挑戰與實務解方，分享標竿案例與應用經驗。',
    },
    en: {
      source: 'Economic Daily News',
      title: 'Industry, government and academia explore the future of net-zero buildings',
      excerpt:
        'Sharing the latest net-zero building technologies, challenges, solutions and flagship cases.',
    },
  },
  {
    key: 'udn-us-investment',
    date: '2025',
    url: 'https://money.udn.com/money/story/5612/8939306',
    cover: 'news-udn-trump.jpg',
    zh: {
      source: '經濟日報',
      title: '川普促投資美國成趨勢　靠一系統輕鬆擴國設廠',
      excerpt: '赴美設廠成為趨勢，Aiii VBIM 協助企業克服跨國設廠的管理難題。',
    },
    en: {
      source: 'Economic Daily News',
      title: 'Investing in the US: one system to make overseas plant build-outs easier',
      excerpt:
        'As US plant build-outs become a trend, Aiii VBIM helps companies manage cross-border construction.',
    },
  },
  {
    key: 'taiwan-to-arizona',
    date: '2025.09',
    url: 'https://www.premiermedia.com.tw/2025090103-2/',
    cover: 'news-arizona.jpg',
    zh: {
      source: '頂尖傳媒',
      title: 'AI 時代新契機！從台灣到亞利桑那　第六代 Aiii VBIM 引領產業跨域升級',
      excerpt: '從工廠製造到倉儲、物流與供應鏈，帶動新一波產業聚落與投資機會。',
    },
    en: {
      source: 'Premier Media',
      title: 'From Taiwan to Arizona: 6th-gen Aiii VBIM drives cross-industry upgrades',
      excerpt:
        'From manufacturing to warehousing, logistics and supply chains — a new wave of industry clusters and investment.',
    },
  },
  {
    key: 'pchome-tariff',
    date: '2025.08',
    url: 'https://news.pchome.com.tw/living/mypeople/20250813/index-75507426251284219009.html',
    cover: 'news-pchome.jpg',
    zh: {
      source: 'Yahoo News／PChome',
      title: '智慧建築迎戰川普關稅衝擊　V-BIM 系統打造跨國設廠全方位解決方案',
      excerpt: '智慧建築技術正成為跨國企業設廠的關鍵助力。',
    },
    en: {
      source: 'Yahoo News / PChome',
      title: 'Smart buildings vs. tariff shocks: V-BIM for cross-border plant build-outs',
      excerpt:
        'Smart building technology is becoming a key enabler for multinational plant construction.',
    },
  },
];

/**
 * 設計稿的日期只有「年」或「年.月」，Sanity 的發布時間需要完整時間。
 * 這裡產生「只用來排序」的時間：照設計稿順序由新到舊遞減，網站顯示的是 displayDate（原始文字）。
 * 業主之後可在後台改成正確的發布時間。
 */
export function sortableDates(labels: string[]): string[] {
  const HOUR = 3_600_000;
  let prev = Number.POSITIVE_INFINITY;
  return labels.map((label) => {
    const [year, month] = label.split('.');
    const known = month
      ? Date.UTC(Number(year), Number(month) - 1, 1)
      : Date.UTC(Number(year), 11, 31);
    const time = Math.min(known, prev - HOUR);
    prev = time;
    return new Date(time).toISOString();
  });
}

export interface SiteSettingsSeed {
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  heroPosterAlt: string;
  proofItems: { label: string; value: string }[];
  companyName: string;
  address: string;
  phone: string;
  email: string;
  footerTagline: string;
  metaTitle: string;
  metaDescription: string;
}

// SPEC 第 15 節公司資訊；Hero 與背書條文字取自 design/pages/Main.dc.html、en-Main.dc.html；
// 頁尾標語取自 design/pages/Footer.dc.html
export const APP_LINKS = {
  appStoreUrl: 'https://apps.apple.com/tw/app/aiii-vbim/id6781813710',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=ai.aiii.vbim',
};

export const HERO_POSTER_FILE = 'hero-building.jpg';

export const SITE_SETTINGS: Record<'zh' | 'en', SiteSettingsSeed> = {
  zh: {
    heroTitle: 'One OS. Every Building. Every System.',
    heroSubtitle: '從 BIM／PMIS 升級為企業實體世界營運 OS',
    heroBody:
      '以建築為核心，串聯設計、施工、設備、能源、空調、影像與地端 AI，延伸醫院、商場、工廠、辦公與能源五大領域。讓管理者看得到、看得懂、可預測、可控制、可優化。',
    heroPosterAlt: 'Aiii VBIM 建築數位孿生示意：建築本體、數位孿生、營運管理、AI 智慧決策四層',
    proofItems: [
      { label: '全生命週期', value: '設計 → 施工 → 驗收 → 營運' },
      { label: '跨國多點', value: '一個平台管理全球據點' },
      { label: '地端 AI', value: '資料不離場，AI 照樣聰明' },
      { label: '隨身管理', value: 'Aiii VBIM App（iOS・Android）' },
    ],
    companyName: '星宴國際開發股份有限公司／星賀建設股份有限公司',
    address: '台北市松山區敦化北路 100 號 15 樓',
    phone: '02-2712-3339',
    email: 'nickleo051216@gmail.com',
    footerTagline: '以數據驅動建築，創造更高效、更永續的實體世界。',
    metaTitle: 'Aiii VBIM OS 2.0',
    metaDescription: '建築、設備、能源與 AI 的共同作業系統',
  },
  en: {
    heroTitle: 'One OS. Every Building. Every System.',
    heroSubtitle: 'From BIM / PMIS to the operating system for your physical world',
    heroBody:
      'With the building at its core, Aiii VBIM connects design, construction, equipment, energy, HVAC, video and Edge AI — extending into hospitals, retail, factories, offices and energy. So you can see it, understand it, predict it, control it and optimize it.',
    heroPosterAlt: 'Aiii VBIM digital twin: building, twin, operations and AI decision layers',
    proofItems: [
      { label: 'Full lifecycle', value: 'Design → Build → Commission → Operate' },
      { label: 'Global, multi-site', value: 'One platform for every site worldwide' },
      { label: 'Edge AI', value: 'Your data stays on-site' },
      { label: 'On the go', value: 'Aiii VBIM App (iOS · Android)' },
    ],
    companyName: 'Xingyan International Development Co., Ltd. / YIHHUII Co., Ltd.',
    address: '15F, No. 100, Dunhua N. Rd., Songshan Dist., Taipei City',
    phone: '+886-2-2712-3339',
    email: 'nickleo051216@gmail.com',
    footerTagline: 'Data-driven buildings for a more efficient, more sustainable physical world.',
    metaTitle: 'Aiii VBIM OS 2.0',
    metaDescription: 'From BIM / PMIS to the operating system for your physical world',
  },
};
