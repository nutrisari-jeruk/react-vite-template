/**
 * useAuth Hook
 * Provides authentication state and methods
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  getTimeUntilExpiration,
  isTokenExpired,
} from "@/lib/auth";

interface UseAuthResult {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  tokenExpiresIn: number | null;
  isTokenExpired: boolean;
}

export function useAuth(): UseAuthResult {
  const navigate = useNavigate();
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const token = getAccessToken();
    const refresh = getRefreshToken();
    setAccessTokenState(token);
    setRefreshTokenState(refresh);
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(
    (accessTokenValue: string, refreshTokenValue?: string) => {
      setAuthTokens(accessTokenValue, refreshTokenValue);
      setAccessTokenState(accessTokenValue);
      setRefreshTokenState(refreshTokenValue || null);
    },
    []
  );

  // Logout function
  const logout = useCallback(() => {
    clearAuthTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    navigate("/login");
  }, [navigate]);

  // Get token expiration (getTimeUntilExpiration is used internally)
  // Note: getTokenExpiration is exported from auth.ts for external use
  const tokenExpiresIn = accessToken
    ? getTimeUntilExpiration(accessToken)
    : null;

  const isAccessTokenExpired = accessToken ? isTokenExpired(accessToken) : true;

  return {
    isAuthenticated: isAuthenticated(),
    accessToken,
    refreshToken,
    isLoading,
    login,
    logout,
    tokenExpiresIn,
    isTokenExpired: isAccessTokenExpired,
  };
}

/**
 * Hook to check if user needs token refresh
 */
export function useTokenRefresh(): {
  shouldRefresh: boolean;
  refresh: () => Promise<void>;
} {
  const { accessToken } = useAuth();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setShouldRefresh(false);
      return;
    }

    // Check if token expires in less than 5 minutes
    const expiresIn = getTimeUntilExpiration(accessToken);
    if (expiresIn !== null && expiresIn < 5 * 60 * 1000) {
      setShouldRefresh(true);
    } else {
      setShouldRefresh(false);
    }
  }, [accessToken]);

  const refresh = useCallback(async () => {
    try {
      // TODO: Implement token refresh logic with your backend
      // const response = await api.post('/auth/refresh', { refreshToken })
      // const { accessToken: newToken, refreshToken: newRefreshToken } = response.data
      // login(newToken, newRefreshToken)
      setShouldRefresh(false);
    } catch (error) {
      console.error("Token refresh failed:", error);
      // On refresh failure, logout user
      const { logout } = useAuth();
      logout();
    }
  }, []);

  return {
    shouldRefresh,
    refresh,
  };
}

// Re-export auth utilities for external use
export {
  getTokenExpiration,
  getTimeUntilExpiration,
  isTokenExpired,
  isAuthenticated,
  parseJWT,
  tokenStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  clearAuthTokens,
  setAuthTokens,
} from "@/lib/auth";
