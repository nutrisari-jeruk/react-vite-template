import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUser,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  refreshToken,
  resetPassword,
  setNewPassword,
  verifyOtp,
  resendOtp,
  resendResetPasswordOtp,
  validateResetPasswordOtp,
} from "../auth-api";

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const mockGetAccessToken = vi.fn();
const mockClearAuthTokens = vi.fn();

vi.mock("@/lib/api-client", () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
  },
}));

vi.mock("../../lib/token-storage", () => ({
  getAccessToken: () => mockGetAccessToken(),
  clearAuthTokens: () => mockClearAuthTokens(),
}));

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUser", () => {
    it("returns null when no access token", async () => {
      mockGetAccessToken.mockReturnValue(null);

      const result = await getUser();

      expect(result).toBeNull();
      expect(mockApiGet).not.toHaveBeenCalled();
    });

    it("returns user data when authenticated", async () => {
      mockGetAccessToken.mockReturnValue("token");
      mockApiGet.mockResolvedValue({
        data: {
          success: true,
          data: {
            id: "1",
            email: "user@example.com",
            username: "user",
            name: "User",
          },
        },
      });

      const result = await getUser();

      expect(result).toEqual({
        id: "1",
        email: "user@example.com",
        username: "user",
        name: "User",
      });
    });

    it("returns null when response data is empty", async () => {
      mockGetAccessToken.mockReturnValue("token");
      mockApiGet.mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getUser();

      expect(result).toBeNull();
    });

    it("returns null when user data missing required fields", async () => {
      mockGetAccessToken.mockReturnValue("token");
      mockApiGet.mockResolvedValue({
        data: {
          success: true,
          data: { id: "1" },
        },
      });

      const result = await getUser();

      expect(result).toBeNull();
    });

    it("returns null on 401 and clears tokens", async () => {
      mockGetAccessToken.mockReturnValue("token");
      const err = Object.assign(new Error("Unauthorized"), {
        status: 401,
        isAxiosError: false,
      });
      mockApiGet.mockRejectedValue(err);

      const result = await getUser();

      expect(result).toBeNull();
      expect(mockClearAuthTokens).toHaveBeenCalled();
    });

    it("rethrows non-auth errors", async () => {
      mockGetAccessToken.mockReturnValue("token");
      mockApiGet.mockRejectedValue(new Error("Network error"));

      await expect(getUser()).rejects.toThrow("Network error");
    });
  });

  describe("loginWithEmailAndPassword", () => {
    it("returns auth response on success", async () => {
      const authData = {
        name: "User",
        email: "user@example.com",
        username: "user",
        token: "access-token",
        otp: { isRequired: true, expiresIn: 75 },
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: authData },
      });

      const result = await loginWithEmailAndPassword({
        username: "user",
        password: "password123",
      });

      expect(result).toEqual(authData);
      expect(mockApiPost).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        { username: "user", password: "password123" }
      );
    });

    it("throws when no auth data received", async () => {
      mockApiPost.mockResolvedValue({
        data: { success: true, data: null },
      });

      await expect(
        loginWithEmailAndPassword({ username: "user", password: "pass" })
      ).rejects.toThrow("No auth data received");
    });
  });

  describe("registerWithEmailAndPassword", () => {
    it("returns auth response on success", async () => {
      const authData = {
        name: "New User",
        email: "new@example.com",
        username: "newuser",
        token: "access-token",
        otp: { isRequired: true, expiresIn: 3600 },
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: authData },
      });

      const result = await registerWithEmailAndPassword({
        email: "new@example.com",
        password: "password123",
        name: "New User",
        username: "newuser",
      });

      expect(result).toEqual(authData);
      expect(mockApiPost).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          email: "new@example.com",
          password: "password123",
          name: "New User",
          username: "newuser",
        })
      );
    });
  });

  describe("logout", () => {
    it("calls logout endpoint", async () => {
      mockApiPost.mockResolvedValue({ data: { success: true } });

      await logout();

      expect(mockApiPost).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout")
      );
    });
  });

  describe("refreshToken", () => {
    it("returns new tokens on success", async () => {
      const tokens = {
        accessToken: "new-access",
        refreshToken: "new-refresh",
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: tokens },
      });

      const result = await refreshToken("old-refresh");

      expect(result).toEqual(tokens);
      expect(mockApiPost).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        { refreshToken: "old-refresh" }
      );
    });

    it("throws when no token data received", async () => {
      mockApiPost.mockResolvedValue({
        data: { success: true, data: null },
      });

      await expect(refreshToken("token")).rejects.toThrow(
        "No token data received"
      );
    });
  });

  describe("resetPassword", () => {
    it("returns reset password response on success", async () => {
      const response = {
        otp: { isRequired: true, expiresIn: 5 },
        resetToken: "abc123",
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: response },
      });

      const result = await resetPassword({ username: "12345678910" });

      expect(result).toEqual(response);
      expect(mockApiPost).toHaveBeenCalledWith(
        expect.stringContaining("reset-password"),
        { username: "12345678910" }
      );
    });
  });

  describe("setNewPassword", () => {
    it("returns success response when data is null", async () => {
      mockApiPost.mockResolvedValue({
        data: { success: true, message: "Success", data: null },
      });

      const result = await setNewPassword({
        resetToken: "abc123",
        password: "NewPass123!",
        passwordConfirmation: "NewPass123!",
      });

      expect(result).toBeNull();
    });

    it("throws when response data is undefined", async () => {
      mockApiPost.mockResolvedValue({
        data: { success: true },
      });

      await expect(
        setNewPassword({
          resetToken: "abc",
          password: "Pass123!",
          passwordConfirmation: "Pass123!",
        })
      ).rejects.toThrow("No set new password response received");
    });
  });

  describe("verifyOtp", () => {
    it("returns verification response", async () => {
      const response = {
        success: true,
        message: "Verified",
        token: "new-token",
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: response },
      });

      const result = await verifyOtp({ otp: "123456" });

      expect(result).toEqual(response);
    });
  });

  describe("resendOtp", () => {
    it("returns resend response", async () => {
      const response = {
        success: true,
        message: "Resent",
        expiresIn: 75,
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: response },
      });

      const result = await resendOtp();

      expect(result).toEqual(response);
    });
  });

  describe("resendResetPasswordOtp", () => {
    it("returns resend response", async () => {
      const response = {
        otp: { isRequired: true, expiresIn: 10 },
      };
      mockApiPost.mockResolvedValue({
        data: { success: true, data: response },
      });

      const result = await resendResetPasswordOtp({
        purpose: "password_reset",
        identifier: "12345678910",
      });

      expect(result).toEqual(response);
    });
  });

  describe("validateResetPasswordOtp", () => {
    it("returns identifier (reset token) on success", async () => {
      mockApiPost.mockResolvedValue({
        data: { success: true, data: { identifier: "reset-token-123" } },
      });

      const result = await validateResetPasswordOtp({
        otp: "123456",
        purpose: "password_reset",
        identifier: "12345678910",
      });

      expect(result).toEqual({ identifier: "reset-token-123" });
    });
  });
});
