import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import {
  notificationsGet,
  notificationsSet,
  suspensions,
  unsuspend,
  violationsList,
  violationsResolve,
} from "./admin.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("admin handlers", () => {
  describe("suspensions", () => {
    it("calls getSuspensionDetails", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        suspensions: [{ reason: "abuse", createdAt: "2025-01-01" }],
      });

      const result = await suspensions([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getSuspensionDetails");
      expect(result).toMatchObject({
        suspensions: [{ reason: "abuse" }],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(suspensions([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("unsuspend", () => {
    it("calls unsuspend with recordId from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await unsuspend(["11851"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("unsuspend", {
        record_id: "11851",
      });
    });

    it("throws when no record ID provided", async () => {
      const { client } = mockClient();

      await expect(unsuspend([], {}, client)).rejects.toThrow("record");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Record not found"));

      await expect(unsuspend(["999"], {}, client)).rejects.toThrow(
        "Record not found",
      );
    });
  });

  describe("violationsList", () => {
    it("calls getPolicyViolations", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        violations: [{ id: 14, reason: "abuse" }],
      });

      const result = await violationsList([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getPolicyViolations");
      expect(result).toMatchObject({
        violations: [{ id: 14, reason: "abuse" }],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(violationsList([], {}, client)).rejects.toThrow(
        "API failure",
      );
    });
  });

  describe("violationsResolve", () => {
    it("calls resolvePolicyViolation with recordId from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await violationsResolve(["14"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("resolvePolicyViolation", {
        record_id: "14",
      });
    });

    it("throws when no record ID provided", async () => {
      const { client } = mockClient();

      await expect(violationsResolve([], {}, client)).rejects.toThrow("record");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Failed to resolve"));

      await expect(violationsResolve(["14"], {}, client)).rejects.toThrow(
        "Failed to resolve",
      );
    });
  });

  describe("notificationsGet", () => {
    it("calls kiwivm/getNotificationPreferences", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        preferences: { "1": 1, "2": 0 },
      });

      const result = await notificationsGet([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith(
        "kiwivm/getNotificationPreferences",
      );
      expect(result).toMatchObject({ preferences: { "1": 1, "2": 0 } });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(notificationsGet([], {}, client)).rejects.toThrow(
        "API failure",
      );
    });
  });

  describe("notificationsSet", () => {
    it("calls kiwivm/setNotificationPreferences with JSON from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await notificationsSet(['{"1":1,"2":0}'], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith(
        "kiwivm/setNotificationPreferences",
        { json_notification_preferences: '{"1":1,"2":0}' },
      );
    });

    it("throws when no preferences JSON provided", async () => {
      const { client } = mockClient();

      await expect(notificationsSet([], {}, client)).rejects.toThrow(/json/);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Invalid preferences"));

      await expect(notificationsSet(['{"1":1}'], {}, client)).rejects.toThrow(
        "Invalid preferences",
      );
    });
  });
});
