export type Environment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  environment: Environment;
  baseURL: string;
  timeoutMs: number;
  retryCount: number;
  refreshEndpoint: string;
}

const ENVIRONMENT: Environment = (__DEV__ ? 'development' : 'production') as Environment;

export const API_CONFIG: Record<Environment, ApiConfig> = {
  development: {
    environment: 'development',
    baseURL: 'https://dev-api.bankapp.local',
    timeoutMs: 15000,
    retryCount: 2,
    refreshEndpoint: '/auth/refresh',
  },
  staging: {
    environment: 'staging',
    baseURL: 'https://staging-api.bankapp.com',
    timeoutMs: 15000,
    retryCount: 2,
    refreshEndpoint: '/auth/refresh',
  },
  production: {
    environment: 'production',
    baseURL: 'https://api.bankapp.com',
    timeoutMs: 15000,
    retryCount: 3,
    refreshEndpoint: '/auth/refresh',
  },
};

export const DEFAULT_API_CONFIG = API_CONFIG[ENVIRONMENT];
