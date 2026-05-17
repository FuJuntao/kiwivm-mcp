import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./backup.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("backup command", () => {
  describe("list", () => {
    it("calls backup/list", async () => {
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

      const result = await run("list", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("backup/list");
      expect(result).toEqual(backups);
    });

    it("does not pass any extra params", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0, backups: [] });

      await run("list", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("backup/list");
    });
  });

  describe("copy", () => {
    it("calls backup/copyToSnapshot with backupToken", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("copy", { backupToken: "tok1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "backup/copyToSnapshot",
        { backupToken: "tok1" },
      );
    });
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Backup not found"));

    await expect(run("copy", { backupToken: "bad" }, client)).rejects.toThrow(
      "Backup not found",
    );
  });
});
