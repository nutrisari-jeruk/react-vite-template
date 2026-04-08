import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockGetAccessToken = vi.fn();
const mockGetRefreshToken = vi.fn();
const mockSetAccessToken = vi.fn();
const mockClearAuthTokens = vi.fn();

vi.mock("@/features/auth", () => ({
  getAccessToken: () => mockGetAccessToken(),
  getRefreshToken: () => mockGetRefreshToken(),
  setAccessToken: (...args: unknown[]) => mockSetAccessToken(...args),
  clearAuthTokens: () => mockClearAuthTokens(),
}));

vi.mock("@/config/env", () => ({
  env: {
    apiUrl: "http://test.api",
    apiTimeout: 5000,
  },
}));

vi.mock("@/config/constants", () => ({
  API_ENDPOINTS: {
    AUTH: {
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
    },
  },
}));

const originalLocation = window.location;

function createAxiosError(
  status: number,
  data: Record<string, unknown>,
  options: {
    headers?: Record<string, string>;
    code?: string;
    url?: string;
    config?: Record<string, unknown>;
  } = {}
) {
  const err = Object.assign(new Error(data.message as string), {
    isAxiosError: true,
    config: { url: options.url ?? "/test", headers: {}, ...options.config },
    response: {
      status,
      data,
      headers: options.headers || {},
    },
    code: options.code,
    ...options,
  });
  return err;
}

