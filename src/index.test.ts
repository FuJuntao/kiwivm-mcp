import { afterEach, describe, expect, it, vi } from "vitest";

// All mock variables must be created inside vi.hoisted() so they are
// initialized before the hoisted vi.mock() factories reference them.
const {
  mockPowerStart,
  mockPowerStop,
  mockPowerRestart,
  mockPowerKill,
  mockInfoInfo,
  mockInfoStatus,
  mockSnapshotList,
  mockSnapshotCreate,
  mockSnapshotDelete,
  mockSnapshotRestore,
  mockSnapshotSticky,
  mockSnapshotExport,
  mockSnapshotImport,
  mockBackupList,
  mockBackupCopy,
  mockSystemHostname,
  mockSystemPassword,
  mockSystemOsList,
  mockSystemOsReinstall,
  mockSystemSshKeyShow,
  mockSystemSshKeySet,
  mockNetworkRdnsSet,
  mockNetworkIpv6Add,
  mockNetworkIpv6Delete,
  mockNetworkPrivateIpList,
  mockNetworkPrivateIpAssign,
  mockNetworkPrivateIpDelete,
  mockIsoMount,
  mockIsoUnmount,
  mockShellExec,
  mockShellScript,
  mockMigrateLocations,
  mockMigrateStart,
  mockMigrateClone,
  mockStatsUsage,
  mockStatsAudit,
  mockStatsRateLimit,
  mockAdminSuspensions,
  mockAdminUnsuspend,
  mockAdminViolationsList,
  mockAdminViolationsResolve,
  mockAdminNotificationsGet,
  mockAdminNotificationsSet,
  mockHelpRun,
  mockClientConstructor,
} = vi.hoisted(() => ({
  mockPowerStart: vi.fn(),
  mockPowerStop: vi.fn(),
  mockPowerRestart: vi.fn(),
  mockPowerKill: vi.fn(),
  mockInfoInfo: vi.fn(),
  mockInfoStatus: vi.fn(),
  mockSnapshotList: vi.fn(),
  mockSnapshotCreate: vi.fn(),
  mockSnapshotDelete: vi.fn(),
  mockSnapshotRestore: vi.fn(),
  mockSnapshotSticky: vi.fn(),
  mockSnapshotExport: vi.fn(),
  mockSnapshotImport: vi.fn(),
  mockBackupList: vi.fn(),
  mockBackupCopy: vi.fn(),
  mockSystemHostname: vi.fn(),
  mockSystemPassword: vi.fn(),
  mockSystemOsList: vi.fn(),
  mockSystemOsReinstall: vi.fn(),
  mockSystemSshKeyShow: vi.fn(),
  mockSystemSshKeySet: vi.fn(),
  mockNetworkRdnsSet: vi.fn(),
  mockNetworkIpv6Add: vi.fn(),
  mockNetworkIpv6Delete: vi.fn(),
  mockNetworkPrivateIpList: vi.fn(),
  mockNetworkPrivateIpAssign: vi.fn(),
  mockNetworkPrivateIpDelete: vi.fn(),
  mockIsoMount: vi.fn(),
  mockIsoUnmount: vi.fn(),
  mockShellExec: vi.fn(),
  mockShellScript: vi.fn(),
  mockMigrateLocations: vi.fn(),
  mockMigrateStart: vi.fn(),
  mockMigrateClone: vi.fn(),
  mockStatsUsage: vi.fn(),
  mockStatsAudit: vi.fn(),
  mockStatsRateLimit: vi.fn(),
  mockAdminSuspensions: vi.fn(),
  mockAdminUnsuspend: vi.fn(),
  mockAdminViolationsList: vi.fn(),
  mockAdminViolationsResolve: vi.fn(),
  mockAdminNotificationsGet: vi.fn(),
  mockAdminNotificationsSet: vi.fn(),
  mockHelpRun: vi.fn(),
  mockClientConstructor: vi.fn(),
}));

