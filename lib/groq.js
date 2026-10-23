'use strict';

// 第 3 層推理大腦的 Groq Qwen 引擎（離線優先：沒有金鑰或呼叫失敗時返回 null，由 pipeline 回落到本地策略）
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
const TIMEOUT_MS = Number(process.env.GROQ_TIMEOUT_MS || 25000);

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('completion has no JSON object');
  return JSON.parse(raw.slice(start, end + 1));
}

function coerceStrategy(parsed) {
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.steps) || !parsed.steps.length) {
    throw new Error('unexpected strategy shape');
  }
  return {
    name: String(parsed.name || 'Groq Qwen 生成策略').slice(0, 60),
    description: String(parsed.description || '').slice(0, 300),
    steps: parsed.steps.slice(0, 6).map((s, i) => ({
      step_id: 's' + (i + 1),
      action: String((s && s.action) || '').slice(0, 120),
      target_layer: Math.min(9, Math.max(0, Number((s && s.target_layer) || 0) | 0)),
      estimated_time: Math.min(120, Math.max(1, Number((s && s.estimated_time) || 5) || 5)),
    })),
    expected_outcome: String(parsed.expected_outcome || '').slice(0, 200),
    priority: ['high', 'medium', 'low'].includes(parsed.priority) ? parsed.priority : 'high',
  };
}

async function generateStrategy(intent, recalledCount) {
  if (!process.env.GROQ_API_KEY) {
    return { ok: false, reason: 'no_key', model: MODEL };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_completion_tokens: 2048,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              '你是 SSAS 系統框架第 3 層「推理大腦」的策略引擎。針對使用者需求產出可執行交付策略。' +
              '只輸出 JSON，格式：{"name":"簡短策略名","description":"一句話描述",' +
              '"steps":[{"action":"具體行動","target_layer":0-9,"estimated_time":分鐘數}]（3-5 步，' +
              'target_layer 對應同心圓 0=意圖心核…9=演化生長環）,"expected_outcome":"預期成果","priority":"high|medium|low"}。' +
              '全文使用繁體中文，不要使用「藍紫霓虹」「漂浮數據」等浮誇詞彙。',
          },
          {
            role: 'user',
            content: `需求：${intent}\n記憶樞紐召回相關記憶 ${recalledCount} 條，請據此制定策略。`,
          },
        ],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`groq http ${res.status}: ${detail.slice(0, 160)}`);
    }
    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('empty completion');
    return { ok: true, model: MODEL, strategy: coerceStrategy(extractJson(content)), usage: data.usage || null };
  } catch (err) {
    const message = String((err && err.message) || err).slice(0, 200);
    console.error(`[groq] fallback to offline strategy: ${message}`);
    return { ok: false, reason: 'error', error: message, model: MODEL };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { generateStrategy, MODEL };
