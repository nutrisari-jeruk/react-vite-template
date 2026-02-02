import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useUser,
  useLogin,
  useLogout,
  useRegister,
  AuthLoader,
  loginInputSchema,
  registerInputSchema,
} from "../auth-provider";

const mockGetUser = vi.fn();
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();
const mockSetAccessToken = vi.fn();
const mockClearAuthTokens = vi.fn();

vi.mock("../../api/auth-api", () => ({
  getUser: (...args: unknown[]) => mockGetUser(...args),
  loginWithEmailAndPassword: (...args: unknown[]) => mockLogin(...args),
  registerWithEmailAndPassword: (...args: unknown[]) => mockRegister(...args),
  logout: (...args: unknown[]) => mockLogout(...args),
}));

vi.mock("../token-storage", () => ({
  setAccessToken: (...args: unknown[]) => mockSetAccessToken(...args),
  clearAuthTokens: () => mockClearAuthTokens(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("Auth Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue(null);
  });

  describe("useUser", () => {
    it("returns error when not authenticated", async () => {
      mockGetUser.mockResolvedValue(null);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
      expect((result.current.error as Error)?.message).toBe(
        "Not authenticated"
      );
    });

    it("returns user when authenticated", async () => {
      const user = {
        id: "1",
        name: "User",
        email: "user@example.com",
        username: "user",
      };
      mockGetUser.mockResolvedValue(user);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      expect(result.current.data).toEqual(user);
    });
  });

  describe("useLogin", () => {
    it("calls login API and stores token on success", async () => {
      const loginResponse = {
        name: "User",
        email: "user@example.com",
        username: "user",
        token: "access-token",
        otp: { isRequired: false, expiresIn: 0 },
      };
      mockLogin.mockResolvedValue(loginResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          username: "user",
          password: "password123",
        });
      });

      expect(mockLogin).toHaveBeenCalledWith({
        username: "user",
        password: "password123",
      });
      expect(mockSetAccessToken).toHaveBeenCalledWith("access-token");
    });
  });

  describe("useLogout", () => {
    it("calls logout API and clears tokens", async () => {
      mockLogout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate(undefined);
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(mockClearAuthTokens).toHaveBeenCalled();
    });
  });

  describe("useRegister", () => {
    it("calls register API and stores token on success", async () => {
      const registerResponse = {
        name: "New User",
        email: "new@example.com",
        username: "newuser",
        token: "new-token",
        otp: { isRequired: true, expiresIn: 3600 },
      };
      mockRegister.mockResolvedValue(registerResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          email: "new@example.com",
          password: "password123",
          name: "New User",
          username: "12345678901",
        });
      });

      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          password: "password123",
          name: "New User",
          username: "12345678901",
        })
      );
      expect(mockSetAccessToken).toHaveBeenCalledWith("new-token");
    });
  });

  describe("AuthLoader", () => {
    it("renders children when user is loaded", async () => {
      mockGetUser.mockResolvedValue({
        id: "1",
        name: "User",
        email: "user@example.com",
        username: "user",
      });

      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: { queries: { retry: false } },
            })
          }
        >
          <AuthLoader
            renderLoading={() => <div>Loading...</div>}
            renderError={() => <div>Error</div>}
          >
            <div>Content</div>
          </AuthLoader>
        </QueryClientProvider>
      );

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders error when authentication fails", async () => {
      mockGetUser.mockResolvedValue(null);

      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: { queries: { retry: false } },
            })
          }
        >
          <AuthLoader
            renderLoading={() => <div>Loading...</div>}
            renderError={() => <div>Auth Error</div>}
          >
            <div>Content</div>
          </AuthLoader>
        </QueryClientProvider>
      );

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      expect(screen.getByText("Auth Error")).toBeInTheDocument();
    });
  });

  describe("loginInputSchema", () => {
    it("validates valid login input", () => {
      const result = loginInputSchema.safeParse({
        username: "user",
        password: "password",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty username", () => {
      const result = loginInputSchema.safeParse({
        username: "",
        password: "password",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginInputSchema.safeParse({
        username: "user",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerInputSchema", () => {
    it("validates valid register input", () => {
      const result = registerInputSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        name: "User",
        username: "12345678901",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = registerInputSchema.safeParse({
        email: "invalid",
        password: "password123",
        name: "User",
        username: "12345678901",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = registerInputSchema.safeParse({
        email: "user@example.com",
        password: "12345",
        name: "User",
        username: "12345678901",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short username", () => {
      const result = registerInputSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        name: "User",
        username: "12345",
      });
      expect(result.success).toBe(false);
    });
  });
});