describe("API Client", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockGetAccessToken.mockReturnValue(null);
    mockGetRefreshToken.mockReturnValue(null);

    Object.defineProperty(window, "location", {
      value: { ...originalLocation, pathname: "/dashboard", href: "" },
      writable: true,
    });

    vi.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  describe("request interceptor", () => {
    it("injects Authorization header when token exists", async () => {
      mockGetAccessToken.mockReturnValue("test-token-123");

      const { api } = await import("../api-client");

      const adapter = vi.fn((config) => {
        expect(config.headers?.Authorization).toBe("Bearer test-token-123");
        return Promise.resolve({
          data: { success: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
      });

      await api.get("/users", { adapter });

      expect(mockGetAccessToken).toHaveBeenCalled();
    });

    it("does not inject Authorization header when no token", async () => {
      mockGetAccessToken.mockReturnValue(null);

      const { api } = await import("../api-client");

      const adapter = vi.fn((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return Promise.resolve({
          data: { success: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
      });

      await api.get("/users", { adapter });
    });

    it("injects X-Request-ID header", async () => {
      const { api } = await import("../api-client");

      const adapter = vi.fn((config) => {
        expect(config.headers?.["X-Request-ID"]).toBeDefined();
        expect(typeof config.headers?.["X-Request-ID"]).toBe("string");
        return Promise.resolve({
          data: { success: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
      });

      await api.get("/users", { adapter });
    });
  });

  describe("response error handling", () => {
    it("transforms 400/422 to ValidationError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi.fn().mockRejectedValue(
        createAxiosError(422, {
          message: "Invalid input",
          errors: { email: ["Invalid email format"] },
        })
      );

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).constructor.name).toBe("ValidationError");
        expect((error as Error).message).toBe("Invalid input");
        expect((error as { details?: unknown }).details).toEqual({
          email: ["Invalid email format"],
        });
      }
    });

    it("transforms 401 to UnauthorizedError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(
          createAxiosError(401, { message: "Session expired" })
        );

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("UnauthorizedError");
        expect((error as Error).message).toBe("Session expired");
      }
      expect(mockClearAuthTokens).toHaveBeenCalled();
    });

    it("transforms 403 to ForbiddenError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(createAxiosError(403, { message: "Access denied" }));

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("ForbiddenError");
        expect((error as Error).message).toBe("Access denied");
      }
    });

    it("transforms 404 to NotFoundError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(
          createAxiosError(404, { message: "Resource not found" })
        );

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("NotFoundError");
        expect((error as Error).message).toBe("Resource not found");
      }
    });

    it("transforms 409 to ConflictError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(
          createAxiosError(409, { message: "Resource conflict" })
        );

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("ConflictError");
        expect((error as Error).message).toBe("Resource conflict");
      }
    });

    it("transforms 429 to RateLimitError with retry-after", async () => {
      const { api } = await import("../api-client");

      const err = createAxiosError(
        429,
        { message: "Rate limited" },
        {
          headers: { "retry-after": "60" },
        }
      );
      const mockAdapter = vi.fn().mockRejectedValue(err);

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("RateLimitError");
        expect((error as { retryAfter?: number }).retryAfter).toBe(60);
      }
    });

    it("transforms 500 to ServerError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(createAxiosError(500, { message: "Server error" }));

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("ServerError");
        expect((error as Error).message).toBe("Server error");
      }
    });

    it("transforms 503 to ServiceUnavailableError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi
        .fn()
        .mockRejectedValue(
          createAxiosError(503, { message: "Service unavailable" })
        );

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe(
          "ServiceUnavailableError"
        );
        expect((error as Error).message).toBe("Service unavailable");
      }
    });

    it("transforms network error (no response) to NetworkError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: undefined,
        code: "ERR_NETWORK",
      });

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("NetworkError");
      }
    });

    it("transforms ECONNABORTED to TimeoutError", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: undefined,
        code: "ECONNABORTED",
      });

      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("TimeoutError");
      }
    });

    it("passes through non-axios errors unchanged", async () => {
      const { api } = await import("../api-client");
      const plainError = new Error("plain error");
      const mockAdapter = vi.fn().mockRejectedValue(plainError);
      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect(error).toBe(plainError);
      }
    });

    it("transforms unknown status code to generic Error with response message", async () => {
      const { api } = await import("../api-client");
      const mockAdapter = vi
        .fn()
        .mockRejectedValue(createAxiosError(418, { message: "I'm a teapot" }));
      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("I'm a teapot");
      }
    });

    it("transforms unknown status code using error.message when response has no message", async () => {
      const { api } = await import("../api-client");
      const err = createAxiosError(418, {});
      Object.assign(err, { message: "axios message" });
      const mockAdapter = vi.fn().mockRejectedValue(err);
      try {
        await api.get("/test", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).message).toBe("axios message");
      }
    });
  });

  describe("401 token refresh", () => {
    it("retries request with new token after successful refresh", async () => {
      mockGetRefreshToken.mockReturnValue("refresh-token");
      const { api } = await import("../api-client");
      let callCount = 0;
      api.defaults.adapter = vi.fn((config) => {
        callCount++;
        if (config.url?.includes("/auth/refresh") && config.method === "post") {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
              },
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        }
        if (callCount === 1) {
          return Promise.reject(
            createAxiosError(401, { message: "Session expired" })
          );
        }
        return Promise.resolve({
          data: { success: true, data: { id: 1 } },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
      });
      const response = await api.get("/users/1");
      expect(response.data).toEqual({ success: true, data: { id: 1 } });
      expect(mockSetAccessToken).toHaveBeenCalledWith("new-access-token");
    });

    it("clears tokens and redirects when refresh fails and pathname is not /login", async () => {
      mockGetRefreshToken.mockReturnValue("refresh-token");
      Object.defineProperty(window, "location", {
        value: { ...originalLocation, pathname: "/dashboard", href: "" },
        writable: true,
      });
      const { api } = await import("../api-client");
      api.defaults.adapter = vi.fn((config) => {
        if (config.url?.includes("/auth/refresh")) {
          return Promise.reject(new Error("Refresh failed"));
        }
        return Promise.reject(
          createAxiosError(401, { message: "Session expired" })
        );
      });
      try {
        await api.get("/users");
      } catch (error) {
        expect((error as Error).constructor.name).toBe("UnauthorizedError");
      }
      expect(mockClearAuthTokens).toHaveBeenCalled();
      expect(window.location.href).toBe("/login");
    });

    it("does not redirect when on /login page and refresh fails", async () => {
      mockGetRefreshToken.mockReturnValue("refresh-token");
      Object.defineProperty(window, "location", {
        value: { ...originalLocation, pathname: "/login", href: "" },
        writable: true,
      });
      const { api } = await import("../api-client");
      api.defaults.adapter = vi.fn((config) => {
        if (config.url?.includes("/auth/refresh")) {
          return Promise.reject(new Error("Refresh failed"));
        }
        return Promise.reject(
          createAxiosError(401, { message: "Session expired" })
        );
      });
      try {
        await api.get("/users");
      } catch (error) {
        expect((error as Error).constructor.name).toBe("UnauthorizedError");
      }
      expect(mockClearAuthTokens).toHaveBeenCalled();
      expect(window.location.href).toBe("");
    });

    it("does not redirect when 401 is from /auth/me endpoint", async () => {
      mockGetRefreshToken.mockReturnValue(null);
      Object.defineProperty(window, "location", {
        value: { ...originalLocation, pathname: "/dashboard", href: "" },
        writable: true,
      });
      const { api } = await import("../api-client");
      const mockAdapter = vi.fn().mockRejectedValue(
        createAxiosError(
          401,
          { message: "Unauthorized" },
          {
            config: { url: "/auth/me" },
          }
        )
      );
      try {
        await api.get("/auth/me", { adapter: mockAdapter });
      } catch (error) {
        expect((error as Error).constructor.name).toBe("UnauthorizedError");
      }
      expect(mockClearAuthTokens).toHaveBeenCalled();
      expect(window.location.href).toBe("");
    });
  });

  describe("request methods", () => {
    it("GET request succeeds", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi.fn().mockResolvedValue({
        data: { success: true, data: { id: 1, name: "Test" } },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await api.get("/users/1", { adapter: mockAdapter });

      expect(response.data).toEqual({
        success: true,
        data: { id: 1, name: "Test" },
      });
      expect(mockAdapter).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "get",
          url: "/users/1",
        })
      );
    });

    it("POST request succeeds", async () => {
      const { api } = await import("../api-client");

      const mockAdapter = vi.fn().mockResolvedValue({
        data: { success: true },
        status: 201,
        statusText: "Created",
        headers: {},
        config: {},
      });

      const body = { email: "test@example.com", name: "Test" };
      await api.post("/users", body, { adapter: mockAdapter });

      const callConfig = mockAdapter.mock.calls[0][0];
      expect(callConfig.method).toBe("post");
      expect(callConfig.url).toBe("/users");
      expect(
        typeof callConfig.data === "string"
          ? JSON.parse(callConfig.data)
          : callConfig.data
      ).toEqual(body);
    });
  });
});
