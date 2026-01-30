import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/testing";
import ForgetPasswordPage from "../ForgetPassword";

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

// Mock ForgetPasswordForm component
vi.mock("@/features/auth/components/forget-password-form", () => ({
  ForgetPasswordForm: () => <div>FORGET_PASSWORD_FORM</div>,
}));

describe("Forget password page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Tests", () => {
    it("should render the page with correct structure", () => {
      render(<ForgetPasswordPage />);

      expect(screen.getByText("Single Sign-On (SSO)")).toBeInTheDocument();
      expect(
        screen.getByText("RSUD R.T. Notopuro Sidoarjo")
      ).toBeInTheDocument();
      expect(screen.getByText("FORGET_PASSWORD_FORM")).toBeInTheDocument();
    });

    it("should render illustration image with correct alt text", () => {
      render(<ForgetPasswordPage />);

      const illustration = screen.getByAltText("RSUD R.T. Notopuro Sidoarjo");
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute("src", "/login.svg");
    });

    it("should render all three logos", () => {
      render(<ForgetPasswordPage />);

      expect(screen.getByAltText("Indonesia")).toBeInTheDocument();
      expect(screen.getByAltText("RSUD")).toBeInTheDocument();
      expect(screen.getByAltText("Sidoarjo")).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper alt text for Indonesia logo", () => {
      render(<ForgetPasswordPage />);

      const indonesiaLogo = screen.getByAltText("Indonesia");
      expect(indonesiaLogo).toBeInTheDocument();
    });

    it("should have proper alt text for RSUD logo", () => {
      render(<ForgetPasswordPage />);

      const rsudLogo = screen.getByAltText("RSUD");
      expect(rsudLogo).toBeInTheDocument();
    });

    it("should have proper alt text for Sidoarjo logo", () => {
      render(<ForgetPasswordPage />);

      const sidoarjoLogo = screen.getByAltText("Sidoarjo");
      expect(sidoarjoLogo).toBeInTheDocument();
    });
  });

  describe("Layout Tests", () => {
    it("should render the form section with proper container classes", () => {
      const { container } = render(<ForgetPasswordPage />);

      const mainContainer = container.querySelector(".bg-blue-600");
      expect(mainContainer).toBeInTheDocument();

      const cardContainer = container.querySelector(".bg-white");
      expect(cardContainer).toBeInTheDocument();
    });
  });
});
