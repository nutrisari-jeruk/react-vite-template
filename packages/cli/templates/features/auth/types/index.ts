/**
 * Authentication Types
 */

export type { User } from "./user";

export interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  iat: number;
  exp: number;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserSession {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  } | null;
}
