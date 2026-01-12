import axios from "axios";
import { env } from "@/utils/env";
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
} from "./api-error";
import { getAccessToken, clearAuthTokens } from "./auth";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Generate a UUID v4 compatible string
 * Falls back to Math.random if crypto.randomUUID is not available
 */
function generateRequestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback UUID v4 generation
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracing
    config.headers["X-Request-ID"] = generateRequestId();

    return config;
  },
  (error) => {
    // Request error (e.g., network error before request is sent)
    if (error?.code === "ECONNABORTED") {
      return Promise.reject(new TimeoutError());
    }

    return Promise.reject(new NetworkError());
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) {
      // Not an Axios error (e.g., code error)
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData = error.response?.data as ApiResponse | undefined;

    // Network error (no response)
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new TimeoutError());
      }
      return Promise.reject(new NetworkError());
    }

    // Handle different status codes
    switch (status) {
      case 400:
      case 422:
        return Promise.reject(
          new ValidationError(
            responseData?.message || "Invalid request data.",
            responseData?.errors
          )
        );

      case 401:
        // Clear expired tokens
        clearAuthTokens();

        // Redirect to login (or trigger re-authentication flow)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(
          new UnauthorizedError(
            responseData?.message || "Session expired. Please log in again."
          )
        );

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
        // Rate limit error
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
        // Unknown error
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
