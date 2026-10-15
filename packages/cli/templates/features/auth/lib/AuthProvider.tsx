import { configureAuth } from "react-query-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { QUERY_KEYS } from "@/config/constants";
import { UnauthorizedError } from "@/libs/apiError";
import {
  getAccessToken,
  getSessionVersion,
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
} from "@/libs/tokenStorage";
import {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from "../api/authApi";
import type { AuthResponse } from "../api/authApi";
import type { User } from "../types/user";

// Validation schemas
export const loginInputSchema = z.object({
  username: z.string().min(1, "NIP / NIK wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const registerInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(11, "Employee Number is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;

export type AuthResult =
  | { status: "authenticated"; user: User }
  | { status: "otp-required"; expiresIn: number };

async function loadSessionUser(): Promise<User | null> {
  if (sessionStorage.getItem("otp_pending")) return null;
  const version = getSessionVersion();
  const user = await getUser();
  return version === getSessionVersion() ? user : null;
}

const configured = configureAuth<User | null, Error, LoginInput, RegisterInput>(
  {
    userKey: QUERY_KEYS.AUTH.USER,
    userFn: loadSessionUser,
    loginFn: async (data) => {
      const version = getSessionVersion();
      const result = await completeLogin(
        await loginWithEmailAndPassword(data),
        version
      );
      return result.status === "authenticated" ? result.user : null;
    },
    registerFn: async (data) => {
      const version = getSessionVersion();
      const result = await completeLogin(
        await registerWithEmailAndPassword(data),
        version
      );
      return result.status === "authenticated" ? result.user : null;
    },
    logoutFn: () => logout(),
  }
);
export const { useUser, AuthLoader } = configured;

async function completeLogin(
  response: AuthResponse,
  version: number
): Promise<AuthResult> {
  if (version !== getSessionVersion())
    throw new UnauthorizedError("Session changed.");
  setAccessToken(response.token);
  if (response.refreshToken) setRefreshToken(response.refreshToken);
  if (response.otp.isRequired) {
    sessionStorage.setItem("otp_pending", "true");
    return { status: "otp-required", expiresIn: response.otp.expiresIn };
  }
  sessionStorage.removeItem("otp_pending");
  const user = await loadSessionUser();
  if (!user) throw new UnauthorizedError("Unable to load authenticated user.");
  return { status: "authenticated", user };
}

function useSessionMutation<Input>(
  request: (input: Input) => Promise<AuthResponse>
) {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (input: Input) => {
      await client.cancelQueries();
      clearAuthTokens();
      client.removeQueries();
      client.setQueryData(QUERY_KEYS.AUTH.USER, null);
      const version = getSessionVersion();
      return completeLogin(await request(input), version);
    },
    onSuccess: (result: AuthResult) => {
      client.setQueryData(
        QUERY_KEYS.AUTH.USER,
        result.status === "authenticated" ? result.user : null
      );
    },
  });
}

export function useLogin() {
  return useSessionMutation(loginWithEmailAndPassword);
}
export function useRegister() {
  return useSessionMutation(registerWithEmailAndPassword);
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (_input: undefined) => {
      void _input;
      const token = getAccessToken();
      // Invalidate refresh immediately, before any asynchronous work.
      clearAuthTokens();
      await client.cancelQueries();
      client.removeQueries();
      client.setQueryData(QUERY_KEYS.AUTH.USER, null);
      await logout(token);
    },
  });
}
