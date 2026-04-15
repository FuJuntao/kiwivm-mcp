#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { KiwiVMClient } from "./client.js";
import { createAllTools } from "./tools/index.js";
import { KiwiVMError } from "./types.js";

function main() {
  const veid = process.env["KIWIVM_VEID"];
  const apiKey = process.env["KIWIVM_API_KEY"];

  if (!veid || !apiKey) {
    console.error(
      "Error: KIWIVM_VEID and KIWIVM_API_KEY environment variables are required",
    );
    process.exit(1);
  }

  const client = new KiwiVMClient({ veid, apiKey });
  const tools = createAllTools(client);

  const server = new Server(
    { name: "kiwivm-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => t.tool),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolDef = tools.find((t) => t.tool.name === request.params.name);
    if (!toolDef) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    try {
      const result = await toolDef.handler(
        request.params.arguments as Record<string, unknown>,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message =
        error instanceof KiwiVMError ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  server.connect(transport).catch(console.error);
}

main();
