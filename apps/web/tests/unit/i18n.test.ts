import { describe, expect, it } from 'vitest';
import { getLocaleFromPath, localizePath, stripLocale, switchLocalePath } from '../../src/lib/i18n';

describe('getLocaleFromPath', () => {
  it.each([
    ['/', 'zh-Hant'],
    ['/platform', 'zh-Hant'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/en/platform', 'en'],
    ['/english-page', 'zh-Hant'],
  ])('%s → %s', (path, locale) => expect(getLocaleFromPath(path)).toBe(locale));
});

describe('stripLocale', () => {
  it.each([
    ['/en', '/'],
    ['/en/', '/'],
    ['/en/news/abc', '/news/abc'],
    ['/news/', '/news'],
    ['/', '/'],
    ['/en/contact?role=owner', '/contact?role=owner'],
  ])('%s → %s', (path, out) => expect(stripLocale(path)).toBe(out));
});

describe('localizePath', () => {
  it('中文不加前綴', () => expect(localizePath('/platform', 'zh-Hant')).toBe('/platform'));
  it('英文加 /en', () => expect(localizePath('/platform', 'en')).toBe('/en/platform'));
  it('首頁英文為 /en', () => expect(localizePath('/', 'en')).toBe('/en'));
  it('已是英文路徑不會重複加前綴', () =>
    expect(localizePath('/en/platform', 'en')).toBe('/en/platform'));
  it('保留查詢字串', () =>
    expect(localizePath('/contact?role=owner', 'en')).toBe('/en/contact?role=owner'));
});

describe('switchLocalePath（語言切換來回）', () => {
  it.each(['/', '/platform', '/news/some-slug', '/solutions/hospital'])(
    '%s → en → zh 回到原路徑',
    (path) => {
      const en = switchLocalePath(path, 'en');
      expect(en.startsWith('/en')).toBe(true);
      expect(switchLocalePath(en, 'zh-Hant')).toBe(path);
    },
  );
});
