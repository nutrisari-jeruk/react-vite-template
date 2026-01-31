import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/testing";
import ResetPasswordPage from "../ResetPassword";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock ResetPasswordForm component
vi.mock("@/features/auth/components/reset-password-form", () => ({
  ResetPasswordForm: () => <div>RESET_PASSWORD_FORM</div>,
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
});
