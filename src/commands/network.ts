import type { KiwiVMClient } from "../client.ts";

export async function run(
  action: string,
  flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "ipv6-add":
      return client.call("ipv6/add");
    case "ipv6-delete":
      return client.call("ipv6/delete", { ip: flags["ip"] });
    case "private-list":
      return client.call("privateIp/getAvailableIps");
    case "private-assign":
      return client.call("privateIp/assign", { ip: flags["ip"] });
    case "private-delete":
      return client.call("privateIp/delete", { ip: flags["ip"] });
    default:
      throw new Error(
        `Unknown network action: ${action}. Valid: ipv6-add, ipv6-delete, private-list, private-assign, private-delete`,
      );
  }
}
