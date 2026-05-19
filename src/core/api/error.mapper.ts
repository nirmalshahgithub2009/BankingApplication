/**
 * API Error Mapper
 * Converts API errors to user-friendly messages
 */

import { ApiError } from '@app/store/types';
import { HttpErrorResponse } from './types';

// ==================== Error Code Mapping ====================
const ERROR_MESSAGE_MAP: Record<string, string> = {
  // Auth Errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'This email is already registered',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  ACCOUNT_LOCKED: 'Your account is temporarily locked. Try again later.',
  INVALID_OTP: 'Invalid or expired OTP. Please request a new one.',

  // Validation Errors
  VALIDATION_ERROR: 'Please check your input and try again',
  INVALID_PHONE_NUMBER: 'Please enter a valid phone number',
  INVALID_ACCOUNT_NUMBER: 'Invalid account number',
  DUPLICATE_ENTRY: 'This entry already exists',

  // Transaction Errors
  INSUFFICIENT_BALANCE: 'Insufficient balance in your account',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INVALID_RECIPIENT: 'Invalid recipient account',
  DUPLICATE_TRANSACTION: 'This transaction has already been processed',
  TRANSACTION_LIMIT_EXCEEDED: 'You have exceeded your transaction limit',
  INVALID_AMOUNT: 'Please enter a valid amount',

  // Account Errors
  ACCOUNT_NOT_FOUND: 'Account not found',
  ACCOUNT_INACTIVE: 'Your account is inactive',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  ACCOUNT_CLOSED: 'Your account is closed',

  // Network Errors
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  NO_INTERNET: 'No internet connection. Please check your network.',

  // Server Errors
  INTERNAL_SERVER_ERROR: 'Server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  MAINTENANCE: 'Service under maintenance. Please try again later.',

  // Token Errors
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_TOKEN: 'Invalid session. Please login again.',

  // General Errors
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Requested resource not found.',
};

// ==================== Status Code Mapping ====================
const STATUS_CODE_MESSAGE_MAP: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Your session has expired. Please login again.',
  403: 'You do not have permission to perform this action.',
  404: 'Requested resource not found.',
  408: 'Request timed out. Please try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
};

// ==================== Error Mapper Function ====================
/**
 * Maps API errors to user-friendly messages
 * Handles various error formats from API
 * @param error - HTTP error or API error
 * @returns Formatted ApiError with user-friendly message
 */
export const mapApiError = (error: unknown): ApiError => {
  const timestamp = Date.now();

  // Handle network errors
  if (!error) {
    return {
      code: 'NETWORK_ERROR',
      message: ERROR_MESSAGE_MAP.NETWORK_ERROR,
      statusCode: 0,
      timestamp,
    };
  }

  // Handle axios/HTTP errors
  const httpError = error as HttpErrorResponse;

  // Network error (no response from server)
  if (httpError.isNetworkError || !httpError.response) {
    return {
      code: 'NETWORK_ERROR',
      message: ERROR_MESSAGE_MAP.NETWORK_ERROR,
      statusCode: 0,
      timestamp,
    };
  }

  const status = httpError.response.status;
  const responseData = httpError.response.data;

  // Extract error details from response
  const errorCode = responseData?.code || `HTTP_${status}`;
  const errorMessage =
    ERROR_MESSAGE_MAP[errorCode] ||
    responseData?.message ||
    STATUS_CODE_MESSAGE_MAP[status] ||
    ERROR_MESSAGE_MAP.UNKNOWN_ERROR;

  return {
    code: errorCode,
    message: errorMessage,
    statusCode: status,
    details: responseData?.details,
    timestamp,
  };
};

/**
 * Converts validation errors from response to user-friendly format
 * @param validationErrors - Record of field errors
 * @returns Formatted error messages
 */
export const mapValidationErrors = (
  validationErrors?: Record<string, unknown>
): Record<string, string> => {
  if (!validationErrors) return {};

  const formatted: Record<string, string> = {};

  Object.entries(validationErrors).forEach(([field, errors]) => {
    if (Array.isArray(errors) && errors.length > 0) {
      formatted[field] = String(errors[0]);
    } else if (typeof errors === 'string') {
      formatted[field] = errors;
    }
  });

  return formatted;
};

/**
 * Check if error is a retryable error
 * @param statusCode - HTTP status code
 * @returns True if error should be retried
 */
export const isRetryableError = (statusCode: number): boolean => {
  const retryableCodes = [408, 429, 500, 502, 503, 504];
  return retryableCodes.includes(statusCode);
};

/**
 * Check if error is an authentication error
 * @param statusCode - HTTP status code
 * @returns True if error is auth-related
 */
export const isAuthError = (statusCode: number): boolean => {
  return [401, 403].includes(statusCode);
};

/**
 * Get user-friendly error message
 * @param error - ApiError or error code
 * @returns User-friendly message
 */
export const getUserFriendlyMessage = (error: ApiError | string): string => {
  if (typeof error === 'string') {
    return ERROR_MESSAGE_MAP[error] || error;
  }
  return error.message;
};

/**
 * Log error details for analytics/monitoring
 * @param error - ApiError with details
 */
export const logErrorForMonitoring = (error: ApiError): void => {
  if (__DEV__) {
    console.error('[API Error]', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date(error.timestamp).toISOString(),
    });
  }

  // TODO: Integrate with Firebase Crashlytics in Step 5
  // crashlytics().recordError(error);
};

export default {
  mapApiError,
  mapValidationErrors,
  isRetryableError,
  isAuthError,
  getUserFriendlyMessage,
  logErrorForMonitoring,
};
