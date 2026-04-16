import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.ts";
import { callApi } from "./utils.ts";

export function createMonitoringTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_monitoring",
    {
      description:
        "Detailed monitoring: audit log of API calls and API rate limit status.",
      inputSchema: {
        action: z.enum(["usageStats", "auditLog", "rateLimit"]),
      },
    },
    async ({ action }) => {
      switch (action) {
        case "usageStats":
          return callApi(() => client.call("getRawUsageStats"));
        case "auditLog":
          return callApi(() => client.call("getAuditLog"));
        case "rateLimit":
          return callApi(() => client.call("getRateLimitStatus"));
      }
    },
  );
}
