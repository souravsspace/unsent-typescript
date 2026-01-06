import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Domains", () => {
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

  describe("create", () => {
    it("should create a domain and return data", async () => {
      const domainData = { name: "example.com", region: "us-east-1" };
      const mockResponse = { data: { id: "123", ...domainData }, error: null };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse.data),
      });

      const result = await client.domains.create(domainData);

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/domains",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(domainData),
        }),
      );
      expect(result).toEqual({ data: mockResponse.data, error: null });
    });

    it("should handle error during creation", async () => {
      const mockError = { code: "BAD_REQUEST", message: "Invalid domain" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.domains.create({ name: "" } as any);

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("list", () => {
    it("should list domains", async () => {
      const mockData = [{ id: "123", name: "example.com" }];
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.domains.list();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/domains",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during listing", async () => {
      const mockError = { code: "INTERNAL_SERVER_ERROR", message: "Server error" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.domains.list();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("get", () => {
    it("should get a domain", async () => {
      const mockData = { id: "123", name: "example.com" };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.domains.get("123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/domains/123",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle 'not found' error", async () => {
      const mockError = { code: "NOT_FOUND", message: "Domain not found" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.domains.get("999");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("delete", () => {
    it("should delete a domain", async () => {
      const mockData = { success: true };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.domains.delete("123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/domains/123",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during deletion", async () => {
      const mockError = { code: "FORBIDDEN", message: "Not allowed" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.domains.delete("123");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("verify", () => {
    it("should verify a domain", async () => {
      const mockData = { verified: true };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.domains.verify("123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/domains/123/verify",
        expect.objectContaining({
          method: "PUT",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during verification", async () => {
      const mockError = { code: "BAD_REQUEST", message: "Verification failed" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.domains.verify("123");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  })
});