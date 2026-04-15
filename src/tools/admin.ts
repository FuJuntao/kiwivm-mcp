import type { ToolDefinition } from "../types.js";
import type { KiwiVMClient } from "../client.js";

export function createAdminTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_admin",
        description:
          "Administration: get suspension details, get policy violations, unsuspend VPS, " +
          "resolve policy violations",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "getSuspensions",
                "getPolicyViolations",
                "unsuspend",
                "resolvePolicyViolation",
              ],
              description: "Admin action to perform",
            },
            record_id: {
              type: "string",
              description: "Record ID (required for unsuspend and resolvePolicyViolation)",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const action = args["action"] as string;
        switch (action) {
          case "getSuspensions":
            return client.call("getSuspensionDetails");
          case "getPolicyViolations":
            return client.call("getPolicyViolations");
          case "unsuspend":
            return client.call("unsuspend", { recordId: args["record_id"] as string });
          case "resolvePolicyViolation":
            return client.call("resolvePolicyViolation", { recordId: args["record_id"] as string });
          default:
            throw new Error(`Unknown admin action: ${action}`);
        }
      },
    },
  ];
}
