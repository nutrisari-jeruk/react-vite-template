import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { ForgetPasswordForm } from "../forget-password-form";
import { ROUTES } from "@/config/constants";
import { TEST_CREDENTIALS } from "./test-utils";

// Mock navigate function - must be defined before vi.mock()
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

// Mock auth API
vi.mock("@/features/auth/api/auth-api", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/auth/api/auth-api")
  >("@/features/auth/api/auth-api");
  return {
    ...actual,
    resetPassword: vi.fn(),
  };
});

// Import mocked modules
import { resetPassword } from "@/features/auth/api/auth-api";

const mockResetPassword = resetPassword as ReturnType<typeof vi.fn>;

describe("ForgetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("Rendering Tests", () => {
    it("should render the form with correct structure", () => {
      render(<ForgetPasswordForm />);

      expect(screen.getByLabelText("NIP / NIK Pegawai")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset kata sandi/i })
      ).toBeInTheDocument();
    });

    it("should render back-to-login button", () => {
      render(<ForgetPasswordForm />);

      expect(
        screen.getByRole("button", { name: /klik disini/i })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper label for NIP/NIK input", () => {
      render(<ForgetPasswordForm />);

      // Label should be present
      expect(screen.getByText("NIP / NIK Pegawai")).toBeInTheDocument();

      // Input should have proper attributes
      const input = screen.getByRole("textbox", {
        name: /NIP \/ NIK Pegawai/i,
      });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("autoComplete", "username");
    });
  });

  describe("Form Validation Tests", () => {
    it("should show validation error when NIP/NIK is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ForgetPasswordForm />);

      const submitButton = screen.getByRole("button", {
        name: /reset kata sandi/i,
      });
      await user.click(submitButton);

      expect(screen.getByText("NIP / NIK wajib diisi")).toBeInTheDocument();
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });

  describe("Success Scenarios", () => {
    it("should submit and navigate to OTP reset-password flow when OTP is required", async () => {
      const user = userEvent.setup({ delay: null });
      mockResetPassword.mockResolvedValueOnce({
        otp: { isRequired: true, expiresIn: 60 },
        resetToken: "ignored-when-otp-required",
      });

      render(<ForgetPasswordForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.click(
        screen.getByRole("button", { name: /reset kata sandi/i })
      );

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith({
          username: TEST_CREDENTIALS.username,
        });
      });

      expect(sessionStorage.getItem("reset_password_token")).toBeNull();
      expect(sessionStorage.getItem("reset_password_identifier")).toBe(
        TEST_CREDENTIALS.username
      );
      expect(sessionStorage.getItem("reset_otp_pending")).toBe("true");

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.OTP, {
        state: {
          flow: "reset_password",
          expiresIn: 60,
          identifier: TEST_CREDENTIALS.username,
        },
      });
    });

    it("should call onBackToLogin when user clicks the back-to-login button", async () => {
      const user = userEvent.setup({ delay: null });
      const onBackToLogin = vi.fn();

      render(<ForgetPasswordForm onBackToLogin={onBackToLogin} />);

      await user.click(screen.getByRole("button", { name: /klik disini/i }));
      expect(onBackToLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Scenarios", () => {
    it("should display API error message for failed reset password request", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("User not found");
      (error as { status?: number }).status = 404;
      mockResetPassword.mockRejectedValueOnce(error);

      render(<ForgetPasswordForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.invalidUsername
      );
      await user.click(
        screen.getByRole("button", { name: /reset kata sandi/i })
      );

      await waitFor(() => {
        expect(screen.getByText("User not found")).toBeInTheDocument();
      });
    });

    it("should display field-specific error for validation errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              username: ["Account not found"],
            },
          },
        },
      };
      mockResetPassword.mockRejectedValueOnce(error);

      render(<ForgetPasswordForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        "invalid_user"
      );
      await user.click(
        screen.getByRole("button", { name: /reset kata sandi/i })
      );

      await waitFor(() => {
        expect(screen.getByText("Account not found")).toBeInTheDocument();
      });
    });
  });

  describe("Interaction Tests", () => {
    it("should disable submit button and show loading state during submission", async () => {
      const user = userEvent.setup({ delay: null });
      mockResetPassword.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ForgetPasswordForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );

      const submitButton = screen.getByRole("button", {
        name: /reset kata sandi/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText("Memproses...")).toBeInTheDocument();
      });
    });
  });
});
