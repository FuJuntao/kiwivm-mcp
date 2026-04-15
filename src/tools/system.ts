import type { ToolDefinition } from "../types.js";
import type { KiwiVMClient } from "../client.js";

export function createSystemTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_system",
        description:
          "System management: set hostname, set PTR/rDNS, reset root password, manage SSH keys, " +
          "get available OS templates, reinstall OS",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "setHostname",
                "setPTR",
                "resetRootPassword",
                "getSSHKeys",
                "updateSSHKeys",
                "getAvailableOS",
                "reinstallOS",
              ],
              description: "System action to perform",
            },
            new_hostname: {
              type: "string",
              description: "New hostname (for setHostname)",
            },
            ip: {
              type: "string",
              description: "IP address (for setPTR)",
            },
            ptr: {
              type: "string",
              description: "PTR/rDNS value (for setPTR)",
            },
            ssh_keys: {
              type: "string",
              description: "SSH public key(s), one per line (for updateSSHKeys)",
            },
            os: {
              type: "string",
              description: "OS template name (for reinstallOS, get from getAvailableOS first)",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const action = args["action"] as string;
        const newHostname = args["new_hostname"] as string | undefined;
        const ip = args["ip"] as string | undefined;
        const ptr = args["ptr"] as string | undefined;
        const sshKeys = args["ssh_keys"] as string | undefined;
        const os = args["os"] as string | undefined;
        switch (action) {
          case "setHostname":
            return client.call("setHostname", { newHostname });
          case "setPTR":
            return client.call("setPTR", { ip, ptr });
          case "resetRootPassword":
            return client.call("resetRootPassword");
          case "getSSHKeys":
            return client.call("getSshKeys");
          case "updateSSHKeys":
            return client.call("updateSshKeys", { sshKeys });
          case "getAvailableOS":
            return client.call("getAvailableOS");
          case "reinstallOS":
            return client.call("reinstallOS", { os });
          default:
            throw new Error(`Unknown system action: ${action}`);
        }
      },
    },
  ];
}
