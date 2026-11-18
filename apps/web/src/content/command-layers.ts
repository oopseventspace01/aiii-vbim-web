// 首頁「遠距多點數據智控」七個管理層級（全球 → 感測器）點開後的內容
// 2026-11-18 業主同意：說明一律取自網站既有原文（不新寫），圖片一律用網站既有圖片
// 對應方式：全球＝平台 OS「管理層」、據點＝常見問題「跨國多據點」、建築＝「建築資料層」、
// 樓層＝「空間」、空間＝「管線」、資產＝「物」、感測器＝「感知層」
import type { ImageMetadata } from 'astro';
import platformDesign from './design/Platform.json';
import { FAQ_COPY } from './pages/faq';
import { HOME } from './home';
import { PLATFORM_COPY } from './pages/platform';
import { PLATFORM_SHOWCASE } from './pages/showcase';
import type { Locale } from '../lib/i18n';
import world from '../assets/illustrations/world.jpg';
import city from '../assets/illustrations/city.jpg';
import vmsBim from '../assets/illustrations/platform-vms-bim.jpg';
import integrated from '../assets/illustrations/pmis-integrated-model.jpg';
import ceiling from '../assets/illustrations/pmis-ceiling-piping.jpg';
import machineRoom from '../assets/illustrations/pmis-machine-room.jpg';
import vmsPipes from '../assets/illustrations/platform-vms-pipes.jpg';

export interface CommandLayer {
  text: string;
  src: ImageMetadata;
  alt: string;
  /** 示意圖（非實際系統畫面）要標「示意畫面」 */
  mockup: boolean;
}

// PMIS 三張 BIM 圖原本在 /vbim#pmis 的圖說（2026-11-16 前已上線的業主核准文案）
const PMIS_ALT: Record<Locale, { integrated: string; ceiling: string; machineRoom: string }> = {
  'zh-Hant': {
    integrated: '土建及機電各專業整合模型',
    ceiling: '成果範例：走道上端施工前密布管線，檢討天花板上配管空間',
    machineRoom: '所有管線配置／閥件／接頭／機房設備等空間配置',
  },
  en: {
    integrated: 'Integrated civil and MEP model across disciplines',
    ceiling:
      'Example: dense piping above a corridor, reviewed for ceiling space before construction',
    machineRoom: 'Spatial layout of all piping, valves, fittings and plant-room equipment',
  },
};

/** 常見問題「跨國、多據點」答案，拿掉開頭的「可以。」／「Yes.」 */
function multiSiteAnswer(locale: Locale): string {
  const item = FAQ_COPY[locale].groups.flatMap((g) => g.items).find((i) => i.id === 'multi-site');
  return (item?.a ?? '').replace(/^(可以。|Yes\.\s*)/, '');
}

export function commandLayers(locale: Locale): CommandLayer[] {
  const p = platformDesign[locale] as {
    layers: { no: string; d: string }[];
    dims: { d: string }[];
  };
  const layer = (no: string) => p.layers.find((l) => l.no === no)?.d ?? '';
  const showcase = PLATFORM_SHOWCASE[locale].items;
  const alt = PMIS_ALT[locale];
  return [
    { text: layer('05'), src: world, alt: HOME[locale].command.imageAlt, mockup: true },
    { text: multiSiteAnswer(locale), src: city, alt: PLATFORM_COPY[locale].heroAlt, mockup: true },
    { text: layer('01'), src: vmsBim, alt: showcase[showcase.length - 2]!.caption, mockup: false },
    { text: p.dims[2]!.d, src: integrated, alt: alt.integrated, mockup: false },
    { text: p.dims[4]!.d, src: ceiling, alt: alt.ceiling, mockup: false },
    { text: p.dims[1]!.d, src: machineRoom, alt: alt.machineRoom, mockup: false },
    {
      text: layer('02'),
      src: vmsPipes,
      alt: showcase[showcase.length - 1]!.caption,
      mockup: false,
    },
  ];
}
