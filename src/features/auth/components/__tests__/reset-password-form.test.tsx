import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "../reset-password-form";

const mockNavigate = vi.fn();
const mockSetNewPassword = vi.fn();

let mockToken: string | null = "token-123";

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      new URLSearchParams(mockToken ? { token: mockToken } : {}),
      vi.fn(),
    ],
  };
});

vi.mock("@/features/auth", async () => {
  const actual =
    await vi.importActual<typeof import("@/features/auth")>("@/features/auth");
  return {
    ...actual,
    setNewPassword: (...args: unknown[]) => mockSetNewPassword(...args),
  };
});

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockToken = "token-123";
  });

  afterEach(() => {});

  it("shows error and redirects to forget-password when token is missing", async () => {
    const user = userEvent.setup();
    mockToken = null;

    render(<ResetPasswordForm />);

    // Must satisfy form validation so onSubmit can run and detect missing token
    await user.type(screen.getByLabelText("Kata Sandi Baru"), "ValidPass123!");
    await user.type(
      screen.getByLabelText("Konfirmasi Kata Sandi Baru"),
      "ValidPass123!"
    );
    await user.click(screen.getByRole("button", { name: /reset kata sandi/i }));

    expect(
      await screen.findByText(
        "Token reset tidak ditemukan. Silakan ulangi proses reset kata sandi."
      )
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/forget-password");
      },
      { timeout: 2500 }
    );
    expect(mockSetNewPassword).not.toHaveBeenCalled();
  });

  it("submits new password, clears session storage, and redirects to login", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("reset_password_token", "some-reset-token");
    sessionStorage.setItem("reset_password_identifier", "123");
    mockSetNewPassword.mockResolvedValueOnce({});

    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("Kata Sandi Baru"), "ValidPass123!");
    await user.type(
      screen.getByLabelText("Konfirmasi Kata Sandi Baru"),
      "ValidPass123!"
    );
    await user.click(screen.getByRole("button", { name: /reset kata sandi/i }));

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
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 2500 }
    );
  });
});
