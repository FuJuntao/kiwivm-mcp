import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import {
  create,
  deleteSnapshot,
  exportSnapshot,
  importSnapshot,
  list,
  restore,
  sticky,
} from "./snapshot.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("snapshot handlers", () => {
  describe("list", () => {
    it("calls client.call('snapshot/list')", async () => {
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

      const result = await list([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/list");
      expect(result).toEqual(snapshots);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(list([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("create", () => {
    it("calls snapshot/create with description flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await create([], { desc: "pre-upgrade" }, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/create", {
        description: "pre-upgrade",
      });
      expect(result).toEqual({ error: 0 });
    });

    it("calls snapshot/create with description undefined when flag omitted", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await create([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/create", {
        description: undefined,
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(create([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("deleteSnapshot", () => {
    it("calls snapshot/delete with snapshot token from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await deleteSnapshot(["snap1"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/delete", {
        snapshot: "snap1",
      });
    });

    it("throws when no snapshot token provided", async () => {
      const { client } = mockClient();

      await expect(deleteSnapshot([], {}, client)).rejects.toThrow(/token/);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Snapshot not found"));

      await expect(deleteSnapshot(["nonexistent"], {}, client)).rejects.toThrow(
        "Snapshot not found",
      );
    });
  });

  describe("restore", () => {
    it("calls snapshot/restore with snapshot token from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await restore(["snap1"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/restore", {
        snapshot: "snap1",
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Snapshot not found"));

      await expect(restore(["nonexistent"], {}, client)).rejects.toThrow(
        "Snapshot not found",
      );
    });
  });

  describe("sticky", () => {
    it("calls snapshot/toggleSticky with sticky=1 when --on flag set", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await sticky(["snap1"], { on: "1" }, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/toggleSticky", {
        snapshot: "snap1",
        sticky: 1,
      });
    });

    it("calls snapshot/toggleSticky with sticky=0 when --off flag set", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await sticky(["snap1"], { off: "1" }, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/toggleSticky", {
        snapshot: "snap1",
        sticky: 0,
      });
    });

    it("throws when neither --on nor --off flag provided", async () => {
      const { client } = mockClient();

      await expect(sticky(["snap1"], {}, client)).rejects.toThrow("--on");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(sticky(["snap1"], { on: "1" }, client)).rejects.toThrow(
        "API failure",
      );
    });
  });

  describe("exportSnapshot", () => {
    it("calls snapshot/export with snapshot token from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await exportSnapshot(["snap1"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/export", {
        snapshot: "snap1",
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Export failed"));

      await expect(exportSnapshot(["snap1"], {}, client)).rejects.toThrow(
        "Export failed",
      );
    });
  });

  describe("importSnapshot", () => {
    it("calls snapshot/import with sourceVeid and sourceToken from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await importSnapshot(["67890", "abc123"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("snapshot/import", {
        sourceVeid: "67890",
        sourceToken: "abc123",
      });
    });

    it("throws when only sourceVeid provided (missing token)", async () => {
      const { client } = mockClient();

      await expect(importSnapshot(["67890"], {}, client)).rejects.toThrow(
        /token/i,
      );
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Import failed"));

      await expect(
        importSnapshot(["67890", "abc123"], {}, client),
      ).rejects.toThrow("Import failed");
    });
  });
});
