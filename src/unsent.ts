import type { ErrorResponse } from "./types/error";
import { Contacts } from "./contact";
import { Emails } from "./email";
import { Domains } from "./domain";
import { ContactBooks } from "./contact-book";
import { Templates } from "./template";
import { Webhooks } from "./webhook";
import { Analytics } from "./analytics";
import { Campaigns } from "./campaign";
import { Suppressions } from "./suppression";
import { ApiKeys } from "./api-key";
import { Settings } from "./settings";
import { Events } from "./event";
import { Metrics } from "./metrics";
import { Stats } from "./stats";
import { Activity } from "./activity";
import { Teams } from "./team";
import { System } from "./system";

const defaultBaseUrl = "https://api.unsent.dev";
const baseUrl = `${process?.env?.UNSENT_BASE_URL ?? process?.env?.UNSENT_BASE_URL ?? defaultBaseUrl}/v1`;

function isUnsentErrorResponse(error: { error: ErrorResponse }) {
  return error.error.code !== undefined;
}

export class unsent {
  private readonly headers: Headers;

  readonly domains = new Domains(this);
  readonly emails = new Emails(this);
  readonly contacts = new Contacts(this);
  readonly contactBooks = new ContactBooks(this);
  readonly templates = new Templates(this);
  readonly webhooks = new Webhooks(this);
  readonly analytics = new Analytics(this);
  readonly campaigns = new Campaigns(this);
  readonly suppressions = new Suppressions(this);
  readonly apiKeys = new ApiKeys(this);
  readonly settings = new Settings(this);
  readonly events = new Events(this);
  readonly metrics = new Metrics(this);
  readonly stats = new Stats(this);
  readonly activity = new Activity(this);
  readonly teams = new Teams(this);
  readonly system = new System(this);

  url = baseUrl;

  constructor(
    readonly key?: string,
    url?: string,
  ) {
    if (!key) {
      if (typeof process !== "undefined" && process.env) {
        this.key = process.env.UNSENT_API_KEY ?? process.env.UNSENT_API_KEY;
      }

      if (!this.key) {
        throw new Error(
          'Missing API key. Pass it to the constructor `new unsent("un_xxxx")`',
        );
      }
    }

    if (url) {
      this.url = `${url}/v1`;
    }

    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "Content-Type": "application/json",
    });
  }

  async fetchRequest<T>(
    path: string,
    options = {},
  ): Promise<{ data: T | null; error: ErrorResponse | null }> {
    const fullUrl = `${this.url}${path}`;
    const response = await fetch(fullUrl, options);
    const defaultError = {
      code: "INTERNAL_SERVER_ERROR",
      message: response.statusText,
    };

    if (!response.ok) {
      try {
        const resp = await response.json();
        if (isUnsentErrorResponse(resp)) {
          return { data: null, error: resp };
        }

        return { data: null, error: resp.error };
      } catch (err) {
        if (err instanceof Error) {
          return {
            data: null,
            error: defaultError,
          };
        }

        return { data: null, error: defaultError };
      }
    }

    try {
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      // Handle empty response or invalid JSON
      if (err instanceof Error && err.message.includes("JSON")) {
        return {
          data: null,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid JSON response from server",
          },
        };
      }
      throw err;
    }
  }

  async post<T>(path: string, body: unknown, options?: { headers?: Record<string, string> }) {
    const headers = new Headers(this.headers);
    
    // Merge custom headers if provided
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(path: string) {
    const requestOptions = {
      method: "GET",
      headers: this.headers,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(path: string, body: any) {
    const requestOptions = {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(path: string, body: any) {
    const requestOptions = {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, body?: unknown) {
    const requestOptions = {
      method: "DELETE",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }
}
