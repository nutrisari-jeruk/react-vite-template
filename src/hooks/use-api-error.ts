/**
 * useApiError Hook
 * Provides utilities for handling API errors with user feedback
 */

import { useState, useCallback } from "react";
import {
  ApiError,
  isAxiosError,
  getErrorMessage,
  getFieldErrors,
  isRetryableError,
} from "@/lib/api-error";

interface UseApiErrorResult {
  error: ApiError | Error | null;
  fieldErrors: Record<string, string>;
  isError: boolean;
  clearError: () => void;
  handleApiError: (error: unknown) => void;
  getErrorMessage: (error?: unknown) => string;
  getFieldError: (field: string) => string | undefined;
  isRetryable: (error: unknown) => boolean;
}

export function useApiError(): UseApiErrorResult {
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const handleApiError = useCallback((error: unknown) => {
    const errors = getFieldErrors(error);
    if (errors) {
      setFieldErrors(errors);
    } else {
      // Clear field errors if the new error doesn't have field errors
      setFieldErrors({});
    }

    if (error instanceof Error) {
      setError(error);
    } else if (error !== null && isAxiosError(error)) {
      const message = getErrorMessage(error);
      setError(new Error(message));
    } else if (error !== null) {
      setError(new Error(getErrorMessage(error)));
    } else {
      setError(new Error("An unexpected error occurred."));
    }

    console.error("API Error:", error);
  }, []);

  const getErrorMessageCallback = useCallback(
    (err?: unknown) => {
      if (err) {
        return getErrorMessage(err);
      }
      return error ? getErrorMessage(error) : "";
    },
    [error]
  );

  const getFieldError = useCallback(
    (field: string) => {
      return fieldErrors[field];
    },
    [fieldErrors]
  );

  return {
    error,
    fieldErrors,
    isError: error !== null,
    clearError,
    handleApiError,
    getErrorMessage: getErrorMessageCallback,
    getFieldError,
    isRetryable: isRetryableError,
  };
}
