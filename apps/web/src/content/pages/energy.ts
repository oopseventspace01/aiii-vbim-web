// /energy 固定文案：逐字取自 design/pages/Energy.dc.html、en-Energy.dc.html（清單資料見 ../design/Energy.json）
// 市場趨勢數字為設計稿定稿內容並附資料來源（IEA）
import type { Locale } from '../../lib/i18n';

export const ENERGY_COPY: Record<
  Locale,
  {
    metaTitle: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    heroAlt: string;
    loop: { eyebrow: string; title: string; text: string };
    scope: { title: string };
    trends: { label: string; text: string; source: string }[];
    hvac: {
      eyebrow: string;
      title: string;
      subtitle: string;
      body: string;
      flow: string[];
      imageAlt: string;
    };
    chiller: { title: string; text: string; columns: [string, string] };
    clean: { eyebrow: string; title: string; text: string };
    cta: { title: string; text: string; button: string };
  }
> = {
  'zh-Hant': {
    metaTitle: '能源 × 空調',
    eyebrow: 'GRID + SOLAR + WIND + ESS + COMPUTE CENTER',
    title: '智慧能源管理',
    subtitle: '風力、太陽能、儲能與算力中心的整合智控',
    body: '不只是電表 Dashboard，而是建立完整能源拓樸：台電 → 變電 → 配電 → UPS／發電機 → 太陽能／風電／儲能 → 空調、產線、資料中心等負載。從供電到用電，建立全域能源可視化與智慧優化。',
    heroAlt: '智慧能源示意：風力發電、太陽能、儲能 ESS、台電重電、用電負載與算力中心',
    loop: {
      eyebrow: 'ENERGY CLOSED LOOP',
      title: '從 ESG 報表，升級為能源閉環',
      text: 'AI 不只回答「用了多少電」，而要回答「為什麼增加、可以怎麼降、降了多少、是否影響生產與舒適」。能源 Agent 把能源資料與氣象、生產排程、人流、租戶與設備狀態交叉分析，產生可執行的節能策略。',
    },
    scope: { title: '管理範圍' },
    trends: [
      {
        label: '市場趨勢',
        text: '全球電力需求 2026–2030 平均年增約 3.6%',
        source: '資料來源：IEA《Electricity 2026》',
      },
      {
        label: '市場趨勢',
        text: '資料中心用電至 2030 年約 945 TWh，接近 2025 年兩倍',
        source: '資料來源：IEA《Energy and AI》',
      },
      {
        label: '市場趨勢',
        text: '2025–2030 全球再生能源新增約 4,600 GW，太陽能占近八成',
        source: '資料來源：IEA《Renewables 2025》',
      },
    ],
    hvac: {
      eyebrow: 'HVAC AI + CLEAN ENVIRONMENT',
      title: '中央空調節能 × 潔淨系統',
      subtitle: '把空調控制與潔淨環境管理，轉化為可計算、可優化的營運能力。',
      body: '由設計、Control Box、控制邏輯、施工、維護到運轉，形成 HVAC Total Solution。以 BIM 空間關係對應冰水主機、冷卻水塔、泵浦、AHU、MAU、FCU、VAV 與感測器，建立可視化、可計算的 HVAC 數位孿生。',
      flow: ['監看', '分析', '預測', '控制'],
      imageAlt:
        '中央空調與潔淨系統剖面示意：冰水主機、冷卻水塔、AHU／FCU、溫濕度壓差感測、潔淨空間',
    },
    chiller: {
      title: 'AI Chiller Optimization',
      text: '氣象 + 人流 + 區域負載 + 生產條件 + 歷史運轉 + 電價 → 主機台數、供水溫度、泵浦／風機頻率與排程最佳化。',
      columns: ['監控面向', '關鍵指標'],
    },
    clean: {
      eyebrow: 'AIII CLEAN',
      title: '潔淨環境管理',
      text: '針對半導體、生技、製藥、醫院手術室、ICU 與實驗室。異常發生時，可從空間直接追到 AHU、風管、濾網、感測器與維修紀錄。',
    },
    cta: {
      title: '從一個明確的節能痛點開始',
      text: '先從能源或空調切入，驗證成效後再擴展到 Aiii VBIM 全平台。',
      button: '預約能源／空調評估 →',
    },
  },
  en: {
    metaTitle: 'Energy & HVAC',
    eyebrow: 'GRID + SOLAR + WIND + ESS + COMPUTE CENTER',
    title: 'Smart Energy Management',
    subtitle: 'Integrated control of wind, solar, storage and compute centers',
    body: 'More than a meter dashboard — a complete energy topology: grid → substation → distribution → UPS / generators → solar / wind / storage → HVAC, production lines and data center loads. Full visibility and optimization from supply to demand.',
    heroAlt: 'Smart energy: wind, solar, ESS storage, grid, building loads and compute center',
    loop: {
      eyebrow: 'ENERGY CLOSED LOOP',
      title: 'From ESG reports to a closed energy loop',
      text: 'AI shouldn’t just answer “how much did we use?” — it should answer why it rose, how to cut it, how much was saved and whether production or comfort was affected. The Energy Agent cross-analyzes energy data with weather, production schedules, footfall, tenants and equipment status to produce actionable savings strategies.',
    },
    scope: { title: 'What we manage' },
    trends: [
      {
        label: 'Market trend',
        text: 'Global electricity demand to grow ~3.6% a year, 2026–2030',
        source: 'Source: IEA, Electricity 2026',
      },
      {
        label: 'Market trend',
        text: 'Data center electricity use near 945 TWh by 2030 — almost double 2025',
        source: 'Source: IEA, Energy and AI',
      },
      {
        label: 'Market trend',
        text: '~4,600 GW of new renewables 2025–2030, nearly 80% solar',
        source: 'Source: IEA, Renewables 2025',
      },
    ],
    hvac: {
      eyebrow: 'HVAC AI + CLEAN ENVIRONMENT',
      title: 'HVAC Efficiency × Clean Systems',
      subtitle:
        'Turning HVAC control and cleanroom management into measurable, optimizable operations.',
      body: 'From design, control boxes and control logic to construction, maintenance and operation — an HVAC Total Solution. Using BIM spatial relationships, we map chillers, cooling towers, pumps, AHUs, MAUs, FCUs, VAVs and sensors into a visual, computable HVAC digital twin.',
      flow: ['Monitor', 'Analyze', 'Predict', 'Control'],
      imageAlt:
        'HVAC and clean system cutaway: chillers, cooling tower, AHU/FCU, sensors and clean space',
    },
    chiller: {
      title: 'AI Chiller Optimization',
      text: 'Weather + footfall + zone load + production conditions + operating history + tariffs → optimal chiller count, supply water temperature, pump/fan speeds and schedules.',
      columns: ['What we monitor', 'Key metrics'],
    },
    clean: {
      eyebrow: 'AIII CLEAN',
      title: 'Clean environment management',
      text: 'For semiconductors, biotech, pharma, operating rooms, ICUs and labs. When an anomaly occurs, trace it straight from the space to the AHU, ductwork, filters, sensors and maintenance records.',
    },
    cta: {
      title: 'Start with one clear savings opportunity',
      text: 'Begin with energy or HVAC, prove the value, then expand to the full Aiii VBIM platform.',
      button: 'Request an energy / HVAC assessment →',
    },
  },
};
