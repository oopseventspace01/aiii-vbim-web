// 產品頁：Aiii RMS 智慧零售／Aiii MMS 智慧醫療
// 文案逐字取自業主舊 Gamma 網站（中文取中文頁、英文取英文頁），只挑段落、不改寫。
// 已刻意移除：無出處的統計數字（87%、效益分析 50/80/95%）、徵才段落。最高級用語與人臉辨識／黑白名單內容經業主同意保留。
import type { ImageMetadata } from 'astro';
import type { Locale } from '../../lib/i18n';
import rmsHero from '../../assets/products/rms-hero.jpg';
import rmsCamera from '../../assets/products/rms-camera.jpg';
import rmsBox from '../../assets/products/rms-box.jpg';
import rmsVms from '../../assets/products/rms-vms.jpg';
import mmsHero from '../../assets/products/mms-hero.jpg';
import mmsBlood from '../../assets/products/mms-blood.jpg';
import mmsBlockchain from '../../assets/products/mms-blockchain.jpg';
import mmsCt from '../../assets/products/mms-ct.jpg';

export type ProductKey = 'rms' | 'mms';
export type ProductSection = {
  title: string;
  lead?: string;
  items?: { t: string; d?: string }[];
  bullets?: string[];
  image?: { src: ImageMetadata; alt: string };
};
export type ProductCopy = {
  metaTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
  heroImage: { src: ImageMetadata; alt: string };
  sections: ProductSection[];
  video?: { url: string; title: string };
  cta: string;
};

