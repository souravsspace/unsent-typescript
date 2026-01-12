import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type ListEventsResponseSuccess =
  paths["/v1/events"]["get"]["responses"]["200"]["content"]["application/json"];

type ListEventsResponse = {
  data: ListEventsResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Events {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(query?: {
    page?: number;
    limit?: number;
    status?:
      | "SCHEDULED"
      | "QUEUED"
      | "SENT"
      | "DELIVERY_DELAYED"
      | "BOUNCED"
      | "REJECTED"
      | "RENDERING_FAILURE"
      | "DELIVERED"
      | "OPENED"
      | "CLICKED"
      | "COMPLAINED"
      | "FAILED"
      | "CANCELLED"
      | "SUPPRESSED";
    startDate?: string;
  }): Promise<ListEventsResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.status) params.append("status", query.status);
    if (query?.startDate) params.append("startDate", query.startDate);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await this.unsent.get<ListEventsResponseSuccess>(
      `/events${queryString}`
    );

    return data;
  }
}
