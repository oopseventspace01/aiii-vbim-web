/**
 * 種子資料匯入（SPEC 第 15 節）：13 則媒體報導＋3 則產品發表（中英）＋全站設定（中英）。
 *
 * 執行（在專案根目錄）：npm run seed
 *   - 使用你在 `npx sanity login` 登入的帳號權限，不需要另外的 token。
 *   - 預設「只新增不存在的文件」，重複執行不會覆蓋業主在後台改過的內容。
 *   - 要用種子資料覆蓋既有文件時，改執行：npm run seed:force
 * 封面圖片重複上傳時，Sanity 會自動辨識為同一張，不會重複佔空間。
 */
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import {
  APP_LINKS,
  HERO_POSTER_FILE,
  MEDIA_NEWS,
  PRODUCT_NEWS,
  SITE_SETTINGS,
  sortableDates,
} from './seed-data';

type Lang = 'zh-Hant' | 'en';
type Doc = { _id: string; _type: string } & Record<string, unknown>;

const FORCE = process.argv.includes('--force');
const client = getCliClient({ apiVersion: '2025-02-19' });
const assetsDir = fileURLToPath(new URL('../design/assets/', import.meta.url));

const uploaded = new Map<string, string>();
async function uploadImage(file: string): Promise<string> {
  const cached = uploaded.get(file);
  if (cached) return cached;
  const asset = await client.assets.upload('image', createReadStream(assetsDir + file), {
    filename: file,
  });
  uploaded.set(file, asset._id);
  return asset._id;
}

const image = (assetId: string, alt: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt,
});

/** 雙語外掛用來連結中英文版本的 translation.metadata 文件 */
function translationMetadata(id: string, schemaType: string, refs: Record<Lang, string>): Doc {
  return {
    _id: id,
    _type: 'translation.metadata',
    schemaTypes: [schemaType],
    translations: (Object.entries(refs) as [Lang, string][]).map(([language, ref]) => ({
      _key: language,
      _type: 'internationalizedArrayReferenceValue',
      language,
      value: { _type: 'reference', _ref: ref, _weak: true },
    })),
  };
}

async function buildSiteSettings(): Promise<Doc[]> {
  const posterId = await uploadImage(HERO_POSTER_FILE);
  const docs: Doc[] = (['zh', 'en'] as const).map((key) => {
    const s = SITE_SETTINGS[key];
    const language: Lang = key === 'zh' ? 'zh-Hant' : 'en';
    return {
      _id: `siteSettings-${language}`,
      _type: 'siteSettings',
      language,
      needsReview: false,
      heroTitle: s.heroTitle,
      heroSubtitle: s.heroSubtitle,
      heroBody: s.heroBody,
      heroPoster: image(posterId, s.heroPosterAlt),
      proofItems: s.proofItems.map((p, i) => ({ _key: `proof-${i}`, _type: 'proofItem', ...p })),
      companyName: s.companyName,
      address: s.address,
      phone: s.phone,
      email: s.email,
      ...APP_LINKS,
      footerTagline: s.footerTagline,
      homeNewsCount: 3,
      seo: {
        _type: 'seo',
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
        noIndex: false,
      },
    };
  });
  docs.push(
    translationMetadata('translation-metadata-siteSettings', 'siteSettings', {
      'zh-Hant': 'siteSettings-zh-Hant',
      en: 'siteSettings-en',
    }),
  );
  return docs;
}

async function buildMediaNews(): Promise<Doc[]> {
  const dates = sortableDates(MEDIA_NEWS.map((n) => n.date));
  const docs: Doc[] = [];
  for (const [i, item] of MEDIA_NEWS.entries()) {
    const coverId = await uploadImage(item.cover);
    const ids: Record<Lang, string> = {
      'zh-Hant': `news-media-${item.key}-zh-Hant`,
      en: `news-media-${item.key}-en`,
    };
    for (const [language, text] of [
      ['zh-Hant', item.zh],
      ['en', item.en],
    ] as const) {
      docs.push({
        _id: ids[language],
        _type: 'news',
        language,
        needsReview: false,
        title: text.title,
        slug: { _type: 'slug', current: item.key },
        category: 'media',
        source: text.source,
        externalUrl: item.url,
        publishedAt: dates[i],
        displayDate: item.date,
        cover: image(coverId, text.title),
        excerpt: text.excerpt,
      });
    }
    docs.push(translationMetadata(`translation-metadata-news-media-${item.key}`, 'news', ids));
  }
  return docs;
}

async function buildProductNews(): Promise<Doc[]> {
  const dates = sortableDates(PRODUCT_NEWS.map((n) => n.date));
  const docs: Doc[] = [];
  for (const [i, item] of PRODUCT_NEWS.entries()) {
    const coverId = await uploadImage(item.cover);
    const ids: Record<Lang, string> = {
      'zh-Hant': `news-product-${item.key}-zh-Hant`,
      en: `news-product-${item.key}-en`,
    };
    for (const [language, text] of [
      ['zh-Hant', item.zh],
      ['en', item.en],
    ] as const) {
      docs.push({
        _id: ids[language],
        _type: 'news',
        language,
        needsReview: false,
        title: text.title,
        slug: { _type: 'slug', current: item.key },
        category: 'product',
        internalPath: item.internalPath,
        publishedAt: dates[i],
        displayDate: item.date,
        cover: image(coverId, text.alt),
        excerpt: text.excerpt,
      });
    }
    docs.push(translationMetadata(`translation-metadata-news-product-${item.key}`, 'news', ids));
  }
  return docs;
}

async function main() {
  const { projectId, dataset } = client.config();
  console.log(
    `匯入目標：專案 ${projectId}／dataset ${dataset}${FORCE ? '（--force：覆蓋既有文件）' : ''}`,
  );

  const docs = [
    ...(await buildSiteSettings()),
    ...(await buildMediaNews()),
    ...(await buildProductNews()),
  ];
  const tx = client.transaction();
  for (const doc of docs) {
    if (FORCE) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }
  // v1.4 新增的欄位：已存在的全站設定只補上預設值，不覆蓋業主改過的內容
  for (const id of ['siteSettings-zh-Hant', 'siteSettings-en']) {
    tx.patch(id, (p) => p.setIfMissing({ homeNewsCount: 3 }));
  }
  await tx.commit({ visibility: 'sync' });

  console.log(
    `完成：處理 ${docs.length} 份文件（含中英文版與連結資料），上傳 ${uploaded.size} 張圖片。`,
  );
}

main().catch((error) => {
  console.error('匯入失敗：', error instanceof Error ? error.message : error);
  process.exit(1);
});
