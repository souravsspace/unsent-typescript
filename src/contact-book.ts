import type { ErrorResponse } from "../types";
import type { unsent } from "./unsent";

type ListContactBooksResponse = {
  data: any[] | null;
  error: ErrorResponse | null;
};

type CreateContactBookResponse = {
  data: { id: string } | null;
  error: ErrorResponse | null;
};

type GetContactBookResponse = {
  data: any | null; // Detailed contact book object
  error: ErrorResponse | null;
};

type UpdateContactBookResponse = {
  data: { id: string; name: string } | null;
  error: ErrorResponse | null;
};

type DeleteContactBookResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

export class ContactBooks {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListContactBooksResponse> {
    return this.unsent.get<any[]>("/contactBooks");
  }

  async create(payload: { name: string; emoji?: string; properties?: any }): Promise<CreateContactBookResponse> {
    return this.unsent.post<{ id: string }>("/contactBooks", payload);
  }

  async get(id: string): Promise<GetContactBookResponse> {
    return this.unsent.get<any>(`/contactBooks/${id}`);
  }

  async update(id: string, payload: { name?: string; emoji?: string; properties?: any }): Promise<UpdateContactBookResponse> {
    return this.unsent.patch<{ id: string; name: string }>(`/contactBooks/${id}`, payload);
  }

  async delete(id: string): Promise<DeleteContactBookResponse> {
    return this.unsent.delete<{ success: boolean }>(`/contactBooks/${id}`);
  }
}
