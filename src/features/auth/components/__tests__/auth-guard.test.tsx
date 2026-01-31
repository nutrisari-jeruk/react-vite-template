import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthGuard } from "../auth-guard";

const mockUseUser = vi.fn();
const mockGetAccessToken = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../lib/auth-provider", () => ({
  useUser: () => mockUseUser(),
}));

vi.mock("../../lib/token-storage", () => ({
  getAccessToken: () => mockGetAccessToken(),
}));

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

describe("AuthGuard", () => {
  const mockLocation = { href: "", assign: vi.fn(), replace: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = "";
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });
  });

  it("redirects to /login when no token", () => {
    mockGetAccessToken.mockReturnValue(null);
    mockUseUser.mockReturnValue({ isLoading: false, data: null, error: null });

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(mockLocation.href).toBe("/login");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated with token and user data", () => {
    mockGetAccessToken.mockReturnValue("token");
    mockUseUser.mockReturnValue({
      isLoading: false,
      data: { id: "1", name: "User", email: "u@x.com", username: "user" },
      error: null,
      isError: false,
    });

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirects via navigate when token exists but user query fails", () => {
    mockGetAccessToken.mockReturnValue("token");
    mockUseUser.mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error("Not authenticated"),
      isError: true,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { from: expect.anything() },
      replace: true,
    });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
