import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetMetricsResponseSuccess =
  paths["/v1/metrics"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMetricsResponse = {
  data: GetMetricsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Metrics {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(query?: {
    period?: "day" | "week" | "month";
  }): Promise<GetMetricsResponse> {
    const params = new URLSearchParams();
    if (query?.period) params.append("period", query.period);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<GetMetricsResponseSuccess>(
      `/metrics${queryString}`
    );

    return data;
  }
}
