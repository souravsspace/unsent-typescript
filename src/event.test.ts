import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Events", () => {
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

  it("should list events without query parameters", async () => {
    await client.events.list();

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/events"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should list events with pagination", async () => {
    await client.events.list({ page: 2, limit: 25 });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/events?page=2&limit=25"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should list events with status filter", async () => {
    await client.events.list({ status: "DELIVERED" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/events?status=DELIVERED"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should list events with startDate filter", async () => {
    await client.events.list({ startDate: "2024-01-01T00:00:00Z" });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/events?startDate=2024-01-01T00%3A00%3A00Z"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should list events with all parameters", async () => {
    await client.events.list({
      page: 1,
      limit: 50,
      status: "OPENED",
      startDate: "2024-01-01T00:00:00Z",
    });

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.unsent.dev/v1/events"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
