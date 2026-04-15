import type { KiwiVMClient } from "../client.js";
import type { LiveServiceInfo, ServiceInfo, ToolDefinition } from "../types.js";

export function createInfoTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_service_info",
        description:
          "Get VPS service information including plan details, IP addresses, OS, and bandwidth usage. " +
          "Set include_live=true for real-time status (CPU, RAM, disk, uptime, screenshot). " +
          "Note: include_live may take up to 15 seconds to complete.",
        inputSchema: {
          type: "object",
          properties: {
            include_live: {
              type: "boolean",
              description:
                "Include live VPS status (CPU, RAM, disk, uptime). May take up to 15 seconds.",
            },
          },
        },
      },
      handler: async (args?: { include_live?: boolean }) => {
        if (args?.include_live) {
          return client.call<LiveServiceInfo>("getLiveServiceInfo");
        }
        return client.call<ServiceInfo>("getServiceInfo");
      },
    },
  ];
}
