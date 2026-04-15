import type { ToolDefinition, Backup, KiwiVMResponse } from "../types.js";
import type { KiwiVMClient } from "../client.js";

interface BackupListResponse extends KiwiVMResponse {
  backups: Backup[];
}

export function createBackupTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    {
      tool: {
        name: "kiwivm_backup",
        description:
          "Manage automatic backups: list available backups, or copy a backup to a restorable snapshot",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["list", "copyToSnapshot"],
              description: "Backup action to perform",
            },
            backup_token: {
              type: "string",
              description: "Backup token (required for copyToSnapshot action, from list action)",
            },
          },
          required: ["action"],
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const action = args["action"] as string;
        switch (action) {
          case "list": {
            return client.call<BackupListResponse>("backup/list");
          }
          case "copyToSnapshot":
            return client.call("backup/copyToSnapshot", {
              backupToken: args["backup_token"] as string | undefined,
            });
          default:
            throw new Error(`Unknown backup action: ${action}`);
        }
      },
    },
  ];
}
