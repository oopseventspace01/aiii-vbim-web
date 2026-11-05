// 從舊官網（Gamma）搬過來的實際圖片（2026-11-05 業主指示，候選圖見 docs/舊網站圖片候選.jpg）
// 中文說明取自圖片上的標題；英文為 Claude 翻譯，待業主確認。
// 圖片內含中文字，A／B／C 組只放中文頁；D 組（系統畫面）中英文頁都放。
import type { ImageMetadata } from 'astro';
import type { Locale } from '../../lib/i18n';
import stageDesign from '../../assets/illustrations/stage-design.jpg';
import stagePmis from '../../assets/illustrations/stage-pmis.jpg';
import stageBim10d from '../../assets/illustrations/stage-bim10d.jpg';
import stageAiSafety from '../../assets/illustrations/stage-ai-safety.jpg';
import stageBlockchain from '../../assets/illustrations/stage-blockchain.jpg';
import stageOperation from '../../assets/illustrations/stage-operation.jpg';
import lifecycleLoop from '../../assets/illustrations/lifecycle-loop.jpg';
import sectorRetail from '../../assets/illustrations/sector-retail.jpg';
import sectorMedical from '../../assets/illustrations/sector-medical.jpg';
import platformFm from '../../assets/illustrations/platform-fm.jpg';
import platformOpsFlow from '../../assets/illustrations/platform-ops-flow.jpg';
import platformVmsBim from '../../assets/illustrations/platform-vms-bim.jpg';
import platformVmsPipes from '../../assets/illustrations/platform-vms-pipes.jpg';

export type ShowcaseItem = { src: ImageMetadata; caption: string };

/** A＋B：Aiii VBIM 頁「生命週期」（只放中文頁） */
export const LIFECYCLE_SHOWCASE = {
  loop: { src: lifecycleLoop, caption: '全生命週期數據管理閉環' },
  stages: [
    { src: stageDesign, caption: '設計階段：智慧清圖與雲端協作' },
    { src: stagePmis, caption: '施工階段（A）：PMIS 專案管理可視化' },
    { src: stageBim10d, caption: '施工階段（B）：BIM 10D 建築工業化' },
    { src: stageAiSafety, caption: '施工階段（C）：AI 智慧工安監控' },
    { src: stageBlockchain, caption: '驗收與交付：區塊鏈數據上鏈' },
    { src: stageOperation, caption: '營運階段：數位孿生設施管理' },
  ],
} satisfies { loop: ShowcaseItem; stages: ShowcaseItem[] };

/** C：五大領域分頁（只放中文頁） */
export const SECTOR_SHOWCASE: Partial<Record<'hospital' | 'retail', ShowcaseItem>> = {
  retail: { src: sectorRetail, caption: '垂直應用：Aiii MMS 智慧零售' },
  hospital: { src: sectorMedical, caption: '垂直應用：Aiii MMS 智慧醫療' },
};

/** D：平台 OS 頁「系統實際畫面」（中英文都放） */
export const PLATFORM_SHOWCASE: Record<Locale, { title: string; items: ShowcaseItem[] }> = {
  'zh-Hant': {
    title: '系統實際畫面',
    items: [
      { src: platformFm, caption: 'FM 設施維護資料、Aiii VBIM 營運模型與中央監控系統' },
      { src: platformOpsFlow, caption: '營建智慧化管理' },
      { src: platformVmsBim, caption: 'CCTV 影像與 BIM 模型整合畫面' },
      { src: platformVmsPipes, caption: 'CCTV 影像與機電管線模型整合畫面' },
    ],
  },
  en: {
    title: 'The system in action',
    items: [
      {
        src: platformFm,
        caption: 'FM maintenance data, the Aiii VBIM operations model and central monitoring',
      },
      { src: platformOpsFlow, caption: 'Smart construction management' },
      { src: platformVmsBim, caption: 'CCTV video integrated with the BIM model' },
      { src: platformVmsPipes, caption: 'CCTV video integrated with the MEP piping model' },
    ],
  },
};
