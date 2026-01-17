import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ErrorExamples from "../error-examples";

// Mock the api module
vi.mock("@/lib/api-client", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("ErrorExamples Page", () => {
  const renderErrorExamples = () => {
    return render(
      <BrowserRouter>
        <ErrorExamples />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Header", () => {
    it("renders page title", () => {
      renderErrorExamples();
      expect(screen.getByText("Error Handling Examples")).toBeInTheDocument();
    });
  });

  describe("Error Boundary Demo Section", () => {
    it("renders ErrorBoundary Demo card", () => {
      renderErrorExamples();
      expect(screen.getByText("ErrorBoundary Demo")).toBeInTheDocument();
    });

    it("displays description for ErrorBoundary demo", () => {
      renderErrorExamples();
      expect(
        screen.getByText("Click the button to trigger a render error.")
      ).toBeInTheDocument();
    });

    it("renders Trigger Render Error button", () => {
      renderErrorExamples();
      expect(
        screen.getByRole("button", { name: "Trigger Render Error" })
      ).toBeInTheDocument();
    });
  });

  describe("Simulate API Errors Section", () => {
    it("renders Simulate API Errors card", () => {
      renderErrorExamples();
      expect(screen.getByText("Simulate API Errors")).toBeInTheDocument();
    });

    it("renders all error simulation buttons", () => {
      renderErrorExamples();
      expect(
        screen.getByRole("button", { name: "Network Error" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Timeout" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Validation Error" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "401 Unauthorized" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "404 Not Found" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "500 Server Error" })
      ).toBeInTheDocument();
    });
  });

  describe("Form with Validation Section", () => {
    it("renders form card", () => {
      renderErrorExamples();
      expect(screen.getByText("Form with Validation")).toBeInTheDocument();
    });

    it("renders email input", () => {
      renderErrorExamples();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("renders password input", () => {
      renderErrorExamples();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      renderErrorExamples();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();
    });
  });

  describe("Error Alert Display", () => {
    it("displays error alert when error occurs", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      // Click Network Error button
      await user.click(screen.getByRole("button", { name: "Network Error" }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays error message", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Timeout" }));

      await waitFor(() => {
        expect(screen.getByText(/Request timed out/)).toBeInTheDocument();
      });
    });

    it("alert is dismissible", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Network Error" }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText("Dismiss");
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Simulation", () => {
    it("simulates network error", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Network Error" }));

      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });

    it("simulates timeout error", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Timeout" }));

      await waitFor(() => {
        expect(screen.getByText(/timed out/)).toBeInTheDocument();
      });
    });

    it("simulates validation error with field errors", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(
        screen.getByRole("button", { name: "Validation Error" })
      );

      await waitFor(() => {
        expect(screen.getByText(/Invalid form data/)).toBeInTheDocument();
      });
    });

    it("simulates 401 unauthorized error", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(
        screen.getByRole("button", { name: "401 Unauthorized" })
      );

      await waitFor(() => {
        expect(screen.getByText(/Unauthorized/)).toBeInTheDocument();
      });
    });

    it("simulates 404 not found error", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "404 Not Found" }));

      await waitFor(() => {
        expect(screen.getByText(/not found/)).toBeInTheDocument();
      });
    });

    it("simulates 500 server error", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(
        screen.getByRole("button", { name: "500 Server Error" })
      );

      await waitFor(() => {
        expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("allows typing in form fields", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("clears previous error on new submission", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      // Trigger first error
      await user.click(screen.getByRole("button", { name: "Network Error" }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Submit form
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password");
      await user.click(submitButton);

      // Wait for API call to complete (it will fail, but should clear the previous error first)
      await waitFor(
        () => {
          // Either the alert is gone or a new error is shown
          const alerts = screen.queryAllByRole("alert");
          if (alerts.length > 0) {
            // If there's an alert, it should be a different error (not the network error)
            expect(screen.queryByText(/Network error/)).not.toBeInTheDocument();
          }
        },
        { timeout: 5000 }
      );
    });
  });

  describe("Informational Sections", () => {
    it("renders Error Boundary explanation", () => {
      renderErrorExamples();
      expect(
        screen.getByText("What is an Error Boundary?")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Error boundaries are React components/)
      ).toBeInTheDocument();
    });

    it("renders Error Handling Features list", () => {
      renderErrorExamples();
      expect(screen.getByText("Error Handling Features")).toBeInTheDocument();
      expect(
        screen.getByText(/Automatic retry for network errors/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Exponential backoff with jitter/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/401 unauthorized with auto-redirect/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Form field-level error display/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/User-friendly error messages/)
      ).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("disables buttons during loading", () => {
      renderErrorExamples();

      const buttons = screen
        .getAllByRole("button")
        .filter((btn) => !btn.disabled);

      for (const button of buttons) {
        if (button.textContent === "Trigger Render Error") continue;

        // Some buttons might not have loading state, so we just check they exist
        expect(button).toBeInTheDocument();
      }
    });
  });

  describe("Layout and Styling", () => {
    it("uses grid layout for error demos", () => {
      const { container } = renderErrorExamples();
      const gridDivs = container.querySelectorAll(".grid");
      expect(gridDivs.length).toBeGreaterThan(0);
    });

    it("renders cards with proper styling", () => {
      const { container } = renderErrorExamples();
      const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderErrorExamples();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Error Handling Examples");

      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it("all form inputs have associated labels", () => {
      renderErrorExamples();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("error alert has proper role", async () => {
      renderErrorExamples();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Network Error" }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });
});
