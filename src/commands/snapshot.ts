import type { KiwiVMClient } from "../client.ts";
import type { KiwiVMResponse, Snapshot } from "../types.ts";

export async function run(
  action: string,
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "create":
      return client.call("snapshot/create", {
        description: flags["description"],
      });
    case "list":
      return client.call<KiwiVMResponse & { snapshots: Snapshot[] }>(
        "snapshot/list",
      );
    case "delete":
      return client.call("snapshot/delete", { snapshot: flags["snapshot"] });
    case "restore":
      return client.call("snapshot/restore", { snapshot: flags["snapshot"] });
    case "sticky":
      return client.call("snapshot/toggleSticky", {
        snapshot: flags["snapshot"],
        sticky:
          flags["sticky"] !== undefined ? Number(flags["sticky"]) : undefined,
      });
    case "export":
      return client.call("snapshot/export", { snapshot: flags["snapshot"] });
    case "import":
      return client.call("snapshot/import", {
        sourceVeid: flags["sourceVeid"],
        sourceToken: flags["sourceToken"],
      });
    default:
      throw new Error(
        `Unknown snapshot action: ${action}. Valid: create, list, delete, restore, sticky, export, import`,
      );
  }
}
