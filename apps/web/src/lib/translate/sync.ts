// 最新消息「中文 → 英文」狀態同步（2026-11-13 業主指示：英文版跟著中文版的狀態走）
// - 中文存草稿：英文還不存在時，翻一份英文草稿（之後中文再改草稿不重翻，避免一直花費）
// - 中文發布：用發布的中文重新翻譯，英文一起發布（英文版若關掉「自動翻譯」，只發布英文草稿、不重翻）
// - 中文取消發布或刪除：英文改回草稿（不刪除，避免誤刪）
import type { SanityClient } from '@sanity/client';
import { applyTexts, collectTexts } from './collect';

export type Doc = Record<string, unknown> & { _id: string; _type: string; _rev?: string };

export type State = {
  /** 這次通知是中文「已發布版」還是「草稿」有變動 */
  event: 'published' | 'draft';
  zhPub: Doc | null;
  zhDraft: Doc | null;
  enPub: Doc | null;
  enDraft: Doc | null;
};

export type Action =
  | { type: 'none'; reason: string }
  | { type: 'translate-publish'; source: Doc }
  | { type: 'translate-draft'; source: Doc }
  | { type: 'publish-en-draft' }
  | { type: 'unpublish-en' };

const autoOff = (s: State) => (s.enDraft ?? s.enPub)?.autoTranslate === false;

/** 依中英文目前的狀態決定要做什麼（純函式，方便測試） */
export function decide(s: State): Action {
  if (s.event === 'published') {
    if (!s.zhPub) {
      return s.enPub
        ? { type: 'unpublish-en' }
        : { type: 'none', reason: '中文未發布，英文也未發布' };
    }
    if (autoOff(s)) {
      return s.enDraft
        ? { type: 'publish-en-draft' }
        : { type: 'none', reason: '英文版已關閉自動翻譯，且沒有新的英文草稿' };
    }
    if (s.enPub?.translatedFromRev === s.zhPub._rev) {
      return { type: 'none', reason: '英文已是這個中文版本的翻譯' };
    }
    return { type: 'translate-publish', source: s.zhPub };
  }
  if (s.zhDraft && !s.enPub && !s.enDraft) return { type: 'translate-draft', source: s.zhDraft };
  return { type: 'none', reason: '中文草稿變動，英文版已存在（發布時才會重翻）' };
}

const SYSTEM_FIELDS = ['_rev', '_createdAt', '_updatedAt', '_id'];

/** 由中文文件做出英文文件（翻譯文字、改語言、記下來源版本） */
export async function buildEnglish(
  source: Doc,
  enId: string,
  translate: (texts: string[], max: (number | undefined)[]) => Promise<string[]>,
  extra: Record<string, unknown>,
): Promise<Doc> {
  const base = Object.fromEntries(
    Object.entries(source).filter(([k]) => !SYSTEM_FIELDS.includes(k)),
  );
  const items = collectTexts(base);
  const out = await translate(
    items.map((i) => i.text),
    items.map((i) => i.max),
  );
  return {
    ...applyTexts(base, items, out),
    _id: enId,
    _type: source._type,
    language: 'en',
    autoTranslate: true,
    translatedFromRev: source._rev,
    ...extra,
  };
}

const publishedId = (id: string) => id.replace(/^drafts\./, '');

/** 讀取中英文四份文件（含草稿），英文版的 id 由雙語外掛的 translation.metadata 找 */
export async function loadState(client: SanityClient, zhId: string, event: State['event']) {
  const raw = client.withConfig({ perspective: 'raw' });
  const id = publishedId(zhId);
  const meta = await raw.fetch<{ _id: string; en?: string } | null>(
    `*[_type == "translation.metadata" && references($id)][0]{_id, "en": translations[_key == "en"][0].value._ref}`,
    { id },
  );
  const enId = meta?.en ?? `${id}-en`;
  const docs = await raw.fetch<Doc[]>(`*[_id in $ids]`, {
    ids: [id, `drafts.${id}`, enId, `drafts.${enId}`],
  });
  const get = (x: string) => docs.find((d) => d._id === x) ?? null;
  const zhAny = get(id) ?? get(`drafts.${id}`);
  const state: State = {
    event,
    zhPub: get(id),
    zhDraft: get(`drafts.${id}`),
    enPub: get(enId),
    enDraft: get(`drafts.${enId}`),
  };
  return { id, enId, metaId: meta?._id ?? null, hasEn: Boolean(meta?.en), state, zhAny };
}

/** 執行一次同步，回傳做了什麼（給記錄用） */
export async function syncNews(
  client: SanityClient,
  zhId: string,
  translate: (texts: string[], max: (number | undefined)[]) => Promise<string[]>,
): Promise<string> {
  const event: State['event'] = zhId.startsWith('drafts.') ? 'draft' : 'published';
  const { id, enId, metaId, hasEn, state, zhAny } = await loadState(client, zhId, event);
  if (zhAny && zhAny.language !== 'zh-Hant') return '略過：不是中文文件';
  const action = decide(state);
  const tx = client.transaction();

  if (action.type === 'none') return `不需處理：${action.reason}`;

  if (action.type === 'translate-publish' || action.type === 'translate-draft') {
    const isPublish = action.type === 'translate-publish';
    const doc = await buildEnglish(action.source, isPublish ? enId : `drafts.${enId}`, translate, {
      // 中文發布前已審過稿，英文跟著可發布；草稿則沿用中文的待審狀態
      needsReview: isPublish ? false : (action.source.needsReview ?? true),
    });
    tx.createOrReplace(doc);
    if (isPublish) tx.delete(`drafts.${enId}`);
  } else if (action.type === 'publish-en-draft') {
    const { _rev, _createdAt, _updatedAt, ...rest } = state.enDraft!;
    void _rev;
    void _createdAt;
    void _updatedAt;
    tx.createOrReplace({ ...rest, _id: enId, needsReview: false });
    tx.delete(`drafts.${enId}`);
  } else if (action.type === 'unpublish-en') {
    if (!state.enDraft) {
      const { _rev, _createdAt, _updatedAt, ...rest } = state.enPub!;
      void _rev;
      void _createdAt;
      void _updatedAt;
      tx.createIfNotExists({ ...rest, _id: `drafts.${enId}` });
    }
    tx.delete(enId);
  }

  // 雙語外掛的連結：中英文還沒連起來就補上
  if (!hasEn) {
    const ref = (lang: string, to: string) => ({
      _key: lang,
      _type: 'internationalizedArrayReferenceValue',
      language: lang,
      value: { _type: 'reference', _ref: to, _weak: true },
    });
    if (metaId) {
      tx.patch(metaId, (p) =>
        p.setIfMissing({ translations: [] }).append('translations', [ref('en', enId)]),
      );
    } else {
      tx.createIfNotExists({
        _id: `translation-metadata-news-${id}`,
        _type: 'translation.metadata',
        schemaTypes: ['news'],
        translations: [ref('zh-Hant', id), ref('en', enId)],
      });
    }
  }
  await tx.commit();
  return `完成：${action.type}（${enId}）`;
}
