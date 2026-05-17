import type { KiwiVMClient } from "../client.ts";

export async function run(
  action: string,
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "usage":
      return client.call("getRawUsageStats");
    case "audit":
      return client.call("getAuditLog");
    case "rate-limit":
      return client.call("getRateLimitStatus");
    default:
      throw new Error(
        `Unknown monitoring action: ${action}. Valid: usage, audit, rate-limit`,
      );
  }
}
