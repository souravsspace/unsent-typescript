import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type ListSuppressionsResponse = {
  data: any[] | null;
  error: ErrorResponse | null;
};

type AddSuppressionResponse = {
  data: { id: string } | null;
  error: ErrorResponse | null;
};

type DeleteSuppressionResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

export class Suppressions {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(query?: { page?: number; limit?: number }): Promise<ListSuppressionsResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return this.unsent.get<any[]>(`/suppressions${queryString}`);
  }

  async add(payload: { email: string; reason?: string }): Promise<AddSuppressionResponse> {
    return this.unsent.post<{ id: string }>("/suppressions", payload);
  }

  async delete(email: string): Promise<DeleteSuppressionResponse> {
    return this.unsent.delete<{ success: boolean }>(`/suppressions/email/${email}`);
  }
}
