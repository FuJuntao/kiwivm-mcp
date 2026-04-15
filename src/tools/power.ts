import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.ts";
import { callApi } from "./utils.ts";

export function createPowerTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_power",
    {
      description:
        "Control VPS power state (start, stop, restart, or force kill)",
      inputSchema: {
        action: z.enum(["start", "stop", "restart", "kill"]),
      },
    },
    async ({ action }) => callApi(() => client.call(action)),
  );
}
