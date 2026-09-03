import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getApiConfig } from './config';

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

  // Response interceptor to extract data from response envelope
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      return Promise.reject(error);
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
