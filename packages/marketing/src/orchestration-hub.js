'use strict';

// 第 5 層：任務規劃 — 萬能編排中樞（README §3.6）
// 職責：策略分解為 DAG 工作流 · 優先順序 · 依賴關係 · 監控 · 重試
// 組別：營銷組 (19–24)

// interface DAGWorkflow { workflow_id, name, nodes: DAGNode[], edges: DAGEdge[], status, created_at, updated_at }
// interface DAGNode {
//   node_id, task, module, inputs: string[], outputs: string[],
//   priority（0 最高）, dependencies: string[], retries, timeout（秒）, status
// }
// interface DAGEdge { from, to, condition? }

const { rid, unifiedResult } = require('../../../schemas');

class DAGBuilder {
  constructor(name = 'workflow') {
    this.workflow = {
      workflow_id: rid('wf'),
      name,
      nodes: [],
      edges: [],
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  addNode(node) {
    const record = Object.assign(
      {
        node_id: rid('node'),
        task: node.action || node.task,
        module: '',
        inputs: [],
        outputs: [],
        priority: 5,
        dependencies: [],
        retries: 0,
        timeout: 60,
        status: 'pending',
      },
      node
    );
    this.workflow.nodes.push(record);
    this.workflow.updated_at = Date.now();
    return record;
  }

  addEdge(from, to, condition) {
    this.workflow.edges.push({ from, to, condition });
    const target = this.workflow.nodes.find((n) => n.node_id === to);
    if (target && !target.dependencies.includes(from)) target.dependencies.push(from);
    return this;
  }

  // 依賴解析 + 拓撲排序（DAG 合法性驗證 — Orchestration Gate）
  topologicalOrder() {
    const indeg = new Map(this.workflow.nodes.map((n) => [n.node_id, 0]));
    for (const e of this.workflow.edges) indeg.set(e.to, (indeg.get(e.to) || 0) + 1);
    const ready = this.workflow.nodes.filter((n) => indeg.get(n.node_id) === 0).map((n) => n.node_id);
    const order = [];
    const adj = new Map(this.workflow.edges.map((e) => [e.from, []]));
    this.workflow.edges.forEach((e) => adj.get(e.from).push(e.to));
    while (ready.length) {
      const id = ready.shift();
      order.push(id);
      for (const next of adj.get(id) || []) {
        indeg.set(next, indeg.get(next) - 1);
        if (indeg.get(next) === 0) ready.push(next);
      }
    }
    if (order.length !== this.workflow.nodes.length) throw new Error('DAG 含循環依賴，編排失敗');
    return order;
  }

  build() {
    this.topologicalOrder(); // 建置前驗證
    this.workflow.status = 'pending';
    return Object.freeze(this.workflow);
  }
}

// TODO(營銷組 19–24)：Orchestrator 任務調度器 · PriorityScheduler 優先調度 · WorkflowMonitor 監控 · 中斷/重試/回退
class Orchestrator {
  constructor(executor) {
    this.executor = executor; // 第 6 層 ExecutorFactory
  }

  async execute(workflow) {
    workflow.status = 'running';
    for (const node_id of workflow.nodes.map((n) => n.node_id)) {
      const node = workflow.nodes.find((n) => n.node_id === node_id);
      node.status = 'running';
      const result = await this.executor.execute(node);
      node.status = result.status === 'success' ? 'completed' : 'failed';
    }
    workflow.status = workflow.nodes.every((n) => n.status === 'completed') ? 'completed' : 'failed';
    return workflow;
  }

  emit(workflow) {
    return unifiedResult({ layer_id: 5, source_origin: 'layer-5', payload: { workflow_id: workflow.workflow_id, status: workflow.status } });
  }
}

module.exports = { DAGBuilder, Orchestrator };
