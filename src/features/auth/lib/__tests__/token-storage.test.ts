import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  clearAuthTokens,
  setAuthTokens,
  isAuthenticated,
  parseJWT,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  tokenStorage,
} from "../token-storage";

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const mockConsoleError = vi.fn();

describe("Token Storage Utilities", () => {
  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    mockConsoleError.mockClear();
  });

  describe("localStorage Storage (Development)", () => {
    it("gets access token from localStorage", () => {
      localStorage.setItem("token", "test-access-token");
      const token = getAccessToken();
      expect(token).toBe("test-access-token");
    });

    it("returns null when access token does not exist", () => {
      const token = getAccessToken();
      expect(token).toBeNull();
    });

    it("sets access token in localStorage", () => {
      setAccessToken("new-access-token");
      expect(localStorage.getItem("token")).toBe("new-access-token");
    });

    it("gets refresh token from localStorage", () => {
      localStorage.setItem("refreshToken", "test-refresh-token");
      const token = getRefreshToken();
      expect(token).toBe("test-refresh-token");
    });

    it("returns null when refresh token does not exist", () => {
      const token = getRefreshToken();
      expect(token).toBeNull();
    });

    it("sets refresh token in localStorage", () => {
      setRefreshToken("new-refresh-token");
      expect(localStorage.getItem("refreshToken")).toBe("new-refresh-token");
    });

    it("removes access token from localStorage", () => {
      localStorage.setItem("token", "test-token");
      removeAccessToken();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("removes refresh token from localStorage", () => {
      localStorage.setItem("refreshToken", "test-refresh");
      removeRefreshToken();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });
  });

  describe("clearAuthTokens", () => {
    it("clears both access and refresh tokens", () => {
      localStorage.setItem("token", "access-token");
      localStorage.setItem("refreshToken", "refresh-token");

      clearAuthTokens();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    it("handles clearing when tokens do not exist", () => {
      expect(() => clearAuthTokens()).not.toThrow();
    });
  });

  describe("setAuthTokens", () => {
    it("sets both access and refresh tokens", () => {
      setAuthTokens("access-token", "refresh-token");

      expect(getAccessToken()).toBe("access-token");
      expect(getRefreshToken()).toBe("refresh-token");
    });

    it("sets only access token when refresh token is not provided", () => {
      setAuthTokens("access-token");

      expect(getAccessToken()).toBe("access-token");
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when access token exists", () => {
      localStorage.setItem("token", "valid-token");
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when access token does not exist", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns false when only refresh token exists", () => {
      localStorage.setItem("refreshToken", "refresh-token");
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("parseJWT", () => {
    it("parses valid JWT token", () => {
      // Create a valid JWT-like token (header.payload.signature)
      const payload = btoa(JSON.stringify({ userId: "123", exp: 1234567890 }));
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const token = `${header}.${payload}.signature`;

      const result = parseJWT(token);
      expect(result).toEqual({ userId: "123", exp: 1234567890 });
    });

    it("parses JWT with base64url encoding", () => {
      // Test with proper base64url encoding (replacing - and _)
      const payload = JSON.stringify({ userId: "456", role: "admin" });
      const base64UrlPayload = btoa(payload)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const header = btoa(JSON.stringify({ alg: "HS256" }))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const token = `${header}.${base64UrlPayload}.signature`;

      const result = parseJWT(token);
      expect(result).toEqual({ userId: "456", role: "admin" });
    });

    it("returns null for invalid token", () => {
      expect(parseJWT("invalid-token")).toBeNull();
    });

    it("returns null for malformed token", () => {
      expect(parseJWT("not.a.jwt")).toBeNull();
      expect(parseJWT("only-two-parts")).toBeNull();
    });

    it("returns null for token with invalid JSON", () => {
      const token = `header.${btoa("invalid-json")}.signature`;
      expect(parseJWT(token)).toBeNull();
    });
  });

  describe("getTokenExpiration", () => {
    it("returns expiration timestamp for valid token", () => {
      const expTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      const expiration = getTokenExpiration(token);
      expect(expiration).toBe(expTime * 1000); // Converted to milliseconds
    });

    it("returns null for token without exp claim", () => {
      const payload = btoa(JSON.stringify({ userId: "123" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(getTokenExpiration(token)).toBeNull();
    });

    it("returns null for invalid token", () => {
      expect(getTokenExpiration("invalid")).toBeNull();
    });

    it("returns null for token with invalid exp type", () => {
      const payload = btoa(JSON.stringify({ exp: "not-a-number" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(getTokenExpiration(token)).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("returns true for expired token", () => {
      const expTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenExpired(token)).toBe(true);
    });

    it("returns false for valid token", () => {
      const expTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenExpired(token)).toBe(false);
    });

    it("returns false for token without exp claim", () => {
      const payload = btoa(JSON.stringify({ userId: "123" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(isTokenExpired(token)).toBe(false);
    });

    it("returns false for invalid token", () => {
      expect(isTokenExpired("invalid")).toBe(false);
    });
  });

  describe("getTimeUntilExpiration", () => {
    it("returns milliseconds until expiration for valid token", () => {
      const expTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      const timeLeft = getTimeUntilExpiration(token);
      expect(timeLeft).toBeGreaterThan(0);
      expect(timeLeft).toBeLessThanOrEqual(3600 * 1000 + 1000); // Within 1 hour + 1s tolerance
    });

    it("returns negative value for expired token", () => {
      const expTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      const timeLeft = getTimeUntilExpiration(token);
      expect(timeLeft).toBeLessThan(0);
    });

    it("returns null for token without exp claim", () => {
      const payload = btoa(JSON.stringify({ userId: "123" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      expect(getTimeUntilExpiration(token)).toBeNull();
    });

    it("returns null for invalid token", () => {
      expect(getTimeUntilExpiration("invalid")).toBeNull();
    });
  });

  describe("Token Storage Interface", () => {
    it("uses tokenStorage interface consistently", () => {
      tokenStorage.setToken("test-key", "test-value");
      const retrieved = tokenStorage.getToken("test-key");

      expect(retrieved).toBe("test-value");

      tokenStorage.removeToken("test-key");
      expect(tokenStorage.getToken("test-key")).toBeNull();
    });

    it("handles special characters in token values", () => {
      const specialToken = "token.with-dashes_and_underscores";
      setAccessToken(specialToken);
      expect(getAccessToken()).toBe(specialToken);
    });

    it("handles unicode characters in token values", () => {
      const unicodeToken = "token-🔐-test";
      setAccessToken(unicodeToken);
      expect(getAccessToken()).toBe(unicodeToken);
    });
  });

  describe("Error Handling", () => {
    it("handles localStorage quota exceeded gracefully", () => {
      // Mock localStorage.setItem to throw quota error
      const setItemMock = vi.fn(() => {
        throw new Error("QuotaExceededError");
      });

      const setItemSpy = vi
        .spyOn(localStorage, "setItem")
        .mockImplementation(setItemMock);

      // Should not throw, error is caught and logged
      expect(() => setAccessToken("large-token")).not.toThrow();

      setItemSpy.mockRestore();
    });

    it("handles localStorage.getItem errors gracefully", () => {
      const getItemMock = vi.fn(() => {
        throw new Error("Storage error");
      });
      const getItemSpy = vi
        .spyOn(localStorage, "getItem")
        .mockImplementation(getItemMock);

      expect(getAccessToken()).toBeNull();

      getItemSpy.mockRestore();
    });

    it("handles localStorage.removeItem errors gracefully", () => {
      const removeItemMock = vi.fn(() => {
        throw new Error("Storage error");
      });

      const removeItemSpy = vi
        .spyOn(localStorage, "removeItem")
        .mockImplementation(removeItemMock);

      // Should not throw, error is caught and logged
      expect(() => removeAccessToken()).not.toThrow();

      removeItemSpy.mockRestore();
    });
  });

  describe("SSR Safety", () => {
    it("handles missing window object gracefully", () => {
      // Save original window
      const originalWindow = global.window;

      // @ts-expect-error - Simulate SSR environment
      delete global.window;

      expect(() => {
        getAccessToken();
        setAccessToken("test");
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    it("handles missing document object gracefully", () => {
      const originalDocument = global.document;

      // @ts-expect-error - Simulate SSR environment
      delete global.document;

      expect(() => getAccessToken()).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe("Integration Tests", () => {
    it("handles complete authentication flow", () => {
      expect(isAuthenticated()).toBe(false);

      setAuthTokens("access-token", "refresh-token");

      expect(isAuthenticated()).toBe(true);
      expect(getAccessToken()).toBe("access-token");
      expect(getRefreshToken()).toBe("refresh-token");

      clearAuthTokens();

      expect(isAuthenticated()).toBe(false);
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });

    it("checks token expiration in flow", () => {
      const expTime = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now
      const payload = btoa(JSON.stringify({ exp: expTime, userId: "user123" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      setAccessToken(token);

      expect(isAuthenticated()).toBe(true);
      expect(isTokenExpired(token)).toBe(false);
      const timeLeft = getTimeUntilExpiration(token);
      expect(timeLeft).toBeGreaterThan(0);
      expect(timeLeft).toBeLessThanOrEqual(1800 * 1000 + 1000);
    });
  });
});
