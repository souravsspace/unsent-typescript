import { render } from "@react-email/render";
import type * as React from "react";
import type { ErrorResponse } from "../types";
import type { paths } from "../types/schema";
import type { unsent } from "./unsent";

type SendEmailPayload =
  paths["/v1/emails"]["post"]["requestBody"]["content"]["application/json"] & {
    react?: React.ReactElement;
  };

type CreateEmailResponse = {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateEmailResponseSuccess =
  paths["/v1/emails"]["post"]["responses"]["200"]["content"]["application/json"];

type GetEmailResponseSuccess =
  paths["/v1/emails/{emailId}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetEmailResponse = {
  data: GetEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateEmailPayload =
  paths["/v1/emails/{emailId}"]["patch"]["requestBody"]["content"]["application/json"] & {
    react?: React.ReactElement;
  };

type UpdateEmailResponse = {
  data: UpdateEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateEmailResponseSuccess =
  paths["/v1/emails/{emailId}"]["patch"]["responses"]["200"]["content"]["application/json"];

type CancelEmailResponse = {
  data: CancelEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type CancelEmailResponseSuccess =
  paths["/v1/emails/{emailId}/cancel"]["post"]["responses"]["200"]["content"]["application/json"];

// Batch emails types
/**
 * Payload for sending multiple emails in a single batch request.
 */
type BatchEmailPayload =
  paths["/v1/emails/batch"]["post"]["requestBody"]["content"]["application/json"];

/**
 * Successful response schema for batch email send.
 */
type BatchEmailResponseSuccess =
  paths["/v1/emails/batch"]["post"]["responses"]["200"]["content"]["application/json"];

/**
 * Options for email requests.
 */
type EmailRequestOptions = {
  idempotencyKey?: string;
};

/**
 * Response structure for the batch method.
 */
type BatchEmailResponse = {
  data: BatchEmailResponseSuccess["data"] | null;
  error: ErrorResponse | null;
};


export class Emails {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async send(payload: SendEmailPayload, options?: EmailRequestOptions) {
    return this.create(payload, options);
  }

  async create(
    payload: SendEmailPayload,
    options?: EmailRequestOptions,
  ): Promise<CreateEmailResponse> {
    if (payload.react) {
      payload.html = await render(payload.react as React.ReactElement);
      delete payload.react;
    }

    const data = await this.unsent.post<CreateEmailResponseSuccess>(
      "/emails",
      payload,
      options?.idempotencyKey
        ? { headers: { "Idempotency-Key": options.idempotencyKey } }
        : undefined,
    );

    return data;
  }

  /**
   * Send up to 100 emails in a single request.
   *
   * @param payload An array of email payloads. Max 100 emails.
   * @returns A promise that resolves to the list of created email IDs or an error.
   */
    async batch(
    payload: BatchEmailPayload,
    options?: EmailRequestOptions,
  ): Promise<BatchEmailResponse> {
    // Note: React element rendering is not supported in batch mode.
    const response = await this.unsent.post<BatchEmailResponseSuccess>(
      "/emails/batch",
      payload,
      options?.idempotencyKey
        ? { headers: { "Idempotency-Key": options.idempotencyKey } }
        : undefined,
    );
    return {
      data: response.data ? response.data.data : null,
      error: response.error,
    };
  }

  async get(id: string): Promise<GetEmailResponse> {
    const data = await this.unsent.get<GetEmailResponseSuccess>(
      `/emails/${id}`
    );

    return data;
  }

  async update(
    id: string,
    payload: UpdateEmailPayload
  ): Promise<UpdateEmailResponse> {
    const data = await this.unsent.patch<UpdateEmailResponseSuccess>(
      `/emails/${id}`,
      payload
    );
    return data;
  }

  async cancel(id: string): Promise<CancelEmailResponse> {
    const data = await this.unsent.post<CancelEmailResponseSuccess>(
      `/emails/${id}/cancel`,
      {}
    );
    return data;
  }
}
