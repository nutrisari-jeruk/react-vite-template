// Auth Feature Public API

// New react-query-auth based hooks
export {
  useUser,
  useLogin,
  useLogout,
  useRegister,
  AuthLoader,
  loginInputSchema,
  registerInputSchema,
} from "./lib/auth-provider";
export type { LoginInput, RegisterInput } from "./lib/auth-provider";

// Auth components
export { AuthGuard } from "./components/auth-guard";
export { LoginForm, RegisterForm } from "./components";

// Auth API
export {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  refreshToken,
} from "./api/auth-api";
export type {
  AuthResponse,
  LoginInput as ApiLoginInput,
  RegisterInput as ApiRegisterInput,
} from "./api/auth-api";

// Token storage utilities (kept for backward compatibility)
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

// Legacy hooks (deprecated - use useUser, useLogin, useLogout, useRegister instead)
export { useAuth, useTokenRefresh } from "./hooks/use-auth";

// Types
export type {
  JWTPayload,
  LoginResponse,
  LoginCredentials,
  RegisterCredentials,
  TokenRefreshResponse,
  UserSession,
  User,
} from "./types";
