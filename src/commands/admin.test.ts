import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./admin.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("admin command", () => {
  describe("suspensions", () => {
    it("calls getSuspensionDetails", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        suspensions: [{ reason: "abuse", createdAt: "2025-01-01" }],
      });

      const result = await run("suspensions", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "getSuspensionDetails",
      );
      expect(result).toMatchObject({
        suspensions: [{ reason: "abuse" }],
      });
    });
  });

  describe("unsuspend", () => {
    it("calls unsuspend with record-id flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("unsuspend", { recordId: "42" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("unsuspend", {
        recordId: "42",
      });
    });
  });

  describe("resolve", () => {
    it("calls resolvePolicyViolation with record-id flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("resolve", { recordId: "42" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "resolvePolicyViolation",
        { recordId: "42" },
      );
    });
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Record not found"));

    await expect(run("unsuspend", { recordId: "999" }, client)).rejects.toThrow(
      "Record not found",
    );
  });
});
