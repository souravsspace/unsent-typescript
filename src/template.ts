import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type ListTemplatesResponse = {
  data: any[] | null;
  error: ErrorResponse | null;
};

type CreateTemplateResponse = {
  data: { id: string } | null;
  error: ErrorResponse | null;
};

type GetTemplateResponse = {
  data: any | null;
  error: ErrorResponse | null;
};

type UpdateTemplateResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

type DeleteTemplateResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

export class Templates {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListTemplatesResponse> {
    return this.unsent.get<any[]>("/templates");
  }

  async create(payload: { name: string; subject: string; html?: string; content?: string }): Promise<CreateTemplateResponse> {
    return this.unsent.post<{ id: string }>("/templates", payload);
  }

  async get(id: string): Promise<GetTemplateResponse> {
    return this.unsent.get<any>(`/templates/${id}`);
  }

  async update(id: string, payload: { name?: string; subject?: string; html?: string; content?: string }): Promise<UpdateTemplateResponse> {
    return this.unsent.patch<{ success: boolean }>(`/templates/${id}`, payload);
  }

  async delete(id: string): Promise<DeleteTemplateResponse> {
    return this.unsent.delete<{ success: boolean }>(`/templates/${id}`);
  }
}
