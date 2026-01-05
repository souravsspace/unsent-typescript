import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type GetSettingsResponse = {
  data: any | null;
  error: ErrorResponse | null;
};

export class Settings {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async get(): Promise<GetSettingsResponse> {
    return this.unsent.get<any>("/settings");
  }
}
