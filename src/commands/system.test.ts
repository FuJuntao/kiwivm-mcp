import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./system.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("system command", () => {
  describe("hostname", () => {
    it("calls setHostname with new-hostname flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("hostname", { newHostname: "my-vps.example.com" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("setHostname", {
        newHostname: "my-vps.example.com",
      });
    });
  });

  describe("rdns", () => {
    it("calls setPTR with ip and ptr flags", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("rdns", { ip: "1.2.3.4", ptr: "my-vps.example.com" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("setPTR", {
        ip: "1.2.3.4",
        ptr: "my-vps.example.com",
      });
    });
  });

  describe("password", () => {
    it("calls resetRootPassword with no params", async () => {
      const { client, call } = mockClient();
      const pwResponse = { error: 0, message: "Password reset successfully" };
      call.mockResolvedValueOnce(pwResponse);

      const result = await run("password", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("resetRootPassword");
      expect(result).toEqual(pwResponse);
    });
  });

  describe("sshkey", () => {
    it("calls getSshKeys when --ssh-keys flag is not provided", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        sshKeys: ["ssh-rsa AAA..."],
      });

      const result = await run("sshkey", {}, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("getSshKeys");
      expect(result).toMatchObject({ sshKeys: ["ssh-rsa AAA..."] });
    });

    it("calls updateSshKeys when --ssh-keys flag is provided", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("sshkey", { sshKeys: "ssh-rsa AAA..." }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("updateSshKeys", {
        sshKeys: "ssh-rsa AAA...",
      });
    });
  });

  describe("reinstall", () => {
    it("calls reinstallOS with os flag", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await run("reinstall", { os: "ubuntu-22.04" }, client);

      expect(client.call).toHaveBeenCalledExactlyOnceWith("reinstallOS", {
        os: "ubuntu-22.04",
      });
    });
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Invalid hostname"));

    await expect(run("hostname", { newHostname: "" }, client)).rejects.toThrow(
      "Invalid hostname",
    );
  });
});
