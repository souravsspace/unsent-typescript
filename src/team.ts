import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetTeamResponseSuccess =
  paths["/v1/team"]["get"]["responses"]["200"]["content"]["application/json"];

type GetTeamResponse = {
  data: GetTeamResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetTeamsResponseSuccess =
  paths["/v1/teams"]["get"]["responses"]["200"]["content"]["application/json"];

type GetTeamsResponse = {
  data: GetTeamsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Teams {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(): Promise<GetTeamResponse> {
    const data = await this.unsent.get<GetTeamResponseSuccess>("/team");
    return data;
  }

  async list(): Promise<GetTeamsResponse> {
    const data = await this.unsent.get<GetTeamsResponseSuccess>("/teams");
    return data;
  }
}
