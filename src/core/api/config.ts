/**
 * API Environment Configuration
 * Supports dev, staging, and production environments
 * with centralized base URL management
 */

export enum ApiEnvironment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export interface ApiConfigType {
  environment: ApiEnvironment;
  baseUrl: string;
  dynatraceId: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * API configuration per environment
 * Includes base URL, Dynatrace ID, and other secrets/settings
 */
const API_CONFIG_BY_ENV: Record<ApiEnvironment, ApiConfigType> = {
  [ApiEnvironment.Development]: {
    environment: ApiEnvironment.Development,
    baseUrl: 'https://dev-api.bankapp.local',
    dynatraceId: 'dt_dev_12345',
    timeout: 30000,
    retryAttempts: 3,
  },
  [ApiEnvironment.Staging]: {
    environment: ApiEnvironment.Staging,
    baseUrl: 'https://staging-api.bankapp.com',
    dynatraceId: 'dt_staging_67890',
    timeout: 30000,
    retryAttempts: 3,
  },
  [ApiEnvironment.Production]: {
    environment: ApiEnvironment.Production,
    baseUrl: 'https://api.bankapp.com',
    dynatraceId: 'dt_prod_abcde',
    timeout: 30000,
    retryAttempts: 2,
  },
};

/**
 * Current environment - can be set to override the default (Development)
 * For React Native, this should be configured via your build system or app initialization
 */
let currentEnvironment: ApiEnvironment = ApiEnvironment.Development;

/**
 * Set the API environment at runtime
 * @param env - The environment to switch to
 */
export const setApiEnvironment = (env: ApiEnvironment): void => {
  currentEnvironment = env;
};

/**
 * Get the current API configuration
 * @returns The current API configuration object with all settings and secrets
 */
export const getApiConfig = (): ApiConfigType => API_CONFIG_BY_ENV[currentEnvironment];

/**
 * Get the current API base URL
 * @returns The base URL for API requests in the current environment
 */
export const getApiBaseUrl = (): string => API_CONFIG_BY_ENV[currentEnvironment].baseUrl;

/**
 * Get the current environment
 * @returns The current API environment
 */
export const getCurrentApiEnvironment = (): ApiEnvironment => currentEnvironment;
