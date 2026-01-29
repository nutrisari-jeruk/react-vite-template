import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OtpPage from "../Otp";
import { ROUTES } from "@/config/constants";

const mockNavigate = vi.fn();
const mockGetAccessToken = vi.fn();

let mockLocationState: unknown = null;

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

vi.mock("@/features/auth", async () => {
  const actual =
    await vi.importActual<typeof import("@/features/auth")>("@/features/auth");
  return {
    ...actual,
    getAccessToken: () => mockGetAccessToken(),
  };
});

vi.mock("@/features/auth/components/otp-form", () => ({
  OtpForm: () => <div>OTP_FORM</div>,
}));

describe("Otp Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockLocationState = null;
  });

  it("redirects to login when access token is missing (login flow)", () => {
    mockGetAccessToken.mockReturnValueOnce(null);

    render(<OtpPage />);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, { replace: true });
  });

  it("redirects to dashboard when token exists but OTP is not pending (login flow)", () => {
    mockGetAccessToken.mockReturnValueOnce("token");

    render(<OtpPage />);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD, {
      replace: true,
    });
  });

  it("sets pending flag and renders OTP form when expiresIn is provided (login flow)", () => {
    mockGetAccessToken.mockReturnValueOnce("token");
    mockLocationState = { expiresIn: 60 };

    render(<OtpPage />);

    expect(sessionStorage.getItem("otp_pending")).toBe("true");
    expect(screen.getByText("OTP_FORM")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirects to forget-password when reset_password flow is accessed without pending flag", () => {
    mockLocationState = { flow: "reset_password" };

    render(<OtpPage />);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.FORGET_PASSWORD, {
      replace: true,
    });
  });
});
