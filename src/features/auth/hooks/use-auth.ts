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
  isAuthenticated as checkIsAuthenticated,
  getTimeUntilExpiration,
  isTokenExpired as checkIsTokenExpired,
} from "../lib/token-storage";

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

  useEffect(() => {
    const token = getAccessToken();
    const refresh = getRefreshToken();
    setAccessTokenState(token);
    setRefreshTokenState(refresh);
    setIsLoading(false);
  }, []);

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
    isLoading,
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
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setShouldRefresh(false);
      return;
    }

    const expiresIn = getTimeUntilExpiration(accessToken);
    if (expiresIn !== null && expiresIn < 5 * 60 * 1000) {
      setShouldRefresh(true);
    } else {
      setShouldRefresh(false);
    }
  }, [accessToken]);

  const refresh = useCallback(async () => {
    try {
      setShouldRefresh(false);
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }, []);

  return {
    shouldRefresh,
    refresh,
  };
}
