import type { ErrorResponse } from "../types";
import type { paths } from "../types/schema";
import type { unsent } from "./unsent";

type GetAnalyticsResponse = {
  data: any | null; // Placeholder type
  error: ErrorResponse | null;
};



type GetTimeSeriesResponseSuccess =
  paths["/v1/analytics/time-series"]["get"]["responses"]["200"]["content"]["application/json"];

type GetTimeSeriesResponse = {
  data: GetTimeSeriesResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetReputationResponseSuccess =
  paths["/v1/analytics/reputation"]["get"]["responses"]["200"]["content"]["application/json"];

type GetReputationResponse = {
  data: GetReputationResponseSuccess | null;
  error: ErrorResponse | null;
};


export class Analytics {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(query?: Record<string, string>): Promise<GetAnalyticsResponse> {
    // Construct query string if needed
    return this.unsent.get<any>("/analytics");
  }


  async getTimeSeries(query?: {
    days?: number;
    domain?: string;
  }): Promise<GetTimeSeriesResponse> {
    const params = new URLSearchParams();
    if (query?.days) params.append("days", query.days.toString());
    if (query?.domain) params.append("domain", query.domain);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return this.unsent.get<GetTimeSeriesResponseSuccess>(
      `/analytics/time-series${queryString}`
    );
  }

  async getReputation(query?: {
    domain?: string;
  }): Promise<GetReputationResponse> {
    const params = new URLSearchParams();
    if (query?.domain) params.append("domain", query.domain);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return this.unsent.get<GetReputationResponseSuccess>(
      `/analytics/reputation${queryString}`
    );
  }
}
