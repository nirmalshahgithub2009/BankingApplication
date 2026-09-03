import { getApiBaseUrl } from './config';

/**
 * Build a complete API URL from a path
 * @param path - The endpoint path (e.g., '/auth/login')
 * @returns The full API URL
 */
export const buildApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${baseUrl}/${normalizedPath}`;
};

/**
 * API client helper utilities
 */
export const apiClient = {
  /**
   * Get the current base URL
   */
  get baseUrl(): string {
    return getApiBaseUrl();
  },

  /**
   * Build a full API URL from a path
   */
  buildUrl: buildApiUrl,
};
