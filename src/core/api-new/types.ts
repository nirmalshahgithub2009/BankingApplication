/**
 * API Types & Interfaces
 * Centralized type definitions for API layer
 */

// ==================== API Response ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: number;
}

// ==================== Auth API ====================
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    accountType: 'PERSONAL' | 'BUSINESS';
    avatar?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// ==================== Accounts API ====================
export interface AccountResponse {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  name: string;
  isDefault: boolean;
  createdAt: number;
  lastUpdated: number;
}

// ==================== Transactions API ====================
export interface TransactionResponse {
  id: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER';
  amount: number;
  currency: string;
  description: string;
  timestamp: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference: string;
  receiverDetails?: {
    name: string;
    accountNumber: string;
  };
}

export interface TransactionListResponse {
  transactions: TransactionResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

// ==================== API Config ====================
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  retryStatusCodes: number[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  accountType: 'PERSONAL' | 'BUSINESS';
  avatar?: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: number;
}

// ==================== Request/Response Interceptor Params ====================
export interface InterceptorConfig {
  excludeTokenRefresh?: boolean;
  excludeErrorNotification?: boolean;
}

// ==================== HTTP Error ====================
export interface HttpErrorResponse {
  response?: {
    status: number;
    data: {
      code?: string;
      message?: string;
      details?: Record<string, unknown>;
    };
  };
  message: string;
  isNetworkError?: boolean;
}
