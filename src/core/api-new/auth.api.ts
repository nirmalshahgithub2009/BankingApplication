/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { AxiosError } from 'axios';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { mapApiError, logErrorForMonitoring, isAuthError } from './error.mapper';
import { TokenManager } from './tokenManager';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
  ApiError,
  AuthTokens,
  User,
} from './types';

// ==================== Auth API Service ====================
export class AuthApi {
  /**
   * Login with email and password
   */
  static async login(request: LoginRequest): Promise<{
    user: User;
    tokens: AuthTokens;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        request
      );

      const { data } = response.data;

      if (!data) {
        throw new Error('No data in response');
      }

      // Save tokens to secure storage
      await TokenManager.saveTokens(data.tokens);

      return {
        user: data.user,
        tokens: data.tokens,
      };
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Sign up with email, password, and user details
   */
  static async signup(request: SignupRequest): Promise<{
    user: User;
    tokens: AuthTokens;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        request
      );

      const { data } = response.data;

      if (!data) {
        throw new Error('No data in response');
      }

      // Save tokens to secure storage
      await TokenManager.saveTokens(data.tokens);

      return {
        user: data.user,
        tokens: data.tokens,
      };
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<ApiResponse<{ tokens: AuthTokens }>>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      const { data } = response.data;

      if (!data) {
        throw new Error('No data in response');
      }

      // Save new tokens to secure storage
      await TokenManager.saveTokens(data.tokens);

      return data.tokens;
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);

      // Clear tokens on refresh failure
      await TokenManager.clearTokens();

      throw apiError;
    }
  }

  /**
   * Logout (invalidate token on backend)
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      // Don't throw on logout error - still clear local tokens
    } finally {
      // Clear tokens from secure storage regardless of API response
      await TokenManager.clearTokens();
    }
  }

  /**
   * Verify email with OTP
   */
  static async verifyEmail(email: string, otp: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email, otp });
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      });
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      const apiError = mapApiError(error as AxiosError);
      logErrorForMonitoring(apiError);
      throw apiError;
    }
  }

  /**
   * Check authentication status (useful for app startup)
   */
  static async checkAuthStatus(): Promise<{ isAuthenticated: boolean }> {
    try {
      const hasTokens = await TokenManager.hasTokens();
      const isExpired = await TokenManager.isTokenExpired();

      return {
        isAuthenticated: hasTokens && !isExpired,
      };
    } catch (error) {
      console.error('[AuthApi] Failed to check auth status:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Validate current token
   */
  static async validateToken(): Promise<boolean> {
    try {
      const accessToken = await TokenManager.getAccessToken();

      if (!accessToken) {
        return false;
      }

      // Make a simple authenticated request to validate token
      await apiClient.get(API_ENDPOINTS.USER.GET_PROFILE);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      return !isAuthError(axiosError.response?.status || 0);
    }
  }
}

export default AuthApi;
