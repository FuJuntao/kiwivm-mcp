import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { copy, list } from "./backup.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("backup handlers", () => {
  describe("list", () => {
    it("calls client.call('backup/list')", async () => {
      const { client, call } = mockClient();
      const backups = {
        error: 0,
        backups: [
          {
            backupToken: "tok1",
            size: 1024,
            os: "Ubuntu",
            md5: "abc",
            timestamp: 1700000000,
          },
        ],
      };
      call.mockResolvedValueOnce(backups);

      const result = await list([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("backup/list");
      expect(result).toEqual(backups);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(list([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("copy", () => {
    it("calls backup/copyToSnapshot with backup token from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await copy(["abc123"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("backup/copyToSnapshot", {
        backupToken: "abc123",
      });
    });

    it("throws when no backup token provided", async () => {
      const { client } = mockClient();

      await expect(copy([], {}, client)).rejects.toThrow("token");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Backup not found"));

      await expect(copy(["bad"], {}, client)).rejects.toThrow(
        "Backup not found",
      );
    });
  });
});
