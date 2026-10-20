// P5 表單：驗證規則、預約編號、需求表對應、/api/lead 處理邏輯，以及表單文字與設計稿逐字一致
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  JOB_ROLES,
  LABELS,
  MODULES,
  PARTNER_TYPES,
  ROLES,
  SITE_CHECKLIST,
  SITE_TYPES,
  VARIANT_TEXT,
} from '../../src/forms/lead-form.config';
import { fieldRules, validateLead } from '../../src/forms/lead-schema';
import {
  buildPayload,
  checklistFor,
  fillLeadId,
  handleLead,
  isRateLimited,
  makeLeadCode,
  resetRateLimit,
  type LeadConfig,
} from '../../src/forms/lead-server';

const owner = {
  variant: 'contact',
  role: 'owner',
  locale: 'zh-Hant',
  company: '測試公司',
  name: '王小明',
  email: 'test@example.com',
  siteType: 'factory',
  consent: true,
  turnstileToken: 'test-token',
};
const partner = {
  variant: 'partner',
  role: 'partner',
  locale: 'zh-Hant',
  company: '測試空調',
  partnerType: 'hvac',
  name: '李小華',
  email: 'p@example.com',
  website: 'https://example.com',
  message: '空調控制器',
  consent: true,
};
const talent = {
  variant: 'academy',
  role: 'talent',
  locale: 'en',
  name: 'Chen',
  email: 't@example.com',
  organization: 'Studio',
  jobRole: 'architect',
  modules: ['bim', 'edge-ai'],
  consent: true,
};

const FORM_URL = 'https://docs.google.com/forms/d/e/x/viewform?usp=pp_url&entry.1=LEAD_ID';
const config = (over: Partial<LeadConfig> = {}): LeadConfig => ({
  webhookUrl: 'https://n8n.example.com/webhook/lead',
  secret: 'test-secret',
  turnstileSecret: 'test-turnstile',
  checklistForms: { manufacturing: FORM_URL },
  checklistPdfs: { manufacturing: 'https://drive.google.com/x' },
  dryRun: false,
  rateLimit: { max: 2, windowMs: 60_000 },
  ...over,
});
const ctx = { ip: '1.2.3.4', now: new Date('2026-10-20T07:00:00Z') };

