import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Templates", () => {
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

  it("should create a template", async () => {
    const templateData = { name: "Test Template", subject: "Hello", html: "<p>Hi</p>" };
    await client.templates.create(templateData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/templates",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(templateData),
      }),
    );
  });

  it("should list templates", async () => {
    await client.templates.list();

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/templates",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should get a template", async () => {
    await client.templates.get("template_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/templates/template_123",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should update a template", async () => {
    const updateData = { name: "Updated Name" };
    await client.templates.update("template_123", updateData);

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/templates/template_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(updateData),
      }),
    );
  });

  it("should delete a template", async () => {
    await client.templates.delete("template_123");

    expect(globalFetch).toHaveBeenCalledWith(
      "https://api.unsent.dev/v1/templates/template_123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
