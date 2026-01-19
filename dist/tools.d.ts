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
export declare class RegistryBrokerSearchTool extends Tool {
    name: string;
    description: string;
    private baseUrl;
    constructor(baseUrl?: string);
    _call(input: string): Promise<string>;
    private parseInput;
}
export declare class RegistryBrokerAgentDetailsTool extends Tool {
    name: string;
    description: string;
    private baseUrl;
    constructor(baseUrl?: string);
    _call(uaid: string): Promise<string>;
}
export declare function createRegistryBrokerTools(baseUrl?: string): Tool[];
//# sourceMappingURL=tools.d.ts.map