/**
 * Test script for Registry Broker LangChain integration
 * Tests the tools against the live Registry Broker API
 */

import { RegistryBrokerSearchTool, RegistryBrokerAgentDetailsTool } from './tools.js';

async function test() {
  console.log('🧪 Testing Registry Broker LangChain Tools\n');

  const searchTool = new RegistryBrokerSearchTool();
  const detailsTool = new RegistryBrokerAgentDetailsTool();

  console.log('Test 1: Basic search with string input');
  console.log('─'.repeat(50));
  const result1 = await searchTool.invoke('code assistant');
  const parsed1 = JSON.parse(result1);
  console.log(`Success: ${parsed1.success}`);
  console.log(`Total agents found: ${parsed1.total || 0}`);
  if (parsed1.agents?.length > 0) {
    console.log(`First agent: ${parsed1.agents[0].name}`);
  }
  console.log('');

  console.log('Test 2: Search with JSON input and filters');
  console.log('─'.repeat(50));
  const result2 = await searchTool.invoke(
    JSON.stringify({
      query: 'research',
      limit: 3,
    }),
  );
  const parsed2 = JSON.parse(result2);
  console.log(`Success: ${parsed2.success}`);
  console.log(`Agents returned: ${parsed2.agents?.length || 0}`);
  console.log('');

  console.log('Test 3: Search for MCP agents');
  console.log('─'.repeat(50));
  const result3 = await searchTool.invoke(
    JSON.stringify({
      query: 'file management',
      protocol: 'mcp',
      limit: 5,
    }),
  );
  const parsed3 = JSON.parse(result3);
  console.log(`Success: ${parsed3.success}`);
  console.log(`MCP agents found: ${parsed3.agents?.length || 0}`);
  if (parsed3.agents?.length > 0) {
    console.log('Agents:');
    parsed3.agents.forEach((agent: { name: string; protocol: string }) => {
      console.log(`  - ${agent.name} (${agent.protocol})`);
    });
  }
  console.log('');

  console.log('Test 4: Empty search results handling');
  console.log('─'.repeat(50));
  const result4 = await searchTool.invoke('xyznonexistentagent12345');
  const parsed4 = JSON.parse(result4);
  console.log(`Success: ${parsed4.success}`);
  console.log(`Message: ${parsed4.message || 'Found results'}`);
  console.log('');

  console.log('✅ All tests completed!');
}

test().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
