# @hol-org/langchain-registry-broker

LangChain tools for [Registry Broker](https://github.com/hashgraph-online/registry-broker) - Universal AI Agent Discovery.

[![npm version](https://badge.fury.io/js/@hol-org%2Flangchain-registry-broker.svg)](https://www.npmjs.com/package/@hol-org/langchain-registry-broker)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## What is Registry Broker?

Registry Broker is a universal index and routing layer for AI agents. It aggregates agent metadata from multiple registries:

- **NANDA** - Agentic protocol for AI coordination
- **MCP** - Model Context Protocol servers
- **OpenRouter** - LLM routing and models
- **A2A** - Agent-to-Agent protocol
- **Virtuals** - Virtual agents platform
- **Olas** - Autonomous agent network

## Installation

```bash
npm install @hol-org/langchain-registry-broker @langchain/core zod
```

## Quick Start

```typescript
import { createRegistryBrokerTools } from '@hol-org/langchain-registry-broker';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';

// Create Registry Broker tools
const tools = createRegistryBrokerTools();

// Use with LangChain agent
const llm = new ChatOpenAI({ model: 'gpt-4o-mini' });
const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
const executor = new AgentExecutor({ agent, tools });

// Ask the agent to find specialized AI agents
const response = await executor.invoke({
  input: 'Find me an AI agent that can help with code review',
});
```

## Available Tools

### `registry_broker_search`

Search for AI agents across all indexed protocols.

```typescript
import { RegistryBrokerSearchTool } from '@hol-org/langchain-registry-broker';

const searchTool = new RegistryBrokerSearchTool();

// Simple text search
await searchTool.invoke('code review assistant');

// Filtered search
await searchTool.invoke(JSON.stringify({
  query: 'research assistant',
  protocol: 'mcp',        // Filter by protocol
  capability: 'research', // Filter by capability
  limit: 10
}));
```

### `registry_broker_agent_details`

Get detailed information about a specific agent by UAID.

```typescript
import { RegistryBrokerAgentDetailsTool } from '@hol-org/langchain-registry-broker';

const detailsTool = new RegistryBrokerAgentDetailsTool();
await detailsTool.invoke('uaid:aid:example;uid=agent-1;registry=demo;proto=mcp');
```

## API

### `createRegistryBrokerTools(baseUrl?: string): Tool[]`

Creates both search and details tools with an optional custom base URL.

### `RegistryBrokerSearchTool`

- **name**: `registry_broker_search`
- **description**: Search for AI agents across multiple protocols
- **input**: Query string or JSON with `query`, `protocol`, `capability`, `limit`

### `RegistryBrokerAgentDetailsTool`

- **name**: `registry_broker_agent_details`
- **description**: Get detailed information about a specific agent
- **input**: UAID (Universal Agent ID) string

## Links

- [Registry Broker GitHub](https://github.com/hashgraph-online/registry-broker)
- [Registry Broker API Docs](https://hol.org/docs/api/registry-broker)
- [Standards SDK](https://github.com/hashgraph-online/standards-sdk)
- [Hashgraph Online](https://hol.org)
- [LangChain Documentation](https://js.langchain.com/)

## License

Apache 2.0
