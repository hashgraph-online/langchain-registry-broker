/**
 * LangChain Tool for Registry Broker - Universal AI Agent Discovery
 *
 * This tool allows LangChain agents to discover and search for AI agents
 * across multiple protocols (NANDA, MCP, OpenRouter, A2A, Virtuals, etc.)
 * using the Registry Broker universal index.
 *
 * @see https://github.com/hashgraph-online/registry-broker
 * @see https://hol.org/docs/api/registry-broker
 */

import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

interface SearchHit {
  id: string;
  uaid?: string;
  name?: string;
  description?: string;
  registry?: string;
  capabilities?: number[];
  endpoints?: {
    primary?: string;
  };
  metadata?: {
    protocol?: string;
  };
  profile?: {
    display_name?: string;
    description?: string;
  };
  lastSeen?: string;
  createdAt?: string;
}

interface SearchResponse {
  hits: SearchHit[];
  total: number;
  page: number;
  limit: number;
}

const SearchInputSchema = z.object({
  query: z.string().describe('Natural language search query for finding AI agents'),
  protocol: z
    .string()
    .optional()
    .describe('Filter by protocol: nanda, mcp, openrouter, a2a, virtuals, olas'),
  capability: z
    .string()
    .optional()
    .describe('Filter by capability: chat, code, research, creative, analysis'),
  limit: z.number().optional().default(5).describe('Maximum number of results to return'),
});

type SearchInput = z.infer<typeof SearchInputSchema>;

export class RegistryBrokerSearchTool extends Tool {
  name = 'registry_broker_search';
  description = `Search for AI agents across multiple protocols using Registry Broker.
Use this tool when you need to find specialized AI agents for specific tasks.
The Registry Broker indexes agents from NANDA, MCP, OpenRouter, A2A, Virtuals, and more.

Input should include:
- query: What kind of agent are you looking for? (e.g., "code review agent", "research assistant")
- protocol: (optional) Filter by specific protocol
- capability: (optional) Filter by capability type
- limit: (optional) Number of results (default: 5)`;

  private baseUrl: string;

  constructor(baseUrl: string = 'https://hol.org/registry/api/v1') {
    super();
    this.baseUrl = baseUrl;
  }

  async _call(input: string): Promise<string> {
    try {
      const parsed = this.parseInput(input);
      
      const params = new URLSearchParams();
      params.set('q', parsed.query);
      params.set('limit', String(parsed.limit || 5));
      if (parsed.protocol) {
        params.set('protocols', parsed.protocol);
      }
      if (parsed.capability) {
        params.set('capabilities', parsed.capability);
      }

      const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Registry Broker API error: ${response.status}`);
      }

      const results = (await response.json()) as SearchResponse;

      if (!results.hits || results.hits.length === 0) {
        return JSON.stringify({
          success: true,
          message: 'No agents found matching your criteria',
          agents: [],
        });
      }

      const agents = results.hits.map((hit) => ({
        id: hit.id,
        name: hit.name || hit.profile?.display_name || 'Unknown Agent',
        description: hit.description || hit.profile?.description || '',
        protocol: hit.metadata?.protocol || hit.registry,
        capabilities: hit.capabilities || [],
        endpoint: hit.endpoints?.primary || null,
        uaid: hit.uaid,
      }));

      return JSON.stringify({
        success: true,
        total: results.total,
        agents,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  private parseInput(input: string): SearchInput {
    try {
      const parsed = JSON.parse(input);
      return SearchInputSchema.parse(parsed);
    } catch {
      return { query: input, limit: 5 };
    }
  }
}

export class RegistryBrokerAgentDetailsTool extends Tool {
  name = 'registry_broker_agent_details';
  description = `Get detailed information about a specific AI agent by its UAID (Universal Agent ID).
Use this after searching to get full details about an agent before interacting with it.

Input: The UAID of the agent (e.g., "uaid:aid:example;uid=agent-1;registry=demo;proto=mcp")`;

  private baseUrl: string;

  constructor(baseUrl: string = 'https://hol.org/registry/api/v1') {
    super();
    this.baseUrl = baseUrl;
  }

  async _call(uaid: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.set('q', uaid.trim());
      params.set('limit', '1');

      const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Registry Broker API error: ${response.status}`);
      }

      const results = (await response.json()) as SearchResponse;

      if (!results.hits || results.hits.length === 0) {
        return JSON.stringify({
          success: false,
          error: 'Agent not found',
        });
      }

      const agent = results.hits[0];
      return JSON.stringify({
        success: true,
        agent: {
          id: agent.id,
          uaid: agent.uaid,
          name: agent.name || agent.profile?.display_name,
          description: agent.description || agent.profile?.description,
          protocol: agent.metadata?.protocol || agent.registry,
          capabilities: agent.capabilities,
          endpoints: agent.endpoints,
          profile: agent.profile,
          metadata: agent.metadata,
          lastSeen: agent.lastSeen,
          createdAt: agent.createdAt,
        },
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
}

export function createRegistryBrokerTools(
  baseUrl: string = 'https://hol.org/registry/api/v1',
): Tool[] {
  return [
    new RegistryBrokerSearchTool(baseUrl),
    new RegistryBrokerAgentDetailsTool(baseUrl),
  ];
}
