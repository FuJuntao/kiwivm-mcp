import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { kill, restart, start, stop } from "./power.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("power handlers", () => {
  describe("start", () => {
    it("calls client.call('start')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await start([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("start");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(start([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("stop", () => {
    it("calls client.call('stop')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await stop([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("stop");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(stop([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("restart", () => {
    it("calls client.call('restart')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await restart([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("restart");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(restart([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("kill", () => {
    it("calls client.call('kill')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await kill([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("kill");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(kill([], {}, client)).rejects.toThrow("API failure");
    });
  });
});
