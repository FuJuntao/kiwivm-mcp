import type { KiwiVMClient } from "../client.js";
import type { KiwiVMResponse, Snapshot, ToolDefinition } from "../types.js";

export function createSnapshotTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_snapshot",
        description:
          "Manage VPS snapshots: create, list, delete, restore, toggle sticky, export, import",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "create",
                "list",
                "delete",
                "restore",
                "toggleSticky",
                "export",
                "import",
              ],
              description: "Snapshot action to perform",
            },
            description: {
              type: "string",
              description: "Description for the snapshot (create action only)",
            },
            snapshot: {
              type: "string",
              description:
                "Filename of the snapshot (delete/restore/export/toggleSticky actions)",
            },
            sticky: {
              type: "number",
              enum: [0, 1],
              description:
                "Set sticky flag (1=sticky, 0=not sticky) for toggleSticky action",
            },
            source_veid: {
              type: "string",
              description: "Source VEID for import action",
            },
            source_token: {
              type: "string",
              description: "Source token for import action",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        switch (args["action"]) {
          case "create":
            return client.call("snapshot/create", {
              description: args["description"] as string | undefined,
            });
          case "list": {
            return client.call<KiwiVMResponse & { snapshots: Snapshot[] }>(
              "snapshot/list",
            );
          }
          case "delete":
            return client.call("snapshot/delete", {
              snapshot: args["snapshot"] as string | undefined,
            });
          case "restore":
            return client.call("snapshot/restore", {
              snapshot: args["snapshot"] as string | undefined,
            });
          case "toggleSticky":
            return client.call("snapshot/toggleSticky", {
              snapshot: args["snapshot"] as string | undefined,
              sticky: args["sticky"] as number | undefined,
            });
          case "export":
            return client.call("snapshot/export", {
              snapshot: args["snapshot"] as string | undefined,
            });
          case "import":
            return client.call("snapshot/import", {
              sourceVeid: args["source_veid"] as string | undefined,
              sourceToken: args["source_token"] as string | undefined,
            });
          default:
            throw new Error(`Unknown snapshot action: ${args["action"]}`);
        }
      },
    },
  ];
}
