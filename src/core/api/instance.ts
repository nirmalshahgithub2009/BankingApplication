import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { getApiConfig } from './config';

export type ApiRefreshResponse = {
  accessToken?: string | null;
  refreshToken?: string | null;
  token?: string | null;
};

export type ApiTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

const tokenState: ApiTokens = {
  accessToken: null,
  refreshToken: null,
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
  _retry?: boolean;
};

let refreshHandler: ((refreshToken: string) => Promise<ApiRefreshResponse>) | null = null;
let isRefreshing = false;
let queuedRefreshRequests: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  request: RetryableRequestConfig;
}> = [];

export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
  retryable?: boolean;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: unknown,
    retryable?: boolean
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}

export const getApiTokens = (): ApiTokens => ({
  accessToken: tokenState.accessToken,
  refreshToken: tokenState.refreshToken,
});

export const setApiAuthTokens = (
  accessToken?: string | null,
  refreshToken?: string | null
): void => {
  tokenState.accessToken = accessToken ?? null;
  tokenState.refreshToken = refreshToken ?? tokenState.refreshToken;
};

export const clearApiTokens = (): void => {
  tokenState.accessToken = null;
  tokenState.refreshToken = null;
};

const setAuthorizationHeader = (headers: any, token: string): void => {
  if (!headers) {
    return;
  }

  if (typeof headers.set === 'function') {
    headers.set('Authorization', `Bearer ${token}`);
    return;
  }

  headers.Authorization = `Bearer ${token}`;
};

export const setApiTokenRefreshHandler = (
  handler: (refreshToken: string) => Promise<ApiRefreshResponse>
): void => {
  refreshHandler = handler;
};

const getRetryableStatusCodes = (): number[] => [408, 429, 500, 502, 503, 504];

const getRetryableErrorCode = (error: AxiosError): boolean => {
  const retryableCodes = ['ECONNABORTED', 'ERR_NETWORK', 'ERR_BAD_RESPONSE'];
  return !!error.code && retryableCodes.includes(error.code);
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responseStatus = error.response?.status;
    const responseData = error.response?.data;
    const serverMessage =
      typeof responseData === 'object' && responseData !== null && 'message' in responseData
        ? String((responseData as { message?: string }).message)
        : error.message;

    return new ApiError(
      serverMessage || 'Request failed',
      responseStatus,
      error.code,
      responseData,
      !!responseStatus && getRetryableStatusCodes().includes(responseStatus)
        ? true
        : getRetryableErrorCode(error)
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, undefined, error, false);
  }

  return new ApiError('Unknown API error', undefined, undefined, error, false);
};

const retryRequestIfNeeded = async (
  error: AxiosError,
  instance: AxiosInstance,
  config: any
): Promise<unknown> => {
  const originalRequest = error.config as RetryableRequestConfig | undefined;

  if (!originalRequest || (originalRequest.__retryCount ?? 0) >= (config.retryAttempts ?? 0)) {
    return Promise.reject(normalizeApiError(error));
  }

  const retryableStatus =
    !!error.response && getRetryableStatusCodes().includes(error.response.status);
  const retryableCode = getRetryableErrorCode(error);

  if (!retryableStatus && !retryableCode) {
    return Promise.reject(normalizeApiError(error));
  }

  originalRequest.__retryCount = (originalRequest.__retryCount ?? 0) + 1;
  originalRequest._retry = true;

  return instance.request(originalRequest);
};

const refreshAccessToken = async (instance: AxiosInstance): Promise<void> => {
  if (!refreshHandler || !tokenState.refreshToken) {
    throw new Error('No refresh token available');
  }

  const refreshedTokens = await refreshHandler(tokenState.refreshToken);
  const nextAccessToken =
    refreshedTokens.accessToken ?? refreshedTokens.token ?? tokenState.accessToken;
  const nextRefreshToken = refreshedTokens.refreshToken ?? tokenState.refreshToken;

  setApiAuthTokens(nextAccessToken, nextRefreshToken);
};

/**
 * Create and configure axios instance with environment-specific settings
 */
export const createApiInstance = (): AxiosInstance => {
  const config = getApiConfig();

  const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-Dynatrace-ID': config.dynatraceId,
    },
  });

  const queueRefreshRetry = (request: RetryableRequestConfig): Promise<unknown> =>
    new Promise((resolve, reject) => {
      queuedRefreshRequests.push({
        resolve: () => {
          if (request.headers && tokenState.accessToken) {
            setAuthorizationHeader(request.headers, tokenState.accessToken);
          }
          resolve(instance.request(request));
        },
        reject: () => reject(normalizeApiError(new Error('Token refresh failed'))),
        request,
      });
    });

  instance.interceptors.request.use(
    (request) => {
      if (tokenState.accessToken) {
        setAuthorizationHeader(request.headers, tokenState.accessToken);
      }

      return request;
    },
    (error) => Promise.reject(normalizeApiError(error))
  );

  instance.interceptors.response.use(
    (response) => response.data ?? response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (originalRequest && !originalRequest._retry) {
        const retryResult = await retryRequestIfNeeded(error, instance, config).catch(
          (retryError) => {
            if (retryError instanceof ApiError) {
              return Promise.reject(retryError);
            }

            return Promise.reject(normalizeApiError(retryError));
          }
        );

        if (retryResult) {
          return retryResult;
        }
      }

      if (error.response?.status === 401 && refreshHandler && tokenState.refreshToken) {
        if (isRefreshing && originalRequest) {
          return queueRefreshRetry(originalRequest);
        }

        isRefreshing = true;

        try {
          await refreshAccessToken(instance);

          if (originalRequest) {
            originalRequest._retry = true;
            if (originalRequest.headers && tokenState.accessToken) {
              setAuthorizationHeader(originalRequest.headers, tokenState.accessToken);
            }

            const retryResponse = await instance.request(originalRequest);

            queuedRefreshRequests.forEach(({ resolve }) => resolve());
            queuedRefreshRequests = [];

            return retryResponse;
          }

          queuedRefreshRequests.forEach(({ resolve }) => resolve());
          queuedRefreshRequests = [];
          return Promise.resolve();
        } catch (refreshError) {
          clearApiTokens();
          queuedRefreshRequests.forEach(({ reject }) => reject(normalizeApiError(refreshError)));
          queuedRefreshRequests = [];
          return Promise.reject(normalizeApiError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(normalizeApiError(error));
    }
  );

  return instance;
};

/**
 * Shared axios instance
 */
export const apiInstance = createApiInstance();

/**
 * Generic HTTP methods
 */
export const httpClient = {
  /**
   * GET request
   */
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    return apiInstance.get<any, T>(url, config);
  },

  /**
   * POST request
   */
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return apiInstance.post<any, T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return apiInstance.put<any, T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    return apiInstance.delete<any, T>(url, config);
  },
};
