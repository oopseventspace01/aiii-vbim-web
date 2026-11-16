// AI 生成示意圖的替代文字（2026-11-16 新增）
// 這些是新寫的文案，設計稿沒有對應文字 → 草稿，待業主確認後再定稿。
// 圖片本身一律在畫面上標「示意畫面」（MediaFigure 的 mockupLabel）。
import type { Locale } from '../lib/i18n';

export const VISUAL_ALT: Record<
  Locale,
  { digitalTwin: string; hvacAnomaly: string; commandCenter: string }
> = {
  'zh-Hant': {
    digitalTwin: '建築數位孿生示意：透明建築剖面中的空調、給排水、消防管線與機房設備',
    hvacAnomaly: '空調管線異常示意：AI 在機房冰水管段標出疑似漏水位置，並以熱度分布小窗顯示異常',
    commandCenter: '全球戰情室示意：螢幕牆顯示建築數位孿生、全球據點與管線告警，值班人員集中監控',
  },
  en: {
    digitalTwin:
      'Illustrative building digital twin: a transparent cutaway showing HVAC, plumbing and fire-protection piping and plant-room equipment',
    hvacAnomaly:
      'Illustrative HVAC pipe anomaly: AI flags a suspected leak on a chilled-water line, with a heat-map inset',
    commandCenter:
      'Illustrative global command center: a video wall with a building digital twin, global sites and pipe alerts, monitored by operators',
  },
};
