export type ApiErrorPayload = {
  message: string;
  statusCode?: number;
  responseBody?: unknown;
  url?: string;
  method?: string;
  isRetryable?: boolean;
  originalError?: Error;
};

export class ApiError extends Error {
  statusCode?: number;
  responseBody?: unknown;
  url?: string;
  method?: string;
  isRetryable: boolean;
  originalError?: Error;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = payload.statusCode;
    this.responseBody = payload.responseBody;
    this.url = payload.url;
    this.method = payload.method;
    this.isRetryable = payload.isRetryable ?? false;
    this.originalError = payload.originalError;
  }
}

export const isRetryableStatus = (statusCode: number): boolean => {
  return statusCode === 429 || statusCode === 503 || statusCode === 504 || statusCode >= 500;
};

export const createApiError = async (
  url: string,
  method: string,
  response: Response,
  responseBody: unknown,
  originalError?: Error
): Promise<ApiError> => {
  const message =
    responseBody && typeof responseBody === 'object' && 'message' in responseBody
      ? String((responseBody as any).message)
      : response.statusText || 'API request failed';

  return new ApiError({
    message,
    statusCode: response.status,
    responseBody,
    url,
    method,
    isRetryable: isRetryableStatus(response.status),
    originalError,
  });
};

export const normalizeFetchError = (error: unknown, url: string, method: string): ApiError => {
  const message = error instanceof Error ? error.message : 'Network request failed';
  return new ApiError({
    message,
    url,
    method,
    isRetryable: true,
    originalError: error instanceof Error ? error : undefined,
  });
};
