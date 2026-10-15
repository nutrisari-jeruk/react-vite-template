import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QUERY_KEYS } from "@/config/constants";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/libs/tokenStorage";
import {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from "../api/authApi";
import {
  useUser,
  useLogin,
  useRegister,
  useLogout,
  loginInputSchema,
  registerInputSchema,
} from "./AuthProvider";

vi.mock("../api/authApi", () => ({
  getUser: vi.fn(),
  loginWithEmailAndPassword: vi.fn(),
  registerWithEmailAndPassword: vi.fn(),
  logout: vi.fn(),
}));
const user = {
  id: "backend-42",
  name: "User",
  username: "12345678901",
  email: "u@example.com",
};
const input = { username: user.username, password: "password123" };
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}
beforeEach(() => {
  vi.resetAllMocks();
  clearAuthTokens();
  vi.mocked(getUser).mockResolvedValue(user);
});
describe("authentication lifecycle", () => {
  it("loads the backend user under the shared query key", async () => {
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.data?.id).toBe("backend-42"));
    expect(client.getQueryData(QUERY_KEYS.AUTH.USER)).toEqual(user);
  });
  it("returns null for an anonymous session", async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    const { wrapper } = setup();
    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
  it("login stores token and takes user identity from /me", async () => {
    vi.mocked(loginWithEmailAndPassword).mockResolvedValue({
      ...user,
      token: "access",
      refreshToken: "refresh-from-backend",
      otp: { isRequired: false, expiresIn: 0 },
    });
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      expect(await result.current.mutateAsync(input)).toEqual({
        status: "authenticated",
        user,
      });
    });
    expect(getAccessToken()).toBe("access");
    expect(getRefreshToken()).toBe("refresh-from-backend");
    expect(client.getQueryData(QUERY_KEYS.AUTH.USER)).toEqual(user);
  });
  it("registration requiring OTP does not publish a user", async () => {
    vi.mocked(registerWithEmailAndPassword).mockResolvedValue({
      ...user,
      token: "pending",
      otp: { isRequired: true, expiresIn: 75 },
    });
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useRegister(), { wrapper });
    await act(async () => {
      expect(
        await result.current.mutateAsync({
          ...input,
          name: user.name,
          email: user.email,
        })
      ).toEqual({ status: "otp-required", expiresIn: 75 });
    });
    expect(sessionStorage.getItem("otp_pending")).toBe("true");
    expect(getUser).not.toHaveBeenCalled();
    expect(client.getQueryData(QUERY_KEYS.AUTH.USER)).toBeNull();
  });
  it("pending OTP stays anonymous when user query mounts", async () => {
    sessionStorage.setItem("otp_pending", "true");
    const { wrapper } = setup();
    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
    expect(getUser).not.toHaveBeenCalled();
  });
  it("logout clears local session and cached data even when the server fails", async () => {
    setAccessToken("access");
    sessionStorage.setItem("reset_password_token", "reset");
    vi.mocked(logout).mockRejectedValue(new Error("offline"));
    const { client, wrapper } = setup();
    client.setQueryData(["private"], { secret: true });
    const { result } = renderHook(() => useLogout(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync(undefined)).rejects.toThrow(
        "offline"
      );
    });
    expect(getAccessToken()).toBeNull();
    expect(sessionStorage.getItem("reset_password_token")).toBeNull();
    expect(client.getQueryData(["private"])).toBeUndefined();
    expect(client.getQueryData(QUERY_KEYS.AUTH.USER)).toBeNull();
    expect(logout).toHaveBeenCalledWith("access");
  });
  it("an in-flight login cannot restore a logged-out session", async () => {
    let finish!: (
      response: Awaited<ReturnType<typeof loginWithEmailAndPassword>>
    ) => void;
    vi.mocked(loginWithEmailAndPassword).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const { wrapper } = setup();
    const { result } = renderHook(() => useLogin(), { wrapper });
    let pending!: Promise<unknown>;
    act(() => {
      pending = result.current.mutateAsync(input);
    });
    await waitFor(() => expect(loginWithEmailAndPassword).toHaveBeenCalled());
    clearAuthTokens();
    await act(async () => {
      finish({
        ...user,
        token: "late",
        otp: { isRequired: false, expiresIn: 0 },
      });
      await expect(pending).rejects.toThrow("Session changed");
    });
    expect(getAccessToken()).toBeNull();
  });
  it("validates login and registration inputs", () => {
    expect(loginInputSchema.safeParse(input).success).toBe(true);
    expect(loginInputSchema.safeParse({ ...input, password: "" }).success).toBe(
      false
    );
    expect(
      registerInputSchema.safeParse({
        ...input,
        name: user.name,
        email: user.email,
      }).success
    ).toBe(true);
    expect(
      registerInputSchema.safeParse({ ...input, name: "", email: "invalid" })
        .success
    ).toBe(false);
  });
});
