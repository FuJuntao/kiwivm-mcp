import { describe, expect, it, vi } from "vitest";
import type { KiwiVMClient } from "../client.ts";
import { clone, locations, migrateStart } from "./migrate.ts";

function mockClient() {
  const call = vi.fn();
  return { client: { call } as unknown as KiwiVMClient, call };
}

describe("migrate handlers", () => {
  describe("locations", () => {
    it("calls migrate/getLocations", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({
        error: 0,
        locations: ["lasvegas", "newyork", "luxembourg"],
      });

      const result = await locations([], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("migrate/getLocations");
      expect(result).toMatchObject({
        locations: ["lasvegas", "newyork", "luxembourg"],
      });
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("API failure"));

      await expect(locations([], {}, client)).rejects.toThrow("API failure");
    });
  });

  describe("migrateStart", () => {
    it("calls migrate/start with location from args", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await migrateStart(["lasvegas"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("migrate/start", {
        location: "lasvegas",
      });
    });

    it("throws when no location provided", async () => {
      const { client } = mockClient();

      await expect(migrateStart([], {}, client)).rejects.toThrow("location");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Migration not available"));

      await expect(migrateStart(["lasvegas"], {}, client)).rejects.toThrow(
        "Migration not available",
      );
    });
  });

  describe("clone", () => {
    it("calls cloneFromExternalServer with IP, default port, and password", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await clone(["1.2.3.4", "mypassword"], {}, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("cloneFromExternalServer", {
        externalServerIP: "1.2.3.4",
        externalServerSSHport: "22",
        externalServerRootPassword: "mypassword",
      });
    });

    it("calls cloneFromExternalServer with custom port from flags", async () => {
      const { client, call } = mockClient();
      call.mockResolvedValueOnce({ error: 0 });

      await clone(["1.2.3.4", "mypassword"], { port: "2222" }, client);

      expect(call).toHaveBeenCalledExactlyOnceWith("cloneFromExternalServer", {
        externalServerIP: "1.2.3.4",
        externalServerSSHport: "2222",
        externalServerRootPassword: "mypassword",
      });
    });

    it("throws when password not provided", async () => {
      const { client } = mockClient();

      await expect(clone(["1.2.3.4"], {}, client)).rejects.toThrow("password");
    });

    it("propagates errors from the client", async () => {
      const { client, call } = mockClient();
      call.mockRejectedValueOnce(new Error("Clone failed"));

      await expect(
        clone(["1.2.3.4", "mypassword"], {}, client),
      ).rejects.toThrow("Clone failed");
    });
  });
});
