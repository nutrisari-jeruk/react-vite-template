/**
 * Authentication & Token Management
 * Secure token storage utility supporting cookies and localStorage
 */

import { env } from "@/utils/env";

// Token storage interface
export interface TokenStorage {
  getToken: (key: string) => string | null;
  setToken: (key: string, value: string, options?: CookieOptions) => void;
  removeToken: (key: string) => void;
}

interface CookieOptions {
  expires?: number; // Days until expiration
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * LocalStorage implementation (fallback, less secure)
 */
const localStorageStorage: TokenStorage = {
  getToken: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setToken: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to set localStorage item:", error);
    }
  },

  removeToken: (key: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove localStorage item:", error);
    }
  },
};

/**
 * Cookie implementation (more secure when httpOnly is true)
 */
const cookieStorage: TokenStorage = {
  getToken: (key: string) => {
    if (typeof document === "undefined") return null;
    try {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
      const cookie = cookies.find((c) => c.startsWith(`${key}=`));
      return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    } catch {
      return null;
    }
  },

  setToken: (key: string, value: string, options: CookieOptions = {}) => {
    if (typeof document === "undefined") return;

    const expires = options.expires
      ? new Date(
          Date.now() + options.expires * 24 * 60 * 60 * 1000
        ).toUTCString()
      : "";

    const cookieParts = [
      `${key}=${encodeURIComponent(value)}`,
      expires ? `expires=${expires}` : "",
      options.path ? `path=${options.path}` : "path=/",
      options.domain ? `domain=${options.domain}` : "",
      options.secure ? "secure" : "",
      options.httpOnly ? "httpOnly" : "",
      options.sameSite ? `samesite=${options.sameSite}` : "samesite=lax",
    ].filter(Boolean);

    try {
      document.cookie = cookieParts.join("; ");
    } catch (error) {
      console.error("Failed to set cookie:", error);
      // Fallback to localStorage if cookies fail
      localStorageStorage.setToken(key, value);
    }
  },

  removeToken: (key: string) => {
    if (typeof document === "undefined") return;
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch (error) {
      console.error("Failed to remove cookie:", error);
      // Also try to remove from localStorage
      localStorageStorage.removeToken(key);
    }
  },
};

/**
 * Select storage method based on environment
 * Note: httpOnly cookies can only be set by the server
 * This utility supports both cookie and localStorage storage
 */
export const tokenStorage: TokenStorage =
  env.appEnv === "production" ? cookieStorage : localStorageStorage;

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return tokenStorage.getToken(env.authTokenKey);
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  return tokenStorage.getToken(env.authRefreshTokenKey);
}

/**
 * Set access token
 */
export function setAccessToken(token: string, options?: CookieOptions): void {
  tokenStorage.setToken(env.authTokenKey, token, options);
}

/**
 * Set refresh token
 */
export function setRefreshToken(token: string, options?: CookieOptions): void {
  tokenStorage.setToken(env.authRefreshTokenKey, token, options);
}

/**
 * Remove access token
 */
export function removeAccessToken(): void {
  tokenStorage.removeToken(env.authTokenKey);
}

/**
 * Remove refresh token
 */
export function removeRefreshToken(): void {
  tokenStorage.removeToken(env.authRefreshTokenKey);
}

/**
 * Clear all auth tokens
 */
export function clearAuthTokens(): void {
  removeAccessToken();
  removeRefreshToken();
}

/**
 * Set both access and refresh tokens
 */
export function setAuthTokens(
  accessToken: string,
  refreshToken?: string,
  options?: CookieOptions
): void {
  setAccessToken(accessToken, options);
  if (refreshToken) {
    setRefreshToken(refreshToken, options);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Parse JWT token to get payload (for basic info)
 * Note: This doesn't validate the token
 */
export function parseJWT<T = Record<string, unknown>>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get token expiration time (from JWT payload)
 */
export function getTokenExpiration(token: string): number | null {
  const payload = parseJWT(token);
  return payload && typeof payload.exp === "number" ? payload.exp * 1000 : null;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  return Date.now() >= expiration;
}

/**
 * Get time until token expires (in milliseconds)
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expiration = getTokenExpiration(token);
  if (!expiration) return null;
  return expiration - Date.now();
}
