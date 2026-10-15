import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/tests";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";

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

vi.mock("../api/authApi", () => ({
  getUser: vi.fn().mockResolvedValue({
    id: "42",
    name: "John",
    email: "john@example.com",
    username: "user",
  }),
  registerWithEmailAndPassword: (...args: unknown[]) =>
    mockRegisterWithEmailAndPassword(...args),
}));

vi.mock("@/libs/tokenStorage", async () => {
  const actual = await vi.importActual<typeof import("@/libs/tokenStorage")>(
    "@/libs/tokenStorage"
  );
  return {
    ...actual,
    setAccessToken: vi.fn(),
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
    expect(
      screen.getByLabelText("Username / Employee Number")
    ).toBeInTheDocument();
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
    await user.type(
      screen.getByLabelText("Username / Employee Number"),
      "12345678901"
    );
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
    await user.type(
      screen.getByLabelText("Username / Employee Number"),
      "12345678901"
    );
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
    await user.type(
      screen.getByLabelText("Username / Employee Number"),
      "12345678901"
    );
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
    await user.type(
      screen.getByLabelText("Username / Employee Number"),
      "12345678901"
    );
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Email already registered")).toBeInTheDocument();
    });
  });
});
