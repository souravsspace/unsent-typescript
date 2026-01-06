import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type ListWebhooksResponse = {
  data: any[] | null; // Placeholder type
  error: ErrorResponse | null;
};

type CreateWebhookResponse = {
  data: { id: string } | null;
  error: ErrorResponse | null;
};

type UpdateWebhookResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

type DeleteWebhookResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

/**
 * Webhooks resource
 * 
 * @remarks
 * This resource is currently in development and not fully implemented on the server side yet.
 * The methods below are placeholders/preparations for the future implementation.
 */
export class Webhooks {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListWebhooksResponse> {
    return this.unsent.get<any[]>("/webhooks");
  }

  async create(payload: { url: string; events: string[] }): Promise<CreateWebhookResponse> {
    return this.unsent.post<{ id: string }>("/webhooks", payload);
  }

  async update(id: string, payload: { url?: string; events?: string[] }): Promise<UpdateWebhookResponse> {
    return this.unsent.patch<{ success: boolean }>(`/webhooks/${id}`, payload);
  }

  async delete(id: string): Promise<DeleteWebhookResponse> {
    return this.unsent.delete<{ success: boolean }>(`/webhooks/${id}`);
  }
}
