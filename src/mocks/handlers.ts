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
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}> = [
  {
    id: "1",
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
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      email: mockUsers.find((u) => u.id === userId)?.email,
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
    const { email, password } = body as { email: string; password: string };

    const user = mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
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

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
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
];
