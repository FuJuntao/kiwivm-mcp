import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KiwiVMClient } from "../client.js";
import { callApi } from "./utils.js";

export function createAdminTools(
  server: McpServer,
  client: KiwiVMClient,
): void {
  server.registerTool(
    "kiwivm_admin",
    {
      description:
        "Administration: get suspension details, get policy violations, unsuspend VPS, " +
        "resolve policy violations",
      inputSchema: {
        action: z.enum([
          "getSuspensions",
          "getPolicyViolations",
          "unsuspend",
          "resolvePolicyViolation",
        ]),
        record_id: z.string().optional(),
      },
    },
    async ({ action, record_id }) => {
      switch (action) {
        case "getSuspensions":
          return callApi(() => client.call("getSuspensionDetails"));
        case "getPolicyViolations":
          return callApi(() => client.call("getPolicyViolations"));
        case "unsuspend":
          return callApi(() =>
            client.call("unsuspend", { recordId: record_id }),
          );
        case "resolvePolicyViolation":
          return callApi(() =>
            client.call("resolvePolicyViolation", { recordId: record_id }),
          );
      }
    },
  );
}
