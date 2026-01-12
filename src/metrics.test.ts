import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Metrics", () => {
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

  it("should get metrics without query parameters", async () => {
    await client.metrics.get();

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/metrics"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get metrics with day period", async () => {
    await client.metrics.get({ period: "day" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/metrics?period=day"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get metrics with week period", async () => {
    await client.metrics.get({ period: "week" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/metrics?period=week"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get metrics with month period", async () => {
    await client.metrics.get({ period: "month" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/metrics?period=month"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
