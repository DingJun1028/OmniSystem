export const layers = [
  {
    id: 0,
    name: '萬能意圖核心',
    subtitle: '需求輸入',
    color: 'bg-coral',
    text: 'text-coral',
    textOnColor: 'text-white',
    tint: 'bg-red-100',
    icon: 'Target',
    duty: [
      '感應用戶核心目標、業務意圖、痛點',
      '將模糊需求轉換為可構造的需求規格（Requirement Specification）',
      '為後續層提供「需求校準」依據',
      '記錄需求變化，追踪需求的生命週期',
    ],
    components: [
      { name: 'IntentExtractor', desc: '從多來源提取用戶意圖' },
      { name: 'RequirementSpec', desc: '需求規格物件（ID、類型、目標、痛點、KPI、優先級）' },
      { name: 'IntentRegistry', desc: '意圖註冊與查詢中心' },
      { name: 'RequirementHistory', desc: '需求變化歷史記錄' },
    ],
    schema: `interface IntentSpec {
  intent_id: string;           // 唯一識別碼
  source_origin: string;       // 來源（User input, API, log, etc.）
  user_type: 'enterprise' | 'individual' | 'system';
  core_goal: string;           // 核心目標
  business_intent: string;     // 業務意圖
  pain_points: string[];       // 痛點清單
  kpi: {
    metric: string;
    target: number;
    owner: string;
  };
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'draft' | 'active' | 'closed' | 'superseded';
  created_at: number;
  updated_at: number;
}

interface RequirementSpec {
  intent_ref: string;          // 指向 IntentSpec
  spec_id: string;
  requirements: {
    functional: string[];      // 功能需求
    non_functional: string[];  // 非功能需求（性能、安全、合規）
    constraints: string[];     // 約束條件
    acceptance_criteria: string[];
  };
  version: string;             // semantic version
  tracked_at: number;
}`,
    fiveT: {
      Traceable: '每個需求記錄 source_origin，輸入來源可追溯',
      Trackable: '需求生命週期：draft → active → closed / superseded',
      Tangible: '需求以明確的 KPI、規格、接受標準具象化',
      Transparent: '需求來源、變更歷史、優先級公開可見',
      Trustworthy: '需求達到眾包比例 100%，需求變更需經過審批鏈',
    },
    code: `class IntentCore {
  private intents: Map<string, IntentSpec> = new Map();
  private history: Map<string, IntentChange[]> = new Map();

  register(intent: IntentSpec): IntentSpec {
    this.intents.set(intent.intent_id, intent);
    return intent;
  }

  extract(text: string, source: string): IntentSpec {
    const intent = this._extractFromLLM(text, source);
    intent.source_origin = source;
    return intent;
  }

  private _extractFromLLM(text: string, source: string): IntentSpec {
    // Groq Qwen 引擎提取意圖
    // 返回結構化 IntentSpec
  }
}`,
  },
  {
    id: 1,
    name: '萬能感知雷達',
    subtitle: '環境輸入',
    color: 'bg-sunshine',
    text: 'text-amber-600',
    textOnColor: 'text-ink',
    tint: 'bg-amber-100',
    icon: 'Radar',
    duty: [
      '全管道捕捉多模態文檔、代碼、日誌、外部事件',
      '實時增加即時情境輸入',
      '提取環境事件的結構化訊息',
      '為第 2 層提供即時上下文',
    ],
    components: [
      { name: 'MultimodalIngestor', desc: '多模態文檔、代碼、日誌的提取' },
      { name: 'EventStream', desc: '事件流聚合（Kafka / NATS / WebSocket）' },
      { name: 'ExternalEventAdapter', desc: '外部事件來源適配（GitHub webhook、Cloudflare log、SaaS webhook）' },
      { name: 'ContextAssembler', desc: '組裝上下文（目前環境狀態 + 歷史狀態）' },
    ],
    schema: `interface EnvironmentEvent {
  event_id: string;
  source: string;              // github, cloudflare, log, api, etc.
  type: 'document' | 'code' | 'log' | 'event' | 'metric' | 'alert';
  payload: unknown;
  metadata: {
    timestamp: number;
    source_origin: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    session_id?: string;
  };
}

interface MultimodalIngestor {
  ingestDocument(doc: Buffer, mimeType: string): Promise<EnvironmentEvent>;
  ingestCode(repo: string, file: string, content: Buffer): Promise<EnvironmentEvent>;
  ingestLog(logLine: string, source: string): Promise<EnvironmentEvent>;
  subscribe(events: string[]): AsyncIterable<EnvironmentEvent>;
}`,
    fiveT: {
      Traceable: '每條事件有 source_origin，可追溯來源',
      Trackable: '事件包含 timestamp 和 session_id，可追踪流程',
      Tangible: '事件以結構化物件呈現，無廢話',
      Transparent: '事件來源、類型、優先級公開',
      Trustworthy: '事件路徑校驗，防止惡意注入（尤其來自外部的事件）',
    },
    code: `async function safeIngest(event: EnvironmentEvent): Promise<EnvironmentEvent> {
  if (!ALLOWED_SOURCES.includes(event.source)) {
    throw new SecurityError(\`Source not allowed: \${event.source}\`);
  }
  if (!validateEventSchema(event)) {
    throw new ValidationError('Invalid event structure');
  }
  return event;
}`,
  },
  {
    id: 2,
    name: '萬能記憶樞紐',
    subtitle: '經驗沉澱',
    color: 'bg-mint',
    text: 'text-emerald-600',
    textOnColor: 'text-ink',
    tint: 'bg-emerald-100',
    icon: 'Database',
    duty: [
      '以 5T 治理架構存證真實資料',
      '存儲歷史案例、決策因果、使用者長期偏好',
      '提供持久化記憶，供第 3 層推理使用',
      '隔離敏感資料，履行隱私保護義務',
    ],
    components: [
      { name: 'MemoryVault', desc: '記憶庫（SQLite / PostgreSQL / TencentDB）' },
      { name: 'MemoryIndex', desc: '記憶索引（向量索引 + 標籤索引）' },
      { name: 'DecisionLogger', desc: '決策日誌（決策、因果、結果）' },
      { name: 'PreferenceTracker', desc: '用戶偏好追踪' },
      { name: 'CaseRepository', desc: '歷史案例庫' },
    ],
    schema: `interface MemoryEntry {
  memory_id: string;
  memory_type: 'preference' | 'decision' | 'case' | 'event' | 'pattern';
  content: unknown;
  tags: string[];
  confidence: number;          // 記憶置信度
  created_at: number;
  created_by: string;
  source_origin: string;       // 來源
  lifespan: number;            // 記憶有效期（天）
  retrievable: boolean;        // 是否可被查詢
}

interface DecisionRecord {
  decision_id: string;
  context: string;             // 決策背景
  options: string[];           // 選項
  chosen: string;              // 選擇
  rationale: string;           // 理由
  outcome: string;             // 結果
  outcome_metric?: string;     // 結果指標
  timestamp: number;
}`,
    fiveT: {
      Traceable: '每條記憶帶有 source_origin，可追溯',
      Trackable: '記憶有生命週期和有效期，過期自動標記為 expired',
      Tangible: '記憶以結構化物件存儲，可查詢',
      Transparent: '決策日誌公開，便於審計',
      Trustworthy: '敏感資料加密存儲，記憶庫訪問受控制',
    },
    code: `class MemoryVault {
  async store(entry: MemoryEntry): Promise<string> {
    const hash = await this.hashLock(entry);
    await this.db.insert({
      ...entry,
      hash_lock: hash,
      created_at: Date.now(),
    });
    return entry.memory_id;
  }

  private hashLock(entry: MemoryEntry): Promise<string> {
    const material = JSON.stringify({
      content: entry.content,
      tags: entry.tags,
      created_at: entry.created_at,
      source_origin: entry.source_origin,
    });
    return crypto.createHash('sha256').update(material).digest('hex');
  }
}`,
  },
  {
    id: 3,
    name: '萬能推理大腦',
    subtitle: '認知推理',
    color: 'bg-sky',
    text: 'text-sky-700',
    textOnColor: 'text-white',
    tint: 'bg-sky-100',
    icon: 'Brain',
    duty: [
      '運行 Groq Qwen 引擎進行認知推理',
      '情境理解：結合第 0–2 層的輸入',
      '策略生成：產出可執行的策略',
      '推演：模擬不同選項的結果',
      '推導最佳決策路徑',
    ],
    components: [
      { name: 'ReasoningEngine', desc: 'Groq Qwen 推理引擎代理' },
      { name: 'SituationAnalyzer', desc: '情境分析器' },
      { name: 'StrategyGenerator', desc: '策略生成器' },
      { name: 'ScenarioSimulator', desc: '場景模擬器' },
      { name: 'DecisionEngine', desc: '決策引擎' },
    ],
    schema: `interface ReasoningContext {
  intent: IntentSpec;               // 來自第 0 層
  environment: EnvironmentEvent[];  // 來自第 1 層
  memory: MemoryEntry[];            // 來自第 2 層
  session_id: string;
  timestamp: number;
}

interface Strategy {
  strategy_id: string;
  name: string;
  description: string;
  steps: StrategyStep[];
  expected_outcome: string;
  estimated_cost: number;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
}

interface StrategyStep {
  step_id: string;
  action: string;
  target_layer: number;             // 目標層（0–9）
  parameters: Record<string, unknown>;
  estimated_time: number;           // 預計時間（秒）
  resources: string[];
}`,
    fiveT: {
      Traceable: '每個推理結果記錄 source_origin（來自哪一層輸入）',
      Trackable: '推理過程記錄（情境、輸入、輸出、推演軌跡）',
      Tangible: '策略以結構化物件呈現，可驗證',
      Transparent: '推理背書邏輯公開，便於審計',
      Trustworthy: '推理結果經過 4 層（安全治理）後才可使用',
    },
    code: `class ReasoningEngine {
  private groqClient: Groq;
  private model = 'qwen-3-32b';      // 實際模型名稱

  async reason(context: ReasoningContext): Promise<Strategy> {
    const prompt = this._buildPrompt(context);
    const response = await this.groqClient.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const strategy = this._parseStrategy(response.choices[0].message.content);
    this._logReasoningTrace(context, strategy);
    return strategy;
  }
}`,
  },
  {
    id: 4,
    name: '萬能治理閘門',
    subtitle: '安全防護',
    color: 'bg-lilac',
    text: 'text-purple-600',
    textOnColor: 'text-white',
    tint: 'bg-purple-100',
    icon: 'ShieldCheck',
    duty: [
      '權限管控：驗證使用者與系統的權限',
      '合規校驗：確保產出符合法規（ESG 合規、數據保護）',
      '隱私保護：敏感資料處理（遮蔽、去識別化）',
      '邊界防護：防止越權、注入、路徑穿越',
      '風險攔截：在手數出來前把隱藏風險擋住',
    ],
    components: [
      { name: 'GovernanceGate', desc: '5T 驗證閘門' },
      { name: 'AuthZEngine', desc: '權限控制引擎' },
      { name: 'ComplianceChecker', desc: '合規校驗器' },
      { name: 'PrivacyProtector', desc: '隱私保護器' },
      { name: 'BoundaryProtector', desc: '邊界防護器' },
    ],
    schema: `interface GovernanceResult {
  gate_id: string;
  status: 'pass' | 'fail' | 'warn';
  checks: {
    authz: boolean;
    privacy: boolean;
    compliance: boolean;
    boundary: boolean;
  };
  hash_lock: string;
  timestamp: number;
}`,
    fiveT: {
      Traceable: '每次閘門通過觸發 source_origin 記錄',
      Trackable: '閘門通過/失敗記錄，人工可追揭',
      Tangible: '閘門結果（Pass / Fail / Warn）明確',
      Transparent: '檢查規則公開（例如：禁用藍紫霓虹、機器人大腦）',
      Trustworthy: 'Hash Lock + Object.freeze() 確保閘門結果不變',
    },
    code: `class GovernanceGate {
  async verify(obj: unknown, requirement: string): Promise<boolean> {
    if (!await this.authZ.check(obj)) {
      this._log('authz_denied', obj);
      return false;
    }
    if (!await this.privacy.check(obj)) {
      this._log('privacy_violated', obj);
      return false;
    }
    if (!await this.compliance.check(obj, requirement)) {
      this._log('compliance_failed', obj);
      return false;
    }
    if (this.isBlocked(obj)) {
      this._log('blocked_pattern', obj);
      return false;
    }
    return Object.freeze(this._applyHashLock(obj));
  }

  private isBlocked(obj: unknown): boolean {
    const blocked = [
      /藍紫霓虹|霓虹機器人|大的字體|機器人大腦/.test(JSON.stringify(obj)),
      /漂浮數據|大量聚合|競品包羅萬象/.test(JSON.stringify(obj)),
    ];
    return blocked.some(Boolean);
  }
}`,
  },
  {
    id: 5,
    name: '萬能編排中樞',
    subtitle: '任務規劃',
    color: 'bg-coral',
    text: 'text-coral',
    textOnColor: 'text-white',
    tint: 'bg-red-100',
    icon: 'GitBranch',
    duty: [
      '將決策策略分解為具體任務',
      '建立 DAG（有向無環圖）工作流',
      '調度任務優先順序與依賴關係',
      '分配資源與監控執行狀態',
      '提供任務中斷、重試、回退',
    ],
    components: [
      { name: 'DAGBuilder', desc: '構建有向無環圖' },
      { name: 'Orchestrator', desc: '任務調度器' },
      { name: 'DependencyResolver', desc: '依賴解析器' },
      { name: 'PriorityScheduler', desc: '優先順序調度器' },
      { name: 'WorkflowMonitor', desc: '工作流監控' },
    ],
    schema: `interface DAGWorkflow {
  workflow_id: string;
  name: string;
  nodes: DAGNode[];
  edges: DAGEdge[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'aborted';
  created_at: number;
  updated_at: number;
}

interface DAGNode {
  node_id: string;
  task: string;
  module: string;               // 07, 08, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 27, 28, 29, 30
  inputs: string[];             // 依賴的輸出
  outputs: string[];
  priority: number;             // 0 最高, 9 最低
  dependencies: string[];       // 依賴的節點
  retries: number;
  timeout: number;              // 秒
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface DAGEdge {
  from: string;
  to: string;
  condition?: string;           // 邊條件（例如：僅當為 production 時執行）
}`,
    fiveT: {
      Traceable: '每個任務有 source_origin（來自哪個決策）',
      Trackable: '任務狀態、依賴關係、重試次數可追踪',
      Tangible: '工作流圖��視化，可執行',
      Transparent: '工作流依賴關係公開',
      Trustworthy: '任務執行日誌，失敗時可重試',
    },
    code: `class Orchestrator {
  async execute(workflow: DAGWorkflow): Promise<void> {
    const scheduler = new PriorityScheduler();
    const executor = new TaskExecutor();

    const sorted = this._topologicalSort(workflow);

    for (const node of sorted) {
      if (workflow.status !== 'running') break;
      await this._waitForDependencies(node, workflow);
      await executor.execute(node);
      this._logTaskEvent(node);
    }
  }
}`,
  },
  {
    id: 6,
    name: '萬能執行工坊',
    subtitle: '實質落地',
    color: 'bg-sunshine',
    text: 'text-amber-600',
    textOnColor: 'text-ink',
    tint: 'bg-amber-100',
    icon: 'Hammer',
    duty: [
      '驅動核心業務運算',
      '執行程式碼修復',
      '執行 ESG 評分計算',
      '執行內部流水線',
      '產出具體成果物',
    ],
    components: [
      { name: 'ExecutorFactory', desc: '執行工坊實例工廠' },
      { name: 'CodeFixer', desc: '程式碼修復器' },
      { name: 'ESGScorer', desc: 'ESG 評分計算器' },
      { name: 'PipelineRunner', desc: '內部流水線執行器' },
      { name: 'ArtifactCollector', desc: '成果物收集器' },
    ],
    schema: `interface ExecutionContext {
  workflow_id: string;
  node_id: string;
  task: string;
  parameters: Record<string, unknown>;
  environment: Record<string, string>;
  timeout: number;
  user: {
    user_id: string;
    permissions: string[];
  };
}

interface ExecutionResult {
  node_id: string;
  status: 'success' | 'failed' | 'timeout' | 'aborted';
  output: unknown;
  error?: {
    code: string;
    message: string;
    traceback: string;
  };
  timestamp: number;
  duration_ms: number;
  metrics: {
    cpu_usage?: number;
    memory_usage?: number;
    io_streams?: number;
    network_io?: number;
  };
}`,
    fiveT: {
      Traceable: '每次執行記錄 source_origin、輸入、輸出',
      Trackable: '執行日誌、時間、資源使用量可追踪',
      Tangible: '執行結果可具象化（程式碼、評分、流水線輸出）',
      Transparent: '執行日誌與指標公開',
      Trustworthy: '執行結果經過 5 層（治理閘門）驗證',
    },
    code: `class ESGScorer {
  async compute(entity: Entity, metrics: Metric[]): Promise<ESGScore> {
    const score = {
      environment: this._calculateEnvironment(metrics),
      social: this._calculateSocial(metrics),
      governance: this._calculateGovernance(metrics),
      total: this._calculateTotal(metrics),
    };
    score.hash_lock = this._hashLock(score);
    return Object.freeze(score);
  }
}`,
  },
  {
    id: 7,
    name: '萬能整合網絡',
    subtitle: '外部連結',
    color: 'bg-mint',
    text: 'text-emerald-600',
    textOnColor: 'text-ink',
    tint: 'bg-emerald-100',
    icon: 'Globe',
    duty: [
      '對接 GitHub（程式碼、PR、issue、workflow）',
      '對接 Cloudflare（DNS、API、安全、分析）',
      '對接第三方 API（SaaS 工具、外部服務）',
      '對接內部服務（自訂微服務）',
      '處理外部 API 響應、轉換、聚合',
    ],
    components: [
      { name: 'GitHubAdapter', desc: 'GitHub 集成' },
      { name: 'CloudflareAdapter', desc: 'Cloudflare 集成' },
      { name: 'ThirdPartyAPIAdapter', desc: '第三方 API 適配器' },
      { name: 'SaaSConnector', desc: 'SaaS 連結器' },
      { name: 'IntegrationOrchestrator', desc: '整合調度器' },
    ],
    schema: `interface ExternalCall {
  call_id: string;
  platform: 'github' | 'cloudflare' | 'saas' | 'internal';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  payload: unknown;
  response: unknown;
  status_code: number;
  timestamp: number;
}`,
    fiveT: {
      Traceable: '每個外部呼叫有 source_origin、請求、響應',
      Trackable: '呼叫日誌、響應時間、錯誤碼可追踪',
      Tangible: '外部資料結構化，可用',
      Transparent: '外部 API 鍵、端點公開',
      Trustworthy: 'API 鍵經過加密，請求經過驗證（HMAC）',
    },
    code: `class GitHubAdapter {
  private token: string;          // 經過加密
  private baseURL = 'https://api.github.com';

  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body: string
  ): Promise<GitHubIssue> {
    const response = await fetch(\`\${this.baseURL}/repos/\${owner}/\${repo}/issues\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${this.token}\`,
        'X-Source-Origin': 'aistation-omni',   // Traceable
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });

    const result = await response.json();
    this._logRequest('github.createIssue', response.status, result);
    return result;
  }
}`,
  },
  {
    id: 8,
    name: '萬能體驗門戶',
    subtitle: '價值交付',
    color: 'bg-sky',
    text: 'text-sky-700',
    textOnColor: 'text-white',
    tint: 'bg-sky-100',
    icon: 'LayoutDashboard',
    duty: [
      '透過 SSE 即時串流展示執行進度',
      '提供視覺化儀表板',
      '提供客戶可見的透明體驗',
      '收集客戶反饋',
      '提供最佳實踐模板與測試',
    ],
    components: [
      { name: 'SSEStreamingServer', desc: 'SSE 即時串流伺服器' },
      { name: 'DashboardRenderer', desc: '儀表板渲染器' },
      { name: 'VisualizationEngine', desc: '視覺化引擎' },
      { name: 'FeedbackCollector', desc: '反饋收集器' },
      { name: 'ExperienceTracker', desc: '體驗追踪器' },
    ],
    schema: `interface SSEEvent {
  event: string;                // 'progress' | 'status' | 'result' | 'error'
  data: unknown;
  timestamp: number;
  session_id: string;
}

interface DashboardMetric {
  metric_id: string;
  name: string;
  value: number;
  unit: string;
  category: 'execution' | 'quality' | 'experience' | 'business';
  trend: 'up' | 'down' | 'stable';
  updated_at: number;
}`,
    fiveT: {
      Traceable: '每個 SSE 事件有 source_origin',
      Trackable: '客戶行為、反饋、儀表板讀取記錄',
      Tangible: '視覺化、串流介面明確',
      Transparent: '客戶可看到進度、結果、風險',
      Trustworthy: '串流連線安全加密，數據完整性檢查',
    },
    code: `class SSEStreamingServer {
  private clients: Set<Response> = new Set();

  async stream(sessionId: string, stream: AsyncIterable<SSEEvent>): Promise<void> {
    const body = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          const payload = \`event: \${event.event}\\ndata: \${JSON.stringify(event.data)}\\n\\n\`;
          controller.enqueue(new TextEncoder().encode(payload));
          this._notifyClients(payload);
        }
      },
      cancel() {
        this.clients.clear();
      },
    });

    return new Response(body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }
}`,
  },
  {
    id: 9,
    name: '萬能演化生長環',
    subtitle: '持續進化',
    color: 'bg-lilac',
    text: 'text-purple-600',
    textOnColor: 'text-white',
    tint: 'bg-purple-100',
    icon: 'RefreshCw',
    duty: [
      '收集客戶反饋',
      '收集執行成效（指標、KPI）',
      '動態優化特徵模型',
      '更新決策鏈（策略庫）',
      '實現自主迭代',
    ],
    components: [
      { name: 'FeedbackCollector', desc: '反饋收集器' },
      { name: 'PerformanceAnalyzer', desc: '績效分析器' },
      { name: 'ModelOptimizer', desc: '特徵模型優化器' },
      { name: 'StrategyUpdater', desc: '策略更新器' },
      { name: 'EvolutionLoop', desc: '演化循環' },
    ],
    schema: `interface Feedback {
  feedback_id: string;
  session_id: string;
  source: 'customer' | 'system' | 'internal';
  rating: number;               // 1–5
  comments: string;
  dimension: 'performance' | 'usability' | 'quality' | 'compliance';
  timestamp: number;
}

interface EvolutionResult {
  evolution_id: string;
  model_version: string;
  strategy_updates: string[];
  metrics: {
    satisfaction: number;
    performance: number;
    quality: number;
    compliance: number;
  };
  next_actions: string[];
  timestamp: number;
}`,
    fiveT: {
      Traceable: '每個演化結果記錄 source_origin、依據的數據來源',
      Trackable: '指標追踪、模型版本、策略更新歷史',
      Tangible: '每次演化產出明確的改進報告',
      Transparent: '演化原因、依據、結果公開',
      Trustworthy: '演化結果經過驗證後才能應用',
    },
    code: `class EvolutionLoop {
  async evolve(): Promise<EvolutionResult> {
    const feedback = await this._collectFeedback();
    const performance = await this._analyzePerformance();
    const model = await this._optimizeModel(feedback, performance);
    const strategies = await this._updateStrategies(model);
    const result = {
      evolution_id: generateId(),
      model_version: model.version,
      strategy_updates: strategies,
      metrics: performance,
      next_actions: this._planNextActions(strategies),
      timestamp: Date.now(),
    };
    return Object.freeze(result);
  }
}`,
  },
]
