import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.js";
import type { KiwiVMResponse, Snapshot } from "../types.js";
import { callApi } from "./utils.js";

export function createSnapshotTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_snapshot",
    {
      description:
        "Manage VPS snapshots: create, list, delete, restore, toggle sticky, export, import",
      inputSchema: {
        action: z.enum([
          "create",
          "list",
          "delete",
          "restore",
          "toggleSticky",
          "export",
          "import",
        ]),
        description: z.string().optional(),
        snapshot: z.string().optional(),
        sticky: z.number().int().min(0).max(1).optional(),
        source_veid: z.string().optional(),
        source_token: z.string().optional(),
      },
    },
    async (args) => {
      switch (args.action) {
        case "create":
          return callApi(() =>
            client.call("snapshot/create", {
              description: args.description,
            }),
          );
        case "list":
          return callApi(() =>
            client.call<KiwiVMResponse & { snapshots: Snapshot[] }>(
              "snapshot/list",
            ),
          );
        case "delete":
          return callApi(() =>
            client.call("snapshot/delete", { snapshot: args.snapshot }),
          );
        case "restore":
          return callApi(() =>
            client.call("snapshot/restore", { snapshot: args.snapshot }),
          );
        case "toggleSticky":
          return callApi(() =>
            client.call("snapshot/toggleSticky", {
              snapshot: args.snapshot,
              sticky: args.sticky,
            }),
          );
        case "export":
          return callApi(() =>
            client.call("snapshot/export", { snapshot: args.snapshot }),
          );
        case "import":
          return callApi(() =>
            client.call("snapshot/import", {
              sourceVeid: args.source_veid,
              sourceToken: args.source_token,
            }),
          );
      }
    },
  );
}
