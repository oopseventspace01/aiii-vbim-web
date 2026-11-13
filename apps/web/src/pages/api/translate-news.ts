// POST /api/translate-news：Sanity 中文最新消息有變動時通知這裡，自動產生／同步英文版（2026-11-13 業主指示）
// 1. 驗證通知確實來自我們的後台（Sanity Webhook 簽章）
// 2. 先回覆「收到」，翻譯在背景進行（waitUntil），避免後台等太久而重送
import type { APIRoute } from 'astro';
import {
  ANTHROPIC_API_KEY,
  SANITY_TRANSLATE_WEBHOOK_SECRET,
  SANITY_WRITE_TOKEN,
} from 'astro:env/server';
import { createClient } from '@sanity/client';
import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook';
import { waitUntil } from '@vercel/functions';
import { API_VERSION } from '../../lib/sanity';
import { translateTexts } from '../../lib/translate/claude';
import { syncNews } from '../../lib/translate/sync';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!ANTHROPIC_API_KEY || !SANITY_WRITE_TOKEN || !SANITY_TRANSLATE_WEBHOOK_SECRET) {
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? '';
  if (!(await isValidSignature(body, signature, SANITY_TRANSLATE_WEBHOOK_SECRET))) {
    return Response.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }
  let id: string | undefined;
  try {
    id = (JSON.parse(body) as { _id?: string })._id;
  } catch {
    // 下面一起處理
  }
  if (!id) return Response.json({ ok: false, error: 'missing_id' }, { status: 400 });

  const client = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: API_VERSION,
    token: SANITY_WRITE_TOKEN,
    useCdn: false,
  });
  const translate = (texts: string[], max: (number | undefined)[]) =>
    translateTexts(
      texts.map((text, i) => ({ path: [], text, max: max[i] })),
      ANTHROPIC_API_KEY!,
    );

  waitUntil(
    syncNews(client, id, translate)
      .then((result) => console.log(`[translate-news] ${id}：${result}`))
      .catch((err: unknown) =>
        console.error(`[translate-news] ${id} 失敗：`, err instanceof Error ? err.message : err),
      ),
  );
  return Response.json({ ok: true }, { status: 202 });
};
