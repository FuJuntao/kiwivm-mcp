import type { KiwiVMResponse } from "./types.js";
import { KiwiVMError } from "./types.js";

const API_BASE = "https://api.64clouds.com/v1";

export interface ClientOptions {
  veid: string;
  apiKey: string;
}

export class KiwiVMClient {
  private veid: string;
  private apiKey: string;

  constructor(options: ClientOptions) {
    this.veid = options.veid;
    this.apiKey = options.apiKey;
  }

  async call<T extends KiwiVMResponse = KiwiVMResponse>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {},
  ): Promise<T> {
    const body = new URLSearchParams();
    body.set("veid", this.veid);
    body.set("api_key", this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        body.set(key, String(value));
      }
    }

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as T & KiwiVMResponse;

    if (data.error !== 0) {
      throw new KiwiVMError(
        data.message ?? `API error: ${data.error}`,
        data.error,
        data,
      );
    }

    return data as T;
  }
}
