/**
 * Axios HTTP Client
 * Configured instance with interceptors and retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { API_CONFIG, RETRY_CONFIG, API_ENDPOINTS } from './endpoints';
import { TokenManager } from './tokenManager';

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

  // ==================== Axios Retry Configuration ====================
  // Automatically retry failed requests
  axiosRetry(client, {
    retries: API_CONFIG.maxRetries,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error: AxiosError) => {
      if (!error.response) {
        // Retry on network errors
        return true;
      }

      const status = error.response.status;
      const isRetryableStatus = API_CONFIG.retryStatusCodes.includes(status);
      const method = (error.config?.method || 'GET').toUpperCase();
      const isRetryableMethod = RETRY_CONFIG.RETRY_METHODS.includes(method);

      // Only retry retriable status codes and methods
      return isRetryableStatus && isRetryableMethod;
    },
    shouldResetTimeout: true,
  });

  // ==================== Request Interceptor ====================
  // Attach access token to all requests
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

  // ==================== Response Interceptor ====================
  // Handle responses and errors
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
      };

      if (__DEV__) {
        console.error('[API] Response error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
      }

      // ========== Handle 401 Unauthorized ==========
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await TokenManager.getRefreshToken();

          if (!refreshToken) {
            // No refresh token available, return error
            return Promise.reject(error);
          }

          // Call refresh token endpoint
          // Note: This should NOT have Authorization header
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

          // Update tokens
          await TokenManager.updateAccessToken(tokens.accessToken, tokens.expiresIn);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          // Token refresh failed, redirect to login (handled in middleware)
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// ==================== Export Singleton Instance ====================
export const apiClient = createApiClient();

export default apiClient;
