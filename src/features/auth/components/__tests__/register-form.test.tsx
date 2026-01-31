import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../register-form";

const mockNavigate = vi.fn();
const mockRegisterWithEmailAndPassword = vi.fn();

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

vi.mock("../../api/auth-api", () => ({
  registerWithEmailAndPassword: (...args: unknown[]) =>
    mockRegisterWithEmailAndPassword(...args),
}));

vi.mock("../../lib/token-storage", async () => {
  const actual = await vi.importActual<
    typeof import("../../lib/token-storage")
  >("../../lib/token-storage");
  return {
    ...actual,
    setAccessToken: vi.fn(),
  };
});

vi.mock("../../lib/auth-provider", async () => {
  const { z } = await import("zod");
  const actual = await vi.importActual<
    typeof import("../../lib/auth-provider")
  >("../../lib/auth-provider");

  const testRegisterSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    username: z
      .union([z.string().min(11, "Employee Number is required"), z.literal("")])
      .optional()
      .default(""),
  });

  return {
    ...actual,
    registerInputSchema: testRegisterSchema,
  };
});

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with correct structure", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText(/invalid|email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "12345");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });
  });

  it("calls onSuccess when registration succeeds", async () => {
    mockRegisterWithEmailAndPassword.mockResolvedValue({
      name: "John",
      email: "john@example.com",
      username: "user",
      token: "token",
      otp: { isRequired: false, expiresIn: 0 },
    });
    const onSuccess = vi.fn();

    const user = userEvent.setup();
    render(<RegisterForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockRegisterWithEmailAndPassword).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("displays error alert when registration fails", async () => {
    mockRegisterWithEmailAndPassword.mockRejectedValue(
      new Error("Email already registered")
    );

    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Email already registered")).toBeInTheDocument();
    });
  });
});
