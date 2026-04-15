import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { KiwiVMClient } from "../client.ts";
import { createAdminTools } from "./admin.ts";
import { createBackupTools } from "./backups.ts";
import { createInfoTools } from "./info.ts";
import { createMonitoringTools } from "./monitoring.ts";
import { createNetworkTools } from "./network.ts";
import { createPowerTools } from "./power.ts";
import { createSnapshotTools } from "./snapshots.ts";
import { createSystemTools } from "./system.ts";

export function createAllTools(server: McpServer, client: KiwiVMClient): void {
  createPowerTools(server, client);
  createInfoTools(server, client);
  createSnapshotTools(server, client);
  createBackupTools(server, client);
  createSystemTools(server, client);
  createNetworkTools(server, client);
  createMonitoringTools(server, client);
  createAdminTools(server, client);
}
