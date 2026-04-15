import { afterEach, describe, expect, it, vi } from "vitest";
import { KiwiVMClient } from "./client.js";
import { KiwiVMError } from "./types.js";

global.fetch = vi.fn();

const client = new KiwiVMClient({
  veid: "12345",
  apiKey: "test-key",
});

describe("KiwiVMClient", () => {
  afterEach(() => vi.resetAllMocks());

  it("sends POST with form-encoded body and returns success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ error: 0 }),
    } as Response);

    const result = await client.call("restart");
    expect(result.error).toBe(0);

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call?.[0]).toBe("https://api.64clouds.com/v1/restart");
    expect((call?.[1] as RequestInit).method).toBe("POST");
    expect((call?.[1] as RequestInit).headers).toEqual({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = (call?.[1] as RequestInit).body as URLSearchParams;
    expect(body.get("veid")).toBe("12345");
    expect(body.get("api_key")).toBe("test-key");
  });

  it("passes additional params to request body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ error: 0 }),
    } as Response);

    await client.call("snapshot/create", { description: "test" });

    const body = (vi.mocked(fetch).mock.calls[0]?.[1] as RequestInit)
      .body as URLSearchParams;
    expect(body.get("description")).toBe("test");
  });

  it("throws KiwiVMError on API error", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: 1, message: "Invalid VEID" }),
    } as Response);

    await expect(client.call("restart")).rejects.toThrow(KiwiVMError);
    await expect(client.call("restart")).rejects.toThrow("Invalid VEID");
  });

  it("throws on HTTP error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(client.call("restart")).rejects.toThrow("HTTP 500");
  });
});
