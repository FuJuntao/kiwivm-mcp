import type { KiwiVMClient } from "../client.ts";

export async function list(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("snapshot/list");
}

export async function create(
  _args: string[],
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("snapshot/create", {
    description: flags["desc"] || flags["description"],
  });
}

export async function deleteSnapshot(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const token = args[0];
  if (!token) {
    throw new Error("snapshot delete requires a <token> argument");
  }
  return client.call("snapshot/delete", { snapshot: token });
}

export async function restore(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const token = args[0];
  if (!token) {
    throw new Error("snapshot restore requires a <token> argument");
  }
  return client.call("snapshot/restore", { snapshot: token });
}

export async function sticky(
  args: string[],
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const token = args[0];
  if (!token) {
    throw new Error("snapshot sticky requires a <token> argument");
  }
  if (flags["on"] !== undefined && flags["off"] !== undefined) {
    throw new Error("snapshot sticky requires exactly one of --on or --off");
  }
  if (flags["on"] === undefined && flags["off"] === undefined) {
    throw new Error("snapshot sticky requires exactly one of --on or --off");
  }
  const stickyVal = flags["on"] !== undefined ? 1 : 0;
  return client.call("snapshot/toggleSticky", {
    snapshot: token,
    sticky: stickyVal,
  });
}

export async function exportSnapshot(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const token = args[0];
  if (!token) {
    throw new Error("snapshot export requires a <token> argument");
  }
  return client.call("snapshot/export", { snapshot: token });
}

export async function importSnapshot(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const sourceVeid = args[0];
  const sourceToken = args[1];
  if (!sourceVeid || !sourceToken) {
    throw new Error(
      "snapshot import requires both <sourceVeid> and <sourceToken> arguments",
    );
  }
  return client.call("snapshot/import", { sourceVeid, sourceToken });
}
