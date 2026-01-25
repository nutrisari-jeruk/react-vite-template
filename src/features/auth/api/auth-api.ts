/**
 * Auth API functions for react-query-auth integration
 */

import { api, type ApiResponse } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import type { User } from "../types/user";

/**
 * Login response from API
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

/**
 * Get current user from API
 * Returns null if not authenticated (401) instead of throwing
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    if (!response.data.data) {
      return null;
    }
    return response.data.data;
  } catch (error) {
    // Return null for 401 Unauthorized (not logged in)
    // Re-throw other errors
    if (error && typeof error === "object" && "status" in error) {
      if (error.status === 401 || error.status === 403) {
        return null;
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
  email: string;
  password: string;
}

/**
 * Register input schema types
 */
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
