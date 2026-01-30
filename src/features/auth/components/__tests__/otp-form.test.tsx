import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { OtpForm } from "../otp-form";

// Mock auth API
vi.mock("@/features/auth/api/auth-api", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/auth/api/auth-api")
  >("@/features/auth/api/auth-api");
  return {
    ...actual,
    verifyOtp: vi.fn(),
    resendOtp: vi.fn(),
    resendResetPasswordOtp: vi.fn(),
    validateResetPasswordOtp: vi.fn(),
  };
});

// Mock token storage
vi.mock("@/features/auth/lib/token-storage", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/auth/lib/token-storage")
  >("@/features/auth/lib/token-storage");
  return {
    ...actual,
    setAccessToken: vi.fn(),
  };
});

// Import mocked modules
import {
  verifyOtp,
  resendOtp,
  resendResetPasswordOtp,
  validateResetPasswordOtp,
} from "@/features/auth/api/auth-api";
import { setAccessToken } from "@/features/auth/lib/token-storage";

const mockVerifyOtp = verifyOtp as ReturnType<typeof vi.fn>;
const mockResendOtp = resendOtp as ReturnType<typeof vi.fn>;
const mockResendResetPasswordOtp = resendResetPasswordOtp as ReturnType<
  typeof vi.fn
>;
const mockValidateResetPasswordOtp = validateResetPasswordOtp as ReturnType<
  typeof vi.fn
>;
const mockSetAccessToken = setAccessToken as ReturnType<typeof vi.fn>;

const defaultExpiresIn = 60;

