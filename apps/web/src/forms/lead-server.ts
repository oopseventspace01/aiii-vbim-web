// /api/lead 的處理邏輯（拆出來方便單元測試；SPEC 6.2）
import {
  CHECKLIST_NAMES,
  FORM_VERSION,
  JOB_ROLES,
  MODULES,
  PARTNER_TYPES,
  SITE_CHECKLIST,
  SITE_TYPES,
  type ChecklistKey,
  type Option,
} from './lead-form.config';
import { validateLead, type FieldError, type LeadInput } from './lead-schema';

export interface LeadConfig {
  webhookUrl?: string;
  secret?: string;
  turnstileSecret?: string;
  /** 需求表 Google 表單預填網址，含 LEAD_ID 佔位 */
  checklistForms: Partial<Record<ChecklistKey, string>>;
  /** 需求表 PDF 雲端硬碟連結（只放在確認信，不回傳給網頁） */
  checklistPdfs: Partial<Record<ChecklistKey, string>>;
  /** 本機開發／E2E：不驗證 Turnstile、不轉送 n8n，直接回成功 */
  dryRun: boolean;
  rateLimit?: { max: number; windowMs: number };
}

export type LeadResult =
  | { status: 200; body: { ok: true; leadCode: string; checklistUrl?: string } }
  | {
      status: 400 | 403 | 429 | 502 | 503;
      body: {
        ok: false;
        error: 'validation' | 'turnstile' | 'rate_limit' | 'upstream' | 'unavailable';
        fields?: Record<string, FieldError>;
      };
    };

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** 預約編號：L-年月日（台北時間）-4 碼，例如 L-261020-7KQ3 */
export function makeLeadCode(now: Date, random: (n: number) => Uint8Array = randomBytes) {
  const d = new Date(now.getTime() + 8 * 3600_000);
  const ymd = d.toISOString().slice(2, 10).replaceAll('-', '');
  const tail = Array.from(random(4), (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
  return `L-${ymd}-${tail}`;
}

function randomBytes(n: number) {
  return crypto.getRandomValues(new Uint8Array(n));
}

export function checklistFor(input: Pick<LeadInput, 'role' | 'siteType'>): ChecklistKey | null {
  if (input.role !== 'owner' || !input.siteType) return null;
  return SITE_CHECKLIST[input.siteType] ?? null;
}

export function fillLeadId(template: string | undefined, code: string) {
  if (!template || !template.includes('LEAD_ID')) return undefined;
  return template.replace('LEAD_ID', encodeURIComponent(code));
}

const zh = (list: Option[], id?: string) => list.find((o) => o.id === id)?.label['zh-Hant'] ?? '';

/** 轉送給 n8n 的內容（docs/n8n-lead-workflow.md 有範例） */
export function buildPayload(
  data: LeadInput,
  code: string,
  now: Date,
  config: Pick<LeadConfig, 'checklistForms' | 'checklistPdfs'>,
) {
  const key = checklistFor(data);
  const needType = data.siteType ?? data.partnerType ?? data.jobRole ?? data.module ?? null;
  const needTypeLabel =
    zh(SITE_TYPES, data.siteType) ||
    zh(PARTNER_TYPES, data.partnerType) ||
    zh(JOB_ROLES, data.jobRole) ||
    zh(MODULES, data.module);
  return {
    leadCode: code,
    formVersion: FORM_VERSION,
    submittedAt: now.toISOString(),
    variant: data.variant,
    role: data.role,
    needType,
    needTypeLabel,
    company: data.company,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    locale: data.locale,
    sourcePage: data.sourcePage,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    // 存進 Supabase details（jsonb）：身分專屬欄位
    details: {
      website: data.website || undefined,
      organization: data.organization || undefined,
      module: data.module,
      modules: data.modules.length ? data.modules : undefined,
      jobRole: data.jobRole,
    },
    checklist: key
      ? {
          key,
          name: CHECKLIST_NAMES[key],
          formUrl: fillLeadId(config.checklistForms[key], code),
          pdfUrl: config.checklistPdfs[key] || undefined,
        }
      : null,
  };
}

/** 同一個 IP 在時間窗內的送出次數（serverless 每個執行個體各自計算，只能擋掉大量灌單） */
const hits = new Map<string, number[]>();
export function isRateLimited(ip: string, now: number, limit: { max: number; windowMs: number }) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < limit.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit.max;
}
export function resetRateLimit() {
  hits.clear();
}

async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string,
  fetchFn: typeof fetch,
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetchFn('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export async function handleLead(
  raw: unknown,
  ctx: { ip: string; now: Date },
  config: LeadConfig,
  fetchFn: typeof fetch = fetch,
): Promise<LeadResult> {
  const checked = validateLead(raw);
  if (!checked.ok) {
    return { status: 400, body: { ok: false, error: 'validation', fields: checked.errors } };
  }
  const data = checked.data;
  const code = makeLeadCode(ctx.now);

  // 機器人：假裝成功，但不轉送
  if (data.honeypot) return { status: 200, body: { ok: true, leadCode: code } };

  if (
    !config.dryRun &&
    config.rateLimit &&
    isRateLimited(ctx.ip, ctx.now.getTime(), config.rateLimit)
  ) {
    return { status: 429, body: { ok: false, error: 'rate_limit' } };
  }

  const payload = buildPayload(data, code, ctx.now, config);
  const checklistUrl = payload.checklist?.formUrl;

  if (config.dryRun) {
    return { status: 200, body: { ok: true, leadCode: code, checklistUrl } };
  }

  // 正式環境少了設定就不能收件，絕不讓使用者以為已送出（SPEC 6.2）
  if (!config.webhookUrl || !config.secret || !config.turnstileSecret) {
    return { status: 503, body: { ok: false, error: 'unavailable' } };
  }

  if (!(await verifyTurnstile(config.turnstileSecret, data.turnstileToken, ctx.ip, fetchFn))) {
    return { status: 403, body: { ok: false, error: 'turnstile' } };
  }

  try {
    const res = await fetchFn(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Lead-Secret': config.secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: 502, body: { ok: false, error: 'upstream' } };
  } catch {
    return { status: 502, body: { ok: false, error: 'upstream' } };
  }

  return { status: 200, body: { ok: true, leadCode: code, checklistUrl } };
}
