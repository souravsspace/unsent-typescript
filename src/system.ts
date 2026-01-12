import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type GetHealthResponseSuccess =
  paths["/v1/health"]["get"]["responses"]["200"]["content"]["application/json"];

type GetHealthResponse = {
  data: GetHealthResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetVersionResponseSuccess =
  paths["/v1/version"]["get"]["responses"]["200"]["content"]["application/json"];

type GetVersionResponse = {
  data: GetVersionResponseSuccess | null;
  error: ErrorResponse | null;
};

export class System {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async health(): Promise<GetHealthResponse> {
    const data = await this.unsent.get<GetHealthResponseSuccess>("/health");
    return data;
  }

  async version(): Promise<GetVersionResponse> {
    const data = await this.unsent.get<GetVersionResponseSuccess>("/version");
    return data;
  }
}
