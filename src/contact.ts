import type { ErrorResponse } from "./types/error";
import type { paths } from "./types/schema";
import type { unsent } from "./unsent";

type CreateContactPayload =
  NonNullable<paths["/v1/contactBooks/{contactBookId}/contacts"]["post"]["requestBody"]>["content"]["application/json"];

type CreateContactResponse = {
  data: CreateContactResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateContactResponseSuccess =
  paths["/v1/contactBooks/{contactBookId}/contacts"]["post"]["responses"]["200"]["content"]["application/json"];

type ListContactsResponseSuccess =
  paths["/v1/contactBooks/{contactBookId}/contacts"]["get"]["responses"]["200"]["content"]["application/json"];

type ListContactsResponse = {
  data: ListContactsResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetContactResponseSuccess =
  paths["/v1/contactBooks/{contactBookId}/contacts/{contactId}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetContactResponse = {
  data: GetContactResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateContactPayload =
  NonNullable<paths["/v1/contactBooks/{contactBookId}/contacts/{contactId}"]["patch"]["requestBody"]>["content"]["application/json"];

type UpdateContactResponseSuccess =
  paths["/v1/contactBooks/{contactBookId}/contacts/{contactId}"]["patch"]["responses"]["200"]["content"]["application/json"];

type UpdateContactResponse = {
  data: UpdateContactResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpsertContactPayload =
  NonNullable<paths["/v1/contactBooks/{contactBookId}/contacts/{contactId}"]["put"]["requestBody"]>["content"]["application/json"];

type UpsertContactResponseSuccess =
  paths["/v1/contactBooks/{contactBookId}/contacts/{contactId}"]["put"]["responses"]["200"]["content"]["application/json"];

type UpsertContactResponse = {
  data: UpsertContactResponseSuccess | null;
  error: ErrorResponse | null;
};

type DeleteContactResponse = {
  data: { success: boolean } | null;
  error: ErrorResponse | null;
};

export class Contacts {
  constructor(private readonly unsent: unsent) {
    this.unsent = unsent;
  }

  async list(contactBookId: string, query?: {
    emails?: string;
    page?: number;
    limit?: number;
    ids?: string;
  }): Promise<ListContactsResponse> {
    const params = new URLSearchParams();
    if (query?.emails) params.append("emails", query.emails);
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.ids) params.append("ids", query.ids);
    
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const response = await this.unsent.get<ListContactsResponseSuccess>(
      `/contactBooks/${contactBookId}/contacts${queryString}`
    );

    return {
      data: response.data,
      error: response.error,
    };
  }

  async create(
    contactBookId: string,
    payload: CreateContactPayload
  ): Promise<CreateContactResponse> {
    const data = await this.unsent.post<CreateContactResponseSuccess>(
      `/contactBooks/${contactBookId}/contacts`,
      payload
    );

    return data;
  }

  async get(
    contactBookId: string,
    contactId: string
  ): Promise<GetContactResponse> {
    const data = await this.unsent.get<GetContactResponseSuccess>(
      `/contactBooks/${contactBookId}/contacts/${contactId}`
    );
    return data;
  }

  async update(
    contactBookId: string,
    contactId: string,
    payload: UpdateContactPayload
  ): Promise<UpdateContactResponse> {
    const data = await this.unsent.patch<UpdateContactResponseSuccess>(
      `/contactBooks/${contactBookId}/contacts/${contactId}`,
      payload
    );

    return data;
  }

  async upsert(
    contactBookId: string,
    contactId: string,
    payload: UpsertContactPayload
  ): Promise<UpsertContactResponse> {
    const data = await this.unsent.put<UpsertContactResponseSuccess>(
      `/contactBooks/${contactBookId}/contacts/${contactId}`,
      payload
    );

    return data;
  }

  async delete(
    contactBookId: string,
    contactId: string
  ): Promise<DeleteContactResponse> {
    const data = await this.unsent.delete<{ success: boolean }>(
      `/contactBooks/${contactBookId}/contacts/${contactId}`
    );

    return data;
  }
}
