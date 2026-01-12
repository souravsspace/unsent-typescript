import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Stats", () => {
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

  it("should get stats without query parameters", async () => {
    await client.stats.get();

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/stats"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get stats with startDate only", async () => {
    await client.stats.get({ startDate: "2024-01-01" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/stats?startDate=2024-01-01"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get stats with endDate only", async () => {
    await client.stats.get({ endDate: "2024-12-31" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/stats?endDate=2024-12-31"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get stats with date range", async () => {
    await client.stats.get({ startDate: "2024-01-01", endDate: "2024-12-31" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/stats?startDate=2024-01-01&endDate=2024-12-31"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
