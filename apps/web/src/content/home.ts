// 首頁固定文案：逐字取自 design/pages/Main.dc.html 與 en-Main.dc.html（請勿自行改寫）。
// 需要每週更新的內容（Hero 標語、背書條、最新消息、公司資訊）改由 Sanity 提供，不在這裡。
import type { Locale } from '../lib/i18n';

export interface HomeCopy {
  eyebrow: string;
  pills: string[];
  entries: { label: string; title: string; path: string; primary?: boolean }[];
  proofLabel: string;
  positioning: {
    eyebrow: string;
    title: string;
    lead: string;
    stack: { no: string; t: string; d: string }[];
    verbs: string[];
    verbsLabel: string;
  };
  capabilities: {
    eyebrow: string;
    title: string;
    cards: {
      title: string;
      text: string;
      link: string;
      path: string;
      image: 'energy' | 'hvac' | 'edge';
      alt: string;
    }[];
  };
  sectors: {
    eyebrow: string;
    title: string;
    action: string;
    items: { key: string; en?: string; title: string; items: string }[];
    footnote: string;
  };
  seb: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { k: string; role: string; sys: string; d: string }[];
  };
  command: {
    eyebrow: string;
    title: string;
    lead: string;
    imageAlt: string;
    path: { en: string; zh?: string }[];
    pathLabel: string;
    features: { t: string; d: string }[];
  };
  ecosystem: {
    eyebrow: string;
    title: string;
    strong: string;
    text: string;
    primary: string;
    secondary: string;
    imageAlt: string;
  };
  academy: { eyebrow: string; title: string; text: string; modules: string; cta: string };
  news: { title: string; viewAll: string; product: string; media: string; empty: string };
  cta: { title: string; text: string; primary: string; secondary: string };
}

