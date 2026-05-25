/**
 * Authentication & Token Management
 * Secure token storage utility supporting cookies and localStorage
 */

import { env } from "@/config/env";

export interface TokenStorage {
  getToken: (key: string) => string | null;
  setToken: (key: string, value: string, options?: CookieOptions) => void;
  removeToken: (key: string) => void;
}

interface CookieOptions {
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

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

export const cookieStorage: TokenStorage = {
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
      localStorageStorage.setToken(key, value);
    }
  },

  removeToken: (key: string) => {
    if (typeof document === "undefined") return;
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch (error) {
      console.error("Failed to remove cookie:", error);
      localStorageStorage.removeToken(key);
    }
  },
};

export const tokenStorage: TokenStorage =
  env.appEnv === "production" ? cookieStorage : localStorageStorage;

export function getAccessToken(): string | null {
  return tokenStorage.getToken(env.authTokenKey);
}

export function getRefreshToken(): string | null {
  return tokenStorage.getToken(env.authRefreshTokenKey);
}

export function setAccessToken(token: string, options?: CookieOptions): void {
  tokenStorage.setToken(env.authTokenKey, token, options);
}

export function setRefreshToken(token: string, options?: CookieOptions): void {
  tokenStorage.setToken(env.authRefreshTokenKey, token, options);
}

export function removeAccessToken(): void {
  tokenStorage.removeToken(env.authTokenKey);
}

export function removeRefreshToken(): void {
  tokenStorage.removeToken(env.authRefreshTokenKey);
}

export function clearAuthTokens(): void {
  removeAccessToken();
  removeRefreshToken();
}

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

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

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

export function getTokenExpiration(token: string): number | null {
  const payload = parseJWT(token);
  return payload && typeof payload.exp === "number" ? payload.exp * 1000 : null;
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  return Date.now() >= expiration;
}

export function getTimeUntilExpiration(token: string): number | null {
  const expiration = getTokenExpiration(token);
  if (!expiration) return null;
  return expiration - Date.now();
}
