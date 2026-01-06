import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;


// Note: These tests are for future implementation of Webhooks given that the feature is not fully available yet.
describe("Webhooks", () => {
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

  it("should create a webhook", async () => {
    const webhookData = { url: "https://example.com/webhook", events: ["email.sent"] };
    await client.webhooks.create(webhookData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/webhooks",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(webhookData),
      }),
    );
  });

  it("should list webhooks", async () => {
    await client.webhooks.list();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/webhooks",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should update a webhook", async () => {
    const updateData = { url: "https://new-example.com/webhook" };
    await client.webhooks.update("webhook_123", updateData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/webhooks/webhook_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(updateData),
      }),
    );
  });


  it("should delete a webhook", async () => {
    await client.webhooks.delete("webhook_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/webhooks/webhook_123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
