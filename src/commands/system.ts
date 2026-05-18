import type { KiwiVMClient } from "../client.ts";

export async function hostname(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const name = args[0];
  if (!name) {
    throw new Error("hostname requires a <name> argument");
  }
  return client.call("setHostname", { newHostname: name });
}

export async function password(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("resetRootPassword");
}

export async function osList(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getAvailableOS");
}

export async function osReinstall(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const os = args[0];
  if (!os) {
    throw new Error("os reinstall requires a <template> argument");
  }
  return client.call("reinstallOS", { os });
}

export async function sshKeyShow(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getSshKeys");
}

export async function sshKeySet(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const keys = args[0];
  if (!keys) {
    throw new Error("ssh-key set requires a <keys> argument");
  }
  return client.call("updateSshKeys", { ssh_keys: keys });
}
