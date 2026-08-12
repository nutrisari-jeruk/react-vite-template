/**
 * useAuth Hook
 * Provides authentication state and methods
 */

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated as checkIsAuthenticated,
  getTimeUntilExpiration,
  isTokenExpired as checkIsTokenExpired,
} from "../lib/tokenStorage";

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
  // Lazy initialization: read from localStorage on mount
  const [accessToken, setAccessTokenState] = useState<string | null>(() =>
    getAccessToken()
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(() =>
    getRefreshToken()
  );

  const login = useCallback(
    (accessTokenValue: string, refreshTokenValue?: string) => {
      setAuthTokens(accessTokenValue, refreshTokenValue);
      setAccessTokenState(accessTokenValue);
      setRefreshTokenState(refreshTokenValue || null);
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    navigate("/login");
  }, [navigate]);

  const tokenExpiresIn = accessToken
    ? getTimeUntilExpiration(accessToken)
    : null;

  const isAccessTokenExpired = accessToken
    ? checkIsTokenExpired(accessToken)
    : true;

  return {
    isAuthenticated: checkIsAuthenticated(),
    accessToken,
    refreshToken,
    isLoading: false, // localStorage is synchronous, no loading state needed
    login,
    logout,
    tokenExpiresIn,
    isTokenExpired: isAccessTokenExpired,
  };
}

export function useTokenRefresh(): {
  shouldRefresh: boolean;
  refresh: () => Promise<void>;
} {
  const { accessToken } = useAuth();

  // Calculate derived state during render instead of in useEffect
  const shouldRefresh = useMemo(() => {
    if (!accessToken) {
      return false;
    }

    const expiresIn = getTimeUntilExpiration(accessToken);
    return expiresIn !== null && expiresIn < 5 * 60 * 1000;
  }, [accessToken]);

  const refresh = useCallback(async () => {
    try {
      // Token refresh logic would go here
      // After successful refresh, shouldRefresh will automatically update
      // based on the new accessToken expiration time
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }, []);

  return {
    shouldRefresh,
    refresh,
  };
}
