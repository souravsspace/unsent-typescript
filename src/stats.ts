import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetStatsResponseSuccess =
  paths["/v1/stats"]["get"]["responses"]["200"]["content"]["application/json"];

type GetStatsResponse = {
  data: GetStatsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Stats {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(query?: {
    startDate?: string;
    endDate?: string;
  }): Promise<GetStatsResponse> {
    const params = new URLSearchParams();
    if (query?.startDate) params.append("startDate", query.startDate);
    if (query?.endDate) params.append("endDate", query.endDate);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<GetStatsResponseSuccess>(
      `/stats${queryString}`
    );

    return data;
  }
}
