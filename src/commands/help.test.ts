import { describe, expect, it } from "vitest";
import { run } from "./help.ts";

describe("help command", () => {
  it("returns a string containing usage information", async () => {
    const result = await run();

    expect(typeof result).toBe("string");
  });

  it("mentions the CLI name", async () => {
    const result = await run();

    expect(result).toContain("kiwivm-cli");
  });

  it("lists available command categories", async () => {
    const result = await run();

    // Spot-check a few categories
    expect(result).toContain("power");
    expect(result).toContain("info");
    expect(result).toContain("snapshot");
    expect(result).toContain("backup");
    expect(result).toContain("system");
    expect(result).toContain("network");
    expect(result).toContain("monitoring");
    expect(result).toContain("admin");
  });

  it("mentions global flags --veid and --api-key", async () => {
    const result = await run();

    expect(result).toContain("--veid");
    expect(result).toContain("--api-key");
  });

  it("mentions environment variables", async () => {
    const result = await run();

    expect(result).toContain("KIWIVM_VEID");
    expect(result).toContain("KIWIVM_API_KEY");
  });

  it("returns a multi-line help text", async () => {
    const result = await run();

    expect(result).toContain("\n");
  });
});
