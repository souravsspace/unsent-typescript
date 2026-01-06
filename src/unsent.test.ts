import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Unsent Client", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
      statusText: "OK",
    });
  });

  it("should initialize with API key", () => {
    const client = new unsent("test_key");
    expect(client).toBeDefined();
    expect(client.key).toBe("test_key");
  });

  it("should initialize with API key and URL", () => {
    const client = new unsent("test_key", "https://custom.api");
    expect(client.url).toBe("https://custom.api/v1");
  });

  it("should throw if no API key is provided", () => {
    const originalEnv = process.env.UNSENT_API_KEY;
    delete process.env.UNSENT_API_KEY;

    expect(() => new unsent()).toThrow(
      'Missing API key. Pass it to the constructor `new unsent("un_xxxx")`',
    );

    process.env.UNSENT_API_KEY = originalEnv;
  });

  it("should use environment variable if key is not provided", () => {
    process.env.UNSENT_API_KEY = "env_key";
    const client = new unsent();
    expect(client.key).toBe("env_key");
    delete process.env.UNSENT_API_KEY;
  });

  it("should make GET request", async () => {
    const client = new unsent("test_key");
    await client.get("/test");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );
  });

  it("should make POST request", async () => {
    const client = new unsent("test_key");
    const body = { test: "data" };
    await client.post("/test", body);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(body),
        headers: expect.any(Headers),
      }),
    );
  });

  it("should handle error response", async () => {
    const client = new unsent("test_key");
    globalFetch.mockResolvedValue({
      ok: false,
      statusText: "Bad Request",
      json: () => Promise.resolve({ error: { code: "ERROR", message: "Bad" } }),
    });

    const response = await client.get("/test");
    expect(response.error).toEqual({ error: { code: "ERROR", message: "Bad" } });
    expect(response.data).toBeNull();
  });
  it("should make PUT request", async () => {
    const client = new unsent("test_key");
    const body = { update: "data" };
    await client.put("/test", body);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(body),
        headers: expect.any(Headers),
      }),
    );
  });

  it("should make PATCH request", async () => {
    const client = new unsent("test_key");
    const body = { patch: "data" };
    await client.patch("/test", body);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(body),
        headers: expect.any(Headers),
      }),
    );
  });

  it("should make DELETE request", async () => {
    const client = new unsent("test_key");
    await client.delete("/test");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.any(Headers),
      }),
    );
  });

  it("should make DELETE request with body", async () => {
    const client = new unsent("test_key");
    const body = { ids: [1, 2] };
    await client.delete("/test", body);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/test",
      expect.objectContaining({
        method: "DELETE",
        body: JSON.stringify(body),
        headers: expect.any(Headers),
      }),
    );
  });

  it("should handle invalid JSON response", async () => {
    const client = new unsent("test_key");
    globalFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Unexpected token < in JSON at position 0")),
    });

    const response = await client.get("/test");
    expect(response.error).toEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid JSON response from server",
    });
    expect(response.data).toBeNull();
  });
});
