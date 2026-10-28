export const serializationSchema = {
  pipeline: `interface SSASPipeline {
  pipeline_id: string;
  session_id: string;
  started_at: number;
  layers: LayerExecution[];
  results: ExecutionResult[];
  final_status: 'success' | 'partial' | 'failed';
  completed_at: number;
}

interface LayerExecution {
  layer_id: number;             // 0–9
  layer_name: string;
  status: 'pending' | 'running' | 'completed' | 'blocked';
  input: unknown;
  output: unknown;
  duration_ms: number;
  error?: {
    code: string;
    message: string;
  };
  source_origin: string;        // 來自哪一層的輸入
}

interface ExecutionResult {
  layer_id: number;
  status: 'success' | 'failed' | 'timeout' | 'aborted';
  output: unknown;
  metrics: {
    cpu_usage?: number;
    memory_usage?: number;
    io_streams?: number;
    network_io?: number;
  };
  feedback: Feedback[];
}`,
  unified: `interface UnifiedResult {
  uuid: string;                 // 唯一識別碼
  version: string;              // 語義版本
  timestamp: number;            // 刻印時間戳
  source_origin: string;        // 來源
  layer_id: number;             // 執行層
  status: 'success' | 'failed' | 'partial';
  payload: unknown;             // 實際產出
  metrics: {
    duration_ms: number;
    cpu: number;
    memory: number;
    io: number;
    network: number;
  };
  quality: {
    traceable: boolean;
    trackable: boolean;
    tangible: boolean;
    transparent: boolean;
    trustworthy: boolean;
  };
  hash_lock: string;            // SHA-256 安撫
}`,
}
