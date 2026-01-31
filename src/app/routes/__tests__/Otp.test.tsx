import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/testing";
import userEvent from "@testing-library/user-event";
import OtpPage from "../Otp";
import { ROUTES } from "@/config/constants";

const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";

// Mock navigate function - must be defined before vi.mock()
const mockNavigate = vi.fn();

const mockGetAccessToken = vi.fn();
let mockLocationState: unknown = null;

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

// Mock auth module (getAccessToken is exported from here)
vi.mock("@/features/auth", async () => {
  const actual =
    await vi.importActual<typeof import("@/features/auth")>("@/features/auth");
  return {
    ...actual,
    getAccessToken: () => mockGetAccessToken(),
  };
});

// Mock OtpForm component - accepts onSuccess and exposes trigger for tests
vi.mock("@/features/auth/components/otp-form", () => ({
  OtpForm: ({
    onSuccess,
  }: {
    onSuccess?: () => void;
    expiresIn?: number;
    mode?: string;
    identifier?: string;
  }) => (
    <div>
      <span>OTP_FORM</span>
      {onSuccess && (
        <button type="button" onClick={onSuccess}>
          Trigger onSuccess
        </button>
      )}
    </div>
  ),
}));

describe("OtpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockLocationState = null;
  });

  describe("Rendering Tests", () => {
    it("should render OTP form when token exists and OTP is pending", () => {
      mockGetAccessToken.mockReturnValueOnce("token");
      mockLocationState = { expiresIn: 60 };

      render(<OtpPage />);

      expect(screen.getByText("OTP_FORM")).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Access Control Tests", () => {
    it("redirects to login when access token is missing (login flow)", () => {
      mockGetAccessToken.mockReturnValueOnce(null);

      render(<OtpPage />);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, {
        replace: true,
      });
    });

    it("redirects to dashboard when token exists but OTP is not pending (login flow)", () => {
      mockGetAccessToken.mockReturnValueOnce("token");

      render(<OtpPage />);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD, {
        replace: true,
      });
    });

    it("redirects to forget-password when reset_password flow is accessed without pending flag", () => {
      mockLocationState = { flow: "reset_password" };

      render(<OtpPage />);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.FORGET_PASSWORD, {
        replace: true,
      });
    });
  });

  describe("Session Management Tests", () => {
    it("sets pending flag in sessionStorage when expiresIn is provided (login flow)", () => {
      mockGetAccessToken.mockReturnValueOnce("token");
      mockLocationState = { expiresIn: 60 };

      render(<OtpPage />);

      expect(sessionStorage.getItem("otp_pending")).toBe("true");
    });

    it("does not set pending flag when expiresIn is not provided", () => {
      mockGetAccessToken.mockReturnValueOnce("token");

      render(<OtpPage />);

      // Should redirect before setting the flag
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD, {
        replace: true,
      });
    });

    it("sets reset_otp_pending when reset_password flow has expiresIn in state", () => {
      mockLocationState = { flow: "reset_password", expiresIn: 60 };

      render(<OtpPage />);

      expect(sessionStorage.getItem("reset_otp_pending")).toBe("true");
    });
  });

  describe("onSuccess callback", () => {
    it("navigates to DASHBOARD when onSuccess is called (login flow)", async () => {
      const user = userEvent.setup();
      mockGetAccessToken.mockReturnValue("token");
      mockLocationState = { expiresIn: 60 };

      render(<OtpPage />);

      await user.click(
        screen.getByRole("button", { name: "Trigger onSuccess" })
      );

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
    });

    it("navigates to RESET_PASSWORD with token when onSuccess is called (reset_password flow with token)", async () => {
      const user = userEvent.setup();
      mockLocationState = { flow: "reset_password", expiresIn: 60 };
      sessionStorage.setItem(RESET_PASSWORD_TOKEN_KEY, "reset-token-123");

      render(<OtpPage />);

      await user.click(
        screen.getByRole("button", { name: "Trigger onSuccess" })
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        `${ROUTES.RESET_PASSWORD}?token=${encodeURIComponent("reset-token-123")}`,
        { replace: true }
      );
    });

    it("navigates to FORGET_PASSWORD when onSuccess is called (reset_password flow without token)", async () => {
      const user = userEvent.setup();
      mockLocationState = { flow: "reset_password", expiresIn: 60 };

      render(<OtpPage />);

      await user.click(
        screen.getByRole("button", { name: "Trigger onSuccess" })
      );

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.FORGET_PASSWORD, {
        replace: true,
      });
    });
  });
});
