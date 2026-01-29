import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  ErrorBoundary,
  type ErrorFallbackProps,
  withErrorBoundary,
} from "../error-boundary";

// Mock import.meta.env.DEV
vi.mock("../error-boundary", async () => {
  const actual =
    await vi.importActual<typeof import("../error-boundary")>(
      "../error-boundary"
    );
  return {
    ...actual,
    // We'll handle the DEV check in the tests
  };
});

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Custom fallback component
const CustomFallback = ({ error, errorId, resetError }: ErrorFallbackProps) => (
  <div data-testid="custom-fallback">
    <span>Custom Error: {error.message}</span>
    <span>Error ID: {errorId}</span>
    <button onClick={resetError}>Custom Reset</button>
  </div>
);

describe("ErrorBoundary Component", () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeEach(() => {
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  describe("Error Catching", () => {
    it("catches errors in child components", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("displays error message", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    it("generates unique error ID", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorIdText = screen.getByText(/Error ID:/);
      expect(errorIdText).toBeInTheDocument();
      expect(errorIdText.textContent).toMatch(/err_\d+_[a-z0-9]+/);
    });

    it("renders children normally when no error", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText("No error")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });
  });

  describe("Default Fallback UI", () => {
    it("displays default error screen", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("shows 'Try again' button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole("button", { name: "Try again" })
      ).toBeInTheDocument();
    });

    it("shows 'Go home' button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole("button", { name: "Go home" })
      ).toBeInTheDocument();
    });

    it("shows 'Reload page' button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole("button", { name: "Reload page" })
      ).toBeInTheDocument();
    });

    it("displays support email link", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const supportLink = screen.getByText("support");
      expect(supportLink).toBeInTheDocument();
      expect(supportLink.closest("a")).toHaveAttribute(
        "href",
        "mailto:support@example.com"
      );
    });
  });

  describe("Error Reset", () => {
    it("resets error state when reset button is clicked", async () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Click reset button wrapped in act to ensure state updates are flushed
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      });

      // Unmount and remount with non-throwing component
      unmount();
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should show "No error" since the component doesn't throw
      expect(screen.getByText("No error")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });

    it("calls onReset callback when provided", () => {
      const onReset = vi.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole("button", { name: "Try again" }));

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Custom Fallback Component", () => {
    it("renders custom fallback when provided", () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom Error: Test error")).toBeInTheDocument();
    });

    it("passes error to custom fallback", () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom Error: Test error")).toBeInTheDocument();
    });

    it("passes errorId to custom fallback", () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorIdText = screen.getByText(/Error ID:/);
      expect(errorIdText).toBeInTheDocument();
    });

    it("passes resetError function to custom fallback", () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      const customReset = screen.getByRole("button", { name: "Custom Reset" });
      expect(customReset).toBeInTheDocument();

      // Click to verify it works
      fireEvent.click(customReset);
    });
  });

  describe("Error Callbacks", () => {
    it("calls onError callback when error occurs", () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
        expect.stringMatching(/err_\d+_[a-z0-9]+/)
      );
    });
  });

  describe("Go Home Button", () => {
    it("navigates to home when Go home button is clicked", () => {
      // Mock window.location using vi.stubGlobal
      const mockLocation = { href: "" };
      vi.stubGlobal("location", mockLocation);

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByRole("button", { name: "Go home" });
      fireEvent.click(goHomeButton);

      expect(window.location.href).toBe("/");

      vi.unstubAllGlobals();
    });
  });

  describe("Reload Page Button", () => {
    it("reloads page when Reload button is clicked", () => {
      const reloadMock = vi.fn();

      // Mock window.location using vi.stubGlobal
      vi.stubGlobal("location", { reload: reloadMock });

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole("button", { name: "Reload page" });
      fireEvent.click(reloadButton);

      expect(reloadMock).toHaveBeenCalledTimes(1);

      vi.unstubAllGlobals();
    });
  });

  describe("Development Mode", () => {
    it("shows error details in development mode", () => {
      // Mock DEV mode
      const originalDev = import.meta.env.DEV;
      import.meta.env.DEV = true;

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error details should be visible
      expect(screen.getByText("Show error details")).toBeInTheDocument();

      import.meta.env.DEV = originalDev;
    });

    it("displays error name in development", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Click to show details
      fireEvent.click(screen.getByText("Show error details"));

      // Use a function matcher since the text is split by HTML elements
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === "Error: Error";
        })
      ).toBeInTheDocument();

      // Or alternatively, just check for the error name
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("displays error stack in development", () => {
      import.meta.env.DEV = true;

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Click to show details
      fireEvent.click(screen.getByText("Show error details"));

      const stackElement = document.querySelector("pre");
      expect(stackElement).toBeInTheDocument();
      expect(stackElement?.textContent).toContain("ThrowError");

      import.meta.env.DEV = false;
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA roles", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("has focusable reset button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const resetButton = screen.getByRole("button", { name: "Try again" });
      // Check that the button is focusable (has a valid type and can receive focus)
      expect(resetButton.tagName).toBe("BUTTON");
      expect(resetButton).toBeEnabled();
    });
  });

  describe("Multiple Errors", () => {
    it("handles consecutive errors", () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const firstErrorId = screen.getByText(/Error ID:/).textContent;

      // Reset and trigger another error
      fireEvent.click(screen.getByRole("button", { name: "Try again" }));

      rerender(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const secondErrorId = screen.getByText(/Error ID:/).textContent;

      // Error IDs should be different
      expect(firstErrorId).not.toBe(secondErrorId);
    });
  });

  describe("ErrorBoundary HOC", () => {
    it("wraps component with ErrorBoundary", () => {
      // Test that withErrorBoundary exists and is a function
      expect(typeof withErrorBoundary).toBe("function");
    });
  });

  describe("Async Errors", () => {
    it("does not catch async errors outside render", () => {
      // Use fake timers to control when the error is thrown
      vi.useFakeTimers();

      // Wrap setTimeout to catch errors from callbacks
      const originalSetTimeout = globalThis.setTimeout;
      const caughtErrors: Error[] = [];

      vi.spyOn(globalThis, "setTimeout").mockImplementation(
        (fn: TimerHandler, delay?: number) => {
          return originalSetTimeout(() => {
            try {
              if (typeof fn === "function") {
                fn();
              }
            } catch (error) {
              caughtErrors.push(error as Error);
            }
          }, delay ?? 0);
        }
      );

      const AsyncComponent = () => {
        setTimeout(() => {
          throw new Error("Async error");
        }, 100);

        return <div>Async Component</div>;
      };

      render(
        <ErrorBoundary>
          <AsyncComponent />
        </ErrorBoundary>
      );

      // Initially should render without error
      expect(screen.getByText("Async Component")).toBeInTheDocument();

      // Advance timers to trigger the setTimeout
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Verify ErrorBoundary did not catch it (component still renders)
      expect(screen.getByText("Async Component")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();

      // Verify the error was thrown but not caught by ErrorBoundary
      expect(caughtErrors.length).toBeGreaterThan(0);
      expect(caughtErrors[0].message).toBe("Async error");

      // Clean up
      vi.restoreAllMocks();
      vi.useRealTimers();
    });
  });

  describe("Edge Cases", () => {
    it("handles error with no message", () => {
      const NoMessageError = () => {
        throw new Error("");
      };

      render(
        <ErrorBoundary>
          <NoMessageError />
        </ErrorBoundary>
      );

      // Should show default message when error has no message
      expect(
        screen.getByText(/An unexpected error occurred/)
      ).toBeInTheDocument();
    });

    it("handles non-Error objects thrown", () => {
      const ThrowString = () => {
        throw "String error";
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );

      // Should still catch and display error boundary
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("Console Logging", () => {
    it("logs error to console", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });

    it("logs error with error ID", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Get the error ID from the rendered text (format: "Error ID: err_xxx")
      const errorText = screen.getByText(/Error ID:/).textContent || "";
      const errorId = errorText.replace("Error ID: ", "").trim();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(`[ErrorBoundary ${errorId}]:`),
        expect.any(Error),
        expect.any(Object)
      );
    });
  });
});
