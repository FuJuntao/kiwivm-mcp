#!/usr/bin/env node

import { KiwiVMClient } from "./client.ts";
import * as admin from "./commands/admin.ts";
import * as backup from "./commands/backup.ts";
import * as help from "./commands/help.ts";
import * as info from "./commands/info.ts";
import * as iso from "./commands/iso.ts";
import * as migrate from "./commands/migrate.ts";
import * as network from "./commands/network.ts";
import * as power from "./commands/power.ts";
import * as shell from "./commands/shell.ts";
import * as snapshot from "./commands/snapshot.ts";
import * as stats from "./commands/stats.ts";
import * as system from "./commands/system.ts";
import { KiwiVMError } from "./types.ts";

type Handler = (
  args: string[],
  flags: Record<string, string>,
  client: KiwiVMClient,
) => Promise<unknown>;

interface SubcommandRoutes {
  default?: Handler;
  [subcommand: string]: Handler | undefined;
}

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
        const key = arg.slice(2);
        flags[toCamelCase(key)] = "1";
      }
    }
  }
  return flags;
}

function toCamelCase(key: string): string {
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

  const command = positional[0] ?? "";

  if (command === "" || command === "help") {
    console.log(await help.run());
    return;
  }

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

  const handlerFlags = { ...flags };
  delete handlerFlags["veid"];
  delete handlerFlags["apiKey"];

  const client = new KiwiVMClient({
    veid: resolvedVeid,
    apiKey: resolvedApiKey,
  });

  try {
    let result: unknown;

    const ROUTES: Record<string, Handler | SubcommandRoutes> = {
      start: power.start,
      stop: power.stop,
      restart: power.restart,
      kill: power.kill,
      info: info.info,
      status: info.status,
      hostname: system.hostname,
      password: system.password,
      suspensions: admin.suspensions,
      unsuspend: admin.unsuspend,
      clone: migrate.clone,

      snapshot: {
        list: snapshot.list,
        create: snapshot.create,
        delete: snapshot.deleteSnapshot,
        restore: snapshot.restore,
        sticky: snapshot.sticky,
        export: snapshot.exportSnapshot,
        import: snapshot.importSnapshot,
      },
      backup: {
        list: backup.list,
        copy: backup.copy,
      },
      os: {
        list: system.osList,
        reinstall: system.osReinstall,
      },
      "ssh-key": {
        default: system.sshKeyShow,
        set: system.sshKeySet,
      },
      rdns: {
        set: network.rdnsSet,
      },
      ipv6: {
        add: network.ipv6Add,
        delete: network.ipv6Delete,
      },
      "private-ip": {
        list: network.privateIpList,
        assign: network.privateIpAssign,
        delete: network.privateIpDelete,
      },
      iso: {
        mount: iso.mount,
        unmount: iso.unmount,
      },
      shell: {
        exec: shell.exec,
        script: shell.script,
      },
      migrate: {
        locations: migrate.locations,
        start: migrate.migrateStart,
      },
      stats: {
        usage: stats.usage,
        audit: stats.audit,
        "rate-limit": stats.rateLimit,
      },
      violations: {
        default: admin.violationsList,
        resolve: admin.violationsResolve,
      },
      notifications: {
        default: admin.notificationsGet,
        set: admin.notificationsSet,
      },
    };

    const route = ROUTES[command];

    if (!route) {
      console.error(`Unknown command: ${command}`);
      console.error("Run 'kiwivm-cli help' for usage.");
      process.exit(1);
    }

    if (typeof route === "function") {
      result = await route(positional.slice(1), handlerFlags, client);
    } else {
      const subcommand = positional[1];
      let handler: Handler | undefined;

      if (subcommand && subcommand in route) {
        handler = route[subcommand];
      } else if (!subcommand && route.default) {
        handler = route.default;
      }

      if (!handler) {
        const valid = Object.keys(route)
          .filter((k) => k !== "default")
          .join(", ");
        const sc = subcommand || "(none)";
        console.error(
          `Unknown subcommand for ${command}: ${sc}. Valid: ${valid}`,
        );
        process.exit(1);
      }

      result = await handler(positional.slice(2), handlerFlags, client);
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

if (!process.env["VITEST"]) {
  main();
}
