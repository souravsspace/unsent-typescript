import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetActivityResponseSuccess =
  paths["/v1/activity"]["get"]["responses"]["200"]["content"]["application/json"];

type GetActivityResponse = {
  data: GetActivityResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Activity {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(query?: {
    page?: number;
    limit?: number;
  }): Promise<GetActivityResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<GetActivityResponseSuccess>(
      `/activity${queryString}`
    );

    return data;
  }
}
