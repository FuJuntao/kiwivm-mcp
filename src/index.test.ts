import { afterEach, describe, expect, it, vi } from "vitest";

// All mock variables must be created inside vi.hoisted() so they are
// initialized before the hoisted vi.mock() factories reference them.
const {
  mockPowerRun,
  mockInfoRun,
  mockSnapshotRun,
  mockBackupRun,
  mockSystemRun,
  mockNetworkRun,
  mockMonitoringRun,
  mockAdminRun,
  mockClientConstructor,
} = vi.hoisted(() => ({
  mockPowerRun: vi.fn(),
  mockInfoRun: vi.fn(),
  mockSnapshotRun: vi.fn(),
  mockBackupRun: vi.fn(),
  mockSystemRun: vi.fn(),
  mockNetworkRun: vi.fn(),
  mockMonitoringRun: vi.fn(),
  mockAdminRun: vi.fn(),
  mockClientConstructor: vi.fn(),
}));

vi.mock("./commands/power.ts", () => ({ run: mockPowerRun }));
vi.mock("./commands/info.ts", () => ({ run: mockInfoRun }));
vi.mock("./commands/snapshot.ts", () => ({ run: mockSnapshotRun }));
vi.mock("./commands/backup.ts", () => ({ run: mockBackupRun }));
vi.mock("./commands/system.ts", () => ({ run: mockSystemRun }));
vi.mock("./commands/network.ts", () => ({ run: mockNetworkRun }));
vi.mock("./commands/monitoring.ts", () => ({ run: mockMonitoringRun }));
vi.mock("./commands/admin.ts", () => ({ run: mockAdminRun }));
vi.mock("./client.ts", () => ({
  KiwiVMClient: mockClientConstructor,
}));

import { main } from "./index.ts";

function setArgv(...args: string[]) {
  // argv[0] is node, argv[1] is script path, the rest are user args
  vi.stubGlobal("process", {
    ...process,
    argv: ["/usr/bin/node", "/usr/bin/kiwivm-cli", ...args],
    exit: vi.fn() as unknown as typeof process.exit,
  });
}