describe('驗證規則', () => {
  it('三種身分的合格資料都通過', () => {
    expect(validateLead(owner).ok).toBe(true);
    expect(validateLead(partner).ok).toBe(true);
    expect(validateLead(talent).ok).toBe(true);
  });

  it('業主的「想解決的問題」是選填；夥伴、人才（聯絡頁）必填', () => {
    expect(fieldRules('contact', 'owner').required.message).toBe(false);
    expect(fieldRules('contact', 'partner').required.message).toBe(true);
    expect(fieldRules('contact', 'talent').required.message).toBe(true);
    expect(fieldRules('academy', 'talent').show.message).toBe(false);
    const r = validateLead({ ...partner, message: '' });
    expect(r.ok === false && r.errors.message).toBe('required');
  });

  it('必填、Email 格式、網址格式、同意條款', () => {
    const r = validateLead({ ...owner, name: ' ', email: 'abc', company: '', consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toMatchObject({
        name: 'required',
        email: 'email',
        company: 'required',
        consent: 'consent',
      });
    }
    const w = validateLead({ ...partner, website: 'example' });
    expect(w.ok === false && w.errors.website).toBe('url');
  });

  it('不存在的選項、太長的內容會被擋下', () => {
    const bad = validateLead({ ...owner, siteType: 'moon' });
    expect(bad.ok === false && bad.errors.siteType).toBe('invalid');
    const long = validateLead({ ...owner, message: 'x'.repeat(2001) });
    expect(long.ok === false && long.errors.message).toBe('tooLong');
  });

  it('只保留該身分會看到的欄位', () => {
    const r = validateLead({
      ...talent,
      company: '不該出現',
      siteType: 'factory',
      variant: 'academy',
    });
    expect(r.ok && r.data.company).toBe('');
    expect(r.ok && r.data.siteType).toBeUndefined();
  });

  it('夥伴頁、學院頁不能偽造成其他身分', () => {
    expect(validateLead({ ...partner, role: 'owner' }).ok).toBe(false);
  });
});

describe('預約編號與需求表', () => {
  it('預約編號格式 L-年月日-4 碼（台北時間）', () => {
    const code = makeLeadCode(new Date('2026-10-20T17:00:00Z'));
    expect(code).toMatch(/^L-261021-[A-HJ-NP-Z2-9]{4}$/);
  });

  it('場域 → 需求表（2026-10-20 業主確認的對應）', () => {
    expect(SITE_CHECKLIST).toEqual({
      hospital: 'medical',
      retail: 'retail',
      factory: 'manufacturing',
      office: 'building',
      energy: 'building',
      architect: 'building',
      other: 'building',
    });
    for (const s of SITE_TYPES) expect(SITE_CHECKLIST[s.id]).toBeTruthy();
    expect(checklistFor({ role: 'partner', siteType: 'factory' })).toBeNull();
  });

  it('預填網址把 LEAD_ID 換成預約編號；沒有設定就不給連結', () => {
    expect(fillLeadId(FORM_URL, 'L-261020-AB2C')).toBe(
      FORM_URL.replace('LEAD_ID', 'L-261020-AB2C'),
    );
    expect(fillLeadId(undefined, 'x')).toBeUndefined();
    expect(fillLeadId('https://no-placeholder', 'x')).toBeUndefined();
  });

  it('轉送內容包含需求表與身分專屬欄位', () => {
    const r = validateLead(owner);
    if (!r.ok) throw new Error('should pass');
    const p = buildPayload(r.data, 'L-261020-AB2C', ctx.now, config());
    expect(p).toMatchObject({
      leadCode: 'L-261020-AB2C',
      role: 'owner',
      needType: 'factory',
      needTypeLabel: '工廠／科技廠',
      checklist: {
        key: 'manufacturing',
        name: '智慧製造需求檢查表',
        pdfUrl: 'https://drive.google.com/x',
      },
    });
    expect(p.checklist?.formUrl).toContain('L-261020-AB2C');
  });
});

describe('/api/lead 處理邏輯', () => {
  beforeEach(() => resetRateLimit());

  it('成功：驗證 Turnstile、帶密鑰轉送 n8n、回傳編號與需求表連結', async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) =>
      String(url).includes('turnstile')
        ? Response.json({ success: true })
        : new Response('{"ok":true}', { status: 200 }),
    );
    const r = await handleLead(owner, ctx, config(), fetchFn as typeof fetch);
    expect(r.status).toBe(200);
    expect(r.body.ok && r.body.checklistUrl).toContain('docs.google.com');
    const [, init] = fetchFn.mock.calls[1] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>)['X-Lead-Secret']).toBe('test-secret');
    expect(JSON.parse(String(init.body)).email).toBe('test@example.com');
  });

  it('欄位錯誤回 400，且不會呼叫外部服務', async () => {
    const fetchFn = vi.fn();
    const r = await handleLead({ ...owner, email: '' }, ctx, config(), fetchFn as typeof fetch);
    expect(r.status).toBe(400);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('機器人（隱藏欄位有值）：假裝成功但不轉送', async () => {
    const fetchFn = vi.fn();
    const r = await handleLead(
      { ...owner, honeypot: 'spam' },
      ctx,
      config(),
      fetchFn as typeof fetch,
    );
    expect(r.status).toBe(200);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('Turnstile 驗證失敗回 403', async () => {
    const fetchFn = vi.fn(async () => Response.json({ success: false }));
    const r = await handleLead(owner, ctx, config(), fetchFn as typeof fetch);
    expect(r.status).toBe(403);
  });

  it('n8n 失敗回 502，絕不回成功（SPEC 6.2）', async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) =>
      String(url).includes('turnstile')
        ? Response.json({ success: true })
        : new Response('', { status: 500 }),
    );
    const r = await handleLead(owner, ctx, config(), fetchFn as typeof fetch);
    expect(r.status).toBe(502);
    expect(r.body.ok).toBe(false);
  });

  it('正式環境少了設定回 503', async () => {
    const r = await handleLead(
      owner,
      ctx,
      config({ webhookUrl: undefined }),
      vi.fn() as typeof fetch,
    );
    expect(r.status).toBe(503);
  });

  it('同一 IP 送太多次回 429', async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) =>
      String(url).includes('turnstile') ? Response.json({ success: true }) : new Response('ok'),
    );
    const f = fetchFn as typeof fetch;
    expect((await handleLead(owner, ctx, config(), f)).status).toBe(200);
    expect((await handleLead(owner, ctx, config(), f)).status).toBe(200);
    expect((await handleLead(owner, ctx, config(), f)).status).toBe(429);
    expect(isRateLimited('5.6.7.8', ctx.now.getTime(), { max: 2, windowMs: 60_000 })).toBe(false);
  });

  it('本機模擬模式：不呼叫外部服務，直接回成功', async () => {
    const fetchFn = vi.fn();
    const r = await handleLead(
      owner,
      ctx,
      config({ dryRun: true, webhookUrl: undefined }),
      fetchFn as typeof fetch,
    );
    expect(r.status).toBe(200);
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('表單文字與設計稿逐字一致', () => {
  const read = (name: string) =>
    readFileSync(new URL(`../../../../design/pages/${name}.dc.html`, import.meta.url), 'utf-8');
  const zh = ['Contact', 'Partners', 'Academy'].map(read).join('\n');
  const en = ['en-Contact', 'en-Partners', 'en-Academy'].map(read).join('\n');

  it('欄位標籤、選項、按鈕、成功訊息都出現在設計稿', () => {
    const lists = [...ROLES, ...SITE_TYPES, ...PARTNER_TYPES, ...MODULES, ...JOB_ROLES];
    const texts = [
      ...lists.map((o) => o.label),
      ...ROLES.map((r) => r.message),
      ...Object.values(LABELS),
      ...Object.values(VARIANT_TEXT).flatMap((v) => [v.submit, v.success]),
    ];
    for (const t of texts) {
      expect(zh, t['zh-Hant']).toContain(t['zh-Hant']);
      expect(en, t.en).toContain(t.en);
    }
  });
});
