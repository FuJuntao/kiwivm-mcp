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

  it("lists key command names in help text", async () => {
    const result = await run();

    // Flat commands
    expect(result).toContain("start");
    expect(result).toContain("stop");
    expect(result).toContain("info");
    expect(result).toContain("status");
    // Subcommand categories
    expect(result).toContain("snapshot");
    expect(result).toContain("backup");
    // System actions
    expect(result).toContain("os");
    expect(result).toContain("hostname");
    expect(result).toContain("password");
    expect(result).toContain("ssh-key");
    // Network
    expect(result).toContain("rdns");
    expect(result).toContain("ipv6");
    expect(result).toContain("private-ip");
    // New categories
    expect(result).toContain("iso");
    expect(result).toContain("shell");
    expect(result).toContain("migrate");
    expect(result).toContain("clone");
    // Stats
    expect(result).toContain("stats");
    // Admin
    expect(result).toContain("suspensions");
    expect(result).toContain("unsuspend");
    expect(result).toContain("violations");
    expect(result).toContain("notifications");
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
