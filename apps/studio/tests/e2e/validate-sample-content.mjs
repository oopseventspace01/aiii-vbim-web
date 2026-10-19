// 「Studio 可新增各類型內容（中英）」的自動檢查：
// 為 7 種內容類型 × 2 種語言產生一份範例文件，交給 Sanity CLI 用 Studio 同一套 schema 規則驗證。
// 只驗證、不寫入資料庫。範例文字是測試用，不會出現在網站上。
import '../../../../scripts/load-root-env.mjs';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
if (!projectId) {
  console.error('缺少 SANITY_STUDIO_PROJECT_ID（請確認根目錄 .env）');
  process.exit(1);
}

// 取一張種子腳本已上傳的圖片，當作範例圖片欄位的值
const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
url.searchParams.set('query', '*[_id == "siteSettings-zh-Hant"][0].heroPoster.asset._ref');
const assetId = (await (await fetch(url)).json()).result;
if (!assetId) {
  console.error('找不到範例圖片，請先執行 npm run seed');
  process.exit(1);
}

const img = (alt) => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt });
const block = (text) => [
  {
    _type: 'block',
    _key: 'b1',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text, marks: [] }],
  },
];
const base = (type, lang) => ({
  _id: `e2e-${type}-${lang}`,
  _type: type,
  language: lang,
  needsReview: false,
});

const docs = ['zh-Hant', 'en'].flatMap((lang) => [
  {
    ...base('siteSettings', lang),
    _id: `e2e-siteSettings-${lang}`,
    heroTitle: 'One OS. Every Building. Every System.',
    heroSubtitle: 'E2E',
    heroBody: 'E2E',
    heroPoster: img('E2E'),
    proofItems: [{ _key: 'p1', _type: 'proofItem', label: 'E2E', value: 'E2E' }],
    companyName: 'E2E',
    address: 'E2E',
    phone: 'E2E',
    email: 'E2E',
    footerTagline: 'E2E',
    seo: { _type: 'seo', metaTitle: 'E2E' },
  },
  {
    ...base('news', lang),
    title: 'E2E 測試活動',
    slug: { _type: 'slug', current: 'e2e-event' },
    category: 'event',
    publishedAt: '2026-01-01T00:00:00Z',
    excerpt: 'E2E',
    body: block('E2E'),
    eventLocation: 'E2E',
  },
  {
    ...base('solution', lang),
    name: 'E2E',
    slug: { _type: 'slug', current: 'e2e-solution' },
    tagline: 'E2E',
    pain: 'E2E',
    firstModule: 'E2E',
    integrationPoints: ['a', 'b', 'c', 'd'],
    order: 0,
  },
  {
    ...base('caseStudy', lang),
    isPublic: false,
    title: 'E2E',
    slug: { _type: 'slug', current: 'e2e-case' },
    solution: { _type: 'reference', _ref: `e2e-solution-${lang}` },
    clientDisplayName: 'E2E',
    pain: 'E2E',
    modules: ['E2E'],
    gallery: [{ ...img('E2E'), _key: 'g1' }],
  },
  {
    ...base('partner', lang),
    logoApproved: false,
    name: 'E2E',
    logo: img('E2E'),
    type: 'equipment',
    tier: 'technology',
    showOnHome: false,
  },
  {
    ...base('course', lang),
    title: 'E2E',
    slug: { _type: 'slug', current: 'e2e-course' },
    level: 'basic',
    summary: 'E2E',
    body: block('E2E'),
    sessions: [{ _key: 's1', _type: 'session', startDate: '2026-01-01', status: 'upcoming' }],
    registerMode: 'form',
  },
  {
    ...base('page', lang),
    title: 'E2E',
    slug: { _type: 'slug', current: 'e2e-page' },
    body: block('E2E'),
  },
]);

const dir = mkdtempSync(join(tmpdir(), 'aiii-e2e-'));
const file = join(dir, 'sample-content.ndjson');
writeFileSync(file, docs.map((d) => JSON.stringify(d)).join('\n'));
console.log(`驗證 ${docs.length} 份範例文件（7 種類型 × 中英文）…`);

const result = spawnSync(
  'npx',
  ['sanity', 'documents', 'validate', '--file', file, '-y', '--level', 'error'],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, SANITY_TELEMETRY_DISABLED: 'true' },
  },
);
process.exit(result.status ?? 1);
