import { FetchError } from '@/shared/utils/fetch/fetch-error';

import { RequestOptions, TypeSearchParams } from './fetch-types';

export class FetchClient {
  private baseUrl: string;
  public headers?: Record<string, string>;
  public params?: TypeSearchParams;
  public options?: RequestOptions;

  public constructor(init: {
    baseUrl: string;
    headers?: Record<string, string>;
    params?: TypeSearchParams;
    options?: RequestOptions;
  }) {
    this.baseUrl = init.baseUrl;
    this.headers = init.headers;
    this.params = init.params;
    this.options = init.options;
  }

  public get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'body'> = {},
  ): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  public post<T, B>(
    endpoint: string,
    body?: B,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('POST', endpoint, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  }

  public put<T, B>(
    endpoint: string,
    body?: B,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  }

  public patch<T, B>(
    endpoint: string,
    body?: B,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  }

  public delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'body'> = {},
  ): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    // Create full URL with query parameters
    const query = options.params ? this.createSearchParams(options.params) : '';
    const url = `${this.baseUrl}/${endpoint}${query}`;

    // Merge headers and options
    const config: RequestInit = {
      method,
      ...this.options,
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    // Handle HTTP errors
    if (!response.ok) {
      let message = response.statusText;

      try {
        const data = await response.json();
        message = data?.message ?? message;
      } catch {}

      throw new FetchError(response.status, message);
    }

    // Parse and return JSON response
    return response.json() as Promise<T>;
  }

  private createSearchParams(params: TypeSearchParams): string {
    // Combine default params with provided params
    const combinedParams = { ...this.params, ...params };
    const searchParams = new URLSearchParams();

    Object.entries(combinedParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values by appending each item separately
        value.forEach((val) => {
          if (val !== undefined && val !== null) {
            searchParams.append(key, String(val));
          }
        });
      } else if (value !== undefined && value !== null) {
        // Append single value
        searchParams.append(key, String(value));
      }
    });

    // Return the query string
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}
