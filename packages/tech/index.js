'use strict';
// @omnisystem/tech — 第 1、2、3、6 層
module.exports = {
  MultimodalIngestor: require('./src/perception-radar').MultimodalIngestor,
  MemoryVault: require('./src/memory-vault').MemoryVault,
  ReasoningEngine: require('./src/reasoning-brain').ReasoningEngine,
  ESGScorer: require('./src/execution-workshop').ESGScorer,
  ExecutorFactory: require('./src/execution-workshop').ExecutorFactory,
};
