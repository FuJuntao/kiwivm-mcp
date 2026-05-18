import type { KiwiVMClient } from "../client.ts";

export async function rdnsSet(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const ip = args[0];
  const ptr = args[1];
  if (!ip || !ptr) {
    throw new Error("rdns set requires both <ip> and <ptr> arguments");
  }
  return client.call("setPTR", { ip, ptr });
}

export async function ipv6Add(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("ipv6/add");
}

export async function ipv6Delete(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const ip = args[0];
  if (!ip) {
    throw new Error("ipv6 delete requires a <subnet> argument");
  }
  return client.call("ipv6/delete", { ip });
}

export async function privateIpList(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("privateIp/getAvailableIps");
}

export async function privateIpAssign(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("privateIp/assign", { ip: args[0] });
}

export async function privateIpDelete(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const ip = args[0];
  if (!ip) {
    throw new Error("private-ip delete requires an <ip> argument");
  }
  return client.call("privateIp/delete", { ip });
}
