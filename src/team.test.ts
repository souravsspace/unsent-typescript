import { describe, it, expect, vi, beforeEach } from "vitest";
import { unsent } from "./unsent";

const globalFetch = vi.fn();
global.fetch = globalFetch;

describe("Teams", () => {
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

  describe("get", () => {
    it("should get current team", async () => {
      const mockData = {
        id: "team123",
        name: "My Team",
        plan: "pro",
      };

      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.teams.get();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/team",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error when getting current team", async () => {
      const mockError = { code: "UNAUTHORIZED", message: "Not authenticated" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.teams.get();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });

  describe("list", () => {
    it("should list all teams", async () => {
      const mockData = [
        { id: "team1", name: "Team 1" },
        { id: "team2", name: "Team 2" },
      ];

      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.teams.list();

      expect(globalFetch).toHaveBeenCalledWith(
        "https://api.unsent.dev/v1/teams",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle error when listing teams", async () => {
      const mockError = { code: "FORBIDDEN", message: "Access denied" };
      globalFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: mockError }),
      });

      const result = await client.teams.list();

      expect(result).toEqual({ data: null, error: { error: mockError } });
    });
  });
});
