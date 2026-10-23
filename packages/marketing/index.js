'use strict';
// @omnisystem/marketing — 第 5、7、9 層
module.exports = {
  DAGBuilder: require('./src/orchestration-hub').DAGBuilder,
  Orchestrator: require('./src/orchestration-hub').Orchestrator,
  GitHubAdapter: require('./src/integration-network').GitHubAdapter,
  CloudflareAdapter: require('./src/integration-network').CloudflareAdapter,
  EvolutionLoop: require('./src/evolution-loop').EvolutionLoop,
};
