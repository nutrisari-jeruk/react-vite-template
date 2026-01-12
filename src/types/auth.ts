/**
 * Authentication Types
 * Type definitions for authentication and tokens
 */

/**
 * JWT Token payload
 */
export interface JWTPayload {
  sub: string; // Subject (user ID)
  email?: string;
  name?: string;
  iat: number; // Issued at
  exp: number; // Expiration time
  roles?: string[];
  permissions?: string[];
}

/**
 * Login response
 */
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

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register credentials
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * User session information
 */
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
