import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { run } from "./info.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("info command", () => {
  it("calls getServiceInfo for basic info (empty action)", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({
      error: 0,
      hostname: "my-vps",
    });

    const result = await run("", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("getServiceInfo");
    expect(result).toMatchObject({ hostname: "my-vps" });
  });

  it("calls getServiceInfo when action is omitted", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({ error: 0 });

    await run("", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("getServiceInfo");
  });

  it("calls getLiveServiceInfo for live action", async () => {
    const { client, call } = mockClient();
    call.mockResolvedValueOnce({
      error: 0,
      ve_status: "Running",
    });

    const result = await run("live", {}, client);

    expect(client.call).toHaveBeenCalledExactlyOnceWith("getLiveServiceInfo");
    expect(result).toMatchObject({ ve_status: "Running" });
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

    const result = await run("", {}, client);

    expect(result).toEqual(apiResponse);
  });

  it("propagates errors from the client", async () => {
    const { client, call } = mockClient();
    call.mockRejectedValueOnce(new Error("Network error"));

    await expect(run("live", {}, client)).rejects.toThrow("Network error");
  });
});
