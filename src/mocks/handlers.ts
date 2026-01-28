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
  name: string;
}> = [
  {
    id: "1",
    username: "150596.0822.1",
    email: "john.doe@example.com",
    password: "password123",
    name: "John Doe",
  },
];

// Store active tokens
const mockTokens: Record<
  string,
  { token: string; userId: string; expiredAt: number }
> = {};

// Helper to generate JWT-like tokens
function generateToken(userId: string, expiresIn: number = 3600000): string {
  const user = mockUsers.find((u) => u.id === userId);
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      iat: Date.now(),
      exp: Date.now() + expiresIn,
    })
  );
  return `${header}.${payload}.signature`;
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
        name: user.name,
        email: user.email,
        username: user.username,
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

    const token = generateToken(user.id);
    const expiredAt = new Date(Date.now() + 3600000).toISOString();

    // Store token for /auth/me endpoint
    mockTokens[token] = {
      token,
      userId: user.id,
      expiredAt: Date.now() + 3600000,
    };

    return HttpResponse.json({
      success: true,
      message: "Login success",
      data: {
        name: user.name,
        email: user.email,
        username: user.username,
        token,
        otp: {
          isRequired: true,
          expiredAt,
        },
      },
    });
  }),

  // POST /auth/register - Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json();
    const { email, password, name, username } = body as {
      email: string;
      password: string;
      name: string;
      username?: string;
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
      username: username || email.split("@")[0],
      email,
      password,
      name,
    };
    mockUsers.push(newUser);

    const token = generateToken(newUser.id);
    const expiredAt = new Date(Date.now() + 3600000).toISOString();

    mockTokens[token] = {
      token,
      userId: newUser.id,
      expiredAt: Date.now() + 3600000,
    };

    return HttpResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        token,
        otp: {
          isRequired: true,
          expiredAt,
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
    const { token: currentToken } = body as { token: string };

    // Find the token entry
    const tokenEntry = Object.values(mockTokens).find(
      (t) => t.token === currentToken
    );

    if (!tokenEntry) {
      return HttpResponse.json(
        { success: false, message: "Invalid token" },
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

    // Generate new token
    const newToken = generateToken(user.id);
    const expiredAt = new Date(Date.now() + 3600000).toISOString();

    // Remove old token entry and add new one
    delete mockTokens[tokenEntry.token];
    mockTokens[newToken] = {
      token: newToken,
      userId: user.id,
      expiredAt: Date.now() + 3600000,
    };

    return HttpResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        expiredAt,
      },
    });
  }),
];
