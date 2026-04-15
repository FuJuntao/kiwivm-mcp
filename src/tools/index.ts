import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { KiwiVMClient } from "../client.js";
import { createAdminTools } from "./admin.js";
import { createBackupTools } from "./backups.js";
import { createInfoTools } from "./info.js";
import { createMonitoringTools } from "./monitoring.js";
import { createNetworkTools } from "./network.js";
import { createPowerTools } from "./power.js";
import { createSnapshotTools } from "./snapshots.js";
import { createSystemTools } from "./system.js";

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
