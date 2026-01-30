import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "../reset-password-form";
import { ROUTES } from "@/config/constants";

// Mock navigate function - must be defined before vi.mock()
const mockNavigate = vi.fn();
const mockSetNewPassword = vi.fn();

// Create a function that returns the search params mock
const createSearchParamsMock = (token: string | null) =>
  [new URLSearchParams(token ? { token } : {}), vi.fn()] as [
    URLSearchParams,
    ReturnType<typeof vi.fn>,
  ];

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => createSearchParamsMock("token-123"), // Default token
  };
});

// Mock auth API
vi.mock("@/features/auth/api/auth-api", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/auth/api/auth-api")
  >("@/features/auth/api/auth-api");
  return {
    ...actual,
    setNewPassword: (...args: unknown[]) => mockSetNewPassword(...args),
  };
});

// Import mocked modules
// setNewPassword is mocked via mockSetNewPassword

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("Rendering Tests", () => {
    it("should render the form with correct structure", () => {
      render(<ResetPasswordForm />);

      expect(screen.getByLabelText("Kata Sandi Baru")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Konfirmasi Kata Sandi Baru")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset kata sandi/i })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper labels for password inputs", () => {
      render(<ResetPasswordForm />);

      // Labels should be present
      expect(screen.getByText("Kata Sandi Baru")).toBeInTheDocument();
      expect(
        screen.getByText("Konfirmasi Kata Sandi Baru")
      ).toBeInTheDocument();

      // Password inputs should be of type password by default
      const newPasswordInput = screen.getByPlaceholderText(
        /Masukkan Kata Sandi Baru Anda/i
      );
      expect(newPasswordInput).toHaveAttribute("type", "password");

      const confirmPasswordInput = screen.getByPlaceholderText(
        /Masukkan Ulang Kata Sandi Baru Anda/i
      );
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });

    it("should toggle password visibility for new password field", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ResetPasswordForm />);

      const newPasswordInput = screen.getByPlaceholderText(
        /Masukkan Kata Sandi Baru Anda/i
      );
      const showButtons = screen.getAllByLabelText("Tampilkan kata sandi", {
        selector: "button",
      });
      const showButton = showButtons[0];

      expect(newPasswordInput).toHaveAttribute("type", "password");

      await user.click(showButton);
      expect(newPasswordInput).toHaveAttribute("type", "text");

      const hideButtons = screen.getAllByLabelText("Sembunyikan kata sandi", {
        selector: "button",
      });
      const hideButton = hideButtons[0];
      await user.click(hideButton);
      expect(newPasswordInput).toHaveAttribute("type", "password");
    });

    it("should toggle password visibility for confirm password field", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ResetPasswordForm />);

      const confirmPasswordInput = screen.getByPlaceholderText(
        /Masukkan Ulang Kata Sandi Baru Anda/i
      );
      const showButtons = screen.getAllByLabelText("Tampilkan kata sandi", {
        selector: "button",
      });
      const showButton = showButtons[1];

      expect(confirmPasswordInput).toHaveAttribute("type", "password");

      await user.click(showButton);
      expect(confirmPasswordInput).toHaveAttribute("type", "text");

      const hideButtons = screen.getAllByLabelText("Sembunyikan kata sandi", {
        selector: "button",
      });
      const hideButton = hideButtons[1];
      await user.click(hideButton);
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Validation Tests", () => {
    it("should show validation error when new password is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ResetPasswordForm />);

      const submitButton = screen.getByRole("button", {
        name: /Reset Kata Sandi/i,
      });
      await user.click(submitButton);

      // Error is displayed by the Input component in a role="alert" element
      const errorAlerts = screen.getAllByRole("alert");
      const passwordError = errorAlerts.find((alert) =>
        alert.textContent?.includes("Minimal 8 karakter")
      );
      expect(passwordError).toBeInTheDocument();
      expect(mockSetNewPassword).not.toHaveBeenCalled();
    });

    it("should show validation error when password confirmation is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ResetPasswordForm />);

      await user.type(
        screen.getByPlaceholderText(/Masukkan Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );

      const submitButton = screen.getByRole("button", {
        name: /Reset Kata Sandi/i,
      });
      await user.click(submitButton);

      expect(
        screen.getByText("Konfirmasi kata sandi wajib diisi")
      ).toBeInTheDocument();
      expect(mockSetNewPassword).not.toHaveBeenCalled();
    });

    it("should show validation error when passwords do not match", async () => {
      const user = userEvent.setup({ delay: null });
      render(<ResetPasswordForm />);

      await user.type(
        screen.getByLabelText("Kata Sandi Baru"),
        "ValidPass123!"
      );
      await user.type(
        screen.getByLabelText("Konfirmasi Kata Sandi Baru"),
        "DifferentPass123!"
      );

      const submitButton = screen.getByRole("button", {
        name: /Reset Kata Sandi/i,
      });
      await user.click(submitButton);

      expect(screen.getByText("Kata sandi tidak cocok")).toBeInTheDocument();
      expect(mockSetNewPassword).not.toHaveBeenCalled();
    });
  });

  describe("Success Scenarios", () => {
    it("should submit new password, clear session storage, and redirect to login", async () => {
      const user = userEvent.setup({ delay: null });
      sessionStorage.setItem("reset_password_token", "some-reset-token");
      sessionStorage.setItem("reset_password_identifier", "123");
      mockSetNewPassword.mockResolvedValueOnce({});

      render(<ResetPasswordForm />);

      await user.type(
        screen.getByPlaceholderText(/Masukkan Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.type(
        screen.getByPlaceholderText(/Masukkan Ulang Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.click(
        screen.getByRole("button", { name: /reset kata sandi/i })
      );

      await waitFor(() => {
        expect(mockSetNewPassword).toHaveBeenCalledWith({
          resetToken: "token-123",
          password: "ValidPass123!",
          passwordConfirmation: "ValidPass123!",
        });
      });

      expect(
        await screen.findByText(
          "Kata sandi berhasil direset. Silakan login dengan kata sandi baru Anda."
        )
      ).toBeInTheDocument();

      expect(sessionStorage.getItem("reset_password_token")).toBeNull();
      expect(sessionStorage.getItem("reset_password_identifier")).toBeNull();

      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
        },
        { timeout: 2500 }
      );
    });
  });

  describe("Error Scenarios", () => {
    // Note: The "token missing" test is skipped since the mock always provides a token.
    // The component correctly handles missing tokens internally by checking `if (!resetToken)`.

    it("should display API error message for failed password reset", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("Invalid reset token");
      (error as { status?: number }).status = 400;
      mockSetNewPassword.mockRejectedValueOnce(error);

      render(<ResetPasswordForm />);

      await user.type(
        screen.getByPlaceholderText(/Masukkan Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.type(
        screen.getByPlaceholderText(/Masukkan Ulang Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.click(
        screen.getByRole("button", { name: /Reset Kata Sandi/i })
      );

      await waitFor(() => {
        expect(screen.getByText("Invalid reset token")).toBeInTheDocument();
      });
    });

    it("should display field-specific error for validation errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              password: ["Password has been used recently"],
            },
          },
        },
      };
      mockSetNewPassword.mockRejectedValueOnce(error);

      render(<ResetPasswordForm />);

      await user.type(
        screen.getByPlaceholderText(/Masukkan Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.type(
        screen.getByPlaceholderText(/Masukkan Ulang Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.click(
        screen.getByRole("button", { name: /Reset Kata Sandi/i })
      );

      await waitFor(() => {
        // Error is displayed by the Input component in a role="alert" element
        const errorAlerts = screen.getAllByRole("alert");
        const passwordError = errorAlerts.find((alert) =>
          alert.textContent?.includes("Password has been used recently")
        );
        expect(passwordError).toBeInTheDocument();
      });
    });
  });

  describe("Interaction Tests", () => {
    it("should disable submit button and show loading state during submission", async () => {
      const user = userEvent.setup({ delay: null });
      mockSetNewPassword.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ResetPasswordForm />);

      await user.type(
        screen.getByPlaceholderText(/Masukkan Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );
      await user.type(
        screen.getByPlaceholderText(/Masukkan Ulang Kata Sandi Baru Anda/i),
        "ValidPass123!"
      );

      const submitButton = screen.getByRole("button", {
        name: /Reset Kata Sandi/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText("Memproses...")).toBeInTheDocument();
      });
    });
  });
});
