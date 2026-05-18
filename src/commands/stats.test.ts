import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { audit, rateLimit, usage } from "./stats.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("stats handlers", () => {
  describe("usage", () => {
    it("calls getRawUsageStats", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        data: [{ month: "2025-01", usage: 100 }],
      });

      const result = await usage([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getRawUsageStats");
      expect(result).toMatchObject({
        data: [{ month: "2025-01", usage: 100 }],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(usage([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("audit", () => {
    it("calls getAuditLog", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        logs: [{ timestamp: 1700000000, action: "restart" }],
      });

      const result = await audit([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getAuditLog");
      expect(result).toMatchObject({
        logs: [{ timestamp: 1700000000, action: "restart" }],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(audit([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("rateLimit", () => {
    it("calls getRateLimitStatus", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        remaining: 950,
        limit: 1000,
      });

      const result = await rateLimit([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getRateLimitStatus");
      expect(result).toMatchObject({ remaining: 950, limit: 1000 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Rate limited"));

      await expect(rateLimit([], {}, client)).rejects.toThrow("Rate limited");
    });
  });
});
