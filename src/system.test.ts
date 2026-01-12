import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("System", () => {
  let client: unsent;

  beforeEach(() => {
    vi.resetAllMocks();
    globalFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
      statusText: "OK",
    });
    client = new unsent("test_key");
  });

  describe("health", () => {
    it("should check API health", async () => {
      const mockData = {
        status: "ok",
        uptime: 123456,
        timestamp: 1234567890,
      };

      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.system.health();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/health",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error when checking health", async () => {
      const mockError = { code: "SERVICE_UNAVAILABLE", message: "Service down" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.system.health();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("version", () => {
    it("should get API version", async () => {
      const mockData = {
        version: "1.0.0",
        nodeVersion: "v18.0.0",
        platform: "linux",
        arch: "x64",
        timestamp: "2024-01-01T00:00:00Z",
        versions: { node: "18.0.0" },
        memory: {
          rss: 100000,
          heapTotal: 50000,
          heapUsed: 25000,
          external: 1000,
        },
      };

      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.system.version();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/version",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error when getting version", async () => {
      const mockError = { code: "INTERNAL_ERROR", message: "Error retrieving version" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.system.version();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });
});
