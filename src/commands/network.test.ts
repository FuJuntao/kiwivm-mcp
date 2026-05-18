import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import {
  ipv6Add,
  ipv6Delete,
  privateIpAssign,
  privateIpDelete,
  privateIpList,
  rdnsSet,
} from "./network.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("network handlers", () => {
  describe("rdnsSet", () => {
    it("calls setPTR with ip and ptr from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await rdnsSet(["1.2.3.4", "my.domain.com"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("setPTR", {
        ip: "1.2.3.4",
        ptr: "my.domain.com",
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Invalid PTR"));

      await expect(
        rdnsSet(["1.2.3.4", "my.domain.com"], {}, client),
      ).rejects.toThrow("Invalid PTR");
    });
  });

  describe("ipv6Add", () => {
    it("calls ipv6/add with no extra params", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await ipv6Add([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("ipv6/add");
      expect(result).toEqual({ error: 0 });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("IPv6 not available"));

      await expect(ipv6Add([], {}, client)).rejects.toThrow(
        "IPv6 not available",
      );
    });
  });

  describe("ipv6Delete", () => {
    it("calls ipv6/delete with ip from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await ipv6Delete(["2001:db8::1"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("ipv6/delete", {
        ip: "2001:db8::1",
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Invalid IP"));

      await expect(ipv6Delete(["2001:db8::1"], {}, client)).rejects.toThrow(
        "Invalid IP",
      );
    });
  });

  describe("privateIpList", () => {
    it("calls privateIp/getAvailableIps", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        availableIps: ["10.0.0.1", "10.0.0.2"],
      });

      const result = await privateIpList([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("privateIp/getAvailableIps");
      expect(result).toMatchObject({ availableIps: ["10.0.0.1", "10.0.0.2"] });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Private IP not available"));

      await expect(privateIpList([], {}, client)).rejects.toThrow(
        "Private IP not available",
      );
    });
  });

  describe("privateIpAssign", () => {
    it("calls privateIp/assign with ip from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await privateIpAssign(["10.0.0.5"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("privateIp/assign", {
        ip: "10.0.0.5",
      });
    });

    it("calls privateIp/assign with undefined ip when no arg", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await privateIpAssign([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("privateIp/assign", {
        ip: undefined,
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Assignment failed"));

      await expect(privateIpAssign(["10.0.0.5"], {}, client)).rejects.toThrow(
        "Assignment failed",
      );
    });
  });

  describe("privateIpDelete", () => {
    it("calls privateIp/delete with ip from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await privateIpDelete(["10.0.0.5"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("privateIp/delete", {
        ip: "10.0.0.5",
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Delete failed"));

      await expect(privateIpDelete(["10.0.0.5"], {}, client)).rejects.toThrow(
        "Delete failed",
      );
    });
  });
});
