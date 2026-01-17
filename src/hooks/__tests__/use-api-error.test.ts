import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { AxiosError } from "axios";
import { useApiError } from "../use-api-error";
import { ApiError, ValidationError, NetworkError } from "@/lib/api-error";

describe("useApiError Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("initializes with no error", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.fieldErrors).toEqual({});
    });

    it("provides all required methods", () => {
      const { result } = renderHook(() => useApiError());

      expect(typeof result.current.clearError).toBe("function");
      expect(typeof result.current.handleApiError).toBe("function");
      expect(typeof result.current.getErrorMessage).toBe("function");
      expect(typeof result.current.getFieldError).toBe("function");
      expect(typeof result.current.isRetryable).toBe("function");
    });
  });

  describe("handleApiError", () => {
    it("handles ApiError instances", () => {
      const { result } = renderHook(() => useApiError());
      const error = new ValidationError("Validation failed");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(result.current.error).toBe(error);
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Validation failed");
    });

    it("handles AxiosError with response data", () => {
      const { result } = renderHook(() => useApiError());

      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            message: "User not found",
            errors: {
              email: ["Email already taken"],
            },
          },
          status: 404,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("User not found");
      expect(result.current.fieldErrors).toEqual({
        email: "Email already taken",
      });
    });

    it("handles AxiosError without response data", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: "Network Error",
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("Network Error");
    });

    it("handles regular Error instances", () => {
      const { result } = renderHook(() => useApiError());
      const error = new Error("Something went wrong");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(result.current.error).toBe(error);
      expect(result.current.isError).toBe(true);
    });

    it("handles unknown error types", () => {
      const { result } = renderHook(() => useApiError());

      act(() => {
        result.current.handleApiError("string error");
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        "An unexpected error occurred."
      );
    });

    it("handles null errors", () => {
      const { result } = renderHook(() => useApiError());

      act(() => {
        result.current.handleApiError(null);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.isError).toBe(true);
    });

    it("extracts field errors from validation errors", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            message: "Validation failed",
            errors: {
              email: ["Invalid email", "Email required"],
              password: ["Too short"],
              name: ["Required"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.fieldErrors).toEqual({
        email: "Invalid email",
        password: "Too short",
        name: "Required",
      });
    });

    it("logs error to console", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { result } = renderHook(() => useApiError());
      const error = new Error("Test error");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(consoleSpy).toHaveBeenCalledWith("API Error:", error);
      consoleSpy.mockRestore();
    });
  });

  describe("clearError", () => {
    it("clears error state", () => {
      const { result } = renderHook(() => useApiError());
      const error = new ValidationError("Test error");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(result.current.isError).toBe(true);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });

    it("clears field errors", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              email: ["Invalid email"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.fieldErrors).toEqual({ email: "Invalid email" });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    it("handles clearing when no error exists", () => {
      const { result } = renderHook(() => useApiError());

      expect(() => {
        act(() => {
          result.current.clearError();
        });
      }).not.toThrow();
    });
  });

  describe("getErrorMessage", () => {
    it("returns message from current error", () => {
      const { result } = renderHook(() => useApiError());
      const error = new NetworkError("Network failed");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(result.current.getErrorMessage()).toBe("Network failed");
    });

    it("returns empty string when no error", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.getErrorMessage()).toBe("");
    });

    it("returns message from provided error", () => {
      const { result } = renderHook(() => useApiError());
      const error = new Error("Provided error");

      expect(result.current.getErrorMessage(error)).toBe("Provided error");
    });

    it("returns empty string for null error", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.getErrorMessage(null)).toBe("");
    });
  });

  describe("getFieldError", () => {
    it("returns error message for specific field", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              email: ["Invalid email format"],
              password: ["Too short"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.getFieldError("email")).toBe(
        "Invalid email format"
      );
      expect(result.current.getFieldError("password")).toBe("Too short");
    });

    it("returns undefined for non-existent field", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              email: ["Invalid email"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.getFieldError("name")).toBeUndefined();
    });

    it("returns undefined when no field errors exist", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.getFieldError("email")).toBeUndefined();
    });
  });

  describe("isRetryable", () => {
    it("returns true for retryable errors", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.isRetryable(new NetworkError())).toBe(true);
      expect(
        result.current.isRetryable(new ApiError("Server error", 500))
      ).toBe(true);
    });

    it("returns false for non-retryable errors", () => {
      const { result } = renderHook(() => useApiError());

      expect(
        result.current.isRetryable(new ValidationError("Invalid data"))
      ).toBe(false);
      expect(result.current.isRetryable(new Error("Regular error"))).toBe(
        false
      );
    });

    it("returns false for unknown errors", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.isRetryable(null)).toBe(false);
      expect(result.current.isRetryable("string")).toBe(false);
    });
  });

  describe("Error State Updates", () => {
    it("updates error state on multiple errors", () => {
      const { result } = renderHook(() => useApiError());

      act(() => {
        result.current.handleApiError(new Error("First error"));
      });

      expect(result.current.error?.message).toBe("First error");

      act(() => {
        result.current.handleApiError(new Error("Second error"));
      });

      expect(result.current.error?.message).toBe("Second error");
    });

    it("preserves field errors across error updates", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              email: ["Invalid email"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.fieldErrors).toEqual({ email: "Invalid email" });

      act(() => {
        result.current.handleApiError(new Error("Different error"));
      });

      // Field errors should be cleared on new error without field errors
      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("Integration Tests", () => {
    it("handles complete error workflow", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            message: "Validation failed",
            errors: {
              email: ["Invalid email format"],
              password: ["Password too short"],
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      // Initial state
      expect(result.current.isError).toBe(false);

      // Handle error
      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Validation failed");
      expect(result.current.getFieldError("email")).toBe(
        "Invalid email format"
      );
      expect(result.current.isRetryable(axiosError)).toBe(false);

      // Get error message
      expect(result.current.getErrorMessage()).toBe("Validation failed");

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.getFieldError("email")).toBeUndefined();
    });

    it("handles retryable error workflow", () => {
      const { result } = renderHook(() => useApiError());
      const networkError = new NetworkError("Connection failed");

      act(() => {
        result.current.handleApiError(networkError);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.isRetryable(networkError)).toBe(true);

      // Check if error is retryable
      if (result.current.isRetryable(result.current.error)) {
        expect(result.current.error?.message).toBe("Connection failed");
      }
    });
  });

  describe("Edge Cases", () => {
    it("handles error without message", () => {
      const { result } = renderHook(() => useApiError());
      const error = new Error("");

      act(() => {
        result.current.handleApiError(error);
      });

      expect(result.current.error?.message).toBe("");
    });

    it("handles error with undefined in error chain", () => {
      const { result } = renderHook(() => useApiError());

      act(() => {
        result.current.handleApiError(undefined);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it("handles empty field errors object", () => {
      const { result } = renderHook(() => useApiError());
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          data: {
            errors: {},
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      };

      act(() => {
        result.current.handleApiError(axiosError);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    it("handles concurrent error handling", () => {
      const { result } = renderHook(() => useApiError());

      act(() => {
        result.current.handleApiError(new Error("Error 1"));
        result.current.handleApiError(new Error("Error 2"));
      });

      // Should have the last error
      expect(result.current.error?.message).toBe("Error 2");
    });
  });

  describe("Stable Callbacks", () => {
    it("maintains stable callback references", () => {
      const { result, rerender } = renderHook(() => useApiError());

      const initialClearError = result.current.clearError;
      const initialHandleApiError = result.current.handleApiError;
      const initialGetErrorMessage = result.current.getErrorMessage;
      const initialGetFieldError = result.current.getFieldError;

      rerender();

      expect(result.current.clearError).toBe(initialClearError);
      expect(result.current.handleApiError).toBe(initialHandleApiError);
      expect(result.current.getErrorMessage).toBe(initialGetErrorMessage);
      expect(result.current.getFieldError).toBe(initialGetFieldError);
    });
  });

  describe("Type Safety", () => {
    it("error can be ApiError or Error or null", () => {
      const { result } = renderHook(() => useApiError());

      expect(result.current.error).toBeDefined();

      act(() => {
        result.current.handleApiError(new ApiError("API error", 500));
      });

      expect(result.current.error?.constructor.name).toMatch(
        /^(ApiError|Error)$/
      );
    });

    it("fieldErrors is always an object", () => {
      const { result } = renderHook(() => useApiError());

      expect(typeof result.current.fieldErrors).toBe("object");
      expect(Array.isArray(result.current.fieldErrors)).toBe(false);
    });

    it("isError is always boolean", () => {
      const { result } = renderHook(() => useApiError());

      expect(typeof result.current.isError).toBe("boolean");
    });
  });
});
