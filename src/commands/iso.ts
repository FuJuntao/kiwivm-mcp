import type { KiwiVMClient } from "../client.ts";

export async function mount(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const iso = args[0];
  if (!iso) {
    throw new Error("iso mount requires a <name> argument");
  }
  return client.call("iso/mount", { iso });
}

export async function unmount(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("iso/unmount");
}
