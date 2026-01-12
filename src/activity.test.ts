import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Activity", () => {
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

  it("should get activity without query parameters", async () => {
    await client.activity.get();

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/activity"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get activity with pagination", async () => {
    await client.activity.get({ page: 2, limit: 25 });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/activity?page=2&limit=25"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get activity with page only", async () => {
    await client.activity.get({ page: 1 });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/activity?page=1"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get activity with limit only", async () => {
    await client.activity.get({ limit: 100 });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/activity?limit=100"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
