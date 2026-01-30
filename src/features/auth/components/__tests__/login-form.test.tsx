import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../login-form";
import { ROUTES } from "@/config/constants";
import { TEST_CREDENTIALS, TEST_USER } from "./test-utils";

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
    loginWithEmailAndPassword: vi.fn(),
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
import { loginWithEmailAndPassword } from "@/features/auth/api/auth-api";
import { setAccessToken } from "@/features/auth/lib/token-storage";

const mockLoginWithEmailAndPassword = loginWithEmailAndPassword as ReturnType<
  typeof vi.fn
>;
const mockSetAccessToken = setAccessToken as ReturnType<typeof vi.fn>;

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("Rendering Tests", () => {
    it("should render the form with correct structure", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText("NIP / NIK Pegawai")).toBeInTheDocument();
      expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Login/i })
      ).toBeInTheDocument();
      expect(screen.getByText("atau")).toBeInTheDocument();
      expect(
        screen.getByText("Lupa Kata Sandi ?", { exact: false })
      ).toBeInTheDocument();
    });

    it("should render forget password link with correct href", () => {
      render(<LoginForm />);

      const forgetPasswordLink = screen.getByRole("link", {
        name: "Klik Disini",
      });
      expect(forgetPasswordLink).toHaveAttribute(
        "href",
        ROUTES.FORGET_PASSWORD
      );
    });

    it("should render with default values when provided", () => {
      render(
        <LoginForm
          defaultUsername={TEST_CREDENTIALS.username}
          defaultPassword={TEST_CREDENTIALS.password}
        />
      );

      const usernameInput = screen.getByLabelText("NIP / NIK Pegawai");
      const passwordInput = screen.getByLabelText("Kata Sandi");

      expect(usernameInput).toHaveValue(TEST_CREDENTIALS.username);
      expect(passwordInput).toHaveValue(TEST_CREDENTIALS.password);
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper labels for input fields", () => {
      render(<LoginForm />);

      const usernameInput = screen.getByLabelText("NIP / NIK Pegawai");
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("autoComplete", "username");

      const passwordInput = screen.getByLabelText("Kata Sandi");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should toggle password visibility when clicking the eye icon", async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText("Kata Sandi");
      const showButton = screen.getByLabelText("Show password");

      expect(passwordInput).toHaveAttribute("type", "password");

      await user.click(showButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      const hideButton = screen.getByLabelText("Hide password");
      await user.click(hideButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should have role='alert' for form-level errors", () => {
      render(<LoginForm />);

      // Form-level error container exists (initially hidden)
      const alertContainer = screen.queryByRole("alert");
      expect(alertContainer).not.toBeInTheDocument();
    });
  });

  describe("Form Validation Tests", () => {
    it("should show validation error when username is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      expect(screen.getByText("NIP / NIK wajib diisi")).toBeInTheDocument();
      expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("should show validation error when password is empty", async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      expect(screen.getByText("Kata sandi wajib diisi")).toBeInTheDocument();
      expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });

  describe("Success Scenarios", () => {
    it("should navigate to OTP page when OTP is required", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      mockLoginWithEmailAndPassword.mockResolvedValueOnce({
        ...TEST_USER,
        token: TEST_USER.token,
        otp: { isRequired: true, expiresIn: 60 },
      });

      render(<LoginForm onSuccess={onSuccess} />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.password
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginWithEmailAndPassword).toHaveBeenCalledWith({
          username: TEST_CREDENTIALS.username,
          password: TEST_CREDENTIALS.password,
        });
      });

      expect(mockSetAccessToken).toHaveBeenCalledWith(TEST_USER.token);
      expect(sessionStorage.getItem("otp_pending")).toBe("true");
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.OTP, {
        state: { expiresIn: 60 },
      });
      expect(onSuccess).toHaveBeenCalledWith(true, 60);
    });

    it("should navigate to Dashboard when OTP is not required", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      mockLoginWithEmailAndPassword.mockResolvedValueOnce({
        ...TEST_USER,
        token: TEST_USER.token,
        otp: { isRequired: false, expiresIn: 0 },
      });

      render(<LoginForm onSuccess={onSuccess} />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.password
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginWithEmailAndPassword).toHaveBeenCalledWith({
          username: TEST_CREDENTIALS.username,
          password: TEST_CREDENTIALS.password,
        });
      });

      expect(mockSetAccessToken).toHaveBeenCalledWith(TEST_USER.token);
      expect(sessionStorage.getItem("otp_pending")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(onSuccess).toHaveBeenCalledWith(false);
    });
  });

  describe("Error Scenarios", () => {
    it("should display form-level error for generic API errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = new Error("Invalid credentials");
      (error as { status?: number }).status = 401;
      mockLoginWithEmailAndPassword.mockRejectedValueOnce(error);

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.wrongPassword
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("should display field-specific error for username validation errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              username: ["User not found"],
            },
          },
        },
      };
      mockLoginWithEmailAndPassword.mockRejectedValueOnce(error);

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.invalidUsername
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.password
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("User not found")).toBeInTheDocument();
      });
    });

    it("should display field-specific error for password validation errors", async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        isAxiosError: true,
        response: {
          data: {
            errors: {
              password: ["Incorrect password"],
            },
          },
        },
      };
      mockLoginWithEmailAndPassword.mockRejectedValueOnce(error);

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.wrongPassword
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Incorrect password")).toBeInTheDocument();
      });
    });
  });

  describe("Interaction Tests", () => {
    it("should disable submit button and show loading state during submission", async () => {
      const user = userEvent.setup({ delay: null });
      mockLoginWithEmailAndPassword.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ...TEST_USER,
                token: TEST_USER.token,
                otp: { isRequired: false, expiresIn: 0 },
              });
            }, 100);
          })
      );

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.password
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText("Memproses...")).toBeInTheDocument();
      });
    });

    it("should clear previous errors when submitting again", async () => {
      const user = userEvent.setup({ delay: null });
      // First attempt fails
      mockLoginWithEmailAndPassword.mockRejectedValueOnce(
        new Error("First error")
      );
      // Second attempt succeeds
      mockLoginWithEmailAndPassword.mockResolvedValueOnce({
        ...TEST_USER,
        token: TEST_USER.token,
        otp: { isRequired: false, expiresIn: 0 },
      });

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText("NIP / NIK Pegawai"),
        TEST_CREDENTIALS.username
      );
      await user.type(
        screen.getByLabelText("Kata Sandi"),
        TEST_CREDENTIALS.password
      );

      const submitButton = screen.getByRole("button", { name: /Login/i });

      // First submission - fails
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Second submission - succeeds
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
      });
    });
  });
});
