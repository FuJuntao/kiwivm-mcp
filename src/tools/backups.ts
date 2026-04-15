import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.js";
import type { Backup, KiwiVMResponse } from "../types.js";
import { callApi } from "./utils.js";

interface BackupListResponse extends KiwiVMResponse {
  backups: Backup[];
}

export function createBackupTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_backup",
    {
      description:
        "Manage automatic backups: list available backups, or copy a backup to a restorable snapshot",
      inputSchema: {
        action: z.enum(["list", "copyToSnapshot"]),
        backup_token: z.string().optional(),
      },
    },
    async ({ action, backup_token }) => {
      switch (action) {
        case "list":
          return callApi(() => client.call<BackupListResponse>("backup/list"));
        case "copyToSnapshot":
          return callApi(() =>
            client.call("backup/copyToSnapshot", { backupToken: backup_token }),
          );
      }
    },
  );
}
