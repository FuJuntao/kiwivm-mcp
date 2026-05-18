import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { exec, script } from "./shell.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("shell handlers", () => {
  describe("exec", () => {
    it("calls basicShell/exec with command from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await exec(["uptime"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("basicShell/exec", {
        command: "uptime",
      });
      expect(result).toEqual({ error: 0 });
    });

    it("throws when no command provided", async () => {
      const { client } = mockClient();

      await expect(exec([], {}, client)).rejects.toThrow("command");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Exec failed"));

      await expect(exec(["uptime"], {}, client)).rejects.toThrow("Exec failed");
    });
  });

  describe("script", () => {
    it("calls shellScript/exec with script from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      const result = await script(["apt update"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("shellScript/exec", {
        script: "apt update",
      });
      expect(result).toEqual({ error: 0 });
    });

    it("throws when no script provided", async () => {
      const { client } = mockClient();

      await expect(script([], {}, client)).rejects.toThrow("script");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Script failed"));

      await expect(script(["apt update"], {}, client)).rejects.toThrow(
        "Script failed",
      );
    });
  });
});
