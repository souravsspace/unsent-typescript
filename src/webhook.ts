import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

export interface Webhook {
  id: string;
  url: string;
  description: string | null;
  eventTypes: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  secret?: string; // Only returned on create/get if available
}

export type CreateWebhookPayload = {
  url: string;
  description?: string;
  eventTypes: string[];
  secret?: string;
};

export type UpdateWebhookPayload = {
  url?: string;
  description?: string | null;
  eventTypes?: string[];
  active?: boolean;
  rotateSecret?: boolean;
  secret?: string;
};

type ListWebhooksResponse = {
  data: Webhook[] | null;
  error: ErrorResponse | null;
};

type GetWebhookResponse = {
  data: Webhook | null;
  error: ErrorResponse | null;
};

type CreateWebhookResponse = {
  data: Webhook | null;
  error: ErrorResponse | null;
};

type UpdateWebhookResponse = {
  data: Webhook | null; // Returns updated webhook
  error: ErrorResponse | null;
};

type DeleteWebhookResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

type TestWebhookResponse = {
  data: { callId: string } | null;
  error: ErrorResponse | null;
};

/**
 * Webhooks resource
 */
export class Webhooks {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListWebhooksResponse> {
    return this.unsent.get<Webhook[]>("/webhooks");
  }

  async get(id: string): Promise<GetWebhookResponse> {
    return this.unsent.get<Webhook>(`/webhooks/${id}`);
  }

  async create(payload: CreateWebhookPayload): Promise<CreateWebhookResponse> {
    return this.unsent.post<Webhook>("/webhooks", payload);
  }

  async update(id: string, payload: UpdateWebhookPayload): Promise<UpdateWebhookResponse> {
    return this.unsent.patch<Webhook>(`/webhooks/${id}`, payload);
  }

  async delete(id: string): Promise<DeleteWebhookResponse> {
    return this.unsent.delete<{ success: boolean }>(`/webhooks/${id}`);
  }

  async test(id: string): Promise<TestWebhookResponse> {
    return this.unsent.post<{ callId: string }>(`/webhooks/${id}/test`, {});
  }
}
