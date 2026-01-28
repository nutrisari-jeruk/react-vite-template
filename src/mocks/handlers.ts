/**
 * MSW Mock API Handlers
 *
 * Mock responses for API endpoints during development.
 */

import { http, HttpResponse } from "msw";

// API base URL from config
const API_BASE_URL = "/api";

// Mock user database (in-memory, resets on refresh)
const mockUsers: Array<{
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}> = [
  {
    id: "1",
    username: "12345678910",
    email: "user@example.com",
    password: "password123",
    firstName: "Demo",
    lastName: "User",
  },
];

const mockTokens: Record<
  string,
  { accessToken: string; refreshToken: string; userId: string }
> = {};

// Helper to generate JWT-like tokens
function generateToken(userId: string, expiresIn: number = 3600000): string {
  const user = mockUsers.find((u) => u.id === userId);
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      username: user?.username,
      email: user?.email,
      iat: Date.now(),
      exp: Date.now() + expiresIn,
    })
  );
  return `${header}.${payload}.signature`;
}

// Helper to generate refresh token
function generateRefreshToken(): string {
  return `rt_${Math.random().toString(36).substring(2, 15)}`;
}

export const handlers = [
  // GET /auth/me - Get current user
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const tokenData = mockTokens[token];

    if (!tokenData) {
      return HttpResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === tokenData.userId);
    if (!user) {
      return HttpResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "User retrieved successfully",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }),

  // POST /auth/login - Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    const { username, password } = body as {
      username: string;
      password: string;
    };

    const user = mockUsers.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        {
          success: false,
          message: "Wrong credential",
          errors: {
            username: ["NIP / NIK yang Anda masukkan salah."],
            password: ["Kata sandi yang Anda masukkan salah."],
          },
        },
        { status: 422 }
      );
    }

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken();

    mockTokens[accessToken] = {
      accessToken,
      refreshToken,
      userId: user.id,
    };

    return HttpResponse.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  }),

  // POST /auth/register - Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json();
    const { email, password, firstName, lastName } = body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return HttpResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new user (generate username from email prefix)
    const newUser = {
      id: String(mockUsers.length + 1),
      username: email.split("@")[0],
      email,
      password,
      firstName,
      lastName,
    };
    mockUsers.push(newUser);

    const accessToken = generateToken(newUser.id);
    const refreshToken = generateRefreshToken();

    mockTokens[accessToken] = {
      accessToken,
      refreshToken,
      userId: newUser.id,
    };

    return HttpResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
    });
  }),

  // POST /auth/logout - Logout
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: "Logout successful",
    });
  }),

  // POST /auth/refresh - Refresh token
  http.post(`${API_BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = await request.json();
    const { refreshToken } = body as { refreshToken: string };

    // Find the access token associated with this refresh token
    const tokenEntry = Object.values(mockTokens).find(
      (t) => t.refreshToken === refreshToken
    );

    if (!tokenEntry) {
      return HttpResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === tokenEntry.userId);
    if (!user) {
      return HttpResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new tokens
    const newAccessToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken();

    // Remove old token entry and add new one
    delete mockTokens[tokenEntry.accessToken];
    mockTokens[newAccessToken] = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: user.id,
    };

    return HttpResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  }),

  // POST /v1/reset-password - Reset password
  http.post(`${API_BASE_URL}/v1/reset-password`, async ({ request }) => {
    const body = await request.json();
    const { username } = body as { username: string };

    // Check if user exists
    const user = mockUsers.find((u) => u.username === username);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          message: "User not found",
          errors: {
            username: ["NIP / NIK yang Anda masukkan tidak ditemukan."],
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Reset password",
      data: {
        otp: {
          isRequired: true,
          expiresIn: 3600,
        },
        resetToken: "abc123",
      },
    });
  }),

  // POST /v1/set-new-password - Set new password
  http.post(`${API_BASE_URL}/v1/set-new-password`, async ({ request }) => {
    const body = await request.json();
    const { resetToken, password, passwordConfirmation } = body as {
      resetToken: string;
      password: string;
      passwordConfirmation: string;
    };

    if (!resetToken) {
      return HttpResponse.json(
        {
          success: false,
          message: "Failed reset password",
          errors: {
            password: ["Token reset tidak valid."],
          },
        },
        { status: 422 }
      );
    }

    if (password !== passwordConfirmation) {
      return HttpResponse.json(
        {
          success: false,
          message: "Failed reset password",
          errors: {
            passwordConfirmation: ["Konfirmasi kata sandi tidak cocok."],
          },
        },
        { status: 422 }
      );
    }

    const passwordErrors: string[] = [];

    if (password.length < 8) {
      passwordErrors.push("Minimal 8 karakter");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Harus mengandung huruf besar");
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Harus mengandung huruf kecil");
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("Harus mengandung angka");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      passwordErrors.push("Harus mengandung simbol");
    }

    if (passwordErrors.length > 0) {
      return HttpResponse.json(
        {
          success: false,
          message: "Failed reset password",
          errors: { password: passwordErrors },
        },
        { status: 422 }
      );
    }

    const user = mockUsers.find((u) => u.id === "1");
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          message: "Failed reset password",
          errors: { password: ["Token reset tidak valid."] },
        },
        { status: 422 }
      );
    }

    user.password = password;

    return HttpResponse.json({
      success: true,
      message: "Reset password berhasil",
      data: null,
    });
  }),
];
