import type { KiwiVMClient } from "../client.ts";

export async function list(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("backup/list");
}

export async function copy(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const token = args[0];
  if (!token) {
    throw new Error("backup copy requires a <token> argument");
  }
  return client.call("backup/copyToSnapshot", { backupToken: token });
}
