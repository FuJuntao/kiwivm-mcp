import type { KiwiVMClient } from "../client.js";
import type { ToolDefinition } from "../types.js";

export function createNetworkTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_network",
        description:
          "Network management: add/delete IPv6 /64 subnets, assign/delete private IP addresses, " +
          "list available private IPs",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "addIPv6",
                "deleteIPv6",
                "listPrivateIps",
                "assignPrivateIp",
                "deletePrivateIp",
              ],
              description: "Network action to perform",
            },
            ip: {
              type: "string",
              description:
                "IP address (required for deleteIPv6 and deletePrivateIp, optional for assignPrivateIp)",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const action = args["action"] as string;
        const ip = args["ip"] as string | undefined;
        switch (action) {
          case "addIPv6":
            return client.call("ipv6/add");
          case "deleteIPv6":
            return client.call("ipv6/delete", { ip });
          case "listPrivateIps":
            return client.call("privateIp/getAvailableIps");
          case "assignPrivateIp":
            return client.call("privateIp/assign", { ip });
          case "deletePrivateIp":
            return client.call("privateIp/delete", { ip });
          default:
            throw new Error(`Unknown network action: ${action}`);
        }
      },
    },
  ];
}
