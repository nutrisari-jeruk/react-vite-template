import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgetPasswordForm } from "../forget-password-form";
import { ROUTES } from "@/config/constants";

const mockNavigate = vi.fn();
const mockResetPassword = vi.fn();

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

vi.mock("@/features/auth", async () => {
  const actual =
    await vi.importActual<typeof import("@/features/auth")>("@/features/auth");
  return {
    ...actual,
    resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  };
});

describe("ForgetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("shows validation error when NIP/NIK is empty", async () => {
    const user = userEvent.setup();
    render(<ForgetPasswordForm />);

    await user.click(screen.getByRole("button", { name: /reset kata sandi/i }));

    expect(screen.getByText("NIP / NIK wajib diisi")).toBeInTheDocument();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("submits and navigates to OTP reset-password flow when OTP is required", async () => {
    const user = userEvent.setup();
    mockResetPassword.mockResolvedValueOnce({
      otp: { isRequired: true, expiresIn: 60 },
      resetToken: "ignored-when-otp-required",
    });

    render(<ForgetPasswordForm />);

    await user.type(screen.getByLabelText("NIP / NIK Pegawai"), "1234567890");
    await user.click(screen.getByRole("button", { name: /reset kata sandi/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        username: "1234567890",
      });
    });

    expect(sessionStorage.getItem("reset_password_token")).toBeNull();
    expect(sessionStorage.getItem("reset_password_identifier")).toBe(
      "1234567890"
    );
    expect(sessionStorage.getItem("reset_otp_pending")).toBe("true");

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.OTP, {
      state: {
        flow: "reset_password",
        expiresIn: 60,
        identifier: "1234567890",
      },
    });
  });

  it("calls onBackToLogin when user clicks the back-to-login button", async () => {
    const user = userEvent.setup();
    const onBackToLogin = vi.fn();

    render(<ForgetPasswordForm onBackToLogin={onBackToLogin} />);

    await user.click(screen.getByRole("button", { name: /klik disini/i }));
    expect(onBackToLogin).toHaveBeenCalledTimes(1);
  });
});
