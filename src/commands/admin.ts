import type { KiwiVMClient } from "../client.ts";

export async function run(
  action: string,
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "suspensions":
      return client.call("getSuspensionDetails");
    case "unsuspend":
      return client.call("unsuspend", { recordId: flags["recordId"] });
    case "resolve":
      if (flags["recordId"] !== undefined) {
        return client.call("resolvePolicyViolation", {
          recordId: flags["recordId"],
        });
      }
      return client.call("getPolicyViolations");
    default:
      throw new Error(
        `Unknown admin action: ${action}. Valid: suspensions, unsuspend, resolve`,
      );
  }
}
