import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type ListApiKeysResponseSuccess =
  paths["/v1/api-keys"]["get"]["responses"]["200"]["content"]["application/json"];

type ListApiKeysResponse = {
  data: ListApiKeysResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateApiKeyPayload =
  NonNullable<paths["/v1/api-keys"]["post"]["requestBody"]>["content"]["application/json"];

type CreateApiKeyResponseSuccess =
  paths["/v1/api-keys"]["post"]["responses"]["200"]["content"]["application/json"];

type CreateApiKeyResponse = {
  data: CreateApiKeyResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteApiKeyResponseSuccess =
  paths["/v1/api-keys/{id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteApiKeyResponse = {
  data: DeleteApiKeyResponseSuccess | null;
  error: ErrorResponse | null;
};

export class ApiKeys {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListApiKeysResponse> {
    const data = await this.unsent.get<ListApiKeysResponseSuccess>("/api-keys");
    return {
      data: data.data,
      error: data.error,
    };
  }

  async create(payload: CreateApiKeyPayload): Promise<CreateApiKeyResponse> {
    const data = await this.unsent.post<CreateApiKeyResponseSuccess>("/api-keys", payload);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async delete(id: string): Promise<DeleteApiKeyResponse> {
    const data = await this.unsent.delete<DeleteApiKeyResponseSuccess>(`/api-keys/${id}`);
    return {
      data: data.data,
      error: data.error,
    };
  }
}
