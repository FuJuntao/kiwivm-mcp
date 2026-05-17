import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./snapshot.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("snapshot command", () => {
  describe("create", () => {
    it("calls snapshot/create with description flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await run(
        "create",
        { description: "pre-upgrade" },
        client,
      );

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/create", {
        description: "pre-upgrade",
      });
      expect(result).toEqual({ error: 0 });
    });

    it("calls snapshot/create without description when flag is omitted", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("create", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/create", {
        description: undefined,
      });
    });
  });

  describe("list", () => {
    it("calls snapshot/list", async () => {
      const { client, call } = mockClient();
      const snapshots = {
        error: 0,
        snapshots: [
          {
            fileName: "snap1",
            os: "Ubuntu",
            description: "",
            size: 1024,
            md5: "",
            sticky: 0,
            purgesIn: 0,
            downloadLink: "",
            downloadLinkSSL: "",
          },
        ],
      };
      call.mockResolvedValueOnce(snapshots);

      const result = await run("list", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/list");
      expect(result).toEqual(snapshots);
    });
  });

  describe("delete", () => {
    it("calls snapshot/delete with snapshot flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("delete", { snapshot: "snap1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/delete", {
        snapshot: "snap1",
      });
    });
  });

  describe("restore", () => {
    it("calls snapshot/restore with snapshot flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("restore", { snapshot: "snap1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/restore", {
        snapshot: "snap1",
      });
    });
  });

  describe("sticky", () => {
    it("calls snapshot/toggleSticky with snapshot and sticky flags", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("sticky", { snapshot: "snap1", sticky: "1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "snapshot/toggleSticky",
        { snapshot: "snap1", sticky: 1 },
      );
    });

    it("converts sticky flag string '0' to number 0", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("sticky", { snapshot: "snap1", sticky: "0" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "snapshot/toggleSticky",
        { snapshot: "snap1", sticky: 0 },
      );
    });
  });

  describe("export", () => {
    it("calls snapshot/export with snapshot flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("export", { snapshot: "snap1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/export", {
        snapshot: "snap1",
      });
    });
  });

  describe("import", () => {
    it("calls snapshot/import with sourceVeid and sourceToken", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run(
        "import",
        { sourceVeid: "67890", sourceToken: "abc123" },
        client,
      );

      expect(client.call).toHaveBeenCalledExactlyOnceWith("snapshot/import", {
        sourceVeid: "67890",
        sourceToken: "abc123",
      });
    });
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Snapshot not found"));

    await expect(
      run("delete", { snapshot: "nonexistent" }, client),
    ).rejects.toThrow("Snapshot not found");
  });
});
