import type { KiwiVMClient } from "../client.ts";
import type { LiveServiceInfo, ServiceInfo } from "../types.ts";

export async function info(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call<ServiceInfo>("getServiceInfo");
}

export async function status(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call<LiveServiceInfo>("getLiveServiceInfo");
}
