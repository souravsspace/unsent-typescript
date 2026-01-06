import type { ErrorResponse } from "../types";
import type { paths } from "../types/schema";
import type { unsent } from "./unsent";

type ListSuppressionsResponseSuccess =
  paths["/v1/suppressions"]["get"]["responses"]["200"]["content"]["application/json"];

type ListSuppressionsResponse = {
  data: ListSuppressionsResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateSuppressionPayload =
  NonNullable<paths["/v1/suppressions"]["post"]["requestBody"]>["content"]["application/json"];

type AddSuppressionResponseSuccess =
  paths["/v1/suppressions"]["post"]["responses"]["200"]["content"]["application/json"];

type AddSuppressionResponse = {
  data: AddSuppressionResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteSuppressionResponseSuccess =
  paths["/v1/suppressions/email/{email}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteSuppressionResponse = {
  data: DeleteSuppressionResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Suppressions {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(query?: {
    page?: number;
    limit?: number;
    search?: string;
    reason?: "HARD_BOUNCE" | "COMPLAINT" | "MANUAL" | "UNSUBSCRIBE";
  }): Promise<ListSuppressionsResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);
    if (query?.reason) params.append("reason", query.reason);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await this.unsent.get<ListSuppressionsResponseSuccess>(
      `/suppressions${queryString}`
    );

    return {
      data: response.data,
      error: response.error,
    };
  }

  async add(payload: CreateSuppressionPayload): Promise<AddSuppressionResponse> {
    const data = await this.unsent.post<AddSuppressionResponseSuccess>(
      "/suppressions",
      payload
    );
    return {
      data: data.data,
      error: data.error,
    };
  }

  async delete(email: string): Promise<DeleteSuppressionResponse> {
    const data = await this.unsent.delete<DeleteSuppressionResponseSuccess>(
      `/suppressions/email/${email}`
    );
    return {
      data: data.data,
      error: data.error,
    };
  }
}
