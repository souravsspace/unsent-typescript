import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type ListApiKeysResponse = {
  data: any[] | null;
  error: ErrorResponse | null;
};

type CreateApiKeyResponse = {
  data: { token: string } | null;
  error: ErrorResponse | null;
};

type DeleteApiKeyResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

export class ApiKeys {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListApiKeysResponse> {
    return this.unsent.get<any[]>("/api-keys");
  }

  async create(payload: { name: string; permission?: "FULL" | "SENDING" }): Promise<CreateApiKeyResponse> {
    return this.unsent.post<{ token: string }>("/api-keys", payload);
  }

  async delete(id: string): Promise<DeleteApiKeyResponse> {
    return this.unsent.delete<{ success: boolean }>(`/api-keys/${id}`);
  }
}
