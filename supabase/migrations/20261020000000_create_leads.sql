-- 名單資料表（SPEC 6.3；P5 決定 2026-10-20 加上 lead_code 預約編號）
-- 只由 n8n 用 service role 寫入；網站前端不直接連 Supabase。
-- 執行方式見 docs/n8n-lead-workflow.md「Supabase」一節。

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_code text not null unique,
  role text not null check (role in ('owner', 'partner', 'talent')),
  company text,
  name text not null,
  email text not null,
  phone text,
  message text,
  partner_type text,
  interested_course text,
  need_type text,
  details jsonb,
  form_version text,
  checklist text check (checklist in ('building', 'manufacturing', 'medical', 'retail')),
  locale text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  owner_note text
);

comment on table public.leads is '官網預約／申請／登記名單（n8n 寫入）';
comment on column public.leads.lead_code is '預約編號，例如 L-261020-7KQ3；確認信與需求表都用這個編號對應';
comment on column public.leads.details is '身分專屬欄位（公司網站、服務單位、有興趣的模組、目前職務）';
comment on column public.leads.checklist is '業主對應的需求表（依場域類型）';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- 啟用 RLS 且不建立任何 policy：anon／authenticated 都讀寫不到，只有 service role（n8n）可以
alter table public.leads enable row level security;
