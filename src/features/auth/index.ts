// Auth Feature Public API
export { useAuth, useTokenRefresh } from "./hooks/use-auth";
export { AuthGuard } from "./components/auth-guard";
export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  parseJWT,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  tokenStorage,
} from "./lib/token-storage";
export type {
  JWTPayload,
  LoginResponse,
  LoginCredentials,
  RegisterCredentials,
  TokenRefreshResponse,
  UserSession,
} from "./types";
