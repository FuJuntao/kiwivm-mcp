import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.ts";
import { callApi } from "./utils.ts";

export function createSystemTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_system",
    {
      description:
        "System management: set hostname, set PTR/rDNS, reset root password, manage SSH keys, " +
        "get available OS templates, reinstall OS",
      inputSchema: {
        action: z.enum([
          "setHostname",
          "setPTR",
          "resetRootPassword",
          "getSSHKeys",
          "updateSSHKeys",
          "getAvailableOS",
          "reinstallOS",
        ]),
        new_hostname: z.string().optional(),
        ip: z.string().optional(),
        ptr: z.string().optional(),
        ssh_keys: z.string().optional(),
        os: z.string().optional(),
      },
    },
    async (args) => {
      switch (args.action) {
        case "setHostname":
          return callApi(() =>
            client.call("setHostname", { newHostname: args.new_hostname }),
          );
        case "setPTR":
          return callApi(() =>
            client.call("setPTR", { ip: args.ip, ptr: args.ptr }),
          );
        case "resetRootPassword":
          return callApi(() => client.call("resetRootPassword"));
        case "getSSHKeys":
          return callApi(() => client.call("getSshKeys"));
        case "updateSSHKeys":
          return callApi(() =>
            client.call("updateSshKeys", { sshKeys: args.ssh_keys }),
          );
        case "getAvailableOS":
          return callApi(() => client.call("getAvailableOS"));
        case "reinstallOS":
          return callApi(() => client.call("reinstallOS", { os: args.os }));
      }
    },
  );
}