export const HOME: Record<Locale, HomeCopy> = {
  'zh-Hant': {
    eyebrow: 'AIII VBIM 2.0 · AI-POWERED PHYSICAL WORLD OS',
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
    proofLabel: '信任背書',
    positioning: {
      eyebrow: 'EVOLVE FROM TOOLS TO AN INTELLIGENT OPERATING SYSTEM',
      title: '核心定位：不是再多一套系統，\n而是讓所有系統接得起來',
      lead: 'BMS 管設備、EMS 管能源、VMS 管影像，每套系統各管一塊。Aiii VBIM 以 BIM／數位孿生與 PMIS 為空間主索引，把每一筆資料放回「哪一棟、哪一層、哪一個空間、哪一台設備」。',
      stack: [
        { no: '01', t: '2D／3D／BIM', d: '建築資訊模型與設計協作' },
        { no: '02', t: 'PMIS 工程管理', d: '專案、進度、成本、品質' },
        { no: '03', t: 'VMS／AIoT 數據整合', d: '設備、感測、影像、平台' },
        { no: '04', t: '能源／空調／潔淨', d: 'Energy・HVAC・Clean System' },
        { no: '05', t: 'Edge AI／AI Agent／Command Center', d: '邊緣智能、智能代理、營運中樞' },
      ],
      verbs: ['看得到', '看得懂', '可預測', '可控制', '可優化'],
      verbsLabel: '管理價值',
    },
    capabilities: {
      eyebrow: 'CORE CAPABILITIES',
      title: '從空間、設備到營運的三大能力模組',
      cards: [
        {
          title: '智慧能源管理',
          text: '風力、太陽能、儲能與算力中心的整合智控。從供電到用電，建立全域能源可視化與智慧優化。',
          link: '了解能源管理 →',
          path: '/energy',
          image: 'energy',
          alt: '智慧能源管理示意：風力、太陽能、儲能、台電重電與算力中心',
        },
        {
          title: '中央空調節能 × 潔淨',
          text: '把空調控制與潔淨環境管理，轉化為可計算、可優化的營運能力。kW/RT、COP 效率優化，兼顧舒適、安全與節能。',
          link: '了解空調潔淨 →',
          path: '/energy',
          image: 'hvac',
          alt: '中央空調與潔淨系統示意：冰水主機、冷卻水塔、AHU、感測器與潔淨空間',
        },
        {
          title: '地端 AI 解決方案',
          text: 'Edge AI Appliance + AI Agent。即時推論、低延遲、資料主權，讓 AI 不只看見資料，更能理解場域並協助決策。',
          link: '了解地端 AI →',
          path: '/edge-ai',
          image: 'edge',
          alt: '地端 AI 解決方案示意：智慧園區與 Edge AI',
        },
      ],
    },
    sectors: {
      eyebrow: 'FIVE KEY SECTORS',
      title: '以建築為核心，延伸五大應用場域',
      action: '看五大領域方案 →',
      items: [
        { key: 'hospital', en: 'HOSPITAL', title: '醫院', items: '病房・設備・醫療氣體' },
        { key: 'retail', en: 'RETAIL', title: '商場', items: 'POS・人流・停車・租戶' },
        { key: 'factory', en: 'FACTORY', title: '工廠', items: '設備・稼動率・工安・庫存' },
        { key: 'office', en: 'OFFICE', title: '辦公', items: '空間・設備・能源・維運' },
        { key: 'energy', en: 'ENERGY', title: '能源', items: '風力・太陽能・儲能・算力中心' },
      ],
      footnote: '以數據串聯空間、設備與人，驅動更高效、更永續的建築與城市。',
    },
    seb: {
      eyebrow: "360° GOD'S-EYE VIEW",
      title: '天・地・腦・中樞：\n建築的 360° 上帝視角',
      lead: '用一套業主、建築師與顧問都聽得懂的語言，把影像、感測、設備、AI 與營運管理交代清楚。',
      items: [
        {
          k: '天',
          role: '建築的眼睛',
          sys: 'Camera・VMS・Vision AI',
          d: '看見人、車、設備、安全與異常',
        },
        {
          k: '地',
          role: '建築的神經',
          sys: 'AIoT・Sensor・Meter・Controller',
          d: '感知電、水、溫度、壓力、振動與設備狀態',
        },
        {
          k: '腦',
          role: '建築的大腦',
          sys: 'Edge AI・Local AI',
          d: '分析、判斷、預測、RAG、Agent、Vision AI',
        },
        { k: '中樞', role: '建築作業系統', sys: 'Aiii VBIM', d: '360° 上帝視角管理平台' },
        {
          k: '身體',
          role: '機電與能源設備',
          sys: 'Building・Equipment',
          d: '重電、HVAC、儲能、太陽能與現場設備',
        },
      ],
    },
    command: {
      eyebrow: 'GLOBAL COMMAND CENTER',
      title: '遠距多點數據智控',
      lead: '讓總部即時掌握全球據點的工程、設備、能源與營運狀態。',
      imageAlt: '全球據點連線示意：北美、歐洲、中東、亞洲、大洋洲、非洲與南美',
      path: [
        { en: 'Global', zh: '全球' },
        { en: 'Site', zh: '據點' },
        { en: 'Building', zh: '建築' },
        { en: 'Floor', zh: '樓層' },
        { en: 'Space', zh: '空間' },
        { en: 'Asset', zh: '資產' },
        { en: 'Sensor', zh: '感測器' },
      ],
      pathLabel: '管理層級',
      features: [
        { t: '跨國設廠／多廠區管理', d: '統一平台・彈性擴展' },
        { t: '即時儀表板／事件告警', d: '數據可視・快速應變' },
        { t: '遠距協同／派工維運', d: '跨域合作・提升效率' },
        { t: '管理層上帝視角', d: '全域洞察・精準決策' },
      ],
    },
    ecosystem: {
      eyebrow: 'AN OPEN ECOSYSTEM',
      title: '平台生態系',
      strong: '以 Aiii VBIM 為核心，串聯工程、設備、能源與 AI。',
      text: 'PMIS、數位孿生、影像 AI、能源、空調、潔淨、Edge AI、資安與 AI Agent，全部接進同一個平台。設備商、工程商、能源、AI、資安與 SI 夥伴，都可以把自己的技術接進 Aiii VBIM。',
      primary: '成為生態夥伴 →',
      secondary: '看平台架構',
      imageAlt:
        'Aiii VBIM 平台生態系：PMIS、數位孿生、VMS／AI Vision、能源、暖通空調、潔淨系統、Edge AI、資安、AI Agent 環繞核心平台',
    },
    academy: {
      eyebrow: 'VBIM ACADEMY',
      title: 'VBIM 認證學院',
      text: '培訓、考核、認證、媒合。成為 VBIM 認證工程師或認證夥伴，承接智慧建築、能源、空調與地端 AI 專案。',
      modules: '六大課程模組：BIM／PMIS・Energy・HVAC・Vision・AIoT・Edge AI',
      cta: '登記首期招生 →',
    },
    news: {
      title: '最新消息',
      viewAll: '看全部 →',
      product: '產品發表',
      media: '媒體報導',
      empty: '目前沒有消息',
    },
    cta: {
      title: 'From Data to a Better Physical World.',
      text: '告訴我們你的場域與挑戰，我們用 Aiii VBIM 實際示範給你看。',
      primary: '預約 Demo',
      secondary: '成為夥伴',
    },
  },
  en: {
    eyebrow: 'AIII VBIM 2.0 · AI-POWERED PHYSICAL WORLD OS',
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
    proofLabel: 'Proof points',
    positioning: {
      eyebrow: 'EVOLVE FROM TOOLS TO AN INTELLIGENT OPERATING SYSTEM',
      title: 'Not another system —\nthe one that connects them all',
      lead: 'BMS runs equipment, EMS runs energy, VMS runs video — each in its own silo. Aiii VBIM uses BIM, the digital twin and PMIS as the spatial index, placing every data point back where it belongs: which building, which floor, which room, which asset.',
      stack: [
        {
          no: '01',
          t: '2D / 3D / BIM',
          d: 'Building information modeling and design collaboration',
        },
        { no: '02', t: 'PMIS', d: 'Projects, schedule, cost and quality' },
        { no: '03', t: 'VMS / AIoT Integration', d: 'Equipment, sensors, video and platforms' },
        { no: '04', t: 'Energy / HVAC / Clean', d: 'Energy · HVAC · Clean System' },
        {
          no: '05',
          t: 'Edge AI / AI Agent / Command Center',
          d: 'Edge intelligence, agents and the operations hub',
        },
      ],
      verbs: ['See', 'Understand', 'Predict', 'Control', 'Optimize'],
      verbsLabel: 'Management value',
    },
    capabilities: {
      eyebrow: 'CORE CAPABILITIES',
      title: 'Three capability modules, from space and equipment to operations',
      cards: [
        {
          title: 'Smart Energy Management',
          text: 'Integrated control of wind, solar, storage and compute centers — full visibility and optimization from supply to demand.',
          link: 'Explore energy →',
          path: '/energy',
          image: 'energy',
          alt: 'Smart energy: wind, solar, storage, grid and compute center',
        },
        {
          title: 'HVAC Efficiency × Clean Environment',
          text: 'Turn HVAC control and cleanroom management into measurable, optimizable operations — kW/RT and COP optimization balancing comfort, safety and savings.',
          link: 'Explore HVAC →',
          path: '/energy',
          image: 'hvac',
          alt: 'Central HVAC and cleanroom: chillers, cooling towers, AHUs and sensors',
        },
        {
          title: 'Edge AI Solutions',
          text: 'Edge AI Appliance + AI Agent. Real-time inference, low latency and data sovereignty — AI that understands your site and supports decisions.',
          link: 'Explore Edge AI →',
          path: '/edge-ai',
          image: 'edge',
          alt: 'Edge AI for smart campuses',
        },
      ],
    },
    sectors: {
      eyebrow: 'FIVE KEY SECTORS',
      title: 'Building at the core, five sectors in reach',
      action: 'See sector solutions →',
      items: [
        { key: 'hospital', title: 'Hospitals', items: 'Wards · equipment · medical gas' },
        { key: 'retail', title: 'Retail', items: 'POS · footfall · parking · tenants' },
        { key: 'factory', title: 'Factories', items: 'Equipment · OEE · safety · inventory' },
        { key: 'office', title: 'Offices', items: 'Space · equipment · energy · O&M' },
        { key: 'energy', title: 'Energy', items: 'Wind · solar · storage · compute centers' },
      ],
      footnote:
        'Connecting spaces, equipment and people with data — for more efficient, more sustainable buildings and cities.',
    },
    seb: {
      eyebrow: "360° GOD'S-EYE VIEW",
      title: 'Eyes, Nerves, Brain, Hub:\na 360° view of your building',
      lead: 'A simple language owners, architects and consultants all understand — tying together video, sensing, equipment, AI and operations.',
      items: [
        {
          k: 'Eyes',
          role: 'Sees the building',
          sys: 'Camera · VMS · Vision AI',
          d: 'People, vehicles, equipment, safety and anomalies',
        },
        {
          k: 'Nerves',
          role: 'Feels the building',
          sys: 'AIoT · Sensor · Meter · Controller',
          d: 'Power, water, temperature, pressure, vibration and asset status',
        },
        {
          k: 'Brain',
          role: 'Thinks for the building',
          sys: 'Edge AI · Local AI',
          d: 'Analysis, prediction, RAG, agents and vision AI',
        },
        {
          k: 'Hub',
          role: 'The building OS',
          sys: 'Aiii VBIM',
          d: 'A 360° god’s-eye management platform',
        },
        {
          k: 'Body',
          role: 'MEP & energy assets',
          sys: 'Building · Equipment',
          d: 'Power, HVAC, storage, solar and field equipment',
        },
      ],
    },
    command: {
      eyebrow: 'GLOBAL COMMAND CENTER',
      title: 'Remote, multi-site, data-driven control',
      lead: 'Give headquarters a live view of engineering, equipment, energy and operations across every site worldwide.',
      imageAlt:
        'Global sites connected across North America, Europe, Middle East, Asia, Oceania, Africa and South America',
      path: [
        { en: 'Global' },
        { en: 'Site' },
        { en: 'Building' },
        { en: 'Floor' },
        { en: 'Space' },
        { en: 'Asset' },
        { en: 'Sensor' },
      ],
      pathLabel: 'Management levels',
      features: [
        { t: 'Global plants & multi-site management', d: 'One platform, flexible scale' },
        { t: 'Live dashboards & event alerts', d: 'Visible data, faster response' },
        { t: 'Remote collaboration & dispatch', d: 'Cross-site teamwork, higher efficiency' },
        { t: "An executive god's-eye view", d: 'Full insight, precise decisions' },
      ],
    },
    ecosystem: {
      eyebrow: 'AN OPEN ECOSYSTEM',
      title: 'The platform ecosystem',
      strong: 'Aiii VBIM at the core, connecting engineering, equipment, energy and AI.',
      text: 'PMIS, digital twin, video AI, energy, HVAC, clean systems, Edge AI, cybersecurity and AI agents — all on one platform. Equipment makers, contractors, energy, AI, security and SI partners can plug their technology into Aiii VBIM.',
      primary: 'Become a Partner →',
      secondary: 'See the architecture',
      imageAlt:
        'Aiii VBIM ecosystem: PMIS, digital twin, VMS/AI vision, energy, HVAC, clean system, Edge AI, cybersecurity and AI agent around the core platform',
    },
    academy: {
      eyebrow: 'VBIM ACADEMY',
      title: 'VBIM Certification Academy',
      text: 'Train, assess, certify, match. Become a VBIM Certified Engineer or Partner and deliver smart building, energy, HVAC and Edge AI projects.',
      modules: 'Six modules: BIM/PMIS · Energy · HVAC · Vision · AIoT · Edge AI',
      cta: 'Register interest →',
    },
    news: {
      title: 'Latest News',
      viewAll: 'View all →',
      product: 'Product',
      media: 'Media',
      empty: 'No news yet',
    },
    cta: {
      title: 'From Data to a Better Physical World.',
      text: 'Tell us about your site and your challenges — we’ll show you Aiii VBIM in action.',
      primary: 'Book a Demo',
      secondary: 'Become a Partner',
    },
  },
};
