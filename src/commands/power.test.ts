import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./power.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("power command", () => {
  it("start calls client.call('start')", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({ error: 0 });

    const result = await run("start", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("start");
    expect(result).toEqual({ error: 0 });
  });

  it("stop calls client.call('stop')", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({ error: 0 });

    const result = await run("stop", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("stop");
    expect(result).toEqual({ error: 0 });
  });

  it("restart calls client.call('restart')", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({ error: 0 });

    const result = await run("restart", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("restart");
    expect(result).toEqual({ error: 0 });
  });

  it("kill calls client.call('kill')", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({ error: 0 });

    const result = await run("kill", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("kill");
    expect(result).toEqual({ error: 0 });
  });

  it("returns the raw API response", async () => {
    const { client, call } = mockClient();
    const apiResponse = { error: 0, message: "Virtual server is running." };
    call.mockResolvedValueOnce(apiResponse);

    const result = await run("start", {}, client);

    expect(result).toBe(apiResponse);
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    const apiError = new Error("API failure");
    call.mockRejectedValueOnce(apiError);

    await expect(run("restart", {}, client)).rejects.toThrow("API failure");
  });
});
