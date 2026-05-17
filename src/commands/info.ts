import type { KiwiVMClient } from "../client.ts";
import type { LiveServiceInfo, ServiceInfo } from "../types.ts";

export async function run(
  action: string,
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "live":
      return client.call<LiveServiceInfo>("getLiveServiceInfo");
    case "":
    case "info":
      return client.call<ServiceInfo>("getServiceInfo");
    default:
      throw new Error(
        `Unknown info action: ${action}. Valid: (no action), live`,
      );
  }
}
