import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/testing";
import userEvent from "@testing-library/user-event";
import ResetPasswordPage from "../ResetPassword";

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ResetPasswordForm component - accepts onBackToLogin and exposes trigger
vi.mock("@/features/auth/components/reset-password-form", () => ({
  ResetPasswordForm: ({ onBackToLogin }: { onBackToLogin?: () => void }) => (
    <div>
      <span>RESET_PASSWORD_FORM</span>
      {onBackToLogin && (
        <button type="button" onClick={onBackToLogin}>
          Back to Login
        </button>
      )}
    </div>
  ),
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Tests", () => {
    it("should render the page with correct structure", () => {
      render(<ResetPasswordPage />);

      expect(screen.getByText("Single Sign-On (SSO)")).toBeInTheDocument();
      expect(
        screen.getByText("RSUD R.T. Notopuro Sidoarjo")
      ).toBeInTheDocument();
      expect(screen.getByText("RESET_PASSWORD_FORM")).toBeInTheDocument();
    });

    it("should render illustration image with correct alt text", () => {
      render(<ResetPasswordPage />);

      const illustration = screen.getByAltText("RSUD R.T. Notopuro Sidoarjo");
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute("src", "/login.svg");
    });
  });

  describe("Layout Tests", () => {
    it("should render the form section with proper container classes", () => {
      const { container } = render(<ResetPasswordPage />);

      const mainContainer = container.querySelector(".bg-blue-600");
      expect(mainContainer).toBeInTheDocument();

      const cardContainer = container.querySelector(".bg-white");
      expect(cardContainer).toBeInTheDocument();
    });
  });

  describe("onBackToLogin callback", () => {
    it("navigates to /login when onBackToLogin is called", async () => {
      const user = userEvent.setup();
      render(<ResetPasswordPage />);

      await user.click(screen.getByRole("button", { name: "Back to Login" }));

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
