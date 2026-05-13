import { DEFAULT_API_CONFIG, ApiConfig } from './config';
import { ApiError, createApiError, normalizeFetchError } from './errors';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenManager';

export type RequestInterceptor = (request: RequestConfig) => Promise<RequestConfig> | RequestConfig;
export type ResponseInterceptor = (
  response: ResponseContext
) => Promise<ResponseContext> | ResponseContext;
export type ErrorInterceptor = (error: ApiError) => Promise<never> | never;

export interface RequestConfig extends RequestInit {
  url: string;
  query?: Record<string, string | number | boolean>;
  retryAttempt?: number;
}

export interface ResponseContext {
  response: Response;
  data: unknown;
}

export interface ApiClientOptions {
  config?: ApiConfig;
  refreshHandler?: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken?: string }>;
}

const buildUrl = (
  baseURL: string,
  url: string,
  query?: Record<string, string | number | boolean>
): string => {
  const normalizedUrl = url.startsWith('http')
    ? url
    : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  if (!query || Object.keys(query).length === 0) {
    return normalizedUrl;
  }

  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${normalizedUrl}${normalizedUrl.includes('?') ? '&' : '?'}${queryString}`;
};

const timeoutFetch = async (
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export class ApiClient {
  private config: ApiConfig;
  private refreshHandler?: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken?: string }>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(options: ApiClientOptions = {}) {
    this.config = options.config ?? DEFAULT_API_CONFIG;
    this.refreshHandler = options.refreshHandler;
    this.addRequestInterceptor(this.injectTokenInterceptor);
    this.addResponseInterceptor(this.handleResponseInterceptor);
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private async applyRequestInterceptors(request: RequestConfig): Promise<RequestConfig> {
    return this.requestInterceptors.reduce(async (accPromise, interceptor) => {
      const acc = await accPromise;
      return interceptor(acc);
    }, Promise.resolve(request));
  }

  private async applyResponseInterceptors(
    responseContext: ResponseContext
  ): Promise<ResponseContext> {
    return this.responseInterceptors.reduce(async (accPromise, interceptor) => {
      const acc = await accPromise;
      return interceptor(acc);
    }, Promise.resolve(responseContext));
  }

  private async applyErrorInterceptors(error: ApiError): Promise<never> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
    throw error;
  }

  private async injectTokenInterceptor(request: RequestConfig): Promise<RequestConfig> {
    const headers = request.headers ? { ...request.headers } : {};
    const accessToken = getAccessToken();

    if (accessToken) {
      Object.assign(headers, {
        Authorization: `Bearer ${accessToken}`,
      });
    }

    return {
      ...request,
      headers,
    };
  }

  private async handleResponseInterceptor(
    responseContext: ResponseContext
  ): Promise<ResponseContext> {
    if (!responseContext.response.ok) {
      const error = await createApiError(
        responseContext.response.url,
        responseContext.response.type || 'UNKNOWN',
        responseContext.response,
        responseContext.data as unknown
      );
      throw error;
    }

    return responseContext;
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken || !this.refreshHandler) {
      clearTokens();
      throw new ApiError({
        message: 'Missing refresh token or refresh handler',
        isRetryable: false,
      });
    }

    const result = await this.refreshHandler(refreshToken);
    setTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken ?? refreshToken,
    });

    return result.accessToken;
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private async executeFetch<T>(request: RequestConfig): Promise<T> {
    const requestWithQuery = {
      ...request,
      url: buildUrl(this.config.baseURL, request.url, request.query),
    };
    const hydratedRequest = await this.applyRequestInterceptors(requestWithQuery);

    const init: RequestInit = {
      ...hydratedRequest,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(hydratedRequest.headers ?? {}),
      },
    };

    try {
      const response = await timeoutFetch(hydratedRequest.url, init, this.config.timeoutMs);
      const data = await this.parseResponseBody(response);
      const responseContext = await this.applyResponseInterceptors({ response, data });
      return responseContext.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        return this.handleApiError<T>(error, requestWithQuery);
      }

      return this.handleApiError<T>(
        normalizeFetchError(error, hydratedRequest.url, hydratedRequest.method ?? 'GET'),
        requestWithQuery
      );
    }
  }

  private async handleApiError<T>(error: ApiError, request: RequestConfig): Promise<T> {
    if (error.statusCode === 401 && !request.retryAttempt) {
      try {
        await this.refreshAccessToken();
        return this.request<T>({ ...request, retryAttempt: 1 });
      } catch (refreshError) {
        const apiError =
          refreshError instanceof ApiError
            ? refreshError
            : new ApiError({ message: String(refreshError) });
        await this.applyErrorInterceptors(apiError);
      }
    }

    if (error.isRetryable && (request.retryAttempt ?? 0) < this.config.retryCount) {
      return this.request<T>({ ...request, retryAttempt: (request.retryAttempt ?? 0) + 1 });
    }

    await this.applyErrorInterceptors(error);
    throw error;
  }

  async request<T>(request: RequestConfig): Promise<T> {
    return this.executeFetch<T>(request);
  }

  get<T>(url: string, query?: RequestConfig['query']): Promise<T> {
    return this.request<T>({ url, method: 'GET', query });
  }

  post<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  put<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'PUT', body: body ? JSON.stringify(body) : undefined });
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>({ url, method: 'DELETE' });
  }
}

const defaultRefreshHandler = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string }> => {
  const response = await fetch(
    `${DEFAULT_API_CONFIG.baseURL}${DEFAULT_API_CONFIG.refreshEndpoint}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!response.ok) {
    throw await createApiError(response.url, 'POST', response, await response.json());
  }

  return (await response.json()) as { accessToken: string; refreshToken?: string };
};

export const apiClient = new ApiClient({
  config: DEFAULT_API_CONFIG,
  refreshHandler: defaultRefreshHandler,
});
