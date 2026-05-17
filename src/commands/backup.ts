import type { KiwiVMClient } from "../client.ts";
import type { Backup, KiwiVMResponse } from "../types.ts";

interface BackupListResponse extends KiwiVMResponse {
  backups: Backup[];
}

export async function run(
  action: string,
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "list":
      return client.call<BackupListResponse>("backup/list");
    case "copy":
      return client.call("backup/copyToSnapshot", {
        backupToken: flags["backupToken"],
      });
    default:
      throw new Error(`Unknown backup action: ${action}. Valid: list, copy`);
  }
}
