import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetSettingsResponseSuccess =
  paths["/v1/settings"]["get"]["responses"]["200"]["content"]["application/json"];

type GetSettingsResponse = {
  data: GetSettingsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Settings {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(): Promise<GetSettingsResponse> {
    return this.unsent.get<GetSettingsResponseSuccess>("/settings");
  }
}
