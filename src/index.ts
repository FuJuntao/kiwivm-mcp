#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KiwiVMClient } from "./client.js";
import { createAllTools } from "./tools/index.js";

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
  const server = new McpServer({ name: "kiwivm-mcp", version: "0.1.0" });

  createAllTools(server, client);

  server.connect(new StdioServerTransport()).catch(console.error);
}

main();
