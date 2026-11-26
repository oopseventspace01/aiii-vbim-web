import { describe, expect, it } from 'vitest';
import {
  VIDEOS,
  VIDEO_COPY,
  embedUrl,
  posterUrl,
  videoFor,
  youtubeId,
} from '../../src/content/videos';

describe('YouTube 影片設定', () => {
  it('影片 ID：接受 ID 或各種 YouTube 網址，不合法回傳空字串', () => {
    const id = 'M7lc1UVf-VE';
    expect(youtubeId(id)).toBe(id);
    expect(youtubeId(` ${id} `)).toBe(id);
    expect(youtubeId(`https://www.youtube.com/watch?v=${id}&t=10s`)).toBe(id);
    expect(youtubeId(`https://youtu.be/${id}?si=abc`)).toBe(id);
    expect(youtubeId(`https://m.youtube.com/watch?v=${id}`)).toBe(id);
    expect(youtubeId(`https://www.youtube.com/embed/${id}`)).toBe(id);
    expect(youtubeId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    expect(youtubeId('')).toBe('');
    expect(youtubeId('not-an-id')).toBe('');
    expect(youtubeId(`https://evil.example.com/watch?v=${id}`)).toBe('');
    expect(youtubeId('"><script>')).toBe('');
  });

  it('播放器用 youtube-nocookie、自動播放、不推薦其他頻道；封面用 i.ytimg.com', () => {
    expect(embedUrl('abc')).toBe('https://www.youtube-nocookie.com/embed/abc?autoplay=1&rel=0');
    expect(posterUrl('abc')).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg');
  });

  it('播放鍵文字：中文「播放影片：標題」、英文「Play video: title」', () => {
    expect(VIDEO_COPY['zh-Hant'].play('介紹')).toBe('播放影片：介紹');
    expect(VIDEO_COPY.en.play('Intro')).toBe('Play video: Intro');
  });

  it('ID 空白時不顯示（回傳 undefined）', () => {
    for (const key of Object.keys(VIDEOS) as (keyof typeof VIDEOS)[]) {
      if (!VIDEOS[key].id) expect(videoFor(key, 'zh-Hant')).toBeUndefined();
    }
  });

  it('還沒定案的標題用 [TBD: …] 佔位，ID 空白時才允許', () => {
    for (const v of Object.values(VIDEOS)) {
      if (v.id) {
        expect(v.title['zh-Hant']).not.toMatch(/\[TBD/);
        expect(v.title.en).not.toMatch(/\[TBD/);
      }
    }
  });
});
