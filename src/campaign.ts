import type { unsent } from "./unsent";
import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";

type CreateCampaignPayload =
  NonNullable<paths["/v1/campaigns"]["post"]["requestBody"]>["content"]["application/json"];

type CreateCampaignResponseSuccess =
  paths["/v1/campaigns"]["post"]["responses"]["200"]["content"]["application/json"];

type CreateCampaignResponse = {
  data: CreateCampaignResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetCampaignResponseSuccess =
  paths["/v1/campaigns/{campaignId}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCampaignResponse = {
  data: GetCampaignResponseSuccess | null;
  error: ErrorResponse | null;
};

type ScheduleCampaignPayload =
  NonNullable<paths["/v1/campaigns/{campaignId}/schedule"]["post"]["requestBody"]>["content"]["application/json"];

type ScheduleCampaignResponseSuccess =
  paths["/v1/campaigns/{campaignId}/schedule"]["post"]["responses"]["200"]["content"]["application/json"];

type ScheduleCampaignResponse = {
  data: ScheduleCampaignResponseSuccess | null;
  error: ErrorResponse | null;
};

type CampaignActionResponseSuccess = 
  paths["/v1/campaigns/{campaignId}/pause"]["post"]["responses"]["200"]["content"]["application/json"];

type CampaignActionResponse = {
  data: CampaignActionResponseSuccess | null;
  error: ErrorResponse | null;
};

type ListCampaignsResponseSuccess =
  paths["/v1/campaigns"]["get"]["responses"]["200"]["content"]["application/json"];

type ListCampaignsResponse = {
  data: ListCampaignsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Campaigns {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListCampaignsResponse> {
    const data = await this.unsent.get<ListCampaignsResponseSuccess>("/campaigns");
    return {
       data: data.data,
       error: data.error,
    };
  }

  async create(
    payload: CreateCampaignPayload,
  ): Promise<CreateCampaignResponse> {
    const data = await this.unsent.post<CreateCampaignResponseSuccess>(
      `/campaigns`,
      payload,
    );

    return data;
  }

  async get(campaignId: string): Promise<GetCampaignResponse> {
    const data = await this.unsent.get<GetCampaignResponseSuccess>(
      `/campaigns/${campaignId}`,
    );
    return data;
  }

  async schedule(
    campaignId: string,
    payload: ScheduleCampaignPayload,
  ): Promise<ScheduleCampaignResponse> {
    const data = await this.unsent.post<ScheduleCampaignResponseSuccess>(
      `/campaigns/${campaignId}/schedule`,
      payload,
    );

    return data;
  }

  async pause(campaignId: string): Promise<CampaignActionResponse> {
    const data = await this.unsent.post<CampaignActionResponseSuccess>(
      `/campaigns/${campaignId}/pause`,
      {},
    );

    return data;
  }

  async resume(campaignId: string): Promise<CampaignActionResponse> {
    const data = await this.unsent.post<CampaignActionResponseSuccess>(
      `/campaigns/${campaignId}/resume`,
      {},
    );

    return data;
  }
}
