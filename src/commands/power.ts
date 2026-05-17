import type { KiwiVMClient } from "../client.ts";

export async function run(
  action: string,
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  switch (action) {
    case "start":
      return client.call("start");
    case "stop":
      return client.call("stop");
    case "restart":
      return client.call("restart");
    case "kill":
      return client.call("kill");
    default:
      throw new Error(
        `Unknown power action: ${action}. Valid: start, stop, restart, kill`,
      );
  }
}
