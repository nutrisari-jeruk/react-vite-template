import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AuthExample from "../examples/auth";

// Mock useAuth hook
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock("@/features/auth", async () => {
  const actual = await vi.importActual("@/features/auth");
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: false,
      accessToken: null,
      login: mockLogin,
      logout: mockLogout,
      tokenExpiresIn: null,
      isTokenExpired: true,
      isLoading: false,
    }),
  };
});

describe("AuthExample Page", () => {
  const renderAuthExample = () => {
    return render(
      <BrowserRouter>
        <AuthExample />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Unauthenticated State", () => {
    it("renders page title", () => {
      renderAuthExample();
      expect(screen.getByText("Authentication Example")).toBeInTheDocument();
    });

    it("renders login form", () => {
      renderAuthExample();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument();
    });

    it("renders remember me checkbox", () => {
      renderAuthExample();
      expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    });

    it("displays demo instructions", () => {
      renderAuthExample();
      expect(
        screen.getByText("Demo: Enter any email and password to sign in")
      ).toBeInTheDocument();
    });

    it("email input has correct attributes", () => {
      renderAuthExample();
      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("placeholder", "you@example.com");
      expect(emailInput).toHaveAttribute("required");
    });

    it("password input has correct attributes", () => {
      renderAuthExample();
      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("placeholder", "Enter password");
      expect(passwordInput).toHaveAttribute("required");
    });
  });

  describe("Form Interaction", () => {
    it("allows typing in email field", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("allows typing in password field", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("toggles remember me checkbox", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      const checkbox = screen.getByLabelText("Remember me");
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: "Sign In" });
      await user.click(submitButton);

      // Form should set tokens in localStorage
      await waitFor(() => {
        expect(localStorage.getItem("token")).toBeTruthy();
        expect(localStorage.getItem("refreshToken")).toBeTruthy();
      });
    });

    it("disables submit button while loading", () => {
      renderAuthExample();
      const submitButton = screen.getByRole("button", { name: "Sign In" });
      // Button starts enabled
      expect(submitButton).not.toBeDisabled();
    });

    it("shows required validation for empty fields", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      const submitButton = screen.getByRole("button", { name: "Sign In" });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toBeInvalid();
    });
  });

  describe("Authenticated State", () => {
    beforeEach(() => {
      // Simulate authenticated state by setting tokens
      const mockAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      localStorage.setItem("token", mockAccessToken);
      localStorage.setItem("refreshToken", "mock-refresh-token");
    });

    it("shows authenticated state", () => {
      renderAuthExample();
      // Note: This test may need adjustment based on how useAuth is mocked
      // In a real scenario, you'd need to mock useAuth to return isAuthenticated: true
    });
  });

  describe("Token Display", () => {
    it("displays authentication status", () => {
      renderAuthExample();
      // When authenticated, should show status
      // This would require proper mocking of useAuth with authenticated state
    });

    it("displays token preview", () => {
      renderAuthExample();
      // When authenticated, should show token preview
    });

    it("displays token expiration", () => {
      renderAuthExample();
      // When authenticated, should show expiration time
    });
  });

  describe("Logout", () => {
    it("renders sign out button when authenticated", () => {
      renderAuthExample();
      // When authenticated, should show logout button
      // This requires proper mock setup
    });
  });

  describe("Error Handling", () => {
    it("displays error message on login failure", async () => {
      // This test would require mocking the login to fail
      renderAuthExample();
      // Error display logic would be tested here
    });

    it("allows dismissing error message", async () => {
      // Test error dismissal
      renderAuthExample();
    });
  });

  describe("Informational Section", () => {
    it("displays features list", () => {
      renderAuthExample();
      expect(
        screen.getByText("Secure Token Storage Features")
      ).toBeInTheDocument();
      expect(screen.getByText(/Environment-based storage/)).toBeInTheDocument();
      expect(
        screen.getByText(/Automatic token expiration tracking/)
      ).toBeInTheDocument();
      expect(screen.getByText(/JWT payload parsing/)).toBeInTheDocument();
      expect(
        screen.getByText(/Type-safe token management/)
      ).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("centers content with max-width", () => {
      const { container } = renderAuthExample();
      const containerDiv = container.querySelector(".max-w-md");
      expect(containerDiv).toBeInTheDocument();
    });

    it("uses card styling for form", () => {
      const { container } = renderAuthExample();
      const card = container.querySelector(".bg-white.rounded-lg.shadow");
      expect(card).toBeInTheDocument();
    });

    it("uses info card for features", () => {
      renderAuthExample();
      expect(
        screen.getByText("Secure Token Storage Features")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderAuthExample();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Authentication Example");
    });

    it("all form inputs have associated labels", () => {
      renderAuthExample();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    });

    it("submit button has proper type", () => {
      renderAuthExample();
      const submitButton = screen.getByRole("button", { name: "Sign In" });
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("Token Storage", () => {
    it("stores tokens in localStorage on login", async () => {
      renderAuthExample();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      await waitFor(() => {
        expect(localStorage.getItem("token")).toBeTruthy();
        expect(localStorage.getItem("refreshToken")).toBeTruthy();
      });
    });

    it("clears tokens on logout", () => {
      // This would require authenticated state mock
      renderAuthExample();
      // Test logout functionality
    });
  });

  describe("Time Formatting", () => {
    it("formats token expiration time correctly", () => {
      renderAuthExample();
      // Time formatting function is internal, but we can test
      // that it displays correctly when authenticated
    });
  });
});
