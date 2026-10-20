// 表單驗證規則：瀏覽器與 /api/lead 共用同一份（SPEC 6.4）
import { z } from 'astro/zod';
import {
  JOB_ROLES,
  LIMITS,
  MODULES,
  PARTNER_TYPES,
  SITE_TYPES,
  VARIANT_ROLE,
  type FormVariant,
  type Role,
} from './lead-form.config';

/** 錯誤代碼 → 介面文字見 FORM_UI（fieldRequired、fieldEmail…） */
export type FieldError = 'required' | 'email' | 'url' | 'tooLong' | 'consent' | 'invalid';

const ids = (list: { id: string }[]) => list.map((o) => o.id) as [string, ...string[]];
const text = (max: number) => z.string().trim().max(max).optional().default('');

export const leadInputSchema = z.object({
  variant: z.enum(['contact', 'partner', 'academy']),
  role: z.enum(['owner', 'partner', 'talent']),
  locale: z.enum(['zh-Hant', 'en']),
  name: text(LIMITS.short),
  email: text(LIMITS.long),
  phone: text(LIMITS.phone),
  company: text(LIMITS.long),
  website: text(LIMITS.long),
  organization: text(LIMITS.long),
  message: text(LIMITS.message),
  siteType: z.enum(ids(SITE_TYPES)).optional(),
  partnerType: z.enum(ids(PARTNER_TYPES)).optional(),
  module: z.enum(ids(MODULES)).optional(),
  modules: z
    .array(z.enum(ids(MODULES)))
    .max(MODULES.length)
    .optional()
    .default([]),
  jobRole: z.enum(ids(JOB_ROLES)).optional(),
  consent: z.boolean(),
  sourcePage: text(LIMITS.long),
  utmSource: text(LIMITS.short),
  utmMedium: text(LIMITS.short),
  utmCampaign: text(LIMITS.short),
  /** 隱藏欄位：真人看不到，有值代表是機器人 */
  honeypot: z.string().optional().default(''),
  turnstileToken: z.string().max(4096).optional().default(''),
});

export type LeadInput = z.output<typeof leadInputSchema>;

/** 每個身分 × 頁面要顯示、要必填的欄位（元件與驗證共用） */
export function fieldRules(variant: FormVariant, role: Role) {
  const show = {
    company: role !== 'talent',
    website: variant === 'partner',
    organization: variant === 'academy',
    siteType: role === 'owner',
    partnerType: role === 'partner',
    module: variant === 'contact' && role === 'talent',
    modules: variant === 'academy',
    jobRole: variant === 'academy',
    message: variant !== 'academy',
  };
  const required = {
    company: show.company,
    siteType: show.siteType,
    partnerType: show.partnerType,
    // 2026-10-20 業主決定：業主的「想解決的問題」改為選填；夥伴、人才依設計稿必填
    message: show.message && role !== 'owner',
  };
  return { show, required };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 依身分檢查必填與格式，回傳 { 欄位: 錯誤代碼 } */
export function validateLead(
  raw: unknown,
): { ok: true; data: LeadInput } | { ok: false; errors: Record<string, FieldError> } {
  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, FieldError> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] = issue.code === 'too_big' ? 'tooLong' : 'invalid';
    }
    return { ok: false, errors };
  }
  const d = parsed.data;
  const errors: Record<string, FieldError> = {};
  if (VARIANT_ROLE[d.variant] !== d.role && d.variant !== 'contact') errors.role = 'invalid';
  const { show, required } = fieldRules(d.variant, d.role);

  if (!d.name) errors.name = 'required';
  if (!d.email) errors.email = 'required';
  else if (!EMAIL.test(d.email)) errors.email = 'email';
  if (required.company && !d.company) errors.company = 'required';
  if (required.siteType && !d.siteType) errors.siteType = 'required';
  if (required.partnerType && !d.partnerType) errors.partnerType = 'required';
  if (required.message && !d.message) errors.message = 'required';
  if (show.website && d.website && !/^https?:\/\/\S+\.\S+$/.test(d.website)) errors.website = 'url';
  if (!d.consent) errors.consent = 'consent';

  if (Object.keys(errors).length) return { ok: false, errors };

  // 只留下這個身分會看到的欄位，避免收到不相干的資料
  const data: LeadInput = {
    ...d,
    company: show.company ? d.company : '',
    website: show.website ? d.website : '',
    organization: show.organization ? d.organization : '',
    message: show.message ? d.message : '',
    siteType: show.siteType ? d.siteType : undefined,
    partnerType: show.partnerType ? d.partnerType : undefined,
    module: show.module ? d.module : undefined,
    modules: show.modules ? d.modules : [],
    jobRole: show.jobRole ? d.jobRole : undefined,
  };
  return { ok: true, data };
}
