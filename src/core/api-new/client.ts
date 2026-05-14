/**
 * Axios HTTP Client
 * Configured instance with interceptors and retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG, RETRY_CONFIG, API_ENDPOINTS } from './endpoints';
import { TokenManager } from './tokenManager';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryRequest = (error: AxiosError, config?: AxiosRequestConfig): boolean => {
  if (!config) {
    return false;
  }

  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';

  if (RETRY_CONFIG.EXCLUDE_RETRY.includes(url)) {
    return false;
  }

  if (!RETRY_CONFIG.RETRY_METHODS.includes(method)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return API_CONFIG.retryStatusCodes.includes(error.response.status);
};

/**
 * Create axios instance with default configuration
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use(
    async (config) => {
      try {
        const accessToken = await TokenManager.getAccessToken();

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (__DEV__) {
          console.log('[API] Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasToken: !!accessToken,
          });
        }

        return config;
      } catch (error) {
        console.error('[API] Request interceptor error:', error);
        return config;
      }
    },
    (error) => {
      console.error('[API] Request interceptor failed:', error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (__DEV__) {
        console.log('[API] Response:', {
          status: response.status,
          url: response.config.url,
          dataSize: JSON.stringify(response.data).length,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      if (__DEV__) {
        console.error('[API] Response error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await TokenManager.getRefreshToken();

          if (!refreshToken) {
            return Promise.reject(error);
          }

          const response = await axios.post(
            `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken },
            {
              timeout: API_CONFIG.timeout,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { tokens } = response.data;
          await TokenManager.updateAccessToken(tokens.accessToken, tokens.expiresIn);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          return Promise.reject(error);
        }
      }

      const retryCount = originalRequest._retryCount ?? 0;
      if (retryCount < API_CONFIG.maxRetries && shouldRetryRequest(error, originalRequest)) {
        originalRequest._retryCount = retryCount + 1;
        const backoff = Math.min(500 * Math.pow(2, retryCount), 5000);

        if (__DEV__) {
          console.log('[API] Retrying request:', {
            url: originalRequest.url,
            attempt: originalRequest._retryCount,
            backoff,
          });
        }

        await delay(backoff);
        return client(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Raw Axios client instance
 */
const axiosClient = createApiClient();

/**
 * Wrapped API client that returns data instead of full responses
 */
export const apiClient = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosClient.get<T>(url, config);
    return response.data as T;
  },

  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosClient.post<T>(url, data, config);
    return response.data as T;
  },

  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosClient.put<T>(url, data, config);
    return response.data as T;
  },

  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosClient.patch<T>(url, data, config);
    return response.data as T;
  },

  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosClient.delete<T>(url, config);
    return response.data as T;
  },

  request: async <T>(config: any): Promise<T> => {
    const response = await axiosClient.request<T>(config);
    return response.data as T;
  },
};

export default apiClient;
