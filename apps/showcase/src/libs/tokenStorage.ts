/**
 * Authentication & Token Management
 *
 * Stores Bearer authentication tokens in localStorage.
 * Note: Tokens stored in localStorage are accessible to JavaScript on the page and are
 * therefore exposed to Cross-Site Scripting (XSS) attacks. They are not HttpOnly cookies.
 */

import { env } from "@/config/env";

export interface TokenStorage {
  getToken: (key: string) => string | null;
  setToken: (key: string, value: string) => void;
  removeToken: (key: string) => void;
}

export const tokenStorage: TokenStorage = {
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

export function getAccessToken(): string | null {
  return tokenStorage.getToken(env.authTokenKey);
}

export function getRefreshToken(): string | null {
  return tokenStorage.getToken(env.authRefreshTokenKey);
}

export function setAccessToken(token: string): void {
  tokenStorage.setToken(env.authTokenKey, token);
}

export function setRefreshToken(token: string): void {
  tokenStorage.setToken(env.authRefreshTokenKey, token);
}

export function removeAccessToken(): void {
  tokenStorage.removeToken(env.authTokenKey);
}

export function removeRefreshToken(): void {
  tokenStorage.removeToken(env.authRefreshTokenKey);
}

const sessionClearedListeners = new Set<() => void>();

export function subscribeSessionCleared(listener: () => void): () => void {
  sessionClearedListeners.add(listener);
  return () => {
    sessionClearedListeners.delete(listener);
  };
}

let sessionVersion = 0;
export function getSessionVersion(): number {
  return sessionVersion;
}

export function clearAuthTokens(): void {
  sessionVersion++;
  if (typeof sessionStorage !== "undefined") {
    for (const key of [
      "otp_pending",
      "reset_otp_pending",
      "reset_password_token",
      "reset_password_identifier",
      "otp_countdown_remaining",
      "reset_otp_countdown_remaining",
    ])
      sessionStorage.removeItem(key);
  }
  removeAccessToken();
  removeRefreshToken();
  sessionClearedListeners.forEach((listener) => listener());
}

export function setAuthTokens(
  accessToken: string,
  refreshToken?: string
): void {
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function parseJWT<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  const payload = parseJWT<{ exp?: number }>(token);
  return typeof payload?.exp === "number" && !isNaN(payload.exp)
    ? payload.exp * 1000
    : null;
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return false;
  return Date.now() >= exp;
}

export function getTimeUntilExpiration(token: string): number | null {
  const exp = getTokenExpiration(token);
  if (!exp) return null;
  return exp - Date.now();
}
