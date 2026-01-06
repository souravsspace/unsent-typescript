import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Settings", () => {
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

  it("should get settings", async () => {
    await client.settings.get();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/settings",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
