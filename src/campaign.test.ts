import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Campaigns", () => {
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

  it("should create a campaign", async () => {
    const campaignData = {
      name: "Test Campaign",
      subject: "Hello",
      html: "<p>Hi</p>",
      from: "test@example.com",
      contactBookId: "book_123",
      scheduledAt: "2023-01-01T00:00:00Z",
    };
    await client.campaigns.create(campaignData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(campaignData),
      }),
    );
  });

  it("should list campaigns", async () => {
    await client.campaigns.list();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get a campaign", async () => {
    await client.campaigns.get("campaign_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns/campaign_123",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should pause a campaign", async () => {
    await client.campaigns.pause("campaign_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns/campaign_123/pause",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
  it("should schedule a campaign", async () => {
    const scheduleData = { scheduledAt: "2023-01-01T00:00:00Z" };
    await client.campaigns.schedule("campaign_123", scheduleData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns/campaign_123/schedule",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(scheduleData),
      }),
    );
  });

  it("should resume a campaign", async () => {
    await client.campaigns.resume("campaign_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/campaigns/campaign_123/resume",
      expect.objectContaining({
        method: "POST",
        body: "{}",
      }),
    );
  });
});
