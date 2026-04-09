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
} from "./lib/AuthProvider";
export type { LoginInput, RegisterInput } from "./lib/AuthProvider";

// Auth components
export { AuthGuard } from "./components/AuthGuard";
export {
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  ForgetPasswordForm,
  OtpForm,
} from "./components";

// Auth API
export {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  refreshToken,
  resetPassword,
  setNewPassword,
} from "./api/authApi";
export type {
  AuthResponse,
  LoginInput as ApiLoginInput,
  RegisterInput as ApiRegisterInput,
  ResetPasswordInput,
  ResetPasswordResponse,
  SetNewPasswordInput,
  SetNewPasswordResponse,
} from "./api/authApi";

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
} from "./lib/tokenStorage";

// Legacy hooks (deprecated - use useUser, useLogin, useLogout, useRegister instead)
export { useAuth, useTokenRefresh } from "./hooks/useAuth";

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
