// 呼叫 Claude 把一批中文文字翻成英文（結構化輸出：回傳同樣數量、同樣順序的字串）
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import type { TextItem } from './collect';

export const TRANSLATE_MODEL = 'claude-opus-5-5';

// 固定的系統提示：放最前面、內容不變，才吃得到提示快取
const SYSTEM = `You translate website news content for Aiii VBIM (a Taiwanese smart-building platform company) from Traditional Chinese into natural, professional English for international B2B readers.

Rules:
- Translate every item faithfully. Do not add, remove, summarize or embellish facts, numbers, names, claims or dates.
- Keep product and brand names exactly as written: Aiii VBIM, Aiii VBIM OS, Aiii RMS, Aiii MMS, PMIS, BIM, AIoT, Edge AI, AI Agent, VMS, EMS, BMS, LINE.
- Company names: 星宴國際開發股份有限公司 → Xingyan International Development Co., Ltd.; 星賀建設股份有限公司 → YIHHUII Co., Ltd.; 星宴國際開發 → Xingyan International Development.
- Common terms: 數位孿生 → digital twin; 戰情室 → command center; 智慧建築 → smart building; 地端 AI → on-premises AI (Edge AI); 中央空調 → central HVAC; 節能 → energy saving; 認證學院 → Academy.
- Person, organization and place names: use their established English names if well known; otherwise romanize (Taiwanese Hanyu Pinyin for places) and do not invent titles.
- Items are fragments of rich text and may start or end mid-sentence or with spaces; translate each item on its own and keep leading/trailing spaces and punctuation roles so the pieces join naturally.
- If an item has a character limit, stay within it.
- If an item is already English or is a code/URL, return it unchanged.
- Output exactly one translation per input item, in the same order.`;

const Output = z.object({ translations: z.array(z.string()) });

export async function translateTexts(
  items: TextItem[],
  apiKey: string,
  client: Anthropic = new Anthropic({ apiKey }),
): Promise<string[]> {
  if (items.length === 0) return [];
  const input = items.map((it, i) => ({
    i,
    text: it.text,
    ...(it.max ? { maxChars: it.max } : {}),
  }));
  const response = await client.beta.messages.parse({
    model: TRANSLATE_MODEL,
    // 萬一主要模型婉拒，伺服器端自動改用備援模型再翻一次
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    max_tokens: 16000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    // 翻譯不需要深度推理：用低努力程度，省時間也省費用
    output_config: { effort: 'low', format: betaZodOutputFormat(Output) },
    messages: [
      {
        role: 'user',
        content: `Translate these ${items.length} items. Return {"translations": [...]} with exactly ${items.length} strings.\n\n${JSON.stringify(input)}`,
      },
    ],
  });
  if (response.stop_reason === 'refusal') {
    throw new Error(`Claude 拒絕翻譯（${response.stop_details?.category ?? '未知原因'}）`);
  }
  if (response.stop_reason === 'max_tokens') throw new Error('翻譯內容太長，超過單次上限');
  const out = response.parsed_output?.translations;
  if (!out || out.length !== items.length) {
    throw new Error(`翻譯結果數量不符：需要 ${items.length} 段，收到 ${out?.length ?? 0} 段`);
  }
  return out;
}
