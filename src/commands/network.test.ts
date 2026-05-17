import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./network.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("network command", () => {
  describe("ipv6-add", () => {
    it("calls ipv6/add with no extra params", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await run("ipv6-add", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("ipv6/add");
      expect(result).toEqual({ error: 0 });
    });
  });

  describe("ipv6-delete", () => {
    it("calls ipv6/delete with ip flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("ipv6-delete", { ip: "2001:db8::1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("ipv6/delete", {
        ip: "2001:db8::1",
      });
    });
  });

  describe("private-list", () => {
    it("calls privateIp/getAvailableIps", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        availableIps: ["10.0.0.1"],
      });

      const result = await run("private-list", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith(
        "privateIp/getAvailableIps",
      );
      expect(result).toMatchObject({ availableIps: ["10.0.0.1"] });
    });
  });

  describe("private-assign", () => {
    it("calls privateIp/assign with ip flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("private-assign", { ip: "10.0.0.1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("privateIp/assign", {
        ip: "10.0.0.1",
      });
    });
  });

  describe("private-delete", () => {
    it("calls privateIp/delete with ip flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("private-delete", { ip: "10.0.0.1" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("privateIp/delete", {
        ip: "10.0.0.1",
      });
    });
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Invalid IP"));

    await expect(run("ipv6-add", {}, client)).rejects.toThrow("Invalid IP");
  });
});
