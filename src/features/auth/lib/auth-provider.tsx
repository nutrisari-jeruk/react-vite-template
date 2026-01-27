/**
 * Auth Provider using react-query-auth
 *
 * This configures the authentication system using react-query-auth
 * and provides hooks for managing authentication state.
 */

import { configureAuth } from "react-query-auth";
import { z } from "zod";
import {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from "../api/auth-api";
import type { User } from "../types/user";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
} from "../lib/token-storage";

// Validation schemas
export const loginInputSchema = z.object({
  username: z.string().min(1, "NIP / NIK wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const registerInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;

// Auth configuration for react-query-auth
const authConfig = {
  // Function to get current user
  // Throws when not authenticated - react-query-auth handles this
  userFn: async (): Promise<User> => {
    const user = await getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }
    return user;
  },

  // Login function - stores tokens and returns user
  loginFn: async (data: LoginInput): Promise<User> => {
    const response = await loginWithEmailAndPassword(data);

    // Store tokens
    setAccessToken(response.accessToken);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }

    return response.user;
  },

  // Register function - stores tokens and returns user
  registerFn: async (data: RegisterInput): Promise<User> => {
    const response = await registerWithEmailAndPassword(data);

    // Store tokens
    setAccessToken(response.accessToken);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }

    return response.user;
  },

  // Logout function - clears tokens
  logoutFn: async (): Promise<void> => {
    await logout();
    clearAuthTokens();
  },
};

// Configure and export auth hooks and components
export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);
