import { describe, expect, it } from 'vitest';
import {
  altRequired,
  bodyRequiredUnlessMedia,
  englishLengthHint,
  maxLengthForLanguage,
  requiredForExternal,
  requiredForMedia,
  reviewGate,
} from '../../schemas/lib/rules';

describe('待審稿（reviewGate）', () => {
  it('勾選時擋住發布', () => expect(reviewGate(true)).toMatch(/待審稿/));
  it('取消勾選後可發布', () => expect(reviewGate(false)).toBe(true));
  it('舊文件沒有此欄位時不擋', () => expect(reviewGate(undefined)).toBe(true));
});

describe('媒體報導必填欄位（requiredForMedia）', () => {
  it('媒體報導缺媒體名稱 → 錯誤', () => expect(requiredForMedia('media', '')).toMatch(/必填/));
  it('媒體報導有值 → 通過', () => expect(requiredForMedia('media', 'Yahoo News')).toBe(true));
  it('其他分類不需要 → 通過', () => expect(requiredForMedia('news', undefined)).toBe(true));
});

describe('消息內文（bodyRequiredUnlessMedia）', () => {
  it('一般新聞沒有內文 → 錯誤', () => expect(bodyRequiredUnlessMedia('news', [])).toMatch(/必填/));
  it('一般新聞有內文 → 通過', () =>
    expect(bodyRequiredUnlessMedia('event', [{ _type: 'block' }])).toBe(true));
  it('媒體報導不需要內文 → 通過', () =>
    expect(bodyRequiredUnlessMedia('media', undefined)).toBe(true));
});

describe('課程外部報名網址（requiredForExternal）', () => {
  it('外部報名但沒網址 → 錯誤', () =>
    expect(requiredForExternal('external', undefined)).toMatch(/必填/));
  it('網站表單報名不需要 → 通過', () => expect(requiredForExternal('form', undefined)).toBe(true));
});

describe('圖片替代文字（altRequired）', () => {
  it('有圖沒 alt → 錯誤', () => expect(altRequired({ asset: { _ref: 'x' } })).toMatch(/替代文字/));
  it('有圖有 alt → 通過', () =>
    expect(altRequired({ asset: { _ref: 'x' }, alt: '說明' })).toBe(true));
  it('空白 alt 視為沒填 → 錯誤', () =>
    expect(altRequired({ asset: { _ref: 'x' }, alt: '  ' })).toMatch(/替代文字/));
  it('沒上傳圖片 → 交給必填規則處理', () => expect(altRequired(undefined)).toBe(true));
});

describe('字數上限（中文錯誤、英文提醒）', () => {
  const zh61 = '字'.repeat(61);
  const en61 = 'a'.repeat(61);
  it('中文 60 字內 → 通過', () =>
    expect(maxLengthForLanguage('zh-Hant', '字'.repeat(60), 60)).toBe(true));
  it('中文超過 → 錯誤並顯示字數', () =>
    expect(maxLengthForLanguage('zh-Hant', zh61, 60)).toMatch(/61/));
  it('英文超過 → 不算錯誤', () => expect(maxLengthForLanguage('en', en61, 60)).toBe(true));
  it('英文超過 → 給提醒', () => expect(englishLengthHint('en', en61, 60)).toMatch(/61/));
  it('中文不會出現英文提醒', () => expect(englishLengthHint('zh-Hant', zh61, 60)).toBe(true));
});
