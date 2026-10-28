'use strict';

// 第 3 層推理大腦：local（離線）／groq（LLM），統一入口永不失敗（失敗回退本地）
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function normalizeTasks(tasks) {
  return tasks
    .filter((t) => t && (t.name || t.produces))
    .slice(0, 3)
    .map((t, i) => ({
      id: 't' + (i + 1),
      name: String(t.name || t.produces),
      produces: String(t.produces || t.name || '交付物'),
    }));
}

function localStrategy() {
  return {
    approach: '將需求拆解為三階段執行計畫',
    tasks: [
      { id: 't1', name: '分析需求範疇', produces: '範疇定義' },
      { id: 't2', name: '產出交付物', produces: '交付物草稿' },
      { id: 't3', name: '驗證與沉澱', produces: '驗證記錄' },
    ],
  };
}

async function groqStrategy(intent, apiKey, model) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              '你是 SSAS 框架第 3 層推理大腦。將用戶需求拆解為三階段執行策略，嚴格只輸出 JSON 物件：{"approach":"一句話說明策略","tasks":[{"name":"階段名稱","produces":"產出物"}]}（tasks 恰好三項）。',
          },
          { role: 'user', content: intent },
        ],
        temperature: 0.3,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error('Groq HTTP ' + res.status + (body ? ' — ' + body.slice(0, 120) : ''));
    }
    const data = await res.json();
    const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error('LLM 回應無法解析為 JSON');
    }
    if (!parsed || !Array.isArray(parsed.tasks) || !parsed.tasks.length) {
      throw new Error('LLM 回應缺少 tasks 陣列');
    }
    const tasks = normalizeTasks(parsed.tasks);
    if (!tasks.length) throw new Error('LLM 回應 tasks 內容無效');
    return { approach: String(parsed.approach || 'LLM 拆解的三階段策略'), tasks, engine: 'groq:' + model };
  } finally {
    clearTimeout(timer);
  }
}

async function buildStrategy(intent, { reasoningMode = 'local', groqKey = null, groqModel = null } = {}) {
  const model = groqModel || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  if (reasoningMode === 'groq' && groqKey) {
    try {
      const strategy = await groqStrategy(intent, groqKey, model);
      return { strategy, used: 'groq' };
    } catch (err) {
      return { strategy: localStrategy(), used: 'local', error: err.message };
    }
  }
  if (reasoningMode === 'groq' && !groqKey) {
    return {
      strategy: localStrategy(),
      used: 'local',
      warn: 'SSAS_REASONING_MODE=groq 但未配置 GROQ_API_KEY — 使用本地策略',
    };
  }
  return { strategy: localStrategy(), used: 'local' };
}

export { buildStrategy, localStrategy };
