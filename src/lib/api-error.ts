/**
 * API Error Handling
 * Provides custom error classes and utilities for API error handling
 */

import type { AxiosError } from "axios";

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    status: number = 0,
    code: string = "API_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Network Error (no internet, timeout, etc.)
 */
export class NetworkError extends ApiError {
  constructor(
    message: string = "Network error. Please check your connection."
  ) {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends ApiError {
  constructor(message: string = "Request timed out. Please try again.") {
    super(message, 408, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

/**
 * Validation Error (400, 422)
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized. Please log in.") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = "Access denied.") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found.") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message: string = "Resource conflict. Please refresh.") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

/**
 * Too Many Requests Error (429)
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number;

  constructor(
    message: string = "Too many requests. Please try again later.",
    retryAfter?: number
  ) {
    super(message, 429, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * Server Error (500, 502, 503, 504)
 */
export class ServerError extends ApiError {
  constructor(message: string = "Server error. Please try again later.") {
    super(message, 500, "SERVER_ERROR");
    this.name = "ServerError";
  }
}

/**
 * Service Unavailable Error (503)
 */
export class ServiceUnavailableError extends ApiError {
  constructor(
    message: string = "Service temporarily unavailable. Please try again later."
  ) {
    super(message, 503, "SERVICE_UNAVAILABLE");
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Error details from API response
 */
interface ErrorDetails {
  message?: string;
  errors?: Record<string, string[]>;
  field?: string;
}

/**
 * Type guard to check if error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (isAxiosError(error)) {
    const responseData = error.response?.data as ErrorDetails | undefined;

    if (responseData?.message) {
      return responseData.message;
    }

    if (error.response?.statusText) {
      return error.response.statusText;
    }

    if (error.message) {
      return error.message;
    }

    return "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

/**
 * Extract field errors from validation error
 */
export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as ErrorDetails | undefined;

    if (responseData?.errors) {
      return Object.entries(responseData.errors).reduce(
        (acc, [field, messages]) => ({
          ...acc,
          [field]: messages[0],
        }),
        {} as Record<string, string>
      );
    }
  }

  return null;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  if (
    error instanceof ServerError ||
    error instanceof ServiceUnavailableError
  ) {
    return true;
  }

  if (error instanceof RateLimitError) {
    return true;
  }

  return false;
}