vi.mock("./commands/power.ts", () => ({
  start: mockPowerStart,
  stop: mockPowerStop,
  restart: mockPowerRestart,
  kill: mockPowerKill,
}));
vi.mock("./commands/info.ts", () => ({
  info: mockInfoInfo,
  status: mockInfoStatus,
}));
vi.mock("./commands/snapshot.ts", () => ({
  list: mockSnapshotList,
  create: mockSnapshotCreate,
  deleteSnapshot: mockSnapshotDelete,
  restore: mockSnapshotRestore,
  sticky: mockSnapshotSticky,
  exportSnapshot: mockSnapshotExport,
  importSnapshot: mockSnapshotImport,
}));
vi.mock("./commands/backup.ts", () => ({
  list: mockBackupList,
  copy: mockBackupCopy,
}));
vi.mock("./commands/system.ts", () => ({
  hostname: mockSystemHostname,
  password: mockSystemPassword,
  osList: mockSystemOsList,
  osReinstall: mockSystemOsReinstall,
  sshKeyShow: mockSystemSshKeyShow,
  sshKeySet: mockSystemSshKeySet,
}));
vi.mock("./commands/network.ts", () => ({
  rdnsSet: mockNetworkRdnsSet,
  ipv6Add: mockNetworkIpv6Add,
  ipv6Delete: mockNetworkIpv6Delete,
  privateIpList: mockNetworkPrivateIpList,
  privateIpAssign: mockNetworkPrivateIpAssign,
  privateIpDelete: mockNetworkPrivateIpDelete,
}));
vi.mock("./commands/iso.ts", () => ({
  mount: mockIsoMount,
  unmount: mockIsoUnmount,
}));
vi.mock("./commands/shell.ts", () => ({
  exec: mockShellExec,
  script: mockShellScript,
}));
vi.mock("./commands/migrate.ts", () => ({
  locations: mockMigrateLocations,
  migrateStart: mockMigrateStart,
  clone: mockMigrateClone,
}));
vi.mock("./commands/stats.ts", () => ({
  usage: mockStatsUsage,
  audit: mockStatsAudit,
  rateLimit: mockStatsRateLimit,
}));
vi.mock("./commands/admin.ts", () => ({
  suspensions: mockAdminSuspensions,
  unsuspend: mockAdminUnsuspend,
  violationsList: mockAdminViolationsList,
  violationsResolve: mockAdminViolationsResolve,
  notificationsGet: mockAdminNotificationsGet,
  notificationsSet: mockAdminNotificationsSet,
}));
vi.mock("./commands/help.ts", () => ({
  run: mockHelpRun,
}));
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

  // ---- Flat command dispatch ----

  it("dispatches 'start' to power.start", async () => {
    setArgv("start");
    mockPowerStart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerStart).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'stop' to power.stop", async () => {
    setArgv("stop");
    mockPowerStop.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerStop).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'restart' to power.restart", async () => {
    setArgv("restart");
    mockPowerRestart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerRestart).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'kill' to power.kill", async () => {
    setArgv("kill");
    mockPowerKill.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerKill).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'info' to info.info", async () => {
    setArgv("info");
    mockInfoInfo.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockInfoInfo).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'status' to info.status", async () => {
    setArgv("status");
    mockInfoStatus.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockInfoStatus).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'hostname' with args to system.hostname", async () => {
    setArgv("hostname", "my-vps");
    mockSystemHostname.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemHostname).toHaveBeenCalledExactlyOnceWith(
      ["my-vps"],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'password' to system.password", async () => {
    setArgv("password");
    mockSystemPassword.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemPassword).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'suspensions' to admin.suspensions", async () => {
    setArgv("suspensions");
    mockAdminSuspensions.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminSuspensions).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'unsuspend' with args to admin.unsuspend", async () => {
    setArgv("unsuspend", "42");
    mockAdminUnsuspend.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminUnsuspend).toHaveBeenCalledExactlyOnceWith(
      ["42"],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'clone' with args to migrate.clone", async () => {
    setArgv("clone", "1.2.3.4", "pass");
    mockMigrateClone.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockMigrateClone).toHaveBeenCalledExactlyOnceWith(
      ["1.2.3.4", "pass"],
      {},
      expect.anything(),
    );
  });

  // ---- Subcommand dispatch ----

  it("dispatches 'snapshot list' to snapshot.list", async () => {
    setArgv("snapshot", "list");
    mockSnapshotList.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotList).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'snapshot delete' with args to snapshot.deleteSnapshot", async () => {
    setArgv("snapshot", "delete", "vsb123");
    mockSnapshotDelete.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotDelete).toHaveBeenCalledExactlyOnceWith(
      ["vsb123"],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'snapshot create' with flags to snapshot.create", async () => {
    setArgv("snapshot", "create", "--desc=test");
    mockSnapshotCreate.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotCreate).toHaveBeenCalledExactlyOnceWith(
      [],
      { desc: "test" },
      expect.anything(),
    );
  });

  it("dispatches 'snapshot sticky' with --on flag", async () => {
    setArgv("snapshot", "sticky", "snap1", "--on");
    mockSnapshotSticky.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotSticky).toHaveBeenCalledExactlyOnceWith(
      ["snap1"],
      { on: "1" },
      expect.anything(),
    );
  });

  it("dispatches 'backup list' to backup.list", async () => {
    setArgv("backup", "list");
    mockBackupList.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockBackupList).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'backup copy' with args to backup.copy", async () => {
    setArgv("backup", "copy", "tok123");
    mockBackupCopy.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockBackupCopy).toHaveBeenCalledExactlyOnceWith(
      ["tok123"],
      {},
      expect.anything(),
    );
  });

  // ---- Default subcommand (no action specified) ----

  it("dispatches 'ssh-key' (no action) as default to system.sshKeyShow", async () => {
    setArgv("ssh-key");
    mockSystemSshKeyShow.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemSshKeyShow).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'ssh-key set' with args to system.sshKeySet", async () => {
    setArgv("ssh-key", "set", "ssh-ed25519 AAAAC3...");
    mockSystemSshKeySet.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSystemSshKeySet).toHaveBeenCalledExactlyOnceWith(
      ["ssh-ed25519 AAAAC3..."],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'violations' (no action) as default to admin.violationsList", async () => {
    setArgv("violations");
    mockAdminViolationsList.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminViolationsList).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'violations resolve' with args to admin.violationsResolve", async () => {
    setArgv("violations", "resolve", "14");
    mockAdminViolationsResolve.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminViolationsResolve).toHaveBeenCalledExactlyOnceWith(
      ["14"],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'notifications' (no action) as default to admin.notificationsGet", async () => {
    setArgv("notifications");
    mockAdminNotificationsGet.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminNotificationsGet).toHaveBeenCalledExactlyOnceWith(
      [],
      {},
      expect.anything(),
    );
  });

  it("dispatches 'notifications set' to admin.notificationsSet", async () => {
    setArgv("notifications", "set", '{"1":1,"2":0}');
    mockAdminNotificationsSet.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockAdminNotificationsSet).toHaveBeenCalledExactlyOnceWith(
      ['{"1":1,"2":0}'],
      {},
      expect.anything(),
    );
  });

  // ---- Unknown command / subcommand ----

  it("exits with error code 1 on unknown command", async () => {
    setArgv("unknown-command");
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  it("exits with error code 1 on unknown subcommand", async () => {
    setArgv("snapshot", "unknown-action");
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  // ---- Auth: --veid and --api-key flags ----

  it("creates KiwiVMClient with --veid and --api-key flag values", async () => {
    setArgv("start", "--veid=12345", "--api-key=secret");
    mockPowerStart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "12345",
      apiKey: "secret",
    });
  });

  it("creates KiwiVMClient from KIWIVM_VEID and KIWIVM_API_KEY env vars", async () => {
    setArgv("start");
    vi.stubEnv("KIWIVM_VEID", "env-veid");
    vi.stubEnv("KIWIVM_API_KEY", "env-key");
    mockPowerStart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "env-veid",
      apiKey: "env-key",
    });
  });

  it("prefers --veid and --api-key flags over env vars", async () => {
    setArgv("start", "--veid=flag-veid", "--api-key=flag-key");
    vi.stubEnv("KIWIVM_VEID", "env-veid");
    vi.stubEnv("KIWIVM_API_KEY", "env-key");
    mockPowerStart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockClientConstructor).toHaveBeenCalledExactlyOnceWith({
      veid: "flag-veid",
      apiKey: "flag-key",
    });
  });

  // ---- Flag stripping ----

  it("strips --veid and --api-key from flags passed to handler", async () => {
    setArgv("start", "--veid=12345", "--api-key=secret", "--other=value");
    mockPowerStart.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockPowerStart).toHaveBeenCalledExactlyOnceWith(
      [],
      { other: "value" },
      expect.anything(),
    );
  });

  // ---- Standalone boolean flag ----

  it("treats standalone --on flag as flags.on = '1'", async () => {
    setArgv("snapshot", "sticky", "snap1", "--on");
    mockSnapshotSticky.mockResolvedValueOnce({ error: 0 });

    await main();

    expect(mockSnapshotSticky).toHaveBeenCalledExactlyOnceWith(
      ["snap1"],
      { on: "1" },
      expect.anything(),
    );
  });

  // ---- JSON output ----

  it("writes JSON result to stdout", async () => {
    setArgv("start");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockPowerStart.mockResolvedValueOnce({ error: 0, message: "Started" });

    await main();

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({ error: 0, message: "Started" }),
    );
    consoleSpy.mockRestore();
  });

  // ---- Error handling: stderr + exit code 1 ----

  it("writes errors to stderr and exits with code 1", async () => {
    setArgv("start");
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPowerStart.mockRejectedValueOnce(new Error("API failure"));

    await main();

    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("API failure"),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  it("exits with code 1 when neither flags nor env vars provide credentials", async () => {
    setArgv("start");
    vi.stubEnv("KIWIVM_VEID", undefined);
    vi.stubEnv("KIWIVM_API_KEY", undefined);
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
    stderrSpy.mockRestore();
  });

  // ---- Help command ----

  it("prints help text when command is 'help'", async () => {
    setArgv("help");
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockHelpRun.mockReturnValue("Usage: kiwivm-cli ...");

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("kiwivm-cli"),
    );
    expect(process.exit).not.toHaveBeenCalledWith(1);
    consoleLogSpy.mockRestore();
  });

  it("prints help text when no command provided (empty args)", async () => {
    setArgv();
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockHelpRun.mockReturnValue("Usage: kiwivm-cli ...");

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("kiwivm-cli"),
    );
    expect(process.exit).not.toHaveBeenCalledWith(1);
    consoleLogSpy.mockRestore();
  });
});
