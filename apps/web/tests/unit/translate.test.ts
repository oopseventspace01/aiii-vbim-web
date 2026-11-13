// 最新消息自動翻譯：挑出要翻的文字、放回原位、中英文狀態同步的判斷（不呼叫 Claude）
import { describe, expect, it } from 'vitest';
import { applyTexts, collectTexts } from '../../src/lib/translate/collect';
import { buildEnglish, decide, type Doc, type State } from '../../src/lib/translate/sync';

const zh: Doc = {
  _id: 'news-1',
  _rev: 'rev-zh-1',
  _type: 'news',
  _createdAt: '2026-11-13T00:00:00Z',
  language: 'zh-Hant',
  needsReview: false,
  title: '新品發表',
  slug: { _type: 'slug', current: 'new-launch' },
  category: 'product',
  publishedAt: '2026-11-13T00:00:00Z',
  excerpt: '一句摘要',
  cover: { _type: 'image', asset: { _type: 'reference', _ref: 'image-abc' }, alt: '封面' },
  body: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com' }],
      children: [
        { _type: 'span', _key: 's1', text: '第一段', marks: [] },
        { _type: 'span', _key: 's2', text: '連結', marks: ['l1'] },
        { _type: 'span', _key: 's3', text: ' ', marks: [] },
      ],
    },
    { _type: 'ctaButton', _key: 'c1', label: '立即預約', url: '/contact' },
  ],
  seo: { _type: 'seo', metaTitle: 'SEO 標題', metaDescription: 'SEO 描述' },
};

describe('collectTexts／applyTexts', () => {
  it('只挑人看得到的文字，網址、代稱、分類、空白不翻', () => {
    const texts = collectTexts(zh).map((t) => t.text);
    expect(texts).toEqual([
      '新品發表',
      '一句摘要',
      '封面',
      '第一段',
      '連結',
      '立即預約',
      'SEO 標題',
      'SEO 描述',
    ]);
  });

  it('標題、摘要、SEO 帶字數上限', () => {
    const items = collectTexts(zh);
    expect(items.find((i) => i.text === '新品發表')?.max).toBe(70);
    expect(items.find((i) => i.text === '一句摘要')?.max).toBe(120);
    expect(items.find((i) => i.text === '第一段')?.max).toBeUndefined();
  });

  it('放回原位，不改動原文件、保留連結與結構', () => {
    const items = collectTexts(zh);
    const out = applyTexts(
      zh,
      items,
      items.map((i) => `EN:${i.text}`),
    );
    expect(out.title).toBe('EN:新品發表');
    const block = (out.body as { children: { text: string; marks: string[] }[] }[])[0]!;
    expect(block.children.map((c) => c.text)).toEqual(['EN:第一段', 'EN:連結', ' ']);
    expect(block.children[1]!.marks).toEqual(['l1']);
    expect(zh.title).toBe('新品發表');
  });

  it('翻譯數量不符時直接報錯，不寫入半套內容', () => {
    expect(() => applyTexts(zh, collectTexts(zh), ['only one'])).toThrow('翻譯數量不符');
  });
});

describe('buildEnglish', () => {
  it('產生英文版：語言 en、記下來源版本、去掉系統欄位、保留代稱與圖片', async () => {
    const en = await buildEnglish(zh, 'news-1-en', async (t) => t.map((x) => `EN:${x}`), {
      needsReview: false,
    });
    expect(en._id).toBe('news-1-en');
    expect(en.language).toBe('en');
    expect(en.translatedFromRev).toBe('rev-zh-1');
    expect(en.autoTranslate).toBe(true);
    expect(en._rev).toBeUndefined();
    expect(en._createdAt).toBeUndefined();
    expect(en.slug).toEqual(zh.slug);
    expect((en.cover as { asset: unknown }).asset).toEqual({
      _type: 'reference',
      _ref: 'image-abc',
    });
  });
});

describe('decide：英文跟著中文的狀態', () => {
  const en = (extra: Record<string, unknown> = {}): Doc => ({
    _id: 'news-1-en',
    _type: 'news',
    ...extra,
  });
  const base: State = {
    event: 'published',
    zhPub: null,
    zhDraft: null,
    enPub: null,
    enDraft: null,
  };

  it('中文發布、英文還沒有 → 翻譯並發布', () => {
    expect(decide({ ...base, zhPub: zh }).type).toBe('translate-publish');
  });

  it('中文發布了新版本 → 重新翻譯並發布', () => {
    const s = { ...base, zhPub: zh, enPub: en({ translatedFromRev: 'rev-old' }) };
    expect(decide(s).type).toBe('translate-publish');
  });

  it('英文已是這個版本的翻譯 → 不重複翻譯（避免重複收費）', () => {
    const s = { ...base, zhPub: zh, enPub: en({ translatedFromRev: 'rev-zh-1' }) };
    expect(decide(s).type).toBe('none');
  });

  it('英文關掉自動翻譯 → 有英文草稿就發布它，不覆蓋', () => {
    const s = { ...base, zhPub: zh, enDraft: en({ autoTranslate: false }) };
    expect(decide(s).type).toBe('publish-en-draft');
    const s2 = { ...base, zhPub: zh, enPub: en({ autoTranslate: false }) };
    expect(decide(s2).type).toBe('none');
  });

  it('中文取消發布 → 英文改回草稿', () => {
    expect(decide({ ...base, enPub: en() }).type).toBe('unpublish-en');
    expect(decide(base).type).toBe('none');
  });

  it('中文存草稿、英文還沒有 → 翻一份英文草稿', () => {
    expect(decide({ ...base, event: 'draft', zhDraft: zh }).type).toBe('translate-draft');
  });

  it('中文繼續改草稿、英文已存在 → 不重翻（發布時才翻）', () => {
    expect(decide({ ...base, event: 'draft', zhDraft: zh, enDraft: en() }).type).toBe('none');
    expect(decide({ ...base, event: 'draft', zhDraft: zh, enPub: en() }).type).toBe('none');
  });
});
