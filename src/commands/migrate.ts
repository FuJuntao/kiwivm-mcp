import type { KiwiVMClient } from "../client.ts";

export async function locations(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("migrate/getLocations");
}

export async function migrateStart(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const location = args[0];
  if (!location) {
    throw new Error("migrate start requires a <location> argument");
  }
  return client.call("migrate/start", { location });
}

export async function clone(
  args: string[],
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const ip = args[0];
  const password = args[1];
  if (!ip || !password) {
    throw new Error("clone requires both <ip> and <password> arguments");
  }
  return client.call("cloneFromExternalServer", {
    externalServerIP: ip,
    externalServerSSHport: flags["port"] || "22",
    externalServerRootPassword: password,
  });
}
