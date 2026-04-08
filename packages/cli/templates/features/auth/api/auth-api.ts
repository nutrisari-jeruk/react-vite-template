/**
 * Auth API functions for react-query-auth integration
 */

import { api, type ApiResponse } from "@/lib/api-client";
import { isAxiosError } from "@/lib/api-error";
import { API_ENDPOINTS } from "@/config/constants";
import { getAccessToken, clearAuthTokens } from "../lib/token-storage";
import type { User } from "../types/user";

/**
 * OTP configuration from API
 */
export interface OtpConfig {
  isRequired: boolean;
  expiresIn: number; // Time in seconds until OTP expires
}

/**
 * Login response from API
 */
export interface AuthResponse {
  name: string;
  email: string;
  username: string;
  token: string;
  otp: OtpConfig;
}

/**
 * Get current user from API
 * Returns null if not authenticated (401) instead of throwing
 */
export const getUser = async (): Promise<User | null> => {
  // If there's no access token, return null immediately
  // This prevents unnecessary API calls and token refresh attempts
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    const userData = response.data.data;

    // Check for null, undefined, or empty object
    if (
      !userData ||
      typeof userData !== "object" ||
      Object.keys(userData).length === 0
    ) {
      return null;
    }

    // Validate required User fields
    if (!userData.id || !userData.email || !userData.username) {
      return null;
    }

    return userData;
  } catch (error) {
    // Return null for 401 Unauthorized (not logged in)
    // Re-throw other errors
    if (error && typeof error === "object") {
      // Check for ApiError instances (UnauthorizedError, ForbiddenError, etc.)
      if ("status" in error && (error.status === 401 || error.status === 403)) {
        // Clear invalid tokens so next check returns null immediately
        clearAuthTokens();
        return null;
      }
      // Check for AxiosError with 401/403 status
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          // Clear invalid tokens so next check returns null immediately
          clearAuthTokens();
          return null;
        }
      }
    }
    throw error;
  }
};

/**
 * Login with email and password
 */
export const loginWithEmailAndPassword = async (
  data: LoginInput
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );
  if (!response.data.data) {
    throw new Error("No auth data received");
  }
  return response.data.data;
};

/**
 * Register a new user
 */
export const registerWithEmailAndPassword = async (
  data: RegisterInput
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  if (!response.data.data) {
    throw new Error("No auth data received");
  }
  return response.data.data;
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  await api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  refreshTokenValue: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await api.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: refreshTokenValue });
  if (!response.data.data) {
    throw new Error("No token data received");
  }
  return response.data.data;
};

/**
 * Login input schema types
 */
export interface LoginInput {
  username: string;
  password: string;
}

/**
 * Reset password (forget-password) response from API
 */
export interface ResetPasswordResponse {
  otp: {
    isRequired: boolean;
    expiresIn: number;
  };
  /** Reset token for set-new-password; source TBD (e.g. email link) */
  resetToken?: string;
}

/**
 * Reset password input
 */
export interface ResetPasswordInput {
  username: string;
}

/**
 * Reset password
 */
export const resetPassword = async (
  data: ResetPasswordInput
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ApiResponse<ResetPasswordResponse>>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST,
    data
  );
  if (!response.data.data) {
    throw new Error("No reset password data received");
  }
  return response.data.data;
};

/**
 * Set new password input
 */
export interface SetNewPasswordInput {
  resetToken: string;
  password: string;
  passwordConfirmation: string;
}

/**
 * Set new password response
 */
export interface SetNewPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

/**
 * Set new password
 */
export const setNewPassword = async (
  data: SetNewPasswordInput
): Promise<SetNewPasswordResponse> => {
  const response = await api.post<ApiResponse<SetNewPasswordResponse>>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );
  // Backend returns data: null on success
  if (response.data.data === undefined) {
    throw new Error("No set new password response received");
  }
  return response.data.data;
};

/**
 * Register input schema types
 */
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  username?: string;
}

/**
 * OTP verification input
 */
export interface VerifyOtpInput {
  otp: string;
}

/**
 * OTP verification response
 */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  /**
   * For reset-password OTP flow, backend may return a resetToken
   * used to call set-new-password.
   */
  resetToken?: string;
}

/**
 * Resend OTP response
 */
export interface ResendOtpResponse {
  success: boolean;
  message: string;
  expiresIn: number; // Time in seconds until OTP expires
}

/**
 * Resend reset password OTP input
 */
export interface ResendResetPasswordOtpInput {
  purpose: "password_reset";
  identifier: string; // Username/NIP/NIK
}

/**
 * Resend reset password OTP response
 */
export interface ResendResetPasswordOtpResponse {
  otp: {
    isRequired: boolean;
    expiresIn: number; // Time in seconds until OTP expires
  };
}

/**
 * Validate reset password OTP input
 */
export interface ValidateResetPasswordOtpInput {
  otp: string;
  purpose: "password_reset";
  identifier: string;
}

/**
 * Validate reset password OTP response
 * Backend returns reset token in `identifier` field.
 */
export interface ValidateResetPasswordOtpResponse {
  identifier: string;
}

/**
 * Verify OTP code
 */
export const verifyOtp = async (
  data: VerifyOtpInput
): Promise<VerifyOtpResponse> => {
  const response = await api.post<ApiResponse<VerifyOtpResponse>>(
    API_ENDPOINTS.AUTH.VERIFY_OTP,
    data
  );
  if (!response.data.data) {
    throw new Error("No verification data received");
  }
  return response.data.data;
};

/**
 * Resend OTP code
 */
export const resendOtp = async (): Promise<ResendOtpResponse> => {
  const response = await api.post<ApiResponse<ResendOtpResponse>>(
    API_ENDPOINTS.AUTH.RESEND_OTP
  );
  if (!response.data.data) {
    throw new Error("No resend data received");
  }
  return response.data.data;
};

/**
 * Resend reset password OTP code
 */
export const resendResetPasswordOtp = async (
  data: ResendResetPasswordOtpInput
): Promise<ResendResetPasswordOtpResponse> => {
  const response = await api.post<ApiResponse<ResendResetPasswordOtpResponse>>(
    API_ENDPOINTS.AUTH.RESEND_RESET_PASSWORD_OTP,
    data
  );
  if (!response.data.data) {
    throw new Error("No resend reset password OTP data received");
  }
  return response.data.data;
};

/**
 * Validate reset password OTP code
 */
export const validateResetPasswordOtp = async (
  data: ValidateResetPasswordOtpInput
): Promise<ValidateResetPasswordOtpResponse> => {
  const response = await api.post<
    ApiResponse<ValidateResetPasswordOtpResponse>
  >(API_ENDPOINTS.AUTH.VALIDATE_RESET_PASSWORD_OTP, data);
  if (!response.data.data) {
    throw new Error("No validate reset password OTP data received");
  }
  return response.data.data;
};
