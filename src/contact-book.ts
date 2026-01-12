import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type CreateContactBookPayload =
  NonNullable<paths["/v1/contactBooks"]["post"]["requestBody"]>["content"]["application/json"];

type CreateContactBookResponseSuccess =
  paths["/v1/contactBooks"]["post"]["responses"]["200"]["content"]["application/json"];

type CreateContactBookResponse = {
  data: CreateContactBookResponseSuccess | null;
  error: ErrorResponse | null;
};

type ListContactBooksResponseSuccess =
  paths["/v1/contactBooks"]["get"]["responses"]["200"]["content"]["application/json"];

type ListContactBooksResponse = {
  data: ListContactBooksResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetContactBookResponseSuccess =
  paths["/v1/contactBooks/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetContactBookResponse = {
  data: GetContactBookResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateContactBookPayload =
  NonNullable<paths["/v1/contactBooks/{id}"]["patch"]["requestBody"]>["content"]["application/json"];

type UpdateContactBookResponseSuccess =
  paths["/v1/contactBooks/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

type UpdateContactBookResponse = {
  data: UpdateContactBookResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteContactBookResponseSuccess =
  paths["/v1/contactBooks/{id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteContactBookResponse = {
  data: DeleteContactBookResponseSuccess | null;
  error: ErrorResponse | null;
};

export class ContactBooks {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(): Promise<ListContactBooksResponse> {
    const data = await this.unsent.get<ListContactBooksResponseSuccess>("/contactBooks");
    return {
      data: data.data,
      error: data.error,
    };
  }

  async create(payload: CreateContactBookPayload): Promise<CreateContactBookResponse> {
    const data = await this.unsent.post<CreateContactBookResponseSuccess>("/contactBooks", payload);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async get(id: string): Promise<GetContactBookResponse> {
    const data = await this.unsent.get<GetContactBookResponseSuccess>(`/contactBooks/${id}`);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async update(id: string, payload: UpdateContactBookPayload): Promise<UpdateContactBookResponse> {
    const data = await this.unsent.patch<UpdateContactBookResponseSuccess>(`/contactBooks/${id}`, payload);
    return {
      data: data.data,
      error: data.error,
    };
  }

  async delete(id: string): Promise<DeleteContactBookResponse> {
    const data = await this.unsent.delete<DeleteContactBookResponseSuccess>(`/contactBooks/${id}`);
    return {
      data: data.data,
      error: data.error,
    };
  }
}
