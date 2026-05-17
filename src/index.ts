#!/usr/bin/env node

import { KiwiVMClient } from "./client.ts";
import { KiwiVMError } from "./types.ts";

function parseFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg?.startsWith("--")) continue;
    const eqIdx = arg.indexOf("=");
    if (eqIdx !== -1) {
      const key = arg.slice(2, eqIdx);
      const value = arg.slice(eqIdx + 1);
      flags[toCamelCase(key)] = value;
    } else {
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        const key = arg.slice(2);
        flags[toCamelCase(key)] = next;
        i++;
      } else {
        // --flag with no value (treat as boolean/empty string)
        const key = arg.slice(2);
        flags[toCamelCase(key)] = "";
      }
    }
  }
  return flags;
}

function toCamelCase(key: string): string {
  // Known mappings: kebab-case flags that need camelCase API param names
  const known: Record<string, string> = {
    "backup-token": "backupToken",
    "new-hostname": "newHostname",
    "ssh-keys": "sshKeys",
    "source-veid": "sourceVeid",
    "source-token": "sourceToken",
    "record-id": "recordId",
    "api-key": "apiKey",
    "rate-limit": "rateLimit",
  };
  if (known[key]) return known[key];

  // Default: convert --some-flag to someFlag
  return key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function getCommandFromArgs(args: string[]): {
  positional: string[];
  flags: Record<string, string>;
} {
  const positional: string[] = [];
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (!arg || arg.startsWith("--")) {
      break;
    }
    positional.push(arg);
    i++;
  }
  const flagArgs = args.slice(i);
  const flags = parseFlags(flagArgs);
  return { positional, flags };
}

async function main() {
  const args = process.argv.slice(2);
  const { positional, flags } = getCommandFromArgs(args);

  const category = positional[0] ?? "";
  const action = positional[1] ?? "";

  // Handle help before auth (no credentials needed)
  if (category === "" || category === "help") {
    const { run } = await import("./commands/help.ts");
    const text = await run();
    console.log(text as string);
    return;
  }

  // Resolve auth: flags first, then env vars
  const flagVeid = flags["veid"];
  const flagApiKey = flags["apiKey"];
  const resolvedVeid = flagVeid || process.env["KIWIVM_VEID"];
  const resolvedApiKey = flagApiKey || process.env["KIWIVM_API_KEY"];

  if (!resolvedVeid || !resolvedApiKey) {
    console.error(
      "Error: VEID and API key are required. Use --veid and --api-key flags, or set KIWIVM_VEID and KIWIVM_API_KEY environment variables.",
    );
    process.exit(1);
  }

  // Strip auth flags before passing to handlers
  const handlerFlags = { ...flags };
  delete handlerFlags["veid"];
  delete handlerFlags["apiKey"];

  const client = new KiwiVMClient({
    veid: resolvedVeid,
    apiKey: resolvedApiKey,
  });

  try {
    let result: unknown;

    switch (category) {
      case "power": {
        const { run } = await import("./commands/power.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "info": {
        const { run } = await import("./commands/info.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "snapshot": {
        const { run } = await import("./commands/snapshot.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "backup": {
        const { run } = await import("./commands/backup.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "system": {
        const { run } = await import("./commands/system.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "network": {
        const { run } = await import("./commands/network.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "monitoring": {
        const { run } = await import("./commands/monitoring.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      case "admin": {
        const { run } = await import("./commands/admin.ts");
        result = await run(action, handlerFlags, client);
        break;
      }
      default: {
        console.error(`Unknown category: ${category}`);
        console.error("Run 'kiwivm-cli help' for usage.");
        process.exit(1);
      }
    }

    console.log(JSON.stringify(result));
  } catch (error) {
    const message =
      error instanceof KiwiVMError ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

export { main };

// Only auto-run when executed directly (not when imported by tests)
if (!process.env["VITEST"]) {
  main();
}
