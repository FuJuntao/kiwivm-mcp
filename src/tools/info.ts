import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.ts";
import type { LiveServiceInfo, ServiceInfo } from "../types.ts";
import { callApi } from "./utils.ts";

export function createInfoTools(server: McpServer, client: KiwiVMClient): void {
  server.registerTool(
    "kiwivm_service_info",
    {
      description:
        "Get VPS service information including plan details, IP addresses, OS, and monthly bandwidth usage (plan_monthly_data, data_counter, data_next_reset). " +
        "Set include_live=true for real-time status (CPU, RAM, disk, uptime, screenshot). " +
        "Note: include_live may take up to 15 seconds to complete.",
      inputSchema: {
        include_live: z.boolean().optional(),
      },
    },
    async ({ include_live }) => {
      if (include_live) {
        return callApi(() =>
          client.call<LiveServiceInfo>("getLiveServiceInfo"),
        );
      }
      return callApi(() => client.call<ServiceInfo>("getServiceInfo"));
    },
  );
}
