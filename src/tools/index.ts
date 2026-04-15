import type { KiwiVMClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { createAdminTools } from "./admin.js";
import { createBackupTools } from "./backups.js";
import { createInfoTools } from "./info.js";
import { createMonitoringTools } from "./monitoring.js";
import { createNetworkTools } from "./network.js";
import { createPowerTools } from "./power.js";
import { createSnapshotTools } from "./snapshots.js";
import { createSystemTools } from "./system.js";

export function createAllTools(client: KiwiVMClient): ToolDefinition[] {
  return [
    ...createPowerTools(client),
    ...createInfoTools(client),
    ...createSnapshotTools(client),
    ...createBackupTools(client),
    ...createSystemTools(client),
    ...createNetworkTools(client),
    ...createMonitoringTools(client),
    ...createAdminTools(client),
  ];
}
