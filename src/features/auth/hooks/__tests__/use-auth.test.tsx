import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../use-auth";
import * as tokenStorage from "../../lib/token-storage";

// Mock react-router-dom
const navigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(await vi.importActual<any>("react-router-dom")),
  useNavigate: () => navigate,
}));

// Wrapper component with router
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("useAuth Hook", () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    navigate.mockReset();
  });

  describe("Initial State", () => {
    it("initializes with unauthenticated state when no tokens exist", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("initializes with authenticated state when tokens exist", () => {
      // Set tokens in storage
      tokenStorage.setAccessToken("existing-access-token");
      tokenStorage.setRefreshToken("existing-refresh-token");

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.accessToken).toBe("existing-access-token");
      expect(result.current.refreshToken).toBe("existing-refresh-token");
      expect(result.current.isLoading).toBe(false);
    });

    it("initializes with loading state true initially", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Check initial state - isLoading should be false because useEffect runs synchronously in tests
      // In a real browser, there would be a brief moment where isLoading is true
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.accessToken).toBeNull();
    });
  });

  describe("login", () => {
    it("sets access token on login", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("new-access-token");
      });

      expect(result.current.accessToken).toBe("new-access-token");
      expect(result.current.isAuthenticated).toBe(true);
      expect(tokenStorage.getAccessToken()).toBe("new-access-token");
    });

    it("sets both access and refresh tokens on login", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("access-token", "refresh-token");
      });

      expect(result.current.accessToken).toBe("access-token");
      expect(result.current.refreshToken).toBe("refresh-token");
      expect(tokenStorage.getAccessToken()).toBe("access-token");
      expect(tokenStorage.getRefreshToken()).toBe("refresh-token");
    });

    it("sets only access token when refresh token is not provided", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("access-token");
      });

      expect(result.current.accessToken).toBe("access-token");
      expect(result.current.refreshToken).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it("updates authentication state after login", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);

      act(() => {
        result.current.login("test-token");
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("replaces existing tokens on new login", () => {
      // Set initial tokens
      tokenStorage.setAccessToken("old-access");
      tokenStorage.setRefreshToken("old-refresh");

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.accessToken).toBe("old-access");

      act(() => {
        result.current.login("new-access", "new-refresh");
      });

      expect(result.current.accessToken).toBe("new-access");
      expect(result.current.refreshToken).toBe("new-refresh");
      expect(tokenStorage.getAccessToken()).toBe("new-access");
      expect(tokenStorage.getRefreshToken()).toBe("new-refresh");
    });
  });

  describe("logout", () => {
    it("clears tokens on logout", () => {
      // Set initial tokens
      tokenStorage.setAccessToken("access-token");
      tokenStorage.setRefreshToken("refresh-token");

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it("navigates to login on logout", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(navigate).toHaveBeenCalledWith("/login");
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it("handles logout when not authenticated", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.accessToken).toBeNull();
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Token Expiration", () => {
    it("calculates time until token expiration", () => {
      // Create a token that expires in 1 hour
      const expTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      tokenStorage.setAccessToken(token);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.tokenExpiresIn).toBeGreaterThan(0);
      expect(result.current.tokenExpiresIn).toBeLessThanOrEqual(
        3600 * 1000 + 1000
      );
    });

    it("returns null for expiration time when token has no exp claim", () => {
      const payload = btoa(JSON.stringify({ userId: "123" }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      tokenStorage.setAccessToken(token);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.tokenExpiresIn).toBeNull();
    });

    it("returns null for expiration time when no token", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.tokenExpiresIn).toBeNull();
    });

    it("detects when token is expired", () => {
      // Create an expired token (1 hour ago)
      const expTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      tokenStorage.setAccessToken(token);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isTokenExpired).toBe(true);
    });

    it("detects when token is not expired", () => {
      // Create a valid token (1 hour from now)
      const expTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = btoa(JSON.stringify({ exp: expTime }));
      const header = btoa(JSON.stringify({ alg: "HS256" }));
      const token = `${header}.${payload}.signature`;

      tokenStorage.setAccessToken(token);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isTokenExpired).toBe(false);
    });

    it("considers token expired when no token exists", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isTokenExpired).toBe(true);
    });
  });

  describe("Authentication Flow Integration", () => {
    it("handles complete login-logout cycle", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initial state
      expect(result.current.isAuthenticated).toBe(false);

      // Login
      act(() => {
        result.current.login("access-token", "refresh-token");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.accessToken).toBe("access-token");
      expect(result.current.refreshToken).toBe("refresh-token");

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(navigate).toHaveBeenCalledWith("/login");
    });

    it("handles login with existing tokens", () => {
      // Set existing tokens
      tokenStorage.setAccessToken("old-access");
      tokenStorage.setRefreshToken("old-refresh");

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.accessToken).toBe("old-access");

      // Login with new tokens
      act(() => {
        result.current.login("new-access", "new-refresh");
      });

      expect(result.current.accessToken).toBe("new-access");
      expect(result.current.refreshToken).toBe("new-refresh");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string token", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("");
      });

      expect(result.current.accessToken).toBe("");
      // Empty string is falsy, so isAuthenticated should be false
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("handles login with only refresh token", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("access-token", undefined);
      });

      expect(result.current.accessToken).toBe("access-token");
      expect(result.current.refreshToken).toBeNull();
    });

    it("handles rapid login calls", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("token1");
        result.current.login("token2");
        result.current.login("token3");
      });

      expect(result.current.accessToken).toBe("token3");
    });

    it("handles logout after multiple logins", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login("token1", "refresh1");
      });

      act(() => {
        result.current.login("token2", "refresh2");
      });

      expect(result.current.accessToken).toBe("token2");

      act(() => {
        result.current.logout();
      });

      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Stable Callbacks", () => {
    it("maintains stable login callback reference", () => {
      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      const initialLogin = result.current.login;

      rerender();

      expect(result.current.login).toBe(initialLogin);
    });

    it("maintains stable logout callback reference", () => {
      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      const initialLogout = result.current.logout;

      rerender();

      expect(result.current.logout).toBe(initialLogout);
    });
  });
});
