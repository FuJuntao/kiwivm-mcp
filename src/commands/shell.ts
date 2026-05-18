import type { KiwiVMClient } from "../client.ts";

export async function exec(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const command = args[0];
  if (!command) {
    throw new Error("shell exec requires a <command> argument");
  }
  return client.call("basicShell/exec", { command });
}

export async function script(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const scriptContent = args[0];
  if (!scriptContent) {
    throw new Error("shell script requires a <script> argument");
  }
  return client.call("shellScript/exec", { script: scriptContent });
}
