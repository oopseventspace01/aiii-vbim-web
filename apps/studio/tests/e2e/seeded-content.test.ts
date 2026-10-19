// 整體流程：Studio schema → 種子腳本 → Sanity → 網站可用的公開 API。
// 用網站之後會用的同一個公開讀取 API 確認內容存在、中英文版有正確連結。
import '../../../../scripts/load-root-env.mjs';
import { describe, expect, it } from 'vitest';
import { MEDIA_NEWS } from '../../../../scripts/seed-data';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set('query', groq);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity 查詢失敗：HTTP ${res.status}`);
  return ((await res.json()) as { result: T }).result;
}

describe.skipIf(!projectId)('Sanity 種子內容（需要 .env 的 PUBLIC_SANITY_PROJECT_ID）', () => {
  it.each(['zh-Hant', 'en'])('全站設定（%s）存在且已發布', async (language) => {
    const doc = await query<{ heroTitle: string; proofCount: number } | null>(
      `*[_id == $id][0]{heroTitle, "proofCount": count(proofItems)}`,
      { id: `siteSettings-${language}` },
    );
    expect(doc?.heroTitle).toBe('One OS. Every Building. Every System.');
    expect(doc?.proofCount).toBe(4);
  });

  it.each(['zh-Hant', 'en'])('媒體報導（%s）13 則都有封面與外部連結', async (language) => {
    const items = await query<{ key: string; hasCover: boolean; externalUrl: string }[]>(
      `*[_type == "news" && category == "media" && language == $language && slug.current in $keys]{
        "key": slug.current, "hasCover": defined(cover.asset), externalUrl
      }`,
      { language, keys: MEDIA_NEWS.map((n) => n.key) },
    );
    expect(items).toHaveLength(13);
    for (const item of items) {
      expect(item.hasCover, item.key).toBe(true);
      expect(item.externalUrl).toMatch(/^https:\/\//);
    }
  });

  it('每則媒體報導的中英文版都已互相連結（translation.metadata）', async () => {
    const linked = await query<{ key: string; langs: string[] }[]>(
      `*[_type == "news" && category == "media" && language == "zh-Hant"]{
        "key": slug.current,
        "langs": *[_type == "translation.metadata" && references(^._id)][0].translations[].value->language
      }`,
    );
    const seeded = linked.filter((l) => MEDIA_NEWS.some((n) => n.key === l.key));
    expect(seeded).toHaveLength(13);
    for (const item of seeded) expect([...item.langs].sort(), item.key).toEqual(['en', 'zh-Hant']);
  });

  it('依發布時間排序後，順序與設計稿相同', async () => {
    const keys = await query<string[]>(
      `*[_type == "news" && category == "media" && language == "zh-Hant" && slug.current in $keys]
        | order(publishedAt desc).slug.current`,
      { keys: MEDIA_NEWS.map((n) => n.key) },
    );
    expect(keys).toEqual(MEDIA_NEWS.map((n) => n.key));
  });
});
