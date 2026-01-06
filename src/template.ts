import type { ErrorResponse } from "../types";
import type { paths } from "../types/schema";
import type { unsent } from "./unsent";

type ListTemplatesResponseSuccess =
  paths["/v1/templates"]["get"]["responses"]["200"]["content"]["application/json"];

type ListTemplatesResponse = {
  data: ListTemplatesResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateTemplatePayload =
  NonNullable<paths["/v1/templates"]["post"]["requestBody"]>["content"]["application/json"];

type CreateTemplateResponseSuccess =
  paths["/v1/templates"]["post"]["responses"]["200"]["content"]["application/json"];

type CreateTemplateResponse = {
  data: CreateTemplateResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetTemplateResponseSuccess =
  paths["/v1/templates/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetTemplateResponse = {
  data: GetTemplateResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateTemplatePayload =
  NonNullable<paths["/v1/templates/{id}"]["patch"]["requestBody"]>["content"]["application/json"];

type UpdateTemplateResponseSuccess =
  paths["/v1/templates/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

type UpdateTemplateResponse = {
  data: UpdateTemplateResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteTemplateResponseSuccess =
  paths["/v1/templates/{id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteTemplateResponse = {
  data: DeleteTemplateResponseSuccess | null;
  error: ErrorResponse | null;
};

export class Templates {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListTemplatesResponse> {
    const data = await this.unsent.get<ListTemplatesResponseSuccess>("/templates");
    return {
      data: data.data,
      error: data.error,
    };
  }

  async create(payload: CreateTemplatePayload): Promise<CreateTemplateResponse> {
    const data = await this.unsent.post<CreateTemplateResponseSuccess>("/templates", payload);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async get(id: string): Promise<GetTemplateResponse> {
    const data = await this.unsent.get<GetTemplateResponseSuccess>(`/templates/${id}`);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async update(id: string, payload: UpdateTemplatePayload): Promise<UpdateTemplateResponse> {
    const data = await this.unsent.patch<UpdateTemplateResponseSuccess>(`/templates/${id}`, payload);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async delete(id: string): Promise<DeleteTemplateResponse> {
    const data = await this.unsent.delete<DeleteTemplateResponseSuccess>(`/templates/${id}`);
    return {
      data: data.data,
      error: data.error,
    };
  }
}
