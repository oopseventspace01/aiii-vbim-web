// POST /api/lead：預約／申請／登記表單送出（SPEC 6.2）
// 網站其他頁面都是靜態產生，只有這支在伺服器上執行
import type { APIRoute } from 'astro';
import {
  CHECKLIST_FORM_BUILDING,
  CHECKLIST_FORM_MANUFACTURING,
  CHECKLIST_FORM_MEDICAL,
  CHECKLIST_FORM_RETAIL,
  CHECKLIST_PDF_BUILDING,
  CHECKLIST_PDF_MANUFACTURING,
  CHECKLIST_PDF_MEDICAL,
  CHECKLIST_PDF_RETAIL,
  N8N_LEAD_SECRET,
  N8N_LEAD_WEBHOOK_URL,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { handleLead } from '../../forms/lead-server';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'validation' }, { status: 400 });
  }

  // 本機開發時：沒設定 n8n 網址，或 E2E 測試指定 LEAD_DRY_RUN=1，就只回成功、不真的送出
  const dryRun = import.meta.env.DEV && (process.env.LEAD_DRY_RUN === '1' || !N8N_LEAD_WEBHOOK_URL);

  const result = await handleLead(
    raw,
    { ip: clientAddress || 'unknown', now: new Date() },
    {
      webhookUrl: N8N_LEAD_WEBHOOK_URL,
      secret: N8N_LEAD_SECRET,
      turnstileSecret: TURNSTILE_SECRET_KEY,
      checklistForms: {
        building: CHECKLIST_FORM_BUILDING,
        manufacturing: CHECKLIST_FORM_MANUFACTURING,
        medical: CHECKLIST_FORM_MEDICAL,
        retail: CHECKLIST_FORM_RETAIL,
      },
      checklistPdfs: {
        building: CHECKLIST_PDF_BUILDING,
        manufacturing: CHECKLIST_PDF_MANUFACTURING,
        medical: CHECKLIST_PDF_MEDICAL,
        retail: CHECKLIST_PDF_RETAIL,
      },
      dryRun,
      rateLimit: { max: 5, windowMs: 10 * 60_000 },
    },
  );
  return Response.json(result.body, { status: result.status });
};
