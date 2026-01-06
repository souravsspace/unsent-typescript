import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("ContactBooks", () => {
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
    it("should create a contact book and return data", async () => {
      const mockResponse = { data: { id: "book_123" }, error: null };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse.data),
      });

      const result = await client.contactBooks.create({ name: "My Book" });

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "My Book" }),
        }),
      );
      expect(result).toEqual({ data: mockResponse.data, error: null });
    });

    it("should handle error during creation", async () => {
      const mockError = { code: "BAD_REQUEST", message: "Invalid name" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contactBooks.create({ name: "" });

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("list", () => {
    it("should list contact books", async () => {
      const mockData = [{ id: "book_1", name: "Book 1" }];
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contactBooks.list();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks",
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

      const result = await client.contactBooks.list();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("get", () => {
    it("should get a contact book", async () => {
      const mockData = { id: "book_123", name: "My Book" };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contactBooks.get("book_123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle 'not found' error", async () => {
      const mockError = { code: "NOT_FOUND", message: "Contact book not found" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contactBooks.get("non_existent_id");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("update", () => {
    it("should update a contact book", async () => {
      const mockData = { id: "book_123", name: "Updated Book" };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contactBooks.update("book_123", { name: "Updated Book" });

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ name: "Updated Book" }),
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during update", async () => {
      const mockError = { code: "FORBIDDEN", message: "Not authorized" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contactBooks.update("book_123", { name: "New Name" });

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("delete", () => {
    it("should delete a contact book", async () => {
      const mockData = { success: true };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contactBooks.delete("book_123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during deletion", async () => {
      const mockError = { code: "INTERNAL_SERVER_ERROR", message: "Failed to delete" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contactBooks.delete("book_123");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });
});
