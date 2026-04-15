import type { KiwiVMClient } from "../client.js";
import type { ToolDefinition } from "../types.js";

export function createMonitoringTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_monitoring",
        description:
          "Monitoring and statistics: view raw usage stats, audit log, and API rate limit status",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["usageStats", "auditLog", "rateLimit"],
              description: "Type of monitoring data to retrieve",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const action = args["action"] as string;
        switch (action) {
          case "usageStats":
            return client.call("getRawUsageStats");
          case "auditLog":
            return client.call("getAuditLog");
          case "rateLimit":
            return client.call("getRateLimitStatus");
          default:
            throw new Error(`Unknown monitoring action: ${action}`);
        }
      },
    },
  ];
}
