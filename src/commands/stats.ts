import type { KiwiVMClient } from "../client.ts";

export async function usage(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getRawUsageStats");
}

export async function audit(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getAuditLog");
}

export async function rateLimit(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getRateLimitStatus");
}
