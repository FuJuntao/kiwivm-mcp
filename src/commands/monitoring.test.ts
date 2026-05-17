import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./monitoring.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("monitoring command", () => {
  describe("usage", () => {
    it("calls getRawUsageStats", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        data: [{ month: "2025-01", usage: 100 }],
      });

      const result = await run("usage", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("getRawUsageStats");
      expect(result).toMatchObject({
        data: [{ month: "2025-01", usage: 100 }],
      });
    });
  });

  describe("audit", () => {
    it("calls getAuditLog", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        logs: [{ timestamp: 1700000000, action: "restart" }],
      });

      const result = await run("audit", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("getAuditLog");
      expect(result).toMatchObject({
        logs: [{ timestamp: 1700000000, action: "restart" }],
      });
    });
  });

  describe("rate-limit", () => {
    it("calls getRateLimitStatus", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        remaining: 950,
        limit: 1000,
      });

      const result = await run("rate-limit", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("getRateLimitStatus");
      expect(result).toMatchObject({ remaining: 950, limit: 1000 });
    });
  });

  it("returns the complete API response", async () => {
    const { client, call } = mockClient();
    const apiResponse = {
      error: 0,
      remaining: 500,
      limit: 1000,
      reset: 1700000000,
    };
    call.mockResolvedValueOnce(apiResponse);

    const result = await run("rate-limit", {}, client);

    expect(result).toEqual(apiResponse);
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Rate limited"));

    await expect(run("audit", {}, client)).rejects.toThrow("Rate limited");
  });
});
