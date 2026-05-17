import type { KiwiVMClient } from "../client.ts";

export async function run(
  action: string,
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "hostname":
      return client.call("setHostname", { newHostname: flags["newHostname"] });
    case "rdns":
      return client.call("setPTR", { ip: flags["ip"], ptr: flags["ptr"] });
    case "password":
      return client.call("resetRootPassword");
    case "sshkey":
      if (flags["sshKeys"] !== undefined) {
        return client.call("updateSshKeys", { sshKeys: flags["sshKeys"] });
      }
      return client.call("getSshKeys");
    case "os":
      return client.call("getAvailableOS");
    case "reinstall":
      return client.call("reinstallOS", { os: flags["os"] });
    default:
      throw new Error(
        `Unknown system action: ${action}. Valid: hostname, rdns, password, sshkey, os, reinstall`,
      );
  }
}
