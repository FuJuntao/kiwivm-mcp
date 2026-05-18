import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { info, status } from "./info.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("info handlers", () => {
  describe("info", () => {
    it("calls client.call('getServiceInfo')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        hostname: "my-vps",
        plan_disk: 50,
        plan_ram: 1024,
      });

      const result = await info([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getServiceInfo");
      expect(result).toMatchObject({ hostname: "my-vps" });
    });

    it("returns the complete API response", async () => {
      const { client, call } = mockClient();
      const apiResponse = {
        error: 0,
        hostname: "my-vps",
        plan_disk: 50,
        plan_ram: 1024,
      };
      call.mockResolvedValueOnce(apiResponse);

      const result = await info([], {}, client);

      expect(result).toEqual(apiResponse);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Network error"));

      await expect(info([], {}, client)).rejects.toThrow("Network error");
    });
  });

  describe("status", () => {
    it("calls client.call('getLiveServiceInfo')", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        ve_status: "Running",
      });

      const result = await status([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getLiveServiceInfo");
      expect(result).toMatchObject({ ve_status: "Running" });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Network error"));

      await expect(status([], {}, client)).rejects.toThrow("Network error");
    });
  });
});
