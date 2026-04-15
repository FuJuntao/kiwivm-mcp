import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.ts";
import { callApi } from "./utils.ts";

export function createNetworkTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_network",
    {
      description:
        "Network management: add/delete IPv6 /64 subnets, assign/delete private IP addresses, " +
        "list available private IPs",
      inputSchema: {
        action: z.enum([
          "addIPv6",
          "deleteIPv6",
          "listPrivateIps",
          "assignPrivateIp",
          "deletePrivateIp",
        ]),
        ip: z.string().optional(),
      },
    },
    async ({ action, ip }) => {
      switch (action) {
        case "addIPv6":
          return callApi(() => client.call("ipv6/add"));
        case "deleteIPv6":
          return callApi(() => client.call("ipv6/delete", { ip }));
        case "listPrivateIps":
          return callApi(() => client.call("privateIp/getAvailableIps"));
        case "assignPrivateIp":
          return callApi(() => client.call("privateIp/assign", { ip }));
        case "deletePrivateIp":
          return callApi(() => client.call("privateIp/delete", { ip }));
      }
    },
  );
}
