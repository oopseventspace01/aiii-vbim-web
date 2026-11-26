// 首頁與「夥伴與學院」頁首的 YouTube 影片設定（2026-11-26 業主選用 YouTube）
//
// 怎麼換影片：
//   1. 在 YouTube 打開影片，網址長得像 https://www.youtube.com/watch?v=XXXXXXXXXXX
//      或 https://youtu.be/XXXXXXXXXXX，「XXXXXXXXXXX」（11 個字元）就是影片 ID。
//   2. 把 ID 填進下面對應的 id: ''（也可以直接貼整個網址，程式會自動取出 ID）。
//   3. 把 title 換成正式的影片標題（中英文各一）。
//   id 留空 '' 時，整個影片區塊不會顯示，網站上看不到任何空白框。
//
// 播放方式：一開始只顯示 YouTube 封面圖＋播放鍵，按下去才載入 youtube-nocookie.com 的播放器
// （按之前不會連到 YouTube 播放器，也不會放追蹤 Cookie）。
import type { Locale } from '../lib/i18n';

export type VideoKey = 'home' | 'academy';

export const VIDEOS: Record<VideoKey, { id: string; title: Record<Locale, string> }> = {
  // 首頁「最新消息」下方：介紹影片（2026-11-26 業主提供）
  // 中文標題取自 YouTube 影片名稱；英文標題為草稿，待業主確認
  home: {
    id: 'ovWzLG7Qhhc',
    title: { 'zh-Hant': 'Aiii VBIM 介紹', en: 'Aiii VBIM Introduction' },
  },
  // /partners 頁首（Hero）右側：教育認證影片（2026-11-26 業主提供）
  // 中文標題取自 YouTube 影片名稱（「2 0」修正為「2.0」）；英文標題為草稿，待業主確認
  academy: {
    id: 'yq54sYUH6j4',
    title: {
      'zh-Hant': 'Aiii VBIM OS 2.0 教育認證',
      en: 'Aiii VBIM OS 2.0 Education & Certification',
    },
  },
};

export const VIDEO_COPY: Record<Locale, { play: (title: string) => string }> = {
  'zh-Hant': { play: (title) => `播放影片：${title}` },
  en: { play: (title) => `Play video: ${title}` },
};

const ID = /^[A-Za-z0-9_-]{11}$/;

/** 接受影片 ID 或各種 YouTube 網址，回傳 11 字元的影片 ID；不合法回傳空字串 */
export function youtubeId(input: string | null | undefined): string {
  const value = (input ?? '').trim();
  if (!value) return '';
  if (ID.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\.|^m\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id =
        url.searchParams.get('v') ??
        url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
        '';
    }
    return ID.test(id) ? id : '';
  } catch {
    return '';
  }
}

export const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
export const posterUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** 這個位置要顯示的影片；ID 空白或不合法時回傳 undefined（整個區塊不顯示） */
export function videoFor(key: VideoKey, locale: Locale) {
  const v = VIDEOS[key];
  const id = youtubeId(v.id);
  return id ? { id, title: v.title[locale] } : undefined;
}