describe("OtpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering Tests", () => {
    it("should render the form with correct structure", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      // Instructions text
      expect(
        screen.getByText(
          /Silahkan masukkan kode OTP yang telah dikirimkan ke perangkat Anda untuk melanjutkan/i
        )
      ).toBeInTheDocument();

      // OTP input
      expect(screen.getByLabelText("Kode OTP")).toBeInTheDocument();

      // Resend text
      expect(
        screen.getByText(/Belum mendapatkan kode OTP\?/i)
      ).toBeInTheDocument();

      // Submit button
      expect(
        screen.getByRole("button", { name: /Validasi Kode OTP/i })
      ).toBeInTheDocument();
    });

    it("should render countdown timer when active", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      expect(screen.getByText(/Tunggu 1 menit/i)).toBeInTheDocument();
    });

    it("should render resend link when countdown expires", () => {
      // Using expiresIn={0} to simulate expired countdown
      // Fake timers don't work well with useCountdown hook's intervals
      render(<OtpForm expiresIn={0} />);

      // When expired, no countdown text should be shown
      expect(screen.queryByText(/Tunggu/i)).not.toBeInTheDocument();
      // Resend link should be visible immediately
      expect(screen.getByText(/Kirim ulang/i)).toBeInTheDocument();
    });

    it("should render in login mode by default", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper label for OTP input", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      expect(otpInput).toBeInTheDocument();
      expect(otpInput).toHaveAttribute("inputMode", "numeric");
      expect(otpInput).toHaveAttribute("maxLength", "6");
      expect(otpInput).toHaveAttribute("autoComplete", "one-time-code");
    });

    it("should show placeholder text for OTP input", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByPlaceholderText("Masukkan Kode OTP");
      expect(otpInput).toBeInTheDocument();
    });

    it("should disable submit button during submission", async () => {
      const user = userEvent.setup({ delay: null });
      mockVerifyOtp.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Validation Tests", () => {
    it("should show validation error when OTP is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      expect(screen.getByText("Kode OTP wajib diisi")).toBeInTheDocument();
      expect(mockVerifyOtp).not.toHaveBeenCalled();
    });

    it("should show validation error when OTP is not 6 digits", async () => {
      const user = userEvent.setup({ delay: null });
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      expect(
        screen.getByText("Kode OTP harus 6 digit angka")
      ).toBeInTheDocument();
      expect(mockVerifyOtp).not.toHaveBeenCalled();
    });

    it("should show validation error when OTP contains non-digit characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "abc123");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      expect(
        screen.getByText("Kode OTP harus 6 digit angka")
      ).toBeInTheDocument();
      expect(mockVerifyOtp).not.toHaveBeenCalled();
    });
  });

  describe("Login Mode Success Scenarios", () => {
    it("should verify OTP successfully and call onSuccess callback", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      mockVerifyOtp.mockResolvedValueOnce({
        success: true,
        message: "OTP verified successfully",
        token: "new-access-token",
      });

      render(<OtpForm expiresIn={defaultExpiresIn} onSuccess={onSuccess} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalled();
        const firstCall = mockVerifyOtp.mock.calls[0][0] as { otp: string };
        expect(firstCall).toEqual({ otp: "123456" });
      });

      expect(mockSetAccessToken).toHaveBeenCalledWith("new-access-token");
      expect(sessionStorage.getItem("otp_pending")).toBeNull();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe("Reset Password Mode Success Scenarios", () => {
    it("should verify OTP successfully in reset_password mode", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      const identifier = "1234567890";
      mockValidateResetPasswordOtp.mockResolvedValueOnce({
        identifier: "reset-token-123",
      });

      render(
        <OtpForm
          expiresIn={defaultExpiresIn}
          mode="reset_password"
          identifier={identifier}
          onSuccess={onSuccess}
        />
      );

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockValidateResetPasswordOtp).toHaveBeenCalled();
        const firstCall = mockValidateResetPasswordOtp.mock.calls[0][0] as {
          otp: string;
          purpose: string;
          identifier: string;
        };
        expect(firstCall).toEqual({
          otp: "123456",
          purpose: "password_reset",
          identifier,
        });
      });

      expect(sessionStorage.getItem("reset_password_token")).toBe(
        "reset-token-123"
      );
      expect(sessionStorage.getItem("reset_otp_pending")).toBeNull();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Scenarios", () => {
    it("should display API error message for failed OTP verification", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("Invalid OTP code");
      (error as { status?: number }).status = 400;
      mockVerifyOtp.mockRejectedValueOnce(error);

      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "000000");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid OTP code")).toBeInTheDocument();
      });
    });

    it("should display field-specific error for OTP validation errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              otp: ["OTP code has expired"],
            },
          },
        },
      };
      mockVerifyOtp.mockRejectedValueOnce(error);

      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("OTP code has expired")).toBeInTheDocument();
      });
    });

    it("should display error message for failed resend OTP", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("Failed to resend OTP");
      mockResendOtp.mockRejectedValueOnce(error);

      render(<OtpForm expiresIn={0} />); // Start with expired countdown

      const resendButton = screen.getByText(/Kirim ulang/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to resend OTP")).toBeInTheDocument();
      });
    });

    it("should display error message for failed reset password OTP resend", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("Failed to resend reset password OTP");
      mockResendResetPasswordOtp.mockRejectedValueOnce(error);

      render(
        <OtpForm expiresIn={0} mode="reset_password" identifier="1234567890" />
      );

      const resendButton = screen.getByText(/Kirim ulang/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to resend reset password OTP")
        ).toBeInTheDocument();
      });
    });

    it("should display error when identifier is missing in reset_password mode", async () => {
      const user = userEvent.setup({ delay: null });

      render(<OtpForm expiresIn={defaultExpiresIn} mode="reset_password" />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      // Should display an error message about missing identifier
      await waitFor(() => {
        expect(
          screen.getByText(
            "Missing identifier for reset password OTP validation"
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("Interaction Tests", () => {
    it("should resend OTP and reset countdown timer", async () => {
      const user = userEvent.setup({ delay: null });
      mockResendOtp.mockResolvedValueOnce({
        success: true,
        message: "OTP resent successfully",
        expiresIn: 120,
      });

      render(<OtpForm expiresIn={0} />); // Start with expired countdown

      const resendButton = screen.getByText(/Kirim ulang/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(mockResendOtp).toHaveBeenCalledTimes(1);
      });

      // Countdown should reset
      await waitFor(() => {
        expect(screen.getByText(/Tunggu 2 menit/i)).toBeInTheDocument();
      });
    });

    it("should resend reset password OTP and reset countdown timer", async () => {
      const user = userEvent.setup({ delay: null });
      const identifier = "1234567890";
      mockResendResetPasswordOtp.mockResolvedValueOnce({
        otp: { isRequired: true, expiresIn: 90 },
      });

      render(
        <OtpForm expiresIn={0} mode="reset_password" identifier={identifier} />
      );

      const resendButton = screen.getByText(/Kirim ulang/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(mockResendResetPasswordOtp).toHaveBeenCalled();
        const firstCall = mockResendResetPasswordOtp.mock.calls[0][0] as {
          purpose: string;
          identifier: string;
        };
        expect(firstCall).toEqual({
          purpose: "password_reset",
          identifier,
        });
      });

      // Countdown should reset
      await waitFor(() => {
        expect(
          screen.getByText(/Tunggu 1 menit 30 detik/i)
        ).toBeInTheDocument();
      });
    });

    it("should show loading state during resend OTP", async () => {
      const user = userEvent.setup({ delay: null });
      mockResendOtp.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<OtpForm expiresIn={0} />);

      const resendButton = screen.getByText(/Kirim ulang/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText("Mengirim ulang...")).toBeInTheDocument();
        expect(resendButton).toBeDisabled();
      });
    });

    it("should show loading state during OTP verification", async () => {
      const user = userEvent.setup({ delay: null });
      mockVerifyOtp.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<OtpForm expiresIn={defaultExpiresIn} />);

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Memproses...")).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it("should persist countdown timer in sessionStorage", () => {
      render(<OtpForm expiresIn={defaultExpiresIn} />);

      // After initial render, the countdown should be persisted
      const storedValue = sessionStorage.getItem("otp_countdown_remaining");
      expect(storedValue).toBe("60");
    });

    it("should clear countdown from sessionStorage on successful verification", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      mockVerifyOtp.mockResolvedValueOnce({
        success: true,
        message: "OTP verified successfully",
        token: "new-access-token",
      });

      render(<OtpForm expiresIn={defaultExpiresIn} onSuccess={onSuccess} />);

      // Set countdown in storage
      sessionStorage.setItem("otp_countdown_remaining", "60");

      const otpInput = screen.getByLabelText("Kode OTP");
      await user.type(otpInput, "123456");

      const submitButton = screen.getByRole("button", {
        name: /Validasi Kode OTP/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      expect(sessionStorage.getItem("otp_countdown_remaining")).toBeNull();
    });

    it("should format time correctly for various durations", () => {
      // Test 60 seconds format (1 minute)
      const { unmount: unmount1 } = render(<OtpForm expiresIn={60} />);
      expect(screen.getByText(/Tunggu 1 menit/i)).toBeInTheDocument();
      unmount1();

      // Test 30 seconds format
      sessionStorage.clear();
      const { unmount: unmount2 } = render(<OtpForm expiresIn={30} />);
      expect(screen.getByText(/30 detik/i)).toBeInTheDocument();
      unmount2();

      // Test 90 seconds format (1 minute 30 seconds)
      sessionStorage.clear();
      render(<OtpForm expiresIn={90} />);
      expect(screen.getByText(/Tunggu 1 menit 30 detik/i)).toBeInTheDocument();
    });

    it("should use correct storage key for reset_password mode", () => {
      render(
        <OtpForm expiresIn={60} mode="reset_password" identifier="1234567890" />
      );

      // Should use reset_password specific key
      const storedValue = sessionStorage.getItem(
        "reset_otp_countdown_remaining"
      );
      expect(storedValue).toBe("60");
    });
  });
});
