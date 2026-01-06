import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Analytics", () => {
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

  it("should get email analytics", async () => {
    await client.analytics.get();

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/analytics"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get time series analytics", async () => {
    await client.analytics.getTimeSeries({ days: 30, domain: "example.com" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.unsent.dev/v1/analytics/time-series?days=30&domain=example.com",
      ),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get reputation analytics", async () => {
    await client.analytics.getReputation({ domain: "example.com" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.unsent.dev/v1/analytics/reputation?domain=example.com",
      ),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
