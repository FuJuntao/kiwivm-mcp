import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import {
  hostname,
  osList,
  osReinstall,
  password,
  sshKeySet,
  sshKeyShow,
} from "./system.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("system handlers", () => {
  describe("hostname", () => {
    it("calls setHostname with newHostname from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await hostname(["my-vps"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("setHostname", {
        newHostname: "my-vps",
      });
    });

    it("throws when no hostname provided", async () => {
      const { client } = mockClient();

      await expect(hostname([], {}, client)).rejects.toThrow("hostname");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Invalid hostname"));

      await expect(hostname(["my-vps"], {}, client)).rejects.toThrow(
        "Invalid hostname",
      );
    });
  });

  describe("password", () => {
    it("calls resetRootPassword with no params", async () => {
      const { client, call } = mockClient();
      const pwResponse = { error: 0, message: "Password reset successfully" };
      call.mockResolvedValueOnce(pwResponse);

      const result = await password([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("resetRootPassword");
      expect(result).toEqual(pwResponse);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(password([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("osList", () => {
    it("calls getAvailableOS", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        templates: ["ubuntu-22.04", "debian-12"],
      });

      const result = await osList([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getAvailableOS");
      expect(result).toMatchObject({
        templates: ["ubuntu-22.04", "debian-12"],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(osList([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("osReinstall", () => {
    it("calls reinstallOS with os from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await osReinstall(["ubuntu-22.04"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("reinstallOS", {
        os: "ubuntu-22.04",
      });
    });

    it("throws when no OS provided", async () => {
      const { client } = mockClient();

      await expect(osReinstall([], {}, client)).rejects.toThrow("os");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Invalid OS"));

      await expect(osReinstall(["ubuntu-22.04"], {}, client)).rejects.toThrow(
        "Invalid OS",
      );
    });
  });

  describe("sshKeyShow", () => {
    it("calls getSshKeys", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        sshKeys: ["ssh-rsa AAA..."],
      });

      const result = await sshKeyShow([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("getSshKeys");
      expect(result).toMatchObject({ sshKeys: ["ssh-rsa AAA..."] });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(sshKeyShow([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("sshKeySet", () => {
    it("calls updateSshKeys with sshKey from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await sshKeySet(["ssh-ed25519 AAAAC3..."], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("updateSshKeys", {
        ssh_keys: "ssh-ed25519 AAAAC3...",
      });
    });

    it("throws when no SSH key provided", async () => {
      const { client } = mockClient();

      await expect(sshKeySet([], {}, client)).rejects.toThrow(/keys/);
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(
        sshKeySet(["ssh-ed25519 AAAAC3..."], {}, client),
      ).rejects.toThrow("API failure");
    });
  });
});
