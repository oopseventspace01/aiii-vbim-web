import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ZOOM_COPY, ZOOM_MAX_WIDTH, localeFromPath, zoomWidth } from '../../src/content/zoom';

const src = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../../src/components/${path}`, import.meta.url)), 'utf8');

describe('點圖放大', () => {
  it('按鈕與關閉文字：中文「放大圖片」、英文「Enlarge image」', () => {
    expect(ZOOM_COPY['zh-Hant'].open).toBe('放大圖片');
    expect(ZOOM_COPY.en.open).toBe('Enlarge image');
    expect(ZOOM_COPY['zh-Hant'].close).toBe('關閉');
    expect(ZOOM_COPY.en.close).toBe('Close');
  });

  it('從網址判斷語言', () => {
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/en/vbim')).toBe('en');
    expect(localeFromPath('/')).toBe('zh-Hant');
    expect(localeFromPath('/energy')).toBe('zh-Hant');
    expect(localeFromPath('/english-page')).toBe('zh-Hant');
  });

  it('放大用原圖寬度，但最多 2400px', () => {
    expect(zoomWidth(1200)).toBe(1200);
    expect(zoomWidth(5000)).toBe(ZOOM_MAX_WIDTH);
    expect(zoomWidth(undefined)).toBe(ZOOM_MAX_WIDTH);
  });

  it('Logo、圖示、影片封面、夥伴 Logo 牆、整張是連結的消息卡片不做放大', () => {
    for (const file of [
      'layout/SiteHeader.astro',
      'layout/SiteFooter.astro',
      'blocks/LogoWall.astro',
      'blocks/VideoPlaceholder.astro',
      'blocks/HeroBuilding.astro',
      'cards/NewsCard.astro',
      'cards/FeatureCard.astro',
    ]) {
      expect(src(file), file).not.toMatch(/Zoomable|\bzoom\b/);
    }
  });

  it('放大是 opt-in：MediaFigure 預設不放大', () => {
    expect(src('blocks/MediaFigure.astro')).toMatch(/zoom = false/);
  });

  it('放大視窗用原生 <dialog>，沒有鎖住手機縮放', () => {
    const z = src('ui/Zoomable.astro');
    expect(z).toContain("createElement('dialog')");
    expect(z).toContain('showModal()');
    expect(z).not.toMatch(/user-scalable|maximum-scale|touch-action:\s*none/);
    // 減少動態效果時不播動畫：動畫只寫在 no-preference 裡
    expect(z).toMatch(/prefers-reduced-motion: no-preference[\s\S]*animation/);
  });
});
