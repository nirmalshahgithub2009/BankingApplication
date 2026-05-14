/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

import { ApiConfig } from './types';

// ==================== Base Configuration ====================
export const API_CONFIG: ApiConfig = {
  baseURL: 'https://api.example.com',
  timeout: parseInt('30000', 10),
  maxRetries: parseInt('3', 10),
  retryDelay: 1000, // 1 second between retries
  retryStatusCodes: [408, 429, 500, 502, 503, 504], // Retry on these status codes
};

// ==================== API Endpoints ====================
export const API_ENDPOINTS = {
  // ========== Auth ==========
  AUTH: {
    LOGIN: '/auth/login', // POST
    SIGNUP: '/auth/signup', // POST
    LOGOUT: '/auth/logout', // POST
    REFRESH_TOKEN: '/auth/refresh', // POST
    VERIFY_EMAIL: '/auth/verify-email', // POST
    FORGOT_PASSWORD: '/auth/forgot-password', // POST
    RESET_PASSWORD: '/auth/reset-password', // POST
    CHANGE_PASSWORD: '/auth/change-password', // POST
  },

  // ========== User Profile ==========
  USER: {
    GET_PROFILE: '/user/profile', // GET
    UPDATE_PROFILE: '/user/profile', // PUT
    UPLOAD_AVATAR: '/user/avatar', // POST
    DELETE_ACCOUNT: '/user/delete', // DELETE
  },

  // ========== Accounts ==========
  ACCOUNTS: {
    GET_ALL: '/accounts', // GET
    GET_BY_ID: '/accounts/:id', // GET
    CREATE: '/accounts', // POST
    UPDATE: '/accounts/:id', // PUT
    DELETE: '/accounts/:id', // DELETE
    GET_BALANCE: '/accounts/:id/balance', // GET
  },

  // ========== Transactions ==========
  TRANSACTIONS: {
    GET_ALL: '/transactions', // GET (with pagination)
    GET_BY_ID: '/transactions/:id', // GET
    GET_BY_ACCOUNT: '/accounts/:accountId/transactions', // GET
    SEND_MONEY: '/transactions/send', // POST
    REQUEST_MONEY: '/transactions/request', // POST
    CANCEL: '/transactions/:id/cancel', // POST
    EXPORT: '/transactions/export', // GET
  },

  // ========== Cards ==========
  CARDS: {
    GET_ALL: '/cards', // GET
    GET_BY_ID: '/cards/:id', // GET
    CREATE: '/cards', // POST
    UPDATE: '/cards/:id', // PUT
    BLOCK: '/cards/:id/block', // POST
    UNBLOCK: '/cards/:id/unblock', // POST
    DELETE: '/cards/:id', // DELETE
  },

  // ========== Beneficiaries ==========
  BENEFICIARIES: {
    GET_ALL: '/beneficiaries', // GET
    CREATE: '/beneficiaries', // POST
    UPDATE: '/beneficiaries/:id', // PUT
    DELETE: '/beneficiaries/:id', // DELETE
    VERIFY: '/beneficiaries/:id/verify', // POST
  },

  // ========== Payments ==========
  PAYMENTS: {
    GET_ALL: '/payments', // GET
    CREATE: '/payments', // POST
    GET_STATUS: '/payments/:id/status', // GET
    CANCEL: '/payments/:id/cancel', // POST
    SCHEDULE: '/payments/schedule', // POST
  },

  // ========== Settings ==========
  SETTINGS: {
    GET_PREFERENCES: '/settings/preferences', // GET
    UPDATE_PREFERENCES: '/settings/preferences', // PUT
    GET_SECURITY: '/settings/security', // GET
    UPDATE_SECURITY: '/settings/security', // PUT
    ADD_DEVICE: '/settings/devices', // POST
    REMOVE_DEVICE: '/settings/devices/:id', // DELETE
  },

  // ========== Notifications ==========
  NOTIFICATIONS: {
    GET_ALL: '/notifications', // GET
    GET_BY_ID: '/notifications/:id', // GET
    MARK_READ: '/notifications/:id/read', // PUT
    DELETE: '/notifications/:id', // DELETE
    UPDATE_PREFERENCES: '/notifications/preferences', // PUT
  },
};

// ==================== Retry Configuration ====================
export const RETRY_CONFIG = {
  // Endpoints that should NOT be retried
  EXCLUDE_RETRY: [
    API_ENDPOINTS.AUTH.LOGIN,
    API_ENDPOINTS.AUTH.SIGNUP,
    API_ENDPOINTS.AUTH.LOGOUT,
    API_ENDPOINTS.USER.UPLOAD_AVATAR,
    API_ENDPOINTS.TRANSACTIONS.SEND_MONEY,
  ],

  // Status codes that should trigger retry
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],

  // Methods that should be retried
  RETRY_METHODS: ['GET', 'PUT', 'DELETE'],
};

/**
 * Helper function to build endpoint URL with parameters
 * @example
 * buildEndpoint(API_ENDPOINTS.ACCOUNTS.GET_BY_ID, { id: '123' })
 * // Returns: '/accounts/123'
 */
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return endpoint;

  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export default API_CONFIG;
