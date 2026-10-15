import axios from "axios";
import { env } from "@/config/env";
import { API_ENDPOINTS } from "@/config/constants";
import {
  isAxiosError,
  NetworkError,
  TimeoutError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  ServiceUnavailableError,
} from "./apiError";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  getSessionVersion,
  clearAuthTokens,
} from "./tokenStorage";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

function generateRequestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
});

export const refreshApi = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
});

// Track ongoing token refresh to prevent multiple concurrent refresh attempts
let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;
let refreshVersion = -1;

// Type extension to track retry attempts on requests
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _sessionVersion?: number;
  }
}

api.interceptors.request.use(
  (config) => {
    config._sessionVersion ??= getSessionVersion();
    const token = getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Request-ID"] = generateRequestId();

    return config;
  },
  (error) => {
    if (error?.code === "ECONNABORTED") {
      return Promise.reject(new TimeoutError());
    }

    return Promise.reject(new NetworkError());
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData = error.response?.data as ApiResponse | undefined;

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new TimeoutError());
      }
      return Promise.reject(new NetworkError());
    }

    switch (status) {
      case 400:
      case 422:
        return Promise.reject(
          new ValidationError(
            responseData?.message || "Invalid request data.",
            responseData?.errors
          )
        );

      case 401: {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(new UnauthorizedError());
        const url = originalRequest.url?.split("?")[0];
        const excluded = [
          API_ENDPOINTS.AUTH.LOGIN,
          API_ENDPOINTS.AUTH.REGISTER,
          API_ENDPOINTS.AUTH.REFRESH,
          API_ENDPOINTS.AUTH.LOGOUT,
        ].some((endpoint) => endpoint === url);
        const currentVersion = getSessionVersion();
        if (
          originalRequest._sessionVersion !== undefined &&
          originalRequest._sessionVersion !== currentVersion
        ) {
          return Promise.reject(new UnauthorizedError("Session changed."));
        }
        const refreshToken = getRefreshToken();
        if (excluded)
          return Promise.reject(new UnauthorizedError(responseData?.message));
        if (originalRequest._retry || !refreshToken) {
          clearAuthTokens();
          return Promise.reject(new UnauthorizedError(responseData?.message));
        }
        originalRequest._retry = true;
        if (!refreshPromise || refreshVersion !== currentVersion) {
          refreshVersion = currentVersion;
          const pending = refreshApi
            .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
              API_ENDPOINTS.AUTH.REFRESH,
              { refreshToken }
            )
            .then((response) => {
              const tokens = response.data.data;
              if (!tokens?.accessToken || !tokens.refreshToken)
                throw new UnauthorizedError("Invalid refresh response.");
              if (getSessionVersion() !== currentVersion)
                throw new UnauthorizedError("Session changed.");
              setAuthTokens(tokens.accessToken, tokens.refreshToken);
              return tokens;
            })
            .catch(() => {
              if (getSessionVersion() === currentVersion) clearAuthTokens();
              throw new UnauthorizedError(
                "Session expired. Please log in again."
              );
            })
            .finally(() => {
              if (refreshPromise === pending) refreshPromise = null;
            });
          refreshPromise = pending;
        }
        // Retry outside the refresh catch: a later 422/500 must retain its type.
        return refreshPromise.then((tokens) => {
          if (getSessionVersion() !== currentVersion)
            throw new UnauthorizedError("Session changed.");
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return api(originalRequest);
        });
      }

      case 403:
        return Promise.reject(
          new ForbiddenError(
            responseData?.message ||
              "You don't have permission to perform this action."
          )
        );

      case 404:
        return Promise.reject(
          new NotFoundError(
            responseData?.message || "The requested resource was not found."
          )
        );

      case 409:
        return Promise.reject(
          new ConflictError(
            responseData?.message ||
              "This resource conflicts with existing data."
          )
        );

      case 429: {
        const retryAfter = error.response.headers["retry-after"]
          ? parseInt(error.response.headers["retry-after"], 10)
          : undefined;
        return Promise.reject(
          new RateLimitError(
            responseData?.message ||
              "Too many requests. Please try again later.",
            retryAfter
          )
        );
      }

      case 500:
      case 502:
      case 504:
        return Promise.reject(
          new ServerError(
            responseData?.message || "Server error. Please try again later."
          )
        );

      case 503:
        return Promise.reject(
          new ServiceUnavailableError(
            responseData?.message || "Service temporarily unavailable."
          )
        );

      default:
        return Promise.reject(
          new Error(
            responseData?.message ||
              error.message ||
              "An unexpected error occurred."
          )
        );
    }
  }
);

export default api;
