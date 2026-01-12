import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type CreateDomainPayload =
  NonNullable<paths["/v1/domains"]["post"]["requestBody"]>["content"]["application/json"];

type CreateDomainResponse = {
  data: CreateDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateDomainResponseSuccess =
  paths["/v1/domains"]["post"]["responses"]["200"]["content"]["application/json"];

type GetDomainsResponse = {
  data: GetDomainsResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainsResponseSuccess =
  paths["/v1/domains"]["get"]["responses"]["200"]["content"]["application/json"];

type VerifyDomainResponse = {
  data: VerifyDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type VerifyDomainResponseSuccess =
  paths["/v1/domains/{id}/verify"]["put"]["responses"]["200"]["content"]["application/json"];

type GetDomainResponse = {
  data: GetDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainResponseSuccess =
  paths["/v1/domains/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

type DeleteDomainResponse = {
  data: DeleteDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteDomainResponseSuccess =
  paths["/v1/domains/{id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type GetDomainAnalyticsResponseSuccess =
  paths["/v1/domains/{id}/analytics"]["get"]["responses"]["200"]["content"]["application/json"];

type GetDomainAnalyticsResponse = {
  data: GetDomainAnalyticsResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainStatsResponseSuccess =
  paths["/v1/domains/{id}/stats"]["get"]["responses"]["200"]["content"]["application/json"];

type GetDomainStatsResponse = {
  data: GetDomainStatsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Domains {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<GetDomainsResponse> {
    const data = await this.unsent.get<GetDomainsResponseSuccess>("/domains");
    return data;
  }

  async create(payload: CreateDomainPayload): Promise<CreateDomainResponse> {
    const data = await this.unsent.post<CreateDomainResponseSuccess>(
      "/domains",
      payload,
    );
    return data;
  }

  async verify(id: string): Promise<VerifyDomainResponse> {
    const data = await this.unsent.put<VerifyDomainResponseSuccess>(
      `/domains/${id}/verify`,
      {},
    );
    return data;
  }

  async get(id: string): Promise<GetDomainResponse> {
    const data = await this.unsent.get<GetDomainResponseSuccess>(
      `/domains/${id}`,
    );

    return data;
  }

  async delete(id: string): Promise<DeleteDomainResponse> {
    const data = await this.unsent.delete<DeleteDomainResponseSuccess>(
      `/domains/${id}`,
    );

    return data;
  }

  async getAnalytics(
    id: string,
    query?: { period?: "day" | "week" | "month" }
  ): Promise<GetDomainAnalyticsResponse> {
    const params = new URLSearchParams();
    if (query?.period) params.append("period", query.period);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<GetDomainAnalyticsResponseSuccess>(
      `/domains/${id}/analytics${queryString}`
    );

    return data;
  }

  async getStats(
    id: string,
    query?: { startDate?: string; endDate?: string }
  ): Promise<GetDomainStatsResponse> {
    const params = new URLSearchParams();
    if (query?.startDate) params.append("startDate", query.startDate);
    if (query?.endDate) params.append("endDate", query.endDate);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<GetDomainStatsResponseSuccess>(
      `/domains/${id}/stats${queryString}`
    );

    return data;
  }
}
