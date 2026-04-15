import type { ToolDefinition } from "../types.js";
import type { KiwiVMClient } from "../client.js";

const ACTIONS = ["start", "stop", "restart", "kill"] as const;

export function createPowerTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_power",
        description: "Control VPS power state (start, stop, restart, or force kill)",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ACTIONS,
              description: "Power action to perform",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        return client.call(args["action"] as string);
      },
    },
  ];
}
