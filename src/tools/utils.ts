import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { KiwiVMError } from "../types.ts";

/**
 * Wraps an API call, formatting the result or error as a CallToolResult.
 */
export async function callApi<T>(
  fn: () => Promise<T>,
): Promise<CallToolResult> {
  try {
    const result = await fn();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message =
      error instanceof KiwiVMError ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
}
