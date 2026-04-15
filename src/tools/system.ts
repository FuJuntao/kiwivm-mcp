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
      handler: async (args: {
        action: string;
        new_hostname?: string;
        ip?: string;
        ptr?: string;
        ssh_keys?: string;
        os?: string;
      }) => {
        switch (args.action) {
          case "setHostname":
            return client.call("setHostname", { newHostname: args.new_hostname });
          case "setPTR":
            return client.call("setPTR", { ip: args.ip, ptr: args.ptr });
          case "resetRootPassword":
            return client.call("resetRootPassword");
          case "getSSHKeys":
            return client.call("getSshKeys");
          case "updateSSHKeys":
            return client.call("updateSshKeys", { sshKeys: args.ssh_keys });
          case "getAvailableOS":
            return client.call("getAvailableOS");
          case "reinstallOS":
            return client.call("reinstallOS", { os: args.os });
          default:
            throw new Error(`Unknown system action: ${args.action}`);
        }
      },
    },
  ];
}
