import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../Login";
import { ROUTES } from "@/config/constants";
import {
  TEST_CREDENTIALS,
  TEST_USER,
  createTestQueryClient,
} from "@/features/auth/components/__tests__/test-utils";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

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

const createWrapper = () => {
  const queryClient = createTestQueryClient();

  function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return TestWrapper;
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("Rendering Tests", () => {
    it("should render the page with correct structure", () => {
      const wrapper = createWrapper();
      const { container } = render(<LoginPage />, { wrapper });

      // Main container with blue background
      const mainContainer = container.querySelector(".bg-blue-600");
      expect(mainContainer).toBeInTheDocument();

      // White card container
      const card = container.querySelector(".bg-white");
      expect(card).toBeInTheDocument();
    });

    it("should render 'Single Sign-On (SSO)' title", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      expect(
        screen.getByRole("heading", { name: /single sign-on \(sso\)/i })
      ).toBeInTheDocument();
    });

    it("should render 'RSUD R.T. Notopuro Sidoarjo' subtitle", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      expect(
        screen.getByText(/RSUD R\.T\. Notopuro Sidoarjo/i)
      ).toBeInTheDocument();
    });

    it("should render the LoginForm component", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      // LoginForm elements should be present
      expect(screen.getByLabelText("NIP / NIK Pegawai")).toBeInTheDocument();
      expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("should render illustration image with correct alt text", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      const illustration = screen.getByAltText("Ilustrasi login medis");
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute("src", "/login.svg");
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper alt text for Indonesia logo", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      const logo = screen.getByAltText("Logo Pemerintah Indonesia");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/logo-indonesia.png");
    });

    it("should have proper alt text for RSUD logo", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      const logo = screen.getByAltText("Logo RSUD R.T. Notopuro");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/logo-rsud.png");
    });

    it("should have proper alt text for Sidoarjo logo", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      const logo = screen.getByAltText("Logo Kabupaten Sidoarjo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/logo-sidoarjo.png");
    });

    it("should have focus-visible styles on main container", () => {
      const wrapper = createWrapper();
      const { container } = render(<LoginPage />, { wrapper });

      const card = container.querySelector(".focus-visible\\:ring-2");
      expect(card).toBeInTheDocument();
    });

    it("should have proper aria-label on password visibility toggle", () => {
      const wrapper = createWrapper();
      render(<LoginPage />, { wrapper });

      const toggleButton = screen.getByLabelText("Show password");
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe("Form Integration Tests", () => {
    describe("Form Validation Tests", () => {
      it("should show validation error when username is empty", async () => {
        const user = userEvent.setup();
        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        expect(screen.getByText("NIP / NIK wajib diisi")).toBeInTheDocument();
        expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
      });

      it("should show validation error when password is empty", async () => {
        const user = userEvent.setup();
        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        const usernameInput = screen.getByLabelText("NIP / NIK Pegawai");
        await user.type(usernameInput, TEST_CREDENTIALS.username);

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        expect(screen.getByText("Kata sandi wajib diisi")).toBeInTheDocument();
        expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
      });
    });

    describe("Success Scenarios", () => {
      it("should navigate to OTP page when OTP is required", async () => {
        const user = userEvent.setup();
        mockLoginWithEmailAndPassword.mockResolvedValueOnce({
          ...TEST_USER,
          token: TEST_USER.token,
          otp: { isRequired: true, expiresIn: 60 },
        });

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          TEST_CREDENTIALS.username
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.password
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
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
      });

      it("should navigate to Dashboard when OTP is not required", async () => {
        const user = userEvent.setup();
        mockLoginWithEmailAndPassword.mockResolvedValueOnce({
          ...TEST_USER,
          token: TEST_USER.token,
          otp: { isRequired: false, expiresIn: 0 },
        });

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          TEST_CREDENTIALS.username
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.password
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
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
      });
    });

    describe("Error Scenarios", () => {
      it("should display form-level error for generic API errors", async () => {
        const user = userEvent.setup();
        const error = new Error("Invalid credentials");
        (error as { status?: number }).status = 401;
        mockLoginWithEmailAndPassword.mockRejectedValueOnce(error);

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          TEST_CREDENTIALS.username
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.wrongPassword
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByRole("alert")).toBeInTheDocument();
        });
      });

      it("should display field-specific error for username validation errors", async () => {
        const user = userEvent.setup();
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

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          "invalid_user"
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.password
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText("User not found")).toBeInTheDocument();
        });
      });

      it("should display field-specific error for password validation errors", async () => {
        const user = userEvent.setup();
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

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          TEST_CREDENTIALS.username
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.wrongPassword
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText("Incorrect password")).toBeInTheDocument();
        });
      });
    });

    describe("Interaction Tests", () => {
      it("should toggle password visibility when clicking the eye icon", async () => {
        const user = userEvent.setup();
        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        const passwordInput = screen.getByLabelText("Kata Sandi");
        const showButton = screen.getByLabelText("Show password");

        // Initially password should be hidden
        expect(passwordInput).toHaveAttribute("type", "password");

        // Click to show password
        await user.click(showButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        // Button should now be "Hide password"
        const hideButton = screen.getByLabelText("Hide password");
        await user.click(hideButton);
        expect(passwordInput).toHaveAttribute("type", "password");
      });

      it("should disable submit button and show loading state during submission", async () => {
        const user = userEvent.setup();
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

        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        await user.type(
          screen.getByLabelText("NIP / NIK Pegawai"),
          TEST_CREDENTIALS.username
        );
        await user.type(
          screen.getByLabelText("Kata Sandi"),
          TEST_CREDENTIALS.password
        );

        const submitButton = screen.getByRole("button", { name: /login/i });
        await user.click(submitButton);

        // Button should be disabled and show loading text
        await waitFor(() => {
          expect(submitButton).toBeDisabled();
          expect(screen.getByText("Memproses...")).toBeInTheDocument();
        });
      });

      it("should navigate to forget password page when clicking 'Lupa Kata Sandi' link", () => {
        const wrapper = createWrapper();
        render(<LoginPage />, { wrapper });

        const forgetPasswordLink = screen.getByRole("link", {
          name: /klik disini/i,
        });
        expect(forgetPasswordLink).toHaveAttribute(
          "href",
          ROUTES.FORGET_PASSWORD
        );
      });
    });
  });
});