describe("CLI dispatcher", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ---- Dispatch to correct command handler ----

  it("dispatches 'power start' to power.run", async () => {
    setArgv("power", "start");
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerRun).toHaveBeenCalledExactlyOnceWith(
      "start",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'info live' to info.run", async () => {
    setArgv("info", "live");
    mockInfoRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockInfoRun).toHaveBeenCalledExactlyOnceWith(
      "live",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'snapshot list' to snapshot.run", async () => {
    setArgv("snapshot", "list");
    mockSnapshotRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotRun).toHaveBeenCalledExactlyOnceWith(
      "list",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'backup list' to backup.run", async () => {
    setArgv("backup", "list");
    mockBackupRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockBackupRun).toHaveBeenCalledExactlyOnceWith(
      "list",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'system password' to system.run", async () => {
    setArgv("system", "password");
    mockSystemRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemRun).toHaveBeenCalledExactlyOnceWith(
      "password",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'network ipv6-add' to network.run", async () => {
    setArgv("network", "ipv6-add");
    mockNetworkRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockNetworkRun).toHaveBeenCalledExactlyOnceWith(
      "ipv6-add",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'monitoring audit' to monitoring.run", async () => {
    setArgv("monitoring", "audit");
    mockMonitoringRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockMonitoringRun).toHaveBeenCalledExactlyOnceWith(
      "audit",
      {},
      expect.anything(),
    );
  });

  it("dispatches 'admin suspensions' to admin.run", async () => {
    setArgv("admin", "suspensions");
    mockAdminRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminRun).toHaveBeenCalledExactlyOnceWith(
      "suspensions",
      {},
      expect.anything(),
    );
  });

  // ---- Flag parsing ----

  it("parses --key=value flags and passes them to the handler", async () => {
    setArgv("system", "hostname", "--newHostname=my-vps.example.com");
    mockSystemRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemRun).toHaveBeenCalledExactlyOnceWith(
      "hostname",
      { newHostname: "my-vps.example.com" },
      expect.anything(),
    );
  });

  it("parses multiple --key=value flags", async () => {
    setArgv("snapshot", "sticky", "--snapshot=snap1", "--sticky=1");
    mockSnapshotRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotRun).toHaveBeenCalledExactlyOnceWith(
      "sticky",
      { snapshot: "snap1", sticky: "1" },
      expect.anything(),
    );
  });

  it("ignores unknown positional args beyond category and action", async () => {
    setArgv("power", "start", "extra-arg");
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerRun).toHaveBeenCalledExactlyOnceWith(
      "start",
      {},
      expect.anything(),
    );
  });

  it("passes an empty flags object when no flags are provided", async () => {
    setArgv("monitoring", "rate-limit");
    mockMonitoringRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockMonitoringRun).toHaveBeenCalledExactlyOnceWith(
      "rate-limit",
      {},
      expect.anything(),
    );
  });

  // ---- Auth: --veid and --api-key flags ----

  it("creates KiwiVMClient with --veid and --api-key flag values", async () => {
    setArgv("power", "start", "--veid=12345", "--api-key=secret");
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "12345",
      apiKey: "secret",
    });
  });

  it("strips --veid and --api-key from flags passed to handler", async () => {
    setArgv(
      "power",
      "start",
      "--veid=12345",
      "--api-key=secret",
      "--other=value",
    );
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerRun).toHaveBeenCalledExactlyOnceWith(
      "start",
      { other: "value" },
      expect.anything(),
    );
  });

  // ---- Auth: environment variable fallback ----

  it("creates KiwiVMClient from KIWIVM_VEID and KIWIVM_API_KEY env vars", async () => {
    setArgv("power", "start");
    vi.stubEnv("KIWIVM_VEID", "env-veid");
    vi.stubEnv("KIWIVM_API_KEY", "env-key");
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "env-veid",
      apiKey: "env-key",
    });
  });

  it("prefers --veid and --api-key flags over env vars", async () => {
    setArgv("power", "start", "--veid=flag-veid", "--api-key=flag-key");
    vi.stubEnv("KIWIVM_VEID", "env-veid");
    vi.stubEnv("KIWIVM_API_KEY", "env-key");
    mockPowerRun.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "flag-veid",
      apiKey: "flag-key",
    });
  });

  // ---- Output: JSON to stdout ----

  it("writes JSON result to stdout", async () => {
    setArgv("power", "start");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockPowerRun.mockResolvedValueOnce({ error: 0, message: "Started" });

    await main();

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({ error: 0, message: "Started" }),
    );
    consoleSpy.mockRestore();
  });

  it("writes pretty-printed JSON to stdout", async () => {
    setArgv("power", "start");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = {
      error: 0,
      data: { key: "value", nested: { deep: true } },
    };
    mockPowerRun.mockResolvedValueOnce(result);

    await main();

    const logged = consoleSpy.mock.calls[0]?.[0] as string;
    expect(() => JSON.parse(logged)).not.toThrow();
    expect(JSON.parse(logged)).toEqual(result);
    consoleSpy.mockRestore();
  });

  // ---- Error handling: stderr + exit code 1 ----

  it("writes errors to stderr and exits with code 1", async () => {
    setArgv("power", "start");
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPowerRun.mockRejectedValueOnce(new Error("API failure"));

    await main();

    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("API failure"),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  it("exits with code 1 on unknown category", async () => {
    setArgv("unknown", "action");
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  it("exits with code 1 when neither flags nor env vars provide credentials", async () => {
    setArgv("power", "start");
    vi.stubEnv("KIWIVM_VEID", undefined);
    vi.stubEnv("KIWIVM_API_KEY", undefined);
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  // ---- Help command ----

  it("prints help text when category is 'help'", async () => {
    setArgv("help");
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("kiwivm-cli"),
    );
    consoleLogSpy.mockRestore();
  });

  it("prints help and exits successfully for 'help' command", async () => {
    setArgv("help");
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main();

    // Help should not call process.exit with an error code
    expect(process.exit).not.toHaveBeenCalledWith(1);
    consoleLogSpy.mockRestore();
  });
});
