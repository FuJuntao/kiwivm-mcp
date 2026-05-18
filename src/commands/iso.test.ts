import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { mount, unmount } from "./iso.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("iso handlers", () => {
  describe("mount", () => {
    it("calls iso/mount with iso name from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await mount(["ubuntu.iso"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("iso/mount", {
        iso: "ubuntu.iso",
      });
      expect(result).toEqual({ error: 0 });
    });

    it("throws when no ISO name provided", async () => {
      const { client } = mockClient();

      await expect(mount([], {}, client)).rejects.toThrow(/name/);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Mount failed"));

      await expect(mount(["ubuntu.iso"], {}, client)).rejects.toThrow(
        "Mount failed",
      );
    });
  });

  describe("unmount", () => {
    it("calls iso/unmount with no params", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await unmount([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("iso/unmount");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Unmount failed"));

      await expect(unmount([], {}, client)).rejects.toThrow("Unmount failed");
    });
  });
});
