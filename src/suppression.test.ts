import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Suppressions", () => {
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

  it("should create a suppression", async () => {
    await client.suppressions.add({ email: "test@example.com", reason: "MANUAL" });

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/suppressions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", reason: "MANUAL" }),
      }),
    );
  });

  it("should list suppressions", async () => {
    await client.suppressions.list();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/suppressions",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should list suppressions with pagination and filters", async () => {
    await client.suppressions.list({ page: 2, limit: 20, search: "test", reason: "COMPLAINT" });

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/suppressions?page=2&limit=20&search=test&reason=COMPLAINT",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should delete a suppression", async () => {
    await client.suppressions.delete("email_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/suppressions/email/email_123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
