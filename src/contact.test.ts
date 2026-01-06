import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Contacts", () => {
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
    it("should create a contact and return data", async () => {
      const contactData = { email: "test@example.com" };
      const mockResponse = { data: { id: "contact_123", ...contactData }, error: null };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse.data),
      });

      const result = await client.contacts.create("book_123", contactData);

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(contactData),
        }),
      );
      expect(result).toEqual({ data: mockResponse.data, error: null });
    });

    it("should handle error during creation", async () => {
      const mockError = { code: "BAD_REQUEST", message: "Invalid email" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contacts.create("book_123", { email: "invalid" });

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("list", () => {
    it("should list contacts", async () => {
      const mockData = [{ id: "contact_1", email: "test@example.com" }];
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.list("book_123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should list contacts with query params", async () => {
      const mockData = [{ id: "contact_1", email: "test@example.com" }];
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.list("book_123", {
        page: 2,
        limit: 20,
        emails: "test@example.com",
      });

      const expectedUrl = "https://api.unsent.dev/v1/contactBooks/book_123/contacts?emails=test%40example.com&page=2&limit=20";
      
      expect(globalFetch).toHaveBeenCalledWith(
        expectedUrl,
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

      const result = await client.contacts.list("book_123");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("get", () => {
    it("should get a contact", async () => {
      const mockData = { id: "contact_123", email: "test@example.com" };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.get("book_123", "contact_123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts/contact_123",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle 'not found' error", async () => {
      const mockError = { code: "NOT_FOUND", message: "Contact not found" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contacts.get("book_123", "non_existent");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("update", () => {
    it("should update a contact", async () => {
      const mockData = { id: "contact_123", firstName: "John" };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.update("book_123", "contact_123", { firstName: "John" });

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts/contact_123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ firstName: "John" }),
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

      const result = await client.contacts.update("book_123", "contact_123", { firstName: "John" });

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("delete", () => {
    it("should delete a contact", async () => {
      const mockData = { success: true };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.delete("book_123", "contact_123");

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts/contact_123",
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

      const result = await client.contacts.delete("book_123", "contact_123");

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("upsert", () => {
    it("should upsert a contact", async () => {
      const contactData = { email: "upsert@example.com", firstName: "Upsert" } as any;
      const mockData = { id: "contact_123", ...contactData };
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.contacts.upsert("book_123", "contact_123", contactData);

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/contactBooks/book_123/contacts/contact_123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(contactData),
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error during upsert", async () => {
      const mockError = { code: "BAD_REQUEST", message: "Invalid data" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.contacts.upsert("book_123", "contact_123", { email: "invalid" } as any);

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });
});
