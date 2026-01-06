import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("ApiKeys", () => {
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

  it("should create an API key", async () => {
    await client.apiKeys.create({ name: "Test Key" });

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/api-keys",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Test Key" }),
      }),
    );
  });

  it("should create an API key with permission", async () => {
    await client.apiKeys.create({ name: "Sending Key", permission: "SENDING" });

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/api-keys",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Sending Key", permission: "SENDING" }),
      }),
    );
  });

  it("should list API keys", async () => {
    await client.apiKeys.list();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/api-keys",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should delete an API key", async () => {
    await client.apiKeys.delete("key_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/api-keys/key_123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