export const PRODUCTS: Record<ProductKey, Record<Locale, ProductCopy>> = {
  rms: {
    'zh-Hant': {
      metaTitle: 'Aiii RMS 智慧零售',
      eyebrow: 'Retail Management System',
      title: 'Aiii RMS 智慧零售',
      lead: 'Aiii RMS 系統將消費者行為分析（BI）、門市空間規劃、動線設計、商品陳列建立成數位孿生模型。結合 AI 影像辨識與 POS 銷售數據，提供即時行為數據分析與營運管理依據。',
      heroImage: { src: rmsHero, alt: '門市監視畫面上的 AI 停留時間分析' },
      sections: [
        {
          title: 'AIoT + POS + 行為智慧（BI）整合',
          items: [
            { t: 'POS 系統', d: '串接銷售紀錄，提供平均客單價、購買頻率、商品熱銷度。' },
            {
              t: 'AI 影像辨識',
              d: '分析顧客行為，包括：停留時間（熱區／冷區）、性別、年齡層分析、首次來客、新客／回流客比例、白名單（VIP 顧客）、黑名單（問題客戶）辨識',
            },
            { t: 'BI 行為智慧', d: '結合多維度數據，生成消費行為模型，優化行銷與營運決策。' },
          ],
        },
        {
          title: 'AI 智慧零售應用場景',
          items: [
            { t: '人員管理', d: 'AI 點名、考勤與員工動線分析，提升營運效率。' },
            { t: '庫存管理', d: 'AI 自動辨識商品進出，與 POS 庫存數據比對，避免缺貨或過量庫存。' },
            { t: '無人商店', d: '結合 AIoT、影像辨識與自助結帳，支援 24 小時無人零售模式。' },
            { t: '防竊管理', d: 'AI 監控異常行為，及早通報可疑行為，降低損耗率。' },
          ],
        },
        {
          title: 'Aiii RMS 智慧零售核心價值',
          items: [
            { t: '全方位顧客追蹤', d: '精準掌握人流、停留時間及動線分析，了解每位顧客的購物旅程' },
            {
              t: '自助結帳與無人商店',
              d: '減少人力成本，提供消費者更便捷的購物體驗，符合後疫情時代需求',
            },
            {
              t: 'POS 與 AI 行為辨識整合',
              d: '將銷售數據與顧客行為智慧（BI）無縫連結，挖掘潛在商機',
            },
            { t: '戰情室大數據平台', d: '即時監控與分析店鋪營運狀況，輔助管理決策' },
            { t: '區塊鏈資料保障', d: '交易透明、不可竄改、可追溯，確保數據安全與真實性' },
          ],
        },
        {
          title: '7×24 監控通報事件追蹤與管理',
          items: [
            {
              t: '人工智慧 AI 與深度學習（Deep Learning）',
              d: '實現人臉辨識、車牌辨識、行為分析等高效影像處理應用，為客戶提供精準且即時的數據支持。',
            },
            {
              t: '物聯網 IoT 生態建設',
              d: '構建設備互聯互通的智慧平台，提供開放 API，簡化系統整合，並加速多元 IoT 裝置的應用落地。',
            },
            {
              t: '邊緣運算 Edge Computing',
              d: '在終端實現即時數據處理與決策，降低延遲並提升反應效率。',
            },
            {
              t: '智慧節能與環境控制',
              d: '透過監測光照、溫濕度與空調系統，自動調節能源使用，實現節能與環境優化。',
            },
          ],
          image: { src: rmsCamera, alt: '網路攝影機' },
        },
        {
          title: '實現減少人力，高效率管理',
          items: [
            {
              t: '相容全球約 45,000 種網路攝影機',
              d: '相容於全球約 45,000 種類型的 IP 攝影機，因此只需進行一些簡單的設定即可將商店中現有的安全攝影機轉變為 AI。透過僅支援外部網路連接，我們採取了安全措施來防止病毒和未經授權的訪問，因此您可以放心地在商店安裝和使用它。',
            },
            {
              t: '集中管理安全攝影機鏡頭',
              d: '使用視訊管理系統「Aiii STORE RECORDER」集中管理現有攝影機，該系統會偵測連接到 AWLBOX 的網路攝影機，並允許您輕鬆配置攝影機設定、錄製影片、搜尋影片和分享影片。具備商店錄影機必備的功能，如證據影片搜尋、行動偵測錄影、影片放大／剪下等。',
            },
            {
              t: '體積小、功耗低、容量大',
              d: 'Aiii BOX 體積小、功耗低，因此放置在商店時不會妨礙。透過新增外部硬碟，您還可以長時間儲存影片。',
            },
          ],
          bullets: ['作業系統｜客製化 Linux'],
          image: { src: rmsBox, alt: 'Aiii BOX 邊緣運算主機' },
        },
        {
          title: '顧客行為&無人商店',
          lead: '我們整合多項 AI 工具，包括：',
          bullets: [
            '智慧攝影機與電腦視覺',
            '臉部辨識與客戶分析',
            'RFID 商品追蹤',
            'IoT 感測器網絡',
          ],
          items: [
            {
              t: 'Edge AI',
              d: '採用 Edge AI 技術進行本地即時分析，大幅減少傳輸壓力並提升反應速度，分析結果可無縫整合至：POS 系統、數位購物車、庫存管理平台',
            },
          ],
        },
        {
          title: '行為智慧（BI）分析能力',
          lead: '系統能自動生成人流熱區圖，追蹤冷熱區分布，同時支援顧客性別／年齡分析，並可設定黑白名單監控特定顧客。',
          items: [
            { t: '平均客單價', d: '精確追蹤每筆交易金額，分析提升銷售的關鍵因素' },
            { t: '平均停留時間', d: '掌握顧客在店內及特定區域的逗留時間' },
            { t: '回流客比例', d: '識別首次消費與回訪顧客，提升顧客忠誠度' },
          ],
        },
        {
          title: '智慧零售 IoT 生態系',
          lead: 'Aiii RMS 系統可與各種 IoT 裝置無縫整合，打造完整的智慧零售生態系統，讓您的門市邁向全面數位轉型。',
          items: [
            { t: 'RFID／Beacon', d: '全面追蹤商品位置與顧客行為提供精準推薦' },
            { t: '智慧貨架', d: '即時監控商品陳列狀況自動發出補貨提醒，減少缺貨率' },
            { t: '數位看板', d: '根據顧客特徵即時展示個人化推薦與廣告內容' },
            { t: '環境感測', d: '監控溫度、濕度、空氣品質確保舒適的購物環境' },
            { t: '影像辨識&分析', d: '收集顧客行為與數據創造個性化購物體驗' },
          ],
        },
        {
          title: '智慧營運管理與戰情室',
          lead: '管理者可透過遠端監控 + AI 預警即時決策，提升營運效率。',
          bullets: [
            '自動建立貨架規劃圖，優化商品陳列',
            '與 ERP／BI 系統即時同步（產品、銷售、庫存、價格）',
            '支援多種資料傳輸格式：CSV／FTPS、RestAPI、SQL',
            '智慧員工管理：收銀員監控、排隊偵測、自動開啟新櫃台',
            '人流熱區、銷售數據、客單價',
            '顧客行為分析（性別、年齡、首客比例）',
            '實時庫存與補貨狀態',
            '安全監控：黑名單警報、竊盜偵測',
            'AI 預警與管理決策支援',
          ],
          image: { src: rmsVms, alt: '視訊管理系統集中檢視多支門市攝影機畫面' },
        },
        {
          title: '數據上鏈應用優勢',
          lead: '供應鍊、商品源溯管理、銷售數據、顧客行為影像、庫存紀錄、發票、會員記錄等自動上鏈，生成不可竄改的數位憑證。',
          items: [
            {
              t: '全面資料保護',
              d: '所有銷售數據、影像、交易紀錄自動上鏈，生成不可竄改的時間戳記，建立絕對可信的數據基礎',
            },
            {
              t: '防弊增信機制',
              d: '有效防止內外部舞弊行為，保障交易真實性，提升管理透明度與稽核效率',
            },
            {
              t: '擴展應用潛力',
              d: '區塊鏈技術可延伸應用於會員積分追蹤、供應鏈透明化、跨品牌數據共享等多元場景',
            },
          ],
          bullets: [
            '會員積分與白名單客戶管理',
            '防止資料造假與內外部舞弊',
            '跨平台數據共享（供應鏈、品牌聯盟）',
          ],
        },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=EsFmwthxXTs',
        title: 'Aiii RMS：讓零售空間學會理解人｜Smart Retail That Truly Understands People',
      },
      cta: '預約 Demo →',
    },
    en: {
      metaTitle: 'Aiii RMS Smart Retail',
      eyebrow: 'Retail Management System',
      title: 'Aiii RMS Smart Retail',
      lead: 'The Aiii RMS system builds consumer behavior analysis (BI), store space planning, traffic flow design, and product display into a digital twin model. By integrating AI image recognition with POS sales data, it provides real-time behavior data analysis and a basis for operational management.',
      heroImage: {
        src: rmsHero,
        alt: 'AI dwell-time analysis overlaid on an in-store camera view',
      },
      sections: [
        {
          title: 'AIoT + POS + Behavioral Intelligence (BI) Integration',
          items: [
            {
              t: 'POS System',
              d: 'Integrates sales records to provide average transaction value, purchase frequency, and product popularity.',
            },
            {
              t: 'AI Image Recognition',
              d: 'Analyzes customer behavior, including: dwell time (hot zones / cold zones); gender and age group analysis; proportion of first-time visitors, new customers, and returning customers; identification of whitelists (VIP customers) and blacklists (problematic customers)',
            },
            {
              t: 'BI Behavioral Intelligence',
              d: 'Combines multi-dimensional data to generate consumer behavior models, optimizing marketing and operational decisions.',
            },
          ],
        },
        {
          title: 'AI Smart Retail Application Scenarios',
          items: [
            {
              t: 'Personnel Management',
              d: 'AI roll call, attendance tracking, and employee movement analysis to improve operational efficiency.',
            },
            {
              t: 'Inventory Management',
              d: 'AI automatically recognizes product inflow and outflow, compares with POS inventory data, and prevents stockouts or overstocking.',
            },
            {
              t: 'Unmanned Store',
              d: 'Integrates AIoT, image recognition, and self-checkout to support 24-hour unmanned retail operations.',
            },
            {
              t: 'Theft Prevention Management',
              d: 'AI monitors abnormal behavior, promptly alerts suspicious activities, and reduces shrinkage rates.',
            },
          ],
        },
        {
          title: 'Core Values of Aiii RMS Smart Retail',
          items: [
            {
              t: 'Comprehensive Customer Tracking',
              d: 'Accurately track foot traffic, dwell time, and movement patterns to understand each customer’s shopping journey.',
            },
            {
              t: 'Self-Checkout and Unmanned Stores',
              d: 'Reduce labor costs while offering consumers a more convenient shopping experience, aligned with post-pandemic needs.',
            },
            {
              t: 'Integration of POS and AI Behavioral Recognition',
              d: 'Seamlessly link sales data with customer behavioral intelligence (BI) to uncover potential business opportunities.',
            },
            {
              t: 'War Room Big Data Platform',
              d: 'Monitor and analyze store operations in real time to support management decision-making.',
            },
            {
              t: 'Blockchain Data Security',
              d: 'Ensure transparency, immutability, and traceability of transactions to guarantee data security and authenticity.',
            },
          ],
        },
        {
          title: '7×24 Monitoring, Incident Reporting, and Management',
          items: [
            {
              t: 'Artificial Intelligence (AI) and Deep Learning',
              d: 'Enables efficient image processing applications such as facial recognition, license plate recognition, and behavior analysis, providing customers with accurate and real-time data support.',
            },
            {
              t: 'IoT Ecosystem Development',
              d: 'Builds a smart platform for device interconnectivity, offers open APIs, simplifies system integration, and accelerates the deployment of diverse IoT devices.',
            },
            {
              t: 'Edge Computing',
              d: 'Enables real-time data processing and decision-making at the endpoint, reducing latency and improving responsiveness.',
            },
            {
              t: 'Smart Energy Saving and Environmental Control',
              d: 'Monitors lighting, temperature, humidity, and air conditioning systems to automatically adjust energy usage, achieving energy savings and environmental optimization.',
            },
          ],
          image: { src: rmsCamera, alt: 'Network camera' },
        },
        {
          title: 'Achieve Labor Reduction and Efficient Management',
          items: [
            {
              t: 'Compatible with Around 45,000 Types of Network Cameras Worldwide',
              d: 'Compatible with approximately 45,000 types of IP cameras worldwide, requiring only simple configurations to transform existing store security cameras into AI-enabled devices. By supporting only external network connections, we have implemented security measures to prevent viruses and unauthorized access, ensuring safe installation and use in stores.',
            },
            {
              t: 'Centralized Management of Security Camera Feeds',
              d: 'With the video management system “Aiii STORE RECORDER,” existing cameras can be centrally managed. The system detects network cameras connected to the AWLBOX and allows easy configuration of camera settings, video recording, video search, and video sharing. It provides essential store recorder functions such as evidence video search, motion detection recording, video zooming, and clipping.',
            },
            {
              t: 'Compact Size, Low Power Consumption, Large Capacity',
              d: 'The Aiii BOX is compact and energy-efficient, making it unobtrusive in stores. With the addition of external hard drives, it also supports long-term video storage.',
            },
          ],
          bullets: ['Operating System | Customized Linux'],
          image: { src: rmsBox, alt: 'Aiii BOX edge computing unit' },
        },
        {
          title: 'Customer Behavior & Unmanned Stores',
          lead: 'We integrate multiple AI tools, including:',
          bullets: [
            'Smart Cameras and Computer Vision',
            'Facial Recognition and Customer Analytics',
            'RFID Product Tracking',
            'IoT Sensor Networks',
          ],
          items: [
            {
              t: 'Edge AI',
              d: 'By applying Edge AI technology for real-time local analysis, transmission load is greatly reduced and response speed is improved. The analysis results can be seamlessly integrated into: POS Systems, Digital Shopping Carts, Inventory Management Platforms',
            },
          ],
        },
        {
          title: 'Behavioral Intelligence (BI) Analytical Capabilities',
          lead: 'The system can automatically generate heat maps of customer flow, track hot and cold zone distribution, support gender/age group analysis, and set up whitelist/blacklist monitoring for specific customers.',
          items: [
            {
              t: 'Average Transaction Value',
              d: 'Accurately track each transaction amount and analyze key factors that drive sales growth.',
            },
            {
              t: 'Average Dwell Time',
              d: 'Measure how long customers stay in the store and within specific zones.',
            },
            {
              t: 'Returning Customer Ratio',
              d: 'Identify first-time buyers and returning customers to enhance customer loyalty.',
            },
          ],
        },
        {
          title: 'Smart Retail IoT Ecosystem',
          lead: 'The Aiii RMS system seamlessly integrates with various IoT devices to build a complete smart retail ecosystem, enabling your store to move toward full digital transformation.',
          items: [
            {
              t: 'RFID/Beacon',
              d: 'Fully track product locations and customer behavior to deliver precise recommendations.',
            },
            {
              t: 'Smart Shelves',
              d: 'Monitor product displays in real time and automatically trigger restock alerts, reducing stockout rates.',
            },
            {
              t: 'Digital Signage',
              d: 'Instantly display personalized recommendations and advertisements based on customer profiles.',
            },
            {
              t: 'Environmental Sensing',
              d: 'Monitor temperature, humidity, and air quality to ensure a comfortable shopping environment.',
            },
            {
              t: 'Image Recognition & Analysis',
              d: 'Collect customer behavior and data to create a personalized shopping experience.',
            },
          ],
        },
        {
          title: 'Smart Operations Management and War Room',
          lead: 'Managers can make instant decisions through remote monitoring and AI early warnings, enhancing operational efficiency.',
          bullets: [
            'Automatically generate shelf layout plans to optimize product displays.',
            'Real-time synchronization with ERP/BI systems (products, sales, inventory, pricing).',
            'Supports multiple data transmission formats: CSV/FTPS, RestAPI, SQL.',
            'Smart Employee Management: cashier monitoring, queue detection, and automatic counter activation.',
            'Customer flow heat maps, sales data, and average transaction value.',
            'Customer behavior analysis (gender, age, first-time customer ratio).',
            'Real-time inventory and restocking status.',
            'Security monitoring: blacklist alerts and theft detection.',
            'AI Early Warning and Management Decision Support',
          ],
          image: {
            src: rmsVms,
            alt: 'Video management system showing multiple store camera feeds',
          },
        },
        {
          title: 'Advantages of On-Chain Data Applications',
          lead: 'Supply chain, product traceability, sales data, customer behavior images, inventory records, invoices, and membership records are automatically uploaded to the blockchain, generating immutable digital certificates.',
          items: [
            {
              t: 'Comprehensive Data Protection',
              d: 'All sales data, images, and transaction records are automatically uploaded to the blockchain, generating immutable timestamps and creating a fully trustworthy data foundation.',
            },
            {
              t: 'Anti-Fraud and Trust Enhancement Mechanism',
              d: 'Effectively prevents internal and external fraud, ensures transaction authenticity, and improves management transparency and audit efficiency.',
            },
            {
              t: 'Expanded Application Potential',
              d: 'Blockchain technology can be extended to diverse scenarios such as membership points tracking, supply chain transparency, and cross-brand data sharing.',
            },
          ],
          bullets: [
            'Membership points and whitelist customer management',
            'Preventing data falsification and internal/external fraud',
            'Cross-platform data sharing (supply chains, brand alliances)',
          ],
        },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=FU1NouVVpII',
        title: 'Teaching Retail Spaces to Understand People｜Aiii RMS：教會零售空間「理解人」',
      },
      cta: 'Book a Demo →',
    },
  },
  mms: {
    'zh-Hant': {
      metaTitle: 'Aiii MMS 智慧醫療',
      eyebrow: 'Medical Management System',
      title: '智慧醫療影像辨識',
      lead: 'Aiii Medicare Management System 開發新一代智慧監控產品，為醫療、交通、教育、工業等多個領域提供高效可靠的智能解決方案。',
      heroImage: { src: mmsHero, alt: '醫療場域的 IoT 感測器與邊緣運算閘道器架構圖' },
      sections: [
        {
          title: '智慧醫院規劃設計',
          lead: 'Aiii MMS 系統可於醫院興建規劃階段即導入，將建築結構、動線設計、機電設備進行三維數位孿生建模，實現：',
          items: [
            {
              t: '智慧清圖與衝突檢測',
              d: '避免手術室、加護病房等重要空間設計瑕疵，降低施工錯誤與後續改建成本。',
            },
            {
              t: '全生命週期模型',
              d: '建立完整的醫院全生命週期模型，從規劃、施工到維運皆可持續更新與優化。',
            },
            {
              t: '智慧化施工管理',
              d: '透過數位孿生技術，即時監控施工進度、品質與安全，確保醫院建設符合設計規範。',
            },
          ],
        },
        {
          title: '醫療資訊系統（HIS）與 AI 影像辨識整合',
          lead: 'Aiii MMS 平台能無縫整合各類醫療資訊系統，並透過 AI 影像辨識技術提升醫療流程效率：',
          items: [
            {
              t: '資訊系統整合',
              d: '門急診、住院、檢驗、影像（HIS／LIS／RIS／HRP）等系統與 V-BIM 平台完美整合，實現資料互通與集中管理。',
            },
            {
              t: 'AI 影像辨識應用',
              d: '醫護人員與病患動線智慧管理、病患身分驗證與行為即時監控、病歷與 BI（Behavior Intelligence）數據分析',
            },
            {
              t: '風險管理強化',
              d: '有效降低醫療糾紛風險，提升醫護工作效率，全面保障醫生、病人與家屬權益。',
            },
          ],
        },
        {
          title: '醫療 AIoT 與設備智慧管理',
          lead: '透過智慧物聯網技術，醫院能建立完整的設備生命週期管理系統，確保醫療設備處於最佳運作狀態。',
          items: [
            {
              t: '醫療設備 AIoT 串接',
              d: '醫療儀器、監測裝置、顯微鏡影像、細胞分析設備皆能透過 AIoT 技術串接，實現數據即時監控與整合管理。',
            },
            {
              t: 'AI 輔助診斷',
              d: 'AI 模型可自動化分析檢驗影像與數據，提供醫師決策輔助，有效減少人工判讀負擔，提高診斷準確率。',
            },
            {
              t: '預防性維護',
              d: '設備運行數據（電流、電壓、溫度）即時回饋至戰情室，支援預防性維護計畫，降低設備故障率與維修成本。',
            },
          ],
          image: { src: mmsBlood, alt: 'AI 標記顯微鏡下的血球影像' },
        },
        {
          title: 'AI 生命監測與醫院安全',
          lead: '降低醫療糾紛風險，實現減少人力，高效率管理',
          items: [
            {
              t: 'AI 生命體徵監測',
              d: 'CCTV 結合 AI 技術可非接觸式即時辨識並監測病患心跳、呼吸、體溫等生理指標，一旦偵測到異常立即發送警報通知醫護人員。',
            },
            {
              t: '病患安全防護',
              d: '智慧系統可偵測病患跌倒、昏厥、走失等緊急事件，透過即時通知機制，確保醫護人員能在第一時間提供協助。',
            },
            {
              t: '院區安全維護',
              d: '醫院竊盜與人員異常行為由 AI 影像辨識系統主動偵測與預警，全面提升院區安全管理水準，保障病患、訪客與醫護人員安全。',
            },
          ],
        },
        {
          title: '7×24 監控通報事件追蹤與管理',
          items: [
            {
              t: '人工智慧 AI 與深度學習（Deep Learning）',
              d: '實現人臉辨識、車牌辨識、行為分析等高效影像處理應用，為客戶提供精準且即時的數據支持。',
            },
            {
              t: '物聯網 IoT 生態建設',
              d: '構建設備互聯互通的智慧平台，提供開放 API，簡化系統整合，並加速多元 IoT 裝置的應用落地。',
            },
            {
              t: '邊緣運算 Edge Computing',
              d: '在終端實現即時數據處理與決策，降低延遲並提升反應效率。',
            },
            {
              t: '智慧節能與環境控制',
              d: '透過監測光照、溫濕度與空調系統，自動調節能源使用，實現節能與環境優化。',
            },
          ],
        },
        {
          title: '智慧醫療 Aiii Medical Management System',
          lead: 'Aiii Medical Management System 針對場域做狀態偵測，可應用於：居家照護、護理應用、公共安防等需求。裝置用毫米波雷達進行場域偵測，無使用任何攝錄影與鏡頭等設備，可安裝於浴廁、哺乳室等私密空間，在保障客戶的隱私為前提下顧及安全性。',
        },
        {
          title: '智慧醫院戰情室管理概念',
          lead: 'Aiii MMS 打造的醫院智慧戰情室為醫院管理者提供全方位即時監控與管理平台：',
          bullets: [
            '人流熱點分布與擁塞預警',
            '各樓層環境參數（氣溫、濕度、空氣品質）',
            '醫療設備運行狀態與異常警示',
            '緊急事件警報與即時通報機制',
          ],
          items: [
            {
              t: '決策支援系統',
              d: '透過遠距監控、數據可視化與 AI 預警功能，大幅提升醫院決策速度與緊急事件應變能力。',
            },
          ],
        },
        {
          title: '未來展望與拓展應用',
          lead: '本系統有望樹立智慧醫療診所運營新標杆，推動整個行業的數位化轉型。未來將探索與區塊鏈技術結合，用於患者數據安全追蹤，進一步提升系統的安全性和可靠性。',
          items: [{ t: '區塊鏈技術整合' }, { t: '擴展至其他醫療科室' }, { t: '行業數位化轉型' }],
        },
        {
          title: '數據上鏈，保障醫療可信度',
          lead: '所有醫療數據、影像與文件皆自動上鏈（Blockchain），生成不可竄改的時間戳記，確保醫療紀錄透明、可追溯，有效降低醫療糾紛爭議。',
          items: [
            {
              t: '電子病歷管理',
              d: '患者的醫療記錄上鏈後，可以安全地共享給不同醫療機構，避免重複檢查與誤診。患者擁有數據的所有權，可以自主決定誰能訪問自己的病歷。',
            },
            {
              t: '穿戴設備與健康數據',
              d: '穿戴設備收集的健康數據（如心率、血壓）即時上鏈，確保數據的真實性與即時性。醫生可以根據這些數據提供遠端診斷與建議。',
            },
            {
              t: '醫學影像與基因數據',
              d: '醫學影像與基因數據上鏈後，可以安全地共享給研究機構或藥廠，促進醫學研究與新藥開發。患者可以透過智能合約獲得數據使用的收益。',
            },
            {
              t: '藥物供應鏈追蹤',
              d: '藥品的生產、運輸與銷售記錄上鏈，確保藥品的真實性與安全性，防止假藥流入市場。患者可以掃描藥品上的區塊鏈二維碼，確認藥品的來源與有效性。',
            },
            {
              t: '醫療保險與理賠',
              d: '智能合約自動執行保險理賠條件，例如根據穿戴設備數據判斷是否達到理賠標準。提高理賠效率，減少人為干預與詐保行為。',
            },
          ],
          bullets: [
            '病歷與白名單客戶管理',
            '防止資料造假與內外部舞弊',
            '跨平台數據共享（供應鏈、品牌聯盟）',
          ],
          image: {
            src: mmsBlockchain,
            alt: '醫療區塊鏈平台：病患、醫院與保險業者之間的資料授權流程',
          },
        },
        {
          title: '第六代智能 Aiii MMS',
          items: [
            {
              t: '病兆分析',
              d: '利用 AI、大數據等技術提升診斷精度，優化醫療資源分配，各案採集建立完整影像分析資料庫。',
            },
            {
              t: '血液檢測',
              d: '利用 AI、大數據等技術提升診斷精度，優化醫療資源分配，實現遠程多重檢測，減少誤判風險。',
            },
          ],
          image: { src: mmsCt, alt: '腦部斷層影像與 AI 分析結果對照' },
        },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=rTjUpXuVaXM',
        title: 'Aiii MMS：讓醫療決策更聰明，也更有溫度｜Smart Healthcare with Aiii MMS',
      },
      cta: '預約 Demo →',
    },
    en: {
      metaTitle: 'Aiii MMS Smart Healthcare',
      eyebrow: 'Medical Management System',
      title: 'Smart Medical Image Recognition',
      lead: 'The Aiii Medicare Management System develops a new generation of intelligent monitoring products, delivering efficient and reliable smart solutions for healthcare, transportation, education, and industrial sectors.',
      heroImage: {
        src: mmsHero,
        alt: 'Architecture diagram of IoT sensors and an edge computing gateway in a healthcare setting',
      },
      sections: [
        {
          title: 'Smart Hospital Planning and Design',
          lead: 'The Aiii MMS system can be introduced at the hospital construction planning stage, creating 3D digital twin models of building structures, traffic flow design, and MEP (mechanical, electrical, and plumbing) systems to achieve:',
          items: [
            {
              t: 'Smart Drawing and Clash Detection',
              d: 'Prevent design flaws in critical spaces such as operating rooms and intensive care units, reducing construction errors and future renovation costs.',
            },
            {
              t: 'Full Lifecycle Model',
              d: 'Establish a comprehensive hospital lifecycle model that can be continuously updated and optimized from planning and construction to operation and maintenance.',
            },
            {
              t: 'Intelligent Construction Management',
              d: 'Leverage digital twin technology to monitor construction progress, quality, and safety in real time, ensuring hospital projects meet design standards.',
            },
          ],
        },
        {
          title: 'Integration of Hospital Information Systems (HIS) with AI Image Recognition',
          lead: 'The Aiii MMS platform seamlessly integrates various hospital information systems and enhances medical process efficiency through AI image recognition technology:',
          items: [
            {
              t: 'Information System Integration',
              d: 'Outpatient, inpatient, laboratory, imaging (HIS/LIS/RIS/HRP), and other systems are perfectly integrated with the V-BIM platform, achieving data interoperability and centralized management.',
            },
            {
              t: 'AI Image Recognition Applications',
              d: 'Smart management of medical staff and patient movement routes; real-time monitoring of patient identity verification and behavior; medical record and BI (Behavioral Intelligence) data analysis',
            },
            {
              t: 'Enhanced Risk Management',
              d: 'Effectively reduces the risk of medical disputes, improves healthcare efficiency, and comprehensively protects the rights of doctors, patients, and their families.',
            },
          ],
        },
        {
          title: 'Medical AIoT and Intelligent Equipment Management',
          lead: 'With smart IoT technology, hospitals can establish a complete equipment lifecycle management system to ensure medical devices remain in optimal operating condition.',
          items: [
            {
              t: 'Medical Equipment AIoT Integration',
              d: 'Medical instruments, monitoring devices, microscope imaging, and cell analysis equipment can all be connected via AIoT technology, enabling real-time data monitoring and integrated management.',
            },
            {
              t: 'AI-Assisted Diagnosis',
              d: 'AI models can automatically analyze diagnostic images and data, providing decision support for physicians, effectively reducing the burden of manual interpretation and improving diagnostic accuracy.',
            },
            {
              t: 'Preventive Maintenance',
              d: 'Equipment operation data (current, voltage, temperature) is fed back to the war room in real time, supporting preventive maintenance plans and reducing equipment failure rates and maintenance costs.',
            },
          ],
          image: { src: mmsBlood, alt: 'AI-labeled blood cells under a microscope' },
        },
        {
          title: 'AI Vital Sign Monitoring and Hospital Safety',
          lead: 'Reduce medical dispute risks, achieve labor reduction, and enhance management efficiency.',
          items: [
            {
              t: 'AI Vital Sign Monitoring',
              d: 'By combining CCTV with AI technology, patient vital signs such as heartbeat, respiration, and body temperature can be recognized and monitored in real time without contact. If abnormalities are detected, alerts are immediately sent to medical staff.',
            },
            {
              t: 'Patient Safety Protection',
              d: 'The smart system can detect emergencies such as patient falls, fainting, or wandering. Through real-time notifications, it ensures medical staff can provide assistance immediately.',
            },
            {
              t: 'Hospital Campus Safety Maintenance',
              d: 'Theft and abnormal behavior in hospitals are proactively detected and flagged by AI image recognition systems, significantly enhancing campus safety management and protecting patients, visitors, and healthcare staff.',
            },
          ],
        },
        {
          title: '7×24 Monitoring, Incident Reporting, and Event Management',
          items: [
            {
              t: 'Artificial Intelligence (AI) and Deep Learning',
              d: 'Enables efficient image processing applications such as facial recognition, license plate recognition, and behavior analysis, providing customers with accurate and real-time data support.',
            },
            {
              t: 'IoT Ecosystem Development',
              d: 'Builds a smart platform for device interconnectivity, offers open APIs, simplifies system integration, and accelerates the deployment of diverse IoT devices.',
            },
            {
              t: 'Edge Computing',
              d: 'Enables real-time data processing and decision-making at the endpoints, reducing latency and improving responsiveness.',
            },
            {
              t: 'Smart Energy Saving and Environmental Control',
              d: 'Monitors lighting, temperature, humidity, and HVAC systems to automatically adjust energy usage, achieving energy savings and environmental optimization.',
            },
          ],
        },
        {
          title: 'Smart Healthcare Aiii Medical Management System',
          lead: 'The Aiii Medical Management System performs status detection for various environments, with applications in home care, nursing services, and public security. The system uses millimeter-wave radar for environmental detection without employing cameras or recording devices. It can be installed in private spaces such as restrooms and nursing rooms, ensuring safety while safeguarding customer privacy.',
        },
        {
          title: 'Smart Hospital War Room Management Concept',
          lead: 'The Aiii MMS Smart Hospital War Room provides hospital administrators with a comprehensive real-time monitoring and management platform:',
          bullets: [
            'Patient Flow Hotspot Distribution and Congestion Alerts',
            'Environmental Parameters by Floor (temperature, humidity, air quality)',
            'Medical Equipment Operation Status and Anomaly Alerts',
            'Emergency Alerts and Real-Time Reporting Mechanism',
          ],
          items: [
            {
              t: 'Decision Support System',
              d: 'Through remote monitoring, data visualization, and AI early-warning functions, it significantly enhances hospital decision-making speed and emergency response capabilities.',
            },
          ],
        },
        {
          title: 'Future Outlook and Application Expansion',
          lead: 'This system is expected to set a new benchmark for smart medical clinic operations and drive digital transformation across the entire industry. In the future, integration with blockchain technology will be explored to enable secure tracking of patient data, further enhancing the system’s security and reliability.',
          items: [
            { t: 'Blockchain Technology Integration' },
            { t: 'Expansion to Other Medical Departments' },
            { t: 'Industry Digital Transformation' },
          ],
        },
        {
          title: 'On-Chain Data for Trusted Healthcare',
          lead: 'All medical data, images, and documents are automatically uploaded to the blockchain, generating immutable timestamps to ensure transparency and traceability of medical records, effectively reducing disputes and conflicts.',
          items: [
            {
              t: 'Electronic Medical Record Management',
              d: 'Once uploaded to the blockchain, patients’ medical records can be securely shared across different healthcare institutions, avoiding duplicate tests and misdiagnoses. Patients retain ownership of their data and can decide who has access to their medical records.',
            },
            {
              t: 'Wearable Devices and Health Data',
              d: 'Health data collected by wearable devices (such as heart rate and blood pressure) is uploaded to the blockchain in real time, ensuring authenticity and timeliness. Doctors can use this data to provide remote diagnoses and recommendations.',
            },
            {
              t: 'Medical Imaging and Genetic Data',
              d: 'Once stored on the blockchain, medical imaging and genetic data can be securely shared with research institutions or pharmaceutical companies, promoting medical research and drug development. Patients can receive benefits from the use of their data through smart contracts.',
            },
            {
              t: 'Pharmaceutical Supply Chain Tracking',
              d: 'Records of drug production, transportation, and sales are uploaded to the blockchain, ensuring authenticity and safety, and preventing counterfeit drugs from entering the market. Patients can scan the blockchain QR code on medications to verify their origin and authenticity.',
            },
            {
              t: 'Medical Insurance and Claims',
              d: 'Smart contracts can automatically enforce insurance claim conditions, such as verifying eligibility based on wearable device data. This improves claim efficiency while reducing human intervention and fraudulent claims.',
            },
          ],
          bullets: [
            'Medical records and whitelist patient management',
            'Preventing data falsification and internal/external fraud',
            'Cross-platform data sharing (supply chains, brand alliances)',
          ],
          image: {
            src: mmsBlockchain,
            alt: 'Medical blockchain platform: data authorization flow between patient, hospitals and insurer',
          },
        },
        {
          title: '6th-Generation Intelligent Aiii MMS',
          items: [
            {
              t: 'Symptom Analysis',
              d: 'Leverage AI and big data technologies to improve diagnostic accuracy, optimize medical resource allocation, and build a comprehensive image analysis database through case data collection.',
            },
            {
              t: 'Blood Testing',
              d: 'Use AI and big data to enhance diagnostic precision, optimize resource allocation, enable remote multi-testing, and reduce the risk of misdiagnosis.',
            },
          ],
          image: { src: mmsCt, alt: 'Brain CT scans compared with AI analysis output' },
        },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=rTjUpXuVaXM',
        title: 'Aiii MMS：讓醫療決策更聰明，也更有溫度｜Smart Healthcare with Aiii MMS',
      },
      cta: 'Book a Demo →',
    },
  },
};
